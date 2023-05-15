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
