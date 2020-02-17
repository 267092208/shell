import Vue from 'vue'
import ls from '@/utils/localStorage.js';
Vue.use(ls.Storage, ls.options);
import { currentBaseMapSource } from "@/mapTool/baseMapData.js"
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
		currentBaseMapSource: currentBaseMapSource
	},
	mutations: {

	},
	actions: {
		setCurrenBaseMapSource({ state }, val) {
			Vue.ls.set("currentBaseMapSource", val);
			state.currentBaseMapSource = val;
		}
	}
}
export default basemap;