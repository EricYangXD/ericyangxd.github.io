---
title: Angular学习使用记录
author: EricYangXD
date: "2022-07-12"
meta:
  - name: keywords
    content: Angular
---

## 笔记

## 学习

### 创建项目

1. 安装脚手架：`npm install @angular/cli -g`
2. 脚手架版本：`ng version`
3. 创建新项目：`ng new ng-test --minimal --inlineTemplate --inlineStyle false`

   - –-skipGit=true 自动初始化 Git 仓库
   - –-minimal=true 不创建 test 测试文件
   - –-skip-install 跳过自动安装依赖
   - –-style=css cssloader 类型
   - -–routing=false 路由
   - –-inlineTemplate 模板是否分开为单独文件
   - -–inlineStyle 样式文件是否单独分开
   - –-prefix 修改 module 名称

4. 启动项目：`ng serve --open --hmr`

   - –open=true 应用构建完成后在浏览器中运行
   - –hmr=true 开启热更新
   - -hmrWarning=false 禁用热更新警告
   - –port 更改应用运行端口

5. 创建共享模块：`ng g m module_name`，可以指定路径
6. 创建共享组件：`ng g c component_name`，可以指定路径
7. 创建服务：`ng g s service_name`，可以指定路径
8. 创建指令：`ng g d directive_name`，可以指定路径
9. 常用命令总结:

| 命令                             | 描述               |
| -------------------------------- | ------------------ |
| `ng generate <type> [options]`   | 在项目中构建新代码 |
| `ng g <type 的首字母> [options]` | 简写               |

| 支持的类型  | 用法                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------- |
| component   | ng g c <组件名称>                                                                                 |
| service     | ng g s <服务名称>                                                                                 |
| module      | ng g m <模块名称>                                                                                 |
| pipe        | ng g p <管道名称>                                                                                 |
| directive   | ng g d <指令名称>                                                                                 |
| interface   | ng g i <接口名称>                                                                                 |
| enum        | ng g e <枚举名称>                                                                                 |
| class       | ng g c <类型名称> （注：该命令功能与 component 相同）                                             |
| guard       | ng g g <路由守卫名称>                                                                             |
| interceptor | ng g interceptor <拦截器名称> （注：这里 interceptor 无法简写成 i，因为会被识别为接口             |
| library     | ng g library <库名称> （注：这里名称就是单独的库名称，名称前面无法指定路径，且 library 无法简写） |

- 构建的组件都会使用自用目录,除非使用 --flat 单独指定
- 构建的模块可使用 --routing 同时创建对应模块的路由

```bash
# 创建angular项目
ng new <项目名称>
# 创建带有路由，样式为less，不自动安装依赖的angular项目，后续需要手动npm install安装依赖
ng new <项目名称> --routing --style=less --skip-install
# 若创建项目时没有使用--routing，可以使用以下命令添加根路由
ng g m app-routing --flat --module=app
# 使用--createApplication=false 不会创建根应用，也就是不会有初始化的src目录，包括app.component等文件
ng new <项目名称> --createApplication=false

# 创建angular组件，组件名称前面可添加路径
ng generate component <组件名称>
# 简写
ng g c <组件名称>

ng g c components/home

# 创建angular服务，服务名称前面可添加路径
ng generate service <服务名称>
# 简写
ng g s <服务名称>

# 创建angular模块，模块名称前面可添加路径
ng generate module <模块名称>
# 简写
ng g m <模块名称>

# 这里使用--routing 可以创建对应模块的路由
ng g m modules/registry --routing
# 若没有使用--routing，可以使用以下命令添加对应模块的路由路由
ng g m modules/registry/registry-routing --flat --module=./registry
ng g c modules/registry
ng g c modules/registry/components/hello

ng g library tables
```

library 命令注意事项:

- 使用 library 命令，会创建一个 projects 文件目录，tables 库会出现在该目录中
- 在 angular.json 文件，projects 会对应增加 tables 库的配置项。
- newProjectRoot 默认值是 projects，也就是命令生成的 library 都会放在这个 projects 目录，我们可以修改这个值，下次使用命令生成 library 就会对应放在我们指定的目录中。
- projectType 用来区别 application 和 library 类型。
- 在 package.json 配置 scripts，使用 npm run build:tables 命令打包对应的库。

```ts
// main.ts
// enableProdMode 方法调用后将会开启生产模式
import { enableProdMode } from "@angular/core";
// Angular 应用程序的启动在不同的平台上是不一样的
// 在浏览器中启动时需要用到 platformBrowserDynamic 方法, 该方法返回平台实例对象
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
// 引入根模块 用于启动应用程序
import { AppModule } from "./app/app.module";
// 引入环境变量对象 { production: false }
import { environment } from "./environments/environment";

// 如果当前为生产环境
if (environment.production) {
  // 开启生产模式
  enableProdMode();
}
// 启动应用程序
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
```

```ts
// environment.ts
// 在执行 `ng build --prod` 时, environment.prod.ts 文件会替换 environment.ts 文件
// 该项配置可以在 angular.json 文件中找到, projects -> angular-test -> architect -> configurations -> production -> fileReplacements

export const environment = {
  production: false,
};
```

```ts
// environment.prod.ts
export const environment = {
  production: true,
};
```

```ts
// app.module.ts
// BrowserModule 提供了启动和运行浏览器应用所必需的服务
// CommonModule 提供各种服务和指令, 例如 ngIf 和 ngFor, 与平台无关
// BrowserModule 导入了 CommonModule, 又重新导出了 CommonModule, 使其所有指令都可用于导入 BrowserModule 的任何模块
import { BrowserModule } from "@angular/platform-browser";
// NgModule: Angular 模块装饰器
import { NgModule } from "@angular/core";
// 根组件
import { AppComponent } from "./app.component";
// 调用 NgModule 装饰器, 告诉 Angular 当前类表示的是 Angular 模块
@NgModule({
  // 声明当前模块拥有哪些组件
  declarations: [AppComponent],
  // 声明当前模块依赖了哪些其他模块
  imports: [BrowserModule],
  // 声明服务的作用域, 数组中接收服务类, 表示该服务只能在当前模块的组件中使用
  providers: [],
  // 可引导组件, Angular 会在引导过程中把它加载到 DOM 中
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```ts
// app.component.ts
import { Component, ViewEncapsulation } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	// 指定组件的使用方式, 当前为标记形式
	// app-home   =>  <app-home></app-home>
	// [app-home] =>  <div app-home></div>
	// .app-home  =>  <div class="app-home"></div>
	selector: "app-root",
	// 关联组件模板文件
	// templateUrl:'组件模板文件路径'
	// template:`组件模板字符串`
	templateUrl: "./app.component.html",
	// 关联组件样式文件
	// styleUrls : ['组件样式文件路径']
	// styles : [`组件样式`]
	styleUrls: ["./app.component.css"],
	// 设置封装的样式“能进能出”，其实就是ng不会再给class增加属性选择器，这样使用innerHTML注入的dom就可以使用styles中的样式了
	encapsulation: ViewEncapsulation.,// default: ViewEncapsulation.Emulate
})
export class AppComponent {
	html: SafeHtml;
	constructor(private domSanitizer: DomSanitizer) {
		// 处理style的时候用这个，处理class的时候用`encapsulation: ViewEncapsulation.None`
		this.html = this.domSanitizer.bypassSecurityTrustHtml(
			`<b style="color:red;">red</b>`
		);
	}
}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AngularTest</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

