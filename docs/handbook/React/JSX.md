---
title: JSX原理
author: EricYangXD
date: "2022-01-12"
---

## JSX 原理

### babel 编译 jsx

-   jsx 语法最终会被 babel 编译成为 React.createElement()方法

比如：

```html
<div className="wrapper">hello</div>
```

经过 babel 编译后它变成这样的代码:

```js
React.createElement(
	"div",
	{
		className: "wrapper",
	},
	"hello"
);
```

当 jsx 中存在多个节点元素时，比如:

```html
<div>hello<span>world</span></div>
```

它会将多个节点的 jsx 中 children 属性变成多个参数进行传递下去:

```js
React.createElement(
	"div",
	null,
	"hello",
	React.createElement("span", null, "world")
);
```

可以看到，外层的 div 元素包裹的 children 元素依次在 React.createElement 中铺平排列进去，并不是树型结构排列。

> 需要注意的是，旧的 react 版本中，只要我们使用 jsx 就需要引入 react 这个包。而且引入的变量必须大写 React，因为上边我们看到 babel 编译完 jsx 之后会寻找 React 变量。

> 新版本中，不再需要引入 React 这个变量了。有兴趣的同学可以去看看打包后的 react 代码,内部会处理成为`Object(s.jsx)("div",{ children: "Hello" })`，而老的版本是`React.createElement('div',null,'Hello')`。

> 这两种方式效果和原理是一模一样的，只是新版额外引入包去处理了引入。所以不需要单独进行引入 React。

-   React 之中元素是构建 React 的最小单位,其实也就是虚拟 Dom 对象。

-   本质上 jsx 执行时就是在执行函数调用，是一种工厂模式通过 React.createElement 返回一个元素。

### React.createElement

-   React.createElement 用于生成虚拟 DOM 节点对象。

在我们平常使用 react 项目的时候，index.tsx 中总是会存在这样一段代码:

```js
ReactDOM.render(<App />, document.getElementById("root"));
```

结合上边我们所讲的 React.createElement，我们不难猜出 ReactDOM.render 这个方法它的作用其实就是按照 React.createElement 生成的虚拟 DOM 节点对象，生成真实 DOM 插入到对应节点中去，这就是简单的渲染过程。

-   react 中元素本身是不可变的。会报错：无法给一个只读属性 children 进行赋值，修改其他属性比如 type 之类同理也是不可以的。

> not extensible 是 react17 之后才进行增加的。通过 Object.freeze()将对象进行处理元素。

> 需要注意 Object.freeze()是一层浅冻结，在 react 内部进行了递归 Object.freeze()。

-   所以在 react 中元素本身是不可变的，当元素被创建后是无法修改的。只能通过重新创建一个新的元素来更新旧的元素。

-   你可以这样理解，在 react 中每一个元素类似于动画中的每一帧，都是不可以变得。

### ReactDOM.render

-   ReactDOM.render 把接收到的 VDOM 变成真实元素插入到对应的根节点上。

-   明确一个思想: ReactDOM.render()方法仅仅支持传入一个 VDOM 对象和 el。他的作用就是将 VDOM 生成真实 DOM 挂载在 el 上。此时如果 VDOM 存在一些 children，那么 ReactDOM.render 会递归他的 children，将 children 生成的 DOM 节点挂载在 parentDom 上。一层一层去挂载。
-   在 React 中 class 组件因为继承自 React.component,所以 class 组件的原型上会存在一个 isReactComponent 属性。这个属性仅有类组件独有，函数组件是没有的，这就可以区分 class 组件和函数式组件。

1. 对于 class 组件：
    - 经过 babel 之后得到的 vdom 的形式和函数组件类似，但是可以通过 type.prototype.isReactComponent 区分出来；
    - 然后将他的 render 方法返回的 Vdom 对象通过 createDom 方法转化为真实 Dom 节点来进行挂载。
    - `createDom(new type(props).render());`
2. 对于函数组件 FC：
    - 进入 ReactDOM.render 方法创建真实 DOM 时，在 createDom 时会判断传入的 vDom 的 type，发现是 FC 类型；
    - 那么会传入自身 props 调用自身，运行这个函数组件后，得到 jsx，经过 babel 转化成对 React.createElement(FunctionCompoent,props,children)的调用，返回虚拟 DOM 对象；
    - 拿到 vDom 对象后，通过之前的 createDom 方法将 vDom 转化成真实节点返回；
    - 此时 render 方法就可以拿到对应生成的真实 DOM 对象，从而挂载在 DOM 元素上。
    - `createDom(type(props));`
3. 对于文本节点：直接`dom = document.createTextNode(props.content);`；
4. 对于原生 DOM 节点：直接`dom = document.createElement(type);`。
5. 无论是 FC 还是 CC 这两种组件，内部本质上还是基于普通 DOM 节点的封装，所以我们只需要递归调用他们直接返回基本的 DOM 节点之后进行挂载就 OK.

> 本质上还是通过递归调用 createDOM 进行判断，如果是函数那么就运行函数的到返回的 vDOM，然后在通过 createDom 将 vDom 转化为对应的真实 DOM 挂载。

> 从这里也可以看出为什么 React 中返回的 jsx 必须要求最外层元素需要一个包裹元素。

### 相对于普通 dom 节点。纯函数组件的不同点:

1. $$typeof 为 Symbol(react.element)表示这个元素节点的类型是一个纯函数组件。
2. 经过 babel 编译后的 VDOM，在原生 dom 节点中，type 类型为对应的标签类型字符串。而当为纯函数组件时。type 类型为函数自身。

### 核心思想总结

1. createDom 如果传入的是一个普通节点，那么就直接根据对应 type 创建标签。
2. createDom 如果传入的是一个函数组件，那么就调用这个函数组件得到它返回的 vDom 节点，然后在通过 createDom 将 vDom 渲染成为真实节点。
3. createDom 如果传入的是一个 class 组件，那么就 new Class(props).render()得到返回的 vDom 对象，然后在将返回的 vDom 渲染成为真实 Dom。
