import axios from "@/assets/js/axios";
import layerConfig from "@/config/layer";
import layerData from "@/data/layer";
import Vue from "vue";

const storageNames = {
  visible: "layervisible",
  currentLayerId: "currentLayerId",
  globalFiltersKeys: "globalFiltersKeys",
  globalFilters: "globalFilters"
};

const layer = {
  state: {
    /**
     * 图层基本信息
     * @type {Array<{
     *  id: string,
     *  name: string,
     *  fields:Array<{
     *      fieldName:string,
     *      displayText:string,
     *      type:'string'|'number'|'date'|'time'|'geometryX'|'geometryY'|'geometryPath',
     *      readonly?:boolean,
     *      required?:boolean,
     *      enum?:Array<any>
     * }>,
     *  readonly?: boolean,
     *  renderers: Renderer[]
     * }>}
     */
    base: [],
    /**
     * 图层分组信息
     * @type {Array<{name:string,layersIds:string[]}>}
     */
    groups: layerConfig.layerGroups,
    /**
     * 图层可见性
     * @type {{[id:string]:boolean}}
     */
    visible: {},
    /**
     * 图层渲染器
     * @type {{[id:string]:Renderer}
     */
    renderer: {},
    /**
     * 图层扩展显示
     * @type {{[id:string]:Array<{name:string,renderer:Renderer,visible:boolean}>}}
     */
    extLayers: {},
    /**
     * 图层操作
     * @type {{[id:string]:Array<{name:string,renderer:Renderer,visible:boolean}>}}
     */
    handleLayers: {},
    /**
     * 图层数据源
     * @type {{[id:string]:GeoJSON.Feature[]}}
     */
    source: {},
    /**
     * 图层过滤条件
     * @type {{
     *      [id:string]:Array<{
     *          field?:string,
     *          value?:string,
     *          relation?:'IASF'|'Multiple-IndexOf'|'Multiple-Equal'|'IndexOf'|'='|'!='|'>='|'<='|'booleanExist-false'|
     *                    'inCa'|'inMa'|'inCity'|'inQx'|'cityOrMaIdsOrQuery',
     *          type?:'int'|'string'|'datetime'|'float'|'bool'|
     *                'int?'|'datetime?'|'float?'|'bool?'
     * }>}}
     */
    filters: {},
    /**
     * 通用过滤条件(默认广州市)
     * @type {Array<{
     *          field?:string,
     *          value?:string,
     *          relation?:'IASF'|'Multiple-IndexOf'|'Multiple-Equal'|'IndexOf'|'='|'!='|'>='|'<='|'booleanExist-false'|
     *                    'inCa'|'inMa'|'inCity'|'inQx'|'cityOrMaIdsOrQuery',
     *          type?:'int'|'string'|'datetime'|'float'|'bool'|
     *                'int?'|'datetime?'|'float?'|'bool?'
     * }>}
     */
    globalFilters: [
      {
        field: "",
        value: "17;",
        relation: "cityOrMaIdsOrQuery",
        type: "string"
      }
    ],
    /**
     * 通用筛选行政区划选中的key值数据
     * @type {Array<string>}
     *
     */
    globalFiltersKeys: ["city_17"],
    /**
     * 图层(符号)缩放比例
     * @type {{[id:string]:number}}
     */
    symbolScaling: {},
    /**
     * 当前图层
     * @type {{
     *  id: string,
     *  name: string,
     *  fields:Array<{fieldName:string,displayText:string,type:string}>,
     *  readonly?: boolean,
     *  renderers: Renderer[]
     * }}
     */
    currentLayer: null,
    /**
     * 图层的加载状态
     * @type {{[layerid:string]:boolean}}
     */
    layerLoading: {}
  },
  mutations: {},
  actions: {
    /**
     * 从服务器初始化图层信息
     */
    initLayerData: async function(context) {
      // 还原通用过滤条件
      const globalFilters = Vue.ls.get(storageNames.globalFilters);
      if (globalFilters) {
        context.state.globalFilters = globalFilters;
      }
      // 还原行政区划的选择
      const globalFiltersKeys = Vue.ls.get(storageNames.globalFiltersKeys);
      if (globalFiltersKeys) {
        context.state.globalFiltersKeys = globalFiltersKeys;
      }

      // 获取用户可访问的图层列表
      const layerResult = await axios.get("/userPages/RolesHandler.ashx?action=GetLayers");
      // 补充渲染器、扩展图层等信息

      const base = layerResult.data.map(d => {
        d.renderers = layerConfig.renders[d.id];
        d.extLayers = layerConfig.extLayers[d.id];
        d.handleLayers = layerConfig.handleLayers[d.id];
        d.zindex = layerConfig.zindex[d.id];
        d.fields = layerConfig.fields[d.id];
        return d;
      }); //.filter(d => d.renderers);
      context.state.base = base;

      context.state.handleLayers = Object.assign({}, context.state.extLayers, layerConfig.handleLayers);
      // 设置图层的默认渲染器
      const renderer = {};
      // 设置符号缩放比例
      const symbolScaling = {};
      base.forEach(layer => {
        if (layer.renderers) {
          renderer[layer.id] = layer.renderers[0];
          symbolScaling[layer.id] = 1;
        }
      });
      context.state.renderer = renderer;
      context.state.symbolScaling = symbolScaling;

      // 从本地存储中还原上一次打开的图层
      const visible = Vue.ls.get(storageNames.visible);
      if (visible) {
        for (let layerid in visible) {
          if (visible[layerid] && base.findIndex(b => b.id == layerid) >= 0) {
            context.dispatch("setLayerVisible", { layerid, visible: true });
          }
        }
      }
      // 从本地存储中还原上一次的当前图层
      const currentlayerId = Vue.ls.get(storageNames.currentLayerId);
      if (currentlayerId) {
        const currentLayer = base.find(b => b.id == currentlayerId);
        if (currentLayer) {
          context.dispatch("setCurrentLayer", { layer: currentLayer });
        }
      }
    },

    /**
     * 设置筛选条件(含通用和图层筛选)
     * @param {*} context
     * @param {
     *  global:Array<{field,value,relation,type}>,
     *  layerid?:string,
     *  layerFilters?:Array<{field,value,relation,type}>
     *  globalKeys?:Array<string>
     * } param
     */
    async setLayerFilter(context, param) {
      try {
        const updatePromises = [];
        // 更新所设置图层的数据
        if (param.layerid && context.state.visible[param.layerid]) {
          context.state.filters = param.layerFilters;
          const querys = [...param.layerFilters, ...param.global];
          updatePromises.push(updateLayerSource(context, param.layerid, querys, true));
        }

        // 处理通用筛选
        if (JSON.stringify(context.state.globalFilters) !== JSON.stringify(param.global)) {
          for (let layerid in context.state.visible) {
            if (layerid != param.layerid) {
              // 如果图层当前显示了，则立即请求数据
              if (context.state.visible[layerid]) {
                const query = [...param.global];
                context.state.filters[layerid] && query.push(...context.state.filters[layerid]);
                updatePromises.push(updateLayerSource(context, layerid, query));
              }
              // 如果当前图层没显示，则直接清空数据
              else {
                context.state.source[layerid] = null;
              }
            }
          }

          context.state.globalFilters = param.global;
          // 本地存储
          Vue.ls.set(storageNames.globalFilters, param.global);
          context.state.globalFiltersKeys = param.globalKeys;
          // 本地存储
          Vue.ls.set(storageNames.globalFiltersKeys, param.globalKeys);
        }
        await Promise.all(updatePromises);
        // 更新数据源
        context.state.source = { ...context.state.source };
      } catch (error) {
        console.error(error);
        context.state.layerLoading = {};
      }
    },

    /**
     * 设置当前图层
     * @param {*} context
     * @param {{layer?:{
     *  id: string,
     *  name: string,
     *  fields:Array<{fieldName:string,displayText:string,type:string}>,
     *  readonly?: boolean,
     *  renderers: Renderer[]
     * }}} param
     */
    async setCurrentLayer(context, param) {
      context.state.currentLayer = param.layer;
      Vue.ls.set(storageNames.currentLayerId, param.layer ? param.layer.id : null);
    },

    /**
     * 设置指定图层的可见性
     * @param {*} context
     * @param {{layerid:string,visible:boolean}} param
     */
    async setLayerVisible(context, param) {
      // 如果图层数据尚未加载，则请求数据
      if (!context.state.source || !context.state.source[param.layerid]) {
        const query = [];
        query.push(...context.state.globalFilters);
        context.state.filters[param.layerid] && query.push(...context.state.filters[param.layerid]);
        await updateLayerSource(context, param.layerid, query);
        context.state.source = Object.assign({}, context.state.source);
      }
      // 设置可见性
      context.state.visible = Object.assign({}, context.state.visible, {
        [param.layerid]: param.visible
      });
      Vue.ls.set(storageNames.visible, context.state.visible);
    },

    /**
     * 设置指定图层的渲染器
     * @param {*} context
     * @param {{layerid:string,render:Render}} param
     */
    setLayerRender(context, param) {
      context.state.renderer = Object.assign({}, context.state.renderer, {
        [param.layerid]: param.render
      });
    },

    /**
     * 更新指定图层的标签开关
     * @param {*} context
     * @param {{layerid:string,extLayers:Array<{name:string,renderer:Renderer,visible:boolean}>}} param
     */
    setLayerExtLayersVisible(context, param) {
      context.state.extLayers = Object.assign({}, context.state.extLayers, {
        [param.layerid]: param.extLayers
      });
    },
    /**
     * 更新指定图层的图层操作开关
     * @param {*} context
     * @param {{layerid:string,handleLayers:Array<{name:string,renderer:Renderer,visible:boolean}>}} param
     */
    setLayerHandleLayersVisible(context, param) {
      context.state.handleLayers = Object.assign({}, context.state.handleLayers, {
        [param.layerid]: param.handleLayers
      });
    },

    /**
     * 设置指定图层的符号缩放大小
     * @param {*} context
     * @param {{layerid:string,symbolScaling:number}} param
     */
    setLayerSymbolScaling(context, param) {
      context.state.symbolScaling = Object.assign({}, context.state.symbolScaling, {
        [param.layerid]: param.symbolScaling
      });
    },

    /**
     * 添加要素
     * @param {*} context
     * @param {{layerid:string,feature:{id?,geometry,properties}}} param
     */
    async addLayerFeature(context, param) {
      let res;
      if (param.layerid !== "ma") {
        if (param.layerid === "xzqh" || param.layerid === "poigroups") {
          res = await layerData.addForActionAdd(param.layerid, param.feature).catch(err => err);
        } else {
          res = await layerData.add(param.layerid, param.feature);
        }
      }
      if (context.state.source[param.layerid]) {
        context.state.source[param.layerid].push(param.feature);
        context.state.source = Object.assign({}, context.state.source);
      }
      return res;
    },

    /**
     * 更新要素
     * @param {*} context
     * @param {{layerid:string,feature:{id,geometry,properties}}} param
     */
    async updateLayerFeature(context, param) {
      if (param.layerid !== "ma") {
        await layerData.update(param.layerid, param.feature);
      }

      const source = context.state.source[param.layerid];
      if (source) {
        const i = source.findIndex(t => t.id == param.feature.id);
        source.splice(i, 1, param.feature);
        context.state.source = Object.assign({}, context.state.source);
      }
    },
    /**
     * 删除一组要素
     * @param {*} context
     * @param {{layerid:string,features:feature[]}} param
     */
    async removeLayerFeature(context, param) {
      await layerData.remove(param.layerid, param.features);
      const source = context.state.source[param.layerid];
      if (source) {
        param.features.forEach(f => {
          const i = source.findIndex(t => t.id == f.id);
          source.splice(i, 1);
        });
        context.state.source = Object.assign({}, context.state.source);
      }
    },
    async delFeature(context, param) {
      const source = context.state.source[param.layerid];
      if (source) {
        const i = source.findIndex(t => t.id == param.feature.id);
        source.splice(i, 1);
        context.state.source = Object.assign({}, context.state.source);
      }
    },
    async addFeature(context, param) {
      if (context.state.source[param.layerid]) {
        context.state.source[param.layerid].push(param.feature);
        context.state.source = Object.assign({}, context.state.source);
      }
    },
    /**
     * 
     * @param {{layerId: number, ID: number}} param 
     */
    async getFeature(context, param) {
      if (context.state.source[param.layerId]) {
        return context.state.source[param.layerId].find(item => item.id === param.ID);
      }
      return null;
    }
  }
};

