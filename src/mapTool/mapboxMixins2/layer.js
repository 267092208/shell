import { mapState } from "vuex";
import { map } from "./map";
import { geoJSONLayers, createdRenderer } from "../layerManager.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { getLayerOL, toVectorFeature, toGeoJSON } from "./utils";
import clickFu from "@/config/layer/clickFu";
import zindex from "@/config/layer/zindex";
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
    /**
     * 更新图层
     * @param {*} layersSource
     * @param {*} oldLayersSource
     */
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
            zIndex: zindex[layerId] || 1,
            visible: this.layersVisible[layerId],
            clickFu: clickFu[layerId]
          });
          vectorLayer.set("layerId", layerId);

          map.addLayer(vectorLayer);
        } else if (
          layersSource.hasOwnProperty(layerId) &&
          mapLayerLoaded[layerId]
        ) {
          let currentLayer = getLayerOL(layerId);
          currentLayer.getSource().clear();
          let newFeatures = toVectorFeature(layersSource[layerId]);
          currentLayer.getSource().addFeatures(newFeatures);
          currentLayer.setStyle(createdRenderer(this.layersRenderer[layerId]));
          currentLayer.changed();
          // console.log(currentLayer.getSource().getFeatures());
        }
      }
    }
  },
  watch: {
    layersVisible(layersVisible, oldLayersVisible) {
      for (const layerId in layersVisible) {
        if (layersVisible.hasOwnProperty(layerId)) {
          const layerVisible = layersVisible[layerId];

          //根据图层的可见性设置对应图标的显示与隐藏
          map.getLayers().forEach(layer => {
            if (layer && layer.get("layerId") === layerId) {
              layer.setVisible(layerVisible);
            }
          });
        }
      }
    },
    layersRenderer(layersRenderer, oldLayersRenderer) {
      for (const layerId in layersRenderer) {
        if (layersRenderer.hasOwnProperty(layerId)) {
          let layer = getLayerOL(layerId);
          if (layer) {
            let id = layer.get("id") || layer.get("layerId");
            layer.setStyle(createdRenderer(layersRenderer[id]));
          }
        }
      }
    },
    async layersSource(layersSource, oldLayersSource) {
      console.log("layersSource", layersSource);

      this.updateGeoJSONLayers(layersSource, oldLayersSource);
    },
    layerSymbolScaling(symbolScaling) {
      /// TODO:图标大小仅考虑油站层
      //操作面板设置图标缩放级别后实现图标缩放
      for (const layerId in symbolScaling) {
        const scale = symbolScaling[layerId];
        let layer = getLayerOL(layerId);
        layer &&
          layer.setStyle(
            createdRenderer(this.layersRenderer[layerId], { scale })
          );
        // if (layer) {
        // let styleFunction = layer.getStyleFunction();

        // let style = null;

        layer &&
          layer
            .getSource()
            .getFeatures()
            .forEach(feature => {
              // style = styleFunction(feature);
              // style.getImage() && style.getImage().setScale(scale);
              // feature.changed();
              // console.log("style",feature.getStyle());
              feature.getStyle() &&
                feature.getStyle().forEach(s => {
                  s.getImage().setScale(scale);
                });
            });

        // }

        /// TODO:图标大小发生更变后，尚未处理文本标签、选择状态的样式
      }
    }
  }
};

export default mixin;
