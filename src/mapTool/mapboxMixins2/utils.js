import { map } from "./map";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import Circle from "ol/geom/Circle";
/**
 * 后台获取到的源数据转换成openlayers适用的矢量图层元素
 * @param {*} layerSource
 */
function toVectorFeature(layerSource) {

  const { geojsonObject, features } = toGeoJSON(layerSource);
  let vectorFeature = new GeoJSON().readFeatures(
    geojsonObject
    // ,
    // {  dataProjection: "EPSG:4326", // 设定JSON数据使用的坐标系
    //   featureProjection: "EPSG:3857" // 设定当前地图使用的feature的坐标系
    // }
  );
  features.forEach(f => {
    vectorFeature.push(f);
  })

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

function toGeoJSON(sources) {
  const geojsonObject = {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "EPSG:3857"
      }
    },
    features: []
  };
  geojsonObject.features = sources
    .map(t => {
      let type = t.geometry && t.geometry.type;

      if (type === "Circle") {
        return false;
      }
      if (type === "Rectangle") {
        type = "Polygon";
      }

      if (!t.geometry) {
        return false;
      } else {
        let properties = Object.assign({ id: t.id, ...t }, t.properties);
        // t.properties
        delete properties.geometry;
        return {
          type: "Feature",
          geometry: {
            type: type,
            coordinates: tOCoordinates(t.geometry)
          },
          properties: properties
          // ...properties
        };
      }
    })
    .filter(t => t !== false && !(t instanceof Feature));
  //圆形的转换
  const circles = sources.filter(t => {
    let type = t.geometry && t.geometry.type;
    return type === "Circle";
  });
  //
  const features = circles.map(t => {
    let properties = Object.assign({ id: t.id }, t.properties);
    let geometry = t.geometry.coordinates;
    // return new Feature({
    //   geometry: new Circle(transform(geometry[0], 'EPSG:4326', 'EPSG:3857'), geometry[1]),
    //   id: t.id,
    //   properties
    // });
    let feature = new Feature()
    feature.setGeometry(new Circle(geometry[0], geometry[1]));
    feature.setProperties(properties)
    return feature
  });

  return {
    geojsonObject,
    features: features
  };
}

function tOCoordinates(geometry) {
  if (geometry.type == "Rectangle") {
    const bounds = geometry.coordinates;
    const [lt, rb] = bounds.map(t => {
      return [t[0], t[1]];
    });
    return [[lt, [rb[0], lt[1]], rb, [lt[0], rb[1]]]];
  }
  return geometry.coordinates;
}

export { getLayerOL, toVectorFeature };
