/**
 * 获取两个数组的最长公共子序列
 *
 * @param {Array} arr1
 * @param {Array} arr2
 * @param {Function} callback 回调函数，判断元素是否相等
 * @returns {Array}
 */
export const getLCS = (arr1, arr2, callback = null) => {
  // 若有callback，则用callback来判断是否相等，否则使用 ===
  const _isEqual = (val1, val2) => {
    return callback ? callback(val1, val2) : val1 === val2;
  }

  /**
   * 获取两个数组的公共头部长度
   */
  const _getCommonPrefixLength = () => {
    // 如果有字符串为空，直接返回
    if (arr1.length === 0 || arr2.length === 0) {
      return 0;
    }
    let len = 0;
    for (let i = 0; i < arr1.length && i < arr2.length
    && _isEqual(arr1[i], arr2[i]); i++) {
      len++;
    }
    return len;
  }

  /**
   * 找到两个数组公共尾部的长度
   */
  const _getCommonSuffixLength = () => {
    // 如果字符串为空，直接返回
    if (arr1.length === 0 || arr2.length === 0) {
      return 0;
    }
    let len = 0;
    for (let i = arr1.length - 1, j = arr2.length - 1; i >= 0 && j >=0
    && _isEqual(arr1[i], arr2[j]); i--, j--) {
      len++;
    }
    return len;
  }

  const commonPrefixLength = _getCommonPrefixLength();
  const commonSuffixLength = _getCommonSuffixLength();
  const trimmedArr1 = arr1.slice(commonPrefixLength, arr1.length - commonSuffixLength);
  const trimmedArr2 = arr2.slice(commonPrefixLength, arr2.length - commonSuffixLength);

  const [len1, len2] = [trimmedArr1.length, trimmedArr2.length];
  // 初始化dp数组
  const dp = new Array(len1 + 1).fill(0).map(() => new Array(len2 + 1).fill(0));
  // 获取dp数组
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (_isEqual(trimmedArr1[i - 1], trimmedArr2[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  // 根据dp数组反推路径，优先向上走
  const path = [];
  let [row, col] = [len1, len2];
  while (path.length < dp[len1][len2]) {
    if (dp[row][col] === dp[row - 1][col]) {
      row--;
    } else if (dp[row][col] === dp[row][col-1]) {
      col--;
    } else {
      path.unshift(trimmedArr1[row - 1]);
      row--;
      col--;
    }
  }
  return [...arr1.slice(0, commonPrefixLength), ...path, ...arr1.slice(arr1.length - commonSuffixLength)];
}