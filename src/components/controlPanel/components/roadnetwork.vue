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
                  @click.native="beginDrawRoad"
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
              <el-row type="flex">
                <el-row type="flex" justify="center" align="center" class="icon-btn" @click.native="exportLayer" v-loading="exportting"
                  element-loading-text="导出中...">
                  <div class="icon-title">导出</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-daochu icon"></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">车流数据</el-footer>
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
    async beginDrawRoad() {
      this.addBtnGroupVisible = true;
      let geometry = await this.$store.dispatch('getGeometry', {drawMode: 'RoadLine_baidu'}).catch(err => console.log(err))

      geometry.on("update", async () => {
          geometry.getGeometry();
          await this.$store.dispatch("replace", { path: "commAddPanel" });
      });
    },
    init() {
      let layer = this.currentLayer;
      // this.statusList = layer.extLayers ;
      this.fields = layer.fields;
    },
    openTable() {
      this.$router.push("table");
    }
  },
  data() {
    return {
      addBtnGroupVisible: false,
    };
  },
  mounted() {
    this.init();
  },
  deactivated() {
    this.addBtnGroupVisible = false;
  },
  components: {
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