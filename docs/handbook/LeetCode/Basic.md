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
  // 记录左右两边的最大值，用于比较
  let leftMax = height[left];
  let rightMax = height[right];
  let res = 0;
  // 双端指针，从两端向中间遍历，求出每个位置能接到的雨水量，然后求出最大值。
  while (left < right) {
    // 更新左右两边的最大值
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);

    // 看哪边低，低的那边存水
    if (leftMax < rightMax) {
      // 此时右侧的最大高度大于等于左侧的最大高度，说明水至多可以存到左侧最大高度，所以当前这个坑对应的存水量为 leftMax - height[left]
      res += Math.max(0, leftMax - height[left]);
      left++;
    } else {
      res += Math.max(0, rightMax - height[right]);
      right--;
    }
  }
  return res;
}

// 单调栈解法
var trap = function (height) {
  if (!height.length) return 0;
  const stack = [];
  let res = 0;

  for (let i = 0; i < height.length; i++) {
    const h = height[i];
    while (stack.length && h >= height[stack[stack.length - 1]]) {
      const bottom_h = height[stack.pop()];
      if (!stack.length) break;

      const left = stack[stack.length - 1];
      dh = Math.min(height[left], h) - bottom_h;
      res += dh * (i - left - 1);
    }
    stack.push(i);
  }
  return res;
};
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

```js
var lowestCommonAncestor = function (root, p, q) {
  if (!root || root === p || root === q) {
    return root;
  }

  const val = root.val;
  if (p.val < val && q.val < val) {
    // 说明都在左子树
    return lowestCommonAncestor(root.left, p, q);
  }
  if (p.val > val && q.val > val) {
    // 说明都在右子树
    return lowestCommonAncestor(root.right, p, q);
  }
  // 否则，说明p和q分别在root的左子树和右子树，返回root
  return root;
};
```

### 215. 数组中的第 K 个最大元素

TopK 问题

1. 基础做法：排序，取第 K 个数
2. 通过构建大顶堆或者小顶堆，然后遍历数组，最后返回堆顶元素。难度在于掌握构建大顶堆或者小顶堆。

- 求第 K 个最小值就构造前 k 个最小元素大顶堆，取堆顶
- 求第 K 个最大值就构造前 k 个最大元素小顶堆，取堆顶

