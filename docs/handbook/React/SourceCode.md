---
title: React源码阅读笔记
author: EricYangXD
date: "2021-12-28"
---

## 为什么要读源码？

- 废话，为了找工作呗。

## 怎么读源码？

- 先宏观的了解整个项目的结构，然后根据由易到难的顺序一边阅读一边调试。

## 笔记

### 生命周期

类组件的生命周期，分为组件初始化/挂载，组件更新，组件销毁三个阶段。

#### 组件初始化/挂载阶段

主要分成 render 阶段和 commit 阶段。以 render 函数执行完为分界。

1. constructor 执行：
   1. 在 mount 阶段，首先执行的 constructClassInstance 函数，用来实例化 React 组件。
   2. 在实例化组件之后，会调用 mountClassInstance 组件初始化。
2. getDerivedStateFromProps 执行：
   1. 它是从 ctor 类（类组件）上直接绑定的静态方法，传入 props、state。 返回值将和之前的 state 合并，作为新的 state，传递给组件实例使用。
3. componentWillMount 执行：
   1. 如果存在 getDerivedStateFromProps 和 getSnapshotBeforeUpdate 就不会执行生命周期 componentWillMount。
4. render 函数执行
   1. 到此为止 mountClassInstancec 函数完成，但是上面 updateClassComponent 函数， 在执行完 mountClassInstancec 后，执行了 render 渲染函数，形成了 children ， 接下来 React 调用 reconcileChildren 方法深度调和 children 。
5. componentDidMount 执行：
   1. 一旦 React 调和完所有的 fiber 节点，就会到 commit 阶段，在组件初始化 commit 阶段，会调用 componentDidMount 生命周期。
   2. componentDidMount 执行时机 和 componentDidUpdate 执行时机是相同的，都是在 commitLifeCycles 中执行，只不过一个是针对初始化，一个是针对组件再更新。

#### 组件更新阶段

进入 updateClassComponent 函数，当发现 current 不为 null 的情况时，说明该类组件被挂载过，那么直接按照更新逻辑来处理。

1. 执行生命周期 componentWillReceiveProps：
   1. 首先判断 getDerivedStateFromProps 生命周期是否存在，如果不存在就执行 componentWillReceiveProps 生命周期。传入该生命周期两个参数，分别是 newProps 和 nextContext 。
2. 执行生命周期 getDerivedStateFromProps：
   1. 返回的值用于合并 state，生成新的 state。
3. 执行生命周期 shouldComponentUpdate：
   1. 传入新的 props ，新的 state ，和新的 context ，返回值决定是否继续执行 render 函数，调和子节点。这里应该注意一个问题，getDerivedStateFromProps 的返回值可以作为新的 state ，传递给 shouldComponentUpdate 。
4. 执行生命周期 componentWillUpdate：updateClassInstance 方法到此执行完毕了。
5. 执行 render 函数：得到最新的 React element 元素。然后继续调和子节点。
6. 执行 getSnapshotBeforeUpdate：getSnapshotBeforeUpdate 的执行也是在 commit 阶段，commit 阶段细分为 before Mutation( DOM 修改前)，Mutation ( DOM 修改)，Layout( DOM 修改后) 三个阶段，getSnapshotBeforeUpdate 发生在 before Mutation 阶段，生命周期的返回值，将作为第三个参数 \_\_reactInternalSnapshotBeforeUpdate 传递给 componentDidUpdate 。
7. 执行 componentDidUpdate：此时 DOM 已经修改完成。可以操作修改之后的 DOM 。到此为止更新阶段的生命周期执行完毕。

其中：父组件 render/props 改变时会从 componentWillReceiveProps 开始；执行 setState 时会先 getDerivedStateFromProps，然后执行 shouldComponentUpdate 开始；forceUpdate 的时候先 getDerivedStateFromProps，然后执行 render。

- Q:当 props 不变的前提下， PureComponent 组件能否阻止 componentWillReceiveProps 执行？
- A:答案是否定的，componentWillReceiveProps 生命周期的执行，和纯组件没有关系，纯组件是在 componentWillReceiveProps 执行之后浅比较 props 是否发生变化。所以 PureComponent 下不会阻止该生命周期的执行。该生命周期执行驱动是因为父组件更新带来的 props 修改，但是只要父组件触发 render 函数，调用 React.createElement 方法，那么 props 就会被重新创建，生命周期 componentWillReceiveProps 就会执行了。所以有时即使 props 没变，该生命周期也会执行。

#### 组件销毁阶段

1. 执行生命周期 componentWillUnmount：
   1. 在一次调和更新中，如果发现元素被移除，就会打对应的 Deletion 标签 ，然后在 commit 阶段就会调用 componentWillUnmount 生命周期，接下来统一卸载组件以及 DOM 元素。发生在 commit 阶段，主要做一些收尾工作，比如清除一些可能造成内存泄漏的定时器，延时器，或者是一些事件监听器。跟 Vue 的 beforeDestroy 不一样。

### TODO

### Fiber 原理

## 问题

### 为什么不能将 hooks 写到 if else 语句中？

官网：「确保 Hook 在每一次渲染中都按照相同的顺序被调用！让 React 在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确。」

React 用了链表这种数据结构来存储 FunctionComponent 里面的 hooks，在组件第一次渲染的时候，为每个 hooks 都创建了一个对象，最终形成了一个链表。

Hook 对象的 memoizedState 属性就是用来存储组件上一次更新后的 state，next 毫无疑问是指向下一个 hook 对象。在组件更新的过程中，hooks 函数执行的顺序是不变的，就可以根据这个链表拿到当前 hooks 对应的 Hook 对象，函数式组件就是这样拥有了 state 的能力。

所以，知道为什么不能将 hooks 写到 if else 语句中了吧？因为这样可能会导致顺序错乱，导致当前 hooks 拿到的不是自己对应的 Hook 对象。

## hooks

- 简单了解一下原理啥的
- 在 class 状态中，通过一个实例化的 class，去维护组件中的各种状态；但是在 function 组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收。
- 对于 class 组件，我们只需要实例化一次，实例中保存了组件的 state 等状态。对于每一次更新只需要调用 render 方法就可以。但是在 function 组件中，每一次更新都是一次新的函数执行，为了保存一些状态，执行一些副作用钩子，react-hooks 应运而生，去帮助记录组件的状态，处理一些额外的副作用。
- 对于 function 组件是什么时候执行的呢？function 组件初始化：

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

- 对于初始化是没有 current 树的，之后完成一次组件更新后，会把当前 workInProgress 树赋值给 current 树。
- 所有的函数组件执行，都是在这里方法中，首先我们应该明白几个感念，这对于后续我们理解 useState 是很有帮助的。

  1. current fiber 树: 当完成一次渲染之后，会产生一个 current 树,current 会在 commit 阶段替换成真实的 Dom 树。
  2. workInProgress fiber 树: 即将调和渲染的 fiber 树。再一次新的组件更新过程中，会从 current 复制一份作为 workInProgress,更新完毕后，将当前的 workInProgress 树赋值给 current 树。
  3. workInProgress.memoizedState: 在 class 组件中，memoizedState 存放 state 信息，在 function 组件中，这里可以提前透漏一下，memoizedState 在一次调和渲染过程中，以链表的形式存放 hooks 信息。
  4. workInProgress.expirationTime: react 用不同的 expirationTime，来确定更新的优先级。
  5. currentHook : 可以理解 current 树上的指向的当前调度的 hooks 节点。
  6. workInProgressHook : 可以理解 workInProgress 树上指向的当前调度的 hooks 节点。

- renderWithHooks 函数主要作用:

  1. 首先先置空即将调和渲染的 workInProgress 树的 memoizedState 和 updateQueue，为什么这么做，因为在接下来的函数组件执行过程中，要把新的 hooks 信息挂载到这两个属性上，然后在组件 commit 阶段，将 workInProgress 树替换成 current 树，替换真实的 DOM 元素节点。并在 current 树保存 hooks 信息。
  2. 然后根据当前函数组件是否是第一次渲染，赋予 ReactCurrentDispatcher.current 不同的 hooks,终于和上面讲到的 ReactCurrentDispatcher 联系到一起。对于第一次渲染组件，那么用的是 HooksDispatcherOnMount hooks 对象。对于渲染后，需要更新的函数组件，则是 HooksDispatcherOnUpdate 对象，那么两个不同就是通过 current 树上是否 memoizedState（hook 信息）来判断的。如果 current 不存在，证明是第一次渲染函数组件。
  3. 接下来，调用`Component(props, secondArg);`执行我们的函数组件，我们的函数组件在这里真正的被执行了，然后我们写的 hooks 被依次执行，把 hooks 信息依次保存到 workInProgress 树上。
  4. 接下来，也很重要，将 ContextOnlyDispatcher 赋值给 ReactCurrentDispatcher.current，由于 js 是单线程的，也就是说我们没有在函数组件中，调用的 hooks，都是 ContextOnlyDispatcher 对象上 hooks，react-hooks 就是通过这种函数组件执行赋值不同的 hooks 对象方式，判断在 hooks 执行是否在函数组件内部，捕获并抛出异常的。

- 初始化阶段 react-hooks 做的事情：在一个函数组件第一次渲染执行上下文过程中，每个 react-hooks 执行，都会调用`mountWorkInProgressHook()`产生一个 hook 对象=>`workInProgressHook`，并形成链表结构，绑定在 workInProgress 的 memoizedState 属性上，然后 react-hooks 上的状态，绑定在当前 hooks 对象的 memoizedState 属性上。对于 effect 副作用钩子，会绑定在 workInProgress.updateQueue 上，等到 commit 阶段，dom 树构建完成，再执行每个 effect 副作用钩子。
- hook 对象中都保留了哪些信息:

  - memoizedState： useState 中 保存 state 信息 ｜ useEffect 中 保存着 effect 对象 ｜ useMemo 中 保存的是缓存的值和 deps ｜ useRef 中保存的是 ref 对象。
  - baseState : usestate 和 useReducer 中 保存最新的更新队列。
  - baseState ： usestate 和 useReducer 中,一次更新中 ，产生的最新 state 值。
  - queue ：保存待更新队列 pendingQueue ，更新函数 dispatch 等信息。
  - next: 指向下一个 hooks 对象。

