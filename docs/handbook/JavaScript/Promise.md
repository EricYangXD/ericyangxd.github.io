---
title: 学习一下手写 Promise
author: EricYangXD
date: "2021-12-29"
---

## 代码如下，复制自掘金[copy from here](https://juejin.cn/post/6945319439772434469)

-   Promise A+ 规范，使用 promises-aplus-tests 测试。

```js
// MyPromise.js

// 先定义三个常量表示状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// 新建 MyPromise 类
class MyPromise {
	constructor(executor) {
		// executor 是一个执行器，进入会立即执行
		// 并传入resolve和reject方法
		try {
			executor(this.resolve, this.reject);
		} catch (error) {
			this.reject(error);
		}
	}

	// 储存状态的变量，初始值是 pending
	status = PENDING;
	// 成功之后的值
	value = null;
	// 失败之后的原因
	reason = null;

	// 存储成功回调函数
	onFulfilledCallbacks = [];
	// 存储失败回调函数
	onRejectedCallbacks = [];

	// 更改成功后的状态
	resolve = (value) => {
		// 只有状态是等待，才执行状态修改
		if (this.status === PENDING) {
			// 状态修改为成功
			this.status = FULFILLED;
			// 保存成功之后的值
			this.value = value;
			// resolve里面将所有成功的回调拿出来执行
			while (this.onFulfilledCallbacks.length) {
				// Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
				this.onFulfilledCallbacks.shift()(value);
			}
		}
	};

	// 更改失败后的状态
	reject = (reason) => {
		// 只有状态是等待，才执行状态修改
		if (this.status === PENDING) {
			// 状态成功为失败
			this.status = REJECTED;
			// 保存失败后的原因
			this.reason = reason;
			// resolve里面将所有失败的回调拿出来执行
			while (this.onRejectedCallbacks.length) {
				this.onRejectedCallbacks.shift()(reason);
			}
		}
	};

	then(onFulfilled, onRejected) {
		const realOnFulfilled =
			typeof onFulfilled === "function" ? onFulfilled : (value) => value;
		const realOnRejected =
			typeof onRejected === "function"
				? onRejected
				: (reason) => {
						throw reason;
				  };

		// 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
		const promise2 = new MyPromise((resolve, reject) => {
			const fulfilledMicrotask = () => {
				// 创建一个微任务等待 promise2 完成初始化
				queueMicrotask(() => {
					try {
						// 获取成功回调函数的执行结果
						const x = realOnFulfilled(this.value);
						// 传入 resolvePromise 集中处理
						resolvePromise(promise2, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			};

			const rejectedMicrotask = () => {
				// 创建一个微任务等待 promise2 完成初始化
				queueMicrotask(() => {
					try {
						// 调用失败回调，并且把原因返回
						const x = realOnRejected(this.reason);
						// 传入 resolvePromise 集中处理
						resolvePromise(promise2, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			};
			// 判断状态
			if (this.status === FULFILLED) {
				fulfilledMicrotask();
			} else if (this.status === REJECTED) {
				rejectedMicrotask();
			} else if (this.status === PENDING) {
				// 等待
				// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
				// 等到执行成功失败函数的时候再传递
				this.onFulfilledCallbacks.push(fulfilledMicrotask);
				this.onRejectedCallbacks.push(rejectedMicrotask);
			}
		});

		return promise2;
	}

	// resolve 静态方法
	static resolve(parameter) {
		// 如果传入 MyPromise 就直接返回
		if (parameter instanceof MyPromise) {
			return parameter;
		}

		// 转成常规方式
		return new MyPromise((resolve) => {
			resolve(parameter);
		});
	}

	// reject 静态方法
	static reject(reason) {
		return new MyPromise((resolve, reject) => {
			reject(reason);
		});
	}
}
// 不符合规范
function resolvePromise(promise2, x, resolve, reject) {
	// 如果相等了，说明return的是自己，抛出类型错误并返回
	if (promise2 === x) {
		return reject(
			new TypeError("Chaining cycle detected for promise #<Promise>")
		);
	}
	// 判断x是不是 MyPromise 实例对象
	if (x instanceof MyPromise) {
		// 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
		// x.then(value => resolve(value), reason => reject(reason))
		// 简化之后
		x.then(resolve, reject);
	} else {
		// 普通值
		resolve(x);
	}
}

// 符合规范
function resolvePromise(promise, x, resolve, reject) {
	// 如果相等了，说明return的是自己，抛出类型错误并返回
	if (promise === x) {
		return reject(
			new TypeError("The promise and the return value are the same")
		);
	}

	if (typeof x === "object" || typeof x === "function") {
		// x 为 null 直接返回，走后面的逻辑会报错
		if (x === null) {
			return resolve(x);
		}

		let then;
		try {
			// 把 x.then 赋值给 then
			then = x.then;
		} catch (error) {
			// 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
			return reject(error);
		}

		// 如果 then 是函数
		if (typeof then === "function") {
			let called = false;
			try {
				then.call(
					x, // this 指向 x
					// 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
					(y) => {
						// 如果 resolvePromise 和 rejectPromise 均被调用，
						// 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
						// 实现这条需要前面加一个变量 called
						if (called) return;
						called = true;
						resolvePromise(promise, y, resolve, reject);
					},
					// 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
					(r) => {
						if (called) return;
						called = true;
						reject(r);
					}
				);
			} catch (error) {
				// 如果调用 then 方法抛出了异常 error：
				// 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
				if (called) return;

				// 否则以 error 为据因拒绝 promise
				reject(error);
			}
		} else {
			// 如果 then 不是函数，以 x 为参数执行 promise
			resolve(x);
		}
	} else {
		// 如果 x 不为对象或者函数，以 x 为参数执行 promise
		resolve(x);
	}
}

module.exports = MyPromise;
```

