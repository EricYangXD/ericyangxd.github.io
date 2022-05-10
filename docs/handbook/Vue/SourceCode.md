---
title: Vue源码阅读笔记
author: EricYangXD
date: "2021-12-28"
---

## 生命周期

### Vue3.0

-   如图：[生命周期](../../assets/lifecycle.svg)

-   生命周期钩子

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

-   Vue3 Composition API 生命周期的变化：

1. 用 setup 代替了 beforeCreate 和 created；
2. 使用 Hooks 函数的形式，如 mounted 改为 onMounted()；
3.

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

-   Vue2

1. 双端相互 比较

-   Vue3

1. 最长递增子序列

-   React

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
