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

### IntersectionObserver

IntersectionObserver 可以用于检测元素是否进入视口，可以用于实现无限滚动、懒加载等功能。

```js
const myObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log(`${entry.target.id} is now visible`);
      observer.unobserve(entry.target);
    }
  });
});
const myElement = document.getElementById("myElement");
myObserver.observe(myElement);
```

使用场景：在 Web 应用中，可能需要实现无限滚动、懒加载等功能，使用 IntersectionObserver 可以方便地实现这些功能。

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

1. 在进行`[] == ![]`判断时，在JS引擎内部，会将这行代码执行成这个样子：

```js
[] == ![]

[] == !true // 将空数组这个对象类型转换成布尔值

[] == false // ! 运算符对 true 进行取反

'' == false // 对 [] 进行 ToPrimitive 操作，返回一个空对象

0 == 0 // 将等号两边都转换成数字类型
```

###

```js

```

###

```js

```
