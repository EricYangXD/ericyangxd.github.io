---
title: CSS Tips2
author: EricYangXD
date: "2021-12-29"
meta:
  - name: keywords
    content: CSS,CSS3
---

## Tips

### 复合属性

设置复合属性如`background`、`flex`、`border`、`font`、`padding`、`margin`、`list-style`、`border-radius`、`transition`、`animation`等时，可以使用缩写，减少代码量。但同时要注意不要覆盖掉其他属性。

### 设置阴影

当使用透明图像时，可以使用 `filter: drop-shadow()` 函数在图像上创建阴影，而不是使用 `box-shadow` 属性在元素的整个框后面创建矩形阴影。值与`box-shadow`相同，但不允许使用`inset`关键字和扩散值。可以随心所欲地添加阴影，通过在`filter`属性中添加多个`drop-shadow`值的实例。每个阴影将使用前一个阴影作为定位参考点。

```css
.drop-shadow {
  filter: drop-shadow(2px 4px 8px #585858);
}
```

`box-shadow`的值的顺序如下：

- 水平偏移：一个正数将它从左边推开，一个负数将它从右边推开。
- 垂直偏移：一个正数将它从顶部推下来，一个负数将它从底部推上去。
- 模糊半径：一个较大的数字产生一个更模糊的阴影，而一个较小的数字产生一个更清晰的阴影。
- 展开半径（可选）：一个较大的数字会增加阴影的大小，一个较小的数字会减少阴影的大小，如果它被设置为 0，则会使它与模糊半径的大小相同。
- 颜色：任何有效的颜色值。如果没有定义这个，将使用计算出的文本颜色。
- 要使一个盒子的阴影成为内阴影，而不是默认的外阴影，请在其他属性之前添加一个 inset 关键字。
- 通过`,`可以添加多个 shadow 样式
- `border-radius`会影响`box-shadow`
- 父元素如果设置了`overflow: hidden;`会影响`box-shadow`
- `text-shadow`属性与`box-shadow`属性非常相似。它只对文本节点起作用。
- `text-shadow`的值与`box-shadow`相同，而且顺序相同。唯一不同的是，`text-shadow`没有扩散值，也没有`inset`关键字。
- 同样也可以给 `text-shadow`添加多个 shadow

### 平滑滚动

无需 JavaScript 即可实现平滑滚动，只需一行 CSS：`scroll-behavior: smooth；`.

### scroll-margin-top

该属性定义了用于将这个盒子抓取到`snapport`的滚动抓取区域的顶部边距。滚动抓取区域的确定方法是：取变换后的边框，找到它的矩形边框（在滚动容器的坐标空间中轴对齐），然后加上指定的外框。点击索引跳转到正文时，正文区域滚动到离顶部的边距。

### 自定义光标

在某个 DOM 元素上可以使用自定义图像，甚至表情符号来作为光标。

```css
.tile-image-cursor {
  background-color: #1da1f2;
  cursor: url(https://picsum.photos/20/20), auto;
}
.tile-emoji-cursor {
  background-color: #4267b2;
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🚀</text></svg>"),
    auto;
}
```

### 截断文本

一行文本溢出隐藏：

