<template>
  <div>
    <el-dialog
      title="经济数据"
      :visible="dialogVisible"
      width="800px"
      :before-close="handleClose"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="dialog"
      @open="openDiaglog"
    v-dialogDrag
    >
      <div v-loading="loading" style="width: 100%;">
        <el-container>
          <el-header
            height="40px"
            style="background: #fff; box-shadow: 0 0 0 0; border: 0px solid #E4E7ED; justify-content: flex-start; margin: 0px; padding: 0px;"
          >
            <el-select v-model="chioceYear" placeholder="请选择" size="mini" @change="selectYear">
              <el-option v-for="item in yearOptions" :key="item" :label="item+'年度'" :value="item"></el-option>
            </el-select>
            <div style="margin: 0px 3px;">
              <el-input
                placeholder="请输入年份"
                suffix-icon="el-icon-date"
                v-model.number="yearImport"
                size="mini"
              ></el-input>
            </div>
            <el-button
              size="mini"
              style="padding: 6px 15px; font-size:14px;"
              type="primary"
              icon="el-icon-circle-plus"
              :disabled="canCreate"
              :loading="creating"
              @click="createData"
            >添加数据</el-button>
          </el-header>
        </el-container>
        <div style="height: 364px; border:1px solid #DCDFE6">
          <pl-table
            :datas="tableData"
            ref="plTable"
            stripe
            :height-change="false"
            :pagination-show="false"
            border
            @current-change="selectRow"
            size="mini"
            :row-height="25"
            @cell-dblclick="editrow"
            :header-drag-show="false"
            :header-drag-style="false"
            fit
            header-cell-class-name="header-cell"
          >
            <pl-table-column
              v-for="(item,index) in fields"
              :key="index"
              :resizable="true"
              :label="item.label"
              :prop="item.prop"
              align="center"
              :min-width="120"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
              <div v-if="!showEdit(scope.column.id)">{{scope.row[item.label]}}</div>
              <el-input
                size="mini"
                v-model="scope.row[item.label]"
                v-else
                @blur="EditEnd(scope.row)"
                @keyup.enter.native="EditEnd(scope.row)"
              />
            </template>
            </pl-table-column>
          </pl-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";
import {
  getEconomicYearList,
  getEconomicFields,
  getEconomicDataWithYear,
  createEconomicByYear
} from "@/data/ma";
import layerData from '@/data/layer'

export default {
  props: ["dialogVisible"],
  computed: {
    ...mapState({
      selectFeatures: state => state.selectFeature.selectFeatures
    }),
    canCreate() {
      return this.yearImport == "";
    }
  },
  data() {
    return {
      yearImport: "",
      fields: [],
      isViewerOpen: false,
      currentIndex: 0,
      chioceYear: undefined,
      yearOptions: [],
      loading: false,
      tableUpdate: false,
      creating: false,
      currentRow: null,
      tableData: [],
      editMark: ''
    };
  },
  methods: {
    handleClose(done) {
      window.removeEventListener('click', this.dropdownClick);
      this.updateVisible(false);
    },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },
    selectRow(row, oldRow) {
      this.$refs.plTable.setCurrentRow(row);
    },
    async EditEnd(row) {
      if (this.editMark != null) {
        this.editMark = null;
        let model = {}
        this.fields.map(item => item.label).forEach(item => {
          model[item] = row[item]
        });
        model['uid'] = row['ID']
        const res = await layerData.updateItemForJj(row['ID'], model)
      }
    },
    dropdownClick(e){
        if (e.target.classList[0] != this.editMark) {
          if (e.target.classList[0] === 'el-input__inner' || e.path[1].classList[0] === this.editMark) return;
          else { // 失去焦点
            this.editMark = '';
          }
        }
    },
    showEdit(value) {
      if (value) return this.editMark === value.toString()
      else false
    },
    editrow(row, column, cell, event) {
        this.editMark = cell.classList[0];
        setTimeout(() => {
          let input = cell.getElementsByTagName('input')
          input[0].focus()
        }, 200);
    },
    async createData() {
      this.creating = true;
      const result = await createEconomicByYear(
        this.selectFeatures[0].get("id"),
        this.yearImport
      );
      this.tableData = await getEconomicDataWithYear(
        this.selectFeatures[0].get("id"),
        this.yearImport.toString()
      );
      this.yearOptions = await getEconomicYearList(this.selectFeatures[0].get("id"));
      this.chioceYear = this.yearImport; // FIXME: 错误数据
      this.creating = false;
    },
    async selectYear(year) {
      this.tableUpdate = true;
      this.tableData = await getEconomicDataWithYear(
        this.selectFeatures[0].get("id"),
        year.toString()
      );
      this.tableUpdate = false;
    },
    async openDiaglog() {
      this.loading = true;
      if (this.selectFeatures[0]) {
        this.yearOptions = await getEconomicYearList(this.selectFeatures[0].get("id"));
        // 空chioceYear尝试初始化
        this.chioceYear == null &&
          this.yearOptions.length > 0 &&
          (this.chioceYear = this.yearOptions[0]);
        let fields = await getEconomicFields();
        this.fields = fields
          .map(item => ({
            label: item.DisplayText,
            prop: item.FieldName,
            type: item.Type
          }))
          .filter(item => !(item.label == "Maid" || item.label == "年份"));
        if (this.chioceYear != null){
          this.tableData = await getEconomicDataWithYear(
            this.selectFeatures[0].get("id"),
            this.chioceYear.toString()
          );
          if (typeof tableData === 'string' || ('Error' in tableData && (tableData = tableData.Msg))){
            this.$message.error({message: tableData, offset: 60})
            tableData = []
          } 
          this.tableData = tableData
       }
        else this.tableData = [];
      }
      window.addEventListener('click', this.dropdownClick);
      this.loading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.icon-btn-disabled {
  color: #999 !important;
  &:hover {
    cursor: not-allowed;
  }
}
/deep/ .el-dialog__body {
  padding: 10px;
}

</style>