---
title: 记录 React 开发时遇到的一些问题的解决方法和想法
author: EricYangXD
date: "2021-12-29"
---

## 快速创建项目

1. `npx create-react-app my-app`
2. `npm init react-app my-app`
3. `yarn create react-app my-app`

## 快速启动项目

- 参考[这里 webpack](https://github.com/EricYangXD/LearnReact)
- 参考[这里 vite](https://github.com/EricYangXD/vite-pro)
- 修改默认启动端口：`"start": "cross-env PORT=8090 react-scripts start",`

## key

- Q:为什么要有 key？

- A:diff 的时候可以直接对比 key，复用一些未更新的 node，提高效率。。。也可通过 key 快速找到某个 node 节点。

- 我遇到的场景：页面左侧是菜单，右侧是菜单对应的 table，当菜单 menuItem 变了那么对应的 tableContent 也要展示出来，而 tableContent 变了时要保存，如果未保存就去切换菜单，那么需要给出提示，点击保存/取消之后才能切换。

- 问题来了：右侧 table 单独抽成一个组件（因为别的地方也要用），然后抛出 contentChanged，content 等字段给左侧/全局，用于切换角色时判断 table 内容有无变化，而 table 的初始值是不一定相同的，那么我需要这个 table 组件自己去维护自己的状态，比如初始化的时候 contentChanged=false，content=接口返回的数据/[]，而这个 table 组件又需要接收 menuItem 来获取对应的数据，这时，如果不给 table 组件加一个 key={menuItem}的话，那么我切换左侧 menuItem 之后，组件抛出来的 content 就不会被重新初始化，那么我此时去保存这个 tableContent 就会出现 bug——明明 table 里是空的，而保存之后 table 里反而有了数据，这数据还是上一个 menuItem 对应的数据。而解决这个 bug 只需要给 table 组件加个 key，让它跟 menuItem 绑定，menuItem 改变时 table 组件会销毁重新创建，那么 content 自然也会跟着初始化。

## React diff 原理, 如何从 O(n^3) 变成 O(n)

### 为什么是 O(n^3) ?

从一棵树转化为另外一棵树，直观的方式是用动态规划，通过这种记忆化搜索减少时间复杂度。由于树是一种递归的数据结构，因此最简单的树的比较算法是递归处理。确切地说，树的最小距离编辑算法的时间复杂度是 O(n^2m(1+logmn)), 我们假设 m 与 n 同阶， 就会变成 O(n^3)。

### React diff 原理

- 简单的来讲, React 它只比较同一层, 一旦节点类型不一样, 就删除. 这样子每一个节点只会比较一次, 所以算法就变成了 O(n).

- 对于同一层的一组子节点. 他们有可能顺序发生变化, 但是内容没有变化. React 根据 key 值来进行区分, 一旦 key 值相同, 就直接返回之前的组件, 不重新创建.

- 这也是为什么渲染数组的时候, 没有加 key 值或者出现重复 key 值会出现一些奇奇怪怪的 bug.

- 除了 key , 还提供了选择性子树渲染。开发人员可以重写 shouldComponentUpdate 提高 diff 的性能.

## How to get the previous props or state?

- example:

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

- 虽说已经不太提倡用这玩意了，but 还是挺有用的：组件的生命周期，指的是一个 React 组件从挂载，更新，销毁过程中会执行的生命钩子函数。

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

- constructor，顾名思义，组件的构造函数。一般会在这里进行 state 的初始化，事件的绑定等等

- componentWillMount，是当组件在进行挂载操作前，执行的函数，一般紧跟着 constructor 函数后执行

- componentDidMount，是当组件挂载在 dom 节点后执行。一般会在这里执行一些异步数据的拉取等动作

- shouldComponentUpdate，返回 false 时，组件将不会进行更新，可用于渲染优化

- componentWillReceiveProps，当组件收到新的 props 时会执行的函数，传入的参数就是 nextProps ，你可以在这里根据新的 props 来执行一些相关的操作，例如某些功能初始化等

- componentWillUpdate，当组件在进行更新之前，会执行的函数

- componentDidUpdate，当组件完成更新时，会执行的函数，传入两个参数是 prevProps 、prevState

- componentWillUnmount，当组件准备销毁时执行。在这里一般可以执行一些回收的工作，例如 clearInterval(this.timer) 这种对定时器的回收操作

- 官方 16.3/16.4 版本[生命周期图](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

- 简单易懂版

![img](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/react-lifecycle.png "React生命周期")

- 当首次挂载组件时，按顺序执行 getDefaultProps、getInitialState、componentWillMount、render 和 componentDidMount。
- 当卸载组件时，执行 componentWillUnmount。
- 当重新挂载组件时，此时按顺序执行 getInitialState、componentWillMount、render 和 componentDidMount，但并不执行 getDefaultProps。
- 当再次渲染组件时，组件接受到更新状态，此时按顺序执行 componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render 和 componentDidUpdate。
- 当使用 ES6 classes 构建 React 组件时，static defaultProps = {} 其实就是调用内部的 getDefaultProps 方法，constructor 中的 this.state = {} 其实就是调用内部的 getInitialState 方法。

- 补充&更新

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

- mountComponent 负责管理生命周期中的 getInitialState、componentWillMount、render 和 componentDidMount。
- 由于 getDefaultProps 是通过构造函数进行管理的，所以也是整个生命周期中最先开始执行的。而 mountComponent 只能望洋兴叹，无法调用到 getDefaultProps。这就解释了为何 getDefault-Props 只执行一次。
- 在 componentWillMount 中调用 setState 方法，是不会触发 re-render 的，而是会进行 state 合并，因此 componentWillMount 中的 this.state 并不是最新的，在 render 中才可以获取更新后的 this.state。

2. 阶段二：RECEIVE_PROPS

- updateComponent 负责管理生命周期中的 componentWillReceiveProps、shouldComponent-Update、componentWillUpdate、render 和 componentDidUpdate。
- 在 componentWillReceiveProps 中调用 setState，是不会触发 re-render 的，而是会进行 state 合并。且在 componentWillReceiveProps、shouldComponentUpdate 和 componentWillUpdate 中也还是无法获取到更新后的 this.state，即此时访问的 this.state 仍然是未更新的数据，因此只有在 render 和 componentDidUpdate 中才能获取到更新后的 this.state。
- 调用 shouldComponentUpdate 判断是否需要进行组件更新，如果存在 componentWillUpdate，则执行。
- 禁止在 shouldComponentUpdate 和 componentWillUpdate 中调用 setState，这会造成循环调用，直至耗光浏览器内存后崩溃。

3. 阶段三：UNMOUNTING

- unmountComponent 负责管理生命周期中的 componentWillUnmount。
- 如果存在 componentWillUnmount，则执行并重置所有相关参数、更新队列以及更新状态，如果此时在 componentWillUnmount 中调用 setState，是不会触发 re-render 的，这是因为所有更新队列和更新状态都被重置为 null，并清除了公共类，完成了组件卸载操作。

## React Router

- 路由包括：react-router-dom

- react-router-dom 导出的组件：
- HashRouter 和 BrowserRouter 根容器
- Switch 精准匹配
- Route 路由规则
- Link 声明式跳转
- NavLink 声明式跳转 + 样式
- Redirect 重定向
- withRouter 高阶组件，将组件变成路由组件

## constate 轻量级状态管理库

- basic usage

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

- Anonymous functions will always get a new reference on every render. 匿名函数总是会在每次渲染时获得新的引用.
- This means that onChange property will change every time Parent renders. To prevent that, we need to memoize it with useCallback. 这意味着每次 Parent 渲染时 onChange 属性都会改变。为了防止这种情况，我们需要使用 useCallback 记住它。
- React does not care whether “props changed” - it will render child components unconditionally just because the parent rendered!React 并不关心“props 是否改变”——它会无条件地渲染子组件，因为父组件渲染了！
- If you don’t want a component to re-render when its parent renders, wrap it with memo. After that, the component indeed will only re-render when its props change.如果您不希望组件在其父级渲染时重新渲染，请使用 memo 包装它。之后，该组件确实只会在其 props 更改时重新渲染。
- 有时使用 useCallback 来对函数做一个缓存，但是由于对 state 的依赖，导致这个缓存并不生效/效果不及预期，那么需要停止对这个 state 的依赖，此时可以使用 functional state update--函数状态更新？例如：

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

- 0. **setState 只在合成事件和钩子函数中是“异步”的，在原生事件、自定义 DOM 事件、setInterval、setTimeout、promise.then 中都是同步的。**
- 1. 不在 React 上下文中触发的 setState，都是同步更新的。
- 2. setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的 callback 拿到更新后的结果。
- 3. setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中因为是同步执行的，所以不会批量更新，在“异步”中如果对同一个值进行多次 setState，setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。**当 setState 传入的参数是函数的时候，就不会合并了**。
- 4. useEffect hooks 中，useState 都是异步的。

- 所以严格说是同步的代码, 毕竟都在一个 eventloop 里, 只不过 setState 里的参数/回调被延迟执行到后面代码执行完才执行。

- 在 setState 中, 会根据一个 isBatchingUpdates 判断是直接更新还是稍后更新, 它的默认值是 false. 但是 React 在调用事件处理函数之前会先调用 batchedUpdates 这个函数, batchedUpdates 函数 会将 isBatchingUpdates 设置为 true. 因此, 由 react 控制的事件处理过程, 就变成了异步(批量更新).

## 3 ways to cause an infinite loop in React

- Updating the state inside the render. 比如：在 class 的 render()函数 或 函数组件的 return 之外。Fix: 使用 useEffect 包裹。
- Infinite loop in useEffect. 比如：更新的 state 被放到依赖数组里。Fix: 使用 setSate(prev=>prev+1)，即使用一个函数接收 prevState，然后进行更新。
- Incorrectly set event handlers. 比如：新手常犯错误：onClick 事件应该接收一个闭包函数，而不是直接传入函数执行后的结果。

## 合成事件

- react 中的事件是合成事件，会统一绑定在最外层；为什么是合成事件？--因为用了虚拟 DOM。

- Virtual DOM 在内存中是以对象的形式存在的，如果想要在这些对象上添加事件，就会非常简单。

- React 基于 Virtual DOM 实现了一个 SyntheticEvent （合成事件）层，我们所定义的事件处理器会接收到一个 SyntheticEvent 对象的实例，它完全符合 W3C 标准，不会存在任何 IE 标准的兼容性问题。并且与原生的浏览器事件一样拥有同样的接口，同样支持事件的冒泡机制，我们可以使用 stopPropagation() 和 preventDefault() 来中断它。所有事件都自动绑定到最外层上。如果需要访问原生事件对象，可以使用 nativeEvent 属性。

- 例如：对于 a 标签要取消他的默认跳转行为时，在原生 html 中：return false；在 React 中要：e.preventDefault()；

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

## 函数组件与类组件的区别

1. 类组件有生命周期，函数组件没有生命周期，但是有 hooks 处理副作用。
2. 类组件有 this，函数组件没有 this。
3. 类组件会实例化，函数组件不会实例化，而是每次都执行函数。
4. OOP 思想和函数式编程思想。
5. class 语法和 js 函数。
6. this.props 和函数第个参数即 props。
7. 性能优化：PureComponent/ShouldComponentUpdate VS React.memo/useCallback/useMemo 等。
8. 类组件状态逻辑复用困难，函数组件有自定义 hooks 复用逻辑方便。
9. 维护的难度也是函数组件更方便，因为可用 useEffect 集中处理副作用。
10. 学习曲线 class+this 比较容易出错，函数组件是纯函数，输入不变则输出不变，所以函数组件更简单。

### 必须使用类组件的场景

1. 错误边界：ErrorBoundary，借助类组件的生命周期钩子实现
2. 维护旧项目
3. 某些旧的第三方库可能尚未完全兼容 hooks
4. 需要访问某些特定的、只有类组件采用的生命周期方法时

## useState

1. 多个 setState 会合并，可以理解成后面的会覆盖前面的--适用于直接更新 state 的场景：`setCount(10)`，而不是`setCount(prev=>prev+1)`。
2. `setCount(prev=>prev+1)`，有几个则执行几个，不会合并。
3. 先`setCount(1)`，再`setCount(prev=>prev+1)`时，会先执行`setCount(1)`，再执行`setCount(prev=>prev+1)`，即执行两次。
4. 先`setCount(prev=>prev+1)`，再`setCount(1)`时，只会执行`setCount(1)`，即执行一次。

## useReducer

类似于 redux 的用法，但是只是用于组件内部较复杂的状态管理和简单的跨组件状态管理，不适用于全局状态管理。使用于组件内部 state 较多且有相互依赖关系、更新的逻辑分散难以追踪的场景。否则还是 useState 更方便。

1. 将复杂的状态管理逻辑抽离到 reducer 中，可以集中处理复杂的逻辑，避免组件逻辑混乱。
2. 所有状态转换规则清晰定义，通过 action.type 区分
3. 增强代码意图明确性、可读性和可维护性、可测试性
4. 优化的 dispatch 函数传递：传递给深层子组件时只需传递一个 dispatch 函数。react 会保证 dispatch 函数的引用是稳定的，有助于性能优化，避免因 prop 引用变化导致不必要的重渲染（配合 react.memo）。
5. reducer 是个纯函数，不会产生副作用，可以放心使用。易于进行单元测试，独立于组件渲染。
6. 更清晰的 action 流向，通过 dispatch(action)触发更新，action 对象包含 type 和 payload，action.type 用于区分不同的 action，action.payload 用于传递数据。有助于调试和理解复杂状态的流转过程。
7. 配合 Context API 可进一步扩大共享范围。
8. 全局状态管理还是使用 RTK。

## useCallback

即`useMemo(()=>fn, [deps])`，用于缓存函数，避免每次都重新生成函数，从而提升性能。

## useMemo

用于缓存计算结果，避免每次都重新计算，从而提升性能。这两个 Api 不能滥用：他们自身都有执行成本，会消耗性能，可能超过收益，甚至拖慢性能负优化。代码复杂度可读性变差，可维护性降低。

## useEffect

1. 通过`Object.is()`来判断新旧值是否相同，如果相同则返回之前的旧值，否则返回新值。浅比较：基础类型比较的是值，引用类型比较的是引用地址。
2. 可能会有过时闭包的 bug（闭包陷阱）：即在 useEffect 中使用闭包，导致闭包中的变量值始终是最后一次更新的值，而不是最新的值。把所有依赖项都放到依赖数组里，借助 eslint 插件`eslint-plugin-react-hooks`来避免遗漏依赖项。解决方法：一是正确设置依赖数组，二是使用函数式更新，三是使用 useRef。
3. 处理快速操作引发的多个异步请求，避免竞态条件，即对于请求响应返回延迟的问题，保证数据最新。一是可以用 AbortController 借助 signal 取消请求；二是借助一个标志位，在每次请求时更新标志位，如果标志位为 true，则取消上一次的请求，重新发起请求。

## useRef

## useImperativeHandle

## useLayoutEffect

- useLayoutEffect 与 useEffect 使用方式是完全一致的，useLayoutEffect 的区别在于它会在所有的 「DOM 变更之后，浏览器渲染之前」「同步」调用 effect，可能会阻塞渲染。而 useEffect 是异步的，会在浏览器绘制之后异步调用 effect，不会阻塞渲染。
- 可用于避免页面抖动/闪烁，提升用户体验。动态调整元素位置尺寸时。
- 可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前， useLayoutEffect 内部的更新计划将被同步刷新。
- 通常对于一些通过 JS 计算的布局，如果你想减少 useEffect 带来的「页面抖动」,你可以考虑使用 useLayoutEffect 来代替它。
- 需要注意 useLayoutEffect 与 componentDidMount、componentDidUpdate 的调用阶段是一样的。
- useLayoutEffect 内部的更新计划将会在浏览器执行下一次绘制前被同步执行。
- 本质上还是 useLayoutEffect 的实现是基于 micro ，而 Effect 是基于 macro ，所以 useLayoutEffect 会在页面更新前去执行。
- 如果你使用服务端渲染，请记住，无论 useLayoutEffect 还是 useEffect 都无法在 Javascript 代码加载完成之前执行。这就是为什么在服务端渲染组件中引入 useLayoutEffect 代码时会触发 React 告警。要解决这个问题，需要将代码逻辑移至 useEffect 中（如果首次渲染不需要这段逻辑的情况下），或是将该组件延迟到客户端渲染完成后再显示（如果直到 useLayoutEffect 执行之前 HTML 都显示错乱的情况下）。
- 与 useEffect 的区别之一：与 componentDidMount、componentDidUpdate 不同的是，传给 useEffect 的函数会在浏览器完成布局与绘制之后，在一个延迟事件中被调用。虽然 useEffect 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。在开始新的更新前，React 总会先清除上一轮渲染的 effect。

## useContext

1. 由于 Provider 的 value 是引用类型，所以当 Provider 的 value 变化时，会触发所有使用该 Provider 的子组件的重新渲染。
2. 为了解决上述问题：一是可以使用 useMemo 来缓存 value，二是可以拆分多个 Provider，三是借助第三方库：`react-context-selector`。

## useDebugValue

useDebugValue 可用于在 React 开发者工具中显示自定义 hook 的标签，它接受两个参数:

- value 为我们要重点关注的变量，该参数表示在 DevTools 中显示的 hook 标志。
- fn 表明如何格式化变量 value , 该函数只有在 Hook 被检查时才会被调用。它接受 debug 值作为参数，并且会返回一个格式化的显示值。

- useDebugValue 应该在自定义 hook 中使用，如果直接在组件内使用是无效的。

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

## keep-alive

`keep-alive` 组件可以保留组件状态或避免重新渲染，在某些场景下可以提高组件的渲染性能。

- 使用 React Router 和自定义缓存组件
- 使用第三方库，如 react-keep-alive
- 使用 Redux 或 Context API 来管理组件状态
- 使用 display 或 visibility 实现组件显示和隐藏（最简单不推荐）

0. 通过父组件实现状态管理和条件渲染

```jsx
import React, { useState } from "react";

function ParentComponent() {
  const [activeComponent, setActiveComponent] = useState("ComponentA");
  // 缓存组件
  const [cachedComponents, setCachedComponents] = useState({});

  const renderComponent = (componentName) => {
    if (!cachedComponents[componentName]) {
      const NewComponent = componentName === "ComponentA" ? ComponentA : ComponentB;
      setCachedComponents((prev) => ({ ...prev, [componentName]: <NewComponent /> }));
    }
    return cachedComponents[componentName];
  };

  return (
    <div>
      <button onClick={() => setActiveComponent("ComponentA")}>Show Component A</button>
      <button onClick={() => setActiveComponent("ComponentB")}>Show Component B</button>
      {renderComponent(activeComponent)}
    </div>
  );
}

const ComponentA = () => {
  return <div>Component A</div>;
};

const ComponentB = () => {
  return <div>Component B</div>;
};
```

或创建一个自定义的缓存组件来保存组件的状态：

```jsx
import React, { useState } from "react";

function KeepAlive({ children, componentName }) {
  const [cache, setCache] = useState({});

  if (!cache[componentName]) {
    setCache((prev) => ({ ...prev, [componentName]: children }));
  }

  return cache[componentName];
}

function ParentComponent() {
  const [activeComponent, setActiveComponent] = useState("ComponentA");

  return (
    <div>
      <button onClick={() => setActiveComponent("ComponentA")}>Show Component A</button>
      <button onClick={() => setActiveComponent("ComponentB")}>Show Component B</button>
      <KeepAlive componentName={activeComponent}>
        {activeComponent === "ComponentA" ? <ComponentA /> : <ComponentB />}
      </KeepAlive>
    </div>
  );
}

const ComponentA = () => {
  return <div>Component A</div>;
};

const ComponentB = () => {
  return <div>Component B</div>;
};
```

1. 高阶组件 HOC：

```jsx
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const withKeepAlive = (WrappedComponent) => {
  return function KeepAliveComponent(props) {
    const [isActive, setIsActive] = useState(true);
    const containerRef = useRef(document.createElement('div'));
    const rootRef = useRef(null); // 用于存储 React 18 的 createRoot
    const componentRef = useRef(null); // 缓存组件的虚拟 DOM

    // 初始化 DOM 容器
    useEffect(() => {
      document.body.appendChild(containerRef.current);
      rootRef.current = ReactDOM.createRoot(containerRef.current);

      // 初次渲染子组件，缓存实例
      if (!componentRef.current) {
        componentRef.current = <WrappedComponent {...props} />;
        rootRef.current.render(componentRef.current);
      }

      return () => {
        rootRef.current.unmount();
        document.body.removeChild(containerRef.current);
      };
    }, []);

    useEffect(() => {
      if (isActive) {
        // 激活组件时，显示容器
        containerRef.current.style.display = 'block';
      } else {
        // 隐藏组件时，仅隐藏容器，但不卸载组件
        containerRef.current.style.display = 'none';
      }
    }, [isActive]);

    const toggleActive = () => {
      setIsActive(!isActive);
    };

    return (
      <div>
        <button onClick={toggleActive}>
          {isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    );
  };
};

export default withKeepAlive;

// 使用
import React from 'react';
import withKeepAlive from './withKeepAlive';

function ExampleComponent() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>计数器：{count}</h1>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

const KeepAliveExampleComponent = withKeepAlive(ExampleComponent);

function App() {
  return (
    <div>
      <KeepAliveExampleComponent />
    </div>
  );
}

export default App;
```

1. 自定义缓存组件

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';

const CacheRoute = ({ component: Component, ...rest }) => {
  const [cached, setCached] = useState({});
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setCached((prev) => ({
        ...prev,
        [rest.path]: ref.current.innerHTML,
      }));
    }
  }, [rest.path]);

  return (
    <Route
      {...rest}
      render={(props) => (
        <div ref={ref}>
          {cached[rest.path] ? (
            <div dangerouslySetInnerHTML={{ __html: cached[rest.path] }} />
          ) : (
            <Component {...props} />
          )}
        </div>
      )}
    />
  );
};

