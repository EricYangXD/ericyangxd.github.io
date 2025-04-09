---
title: 前端面试题3
author: EricYangXD
date: "2025-04-09"
meta:
  - name: keywords
    content: 前端面试题
---

### 设计模式

#### 工厂模式

生成一个函数，return 一个实例，每次需要生成实例的时候直接调这个函数即可，而不需要 new。

#### 单例模式

生成一个全局唯一的实例且不能生成第二个，比如 Redux、Vuex 的 store 或者全局唯一的 dialog、modal 等。例：js 是单线程的，创建单例很简单

```ts
class SingleTon {
  private static instance: SingleTon | null = null;
  private constructor() {}
  public static getInstance(): SingleTon {
    if (this.instance === null) {
      this.instance = new SingleTon();
    }
    return this.instance;
  }
  fn1() {}
  fn2() {}
}

const sig = SingleTon.getInstance();
sig.fn1();
```

#### 代理模式

Proxy：在对象之间架设一个拦截层，对一些操作进行拦截和处理。

#### 观察者模式

一个主题，一个观察者，主体变化后触发观察者执行：`btn.addEventListener('click',()=>{...})`，Subject 和 Observer 直接绑定，没有中间媒介。

#### 发布订阅模式

订阅/绑定一些事件`eventBus.on('event1',()=>{});`，然后发布/触发这些事件`eventBus.emit('event1',props);`，绑定的事件在组件销毁时记得删除解绑。Publisher 和 Observer 互不认识，需要中间媒介 Event Channel。

和观察者模式的区别：![对比](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/subwatcher.png)

#### 装饰器模式

Decorator：装饰类或者方法，不会修改原有的功能，只是增加一些新功能（AOP 面向切面编程）。

## 面试题

### 手写 AST 的 demo

```js
function add(a, b) {
  return a + b;
}
// 转化为下面的AST代码

const ast = {
  type: "Program",
  body: [
    {
      type: "FunctionDeclaration",
      id: {
        type: "Identifier",
        name: "add",
      },
      params: [
        {
          type: "Identifier",
          name: "a",
        },
        {
          type: "Identifier",
          name: "b",
        },
      ],
      body: {
        type: "BlockStatement",
        body: [
          {
            type: "ReturnStatement",
            argument: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      },
    },
  ],
  sourceType: "script",
};
```

### 手写 VDOM 的 demo

```js
const vdom = {
  tag: "div",
  attrs: { id: "app" },
  children: [
    {
      tag: "h1",
      attrs: null,
      children: ["Hello, Virtual DOM!"],
    },
    {
      tag: "p",
      attrs: null,
      children: ["This is a simple implementation."],
    },
  ],
};
```

### 前端重新加载/刷新页面

1. `location.reload()`
2. `location.reload(true)`：强制从服务器重新加载页面而不是从缓存中加载
3. `location.href = location.href`
4. `history.go(0)`
5. `<meta http-equiv="refresh" content="30">`：用于特定的场景，如当页面需要在一定时间后自动更新

### 万向区块链

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

1. 原理实现上的区别
2. 使用上的区别
3. 性能上的区别
4. 周边生态的区别

#### Vue 和 React 的生命周期

1. Vue2 的生命周期：beforeCreate -> created -> beforeMount -> mounted -> beforeUpdate -> updated -> beforeDestroy -> destroyed，activated -> deactivated，errorCaptured。
2. Vue3 的生命周期：setup -> onBeforeMount -> onMounted -> onBeforeUpdate -> onUpdated -> onBeforeUnmount -> onUnmounted -> onActivated -> onDeactivated -> onErrorCaptured -> onRenderTracked(dev only) -> onRenderTriggered(dev only) -> onServerPrefetch(SSR only)。
3. React 的生命周期：constructor(props) -> static getDerivedStateFromProps(nextProps, prevState) -> ~~componentWillMount~~ -> render -> componentDidMount -> ~~componentWillReceiveProps~~ -> shouldComponentUpdate(nextProps, nextState) -> render -> ~~componentWillUpdate~~ -> getSnapshotBeforeUpdate(prevProps, prevState) -> componentDidUpdate(prevProps, prevState, snapshot) -> componentWillUnmount。

##### React

1. 挂载阶段：

> 当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

- `constructor()`
- `static getDerivedStateFromProps()`
- `render()`
- `componentDidMount()`

2. 更新阶段：

> 当组件中的 props 或者 state 发生变化时就会触发更新。组件更新的生命周期调用顺序如下：

- `static getDerivedStateFromProps()`
- `shouldComponentUpdate()`
- `render()`
- `getSnapshotBeforeUpdate()`
- `componentDidUpdate()`

3. 卸载:

- `componentWillUnmount()`

4. 废弃的钩子：

- `componentWillMount`
- `componentWillReceiveProps`
- `componentWillUpdate`

##### React 子组件引入方式

直接通过`<Children />`引入子组件和通过`{props.children}`引入子组件有何不同？这个过程中具体发生了什么？

1. 通过`<Children />`引入子组件：直接引用，适用于在父组件中明确知道并直接引用子组件的场景。父组件在渲染时会直接调用指定的子组件。父组件对其子组件的依赖性增强，不够灵活。

2. 通过`{props.children}`引入子组件：动态渲染，适用于在父组件中不确定子组件的情况，父组件在渲染时会根据子组件的动态变化来渲染。用于创建可重用的组件（如布局组件、容器组件等）。它允许父组件将任意子组件作为内容传递给父组件，从而提供更大的灵活性。

3. 通过`<Children />`引入子组件，React 会立即在渲染父组件时创建该子组件的实例。

   - 组件直接渲染：当您使用 `<Children />` 引用子组件时，React 会立即在渲染父组件时创建该子组件的实例。
   - 父组件受限：父组件需要显式地知道并编写要渲染哪些子组件。这样会导致父组件对其子组件的依赖性增强，不够灵活。

