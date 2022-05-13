---
title: React router 中的路由守卫功能
author: EricYangXD
date: "2021-12-29"
---

## 借助 react-router 中的 Prompt 实现

### 示例 [Demo](https://github.com/EricYangXD/React-Router-Custom-Prompt)

1. use as a component

```js
// CustomPrompt.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation, Prompt } from "react-router-dom";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CONSTANTS } from "pages/constants";

const { confirm: confirmModal } = Modal;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useCustomPrompt = () => {
	const [pathTo, setPathTo] = useState("");
	const [confirm, setConfirm] = useState(false);
	const history = useHistory();
	const currentLocation = useLocation();

	const onConfirm = useCallback(() => {
		setConfirm(true);
	}, []);

	const onCancel = useCallback(() => {
		// eslint-disable-next-line no-console
		console.log("cancel");
	}, []);

	/* Prompt: message */
	const message = (location): string | boolean => {
		// location: to, currentLocation: from
		// compare the current path and the next path
		if (location.pathname === currentLocation.pathname) return true;
		showConfirm();
		setPathTo(location.pathname);
		return false;
		// 如果return了string，则会显示在Prompt上，此处使用Modal而不需要显示Prompt
		// return '当前修改尚未保存，确定要离开吗？';
	};

	/* 切换确认modal */
	const showConfirm = useCallback(() => {
		confirmModal({
			title: CONSTANTS.TAB_CHANGE_TITLE,
			content: CONSTANTS.TAB_CHANGE_TIP,
			icon: <ExclamationCircleOutlined />,
			onOk: () => onConfirm(),
			onCancel: () => onCancel(),
			closable: true,
		});
	}, [onConfirm, onCancel]);

	// eslint-disable-next-line react/prop-types
	const CustomPrompt = ({ showPrompt }) => {
		const when = showPrompt && !confirm;

		return (
			<>
				<Prompt when={when} message={message} />
			</>
		);
	};

	useEffect(() => {
		if (confirm) {
			history.push(pathTo);
		}
	}, [confirm, pathTo, history]);

	return { CustomPrompt };
};

export default useCustomPrompt;
```

2. import the above component and just use it as a normal component in anywhere.

```js
...
import useCustomPrompt from 'components/CustomPrompt.tsx';
const [showModal,setShowModal] = useState(false);
const { CustomPrompt } = useCustomPrompt();
...
return (<>
    ...
    <CustomPrompt showPrompt={showModal} />
    ...
  </>);

```

3. In addition, you can add some custom functions as needed.

## 改进版

```ts
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from "react";
import { Prompt } from "react-router-dom";

interface Props {
	/** 离开时显示的提示信息。注意：在 Chrome 中，关闭窗口只能显示系统默认提示 */
	message: string;
	/** 离开时是否要提示 */
	enabled: boolean | undefined;
}
const ExitAlert = (props: Props): JSX.Element => {
	// window beforeUnload 事件
	const refCurProps = useRef(props);
	refCurProps.current = props;

	useEffect(() => {
		const handleBeforeUnload: EventListener = (event) => {
			if (!refCurProps.current.enabled) {
				return undefined;
			}

			event.preventDefault(); // 用于 Firefox —— Ref: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
			event.returnValue = false; // 用于 Chrome
			return refCurProps.current.message; //  用于 IE
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	// React Router 切换事件
	return <Prompt message={props.message} when={props.enabled} />;
};

export default ExitAlert;
```
