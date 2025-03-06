---
title: 学习一下手写 Promise
author: EricYangXD
date: "2021-12-29"
---

## 代码如下，复制自掘金[copy from here](https://juejin.cn/post/6945319439772434469)

- Promise A+ 规范，使用 promises-aplus-tests 测试。

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
    const realOnFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
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
    return reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
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
    return reject(new TypeError("The promise and the return value are the same"));
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

- 测试

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

- command `promises-aplus-tests MyPromise`

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

## Promise 值穿透

Promise then 方法返回值穿透，如果 then 接收的不是函数，那么会把前面的 then 的返回值传递下去。如果一个 then 没有 return 值，那么就会返回 undefined。

```js
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log); // 1
Promise.resolve(1).then(2).then(3).then(console.log); // 1
Promise.resolve(1)
  .then(() => 2)
  .then(3)
  .then(console.log); // 2
Promise.resolve(1).then().then().then(console.log); // 1
Promise.reject(1)
  .catch((e) => {})
  .then(2)
  .then()
  .then(console.log); // undefined
// Promise一经定义立即执行
const p = new Promise((resolve) => {
  console.log(2);
  resolve(3);
  Promise.resolve(4).then(6).then(console.log);
  console.log(5);
}).then(console.log); // 2 5 3 4
const p = new Promise((resolve) => {
  console.log(2);
  resolve(3);
  Promise.resolve(4).then(console.log);
  console.log(5);
}).then(console.log); // 2 5 4 3
```

## 宏任务与微任务

JS 引擎为了让 microtask 尽快的输出，做了一些优化，连续的多个 then（3 个）如果没有 reject 或者 resolve 会交替执行 then 而不至于让 1 个 promise 阻塞太久完成，导致用户的不到响应。不单单 V8 这样，其它引擎也是如此，此时 promise 内部状态实际已经执行结束了。

Promise.then 中返回一个 promise 实例的时候，会出现‘慢两拍’的效果：第一拍，promise 需要由 pending 变为 fulfilled；第二拍，then 函数挂载到 MicroTaskQueue 上（参考 Event Loop）。

UI 触发的 click 事件是异步的，每个 listener 是一个 macrotask；代码触发的 click 底层是 dispatchEvent，这是一个同步的方法，会同步执行所有 listener.

当 V8 执行完调用要返回 Blink 时，由于 MicrotasksScope 作用域失效，在其析构函数中检查 JS 调用栈是否为空，如果为空就会运行 Microtasks。

不是 Macrotasks（宏任务）执行完才会执行 Microtasks!

所有使用 V8 引擎的应用 Microtasks 的运行时机并不都是一样的：

1. explicit 模式下，由应用自己主动调用才会运行 Microtasks。目前 Node 是使用了这种策略。
2. scoped 模式下，由 MicrotasksScope 控制，但作用域失效时，在其析构函数中运行 Microtasks。目前 Blink 是使用这种策略。
3. auto 模式为 V8 的默认值，当调用栈为空的时候就会执行 Microtasks。

### nodejs 中宏任务的优先级

从高到低：

1. timers: 执行 setTimeout，setInterval 的回调;
2. I/O pending callbacks: 处理网络、流、TCP 的错误回调，执行由上一个 tick 延迟下来的 I/O 回调;
3. idle, prepare: 闲置状态 -- nodejs 内部调用，可以忽略;
4. poll 轮询: 执行 poll 中的 I/O 队列，执行除 close callbacks 之外的几乎所有回调，incoming、connections、data、etc.;
5. check 检查存储: 执行 setImmediate 回调;
6. close callbacks: 关闭回调，如`socket.on('close',...)`;

每一步（1-5）执行完了之后，都会执行所有 next tick queue 以及 microtask queue 的回调。

### Node.js 的运行机制

1. V8 引擎解析 JavaScript 脚本。
2. 解析后的代码，调用 Node API。
3. libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎。
4. V8 引擎再将结果返回给用户。