4. 通过`{props.children}`引入子组件：

   - 内容占位：在使用 {props.children} 时，父组件定义了一个位置，任何在父组件标签内放置的内容将被渲染到这个位置。
   - 灵活性：传递给父组件的内容可以是任何合法的 React 元素或组件（包括文本、组件、甚至其他 JSX）。这使得父组件能够在不修改其自身代码的情况下接收和渲染不同的子组件。
   - 支持多样性：父组件可以接收多个子元素，甚至可以是条件渲染的元素，提供了极大的灵活性和可重用性。

5. 总结：`<Children />`：用于直接引用已知的子组件，适用于固定组合。`{props.children}`：用于动态渲染传递给父组件的内容，适用于高度可重用的组件结构。

#### Vue 和 React 渲染组件的方式有何区别

> React 渲染机制

- 虚拟 DOM：React 使用虚拟 DOM 来提高性能。组件的状态或属性改变时，React 会先在虚拟 DOM 中计算出差异（diffing），然后再将变化应用于实际的 DOM。
- 组件生命周期：React 通过生命周期方法（如 `componentDidMount`、`shouldComponentUpdate` 等）来控制组件的渲染和更新。
- 单向数据流：React 的数据流是单向的，组件通过 props 接收数据，状态变化会触发重新渲染。
- 组件通常使用 JavaScript 函数或类来定义，采用 JSX 语法书写 UI。
- 组件的渲染依赖于 `render()` 方法或函数返回 JSX。
- 使用 `shouldComponentUpdate()` 方法或 `React.memo()` 进行组件更新优化。
- 在大型应用中，通过 `React.lazy` 和 `React.Suspense` 实现代码分割和懒加载。

> Vue 渲染机制

- 响应式系统：Vue 使用响应式数据绑定，数据变化时，视图会自动更新，而不需要手动处理 DOM 更新。Vue 内部使用了 `Object.defineProperty`/`Proxy` 拦截 属性/对象 的 getter/setter 来实现数据的观察。
- 虚拟 DOM：Vue 也使用虚拟 DOM，但它的实现方式相对 React 更加简洁。Vue 在渲染过程中会生成一个虚拟 DOM 树并进行 diffing，最终将最小的差异应用于实际的 DOM。
- 双向数据绑定：Vue 支持双向数据绑定，通过 v-model 等指令，可以在视图和数据之间建立直接的双向绑定。
- 组件定义通常使用 .vue 文件，包含 `<template>`、`<script>` 和 `<style>` 三个部分。
- 组件的渲染通过模板语言定义，使用 Vue 的指令（如 `v-if`、`v-for`）来实现。
- 通过 `v-once`、`v-memo` 等指令进行性能优化，避免不必要的重新渲染。
- 使用计算属性（computed properties）和侦听器（watchers）来优化数据更新和视图渲染。

#### React.lazy 和 React.Suspense

1. React.lazy 是一个函数，用于定义动态导入的组件。它允许你按需加载组件，而不是在应用启动时一次性加载所有组件，从而减少初始加载时间。React.lazy 只能用于组件，不能用于普通的 JavaScript 函数。

   - 代码分割：React.lazy 使用 Webpack 的动态导入功能，将组件分割成独立的代码块。当组件被需要时，才会加载这个代码块。
   - 懒加载：它返回一个可以在渲染时使用的 React 组件。这种组件在第一次渲染时不会立即加载，而是等到真正需要显示该组件时才加载。

```js
const MyComponent = React.lazy(() => import("./MyComponent"));
```

2. React.Suspense 是一个组件，用于处理懒加载组件时的加载状态。它允许你指定一个 fallback 属性，即在组件加载过程中显示的内容（通常是加载指示器或占位符）。在使用 Suspense 时，建议结合错误边界（Error Boundaries）来处理加载过程中的错误。这样可以保证如果组件加载失败，可以优雅地处理错误情况。在 React 18 中，Suspense 还可以配合新的数据获取 API 使用，更加增强了异步和并发渲染的能力。

   - 加载状态管理：当使用 React.lazy 加载组件时，React 会在组件加载的过程中触发 Suspense 的加载状态。React.Suspense 会捕获这个加载状态，并在组件加载完成之前显示 fallback 内容。
   - Promise 处理：当 React.lazy 返回的 Promise 被解析时，Suspense 会重新渲染其子组件，以显示加载完成后的内容。
   - 并发特性：在 React 18 及以后的版本中，Suspense 还与并发特性结合，使得在数据获取和渲染过程中，React 可以更智能地处理 UI 更新。

```js
<React.Suspense fallback={<div>Loading...</div>}>
  <MyComponent />
</React.Suspense>
```

#### 哪个 React 生命周期可以跳过子组件渲染

1. React 类组件中：`shouldComponentUpdate(nextProps, nextState) {return nextProps.value !== this.props.value;}`，只在特定条件下更新。
2. 函数组件中：使用 `React.memo()` 来包裹组件，通过传入一个比较函数来决定是否更新。
   1. `React.memo` 是一个高阶组件（HOC），用于优化函数组件的渲染性能。它通过**浅比较**（Shallow Compare） 组件的 props，避免不必要的重新渲染。类似于类组件中的 **PureComponent**，但专门为函数组件设计。
   2. 直接包裹函数组件时，自动浅比较 props。即第二个参数为空的时候会自动浅比较 props。
   3. 自定义比较函数：通过第二个参数指定 props 比较逻辑。如果返回 true，则不更新组件；如果返回 false，则更新组件。
   4. 示例 1：props 是由`{a:1,b:[1,2,3]}`变为`{a:1,b:[1,2,3,4,5]}`这样时，浅比较，b 是数组，引用地址变化，子组件会重新渲染。
   5. 示例 2：props 是由`{a:1,b:{a:1,b:2}}`变为`{a:1,b:{a:1,c:3}}`这样时，浅比较，b 是对象，引用地址变化，子组件会重新渲染。

```js
const MyComponent = React.memo(
  ({ value }) => {
    return <div>{value}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.value === nextProps.value; // 如果值相等，不更新
  }
);
```

3. 缓存回调函数：useCallback：防止回调函数因父组件渲染而重建，导致子组件 props 引用变化。
4. 缓存复杂计算：useMemo：避免每次渲染重复执行高开销计算。
5. 拆分组件与状态隔离：将高频变动的状态封装到独立组件中，避免扩散渲染影响。
6. 避免传递内联对象/函数：

   ```js
   // 这样是错误的，因为每次渲染会生成新的对象触发子组件重新渲染，可以使用 useMemo 或常量的形式传递。
   <Child config={{ id: 1, type: "A" }} />
   ```

