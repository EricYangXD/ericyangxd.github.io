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
-   在 class 状态中，通过一个实例化的 class，去维护组件中的各种状态；但是在 function 组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收。
-   对于 class 组件，我们只需要实例化一次，实例中保存了组件的 state 等状态。对于每一次更新只需要调用 render 方法就可以。但是在 function 组件中，每一次更新都是一次新的函数执行，为了保存一些状态，执行一些副作用钩子，react-hooks 应运而生，去帮助记录组件的状态，处理一些额外的副作用。
-   对于 function 组件是什么时候执行的呢？function 组件初始化：

```js
// react-reconciler/src/ReactFiberBeginWork.js
renderWithHooks(
	null, // current Fiber
	workInProgress, // workInProgress Fiber
	Component, // 函数组件本身
	props, // props
	context, // 上下文
	renderExpirationTime // 渲染 ExpirationTime
);
```

-   对于初始化是没有 current 树的，之后完成一次组件更新后，会把当前 workInProgress 树赋值给 current 树。
-   所有的函数组件执行，都是在这里方法中，首先我们应该明白几个感念，这对于后续我们理解 useState 是很有帮助的。

    1. current fiber 树: 当完成一次渲染之后，会产生一个 current 树,current 会在 commit 阶段替换成真实的 Dom 树。
    2. workInProgress fiber 树: 即将调和渲染的 fiber 树。再一次新的组件更新过程中，会从 current 复制一份作为 workInProgress,更新完毕后，将当前的 workInProgress 树赋值给 current 树。
    3. workInProgress.memoizedState: 在 class 组件中，memoizedState 存放 state 信息，在 function 组件中，这里可以提前透漏一下，memoizedState 在一次调和渲染过程中，以链表的形式存放 hooks 信息。
    4. workInProgress.expirationTime: react 用不同的 expirationTime,来确定更新的优先级。
    5. currentHook : 可以理解 current 树上的指向的当前调度的 hooks 节点。
    6. workInProgressHook : 可以理解 workInProgress 树上指向的当前调度的 hooks 节点。

-   renderWithHooks 函数主要作用:

    1. 首先先置空即将调和渲染的 workInProgress 树的 memoizedState 和 updateQueue，为什么这么做，因为在接下来的函数组件执行过程中，要把新的 hooks 信息挂载到这两个属性上，然后在组件 commit 阶段，将 workInProgress 树替换成 current 树，替换真实的 DOM 元素节点。并在 current 树保存 hooks 信息。
    2. 然后根据当前函数组件是否是第一次渲染，赋予 ReactCurrentDispatcher.current 不同的 hooks,终于和上面讲到的 ReactCurrentDispatcher 联系到一起。对于第一次渲染组件，那么用的是 HooksDispatcherOnMount hooks 对象。对于渲染后，需要更新的函数组件，则是 HooksDispatcherOnUpdate 对象，那么两个不同就是通过 current 树上是否 memoizedState（hook 信息）来判断的。如果 current 不存在，证明是第一次渲染函数组件。
    3. 接下来，调用`Component(props, secondArg);`执行我们的函数组件，我们的函数组件在这里真正的被执行了，然后我们写的 hooks 被依次执行，把 hooks 信息依次保存到 workInProgress 树上。
    4. 接下来，也很重要，将 ContextOnlyDispatcher 赋值给 ReactCurrentDispatcher.current，由于 js 是单线程的，也就是说我们没有在函数组件中，调用的 hooks，都是 ContextOnlyDispatcher 对象上 hooks，react-hooks 就是通过这种函数组件执行赋值不同的 hooks 对象方式，判断在 hooks 执行是否在函数组件内部，捕获并抛出异常的。

-   初始化阶段 react-hooks 做的事情：在一个函数组件第一次渲染执行上下文过程中，每个 react-hooks 执行，都会调用`mountWorkInProgressHook()`产生一个 hook 对象=>`workInProgressHook`，并形成链表结构，绑定在 workInProgress 的 memoizedState 属性上，然后 react-hooks 上的状态，绑定在当前 hooks 对象的 memoizedState 属性上。对于 effect 副作用钩子，会绑定在 workInProgress.updateQueue 上，等到 commit 阶段，dom 树构建完成，再执行每个 effect 副作用钩子。
-   hook 对象中都保留了哪些信息:

    -   memoizedState： useState 中 保存 state 信息 ｜ useEffect 中 保存着 effect 对象 ｜ useMemo 中 保存的是缓存的值和 deps ｜ useRef 中保存的是 ref 对象。
    -   baseState : usestate 和 useReducer 中 保存最新的更新队列。
    -   baseState ： usestate 和 useReducer 中,一次更新中 ，产生的最新 state 值。
    -   queue ：保存待更新队列 pendingQueue ，更新函数 dispatch 等信息。
    -   next: 指向下一个 hooks 对象。

