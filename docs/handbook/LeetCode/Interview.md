---
title: 双越前端面试100题
author: EricYangXD
date: "2022-04-09"
---

## 双越前端面试 100 题

记录几个有意思的算法题

1. 数组是连续空间，要慎用 splice、unshift 等 API，时间复杂度是 O(n)起步

### 浮动 0 到数组的一侧

```ts
// 双指针法，j指向第一个0，原地交换，实际上是把非0的值移到左侧
function floatNum(arr) {
	const length = arr?.length;
	if (length <= 1) return arr;

	let i = 0,
		j = -1;

	while (i < length) {
		if (arr[i] === 0) {
			// 先找到第一个0
			if (j < 0) {
				j = i;
			}
		}
		if (arr[i] !== 0 && j >= 0) {
			// 交换0到数组右侧，非0的到左侧
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
			// 交换之后，j要往右移动一位
			j++;
		}
		i++;
	}
	return arr;
}
```

### 求连续字符串的最大长度

-   双指针法，时间复杂度 O(n)

```js
function maxLen(str) {
	const res = { str: "", length: 0 };
	const length = str?.length;
	if (length <= 1) return { str, length };

	let i = 0,
		j = 0,
		tempLen = 0;
	while (j < length) {
		if (str[i] === str[j]) {
			tempLen++;
		}
		if (str[i] !== str[j] || j === length - 1) {
			if (tempLen > res.length) {
				res.length = tempLen;
				res.str = str[i];
			}
			tempLen = 0;
			if (j < length - 1) {
				i = j;
				j--; // j在这次循环之后会++，所以要先--，然后i才和j相等。
			}
		}
		j++;
	}
	return res;
}
```

-   双循环，跳步，使时间复杂度降到 O(n)

```js
function maxLen(str) {
	const res = { str: "", length: 0 };
	const length = str?.length;
	if (length <= 1) return { str, length };

	let maxLength = 0;
	for (let i = 0; i < length; i++) {
		maxLength = 0;
		for (let j = i; j < length; j++) {
			if (str[i] === str[j]) {
				maxLength++;
			}
			// 如果不相等或者已经匹配到最后
			if (str[i] !== str[j] || j === length - 1) {
				if (maxLength > res.length) {
					res.length = maxLength;
					res.str = str[i];
				}
				if (i < length - 1) {
					i = j - 1; // 跳步
				}
				break;
			}
		}
	}
	return res;
}
```

### 反转链表

```js
// 迭代
var reverseList = function (head) {
	if (head === null || head.next === null) {
		return head;
	}
	let prev = null,
		cur = head;
	while (cur !== null) {
		const next = cur.next;
		cur.next = prev;
		prev = cur;
		cur = next;
	}
	return prev;
};

// 递归
var reverseList = function (head) {
	// 递归终止条件
	if (head == null || head.next == null) return head;
	// 递
	const newHead = reverseList(head.next);
	// 归：这时候右边已经反转的node和左边未反转的node相邻的两个节点是互相指向对方的状态，此时的head指向递归调用栈这一层的node
	head.next.next = head;
	head.next = null;
	return newHead;
};
```

### 删除链表倒数第 N 个节点

-   假设 N<=链表长度。通过快慢指针，快指针先走 n+1 步，使快慢指针之间有 N 个节点，然后两个指针一起右移直到快指针指向 null，这时慢指针的下一个节点就是要删除的节点，让 slow.next=slow.next.next 即可，中间要注意删除 head 节点的情况。

```js
var removeNthFromEnd = function (head, n) {
	let slow = head,
		fast = head;
	// 先让 fast 往后移 n 位
	while (n--) {
		fast = fast.next;
	}
	// 如果 n 和 链表中总结点个数相同，即要删除的是链表头结点时，fast 经过上一步已经到外面了
	if (!fast) {
		return head.next;
	}
	// 然后 快慢指针 一起往后遍历，当 fast 是链表最后一个结点时，此时 slow 下一个就是要删除的结点
	while (fast.next) {
		slow = slow.next;
		fast = fast.next;
	}
	slow.next = slow.next.next;
	return head;
};
```

