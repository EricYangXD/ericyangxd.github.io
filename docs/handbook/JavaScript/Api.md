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

Reflect API 可以用于实现元编程，例如动态调用对象的方法或构造函数。**可以完成对象的基本操作**：get、set、has、delete、construct、apply 等。Reflect**可以直接调用浏览器的原生 API**，而不需要自己实现。

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

#### Vue3 中的 Reflect

Vue3 中的 Reflect 是一个用于处理响应式数据的工具，它提供了一些方法，用于获取和设置响应式数据的属性，以及监听数据的变化。

```js
const obj = {
  a: 1,
  b: 2,
  get c() {
    console.log("this", this);
    return this.a + this.b;
  },
};

console.log(Reflect.get(obj, "a"));
console.log(Reflect.get(obj, "b"));
console.log(Reflect.get(obj, "c"));
// 输出：
// 1 2 this {a:1, b:2} 3

const handler = new Proxy(obj, {
  // target 是被代理的对象。
  // prop 是被访问的属性。
  // receiver 是实际调用对象的引用，确保正确的上下文。
  get(target, prop, receiver) {
    console.log("get", prop);
    // 通过代理获取间接属性c的时候，通过Reflect.get()获取属性值，可以拦截到对this.a和this.b属性的访问。
    // 使用 Reflect.get 可以确保 this 关键字在访问 getter 时指向正确的上下文。
    return Reflect.get(target, prop, receiver);
    // return target[prop]; // 这样其实也可能得到预期的结果，但是，对a和b的访问就不会被拦截到了。也就不会输出get a get b，而是直接输出 3。
  },
});

console.log(handler.a);
console.log(handler.b);
// 在 handler.c 被访问时，this 将指向 handler代理对象，而不是 obj 对象。这可能导致 this.a 和 this.b 的值是 undefined，并且 c 的计算将不会如预期那样工作。
// 直接返回 target[prop] 将无法触发 getter 中的逻辑，特别是对于 c 这个属性。
console.log(handler.c);

// 输出：
// get a 1 get b 2 get c this Proxy(Object){a:1, b:2} get a get b 3
```

```js
const targetObj = {
  a: 1,
  b: 2,
  get sum() {
    // 在 getter 中，this 默认指向代理对象 (proxy)，而不是 targetObj
    console.log("this in targetObj", this);
    console.log(this === targetObj); // 这个应该输出 `false`
    return this.a + this.b;
  },
};

const proxy = new Proxy(targetObj, {
  get(target, prop, receiver) {
    console.log("this in proxy get", this);
    console.log("Accessing property:", prop);
    return target[prop];
  },
});

console.log(proxy.sum); // 访问 `sum` 这个 getter
// 输出：
// this in proxy get {get: ƒ}get: ƒ get(target, prop, receiver)[[Prototype]]: Object
// Accessing property: sum
// this in targetObj {a: 1, b: 2}
// true
// 3
```

使用 receiver 的好处在于，当属性是由一个 getter 定义时，确保 this 在 getter 中指向正确的对象。例如，在 getter 中调用 this.a 时，this 会指向 receiver，而不是 target。如果你使用 `Reflect.get(target, prop, receiver)`，在访问 proxy.c 时，this 在 getter 中将指向 proxy，这使得可以通过代理访问更多的上下文。

一句话来说，receiver 的作用是确保 getter 中的 this 引用正确的上下文（让 this 指向 receiver，即我们创建的这个代理对象 proxy），从而可以正确地访问属性。这样在访问对象属性的时候都会通过 proxy 拦截的到，即是访问的是 getter 定义的属性。

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

### Object.entries()/Object.values()/Object.keys()

`Object.entries()` 用于获取对象的可枚举属性和值的**二维数组**，`Object.values()` 用于获取对象的可枚举属性值的**数组**，`Object.keys()` 用于获取对象的可枚举属性的**数组**。

```js
const myObject = {
  name: "John",
  age: 30,
};
console.log(Object.entries(myObject)); // [["name", "John"], ["age", 30]]
console.log(Object.values(myObject)); // ["John", 30]
console.log(Object.keys(myObject)); // ["name", "age"]
```

使用场景：在某些情况下，可能需要获取对象的可枚举属性或属性值。使用 Object.entries()/Object.values()/Object.keys() 可以方便地实现这些功能。

### IntersectionObserver

IntersectionObserver 是一种浏览器原生提供的 API，**用于监听目标元素与其祖先元素（或视口）之间的交集变化**。换句话说，它可以检测目标元素是否进入、离开或在特定区域中（如视口）可见，以及交集的比例。是**异步的，不会阻塞主线程**，性能远高于基于 scroll 事件的监听。可以**精准控制监听的元素和范围，减少不必要的 DOM 操作**。原本需要复杂逻辑的滚动监听，现在通过简单配置即可实现。