export default CacheRoute;

// 使用
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import CacheRoute from './CacheRoute';
import Home from './Home';
import About from './About';
import Contact from './Contact';

const App = () => {
  return (
    <Router>
      <Switch>
        <CacheRoute exact path="/" component={Home} />
        <CacheRoute path="/about" component={About} />
        <CacheRoute path="/contact" component={Contact} />
      </Switch>
    </Router>
  );
};

export default App;
```

3. 使用第三方库 react-keep-alive

```jsx
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AliveScope, KeepAlive } from "react-keep-alive";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";

const App = () => {
  return (
    <Router>
      <AliveScope>
        <Switch>
          <Route exact path="/">
            <KeepAlive>
              <Home />
            </KeepAlive>
          </Route>
          <Route path="/about">
            <KeepAlive>
              <About />
            </KeepAlive>
          </Route>
          <Route path="/contact">
            <KeepAlive>
              <Contact />
            </KeepAlive>
          </Route>
        </Switch>
      </AliveScope>
    </Router>
  );
};

export default App;
```

4. 使用 Redux 或 Context API 来管理组件状态

```jsx
import React, { createContext, useState, useContext } from 'react';

const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState({});

  const saveCache = (key, value) => {
    setCache((prev) => ({ ...prev, [key]: value }));
  };

  const getCache = (key) => cache[key];

  return (
    <CacheContext.Provider value={{ saveCache, getCache }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => useContext(CacheContext);

import React, { useEffect, useRef } from 'react';
import { Route } from 'react-router-dom';
import { useCache } from './CacheContext';

const CacheRoute = ({ component: Component, ...rest }) => {
  const { saveCache, getCache } = useCache();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      saveCache(rest.path, ref.current.innerHTML);
    }
  }, [rest.path, saveCache]);

  return (
    <Route
      {...rest}
      render={(props) => (
        <div ref={ref}>
          {getCache(rest.path) ? (
            <div dangerouslySetInnerHTML={{ __html: getCache(rest.path) }} />
          ) : (
            <Component {...props} />
          )}
        </div>
      )}
    />
  );
};

