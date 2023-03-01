import { getLCS } from './ArrayDiff'
import { isEqual } from './ObjectDiff'

export const getType = (obj) => {
  return Object.prototype.toString.call(obj)
    .replace('[object ', '')
    .replace(']', '')
    .toLowerCase();
}

export const isSameType = (oldObj, newObj) => {
  return Object.prototype.toString.call(oldObj) === Object.prototype.toString.call(newObj);
}

export const isObject = (obj) => {
  return getType(obj) === 'object';
}

export const isArray = (obj) => {
  return Array.isArray(obj);
}

export const isSimpleData = (obj) => {
  return !isObject(obj) && !isArray(obj);
}

export const getKey = (item) => {
  return item.key ? `${item.key}: ` : '';
}

export const getComma = (item) => {
  return item.isLastLine ? '' : ',';
}

export const convertData = (data) => {
  switch (getType(data)) {
    case 'number':
    case 'boolean':
    case 'regexp':
      return data.toString();
    case 'null':
      return 'null';
    case 'undefined':
      return 'undefined';
    case 'function':
      return 'function() {...}';
    case 'string':
      return `"${data.toString()}"`;
    default:
      return data;
  }
}

/**
 * 根据新老数据生成带标记的集合
 *
 * @param oldData
 * @param newData
 * @returns {*[]}
 *  对象中属性的含义：
 *  added: 表示是否为添加
 *  removed: 表示是否为移除
 *  equal: 表示是否相等
 *  changed: 表示是否为修改
 *  value: 记录数据，在changed情况下不存在
 *  oldValue、newValue：记录前后数据，仅在changed状态下存在
 *  deep: 表示是否需要深度比较
 *  key: 记录数据的key，当数据为对象中的属性时存在
 *  isLastLine: 是否为当前层级的最后一行
 */
export const getMergedData = (oldData, newData) => {
  const res = [];

  const _getArrayMerged = () => {
    const lcs = getLCS(oldData, newData, isEqual);
    // 先将两个数组进行填充，便于显示
    let [oldIndex, newIndex] = [0, 0];
    let commonItem = lcs.shift();
    // 如果存在公共数据，开始循环
    while (commonItem) {
      // 新老数据均与公共数据的当前公共项不同，说明存在差异，对公共项之前的部分进行处理
      while (!isEqual(oldData[oldIndex], commonItem) && !isEqual(newData[newIndex], commonItem)) {
        // 二者都还没到公共项，认为是当前位置的元素发生了改变
        res.push({
          changed: true,
          deep: !(isSimpleData(oldData[oldIndex]) && isSimpleData(newData[newIndex])),
          oldValue: oldData[oldIndex],
          newValue: newData[newIndex],
        });
        oldIndex++;
        newIndex++;
      }
      // 还有未到达公共项的部分加入res，并标记
      while (!isEqual(oldData[oldIndex], commonItem)) {
        res.push({
          removed: true,
          value: oldData[oldIndex],
        });
        oldIndex++;
      }
      while (!isEqual(newData[newIndex], commonItem)) {
        res.push({
          added: true,
          value: newData[newIndex],
        });
        newIndex++;
      }
      // 将公共点加入res
      res.push({
        equal: true,
        value: commonItem,
        isLastLine: (oldIndex === oldData.length - 1 && newIndex === newData.length - 1),
      });
      oldIndex++;
      newIndex++;
      commonItem = lcs.shift();
    }
    // 最后一个公共元素之后的数据加入结果
    while (oldIndex < oldData.length && newIndex < newData.length) {
      res.push({
        changed: true,
        deep: !(isSimpleData(oldData[oldIndex]) && isSimpleData(newData[newIndex])),
        oldValue: oldData[oldIndex],
        newValue: newData[newIndex],
        isLastLine: (oldIndex === oldData.length - 1 && newIndex === newData.length - 1),
      });
      oldIndex++;
      newIndex++;
    }
    while (oldIndex < oldData.length) {
      res.push({
        removed: true,
        value: oldData[oldIndex],
        isLastLine: oldIndex === oldData.length - 1,
      });
      oldIndex++
    }
    while (newIndex < newData.length) {
      res.push({
        added: true,
        value: newData[newIndex],
        isLastLine: newIndex === newIndex.length - 1,
      });
      newIndex++;
    }
  }

  const _getObjectMerged = () => {
    const oldKeySet = Object.keys(oldData);
    const newKeySet = Object.keys(newData);
    const commonKeySet = oldKeySet.filter(key => newKeySet.includes(key));
    const oldKeyDiffSet = oldKeySet.filter(key => !newKeySet.includes(key));
    const newKeyDiffSet = newKeySet.filter(key => !oldKeySet.includes(key));
    // 键名有差异直接添加差异
    oldKeyDiffSet.forEach((key, index) => {
      res.push({
        removed: true,
        key: key,
        value: convertData(oldData[key]),
        isLastLine: (index === oldData.length - 1),
      });
    });
    newKeyDiffSet.forEach((key, index) => {
      res.push({
        changed: true,
        deep: !(isSimpleData(oldData[key]) && isSimpleData(newData[key])),
        key: key,
        oldValue: convertData(oldData[key]),
        newValue: convertData(newData[key]),
        isLastLine: (index === newData.length - 1),
      });
    });
    // 对键名相同的部分比较
    commonKeySet.forEach(key => {
      if (!isEqual(oldData[key], newData[key])) {
        res.push({
          changed: true,
          deep: !(isSimpleData(oldData[key]) && isSimpleData(newData[key])),
          key: key,
          oldValue: convertData(oldData[key]),
          newValue: convertData(newData[key]),
        });
      } else {
        res.push({
          equal: true,
          key: key,
          value: convertData(oldData[key]),
        });
      }
    });
  }

  // 类型不同的数据直接标记差异
  if (!isSameType(oldData, newData)) {
    res.push({
      removed: true,
      value: convertData(oldData),
    }, {
      added: true,
      value: convertData(newData),
    });
  } else if (isSimpleData(oldData)) {
    // 非对象或数组类型，直接比较差异
    if (oldData === newData) {
      res.push({
        equal: true,
        value: convertData(oldData),
      });
    } else {
      res.push({
        removed: true,
        value: convertData(oldData),
      }, {
        added: true,
        value: convertData(newData),
      });
    }
  } else {
    // 数组类型
    if (isArray(oldData)) {
      _getArrayMerged();
    } else if (isObject(oldData)) {
      _getObjectMerged();
    }
  }
  return res;
}