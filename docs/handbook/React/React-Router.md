---
title: React-Router
author: EricYangXD
date: "2022-02-11"
---

## 概括

先用最简单的话来概括一下 React-router 到底做了什么？

本质上， React-Router 就是在页面 URL 发生变化的时候，通过我们写的 path 去匹配，然后渲染对应的组件。

核心库是 react-router. react-router-dom 是在浏览器中使用的，react-router-native 是在 rn 中使用的。

### 整体流程

1. 选择 browserhistory 或 hashhistory 中 listen 监听 URL 的变化
2. `<Router />`通过 Provider 注入对应的 location
3. `<Route />`根据优先级拿到匹配后的值
4. 根据不同方式渲染组件
5. 用户点击`<Link />`，触发 history.push 或 history.replace
6. 触发 history.listen()，回到 1

正常情况下，当 URL 发生变化时，浏览器会像服务端发送请求，但使用以下 2 种办法不会向服务端发送请求：

-   基于 hash
-   基于 history

react-router 使用了 `history` 这个核心库。

### 如何监听 url 的变化 ？

1. 选择方式: history 或 hash

HashRouter 先是从 history 中引用 createBrowserHistory ，然后将 history 和 children 传入到 Router。BrowserHistory 同理。

```js
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const FC = () => {
   // ...
   history.listen(({ pathname }) => setPath(pathname?.split('/').pop() as string));
   // ...
}
```

> BrowserHistory 必须依赖服务器让 url 都映射到 index.html ，否则会 404 。

2. 监听 URL 的变化，拿到对应的 history，location，match 等通过 Provider 注入到子组件中。

### 如何匹配 path，按什么规则 ？

可以分两部分理解:

-   是否匹配
-   渲染组件

1. 是否匹配

computedMatch 是使用 Switch 包裹的子组件才有的值，Switch 的作用是从上到下开始渲染，只要匹配到一个，其他的就不匹配。所以这里会先判断 computedMatch 。

匹配解析 path ，这里使用了第三方库 path-to-regexp

### 组件渲染方式

从文档来看，它支持三种方式的渲染，如下：

```js
// 1. children 方式
<Route exact path="/">
   <HomePage />
</Route>

// 2. func 方式
<Route
   path="/blog/:slug"
   render={({ match }) => {
     // Do whatever you want with the match...
     return <div />;
   }}
/>

// 3. component 方式
<Route path="/user/:username" component={User} />
```

从源码我们可以看出：

1. Router 渲染的优先级：**children > component > render**，三种方式互斥，只能使用一种。
2. 不匹配的情况下，只要 children 是函数，也会渲染。
3. component 是使用 createComponent 来创建的， 这会导致不再更新现有组件，而是直接卸载再去挂载一个新的组件。如果是使用匿名函数来传入 component ，每次 render 的时候，这个 props 都不同，会导致重新渲染挂载组件，导致性能特别差。因此，**当使用匿名函数的渲染时，请使用 render 或 children** 。

```js
// 不要这么使用
<Route path="/user/:username" component={() => <User />} />
```

React-router 使用了 Compound components（复合组件模式），在这种模式中，组件将被一起使用，它们可以方便的共享一种隐式的状态，比如 Switch , 可以在这里通过 React.children 来控制包裹组件的渲染优先级，而无须使用者去控制。再比如我们经常使用的 `<select />`和 `<option>`, 可以通过 React.children 和 React.cloneElement 来劫持修改子组件，让组件使用者通过更少的 api 来触发更强大的功能。

## 使用

### 路由跳转传参

#### 路由传参

1.  `path: '/test/:type',`
2.  查询参数方式:`<Link to= '/home/article?id=9'>内容管理</Link>`，从 location.search 中接收
3.  对象写法:`<Link to={{ pathname: '/home/article', id:3 }}>内容管理</Link>`，从 location.state 接收
4.  对象写法:`<Link to={{ pathname: '/home/article', state: {id:3 , name:'给我一个div'} }}>内容管理</Link>`，从 location.state 中接收

#### location

1. `props.history.location`，不推荐
2. `props.location`，推荐
3. useHistory()
4. useLocation()

#### 编程式导航的传参

同样的用 location,search,state

1. 直接写到 URL 里

```js
message.success("登录成功", 2, () => {
	//  做跳转动作 到主页中
	history.replace("/home?id=33");
});
// 取
const value = location.search;
```

2. 直接写到 URL 里

