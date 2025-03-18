---
title: Uni-App小程序开发笔记
author: EricYangXD
date: "2024-07-29"
meta:
  - name: keywords
    content: Uni-App
---

# 微信小程序开发环境

## 微信小程序工具下载

[下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)

## 小程序代码构成

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291033518.png)

`.json 后缀的 JSON 配置文件`
`.wxml 后缀的 WXML 模板文件`
`.wxss 后缀的 WXSS 样式文件`
`.js 后缀的 JS 脚本逻辑文件`

## JSON 配置

主要的 json 配置为 `app.json`, `project.config.json` 和每个页面下的 json 文件

### 小程序配置 app.json

`app.json`  是当前小程序的全局配置，包括了小程序的所有页面路径、界面表现、网络超时时间、底部 tab 等。

```json
{
  "pages": ["pages/index/index", "pages/logs/logs"],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "Weixin",
    "navigationBarTextStyle": "black"
  }
}
```

1. pages 字段 —— 用于描述当前小程序所有页面路径，这是为了让微信客户端知道当前你的小程序页面定义在哪个目录。
2. window 字段 —— 定义小程序所有页面的顶部背景颜色，文字颜色定义等。

其他配置可参考小程序文档

### 工具配置 project.config.json

通常大家在使用一个工具的时候，都会针对各自喜好做一些个性化配置，例如界面颜色、编译配置等等，当你换了另外一台电脑重新安装工具的时候，你还要重新配置。

考虑到这点，小程序开发者工具在每个项目的根目录都会生成一个`project.config.json`，你在工具上做的任何配置都会写入到这个文件，当你重新安装工具或者换电脑工作时，你只要载入同一个项目的代码包，开发者工具就自动会帮你恢复到当时你开发项目时的个性化配置，其中会包括编辑器的颜色、代码上传时自动压缩等等一系列选项。

### 页面配置 page.json

这里的  `page.json`  其实用来表示 `pages/logs` 目录下的  `logs.json`  这类和小程序页面相关的配置。开发者可以独立定义每个页面的一些属性。

## WXML 模板

类似于 html，用来描述页面结构的文件，和  HTML  非常相似，WXML  由标签、属性等等构成。但是也有很多不一样的地方。例如标签的名称，能使用 `wx:if`, `wx:for` 等属性和`{{}}`的表达式，具体参考`https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/`。如`<text>{{msg}}</text>`

Js 文件通过这种方式渲染变量

`this.setData({ msg: "Hello World" })`

### WXSS 样式

WXSS  具有  CSS  大部分的特性，小程序在  WXSS  也做了一些扩充和修改。

1. 新增了尺寸单位。在写  CSS  样式时，开发者需要考虑到手机设备的屏幕会有不同的宽度和设备像素比，采用一些技巧来换算一些像素单位。WXSS  在底层支持新的尺寸单位  rpx ，开发者可以免去换算的烦恼，只要交给小程序底层来换算即可，由于换算采用的浮点数运算，所以运算结果会和预期结果有一点点偏差。
2. 提供了全局的样式和局部样式。和前边  app.json, page.json  的概念相同，你可以写一个  app.wxss  作为全局样式，会作用于当前小程序的所有页面，局部页面样式  page.wxss  仅对当前页面生效。
3. 此外  WXSS  仅支持部分  CSS  选择器

更详细的文档可以参考  [WXSS](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) 。

JS 逻辑交互

负责用户交互，响应用户的点击、获取用户的位置等等。此外你还可以在 JS 中调用小程序提供的丰富的 API，利用这些 API 可以很方便的调起微信提供的能力，例如获取用户信息、本地存储、微信支付等。

## 宿主环境

### 渲染层和逻辑层

小程序的运行环境分成渲染层和逻辑层，其中 WXML 模板和 WXSS 样式工作在渲染层，JS 脚本工作在逻辑层。

小程序的渲染层和逻辑层分别由 2 个线程管理：渲染层的界面使用了 WebView 进行渲染；逻辑层采用 JsCore 线程运行 JS 脚本。一个小程序存在多个界面，所以渲染层存在多个 WebView 线程，这两个线程的通信会经由微信客户端（图中 Native 代指微信客户端）做中转，逻辑层发送网络请求也经由 Native 转发，小程序的通信模型下图所示。

