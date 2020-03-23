import axios from "@/assets/js/axios";
import layerConfig from "@/config/layer";
import linkData from "@/data/linkFeature";
import Vue from "vue";

const linkFeature = {
  state: {
    /**
     * 当前选中的要素的关联要素集合
     * @type {[id:string]:Array<{id,geometry,properties}>}
     */
    relationFeatures: {},
    /**
     * 当前选中的要素的竞争要素集合
     * @type {[id:string]:Array<{id,geometry,properties}>}
     */
    competitorFeatures: {},
    /**
     * 添加关联要素的状态
     * @type {Boolean}
     */
    addLinkStatus: false
  },
  mutations: {},
  actions: {
    async initlinkFeatures(context, param) {
      const { featureId, layerId } = param;
      const state = context.state;
      const linkFeatures = await linkData.getRelations(layerId, { id: featureId });
      console.log("linkFeatures", linkFeatures);

      state.relationFeatures[featureId] = linkFeatures;
    },

    async setlinkFeatures(context, param) {},

    async setAddLinkStatus(context, param) {
      context.state.addLinkStatus = param;
    },

    async delLinkFeatures(context, param) {
      const { layerId, feature, delFeatures } = param;

      await linkData.removeRelation(layerId, feature, delFeatures);

      context.state.relationFeatures[feature.id] = await linkData.getRelations(layerId, { id: feature.id });
      return context.state.relationFeatures[feature.id]
    }
  }
};
export default linkFeature;
