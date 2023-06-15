---
title: 记录一些常见的函数实现1
author: EricYangXD
date: "2022-02-09"
---

## 手写某些函数，理解其原理

### 防抖 debounce

防抖 (debounce): 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需在输入完成后做一次输入校验即可。

```js
function debounce(fn, wait, immediate) {
  let timer = null;

  return function () {
    let args = arguments;
    let context = this;

    if (immediate && !timer) {
      fn.apply(context, args);
    }

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
```

极简版

```js
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = 0;
    }, delay);
  };
}
```

### 节流 throttle

节流(throttle): 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms 执行一次即可。

```js
function throttle(fn, wait, immediate) {
  let timer = null;
  let callNow = immediate;

  return function () {
    let context = this,
      args = arguments;

    if (callNow) {
      fn.apply(context, args);
      callNow = false;
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
}
```

极简版

```js
function throttle(fn, delay) {
  let timer = 0; // 上次触发时间
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = 0;
    }, delay);
  };
}
```

### 坐标转换

1. 百度坐标转高德（传入经度、纬度）

```js
function bd_decrypt(bd_lng, bd_lat) {
  var X_PI = (Math.PI * 3000.0) / 180.0;
  var x = bd_lng - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return { lng: gg_lng, lat: gg_lat };
}
```

2. 高德坐标转百度（传入经度、纬度）

```js
function bd_encrypt(gg_lng, gg_lat) {
  var X_PI = (Math.PI * 3000.0) / 180.0;
  var x = gg_lng,
    y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    bd_lat: bd_lat,
    bd_lng: bd_lng,
  };
}
```

## 发布订阅模式

```js
class EventEmitter {
  constructor() {
    this.cache = {};
  }

  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn);
    } else {
      this.cache[name] = [fn];
    }
  }

  off(name, fn) {
    const tasks = this.cache[name];
    if (tasks) {
      const index = tasks.findIndex((f) => f === fn || f.callback === fn);
      if (index >= 0) {
        tasks.splice(index, 1);
      }
    }
  }

  emit(name, once = false) {
    if (this.cache[name]) {
      // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
      const tasks = this.cache[name].slice();
      for (let fn of tasks) {
        fn();
      }
      if (once) {
        delete this.cache[name];
      }
    }
  }
}

// 测试
const eventBus = new EventEmitter();
const task1 = () => {
  console.log("task1");
};
const task2 = () => {
  console.log("task2");
};

eventBus.on("task", task1);
eventBus.on("task", task2);
eventBus.off("task", task1);
setTimeout(() => {
  eventBus.emit("task"); // task2
}, 1000);
```

## 随机颜色

```js
function randomHexColor() {
  return "#" + ("0000" + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6);
}
```

或者使用`#${(~~(Math.random()*(1<<24))).toString(16)}`

## RGB 转换为 HEX

```js
const rgbToHex = (r, g, b) => {
  const toHex = (num) => {
    const hex = num.toString(16);
    return `${hex.toString().padStart(2, 0)}`;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
```

## 过滤数组中的 falsy 值

`const truthy = nums.filter(Boolean);`

## 检测是否能跨域

```js
function corsEnabled(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("HEAD", url, false);
  try {
    xhr.send();
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299;
}
```

## 数组乱序 Fisher–Yates

原理：遍历数组元素，吧当前元素与之后的随机位置的元素交换位置。

缺陷：理论上会有可能 shuffle 结果和原数组相同的情况。

```js
function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}
```

## 面试题

### 异步控制并发数

```js
function limitRequest(urls = [], limit = 3) {
  return new Promise((resolve, reject) => {
    const len = urls.length;
    let count = 0;

    // 同时启动limit个任务
    while (limit > 0) {
      start();
      limit -= 1;
    }

    function start() {
      const url = urls.shift(); // 从数组中拿取第一个任务
      if (url) {
        axios
          .post(url)
          .then((res) => {
            // todo
          })
          .catch((err) => {
            // todo
          })
          .finally(() => {
            if (count == len - 1) {
              // 最后一个任务完成
              resolve();
            } else {
              // 完成之后，启动下一个任务
              count++;
              start();
            }
          });
      }
    }
  });
}

// 测试
limitRequest(["http://xxa", "http://xxb", "http://xxc", "http://xxd", "http://xxe"]);
```

### ES5 继承（寄生组合继承）

