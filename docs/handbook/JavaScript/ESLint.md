---
title: ESLint + Prettier
author: EricYangXD
date: "2022-11-01"
meta:
  - name: keywords
    content: eslint
---

## ESLint + Prettier

eslint 可以保证项目的质量，prettier 可以保证项目的统一格式、风格。

## use eslint

1. 自动创建：`npm init @eslint/config`根据提示选择相应配置
2. 手动创建：
   1. 在项目中安装：`npm install eslint --save-dev`
   2. 使用 eslint 创建一个配置文件：`./node_modules/.bin/eslint --init`
   3. 然后在配置文件 .eslintrc.js 中 `extends:"eslint:recommended"` 就可以使用 ESLint 官方推荐的规则，也是非常方便的。也可以自定义需要的规则：
      ```js
      module.exports = {
      	rules: {
      		semi: ["error", "always"],
      		quotes: ["error", "double"],
      	},
      };
      ```
   4. 使用 eslint 去校验文件：`./node_modules/.bin/eslint 文件路径/文件名.js`

在平时项目开发中有两种方式去快速修复 ESLint 问题：

- 命令行里运行 eslint 检查代码文件的同时加上 `--fix`
- 在 VSCode 里安装 eslint 插件，进入项目 vscode 会自动检测项目的 eslint 配置文件 .eslintrc ，然后点击 allow 表示同意 eslint 作为默认的 formate 代码的配置。最后就可以愉快的使用 `format on save` 或者 `option+shift+F` 自动格式化了。

### 先有 npm 包，再有 vscode 插件

1. 用法：先`npm init -y`，初始化包。
2. 然后全局安装 eslint: `npm i eslint -g`。
3. 再`npx eslint --init`，接着会出现几个选择，选择适合的配置。
4. 选完之后会自动下载 eslint 包，并在项目的根目录自动创建`.eslintrc.js`文件。
5. 执行：`eslint index.js`，即可对文件进行格式检测。若果想自定义格式风格，则需要配置`.eslintrc.js`文件。
6. 修复：`eslint index.js --fix`，可以根据配置的风格修复文件。会修改原文件。全部校验并修复`eslint . --fix`。

#### eslint 的 vscode 插件

1. 写代码的时候就能直接看到错误，然后就能直接随手改正错误。此时要对插件自定义配置的话需要修改 vscode 的`settings.json`。
2. 虽然 vscode 插件也可以单独配置格式，但是如果项目中有`.eslintrc.js`文件，那么 eslint 插件会优先执行`.eslintrc.js`文件的配置。并且不是每个人都会装 eslint 的 vscode 插件。此时 eslint 的 npm 包就作为一个保障，并且里面的`.eslintrc.js`配置就作为标准配置。
3. 装 vscode 插件只是为了方便自己开发而已。

#### 配置`.eslintrc.js`文件

1.  rules:可以配置 quotes、semi、no-console、等，其中 value：0 是忽略，1 是警告，2 是报错
2.  使用单独 Eslint **配置文件的形式**来整合你的相关配置，支持 JavaScript、JSON 或者 YAML 文件三种格式（.eslintrc.\*），当然也可以直接将配置写入项目的 package.json 中。在调用 EsLint 命令时，Eslint 会自动寻找对应的配置文件。
3.  在 JavaScript 代码中直接使用 JS **注释的形式**将配置嵌入原代码中。
4.  同时在 EsLint 中配置文件也支持向上查找的方式（层叠配置），层叠配置使用离要检测的文件最近的 .eslintrc 文件作为最高优先级，然后才是父目录里的配置文件。也就是说默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直找到根目录--即配置是会继承的。
5.  当寻找到项目根目录的 eslintrc.js 时，我们希望它停止向上查找。那么此时 Eslint 的配置文件也支持设置 `root: true` 的选项来停止这种层叠配置的查找机制。
6.  eslint 的`.eslintrc.js`配置 env 中不加上`node: true`的话，关于`module.exports`的代码，会显示报错，但实际上写得没有问题，只是 eslint 的问题。加上配置即可。需要额外强调的是这里 env 中的 es6 和 parserOptions 中的 ecmaScript 区别：
    - parserOptions 中的 ecmaScript 设置时（如果为 6 或者更高版本），仅表示 Lint 在检查时支持一些高版本的语法。比如 let、const、箭头函数等等。
    - env 中的 es6 开启时，表示允许代码中使用高版本语法的 Api 比如：Promise、Set、Map 等全局相关模块。当然开启 `env: {es6:true}` 相当于同时设置了`ecmaVersion: 6`。