async function updateLayerSource(context, layerid, querys, setmapbound = false) {
  context.state.layerLoading[layerid] = true;
  console.log(`loading layer ${layerid} data`);
  const features = await layerData.get(layerid, querys);
  context.state.source[layerid] = features;
  context.state.layerLoading[layerid] = false;
  context.state.layerLoading = Object.assign({}, context.state.layerLoading);
  console.log(`loading layer ${layerid} data successed`);

  if (setmapbound) {
    const nfs = features.filter(f => {
      const [x, y] = f.geometry.coordinates;
      return x > 1 && y > 1;
    });
    // 如果当前图层的数据更新，则将地图定位到此范围
    if (nfs.length > 1) {
      let minx = Number.MAX_VALUE,
        miny = Number.MAX_VALUE,
        maxx = -Number.MAX_VALUE,
        maxy = -Number.MAX_VALUE;
      /// TODO:自动缩放到图层范围仅支持点几何
      nfs.forEach(f => {
        const [x, y] = f.geometry.coordinates;
        minx = minx < x ? minx : x;
        miny = miny < y ? miny : y;
        maxx = maxx > x ? maxx : x;
        maxy = maxy > y ? maxy : y;
      });
      if (minx < Number.MAX_VALUE) {
        console.log({
          minx,
          miny,
          maxx,
          maxy
        });
        context.dispatch("setMapBounds", { minx, miny, maxx, maxy });
      }
    } else if (nfs.length == 1) {
      const f = nfs[0];
      const [x, y] = f.geometry.coordinates;
      context.dispatch("setMapCenter", { x, y });
    }
  }
}

export default layer;