### 生命周期

1. 挂载阶段：`constructor -> ngOnInit() -> ngAfterContentInit() -> ngAfterViewInit()`
2. 更新阶段：`ngOnChanges() -> ngDoCheck() -> ngAfterContentChecked() -> ngAfterViewChecked()`，初始化时先执行一次 ngOnChanges，顺序早于 ngOnInit。不推荐 ngDoCheck，成本太高。
3. 卸载阶段：`ngOnDestroy()`

### 依赖注入 DI

### 组件通信

#### 父到子

1. 子组件中通过`@Input`声明要接收的属性名称和初始值，然后在调用子组件时通过`[propertyName]="xxx"`的形式通信，xxx 是动态变量时 propertyName 需要`[]`,否则 propertyName 不需要`[]`。

#### 子到父

1. 子组件中通过`@Output`声明一个`new EventEmitter()`实例`change`，这个`change`就是父组件上要监听的事件，然后声明一个回调函数，例如`onChange(){this.change.emit({ name: "张三" });}`，当在子组件触发这个 onChange 函数时，会向父组件 emit 一个`change`事件；
2. 父组件上对这个`change`事件进行监听，并定义一个回调函数来接收参数，例如：`(change)="onChange($event)"`，通过`$event`接收传递的参数。

### 路由传参

1. url `query传参`: `<a [queryParams]="{ name: 'superman', age: 15 }" >product</a>`
   - 通过`ActivatedRoute`实例 route 来接收参数：
   - 1. `this.route.snapshot.queryParams["name"]`
   - 2. `this.route.snapshot.queryParamMap.get("name")`
   - 3. `this.route.queryParams.subscribe(...)`
   - 4. `this.route.queryParamMap.subscribe(...)`
2. url `path传参`: `<a [routerLink]="['/product', product.title]" >product</a>`
   - 通过`ActivatedRoute`实例 route 来接收参数：
   - 1. `this.route.snapshot.params["title"]`
   - 2. `this.route.snapshot.paramMap.get("title")`
   - 3. `this.route.params.subscribe(...)`
   - 4. `this.route.paramMap.subscribe(...)`
3. js `navigate传参`:
   - 通过`Router`实例 router 来发送参数：
   - query: `this.router.navigate(['/product'], {queryParams: {name : 'Eric', age : 22}})`
   - param: `this.router.navigate(['/news', 'japan']);`
4. 在路由配置中通过 data 属性传参：
   - 通过`ActivatedRoute`实例 route 来接收参数：
   - `this.route.data.subscribe(...)`

```html
<a [routerLink]="['/product', product.title]" [queryParams]="{ name: 'superman', age: 15 }">product</a>
```

```ts
const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    data: {
      testkey: "testkeykkk",
    },
  },
  // ...
];
```

```ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-product",
  template: ` <p>product works!</p> `,
  styles: [],
})
export class ProductComponent implements OnInit {
  // 注入依赖
  constructor(private route: ActivatedRoute) {}
  // 生命周期钩子
  ngOnInit() {
    // 路由快照
    console.log(this.route.snapshot.params["title"]); //第一个商品
    console.log(this.route.snapshot.queryParams["name"]); //superman
    // 上面两个都只是只读普通对象
    //observable对象，非只读，有get/set/getAll 等方法
    console.log(this.route.snapshot.paramMap.get("title")); // 第一个商品
    console.log(this.route.snapshot.queryParamMap.get("name")); //superman
    // 非路由快照的路由信息，他们都是Observable对象
    // 与上面一一对应,也是只读的
    this.route.params.subscribe((params) => {
      console.log(params.title);
    });
    this.route.queryParams.subscribe((params) => {
      console.log(params.name, params.age);
    });
    // 非只读的
    this.route.paramMap.subscribe((params) => {
      console.log(params.get("title"));
    });
    this.route.queryParamMap.subscribe((params) => {
      console.log(params.get("name"), params.get("age"));
    });
  }
}
```

## 原理

Angular 其中的一个设计目标是使浏览器与 DOM 独立。DOM 是复杂的，因此使组件与它分离，会让我们的应用程序，更容易测试与重构。另外的好处是，由于这种解耦，使得我们的应用能够运行在其它平台 (比如：Node.js、WebWorkers、NativeScript 等)。

为了能够支持跨平台，Angular 通过抽象层封装了不同平台的差异。比如定义了抽象类 Renderer、Renderer2 、抽象类 RootRenderer 等。此外还定义了以下引用类型：ElementRef、TemplateRef、ViewRef 、ComponentRef 和 ViewContainerRef 等。

### 平台

平台是应用程序运行的环境。它是一组服务，可以用来访问你的应用程序和 Angular 框架本身的内置功能。由于 Angular 主要是一个 UI 框架，平台提供的最重要的功能之一就是页面渲染。

```ts
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  imports: [BrowserModule],
  bootstrap: [AppCmp],
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

1. 引导过程由两部分组成：创建平台和引导模块。在这个例子中，我们导入 BrowserModule 模块，它是浏览器平台的一部分。应用中只能有一个激活的平台，但是我们可以利用它来引导多个模块，如下所示：

```ts
const platformRef: PlatformRef = platformBrowserDynamic();
platformRef.bootstrapModule(AppModule1);
platformRef.bootstrapModule(AppModule2);
```

2. 由于应用中只能有一个激活的平台，单例的服务必须在该平台中注册。比如，浏览器只有一个地址栏，对应的服务对象就是单例。此外如何让我们自定义的 UI 界面，能够在浏览器中显示出来呢，这就需要使用 Angular 为我们提供的渲染器。

### Renderer 渲染器

浏览器平台下， Renderer 渲染器的相关基础知识:

1. Angular 应用程序启动时会创建 RootView (生产环境下通过调用 createProdRootView() 方法)
2. 创建 RootView 的过程中，会创建 RootData 对象，该对象可以通过 ViewData 的 root 属性访问到。基于 RootData 对象，我们可以通过 renderer 访问到默认的渲染器，即 DefaultDomRenderer2 实例，此外也可以通过 rendererFactory 访问到 RendererFactory2 实例。
3. 在创建组件视图 (ViewData) 时，会根据 componentRendererType 的属性值，来设置组件关联的 renderer 渲染器。
4. 当渲染组件视图的时候，Angular 会利用该组件关联的 renderer 提供的 API，创建该视图中的节点或执行视图的相关操作，比如创建元素 (createElement)、创建文本 (createText)、设置样式 (setStyle) 和 设置事件监听 (listen) 等。

## 使用

### 显示 html

通过绑定属性 innerHTML 来显示 html 片段。eg.`<div [innerHTML]="innerHTML"></div>`

### @types/node

有时会报错，那么可以在`tsconfig.json > compilerOptions` 中注掉空`types`或者向空数组中添加`node/browser`等。

### google fonts

1. [google fonts](https://fonts.google.com/)
2. [google fonts](https://developers.google.com/fonts/docs/material_icons?hl=zh-cn)

先搜索 2，然后可以直接下载 svg，然后放到 assets/fonts 下，然后在 styles.scss 中引入。可以直接使用：

```html
<!-- 1 -->
<img src="./assets/images/progress_activity.svg" class="mat-icon-rtl-mirror icon-loading" alt="" />
<!-- 2 -->
<mat-icon class="mat-icon-rtl-mirror" fontIcon="refresh"></mat-icon>
<!-- 或 -->
<mat-icon class="mat-icon-rtl-mirror">refresh</mat-icon>
<!-- 3 和1差不多 -->
<svg
  class="mat-icon-rtl-mirror icon-cancel"
  xmlns="http://www.w3.org/2000/svg"
  height="24"
  viewBox="0 -960 960 960"
  width="24"
  mat-dialog-close>
  <path
    d="m480-438 129 129q9 9 21 9t21-9q9-9 9-21t-9-21L522-480l129-129q9-9 9-21t-9-21q-9-9-21-9t-21 9L480-522 351-651q-9-9-21-9t-21 9q-9 9-9 21t9 21l129 129-129 129q-9 9-9 21t9 21q9 9 21 9t21-9l129-129Zm0 358q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
