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
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from '@/components/controlPanel/mixin/commLayerMixin'

export default {
  mixins: [mixin],
  methods: {
    openCommPanel() {
      this.$store.dispatch("replace", { path: "commAddPanel" });
    },
    init() {
      let layer = this.currentLayer;
      // this.statusList = layer.extLayers ;
      this.fields = layer.fields;
      console.log(this.currentLayer)
    },
    openTable() {
      this.$router.push("table");
    }
  },
  data() {
    return {
      radio: 0,
      rankingVisible: false,
      economicVisible: false,
      gasInfoVisible: false,
      importRankingVisible: false,
      importEconomicVisible: false,
      attachmentManagerVisible: false,
      bookmarkingVisible: false,
      // statusList: [{name: '显示十三五规划编号', visible: false}],
      statusList: [],
      scaleList: [25, 50, 75, 100, 125, 150, 175, 200],
      scale: 100,
      exportBatchLayerVisible: false,
      importBatchLayerVisible: false,
      importLayerCtrlVisible: false
    };
  },
  mounted() {
    this.init();
  },
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