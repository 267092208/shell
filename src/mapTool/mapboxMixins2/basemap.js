
import { baseMapRasterSource, baseMapSourceList } from '@/config/map/baseMap.js'
import { mapState } from 'vuex';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import { map, BaiduView, GCJ02View } from './map';
import Vue from "vue";
import GCJ02TileLayer from "@/mapTool/GCJ02TileLayer.js"
import BaseMapSource from "@/components/mapTool/BaseMapSource.vue";
import BaiduTileLayer from "@/mapTool/BaiduTileLayer.js"

let baseMapRasterLayerGroup
/**
 * @type {{
 * [key:sourceKey]:Array<TileLayer>
 * }}
 */
let baseMapRasterLayers = {}
// TODO:未实现
let baseMapGeojsonLayer;
function switch2Baidu(baiduLayer, map) {
  const view = map.getView();
  //判断地图级别的最大级别
  const MaxZoom = baiduLayer.getLayersArray()[0].getMaxZoom()
  if (view !== BaiduView) {
    if (view.getZoom() > MaxZoom) {
      BaiduView.setZoom(MaxZoom)
    } else {
      BaiduView.setZoom(view.getZoom());
    }
    BaiduView.setCenter(view.getCenter());
    map.setView(BaiduView);
  }
  BaiduView.setMaxZoom(MaxZoom)
  map.addLayer(baiduLayer);
}
function switch2GCJ02(gcj02Layer, map) {
  const view = map.getView();
  const MaxZoom = gcj02Layer.getLayersArray()[0].getMaxZoom()
  if (view !== GCJ02View) {
    if (view.getZoom() > MaxZoom) {
      GCJ02View.setZoom(MaxZoom)
    } else {
      GCJ02View.setZoom(view.getZoom());
    }
    GCJ02View.setCenter(view.getCenter());
    map.setView(GCJ02View);
  }
  GCJ02View.setMaxZoom(MaxZoom)

  GCJ02View.setMaxZoom(gcj02Layer.getLayersArray()[0].getMaxZoom())
  map.addLayer(gcj02Layer);
}
const mixin = {
  data() {
    return {
      baseMapSourceList: baseMapSourceList
    }
  },
  computed: {
    ...mapState({
      currentBaseMapSource: state => state.basemap.currentBaseMapSource,
    })
  },
  components: {
    BaseMapSource
  },
  methods: {
    /**
     * 初始化地图
     */
    async initBaseMap() {
      const currentBaseMapSource = Vue.ls.get("currentBaseMapSource") || baseMapSourceList[1];
      // console.log(currentBaseMapSource)
      await this.$store.dispatch("setCurrenBaseMapSource", currentBaseMapSource)
      // TODO:未实现 GeojsonLayer
      // map.addLayer(baseMapGeojsonLayer)
    },
    setCurrentBaseMapSource(val) {
      this.$store.dispatch("setCurrenBaseMapSource", val);
    }
  },
  watch: {
    currentBaseMapSource(val) {
      const baseMapRasterLayerVisible = val.layerType === "baseMapRasterLayer";
      // baseMapRasterLayerGroup.setVisible(baseMapRasterLayerVisible)
      if (baseMapRasterLayerVisible) {
        if (baseMapRasterLayerGroup) {
          map.removeLayer(baseMapRasterLayerGroup);
        }
        //空白地图
        if (!baseMapRasterSource[val.sourceKey]) {
          return
        }
        if (!baseMapRasterLayers[val.sourceKey]) {
          let type = "EPSG:3857";
          baseMapRasterLayers[val.sourceKey] = baseMapRasterSource[val.sourceKey].map(t => {
            if (t.type == "GCJ02") {
              type = "GCJ02";
              return new GCJ02TileLayer({
                source: t.source,
                maxZoom: t.maxZoom,
                minZoom: t.minZoom
              })
            } if (t.type == "DB09") {
              type = "DB09";
              return new BaiduTileLayer({
                source: t.source,
                maxZoom: t.maxZoom,
                minZoom: t.minZoom
              })
            } else {
              return new TileLayer({
                source: t.source,
                maxZoom: t.maxZoom,
                minZoom: t.minZoom
              })
            }
          })
          baseMapRasterLayers[val.sourceKey].type = type
        }
        baseMapRasterLayerGroup = new LayerGroup({
          layers: baseMapRasterLayers[val.sourceKey]
        });
        console.log(val);
        if (baseMapRasterLayers[val.sourceKey].type === "DB09") {
          switch2Baidu(baseMapRasterLayerGroup, map)
        } else {
          switch2GCJ02(baseMapRasterLayerGroup, map)
        }
      }
      //TODO: baseMapGeojsonLayer 图层目前未实现
      const baseMapGeojsonLayer = val.layerType === "baseMapGeojsonLayer";
      Vue.ls.set("currentBaseMapSource", val);
    }
  }
}
export default mixin;
