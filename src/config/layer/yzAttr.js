/**
 * @module 图层点击响应的事件(函数)
 * by：2020年3月12日 dyt
 */
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import store from "@/store/index.js";
import { Circle as CircleStyle, RegularShape, Stroke, Style, Fill } from "ol/style";





/**
 * 关联要素的样式
 * @param {Feature} feature
 * @param {VectorLayer} layer
 */
export function linkFeatureStyle(feature, layer,type) {
  let styles = layer.getStyle(feature);
  while (styles instanceof Function) {
    styles = styles(feature);
    
  }

  if(feature.getStyle()){
    styles = feature.getStyle()
  }
  
  let _styles = [];
  if (styles instanceof Array) {
    for (let i = 0; i < styles.length; i++) {
      const style = styles[i];
      _styles.push(style.clone());
    }
  } else {
    _styles.push(styles);
  }
  let oldStyle = _styles[0];
  const geometry = feature.getGeometry();
  const [radius] = (oldStyle.getImage() && oldStyle.getImage().getImageSize()) || [32, 32];
  if(type === "relation"){
    _styles.push(
    new Style({
      geometry: geometry,
      image: new RegularShape({
        radius: (radius / 4) * 3,
        points: 4,
        angle: Math.PI / 4,
        stroke: new Stroke({ color: "blue", width: 2 })
      })
    })
  );
  } else {
    _styles.push(
      new Style({
        geometry: geometry,
        image: new RegularShape({
          radius: (radius / 4) * 4,
          points: 4,
          angle: Math.PI / 4,
          stroke: new Stroke({ color: "green", width: 2 })
        })
      })
    );
  }
  
  return _styles;
}

const { dispatch } = store;


const relationFun = {
  /**
   * 关联油站
   * @param {Feature} feature  当前点击到的图形
   * @param {VectorLayer} layer  图形在的图层
   */
  shellyz: function(feature, layer) {
    feature.setStyle(linkFeatureStyle(feature, layer,"relation"))
    const currentFeature = store.state.selectFeature.selectFeature;
    currentFeature && dispatch("addLinkFeature", { layerId: layer.get("layerId"), feature: currentFeature, bh: feature.get("油站编号"),type:"relation" })
    
    
  }
};

relationFun["gsyz"] = relationFun["xyyz"] = relationFun["shellyz"];

const compFun = {
  /**
   * 关联油站
   * @param {Feature} feature  当前点击到的图形
   * @param {VectorLayer} layer  图形在的图层
   */
  shellyz: function(feature, layer) {
    feature.setStyle(linkFeatureStyle(feature, layer,"competitor"))
    const currentFeature = store.state.selectFeature.selectFeature;
    
    currentFeature && dispatch("addLinkFeature", { layerId: layer.get("layerId"), feature: currentFeature, bh: feature.get("油站编号"),type:"competitor" })
    
    
  }
};

compFun["gsyz"] = compFun["xyyz"] = compFun["shellyz"];



export  { compFun, relationFun };