7.  接上，EsLint 支持任何类型的 JavaScript 语言选项（比如 ES6、模块类型等等），默认不进行任何配置时 EsLint **默认检测规则为 ES5 代码**，通过配置中的 ParserOptions 选项来进行语言选项设置：

```js
parserOptions: { // 表示 EsLint 对于不同的 Parser（解析器）配置的语言检查规则。
	env: { // 设置环境变量支持，从而支持一组通用的全局变量，比如window/document/global...
		browser: true,
		node: true,
		es6: true,
		'shared-node-browser': true, // 表示可以使用 Node 环境和浏览器环境下同时存在的全局变量，比如 console 相关。
	},
	ecmaVersion: 6, // 指定 EsLint 支持 ECMAScript 6 的语法检测，latest 表示最新的 ECMA 版本。
	ecmaFeatures: { // 表示代码中可以使用的额外语言特性
		jsx: true, // 允许 js 代码中使用 jsx
		globalReturn: true, // 允许顶层 return
		impliedStrict: true, // 启用全局严格模式。（ES 5以上有效）
	},
	sourceType: "module", // 表示应用代码中支持的模块规范，默认为 script。支持 script 和 module (ESM) 两种配置。
	parser: "@typescript-eslint/parser", // 表示 Eslint 在解析代码时使用到的解析器。
	// parser: 'espree', // 使用默认 espree 解析器
	rules: {
    'no-unused-vars': ['error'], // 定义规则禁止声明未使用的变量
		quotes: ['error', 'single', { allowTemplateLiterals: true }],
		'no-console': [1], // 对于 console 进行警告检测
		'@typescript-eslint/array-type': 2, // 插件提供的补充规则
  },
	// 通过 globals 定义额外的全局变量
  globals: {
    iamok: true,
  },
	plugins:[
		'@typescript-eslint/eslint-plugin',
		"a-plugin", // processor例
		], // 插件提供除内置的规则以外的校验规则，引入插件之后还需要手动在rules中声明对应的规则才会生效
	// 别人配好的规则组合，我们直接拿来用即可，比如官方的、Airbnb的、Angular的等等
	extends: [
		// 直接从 EsLint 本身集成的规则继承
    "eslint:recommended",
    // 从一些第三方NPM包进行继承，比如 eslint-config-standard、eslint-config-airbnb
    // eslint-config-* 中 eslint-config- 可以省略
    "airbnb",
		// 直接从插件继承规则，可以省略包名中的 `eslint-plugin`
		// 通常格式为 `plugin:${pluginName}/${configName}`
		"plugin:@typescript-eslint/recommended",
	],
	overrides: [
    // *.test.js 以及 *.spec.js 结尾的文件特殊定义某些规则
    {
      files: ['*-test.js', '*.spec.js'],
      rules: {
        'no-unused-expressions': 2,
      },
    },
		{
		// 针对于 .md 结尾的文件使用 a-plugin 的 processor 进行处理
			"files": ["*.md"],
			"processor": "a-plugin/markdown"
		},
		{
		// 上述提到过本质上会将 .md 文件通过 processor 转化为一个个具名的代码块
			"files": ["**/*.md/*.js"],
			"rules": {
				"strict": "off"
			}
		}
  ],
	"processor": "a-plugin/a-processor", // 由插件名和处理器名组成的串接字符串加上斜杠，代表启用插件 a-plugin 提供的处理器 a-processor
},
```

