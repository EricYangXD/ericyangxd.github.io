---
title: Jest初探
author: EricYangXD
date: "2023-02-03"
meta:
  - name: keywords
    content: jest,tdd,bdd
---

## jest 的简单使用

### 安装

1. 使用`npm init -y`初始化项目
2. 安装`jest npm install --save-dev jest`
3. 运行`npx jest --init`命令，生成一份 jest 的配置文件`jest.config.js`
4. 运行`npm i babel-jest @babel/core @babel/preset-env -D`安装 babel，并且配置`.babelrc`如下:

```json
{
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
```

5. 根目录下建立 src 文件夹，新建两个文件`add.js`和`add.test.js`
6. `package.json`增加一条命令：`"test": "jest"`

### 使用

```js
import { findMax, twoSum } from "./add";

// 期望findMax([2, 6, 3])执行后结果为6
test("findMax([2, 6, 3])", () => {
	expect(findMax([2, 6, 3])).toBe(6);
});

// 期望twoSum([2, 3, 4, 6], 10)执行后结果为true
test("twoSum([2, 3, 4, 6], 10)", () => {
	expect(twoSum([2, 3, 4, 6], 10)).toBe(true);
});
```

```js
// 字符串相关
test("toMatch", () => {
	const str = "Lebron James";
	expect(str).toMatch(/Ja/);
	expect(str).toMatch("Ja");
});
test("Array Set matchers", () => {
	const arr = ["Kobe", "James", "Curry"];
	const set = new Set(arr);
	expect(arr).toContain("Kobe");
	expect(set).toContain("Curry");
	expect(arr).toHaveLength(3);
});
```

运行`npm test`命令，控制台会打印测试结果。

### 常用 jest matcher

在 expect 函数后面跟着的判断结果的 toBe 在 jest 中被称为 matcher。

1. toBe：判断基本类型
2. toEqual：判断数组、对象等引用类型
3. toBeNull：：只匹配 null
4. toBeUndefined：只匹配 undefined
5. toBeDefined：与 toBeUndefined 相反
6. toBeTruthy：匹配任何被 if 语句视为 true 的东西
7. toBeFalsy：匹配任何被 if 语句视为 false 的东西
8. toBeGreaterThan：>
9. toBeGreaterThanOrEqual：≥
10. toBeLessThan：<
11. toBeLessThanOrEqual：≤
12. toBeCloseTo：对浮点数可以用于代替 toEqual
13. toBeCalledWith：测试函数的传参数是否符合预期
14. toMatch：判断字符串是否和 toMatch 提供的模式匹配
15. toMatchObject：匹配对象{}的一部分键值对
16. toContain：判断数组或者集合是否包含某个元素
17. toHaveLength：判断数组的长度
18. toThrow：测试一个特定的函数在被调用时是否会抛出一个错误
19. `.resolves / .rejects`：放在 toXXX 之前，接收异步的结果
20. `.not`：放在 toXXX 之前，表示非/否/取反
21. 如果测试代码里使用`.catch`，jest 不回去执行`.catch`里的内容，所以需要我们去写`expect.assertions(1)`这句话，代表期望执行的断言是 1 次，catch 方法算一次断言。

### 异步代码测试

```js
// Promise
test("the data is peanut butter", () => {
	// 注意：要使用return返回
	return fetchData().then((data) => {
		expect(data).toBe("peanut butter");
	});
});

test("the data is peanut butter", () => {
	// 注意：要使用return返回
	return expect(fetchData()).resolves.toBe("peanut butter");
});

// async/await
test("the data is peanut butter", async () => {
	const data = await fetchData();
	expect(data).toBe("peanut butter");
});

test("the fetch fails with an error", async () => {
	expect.assertions(1);
	try {
		await fetchData();
	} catch (e) {
		expect(e).toMatch("error");
	}
});

// You can combine async and await with .resolves or .rejects.
test("the data is peanut butter", async () => {
	await expect(fetchData()).resolves.toBe("peanut butter");
});

test("the fetch fails with an error", async () => {
	await expect(fetchData()).rejects.toMatch("error");
});
// toThrow
test("测试request 404", () => {
	return expect(requestErr()).rejects.toThrow(/404/);
});
```

对于 setTimeout，要使用 done。

如果我们需要测试代码在真正执行了定时器里的异步逻辑后，才返回测试结果，我们需要给 test 方法的回调函数传入一个 done 参数，并在 test 方法内异步执行的代码中调用这个 done 方法，这样，test 方法会等到 done 所在的代码块内容执行完毕后才返回测试结果：

