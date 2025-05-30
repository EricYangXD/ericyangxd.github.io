---
title: Vue源码阅读笔记
author: EricYangXD
date: "2021-12-28"
meta:
  - name: keywords
    content: Vue,Vue2,Vue3,vuejs
---

## 生命周期

### Vue3.0

- 如图：![生命周期](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/lifecycle.svg)

- 生命周期钩子

1. `Vue.createApp(options).mount(el)`；
2. `init events & lifecycle`；
3. beforeCreate 钩子：此时创建了一个空白的 Vue 实例；data、methods 尚未初始化，不可用；
4. `init injections & reactivity`；
5. created 钩子：此时 Vue 实例初始化完成，完成响应式绑定；data、methods 都已经初始化完成，可以调用；尚未开始渲染模板；
6. 判断`options`里面是否有`template`属性？如果有`template`，则把`template`编译成 render 函数，否则把 el 的 innerHTML 编译成模板；
7. beforeMount 钩子：此时编译模板，调用 render 生成 vdom；还没有开始渲染 dom；dom 不可用；
8. `create app.$el and append it to el`；
9. mounted 钩子：此时已经把 vdom 转化成真实的 dom 节点并挂载到 el 上，完成 dom 渲染；组件就创建完成了；此时可以操作 dom，并由「创建阶段」进入「运行阶段」。
10. 在 Mounted 之后进入运行阶段，当 data 发生变化时，进入 Update 更新阶段；
11. beforeUpdate 钩子：此时 data 发生变化，准备更新 dom；
12. `vdom diff、re-rendered and patch`；
13. updated 钩子：此时 dom 已完成更新，data 的变化已反映在 dom 上；不要在此时修改 data，否则会死循环！
14. 然后进入「销毁阶段」时：即触发`app.unmount()`之后；
15. beforeUnmount 钩子：组件卸载之前，组件尚未销毁依然可正常使用，此时可以清理一些全局事件、自定义事件，如定时器、事件监听等；
16. unmounted 钩子：组件包括所有的子组件都已卸载/销毁；
17. 被`keep-alive`包裹的组件的生命周期：activated 和 deactivated，激活和未激活；
18. activated：初次渲染，先 created，然后 activated；之后切换时，只会触发 deactivated（先，要隐藏的） 和 activated（后，要激活的）；

- Vue3 Composition API 生命周期的变化：

1. 用 setup 代替了 beforeCreate 和 created；
2. 使用 Hooks 函数的形式，如 mounted 改为 onMounted()；

### Vue 中的 render 函数

1. h，即 createElement，是 Render 函数的核心。
2. h 有 3 个参数，分别是：
   1. 要渲染的元素或组件，可以是一个 html 标签、组件选项或一个函数（不常用），该参数为必填项。
   2. 对应属性的数据对象，比如组件的 props、元素的 class、绑定的事件、slot、自定义指令等。
   3. 子节点，可选，String 或 Array，它同样是一个 h。
3. Functional Render：Vue.js 提供了一个 functional 的布尔值选项，设置为 true 可以使组件无状态和无实例，也就是没有 data 和 this 上下文。这样用 Render 函数返回虚拟节点可以更容易渲染，因为函数化组件（Functional Render）只是一个函数，渲染开销要小很多。

### 什么时候操作 dom 更合适

1. mounted 和 updated 都不能保证子组件全部挂载完成；
2. 使用`$nextTick`渲染 dom；

### nextTick 的原理

1. nextTick 中的回调是在下次 Dom 更新循环结束之后执行的延迟回调
2. 可以用于获取更新后的 Dom
3. Vue 中的数据更新是异步的，使用 nextTick 可以保证用户定义的逻辑在更新之后执行
4. nextTick 一般使用 Promise 或 MutationObserver 或 setImmediate 实现，用 setTimeout 兜底。
   - 微任务：Promise.resolve().then(flushCallbacks)
   - 微任务：创建 MutationObserver()示例，通过监听 dom 节点的变化触发执行 flushCallbacks
   - 宏任务：setImmediate(flushCallbacks) -- 「setImmediate」 在绝大多数浏览器中不被支持，但在 「Node.js」 中是可用的
   - 宏任务：setTimeout(flushCallbacks, 0) -- 兜底的
