---
title: 记录一些遇到的问题及解决方案
author: EricYangXD
date: "2022-05-05"
---

## 详解 Provisional headers are shown...

一次线上老项目更换新域名时，遇到一个问题，任意打开 PDF 文件一次之后，所有的 PDF 居然都不能正常预览了。预览 PDF 使用的是 iframe 借助 Chrome 原生的能力实现的，项目中并未直接引用到 pdf.js 等库。域名由`https://test.abc.com`更换为`https://test.web.abc.com`。而这个项目年代有些久远，是使用`react boilerplate`搭建的，里面还用到了 Backbone，这是前提。

打开控制台后，发现请求 pdf 文件的接口的 status code 显示`200（from service worker）`，request headers 有黄色三角叹号并提示`Provisional headers are shown...`(显示临时的标头，禁用缓存以查看完整的标头)，然后看 response 中返回的居然是 index.html，这直接导致预览 PDF 的弹框显示的内容变成了首页，也就是套娃了。

经过和运维排查，NGINX 配置没问题，该做的跨域、转发等配置都是正确的，而奇怪的是我们把这个 PDF 的链接拷到浏览器的新标签页中是可以正常预览的，这无疑更排除了后端和运维出错的可能，那么问题只能出在前端了，虽然前端代码一个字母也没改，虽然没换域名之前一切正常，虽然其他功能也一切正常，但是「就是前端的问题」。

那么到底是什么问题呢？我们先把目光放到了`Provisional headers are shown...`这里，先解释一下为啥会报这个：

这个问题字面意思是“显示了临时报文头”，浏览器第一次发送这个请求，请求被阻塞，未收到响应。当要求浏览器再次发送这个请求时，上个同样的请求都还没有收到响应，浏览器就会报这个警告。简而言之，就是「请求并没有发出去」。

为什么会出现这个问题呢？网上有前辈总结了以下这些情况：

1. 跨域请求被浏览器拦截
   - 显然跟我们的情况不符，我们的跨域是通的
2. 服务器未及时响应（超时）

- 后端查看了日志，根本没收到请求

3.  请求被浏览器插件拦截

- 浏览器没装插件也不行

4. 该数据直接采用了缓存，并没有发送请求
   - 看来只有这一种可能，因为 http 状态码那里返回的是`200（from service worker）`

正常来说，`200（from disk/memory cache）`是命中强缓存的返回，那么`200（from service worker）`这个又是什么呢？

带着疑问谷歌一番:

- 三级缓存原理:

1. 先查找内存，如果内存中存在，从内存中加载；
2. 如果内存中未查找到，选择硬盘获取，如果硬盘中有，从硬盘中加载；
3. 如果硬盘中未查找到，那就进行网络请求；
4. 加载到的资源缓存到硬盘和内存；

- HTTP 状态码及区别

1. `200 / 200 OK`:首次加载或不使用缓存，直接从服务器下载最新资源。
2. `200 OK (form memory cache)`:不访问服务器，一般已经加载过该资源且缓存在了内存当中，直接从内存中读取缓存。浏览器关闭后，数据将不存在（资源被释放掉了），再次打开相同的页面时，不会出现 from memory cache。
3. `200 OK (from disk cache)`:不访问服务器，已经在之前的某个时间加载过该资源，直接从硬盘中读取缓存，关闭浏览器后，数据依然存在，此资源不会随着该页面的关闭而释放掉下次打开仍然会是 from disk cache。
4. `200 OK (from service worker)`:不访问服务器，这个东西其实本质上是服务器和客户端之间的代理服务，一般我们在使用 React 开发的时候，会发现在根目录出现了一个`server-worker.js`文件，这个东西就是和 Service Worker 缓存相关的，它会根据网络的状态做出不同的缓存策略，有时候断网了，之前访问过的接口有可能依然会返回数据，其数据来源就是从其缓存中读取。
5. `200 OK (from push cache)`:是指 HTTP2 在 server push 阶段存在的缓存。
   - Push Cache 是缓存的最后一道防线。浏览器只有在 Memory Cache、HTTP Cache 和 Service Worker Cache 均未命中的情况下才会去询问 Push Cache。
   - Push Cache 是一种存在于会话阶段的缓存，当 session 终止时，缓存也随之释放。
   - 不同的页面只要共享了同一个 HTTP2 连接，那么它们就可以共享同一个 Push Cache。
6. `304 Not Modified`:访问服务器，发现数据没有更新，服务器返回此状态码。然后从缓存中读取数据。

