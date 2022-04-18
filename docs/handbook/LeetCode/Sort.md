---
title: 排序
author: EricYangXD
date: "2022-01-11"
---

## 排序

记录一些常见的不常见的、沙雕的算法和思想。

### 冒泡排序

-   最常见的排序之一。

```js

```

### 快排

原理：找到一个基数，把数组分成左右两部分，分别与这个基数比较大小，然后按需要的顺序交换元素的位置，重复上述步骤；

-   有原地排序和非原地排序的区别

1. 非原地排序

```js

```

2. 原地排序

```js
// min -> max
function devide(arr, start, end) {
	let baseIndex = Math.floor(start + (end - start) / 2),
		i = start,
		j = end;
	let base = arr[baseIndex];
	while (i < j) {
		// 找到左侧比base大的
		while (arr[i] < base) {
			i++;
		}
		// 找到右侧比base小的
		while (arr[j] > base) {
			j--;
		}
		// 交换此时的arr[i]和arr[j]
		if (i <= j) {
			[arr[i], arr[j]] = [arr[j], arr[i]];
			i++;
			j--;
		}
	}
	return i; // 此时arr[i]的位置就在它最终应该在的位置上
}

function quickSort(arr) {
	if (arr.length <= 1) return arr;
	const start = 0;
	const end = arr.length - 1;
	const index = devide(arr, start, end);
	if (start < index - 1) {
		quickSort(arr, start, index - 1);
	}
	if (end > index) {
		quickSort(arr, index, end);
	}
	return arr;
}
```

3. es6

```js
function quickSort(arr) {
	if (!arr.length) return [];
	const [pivot, ...rest] = arr;
	return [
		...quickSort(rest.filter((item) => item < pivot)),
		pivot,
		...quickSort(rest.filter((item) => item >= pivot)),
	];
}
```

### 插入排序

```js
function insertionSort(arr) {
	for (let i = 1; i < arr.length; i++) {
		const element = arr[i];
		let j = i - 1;
		for (j; j >= 0; j--) {
			const tmp = arr[j];
			const order = tmp - element;
			if (order > 0) {
				arr[j + 1] = tmp;
			} else {
				break;
			}
		}
		arr[j + 1] = element;
	}
	return arr;
}
```

### 归并排序

```js

```

### 堆排序

```js

```

### 睡眠排序

-   睡眠排序就是构造 n 个线程，让线程和排序的 n 个数对应。

-   例如对于[4,2,3,5,9]这样一组数字，就创建 5 个线程，每个线程睡眠 4s，2s，3s，5s，9s。这些线程睡醒之后，就把自己对应的数报出来即可。这样等所有线程都醒来，排序就结束了。

-   但睡眠排序由于多线程的问题，在真正实现上也有困难。