export default CacheRoute;

import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { CacheProvider } from './CacheContext';
import CacheRoute from './CacheRoute';
import Home from './Home';
import About from './About';
import Contact from './Contact';

const App = () => {
  return (
    <Router>
      <CacheProvider>
        <Switch>
          <CacheRoute exact path="/" component={Home} />
          <CacheRoute path="/about" component={About} />
          <CacheRoute path="/contact" component={Contact} />
        </Switch>
      </CacheProvider>
    </Router>
  );
};

export default App;
```

## React 常用方法及周边

![React 总结](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/react-zj.jpg)

## ReactDOM.createPortal

`ReactDOM.createPortal` 可以将子节点渲染到指定的 DOM 节点中。Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

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

## React.memo

浅比较，如果 props 相等，则返回 true，否则返回 false。比较的是原始类型的值和引用类型的内存地址。

## React.forwardRef

`React.forwardRef` 会创建一个 React 组件，这个组件能够将其接收到的 ref 属性转发到其组件树下的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

- 转发 refs 到 DOM 组件
- 在高阶组件中转发 refs

`React.forwardRef` 接受渲染函数作为参数。React 将使用 props 和 ref 作为参数来调用此函数。此函数应返回 React 节点。

可以使得父组件通过 ref 获取到子组件中的 DOM 节点。因为正常情况下 ref 和 key 一样，都是会被 react 特殊处理的 prop，函数组件默认会忽略 ref，所以 ref 无法被直接传递到子组件中，但是通过 `React.forwardRef`，可以将 ref 传递到子组件中，从而使父组件可以通过 ref 获取到子组件中的 DOM 节点并进行一定的操作。

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
          <Route key={routePath} path={routePath} component={component} exact={exact} />
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

## React.Suspense

React 的发展历程是：从「同步」到「异步」，再到「并发」。

当实现「并发」后，接下来的发展方向将是：不断扩展可以使用「并发」的场景。

Suspense 的作用是「划分页面中需要并发渲染的部分」。

这套发展路径从 React 诞生伊始就决定了，因为从架构上来说，React 重度依赖运行时，为了优化性能，「并发」是这套架构下的最优发展方向。

## contenthash

```js
// webpack.config.js
const CDN_HOST = process.env.CDN_HOST; // CDN 域名
const CDN_PATH = process.env.CDN_PATH; // CDN 路径
const ENV = process.env.ENV; // 当前的环境等等
const VERSION = process.env.VERSION; // 当前发布的版本