</svg>
<!-- 4 目测不行，需要配置 -->
<span class="material-symbols-outlined"> progress_activity </span>
```

## 原理

### Angular 的 DOM 操作原理

1. 变更检测（Change Detection）机制
   - Zone.js 监控异步操作：Angular 使用 Zone.js 来包装所有异步 API，当异步事件（点击、定时器、AJAX 等）发生时触发变更检测
   - 组件树检查：从根组件开始，自上而下检查整个组件树
   - 数据绑定更新：比较模板绑定表达式的当前值和上次值，如果不同则更新 DOM
2. 模板编译过程：Angular 在构建时（AOT）或运行时（JIT）将模板编译为 JavaScript 指令代码
   - 解析模板：将 HTML 模板解析为抽象语法树（AST）
   - 生成视图工厂：编译为可执行的视图工厂函数
   - 创建视图实例：运行时生成具体的视图结构
   - 绑定更新函数：为每个数据绑定生成专用的更新函数
3. 增量 DOM 技术--使用增量 DOM（Incremental DOM） 而不是虚拟 DOM：
   - 内存中的模板指令：编译后的模板保留如何创建/更新 DOM 的指令
   - 就地更新：直接操作真实 DOM，但通过指令系统最小化操作
   - 内存效率高：不需要维护完整的虚拟 DOM 树
4. 更新流程示例：
   - 点击事件发生：Zone.js 捕获事件
   - 触发变更检测：Angular 从根组件开始检测
   - 检查绑定：发现 count 值已变化
   - 执行更新：调用编译阶段生成的专门更新函数，只更新 `<span>` 的文本节点
   - DOM 更新：直接修改真实 DOM 的文本内容
5. Angular DOM 操作的优势
   - AOT 编译优化：提前编译可以发现模板错误，生成高度优化的 DOM 操作代码，移除了运行时模板解析的开销
   - 内存效率高：不需要维护虚拟 DOM 的完整副本，增量 DOM 的内存占用更小
   - 可预测的更新：明确的数据流（单向数据绑定），变更检测路径清晰
   - 集成优化：与 Angular 其他特性（如 DI、RxJS）深度集成，自动处理变更检测和 DOM 更新

## 技巧

### 卸载@angular-cli

依次执行以下命令行：

1. `npm uninstall -g angular-cli`
2. `npm uninstall --save-dev angular-cli`
3. `npm uninstall -g @angular/cli`
4. `npm cache verify (低版本npm使用 npm cache clean [--force])`
5. 然后执行`ng v`, 如果提示`command not found: ng`说明成功卸载，否则看看 nvm 下的各个版本里是否也有安装 cli，依次删除
6. `npm install -g @angular/cli@7.3.9 (现在推荐使用这个方式安装cli, 而不是npm uninstall -g angular-cli, 如果报错，可以使用cnpm代替npm)`

### 安装指定版本@angular-cli

1. 卸载之前的版本 `npm uninstall -g @angular/cli`
2. 清除缓存，确保卸载干净 `npm cache verify`，在低版本的 nodejs 里面清除缓存使用的命令是`npm cache clean`
3. 检查是否卸载干净，输入命令 `ng v`，若显示"command not found"则卸载干净
4. 全局安装指定版本 `npm install -g @angular/cli@7.3.9`
5. 检查版本号 `ng v`

### 在 Angular 项目中运行 ngcc/ngc

1. Angular 项目的 angular.json 文件里有这么一行：`"aot": true,`，意思是使用 Ivy 编译， 即 Angular 下一代编译和渲染管道的代号。 `ahead-of-time (AOT) compiler`
2. 从 Angular 的版本 9 开始，这个新的编译器和运行时指令集就代替了老的编译器和运行时（即视图引擎 View Engine）成为了默认值。
3. 可以使用通过 View Engine 编译器创建的库来构建 Ivy 应用程序。此兼容性由称为 Angular 兼容性编译器（ ngcc ）的工具提供。CLI 命令在执行 Angular 构建时会根据需要运行 ngcc。
4. 如果你是库作者，则应从版本 9 之后继续使用 View Engine 编译器。通过让所有库继续使用 View Engine，你将与使用 Ivy 的默认 v9 应用程序以及已选择的应用程序保持兼容性。
5. ngcc 即我们每次`ng serve`时看到的 ngcc(worker):...
6. Angular 的 AOT 编译器会在构建阶段，在浏览器下载并运行这些代码之前，把 Angular 的 HTML 和 TypeScript 代码转换成高效的 JavaScript 代码。这是生产环境的最佳编译模式，与即时(JIT)编译相比，它可以减少加载时间并提高性能。
7. 通过使用`ngc`命令行工具编译你的应用，你可以直接引导到模块工厂，所以你不需要在你的 JavaScript 包中包含 Angular 编译器。

### 移除打包时关于文件体积限制的 warning

在 angular.json 文件里`architect.build.options.budgets`配置，以及在`architect.build.configurations`中的每个环境中的 budgets 中单独配置，比如：production、styling-mode 等

```json
{
...
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "2mb",
        "maximumError": "5mb"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "8kb",
        "maximumError": "10kb"
      }
    ],
    // 根据环境使用不同的参数打不同的包
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.target.ts"
      }
    ]
