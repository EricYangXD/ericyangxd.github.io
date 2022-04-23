---
title: JavaScript APIs
author: EricYangXD
date: "2022-04-18"
---

## 记录 JavaScript 中的常用和不常用的 APIs

### Array

-   创建 Array

```js
Array("1" + 1);
// ['11']
Array(1 + 1);
// [empty × 2]
```

-   搜索数组的四种方法

1. 只需要知道值是否存在？这时可以使用 includes()。
2. 需要获取元素本身？可以对单个项目使用 find()或对多个项目使用 filter()。
3. 需要查找元素的索引？应该使用 indexOf() 搜索原语或使用 findIndex() / lastIndexOf()搜索函数。

-   对比，假设`const arr=[0,1,2,3,4,5];`

| API   | 功能     | 用法                  | 是否改变原数组 | 输入特殊值                                                                      |
| ----- | -------- | --------------------- | -------------- | ------------------------------------------------------------------------------- |
| slice | 截取数组 | arr.slice(start, end) | [X]            | 1. arr.slice(-2);// [4, 5]；2. arr.slice(NaN);// arr；3. arr.slice(-2,-3);// [] |

### String

### Number

### Object

### Map、WeakMap

### Set、WeakSet

### Promise

### Date

### RegExp

### Reflect
