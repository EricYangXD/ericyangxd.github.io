(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{775:function(t,s,a){"use strict";a.r(s);var e=a(7),n=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"jsx-原理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#jsx-原理"}},[t._v("#")]),t._v(" JSX 原理")]),t._v(" "),a("h3",{attrs:{id:"babel-编译-jsx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#babel-编译-jsx"}},[t._v("#")]),t._v(" babel 编译 jsx")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("Q:老版本的 React 中，为什么写 jsx 的文件要默认引入 React?")])]),t._v(" "),a("li",[a("p",[t._v("A:因为 jsx 在被 babel 编译后，写的 jsx 会变成上述 React.createElement 形式，所以需要引入 React，防止找不到 React 引起报错。")])]),t._v(" "),a("li",[a("p",[t._v("新版本 React 已经不需要引入 createElement ，这种模式来源于 "),a("code",[t._v("Automatic Runtime")]),t._v("，使用"),a("code",[t._v("@babel/plugin-syntax-jsx")]),t._v("插件向文件中提前注入了 "),a("code",[t._v("_jsxRuntime api")]),t._v("。不过这种模式下需要我们在 "),a("code",[t._v(".babelrc")]),t._v(" 设置 "),a("code",[t._v("runtime: automatic")]),t._v(" 。")])]),t._v(" "),a("li",[a("p",[t._v("jsx 语法最终会被 babel 编译成为 React.createElement()方法")])])]),t._v(" "),a("p",[t._v("比如：")]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// element.js")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("div className"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"wrapper"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("hello"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("div"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br")])]),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// node")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" fs "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"fs"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" babel "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"@babel/core"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 第一步：模拟读取文件内容。 */")]),t._v("\nfs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("readFile")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./element.js"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("e"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" data")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" code "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("toString")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"utf-8"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 第二步：转换 jsx 文件 */")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" result "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" babel"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("transformSync")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("code"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("plugins")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"@babel/plugin-transform-react-jsx"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 第三步：模拟重新写入内容。 */")]),t._v("\n\tfs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("writeFile")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./element.js"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" result"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("code"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br")])]),a("p",[t._v("经过 babel 编译后它变成这样的代码:")]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("React"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("createElement")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"div"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("className")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"wrapper"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hello"')]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br")])]),a("p",[t._v("当 jsx 中存在多个节点元素时，比如:")]),t._v(" "),a("div",{staticClass:"language-html line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-html"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("hello"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("span")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("world"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("span")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("它会将多个节点的 jsx 中 children 属性变成多个参数进行传递下去:")]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("React"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("createElement")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"div"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"hello"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\tReact"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("createElement")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"span"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"world"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br")])]),a("p",[t._v("可以看到，外层的 div 元素包裹的 children 元素依次在 React.createElement 中铺平排列进去，并不是树型结构排列。")]),t._v(" "),a("blockquote",[a("p",[t._v("需要注意的是，旧的 react 版本中，只要我们使用 jsx 就需要引入 react 这个包。而且引入的变量必须大写 React，因为上边我们看到 babel 编译完 jsx 之后会寻找 React 变量。")])]),t._v(" "),a("blockquote",[a("p",[t._v("新版本中，不再需要引入 React 这个变量了。有兴趣的同学可以去看看打包后的 react 代码,内部会处理成为"),a("code",[t._v('Object(s.jsx)("div",{ children: "Hello" })')]),t._v("，而老的版本是"),a("code",[t._v("React.createElement('div',null,'Hello')")]),t._v("。")])]),t._v(" "),a("blockquote",[a("p",[t._v("这两种方式效果和原理是一模一样的，只是新版额外引入包去处理了引入。所以不需要单独进行引入 React。")])]),t._v(" "),a("ul",[a("li",[a("p",[t._v("React 之中 element 是构建 React 的最小单位,其实也就是虚拟 Dom 对象。")])]),t._v(" "),a("li",[a("p",[t._v("本质上 jsx 执行时就是在执行函数调用，是一种工厂模式通过 React.createElement 返回一个元素。")])]),t._v(" "),a("li",[a("p",[t._v("JSX 会先转换成 React.element，再转化成 React.fiber。")])])]),t._v(" "),a("h3",{attrs:{id:"react-createelement"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#react-createelement"}},[t._v("#")]),t._v(" React.createElement")]),t._v(" "),a("ul",[a("li",[t._v("React.createElement 用于生成虚拟 DOM 节点对象。")])]),t._v(" "),a("p",[t._v("在我们平常使用 react 项目的时候，index.tsx 中总是会存在这样一段代码:")]),t._v(" "),a("div",{staticClass:"language-js line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("ReactDOM"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("render")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("App "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" document"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getElementById")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"root"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("结合上边我们所讲的 React.createElement，我们不难猜出 ReactDOM.render 这个方法它的作用其实就是按照 React.createElement 生成的虚拟 DOM 节点对象，生成真实 DOM 插入到对应节点中去，这就是简单的渲染过程。")]),t._v(" "),a("ul",[a("li",[t._v("react 中元素本身是不可变的。会报错：无法给一个只读属性 children 进行赋值，修改其他属性比如 type 之类同理也是不可以的。")])]),t._v(" "),a("blockquote",[a("p",[t._v("not extensible 是 react17 之后才进行增加的。通过 Object.freeze()将对象进行处理元素。")])]),t._v(" "),a("blockquote",[a("p",[t._v("需要注意 Object.freeze()是一层浅冻结，在 react 内部进行了递归 Object.freeze()。")])]),t._v(" "),a("ul",[a("li",[a("p",[t._v("所以在 react 中元素本身是不可变的，当元素被创建后是无法修改的。只能通过重新创建一个新的元素来更新旧的元素。")])]),t._v(" "),a("li",[a("p",[t._v("你可以这样理解，在 react 中每一个元素类似于动画中的每一帧，都是不可以变得。")])])]),t._v(" "),a("h3",{attrs:{id:"react-cloneelement"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#react-cloneelement"}},[t._v("#")]),t._v(" React.cloneElement")]),t._v(" "),a("p",[t._v("createElement 把 jsx 变成 element 对象; 而 cloneElement 的作用是以 element 元素为样板克隆并返回新的 React element 元素。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。")]),t._v(" "),a("ul",[a("li",[t._v("Q:React.createElement 和 React.cloneElement 到底有什么区别呢?")]),t._v(" "),a("li",[t._v("A:可以完全理解为，一个是用来创建 element 。另一个是用来修改 element，并返回一个新的 React.element 对象。也就是用途不一样。")])]),t._v(" "),a("h3",{attrs:{id:"reactdom-render"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#reactdom-render"}},[t._v("#")]),t._v(" ReactDOM.render")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("ReactDOM.render 把接收到的 VDOM 变成真实元素插入到对应的根节点上。")])]),t._v(" "),a("li",[a("p",[t._v("明确一个思想: ReactDOM.render()方法仅仅支持传入一个 VDOM 对象和 el。他的作用就是将 VDOM 生成真实 DOM 挂载在 el 上。此时如果 VDOM 存在一些 children，那么 ReactDOM.render 会递归他的 children，将 children 生成的 DOM 节点挂载在 parentDom 上。一层一层去挂载。")])]),t._v(" "),a("li",[a("p",[t._v("在 React 中 class 组件因为继承自 React.component,所以 class 组件的原型上会存在一个 isReactComponent 属性。这个属性仅有类组件独有，函数组件是没有的，这就可以区分 class 组件和函数式组件。")])])]),t._v(" "),a("ol",[a("li",[t._v("对于 class 组件：\n"),a("ul",[a("li",[t._v("经过 babel 之后得到的 vdom 的形式和函数组件类似，但是可以通过 type.prototype.isReactComponent 区分出来；")]),t._v(" "),a("li",[t._v("然后将他的 render 方法返回的 Vdom 对象通过 createDom 方法转化为真实 Dom 节点来进行挂载。")]),t._v(" "),a("li",[a("code",[t._v("createDom(new type(props).render());")])])])]),t._v(" "),a("li",[t._v("对于函数组件 FC：\n"),a("ul",[a("li",[t._v("进入 ReactDOM.render 方法创建真实 DOM 时，在 createDom 时会判断传入的 vDom 的 type，发现是 FC 类型；")]),t._v(" "),a("li",[t._v("那么会传入自身 props 调用自身，运行这个函数组件后，得到 jsx，经过 babel 转化成对 React.createElement(FunctionCompoent,props,children)的调用，返回虚拟 DOM 对象；")]),t._v(" "),a("li",[t._v("拿到 vDom 对象后，通过之前的 createDom 方法将 vDom 转化成真实节点返回；")]),t._v(" "),a("li",[t._v("此时 render 方法就可以拿到对应生成的真实 DOM 对象，从而挂载在 DOM 元素上。")]),t._v(" "),a("li",[a("code",[t._v("createDom(type(props));")])])])]),t._v(" "),a("li",[t._v("对于文本节点：直接"),a("code",[t._v("dom = document.createTextNode(props.content);")]),t._v("；")]),t._v(" "),a("li",[t._v("对于原生 DOM 节点：直接"),a("code",[t._v("dom = document.createElement(type);")]),t._v("。")]),t._v(" "),a("li",[t._v("无论是 FC 还是 CC 这两种组件，内部本质上还是基于普通 DOM 节点的封装，所以我们只需要递归调用他们直接返回基本的 DOM 节点之后进行挂载就 OK.")])]),t._v(" "),a("blockquote",[a("p",[t._v("本质上还是通过递归调用 createDOM 进行判断，如果是函数那么就运行函数的到返回的 vDOM，然后在通过 createDom 将 vDom 转化为对应的真实 DOM 挂载。")])]),t._v(" "),a("blockquote",[a("p",[t._v("从这里也可以看出为什么 React 中返回的 jsx 必须要求最外层元素需要一个包裹元素。")])]),t._v(" "),a("h3",{attrs:{id:"相对于普通-dom-节点。纯函数组件的不同点"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#相对于普通-dom-节点。纯函数组件的不同点"}},[t._v("#")]),t._v(" 相对于普通 dom 节点。纯函数组件的不同点:")]),t._v(" "),a("ol",[a("li",[t._v("$$typeof 为 Symbol(react.element)表示这个元素节点的类型是一个纯函数组件。")]),t._v(" "),a("li",[t._v("经过 babel 编译后的 VDOM，在原生 dom 节点中，type 类型为对应的标签类型字符串。而当为纯函数组件时。type 类型为函数自身。")])]),t._v(" "),a("h3",{attrs:{id:"核心思想总结"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#核心思想总结"}},[t._v("#")]),t._v(" 核心思想总结")]),t._v(" "),a("ol",[a("li",[t._v("createDom 如果传入的是一个普通节点，那么就直接根据对应 type 创建标签。")]),t._v(" "),a("li",[t._v("createDom 如果传入的是一个函数组件，那么就调用这个函数组件得到它返回的 vDom 节点，然后在通过 createDom 将 vDom 渲染成为真实节点。")]),t._v(" "),a("li",[t._v("createDom 如果传入的是一个 class 组件，那么就 new Class(props).render()得到返回的 vDom 对象，然后在将返回的 vDom 渲染成为真实 Dom。")])]),t._v(" "),a("h3",{attrs:{id:"自定义组件必须大写的原因"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#自定义组件必须大写的原因"}},[t._v("#")]),t._v(" 自定义组件必须大写的原因:")]),t._v(" "),a("p",[t._v("babel 在编译的过程中会判断 JSX 组件的首字母, 如果是小写, 则为原生 DOM 标签, 就编译成字符串. 如果是大写, 则认为是自定义组件. 编译成对象.")]),t._v(" "),a("h3",{attrs:{id:"在项目中使用-babel"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在项目中使用-babel"}},[t._v("#")]),t._v(" 在项目中使用 babel")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://mp.weixin.qq.com/s/qCJXhfd5ZBkpqV4bs_nY6w",target:"_blank",rel:"nofollow noopener noreferrer"}},[t._v("参考"),a("OutboundLink")],1)])])}),[],!1,null,null,null);s.default=n.exports}}]);