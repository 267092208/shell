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
            <div class="tab-panel-group" v-if="openTools">
              <el-row type="flex">
                <el-row type="flex" justify="center" align="center" class="icon-btn">
                  <div class="icon-title">标题</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-shangquan icon"
                    style="font-size: 28px"
                  ></el-avatar>
                </el-row>
                <el-row type="flex" justify="center" align="center" class="icon-btn">
                  <div class="icon-title">拖拽</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-dianjichufa icon"
                    @click.native="closeGeo"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="beginDraw('Circle')"
                >
                  <div class="icon-title">绘制圆形</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-yuanxing1 icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="beginDraw('Box')"
                >
                  <div class="icon-title">绘制矩形</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-rect icon"></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="beginDraw('Polygon')"
                >
                  <div class="icon-title">绘制多边形</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-star icon"></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="beginDraw('LineString')"
                >
                  <div class="icon-title">绘制折线</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-zhexian icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="closeTools"
                >
                  <div class="icon-title">关闭</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-quxiao icon"></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">绘制图形</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="openCommPanel"
                  v-if="openTools === false"
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
                  @click.native="importPictureVisible = isChoice"
                >
                  <div class="icon-title">商圈图片</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-filepicture icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer pdlr10">图层操作</el-footer>
            </div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
    <!-- </div> -->
    <import-picture :dialogVisible.sync="importPictureVisible" title="商圈照片"></import-picture>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from "@/components/controlPanel/mixin/commLayerMixin";

export default {
  mixins: [mixin],
  methods: {
    openCommPanel() {
      this.openTools = true;
      this.$store.dispatch("replace", { path: "commAddPanel" });
    },
    async beginDraw(mode) {
      let geometry = await this.$store.dispatch("getGeometry", {
        drawMode: mode
      });

      geometry.on("update", async (e) => {
      });
    },
    closeTools() {
      this.openTools = false;
      this.closeGeo();
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
      // statusList: [{name: '显示十三五规划编号', visible: false}],
      statusList: [],
      scaleList: [25, 50, 75, 100, 125, 150, 175, 200],
      scale: 100,
      importPictureVisible: false,
      openTools: false,
      geometry: null
    };
  },
  deactivated() {
        if (this.geometry != null) {
      this.geometry.disable();
    }
  },
  components: {
    importPicture: () =>
      import("@/components/controlPanel/common/importPicture.vue")
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