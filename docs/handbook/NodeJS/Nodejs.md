---
title: Node.js
author: EricYangXD
date: "2022-02-23"
---

## 记录 nodejs 知识

### npx

npx 想要解决的主要问题:

1.  就是「**调用项目内部安装的模块**」。
2.  npx 还能「**避免全局安装的模块**」。

#### 调用项目内部安装的模块

1. 比如，项目内部安装了测试工具 Mocha。`npm install -D mocha`
2. 一般来说，调用 Mocha ，只能在项目脚本和 package.json 的 scripts 字段里面， 如果想在命令行下调用，必须像下面这样。`node-modules/.bin/mocha --version`
3. 通过 npx 调用就会很简单：`npx mocha --version`
4. npx 的原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。
5. 由于 npx 会检查环境变量`$PATH`，所以系统命令也可以调用。`npx ls`
6. 注意，Bash 内置的命令不在`$PATH`里面，所以不能用。比如，cd 是 Bash 命令，因此就不能用`npx cd`。

#### 避免全局安装的模块

-   npx 可以运行某些模块/脚手架工具，而且不进行全局安装。`npx create-react-app my-react-app`
-   npx 将`create-react-app`下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载`create-react-app`。只要 npx 后面的模块无法在本地发现，就会下载同名模块。
-   下载全局模块时，npx 允许指定版本。`npx uglify-js@3.1.0 main.js -o ./dist/main.js`

### require 工作原理

-   require 方法

```js
Module.prototype.require = function (id) {
	if (typeof id !== "string") {
		throw new ERR_INVALID_ARG_TYPE("id", "string", id);
	}
	if (id === "") {
		throw new ERR_INVALID_ARG_VALUE("id", id, "must be a non-empty string");
	}
	return Module._load(id, this, /* isMain */ false);
};
```

-   \_load 方法

```js
Module._load = function (request, parent, isMain) {
	if (parent) {
		debug("Module._load REQUEST %s parent: %s", request, parent.id);
	}

	var filename = Module._resolveFilename(request, parent, isMain);

	var cachedModule = Module._cache[filename];
	if (cachedModule) {
		updateChildren(parent, cachedModule, true);
		return cachedModule.exports;
	}

	if (NativeModule.nonInternalExists(filename)) {
		debug("load native module %s", request);
		return NativeModule.require(filename);
	}

	// Don't call updateChildren(), Module constructor already does.
	var module = new Module(filename, parent);

	if (isMain) {
		process.mainModule = module;
		module.id = ".";
	}

	Module._cache[filename] = module;

	tryModuleLoad(module, filename);

	return module.exports;
};
```

如上，require 的大致过程如下：

1. 先检测传入的 id 是否有效。
2. 如果有效，则调用 Module.\_load 方法，该方法主要负责加载新模块和管理模块的缓存，而 require 本身就是对该方法的一个封装。
3. 然后会调用 Module.\_resolveFilename 去取文件地址。

-   1. 查询文件名是否是核心模块，如果是直接返回传入的 id
-   2. 因为 option 没有参数传入，所以会调用 Module.\_resolveLookupPaths 方法去获取路径
-   3. 调用 Module.\_findPath 方法
    -   \_resolveLookupPaths：其实就是 node 解析模块中的路径查找，他会向父目录查找，直到根目录为止。
    -   \_findPath：其实就是将\_resolveLookupPaths 查找出来的文件名和文件 id 向匹配，返回一个文件地址。

4. 判断是否有缓存模块，如果有则返回缓存模块的 exports。
5. 如果没有缓存，再检测文件名是否是核心模块，如果是则调用核心模块的 require。
6. 如果不是核心模块，那么创建一个新的 module 对象。
7. 在 Module.\_cache 中缓存该对象，`Module._cache[filename] = module;`。
8. 调用`tryModuleLoad(module, filename);`，去尝试加载模块，如果报错，那么清除模块的缓存。
9. 返回模块本身的 exports 对象。
