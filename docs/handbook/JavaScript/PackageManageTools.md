---
title: 包管理工具 - npm/yarn/pnpm
author: EricYangXD
date: "2022-02-23"
---

## 包管理工具知识

PackageManageTools.md

## 现有包管理工具中 node_modules 存在的问题

### node_modules 安装方式

目前有两种安装方式：`Nested installation`、`Flat installation`

#### Nested installation 嵌套安装

在 npm@3 之前，node_modules 结构是干净、可预测的，因为 node_modules 中的每个依赖项都有自己的 node_modules 文件夹，在 package.json 中指定了所有依赖项。即层层嵌套。

有两个严重的问题：

1. package 中经常创建太深的依赖树，这会导致 Windows 上的目录路径过长问题。
2. 当一个 package 在不同的依赖项中需要时，它会被多次复制粘贴并生成多份文件。

#### Flat installation 扁平安装

在 npm@3+ 和 yarn 中，node_modules 结构变成扁平化结构。在 hoist 机制下，某些包会被提升到顶层（至于哪个版本的包被提升，依赖于包的安装顺序！），如果同一个包的多个版本在项目中被依赖时，多个版本的包只能有一个被提升上来，其余版本的包会嵌套安装到各自的依赖当中（类似 npm2 的结构）。依赖变更会影响提升的版本号。

### npm3+和 yarn 存在的问题

#### Phantom dependencies 幽灵依赖

Phantom dependencies 被称之为幽灵依赖或幻影依赖，解释起来很简单，即某个包没有在 package.json 被依赖，但是用户却能够引用到这个包。

引发这个现象的原因一般是因为 node_modules 结构所导致的。例如使用 npm 或 yarn 对项目安装依赖，依赖里面有个依赖叫做 foo，foo 这个依赖同时依赖了 bar，yarn 会对安装的 node_modules 做一个扁平化结构的处理，会把依赖在 node_modules 下打平，这样相当于 foo 和 bar 出现在同一层级下面。那么根据 nodejs 的寻径原理，用户能 require 到 foo，同样也能 require 到 bar。

```txt
nodejs的寻址方式：

1. 对于核心模块（core module） => 绝对路径 寻址

2. node标准库 => 相对路径寻址

3. 第三方库（通过npm安装）到node_modules下的库：

   3.1.   先在当前路径下，寻找 node_modules/xxx
   3.2    递归从下往上到上级路径，寻找 ../node_modules/xxx
   3.3    循环第二步
   3.4    在全局环境路径下寻找 .node_modules/xxx
```

#### NPM doppelgangers NPM 分身

这个问题其实也可以说是 hoist 导致的，这个问题可能会导致有大量的依赖的被重复安装。

在 npm2 时，结构如下:

```
- package A
    - packageX 1.0
    - packageY 1.0
- package B
    - packageX 2.0
    - packageY 2.0
- package C
    - packageX 1.0
    - packageY 2.0
- package D
    - packageX 2.0
    - packageY 1.0
```

在 npm3+和 yarn 中，由于存在 hoist 机制，所以 X 和 Y 各有一个版本被提升了上来，目录结构如下:

```
- package X => 1.0版本
- package Y => 1.0版本

- package A
- package B
    - packageX 2.0
    - packageY 2.0
- package C
    - packageY 2.0
- package D
    - packageX 2.0
```

如上图所示的 packageX 2.0 和 packageY 2.0 被重复安装多次，从而造成 npm 和 yarn 的性能一些性能损失。

这种场景在 monorepo 多包场景下尤其明显，这也是 yarn workspace 经常被吐槽的点，另外扁平化的算法实现也相当复杂，改动成本很高。

### pnpm 的破解之道：网状 + 平铺的 node_modules 结构

pnpm 项目的 node_modules 并不是扁平化结构，而是目录树的结构，类似 npm version 2.x 版本中的结构。同时还有个.pnpm 目录，.pnpm 以平铺的形式储存着所有的包，正常的包都可以在这种命名模式的文件夹中被找到（peerDep 例外）：

```bash
.pnpm/<organization-name>+<package-name>@<version>/node_modules/<name>

// 组织名(若无会省略)+包名@版本号/node_modules/名称(项目名称)
```