- 一旦在条件语句中声明 hooks，在下一次函数组件更新，hooks 链表结构，将会被破坏，current 树的 memoizedState 缓存 hooks 信息，和当前 workInProgress 不一致，如果涉及到读取 state 等操作，就会发生异常。
- hooks 通过什么来证明唯一性的，答案 ，通过 hooks 链表顺序。
- 在无状态组件中，useState 和 useReducer 触发函数更新的方法都是 dispatchAction,useState，可以看成一个简化版的 useReducer。
- dispatchAction 第一个参数和第二个参数，已经被 bind 给改成 currentlyRenderingFiber 和 queue,我们传入的参数是第三个参数 action。
- 无论是类组件调用 setState,还是函数组件的 dispatchAction ，都会产生一个 update 对象，里面记录了此次更新的信息，然后将此 update 放入待更新的 pending 队列中，dispatchAction 第二步就是判断当前函数组件的 fiber 对象是否处于渲染阶段，如果处于渲染阶段，那么不需要我们在更新当前函数组件，只需要更新一下当前 update 的 expirationTime 即可。
- 如果当前 fiber 没有处于更新阶段。那么通过调用 lastRenderedReducer 获取最新的 state,和上一次的 currentState，进行浅比较，如果相等，那么就退出，这就证实了为什么 useState，两次值相等的时候，组件不渲染的原因了，这个机制和 Component 模式下的 setState 有一定的区别。
- 如果两次 state 不相等，那么调用 scheduleUpdateOnFiber 调度渲染当前 fiber，scheduleUpdateOnFiber 是 react 渲染更新的主要函数。
- 对于更新阶段，说明上一次 workInProgress 树已经赋值给了 current 树。存放 hooks 信息的 memoizedState，此时已经存在 current 树上，react 对于 hooks 的处理逻辑和 fiber 树逻辑类似。
- 对于一次函数组件更新，当再次执行 hooks 函数的时候，比如 useState(0) ，首先要从 current 的 hooks 中找到与当前 workInProgressHook 对应的 currentHooks，然后复制一份 currentHooks 给 workInProgressHook，接下来 hooks 函数执行的时候，把最新的状态更新到 workInProgressHook，保证 hooks 状态不丢失。
- 所以函数组件每次更新，每一次 react-hooks 函数执行，都需要有一个函数去做上面的操作，这个函数就是 `updateWorkInProgressHook()`=>`workInProgressHook`。
- 首先如果是第一次执行 hooks 函数，那么从 current 树上取出 memoizedState ，也就是旧的 hooks。
- 然后声明变量 nextWorkInProgressHook，这里应该值得注意，正常情况下，一次 renderWithHooks 执行，workInProgress 上的 memoizedState 会被置空，hooks 函数顺序执行，nextWorkInProgressHook 应该一直为 null，那么什么情况下 nextWorkInProgressHook 不为 null，也就是当一次 renderWithHooks 执行过程中，执行了多次函数组件 -- 实际就是判定，如果当前函数组件执行后，当前函数组件的还是处于渲染优先级，说明函数组件又有了新的更新任务，那么循坏执行函数组件。这就造成了上述的，nextWorkInProgressHook 不为 null 的情况。
- 最后复制 current 的 hooks，把它赋值给 workInProgressHook，用于更新新的一轮 hooks 状态。

### 1. useState

- 类似 this.setState，用于函数组件中。每当 state/props 发生修改时，该函数组件都会重新渲染/执行。
- 每次改变 state/props 造成函数组件重新渲染/执行，从而每次渲染函数中的 state/props 都是独立的，固定的，确定的 -- 只在这一次渲染过程中存在。
- 每次调用 useState 返回的值都不是同一个对象，他们的内存地址不同！是由上一次的 prev state 与 update 进行合并得到的新的 current state。
- 对于 setState 的更新机制，究竟是同步还是异步。也就是所谓是否是批量更新，可以把握这个原则：
  1. 凡是 React 可以管控的地方，他就是异步批量更新。比如事件函数，生命周期函数中，组件内部同步代码。
  2. 凡是 React 不能管控的地方，就是同步批量更新。比如 setTimeout，setInterval，源生 DOM 事件中，包括 Promise 中都是同步批量更新。
- useState，两次值相等的时候，组件不渲染。如果两次 state 不相等，那么调用 scheduleUpdateOnFiber 调度渲染当前 fiber。
- 无状态组件中 fiber 对象 memoizedState 保存当前的 hooks 形成的「链表」。因为是链表保存，所以 hooks 不能用在条件判断里。
- 有两个 memoizedState：
  1. workInProgress / current 树上的 memoizedState 保存的是当前函数组件每个 hooks 形成的链表。
  2. 每个 hooks 上的 memoizedState 保存了当前 hooks 信息，不同种类的 hooks 的 memoizedState 内容不同。
- 实现一个 useState

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

- 可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。
- useEffect 的设计理念本身就比较推荐我们把依赖函数直接放在 useEffect 内部。
- 无状态组件中 fiber 对象 memoizedState 保存当前的 hooks 形成的链表。而 updateQueue 保存的是 effect 副作用钩子。

- 对于无法移动到 useEffect 内部的函数：
  1.  尝试把函数移到组件外、
  2.  对于纯计算，可以在 effect 之外调用它，让 effect 依赖他的返回值、
  3.  万不得已时，将函数加入 effect 的依赖，并使用 useCallback 包裹该函数，确保他不随渲染而改变，除非函数的依赖发生变化。
- useEffect VS useLayoutEffect：
  1. 默认情况下，「useEffect」 将在**每轮渲染结束后异步执行**，不同于 class Component 中的 componentDidUpdate 和 componentDidMount 在渲染后同步执行，**useEffect 不会阻塞浏览器的渲染**。
  2. useLayoutEffect 的作用几乎与 useEffect 一致，不同的是，「useLayoutEffect」 是**渲染前同步执行**的，与 componentDidUpdate 和 componentDidMount 执行机制一样，在 **DOM 更新后，在浏览器渲染这些更改之前**，立即执行。
- effect list 可以理解为是一个存储 effectTag 副作用列表容器。它是由 fiber 节点和指针 nextEffect 构成的单链表结构，这其中还包括第一个节点 firstEffect ，和最后一个节点 lastEffect。 React 采用深度优先搜索算法，在 render 阶段遍历 fiber 树时，把每一个有副作用的 fiber 筛选出来，最后构建生成一个只带副作用的 effect list 链表。在 commit 阶段，React 拿到 effect list 数据后，通过遍历 effect list，并根据每一个 effect 节点的 effectTag 类型，执行每个 effect，从而对相应的 DOM 树执行更改。

### 3. useContext

- 如果你只是想避免层层传递一些属性，组件组合（component composition）有时候是一个比 context 更好的解决方案。

- createContext 创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

- 只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。

- 每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

- Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

- 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。从 Provider 到其内部 consumer 组件（包括 .contextType 和 useContext）的传播不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件跳过更新的情况下也能更新。

- 通过新旧值检测来确定变化，使用了与 Object.is 相同的算法。

- 因为 context 会根据引用标识来决定何时进行渲染（本质上是 value 属性值的浅比较），所以这里可能存在一些陷阱，当 provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染。这时为了防止这种情况，可以将 value 状态提升到父节点的 state 里。
- 在 v16.3.0 之前，React 用 PropTypes 来声明 context 类型，提供者需要在 getChildContext 中返回需要提供的 context ，并且用静态属性 childContextTypes 声明需要提供的 context 数据类型。
- 在 Provider 里 value 的改变，会使引用 contextType,useContext 消费该 context 的组件重新 render ，同样会使 Consumer 的 children 函数重新执行，与前两种方式不同的是 Consumer 方式，当 context 内容改变的时候，不会让引用 Consumer 的父组件重新更新。
- Q:如何阻止 Provider value 改变造成的 children （ demo 中的 Son ）不必要的渲染？
  - A:第一种就是利用 memo，pureComponent 对子组件 props 进行浅比较处理。React.memo()
  - A:第二种就是 React 本身对 React element 对象的缓存。React 每次执行 render 都会调用 createElement 形成新的 React element 对象，如果把 React element 缓存下来，下一次调和更新时候，就会跳过该 React element 对应 fiber 的更新。React.useMemo()
- Q:context 与 props 和 react-redux 的对比？
  - 解决了 props 需要每一层都手动添加 props 的缺陷。
  - 解决了改变 value ，组件全部重新渲染的缺陷。
  - react-redux 就是通过 Provider 模式把 redux 中的 store 注入到组件中的。
- Provider 特性总结：
  1.  Provider 作为提供者传递 context ，provider 中 value 属性改变会使所有消费 context 的组件重新更新。
  2.  Provider 可以逐层传递 context，下一层 Provider 会覆盖上一层 Provider。

### 4. useCallback

- useCallback 正确用法：在 dom 上绑定事件使用普通函数，在组件上绑定、传递事件则用 useCallback，防止“父”组件渲染后导致要传递的函数也会重新生成而导致“子”组件的渲染，可能会导致 React.memo 失效。
- useCallback 与 useMemo 有些许不同，缓存的是函数本身以及它的引用地址，而不是返回值。
- 使用 useCallback 要对依赖数组做浅比较，对性能带来的负面影响，同时又提升了代码的复杂度。如果使用不当，很可能得不偿失。
- 对于 useCallback 的替代方案：
  - 「把函数移动到组件外部」
  - 「把函数移动到 useEffect 内部」
  - 「使用 userReducer 减少依赖」

```js
useCallback(callBackFn, deps);
useMemo(() => callBackFn, deps);
```

### 5. useMemo

用法：`const cacheSomething = useMemo(create,deps)`。

useMemo 原理：

- useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。
- useMemo 不只是缓存了函数的返回值，同时保证了返回值的引用地址不变。

useMemo 应用场景：

1. 可以缓存 element 对象，从而达到按条件渲染组件，优化性能的作用。
2. 如果组件中不期望每次 render 都重新计算一些值,可以利用 useMemo 把它缓存起来。
3. 可以把函数和属性缓存起来，作为 PureComponent 的绑定方法，或者配合其他 Hooks 一起使用。

- 类似 useEffect，把“创建”函数和依赖项数组作为参数传入  useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
- 记住，传入  useMemo  的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于  useEffect  的适用范畴，而不是  useMemo。
- 如果没有提供依赖项数组，useMemo  在每次渲染时都会计算新的值。
- 总结一下，useMemo 帮我们缓存了某个值，比如组件中某个数组/对象需要通过大量计算得到,而这个值依赖于某一个 state,我们希望只在依赖的 state 改变之后计算而不是任意 state 改变之后都会计算,这无疑会造成性能上的问题。
- useMemo 可以缓存某个高开销的计算函数，React.memo 可以缓存一个不需要频繁渲染更新的组件。

简单理解： useCallback 与 useMemo 一个缓存的是函数，一个缓存的是函数的返回值。

1. useCallback 是来优化子组件的，防止子组件的重复渲染。

2. useMemo 可以优化当前组件也可以优化子组件，优化当前组件主要是通过 memoize 来将一些复杂计算逻辑的结果进行缓存。

### 6. useReducer

### 7. useLayoutEffect

useLayoutEffect 和 useEffect 不同的地方是采用了同步执行，那么和 useEffect 有什么区别呢？

- 首先 useLayoutEffect 是在 DOM 更新之后，浏览器绘制之前，这样可以方便修改 DOM，获取 DOM 信息，这样浏览器只会绘制一次，如果修改 DOM 布局放在 useEffect ，那 useEffect 执行是在浏览器绘制视图之后，接下来又改 DOM，就可能会导致浏览器再次回流和重绘。而且由于两次绘制，视图上可能会造成闪现突兀的效果。
- useLayoutEffect callback 中代码执行会阻塞浏览器绘制。

一句话概括如何选择 useEffect 和 useLayoutEffect：修改 DOM ，改变布局就用 useLayoutEffect，其他情况就用 useEffect 。

