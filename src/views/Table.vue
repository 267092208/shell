<template>
  <div class="layertable">
    <span class="title">
      {{currentLayer?currentLayer.name:''}}
      <i class="close el-icon-close" @click="returnIndex"></i>
    </span>
    <div class="tablebox" style="width:100%;height:calc(100% - 85px);" v-loading="loading">
      <pl-table
        :datas="tableDataShow"
        ref="plTable"
        header-drag-style
        stripe
        :height-change="false"
        :pagination-show="false"
        border
        use-virtual
        @current-change="selectRow"
        cell-class-name="setfont"
        :row-height="25"
        @cell-dblclick="editrow"
        header-cell-class-name="headcell"
        thtd-beyond-hiding
        @sort-change="testsort"
      >
        <!--show-overflow-tooltip属性代表超出则内容部分给出提示框-->
        <template v-for="item in fixColumn">
          <pl-table-column
            :key="item"
            :prop="item"
            :label="item"
            fixed
            sortable
            width="100"
            align="center"
          >
            <template slot="header" slot-scope="scope">
              <div class="headLabel">
                <span>{{scope.column.label}}</span>
                <i
                  class="iconfont icon-arrow-up sorticon"
                  v-if="showSortIcon[scope.column.label] == 'ascending'"
                ></i>
                <i
                  class="iconfont icon-arrow-lower sorticon"
                  v-if="showSortIcon[scope.column.label] == 'descending'"
                ></i>
                <el-input v-model="searchKey[scope.column.label]" class="headInput"></el-input>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="cellLabel">{{scope.row[item]}}</div>
              <el-input
                size="mini"
                v-model="scope.row[item]"
                class="cellInput"
                @blur="EditEnd"
                v-if="showEdit"
                @keyup.enter.native="EditEnd"
              />
            </template>
          </pl-table-column>
        </template>
        <template v-for="(item,index) in sliceList">
          <pl-table-column
            v-if="!checkType(item)"
            :key="item"
            sortable
            :resizable="true"
            :prop="item"
            :label="item"
            align="center"
            width="120"
            :show-overflow-tooltip="topTipList(item)"
          >
            <template slot="header" slot-scope="scope">
              <div class="headLabel">
                <span>{{scope.column.label}}</span>
                <i
                  class="iconfont icon-arrow-up sorticon"
                  v-if="showSortIcon[scope.column.label] == 'ascending'"
                ></i>
                <i
                  class="iconfont icon-arrow-lower sorticon"
                  v-if="showSortIcon[scope.column.label] == 'descending'"
                ></i>
                <el-input v-model="searchKey[scope.column.label]" class="headInput"></el-input>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="cellLabel">{{scope.row[item]}}</div>
              <el-input
                size="mini"
                v-model="scope.row[item]"
                class="cellInput"
                @blur="EditEnd"
                v-if="showEdit"
                @keyup.enter.native="EditEnd"
              />
            </template>
          </pl-table-column>
          <pl-table-column
            v-else
            sortable
            :key="index"
            :resizable="true"
            :prop="item[0]"
            :label="item[0]"
            align="center"
            width="120"
          >
            <template slot="header" slot-scope="scope">
              <div class="headLabel">
                <span>{{scope.column.label}}</span>
                <i
                  class="iconfont icon-arrow-up sorticon"
                  v-if="showSortIcon[scope.column.label] == 'ascending'"
                ></i>
                <i
                  class="iconfont icon-arrow-lower sorticon"
                  v-if="showSortIcon[scope.column.label] == 'descending'"
                ></i>
                <div class="headIcon">
                  <i
                    :class="searchKey[scope.column.label] == undefined ? 'null' : searchKey[scope.column.label] == true ? 'iconfont icon-xuanzhong' : 'false'"
                  ></i>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="headIcon">
                <i
                  :class="searchKey[scope.column.label] == undefined ? 'null' : searchKey[scope.column.label] == true ? 'iconfont icon-xuanzhong' : 'false'"
                ></i>
              </div>
            </template>
          </pl-table-column>
        </template>
      </pl-table>
    </div>
    <div class="scrollbox1321" id="DIVscroll">
      <div class="scrollbottom" :style="{width:scrollwidth+'px',height:'10px'}"></div>
    </div>
    <div class="bootom">
      <div class="contorlBtn">
        <el-tooltip class="item" effect="dark" content="查看/修改位置" placement="top">
          <el-button icon="iconfont icon-dingwei" class="iconbtn" disabled></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <!-- <i class="iconbtn iconfont icon-delete2"></i> -->
          <el-button icon="iconfont icon-delete2" class="iconbtn" disabled></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="跳转到地图" placement="top">
          <el-button icon="iconfont icon-earth" class="iconbtn" disabled></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="历史记录" placement="top">
          <!-- <i class="iconbtn iconfont icon-lishi"></i> -->
          <el-button
            icon="iconfont icon-lishi"
            class="iconbtn"
            :disabled="currentRow == null ? true : false"
            @click="showHistroy"
          ></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出" placement="top">
          <!-- <i class="iconbtn iconfont icon-exit-door"></i> -->
          <el-button icon="iconfont icon-exit-door" class="iconbtn" disabled></el-button>
        </el-tooltip>
      </div>
      <el-pagination
        class="btmright"
        @size-change="tableSizeChange"
        @current-change="tablePageChange"
        :current-page="page"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="tableSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      ></el-pagination>
    </div>
    <History
      :historyData="historyData"
      :historyLoading="historyLoading"
      :historyVisible.sync="historyVisible"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import layer from '../data/layer.js'
