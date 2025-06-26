let outObj = {
  inObj: { a: 1, b: 2 },
};
let newObj = Object.assign({}, outObj);
newObj.inObj.a = 2;
console.log(outObj);

// 【求满足条件的最长子串的长度】
// 给定一个字符串，只包含字母和数字，按要求找出字符串中最长（连续）子串的长度，字符串本身是其最长子串，子串满足：
// 1. 只包含 n 个字母（a~z,A~Z），其余必须是数字；
// 2. 字母可以在子串的任意位置

// 如果找不到满足要求的子串，则返回 -1.

// 示例1
// 子串：abc124acb
// n=1
// 输出：4

// 示例2
// 子串：abc124a2cb
// n=1
// 输出：5

// 示例3
// 子串：abc124a2cb
// n=2
// 输出：6

const longestString = (str, n) => {
  let i = 0,
    j = 0,
    max = 0;
  const len = str.length;

  for (i; i < len; i++) {
    let countNum = 0;

    for (j = i; j < len; j++) {
      if (Number.isNaN(Number(str[j])) && countNum < n) {
        countNum++;
      }
      // 如果已经遍历到最后一个了，或者，字母的个数已经是n了而且下一个字符还是字母，那就终止遍历，计算当前的长度和max取较大值。
      if (j === len - 1 || (countNum === n && Number.isNaN(Number(str[j + 1])))) {
        max = Math.max(max, j - i + 1);
        break;
      }
    }
  }
  console.log(max);
  return max;
};

// longestString("abc124acb", 1);
// longestString("abc124a2cb", 1);
// longestString("abc124a2cb", 2);
// longestString("123abc11a24b12", 1);
// longestString("123abc11a24b12", 2);
// longestString("123abc11a24b12", 3);
// longestString("123abc11a24b12", 4);
// longestString("123abc11a24b12", 5);
// longestString("123abc11a24b12", 6);
// longestString("123abc11a24b12", 7);
// longestString("ab1c11a24b1", 1);
// longestString("ab1c11a24b1", 2);
// longestString("ab1c11a24b1", 3);
// longestString("ab1c11a24b1", 4);
// longestString("ab1c11a24b1", 5);
// longestString("ab1c11a24b1", 6);
// "ab1c11a24b1", 1;
// "ab1c11a24b1", 2;
// "ab1c11a24b1", 3;
// "ab1c11a24b1", 4;
// "ab1c11a24b1", 5;
// "ab1c11a24b1", 6;

// 题目描述
// 输入一个英文句子，句子包含若干个单词，每个单词间有一个空格。现在你需要将句子中的每个单词逆置，然后输出单词逆置后的句子（不改变之前单词的顺序）。
// 解答要求时间限制：1000ms, 内存限制：100MB
// 输入
// 输入只有一行，包含一个长度都不超过100的字符串S，表示英文句子。
// 输出
// 输出只有一行，即按要求输出处理后的英文句子。
// 样例
// 输入样例 1 复制
// Who Love Solo
// 输出样例 1
// ohW evoL oloS
// 提示样例 1

// 输入样例 2 复制
// ohW evoL oloS
// 输出样例 2
// Who Love Solo

// const reverseWords = (str) => {
// 	if (!str) return "";
// 	const res = [];
// 	const words = str.split(" ");

// 	for (let word of words) {
// 		const _word = word.split("").reverse().join("");
// 		res.push(_word);
// 	}
// 	console.log(res.join(" "));
// 	return res.join(" ");
// };

const reverseWords = (str) => {
  if (!str) return "";
  const len = str.length;
  let i = 0,
    j = 0;
  for (i, j; j < len; j++) {
    if (str[j] === " ") {
      // change(i, j - 1, str);
      let start = i,
        end = j - 1;
      while (start < end) {
        let tempEnd = str[end];
        let tempStart = str[start];
        str.substr(start, 1, tempEnd);
        str.substr(end, 1, tempStart);

        // [(str[start], str[end])] = [
        // 	str[end],
        // 	str[start],
        // ]);
        start++;
        end--;
      }
      console.log(str);
      i = j + 1;
    }
  }

  // console.log(str);
  return str;
};

// const change = (start, end, str) => {
// 	while (start < end) {
// 		[str[start], str[end]] = [str[end], str[start]];
// 		start++;
// 		end--;
// 	}
// };

reverseWords("Who Love Solo");
