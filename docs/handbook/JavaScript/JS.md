---
title: JavaScript Tips
author: EricYangXD
date: "2021-12-29"
---

## 原型、继承、原型链

-   [参考](https://juejin.cn/post/6844903837623386126)

-   ![原型关系图](../../assets/proto.png "原型关系图")

ECMAScript 中\-所有\-函数的参数都是按值传递的。也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样。

共享传递是指，在传递对象的时候，传递对象的引用的副本。注意：按引用传递是传递对象的引用，而按共享传递是传递对象的引用的副本！

**参数如果是基本类型是按值传递，如果是引用类型按共享传递**。但是因为拷贝副本也是一种值的拷贝，所以在高程中也直接认为是按值传递了。

## 类型转换

-   依赖 valueOf,toString,ToPrimitive
-   真值表如下:
-   ![JS类型转换真值表](../../assets/js-true-value.png "JS类型转换真值表")

## 静态作用域与动态作用域

JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。函数的作用域在函数定义的时候就决定了。而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

## 判断上传的文件类型

1. 通过 input 元素的 accept 属性来限制文件的类型

```html
<input id="file" type="file" accept="image/*" />
```

2. 通过截取文件名后缀的方式来判断

```js
const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
```

3. 利用 file-type

4. 利用 vscode 插件 hexdump for VSCode 以十六进制的形式查看二进制文件--同一种类型的文件，他们的头信息是完全相同的
    > 1. 在获取文件对象后，我们可以通过 FileReader API 来读取文件的内容;
    > 2. 然后将结果转为 Unicode 编码，再转为十六进制;
    > 3. **没有必要将整个文件转为十六进制，我们只需要截取文件的前几个字节，然后将截取后的文件转为十六进制，再进行比对就可以**;

```html
<input id="file" type="file" />
<script>
	file.addEventListener("change", async (e) => {
		const file = e.target.files[0];
		const flag = await isImage(file);
		if (flag) {
			alert("上传格式通过！");
		} else {
			alert("请上传正确的格式！");
		}
	});
	// 判断是否为图片
	async function isImage(file) {
		return (
			(await isGif(file)) || (await isPng(file)) || (await isJpg(file))
		);
	}
	// 判断是否为 jpg 格式
	async function isJpg(file) {
		const res = await blobToString(file.slice(0, 3));
		return res === "FF D8 FF";
	}
	// 判断是否为 png 格式
	async function isPng(file) {
		const res = await blobToString(file.slice(0, 4));
		return res === "89 50 4E 47";
	}
	// 判断是否为 gif 格式
	async function isGif(file) {
		const res = await blobToString(file.slice(0, 4));
		return res === "47 49 46 38";
	}
	// 将文件转为十六进制字符串
	async function blobToString(blob) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = function () {
				const res = reader.result
					.split("") // 将读取结果分割为数组
					.map((v) => v.charCodeAt()) // 转为 Unicode 编码
					.map((v) => v.toString(16).toUpperCase()) // 转为十六进制，再转大写
					.map((v) => v.padStart(2, "0")) // 个位数补0
					.join(" "); // 转为字符串
				resolve(res);
			};
			reader.readAsBinaryString(blob); // 将文件读取为二进制字符串
		});
	}
</script>
```

## .env 文件原理解析

-   一句话总结 dotenv 库的原理。用 fs.readFileSync 读取 .env 文件，并解析文件为键值对形式的对象，将最终结果对象遍历赋值到 process.env 上。

> Dotenv 是一个零依赖模块，可将 .env 文件中的环境变量加载到 process.env 中
> 如果需要使用变量，则配合如下扩展包使用 —— dotenv-expand

### 4 个功能

1. 读取 .env 文件
2. 解析 .env 文件拆成键值对的对象形式
3. 赋值到 process.env 上
4. 最后返回解析后得到的对象

## open 的原理

-   用法：--open 或者 --no-open
-   地址[open](https://github.com/sindresorhus/open)

-   一句话概括 open 原理则是：针对不同的系统，使用 Node.js 的子进程 child_process 模块的 spawn 方法，调用系统的命令打开浏览器.
-   对应的系统命令简单形式则是：

```bash
# mac
open https://ericyangxd.top/
# win
start https://ericyangxd.top/
# linux
xdg-open https://ericyangxd.top/
```

## 前端生成水印 watermark

### 使用 Canvas

-   原理：使用 Canvas 绘制好图片，利用 canvas.toDataURL()转换为 base64 格式，然后给顶层的#root 设置 background-image 即可，注意调整样式。
    示例代码：

```js
var canvas = document.getElementById("canvas");
const angle = -40;
const txt = `Good Luck Infinity Co. ericyangxd.top ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
const canvasWidth = 500;
const canvasHeight = 500;
if (canvas.getContext) {
	// drawing code here
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	const ctx = canvas.getContext("2d");
	// 通过把像素设置为透明以达到擦除一个矩形区域的目的。
	// 请确保在调用 clearRect()之后绘制新内容前调用beginPath() 。
	// 清除整个画布
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	// 文字填充颜色
	ctx.fillStyle = "#000";
	// 文字透明度
	ctx.globalAlpha = 0.8;
	// 同CSS font，至少包含font-size和font-family
	ctx.font = "bold 20px 微软雅黑";
	// 旋转弧度
	ctx.rotate((Math.PI / 180) * angle);
	// -280： 文字向左偏移； 380：文字向下偏移； strokeText：中空字体； fillText：实线字体
	ctx.fillText(txt, -280, 380);
}
```

### 透明图片覆盖

-   太 low 了，不用

## 一个 function

```js
function f() {
	conssole.log(arguments);
}

var a = `world`;
f`Hello ${a}!`;
// 会打印如下：
// [["Hello ","!"],"world"]
```

## JS 类型

### 对应类型

-   JS 7(8) 种基本类型对应的是：undefined, null, object, boolean, string, number, symbol(, bigint)。
-   那么 7 种语言类型应该对应的什么？作者回复:
    -   List 和 Record
    -   Set
    -   Completion Record
    -   Reference
    -   Property Descriptor
    -   Lexical Environment 和 Environment Record
    -   Data Block

### 类型检测

| 不同类型/优缺点 | typeof                      | instanceof                        | constructor                                  | Object.prototype.toString.call        |
| --------------- | --------------------------- | --------------------------------- | -------------------------------------------- | ------------------------------------- |
| 优点            | 简单易用                    | 检测引用类型                      | 基本能检测所有的类型（除 null 和 undefined） | 可以检测出所有类型                    |
| 缺点            | 只能检测基本类型（除 null） | 只能检测引用类型，且不能跨 iframe | constructor 易被修改，也不能跨 iframe        | IE6 下，undefined 和 null 均为 Object |

### XHR 请求文件

```js
// 可以跨域请求 html
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://xyz.example.com/secret/file.txt");
xhr.onreadystatechange = function (e) {
	if (xhr.readyState === 4) {
		console.log("got result: ", xhr.responseText);
	}
};
xhr.send();
```

-   然后可以对这个文件进行解析啥的`formatHtml(xhr.responseText)`，适用于抓到别人的网页之后，解析一下 body 放到自己的页面里。

### 移除 a 标签的默认跳转行为

```js
// 1
$(ele).attr("href", "javascript:void(0);");
// 2
$(ele).onclick = function () {
	return false;
};
// 3
$(ele).attr("target", "");
```

### 通过 Canvas 做 web 身份识别

-   原理：通过 Canvas 生成指纹，做识别。

```js
// PHP 中，bin2hex() 函数把 ASCII 字符的字符串转换为十六进制值。字符串可通过使用 pack() 函数再转换回去
// 下面是PHP 的 bin2hex 的 JavaScript 实现
function bin2hex(s) {
	let n,
		o = "";
	s += "";
	for (let i = 0, l = s.length; i < l; i++) {
		n = s.charCodeAt(i).toString(16);
		o += n.length < 2 ? "0" + n : n;
	}

	return o;
}

// 获取指纹UUID
function getUUID(domain) {
	// 创建 <canvas> 元素
	let canvas = document.createElement("canvas");
	// getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性
	let ctx = canvas.getContext("2d");
	// 设置在绘制文本时使用的当前文本基线
	ctx.textBaseline = "top";
	// 设置文本内容的当前字体属性
	ctx.font = "14px 'Arial'";
	// 设置用于填充绘画的颜色、渐变或模式
	ctx.fillStyle = "#f60";
	// 绘制"被填充"的矩形
	ctx.fillRect(125, 1, 62, 20);
	ctx.fillStyle = "#069";
	// 在画布上绘制"被填充的"文本
	ctx.fillText(domain, 2, 15);
	ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
	ctx.fillText(domain, 4, 17);

	// toDataURL返回一个包含图片展示的 data URI
	let b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
	// atob() 方法用于解码使用 base-64 编码的字符串；base-64 编码使用方法是 btoa()，这俩都是window全局方法
	let crc = bin2hex(atob(b64).slice(-16, -12));
	return crc;
}

// 调用时，你可以传入任何你想传的字符串，并不局限于传递domain，这里只是为了便于区分站点
console.log(getUUID("https://www.baidu.com/"));
```

### JS APIs

1. Array

```js
Array("1" + 1);
// ['11']
Array(1 + 1);
// [empty × 2]
```

## 回车与换行

电传打字机：

1. 在每行后面加两个表示结束的字符：一个叫做"回车"，告诉打字机把打印头定位在左边界；另一个叫做"换行"，告诉打字机把纸向下移一行。

计算机发明后：

1. Unix 系统里，每行结尾只有`<换行>`，即`\n`；
2. Windows 系统里面，每行结尾是`<回车><换行>`，即`\r\n`；
3. Mac 系统里，每行结尾是`<回车>`。

一个直接后果是，Unix/Mac 系统下的文件在 Windows 里打开的话，所有文字会变成一行；而 Windows 里的文件在 Unix/Mac 下打开的话，在每行的结尾可能会多出一个^M 符号。

`\n`是匹配一个换行符，`\r`是匹配一个回车符。`\0`表示匹配 NULL（U+0000）字符，空字符（Null character）又称结束符，缩写 NUL，是一个数值为 0 的控制字符。