5. 整体原理：在调用 this.$nextTick(cb) 之前，存在一个 callbacks 数组，用于存放所有的 cb 回调函数。存在一个 flushCallbacks 函数，用于执行 callbacks 数组中的所有回调函数。存在一个 timerFunc 函数，用于将 flushCallbacks 函数添加到（微任务或宏任务）任务队列中。当调用 this.nextTick(cb) 时：nextTick 会将 cb 回调函数添加到 callbacks 数组中。判断在当前事件循环中是否是第一次调用 nextTick（通过一个 pending 变量标记是否处于节流状态，防止重复推送任务）：如果是第一次调用，将执行 timerFunc 函数，添加 flushCallbacks 到任务队列。如果不是第一次调用，直接下一步。如果没有传递 cb 回调函数，则返回一个 Promise 实例。

### 什么时候操作 ajax

1. created 和 mounted 钩子里都可以；
2. 推荐 mounted；因为 created 到 mounted 中间间隔的时间一般都很短暂，体验不出区别；

### Vue2/Vue3/React 三者 diff 算法的区别

> diff 算法是搭配 vdom 的，vdom 可以保证性能的下限不会太低。

tree diff 的优化：时间复杂度 O(n)：

1. 只比较同一层级，不跨层级比较；
2. tag 不同则删掉重建，不再去比较内部的细节；
3. 子节点通过 key 区分唯一性；

- Vue2

1. 双端相互 比较

- Vue3

1. 最长递增子序列

- React

1. 仅右移

### Vue/React 为何循环时必须使用 key

1. vdom diff 算法会根据 key 判断元素是否要删除
2. 匹配了 key，则只移动元素，性能较好
3. 未匹配 key，则删除重建，性能较差
4. 最大程度的复用已有的 dom 节点

### Vue-Router 的三种模式

1. createHashHistory: location.hash & window.onhashchange
2. createWebHistory: history.pushState/history.replaceState & window.onpopstate
3. createMemoryHistory/abstractHistory: 路由状态存在内存中，不会改变 url，适用于 SSR

### 组件之间的通信方式

#### 父子组件

1. `props`/`$emit`&`$on`、`@on`
2. `$refs`
3. `$parent`&`$children`
4. `.sync`修饰符配合`v-bind:update:`
5. 派发与广播——自行实现`dispatch` 和 `broadcast`方法:

```js
function broadcast(componentName, eventName, params) {
  this.$children.forEach((child) => {
    const name = child.$options.name;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
  },
};
```

#### 兄弟组件

#### 隔代/跨级组件

1. provide/inject: provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。

骚操作：使用 provide / inject 替代 Vuex，就是在这个 app.vue 文件上做文章。我们把 app.vue 理解为一个最外层的根组件，用来存储所有需要的全局数据和状态，甚至是计算属性（computed）、方法（methods）等。因为你的项目中所有的组件（包含路由），它的父组件（或根组件）都是 app.vue，所以我们把整个 app.vue 实例通过 provide 对外提供。如下，我们把整个 app.vue 的实例 this 对外提供，命名为 app（这个名字可以自定义，推荐使用 app，使用这个名字后，子组件不能再使用它作为局部属性）。接下来，任何组件（或路由）只要通过 inject 注入 app.vue 的 app 的话，都可以直接通过 this.app.xxx 来访问 app.vue 的 data、computed、methods 等内容。app.vue 是整个项目第一个被渲染的组件，而且只会渲染一次（即使切换路由，app.vue 也不会被再次渲染），利用这个特性，很适合做一次性全局的状态数据管理，例如，我们将用户的登录信息保存起来。

```vue
<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  provide() {
    return {
      app: this,
    };
  },
};
</script>
```

