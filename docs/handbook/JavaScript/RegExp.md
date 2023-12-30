---
title: 记录正则表达式的坑
author: EricYangXD
date: "2021-12-29"
---

## 反斜线`\`和特殊字符`*?/dsbtn...`

-   在非特殊字符之前的反斜杠表示下一个字符是特殊字符，不能按照字面理解。例如，前面没有 `"\"` 的 `"b"` 通常匹配小写字母 `"b"`，即字符会被作为字面理解，无论它出现在哪里。但如果前面加了 `"\"`，它将不再匹配任何字符，而是表示一个字符边界。

-   在特殊字符之前的反斜杠表示下一个字符不是特殊字符，应该按照字面理解。详情请参阅下文中的 "转义（Escaping）" 部分。

-   如果你想将字符串传递给 RegExp 构造函数，不要忘记在字符串字面量中反斜杠是转义字符。所以为了在模式中添加一个反斜杠，你需要在字符串字面量中转义它。`/[a-z]\s/i` 和 `new RegExp("[a-z]\\s", "i")` 创建了相同的正则表达式：一个用于搜索后面紧跟着空白字符（`\s` 可看后文）并且在 `a-z` 范围内的任意字符的表达式。为了通过字符串字面量给 RegExp 构造函数创建包含反斜杠的表达式，你需要在字符串级别和正则表达式级别都对它进行转义。例如 `/[a-z]:\\/i` 和 `new RegExp("[a-z]:\\\\","i")` 会创建相同的表达式，即匹配类似 `"C:\"` 字符串。

### new RegExp()、replaceAll()和/expression/的区别

-   examples:

```js
/[a-z]\s/i.test("s "); // true
var reg = new RegExp("[a-z]\\s", "i"); // undefined
reg; // /[a-z]\s/i
reg.test("s "); // true
var reg1 = new RegExp("[a-z]s", "i"); // undefined
reg1; // /[a-z]s/i
reg1.test("as"); // true
reg1.test("s"); // false
reg1.test("234ds"); // true
```

-   可以看到使用 new RegExp()创建正则对象时，需要两条反斜线，而直接创建时则不需要转义。

-   `str.replace(regExp, rule)`: 其中 regExp 是一个正则对象，如果使用 new RegExp()创建 regExp，则需要注意对特殊字符使用双反斜线。