相比以往使用 scroll 事件监听滚动位置的方式，IntersectionObserver 不仅性能更高，而且更加易用，能够显著减少 DOM 操作和性能瓶颈。

**可以用于实现无限滚动、懒加载图片、元素曝光统计、动画触发等功能**。

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
    // 新API，可以避免insertBefore的某些副作用：页面闪烁、滚动位置重置、动画重置等
    // container.moveBefore(newItem, sentinel);
  }
  observer.observe(sentinel); // 重新开始观察
}
```

### MutationObserver

一种高级的浏览器 API，**用于异步监听 DOM 的变化**。它可以检测 DOM 结构中的以下变化：

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

- MutationObserver 不能直接监听嵌套的 iframe 中的 DOM 变化。MutationObserver 只能观察同一文档中的 DOM 变更，因此在跨文档（如嵌套 iframe）的情况下，它无法直接监控内部 iframe 的内容。由于浏览器的同源策略，如果 iframe 的内容来自不同的源（域名、协议、端口不同），则无法访问其 DOM，也就无法使用 MutationObserver 监听其变化。
- MutationObserver 不支持跨文档通信，它只能观察同一文档中的 DOM 变化。如果需要在跨文档（如嵌套 iframe）中进行通信，可以使用 postMessage 方法。
- 对于同源的文档：如果 iframe 中的内容与你的主文档是同源的，你可以在 iframe 内部创建一个 MutationObserver，并在需要观察的 DOM 中使用该观察者。
- 对于跨域文档：如果 iframe 中的内容来自不同的源，通常可以通过 postMessage API 实现与主文档之间的通信。你可以在 iframe 的脚本中监控 DOM 变化，并通过 postMessage 将变化信息发送回主文档。`window.parent.postMessage(...);`

### IntersectionObserver 和 MutationObserver 的区别

- MutationObserver 用于监听 DOM 变化，而 IntersectionObserver 用于监听元素与视口或某个指定元素相交的情况。

| API      | IntersectionObserver             | MutationObserver                      |
| -------- | -------------------------------- | ------------------------------------- |
| 观察内容 | 观察元素与视口的交叉状态         | 观察 DOM 元素的更改                   |
| 主要用途 | 用于懒加载、无限滚动、广告监控等 | 用于检测 DOM 变化，实时更新 UI        |
| 设置方式 | 通过根元素、边距和阈值设置       | 通过配置选项如子节点变化、属性变化等  |
| 触发时机 | 当目标元素进入或离开视口时触发   | 当 DOM 发生变化时触发                 |
| 性能     | 性能较高，使用异步处理           | 相对较高的性能，适用于频繁的 DOM 更新 |

### ResizeObserver

ResizeObserver 是一个用于监听 DOM 元素尺寸变化的 API，它允许开发者在元素尺寸发生变化时进行响应。

```js
const element = document.querySelector(".resize-me");

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    console.log("Element size:", entry.contentRect.width, entry.contentRect.height);
  }
});

resizeObserver.observe(element);
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

### Truthy 和 Falsy

1. 在 JavaScript 中，真值是在布尔值上下文中，转换后的值为 true 的值。被定义为假值以外的任何值都为真值。（即所有除`false`、`0`、`-0`、`0n`、`""`、`null`、`undefined` 和`NaN` 以外的皆为真值）。
2. `Truthy`：除了 `false`、`0`、`+0`、`-0`、`+0n`、`-0n`、`''`、`null`、`undefined`、`NaN` 之外的值都是 `Truthy`，包括`new Boolean(false)`。而对于`Boolean(false)`，由于他返回的是 false，所以`let b = Boolean(false);`==>`b === false`。

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

### Array.fill()

Array.fill() 方法用于用一个固定值填充一个数组中的所有元素。如果是基础类型，则填充的是该类型的值。**如果是对象，则填充的是该对象的引用**。所以要注意对象引用的复制。

```js
// 创建一个二维数组，初始值都为0
const doubleArr = new Array(m).fill(0).map(() => new Array(n).fill(0));

const singleArr = new Array(n).fill(0);
```

### setTimeout()

用于延迟执行某个函数的一个重要方法：`setTimeout(callback, delay, [arg1], [arg2], [...]);`，delay 后面的是可选参数，可以在调用 setTimeout 的时候传递给 callback 函数。setTimeout 返回一个定时器 timerId，这是一个整数，可以用于后续取消该定时器。配合`clearTimeout(timerId);`取消定时器。在某些浏览器中，延迟时间的最小值受到限制。如果设置为小于 4 毫秒的值，浏览器可能会将其视为 4 毫秒。如果设成 0 的话，就表示立即执行：放到宏任务队列里等待执行。不及时清除定时器的话可能会导致内存泄漏。

