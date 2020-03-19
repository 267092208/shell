import { mapState } from "vuex";
import { map } from "./map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Text, Fill, Circle as CircleStyle, Style, Stroke } from "ol/style";
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
  // const source = `${layerid}_source`;

  const id = getExtLayerId(layerid, index);
  const tu = textanchor(layerid, index);
  let align = null;
  //文本偏移策略
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
    let extRender = {};

    extRender = createExtRender(renderer, layerid, index);

    const layerSource = new VectorSource();
    const originFeatures = getLayerOL(layerid)
      .getSource()
      .getFeatures();
    originFeatures.forEach(item => {
      layerSource.addFeature(item.clone());
    });

    const extLayer = new VectorLayer({
      source: layerSource,
      zIndex: 2
      // declutter: true //标签整理
    });
    map.addLayer(extLayer);

    console.log();

    if (renderer.linkLayerIndex ) {
      //关联图层已存在，只修改关联图层某些要素的样式
      let linkId = getExtLayerId(layerid, renderer.linkLayerIndex);
      if (getLayerOL(linkId)) {
        let linkStyleFun = getLayerOL(linkId).getStyleFunction();

        getLayerOL(linkId)
          .getSource()
          .getFeatures()
          .forEach(f => {
            if (f.get(renderer.field)) {
              // console.log(linkStyleFun(f).getText());
              extRender = {
                offsetX: linkStyleFun(f)
                  .getText()
                  .getOffsetX(),
                offsetY: linkStyleFun(f)
                  .getText()
                  .getOffsetY(),
                textAlign: linkStyleFun(f)
                  .getText()
                  .getTextAlign()
              };
              // f.setStyle(createdRenderer(renderer,extRender))

              // f.changed()
            }
          });

      }
    } else {
      extRender = createExtRender(renderer, layerid, index);
    }
    extLayer.setStyle(createdRenderer(renderer, extRender));
    extLayer.setProperties({
      id: id,
      type: "symbol"
    });
  }
}

function hideExtLayer(layerid, index) {
  const id = getExtLayerId(layerid, index);
  const extLayer = getLayerOL(id);

  if (extLayer) {
    extLayer.setVisible(false);
  }

  setTextanchor(layerid, index, -1);
}

function extLayerExist(layerid, index) {
  return !!getLayerOL(getExtLayerId(layerid, index));
}

function createExtRender(renderer, layerid, index) {
  const tu = textanchor(layerid, index);
  let align = null;
  //文本偏移策略
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
  let extRender = {};
  if (renderer.type === "simple") {
    extRender = {
      offsetX: (tu["text-offset"][0] * 24) / 2,
      offsetY: tu["text-offset"][1] * 24,
      textAlign: align
    };
  } else if (renderer.type === "unique-value") {
    const symbolType = renderer.uniqueValueInfos[1].symbol.type;

    extRender = {};
    if (symbolType === "text") {
      extRender = {
        offsetX: (tu["text-offset"][0] * 24) / 2,
        offsetY: tu["text-offset"][1] * 24,
        textAlign: align
        // backgroundFillColor: "#FFFF00",
        // StrokeColor: "#FF0000",
        // padding: [0, 0.5, 0, 0.5]
      };
    }
  }

  return extRender;
}

const mixin = {
  data() {
    return {
      renderList: []
    };
  },
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
