---
title: 算法基础知识
author: EricYangXD
date: "2022-01-17"
---

## 时间复杂度

1. master 公式：`T(N) = a * T(N/b) + O(N^d)`，只要满足子问题是相等规模的问题，就可以用这个公式。
   - N: 母问题的数据规模
   - a: 母问题拆分成的相同规模的子问题的个数
   - b: 相同规模子问题的规模
   - O(N^d): 其他操作的时间复杂度
   - `log(b,a) > d` -> 复杂度为`O(N^log(b,a))`
   - `log(b,a) = d` -> 复杂度为`O(N^d * logN)`
   - `log(b,a) < d` -> 复杂度为`O(N^d)`

## 树 Tree

### B+树和 B 树的区别

- B-Tree 是一种自平衡的多叉树。每个节点都存储关键字值。其左子节点的关键字值小于该节点关键字值，且右子节点的关键字值大于或等于该节点关键字值。
- B+树也是是一种自平衡的多叉树。其基本定义与 B 树相同，不同点在于数据只出现在叶子节点，所有叶子节点增加了一个链指针，方便进行范围查询。
- B+树中间节点不存放数据，所以同样大小的磁盘页上可以容纳更多节点元素，访问叶子节点上关联的数据也具有更好的缓存命中率。并且数据顺序排列并且相连，所以便于区间查找和搜索。
- B 树每一个节点都包含 key 和 value，查询效率比 B+树高。

## 算法技巧

### 位运算符

一般用在比较值/数字是否相等、值的符号是否一致、交换、取整等。

1. `&`二进制按位与（AND）。
2. `|`二进制按位或（OR）。
3. `^`二进制按位异或（XOR）。
4. `~`按位非运算符。

- `n & (n - 1)`，如果为 0，说明 n 是 2 的整数幂
- 使用^来检查数字是否不相等
- 使用^判断符号是否相同:`(a ^ b) >= 0; // true 相同; false 不相同`
- 使用^来完成值交换:`a ^= b;b ^= a;a ^= b;`
- 使用~、>>、<<、>>>、|来取整,相当于使用了 Math.floor():`~~11.71`、`11.71 >> 0`、`11.71 << 0`、`11.71 | 0`、`11.71 >>> 0`
- 使用 & 判断奇偶性:偶数 & 1 = 0;奇数 & 1 = 1
- 使用 ^ 切换变量 0 或 1:`toggle ^= 1;`
- 使用左移运算符 << 迅速得出 2 的次方,但是要注意使用场景, 非 1 的数字，会改变首位的正负
- 取出二进制最右侧的 1：`let right = eor & (~eor + 1);`// eor 是两个奇数个数字异或的结果

### 前缀和

- 前缀和主要适用的场景是原始数组不会被修改的情况下，频繁查询某个区间的累加和。

- `prefix[0] === 0`，`prefix[i]`就代表着`nums[0..i-1]`所有元素的累加和，即前 i 个元素的累加和，如果我们想求区间`nums[i..j]`的累加和，只要计算`prefix[j+1] - prefix[i]`即可，而不需要遍历整个区间求和。

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

- 跟前缀和思想非常类似，差分数组的主要适用场景是频繁对原始数组的某个区间的元素进行增减。

- 这样构造差分数组 diff，就可以快速进行区间增减的操作，如果你想对区间`nums[i..j]`的元素全部加 3，那么只需要让`diff[i] += 3`，然后再让`diff[j+1] -= 3`即可.

- 原理很简单，回想 diff 数组反推 nums 数组的过程，`diff[i] += 3`意味着给`nums[i..]`所有的元素都加了 3，然后`diff[j+1] -= 3`又意味着对于`nums[j+1..]`所有元素再减 3，那综合起来，是不是就是对`nums[i..j]`中的所有元素都加 3 了？

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

