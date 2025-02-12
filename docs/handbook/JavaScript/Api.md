---
title: JavaScript APIs
author: EricYangXD
date: "2022-04-18"
---

## 记录 JavaScript 中的常用和不常用的 APIs

### Array

- 创建 Array

```js
Array("1" + 1);
// ['11']
Array(1 + 1);
// [empty × 2]
```

- 搜索数组的四种方法

1. 只需要知道值是否存在？这时可以使用 includes()。
2. 需要获取元素本身？可以对单个项目使用 find()或对多个项目使用 filter()。
3. 需要查找元素的索引？应该使用 indexOf() 搜索原语或使用 findIndex() / lastIndexOf()搜索函数。

- 对比，假设`const arr=[0,1,2,3,4,5];`

| API   | 功能     | 用法                  | 是否改变原数组 | 输入特殊值                                                                      |
| ----- | -------- | --------------------- | -------------- | ------------------------------------------------------------------------------- |
| slice | 截取数组 | arr.slice(start, end) | [X]            | 1. arr.slice(-2);// [4, 5]；2. arr.slice(NaN);// arr；3. arr.slice(-2,-3);// [] |

### String

### Number

### Object

### Map、WeakMap

### Set、WeakSet

WeakSet 类似于 Set，但可以存储弱引用的对象。这意味着，如果没有其他引用指向一个对象，那么这个对象可以被垃圾回收器回收，而不需要手动从 WeakSet 中删除。

```js
const myWeakSet = new WeakSet();
const obj1 = {};
const obj2 = {};
myWeakSet.add(obj1);
myWeakSet.add(obj2);
console.log(myWeakSet.has(obj1)); // true
obj1 = null;
console.log(myWeakSet.has(obj1)); // false
```

使用场景：在某些情况下，可能需要存储一些临时的对象，但又不希望这些对象占用太多的内存。使用 WeakSet 可以方便地管理这些对象。

### Promise

### Date

1. 正常用法：`const date1 = new Date(); const date2 = new Date(2022, 2, 18);`
2. Date API 处理日期溢出时，会自动往后推延响应时间的规则：

```js
new Date(2019, 0, 50); // 其中0代表1月，1月只有31天，则多出来的19天会被加到2月，结果是2019年2月19日。
new Date(2019, 20, 10); // 1年只有12个月，多出来的9个月会被加到2020年，结果是2020年9月10日
new Date(2019, -2, 10); // 2019年1月10日往前推2个月，结果为2018年11月10日
new Date(2019, 2, -2); // 2019年3月1日往前推2天，结果为2019年2月26日
// 以上可以混用
```

3. 已知年月，求该月共多少天:

```js
// method 1
// month 值需对应实际月份减一，如实际 2 月，month 为 1，实际 3 月，month 为 2
function getMonthCountDay(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}

// method 2
function getMonthCountDay(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
```

### RegExp

### Reflect

Reflect API 可以用于实现元编程，例如动态调用对象的方法或构造函数。

```js
class MyClass {
  constructor(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}
const myObject = Reflect.construct(MyClass, ["Hello, world!"]);
const myMethod = Reflect.get(myObject, "getValue");
const myValue = myMethod.call(myObject);
console.log(myValue); // "Hello, world!"
```

使用场景：在某些情况下，可能需要动态调用对象的方法或构造函数，使用 Reflect API 可以方便地实现这些功能。

### Intl

Intl 对象是 ECMAScript 国际化 API 的命名空间，它提供了对语言敏感的字符串比较、数字格式化以及日期和时间格式化。