![通信模型](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291048158.png)

### 程序与页面

微信客户端在打开小程序之前，会把整个小程序的代码包下载到本地。

紧接着通过  app.json  的  pages  字段就可以知道你当前小程序的所有页面路径:

```json
{
  "pages": ["pages/index/index", "pages/logs/logs"]
}
```

写在  pages  字段的第一个页面就是这个小程序的首页（打开小程序看到的第一个页面）。

于是微信客户端就把首页的代码装载进来，通过小程序底层的一些机制，就可以渲染出这个首页。

小程序启动之后，在  app.js  定义的  App  实例的  onLaunch  回调会被执行:

```json
App({
  onLaunch: function () {
  // 小程序启动之后 触发
  }
})
```

整个小程序只有一个 App 实例，是全部页面共享的。

页面的实现是这样的，以 pages/logs/logs 为例，微信客户端会先根据  logs.json  配置生成一个界面，顶部的颜色和文字你都可以在这个  json  文件里边定义好。紧接着客户端就会装载这个页面的  WXML  结构和  WXSS  样式。最后客户端会装载  logs.js，你可以看到  logs.js  的大体内容就是:

```json
Page({
  data: { // 参与页面渲染的数据
  logs: []
  },
  onLoad: function () {
  // 页面渲染后 执行
  }
})
```

Page  是一个页面构造器，这个构造器就生成了一个页面。在生成页面的时候，小程序框架会把  data  数据和  index.wxml  一起渲染出最终的结构，于是就得到了你看到的小程序的样子。

在渲染完界面之后，页面实例就会收到一个  onLoad  的回调，你可以在这个回调处理你的逻辑。

### 组件

和 HTML 的 div，p 标签一样，在小程序里边，你只需要在  WXML  写上对应的组件标签名字就可以把该组件显示在界面上，组件的内部行为也会通过事件的形式让开发者可以感知，当然你也可以通过  style  或者  class  来控制组件的外层样式，以便适应你的界面宽度高度等等。

### API

为了让开发者可以很方便的调起微信提供的能力，例如获取用户信息、微信支付等等，小程序提供了很多 API 给开发者去使用。

需要注意的是：多数 API 的回调都是异步，你需要处理好代码逻辑的异步问题。

## 架构

### 逻辑层

小程序开发框架的逻辑层使用  JavaScript  引擎为小程序提供开发  JavaScript  代码的运行环境以及微信小程序的特有功能。开发者写的所有代码最终将会打包成一份  JavaScript  文件，并在小程序启动的时候运行，直到小程序销毁。这一行为类似  ServiceWorker，所以逻辑层也称之为 App Service。小程序框架的逻辑层并非运行在浏览器中，因此  JavaScript  在 web 中一些能力都无法使用，如  window，document  等。

#### 小程序注册

```js
// app.js
App({
  onLaunch(options) {
    // Do something initial when launch.
  },
  onShow(options) {
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg);
  },
  globalData: "I am global data",
});
```

整个小程序只有一个 App 实例，是全部页面共享的。开发者可以通过  getApp  方法获取到全局唯一的 App 实例，获取 App 上的数据或调用开发者注册在  App  上的函数。

```js
// xxx.js
const appInstance = getApp();
console.log(appInstance.globalData); // I am global data
```

#### 页面注册

```js
//index.js
Page({
  data: {
    text: "This is page data.",
  },
  onLoad: function (options) {
    // 页面创建时执行
  },
  onShow: function () {
    // 页面出现在前台时执行
  },
  onReady: function () {
    // 页面首次渲染完毕时执行
  },
  onHide: function () {
    // 页面从前台变为后台时执行
  },
  onUnload: function () {
    // 页面销毁时执行
  },
  onPullDownRefresh: function () {
    // 触发下拉刷新时执行
  },
  onReachBottom: function () {
    // 页面触底时执行
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  onPageScroll: function () {
    // 页面滚动时执行
  },
  onResize: function () {
    // 页面尺寸变化时执行
  },
  onTabItemTap(item) {
    // tab 点击时执行
    console.log(item.index);
    console.log(item.pagePath);
    console.log(item.text);
  },
  // 事件响应函数
  viewTap: function () {
    this.setData(
      {
        text: "Set some data for updating view.",
      },
      function () {
        // this is setData callback
      }
    );
  },
  // 自由数据
  customData: {
    hi: "MINA",
  },
});
```