```js
// 1.定义Parent父类
function Parent(name) {
  this.name = name;
}
Parent.prototype.eat = function () {
  console.log(this.name + " is eating");
};
// 2.定义Child子类
function Child(name, age) {
  // 3.Parent.call() 继承Parent
  Parent.call(this, name);
  this.age = age;
}
// 4.Object.create复制Parent的原型
Child.prototype = Object.create(Parent.prototype);
// 5.定义Child的constructor为Child
Child.prototype.constructor = Child;

// 测试
let xm = new Child("xiaoming", 12);
console.log(xm.name); // xiaoming
console.log(xm.age); // 12
xm.eat(); // xiaoming is eating
```

### ES6 继承

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + " is eating");
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}

// 测试
let xm = new Child("xiaoming", 12);
console.log(xm.name); // xiaoming
console.log(xm.age); // 12
xm.eat(); // xiaoming is eating
```

### 行为委托

是《你不知道的 JavaScript》系列作者 kyle 大佬推荐的一种代替继承的方式，该模式主要利用 setPrototypeOf 方法把一个对象的内置原型`[[Protytype]]`关联到另一个对象上，从而达到继承的目的。

```js
let SuperType = {
  initSuper(name) {
    this.name = name;
    this.color = [1, 2, 3];
  },
  sayName() {
    alert(this.name);
  },
};
let SubType = {
  initSub(age) {
    this.age = age;
  },
  sayAge() {
    alert(this.age);
  },
};
Object.setPrototypeOf(SubType, SuperType);
SubType.initSub("17");
SubType.initSuper("gim");
SubType.sayAge(); // 'gim'
SubType.sayName(); // '17'
```

![行为委托](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/xwwt.png "行为委托")

### sleep 函数

配合 async/await 休眠几秒，然后继续执行。

```js
const sleep = (timeoutMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeoutMs);
  });
```

### ['1', '2', '3'].map(parseInt)

输出：`[1, NaN, NaN]`

原理：

1. Array.prototype.map(callback, thisArg)，接收一个回调函数和 this，一般使用时只会用第一个参数。
2. parseInt(string, radix)，接收一个字符串并返回指定基数的十进制整数，radix 是 2-36 之间的整数，表示被解析字符串的基数。当

- radix 小于 2 或大于 36 ，或
- 第一个非空格字符不能转换为数字。

时，会返回 NaN。

### 隐式类型转换

![隐式类型转换](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/type-trans.png)

### 判断是否运行在移动端

```js
function isRunMobile() {
  return /Android|webOS|iPhone|iPad|BlackBerry/i.test(window.navigator.userAgent);
}
```

### URLSearchParams 快速解析 URL 中的参数，可以替代 querystring

- url.searchParams 的构造函数就是 URLSearchParams，而 URLSearchParams 是一个具有可迭代器功能的 API，所以你可以 for...of 或者 entries 操作。

```js
function eazyFormateQueryUrl() {
  const url = new URL(window.location);
  return Object.fromEntries(url.searchParams.entries());
}
```

- Object.fromEntries 是**还原对象**的 entries 操作。即得到原有的 object。

```js
const ret = { name: "Eric", public: "木易的OT" };
const arr = Object.entries(ret); // arr: [['name', 'Eric'], ['public', '木易的OT']]

// 为了还原成ret，有以下2种做法

// 1. for循环
const target1 = {};
arr.forEach((item) => {
  const [key, val] = item;
  target1[key] = val;
});
// target1: {name: 'Eric', public: '木易的OT'}

// 2. Object.entries
const target2 = Object.fromEntries(arr); // 注意，这里接收的是entries！！！
// target2: {name: 'Eric', public: '木易的OT'}
```

- 直接使用 URLSearchParams。
  > 这个 API 是一个原生的构造函数，可以获取地址?后面的参数信息。也可直接传入 window.location.search 或者?后面的字符串.
- URLSearchParams 构造函数不会解析完整 URL，但是如果字符串起始位置有 ? 的话会被去除。

```js
const params = new URLSearchParams("?test=1&name=eric");
params.get("name"); // eric
params.get("test"); // 1
```

```js
// URLSearchParams传入字符串
const search = new URLSearchParams("a=1&b=2&c=3");
console.log(search.toString()); // a=1&b=2&c=3
// 等价于
const search = new URLSearchParams(window.location.search);
console.log(search.toString()); // a=1&b=2&c=3
```

- 当我们使用 fetch 原生 api 请求时，new URLSearchParams 可以作为 body 参数。
- URLSearchParams 传入**数组**，将一个对象转换成 url 参数，通常在 ajax get 请求拼接参数时，可能很有用。
- URLSearchParams 具有可迭代器属性的特征，因此它像 Map、Set 一样具有增删查改的特性：get/append/delete/set/has/keys/values.
- 对于 URLSearchParams 可以传**字符串**，可以是**对象或是数组**，当我们获取 URLSearchParams 的 key，直接调用 xxx.keys()或者是 xxx.values()，不过这样取出的值是一个迭代器，还需要用 Array.from 中转一下。

- 对 URL 动态的添加路径

```js
function locationByNamePath(path) {
  const { origin } = window.location;
  const url = new URL(path, origin);
  window.location.href = url.href;
}
```

### 解析第三方 HTML

```js
/* eslint-disable @typescript-eslint/no-use-before-define */