### nodejs 中的 event loop

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js 采用 V8 作为 js 的解析引擎，而 I/O 处理方面使用了自己设计的 libuv，libuv 是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API，事件循环机制也是它里面的实现。

libuv 引擎中的事件循环分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。如下：

外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O 事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段（按照该顺序反复运行）...

1. 先执行同步代码；
2. 执行微任务：process.nextTick 优先级最高，这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行；
3. 按顺序执行 6 个类型的宏任务，每个任务开始之前都要先执行当前的微任务；

- timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
  1. timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。 同样，在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行。
- I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
- idle, prepare 阶段：仅 node 内部使用
- poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
  1. 回到 timer 阶段执行回调
  2. 执行 I/O 回调
- check 阶段：执行 setImmediate() 的回调
  1.  setImmediate()的回调会被加入 check 队列中，check 阶段的执行顺序在 poll 阶段之后。
- close callbacks 阶段：执行 socket 的 close 事件回调

### Node 与浏览器的 Event Loop 差异

浏览器环境下，microtask 的任务队列是每个 macrotask 执行完之后执行。而在 Node.js 中，microtask 会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行 microtask 队列的任务。

node 版本更新到 11 之后，Event Loop 运行原理发生了变化，一旦执行一个阶段里的一个宏任务(setTimeout,setInterval 和 setImmediate)就立刻执行微任务队列，这点就跟浏览器端一致。

### nodejs 开启「多进程」

1. 进程 process，线程 thread
2. 进程，OS 进行资源分配和调度的最小单位，有独立内存空间
3. 线程，OS 进行运算调度的最小单位，共享进程内存空间
4. JS 是单线程的，但可以开启多进程执行，如 WebWorkers

- process-child.fork 方式开启多进程

```js
// process-fork.js
const http = require("http");
const fork = require("child_process").fork;

const server = http.createServer((req, res) => {
  if (req.url === "/xxx") {
    console.log(process.pid);

    // 开启子进程
    const computeProcess = fork("./compute.js");
    computeProcess.send("start");
    computeProcess.on("message", (data) => {
      console.log(data);
      res.end("compute = " + data);
    });
    computeProcess.on("close", () => {
      console.log("close");
      computeProcess.kill();
      res.end("error");
    });
    // res.end(
    // 	JSON.stringify({
    // 		code: 1,
    // 		data: { msg: "hello" },
    // 		message: "success",
    // 		success: true,
    // 	})
    // );
  }
});

server.listen(3000, () => {
  console.log("listen 3000");
});

// compute.js
function compute() {
  // ...
}

process.on("message", (data) => {
  console.log(process.pid);
  console.log(data);

  const res = compute();
  // 发送消息给主进程
  process.send(sum);
});
```

- cluster.fork 方式开启多进程

```js
// cluster.js
const http = require("http");
const cluster = require("cluster");
// CPU核数
const cpuCoreLength = require("os").cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < cpuCoreLength; i++) {
    cluster.fork(); // 开启子进程
  }
  cluster.on("exit", (worker) => {
    console.log("子进程exit");
    cluster.fork(); // 进程守护，工作中使用pm2
  });
} else {
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("done");
  });
  // 多个子进程会共享一个TCP链接，提供一份网络服务
  server.listen(3000);
}
```

### requestAnimationFrame 和 requestIdleCallback

都是宏任务！

1. requestAnimationFrame：每次渲染完都会执行，高优先级
2. requestIdleCallback：浏览器空闲的时候才执行，执行时间最长不超过某个阈值，以免影响后续渲染啥的，低优先级
3. 优先级：setTimeout > requestAnimationFrame > requestIdleCallback

### requestAnimationFrame 比起 setTimeout、setInterval 的优势主要有两点：

1. requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。

2. 在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的的 cpu，gpu 和内存使用量。

