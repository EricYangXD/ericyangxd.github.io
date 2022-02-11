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

react-router 使用了 history 这个核心库。

### 如何监听 url 的变化 ？

1. 选择方式: history 或 hash

HashRouter 先是从 history 中引用 createBrowserHistory ，然后将 history 和 children 传入到 Router。BrowserHistory 同理。

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

1. Router 渲染的优先级：children > component > render，三种方式互斥，只能使用一种。
2. 不匹配的情况下，只要 children 是函数，也会渲染。
3. component 是使用 createComponent 来创建的， 这会导致不再更新现有组件，而是直接卸载再去挂载一个新的组件。如果是使用匿名函数来传入 component ，每次 render 的时候，这个 props 都不同，会导致重新渲染挂载组件，导致性能特别差。因此，当使用匿名函数的渲染时，请使用 render 或 children 。

```js
// 不要这么使用
<Route path="/user/:username" component={() => <User />} />
```

React-router 使用了 Compound components（复合组件模式），在这种模式中，组件将被一起使用，它们可以方便的共享一种隐式的状态，比如 Switch , 可以在这里通过 React.children 来控制包裹组件的渲染优先级，而无须使用者去控制。再比如我们经常使用的 `<select />`和 `<option>`, 可以通过 React.children 和 React.cloneElement 来劫持修改子组件，让组件使用者通过更少的 api 来触发更强大的功能。

## 使用