-   一旦在条件语句中声明 hooks，在下一次函数组件更新，hooks 链表结构，将会被破坏，current 树的 memoizedState 缓存 hooks 信息，和当前 workInProgress 不一致，如果涉及到读取 state 等操作，就会发生异常。
-   hooks 通过什么来证明唯一性的，答案 ，通过 hooks 链表顺序。
-   在无状态组件中，useState 和 useReducer 触发函数更新的方法都是 dispatchAction,useState，可以看成一个简化版的 useReducer。
-   dispatchAction 第一个参数和第二个参数，已经被 bind 给改成 currentlyRenderingFiber 和 queue,我们传入的参数是第三个参数 action。
-   无论是类组件调用 setState,还是函数组件的 dispatchAction ，都会产生一个 update 对象，里面记录了此次更新的信息，然后将此 update 放入待更新的 pending 队列中，dispatchAction 第二步就是判断当前函数组件的 fiber 对象是否处于渲染阶段，如果处于渲染阶段，那么不需要我们在更新当前函数组件，只需要更新一下当前 update 的 expirationTime 即可。
-   如果当前 fiber 没有处于更新阶段。那么通过调用 lastRenderedReducer 获取最新的 state,和上一次的 currentState，进行浅比较，如果相等，那么就退出，这就证实了为什么 useState，两次值相等的时候，组件不渲染的原因了，这个机制和 Component 模式下的 setState 有一定的区别。
-   如果两次 state 不相等，那么调用 scheduleUpdateOnFiber 调度渲染当前 fiber，scheduleUpdateOnFiber 是 react 渲染更新的主要函数。
-   对于更新阶段，说明上一次 workInProgress 树已经赋值给了 current 树。存放 hooks 信息的 memoizedState，此时已经存在 current 树上，react 对于 hooks 的处理逻辑和 fiber 树逻辑类似。
-   对于一次函数组件更新，当再次执行 hooks 函数的时候，比如 useState(0) ，首先要从 current 的 hooks 中找到与当前 workInProgressHook 对应的 currentHooks，然后复制一份 currentHooks 给 workInProgressHook，接下来 hooks 函数执行的时候，把最新的状态更新到 workInProgressHook，保证 hooks 状态不丢失。
-   所以函数组件每次更新，每一次 react-hooks 函数执行，都需要有一个函数去做上面的操作，这个函数就是 `updateWorkInProgressHook()`=>`workInProgressHook`。
-   首先如果是第一次执行 hooks 函数，那么从 current 树上取出 memoizedState ，也就是旧的 hooks。
-   然后声明变量 nextWorkInProgressHook，这里应该值得注意，正常情况下，一次 renderWithHooks 执行，workInProgress 上的 memoizedState 会被置空，hooks 函数顺序执行，nextWorkInProgressHook 应该一直为 null，那么什么情况下 nextWorkInProgressHook 不为 null，也就是当一次 renderWithHooks 执行过程中，执行了多次函数组件 -- 实际就是判定，如果当前函数组件执行后，当前函数组件的还是处于渲染优先级，说明函数组件又有了新的更新任务，那么循坏执行函数组件。这就造成了上述的，nextWorkInProgressHook 不为 null 的情况。
-   最后复制 current 的 hooks，把它赋值给 workInProgressHook，用于更新新的一轮 hooks 状态。

### 1. useState

-   类似 this.setState，用于函数组件中。每当 state/props 发生修改时，该函数组件都会重新渲染/执行。

-   每次改变 state/props 造成函数组件重新渲染/执行，从而每次渲染函数中的 state/props 都是独立的，固定的，确定的 -- 只在这一次渲染过程中存在。

-   对于 setState 的更新机制，究竟是同步还是异步。也就是所谓是否是批量更新，可以把握这个原则：

    1. 凡是 React 可以管控的地方，他就是异步批量更新。比如事件函数，生命周期函数中，组件内部同步代码。
    2. 凡是 React 不能管控的地方，就是同步批量更新。比如 setTimeout，setInterval，源生 DOM 事件中，包括 Promise 中都是同步批量更新。

-   useState，两次值相等的时候，组件不渲染。如果两次 state 不相等，那么调用 scheduleUpdateOnFiber 调度渲染当前 fiber。
-   无状态组件中 fiber 对象 memoizedState 保存当前的 hooks 形成的「链表」。因为是链表保存，所以 hooks 不能用在条件判断里。

-   有两个 memoizedState：

    1. workInProgress / current 树上的 memoizedState 保存的是当前函数组件每个 hooks 形成的链表。
    2. 每个 hooks 上的 memoizedState 保存了当前 hooks 信息，不同种类的 hooks 的 memoizedState 内容不同。

-   实现一个 useState
<!-- TODO -->

1. 简易版，利用函数闭包和数组下标实现 state 和 stateSetter 一一对应