通常出现强缓存，一般是 Nginx 配置有问题，可以通过增加`add_header Cache-Control no-cache;`（http1.1)来解决。对于 http1.0 需增加设置 Pragma。

也就是说，通过上面的内容，我们可以确定问题就是由于缓存导致的，而且这种缓存很明显是`200 OK (from service worker)`即 service worker 缓存。

那么下一步很明显，我们只需要把代码里的 service worker 关闭并移除就行了。前面提到了，这个项目是由`react boilerplate`搭建的，经过全局搜索查找发现，该项目里并没有像新的 CRA 脚手架那样单独引入一个 service-worker.js 文件来开启离线缓存，而是使用了一个叫做`offline-plugin`的插件来实现本地离线缓存，所以我们在 webpack 代码里移除了这个插件，并在 app.js 里进行了手动取消注册 service worker 的操作，如下：

```js
try {
	if (window.navigator && navigator.serviceWorker) {
		navigator.serviceWorker.getRegistrations().then(function (registrations) {
			for (let registration of registrations) {
				registration.unregister();
			}
		});
	}
} catch (e) {
	console.log("unregister sw: ", e);
}
```

然后重新打包上线，经过测试，发现之前没有用新域名登陆过的电脑/浏览器均可以正常加载预览 PDF，而对于已经访问过新域名并尝试过预览 PDF 的浏览器，我们给出的解决方案是手动清除缓存：

- 第 1 步.「F12」或「右键-->检查」打开开发模式；
- 第 2 步. 在「浏览器刷新按钮」上右键选择「清空缓存并硬性重新加载」；

完成上述操作后，即可正常使用系统并预览 PDF 了。

## 大多数人都会遇到的几个 H5 坑

### ios 端兼容 input 光标高度

问题详情描述：

> input 输入框光标，在安卓手机上显示没有问题，但是在苹果手机上 当点击输入的时候，光标的高度和父盒子的高度一样。例如下图，左图是正常所期待的输入框光标，右边是 ios 的 input 光标。

出现原因分析：

> 通常我们习惯用 height 属性设置行间的高度和 line-height 属性设置行间的距离（行高），当点击输入的时候，光标的高度就自动和父盒子的高度一样了。（谷歌浏览器的设计原则，还有一种可能就是当没有内容的时候光标的高度等于 input 的 line-height 的值，当有内容时，光标从 input 的顶端到文字的底部)

解决办法：高度 height 和行高 line-height 内容用 padding 撑开

```css
.content {
	float: left;
	box-sizing: border-box;
	height: 88px;
	width: calc(100% - 240px);
	input {
		display: block;
		box-sizing: border-box;
		width: 100%;
		color: #333;
		font-size: 28px;
		/* line-height: 88px; */
		padding-top: 20px;
		padding-bottom: 20px;
	}
}
```

### ios 端上下滑动时卡顿、页面缺失

问题详情描述：

> 在 ios 端，上下滑动页面时，如果页面高度超出了一屏，就会出现明显的卡顿，页面有部分内容显示不全的情况

出现原因分析：

> 笼统说微信浏览器的内核，Android 上面是使用自带的 WebKit 内核，iOS 里面由于苹果的原因，使用了自带的 Safari 内核，Safari 对于 overflow-scrolling 用了原生控件来实现。对于有-webkit-overflow-scrolling 的网页，会创建一个 UIScrollView，提供子 layer 给渲染模块使用

解决办法：只需要在公共样式加入下面这行代码

```css
* {
	-webkit-overflow-scrolling: touch;
}
```

But，这个属性是有 bug 的，比如如果你的页面中有设置了绝对定位的节点，那么该节点的显示会错乱，当然还有会有其他的一些 bug。

- `-webkit-overflow-scrolling` 属性控制元素在移动设备上是否使用滚动回弹效果
  - auto: 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。
  - touch: 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。

### ios 键盘唤起后收起页面不归位

问题详情描述：

> 输入内容，软键盘弹出，页面内容整体上移，但是键盘收起，页面内容不下滑

出现原因分析：

> 固定定位的元素 在元素内 input 框聚焦的时候 弹出的软键盘占位 失去焦点的时候软键盘消失 但是还是占位的 导致 input 框不能再次输入 在失去焦点的时候给一个事件

解决办法：