```js
message.success("登录成功", 2, () => {
	//  做跳转动作 到主页中
	history.replace("/home", "给我一个div");
});
// 取
const value = location.state;
```

3. 直接写到 URL 里

```js
message.success("登录成功", 2, () => {
	//  做跳转动作 到主页中
	history.replace("/home", { name: "给我一个div", id: 9 });
});
// 取
const { name, id } = location.state;
```

### 获取路由中定义的 params 参数

#### 如：`path: '/test/:type',`

-   useParams

```js
import { useParams } from "react-router-dom";
const FC = () => {
   // ...
   const routeParams = useParams<{ type: string }>(); // {type}要与path中定义的保持一致
   console.log(routeParams.type);
   // ...
}
```

-   this.props.match

```js
const { id } = this.props.match.params; // id = 1
```

#### 添加多个参数:`path: '/myurl/:id/:name',`

-   挨个添加解析：`const { id, name } = this.props.match.params;`
-   一起添加解析：

```js
// 添加
const params = { id: 2, name: "chris" };
this.props.history.push(`/myurl/${JSON.stringify(params)}`);
// 解析
const { manyParams } = this.props.match.params;
const { id, name } = JSON.parse(manyParams);
```

### 获取 url 中定义的参数

如：`myurl?id=1`.

#### props.location

-   推荐 props.location，不要用 props.history.location，因为 props.location 更可靠，history is mutable，如果在生命周期函数中用 this.props.history.location 可能得不到你期望的值，它的值是变化之后的值。

#### 通过 props.location.search 获取参数

跳转 url 时携带参数的方法：

```js
this.props.history.push(`/myurl?id=${id}&name=${name}`);
```

或

```js
// 容易把之前的url中的query params覆盖，因此在跳转的时候，最好先解析原先url中携带的参数，再添加上你的参数：
const { search } = this.props.location;
// 原有的query params
const prevParams = qs.parse(search.replace(/^\?/, ""));
// 将要添加的query params
const params = { id: 1, name: "chris" };

this.props.history.push({
	pathname: "/myurl",
	search: qs.stringify({ ...prevParams, ...params }),
});
```

获取：

```js
const { search } = this.props.location;
const { id, name } = qs.parse(search.replace(/^\?/, ""));
```

同一个 url 不同 query 参数，会触发 componentDidUpdate，不会触发 componentDidMount。

#### props.location.state 获取参数

跳转 url 时携带参数的方法：跳转到该 url（在 url 上看不出变化）!

```js
this.props.history.push({
	pathname: "/myurl",
	state: { fromSource: 1 },
});
```

获取：

```js
const { state = {} } = this.props.location;
const { fromSource } = state;
```

#### useLocation / useHistory

```js
const history = useHistory();
const { location } = history;
console.log("useHistory", history);
// {action:'POP', block:func, createHref:func, go:func, goBack:func, goForward:func, length:x, listen:func, push:func, replace:func }
console.log("useHistory location", location);
// {hash:'', pathname: "/xxx", search: "?id=123", state: {xxx:yyy}  }
const location = useLocation();
console.log("useLocation location", location);
// {hash:'', pathname: "/xxx", search: "?id=123", state: {xxx:yyy}  }
```

#### 对比

1. url params：稳定，参数不易丢失；但如果要带很多参数就麻烦且丑，可用于页面之间。
2. query params：方便优雅；刷新还存在，但参数易丢失或者被覆盖，可用于同一个页面。
3. state: 刷新 url, 参数就没有了，可用于同一个页面。

### Redirect 重定向

```tsx
<Route exact path={getPath("/stock")}>
	<Redirect to={getPath("/stock/backup")} />
</Route>
```

#### 一个综合使用的 hook 例子

```js
import React from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import qs from "qs";

function MyUrl() {
	// 跳转url
	const history = useHistory(); // hook: useHistory

	function changeUrl() {
		history.push({
			pathname: "/myurl/2",
			search: "name=chris",
			state: { fromSource: 1 },
		});
	}

	// 获取match params
	const params = useParams(); // hook: useParams
	const { id } = params;

	// 获取location params
	const location = useLocation(); // hook: useLocation
	const { search, state = {} } = location;
	// 获取location.search中的参数
	const { name } = qs.parse(search.replace(/^\?/, ""));
	// 获取location.state中的参数
	const { fromSource } = state;

	return (
		<div>
			<div>
				myurl id: {id},<br />
				search name: {name},<br />
				state fromSource: {fromSource},<br />
			</div>
			<div onClick={changeUrl}>change url</div>
		</div>
	);
}

export default MyUrl;

// 路由
const route = {
	path: "/myurl/:id",
	component: myUrl,
};
<Route path={route.path} component={route.component} />;
```

