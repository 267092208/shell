import { mapState } from "vuex";
import { getLayerOL } from "./utils";
import { linkFeatureStyle } from "@/config/layer/yzAttr";

const mixin = {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      relationFeatures: state => state.linkFeature.relationFeatures,
      competitorFeatures: state => state.linkFeature.competitorFeatures,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      selectFeatures: state => state.selectFeature.selectFeatures
    })
  },
  methods: {
    //关联要素样式设置
    async updateRelationFeatures(type) {
      const layer = getLayerOL(this.selectFeatureLayer.id);
      let index = 0;
      
      let targetIndex = (this.competitorFeatures && this.competitorFeatures.length) + (this.relationFeatures && this.relationFeatures.length);
      console.log("targetIndex",targetIndex);
      
      const features = layer.getSource().getFeatures();
      const selectFeatureId = this.selectFeature.get("id");
      let feature;
      if (type === "relation") {
        for (let i = 0; i < features.length; i++) {
          if (index === targetIndex) {
            return;
          }
          feature = features[i];

          if (selectFeatureId === feature.get("id")) {
            continue;
          }

          if (
            this.relationFeatures &&
            this.relationFeatures.find(r => {
              return r.id === feature.get("id");
            })
          ) {
            feature.setStyle(linkFeatureStyle(feature, layer, "relation"));
            index++;
          } else if (
            this.competitorFeatures &&
            this.competitorFeatures.find(r => {
              return r.id === feature.get("id");
            })
          ) {
            feature.setStyle(linkFeatureStyle(feature, layer, "competitor"));
            index++;
          } else {
            feature.setStyle(null);
          }
        }
      }

      if (type === "competitor") {
        for (let i = 0; i < features.length; i++) {
          if (index === targetIndex) {
            return;
          }
          feature = features[i];

          if (selectFeatureId === feature.get("id")) {
            continue;
          }

          if (
            this.competitorFeatures &&
            this.competitorFeatures.find(r => {
              return r.id === feature.get("id");
            })
          ) {
            feature.setStyle(linkFeatureStyle(feature, layer, "competitor"));
            index++;
          } else if (
            this.relationFeatures &&
            this.relationFeatures.find(r => {
              return r.id === feature.get("id");
            })
          ) {
            feature.setStyle(linkFeatureStyle(feature, layer, "relation"));
            index++;
          } else {
            feature.setStyle(null);
          }
        }
      }
    }
  },
  watch: {
    relationFeatures() {
      this.updateRelationFeatures("relation");
    },
    competitorFeatures() {
      this.updateRelationFeatures("competitor");
    }
  }
};

export default mixin;