### 寻找链表中点

-   通过快慢指针寻找链表中点：快指针每次移动 2 步，慢指针每次移动 1 步

```js
function findCenter(head) {
	let slower = head,
		faster = head;
	while (faster && faster.next != null) {
		slower = slower.next;
		faster = faster.next.next;
	}
	// 如果 faster 不等于 null，说明是奇数个，slower 再移动一格
	if (faster != null) {
		slower = slower.next;
	}
	return slower;
}
```

### 前序遍历判断回文链表

1. 利用链表的后序遍历，使用函数调用栈作为后序遍历栈，来判断是否回文

```js
var isPalindrome = function (head) {
	let left = head;
	function traverse(right) {
		if (right == null) return true;
		// 这里会递归到最后一个node，然后一层一层往前
		let res = traverse(right.next);
		// 记录左右指针是否相等，初始值是tailNode.next===null，也就是true
		res = res && right.val === left.val;
		// 左边的指针每次要右移一个
		left = left.next;
		return res;
	}
	return traverse(head);
};
```

2. 通过 快、慢指针找链表中点，然后反转链表，比较两个链表两侧是否相等，来判断是否是回文链表

```js
var isPalindrome = function (head) {
	// 反转 slower 链表
	let right = reverse(findCenter(head));
	let left = head;
	// 开始比较
	while (right != null) {
		if (left.val !== right.val) {
			return false;
		}
		left = left.next;
		right = right.next;
	}
	return true;
};
function findCenter(head) {
	let slower = head,
		faster = head;
	while (faster && faster.next != null) {
		slower = slower.next;
		faster = faster.next.next;
	}
	// 如果 faster 不等于 null，说明是奇数个，slower 再移动一格
	if (faster != null) {
		slower = slower.next;
	}
	return slower;
}
function reverse(head) {
	let prev = null,
		cur = head,
		nxt = head;
	while (cur != null) {
		nxt = cur.next;
		cur.next = prev;
		prev = cur;
		cur = nxt;
	}
	return prev;
}
```

### 合并 2 个升序链表

```js
// 迭代1
function merge(l1, l2) {
	if (l1 == null && l2 == null) return null;
	if (l1 != null && l2 == null) return l1;
	if (l1 == null && l2 != null) return l2;
	let newHead = null,
		head = null;
	while (l1 != null && l2 != null) {
		if (l1.val < l2.val) {
			if (!head) {
				newHead = l1;
				head = l1;
			} else {
				newHead.next = l1;
				newHead = newHead.next;
			}
			l1 = l1.next;
		} else {
			if (!head) {
				newHead = l2;
				head = l2;
			} else {
				newHead.next = l2;
				newHead = newHead.next;
			}
			l2 = l2.next;
		}
	}
	newHead.next = l1 ? l1 : l2;
	return head;
}

// 迭代2
function merge(l1, l2) {
	if (l1 == null && l2 == null) return null;
	if (l1 != null && l2 == null) return l1;
	if (l1 == null && l2 != null) return l2;
	// 自定义头结点，最后只需返回自定义头结点的next即可
	const prehead = new ListNode(-1);
	let prev = prehead; // 记录已排序的链表的尾指针，方便指向下一个排序节点

	while (l1 != null && l2 != null) {
		if (l1.val <= l2.val) {
			prev.next = l1;
			l1 = l1.next;
		} else {
			prev.next = l2;
			l2 = l2.next;
		}
		prev = prev.next; // 更新prev，指向最新的尾部node
	}
	prev.next = l1 === null ? l2 : l1; // 最后把剩余的有序链表直接合并进来
	return prehead.next; // 返回自定义头结点的next
}

// 递归
var mergeTwoLists = function (l1, l2) {
	if (l1 === null) return l2;
	if (l2 === null) return l1;
	if (l1.val < l2.val) {
		l1.next = mergeTwoLists(l1.next, l2);
		return l1;
	} else {
		l2.next = mergeTwoLists(l1, l2.next);
		return l2;
	}
};
```