```js
let number = 123456.789;
let formatter = new Intl.NumberFormat('de-DE');
let formattedNumber = formatter.format(number);
// formattedNumber is '123.456,789'

const segmenter = new Intl.Segmenter( // 返回一个iterable对象
  'zh', { granularity: 'sentence' } // "word"
);
console.log(
  Array.from(
    segmenter.segment(你好，我是xxx。我来了！你是谁？你在哪？),
    s => s.segment
  )
);

console.log(['Z', 'a', 'z', 'ä'].sort(new Intl.Collator('de').compare));
// expected output: ["a", "ä", "z", "Z"]
console.log(['Z', 'a', 'z', 'ä'].sort(new Intl.Collator('sv').compare));
// expected output: ["a", "z", "Z", "ä"]
console.log(['Z', 'a', 'z', 'ä'].sort(new Intl.Collator('de', { caseFirst: 'upper' } ).compare));
// expected output: ["a", "ä", "Z", "z"]

const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738));
// Results below assume UTC timezone - your results may vary
// Specify default date formatting for language (locale)
console.log(new Intl.DateTimeFormat('en-US').format(date));
// expected output: "12/20/2020"
// Specify default date formatting for language with a fallback language (in this case Indonesian)
console.log(new Intl.DateTimeFormat(['ban', 'id']).format(date));
// expected output: "20/12/2020"
// Specify date and time format using "style" options (i.e. full, long, medium, short)
console.log(new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Australia/Sydney' }).format(date));
// Expected output "Sunday, 20 December 2020 at 14:23:16 GMT+11"

const vehicles = ['Motorcycle', 'Bus', 'Car'];
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
console.log(formatter.format(vehicles));
// expected output: "Motorcycle, Bus, and Car"
const formatter2 = new Intl.ListFormat('de', { style: 'short', type: 'disjunction' });
console.log(formatter2.format(vehicles));
// expected output: "Motorcycle, Bus oder Car"
const formatter3 = new Intl.ListFormat('en', { style: 'narrow', type: 'unit' });
console.log(formatter3.format(vehicles));
// expected output: "Motorcycle Bus Car"

new Intl.NumberFormat([locales[, options]])
Intl.NumberFormat.call(this[, locales[, options]])
// options: decimal用于纯数字格式；currency用于货币格式；percent用于百分比格式；unit用于单位格式；style要使用的格式样式，默认为decimal。等等

const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'narrow' });
console.log(rtf1.format(3, 'quarter'));
//expected output: "in 3 qtrs."
console.log(rtf1.format(-1, 'day'));
//expected output: "1 day ago"
const rtf2 = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
console.log(rtf2.format(2, 'day'));
//expected output: "pasado mañana"

const segmenterFr = new Intl.Segmenter('fr', { granularity: 'word' });
const string1 = 'Que ma joie demeure';
const iterator1 = segmenterFr.segment(string1)[Symbol.iterator]();
console.log(iterator1.next().value.segment);
// expected output: 'Que'
console.log(iterator1.next().value.segment);
// expected output: ' '
```

1. `Intl.Collator` 是用于语言敏感字符串比较的 collators 构造函数。
2. `Intl.DateTimeFormat` 是根据语言来格式化日期和时间的对象的构造器。
3. `Intl.ListFormat` 是一个语言相关的列表格式化构造器。
4. `Intl.NumberFormat` 是对语言敏感的格式化数字类的构造器类。
5. `Intl.PluralRules` 对象是用于启用多种敏感格式和多种语言规则的构造函数。
6. **Intl.RelativeTimeFormat**对象启用本地化的相对时间格式。
7. `Intl.Segmenter` 对象支持语言敏感的文本分割，允许你将一个字符串分割成有意义的片段（字、词、句）。也可以解决组合字符的分割问题：`12345😵‍💫✋🏻`，如果使用 split 分割会出现意想不到的情况。

### forEach

1. `for in` 或者 `for of` 或者 `$.each`或者 `every` 或者 `some`都支持`break`，即能跳出循环。
2. `forEach`不支持跳出循环，但可以 hack：

```js
try {
  [1, 2, 3].forEach((v) => {
    if (v === 2) {
      throw new Error("my err");
    }
  });
} catch (e) {
  if (e.message === "my err") {
    console.log("breaked");
  } else {
    throw e;
  }
}
```

3. `forEach`不能保证遍历顺序，也不能 break

### form

表单中禁止 chrome 弹出密码提示：使用奇技淫巧：在表单最上面新建两个用户名和密码的隐藏的 input。

```html
<form action="?" method="post">
  <!-- dispaly:none;在新的版本无效，最好的方法是在第一个有效的密码框前面加上一个假的密码框，并设置宽高为0，border为none -->
  <input type="text" style="display: none;" />
  <!-- 隐藏表单必须是text类型，而且还有加autocomplete = new-password -->
  <input type="password" class="form-control" placeholder="" autocomplete="new-password" />
  <input type="submit" value="提交" />
</form>

<!-- 或者 -->
<input type="password" [(ngModel)]="password" name="password" style="display:none" />
<input
  nz-input
  type="password"
  autocomplete="new-password"
  [(ngModel)]="password"
  name="password"
  placeholder="请输入密码"
  id="password" />
```