```js
import timeout from "./timeout";

test("测试timer", (done) => {
	timeout(() => {
		expect(2 + 2).toBe(4);
		done();
	});
});
```

### 使用 describe 函数分组

比如我们想要对某个类的 4 个方法单独测试，数据互相不影响，此时我们可以去直接实例化 4 个对象，分别测试。也可以使用 describe 函数配合 test 将测试分为 4 个组，一次性测试完成，更简洁优雅。

### 钩子函数

为了能更好的控制每个 test 组，我们就要用到 jest 的勾子函数：

1. `beforeEach`: 在每一个 test 函数执行之前，会被调用
2. `beforeAll`: 在所有 test 函数执行之前调用
3. `afterEach`: 在每一个 test 函数执行之后调用
4. `afterAll`: 在所有 test 函数执行之后调用

```js
import Count from "./hook";

describe("分别测试Count的4个方法", () => {
	let count;
	beforeAll(() => {
		console.log("before all tests!");
	});

	beforeEach(() => {
		console.log("before each test!");
		// 在每个test执行之前，beforeEach里面重新实例化了count，所以每一次的count是不同的。
		count = new Count();
	});

	afterAll(() => {
		console.log("after all tests!");
	});

	afterEach(() => {
		console.log("after each test!");
	});

	test("测试increase", () => {
		count.increase();
		console.log(count.count);
	});
	test("测试decrease", () => {
		count.decrease();
		console.log(count.count);
	});
	test("测试double", () => {
		count.double();
		console.log(count.count);
	});
	test("测试half", () => {
		count.half();
		console.log(count.count);
	});
});
```

### 使用 fakeTimers 提高测试效率

我们可以使用 fakeTimers 模拟真实的定时器。这个 fakeTimers 在遇到定时器时，允许我们立即跳过定时器等待时间，执行内部逻辑。

1. 首先，我们使用 jest.fn()生成一个 jest 提供的用来测试的函数，这样我们之后回调函数不需要自己去写一个
2. 其次，我们使用 jest.useFakeTimers()方法启动 fakeTimers
3. 最后，我们可以通过 jest.advanceTimersByTime()方法，参数传入毫秒时间，jest 会立即跳过这个时间值，还可以通过 toHaveBeenCalledTimes()这个 mathcer 来测试函数的调用次数。

```js
test("测试timer", () => {
	jest.useFakeTimers();
	const fn = jest.fn();
	timeout(fn);
	// 时间快进2秒
	jest.advanceTimersByTime(2000);
	expect(fn).toHaveBeenCalledTimes(1);
});
```

1. `jest.runAllTimers()`: 调用之后，会执行所有定时器
2. `jest.runOnlyPendingTimers()`: 只执行当前正在等待的所有定时器
3. 如果我们编写了多个 test 函数，它们都使用 fakeTimers，一定要在`beforeEach`勾子中每次都调用`jest.useFakeTimers()`，否则，多个 test 函数中的 fakeTimers 会是同一个，将会互相干扰，产生不符合预期的执行结果。

### 在测试中模拟（mock）数据

首先新建 mock.js, mock.test.js 文件

#### 使用 jest.fn()模拟函数

```js
export const run = (fn) => {
	return fn("this is run!");
};
```

1. 首先，我们的`run()`函数可以接受一个函数作为参数，这个函数就是我们想要`jest.fn()`为我们 mock 的函数，我们编写`mock.test.js`：

```js
test("测试 jest.fn()", () => {
	const fn = jest.fn(() => {
		return "this is mock fn 1";
	});
});
```

2. 其次，`jest.fn()`可以初始化时候不传入参数，然后通过调用生成的 mock 函数的`mockImplementation`或者`mockImplementationOnce`方法来改变 mock 函数内容，这两个方法的区别是，`mockImplementationOnce`只会改变要 mock 的函数一次：

```js
test("测试 jest.fn()", () => {
	const func = jest.fn();
	func.mockImplementation(() => {
		return "this is mock fn 1";
	});
	func.mockImplementationOnce(() => {
		return "this is mock fn 2";
	});
	const a = run(func);
	const b = run(func);
	const c = run(func);
	console.log(a);
	console.log(b);
	console.log(c);
	// 函数执行的结果第一次是this is mock fn 2，之后都是this is mock fn 1
});
```

3. 同样的，我们可以使用 mock 函数的`mockReturnValue`和`mockReturnValueOnce`（一次）方法来改变函数的返回值：

