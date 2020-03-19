import Vue from "vue";
import Map from "ol/Map";
import "ol/ol.css";
import View from "ol/View";
import { defaults as defaultControls, Attribution } from "ol/control";
import ScaleLine from "ol/control/ScaleLine";
import { resolutions } from "@/mapTool/DB09TileSource.js"
const extent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244]

// 位置请使用类名修改位置
const attribution = new Attribution({
  collapsible: false,
  className: "ol-attribution"
});
// 比例尺
const scaleLine = new ScaleLine();
/**
 * @type {Map}
 */
export var map;
/** 
 * @type {View}
 */
export const BaiduView = new View({
  constrainResolution: true,
  resolutions,
  maxZoom: 22,
  minZoom: 1,
  extent
})
/**
 * @type {View}
 */
export const GCJ02View = new View({
  maxZoom: 22,
  minZoom: 1,
  constrainResolution: true,
  extent
});

const mixin = {
  methods: {
    /**
     * 初始化地图
     */
    async initMap() {
      return new Promise(r => {
        this.$refs.mapbox.innerHTML = "";
        GCJ02View.animate({ ...this.getMapState(), duration: 600 });
        map = new Map({
          layers: [],
          controls: defaultControls({ attribution: false, zoom: false, rotate: false, }).extend([attribution, scaleLine]),
          target: this.$refs.mapbox,
          view: GCJ02View
        });
        map.once("rendercomplete", y => {
          console.log("%c map", "color:red", map);
          r()
        })
        this.initMapStateSave()
      })
    },
    /**
     * 保存地图的状态
     */
    initMapStateSave() {
      window.addEventListener("beforeunload", () => {
        const view = map.getView();
        Vue.ls.set("currentZoom", parseInt(view.getZoom()));
        Vue.ls.set("currentCenter", view.getCenter());
      });
    },
    /**
     * 获取地图的状态
     */
    getMapState() {
      const center = Vue.ls.get("currentCenter") || [
        12613342.3693412,
        2645106.0957381846
      ];
      const zoom = Vue.ls.get("currentZoom") || 8;
      return { center, zoom };
    }
  }
};

export default mixin;
