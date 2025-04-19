---
title: 前端面试题1
author: EricYangXD
date: "2022-04-09"
meta:
  - name: keywords
    content: 前端面试题
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

### 求相同连续字符串的最大长度

- 双指针法，时间复杂度 O(n)

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

- 双循环，跳步，使时间复杂度降到 O(n)

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

### 删除链表中所有给定的某个值

给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。

- 递归

```js
var deleteNode = function (head, val) {
  if (!head) return head;
  head.next = deleteNode(head.next, val);
  return head.val === val ? head.next : head;
};
```

### 删除链表倒数第 N 个节点

- 假设 N `<=` 链表长度。通过快慢指针，快指针先走 n+1 步，使快慢指针之间有 N 个节点，然后两个指针一起右移直到快指针指向 null，这时慢指针的下一个节点就是要删除的节点，让 slow.next=slow.next.next 即可，中间要注意删除 head 节点的情况。

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

- 通过快慢指针寻找链表中点：快指针每次移动 2 步，慢指针每次移动 1 步

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

- 递归或循环的方式两两合并即可

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

### 25. K 个一组翻转链表

```js
var reverseKGroup = function (head, k) {
  if (!head || !head.next) return head;

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

// 2.
var reverseKGroup = function (head, k) {
  if (!head || !head.next) return head;

  const dummy = new ListNode(-1, head);
  let p0 = dummy;
  let cur = head;
  let len = 0;
  while (cur) {
    len++;
    cur = cur.next;
  }

  while (len >= k) {
    len -= k;

    let pre = null;
    cur = p0.next;

    for (let i = 0; i < k; i++) {
      const next = cur.next;
      cur.next = pre;
      pre = cur;
      cur = next;
    }

    const nxt = p0.next;
    p0.next.next = cur;
    p0.next = pre;
    p0 = nxt;
  }

  return dummy.next;
};
```

### 141. 环形链表

- 快慢指针判断链表有没有环，有环的话两个指针肯定会相遇（套圈），无环的话会退出。

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

### 142. 环形链表 2

如果有环，则返回环的入口节点。如果没有则返回 null。

- 快慢指针判断链表有没有环，有环的话两个指针肯定会相遇（套圈），无环的话会退出。
- 当快慢指针相遇时，将快指针重新指向头节点，然后快慢指针每次移动一步，当再次相遇时，就是环的入口节点。(数学计算出来的)

```js
var detectCycle = function (head) {
  if (!head || !head.next) return null;

  let fast = head;
  let slow = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (fast === slow) {
      while (slow !== head) {
        slow = slow.next;
        head = head.next;
      }
      return slow;
    }
  }
  return null;
};
```

### 143. 重排链表

```js
function findCenter(head) {
  let slower = head,
    faster = head;
  while (faster && faster.next) {
    slower = slower.next;
    faster = faster.next.next;
  }
  return slower;
}
function reverse(head) {
  let prev = null,
    cur = head,
  while (cur != null) {
   let nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }
  return prev;
}
function reorderList(head) {
  if (!head || !head.next) return head;
  let mid = findCenter(head);
  let head2 = reverse(mid);
  while (head2.next) {
    let nxt = head.next;
    let nxt2 = head2.next;
    head.next = head2;
    head2.next = nxt;
    head = nxt;
    head2 = nxt2;
  }
}
```

### 排序链表

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
  while (faster && faster.next) {
    slower = slower.next;
    faster = faster.next.next;
  }
  return slower;
}
```

### 相交链表

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

### 98. 验证二叉搜索树

二叉搜索树的定义：左子节点小于父节点，右子节点大于父节点。

可以根据深度优先遍历的三种方式：前中后序遍历来验证：

- 前序遍历：根节点，左子树，右子树；先判断再递归，
- 中序遍历：左子树，根节点，右子树；中序遍历是递增序列，所以可以判断当前节点是不是大于上一个节点
- 后序遍历：左子树，右子树，根节点；先递归再判断，把边界带上去

```js
// 后序
var isValidBST = function (root) {
  function dfs(node) {
    if (node == null) {
      return [Infinity, -Infinity];
    }
    const [lMin, lMax] = dfs(node.left);
    const [rMin, rMax] = dfs(node.right);
    const x = node.val;
    // 也可以在递归完左子树之后立刻判断，如果发现不是二叉搜索树，就不用递归右子树了
    if (x <= lMax || x >= rMin) {
      return [-Infinity, Infinity];
    }
    return [Math.min(lMin, x), Math.max(rMax, x)];
  }
  return dfs(root)[1] !== Infinity;
};
// 中序
var isValidBST = function (root) {
  if (!root) return true;
  let pre = -Infinity;

  function dfs(node) {
    if (!node) return true;
    if (!dfs(node.left) || node.val <= pre) return false;
    pre = node.val;
    return dfs(node.right);
  }

  return dfs(root);
};
// 前序
var isValidBST = function (root, left = -Infinity, right = Infinity) {
  if (!root) return true;

  const val = root.val;
  return left < val && val < right && isValidBST(root.left, left, val) && isValidBST(root.right, val, right);
};
```

### 235. 二叉搜索树的最近公共祖先

```js

```

### 236. 二叉树的最近公共祖先

```js

```

### 寻找 2 个升序数组的中位数

- 暴力求解，先合并再计算中位数
- 双指针，都从头开始比较，谁小就向右移动谁的指针，直到第(m+n)/2 次
- 二分查找
- 类似求第 K 小的值的算法

```js
// 二分 O(log(min(m,n)))
var findMedianSortedArrays = function (nums1, nums2) {
  // nums1长度比nums2小
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }

  let m = nums1.length;
  let n = nums2.length;
  // 在0～m中查找
  let left = 0;
  let right = m;

  // median1：前一部分的最大值
  // median2：后一部分的最小值
  let median1 = 0;
  let median2 = 0;

  while (left <= right) {
    // 前一部分包含 nums1[0 .. i-1] 和 nums2[0 .. j-1]
    // 后一部分包含 nums1[i .. m-1] 和 nums2[j .. n-1]
    const i = left + Math.floor((right - left) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;

    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];

    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];

    if (maxLeft1 <= minRight2) {
      median1 = Math.max(maxLeft1, maxLeft2);
      median2 = Math.min(minRight1, minRight2);
      left = i + 1;
    } else {
      right = i - 1;
    }
  }
  return (m + n) % 2 == 0 ? (median1 + median2) / 2 : median1;
};

// 双指针 O(m+n)
var findMedianSortedArrays = function (nums1, nums2) {
  let n1 = nums1.length;
  let n2 = nums2.length;

  // 两个数组总长度
  let len = n1 + n2;

  // 保存当前移动的指针的值(在nums1或nums2移动)，和上一个值
  let preValue = -1;
  let curValue = -1;

  //  两个指针分别在nums1和nums2上移动
  let point1 = 0;
  let point2 = 0;

  // 需要遍历len/2次，当len是奇数时，最后取curValue的值，是偶数时，最后取(preValue + curValue)/2的值
  for (let i = 0; i <= Math.floor(len / 2); i++) {
    preValue = curValue;
    // 需要在nums1上移动point1指针
    if (point1 < n1 && (point2 >= n2 || nums1[point1] < nums2[point2])) {
      curValue = nums1[point1];
      point1++;
    } else {
      curValue = nums2[point2];
      point2++;
    }
  }

  return len % 2 === 0 ? (preValue + curValue) / 2 : curValue;
};
```

### 寻找关联子串的位置

给定两个字符串 str1 和 str2，如果字符串 str1 中的字符，经过排列组合后的字符串中，只要有一个字符串是 str2 的子串，则认为 str1 是 str2 的关联子串。

若 str1 是 str2 的关联子串，请返回子串在 str2 的起始位置；若 str2 中有多个 str1 的组合子串，请返回最小的起始位置。若不是关联子串，则返回-1。

```js
function findSubstring(s1, s2) {
  const l1 = s1.length;
  const l2 = s2.length;
  let result = -1;
  const target = s1.split("").sort().join("");
  for (let i = 0; i < l2 - l1; i++) {
    const s = s2.substring(i, i + l1);
    const t = s.split("").sort().join("");
    if (target === t) {
      result = i;
      break;
    }
  }
  console.log(result);
}

