import axios from "@/assets/js/axios";
import layerConfig from "@/config/layer";
import linkData from "@/data/linkFeature";
import Vue from "vue";

const linkFeature = {
  state: {
    /**
     * 当前选中的要素的关联要素集合
     * @type {Array<{id,geometry,properties}}
     */
    relationFeatures: [],
    /**
     * 当前选中的要素的关联要素集合
     * @type {Array<{id,geometry,properties}}
     */
    competitorFeatures: [],
    /**
     * 添加关联要素的状态
     * @type {Boolean}
     */
    addRelationStatus: false,
    /**
     * 添加竞争要素的状态
     * @type {Boolean}
     */
    addCompStatus: false
  },
  mutations: {},
  actions: {
    async initlinkFeatures(context, param) {
      const { featureId, layerId, type } = param;
      const state = context.state;
      if (type === "relation") {
        const linkFeatures = await linkData.getRelations(layerId, { id: featureId, type });
        state.relationFeatures = linkFeatures;
      }

      if (type === "competitor") {
        const compFeatures = await linkData.getRelations(layerId, { id: featureId, type });
        state.competitorFeatures = compFeatures;
      }
    },
    /**
     * 清空关联要素
     * @param {*} context
     */
    async clearLinkFeatures(context, param) {
      if (param === "relation") {
        context.state.relationFeatures = null;
      }

      if (param === "competitor") {
        context.state.competitorFeatures = null;
      }
    },

    async setaddLinkStatus(context, param) {
      const { status, type } = param;
      if (type === "relation") {
        context.state.addRelationStatus = status;
      }

      if (type === "competitor") {
        context.state.addCompStatus = status;
      }
    },

    /**
     * 添加关联要素
     * @param {*} context
     * @param {{layerId, feature, bh}} param
     */
    async addLinkFeature(context, param) {
      const { layerId, feature, bh, type } = param;
      if (type === "relation") {
        await linkData.addRelation(layerId, feature, bh, type);

        context.state.relationFeatures = await linkData.getRelations(layerId, { id: feature.id, type });

        return context.state.relationFeatures;
      }

      if (type === "competitor") {
        await linkData.addRelation(layerId, feature, bh, type);

        context.state.competitorFeatures = await linkData.getRelations(layerId, { id: feature.id, type });
        // context.state.relationFeatures = Object.assign({},context.state.relationFeatures)

        return context.state.competitorFeatures;
      }
    },
    /**
     * 删除关联要素
     * @param {*} context
     * @param {{layerId, feature, delFeatures}} param
     */
    async delLinkFeatures(context, param) {
      const { layerId, feature, delFeatures, type } = param;
      if (type === "relation") {
        await linkData.removeRelation(layerId, feature, delFeatures, type);

        context.state.relationFeatures = await linkData.getRelations(layerId, { id: feature.id, type });
        return context.state.relationFeatures;
      }

      if (type === "competitor") {
        await linkData.removeRelation(layerId, feature, delFeatures, type);

        context.state.competitorFeatures = await linkData.getRelations(layerId, { id: feature.id, type });

        return context.state.competitorFeatures;
      }
    }
  }
};
export default linkFeature;
