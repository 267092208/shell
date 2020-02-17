<template>
  <div>
    <el-container class="container">
      <el-header height="44px" class="header">
        <h2>测试表格标题</h2>
        <!-- <el-button @click="resetDateFilter">清除日期过滤器</el-button> -->
        <!-- <el-button @click="clearFilter">清除所有过滤器</el-button> -->
        <div class="el-icon-close close-btn" size="mini" @click.stop="closePanel"></div>
      </el-header>
      <el-main class="content">
        <el-table ref="filterTable" :data="tableData" style="width: 100%">
          <el-table-column
            prop="date"
            width="180"
            column-key="date"
            :render-header="test"
            fixed
          ></el-table-column>

          <el-table-column prop="name"  width="180" fixed></el-table-column>
          <el-table-column prop="address"  :formatter="formatter"></el-table-column>
          <el-table-column
            prop="tag"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.tag === '家' ? 'primary' : 'success'"
                disable-transitions
              >{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer class="footer">tool box</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          tag: "家"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          tag: "公司"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          tag: "家"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          tag: "公司"
        }
      ]
    };
  },
  methods: {
    resetDateFilter() {
      this.$refs.filterTable.clearFilter("date");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/public.scss";

.container {
  // margin-top: $header-height;
  height: calc(100vh - 60px);
  overflow: hidden;
  z-index: 99999;
  position: relative;
  .header {
    background: #3399ff;
    text-align: center;
    position: relative;
    color: #303133;
    h2 {
      margin: 8px auto;
    }
  }
  .content {
  }
  .footer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>