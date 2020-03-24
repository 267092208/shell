import { mapState } from "vuex";
import { map } from "./map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { createdRenderer } from "../layerManager.js";
import { getLayerOL } from "./utils";

///TODO:扩展图层目前仅考虑文本和图标符号
///FIXME: 图标符号 会挡住 图层的点击事件

const textanchors = [
  {
    //left
    textAlign: "left",
    textBaseline: "middle",
    offsetX: 14,
    offsetY: 0
  },
  {
    //right
    textAlign: "right",
    textBaseline: "middle",
    offsetX: -14,
    offsetY: 0
  },
  {
    //top
    textAlign: "center",
    textBaseline: "top",
    offsetX: 0,
    offsetY: 14
  },
  {
    //bottom
    textAlign: "center",
    textBaseline: "bottom",
    offsetX: 0,
    offsetY: -14
  }
];
/**
 * 文本方位策略的使用情况
 * @type {{[layerid:string]:{[index:number]:number}}}
 */
const textanchorsUse = {};
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
 * 创建或显示扩展图层
 * @param {*} layerid 图层ID
 * @param {*} renderer 扩展图层的渲染器
 * @param {*} index 扩展图层的索引
 */
function showExtLayer(layerid, renderer, index) {
  //#region 采用 关联覆盖样式模式
  if (renderer.linkLayerIndex) {
    index = renderer.linkLayerIndex;
    if (!renderer.linkVisible) {
      const emptyMarkerSymbol =
        renderer.emptyMarkerSymbol || renderer.defaultSymbol;
      renderer = Object.assign({}, renderer, {
        defaultSymbol: emptyMarkerSymbol
      });
    }
  }
  //#endregion

  //文本偏移策略
  let extRender = textanchor(layerid, index);
  //获取ID  获取图层
  const id = getExtLayerId(layerid, index);
  let extLayer = getLayerOL(id);
  //判断地图上是否有此图层
  if (!extLayer) {
    //无图层创建扩展图层
    const layerSource = getLayerOL(layerid).getSource();
    const layerSource1 = new VectorSource();
    layerSource1.addFeatures(layerSource.getFeatures().map(t => t.clone()));
    // 同步标签数据
    layerSource.on("change", () => {
      layerSource1.clear();
      layerSource1.addFeatures(layerSource.getFeatures().map(t => t.clone()));
    });
    extLayer = new VectorLayer({
      source: layerSource1,
      zIndex: getLayerOL(layerid).getZIndex()
      //declutter: true //标签整理
    });
    // extLayer.set("clickFn", getLayerOL(layerid).get("clickFn"));
    // extLayer.setProperties(getLayerOL(layerid).getProperties());
    map.addLayer(extLayer);
  }
  extLayer.setVisible(true);
  extLayer.setStyle(createdRenderer(renderer, extRender));
  extLayer.setProperties({
    id: id,
    type: "symbol"
  });
}

function hideExtLayer(layerid, index) {
  const id = getExtLayerId(layerid, index);
  const extLayer = getLayerOL(id);
  if (extLayer) {
    extLayer.setVisible(false);
  }
  setTextanchor(layerid, index, -1);
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
      extLayers: state => state.layer.extLayers,
      layersRenderer: state => state.layer.renderer
    })
  },
  methods: {
    async initExtLayers() {},
    updateExtlayers() {
      for (const layerid in this.extLayers) {
        const layerRVs = this.extLayers[layerid];
        const layerVisible = this.layersVisible[layerid];
        for (let i = 0; i < layerRVs.length; i++) {
          const { renderer, visible, type } = layerRVs[i];
          //判断是那种方式实现
          if (type == "extLayer") {
            if (layerVisible && visible) {
              if (renderer.linkLayerIndex) {
                renderer.linkVisible =
                  layerRVs[renderer.linkLayerIndex].visible;
              }
              showExtLayer(layerid, renderer, i);
            } else {
              hideExtLayer(layerid, i);
            }
          } else if (type == "extStyle") {
            console.log(this.layersRenderer[layerid]);
            //
          }
          //   console.log(type);
        }
      }
    },
    async extRenders(layerid, renderer) {
      // const res = await this.$store.dispatch('setLayerRender', {layerid: this.currentLayer.id, render: this.currentLayer.renderers[label]});
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
