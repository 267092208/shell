import { mapState } from "vuex";
import { map } from "./map";
import { geoJSONLayers, createdRenderer } from "../layerManager.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getLayerOL,toVectorFeature } from "./utils";

const mapLayerLoaded = {};
const mixin = {
  computed: {
    ...mapState({
      // 要素图层
      layersVisible: state => state.layer.visible,
      layersRenderer: state => state.layer.renderer,
      layersSource: state => state.layer.source,
      layerbase: state => state.layer.base,
      layerSymbolScaling: state => state.layer.symbolScaling
    })
  },
  methods: {
    async initLayers() {
      this.updateGeoJSONLayers(this.layersSource);
    },
    async updateGeoJSONLayers(layersSource, oldLayersSource = {}) {
      for (const layerId in layersSource) {
        if (layersSource.hasOwnProperty(layerId) && !mapLayerLoaded[layerId]) {
          mapLayerLoaded[layerId] = true;
          let vectorSource = new VectorSource({
            features: toVectorFeature(layersSource[layerId])
          });
          let vectorLayer = new VectorLayer({
            source: vectorSource,
            style: createdRenderer(this.layersRenderer[layerId]),
            zIndex: 1,
            visible: this.layersVisible[layerId]
          });
          vectorLayer.set("layerId", layerId);

          map.addLayer(vectorLayer);
        } else if (layersSource.hasOwnProperty(layerId) && mapLayerLoaded[layerId]) {
          let currentLayer = getLayerOL(layerId);
          currentLayer.getSource().clear();
          currentLayer.getSource().addFeatures(toVectorFeature(layersSource[layerId]));
        }
      }
    },  
  },
  watch: {
    layersVisible(layersVisible, oldLayersVisible) {
      for (const layerId in layersVisible) {
        if (layersVisible.hasOwnProperty(layerId)) {
          const layerVisible = layersVisible[layerId];
          if (geoJSONLayers.hasOwnProperty(layerId)) {
            geoJSONLayers[layerId].setVisible(layerVisible);
          }
          //根据图层的可见性设置对应图标的显示与隐藏
          map.getLayers().forEach(layer => {
            if (layer.values_.layerId && layer.values_["layerId"] === layerId) {
              layer.setVisible(layerVisible);
            }
          });
        }
      }
    },
    layersRenderer(layersRenderer, oldLayersRenderer) {
      for (const layerId in layersRenderer) {
        if (layersRenderer.hasOwnProperty(layerId)) {
          const layerRenderer = layersRenderer[layerId];
          if (geoJSONLayers.hasOwnProperty(layerId)) {
            const renderer = createdRenderer(layerRenderer);
            geoJSONLayers[layerId].setRenderer(renderer);
          }
        }
      }
    },
    async layersSource(layersSource, oldLayersSource) {
      this.updateGeoJSONLayers(layersSource, oldLayersSource);
    },
    layerSymbolScaling(symbolScaling) {
      /// TODO:图标大小仅考虑油站层
      //操作面板设置图标缩放级别后实现图标缩放
      for (const layerId in symbolScaling) {
        const scal = symbolScaling[layerId];
        const mapboxLayerId = `${layerId}_layer_0`;
        let layerList = map.getLayers().getArray();
        let layer = layerList.find(item => {
          return item.get("id") === layerId || item.get("layerId") === layerId;
        });

        if (layer) {
          let styleFunction = layer.getStyleFunction();

          let style = null;
          layer
            .getSource()
            .getFeatures()
            .forEach(feature => {
              style = styleFunction(feature);
              style.getImage().setScale(scal);
              feature.changed();
            });
        }

        /// TODO:图标大小发生更变后，尚未处理文本标签、选择状态的样式
      }
    }
  }
};

export default mixin;