1. ESLint 默认情况下使用 Espree 作为其解析器，当然我们也可以传入一些自定义的解析器。比如：Esprima、@typescript-eslint/parser 等等。Parser 选项简单来说就是表示我们以何种解析器来转译我们的代码。本质上，所有的解析器最终都需要讲代码转化为 espree 格式从而交给 Eslint 来检测。
2. 在 Typescript 中我们可以通过 `*.d.ts` 声明文件来解决 Ts 对于自定义全局变量的支持。在 Eslint 同样，我们可以在配置文件中通过 globals 选项来支持自定义的全局变量。目的是在一个源文件里使用某些全局变量，同时避免 EsLint 发出错误`no-undef `警告。globals 中的值还支持：
   - "writable"或者 true，表示变量可重写；
   - "readonly"或者 false，表示变量不可重写；
   - "off"，表示禁用该全局变量。
3. 对于 rules：

   - "off" 或 0 表示关闭本条规则检测
   - "warn" 或 1 表示开启规则检测，使用警告级别的错误：warn (不会导致程序退出)
   - "error" 或 2 表示开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)、

4. 在 rules 对象中，通常 key 为规则的名称，比如上述的 `no-console` 代表具体的规则名称，而 value 可以为一个数组。数组第一个项代表规则 ID ，通过 `0 1 2` 或者 `off warn error` 表示检测的等级，而其余参数代表规则的具体配置。
5. Rules 除了定义一些额外的规则配置的同时也支持在层叠配置下的覆盖（扩展）规则。

   1. 改变继承的规则级别而不改变它的配置选项
   2. 覆盖基础配置中的规则的选项

6. 在某些特定条件下，内置的一些规则并不能满足我们的代码检查。所以此时我们就要基于该情况做一些特殊的拓展了，Plugin 的作用正是处理这些功能而生。通常在使用 Eslint 来检查代码时，需要将解析器替换为 `@typescript-eslint/parser` 的同时针对于一些 TypeScript 特定语法还需使用 `@typescript-eslint/eslint-plugin` 来支持一些特定的 TS 语法检查。当我们在 Plugins 中声明对应的插件后，就可以在 rules 配置中使用对应插件中声明的特殊规则限制了。
7. 简单来说，所谓的 Plugin 正是对于 EsLint 内置规则的拓展，通过 Plugin 机制我们可以实现 EsLint 中自定义的 Rules。
8. 利用 EsLint 中的 Extends 关键字来继承一些通用的配置。Extends 关键字可以理解为关于 Plugins 和 Rules 结合而来的最佳实践。简单来说就是在项目内继承于另一份 EsLint 配置文件而已。
9. 关于 Rules 中的覆盖规则其实是完全和 config File 的层叠配置是完全一致的。
   1. 改变继承的规则级别而不改变它的配置选项
   2. 覆盖基础配置中的规则的选项
10. 针对不同的文件进行不同的 Lint 配置，使用 Overrides 选项来解决这个问题。还可以配置更多的规则，比如 excludedFiles、parser、parserOptioons 等等。
11. 通常我们在编写 EsLint 插件时，如果是针对于非 Js 文件的话可以单独使用一个 Processor 来处理，处理器可以从另一种文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码。或者处理器可以在预处理中转换 JavaScript 代码。比如一个 .vue 文件中，并不单纯的由 JavaScript 组成。
12. 简单来说处理器的原理是将我们的非 JS 文件经过处理成为一个一个具名的代码块，最终在将这些处理后的 js 文件当作原始文件的子文件交给 EsLint 处理。
13. 快速生成 EsLint 插件模板：`npm i generator-eslint`，运行`js yo eslint:plugin`来快速创建一个 Plugin 模板。

### Prettier

1. eslint 只能作用于 js 文件，像 html，css，json，vue 文件，eslint 都处理不了他们的代码格式的问题。此时 prettier 认为代码的格式也很重要，于是 prettier 诞生了。
2. 下载 prettier：`npm i prettier -D`，然后执行`npx prettier --write index.js`，代码全部都变得工工整整了。
3. 自定义代码格式配置，在项目的根目录创建`.prettierrc.js`文件。（如果是`.prettierrc`文件，则是 json 类型，要按 json 格式来配置）。
4. eslint 和 prettier 的配置要统一，不能冲突。
5. 冲突时，要么把 eslint 插件的自动保存配置删除了，只要 prettier 的自动保存。因为 eslint 代码保存自动格式化这块的配置和 prettier 重叠了，直接让 prettier 来自动保存就行了。不过 eslint 和 prettier 的配置也要保持一致。不想关闭 eslint 的自动保存也行，只要`.eslintrc.js`的配置和`.prettierrc.js`的配置严格一致就行了。

