import { Circle as CircleStyle, RegularShape, Fill, Stroke, Style, Text } from "ol/style";
import Circle from "ol/geom/Circle";
import { circular } from "ol/geom/Polygon";
import Icon from "ol/style/Icon";
import { map } from "./mapboxMixins2/map";
import { hexToRgba, rgbaToHex } from "@/utils/hexRgba.js";

/**
 * 图层控制器
 * */
/**
 * 各个图层的数据
 * 图层id：创建的map.geoJSONLayer()传的实例
 * @type {{<layerId:map.geoJSONLayer()>}  }
 */
let geoJSONLayers = {};

/**
 * 图层渲染器的创建
 * @param {*} renders
 */
function createdRenderer(renders, extRender) {
  return function(feature) {
    let render = renders;
    if (renders.layerType === "Composite") {
      render = renders.render(feature.get("数据源图层ID"));
    }

    //   简单渲染器
    if (!Array.isArray(render)) {
      return createStyle(render, extRender, feature);
    } else {
      let styleList = [];
      render.forEach(t => {
        let style = createStyle(t, extRender, feature);
        styleList.push(style);
      });

      return styleList;
    }
  };
}
/**
 * 创建对应的数据
 * @param {{type:'picture-marker'|'simple-Line'|'simple-fill'|'text'|'simple-Marker',[key:string]:any}} symbol
 */
function createdSymbol(symbol, extRender, feature) {
  if (symbol.type === "picture-marker") {
    return new Style({
      image: new Icon({
        src: symbol.url,
        size: [symbol.width, symbol.height],
        scale: (extRender && extRender.scal) || 1,
        anchor: (extRender && extRender.anchor) || [0.5, 0.5]
        //TODO：偏移没做
        // anchor:symbol.xoffset && symbol.yoffset ?[symbol.xoffset/10,symbol.yoffset/10]:[0.5,0.5],
      })
    });
  } else if (symbol.type === "simple-Line") {
    return new Style({
      stroke: new Stroke({
        color: hexToRgba(symbol.strokeColor, symbol.strokeOpacity),
        width: symbol.strokeWeight,
        lineDash: symbol.strokeStyle === "虚线" ? [10] : null
      })
    });
  } else if (symbol.type === "simple-fill") {
    return new Style({
      stroke: new Stroke({
        color: symbol.strokeColor,
        width: symbol.strokeWeight,
        lineDash: symbol.strokeStyle === "虚线" ? [4] : null
      }),
      fill: new Fill({
        color: typeof symbol.fillColor === "function" ? hexToRgba(symbol.fillColor(feature), symbol.fillOpacity) : hexToRgba(symbol.fillColor, symbol.fillOpacity)
      })
    });
  } else if (symbol.type === "text") {
    return new Style({
      text: new Text({
        font: symbol.size || 12,
        fill: new Fill({
          color: symbol.color || "#00f"
        }),
        text: feature.get(symbol.field).toString(),
        offsetX: (extRender && extRender.offsetX) || symbol.offsetX || 0,
        offsetY: (extRender && extRender.offsetY) || symbol.offsetY || 0,
        textAlign: (extRender && extRender.textAlign) || symbol.textAlign,
        backgroundFill:
          symbol.backgroundFillColor &&
          new Fill({
            color: symbol.backgroundFillColor
          }),
        backgroundStroke:
          symbol.strokeColor &&
          new Stroke({
            color: symbol.strokeColor
          }),
        padding: symbol.padding
      })
    });
  } else if (symbol.type === "simple-Marker") {
    if (symbol.shape && symbol.shape === "circle") {
      return new Style({
        stroke: new Stroke({
          color: symbol.strokeColor,
          width: symbol.strokeWeight,
          lineDash: symbol.strokeStyle === "虚线" ? [4] : null
        }),
        fill: new Fill({
          color: typeof symbol.fillColor === "function" ? hexToRgba(symbol.fillColor(feature), symbol.fillOpacity) : hexToRgba(symbol.fillColor, symbol.fillOpacity)
        }),
        geometry: function(feature) {
          var coordinates = feature.getGeometry().getCoordinates();

          return new Circle(coordinates, symbol.radius);
        }
      });
    }
  } else {
    throw new Error(`目前不支持类型是${symbol.type}要素`);
  }
}

/**
 * 渲染器转换为样式
 */

function createStyle(render, extRender, feature) {
  const styles = {};

  render.uniqueValueInfos &&
    render.uniqueValueInfos.forEach(t => {
      styles[t.value] = createdSymbol(t.symbol, extRender, feature);
    });

  const classBreakStyles = [];
  render.classBreakInfos &&
    render.classBreakInfos.forEach(t => {
      classBreakStyles.push({
        minValue: t.minValue,
        maxValue: t.maxValue,
        style: createdSymbol(t.symbol, extRender)
      });
    });

  const defaultStyle = createdSymbol(render.defaultSymbol, extRender, feature);

  const value = feature.get(render.field);

  if (styles[value]) {
    return styles[value];
  }

  if (render.classBreakInfos) {
    for (let i = 0; i < classBreakStyles.length; i++) {
      const style = classBreakStyles[i];
      if (style.minValue <= value && value < style.maxValue) {
        if(value == 4161){
          console.log(style.style);

        }
        
        return style.style;
      }
    }
  }
  return defaultStyle;
}

export { geoJSONLayers, createdRenderer };
