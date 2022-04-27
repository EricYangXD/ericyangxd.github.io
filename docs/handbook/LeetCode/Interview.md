---
title: 双越前端面试100题
author: EricYangXD
date: "2022-04-09"
---

## 双越前端面试 100 题

记录几个有意思的算法题

1. 数组是连续空间，要慎用 splice、unshift 等 API，时间复杂度是 O(n)起步

### 浮动 0 到数组的一侧

```ts
// 双指针法，j指向第一个0，原地交换，实际上是把非0的值移到左侧
function floatNum(arr) {
	const length = arr?.length;
	if (length <= 1) return arr;

	let i = 0,
		j = -1;

	while (i < length) {
		if (arr[i] === 0) {
			// 先找到第一个0
			if (j < 0) {
				j = i;
			}
		}
		if (arr[i] !== 0 && j >= 0) {
			// 交换0到数组右侧，非0的到左侧
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
			// 交换之后，j要往右移动一位
			j++;
		}
		i++;
	}
	return arr;
}
```

### 求连续字符串的最大长度

-   双指针法，时间复杂度 O(n)

```js
function maxLen(str) {
	const res = { str: "", length: 0 };
	const length = str?.length;
	if (length <= 1) return { str, length };

	let i = 0,
		j = 0,
		tempLen = 0;
	while (j < length) {
		if (str[i] === str[j]) {
			tempLen++;
		}
		if (str[i] !== str[j] || j === length - 1) {
			if (tempLen > res.length) {
				res.length = tempLen;
				res.str = str[i];
			}
			tempLen = 0;
			if (j < length - 1) {
				i = j;
				j--; // j在这次循环之后会++，所以要先--，然后i才和j相等。
			}
		}
		j++;
	}
	return res;
}
```

-   双循环，跳步，使时间复杂度降到 O(n)

```js
function maxLen(str) {
	const res = { str: "", length: 0 };
	const length = str?.length;
	if (length <= 1) return { str, length };

	let maxLength = 0;
	for (let i = 0; i < length; i++) {
		maxLength = 0;
		for (let j = i; j < length; j++) {
			if (str[i] === str[j]) {
				maxLength++;
			}
			// 如果不相等或者已经匹配到最后
			if (str[i] !== str[j] || j === length - 1) {
				if (maxLength > res.length) {
					res.length = maxLength;
					res.str = str[i];
				}
				if (i < length - 1) {
					i = j - 1; // 跳步
				}
				break;
			}
		}
	}
	return res;
}
```

## 面试题

### 2022-04-27

万向区块链

#### 关于堆和栈、一级缓存和二级缓存的理解

1. 数据结构的堆和栈（都是逻辑结构）
    1. 堆：先进先出的，可以被看成是一棵树，如：堆排序。
    2. 栈：后进先出的、自顶向下。
2. 内存分布上的堆和栈
    1. 栈：局部变量的内存，函数结束后内存自动被释放，栈内存分配运算内置于处理器的指令集中，它的运行效率一般很高，但是分配的内存容量有限。
    2. 静态存储区：全局变量、static 变量；它是由编译器自动分配和释放的，即内存在程序编译的时候就已经分配好，这块内存在程序的整个运行期间都存在，直到整个程序运行结束时才被释放。
    3. 动态储存区：堆和栈
3. 一级缓存和二级缓存
    1. 栈使用的是一级缓存， 他们通常都是被调用时处于存储空间中，调用完毕立即释放。栈的效率比堆的高。
    2. 堆则是存放在二级缓存中，生命周期由虚拟机的垃圾回收算法来决定（并不是一旦成为孤儿对象就能被回收）。所以调用这些对象的速度要相对来得低一些。
4. 为什么需要缓存？
    1. cpu 运行速率很快，但内存的速度很慢，所以就需要缓存，缓存分为一级二级三级，越往下优先级越低，成本越低，容量越大。
    2. 栈（操作系统）：由操作系统自动分配释放 ，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
    3. 堆（操作系统）： 一般由程序员分配释放， 若程序员不释放，程序结束时可能由 OS 回收，分配方式倒是类似于链表。
5. CPU 读写速率：
    1. 寄存器>一级缓存>二级缓存

#### Vue 和 React 的区别

#### Vue 和 React 的生命周期

##### React

1. 挂载阶段：

> 当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

-   `constructor()`
-   `static getDerivedStateFromProps()`
-   `render()`
-   `componentDidMount()`

2. 更新阶段：

> 当组件中的 props 或者 state 发生变化时就会触发更新。组件更新的生命周期调用顺序如下：

-   `static getDerivedStateFromProps()`
-   `shouldComponentUpdate()`
-   `render()`
-   `getSnapshotBeforeUpdate()`
-   `componentDidUpdate()`

3. 卸载:

-   `componentWillUnmount()`

4. 废弃的钩子：

-   `componentWillMount`
-   `componentWillReceiveProps`
-   `componentWillUpdate`

#### Vue 和 React 渲染组件的方式有何区别

#### 哪个 React 生命周期可以跳过子组件渲染

#### React 类组件中的 setState 和函数组件中 setState 的区别

#### forEach 和 map 的区别

#### Proxy、Symbol 概念

#### 防抖、节流 概念

#### 重绘与重排

-   修改字体会引起重排

#### JS 中 new 一个对象的过程

#### 宏任务与微任务

#### 闭包的优缺点

#### commonJs 中的 require 与 ES6 中的 import 的区别

#### export 与 import 的区别

#### CSS 加载是否阻塞 DOM 渲染