#### 通用方式

1. Vuex/Pinia: 最主要的目的是跨组件通信、全局数据维护、多人协同开发。
2. EventBus: 使用一个 Vue 实例做载体，通过实例上的`$on`/`$emit`进行通信。(Vue3 中不能用了，可以用 tiny-emtter 代替)
3. 大而全：自定义 findComponent 方法：
   - 由一个组件，向上找到最近的指定组件；
   - 由一个组件，向上找到所有的指定组件；
   - 由一个组件，向下找到最近的指定组件；
   - 由一个组件，向下找到所有指定的组件；
   - 由一个组件，找到指定组件的兄弟组件。

5 个函数的原理，都是通过递归、遍历，找到指定组件的 name 选项匹配的组件实例并返回。

```js
// 由一个组件，向上找到最近的指定组件
function findComponentUpward(context, componentName) {
  let parent = context.$parent;
  let name = parent.$options.name;

  while (parent && (!name || [componentName].indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}
export { findComponentUpward };
```

```js
// 由一个组件，向上找到所有的指定组件
function findComponentsUpward(context, componentName) {
  let parents = [];
  const parent = context.$parent;

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent);
    return parents.concat(findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
}
export { findComponentsUpward };
```

```js
// 由一个组件，向下找到最近的指定组件
function findComponentDownward(context, componentName) {
  const childrens = context.$children;
  let children = null;

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name;

      if (name === componentName) {
        children = child;
        break;
      } else {
        children = findComponentDownward(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
}
export { findComponentDownward };
```

```js
// 由一个组件，向下找到所有指定的组件
function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child);
    const foundChilds = findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}
export { findComponentsDownward };
```

```js
// 由一个组件，找到指定组件的兄弟组件
function findBrothersComponents(context, componentName, exceptMe = true) {
  let res = context.$parent.$children.filter((item) => {
    return item.$options.name === componentName;
  });
  let index = res.findIndex((item) => item._uid === context._uid);
  if (exceptMe) res.splice(index, 1);
  return res;
}
export { findBrothersComponents };
```

### Vue 的构造器——extend 与手动挂载——$mount

Vue.extend 的作用，就是基于 Vue 构造器，创建一个“子类”，它的参数跟 new Vue 的基本一样，但 data 要跟组件一样，是个函数，再配合 $mount ，就可以让组件渲染，并且挂载到任意指定的节点上，比如 body。

```js
import Vue from "vue";

const AlertComponent = Vue.extend({
  template: "<div>{{ message }}</div>",
  data() {
    return {
      message: "Hello, Aresn",
    };
  },
});
// 这一步，我们创建了一个构造器，这个过程就可以解决异步获取 template 模板的问题，下面要手动渲染组件，并把它挂载到 body 下：
const component = new AlertComponent().$mount();
// 这一步，我们调用了 $mount 方法对组件进行了手动渲染，但它仅仅是被渲染好了，并没有挂载到节点上，也就显示不了组件。此时的 component 已经是一个标准的 Vue 组件实例，因此它的 $el 属性也可以被访问：当然，除了 body，你还可以挂载到其它节点上。
document.body.appendChild(component.$el);

// $mount 也有一些快捷的挂载方式，以下两种都是可以的：
// 在 $mount 里写参数来指定挂载的节点
new AlertComponent().$mount("#app");
// 不用 $mount，直接在创建实例时指定 el 选项
new AlertComponent({ el: "#app" });
```

实现同样的效果，除了用 extend 外，也可以直接创建 Vue 实例，并且用一个 Render 函数来渲染一个 .vue 文件：

```js
import Vue from "vue";
import Notification from "./notification.vue";

const props = {}; // 这里可以传入一些组件的 props 选项

const Instance = new Vue({
  render(h) {
    return h(Notification, {
      props: props,
    });
  },
});

const component = Instance.$mount();
document.body.appendChild(component.$el);

// 渲染后，如果想操作 Render 的 Notification 实例，也是很简单的：
const notification = Instance.$children[0];
```

