
import { mapState } from "vuex";
import { outputExcel, outputExcelData } from "@/data/layerExcelIO";

const mixin = {
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      selectFeatures: state => state.selectFeature.selectFeatures,
      selectFeature: state => state.selectFeature.selectFeature,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      filters: state => state.layer.filters,
      globalFilters: state => state.layer.globalFilters,
      base: state => state.layer.base,
      geometryInstance: state => state.editGeometry.geometryInstance,
      drawMode: state => state.editGeometry.drawMode
    }),
    isChoice() {
      return (
        this.selectFeatures.length >
        0 && this.selectFeatureLayer.id === this.currentLayer.id
      );
    },
    choiceOnce() {
      return (
        this.selectFeatures.length === 1 && this.selectFeatureLayer.id === this.currentLayer.id
      );
    },

  },
  data() {
    return {
      statusList: [],
      fields: [],
      geometry: null,
      addBtnGroupVisible: false,
      exportting: false
    }
  },
  methods: {
    backStep() {
      this.geometryInstance && this.geometryInstance.removeLastPoint();
    },
    closeGeo() {
      this.geometryInstance && this.geometryInstance.disable();
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
    changeStatus(name, val, id) {
      this.$store.dispatch("setLayerExtLayersVisible", {
        layerid: id,
        extLayers: this.statusList
      });
    },
    async changeRenders(label) {
      const res = await this.$store.dispatch('setLayerRender', { layerid: this.currentLayer.id, render: this.currentLayer.renderers[label] });
    },
    delChoiceLayer() {
      if (this.selectFeatures.length > 0 && this.selectFeatureLayer.id === this.currentLayer.id) {
        this.$confirm(
          `是否删除选中的${
          this.selectFeatures
            .length
          }个${this.currentLayer.name}`,
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
                layerid: this.currentLayer.id,
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
      } else {
        if (this.selectFeatures.length > 0)
          this.$message.info({ message: `请选择当前图层-${this.currentLayer.name}的要素，再进行删除操作` })
      }
    },
    async exportLayer() {
      let filter;
      filter = [...this.globalFilters];
      if (this.filters[this.currentLayer.id] != null) {
        filter.push(this.filters[this.currentLayer.id])
      }
      this.exportting = true;
      if (this.currentLayer.id === 'roadnetwork' || this.currentLayer.id === 'corridor') await outputExcelData(this.currentLayer.id, filter).catch(err => this.exportting=false)
      else {  // default
        await outputExcel(this.currentLayer.id, filter).then(res => {
          window.open(res);
          // this.downloadWithExportSuccess('.'+res, res.substr(res.lastIndexOf('/') + 1))
        }).catch(_ => this.exportting = false);
      }
      this.exportting = false;

    },
    downloadWithExportSuccess(url, fileName) {
      var a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      a.remove();
    }
  }
}

export default mixin;