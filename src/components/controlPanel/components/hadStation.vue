<template>
  <div class="ctl-panel-container">
    <!-- <div
        v-if="actionsPanelVisible"
        :class="[ 
          'ctl-panel-container',
        ]"
        :style="{ right: getRight + 'px', left: getLeft + 'px'}"
        ref="tabActionPanel"
    >-->
    <!-- <div class="el-icon-close close-btn" size="mini" @click.stop="closePanel"></div> -->
    <el-container class="ctl-wrap">
      <!-- <el-header height="40px">
            <h2 class="title">操作面板（Alt+2）</h2>
      </el-header>-->
      <el-main class="ctl-wrap-content">
        <el-tabs v-model="title" type="border-card">
          <el-tab-pane :label="`${title}操作`" :name="title" class="tab-content" ref="tabContent">
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
                      @change="changeStatus(item.name, item.visible, 'xyyz')"
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
                          @click.native="choiceScale(item, 'xyyz')"
                        >缩放: {{item}}%</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
                <el-footer height="20px" class="grounp-footer">状态</el-footer>
              </div>
              <div class="tab-panel-group">
                <el-row type="flex">
                  <el-tooltip
                    placement="top"
                    :disabled="!disabledMulSiteCompare"
                  >
                  <div slot="content">请按住ctrl选中地图上多个油站，<br/>再点击展示油站对比信息。</div>
                    <el-row
                      type="flex"
                      justify="center"
                      align="center"
                      class="icon-btn"
                      :class="{ 'icon-btn-disabled': disabledMulSiteCompare }"
                      @click.native="openMSCompareDialog()"
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
                  <el-tooltip  placement="top" :disabled="!disabledHistoryChart">
                  <div slot="content">请单选或多选(ctrl)中站点，<br/>再点击显示销售历史图标。</div>

                    <el-row
                      type="flex"
                      justify="center"
                      align="center"
                      class="icon-btn"
                      :class="{  'icon-btn-disabled' : disabledHistoryChart}"
                      @click.native="openhistoryChart"
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
                  <el-row
                    type="flex"
                    justify="center"
                    align="center"
                    class="icon-btn"
                    @click.native="handleGeometry"
                  >
                    <div class="icon-title">区域统计</div>
                    <el-avatar
                      shape="square"
                      :size="50"
                      fit="fill"
                      class="iconfont icon-tongjifenxi icon"
                    ></el-avatar>
                  </el-row>
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
                    @click.native="exportBatchLayerVisible = true"
                  >
                    <div class="icon-title">导出</div>
                    <el-avatar
                      shape="square"
                      :size="50"
                      fit="fill"
                      class="iconfont icon-daochu icon"
                    ></el-avatar>
                  </el-row>
                  <el-row
                    type="flex"
                    justify="center"
                    align="center"
                    class="icon-btn"
                    @click.native="importBatchLayerVisible = true"
                  >
                    <div class="icon-title">导入</div>
                    <el-avatar
                      shape="square"
                      :size="50"
                      fit="fill"
                      class="iconfont icon-daoru1 icon"
                    ></el-avatar>
                  </el-row>
                </el-row>
                <el-footer height="20px" class="grounp-footer">批量更新</el-footer>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <!-- </div> -->
    <!-- <add-layer :visible.sync="addLayerVisible" :height.sync="addLayerHeight"></add-layer> -->
    <import-layer-ctrl
      :dialogVisible.sync="importLayerCtrlVisible"
      exampleXlsPath="./dataPages/xyyz/xyyz-improt-test.xlsx"
    ></import-layer-ctrl>
    <multi-site-compare :dialogVisible.sync="mscompareVisible" :mscData="selectFeatures"></multi-site-compare>
    <history-sales-chart :dialogVisible.sync="historyChartVisible" :yzdata="selectFeatures"></history-sales-chart>
    <export-batch-layer
      :dialogVisible.sync="exportBatchLayerVisible"
      :fieldList="exportFields"
      :layerTable="layerTable"
    ></export-batch-layer>
    <import-batch-layer :dialogVisible.sync="importBatchLayerVisible"></import-batch-layer>
    <import-sale-datas :dialogVisible.sync="importSaleDatasVisible"></import-sale-datas>
    <area-statistics :dialogVisible.sync="areaStatisticsVisible" :tableData="areaData"></area-statistics>
    <table-views v-if="isopenTable"></table-views>
  </div>
</template>

<script>
import { mapState } from "vuex";
import xymixin from "@/components/controlPanel/mixin/yzmixin";

export default {
  computed: {
    ...mapState({
      // currentLayer: state => state.layer.currentLayer
    })
  },
  mixins: [xymixin],
  methods: {
    /* end 面板ui操作 */
    /**
     * 图层标签
     * @type {{[id:string]:Array<{name:string,renderer:Renderer,visible:boolean}>}}
     */
    init() {
      let layer = this.base.find(item => item.id === "xyyz");
      this.statusList = layer.extLayers;
      this.fields = layer.fields;
      // console.log(this.fields);
      // console.log(this.base);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/controlpanel.scss";
</style>