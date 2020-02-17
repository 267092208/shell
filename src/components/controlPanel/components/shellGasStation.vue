<template>
  <div class="ctl-panel-container">
    <el-container class="ctl-wrap">
      <el-main class="ctl-wrap-content">
        <!-- <el-tabs v-model="title" type="border-card"> -->
        <div :label="`${title}操作`" :name="`${title}`" class="tab-content" ref="tabContent">
          <el-scrollbar style=" height: 125px; width: 100%;">
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="openAddLayer"
                >
                  <div class="icon-title">添加</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-tianjia icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="importLayerCtrlVisible = true"
                >
                  <div class="icon-title">导入</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-daoru-tianchong icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native.stop="delChoiceLayer"
                >
                  <div class="icon-title">删除</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-delete2 icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">图层操作</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex" class="labelTable">
                <el-col
                  v-for="(item,index) in statusList.slice(0, 7)"
                  :key="index"
                  class="label-btn-wrap"
                >
                  <div class="statusLabel">{{item.name}}</div>
                  <el-switch
                    class="statusSW"
                    v-model="item.visible"
                    active-color="#13ce66"
                    @change="changeStatus(item.name, item.visible, 'shellyz')"
                  ></el-switch>
                </el-col>
                <el-col class="label-btn-wrap">
                  <el-dropdown class="label-dropdown">
                    <span class="el-dropdown-link">
                      缩放: {{scale}}%
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item, index) in scaleList"
                        :key="index"
                        @click.native="choiceScale(item, 'shellyz')"
                      >缩放: {{item}}%</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col
                  class="label-btn-wrap"
                  v-for="(item,index) in statusList.slice(7)"
                  :key="index + 7"
                >
                  <div style="float: left; width: 62px; line-height: 20px;">{{item.name}}</div>
                  <el-switch
                    style="float: left;"
                    v-model="item.visible"
                    active-color="#13ce66"
                    @change="changeStatus(item.name, item.visible)"
                  ></el-switch>
                </el-col>
              </el-row>
              <el-footer height="20px" class="grounp-footer">状态</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-tooltip placement="top" :disabled="!disabledMulSiteCompare">
                  <div slot="content">
                    请按住ctrl选中地图上多个油站，
                    <br />再点击展示油站对比信息。
                  </div>
                  <el-row
                    type="flex"
                    justify="center"
                    align="center"
                    class="icon-btn"
                    @click.native="openMSCompareDialog()"
                    :class="{ 'icon-btn-disabled': disabledMulSiteCompare }"
                  >
                    <div class="icon-title">多站对比</div>
                    <!-- <el-badge :value="selectFeatures.length" :max="99" type="primary" class="badge"> -->
                    <el-avatar
                      shape="square"
                      :size="50"
                      fit="fill"
                      class="iconfont icon-liangliangduibi icon"
                    ></el-avatar>
                    <!-- </el-badge> -->
                  </el-row>
                </el-tooltip>
                <el-tooltip placement="top" :disabled="!disabledHistoryChart">
                  <div slot="content">
                    请单选或多选(ctrl)中站点，
                    <br />再点击显示销售历史图标。
                  </div>
                  <el-row
                    type="flex"
                    justify="center"
                    align="center"
                    class="icon-btn"
                    @click.native="openhistoryChart"
                    :class="{  'icon-btn-disabled' : disabledHistoryChart}"
                  >
                    <div class="icon-title">销量历史</div>
                    <el-avatar
                      shape="square"
                      :size="50"
                      fit="fill"
                      class="iconfont icon-baogaolishichaxun icon"
                    ></el-avatar>
                  </el-row>
                </el-tooltip>
                <el-tooltip placement="top">
                  <div slot="content">
                    点击后往地图区域绘制多边形区域，
                    <br />可统计出该区域当前图层的油站的油品
                  </div>
                  <el-row
                    type="flex"
                    justify="center"
                    align="center"
                    class="icon-btn"
                    :class="{'icon-close': isDrawing}"
                    @click.native="handleGeometry"
                  >
                    <div class="icon-title" :class="{'icon-close': isDrawing}" v-text="isDrawing ? '取消绘制' : '区域统计'">区域统计</div>
                    <el-avatar
                      shape="square"
                      :size="50"
                      fit="fill"
                      class="iconfont icon-tongjifenxi icon"
                      :class="{'icon-close': isDrawing}"
                    ></el-avatar>
                  </el-row>
                </el-tooltip>
              </el-row>
              <el-footer height="20px" class="grounp-footer">统计</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="openTable"
                >
                  <div class="icon-title">表格视图</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-jurassic_edit-table icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">表格</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="importSaleDatasVisible = true"
                >
                  <div class="icon-title">导入销量数据</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-daoru-tianchong icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">数据</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="exportLayerVisible = true"
                >
                  <div class="icon-title">导出</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-daochu icon"></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="importLayerVisible = true"
                >
                  <div class="icon-title">导入</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-daoru1 icon"></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">批量更新</el-footer>
            </div>
          </el-scrollbar>
        </div>
        <!-- </el-tabs> -->
      </el-main>
    </el-container>
    <import-layer-ctrl
      :dialogVisible.sync="importLayerCtrlVisible"
      exampleXlsPath="./dataPages/shellyz/shellyz-improt-test.xlsx"
    ></import-layer-ctrl>
    <multi-site-compare :dialogVisible.sync="mscompareVisible" :mscData="selectFeatures"></multi-site-compare>
    <history-sales-chart :dialogVisible.sync="historyChartVisible" :yzdata="selectFeatures"></history-sales-chart>
    <export-layer
      :dialogVisible.sync="exportLayerVisible"
      :fieldList="fields"
      :layerTable="layerTable"
    ></export-layer>
    <import-layer :dialogVisible.sync="importLayerVisible"></import-layer>
    <import-sale-datas
      :dialogVisible.sync="importSaleDatasVisible"
      exampleXlsPath="./dataPages/shellyz/shellyz%E9%94%80%E9%87%8F%E6%95%B0%E6%8D%AE-improt-test.xlsx"
    ></import-sale-datas>
    <area-statistics :dialogVisible.sync="areaStatisticsVisible" :tableData="areaData"></area-statistics>
    <table-views v-if="isopenTable"></table-views>
  </div>
</template>

<script>
import { mapState } from "vuex";
import xymixin from "@/components/controlPanel/mixin/yzmixin";

export default {
  mixins: [xymixin],
  methods: {
    /* end 面板ui操作 */
    /**
     * 图层标签
     * @type {{[id:string]:Array<{name:string,renderer:Renderer,visible:boolean}>}}
     */
    initLabel() {
      const labels = [
        { name: "显示销量", render: null, visible: false },
        { name: "显示编号", render: null, visible: false },
        { name: "目标站点", render: null, visible: false },
        { name: "显示站名", render: null, visible: false },
        { name: "显示小图标", render: null, visible: false },
        { name: "显示编号", render: null, visible: false },
        { name: "VA油站", render: null, visible: false },
        { name: "显示 Crt", render: null, visible: false }
      ];
      return labels;
    },
    /* end 面板ui操作 */
    /**
     * 图层标签
     * @type {{[id:string]:Array<{name:string,renderer:Renderer,visible:boolean}>}}
     */
    init() {
      let layer = this.base.find(item => item.id === "shellyz");
      this.statusList = layer.extLayers || this.initLabel();
      this.fields = layer.fields || [];
    }
  },
  mounted() {
    this.init();
    // console.log(this.selectFeatures)
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/controlpanel.scss";
</style>