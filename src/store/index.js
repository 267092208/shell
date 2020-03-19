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
import editGeometry from './module/editGeometry'
import table from './module/table'
import measure from './module/measure'
import popup from './module/popup'
import featureHelp from './module/featureHelp'
import linkFeature from './module/linkFeature'

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
        editGeometry,
        table,
        measure,
        popup,
        featureHelp,
        linkFeature
    }
});