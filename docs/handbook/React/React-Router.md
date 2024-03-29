---
title: React-Router
author: EricYangXD
date: "2022-02-11"
---

## 概括

先用最简单的话来概括一下 `React-Router` 到底做了什么？

- 本质上， `React-Router` 就是在页面 URL 发生变化的时候，通过我们写的 path 去匹配，然后渲染对应的组件。

- 核心库是 `react-router`。 `react-router-dom` 是在浏览器中使用的，`react-router-native` 是在 rn 中使用的。

### 整体流程

1. 选择 browserhistory 或 hashhistory 中 listen 监听 URL 的变化；
2. `<Router />`通过 Provider 注入对应的 location；
3. `<Route />`根据优先级拿到匹配后的值；
4. 根据不同方式渲染组件；
5. 用户点击`<Link />`，触发 history.push 或 history.replace；
6. 触发 history.listen()，回到 1；

正常情况下，当 URL 发生变化时，浏览器会像服务端发送请求，但使用以下 2 种办法不会向服务端发送请求：

- 基于 hash
- 基于 history

react-router 使用了 `history` 这个核心库。注意，当使用 history 模式时，生产环境刷新页面会 404。

- Q:为什么开发环境中，使用 history 模式时，刷新浏览器仍然可以正常访问页面？
- A:因为通常使用脚手架搭建项目的时候，脚手架里默认已经把`webpack-dev-server`里的`historyApiFallback.rewrites`做了相应的配置，使得浏览器的请求可以找到对应的配置好的页面。如果设置`historyApiFallback=false`而不配置 rewrites，那么浏览器会把我们这个当做是一次 get 请求，如果此时后端也没有对应的接口，那么就会报错：`Cannot get ...`。

### 如何监听 url 的变化

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

### 如何匹配 path，按什么规则

可以分两部分理解:

- 是否匹配
- 渲染组件

1. 是否匹配

computedMatch 是使用 Switch 包裹的子组件才有的值，Switch 的作用是从上到下开始渲染，只要匹配到一个，其他的就不再继续匹配。所以这里会先判断 computedMatch。

需要注意的重要一点是 `<Route path>` 匹配 URL 的开头，而不是整个内容。因此 `<Route path="/">` 将始终与 URL 匹配。因此，我们通常将此 `<Route>` 放在 `<Switch>` 的最后。另一种可能的解决方案是使用匹配整个 URL 的 `<Route exact path="/">`。

`useRouteMatch`钩子的匹配规则和`<Route path>`是一样的，返回匹配到的`<Route path>`的 props 或者 null。

不使用`<Switch>`包裹的`<Route>`匹配 URL 的开头，默认是会一直匹配，把匹配到的 Route 都渲染出来！比如有两个`/about`，分别对应不同的组件，那么就会把这俩组件都渲染出来!

```js
<Router>
	<Route path="/">
		<Home />
	</Route>
	<Route path="/about">
		<About />
	</Route>
	<Route path="/dashboard">
		<Dashboard />
	</Route>
</Router>
```

如上代码中：如果 url 是`/`，此时只渲染`<Home />`，如果是`/about`，则渲染`<Home />`和`<About />`两个组件的内容。

匹配解析 path ，这里使用了第三方库 `path-to-regexp`。

### 组件渲染方式

从文档来看，它支持三种方式的渲染，如下：

```js
// 1. children 方式
<Route exact path="/">
   <HomePage />
</Route>
// 或：
<Route path="/:id" children={<Child />} />

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
// 不要这么使用!!!
<Route path="/user/:username" component={() => <User />} />
```

React-router 使用了 Compound components（复合组件模式），在这种模式中，组件将被一起使用，它们可以方便的共享一种隐式的状态，比如 Switch , 可以在这里通过 React.children 来控制包裹组件的渲染优先级，而无须使用者去控制。再比如我们经常使用的 `<select />`和 `<option>`, 可以通过 React.children 和 React.cloneElement 来劫持修改子组件，让组件使用者通过更少的 api 来触发更强大的功能。