### Blob

Blob API 用于处理二进制数据，可以方便地将数据转换为 Blob 对象或从 Blob 对象读取数据。

```js
// 创建一个Blob对象
const myBlob = new Blob(["Hello, world!"], { type: "text/plain" });
// 读取Blob对象的数据
const reader = new FileReader();
reader.addEventListener("loadend", () => {
  console.log(reader.result);
});
reader.readAsText(myBlob);
```

使用场景：在 Web 应用中，可能需要上传或下载二进制文件，使用 Blob API 可以方便地处理这些数据。

### TextEncoder 和 TextDecoder

TextEncoder 和 TextDecoder 用于处理字符串和字节序列之间的转换。它们可以方便地将字符串编码为字节序列或将字节序列解码为字符串。

```js
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const myString = "Hello, world!";
const myBuffer = encoder.encode(myString);
console.log(myBuffer); // Uint8Array(13) [72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]
const decodedString = decoder.decode(myBuffer);
console.log(decodedString); // "Hello, world!"
```

使用场景：在 Web 应用中，可能需要将字符串转换为二进制数据，或将二进制数据转换为字符串。使用 TextEncoder 和 TextDecoder 可以方便地进行这些转换。

### Proxy

Proxy API 可以用于创建代理对象，可以拦截对象属性的读取、赋值等操作。这个功能可以用于实现元编程、数据劫持等功能。

```js
const myObject = {
  name: "John",
  age: 30,
};
const myProxy = new Proxy(myObject, {
  get(target, property) {
    console.log(`Getting property ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting property ${property} to ${value}`);
    target[property] = value;
  },
});
console.log(myProxy.name); // "John"
myProxy.age = 31; // Setting property age to 31
```

使用场景：在某些情况下，可能需要拦截对象属性的读取、赋值等操作，以实现更高级的功能。使用 Proxy API 可以方便地实现这些功能。

### Object.entries() 和 Object.values()

Object.entries() 用于获取对象的可枚举属性和值的数组，Object.values() 用于获取对象的可枚举属性值的数组。

```js
const myObject = {
  name: "John",
  age: 30,
};
console.log(Object.entries(myObject)); // [["name", "John"], ["age", 30]]
console.log(Object.values(myObject)); // ["John", 30]
```

使用场景：在某些情况下，可能需要获取对象的可枚举属性或属性值。使用 Object.entries()和 Object.values()可以方便地实现这些功能。

#### demo 示例

1. TODO

### IntersectionObserver

IntersectionObserver 是一种浏览器原生提供的 API，用于监听目标元素与其祖先元素（或视口）之间的交集变化。换句话说，它可以检测目标元素是否进入、离开或在特定区域中（如视口）可见，以及交集的比例。是异步的，不会阻塞主线程，性能远高于基于 scroll 事件的监听。可以精准控制监听的元素和范围，减少不必要的 DOM 操作。原本需要复杂逻辑的滚动监听，现在通过简单配置即可实现。

相比以往使用 scroll 事件监听滚动位置的方式，IntersectionObserver 不仅性能更高，而且更加易用，能够显著减少 DOM 操作和性能瓶颈。

可以用于实现无限滚动、懒加载图片、元素曝光统计、动画触发等功能。

回调参数：IntersectionObserverEntry 对象包含目标元素的交集信息：

- isIntersecting：布尔值，表示目标元素是否与根元素交叉。
- intersectionRatio：目标元素的交集比例（0~1）。
- target：被观察的目标元素。
- intersectionRect：交集区域的矩形信息。
- boundingClientRect：目标元素的边界矩形。
- rootBounds：根元素的矩形边界。

```js
const myObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(`${entry.target.id} is now visible`);
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null, // 默认是视口
    rootMargin: "0px", // 根元素的外边距
    threshold: 0.5, // 目标元素可见比例达到 50% 时触发回调
  }
);
const myElement = document.getElementById("myElement");
// 开始观察
myObserver.observe(myElement);
// 停止观察
myObserver.unobserve(target);
// 断开所有监听
myObserver.disconnect();
```

