const search = {
    state: {
        /**
         * 显示到地图上的搜索结果数据
         *  @type {Array<{geometry,properties}>}
         */
        resultFeatures: [],
        /**
         * 定位的数据标注
         */
        locationFeatures: null
    },
    mutations: {

    },
    actions: {
        /**
        * 设置地图显示的搜索结果
        * @param {*} context 
        * @param {Array<{geometry,properties}>} geometrys
        */
        setSearchFeature(context, resultFeatures) {
            const state = context.state;
            state.resultFeatures = resultFeatures
        },
        locationFeatures(context, locationFeatures) {
            const state = context.state;
            state.locationFeatures = locationFeatures
        }
    }
}
export default search;