---
title: React源码阅读笔记
author: EricYangXD
date: "2021-12-28"
---

## 为什么要读源码？

-   废话，为了找工作呗。

## 怎么读源码？

-   先宏观的了解整个项目的结构，然后根据由易到难的顺序一边阅读一边调试。

## 笔记

-   TODO

### Fiber 原理

## 问题

### 为什么不能将 hooks 写到 if else 语句中？

官网：「确保 Hook 在每一次渲染中都按照相同的顺序被调用！让 React 在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确。」

React 用了链表这种数据结构来存储 FunctionComponent 里面的 hooks，在组件第一次渲染的时候，为每个 hooks 都创建了一个对象，最终形成了一个链表。

Hook 对象的 memoizedState 属性就是用来存储组件上一次更新后的 state，next 毫无疑问是指向下一个 hook 对象。在组件更新的过程中，hooks 函数执行的顺序是不变的，就可以根据这个链表拿到当前 hooks 对应的 Hook 对象，函数式组件就是这样拥有了 state 的能力。

所以，知道为什么不能将 hooks 写到 if else 语句中了吧？因为这样可能会导致顺序错乱，导致当前 hooks 拿到的不是自己对应的 Hook 对象。

## hooks

-   简单了解一下原理啥的

### 1. useState

-   类似 this.setState，用于函数组件中。每当 state/props 发生修改时，该函数组件都会重新渲染/执行。

-   每次改变 state/props 造成函数组件重新渲染/执行，从而每次渲染函数中的 state/props 都是独立的，固定的，确定的 -- 只在这一次渲染过程中存在。

-   对于 setState 的更新机制，究竟是同步还是异步。也就是所谓是否是批量更新，可以把握这个原则：
    1. 凡是 React 可以管控的地方，他就是异步批量更新。比如事件函数，生命周期函数中，组件内部同步代码。
    2. 凡是 React 不能管控的地方，就是同步批量更新。比如 setTimeout，setInterval，源生 DOM 事件中，包括 Promise 中都是同步批量更新。

### 2. useEffect

-   可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
-   useEffect 的设计理念本身就比较推荐我们把依赖函数直接放在 useEffect 内部。

-   对于无法移动到 useEffect 内部的函数：
    1.  尝试把函数移到组件外、
    2.  对于纯计算，可以在 effect 之外调用它，让 effect 依赖他的返回值、
    3.  万不得已时，将函数加入 effect 的依赖，并使用 useCallback 包裹该函数，确保他不随渲染而改变，除非函数的依赖发生变化。
-   useEffect VS useLayoutEffect：
    1. 默认情况下，useEffect 将**在每轮渲染结束后异步执行**，不同于 class Component 中的 componentDidUpdate 和 componentDidMount 在渲染后同步执行，useEffect 不会阻塞浏览器的渲染。
    2. useLayoutEffect 的作用几乎与 useEffect 一致，不同的是，useLayoutEffect 是**同步执行**的，与 componentDidUpdate 和 componentDidMount 执行机制一样，在 DOM 更新后，在浏览器渲染这些更改之前，立即执行。

### 3. useContext

-   如果你只是想避免层层传递一些属性，组件组合（component composition）有时候是一个比 context 更好的解决方案。

-   createContext 创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

-   只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。

-   每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

-   Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

-   当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。从 Provider 到其内部 consumer 组件（包括 .contextType 和 useContext）的传播不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件跳过更新的情况下也能更新。

-   通过新旧值检测来确定变化，使用了与 Object.is 相同的算法。

-   因为 context 会根据引用标识来决定何时进行渲染（本质上是 value 属性值的浅比较），所以这里可能存在一些陷阱，当 provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染。这时为了防止这种情况，可以将 value 状态提升到父节点的 state 里。

### 4. useCallback

-   useCallback 正确用法：在 dom 上绑定事件使用普通函数，在组件上绑定、传递事件则用 useCallback，防止“父”组件渲染后导致要传递的函数也会重新生成而导致“子”组件的渲染，可能会导致 React.memo 失效。
-   对于 useCallback 的替代方案：
    -   「把函数移动到组件外部」
    -   「把函数移动到 useEffect 内部」
    -   「使用 userReducer 减少依赖」

### 5. useMemo