#### 生命周期

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291050428.png)

#### 模块化

类似 java 中的工具类，将一些公共代码抽成单独的 js 文件

```js
// common.js
function sayHello(name) {
  console.log(`Hello ${name} !`);
}
function sayGoodbye(name) {
  console.log(`Goodbye ${name} !`);
}

module.exports.sayHello = sayHello;
exports.sayGoodbye = sayGoodbye;

// 使用
var common = require("common.js");
Page({
  helloMINA: function () {
    common.sayHello("MINA");
  },
  goodbyeMINA: function () {
    common.sayGoodbye("MINA");
  },
});
```

小程序不支持引入 node_module，不过小程序支持 npm，跟一般前端开发使用的 npm 方式有略微不同。

### 视图层

框架的视图层由 WXML 与 WXSS 编写，由组件来进行展示。

将逻辑层的数据反映成视图，同时将视图层的事件发送给逻辑层。

#### WXML

[wxml](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/)

#### WXSS

https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html

wxss 相比 css 主要是在尺寸单位和样式导入上。

#### 事件

事件是视图层到逻辑层的通讯方式。

##### 绑定方式:

组件中的属性 `bind***`，参数携带 `data-xxx`

<view id="tapTest" data-hi="Weixin" bindtap="tapName"> Click me! </view>

```json
Page({
  tapName: function(event) {
    console.log(event)
  }
})
```

##### 事件类型

https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html

## 小程序分包

某些情况下，开发者需要将小程序划分成不同的子包，在构建时打包成不同的分包，用户在使用时按需进行加载。

在构建小程序分包项目时，构建会输出一个或多个分包。**每个使用分包小程序必定含有一个主包**。所谓的主包，即放置默认启动页面/TabBar 页面，以及一些所有分包都需用到的公共资源/JS 脚本；而分包则是根据开发者的配置进行划分。

在小程序启动时，默认会下载主包并启动主包内页面，当用户进入分包内某个页面时，客户端会把对应分包下载下来，下载完成后再进行展示。

目前小程序分包大小有以下限制：

- 整个小程序**所有分包大小不超过 30M（服务商代开发的小程序不超过 20M）**
- **单个分包/主包大小不能超过 2M**
- 对小程序进行分包，可以优化小程序首次启动的下载时间，以及在多团队共同开发时可以更好的解耦协作。

### 分包规则

开发者通过在 `app.json` - `subPackages` 字段声明项目分包结构：

```js
{
  "pages":[
    "pages/index",
    "pages/logs"
  ],
  "subPackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat",
        "pages/dog"
      ],
      "entry": "index.js"
    }, {
      "root": "packageB",
      "name": "pack2",
      "pages": [
        "pages/apple",
        "pages/banana"
      ]
    }
  ]
}
```

- root：分包根目录
- name：分包别名，分包预下载时可以使用
- pages：分包页面路径，相对于分包根目录
- independent：分包是否是独立分包
- entry：分包入口文件

#### 打包原则

- 声明 subPackages 后，将按 subPackages 配置路径进行打包，subPackages 配置路径外的目录将被打包到主包中
- 主包也可以有自己的 pages，即最外层的 pages 字段。
- subPackages 的根目录不能是另外一个 subPackages 内的子目录
- tabBar 页面必须在主包内

#### 引用原则

- packageA 无法 require packageB JS 文件，但可以 require 主包、packageA 内的 JS 文件；使用 分包异步化 时不受此条限制
- packageA 无法 import packageB 的 template，但可以 require 主包、packageA 内的 template
- packageA 无法使用 packageB 的资源，但可以使用主包、packageA 内的资源

#### 分包入口文件

每个分包的配置中，entry 字段可以指定该分包中的任意一个 JS 文件作为入口文件，该文件会在分包注入时首先被执行。

指定的 JS 文件应该填写相对于分包根目录的路径，例如需要指定 `/path/to/subPackage/src/index.js` 作为分包 `/path/to/subPackage` 的入口文件时，应填写 `src/index.js`。

### 独立分包