const testList = [
  { str1: "abc", str2: "efghicabiii" },
  { str1: "abc", str2: "efghicaibii" },
];
testList.forEach((v) => {
  const { str1, str2 } = v;
  findSubstring(str1, str2);
});
```

### 深度优先遍历 DOM 节点

- el.childNodes:获取全部节点，包括 element 节点、注释节点、文本节点等等，返回的是：NodeList[]
- el.children:只获取 element 节点，不获取注释节点、文本节点，返回的是：HTMLCollection[]

```js
// 递归
function dfs1(root) {
  visitNode(root);
  const childNodes = root.childNodes; // childNodes与children不同！
  if (childNodes.length) {
    childNodes.forEach((child) => {
      dfs1(child); // 递归
    });
  }
}
// 不用递归，用栈
function dfs2(root) {
  const stack = [];
  // 根节点入栈
  stack.push(root);
  while (stack.length) {
    const curNode = stack.pop();
    if (!curNode) break;
    visitNode(curNode);

    // 子节点压栈
    const childNodes = curNode.childNodes;
    if (childNodes.length) {
      // reverse反顺序压栈
      Array.from(childNodes)
        .reverse()
        .forEach((child) => stack.push(child));
    }
  }
}
function visitNode(node) {
  if (node instanceof Comment) {
    // 注释节点
    console.log("Comment node ---", node.textContent);
  }
  if (node instanceof Text) {
    // 文本节点
    const t = node.textContent?.trim();
    if (t) {
      console.log("Text node ---", t);
    }
  }
  if (node instanceof HTMLElement) {
    // element节点
    console.log("HTMLElement node ---", `<${node.tagName.toLowerCase()}>`);
  }
}
```

### 广度优先遍历 DOM 节点

```js
function bfs(root) {
  const queue = [];
  // 根节点入队
  queue.unshift(root);
  while (queue.length) {
    const curNode = queue.pop();
    visitNode(curNode); // 工具函数，判断节点类型然后做需要的处理
    // 子节点入队
    const childNodes = curNode.childNodes;
    if (childNodes.length) {
      childNodes.forEach((child) => queue.unshift(child));
    }
  }
}
```

### 手写柯里函数

```js
function curry(fn) {
  const fnArgsLength = fn.length;
  let args = [];

  function calc(...newArgs) {
    args = [...args, ...newArgs];
    if (args.length < fnArgsLength) {
      return calc;
    } else {
      return fn.apply(this, args.slice(0, fnArgsLength));
    }
  }

  return calc;
}
```

### 手写 call 函数

```js
function customCall(ctx, ...args) {
  if (ctx == null) {
    ctx = globalThis;
  }
  // 值类型返回一个包装类
  if (typeof ctx !== "object") {
    ctx = new Object(ctx);
  }
  // 防止属性名覆盖
  const fnKey = Symbol();
  // this就是当前的函数
  ctx[fnKey] = this;
  const res = ctx[fnKey](...args);
  // 清理掉fn，防止污染
  delete ctx[fnKey];
  return res;
}
```

### 手写 apply 函数

```js
function customApply(ctx, args) {
  if (ctx == null) {
    ctx = globalThis;
  }
  // 值类型返回一个包装类
  if (typeof ctx !== "object") {
    ctx = new Object(ctx);
  }
  const fnKey = Symbol();
  ctx[fnKey] = this;
  const res = ctx[fnKey](...args);
  delete ctx[fnKey];
  return res;
}
```

### 手写 EventBus 函数

```js
/*
	this.events：存放各种类型对应的全部事件函数，格式：{key1:[{fn:fn1, isOnce: false},{fn:fn2, isOnce: true}],key2:[],...}
*/
class EventBus {
  constructor() {
    this.events = {};
  }
  on(type, fn, isOnce = false) {
    const events = this.events;
    if (events[type] == null) {
      events[type] = [];
    }
    events[type].push({ fn, isOnce });
  }
  once(type, fn) {
    this.on(type, fn, true);
  }
  off(type, fn) {
    if (!fn) {
      this.events = [type];
    } else {
      const fnList = this.events[type];
      if (fnList) {
        this.events[type] = fnList.filter((item) => item.fn !== fn);
      }
    }
  }
  emit(type, ...args) {
    const fnList = this.events[type];
    if (!fnList) return;
    // 注意，使用filter，实现遍历执行并且把once的执行后移除
    this.events[type] = fnList.filter((item) => {
      const { fn, isOnce } = item;

      fn(...args);

      return isOnce ? false : true;
    });
  }
}
```

### 手写 LRU 缓存函数

使用 Map 实现，Map 中的存储是有序的，且取值赋值速度都比数组链表栈等快的多，Map 也有 size 属性。

```js
class LRUCache {
  length = undefined;
  data = new Map();
  constructor(length) {
    if (!length) throw new Error("Invalid length!");
    this.length = length;
  }
  set(key, value) {
    const data = this.data;
    if (data.has(key)) data.delete(key);
    data.set(key, value);
    if (data.size > this.length) {
      const deleteKey = data.keys().next().value;
      data.delete(deleteKey);
    }
  }
  get(key) {
    const data = this.data;
    if (!data.has(key)) return null;
    const val = data.get(key);
    data.delete(key);
    data.set(key, val);
    return val;
  }
}
```

### 扁平数组转成树

```js
function convert2Tree(arr) {
  const idToTreeNode = new Map();
  let root = null;

  arr.forEach((item) => {
    const { id, name, parentId } = item;

    const treeNode = { id, name };
    idToTreeNode.set(id, treeNode);

    const parentNode = idToTreeNode.get(parentId);
    if (parentNode) {
      if (parentNode.children == null) {
        parentNode.children = [];
      }
      parentNode.children.push(treeNode);
    }

    if (parentId === 0) root = treeNode;
  });
  return root;
}
```

### 树转成扁平数组

```js
function convert2Array(root) {
  const arr = [];
  // 用来存 子节点和父节点的映射关系
  const nodeToParent = new Map();

  // 广度优先用队列先进先出 unshift+pop
  const queue = [];
  queue.unshift(root);

  while (queue.length) {
    const curNode = queue.pop();
    if (curNode == null) break;

    const { id, name, children = [] } = curNode;

    const parentNode = nodeToParent.get(curNode);
    const parentId = parentNode?.id || 0;
    const item = { id, name, parentId };
    arr.push(item);

    children.forEach((node) => {
      nodeToParent.set(node, curNode);
      queue.unshift(node);
    });
  }

  return arr;
}
```

### 手写 LazyMan 函数，实现 sleep 功能

```js
class LazyMan {
  constructor(name) {
    this.name = name;
    this.tasks = [];
    setTimeout(() => {
      this.next();
    }, 0);
  }

  next() {
    const task = this.tasks.shift();
    if (task) task();
  }

  sleep(delay) {
    this.tasks.push(() => {
      setTimeout(() => {
        this.next();
      }, delay * 1000);
    });
    return this;
  }

  eat(food) {
    this.tasks.push(() => {
      console.log(`eat ${food}`);
      this.next();
    });
    return this;
  }
}
```

### 求数组某个范围上的最大值

1. 遍历，记录最大值并返回
2. 递归，一分为二，找每个区间上的最大值，最后返回最大的那个，示例：

```js
function process(arr, l, r) {
  if (l === r) return arr[l]; // 只有一个数时直接返回
  let mid = l + ((r - l) >> 1); // 位运算比除法快
  let lMax = process(arr, l, mid);
  let rMax = process(arr, mid + 1, r);
  return Math.max(lMax, rMax);
}
function getMax(arr) {
  return process(arr, 0, arr.length - 1);
}
```

### 求数组中大于某个数的所有段落的起始和终止下标

有一个由很多数字组成的数组，要求找到数组中小于 1500 的数字段落的起始下标和终止下标。

```js
const fs = require("node:fs");
const data = JSON.parse(fs.readFileSync("./551.json", "utf8"));

function parseData(data) {
  const res = [];
  let startIndex = -1;

  for (let i = 0; i < data.length; i++) {
    if (data[i] < 1500) {
      // 如果当前数字小于1500且startIndex为-1，说明是一个新的段落的开始
      if (startIndex === -1) {
        startIndex = i; // 记录起始下标
      }
    } else {
      // 如果当前数字大于等于1500，且startIndex不为-1，说明段落结束
      if (startIndex !== -1) {
        res.push([startIndex, i - 1]); // 记录段落的起始和结束下标
        startIndex = -1; // 重置起始下标
      }
    }
  }

  // 如果最后一个段落在数组末尾，并未遇到大于1500的值
  if (startIndex !== -1) {
    res.push([startIndex, data.length - 1]);
  }

  return res;
}

const res = parseData(data);
console.log(res);
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
5. @babel/polyfill - 等同于 `core-js/stable` 和 `regenerator-runtime/runtime` ，**已废弃**
6. @babel/preset-env - 按需编译和按需打补丁

### @babel/preset-env、@babel/polyfill

1. 使用 `@babel/preset-env`(推荐) 或者 `@babel/polyfill`(废弃) 进行配置 core-js，以实现 polyfill。

```js
rules: [
	{
		test: /\.js$/,
		use: {
			loader: "babel-loader",
			options: {
				presets: [
					// 使用数组
					[
						"@babel/preset-env",
						{
							// 数组的第二项为env选项 示例
							// 指定市场份额超过0.25%的浏览器（不推荐，会导致对IE6的支持）
							// targets:指定目标环境（String | Object | Array），不指定时会根据browserlist配置（.browserlistrc或package.json）去兼容目标环境
							targets:"> 0.25%, not dead",
							// 推荐写法：兼容所有浏览器最后两个版本
							targets:"last 2 versions"
							// 对象写法
							targets:{
									// 指定浏览器版本
									"chrome": "58",
									"ie":"11",
									"edge":"last 2 versions",
									"firefox":"> 5%",

									// 指定nodejs版本, current为当前运行的node版本
									"node":"current"
							},
							// spec : 启用更符合规范的转换，但速度会更慢，默认为 false
							// loose：是否启动松散模式（默认：false），
							// modules：将 ES Modules 转换为其他模块规范，adm | umd | systemjs | commonjs | cjs | false（默认）
							// debug：是否启用debug模式，默认 false
							// useBuiltIns：配置@babel/preset-env如何处理polyfills，有三个值：
							// 1. entry:根据配置的浏览器兼容，引入浏览器不兼容的 polyfill。需要在入口文件手动添加 import '@babel/polyfill'，会自动根据 browserslist 替换成浏览器不兼容的所有 polyfill
							// 2. usage:会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加，好处就是最终打包的文件会比较小
							// 3. false（默认）:此时不对 polyfill 做操作。如果引入 @babel/polyfill，则无视配置的浏览器兼容，引入所有的 polyfill
							// corejs:指定corejs版本（默认:2.0），目前使用core-js@2或core-js@3版本，需要手动安装
						},
					],
				],
			},
		},
	},
];
```

