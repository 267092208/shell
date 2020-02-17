<template>
  <el-dialog
    title="导出数据表"
    :before-close="handleClose"
    :visible="dialogVisible"
    width="750px"
    center
    custom-class="dialog"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-row type="flex" justify="center" align="top">
      <el-col :span="12">
        <div class="el-transfer-panel left-tran-wrap" style="width: 90%;">
          <p class="el-transfer-panel__header">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >
              所有字段
              <span v-text="`${canwriteFields.length}`"></span>
            </el-checkbox>
          </p>
          <div class="el-transfer-panel__body">
            <div class="el-transfer-panel__filter el-input el-input--small el-input--prefix">
              <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model.trim="filterText"></el-input>
            </div>
            <div
              class="el-checkbox-group el-transfer-panel__list is-filterable"
              style="width: 100%;"
            >
              <el-scrollbar style="height: 100%; overflow-x: hidden;">
                <el-checkbox-group
                  class="columnFlex"
                  v-model="checkedFields"
                  @change="handleCheckedCitiesChange"
                >
                  <el-checkbox
                    class="el-transfer-panel__item"
                    v-for="(item, index) in filterFields"
                    :label="item"
                    :key="index"
                  >{{item.displayText}}</el-checkbox>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="el-transfer-panel right-tran-wrap" style="width: 90%;">
          <p class="el-transfer-panel__header">
            <label class="el-checkbox">
              <span class="el-checkbox__label">
                要导出的字段
                <span v-text="checkedFields.length"></span>
              </span>
            </label>
          </p>
          <div class="el-transfer-panel__body" style="height: 261px;">
            <div class="el-transfer-panel__list is-filterable" style="width: 100%; height: 100%;">
              <el-scrollbar class="willExport" :native="false">
                <div class="columnFlex" style="width: 237px;">
                  <div
                    class="el-transfer-panel__item"
                    v-for="(item, index) in checkedFields"
                    :key="index"
                  >{{item.displayText}}</div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" icon="el-icon-remove-outline" @click="updateVisible(false)">取 消</el-button>
      <el-button
        size="mini"
        :icon="exportIcon"
        type="primary"
        :disabled="checkedFields.length == 0"
        :loading="exporting"
        @click="exportDataWithChoiceFields()"
      >导 出</el-button>
    </span>
  </el-dialog>
</template>

<script>
import XLSX from "xlsx";
import { mapState } from "vuex";
import { outputExcelBatch } from "@/data/layerExcelIO";

export default {
  props: ["dialogVisible", "fieldList", "layerTable"],
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      filters: state => state.layer.filters,
      globalFilters: state => state.layer.globalFilters
    }),
    canwriteFields() {
      if (this.fieldList.length > 0)
        return this.fieldList.filter(item => {
          return !item.readonly && !("get" in item) && item.displayText !== "";
        });
      else return [];
    },
    filterFields() {
      if (this.filterText == "") {
        return this.canwriteFields;
      } else {
        return this.canwriteFields.filter(({ displayText }) =>
          displayText.includes(this.filterText)
        );
      }
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      checkedFields: [],
      filterText: "",
      exportIcon: "el-icon-download",
      exporting: false
    };
  },
  methods: {
    handleClose(done) {
      this.$emit("update:dialogVisible", false);
    },
    updateVisible(b) {
      this.checkedFields = [];
      this.$emit("update:dialogVisible", b);
    },
    handleCheckAllChange(val) {
      this.checkedFields = val ? this.canwriteFields : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.canwriteFields.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.canwriteFields.length;
    },
    // 导出
    exportDataWithChoiceFields() {
      this.exporting = true;
      const fileName = `${this.currentLayer.name}.xls`;
      let filter;
      if (this.filters[this.currentLayer.id] == null)
        filter = this.globalFilters;
      else
        filter = {
          ...this.filters[this.currentLayer.id],
          ...this.globalFilters
        };
      outputExcelBatch(
        this.currentLayer.id,
        this.checkedFields.map(item => item.fieldName),
        fileName,
        filter
      )
        .then(res => {
          this.exporting = false;
          this.exportIcon = "el-icon-check";
          setTimeout(() => {
            this.exportIcon = "el-icon-download";
          }, 1000);
          this.downloadWithExportSuccess(res, fileName);
        })
        .catch(err => {
          this.exporting = false;
          this.$message.error({ message: "导出失败, 请重试!", offset: 60 });
        });
    },
    downloadWithExportSuccess(url, fileName) {
      var a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      a.remove();
    }
  }
};
</script>

<style lang='scss' scoped>
.willExport {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: visible;
}
// .willExport /deep/ .is-vertical .el-scrollbar__thumb {
//   height: 20.5px !important;
// }
.columnFlex {
  display: flex;
  flex-direction: column;
}
.left-tran-wrap,
.right-tran-wrap {
  margin-left: 17px;
  cursor: pointer;
}
</style>