### 合并 K 个升序链表

-   递归或循环的方式两两合并即可

```js
var mergeKLists = function (lists) {
	if (lists.length === 0) return null;
	return mergeArr(lists);
};
function mergeArr(lists) {
	if (lists.length <= 1) return lists[0];
	let index = Math.floor(lists.length / 2);
	const left = mergeArr(lists.slice(0, index));
	const right = mergeArr(lists.slice(index));
	return merge(left, right);
}
function merge(l1, l2) {
	if (l1 == null && l2 == null) return null;
	if (l1 != null && l2 == null) return l1;
	if (l1 == null && l2 != null) return l2;
	let newHead = null,
		head = null;
	while (l1 != null && l2 != null) {
		if (l1.val < l2.val) {
			if (!head) {
				newHead = l1;
				head = l1;
			} else {
				newHead.next = l1;
				newHead = newHead.next;
			}
			l1 = l1.next;
		} else {
			if (!head) {
				newHead = l2;
				head = l2;
			} else {
				newHead.next = l2;
				newHead = newHead.next;
			}
			l2 = l2.next;
		}
	}
	newHead.next = l1 ? l1 : l2;
	return head;
}
```

### K 个一组翻转链表

```js
var reverseKGroup = function (head, k) {
	let a = head,
		b = head;
	for (let i = 0; i < k; i++) {
		if (b == null) return head;
		b = b.next;
	}
	// 每次翻转a到b这一段
	const newHead = reverse(a, b);
	// 递归，a指向下一段新的head节点
	a.next = reverseKGroup(b, k);
	return newHead;
};
// 翻转a->b
function reverse(a, b) {
	let prev = null,
		cur = a,
		nxt = a;
	while (cur != b) {
		nxt = cur.next;
		cur.next = prev;
		prev = cur;
		cur = nxt;
	}
	return prev;
}
```

### 环形链表

-   快慢指针判断链表有没有环，有环的话两个指针肯定会相遇（套圈），无环的话会退出。

```js
var hasCycle = function (head) {
	if (head == null || head.next == null) return false;
	let slower = head,
		faster = head;
	while (faster != null && faster.next != null) {
		slower = slower.next;
		faster = faster.next.next;
		if (slower === faster) return true;
	}
	return false;
};
```

### 排序链表

-   TODO

```js
var sortList = function (head) {
	if (head == null) return null;
	let newHead = head;
	return mergeSort(head);
};
function mergeSort(head) {
	if (head.next != null) {
		let slower = getCenter(head);
		let nxt = slower.next;
		slower.next = null;
		console.log(head, slower, nxt);
		const left = mergeSort(head);
		const right = mergeSort(nxt);
		head = merge(left, right);
	}
	return head;
}
function merge(left, right) {
	let newHead = null,
		head = null;
	while (left != null && right != null) {
		if (left.val < right.val) {
			if (!head) {
				newHead = left;
				head = left;
			} else {
				newHead.next = left;
				newHead = newHead.next;
			}
			left = left.next;
		} else {
			if (!head) {
				newHead = right;
				head = right;
			} else {
				newHead.next = right;
				newHead = newHead.next;
			}
			right = right.next;
		}
	}
	newHead.next = left ? left : right;
	return head;
}
function getCenter(head) {
	let slower = head,
		faster = head.next;
	while (faster != null && faster.next != null) {
		slower = slower.next;
		faster = faster.next.next;
	}
	return slower;
}
```

### 相交链表

-   TODO

