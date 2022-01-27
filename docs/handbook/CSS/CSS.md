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

## transform-origin

1.  设置元素转换的原点/起点。初始值 50% 50% 0，即默认的转换原点是 center。
2.  transform-origin 属性可以使用一个，两个或三个值来指定，其中每个值都表示一个偏移量。 没有明确定义的偏移将重置为其对应的初始值。
3.  如果定义了两个或更多值并且没有值的关键字，或者唯一使用的关键字是 center，则第一个值表示水平偏移量，第二个值表示垂直偏移量。

-   一个值：
    -   必须是`<length>`，`<percentage>`，或 left, center, right, top, bottom 关键字中的一个。
-   两个值：
    -   其中一个必须是`<length>`，`<percentage>`，或 left, center, right 关键字中的一个。
    -   另一个必须是`<length>`，`<percentage>`，或 top, center, bottom 关键字中的一个。
-   三个值：
    -   前两个值和只有两个值时的用法相同。
    -   第三个值必须是`<length>`。它始终代表 Z 轴偏移量。

## 修改图片「颜色」

-   背景色变化时突出图片，或者修改某个 icon 的背景色以实现变色（UI 垃圾！）。

```css
img {
	width: 16px;
	height: 16px;
	margin: 0 0 4px 8px;
	filter: drop-shadow(0px 0px red);
}
```

## font

-   至少包含 font-size 和 font-family;
-   可以按顺序设置如下属性：font-style、font-variant、font-weight、font-size/line-height、font-family、font-stretch;
-   特殊值：caption、icon、menu、message-box、small-caption、status-bar;

## 绘制三角形

-   普通三角形

```css
div {
	width: 0;
	height: 0;
	border: 40px solid;
	border-color: orange blue red green;
}
```

-   绘制带边框的三角形：通过::after 伪元素绘制一个稍大的三角形，然后左移即可。

-   绘制其它角度的三角形：其实它们都是基于之前绘制的三角形而来的。
    -   如果想绘制右直角三角，则将左 border 设置为 0；
    -   如果想绘制左直角三角，将右 border 设置为 0 即可（其它情况同理）。

```css
div {
	width: 0;
	height: 0;
	border: 40px solid;
	border-color: transparent transparent red;
	border-right-width: 0;
}
```

-   给 border 边框 再加边框 有一个属性可以用：
    -   轮廓: outline: 1px solid black;

## 水平垂直居中

-   ![水平垂直居中](../../assets/spczjz.jpg "水平垂直居中")

## CSS 伪类与伪元素

1. 伪类的效果可以通过添加一个实际的类来达到，而伪元素的效果则需要通过添加一个实际的元素才能达到，这也是为什么他们一个称为伪类，一个称为伪元素的原因。
2. 伪元素的权重比伪类高，比如一个容器的伪元素和伪类都定义了同一属性，但值不一样，那么将采用伪元素的。从规范的角度伪元素一个页面只使用一次，而伪类可以多次使用。
3. 伪元素产生新对象，在 DOM 中看不到，但是可以操作；伪类是 DOM 中一个元素的不同状态.

### 伪元素

css 的伪元素，之所以被称为伪元素，是因为他们不是真正的页面元素，html 没有对应的元素，但是其所有用法和表现行为与真正的页面元素一样，可以对其使用诸如页面元素一样的 css 样式，表面上看上去貌似是页面的某些元素来展现，实际上是 css 样式展现的行为，因此被称为伪元素。伪元素是通过样式来达到元素效果的，也就是说伪元素不占用 dom 元素节点。

css 有一系列的伪元素，如:before，:after，:first-line，:first-letter 等。

伪元素:before 和:after 添加的内容默认是 inline 元素；这个两个伪元素的 content 属性，表示伪元素的内容,设置:before 和:after 时必须设置其 content 属性，否则伪元素就不起作用。那么问题来了，content 属性的值可以有哪些内容呢，具体有以下几种情况：

1. 字符串，字符串作为伪元素的内容添加到主元素中

-   注意：字符串中若有 html 字符串，添加到主元素后不会进行 html 转义，也不会转化为真正的 html 内容显示，而是会原样输出

2. attr(attr_name), 伪元素的内容跟主元素的某个属性值进行关联，及其内容为主元素的某指定属性的值

-   好处：可以通过 js 动态改变主元素的指定属性值，这时伪元素的内容也会跟着改变，可以实现某些特殊效果，如图片加载失败用一段文字替换。

3. url()/uri(), 引用外部资源，例如图片；

4. counter(), 调用计数器，可以不使用列表元素实现序号问题。

-   伪元素不属于文档，所以 js 无法操作它

-   伪元素属于主元素的一部分，因此点击伪元素触发的是主元素的 click 事件