## 使用

examples

### 路由跳转传参

路由跳转传参

#### 路由传参

```js
1.  路径：`path: '/test/:type'`；
2.  查询参数方式：`<Link to= '/home/article?id=9' />`，从 `location.search` 中接收；
3.  对象写法：`<Link to={{ pathname: '/home/article', id:3 }} />`，从 `location.state` 接收；
4.  对象写法：`<Link to={{ pathname: '/home/article', state: {id:3, name:'eric'} }} />`，从 `location.state` 中接收；
```

#### location

1. `props.history.location`，不推荐
2. `props.location`，推荐
3. useHistory()
4. useLocation()

#### 编程式导航的传参

同样的用 location，search，state。

1. 直接写到 URL 里

```js
message.success("登录成功", 2, () => {
	//  做跳转动作 到主页中
	history.replace("/home?id=33");
});
// 取
const value = location.search;
```

2. history.replace 单个参数

```js
message.success("登录成功", 2, () => {
	//  做跳转动作 到主页中
	history.replace("/home", "给我一个div");
});
// 取
const value = location.state;
```

3. history.replace 多个参数以对象形式

```js
message.success("登录成功", 2, () => {
	//  做跳转动作 到主页中
	history.replace("/home", { name: "给我一个div", id: 9 });
});
// 取
const { name, id } = location.state;
```

### 获取路由中定义的 params 参数

path 中的参数

#### 添加单个参数

例如：`path: '/test/:type'`。

- useParams

```js
import { useParams } from "react-router-dom";
const FC = () => {
   // ...
   const routeParams = useParams<{ type: string }>(); // {type}要与path中定义的保持一致
   console.log(routeParams.type);
   // ...
}
```

- this.props.match

```js
const { id } = this.props.match.params; // id = 1
```

#### 添加多个参数

例如：`path: '/myurl/:id/:name'`。

- 挨个添加解析：`const { id, name } = this.props.match.params;`
- 以对象的形式，一起添加解析：

```js
// 添加
const params = { id: 2, name: "chris" };
this.props.history.push(`/myurl/${JSON.stringify(params)}`);
// 解析
const { manyParams } = this.props.match.params;
const { id, name } = JSON.parse(manyParams);
```

### 获取 url 中定义的参数

例如：`https://baidu.com/myurl?id=1`。

#### props.location

- 推荐 props.location，不要用 props.history.location，因为 props.location 更可靠，history is mutable，如果在生命周期函数中用 this.props.history.location 可能得不到你期望的值，它的值是变化之后的值。

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
3. state: 刷新 url， 参数就没有了，可用于同一个页面。

### Redirect 重定向