```js
// 1.
let findKthLargest = function (nums, k) {
  nums.sort((a, b) => b - a).slice(0, k);
  return nums[k - 1];
};
// 2.1 先构建小顶堆
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentNodeIndex(childIdx) {
    return Math.floor((childIdx - 1) / 2);
  }

  getLeftNodeIndex(parentIdx) {
    return parentIdx * 2 + 1;
  }
  getRightNodeIndex(parentIdx) {
    return parentIdx * 2 + 2;
  }

  peek() {
    // 如果堆为空，返回 null
    return this.size() > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  add(val) {
    this.heap.push(val);
    this.up(this.heap.length - 1);
  }

  up(idx) {
    // 根节点，无需上移
    if (idx === 0) {
      return;
    }
    const parentIdx = this.getParentNodeIndex(idx);
    if (this.heap[parentIdx] > this.heap[idx]) {
      this.swap(parentIdx, idx);
      // 递归上移，因为这时候值已经交换了，所以用parentIdx，此时heap[parentIdx]的值才是我们刚刚插入的那个值
      this.up(parentIdx);
    }
  }

  pop() {
    // 如果堆为空，返回 null
    if (this.size() === 0) {
      return null;
    }
    // 保存根节点
    const root = this.heap[0];
    // 将堆的最后一个元素放到根节点
    const lastElement = this.heap.pop();

    if (this.size() > 0) {
      // 重新赋值根节点
      this.heap[0] = lastElement;
      // 向下调整
      this.down(0);
    }
    // 返回原根节点
    return root;
  }

  down(idx) {
    const leftIdx = this.getLeftNodeIndex(idx);
    const rightIdx = this.getRightNodeIndex(idx);
    // 假设当前节点为最小值，要跟左右子节点比较，找到三者中的最小值
    let smallestIdx = idx;

    // 仅在左子节点存在时比较
    if (leftIdx < this.size() && this.heap[smallestIdx] > this.heap[leftIdx]) {
      smallestIdx = leftIdx;
    }
    // 仅在右子节点存在时比较，注意如果之前左子节点leftIdx比smallestIdx（idx）小，则smallestIdx（idx）已经被赋值成leftIdx了
    if (rightIdx < this.size() && this.heap[smallestIdx] > this.heap[rightIdx]) {
      smallestIdx = rightIdx;
    }
    // 如果当前节点不是最小值，进行交换
    if (smallestIdx !== idx) {
      this.swap(idx, smallestIdx);
      // 递归向下调整
      this.down(smallestIdx);
    }
  }

  swap(a, b) {
    const temp = this.heap[a];
    this.heap[a] = this.heap[b];
    this.heap[b] = temp;
  }
}

// 2.2 调用小顶堆
var findKthLargest = function (nums, k) {
  if (nums.length === 0) return;
  const heap = new MinHeap();
  for (let i = 0; i < nums.length; i++) {
    heap.add(nums[i]);
    if (heap.size() > k) {
      heap.pop();
    }
  }
  return heap.peek();
};

// 3. 快速选择算法，找到第 k 大的元素
var findKthLargest = function (nums, k) {
  const n = nums.length;
  return quickselect(nums, 0, n - 1, n - k); // 调用 quickselect 寻找第 n-k 小的元素
};

function quickselect(nums, l, r, k) {
  if (l === r) return nums[k]; // 递归终止条件，找到第 k 大的元素

  const x = nums[l]; // 选择第一个元素作为枢轴
  let i = l - 1,
    j = r + 1;

  // 快速排序的划分过程
  while (i < j) {
    do i++;
    while (nums[i] < x); // 找到大于等于枢轴的元素
    do j--;
    while (nums[j] > x); // 找到小于等于枢轴的元素

    // 交换 nums[i] 和 nums[j]
    if (i < j) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }

  // 递归查找，确定第 k 大元素的位置
  if (k <= j) {
    return quickselect(nums, l, j, k); // 第 k 大元素在左边
  } else {
    return quickselect(nums, j + 1, r, k); // 第 k 大元素在右边
  }
}
```

### 46. 全排列

```js
// 代码随想录解法模板：性能好
var permute = function (nums) {
  const res = [],
    path = [];
  backtracking(nums, nums.length, []);
  return res;

  function backtracking(n, k, used) {
    // path.length === nums.length，此时说明找到了一组
    if (path.length === k) {
      // 浅拷贝path，因为后面会继续使用它，否则会出问题。
      res.push([...path]);
      return;
    }
    for (let i = 0; i < k; i++) {
      if (used[i]) continue;
      path.push(n[i]);
      used[i] = true; // 同支
      backtracking(n, k, used);
      path.pop();
      used[i] = false; // 找到一个之后，下轮次还可以继续用
    }
  }
};

// deepseek模板：性能差
function permute(arr) {
  if (!arr || !arr.length) return arr;

  const res = [];
  function backtrack(start) {
    // 说明已经生成了一个完整的排列
    if (start === arr.length) {
      // push一个新的数组，浅拷贝
      res.push([...arr]);
      return;
    }
    // 遍历数组，交换元素，生成所有可能的排列
    for (let i = start; i < arr.length; i++) {
      // 先交换元素
      [arr[start], arr[i]] = [arr[i], arr[start]];
      // 递归生成下一个位置的排列
      backtrack(start + 1);
      // 回溯，回复数组状态
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }
  backtrack(0);
  return res;
}
```

### 17. 电话号码的字母组合

每个数字按键上都有对应的几个字母，输入几个数字 0-9，可以得到几个字母的组合，输出可能的所有组合。0 和 1 上没有字母。

通过一个数组来记录所有的按键，通过数组下标表示对应的数字。

```js
const MAPPING = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
function letterCombinations(digits) {
  if (!digits || digits.length === 0) return [];
  const len = digits.length;
  const res = [];
  const path = [];

  function backtrack(start) {
    if (start === len) {
      res.push(path.join(""));
      return;
    }
    const str = MAPPING[digits[start]];
    for (let i = 0; i < str.length; i++) {
      path[start] = str[i];
      backtrack(start + 1);
    }
  }

  backtrack(0);
}
```

### 300. 最长递增子序列

Vue3 中的 diff 算法就是使用了最长递增子序列的算法。

