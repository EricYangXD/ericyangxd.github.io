---
title: Vue源码阅读笔记
author: EricYangXD
date: "2021-12-28"
---

## 生命周期

### Vue3.0

- 如图：[生命周期](../../assets/lifecycle.svg)

- 生命周期钩子

0. `Vue.createApp(options).mount(el)`；
1. `init events & lifecycle`；
2. beforeCreate 钩子：此时创建了一个空白的 Vue 实例；data、methods 尚未初始化，不可用；
3. `init injections & reactivity`；
4. created 钩子：此时 Vue 实例初始化完成，完成响应式绑定；data、methods 都已经初始化完成，可以调用；尚未开始渲染模板；
5. 判断`options`里面是否有`template`属性？如果有`template`，则把`template`编译成 render 函数，否则把 el 的 innerHTML 编译成模板；
6. beforeMount 钩子：此时编译模板，调用 render 生成 vdom；还没有开始渲染 dom；dom 不可用；
7. `create app.$el and append it to el`；
8. mounted 钩子：此时已经把 vdom 转化成真实的 dom 节点并挂载到 el 上，完成 dom 渲染；组件就创建完成了；此时可以操作 dom，并由「创建阶段」进入「运行阶段」。
9. 在 Mounted 之后进入运行阶段，当 data 发生变化时，进入 Update 更新阶段；
10. beforeUpdate 钩子：此时 data 发生变化，准备更新 dom；
11. `vdom diff、re-rendered and patch`；
12. updated 钩子：此时 dom 已完成更新，data 的变化已反映在 dom 上；不要在此时修改 data，否则会死循环！
13. 然后进入「销毁阶段」时：即触发`app.unmount()`之后；
14. beforeUnmount 钩子：组件卸载之前，组件尚未销毁依然可正常使用，此时可以清理一些全局事件、自定义事件，如定时器、事件监听等；
15. unmounted 钩子：组件包括所有的子组件都已卸载/销毁；
16. 被`keep-alive`包裹的组件的生命周期：activated 和 deactivated，激活和未激活；
17. activated：初次渲染，先 created，然后 activated；之后切换时，只会触发 deactivated（先，要隐藏的） 和 activated（后，要激活的）；

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
4. `.sync`修饰符
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
2. EventBus: 使用一个 Vue 实例做载体，通过实例上的`$on`/`$emit`进行通信。
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

Vue 采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty/Proxy 来劫持各个属性的 setter、getter，访问数据时添加订阅者到依赖收集器里，在数据变动时通过依赖收集器通知订阅者，触发订阅者的监听回调，去完成数据的更新和页面的渲染等工作。

- Observer 负责将数据转换成 getter/setter 形式；
- Dep 负责管理数据的依赖列表，是一个发布订阅模式，上游对接 Observer，下游对接 Watcher；
- Watcher 是实际上的数据依赖，负责将数据的变化转发到外界(渲染、回调)；

1. 首先 Vue 将 data 初始化为一个 Observer，并通过 Object.defineProperty/Proxy ，循环遍历「对象」的所有属性，为对象中的每个属性设置 getter、setter，以达到拦截访问和设置的目的，如果属性值依旧为对象，则递归为属性值上的每个 key 设置 getter、setter；
2. 对于 data 中的每个值，都对应一个独立的依赖收集器 Dep；
3. 在 mount 时，实例了一个 Watcher，将收集器的目标指向了当前 Watcher；
4. 在 getter 中，即访问数据时（obj.key)进行依赖收集，在依赖收集器 dep 中添加相关的监听 watcher；
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

### .sync 修饰符

.sync 修饰符可以实现子组件与父组件的双向绑定，并且可以实现子组件同步修改父组件的值。

```html
// 正常父传子：
<son :a="num" :b="num2"></son>

// 加上sync之后父传子：
<son :a.sync="num" .b.sync="num2"></son>

// 它等价于
<son
	:a="num"
	@update:a="val=>num=val"
	:b="num2"
	@update:b="val=>num2=val"
></son>

//
相当于多了一个事件监听，事件名是update:a，回调函数中，会把接收到的值赋值给属性绑定的数据项中。
```

这里面的传值与接收与正常的父向子传值没有区别，唯一的区别在于往回传值的时候$emit 所调用的事件名必须是 update:属性名，事件名写错不会报错，但是也不会有任何的改变，这点需要多注意。

另外需要特别注意的是: v-model 一个组件中只能用一次；.sync 则可以有多个。