#### prettier 的 vscode 插件

1. 自动格式化代码，而不需要每次执行`npx prettier --write .`才会修改格式。
2. 配置一下 prettier 自动保存，对不同格式的文件可以配置不同的格式化插件。

```json
  //settings.json文件
  "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
```

3. eslint 是做 js 的代码格式化的，但是扩展性很强，包括变量是否使用，是否要`console.log`。而 prettier 是做所有代码的格式化，并且只专注于格式化，范围更广。
4. vscode 的插件可以单独配置，单独起作用。但是如果项目根目录中有`.eslintrc.js`和`.prettierrc.js`文件，则以`.eslintrc.js`和`.prettierrc.js`的配置为标准，执行它们的配置。
5. prettier 的效果在 eslint 的效果之后，如果配置冲突了，则 prettier 会覆盖 eslint 的配置。

### eslint-plugin-prettier

eslint 和 prettier 重合的规则有很多，如果需要每个都配置一样的话，就会很繁琐，所有 eslint 出了一个`eslint-plugin-prettier`的东西，是把 prettier 当作 eslint 的一个插件，重合的部分按照 prettier 的规则来。

#### 配置

1. eslint 有 extends 和 plugins 两个配置。plugins 要引入对应的插件模块，然后配置相对应的规则 rules 才会生效。而 extends 是已经配置好的规则，后面的 extends 会覆盖前面的 extends。
2. `npm i eslint @vue/eslint-config-prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue prettier -D`
3. eg. 对于`eslint-plugin-vue`，如果已经使用了另外的解析器（例如`"parser": "@typescript-eslint/parser"`），则需要将其移至`parseOptions`，这样才不会与`vue-eslint-parser`冲突。
4. 两个 parser 的区别在于，外面的 parser 用来解析`.vue`后缀文件，使得 eslint 能解析`<template>`标签中的内容，而`parserOptions`中的 parser，即`@typescript-eslint/parser`用来解析 vue 文件中`<script>`标签中的代码。

```js
//.eslintrc.js
module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		"@vue/prettier",
		"plugin:@typescript-eslint/recommended",
		// 新增，必须放在最后面
		"plugin:prettier/recommended",
	],
	parser: "vue-eslint-parser", // 1
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		parser: "@typescript-eslint/parser", // 2
	},
	rules: {
		"prettier/prettier": "error",
	},
	globals: {
		defineProps: "readonly",
		defineEmits: "readonly",
		defineComponent: "readonly",
		defineExpose: "readonly",
		ElMessage: "readonly",
		ElNotification: "readonly",
		ElMessageBox: "readonly",
	},
};
```

5. eg.

```js
//.prettierrc.js
module.exports = {
	arrowParens: "avoid",
	endOfLine: "auto",
	// 一行的字符数，如果超过会进行换行，默认为80
	printWidth: 80,
	// 一个tab代表几个空格数，默认为80
	tabWidth: 2,
	// 是否使用tab进行缩进，默认为false，表示用空格进行缩减
	useTabs: false,
	// 字符串是否使用单引号，默认为false，使用双引号
	singleQuote: true,
	// 行位是否使用分号，默认为true
	semi: false,
	// 是否使用尾逗号，有三个可选值"<none|es5|all>"
	trailingComma: "none",
	// 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
	bracketSpacing: true,
};
```

6. 每次修改完规则后，都需要重启 vscode 才会生效。
7. `eslint-plugin-prettier`: 自动将 prettier 规则覆盖 eslint 冲突规则，不需要自己手动改
8. 在 package.json 文件中的 script 中添加 lint 命令：

