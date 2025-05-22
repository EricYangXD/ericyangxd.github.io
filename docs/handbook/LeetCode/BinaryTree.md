---
title: LeetCode 算法学习记录
author: EricYangXD
date: "2021-12-29"
---

## 入门级算法

题目在 LeetCode 上，主要记个思路以及通用的解法

### 144.二叉树前序遍历

### 94.二叉树中序遍历

### 145.二叉树后序遍历

- 只要理解了前中后序遍历的顺序，用 DFS 一把梭。前序：根->左->右；中序：左->根->右；后序：左->右->根；

1. 递归：

```js
const parse = (root) => {
  if (!root) return [];
  const res = [];
  const dfs = (node) => {
    res.push(node.val); // 调整这个顺序即可
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return res;
};
```

- 借助一个栈来进行节点的存储

2. 迭代：

```js
const parse = (root) => {
  if (!root) return [];
  const res = [];
  const stack = [];
  while (root || stack.length) {
    // 前
    while (root) {
      stack.push(root);
      res.push(root.val); // 前序是一访问到节点就记录
      root = root.left;
    }
    root = stack.pop();
    root = root.right;
    // 中
    while (root) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    res.push(root.val); // 中序是等遍历到左侧最后一个节点时再开始记录
    root = root.right;
    // 后
    while (root) {
      stack.push(root);
      res.unshift(root.val); // 后序是一访问到节点就反向记录
      root = root.right;
    }
    root = stack.pop();
    root = root.left;
  }
  return res;
};
```

3. 颜色标记

```js
const parse = (root) => {
  if (!root) return [];
  const [WHITE, DARK] = [0, 1];
  let color, node;
  const res = [];
  const stack = [[WHITE, root]];
  while (stack.length) {
    [color, node] = stack.pop();
    if (!node) continue;
    // 当前指向的结点是未访问过的结点，将其右节点，根节点，左节点依次入栈(后入先出)
    // 前
    if (color === WHITE) {
      stack.push([WHITE, node.right]);
      stack.push([WHITE, node.left]);
      stack.push([DARK, node]);
    } else {
      res.push(node.val);
    }
    // 中
    if (color === WHITE) {
      stack.push([WHITE, node.right]);
      stack.push([DARK, node]);
      stack.push([WHITE, node.left]);
    } else {
      res.push(node.val);
    }
    // 后
    if (color === WHITE) {
      stack.push([DARK, node]);
      stack.push([WHITE, node.right]);
      stack.push([WHITE, node.left]);
    } else {
      res.push(node.val);
    }
  }
  return res;
};
```

4. Morris 算法

```js
// 中序
var inorderTraversal = function (root) {
  if (!root) return [];
  const res = [];
  let predecessor = null;
  while (root) {
    if (root.left) {
      predecessor = root.left;
      while (predecessor.right && predecessor.right !== root) {
        predecessor = predecessor.right;
      }
      if (!predecessor.right) {
        predecessor.right = root;
        root = root.left;
      } else {
        res.push(root.val);
        predecessor.right = null;
        root = root.right;
      }
    } else {
      res.push(root.val);
      root = root.right;
    }
  }
  return res;
};
```

### 102.二叉树层序遍历

```js
var levelOrder = function (root) {
  if (!root) return [];
  const res = [];
  const queue = [root];

  while (queue.length) {
    const levelSize = queue.length; // 表示当前这一层的节点数
    res.push([]); // 先把当前层的数组写入，然后利用res.length-1往里写数据
    for (let i = 0; i < levelSize; i++) {
      // 把当前层的所有节点都遍历一遍
      const node = queue.shift();
      res[res.length - 1].push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return res;
};
```

## 困难

### 297.二叉树的序列化与反序列化

- **字节**

1. 思路：DFS，序列化时深度遍历每个节点，如果是空就加 null，如果不是空就加 node.toString()，反序列化时先 split，然后 DFS，从左到右依次处理成 TreeNode，处理完了的节点需要 shift 移除。

```js
// Definition for a binary tree node.
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

// 序列化：Tree => String
const serialize = function (root) {
  return rserialize(root, "");
};

const rserialize = (root, str) => {
  if (root === null) {
    str += "null,";
  } else {
    str += root.val + "" + ",";
    str = rserialize(root.left, str);
    str = rserialize(root.right, str);
  }
  return str;
};

// 反序列化：String => Tree
const deserialize = function (data) {
  const dataArray = data.split(",");
  return rdeserialize(dataArray);
};

const rdeserialize = (dataList) => {
  if (dataList[0] === "null") {
    dataList.shift();
    return null;
  }
  const root = new TreeNode(parseInt(dataList[0]));
  dataList.shift();
  root.left = rdeserialize(dataList);
  root.right = rdeserialize(dataList);
  return root;
};
```

### 226. 翻转二叉树

```js
var invertTree = function (root) {
  if (!root) return root;

  invertTree(root.left);
  invertTree(root.right);

  const temp = root.left;
  root.left = root.right;
  root.right = temp;

  return root;
};
```
