<template>
    <el-dialog
        title="油品信息"
        :visible="dialogVisible"
        width="820px"
        :before-close="handleClose"
        center
        :append-to-body="true"
        :close-on-click-modal="false"
        custom-class="dialog"
        @open="openDiaglog"
        v-dialogDrag
    >
        <div style="height: 364px; border:1px solid #DCDFE6;overflow:auto;">
            <pl-table
                v-loading="loading"
                :datas="tableData"
                ref="plTable"
                stripe
                :height-change="false"
                :pagination-show="false"
                border
                size="mini"
                :header-drag-show="false"
                :header-drag-style="false"
                fit
            >
                <pl-table-column
                    v-for="(item,index) in fields"
                    :key="index"
                    :resizable="true"
                    :label="item.label"
                    :prop="item.prop"
                    align="center"
                    :min-width="75"
                    :formatter="myFormatter"
                    :width="item.width"
                ></pl-table-column>
            </pl-table>
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { getMAypData } from '@/data/ma';
import table from '../../../store/module/table';
export default {
    props: ["dialogVisible"],
    computed: {
        ...mapState({
            selectFeatures: state => state.selectFeature.selectFeatures
        })
    },
    data() {
        return {
            tableData: [],
            loading: false,
            fields: [
                {
                    label: "Brand",
                    width: 100,
                    prop: "Brand"
                },
                {
                    label: "SP",
                    // width: 100,
                    prop: "SP"
                },
                {
                    label: "PC",
                    // width: 80,
                    prop: "PC"
                },
                {
                    label: "BPPC",
                    // width: 100,
                    prop: "BPPC"
                },
                {
                    label: "IND",
                    // width: 100,
                    prop: "IND"
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
                    prop: "Shell"
                },
                {
                    label: "total",
                    width: 80,
                    prop: "total"
                }
            ]
        };
    },
    methods: {
        myFormatter(row, col, cellValue, index) {
            let v = Number.parseFloat(cellValue);
            if (isNaN(v)) return cellValue;
            else {
                if (row["Brand"].indexOf("%") > 0) return v.toFixed(2) + "%";
                else return v.toFixed(2);
            }
        },
        handleClose(done) {
            this.updateVisible(false);
        },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },
    async openDiaglog() {
      this.loading = true;
      let tableData
      if (this.selectFeatures.length > 1) {
        tableData = await getMAypData(this.selectFeatures.map(item => item.id)).catch(err => this.$message.error({message: err, offset: 60}));
      } else {
        tableData = await getMAypData(this.selectFeatures[0].get("id")).catch(err => this.$message.error({message: err, offset: 60}));;
      }

      if (typeof tableData === 'string' || ('Error' in tableData && (tableData = tableData.Msg))){
          this.$message.error({message: tableData, offset: 60})
          tableData = []
        } 
      this.tableData = tableData;
      this.loading = false;
    }
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
    padding: 10px;
}
</style>