```json
{
	"scripts": {
		// eslint . 为指定lint当前项目中的文件
		// --ext 为指定lint哪些后缀的文件
		// --fix 开启自动修复
		"lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
		"format": "prettier --write \"./**/*.{html,vue,ts,js,json,less,sass,scss}\"",
		"lint:style": "stylelint \"./**/*.{css,less,vue,html,scss,styl,sass,jsx}\" --fix"
	}
}
```

9. 在`.vscode/settings.json`中添加规则

```json
{
	// 开启自动修复
	"editor.codeActionsOnSave": {
		"source.fixAll": false,
		"source.fixAll.eslint": true,
		"source.fixAll.stylelint": true
	},
	// 保存的时候自动格式化
	"editor.formatOnSave": true,
	// 默认格式化工具选择prettier
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"stylelint.validate": ["css", "less", "vue", "html"]
}
```

## 解决 eslint 与 prettier 的冲突

社区已经为我们提供了一个非常成熟的方案，即`eslint-config-prettier` + `eslint-plugin-prettier`。

- `eslint-plugin-prettier`： 基于 prettier 代码风格的 eslint 规则，即 eslint 使用 pretter 规则来格式化代码。
- `eslint-config-prettier`： 禁用所有与格式相关的 eslint 规则，解决 prettier 与 eslint 规则冲突，确保将其放在 extends 队列最后，这样它将覆盖其他配置。

## stylelint