const getPublicPath = () => {
  // Some code here
  return `${CDN_HOST}/${CDN_PATH}/${ENV}/`; // 依据 ENV 等动态构造 publicPath
};

const publicPath = process.env.NODE_ENV === "production" ? getPublicPath() : ".";

module.exports = {
  output: {
    filename: "bundle.[name][contenthash:8].js",
    publicPath,
  },
  plugins: [new HtmlWebpackPlugin()],
};
```

使用 contenthash 时，往往会增加一个小模块后，整体文件的 hash 都发生变化，原因为 Webpack 的 module.id 默认基于解析顺序自增，从而引发缓存失效。具体可通过设置 optimization.moduleIds 设置为 'deterministic' 。

## useRef

1. 传递变量不刷新页面，无 effect，不同于 state，用于在函数组件中引用对象，并在重新渲染时保留被引用对象的状态，使用 current 属性，更新被引用对象的值不会触发重新渲染
2. 配合 ref 获取 DOM，可以防止页面刚加载时 DOM 为空，比如 input 获取焦点：`inputRef.current.focus()`
3. useRef 用于创建引用对象，而 ref 用于访问 DOM 节点或将 render 方法中的 react 组件分配给引用对象。另外，可以使用 useRef hook 或 createRef 函数创建 ref，这是其他方法无法实现的。
4. useRef 可以用来引用任何类型的对象，React ref 只是一个用于引用 DOM 元素的 DOM 属性。
5. 当 node 节点被删除时，current 会被设为 null。
6. 避免重复创建 ref 引用，创建之前先判断 current 是不是 null
7. 默认情况下，你自己的组件不会暴露它们内部的 DOM 节点的引用，所以直接在自定义组件上使用 ref 会报 warning，解决方法是使用 forwardRef 包裹你想要使用 ref 的组件，例：

```js
import { forwardRef, useRef } from "react";