...
}
```

### 踩坑系列

#### service 注册和使用

1. service 可以在根 module 里引入（全局可用），也可以在其他 module 中引入（仅这个 module 可用），还能通过在 service 的@Injectable 中声明注入的 module。
2. 如果 service 注册在 root 根模块中，那么所有的子模块使用的是同一个 service 实例（单例模式），除非在子注入器中配置了其他的 providers。
3. 如果 service 分别注册在不同的组件中，那么他们使用的则是不同的实例。
4. 在某个注入器的范围内，服务是单例的。也就是说在指定的注入器中，最多只有某个服务的一个实例。
5. 如果一个模块在应用程序启动时就加载（非懒加载），它的@NgModule.providers 具有全应用级作用域！他们也可以用于整个应用的注入中！
6. 如果要把服务的范围限制在模块中，那么就需要对该模块进行懒加载。惰性加载的模块拥有自己的注入器，是应用注入器的直属子级，该惰性加载模块的 providers 和他导入的模块的 providers 都会添加到他自己的注入器中且不受全局的相同 providers 的影响。当路由在惰性加载的环境中创建组件时，Angular 优先使用惰性加载模块中的服务实例，而不是根注入器中的。
7. 建议在 service 本身的@Injectable 装饰器中指定使用它的模块，这样做还能发挥 tree-shaking 优势。

#### ::ng-deep

1. `::ng-deep`功能类似 Vue 中的`::v-deep`(谁抄的谁咱也不敢说)，比如在父组件对一些子组件样式进行穿透等（父组件的样式会没有 ng 生成的属性选择器）。可能会污染其他子组件的样式。
2. 解决样式污染使用`:host`放在`::ng-deep`前面，这时样式又会获得属性封装，把属性留在组件树内部。
3. 全局样式可以在 `styles.scss` 中使用`:root`，但是要注意影响范围。

#### [attr] vs attr

1. attr 接收的是 string，传的变量都会变成 string。
2. `[attr]`接收的是传入的变量。

#### 自定义组件中使用 ngModel

1. 自定义组件要实现`ControlValueAccessor`接口，并在`writeValue`方法中把父组件传入的值赋给自定义组件中对应的属性。

```js
@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductListComponent),
      multi: true,
    },
  ],
})
export class ProductListComponent implements ControlValueAccessor {
 	writeValue(n: number): void {
    this.value = n;
  }
  registerOnChange: (fn: (value: number) => void) => void = (fn) =>
    (this.onChange = fn);
  registerOnTouched: (fn: () => void) => void = (fn) => (this.onTouched = fn);
  setDisabledState?(isDisabled: boolean): void {}
  onChange: (value: number) => void = () => null;
  onTouched: () => void = () => null;

  @Input() value: number = 0;

// ...

}
```

2. 自定义组件声明 providers
3. 父组件调用子组件

#### select 设置默认值

1. 此时 selectId 函数会直接接收到(默认)值，不需要再通过`$event.target.value`获取。

```html
<select [(ngModel)]="defaultId" (change)="selectId($event)" class="custom-select">
  <option *ngFor="let id of ids" [value]="id" class="custom-option">{{ id }}</option>
</select>
```

#### 生命周期钩子

```ts
	// 执行一次
	ngOnInit() {
		console.log('ngOnInit');
	}
	// 执行一次
	ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }
	// 执行多次
	ngAfterContentChecked() {
    console.log('ngAfterContentChecked');
  }
	// 执行一次
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }
  // 执行多次
  ngAfterViewChecked() {
    console.log('ngAfterViewChecked');
  }
	// 执行一次
  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
	// 执行多次
	ngDoCheck() {
    console.log('ngDoCheck');
  }
	// 可以执行多次
	ngOnChanges(sc: SimpleChanges): void {
    console.log(sc);
  }
```

1. `checked` 结尾的钩子会执行多次，其余都执行一次。
2. `ngOnChanges` 只在输入属性变更时触发，且可以有一个参数，包含变更属性的信息。
3. `content` 钩子是父组件先执行，view 钩子是子组件先执行。
4. `ngDoCheck` 钩子的调用频率最高，不要在当中实现过重的业务。
5. 初始化的业务应该放在 `ngOnInit` 中，而不是构造函数中。

#### 变更检查

1. 单向数据流
2. 触发变更检查的事件：`Event、XHR、Timer` 等
3. 解决`ExpressionChangedAfterItHasBeenCheckedError`报错的两个方法
   1. 在父组件的 `ngAfterViewInit` 钩子中强制 Angular 进行变更检查：`this.changeDetectorRef.detectChanges()`
   2. 在子组件中使用异步更新的方式修改父组件的内容（这其实是违背了单向数据流的原则，所以有错误并不奇怪）：`setTimeout(()=>...,0);`

#### SharedModule

1. 为那些可能会在应用中到处使用到的组件、指令和管道创建 `SharedModule`，这种模块应该只包含 `declarations`，并且应该导出几乎所有 `declarations` 里面的声明。
2. `SharedModule` 不应该带有 `providers`。

#### XSS

1. 当 iframe 的 src 是变量时，需要用`this.domSanitizer.bypassSecurityTrustResourceUrl(url)`处理一下，方能正常加载。

#### HttpClientModule

> Angular HTTP Client 快速入门

##### 导入新的 HTTP Module

```ts
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

使用：`http.get(url).subscribe(...);`

##### 发送 Get 请求

```ts
import {HttpClient} from "@angular/common/http";

// ...
    data: any;
    constructor(private http:HttpClient) {}

    ngOnInit() {
        this.data = this.http
            .get("https://angular-http-guide.firebaseio.com/courses.json")
            .map(data => _.values(data))
            .do(console.log);
    }
```

##### 设置查询参数

1. 创建 HttpParams 对象

```ts
import { HttpParams } from "@angular/common/http";

const params = new HttpParams().set("orderBy", '"$key"').set("limitToFirst", "1");

this.courses$ = this.http
  .get("/courses.json", { params })
  .do(console.log)
  .map((data) => _.values(data));
```

通过链式语法调用 set() 方法，构建 HttpParams 对象。这是因为 HttpParams 对象是不可变的，通过 set() 方法可以防止该对象被修改。每当调用 set() 方法，将会返回包含新值的 HttpParams 对象，因此如果使用下面的方式，将不能正确的设置参数。

```ts
const params = new HttpParams();

params.set("orderBy", '"$key"');
params.set("limitToFirst", "1");
```

2. 使用 fromString 语法: `const params = new HttpParams({fromString: 'orderBy="$key"&limitToFirst=1'});`
3. 使用 request() API:

```ts
const params = new HttpParams({ fromString: 'orderBy="$key"&limitToFirst=1' });

this.courses$ = this.http
  .request("GET", "/courses.json", {
    responseType: "json",
    params,
  })
  .do(console.log)
  .map((data) => _.values(data));
```

##### 设置 HTTP Headers

```ts
const headers = new HttpHeaders().set("X-CustomHeader", "custom header value");

this.courses$ = this.http
  .get("/courses.json", { headers })
  .do(console.log)
  .map((data) => _.values(data));
```

##### 发送 Put 请求