-   测试

```js
// MyPromise.js

MyPromise {
  ......
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}

module.exports = MyPromise;
```

-   command `promises-aplus-tests MyPromise`

## Promise 并发控制

```js
class Schedule {
	constructor(maxNum) {
		this.list = [];
		this.maxNum = maxNum;
		this.workingNum = 0;
	}

	add(promiseCreator) {
		this.list.push(promiseCreator);
	}

	start() {
		for (let index = 0; index < this.maxNum; index++) {
			this.doNext();
		}
	}

	doNext() {
		if (this.list.length && this.workingNum < this.maxNum) {
			this.workingNum++;
			const promise = this.list.shift();
			promise().then(() => {
				this.workingNum--;
				this.doNext();
			});
		}
	}
}

const timeout = (time) =>
	new Promise((resolve) => {
		setTimeout(resolve, time);
	});

const schedule = new Schedule(2);

const addTask = (time, order) => {
	schedule.add(() =>
		timeout(time).then(() => {
			console.log(order);
		})
	);
};

addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4);

schedule.start();
```

```js
async function asyncPool(poolLimit, array, iteratorFn) {
	const ret = []; // 存储所有的异步任务
	const executing = []; // 存储正在执行的异步任务
	for (const item of array) {
		// 调用iteratorFn函数创建异步任务
		const p = Promise.resolve().then(() => iteratorFn(item, array));
		ret.push(p); // 保存新的异步任务

		// 当poolLimit值小于或等于总任务个数时，进行并发控制
		if (poolLimit <= array.length) {
			// 当任务完成后，从正在执行的任务数组中移除已完成的任务
			const e = p.then(() => executing.splice(executing.indexOf(e), 1));
			executing.push(e); // 保存正在执行的异步任务
			if (executing.length >= poolLimit) {
				await Promise.race(executing); // 等待较快的任务执行完成
			}
		}
	}
	return Promise.all(ret);
}
```

```js
function asyncPool(poolLimit, array, iteratorFn) {
	let i = 0;
	const ret = []; // 存储所有的异步任务
	const executing = []; // 存储正在执行的异步任务
	const enqueue = function () {
		if (i === array.length) {
			return Promise.resolve();
		}
		const item = array[i++]; // 获取新的任务项
		const p = Promise.resolve().then(() => iteratorFn(item, array));
		ret.push(p);

		let r = Promise.resolve();

		// 当poolLimit值小于或等于总任务个数时，进行并发控制
		if (poolLimit <= array.length) {
			// 当任务完成后，从正在执行的任务数组中移除已完成的任务
			const e = p.then(() => executing.splice(executing.indexOf(e), 1));
			executing.push(e);
			if (executing.length >= poolLimit) {
				r = Promise.race(executing);
			}
		}

		// 正在执行任务列表 中较快的任务执行完成之后，才会从array数组中获取新的待办任务
		return r.then(() => enqueue());
	};
	return enqueue().then(() => Promise.all(ret));
}
```