使用场景：在 Web 应用中，可能需要实现无限滚动、懒加载等功能，使用 IntersectionObserver 可以方便地实现这些功能。![demo](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/202501150934430.png)

#### 图片懒加载

```js
// <img data-src="example.jpg" class="lazyload" alt="Lazy Load Example" />
// <img data-src="example2.jpg" class="lazyload" alt="Lazy Load Example 2" />

// 获取所有需要懒加载的图片
const images = document.querySelectorAll(".lazyload");

// 创建观察器实例
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 将 data-src 替换为 src
      observer.unobserve(img); // 停止观察已加载的图片
    }
  });
});

// 开始观察每张图片
images.forEach((img) => observer.observe(img));
```

#### 无限滚动

```js
// <div id="container">
//   <div class="item">Item 1</div>
//   <div class="item">Item 2</div>
//   <div class="item">Item 3</div>
//   <div id="sentinel">Loading...</div>
// </div>

const sentinel = document.getElementById("sentinel");
const container = document.getElementById("container");
let itemCount = 3;

// 创建观察器
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadMore();
    }
  });
});

observer.observe(sentinel);

// 模拟加载更多数据
function loadMore() {
  observer.unobserve(sentinel); // 暂时停止观察，避免重复触发
  for (let i = 0; i < 5; i++) {
    const newItem = document.createElement("div");
    newItem.className = "item";
    newItem.textContent = `Item ${++itemCount}`;
    container.insertBefore(newItem, sentinel);
  }
  observer.observe(sentinel); // 重新开始观察
}
```

### MutationObserver

一种高级的浏览器 API，用于监听 DOM 的变化。它可以检测 DOM 结构中的以下变化：

- 节点的添加和移除。
- 节点属性的更改。
- 文本内容的更改。

使用场景：

- 在动态生成的内容中，比如前端框架中有异步加载的内容，MutationObserver 可以用来监听 DOM 的添加或移除。
- 可以监听某个 DOM 元素属性的变化，比如 class 或 style。
- 可以监听节点中的文本内容变化，比如输入框中的内容是否被程序动态修改。
- 监听动态组件加载：在单页面应用（SPA）中，组件通常是动态渲染的，需要在组件被添加到 DOM 中后执行某些操作（比如初始化插件）。
- 深度监听嵌套结构：如果需要监听目标节点及其所有后代节点的变化，可以使用 subtree: true。

```js
const observer = new MutationObserver((mutationsList, observer) => {
  // 遍历所有检测到的变动
  mutationsList.forEach((mutation) => {
    console.log(mutation);
  });
});

// 目标节点
const targetNode = document.getElementById("target");

// 配置选项
const config = {
  attributes: true, // 监听属性值的变化
  attributeOldValue: true, // 是否记录属性变化前的值（需要 attributes: true）
  childList: true, // 监听子节点的添加或删除
  subtree: true, // 监听后代节点的变化
  characterData: true, // 是否监听文本节点内容的变化
  characterDataOldValue: true, // 是否记录文本变化前的值（需要 characterData: true）
  attributeFilter: [], // 指定需要监听的属性名称列表（如 ['class', 'id']）
};

// 开始监听
observer.observe(targetNode, config);

// 停止监听（可选）
observer.disconnect();
```

### Symbol

Symbol 可以用于创建唯一标识符，可以用于定义对象的私有属性或方法。

```js
const mySymbol = Symbol("mySymbol"); // 不可以比较
const mySymbol1 = Symbol("mySymbol");
mySymbol === mySymbol1; // false

const mySymbol2 = Symbol.for("mySymbol"); // 可以比较
const mySymbol3 = Symbol.for("mySymbol");
mySymbol2 === mySymbol3; // true

const myObject = {
  [mySymbol]: "This is a private property",
  publicProperty: "This is a public property",
};
console.log(myObject[mySymbol]); // "This is a private property"
console.log(myObject.publicProperty); // "This is a public property"
```

使用场景：在某些情况下，可能需要定义对象的私有属性或方法，使用 Symbol 可以方便地实现这些功能。

### Generator

Generator API 可以用于生成迭代器，可以用于实现异步操作或惰性计算。yield 相当于步进器。