import _ from "lodash";
import $ from "jquery";

function formatNewsHtml(html, opts = {}) {
  const $html = $("<div>").html(html);
  const title = $html.find("h1").text() || "";
  const options = _.defaults(opts, {
    filterLink: true,
  });

  // 移除meta头
  $html.find("meta").remove();
  // 移除title
  $html.find("title").remove();
  // 移除内敛样式
  $html.find("*[style]").removeAttr("style");
  // 移除外部样式
  $html.find("link").remove();
  $html.find("style").remove();
  // 移除外部脚本
  $html.find("script").remove();
  // 移除对齐属性
  $html.find("*[align]").removeAttr("align");
  // 移除原有标题
  $html.find("h1").remove();
  // 移除最开始的br标签
  $html.find("br").first().remove();
  // 过滤注释
  $html.contents().each((i, n) => {
    if (n.nodeType === 8) {
      $(n).remove();
    }
  });
  // 过滤空的p标签
  $html.find("p").each((index, p) => {
    const child = $(p).html().trim();
    if (child === "" || child === "<br>") {
      $(p).remove();
    }
  });

  if (options.filterLink) {
    // 移除除了s3以外的链接地址
    $html.find("a").each((index, ele) => {
      const href = $(ele).attr("href");
      if (/-s3/.test(href) === false) {
        $(ele).outerHTML = $(ele).html(); // eslint-disable-line no-param-reassign
        // eslint-disable-next-line no-script-url
        $(ele).attr("href", "javascript:void(0);");
        $(ele).onclick = function () {
          return false;
        };
        $(ele).attr("target", "");
      } else {
        $(ele).attr("target", "_blank");
      }
    });
  }

  return { title, html: $html.html() };
}

function formatHtml(html) {
  if (!_.trim(html)) {
    return "";
  }

  const $html = $("<div>").html(html);
  const title = $html.find("div:first").attr("title") || "";

  // 先处理目录
  const contents = generateContents($html);

  // 移除meta头
  $html.find("meta").remove();
  // 移除内敛样式
  $html.find("*[style]").removeAttr("style");
  // 移除外部样式
  $html.find("link").remove();
  $html.find("style").remove();
  // 移除外部脚本
  $html.find("script").remove();
  // 移除对齐属性
  $html.find("*[align]").removeAttr("align");
  // 格式化表格
  formatTable($html);

  return { title, html: $html.html(), contents };
}

function formatTable($html) {
  // 外层嵌套，为了后续优化
  const $table = $html
    .find("table")
    .wrap('<div class="wrapper"><div class="table-wrapper"></div></div>')
    .removeAttr("type");

  // 处理table
  $html.find(".wrapper").each((index, element) => {
    const $element = $(element);
    if ($element.text().trim().length > 0) {
      // 如果只有一行内容，转换成文本
      // 如果超过一行，添加复制表格的icon
      if ($element.find("table tr").length === 1) {
        $element.html($element.text());
      } else {
        $element.prepend('<span class="copy-table" title="复制表格"><i class="dyfont dy-copy" /></span>');
      }
    } else {
      $element.remove();
    }
  });

  // 处理表格标题，对于非标准无th元素的表格，按第一列最高rowspan数来决定表格标题高度
  $table.each((index, element) => {
    const $element = $(element);
    if ($element.find("th").length === 0) {
      let count = 1;
      $element.find("tr:eq(0) td[rowspan]").each((i, td) => {
        const rowspan = $(td).attr("rowspan") || 1;
        if (rowspan > count) {
          count = rowspan;
        }
      });

      $element.find(`tr:lt(${count})`).addClass("table-title");
    }
  });

  // 处理表格内容及宽度
  $table.find("td").each((index, td) => {
    const $td = $(td);
    const text = $td.text().trim();
    const textLen = text.length;

    if ($td.children().length > 0) {
      $td.find("span").each((i, span) => {
        $(span).html($(span).html().trim());
      });
    } else {
      $td.html(text);
    }

    const regex = /^[+\-$￥¥€£]{0,1}\s{0,1}((\d+,{0,1})*|\d+)(\.\d+){0,1}%{0,1}(%%){0,1}$/;
    if (text.match(regex)) {
      $td.css({
        "text-align": "center",
        "min-width": `${textLen / 2 + 1}em`, // eslint-disable-line no-mixed-operators
      });
    } else {
      const minWidth = textLen < 40 ? textLen * 3 + 60 : 180; // eslint-disable-line no-mixed-operators
      $td.css({
        "min-width": `${minWidth}px`,
      });
    }
  });
}

