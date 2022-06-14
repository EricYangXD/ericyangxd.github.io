---
title: 递归
author: EricYangXD
date: "2022-01-10"
---

## 递归解题思路

1. 每次写递归，都按照这三要素来写，可以保证大家写出正确的递归算法！

2. 确定递归函数的参数和返回值：

- 确定哪些参数是递归的过程中需要处理的，那么就在递归函数里加上这个参数， 并且还要明确每次递归的返回值是什么进而确定递归函数的返回类型。

3. 确定终止条件：

- 写完了递归算法, 运行的时候，经常会遇到栈溢出的错误，就是没写终止条件或者终止条件写的不对，操作系统也是用一个栈的结构来保存每一层递归的信息，如果递归没有终止，操作系统的内存栈必然就会溢出。

4. 确定单层递归的逻辑：

- 确定每一层递归需要处理的信息。在这里也就会重复调用自己来实现递归的过程。

## 口诀四步走

1. 确定递归终止条件
2. 进行当前层的操作
3. 下探进入下一层操作
4. 清理当前层的状态

## 岛屿问题

### 普通岛屿问题

使用深度遍历，遍历到一个岛屿之后+1，然后把这个岛屿「淹没」，然后继续向上下左右四个方向遍历，在这过程中注意判断好边界条件即可。

```js
// 主函数，计算岛屿数量
function numIslands(grid) {
	var res = 0;
	var m = grid.length,
		n = grid[0].length;
	// 遍历 grid
	for (var i = 0; i < m; i++) {
		for (var j = 0; j < n; j++) {
			if (grid[i][j] == "1") {
				// 每发现一个岛屿，岛屿数量加一
				res++;
				// 然后使用 DFS 将岛屿淹了
				dfs(grid, i, j);
			}
		}
	}
	return res;
}

// 从 (i, j) 开始，将与之相邻的陆地都变成海水
function dfs(grid, i, j) {
	var m = grid.length,
		n = grid[0].length;
	if (i < 0 || j < 0 || i >= m || j >= n) {
		// 超出索引边界
		return;
	}
	if (grid[i][j] == "0") {
		// 已经是海水了
		return;
	}
	// 将 (i, j) 变成海水
	grid[i][j] = "0";
	// 淹没上下左右的陆地
	dfs(grid, i + 1, j);
	dfs(grid, i, j + 1);
	dfs(grid, i - 1, j);
	dfs(grid, i, j - 1);
}
```

### 694.不同岛屿的数量

不考虑旋转对称等，只看形状是否一致。其实就是找到所有岛屿并对岛屿的序列化，然后去重，剩下的岛屿数量就是要返回的结果。

对于形状相同的岛屿，如果从同一起点出发，DFS 函数遍历的顺序肯定是一样的。因为遍历顺序是写死在 dfs 函数里的，不会动态改变。

```js
// TODO 代码有问题
function dfs(grid, i, j, str, dir) {
	var m = grid.length,
		n = grid[0].length;
	if (i < 0 || j < 0 || i >= m || j >= n) {
		// 超出索引边界
		return;
	}
	// 前序遍历位置：进入(i,j)
	grid[i][j] = 0;
	str.push(dir);

	dfs(grid, i - 1, j, str, 1); // up
	dfs(grid, i + 1, j, str, 2); // down
	dfs(grid, i, j - 1, str, 3); // left
	dfs(grid, i, j + 1, str, 4); // right
	// 后序遍历位置：离开(i,j)
	str.push(-dir);
}

// 主函数，计算岛屿数量
function numIslands(grid) {
	var res = [];
	var m = grid.length,
		n = grid[0].length;
	// 遍历 grid
	for (var i = 0; i < m; i++) {
		for (var j = 0; j < n; j++) {
			if (grid[i][j] == "1") {
				// 淹掉这个岛屿的同时存储到与序列化结果
				var arr = [];
				// 然后使用 DFS 将岛屿淹了
				dfs(grid, i, j, arr, 0);
				// 每发现一个岛屿，岛屿数量加一
				res.push(arr.toString());
			}
		}
	}
	return [...new Set(res)].length;
}
```

### 单个岛屿边长

1. 只有一个岛屿时，经观察可知，`岛屿边长 = 岛屿面积*4 - 临边数量*2`，所以先遍历二维数组，拿到倒数面积和临边数量--临边通过计算单位陆地的右边和下边是否有相邻陆地得到。

```js
function getIslandLen(grid) {
	let land = 0,
		border = 0;
	let m=grid.length,
	n=grid[0].length;
	for (let i=0; i<m; i++) {
		for (let j=0; j<n; j++) {
			if(grid[i][j]===1){
				land++;
			}
			if((i<m-1&&grid[i+1][j]===1)||(j<n-1grid[i][j+1]===1)){
				border++;
			}
		}
	}
	return 4*land - 2*border;
}
```

2. 多个岛屿，按上面的单个岛屿的计算方法分别计算。

### 字符串 010101 需要变换多少次

### 约数游戏 先手后手谁赢

### rand7 => rand10

### 排序奇升偶降链表
