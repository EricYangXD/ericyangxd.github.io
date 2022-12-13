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

```less
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
```