- Q:React.useEffect 回调函数 和 componentDidMount / componentDidUpdate 执行时机有什么区别 ？
- A:useEffect 对 React 执行栈来看是异步执行的，而 componentDidMount / componentDidUpdate 是同步执行的，useEffect 代码不会阻塞浏览器绘制。在时机上 ，componentDidMount / componentDidUpdate 和 useLayoutEffect 更类似。
- Q:如果在 useLayoutEffect 使用 CSS-in-JS 会造成哪里问题呢？
- A: 1. 首先 useLayoutEffect 执行的时机 DOM 已经更新完成，布局也已经确定了，剩下的就是交给浏览器绘制就行了。
- A: 2. 如果在 useLayoutEffect 动态生成 style 标签，那么会再次影响布局，导致浏览器再次重绘和重排。这时候应该用 useInsertionEffect。

### V18 useInsertionEffect

useInsertionEffect 是在 React v18 新添加的 hooks ，它的用法和 useEffect 和 useLayoutEffect 一样。

- useInsertionEffect 的执行时机要比 useLayoutEffect 提前，useLayoutEffect 执行的时候 DOM 已经更新了，但是在 useInsertionEffect 的执行的时候，DOM 还没有更新。
- 本质上 useInsertionEffect 主要是解决 CSS-in-JS 在渲染中注入样式的性能问题。这个 hooks 主要是应用于这个场景，在其他场景下 React 不期望用这个 hooks。

### 8. useRef & createRef & forwardRef

什么是 ref 对象，所谓 ref 对象就是用 createRef 或者 useRef 创建出来的对象，一个标准的 ref 对象应该是如下的样子：

```js
{
    current: null , // current指向ref对象获取到的实际内容，可以是dom元素，组件实例，或者其它。
}
```

React 提供两种方法创建 Ref 对象，类组件 React.createRef，函数组件 useRef。由于函数组件每次更新都是一次新的开始，所有变量重新声明，所以 useRef 不能像 createRef 把 ref 对象直接暴露出去，如果这样每一次函数组件执行就会重新声明 Ref，此时 ref 就会随着函数组件执行被重置，这就解释了在函数组件中为什么不能用 createRef 的原因。为了解决这个问题，hooks 和函数组件对应的 fiber 对象建立起关联，将 useRef 产生的 ref 对象挂到函数组件对应的 fiber 上，函数组件每次执行，只要组件不被销毁，函数组件对应的 fiber 对象一直存在，所以 ref 等信息就会被保存下来。

```ts
interface MutableRefObject<T> {
	current: T;
}
```

1. 作用一：**多次渲染之间的纽带**

useRef 会在所有的 render 中保持对返回值的**唯一引用**。因为所有对 ref 的赋值和取值拿到的都是最终的状态，并不会因为不同的 render 中存在不同的隔离。

**修改 useRef 返回的值并不会引起 react 进行重新渲染执行函数**，可以配合 useEffect 查询页面是首次渲染还是更新。而且 useRef 类似于 react 中的全局变量并不存在不同次 render 中的 state/props 的作用域隔离机制。这就是 useRef 和 useState 这两个 hook 主要的区别。

2. 作用二：**获取 DOM 元素**

配合 React.forwardRef，可以做 refs 转发。「forwardRef」 的初衷就是解决 ref 不能「跨层级捕获和传递」的问题。 forwardRef 接受了父级元素标记的 ref 信息，并把它转发下去，使得子组件可以通过 props 来接受到上一层级或者是更上层级的 ref，那么如果在子组件里使用了 props.ref，则可以在它的父级组件中通过这个 ref 获得子组件的实例。

3. 有三种应用场景：

   1. 给原生 DOM 元素添加 ref：直接用 createRef 或者 useRef 创建 ref 添加引用都可以；
   2. 给类组件添加 ref：组件内部用 createRef 创建 ref 添加引用配合 forwardRef 包裹做转发；
   3. 给函数组件添加 ref：组件内部用 useRef 或者 createRef 配合 forwardRef 包裹做转发；

4. 类组件获取 Ref 三种方式:
   1. Ref 属性是一个字符串：即直接在 jsx 上用`ref='xxx'`的形式。用一个字符串 ref 标记一个 DOM 元素，一个类组件(函数组件没有实例，不能被 Ref 标记)。React 在底层逻辑会判断类型，如果是 DOM 元素，会把真实 DOM 绑定在组件 this.refs (组件实例下的 refs )属性上，如果是类组件，会把子组件的实例绑定在 this.refs 上。当 ref 属性是一个字符串的时候，React 会自动绑定一个函数，用来处理 ref 逻辑。
   2. Ref 属性是一个函数：当用一个函数来标记 Ref 的时候，将作为 callback 形式，等到真实 DOM 创建阶段，执行 callback ，获取的 DOM 元素或组件实例，将以回调函数第一个参数形式传入，可以在这个 callback 函数中接收真实 DOM 和组件实例。
   3. Ref 属性是一个 ref 对象：真实 DOM 和组件实例就会被挂在这个 ref 对象的 current 属性上。
5. 这种 forwardref + ref 模式一定程度上打破了 React 单向数据流动的原则。当然绑定在 ref 对象上的属性，不限于组件实例或者 DOM 元素，也可以是属性值或方法。
6. forwardref 转发 Ref 的三种应用场景：
   1. 跨层级获取：通过标记子组件 ref ，来获取孙组件的某一 DOM 元素，或者是组件实例。
   2. 合并转发 ref：通过 forwardRef 转发的 ref 可以传递很多内容，不仅仅是 DOM 元素或组件实例，也可以是属性值或方法。
   3. 高阶组件转发：如果通过高阶组件包裹一个原始类组件，就会产生一个问题，如果高阶组件 HOC 没有处理 ref ，那么由于高阶组件本身会返回一个新组件，所以当使用 HOC 包装后组件的时候，标记的 ref 会指向 HOC 返回的组件，而并不是 HOC 包裹的原始类组件，为了解决这个问题，forwardRef 可以对 HOC 做一层处理。经过 forwardRef 处理后的 HOC ，就可以正常访问到 Index 组件实例了。例：
   ```js
   function HOC(Component) {
   	class Wrap extends React.Component {
   		render() {
   			const { forwardedRef, ...otherprops } = this.props;
   			return <Component ref={forwardedRef} {...otherprops} />;
   		}
   	}
   	return React.forwardRef((props, ref) => (
   		<Wrap forwardedRef={ref} {...props} />
   	));
   }
   class Index extends React.Component {
   	render() {
   		return <div>hello,world</div>;
   	}
   }
   const HocIndex = HOC(Index);
   export default () => {
   	const node = useRef(null);
   	useEffect(() => {
   		console.log(node.current); /* Index 组件实例  */
   	}, []);
   	return (
   		<div>
   			<HocIndex ref={node} />
   		</div>
   	);
   };
   ```
7. ref 还可以实现组件间通信。

   1. 对于类组件可以通过 ref 直接获取组件实例，实现组件通信。
   2. 函数组件 forwardRef + useImperativeHandle：例：

   ```js
   // 子组件
   function Son(props, ref) {
   	const inputRef = useRef(null);
   	const [inputValue, setInputValue] = useState("");
   	useImperativeHandle(
   		ref,
   		() => {
   			const handleRefs = {
   				onFocus() {
   					/* 声明方法用于聚焦input框 */
   					inputRef.current.focus();
   				},
   				onChangeValue(value) {
   					/* 声明方法用于改变input的值 */
   					setInputValue(value);
   				},
   			};
   			return handleRefs;
   		},
   		[]
   	);
   	return (
   		<div>
   			<input placeholder="请输入内容" ref={inputRef} value={inputValue} />
   		</div>
   	);
   }

   const ForwarSon = forwardRef(Son);
   // 父组件
   class Index extends React.Component {
   	cur = null;
   	handerClick() {
   		const { onFocus, onChangeValue } = this.cur;
   		onFocus(); // 让子组件的输入框获取焦点
   		onChangeValue("let us learn React!"); // 让子组件input
   	}
   	render() {
   		return (
   			<div style={{ marginTop: "50px" }}>
   				<ForwarSon ref={(cur) => (this.cur = cur)} />
   				<button onClick={this.handerClick.bind(this)}>操控子组件</button>
   			</div>
   		);
   	}
   }
   ```

8. useImperativeHandle 接受三个参数：
   1. 第一个参数 ref : 接受 forWardRef 传递过来的 ref 。
   2. 第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
   3. 第三个参数 deps :依赖项 deps，依赖项更改形成新的 ref 对象。
9. 函数组件缓存数据：最常见的用途之一，某些数据更新时可能并不需要渲染组件更新视图，那么可以把这些数据放在 ref 中，useRef 可以创建出一个 ref 原始对象，只要组件没有销毁，ref 对象就一直存在，那么完全可以把一些不依赖于视图更新的数据储存到 ref 对象中。这样做的好处有两个：
   1. 能够直接修改数据，不会造成函数组件冗余的更新作用。
   2. useRef 保存数据，如果有 useEffect ，useMemo 引用 ref 对象中的数据，无须将 ref 对象添加成 dep 依赖项，因为 useRef 始终指向一个内存空间，所以这样一点好处是可以随时访问到变化后的值。
10. ref 执行时机和处理逻辑：
    1. 对于整个 Ref 的处理，都是在 commit 阶段发生的。之前了解过 commit 阶段会进行真正的 Dom 操作，此时 ref 就是用来获取真实的 DOM 以及组件实例的，所以需要 commit 阶段处理。
    2. 第一阶段：一次更新中，在 commit 的 mutation 阶段, 执行 commitDetachRef，commitDetachRef 会清空之前 ref 值，使其重置为 null。
    3. 第二阶段：DOM 更新阶段，这个阶段会根据不同的 effect 标签，真实的操作 DOM 。
    4. 第三阶段：layout 阶段，在更新真实元素节点之后，此时 commitAttachRef 函数执行更新 ref 。
    5. Q:React 被 ref 标记的 fiber，那么每一次 fiber 更新都会调用 commitDetachRef 和 commitAttachRef 更新 Ref 吗 ？
    6. A:答案是否定的，只有在 Ref tag （effectTag & Ref）存在的时候才会更新 ref ，只有在 ref 更新的时候，才会调用如上方法更新 ref 。
11. 卸载 ref：被卸载的 fiber 会被打成 Deletion effect tag ，然后在 commit 阶段会进行 commitDeletion 流程。对于有 ref 标记的 ClassComponent （类组件） 和 HostComponent （元素），会统一走 safelyDetachRef 流程，这个方法就是用来卸载 ref。
    1. 对于字符串 ref="dom" 和函数类型 ref={(node)=> this.node = node } 的 ref，会执行传入 null 置空 ref 。
    2. 对于 ref 对象类型，会清空 ref 对象上的 current 属性。

### 9. useEvent

由 V18 版本引入的。useEvent 要解决一个问题：如何同时保持函数引用不变与访问到最新状态。例：