```js
function* myGenerator() {
  yield "Hello";
  yield "world";
  yield "!";
}
const myIterator = myGenerator();
console.log(myIterator.next().value); // "Hello"   // {done:true/false, value:value}
console.log(myIterator.next().value); // "world"
console.log(myIterator.next().value); // "!"
```

使用场景：在某些情况下，可能需要实现异步操作或惰性计算，使用 Generator API 可以方便地实现这些功能。

### Web Workers

Web Workers 可以用于在后台线程中执行 JavaScript 代码，可以用于提高性能或实现复杂的计算。通过 postMessage 和 onmessage 来进行通信。

```js
// main.js
const myWorker = new Worker("worker.js");
myWorker.postMessage("Hello, worker!");
myWorker.onmessage = (event) => {
  console.log(`Message received from worker: ${event.data}`);
};
// worker.js
onmessage = (event) => {
  console.log(`Message received in worker: ${event.data}`);
  postMessage("Hello, main!");
};
```

使用场景：在 Web 应用中，可能需要处理大量计算密集型任务或执行长时间运行的操作，使用 Web Workers 可以提高性能或避免阻塞用户界面。

### AudioContext

AudioContext 可以用于处理音频，可以用于实现音频播放、音效处理等功能。

```js
const audioContext = new AudioContext();
fetch("https://example.com/audio.mp3")
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
  .then((audioBuffer) => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  });
```

使用场景：在 Web 应用中，可能需要实现音频播放、音效处理等功能，使用 AudioContext 可以方便地实现这些功能。

### crypto.randomUUID()

是一个内置于浏览器的方法（它不是一个第三方包）。它在所有主要浏览器中都可用。

```js
crypto.randomUUID();
// '723e5c4a-02e6-4f1a-8d47-4146070eabe1'
```

### ==

1. 在进行`[] == ![]`判断时，在 JS 引擎内部，会将这行代码执行成这个样子：

```js
[] == ![]

[] == !true // 将空数组这个对象类型转换成布尔值

[] == false // ! 运算符对 true 进行取反

'' == false // 对 [] 进行 ToPrimitive 操作，返回一个空对象

0 == 0 // 将等号两边都转换成数字类型
```

### 浏览器访问读取本地文件夹

1. 使用浏览器的 api：`showDirectoryPicker`，但是目前只有 chrome 支持，且需要在`chrome://flags`中开启`#native-file-system-api`。
2. `highlight.js`高亮显示代码

```js
const btn = document.getElementById("test");
btn.addEventListener("click", async () => {
  try {
    const dirHandle = await window.showDirectoryPicker();
    const root = handleDir(dirHandle);
    console.log(root);

    // 读取第三个文件
    const fileHandle = root.children[2];
    const file = await fileHandle.getFile();
    const reader = new FileReader();
    // reader.addEventListener("loadend", () => {
    //   console.log(reader.result);
    // });
    reader.onload = function (e) {
      console.log(e.target.result);
    };
    reader.readAsText(file, "utf-8");
  } catch (e) {
    console.log(e);
  }
});

async function handleDir(handle) {
  if (handle.kind === "file") {
    return handle;
  }
  handle.children = [];
  const iter = handle.entries();
  for await (const [k, v] of handle) {
    console.log(k, v);
    handle.children.push(await handleDir(v));
  }
  return handle;
}
```

### FileReader

FileReader 是 JavaScript 中的一个构造函数，用于读取 File 或 Blob 对象中的内容。以下是 FileReader 的几个属性和事件方法：

- 属性：

  1. `FileReader.readyState`：

     - 返回 FileReader 的当前状态。可能的值有：
       - 0 - EMPTY：还没有加载任何数据。
       - 1 - LOADING：数据正在被加载。
       - 2 - DONE：已完成全部的读取请求。

  2. `FileReader.result`：
     完成读取操作后的文件内容。这个属性的类型取决于读取操作的方法（例如，可以是 ArrayBuffer, text, 或 DataURL 等）。

  3. `FileReader.error`：
     在读取操作发生错误时返回一个 DOMException。