// 注意forwardRef中回调函数的第二个参数ref，即为暴露出去的ref
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

### useRef 和 useState 的区别

| 特性         | useState                             | useRef                                        |
| ------------ | ------------------------------------ | --------------------------------------------- |
| 目的         | 管理组件的状态                       | 持久化引用，例如 DOM 元素或可变数据           |
| 触发重新渲染 | 状态更新会触发组件重新渲染           | 更改 ref 不会触发组件重新渲染                 |
| 返回值       | 返回一个包含当前状态和更新函数的数组 | 返回一个可变的 ref 对象（{ current: value }） |
| 适用场景     | 需要跟踪并响应状态变化的场景         | 需要存储不需要触发重渲染的可变数据的场景      |

### Ref 和 useRef 的使用场景

1. ref 用于获取 DOM 节点
2. 创建一个 ref 对象，该对象`.current`可以存储任何可变值，发生变化不会触发组件重新渲染。

一些可供参考的使用场景：

- 与 input 元素交互：通过使用引用，可以访问 input 元素并执行聚焦、变化跟踪或自动完成等功能。
- 与第三方 UI 库交互：ref 可用于与第三方 UI 库创建的元素交互，使用标准 DOM 方法访问这些元素可能比较困难。例如，如果你使用第三方库生成滑块，你可以使用 ref 来访问滑块的 DOM 元素，而不必知道滑块库的源代码结构。
- 媒体播放：你还可以使用引用访问媒体资源，如图像、音频或视频，并与它们的渲染方式进行交互。例如，当元素进入视口时，自动播放视频或延迟加载图像。
- 复杂动画触发：传统上，CSS keyframes 或 timeout 用来确定何时启动动画。在某些情况下（可能更加复杂），可以使用 ref 来观察 DOM 元素并确定何时启动动画。
- 在某些情况下，比如下面这种情况，你不应该使用引用：
  - 即使在使用 ref 的简单解决方案的情况下，也不需要编写更昂贵的代码来完成相同的任务。例如，使用条件渲染来隐藏或显示 DOM 元素，而不是引用。
  - 有时，使用引用的概念非常有趣，以至于你忽略了对元素的修改对应用程序生命周期的影响。你应该记住，对引用的更改不会导致重新渲染，并且引用在渲染之间保持其对象的值。因此，在状态变化需要触发重新渲染的情况下，避免使用引用是明智的。
