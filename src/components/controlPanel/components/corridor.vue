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
        <div  class="tab-content" ref="tabContent">
          <el-scrollbar style=" height: 125px; width: 100%;">
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="beginDraw"
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
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  v-show="addBtnGroupVisible"
                  @click.native="backStep"
                >
                  <div class="icon-title">撤销</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-recall icon"
                  ></el-avatar>
                </el-row>
                 <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  v-show="addBtnGroupVisible"
                    @click.native="closeGeo"
                >
                  <div class="icon-title">清除</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-layer icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">图层操作</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex" class="stylerow" align="middle" v-for="(item, index) in currentLayer.renderers" :key="index">
                <el-radio v-model="radio" :label="index" class="icon-btn item" @change="changeRenders">{{item.name}}</el-radio>
              </el-row>
              <el-footer height="20px" class="grounp-footer">样式</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="exportLayer"
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
              <el-footer height="20px" class="grounp-footer pdlr10">Corridor数据</el-footer>
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
                  @click.native='importTrafficVisible = true'
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
                  @click.native="lookTrafficTable"
                >
                  <div class="icon-title">查看</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-wendang icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">车流信息</el-footer>
            </div>
          </el-scrollbar>
        </div>
        <!-- </el-tabs> -->
      </el-main>
    </el-container>
    <!-- </div> -->
    <import-layer-ctrl
      :dialogVisible.sync="importTrafficVisible"
      exampleXlsPath="./dataPages/corridor/corridor-traffic-improt-test.xlsx"
    ></import-layer-ctrl>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from '@/components/controlPanel/mixin/commLayerMixin'

export default {
  mixins: [mixin],
  methods: {
    async beginDraw() {
      this.addBtnGroupVisible = true;
      let geometry = await this.$store.dispatch('getGeometry', {drawMode: 'RoadLine_baidu'}).catch(err => console.log(err))

      geometry.on("update", async () => {
          geometry.getGeometry();
          await this.$store.dispatch("replace", { path: "commAddPanel" });
      });
    },
    init() {
      this.$parent.afterClose = function() {
        this.$store.dispatch("clearSelect");
      }.bind(this);
    },
    async openTable() {
      await setTimeout(1, () => {})
      await this.$router.push("table");
    },
    async lookTrafficTable() {
      await this.$store.dispatch('setOccupyTableId', 'traffic');
      await this.$ls.set('occupyTableId', 'traffic');
      await this.$router.push('table');
    },
    async changeRenders(label) {
      const res = await this.$store.dispatch('setLayerRender', {layerid: this.currentLayer.id, render: this.currentLayer.renderers[label]});
    }
  },
  data() {
    return {
      radio: 0,
      importTrafficVisible: false,
    };
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