-   对于「块级元素才能有:before, :after」--其实是不妥的，大部分行级元素也可以设置伪元素，但是像 img 可替换元素，因为其外观和尺寸有外部资源决定，那么如果外部资源正确加载，就会替换掉其内部内容，这时伪元素也会被替换掉，但是当外部资源加载失败时，设置的伪元素是可以起作用的。

-   基于伪元素的特点可以知道其优缺点，也引用别人文章的话：

1. 优点

-   减少 dom 节点数
-   让 css 帮助解决部分 js 问题，让问题变得简单

2. 缺点

-   不利于 SEO
-   无法审查元素，不利于调试

#### :before 和:after 常见使用场景

1. 清除浮动

```css
// 1.
.block::after {
	clear: both;
	content: "\0020";
	display: block;
	height: 0;
	overflow: hidden;
}

// 2.
.clear-fix {
	*overflow: hidden;
	*zoom: 1;
}
.clear-fix::after {
	display: table;
	content: "";
	width: 0;
	clear: both;
}
```

2. 利用 attr()来实现某些动态功能

-   `<img>`是一个替换元素，其外观和尺寸是由外部资源来决定的，当外部图片资源加载失败时其会显示破裂图片和 alt 文字，尺寸仅由其自身内容决定。这时`<img>`元素可以使用伪元素:before 和:after，因为其元素内容没有被替换；
-   利用 attr()来获取图片 alt 属性值作为伪元素:after 的 content 内容来替换 img 的内容，并运用适当的样式从而完成：图片加载成功时显示正常的图片，加载失败时显示图片破裂效果的样式.

```css
   img{
   min-height: 50px;
   position: relative;
   }
   img::before {
   content: " ";
   display: block;
   position: absolute;
   top: -10px;
   left: 0;
   height: calc(100% + 10px);
   width: 100%;
   backgound-color: rgb(230, 230,230);
   border: 2px dotted rgb(200,200,200);
   border-radius: 5px;
   }
   img::after {
   content: '\f127" " Broken Image of " attr(alt);
   display: block;
   font-size: 16px;
   font-style: normal;
   font-family: FontAwesome;
   color: rgb(100,100,100)
   position: absolute;
   top: 5px;
   left: 0;
   width: 100%;
   text-align: center;
   }
```

3. 与 counter()结合实现序号问题，而不用使用列表元素。

-   具体还要结合 css 的 counter-increment 和 counter-reset 属性的用法 。

```css
body {
	counter-reset: section;
}
h2::before {
	counter-increment: section;
	content: "Chapter" counter(section) ".";
}
```

4. 特效使用

-   利用这两个伪元素，可以实现各种效果，如放大镜、叉叉、箭头、三角符等
-   eg. blockquote 引用段添加巨大的引号作为背景:

```css
blockquote::before {
	content: open-quote;
	position: absolute;
	z-index: -1;
	color: #ddd;
	font-size: 120px;
	font-family: serif;
	font-weight: bolder;
}
```

#### 标准 & 伪元素索引

伪元素是一个附加至选择器末的关键词，允许你对被选择元素的特定部分修改样式。

一个选择器中只能使用一个伪元素。伪元素必须紧跟在语句中的简单选择器/基础选择器之后。

注意：按照规范，应该使用双冒号（::）而不是单个冒号（:），以便区分伪类和伪元素。但是，由于旧版本的 W3C 规范并未对此进行特别区分，因此目前绝大多数的浏览器都同时支持使用这两种方式来表示伪元素。

-   标准伪元素索引:

```css
::after (:after)
::backdrop
::before (:before)
::cue (:cue)
::first-letter (:first-letter)
::first-line (:first-line)
::grammar-error
::marker
::placeholder
::selection
::slotted()
::spelling-error
```

CSS 伪类 是添加到选择器的关键字，指定要选择的元素的特殊状态。

-   标准伪类索引：

```css
:active
:any-link
:blank
:checked
:current (en-US)
:default
:defined
:dir()
:disabled
:drop
:empty
:enabled
:first
:first-child
:first-of-type
:fullscreen
:future (en-US)
:focus
:focus-visible
:focus-within
:has()
:host
:host()
:host-context()
:hover
:indeterminate
:in-range
:invalid
:is()
:lang()
:last-child
:last-of-type
:left
:link
:local-link (en-US)
:not()
:nth-child()
:nth-col() (en-US)
:nth-last-child()
:nth-last-col() (en-US)
:nth-last-of-type()
:nth-of-type()
:only-child
:only-of-type
:optional
:out-of-range
:past (en-US)
:placeholder-shown
:read-only
:read-write
:required
:right
:root
:scope
:target
:target-within (en-US)
:user-invalid (en-US)
:valid
:visited
:where()
```

## 实现 CSS 与 JS 变量共享

### :export 关键字

````css
/* config.css */
$primary-color: #F40;

:export{
  primaryColor: $primary-color;
}

