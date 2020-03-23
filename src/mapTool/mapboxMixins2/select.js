import { mapState } from "vuex";
import { map } from "./map";
import { Circle as CircleStyle, RegularShape, Stroke, Style, Fill } from "ol/style";
import { getLayerOL } from "./utils";

const mixin = {
  data() {
    return {
      singleSelectFeature: null,
      selecteAllFeatures: []
    };
  },
  computed: {
    ...mapState({
      selectFeatures: state => state.selectFeature.selectFeatures,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      selectMode: state => state.selectFeature.selectMode,
      selectAll: state => state.selectFeature.selectAll,
      symbolScaling: state => state.layer.symbolScaling,
      layerbase: state => state.layer.base,
      drawMode: state => state.editGeometry.drawMode,
      addRelationStatus: state => state.linkFeature.addRelationStatus,
      addCompStatus: state => state.linkFeature.addCompStatus
    })
  },
  methods: {
    async initSelect() {
      this.singleSelect();
      this.pointerCursor();
    },
    /**
     * 选中元素
     */
    singleSelect() {
      let _this = this;
      let selected = [];
      // 绑定事件
      map.on("click", e => {
        // 编辑中不会选中
        if (this.drawMode) {
          return;
        }
        let featureLayer = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
          return { selFeature: feature, selLayer: layer };
        });
        //

        //获取图层是否有 clickFu 事件 。触发
        if (featureLayer && featureLayer.selLayer && featureLayer.selFeature) {
          const clickFu = featureLayer.selLayer.get("clickFu");
          const relationFun = featureLayer.selLayer.get("relationFun");
          const compFun = featureLayer.selLayer.get("compFun");

          if (this.addRelationStatus && relationFun) {
            relationFun(featureLayer.selFeature, featureLayer.selLayer);
          } else if (this.addCompStatus && compFun) {
            
            compFun(featureLayer.selFeature, featureLayer.selLayer);
          } else {
            clickFu && clickFu(featureLayer.selFeature, featureLayer.selLayer);
          }
        }
      });
    },
    /**
     * 鼠标形状变化
     */
    pointerCursor() {
      map.on("pointermove", function(e) {
        if (e.dragging) {
          return;
        }
        let pixel = map.getEventPixel(e.originalEvent);
        let hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? "pointer" : "";
        let feature = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
          return feature;
        });
        if (feature && feature.getGeometry().getType() === "Point") {
          let text = feature.getProperties()["油站编号"] || feature.getProperties()["站名"] || feature.getProperties()["名称"] || feature.getProperties()["name"];
          map.getTarget().title = hit ? (text ? text : "") : "";
        }
      });
    },
    /**
     * 选中元素样式变化
     */
    createStyle(layer, feature) {
      let styleFunction = layer.getStyle();
      let oldStyle = styleFunction(feature);
      oldStyle = Array.isArray(oldStyle) ? oldStyle : [oldStyle];

      let styles = [];
      styles.push(...oldStyle);

      // styles.push(oldStyle)
      //面图层选中样式
      if (this.selectFeatureLayer && (this.selectFeatureLayer.id === "ma" || this.selectFeatureLayer.id === "xzqh")) {
        styles.push(
          new Style({
            fill: new Fill({
              color: [28, 134, 238, 0.4]
            })
          })
        );
        return styles;
      }
      //点图层选中样式
      styles.push(
        new Style({
          geometry: feature.getGeometry(),
          image: new RegularShape({
            radius: 15,
            points: 4,
            angle: Math.PI / 4,
            stroke: new Stroke({ color: "red", width: 2 })
          })
        })
      );

      return styles;
    }
  },
  watch: {
    // selectFeatures(selectFeatures, oldSelectFeatures) {
    //   if (oldSelectFeatures && !this.selectFeatures.length) {
    //     oldSelectFeatures.map(feature => {
    //       feature.setStyle(null);
    //       this.singleSelectFeature = null;
    //     });
    //   }
    // },
    selectAll(selectAll) {
      for (const layerid in selectAll) {
        this.selecteAllFeatures = [];
        let layer = getLayerOL(layerid);
        //如果该图层设置为全选，则该图层所有要素的样式添加选中样式
        if (layer && selectAll[layerid]) {
          layer
            .getSource()
            .getFeatures()
            .forEach(f => {
              f.setStyle(this.createStyle(layer, f));
              f.changed();
              this.selecteAllFeatures.push(f);
            });
        }
        //如果该图层设置为非全选，则该图层所有要素的样式取消选中样式

        if (layer && !selectAll[layerid]) {
          this.selecteAllFeatures = [];
          layer
            .getSource()
            .getFeatures()
            .forEach(f => {
              f.setStyle(null);
              f.changed();
            });
        }

        this.$store.dispatch("selectAllFeaturesAndLayer", {
          features: this.selecteAllFeatures,
          layer: layerid
        });
      }
    }
  }
};

export default mixin;
