---
title: CSS Tips3
author: EricYangXD
date: "2022-12-13"
meta:
  - name: keywords
    content: CSS3,CSS
---

## Tips

### 5 个有用的 CSS 伪元素

1. `::backdrop`:通过使用 `::backdrop` 伪元素，我们可以改变 `<dialog>` 元素或任何通过 `Fullscreen API` 显示为全屏的元素的背景风格。
2. `::marker`:使用`::marker`，我们可以改变颜色，使用任何图像 / 自定义字体，添加动画 / 过渡 -- 为列表的子弹 / 数字。
3. `::selection`:使用`::selection`，我们可以改变选定的颜色、背景或文字阴影。
4. `::file-selector-button`:我们可以使用`::file-selector-button` 伪元素改变文件上传按钮的样式。
5. `::placeholder`:使用`::placeholder` 伪元素，我们可以改变 `<input>` 或 `<textarea>` 元素的占位符文本的样式。
6. `::cue`:它允许你设计 WebVTT 提示，也就是<视频>元素的标题。也可以在`::cue`中传递一个选择器，这允许你对字幕中的特定元素进行样式设计。

```less
// 如果你有一个以全屏模式呈现的元素，如<dialog>或<video>，你可以用::backdrop伪元素来设计背景--该元素和页面其他部分之间的空间
dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

.list li::marker {
  color: red;
  content: "😄";
  /* content:url("./selected.svg"); */
}

p::selection {
  background-color: yellow;
  color: green;
  text-shadow: 1px 1px 3px deeppink;
}

input[type="file"]::file-selector-button {
  border: 1px solid grey;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: white;
  }
}

input::placeholder {
  color: blue;
  opacity: 0.5;
}

.button:active {
  transform: scale(0.9); // 点击按钮的时候实现一个缩放效果
  box-shadow: none;
}
```

### aspect-ratio

可以设置图片的首选纵横比: `width/height`，宽高比更确切。

```css
.photos img {
  width: 15%;
  aspect-ratio: 3/2;
  object-fit: contain;
  mix-blend-mode: color-burn;
  /* mix-blend-mode: color-dodge;
	mix-blend-mode: color-burn;
	mix-blend-mode: color;
	mix-blend-mode: exclusion; */
}
```

### :first-of-type

like `:first-child`

### 合并子级连结符

合并子级连结符，例：`.top > * + *`，该规则现在仅适用于 `.top` 的直接子级。

### 使用变量

在 css 中使用变量，像在 scss 或者 less 中那样。如果定义在根伪类 `:root` 下，那么它包含的值则可以在整个文档中重复使用。由自定义属性标记设定值（比如： `--main-color: black;`），由 `var()` 函数来获取值（比如： `color: var(--main-color);`）。

- 声明一个自定义属性，属性名需要以两个减号（--）开始，属性值则可以是任何有效的 CSS 值。
- 和其他属性一样，自定义属性也是写在规则集之内的。比如写在某个具体的 class 中。
- 自定义属性名是大小写敏感的。
- 使用一个局部变量时用 `var()` 函数包裹以表示一个合法的属性值。
- 用 `var()` 函数可以定义多个备用值（fallback value），当给定值未定义时将会用备用值替换。这对于 Custom Element 和 Shadow DOM 都很有用。
- 如果`var()` 函数获取的值是不合法的或者错误的，那么该属性不会产生任何作用，1 检查属性 color 是否为继承属性。2 否则会将该值设置为它的默认初始值。
- 当 CSS 属性 - 值对中存在语法错误，该行则会被忽略。然而如果自定义属性的值无效，它并不会被忽略，从而会导致该值被覆盖为默认值。
- 在 JavaScript 中获取或者修改 CSS 变量和操作普通 CSS 属性是一样的：

```js
// 获取一个 Dom 节点上的 CSS 变量
element.style.getPropertyValue("--my-var");

// 获取任意 Dom 节点上的 CSS 变量
getComputedStyle(element).getPropertyValue("--my-var");

// 修改一个 Dom 节点上的 CSS 变量
element.style.setProperty("--my-var", jsVar + 4);
```

```css
:root {
  --gutter: 20px;
  --spacing: 1em;
}

h1 {
  margin-left: var(--gutter, 20px);
  margin-top: var(--spacing);
  color: var(--h1-color, --h1-font, #000);
}
```

### mask-image