- DOM 元素（不应与功能性组件混淆）可以使用 ref 属性引用。因为，与类组件或 DOM 元素不同，函数组件没有实例。
- 函数组件没有实例，所以使用引用不会生效，我们可以将函数组件转换为类组件，或者在函数组件组件中使用 `forwardRef`。

## 反向代理

反向代理（reverse proxy）：是指以代理服务器来接受网络请求，并将请求转发给内部的服务器，并且将内部服务器的返回，就像是二房东一样。

一句话解释反向代理 & 正向代理：反向代理隐藏了真正的服务器，正向代理隐藏了真正的客户端。

## 静态资源组织总结

1. 为了最大程度利用缓存，将页面入口(HTML)设置为协商缓存，将 JavaScript、CSS 等静态资源设置为永久强缓存。
2. 为了解决强缓存更新问题，将文件摘要（hash）作为资源路径(URL)构成的一部分。
3. 为了解决覆盖式发布引发的问题，采用 name-hash 而非 query-hash 的组织方式，具体需要配置 Webpack 的 output.filename 为 contenthash 。
4. 为了解决 Nginx 目录存储过大 + 结合 CDN 提升访问速度，采用了 Nginx 反向代理+ 将静态资源上传到 CDN。
5. 为了上传 CDN，我们需要按环境动态构造 publicPath + 按环境构造 CDN 上传目录并上传。
6. 为了动态构造 publicPath 并且随构建过程插入到 HTML 中，采用 Webpack-HTML-Plugin 等插件，将编译好的带 hash + publicPath 的静态资源插入到 HTML 中。
7. 为了保证上传 CDN 的安全，我们需要一种机制管控上传 CDN 秘钥，而非简单的将秘钥写到代码 / Dockerfile 等明文文件中。

## Q&A

Q: 前端代码从 tsx/jsx 到部署上线被用户访问，中间大致会经历哪些过程？

A: 经历本地开发、远程构建打包部署、安全检查、上传 CDN、Nginx 做流量转发、对静态资源做若干加工处理等过程。

Q：可能大部分同学都知道强缓存/协商缓存，那前端各种产物（HTML、JS、CSS、IMAGES 等）应该用什么缓存策略？以及为什么？
若使用协商缓存，但静态资源却不频繁更新，如何避免协商过程的请求浪费？
若使用强缓存，那静态资源如何更新？

A：HTML 使用协商缓存，静态资源使用强缓存，使用 name-hash（非覆盖式发布）解决静态资源更新问题。

Q：配套的，前端静态资源应该如何组织？

A：搭配 Webpack 的 Webpack-HTML-Plugin & 配置 output publicPath 等。

Q：配套的，自动化构建 & 部署过程如何与 CDN 结合？

A：自动化构建打包后，将产物传输到对应环境 URL 的 CDN 上。

Q：如何避免前端上线，影响未刷新页面的用户？

A：使用 name-hash 方式组织静态资源，先上线静态资源，再上线 HTML。

Q：刚上线的版本发现有阻塞性 bug，如何做到秒级回滚，而非再次部署等 20 分钟甚至更久？

A：HTML 文件使用非覆盖方式存储在 CDN 上，搭建前端发布服务，对 HTML 按版本等做缓存加工处理。当需要回滚时，更改发布服务 HTMl 指向即可。

Q: CDN 域名突然挂了，如何实现秒级 CDN 降级修补而非再次全部业务重新部署一次？

A1: 将静态资源传输到多个 CDN 上，并开发一个加载 Script 的 SDK 集成到 HTML 中。当发现 CDN 资源加载失败时，逐步降级 CDN 域名。