像 setTimeout、setInterval 一样，requestAnimationFrame 是一个全局函数。调用 requestAnimationFrame 后，它会要求浏览器根据自己的频率进行一次重绘，它接收一个回调函数作为参数，在即将开始的浏览器重绘时，会调用这个函数，并会给这个函数传入调用回调函数时的时间作为参数。由于 requestAnimationFrame 的功效只是一次性的，所以若想达到动画效果，则必须连续不断的调用 requestAnimationFrame，就像我们使用 setTimeout 来实现动画所做的那样。

requestAnimationFrame 函数会返回一个资源标识符，可以把它作为参数传入 cancelAnimationFrame 函数来取消 requestAnimationFrame 的回调。怎么样，是不是也跟 setTimeout 的 clearTimeout 很相似啊。

所以，可以这么说，requestAnimationFrame 就是一个性能优化版、专为动画量身打造的 setTimeout，不同的是 requestAnimationFrame 不是自己指定回调函数运行的时间，而是跟着浏览器内建的刷新频率来执行回调，这当然就能达到浏览器所能实现动画的最佳效果了。

使用 setTimeout 模拟：

```js
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();
```

或：

```js
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// 使用
(function animate() {
  requestAnimationFrame(animate);
  //动画
})();
```

### JS 异步解决方案的发展历程以及优缺点

#### 回调函数（callback）

1. 缺点：回调地狱，不能用 try catch 捕获错误，不能 return
2. 回调地狱的根本问题在于：
   - 缺乏顺序性： 回调地狱导致的调试困难，和大脑的思维方式不符
   - 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身，即（控制反转）
   - 嵌套函数过多的多话，很难处理错误
3. 优点：解决了同步的问题（只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。）

#### Promise

Promise 就是为了解决 callback 的问题而产生的。Promise 实现了链式调用，也就是说每次 then 后返回的都是一个全新 Promise，如果我们在 then 中 return ，return 的结果会被 Promise.resolve() 包装。

- 优点：解决了回调地狱的问题
- 缺点：无法取消 Promise ，错误需要通过回调函数来捕获

#### Generator

1. 特点：可以控制函数的执行，可以配合 co 函数库使用

#### async/await

async、await 是异步的终极解决方案

1. 优点是：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题
2. 缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低
3. 来看一个使用 await 的例子:

```js
let a = 0;
let b = async () => {
  a = a + (await 10);
  console.log("2", a); // -> '2' 10
};
b();
a++;
console.log("1", a); // -> '1' 1
```

上面的代码可以转换成如下代码：可以很好地解释 await 前面有运算符的时候的运行机制。

```javascript
var a = 0;
var b = () => {
  var temp = a; // 这时候会把temp=0存在调用栈里
  Promise.resolve(10)
    .then((r) => {
      a = temp + r;
    })
    .then(() => {
      console.log("2", a);
    });
};
b();
a++; // 同步代码，这时候a还是0
console.log("1", a); // 同步代码，这时候a变成1
```

### async/await 的执行顺序

1. async/await  是用同步的方式，执行异步操作。
2. thenable: 返回一个对象，包含 then 属性，且 then 属性是个函数接收一个回调函数并在 then 中执行。
3. await  和  Promise.prototype.then  虽然很多时候可以在时间顺序上能等效，但是它们之间有本质的区别。

#### async

async 函数的返回值是 Promise 对象。根据返回值的类型，引起  js 引擎对返回值处理方式的不同：

结论：async 函数在抛出返回值时，会根据返回值类型开启不同数目的微任务

return 结果值：

1. 非 thenable、非 promise（不等待）
2. return 结果值：thenable（等待 1 个 then 的时间）
3. return 结果值：promise（等待 2 个 then 的时间）

#### await