import { getHistory } from '../data/yz.js'
import fields from '../config/layer/fields.js'
import { getCityAndMATreeObj } from "@/data/division.js";
import { deepCopy } from "../assets/js/utils.js";
import History from '@/components/tableDialog/history.vue'
export default {
  components: {
    History
  },
  data() {
    return {
      tableData: [],
      // tableDataShow:[],
      resultDate: [],
      fixColumn: ["油站编号", "站名", "品牌"],
      sortColumns: [
        // "油站编号", "站名", "品牌",
        "日期", "开始时间", "数车时长", "小网络名", "经营状况", ["短期重开"], "区县镇", "市场环境", "网络类型1",
        "网络类型2", "路名", "路侧", "道路类型", "单向双向", "车道数量", "限速", "弯角", "近角远角", ["辅道内"], ["可否穿越"], ["隔离带"],
        ["可否调头"], "出口长度M", "前庭长M", "前庭面积", "前庭深M", "出入口数量", ["规则地块"], "布局", "雨棚长M", "雨棚深M", "雨棚数量",
        ["便利店"], "便利店面积M2", ["宿舍"], ["换油"], "加油机数", "加油岛数", "加油位数", "可视度",
        "可进出度", "车流量", "商圈",
        "站点优势评分", "加油站等级", "位置优势评分",
        "实测车流_汽油车", "实测车流_摩托车", "实测车流_柴油车", "实测拐入_汽油车", "实测拐入_摩托车", "实测拐入_柴油车",
        "车流量-汽油车", "车流量-柴油车", "车辆拐入率-汽油车", "车辆拐入率-柴油车",
        "单车加油量_汽油", "单车加油量_柴油", "Actual日销量_汽油", "Actual日销量_柴油",
        "年销量-汽油", "年销量-柴油", "年销量-总销量",
        "ShellY0日销量_汽油", "ShellY0日销量_柴油",
        "Shell Y0-ATP-汽油", "Shell Y0-ATP-柴油", "Shell Y0-ATP-总销量",
        "ShellY4日销量_汽油", "ShellY4日销量_柴油",
        "Shell Y4-ATP-汽油", "Shell Y4-ATP-柴油", "Shell Y4-ATP-总销量",
        ["目标"], "Remark", "状态",
        "国家定价_98", "国家定价_95", "国家定价_92", "国家定价_0",
        "挂牌价格_98", "挂牌价格_95", "挂牌价格_92", "挂牌价格_0",
        "差价_98", "差价_95", "差价_92", "差价_0",
        "促销方案_柴油_买赠", "促销方案_柴油_满减", "促销方案_柴油_积分", "促销方案_柴油_抽奖", "促销方案_柴油_第三方优惠", "促销方案_柴油_其他",
        "促销方案_汽油_买赠", "促销方案_汽油_满减", "促销方案_汽油_积分", "促销方案_汽油_抽奖", "促销方案_汽油_第三方优惠", "促销方案_汽油_其他",
        ["十二五规划"], "规划编号", ["成品油资格"], "经信委编号", ["NTI新建"], ["是否CRT油站"], "B2B销量支持", ["是否VA油站"], "网络策略", "CRT备注"
      ],
      page: 1,
      searchKey: {},
      loading: true,
      timer: null,  //搜索的限流器
      tablelength: 0,
      tableSize: 100,
      cityList: [],
      MAlist: [],
      citySelect: '',
      MaSelect: '',
      currentRow: null,
      saveLayer: null,
      showEdit: false,
      isEditEnd: false,
      selectTd: null,
      saveRow: null,
      editingrow: null,
      historyLoading: false,
      historyData: [],
      historyVisible: false,
      testData: 0,
      showSortIcon: {}
    }
  },
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer
    }),
    tableDataShow() {
      return this.tableData.slice((this.page - 1) * this.tableSize, this.page * this.tableSize)
    },
    sliceList() {
      return this.sortColumns.slice(this.testData, this.testData + 15)
    },
    scrollwidth() {
      return this.sortColumns.length * 120
    }
  },
  methods: {
    topTipList(item) {
      if (item == '路名') {
        return true
      }
    },
    checkdata() {
      if (this.saveLayer == this.currentLayer) {
        this.loading = false;
        return;
      }
      this.saveLayer = this.currentLayer
      this.tableData = [];
      layer.get(this.currentLayer.id, [])
        .then(res => {
          this.loading = false;
          this.tablelength = res.length
          this.resultDate = res;
          res.forEach(data => {
            this.tableData.push(data.properties)
          });
          // this.tableDataShow = this.tableData.slice(this.page-1,100)
        })
        .catch(e => {
          console.log(e)
        })
    },
    //设置固定列的样式
    fixedStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        // 指定列号
        return 'background:#ededed'
      }
    },
    checkType(item) {
      var res = false
      typeof item == 'object' ? res = true : res = false
      return res;
    },
    returnIndex() {
      this.$router.push('/');
    },
    search(val) {
      let searcharr = []
      fields[this.currentLayer.id].forEach(field => {
        for (let key in val) {
          if (key == field.fieldName && val[key] != '') {
            searcharr.push({
              'field': field.fieldName,
              'value': val[key],
              'relation': 'IndexOf',
              'type': field.type
            })
          }
        }
      })
      layer.get(this.currentLayer.id, searcharr)
        .then(res => {
          this.loading = false;
          this.tableData = [];
          res.forEach(data => {
            this.tableData.push(data.properties)
          });
          // this.tableDataShow = this.tableData.slice(this.page,100)
        })
        .catch(e => {
          console.log(e)
        })
    },
    tablePageChange(val) {
      // this.tableDataShow = this.tableData.slice((this.page-1)*100,100)
      this.page = val;
    },
    tableSizeChange(val) {
      this.tableSize = val;
    },
    selectRow(row, oldRow) {
      this.currentRow = row;
    },
    positionInMap() {
      // this.$store.dispatch("setMapCenter", { x, y });
      if (this.currentRow) {
        this.resultDate.forEach(data => {
          if (data.id == this.currentRow.ID) {
            let x = data.geometry.coordinates[0]
            let y = data.geometry.coordinates[1]
            this.$store.dispatch("setMapCenter", { x, y });
            this.$router.push('/');
          }
        })
      }
    },
    editrow(row, column, cell, event) {
      this.showEdit = true;
      this.isEditEnd = false;
      this.selectTd = cell;
      cell.classList.add('EditCell')
      this.editingrow = row;
      setTimeout(() => {
        let input = cell.getElementsByTagName('input')
        input[0].focus()
      }, 200);
    },
    EditEnd() {
      this.showEdit = false;
      this.isEditEnd = true;
      let postdata = {};
      this.resultDate.forEach(data => {
        if (data.id == this.editingrow.ID) {
          postdata = data;
          postdata.geometry = this.editingrow
        }
      })
      layer.update(this.currentLayer.id, postdata)
        .then(res => {

        })
        .catch(e => {

        })
    },
    showHistroy() {
      this.historyVisible = true;
      this.historyLoading = true;
      this.historyData = [];
      getHistory(this.currentRow.ID)
        .then(res => {
          this.historyLoading = false;
          res.forEach(item => {
            this.historyData.push(item.properties)
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    checkDivScroolTop() {
      //获取节点
      var DIVscroll = document.getElementById('DIVscroll');
      var tabelscroll = document.getElementsByClassName('el-table__body-wrapper')[0]
      //绑定事件
      DIVscroll.addEventListener('scroll', () => {
        this.testData = DIVscroll.scrollLeft / 116.5
        tabelscroll.scrollLeft = DIVscroll.scrollLeft % 116.5
      });
    },
    testsort({ column, prop, order }) {
      console.log(order)
      this.showSortIcon[prop] = order;
    }
  },
  mounted() {
    this.checkDivScroolTop();
  },
  watch: {
    searchKey: {
      handler(oldVal, newVal) {
        window.clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.loading = true;
          this.search(newVal)
        }, 700)
      },
      deep: true,
    },
    isEditEnd(val) {
      if (val) {
        this.selectTd.classList.remove('EditCell')
      }
    },
    currentLayer(val) {
      if (val) {
        this.loading = true;
        this.checkdata()
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.currentLayer) {
        vm.loading = true;
        vm.checkdata();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/public.scss";

.layertable {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  user-select: text;
  .title {
    color: #fff;
    background: $theme-color;
    width: 100%;
    padding: 10px;
    display: block;
    .close {
      float: right;
      display: block;
      width: 24px;
      height: 24px;
      color: $deep-font-color;
      text-align: center;
      line-height: 24px;
      margin-right: 20px;
      cursor: pointer;
      &:hover {
        color: $hover-font-color;
      }
    }
  }
  /deep/ .setfont {
    font-size: 12px !important;
    padding: 5px 0;
    .cellInput {
      display: none;
    }
  }
  /deep/ .EditCell {
    .cellInput {
      display: block;
      /deep/ .el-input__inner {
        height: 20px;
        line-height: 20px;
        padding-left: 5px;
        text-align: center;
      }
    }
    .cellLabel {
      display: none;
    }
  }
  .false {
    width: 13px;
    height: 13px;
    display: inline-block;
    background: #fff;
    border: 1px solid #e5e5e5;
  }
  .null {
    width: 13px;
    height: 13px;
    display: inline-block;
    background: #fff;
    border: 1px solid #e5e5e5;
    padding: 0;
    position: relative;
    &::after {
      content: "";
      width: 9px;
      height: 9px;
      position: absolute;
      background: #000;
      top: 2px;
      left: 2px;
    }
  }
  .icon-xuanzhong {
    font-size: 15px;
    font-weight: 500;
  }
  .headIcon {
    width: 100%;
    box-sizing: border-box;
    padding-top: 2px;
    height: 20px;
    line-height: 20px;
    // margin-top: 5px;
  }
  /deep/ .table_head {
    padding: 0;
    /deep/ .cell {
      padding: 0;
    }
  }
  /deep/ .headcell {
    padding: 0;
    border-right: 1px solid #e5e5e5 !important;
    border-bottom: 1px solid #e5e5e5 !important;
    height: 60px !important;
    .pltableDragIconHover {
      display: none;
      i {
        height: 100%;
        top: 0;
      }
      &:hover {
        background: #f7f7f7;
      }
    }
    .cell {
      padding: 0;
    }
    .headLabel {
      width: 100%;
      height: 55px;
      line-height: 20px;
      padding: 2px 0;
      background: #f4f4f4;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      span {
        background: #f4f4f4;
        display: block;
        padding: 0 5px 5px;
        text-overflow: ellipsis;
        width: 100%;
        border-bottom: 1px solid #e5e5e5;
      }
      .headIcon {
        margin-top: 5px;
      }
      .sorticon {
        position: absolute;
        top: 5px;
        right: 5px;
      }
    }
    .headInput {
      line-height: 20px;
      height: 21px;
      margin-top: 5px;
      /deep/ .el-input__inner {
        line-height: 20px;
        height: 20px;
        padding-left: 5px;
      }
    }
  }
  /deep/ .el-table__body-wrapper {
    overflow-x: hidden;
  }
  /deep/ .el-table__fixed {
    box-shadow: none;
  }
  /deep/ tr.el-table__row--striped td {
    background-color: #ededed;
  }
  //选中一行样式
  /deep/ .el-table .el-table__body tr.current-row > td {
    background: #1faeff !important;
    color: #fff;
  }
  /deep/ .el-table__body tr.hover > td {
    background-color: #dedede !important;
  }
  /deep/ .el-table__body tr.hover-row > td {
    background-color: #dedede !important;
  }
  // 表框颜色
  /deep/ .el-table td,
  /deep/ .el-table th.is-leaf,
  /deep/ .el-table--border,
  /deep/ .el-table--group {
    border-color: #e5e5e5;
  }
  /deep/ .el-table--border::after,
  /deep/ .el-table--group::after,
  /deep/ .el-table::before {
    background-color: #e5e5e5;
  }
  .scrollbox1321 {
    width: 100%;
    height: 10px;
    overflow-x: auto;
    &::-webkit-scrollbar-thumb {
      background-color: #c7c9cc;
      border-radius: 20px;
    }
  }
  .bootom {
    .contorlBtn {
      float: left;
      padding-top: 3px;
      .bemselect {
        width: 150px;
        margin-left: 10px;
      }
      .iconbtn {
        display: inline-block;
        width: 27px;
        height: 27px;
        line-height: 25px;
        text-align: center;
        background: #ededed;
        margin-left: 10px;
        border: 1px solid #ccc;
        padding: 0;
        &:hover {
          border-color: #000;
        }
      }
    }
    .btmright {
      float: right;
      margin-right: 20px;
    }
  }
}
</style>