---
title: 双越前端面试100题
author: EricYangXD
date: "2022-04-09"
---

## 双越前端面试 100 题

记录几个有意思的算法题

1. 数组是连续空间，要慎用 splice、unshift 等 API，时间复杂度是 O(n)起步
2.

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
