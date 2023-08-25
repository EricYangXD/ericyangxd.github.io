---
title: 小程序 & Taro
author: EricYangXD
date: "2021-12-29"
---

> **_小程序的官方开发文档日新月异，要想不踩坑则必须时刻关注官方文档！！！_**

## 小程序登录流程

-   参考这篇[文章](https://cloud.tencent.com/developer/article/1797514#:~:text=%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%AE%9E%E7%8E%B0%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95%E6%B5%81%E7%A8%8B%201%20%E8%8E%B7%E5%8F%96%E4%B8%B4%E6%97%B6code%202%20%E8%B0%83%E7%94%A8%20auth.code2Session,%E6%8E%A5%E5%8F%A3%EF%BC%8C%E6%8D%A2%E5%8F%96%E7%94%A8%E6%88%B7%20.%20...%203%20%E7%BC%93%E5%AD%98%E8%87%AA%E5%AE%9A%E4%B9%89%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81%EF%BC%8C%E8%AF%B7%E6%B1%82%E4%B8%9A%E5%8A%A1%E6%95%B0%E6%8D%AE%E5%B8%A6%E4%B8%8A%E8%87%AA%E5%AE%9A%E4%B9%89%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81%204%20%E9%AA%8C%E8%AF%81%E5%B9%B6%E8%BF%94%E5%9B%9E%E4%B8%9A%E5%8A%A1%E6%95%B0%E6%8D%AE)

-   简单来说就是：1.先 wx.login()拿到 code，2.把 code 传给后端，后端拿到 code 后跟微信服务器通信，获得用户的 openid 和 sessionkey 等信息，3.再进行自定义登录流程即可。

-   每个用户的 openid 是固定。后端跟微信服务器通信时也需要这个小程序的 appkey、appsecret 等信息，这是固定的不会变化。

## 获取用户设置然后获取授权拿到用户信息

```js
Taro.getSetting({
	success(res) {
		if (!res.authSetting["scope.userInfo"]) {
			Taro.authorize({
				scope: "scope.userInfo",
				success() {
					console.log("getSetting", res);
				},
			});
		} else {
			// 必须是在用户已经授权的情况下调用
			Taro.getUserInfo({
				success(result) {
					console.log("getUserInfo", result);
					const userInfo = result.userInfo;
					setUserInfo({ ...userInfo });
					Taro.navigateTo({ url: "/pages/index/index" });
				},
			});
		}
	},
	fail(err) {
		Taro.showToast({
			title: `获取用户信息失败，请授权 ${err}`,
			icon: "none",
			duration: 2000,
		});
	},
});
```

## 获取写入图片权限

```js
Taro.getSetting({
	success(res) {
		if (!res.authSetting["scope.writePhotosAlbum"]) {
			Taro.authorize({
				scope: "scope.writePhotosAlbum",
				success() {
					console.log("writePhotosAlbum", res);
				},
			});
		} else {
			// 必须是在用户已经授权的情况下调用
			// TODO save picture
			save2album();
		}
	},
	fail(err) {
		Taro.showToast({
			title: `获取用户信息失败，请授权 ${err}`,
			icon: "none",
			duration: 2000,
		});
	},
});
```

## 绘制 Canvas

-   使用 Painter

```js
<Painter
	palette={palette}
	onImgOK={onImgOK}
	onImgErr={onImgErr}
	customStyle="position:fixed; left:-9999rpx;"
/>;

/**
 * 保存图片到本地相册
 */
const save2album = () => {
	if (filePath !== "") {
		Taro.saveImageToPhotosAlbum({
			filePath,
			success(res) {
				Taro.showModal({
					title: "图片保存成功",
					content: "图片成功保存到相册了，快去发朋友圈吧~",
					showCancel: false,
					confirmText: "确认",
				});
			},
			fail(err) {
				Taro.showModal({
					title: "图片保存失败",
					content: "请重新尝试!",
					showCancel: false,
					confirmText: "确认",
				});
			},
		});
	} else {
		Taro.showToast({
			title: "获取图片地址失败",
			duration: 2000,
		});
	}
};
/**
 * Painter绘制canvas成功后的回调
 */
const onImgOK = (e) => {
	setFilePath(e.path);
};
/**
 * Painter绘制canvas失败后的回调
 */
const onImgErr = (e) => {
	Taro.showToast({
		title: "生成图片失败",
		duration: 2000,
	});
};
```

## Taro 保存图片

```js
const saveCard = async () => {
	// 将Canvas图片内容导出指定大小的图片
	const res = await Taro.canvasToTempFilePath({
		x: 0,
		y: 0,
		width: 750,
		height: 1980,
		destWidth: 750,
		destHeight: 1980,
		canvasId: "cardCanvas",
		fileType: "png",
	});

	const saveRes = await Taro.saveImageToPhotosAlbum({
		filePath: res.tempFilePath,
	});

	if (saveRes.errMsg === "saveImageToPhotosAlbum:ok") {
		Taro.showModal({
			title: "图片保存成功",
			content: "图片成功保存到相册了，快去发朋友圈吧~",
			showCancel: false,
			confirmText: "确认",
		});
	} else {
		Taro.showModal({
			title: "图片保存失败",
			content: "请重新尝试!",
			showCancel: false,
			confirmText: "确认",
		});
	}
};
```

## SCSS/SASS/Less/Stylus/CSS 互相转换

[网站](https://codebeautify.org/stylus-to-scss-converter)

-   eg.

```stylus
bg-image($url)
  background-image: url($url + '@2x.png')
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
    background-image: url($url + '@3x.png')
```

```scss
@mixin bg-image($url) {
	background-image: url($url + "@2x.png");
	@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
		background-image: url($url + "@3x.png");
	}
}
```

## 字体转换工具

-   字体库转 base64

[Here](https://transfonter.org/)

## iPhone X+ 机型适配

-   [文章](https://segmentfault.com/a/1190000022191869/)

-   最简单的方案即使用 Apple 官方推出的 css 函数 env()、constant()来适配，对于底部空白的部分可以自行加个 view。

```css
/*兼容 IOS<11.2*/
padding-bottom: calc(108px + constant(safe-area-inset-bottom));
/*兼容 IOS>11.2*/
padding-bottom: calc(108px + env(safe-area-inset-bottom));
```

-   配合 js 判断机型

```js
import Taro from "@tarojs/taro";

// iphone X
const IPHONE_X = /iphone x/i;
// >= iPhone11
const IPHONE_X_11 = /iphone 1\d/i;
// 未适配机型-新机型
const IPHONE_UNKNOWN = /unknown\(iphone\)/i;

// 方法一：使用model判断是否是IPhoneX及其他包含安全区域的机型手机
export const isIpx = () => {
	const model = Taro.getSystemInfoSync().model;
	return (
		model.search(IPHONE_X) > -1 ||
		model.search(IPHONE_X_11) > -1 ||
		model.search(IPHONE_UNKNOWN) > -1
	);
};
```

## 按需注入

-   降低小程序的启动时间和运行时内存

```json
{
	"lazyCodeLoading": "requiredComponents"
}
```

## 全局注册组件

```js
{
  usingComponents:{
    'keyboard':'components/../index',
  }
}
```

## 分享对话、朋友圈

```js
useShareAppMessage(() => {
	return {
		title: "啦啦啦啦",
		imageUrl:
			"https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eraEeftaBoduGGBHx3noVp5XQ8aYKwWAN74LqWR26mMhD8rTdXbGDxf3LpdYhO0BVtMZhHsg2VIBA/132",
		path: `/pages/index`,
	};
});

useShareTimeline(() => {
	return {
		title: "啦啦啦啦",
		imageUrl:
			"https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eraEeftaBoduGGBHx3noVp5XQ8aYKwWAN74LqWR26mMhD8rTdXbGDxf3LpdYhO0BVtMZhHsg2VIBA/132",
	};
});
```

## Taro3.x 版本中接入 Painter，实现图片导出功能

目前我在 Taro3.x+React+TypeScript 项目中通过如下方式可以使用，应该有更好的方法，该方法只是应急：

0. 通过 submodule 把核心模块引入到项目中

```git
git submodule add https://github.com/Kujiale-Mobile/PainterCore.git components/drawer
```

1. 在 app.config.ts 中全局注册 Painter

```ts
  usingComponents: {
    'my-painter': 'components/drawer/painter',
  }
```

2. 之后在.tsx 文件中直接可以使用

```ts
<my-painter
	palette={palette}
	onImgOK={onImgOK}
	onImgErr={onImgErr}
	customStyle={painterStyle}
	use2D
/>
```

3. 观察编译后的小程序原生代码长这样：

```html
<my-painter
	is="components/drawer/painter"
	bind:img-err="eh"
	bind:img-ok="eh"
	id="_n_256"
>
	...
</my-painter>
```

而 components/drawer/painter 里 getImageInfo(filePath)函数触发的是 imgOK，如下：

```js
that.triggerEvent("imgOK", {
	path: filePath,
});
```

尝试把 "imgOK" 替换为 "img-ok"，可以正常触发回调 "onImgOK"，所以在回调 "onImgOK"里通过 e.detail.path 获取到生成的 canvas 图片地址 filePath，然后按照正常步骤保存图片即可。

```ts
// .tsx中的回调
const onImgOK = (e) => {
	console.log("onImgOK", e);
	setFilePath(e.detail.path);
};
```

4. 对于 customStyle，一般不需要显示这个 canvas，所以设置为：`const painterStyle = 'position:fixed; left:-9999rpx;'`;

5. 剩下的就是把 palette 写出来。

## 如何配置项目，避免开发环境 appid 和生产环境 appid 管理使用混乱

Taro 官方貌似没有配置的教程，所以要么是手动改，要么也可以参考如下方案：

1. 我们知道 Taro 对环境的配置文件放在 `config/`目录下，因此我们在 `config` 下（其他地方也可以）新建一个 `updateConfig.js` 文件

2. 利用 `nodejs` 的 `fs` 模块对文件进行读写。`updateConfig.js` 代码如下：

```js
/**
 * 根据环境更新../project.config.json中的appid字段
 * @env NODE_ENV=development 将config/dev.js中的appid配置设置到../project.config.json中
 * @env NODE_ENV=production 将config/prod.js中的appid配置设置到../project.config.json中
 */

const fs = require("fs");
const path = require("path");
const DEV_CONFIG = require("./dev");
const PROD_CONFIG = require("./prod");

const { readFileSync, writeFileSync } = fs;

function updateProjectConfig(filePath) {
	const fileOption = { encoding: "utf-8" };
	const fileContent = readFileSync(filePath, fileOption);
	const config = JSON.parse(fileContent.toString());
	if (process.env.NODE_ENV === "production") {
		config.appid = PROD_CONFIG.appid;
		console.log(`[PROD] appId = ${config.appid}`);
	} else {
		config.appid = DEV_CONFIG.appid;
		console.log(`[DEV] appId = ${config.appid}`);
	}
	const newConfig = JSON.stringify(config, null, 2);
	writeFileSync(filePath, newConfig, fileOption);
}

updateProjectConfig(path.join(__dirname, "../project.config.json"));
```

3. 把开发和生产的 `appid` 分别配置到 `config/dev.js` 和 `config/prod.js` 中;

4. 然后再 `package.json` 中配置一下启动命令即可。例：

```json
"scripts": {
    "start": "npm run dev:weapp",
    "build": "npm run build:weapp",
    "build:weapp": "taro build --type weapp",
    "dev:weapp": "npm run precond-weapp:dev && npm run build -- --watch",
    "precond-weapp:dev": "cross-env NODE_ENV=development node ./config/updateProjectConfig.js",
    "precond-weapp:prod": "cross-env NODE_ENV=production node ./config/updateProjectConfig.js",
    "build:dev": "npm run precond-weapp:dev && npm run build",
    "build:prod": "npm run precond-weapp:prod && npm run build"
},
```

-   这样运行 npm start 即可在开发模式下进行开发，如果要在真机预览，则新建一个有 `NODE_ENV=production` 的命令，打包的时候压缩一下体积即可。
-   对于生产的包，运行 `npm run build:prod` 即可得到。
-   `--watch` 开启热更新。

## 页面跳转之前进行「简单提示」的做法

```tsx
useEffect(() => {
	Taro.eventCenter.once(getCurrentInstance()?.router?.onHide, () => {
		console.log("onHide");
	});
	Taro.eventCenter.on("beforegoback", () => {
		console.log("beforegoback");
	});
	Taro.disableAlertBeforeUnload();
	Taro.enableAlertBeforeUnload({
		message: "询问对话框内容询问对话框内容询问对话框内容询问对话框内容",
		success(res) {
			console.log(res);
			Taro.navigateBack({ delta: 1 });
		},
		fail(e) {
			console.log(e);
		},
	});
}, []);
```

## Hooks in Taro

-   常用的除了 React 中的 hooks，还有 taro 封装的：useRouter，useReady，useDidShow，useDidHide，useShareAppMessage 等等

-   [文档链接](https://taro-docs.jd.com/taro/docs/hooks#usedidshow)