```css
div {
  width: 200px;
  background-color: #fff;
  padding: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

还可以使用`-webkit-line-clamp`属性将文本截断为特定的行数。文本将在截断的地方会显示省略号：

```css
div {
  width: 200px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

### 自定义选中样式

CSS 伪元素`::selection`，可以用来自定义用户选中文档的高亮样式。

```css
.custom-highlighting::selection {
  background-color: #8e44ad;
  color: #fff;
}
```

### CSS 模态框

使用 CSS 中的 `::target` 伪元素来创建一个模态框。

### 空元素样式

可以使用 `:empty` 选择器来设置完全没有子元素或文本的元素的样式：

```css
.box {
  display: inline-block;
  background: #999;
  border: 1px solid #585858;
  height: 200px;
  width: 200px;
  margin-right: 15px;
}

.box:empty {
  background: #fff;
}
```

### 创建自定义滚动条

滚动的条件：父容器设置了`height`和`overflow!=visiable`，子元素高度要超过父容器。

```css
.tile-custom-scrollbar::-webkit-scrollbar {
  width: 12px;
  background-color: #eff1f5;
}

.tile-custom-scrollbar::-webkit-scrollbar-track {
  border-radius: 3px;
  background-color: transparent;
}

.tile-custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #515769;
  border: 2px solid #eff1f5;
}
```

### 动态工具提示 tooltip

可以使用 CSS 函数 `attr()` 来创建动态的纯 CSS 工具提示 。

```html
<h1>HTML/CSS tooltip</h1>
<p>Hover <span class="tooltip" data-tooltip="Tooltip Content">Here</span> to see the tooltip.</p>
<p>
  You can also hover
  <span class="tooltip" data-tooltip="This is another Tooltip Content">here</span>
  to see another example.
</p>
```

```css
.tooltip {
  position: relative;
  border-bottom: 1px dotted black;
}

.tooltip:before {
  content: attr(data-tooltip);
  position: absolute;
  width: 100px;
  background-color: #062b45;
  color: #fff;
  text-align: center;
  padding: 10px;
  line-height: 1.2;
  border-radius: 6px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.6s;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  font-size: 0.75em;
  visibility: hidden;
}

.tooltip:after {
  content: "";
  position: absolute;
  bottom: 75%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  opacity: 0;
  transition: opacity 0.6s;
  border-color: #062b45 transparent transparent transparent;
  visibility: hidden;
}

.tooltip:hover:before,
.tooltip:hover:after {
  opacity: 1;
  visibility: visible;
}
```

### 圆形渐变边框

```html
<div class="box gradient-border">炫酷渐变边框</div>
```

```css
.gradient-border {
  border: solid 5px transparent;
  border-radius: 10px;
  background-image: linear-gradient(white, white), linear-gradient(315deg, #833ab4, #fd1d1d 50%, #fcb045);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.box {
  width: 350px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 100px auto;
}
```

### 灰度图片

可以使用 `filter: grayscale()` 过滤器功能将输入图像转换为灰度。

```css
.gray {
  filter: grayscale(100%);
}
```

### 网页置灰

```css
html {
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  /* 兼容 Firefox */
  filter: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='grayscale'><feColorMatrix type='matrix' values='0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'/></filter></svg>#grayscale");
  /* 兼容 IE */
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  /*兼容 Chrome Safari Edge 等 */
  -webkit-filter: grayscale(1);
}
```

### CSS(Unicode 字符) 实现换行

```html
<style>
  .br::after {
    content: "\A";
    white-space: pre;
  }
</style>
<div>
  <span class="br">test</span>
  <span class="br">record</span>
  <span>问题1</span>
</div>
```

### 打印分页时，换页处样式

```css
@media print {
  @page {
    margin: 2cm;
  }
}
```

### 数字等宽

比如：1 和 9 宽度是不一样的。

- `font-variant-numeric`: CSS 属性控制数字，分数和序号标记的替代字形的使用；
- `tabular-nums`: 启用表格数字显示。使数字等宽，易于像表格那样对齐。等同于 OpenType 特性 tnum。
- 也可以通过 `font-feature-settings: "tnum";`来实现相同的功能，兼容性更好。

### font-variant

- `font-variant:small-caps;` 可以实现把段落设置为小型大写字母字体，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。

### text-transform

使用 CSS 在网页上显示每个单词首字母大写的文本，你可以使用：

```css
p {
  text-transform: capitalize;
}
```

### offsetWidth、clientWidth、scrollWidth、scrollTop 的区别

1. offsetWidth：border+padding+content;
2. clientWidth：padding+content;
3. scrollWidth：padding+content 实际宽度;
4. scrollTop：向上滚动的距离;

### NodeList、HTMLCollection 的区别

0. 都是类数组，不是真正的数组，要用 Array.from()转换。
1. Node 是 Document、DocumentFragment、Element、CharacterData 等的基类，Element 是 HTMLElement、SVGElement 的基类，HTMLElement 是 HTMLHEADElement、HTMLInputElement、HTMLTitleElement 等的基类。
2. 获取 Node 和 Element 的返回结果可能不一样，如 elem.childNodes 和 elem.children 不一样。
3. 前者 Node 会包含 Text、Comment 等节点，后者 Element 只会包含 HTML 原素。

### 毛玻璃效果

使用 `backdrop-filter: blur(6px);` 给元素后面区域添加模糊效果，比如准备一个彩色图片，然后在图片上放一个 div，给这个 div 添加`backdrop-filter: blur(6px);`，就可以看到图片被模糊了；如果添加`backdrop-filter: grayscale(1);`，就可以看到图片变成了黑白的，鼠标移入的时候，结合`transition: 2s; width: 0;`，就可以看到图片变成了彩色的。

### 改变输入框光标颜色

```css
input {
  caret-color: red;
}
```

### 阻止你的用户复制文本

```css
div {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
```

### filter 属性

```css
/* 使用单个滤镜 （如果传入的参数是百分数，那么也可以传入对应的小数：40% --> 0.4）*/
filter: blur(5px);
filter: brightness(
  40%
); // 用于调整图像的明暗度。默认值是1；小于1时图像变暗，为0时显示为全黑图像；大于1时图像显示比原图更明亮。
filter: contrast(200%);
filter: drop-shadow(16px 16px 20px blue);
filter: grayscale(50%);
filter: hue-rotate(90deg);
filter: invert(75%);
filter: opacity(25%);
filter: saturate(30%);
filter: sepia(60%);

/* 使用多个滤镜 */
filter: contrast(175%) brightness(3%);

/* 不使用任何滤镜 */
filter: none;
```

通过`animation`和`@keyframes`配合，实现动画效果。

### transition 和 transform

transition 和 transform 是 CSS 中用于创建动画效果的两个不同的属性，它们各自有不同的用途和功能。

#### transform 属性

transform 属性允许你旋转、缩放、倾斜或平移元素。它通过一系列的函数来实现这些效果，例如 `rotate()`, `scale()`, `skew()`, 和 `translate()`。transform 属性直接改变元素的外观，但不会影响页面的布局。transform 通常用于静态效果。transform 不会触发页面重排（reflow）或重绘（repaint），因为它不会改变元素的布局。

如果你想要改变元素的形状、大小或位置，而不影响其他元素，使用 transform。

#### transition 属性

transition 属性用于定义元素的样式如何从一个状态平滑过渡到另一个状态。它通常与 `hover`, `focus`, `active` 等伪类或者通过 JavaScript 改变的 CSS 属性一起使用。transition 可以让你指定哪些属性要过渡，过渡的持续时间，过渡的类型（如线性或缓动函数），以及延迟时间。transition 用于动态效果，即从一个状态过渡到另一个状态。transition 可能会触发重绘，尤其是当过渡的属性影响布局时。

如果你想要让元素的某个或某些属性在一段时间内平滑地从一个值变化到另一个值，使用 transition。

### writing-mode 文字排版方向

```css
writing-mode: vertical-lr;
```

### Grid 中的 place-items

在 grid 布局中，`align-items` 属性控制垂直位置，`justify-items` 属性控制水平位置。这两个属性的值一致时，就可以合并写成一个值。所以，`place-items: center;`等同于`place-items: center center;`。

```css
place-items: center stretch;
```

### 保持宽高比

对于需要保持宽高比的图片，应该用 `padding-top` 实现：

```css
.mod_banner {
  position: relative;
  /* 使用padding-top 实现宽高比为 100:750 的图片区域 */
  padding-top: percentage(100/750);
  height: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
}
/* 通过padding-bottom实现保持宽高比，height设为0，设置背景图片background和background-size: cover */
/* <div class="keep-square"></div> */
.keep-square {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background: url(http://a.hiphotos.baidu.com/image/pic/item/f2deb48f8c5494ee5080c8142ff5e0fe99257e19.jpg) no-repeat
    center center;
  background-size: cover;
}
```

## 如何覆盖组件库的样式

在开发中，经常需要修改第三方组件库的样式，比如 ant-design 和 elementUI，一般有这么几种做法：

1. 直接修改 node_modules 中的源码：多端难以同步，不可取；
2. 修改全局样式：容易与别人的样式发生冲突，也可能不允许这么做，视情况；
3. 样式隔离 CSS Module（React）和 Scoped（Vue）：推荐；

### CSS 中的样式隔离

#### CSS Module（React）

CSS Module 的原理：它的使用很简单，在 CSS 文件加一个后缀`.module`，然后当做一个变量引入到 JS 文件中。

```js
// src/Demo.js
import styles from "./demo.module.css";
export default function Demo() {
  return (
    <div className={styles.myWrapper}>
      <Calendar />
    </div>
  );
}
```

```css
/* src/demo.module.css */
.myWrapper {
  border: 5px solid black;
}
```

被编译后 👇，插入的样式表和元素的 class 属性都会加上一个哈希值作为命名空间。

```html
<style>
  .demo_myWrapper__Hd9Qg {
    border: 5px solid black;
  }
</style>
<div class="demo_myWrapper__Hd9Qg">...</div>
```

React 给我们提供了一个语法`:global`。它生效范围内的样式会被当作全局 CSS。具体使用如下，在 CSS 文件中，使用`:global`包裹希望全局生效的样式，`:global`作用域下的样式编译过后都不会加上哈希：

```css
:global(.ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-today) {
  border-color: purple; /* 覆盖为紫色 */
}
/* SCSS或SASS中，还可以使用嵌套语法： */
:global {
  .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-today {
    border-color: purple;
  }
}
```

借助`:global`语法，即使使用 CSS Module 进行样式隔离也可以如愿实现覆盖功能。

#### Vue 中的 Scoped

Vue 中也有类似的样式隔离功能，使用 Scoped 标记 CSS 部分，使用也很简单 👇：

```html
<div class="myWrapper">
  <Calendar />
</div>
<style scoped>
  .myWrapper {
    border: 5px solid black;
  }
</style>
```

编译出来的代码如下 👇：

```html
<style>
  .myWrapper[data-v-2fc5154c] {
    border: 5px solid black;
  }
</style>
<div class="myWrapper" data-v-2fc5154c>...</div>
```

实际就是借助属性选择器实现样式隔离，样式只会对有 data-v 属性的标签生效。此时 UI 组件库内部的 HTML 元素都没有该属性，因此样式不会对他生效。所以 Vue 提供了一个类似的语法：深度作用选择器。

使用很简单，把要“渗透“进组件内部的样式前面加上`>>>`，作用域内的 CSS 样式都不会带上哈希值作为属性选择器。也可以将`>>>`写成`/deep/`或者`::v-deep`。

相较于 React 的`:global`，Vue 的深度作用选择器是一种更优秀的方案，它必须要一个前导（也就是上面例子中的`.myWrapper` 选择器），前导依旧会被打上哈希值作为属性选择器，要渗透进去的样式实际上是作为它的子选择器，只在当前这个文件下生效，彻底避免造成全局污染。

#### ShadowDOM

ShadowDOM 是 web components 方案中非常重要的一个新增对象，它通过在 custom element 中使用 attachShadow 来开启，开启之后，一个 HTMLElement 将不再显示其原本内部的元素，而是显示其 shadowRoot 内的元素，shadowRoot 是一个 document fragment，是脱离原始文档流的一种存在，因此它具有 css 样式隔离性，通过这种隔离，我们可以很好的在应用中实现一些局部样式的重置和定义（当然，还有组件化效果）。

```js
const snake = document.querySelector("#snake");
const root = snake.createShadowRoot();
root.inner = `
  <style>span { color: red }</style>
  ${snake.innerHTML}
`;
```

#### 总结

综上，对于 Vue 项目，使用提供了一个类似的语法：深度作用选择器--`>>>`或者`/deep/`或者`::v-deep`即可。对于 React 项目，可以使用`:global`属性。

#### React 中 AntDesign 组件样式修改

1. 方法一：借助`styled-components`的 GlobalStyle，创建全局样式；
2. 方法二：创建单独的 style 文件夹，并对相应的组件的样式进行重写，之后在 App.js 中引入，打包的时候确保自定义的样式在 AntDesign 默认样式之后引入即可；

## 防御性 CSS 技能

防的是一切使表现和行为偏离预期效果的情景。出现这些场景的原因是因为终端环境的多样化，开发及测试用例只能覆盖大多数使用场景，在其他环境下，解析机制差异、内容动态变化等，都是导致非预期效果的原因。

### flex-wrap

控制 flex 容器内元素所占空间超出 flex 容器空间时是否折行。flex-wrap 属性默认是不折行的，容易忽略多元素溢出兜底；为兜底，请设置`flex-wrap: wrap;`。`flex-wrap` 属性的初始值为 `nowrap`。这意味着，如果容器中没有足够的空间，项目就会溢出。

### gap

`gap: 1rem;`，适用于 flex 布局时，子元素换行时，子元素之间会有空隙，`gap`属性就是用来控制这个空隙的。这样就避免了使用 margin 时行尾元素对不齐的问题。

### clamp

只有少数浏览器支持，设置绝对最小和最大尺寸以及实际尺寸：`width: clamp(23ch, 60%, 46ch);`

### 保持宽高比

`aspect-ratio: <width> / <height>`

### flex-flow

使用速记 `flex-flow` 来设置 `flex-direction` 和 `flex-wrap` 属性

### margin 间距

调整元素的外边距。用于指定元素与周围空间的距离关系。场景：防止元素与元素之间挤压空间，造成重叠等情况；比如文本溢出、元素换行之后重叠在一起等。

### 长文本处理

当文本长度超出容器时，该如何显示。

1. 换行：不要设置容器的 height 和 word-break 即可；

2. 省略：

```css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

3. 固定展示几行后省略剩余部分：

```css
display: -webkit-box;
overflow: hidden;
max-height: calc(2 * 1.15 * 1.5rem);
line-height: 25px;
word-break: break-all;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
```

### 防止图像被拉伸或压缩

通常，服务器下发的图片尺寸以及用户自定义上传的图片，显示在页面时，不可能百分百与容器尺寸贴合，不可避免的会遇到图片的放缩处理：`object-fit: cover;`

### 锁定滚动链接

`overscroll-behavior`是`overscroll-behavior-x`和`overscroll-behavior-y`的简写属性，它控制的是元素滚动到边界时的表现。换个能听得懂的说法：在 JS 世界里，有事件冒泡机制，你可以通过 event 的 stopPropagation 方法去阻止冒泡的发生，同样，在 CSS 世界里，滚动也有冒泡机制，当内部元素滚动到边界时，如果继续滚动，会带动外层祖先元素发生滚动，这种现象被称为滚动链，为了方便记忆，你也可以把他形象的记忆为滚动冒泡。而`overscroll-behavior`这个属性，就是类似 event 的 stopPropagation 方法阻止冒泡事件一样，提供给开发者去控制内层元素是否可以发生”冒泡“带动外层元素滚动的属性。

页面存在多层滚动元素，需要单独控制每层滚动是否引起外层滚动；

```css
.child {
  overscroll-behavior-y: contain; // 默认是auto；none  和 contain 一样，但它也可以防止节点本身的滚动效果
  overflow-y: auto;
}
```

### CSS 变量默认值

CSS 变量可以实现动态控制元素属性，但是当 CSS 变量未定义或无效时，造成变量值异常，此时，元素的样式将会脱离预期，而变量默认值可以实现异常兜底，保证变量值异常时页面依然能运行。

```css
.item {
  color: var(--my-var, red); /* Red if --my-var is not defined */
}
```

### 弹性元素尺寸 min-height / min-width

当需求要求完整展示某个列表数据，但列表数据所占空间无法固定时，为避免部分内容过宽、过高突破固定空间破坏布局，可以使用弹性尺寸 min-_ 或者 max-_ , 这样能自动适应部分内容所占空间过大或过小带来的样式美观问题；

### 被遗忘的 background-repeat

使用图片作为容器的背景图，当容器的尺寸大于图片尺寸时，默认背景图会重复，如果你在开发中忽略了上述问题，则会出现背景图重复的问题:`background-repeat: no-repeat;`

### 媒体查询 @media

媒体查询的使用更像是 CSS 中的条件判断，它会根据你定义的条件，当条件满足时，条件内的样式生效；

```css
/* 将 body 的背景色设置为蓝色 */
body {
  background-color: blue;
}

/* 在小于或等于 800 像素的屏幕上，将背景色设置为黄色 */
@media screen and (max-width: 800px) {
  body {
    background-color: yellow;
  }
}

/* 在 600 像素或更小的屏幕上，将背景色设置为红色 */
@media screen and (max-width: 600px) {
  body {
    background-color: red;
  }
}
```

### 图片上的文字

当需要在图片上层展示文字时，如果图片加载失败，而外层容器的背景色和文字颜色接近，那么文字的展示效果就不理想；可以给图片容器设置适当的背景色。至于图片加载失败时左上角的“破图”标记，可以使用伪类进行遮挡美化；

### 合理使用滚动条属性

overflow 属性有两个作用很相近的属性值，一个是 scroll, 另一个是 auto; 这两个属性值都能实现当内容大于所占空间时滚动展示，不同点在于使用 scroll 属性无论内容是否超出容器空间，都会展示滚动条，而 auto 属性会分辩条件，内容超出时才会展示滚动条，为超出时则会自动隐藏，样式上较为美观；

### 预留滚动条空间，避免重排

一开始就预留好滚动条的位置，只是不可见，到了滚动条应该出场的时候再让它可见，就能避免不必要的重排了。借助`scrollbar-gutter: stable;`即可实现；也可以把滚动条干掉；

### 图片最大宽度

当给固定宽高容器设置背景图时，如果背景图尺寸超过容器宽高，图片会溢出，因此，最好在项目的 resetCss 中按照以下属性属性初始化：

```css
img {
  max-width: 100%;
  object-fit: cover;
}
```

### 粘性定位

position 的粘性定位指的是通过用户的滚动，元素的 position 属性在 position:relative 与 position:fixed 定位之间切换；这对于需要使用滚动吸顶的场景非常方便；是典型的依据业务场景推动 CSS 技术发展的典例；

### 浏览器兼容性 CSS 请勿批量处理

根据 W3C 标准，批量分组选择选择器，如果分组中，其中一个无效，那么整个选择器都将会失效。因此，在遇到浏览器兼容属性时，切勿批量组合书写。

### flex 属性

1. `flex`：是`flex-grow`、`flex-shrink`、`flex-basis`的缩写。
   - `flex:initial`=>`flex:0 1 auto`：表示默认的 flex 状态，无需专门设置，适合小控件元素的分布布局，或者某一项内容动态变化的布局；
   - `flex:1`=>`flex:1 1 0%`：适合等分布局；
   - `flex:0`=>`flex:0 1 0%`：适用场景较少，适合设置在替换元素的父元素上；
   - `flex:auto`=>`flex:1 1 auto`：适合基于内容动态适配的布局；
   - `flex:none`=>`flex:0 0 auto`：适用于不换行的内容固定或者较少的小控件元素上，如按钮。
2. `flex-direction`：默认`row`、`row-reverse`、`column`、`column-reverse`。
3. `flex-grow`：默认值是`0`。
4. `flex-shrink`：默认值是`1`。
5. `flex-basis`：默认值是`auto`。
6. `align-items`：主要影响交叉轴垂直方向的排列。
   - `flex-start`：垂直方向从上往下排列
   - `center`：垂直方向居中排列
   - `flex-end`：垂直方向从下往上排列
   - `stretch`：会将子元素高度拉伸父元素一致(子元素未设置高度)
   - `baseline`：基线对齐
7. `justify-content`：主要影响水平主轴的排列顺序。沿主轴分配空间。要使 `justify-content` 属性起作用，您必须在容器中主轴方向上留出空闲空间。如果您的项目填满了该轴，没有可供分配的空间，那么该属性不会执行任何操作。
   - `flex-start`：左对齐排列
   - `center`：居中排列
   - `flex-end`：居右排列
   - `space-between`：两端对齐排列
   - `space-around`：间隔相等排列
8. `flex-wrap`：默认`nowrap`。
9. `flex-flow`：这个属性主要是`flex-direction`与`flex-wrap`的结合体。默认`row nowrap`。
10. `align-content`：沿横轴分配空间。初始值为 `stretch`。
11. `place-content: align justify`：用于同时设置`align-content`和`justify-content`属性的速记。
12. `flex-direction`的方向就是主轴的方向，所以主轴和横轴实际上是相对的。

- item 属性

1.  `order`：决定子项目的顺序，order 越小，越是排列在最前面。
2.  `flex-grow`：该属性是决定当前 item 的放大比例，默认是 0 项目不放大。
3.  `flex-shrink`：当前 item 的缩小比例，默认的是 0。
4.  `flex-basis`：设置当前的 item 的固定宽度。
5.  `align-self`：这个属性可以单独控制当前元素的位置。`flex-start`、`center`、`flex-end`。

### grid 属性

1. 网格布局
2. 显式网格属性`grid-template-rows`
3. 显式网格属性`grid-template-columns`
4. 显式网格属性`grid-template-areas`: 在使用时，有几个规则：
   - 该值必须是一个完整的网格，没有空单元。
   - 要跨越轨道重复名称。
   - 通过重复名称创建的区域必须是矩形的，不能断开。
   - 要在网格上留出空白，可以使用一个.或多个之间没有空白的字符。
   - 如果你违反了上述任何一条规则，该值将被视为无效并被丢弃。
5. 隐式网格属性`grid-auto-rows`
6. 隐式网格属性`grid-auto-columns`
7. 隐式网格属性`grid-auto-areas`
8. 间距属性`grid-column-gap`
9. 间距属性`grid-row-gap`
10. `auto-fill`: 尽可能多地生成轨道，即使这些轨道可能是空的。
11. `auto-fit`: 尽可能多地填充容器，并拉伸网格项以填满多余的空间。
12. `minmax()`: 最大最小值
13. `repeat()`: 重复
14. `gap`: 间距
15. `min/max/fit-content()`:min-content:The longest word or image
16. `auto-placement`:
17. `span`: 你可以使自动放置的布局中的部分或全部项目跨越一个以上的轨道。使用 span 关键字加上要跨越的行数作为 `grid-column-end` 或 `grid-row-end` 的值。不用 span 时等效：`[start / end)`，不包含 end。
18. `grid-column/row: start / end`: 作用在某个具体的 item 上，start 的值和 end 取值一样
19. 如果 item 之间相互覆盖了，可以通过`z-index`来调整。
20. `grid-area`: 通过还给每块区域命名，来实现布局的完全控制

```css
header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.content {
  grid-area: content;
}
footer {
  grid-area: footer;
}
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    ". header header header"
    "sidebar content content content"
    "sidebar footer footer footer";
}
```

22. `Named grid lines`:

```css
.container {
  display: grid;
  grid-template-columns:
    [main-start aside-start] 1fr
    [aside-end content-start] 2fr
    [content-end main-end]; /* a two column layout */
}
.sidebar {
  grid-column: aside-start / aside-end;
  /* placed between line 1 and 2*/
}
footer {
  grid-column: main-start / main-end;
  /* right across the layout from line 1 to line 3*/
}
```

23. `grid-template`: 属性是 `grid-template-rows`、`grid-template-columns` 和 `grid-template-areas` 的缩写。首先定义行，同时定义`grid-template-areas`的值。列的大小是在`/`后添加的。

```css
.container {
  display: grid;
  grid-template:
    "head head head" minmax(150px, auto)
    "sidebar content content" auto
    "sidebar footer footer" auto / 1fr 1fr 1fr;
}
```

24. `grid`: `grid-template-rows`、`grid-template-columns`、`grid-template-areas`、`grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`

```css
.container {
  display: grid;
  grid: repeat(2, 80px) / auto-flow 120px;
}
```

25. `justify-content`和`align-content`：在轨道周围或之间的网格容器中分配额外的空间。
26. `justify-self`和`align-self`：应用于一个网格项目，使其在其所在的网格区域内移动。
27. `justify-items`和`align-items`：应用于网格容器，在项目上设置所有的`justify-self`属性。

- `auto-fit`和`auto-fill`的区别：

  - 首先，两者都是按照最小宽度(可以通过`width`、`minmax`、或者`auto`设置)创建尽量多的轨道，如果剩余空间不足一个轨道，两者都会把这部分空间平均分配给每个轨道，如果剩余空间超过一个轨道，那么`auto-fill`会将空轨道以外的部分平均分配，`auto-fit`会把所有剩余空间平均分配。
  - `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));`意思是我的每个子元素至少需要 200px 的宽度，如果视口宽度足够就平均分配剩余空间给每个子元素，至于换行问题需要看分配的所有的轨道空间够不够 200，如果不够 200 就换一行，把多的元素换行，比如有 580px（不考虑 gap），不足以容纳 3\*200=600，3 个子元素，那么就换行，一行两个子元素，那么剩余的 80px 呢，这就属于剩余空间，将（1fr）平均分配给两个轨道。
  - auto-fit 和 auto-fill 只有在容器宽度大于子元素的最小宽度总和时才有显示区别，例如容器随着窗口现在有 1500px 宽度，子元素在一行排列总共需要 600px（不考虑 gap)。auto-fit 和 auto-fill 首先会尽可能多的创建基于 min 的 200px 的轨道宽度，例如创建 1500/200=7.5。那么会有 7 个轨道的 200px 还剩余了 100px 的剩余空间，接着会把这 100px 再次分配到这 7 个轨道中，100/7=14.28。所以每个轨道的宽度现在为 214.28px。在这里位置，auto-fill 和 auto-fit 做的事情是一样的：
    1.  就是尽可能多的创建轨道
    2.  然后不足一个轨道的空间平均分配给已有的轨道
  - auto-fill 的最后一步时保留空轨道留白，不会折叠空轨道
  - auto-fit 的最后一步是，折叠空轨道，将空轨道的空间全部平均分配给已有元素的轨道
  - 值得注意的是这种区别是在容器中元素数量*元素的最小宽度<容器的总宽度时才会显示看到的差异，如果元素数量*最小宽度>容器宽度，那么 auto-fill 和 auto-fit 展现的效果是一样的

- grid 中 auto-fit 和 auto-fill 的区别:
  - auto-fill: 在轨道重复过程中，尽可能多的根据元素创建轨道，如果创建的轨道数量是小数比如 6.5，那么 0.5 就被称为剩余空间，剩余的空间不够一个轨道了，就相当于每个轨道 1fr 进行分配这个 0.5 的剩余空间，没有元素填充的空轨道不会折叠依然保留（相当于留了空白）。
  - auto-fit: 在轨道重复过程中，尽可能多的根据元素创建轨道，并均分不到一个轨道的剩余空间。轨道分配完以后如果轨道中没有元素则将所有没有元素填充的空轨道折叠为 0，即把没有元素填充的空轨道全被分配给有元素的轨道（相当于有元素填充的轨道全部为 1fr）。最后没有空轨道剩余。
  - last: auto-fill 和 auto-fit 一开始做的事情是一样的就是尽可能的分配轨道数量，区别在于后面空轨道是否会折叠为 0。auto-fill 不折叠空轨道，auto-fit 折叠空轨道。

### border 属性

CSS `border`属性是`border-width`(default:`medium`)，`border-style`和`border-color`(default:`currentColor`)这 3 个 CSS 属性的缩写，当`border`属性设置了 1 个值或 2 个值的时候，**剩下的属性值一定是默认值**，例如：

- `border:2px`等同于`border:2px none currentColor`，也就是此时`border-style`是默认值`none`，`border-color`的计算值是当前的色值；
- `border:#fff`等同于`border:medium none #fff`，也就是此时`border-width`是默认值`medium`；
- `border:solid`等同于`border:medium solid currentColor`。
- border 默认使用的是 contentTextColor。如果你只声明边框属性，如宽度，颜色将是那个计算值，除非你明确地设置它。
- `border-inline-end`:`border-right-width`+`border-right-color`
- `border-radius: 95px 155px 148px 103px / 48px 95px 130px 203px;`你可以在`border-radius`中定义这些值，在标准值之后用`/`来定义椭圆的值。这使你能够发挥创意，做出一些复杂的形状。
- `border-image`:`border-image-width`和`border-width`一样：它是你设置边界图像宽度的方式。`border-image-outset`属性让你设置边界图像和它所环绕的盒子之间的距离。

