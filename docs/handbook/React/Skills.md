---
title: 记录 React 开发时遇到的一些问题的解决方法和想法
author: EricYangXD
date: "2021-12-29"
---

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

![img](https://upload-images.jianshu.io/upload_images/16775500-8d325f8093591c76.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/740/format/webp)

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