```js
function Chat() {
	const [text, setText] = useState("");
	// onClick 既保持引用不变，又能在每次触发时访问到最新的 text 值。
	// ✅ Always the same function (even if `text` changes)
	const onClick = useEvent(() => {
		sendMessage(text);
	});

	return <SendButton onClick={onClick} />;
}
```

1. 一般来说，可以使用 useCallback 或者 useMemo 来对传给子组件的函数做一个性能优化，但是当依赖变化时，函数仍然会被重新创建。
2. 一种无奈的办法是，维护一个 ref，使其值与函数依赖的 state 保持同步，在函数中访问 ref.current。因为 ref 实际上是一个全局的引用，始终指向一个固定的内存空间，所以可以随时访问到变化后的值，但是又不会引起 useCallback/useMemo 的更新，因为他们用的是浅比较，React 中浅比较的实现是以 `Object.is` 为基础，增加了对象第一层的属性与值的比较。
3. 借助`useRef + useCallback + useLayoutEffect`三者来实现一个 useEvent 的功能：

```javascript
// (!) Approximate behavior
function useEvent(handler) {
	// 回调函数handler尽量不要写成异步的
	const handlerRef = useRef(null);

	// In a real implementation, this would run before layout effects
	useLayoutEffect(() => {
		// DOM更新后，渲染前同步执行，避免函数在一个事件循环中被直接消费时访问到旧的 Ref 值；
		handlerRef.current = handler;
	});

	return useCallback((...args) => {
		// In a real implementation, this would throw error if called during render
		// TODO在渲染时若被调用，要抛出异常，这是为了避免 useEvent 函数被渲染时使用，因为这样就无法数据驱动了。
		const fn = handlerRef.current;
		return fn(...args);
	}, []);
}
```

4. 第 3 条实际上存在两个问题：
   - 在赋值 ref 时，useLayoutEffect 时机依然不够提前，如果值变化后立即访问函数，拿到的会是旧值。
   - 生成的函数被用在渲染时并不会给出错误提示。

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

- HOC 的优点：不会影响内层组件的状态, 降低了耦合度.
- HOC 的缺点：1. 固定的 props 可能会被覆盖; 2. 它无法清晰地标识数据的来源.

#### Render props

将一个组件内的 state 作为 props 传递给调用者, 调用者可以动态的决定如何渲染.

1. 接收一个外部传递进来的 props 属性.
2. 将内部的 state 作为参数传递给调用组件的 props 属性方法.

缺点:

1. 无法在 return 语句外访问数据, 不允许在 return 语句之外使用它的数据.
2. 很容易导致嵌套地狱.

#### Hook

解决了上面 hoc 和 render props 的缺点.

- hook 可以重命名.
- hook 会清晰地标注来源.

- hook 可以让你在 return 之外使用数据.
- hook 不会嵌套.
- 简单易懂, 对比 hoc 和 render props 两种方式, 它非常直观, 也更容易理解.

### redux-thunk

middleware 可以让你提供一个拦截器在 reducer 处理 action 之前被调用。在这个拦截器中，你可以自由处理获得的 action。无论是把这个 action 直接传递到 reducer，或者构建新的 action 发送到 reducer，都是可以的。Middleware 正是在 Action 真正到达 Reducer 之前提供的一个额外处理 Action 的机会。结合 redux-thunk 中间件的机制，实现了异步请求逻辑的重用。

所以说异步 Action 并不是一个具体的概念，而可以把它看作是 Redux 的一个使用模式。它通过组合使用同步 Action ，在没有引入新概念的同时，用一致的方式提供了处理异步逻辑的方案。

### 按需加载的实现原理

按需加载的实现原理：Webpack 利用了动态 import 语句，自动实现了整个应用的拆包。而我们在实际开发中，其实并不需要关心 Webpack 是如何做到的，而只需要考虑：该在哪个位置使用 import 语句去定义动态加载的拆分点。

import() 这个语句完全是由 Webpack 进行处理的。例：

```jsx
function ProfilePage() {
	// 定义一个 state 用于存放需要加载的组件
	const [RealPage, setRealPage] = useState(null);

	// 根据路径动态加载真正的组件实现
	import("./RealProfilePage").then((comp) => {
		setRealPage(Comp);
	});
	// 如果组件未加载则显示 Loading 状态
	if (!RealPage) return "Loading....";

	// 组件加载成功后则将其渲染到界面
	return <RealPage />;
}
```

使用 react-lodable，实现组件的异步加载。专门用于 React 组件的按需加载。

## React Diff 算法

dom diff 的大概逻辑 【核心】

- Tree diff

  - 逐层比较
  - 如果是 component，执行 component diff
  - 如果是 element，执行 element diff

- component diff

  - 先看比较双方类型一不一致，不一致直接替换
  - 类型相同则更新属性
  - 深入组件进行递归 tree diff

- element diff
  - 先看标签名一不一致，不一致直接替换
  - 标签名一致比较属性
  - 深入标签进行递归 tree diff

## fiber

## React 进阶实践指南

1. 不要尝试给函数组件 prototype 绑定属性或方法，即使绑定了也没有任何作用，因为通过源码中 React 对函数组件的调用，是采用直接执行函数的方式，而不是通过 new 的方式。
2. 函数组件和类组件本质的区别是什么?
   - 对于类组件来说，底层只需要实例化一次，实例中保存了组件的 state 等状态。对于每一次更新只需要调用 render 方法以及对应的生命周期就可以了。
   - 但是在函数组件中，每一次更新都是一次新的函数执行，一次函数组件的更新，里面的变量会重新声明。
   - 所以，为了能让函数组件可以保存一些状态，执行一些副作用钩子，React Hooks 应运而生，它可以帮助记录 React 中组件的状态，处理一些额外的副作用。
3. React 一共有 5 种主流的通信方式：
   - props 和 callback 方式
   - ref 方式。
   - React-redux 或 React-mobx 状态管理方式。
   - context 上下文方式。
   - event bus 事件总线。
4. 不推荐 event bus 事件总线：
   1. 需要手动绑定和解绑。
   2. 对于小型项目还好，但是对于中大型项目，这种方式的组件通信，会造成牵一发动全身的影响，而且后期难以维护，组件之间的状态也是未知的。
   3. 一定程度上违背了 React 数据流向原则。
5. 类组件如何限制 state 更新视图：
   1. pureComponent 可以对 state 和 props 进行浅比较，如果没有发生变化，那么组件不更新。
   2. shouldComponentUpdate 生命周期可以通过判断前后 state 变化来决定组件需不需要更新，需要更新返回 true，否则返回 false。
6. React-Dom 中提供了「批量更新」方法 `unstable_batchedUpdates`，可以在 Promise、setTimeout 等中实现手动批量更新。
7. React-Dom 提供了 `flushSync` ，flushSync 可以将回调函数中的更新任务，放在一个较高的优先级中。React 设定了很多不同优先级的更新任务。如果一次更新任务在 flushSync 回调函数内部，那么将获得一个「较高优先级」的更新。flushSync 在同步条件下，会合并之前的 setState | useState，可以理解成，如果发现了 flushSync ，就会先执行更新，如果之前有未更新的 setState ｜ useState ，就会一起合并了.
8. React 同一级别更新优先级关系是:`flushSync 中的 setState` > `正常执行上下文中 setState` > `setTimeout/Promise等 中的 setState`。
9. 在函数组件中，setState 更新效果和类组件是一样的，但是 useState 有一点值得注意，就是当调用改变 state 的函数 setState 时，在本次函数执行上下文中，是获取不到最新的 state 值的。原因很简单，函数组件更新就是函数的执行，在函数一次执行过程中，函数内部所有变量重新声明，所以改变的 state ，只有在下一次函数组件执行时才会被更新。在 useState 的 setState 处理逻辑中，会浅比较两次 state ，发现 state 相同，则不会开启更新调度任务，所以 state 如果是个对象，那么应该重新创建一个新对象进行 setState 操作。
10. 类组件中的 setState 和函数组件中的 useState 有什么异同？
    1. 相同点：首先从原理角度出发，setState 和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则。
    2. 不同点：
       - 在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。
       - setState 有专门监听 state 变化的回调函数 callback，可以获取最新 state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。
       - setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。
11. 监听 props 变化：
    1. 类组件中，componentWillReceiveProps 可以作为监听 props 的生命周期，但是 React 已经不推荐使用 componentWillReceiveProps ，未来版本可能会被废弃，因为这个生命周期超越了 React 的可控制的范围内，可能引起多次执行等情况发生。于是出现了这个生命周期的替代方案 getDerivedStateFromProps 。
    2. 函数组件中，可以用 useEffect 来作为 props 改变后的监听函数。(不过有一点值得注意, useEffect 初始化会默认执行一次)。
12. React 可以把组件的闭合标签里的插槽，转化成 Children 属性。
13. React 两个重要阶段，render 阶段和 commit 阶段，React 在调和( render )阶段会深度遍历 React fiber 树，目的就是发现不同( diff )，不同的地方就是接下来需要更新的地方，对于变化的组件，就会执行 render 函数。在一次调和过程完毕之后，就到了 commit 阶段，commit 阶段会创建修改真实的 DOM 节点。
14. 两棵树：
    1. workInProgress 树，当前正在调和的 fiber 树 ，一次更新中，React 会自上而下深度遍历子代 fiber ，如果遍历到一个 fiber ，会把当前 fiber 指向 workInProgress。
    2. current 树，在初始化更新中，current = null ，在第一次 fiber 调和之后，会将 workInProgress 树赋值给 current 树。React 来用 workInProgress 和 current 来确保一次更新中，快速构建，并且状态不丢失。
    3. 在组件实例上可以通过 \_reactInternals 属性来访问组件对应的 fiber 对象。在 fiber 对象上，可以通过 stateNode 来访问当前 fiber 对应的组件实例。
15. 首先看部分 CSS-in-JS 的实现原理，拿 Styled-components 为例子，通过 styled-components，你可以使用 ES6 的标签模板字符串语法（Tagged Templates）为需要 styled 的 Component 定义一系列 CSS 属性，当该组件的 JS 代码被解析执行的时候，styled-components 会动态生成一个 CSS 选择器，并把对应的 CSS 样式通过 style 标签的形式插入到 head 标签里面。动态生成的 CSS 选择器会有一小段哈希值来保证全局唯一性来避免样式发生冲突。这种模式下本质上是动态生成 style 标签。
16. 高阶函数就是一个将函数作为参数并且返回值也是函数的函数。高阶组件是以组件作为参数，返回组件的函数。返回的组件把传进去的组件进行功能强化。
17. 常用的高阶组件有属性代理和反向继承两种：
    1. 属性代理，就是用组件包裹一层代理组件，在代理组件上，可以做一些，对源组件的强化操作。这里注意属性代理返回的是一个新组件，被包裹的原始组件，将在新的组件里被挂载。
    2. 反向继承和属性代理有一定的区别，在于包装后的组件继承了原始组件本身，所以此时无须再去挂载业务组件。
