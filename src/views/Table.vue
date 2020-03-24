<template>
  <div class="layertable">
    <div class="title">
      {{ getTableTitle }}
      <i
        class="close el-icon-close"
        :class="{ 'icon-btn-disabled': saving }"
        @click="returnIndex"
        @mouseover="showTitleTip = true"
        @mouseout="showTitleTip = false"
      ></i>
      <!-- <i  FIXME: 保存table
        class="close icon-save iconfont save"
        style="font-size: 12px; margin-right:2px;"
        :class="{ 'icon-btn-disabled': saving || loading }"
        @click="saveTable(occupyTableId? occupyTableId : currentLayer.id)"
        @mouseover="showTitleTip = true"
        @mouseout="showTitleTip = false"
      ></i>
      <span class="title-tip" v-show="showTitleTip || saving">
        <i v-show="saving" class="el-icon-loading"></i>
        {{titleTip}}
      </span>-->
      <div class="tab-wrap" v-if="optionsSelected != undefined">
        <el-button-group>
          <el-button
            v-for="(item, index) in tableOptions"
            :disabled="loading"
            :key="index"
            size="mini"
            plain
            type="primary"
            :class="{active: optionsSelected === item, 'icon-btn-disabled': loading}"
            class="px-btn"
            ref="pxBtn"
            @click="changeTableByOption(item)"
          >{{item}}</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="tablebox" v-loading="loading">
      <pl-table
        :datas="tableDataShow"
        ref="plTable"
        header-drag-style
        stripe
        :height-change="false"
        :pagination-show="false"
        border
        use-virtual
        cell-class-name="setfont"
        :row-height="25"
        @cell-dblclick="editrow"
        header-cell-class-name="headcell"
        thtd-beyond-hiding
        @cell-click="editForSearchKey"
        @row-click="clickRow"
      >
        <!--show-overflow-tooltip属性代表超出则内容部分给出提示框-->
        <template v-for="item in fixColumn">
          <pl-table-column
            :key="item"
            :prop="item"
            :label="item"
            fixed="left"
            :sortable="true"
            min-width="100"
            align="center"
            :resizable="true"
            :show-overflow-tooltip="topTipList(item)"
            :formatter="myFormatter"
          >
            <template slot="header" slot-scope="scope">
              <div class="headLabel" :style="{ height: (headneedInput ?  '55px' :'18px') }">
                <span
                  @click.stop="testsort(scope.column, scope.column.label, scope.column.order)"
                >{{scope.column.label}}</span>
                <i
                  class="iconfont icon-arrow-up sorticon"
                  v-if="showSortIcon[scope.column.label] == 'ascending'"
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                ></i>
                <i
                  class="iconfont icon-arrow-lower sorticon"
                  v-if="showSortIcon[scope.column.label] == 'descending'"
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                ></i>
                <div @click.stop="() => {}" style="padding: 0;">
                  <el-input
                    v-model="searchKey[scope.column.label]"
                    class="headInput"
                    @input.native="changeSearchKeyForInput"
                    @keyup.enter.native="changeSearchKey"
                    v-if="headneedInput"
                  ></el-input>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div
                class="cellLabel"
                :class="{'bad-row': isBadRow(scope.row, item === fixColumn[0]) }"
              >{{scope.row[item]}}</div>
              <el-input
                size="mini"
                v-model="scope.row[item]"
                class="cellInput"
                @change="EditEnd(scope.row)"
                @keyup.enter.native="EditCancel"
                v-if="showEdit"
              />
              <!-- @keyup.enter.native="EditEnd(scope.row)"-->
            </template>
          </pl-table-column>
        </template>
        <template v-for="(item,index) in sliceList">
          <pl-table-column
            v-if="!checkType(item)"
            :key="item"
            :sortable="true"
            :resizable="true"
            :prop="item"
            :label="item"
            align="center"
            min-width="120"
            :show-overflow-tooltip="topTipList(item)"
            :formatter="myFormatter"
          >
            <template slot="header" slot-scope="scope">
              <div class="headLabel" :style="{ height: (headneedInput ?  '55px' :'18px') }">
                <span
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                >{{scope.column.label}}</span>
                <i
                  class="iconfont icon-arrow-up sorticon"
                  v-if="showSortIcon[scope.column.label] == 'ascending'"
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                ></i>
                <i
                  class="iconfont icon-arrow-lower sorticon"
                  v-if="showSortIcon[scope.column.label] == 'descending'"
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                ></i>
                <div @click.stop="() => {}" style="padding: 0;">
                  <el-input
                    v-model="searchKey[scope.column.label]"
                    :name="scope.column.label"
                    class="headInput"
                    v-if="headneedInput"
                    @input.native="changeSearchKeyForInput"
                    @keyup.enter.native="changeSearchKey"
                  ></el-input>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="cellLabel">{{scope.row[item] | fomatter(scope.column.label, getTableId)}}</div>
              <el-input
                ref="input"
                size="mini"
                v-model="scope.row[item]"
                class="cellInput"
                @change="EditEnd(scope.row)"
                @keyup.enter.native="EditCancel"
                v-if="showEdit"
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
            min-width="120"
            :formatter="myFormatter"
          >
            <template slot="header" slot-scope="scope">
              <div class="headLabel" :style="{ height: (headneedInput ?  '55px' :'18px') }">
                <span
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                >{{scope.column.label}}</span>
                <i
                  class="iconfont icon-arrow-up sorticon"
                  v-if="showSortIcon[scope.column.label] == 'ascending'"
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                ></i>
                <i
                  class="iconfont icon-arrow-lower sorticon"
                  v-if="showSortIcon[scope.column.label] == 'descending'"
                  @click="testsort(scope.column, scope.column.label, scope.column.order)"
                ></i>
                <div
                  class="headIcon"
                  @click.stop="editForSearchKey('headSearchKey', scope.column, scope.$index)"
                >
                  <i
                    :class="checkboxClass(searchKey[scope.column.label])"
                    :ref="`headIcon_${scope.column.label}`"
                  ></i>
                </div>
              </div>
            </template>
            <template slot-scope="scope">
              <div class="headIcon">
                <i :class="checkboxClass(scope.row[item])"></i>
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
        <el-tooltip
          class="item"
          effect="dark"
          content="查看/修改位置"
          placement="top"
          v-if="showToolBtn.indexOf('查看/修改位置') >= 0"
        >
          <el-button
            icon="iconfont icon-dingwei"
            class="iconbtn"
            :disabled="saveRow == null"
            @click="posCrtVisble = true"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="删除"
          placement="top"
          v-if="showToolBtn.indexOf('删除') >= 0"
        >
          <el-button
            icon="iconfont icon-delete2"
            class="iconbtn"
            :disabled="isChoiceRow"
            @click="delRow"
            :loading="delling"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="跳转到地图"
          placement="top"
          v-if="showToolBtn.indexOf('跳转到地图') >= 0"
        >
          <el-button
            icon="iconfont icon-earth"
            class="iconbtn"
            :disabled="saveRow == null"
            @click="jumpToMap"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="历史记录"
          placement="top"
          v-if="showToolBtn.indexOf('历史记录') >= 0"
        >
          <el-button
            icon="iconfont icon-lishi"
            class="iconbtn"
            style="color: #000; font-weight: blod;"
            :disabled="isChoiceRow"
            @click="showHistroy"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="导出"
          placement="top"
          v-if="showToolBtn.indexOf('导出') >= 0"
        >
          <!-- <i class="iconbtn iconfont icon-exit-door"></i> -->
          <el-button
            icon="iconfont icon-exit-door"
            class="iconbtn"
            :disabled="exportTableBtnDisabled"
            @click.stop="exportTable"
            :loading="exportting"
          ></el-button>
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
    <pos-control
      v-if="loading===false"
      @updateLngLat="updateTableRowWithLnglat"
      :dialogVisible.sync="posCrtVisble"
      :editPoint="getEditPoint"
      :data="saveRow"
    ></pos-control>
  </div>