```js
var getIntersectionNode = function (headA, headB) {
	let lastHeadA = null;
	let lastHeadB = null;
	let originHeadA = headA;
	let originHeadB = headB;
	if (!headA || !headB) {
		return null;
	}
	while (true) {
		if (headB == headA) {
			return headB;
		}
		if (headA && headA.next == null) {
			lastHeadA = headA;
			headA = originHeadB;
		} else {
			headA = headA.next;
		}
		if (headB && headB.next == null) {
			lastHeadB = headB;
			headB = originHeadA;
		} else {
			headB = headB.next;
		}
		if (lastHeadA && lastHeadB && lastHeadA != lastHeadB) {
			return null;
		}
	}
	return null;
};
```

### K 个一组翻转链表

```js

```

### K 个一组翻转链表

```js

```

## 山月前端工程化

厘清几个概念

### Babel、SWC

1. Babel 是广泛使用的 JavaScript 编译器，用于把 ES6+代码转换为 ES5 代码，使之可以兼容低端浏览器和 node 环境；
2. swc 是使用 Rust 编写的高性能 TypeScript / JavaScript 转译器，类似于 Babel，有至少 10 倍以上的性能优势，也是用来将 ES6+ 转化为 ES5 ；
3. swc 和 babel 命令可以相互替换，并且大部分的 babel 插件也已经实现。
4. swc 与 babel 一样，将命令行工具、编译核心模块分化为两个包。
    - `@swc/cli` 类似于 `@babel/cli`;
    - `@swc/core` 类似于 `@babel/core`;

### core-js、polyfill

1. core-js 是关于 ES 标准最出名的 polyfill 库，是实现 JavaScript 标准运行库之一，它提供了从 ES3 ～ ES7+ 以及还处在提案阶段的 JavaScript 的实现。
2. polyfill 意指当浏览器不支持某一最新 API 时，它将帮你实现，中文叫做垫片。
3. core-js 包含了所有 ES6+ 的 polyfill，并集成在 babel/swc 等编译工具之中。
4. @babel/plugin-transform-runtime - 重利用 Babel helper 方法的 babel 插件，避免全局补丁污染
5. @babel/polyfill - 等同于 `core-js/stable` 和 `regenerator-runtime/runtime` ，已废弃
6. @babel/preset-env - 按需编译和按需打补丁

### @babel/preset-env、@babel/polyfill

1. 使用 `@babel/preset-env` 或者 `@babel/polyfill` 进行配置 core-js，以实现 polyfill。

### browserslist 的意义

1. browserslist (opens new window)用特定的语句来查询浏览器列表，如 `last 2 Chrome versions`。package.json 中也有类似语句。
2. 它是现代前端工程化不可或缺的工具，无论是处理 JS 的 babel，还是处理 CSS 的 postcss，凡是与垫片相关的，他们背后都有 browserslist 的身影。
    - babel，在 @babel/preset-env 中使用 core-js 作为垫片
    - postcss 使用 autoprefixer 作为垫片
3. 前端打包体积与垫片的关系：
    - 由于低浏览器版本的存在，垫片是必不可少的
    - 垫片越少，则打包体积越小
    - 浏览器版本越新，则垫片越少
4. 原理: browserslist 根据正则解析查询语句，对浏览器版本数据库 caniuse-lite 进行查询，返回所得的浏览器版本列表。
5. 使用以下命令手动更新 caniuse-lite 数据库：`npx browserslist@latest --update-db`。

### 浏览器中如何使用原生的 ESM

1. Native Import: Import from URL--通过 `script[type=module]`，可直接在浏览器中使用原生 ESM。这也使得前端不打包 (Bundless) 成为可能(Vite)。

```html
<script type="module">
	import lodash from "https://cdn.skypack.dev/lodash";
</script>
```

2. 由于前端跑在浏览器中，因此它也只能从 URL 中引入 Package

```js
// 由于 http import 的引入，可以直接在浏览器控制台引入第三方package
lodash = await import("https://cdn.skypack.dev/lodash");

lodash.get({ a: 3 }, "a");
```

3. ImportMap：在 ESM 中，可通过 importmap 使得裸导入可正常工作:

```html
<script type="importmap">
	{
		"imports": {
			"lodash": "https://cdn.skypack.dev/lodash",
			"ms": "https://cdn.skypack.dev/ms"
		}
	}
</script>
```

4. Import Assertion: 通过 `script[type=module]`，不仅可引入 Javascript 资源，甚至可以引入 JSON/CSS，示例如下:

```html
<script type="module">
	import data from "./data.json" assert { type: "json" };

	console.log(data);
</script>
```

### ESM 与 CommonJS 的导入导出的不同

1. 在 ESM 中，导入导出有两种方式:
    - 具名导出/导入: Named Import/Export
    - 默认导出/导入: Default Import/Export
2. CommonJS 中，导入导出的方法只有一种:
    - `module.exports = xxx;`
    - 而所谓的 exports 仅仅是 `module.exports` 的引用而已: `exports = module.exports;`
    - 多个`module.exports.xxx`导出的值会合并成一个对象
    - `module.exports`导出的值为默认值，会忽略`module.exports.xxx`导出的值
3. exports 的转化：cjs==>ESM:
    - 当 exports 转化时，既要转化为具名导出 `export {}`，又要转化为默认导出 `export default {}`
4. module.exports 的转化：cjs==>ESM:
    - 我们可以遍历其中的 key (通过 AST)，将 key 转化为具名导出 `Named Export`，将 module.exports 转化为默认导出 `Default Export`
5. CommonJS To ESM 的构建工具: `@rollup/plugin-commonjs`,`https://cdn.skypack.dev/`,`https://jspm.org/`.

### 简述 bundless 的优势与不足

#### 优势

1.  项目启动快。因为不需要过多的打包，只需要处理修改后的单个文件，所以响应速度是 O(1) 级别，刷新即可即时生效，速度很快。
2.  浏览器加载块。利用浏览器自主加载的特性，跳过打包的过程。
3.  本地文件更新，重新请求单个文件。

#### 缺点

兼容性略差

### 什么是 semver，~ 与 ^ 的区别

semver，Semantic Versioning 语义化版本的缩写，文档可见 `https://semver.org/`，它由 `[major, minor, patch]` 三部分组成，其中：

-   major: 当你发了一个含有 Breaking Change 的 API
-   minor: 当你新增了一个向后兼容的功能时
-   patch: 当你修复了一个向后兼容的 Bug 时

1. 对于 ~1.2.3 而言，它的版本号范围是 [1.2.3, 1.3.0)
2. 对于 ^1.2.3 而言，它的版本号范围是 [1.2.3, 2.0.0)，可最大限度地在向后兼容与新特性之间做取舍

### 自动发现更新

-   升级版本号，最不建议的事情就是手动在 package.json 中进行修改。毕竟，你无法手动发现所有需要更新的 package。
-   可借助于 `npm outdated`，发现有待更新的 package。仍然需要手动在 package.json 更改版本号进行升级。
-   使用 `npm outdated`，还可以列出其待更新 package 的文档。`npm outdated -l`
-   推荐一个功能更强大的工具 `npm-check-updates`，比 `npm outdated` 强大百倍。
-   `npx npm-check-updates -u`，可自动将 package.json 中待更新版本号进行重写。
-   升级 `[minor]` 小版本号，有可能引起 Break Change，可仅仅升级到最新的 patch 版本。`npx npm-check-updates --target patch`

### 如何修复某个 npm 包的紧急 bug

使用 patch-package，例如：

```sh
# 修改 lodash 的一个小问题
vim node_modules/lodash/index.js

# 对 lodash 的修复生成一个 patch 文件，位于 patches/lodash+4.17.21.patch
npx patch-package lodash

# 将修复文件提交到版本管理之中
git add patches/lodash+4.17.21.patch
git commit -m "fix 一点儿小事 in lodash"

# 此后的命令在生产环境或 CI 中执行
# 此后的命令在生产环境或 CI 中执行
# 此后的命令在生产环境或 CI 中执行

# 在生产环境装包
npm i

# 为生产环境的 lodash 进行小修复
npx patch-package

# 大功告成！
```