```js
test("测试 jest.fn()", () => {
	const func = jest.fn();
	func.mockImplementation(() => {
		return "this is mock fn 1";
	});
	func.mockImplementationOnce(() => {
		return "this is mock fn 2";
	});
	func.mockReturnValue("this is mock fn 3");
	// 方法是可以链式调用的，方便多次输出不同的返回值。
	func
		.mockReturnValueOnce("this is mock fn 4")
		.mockReturnValueOnce("this is mock fn 5")
		.mockReturnValueOnce("this is mock fn 6");
	const a = run(func);
	const b = run(func);
	const c = run(func);
	const d = run(func);
	console.log(a);
	console.log(b);
	console.log(c);
	console.log(d);
});
```

4. 最后，我们可以使用 toBeCalledWith 这个 matcher 来测试函数的传参数是否符合预期：

```js
test("测试 jest.fn()", () => {
	const func = jest.fn();
	const a = run(func);
	expect(func).toBeCalledWith("this is run!");
});
```

#### 模拟接口中获取的数据

1. 首先在`mock.js`中编写一个简单的请求数据的代码：

```js
import axios from "axios";

export const request = (fn) => {
	return axios.get("https://jsonplaceholder.typicode.com/todos/1");
};
```

2. 接着，我们在`mock.test.js`中，使用`jest.mock()`方法模拟 axios，使用`mockResolvedValue`和`mockResolvedValueOnce`方法模拟返回的数据，同样的，`mockResolvedValueOnce`方法只会改变一次返回的数据：

```js
import axios from "axios";
import { request } from "./mock";

jest.mock("axios");

test("测试request", async () => {
	axios.get.mockResolvedValueOnce({ data: "Jordan", position: "SG" });
	axios.get.mockResolvedValue({ data: "kobe", position: "SG" });
	await request().then((res) => {
		expect(res.data).toBe("Jordan");
	});
	await request().then((res) => {
		expect(res.data).toBe("kobe");
	});
});
```

### dom 相关测试

首先新建`dom.js`, `dom.test.js`两个文件:

```js
// dom.js
export const generateDiv = () => {
	const div = document.createElement("div");
	div.className = "test-div";
	document.body.appendChild(div);
};

// dom.test.js
import { generateDiv } from "./dom";

test("测试dom操作", () => {
	generateDiv();
	generateDiv();
	generateDiv();
	expect(document.getElementsByClassName("test-div").length).toBe(3);
});
```

jest 的运行环境是 node.js，这里 jest 使用 jsdom 来让我们可以书写 dom 操作相关的测试逻辑。

### 快照（snapshot）测试

首先新建`snapshot.js`, `shapshot.test.js`, 日常开发中，总会写一些配置性的代码，它们大体不会变化，但是也会有小的变更，这样的配置可能如下（`snapshot.js`）:

```js
// snapshot.js
export const getConfig = () => {
	return {
		server: "https://demo.com",
		port: "8080",
	};
};

// shapshot.test.js
import { getConfig } from "./snapshot";

test("getConfig测试", () => {
	expect(getConfig()).toEqual({
		server: "https://demo.com",
		port: "8080",
	});
});
```

假如后续我们的配置改变了，我就需要同步的去修改测试代码，这样会比较麻烦，从而，jest 为我们引入了快照测试，先上测试代码：

```js
test("getConfig测试", () => {
	expect(getConfig()).toMatchSnapshot();
});
```

运行测试代码之后，会在项目根目录下生成一个`__snapshots__`文件夹，下面有一个`snapshot.test.js.snap`快照文件，文件内容如下：

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`getConfig测试 1`] = `
Object {
  "port": "8080",
  "server": "https://demo.com",
}
`;
```

jest 会在运行`toMatchSnapshot()`的时候，首先检查有没有这个快照文件，如果没有，则生成，当我们改动配置内容时，比如把 port 改为 8090，再次运行测试代码，测试不通过，这个时候，我们只需要运行`npm test snapshot.test -- -u`，就可以自动更新我们的快照文件，测试再次通过，这就让我们不需要每次更改配置文件的时候，手动去同步更新测试代码，提高了测试开发效率。

### 其他功能

#### 让 jest 监听文件变化

`jest --watch`，为了能让 jest 可以监听文件变化，我们还需要把我们的代码文件变成一个 git 仓库，jest 也正式依靠 git 的能力实现监听文件变化的。

#### 生成测试覆盖率文件

`jest --coverage`，文件夹下自动生成了一个 coverage 文件夹。

### 关于 jest.config.js 配置文件

可以通过 jest 初始化时候默认生成的那个`jest.config.js`来学习（有详细注释），也可以在[官网](https://jestjs.io/)中查阅相关的配置参数。
