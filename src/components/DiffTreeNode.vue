<template>
  <div class="main-container">
    <div v-for="(item, index) in mergedData" :key="index" class="content-container">
      <!-- 如果相同则直接输出到屏幕 -->
      <template v-if="item.equal">
        <p class="item-equal" v-if="isObject(item.value)">
          {{ item.key ? item.key + ': {' : '{' }}{{ item.value }}
          <DiffTreeNode
            v-for="(element, key) in item.value"
            :oldData="element"
            :newData="element"
            :key="key"
          ></DiffTreeNode>
        </p>
        <p class="item-equal" v-else-if="isArray(item.value)">
          {{ item.key ? item.key + ': [' : '[' }}
          <DiffTreeNode
            v-for="(element, eleIndex) in item.value"
            :oldData="element"
            :newData="element"
            :key="eleIndex"
          ></DiffTreeNode>
        </p>
        <p class="item-equal" v-else>{{ item.key ? item.key + ': ' : '' }}{{ item.value }}</p>
      </template>
      <!-- 数据有差异 -->
      <template v-else>
        <!-- 数据为新增 -->
        <div v-if="item.added">
          <p class="item-added" v-if="isObject(item.value)">
            {{ item.key ? item.key + ': {' : '{' }}{{ item.value }}
            <DiffTreeNode
                v-for="(element, key) in item.value"
                :oldData="element"
                :newData="element"
                :key="key"
            ></DiffTreeNode>
          </p>
          <p class="item-added" v-else-if="isArray(item.value)">
            {{ item.key ? item.key + ': [' : '[' }}
            <DiffTreeNode
                v-for="(element, eleIndex) in item.value"
                :oldData="element"
                :newData="element"
                :key="eleIndex"
            ></DiffTreeNode>
          </p>
          <p class="item-added">{{ item.key ? item.key + ': ' : ''}}{{ item.value }}</p>
        </div>
        <!-- 数据为移除 -->
        <div v-else-if="item.removed">
          <p class="item-removed" v-if="isObject(item.value)">
            {{ item.key ? item.key + ': {' : '{' }}{{ item.value }}
            <DiffTreeNode
              v-for="(element, key) in item.value"
              :oldData="element"
              :newData="element"
              :key="key"
            ></DiffTreeNode>
          </p>
          <p class="item-removed" v-else-if="isArray(item.value)">
            {{ item.key ? item.key + ': [' : '[' }}
            <DiffTreeNode
              v-for="(element, eleIndex) in item.value"
              :oldData="element"
              :newData="element"
              :key="eleIndex"
            ></DiffTreeNode>
          </p>
          <p class="item-removed">{{ item.key ? item.key + ': ' : ''}}{{ item.value }}</p>
        </div>
        <!-- 数据为改动 -->
        <div v-else-if="item.changed">
          <div v-if="item.deep">
            {{ item.key ? item.key + ': ' : '' }}
            <DiffTreeNode
              :oldData="item.oldValue"
              :newData="item.newValue"
            ></DiffTreeNode>
          </div>
          <div v-else>
            <p class="item-removed">{{ item.key ? item.key + ': ' : ''}}{{ item.oldValue }}</p>
            <p class="item-added">{{ item.key ? item.key + ': ' : ''}}{{ item.newValue }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getMergedData, getType, isObject, isArray } from "@/util/lineDiffUtil";

export default {
  name: 'DiffTreeNode',
  data() {
    return {

    }
  },
  props: {
    oldData: {},
    newData: {},
  },
  methods: {
    getType,
    isObject,
    isArray,
  },
  computed: {
    mergedData() {
      return getMergedData(this.oldData, this.newData);
    }
  }
}
</script>
<style scoped>
.main-container {

}
.content-container {
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
.item-equal {

}
</style>