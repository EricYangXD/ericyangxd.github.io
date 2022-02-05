---
title: 记录一些开发中的小技巧
author: EricYangXD
date: "2021-12-29"
---

## 快速复制一个代码运行中生成的超大变量并保存到本地

1. 在代码里先 console.log($this_variable);
2. 在控制台找到打印出来的$this_variable，在它上面「点击右键」->「Store as global variable」;
3. 在控制台会自动输出一个类似「temp1」的内容，然后在控制台输入「copy(temp1)」，然后新建一个文件「Control+C」即可把该对象复制出来。
4. 该方法支持小程序开发者工具！

## 用户登录加密

```js
import JSEncrypt from "jsencrypt";
// 公钥
const cloudPublicKey = `abcdefg`;

const encrypt = (value, publicKey = cloudPublicKey) => {
	const jsEncrypt = new JSEncrypt({});
	jsEncrypt.setPublicKey(publicKey);
	return jsEncrypt.encrypt(value);
};

export default encrypt;

// 使用的时候
const enUsername = encrypt("username");
```

## 代码风格检查&license 声明添加

-   利用 git hook

-   使用 husky<5.0，>5.0 参考[这里](https://zhuanlan.zhihu.com/p/366786798)。安装后，可以很方便的在 package.json 配置 git hook 脚本，如下：

1. package.json

```json
{
	"scripts": {
		"prestart": "node config/fix-sls-offline.js",
		"lint:eslint": "eslint --ignore-path .gitignore --ignore-pattern 'src/components/xxxx' --ignore-pattern src/assets/**/*.js",
		"lint:license": "node ./config/license"
	},
	"husky": {
		"hooks": {
			"pre-commit": "lint-staged", // 在后续的每一次git commit 之前，都会执行一次对应的 hook 脚本npm run lint 。其他hook同理
			"commit-msg": "commitlint -E HUSKY_GIT_PARAMS" // 检查Git commit内容
		}
	},
	"lint-staged": {
		// 只检查staged状态的代码，lint-staged是个库，需要安装在devDependencies中
		"*.{js,ts,tsx}": [
			// 只对js,ts,tsx文件进行校验
			"npm run lint:eslint",
			"npm run lint:license"
		]
	}
}
```

2. .eslintrc.js 配置

```js
module.exports = {
	parser: "@typescript-eslint/parser",
	// extends: ['xxxx', 'prettier'],
	plugins: ["@typescript-eslint", "prettier"],
	// ignorePatterns: ['/src/components/xxxx/*'],
	env: {
		browser: true,
		node: true,
		commonjs: true,
	},
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: "module",
		ecmaFeatures: {
			modules: true,
			jsx: true,
		},
	},
	rules: {
		"import/extensions": 0,
		"import/no-unresolved": 0,
		"react/prop-types": 0,
		"jsx-a11y/click-events-have-key-events": 0,
		"jsx-a11y/no-noninteractive-element-interactions": 0,
		"jsx-a11y/no-static-element-interactions": 0,
		"jsx-a11y/anchor-is-valid": 0,
		"no-underscore-dangle": 0,
		"jsx-a11y/label-has-associated-control": 0,
		"jsx-a11y/label-has-for": 0,
	},
	settings: {
		react: {
			pragma: "React",
			version: "detect",
		},
		"import/resolver": {
			webpack: {
				config: "./webpack.dev.config.js",
			},
		},
	},
};
```

3. license.js 配置

```js
const path = require("path");
const gulp = require("gulp");
const licenser = require("gulp-licenser");

// license 模板
const LICENSE_TEMPLATE =
	"/** Copyright © 1992-2021 YXD, All Rights Reserved. */";

// 从参数中获取文件列表，配合lint-stage使用
const files = process.argv.slice(2); // node license [files]

// 默认全量自定义文件
const defaultFiles = [
	"src/*.js",
	"src/*.ts",
	"src/*.tsx",
	"src/**/*.js",
	"src/**/*.ts",
	"src/**/*.tsx",
	"framework/**/*.js",
	"framework/**/*.ts",
	"framework/**/*.tsx",
	"config/**/*.js",
	"packages/**/*.js",
	"packages/**/*.ts",
	"packages/**/*.tsx",
	"*.js",
];

// 处理source，拼接绝对路径
const source =
	files.length > 0
		? files
		: defaultFiles.map((item) => path.resolve(process.cwd(), item));

// 检查是否有license并自动加上
function updateLicense() {
	gulp.src(source)
		.pipe(licenser(LICENSE_TEMPLATE))
		.pipe(gulp.dest((file) => file.base));
}

updateLicense();
```

4. .prettierrc

```json
{
	"printWidth": 80,
	"tabWidth": 2,
	"useTabs": false,
	"semi": true,
	"singleQuote": true,
	"trailingComma": "es5",
	"arrowParens": "always"
}
```

5. commitlint.config.js

```js
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"build",
				"ci",
				"chore",
				"docs",
				"feat",
				"fix",
				"perf",
				"refactor",
				"revert",
				"style",
				"test",
				"merge",
			],
		],
		"subject-case": [0],
	},
};
```

## npx husky install

-   fix-sls-offline.js 文件用于判断修复 serverless 离线 bug？？？

```js
const fs = require("fs");
const LINE_NUMBER = 6;
const FILE_LOCATION = "node_modules/hapi/lib/defaults.js";
const INJECT_FIX_STRING = `
var isWin = process.platform === "win32";
var isLinux = process.platform === "linux";
var isDarwin = process.platform === "darwin";
if (isDarwin || isLinux) {
  Os.tmpDir = Os.tmpdir;
} else if (isWin) {
   Os.tmpDir = os.tmpDir;
}
`;

let data = fs.readFileSync(FILE_LOCATION);
if (data.includes(INJECT_FIX_STRING)) {
	console.log("Skipping fix injection, already exists.");
} else {
	data = data.toString().split("\n");
	data.splice(LINE_NUMBER, 0, INJECT_FIX_STRING);
	let text = data.join("\n");

	fs.writeFile(FILE_LOCATION, text, (err) => {
		if (err) {
			return console.log(err);
		} else {
			return console.log("Injected fix successfully");
		}
	});
}
```

-   原理：
-   在安装 husky 的时候，husky 会根据 package.json 里的配置，在.git/hooks 目录生成所有的 hook 脚本（如果你已经自定义了一个 hook 脚本，husky 不会覆盖它）

1. husky 使用了自定义的安装过程：node lib/installer/bin install（在 node_modules/husky/package.json 里）。执行的时会在项目的.git/hooks 目录生成所有 hook 的脚本

2. 这些脚本除了文件名之外，别的都一摸一样，包括内容：比如 Mac 上就都长下面这样：

```bash
#!/bin/sh
# husky

# Created by Husky v4.2.5 (https://github.com/typicode/husky#readme)
#   At: 7/5/2021, 1:31:56 PM
#   From: /Users/EricYangXD/test/husky-test/node_modules/husky (https://github.com/typicode/husky#readme)

. "$(dirname "$0")/husky.sh"
```

3. 最后根据 package.json 的配置，执行我们定义相对应的 hook 脚本。

## 启动一个本地 mock server

1. 在 webpack.base.config.js:

```js
const mockServer = require('./mock_server/index');
const isMock = process.env.MOCK_ENV === 'mock'; // 配置在package.json的script中
devServer: {
    ...
    before: app => {
      if (isMock) {
        mockServer(app);
      }
    },
    ...
  },
```

2. mock_server/index.js:

```js
const cloud = require("./cloud");
const mock = require("./mock");

module.exports = (app) => {
	app.use("/cloud", cloud);
	app.use("/mock", mock);
};
```

3. mock.js

```js
const express = require('express');
const router = express.Router();
// mock api url
router.get('/news/list', (req, res) => {
  res.json({...});
});
...
module.exports = router;
```

## 启动一个本地文件上传 mock server

[参考](https://github.com/EricYangXD/upload-file-server)

下载启动之后，自己配置上传的 URL 即可

## 断点调试

Debugger 打断点的方式除了直接在对应代码行单击的普通断点以外，还有很多根据不同的情况来添加断点的方式。

一共有六种：

1. 普通断点：运行到该处就断住
2. 条件断点：运行到该处且表达式为真就断住，比普通断点更灵活
3. DOM 断点：DOM 的子树变动、属性变动、节点删除时断住，可以用来调试引起 DOM 变化的代码
4. URL 断点：URL 匹配某个模式的时候断住，可以用来调试请求相关代码
5. Event Listener 断点：触发某个事件监听器的时候断住，可以用来调试事件相关代码
6. 异常断点：抛出异常被捕获或者未被捕获的时候断住，可以用来调试发生异常的代码

这些打断点方式大部分都是 Chrome Devtools 支持的（普通、条件、DOM、URL、Event Listener），也有的是 VSCode Debugger 支持的（普通、条件、异常）。

## 常用 node 工具

### nvm

1. 官方`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`命令不好使
2. 使用 gitee，执行并重新打开 zsh 即可
   `cd ~/ git clone https://gitee.com/Annlix/nvm-sh_nvm.git .nvm`

### yrm/nrm

`npm i yrm -g`

### pm2

PM2 是 node 进程管理工具，可以利用它来简化很多 node 应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。

`npm install -g pm2`

### nodemon

nodemon 是 node 的一个调试工具。当我们修改了后台 node 服务器的代码之后，都需要重启 node 服务器。我们可以使用 nodemon 来自动重启服务。
`npm install -g nodemon`

### npm/yarn/pnpm

1. npm 是 nodejs 自带的
2. `brew install yarn`
3. `npm install -g pnpm`

### ni

自动依赖安装，不用管 npm/yarn/pnpm.

`npm i ni -g`