### 3.无重复字符的最长子串

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (str) {
  if (!str) return 0;
  if (str.length === 1) return 1;

  const set = new Set(); // 哈希集合，记录每个字符是否出现过
  const strLen = str.length;
  let maxLen = 0,
    rk = -1; // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动

  for (let i = 0; i < strLen; i++) {
    if (i != 0) {
      set.delete(str[i - 1]); // 左指针向右移动一格，移除一个字符，滑动窗口
    }

    while (rk < strLen - 1 && !set.has(str[rk + 1])) {
      set.add(str[rk + 1]); // 不断地移动右指针，直到出现重复的字符或rk指针移动到最后一个字符
      rk++;
    }

    maxLen = Math.max(maxLen, rk - i + 1); // 取最大长度
  }
  return maxLen;
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

### 15.三数之和

题目：求数组中的三个数之和等于 0，且不重复的所有可能（顺序无关）。

题解：如果不是有序的，先排序。使用相向双指针加双层循环，外层循环固定一个数，然后内层循环用两个指针分别指向剩下的数中的最左侧和最右侧的数，相向而行，判断是否满足，如果满足条件但是有没有遍历完剩下的数字，则手动增减指针，直到遍历完全。对于优化：1. 重复的数字跳过 continue，2. 如果最小（升序排序左侧最小）的三个数字和大于 0，直接返回 break，因为后面的数字只能更大，不可能满足条件。3. 如果当前数字和最右侧最大的数字之和小于 0，则跳过当前数字 continue，因为当前数字后面的数字更大，才有可能满足条件。

```js
function threeSum(nums) {
  if (!nums || nums.length < 3) return [];
  // 有序的话就跳过
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        // 跳过相等的值
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        // 这是正常的前进（也可以先前进再判断）
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return res;
}
```

### 167. 有序数组两数之和

有序数组。双指针，相加和结果比较，如果大于 target，右指针左移，如果小于 target，左指针右移。

### 11. 盛最多水的容器

数组中的两个数和 x 轴构成盛水的容器，求最大的容量。

双指针，左右指针，计算面积取较大的值，然后移动较小的指针，直到两个指针相遇。

```js
var maxArea = function (height) {
  let left = 0;
  let right = height.length - 1;
  let max = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
};
```

### 42. 接雨水

题目：给定一个数组，数组中的每个数代表一个高度，求这个数组中能接到的雨水的总量。

```js
function catchRain(height) {
  if (!height.length) return 0;
  let left = 0;
  let right = height.length - 1;
  let leftMax = height[left];
  let rightMax = height[right];
  let res = 0;

  while (left < right) {
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);

    // 看哪边低，低的那边存水
    if (leftMax < rightMax) {
      res += Math.max(0, leftMax - height[left]);
      left++;
    } else {
      res += Math.max(0, rightMax - height[right]);
      right--;
    }
  }
  return res;
}
```

### 209. 长度最小的子数组

给定一个正整数数组和一个正整数 s，找到该数组中满足其和 ≥ s 的长度最小的连续子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

双指针，左指针和右指针，右指针向右移动，直到子数组的和大于等于 s，然后左指针向右移动，直到子数组的和小于 s，记录最小长度。重复这个过程，直到右指针到达数组末尾。

```js
function minSubArrayLen(s, nums) {
  let left = 0;
  let right = 0;
  let sum = 0;
  let minLen = Infinity;

  while (right < nums.length) {
    sum += nums[right];
    while (sum >= s) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
    right++;
  }

  return minLen === Infinity ? 0 : minLen;
}
```

### 283. 移动零

给定一个数组 nums，将数组中的所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

双指针，一个指针 i 遍历数组，另一个指针 j 记录非零元素的位置。当 i 遇到非零元素时，将其与 j 指向的元素交换，并将 j 向右移动一位。遍历结束后，j 及其右侧的元素都是 0。

```js
function moveZeroes(nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      j++;
    }
  }
}
```

### 713. 乘积小于 K 的子数组

给定一个正整数数组 nums 和一个整数 k，找到数组中乘积小于 k 的连续子数组的数量。如果不存在符合条件的子数组，返回 0。

双指针，左指针和右指针，右指针向右移动，直到子数组的乘积小于 k，然后左指针向右移动，直到子数组的乘积大于等于 k，记录子数组的数量。重复这个过程，直到右指针到达数组末尾。子数组的数量为右指针和左指针之间的距离。时间复杂度为 O(n)。空间复杂度为 O(1)。

```js
function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let left = 0;
  let right = 0;
  let product = 1;
  let count = 0;
  while (right < nums.length) {
    product *= nums[right];
    while (product >= k) {
      product /= nums[left];
      left++;
    }
    count += right - left + 1; // 经过推导：right-left+1就是子数组的数量
    right++;
  }
  return count;
}
```

### 34. 在排序数组中查找元素的第一个和最后一个位置

给定一个按照升序排列的整数数组 nums 和一个目标值 target，找出目标值在数组中的第一个和最后一个位置。如果数组中不存在目标值，返回 [-1, -1]。

二分法：先通过二分查找法找到 target 的位置，然后向左向右遍历找到第一个和最后一个 target 的位置。

```js
function searchRange(nums, target) {
  // 二分查找某个值在数组中的位置
  function lowerBound(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
      let mid = Math.floor(left + (right - left) / 2);
      if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    // 如果 left 越界，说明 target 不存在， 返回 nums.length
    return left;
  }

  const first = lowerBound(nums, target);
  const last = lowerBound(nums, target + 1);
  if (first === nums.length || nums[first] !== target) {
    return [-1, -1];
  }
  return [first, last - 1];
}
```

### 33. 搜索旋转排序数组

给定一个升序数组 nums，旋转后返回目标值 target 的索引。如果 target 不存在，返回 -1。

二分法：在常规二分查找的时候查看当前 mid 为分割位置分割出来的两个部分 [l, mid] 和 [mid + 1, r] 哪个部分是有序的，并根据有序的那个部分确定我们该如何改变二分查找的上下界，因为我们能够根据有序的那部分判断出 target 在不在这个部分：如果二分的位置在 target 及其右侧就把该位置染成蓝色，如果二分的位置在 target 及其左侧就把该位置染成红色。

红蓝染色法：是一种帮助理解二分查找边界问题的技巧，它的关键点是：

1. 把数组分成两部分，一部分是红色，一部分是蓝色。通过二分查找逐步逼近红蓝的交界点。
2. 通过 target 和 mid 以及 end（或者 start）的比较，确定 target 在红色还是蓝色部分。
3. 如果 target 在红色部分，则 right=mid-1，如果 target 在蓝色部分，则 left=mid+1。具体加减需要看 left 和 right 两个指针的初始值。可以使用`(-1, nums.length)`或`[0, nums.length-1]`来判断。

```js
function search(nums, target) {
  if (!nums || !nums.length) return -1;

  let left = 0;
  let right = nums.length - 1;
  // left <= right 是因为left和right相等时，也要判断nums[mid]和target是否相等，相等则会返回mid，所以需要包含相等的情况。
  // 关键就是这个题的需求是找出给定的target的索引，所以每个mid都要判断是否等于target。
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    }
    if (nums[0] <= nums[mid]) {
      if (nums[0] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[nums.length - 1]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}

// 把上面方法中的if判断抽取出来，单独判断isBlue(mid)
function search2(nums, target) {
  function isBlue(i) {
    // 主要目的是判断target在红色还是蓝色，以此来确定left和right的移动方向
    const end = nums[nums.length - 1];
    if (nums[i] > end) {
      return target <= nums[i] && target > end;
    } else {
      return target <= nums[i] || target > end;
    }
  }
  let left = -1;
  let right = nums.length;
  while (left + 1 < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (isBlue(mid)) {
      right = mid;
    } else {
      left = mid;
    }
  }
  if (right === nums.length || nums[right] !== target) {
    return -1;
  }
  return right;
}

// 使用辅助函数递归，不使用while循环
function search3(nums, target) {
  function helper(left, right, nums = nums, target = target) {
    if (left > right) return -1;
    let mid = Math.floor(left + (right - left) / 2);
    let midVal = nums[mid];
    let leftVal = nums[left];
    let rightVal = nums[right];

    if (midVal === target) return mid;
    if (leftVal === target) return left;
    if (rightVal === target) return right;

    if (midVal > leftVal) {
      if (target > leftVal && target < midVal) {
        return helper(left + 1, mid - 1);
      } else {
        return helper(mid + 1, right - 1);
      }
    } else {
      if (target < rightVal && target > midVal) {
        return helper(mid + 1, right - 1);
      } else {
        return helper(left + 1, mid - 1);
      }
    }
  }
  return helper(0, nums.length - 1);
}
```

### 153. 寻找旋转排序数组中的最小值

给定一个升序数组 nums，旋转后返回最小值。

二分法：mid 和 right 比较，如果 mid 小于 right，说明最小值在 mid 的左侧，否则在右侧。

```js
function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < nums[right]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return nums[left];
}
```

### 162. 寻找峰值

给定一个升序数组 nums，旋转后返回峰值。

二分法：mid 和 mid+1 比较，如果 mid 小于 mid+1，说明峰值在 mid 的右侧，否则在左侧。

```js
function findPeakElement(nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < nums[mid + 1]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left;
}
```

### 1765. 地图中的最高点

```js
var highestPeak = function (isWater) {
  const m = isWater.length;
  const n = isWater[0].length;

  // const isWater = new Array(m).fill(0).map(() => new Array(n).fill(0));
  const landsQueue = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 记下全部水域的坐标，看清题目
      if (isWater[i][j] === 1) {
        isWater[i][j] = 0;
        landsQueue.push([i, j]);
      } else {
        // 没被访问过的陆地起始为-1，水域在答案里要求为0
        isWater[i][j] = -1;
      }
    }
  }

  // 边界，上下左右
  const boundrys = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  // 初始高度（和水域相邻的点最高只能为1）
  let h = 1;
  while (landsQueue.length) {
    // 当前队列的大小，因为遍历中要往队列里添加元素（下一层），这样写是必要的（避免当前层和下一层的遍历混淆）
    let landsLength = landsQueue.length;
    while (landsLength--) {
      const land = landsQueue.shift();
      const [landX, landY] = land;

      for (let bound of boundrys) {
        const newLandX = landX + bound[0];
        const newLandY = landY + bound[1];
        // 判断相邻格子坐标是否越界
        if (newLandX < 0 || (newLandX >= m) | (newLandY < 0) || newLandY >= n) {
          continue;
        }
        // 下一个点已经被访问过了
        if (isWater[newLandX][newLandY] !== -1) {
          continue;
        }
        // 目前是bfs到nx，ny这个点最近的方式了，也就是该点最高的高度
        isWater[newLandX][newLandY] = h;
        // 作为下一层遍历的元素入队
        landsQueue.push([newLandX, newLandY]);
      }
    }
    // 陆地高度逐级累加
    h++;
  }
  return isWater;
};
```

### 64. 最小路径和

```js
// 记忆化搜索：递归 + 缓存
var minPathSum = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  // memo[i][j] 表示从 (i, j) 到终点的最小路径和。
  const memo = new Array(m).fill(0).map(() => new Array(n).fill(-1));

  function dfs(row, col) {
    // 如果到达终点，返回当前格子的值
    if (row === m - 1 && col === n - 1) {
      return grid[row][col];
    }

    // 如果超出边界，返回一个较大值（无效路径）
    if (row >= m || col >= n) {
      return Number.MAX_VALUE;
    }

    // 如果已经计算过，直接返回缓存值
    if (memo[row][col] !== -1) {
      return memo[row][col];
    }

    // 当前路径和为当前格子的值 + 向右或向下的最小路径和
    // 遍历时，只需要向下（上）或向右搜索，并将结果存储在缓存中。
    const right = dfs(row, col + 1);
    const down = dfs(row + 1, col);
    memo[row][col] = grid[row][col] + Math.min(right, down);

    return memo[row][col];
  }

  return dfs(0, 0);
};
```

### 236. 二叉树的最近公共祖先

```js
var lowestCommonAncestor = function (root, p, q) {
  if (!root || root === p || root === q) {
    return root;
  }
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) {
    return root;
  }
  return left || right;
};
```

### 235. 二叉搜索树的最近公共祖先

```

```