```js
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

1. history 是 `react-router` 的基础库
2. history 整体是对浏览器 api 的二次封装，但是并没有太过深入的封装，仅仅是对每次页面跳转时做了抽象处理，并且加入了额外的监听与特殊的阻止跳转功能。

- createBrowserHistory 基于浏览器 history 对象最新 api。
- createHashHistory：基于浏览器 url 的 hash 参数。
- createMemoryHistory：基于内存栈，不依赖任何平台。

上面三种方法创建的 history 对象在 `react-router` 中作为三种主要路由的导航器使用：

- `BrowserRouter` 对应 createBrowserHistory，由 `react-router-dom` 提供。
- `HashRouter` 对应 createHashHistory，由 `react-router-dom` 提供。
- `MemoryRouter` 对应 createMemoryHistory，由 `react-router` 提供，主要用于 `react-native` 等基于内存的路由系统。
- 实际上与 `react-native` 相对应的包 `react-router-native` 使用的是 `NativeRouter`，但其实 NativeRouter 就是 MemoryRouter 的简单封装（改了下名字）。
- 在 `react-router-dom` 中其实还有一种路由 `StaticRouter`，不过是用在 `ssr` 中的，没有依赖 history 库，仅仅是对传入的 props 做了校验而已。`import { StaticRouter } from 'react-router-dom/server';`。
- 在 `react-router-dom` v6.1.1 时还新增了 `HistoryRouter`，不过该 Router 主要是帮助我们手动传入 history 实例。

3. 总结：
   - web 开发常用：`BrowserRouter`history 模式、`HashRouter`hash 模式
   - 服务端渲染：`StaticRouter`
   - `react-native`：`MemoryRouter`、`NativeRouter`
   - `react-router-dom` v6.1.1 新增 `HistoryRouter`

### Router 内部原理

1. Router 组件：包裹整个应用，一个 React 应用只需要使用一次。

2. 两种常用 Router：HashRouter 和 BrowserRouter

- HashRouter：使用 URL 的哈希值`location.hash`实现

  - 原理：监听 window 的 hashchange 事件来实现的：`window.addEventListener('hashchange',cb)`或`window.onhashchange = cb`。

- （推荐）BrowserRouter：使用 H5 的 `history.pushState()`、`history.replaceState()` API 实现

  - 原理：监听 window 的 popstate 事件来实现的：`window.addEventListener('popstate',cb)`或`window.onpopstate = cb`。

- 需要注意的是调用 history.pushState()或 history.replaceState()不会触发 popstate 事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在 Javascript 代码中调用 history.back()或者 history.forward()方法）。
- 不同的浏览器在加载页面时处理 popstate 事件的形式存在差异。页面加载时 Chrome 和 Safari 通常会触发(emit )popstate 事件，但 Firefox 则不会。

## 常用组件简介

web 端一般用 `react-router-dom` 库，这个包提供了三个核心的组件: `HashRouter(BrowserRouter)`, `Route`, `Link`。

例如：`import { HashRouter, BrowserRouter, Route, Link } from 'react-router-dom';`。

### HashRouter、BrowserRouter、MemoryRouter

1. 使用 HashRouter/BrowserRouter 包裹整个应用，一个项目中只会有一个 Router.
2. `<BrowserRouter>` 使用 HTML5 history API（pushState、replaceState 和 popstate 事件）来保持 UI 与 URL 同步。
3. `<BrowserRouter>`:
   - basename：为全部 location 设置 base url。
   - getUserConfirmation：用于确认导航的功能。默认使用 window.confirm。
   - forceRefresh：页面切换时强制刷新。
   - keyLength：The length of location.key. Defaults to 6.
   - children：The child elements to render.
4. `<HashRouter>` 使用 URL 的 hash 部分（即 window.location.hash）来保持 UI 与 URL 同步。**不支持 location.key 或 location.state**!
   - basename：为全部 location 设置 base url。
   - getUserConfirmation：用于确认导航的功能。默认使用 window.confirm。
   - hashType: "slash" - "#/sunshine" | "noslash" - "#sunshine" | "hashbang" - "#!/sunshine"，默认"slash"。
   - children：A single child element to render.
5. `<MemoryRouter>`将你的“URL”历史保存在内存中（不读取或写入地址栏）。在测试和非浏览器环境（如 React Native）中很有用。

### Router

所有路由组件的通用低级接口。通常，应用程序将使用高级路由器之一：

1. `<BrowserRouter>`
2. `<HashRouter>`
3. `<MemoryRouter>`
4. `<NativeRouter>`
5. `<StaticRouter>`：一个永远不会改变位置的 `<Router>`。用于 SSR。

- history: object，A history object to use for navigation.
- children: node，A child element to render.

使用低级 `<Router>` 的最常见用例是将自定义 history 与 Redux 或 Mobx 等状态管理库同步。

### Link

使用 Link 指定导航链接，Link 和 NavLink 都能用来做跳转，最终都会被渲染成`<a>`内容`</a>`标签。Link 组件无法展示哪个 link 处于选中的效果，NavLink 组件，一个更特殊的 Link 组件，可以用于指定当前导航高亮。

例如：`<NavLink to="/xxx" activeClassName="active">链接</NavLink>`。

1. to：string | object:{pathname,search,hash,state} | function。
2. replace: boolean，如果为 true，单击链接将替换历史堆栈中的当前条目，而不是添加新条目。
3. innerRef: function，允许访问组件的底层 ref。
4. innerRef: RefObject，使用 React.createRef 获取组件的底层 ref。
5. component: React.Component。
6. others：You can also pass props you’d like to be on the `<a>` such as a title, id, className, etc.

### NavLink

1. className: string | func，在 React Router v6 中，activeClassName 将被删除，您应该使用函数 className 将类名应用于活动或非活动 NavLink 组件。
2. activeClassName: string，The default given class is active.V6 已移除。
3. style: object | func，如果使用函数样式，则将链接的活动状态 isActive 作为参数传递。
4. activeStyle: object，V6 已移除。
5. exact: bool
6. strict: bool，如果为 true，则在确定位置是否与当前 URL 匹配时，将考虑位置路径名上的尾部斜杠。
7. isActive: func，添加额外逻辑以确定链接是否处于活动状态的函数。如果您想要做的不仅仅是验证链接的路径名是否与当前 URL 的路径名匹配，则应该使用此选项。
8. location: object，isActive 比较当前历史 location（通常是当前浏览器 URL）。为了与不同的 location 进行比较，可以传递一个 location。

### Route

使用 Route 指定路由规则(哪个路径展示哪个组件) ，参考上文的三种形式。

1. 模糊匹配规则

- 只要 pathname 以 path 开头就算匹配成功
- 匹配成功就加载对应组件；
- 整个匹配过程是逐一匹配，一个匹配成功了，并不会停止匹配。

2. 模糊匹配和精确匹配

- 默认是模糊匹配的!!!
- 补充 exact 可以设置成精确匹配

3. Route render methods：

- `<Route component>`
- `<Route render>`
- `<Route children>` function

4. Route props：

- match
- location
- history

5. exact: bool

| path | location.pathname | exact | matches? |
| :--- | :---------------- | :---- | :------- |
| /one | /one/two          | true  | no       |
| /one | /one/two          | false | yes      |

6. strict: bool

| path  | location.pathname | strict | matches? |
| :---- | :---------------- | :----- | :------- |
| /one/ | /one              | true   | no       |
| /one/ | /one/             | true   | yes      |
| /one/ | /one/two          | true   | yes      |

7. location: object，为了与不同的 location 进行比较，可以传递一个 location。
8. sensitive: bool，大小写敏感。

### Switch

1. 用 Switch 组件包裹多个 Route 组件。在 Switch 组件下，不管有多少个 Route 的路由规则匹配成功，都只会渲染第一个匹配的组件！
2. 通过 Switch 组件非常容易的就能实现 404 错误页面的提示，不设置 path 属性，将 404 页对应的路由放在 switch 内部的最后位置。（保底页面）
3. location: object，用于匹配子元素而不是当前历史 location（通常是当前浏览器 URL）的 location 对象。

### Redirect

页面重定向，比如：
`

