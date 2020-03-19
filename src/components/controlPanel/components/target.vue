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
              <el-row type="flex" class="labelTable" style="width:280px;">
                <el-col
                  v-for="(item,index) in handleList"
                  :key="index"
                  class="label-btn-wrap"
                  style="width: calc(50% - 10px);"
                  
                >
                  <div class="statusLabel" style="width: 78px;">{{item.name}}</div>
                  <el-switch
                    class="statusSW"
                    v-model="item.visible"
                    active-color="#13ce66"
                    @change="changeHandle(item.name, item.visible, 'target')"
                  ></el-switch>
                </el-col>
              </el-row>
              <el-footer height="20px" class="grounp-footer">图层操作</el-footer>
            </div>
            <div class="tab-panel-group" style="width: 140px;">
              <el-row type="flex" class="labelTable" style="flex-direction: column;">
                <el-col
                  v-for="(item,index) in statusList"
                  :key="index"
                  class="label-btn-wrap"
                >
                  <div class="statusLabel">{{item.name}}</div>
                  <el-switch
                    class="statusSW"
                    v-model="item.visible"
                    active-color="#13ce66"
                    @change="changeStatus(item.name, item.visible, 'target')"
                  ></el-switch>
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
                  @click.native="openNtiTable"
                >
                  <div class="icon-title">表格视图</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-jurassic_edit-table icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="importNTILayerCtrlVisible = true"
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
              <el-footer height="20px" class="grounp-footer">NTI数据</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="openXyyzTable"
                >
                  <div class="icon-title">表格视图</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-jurassic_edit-table icon"></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="importXYYZLayerCtrlVisible = true"
                >
                  <div class="icon-title">导入</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-daoru1 icon"></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">现有油站数据</el-footer>
            </div>
          </el-scrollbar>
        </div>
        <!-- </el-tabs> -->
      </el-main>
    </el-container>
    <!-- </div> -->
    <!-- <add-layer :visible.sync="addLayerVisible" :height.sync="addLayerHeight"></add-layer> -->
    <import-layer-ctrl
      :dialogVisible.sync="importXYYZLayerCtrlVisible"
      exampleXlsPath="./dataPages/xyyz/xyyz-improt-test.xlsx"
      title="导入现有油站数据表"
      layerId="xyyz"
    ></import-layer-ctrl>
    <import-layer-ctrl
      :dialogVisible.sync="importNTILayerCtrlVisible"
      exampleXlsPath="./dataPages/nti/nti-improt-test.xlsx"
      title="导入nti数据表"
      layerId="nti"
    ></import-layer-ctrl>
    
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from '@/components/controlPanel/mixin/commLayerMixin'
export default { 
   mixins: [mixin],
   data () {
     return {
        importXYYZLayerCtrlVisible: false,
        importNTILayerCtrlVisible: false,
        statusList: [
        // { name: "显示销量", renderer: null, visible: false },
        // { name: "显示编号", renderer: null, visible: false },
        // { name: "目标站点", renderer: null, visible: false },
        // { name: "显示站名", renderer: null, visible: false },
        // { name: "显示小图标", renderer: null, visible: false },
        // { name: "显示编号", renderer: null, visible: false },
        // { name: "显示 Crt", renderer: null, visible: false }
      ],
      handleList:[],
        scaleList: [25, 50, 75, 100, 125, 150, 175, 200],
        scale: 100,
     }
   },
  methods: {
    changeHandle(name, val, id) {


      this.$store.dispatch('setLayerHandleLayersVisible',{
        layerid: id,
        handleLayers: this.handleList
      });
    },
    /**
     * 图层标签
     * @type {{[id:string]:Array<{name:string,renderer:Renderer,visible:boolean}>}}
     */
    init() {
      let layer = this.base.find(item => item.id === "target");

      this.statusList =  this.currentLayer.extLayers;
      this.handleList = this.currentLayer.handleLayers;
      console.log(layer);
      // this.fields = layer.fields;
    },
    async openXyyzTable() {
      await this.$store.dispatch('setOccupyTableId', 'xyyz');
      await this.$ls.set('occupyTableId', 'xyyz');
      await this.$router.push('table');
    },
    async openNtiTable() {
      await this.$store.dispatch('setOccupyTableId', 'nti');
      await this.$ls.set('occupyTableId', 'nti');
      await this.$router.push('table');
    }
  },
  mounted() {
    this.init();
  },
  components: {
    importLayerCtrl: () =>
      import("@/components/controlPanel/common/importLayerCtrl.vue"),
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/controlpanel.scss";
</style>