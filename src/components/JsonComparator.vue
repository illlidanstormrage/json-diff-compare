<template>
  <div class="json-comparator-container">
    <div class="header">
      <h2>JSON 差异对比工具</h2>
      <el-button
          type="primary"
          @click="compareJson"
          :disabled="!leftJson || !rightJson"
          size="large"
      >
        <i class="el-icon-refresh-right"></i> 对比 JSON
      </el-button>
    </div>

    <div class="comparison-container">
      <!-- 左侧输入框 -->
      <div class="json-editor left-editor">
        <div class="editor-header"></div>
        <el-input
            type="textarea"
            :rows="25"
            placeholder="请输入左侧 JSON 内容..."
            v-model="leftJson"
            resize="none"
            class="editor-textarea"
        ></el-input>
      </div>

      <!-- 右侧输入框 -->
      <div class="json-editor right-editor">
        <div class="editor-header"></div>
        <el-input
            type="textarea"
            :rows="25"
            placeholder="请输入右侧 JSON 内容..."
            v-model="rightJson"
            resize="none"
            class="editor-textarea"
        ></el-input>
      </div>
    </div>

    <!-- 对比结果 -->
    <div class="diff-results" v-if="showResult">
      <div class="results-header">
        <h3>差异对比结果</h3>
        <span class="diff-count">共发现 {{ diffCount }} 处差异</span>
      </div>

      <div class="results-container">
        <div class="result-box left-result">
          <pre v-html="leftResult"></pre>
        </div>
        <div class="result-box right-result">
          <pre v-html="rightResult"></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JsonComparator',
  data() {
    return {
      leftJson: '',
      rightJson: '',
      leftResult: '',
      rightResult: '',
      showResult: false,
      diffCount: 0
    }
  },
  methods: {
    async compareJson() {
      try {
        // 解析并规范化JSON
        const [leftObj, rightObj] = await Promise.all([
          this.parseAndNormalize(this.leftJson),
          this.parseAndNormalize(this.rightJson)
        ]);

        // 生成规范化后的JSON字符串
        const [leftStr, rightStr] = [
          JSON.stringify(leftObj, null, 2),
          JSON.stringify(rightObj, null, 2)
        ];

        // 使用Myers算法找出差异
        const { leftHtml, rightHtml, diffCount } = this.myersDiff(leftStr, rightStr);

        this.leftResult = leftHtml;
        this.rightResult = rightHtml;
        this.diffCount = diffCount;
        this.showResult = true;

        // 滚动到结果区域
        this.$nextTick(() => {
          const resultsEl = document.querySelector('.diff-results');
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth' });
          }
        });
      } catch (e) {
        this.$message.error('JSON 解析错误: ' + e.message);
      }
    },

    // 解析并规范化JSON
    parseAndNormalize(jsonStr) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const obj = JSON.parse(jsonStr);
          resolve(this.normalizeJson(obj));
        }, 0);
      });
    },

    // 规范化JSON（排序键名）
    normalizeJson(obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => this.normalizeJson(item));
      }

      // 对对象按键名排序
      const sortedObj = {};
      Object.keys(obj).sort().forEach(key => {
        sortedObj[key] = this.normalizeJson(obj[key]);
      });

      return sortedObj;
    },

    // Myers差分算法实现
    myersDiff(a, b) {
      const aLines = a.split('\n');
      const bLines = b.split('\n');

      // 生成编辑图
      const { trace, max } = this.shortestEdit(aLines, bLines);

      // 回溯找出差异
      const diffPath = this.backtrack(trace, aLines, bLines, max);

      // 生成带高亮的HTML
      return this.renderDiffs(diffPath, bLines);
    },

    // 最短编辑路径计算
    shortestEdit(a, b) {
      const n = a.length;
      const m = b.length;
      const max = n + m;
      const v = new Array(2 * max + 1).fill(-1);
      const trace = [];

      v[max + 1] = 0;

      for (let d = 0; d <= max; d++) {
        trace.push([...v]);

        for (let k = -d; k <= d; k += 2) {
          let x, y;

          if (k === -d || (k !== d && v[max + k - 1] < v[max + k + 1])) {
            x = v[max + k + 1];
          } else {
            x = v[max + k - 1] + 1;
          }

          y = x - k;

          while (x < n && y < m && a[x] === b[y]) {
            x++;
            y++;
          }

          v[max + k] = x;

          if (x >= n && y >= m) {
            return { trace, max };
          }
        }
      }

      return { trace, max };
    },

    // 回溯找出差异路径
    backtrack(trace, a, b, max) {
      let x = a.length;
      let y = b.length;
      const path = [];

      for (let d = trace.length - 1; d >= 0; d--) {
        const v = trace[d];
        const k = x - y;

        let prevK;
        if (k === -d || (k !== d && v[max + k - 1] < v[max + k + 1])) {
          prevK = k + 1;
        } else {
          prevK = k - 1;
        }

        const prevX = v[max + prevK];
        const prevY = prevX - prevK;

        while (x > prevX && y > prevY) {
          path.push({ type: 'equal', aLine: a[x - 1], bLine: b[y - 1] });
          x--;
          y--;
        }

        if (d > 0) {
          if (x === prevX) {
            path.push({ type: 'insert', bLine: b[y - 1] });
            y--;
          } else {
            path.push({ type: 'delete', aLine: a[x - 1] });
            x--;
          }
        }
      }

      return path.reverse();
    },

    // 渲染差异结果
    renderDiffs(diffPath) {
      let leftHtml = '';
      let rightHtml = '';
      let diffCount = 0;

      diffPath.forEach(diff => {
        switch (diff.type) {
          case 'equal':
            leftHtml += `${diff.aLine}\n`;
            rightHtml += `${diff.bLine}\n`;
            break;
          case 'delete':
            leftHtml += `<span class="diff-delete">${diff.aLine}</span>\n`;
            rightHtml += `<span class="diff-empty">-</span>\n`;
            diffCount++;
            break;
          case 'insert':
            leftHtml += `<span class="diff-empty">-</span>\n`;
            rightHtml += `<span class="diff-insert">${diff.bLine}</span>\n`;
            diffCount++;
            break;
        }
      });

      return { leftHtml, rightHtml, diffCount };
    }
  }
}
</script>

<style>
/* 全局样式 */
.json-comparator-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.header h2 {
  margin: 0;
  color: #333;
}

.comparison-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.json-editor {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.editor-header {
  padding: 12px 15px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  font-weight: bold;
  color: #606266;
}

.editor-textarea {
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.diff-results {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.results-header h3 {
  margin: 0;
  color: #333;
}

.diff-count {
  color: #409eff;
  font-weight: bold;
}

.results-container {
  display: flex;
  gap: 20px;
}

.result-box {
  flex: 1;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  overflow: auto;
  max-height: 600px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  line-height: 1.5;
  font-size: 14px;
}

/* 差异高亮样式 */
.diff-delete {
  background-color: #ffdddd;
  display: inline-block;
  width: 100%;
  padding: 2px 0;
  text-decoration: line-through;
}

.diff-insert {
  background-color: #ddffdd;
  display: inline-block;
  width: 100%;
  padding: 2px 0;
}

.diff-empty {
  color: #999;
  display: inline-block;
  width: 100%;
  padding: 2px 0;
  background: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .comparison-container, .results-container {
    flex-direction: column;
  }

  .json-editor, .result-box {
    width: 100%;
  }
}
</style>