需要注意的是，我们是用 `$mount` 手动渲染的组件，如果要销毁，也要用 `$destroy` 来手动销毁实例，必要时，也可以用 removeChild 把节点从 DOM 中移除。

### Vue 响应式原理

本质上是数据（任意在函数运行期间读取到的响应式数据的成员）和函数的关联，Vue 采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty/Proxy 来劫持各个属性的 setter、getter，访问数据时添加订阅者到该数据对应的依赖收集器里，在数据变动时通过该数据对应的依赖收集器通知订阅者，触发订阅者的监听回调，去完成数据的更新和页面的重新渲染等工作。

- Observer 负责将数据转换成 getter/setter 形式；
- Dep 负责管理数据的依赖列表，是一个发布订阅模式，上游对接 Observer，下游对接 Watcher；
- Watcher 是实际上的数据依赖，负责将数据的变化转发到外界(渲染、回调)；

1. 首先 Vue 将 data 初始化为一个 Observer，并通过 Object.defineProperty/Proxy ，循环遍历「对象」的所有属性，为对象中的每个属性设置 getter、setter，以达到拦截访问和设置的目的，如果属性值依旧为对象，则递归为属性值上的每个 key 设置 getter、setter；
2. 对于 data 中的每个值，都对应一个独立的依赖收集器 Dep；
3. 在 mount 时，实例了一个 Watcher，将收集器的目标指向了当前 Watcher；
4. 在 getter 中，即访问数据时（obj.key）进行依赖收集，在依赖收集器 dep 中添加相关的监听 watcher；
5. 在 data 值发生变更时，触发 setter，判断是否真的发生了变化，然后会去触发依赖收集器中的所有监听的更新 dep.notify()，来触发 Watcher.update；
6. 对「数组」，增强数组的那 7 个可以更改自身的原型方法，然后拦截对这些方法的操作；「'push','pop','shift','unshift','splice','sort','reverse'」：
   1. 添加新数据时进行响应式处理，然后由 dep 通知 watcher 去更新；
   2. 删除数据时，也要由 dep 通知 watcher 去更新

- Object.defineProperty 只对初始对象里的属性有监听作用，而对新增的属性无效。这也是为什么 Vue2 中对象新增属性的修改需要使用 Vue.$set 来设值的原因。

### Object.defineProperty 的不足之处

1. 对普通对象的监听需要遍历每一个属性
2. 无法监听数组的变动
3. 无法监听 Map/Set 数据结构的变动
4. 无法对对象新增/删除的属性进行监听

### Vue 数据双向绑定原理

响应式原理基本就是数据到 DOM 的绑定，双向绑定还需要监听 input 或其他 DOM 的变化，当 DOM 的 value 发生变化之后，触发 change 事件，去修改对应的属性的值，实现了页面驱动数据。

Vue 接收一个模板和 data 参数。

1. 首先将 data 中的数据进行递归遍历，对每个属性执行 Object.defineProperty，定义 get 和 set 函数。并为每个属性添加一个 dep 数组。当 get 执行时，会为调用的 dom 节点创建一个 watcher 存放在该数组中。当 set 执行时，重新赋值，并调用 dep 数组的 notify 方法，通知所有使用了该属性 watcher，并更新对应 dom 的内容。
2. 将模板加载到内存中，递归模板中的元素，检测到元素有 v-开头的命令或者双大括号的指令，就会从 data 中取对应的值去修改模板内容，这个时候就将该 dom 元素添加到了该属性的 dep 数组中。这就实现了数据驱动视图。
3. 在处理 v-model 指令的时候，为该 dom 添加 input 事件（或 change），输入时就去修改对应的属性的值，实现了页面驱动数据。
4. 将模板与数据进行绑定后，将模板添加到真实 dom 树中。

### v-model 语法糖模拟

