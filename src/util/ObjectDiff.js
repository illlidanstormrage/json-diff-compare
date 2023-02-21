/**
 * 比较两个对象是否完全一致
 *
 * @param obj1
 * @param obj2
 */
export const isDiff = (obj1, obj2) => {
  if (obj1 instanceof Object && obj2 instanceof Object) {
    // 元素个数不一致返回true
    if (obj1.length !== obj2.length) {
      return true;
    }
    // 类型不相等，存在差异，返回true
    if (Object.prototype.toString.call(obj1) !== Object.prototype.toString.call(obj2)) {
      return true;
    }
    // 都为数组，按顺序比较
    if (Array.isArray(obj1)) {
      for (let i = 0; i < obj1.length; i++) {
        if (isDiff(obj1[i], obj2[i])) {
          return true;
        }
      }
    }
    const keyList1 = Object.keys(obj1).sort();
    const keyList2 = Object.keys(obj2).sort();
    for (let i = 0; i < keyList1.length; i++) {
      // 键名不一致，直接返回
      if (keyList1[i] !== keyList2[i]) {
        return true;
      }
      // 存在同一个key的value值不等，返回true
      if (isDiff(obj1[keyList1[i]], obj2[keyList2[i]])) {
        return true;
      }
    }
    // 全部通过则不存在差异
    return false;
  }
  // 全部通过则不存在差异
  return obj1 !== obj2;
}