```js
var lengthOfLIS = function (nums) {
  if (!nums || !nums.length) return nums;

  const results = [[nums[0]]];

  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    update(n);
  }

  function update(n) {
    for (let j = results.length - 1; j >= 0; j--) {
      const line = results[j];
      const tail = line[line.length - 1];
      if (n > tail) {
        results[j + 1] = [...line, n];
        break;
      } else if (n < tail && j === 0) {
        results[j] = [n];
      }
    }
  }

  return results[results.length - 1].length;
};
```

### 77. 组合

组合问题就是从数组中选出 n 个元素，然后组成一个数组。

给定两个整数 n 和 k，返回范围`[1, n]`中所有可能的 k 个数的组合。

```js
var combine = function (n, k) {
  if (!n || !k) return [];
  const res = [];
  const path = [];

  function backtrack(start) {
    // 剪枝：剩余数字数量不够时，直接返回
    if (start < k - path.length) {
      return;
    }
    if (path.length === k) {
      res.push([...path]);
      return;
    }
    // 倒序遍历逻辑更好写
    for (let i = start; i; i--) {
      path.push(i);
      backtrack(i - 1);
      path.pop();
    }
  }

  backtrack(n);
  return res;
};
```

### 216. 组合总和 III

组合总和 III 是一个常见的面试题，题目要求找出所有和为 target 的 k 个数的组合，只使用 0-9 且满足 k 个数互不相同。

```js
var combine = function (n, k) {
  if (!n || !k) return [];
  const res = [];
  const path = [];

  function backtrack(start, t) {
    // 剪枝：剩余数字数量不够时，直接返回
    if (start < k - path.length) {
      return;
    }
    // 剪枝：t<0 时，直接返回
    if (t < 0) {
      return;
    }
    // 剪枝：t>剩余的数字之和时，直接返回
    if (t > Math.floor(((start * 2 - k + path.length + 1) * (k - path.length)) / 2)) {
      return;
    }
    if (path.length === k) {
      res.push([...path]);
      return;
    }
    // 倒序遍历逻辑更好写
    for (let i = start; i; i--) {
      path.push(i);
      backtrack(i - 1, t - i);
      path.pop();
    }
  }

  backtrack(9, n);
  return res;
};
```

### 22. 括号生成

括号生成问题就是给定一个数字 n，返回所有可能的 n 对括号组成的有效组合。

括号生成问题可以使用回溯算法解决，回溯算法的核心思想是尝试所有可能的情况，然后根据情况判断是否满足要求。

```js
var generateParenthesis = function (n) {
  if (!n) return [];
  const res = [];
  const path = [];

  // open是左括号的个数，i是当前在path中的下标位置，也可用push/pop
  function backtrack(i, left) {
    if (i === 2 * n) {
      res.push(path.join(""));
      return;
    }
    // 左括号个数小于n时，可以添加左括号
    if (left < n) {
      path[i] = "(";
      backtrack(i + 1, left + 1);
    }
    // 只有右括号的个数小于左括号的个数时，才可以添加右括号，因为到当前这个位置时已经放了open个左括号，所以右括号的个数是i-open。
    if (i - left < left) {
      path[i] = ")";
      backtrack(i + 1, left);
    }
  }

  backtrack(0, 0);
  return res;
};
```

### 51. N 皇后

N 皇后问题是一个经典的问题，要求在 n x n 的棋盘上放置 n 个皇后，使得皇后之间没有冲突。解决这个问题的关键是找到一种合适的放置方式，使得皇后之间没有冲突。

```js
var solveNQueens = function (n) {
  if (!n) return [];
  const res = [];
  const queens = Array(n).fill(0); // 皇后放在(row, queens[row])
  const column = Array(n).fill(false);
  const diag1 = Array(n * 2 - 1).fill(false); // 标记之前放置的皇后的行号加列号
  const diag2 = Array(n * 2 - 1).fill(false); // 标记之前放置的皇后的行号减列号

  function backtrack(row) {
    if (row === n) {
      res.push(queens.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)));
      return;
    }
    // 在(row, col)放皇后
    for (let col = 0; col < n; col++) {
      // 行号-列号+n-1保证数组下标>=0，最大值就是n-0+n-1 = n * 2 - 1，即diag数组的长度
      const rc = row - col + n - 1;
      // 判断能否放皇后
      if (!column[col] && !diag1[row + col] && !diag2[rc]) {
        // 直接覆盖，无需恢复现场
        queens[row] = col;
        // 皇后占用了col列和两条斜线
        column[col] = diag1[row + col] = diag2[rc] = true;
        backtrack(row + 1);
        // 恢复现场
        column[col] = diag1[row + col] = diag2[rc] = false;
      }
    }
  }

  backtrack(0);
  return res;
};
```