A2：在前端发布服务中，增加 HTML 文本处理环节，如增加 CDN 域名替换，发生异常时，在发布服务中一键设置即可。

Q：如何实现一个预发环境，除了前端资源外都是线上环境，将变量控制前端环境内？

A：对静态资源做加工，对 HTML 入口做小流量。

Q：部署环节如何方便配套做 AB 测试等？

A：参见前端发布服务

Q：如何实现一套前端代码，发布成多套环境产物？

A：使用环境变量，将当前环境、CDN、CDN_HOST、Version 等注入环境变量中，构建时消费 & 将产物上传不同的 CDN 即可。

## React 里面的事件机制

- 在组件挂载的阶段, 根据组件生命的 react 事件, 给 document 添加事件 addEventListener, 并添加统一的事件处理函数 dispatchEvent.
- 将所有的事件和事件类型以及 react 组件进行关联, 将这个关系保存在一个 map 里. 当事件触发的时候, 首先生成合成事件, 根据组件 id 和事件类型找到对应的事件函数, 模拟捕获流程, 然后依次触发对应的函数.
- 如果原生事件使用 stopPropagation 阻止了冒泡, 那么合成事件也就被阻止了.

### React 事件机制跟原生事件有什么区别

1. React 的事件使用驼峰命名, 跟原生的全部小写做区分.
2. 不能通过 return false 来阻止默认行为, 必须明确调用 preventDefault 去阻止浏览器的默认响应.

## 什么是 React Fiber

React 的 Fiber 架构是 React 16 引入的一种新的协调算法，它对 React 的渲染性能和可扩展性进行了显著的改进。Fiber 架构旨在解决 React 早期版本中在处理较大和复杂界面时面临的一些问题，例如渲染阻塞和调度困难等。

在 React 的早期版本中，React 使用了一种称为“栈”的协调算法，这种算法在更新组件树时采用深度优先遍历。虽然这种方式在简单场景下表现良好，但在处理大型应用时，会导致以下问题：

- 渲染阻塞：当需要更新组件树时，整个更新过程可能会阻塞主线程，导致用户界面无响应。
- 无法中断的工作：在复杂的更新过程中，React 无法中断当前的渲染任务，导致长时间的操作无法响应用户输入。

为了解决这些问题，React 团队设计了 Fiber 架构。

### Fiber 设计思想

1. 基于优先级的调度：引入了优先级的概念，使得不同的更新可以根据其优先级进行调度。这样，React 可以在需要时中断低优先级的渲染任务，以便处理高优先级的任务。例如，用户输入、动画和其他重要的交互可以被优先处理，而较低优先级的更新（如数据加载）可以被推迟。
2. 细粒度的增量更新：采用了细粒度的增量更新方式，它将渲染过程划分为多个小的单元（称为 Fiber 单元）。这样，React 可以在每个单元之间进行中断和恢复，从而实现更流畅的用户体验。每个 Fiber 单元都包含有关组件的状态、子组件、更新信息等。
3. 节点重用和复用：使得 React 在执行更新时能够更好地重用之前渲染的结果。当组件树发生变化时，React 可以复用已经渲染的 Fiber 节点，而无需重新创建所有子组件。这种重用机制提高了渲染性能，降低了资源消耗。

### 特殊之处

1. 任务分片：在 Fiber 中，更新过程被分割成多个小的任务。这使得 React 可以在每个 Fiber 单元之间暂停执行，检查是否有其他高优先级的任务需要执行。例如，在复杂的更新过程中，如果检测到用户输入，React 可以立即中断当前的更新任务，处理用户输入，然后再恢复之前的任务。
2. 时间切片：Fiber 还引入了时间切片的概念，将渲染任务分割成短时间段，从而使得主线程不会被长时间占用。这种方法允许浏览器在渲染期间保持响应，从而为用户提供更流畅的体验。
3. 新的树结构：Fiber 引入了新的树结构，每个 Fiber 节点都有指向其子节点和兄弟节点的指针。这种结构使得 React 在更新和遍历组件树时更加灵活，能够更高效地执行不同类型的更新（如插入、删除、移动等）。
4. 支持异步渲染：Fiber 架构为异步渲染提供了支持。React 可以在后台进行更新并在完成时再将结果提交给浏览器。这种方式可以有效利用浏览器的空闲时间进行渲染，进一步提升用户体验。

React Fiber 使用了 2 个核心解决思想:

- 让渲染有优先级
- 让渲染可中断

React Fiber 将虚拟 DOM 的更新过程划分两个阶段，Reconciler 调和阶段(可中断)与 Commit 阶段(不可中断)。一次更新过程会分为很多个分片完成，所以可能一个任务还没有执行完，就被另一个优先级更高的更新过程打断，这时候低优先级的工作就完全作废，然后等待机会重头再来。

调度的过程: 首先 React 会根据任务的优先级去分配各自的过期时间 expriationTime。requestIdleCallback 在每一帧的多余时间(黄色的区域)调用。调用 channel.port1.onmessage，先去判断当前时间是否小于下一帧时间，如果小于则代表我们有空余时间去执行任务，如果大于就去执行过期任务，如果任务没过期。这个任务就被丢到下一帧执行了。由于 requestIdleCallback 的兼容性问题，react 自己实现了一个 requestIdleCallback。

### 如何决定每次更新的数量

- 在 React15 中，每次更新时，都是从根组件或 setState 后的组件开始，更新整个子树，我们唯一能做的是，在某个节点中使用 SCU 断开某一部分的更新，或者是优化 SCU 的比较效率。
- React16 则是需要将虚拟 DOM 转换为 Fiber 节点，首先它规定一个时间段，然后在这个时间段能转换多少个 FiberNode，就更新多少个。
- 我们需要将我们的更新逻辑分成两个阶段，第一个阶段是将虚拟 DOM 转换成 Fiber， Fiber 转换成组件实例或真实 DOM（不插入 DOM 树，插入 DOM 树会 reflow）。
- Fiber 转换成后两者明显会耗时，需要计算还剩下多少时间。并且转换实例需要调用一些钩子，如 componentWillMount， 如果是重复利用已有的实例，这时就是调用 componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate，这时也会耗时。
- 如何调度时间才能保证流畅：requestIdleCallback（闲时调用）。

