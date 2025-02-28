---
title: SCSS笔记
author: EricYangXD
date: "2022-09-21"
meta:
  - name: keywords
    content: SASS,SCSS,sass,scss
---

## SASS≈SCSS

[文档](https://www.sass.hk/docs/)

### @-Rules 与指令 (@-Rules and Directives)

#### @import

1. Sass 拓展了 @import 的功能，允许其导入 SCSS 或 Sass 文件。被导入的文件将合并编译到同一个 CSS 文件中，另外，被导入的文件中所包含的变量或者混合指令 (mixin) 都可以在导入的文件中使用。
2. 通常，@import 寻找 Sass 文件并将其导入，但在以下情况下，@import 仅作为普通的 CSS 语句，不会导入任何 Sass 文件。
   - 文件拓展名是 `.css`；
   - 文件名以 `http://` 开头；
   - 文件名是 `url()`；
   - `@import` 包含 media queries。
3. 如果不在上述情况内，文件的拓展名是 .scss 或 .sass，则导入成功。没有指定拓展名，Sass 将会试着寻找文件名相同，拓展名为 .scss 或 .sass 的文件并将其导入。以下二者等效：

`@import "foo.scss";`===`@import "foo";`，都会导入文件 foo.scss，但是：

```scss
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

编译为：

```scss
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

4. 分音 (Partials)：如果需要导入 SCSS 或者 Sass 文件，但又不希望将其编译为 CSS，只需要在文件名前添加下划线，这样会告诉 Sass 不要编译这些文件，但导入语句中却不需要添加下划线。例如，将文件命名为 `_colors.scss`，便不会编译 `_colours.css` 文件。`@import "colors";`导入的其实是 \_colors.scss 文件。注意，**不可以同时存在添加下划线与未添加下划线的同名文件，添加下划线的文件将会被忽略**。

#### @mixin

Mixin 允许你定义一组样式，并在需要的地方重复使用这些样式，同时可以传递参数来定制化样式。

```scss
// 1. 定义一个名为 "button" 的 mixin，它接收4个参数：$width、$height、$color、$bg。
@mixin button($width: 100px, $height: 40px, $color: blue, $bg: white) {
  width: $width;
  height: $height;
  color: $color;
  background-color: $bg;
  padding: 10px 20px;
  border-radius: 5px;
}

// 使用默认参数
.primary-button {
  @include button;
}

// 自定义参数
.secondary-button {
  @include button(red, yellow);
}

// 2. 条件语句
@mixin responsive-font($size) {
  font-size: $size;

  @if $size > 16px {
    color: blue;
  } @else {
    color: green;
  }
}

// 使用
.large-font {
  @include responsive-font(20px); // font-size: 20px; color: blue;
}

.small-font {
  @include responsive-font(14px); // font-size: 14px; color: green;
}

// 3. 嵌套 Mixin
@mixin flex-container($direction: row) {
  display: flex;
  flex-direction: $direction;

  & > * {
    margin: 10px;
  }
}

// 使用
.header {
  @include flex-container(row);
}

.footer {
  @include flex-container(column);
}

// 4. Mixin 作为 CSS 类，创建特定的 CSS 类，这样可以在多个地方复用相同的样式。
@mixin clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

// 使用
.container {
  @include clearfix;
}

// 5. 使用 Mixin 来创建复用的动画效果
@mixin fade-in($duration: 0.5s) {
  animation: fadeIn $duration ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

// 使用
.modal {
  @include fade-in(1s);
}

// 6. Mixin 还可以组合在一起，使样式更为灵活和可复用。
@mixin transition($property, $duration) {
  transition: $property $duration ease;
}

@mixin button-style {
  padding: 10px;
  border-radius: 5px;
  @include transition(all, 0.3s);
}

// 使用
.btn {
  @include button-style;
}
```

#### @include

@include 指令允许你使用 mixin。
