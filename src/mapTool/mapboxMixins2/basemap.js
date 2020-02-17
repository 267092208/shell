import { baseMapRasterSource, baseMapSourceList } from "../baseMapData2.js";
import { mapState } from "vuex";
import TileLayer from "ol/layer/Tile";
import LayerGroup from "ol/layer/Group";
import { map } from "./map";
import Vue from "vue";
import BaseMapSource from "@/components/mapTool/BaseMapSource.vue";

let baseMapRasterLayerGroup;
/**
 * @type {{
 * [key:sourceKey]:Array<TileLayer>
 * }}
 */
let baseMapRasterLayers = {};
// TODO:未实现

const mixin = {
  data() {
    return {
      baseMapSourceList: baseMapSourceList
    };
  },
  components: {
    BaseMapSource
  },
  computed: {
    ...mapState({
      currentBaseMapSource: state => state.basemap.currentBaseMapSource
    })
  },
  methods: {
    /**
     * 初始化地图
     */
    async initBaseMap() {
      const currentBaseMapSource =
        Vue.ls.get("currentBaseMapSource") || baseMapSourceList[1];
      await this.$store.dispatch(
        "setCurrenBaseMapSource",
        currentBaseMapSource
      );
     
    },

    setCurrentBaseMapSource(val) {
      this.$store.dispatch("setCurrenBaseMapSource", val);
    }
  },
  watch: {
    currentBaseMapSource(val) {
      const baseMapRasterLayerVisible = val.layerType === "baseMapRasterLayer";
      if (baseMapRasterLayerVisible) {
        if (baseMapRasterLayerGroup) {
          map.removeLayer(baseMapRasterLayerGroup);
        }
        if (!baseMapRasterLayers[val.sourceKey]) {         
          baseMapRasterLayers[val.sourceKey] = baseMapRasterSource[
            val.sourceKey
          ].map(t => {         
            return new TileLayer({
              source: t
            });
          });
        }
        baseMapRasterLayerGroup = new LayerGroup({
          layers: baseMapRasterLayers[val.sourceKey]
        });
        map.addLayer(baseMapRasterLayerGroup);

      }
      //TODO: baseMapGeojsonLayer 图层目前未实现
      const baseMapGeojsonLayer = val.layerType === "baseMapGeojsonLayer";
      Vue.ls.set("currentBaseMapSource", val);
    }
  }
};
export default mixin;
