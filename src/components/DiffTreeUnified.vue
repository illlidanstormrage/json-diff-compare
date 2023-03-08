<template>
  <div>
    <span :style="`margin-left:${level*15}px;`">
      {{ currentKey ? `${currentKey}: ` : '' }}
      <!-- 前缀 -->
      {{ isArray(oldData) ? '[' : isObject(oldData) ? '{' : '' }}
      {{ !visible ? '...' : '' }}
      {{ isArray(oldData) && !visible ? '],' : isObject(oldData) && !visible ? '},' : '' }}
    </span>
    <!-- 主体部分 -->
    <div
      v-show="visible"
      v-for="item in mergedData"
      :key="item.toString()"
    >
      <!-- 如果相同则直接输出 -->
      <BaseTree
        v-if="item.equal"
        :data="item.value"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
        :level="level + 1"
        status="equal"
      ></BaseTree>
      <!-- 数据为新增 -->
      <BaseTree
        v-else-if="item.added"
        :data="item.value"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
        :level="level + 1"
        status="added"
      ></BaseTree>
      <!-- 数据为移除 -->
      <BaseTree
        v-else-if="item.removed"
        :data="item.value"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
        :level="level + 1"
        status="removed"
      ></BaseTree>
      <!-- 数据为改动，存在内部差异 -->
      <DiffTreeUnified
        v-else-if="item.changed"
        :oldData="item.oldValue"
        :newData="item.newValue"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
        :level="level + 1"
      ></DiffTreeUnified>
    </div>
    <!-- 后缀 -->
    <span v-show="visible" v-if="isArray(oldData)" :style="`margin-left:${level*15}px;`">{{ isLastLine ? ']' : '],' }}</span>
    <span v-show="visible" v-else-if="isObject(oldData)" :style="`margin-left:${level*15}px;`">{{ isLastLine ? '}' : '},' }}</span>
  </div>
</template>
<script>
import { getMergedData, isObject, isArray } from "@/util/methods";
import BaseTree from './BaseTree';

export default {
  name: 'DiffTreeUnified',
  data() {
    return {
      mergedData: null,
      visible: true,
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
    expand: {
      type: Boolean,
      default: true,
    },
    currentKey: {
      type: String,
    },
    isLastLine: {
      type: Boolean,
      default: true,
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    isObject,
    isArray,
    initMergedData() {
      this.mergedData = getMergedData(this.oldData, this.newData);
    },
    changeVisible() {
      this.visible = !this.visible;
    },
  },
}
</script>
<style scoped>
span {
  display: inline-block;
  width: 100%;
}
</style>