1. 原生 dom:`<input v-bind:value="test" v-on:input="test=$event.target.value">`==`<input v-model="test">`
2. 自定义组件:
   - 父组件：`<son v-model="num" @input="val=>num=val" />`
   - 子组件：`$emit('input',888)`

input 元素本身有个 input 事件，这是 HTML5 新增加的，类似 onchange ，每当输入框内容发生变化，就会触发 input 事件，把最新的 value 值传给传递给 val ,完成双向数据绑定的效果 。

注意: 不是所有能进行双向绑定的元素都有 input 事件。

### 通过 Object.freeze()优化

在确定某个数据不需要做成响应式时，可以使用 `Object.freeze(data1)`冻结改数据对象，Vue 就不会再去把这个数据对象做成响应式的了，从而实现性能优化。比如请求的数据只需要展示而不会修改，则在赋值时可以：`this.newsData = Object.freeze(this.getNewsData());`，相当于让 newsData 变成了非响应式数据。

### .sync 修饰符

.sync 修饰符可以实现子组件与父组件的双向绑定，并且可以实现子组件同步修改父组件的值。

```html
// 正常父传子：
<son :a="num" :b="num2"></son>

// 加上sync之后父传子：
<son :a.sync="num" :b.sync="num2"></son>

// 它等价于
<son :a="num" @update:a="val=>num=val" :b="num2" @update:b="val=>num2=val"></son>

// 相当于多了一个事件监听，事件名是update:a，回调函数中，会把接收到的值赋值给属性绑定的数据项中。
```

1. 这里面的传值与接收与正常的父向子传值没有区别，唯一的区别在于往回传值的时候$emit 所调用的事件名必须是 @update:属性名，事件名写错不会报错，但是也不会有任何的改变，这点需要多注意。

2. 除了写法不同，另外需要特别注意的是: v-model 一个组件中只能用一次；.sync 则可以有多个。
3. .sync 和 v-model 都是语法糖，都可以实现父子组件中的数据双向通信。

## Vue 项目本地开发完成后部署到服务器后报 404 是什么原因呢？

### 为什么只有 history 模式下会出现这个问题？

可能是 Nginx 配置有问题，比如当我们在地址栏输入 `www.website.com` 时，这时会打开我们 dist 目录下的 `index.html` 文件，然后我们在跳转路由进入到 `www.website.com/login`，此时在 `www.website.com/login` 页执行刷新操作，`nginx location` 如果没有相关的配置，那么就会出现 404 的情况。

产生问题的**本质是因为我们的路由是通过 JS 来执行视图切换的**。当我们进入到子路由时刷新页面，web 容器没有相对应的页面此时会出现 404。

所以我们只需要**配置将任意页面都重定向到 index.html，把路由交由前端处理**。

```sh
server {
  listen  80;
  server_name  www.website.com;

  location / {
    index  /data/dist/index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

另外，为了避免这种情况，应该在 Vue 应用里面覆盖所有的路由情况，然后在给出一个 404 页面。

### 为什么 hash 模式下没有问题？

router hash 模式它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对服务端完全没有影响，因此改变 hash 不会重新加载页面。

hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 `website.com/#/login` 只有 `website.com` 会被包含在请求中 ，因此对于服务端来说，即使没有配置 location，也不会返回 404 错误。

## Vue 中的模板编译原理

这个问题的核心是如何将 template 转换成 render 函数。

1. 将 template 模版转换成 ast 语法树 - parserHTML
2. 对静态语法做标记（某些节点不改变）
3. 重新生成代码 - codeGen，使用 with 语法包裹字符串
4. 执行 render 函数，此时初次渲染的话会触发 data 属性的 getter，进行依赖收集，同时生成虚拟 dom 树
5. 然后把 vdom 树生成真实 dom 树并 patch 到页面根节点上

## Vue.$set 方法是如何实现的

- vue 给对象和数组本身都增加了 dep 属性
- 当给对象新增不存在的属性的时候，就会触发对象依赖的 watcher 去更新
- 当修改数组索引的时候，就调用数组本身的 splice 方法去更新数组