1. await 后面接非  thenable  类型，会立即向微任务队列添加一个微任务 then，但不需等待：Promise.resolve(v)
2. await  后面接  thenable  类型，需要等待一个  then  的时间之后执行
3. await  后面接  promise  类型，会立即执行，等待 promise 的 resolve 或 reject(TC 39 对 await  后面是  promise  的情况如何处理进行了一次修改，移除了额外的两个微任务，在早期版本，依然会等待两个  then  的时间)
4. await 执行完毕后，会把其后的代码立即放到微任务队列中，等待执行。所以完全可以将  await  后面的每行的代码可以看做在  then  里面执行的结果。

```js
async function test() {
  console.log(1);
  await {
    then(cb) {
      cb();
    },
  };
  console.log(2);
}

test();
console.log(3);

Promise.resolve()
  .then(() => console.log(4))
  .then(() => console.log(5))
  .then(() => console.log(6))
  .then(() => console.log(7));

// 最终结果👉: 1 3 4 2 5 6 7
```

综合示例：Promise 状态吸收

```js
async function async2() {
  new Promise((resolve, reject) => {
    resolve();
  });
}

// 发生状态吸收：要等两个then 执行完，才会执行 async2
async function async3() {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

async function async1() {
  // 方式一：最终结果：B A C D E
  // await new Promise((resolve, reject) => {
  //     resolve()
  // })

  // 方式二：最终结果：B A C D E
  // await async2()

  // 方式三：最终结果：B C D A E
  // await async3();

  console.log("A");
}

async1();

new Promise((resolve) => {
  console.log("B");
  resolve();
})
  .then(() => {
    console.log("C");
  })
  .then(() => {
    console.log("D");
  })
  .then(() => {
    console.log("E");
  });
```

下面 👇🏻 例子中，async 函数返回了 promise，所以这个 promise 要等待 2 个（轮）then 的时间再执行

```js
// demo1
async function async1() {
  console.log("1");
  await async2();
  console.log("AAA");
}

async function async2() {
  console.log("3");
  return new Promise((resolve, reject) => {
    resolve(); // 等2轮then再执行
    console.log("4");
  }).then(() => {
    console.log("11");
  });
}

console.log("5");

setTimeout(() => {
  console.log("6");
}, 0);

async1();

new Promise((resolve) => {
  console.log("7");
  resolve();
})
  .then(() => {
    console.log("8");
  })
  .then(() => {
    console.log("9");
  })
  .then(() => {
    console.log("10");
  });

// 输出：5 1 3 4 7 11 8 9 AAA 10 6

// demo2
async function async1() {
  console.log("1");
  await async2();
  console.log("AAA");
}

async function async2() {
  console.log("3");
  return new Promise((resolve, reject) => {
    // setTimeout(() => resolve(), 0); // 等2轮then再执行
    setTimeout(() => {
      console.log("setTimeout-->resolved");
      resolve();
    }, 0);
    console.log("4");
  }).then(() => {
    console.log("11");
  });
}

console.log("5");

setTimeout(() => {
  console.log("6");
}, 0);

async1();

new Promise((resolve) => {
  console.log("7");
  resolve();
})
  .then(() => {
    console.log("8");
  })
  .then(() => {
    console.log("9");
  })
  .then(() => {
    console.log("10");
  });
// 输出：5 1 3 4 7 8 9 10 6 setTimeout-->resolved 11 AAA

// demo3
function func() {
  console.log(2);
  // 方式一：1 2 4  5 3 6 7  // 不return的时候，执行完第一个then函数就相当于执行完成了，await 相当于await undefined，执行完后把await后面的push到微任务队列中
  // Promise.resolve()
  //   .then(() => console.log(5))
  //   .then(() => console.log(6))
  //   .then(() => console.log(7))

  // 方式二：1 2 4  5 6 7 3  // return的时候，相当于 await Promise.resolve()，按交替顺序执行，执行完才把await后面的push到微任务队列中
  return Promise.resolve()
    .then(() => console.log(5))
    .then(() => console.log(6))
    .then(() => console.log(7));
}

async function test() {
  console.log(1);
  await func();
  console.log(3);
}

test();
console.log(4);

// demo4
function func() {
  return new Promise((resolve) => {
    console.log("B");
    // resolve(); //故意一直保持pending
  });
}

async function test() {
  console.log(1);
  await func();
  console.log(3);
}

test();
console.log(4);
// 最终结果👉: 1 B 4 (永远不会打印3)
```