### @babel/preset-react、@babel/preset-typescript

[官网](https://www.babeljs.cn/docs/)

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

### JavaScript 的模块化

为什么会有多种种模块化规范，JavaScript 官方迟迟没有给出解法，所以社区实现了很多不同的模块化规范，按照出现的时间前后有 CommonJS、AMD、CMD、UMD。最后才是 JavaScript 官方在 ES6 提出的 ES Module。众所周知，早期的 JavaScript 是没有模块的概念，引用第三方包时都是把变量直接绑定在全局环境下。以 axios 为例，以 script 标签引入 axios 时，实际是在 window 对象上绑定了一个 axios 属性。这种全局引入的方式会导致两个问题，变量污染和依赖混乱。所以需要使用“模块化”来对不同代码进行「隔离」。

- 变量污染：所有脚本都在全局上下文中绑定变量，如果出现重名时，后面的变量就会覆盖前面的
- 依赖混乱：当多个脚本有相互依赖时，彼此之间的关系不明朗

### ESModule 与 CommonJS 的导入导出的不同

1. 在 ESM 中，导入导出有两种方式:
   - 具名导出/导入: Named Import/Export
   - 默认导出/导入: Default Import/Export
   - ES6 模块化不是对象，import 会在 JavaScript 引擎静态分析，在编译时就引入模块代码，而并非在代码运行时加载，因此也不适合异步加载。
2. CommonJS 中，导入导出的方法只有一种:
   - `module.exports = xxx;`
   - 而所谓的 exports 仅仅是 `module.exports` 的引用而已: `exports = module.exports;`
   - 多个`module.exports.xxx`导出的值会合并成一个对象
   - `module.exports`导出的值为默认值，会忽略`module.exports.xxx`导出的值
   - CommonJS 一般用在服务端或者 Node 用来同步加载模块，它对于模块的依赖发生在代码运行阶段，不适合在浏览器端做异步加载。
3. exports 的转化：cjs==>ESM:
   - 当 exports 转化时，既要转化为具名导出 `export {}`，又要转化为默认导出 `export default {}`
4. module.exports 的转化：cjs==>ESM:
   - 我们可以遍历其中的 key (通过 AST)，将 key 转化为具名导出 `Named Export`，将 module.exports 转化为默认导出 `Default Export`
5. ESModule 的优势：

   - 死代码检测和排除。我们可以用静态分析工具检测出哪些模块没有被调用过。未被调用到的模块代码永远不会被执行，也就成为了死代码。通过静态分析可以在打包时去掉这些未曾使用过的模块，以减小打包资源体积。
   - 模块变量类型检查。JavaScript 属于动态类型语言，不会在代码执行前检查类型错误。ES6 Module 的静态模块结构有助于确保模块之间传递的值或接口类型是正确的。
   - 编译器优化。在 CommonJS 等动态模块系统中，无论采用哪种方式，本质上导入的都是一个对象，而 ES6 Module 支持直接导入变量，减少了引用层级，程序效率更高。

6. 二者的差异：
   - 1. CommonJS 模块引用后是一个值的拷贝，简单来说就是把导出值复制一份，放到一块新的内存中，每次直接在新的内存中取值，所以对变量修改没有办法同步。
   - 1. ESModule 引用后是一个值的动态映射，指向同一块内存，并且这个映射是只读的。
   - 2. CommonJS 模块输出的是值的拷贝，一旦输出之后，无论模块内部怎么变化，都无法影响之前的引用。
   - 2. ESModule 是引擎会在遇到 import 后生成一个引用链接，在脚本真正执行时才会根据这个引用链接去模块里面取值，模块内部的原始值变了 import 加载的模块也会变。模块实际导出的是这块内存的地址，每当用到时根据地址找到对应的内存空间，这样就实现了所谓的“动态绑定”。
   - 3. CommonJS 运行时加载。
   - 3. ESModule 编译阶段引用。
   - 4. CommonJS 在引入时是加载整个模块，生成一个对象，然后再从这个生成的对象上读取方法和属性。
   - 4. ESModule 不是对象，而是通过 export 暴露出要输出的代码块，在 import 时使用静态命令的方法引用指定的输出代码块，并在 import 语句处执行这个要输出的代码，而不是直接加载整个模块。
7. CommonJS To ESM 的构建工具: `@rollup/plugin-commonjs`,`https://cdn.skypack.dev/`,`https://jspm.org/`。

### ESModule 导入导出

1. 普通导入、导出：使用 export 导出可以写成一个对象合集，也可以是一个单独的变量，需要和 import 导入的变量名字一一对应；
2. 默认导入、导出：使用`export default`语法可以实现默认导出，可以是一个函数、一个对象，或者仅一个常量。默认的意思是，使用 import 导入时可以使用任意名称；
3. 混合导入、导出：默认导入导出不会影响普通导入导出，并且可以同时使用；
4. 全部导入：使用'\*'、'as'等关键字；实际可以理解为：默认导出的属性名就叫'default'，只不过省略了。
5. 重命名导入：可以避免命名冲突；
6. 重定向导出：很有用；

```js
export * from "./a.mjs"; // 第一种
export { propA, propB, propC } from "./a.mjs"; // 第二种
export { propA as renameA, propB as renameB, propC as renameC } from "./a.mjs"; //第三种
```

7. 只运行模块：`import './a.mjs'`，相当于直接运行这个文件里的代码。

### ESModule 循环引入

import 语句有提升的效果。

ES module 会根据 import 关系构建一棵依赖树，遍历到树的叶子模块后，然后根据依赖关系，反向找到父模块，将 export/import 指向同一地址。

和 CommonJS 一样，发生循环引用时并不会导致死循环，但两者的处理方式大有不同。

ES module 导出的是一个索引——内存地址，没有办法和 CommonJS 一样通过缓存处理。它依赖的是**模块地图**和**模块记录**，模块地图在下面会解释，而模块记录是好比每个模块的“身份证”，记录着一些关键信息——这个模块导出值的的内存地址，加载状态，在其他模块导入时，会做一个“连接”——根据模块记录，把导入的变量指向同一块内存，这样就是实现了动态绑定。

在代码执行前，首先要进行预处理，这一步会根据 import 和 export 来构建模块地图（Module Map），它类似于一棵树，树中的每一个'节点'就是一个模块记录，这个记录上会标注导出变量的内存地址，将导入的变量和导出的变量连接，即把他们指向同一块内存地址。不过此时这些内存都是空的，也就是看到的'uninitialized'。

循环引用要解决的无非是两个问题，保证不进入死循环以及输出什么值。ES Module 处理循环使用一张模块间的依赖地图来解决死循环/循环引用问题，标记进入过的模块为'获取中 Fetching'，所以循环引用时不会再次进入；使用模块记录，标注要去哪块内存中取值，将导入导出做链接，解决了要输出什么值。

### CommonJS 中 exports 和 module.exports 的区别

1. 所谓的 exports 仅仅是 `module.exports` 的引用而已: `exports = module.exports;`，但是使用的时候还是有些区别；
2. 当绑定一个属性时，两者相同

```js
exports.propA = "A";
module.exports.propB = "B";
```

3. 不能直接赋值给`exports`，也就是不能直接使用`exports = {};`这种语法

```js
// 失败
exports = { propA: "A" };
// 成功
module.exports = { propB: "B" };
```

4. 虽然两者指向同一块内存，但最后被导出的是 `module.exports`，所以不能直接赋值给 exports。同样的道理，只要最后直接给 `module.exports` 赋值了，之前绑定的属性都会被覆盖掉。

```js
exports.propA = "A"; // 此时 == {propA: "A"}
module.exports.propB = "B"; // 此时 == {propA: "A", propB: "B"}，还是指向同一个对象
module.exports = { propD: "D" }; // 此时 == {propD: "D"}，因为指向了一个新对象
module.exports = { propC: "C" }; // propC会覆盖propD，此时 == {propC: "C"}，因为又指向了一个新对象
```

用上面的例子所示，先是绑定了两个属性 propA 和 propB，接着给 `module.exports` 赋值，最后能成功导出的只有 propC。

### CommonJS 如何处理循环引入和多次引入

1. 循环引入

先看示例：执行`node index.js`，会输出什么：

```js
//index.js
var a = require("./a");
console.log("入口模块引用a模块：", a);

// a.js
exports.a = "原始值-a模块内变量";
var b = require("./b");
console.log("a模块引用b模块：", b);
exports.a = "修改值-a模块内变量";

// b.js
exports.b = "原始值-b模块内变量";
var a = require("./a");
console.log("b模块引用a模块：", a);
exports.b = "修改值-b模块内变量";

// 输出
// b模块引用a模块：{a: '原始值-a模块内变量'}
// a模块引用b模块：{b: '修改值-b模块内变量'}
// 入口模块引用a模块：{a: '修改值-a模块内变量'}
```

这种 AB 模块间的互相引用，本应是个死循环，但是实际并没有，因为 CommonJS 做了特殊处理——**模块缓存**。

循环引用无非是要解决两个问题，怎么避免死循环以及输出的值是什么。CommonJS 通过模块缓存来解决：**每一个模块都先加入缓存再执行，每次遇到 require 都先检查缓存，这样就不会出现死循环；借助缓存，输出的值也很简单就能找到了**。

2. 多次引入

同样由于缓存，一个模块**不会被多次执行**。当第二次引用这个模块时，如果发现已经有缓存，则直接读取，而不会再去执行一次。

3. 路径解析规则

为什么我们导入时直接简单写一个'react'就正确找到包的位置？每个模块都是一个 module 对象，module 下面有 paths 属性。

首先把路径作一个简单分类：内置的核心模块、本地的文件模块和第三方模块。

- 对于核心模块，node 将其已经编译成二进制代码，直接书写标识符 fs、http 就可以引入使用；
- 对于自己写的文件模块，需要用'./'、'../'开头，require 会将这种相对路径转化为真实路径，找到模块；
- 对于第三方模块，也就是使用 npm 下载的包，就会用到 paths 这个变量，会依次查找当前路径下的 node_modules 文件夹，如果没有，则在父级目录查找 node_modules，一直到根目录下，找到为止。如果没找到那就会报模块没找到或没安装。

在 node_modules 下找到对应包后，会以 package.json 文件下的 main 字段为准，找到包的入口，如果没有 main 字段，则查找 index.js/index.json/index.node 做入口。

### export 和 export default 的区别

| 特性         | export                                                                     | export default                    |
| ------------ | -------------------------------------------------------------------------- | --------------------------------- |
| 导出数量     | 可以导出多个命名导出                                                       | 只能有一个默认导出                |
| 导入方式     | 必须使用 {} 括起来指定导入内容，也可以使用\*全部导入并设置一个统一模块名称 | 可以直接导入或者指定别名，无需 {} |
| 导入时的命名 | 导入名称必须与导出名称一致                                                 | 可以自定义导入名称                |
| 使用场景     | 用于多个函数、变量、类的导出                                               | 用于模块的整体的导出              |

1. `import * as Utils from './utils.js';`可以创建了一个包含 utils.js 中所有命名导出的对象 Utils。然后使用`Utils.xxx`来调用具体的方法属性即可。
2. `import * as XX`不能与 `export default` 一起使用：如果 utils.js 中有默认导出（`export default`），使用 `import * as` 时，默认导出不会包含在 Utils 对象中。你仍需单独导入默认导出。
3. 确保在同一作用域中没有命名冲突。如果模块中有多个导出项，确保它们具有唯一的名称或使用别名避免冲突。
4. 在一个模块中，可以同时使用 export 和 export default

### const、let 和 var

1. 在 ES5 中，顶层对象的属性和全局变量是等价的，var 命令和 function 命令声明的全局变量，自然也是顶层对象。
2. 但 ES6 规定，var 命令和 function 命令声明的全局变量，依旧是顶层对象的属性，但 let 命令、const 命令、class 命令声明的全局变量，不属于顶层对象的属性。
3. 在定义变量的块级作用域中就能获取到 let、const 声明的对象，既然不属于顶层对象，那就不需要加 window（global）。
4. var 的话会直接在栈内存里预分配内存空间，然后等到实际语句执行的时候，再存储对应的变量，如果传的是引用类型，那么会在堆内存里开辟一个内存空间存储实际内容，栈内存会存储一个指向堆内存的指针。
5. let 的话，是不会在栈内存里预分配内存空间，而且在栈内存分配变量时，做一个检查，如果已经有相同变量名存在就会报错。
6. const 的话，也不会预分配内存空间，在栈内存分配变量时也会做同样的检查。不过 const 存储的变量是不可修改的，对于基本类型来说你无法修改定义的值，对于引用类型来说你无法修改栈内存里分配的指针，但是你可以修改指针指向的对象里面的属性。
7. let、const 只是创建过程提升，初始化过程并没有提升，所以会产生暂时性死区。var 的创建和初始化过程都提升了，所以在赋值前访问会得到 undefined。**function 的创建、初始化、赋值都被提升了**。

### SEO

- SEO(Search Engine Optimization)，即搜索引擎优化。SEO 是随着搜索引擎的出现而来的，两者是相互促进，互利共生的关系。SEO 的存在就是为了提升网页在搜索引擎自然搜索结果中的收录数量以及排序位置而做的优化行为。而优化的目的就是为了提升网站在搜索引擎中的权重，增加对搜索引擎的友好度，使得用户在访问网站时能排在前面。
- 分类：白帽 SEO 和黑帽 SEO。白帽 SEO，起到了改良和规范网站设计的作用，使网站对搜索引擎和用户更加友好，并且网站也能从搜索引擎中获取合理的流量，这是搜索引擎鼓励和支持的。黑帽 SEO，利用和放大搜索引擎政策缺陷来获取更多用户的访问量，这类行为大多是欺骗搜索引擎，一般搜索引擎公司是不支持与鼓励的。
- 目的：提高网站的权重，增强搜索引擎友好度，以达到提高网站排名，增加流量曝光，改善（潜在）用户体验，促进销售的作用。
- 具体方向：

1. 对网站的标题、关键字、描述精心设置，反映网站的定位，让搜索引擎明白网站是做什么的；
2. 网站内容优化：内容与关键字的对应，增加关键字的密度；
3. 在网站上合理设置 Robots.txt 文件；robots.txt 文件规定了搜索引擎抓取工具可以访问你网站上的哪些网址， 此文件主要用于避免网站收到过多请求。可以存放 sitemap.xml 的链接
4. 生成针对搜索引擎友好的网站地图 sitemap.xml；
5. 增加外部链接，到各个网站上宣传。

- 前端 SEO

1. 网站结构布局优化：尽量简单、开门见山，提倡扁平化结构

   - 控制首页链接数量：网站首页是权重最高的地方；链接不能太多也不能太少，要有实质性的链接；
   - 扁平化的目录层次：不超过 3 层；
   - 导航优化：尽量采用文字，图片标签必须添加“alt”和“title”属性；在每一个网页上应该加上面包屑导航；
   - 网站的结构布局：主次关系清晰；
   - 利用布局，把重要内容 HTML 代码放在最前
   - 控制页面的大小，减少 http 请求，提高网站的加载速度

2. 网页代码优化

   - ssr：服务端渲染返回给客户端的是已经获取了异步数据并执行 JavaScript 脚本的最终 HTML,网络爬虫可以抓取到完整的页面信息,SSR 另一个很大的作用是加速首屏渲染；
   - 突出重要内容---合理的设计全局 title、description 和 keywords：把重要的关键词放在前面，关键词不要重复出现，切记不能太长，过分堆砌关键词，每个页面也要有所不同-每个页面自定义 TDK；
   - 语义化书写 HTML 代码，符合 W3C 标准
   - 标签：页内链接，要加 title 属性加以说明，让访客和爬虫知道。而外部链接，链接到其他网站的，则需要加上 `rel="nofollow"` 属性, 告诉爬虫不要爬，因为一旦爬虫爬了外部链接之后，就不会再回来了，还可加上 noopener、noreferrer
   - 正文标题要用 h1，副标题用 h2，不可乱用 h 标签
   - 图片应使用 "alt" 属性加以说明，设置宽高，减少重排重绘，提高加载速度
   - 表格标题使用 caption 元素
   - br 标签只用于文本内容换行
   - 强调内容时使用 strong 标签
   - 文本缩进不要使用特殊符号，应使用 css 进行设置
   - 重要内容不要用 js 输出，须放在 html 里
   - 尽量少使用 iframe
   - 搜索引擎会过滤掉 `display:none` 的元素中的内容
   - 精简 url：URL 尽量短，长 URL 不仅不美观，用户还很难从中获取额外有用的信息。另一方面，短 url 还有助于减小页面体积，加快网页打开速度，提升用户体验。
   - 多页文章：如果您的文章分为几个页面，请确保有可供用户点击的下一页和上一页链接，并且这些链接是可抓取的链接。
   - 显示实用的 404 页面，使用自定义 404 页面能够有效引导用户返回到您网站上的正常网页，从而大幅提升用户的体验。
   - 移动端设置 meta 标签：`<meta name='viewport' content='width=device-width, initial-scale=1'>`，告知浏览器如何在移动设备上呈现网页
   - Open Graph protocol：用来标注页面类型和描述页面内容，从而方便在社交媒体中进行传播。meta 标签的 name 都是以 og: 开头-`<meta name="og:title" property="og:title" content="xxx">`，可以借助 `Front Matter` 自定义每个页面的 og 属性，也可以借助现有的插件
   - JSON-LD：JavaScript Object Notation for Linked Data，用来描述网页的类型和内容，方便搜索引擎做展现。`<script type="application/ld+json">{JSON-LD}</script>`，手写个插件，打包的时候往 index.html 的 head 里注入这段脚本即可。

3. 站外优化

   - 在搜素引擎排名较高的公众平台（百家号 ，知道，贴吧、搜狐、知乎等）发布正面网站信息，以建设良好口碑 ；负面信息排名较高的需删除或者屏蔽处理。
   - 百度，互动，搜狗等百科的创建更新与维护，(互动百科在今日头条有着较高的排名，现在今日头条也在发展搜素引擎)，百科对树立品牌形象较为重要。
   - 公关舆情传播，宣传新闻源发布。
   - 站外推广与外链建设。
   - 百度收录添加站点、提交收录；谷歌收录添加站点、DNS 验证站点、提交收录、提交站点地图，在谷歌搜索栏使用 site:域名, 来确认站点是否已被谷歌收录；
   - 360 收录、Bing 站长、搜狗站长、神马站长等操作同上
   - 站长工具：百度统计、百度搜索资源平台、Google Analytics、Google Search Console、Google Search Central、Google Trending、站长工具、ahrefs、5118，可以对目标网站进行访问数据统计和分析，并提供多种参数供网站拥有者使用。

4. 面向特定搜索引擎优化

   - 多个域名 ip 统一成一个域名，并使用 https，Google 会优先选择 HTTPS 网页（而非等效的 HTTP 网页）作为规范网页。
   - 有自己的服务器可以域名重定向或者 Nginx 重定向(http 重定向到 https，建议使用 301 永久重定向，SEO 友好)，否则使用 js 重定向，手动判断并设置`location.href`。
   - 示例如下：注意 rewrite 这句，我们加了一个 permanent，表示这是一个 301 重定向，如果不加这个，会是 302 重定向，虽然表现上是一样的，但对于搜索引擎来说，却是不一样的，Google 也是更建议使用 301 重定向。重定向时要考虑 cookie 的同源策略，以免出现登录或者鉴权 bug。

```bash
	server {
		listen       80 default_server;
		listen       [::]:80 default_server;
		server_name  _;
		rewrite ^(.*)$ https://$host$1 permanent;
		# ...
	}
```

5. 重定向的处理
   - 如果一个页面有两个地址，搜索引擎会认为它们是两个网站，结果造成每个搜索链接都减少导致网站排名降低，而如果使用 301 重定向，搜索引擎会把两个访问地址归到同一个网站排名下，不会影响 SEO。
   - 用不同的地址会造成缓存友好性变差，当一个页面有好几个名字时，他可能会被缓存多次。
   - 重定向时，如果路径指向同一台服务器，那么可以用 alias 和 mod_rewrite 配置跳转即可
   - 重定向如果是因为域名发生变化，那么可以创建一条 CNAME（即创建一个指向另一个域名的 DNS 记录作为别名），结合 alias 或 mod_rewrite 配置跳转

- 测试与优化工具

1. 使用站长工具
2. 使用 Lighthouse
3. web.dev
4. Page Speed Insights

### 协程

协程是一种比线程更加轻量级的存在，是语言层级的构造，可看作一种形式的控制流，在内存间执行，没有像线程间切换的开销。你可以把协程看成是跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程。

协程概念的提出比较早，单核 CPU 场景中发展出来的概念，通过提供挂起和恢复接口，实现在单个 CPU 上交叉处理多个任务的并发功能。

那么本质上就是在一个线程的基础上，增加了不同任务栈的切换，通过不同任务栈的挂起和恢复，线程中进行交替运行的代码片段，实现并发的功能。

总结一下 Generator 的本质，暂停，它会让程序执行到指定位置先暂停（yield），然后再启动（next），再暂停（yield），再启动（next），而这个暂停就很容易让它和异步操作产生联系，因为我们在处理异步时：开始异步处理（网络求情、IO 操作），然后暂停一下，等处理完了，再该干嘛干嘛。不过值得注意的是，js 是单线程的（又重复了三遍），异步还是异步，callback 还是 callback，不会因为 Generator 而有任何改变。

### js 中的 sort 函数

没有默认值函数时，是按照 UTF-16 排序的，对于字母数字你可以利用 ASCII 进行记忆。`(a-b)`是从小到大排序。可以比较 charCode，`(b-a)`是从大到小排序。

新的版本中增加了`toSorted()`方法，可以传入一个比较函数，可以自定义排序规则，不改变原数组。

### 非匿名自执行函数，函数名只读

```js
var test = "window test";
// 如果function是匿名函数，则
(function test() {
  // test = 'var test'; //这句加在前面，也不会修改window test，因为它实际是在修改function的name，但是这个修改是不会生效的。
  console.log(test); // 会打印这个test函数
  // let test = 'let test'; //加上这句则报错ReferenceError
  // var test = 'var test'; //加上这句则打印undefined
  // test = 'var test'; //加上这句，不会修改window test，因为它实际是在修改function的name，但是这个修改是不会生效的。正常的情况下，如果变量名和函数名不重复，则会修改外部作用域下的同名变量
})();
```

### function 先于变量声明提升

function 的创建、初始化、赋值都被提升了。

```js
test(); // 在这里test()函数可以正常执行，因为下一句test才会重新赋值
var test = "window test"; // 声明会提升，赋值不会提升
// function会先提升到var之前，然后再提升var，所以后面同名的var覆盖了函数。
function test() {
  console.log(test);
}
test(); // 报错，not a function，原因如上。
```

### call 和 apply 的区别是什么，哪个性能更好一些

Function.prototype.apply 和 Function.prototype.call 的作用是一样的，区别在于传入参数的不同；

1. 第一个参数都是，指定函数体内 this 的指向；
2. 第二个参数开始不同，apply 是传入带下标的集合，数组或者类数组，apply 把它传给函数作为参数，call 从第二个开始传入的参数是不固定的，都会传给函数作为参数。
3. call 比 apply 的性能要好，平常可以多用 call, call 传入参数的格式正是内部所需要的格式。
4. 尤其是 es6 引入了 Spread operator (延展操作符) 后，即使参数是数组，也可以使用 call。
5. 算法步骤中，apply 多了 CreateListFromArrayLike 的调用，其他的操作几乎是一样的（甚至 apply 仍然多了点操作）。

### 箭头函数与普通函数（function）的区别

1. 箭头函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
3. 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
4. 不可以使用 new 命令，因为：
   - 没有自己的 this，无法调用 call，apply。
   - 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 `__proto__`。
   - 箭头函数并没有`[[Construct]]`方法, 所以不能被用作构造函数。

### `a.b.c.d` 和 `a['b']['c']['d']`，哪个性能更高

1. []是常量时，性能差别很小。dot 稍快；
2. []是变量时，可能需要计算，性能略差；
3. 从 AST 角度看就很简单了，`a['b']['c']`和`a.b.c`，转换成 AST 前者的的树是含计算的，后者只是 string literal，天然前者会消耗更多的计算成本，时间也更长；
4. 后者 AST 会大一些，但在 AST 解析上消耗的这点时间基本可以忽略不计。

### ES6 代码转成 ES5 代码的实现思路

Babel 是如何把 ES6 转成 ES5 呢，其大致分为三步：

1. 将代码字符串解析成抽象语法树，即所谓的 AST
2. 对 AST 进行处理，在这个阶段可以对 ES6 代码进行相应转换，即转成 ES5 代码
3. 根据处理后的 AST 再生成代码字符串

- 比如，可以使用 @babel/parser 的 parse 方法，将代码字符串解析成 AST；使用 @babel/core 的 transformFromAstSync 方法，对 AST 进行处理，将其转成 ES5 并生成相应的代码字符串；过程中，可能还需要使用 @babel/traverse 来获取依赖文件等。

4. 补充说明

- .vue 文件通过 webpack 的 vue-loader 分析出 script、style、template 再走上面的 ES6 转 ES5 流程
- jsx 通过 babel 插件转 js 语法再走 ES6 转 ES5
- ts 通过 tsc 结合 tsconfig.json 直接转 ES5

### vite/esbuild/rollup 的关系

1. Vite 是一个快速的前端构建工具，主要用于开发环境。它的主要特点包括：基于原生 ES 模块（ESM）能实现快速的冷启动，即时的模块热更新（HMR），真正的按需编译按需加载模块，无需像传统工具那样预构建整个项目，开箱即用无需复杂配置。使用 esbuild 作为开发阶段的快速依赖（如 node_modules 中的第三方库）预编译和转译（CommonJS->ESM）工具。使用 Rollup 作为生产构建的打包工具。所以 Vite 并不是简单的替代品，而是一个整合工具，结合了 esbuild 的速度和 Rollup 的灵活性，带来了高效的开发和生产构建体验。
2. esbuild 是一个超高性能的 JavaScript 和 TypeScript 打包器和压缩器，它的主要特点是：使用 Go 语言编写，性能极高，得益于 Go 的性能和并行化设计，能快速实现代码转译和依赖预构建，支持 JavaScript 和 TypeScript，可以作为库使用，也可以作为独立的构建工具。提供基础的打包、转译和树摇（Tree Shaking）功能，支持现代 JavaScript/TypeScript 特性。注重单一职责，功能相对有限，主要用于快速构建和预编译。
3. Rollup 是一个专注于现代 JavaScript 应用的模块打包器，专注于生产环境的构建。它的主要特点包括：生成更小、更高效的打包结果，支持 Tree-shaking、代码拆分、变量作用域提升等，有丰富的插件生态系统（如压缩、CSS 处理等）。支持 ES 模块（ESM），为现代 JavaScript 提供模块化的打包支持。Rollup 结合 JavaScript 引擎的死代码消除（依赖 DCE--Dead Code Elimination）优化，进一步减小输出文件的体积。
4. 总结：vite 是基于 rollup 来实现的，包括开发服务器的 transform（会调用 rollup 插件的 transform 方法来做转换），以及生产环境的打包（也是用同样的 rollup 插件）。但是为了性能考虑，又用了 esbuild 做依赖预构建，比如把 cjs 转换成 esm、把小模块打包成一个大的模块。现在 vite 团队在开发 rust 版 rollup 也就是 rolldown 了，有了它之后，就可以完全替代掉 rollup + esbuild 了。

| 工具    | 适用场景       | 特点                                                               | 插件系统            | 性能                  |
| ------- | -------------- | ------------------------------------------------------------------ | ------------------- | --------------------- |
| Vite    | 开发和生产     | 开发阶段基于 ESM，生产阶段基于 Rollup，整合 esbuild 和 Rollup 优势 | 丰富（基于 Rollup） | 开发速度快，构建高效  |
| esbuild | 开发和快速构建 | 高速转译和打包，但功能简单，适合用作底层工具                       | 简单                | 极快（使用 Go 实现）  |
| Rollup  | 生产构建       | 功能全面，支持复杂的生产环境优化，适合库开发和大规模项目           | 非常强大            | 高效，但比 esbuild 慢 |

PS：

1. Tree-shaking 对于 动态导入 和 CommonJS 模块 支持有限，因为它们不能被静态分析。动态代码使用时（如动态计算导入路径）可能会导致无法移除未使用的代码。
2. 代码拆分是一种优化技术，通过将代码分成多个模块（或文件），按需加载，从而减少初始页面加载的体积，并提高页面加载速度。常见应用场景：
   - 按路由拆分代码（基于路由的懒加载）。
   - 将共享依赖（如 react、lodash）分离到单独的文件中。
3. Rollup 如何实现代码拆分？
   - 动态导入（Dynamic Imports）：Rollup 支持基于 `import()` 的动态导入，将相关代码拆分为单独的 chunk 文件。依赖现代浏览器（需要支持 import()）。
   - 共享模块的提取：Rollup 使用 `output.manualChunks` 配置，将共享依赖（如 node_modules 中的第三方库）提取为独立的 chunk。
   - 按需加载：Rollup 将拆分的代码块输出为独立文件，结合现代模块加载器（如浏览器原生模块加载或 Webpack 的懒加载）实现按需加载。
4. 什么是变量作用域提升？
   - 变量作用域提升是一种优化技术，主要目标是将模块之间的代码整合到一个更大的作用域中，减少闭包的开销。
   - 它可以避免不必要的函数包装，从而提高代码执行效率（尤其是对于浏览器中的解析和执行）。
5. Rollup 如何实现作用域提升？
   - Rollup 在打包过程中会将多个模块中的代码合并到一个共享作用域中，而不是为每个模块单独创建闭包。
   - 这种优化得益于 Rollup 对 ESM 的静态分析能力，可以在打包阶段安全地将导入的模块“内联”到主模块中。

### 为什么普通 for 循环的性能远远高于 forEach 的性能

1. forEach 需要额外的内存和函数调用，上下文作用域等等，所以会拖慢性能；for 循环没有任何额外的函数调用栈和上下文；
2. 新版浏览器已经优化的越来越好，性能上的差异会越来越小

### 首屏优化

#### 原因

1. 硬件渲染能力有限，渲染时间长，首屏加载时间长，用户体验差；
2. 网络延迟，加载速度慢
3. 资源体积过大，导致加载慢

#### 方法

1. 减少入口文件体积：webpack 代码分割-多入口 entry+动态 import()导入+SplitChunksPlugin 插件 optimization.splitChunks+，`React.lazy+import()+Suspense`，代码压缩，css 压缩去重，关键 CSS 提取直接内联插入到 html 中，tree-shaking（需要 ESM 标准代码）。
2. 静态资源本地缓存或 cdn：OSS+CDN-比如 vue.config.js 中配置：configureWebpack.externals 把第三方库排除出打包结果后续在 html 中通过 CDN 引入，强缓存 Expire、Cache-Control：Max-Age=36000，协商缓存：Last-Modified/If-Modified-Since、Etag/If-None-Match，策略缓存：service-worker，一个 cdn 链接可以同时请求多个资源文件：`<script crossorigin="anonymous" src="//g.alicdn.com/??mtb/lib-promise/3.1.3/polyfillB.js,mtb/lib-mtop/2.7.3/mtop.js,jstracker/sdk-assests/5.7.7/index.js,mtb/lib-env/3.0.0/index.min.js"></script>`减少请求数。
3. UI 框架、第三方库等按需加载：antd/es/xx、lodash-es 等，精简三方库，库内容按需导入使用`babel-plugin-import`等插件，或者 shadcn 新型 UI 库，移除不必要的国际化文件，使用 React.memo 缓存组件渲染结果，使用 React.forwardRef 避免闭包。
4. 避免组件重复打包：提取公共组件，公共资源 vendors 抽离，使用`webpack-bundle-analyzer`分析打包情况，通过 DllPlugin 将依赖单独打包（当公司没有很好的 CDN 资源或不支持 CDN 时，就可以考虑使用 DllPlugin，替换掉 externals，开发时项目启动也更快）。
5. 图片资源压缩：tinyPNG 压缩图片、`url-loader` 转 icon 为 base64、雪碧图减少 http 请求，使用 webp 格式等。
6. 开启 gzip 压缩：webpack 使用：`compression-webpack-plugin`插件配置相应的压缩算法、压缩文件类型、压缩后的文件名、文件体积临界值、压缩率等，Nginx 开启 gzip，通过`Response Headers` 中可以看到 `Content-Encoding: gzip`验证是否开启。
7. 使用 defer、async、importance 等关键字控制相应资源的加载优先级，首屏无关资源延迟加载或者用 preload、prefetch 进行预加载，prrender 预渲染，减少首屏白屏，滚动加载、可视区域局部渲染，dns 预连接`<link rel="dns-prefetch" href="//o.alicdn.com">`放到加载具体文件资源之前。
8. 字体压缩：font-spider 移除无用字体，webfont 处理字体加载，fontmin 压缩字体等。
9. SSR 服务端渲染，首屏直出。局部 SSR。
10. 后端优化接口响应速度，合并接口，减少请求次数，使用 http/2 服务端推送等技术。

> 提高打包速度：

- 由于运行在 Node.js 之上的 webpack 是单线程模型的，我们需要 webpack 能同一时间处理多个任务，发挥多核 CPU 电脑的威力，HappyPack 就能实现多线程打包，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程，来提升打包速度。

```js
// vue.config.js
const HappyPack = require("happypack");
const os = require("os");
// 开辟一个线程池，拿到系统CPU的核数，happypack 将编译工作利用所有线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  configureWebpack: {
    plugins: [
      new HappyPack({
        id: "happybabel",
        loaders: ["babel-loader"],
        threadPool: happyThreadPool,
      }),
    ],
  },
};
```

##### 预加载

```html
<link rel="preload" href="./font/iconfont.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="xxx.js" as="script" />
```

##### 预渲染

Prerender 是前端工程化中一个概念，它指的是在服务器上渲染出完整的 HTML 页面，并返回给客户端，客户端收到页面后，再进行页面渲染。

比如：`@prerender/webpack-plugin`

##### 打包体积分析

1. webpack-bundle-analyzer
2. vite-bundle-analyzer

##### SSR

1. React：Next.js
2. Vue：Nuxt.js

### 白屏常见的优化方案有

1. SSR
2. 预渲染
3. 骨架屏

### 首屏时间

1. 首屏时间：指浏览器从响应用户输入网络地址，到首屏内容渲染完成的时间。也称用户完全可交互时间，即整个页面首屏完全渲染出来，用户完全可以交互，一般首屏时间小于页面完全加载时间，该指标值可以衡量页面访问速度。
2. 白屏时间(First Paint)：首次渲染时间，指页面出现第一个文字或图像所花费的时间。白屏时间是小于首屏时间的。

### 如何计算首屏时间

1. 可以用最新 Performance API 获取首帧 FP、首屏 FCP
2. 首次有意义的绘制 FMP 和 LCP、TTI：Time To Interactive，可交互时间，整个内容渲染完成等
   - FMP：首次有意义绘制，指页面首次渲染完成，用户可以感知到的时间。可以用 MutationObserver 监听 DOM 变化，当 DOM 变化后，获取当前时间，作为 FMP 的时间戳。
   - TTI： Time To Interactive，可交互时间，整个内容渲染完成等
   - LCP：Largest Contentful Paint，页面中最大的内容绘制时间，指页面中最大的内容渲染完成，用户可以感知到的时间。可以用 IntersectionObserver 监听页面中的元素，当元素进入视口时，获取当前时间，作为 LCP 的时间戳。
   - TBT：Total Blocking Time，总阻塞时间，指页面渲染过程中，阻塞用户交互的时间。可以用 Performance API 获取渲染开始时间，和用户交互时间，作为 TBT 的时间戳。

#### SSR

1. 在 SSR（服务端渲染）的应用中，我们认为 html 的 body 渲染完成的时间就是首屏时间。我们通常使用 W3C 标准的 Performance 对象来计算首屏时间。
2. Performance 包含了四个属性：memory、navigation、timeOrigin、timing，以及一个事件处理程序 onresourcetimingbufferfull。
3. 首屏时间：`domLoadedTime = timing.domContentLoadedEventStart - timing.navigationStart`

#### SPA

随着 Vue 和 React 等前端框架盛行，Performance 已无法准确的监控到页面的首屏时间。因为 DOMContentLoaded 的值只能表示空白页（当前页面 body 标签里面没有内容）加载花费的时间。浏览器需要先加载 JS , 然后再通过 JS 来渲染页面内容，这个时候单页面类型首屏才算渲染完成。

1. 在 Lighthouse 中我们可以得到 FMP 值，FMP（全称 First Meaningful Paint，翻译为首次有效绘制）表示页面的主要内容开始出现在屏幕上的时间点，它是我们测量用户加载体验的主要指标。我们可以认为 FMP 的值就是首屏时间。
2. 常见计算方式：
   1. 用户自定义打点—最准确的方式（只有用户自己最清楚，什么样的时间才算是首屏加载完成）。缺点：侵入业务，成本高。
   2. 粗略的计算首屏时间: loadEventEnd - fetchStart/startTime 或者 domInteractive - fetchStart/startTime
   3. 通过计算首屏区域内的所有图片加载时间，然后取其最大值
   4. 利用 MutationObserver 接口，监听 document 对象的节点变化，取 DOM 变化最大时间点为首屏时间，页面关闭时如果没有上报，立即上报
      - window 监听 beforeunload 事件（当浏览器窗口关闭或者刷新时，会触发 beforeunload 事件）进行上报

### function 的 length

就是第一个具有默认值之前的参数个数，剩余参数是不算进 length 的计算之中的。

### CDN 原理&优势

DNS 域名服务器之所以分级（根、顶级、权威、本地）是为了通过负载均衡来分散压力，具体的域名解析都是由各自的权威域名服务器来处理的，根域名和顶级域名服务器只是做了个转发。

#### CDN 原理

1. CDN 不是一种协议，只是基于 DNS 协议实现的一种分布式网络。
2. DNS 的流程是会先查找浏览器 DNS 缓存、hosts 文件、系统 DNS 缓存，然后请求本地 DNS 服务器，由它去一级级查询最终的 IP。
3. CDN 是基于 DNS 的，在权威域名服务器做了 CNAME 的转发，然后根据请求 IP 的所在地来返回就近区域的服务器的 IP。这个流程是有一层层的缓存的，而且还是分布式的，是我们接触最多的高并发系统了。

#### 优缺点

CDN 的核心点有两个，一个是缓存，一个是回源。“缓存”就是说我们把资源 copy 一份到 CDN 服务器上这个过程。“回源”就是说 CDN 发现自己没有这个资源（一般是缓存的数据过期了），转头向根服务器（或者它的上层服务器）去要这个资源的过程。

- 关于 CDN 缓存，在浏览器本地缓存失效后，浏览器会向 CDN 边缘节点发起请求。类似浏览器缓存，CDN 边缘节点也存在着一套缓存机制。CDN 边缘节点缓存策略因服务商不同而不同，但一般都会遵循 http 标准协议，通过 http 响应头中的`Cache-control: max-age`的字段来设置 CDN 边缘节点数据缓存时间。

- 当浏览器向 CDN 节点请求数据时，CDN 节点会判断缓存数据是否过期，若缓存数据并没有过期，则直接将缓存数据返回给客户端；否则 CDN 节点就会向服务器发出回源请求，从服务器拉取最新数据，更新本地缓存，并将最新数据返回给客户端。 CDN 服务商一般会提供基于文件后缀、目录多个维度来指定 CDN 缓存时间，为用户提供更精细化的缓存管理。

1. CDN 优势

- CDN 节点解决了跨运营商和跨地域访问的问题，访问延时大大降低。用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。
- 大部分请求在 CDN 边缘节点完成，CDN 起到了分流作用，减轻了源服务器的负载。
- CDN 提供冗余，有助于保护源服务器和内容。通过 CDN 的负载均衡和分布式存储技术，可以加强网站的可靠性，相当于无形中给网站添加了一把保护伞，可以缓解或防止常见的网络攻击，例如分布式拒绝服务（DDoS）攻击。
- 同一个域名下的请求会不分青红皂白地携带 Cookie，而静态资源往往并不需要 Cookie 携带什么认证信息。把静态资源和主页面置于不同的域名下，完美地避免了不必要的 Cookie 的出现！
- 远程访问用户根据 DNS 负载均衡技术智能自动选择 Cache 服务器

2. 缺点

- 当源服务器资源更新后，如果 CDN 节点上缓存数据还未过期，用户访问到的依旧是过期的缓存资源，这会导致用户最终访问出现偏差。因此，开发者需要手动刷新相关资源，使 CDN 缓存保持为最新的状态。

### 简述 bundless 的优势与不足

#### 优势

1.  项目启动快。因为不需要过多的打包，只需要处理修改后的单个文件，所以响应速度是 `O(1)` 级别，刷新即可即时生效，速度很快。
2.  浏览器加载块。利用浏览器自主加载的特性，跳过打包的过程。
3.  本地文件更新，重新请求单个文件。

#### 缺点

兼容性略差

### 什么是 semver，~ 与 ^ 的区别

semver，Semantic Versioning 语义化版本的缩写，文档可见 `https://semver.org/`，它由 `[major, minor, patch]` 三部分组成，其中：

- major: 当你发了一个含有 Breaking Change 的 API
- minor: 当你新增了一个向后兼容的功能时
- patch: 当你修复了一个向后兼容的 Bug 时

1. 对于 `~1.2.3` 而言，它的版本号范围是 `[1.2.3, 1.3.0)`
2. 对于 `^1.2.3` 而言，它的版本号范围是 `[1.2.3, 2.0.0)`，可最大限度地在向后兼容与新特性之间做取舍

### 自动发现更新

- 升级版本号，最不建议的事情就是手动在 package.json 中进行修改。毕竟，你无法手动发现所有需要更新的 package。
- 可借助于 `npm outdated`，发现有待更新的 package。仍然需要手动在 package.json 更改版本号进行升级。
- 使用 `npm outdated`，还可以列出其待更新 package 的文档。`npm outdated -l`
- 推荐一个功能更强大的工具 `npm-check-updates`，比 `npm outdated` 强大百倍。
- `npx npm-check-updates -u`，可自动将 package.json 中待更新版本号进行重写。
- 升级 `[minor]` 小版本号，有可能引起 Break Change，可仅仅升级到最新的 patch 版本。`npx npm-check-updates --target patch`

### 如何修复某个 npm 包的紧急 bug

使用 patch-package，例如：

```bash
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

简单的就不说了

1. main：npm package 的入口文件，当我们对某个 package 进行导入时，实际上导入的是 main 字段所指向的文件。main 是 CommonJS 时代的产物，也是最古老且最常用的入口文件。main 字段作为 commonjs 入口。
2. module：module 字段作为 esmodule 入口。使用 import 对该库进行导入，则首次寻找 module 字段引入，否则引入 main 字段。
3. exports 可以更容易地控制子目录的访问路径，也被称为 export map。可以根据模块化方案不同选择不同的入口文件，还可以根据环境变量(NODE_ENV)、运行环境(nodejs/browser/electron) 导入不同的入口文件。（相当于设个唯一别名？）
4. browserslist：设置运行时浏览器版本
5. sideEffects：false：开启 tree shaking-没有文件有副作用，全都可以 tree-shaking；true：关闭 tree shaking，所有文件都有副作用，全都不可 tree-shaking；[]：列出有副作用的文件不进行 tree-shaking，其他都可以 tree-shaking。
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

npm install 之后会计算每个包的 sha1 值(PS:安全散列算法(Secure Hash Algorithm))，然后将包与他的 sha1 值关联保存在 package-lock.json 里面，下次 npm install 时，会根据 package-lock.json 里面保存的 sha1 值去文件夹里面寻找包文件，如果找到就不用重新下载安装了。

- `npm cache verify`：重新计算，磁盘文件是否与 sha1 值匹配，如果不匹配可能删除。要对现有缓存内容运行脱机验证，请使用 `npm cache verify`。
- `npm cache clean --force`：删除磁盘所有缓存文件。

#### 一个 npm script 的生命周期

当我们执行任意 npm run 脚本时，将自动触发 pre/post 的生命周期。

比如：当手动执行 `npm run abc` 时，将在此之前自动执行 `npm run preabc`，在此之后自动执行 `npm run postabc`。

执行 npm publish，将自动执行以下脚本:

- prepublishOnly: 最重要的一个生命周期。如需要在发包之前自动做一些事情，如测试、构建等，请在 prepulishOnly 中完成。
- prepack
- prepare: 最常用的生命周期。`npm install` 之后自动执行，`npm publish` 之前自动执行。
- postpack
- publish
- postpublish
- 发包实际上是将本地 package 中的所有资源进行打包，并上传到 npm 的一个过程。你可以通过 `npm pack` 命令查看详情

#### npm script 钩子的风险

有很多 npm package 被攻击后，就是通过 `npm postinstall` 自动执行一些事，比如挖矿等。

#### 总结 npm run script 时发生了什么

- 表面上：`npm run xxx`的时候，首先会去项目的 package.json 文件里找 scripts 里找对应的 xxx，然后执行 xxx 的命令，例如启动 vue 项目 `npm run serve`的时候，实际上就是执行了`vue-cli-service serve` 这条命令。
- 实际上：`vue-cli-service`这条指令不存在操作系统中，我们在安装依赖的时候，是通过 npm i xxx 来执行的，例如 `npm i @vue/cli-service`，npm 在 安装这个依赖的时候，就会在 `node_modules/.bin/` 目录中创建好 `vue-cli-service` 为名的几个可执行文件，实际是些软链接/node 脚本。
- 从 `package-lock.json` 中可知，当我们`npm i` 整个新建的 vue 项目的时候，npm 将 `bin/vue-cli-service.js` 作为 bin 声明了。
  所以在 `npm install` 时，npm 读到该配置后，就将该文件软链接到 `./node_modules/.bin` 目录下，而 npm 还会自动把`node_modules/.bin`加入`$PATH`，这样就可以直接作为命令运行依赖程序和开发依赖程序，不用全局安装了。如果把包安装在全局环境，那么就可以直接使用这个命令。
- 也就是说，`npm i` 的时候，npm 就帮我们把这种软连接配置好了，其实这种软连接相当于一种映射，执行`npm run xxx` 的时候，就会到 `node_modules/.bin`中找对应的映射文件，如果没找到就去全局找，然后再找到相应的 js 文件来执行。
- 为什么`node_modules/bin`中 有三个`vue-cli-service`文件? -- 在不同的系统中执行不同的脚本（跨平台执行）

1. 运行 `npm run xxx` 的时候，npm 会先在当前目录的 `node_modules/.bin` 查找要执行的程序，如果找到则运行；
2. 没有找到则从全局的 `node_modules/.bin` 中查找，`npm i -g xxx` 就是安装到到全局目录；
3. 如果全局目录还是没找到，那么就从 path 环境变量中查找有没有其他同名的可执行程序。

#### npm i 时发生了什么

> npm 模块安装机制

1. npm install 执行后，会检查并获取 npm 配置，优先级为：`项目级别的.npmrc文件 > 用户级别的.npmrc文件 > 全局的.npmrc文件 > npm内置的.npmrc文件`，查看配置命令：`npm config ls -l`。
2. 然后检查项目中是否有 package-lock.json 文件。
   - 如果有，检查 package-lock.json 和 package.json 中声明的依赖是否一致
     - 一致：直接使用 package-lock.json 中声明的依赖，从缓存或者网络中加载依赖
     - 不一致：各个版本的 npm 处理方式：![各个版本的 npm 处理方式](https://cdn.jsdelivr.net/gh/EricYangXD/vital-images@master/imgs/npm-v.png)
   - 如果没有，根据 package.json 递归构建依赖树，然后根据依赖树下载完整的依赖资源，在下载时会检查是否有相关的资源缓存
     - 存在：将缓存资源解压到 node_modules 中
     - 不存在：从远程仓库下载资源包，并校验完整性，并添加到缓存，同时解压到 node_modules 中
3. 最后生成 package-lock.json 文件。

- 构建依赖树时，不管是直接依赖还是子依赖，都会按照扁平化的原则，优先将其放置在 node_modules 根目录中(最新的 npm 规范)。在这个过程中，如果遇到相同的模块，会检查已放置在依赖树中的模块是否符合新模块的版本范围——如果符合，则跳过；不符合，则在当前模块的 node_modules 下放置新模块。
- npm 安装依赖时，会下载到缓存.npm 当中，然后解压到项目的 node_modules 中。
- 再次安装依赖的时候，会根据 package-lock.json 中存储的 integrity、version、name 信息生成一个唯一的 key，然后拿着 key 去目录中查找对应的缓存记录，如果有缓存资源，就会找到 tar 包的 hash 值，根据 hash 再去找缓存的 tar 包，并把对应的二进制文件解压到相应的项目 node_modules 下面，省去了网络下载资源的开销。

```bash
#  获取缓存位置
npm config get cache
# /Users/eric/.npm

#  清除缓存
npm cache clean --force
```

- 另外 npm-cache 文件夹中不包含全局安装的包，所以想清除存在问题的包为全局安装包时，需用 `npm uninstall -g <package>`解决
- npm 工程钩子生命周期： `preinstall、install、postinstall、prepublish、prepare`

#### npm 实现原理

输入 npm install 命令并敲下回车后，会经历如下几个阶段（以 npm 5.5.1 为例）：

1. 执行工程自身 preinstall
   - 当前 npm 工程如果定义了 preinstall 钩子此时会被执行。
2. 确定首层依赖模块
   - 首先需要做的是确定工程中的首层依赖，也就是 dependencies 和 devDependencies 属性中直接指定的模块（假设此时没有添加 npm install 参数）。
   - 工程本身是整棵依赖树的根节点，每个首层依赖模块都是根节点下面的一棵子树，npm 会开启多进程从每个首层依赖模块开始逐步寻找更深层级的节点。
3. 获取模块
   - 获取模块是一个递归的过程，分为以下几步：
   - 获取模块信息。在下载一个模块之前，首先要确定其版本，这是因为 package.json 中往往是 semantic version（semver，语义化版本）。此时如果版本描述文件（npm-shrinkwrap.json 或 package-lock.json）中有该模块信息直接拿即可，如果没有则从仓库获取。如 packaeg.json 中某个包的版本是 ^1.1.0，npm 就会去仓库中获取符合 1.x.x 形式的最新版本。
   - 获取模块实体。上一步会获取到模块的压缩包地址（resolved 字段），npm 会用此地址检查本地缓存，缓存中有就直接拿，如果没有则从仓库下载。
   - 查找该模块依赖，如果有依赖则回到第 1 步，如果没有则停止。
4. 模块扁平化（dedupe）
   - 上一步获取到的是一棵完整的依赖树，其中可能包含大量重复模块。比如 A 模块依赖于 loadsh，B 模块同样依赖于 lodash。在 npm3 以前会严格按照依赖树的结构进行安装，因此会造成模块冗余。
   - 从 npm3 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有重复模块时，则将其丢弃。
   - 这里需要对重复模块进行一个定义，它指的是模块名相同且  semver 兼容。每个 semver 都对应一段版本允许范围，如果两个模块的版本允许范围存在交集，那么就可以得到一个兼容版本，而不必版本号完全一致，这可以使更多冗余模块在 dedupe 过程中被去掉。
   - 比如 node-modules 下 foo 模块依赖 lodash@^1.0.0，bar 模块依赖 lodash@^1.1.0，则  ^1.1.0  为兼容版本。
   - 而当 foo 依赖 lodash@^2.0.0，bar 依赖 lodash@^1.1.0，则依据 semver 的规则，二者不存在兼容版本。会将一个版本放在 node_modules 中，另一个仍保留在依赖树里。

```bash
举个例子，假设一个依赖树原本是这样：

node_modules
-- foo
---- lodash@version1
-- bar
---- lodash@version2

假设 version1 和 version2 是兼容版本，则经过 dedupe 会成为下面的形式：

node_modules
-- foo
-- bar
-- lodash（保留的版本为兼容版本）

假设 version1 和 version2 为非兼容版本，则后面的版本保留在依赖树中：

node_modules
-- foo
-- lodash@version1
-- bar
---- lodash@version2
```

5. 安装模块
   - 这一步将会更新工程中的 node_modules，并执行模块中的生命周期函数（按照 preinstall、install、postinstall 的顺序）。
6. 执行工程自身生命周期
   - 当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）。
   - 最后一步是生成或更新版本描述文件，npm install 过程完成。

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

- Audit，审计，检测你的所有依赖是否安全。`npm audit / yarn audit` 均有效。通过审计，可看出有风险的 package、依赖库的依赖链、风险原因及其解决方案。
- 通过 `npm audit fix` 可以自动修复该库的风险，原理就是升级依赖库，升级至已修复了风险的版本号。`npm audit fix`
- `yarn audit` 无法自动修复，需要使用 `yarn upgrade` 手动更新版本号，不够智能。
- synk 是一个高级版的 `npm audit`，可自动修复，且支持 CICD 集成与多种语言。`npx snyk`，`npx wizard`，`npx snyk wizard`

### Long Term Cache

0. 通过在服务器端/网关端对资源设置以下 Response Header，进行强缓存一年时间，称为永久缓存，即 Long Term Cache。`Cache-Control: public,max-age=31536000,immutable`
1. 假设有两个文件: index.js 和 lib.js，且 index 依赖于 lib，由 webpack 打包后将会生成两个 chunk -- `index.aaaaaa.js`和`lib.aaaaaa.js `，假设 lib.js 文件内容发生变更，index.js 由于引用了 lib.js，可能包含其文件名，那么它的 hash 是否会发生变动？

- 不一定。打包后的 index.js 中引用 lib 时并不会包含 lib.aaaaaa.js，而是采用 chunkId 的形式，如果 chunkId 是固定的话(chunkIds = deterministic 时)，则不会发生变更。即在 webpack 中，通过 `optimization.chunkIds = 'deterministic'` 可设置确定的 chunkId，来增强 Long Term Cache 能力。此时打包，仅仅 lib.js 路径发生了变更 -- `lib.bbbbbb.js`。
