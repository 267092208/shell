/**
 * @module 样式管理,图层管理
 * */
import {
  Circle as CircleStyle,
  RegularShape,
  Fill,
  Stroke,
  Style,
  Text
} from "ol/style";
import Circle from "ol/geom/Circle";
import Icon from "ol/style/Icon";
import { hexToRgba, rgbaToHex } from "@/utils/hexRgba.js";
import Feature from "ol/Feature";

/***
 * 创建图标样式
 * @type {{[type:string]:
 * (
 * symbol:{ type:'picture-marker'|'simple-Line'|'simple-fill'|'text'|'simple-Marker',[key:string]:any},
 * extRender:{scale:number,anchor:[number,number]}
 * )=>((feature:Feature)=>Style)|Style}
 */
const symbolConverter = {
  "picture-marker": function(symbol, extRender) {
    if (symbol.anchor == "center") {
      symbol.anchor = [0.5, 0.5];
    }
    extRender = {
      scale: symbol.scale || 1,
      anchor: symbol.anchor || [0.5, 0.5],
      ...extRender
    };
    return new Style({
      image: new Icon({
        src: symbol.url,
        // imgSize: [symbol.width, symbol.height],
        // size: [symbol.width, symbol.height],
        ...extRender,
        opacity: symbol.opacity || 1
      })
    });
  },
  "simple-Line": function(symbol) {
    return new Style({
      stroke: new Stroke({
        color: hexToRgba(symbol.strokeColor, symbol.strokeOpacity),
        width: symbol.strokeWeight,
        lineDash: symbol.strokeStyle === "虚线" ? [10] : null
      })
    });
  },
  "simple-fill": function(symbol) {
    const stroke = new Stroke({
      color: symbol.strokeColor,
      width: symbol.strokeWeight,
      lineDash: symbol.strokeStyle === "虚线" ? [4] : null
    });
    return function(feature) {
      return new Style({
        stroke: stroke,
        fill: new Fill({
          color:
            typeof symbol.fillColor === "function"
              ? hexToRgba(symbol.fillColor(feature), symbol.fillOpacity)
              : hexToRgba(symbol.fillColor, symbol.fillOpacity)
        })
      });
    };
  },
  text: function(symbol, extRender) {
    const fill = new Fill({
      color: symbol.color || "#00f"
    });
    const backgroundStroke =
      symbol.strokeColor &&
      new Stroke({
        color: symbol.strokeColor
      });
    const backgroundFill =
      symbol.backgroundFillColor &&
      new Fill({
        color: symbol.backgroundFillColor
      });
    extRender = { textAlign: "left", ...extRender };
    return function(feature) {
      if (!symbol.size) symbol.size = 12;
      return new Style({
        zIndex: 10,
        text: new Text({
          font: symbol.size + 'px "sans-serif","Open Sans", "Arial Unicode MS"',
          fill,
          text: feature.get(symbol.field).toString(),
          backgroundStroke,
          padding: symbol.padding,
          backgroundFill,
          ...extRender
        })
      });
    };
  },
  /**
   * 标志圆
   * @param {*} symbol
   */
  "simple-Marker": function(symbol) {
    if (symbol.shape && symbol.shape === "circle") {
      const stroke = new Stroke({
        color: symbol.strokeColor,
        width: symbol.strokeWeight,
        lineDash: symbol.strokeStyle === "虚线" ? [4] : null
      });
      const radius = symbol.radius;
      return function(feature) {
        return new Style({
          stroke,
          fill: new Fill({
            color:
              typeof symbol.fillColor === "function"
                ? hexToRgba(symbol.fillColor(feature), symbol.fillOpacity)
                : hexToRgba(symbol.fillColor, symbol.fillOpacity)
          }),
          geometry: function() {
            var coordinates = feature.getGeometry().getCoordinates();
            return new Circle(coordinates, radius);
          }
        });
      };
    }
  }
};
/**
 * 样式转换器
 * @type {{[key:string]:(render:[])=>Style[]}
 */
const converterStyle = {
  "class-break": function(render, extRender) {
    //TODO:无考虑
    const styles = [];
    const renderType = render.type;
    const defaultStyle = symbolConverter[render.defaultSymbol.type](
      render.defaultSymbol,
      extRender
    );
    // defaultStyle
    renderType &&
      render[renderType].forEach(t => {
        const { type } = t.symbol;
        styles.push({
          minValue: t.minValue,
          maxValue: t.maxValue,
          style: symbolConverter[type](t.symbol, extRender)
        });
      });
    return function(feature) {
      const value = feature.get(render.field);
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        if (style.minValue <= value && style.maxValue > value) {
          return style.style;
        }
      }
      return defaultStyle;
    };
  },
  "unique-value": function(render, extRender) {
    /**
     * value
     * @type {[key:string]:Style}
     */
    const styles = {};
    const renderType = render.type;
    const defaultStyle = symbolConverter[render.defaultSymbol.type](
      render.defaultSymbol,
      extRender
    );
    const kong = Symbol("kong");
    // defaultStyle
    render[renderType].forEach(t => {
      const { type } = t.symbol;
      if (t.value === "") {
        styles[kong] = symbolConverter[type](t.symbol, extRender);
      } else {
        styles[t.value] = symbolConverter[type](t.symbol, extRender);
      }
    });
    return function(feature) {
      const value = feature.get(render.field);
      if (value === "" && styles[kong]) {
        return styles[kong];
      } else if (styles[value]) {
        return styles[value];
      } else {
        return defaultStyle;
      }
    };
  },
  simple: function(render, extRender) {
    const defaultStyle = symbolConverter[render.defaultSymbol.type](
      render.defaultSymbol,
      extRender
    );
    return defaultStyle;
  }
};
/**
 * /**
 * 图层渲染器的创建
 * @param {*} renders 显示的样式规则
 * @param {*} extRender  样式一些设置
 * @returns {(feature:Feature)=>Style[]}
 */
function createdRenderer(renders, extRender) {
  /**
   * @type {Style[]}
   */
  let styles = [];
  /**
   * @type {{[layerId:string]:Style[]}}
   */
  let compositeStyles = {};

  if (renders && renders.layerType === "Composite") {
    //
  } else {
    if (Array.isArray(renders)) {
      styles.push(
        ...renders.map(render => converterStyle[render.type](render, extRender))
      );
    } else {
      const renderType = renders.type;
      styles.push(converterStyle[renderType](renders, extRender));
    }
  }
  return function(feature) {
    if (renders && renders.layerType === "Composite") {
      const layerId = feature.get("数据源图层ID");
      if (!compositeStyles[layerId]) {
        const compositeRenders = renders.render(layerId);
        compositeStyles[layerId] = compositeRenders.map(compositeRender => {
          const renderType = compositeRender.type;
          return converterStyle[renderType](compositeRender, extRender);
        });
      }
      styles = compositeStyles[layerId];
    }
    const featureStyles = styles.map((style, index) => {
      let returnStyle = style;
      while (returnStyle instanceof Function) {
        returnStyle = returnStyle(feature);
      }
      returnStyle.setZIndex(index);
      return returnStyle;
    });
    return featureStyles;
  };
}
export { createdRenderer };