## 路由跳转

### 1.WithRouter

0. `import { withRouter } from 'react-router-dom';`
1. 将组件用 `WithRouter` 包裹
2. 在组件内部使用 `props.history.push(path)`

### 2.history

0. `import { createBrowserHistory } from 'history';`
1. `const history = createBrowserHistory();`
2. `history.push(path);`

### history 简介

1. history 是 react-router 的基础库
2. history 整体是对浏览器 api 的二次封装，但是并没有太过深入的封装，仅仅是对每次页面跳转时做了抽象处理，并且加入了额外的监听与特殊的阻止跳转功能。

-   createBrowserHistory 基于浏览器 history 对象最新 api。
-   createHashHistory：基于浏览器 url 的 hash 参数。
-   createMemoryHistory：基于内存栈，不依赖任何平台。

上面三种方法创建的 history 对象在 react-router 中作为三种主要路由的导航器使用：

-   `BrowserRouter` 对应 createBrowserHistory，由 react-router-dom 提供。
-   `HashRouter` 对应 createHashHistory，由 react-router-dom 提供。
-   `MemoryRouter` 对应 createMemoryHistory，由 react-router 提供，主要用于 react-native 等基于内存的路由系统。
-   实际上与 react-native 相对应的包 react-router-native 使用的是 `NativeRouter`，但其实 NativeRouter 就是 MemoryRouter 的简单封装（改了下名字）。
-   在 react-router-dom 中其实还有一种路由 `StaticRouter`，不过是用在 `ssr` 中的，没有依赖 history 库，仅仅是对传入的 props 做了校验而已。`import { StaticRouter } from 'react-router-dom/server';`。
-   在 react-router-dom v6.1.1 时还新增了 `HistoryRouter`，不过该 Router 主要是帮助我们手动传入 history 实例。

3. 总结：
    - web 开发常用：`BrowserRouter`history 模式、`HashRouter`hash 模式
    - 服务端渲染：`StaticRouter`
    - react-native：`MemoryRouter`、`NativeRouter`
    - react-router-dom v6.1.1 新增 `HistoryRouter`

### Router 内部原理

1. Router 组件：包裹整个应用，一个 React 应用只需要使用一次。

2. 两种常用 Router：HashRouter 和 BrowserRouter

-   HashRouter：使用 URL 的哈希值实现

    -   原理：监听 window 的 hashchange 事件来实现的

-   （推荐）BrowserRouter：使用 H5 的 history.pushState() API 实现

    -   原理：监听 window 的 popstate 事件来实现的

## 常用组件简介

web 端一般用 `react-router-dom` 库，这个包提供了三个核心的组件: HashRouter(BrowserRouter), Route, Link。

`import { HashRouter, BrowserRouter, Route, Link } from 'react-router-dom';`

### HashRouter、BrowserRouter

使用 HashRouter/BrowserRouter 包裹整个应用，一个项目中只会有一个 Router.

### Link

使用 Link 指定导航链接，Link 和 NavLink 都能用来做跳转，最终都会被渲染成`<a>`内容`</a>`标签。Link 组件无法展示哪个 link 处于选中的效果，NavLink 组件，一个更特殊的 Link 组件，可以用于指定当前导航高亮。
`<NavLink to="/xxx" activeClassName="active">链接</NavLink>`

### Route

使用 Route 指定路由规则(哪个路径展示哪个组件) ，参考上文的三种形式。

1. 模糊匹配规则

-   只要 pathname 以 path 开头就算匹配成功
-   匹配成功就加载对应组件；
-   整个匹配过程是逐一匹配，一个匹配成功了，并不会停止匹配。

2. 模糊匹配和精确匹配

-   默认是模糊匹配的!!!
-   补充 exact 可以设置成精确匹配

### Switch

1. 用 Switch 组件包裹多个 Route 组件。在 Switch 组件下，不管有多少个 Route 的路由规则匹配成功，都只会渲染第一个匹配的组件！
2. 通过 Switch 组件非常容易的就能实现 404 错误页面的提示，不设置 path 属性，将 404 页对应的路由放在 switch 内部的最后位置。（保底页面）

### Redirect

页面重定向，比如：

1. `<Redirect from="/" exact to="/comment" />`，从 from 重定向到 to。
2. `<Route exact path="/"><Redirect to={'/home'} /></Route>`，第二种写法。
