import { mapState } from "vuex";
import { getQualityByArea } from "@/data/yz.js";
import { Loading } from "element-ui";
import gcoord from "gcoord";


const xymixin = {
  props: ["title"],
  computed: {
    ...mapState({
      actionsPanelVisible: state => state.header.actionsPanelVisible,
      filtersPanelVisible: state => state.header.filtersPanelVisible,
      layersPanelVisible: state => state.header.layersPanelVisible,
      base: state => state.layer.base,
      selectMode: state => state.selectFeature.selectMode,
      selectFeatures: state => state.selectFeature.selectFeatures,
      selectFeature: state => state.selectFeature.selectFeature,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      currentLayer: state => state.layer.currentLayer
    }),

    exportFields() {
      return this.fields.map(item => {
        return item;
      });
    },
    disabledHistoryChart() {
      return this.selectFeatures.length === 0;
    },
    disabledMulSiteCompare() {
      return this.selectFeatures.length < 2;
    }
  },
  components: {
    addLayer: () => import("@/components/controlPanel/common/addLayer.vue"),
    multiSiteCompare: () =>
      import("@/components/controlPanel/common/MultiSiteCompare.vue"),
    historySalesChart: () =>
      import("@/components/controlPanel/common/historySalesChart.vue"),
    exportBatchLayer: () =>
      import("@/components/controlPanel/common/exportBatchLayer.vue"),
    importBatchLayer: () =>
      import("@/components/controlPanel/common/importBatchLayer.vue"),
    tableViews: () => import("@/components/controlPanel/common/tableViews.vue"),
    importLayerCtrl: () =>
      import("@/components/controlPanel/common/importLayerCtrl.vue"),
    importSaleDatas: () =>
      import("@/components/controlPanel/common/importSaleDatas.vue"),
    areaStatistics: () =>
      import("@/components/controlPanel/common/AreaStatistics.vue")
  },
  data() {
    return {
      getLeft: 0,
      getRight: 0,
      activeName: "test",
      value: false,
      statusList: [
        { name: "显示销量", renderer: null, visible: false },
        { name: "显示编号", renderer: null, visible: false },
        { name: "目标站点", renderer: null, visible: false },
        { name: "显示站名", renderer: null, visible: false },
        { name: "显示小图标", renderer: null, visible: false },
        { name: "显示编号", renderer: null, visible: false },
        { name: "显示 Crt", renderer: null, visible: false }
      ],
      addLayerVisible: false,
      importLayerCtrlVisible: false,
      addLayerHeight: 0,
      scale: 100,
      scaleList: [25, 50, 75, 100, 125, 150, 175, 200],
      mscompareVisible: false,
      historyChartVisible: false,
      exportBatchLayerVisible: false,
      importBatchLayerVisible: false,
      importSaleDatasVisible: false,
      areaStatisticsVisible: false,
      isopenTable: false,
      historyData: [],
      mscData: [],
      fields: [],
      layerTable: [],
      areaData: [],
      isDrawing: false,
    };
  },
  methods: {
    openMSCompareDialog() {
      if (this.selectMode && this.selectFeatures.length >= 2) {
        this.mscompareVisible = true;
      } else {
        // this.$message.error({message: '请先选择多个站点', offset: 60})
      }
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
    closePanel() {
      this.$store.commit("setActionsPane", false);
    },
    delChoiceLayer() {
      if (this.selectFeatures.length > 0) {
        this.$confirm(
          `是否删除选中的${this.selectFeatures.length}个油站`,
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
                layerid: this.selectFeatureLayer.id,
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
    getTabPanelHeight() {
      return this.$refs.tabActionPanel.clientHeight;
    },
    changeStatus(name, val, id) {
      this.$store.dispatch("setLayerExtLayersVisible", {
        layerid: id,
        extLayers: this.statusList
      });
    },
    openAddLayer() {
      this.$store.dispatch("replace", { path: "addLayer" });
    },
    handleGeometry() {
      // console.log('geometry')
      if (this.isDrawing === false) {
        this.isDrawing = true;
        // go do this
        this.$store
          .dispatch("getGeometry", { drawMode: 'Polygon' })
          .then(geometryInstance => {
            geometryInstance.on("update", () => {
              this.isDrawing = false; // 绘制结束
              // // let b = res.coordinates[0].map(item => item.join()).join(';');
              let res = geometryInstance.getGeometry().getGeometry().getCoordinates();
              res[0] = res[0].map(([x, y]) => {
                let latlng = gcoord.transform([x, y], gcoord.EPSG3857, gcoord.BD09);
                return latlng
              })
              let loadingInstance1 = Loading.service({ fullscreen: true });
              getQualityByArea(this.currentLayer.id, res[0])
                .then(res => {
                  this.areaData = res.splice(1);
                  loadingInstance1.close();
                  if (this.areaData.length === 0)
                    this.$message.info({
                      message: "该区域无当前图层数据",
                      offset: 60
                    });
                  else this.areaStatisticsVisible = true;
                  geometryInstance.disable();
                })
                .catch(err => loadingInstance1.close());
            })

          })
          .catch(err => { });
      } else {
        this.$store.dispatch("drawDisable");
        this.isDrawing = false;
      }
    },
    openTable() {
      this.$router.push("table");
    },
    openhistoryChart() {
      if (this.selectFeatures.length === 0) {
        // this.$message.error({message: '请先选中站点', offset: 60})
        return;
      }
      this.historyChartVisible = true;
    }
  },
  watch: {
    selectMode(val) {
      // console.log(val)
      // console.log(this.selectFeature, this.selectFeatures)
    }
  }
};

export default xymixin;