-   类似 useEffect，把“创建”函数和依赖项数组作为参数传入  useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
-   记住，传入  useMemo  的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于  useEffect  的适用范畴，而不是  useMemo。
-   如果没有提供依赖项数组，useMemo  在每次渲染时都会计算新的值。
-   总结一下，useMemo 帮我们缓存了某个值，比如组件中某个数组/对象需要通过大量计算得到,而这个值依赖于某一个 state,我们希望只在依赖的 state 改变之后计算而不是任意 state 改变之后都会计算,这无疑会造成性能上的问题。
-   useMemo 可以缓存某个高开销的计算函数，React.memo 可以缓存一个不需要频繁渲染更新的组件

简单理解： useCallback 与 useMemo 一个缓存的是函数，一个缓存的是函数的返回值。

1. useCallback 是来优化子组件的，防止子组件的重复渲染。

2. useMemo 可以优化当前组件也可以优化子组件，优化当前组件主要是通过 memoize 来将一些复杂计算逻辑的结果进行缓存。

### 6. useReducer

### 7. useLayoutEffect

### 8. useRef

```ts
interface MutableRefObject<T> {
	current: T;
}
```

1. 作用一：多次渲染之间的纽带

useRef 会在所有的 render 中保持对返回值的**唯一引用**。因为所有对 ref 的赋值和取值拿到的都是最终的状态，并不会因为不同的 render 中存在不同的隔离。

**修改 useRef 返回的值并不会引起 react 进行重新渲染执行函数**，可以配合 useEffect 查询页面是首次渲染还是更新。而且 useRef 类似于 react 中的全局变量并不存在不同次 render 中的 state/props 的作用域隔离机制。这就是 useRef 和 useState 这两个 hook 主要的区别。 2. 作用二：获取 DOM 元素

配合 React.forwardRef，可以做 refs 转发。

### 函数组件的状态

#### React16 之前的函数组件没有状态

众所周知，在 hooks 出现/在 react 16 之前，函数组件通常只考虑负责 UI 的渲染，没有自身的状态没有业务逻辑代码，是一个纯函数，它的输出只由参数 props 决定。这种函数组件一旦我们需要给组件加状态，那就只能将组件重写为类组件，因为函数组件没有实例，没有生命周期。所以我们说在 hooks 之前的函数组件和类组件最大的区别又是状态的有无。

为什么函数组件没有状态呢？函数组件和类组件的区别在于原型上是否有 render 这一方法。react 渲染时，调用类组件的 render 方法。而**函数组件的 render 就是函数本身**，执行完之后，内部的变量就会被销毁，当组件重新渲染时，无法获取到之前的状态。而类组件与函数组件不同，在第一次渲染时，会生成一个类组件的实例，渲染调用的是 render 方法。重新渲染时，会获取到类组件的实例引用，在不同的生命周期调用类组件对应的方法。

#### 为什么 react 16 之后函数组件有状态

众所周知，react 16 做的最大改动就是 fiber。为了适配 fiber，节点（fiber node）的数据结构做了很大的改动。

#### react 如何知道当前的状态属于哪个组件

1. 在 react 的 render 流程中打个断点，可以看到函数组件有一个特殊的 render 方法 renderWithHooks。方法有 6 个参数：current、workInProgress、component、 props、secondArg、nextRenderExpirationTime。

> 为了方便理解，简单说一下，react 有两个比较关键的数据 current，workInProgress，分别代表当前页面渲染的 fiber node，触发更新之后计算差别的 fiber node。「全部计算完成之后，current 就会指向 workInProgress，用于渲染」。

2. 在执行 renderWithHooks 的时候，会用变量 currentlyRenderingFiber$1 记录当前的 fiber node。于是在执行函数组件的时候，useState 方法就能拿到到当前 node 的状态。将状态插入到对应 node 的 memoizedState 字段中。同时返回的触发 state 改变的方法因为闭包，在执行变更时，也知道是哪个 fiber node。「renderWithHooks 只用于函数组件的渲染。」

3. 从 memoizeState 字段的值看出，函数组件和类组件的 state 存储的数据结构不一样了。「类组件是简单的数据对象」，而「函数组件是单向链表」。

4. 调用 useState 的时候，会利用 currentlyRenderingFiber$1 拿到当前组件的 fiber node，并挂载数据到节点上的 memoizedState 的字段上。这样函数组件就有了状态。

