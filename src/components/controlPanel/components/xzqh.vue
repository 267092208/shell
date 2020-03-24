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
            <div class="tab-panel-group">
              <el-row type="flex">

                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  :class="{ 'icon-btn-disabled': !choiceOnce }"
                  @click.native.stop="shapeAdjust"
                >
                  <div class="icon-title">开始调整</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-crm9 icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  v-show="beginShape"
                  @click.native.stop="exitShape"
                  v-loading="saving"
                  element-loading-text="保存中..."
                >
                  <div class="icon-title">退出调整</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-exit-door icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="text-btn"
                  v-show="beginShape"
                >
                <div>
                  要删除节点,<br/>>
                  按住alt键,<br/>
                  点击节点,<br/>
                </div>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">调整形状</el-footer>
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
import { modelToEntityKeyValue} from '@/data/layer'
import gcoord from 'gcoord'

export default {
  mixins: [mixin],
  computed: {
    ...mapState({editFeature: state =>state.editGeometry.feature})
  },

  methods: {
    openCommPanel() {
      this.$store.dispatch("replace", { path: "createXzqh" });
    },
    async exitShape() {
      this.saving = true;
      let path_baidu_1 = this.geometryInstance.getFeature().getGeometry().getCoordinates()[0].map(item => gcoord.transform(item, gcoord.EPSG3857, gcoord.BD09).join(',')) // 记得转坐标
      console.log(path_baidu)
      path_baidu_1 = path_baidu_1.join(';')
      let value = this.editFeature.properties.properties; 
      value.path_baidu = path_baidu_1;
      const {path_baidu, ID, Name, ParentId, 人口, GDP, GDP增速, 汽车保有量, 汽车保有量增速, 第一产业比重, 第二产业比重, 第三产业比重, 人均收入, GDP排名, F_20, F_19, F_18, F_17, F_16, F_15, F_14, F_13, F_12, F_11, F_10, F_9, F_8, F_7, F_6, F_5, F_4, F_3, F_2, F_1, F_} = value
     const model = {
        path_baidu, ID, Name, ParentId, 人口, GDP, GDP增速, 汽车保有量, 汽车保有量增速, 第一产业比重, 第二产业比重, 第三产业比重, 人均收入, GDP排名, F_20, F_19, F_18, F_17, F_16, F_15, F_14, F_13, F_12, F_11, F_10, F_9, F_8, F_7, F_6, F_5, F_4, F_3, F_2, F_1, F_
      }
      const geometry = this.geometryInstance.getFeature().getGeometry()
      await this.$store.dispatch('updateLayerFeature', { layerid: 'xzqh', feature:  {
                id: model.ID, 
                geometry: {
                  type: geometry.getType(),
                  coordinates: geometry.getCoordinates()
                },
                properties: model }})
            .catch(err => {this.saving = false; console.log(err)}) 
      this.saving = false;
      this.geometryInstance.disable();
      this.beginShape = false;
    }, 
    async shapeAdjust() {
      this.beginShape = true;
      let geometry = await this.$store.dispatch('getGeometry', { drawMode: this.selectFeature.values_.geometryType, feature: this.selectFeature}).catch(err => this.beginShape = false)
      geometry.on("update", async (e) => {
        // console.log(e);
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
      beginShape: false,
      saving: false
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