独立分包是小程序中一种特殊类型的分包，可以独立于主包和其他分包运行。从独立分包中页面进入小程序时，不需要下载主包。当用户进入普通分包或主包内页面时，主包才会被下载。

开发者可以按需将某些具有一定功能独立性的页面配置到独立分包中。当小程序从普通的分包页面启动时，需要首先下载主包；而独立分包不依赖主包即可运行，可以很大程度上提升分包页面的启动速度。

一个小程序中可以有多个独立分包。

开发者通过在`app.json`的`subpackages`字段中对应的分包配置项中定义`independent`字段声明对应分包为独立分包。

#### 限制

独立分包属于分包的一种。普通分包的所有限制都对独立分包有效。独立分包中插件、自定义组件的处理方式同普通分包。

此外，使用独立分包时要注意：

- 独立分包中不能依赖主包和其他分包中的内容，包括 js 文件、template、wxss、自定义组件、插件等（使用 分包异步化 时 js 文件、自定义组件、插件不受此条限制）
- 主包中的 app.wxss 对独立分包无效，应避免在独立分包页面中使用 app.wxss 中的样式；
- App 只能在主包内定义，独立分包中不能定义 App，会造成无法预期的行为；
- 独立分包中暂时不支持使用插件。

##### 注意事项

1. 关于 getApp()

与普通分包不同，独立分包运行时，App 并不一定被注册，因此 getApp() 也不一定可以获得 App 对象：

- 当用户从独立分包页面启动小程序时，主包不存在，App 也不存在，此时调用 getApp() 获取到的是 undefined。 当用户进入普通分包或主包内页面时，主包才会被下载，App 才会被注册。
- 当用户是从普通分包或主包内页面跳转到独立分包页面时，主包已经存在，此时调用 getApp() 可以获取到真正的 App。
  由于这一限制，开发者无法通过 App 对象实现独立分包和小程序其他部分的全局变量共享。

为了在独立分包中满足这一需求，基础库 2.2.4 版本开始 getApp 支持 `[allowDefault]` 参数，在 App 未定义时返回一个默认实现。当主包加载，App 被注册时，默认实现中定义的属性会被覆盖合并到真正的 App 中。

2. 关于 App 生命周期

当从独立分包启动小程序时，主包中 App 的 onLaunch 和首次 onShow 会在从独立分包页面首次进入主包或其他普通分包页面时调用。

由于独立分包中无法定义 App，小程序生命周期的监听可以使用 wx.onAppShow，wx.onAppHide 完成。App 上的其他事件可以使用 wx.onError，wx.onPageNotFound 监听。

### 分包预下载

开发者可以通过配置，在进入小程序某个页面时，由框架自动预下载可能需要的分包，提升进入后续分包页面时的启动速度。对于独立分包，也可以预下载主包。

分包预下载目前只支持通过配置方式使用，暂不支持通过调用 API 完成。

#### 配置方法

预下载分包行为在进入某个页面时触发，通过在 `app.json` 增加 `preloadRule` 配置来控制。

```js
{
  "pages": ["pages/index"],
  "subpackages": [
    {
      "root": "important",
      "pages": ["index"],
    },
    {
      "root": "sub1",
      "pages": ["index"],
    },
    {
      "name": "hello",
      "root": "path/to",
      "pages": ["index"]
    },
    {
      "root": "sub3",
      "pages": ["index"]
    },
    {
      "root": "indep",
      "pages": ["index"],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/index": {
      "network": "all",
      "packages": ["important"]
    },
    "sub1/index": {
      "packages": ["hello", "sub3"]
    },
    "sub3/index": {
      "packages": ["path/to"]
    },
    "indep/index": {
      "packages": ["__APP__"]
    }
  }
}
```

preloadRule 中，key 是页面路径，value 是进入此页面的预下载配置，每个配置有以下几项：

- packages：必填，进入页面后预下载分包的 root 或 name。`__APP__` 表示主包。
- network：可选，在指定网络下预下载，可选值为：all: 不限网络，wifi: 仅 wifi 下预下载（默认）

#### 限制

同一个分包中的页面享有共同的预下载大小限额 2M，限额会在工具中打包时校验。

如，页面 A 和 B 都在同一个分包中，A 中预下载总大小 0.5M 的分包，B 中最多只能预下载总大小 1.5M 的分包。

