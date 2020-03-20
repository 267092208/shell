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
    competitorFeatures: {}
  },
  mutations: {},
  actions: {
    async initlinkFeatures(context, param) {
      const { featureId, layerId } = param;
      const state = context.state;
      const linkFeatures = await linkData.getRelations(layerId, { id: featureId });
      console.log("linkFeatures", linkFeatures);

      state.relationFeatures[featureId] = linkFeatures;

      
    }
  }
};
export default linkFeature;
