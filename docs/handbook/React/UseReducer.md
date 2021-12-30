---
title: useReducer 的简单用法
author: EricYangXD
date: "2021-12-29"
---

> 项目里用的太少了，记录个 demo.
> reducer 中单个的函数可以有多个不同动作.
> 使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数.

## 使用步骤

1. 定义初始值 initialState
2. 定义 reducer(state, action)，其中 state 即是要管理同步的状态，action 接收 type 和 payload
3. 使用：const [state, dispatch] = useReducer(reducer, initialState); // 通过 dispatch 触发 reducer，可以传参 payload

```tsx
import { useReducer } from "react";

interface IState {
	count: number;
}

interface IAction {
	type: "add" | "subtract";
	payload: number;
}

const initialState: IState = { count: 0 };

const reducer = (state: IState, action: IAction) => {
	switch (action.type) {
		case "add":
			return { count: state.count + action.payload };
		case "subtract":
			return { count: state.count - action.payload };
		default:
			throw new Error("Illegal operation in reducer.");
	}
};

function Counter() {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<>
			<h1>Hello , My name is 19Qingfeng.</h1>
			<p>Counter: {state.count}</p>
			<p>
				<button onClick={() => dispatch({ type: "add", payload: 1 })}>
					add 1!
				</button>
			</p>
			<p>
				<button
					onClick={() => dispatch({ type: "subtract", payload: 1 })}
				>
					subtract 1!
				</button>
			</p>
		</>
	);
}

export default Counter;
```
