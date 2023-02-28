---
title: 记录一些前端知识(3)
author: EricYangXD
date: "2022-06-24"
meta:
  - name: keywords
    content: 前端监控,上报,常识
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

## css 中 html 和 body 的区别

1. 在 html 中，`<html>`包含`<body>`
2. 在 html 文档中，`<html>`是根元素。
3. 在 css 中有一个`:root`选择器，和`html`选择器作用一样，甚至`:root`具有更高的优先级！
4. 以下内联属性 Inline Attribute 最初在规范 spec 中分配给了`<body>`：`background`、`bgcolor`、`marginbottom`、`marginleft`、`marginright`、`margintop`、`text`
5. 相应的 CSS 属性：`background`、`background/background-color`、`margin-bottom`、`margin-left`、`margin-right`、`margin-top`、`font`
6. `rem` 单位是相对于文档根目录的。是相对于 `<html>` 元素的字体大小的。
7. 如何将 `<html>` 上的字体大小设置为百分比，以便在使用 rem 单位时用作重置:[1](http://snook.ca/archives/html_and_css/font-size-with-rem)
8. 在 body 上设置`background-color`，
9. 在 html 上设置`background-color`，
10. JavaScript 也存在差异。例如，html 是 `document.rootElement`，body 是 `document.body`。
11. body 元素实际上没有浏览器窗口那么高。它只和里面的内容一样高，就像 div 或其他任何东西一样。所以在 body 上设置 background 时要特别注意，背景有可能撑不起来：如果 html 元素没有背景，body 背景将覆盖页面。如果 html 元素上有背景，则 body 背景的行为与任何其他元素一样。所以背景色要么设置在 html 上，要么给 body 设置一个高度，以防万一。
12. 将基本字体大小定义为 62.5%，以便以类似于使用 px 的方式方便地调整 rems 大小。

```css
/* 不考虑兼容性 */
html {
	font-size: 62.5%;
}
body {
	font-size: 1.4rem;
} /* =14px */
h1 {
	font-size: 2.4rem;
} /* =24px */

/* 考虑兼容性 */
html {
	font-size: 62.5%;
}
body {
	font-size: 14px;
	font-size: 1.4rem;
} /* =14px */
h1 {
	font-size: 24px;
	font-size: 2.4rem;
} /* =24px */
```

13. 关键在于区分那些属性是可覆盖的，然后设置在不同的标签上

## Why Not Iframe

为什么不用 iframe，这几乎是所有微前端方案第一个会被 challenge 的问题。但是大部分微前端方案又不约而同放弃了 iframe 方案，自然是有原因的，并不是为了 "炫技" 或者刻意追求 "特立独行"。

如果不考虑体验问题，iframe 几乎是最完美的微前端解决方案了。

iframe 最大的特性就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。但他的最大问题也在于他的隔离性无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题。

- url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
- UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中。
- 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免- 登效果。
- 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

其中有的问题比较好解决(问题 1)，有的问题我们可以睁一只眼闭一只眼(问题 4)，但有的问题我们则很难解决(问题 3)甚至无法解决(问题 2)，而这些无法解决的问题恰恰又会给产品带来非常严重的体验问题， 最终导致我们舍弃了 iframe 方案。

## 为 iframe 正名

## JavaScript 深拷贝性能分析

### 引用传值

```javascript
function mutate(obj) {
	obj.a = true;
}

const obj = { a: false };
mutate(obj);
console.log(obj.a); // 输出 true
```

1. 对于基本类型，是进行值传递；对于引用类型，传递的是这个对象的指针。
2. 在值传递的场景中，函数的形参只是实参的一个副本 ——a copy—— 当函数调用完成后，并不改变实参。但是在 JavaScript 这种引用传递的场景中，函数的形参和实参指向同一个对象，当参数内部改变形参的时候，函数外面的实参也被改变了。

### 浅拷贝：Object.assign ()

```javascript
function mutateDeepObject(obj) {
	obj.a.thing = true;
}

const obj = { a: { thing: false } };
const copy = Object.assign({}, obj);
mutateDeepObject(copy);
console.log(obj.a.thing); // prints true

const a = { a: 1, b: 2, c: 3, d: { e: 5 } };
const b = { ...a };
console.log(b.d.e); // 5
b.d.e = 8;
console.log(a.d.e); // 8
```

1. `Object.assign(target, sources...)`。它接受任意数量的源对象，枚举它们的所有属性并分配给 target。如果我们使用一个新的空对象 target，那么我们就可以实现对象的复制。注意，第一个参数 target，会被改变！
2. 该方法只适合拷贝没有嵌套对象的情况，否则要注意：他只是个浅拷贝，对于深层的对象只是拷贝的指针。修改新的对象可能会导致源对象发生变化！
3. 注意：对象解构运算，这也是浅拷贝。

### 深拷贝的几种方法

#### `JSON.parse()`+`JSON.stringify()`

将该对象转换为其 JSON 字符串表示形式，然后将其解析回对象。

> 缺点

- 需要创建一个临时的，可能很大的字符串，只是为了把它重新放回解析器。
- 不能处理循环对象。而且循环对象经常发生。
- 诸如 Map, Set, RegExp, Date, ArrayBuffer 和其他内置类型在进行序列化时会丢失。
- 不能克隆 function。
- 对于值为 undefined 的属性，克隆之后会被丢弃。值为 null 的属性会被保留。可以通过改写`JSON.stringify()`的第二个参数进行「修复」。

#### Structured Clone 结构化克隆算法

Structured cloning 是一种现有的算法，用于将值从一个地方转移到另一地方。例如，每当您调用 postMessage 将消息发送到另一个窗口或 WebWorker 时，都会使用它。关于结构化克隆的好处在于它处理循环对象并 支持大量的内置类型。

#### MessageChannel

可以创建一个 MessageChannel 并发送消息。在接收端，消息包含我们原始数据对象的结构化克隆。

```javascript
function structuralClone(obj) {
   return new Promise(resolve => {
     const {port1, port2} = new MessageChannel();
     port2.onmessage = ev => resolve(ev.data);
     port1.postMessage(obj);
   });
 }

 const obj = /* ... */;
 const clone = await structuralClone(obj);
```

缺点是它是异步的。虽然这并无大碍，但是有时候你需要使用同步的方式来深度拷贝一个对象。

#### History API

`history.pushState()`可以提供一个状态对象来保存 URL。这个状态对象使用结构化克隆 - 而且是同步的。

为了防止发生任何意外，请使用 `history.replaceState()` 而不是 `history.pushState()`。

```javascript
 function structuralClone(obj) {
		const oldState = history.state;
		history.replaceState(obj, document.title);
		const copy = history.state;
		history.replaceState(oldState, document.title);
		return copy;
 }

 const obj = /* ... */;
 const clone = structuralClone(obj);
```

#### Notification API

```javascript
function structuralClone(obj) {
   return new Notification('', {data: obj, silent: true}).data;
 }

 const obj = /* ... */;
 const clone = structuralClone(obj);
```

浏览器支持度不够。

#### 常规的遍历对象并赋值

`for..in`+`Object.hasOwnProperty()`

#### 总结

- 如果没有循环对象，并且不需要保留内置类型，则可以使用跨浏览器 `JSON.parse(JSON.stringify())` 获得最快的克隆性能。
- 如果你想要一个适当的结构化克隆，`MessageChannel` 是你唯一可靠的跨浏览器的选择。

### console.log 与内存泄漏

1. `console.log` 在 devtools 打开的时候是有内存泄漏的，因为控制台打印的是对象引用，但是不打开 devtools 是不会有内存泄漏的。
2. 通过`performance.memory.totalJSHeapSize/1024/1024`，配合 `console.log` 打印可以验证。
3. `string` 基本类型因为常量池的存在，同样的字符串实际只会创建一次。而 `new String` 的话才会在堆中创建一个对象，然后指向常量池中的字符串字面量。
4. nodejs 打印的是序列化后的对象，所以没有内存泄露。
5. 生产环境是可以使用 `console.log` 的，没有内存泄漏问题。

### peerDependency

peerDependency 可以避免核心依赖库被重复下载的问题。比如：

```bash
...
├── helloWorld
│   └── node_modules
│       ├── packageA
│       ├── plugin1
│       │   └── nodule_modules
│       │       └── packageA
│       └── plugin2
│       │   └── nodule_modules
│       │       └── packageA
...
```

1. 此时 helloWorld 本身已经安装了一次 packageA，但是因为因为在 plugin1 和 plugin2 中的 dependencies 也声明了 packageA，所以最后 packageA 会被安装三次，有两次安装是冗余的。
2. 如果在 plugin1 和 plugin2 的 package.json 中使用 peerDependency 来声明核心依赖库，例如：

```js
// plugin1/package.json
{
	"peerDependencies": {
		"packageA": "1.0.1"
	}
}
// plugin2/package.json
{
  "peerDependencies": {
    "packageA": "1.0.1"
  }
}
// helloWorld/package.json
{
  "dependencies": {
    "packageA": "1.0.1"
  }
}
```

3. 此时在主系统中执行 `npm install` 生成的依赖图就是这样的：可以看到这时候生成的依赖图是扁平的，packageA 也只会被安装一次。

```bash
...
├── helloWorld
│   └── node_modules
│       ├── packageA
│       ├── plugin1
│       └── plugin2
...
```

4. 总结：在插件使用 dependencies 声明依赖库的特点：
   - 如果用户显式依赖了核心库，则可以忽略各插件的 peerDependency 声明；
   - 如果用户没有显式依赖核心库，则按照插件 peerDependencies 中声明的版本将库安装到项目根目录中；
   - 当用户依赖的版本、各插件依赖的版本之间不相互兼容，会报错让用户自行修复；