## v-model

1. v-model 会根据不同的元素来触发不同的事件：

- text 和 textarea 元素使用 input 事件；
- checkbox / radio 和 select 使用 change 事件；

## Vue.config.errorHandler

### TODO

## 全局捕获 Promise 错误

1. babel 插件，[参考](https://juejin.cn/post/7155434131831128094)
2. addEventListener 监听 unhandledrejection

```js
window.addEventListener("unhandledrejection", function (event) {
  console.log("event", event);
  // 处理事件对象
  console.log(111, event.reason); //获取到catch的err的原因(内容) 与控制台报错一致
  console.log(222, event.promise); //获取到未处理的promise对象
  event.preventDefault();
});
```

3. 封装接口的时候全部 resolve 掉，然后处理错误信息

## 关于 sourcemap

1. 开发环境不会混淆和压缩代码，开发时可直接定位位置
2. sourcemap 文件上传到异常收集系统，比如 sentry，然后把前端捕获的异常信息上报到系统中，系统会用 sourcemap 文件自动定位到原始代码位置。记住别把 sourcemap 文件也一起发到部署到服务器中，浏览器可以解析出源代码，相当于没混淆压缩

## Vue3 更新的内容

### Composition API

使用传统的 option 配置方法需要遵循 option 的配置写到特定的区域，导致后续维护非常的复杂，同时代码可复用性不高，而 composition-api 就是为了解决这个问题而生。

而 composition-api（组合式 API）把 data，methods，computed 等封装到 setup 函数中，让相关功能的代码更加有序的组织在一起。然后可以通过 useXXX 来使用。

### reactive 对比 ref

在 vue2.x 中，数据都是定义在 data 中。但是 Vue3.x 可以使用 reactive 和 ref 来进行数据定义。那么 ref 和 reactive 他们有什么区别呢?

#### 从原理角度对比：

1. ref 用来创建一个包含响应式的数据的引用对象，接收数据可以是：基本数据类型、对象类型、DOM 的 ref 属性值，即任意类型数据。Ref 会使它的值具有深层响应性。这意味着即使改变嵌套对象或数组时，变化也会被检测到。可以通过 shallowRef 来放弃深层响应性。响应式是通过内部实现的 **RefImpl 类**的 get 与 set 完成的。

- 基本类型的数据：响应式 ~~依然是靠 object.defineProperty()~~ 是通过内部实现的 RefImpl 类的 get 与 set 完成的。返回的 value 是一个原始值。
- 对象类型的数据：响应式是先判断 isObject，再调用 toReactive 方法，通过 vue3 中的 reactive 函数通过 Proxy 转为具有深层次响应式的对象实现的，返回的 value 是一个 Proxy 对象。

2. reactive 用来创建一个响应式对象，接收数据只能是对象类型数据包括数组。通过使用 Proxy 来实现响应式（数据劫持）, 并通过 Reflect 操作源对象内部的数据。

#### 从使用角度对比：

1. ref 定义的数据：操作数据需要.value，读取数据时模板中不需要.value 直接使用即可。一般用来处理基础数据类型。
2. reactive 定义的数据：操作数据与读取数据：均不需要.value。一般用来处理引用数据类型。

### 新增 watchEffect 函数

1. watch 函数需要指明监视的属性，并在回调函数中执行。默认情况仅在侦听的源数据变更时才执行回调。也可以加上 immediate: true 来使其立即生效
2. watchEffect 不用指明监视哪个属性，监视的回调中用到哪个属性，就监视哪个属性。
3. **watchEffect 只能收集同步代码的依赖**，所以在 watchEffect 中使用 async/await 时，如果需要在异步之后收集依赖，那么需要在同步代码那里先运行一下这个依赖。

```js
const speed = ref(1);
const url = ref("");
const videoRef = ref(null);
watchEffect(async () => {
  speed.value; // 运行一下收集上依赖！
  url.value = await fetchVideoUrl();
  videoRef.value.playbackRate = speed.value; // 这里属于异步代码了，会放到微任务队列，导致无法赋上值。
});
```

### 重写 VDOM

优化前 Virtual Dom 的 diff 算法，需要遍历所有节点，而且每一个节点都要比较旧的 props 和新的 props 有没有变化。在 Vue3.0 中，只有带 PatchFlag 的节点会被真正的追踪，在后续更新的过程中，Vue 不会追踪静态节点，只追踪带有 PatchFlag 的节点来达到加快渲染的效果。

### 响应式实现

#### Vue2.x 响应式实现

Object.defineProperty()只能拦截对象的属性，有 get 和 set 两个方法，不能新增属性、删除属性，无法监听数组下标和 length 长度的变化，无法监听数组下标和 length 长度的变化，对嵌套对象实现响应式需要递归，性能开销大，会影响原始对象。

1. 对象类型：通过 Object.defineProperty()对属性的读取、修改进行拦截（数据劫持）。
2. 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

#### Vue3.x 响应式实现

Proxy 可以代理整个对象，操作的是代理对象，不影响原始对象，某些场景下性能比 Object.defineProperty()高。

1. 通过 Proxy（代理）: 拦截对象中任意属性的变化——属性值的读写、属性的添加、属性的删除等。
2. 通过 Reflect（反射）: 对源对象的属性进行操作。保证 this.target 指向源对象。

### 新的生命周期钩子

1. 去掉了 vue2.0 中的 beforeCreate 和 created 两个阶段，新增了一个 setup。执行 setup 时，组件实例尚未被创建。
2. 每个生命周期函数必须导入才可以使用，并且所有生命周期函数需要统一放在 setup 里使用。
3. destroyed 销毁后被重命名为 unmounted 卸载后；beforeDestroy 销毁前生命周期选项被重命名为 beforeUnmount 卸载前。
4. 命名方式改为 onXXX 的形式，如 onBeforeMount、onMounted、onBeforeUpdate、onUpdated、onBeforeUnmount、onUnmounted、onActivated、onDeactivated、onErrorCaptured 等。
5. setup() 函数中的生命周期钩子类似 vue2.0 中的 beforeCreate 和 created 两个阶段。执行 setup 函数时，会调用 exposed()方法，将组件的实例上的属性方法等暴露给模板。

### 新的组件

#### 片段（Fragment）

1. Vue2 组件必须有一个根元素，Vue3.0 组件可以没有根元素，即组件可以没有标签包裹，内部会将多个标签包含在一个 Fragment 虚拟元素中。
2. 减少标签层级, 减小内存占用，提升了渲染性能。

#### Teleport

Teleport 组件可以实现将组件的模板渲染到指定的 DOM 节点中，从而实现组件的跨容器渲染。比如弹窗 Dialog 组件：可以在「不改变组件内部元素父子关系」的情况下,建立一个传送门将 Dialog 渲染的内容传送到 body 上面。在父组件内部还是可以按正常的子组件的逻辑进行操作 Dialog 组件。

```txt
<teleport to="body">
  <div v-if="isShow" class="dialog">
      <div class="dialog">
          <h3>弹窗</h3>
          <button @click="isShow=false">关闭弹窗</button>
      </div>
  </div>
</teleport>
```

#### Suspense

等待异步组件时渲染一些额外内容，让应用有更好的用户体验，类似 React 的 Suspense。提供两个 template slot, 刚开始会渲染一个 fallback 插槽下的内容， 直到到达某个条件后才会渲染 default 插槽的正式内容， 通过使用 Suspense 组件进行展示异步渲染更加简单。

```txt
<template>
    <div class="app">
        <h3>我是App组件</h3>
        <Suspense>
            <template v-slot:default>
                <NewSuspense/>
            </template>
            <template v-slot:fallback>
                <h3>加载中.....</h3>
            </template>
        </Suspense>
    </div>
</template>
```
