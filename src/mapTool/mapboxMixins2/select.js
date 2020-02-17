import { mapState } from "vuex";
import { map } from "./map";
import { Circle as CircleStyle, RegularShape, Stroke, Style } from "ol/style";
const mixin = {
  data() {
    return {
      singleSelectFeature: null
    };
  },
  computed: {
    ...mapState({
      selectFeatures: state => state.selectFeature.selectFeatures,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      selectMode: state => state.selectFeature.selectMode,
      symbolScaling: state => state.layer.symbolScaling,
      layerbase: state => state.layer.base
    })
  },
  methods: {
    async initSelect() {
      this.singleSelect();
      this.pointerCursor();
    },
    /**
     * 选中元素,给所选元素图标添加红框效果
     */
    singleSelect() {
      let _this = this;
      let selected = [];
      map.on("click", function(e) {
        var featureLayer = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
          return { selFeature: feature, selLayer: layer };
        });

        if (featureLayer && featureLayer.selFeature && featureLayer.selLayer) {
          let feature = featureLayer.selFeature;
          let layer = featureLayer.selLayer;

          if (layer.get("type") === "symbol") {
            return;
          }

          if (layer.get("layerType") === "searchLayer") {
            ///TODO:点击地图上经过搜索出来的结果时弹出信息框
            return;
            // _this.$store.dispatch("locationFeatures",feature)
          } else {
            let selIndex = selected.indexOf(feature);
            let newStyle = _this.createStyle(layer, feature);

            if (_this.selectMode === "single") {
              //多选变单选时，先清空多选的元素
              selected.forEach(item => {
                item.setStyle(null);
              });

              if (_this.singleSelectFeature !== feature) {
                if (_this.singleSelectFeature) {
                  _this.singleSelectFeature.setStyle(null);
                }

                feature.setStyle(newStyle);
                _this.singleSelectFeature = feature;
              } else {

                _this.singleSelectFeature = "";
                feature.setStyle(null);
              }
            }

            if (_this.selectMode === "multiple") {
              if (selIndex < 0) {
                selected.push(feature);
                feature.setStyle(newStyle);
              } else {
                selected.splice(selIndex, 1);
                feature.setStyle(null);
              }
            }

            let layerId = layer.get("layerId");
            layer = _this.layerbase.find(l => l.id === layerId);

            feature.id = feature.get("ID");
            feature.properties = feature.getProperties();
            feature.geometry = feature.getGeometry();

            _this.$store.dispatch("selectFeatureAndLayer", {
              feature,
              layer
            });
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
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? "pointer" : "";
      });
    },
    /**
     * 选中元素样式变化
     */
    createStyle(layer, feature) {
      let styleFunction = layer.getStyle();
      let oldStyle = styleFunction(feature);

      let styles = [];
      styles.push(oldStyle);
      styles.push(
        //红框样式
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
    selectFeatures(selectFeatures, oldSelectFeatures) {
      if (oldSelectFeatures && !this.selectFeatures.length) {
        oldSelectFeatures.map(feature => {
          feature.setStyle(null);
          this.singleSelectFeature = null;
        });
      }
    }
  }
};

export default mixin;