### 做题技巧

大致思路 👇：

1. 首先，**async 函数的整体返回值永远都是 Promise，无论值本身是什么**
2. 方式一：await 的是 Promise，无需等待
3. 方式二：await 的是 async 函数，但是该函数的返回值本身是**非 thenable**，无需等待
4. 方式三：await 的是 async 函数，且返回值本身是 Promise，需等待两个 then 时间
5. 综上，await 一定要等到右侧的表达式有确切的值才会放行，否则将一直等待（阻塞当前 async 函数内的后续代码）

### async 函数改为并发

```javascript
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch("XXX1");
  await fetch("XXX2");
  await fetch("XXX3");
}
```

上面的代码，会依次去等待 fetch 执行，如果实际上这三个 fetch 调用的结果不相关的话，可以改为并发模式：

1. 使用 Promise.all 或 Promise.allSettled；
   - Promise.all：如果其中一个失败，则返回失败的 Promise；如果都成功，则返回成功的 Promise 数组；但是如果某个请求比较耗时，则其他请求也会被阻塞；
   - Promise.allSettled：不管成功还是失败，都返回一个 Promise 数组；
2. 改为 for 循环或者如下模式：

```javascript
const res = [];
async function fetchData(url, idx) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data); // 处理返回的数据
  res[idx] = data;
}

async function fetchConcurrently(urls) {
  for (let i = 0; i < urls.length; i++) {
    (function (i) {
      setTimeout(() => {
        fetchData(urls[i], i);
      }, 0); // 使用 setTimeout 实现非阻塞调用
    })(i);
  }
}

// 示例 URLs 数组
const urls = [
  "https://jsonplaceholder.typicode.com/posts/1",
  "https://jsonplaceholder.typicode.com/posts/2",
  "https://jsonplaceholder.typicode.com/posts/3",
];

// 调用函数并发请求
fetchConcurrently(urls);

// 如下模式是Promise的并发请求模式
async function test() {
  // 发起所有请求并保存 Promise
  let a = fetch("XXX1");
  let b = fetch("XXX2");
  let c = fetch("XXX3");

  // 使用 Promise.all 等待所有请求完成
  let [aa, bb, cc] = await Promise.all([a, b, c]);

  console.log(aa, bb, cc);
}
```

### Promise 构造函数是同步还是异步执行

Promise 构造函数是同步执行，而`.then`、`.catch` 等都是异步（还有 process.nextTick 等等），而且放到了微队列中，`async/await` 中，`await` 前面的是同步，`await` 后面的是异步，写法上是这样，但是其实是语法糖，最后还是会转为 `Promise.then` 的形式。`.then`的 cb 被放入了微任务队列，产生了异步执行。如果 resolve 被同步使用，实质上 resolve 仍然是同步的。

### 模拟实现 Promise.finally

```javascript
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
```

### Promise.all 原理实现

输入的所有 Promise 都 fulfilled 时，返回一个依次包含返回结果的数组；如果有任意一个 Promise 变为 rejected，那么就返回这个 rejected 作为结果。

- Promise.all 方法将多个 Promise 实例包装成一个新的 Promise 实例（p），可以接受一个数组`[p1,p2,p3]`作为参数，此时数组中不一定都是 Promise 对象，如果不是的话，就会调用 Promise.resolve 将其转化为 Promise 对象之后再进行处理。（当然 Promise.all 方法的参数也可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例）。
- 使用 Promise.all 生成的 Promise 对象（p）的状态是由数组中的 Promise 对象（p1,p2,p3）决定的：

  1. 如果所有的 Promise 对象（p1,p2,p3）都变成 fullfilled 状态的话，生成的 Promise 对象（p）也会变成 fullfilled 状态，p1,p2,p3 三个 Promise 对象产生的结果会组成一个数组返回给传递给 p 的回调函数；
  2. 如果 p1,p2,p3 中有一个 Promise 对象变为 rejected 状态的话，p 也会变成 rejected 状态，第一个被 rejected 的对象的返回值会传递给 p 的回调函数。

