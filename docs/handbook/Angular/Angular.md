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
<a
	[routerLink]="['/product', product.title]"
	[queryParams]="{ name: 'superman', age: 15 }"
	>product</a
>
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

## 使用

### 显示 html

通过绑定属性 innerHTML 来显示 html 片段。eg.`<div [innerHTML]="innerHTML"></div>`

### @types/node

有时会报错，那么可以在`tsconfig.json > compilerOptions` 中注掉空`types`或者向空数组中添加`node/browser`等。

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
2. 如果service注册在root根模块中，那么所有的子模块使用的是同一个service实例（单例模式），除非在子注入器中配置了其他的providers。
3. 如果service分别注册在不同的组件中，那么他们使用的则是不同的实例。
4. 在某个注入器的范围内，服务是单例的。也就是说在指定的注入器中，最多只有某个服务的一个实例。
5. 如果一个模块在应用程序启动时就加载（非懒加载），它的@NgModule.providers具有全应用级作用域！他们也可以用于整个应用的注入中！
6. 如果要把服务的范围限制在模块中，那么就需要对该模块进行懒加载。惰性加载的模块拥有自己的注入器，是应用注入器的直属子级，该惰性加载模块的providers和他导入的模块的providers都会添加到他自己的注入器中且不受全局的相同providers的影响。当路由在惰性加载的环境中创建组件时，Angular优先使用惰性加载模块中的服务实例，而不是根注入器中的。
7. 建议在service本身的@Injectable装饰器中指定使用它的模块，这样做还能发挥tree-shaking优势。

#### ::ng-deep

1. `::ng-deep`功能类似 Vue 中的`::v-deep`，比如在父组件对一些子组件样式进行穿透等（父组件的样式会没有 ng 生成的属性选择器）。可能会污染其他子组件的样式。
2. 解决样式污染使用`:host`放在`::ng-deep`前面，这时样式又会获得属性封装，把属性留在组件树内部。

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

1. checked结尾的钩子会执行多次，其余都执行一次。
2. ngOnChanges只在输入属性变更时触发，且可以有一个参数，包含变更属性的信息。
3. content钩子是父组件先执行，view钩子是子组件先执行。
4. ngDoCheck钩子的调用频率最高，不要在当中实现过重的业务。
5. 初始化的业务应该放在ngOnInit中，而不是构造函数中。

#### 变更检查

1. 单向数据流
2. 触发变更检查的事件：Event、XHR、Timer等
3. 解决`ExpressionChangedAfterItHasBeenCheckedError`报错的两个方法
   1. 在父组件的ngAfterViewInit钩子中强制Angular进行变更检查：`this.changeDetectorRef.detectChanges()`
   2. 在子组件中使用异步更新的方式修改父组件的内容（这其实是违背了单向数据流的原则，所以有错误并不奇怪）：`setTimeout(()=>...,0);`

#### SharedModule

1. 为那些可能会在应用中到处使用到的组件、指令和管道创建SharedModule，这种模块应该只包含declarations，并且应该导出几乎所有declarations里面的声明。
2. SharedModule不应该带有providers。

#### XSS

1. 当iframe的src是变量时，需要用`this.domSanitizer.bypassSecurityTrustResourceUrl(url)`处理一下，方能正常加载。