### 198. 打家劫舍

打家劫舍问题是一个经典的动态规划问题。

```js
// 递归解法，通过map缓存计算结果，否则会超时
var rob = function (nums) {
  if (!nums) return;
  const len = nums.length;
  const cache = new Map();
  function dfs(i) {
    // 递归终止条件
    if (i < 0) {
      return 0;
    }
    // 缓存
    if (cache.has(i)) {
      return cache.get(i);
    }
    // 递归表达式
    const res = Math.max(dfs(i - 1), dfs(i - 2) + nums[i]);
    cache.set(i, res);
    return res;
  }

  return dfs(len - 1);
};
```

### 122. 买卖股票的最佳时机 II

```js
var maxProfit = function (prices) {
  // const cache = new Map(); // 每天需要存持有和不持有两个状态，所以用map不行，要二维数组。
  const n = prices.length;
  // hold:持有=1，不持有=0；
  const cache = new Array(n).fill(null).map(() => [-1, -1]);
  function dfs(i, hold) {
    if (i < 0) {
      return hold ? -Infinity : 0;
    }

    if (cache[i][hold] !== -1) {
      return cache[i][hold];
    }
    let profit;
    if (hold) {
      // 昨天一直持有没买没卖或者昨天刚刚买入扣掉股票价格-->最终第i天持有股票
      profit = Math.max(dfs(i - 1, 1), dfs(i - 1, 0) - prices[i]);
    } else {
      // 昨天一直就没有持有股票或者昨天有但是卖掉了则加上股票价格-->最终第i天不持有股票
      profit = Math.max(dfs(i - 1, 0), dfs(i - 1, 1) + prices[i]);
    }
    cache[i][hold] = profit;
    return profit;
  }
  // 最后一天肯定不能持有股票
  return dfs(prices.length - 1, 0);
};
```

### 309. 买卖股票的最佳时机含冷冻期

只能隔天卖出，类似打家劫舍

```js
var maxProfit = function (prices) {
  // 类似于打家劫舍，从后往前递归，取i-2
  const n = prices.length;
  const cache = new Array(n).fill(null).map(() => [-1, -1]);

  function dfs(i, hold) {
    if (i < 0) {
      return hold ? -Infinity : 0;
    }
    if (cache[i][hold] !== -1) {
      return cache[i][hold];
    }
    let profit;
    if (hold) {
      // 买入必须隔天，所以要计算i-2
      profit = Math.max(dfs(i - 1, 1), dfs(i - 2, 0) - prices[i]);
    } else {
      profit = Math.max(dfs(i - 1, 0), dfs(i - 1, 1) + prices[i]);
    }
    cache[i][hold] = profit;
    return profit;
  }
  return dfs(n - 1, 0);
};
```

### 188. 买卖股票的最佳时机 IV

有 k 次交易的限制，借助三维数组存储状态，和上一题的思路一样。

```js
var maxProfit = function (k, prices) {
  const n = prices.length;
  // hold:持有=1，不持有=0；
  const cache = new Array(n).fill(null).map(() =>
    Array(k + 1)
      .fill(null)
      .map(() => [-1, -1])
  );
  function dfs(i, j, hold) {
    if (j < 0) {
      return -Infinity;
    }
    if (i < 0) {
      return hold ? -Infinity : 0;
    }

    if (cache[i][j][hold] !== -1) {
      return cache[i][j][hold];
    }
    let profit;
    if (hold) {
      // 昨天一直持有没卖或者昨天买入则扣掉股票价格-->最终第i天结束时持有股票
      profit = Math.max(dfs(i - 1, j, 1), dfs(i - 1, j, 0) - prices[i]);
    } else {
      // 昨天一直就没有持有股票或者昨天有但是卖掉了则加上股票价格-->最终第i天结束时不持有股票
      // 买入一次+卖出一次算一笔交易，只在买入的时候计算次数即可
      profit = Math.max(dfs(i - 1, j, 0), dfs(i - 1, j - 1, 1) + prices[i]);
    }
    cache[i][j][hold] = profit;
    return profit;
  }
  // 最后一天肯定不能持有股票，考虑到当天买卖没有实际意义
  return dfs(prices.length - 1, k, 0);
};
```

