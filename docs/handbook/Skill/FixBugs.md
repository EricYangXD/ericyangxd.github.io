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