### 分包异步化

在小程序中，不同的分包对应不同的下载单元；因此，除了非独立分包可以依赖主包外，分包之间不能互相使用自定义组件或进行 require。「分包异步化」特性将允许通过一些配置和新的接口，使部分跨分包的内容可以等待下载后异步使用，从而一定程度上解决这个限制。该特性需要基础库版本 2.11.2 或以上，可以考虑将最低基础库版本设置为 2.11.2 或以上。

#### 跨分包自定义组件引用

一个分包使用其他分包的自定义组件时，由于其他分包还未下载或注入，其他分包的组件处于不可用的状态。通过为其他分包的自定义组件设置 占位组件，我们可以先渲染占位组件作为替代，在分包下载完成后再进行替换。例如：

```js
// subPackageA/pages/index.json
{
  "usingComponents": {
    "button": "../../commonPackage/components/button",
    "list": "../../subPackageB/components/full-list",
    "simple-list": "../components/simple-list",
    "plugin-comp": "plugin://pluginInSubPackageB/comp"
  },
  "componentPlaceholder": {
    "button": "view",
    "list": "simple-list",
    "plugin-comp": "view"
  }
}
```

在这个配置中，button 和 list 两个自定义组件是跨分包引用组件，其中 button 在渲染时会使用内置组件 view 作为替代，list 会使用当前分包内的自定义组件 simple-list 作为替代进行渲染；在这两个分包下载完成后，占位组件就会被替换为对应的跨分包组件。在基础库 2.24.3 之后，可以使用 `wx.onLazyLoadError` 监听加载事件。

#### 跨分包 JS 代码引用

一个分包中的代码引用其它分包的代码时，为了不让下载阻塞代码运行，我们需要异步获取引用的结果。如：

```js
// subPackageA/index.js
// 使用回调函数风格的调用
require("../subPackageB/utils.js", (utils) => {
  console.log(utils.whoami); // Wechat MiniProgram
}, ({ mod, errMsg }) => {
  console.error(`path: ${mod}, ${errMsg}`);
});
// 或者使用 Promise 风格的调用
require
  .async("../commonPackage/index.js")
  .then((pkg) => {
    pkg.getPackageName(); // 'common'
  })
  .catch(({ mod, errMsg }) => {
    console.error(`path: ${mod}, ${errMsg}`);
  });

// 在其它分包中的插件也可以通过类似的方法调用：
// 使用回调函数风格的调用
requirePlugin(
  "live-player-plugin",
  (livePlayer) => {
    console.log(livePlayer.getPluginVersion());
  },
  ({ mod, errMsg }) => {
    console.error(`path: ${mod}, ${errMsg}`);
  }
);
// 或者使用 Promise 风格的调用
requirePlugin
  .async("live-player-plugin")
  .then((livePlayer) => {
    console.log(livePlayer.getPluginVersion());
  })
  .catch(({ mod, errMsg }) => {
    console.error(`path: ${mod}, ${errMsg}`);
  });
```

## uni-app 介绍

uni-app  是一个使用  Vue.js  开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

所以说，可以通过 uni-app，使用 vue.js 来开发小程序。使用 HBuilder 进行 uni-app 的开发，当编写好代码后，点击小程序运行，程序会自动打开微信开发者工具并进行编译，之后就可以在微信开发者工具中进行调试。

除了能一套代码多端运行之外，uni-app 还提供和微信小程序云开发一样的 uniCloud 的服务。微信小程序在 2022 年已经停止了开发版的云开发，现在要使用微信小程序的云开发至少得需要 19.9 的费用。同微信小程序的云开发相比，uniCloud 除了腾讯云之外还能使用阿里云的开发版云服务空间，这个服务空间是免费的，能很好的满足开发需求。

## uni-app 使用

下载开发 uni-app 配套的工具 HbuilderX: https://www.dcloud.io/hbuilderx.html

打开 HbuiderX，新建项目，选择 uni-app 类型，输入工程名，选择模版，点击创建。

### 项目结构

一个 uni-app 工程，默认包含如下目录及文件：