```js
function greet(name) {
  console.log(`Hello, ${name}!`);
}

const timer = setTimeout(greet, 3000, "Alice");

clearTimeout(timer);
```

### getElementById()和 querySelector()的用法与区别

#### getElementById()

1. getElementById() 方法用于通过元素的 id 属性获取一个元素。
2. 它返回第一个匹配的元素，如果找不到元素，则返回 null。
3. 它是 HTML DOM 的一部分，用于访问和操作文档对象模型（DOM）中的元素。
4. 它在 HTML 文档中查找元素，并返回第一个匹配的元素。
5. 速度极快，因为它直接在 DOM 中查找元素，而不需要解析 CSS 选择器，浏览器内部维护了一个 ID 索引表，查找时间复杂度接近 O(1)。
6. 所有浏览器都支持，无效 ID 不会抛出异常。
7. 不能再在其他 DOM 元素上继续使用，因为 ID 值在整个网页中必须保持唯一。因此没有必要为这个方法创建所谓的“局部”版本。只能用在 window.document 上。
8. 动态引用（保持对元素的实时引用）。dom 被动态修改之后，会自动更新。

#### querySelector()

1. querySelector() 方法用于通过 CSS 选择器获取一个元素。
2. 它返回第一个匹配的元素，如果没有匹配的元素，则返回 null。匹配是使用深度优先先序遍历，从文档标记中的第一个元素开始，并按子节点的顺序依次遍历。
3. 它是 CSS 选择器 API 的一部分，用于访问和操作文档对象模型（DOM）中的元素。
4. 它在 HTML 文档中查找元素，并返回第一个匹配的元素。
5. 它支持任意 CSS 选择器，允许使用 CSS 选择器来匹配元素。
6. 相对较慢，因为需要解析 CSS 选择器并遍历 DOM 树，复杂选择器性能更低，在循环中频繁使用时应缓存结果。如果选择器很简单的话貌似速度更快。
7. IE8+，无效选择器会抛出异常。
8. 可以在其他 dom 元素上继续使用，因为 CSS 选择器是字符串，可以动态生成。
9. 始终返回初始节点的快照，返回静态引用，不跟踪 DOM 更新。

```js
// 通过ID选择
const el1 = document.querySelector("#header");

// 通过类名选择
const el2 = document.querySelector(".menu-item.active");

// 通过标签+属性选择
const el3 = document.querySelector('input[type="text"]');

// 复杂选择器
const el4 = document.querySelector("div.content > p:first-child");
const target = document.querySelector("#container>div:nth-child(2) > span");
```

### 较新的 APIs

#### designMode

1. `document.designMode = "on";`可以直接把网页变为可编辑的。
2. `<div contenteditable="true">这是一个可编辑的文本区域。你可以在这里输入文本。</div>`HTML 的 contenteditable 属性可以添加到任何 HTML 元素上，使该元素的内容可编辑。
3. `<textarea contenteditable="true"></textarea>`也可以添加一个可编辑区域。常规做法。
4. js 动态设置 dom 元素的 attribute 属性为`contenteditable=true`。

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

#### fetch

fetch 是一个用于在浏览器和 Node.js 中进行 HTTP 请求的 API。它提供了一种更简单的方式来发送 HTTP 请求，并返回一个 Promise 对象，该 Promise 对象在请求完成时解析为响应。fetch 不会自动将响应体解析为 JSON 或其他格式，需要手动进行解析。fetch 的基本用法如下：

```javascript
fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    age: 30,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

1. fetch() 方法接受一个 URL 作为参数，并返回一个 Promise 对象。
2. fetch 函数接收两个参数，第一个是请求的 URL，第二个是一个可选的配置对象。以下是一些常见的配置选项：
   - method: 请求方法（GET, POST, PUT, DELETE 等）。
   - headers: 请求头，通常是一个对象。
   - body: 请求体，适用于 POST 和 PUT 请求，通常是字符串格式的数据。
   - mode: 请求的模式（如 cors, no-cors, same-origin）。
   - credentials: 跨域请求时是否携带 cookies（如 omit, same-origin, include）。
   - cache: 缓存策略（如 default, no-cache, reload, force-cache, only-if-cached）。
3. 使用 fetch 时，网络错误会被 Promise 的 catch 捕获，但是如果 HTTP 响应状态码是 4xx 或 5xx，fetch 仍会成功解析 Promise，但 response.ok 会是 false。通常需要手动检查响应状态。
4. fetch 的响应是一个 Response 对象，它包含响应头、响应体和响应状态码等属性。
5. fetch 的响应体是一个 ReadableStream 对象，它提供了一种异步读取响应体的方式。要读取响应体，可以使用 response.text()、response.json()、response.blob()、response.arrayBuffer()、response.formData() 等方法。
6. 使用 AbortController 可以中止一个正在进行的 fetch 请求：

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch("https://api.example.com/data", { signal })
  .then((response) => {
    // 处理响应
  })
  .catch((error) => {
    if (error.name === "AbortError") {
      console.log("Fetch request was aborted");
    } else {
      console.error("Fetch error:", error);
    }
  });

// 中止请求
controller.abort();
```