</template>
<script>
import { mapState } from "vuex";
import layer from "../data/layer.js";
import { getHistory } from "../data/yz.js";
import fields from "../config/layer/fields.js";
import { getCityAndMATreeObj } from "@/data/division.js";
import { deepCopy } from "../assets/js/utils.js";
import History from "@/components/tableDialog/history.vue";
import posControl from "@/components/tableDialog/posControl";
import tableData from "@/data/table";
import { FromMSJsonString, DateFormat } from "@/utils/date";
import gcoord from "gcoord";
import { propertys, dateFields } from "@/config/layer/fields";

export default {
  filters: {
    fomatter: function(val, label, layerId) {
      if (!val) return "";
      if (typeof val === "string" && val.includes("/Date")) {
        let date = FromMSJsonString(val);
        if (label === "开始时间") return DateFormat(date, "hh:mm:ss");
        else if (label === "日期") return DateFormat(date, "yyyy-MM-dd");
        else {
          const dfs = dateFields[layerId];
          // 日期类型转换
          const date = FromMSJsonString(val);
          if (date) {
            if (dfs[label] == "date") {
              return DateFormat(date, "yyyy-MM-dd");
            } else if (dfs[label] == "time") {
              return DateFormat(date, "hh:mm:ss");
            }
          }
        } // end else
        // FIXME: 不知道为社么写了这句，时间格式就正确了
      }
      return val;
    }
  },
  components: {
    History,
    posControl
  },
  data() {
    return {
      posCrtVisble: false,
      exportting: false,
      delling: false,
      saving: false,
      showTitleTip: false,
      optionsSelected: undefined,
      tableOptions: [],
      /**
       * @desc 用于保存图层有多个表单的集合
       * foces: 在切换图层时初始化
       */
      optionTableCollections: new Map(),
      headneedInput: true,
      optionsSelected: "",
      tableData: [],
      // tableDataShow:[],
      resultDate: [],
      fixColumn: ["油站编号", "站名", "品牌"],
      sortColumns: [
        // "油站编号", "站名", "品牌",
        "日期",
        "开始时间",
        "数车时长",
        "小网络名",
        "经营状况",
        ["短期重开"],
        "区县镇",
        "市场环境",
        "网络类型1",
        "网络类型2",
        "路名",
        "路侧",
        "道路类型",
        "单向双向",
        "车道数量",
        "限速",
        "弯角",
        "近角远角",
        ["辅道内"],
        ["可否穿越"],
        ["隔离带"],
        ["可否调头"],
        "出口长度M",
        "前庭长M",
        "前庭面积",
        "前庭深M",
        "出入口数量",
        ["规则地块"],
        "布局",
        "雨棚长M",
        "雨棚深M",
        "雨棚数量",
        ["便利店"],
        "便利店面积M2",
        ["宿舍"],
        ["换油"],
        "加油机数",
        "加油岛数",
        "加油位数",
        "可视度",
        "可进出度",
        "车流量",
        "商圈",
        "站点优势评分",
        "加油站等级",
        "位置优势评分",
        "实测车流_汽油车",
        "实测车流_摩托车",
        "实测车流_柴油车",
        "实测拐入_汽油车",
        "实测拐入_摩托车",
        "实测拐入_柴油车",
        "车流量-汽油车",
        "车流量-柴油车",
        "车辆拐入率-汽油车",
        "车辆拐入率-柴油车",
        "单车加油量_汽油",
        "单车加油量_柴油",
        "Actual日销量_汽油",
        "Actual日销量_柴油",
        "年销量-汽油",
        "年销量-柴油",
        "年销量-总销量",
        "ShellY0日销量_汽油",
        "ShellY0日销量_柴油",
        "Shell Y0-ATP-汽油",
        "Shell Y0-ATP-柴油",
        "Shell Y0-ATP-总销量",
        "ShellY4日销量_汽油",
        "ShellY4日销量_柴油",
        "Shell Y4-ATP-汽油",
        "Shell Y4-ATP-柴油",
        "Shell Y4-ATP-总销量",
        ["目标"],
        "Remark",
        "状态",
        "国家定价_98",
        "国家定价_95",
        "国家定价_92",
        "国家定价_0",
        "挂牌价格_98",
        "挂牌价格_95",
        "挂牌价格_92",
        "挂牌价格_0",
        "差价_98",
        "差价_95",
        "差价_92",
        "差价_0",
        "促销方案_柴油_买赠",
        "促销方案_柴油_满减",
        "促销方案_柴油_积分",
        "促销方案_柴油_抽奖",
        "促销方案_柴油_第三方优惠",
        "促销方案_柴油_其他",
        "促销方案_汽油_买赠",
        "促销方案_汽油_满减",
        "促销方案_汽油_积分",
        "促销方案_汽油_抽奖",
        "促销方案_汽油_第三方优惠",
        "促销方案_汽油_其他",
        ["十二五规划"],
        "规划编号",
        ["成品油资格"],
        "经信委编号",
        ["NTI新建"],
        ["是否CRT油站"],
        "B2B销量支持",
        ["是否VA油站"],
        "网络策略",
        "CRT备注"
      ],
      originalFileds: [],
      page: 1,
      searchKey: {},
      loading: true,
      timer: null, //搜索的限流器
      tablelength: 0,
      tableSize: 100,
      cityList: [],
      MAlist: [],
      citySelect: "",
      MaSelect: "",
      saveRow: null,
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
    };
  },
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      occupyTableId: state => state.table.occupyTableId,
      filters: state => state.layer.filters,
      globalFilters: state => state.layer.globalFilters,
      base: state => state.layer.base
    }),
    getTableTitle() {
      if (this.currentLayer) {
        return this.getTableName;
      } else {
        return "undefined";
      }
    },
    computOccupyTableId() {
      if (this.occupyTableId) return this.occupyTableId;
      else if (this.getTableId() == null) {
        // 需要缓存， in now
        return this.$ls.get("occupyTableId");
      } else return null;
    },
    getTableName() {
      const id = this.getTableId() || this.computOccupyTableId;
      switch (id) {
        case "traffic":
          return "corridor车流表";
        case "xyyz":
          return "现有油站";
        case "nti":
          return "NTI";
        default: {
          if (this.currentLayer) return this.currentLayer.name;
          else return id;
        }
      }
    },
    getEditPoint() {
      if (this.saveRow) {
        if (this.saveRow.lng_baidu === 0 && this.saveRow.lat_baidu === 0)
          return undefined;
        else return [this.saveRow.lng_baidu, this.saveRow.lat_baidu];
      } else {
        return undefined;
      }
    },
    //修改位置, 删除, 跳转到地图, 历史记录, 导出
    showToolBtn() {
      let id = this.getTableId();
      if (id === "corridor" || id === "traffic") {
        return ["删除"];
      } else if (this.currentLayer && this.currentLayer.id === "ma") {
        return ["导出"];
      } else if (id === "nti" || id === "poi") {
        return ["查看/修改位置", "删除", "跳转到地图", "导出"];
      } else if (id === "gsnti") {
        return [];
      }
      return ["查看/修改位置", "删除", "跳转到地图", "历史记录", "导出"];
    },
    showExportBtn() {
      if (this.currentLayer.id === "ma") {
        return true;
      }
      return false;
    },
    exportTableBtnDisabled() {
      if (this.currentLayer && this.currentLayer.id === "corridor") return true;
      else return false;
      return true;
    },
    titleTip() {
      if (this.saving) return "保存表格中...    ";
      else {
        return "点击保存才可更新数据。";
      }
    },
    headCheckboxClass(prop) {
      let val = this.searchKey[prop];
      if (val == undefined) {
        /**tip: 返回的时 css className */
        return "null";
      } else if (val == true) {
        return "iconfont icon-xuanzhong";
      } else {
        return "false";
      }
    },
    tableDataShow() {
      this.posCrtVisble = false;
      this.tableData = this.tableData || [];
      return this.tableData.slice(
        (this.page - 1) * this.tableSize,
        this.page * this.tableSize
      );
    },
    sliceList() {
      return this.sortColumns.slice(this.testData, this.testData + 16);
    },
    scrollwidth() {
      return this.sortColumns.length * 120;
    },
    isChoiceRow() {
      return this.saveRow == null;
    }
  },
  methods: {
    isBadRow(row, isFirstField) {
      if ("lng_baidu" in row) {
        // 在拥有位置的row 启用该提示
        if (isFirstField) {
          return (
            (row.lng_baidu == 0 ||
              row.lng_baidu == "" ||
              row.lng_baidu == null) &&
            (row.lat_baidu == 0 || row.lat_baidu == "" || row.lat_baidu == null)
          ); // 是错误行并只在首列显示错误className
        }
      }
      return false; // 其余情况
    },
    async delRow() {
      this.$confirm("是否删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.delling = true;
          const res = await tableData
            .delTableForRow(this.getTableId(), [this.saveRow])
            .catch(err => err);
          if (typeof res === "boolean") {
            if ("ID" in this.saveRow) {
              let index = this.tableData.findIndex(
                ({ ID }) => this.saveRow.ID === ID
              );
              index != -1 && this.tableData.splice(index, 1);
            } else {
              let index = this.tableData.indexOf(this.saveRow);
              index != -1 && this.tableData.splice(index, 1);
            }
            this.$message.success({ message: "删除成功!", offset: 60 });
            this.saveRow = null;
          } else {
            this.$message.error({ message: res, offset: 60 });
          }
          this.delling = false;
        })
        .catch(() => {
          this.delling = false;
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    clickRow(row, column, event) {
      if (this.saveRow) {  // 查看是否是取消选中
        if (this.saveRow.ID === row.ID) {
          // this.$refs.plTable.clearSelection();//FIXME: 暂时没多选
          this.saveRow = null;
          return;
        }
      }
      this.saveRow = row;
      /**
       * 如果当前行会无坐标行， 让用户先选择行
       * 自动弹出修改位置组件
       */
      if (this.isBadRow(row, true)) {
        this.posCrtVisble = true;
      }
    },
    /**
     * 必须记住当tableId 不等于currentLayerId的时候，有跳转选中要通过row.ID获取图层和feature信息
     */
    async jumpToMap() {
      if (this.saveRow.lng_baidu && this.saveRow.lat_baidu) {
        const [lng, lat] = gcoord.transform(
          [this.saveRow.lng_baidu, this.saveRow.lat_baidu],
          gcoord.BD09,
          gcoord.EPSG3857
        );
        const res = await this.$store.dispatch("getFeature", {
          layerId: this.getTableId(),
          ID: this.saveRow.ID
        });
        if (res != null) {
          // await this.$store.dispatch('setSelectMode', 'single');
          const layer = this.base.find(item => this.getTableId() === item.id);
          await this.$store.dispatch("selectFeatureAndLayer", {
            feature: res,
            layer: layer
          });
        }
        await this.$store.dispatch("setMapCenter", { x: lng, y: lat });
        await this.$store.dispatch(
          "setMapZoom",
          Math.max(Math.min(15, this.$store.state.mapState.zoom), 5)
        );
      }
      await this.$router.push("/");
    },
    /** val circle undefined true false */
    async editForSearchKey(row, col, cellValue, index) {
      /** 获取当前值 */
      let val;
      if (row === "headSearchKey") {
        // table head 布尔值column 处理
        // 与headSearchKey标记相同
        val = this.searchKey[col["property"]];
      } else {
        if (col.label in this.searchKey) {
          // table body 布尔值column 处理
          let fields = this.fixColumn.concat(this.sortColumns);
          let field = fields.find(item => {
            return item instanceof Array && item[0] === col.label;
          });
          if (!field) return;
          // 跳出函数
          else val = row[col.label];
        }
      }

      /** 获取应得的值 */
      let buff;
      if (val == null) buff = true;
      else if (val === true) buff = false;
      else if (val === false) buff = undefined;
      /**table head and table body 对应处理 */
      if (row === "headSearchKey") {
        // table head
        this.searchKey[col["property"]] = buff;
        this.$refs[`headIcon_${col["property"]}`].forEach(item => {
          item.className = this.checkboxClass(buff);
        });
        await this.refreshTableDataBySearchKey();
      } else if (col.label in this.searchKey) {
        // table body
        row[col.label] = buff;
        await tableData.updateTableForRow(this.getTableId(), row);
      }
    },
    async changeSearchKeyForInput(e) {
      window.clearTimeout(this.timer);
      this.timer = null;
      this.timer = setTimeout(async () => {
        this.searchKey[e.target.name] = e.target.value;
        await this.refreshTableDataBySearchKey();
      }, 700);
    },
    async changeSearchKey(e) {
      window.clearTimeout(this.timer);
      this.timer = null;
      this.searchKey[e.target.name] = e.target.value;
      await this.refreshTableDataBySearchKey();
    },
    checkboxClass(val) {
      if (val == undefined) {
        /**tip: 返回的时 css className */
        return "null";
      } else if (val == true) {
        return "iconfont icon-xuanzhong";
      } else {
        return "false";
      }
    },
    async refreshTableDataBySearchKey() {
      this.loading = true;
      let count = 0,
        formData = new FormData();
      for (let key in this.searchKey) {
        if (this.searchKey[key] == null || this.searchKey == "") continue;
        formData.append(`${key}operator`, "and");
        formData.append(`filtervalue${count}`, this.searchKey[key]);
        if (typeof this.searchKey[key] !== "string") {
          // boolean or undefined
          formData.append(`filtercondition${count}`, "EQUAL");
        } else {
          formData.append(`filtercondition${count}`, "CONTAINS");
        }
        formData.append(`filteroperator${count}`, 1);
        formData.append(`filterdatafield${count}`, key);
        count++;
      } // end for
      formData.append("filterscount", count);
      formData.append("groupscount", 0);
      const res = await tableData
        .getTableDatas(this.getTableId(), [], formData)
        .catch(err => err);
      if ("Error" in res) res = [];
      this.tableData = res;
      this.loading = false;
    },
    myFormatter(row, col, cellValue, index) {
      // if (typeof cellValue === 'string' && cellValue.search("/Date") >= 0) {
      //   let date = FromMSJsonString(cellValue);
      //   if (col.label === '开始时间') return DateFormat(date, 'hh-mm-ss')
      //   if (col.label === '日期') return DateFormat(date, 'yyyy-MM-dd');
      //   return DateFormat(date); // FIXME: 不知道为社么写了这句，时间格式就正确了
      // }
      if (this.optionsSelected === "油品信息") {
        let v = Number.parseFloat(cellValue);
        if (isNaN(v)) return cellValue;
        else {
          if (row["Brand"].indexOf("%") > 0) return v.toFixed(2) + "%";
          else return v.toFixed(0);
        }
      }
    },
    /**
     * 更新table行的lnglat 通过rowId
     * must be have lng_baidu lat_baidu
     * @param {Array<number, number>} lnglat
     * @param {number} rowId
     */
    updateTableRowWithLnglat(lnglat, rowId) {
      const row = this.tableData.find(item => item.ID === rowId);
      if (row) {
        row.lng_baidu = lnglat[0];
        row.lat_baidu = lnglat[1];
      }
    },
    useYZFields() {
      this.sortColumns = [
        // "油站编号", "站名", "品牌",
        "日期",
        "开始时间",
        "数车时长",
        "小网络名",
        "经营状况",
        ["短期重开"],
        "区县镇",
        "市场环境",
        "网络类型1",
        "网络类型2",
        "路名",
        "路侧",
        "道路类型",
        "单向双向",
        "车道数量",
        "限速",
        "弯角",
        "近角远角",
        ["辅道内"],
        ["可否穿越"],
        ["隔离带"],
        ["可否调头"],
        "出口长度M",
        "前庭长M",
        "前庭面积",
        "前庭深M",
        "出入口数量",
        ["规则地块"],
        "布局",
        "雨棚长M",
        "雨棚深M",
        "雨棚数量",
        ["便利店"],
        "便利店面积M2",
        ["宿舍"],
        ["换油"],
        "加油机数",
        "加油岛数",
        "加油位数",
        "可视度",
        "可进出度",
        "车流量",
        "商圈",
        "站点优势评分",
        "加油站等级",
        "位置优势评分",
        "实测车流_汽油车",
        "实测车流_摩托车",
        "实测车流_柴油车",
        "实测拐入_汽油车",
        "实测拐入_摩托车",
        "实测拐入_柴油车",
        "车流量-汽油车",
        "车流量-柴油车",
        "车辆拐入率-汽油车",
        "车辆拐入率-柴油车",
        "单车加油量_汽油",
        "单车加油量_柴油",
        "Actual日销量_汽油",
        "Actual日销量_柴油",
        "年销量-汽油",
        "年销量-柴油",
        "年销量-总销量",
        "ShellY0日销量_汽油",
        "ShellY0日销量_柴油",
        "Shell Y0-ATP-汽油",
        "Shell Y0-ATP-柴油",
        "Shell Y0-ATP-总销量",
        "ShellY4日销量_汽油",
        "ShellY4日销量_柴油",
        "Shell Y4-ATP-汽油",
        "Shell Y4-ATP-柴油",
        "Shell Y4-ATP-总销量",
        ["目标"],
        "Remark",
        "状态",
        "国家定价_98",
        "国家定价_95",
        "国家定价_92",
        "国家定价_0",
        "挂牌价格_98",
        "挂牌价格_95",
        "挂牌价格_92",
        "挂牌价格_0",
        "差价_98",
        "差价_95",
        "差价_92",
        "差价_0",
        "促销方案_柴油_买赠",
        "促销方案_柴油_满减",
        "促销方案_柴油_积分",
        "促销方案_柴油_抽奖",
        "促销方案_柴油_第三方优惠",
        "促销方案_柴油_其他",
        "促销方案_汽油_买赠",
        "促销方案_汽油_满减",
        "促销方案_汽油_积分",
        "促销方案_汽油_抽奖",
        "促销方案_汽油_第三方优惠",
        "促销方案_汽油_其他",
        ["十二五规划"],
        "规划编号",
        ["成品油资格"],
        "经信委编号",
        ["NTI新建"],
        ["是否CRT油站"],
        "B2B销量支持",
        ["是否VA油站"],
        "网络策略",
        "CRT备注"
      ];
      this.fixColumn = ["油站编号", "站名", "品牌"];
      this.sortColumns.forEach(field => {
        if (field instanceof Array) {
          this.searchKey[field] = null;
        }
      });
    },
    topTipList(item) {
      if (item == "路名") {
        return true;
      }
    },
    async exportTable() {
      this.exportting = true;
      let result = null;
      if (this.currentLayer.id === "ma") {
        let exportDatas = [];
        let fields = this.fixColumn
          .concat(this.sortColumns)
          .map(item =>
            item != "MA" ? { f: item, d: item } : { f: "Maid", d: "MA" }
          )
          .filter(item => item.d != " ");

        this.$refs.plTable.datas.forEach(row => {
          let exportRow = fields.map(field => {
            return row[field["d"]];
          });
          exportDatas.push(exportRow);
        });

        result = await tableData.exportTable(this.optionsSelected, {
          column: fields,
          data: exportDatas
        });
      } else {
        let layerid = this.getTableId();
        let filter;
        filter = [...this.globalFilters];
        if (this.filters[layerid] != null) {
          filter.push(this.filters[layerid]);
        }
        result = await tableData.exportTable(layerid, { querys: filter });
      } // end else
      window.open(result.path);
      this.exportting = false;
    },
    /**
     * 保存表格数据 - 保存方式一行一行提交数据
     * @param {string} id 表格id
     */
    async saveTable(id) {
      if (this.saving === false && this.loading === false) {
        this.saving = true;
        const tasks = this.tableData.map(row => {
          return new Promise((resolve, reject) => {
            this.$store
              .dispatch("updateLayerFeature", {
                layerid: id,
                feature: { id: row.ID, properties: row }
              })
              .then(res => {
                resolve(res);
              })
              .catch(err => resolve(err));
          });
        });
        await Promise.all(tasks).catch(err => console.log(err));
        this.saving = false;
        await this.returnIndex();
      } else {
        // no doing
      }
    },
    async changeTableByOption(optionName) {
      await this.getAllDataByOption(optionName, this.currentLayer.id);
    },
    /**
     * 获取显示table完整数据的方法
     * 所有table有option选项的都是通过这个函数获取数据
     * @param {String} optionName 选项名称
     * @param {number} id 图层id
     */
    async getAllDataByOption(optionName, id) {
      this.optionsSelected = optionName;
      switch (id) {
        case "ma":
          await this.getMADataByOption(optionName); // MA自己的数据获取函数
          break;
        default:
          return;
      }
    },
    /**
     * 获取MA图层table显示所需要的数据 (创建与获取)
     * 不需要headerInput 通过 this.headneedInput = false; 实现
     * @param {String} optionName
     */
    async getMADataByOption(optionName) {
      this.fixColumn = [];
      this.headneedInput = false;
      switch (optionName) {
        case "RANKING":
          {
            if (this.optionTableCollections.has("RANKING")) {
              const {
                fixColumn,
                tableData,
                sortColumns,
                originalFileds
              } = this.optionTableCollections.get("RANKING");
              this.tablelength = tableData.length;
              this.tableData = tableData;
              this.fixColumn = fixColumn;
              this.sortColumns = sortColumns;
              this.originalFileds = originalFileds;
            } else {
              // 如果集合中没有，则创建
              this.loading = true;
              const keyValues = await tableData.getKeyValues();
              let fields = await tableData.getRankingFields();
              this.originalFileds = fields;
              const res = await tableData.getRankingDatas();
              this.tablelength = res.count;
              fields = fields
                .map(item => item.FieldName)
                .filter(item => {
                  return (
                    item != "年份" &&
                    item != "市场区域" &&
                    item != "ID" &&
                    item != "Maid" &&
                    item != "ShellATP" &&
                    item != "INDSites"
                  );
                });
              fields.splice(12, 0, "INDSites");
              fields.push("MA");
              fields.push("ShellATP");
              res.list.forEach(item => {
                keyValues.find(kv => {
                  if (kv["ID"] === item["Maid"]) item["MA"] = kv["名称"];
                });
              });
              this.sortColumns = fields;
              this.tableData = res.list;
              this.fixColumn = ["年份", "市场区域"];
              this.optionTableCollections.set("RANKING", {
                fixColumn: this.fixColumn,
                tableData: this.tableData,
                sortColumns: this.sortColumns,
                originalFileds: this.originalFileds
              });
              this.loading = false;
            }
          }
          break;
        case "油品信息":
          {
            if (this.optionTableCollections.has("油品信息")) {
              const {
                sortColumns,
                tableData,
                originalFileds
              } = this.optionTableCollections.get("油品信息");
              this.tablelength = tableData.length;
              this.tableData = tableData;
              this.sortColumns = sortColumns;
              this.originalFileds = originalFileds;
            } else {
              this.loading = true;
              this.sortColumns = [
                "MA名称",
                "Brand",
                "SP",
                "PC",
                "BPPC",
                "IND",
                "CNOOC",
                "SC",
                "Caltex",
                "YC Shell",
                "total"
              ];
              this.originalFileds = this.sortColumns;
              const res = await tableData.getYpDatas();
              this.tablelength = res.count;
              res.list.forEach(item => {
                item["MA名称"] = item["MaName"];
                item["YC Shell"] = item["Shell"];
                for (let k in item) {
                  item[k] = this.myFormatter(item, null, item[k], null);
                }
              });
              this.tableData = res.list;
              this.optionTableCollections.set("油品信息", {
                sortColumns: this.sortColumns,
                tableData: this.tableData,
                originalFileds: this.originalFileds
              });
              this.loading = false;
            }
          }
          break;
        case "经济数据":
          {
            if (this.optionTableCollections.has("经济数据")) {
              const {
                fixColumn,
                sortColumns,
                tableData,
                originalFileds
              } = this.optionTableCollections.get("经济数据");
              this.tablelength = tableData.length;
              this.tableData = tableData;
              this.fixColumn = fixColumn;
              this.sortColumns = sortColumns;
              this.originalFileds = originalFileds;
            } else {
              this.loading = true;
              const keyValues = await tableData.getKeyValues();
              let fields = await tableData.getJjListFields();
              this.originalFileds = fields;
              const res = await tableData.getJjListDatas();
              this.tablelength = res.count;
              fields = fields
                .map(item => item.FieldName)
                .filter(item => item != "Maid");
              res.list.forEach(item => {
                keyValues.find(kv => {
                  if (kv["ID"] === item["Maid"]) item["MA"] = kv["名称"];
                });
              });
              this.sortColumns = fields;
              this.tableData = res.list;
              this.fixColumn = ["MA"];
              this.optionTableCollections.set("经济数据", {
                fixColumn: this.fixColumn,
                sortColumns: this.sortColumns,
                tableData: this.tableData,
                originalFileds: this.originalFileds
              });
              this.loading = false;
            }
          }
          break;
        default: {
        }
      }
    },
    /**
     * 获取数据当图层id改变时
     * focus: 所有不通过getAllDataByOption都需要执行这个this.optionsSelected = undefined;
     * 重置searchKey
     * @param {number} id 图层id
     */
    async getDatasById(id) {
      this.searchKey = {}; // 重置searchKey
      /** 防止长期转圈 */
      switch (id) {
        case "ma":
          {
            // 设置ma table-option
            this.tableOptions = ["RANKING", "油品信息", "经济数据"];
            await this.getAllDataByOption("RANKING", id);
          }
          break;
        case "gsnti":
        case "nti":
          {
            this.loading = true;
            this.optionsSelected = undefined;
            if (this.optionTableCollections.has(id)) {
              this.headneedInput = true;
              const {
                resultDate,
                tableData,
                tablelength,
                sortColumns,
                fixColumn,
                searchKey,
                originalFileds
              } = this.optionTableCollections.get(id);
              this.sortColumns = sortColumns;
              this.fixColumn = fixColumn;
              this.resultDate = resultDate;
              this.tableData = tableData;
              this.tablelength = tablelength;
              this.searchKey = searchKey;
              this.originalFileds = originalFileds;
              this.loading = false;
            } else {
              let fields = await tableData.getFields(id).catch(e => {
                console.log(e);
              });
              this.originalFileds = fields;
              fields = fields.map(item => {
                if (item.Type.indexOf("[System.Boolean]") > -1) {
                  this.searchKey[item.FieldName] = null;
                  return { ...item, FieldName: [item.FieldName] };
                } else return item;
              });
              this.sortColumns = fields
                .map(item => item.FieldName)
                .filter(
                  item =>
                    item != "ID" &&
                    item != "NTI自编号" &&
                    item != "十二五规划序号" &&
                    item != "lat_baidu" &&
                    item != "lng_baidu"
                );
              this.sortColumns.splice(
                this.sortColumns.indexOf("十三五规划序号"),
                1
              );
              this.fixColumn = ["NTI自编号"];

              let res = await layer.get(id, []).catch(e => {
                console.log(e);
              });
              this.headneedInput = true;
              this.tablelength = res.length;
              this.resultDate = res;
              res.forEach(data => {
                this.tableData.push(data.properties);
              });
              this.optionTableCollections.set(`${id}`, {
                resultDate: this.resultDate,
                tableData: this.tableData,
                tablelength: this.tablelength,
                sortColumns: this.sortColumns,
                fixColumn: this.fixColumn,
                searchKey: this.searchKey,
                originalFileds: this.originalFileds
              });
              this.loading = false;
            }
          }
          break;
        case "corridor":
          {
            this.loading = true;
            this.optionsSelected = undefined;
            let useId =
              this.computOccupyTableId != null
                ? `${this.computOccupyTableId}`
                : `${id}`;
            if (this.optionTableCollections.has(useId)) {
              const {
                resultDate,
                tableData,
                tablelength,
                sortColumns,
                searchKey,
                originalFileds
              } = this.optionTableCollections.get(useId);
              this.resultDate = resultDate;
              this.tableData = tableData;
              this.tablelength = tablelength;
              this.sortColumns = sortColumns;
              this.searchKey = searchKey;
              this.originalFileds = originalFileds;
              this.loading = false;
            } else {
              // 第一次的话需要加载的数据
              if (this.computOccupyTableId != null) {
                // 占用方式
                if (this.currentLayer.id === "corridor") {
                  let fields = await tableData
                    .getCorridorTrafficFields()
                    .catch(e => {
                      console.log("fields", e);
                    });
                  this.originalFileds = fields;
                  fields = fields.map(item => {
                    if (item.Type.indexOf("[System.Boolean]") > -1) {
                      this.searchKey[item.FieldName] = null;
                      return { ...item, FieldName: [item.FieldName] };
                    } else return item;
                  });
                  this.sortColumns = fields
                    .map(item => item.FieldName)
                    .filter(
                      item =>
                        item != "Corridor编号" &&
                        item != "总车流" &&
                        item != "ID"
                    );
                  this.sortColumns.splice(0, 0, "Corridor编号");
                  this.sortColumns.push("总车流");
                  this.fixColumn = [];
                }
                // end 占用方式
              } else {
                // 正常获取字段
                let fields = await tableData.getFields(useId).catch(e => {
                  console.log("fields", e);
                });
                this.originalFileds = fields;
                fields = fields.map(item => {
                  if (item.Type.indexOf("[System.Boolean]") > -1) {
                    this.searchKey[item.FieldName] = null;
                    return { ...item, FieldName: [item.FieldName] };
                  } else return item;
                });
                this.sortColumns = fields
                  .map(item => item.FieldName)
                  .filter(
                    item =>
                      item != "lat_baidu" && item != "lng_baidu" && item != "ID"
                  );
                this.fixColumn = [];
              } // 字段完成
              // 以下获取数据
              if (this.computOccupyTableId != null) {
                // 占用方式
                let res = await tableData.getCorridorTrafficDatas();
                this.headneedInput = true;
                this.tablelength = res.length;
                this.resultDate = res;
                this.tableData = res;
                this.optionTableCollections.set(`${this.computOccupyTableId}`, {
                  resultDate: this.resultDate,
                  tableData: this.tableData,
                  tablelength: this.tablelength,
                  sortColumns: this.sortColumns,
                  searchKey: this.searchKey,
                  originalFileds: this.originalFileds
                });
                this.loading = false;
                return; // focus: 返回函数了
              } else {
                let res = await layer.get(useId, []);
                if (res) {
                  this.headneedInput = true;
                  this.tablelength = res.length;
                  this.resultDate = res;
                  res.forEach(data => {
                    this.tableData.push(data.properties);
                  });
                  this.optionTableCollections.set(`${this.currentLayer.id}`, {
                    searchKey: this.searchKey,
                    resultDate: this.resultDate,
                    tableData: this.tableData,
                    tablelength: this.tablelength,
                    sortColumns: this.sortColumns,
                    searchKey: this.searchKey,
                    originalFileds: this.originalFileds
                  });
                  this.loading = false;
                }
              }
            }
          }
          break;
        case "target":
          {
            console.log(this.computOccupyTableId);
            this.loading = true;
            this.optionsSelected = undefined;
            if (this.optionTableCollections.has(this.computOccupyTableId)) {
              const {
                resultDate,
                tableData,
                tablelength,
                sortColumns,
                originalFileds,
                searchKey
              } = this.optionTableCollections.get(this.computOccupyTableId);
              this.resultDate = resultDate;
              this.tableData = tableData;
              this.tablelength = tablelength;
              this.sortColumns = sortColumns;
              this.originalFileds = originalFileds;
              this.searchKey = searchKey;
              this.loading = false;
            } else {
              if (this.computOccupyTableId != null) {
                this.loading = true;
                await this.getDatasById(this.computOccupyTableId);
                this.loading = false;
              }
            }
          }
          break;
        default:
          // yz | poi
          {
            this.loading = true;
            // 其他都是layer 使用表格
            if (id === "poi") {
              let fields = await tableData
                .getFields(this.currentLayer.id)
                .catch(e => {
                  console.log("fields", e);
                });
              this.originalFileds = fields;
              fields = fields.map(item => {
                if (item.Type.indexOf("[System.Boolean]") > -1) {
                  this.searchKey[item.FieldName] = null;
                  return { ...item, FieldName: [item.FieldName] };
                } else return item;
              });
              this.sortColumns = fields
                .map(item => item.FieldName)
                .filter(
                  item =>
                    item != "lat_baidu" && item != "lng_baidu" && item != "ID"
                );
              this.fixColumn = [];
            } else {
              this.useYZFields();
              this.originalFileds = await tableData
                .getFields(id)
                .then(data => data.map(item => item.fieldName));
            }
            /** 第二步： 获取table Datas */
            this.optionsSelected = undefined;
            // 两种可能的打开方式（存在占用的 | layer使用的
            if (this.optionTableCollections.has(`${id}`)) {
              this.headneedInput = true;
              if (this.computOccupyTableId != null) {
                // 占用方式
                const {
                  resultDate,
                  tableData,
                  tablelength,
                  searchKey,
                  originalFileds,
                  sortColumns,
                  fixColumn
                } = this.optionTableCollections.get(
                  `${this.computOccupyTableId}`
                );
                this.resultDate = resultDate;
                this.tableData = tableData;
                this.tablelength = tablelength;
                this.searchKey = searchKey;
                this.originalFileds = originalFileds;
                this.sortColumns = sortColumns;
                this.fixColumn = fixColumn;
              } else {
                // 正常方式（layer's）
                const {
                  resultDate,
                  tableData,
                  tablelength,
                  searchKey,
                  originalFileds,
                  sortColumns,
                  fixColumn
                } = this.optionTableCollections.get(`${id}`);
                this.resultDate = resultDate;
                this.tableData = tableData;
                this.tablelength = tablelength;
                this.searchKey = searchKey;
                this.originalFileds = originalFileds;
                this.sortColumns = sortColumns;
                this.fixColumn = fixColumn;
                this.loading = false;
              }
            } else {
              // 首次加载数据通过接口
              let res = await layer.get(id, []);
              if (res) {
                this.headneedInput = true;
                this.tablelength = res.length;
                this.resultDate = res;
                res.forEach(data => {
                  this.tableData.push(data.properties);
                });

                this.optionTableCollections.set(`${id}`, {
                  resultDate: this.resultDate,
                  tableData: this.tableData,
                  tablelength: this.tablelength,
                  searchKey: this.searchKey,
                  originalFileds: this.originalFileds,
                  sortColumns: this.sortColumns,
                  fixColumn: this.fixColumn
                });
                this.loading = false;
              }
            }
          }
          break;
      }
    },
    async checkdata() {
      if (this.saveLayer == this.currentLayer) {
        this.loading = false;
        // return;
      }
      this.saveLayer = this.currentLayer;
      this.tableData = [];
      this.loading = false;
      await this.getDatasById(this.currentLayer.id).catch(err => {
        this.loading = false;
      });
      this.loading = false;
    },
    //设置固定列的样式
    fixedStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        // 指定列号
        return "background:#ededed";
      }
    },
    checkType(item) {
      var res = false;
      typeof item == "object" ? (res = true) : (res = false);
      return res;
    },
    returnIndex() {
      if (this.saving === false) this.$router.push("/");
    },
    search(val) {
      let searcharr = [];
      fields[this.currentLayer.id].forEach(field => {
        for (let key in val) {
          if (key == field.fieldName && val[key] != "") {
            searcharr.push({
              field: field.fieldName,
              value: val[key],
              relation: "IndexOf",
              type: field.type
            });
          }
        }
      });
      layer
        .get(this.currentLayer.id, searcharr)
        .then(res => {
          this.loading = false;
          this.tableData = [];
          res.forEach(data => {
            this.tableData.push(data.properties);
          });
          // this.tableDataShow = this.tableData.slice(this.page,100)
        })
        .catch(e => {
          console.log(e);
        });
    },
    tablePageChange(val) {
      // this.tableDataShow = this.tableData.slice((this.page-1)*100,100)
      this.page = val;
    },
    tableSizeChange(val) {
      this.tableSize = val;
    },
    getTableId() {
      let layerId, id;
      if (this.currentLayer) {
        if (this.currentLayer.id === "ma") {
          layerId = this.optionsSelected;
        } else if (
          this.currentLayer.id === "target" ||
          (this.occupyTableId != null && this.currentLayer.id === "corridor")
        ) {
          layerId = this.occupyTableId;
        } else {
          layerId = this.currentLayer.id;
        }
      }
      return layerId;
    },
    positionInMap() {
      // this.$store.dispatch("setMapCenter", { x, y });
      if (this.saveRow) {
        this.resultDate.forEach(data => {
          if (data.id == this.saveRow.ID) {
            let x = data.geometry.coordinates[0];
            let y = data.geometry.coordinates[1];
            this.$store.dispatch("setMapCenter", { x, y });
            this.$router.push("/");
          }
        });
      }
    },
    /**
     * 一些字段不需要编辑功能
     * 包含：'MA的油品信息'
     */
    editrow(row, column, cell, event) {
      this.selectTd && this.selectTd.classList.remove("EditCell");
      if (this.optionsSelected != "油品信息") {
        this.showEdit = true;
        this.isEditEnd = false;
        this.selectTd = cell;
        cell.classList.add("EditCell");
        this.editingrow = row;
        setTimeout(() => {
          let input = cell.getElementsByTagName("input");
          input[0].focus();
        }, 200);
      }
    },
    async EditCancel() {
      this.showEdit = false;
      this.isEditEnd = true;
    },
    async EditEnd(row) {
      this.showEdit = false;
      this.isEditEnd = true;
      // let postdata = {};
      // this.resultDate.forEach(data => {
      //   if (data.id == this.editingrow.ID) {
      //     postdata = data;
      //     postdata.geometry = this.editingrow;
      //   }
      // });
      let model = {};
      this.originalFileds.forEach(item => {
        model[item.FieldName] = row[item.FieldName];
      });
      model["uid"] = row["ID"];
      let layerId = this.getTableId();
      let id = row["ID"];
      tableData
        .updateTableForRow(layerId, id, model)
        .then(res => {})
        .catch(e => {});
    },
    showHistroy() {
      this.historyVisible = true;
      this.historyLoading = true;
      this.historyData = [];
      getHistory(this.saveRow.ID)
        .then(res => {
          this.historyLoading = false;
          res.forEach(item => {
            this.historyData.push(item.properties);
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkDivScroolTop() {
      //获取节点
      var DIVscroll = document.getElementById("DIVscroll");
      var tabelscroll = document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0];
      //绑定事件
      DIVscroll &&
        DIVscroll.addEventListener("scroll", () => {
          this.testData = DIVscroll.scrollLeft / 116.5;
          tabelscroll.scrollLeft = DIVscroll.scrollLeft % 116.5;
        });
    },
    // 队列: '' ascending descending
    testsort(column, prop, lastOrder) {
      if (lastOrder === "" || lastOrder == null) {
        this.showSortIcon[prop] = "ascending";
      } else if (lastOrder === "ascending") {
        this.showSortIcon[prop] = "descending";
      } else {
        this.showSortIcon[prop] = "";
      }
      if (this.fixColumn.indexOf(prop) >= 0) {
        // FIXME: 固定列要手动排序
        column.order = this.showSortIcon[prop];
        this.showSortIcon[prop] === ""
          ? this.$refs.plTable.clearSort()
          : this.$refs.plTable.sort(prop, this.showSortIcon[prop]);
      }
    },

    refreshMap() {
      if (this.optionTableCollections.has(this.getTableId())) {
        let tableCollection = this.optionTableCollections.get(
          this.getTableId()
        );
        this.optionTableCollections.set(this.getTableId(), {
          ...tableCollection,
          tableData: this.tableData,
          searchKey: this.searchKey
        });
      } else {
        // throw new Error("未加载该id表格，就获取存储的Datas");
        // no doing something
        // 加载了这函数才实际操作
      }
    }
  },
  async deactivated() {
    this.posCrtVisble = false;
    this.saveRow = null;
    this.refreshMap();
    this.searchKey = {};
    this.sortColumns = [];
    this.fixColumn = [];
    this.tableData = [];
    await this.$store.dispatch("cancelOccupyInTable");
  },
  mounted() {
    this.checkDivScroolTop();
  },
  watch: {
    isEditEnd(val) {
      if (val) {
        this.selectTd.classList.remove("EditCell");
      }
    },
    currentLayer(val) {
      if (val) {
        this.checkdata();
      }
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.currentLayer) {
        vm.fixColumn = [];
        vm.checkdata();
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/public.scss";
.bad-row {
  color: red !important;
}
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

    .title-tip {
      float: right;
      display: inline;
      color: #ebeef5;
      text-align: left;
      font-size: 12px;
      line-height: 22px;
    }
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
    .icon-btn-disabled {
      color: #999 !important;
      &:hover {
        cursor: not-allowed;
      }
    }
    .tab-wrap {
      margin-top: 1px;
      background: #fff;
      margin-left: -10px;
      margin-bottom: -9px;
      .px-btn {
        padding: 2 5px;
        color: #303133;
        background: #fff;
        border-color: #dcdfe6;
        border: 0px;
        &:hover {
          color: #fff;
          background: #303133;
        }
      }
      .icon-btn-disabled {
        color: #999 !important;
        &:link,
        &:visited,
        &:hover,
        &:active,
        &:focus {
          cursor: not-allowed;
          background-color: #fff;
        }
      }
      .active {
        color: #fff;
        background: #303133 !important;
      }
    }
  }
  .tablebox {
    width: 100%;
    height: calc(100% - 107px);
    overflow: hidden;
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
    // height: 60px !important;
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
      // height: 55px;
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