```js
/* app.js */
import style from 'config.scss';

console.log(style.primaryColor); // #F40
````

## styled-components

-   用于生成并返回一个带样式的组件，既可以生成原生的 HTMLelement，也可以接受自定义组件，如：antd 的 Form、Modal 等组件 -- styled(Modal)\`...\`
-   通过 `${(props) => props.theme.colorXXX};` 来共享全局定义的 createGlobalStyle\`...\`全局样式
-   `<ThemeProvider theme={theme}>` 通过 styled-components 提供的 **ThemeProvider** 共享 theme 变量

## 加载动画

```js
const rotate = keyframes`
from{
  transform: rotate(0deg);
}
to{
  transform: rotate(360deg);
}
`;

const LoaderWrap = styled.div`
	display: inline-block;
	vertical-align: middle;
	animation: ${rotate} 1s linear infinite;
	img {
		width: 16px;
		height: 16px;
	}
`;
```

## 说说 CSS 选择器以及这些选择器的优先级

从高到低：

1. !important
2. 内联样式（1000）
3. ID 选择器（0100）
4. 类选择器/属性选择器/伪类选择器（0010）
5. 元素选择器/伪元素选择器（0001）
6. 关系选择器/通配符选择器（0000）

## BFC

-   BFC 全称为块级格式化上下文 (Block Formatting Context) 。

触发 BFC 的条件：

1. 根元素或其它包含它的元素
2. 浮动元素 (元素的 float 不是 none)
3. 绝对定位元素 (元素具有 position 为 absolute 或 fixed)
4. 内联块 (元素具有 display: inline-block)
5. 表格单元格 (元素具有 display: table-cell，HTML 表格单元格默认属性)
6. 表格标题 (元素具有 display: table-caption, HTML 表格标题默认属性)
7. 具有 overflow 且值不是 visible 的块元素
8. 弹性盒（flex 或 inline-flex）
9. display: flow-root
10. column-span: all

BFC 可以解决的问题:

1. 垂直外边距重叠问题
2. 去除浮动
3. 自适应两列布局（float + overflow）

## href 与 src

href 表示超文本引用，用在 link 和 a 等元素上，href 是引用和页面关联，是在当前元素和引用资源之间建立联系，src 表示引用资源，表示替换当前元素，用在 img，script，iframe 上，src 是页面内容不可缺少的一部分。

> src 是 source 的缩写，是指向外部资源的位置，指向的内部会迁入到文档中当前标签所在的位置；在请求 src 资源时会将其指向的资源下载并应用到当前文档中，例如 js 脚本，img 图片和 frame 等元素。

`<script src="js.js"></script>`当浏览器解析到这一句的时候会暂停其他资源的下载和处理，直至将该资源加载，编译，执行完毕，图片和框架等元素也是如此，类似于该元素所指向的资源嵌套如当前标签内，这也是为什么要把 js 放在底部而不是头部。

`<link href="common.css" rel="stylesheet"/>`当浏览器解析到这一句的时候会识别该文档为 css 文件，会下载并且不会停止对当前文档的处理，这也是为什么建议使用 link 方式来加载 css 而不是使用@import。

补充：link 和@import 的区别：

> 两者都是外部引用 CSS 的方式，但是存在一定的区别：

-   区别 1：link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务；@import 属于 CSS 范畴，只能加载 CSS。
-   区别 2：link 引用 CSS 时，在页面载入时同时加载；@import 需要页面网页完全载入以后加载。
-   区别 3：link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 提出的，低版本的浏览器不支持。
-   区别 4：link 支持使用 Javascript 控制 DOM 去改变样式；而@import 不支持。

## 加一个边框

```css
border: 10px solid hsla(0, 0%, 100%, 0.5);
background-clip: padding-box; // 使用paddingbox
```

## 太极

```css
.yin-yang {
	height: 200px;
	width: 200px;
	position: relative;
	background: rgb(255, 255, 255);
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 1) 0%,
		rgba(255, 255, 255, 1) 50%,
		rgba(0, 0, 0, 1) 50%,
		rgba(0, 0, 0, 1) 100%
	);
	border-radius: 50%;
	box-sizing: border-box;
	border: 4px solid black;
}
.yin-yang::before {
	content: "";
	position: absolute;
	height: 96px;
	width: 96px;
	border-radius: 50%;
	box-sizing: border-box;
	background: black;
	border: 38px solid white;
	left: 50%;
	transform: translatex(-50%);
}
.yin-yang::after {
	content: "";
	position: absolute;
	height: 96px;
	width: 96px;
	border-radius: 50%;
	box-sizing: border-box;
	background: white;
	border: 38px solid black;
	left: 50%;
	bottom: 0;
	transform: translatex(-50%);
}
```

## @font-face

```css
@font-face {
	font-family: myFirstFont; /* 必需的 */
	src: url("xxx.ttf") [, url(xxx.xyz), ...]; /* 必需的 */
}
```