┌─uniCloud 云空间目录，支付宝小程序云为 uniCloud-alipay，阿里云为 uniCloud-aliyun，腾讯云为 uniCloud-tcb（详见 uniCloud）
│─components 符合 vue 组件规范的 uni-app 组件目录
│ └─comp-a.vue 可复用的 a 组件
├─utssdk 存放 uts 文件
├─pages 业务页面文件存放的目录
│ ├─index
│ │ └─index.vue index 页面
│ └─list
│ └─list.vue list 页面
├─static 存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源都应存放于此目录
├─uni_modules 存放 uni_module 详见
├─platforms 存放各平台专用页面的目录，详见
├─nativeplugins App 原生语言插件 详见
├─nativeResources App 端原生资源目录
│ ├─android Android 原生资源目录 详见
| └─ios iOS 原生资源目录 详见
├─hybrid App 端存放本地 html 文件的目录，详见
├─wxcomponents 存放小程序组件的目录，详见
├─unpackage 非工程代码，一般存放运行或发行的编译结果
├─main.js Vue 初始化入口文件
├─App.vue 应用配置，用来配置 App 全局样式以及监听 应用生命周期
├─pages.json 配置页面路由、导航条、选项卡等页面类信息，详见
├─manifest.json 配置应用名称、appid、logo、版本等打包信息，详见
├─AndroidManifest.xml Android 原生应用清单文件 详见
├─Info.plist iOS 原生应用配置文件 详见
└─uni.scss 内置的常用样式变量

重点是 pages 文件夹里，每一个.vue 文件就是一个页面，换言之现在是用 vue 语法写小程序页面。

### uni-app 和小程序开发上的不同

uni-app 中一个页面由一个.vue 文件构成，微信小程序中一个页面由 wxml，xwss 和 js 文件构成，.vue 文件中有三个一级节点，template，script，style，分别对应了 wxml，wxss，js。语法选用 vue 语法，控件使用小程序控件和 uni-app 自己的控件 ui，API 也是使用 uni-app 自己的 api，同时也兼容小程序的 api，其他方面并无本质上的区别。

### 在 uni-app 上运行微信小程序

进入项目，点击工具栏的运行 -> 运行到小程序模拟器 -> 微信开发者工具，即可在微信开发者工具里面体验 uni-app，也可如图所示运行：
![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291053711.png)

这样系统会自动打开微信小程序并且运行 uni-app 代码。(注意，通过 uni-app 运行小程序需要开放微信开发者工具的端口访问)

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291054842.png)

### uni-app 云服务

#### 创建服务空间

打开这个网址https://unicloud.dcloud.net.cn/, 创建服务空间（需要 DCloud 账号，并且要实名认证）。服务空间类型选择阿里云（也可以选择支付宝云，DCloud 提供阿里云和支付宝云的免费版），选择免费版点击创建，等待几分钟等待服务空间初始化即可。

#### 创建项目

打开 HBuilderX，点击创建项目，选择创建 uni-app 项目，里面有个选项为启用 uniCloud，点击启用并选择阿里云。

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291055057.png)

创建好项目后需要关联服务空间，右键 uniCloud 文件夹，选择云服务空间或项目，选择新创建的服务空间即可。

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291055884.png)

#### 云服务的简单使用(详细可看这个文档https://doc.dcloud.net.cn/uniCloud/)

云对象能够直接导入到前端进行使用，可以在云对象中编写函数，云对象在 cloudfunctions 目录下创建，目录结构如图:

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291055751.png)

图中的云对象名称为 co1，逻辑写在 index.obj.js 中，代码如下:

```js
module.exports = {
  _before: function () {
    // 通用预处理器
  },
  say(text) {
    console.log("console: " + text);
    return {
      status_code: 0,
      data: "hello uniCloud",
    };
  },
};
```

通过 uniCloud.importObject("对象名")调用，云对象里的方法都为异步方法，代码如下:

```js
async callco1(){
  const co1 = uniCloud.importObject("co1")
  let res = await co1.say("这是客户端传递到云服务器的参数")
  console.log(res)
}
```

同样前端也可以直接调用云数据库中的数据，代码如下:

```js
callDB(){
  const db = uniCloud.database();
  db.collection("test1").get().then(res => {
    console.log(res)
    this.data = res.result.data
  }).catch(err => {
    console.log(err)
  })
}
```