7. 如果请求失败，可以实现简单的重试逻辑：

```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // 如果是最后一次重试，抛出错误
    }
  }
}

// 使用示例
fetchWithRetry("https://api.example.com/data", { method: "GET" })
  .then((data) => console.log(data))
  .catch((error) => console.error("Fetch error:", error));
```

#### AbortSignal 和 AbortController 有啥区别

AbortSignal 和 AbortController 是两个用于取消异步操作的 API。AbortController 是控制中止操作的核心工具，提供了 abort() 方法用于触发中止。AbortSignal 是用于传递中止信息的信号对象，异步任务通过监听该信号的状态来决定是否需要终止。两者是配套使用的，AbortController 创建并控制 AbortSignal，而异步任务（如 fetch）依赖 AbortSignal 来响应中止请求。

1. AbortController 是一个构造函数，它用于创建一个 AbortSignal 对象。
   - signal 属性返回关联的 AbortSignal。
   - abort() 方法触发中止。
2. AbortSignal 是一个接口，它表示一个异步操作的取消信号。它被用于向异步操作发送取消信号，以便取消正在进行的操作。
   - aborted 属性表示是否已中止。
   - abort 事件触发时执行回调。
3. AbortSignal 对象是一个只读属性，它表示一个异步操作的取消信号。当 AbortSignal 对象被设置为 true 时，表示该异步操作已被取消。
4. AbortSignal 和 AbortController 的主要区别在于它们在 cancel 操作中的使用方式。
5. abort 的请求属于 promise 内部的错误，只能通过 fetch 的 catch 捕获，不能通过外部的 try-catch 捕获。`signal.addEventListener("abort", () => {})`可以监听到 abort 事件。`signal.abort()方法可以触发 abort 事件。signal.aborted 表示是否已中止。signal.reason 表示中止的原因。`

```javascript
// 创建一个 AbortController 实例
const controller = new AbortController();
const signal = controller.signal;

// 监听 abort 事件
signal.addEventListener("abort", () => {
  console.log("The operation was aborted!");
});
try {
  // 发起请求
  fetch("https://jsonplaceholder.typicode.com/users/3", { signal })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("The fetch request was aborted!");
      } else {
        console.error("Fetch error:", error);
      }
    });
} catch (e) {
  console.log(e);
}
// 中止请求
controller.abort();
// console: The operation was aborted!
// console: Fetch error: AbortError: The operation was aborted.
```

6. 如果开发者想从多个信号中中止，可以使用 AbortSignal.any() 组合成单个信号，比如下面的示例：

```javascript
try {
  const controller = new AbortController();
  const timeoutSignal = AbortSignal.timeout(5000);
  const res = await fetch(url, {
    // This will abort the fetch when either signal is aborted
    signal: AbortSignal.any([controller.signal, timeoutSignal]),
  });
  const body = await res.json();
} catch (e) {
  if (e.name === "AbortError") {
    // Notify the user of abort.
  } else if (e.name === "TimeoutError") {
    // Notify the user of timeout
  } else {
    // A network error, or some other problem.
    console.log(`Type: ${e.name}, Message: ${e.message}`);
  }
}
```

7. 很多老版本的 DOM API 其实并不支持 AbortSignal，例如：WebSocket，其只有一个 .close() 方法用于在请求完成后关闭连接。此时，开发者可以通过判断`signal.aborted`来判断是否被中断，然后手动关闭`ws.close()`。
8. 通过`controller.abort();`移除事件处理函数，开发者只需要将 signal 传递给 addEventListener 的第三个参数即可。`window.addEventListener("resize", () => doSomething(), { signal });`，不需要再手动 removeEventListener。
9. React hooks 中的异步任务：在 React 中，如果 Effect 在再次触发之前没有完成，开发者一般不容易发现，此时 Effect 会并行运行。那么我们可以借助 AbortController，每当下一个 useEffect 调用运行时就中止上一个请求：

```jsx
function FooComponent({something}) {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const p = (async () => {      // 真正执行的逻辑
      const j = await fetch(url, { signal });      // 这里处理返回值
    })();
    return () => controller.abort();
  }, [something]);

  return <>xxx<>;
}
```

10. 值得一提的是， TaskController 是 AbortController 的子级，除了可以调用 abort() 取消 task，还可以通过 setPriority() 方法中途修改 task 的优先级，如果不需要控制优先级，则可以直接使用 AbortController。
