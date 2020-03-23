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
      const features = layer.getSource().getFeatures();
      const selectFeatureId = this.selectFeature.get("id");
      let feature
      if (type === "relation") {
        for (let i = 0; i < features.length; i++) {
          if (this.relationFeatures && index === this.relationFeatures.length) {
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
          } else {
            feature.setStyle(null);
          }
        }
      }

      if (type === "competitor") {
        for (let i = 0; i < features.length; i++) {
          if (this.competitorFeatures && index === this.competitorFeatures.length) {
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