stylelint 为 css 的 lint 工具。可格式化 css 代码，检查 css 语法错误与不合理的写法，指定 css 书写顺序等。配置[参考](https://juejin.cn/post/7118294114734440455)

### 安装 vscode 的 Stylelint 插件

安装该插件可在我们保存代码时自动执行 stylelint，添加规则参考上 9`.vscode/settings.json`

## husky

1. 引入强制的手段来保证提交到 git 仓库的代码是符合要求的。husky 是一个用来管理 git hook 的工具，git hook 即在我们使用 git 提交代码的过程中会触发的钩子。

2. 在 package.json 中的 scripts 中添加一条脚本命令：`"prepare": "husky install"`，该命令会在`npm install`之后运行，这样其他克隆该项目的同学就在装包的时候就会自动执行该命令来安装 husky。

3. 执行`npm install`，然后执行`npm run prepare`，这个时候你会发现多了一个`.husky`目录。
4. 使用 husky 命令添加 pre-commit 钩子，运行:`npx husky add .husky/pre-commit "npm run lint && npm run format && npm run lint:style"`，会在`.husky`目录下生成一个`pre-commit`文件。
5. 现在当我们执行`git commit`的时候就会执行`npm run lint`与`npm run format`，当这两条命令出现报错，就不会提交成功。以此来保证提交代码的质量和格式。

## Eslint 的实现原理

### Linter

1. Linter 是 eslint 最核心的类了，它提供了这几个 api：

   - verify // 检查
   - verifyAndFix // 检查并修复
   - getSourceCode // 获取 AST
   - defineParser // 定义 Parser
   - defineRule // 定义 Rule
   - getRules // 获取所有的 Rule

2. SourceCode 就是指的 AST（抽象语法树），Parser 是把源码字符串解析成 AST 的，而 Rule 则是我们配置的那些对 AST 进行检查的规则。
3. Linter 主要的功能是在 verify 和 verifyAndFix 里实现的，当命令行指定 `--fix` 或者配置文件指定 `fix: true` 就会调用 verifyAndFix 对代码进行检查并修复，否则会调用 verify 来进行检查。

### verify 和 fix 是怎么实现的

这就是 eslint 最核心的部分。

1. 确定 parser

   - Eslint 的 rule 是基于 AST 进行检查的，那就要先把源码 parse 成 AST。而 eslint 的 parser 也是可以切换的，需要先找到用啥 parser：默认是 Eslint 自带的 `espree`，也可以通过配置来切换成别的 parser，比如 `@eslint/babel-parser`、`@typescript/eslint-parser` 等。

2. parse 成 SourceCode

   - parser 的 parse 方法会把源码解析为 AST，在 eslint 里是通过 SourceCode 来封装 AST 的。后面看到 SourceCode 就是指 AST.

3. 调用 rule 对 SourceCode 进行检查，获得 lintingProblems

   - parse 之后，会调用 runRules 方法对 AST 进行检查，返回结果就是 problems，也就是有什么错误和怎么修复的信息。
   - rule 的实现，就是注册了对什么 AST 做什么检查，这点和 babel 插件很类似。
   - runRules 会遍历 AST，然后遇到不同的 AST 会 emit 不同的事件。rule 里处理什么 AST 就会监听什么事件，这样通过事件监听的方式，就可以在遍历 AST 的过程中，执行不同的 rule 了。

4. 注册 listener -> 遍历 AST，emit 不同的事件，触发 listener -> 遍历完一遍 AST，也就调用了所有的 rules，这就是 rule 的运行机制。
5. 遍历的过程中会传入 context，rule 里可以拿到，比如 scope、settings 等。
6. 调用 AST 的 listener 的时候可以拿到 ruleContext，而 rule 里面就是通过这个 report 的 api 进行报错的，那这样就可以把所有的错误收集起来，然后进行打印。
7. linting problem:int problem 是检查的结果，也就是从哪一行（line）哪一列（column）到哪一行（endLine）哪一列（endColumn），有什么错误（message）。还有就是怎么修复（fix），修复其实就是 从那个下标到哪个下标（range），替换成什么文本（text）。
8. fix 的实现就是简单的字符串替换。通过返回的 range 和 text 字段。
9. 通过字符串替换实现自动 fix。遍历完 AST，调用了所有的 rules，收集到了 linting problems 之后，就可以进行 fix 了。也就是 verify 进行检查，然后根据 fix 信息自动 fix。fix 其实就是个字符串替换。
10. 字符串替换为什么要加个 while 循环呢？因为多个 fix 之间的 range 也就是替换的范围可能是有重叠的，如果有重叠就放到下一次来修复，这样 while 循环最多修复 10 次，如果还有 fix 没修复就不修了。这就是 fix 的实现原理，通过字符串替换来实现的，如果有重叠就循环来 fix。
11. Eslint 还支持之前和之后做一些处理。也就是 pre 和 post 的 process，这些也是在插件里定义的。preprocess 和 postprocess。在 verify 之前和之后调用就行。
12. preprocess 的处理是把非 js 文件解析出其中的一个个 js 文件来，这和 webpack 的 loader 很像，这使得 Eslint 可以处理非 JS 文件的 lint。postprocess 的处理是处理 problems ，也就是 messages，可以过滤掉一些 messages，或者做一些修改之类的。
13. 通过 comment directives 来过滤掉一些 problems。eslint 还支持通过注释来配置，比如 `/* eslint-disable */`、`/*eslint-enable*/` 这种。实现：注释的配置是通过扫描 AST 来收集所有的配置的，这种配置叫做 commentDirective，也就是哪行那列 Eslint 是否生效。然后在 verify 结束的时候，对收集到的 linting problems 做一次过滤即可。
14. 总体的流程：`preprocess，把非 js 文本处理成 js` -> `确定 parser（默认是 espree）` -> `parse 成 SourceCode` -> `调用 rule 对 SourceCode 进行检查，获得 lintingProblems` -> `扫描出注释中的 directives，对 problems 进行过滤(通过 comment directives 来过滤掉一些 problems)` -> `postprocess，对 problems 做一次处理` -> `通过字符串替换实现自动 fix`。

### Eslint 和 CLIEngine 类

1. 在命令行的场景下还需要处理一些命令行参数，也就需要再包装一层 CLIEngine，用来做文件的读写，命令行参数的解析。它有 `executeOnFiles` 和 `executeOnText` 等 api，是基于 Linter 类的上层封装。但是 CLIEngine 并没有直接暴露出去，而是又包装了一层 EsLint 类。
2. eslint 最终暴露出来的这几个 api：
   - Linter 是核心的类，直接对文本进行 lint
   - ESLint 是处理配置、读写文件等，然后调用 Linter 进行 lint（中间的那层 CLIEngine 并没有暴露出来）
   - SourceCode 就是封装 AST 用的
   - RuleTester 是用于 rule 测试的一些 api。
