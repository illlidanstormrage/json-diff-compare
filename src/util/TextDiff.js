// 操作状态，三种
const [DELETE, ADD, EQUAL] = [-1, 1, 0];

/**
 * 差异对象，用于表示一个子串和这个子串是怎么得到的
 *
 */
class DiffObj {
  /**
   * @param {Number} operation 操作
   * @param {String} text 文本
   * @constructor
   */
  constructor(operation, text) {
    this.operation = operation;
    this.text = text;
  }
}

/**
 * 回溯
 *
 * @param {Object} dMap
 * @param {Number} len1 终点x
 * @param {Number} len2 终点y
 * @param {Number} D 最终差异数量
 * @returns {Array<DiffObj>} 差异结果
 */
const getSnakes = (dMap, len1, len2, D) => {
  let [x, y, d] = [len1, len2, D];
  // snakes 存 ADD DELETE步骤
  const snakes = [];
  // 两个文本差异数量已知，往回倒推步骤
  while (d > 0) {
    // 取出最后一步的差异所能到达的点 vMap[k]
    const vMap = dMap[d];
    // 去除前一步的差异所能到达的点
    const vMapPrev = dMap[d - 1];
    // 计算当前位置的截距，首次循环是终点所在的截距
    const k = x - y;
    // 获取当前截距的 x 坐标
    const xEnd = vMap[k];
    // 判断该步是通过 ADD 还是 DELETE 操作得到的
    // 1、当前截距与负差异相同
    //  1.1 这种情况说明了当前差异除了走斜线以外，其余都是通过 + 完成的
    // 2、当前截距不等于挣差异 且 前一步差异所到达的点中，
    //  当前解决的上截距能到达的最远点的 x 值比下截距能到达的最远点的 x 值大
    //  2.1 该判断的后半部分保证了删除优先于增加
    const down = (k === -d) || (k !==d && vMapPrev[k + 1] > vMapPrev[k - 1]);
    // 如果是通过 + 到达的该点，则上一步的截距就在上面，即 k+1，反之 k-1
    const kPrev = down ? k+1 : k-1;
    // 获取真正的前驱点
    const xStart = vMapPrev[kPrev];
    const yStart = xStart - kPrev;
    // 将当前前驱点、斜线开始点（LCS）、当前点的 x 值压入 snakes
    snakes.unshift([xStart, down ? xStart : xStart + 1, xEnd]);
    [x, y] = [xStart, yStart];
    d--;
  }
  return snakes;
}

/**
 * 获取snake路径，myers算法，前置处理后text1和text2不存在相同前缀
 *
 * @param {String} text1
 * @param {String} text2
 */
const myers = (text1, text2) => {
  const [len1, len2] = [text1.length, text2.length];
  // vMap[k] 表示 截距k 能到达的最远的 x， k = x-y
  const vMap = {
    1: 0,
  };
  // 存储每一步差异 d 中的所有截距 K 能到达的最远端 x 的值，用于计算 D-path
  const dMap = [
    {
      1: 0,
    }
  ];
  for (let d = 0; d <= len1 + len2; d++) {
    const temp = {};
    // 向右下的行进方向不计入循环
    // 截距范围为 负差异到正差异 步长为2
    for (let k = -d; k <= d; k +=2) {
      // 贪心策略，在执行 k 的时候， k-1 已经到达了最远端
      let x;
      // 情况1：k = -d 表示首次循环，即左边界，只能通过 ADD 到达
      // 情况2： 当前不在左边界 且 上一截距的 x 小于下一截距的 x (DELETE 比 ADD 优先)
      if (k === -d || ((k !== d) && vMap[k - 1] < vMap[k + 1])) {
        x = vMap[k + 1];
      } else {
        x = vMap[k - 1] + 1;
      }
      // 用 k = x - y 计算出 y
      let y = x - k;
      // 考虑走斜线（对 text1 和 text2 字符串进行比较，如果当前 x、y 位置的字符相同则走斜线
      while (x < len1 && y < len2 && text1[x] === text2[y]) {
        x++;
        y++;
      }
      // 更新 截距k 所能到达的最远端 x
      vMap[k] = x;
      // 记录当前截距的最新端点
      temp[k] = x;
      // 如果 x 和 y 都到达了各自字符串的末端，说明路径寻找到了终点
      if (x === len1 && y === len2) {
        // 端点表
        dMap[d] = temp;
        // 生成 diff 路径
        return getSnakes(dMap, len1, len2, d);
      }
    }
    // 刷新当前差异下能到达的最远端
    dMap[d] = temp;
  }
  return [];
}

