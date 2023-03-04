<template>
  <div>
    <!-- 主体部分 -->
    <div v-for="(item, key) in mergedData" :key="key" class="indent">
      <!-- 如果相同则直接输出 -->
      <BaseTree
        v-if="item.equal"
        :data="item"
        :current-key="isObject(item) ? key : ''"
        expand
      ></BaseTree>
      <!-- 数据为新增 -->
      <BaseTree
        v-else-if="item.added"
        :data="item"
        :current-key="isObject(item) ? key : ''"
        expand
        class="item-added"
      ></BaseTree>
      <!-- 数据为移除 -->
      <BaseTree
        v-else-if="item.removed"
        :data="item"
        :current-key="isObject(item) ? key : ''"
        expand
        class="item-removed"
      ></BaseTree>
      <!-- 数据为改动 -->
      <DiffTreeNode
        v-else-if="item.changed"
        :oldData="item.oldValue"
        :newData="item.newValue"
      ></DiffTreeNode>
    </div>
  </div>
</template>
<script>
import { getMergedData, getType, isObject, isArray, isSimpleData } from "@/util/methods";
import BaseTree from './BaseTree';

export default {
  name: 'DiffTreeNode',
  data() {
    return {
      mergedData: null,
    }
  },
  components: {BaseTree},
  mounted() {
    this.initMergedData();
  },
  props: {
    oldData: {
      type: [Object, Array],
    },
    newData: {
      type: [Object, Array],
    },
  },
  methods: {
    getType,
    isObject,
    isArray,
    isSimpleData,
    initMergedData() {
      this.mergedData = getMergedData(this.oldData, this.newData);
    },
  },
}
</script>
<style scoped>
.indent {
  margin-left: 15px;
}
.content-container p {
  margin: 1px 0;
}
.item-removed {
  background-color: #fce6e6;
}
.item-added {
  background-color: #dee7bf;
}
</style>