```ts
httpPutExample() {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    this.http.put("/courses/-KgVwECOnlc-LHb_B0cQ.json",
        {
            "courseListIcon": ".../main-page-logo-small-hat.png",
            "description": "Angular Tutorial For Beginners TEST",
            "iconUrl": ".../angular2-for-beginners.jpg",
            "longDescription": "...",
            "url": "new-value-for-url"
        },
        {headers})
        .subscribe(
            val => {
                console.log("PUT call successful value returned in body",
                  val);
            },
            response => {
                console.log("PUT call in error", response);
            },
            () => {
                console.log("The PUT observable is now completed.");
            }
        );
}
```

##### 发送 Patch 请求

```ts
httpPatchExample() {
    this.http.patch("/courses/-KgVwECOnlc-LHb_B0cQ.json",
        {
            "description": "Angular Tutorial For Beginners PATCH TEST",
        })
        .subscribe(
            (val) => {
                console.log("PATCH call successful value returned in body",
                  val);
            },
            response => {
                console.log("PATCH call in error", response);
            },
            () => {
                console.log("The PATCH observable is now completed.");
            });
}
```

##### 发送 Delete 请求

```ts
httpDeleteExample() {
    this.http.delete("/courses/-KgVwECOnlc-LHb_B0cQ.json")
        .subscribe(
            (val) => {
                console.log("DELETE call successful value returned in body",
                  val);
            },
            response => {
                console.log("DELETE call in error", response);
            },
            () => {
                console.log("The DELETE observable is now completed.");
            });
}
```

##### 发送 Post 请求

```ts
httpPostExample() {
    this.http.post("/courses/-KgVwECOnlc-LHb_B0cQ.json",
        {
            "courseListIcon": "...",
            "description": "TEST",
            "iconUrl": "..",
            "longDescription": "...",
            "url": "new-url"
        })
        .subscribe(
            (val) => {
                console.log("POST call successful value returned in body",
                  val);
            },
            response => {
                console.log("POST call in error", response);
            },
            () => {
                console.log("The POST observable is now completed.");
            });
}
```

##### 避免重复请求

```ts
import {shareReplay} from 'rxjs/operator';

duplicateRequestsExample() {
    const httpGet$ = this.http
        .get("/courses.json")
        .map(data => _.values(data))
        .shareReplay(); // 避免发送冗余的请求

    httpGet$.subscribe(
        (val) => console.log("logging GET value", val)
    );

    this.courses$ = httpGet$;
}
```

##### 并行发送多个请求

1. 并行发送 HTTP 请求的一种方法是使用 RxJs 中的 `forkjoin/zip/combineLatest/mergeMap` 操作符：

```ts
import { forkJoin, zip, combineLatest } from "rxjx";
import { mergeMap } from "rxjs/operators";

const request1$ = this.http.get("/api/data1");
const request2$ = this.http.get("/api/data2");

// 1 forkJoin操作符可以同时发出多个HTTP请求，并且只会发出一个完整的数组，其中包含了所有HTTP响应。这在需要同时获取多个数据源的情况下非常有用。
forkJoin([request1$, request2$]).subscribe(([data1, data2]) => {
  // 处理data1和data2
});

// 2  zip操作符类似于forkJoin，它也可以同时发送多个HTTP请求，但是它会等待所有请求都完成后才会触发订阅。这意味着，如果其中一个请求失败，整个流可能会失败。
zip(request1$, request2$).subscribe(([data1, data2]) => {
  // 处理data1和data2
});

// 3  如果您需要根据前一个请求的响应来触发后续请求，可以使用mergeMap（也称为flatMap）操作符。这允许您在前一个请求完成后触发新的请求，从而实现并行请求。
this.http
  .get("/api/data1")
  .pipe(
    mergeMap((data1) => {
      const request2$ = this.http.get(`/api/data2/${data1.id}`);
      const request3$ = this.http.get("/api/data3");
      return forkJoin([request2$, request3$]);
    })
  )
  .subscribe(([data2, data3]) => {
    // 处理data2和data3
  });

// 4 combineLatest操作符将多个请求的响应组合成一个Observable，每当其中一个请求完成时，它会发出一个新的组合值。这允许您在任何请求完成时获取最新的数据。
combineLatest([request1$, request2$]).subscribe(([data1, data2]) => {
  // 处理data1和data2
});
```

1. 另一种方法是使用 `Promise.all`：

```ts
// 如果您更喜欢使用Promises而不是Observables，您可以将HTTP请求封装在Promises中，并使用Promise.all来等待它们全部完成。
const promise1 = this.http.get("/api/data1").toPromise();
const promise2 = this.http.get("/api/data2").toPromise();

Promise.all([promise1, promise2]).then(([data1, data2]) => {
  // 处理data1和data2
});
```

##### 顺序发送 Http 请求

```ts
sequentialRequests() {
    const sequence$ = this.http.get<Course>('/courses/-KgVwEBq5wbFnjj7O8Fp.json')
        .switchMap(course => {
            course.description+= ' - TEST ';
            return this.http.put('/courses/-KgVwEBq5wbFnjj7O8Fp.json', course)
        });

    sequence$.subscribe();
}
```

##### 获取顺序发送 Http 请求的结果

```ts
sequentialRequests() {
    const sequence$ = this.http.get<Course>('/courses/-KgVwEBq5wbFnjj7O8Fp.json')
        .switchMap(course => {
            course.description+= ' - TEST ';
            return this.http.put('/courses/-KgVwEBq5wbFnjj7O8Fp.json', course)
        },
            (firstHTTPResult, secondHTTPResult)  => [firstHTTPResult, secondHTTPResult]);

    sequence$.subscribe(values => console.log("result observable ", values) );
}
```

##### 请求异常处理

```ts
throwError() {
    this.http
        .get("/api/simulate-error")
        .catch( error => {
            // here we can show an error message to the user,
            // for example via a service
            console.error("error catched", error);

            return Observable.of({description: "Error Value Emitted"});
        })
        .subscribe(
            val => console.log('Value emitted successfully', val),
            error => {
                console.error("This line is never called ",error);
            },
            () => console.log("HTTP Observable completed...")
        );
}
```

#### Http 拦截器

1. 定义拦截器

```ts
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      headers: req.headers.set("X-CustomAuthHeader", authService.getToken()),
    });
    console.log("new headers", clonedRequest.headers.keys());
    return next.handle(clonedRequest);
  }
}
```