### 516. 最长回文子序列

回文子序列问题，就是求最长的回文子序列，即子序列中的字符是回文的。子序列和子串不是一回事！！！

1. 翻转字符串，然后求最长公共子序列。
2. 动态规划求解。

```js
// 递推
const longestPalindromeSubseq = (s) => {
  const n = s.length;
  const dp = Array.from(Array(n), () => Array(n).fill(0));

  // 遍历i的时候一定要从下到上遍历，这样才能保证，下一行的数据是经过计算的。
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[0][n - 1];
};
```

### 1143. 最长公共子序列

模板解法，适用于最长公共子序列问题。

```js
var longestCommonSubsequence = function (text1, text2) {
  const m = text1.length;
  const n = text2.length;

  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    const c1 = text1[i - 1];
    for (let j = 1; j <= n; j++) {
      const c2 = text2[j - 1];
      if (c1 === c2) {
        // text1与text2字符相同时 最长公共子序列长度+1
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // text1与text2字符不同时 返回text1或text2向前减少一位之后的最长公共子序列中的较大者
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
};
```

### 55. 跳跃游戏

```js
var canJump = function (nums) {
  let cover = 0;
  for (let i = 0; i < nums.length; i++) {
    // 判断：如果cover<i，说明走不到这里，直接返回false
    if (i <= cover) {
      // nums[i]+i -- 即当前这个值加上他的下标
      // 这样就省去了后面对剩余长度的计算，统一比较数组的整体长度
      cover = Math.max(nums[i] + i, cover);
      if (cover >= nums.length - 1) {
        return true;
      }
    }
  }

  return false;
};
```

### 455. 分发饼干

```js
var findContentChildren = function (g, s) {
  // g: 孩子胃口数组
  // s: 饼干尺寸数组

  // 先排序，然后遍历饼干尺寸
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);

  let count = 0;
  for (let i = 0, j = 0; i < s.length && j < g.length; i++) {
    if (s[i] >= g[j]) {
      count++;
      j++;
    }
  }
  return count;
};
```

### 1039. 多边形三角剖分的最低得分

```js
var minScoreTriangulation = function (values) {
  const n = values.length;
  const memo = new Map();
  const dp = (i, j) => {
    // 相邻的两个点
    if (i + 2 > j) {
      return 0;
    }
    // 正好形成一个三角形
    if (i + 2 === j) {
      return values[i] * values[j] * values[i + 1];
    }
    const key = i * n + j;

    if (!memo.has(key)) {
      let minScore = Number.MAX_VALUE;
      for (let k = i + 1; k < j; k++) {
        minScore = Math.min(minScore, values[i] * values[j] * values[k] + dp(i, k) + dp(k, j));
      }
      memo.set(key, minScore);
    }
    return memo.get(key);
  };

  return dp(0, n - 1);
};
```

### 543. 二叉树的直径

```js
var diameterOfBinaryTree = function (root) {
  let res = 0;

  const dfs = (node) => {
    if (!node) return -1;

    const lMax = dfs(node.left) + 1;
    const rMax = dfs(node.right) + 1;

    res = Math.max(res, lMax + rMax);
    return Math.max(lMax, rMax);
  };

  dfs(root);
  return res;
};
```

### 124. 二叉树中的最大路径和

```js
var maxPathSum = function (root) {
  let res = -Infinity;

  const dfs = (node) => {
    if (!node) {
      return 0;
    }
    const lMax = dfs(node.left);
    const rMax = dfs(node.right);

    res = Math.max(res, lMax + rMax + node.val);
    // 链的节点值不能为负数，所以和0取最大值
    return Math.max(Math.max(lMax, rMax) + node.val, 0);
  };

  dfs(root);
  return res;
};
```

### 337. 打家劫舍 III

通过选或不选，枚举选哪个等方式来解决。

