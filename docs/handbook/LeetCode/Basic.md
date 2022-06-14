---
title: 算法基础知识
author: EricYangXD
date: "2022-01-17"
---

## 树 Tree

### B+树和 B 树的区别

- B-Tree 是一种自平衡的多叉树。每个节点都存储关键字值。其左子节点的关键字值小于该节点关键字值，且右子节点的关键字值大于或等于该节点关键字值。

- B+树也是是一种自平衡的多叉树。其基本定义与 B 树相同，不同点在于数据只出现在叶子节点，所有叶子节点增加了一个链指针，方便进行范围查询。

- B+树中间节点不存放数据，所以同样大小的磁盘页上可以容纳更多节点元素，访问叶子节点上关联的数据也具有更好的缓存命中率。并且数据顺序排列并且相连，所以便于区间查找和搜索。

- B 树每一个节点都包含 key 和 value，查询效率比 B+树高。

## 算法技巧

### 前缀和

前缀和主要适用的场景是原始数组不会被修改的情况下，频繁查询某个区间的累加和。

`prefix[0] === 0`，`prefix[i]`就代表着`nums[0..i-1]`所有元素的累加和，即前 i 个元素的累加和，如果我们想求区间`nums[i..j]`的累加和，只要计算`prefix[j+1] - prefix[i]`即可，而不需要遍历整个区间求和。

```js
function PrefixSum(nums, start = 0, end = nums.length) {
	if (end < start) return;
	if (end > nums.length) end = nums.length;
	// 前缀和数组
	const prefix = [0];

	/* 输入一个数组，构造前缀和 */
	// 计算 nums 的累加和
	for (let i = 1; i < nums.length + 1; i++) {
		prefix[i] = prefix[i - 1] + nums[i - 1];
	}
	// console.log("prefix", prefix);
	/* 查询闭区间 [i, j] 的累加和 */
	return prefix[end] - prefix[start];
}
```

### 差分数组

和前缀和思想非常类似，差分数组的主要适用场景是频繁对原始数组的某个区间的元素进行增减。

这样构造差分数组 diff，就可以快速进行区间增减的操作，如果你想对区间`nums[i..j]`的元素全部加 3，那么只需要让`diff[i] += 3`，然后再让`diff[j+1] -= 3`即可.

原理很简单，回想 diff 数组反推 nums 数组的过程，`diff[i] += 3`意味着给`nums[i..]`所有的元素都加了 3，然后`diff[j+1] -= 3`又意味着对于`nums[j+1..]`所有元素再减 3，那综合起来，是不是就是对`nums[i..j]`中的所有元素都加 3 了？

```js
// 生成差分数组
function PrefixDiff(nums) {
	const diff = [nums[0]];
	for (let i = 1; i < nums.length; i++) {
		diff[i] = nums[i] - nums[i - 1];
	}
	return diff;
}
// 还原原始数组
function ResetOrigin(diff) {
	const nums = [diff[0]];
	for (let i = 1; i < diff.length; i++) {
		nums[i] = diff[i] + nums[i - 1];
	}
	return nums;
}
// 执行增减操作
function increment(start, end, val) {
	diff[start] += val;
	// 如果end+1>diff.length，说明是对nums[start]之后的所有值都进行加val操作
	if (end + 1 < diff.length) {
		diff[end + 1] -= val;
	}
}
```

### 斐波那契数列

```js
function fb(n) {
	if (n < 0) return;
	if (n <= 1) return n;

	let f1 = 0;
	let f2 = 1;
	let f3 = 0;
	for (let i = 1; i < n; i++) {
		f3 = f1 + f2;
		f1 = f2;
		f2 = f3;
	}

	return f3;
}
```

### 字符串匹配

```js
const isValid = (s) => {
	// 空字符串符合条件
	if (!s) {
		return true;
	}

	const leftToRight = {
		"(": ")",
		"[": "]",
		"{": "}",
	};
	const stack = [];

	for (let i = 0, len = s.length; i < len; i++) {
		const ch = s[i];
		// 左括号
		if (leftToRight[ch]) {
			stack.push(ch);
		} else {
			// 右括号开始匹配
			// 1. 如果栈内没有左括号，直接false
			// 2. 有数据但是栈顶元素不是当前的右括号
			if (!stack.length || leftToRight[stack.pop()] !== ch) {
				return false;
			}
		}
	}

	// 最后检查栈内还有没有元素，有说明还有未匹配则不符合
	return !stack.length;
};
```

### 22.括号生成

- 暴力解法，生成所有可能的字符串，然后选出符合规则的
- 回溯，提前剪枝

```js
var generateParenthesis = function (n) {
	let res = [];
	const dfs = (lr, rr, str) => {
		if (str.length === 2 * n) {
			// 递归出口
			res.push(str);
			return;
		}
		if (lr > 0) {
			dfs(lr - 1, rr, str + "(");
		}
		if (rr > lr) {
			dfs(lr, rr - 1, str + ")");
		}
	};
	dfs(n, n, ""); // 递归入口
	return res;
};
```

### 83.删除排序链表中的重复元素 I

相同值的节点只保留一个。

```js
var deleteDuplicates = function (head) {
	if (!head) return head;
	let cur = head;
	while (cur.next) {
		if (cur.val === cur.next.val) {
			cur.next = cur.next.next;
		} else {
			cur = cur.next;
		}
	}
	return head;
};
```

### 82.删除排序链表中的重复元素 II

有重复出现的就全部删除，只保留出现过一次的节点。

- 迭代，创建一个新节点，其 next 指向 head，head 再反过来指向新节点。然后取前两个节点开始比较，若两个值相等，则向后移动第二个节点的指针直至跟前一个节点的值不相等，然后下一次循环时，更新 head，使其指向最新的节点，因为前面的节点都是重复的直接删除即可。然后在进行下一轮比较判断，直至最后。返回创建的新节点的 next 节点。

```js
var deleteDuplicates = function (head) {
	if (!head || !head.next) return head;
	let res = new ListNode(0, head);
	head = res;
	let temp;
	while (head.next && head.next.next) {
		if (head.next.val === head.next.next.val) {
			temp = head.next.val;
			while (head.next && head.next.val === temp) {
				head.next = head.next.next;
			}
		} else {
			head = head.next;
		}
	}
	return res.next;

	// var deleteDuplicates = function (head) {
	//   if (!head || !head.next) return head;
	//   let res =new ListNode(0,head);
	//   let prev = res;
	//   let cur = head;
	//   while (cur) {
	//     while (cur.next && cur.next.val === cur.val) {
	//       cur = cur.next;
	//     }
	//     if (prev.next === cur) {
	//       prev = prev.next;
	//     } else {
	//       prev.next = cur.next;
	//     }
	//     cur = cur.next;
	//   }
	//   return res.next
};
```