5. useState 还会返回对应的 state 和修改 state 的方法。修改 state 的方法 dispatchAction 绑定了当前的 fiber node，同时还有当前更新状态的 action queue。当调用 setXXX 方法更新组件 state 的时候，会生成需要更新的数据，包装好数据结构之后，推到 state 中的 queue 中。

6. scheduleWork 会触发 react 更新，这样组件需要重新渲染。整体的流程和初次挂载的时候基本一致，但是从 mountState 方法体的实现来看，组件渲染是使用 initialState。这样肯定是有问题的。从此可以推断，在前置步骤中，肯定有标示当前组件不是初次挂载，需要替换 useState 的实现方法。于是在 renderWithHooks 中找到了答案。-- 如果当前 current 不为 null，且有 state，说明当前组件是更新，需要执行的更新 state，否则就是初次挂载。

7. 在 renderWithHooks 方法中，会修改 ReactCurrentDispatcher，也就导致了 useState 对应的方法体不一样。HooksDispatcherOnUpdateInDEV 中的 useState 方法调用是 updateState。这个方法会忽略 initState，选择从 fiber node 的 state 中去获取当前状态。

8. 综上 5、6、7，state**更新**的过程：setXXX 会在当前 state 的 queue 里面插入一个 update action，并通知 react，当前有组件状态需要更新。在更新的时候，useState 的方法体和初始挂载的方法体不一样，更新的时候会忽略 useState 传递的 initState，从节点数据的 baseState 中获取初始数据，并一步步执行 queue 里的 update action，直至 queue 队列为空，或者 queue 执行完。

#### 为什么有时候函数组件状态不同步

```jsx
import React, { useState } from "react";
​
const Counter = () => {
  const [counter, setCounter] = useState(0);
​
  const onAlertButtonClick = () => {
    setTimeout(() => {
      alert("Value: " + counter);
    }, 3000);
  };
​
  return (
    <div>
      <p>You clicked {counter} times.</p>
      <button onClick={() => setCounter(counter + 1)}>Click me</button>
      <button onClick={onAlertButtonClick}>
        Show me the value in 3 seconds
      </button>
    </div>
  );
};
​
export default Counter;
```

在一秒内点击按钮，无论点击多少次，最终页面返回都会是 1。原因：「setTimeout 闭包了当前状态 num」，在执行 update state 的时候，对应的 baseState 其实一直没有更新，仍然是旧的，也就是 0，所以多次点击，仍然是 0 + 1 = 1。修改的方式：

1. 把传入的参数变为函数：`setNum((state) => state + 1);`，这样 react 在执行 queue 的时候，会传递上一步的 state 值到当前函数中。
2. 使用 useRef，使用一个全局的变量。

个人理解，由于 Fiber 时间切片，每次渲染时的 state 都是「独立的」，并且是「确定的/固定的」，只存在于这一次 render，setTimeout 因为闭包的原因访问的是固定的，已经确定的 state，所以会出现这种情况。

### HOC、Render props、Hooks 三种模式的优缺点

#### HOC 高阶组件

接收一个组件, 返回一个使用了该组件的新组件.

1. 创建一个函数, 该函数接收一个组件作为输入除了组件, 还可以传递其他的参数.
2. 基于该组件返回了一个不同的组件.

-   HOC 的优点：不会影响内层组件的状态, 降低了耦合度.
-   HOC 的缺点：1. 固定的 props 可能会被覆盖; 2. 它无法清晰地标识数据的来源.

#### Render props

将一个组件内的 state 作为 props 传递给调用者, 调用者可以动态的决定如何渲染.

1. 接收一个外部传递进来的 props 属性.
2. 将内部的 state 作为参数传递给调用组件的 props 属性方法.

缺点:

1. 无法在 return 语句外访问数据, 不允许在 return 语句之外使用它的数据.
2. 很容易导致嵌套地狱.

#### Hook

解决了上面 hoc 和 render props 的缺点.

-   hook 可以重命名.
-   hook 会清晰地标注来源.

-   hook 可以让你在 return 之外使用数据.
-   hook 不会嵌套.
-   简单易懂, 对比 hoc 和 render props 两种方式, 它非常直观, 也更容易理解.