```js
var rob = function (root) {
  if (!root) return 0;

  const dfs = (node) => {
    if (!node) return [0, 0];
    const [l_rob, l_not_rob] = dfs(node.left);
    const [r_rob, r_not_rob] = dfs(node.right);

    const rob = node.val + l_not_rob + r_not_rob;
    const not_rob = Math.max(l_rob, l_not_rob) + Math.max(r_rob, r_not_rob);

    return [rob, not_rob];
  };

  return Math.max(...dfs(root));
};
```

### 968. 监控二叉树

```js
var minCameraCover = function (root) {
  const dfs = (node) => {
    // 返回三个值：当前节点安装时的最小值，当前节点的父节点安装时的最小值，当前节点的子节点安装时的最小值
    if (!node) return [Infinity, 0, 0];
    const [l_choose, l_by_father, l_by_children] = dfs(node.left);
    const [r_choose, r_by_father, r_by_children] = dfs(node.right);
    // 当前节点安装的话，就要1加上左子树的最小值再加上右子树的最小值
    const choose = Math.min(l_choose, l_by_father, l_by_children) + Math.min(r_choose, r_by_father, r_by_children) + 1;
    // 当前节点的父节点安装的话，当前节点不用安装，只需考虑左子树装或不装的最小值加上右子树装或不装的最小值
    const by_father = Math.min(l_choose, l_by_children) + Math.min(r_choose, r_by_children);
    // 当前节点的子节点安装的话，只需考虑左边装右边不装，左边不装右边装，和左右都装的最小值
    const by_children = Math.min(l_choose + r_by_children, l_by_children + r_choose, l_choose + r_choose);
    return [choose, by_father, by_children];
  };
  // 根节点没有父节点
  const [choose, by_father, by_children] = dfs(root);
  return Math.min(choose, by_children);
};
```

### 739. 每日温度

1. 单调栈：

```js
// 逆序遍历
var dailyTemperatures = function (temperatures) {
  const len = temperatures.length;
  const res = new Array(len).fill(0);
  const stack = [];

  for (let i = len - 1; i >= 0; i--) {
    const t = temperatures[i];
    // 栈里存的是对应温度的下标
    // 使用单调栈，栈内元素要保持有序，从后往前比较，如果当前温度高于栈顶温度，栈顶元素出栈
    // 出栈的这些元素说明后面没有比他们更大的了，初始化的res已经填上了0，就不用管了。
    while (stack.length > 0 && t >= temperatures[stack[stack.length - 1]]) {
      stack.pop();
    }
    // 如果当前温度低于栈顶温度，则计算当前的下标和栈顶温度对应的下标之差
    if (stack.length > 0) {
      res[i] = stack[stack.length - 1] - i;
    }
    stack.push(i);
  }

  return res;
};

// 顺序遍历
var dailyTemperatures = function (temperatures) {
  const len = temperatures.length;
  const res = new Array(len).fill(0);
  const stack = [];
  // 从左到右遍历
  for (let i = 0; i < len; i++) {
    const t = temperatures[i];
    while (stack.length > 0 && t > temperatures[stack[stack.length - 1]]) {
      // 保证栈顶元素是最大的，所以如果当前遍历的这个元素t如果小于栈顶元素，则说明它并不满足条件，反之，如果他比栈顶的元素大，那说明他比栈内所有元素都大，所以可以计算出当前下标和栈顶下标的差值，并更新res
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
};
```

### 239. 滑动窗口最大值

1. 暴力解法：根据窗口大小分割子数组，求出每个子数组的最大值并记录
2. 单调队列：维护一个单调队列，队头元素最大，根据窗口的大小，达到阈值之后每滑动一次就更新队列入队和出队，使其保持单调递减，并记录此时队头最大元素

```js
var maxSlidingWindow = function (nums, k) {
  // 单调队列：及时去掉无用数据，保证双端队列有序
  const res = [];
  const queue = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // in 入（元素进入队尾，同时维护队列单调性）
    while (queue.length && num >= nums[queue[queue.length - 1]]) {
      queue.pop(); // 维护 q 的单调性
    }
    queue.push(i); // 入队
    // out 出（元素离开队首）
    if (i - queue[0] >= k) {
      // 队首已经离开窗口了
      queue.shift();
    }
    // record 记录/维护答案（根据队首）
    if (i >= k - 1) {
      // 由于队首到队尾单调递减，所以窗口最大值就是队首
      res.push(nums[queue[0]]);
    }
  }
  return res;
};
```