- 事件方法：

  1. `FileReader.onloadstart`：
     - 是一个处理 loadstart 事件的事件处理器。这个事件在读取操作开始时触发。
  2. `FileReader.onprogress`：
     - 是一个处理 progress 事件的事件处理器。这个事件在读取 Blob 时触发。
  3. `FileReader.onload`：
     - 是一个处理 load 事件的事件处理器。这个事件在读取操作完成时触发。
  4. `FileReader.onabort`：
     - 是一个处理 abort 事件的事件处理器。这个事件在读取操作被中断时触发，比如通过调用 FileReader.abort() 方法。
  5. `FileReader.onerror`：
     - 是一个处理 error 事件的事件处理器。这个事件在读取操作发生错误时触发。
  6. `FileReader.onloadend`：
     - 是一个处理 loadend 事件的事件处理器。这个事件在读取操作完成时触发，无论读取成功还是失败。

- 实例方法:

  - 主要用于启动读取 File 或 Blob 中数据的操作。以下是 FileReader 的实例方法：

    1.  `readAsArrayBuffer(blob)`：
        - 读取 Blob 或 File 对象的内容为一个 ArrayBuffer。当读取操作完成时，result 属性将包含一个 ArrayBuffer 对象表示文件的数据。
    2.  `readAsBinaryString(blob)`：
        - 读取 Blob 或 File 对象的内容为一个二进制字符串。每个元素的值将是一个表示文件中字节的 0 至 255 之间的整数。
    3.  `readAsDataURL(blob)`：
        - 读取 Blob 或 File 对象的内容为一个数据 URL。当读取操作完成时，result 属性将包含一个数据 URL 字符串。
    4.  `readAsText(blob, [encoding])`：
        - 读取 Blob 或 File 对象的内容为文本字符串。可以指定文本的编码，默认为 UTF-8。当读取操作完成时，result 属性将包含一个文本字符串。
    5.  `abort()`：
        - 中止读取操作。在返回结果前，可以调用此方法终止操作。

    - 这些方法都是异步的，它们会立即返回并在后台处理文件读取。读取结果可以通过上述的事件处理器（如 `onload`）来访问。

- 示例代码：

```js
const fileInput = document.querySelector('input[type="file"]');
const reader = new FileReader();

// 当开始读取文件时
reader.onloadstart = function (event) {
  console.log("Read operation started");
};

// 当文件读取正在进行时
reader.onprogress = function (event) {
  if (event.lengthComputable) {
    const percentLoaded = Math.round((event.loaded / event.total) * 100);
    console.log(`Progress: ${percentLoaded}%`);
  }
};

// 当文件读取成功完成时
reader.onload = function (event) {
  console.log("Read operation completed successfully");
  console.log(reader.result);
};

// 当文件读取被中止时
reader.onabort = function (event) {
  console.log("Read operation aborted");
};

// 当文件读取失败时
reader.onerror = function (event) {
  console.log("Read operation failed");
};

// 当文件读取操作结束时（无论成功或失败）
reader.onloadend = function (event) {
  console.log("Read operation finished");
};

// 当文件被选择后，读取文件内容为文本
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    reader.readAsText(file);
  }
});
```

### flatMap

数组方法 `flatMap()` 本质上是 `map()`和 `flat()` 的组合，区别在于 flatMap 只能扁平 1 级，flat 可以指定需要扁平的级数，使用 Infinity 可以展开任意深度的嵌套数组。flatmap 比分别调用这两个方法稍微高效一些。

### console

1. 测量代码块的性能

```js
// console.profile profileEnd
// 测量代码块的性能。这对于识别性能瓶颈以及优化代码以提高速度和效率非常有用。
console.profile("MyProfile");
// 想要测量性能的代码
for (let i = 0; i < 100000; i++) {
  // ...code
}
console.profileEnd("MyProfile");
```

### 深拷贝 structuredClone()

现在，JavaScript 内置了一个 `structuredClone()` 的方法， 此方法提供了一种简单有效的方法来深度克隆对象， 且适用于大多数现代浏览器和 Node.js v17 以上。`structuredClone()` 允许您克隆循环引用，这是目前在 JavaScript 中使用深拷贝最简单的方法。

### 带标签的模板

是模板字符串(反引号)的一种更高级的形式，它允许你使用函数解析模板字面量。是安全的。

