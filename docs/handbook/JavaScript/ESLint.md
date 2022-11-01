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
4. eslint 的`.eslintrc.js`配置 env 中不加上`node: true`的话，关于`module.exports`的代码，会显示报错，但实际上写得没有问题，只是 eslint 的问题。加上配置即可。
5.

#### 配置`.eslintrc.js`文件

1.  rules:可以配置 quotes、semi、no-console、等，其中 value：0 是忽略，1 是警告，2 是报错

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
3.