我们称.pnmp 为**虚拟存储目录**，该目录通过`<package-name>@<version>`来实现相同模块不同版本之间隔离和复用，由于它只会根据项目中的依赖生成，并不存在提升，所以它不会存在之前提到的 Phantom dependencies 问题！

### pnpm 如何跟文件资源进行关联的? 又如何被项目中使用?

答案是**Store + Links**！

#### Store

pnpm 资源在磁盘上的存储位置。

`pnpm 使用名为 .pnpm-store的 store dir，Mac/linux中默认会设置到{home dir}>/.pnpm-store/v3；windows下会设置到当前盘的根目录下，比如C（C/.pnpm-store/v3）、D盘（D/.pnpm-store/v3）`。

具体可以参考  @pnpm/store-path  这个 pnpm 子包中的代码:

```js
const homedir = os.homedir();
if (await canLinkToSubdir(tempFile, homedir)) {
	await fs.unlink(tempFile);
	// If the project is on the drive on which the OS home directory
	// then the store is placed in the home directory
	return path.join(homedir, relStore, STORE_VERSION);
}
```

`由于每个磁盘有自己的存储方式，所以Store会根据磁盘来划分。 如果磁盘上存在主目录，存储则会被创建在 <home dir>/.pnpm-store；如果磁盘上没有主目录，那么将在文件系统的根目录中创建该存储。 例如，如果安装发生在挂载在 /mnt 的文件系统上，那么存储将在 /mnt/.pnpm-store 处创建。 Windows系统上也是如此。`

可以在不同的磁盘上设置同一个存储，但在这种情况下，pnpm 将**复制包**而不是硬链接它们，因为**硬链接只能发生在同一文件系统同一分区上**.

pnpm install 的安装过程中，我们会看到如下的信息，这个里面的 Content-addressable store 就是我们目前说的 Store.

- CAS 内容寻址存储，是一种存储信息的方式，根据内容而不是位置进行检索信息的存储方式.
- Virtual store 虚拟存储，指向存储的链接的目录，所有直接和间接依赖项都链接到此目录中，项目当中的.pnpm 目录.

区别对比：如果是 npm 或 yarn，那么这个依赖在多个项目中使用，在每次安装的时候都会被重新下载一次；而在使用 pnpm 对项目安装依赖的时候，如果某个依赖在 sotre 目录中存在了话，那么就会直接从 store 目录里面去 hard-link，避免了二次安装带来的时间消耗，如果依赖在 store 目录里面不存在的话，就会去下载一次。

如果安装了很多很多不同的依赖，那么 store 目录也会越来越大，可以通过`pnpm store prune`部分解决这个问题。它提供了一种用于删除一些不被全局项目所引用到的 packages 的功能。该命令推荐偶尔进行使用，但不要频繁使用，因为可能某天这个不被引用的包又突然被哪个项目引用了，这样就可以不用再去重新下载这个包了。

#### Links（hard link & symbolic link）

1. hard link

pnpm 是怎么做到如此大的性能提升的？一部分原因是使用了计算机当中的 Hard link ，它减少了文件下载的数量，从而提升了下载和响应速度。

通过 hard link，  用户可以通过不同的路径引用方式去找到某个文件，需要注意的是一般用户权限下只能硬链接到文件，不能用于目录。

pnpm 会在 Store(上面的 Store) 目录里存储项目  node_modules  文件的  hard links ，通过访问这些 link 直接访问文件资源。因为这样一个机制，导致每次安装依赖的时候，如果是个相同的依赖，有好多项目都用到这个依赖，那么这个依赖实际上最优情况(即版本相同)只用安装一次。

**通过 Store + hard link 的方式，不仅解决了项目中的 NPM doppelgangers 问题，项目之间也不存在该问题，从而完美解决了 npm3+和 yarn 中的包重复问题！**

2. symbolic link

由于 hark link 只能用于文件不能用于目录，但是 pnpm 的 node_modules 是树形目录结构，那么如何链接到文件？ 通过 symbolic link（也可称之为软链或者符号链接）来实现！

pnpm 在全局通过 Store 来存储所有的 node_modules 依赖，并且在.pnpm/node_modules 中存储项目的 hard links，通过 hard link 来链接真实的文件资源，项目中则通过 symbolic link 链接到.pnpm/node_modules 目录中，**依赖放置在同一级别避免了循环的软链**。

#### PeerDependencies 相对依赖

