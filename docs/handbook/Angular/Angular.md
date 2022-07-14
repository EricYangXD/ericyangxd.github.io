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

   - –skipGit=true 自动初始化 Git 仓库
   - –minimal=true 不创建 test 测试文件
   - –skip-install 跳过自动安装依赖
   - –style=css cssloader 类型
   - –routing=false 路由
   - –inlineTemplate 模板是否分开为单独文件
   - –inlineStyle 样式文件是否单独分开
   - –prefix 修改 module 名称

4. 启动项目：`ng serve --open --hmr`

   - –open=true 应用构建完成后在浏览器中运行
   - –hmr=true 开启热更新
   - -hmrWarning=false 禁用热更新警告
   - –port 更改应用运行端口

5. 创建共享模块：`ng g m module_name`，可以指定路径
6. 创建共享组件：`ng g c component_name`，可以指定路径
7. 创建服务：`ng g s service_name`，可以指定路径
8. 创建指令：`ng g d directive_name`，可以指定路径

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
import { Component } from "@angular/core";

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
})
export class AppComponent {}
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

## 使用

## 技巧