/**
 * 生成差异数组
 *
 * @param {String} text1
 * @param {String} text2
 * @returns {Array<DiffObj>} 差异数组
 */
const mainDiff = (text1, text2) => {
  const res = [];
  const snakes = myers(text1, text2);
  let y = 0;
  let prevOperation;
  snakes.forEach((item, index) => {
    // s：步骤的前驱 x
    // m：步骤的 LCS 开始 x
    // e：步骤的终点 x
    const [s, m, e] = item;
    let large = s;
    // 开头部分就有相同字符
    if (index === 0 && s !== 0) {
      res.push(new DiffObj(EQUAL, text1.substring(0, s)));
      y += s;
    }
    // 如果子串是删除操作 标记DELETE，否则 标记ADD
    if (m - s === 1) {
      // 如果钱一个操作也是 DELETE，则直接在差异数组最后一个操作上追加字符
      if (prevOperation === DELETE) {
        res[res.length - 1].text += text1[s];
      } else {
        res.push(new DiffObj(DELETE, text1[s]));
      }
      large = m;
      prevOperation = DELETE;
    } else {
      // 如果前一个操作也是ADD，追加字符
      if (prevOperation === ADD) {
        res[res.length - 1].text += text2[y++];
      } else {
        res.push(new DiffObj(ADD, text2[y++]));
      }
      prevOperation = ADD;
    }
    // LCS部分，终点位置 e 减去 LCS 开始的位置，即相同子串的长度
    if (large < e) {
      res.push(new DiffObj(EQUAL, text1.substring(large, e)));
      y += e - large;
      prevOperation = EQUAL;
    }
  });
  return res;
}

/**
 * 计算两个文本的diff，假定文本的头尾均不同
 *
 * @param {String} text1
 * @param {String} text2
 * @returns {Array<DiffObj>}
 */
const computeDiff = (text1, text2) => {
  if (!text1) {
    return [new DiffObj(ADD, text2)];
  }
  if (!text2) {
    return [new DiffObj(DELETE, text1)];
  }
  // 如果文本有包含关系，直接返回结果
  if (text1.length > text2.length) {
    const i = text1.indexOf(text2);
    if (i !== -1) {
      return [
        new DiffObj(DELETE, text1.substring(0, i)),
        new DiffObj(EQUAL, text2),
        new DiffObj(DELETE, text1.substring(i + text2.length)),
      ];
    }
  } else if (text1.length < text2.length) {
    const i = text2.indexOf(text1);
    if (i !== -1) {
      return [
        new DiffObj(ADD, text2.substring(0, i)),
        new DiffObj(EQUAL, text1),
        new DiffObj(ADD, text2.substring(i + text1.length)),
      ];
    }
  }
  // 不满足以上优化条件，执行差异比对
  return mainDiff(text1, text2);
}

const getTextDiff = (text1, text2) => {
  /**
   * 获取两个字符串的公共头部长度
   */
  const _getCommonPrefixLength = () => {
    // 如果有字符串为空，直接返回
    if (!text1 || !text2) {
      return 0;
    }
    let len = 0;
    for (let i = 0; i < text1.length && i < text2.length && text1[i] === text2[i]; i++) {
      len++;
    }
    return len;
  }

  /**
   * 找到字符串公共尾部的长度
   */
  const _getCommonSuffixLength = () => {
    // 如果字符串为空，直接返回
    if (!text1 || !text2) {
      return 0;
    }
    let len = 0;
    for (let i = text1.length - 1, j = text2.length - 1; i >= 0 && j >=0 && text1[i] === text2[j]; i--, j--) {
      len++;
    }
    return len;
  }

  if (text1 === null || text2 === null) {
    throw new Error('文本输入为null');
  }
  // 字符串相等直接返回
  if (text1 === text2) {
    if (text1) {
      return [new DiffObj(EQUAL, text1)];
    }
    return [];
  }
  // 去掉text1和text2的前后缀相同部分的长度
  const commonPrefixLen = _getCommonPrefixLength();
  const commonSuffixLen = _getCommonSuffixLength();
  const commonPrefix = text1.substring(0, commonPrefixLen);
  const commonSuffix = text1.substring(text1.length - commonSuffixLen);
  // 掐头去尾后对前后缀不同的部分计算diff
  const diffArr = computeDiff(text1.substring(commonPrefixLen, text1.length - commonSuffixLen),
    text2.substring(commonPrefixLen, text2.length - commonSuffixLen));
  if (commonPrefix) {
    diffArr.unshift(new DiffObj(EQUAL, commonPrefix));
  }
  if (commonSuffix) {
    diffArr.push(new DiffObj(EQUAL, commonSuffix));
  }
  return diffArr;
}