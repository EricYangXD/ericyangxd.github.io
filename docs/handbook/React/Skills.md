---
title: 记录 React 开发时遇到的一些问题的解决方法和想法
author: EricYangXD
date: "2021-12-29"
---

## 快速启动项目

-   参考[这里 webpack](https://github.com/EricYangXD/LearnReact)
-   参考[这里 vite](https://github.com/EricYangXD/vite-pro)

## key

-   Q:为什么要有 key？

-   A:diff 的时候可以直接对比 key，复用一些未更新的 node，提高效率。。。

-   我遇到的场景：页面左侧是菜单，右侧是菜单对应的 table，当菜单 menuItem 变了那么对应的 tableContent 也要展示出来，而 tableContent 变了时要保存，如果未保存就去切换菜单，那么需要给出提示，点击保存/取消之后才能切换。

-   问题来了：右侧 table 单独抽成一个组件（因为别的地方也要用），然后抛出 contentChanged，content 等字段给左侧/全局，用于切换角色时判断 table 内容有无变化，而 table 的初始值是不一定相同的，那么我需要这个 table 组件自己去维护自己的状态，比如初始化的时候 contentChanged=false，content=接口返回的数据/[]，而这个 table 组件又需要接收 menuItem 来获取对应的数据，这时，如果不给 table 组件加一个 key={menuItem}的话，那么我切换左侧 menuItem 之后，组件抛出来的 content 就不会被重新初始化，那么我此时去保存这个 tableContent 就会出现 bug——明明 table 里是空的，而保存之后 table 里反而有了数据，这数据还是上一个 menuItem 对应的数据。而解决这个 bug 只需要给 table 组件加个 key，让它跟 menuItem 绑定，menuItem 改变时 table 组件会销毁重新创建，那么 content 自然也会跟着初始化。

## How to get the previous props or state?

-   example:

```js
// 1st.
function Counter() {
	const [count, setCount] = useState(0);
	const prevCount = usePrevious(count);
	return (
		<h1>
			Now: {count}, before: {prevCount}
		</h1>
	);
}

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}
```

```js
// 2nd.
const prevSearchText = useRef();

useEffect(() => {
	return (function (searchText) {
		return function () {
			prevSearchText.current = searchText;
		};
	})(props.searchText);
}, [props.searchText]);
```

## 生命周期

-   虽说已经不太提倡用这玩意了，but 还是挺有用的：组件的生命周期，指的是一个 React 组件从挂载，更新，销毁过程中会执行的生命钩子函数。

```js
class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = { date: new Date() };
	}

	componentWillMount() {}

	componentDidMount() {}

	componentWillUpdate(nextProps, nextState) {}

	componentWillReceiveProps(nextProps) {}

	componentDidUpdate(prevProps, prevState) {}

	shouldComponentUpdate(nextProps, nextState) {}

	componentWillUnmount() {}

	render() {
		return (
			<div>
				<h1>Hello, world!</h1>
				<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
			</div>
		);
	}
}
```

-   constructor，顾名思义，组件的构造函数。一般会在这里进行 state 的初始化，事件的绑定等等

-   componentWillMount，是当组件在进行挂载操作前，执行的函数，一般紧跟着 constructor 函数后执行

-   componentDidMount，是当组件挂载在 dom 节点后执行。一般会在这里执行一些异步数据的拉取等动作

-   shouldComponentUpdate，返回 false 时，组件将不会进行更新，可用于渲染优化

-   componentWillReceiveProps，当组件收到新的 props 时会执行的函数，传入的参数就是 nextProps ，你可以在这里根据新的 props 来执行一些相关的操作，例如某些功能初始化等

-   componentWillUpdate，当组件在进行更新之前，会执行的函数

-   componentDidUpdate，当组件完成更新时，会执行的函数，传入两个参数是 prevProps 、prevState

-   componentWillUnmount，当组件准备销毁时执行。在这里一般可以执行一些回收的工作，例如 clearInterval(this.timer) 这种对定时器的回收操作

-   官方 16.3/16.4 版本[生命周期图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

-   简单易懂版

![img](../../assets/react-lifecycle.png "React生命周期")

-   当首次挂载组件时，按顺序执行 getDefaultProps、getInitialState、componentWillMount、render 和 componentDidMount。
-   当卸载组件时，执行 componentWillUnmount。
-   当重新挂载组件时，此时按顺序执行 getInitialState、componentWillMount、render 和 componentDidMount，但并不执行 getDefaultProps。
-   当再次渲染组件时，组件接受到更新状态，此时按顺序执行 componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render 和 componentDidUpdate。
-   当使用 ES6 classes 构建 React 组件时，static defaultProps = {} 其实就是调用内部的 getDefaultProps 方法，constructor 中的 this.state = {} 其实就是调用内部的 getInitialState 方法。

-   补充&更新

1. getDerivedStateFromProps(nextProps, prevState)
   代替 componentWillReceiveProps()。
   老版本中的 componentWillReceiveProps()方法判断前后两个 props 是否相同，如果不同再将新的 props 更新到相应的 state 上去。这样做一来会破坏 state 数据的单一数据源，导致组件状态变得不可预测，另一方面也会增加组件的重绘次数。

这两者最大的不同就是:
在 componentWillReceiveProps 中，我们一般会做以下两件事，一是根据 props 来更新 state，二是触发一些回调，如动画或页面跳转等。

在老版本的 React 中，这两件事我们都需要在 componentWillReceiveProps 中去做。
而在新版本中，官方将更新 state 与触发回调重新分配到了 getDerivedStateFromProps 与 componentDidUpdate 中，使得组件整体的更新逻辑更为清晰。而且在 getDerivedStateFromProps 中还禁止了组件去访问 this.props，强制让开发者去比较 nextProps 与 prevState 中的值，以确保当开发者用到 getDerivedStateFromProps 这个生命周期函数时，就是在根据当前的 props 来更新组件的 state，而不是去做其他一些让组件自身状态变得更加不可预测的事情。

2. getSnapshotBeforeUpdate(prevProps, prevState)
   代替 componentWillUpdate。
   常见的 componentWillUpdate 的用例是在组件更新前，读取当前某个 DOM 元素的状态，并在 componentDidUpdate 中进行相应的处理。
   这两者的区别在于：

在 React 开启异步渲染模式后，在 render 阶段读取到的 DOM 元素状态并不总是和 commit 阶段相同，这就导致在
componentDidUpdate 中使用 componentWillUpdate 中读取到的 DOM 元素状态是不安全的，因为这时的值很有可能已经失效了。
getSnapshotBeforeUpdate 会在最终的 render 之前被调用，也就是说在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致的。
此生命周期返回的任何值都将作为参数传递给 componentDidUpdate（）。

## React15 中的生命周期

1. 阶段一：MOUNTING

-   mountComponent 负责管理生命周期中的 getInitialState、componentWillMount、render 和 componentDidMount。
-   由于 getDefaultProps 是通过构造函数进行管理的，所以也是整个生命周期中最先开始执行的。而 mountComponent 只能望洋兴叹，无法调用到 getDefaultProps。这就解释了为何 getDefault-Props 只执行一次。
-   在 componentWillMount 中调用 setState 方法，是不会触发 re-render 的，而是会进行 state 合并，因此 componentWillMount 中的 this.state 并不是最新的，在 render 中才可以获取更新后的 this.state。

2. 阶段二：RECEIVE_PROPS

-   updateComponent 负责管理生命周期中的 componentWillReceiveProps、shouldComponent-Update、componentWillUpdate、render 和 componentDidUpdate。
-   在 componentWillReceiveProps 中调用 setState，是不会触发 re-render 的，而是会进行 state 合并。且在 componentWillReceiveProps、shouldComponentUpdate 和 componentWillUpdate 中也还是无法获取到更新后的 this.state，即此时访问的 this.state 仍然是未更新的数据，因此只有在 render 和 componentDidUpdate 中才能获取到更新后的 this.state。
-   调用 shouldComponentUpdate 判断是否需要进行组件更新，如果存在 componentWillUpdate，则执行。
-   禁止在 shouldComponentUpdate 和 componentWillUpdate 中调用 setState，这会造成循环调用，直至耗光浏览器内存后崩溃。

3. 阶段三：UNMOUNTING

-   unmountComponent 负责管理生命周期中的 componentWillUnmount。
-   如果存在 componentWillUnmount，则执行并重置所有相关参数、更新队列以及更新状态，如果此时在 componentWillUnmount 中调用 setState，是不会触发 re-render 的，这是因为所有更新队列和更新状态都被重置为 null，并清除了公共类，完成了组件卸载操作。

## React Router

-   路由包括：react-router-dom

-   react-router-dom 导出的组件：
-   HashRouter 和 BrowserRouter 根容器
-   Switch 精准匹配
-   Route 路由规则
-   Link 声明式跳转
-   NavLink 声明式跳转 + 样式
-   Redirect 重定向
-   withRouter 高阶组件，将组件变成路由组件

## constate 轻量级状态管理库

-   basic usage

```js
import React, { useState } from "react";
import constate from "constate";

// 1️⃣ Create a custom hook as usual
function useCounter() {
	const [count, setCount] = useState(0);
	const increment = () => setCount((prevCount) => prevCount + 1);
	return { count, increment };
}

// 2️⃣ Wrap your hook with the constate factory
const [CounterProvider, useCounterContext] = constate(useCounter);

function Button() {
	// 3️⃣ Use context instead of custom hook
	const { increment } = useCounterContext();
	return <button onClick={increment}>+</button>;
}

function Count() {
	// 4️⃣ Use context in other components
	const { count } = useCounterContext();
	return <span>{count}</span>;
}

function App() {
	// 5️⃣ Wrap your components with Provider
	return (
		<CounterProvider>
			<Count />
			<Button />
		</CounterProvider>
	);
}
```

## 一种没见过的写法。。。

```js
const Parent = () => {
  const [items, setItems] = useState([
    { value: '' },
    { value: '' },
    { value: '' }
  ])
  return (
    <div>
      {items.map((item, index) => (
        <Item
          key={index}
          id={index}
          value={item.value}
          onChange={(id, value) =>
            setState(state.map((item, index) => {
              return index !== id ? item : { value: value }
          })}
          />
      )}
    </div>
  )
}
```

-   Anonymous functions will always get a new reference on every render. 匿名函数总是会在每次渲染时获得新的引用.
-   This means that onChange property will change every time Parent renders. To prevent that, we need to memoize it with useCallback. 这意味着每次 Parent 渲染时 onChange 属性都会改变。为了防止这种情况，我们需要使用 useCallback 记住它。
-   React does not care whether “props changed” - it will render child components unconditionally just because the parent rendered!React 并不关心“props 是否改变”——它会无条件地渲染子组件，因为父组件渲染了！
-   If you don’t want a component to re-render when its parent renders, wrap it with memo. After that, the component indeed will only re-render when its props change.如果您不希望组件在其父级渲染时重新渲染，请使用 memo 包装它。之后，该组件确实只会在其 props 更改时重新渲染。
-   有时使用 useCallback 来对函数做一个缓存，但是由于对 state 的依赖，导致这个缓存并不生效/效果不及预期，那么需要停止对这个 state 的依赖，此时可以使用 functional state update--函数状态更新？例如：

```js
// 失效：items更新会导致所有的list item都重新渲染
const Parent = () => {
  ...

  const onChange = useCallback((id, value) => {
    setItems(items.map((item, index) => {
      return index !== id ? item : { value: value }
    }))
  }, [items])

  return (
    <div>
      {items.map((item, index) => (
        <Item
          key={index}
          id={index}
          value={item.value}
          onChange={onChange}
          />
      )}
    </div>)
}

// 有效
const onChange = useCallback((id, value) => {
    setItems(prevItems => prevItems.map((item, index) => {
        return index !== id ? item : { value: value }
    }))
}, []) // No dependencies

```

## setState()是异步还是同步？

-   1. setState 只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。
-   2. setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的 callback 拿到更新后的结果。
-   3. setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState，setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。
-   4. useEffect hooks 中，useState 都是异步的。

-   所以严格说是同步的代码, 毕竟都在一个 eventloop 里, 只不过 setstate 里的参数/回调被延迟执行到下面代码执行完才执行。

## 3 ways to cause an infinite loop in React

-   Updating the state inside the render. 比如：在 class 的 render()函数 或 函数组件的 return 之外。Fix: 使用 useEffect 包裹。
-   Infinite loop in useEffect. 比如：更新的 state 被放到依赖数组里。Fix: 使用 setSate(prev=>prev+1),即使用一个函数接收 prevState，然后进行更新。
-   Incorrectly set event handlers. 比如：新手常犯错误：onClick 事件应该接收一个闭包函数，而不是直接传入函数执行后的结果。

## 合成事件

-   react 中的事件是合成事件，会统一绑定在最外层；为什么是合成事件？--因为用了虚拟 DOM。

-   Virtual DOM 在内存中是以对象的形式存在的，如果想要在这些对象上添加事件，就会非常简单。

-   React 基于 Virtual DOM 实现了一个 SyntheticEvent （合成事件）层，我们所定义的事件处理器会接收到一个 SyntheticEvent 对象的实例，它完全符合 W3C 标准，不会存在任何 IE 标准的兼容性问题。并且与原生的浏览器事件一样拥有同样的接口，同样支持事件的冒泡机制，我们可以使用 stopPropagation() 和 preventDefault() 来中断它。所有事件都自动绑定到最外层上。如果需要访问原生事件对象，可以使用 nativeEvent 属性。

-   例如：对于 a 标签要取消他的默认跳转行为时，在原生 html 中：return false；在 React 中要：e.preventDefault()；

## 获取屏幕宽度的 hook

```js
import React, { useEffect, useState } from "react";

const useWindowWidth = () => {
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth);

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return width;
};
export default useWindowWidth;
```

## useLayoutEffect

-   useLayoutEffect 与 useEffect 使用方式是完全一致的，useLayoutEffect 的区别在于它会在所有的 DOM 变更之后同步调用 effect。
-   可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前， useLayoutEffect 内部的更新计划将被同步刷新。
-   通常对于一些通过 JS 计算的布局，如果你想减少 useEffect 带来的「页面抖动」,你可以考虑使用 useLayoutEffect 来代替它。
-   需要注意 useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的。
-   useLayoutEffect 内部的更新计划将会在浏览器执行下一次绘制前被同步执行。
-   本质上还是 useLayoutEffect 的实现是基于 micro ，而 Effect 是基于 macro ，所以 useLayoutEffect 会在页面更新前去执行。
-   如果你使用服务端渲染，请记住，无论 useLayoutEffect 还是 useEffect 都无法在 Javascript 代码加载完成之前执行。这就是为什么在服务端渲染组件中引入 useLayoutEffect 代码时会触发 React 告警。要解决这个问题，需要将代码逻辑移至 useEffect 中（如果首次渲染不需要这段逻辑的情况下），或是将该组件延迟到客户端渲染完成后再显示（如果直到 useLayoutEffect 执行之前 HTML 都显示错乱的情况下）。
-   与 useEffect 的区别之一：与 componentDidMount、componentDidUpdate 不同的是，传给 useEffect 的函数会在浏览器完成布局与绘制之后，在一个延迟事件中被调用。虽然 useEffect 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。在开始新的更新前，React 总会先清除上一轮渲染的 effect。

## useDebugValue

useDebugValue 可用于在 React 开发者工具中显示自定义 hook 的标签，它接受两个参数:

-   value 为我们要重点关注的变量，该参数表示在 DevTools 中显示的 hook 标志。
-   fn 表明如何格式化变量 value , 该函数只有在 Hook 被检查时才会被调用。它接受 debug 值作为参数，并且会返回一个格式化的显示值。

-   useDebugValue 应该在自定义 hook 中使用，如果直接在组件内使用是无效的。

当我们自定义一些 Hook 时，可以通过 useDebugValue 配合 React DevTools 快速定位我们自己定义的 Hook。

例：直接写到自定义 hook 里即可，

```tsx
import { useDebugValue, useState } from "react";

function useName() {
	const [state] = useState("xxx");
	useDebugValue("xxx");
	return state;
}

function App() {
	const name = useName();
	return <div>{name}</div>;
}
```

## React 常用方法及周边

-   [React 总结](../../assets/react-zj.jpg)

## React.createRef

`React.createRef` 创建一个能够通过 ref 属性附加到 React 元素的 ref。

```jsx
class MyComponent extends React.Component {
	constructor(props) {
		super(props);

		this.inputRef = React.createRef();
	}

	render() {
		return <input type="text" ref={this.inputRef} />;
	}

	componentDidMount() {
		this.inputRef.current.focus();
	}
}
```

## React.forwardRef

`React.forwardRef` 会创建一个 React 组件，这个组件能够将其接收到的 ref 属性转发到其组件树下的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

-   转发 refs 到 DOM 组件
-   在高阶组件中转发 refs

`React.forwardRef` 接受渲染函数作为参数。React 将使用 props 和 ref 作为参数来调用此函数。此函数应返回 React 节点。

### 转发 refs 到 DOM 组件

```jsx
// 1. 使用React.forwardRef相当于高阶函数，包裹FancyButton组件后，FancyButton组件可以接受到第二个参数ref，第一个参数默认是props；
const FancyButton = React.forwardRef((props, ref) => (
	// 2. 在FancyButton的button组件中可以使用传入的ref，即实现了转发 refs 到 DOM 组件中；
	<button ref={ref} className="FancyButton">
		{props.children}
	</button>
));

// 3. You can now get a ref directly to the DOM button:
const ref = React.createRef();
// 4. 此时当 React 附加了 ref 属性之后，ref.current 将直接指向 <button> DOM 元素实例。
<FancyButton ref={ref}>Click me!</FancyButton>;
```

### 在高阶组件中转发 refs

在高阶组件中转发 refs，有一点需要注意：refs 将不会透传下去。这是因为 ref 不是 prop 属性。就像 key 一样，其被 React 进行了特殊处理。如果你对 HOC 添加 ref，该 ref 将引用最外层的容器组件，而不是被包裹的组件。

幸运的是，我们可以使用 React.forwardRef API 明确地将 refs 转发到内部的 FancyButton 组件。React.forwardRef 接受一个渲染函数，其接收 props 和 ref 参数并返回一个 React 节点。例如：

```jsx
function logProps(Component) {
	class LogProps extends React.Component {
		componentDidUpdate(prevProps) {
			console.log("old props:", prevProps);
			console.log("new props:", this.props);
		}
		render() {
			const { forwardedRef, ...rest } = this.props;
			// 将自定义的 prop 属性 “forwardedRef” 定义为 ref
			return <Component ref={forwardedRef} {...rest} />;
		}
	}
	// 注意 React.forwardRef 回调的第二个参数 “ref”。
	// 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
	// 然后它就可以被挂载到被 LogProps 包裹的子组件上。
	return React.forwardRef((props, ref) => {
		return <LogProps {...props} forwardedRef={ref} />;
	});
}
```

## React.lazy

`React.lazy()` 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。

```jsx
// 这个组件是动态加载的
const SomeComponent = React.lazy(() => import("./SomeComponent"));
```

请注意，渲染 lazy 组件依赖该组件渲染树上层的 `<React.Suspense>` 组件。这是指定加载指示器（loading indicator）的方式。使用 `React.lazy` 的动态引入特性需要 JS 环境支持 Promise。

## React.Suspense

`React.Suspense` 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。目前，懒加载组件是 `<React.Suspense>` 支持的唯一用例：

```jsx
// app.tsx
import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect, withRouter, NavLink } from "react-router-dom";
import Loader from "components/loader";

// 该组件是动态加载的
const SomeComponent = React.lazy(() => import("./SomeComponent"));
const OtherComponent = React.lazy(() => import("./OtherComponent"));
const MyComponent = React.lazy(() => import("./MyComponent"));

const routes = [
	{
		path: getPath("/"),
		component: SomeComponent,
		exact: true,
	},
	{
		path: "/some",
		component: SomeComponent,
	},
	{
		path: "/other",
		component: OtherComponent,
	},
	{
		path: "/mine",
		component: MyComponent,
	},
];

function AppRouter(props) {
	// withRouter 把不是通过路由切换过来的组件中，将react-router 的 history、location、match 三个对象传入props对象上
	console.log("App(props): ", props); // App(props): {history: {…}, location: {…}, match: {…}, staticContext: undefined}
	return (
		// 显示 <Spinner> 组件直至某个 Component 加载完成
		<React.Suspense fallback={<Spinner />}>
			<NavLink exact activeClassName="line-active" to="/">
				Some
			</NavLink>
			<NavLink activeClassName="line-active" to="/other">
				Other
			</NavLink>
			<Switch>
				<Route exact path="/">
					<Redirect to={`/some`} />
				</Route>
				{routes.map(({ path: routePath, component, exact = false }) => (
					<Route
						key={routePath}
						path={routePath}
						component={component}
						exact={exact}
					/>
				))}
				{/* Switch 会优先显示匹配到的第一个路由，多加一个路由做安全垫 */}
				<Route component={SomeComponent} />
			</Switch>
		</React.Suspense>
	);
}

export default withRouter(AppRouter);

// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import moment from "moment";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider, message } from "antd";
import "moment/locale/zh-cn";
import App from "./app";
// 定义全局样式
import { theme } from "./GlobalStyle";

moment.locale("zh-cn");
message.config({
	top: 100,
	duration: 2,
	maxCount: 1,
});

ReactDOM.render(
	<React.StrictMode>
		// 必须需要使用 BrowserRouter 或者 HashRouter 包括
		<BrowserRouter>
			<ConfigProvider locale={zhCN}>
				<ThemeProvider theme={theme}>
					<UserInfoContextProvider>
						<App />
					</UserInfoContextProvider>
				</ThemeProvider>
			</ConfigProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
```

## withRouter

非路由组件可以通过 withRouter 高阶组件访问 History 对象的属性和进行匹配。withRouter 将在渲染时向包装组件传递更新的 match、location 和 history 属性。

作用：把不是通过路由切换过来的组件中，将 react-router 的 history、location、match 三个对象传入 props 对象上。

默认情况下必须是经过路由匹配渲染的组件才存在 this.props，才拥有路由参数，才能使用编程式导航的写法，执行 this.props.history.push('/detail')跳转到对应路由的页面。

然而不是所有组件都直接与路由相连（通过路由跳转到此组件）的，当这些组件需要路由参数时，使用 withRouter 就可以给此组件传入路由参数，此时就可以使用 this.props。

## ReactDOMServer

`ReactDOMServer` 对象允许你将组件渲染成静态标记。通常，它被使用在 Node 服务端上：

```js
// ES modules
import ReactDOMServer from "react-dom/server";
// CommonJS
var ReactDOMServer = require("react-dom/server");
```
