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
        <!-- <el-tabs v-model="title" type="border-card"> -->
        <div class="tab-content" ref="tabContent">
          <el-scrollbar style=" height: 125px; width: 100%;">
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="openCommPanel"
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
                    class="iconfont icon-daoru1 icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  :class="{ 'icon-btn-disabled': !isChoice }"
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
              <el-row type="flex" class="labelTable" style="width: 150px;"> <!--190 -->
                <el-col
                  v-for="(item,index) in statusList"
                  :key="index"
                  class="label-btn-wrap icon-btn"
                  style="flex: 0 1 100%;width: 100%;"
                >
                  <div style="width: 120px; float: left;">{{item.name}}</div>
                  <el-switch
                    class="statusSW"
                    v-model="item.visible"
                    active-color="#13ce66"
                    @change="changeStatus(item.name, item.visible, 'nti')"
                  ></el-switch>
                </el-col>
                <el-col
                  class="label-btn-wrap icon-btn"
                  style="text-align: left; flex: 0 1 100%;width: 100%;"
                >
                  <el-dropdown class="label-dropdown">
                    <span class="el-dropdown-link">
                      缩放: {{scale}}%
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item, index) in scaleList"
                        :key="index"
                        @click.native="choiceScale(item, 'poi')"
                      >缩放: {{item}}%</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
              <el-footer height="20px" class="grounp-footer">状态</el-footer>
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
                  :class="{ 'icon-btn-disabled': !choiceOnce }"
                  @click.native.stop="poiListVisible = choiceOnce"
                >
                  <div class="icon-title">查看列表</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-wendang icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer"  style="width: 69px;padding: 0 10px;">覆盖油站</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex" class="stylerow" align="middle">
                <el-checkbox v-model="radio"  class="icon-btn item"  @change='selectAll'>全选</el-checkbox>
              </el-row>
              <el-footer height="20px" class="grounp-footer">选择</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="exportLayer"
                  v-loading="exportting"
                  element-loading-text="导出中..."
                >
                  <div class="icon-title">导出</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-daochu icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">导出</el-footer>
            </div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
    <!-- </div> -->
    <import-layer-ctrl :dialogVisible.sync="importLayerCtrlVisible" :exampleXlsPath ="'/dataPages/poi/poi-improt-test.xlsx'"></import-layer-ctrl>
    <lookPoiList :dialogVisible.sync="poiListVisible"></lookPoiList>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from '@/components/controlPanel/mixin/commLayerMixin'

export default {
  mixins: [mixin],
  data(){
    return {
      isSelectAll:false

}
  },
  methods: {
    openCommPanel() {
      this.$store.dispatch("replace", { path: "commAddPanel" });
    },
    choiceScale(val, id) {
      this.scale = val;
      this.$store.dispatch("setLayerSymbolScaling", {
        layerid: id,
        symbolScaling: +Number.parseFloat(
          (Number.parseFloat(val) / 100).toFixed(2)
        )
      });
    },
    init() {
      let layer = this.currentLayer;
      // this.statusList = layer.extLayers ;
      this.fields = layer.fields;
      this.choiceScale(100, this.currentLayer.id);
    },
    selectAll() {
      
     this.isSelectAll = this.isSelectAll?false:true; 
      this.$store.dispatch("setSelectAll",{
        layerid:this.currentLayer.id,
        selectAll:this.isSelectAll
      })
    },
    openTable() {
      this.$router.push("table");
    }
  },
  data() {
    return {
      radio: null,
      // statusList: [{name: '显示十三五规划编号', visible: false}],
      statusList: [],
      scaleList: [25, 50, 75, 100, 125, 150, 175, 200],
      scale: 100,
      importLayerCtrlVisible: false,
      poiListVisible: false
    };
  },
  mounted() {
    this.init();
  },
  components: {
    lookPoiList: () => import('@/components/controlPanel/poi/lookPoiList'),
    importLayerCtrl: () =>
      import("@/components/controlPanel/common/importLayerCtrl.vue")
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/controlpanel.scss";
.stylerow {
  width: 100%;
  height: 45px;
  .item {
    height: 100%;
    box-sizing: border-box;
    line-height: 30px;
  }
}
</style>