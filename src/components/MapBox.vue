<template>
  <div class="map-container">
    <BaseMapSource
      :currentBaseMapSource="currentBaseMapSource"
      @setCurrentBaseMapSource="setCurrentBaseMapSource"
      :baseMapSourceList="baseMapSourceList"
      top="10px"
      right="10px"
    ></BaseMapSource>
    <Search />
    <div class="mapbox" ref="mapbox"></div>
  </div>
</template>
<script>
import {
  baseMapRasterSource,
  baseMapRasterLayer,
  baseMapGeojsonSource,
  baseMapGeojsonLayer,
  baseMapSourceList
} from "../mapTool/baseMapData.js"
import BaseMapSource from '@/components/mapTool/BaseMapSource.vue'
import { geoJSONLayers, createdRenderer, selectFeatureLayer } from '../mapTool/layerManager.js'
import Search from '@/components/mapTool/Search.vue'
import { mapState } from 'vuex';
let { intiMap, map, popup, mapLoaded } = require("../mapTool/mapbox")


export default {
  name: "mapBox",
  data () {
    return {
      baseMapSourceList: baseMapSourceList,
      /**
       * 最后一次被选择的图层的符号
       */
      lastSelectSymbol: null
    }
  },
  components: {
    BaseMapSource,
    Search
  },
  computed: {
    ...mapState({
      // 底图
      currentBaseMapSource: state => state.basemap.currentBaseMapSource,
      // 要素图层
      layersVisible: state => state.layer.visible,
      layersRenderer: state => state.layer.renderer,
      layersSource: state => state.layer.source,
      layerbase: state => state.layer.base,
      // 选择图层
      selectFeatures: state => state.selectFeature.selectFeatures,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      // 地图状态
      inputBounds: state => state.mapState.inputBounds,
      inputCenter: state => state.mapState.inputCenter,
      inputZoom: state => state.mapState.inputZoom,
    })
  },
  methods: {
    setCurrentBaseMapSource (val) {
      this.$store.dispatch("setCurrenBaseMapSource", val);
    },
    /**
     * 初始化地图
     */
    async initMap () {
      console.log(map);
      if (!map) {
        map = intiMap(this.$refs.mapbox);
        popup = HTmap.popup(map, { closeButton: false, closeOnClick: false, content: "在这里" });
      }
      await mapLoaded();

      this.initUpdateMapState();

      map.addLayer(baseMapRasterLayer);
      map.addLayer(selectFeatureLayer);
      map.setLayerIndex(selectFeatureLayer, 1);

      this.updateGeoJSONLayers(this.layersSource);
      console.log(map)
    },
    async updateGeoJSONLayers (layersSource, oldLayersSource = {}) {
      for (const layerId in layersSource) {
        if (layersSource.hasOwnProperty(layerId)) {
          const layerSource = layersSource[layerId];
          const oldlayerSource = oldLayersSource[layerId];
          if (layerSource !== oldlayerSource) {
            //更换数据
            const geoJSONSource = HTmap.geoJSONSource({
              "type": "FeatureCollection", "features":
                layerSource
            })
            // uniqueValueRenderer
            if (!geoJSONLayers.hasOwnProperty(layerId)) {
              const renderer = createdRenderer(this.layersRenderer[layerId]);
              //初始化图层 TODO: 开启的话 封装的引擎有bug 
              geoJSONLayers[layerId] = HTmap.geoJSONLayer(layerId, {
                renderer,
                source: geoJSONSource,
                isCluster: false
              })
              //定义
              geoJSONLayers[layerId].on("click", (t) => {
                let feature = t.Features[0];
                feature.id = feature.properties.ID
                const layer = this.layerbase.find(l => l.id === layerId);
                this.$store.dispatch("selectFeatureAndLayer", {
                  feature, layer
                });
              })
              geoJSONLayers[layerId].on("mouseover", (t) => {
                map.setCursor("pointer")
              })
              geoJSONLayers[layerId].on("mouseout", (t) => {
                map.setCursor("")
              })
              // 设置可见性
              geoJSONLayers[layerId].setVisible(this.layersVisible[layerId]);
              await mapLoaded();
              map.addLayer(geoJSONLayers[layerId]);
            } else {
              geoJSONLayers[layerId].setSource(geoJSONSource);
            }
          }
        }
      }
    },
    /**
     * 地图状态变更时，更新其状态值
     */
    initUpdateMapState () {
      map.on('statechanged', () => {
        console.log(this.$store);
        this.$store.state.mapState.bounds = map.getBounds();

        const newcenter = map.getCenter();
        const center = this.$store.state.mapState.center;
        if (!center || (center.x != newcenter.x || center.y != newcenter.y)) {
          this.$store.state.mapState.center = newcenter;
        }

        const newzoom = map.getZoom();
        const zoom = this.$store.state.mapState.zoom;
        if (!zoom || (zoom != newzoom)) {
          this.$store.state.mapState.zoom = newzoom;
        }
      })
    }
  },
  mounted () {
    this.initMap();
  },
  watch: {
    /**
     * 监听数据变化
     * map更换底图
     */
    currentBaseMapSource (val, oldVal) {
      const baseMapRasterLayerVisible = val.layerType === "baseMapRasterLayer";
      baseMapRasterLayer.setVisible(baseMapRasterLayerVisible)
      if (baseMapRasterLayerVisible) {
        baseMapRasterLayer.setSource(baseMapRasterSource[val.sourceKey])
      }
      //TODO: baseMapGeojsonLayer 图层目前未实现
      const baseMapGeojsonLayer = val.layerType === "baseMapGeojsonLayer";
    },
    /* 要素图层 */
    layersVisible (layersVisible, oldLayersVisible) {
      for (const layerId in layersVisible) {
        if (layersVisible.hasOwnProperty(layerId)) {
          const layerVisible = layersVisible[layerId];
          if (geoJSONLayers.hasOwnProperty(layerId)) {
            geoJSONLayers[layerId].setVisible(layerVisible);
            layerVisible && map.setLayerIndex(geoJSONLayers[layerId]);
          }
        }
      }
    },
    layersRenderer (layersRenderer, oldLayersRenderer) {
      for (const layerId in layersRenderer) {
        if (layersRenderer.hasOwnProperty(layerId)) {
          const layerRenderer = layersRenderer[layerId];
          if (geoJSONLayers.hasOwnProperty(layerId)) {
            //创建Renderer
            const renderer = createdRenderer(layerRenderer);
            geoJSONLayers[layerId].setRenderer(renderer);
          }
        }
      }
    },
    async layersSource (layersSource, oldLayersSource) {
      // console.log(layersSource, oldLayersSource);
      this.updateGeoJSONLayers(layersSource, oldLayersSource);
    },
    /* 选择图层 */
    selectFeatures (selectFeatures, oldSelectFeatures) {
      setTimeout(() => {
        // 如果没有被选中的图层或数据，清空选择层
        if (this.selectFeatureLayer == null || this.selectFeatures.length == 0) {
          selectFeatureLayer.setSource(HTmap.geoJSONSource({
            "type": "FeatureCollection",
            "features": selectFeatures
          }));
        }
        else {
          // 取渲染器的默认符号判断渲染的类型
          const renderer = this.layersRenderer[this.selectFeatureLayer.id];
          const symbol = renderer.symbol || renderer.defaultSymbol;
          // 如果选择符号发生了变更，则重新生成一个选择图层的渲染器
          let selectLayerRenderer;
          if (symbol != this.lastSelectSymbol) {
            let currentSelectSymbol;
            if (symbol.type == 'picture-marker') {
              // 对于点符号，生成一个红色的方形外框图标作为选中符号
              const { width, height } = symbol;
              const canvas = document.createElement('canvas');
              canvas.width = width + 2;
              canvas.height = height + 2;
              const context = canvas.getContext('2d');
              context.strokeStyle = '#f00';
              context.lineWidth = 3;
              context.strokeRect(0, 0, canvas.width, canvas.height);
              selectLayerRenderer = HTmap.simpleRenderer(HTmap.pictureMarkerSymbol({
                url: canvas.toDataURL(),
                width: canvas.width,
                height: canvas.height,
                anchor: 'center'
              }));
            }
            else if (symbol.type == 'simple-Line') {
              // 对于线符号，生成一条比默认线宽更宽的线符号
            }
            else if (symbol.type == 'simple-fill') {
              // 对于多边形填充，生成一个蓝色默认填充符号
            }
            else {
              throw `不支持的选择类型${symbol.type}`;
            }
            this.lastSelectSymbol = symbol;
          }
          // 更新渲染器
          selectLayerRenderer && selectFeatureLayer.setRenderer(selectLayerRenderer);
          // 更换数据
          const geoJSONSource = HTmap.geoJSONSource({
            "type": "FeatureCollection", "features":
              selectFeatures
          })
          selectFeatureLayer.setSource(geoJSONSource);
        }
      }, 1)
    },
    /* 地图状态 */
    inputBounds (val) {
      val && map.setBounds(val);
    },
    inputCenter (val) {
      val && map.setCenter(val);
    },
    inputZoom (val) {
      val && map.setZoom(val);
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  .mapbox {
    width: 100%;
    height: 100%;
  }
}
</style>