```vue
<template>
	<div class="list-warp">
		<div class="title">
			<span>投·被保险人姓名</span>
		</div>
		<div class="content">
			<input
				class="content-input"
				placeholder="请输入姓名"
				v-model="peopleList.name"
				@focus="changefocus()"
				@blur.prevent="changeBlur()"
			/>
		</div>
	</div>
</template>

<script lang="ts">
changeBlur(){
  let u = navigator.userAgent, app = navigator.appVersion;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if(isIOS){
    setTimeout(() => {
      const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
      window.scrollTo(0, Math.max(scrollHeight - 1, 0))
    }, 200)
  }
}
</script>
```

拓展知识：

> position: fixed 的元素在 ios 里，收起键盘的时候会被顶上去，特别是第三方键盘

### 安卓弹出的键盘遮盖文本框

问题详情描述：

> 安卓微信 H5 弹出软键盘后挡住 input 输入框

解决办法：

> 给 input 和 textarea 标签添加 focus 事件，如下，先判断是不是安卓手机下的操作，当然，可以不用判断机型，Document 对象属性和方法，setTimeout 延时 0.5 秒，因为调用安卓键盘有一点迟钝，导致如果不延时处理的话，滚动就失效了

```js
changefocus(){
  let u = navigator.userAgent, app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  if(isAndroid){
    setTimeout(function() {
      document.activeElement.scrollIntoViewIfNeeded();
      document.activeElement.scrollIntoView();
    }, 500);
  }
}
```

拓展知识：

> Element.scrollIntoView()方法让当前的元素滚动到浏览器窗口的可视区域内。而 Element.scrollIntoViewIfNeeded()方法也是用来将不在浏览器窗口的可见区域内的元素滚动到浏览器窗口的可见区域。但如果该元素已经在浏览器窗口的可见区域内，则不会发生滚动

### 路由使用 hash 模式 ios 分享页面异常

问题详情描述：

> (Vue 中路由使用 hash 模式，开发微信 H5 页面分享时在安卓上设置分享成功，但是 ios 的分享异常,)ios 当前页面分享给好友，点击进来是正常，如果二次分享，则跳转到首页；使用 vue router 跳转到第二个页面后在分享时，分享设置失败；以上安卓分享都是正常

出现原因分析：

> jssdk 是后端进行签署，前端校验，但是有时跨域，ios 是分享以后会自动带上 from=singlemessage&isappinstalled=0 以及其他参数，分享朋友圈参数还不一样，貌似系统不一样参数也不一样，但是每次获取 url 并不能获取后面这些参数

解决办法：

> 可以使用改页面 this.$router.push 跳转为 window.location.href 去跳转，而不使用路由跳转，这样可以使地址栏的地址与当前页的地址一样，可以分享成功（适合分享的页面不多的情况下)

### 邮箱页面布局

大多数人看到过手机或者qq网易等等各种邮箱。有的莫名其妙的邮件收件箱看到的页面全是裂图，邮箱页面布局要写原始table布局法

### Angular中使用material-design

#### 分页

1. paginator初始化时机
2. paginator实例的length能否直接修改赋值
3. 不使用paginator也可以正常分页
4. html中`[length]`属性控制总数

```js
// .html
<mat-paginator [length]="100"
               [pageSize]="10"
							 (page)="onPageChange($event)"
               [pageSizeOptions]="[5, 10, 25, 100]">
</mat-paginator>
// .ts
import {Component, AfterViewInit} from '@angular/core';

/**
 * @title Paginator
 */
@Component({
  selector: 'paginator-overview-example',
  templateUrl: 'paginator-overview-example.html',
  styleUrls: ['paginator-overview-example.css'],
})
export class PaginatorOverviewExample implements AfterViewInit{
	ngAfterViewInit() {
		// 可以在这里初始化资源，但是貌似没用。。。
    this.dataSource.paginator = this.paginator;
  }
	// 可以用来接收分页变化时的参数信息
	onPageChange(e: PageEvent){
		console.log(e);
	}
}
```

#### 排序

1. sorter实例初始化

```js
// .html
<table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">

  <!-- Position Column -->
  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> No. </th>
    <td mat-cell *matCellDef="let element"> {{element.position}} </td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container matColumnDef="weight">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Weight </th>
    <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
  </ng-container>

  <!-- Symbol Column -->
  <ng-container matColumnDef="symbol">
    <th mat-header-cell *matHeaderCellDef mat-sort-header> Symbol </th>
    <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>

// .ts
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Table with sorting
 */
@Component({
  selector: 'table-sorting-example',
  styleUrls: ['table-sorting-example.css'],
  templateUrl: 'table-sorting-example.html',
})
export class TableSortingExample implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
}
```