### 命令行创建 uni-app 项目并用 VSCode 开发

`npx degit dcloudio/uni-preset-vue#vite-ts 项目名称`

通过上述命令能够创建一个 vue3+ts 版的 uni-app 项目，然后通过 vscode 打开项目，进入命令行终端，输入  pnpm i 下载依赖。依赖下载完成后，接下来就要在微信小程序中跑起来，我们使用 pnpm dev:mp-weixin 就能进行代码编译，编译完成后会多出来一个 dist 目录，里面就是微信小程序的代码，通过微信小程序开发者工具打开 dist 目录里面的 mp-weixin 文件，即可运行代码。同时如果你在 vscode 中修改了代码，开发者工具中也会同步进行实时的更新。

## 基于 Vue3+TS+uni-app 的小程序开发

### 创建 uni-app(vue3+ts 模版)项目

vue3+ts 版: `npx degit dcloudio/uni-preset-vue#vite-ts`

通过上述命令可以下载到 vue3+ts+uni-app 的模版文件，使用 vscode 打开项目，输入命令 pnpm install 下载依赖。依赖下载完成后，接下来就要在微信小程序中跑起来，我们使用 pnpm dev:mp-weixin 就能进行代码编译，编译完成后会多出来一个 dist 目录，里面就是微信小程序的代码，通过微信小程序开发者工具打开 dist 目录里面的 mp-weixin 文件，即可运行代码。同时如果你在 vscode 中修改了代码，开发者工具中也会同步进行实时的更新。

## vscode 工具的配置

### 安装 uni-app 插件

#### 快速创建页面

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291059542.png)
下载上图插件，即可快速创建页面，创建方式如下，
![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291059197.png)
在文件夹上右键多出了一个新建 uniapp 页面的选项，输入名称就会自动创建一个页面需要的文件，
![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291059963.png)
同时 pages.json 中也会注册相应的信息。
![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291100826.png)

#### uni-helper

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291100953.png)
uni 相关的代码提示

#### uniapp 小程序扩展

![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291100443.png)
鼠标悬停能够直接查看相应控件的文档

### TS 类型校验

#### 安装类型声明文件

`pnpm i -D miniprogram-api-typings @uni-helper/uni-app-types`

配置 tsconfig.json，在 types 中添加这两个包，并添加 vue 编译器的配置。

```json
"compilerOptions": {
  ......
  "types": [
    "@dcloudio/types",
    "miniprogram-api-typings", //添加的包
    "@uni-helper/uni-app-types", //添加的包
  ]
},
"vueCompilerOptions": {
  // experimentalRuntimeMode 已废弃，现调整为 nativeTags，请升级 Volar 插件至最新版本
  "nativeTags": ["block", "component", "template", "slot"]
},
```

项目中有一些 json 文件会有注释，配置 vscode 使相关 json 文件支持注释

在 vscode 中打开设置，如下图所示设置
![](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/202407291101082.png)

### 导入 uni-ui 组件库

#### 安装 uni-ui

`pnpm i @dcloudio/uni-ui`

在 pages.json 中配置 easycom

```json
// 组件自动引入规则
"easycom": {
  // 是否开启自动扫描
  "autoscan": true,
  "custom": {
    // uni-ui 规则如下配置
    "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
  }
},
```

配置 uni-ui 的类型校验，安装依赖 `pnpm i -D @uni-helper/uni-ui-types`

在 tsconfig.json 中配置

```json
"types": [
  "@dcloudio/types",
  "miniprogram-api-typings",
  "@uni-helper/uni-app-types",
  "@uni-helper/uni-ui-types" //添加的包
]
```

## Pinia 持久化

创建 pinia 实例并导出给 main.ts 使用

```js
import { createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";

// 创建 pinia 实例
const pinia = createPinia();
// 使用持久化存储插件
pinia.use(persist);

// 默认导出，给 main.ts 使用
export default pinia;

// 模块统一导出
export * from "./modules/member";
```

在 mian.ts 中加上 app.use(pinia)

