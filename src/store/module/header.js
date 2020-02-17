const header = {
    state: {
        /**
         * 左边筛选面板的可见性
         */
        filtersPanelVisible: false,
        /**
         * 右边图层面板的可见性
         */
        layersPanelVisible: true,
        /**
         * 下面操作面板的可见性
         */
        actionsPanelVisible: false
    },
    mutations: {
        setFiltersPanel(state, visible) {
            state.filtersPanelVisible = visible
        },
        setLayersPanel(state, visible) {
            state.layersPanelVisible = visible
        },
        setActionsPane(state, visible) {
            state.actionsPanelVisible = visible
        }
    },
    actions: {

    }
}
export default header;