pnpm 的最佳特征之一是，在一个项目中，`package`的一个特定版本将始终只有一组依赖项。 这个规则有一个例外 -那就是具有 [peer dependencies ]。通常，如果一个 package 没有 peer 依赖项（peer dependencies），它会被硬链接到其依赖项的软连接（symlinks）旁的 node_modules。

peerDep 的包命名规则如下：

```
.pnpm/<organization-name>+<package-name>@<version>_<organization-name>+<package-name>@<version>/node_modules/<name>

// peerDep组织名(若无会省略)+包名@版本号_组织名(若无会省略)+包名@版本号/node_modules/名称(项目名称)
```

如果一个 package 没有 peer 依赖（peer dependencies），不过它的依赖项有 peer 依赖，这些依赖会在更高的依赖图中解析, 则这个传递 package 便可在项目中有几组不同的依赖项。 例如，a@1.0.0  具有单个依赖项  b@1.0.0。 b@1.0.0  有一个 peer 依赖为  c@^1。 a@1.0.0  永远不会解析b@1.0.0的 peer, 所以它也会依赖于  b@1.0.0  的 peer 。如果需要解决 peerDep 引入的多实例问题，可以通过 .pnpmfile.cjs 文件更改依赖项的依赖关系。

## pnpm 和 npm、yarn 的功能差异

| 功能                             | pnpm                | yarn                  | npm                    |
| -------------------------------- | ------------------- | --------------------- | ---------------------- |
| 工作空间支持（monorepo）         | ✔️                  | ✔️                    | ✔️                     |
| 隔离的  node_modules             | ✔️ - 默认           | ✔️                    | ✔️                     |
| 提升的  node_modules             | ✔️                  | ✔️                    | ✔️ - 默认              |
| Plug'n'Play                      | ✔️                  | ✔️ - 默认             | ❌                     |
| 零安装                           | ❌                  | ✔️                    | ❌                     |
| 修补依赖项                       | ❌                  | ✔️                    | ❌                     |
| 管理 Node.js 版本（pnpm 独有）   | ✔️                  | ❌                    | ❌                     |
| 有锁文件                         | ✔️ - pnpm-lock.yaml | ✔️ - yarn.lock        | ✔️ - package-lock.json |
| 支持覆盖                         | ✔️                  | ✔️ - 通过 resolutions | ✔️                     |
| 内容可寻址存储(CAS)（pnpm 独有） | ✔️                  | ❌                    | ❌                     |
| 动态包执行                       | ✔️ - 通过  pnpm dlx | ✔️ - 通过  yarn dlx   | ✔️ - 通过  npx         |

pnpm 独有的实现：1.管理 Node.js 版本和 2.内容可寻址存储(CAS).

1. 参考上面.

2. 这个在.npmrc 文件中，Node 模块设置中使用 use-node-version 进行配置.

use-node-version 用于指定应用于项目运行时的确切 Node.js 版本，支持 semver 版本设置。设置后， pnpm 将自动安装指定版本的 Node.js 并将其用于执行 pnpm run 命令或 pnpm node 命令。例：

```js
// 指定版本16.x
use-node-version=^16.x
```

### pnpm 命令

1. pnpm add 安装 package 以及依赖的 package，默认是安装到 dependencies 中。注意的是在 workspace 中，如果想要安装在 root workspace 中需要添加-w 或者--ignore-workspace-root-check，安装到 packages 中需要使用--filter，否则会安装失败。
2. pnpm remove 别名: rm, uninstall, un。从 node_modules 和项目的 package.json 中移除包。
3. pnpm install 别名: i。用于安装项目所有依赖。在 CI 环境中, 如果存在需要更新的 lockfile 会安装失败，所以每次版本更新后，本地一定要 install 后再提交，否则会导致版本发布失败。
4. pnpm import 命令支持从其它格式的 lock 文件生成 pnpm-lock.yaml 文件。
5. pnpm prune 移除项目中不需要的依赖包，配置项支持 --prod(删除在 devDependencies 中指定的包)和 --no-optional(删除在 optionalDependencies 中指定的包。)。
6. pnpm list 别名: ls。此命令会以一个树形结构输出所有的已安装 package 的版本及其依赖。添加参数--json 后会输出 JSON 格式的日志。
7. pnpm run 别名: run-script。运行一个在 package 的 manifest 文件中定义的脚本。