18. 高阶组件功能说明：
    1. 强化 props ，可以通过 HOC ，向原始组件混入一些状态。
    2. 渲染劫持，可以利用 HOC ，动态挂载原始组件，还可以先获取原始组件的渲染树，进行可控性修改。
    3. 可以配合 import 等 api ，实现动态加载组件，实现代码分割，加入 loading 效果。
    4. 可以通过 ref 来获取原始组件实例，操作实例下的属性和方法。
    5. 可以对原始组件做一些事件监听，错误监控等。

### 模块化 CSS

css 模块化的几个重要目的，如下:

1. 防止全局污染，样式被覆盖
2. 统一规范，防止命名混乱
3. 防止 css 代码冗余，体积庞大

关于 React 使用 css 模块化的思路主要有两种：

1. css module ，依赖于 webpack 构建和 css-loader 等 loader 处理，将 css 交给 js 来动态加载。使得项目中可以像加载 js 模块一样加载 css ，本质上通过一定自定义的命名规则生成唯一性的 css 类名，从根本上解决 css 全局污染，样式覆盖的问题。可以通过 css-loader 的 options.modules.localIdentName 配置自定义 CSS 命名规则。例：`[path][name]__[local]` -> 开发环境，便于调试。`[hash:base64:5]`-> 生产环境，便于生产环境压缩类名。
2. 直接放弃 css ，css in js 用 js 对象方式写 css ，然后作为 style 方式赋予给 React 组件的 DOM 元素，这种写法将不需要 .css .less .scss 等文件，取而代之的是每一个组件都有一个写对应样式的 js 文件。使用 styled-components。
3. 对于全局变量，CSS Modules 允许使用 `:global(.className)` 的语法，声明一个全局类名。凡是这样声明的 class ，都不会被编译成哈希字符串。CSS Modules 还提供一种显式的局部作用域语法`:local(.text)`，等同于`.text`。
4. 组合样式：CSS Modules 提供了一种 composes 组合方式，实现对样式的复用。比如定义 base 基础样式，然后在其他地方通过`composes:base;`的形式引用它。composes 还有一个更灵活的方法，支持动态引入别的模块下的类名。`composes:base from './style1.css'; /* base 样式在 style1.css 文件中 */`。
5. 组件中引入 classNames 库，还可以实现更灵活的动态添加类名。
6. CSS Modules 优点：
   1. CSS Modules 的类名都有自己的私有域的，可以避免类名重复/覆盖，全局污染问题。
   2. 引入 css 更加灵活，css 模块之间可以互相组合。
   3. class 类名生成规则配置灵活，方便压缩 class 名。
7. CSS IN JS 本质上就是运用 js 中对象形式保存样式， 所以 js 对象的操作方法都可以灵活的用在 CSS IN JS 上。
8. CSS IN JS 特点：
   1. CSS IN JS 本质上放弃了 css ，变成了 css in line 形式，所以根本上解决了全局污染，样式混乱等问题。
   2. 运用起来灵活，可以运用 js 特性，更灵活地实现样式继承，动态添加样式等场景。
   3. 由于编译器对 js 模块化支持度更高，使得可以在项目中更快地找到 style.js 样式文件，以及快捷引入文件中的样式常量。
   4. 无须 webpack 额外配置 css，less 等文件类型。

## 性能优化之 React 几种控制 render 方法

render 的作用是根据一次更新中产生的新状态值，通过 React.createElement ，替换成新的状态，得到新的 React element 对象，新的 element 对象上，保存了最新状态值。 createElement 会产生一个全新的 props。到此 render 函数使命完成了。

接下来，React 会调和由 render 函数产生的 chidlren，将子代 element 变成 fiber（这个过程如果存在 alternate，会复用 alternate 进行克隆，如果没有 alternate ，那么将创建一个），将 props 变成 pendingProps ，至此当前组件更新完毕。然后如果 children 是组件，会继续重复上一步，直到全部 fiber 调和完毕。完成 render 阶段。

1. 从父组件直接隔断子组件的渲染，经典的就是 memo，缓存 element 对象。
2. 组件从自身来控制是否 render ，比如：PureComponent ，shouldComponentUpdate 。

### 1 缓存 React.element 对象

利用 element 的缓存，实现了控制子组件不必要的渲染，究其原理是什么：

原理其实很简单，上述每次执行 render 本质上 createElement 会产生一个新的 props，这个 props 将作为对应 fiber 的 pendingProps ，在此 fiber 更新调和阶段，React 会对比 fiber 上老 oldProps 和新的 newProp （ pendingProps ）是否相等，如果相等函数组件就会放弃子组件的调和更新，从而子组件不会重新渲染；如果上述把 element 对象缓存起来，上面 props 也就和 fiber 上 oldProps 指向相同的内存空间，也就是相等，从而跳过了本次更新。

### 2 PureComponent

纯组件是一种发自组件本身的渲染优化策略，当开发类组件选择了继承 PureComponent ，就意味这要遵循其渲染规则。规则就是浅比较 state 和 props 是否相等。

首先当选择基于 PureComponent 继承的组件时，原型链上会有 isPureReactComponent 属性。这个属性在更新组件 updateClassInstance 方法中使用，这个函数在更新组件的时候被调用，在这个函数内部，有一个专门负责检查是否更新的函数 checkShouldComponentUpdate 。isPureReactComponent 就是判断当前组件是不是纯组件的，如果是 PureComponent 会浅比较 props 和 state 是否相等。

shouldComponentUpdate 的权重，会大于 PureComponent。

父组件给是 PureComponent 的子组件绑定事件要格外小心，避免两种情况发生：

1. 避免使用箭头函数。
2. PureComponent 的父组件是函数组件的情况，绑定函数要用 useCallback 或者 useMemo 处理。

### 3 shouldComponentUpdate

shouldComponentUpdate 可以根据传入的新的 props 和 state ，或者 newContext 来确定是否更新组件，它的执行是在 checkShouldComponentUpdate，会执行此生命周期。

### 4 React.memo

- React.memo 的思想是，当 props 没有改变时，组件就不需要重新渲染。
- React.memo 可作为一种容器化的控制渲染方案，可以对比 props 变化，来决定是否渲染组件。被 memo 包裹的组件，element 会被打成 REACT_MEMO_TYPE 类型的 element 标签，在 element 变成 fiber 的时候， fiber 会被标记成 MemoComponent 的类型。
- 通过 memo 第二个参数（是个函数，接收(prevProps, nextProps)），判断是否执行更新，如果没有那么第二个参数，那么以浅比较 props 为 diff 规则。如果相等，当前 fiber 完成工作，停止向下调和节点，所以被包裹的组件即将不更新。
- memo 可以理解为包了一层的高阶组件，它的阻断更新机制，是通过控制下一级 children ，也就是 memo 包装的组件，是否继续调和渲染，来达到目的的。
- 主线程被阻塞的另一个原因可能来源于渲染，即上一次重复渲染还没有完成，又触发了新的重复渲染。如果能够把组件的渲染结果缓存，并有效复用，就能够减少主线程的阻塞。这就是 React.memo，React 自带的高阶组件。
- 何时使用 React.memo：
  1. 检查组件是否是 Pure 的，即相同输入，相同输出。
  2. 检查组件是否经常被相同的 props 重复渲染，且导致了性能问题。
  3. 如果 props 中有回调函数，可以考虑搭配使用 useCallback 使用。

### 5 打破渲染限制

1. forceUpdate。类组件更新如果调用的是 forceUpdate 而不是 setState ，会跳过 PureComponent 的浅比较和 shouldComponentUpdate 自定义比较。其原理是组件中调用 forceUpdate 时候，全局会开启一个 hasForceUpdate 的开关。当组件更新的时候，检查这个开关是否打开，如果打开，就直接跳过 shouldUpdate 。
2. context 穿透，上述的几种方式，都不能本质上阻断 context 改变，而带来的渲染穿透，所以开发者在使用 Context 要格外小心，既然选择了消费 context ，就要承担 context 改变，带来的更新作用。

### 6 渲染控制流程图

[渲染控制流程图](../../assets/renderControl.png)

### 什么时候需要注意渲染节流

1. 数据可视化的模块组件（展示了大量的数据），这种情况比较小心因为一次更新，可能伴随大量的 diff ，数据量越大也就越浪费性能，所以对于数据展示模块组件，有必要采取 memo ， shouldComponentUpdate 等方案控制自身组件渲染。
2. 含有大量表单的页面，React 一般会采用受控组件的模式去管理表单数据层，表单数据层完全托管于 props 或是 state ，而用户操作表单往往是频繁的，需要频繁改变数据层，所以很有可能让整个页面组件高频率 render 。
3. 越是靠近 app root 根组件越值得注意，根组件渲染会波及到整个组件树重新 render ，子组件 render ，一是浪费性能，二是可能执行 useEffect ，componentWillReceiveProps 等钩子，造成意想不到的情况发生。

### 一些开发中的细节问题

1. 开发过程中对于大量数据展示的模块，开发者有必要用 shouldComponentUpdate ，PureComponent 来优化性能。
2. 对于表单控件，最好办法单独抽离组件，独自管理自己的数据层，这样可以让 state 改变，波及的范围更小。
3. 如果需要更精致化渲染，可以配合 immutable.js 。
4. 组件颗粒化，配合 memo 等 api ，可以制定私有化的渲染空间。

## 懒加载和异步渲染

### 异步渲染

Suspense 是 React 提出的一种同步的代码来实现异步操作的方案。Suspense 让组件‘等待’异步操作，异步请求结束后在进行组件的渲染，也就是所谓的异步渲染。

Suspense 是组件，有一个 fallback 属性，用来代替当 Suspense 处于 loading 状态下渲染的内容，Suspense 的 children 就是异步组件。多个异步组件可以用 Suspense 嵌套使用。

异步渲染相比传统数据交互相比好处就是：

1. 不再需要 componentDidMount 或 useEffect 配合做数据交互，也不会因为数据交互后，改变 state 而产生的二次更新作用。
2. 代码逻辑更简单，清晰。

原理：

Suspense 在执行内部可以通过 try{}catch{} 方式捕获异常，这个异常通常是一个 Promise ，可以在这个 Promise 中进行数据请求工作，Suspense 内部会处理这个 Promise ，Promise 结束后，Suspense 会再一次重新 render 把数据渲染出来，达到异步渲染的效果。

### 动态加载（懒加载）

React 利用 `React.lazy`与`import()`实现了渲染时的动态加载 ，并利用`Suspense`来处理异步加载资源时页面应该如何显示的问题。

这样很利于代码分割，不会让初始化的时候加载大量的文件。

整个 render 过程都是同步执行一气呵成的，但是在 Suspense 异步组件情况下允许调用 Render => 发现异步请求 => 悬停，等待异步请求完毕 => 再次渲染展示数据。

原理：

- React.lazy 内部模拟一个 promiseA 规范场景。完全可以理解 React.lazy 用 Promise 模拟了一个请求数据的过程，但是请求的结果不是数据，而是一个动态的组件。下一次渲染就直接渲染这个组件，所以是 React.lazy 利用 Suspense 接收 Promise ，执行 Promise ，然后再渲染这个特性做到动态加载的。

1. `import()` 原理:由 TS39 提出的一种动态加载模块的规范实现，其返回是一个 promise。当 Webpack 解析到该 import()语法时，会自动进行代码分割。

