<template>
  <el-dialog
    title="区域统计"
    :visible="dialogVisible"
    width="820px"
    :before-close="handleClose"
    center
    :append-to-body="true"
    :close-on-click-modal="false"
    custom-class="dialog"
    v-dialogDrag
  >
    <el-table
      :data="tableData"
      height="364"
      :stripe="true"
      :header-row-style="{background: '#909399'}"
      :header-cell-style="{background: 'rgb(247,247, 247)'}"
      empty-text="数据为空"
    >
      <el-table-column
      style="font-size: 12px;"
        size="mini"
        v-for="(item,index) in fields"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="myFormatter"
        :min-width="75"
        :resizable='true'
        :show-overflow-tooltip="true"
        align="center"
      ></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["dialogVisible", "tableData"],
  data() {
    return {
      fields: [
        {
          label: "Brand",
          width: 100,
          prop: "Brand"
        },
        {
          label: "SP",
          // width: 100,
          prop: "SP",
        },
        {
          label: "PC",
          // width: 80,
          prop: "PC",
        },
        {
          label: "BPPC",
          // width: 100,
          prop: "BPPC",
        },
        {
          label: "IND",
          // width: 100,
          prop: "IND",
        },
        {
          label: "CNOOC",
          width: 80,
          prop: "CNOOC"
        },
        {
          label: "SC",
          // width: 100,
          prop: "SC"
        },
        {
          label: "Caltex",
          // width: 100,
          prop: "Caltex"
        },
        {
          label: "Shell",
          // width: 100,
          prop: "Shell",
        },
        {
          label: "total",
          width: 80,
          prop: "total",
        }
      ]
    };
  },
  methods: {
    myFormatter(row, col, cellValue, index) {
      let v = Number.parseFloat(cellValue)
      if (isNaN(v)) return cellValue
      else {
        if (row['Brand'].indexOf('%') > 0) return v.toFixed(2)+'%';
        else return v.toFixed(2);
      } 
    },
    handleClose(done) {
      //   this.$confirm("确认关闭？")
      //     .then(_ => {
      //       done();
      //     })
      //     .catch(_ => {});
      this.updateVisible(false);
    },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    }
  },
  mounted() {
    // console.log(this.tableData);
  },
  watch: {
    tableData(val) {
      // console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
 /deep/ .el-dialog__body {
    padding: 10px ;
}
</style>