import { mapState } from "vuex";
import { map } from "./map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Text, Fill, Circle as CircleStyle, Style } from "ol/style";
import { createdRenderer } from "../layerManager.js";
import { getLayerOL } from "./utils";

/// TODO:扩展图层目前仅考虑文本和图标符号

const textanchors = [
  {
    "text-anchor": "left",
    "text-offset": [1, 0]
  },
  {
    "text-anchor": "top",
    "text-offset": [0, 1]
  },
  {
    "text-anchor": "right",
    "text-offset": [-1, 0]
  }
];

/**
 * 文本方位策略的使用情况
 * @type {{[layerid:string]:{[index:number]:number}}}
 */
const textanchorsUse = {};
let align = null;

/**
 * 查找并设置文本位置策略
 * @param {*} layerid
 * @param {*} index
 */
function textanchor(layerid, index) {
  const tuse = textanchorsUse[layerid];
  // 默认0策略
  let c = 0;
  if (tuse) {
    delete tuse[index];
    // 已被使用的策略
    const useIndexs = Object.keys(tuse).map(t => Number(tuse[t]));
    // 从小到大寻找可用的文本位置策略
    for (let i = 0; i < textanchors.length; i++) {
      if (useIndexs.indexOf(i) == -1) {
        c = i;
        break;
      }
    }
  }

  setTextanchor(layerid, index, c);
  return textanchors[c];
}

/**
 * 记录文本位置策略
 * @param {*} layerid
 * @param {*} index
 * @param {*} textanchorIndex
 */
function setTextanchor(layerid, index, textanchorIndex) {
  const tuse = textanchorsUse[layerid] || {};
  textanchorsUse[layerid] = tuse;

  if (textanchorIndex >= 0) {
    tuse[index] = textanchorIndex;
  } else {
    delete tuse[index];
  }
}

function getExtLayerId(layerid, index) {
  return `${layerid}_extlayer_${index}`;
}
/**
 * 获取元素的文本样式
 * @param {*} feature 元素
 */
function getOLText(feature) {
  return feature && feature.getStyle().getText();
}

/**
 * 创建或显示扩展图层
 * @param {*} layerid 图层ID
 * @param {*} renderer 扩展图层的渲染器
 * @param {*} index 扩展图层的索引
 */
function showExtLayer(layerid, renderer, index) {
  
  const source = `${layerid}_source`;
  const id = getExtLayerId(layerid, index);
  const tu = textanchor(layerid, index);
  console.log("align",align);
  
  switch (tu["text-anchor"]) {
    case "left":
      align = "left";
      break;
    case "right":
      align = "right";
      break;
    case "top":
      align = "center";
      break;
  }
  if (getLayerOL(id)) {
    getLayerOL(id)
      .getSource()
      .getFeatures()
      .forEach(item => {
        if (item.getStyle() && getOLText(item)) {
          getOLText(item).setOffsetX((tu["text-offset"][0] * 24) / 2 || 0);
          getOLText(item).setOffsetY(tu["text-offset"][1] * 24 || 0);
          getOLText(item).setTextAlign(align);
          item.changed();
        }
      });

    getLayerOL(id).setVisible(true);
  } else {
    const layerSource = new VectorSource();
    const originFeatures = getLayerOL(layerid)
      .getSource()
      .getFeatures();
    originFeatures.forEach(item => {
      layerSource.addFeature(item.clone());
    });

    const layerinfo = new VectorLayer({
      source: layerSource,
      zIndex: 2
    });
    map.addLayer(layerinfo);
    // 文本扩展层
    if (renderer.type == "simple" || renderer.uniqueValueInfos[1].symbol.type == "text") {
      const symbol = renderer.symbol || renderer.uniqueValueInfos[1].symbol;

      if (renderer.type == "unique-value") {
        layerinfo
          .getSource()
          .getFeatures()
          .forEach(item => {
            if (item.get(renderer.field)) {
              item.setStyle(
                new Style({
                  text: new Text({
                    font: symbol.size || 12,
                    text: item.get(symbol.field).toString(),
                    fill: new Fill({
                      color: symbol.color || "#00f"
                    }),
                    offsetX: (tu["text-offset"][0] * 24) / 2 || 0,
                    offsetY: tu["text-offset"][1] * 24 || 0,
                    textAlign: align
                  })
                })
                
              );
              item.changed();
            } else {
              item.setStyle(
                new Style({
                  text: new Text()
                })
              );
            }
          });
      } else {
        layerinfo
          .getSource()
          .getFeatures()
          .forEach(item => {
            let textContent = item.get(symbol.field).toString();

            item.setStyle(
              new Style({
                text: new Text({
                  font: symbol.size || 12,
                  text: textContent,
                  fill: new Fill({
                    color: symbol.color || "#00f"
                  }),
                  offsetX: (tu["text-offset"][0] * 24) / 2 || 0,
                  offsetY: tu["text-offset"][1] * 24 || 0,
                  textAlign: align
                })
              })
            );
          });
      }

      layerinfo.setProperties({
        id: id,
        sourceName: source,
        type: "symbol"
      });
    }
    // 图标扩展层,符号为默认符号的部分不显示
    else if (renderer.type == "unique-value") {
      layerinfo.setStyle(createdRenderer(renderer));
      layerinfo.setProperties({
        id: id,
        sourceName: source,
        type: "symbol"
      });
    }
  }
}

function hideExtLayer(layerid, index) {
  const id = getExtLayerId(layerid, index);
  const extLayer = map
    .getLayers()
    .getArray()
    .find(item => {
      return item.get("id") === id;
    });

  if (extLayer) {
    extLayer.setVisible(false);
  }

  setTextanchor(layerid, index, -1);
}

function extLayerExist(layerid, index) {
  return !!getLayerOL(getExtLayerId(layerid, index));
}

const mixin = {
  computed: {
    ...mapState({
      layersVisibleEx: state => state.layer.visible,
      extLayers: state => state.layer.extLayers
    })
  },
  methods: {
    async initExtLayers() {},
    updateExtlayers() {
      for (const layerid in this.extLayers) {
        const layerRVs = this.extLayers[layerid];
        const layerVisible = this.layersVisible[layerid];
        for (let i = 0; i < layerRVs.length; i++) {
          const { renderer, visible } = layerRVs[i];
          if (layerVisible && visible) {
            showExtLayer(layerid, renderer, i);
          } else {
            hideExtLayer(layerid, i);
          }
        }
      }
    }
  },
  watch: {
    extLayers() {
      this.updateExtlayers();
    },
    layersVisibleEx() {
      this.updateExtlayers();
    }
  }
};

export default mixin;
