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

### web-see

使用第三方库，其原理也是综合了`img.src`、`navigator.sendBeacon`、`fetch keepalive`这几种方式来实现上报。可用来收集并上报：代码报错、性能数据、页面录屏、用户行为、白屏检测等个性化指标数据。(websee)[https://github.com/xy-sea/web-see]。

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

深拷贝是一个常见需求，我们可以通过 `JSON` 转换、递归、lodash 的`_.cloneDeep()`等方式实现。

#### `JSON.parse()`+`JSON.stringify()`

将该对象转换为其 JSON 字符串表示形式，然后将其解析回对象。

> 缺点

- 需要创建一个临时的，可能很大的字符串，只是为了把它重新放回解析器。
- 不能处理循环对象。而且循环对象经常发生。
- 诸如 Map, Set, RegExp, Date, ArrayBuffer 和其他内置类型在进行序列化时会丢失。
- 不能克隆 function。
- 对于值为 undefined 的属性，克隆之后会被丢弃。值为 null 的属性会被保留。可以通过改写`JSON.stringify()`的第二个参数进行「修复」。
- 原理：`JSON.stringify` 只能处理基本对象、数组和基本类型，而其他类型的值在转换之后都可能出现出乎意料的结果，例如 Date 会转化为字符串， Set 会转化为 {}。`JSON.stringify` 甚至完全忽略某些内容，比如 undefined 或函数。
- 除此之外，`JSON.parse(JSON.stringify(x))` 无法对包含循环引用的对象进行深克隆

#### Structured Clone 结构化克隆算法

Structured cloning 是一种现有的算法，用于将值从一个地方转移到另一地方。例如，每当您调用 postMessage 将消息发送到另一个窗口或 WebWorker 时，都会使用它。关于结构化克隆的好处在于它处理循环对象并 支持大量的内置类型。

实际上，JavaScript 中提供了一个原生 API 来执行对象的深拷贝：`structuredClone()`。它可以通过结构化克隆算法创建一个给定值的深拷贝，并且还可以传输原始值的可转移对象。

`structuredClone()` 的实用方式很简单，只需将原始对象传递给该函数，它将返回具有不同引用和对象属性引用的深层副本。

注意事项：

1. 拷贝无限嵌套的对象和数组；
2. 拷贝循环引用；当对象中存在循环引用时，仍然可以通过 `structuredClone()` 进行深拷贝。
3. 拷贝各种 JavaScript 类型，例如 Date、Set、Map、Error、RegExp、ArrayBuffer、Blob、File、ImageData 等；
4. 拷贝使用 structuredClone()得到的对象；
5. `structuredClone()`不能克隆 DOM 元素。将 HTMLElement 对象传递给 `structuredClone()`将导致错误。
6. 可以拷贝任何可转移的对象。要注意的是，使用可转移对象时必须小心处理，因为一旦对象被转移，原线程将不再拥有该对象的所有权，因此在发送线程中不能再访问该对象。此外，在接收线程中使用可转移对象时，也需要根据需求进行显式释放，否则可能会导致内存泄漏和其他问题。

```js
const originalObject = {
  set: new Set([1, 3, 3]),
  map: new Map([[1, 2]]),
  regex: /foo/,
  deep: { array: [new File(someBlobData, "file.txt")] },
  error: new Error("Hello!"),
};
originalObject.circular = originalObject;

const copied = structuredClone(originalObject);
```

- 在 JavaScript 中，`可转移对象`（Transferable Objects）是指 `ArrayBuffer` 和 `MessagePort` 等类型的对象，它们可以`在主线程和 Web Worker 线程`之间`相互传递`，同时还可以`实现零拷贝内存共享`，提高性能。这是由于可转移对象具有两个特点：

  1. 可共享：可转移对象本身没有所有权，可以在多个线程之间共享，实现零拷贝内存共享。
  2. 可转移：调用 Transferable API 时，可转移对象会从发送方（发送线程）转移到接收方（接收线程），不再存在于原始线程中，因此可以避免内存拷贝和分配等开销。

7. `structuredClone()` 不能拷贝的数据类型:

   1. 函数或方法，会抛出异常。
   2. DOM 节点，也会抛出异常。
   3. 属性描述符、setter 和 getter，以及类似的元数据都不能被克隆。
   4. 对象原型，原型链不能被遍历或拷贝。所以如果克隆一个实例 MyClass，克隆的对象将不再是这个类的一个实例（但是这个类的所有有效属性都将被拷贝）。

8. 支持拷贝的类型如下：
   1. JS 内置对象：Array（数组）、ArrayBuffer（数据缓冲区）、Boolean（布尔类型）、DataView（数据视图）、Date（日期类型）、Error（错误类型，包括下面列出的具体类型）、Map（映射类型）、Object （仅指纯对象，如从对象字面量中创建的对象）、原始类型（除 symbol 外，即 number、string、null、undefined、boolean、BigInt）、RegExp（正则表达式）、Set（集合类型）、TypedArray（类型化数组）。
   2. Error 类型：Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError。
   3. Web/API 类型：AudioData、Blob、CryptoKey、DOMException、DOMMatrix、DOMMatrixReadOnly、DOMPoint、DomQuad、DomRect、File、FileList、FileSystemDirectoryHandle、FileSystemFileHandle、FileSystemHandle、ImageBitmap、ImageData、RTCCertificate、VideoFrame。
9. 目前主流浏览器都支持 structuredClone API。

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

`for..in`+`obj.hasOwnProperty()`

#### 获取对象上非原型链上的属性（京东）

也就是对象自身的属性（不包括从其原型链继承的属性），可以使用以下几种方法:

1. `Object.keys(obj)`: 返回一个由给定对象的自身可枚举属性键名组成的数组。不包括 Symbol 和不可枚举的属性。
2. `Object.hasOwn(obj, propName)`: 返回一个布尔值，用于判断对象是否具有某个自身属性，包括不可枚举属性。
3. `obj.hasOwnProperty(propName)`: 返回一个布尔值，表示对象自身属性中是否具有指定的属性（即否有指定的键），包括不可枚举属性。推荐使用`Object.hasOwn()`。
4. `Object.getOwnPropertyNames(obj)`: 返回一个由给定对象的自身可枚举属性键名组成的数组，包括不可枚举属性，但不包括 Symbol 属性。
5. `Object.getOwnPropertySymbols(obj)`: 返回一个由给定对象的自身 Symbol 属性键名组成的数组。
6. `Object.getOwnPropertyDescriptors(obj)`：返回对象自身属性的描述符，包括 Symbol 属性和不可枚举属性。描述符包含属性的值、可枚举性、可配置性等信息。
7. `Reflect.ownKeys(obj)`: 返回一个由目标对象自身的属性键组成的数组，包括 Symbol 属性和不可枚举属性。

```javascript
const obj = {
  name: "John",
  age: 30,
  [Symbol("sym")]: "sym",
};

// 从原型链继承的属性
Object.prototype.gender = "male";

// 添加一个不可枚举属性
Object.defineProperty(obj, "hidden", {
  value: "secret",
  enumerable: false, // 不可枚举属性
});

// 添加一个可枚举属性
Object.defineProperty(obj, "public", {
  value: "test",
  enumerable: true, // 可枚举属性
});

// 1
console.log(Object.keys(obj)); // ['name', 'age', 'public']
// 2
console.log(Object.hasOwn(obj, "name")); // true
console.log(Object.hasOwn(obj, "gender")); // false
console.log(Object.hasOwn(obj, "hidden")); // true
console.log(Object.hasOwn(obj, "public")); // true
// 3
console.log(obj.hasOwnProperty("name")); // true
console.log(obj.hasOwnProperty("gender")); // false
console.log(obj.hasOwnProperty("hidden")); // true
console.log(obj.hasOwnProperty("public")); // true
// 4
console.log(Object.getOwnPropertyNames(obj)); // ['name', 'age', 'hidden', 'public']
// 5
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(sym)]
// 6
console.log(Object.getOwnPropertyDescriptors(obj)); // 如下
// {
//   "name": {
//     "value": "John",
//     "writable": true,
//     "enumerable": true,
//     "configurable": true
//   },
//   "age": {
//     "value": 30,
//     "writable": true,
//     "enumerable": true,
//     "configurable": true
//   },
//   "hidden": {
//     "value": "secret",
//     "writable": false,
//     "enumerable": false,
//     "configurable": false
//   },
//   "public": {
//     "value": "test",
//     "writable": false,
//     "enumerable": true,
//     "configurable": false
//   }
// }

// 7
console.log(Reflect.ownKeys(obj)); //  ['name', 'age', 'hidden', 'public', Symbol(sym)]
```

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

## WebGL

[DEMO 网站](http://js1k.com/2016-elemental/demo/2552)

## Vue3diff

[Vue3 diff](https://blog.csdn.net/zl_Alien/article/details/106595459)

## iframe 防止他人嵌套自己的网站

TODO

1. 通过 parent 判断 origin

## 几个框架对比总结

1. 不同框架编译之后的差异：

- 🚀 React 编译之后是 Jsx 函数返回的虚拟 DOM
- 🚀 Vue 编译之后是 render 函数返回的虚拟 DOM
- 🚀 SolidJS 编译之后返回的真实 DOM 字符串
- 🚀 Svelte 编译之后返回的是真实 DOM 片段

2. React 由于架构机制决定了每当状态发生改变，从当前组件开始一直到叶子组件重新加载。

3. Vue 由于给每个组件建立了 watchEffect 监听机制，每当组件依赖的状态发生改变，当前组件重新加载。

4. SolidJS 和 Svelte 由于在编译之后就确定了当状态发生改变 UI 随之变化的关系，所以仅仅是具体 DOM 的重新加载。
5. 相对来说，react 更新粒度最粗，但是配合 useMemo/memo 之后可以跟 Vue 差不多，Vue 更新粒度中等，SolidJS 和 Svelte 更新粒度相对最细。

## TOTP

基于时间的一次性密码算法（Time-based One-Time Password，简称：TOTP）是一种根据预共享的密钥与当前时间计算一次性密码的算法。

1. 前端库：`@nest-public/totp`，默认使用 SHA1 散列算法和 30 秒的时间步长。

## 本地快速启动 server

有时候我们需要给静态页面或文件，启动服务在浏览器中查看。推荐两个启动服务的 npm 包。

```bash
npx http-server [path] [options]

# 比如
npx http-server . -p 8090

npm repo http-server 可直达仓库地址

npx serve [path] [options]
# 比如
npx serve . -p 9090

npm repo serve 可直达仓库地址
```

## JS 实现函数重载

不同于 TS，JS 没有类型系统

```js
function createOverload() {
  const fnMap = new Map();
  function overload(...args) {
    const keys = args.map((item) => typeof item).join(",");
    const fn = fnMap.get(keys);
    if (!fn) {
      throw new TypeError("没有找到对应的实现");
    }
    return fn.apply(this, args);
  }
  overload.addImpl = function (...args) {
    const fn = args.pop();
    if (typeof fn !== "function") {
      throw new TypeError("最后一个参数必须是函数");
    }

    const key = args.join(",");
    fnMap.set(key, fn);
  };
  return overload;
}

// usage
const getUsers = createOverload();

getUsers.addImpl(() => console.log("查询所有用户"));
const searchPage = (page, size = 10) => console.log("按照页码和数量查询用户");
getUsers.addImpl("number", searchPage);
getUsers.addImpl("string", () => console.log("按照姓名查询用户"));

getUsers();
```

## 视频画中画

```html
<body>
// 旧方法
  <video
    id="video"
    height="500px"
    width="800px"
    src="../Downloads//Have the superpower of fixing containers.mp4"></video>
  <button id="pipButton">Open Picture-in-Picture</button>
// 新方法
  <video id="myVideo" controls>
    <source src="video.mp4" type="video/mp4">
  </video>
  <button onclick="togglePiP()">📺 画中画</button>
  <script>
    const video = document.getElementById("video");
    const pipButton = document.getElementById("pipButton");

    pipButton.disabled = !document.pictureInPictureEnabled;

    pipButton.addEventListener("click", async () => {
      try {
        if (video !== document.pictureInPictureElement) {
          await video.requestPictureInPicture();
        } else {
          await document.exitPictureInPicture();
        }
      } catch (error) {
        console.error(error);
      } finally {
        updateVideoButton();
      }
    });

    video.addEventListener("enterpictureinpicture", () => {
      pipButton.textContent = "Exit Picture-in-Picture";
    });

    video.addEventListener("leavepictureinpicture", () => {
      pipButton.textContent = "Enter Picture-in-Picture";
    });

    function updateVideoButton() {
      pipButton.textContent =
        video === document.pictureInPictureElement ? "Exit Picture-in-Picture" : "Enter Picture-in-Picture";
    }
  </script>
  <script>
	async function togglePiP() {
	  const video = document.getElementById('myVideo');
	  if (!document.pictureInPictureElement) {
	    await video.requestPictureInPicture(); // 开启画中画
	  } else {
	    await document.exitPictureInPicture(); // 退出
	  }
	}
  </script>
</body>
```

## 文档浮窗/画中画

1. 传统的 window.open() 虽然简单易用，但限制非常多：

  - ❌ 容易被浏览器拦截（尤其是在移动端）
  - ❌ 用户体验差（新窗口可能被挡住）
  - ❌ 样式控制受限（几乎无法用 CSS 美化）
  - ❌ 无法保证窗口始终置顶

2. Modal（模态框）虽然解决了很多问题，但它始终依附于当前页面 DOM，一旦用户切换了标签页、最小化了窗口，就无法再查看。

3. Document Picture-in-Picture API 是浏览器提供的原生 API，它允许你创建一个**独立的**、**始终置顶的**小窗口，并加载**自定义 HTML 内容**，需通过 HTML 字符串或 JS 注入。它和视频画中画（Video PiP）类似，但不是只能放视频，而是可以放任何 HTML 页面内容！
4. 总结：Document PiP 是浏览器级别的浮窗，可以独立存在、随时可见，不会被拦截，特别适合那些希望“常驻桌面”的场景。
5. 推荐使用 Document PiP： 实时数据窗口、悬浮工具、小地图、直播窗等。
```js
// 在代码中需要检查浏览器是否支持
const isSupported = "documentPictureInPicture" in window;

async function openPipWindow() {
  if (!("documentPictureInPicture" in window)) return;

  const pipWindow = await documentPictureInPicture.requestWindow({
    width: 400,
    height: 300
  });

  // 设置窗口内容（你可以用框架进一步封装）
  pipWindow.document.body.innerHTML = \`
    <div style="padding: 20px; background: #f0f0f0;">
      <h2>🎉 自定义浮窗</h2>
      <p>这是对 window.open 的完美替代</p>
    </div>
  \`;
}

// 响应式尺寸
const pipWindow = await documentPictureInPicture.requestWindow({
  width: Math.min(400, window.innerWidth * 0.8),
  height: Math.min(300, window.innerHeight * 0.8)
});

// 错误处理
try {
  const pipWindow = await documentPictureInPicture.requestWindow();
} catch (error) {
  if (error.name === 'NotAllowedError') {
    console.log('用户拒绝了浮窗权限');
  }
}
```

## for 和 forEach 的区别

1. `for` 是一个语句，`forEach` 是一个方法。
2. `for`循环是 js 提出时就有的循环方法。`forEach`是 ES5 提出的，挂载在可迭代对象原型上的方法，例如`Array` `Set` `Map`。`forEach`是一个迭代器，负责遍历可迭代对象。
3. `forEach` 是负责遍历（`Array Set Map`）可迭代对象的，而 `for` 循环是一种循环机制，只是能通过它遍历出数组。
4. 可迭代对象：ES6 中引入了 `iterable` 类型，`Array Set Map String arguments NodeList` 都属于 `iterable`，他们特点就是都拥有 `[Symbol.iterator]` 方法，包含他的对象被认为是可迭代的 `iterable`。
5. `for` 可以使用`break`和`continue`，`forEach` 不能。
6. `for` 可以使用`return`，直接在 Chrome 控制台会报错，用在函数中就行；`forEach` 中使用 return 的效果类似于 for 循环中的 continue，会跳过当前迭代进入下一个迭代，但不会停止整个 forEach 循环。
7. `forEach`属于迭代器，只能按序依次遍历完成，所以不支持上述的中断行为。
8. 一定要在 `forEach` 中跳出循环呢？其实是有办法的，借助`try/catch`，在`catch`中捕获异常，然后`return`，这样就可以实现跳出循环的效果。但是这样做不太好，因为`try/catch`会影响性能，所以不推荐这样做。
   ```js
   try {
     arr.forEach((item) => {
       if (item === 3) {
         throw new Error("end");
       }
     });
   } catch (e) {
     if (e.message === "end") {
       return;
     }
   }
   ```
9. `for` 可以使用`let`和`const`，`forEach` 不能。
10. `for` 可以使用`var`，`forEach` 不能。
11. `for` 可以使用`for...of`，`forEach` 不能。
12. `for` 可以使用`for...in`，`forEach` 不能。
13. `for` 可以使用`for await...of`，`forEach` 不能。
14. `for` 可以使用`for await...in`，`forEach` 不能。
15. `for` 可以使用`for...await...of`，`forEach` 不能。
16. 只要是可迭代对象，调用内部的 `Symbol.iterator` 都会提供一个迭代器，并根据迭代器返回的`next` 方法来访问内部，这也是 `for...of` 的实现原理。
17. 完整用法：`arr.forEach((self,index,arr) =>{},this)`
18. `forEach` 删除自身元素，`index`不可被重置，在 `forEach` 中我们无法控制 `index` 的值，它只会无脑的自增直至大于数组的 `length` 跳出循环。所以也无法删除自身进行 `index` 重置。
19. 在实际开发中，遍历数组同时删除某项的操作十分常见，在使用 `forEach` 删除时要注意。
20. `for` 循环可以控制循环起点，`forEach` 的循环起点只能为 0 不能进行人为干预
21. 性能比较：`for > forEach > map` 在 Chrome 62 和 Node.js v9.1.0 环境下：`for` 循环比 `forEach` 快 1 倍，`forEach` 比 `map` 快 20%左右。
22. 原因分析
    - `for`：for 循环没有额外的函数调用栈和上下文，所以它的实现最为简单。
    - `forEach`：对于 forEach 来说，它的函数签名中包含了参数和上下文，所以性能会低于 for 循环。
    - `map`：map 最慢的原因是因为 map 会返回一个新的数组，数组的创建和赋值会导致分配内存空间，因此会带来较大的性能开销。

## 页面加载解析渲染时触发的事件

在 HTML 文档加载、解析和渲染到页面的过程中，浏览器会触发一系列事件。这些事件可以用于监测页面的加载状态，并执行相应的操作。

DOMContentLoaded 先于 load 完成。

### DOMContentLoaded

- 触发时机：当初始的 HTML 文档被完全加载和解析，且所有延迟脚本（`<script defer src="…">` 和 `<script type="module">`）下载和执行完毕后触发，它不会等待图片、子框架和异步脚本 async 等其他内容完成加载。DOMContentLoaded 不会等待样式表加载，但延迟脚本会等待样式表，而且 DOMContentLoaded 事件排在延迟脚本之后。此外，非延迟或异步的脚本（如 `<script>`）将等待已解析的样式表加载。这个事件不可取消。
- 代表含义：此事件表示 DOM 树已经构建完成，所有的 DOM 元素都可以被访问和操作。通常在这个事件中执行的 JavaScript 代码不会依赖于外部资源的加载。

### load

- 触发时机：当整个页面和所有依赖的资源（如图片、样式表、脚本等）都加载完成后触发。该事件不可取消，也不会冒泡。
- 代表含义：此事件表示页面及其所有资源都已完全加载，可以安全地进行任何需要依赖这些资源的操作。

### beforeunload

- 触发时机：当用户尝试离开当前页面（例如，关闭浏览器、重新加载页面或导航到其他页面）时触发。
- 代表含义：这个事件可以用来提示用户是否真的要离开页面，通常会弹出一个确认对话框。

### unload

- 触发时机：当页面已经被卸载（即用户离开页面）时触发。
- 代表含义：此事件通常用于清理操作，如关闭连接或保存状态，但不能用于阻止页面的卸载。

### readystatechange

- 触发时机：当文档的 readyState 属性改变时触发。readyState 可以有以下几个值：
  - loading：文档正在加载。
  - interactive：文档已就绪，用户可以与其交互，但仍在加载其他资源。
  - complete：文档和所有资源加载完成。
- 代表含义：这个事件可以用于在不同的加载阶段执行特定操作。

### error

- 触发时机：当页面或资源（如图像、脚本、样式表等）加载失败时触发。
- 代表含义：可以用于处理加载失败的情况，例如，显示错误消息或执行备用逻辑。

## 在 input 标签中，我们可以使用哪些事件

1. change：当输入的内容发生改变并且输入框失去焦点时触发。
2. input：当输入框的内容发生变化时触发，适用于实时获取输入内容。
3. focus：当输入框获得焦点时触发。
4. blur：当输入框失去焦点时触发。
5. keydown：当用户按下键盘时触发，包括按键、删除键等，能拿到具体的键名。
6. keyup：当用户松开键盘时触发，包括按键、删除键等，能拿到具体的键名。
7. keypress：：当按下一个可打印字符键时触发（已被弃用，建议使用 keydown 和 keyup），比如按下 backspace 键，shift 键，alt 键等就不会触发。
8. paste：当用户粘贴内容到输入框时触发。
9. cut：当用户剪切内容从输入框时触发。
10. copy：当用户复制内容从输入框时触发。
11. select：当用户选择输入框中的文本时触发。

PS:

- 对于 type="checkbox" 或 type="radio" 的输入框，可以使用 change 事件来检测状态变化。
- 对于 type="file" 的输入框，可以使用 change 事件来获取文件选择。

```js
<input type="text" id="myInput" />
<script>
    document.getElementById('myInput').addEventListener('change', function() {
        console.log('Input changed to:', this.value);
    });
    document.getElementById('myInput').addEventListener('input', function() {
        console.log('Current input:', this.value);
    });
    document.getElementById('myInput').addEventListener('focus', function() {
        console.log('Input focused');
    });
    document.getElementById('myInput').addEventListener('blur', function() {
        console.log('Input blurred');
    });
    document.getElementById('myInput').addEventListener('keydown', function(event) {
        console.log('Key down:', event.key);
    });
    document.getElementById('myInput').addEventListener('keyup', function(event) {
        console.log('Key up:', event.key);
    });
    document.getElementById('myInput').addEventListener('keypress', function(event) {
        console.log('Key pressed:', event.key);
    });
    document.getElementById('myInput').addEventListener('paste', function() {
        console.log('Content pasted:', this.value);
    });
    document.getElementById('myInput').addEventListener('cut', function() {
        console.log('Content cut:', this.value);
    });
    document.getElementById('myInput').addEventListener('copy', function() {
        console.log('Content copied:', this.value);
    });
    document.getElementById("myInput").addEventListener("select", function () {
        console.log("Content selected:", this.value);
    });
</script>
```

## 有用的 JS 函数片段

### js 数值转换为金融字符串

#### 使用 Intl.NumberFormat

```js
function formatCurrency(value) {
  // 创建一个格式化器
  const formatter = new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY", // 货币种类，人民币
    minimumFractionDigits: 2, // 小数位数
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

// 示例
console.log(formatCurrency(1234567.89)); // 输出: "￥1,234,567.89"
console.log(formatCurrency(100)); // 输出: "￥100.00"
```

#### 使用 Number.prototype.toLocaleString

```js
function formatCurrency(value) {
  return value.toLocaleString("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// 示例
console.log(formatCurrency(1234567.89)); // 输出: "￥1,234,567.89"
console.log(formatCurrency(100)); // 输出: "￥100.00"
```

#### 自定义格式化函数

```js
function formatCurrency(value) {
  // 确保值是数字
  if (isNaN(value)) return "";

  // 将数值转换为字符串，并格式化为货币样式
  const parts = value.toFixed(2).split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 每三位添加逗号
  const decimalPart = parts[1] ? "." + parts[1] : ""; // 获取小数部分

  return "￥" + integerPart + decimalPart; // 拼接符号
}

// 示例
console.log(formatCurrency(1234567.89)); // 输出: "￥1,234,567.89"
console.log(formatCurrency(100)); // 输出: "￥100.00"
```

### 如何平滑滚动到元素视图中

```javascript
const smoothScroll = (element) =>
  document.querySelector(element).scrollIntoView({
    behavior: "smooth",
  });

smoothScroll("#fooBar"); // 平滑滚动到id为fooBar的元素
smoothScroll(".fooBar");
// 平滑滚动到class为fooBar的第一个元素
```

### 如何生成 UUID？

```javascript
const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );

UUIDGeneratorBrowser(); // '7982fcfe-5721-4632-bede-6000885be57d'
```

### 如何获取选定的文本

```javascript
const getSelectedText = () => window.getSelection().toString();

getSelectedText(); // 'Lorem ipsum'
```

### 如何将文本复制到剪贴板

```javascript
const copyToClipboard = (str) => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(str);
  return Promise.reject("The Clipboard API is not available.");
};
```

### 如何切换全屏模式

```javascript
const fullscreen = (mode = true, el = "body") =>
  mode ? document.querySelector(el).requestFullscreen() : document.exitFullscreen();

fullscreen(); // 将body以全屏模式打开
fullscreen(false); // 退出全屏模式
```

### 如何检测大写锁定是否打开

```javascript
const el = document.getElementById("password");
const msg = document.getElementById("password-message");

el.addEventListener("keyup", (e) => {
  msg.style = e.getModifierState("CapsLock") ? "display: block" : "display: none";
});
```

### 如何检查日期是否有效

```javascript
const isDateValid = (...val) => !Number.isNaN(new Date(...val).valueOf());

isDateValid("December 17, 1995 03:24:00"); // true
isDateValid("1995-12-17T03:24:00"); // true
isDateValid("1995-12-17 T03:24:00"); // false
isDateValid("Duck"); // false
isDateValid(1995, 11, 17); // true
isDateValid(1995, 11, 17, "Duck"); // false
isDateValid({}); // false
```

### 如何检查当前用户的首选语言

```javascript
const detectLanguage = (defaultLang = "en-US") =>
  navigator.language || (Array.isArray(navigator.languages) && navigator.languages[0]) || defaultLang;

detectLanguage(); // 'nl-NL'
```

### 如何检查当前用户的首选颜色方案

```javascript
const prefersDarkColorScheme = () =>
  window && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

prefersDarkColorScheme(); // true
```

### 如何检查设备是否支持触摸事件

```javascript
const supportsTouchEvents = () => window && "ontouchstart" in window;

supportsTouchEvents(); // true
```

### 在浏览器分析 npm 包

`[pkg-size.dev](https://pkg-size.dev/)`，可以直接在浏览器对 npm 包进行分析（包括占用大小、打包大小、间接依赖项等等）。它的目标是让像我们可以更轻松地探索 npm 生态系统。

### 前端监听手机键盘是否弹起

安卓和 ios 判断手机键盘是否弹起的写法是有所不同的：

1. IOS 端可以通过 `focusin`、`focusout` 这两个事件来监听

```javascript
window.addEventListener("focusin", () => {
  // 键盘弹出事件处理
  alert("ios键盘弹出事件处理");
});
window.addEventListener("focusout", () => {
  // 键盘收起事件处理
  alert("ios键盘收起事件处理");
});
```

2. 安卓只能通过 resize 来判断屏幕大小是否发生变化来判断

由于某些 Android 手机收起键盘，输入框不会失去焦点，所以不能通过聚焦和失焦事件来判断。但由于窗口会变化，所以可以通过监听窗口高度的变化来间接监听键盘的弹起与收回。

```javascript
const innerHeight = window.innerHeight;
window.addEventListener("resize", () => {
  const newInnerHeight = window.innerHeight;
  if (innerHeight > newInnerHeight) {
    // 键盘弹出事件处理
    alert("android 键盘弹出事件");
  } else {
    // 键盘收起事件处理
    alert("android 键盘收起事件处理");
  }
});
```

3. 因为 ios 和安卓的处理不一样，所以还需要判断系统的代码

```javascript
const ua = typeof window === "object" ? window.navigator.userAgent : "";

let _isIOS = -1;
let _isAndroid = -1;

export function isIOS() {
  if (_isIOS === -1) {
    _isIOS = /iPhone|iPod|iPad/i.test(ua) ? 1 : 0;
  }
  return _isIOS === 1;
}

export function isAndroid() {
  if (_isAndroid === -1) {
    _isAndroid = /Android/i.test(ua) ? 1 : 0;
  }
  return _isAndroid === 1;
}
```

4. 复选框、单选框的点击也会导致`focusin` 和`focusout` 的触发，我们需要处理一下，使其点击复选框、单选框这类标签的时候不触发我们的回调函数

```javascript
// 主要是通过判断一下当前被focus的dom类型
// document.activeElement.tagName
// tagName为输入框的时候才算触发键盘弹起
const activeDom = document.activeElement.tagName;
if (!["INPUT", "TEXTAREA"].includes(activeDom)) {
  console.log("只有");
}
```

5. 当有横屏功能的时候，resize 也会被触发，增加宽度是否有改变的判断，没有改变，才是真正的键盘弹起

```javascript
//初始化的时候获取一次原始宽度
const originWidth = document.documentElement.clientWidth || document.body.clientWidth;
//结合处理复选框、单选框的点击也会导致`focusin` 和`focusout` 的触发问题的完整回调写法
function callbackHook(cb) {
  const resizeWeight = document.documentElement.clientWidth || document.body.clientWidth;
  const activeDom = document.activeElement.tagName;
  if (resizeWeight !== originWidth || !["INPUT", "TEXTAREA"].includes(activeDom)) {
    return (isFocus = false);
  }
  cb && cb();
}
```

6. 使用应当要注意销毁，也需要尽量减少绑定指令的次数，一般在 form 表单上绑定一个，即可监听这个表单下的所有输入框是否触发手机键盘唤起了

### 页面滚动的代码

```javascript
window.scroll({ top: document.body.scrollHeight, behavior: "smooth" });

window.scrollTo(0, document.body.scrollHeight);
```

### console 的妙用

```javascript
// Basic logging
console.log("Simple log");
console.error("This is an error");
console.warn("This is a warning");

// Logging tabular data
const users = [
  { name: "John", age: 30, city: "New York" },
  { name: "Jane", age: 25, city: "San Francisco" },
];
console.table(users);

// Grouping logs
console.group("User Details");
console.log("User 1: John");
console.log("User 2: Jane");
console.groupEnd();

// Timing code execution
console.time("Timer");
for (let i = 0; i < 1000000; i++) {
  // Some heavy computation
}
console.timeEnd("Timer");
```

### Currying 的妙用

柯里化是一种将接受多个参数的函数转换为一系列仅接受一个参数的函数的过程。这项技术可以帮助创建更灵活且可重用的函数，尤其是在函数式编程中特别有用。

```javascript
const applyDiscount = (discount) => (price) => price - (price * discount) / 100;
const tenPercentOff = applyDiscount(10);
const twentyPercentOff = applyDiscount(20);

console.log(tenPercentOff(100)); // 90
console.log(twentyPercentOff(100)); // 80

const applyTax = (taxRate) => (price) => price + (price * taxRate) / 100;
const applyTenPercentTax = applyTax(10);

console.log(applyTenPercentTax(100)); // 110
console.log(applyTenPercentTax(twentyPercentOff(100))); // 88
```

### 记忆化函数 memoization

memoization 是一种优化技术，涉及缓存昂贵函数调用的结果，并在相同的输入再次出现时返回缓存的结果。这可以显著提高具有大量计算的函数的性能，特别是那些频繁以相同参数调用的函数。

```javascript
const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache[key]) {
      cache[key] = fn(...args);
    }
    return cache[key];
  };
};

const fibonacci = memoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // 102334155
```

### Proxy 代理对象

代理对象允许你为另一个对象创建代理，从而能够拦截并重新定义基本操作，如属性查找、赋值、枚举、函数调用等。这为向对象添加自定义行为提供了一种强大的方式。

```javascript
const user = {
  name: "John",
  age: 30,
};

const handler = {
  get: (target, prop, receiver) => {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  set: (target, prop, value, receiver) => {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number");
    }
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  },
};

const proxyUser = new Proxy(user, handler);
console.log(proxyUser.name); // Getting name, John
proxyUser.age = 35; // Setting age to 35
// proxyUser.age = '35'; // Throws TypeError
```

### 7 种在 JavaScript 中分解长任务的技术

1. setTimeout() + 递归：将任务分解为多个小任务，每个任务使用 setTimeout() 延迟执行，然后递归地调用自身，直到所有任务完成。
2. Async/Await & Timeout：通过 setTimeout 实现 sleep，然后使用 async/await 实现异步任务。
3. scheduler.postTask(cb, options?)：Scheduler 接口是 Chromium 浏览器相对较新的功能，旨在成为一种一流的工具，用于以更多的控制和更高的效率来安排任务。它基本上是几十年来我们一直依赖的  setTimeout()  的更高级版本。`options:{priority: "user-blocking"}`通过设置 priority 控制优先级，优先级越高，越先执行。由它安排的所有任务都会被置于任务队列的前端，防止其他任务插队并延迟执行。`user-blocking>default>background`
4. scheduler.yield()
5. requestAnimationFrame()：旨在根据浏览器的重绘周期安排工作。因此，它在调度回调方面非常精确。它总是会在下一次重绘之前执行。
6. MessageChannel()：通常被选作零延迟超时的一种更轻量级的替代方案。与其让浏览器排队计时器并安排回调，不如实例化一个通道并立即向其发送消息
7. Web Workers：将工作从主线程中分离出来

```javascript
// 1.
function processItems(items, index) {
  index = index || 0;
  var currentItem = items[index];

  console.log("processing item:", currentItem);

  if (index + 1 < items.length) {
    setTimeout(function () {
      processItems(items, index + 1);
    }, 0);
  }
}

processItems(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

// 2.
<button id="button">count</button>
<div>Click count: <span id="clickCount">0</span></div>
<div>Loop count: <span id="loopCount">0</span></div>

<script>
  function waitSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  }

  button.addEventListener("click", () => {
    clickCount.innerText = Number(clickCount.innerText) + 1;
  });

  (async () => {
    const items = new Array(100).fill(null);

    for (const i of items) {
      loopCount.innerText = Number(loopCount.innerText) + 1;

      await new Promise((resolve) => setTimeout(resolve, 0));

      waitSync(50);
    }
  })();
 </script>

//  3.
const items = new Array(100).fill(null);

for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  await new Promise((resolve) => scheduler.postTask(resolve));

  waitSync(50);
}
scheduler.postTask(() => {
  console.log("postTask - background");
}, { priority: "background" });

setTimeout(() => console.log("setTimeout"));

scheduler.postTask(() => console.log("postTask - default"));

// setTimeout
// postTask - default
// postTask - background

// 4.
const items = new Array(100).fill(null);

for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  await scheduler.yield();

  waitSync(50);
}
// 5.


// 6.
for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  await new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = resolve();
    channel.port2.postMessage(null);
  });

  waitSync(50);
}

// 7.
const items = new Array(100).fill(null);

const workerScript = `
  function waitSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  }

  self.onmessage = function(e) {
    waitSync(50);
    self.postMessage('Process complete!');
  }
`;

const blob = new Blob([workerScript], { type: "text/javascipt" });
const worker = new Worker(window.URL.createObjectURL(blob));

for (const i of items) {
  worker.postMessage(items);

  await new Promise((resolve) => {
    worker.onmessage = function (e) {
      loopCount.innerText = Number(loopCount.innerText) + 1;
      resolve();
    };
  });
}
```

### 重写 Promise 的几个工具函数

首先 Promise 有 A+规范和 Promise ES6 规范，其中 A+规范比较简单，ES6 规范比较复杂。我们常用的是 ES6 规范，但是 thenable 的概念是由 A+ 提出来的，所以 ES6 规范也支持 thenable。

thenable 是一个对象，它拥有 then 方法，then 方法接受两个参数，第一个参数是成功的回调函数，第二个参数是失败的回调函数。

1. resolve 方法
2. reject 方法
3. then 方法
4. catch 方法
5. finally 方法

```javascript
// 判断是否是thenable
function isThenable(obj) {
  return (typeof obj === "object" || typeof obj === "function") && obj !== null && typeof obj.then === "function";
}

// 1. resolve 方法
function resolve(value) {
  if (value instanceof Promise) {
    return value;
  }
  if (isThenable(value)) {
    return new Promise((resolve, reject) => {
      value.then(resolve, reject);
    });
  }
}

// 2. reject 方法
function reject(reason) {
  return new Promise((_, reject) => {
    reject(reason);
  });
}

// 4. catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

// 5. finally 方法
Promise.prototype.finally(onFinally) {
  return this.then(
    value => {
      return Promise.resolve(onFinally()).then(() => value);
    },
    reason => {
      return Promise.resolve(onFinally()).then(() => { throw reason; });
    }
  );
}
```

### 重写 instanceof

本质就是判断一个对象是否是某个构造函数的实例，不断去比较构造函数的 prototype 和实例的**proto**原型是否相等。

```javascript
function myInstanceof(instance, constructor) {
  // 首先检查 constructor 是否是一个函数
  if (typeof constructor !== "function") {
    throw new TypeError('Right-hand side of "instanceof" is not callable');
  }

  // 获取构造函数的 prototype
  const prototype = constructor.prototype;

  // 遍历原型链
  while (instance) {
    // 检查当前对象的 __proto__ 是否等于构造函数的 prototype
    if (instance.__proto__ === prototype) {
      return true;
    }
    // 向上查找原型链
    instance = instance.__proto__;
  }
  return false;
}
```

###

```javascript

```

###

```javascript

```

## 打开一个页面所触发的事件

![页面加载事件](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/20250419160943831.jpeg)
