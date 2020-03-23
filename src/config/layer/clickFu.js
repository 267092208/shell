/**
 * @module 图层点击响应的事件(函数)
 * by：2020年3月12日 dyt
 */
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import store from "@/store/index.js";
import { hexToRgba, rgbaToHex } from "@/utils/hexRgba.js";
import { Circle as CircleStyle, RegularShape, Stroke, Style, Fill } from "ol/style";
/**
 * 选中的样式
 * @param {Feature} feature
 * @param {VectorLayer} layer
 */
export function selectPointStyle(feature, layer) {
  let styles = layer.getStyle(feature);
  while (styles instanceof Function) {
    styles = styles(feature);
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
  _styles.push(
    new Style({
      geometry: geometry,
      image: new RegularShape({
        radius: (radius / 4) * 3,
        points: 4,
        angle: Math.PI / 4,
        stroke: new Stroke({ color: "red", width: 2 })
      })
    })
  );
  return _styles;
}

/**
 * 线面的选中
 * @param {Feature} feature
 * @param {VectorLayer} layer
 */
export function selectLineFillStyle(feature, layer) {
  const selectPointerMoveStyle = new Style({
    fill: new Fill({ color: "rgba(74,94,216)" }),
    stroke: new Stroke({ color: "rgba(28,134,238)", width: 1 })
  });
  if (layer) {
    let style = layer.getStyle(feature);
    while (style instanceof Function) {
      style = style(feature);
    }
    selectPointerMoveStyle.setText(null);
    if (style instanceof Array) {
      style.forEach(t => {
        if (t.getText()) {
          selectPointerMoveStyle.setText(t.getText().clone());
        }
      });
      style = style[0];
    } else {
      style.getText() && selectPointerMoveStyle.setText(style.getText().clone());
    }
    const width = style.getStroke().getWidth();
    const fillColor = style.getFill() && style.getFill().getColor();
    selectPointerMoveStyle.getStroke().setWidth(width + 1);
    fillColor && selectPointerMoveStyle.getFill().setColor(hexToRgba("#4A5ED8", rgbaToHex(fillColor).opacity));
  }
  return selectPointerMoveStyle;
}

/**
 * 选中的样式
 *  @param {Feature} feature
 * @param {VectorLayer} layer
 */
function selectStyle(feature, layer) {
  if (feature.getGeometry().getType() !== "Point") {
    // 线和面的选择样式的选择
    return selectLineFillStyle(feature, layer);
  } else if (feature.getGeometry().getType() === "Point") {
    return selectPointStyle(feature, layer);
  }
}


const { dispatch } = store;
/**
 * 当前选择的模式
 * @type {"multiple"|"single"}
 */
// const selectMode = store.state.selectFeature.selectMode;
// const layersbase = store.state.layer.base;
/**
 * 地图上选中的图形
 */
let selected = [];
/**
 * 当前选中的图形
 * @type { Feature}
 */
let singleSelectFeature = null;
/**
 * @type {{[layerId:string]:(feature: Feature<Geometry>, layer: VectorLayer) => void}}
 */
const clickFu = {
  /**
   * 油站的点击事件
   * @param {Feature} feature  当前点击到的图形
   * @param {VectorLayer} layer  图形在的图层
   */
  xyyz: function(feature, layer) {
    let layerId = layer.get("layerId");
    const layersbase = store.state.layer.base;
    const selectMode = store.state.selectFeature.selectMode;
    let layerbase = layersbase.find(l => l.id === layerId);
    feature.id = feature.get("ID");
    feature.properties = feature.getProperties();
    feature.geometry = feature.getGeometry();

    dispatch("selectFeatureAndLayer", {
      feature,
      layer: layerbase
    });
    let selIndex = selected.indexOf(feature);
    let newStyle = selectStyle(feature, layer);
    if (selectMode === "single") {
      //多选变单选时，先清空多选的元素
      selected.forEach(item => {
        item.setStyle(null);
      });
      if (singleSelectFeature !== feature) {
        singleSelectFeature && singleSelectFeature.setStyle(null);
        feature.setStyle(newStyle);
        singleSelectFeature = feature;
      } else {
        singleSelectFeature = null;
        feature.setStyle(null);
      }
    } else if (selectMode === "multiple") {
      if (selIndex < 0) {
        selected.push(feature);
        feature.setStyle(newStyle);
      } else {
        selected.splice(selIndex, 1);
        feature.setStyle(null);
      }
    }
  },
  /**
   * 搜索图层
   * @param {Feature} feature  当前点击到的图形
   * @param {VectorLayer} layer  图形在的图层
   */
  searchLayer: function(feature, layer) {
    let position = feature.getGeometry().getCoordinates();
    const val = feature.getProperties();
    feature.id = feature.get("ID");
    feature.properties = feature.getProperties();
    feature.geometry = feature.getGeometry();
    const layersbase = store.state.layer.base;
    let layerbase = layersbase.find(l => val.source && val.source.layerids && val.source.layerids.includes(l.id));
    layerbase &&
      dispatch("selectFeatureAndLayer", {
        feature,
        layer: layerbase
      });
    dispatch("openPopup", {
      position: position,
      popupContent: val.getPopupHtml(val),
      isPopupcloser: true,
      move: [0, -30]
    });
  }
};

/**
 * 事件响应相同
 */
const fus = ["shellyz", "gsyz", "nti", "gsnti", "target", "ma", "xzqh", "sq", "poi", "poigroups", "corridor", "roadnetwork", "lsd", "scyk", "lpglng", "xl"];
fus.forEach(t => {
  clickFu[t] = clickFu["xyyz"];
});


// 监听选中元素的改变
import("@/store").then(m => {
  const store = m.default;
  store.watch(
    () => store.state.selectFeature.selectFeature,
    (newval, oldval) => {
      if (!newval && singleSelectFeature) {
        singleSelectFeature.setStyle(null);
        singleSelectFeature = null;
      }
    }
  );
});


export  default  clickFu