### package.json 中的字段及含义/作用

简单地就不说了

1. main：npm package 的入口文件，当我们对某个 package 进行导入时，实际上导入的是 main 字段所指向的文件。main 是 CommonJS 时代的产物，也是最古老且最常用的入口文件。main 字段作为 commonjs 入口。
2. module：module 字段作为 es module 入口。使用 import 对该库进行导入，则首次寻找 module 字段引入，否则引入 main 字段。
3. exports 可以更容易地控制子目录的访问路径，也被称为 export map。可以根据模块化方案不同选择不同的入口文件，还可以根据环境变量(NODE_ENV)、运行环境(nodejs/browser/electron) 导入不同的入口文件。（相当于设个唯一别名？）
4. browserslist：设置运行时浏览器版本
5. sideEffects：false 时开启 tree shaking
6. lint-staged：设置 git commit 时需要格式化的文件和所用的工具
7. husky：设置 git hooks
8. engines：engines 字段中指定 Node 版本号

### dependencies 与 devDependencies 有何区别

1. 对于业务代码而讲，它俩区别不大，打包时 webpack、Rollup 会对代码进行模块依赖分析，与该模块是否在 dep/devDep 并无关系，只要在 node_modules 上能够找到该 Package 即可。

2. 对于库 (Package) 开发而言，是有严格区分的，当在项目中安装一个依赖的 Package 时，该依赖的 dependencies 也会安装到项目中，即被下载到 node_modules 目录中。但是 devDependencies 不会。
    - dependencies: 在生产环境中使用
    - devDependencies: 在开发环境中使用，如 webpack/babel/eslint 等

### package-lock.json 有什么作用

1. `packagelock.json / yarn.lock` 用以锁定版本号，保证开发环境与生产环境的一致性，避免出现不兼容 API 导致生产环境报错。

2. lockfile 对于第三方库仍然必不可少。
    - 第三方库的 devDependencies 必须在 lockfile 中锁定，这样 Contributor 可根据 lockfile 很容易将项目跑起来。
    - 第三方库的 dependencies 虽然有可能存在不可控问题，但是可通过锁死 package.json 依赖或者勤加更新的方式来解决。

### 简述 npm script 的生命周期

除了可自定义 npm script 外，npm 附带许多内置 scripts，他们无需带 npm run，可直接通过 `npm <script>` 执行。如：`npm test/install/publish`。

### npm cache

npm 会把所有下载的包，保存在用户文件夹下面。`~/.npm`或`%AppData%/npm-cache`等。

npm install 之后会计算每个包的 sha1 值(PS:安全散列算法(Secure Hash Algorithm))，然后将包与他的 sha1 值关联保存在 package-lock.json 里面，下次 npm install 时，会根据 package-lock.json 里面保存的 sha1 值去文件夹里面寻找包文件，如果找到就不用从新下载安装了。

-   `npm cache verify`：重新计算，磁盘文件是否与 sha1 值匹配，如果不匹配可能删除。要对现有缓存内容运行脱机验证，请使用 npm cache verify。
-   `npm cache clean --force`：删除磁盘所有缓存文件。

#### 一个 npm script 的生命周期

当我们执行任意 npm run 脚本时，将自动触发 pre/post 的生命周期。

比如：当手动执行 `npm run abc` 时，将在此之前自动执行 `npm run preabc`，在此之后自动执行 `npm run postabc`。

执行 npm publish，将自动执行以下脚本:

-   prepublishOnly: 最重要的一个生命周期。如需要在发包之前自动做一些事情，如测试、构建等，请在 prepulishOnly 中完成。
-   prepack
-   prepare: 最常用的生命周期。`npm install` 之后自动执行，`npm publish` 之前自动执行。
-   postpack
-   publish
-   postpublish
-   发包实际上是将本地 package 中的所有资源进行打包，并上传到 npm 的一个过程。你可以通过 `npm pack` 命令查看详情

