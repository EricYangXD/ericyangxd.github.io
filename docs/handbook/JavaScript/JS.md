---
title: JavaScript Tips
author: EricYangXD
date: "2021-12-29"
---

## 类型转换

-   依赖 valueOf,toString,ToPrimitive
-   真值表如下:
-   ![JS类型转换真值表](../../assets/js-true-value.png "JS类型转换真值表")

## 判断上传的文件类型

1. 通过 input 元素的 accept 属性来限制文件的类型

```js
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
