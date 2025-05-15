---
title: 记录一些常见的函数实现2
author: EricYangXD
date: "2022-08-16"
meta:
  - name: keywords
    content: function
---

## 工具函数系列

### From Vue

### From React

### From Angular

### From DOM

1. 检测某个元素是否聚焦

```javascript
const hasFocus = (el) => el === document.activeElement;
```

2. 获取某个元素所有的兄弟元素

```javascript
const a = (el) => [].slice.call(el.parentNode.children).filter((child) => child !== el);
```

3. 获取当前选择的文本

```javascript
const getSelectedText = () => window.getSelection().toString();
```

4. 获取所有 cookie 并转为对象

```javascript
const getCookies = () =>
  document.cookie
    .split(";")
    .map((item) => item.split("="))
    .reduce((acc, [k, v]) => (acc[k.trim().replace('"', "")] = v) && acc, {});
```

5. 清除所有 cookie

```javascript
const clearCookies = () => document.cookie
  .split(';')
  .forEach(c => document.cookie = c.splace(/^+/, '')
          .replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`))
  );
```

6. 将 URL 参数转换为对象

```javascript
const getUrlParams = (query) =>
  Array.from(new URLSearchParams(query)).reduce(
    (p, [k, v]) =>
      Object.assign({}, p, {
        [k]: p[k] ? (Array.isArray(p[k]) ? p[k] : [p[k]]).concat(v) : v,
      }),
    {}
  );
```

7. 检测是否为暗模式

```javascript
const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
```

### From Array

1. 比较两个数组

```javascript
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
```

2. 将数组转为对象

```javascript
const arrayToObject = (arr, key) => arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});
```

3. 获取数组最后一个元素

```javascript
// ES13
const lastItem = (arr) => arr.at(-1);
```

### From Object

1. 检测多个对象是否相等

```javascript
const isEqual = (...objects) => objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));
```

2. 从对象数组中提取属性值

```javascript
const pluck = (objs, property) => objs.map((obj) => obj[property]);
```

3. 反转对象的 key/value

```javascript
const invert = (obj) => Object.keys(obj).reduce((res, k) => Object.assign(res, { [obj[k]]: k }), {});
```

4. 从对象中删除值为 null 和 undefined 的属性

```javascript
const removeNullAndUndefined = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
```

5. 按照对象的属性对对象排序

```javascript
const sort = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((p, c) => ((p[c] = obj[c]), p), {});
```

6. 检测对象是否为数组

```javascript
const isArray = (obj) => Array.isArray(obj);
```

7. 检测对象是否为 Promise

```javascript
const isPromise = (obj) =>
  !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
```

### From String

1. 检查路径是否是相对路径

```javascript
const isRelative = (path) => !/^([az]+:)?[\\/]/i.test(path);
```

2. 生成 IP 地址

```javascript
const randomIp = () =>
  Array(4)
    .fill(0)
    .map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0))
    .join(".");
```

3. 生成十六进制颜色字符串

```javascript
const randomColor = () => `#${Math.random().toString(16).slice(2, 8).padEnd(6, "0")}`;
```

4. 生成 rgb 颜色字符串

```javascript
const randomRgbColor = () =>
  `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
```

5. 下划线转驼峰

```javascript
const toHump = (str) => str.replace(/\_(\w)/g, (all, letter) => letter.toUpperCase());
```

6. 驼峰转下划线横线

```javascript
const toLine = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();
```

7. 检查字符串是否是十六进制颜色

```javascript
const isHexColor = (color) => /^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color);
```

8. RGB 字符串转十六进制字符串

```javascript
const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
```

### From Date

1. 两个日期之间相差的天数

```javascript
const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
```

2. 检查日期是否有效

```javascript
const isDateValid = (...val) => !Number.isNaN(new Date(...val).valueOf());
```

3. 检测代码是否处于 Node.js 环境

```javascript
const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
```

4. 检测代码是否处于浏览器环境

```javascript
const isBrowser = typeof window === "object" && typeof document === "object";
```

### 正则匹配金额

```javascript
// 匹配人民币
let [reg, info, rmb, result] = [
  /^(￥)(-?[0-9,]+)(\.[0-9]+)?/,
  ["金额", "符号", "整数部分", "小数分部"],
  ["￥10.01", "￥10", "￥1,111.01", "￥1,000,12", "￥0.1", "￥10.00"],
];
rmb.forEach((value) => {
  console.log("---------------------------------------------------------------------------------");
  for (let i = 0, result = reg.exec(value); i < result.length; i++) {
    console.log(`${info[i]} = ${result[i]}`);
  }
});
```