##### 配置拦截器

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [[{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

##### Http 进度事件

```ts
longRequest() {
    const request = new HttpRequest("POST", "/api/test-request", {}, {reportProgress: true});

    this.http.request(request)
        .subscribe(
            event => {
                if (event.type === HttpEventType.DownloadProgress) {
                    console.log("Download progress event", event);
                }
                if (event.type === HttpEventType.UploadProgress) {
                    console.log("Upload progress event", event);
                }
                if (event.type === HttpEventType.Response) {
                    console.log("response received...", event.body);
                }
            }
        );
}
```

### HttpClient

1. Angular 中的 HttpClient 在请求数据时会自动把 response data 当成 JSON 来解析，这样去请求就可以防止它自动 parse：`this.http.get(normalizedUrl, { responseType: 'text' }).then(…)`

### 使用 Store

1. 安装：`npm install @ngrx/store --save`
2. 创建一个 store，它是一个单例对象，用来存储整个应用的状态。
3. 创建一个 reducer 函数，它接收两个参数：当前的状态和一个 action，然后返回一个新的状态。
4. 创建一个 action，它是一个简单的对象，包含一个 type 属性和一个 payload 属性。
5. 创建一个 selector，它是一个纯函数，用来从 store 中选择部分状态。
6. 创建一个 service，它用来发送 action 到 store。
7. 创建一个 effects，它用来处理副作用，一般是处理异步操作。
8. 在组件中使用 store，通过 selector 选择部分状态，然后在组件中订阅这个状态。

```ts
// admin.reducer.ts
import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./admin.actions";

export interface AppState {
  data: any;
  loading: boolean;
  error: any;
}

export const initialState: AppState = {
  data: null,
  loading: false,
  error: null,
};

export const adminReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, (state, { data }) => ({ ...state, data, loading: false })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
```

```ts
// admin.actions.ts
import { createAction, props } from "@ngrx/store";
export const login = createAction("[Login Page] Login");
export const loginSuccess = createAction("[Login Page] Login Success", props<{ data: any }>());
export const loginFailure = createAction("[Login Page] Login Failure", props<{ error: any }>());
```

```ts
// admin.selectors.ts
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AppState } from "./admin.reducer";

export const selectAppState = createFeatureSelector<AppState>("admin");
export const selectData = createSelector(selectAppState, (state: AppState) => state.data);
export const selectLoading = createSelector(selectAppState, (state: AppState) => state.loading);
export const selectError = createSelector(selectAppState, (state: AppState) => state.error);
```

```ts
// admin.effects.ts
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, Effect } from "@ngrx/effects";
import { map, switchMap, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { AuthService } from "./admin.service";
import * as AuthActions from "./admin.actions";

@Injectable({
  providedIn: "root",
})
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(() =>
        this.authService.login().pipe(
          map((data) => AuthActions.loginSuccess({ data })),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );
}
```

```ts
// admin.service.ts
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as AuthActions from "./admin.actions";
import { HttpClient } from "@angular/common/http";
import { tap, catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class AuthService {
  constructor(private store: Store, private http: HttpClient) {}

  login() {
    return this.http.get("https://jsonplaceholder.typicode.com/todos/5").pipe(
      tap((data) => this.store.dispatch(AuthActions.loginSuccess({ data }))),
      catchError((error) => of(this.store.dispatch(AuthActions.loginFailure({ error }))))
    );
  }
}
```

```ts
// app.module.ts
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { adminReducer } from "./admin.reducer";
import { AuthEffects } from "./admin.effects";
import { AuthService } from "./admin.service";

export function initLogin(authService: AuthService) {
  return () => authService.login();
}

@NgModule({
  imports: [StoreModule.forRoot({ admin: adminReducer }), EffectsModule.forRoot([AuthEffects])],
  providers: [
    AuthService,
    // APP_INITIALIZER：在app启动时调用AuthService的login方法
    { provide: APP_INITIALIZER, useFactory: initLogin, deps: [AuthService], multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 自定义属性不报错
})
export class AppModule {}
```

```ts
// app.component.ts
import { Store, select } from "@ngrx/store";
import { AppState } from "./admin.reducer";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { selectData, selectError, selectLoading } from "./admin.selectors";
import * as AuthActions from "./admin.actions";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">{{ error }}</div>
    <div *ngIf="data">{{ data | json }}</div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  loading$ = this.store.pipe(select(selectLoading));
  error$ = this.store.pipe(select(selectError));
  data$ = this.store.pipe(select(selectData));
  // data$ = this.store.select(selectData); // 也可以
  data = [];
  error = undefined;
  loading = false;
  private subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription = this.data$.subscribe((data) => {
      this.data = data;
    });
    this.subscription.add(
      this.error$.subscribe((error) => {
        this.error = error;
      })
    );
    this.subscription.add(
      this.loading$.subscribe((loading) => {
        this.loading = loading;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

## 指令使用

1. `ng g d [path]/name`
2. 一个指令可以同时接收多个参数
3. 指令使用时需要注册到模块中
4. 示例：

```ts
import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostBinding,
  SimpleChanges,
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription, of } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/store/admin.reducers";
import { selectAuthCodes } from "src/app/store/admin.selectors";

@Directive({
  selector: "[btnAuth]",
})
export class AuthDirective implements OnInit, OnDestroy {
  // 指令接收的参数1
  @Input() btnAuth: string[] = [];
  // 接收的另一个参数2：目的是根据是否有权限和表单是否有效这两个条件来一起判断按钮是否可用
  @Input() isFormInvalid: boolean = false;
  private userAuthCodes$: Observable<string[]> = of([]);
  private subscription: Subscription = new Subscription();
  private hasAuth: boolean = false;

  // @HostBinding装饰器用于将指令的属性绑定到宿主元素的属性、样式或类。
  // 可以认为它是模板绑定的一种替代方式，但是在指令的类文件中使用
  @HostBinding("attr.disabled") get disabled() {
    return this.hasAuth ? null : true;
  }
  // @HostBinding可以有多种使用形式
  // @HostBinding('style.backgroundColor') backgroundColor: string;
  // @HostBinding('class.active') isActive: boolean;

  // @HostListener装饰器用于监听宿主元素上的事件，并在事件发生时执行指定的方法。
  // @HostListener("mouseenter") onMouseEnter() {
  //   this.highlight("yellow");
  // }

  // @HostListener("mouseleave") onMouseLeave() {
  //   this.highlight(null);
  // }

  // private highlight(color: string | null) {
  //   // 在这里，你可以使用 @HostBinding 或直接操作 DOM 来改变样式
  // }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private store: Store<AppState> // @Host用于控制依赖注入的作用域，用于注入器的视图层级注入，它告诉Angular在注入依赖时应该从宿主元素的注入器开始查找。 // @Optional() @Host() private someService: SomeService
  ) {}

  ngOnInit() {
    this.subscription = this.store.pipe(select(selectAuthCodes))?.subscribe((codes) => {
      this.userAuthCodes$ = of(codes);
      this.updateButtonStatus();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateButtonStatus();
  }

  private updateButtonStatus(): Subscription {
    if (!this.userAuthCodes$) {
      console.warn("userAuthCodes$ is undefined or null. Make sure the Store is properly initialized.");
      return new Subscription();
    }

    return this.userAuthCodes$.subscribe((authCodes: string[]) => {
      if (!authCodes) {
        console.warn("authCodes is undefined or null. The Store state might not be ready yet.");
        return;
      }
      const hasPermission = authCodes.some((authCode: string) => this.btnAuth.includes(authCode));
      this.hasAuth = hasPermission && !this.isFormInvalid;
      // 理论上来说可以设置disabled属性，but没有生效，所以使用HostBinding来实现该功能
      // this.renderer.setProperty(this.el.nativeElement, 'disabled', !this.hasAuth);
      this.cdRef.detectChanges();
    });
  }
}

@Component({
  template: ` <button btnAuth="['ADMIN']" [isFormInvalid]="false" type="submit">Submit</button> `,
})
class TestComponent3 {
  btnAuth: string[] = [];
  isFormInvalid?: boolean = false;
}
```

## Renderer2

1. Renderer2 是 Angular 中的一个抽象类，提供了一种在不直接操作 DOM 的情况下与宿主元素进行交互的方法。这种方法更安全，特别是当运行在不同平台上时（比如服务器端渲染、Web Worker 或者任何不直接支持 DOM 操作的环境）。使用 Renderer2，你可以添加或删除元素、添加或删除样式、监听事件等，而不用担心跨平台兼容性问题。
2. Renderer2 的主要方法包括：
   - createElement(name: string, namespace?: string|null): 创建一个新的元素。
   - createText(value: string): 创建一个新的文本节点。
   - appendChild(parent: any, newChild: any): 将一个子节点添加到父节点上。
   - insertBefore(parent: any, newChild: any, refChild: any): 在参考子节点之前插入一个新的子节点。
   - removeChild(parent: any, oldChild: any): 从父节点上移除一个子节点。
   - selectRootElement(selectorOrNode: any): 选择根元素。
   - setAttribute(el: any, name: string, value: string, namespace?: string|null): 设置元素的属性。
   - removeAttribute(el: any, name: string, namespace?: string|null): 移除元素的属性。
   - addClass(el: any, name: string): 给元素添加类。
   - removeClass(el: any, name: string): 移除元素的类。
   - setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): 设置元素的样式。
   - removeStyle(el: any, style: string, flags?: RendererStyleFlags2): 移除元素的样式。
   - setProperty(el: any, name: string, value: any): 设置元素的属性。
   - listen(target: 'window'|'document'|'body'|any, eventName: string, callback: (event: any) => boolean | void): 监听给定的事件。
3. Renderer2 的使用示例：假设你有一个指令，当鼠标悬停在宿主元素上时，你想改变宿主元素的背景色。你可以使用 Renderer2 来实现这个功能，而不是直接操作 DOM：

```ts
import { Directive, ElementRef, Renderer2, HostListener } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener("mouseenter") onMouseEnter() {
    this.highlight("yellow");
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string | null) {
    this.renderer.setStyle(this.el.nativeElement, "backgroundColor", color);
  }
}
```

## 单元测试

1. 可以使用 jest 进行单元测试，也可以使用 karma 进行单元测试。以下以 karma 进行单元测试。
2. `ng test`：运行单元测试。
3. `ng test --code-coverage`：运行单元测试并生成代码覆盖率报告。
4. `ng test --watch`：运行单元测试并监视文件变化。
5. `ng test --browsers Chrome`：指定浏览器运行单元测试。
6. `ng test --browsers ChromeHeadless`：指定无头浏览器运行单元测试。
7. `ng test --no-watch --no-progress --browsers=CustomChromeHeadless --code-coverage`：不监视文件变化，不显示进度，指定无头浏览器运行单元测试并生成代码覆盖率报告，用于接入 SonarQube。

### 测试平台的配置文件

1. `karma.conf.js`：Karma 的配置文件，用于配置测试平台的各种参数。

```js
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-coverage-istanbul-reporter"),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly", "text-summary"],
      dir: require("path").join(__dirname, "./coverage/mu-ui"),
      subdir: ".",
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      thresholds: {
        emitWarning: true,
        global: {
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80,
        },
      },
    },
    combineBrowserReports: true,
    reporters: ["progress", "kjhtml", "coverage-istanbul"],
    // 接入SonarQube时使用
    // browsers: ["CustomChromeHeadless"],
    browsers: ["Chrome"],
    customLaunchers: {
      // 接入SonarQube时使用
      // CustomChromeHeadless: {
      //   base: 'Chrome',
      //   flags: [
      //     '--headless',
      //     '--disable-gpu',
      //     '--no-sandbox',
      //     '--disable-translate',
      //     '--disable-extensions',
      //     '--remote-debugging-port=9222'
      //   ]
      // },
      // 平时开发时使用
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--disable-gpu",
          "--no-sandbox",
          "--disable-translate",
          "--disable-extensions",
          "--remote-debugging-port=9222",
        ],
      },
    },
    restartOnFileChange: true,
    verbose: true,
  });
};
```

### 测试用例注意事项

1. 注意把所有使用到的依赖项都引入 spec.ts 文件中。
2. 使用`describe`和`it`来组织测试用例。
3. 使用`beforeEach`和`afterEach`来初始化和清理测试用例。
4. 使用`spyOn`来监视函数的调用情况。
5. 使用`expect`来断言测试结果。
6. 对于不易测试的较大的组件，可以通过模拟子组件的方式来进行测试，也就是将组件简化并进行 mock。
7. 使用`TestBed`来创建组件的测试环境。
8. 使用`TestBed.configureTestingModule`来配置测试模块。
9. 使用`TestBed.createComponent`来创建组件的实例。
10. 使用`fixture.detectChanges()`来触发组件的变更检测。
11. 使用`fixture.nativeElement`来获取组件的 DOM 元素。
12. 使用`fixture.debugElement`来获取组件的 DebugElement。
13. 使用`fixture.componentInstance`来获取组件实例。
14. 使用`fixture.autoDetectChanges()`来自动检测变更。
15. 使用`fixture.whenStable()`来等待异步操作完成。
16. 使用`fakeAsync, tick`来进行异步测试。
17. 使用`TestBed.inject`来获取服务实例。

### 测试用例示例

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateLoader, TranslateFakeLoader, TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { UserComponent } from './user.component';
import { MessageService } from './message.service';
import { AuthDirective } from './auth.directive';
import { UserService } from './user.service';
import { UserWhiteListService } from './user.whitelist.service';
import { Observable, of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

// 模拟一个弹窗提示服务
class MockMessageService {
  showInfoMessage(msg: string) {}
  showErrorMessage(msg: string) {}
  showWarnMessage(msg: string) {}
}

class MockUserService {
  getUserData(vin: string, referenceVin: string): Observable<any> {
    return of({});
  }

  createUserData(vin: string, referenceVin: string): Observable<any> {
    return of({});
  }

  deleteUserData(vin: string, referenceVin: string): Observable<any> {
    return of({});
  }
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let store: Store<AppState>;
  // 这是一种模拟service的方法
  let mockMessageService: MessageService;
  let storeSelectSpy: jasmine.Spy;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  // 这是另一种模拟service的方法
  let userWhiteListServiceSpy: jasmine.SpyObj<UserWhiteListService>;
  // 模拟router
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  // 模拟TranslateService
  const mockTranslationService = {
    validateLanguage() {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent, AuthDirective],
      imports: [
        StoreModule.forRoot({ admin: adminReducer }),
        // mock Translate 服务
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        TranslateService,
        // mock MessageService 服务
        { provide: MessageService, useClass: MockMessageService },
        // mock UserService 服务
        { provide: UserService, useClass: MockUserService },
        // mock Store 服务，用来模拟用户权限
        {
          provide: Store,
          useValue: {
            select: jasmine.createSpy('select').and.returnValue(of(['USER'])),
            pipe: jasmine.createSpy('pipe').and.returnValue(of(['USER']))
          }
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: UserWhiteListService, useValue: userWhiteListServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA], // 忽略未知元素和属性
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    mockMessageService = TestBed.inject(MessageService);
    MockUserService = TestBed.inject(UserService);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    userWhiteListServiceSpy = jasmine.createSpyObj(
      'UserWhiteListService',['getUserWhiteList', 'addUserWhiteList', 'deleteUserWhiteList']);

    store = TestBed.get(Store);
    storeSelectSpy = store.select as jasmine.Spy;
    storeSelectSpy.and.returnValue(of(['USER']));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserData', () => {
    // 监听组件的 getUserData 方法，并调用callThrough
    const spy = spyOn(component, 'getUserData').and.callThrough();
    component.getUserData('vin', 'referenceVin');
    expect(spy).toHaveBeenCalled();
  });

  it('should have user button and the user button can be clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    const userBtn = compiled.querySelector('#user-btn');
    expect(userBtn).toBeTruthy();
    // 防止点击不了
    userBtn.removeAttribute('disabled');
    userBtn.click();
    // 假设组件上有一个 userBtnClicked 属性，用来标识用户按钮是否被点击
    expect(component.userBtnClicked).toBeTrue();
  });

  it('should convert input to upper case', () => {
    // 模拟点击事件对象
    const eventMock = {
      target: {
        value: '5yj3e1ea7LF000316',
        toUpperCase: function () {
          this.value = this.value.toUpperCase();
        }
      }
    };
    component.toUpper(eventMock);
    expect(eventMock.target.value).toBe('5YJ3E1EA7LF000316');
  });

  it('should show error message when search is not successful', () => {
    // 模拟 UserService 的 getUserData 方法返回一个错误，返回值可以自定义
    spyOn(MockUserService, 'getUserData').and.returnValue(
      of({
        status: 'success',
        code: '500',
        payload: null,
        message: 'Error'
      } as any)
    );
    spyOn(mockMessageService, 'showErrorMessage');

    component.vinForm.controls['vin'].setValue('ABC1A23C6L3309793');
    component.vinForm.controls['seller'].setValue('CBANEEF8Z19111804');
    component.search();

    expect(MockUserService.getUserData).toHaveBeenCalled();
    expect(component.useData).toBeFalsy();
    expect(component.uerData.name).toEqual('');
    expect(mockMessageService.showErrorMessage).toHaveBeenCalledWith('Error');
  });

  it('should trigger file download and return "success" if response contains file data', () => {
    const mockResponse = {
      headers: {
        get: (header: string) => {
          if (header === 'Content-Type') return 'application/pdf';
          if (header === 'Content-Disposition') return 'attachment; fileName=test.pdf';
          return null;
        }
      },
      body: 'fileData'
    };
    spyOn(document.body, 'appendChild').and.callThrough();
    spyOn(document.body, 'removeChild').and.callThrough();
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');

    component.handleDownloadResponse(mockResponse).subscribe((result) => {
      expect(result).toEqual('success');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  it('should not delete VIN when confirmation dialog is closed', () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    // 模拟 MatDialog 的 open 方法返回一个 MatDialogRef 对象
    mockDialogRef.afterClosed.and.returnValue(of(false));
    mockDialog.open.and.returnValue(mockDialogRef);
    const userNum = 'ABC12345678901234';

    component.openDeleteUserConfirmDialog(userNum);

    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(MockUserService.deleteUserData).not.toHaveBeenCalled();
  });

  it('should add a user to the whitelist', () => {
    userWhiteListServiceSpy.addUserWhiteList.and.returnValue(of({ status: 'success' } as any));
    // 模拟一个错误的返回值
    // const mockResponse = throwError({ status: 500, message: 'Failed' } as any);
    const userNum = 'ABC12345678901234';
    component.addUserToWhiteList(userNum);
    expect(userWhiteListServiceSpy.addUserWhiteList).toHaveBeenCalledWith(userNum);
  });
});
```

