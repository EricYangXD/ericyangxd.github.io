---
title: useImperativeHandle 的简单用法
author: EricYangXD
date: "2021-12-29"
---

> 项目里用的太少了，记录个 demo.
> useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。
> 在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用。

## 使用步骤

1. 定义 ref 初始值 = useRef(initialVal)
2. 使用 hook： useImperativeHandle(ref, createHandle, [deps])
3. 子组件的 Input 中使用 ref={ref}
4. 子组件 export default forwardRef(子组件)
5. 父组件定义自己的 refInput = useRef()
6. 父组件传递 refInput 给子组件
7. 父组件可以通过 refInput.current 拿到子组件暴露的值，也可通过 refInput.current.xx 调用子组件 createHandle 中的其他方法/值

```tsx
// 子组件
import React, {
	ForwardRefRenderFunction,
	useImperativeHandle,
	forwardRef,
	useRef,
} from "react";

interface Props {
	name: string;
}

export interface InputExportMethod {
	focus: () => void;
	domeSomeThing: () => void;
}

const Input: ForwardRefRenderFunction<InputExportMethod, Props> = (
	props,
	ref
) => {
	const inputRef = useRef<HTMLInputElement>(null);

	// 子组件方法
	const domeSomeThing = () => {
		// dosomething
		console.log("do smething");
	};

	useImperativeHandle(
		ref,
		() => ({
			focus: () => inputRef.current?.focus(),
			domeSomeThing: () => domeSomeThing(),
		}),
		[]
	);

	return (
		<div>
			<input ref={inputRef}></input>
		</div>
	);
};

const ExportInput = forwardRef(Input);

export default ExportInput;
```

```tsx
// 父组件
import React, { useEffect, useRef } from "react";
import Input, { InputExportMethod } from "./index";

const Parent: React.FC = () => {
	const inputRef = useRef<InputExportMethod>(null);

	useEffect(() => {
		if (inputRef.current) {
			console.log(inputRef.current.domeSomeThing());
		}
	}, []);

	return <Input ref={inputRef} name="19Qingfeng"></Input>;
};

export default Parent;
```
