<template>
  <div class="container">
    <div class="diff-aside">
      <div class="old-line-number"></div>
      <div class="new-line-number"></div>
    </div>
    <div class="diff-tree">
      <DiffTreeUnified
        :old-data="oldData"
        :new-data="newData"
        :expand="true"
      ></DiffTreeUnified>
    </div>
  </div>
</template>

<script>
import DiffTreeUnified from "./DiffTreeUnified";

export default {
  name: "DiffDetailUnified",
  data() {
    return {
      computedLineHeight: '',
    }
  },
  components: {
    DiffTreeUnified,
  },
  props: {
    oldData: {
      required: true,
      type: [Array, Object],
    },
    newData: {
      required: true,
      type: [Array, Object],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initAside();
    });
  },
  methods: {
    initAside() {
      const rows = document.querySelectorAll('span');
      const oldDiv = document.querySelector('.old-line-number');
      const newDiv = document.querySelector('.new-line-number');
      let oldCount = 0;
      let newCount = 0;
      this.computedLineHeight = window.getComputedStyle(rows[0]).height;
      rows.forEach(row => {
        // 当前行为新增
        if (row.classList.contains('item-added')) {
          oldDiv.appendChild(this.getAddedLineNumber(''));
          newDiv.appendChild(this.getAddedLineNumber(++newCount));
        } else if (row.classList.contains('item-removed')) {
          oldDiv.appendChild(this.getRemovedLineNumber(++oldCount));
          newDiv.appendChild(this.getRemovedLineNumber(''));
        } else {
          oldDiv.appendChild(this.getEqualLineNumber(++oldCount));
          newDiv.appendChild(this.getEqualLineNumber(++newCount));
        }
      });

    },
    getEqualLineNumber(rowNum) {
      const block = document.createElement('div');
      block.innerText = rowNum.toString();
      block.style.height = this.computedLineHeight;
      block.style.lineHeight = this.computedLineHeight;
      block.style.align = 'center';
      block.style.width = '100%';
      block.style.textAlign = 'center';
      return block;
    },
    getRemovedLineNumber(rowNum) {
      const block = document.createElement('div');
      block.innerText = rowNum.toString();
      block.style.height = this.computedLineHeight;
      block.style.lineHeight = this.computedLineHeight;
      block.style.align = 'center';
      block.style.backgroundColor = '#fce6e6';
      block.style.width = '100%';
      block.style.textAlign = 'center';
      return block;
    },
    getAddedLineNumber(rowNum) {
      const block = document.createElement('div');
      block.innerText = rowNum.toString();
      block.style.height = this.computedLineHeight;
      block.style.lineHeight = this.computedLineHeight;
      block.style.align = 'center';
      block.style.backgroundColor = '#dee7bf';
      block.style.width = '100%';
      block.style.textAlign = 'center';
      return block;
    },
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  border: black 1px solid;
}
.diff-aside {
  width: 70px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-right: black 1px solid;
}
.old-line-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  font-size: 2px;
}
.new-line-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  font-size: 2px;
}
.diff-tree {
  width: 100%;
}
</style>