```js
function import(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const tempGlobal = "__tempModuleLoadingVariable" + Math.random().toString(32).substring(2);
    script.type = "module";
    script.textContent = `import * as m from "${url}"; window.${tempGlobal} = m;`;

    script.onload = () => {
      resolve(window[tempGlobal]);
      delete window[tempGlobal];
      script.remove();
    };

    script.onerror = () => {
      reject(new Error("Failed to load module script with URL " + url));
      delete window[tempGlobal];
      script.remove();
    };

    document.documentElement.appendChild(script);
  });
}
```

2. `React.lazy` 原理:对于最初 `React.lazy()` 所返回的 `LazyComponent` 对象，其 `_status` 默认是 `-1`，所以首次渲染时，会进入 `readLazyComponentType` 函数中的 `default` 的逻辑，这里才会真正异步执行 `import(url)`操作，由于并未等待，随后会检查模块是否 `Resolved`，如果已经`Resolved`了（已经加载完毕）则直接返回`moduleObject.default`（动态加载的模块的默认导出），否则将通过 `throw` 将 `thenable` 抛出到上层。

```javascript
export function lazy<T, R>(ctor: () => Thenable<T, R>): LazyComponent<T> {
	let lazyType = {
		$$typeof: REACT_LAZY_TYPE,
		_ctor: ctor,
		// React uses these fields to store the result.
		_status: -1,
		_result: null,
	};

	return lazyType;
}
```

3. `Suspense` 原理:接上一步，React 捕获到异常之后，会判断异常是不是一个 thenable，如果是则会找到 SuspenseComponent ，如果 thenable 处于 pending 状态，则会将其 children 都渲染成 fallback 的值，一旦 thenable 被 resolve 则 SuspenseComponent 的子组件会重新渲染一次。

```js
class Suspense extends React.Component {
	state = {
		promise: null,
	};

	componentDidCatch(err) {
		// 判断 err 是否是 thenable
		if (
			err !== null &&
			typeof err === "object" &&
			typeof err.then === "function"
		) {
			this.setState({ promise: err }, () => {
				err.then(() => {
					this.setState({
						promise: null,
					});
				});
			});
		}
	}

	render() {
		const { fallback, children } = this.props;
		const { promise } = this.state;
		return <>{promise ? fallback : children}</>;
	}
}
```

### 渲染错误边界

1. componentDidCatch：可以捕获异常，上报错误日志；可以再次触发 setState，来降级 UI 渲染，componentDidCatch() 会在 commit 阶段被调用，因此允许执行副作用。
2. static getDerivedStateFromError()：getDerivedStateFromError 是静态方法，内部不能调用 setState。getDerivedStateFromError 返回的值可以合并到 state，作为渲染使用。
3. 如果存在 getDerivedStateFromError 生命周期钩子，那么将不需要 componentDidCatch 生命周期再降级 ui。

### diff children 流程

1. 遍历新 children ，复用 oldFiber
2. 统一删除剩余 oldfiber
3. 统一创建 newFiber
4. 针对发生移动和更复杂的情况：遍历剩下没有处理的 Children ，通过 updateFromMap ，判断 mapRemainingChildren 中有没有可以复用 oldFiber ，如果有，那么复用，如果没有，新创建一个 newFiber 。复用的 oldFiber 会从 mapRemainingChildren 删掉。
5. 删除 4 中剩余没有复用的 oldFiber

### 关于 diffChild 思考和 key 的使用

1. React diffChild 时间复杂度 O(n^3) 优化到 O(n)。
2. React key 最好选择唯一性的 id，如上述流程，如果选择 Index 作为 key ，如果元素发生移动，那么从移动节点开始，接下来的 fiber 都不能做得到合理的复用。 index 拼接其他字段也会造成相同的效果。

## 性能优化之海量数据渲染优化

### 时间分片

时间分片主要解决，初次加载，一次性渲染大量数据造成的卡顿现象。浏览器执行 js 的速度要比渲染 DOM 速度快的多。时间分片，并没有本质减少浏览器的工作量，而是把一次性任务分割开来，给用户一种流畅的体验效果。

1. 第一步：计算时间片，首先用 eachRenderNum 代表一次渲染多少个，那么除以总数据就能得到渲染多少次。
2. 第二步：开始渲染数据，通过 index>times 判断渲染完成，如果没有渲染完成，那么通过 requestIdleCallback 代替 setTimeout 浏览器空闲执行下一帧渲染。
3. 第三步：通过 renderList 把已经渲染的 element 缓存起来，渲染控制章节讲过，这种方式可以直接跳过下一次的渲染。实际每一次渲染的数量仅仅为 demo 中设置的 500 个。

### 虚拟列表

虚拟列表是一种长列表的解决方案，现在滑动加载是 M 端和 PC 端一种常见的数据请求加载场景，这种数据交互有一个问题就是，如果没经过处理，加载完成后数据展示的元素，都显示在页面上，如果伴随着数据量越来越大，会使页面中的 DOM 元素越来越多，即便是像 React 可以良好运用 diff 来复用老节点，但也不能保证大量的 diff 带来的性能开销。所以虚拟列表的出现，就是「解决大量 DOM 存在，带来的性能问题」。

虚拟列表，就是在长列表滚动过程中，只有视图区域显示的是真实 DOM ，滚动过程中，不断截取视图的有效区域，让人视觉上感觉列表是在滚动。达到无限滚动的效果。

虚拟列表划分可以分为三个区域：视图区 + 缓冲区 + 虚拟区。

## 性能优化之细节处理

### React 中防抖和节流

防抖很适合 React 表单的场景，比如点击按钮防抖，search 输入框。

节流函数一般也用于频繁触发的事件中，比如监听滚动条滚动。

### 按需引入

比如 antd 中的个别组件可以通过 .babelrc 实现按需引入。又比如 lodash-es 替换 lodash，dayjs 替换 moment 等。又比如开发时利用 webpack dll 功能，或者是 terser 压缩 js，mini-css-extract-plugin 压缩去重 css，url-loader/asset-module 转换小图片为 base64 等等。

### React 动画

1. 动态添加、切换 class 类名，而非直接修改 style 属性，这种方式既不需要频繁 setState ，也不需要改变 DOM 。
2. 操纵原生 DOM，这样就避免了 setState 改变带来 React Fiber 深度调和渲染的影响。
3. setState + css3，一定要使用 setState 实时改变 DOM 元素状态的话，那么尽量采用 css3 ， css3 开启硬件加速，使 GPU (Graphics Processing Unit) 发挥功能，从而提升性能。
4. 及时清除定时器/延时器/监听器
5. 合理使用 state，在 React 中只要触发 setState 或 useState ，如果没有渲染控制的情况下，组件就会渲染，暴露一个问题就是，如果视图更新不依赖于当前 state ，那么这次渲染也就没有意义。所以对于视图不依赖的状态，就可以考虑不放在 state 中。
6. 建议不要在 hooks 的参数中执行函数或者 new 实例
   1. 首先函数每次 rerender 都会执行 hooks ，那么在执行 hooks 函数的同时，也会执行函数的参数
   2. 函数组件在初始化和更新流程中，会使用不同的 hooks 对象，还是以 useRef 为例子，在初始化阶段用的是 mountRef 函数，在更新阶段用的是 updateRef 函数，开发者眼睛看见的是 useRef，在 React 底层却悄悄的替换成了不同的函数。 更重要的是大部分的 hooks 参数都作为初始化的参数，在更新阶段压根没有用到，那么传入的参数也就没有了意义
   3. 如果开发者真的想在 hooks 中，以函数组件执行结果或者是实例对象作为参数的话，那么应该怎么处理呢。这个很简单，可以用 useMemo 包装一下。

## React 事件系统-合成事件

目的：

1. 创建一个兼容全浏览器的事件系统，以此抹平不同浏览器的差异。
2. v17 之前 React 事件都是绑定在 document 上，v17 之后 React 把事件绑定在应用对应的容器 container 上，将事件绑定在同一容器统一管理，防止很多事件直接绑定在原生的 DOM 元素上。造成一些不可控的情况。由于不是绑定在真实的 DOM 上，所以 React 需要模拟一套事件流：事件捕获-> 事件源 -> 事件冒泡，也包括重写一下事件源对象 event。
3. 最后，这种事件系统，大部分处理逻辑都在底层处理了，这对后期的 ssr 和跨端支持度很高。

SyntheticEvent 实例将被传递给你的事件处理函数，它是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 stopPropagation() 和 preventDefault()。如果因为某些原因，当你需要使用浏览器的底层事件时，只需要使用 nativeEvent 属性来获取即可。合成事件与浏览器的原生事件不同，也不会直接映射到原生事件。

### 注册

React 17 将事件委托放在了应用对应的容器 root 上而不是以前的 document 上。这个是一个垫脚石的功能，这样做有一个原因是：当同个项目里，有多个 React 根节点时（也可能是 React 多版本共存），避免可能的一些操作（如阻止冒泡）会影响到其他 React 节点的正常工作。

当 ReactDOM.render 时，将会在创建根节点 Fiber 时（createRootImpl），对所有可监听的事件进行注册（listenToAllSupportedEvents）。

### 触发

1. 当点击该元素时，且处于冒泡模式时：

- 元素会冒泡到根节点，根节点获取事件源后，会找到对应的 Fiber，然后遍历获取节点的父节点去收集事件直到根节点 ，然后按照顺序地执行。

2. 当处于捕获模式时：

- 根节点会捕获到事件源，然后会找到对应的 Fiber，然后遍历获取节点的父节点去收集事件直到根节点 ，然后按照顺序地执行。

3. 流程很长，但最主要的两个方法就是 extractEvents$4 和 processDispatchQueue ，前者是收集该节点及该节点到根节点之间的事件，将它们保存在 dispatchQueue 里，然后调用 processDispatchQueue 来依次执行里面的方法。

### 合成事件和原生事件的执行顺序

- 原生事件：`this.childRef.current?.addEventListener("click", () => {...}, false冒泡/true捕获);`
- 合成事件：`onClick/onChange...`
- document 原生事件：`document.addEventListener("click", (e) => {...});`

1. 按照冒泡模式来说，原生事件（子 -> 父） > 合成事件（子 -> 父） > document 原生事件。因为合成事件需要冒泡到根节点后才进行处理，而原生事件可以即时执行。版本无关。
2. 当处于捕获模式时，V17.0.2 版本 document 原生事件 > 合成事件（父 -> 子） > 原生事件（父 -> 子），而 V16.14.0 版本 document 原生事件 > 原生事件（父 -> 子）> 合成事件（父 -> 子）。
3. V17 之前，合成事件和原生事件的执行顺序与冒泡/捕获模式无关，原生事件恒早于合成事件；
4. V17 版本后，合成事件和原生事件的执行顺序与冒泡/捕获模式相关：冒泡模式-原生事件早于合成事件；捕获模式-合成事件早于原生事件。
5. 原因：V17 版本前的捕获模式，只「是模拟的」，实质还是当事件冒泡到 document 时才开始处理，通过遍历该元素以及元素父节点直到根节点，模拟捕获和冒泡处理方式，获取对应模式下的事件函数，然后调用它们。而 V17 后，捕获事件将会启用捕获模式的监听。