`mask-image` 属性设置了用作元素蒙版层的图像。默认情况下，这意味着蒙版图像的 alpha 通道将与元素的 alpha 通道相乘。可以使用 `mask-mode` 属性对此进行控制。B 站视频中的人物不遮挡弹幕，就是用了这个技术。当然最主要还是先用 AI 把视频里的人物抠出来，生成一层蒙版。

```css
/* 关键字值 */
mask-image: none;

/* <mask-source> 值 */
mask-image: url(masks.svg#mask1);

/* <image> 值 */
mask-image: linear-gradient(rgba(0, 0, 0, 1), transparent);
mask-image: image(url(mask.png), skyblue);

/* 多个属性值 */
mask-image: image(url(mask.png), skyblue), linear-gradient(rgba(0, 0, 0, 1), transparent);

/* 全局属性值 */
mask-image: inherit;
mask-image: initial;
mask-image: revert;
mask-image: revert-layer;
mask-image: unset;
```

### 实体空格

1. `&nbsp;`：最常用的，不换行空格，占据的宽度可能会受到字体样式、容器宽度、CSS 布局和其他相关因素影响
2. `&ensp;`：半角空格，占据的宽度正好是 0.5 个中文字符的宽度
3. `&emsp;`：全角空格，占据的宽度正好是 1 个中文字符的宽度

### font-size: 0

设置字体大小为 0，还可以消除子行内元素间额外多余的空白！

比如多个 img 标签并排、span 标签回车换行时，以及缩进、空格等字符同样也会产生空白间隙，导致元素间产生多余的间距。

此时可以取消换行、空格。或者设置父容器`font-size: 0;`

或者直接 flex 布局。

### object-fit

用于对图片的展示方式进行控制，可以设置为：

1. `fill`：默认值，拉伸填充满容器，图片会变形
2. `contain`：保持图片原有比例，缩放图片，使其尽可能大，同时又不超出容器
3. `cover`：保持图片原有比例，缩放图片，使其尽可能小，同时又不留白
4. `none`：保持图片原有比例，不缩放图片，使其尽可能小，同时又不留白
5. `scale-down`：保持图片原有比例，缩放图片，使其尽可能小，同时又不留白，与 none 或 contain 中的较小者相同
6. `inherit`：继承父元素的 object-fit 属性
7. `initial`：使用默认值 fill
8. `unset`：继承父元素的 object-fit 属性，如果没有父元素，则使用 initial
9. `revert`：继承父元素的 object-fit 属性，如果没有父元素，则使用 none

### scrollbar-thumb

```css
::-webkit-scrollbar-thumb {
  width: 8px;
  background: #8c8c8c;
  border-radius: 4px;
}
```

### 动态头像

通过 css 实现一个鼠标指针 hover 时头像探出的效果，头像图片背景色要透明

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <style>
      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        --s: 280px;
        --c1: #c02942;
        --c2: #ecd078;
        --b: 5px;
        --f: 1;
        --bgOption: content-box no-repeat center/ calc(100% / var(--f)) 100%;
        --shrink: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

        width: var(--s);
        height: var(--s);
        cursor: pointer;
        outline: 5px solid;
        transition: 0.5s;
        padding-top: 200px;
        outline: var(--b) solid var(--c1);
        outline-offset: var(--shrink);
        border-radius: 0 0 999px 999px;
        transform: scale(var(--f));

        background: radial-gradient(
            circle closest-side,
            var(--c2) calc(99% - var(--b)),
            var(--c1) calc(100% - var(--b)),
            var(--c1) 99%,
            transparent 100%
          ) var(--bgOption);

        -webkit-mask: linear-gradient(#000 0 0) no-repeat center calc(0px - var(--shrink)) / calc(
              100% / var(--f) - 2 * var(--b)
            )
            50%, radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption);
      }
      img:hover {
        --f: 1.35;
      }
    </style>
  </head>
  <body>
    <img src="https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202401091434672.png" alt="avatar" />
  </body>
</html>
```

### 纯 CSS 实现鼠标 hover 后的下划线效果

```html
<style>
  .title {
    color: #333;
    line-height: 2;
  }

  .title span {
    background: linear-gradient(to right, #ec695c, #61c454) no-repeat right bottom;
    background-size: 0 2px;
    transition: background-size 1300ms;
  }

  .title span:hover {
    background-position-x: left;
    background-size: 100% 2px;
  }
</style>

<h2 class="title">
  <span> 十年后，你会发现CSS才是你永远都学不会的语言！</span>
</h2>
```

### CSS 打字机效果

[参考链接](https://css-tricks.com/snippets/css/typewriter-effect/)