定义 store 的代码如下：

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
'member',
() => {
  // 会员信息
  const profile = ref<any>()

    // 保存会员信息，登录时使用
    const setProfile = (val: any) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
},
// TODO: 持久化
{
  persist: {
    storage: {
      getItem(key) {
        return uni.getStorageSync(key)
      },
      setItem(key, value) {
        uni.setStorageSync(key, value)
      },
    }
  }
},
)
```

## 请求工具封装

### 请求拦截器

```js
/**
 * 1.  非 http 开头需拼接地址
 * 2.  请求超时
 * 3.  添加小程序端请求头标识
 * 4.  添加 token 请求头标识
 */

import { useMemberStore } from "@/stores";

const baseURL = "https://pcapi-xiaotuxian-front-devtest.itheima.net";

const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头需拼接地址
    console.log(options.url);
    if (!options.url.startsWith("http")) {
      var new_url: string = options.url.startsWith("/") ? options.url : "/" + options.url;
      options.url = baseURL + new_url;
    }
    // 2. 请求超时
    options.timeout = 10000;
    // 3. 添加小程序端请求头标识
    options.header = {
      ...options.header,
      "source-client": "miniapp",
    };
    // 4. 添加 token 请求头标识
    const memberStore = useMemberStore();
    const token = memberStore.profile?.token;
    if (token) {
      options.header.Authorization = token;
    }
    console.log(options);
  },
};
uni.addInterceptor("request", httpInterceptor);
uni.addInterceptor("uploadFile", httpInterceptor);
```

### 请求函数封装

```js
/**
* 请求函数
* @param UniApp.RequestOptions
* @returns Promise
* 1. 返回 Promise 对象
* 2. 获取数据成功
* 2.1 提取核心数据 res.data
* 2.2 添加类型，支持泛型
* 3. 获取数据失败
* 3.1 401 错误 -> 清理用户信息，跳转到登录页
* 3.2 其他错误 -> 根据后端错误信息轻提示
* 3.3 网络错误 -> 提示用户换网络
*/

type Data<T> = {
  code: string
  msg: string
  result: T
}
// 2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        // 状态码 2xx， axios 就是这样设计的
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 401 错误 -> 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
```

## 隐藏默认导航栏

在 pages.json 文件的页面样式中添加"navigationStyle": "custom",即可隐藏导航栏。

## typescript 和相关用法

?.: 可选链操作符，允许读取位于连接对象链深处的属性的值，而不必明确验证链中的每个引用是否有效。

```ts
const obj = {
  name: "ceshi",
  detail: {
    cat: "huahua",
  },
};
const name = obj.dog?.name;
console.log(name); // undefined

const detail = obj.detail?.cat;
console.log(detail); //huahua
```

key!:非空断言, 它用来告诉编译器该变量的值不会为 null。

例如，假设有一个函数  foo  返回一个字符串类型，它不会返回 null：

```ts
tsfunction foo(): string {
  return 'hello';
}

const myString: string = foo()!;
```

在这个例子中，!  表示断言该值不会是 null，因此编译器不会检查  foo()  是否为 null，而会将其视为非空字符串。

## 全局组件导入

在 components 文件夹下写自定义组件可以在 pages.json 中的 easycom 中进行配置，

```json
"easycom": {
  // 是否开启自动扫描
  "autoscan": true,
  // 以正则方式自定义组件匹配规则
  "custom": {
  // uni-ui 规则如下配置
  "^uni-(._)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
  // 以 Xtx 开头的组件，在 components 文件夹中查找引入（需要重启服务器）
  "^Xtx(._)": "@/components/Xtx$1.vue"
  }
},
```

并在 types 文件夹下创建一个.d.ts 文件做组件类型定义。

```ts
import XtxSwiper from "@/components/XtxSwiper.vue";
import XtxGuess from "@/components/XtxGuess.vue";

declare module "vue" {
  export interface GlobalComponents {
    XtxSwiper: typeof XtxSwiper;
    XtxGuess: typeof XtxGuess;
  }
}

// 组件实例类型
export type XtxGuessInstance = InstanceType<typeof XtxGuess>;
export type XtxSwiperInstance = InstanceType<typeof XtxSwiper>;
```

### Uni-app+ts 中事件的类型

通过 UniHelper.xxxx 能得到 uni-app 中大多数事件的类型

```ts
// 当 swiper 下标发生变化时触发
const onChange: UniHelper.SwiperOnChange = (ev) => {
  activeIndex.value = ev.detail.current;
};
```