#### npm script 钩子的风险

有很多 npm package 被攻击后，就是通过 `npm postinstall` 自动执行一些事，比如挖矿等。

#### 总结

-   表面上：`npm run xxx`的时候，首先会去项目的 package.json 文件里找 scripts 里找对应的 xxx，然后执行 xxx 的命令，例如启动 vue 项目 `npm run serve`的时候，实际上就是执行了`vue-cli-service serve` 这条命令。
-   实际上：`vue-cli-service`这条指令不存在操作系统中，我们在安装依赖的时候，是通过 npm i xxx 来执行的，例如 `npm i @vue/cli-service`，npm 在 安装这个依赖的时候，就会在 `node_modules/.bin/` 目录中创建好 `vue-cli-service` 为名的几个可执行文件，实际是些软链接/node 脚本。
-   从 `package-lock.json` 中可知，当我们`npm i` 整个新建的 vue 项目的时候，npm 将 `bin/vue-cli-service.js` 作为 bin 声明了。
    所以在 `npm install` 时，npm 读到该配置后，就将该文件软链接到 `./node_modules/.bin` 目录下，而 npm 还会自动把`node_modules/.bin`加入`$PATH`，这样就可以直接作为命令运行依赖程序和开发依赖程序，不用全局安装了。如果把包安装在全局环境，那么就可以直接使用这个命令。
-   也就是说，`npm i` 的时候，npm 就帮我们把这种软连接配置好了，其实这种软连接相当于一种映射，执行`npm run xxx` 的时候，就会到 `node_modules/.bin`中找对应的映射文件，如果没找到就去全局找，然后再找到相应的 js 文件来执行。
-   为什么`node_modules/bin`中 有三个`vue-cli-service`文件? -- 在不同的系统中执行不同的脚本（跨平台执行）

1. 运行 `npm run xxx` 的时候，npm 会先在当前目录的 `node_modules/.bin` 查找要执行的程序，如果找到则运行；
2. 没有找到则从全局的 `node_modules/.bin` 中查找，`npm i -g xxx` 就是安装到到全局目录；
3. 如果全局目录还是没找到，那么就从 path 环境变量中查找有没有其他同名的可执行程序。

### 软链接和硬链接

1. 通过 ln -s 创建一个软链接，通过 ln 可以创建一个硬链接。
2. 区别有以下几点:
    1. 软链接可理解为指向源文件的指针，它是单独的一个文件，仅仅只有几个字节，它拥有独立的 inode
    2. 硬链接与源文件同时指向一个物理地址，它与源文件共享存储数据，它俩拥有相同的 inode
3. pnpm 为何节省空间:
    1. 解决了 npm/yarn 平铺 node_modules 带来的依赖项重复的问题 (doppelgangers)
    2. 在 pnpm 中，它改变了 npm/yarn 的目录结构，采用软链接的方式，避免了 doppelgangers 问题更加节省空间。
    3. 通过硬链接，又能使多个不同的项目复用相同依赖的存储空间。

### 如何确保所有 npm install 的依赖都是安全的？

-   Audit，审计，检测你的所有依赖是否安全。`npm audit / yarn audit` 均有效。通过审计，可看出有风险的 package、依赖库的依赖链、风险原因及其解决方案。
-   通过 `npm audit fix` 可以自动修复该库的风险，原理就是升级依赖库，升级至已修复了风险的版本号。`npm audit fix`
-   `yarn audit` 无法自动修复，需要使用 `yarn upgrade` 手动更新版本号，不够智能。
-   synk 是一个高级版的 `npm audit`，可自动修复，且支持 CICD 集成与多种语言。`npx snyk`，`npx wizard`，`npx snyk wizard`

### Long Term Cache

