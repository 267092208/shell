import { map } from "./map";
import GeoJSON from "ol/format/GeoJSON";

/**
 * 后台获取到的源数据转换成openlayers适用的矢量图层元素
 * @param {*} layerSource
 */
function toVectorFeature(layerSource) {
  layerSource.forEach(item => {
    item["type"] = "Feature";
  });

  let vectorFeature = new GeoJSON().readFeatures(
    {
      type: "FeatureCollection",
      features: layerSource
    },
    {
      dataProjection: "EPSG:4326", // 设定JSON数据使用的坐标系
      featureProjection: "EPSG:3857" // 设定当前地图使用的feature的坐标系
    }
  );
  return vectorFeature;
}

/**
 * 通过id获取到openlayers的指定图层
 * @param {*} id
 */
function getLayerOL(id) {
  let layerList = map.getLayers().getArray();
  let layer = layerList.find(item => {
    return item.get("id") === id || item.get("layerId") === id;
  });
  return layer;
}

export { getLayerOL,toVectorFeature };
