const linkFeature = {
  state: {
    /**
     * 当前选中的要素的关联要素集合
     * @type {Array<{id,geometry,properties}>}
     */
    relationFeatures: [],
    /**
     * 当前选中的要素的竞争要素集合
     * @type {Array<{id,geometry,properties}>}
     */
    competitorFeatures: [],
  },
  mutations: {
    initlinkFeatures(state, visible) {
      state.filtersPanelVisible = visible;
    },
    setLayersPanel(state, visible) {
      state.layersPanelVisible = visible;
    },
    setActionsPane(state, visible) {
      state.actionsPanelVisible = visible;
    }
  },
  actions: {}
};
export default linkFeature;