function generateContents($html) {
  const $sections = $html.find("div[id^=SectionCode]");
  let contents = [];
  let $item;
  let title;
  let id;
  let pid;
  let depth;

  _.each($sections, (item) => {
    $item = $(item);
    title = $item.attr("title");
    id = $item.attr("id");

    // 如果标题不存在或id不合法，则不属于目录
    if (title && id) {
      // SectionCode_2-2-1: id: 2-2-1, pid: 2-2
      id = id.split("_")[1];
      depth = id.split("-").length;
      if (depth > 1) {
        pid = id.substr(0, id.lastIndexOf("-"));
      } else {
        pid = 0;
      }

      // 生成目录的时候顺便添加对应的标题
      $("<div>")
        .attr({
          class: `sub-title sub-title-${
            depth > 2 ? "3" : depth > 1 ? "2" : "1" // eslint-disable-line no-nested-ternary
          }`,
        })
        .text(title)
        .prependTo($item);

      contents.push({
        id,
        pid,
        title,
      });
    }
  });
  contents = generateContentsTree(contents);
  return contents;
}

// 本函数处理按序加载的层级结构，如果无序，则需另写函数，这边为了性能就不考虑
function generateContentsTree(contents) {
  const root = { id: 0, children: [] };
  const contentsMap = {};
  let node;
  let parent;

  _.each(contents, (c) => {
    node = { id: c.id, pid: c.pid, title: c.title, children: [] };
    contentsMap[c.id] = node;
    if (c.pid === 0) {
      root.children.push(node);
    } else {
      parent = contentsMap[c.pid];
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return [root];
}

export { formatHtml, formatNewsHtml };
```

### XMLHttpRequest

```js
const fetchHR = (url: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4) {
      // const { html, content } = formatHtml(xhr.responseText);
      const { html } = formatNewsHtml(xhr.responseText);
      // console.log('html', html);
      setFormatedHtml(html);
    }
  };
  xhr.send();
};
```

### 尾递归优化

核心是把递归变成 while 循环，这样就不会产生堆栈。JS 目前还没有做到自动尾递归优化，但可以通过自定义函数 TCO 模拟实现，下面放出这个函数的实现：

```js
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];
  return function accumulator(...rest) {
    accumulated.push(rest);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}
```

### 类型判断的通用方法

```js
function getType(obj) {
  return Object.prototype.toString
    .call(obj)
    .replaceAll(new RegExp(/\[|\]|object /g), "")
    .toLowerCase();
  // return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}
```

### Object.create

`Object.create(proto [,propertiesObject])`以第一个参数 proto 为原型创建一个新对象，propertiesObject 为新创建的对象添加指定的属性值和对应的属性描述符。这些属性对应于 Object.defineProperties() 的第二个参数。

```javascript
o = new Constructor();
// is equivalent to:
o = Object.create(Constructor.prototype);
```

## 深浅拷贝

### 浅拷贝

只复制指向某个对象的指针。

1. 数组浅拷贝：`Array.from()/Object.assign()/...扩展运算符/arr.slice()/arr.concat()`/等；只拷贝第一层属性的值，如果有嵌套对象/数组，那么只会拷贝引用。
2. 对象（非数组）浅拷贝：`Object.assign({}, oldObj)`对于第二层的对象拷贝的是引用，修改新对象会同时影响老对象。**不能复制原型链上的属性和不可枚举的属性**

```js
var outObj = {
  inObj: { a: 1, b: 2 },
  inObj1: 1,
  inObj2: "qwe",
};
var newObj = Object.assign({}, outObj);
newObj.inObj.a = 2;
newObj.inObj1 = 2;
newObj.inObj2 = "ZXc";

console.log(outObj);
// inObj: {a: 2, b: 2}
// inObj1: 1
// inObj2: "qwe"
console.log(newObj);
// inObj: {a: 2, b: 2}
// inObj1: 2
// inObj2: "ZXc"

// 不能复制原型链上的属性和不可枚举的属性
let someObj = {
  a: 2,
};
let obj = Object.create(someObj, {
  // 不显示声明enumerable的话就是false
  b: {
    value: 2,
  },
  c: {
    value: 3,
    writable: true,
    enumerable: true,
    configurable: true,
  },
});
let objCopy = Object.assign({}, obj);
console.log(objCopy); // { c: 3 }
```

1. 自己实现浅拷贝：

```js
// 需要判断obj是数组还是对象
let newObj = {};
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    newObj[key] = obj[key];
  }
}
```

### 深拷贝

1. 「深」拷贝：`JSON.parse(JSON.stringify(arr));`--不能拷贝函数，且会丢失为 undefined 的属性。不能用于复制用户定义的对象方法。

2. 手动实现深拷贝：

```js
// 极简版
function deepClone(obj) {
  if (typeof obj !== "object" && !obj) return;
  const newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
}