```css
.my-element {
  border-image-source: url(https://assets.codepen.io/174183/border-image-frame.jpg);
  border-image-slice: 61 58 51 48;
  border-image-width: 20px 20px 20px 20px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
}
```

- `border-image-slice`属性是一个有用的属性，它允许你将一个图像切成 9 个部分，由 4 条分割线组成。它的作用类似于 margin 速记，你可以定义顶部、右侧、底部和左侧的偏移值。
- `border-image-repeat`:
  - 初始值是`stretch`，它拉伸源图像以尽可能地填充可用空间。
  - `repeat`是尽可能多地铺设源图像的边缘，并可能通过剪切边缘区域来实现这一目的。
  - `round`与`repeat`相同，但它不是剪切图像边缘区域以尽可能多地适应，而是拉伸图像以及重复图像以实现无缝重复。
  - `space`与重复相同，但这个值在每个边缘区域之间增加空间，以创造一个无缝的图案。

### 为什么 padding/margin 的百分比单位是基于父元素的宽度而不是高度

父元素的高度往往由子元素来决定，如果改变 margin-top 比例增加，相应的，父元素高度也会进行适应性增加；此时父元素高度增加的同时，margin-top 若以父元素高度为基准，则其实际数值又会发生适应性变化，双向因果会造成循环，所以 W3C 的规范做出了以上规定。

