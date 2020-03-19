import { mapState } from "vuex";
import { getLayerOL, toVectorFeature } from "./utils";

/**
 * 创建或显示图层操作
 * @param {*} layerid 图层ID
 * @param {*} renderer 图层操作的筛选
 * @param {*} index 扩展图层的索引
 * @param {*} source 图层操作的数据源
 */
function handleLayersSource(layerid, renderer, source) {
  let newFeatures = [];
  if (getLayerOL(layerid)) {
    let originFeatures = source[layerid];

    originFeatures.forEach(t => {
      if (t.properties["数据源图层ID"] === renderer.sourceID && t.properties[renderer.filterField] === renderer.filterValue) {
        newFeatures.push(t);
      }
    });
  }
  return newFeatures;
}

const mixin = {
  data() {
    return {
      sourceList: []
    };
  },
  computed: {
    ...mapState({
      layersVisibleEx: state => state.layer.visible,
      handleLayers: state => state.layer.handleLayers,
      source: state => state.layer.source,
      layersRenderer: state => state.layer.renderer,
      layersVisible: state => state.layer.visible
    })
  },
  methods: {
    updateHandleLayers() {
      for (const layerid in this.handleLayers) {
        const layerRVs = this.handleLayers[layerid];
        const layerVisible = this.layersVisible[layerid];
        this.sourceList = [];

        for (let i = 0; i < layerRVs.length; i++) {
          const { render, visible } = layerRVs[i];
          if (layerVisible && visible) {
            this.sourceList = this.sourceList.concat(handleLayersSource(layerid, render, this.source));
          }

          if (layerVisible && !visible) {
            this.sourceList = this.sourceList.filter((t, index) => {
              let feature = handleLayersSource(layerid, render, this.source).find(f => {
                return f && f.id === t.id;
              });
              if (feature) {
                return false;
              }
              return true;
            });
          }
        }

        getLayerOL(layerid) &&
          getLayerOL(layerid)
            .getSource()
            .clear();
        getLayerOL(layerid) &&
          getLayerOL(layerid)
            .getSource()
            .addFeatures(toVectorFeature(this.sourceList));
      }
    }
  },
  watch: {
    handleLayers(e) {
      this.updateHandleLayers();
    },
    layersVisibleEx() {
      this.updateHandleLayers();
    },
    layersVisible(layersVisible, oldLayersVisible) {
      for (const layerId in layersVisible) {
        if (layersVisible.hasOwnProperty(layerId)) {
          const layerVisible = layersVisible[layerId];
          if (layerVisible && layerId === "target") {
            this.updateHandleLayers();
          }
        }
      }
    }
  }
};

export default mixin;
