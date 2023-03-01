<template>
  <div>
    <div v-for="(item, key) in data" :key="key" class="indent">
      <span v-if="isObject(data)" class="indent">{{`${key}: `}}</span>
      <!-- 前缀 -->
      <el-icon :size="15" class="prefix-icon" @click="changeVisible(key)" v-if="!isSimpleData(item)">
        <CaretBottom v-if="visibleMap[key]"/>
        <CaretRight v-else/>
      </el-icon>
      <span v-show="isArray(item)">{{ visibleMap[key] ? '[' : `[...]${lastLine(key) ? '' : ','}` }}</span>
      <span v-show="isObject(item)">{{ visibleMap[key] ? '{' : `{...}${lastLine(key) ? '' : ','}` }}</span>
      <!-- 内容 -->
      <NormalTreeNode
        v-if="!isSimpleData(item)"
        v-show="visibleMap[key]"
        :data="item"
        :is-last-line="lastLine(key)"
        :expand="expand"
      ></NormalTreeNode>
      <span
        v-show="visibleMap[key]"
        v-else
        class="indent"
      >
        {{ convertData(item) }}{{lastLine(key) ? '' : ','}}
      </span>
    </div>
    <span v-if="isArray(data)" class="indent">{{ isLastLine ? ']' : '],' }}</span>
    <span v-else-if="isObject(data)" class="indent">{{ isLastLine ? '}' : '},' }}</span>
  </div>
</template>

<script>
import {isArray, isObject, isSimpleData, convertData} from "@/util/methods";
import {reactive} from "vue";

export default {
  name: "NormalTreeNode",
  data() {
    return {
      visibleMap: reactive({}),
    }
  },
  props: {
    data: {
      required: true,
      type: [Object, Array],
    },
    isInArray: {
      default: false,
    },
    isLastLine: {
      type: Boolean,
      default: true,
    },
    expand: {
      type: Boolean,
      default: true,
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
    changeVisible(key) {
      this.visibleMap[key] = !this.visibleMap[key];
    },
    initVisibleMap() {
      Object.keys(this.data).forEach(key => {
        this.visibleMap[key] = this.expand;
      });
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
</style>