### 分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景

0. 联系：它们都能让元素不可见。
1. 结构： `display: none`: 会让元素完全从渲染树中消失，渲染的时候不占据任何空间, 不能点击， `visibility: hidden`:不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，不能点击 `opacity: 0`:不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，可以点击。
2. 继承： `display: none`和`opacity: 0`：是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示。 `visibility: hidden`：是继承属性，子孙节点消失由于继承了 hidden，通过设置`visibility: visible;`可以让子孙节点显式。
3. 性能： `display: none` : 修改元素会造成文档回流，读屏器不会读取`display: none`元素内容，性能消耗较大；`visibility:hidden`: 修改元素只会造成本元素的重绘，性能消耗较少，读屏器读取`visibility: hidden`元素内容；`opacity: 0` ：修改元素会造成重绘，性能消耗较少。
4. 株连性： 如果祖先元素遭遇某祸害，则其子孙孙无一例外也要遭殃，比如：` opacity:0`和`display:none`，若父节点元素应用了`opacity:0`和`display:none`，无论其子孙元素如何挣扎都不会再出现在大众视野； 而若父节点元素应用`visibility:hidden`，子孙元素应用`visibility:visible`，那么其就会毫无意外的显现出来。

### max-width 和 min-width

`max-width` 会覆盖`width`设置，但 `min-width`设置会覆盖 `max-width`。