```js
const checkCurrency = function (currency, amount) {
  const symbol = currency[0] === "USD" ? "$" : "¥";
  console.log(currency[0], "--", currency[1]); // Outputs: USD -- RMB
  return `${symbol}${amount}`;
};
const amount = 200;
const currency = checkCurrency`USD${amount}RMB`;
console.log(currency); // Outputs: $200
// 1. checkCurrency是一个函数，标签函数的第一个参数currency包含一个字符串值数组
// 2. 字符串数组由标签模板里的字符串组成，在`USD${amount}RMB`里，字符串有USD和RMB
// 3. 因此 currency[0] 为第一个字符串 USD， currency[1] 则是第二个字符串 RMB
// 3. checkCurrency函数的其余参数则根据表达式直接插入到字符串中，如 amount = 200
// 4. 在checkCurrency函数的内部，判断第一个参数数组首项是否是‘USD’，是则选择"$"符号，否则是 "¥"
// 5. 函数内部将symbol和amount结合在一起返回一个新的字符串，symbol代表货币符号，而amount代表传递给函数的金额。
// 6. 返回的字符串赋值给 currency 常量， 因此 log为 $200
```

### 生成器 (Generator) 和 迭代器 (iterators)

假如在一个获取数据的场景下，数据库/ API 的数据量可能是无限的，而你必须将它们传输到前端，最常用的方案就是无限加载方案。

```js
// 异步生成器(async generators)

async function* fetchProducts() {
  while (true) {
    const productUrl = "https://fakestoreapi.com/products?limit=2";
    const res = await fetch(productUrl);
    const data = await res.json();
    yield data;
    // 在这里操作用户界面
    // 或将其保存在数据库或其他地方
    // 将其用作副作用的地方
    // 即使某些条件匹配，也中断流程
  }
}
async function main() {
  const itr = fetchProducts();
  // 这应该根据用户交互来调用
  // 或者其他技巧，因为您不希望出现无限加载。
  console.log(await itr.next());
}
main();
```

### 私有类字段

现在，JavaScript 类支持使用#符号的私有字段。私有字段不能从类外部访问，从而提供封装和信息隐藏。

```js
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }

  getCount() {
    return this.#count;
  }
}

const counter = new Counter();
counter.increment();
console.log(counter.getCount()); // 1
console.log(counter.#count); // 1
```

### Promise.allSettled()

Promise.allSettled() 方法返回一个 Promise，该 Promise 在所有给定的 Promise 已经 resolve 或 reject 后 resolve，提供每个 Promise 的结果数组。

```js
const promises = [Promise.resolve("Resolved"), Promise.reject("Rejected")];

Promise.allSettled(promises).then((results) => {
  console.log(results);
});
// [{ status: "fulfilled", value: "Resolved" }, { status: "rejected", reason: "Rejected" }]
```

### globalThis 全局对象

globalThis 对象提供了一种在不同环境下（包括浏览器和 Node.js）访问全局对象的一致方式。

```js
console.log(globalThis === window); // 在浏览器场景下: true
console.log(globalThis === global); // 在 Node.js 中: outputs: true
```

### clipborad

在 JavaScript 中，操作剪贴板的功能主要依赖于 Clipboard API 和一些 DOM 方法。以下是关于如何使用这些 API 进行剪贴板操作的详细介绍，包括复制和粘贴文本的示例。

1. 使用 `navigator.clipboard.writeText()` 方法可以将文本复制到剪贴板。

```js
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("文本已复制到剪贴板：", text);
    })
    .catch((err) => {
      console.error("复制失败：", err);
    });
}

// 使用示例
copyToClipboard("Hello, World!");
```

2. 从剪贴板粘贴文本
   使用 `navigator.clipboard.readText()` 方法可以从剪贴板读取文本。

```js
function pasteFromClipboard() {
  navigator.clipboard
    .readText()
    .then((text) => {
      console.log("从剪贴板中读取到的文本：", text);
      // 你可以将读取到的文本插入到页面中
      document.getElementById("output").innerText = text;
    })
    .catch((err) => {
      console.error("读取剪贴板内容失败：", err);
    });
}

// 使用示例
pasteFromClipboard();
```

3. 注意事项

   1. 在使用 Clipboard API 之前，需要检查浏览器是否支持该功能。可以使用 `if ('clipboard' in navigator)` 语句来检查浏览器是否支持 Clipboard API。
   2. 浏览器可能会要求用户的许可才能访问剪贴板。某些操作可能会受到限制。
   3. Clipboard API 在安全上下文中（如 HTTPS）才能使用。确保你的应用在安全环境中运行。