### js 替代 eval 方法

项目中遇到需要支持用户输入 js 并加以解析的场景。eval() 本身不太好，会在当前作用域中运行代码。由于其权限较大，可以访问上下文中的所有变量，这可能会引入安全风险。eval 会对传入的字符串进行解析和执行，是一种直接的语法操作，对性能有一定影响。

new Function 创建的函数是在全局作用域中执行的，无法直接访问当前作用域的变量（除非通过显式传递参数）。这样可以一定程度上避免安全风险。new Function 会创建一个新的全局函数，性能通常比 eval 略好。依然可能执行恶意代码。`new Function(arg1, arg2, ..., functionBody)`前几个参数是字符串，表示函数的形参名称；最后一个参数：是函数体的代码字符串；返回一个新创建的函数。

所以查找了下其他实现：

```js
const dynamicFunc = new Function("a", "b", "return a + b;");
dynamicFunc(1, 2); // 返回 3

function new_eval(str) {
  var fn = Function;
  return new fn("return " + str)();
}
console.log(new_eval("2 + 5")); // 输出: 7

function new_eval_with_scope(str, context) {
  return new Function("context", "with(context) { return " + str + " }")(context);
}
var a = 10;
console.log(new_eval_with_scope("a + 5", { a })); // 输出: 15

new_eval("alert('Hacked!')"); // 执行恶意代码
```

### 解析 16 进制序列为 UTF-8 字符

```js
function decodeHexToUtf8(str: string, isJsonStr = false): string | object {
  // 正则表达式，用于匹配形如 [0xe5] 的UTF-8编码序列
  const hexPattern = /\[0x([0-9a-f]{2})\]/gi;

  // 转换匹配到的16进制序列为UTF-8字符
  const decodedString = str.replace(hexPattern, (match, p1) => {
    // 将16进制值转换为字节
    return String.fromCharCode(parseInt(p1, 16));
  });

  // 使用TextDecoder将字节序列转换为字符串
  const bytes = [];
  for (let i = 0; i < decodedString.length; i++) {
    const charCode = decodedString.charCodeAt(i);
    if (charCode <= 0xff) {
      bytes.push(charCode);
    }
  }
  const _str = new TextDecoder("utf-8").decode(new Uint8Array(bytes));

  if (isJsonStr) {
    // 尝试解析JSON字符串
    try {
      return JSON.parse(_str);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return null;
    }
  }
  return _str;
}
```

### 将图片转换为 Base64 格式

#### 在浏览器中使用 JavaScript

```js
function convertToBase64() {
  // 获取文件输入控件中的文件列表
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    console.log("Base64 String:", reader.result);
  };

  // 读取文件内容，并在完成后触发`onloadend`事件
  reader.readAsDataURL(file);
}

// HTML部分
// <input type="file" onchange="convertToBase64()">
```

#### 在 Node.js 中

```js
const fs = require("fs");

// 异步读取
fs.readFile("path/to/your/image.jpg", "base64", (err, base64Image) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Base64 String:", base64Image);
});

// 同步读取
const base64Image = fs.readFileSync("path/to/your/image.jpg", "base64");
console.log("Base64 String:", base64Image);
```

#### 在命令行（例如 Linux 或 macOS）中

```bash
base64 -i ./image.jpg > image_base64.txt
```

### 计算屏幕刷新率 FPS

`window.requestAnimationFrame()` 方法会告诉浏览器你希望执行一个动画并返回一个 requestID，通过`window.cancelAnimationFrame(requestID)`可以取消这个请求。它要求浏览器在下一次重绘之前，调用用户提供的回调函数。回调函数只接收一个参数：上一帧渲染的结束时间，这个时间是基于`performance.timeOrigin`的毫秒数。

在 JavaScript 中，我们可以通过获取当前时间戳来计算屏幕的刷新率。以下是一个简单的示例：

```javascript
let lastTime = 0;
let refreshRate = 0;

function measureRefreshRate() {
  requestAnimationFrame(function (time) {
    if (lastTime > 0) {
      refreshRate = 1000 / (time - lastTime);
      console.log("屏幕刷新率大约是:", refreshRate, "Hz");
    }
    lastTime = time;
    measureRefreshRate();
  });
}

// 开始测量
measureRefreshRate();
```