## 1px 解决方案

### 1.伪元素 + CSS3 缩放

```css
/* // 通过伪元素实现 0.5px border */
.border::after {
  content: "";
  box-sizing: border-box; /* // 为了与原元素等大 */
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 200%;
  border: 1px solid gray;
  transform: scale(0.5);
  transform-origin: 0 0;
}

/* // 通过伪元素实现 0.5px 细线 */
.line::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 1px;
  background: #b3b4b8;
  transform: scale(0.5);
  transform-origin: 0 0;
}

/* // dpr适配可以这样写 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .line::after {
    /* ... */
    height: 1px;
    transform: scale(0.5);
    transform-origin: 0 0;
  }
}
@media (-webkit-min-device-pixel-ratio: 3) {
  .line::after {
    /* ... */
    height: 1px;
    transform: scale(0.333);
    transform-origin: 0 0;
  }
}
```

#### 为什么要先放大 200% 再缩小 0.5？

为了只缩放 border 1px 的粗细，而保证 border 的大小不变。如果直接 scale(0.5) 的话 border 整体大小也会变成二分之一，所以先放大 200%（放大的时候 border 的粗细是不会被放大的）再缩放，就能保持原大小不变了。

#### 为什么采用缩放的方式，就可以解决手机对小数点处理的兼容性问题？