- Promise.all 方法生成的 Promise 对象也会有一个 catch 方法来捕获错误处理，但是如果作为参数的 Promise 实例自身定义了 catch 方法，那么它被 rejected 时并不会触发 Promise.all 的 catch 方法，而是会执行自己的 catch 方法，并且返回一个状态为 fullfilled 的 Promise 对象（catch 方法也是返回一个新的 Promise 实例），Promise.all 生成的对象会接受这个 Promise 对象，不会返回 rejected 状态。

```js
function promiseAll(promises) {
  return new Promise(function (resolve, reject) {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("argument must be an array!"));
    }

    var promiseNum = promises.length;
    if (promiseNum === 0) {
      return resolve([]);
    }

    var countNum = 0;
    var resolvedvalue = new Array(promiseNum);
    // for (let i = 0; i < promiseNum; i++) {
    //   (function (i) {
    //     Promise.resolve(promises[i]).then(
    //       function (value) {
    //         countNum++;
    //         resolvedvalue[i] = value;
    //         if (countNum === promiseNum) {
    //           return resolve(resolvedvalue);
    //         }
    //       },
    //       function (reason) {
    //         return reject(reason);
    //       }
    //     );
    //   })(i);
    // }
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          countNum++;
          resolvedvalue[index] = value;
          if (countNum === promiseNum) {
            resolve(resolvedvalue);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
}
var p1 = Promise.resolve(1),
  p2 = Promise.resolve(2),
  p3 = Promise.resolve(3);
promiseAll([p1, p2, p3]).then(function (value) {
  console.log(value);
});
```

### Promise.race

`Promise.race` 方法也是将多个 Promise 实例包装成一个新的 Promise 实例。接收参数的规则同 `Promise.all`，但是只要有一个实例率先改变状态（fulfilled 或 rejected），`Promise.race` 实例的状态就跟着改变，采用第一个 Promise 的值作为它的值，从而异步地解析或拒绝（一旦堆栈为空）。

```js
const promiseRace = (promises) => {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== "function") {
      return reject(new TypeError("Argument is not iterable"));
    }
    promises.forEach((item) => {
      Promise.resolve(item)
        .then((value) => resolve(value))
        .catch((error) => reject(error));
    });
  });
};

var p1 = Promise.resolve(1),
  p2 = new Promise((resolve, reject) => setTimeout(reject, 1000, "two")),
  p3 = Promise.resolve(3);
promiseRace([p1, p2, p3]).then(function (value) {
  console.log(value);
});
```

### Promise.any

实验性质。接收一个 Promise 可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和 AggregateError 类型的实例，它是 Error 的一个子类，用于把单一的错误集合在一起。本质上，这个方法和 Promise.all() 是相反的。

```js
// any：一个成功就成功，全部失败才失败
function any(promises) {
  const rejectedArr = []; // 记录失败的结果
  let rejectedTimes = 0; // 记录失败的次数
  return new Promise((resolve, reject) => {
    if (promises == null || promises.length == 0) {
      reject("无效的 any");
    }
    for (let i = 0; i < promises.length; i++) {
      let p = promises[i];
      // 处理 promise
      if (p && typeof p.then === "function") {
        p.then(
          (data) => {
            resolve(data); // 使用最先成功的结果
          },
          (err) => {
            // 如果失败了，保存错误信息；当全失败时，any 才失败
            rejectedArr[i] = err;
            rejectedTimes++;
            if (rejectedTimes === promises.length) {
              reject(rejectedArr);
            }
          }
        );
      } else {
        // 处理普通值，直接成功
        resolve(p);
      }
    }
  });
}
```