1. 从 from 重定向到 to。to 中使用的所有 URL 参数必须由 from 覆盖。

```js
<Redirect from="/users/:id" to="/users/profile/:id" />
```

2. 第二种写法。通过重定向到组件中的 this.props.location.state 访问状态对象。

```js
<Redirect
	to={{
		pathname: "/home",
		search: "?utm=your+face",
		state: { referrer: currentLocation },
	}}
/>
```

3. push: bool，当为 true 时，重定向会将新条目推送到历史记录中，而不是替换当前条目。
4. from: string，所有匹配的 URL 参数都提供给 to 中的模式。必须包含在 to 中使用的所有参数。to 未使用的附加参数将被忽略。
5. 这只能用于在 `<Switch>` 内渲染 `<Redirect>` 时匹配 location。
6. exact: bool，相当于 Route.exact。
7. strict: bool，相当于 Route.strict。
8. sensitive: bool，相当于 Route.sensitive。

### generatePath

generatePath 函数可用于生成路由的 URL。在内部使用了 path-to-regexp 库。将路径编译为正则表达式的结果被缓存，因此生成具有相同模式的多个路径没有开销。

1. pattern: string
2. params: object

```js
import { generatePath } from "react-router";

generatePath("/user/:id/:entity(posts|comments)", {
	id: 1,
	entity: "posts",
});
// Will return /user/1/posts
```

