<template>
  <div>
    {{ currentKey ? `${currentKey}: ` : '' }}
    <!-- 前缀 -->
    <el-icon :size="15" class="prefix-icon" @click="changeVisible">
      <CaretBottom v-if="visible"/>
      <CaretRight v-else/>
    </el-icon>
    <span v-show="isArray(oldData)">{{ visible ? '[' : `[...]${isLastLine ? '' : ','}` }}</span>
    <span v-show="isObject(oldData)">{{ visible ? '{' : `{...}${isLastLine ? '' : ','}` }}</span>
    <!-- 主体部分 -->
    <div
      v-show="visible"
      v-for="item in mergedData"
      :key="item.toString()"
      :class="{'indent': currentKey, 'indent2': !currentKey}"
    >
      <!-- 如果相同则直接输出 -->
      <BaseTree
        v-if="item.equal"
        :data="item.value"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
      ></BaseTree>
      <!-- 数据为新增 -->
      <BaseTree
        v-else-if="item.added"
        :data="item.value"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
        class="item-added"
      ></BaseTree>
      <!-- 数据为移除 -->
      <BaseTree
        v-else-if="item.removed"
        :data="item.value"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
        class="item-removed"
      ></BaseTree>
      <!-- 数据为改动，存在内部差异 -->
      <DiffTreeLineMode
        v-else-if="item.changed"
        :oldData="item.oldValue"
        :newData="item.newValue"
        :current-key="item.key"
        :expand="expand"
        :is-last-line="!!item.isLastLine"
      ></DiffTreeLineMode>
    </div>
    <!-- 后缀 -->
    <div v-show="visible" v-if="isArray(oldData)">{{ isLastLine ? ']' : '],' }}</div>
    <div v-show="visible" v-else-if="isObject(oldData)">{{ isLastLine ? '}' : '},' }}</div>
  </div>
</template>
<script>
import { getMergedData, isObject, isArray } from "@/util/methods";
import BaseTree from './BaseTree';

export default {
  name: 'DiffTreeLineMode',
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
      default: false,
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
.prefix-icon {
  cursor: pointer;
  vertical-align: middle;
}
.indent {
  margin-left: 15px;
}
.indent2 {
  margin-left: 30px;
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