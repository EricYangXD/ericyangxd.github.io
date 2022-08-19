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
const a = (el) =>
	[].slice.call(el.parentNode.children).filter((child) => child !== el);
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
const isDarkMode =
	window.matchMedia &&
	window.matchMedia("(prefers-color-scheme: dark)").matches;
```

### From Array

1. 比较两个数组

```javascript
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
```

2. 将数组转为对象

```javascript
const arrayToObject = (arr, key) =>
	arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});
```

3. 获取数组最后一个元素

```javascript
// ES13
const lastItem = (arr) => arr.at(-1);
```

### From Object

1. 检测多个对象是否相等

```javascript
const isEqual = (...objects) =>
	objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));
```

2. 从对象数组中提取属性值

```javascript
const pluck = (objs, property) => objs.map((obj) => obj[property]);
```

3. 反转对象的 key/value

```javascript
const invert = (obj) =>
	Object.keys(obj).reduce((res, k) => Object.assign(res, { [obj[k]]: k }), {});
```

4. 从对象中删除值为 null 和 undefined 的属性

```javascript
const removeNullAndUndefined = (obj) =>
	Object.entries(obj).reduce(
		(a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
		{}
	);
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
	!!obj &&
	(typeof obj === "object" || typeof obj === "function") &&
	typeof obj.then === "function";
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
const randomColor = () =>
	`#${Math.random().toString(16).slice(2, 8).padEnd(6, "0")}`;
```

4. 生成 rgb 颜色字符串

```javascript
const randomRgbColor = () =>
	`rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
		Math.random() * 255
	)}, ${Math.floor(Math.random() * 255)})`;
```

5. 下划线转驼峰

```javascript
const toHump = (str) =>
	str.replace(/\_(\w)/g, (all, letter) => letter.toUpperCase());
```

6. 驼峰转下划线横线

```javascript
const toLine = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();
```

7. 检查字符串是否是十六进制颜色

```javascript
const isHexColor = (color) =>
	/^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color);
```

8. RGB 字符串转十六进制字符串

```javascript
const rgbToHex = (r, g, b) =>
	"#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
```

### From Date

1. 两个日期之间相差的天数

```javascript
const diffDays = (date, otherDate) =>
	Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
```

2. 检查日期是否有效

```javascript
const isDateValid = (...val) => !Number.isNaN(new Date(...val).valueOf());
```

3. 检测代码是否处于 Node.js 环境

```javascript
const isNode =
	typeof process !== "undefined" &&
	process.versions != null &&
	process.versions.node != null;
```

4. 检测代码是否处于浏览器环境

```javascript
const isBrowser = typeof window === "object" && typeof document === "object";
```