### 实际应用场景

- 大型数据表格：在呈现大量数据时，Fiber 可以有效地分片和优先处理用户交互。
- 动画和过渡效果：在执行动画时，React 可以暂停其他低优先级的渲染，确保动画流畅。
- 复杂的路由和视图切换：当用户在不同视图之间切换时，Fiber 可以快速处理这些更新，而不会导致应用变得无响应。

### hooks 的本质和作用

1. 函数组件的增强：React Hooks 是 React 16.8 中引入的一种新特性，旨在为函数组件提供状态管理和副作用处理的能力。在 React 早期版本中，只有类组件能够使用状态和生命周期方法，函数组件则是无状态的。Hooks 的引入使得函数组件能够拥有状态和副作用，使得函数组件可以更强大和灵活。
2. 函数的组合：Hooks 允许开发者将逻辑提取到可重用的函数中。这种组合性使得状态逻辑和行为可以在组件之间共享，而不需要使用高阶组件（HOC）或渲染 props。这使得代码更清晰、更易于维护。
3. 声明式编程：Hooks 提供了一种更声明式的方式来处理状态和副作用。通过使用 useState 和 useEffect 等 Hooks，开发者可以更清晰地表达组件的意图，而不需要关注组件生命周期的具体细节。

作用：

1. 函数组件可以管理状态
2. 函数组件可以管理副作用
3. 函数组件可以逻辑复用
4. 组件状态之间的隔离

## React 版本的差异

1. React 16.8：Hooks 引入、自定义 Hooks、性能优化：引入了 React.memo 和 useMemo、useCallback 等 API，以减少不必要的渲染和计算，提高性能。
2. React 17：无新特性：平滑升级，允许多个版本的 React 在同一个应用中共存。事件处理系统的改进，兼容性更好。渐进式升级。引入新的 JSX 转换机制，简化了 JSX 语法，能够在不导入 React 的情况下使用 JSX。
3. React 18：并发特性：能够在后台处理更新，提升用户体验。新的 `startTransition API`，允许开发者标记不需要优先处理的更新，以便 React 可以优先处理更重要的更新。自动批处理，允许在事件处理函数中多次更新状态，React 会将这些状态更新合并为一次重新渲染。Suspense 和数据获取：Suspense 特性得到了增强，支持在异步数据获取过程中显示加载状态。引入了 useTransition，使得开发者可以处理并发更新与用户输入的冲突。引入 Server Components，可以在服务器上渲染组件，传输更少的 JavaScript 到客户端，提高性能。
4. React 19：更进一步的并发能力、新的`use`函数 orhook、增强的 Suspense、性能和稳定性改进、服务端渲染的增强。

## React 事件中为什么要绑定 this 或者要用箭头函数?

事实上, 这并不算是 React 的问题, 而是 this 的问题. 但是也是 react 中经常出现的问题.

```jsx
// 这样会出错！
<button type="button" onClick={this.handleClick}>
  Click Me
</button>
```

这里的 this，当事件被触发且调用时， 因为 this 是在运行时进行绑定的， this 的值会回退到默认绑定，即值为 undefined，这是因为类声明和原型方法是以严格模式运行.

我们可以使用 bind 绑定到组件实例上. 而不用担心它的上下文.

因为箭头函数中的 this 指向的是定义时的 this，而不是执行时的 this. 所以箭头函数同样也可以解决.

## dangerouslySetInnerHTML 插入 html

会有 XSS 风险，同 Vue 中的`v-html`

```jsx
<div className="news-detail-content" dangerouslySetInnerHTML={{ __html: formatedHtml }} />
```

## 跨端调试

1. Chrome 的设备检查功能`chrome://inspect/#devices`和 Vysor 的电脑远程控制投影手机功能都是类似手机直连电脑实时预览的解决方案

2. 使用 USB 直连电脑，实现在 Android 设备上调试：`adb reverse tcp:8081 tcp:8081`，原理就是反向转发端口请求，比如手机访问 3000 端口就会直接转发给电脑上的 3000 端口代理，**注意访问路径不能用 `localhost`或电脑 IP，应该用 `127.0.0.1:${port}`**。

   - `adb devices`
   - `adb reverse <local_Server_port> <remote_Client_port>`

3. 手机直连电脑：

   - 电脑手机处于同一局域网，修改手机网络，服务器主机名设置成电脑 IP，服务器端口设置成电脑服务端口
   - 手机浏览器打开`http://${电脑IP}:${电脑服务端口}`

## CSS moudule 配置

react 中使用 css 时，可以使用 css module，这样每个组件中的 css 都是独立的，不会相互影响，而且可以避免全局污染。使用时需要做如下操作：

1. css 文件以 xx.module.css 命名
2. 引入 css 文件时，使用`import styles from './xx.module.css'`
3. 使用 css 时，使用`styles.xx`来引用
4. 借助`babel-plugin-react-css-modules`插件，将 css module 编译成普通的 css 文件
5. 借助`typescript-plugin-css-modules`插件，将 css module 编译成 typescript 类型文件，这样在 tsx 中就可以使用类型提示了
6. 配置 VScode 的`.vscode/settings.json`文件，添加如下配置：

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
  // "css.validate": false,
  // "css.modules.tsplugin["typescript-plugin-css-modules"]
}
```

7. 在`custom.d.ts`中添加如下声明配置，让 ts 能够识别 css module

```typescript
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```
