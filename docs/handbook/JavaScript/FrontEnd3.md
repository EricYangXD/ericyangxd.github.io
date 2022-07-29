---
title: 记录一些前端知识(3)
author: EricYangXD
date: "2022-06-24"
meta:
  - name: keywords
    content: 前端监控,上报
---

## 前端监控上报数据

重点解析在 **页面实例关闭** 时，如何将监控数据上传到服务端的解决方案。涉及到 4 种方案，分别为：

- 同步`XMLHttpRequest`
- `img.src`
- `navigator.sendBeacon`
- `fetch keepalive`

### 同步 XMLHttpRequest

已废弃。

为什么同步 XMLHttpRequest 可以在页面关闭时上传数据？同步请求阻止代码的执行，这会导致屏幕上出现“冻结”和无响应的用户体验。

缺点:

- 用户体验差，会阻塞页面切换
- 只有旧版的浏览器支持 Chrome<80
- 无法读取 reponse 的返回值

### img.src

创建一个`<img>`元素，并设置`src`。大部分的浏览器，都会延迟卸载当前页面，优先加载图像。

```js
var data = JSON.stringify({
	time: performance.now(),
});

const img = new Image();
img.src = `http://api.wangxiaokai.vip/test?${JSON.stringify(data)}`;
```

缺点:

- 数据传输不可靠，有可能浏览器卸载当前页面，直接杀掉图像请求
- 只能发起 GET 请求
- 数据大小有限制

### navigator.sendBeacon

通过 HTTP POST 请求，将少量数据使用异步的方式，发送到服务端。

```js
function reportEvent() {
	const url = "http://api.wangxiaokai.vip/test";
	const data = JSON.stringify({
		time: performance.now(),
	});

	navigator.sendBeacon(url, data);
}

document.addEventListener("visibilitychange", function () {
	if (document.visiblityState === "hidden") {
		reportEvent();
	}
});
```

1. 浏览器端自动判断合适的时机进行发送。
2. 不会产生阻塞，影响当前页面的卸载。
3. 不影响下个新页面的加载，不存在性能问题。
4. 另外，数据传输可靠。
5. 当浏览器将数据成功加入传输队列时，sendBeacon 方法会返回 true，否则返回 false。注意返回值的时机：成功加入传输队列，而不是服务端的处理成功后的返回。

缺点:

- 只能发起 POST 请求
- 无法自定义请求头参数
- 数据大小有限制 （Chrome 限制大小为 64kb）
- 只能在 window 事件 visibilitychange 和 beforeunload 中使用，其他事件中回调，会丢失数据

> 出于兼容性原因，请确保使用 document.addEventListener 而不是 window.addEventListener 来注册`visibilitychange`回调。

### fetch keepalive

> The keepalive option can be used to allow the request to outlive the page. Fetch with the keepalive flag is a replacement for the Navigator.sendBeacon() API.
> keepalive 选项可用来允许一个请求在页面关闭后继续存在。带 keepalive 标志的 Fetch 可以替代 Navigator.sendBeacon() API。

标记 keepalive 的 fetch 请求允许在页面卸载后执行。

```js
const url = "http://api.wangxiaokai.vip/test";
const data = JSON.stringify({
	time: performance.now(),
});

fetch(url, {
	method: "POST",
	body: data,
	headers: {
		"Content-Type": "application/json",
	},
	keepalive: true,
});
```

## undefined

不要再直接写 undefined，因为可以局部也起一个叫 undefined 的变量并给它赋值，如果此时用到了 undefined，那么可能出现 bug。示例如下：

```js
function test(value) {
	let undefined = "hello world";
	if (value === undefined) {
		return `value is undefined`;
	}
	return `value is not undefined`;
}
let value;
test(value); // 'value is not undefined'
```

推荐的做法：使用`void 0`或`void(0)`代替`undefined`。

void 运算符是对给定的表达式进行求值，然后返回 undefined 。而且， void 是不能重新定义的，不然会报语法错误，这样也保证了用 void 来代替 undefined 的不会出现被重定义而造成的 bug。

## js 判断图片是否被缓存

```js
/**
 url 测试图片路径
 被缓存返回true，没被缓存返回false
 */
function testCache(url) {
	alert("执行");
	var url = "http://www.8chedao.com/page/images/webIndex-logo.png";
	var myImg = new Image();
	myImg.src = url;
	if (myImg.complete) {
		alert("图片被缓存");
		return true;
	} else {
		alert("图片没被缓存");
		myImg.onload = function () {
			alert("图片已经下载成功!");
		};
		return false;
	}
}
```

## 正则-捕获组

```javascript
const str = "2022-07";
const reg = /(?<year>[0-9]{4})-(?<month>[0-9]{2})/;

const group = str.match(reg).groups;

console.log(group.year);
```
