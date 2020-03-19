const selectFeature = {
  state: {
    /**
     * 当前选中的要素
     * @type {{id,geometry,properties}}
     */
    selectFeature: null,
    /**
     * 当前选中的要素集合
     * @type {Array<{id,geometry,properties}>}
     */
    selectFeatures: [],
    /**
     * 当前选中要素所在的图层
     * @type {{id, name, fileds,readonly,renderers}}
     */
    selectFeatureLayer: null,
    /**
     * 当前的选择模式（单选/多选）
     * @type {'single'|'multiple'}
     */
    selectMode: "single",
    /**
     * 触发更新样式
     */
    updateStyle: 0,
    /**
     * 是否全选
     * @type  {{[id:string]:boolean}}
     */
    selectAll: {},
    /**
     *全选的要素集合
     * @type {[id:string]:Array<{id,geometry,properties}>}
     */
    selectAllFeaturesAndLayer: {}
  },
  actions: {
    /**
     * 选中一个要素
     * 若当前是单选模式，则会替换掉之前选择的要素，若是多选模式，则将该要素添加到选中要素的集合中
     * 若选择的图层与当前选择的图层不一致，则会清空之前的选择(不允许跨图层多选)
     * 若传入的要素已经被选择，则取消该要素的选择
     * 在多选模式下,selectFeature将始终为null
     * @param {*} context
     * @param {{feature,layer}} param
     */
    selectFeatureAndLayer(context, param) {
      const { feature, layer } = param;
      if (!feature || !layer) return;
      const state = context.state;

      //  判断传入的要素已经被选择
      const fs = state.selectFeature ? [state.selectFeature] : state.selectFeatures;

      const unSelect = state.selectFeatureLayer == layer && fs.findIndex(f => f.get("ID") == feature.id) != -1;
      if (state.selectMode == "single") {
        if (unSelect && state.selectFeatures.length <= 1) {
          state.selectFeatureLayer = null;
          state.selectFeature = null;
          state.selectFeatures = [];
        } else {
          state.selectFeatureLayer = layer;
          state.selectFeature = feature;
          state.selectFeatures = [feature];
        }
      } else if (state.selectMode == "multiple") {
        state.selectFeature = null;
        if (unSelect) {
          state.selectFeatures.splice(
            state.selectFeatures.findIndex(f => f.id == feature.id),
            1
          );
          if (state.selectFeatures.length == 0) {
            state.selectFeatureLayer = null;
          }
        } else {
          // 若选择的图层与当前不一致，则直接单选
          if (state.selectFeatureLayer !== layer) {
            state.selectFeatureLayer = layer;
            state.selectFeatures = [feature];
          } else {
            state.selectFeatureLayer = layer;
            state.selectFeatures.push(feature);
          }
        }
      }
    },

    /**
     * 取消所有选中的要素
     * @param {*} context
     */
    clearSelect(context) {
      context.state.selectFeatureLayer = null;
      context.state.selectFeature = null;
      context.state.selectFeatures = [];
    },
    /**
     * 设置是否全选
     * @param {*} context
     * @param {{layerid:string,visible:boolean}} param
     */
    setSelectAll(context, param) {
      context.state.selectAll = Object.assign({}, context.state.selectAll, {
        [param.layerid]: param.selectAll
      });
    },
    /**
     * 全选
     * 若传入的图层已经被全选，则取消该图层的全选
     * @param {*} context
     * @param {{features,layer}} param
     */
    selectAllFeaturesAndLayer(context, param) {
      const { features, layer } = param;

      const state = context.state;

      if (state.selectAllFeaturesAndLayer[layer]) {
        state.selectAllFeaturesAndLayer[layer] = null;
      } else {
        state.selectAllFeaturesAndLayer[layer] = features;
      }

    },

    /**
     * 更新样式
     * @param {*} param0
     */
    addUpdateStyle({ state }) {
      state.updateStyle++;
    }
  },
  /**
   * 设置当前的要素选择模式
   * @param {*} context
   * @param {'single'|'multiple'} param
   */
  setSelectMode(context, param) {
    context.state.selectMode = param;
  },
  /**
   * 取消选中一组要素
   * @param {*} context
   * @param {{Feature}} param
   */
  unselectFeatureLayer(context, param) { }
};

// 按下Ctrl键时，进入多选模式
import("@/store").then(m => {
  const store = m.default;
  const selectFeature = store.state.selectFeature;
  let ctrlKey = false;
  window.addEventListener("keydown", evt => {
    if (evt.ctrlKey !== ctrlKey) {
      selectFeature.selectMode = evt.ctrlKey ? "multiple" : "single";
      // selectFeature.a
      ctrlKey = evt.ctrlKey;
    }
  });
  window.addEventListener("keyup", evt => {
    if (evt.ctrlKey !== ctrlKey) {
      selectFeature.selectMode = evt.ctrlKey ? "multiple" : "single";
      ctrlKey = evt.ctrlKey;
    }
  });
});

import("@/store").then(m => {
  const store = m.default;
  // 当图层可见性被设置为false时，取消该要素选择
  store.watch(
    () => store.state.layer.visible,
    newval => {
      const selectFeature = store.state.selectFeature;
      if (selectFeature.selectFeatureLayer && !newval[selectFeature.selectFeatureLayer.id]) {
        selectFeature.selectFeatureLayer = null;
        selectFeature.selectFeatures = [];
        selectFeature.selectFeature = null;
      }
    }
  );

  // 当图层数据发生变更时，取消要素选择
  store.watch(
    () => store.state.layer.source,
    newval => {
      const selectFeature = store.state.selectFeature;
      if (selectFeature.selectFeatureLayer) {
        selectFeature.selectFeatureLayer = null;
        selectFeature.selectFeatures = [];
        selectFeature.selectFeature = null;
      }
    }
  );
});

// // TEST: 设置当前图层的第一个要素为选中状态
// import('@/store').then(m => {
//     const store = m.default;
//     store.watch(() => store.state.layer.visible, (newval) => {
//         const layerstate = store.state.layer;
//         if (layerstate.currentLayer&&newval[layerstate.currentLayer.id]) {
//             store.state.selectFeatureLayer = layerstate.currentLayer;
//             store.state.selectFeature.selectFeature = layerstate.source[layerstate.currentLayer.id][0];
//             console.log(`test: select layer ${layerstate.currentLayer.name} first Feature`)
//             // console.log(store.state.selectFeature)
//         }
//     });
// });

export default selectFeature;
