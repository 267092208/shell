import Vue from "vue";
import ls from "@/utils/localStorage.js";
Vue.use(ls.Storage, ls.options);
import { baseMapSourceList } from "@/config/map/baseMap.js";
const basemap = {
  state: {
    /**
     * 当前地图数据源
     * @type {{
     * name:string,
     * sourceKey:string,
     * src:string,
     * type:'baseMapRasterSource'|'baseMapGeojsonSource'
     * }}
     */
    currentBaseMapSource:
      Vue.ls.get("currentBaseMapSource") || baseMapSourceList[3]
  },
  mutations: {},
  actions: {
    setCurrenBaseMapSource({ state }, val) {
      Vue.ls.set("currentBaseMapSource", val);
      state.currentBaseMapSource = val;
    }
  }
};
export default basemap;
