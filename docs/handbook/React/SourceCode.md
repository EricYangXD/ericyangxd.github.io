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

## hooks

-   简单了解一下原理啥的

### 1. useState

### 2. useEffect

-   可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
-   useEffect 的设计理念本身就比较推荐我们把依赖函数直接放在 useEffect 内部。

-   对于无法移动到 useEffect 内部的函数：
    -   尝试把函数移到组件外、
    -   对于纯计算，可以在 effect 之外调用它，让 effect 依赖他的返回值、
    -   万不得已时，将函数加入 effect 的依赖，并使用 useCallback 包裹该函数，确保他不随渲染而改变，除非函数的依赖发生变化。

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

### 6. useReducer

### 7. useLayoutEffect

### 8. useRef
