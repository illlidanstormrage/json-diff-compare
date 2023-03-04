<template>
  <!-- 普通数据 -->
  <div v-if="isSimpleData(data)">{{ currentKey ? `${currentKey}: ` : '' }}{{ convertData(data) }}{{ isLastLine ? '' : ',' }}</div>
  <div v-else>
    {{ currentKey ? `${currentKey}: ` : '' }}
    <!-- 前缀 -->
    <el-icon :size="15" class="prefix-icon" @click="changeVisible">
      <CaretBottom v-if="visible"/>
      <CaretRight v-else/>
    </el-icon>
    <span v-show="isArray(data)">{{ visible ? '[' : `[...]${isLastLine ? '' : ','}` }}</span>
    <span v-show="isObject(data)">{{ visible ? '{' : `{...}${isLastLine ? '' : ','}` }}</span>
    <!-- 内容 -->
    <BaseTree
      v-for="(item, key) in data"
      :key="key"
      v-show="visible"
      :data="item"
      :is-last-line="lastLine(key)"
      :current-key="isObject(data) ? key : ''"
      :expand="expand"
      :class="{'indent': currentKey, 'indent2': !currentKey}"
    ></BaseTree>
    <!-- 后缀 -->
    <div v-show="visible" v-if="isArray(data)" :class="{'indent': !currentKey}">{{ isLastLine ? ']' : '],' }}</div>
    <div v-show="visible" v-else-if="isObject(data)" :class="{'indent': !currentKey}">{{ isLastLine ? '}' : '},' }}</div>
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
</style>