/**
 * @module 小地图
 */
import Vue from "vue";
import Map from "ol/Map";
import View from "ol/View";
import { defaults as defaultControls, Attribution } from "ol/control";
import ScaleLine from "ol/control/ScaleLine";
import { resolutions } from "@/mapTool/DB09TileSource.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import { Draw, Modify, Snap } from "ol/interaction";
import Overlay from "ol/Overlay";
import BaiduTileLayer from "@/mapTool/BaiduTileLayer.js";
import { baseMapRasterSource } from "@/config/map/baseMap.js";
import LayerGroup from "ol/layer/Group";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import baiduSearch from "@/data/baiduSearch";
import { toVectorFeature } from "@/mapTool/mapboxMixins2/utils.js";
import searchSources from "@/config/searchSources";
import getDom from "@/mapTool/miniMap/popupHtml.js";
const selectSource = searchSources[1];
const popupHtml = getDom();

const extent = [
  -20037508.342789244,
  -20037508.342789244,
  20037508.342789244,
  20037508.342789244
];
// 比例尺
const scaleLine = new ScaleLine();
/**
 * '百度地图'|'百度影像'
 */
const baseMapLayer = {};
//创建地图
["百度地图", "百度影像"].forEach(val => {
  baseMapLayer[val] = new LayerGroup({
    layers: baseMapRasterSource[val].map(t => {
      return new BaiduTileLayer({
        source: t.source,
        maxZoom: t.maxZoom,
        minZoom: t.minZoom
      });
    })
  });
});
/**
 * 地图视图
 * @type {View}
 */
const BaiduView = new View({
  constrainResolution: true,
  resolutions,
  maxZoom: 22,
  minZoom: 1,
  extent,
  center: [12609158.722154098, 2647747.527494556]
});
const searchSource = new VectorSource();
const searchFeatureLayer = new VectorLayer({
  source: searchSource,
  clickFu: function(feature, layer) {
    //console.log();
    const val = feature.getProperties();
    popupHtml.contentDom.innerHTML = val.getPopupHtml(val);
    popup.setPosition(feature.getGeometry().getCoordinates());
  },
  zIndex: 3,
  style: new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: "/images/search.png"
    })
  })
});
const snap = new Snap({ source: searchSource });
/**
 * 编辑点击的几何信息
 * @type {Point}
 */
let ol_editPoint = new Point([0, 0]);
/**
 *编辑图层的数据源
 * @type {VectorSource}
 */
const editGeomtrySource = new VectorSource({
  features: [new Feature(ol_editPoint)]
});

/**
 * 编辑图层
 * @type {VectorLayer}
 *
 */
const editGeometryLayer = new VectorLayer({
  source: editGeomtrySource,
  /**
   * 编辑是的样式
   */
  style: new Style({
    fill: new Fill({
      color: "rgba(51, 136, 255, 0.5)"
    }),
    stroke: new Stroke({
      color: "#3388ff",
      width: 2
    }),
    image: new Icon({
      src: "/images/add-maker.png",
      anchor: [0.5, 1]
    })
  }),
  zIndex: 100
});
/**
 * @type {Draw}
 */
// const drawPoint = new Draw({
//     stopClick: true,
//     source: editGeomtrySource,
//     type: "Point",
//     style: new Style({
//         image: new Icon({
//             src: "/images/add-maker.png",
//             anchor: [0.5, 1]
//         })
//     })
// }),
/**
 * 修改器
 * @type {Modify}
 */
const modify = new Modify({ source: editGeomtrySource, pixelTolerance: 25 });

let popup = new Overlay({
  positioning: "bottom-center",
  element: popupHtml.div,
  autoPan: true,
  autoPanAnimation: {
    duration: 10
  },
  offset: [0, -20]
});
popupHtml.closerDom.addEventListener("click", () => {
  popup.setPosition(null);
});
/**
 * 返回的对象 有搜索方法。 定位功能
 * @editPoint 不传应该默认在广州的中心点
 * 编辑功能
 * @param {{
 * target: HTMLElement | string,
 * editPoint?:[number,number]
 * }} param
 */
export default function createdMap(param) {
  const { target, editPoint = [12609158.722154098, 2647747.527494556] } = param;
  //[113.27,23.13]
  if (!target) {
    throw "target 不很为空";
  }
  // if (!editPoint) { throw "editPoint 不很为空" }
  searchSource.clear();
  ol_editPoint.setCoordinates(editPoint);
  let map = new Map({
    target,
    layers: [searchFeatureLayer, editGeometryLayer],
    // interactions: [modify, snap],
    view: BaiduView,
    // overlays: [popup]
    controls: defaultControls({
      attribution: true,
      zoom: true,
      rotate: true
    }).extend([scaleLine])
  });
  map.addOverlay(popup);
  map.addInteraction(modify);
  map.addInteraction(snap);
  BaiduView.setCenter(editPoint);
  BaiduView.setZoom(15);
  map.on("click", function(e) {
    let featureLayer = map.forEachFeatureAtPixel(e.pixel, function(
      feature,
      layer
    ) {
      return { selFeature: feature, selLayer: layer };
    });
    //
    //获取图层是否有 clickFu 事件 。触发
    if (featureLayer && featureLayer.selLayer && featureLayer.selFeature) {
      const clickFu = featureLayer.selLayer.get("clickFu");
      clickFu && clickFu(featureLayer.selFeature, featureLayer.selLayer);
    }
  });
  let cbaseMapLayer = baseMapLayer["百度地图"];
  map.addLayer(cbaseMapLayer);
  return {
    /**
     * 搜索当前地图上的内容
     * @param {string} keyword 搜索的关键词
     */
    async search(keyword) {
      searchSource.clear();
      const resultFeatures = [];
      let view = map.getView();
      const bounds = view.calculateExtent();
      const results = await baiduSearch(keyword, bounds);
      // console.log(results)
      const resultAsyncIterator = results[Symbol.asyncIterator]();
      let c = await resultAsyncIterator.next();
      if (c.done) {
        return "无内容";
      } else {
        while (!c.done) {
          const f = c.value;
          f.getPopupHtml = selectSource.getPopupHtml;
          f.source = selectSource.source;
          resultFeatures.push(f);
          c = await resultAsyncIterator.next();
        }
      }
      let searchFeature = toVectorFeature(resultFeatures);
      searchFeature.forEach(item => {
        searchSource.addFeature(item);
      });
      return {
        resultNumber: results.count,
        resultFeatures: resultFeatures
      };
    },
    /**
     * 清空搜索内容
     */
    emptySearchResult() {
      searchSource.clear();
    },
    /**
     * 设置当前地图编辑这的图标的位置
     * 会把地图的中心点坐标设置设置到此位置
     * @param {[number,number]} editPoint
     */
    setEditPoint(editPoint) {
      ol_editPoint.setCoordinates(editPoint);
      BaiduView.setCenter(editPoint);
    },
    /**
     * 获取当前地图编辑的图标的位置
     * @returns {[number,number]}
     */
    getEditPoint() {
      return ol_editPoint.getCoordinates();
    },
    /**
     * 切换地图 目前支持两种
     * @param {'百度地图'|'百度影像'} sourceKey
     */
    switchBaseMap(sourceKey) {
      map.removeLayer(cbaseMapLayer);
      cbaseMapLayer = baseMapLayer[sourceKey];
      map.addLayer(baseMapLayer[sourceKey]);
    }
  };
}