## 代理配置

同 Vue。通过`proxy.conf.json`文件进行配置。启动项目时添加配置`ng serve --proxy-config ./proxy.conf.json`。

```js
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": "api"
    }
  }
}
```

## 对于 material-design 的使用

1. 一般使用`@angular/material` 和`@angular/cdk`，`@angular/material`是基于`@angular/cdk` 的，`@angular/cdk` 是一些基础的组件，`@angular/material` 是一些高级的组件，`@angular/material` 会自动安装`@angular/cdk`。

### mat-dialog

1. open 的时候可以设置宽高，也可以设置 class，然后在全局的 `styles.scss` 中设置 class 的样式。
2. 还可以传入数据，然后在 dialog 中使用。

```ts
constructor( public dialog: MatDialog) {}

const dialogRef = this.dialog.open(UserProfileComponent, {
  height: "674px",
  width: "868px",
  panelClass: "custom-dialog",
});
```

### material-table

1. 可以方便的设置分页等功能
2. Demo

```html
<div class="wrapper">
  <table id="listTable" mat-table [dataSource]="tableData" class="mat-elevation-z8" matSort>
    <tr mat-header-row *matHeaderRowDef="tableColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: tableColumns"></tr>
    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by ID">ID</th>
      <td mat-cell *matCellDef="let t">{{ t.id }}</td>
    </ng-container>
    <ng-container matColumnDef="userId">
      <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by User">User</th>
      <td mat-cell *matCellDef="let t">{{ t.userId }}</td>
    </ng-container>
    <ng-container matColumnDef="createdTime">
      <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by TimeStamp">TimeStamp</th>
      <td mat-cell *matCellDef="let t">{{ t.createdTime }}</td>
    </ng-container>
    <ng-container matColumnDef="operation">
      <th mat-header-cell *matHeaderCellDef>Operation</th>
      <td mat-cell *matCellDef="let t">
        <button
          mat-flat-button
          color="warn"
          (click)="onConfirm(t.id)"
          Delete
        </button>
      </td>
    </ng-container>
    <tr class="mat-row" *matNoDataRow>
      <td class="mat-cell no-matched" colspan="2">No data...</td>
    </tr>
  </table>
  <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons aria-label="Select page of periodic elements">
  </mat-paginator>
</div>
```

```ts
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UserService } from "./user.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableData: any[] = [];
  // 设置表头，这里的 id、userId、createdTime、operation 需要和 tableData 中的 key 一致，注意顺序
  tableColumns: string[] = ["id", "userId", "createdTime", "operation"];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserList().subscribe((data) => {
      this.tableData = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // 设置排序规则
    if (this.tableData.paginator) {
      this.tableData.paginator.firstPage();
    }
  }

  onConfirm(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.tableData = this.tableData.filter((item) => item.id !== id);
    });
  }
}
```
