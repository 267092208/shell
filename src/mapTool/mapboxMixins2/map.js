import Vue from "vue";
import Map from "ol/Map";
import "ol/ol.css";
import View from "ol/View";
import { defaults as defaultControls, Attribution } from "ol/control";
import ScaleLine from "ol/control/ScaleLine";

// 位置请使用类名修改位置
const attribution = new Attribution({
  collapsible: false,
  className: "ol-attribution"
});
// 比例尺
const scaleLine = new ScaleLine();

export var map;
const mixin = {
  methods: {
    /**
     * 初始化地图
     */
    async initMap() {
      if (map) throw "map 已经初始化过";
      map = new Map({
        target: this.$refs.mapbox,
        controls: defaultControls({
          attribution: false,
          zoom: false,
          rotate: false
        }).extend([attribution, scaleLine]),
        view: new View({
          ...this.getMapState(),
          projection: "EPSG:3857",
          maxZoom: 18,
          minZoom: 1,
          constrainResolution:true
        }),
        layers: []
      });
      this.initMapStateSave();
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
