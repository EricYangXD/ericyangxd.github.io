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

1. `::ng-deep`功能类似 Vue 中的`::v-deep`，比如在父组件对一些子组件样式进行穿透等（父组件的样式会没有 ng 生成的属性选择器）。可能会污染其他子组件的样式。
2. 解决样式污染使用`:host`放在`::ng-deep`前面，这时样式又会获得属性封装，把属性留在组件树内部。
3. 全局样式可以在 styles.scss 中使用`:root`，但是要注意影响范围。

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

1. checked 结尾的钩子会执行多次，其余都执行一次。
2. ngOnChanges 只在输入属性变更时触发，且可以有一个参数，包含变更属性的信息。
3. content 钩子是父组件先执行，view 钩子是子组件先执行。
4. ngDoCheck 钩子的调用频率最高，不要在当中实现过重的业务。
5. 初始化的业务应该放在 ngOnInit 中，而不是构造函数中。

#### 变更检查

1. 单向数据流
2. 触发变更检查的事件：Event、XHR、Timer 等
3. 解决`ExpressionChangedAfterItHasBeenCheckedError`报错的两个方法
   1. 在父组件的 ngAfterViewInit 钩子中强制 Angular 进行变更检查：`this.changeDetectorRef.detectChanges()`
   2. 在子组件中使用异步更新的方式修改父组件的内容（这其实是违背了单向数据流的原则，所以有错误并不奇怪）：`setTimeout(()=>...,0);`

#### SharedModule

1. 为那些可能会在应用中到处使用到的组件、指令和管道创建 SharedModule，这种模块应该只包含 declarations，并且应该导出几乎所有 declarations 里面的声明。
2. SharedModule 不应该带有 providers。

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

1. 另一种方法是使用 Promise.all：

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
    const request = new HttpRequest(
        "POST", "/api/test-request", {},
         {reportProgress: true});

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

## 对于 material-design 的使用

1. 一般使用@angular/material 和@angular/cdk，@angular/material 是基于@angular/cdk 的，@angular/cdk 是一些基础的组件，@angular/material 是一些高级的组件，@angular/material 会自动安装@angular/cdk。

### mat-dialog

1. open 的时候可以设置宽高，也可以设置 class，然后在全局的 styles.scss 中设置 class 的样式。
2. 还可以传入数据，然后在 dialog 中使用。

```ts
constructor( public dialog: MatDialog) {}

const dialogRef = this.dialog.open(UserProfileComponent, {
  height: "674px",
  width: "868px",
  panelClass: "custom-dialog",
});
```