首先代码中处理的是 1px ，避免了直接操作小数像素的问题；当 dpr=2 时，换算成物理像素为 2px，此时去缩放 scale(0.5)、当 dpr=3 时，换算成物理像素为 3px，此时缩放 scale(0.3) 后，手机均会默认使用最小物理像素 1px 来渲染。按照 CSS3 transform 的 scale 定义，边框可以任意细，理论上可以实现任意细的缩放效果。

- 该方案的优点在于，针对老项目使用缩放的形式可以快速实现 1px 的效果。
- 需要注意的是，我们是在 1px 的基础上进行缩放！
- 如果项目中使用了 rem 单位的话，此处的 1px 是不能用 rem 单位的，否则根据 rem 换算后再进行缩放，会使得边框变得更细。
- 如果项目中使用了 postcss-pxtorem 插件进行编译的话，记得不要对 1px 进行编译。参考配置

```css
.ignore {
  border: 1px solid; // ignored
  border-width: 2px; // ignored
}
```

- Px or PX is ignored by postcss-pxtorem but still accepted by browsers。

### 1.5 另一种写法

1 物理像素线（也就是普通屏幕下 1px ，高清屏幕下 0.5px 的情况）采用 transform 属性 scale 实现

```css
.mod_grid {
  position: relative;
  &::after {
    /* 实现1物理像素的下边框线 */
    content: "";
    position: absolute;
    z-index: 1;
    pointer-events: none;
    background-color: #ddd;
    height: 1px;
    left: 0;
    right: 0;
    top: 0;
    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
      -webkit-transform: scaleY(0.5);
      -webkit-transform-origin: 50% 0%;
    }
  }
  ...;
}
```

### 2.动态 Viewport + REM 方式

参考了阿里早期开源的一个移动端适配解决方案 flexible ，本文进行了一些改进。该方案不仅解决了移动端适配的问题，同时也较好的解决了 1px 的问题。

#### 视口

就是浏览器上(或者是一个 APP 中的 webview )用来显示网页的那部分区域，但 viewport 又不局限于浏览器可视区域的大小，它可能比浏览器的可视区域要大，也可能比浏览器的可视区域要小。我们一般最常用的是 layout viewport (浏览器默认的 viewport)。默认宽度大于浏览器可视区域的宽度，所以浏览器默认会出现横向滚动条。

`const clientWidth = document.documentElement.clientWidth || document.body.clientWidth`

#### 通过 meta 标签设置 viewport

如果不设置 meta 标签的话，由于 viewport 默认宽度是大于浏览器可视区域的，所以需要通过设置 viewport 的宽度等于屏幕宽 width=device-width 来避免出现横向滚动条。

```html
<meta
  name="viewport"
  content="
    width=device-width,  // 设置viewport的宽等于屏幕宽
    initial-scale=1.0,  // 初始缩放为1
    maximum-scale=1.0,
    user-scalable=no,  // 不允许用户手动缩放
    viewport-fit=cover // 缩放以填充满屏幕
    " />
```

- name 设置元数据的名称，content 设置元数据的值。name 属性值为 viewport 时，表示设置有关视口初始大小的提示，仅供移动端使用
- 同时设置 width=device-width,initial-scale=1.0 是为了兼容 iOS 和 IE 浏览器

#### 关于页面缩放

`initial-scale` 缩放值越大，当前 viewport 的宽度就会越小，反之亦然。

- 比如屏幕宽度是 320px 的话，如果我们设置 `initial-scale=2` ，此时 viewport 的宽度会变为只有 160px 了。这也好理解，放大了一倍嘛，就是原来 1px 的东西变成 2px 了，但是并不是把原来的 320px 变为 640px ，而是在实际宽度不变的情况下，1px 变得跟原来的 2px 的长度一样了。

所以缩放页面的时候，实际上改变了 CSS 像素的大小，而数量不变。所以原来需要 320px 才能填满的宽度现在只需要 160px 就做到了。

- CSS 像素的定义是，不考虑缩放情况下，1 个 CSS 像素等于 1 个设备独立像素。页面放大 200% 时，CSS 像素个数不变，大小变为二倍，相当于一个 CSS 像素在横纵向上会覆盖两个设备独立像素。浏览器窗口可容纳的设备独立像素数量是不变的，所以可视区域内 CSS 像素数量变少。

#### Flexible 适配方案及问题

Flexible 的大致实现思路是，首先根据 dpr 来动态修改 meta 标签中 viewport 中的 initial-scale 的值，以此来动态改变 viewport 的大小；然后页面上统一使用 rem 来布局，viewport 宽度变化会动态影响 html 中的 font-size 值，以此来实现适配。

- Q:为什么不直接引用 flexible 库来进行移动端适配呢？
- A:因为 lib-flexible 这个库目前基本被弃用

简单实现：

