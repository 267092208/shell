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
                  @click.native="openAddMA"
                >
                  <div class="icon-title">新建MA</div>
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
                  :class="{ 'icon-btn-disabled': !isChoiceMA }"
                  @click.native.stop="delChoiceLayer"
                >
                  <div class="icon-title">删除MA</div>
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
                  :class="{ 'icon-btn-disabled': !choiceOnceMA }"
                  @click.native="rankingVisible = choiceOnceMA"
                >
                  <div class="icon-title">MA Ranking</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-youxuliebiao2 icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  :class="{ 'icon-btn-disabled': !choiceOnceMA }"
                  @click.native="economicVisible = choiceOnceMA"
                >
                  <div class="icon-title">经济数据</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-youxuliebiao3 icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  :class="{ 'icon-btn-disabled': !isChoiceMA }"
                  @click.native="gasInfoVisible = isChoiceMA"
                >
                  <div class="icon-title">油品信息</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-youxuliebiao4 icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                  @click.native="importRankingVisible = true"
                >
                  <div class="icon-title">Ranking导入</div>
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
                  @click.native="importEconomicVisible = true"
                >
                  <div class="icon-title">经济导入</div>
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
                  @click.native="attachmentManagerVisible = choiceOnceMA"
                   :class="{ 'icon-btn-disabled': !choiceOnceMA }"
                >
                  <div class="icon-title">附件管理</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-Excelwendang icon"
                  ></el-avatar>
                </el-row>
                <el-row
                  type="flex"
                  justify="center"
                  align="center"
                  class="icon-btn"
                   :class="{ 'icon-btn-disabled': !choiceOnceMA }"
                  @click.native="bookmarkingVisible = choiceOnceMA"
                >
                  <div class="icon-title">网址收藏</div>
                  <el-avatar
                    shape="square"
                    :size="50"
                    fit="fill"
                    class="iconfont icon-shoucangjia icon"
                  ></el-avatar>
                </el-row>
              </el-row>
              <el-footer height="20px" class="grounp-footer">文档和收藏</el-footer>
            </div>
          </el-scrollbar>
        </div>
        <!-- </el-tabs> -->
      </el-main>
    </el-container>
    <!-- </div> -->
    <!-- <add-layer :visible.sync="addLayerVisible" :height.sync="addLayerHeight"></add-layer> -->
    <!-- <table-views v-if="isopenTable"></table-views> -->
    <ma-ranking :dialogVisible.sync="rankingVisible"></ma-ranking>
    <economic-table :dialogVisible.sync="economicVisible"></economic-table>
    <gas-info :dialogVisible.sync="gasInfoVisible"></gas-info>
    <import-ranking :dialogVisible.sync="importRankingVisible" exampleXlsPath="./dataPages/ma/MA-Ranking-improt-test.xlsx"></import-ranking>
    <import-economic :dialogVisible.sync="importEconomicVisible" exampleXlsPath="./dataPages/ma/MA-经济-improt-test.xlsx"></import-economic>
    <attachment-manager :dialogVisible.sync="attachmentManagerVisible"></attachment-manager>
    <book-marking :dialogVisible.sync="bookmarkingVisible"></book-marking>
  </div>
</template>

<script>
import { mapState } from "vuex";
import maRanking from "@/components/controlPanel/MA/maRanking.vue";
import economicTable from "@/components/controlPanel/MA/economicTable.vue";
import gasInfo from "@/components/controlPanel/MA/gasInfo.vue";
import importRanking from "@/components/controlPanel/MA/importRanking.vue";
import importEconomic from "@/components/controlPanel/MA/importEconomic.vue";
import attachmentManager from "@/components/controlPanel/MA/attachmentManager.vue";
import bookMarking from "@/components/controlPanel/MA/bookmarking.vue";

export default {
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      selectFeatures: state => state.selectFeature.selectFeatures,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
    }),
    isChoiceMA() { 
      if (this.currentLayer  && this.currentLayer.id === 'ma' && this.selectFeatureLayer)
        return this.selectFeatureLayer.id === 'ma' && this.selectFeatures.length > 0;
      else return false;
    },
    choiceOnceMA() {
      if (this.currentLayer && this.currentLayer.id === 'ma' && this.selectFeatureLayer)
        return this.selectFeatureLayer.id === 'ma' && this.selectFeatures.length === 1;
      else return false
    },
  },
  methods: {
    openAddMA() {
      this.$store.dispatch("replace", { path: "addMA" });
    },
     delChoiceLayer() {
      if (this.isChoiceMA > 0) {
        this.$confirm(
          `是否删除选中的${this.selectFeatures.length}个MA`,
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$store
              .dispatch("removeLayerFeature", {
                layerid: 'ma',
                features: this.selectFeatures
              })
              .then(res => {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                  offset: 60
                });
              })
              .catch(err => {
                this.$message({
                  type: "error",
                  message: "删除失败!",
                  offset: 60
                });
              });
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: "已取消删除",
              offset: 60
            });
          });
      }
    },
    init() {
      // let layer = this.base.find(item => item.id === "xyyz");
      // this.statusList = layer.extLayers;
      // this.fields = layer.fields;
      // console.log(this.fields);
      // console.log(this.base);
      this.$parent.afterClose = function() {
        this.$store.dispatch("clearSelect");
      }.bind(this);
    },
    openTable() {
      this.$router.push("table");
    },
    async changeRenders(label) {
      const res = await this.$store.dispatch('setLayerRender', {layerid: this.currentLayer.id, render: this.currentLayer.renderers[label]});
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
      bookmarkingVisible: false
    };
  },
  mounted() {
    this.init();
  },
  components: {
    maRanking,
    economicTable,
    gasInfo,
    importRanking,
    importEconomic,
    attachmentManager,
    bookMarking
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