### history

The history object is mutable. Therefore it is recommended to access the location from the render props of `<Route>`, not from history.location.

history 对象是可变的。因此建议从 `<Route>` 的 render props 访问 location，而不是从 history.location。

history 对象有如下属性：

1. length: The number of entries in the history stack
2. action: PUSH, REPLACE, or POP
3. location: The current location. {pathname, search, hash, state}
4. `push(path, [state])`
5. `replace(path, [state])`
6. `go(n)`
7. `goBack()`
8. `goForward() `
9. `block(prompt)`

### location

location 代表应用程序现在的位置、您希望它去的地方，甚至是它曾经的位置。location 对象永远不会发生变化。可以通过如下方式获取 location：

1. Route component as this.props.location
2. Route render as ({ location }) => ()
3. Route children as ({ location }) => ()
4. withRouter as this.props.location
5. useLocation

下面这几个地方不止可以传 string，还可以传 location 对象：

1. Web Link to
2. Native Link to
3. Redirect to
4. history.push
5. history.replace

也可以传给组件：

1. Route
2. Switch

### match

match 对象包含有关 `<Route path>` 如何匹配 URL 的信息: {params, isExact, path, url}.

如果 Route 没有路径，因此总是匹配，您将获得最接近的父匹配。 withRouter 也是如此。

可以访问不同位置的 match 对象：

- Route component as this.props.match
- Route render as ({ match }) => ()
- Route children as ({ match }) => ()
- withRouter as this.props.match
- matchPath as the return value
- useRouteMatch as the return value

“解析” URL 的默认方法是将 match.url 字符串连接到“相对”路径。无路径 `<Route>`从其父级继承其匹配对象。如果他们的父匹配为空，那么他们的匹配也将为空。

即使路由的路径与当前位置不匹配，使用 children 属性的 `<Route>` 也会调用其子函数。

### matchPath

这使您可以使用与 `<Route>` 相同的匹配代码，除了正常的渲染周期之外。例如在服务器上渲染之前收集数据依赖项。返回一个匹配到的对象或者 null。

```js
import { matchPath } from "react-router";

const match = matchPath("/users/123", {
	path: "/users/:id", // like /users/:id; either a single string or an array of strings
	exact: true, // optional, defaults to false
	strict: false, // optional, defaults to false
});

//  {
//    isExact: true
//    params: {
//        id: "2"
//    }
//    path: "/users/:id"
//    url: "/users/2"
//  }
```

### withRouter

您可以通过 withRouter **高阶组件**访问 history 对象的属性和最近的 `<Route>` 匹配项 match。withRouter 将在渲染时将更新的 match、location 和 history 属性传递给被包裹的组件。

withRouter 不像 React Redux 的 connect 那样订阅 location 更改来进行状态更改。相反，在 location 更改从 `<Router>` 组件传播出去后重新渲染。这意味着 withRouter 不会在路由转换时重新渲染，除非其父组件重新渲染。

- Component.WrappedComponent: 除其他外，被包装的组件作为返回组件上的静态属性 WrappedComponent 暴露出来，可用于单独测试组件。
- wrappedComponentRef: func：将作为 ref 属性传递给包装组件的函数。