```html
<head>
  <meta
    name="viewport"
    content="width=device-width,user-scalable=no,initial-scale=1,minimum-scale=1,maximum-scale=1,viewport-fit=cover" />
  <script type="text/javascript">
    // 动态设置 viewport 的 initial-scale
    var viewport = document.querySelector("meta[name=viewport]");
    var dpr = window.devicePixelRatio || 1;
    var scale = 1 / dpr;
    viewport.setAttribute(
      "content",
      "width=device-width," +
        "initial-scale=" +
        scale +
        ", maximum-scale=" +
        scale +
        ", minimum-scale=" +
        scale +
        ", user-scalable=no"
    );
    // 计算 rem font-size
    var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    clientWidth > 750 && (clientWidth = 750);
    var ft = (clientWidth / 7.5).toFixed(2); // 以750设计稿为例
    document.documentElement.style.fontSize = ft + "px";
  </script>
</head>
```

- Q:为什么页面缩放比例 initial-scale 设置为 1 / dpr ？
- A:通过设置页面缩放比例为 1/dpr，可将 viewport 的宽度扩大 dpr 倍。还是以 iPhone6 手机为例，不进行页面缩放时 viewport 宽度 375px、dpr=2。由于 dpr 的存在使得一个 CSS 像素需要两个物理像素来渲染。当设置 initial-scale = 1 / dpr = 0.5 时，获取到的 viewport 宽度 clientWidth = 750px ，被扩大了 dpr 倍，就正好是设备物理像素的宽度。简单推导一下就是，当 scale=0.5 时，由于 viewport 内可容纳的 CSS 像素数量的增多，相当于一个设备独立像素在横纵向上会覆盖两个 CSS 像素，此时我们写的 1px 其实正好是一个物理像素的大小，并且可以较好的画出 1px 的边框，从而提高显示精度，从此我们就可以愉快地直接写 1px 啦！同时这个方案也较好的解决了只使用 rem 进行布局时，出现计算后的各种 0.5px、0.55px 等问题。

```js
CSS像素个数 =  设备独立像素个数 /  scale   = （ 物理像素个数 / dpr ）/ scale
scale = 1 / dpr
// 所以
CSS像素个数 = 物理像素个数
```

### 审查设计稿

- 设计稿的审查流程一般都比较固定，我们可以将其整理成为团队内通用的审查清单：

1. 确定设计稿的开发友好性（是否有还原成本高或无法还原的地方）
2. 确定一些特殊的元素是否有合理的边界处理（如文案超出外层容器的边界怎么办）
3. 确定页面的框架结构（Layout）
4. 确定跨页面可复用的组件（Site Component）
5. 确定当前页面可复用的组件（Page Component）

- 依据目标设备的分辨率，制定一套合适的样式断点，并为不同的断点定制必要的 CSS 样式。 移动端优先的页面，可使用 min-width 查询参数从小到大来定义断点。
  断点名称 断点描述）：

1. mobile 移动设备断点，视窗宽度 ≤ 768 px
2. tablet 平板电脑设备断点，视窗宽度 ≥ 769 px
3. desktop 桌面电脑断点，视窗宽度 ≥ 1024 px
4. widescreen 宽屏电脑断点，视窗宽度 ≥ 1216 px
5. fullhd 高清宽屏电脑断点，视窗宽度 ≥ 1408 px

- 友情提醒：桌面版 Chrome 支持的字体大小默认不能小于 12PX，可通过 「chrome://settings/ 显示高级设置－网络内容－自定义字体－最小字号（滑到最小）」设置后再到模拟器里体验 DEMO。

### vw vh 适配方案

vw 是视口单位，视口单位中的“视口”，在桌面端指的是浏览器的可视区域；在移动端指的就是 Viewport 中的 Layout Viewport（布局适口）。

vw 与视口单位的转换关系：

| 单位 | 解释                       |
| ---- | -------------------------- |
| vw   | 1vw = 视口宽度的 1%        |
| vh   | 1vh = 视口高度的 1%        |
| vmin | 选取 vw 和 vh 中最小的那个 |
| vmax | 选取 vw 和 vh 中最大的那个 |

1. 移动端适配做法：针对不同的机型，我们只要算出 ui 设计稿尺寸（一般为 1080px）与视口尺寸（假设为 375px）的比例关系，然后用 vw 尺寸去代替 px 尺寸就好了。

```
k = 1vw = 1080px / 375px = 2.88

y(vw) = 设计稿的尺寸x（px）/ k
```

2. 在实际开发过程当中我们可以利用`postcss-px-to-viewport`插件来帮我们完成这项计算工作。
3. PostCSS 是使用 js 插件转换 css 的工具，你可以把它可以理解成为一个平台，里包含了许多对 css 进行处理的插件。它本身只是负责把 css 代码解析成抽象语法树结构（Abstract Syntax Tree，AST），我理解就是使用 js 对象树来描述 css，然后就可以通过修改 js 对象的方式来修改 css，达到对 css 优化和调整的目的。

```js
// 1. 安装插件: npm install postcss-px-to-viewport
// 2. 在webpack中引入插件，并对插件进行一些配置

const PxtoVw = require('postcss-px-to-viewport')

module.exports = {
  css: {
     loaderOptions: {
        postcss: {
       	    plugins: [
               new PxtoVw({
                  unitToConvert: 'px', // 需要转换的单位，默认为"px"；
                  viewportWidth: 1080, // 设计稿的视口宽度，进行比例换算
                  unitPrecision: 2, // 单位转换后保留的小数位数
                  propList: ['*'], // 要进行转换的属性列表,*表示匹配所有,!表示不转换
                  viewportUnit: 'vw', // 转换后的视口单位
                  fontViewportUnit: 'vw', // 转换后字体使用的视口单位
                  selectorBlackList: [], // 不进行转换的css选择器，继续使用原有单位
                  minPixelValue: 1, // 设置最小的转换数值
                  mediaQuery: false, // 设置媒体查询里的单位是否需要转换单位
                  replace: true // 是否直接更换属性值，而不添加备用属性
                  exclude: [/node_modules/] // 忽略某些文件夹下的文件  由于引用了game/vui的toast组件，需要对其进行vm转换适配
              })
            ]
         }
      }
   }
}
```

4. 插件配置好以后，webpack 打包项目时就会把 css 中的 px 尺寸按照约定好的比例关系转换为 vw 尺寸，实现移动端适配，vw 和 rem 是目前主流的移动端适配方案，兼容性不错。
5. 利用 Sass 函数将设计稿元素尺寸的像素单位转换为 vw 单位

```scss
// iPhone 6尺寸作为设计稿基准
$vw_base: 375;
@function vw($px) {
  @return ($px / $vm_base) * 100vw;
}
```

### 总结

1. 移动端适配主要就分为两方面，一方面要适配不同机型的屏幕尺寸，一方面是对细节像素的处理过程。如果你在项目中直接写了 1px ，由于 dpr 的存在展示导致渲染偏粗，其实是不符合设计稿的要求。