0. 通过在服务器端/网关端对资源设置以下 Response Header，进行强缓存一年时间，称为永久缓存，即 Long Term Cache。`Cache-Control: public,max-age=31536000,immutable`
1. 假设有两个文件: index.js 和 lib.js，且 index 依赖于 lib，由 webpack 打包后将会生成两个 chunk -- `index.aaaaaa.js`和`lib.aaaaaa.js `，假设 lib.js 文件内容发生变更，index.js 由于引用了 lib.js，可能包含其文件名，那么它的 hash 是否会发生变动？

-   不一定。打包后的 index.js 中引用 lib 时并不会包含 lib.aaaaaa.js，而是采用 chunkId 的形式，如果 chunkId 是固定的话(chunkIds = deterministic 时)，则不会发生变更。即在 webpack 中，通过 `optimization.chunkIds = 'deterministic'` 可设置确定的 chunkId，来增强 Long Term Cache 能力。此时打包，仅仅 lib.js 路径发生了变更 -- `lib.bbbbbb.js`。

## 面试题

### 2022-04-27

万向区块链

#### 关于堆和栈、一级缓存和二级缓存的理解

1. 数据结构的堆和栈（都是逻辑结构）
    1. 堆：先进先出的，可以被看成是一棵树，如：堆排序。
    2. 栈：后进先出的、自顶向下。
2. 内存分布上的堆和栈
    1. 栈：局部变量的内存，函数结束后内存自动被释放，栈内存分配运算内置于处理器的指令集中，它的运行效率一般很高，但是分配的内存容量有限。
    2. 静态存储区：全局变量、static 变量；它是由编译器自动分配和释放的，即内存在程序编译的时候就已经分配好，这块内存在程序的整个运行期间都存在，直到整个程序运行结束时才被释放。
    3. 动态储存区：堆和栈
3. 一级缓存和二级缓存
    1. 栈使用的是一级缓存， 他们通常都是被调用时处于存储空间中，调用完毕立即释放。栈的效率比堆的高。
    2. 堆则是存放在二级缓存中，生命周期由虚拟机的垃圾回收算法来决定（并不是一旦成为孤儿对象就能被回收）。所以调用这些对象的速度要相对来得低一些。
4. 为什么需要缓存？
    1. cpu 运行速率很快，但内存的速度很慢，所以就需要缓存，缓存分为一级二级三级，越往下优先级越低，成本越低，容量越大。
    2. 栈（操作系统）：由操作系统自动分配释放 ，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
    3. 堆（操作系统）： 一般由程序员分配释放， 若程序员不释放，程序结束时可能由 OS 回收，分配方式倒是类似于链表。
5. CPU 读写速率：
    1. 寄存器>一级缓存>二级缓存

#### Vue 和 React 的区别

#### Vue 和 React 的生命周期

##### React

1. 挂载阶段：

> 当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

-   `constructor()`
-   `static getDerivedStateFromProps()`
-   `render()`
-   `componentDidMount()`

2. 更新阶段：

> 当组件中的 props 或者 state 发生变化时就会触发更新。组件更新的生命周期调用顺序如下：

-   `static getDerivedStateFromProps()`
-   `shouldComponentUpdate()`
-   `render()`
-   `getSnapshotBeforeUpdate()`
-   `componentDidUpdate()`

3. 卸载:

-   `componentWillUnmount()`

4. 废弃的钩子：

-   `componentWillMount`
-   `componentWillReceiveProps`
-   `componentWillUpdate`

#### Vue 和 React 渲染组件的方式有何区别

#### 哪个 React 生命周期可以跳过子组件渲染

#### React 类组件中的 setState 和函数组件中 setState 的区别

#### forEach 和 map 的区别

#### Proxy、Symbol 概念

#### 防抖、节流 概念

#### 重绘与重排

-   修改字体会引起重排

#### JS 中 new 一个对象的过程

#### 宏任务与微任务

#### 闭包的优缺点

#### commonJs 中的 require 与 ES6 中的 import 的区别

#### export 与 import 的区别

#### CSS 加载是否阻塞 DOM 渲染
