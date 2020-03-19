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
                  v-if="geometryInstance && geometry"
                  @click.native="reOpenPanel"
                >
                  <div class="icon-title">显示属性面板</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-zhongxindakai icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">绘制添加</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
                <el-col :span="8" class="picker-btn">
                  <div class="icon-title">边框颜色:</div>
                  <el-color-picker
                    v-model="strokeColor"
                    size="small"
                    class="color-picker picker"
                  ></el-color-picker>
                </el-col>
                <el-col :span="8" class="picker-btn">
                  <div class="icon-title">填充颜色:</div>
                  <el-color-picker
                    v-model="fillColor"
                    size="small"
                    class="color-picker picker"
                    color-format="rgb"
                  ></el-color-picker>
                </el-col>
                <el-col :span="8" class="picker-btn">
                  <div class="icon-title">线性</div>
                  <el-select
                    v-model="strokeStyle"
                    placeholder="请选择"
                    class="picker color-picker"
                    size="small"
                  >
                    <el-option
                      v-for="item in borderStyleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-footer height="20px" class="grounp-footer pdlr10">绘制样式选择</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex">
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
                    class="iconfont icon-tianjia icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer pdlr10">数据导入</el-footer>
            </div>
            <div class="tab-panel-group" style="width: 150px;">
              <el-row
                type="flex"
                class="stylerow"
                align="middle"
                v-for="(item, index) in currentLayer.renderers"
                :key="index"
              >
                <el-radio
                  v-model="radio"
                  :label="index"
                  class="icon-btn item"
                  @change="changeRenders"
                >{{item.name}}</el-radio>
              </el-row>
              <el-footer height="20px" class="grounp-footer">样式</el-footer>
            </div>
            <div class="tab-panel-group">
              <el-row type="flex" class="labelTable" style="width: 150px;">
                <!--190 -->
                <el-col
                  v-for="(item,index) in statusList"
                  :key="index"
                  class="label-btn-wrap"
                  style="flex: 0 1 100%;width: 100%;"
                >
                  <div style="float: left; padding-right: 15px;">{{item.name}}</div>
                  <el-switch
                    class="statusSW"
                    v-model="item.visible"
                    active-color="#13ce66"
                    @change="changeStatus(item.name, item.visible, 'poigroups')"
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
                  @click.native="exportBatchLayerVisible = true"
                >
                  <div class="icon-title">导出</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-daochu icon"></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="importBatchLayerVisible = true"
                >
                  <div class="icon-title">导入</div>
                  <el-avatar shape="square" :size="50" fit="fill" class="iconfont icon-daoru1 icon"></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer pdlr10">批量数据</el-footer>
            </div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
    <!-- </div> -->
    <export-batch-layer
      :dialogVisible.sync="exportBatchLayerVisible"
      :fieldList="currentLayer.fields"
    ></export-batch-layer>
    <import-batch-layer :dialogVisible.sync="importBatchLayerVisible"></import-batch-layer>
    <import-layer-ctrl
      :dialogVisible.sync="importLayerCtrlVisible"
      exampleXlsPath="./dataPages/poigroups/poigroups-improt-test.xlsx"
    ></import-layer-ctrl>
  </div>
</template>

<script>
import { mapState } from "vuex";
import mixin from "@/components/controlPanel/mixin/commLayerMixin";
import { rgbToHex } from '@/utils/hexRgba'

export default {
  mixins: [mixin],
  methods: {
    async reOpenPanel() {
      // // await this.$store.dispatch("getGeometry", {
      // //   drawMode: this.mode,
      // //   feature: this.geometry.getFeature()
      // // }).then(geometry => {
      // //   geometry.on("update", async e => {
      // //   if (e.type === "addfeature") {
      // //     const style = await this.$store.dispatch("getFeatureStyle", {
      // //       strokeColor: this.strokeColor,
      // //       fillColor: this.fillColor,
      // //       strokeStyle: this.strokeStyle,
      // //       fillOpacity: 0.5
      // //     });
      // //     geometry.getFeature().setStyle(style);
      // //   this.geometry = geometry;
      // //     await this.$store.dispatch("replace", {
      // //       path: "commAddPanel",
      // //       extent: {
      // //         strokeColor: this.strokeColor,
      // //         fillColor: this.fillColor.includes('rgb') ? rgbToHex(this.fillColor).hex : this.fillColor,
      // //         strokeStyle: this.strokeStyle
      // //       }
      // //     });
      // //   }
      // // }); // end on
      // });
      await this.$store.dispatch("replace", {
        path: "commAddPanel",
        extent: {
          strokeColor: this.strokeColor,
          fillColor: this.fillColor,
          strokeStyle: this.strokeStyle
        }
      });
      // let geometry = await this.$store.dispatch("getGeometry", {
      //   drawMode: this.drawMode,
      //   feature: this.geometry.getFeature()
      // });
    },
    async beginDraw(mode) {
      this.mode = mode;
      let geometry = await this.$store.dispatch("getGeometry", {
        drawMode: mode
      });
      geometry.on("update", async e => {
        if (e.type === "addfeature") {
          const style = await this.$store.dispatch("getFeatureStyle", {
            strokeColor: this.strokeColor,
            fillColor: this.fillColor,
            strokeStyle: this.strokeStyle,
            fillOpacity: 0.5
          });
          geometry.getFeature().setStyle(style);
        this.geometry = geometry;
          await this.$store.dispatch("replace", {
            path: "commAddPanel",
            extent: {
              strokeColor: this.strokeColor,
              fillColor: this.fillColor.includes('rgb') ? rgbToHex(this.fillColor).hex : this.fillColor,
              strokeStyle: this.strokeStyle
            }
          });
        }
      }); // end on
    },
    init() {
      let layer = this.currentLayer;
      this.statusList = layer.extLayers;
      this.fields = layer.fields;
    },
    openTable() {
      this.$router.push("table");
    }
  },
  data() {
    return {
      mode: null,
      radio: 0,
      geometry: null,
      strokeColor: "#0000ff",
      fillColor: "rgb(255, 0, 0)",
      strokeStyle: "solid",
      borderStyleOptions: [
        {
          label: "实线",
          value: "solid"
        },
        {
          label: "虚线",
          value: "dash"
        }
      ],
      // statusList: [{name: '显示十三五规划编号', visible: false}],
      exportBatchLayerVisible: false,
      importLayerCtrlVisible: false,
      importBatchLayerVisible: false,
    };
  },
  deactivated() {
    this.geometry = null;
  },
  mounted() {
    this.init();
  },
  components: {
    exportBatchLayer: () =>
      import("@/components/controlPanel/common/exportBatchLayer.vue"),
    importBatchLayer: () =>
      import("@/components/controlPanel/common/importBatchLayer.vue"),
    importLayerCtrl: () =>
      import("@/components/controlPanel/common/importLayerCtrl.vue")
  },
  watch: {
    geometryInstance(val) {
      if (val == null) this.geometry = null;
    }
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