```js
let states = [];
let setters = [];
let firstRun = true;
// 使用时，每次都要重置 cursor
let cursor = 0;

//  使用工厂模式生成一个 createSetter，通过 cursor 指定指向的是哪个 state
function createSetter(cursor) {
	return function (newVal) {
		// 闭包
		states[cursor] = newVal;
	};
}

function useState(initVal) {
	// 首次
	if (firstRun) {
		states.push(initVal);
		setters.push(createSetter(cursor));
		firstRun = false;
	}
	let state = states[cursor];
	let setter = setters[cursor];
	// 光标移动到下一个位置
	cursor++;
	// 返回
	return [state, setter];
}
```

2. 进阶版：使用链表

```js
// workInProgressHook 指针，指向当前 hook 对象
let workInProgressHook = null;
// workInProgressHook fiber，这里指的是 App 组件
let fiber = {
	stateNode: App, // App 组件
	memoizedState: null, // hooks 链表，初始为 null
};
// 是否是首次渲染
let isMount = true;

// 调度函数，模拟 react scheduler
function schedule() {
	workInProgressHook = fiber.memoizedState;
	const app = fiber.stateNode();
	isMount = false;
	return app;
}

function useState(initVal) {
	let hook;
	// 首次会生成 hook 对象，并形成链表结构，绑定在 workInProgress 的 memoizedState 属性上
	if (isMount) {
		// 每个 hook 对象，例如 state hook、memo hook、ref hook 等
		hook = {
			memoizedState: initVal, // 当前state的值，例如 useState(initVal)
			action: null, // update 函数
			next: null, // 因为是采用链表的形式连接起来，next指向下一个 hook
		};
		// 绑定在 workInProgress 的 memoizedState 属性上
		if (!fiber.memoizedState) {
			// 如果是第一个 hook 对象
			fiber.memoizedState = hook;
		} else {
			// 如果不是, 将 hook 追加到链尾
			workInProgressHook.next = hook;
		}
		// 指针指向当前 hook，链表尾部，最新 hook
		workInProgressHook = hook;
	} else {
		// 拿到当前的 hook
		hook = workInProgressHook;
		// workInProgressHook 指向链表的下一个 hook
		workInProgressHook = workInProgressHook.next;
	}
	// 状态更新，拿到 current hook，调用 action 函数，更新到最新 state
	let baseState = hook.memoizedState;
	// 执行 update
	if (hook.action) {
		// 更新最新值
		let action = hook.action;
		// 如果是 setNum(num=>num+1) 形式
		if (typeof action === "function") {
			baseState = action(baseState);
		} else {
			baseState = action;
		}
		// 清空 action
		hook.action = null;
	}
	// 更新最新值
	hook.memoizedState = baseState;
	// 返回最新值 baseState、dispatchAction
	return [baseState, dispatchAction(hook)];
}

// action 函数
function dispatchAction(hook) {
	return function (action) {
		hook.action = action;
	};
}

// 使用
function App() {
	const [num, setNum] = useState(0);
	return {
		onClick() {
			console.log("num: ", num);
			setNum(num + 1);
		},
	};
}

// 测试结果
schedule().onClick(); // 'num: ' 0
schedule().onClick(); // 'num: ' 1
schedule().onClick(); // 'num: ' 2
```

3. 优化版：useState 是如何更新的

<!-- TODO -->

### 2. useEffect

-   可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
-   useEffect 的设计理念本身就比较推荐我们把依赖函数直接放在 useEffect 内部。
-   无状态组件中 fiber 对象 memoizedState 保存当前的 hooks 形成的链表。而 updateQueue 保存的是 effect 副作用钩子。

-   对于无法移动到 useEffect 内部的函数：
    1.  尝试把函数移到组件外、
    2.  对于纯计算，可以在 effect 之外调用它，让 effect 依赖他的返回值、
    3.  万不得已时，将函数加入 effect 的依赖，并使用 useCallback 包裹该函数，确保他不随渲染而改变，除非函数的依赖发生变化。
-   useEffect VS useLayoutEffect：
    1. 默认情况下，useEffect 将**在每轮渲染结束后异步执行**，不同于 class Component 中的 componentDidUpdate 和 componentDidMount 在渲染后同步执行，useEffect 不会阻塞浏览器的渲染。
    2. useLayoutEffect 的作用几乎与 useEffect 一致，不同的是，useLayoutEffect 是**同步执行**的，与 componentDidUpdate 和 componentDidMount 执行机制一样，在 DOM 更新后，在浏览器渲染这些更改之前，立即执行。
-   effect list 可以理解为是一个存储 effectTag 副作用列表容器。它是由 fiber 节点和指针 nextEffect 构成的单链表结构，这其中还包括第一个节点 firstEffect ，和最后一个节点 lastEffect。 React 采用深度优先搜索算法，在 render 阶段遍历 fiber 树时，把每一个有副作用的 fiber 筛选出来，最后构建生成一个只带副作用的 effect list 链表。在 commit 阶段，React 拿到 effect list 数据后，通过遍历 effect list，并根据每一个 effect 节点的 effectTag 类型，执行每个 effect，从而对相应的 DOM 树执行更改。

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
