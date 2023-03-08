<template>
  <!-- 普通数据 -->
  <div v-if="isSimpleData(data)">
    <span
      :style="`padding-left:${level*15}px;`"
      :class="{
        'item-added': status === 'added',
        'item-removed': status === 'removed',
      }"
    >
      {{ currentKey ? `${currentKey}: ` : '' }}{{ convertData(data) }}{{ isLastLine ? '' : ',' }}
    </span>
  </div>
  <div v-else>
    <span
      :style="`padding-left:${level*15}px;`"
      :class="{
        'item-added': status === 'added',
        'item-removed': status === 'removed',
      }"
    >
      {{ currentKey ? `${currentKey}: ` : '' }}
      <!-- 前缀 -->
      {{ isArray(data) ? '[' : isObject(data) ? '{' : '' }}
      {{ !visible ? '...' : '' }}
      {{ isArray(data) && !visible ? '],' : isObject(data) && !visible ? '},' : '' }}
    </span>
    <!-- 内容 -->
    <BaseTree
      v-for="(item, key) in data"
      :key="key"
      v-show="visible"
      :data="item"
      :is-last-line="lastLine(key)"
      :current-key="isObject(data) ? key : ''"
      :expand="expand"
      :level="level + 1"
      :status="status"
    ></BaseTree>
    <!-- 后缀 -->
    <span
      v-show="visible"
      v-if="isArray(data)"
      :style="`padding-left:${level*15}px;`"
      :class="{
        'item-added': status === 'added',
        'item-removed': status === 'removed',
      }"
    >{{ isLastLine ? ']' : '],' }}</span>
    <span
      v-show="visible"
      v-else-if="isObject(data)"
      :style="`padding-left:${level*15}px;`"
      :class="{
        'item-added': status === 'added',
        'item-removed': status === 'removed',
      }"
    >{{ isLastLine ? '}' : '},' }}</span>
  </div>
</template>

<script>
import {isArray, isObject, isSimpleData, convertData} from "@/util/methods";

export default {
  name: "BaseTree",
  data() {
    return {
      visible: true,
    }
  },
  props: {
    data: {
      required: true,
    },
    currentKey: {
      type: String,
    },
    isLastLine: {
      type: Boolean,
      default: true,
    },
    expand: {
      type: Boolean,
      default: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    status: {
      enum: ['equal', 'added', 'removed'],
      default: 'equal',
    }
  },
  mounted() {
    this.initVisibleMap();
  },
  methods: {
    isObject,
    isArray,
    isSimpleData,
    convertData,
    changeVisible() {
      this.visible = !this.visible
    },
    initVisibleMap() {
      this.visible = this.expand;
    },
    lastLine(key) {
      return key.toString() === Object.keys(this.data).pop();
    },
  },
}
</script>
<style scoped>
span {
  display: inline-flex;
  width: 100%;
}
.item-removed {
  background-color: #fce6e6;
}
.item-added {
  background-color: #dee7bf;
}
</style>