// 完整版
// 判断类型的方法移到外部，避免递归过程中多次执行
const judgeType = (origin) => {
  return Object.prototype.toString.call(origin).replaceAll(new RegExp(/\[|\]|object /g), "");
};
const reference = ["Set", "WeakSet", "Map", "WeakMap", "RegExp", "Date", "Error"];

// Object.getOwnPropertyDescriptors(obj)方法用来获取一个对象的所有自身属性的描述符。
// Object.getOwnPropertyDescriptor(obj, propertyName)方法用来获取一个对象的某个自身属性的描述符。eg. {value: 'zangtai', writable: false, enumerable: false, configurable: false}
// 返回所指定对象的所有自身属性的描述符，如果没有任何自身属性，则返回空对象。
function deepClone(obj) {
  // 定义新的对象，最后返回
  //通过 obj 的原型创建对象
  const cloneObj = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));

  // 遍历对象，克隆属性
  for (let key of Reflect.ownKeys(obj)) {
    const val = obj[key];
    const type = judgeType(val);
    if (reference.includes(type)) {
      newObj[key] = new val.constructor(val);
    } else if (typeof val === "object" && val !== null) {
      // 递归克隆
      newObj[key] = deepClone(val);
    } else {
      // 基本数据类型和function
      newObj[key] = val;
    }
  }
  return newObj;
}

// 清晰版
function deepClone(obj) {
  let res = null;
  const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];
  if (reference.includes(obj?.constructor)) {
    res = new obj.constructor(obj);
  } else if (Array.isArray(obj)) {
    res = [];
    obj.forEach((e, i) => {
      res[i] = deepClone(e);
    });
  } else if (typeof obj === "object" && obj !== null) {
    res = {};
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        res[key] = deepClone(obj[key]);
      }
    }
  } else {
    res = obj;
  }
  return res;
}

// 缓存版
function deepClone(obj, hash = new WeakMap()) {
  if (hash.has(obj)) {
    return obj;
  }
  let res = null;
  const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];

  if (reference.includes(obj?.constructor)) {
    res = new obj.constructor(obj);
  } else if (Array.isArray(obj)) {
    res = [];
    obj.forEach((e, i) => {
      res[i] = deepClone(e);
    });
  } else if (typeof obj === "object" && obj !== null) {
    res = {};
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        res[key] = deepClone(obj[key]);
      }
    }
    hash.set(obj, res);
  } else {
    res = obj;
  }
  return res;
}
```

### React 浅比较

React 中浅比较的实现是以 `Object.is` 为基础，增加了对象第一层的属性与值的比较。

```typescript
// objectIs
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

const objectIs: (x: any, y: any) => boolean = typeof Object.is === "function" ? Object.is : is;

// hasOwnProperty
const hasOwnProperty = Object.prototype.hasOwnProperty;

// shallowEqual
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

export default shallowEqual;
```

### 实现一个简易版 axios

```js
class Axios {
  constructor() {}

  request(config) {
    return new Promise((resolve) => {
      const { url = "", method = "get", data = {} } = config;
      // 发送ajax请求
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.onload = function () {
        console.log(xhr.responseText);
        resolve(xhr.responseText);
      };
      xhr.send(data);
    });
  }
}

// 最终导出axios的方法，即实例的request方法
function CreateAxiosFn() {
  let axios = new Axios();
  let req = axios.request.bind(axios);
  return req;
}

// 得到最后的全局变量axios
const axios = CreateAxiosFn();
```
