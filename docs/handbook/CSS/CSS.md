---
title: CSS Tips
author: EricYangXD
date: "2021-12-29"
---

## 隐藏滚动条

```css
scrollbar-width: none;
&::-webkit-scrollbar {
	display: none;
	width: 0;
}
```

## 限制文字显示行数

1. -webkit-line-clamp

```css
display: -webkit-box;
overflow: hidden;
max-height: calc(2 * 1.15 * 1.5rem);
line-height: 25px;
word-break: break-all;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
```

2. text-overflow: ellipsis

-   配合块级元素

```css
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
```

## Sticky

-   粘性定位可以被认为是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位。

-   用法：父级容器要有 height，overflow: scroll/auto/visible **要能滚动！**; 子元素 position: sticky;基于 top, right, bottom, 和 left 的值进行偏移。**跟 position 无关！**

-   须指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位 position:relative 相同。

-   MDN: 元素根据正常文档流进行定位，然后相对它的最近滚动祖先（nearest scrolling ancestor）和 containing block (最近块级祖先 nearest block-level ancestor)，包括 table-related 元素，基于 top, right, bottom, 和 left 的值进行偏移。偏移值不会影响任何其他元素的位置。

-   该值总是创建一个新的层叠上下文（stacking context）。注意，一个 sticky 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的 overflow 是 hidden, scroll, auto, 或 overlay 时），即便这个祖先不是最近的真实可滚动祖先。这有效地抑制了任何“sticky”行为。

## getComputedStyle()

-   Window.getComputedStyle(获取计算样式的 Element,要匹配的伪元素的字符串)方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有 CSS 属性的值。

-   CSS 属性的值: initial, computed, resolved, specified, used, and actual values.即初始、计算、解析、指定、使用和实际值。

```css
let elem1 = document.getElementById("elemId");
let style = window.getComputedStyle(elem1, null);

// 它等价于
// let style = document.defaultView.getComputedStyle(elem1, null);

```

## clear

-   MDN: clear CSS 属性指定一个元素是否必须移动(清除浮动后)到在它之前的浮动元素下面。clear 属性适用于浮动和非浮动元素。

-   MDN: 当应用于非浮动块时，它将非浮动块的边框边界移动到所有相关浮动元素外边界的下方。这个非浮动块的垂直外边距会折叠。

-   MDN: 另一方面，两个浮动元素的垂直外边距将不会折叠。当应用于浮动元素时，它将元素的外边界移动到所有相关的浮动元素外边框边界的下方。这会影响后面浮动元素的布局，后面的浮动元素的位置无法高于它之前的元素。

-   MDN: 要被清除的相关浮动元素指的是在相同块级格式化上下文中的前置浮动。

-   MDN: 注意：如果一个元素里只有浮动元素，那它的高度会是 0。如果你想要它自适应即包含所有浮动元素，那你需要清除它的子元素。一种方法叫做 clearfix，即 clear 一个不浮动的 ::after 伪元素。

```css
#container::after {
	content: "";
	display: block;
	clear: both;
}
```

## SCSS/SASS

-   SCSS 是 Sass 3 引入新的语法，其语法完全兼容 CSS3，并且继承了 Sass 的强大功能。Sass 和 SCSS 其实是同一种东西，我们平时都称之为 Sass，两者之间不同之处有以下两点：

-   文件扩展名不同，Sass 是以“.sass”后缀为扩展名，而 SCSS 是以“.scss”后缀为扩展名

-   语法书写方式不同，Sass 是以严格的缩进式语法规则来书写，不带大括号({})和分号(;)，而 SCSS 的语法书写和我们的 CSS 语法书写方式非常类似。

```scss
# index.scss  定义变量并导出
$primary-color: #f40000;

:export {
  primaryColor: $primary-color;
}

# index.js
import styles from './index.scss';
// 可以直接引入并使用scss变量
console.log('styles', styles.primaryColor);
```

## 查看 UI 轮廓 outline

-   这里没有使用 border 的原因是 border 会增加元素的大小但是 outline 不会；
-   通过这个技巧不仅能帮助我们在开发中迅速了解元素所在的位置，还能帮助我们方便地查看任意网站的布局；
-   所有浏览器都支持 outline 属性;outline （轮廓）是绘制于元素周围的一条线，位于边框边缘的外围，可起到突出元素的作用;
-   轮廓线不会占据空间，也不一定是矩形（比如 2D 转换等）。

```css
html * {
	outline: 1px solid red;
}
```

## 提高长列表加载性能

-   content-visibility 属性有三个可选值:

1. visible: 默认值。对布局和呈现不会产生什么影响。
2. hidden: 元素跳过其内容的呈现。用户代理功能（例如，在页面中查找，按 Tab 键顺序导航等）不可访问已跳过的内容，也不能选择或聚焦。类似于对其内容设置了 display: none 属性。
3. auto: 对于用户可见区域的元素，浏览器会正常渲染其内容；对于不可见区域的元素，浏览器会暂时跳过其内容的呈现，等到其处于用户可见区域时，浏览器在渲染其内容。

```css
      .card {
        position: relative;
        overflow: hidden;
        transition-duration: 0.3s;
        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        background-color: #ffaa00;
        **content-visibility: auto;**
        // 添加此行:目的是在一定程度上解决滚动条上下跳动的问题，取一个item的大致高度作为初始高度
        **contain-intrinsic-size: 312px;**
      }
      .card:before {
        content: '';
        position: absolute;
        left: -665px;
        top: -460px;
        width: 300px;
        height: 15px;
        background-color: rgba(255, 255, 255, 0.5);
        transform: rotate(-45deg);
        animation: searchLights 2s ease-in 0s infinite;
      }
      @keyframes searchLights {
        0% {
        }
        75% {
          left: -100px;
          top: 0;
        }
        100% {
          left: 120px;
          top: 100px;
        }
      }
```

## 隐藏打印弹窗

```css
@media print {
	body {
		display: none !important;
	}
}
```
