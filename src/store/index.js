import Vue from 'vue'
import Vuex from 'vuex'
import header from './module/header';
import leftSidebar from './module/leftSidebar';
import user from './module/user';
import panel from './module/panel';
import basemap from './module/basemap';
import layer from './module/layer';
import selectFeature from './module/selectFeature'
import mapState from './module/mapState'
import search from './module/search'
import geometry from './module/geometry'

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        header,
        leftSidebar,
        user,
        panel,
        basemap,
        layer,
        selectFeature,
        mapState,
        search,
        geometry
    }
});