2. 如果你使用了 rem 布局计算出了对应的小数值，不同手机又有明显的兼容性问题。此时老项目的话整体修改 viewport 成本过高，可以采用第一种实现方案进行 1px 的处理；新项目的话可以采用动态设置 viewport 的方式，一键解决所有适配问题。

## 大屏适配方案

### vw vh 适配方案

按照设计稿的尺寸，将 px 按比例计算转为 vw 和 vh。

优点：

- 1. 可以动态计算图表的宽高，字体等，灵活性较高
- 2. 当屏幕比例跟 ui 稿不一致时，不会出现两边留白情况
- 3. 屏幕尺寸发生变化后，需要手动刷新一下才能完成自适应调整

缺点：

- 1.可以动态计算图表的宽高，字体等，灵活性较高
- 2.当屏幕比例跟 ui 稿不一致时，不会出现两边留白情况

```scss
// util.scss
// 使用 scss 的 math 函数，https://sass-lang.com/documentation/breaking-changes/slash-div
@use "sass:math";

// 默认设计稿的宽度
$designWidth: 1920;
// 默认设计稿的高度
$designHeight: 1080;

// px 转为 vw 的函数
@function vw($px) {
  @return math.div($px, $designWidth) * 100vw;
}

// px 转为 vh 的函数
@function vh($px) {
  @return math.div($px, $designHeight) * 100vh;
}

// 使用
.box {
  width: vw(300);
  height: vh(100);
  font-size: vh(16);
  background-color: black;
  margin-left: vw(10);
  margin-top: vh(10);
  border: vh(2) solid red;
}
```

### scale 适配方案

通过 scale 属性，根据屏幕大小，对图表进行整体的等比缩放

- 当屏幕宽高比 < 设计稿宽高比，我们需要缩放的比例是屏幕宽度 / 设计稿宽度
- 当屏幕宽高比 > 设计稿宽高比，我们需要缩放的比例是屏幕高度 / 设计稿高度
- 设置居中：首先我们利用 `transform: translate(-50%,-50%)` ，将动画的基点设为左上角，然后利用`transform: translate(-50%,-50%)`，将图表沿 x，y 轴移动 50%，接下来利用绝对定位将图表定位到中间位置。

优点：

- 1.代码量少，适配简单
- 2.一次处理后不需要在各个图表中再去单独适配

缺点：

- 1.因为是根据 ui 稿等比缩放，当大屏跟 ui 稿的比例不一样时，会出现周边留白情况
- 2.当缩放比例过大时候，字体会有一点点模糊，就一点点
- 3.当缩放比例过大时候，事件热区会偏移。

### rem + vw vh 适配方案

关于 rem：rem(font size of the root element)，是 css3 中新增的一个大小单位，即相对于根元素 font-size 值的大小。

1.获得 rem 的基准值, 2.动态的计算 html 根元素的`font-size`, 3.图表中通过 vm vh 动态计算字体、间距、位移等.

优点：

- 布局的自适应代码量少，适配简单

缺点：

- 1.因为是根据 ui 稿等比缩放，当大屏跟 ui 稿的比例不一样时，会出现周边留白情况
- 2.图表需要单个做字体、间距、位移的适配

自适应思路：

动态的计算出页面的 fontsize 从而改变 rem 的大小。

1. 拿 `1920 * 1080` 的标准屏幕大小为例，将屏幕分为 10 份，先计算 rem 的基准值: `1920 / 10 = 192`；
2. 把所有元素的长、宽、位置、字体大小等原来的 px 单位全部转换成 rem；
3. 网页加载后，用 js 去计算当前浏览器的宽度，并设置 html 的 `font-size` 为 (举例：当前浏览器窗口宽度 / 10) 。
4. 屏幕变化后，图表自动调整字体、间距、位移等，让然需要写个工具函数（可以挂到全局下）来进行具体数值的转换。
5. 屏幕尺寸发生变化后，需要手动刷新一下才能完成自适应调整：可以写个指令监听绑定的 div 大小变化，触发更新 echarts 大小。

### 总结

1. 如果想简单，客户能同意留白，选用 scale 即可
2. 如果需要兼容不同比例的大屏，并且想在不同比例中都有比较好的效果，图表占满屏幕，类似于移动端的响应式，可以采用 vm vh 的方案
3. 至于 rem，个人觉得就是 scale 和 vm vh 的综合，最终的效果跟 scale 差不多

## CSS 新特性

### 1. @property

`@property`可以用来自定义一个 CSS 属性，然后使用。

```html
<style>
  /* 自定义属性 */
  @property --t {
    syntax: "<integer>";
    inherits: false;
    initial-value: 0;
  }
  @counter-style stop {
    system: cyclic;
    symbols: "Go~";
    range: infinite 0;
  }
  html,
  body {
    margin: 0;
    height: 100%;
    display: grid;
    place-content: center;
  }
  count-downqq {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Consolas, Monaco, monospace;
    font-size: 120px;
  }
  count-downqq::after {
    --t: 5;
    --dur: 1;
    counter-reset: time var(--t);
    content: counter(time, stop);
    animation: count calc(var(--t) * var(--dur) * 1s) steps(var(--t)) forwards, shark calc(var(--dur) * 1s) calc(
          var(--dur) * 0.8s
        )
        calc(var(--t));
  }
  count-downqq:active::after {
    animation: none;
  }

  @keyframes count {
    to {
      --t: 0;
    }
  }

  @keyframes shark {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    20% {
      opacity: 0;
      transform: scale(0.4);
    }
  }

  @keyframes shark {
    0% {
      opacity: 1;
      transform: translateY(0);
    }

    20% {
      opacity: 0;
      transform: translateY(100px);
    }

    21% {
      opacity: 0;
      transform: translateY(-100px);
    }
  }

  @keyframes shark {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    20% {
      opacity: 0;
      transform: scale(0.4);
    }

    21% {
      opacity: 0;
      transform: scale(5);
    }
  }
</style>

/* 自定义标签，然后再style中使用自定义的属性--t */
<count-downqq style="--t: 5"></count-downqq>
```

## 如何用一行 CSS 实现 10 种现代布局

### 超级居中：place-items: center

```css
.parent {
  width: 100vw;
  height: 100vh;
  /* grid */
  display: grid;
  align-items: center;
  justify-items: center;
  /* place-items: center; */

  /* flex */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 解构煎饼式布局：`flex: <grow> <shrink> <baseWidth>`

配合`flex-wrap`进行换行

1. grow: 能否放大
2. shrink: 能否缩小
3. basis: 最小宽度

### 侧边栏布局：`grid-template-columns: minmax(<min>, <max>) …)`

minmax 可以设置最大最小区间

```css
.parent {
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr;
}
```

### 煎饼堆栈布局：`grid-template-rows: auto 1fr auto`

```css
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

### 经典圣杯布局：`grid-template: auto 1fr auto / auto 1fr auto`

```css
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
header {
  padding: 2em;
  grid-column: 1/4;
}
.left-side {
  grid-column: 1/4;
}
```