7. 优化 context 消费，任何 Context 变化都会触发所有消费者渲染：`const { value } = useContext(MyContext);`，拆分 Context 或使用选择器：`const value = useContextSelector(MyContext, ctx => ctx.value);`。PS：`useContextSelector`是这个库提供的[use-context-selector](https://github.com/dai-shi/use-context-selector?tab=readme-ov-file)。
8. 列表渲染使用稳定的唯一 key：不要使用索引、随机数或者时间戳等做 key。

#### React 类组件中的 setState 和函数组件中 setState 的区别

#### React 的 Reconciliation 过程是如何工作的

#### forEach 和 map 的区别

#### Proxy 概念

#### Reflect 概念

#### Symbol 概念

#### VueRouter

1. 路由模式：Hash 模式: createWebHashHistory，History HTML5 模式: createWebHistory，Memory 内存模式: createMemoryHistory -- 适合 Node 环境和 SSR。
2. 路由守卫：
   - beforeEach：全局前置守卫，当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。
   - beforeResolve：全局解析守卫，和 router.beforeEach 类似，在每次导航时都会触发，不同的是，解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。是获取数据或执行任何其他操作的理想位置。
   - afterEach：全局后置钩子，和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身。它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。
   - beforeEnter：路由独享的守卫，直接在路由配置上定义。只在进入路由时触发，不会在 params、query 或 hash 改变时触发。可以将一个函数数组传递给 beforeEnter，这在为不同的路由重用守卫时很有用。当配合嵌套路由使用时，父路由和子路由都可以使用 beforeEnter。如果放在父级路由上，路由在具有相同父级的子路由之间移动时，它不会被触发。
   - 从 Vue 3.3 开始，可以在导航守卫内使用 inject() 方法。在 app.provide() 中提供的所有内容都可以在 `router.beforeEach()、router.beforeResolve()、router.afterEach()` 内获取到
   - beforeRouteEnter：组件内的守卫，不能 访问 this，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。可以通过传一个回调给 next 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数
   - beforeRouteUpdate：组件内的守卫，在当前路由改变，但是该组件被复用时调用。
   - beforeRouteLeave：组件内的守卫，离开守卫，通常用来预防用户在还未保存修改前突然离开。该导航可以通过返回 false 来取消。
3. 完整的导航解析流程：
   1. 导航被触发。
   2. 在失活的组件里调用 beforeRouteLeave 守卫。
   3. 调用全局的 beforeEach 守卫。
   4. 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
   5. 在路由配置里调用 beforeEnter。
   6. 解析异步路由组件。
   7. 在被激活的组件里调用 beforeRouteEnter。
   8. 调用全局的 beforeResolve 守卫(2.5+)。
   9. 导航被确认。
   10. 调用全局的 afterEach 钩子。
   11. 触发 DOM 更新。
   12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
4. 传参：params、query、hash

```js
// router.js
import { createRouter, createWebHashHistory, createWebHistory, createMemoryHistory } from "vue-router";
import { h } from "vue";

function removeQueryParams(to) {
  if (Object.keys(to.query).length) return { path: to.path, query: {}, hash: to.hash };
}

function removeHash(to, from) {
  if (to.hash) return { path: to.path, query: to.query, hash: "" };
}

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory, createMemoryHistory
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("./views/Home.vue"),
      beforeEnter: [removeQueryParams, removeHash],
      // children:[]
    },
    {
      path: "/users/:id",
      component: () => import("./views/UserDetails.vue"),
      beforeEnter: [removeQueryParams, removeHash],
    },
    {
      name: "about",
      path: "/about",
      // component: () => import('./views/About.vue'),
      component: () => import("./views/About.vue"),
      beforeEnter: [removeQueryParams],
    },
  ],
});
// 路由守卫：全局前置守卫
router.beforeEach(async (to, from) => {
  if (
    // 检查用户是否已登录
    !isAuthenticated &&
    // ❗️ 避免无限重定向
    to.name !== "Login"
  ) {
    // 将用户重定向到登录页面
    return { name: "Login" };
  }
  // ...
  // 返回 false 以取消导航
  return false;
  // 或者返回一个path字符串
  // return '/login';
});

// 或者
// GOOD：确保 next 在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。
router.beforeEach((to, from, next) => {
  const global = inject("global"); // 'hello injections'
  if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
  else next();
});

export default router;

// app.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.provide("global", "hello injections");
app.use(router);
app.mount("#app");
```

5. history.pushState()、history.replaceState()、history.back()、history.forward()、history.go()、监听 changestate 事件。使用 history 路由需要在 nginx 配置静态资源，否则会 404。如下：

```bash
# ...
location / {
  try_files $uri $uri/ /index.html;
}
# ...
```

#### pinia

1. 可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。应该在不同的文件中去定义 store。
2. 第一个参数是你的应用中 Store 的唯一 ID。defineStore() 的第二个参数可接受两类值：Setup 函数或 Option 对象。
3. Option API 中：可以认为 state 是 store 的数据 (data)，getters 是 store 的计算属性 (computed)，而 actions 则是方法 (methods)。
4. 在 Setup Store 中：ref() 就是 state 属性，computed() 就是 getters，function() 就是 actions。
5. 使用 Store：在`<script setup>` 调用 useXXXStore()，store 是一个用 reactive 包装的对象，这意味着不需要在 getters 后面写 .value。就像 setup 中的 props 一样，我们不能对 getters 和 state 进行解构，否则会破坏响应性。可以对 actions 进行解构。
6. 为了从 store 中提取属性时保持其响应性，你需要使用 storeToRefs()。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。

```js
import { defineStore } from "pinia";
// Option API
export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    doubleCountPlusOne: (state) => state.doubleCount + 1,
  },
  actions: {
    plusOne: () => {
      this.count++;
    },
    increment: (num) => {
      this.count += num;
    },
  },
});

// setup API
import { ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const route = useRoute();
  // 这里假定 `app.provide('appProvided', 'value')` 已经调用过
  const appProvided = inject("appProvided");

  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

// 使用时
import { storeToRefs } from "pinia";
import { useCounterStore } from "./store/counter";

const counterStore = useCounterStore();
const { count, doubleCount } = storeToRefs(counterStore);
const { increment } = counterStore;
```

7. 访问 state：`const store = useCounterStore(); store.count++;`
8. 重置 state：`counterStore.$reset();`这个方法会重置所有状态，将所有属性重置为初始值。使用 setup 时可以自定义。
9. 使用 `mapState()` 辅助函数将 state 属性映射为`只读`的计算属性：`computed: {...mapState(useCounterStore, ['count']), ...mapState(useCounterStore, { myCount: 'count' })}`，可以取个别名。
10. 可修改的 state：使用 `mapWritableState()` 作为代替。但注意你不能像 mapState() 那样传递一个函数。
11. 变更 state：`counterStore.$patch({ count: 1 });`，可以一次修改多个属性。$patch 方法也接受一个函数来组合这种难以用补丁对象实现的变更。
12. 替换 state：不能完全替换掉 store 的 state，因为那样会破坏其响应性。但是，你可以 patch 它。
13. 订阅 state：类似于 Vuex 的 subscribe 方法，你可以通过 store 的 `$subscribe()` 方法侦听 state 及其变化。比起普通的 watch()，使用 `$subscribe()` 的好处是 subscriptions 在 patch 后只触发一次事件。
14. `counterStore.$subscribe((mutation, state) => {...});`
15. Getter 完全等同于 store 的 state 的计算值。大多数时候，getter 仅依赖 state。不过，有时它们也可能会使用其他 getter。可以通过 this 访问到整个 store 实例。在 ts 中如果在 getter 中用到了 this，需要显式声明返回值类型。
16. Getter 只是幕后的计算属性，所以不可以向它们传递任何参数。不过，你可以从 getter 返回一个函数，该函数可以接受任意参数。
17. 想要使用另一个 store 的 getter 的话，直接在 getter 内使用就好。
18. action 可以是异步的，你可以在它们里面 await 调用任何 API，以及其他 action。
19. 想要使用另一个 store 的话，直接在 action 中调用就好。
20. 可以使用 `mapActions()` 辅助函数将 action 属性映射为组件中的方法。
21. `methods: {...mapActions(useCounterStore, ['increment']), ...mapActions(useCounterStore, { myOwnName: 'increment' }),}`，可以设置别名。
22. 订阅 action：可以通过 `store.$onAction()` 来监听 action 和它们的结果。传递给它的回调函数会在 action 本身之前执行。after 表示在 promise 解决之后，允许你在 action 解决后执行一个回调函数。同样地，onError 允许你在 action 抛出错误或 reject 时执行一个回调函数。

#### 防抖、节流

#### 重绘与重排

回流是指浏览器需要重新计算样式、布局定位、分层和绘制，回流又被叫重排；触发回流的操作：

- 添加或删除可见的 DOM 元素
- 元素的位置发生变化
- 元素的尺寸发生变化
- 浏览器的窗口尺寸变化
- 修改字体会引起重排

重绘是只重新像素绘制，当元素样式的改变不影响布局时触发。

回流=计算样式+布局+分层+绘制；重绘=绘制。故回流对性能的影响更大。

#### JS 中 new 一个对象的过程

- 使用 Object.create

1. 以构造函数 Parent 的 prototype 属性为原型，创建一个新的空对象 obj：`const obj = Object.create(Parent.prototype);`
2. 将 obj 作为 this，并传入参数，执行构造函数：`Parent.apply(obj, args);`
3. 返回 obj(如果构造器没有手动返回对象，则返回第一步的对象)：`return obj;`

```js
function MockNew(Parent, ...args) {
  const obj = Object.create(Parent.prototype);
  const result = Parent.apply(obj, args);
  return typeof result === "object" ? result : obj;
}
```

- 不使用 Object.create

1. 创建一个空对象 obj：`const obj = {};`
2. 让 obj 继承构造函数的的原型 prototype，即将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）：`obj.proto = Parent.prototype;`
3. 将 obj 作为 this，并传入参数，执行构造函数：`Parent.apply(obj, args);`
4. 返回 obj(如果构造器没有手动返回对象，则返回第一步的对象)：`return obj;`

```js
function MockNew(Parent, ...args) {
  const obj = {};
  obj.proto = Parent.prototype;
  const result = Parent.apply(obj, args);
  return typeof result === "object" ? result : obj;
}
```

- `{}`创建空对象，原型`__proto__`指向 Object.prototype
- `Object.create`创建空对象，原型`__proto__`指向传入的参数（构造函数或者 null）

#### 宏任务与微任务

JS 引擎是单线程的，一个时间点下 JS 引擎只能做一件事。而事件循环 Event Loop 是 JS 的执行机制。

JS 做的任务分为同步和异步两种，所谓 "异步"，简单说就是一个任务不是连续完成的，先执行第一段，等做好了准备，再回过头执行第二段，第二段也被叫做回调；同步则是连贯完成的。

在等待异步任务准备的同时，JS 引擎去执行其他同步任务，等到异步任务准备好了，再去执行回调。这种模式的优势显而易见，完成相同的任务，花费的时间大大减少，这种方式也被叫做非阻塞式。

而实现这个“通知”的，正是事件循环，把异步任务的回调部分交给事件循环，等时机合适交还给 JS 线程执行。事件循环并不是 JavaScript 首创的，它是计算机的一种运行机制。

事件循环是由一个队列组成的，异步任务的回调遵循先进先出，在 JS 引擎空闲时会一轮一轮地被取出，所以被叫做循环。

微任务和宏任务皆为异步任务，它们都属于一个队列，主要区别在于他们的执行顺序，Event Loop 的走向和取值。

事件循环由宏任务和在执行宏任务期间产生的所有微任务组成。完成当下的宏任务后，会立刻执行所有在此期间入队的微任务。

这种设计是为了给紧急任务一个插队的机会，否则新入队的任务永远被放在队尾。区分了微任务和宏任务后，本轮循环中的微任务实际上就是在插队，这样微任务中所做的状态修改，在下一轮事件循环中也能得到同步。

async 函数在 await 之前的代码都是同步执行的，可以理解为 await 之前的代码属于 new Promise 时传入的代码，await 之后的所有代码都是在 Promise.then 中的回调。

#### setState 是宏任务还是微任务

1. setState 本质是同步执行，state 都是同步更新，只不过让 React 做成了异步的样子--为了性能优化，会批量处理多次状态更新，合并状态变化，在批量更新结束后，React 会根据最终的状态触发一次重新渲染，React 根据更新后的状态和虚拟 DOM 计算出需要更新的部分，并重新渲染组件。
2. 比如在 setTimeout 中时，就是同步，比如在 Promise.then 开始之前，state 已经计算完了。
3. 因为要考虑性能优化，多次修改 state，只进行一次 DOM 渲染。
4. 日常说的异步是不严谨的，但沟通成本低。
5. 所以，既不是宏任务也不是微任务，因为它是同步的。
6. PS: react18 中已经把它做成统一的异步形式了，包括在原生事件中的表现。

React 的 合成事件 和 生命周期 默认启用了批处理机制。
在这种情况下，setState 不会立即更新，而是将更新加入到一个队列中，待所有事件回调或生命周期方法执行完后才开始处理。
这种延迟更新可以理解为 任务被加入到下一轮的任务队列中，但它既不是纯粹的宏任务，也不是纯粹的微任务，而是由 React 内部调度机制控制的。

因此：在 React 内部合成事件和生命周期方法中，setState 的更新并不会立即生效，而是会被批量处理。它的行为更类似于 宏任务，因为它通常会在事件循环的下一阶段触发更新，但由 React 内部控制。

在原生事件或异步回调中，如果在 原生事件 或 Promise.then 中调用 setState，React 的批处理机制不会生效，状态更新可能会立即触发，视具体场景而定。在这种情况下，setState 的行为更接近微任务。

不要依赖 setState 后立即获取更新后的状态值，使用 useEffect 或回调函数（如 setState((prevState) => newState)）。理解 React 的批量更新机制，避免不必要的状态更新。

```js
// 原生事件中
document.getElementById("btn").addEventListener("click", () => {
  setState({ count: count + 1 });
  console.log(state.count); // 可能会立即更新
});

// Promise.then 中
Promise.resolve().then(() => {
  setState({ count: count + 1 });
  console.log(state.count); // 可能会更新
});
```

#### 闭包的优缺点

1. 闭包是指有权访问另一个函数作用域中变量的函数。创建闭包最常见的方式就是，在一个函数内部创建并返回另一个函数。当函数能够记住并访问所在的词法作用域时，就产生了闭包。
2. 闭包通常用来创建内部/私有变量，使得 这些变量不能被外部随意修改，同时又可以通过指定的接口来操作。
3. 闭包也会用来延长变量的生命周期。
4. 闭包其实是一种特殊的函数，它可以访问函数内部的变量，还可以让这些变量的值始终保持在内存中，不会在函数调用后被垃圾回收机制清除。
5. 优点：
   1. 包含函数内变量的安全，实现封装，防止变量流入其他环境发生命名冲突，造成环境污染。
   2. 在适当的时候，可以在内存中维护变量并缓存，提高执行效率。
   3. 即可以用来传递、缓存变量，使用合理，一定程度上能提高代码执行效率。
6. 缺点：
   1. 函数拥有的外部变量的引用，在函数返回时，该变量仍处于活跃状态。
   2. 闭包作为一个函数返回时，其执行上下文不会被销毁，仍处于执行上下文中。
   3. 即消耗内存，使用不当容易造成内存泄漏，性能下降。
7. 常见使用：节流防抖、IIFE（自执行函数）、柯里化实现

#### commonJs 中的 require 与 ES6 中的 import 的区别

#### export 与 import 的区别

#### CSS 加载是否阻塞 DOM 渲染

### 别人面试

昨天晚上面试题：

1. webpack 编译过程
2. webpack 热更新
3. 从浏览器地址栏输入 url 到用户看到界面发生了什么
4. http 的请求报文跟响应报文都有什么
5. 说下 http 的缓存（强缓存，协商缓存）
6. http 的短连接和长连接
7. websocket 和长连接的区别
8. 同域名下两个浏览器窗口的 数据共享
9. 不同域名下两个浏览器窗口的 数据共享（主要是跟 iframe 的数据共享 ）
10. css 动画. 栅格布局，自适应布局
11. call,apply,bind 的区别
12. 闭包
13. 柯里化函数
14. 防抖，节流
15. vue 父子通信的方式
16. diff 原理
17. vue 路由的实现，从地址改变到渲染组件发生了什么
18. vue 的响应式原理
19. vue 的生命周期，父子生命周期的顺序
20. nextTick 的实现原理
21. React.PureComponent 与 Component 的区别
    1. `PureComponent` 会默认实现在 `shouldComponentUpdate` 中对 props 的第一层属性做浅比较，然后决定是否更新，相当于做了个性能小优化。不能在 `PureComponent` 中使用 `shouldComponentUpdate`。类似 `React.memo()`。
22. 如何统一监听 Vue 组件报错
    1. `window.onerror`：全局监听所有 js 错误，可以捕捉 Vue 监听不到的错误；但它是 js 级别的，识别不了 Vue 组件信息；监听不到 try/catch，可以监听异步报错；
    2. `window.addEventListener('error', function(){})`：同上。参数略有不同。捕获的异常如何上报？常用的发送形式主要有两种: 通过 ajax 发送数据`(xhr、jquery...)` 或动态创建 img 标签的形式；
    3. `errorCaptured:(errmsg,vm,info)={}`：在组件中配置（使用类似钩子函数）；监听所有下级组件的错误；返回 false 会阻止向上传播；无法监听异步报错；
    4. `errorHandler:(errmsg,vm,info)={}`：在 main.js 中配置（使用类似钩子函数）`app.config.errorHandler=()=>{}`；Vue 全局错误监听，所有错误都会汇总到这里；但 `errorCaptured` 返回 false，不会传播到这里；会干掉 `window.onerror`；无法监听异步报错；
23. 如何统一监听 React 组件报错
    1. 编写 `ErrorBoundary` 组件：利用`static getDerivedStateFromError`钩子监听所有下级组件的错误，可降级展示 UI；只监听组件渲染时报错，不监听 DOM 事件、异步错误；降级展示只在 production 环境生效，dev 会直接抛出错误。
    2. 从上可知 `ErrorBoundary` 不会监听 DOM 事件报错和异步错误，所以可以用 `try-catch`，也可用 `window.onerror`;
    3. Promise 未处理的 catch 需要监听 `onunhandledrejection`：onerror 事件无法捕获到网络异常的错误(资源加载失败、图片显示异常等)，例如 img 标签下图片 url 404 网络请求异常的时候，onerror 无法捕获到异常，此时需要监听`unhandledrejection`。
    4. JS 报错统计（埋点、上报、统计）用 sentry；sentry 是一个基于 Django 构建的现代化的实时事件日志监控、记录和聚合平台，主要用于快速的发现故障。sentry 支持自动收集和手动收集两种错误收集方法。我们能成功监控到 vue 中的错误、异常，但是还不能捕捉到异步操作、接口请求中的错误，比如接口返回 404、500 等信息，此时我们可以通过`Sentry.caputureException()`进行主动上报。
24. 鉴权
25. hmr 热更新原理
26. mixin，vue router 的原理
27. vue 双向绑定原理
28. es6 的新特性
29. 如何在 vite 工程的 ts 项目中配置路径别名？

```js
// 1. 打开 vite.config.ts 文件，并导入 resolve 方法和 defineConfig 函数。
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 配置路径别名
    },
  },
});

// 2. 在 tsconfig.json 文件中添加如下配置：
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"] // 添加路径别名
    }
  },
  "include": ["src/**/*"]
}
```

#### 一个页面打开比较慢，怎么处理？

1.  通过 Chrome 的 performance 面板或者 Lighthouse 等工具分析页面性能，通过查看 FP（首次渲染）、FCP（首次内容渲染）、DOMContentLoaded（DCL）、Largest Contentfull Paint 最大内容渲染（LCP）、Load（L）等性能指标，结合资源的加载情况，来判断是哪个过程有问题：加载过程慢还是渲染过程慢？
2.  对于加载过程慢：说明是网络问题比较严重。
    1.  优化服务端硬件配置，静态资源上 cdn 或者是压缩图片、使用 base64 等减少请求数，服务端开启 gzip 等；
    2.  路由懒加载，大组件异步加载，减少主包的体积；
    3.  优化 http 缓存策略，强缓存、协商缓存，对于静态资源可以开启强缓存。
3.  对于渲染过程慢：可能是接口数据返回的慢，也可能是代码写的有问题。
    1.  优化服务端接口，提高响应速度；
    2.  分析前端代码逻辑，优化 Vue/React 组件代码，比如减少重排重绘；
    3.  服务端渲染 SSR；
4.  优化体验：骨架屏，加载动画、进度条。
5.  持续跟进：
    1. 性能优化是一个循序渐进的过程，不像 bug 一次性解决；
    2. 持续跟进统计结果，再逐步分析性能瓶颈，持续优化；
    3. 可以使用第三方统计服务，如阿里云 ARMS，百度统计等；

#### 大文件上传

![前置知识](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/202501171257810.png)

![slice方法](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/202501171301880.png)

1. 采用分片上传，将大文件分割成多个小文件，并发上传。
2. 采用断点续传，记录已上传的分片，下次上传时跳过已上传的分片。
3. 采用多线程上传，充分利用多核 CPU 资源。
4. 采用队列管理，控制并发上传数量，避免占用过多带宽。
5. 采用服务端合并，将分片上传的结果进行合并，实现完整的文件上传。

![示例代码](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images/imgs/202501171301005.png)

#### 如何实现一个 Promise

```js
class MyPromise {
  constructor(executor) {
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === "pending") {
        this.status = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb(value));
      }
    };

    const reject = (reason) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === "fulfilled") {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === "rejected") {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === "pending") {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("Chaining cycle detected"));
  } else if (x instanceof MyPromise) {
    if (x.status === "pending") {
      x.then(
        (value) => resolvePromise(promise2, value, resolve, reject),
        (reason) => reject(reason)
      );
    } else {
      x.then(resolve, reject);
    }
  } else {
    resolve(x);
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});

p.then((value) => {
  console.log(value);
}).catch((reason) => {
  console.log(reason);
});
```

#### 中断 for 循环

1. break 是最直接、常规的中断循环的方式。
2. 在函数中：可以使用 return。注意：return 只能在函数内部使用。直接在浏览器里跑 for 循环会报错。
3. 嵌套循环：可以使用 label 和 break。
4. 替代方式：修改循环条件。比如把 i 加到最大。
5. 不推荐：抛出异常。

拓展：js 中常见循环的中断方式：

1. forEach：是数组方法，用于遍历数组的每一项，无法通过 break 或 continue 中断。中断方式：抛出异常；return 不会中断整个循环，只是跳过当前回调函数的执行。
2. map：是数组方法，适用于对数组的每一项进行转换并生成新的数组。无法中断循环，但可以通过 return 提前返回当前项的处理结果或者抛出异常。
3. reduce：用于将数组的每一项折叠为单一值，无法中断，但可以通过逻辑控制提前退出计算 - 提前 return。
4. filter：用于筛选数组项，无法中断循环，但可以通过条件控制跳过某些项的逻辑处理。
5. for...of：遍历可迭代对象（如数组、Set、Map 等）。可以使用 break、continue 和 return 来中断循环。break：终止整个循环；continue：跳过当前循环，继续下一次迭代；return：如果在函数体内，终止整个函数。
6. for...in：用于遍历对象的可枚举属性（常用于对象，而非数组）。可以使用 break 和 continue 来控制循环。
7. while：是标准的循环结构，可以使用 break、continue 和修改循环条件、抛出异常 来中断。
8. do...while： 类似于 while，但会确保代码至少执行一次。可以使用 break 和 continue、抛出异常 来中断。break：终止整个循环；continue：跳过当前循环并检查条件；注意：在 do...while 中，continue 可能会导致死循环，建议谨慎使用。
9. for：break、return、label、修改循环条件、抛出异常。

```js
// 执行如下代码，输出：0 1 2 之后卡死。
let i = 0;
do {
  if (i === 3) continue; // 跳过当前循环
  console.log(i); // 输出会有问题，注意陷阱
  i++;
} while (i < 5);
```

#### 前端实现截图

两种情况：

- 对浏览器网页页面的截图。
- 仅对 canvas 画布的截图，比如可视化图表、webGL 等。

实现方式：

1. 第三方库：html2canvas(Canvas)、dom-to-image(SVG) - 两种方案目标相同，即把 DOM 转为图片
2. 对 canvas 画布截图，因为 canvas 它本身就有保存为图片的功能，它有两个 API 可以用来导出图片，分别是 toDataURL 和 toBlob。toDataURL 方法是将整个画布转换成 base64 格式的 url 地址，toBlob 方法是创造 Blob 对象，默认图片类型是 image/png。
3. 浏览器原生截图 API：`navigator.mediaDevices.getUserMedia/getDisplayMedia`，可以获取到屏幕的视频流，然后通过视频流生成截图。需要权限。

```js
const a = async () => {
  try {
    // 调用屏幕捕获 API
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" },
    });

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    // 捕获屏幕截图
    const bitmap = await imageCapture.grabFrame();

    // 绘制到 Canvas
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

    // 导出为图片
    const imgData = canvas.toDataURL("image/png");
    console.log(imgData);

    // 停止捕获屏幕
    track.stop();

    // 如果需要下载图片
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "screenshot.png";
    link.click();
  } catch (err) {
    console.error("屏幕捕获失败：", err);
  }
};

a();
```

## 数组和链表

### 区别

| 比较项   | 数组                                                                                                                                                                                             | 链表                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 逻辑结构 | （1）数组在内存中连续； (2)使用数组之前，必须事先固定数组长度，不支持动态改变数组大小；(3) 数组元素增加时，有可能会数组越界；(4) 数组元素减少时，会造成内存浪费；（5）数组增删时需要移动其它元素 | （1）链表采用动态内存分配的方式，在内存中不连续 (2)支持动态增加或者删除元素 (3)需要时可以使用 malloc 或者 new 来申请内存，不用时使用 free 或者 delete 来释放内存 |
| 内存结构 | 数组从栈上分配内存，使用方便，但是自由度小                                                                                                                                                       | 链表从堆上分配内存，自由度大，但是要注意内存泄漏                                                                                                                 |
| 访问效率 | 数组在内存中顺序存储，可通过下标访问，访问效率高                                                                                                                                                 | 链表访问效率低，如果想要访问某个元素，需要从头遍历                                                                                                               |
| 越界问题 | 数组的大小是固定的，所以存在访问越界的风险                                                                                                                                                       | 只要可以申请得到链表空间，链表就无越界风险                                                                                                                       |

### 使用场景

| 比较项 | 数组                                                                                                       | 链表                                                                                               |
| ------ | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 空间   | 数组的存储空间是栈上分配的，存储密度大，当要求存储的大小变化不大时，且可以事先确定大小，宜采用数组存储数据 | 链表的存储空间是堆上动态申请的，当要求存储的长度变化较大时，且事先无法估量数据规模，宜采用链表存储 |
| 时间   | 数组访问效率高。当线性表的操作主要是进行查找，很少插入和删除时，宜采用数组结构                             | 链表插入、删除效率高，当线性表要求频繁插入和删除时，宜采用链表结构                                 |

### 操作系统中进程间通信 IPC

进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。第一，进程是一个实体。每一个进程都有它自己的地址空间；第二，进程是一个“执行中的程序”。

1. 无名管道(pipe)

- 无名管道是一种半双工的通信方式，数据只能单向流动，而且只能在具有亲缘关系的进程间使用。进程的亲缘关系通常是指父子进程关系。
  - 速度慢，容量有限，只有父子进程能通讯

2. 有名管道 (namedpipe)

- 有名管道也是半双工的通信方式，但是它允许无亲缘关系进程间的通信。

3. 信号量(semaphore)

- 信号量是一个计数器，可以用来控制多个进程对共享资源的访问。它常作为一种锁机制，防止某进程正在访问共享资源时，其他进程也访问该资源。因此，主要作为进程间以及同一进程内不同线程之间的同步手段。
  - 不能传递复杂消息，只能用来同步

4. 消息队列(messagequeue)

- 消息队列是由消息的链表，存放在内核中并由消息队列标识符标识。消息队列克服了信号传递信息少、管道只能承载无格式字节流以及缓冲区大小受限等缺点。
  - 容量受到系统限制，且要注意第一次读的时候，要考虑上一次没有读完数据的问题 ；信号传递信息较管道多。

5. 信号 (signal)

- 信号是一种比较复杂的通信方式，用于通知接收进程某个事件已经发生。

6. 共享内存(shared memory)

- 共享内存就是映射一段能被其他进程所访问的内存，这段共享内存由一个进程创建，但多个进程都可以访问。共享内存是最快的 IPC 方式，它是针对其他进程间通信方式运行效率低而专门设计的。它往往与其他通信机制，如信号量，配合使用，来实现进程间的同步和通信。
  - 能够很容易控制容量，速度快，但要保持同步，比如一个进程在写的时候，另一个进程要注意读写的问题，相当于线程中的线程安全，当然，共享内存区同样可以用作线程间通讯，不过没这个必要，线程间本来就已经共享了同一进程内的一块内存。

7. 套接字(socket)

- 套接口也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同设备及其间的进程通信。

### 线程间的通信方式

线程是进程的一个实体，是 CPU 调度和分派的基本单位,它是比进程更小的能独立运行的基本单位。线程自己基本上不拥有系统资源,只拥有一点在运行中必不可少的资源(如程序计数器，一组寄存器和栈)，但是它可与同属一个进程的其他的线程共享进程所拥有的全部资源。线程间通信主要通过共享内存，上下文切换很快，资源开销较少，但相比进程不够稳定容易丢失数据。

1. 锁机制：包括互斥锁、条件变量、读写锁

- 互斥锁提供了以排他方式防止数据结构被并发修改的方法。
- 读写锁允许多个线程同时读共享数据，而对写操作是互斥的。
- 条件变量可以以原子的方式阻塞进程，直到某个特定条件为真为止。对条件的测试是在互斥锁的保护下进行的。条件变量始终与互斥锁一起使用。

2. 信号量机制(Semaphore)

- 包括无名线程信号量和命名线程信号量。

3. 信号机制(Signal)

- 类似进程间的信号处理。线程间的通信目的主要是用于线程同步，所以线程没有像进程通信中的用于数据交换的通信机制。

### input 如何处理中文输入防抖

使用文本合成系统，当用户使用拼音输入法开始输入汉字时，这个事件 compositionstart 就会被触发，输入结束后触发 compositionend 事件。

```js
input_dom.addEventListener("compositionstart", onCompositionStart);
input_dom.addEventListener("compositionend", onCompositionEnd);
```

### 前端性能优化

前端网站性能优化

- 减少 http 请求数量，浏览器一个域名单次同时发出的请求数量是有限的，每个 http 请求都会经历 tcp 三次握手四次挥手等阶段；css sprites 雪碧图，多张图片合成一张图片，减少 http 请求数，也减少总体积；合并 css、js 文件；路由懒加载 lazyload；
- 控制资源文件加载优先级，css 放在 html 头部，js 放在底部或 body 后面；设置 importance 属性；async、defer 关键字异步加载；
- 静态资源上 cdn，尽量外链 css 和 js，保持代码整洁，利于维护；
- 利用缓存，浏览器缓存；移动端 app 上的 http 缓存只在当前这次 app 存活期间遵循 http 缓存策略，当你的 app 杀死退出后，缓存就会失效。
- 减少重排重绘：基本原理：重排是 DOM 的变化影响到了元素的几何属性（宽和高或位置），浏览器会重新计算元素的几何属性，会使渲染树中受到影响的部分失效，浏览器会验证 DOM 树上的所有其它结点的 visibility 属性，这也是 Reflow 低效的原因。如果 Reflow 的过于频繁，CPU 使用率就会急剧上升。减少 Reflow，如果需要在 DOM 操作时添加样式，尽量使用 增加 class 属性，而不是通过 style 操作样式。
- 减少 dom 操作
- 图标使用 iconfont 替换
- 不使用 css 表达式，会影响效率
- 使用 cdn 网络缓存，加快用户访问速度，减轻源服务器压力，http 缓存只建议加在 cdn 上，应用服务器上不要加缓存，带 hash 的可以加。
- 启用 gzip 压缩
- 伪静态设置
- 合理利用路由懒加载
- 组件库按需加载，使用 es 版本，方便 tree-shaking
- 延迟加载第三方包
- 对资源做 prefetch、preload 预加载；preload 提前加载当前页面需要用到的资源（不执行），prefetch 提前加载下个页面要用到的资源（不执行）。
- 使用多个图片系统域名，使用多个图片系统域名扩大图片的加载请求数量。
- 对域名做 dns 预解析：`<link rel="dns-prefetch" href="//img10.xx.com">`，在移动端上有一定效果，因为移动端的 dns 解析比较差。将会用到的域名直接加到 html 的 header 中即可，不需要通过 webpack 去生成。
- 升级 webpack 版本
- 小包替大包，手写替小包，如 dayjs 替换 momentjs

性能优化手段总结：

1. 减少首屏资源大小
   1. 资源混淆压缩
   2. 资源加上 gzip
   3. 压缩图片/使用合适的图片类型/大小
   4. 图片懒加载
   5. 合理利用路由懒加载
   6. 组件库按需加载
   7. 延迟加载第三方包
   8. 升级 webpack 版本
   9. 小包替大包，手写替小包
   10. webpack.externals 配置第三方库不参与打包，而是在 html 中通过 script 标签直接引入公共 CDN
2. 减少网络消耗/合理利用网络请求
   1. 资源合并
   2. 图片做雪碧图/iconfont/base64
   3. http 缓存/cdn 缓存
   4. 资源放 CDN
   5. 对资源做 preload 和 prefetch
   6. 使用多个图片系统域名
   7. 对域名做 dns 预解析
3. 优化渲染
   1. css、js 资源位置
   2. 避免重绘重排/减少 dom 结构复杂度
4. 其他关联系统方面
   1. 长耗时任务，分析耗时长的接口，后端优化
   2. `web-vitals`库和 performance 进行结合，分析 LCP：主要内容出现的时间，越短越好；FID：输入延迟的时间，低于 100ms 越好；CLS：页面变化的积累量，低于 0.1 越好

- 使用子域名加载资源
- 使用较近的 CDN 或 dns 预解析
- 使用高性能传输方式或方法，http2,quic,gzip...
- 减少 http 请求的数量，合并公共资源、使用雪碧图、合并代码块、按需加载资源
- 减少传输总量或加快传输速度
- 优化图片的加载展示策略，根据网络状况加载图片、图片格式优化、图片展示位置优化
- 减少 cookie 体积
- 使用更有效的缓存策略，keep-alive,expiration,max-age...
- 使用良好的页面布局
- 合理安排路由策略
- 减少反复操作 dom
- 减少重绘和重排
- 异步加载资源
- 公用 css 类
- 使用 GPU 渲染初始动画和图层的合成
- 高效的 js 代码
- 使用防抖和节流对 UI 进行优化
- 使用 web worker 加载资源
- 减少 301 302
- 试试缓存数据的方法 localStorage/sessionStorage/indexedDB
- 无阻塞加载 js，减少并发下载或请求
- 减少插件中的多语言版本内容
- 减少布局上的颠簸，减少对临近元素的影响
- 减少同时的动画
- 制定弱网精简策略
- 针对设备制定精简策略
- 减少页面图层
- js、css 命名尽量简短
- 减少 js 全局查找
- 减少循环和循环嵌套以减少 js 执行时间
- 减少事件绑定
- 组件提取、样式提取、函数提取
- 按照页面变更频率安排资源
- 减少 iframe
- 注意页面大小，特别是 canvas 的大小和占用内存