### 独特的事件处理

#### 冒泡阶段和捕获阶段

1. 冒泡阶段：开发者正常给 React 绑定的事件比如 `onClick`，`onChange`，默认会在模拟冒泡阶段执行。
2. 捕获阶段：如果想要在捕获阶段执行可以将事件后面加上 Capture 后缀，比如 `onClickCapture`，`onChangeCapture`。

#### 阻止冒泡

React 中如果想要阻止事件向上冒泡，可以用 `e.stopPropagation()`。

#### 阻止默认行为

1. 原生事件：`e.preventDefault()` 和 `return false`可以用来阻止事件默认行为，由于在 React 中给元素的事件并不是真正的事件处理函数。所以导致 `return false` 方法在 React 应用中完全失去了作用。
2. React 事件：在 React 应用中，可以用 `e.preventDefault()` 阻止事件默认行为，这个方法并非是原生事件的 `preventDefault`，由于 React 事件源 e 也是独立组建的，所以 `preventDefault` 也是单独处理的。

### React 事件系统

可分为三个部分：

1. 第一个部分是事件合成系统，初始化会注册不同的事件插件。
2. 第二个就是在一次渲染过程中，对事件标签中事件的收集，向 container 注册事件。
3. 第三个就是一次用户交互，事件触发，到事件执行一系列过程。

### 合成事件总结

1. React 的事件不是绑定在元素上的，而是统一绑定在顶部容器上，在 v17 之前是绑定在 document 上的，在 v17 改成了 app 容器上。这样更利于一个 html 下存在多个应用（微前端）。
2. 绑定事件并不是一次性绑定所有事件，比如发现了 `onClick` 事件，就会绑定 click 事件，比如发现 `onChange` 事件，会绑定 `[blur, change, focus, keydown, keyup]` 多个事件。
3. React 事件合成的概念：React 应用中，元素绑定的事件并不是原生事件，而是 React 合成的事件，比如 `onClick` 是由 click 合成，`onChange` 是由 `blur, change, focus` 等多个事件合成。
4. React 有一种事件插件机制，比如上述 `onClick` 和 `onChange` ，会有不同的事件插件 `SimpleEventPlugin`、`ChangeEventPlugin` 处理。
   - `registrationNameModules` 记录了 React 事件（比如 `onBlur` ）和与之对应的处理插件的映射，比如上述的 `onClick` ，就会用 `SimpleEventPlugin` `插件处理，onChange` 就会用 `ChangeEventPlugin` 处理。应用于事件触发阶段，根据不同事件使用不同的插件。
   - `registrationNameDependencies` 这个对象保存了 React 事件和原生事件对应关系，这就解释了为什么只写了一个 `onChange` ，却会有很多原生事件绑定在 document 上。在事件绑定阶段，如果发现有 React 事件，比如 `onChange` ，就会找到对应的原生事件数组，逐一绑定。

```js
const registrationNameModules = {
	onBlur: SimpleEventPlugin,
	onClick: SimpleEventPlugin,
	onClickCapture: SimpleEventPlugin,
	onChange: ChangeEventPlugin,
	onChangeCapture: ChangeEventPlugin,
	onMouseEnter: EnterLeaveEventPlugin,
	onMouseLeave: EnterLeaveEventPlugin,
	// ...
};
const registrationNameDependencies = {
	onBlur: ["blur"],
	onClick: ["click"],
	onClickCapture: ["click"],
	onChange: [
		"blur",
		"change",
		"click",
		"focus",
		"input",
		"keydown",
		"keyup",
		"selectionchange",
	],
	onMouseEnter: ["mouseout", "mouseover"],
	onMouseLeave: ["mouseout", "mouseover"],
	// ...
};
```

- Q：为什么要用不同的事件插件处理不同的 React 事件?
- A：首先对于不同的事件，有不同的处理逻辑；对应的事件源对象也有所不同，React 的事件和事件源是自己合成的，所以对于不同事件需要不同的事件插件处理。

### 事件绑定

所谓事件绑定，就是在 React 处理 props 时候，如果遇到事件比如 `onClick`，就会通过 `addEventListener` 注册原生事件。

1. 给 jsx 中的 DOM 元素通过`onChange` 和 `onClick`绑定事件 `handleClick`和`handleChange` 事件；
2. 最后 `onChange` 和 `onClick` 会保存在对应 DOM 元素类型 fiber 对象（ `hostComponent` ）的 `memoizedProps` 属性上；
3. 然后 React 根据事件注册事件监听器。`diffProperties` 函数在 `diff props` 如果发现是合成事件( `onClick` ) 就会调用 `legacyListenToEvent` 函数。注册事件监听器。
4. `legacyListenToEvent`函数中会从`registrationNameDependencies`中根据 `onClick` 获取 `onClick` 依赖的事件数组，然后循环并`addEventListener` 绑定事件监听器。
5. **绑定在 document 的事件，是 React 统一的事件处理函数 dispatchEvent ，React 需要一个统一流程去代理事件逻辑，包括 React 批量更新等逻辑。**
6. 只要是 React 事件触发，首先执行的就是 `dispatchEvent` ，那么`dispatchEvent` 是如何知道是什么事件触发的呢？实际在注册的时候，就已经通过 bind ，把参数绑定给 `dispatchEvent` 了。如下：

```js
const listener = dispatchEvent.bind(null, "click", eventSystemFlags, document);
/* TODO: 重要, 这里进行真正的事件绑定。*/
document.addEventListener("click", listener, false);
```

### 事件触发

点击按钮，触发点击事件，那么在 React 系统中，整个流程会是这个样子的：

1. 批量更新。首先执行 dispatchEvent ，dispatchEvent 执行会传入真实的事件源 button 元素本身。通过元素可以找到 button 对应的 fiber ，fiber 和原生 DOM 之间是如何建立起联系的呢？React 在初始化真实 DOM 的时候，用一个随机的 key internalInstanceKey 指针指向了当前 DOM 对应的 fiber 对象，fiber 对象用 stateNode 指向了当前的 DOM 元素。
2. 合成事件源。接下来会通过 onClick 找到对应的处理插件 SimpleEventPlugin ，合成新的事件源 e ，里面包含了 preventDefault 和 stopPropagation 等方法。
3. 形成事件执行队列。在第一步通过原生 DOM 获取到对应的 fiber ，接着会从这个 fiber 向上遍历，遇到元素类型 fiber ，就会收集事件，用一个数组收集事件：
   - 如果遇到捕获阶段事件 onClickCapture ，就会 unshift 放在数组前面。以此模拟事件捕获阶段。
   - 如果遇到冒泡阶段事件 onClick ，就会 push 到数组后面，模拟事件冒泡阶段。
   - 一直收集到最顶端 app ，形成执行队列，在接下来阶段，依次执行队列里面的函数。
4. React 如何模拟阻止事件冒泡：调用执行`e.stopPropagation();`之后，那么事件源里将有状态证明此次事件已经停止冒泡，那么下次遍历的时候`runEventsInBatch()`，`event.isPropagationStopped()` 就会返回 true ，直接跳出循环。

## 调度 Scheduler 与时间片 Reconciler

### 异步调度

首先对比一下 vue 框架，vue 有 template 模版收集依赖的过程，轻松构建响应式，使得在一次更新中，vue 能够迅速响应，找到需要更新的范围，然后以组件粒度更新组件，渲染视图。但是在 React 中，一次更新 React 无法知道此次更新的波及范围，所以 React 选择从根节点开始 diff ，查找不同，更新这些不同。导致在一次更新中，可能需要递归遍历大量的虚拟 DOM ，造成占用 js 线程，使得浏览器没有时间去做一些动画效果，伴随项目越来越大，项目会越来越卡。

### 时间分片

React 如何让浏览器控制 React 更新呢，首先浏览器每次执行一次事件循环（一帧）都会做如下事情：处理事件，执行 js ，调用 requestAnimationFrames ，布局 Layout ，绘制 Paint ，在一帧执行后，如果没有其他事件，那么浏览器会进入休息时间，那么有的一些不是特别紧急 React 更新，就可以执行了-可以利用 requestIdleCallback。

React 为了防止 requestIdleCallback 中的任务由于浏览器没有空闲时间而卡死，所以设置了 5 个优先级/超时等级：

1. Immediate -1 需要立刻执行。
2. UserBlocking 250ms 超时时间 250ms，一般指的是用户交互。
3. Normal 5000ms 超时时间 5s，不需要直观立即变化的任务，比如网络请求。
4. Low 10000ms 超时时间 10s，肯定要执行的任务，但是可以放在最后处理。
5. Idle 一些没有必要的任务，可能不会执行。

React 的异步更新任务就是通过类似 requestIdleCallback 去向浏览器做一帧一帧请求，等到浏览器有空余时间，去执行 React 的异步更新任务，这样保证页面的流畅。

为了兼容每个浏览器，React 需要自己实现一个 requestIdleCallback ，那么就要具备两个条件：

1. 实现的这个 requestIdleCallback ，可以主动让出主线程，让浏览器去渲染视图。
2. 一次事件循环只执行一次，因为执行一个以后，还会请求下一次的时间片。

能够满足上述条件的，就只有「宏任务」，宏任务是在下次事件循环中执行，不会阻塞浏览器更新。而且「浏览器一次只会执行一个宏任务」。

1. `setTimeout(fn, 0)` 可以满足创建宏任务，让出主线程，为什么 React 没选择用它实现 Scheduler 呢？原因是递归执行 setTimeout(fn, 0) 时，最后间隔时间会变成 4 毫秒左右，而不是最初的 1 毫秒。所以 React 优先选择的并不是 setTimeout 实现方案。
2. `MessageChannel`接口允许开发者创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据。
   - 在一次更新中，React 会调用 requestHostCallback ，把更新任务赋值给 scheduledHostCallback ，然后 port2 向 port1 发起 postMessage 消息通知。
   - port1 会通过 onmessage ，接受来自 port2 消息，然后执行更新任务 scheduledHostCallback ，然后置空 scheduledHostCallback ，借此达到异步执行目的。

### 异步调度原理

React 发生一次更新，会统一走 `ensureRootIsScheduled（调度应用）`。

- 对于正常更新会走 `performSyncWorkOnRoot` 逻辑，最后会走 `workLoopSync()` 。
- 对于低优先级的异步更新会走 `performConcurrentWorkOnRoot` 逻辑，最后会走 `workLoopConcurrent()` 。

#### scheduleCallback

无论是正常更新任务 `workLoopSync` 还是低优先级的任务 `workLoopConcurrent` ，都是由调度器 `scheduleCallback` 统一调度的:

- 对于正常更新任务:`scheduleCallback(Immediate,workLoopSync);`
- 对于异步任务:`scheduleCallback(priorityLevel,workLoopConcurrent);`// 根据 `expirationTime` 计算得到上文提到的 5 个优先级/超时等级并传入
- taskQueue，里面存的都是过期的任务，依据任务的过期时间( `expirationTime` ) 排序，需要在调度的 workLoop 中循环执行完这些任务。通过 `expirationTime` 排序
- timerQueue 里面存的都是没有过期的任务，依据任务的开始时间( `startTime` )排序，在调度 workLoop 中 会用 `advanceTimers` 检查任务是否过期，如果过期了，放入 `taskQueue` 队列。通过开始时间排序

`scheduleCallback` 流程如下。

- 创建一个新的任务 newTask。
- 通过任务的开始时间( `startTime` ) 和 当前时间( `currentTime` ) 比较:当 `startTime` > `currentTime`, 说明未过期, 存到 `timerQueue`,当 `startTime` <= `currentTime`, 说明已过期, 存到 `taskQueue`。
- 如果任务过期，并且没有调度中的任务，那么调度 `requestHostCallback`。本质上调度的是 `flushWork`。
- 如果任务没有过期，用 `requestHostTimeout` 延时执行 `handleTimeout`。

1. `requestHostTimeout`: 通过 `setTimeout` 来延时执行 `handleTimeout`，`cancelHostTimeout` 用于清除当前的延时器。
2. `handleTimeout`:延时指定时间后，调用的 `handleTimeout` 函数， `handleTimeout` 会把任务重新放在 `requestHostCallback` 调度。通过 `advanceTimers` 将 `timeQueue` 中过期的任务转移到 `taskQueue` 中。然后调用 `requestHostCallback` 调度过期的任务。
3. `advanceTimers`: 如果任务已经过期，那么将 `timerQueue` 中的过期任务，放入 `taskQueue`。
4. 第一件是 React 的更新任务最后都是放在 `taskQueue` 中的。
5. 第二件是 `requestHostCallback` ，放入 `MessageChannel` 中的回调函数是`flushWork`。
6. `flushWork`: 如果有延时任务执行的话，那么会先暂停延时任务，然后调用 workLoop ，去真正执行超时的更新任务。
7. `workloop`: 这个 workLoop 是调度中的 workLoop，不要把它和调和中的 workLoop 弄混淆了。workLoop 会依次更新过期任务队列中的任务。到此为止，完成整个调度过程。
8. shouldYield 中止 workloop: 在 fiber 的异步更新任务 workLoopConcurrent 中，每一个 fiber 的 workloop 都会调用 shouldYield 判断是否有超时更新的任务，如果有，那么停止 workLoop。

[调度流程图](../../assets/scheduler.png)
[调和 + 异步调度 流程总图](../../assets/reconciler.png)

## 调和与 fiber

### 什么是 fiber

fiber 诞生在 Reactv16 版本，整个 React 团队花费两年时间重构 fiber 架构，目的就是解决大型 React 应用卡顿；fiber 在 React 中是最小粒度的执行单元，无论 React 还是 Vue ，在遍历更新每一个节点的时候都不是用的真实 DOM ，都是采用虚拟 DOM ，所以可以理解成 fiber 就是 React 的虚拟 DOM 。

### 为什么要用 fiber

在 Reactv15 以及之前的版本，React 对于虚拟 DOM 是采用递归方式遍历更新的，比如一次更新，就会从应用根部递归更新，递归一旦开始，中途无法中断，随着项目越来越复杂，层级越来越深，导致更新的时间越来越长，给前端交互上的体验就是卡顿。

Reactv16 为了解决卡顿问题引入了 fiber，为什么它能解决卡顿？更新 fiber 的过程叫做 Reconciler（调和器），每一个 fiber 都可以作为一个执行单元来处理，所以每一个 fiber 可以根据自身的过期时间 expirationTime（ v17 版本叫做优先级 lane ）来判断是否还有空间时间执行更新，如果没有时间更新，就要把主动权交给浏览器去渲染，做一些动画，重排（ reflow ），重绘 repaints 之类的事情，这样就能给用户感觉不是很卡。然后等浏览器空余时间，在通过 scheduler （调度器），再次恢复执行单元上来，这样就能本质上中断了渲染，提高了用户体验。

### element,fiber,dom 三种什么关系？

- element 是 React 视图层在代码层级上的表象，也就是开发者写的 jsx 语法，写的元素结构，都会被创建成 element 对象的形式。上面保存了 props ， children 等信息。
- DOM 是元素在浏览器上给用户直观的表象。
- fiber 可以说是是 element 和真实 DOM 之间的交流枢纽站，一方面每一个类型 element 都会有一个与之对应的 fiber 类型，element 变化引起更新流程都是通过 fiber 层面做一次调和改变，然后对于元素，形成新的 DOM 做视图渲染。
- 每一个 fiber 是通过 return ， child ，sibling 三个属性建立起联系的。
  - return： 指向父级 Fiber 节点。
  - child： 指向子 Fiber 节点。
  - sibling：指向兄弟 fiber 节点。

### Fiber 更新机制

#### 初始化

1. 第一步：创建 fiberRoot 和 rootFiber。第一次挂载的过程中，会将 fiberRoot 和 rootFiber 建立起关联。
   - fiberRoot：首次构建应用， 创建一个 fiberRoot ，作为整个 React 应用的根基。
   - rootFiber： 如下通过 ReactDOM.render 渲染出来的，如上 Index 可以作为一个 rootFiber。一个 React 应用可以有多 ReactDOM.render 创建的 rootFiber ，但是只能有一个 fiberRoot（应用根节点）。`ReactDOM.render(<Index/>, document.getElementById('app'));`
2. 第二步：workInProgress 和 current。开始到正式渲染阶段，会进入 beginwork 流程。回到 rootFiber 的渲染流程，首先会复用当前 current 树（ rootFiber ）的 alternate 作为 workInProgress ，如果没有 alternate （初始化的 rootFiber 是没有 alternate ），那么会创建一个 fiber 作为 workInProgress 。会用 alternate 将新创建的 workInProgress 与 current 树建立起关联。这个关联过程只有初始化第一次创建 alternate 时候进行。
   - workInProgress 是：正在内存中构建的 Fiber 树称为 workInProgress Fiber 树。在一次更新中，所有的更新都是发生在 workInProgress 树上。在一次更新之后，workInProgress 树上的状态是最新的状态，那么它将变成 current 树用于渲染视图。
   - current：正在视图层渲染的树叫做 current 树。
3. 第三步：深度调和子节点，渲染视图。在新创建的 alternate 上，完成整个 fiber 树的遍历，包括 fiber 的创建。最后会以 workInProgress 作为最新的渲染树，fiberRoot 的 current 指针指向 workInProgress 使其变为 current Fiber 树。到此完成初始化流程。

#### 更新

首先会走如上的逻辑，重新创建一棵 workInProgresss 树，复用当前 current 树上的 alternate ，作为新的 workInProgress ，由于初始化 rootfiber 有 alternate ，所以对于剩余的子节点，React 还需要创建一份，和 current 树上的 fiber 建立起 alternate 关联。渲染完毕后，workInProgresss 再次变成 current 树。

- 双缓存：canvas 绘制动画的时候，如果上一帧计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。为了解决这个问题，canvas 在内存中绘制当前动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。这种在内存中构建并直接替换的技术叫做双缓存。
- 双缓冲树：React 用 workInProgress 树(内存中构建的树) 和 current (渲染树) 来实现更新逻辑。双缓存一个在内存中构建，一个渲染视图，两棵树用 alternate 指针相互指向，在下一次渲染的时候，直接复用缓存树做为下一次渲染树，上一次的渲染树又作为缓存树，这样可以防止只用一棵树更新状态的丢失的情况，又加快了 DOM 节点的替换与更新。

### 两大阶段：render 和 commit

先 render 阶段：

1. 每一个 fiber 可以看作一个执行的单元，在调和过程中，每一个发生更新的 fiber 都会作为一次 workInProgress 。那么 workLoop 就是执行每一个单元的调度器，如果渲染没有被中断，那么 workLoop 会遍历一遍 fiber 树。 performUnitOfWork 包括两个阶段 beginWork 和 completeUnitOfWork 。
   - beginWork：是向下调和的过程。就是由 fiberRoot 按照 child 指针逐层向下调和，期间会执行函数组件，实例类组件，diff 调和子节点，打不同 effectTag。
   - completeUnitOfWork：是向上归并的过程，如果有兄弟节点，会返回 sibling 兄弟，没有返回 return 父级，一直返回到 fiebrRoot ，期间可以形成 effectList，对于初始化流程会创建 DOM ，对于 DOM 元素进行事件收集，处理 style，className 等。
2. 总结 beginWork 作用如下：
   - 对于组件，执行部分生命周期，执行 render ，得到最新的 children 。
   - 向下遍历调和 children ，复用 oldFiber ( diff 算法)，diff 流程在第十二章已经讲过了。
   - 打不同的副作用标签 effectTag ，比如类组件的生命周期，或者元素的增加，删除，更新。
3. 调和子节点 reconcileChildren：初始化子代 fiber - mountChildFibers；更新流程，diff children 将在这里进行 - reconcileChildFibers。
4. 向上归并 completeUnitOfWork：
   - 首先 completeUnitOfWork 会将 effectTag 的 Fiber 节点会被保存在一条被称为 effectList 的单向链表中。在 commit 阶段，将不再需要遍历每一个 fiber ，只需要执行更新 effectList 就可以了。
   - completeWork 阶段对于组件处理 context；对于元素标签初始化，会创建真实 DOM，将子孙 DOM 节点插入刚生成的 DOM 节点中；会触发 diffProperties 处理 props，比如事件收集，style，className 处理。

然后 commit 阶段：

1. 一方面是对一些生命周期和副作用钩子的处理，比如 componentDidMount，函数组件的 useEffect、useLayoutEffect；
2. 另一方面就是在一次更新中，添加节点（ Placement ），更新节点（ Update ），删除节点（ Deletion ），还有就是一些细节的处理，比如 ref 的处理。
3. commit 细分可以分为：
   - Before mutation 阶段（执行 DOM 操作前）；
   - mutation 阶段（执行 DOM 操作）；
   - layout 阶段（执行 DOM 操作后）；
4. Before mutation 阶段做的事主要有以下内容：
   - 因为 Before mutation 还没修改真实的 DOM ，是获取 DOM 快照的最佳时期，如果是类组件有 getSnapshotBeforeUpdate ，那么会执行这个生命周期。
   - 会异步调用 useEffect ，在生命周期讲到 useEffect 是采用异步调用的模式，其目的就是防止同步执行时阻塞浏览器做视图渲染。
5. mutation 阶段做的事情有：
   - 置空 ref。
   - 对新增元素，更新元素，删除元素。进行真实的 DOM 操作。
6. Layout 阶段 DOM 已经更新完毕，Layout 做的事情有：
   - commitLayoutEffectOnFiber 对于类组件，会执行生命周期，setState 的 callback，对于函数组件会执行 useLayoutEffect 钩子。
   - 如果有 ref ，会重新赋值 ref 。
7. 对 commit 阶段做一个总结，主要做的事就是执行 effectList，更新 DOM，执行生命周期，获取 ref 等操作。

[调和 + 异步调度 流程总图](../../assets//sche_rcon.png)
