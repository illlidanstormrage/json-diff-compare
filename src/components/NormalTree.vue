<template>
  <div class="main-container">
    <el-icon :size="15" class="prefix-icon" @click="changeVisible">
      <CaretBottom v-if="visible"/>
      <CaretRight v-else/>
    </el-icon>
    <span v-show="isArray(data)">{{ visible ? '[' : '[...]' }}</span>
    <span v-show="isObject(data)">{{ visible ? '{' : '{...}' }}</span>
    <NormalTreeNode
      v-show="visible"
      :data="data"
      :expand="expand"
      is-last-line
    ></NormalTreeNode>
  </div>
</template>

<script>
import NormalTreeNode from "@/components/NormalTreeNode";
import {isArray, isObject} from "@/util/methods";

export default {
  name: "NormalTree",
  data() {
    return {
      visible: true,
    }
  },
  props: {
    data: {
      type: [Array, Object],
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NormalTreeNode,
  },
  methods: {
    isArray,
    isObject,
    changeVisible() {
      this.visible = !this.visible;
    },
  }
}
</script>
<style scoped>
.main-container {

}
.prefix-icon {
  cursor: pointer;
  vertical-align: middle;
}
</style>