### Promise.allSettled

返回一个在所有给定的 promise 都已经 fulfilled 或 rejected 后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果;

```js
// allSettled：全部执行完成后，返回全部执行结果（成功+失败）
function allSettled(promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError("need an array");
    return;
  }
  const result = new Array(promises.length); // 记录执行的结果：用于返回直接结果
  let times = 0; // 记录执行完成的次数：判断是否完成
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let p = promises[i];
      if (p && typeof p.then === "function") {
        p.then((data) => {
          result[i] = { status: "fulfilled", value: data };
          times++;
          if (times === promises.length) {
            resolve(result);
          }
        }).catch((err) => {
          result[i] = { status: "rejected", reason: err };
          times++;
          if (times === promises.length) {
            resolve(result);
          }
        });
      } else {
        // 普通值，加入
        result[i] = { status: "fulfilled", value: p };
        times++;
        if (times === promises.length) {
          resolve(result);
        }
      }
    }
  });
}
```

## 如何取消 Promise

理论上来说 Promise 一旦新建就会立即执行，不可中途取消。但我们可以自己模拟，只不过是利用 reject 来实现中断的效果，实际上可能还是会执行，但是只要返回 rejected 我们就认为中断了即可。

### 借助 Promise.reject

```js
function getPromise(callback) {
  let _resolve, _reject;
  const promise = new Promise((res, rej) => {
    _resolve = res;
    _reject = rej;
    callback && callback(res, rej);
  });
  return {
    promise,
    abort: () => {
      _reject({ message: "promise aborted" });
    },
  };
}

function runCallback(resolve, reject) {
  setTimeout(() => {
    resolve(12345);
  }, 5000);
}
const { promise, abort } = getPromise(runCallback);
promise.then(/*...*/).catch(/*...*/);
abort();
```

### 借助 Promise.race

`Promise.race(iterable)`方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

```js
function getPromiseWithAbort(p) {
  let obj = {};
  let p1 = new Promise((resolve, reject) => {
    obj.abort = reject;
  });
  obj.promise = Promise.race([p, p1]);
  return obj;
}
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(12345);
  }, 5000);
});
const promiseObj = getPromiseWithAbort(promise);
promiseObj.promise.then(/*...*/).catch(/*...*/);
obj.abort("取消执行");
```

### 为什么 Promise 中的错误不能被 try/catch？

要提供 Promise 给外部使用，Promise 设计成在外面是没有办法获取 resolve 函数的，也就改变不了一个已有 Promise 的状态，我们只能基于已有 Promise 去生成新的 Promise。如果允许异常向外抛出，那我们该怎么恢复后续 Promise 的执行？比如 Promise a 出现异常了，异常向外抛出，外面是没办法改变 Promise a 的数据的。设计成在 Promise 里面发生任何错误时，都让当前 Promise 进入 rejected 状态，然后调用之后的 catch handler，catch handler 有能力返回新的 Promise，提供 fallback 方案，可以大大简化这其中的复杂度。

简而言之，就是 Promise 内部消化了， 不会向外抛出，所以没办法被捕获，但是提供了 catch 方法进行捕获。try/catch 捕获同步任务。

### 为什么 async/await 中的错误能被 try/catch？

async/await 是基于生成器+Promise 的，生成器函数是一个带星号函数，而且是可以暂停执行和恢复执行的。

生成器函数的具体使用方式：

在生成器函数内部执行一段代码，如果遇到 yield 关键字，那么 V8 将返回关键字后面的内容给外部，并暂停该函数的执行。

外部函数可以通过 next 方法恢复函数的执行。

async 是一个通过异步执行并隐式返回 Promise 作为结果的函数。

对于 await 来说，不管最终 Promise 是 resolve 还是 reject，都会返回给父协程，如果父协程收到的是一个 error，那么外围的 try/catch 就会执行。