### 较新的 APIs

#### Array.prototype.at(index)

允许通过索引访问数组中的元素，支持负数索引，可以从数组末尾开始计数。

#### Array.prototype.with(index, newValue)

返回一个新数组，该数组是原数组的副本，但指定索引处的元素被替换为新的值。可用来快速替换数组中的某个值并返回新数组。可以接收负数索引。

#### Array.prototype.toSorted((a,b)=>a-b)

返回一个新数组，是原数组经过排序后的副本，不会修改原数组。传统的 sort()方法会修改原数组。

#### Array.prototype.toReversed()

返回一个新数组，是原数组经过反转后的副本，不会修改原数组。传统的 reverse()方法会修改原数组。

#### Array.prototype.toSpliced(startIndex, deleteCount, ...items)

返回一个新数组，是原数组经过删除、插入或替换元素后的副本，不会修改原数组。类似于 splice()方法，但返回的是新数组。传统的 splice()方法会修改原数组。

#### Array.prototype.findLast(callback)

返回数组中满足提供的测试函数条件的最后一个`元素的值`，如果没有找到则返回 undefined。类似于 find()方法，但查找方向是从后向前。

- `Array.prototype.find(callback(element, index, array), thisArg)`：返回数组中第一个符合条件的`元素的值`（依据回调函数返回 true 的条件）。如果没有找到符合条件的元素，则返回 undefined。
- `Array.prototype.findIndex(callback(element, index, array), thisArg)`：返回数组中第一个符合条件的`元素的索引`。若没有找到符合条件的元素，则返回 -1。
- `Array.prototype.findLast(callback(element, index, array), thisArg)`：返回数组中满条件的最后一个`元素的值`，如果没有找到则返回 undefined。
- `Array.prototype.findLastIndex(callback(element, index, array), thisArg)`：返回数组中最后一个符合条件的`元素的索引`。若没有找到符合条件的元素，则返回 -1。

类似的数组查找的方法还有：

- `Array.prototype.filter(callback)`：返回由所有符合条件的元素组成的新数组。不会停止遍历，即使找到符合条件的元素。
- `Array.prototype.some(callback)`：检查数组中是否至少有一个元素符合条件，返回布尔值（true 或 false）。
- `Array.prototype.every(callback)`：检查数组中是否所有元素都符合条件。返回布尔值（true 或 false）。
- `Array.prototype.includes(target)`：检查数组中是否包含某个具体值。返回布尔值（true 或 false）。
- `Array.prototype.indexOf(target)`：返回数组中首次出现某个值的索引，找不到则返回 -1。
- `Array.prototype.lastIndexOf(target)`：返回数组中最后一次出现某个值的索引，找不到则返回 -1。

#### ES6 之后部分新的 API

1. Array.prototype.includes()
2. 指数幂运算符 `**`
3. Object.values()/Object.entries()
4. String.prototype.padStart() 和 String.prototype.padEnd()
5. async 和 await
6. Object.rest 和 Object.spread：扩展运算符（...）可用于对象
7. Promise.prototype.finally()
8. Array.prototype.flat()
9. Array.prototype.flatMap(callback)：先映射每个元素然后将结果展平（深度为 1）。`console.log([1,2,3].flatMap(x => [x, x * 2])); // [1, 2, 2, 4, 3, 6]`
10. Object.fromEntries()：将键值对数组转换为对象（与 Object.entries() 相反）。`console.log(Object.fromEntries([['a', 1], ['b', 2]])); // { a: 1, b: 2 }`
11. String.prototype.trimStart() 和 String.prototype.trimEnd()，`trim()`是开头结尾的空白字符都会去除。
12. 可选链操作符（?.）
13. 空值合并操作符（??）：提供默认值，只在左侧值为 null 或 undefined 时返回右侧的值。
14. Promise.allSettled()：等待所有 Promise 都结束（无论是 fulfilled 还是 rejected），并返回每个 Promise 的结果。
15. 全局 globalThis：提供一个统一本地环境（浏览器、Node.js）下的全局对象。
16. String.prototype.replaceAll()：替换字符串中 所有匹配的子字符串。
