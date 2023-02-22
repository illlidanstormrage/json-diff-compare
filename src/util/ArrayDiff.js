/**
 * 获取两个数组的最长公共子序列
 *
 * @param {Array} arr1
 * @param {Array} arr2
 * @param {Function} callback 回调函数，判断元素是否相等
 * @returns {Array}
 */
export const getLCS = (arr1, arr2, callback = null) => {
  const [len1, len2] = [arr1.length, arr2.length];
  // 初始化dp数组
  const dp = new Array(len1 + 1).fill(0).map(() => new Array(len2 + 1).fill(0));
  // 获取dp数组
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (callback ? !callback(arr1[i - 1], arr2[j - 1]) : arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  // 根据dp数组反推路径，优先向上走
  const path = [];
  let [row, col] = [len1, len2];
  while (path.length < dp[arr1.length][arr2.length]) {
    if (dp[row][col] === dp[row - 1][col]) {
      row--;
    } else if (dp[row][col] === dp[row][col-1]) {
      col--;
    } else {
      path.unshift(arr1[row - 1]);
      row--;
      col--;
    }
  }
  return path;
}

/**
 *
 * @param {Array} arr1
 * @param {Array} arr2
 * @param {Function} callback
 */
export const getArrDiff = (arr1, arr2, callback = null) => {
  const trimCommonPrefix = () => {
    let count = 0;
    while (arr1.length > 0 && arr2.length > 0 && (callback ? !callback(arr1[0], arr2[0]) : arr1[0] === arr2[0])) {
      arr1.shift();
      arr2.shift();
      count++;
    }
    return count;
  }

  const trimCommonSuffix = () => {
    let count = 0;
    while (arr1.length > 0 && arr2.length > 0 &&
    (callback ? !callback(arr1[arr1.length - 1], arr2[arr2.length - 1]) : arr1[arr1.length - 1] === arr2[arr2.length - 1])) {
      arr1.pop();
      arr2.pop();
      count++;
    }
    return count;
  }

  const lcs = getLCS(arr1, arr2, callback);
  // 拷贝副本，初始化数据
  let lcsCopy, arrCopy, offset, arrHead, lcsHead;
  // 找到arr1和lcs的不同
  const diffArr1 = [];
  lcsCopy = JSON.parse(JSON.stringify(lcs));
  arrCopy = JSON.parse(JSON.stringify(arr1));
  // 去掉公共尾部
  trimCommonSuffix();
  // 去掉公共头部，会影响下标，用offset来记录偏移
  offset = trimCommonPrefix();
  // 初始化lcsHead栈顶元素
  lcsHead = lcsCopy.shift();
  while ((arrHead = arrCopy.shift()) !== undefined) {
    // 存在差异，加入diffArr
    if (callback ? callback(lcsHead, arrHead) : lcsHead !== arrHead) {
      diffArr1.push(offset);
    } else {
      lcsHead = lcsCopy.shift();
    }
    offset++;
  }
  // 找到arr2和lcs的不同
  const diffArr2 = [];
  lcsCopy = JSON.parse(JSON.stringify(lcs));
  arrCopy = JSON.parse(JSON.stringify(arr2));
  trimCommonSuffix();
  offset = trimCommonPrefix();
  lcsHead = lcsCopy.shift();
  while ((arrHead = arrCopy.shift()) !== undefined) {
    if (callback ? callback(lcsHead, arrHead) : lcsHead !== arrHead) {
      diffArr2.push(offset);
    } else {
      lcsHead = lcsCopy.shift();
    }
    offset++;
  }
  return [diffArr1, diffArr2];
}