import { Circle as CircleStyle, Fill, Stroke, Style,Text } from "ol/style";
import Icon from "ol/style/Icon";
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
function createdRenderer(renders) {
  const defaultStyle = createdSymbol(renders.defaultSymbol);
  const styles = {};
  renders.uniqueValueInfos.forEach(t => {
    styles[t.value] = createdSymbol(t.symbol);
  });
  return function(feature) { 
    if (styles[feature.get(renders.field)]) {
      return styles[feature.get(renders.field)];
    }
    return defaultStyle;
  };
}
/**
 * 创建对应的数据
 * @param {{type:'picture-marker'|'simple-Line'|'simple-fill'|'text'|'simple-Marker',[key:string]:any}} symbol
 */
function createdSymbol(symbol) {
  
  if (symbol.type === "picture-marker") {
    return new Style({ image: new Icon({ 
      src: symbol.url,
      size:[symbol.width,symbol.height],
     }) });
  } else if (symbol.type === "simple-Line") {
    return new Style({
      stroke: new Stroke({
        color: symbol.color,
        width: symbol.width
      })
    });
  } else if (symbol.type === "simple-fill") {
    //TODO:填充样式未完成
    return new Style({
      stroke: new Stroke({
        color: symbol.color,
        width: symbol.width
      }),
      fill: new Fill({
        color: symbol.color
      })
    });
  } else if (symbol.type === "text") {
  return  new Style({
      text: new Text({
        font: symbol.size || 12,
        fill: new Fill({
          color: symbol.color || "#00f"
        })
      })
    })
  } else if (symbol.type === "simple-Marker") {
    throw new Error(`目前未实现`);
  } else {
    throw new Error(`目前不支持类型是${symbol.type}要素`);
  }
}
export { geoJSONLayers, createdRenderer};
