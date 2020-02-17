import { mapState } from 'vuex';
import { map } from './map';
import { geoJSONLayers, createdRenderer } from '../layerManager.js'

const mixin = {
    computed: {
        ...mapState({
            // 要素图层
            layersVisible: state => state.layer.visible,
            layersRenderer: state => state.layer.renderer,
            layersSource: state => state.layer.source,
            layerbase: state => state.layer.base,
            layerSymbolScaling: state => state.layer.symbolScaling
        })
    },
    methods: {
        async initLayers () {
            this.updateGeoJSONLayers(this.layersSource);
        },
        async updateGeoJSONLayers (layersSource, oldLayersSource = {}) {
            for (const layerId in layersSource) {
                if (layersSource.hasOwnProperty(layerId)) {
                    const layerSource = layersSource[layerId];
                    const oldlayerSource = oldLayersSource[layerId];
                    /// TODO:图层数据变更每个图层均立即刷新数据，尚未判断要素数据是否真的变化
                    if (true/*layerSource !== oldlayerSource*/) {
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
                            // 点击图层上的要素，将要素添加到选择集合中
                            // geoJSONLayers[layerId].on("click", (t) => {
                            //     let feature = t.Features[0];
                            //     feature.id = feature.properties.ID;
                            //     // 由于mapboxgl会把要素属性中的null修改为'null'对此进行转换
                            //     /// TODO: 若有要素属性其值正好是'null'会错误的转为null
                            //     for (const p in feature.properties) {
                            //         if (feature.properties[p] === 'null') {
                            //             feature.properties[p] = null;
                            //         }
                            //     }
                            //     const layer = this.layerbase.find(l => l.id === layerId);
                            //     this.$store.dispatch("selectFeatureAndLayer", {
                            //         feature, layer
                            //     });
                            // })
                            // geoJSONLayers[layerId].on("mouseover", (t) => {
                            //     map.setCursor("pointer")
                            // })
                            // geoJSONLayers[layerId].on("mouseout", (t) => {
                            //     map.setCursor("")
                            // })
                            /// TODO:要素图层鼠标事件由mapboxgl api完成,使用封装接口偶尔会无法正确触发
                            const mapboxLayerId = `${layerId}_layer_0`;
                            map._map.on('click', mapboxLayerId, evt => {
                                const [feature] = map._map.queryRenderedFeatures([evt.point.x, evt.point.y], { layers: [mapboxLayerId] });
                                feature.id = feature.properties.ID;
                                // 由于mapboxgl会把要素属性中的null修改为'null'对此进行转换
                                /// TODO: 若有要素属性其值正好是'null'会错误的转为null
                                for (const p in feature.properties) {
                                    if (feature.properties[p] === 'null') {
                                        feature.properties[p] = null;
                                    }
                                }
                                const layer = this.layerbase.find(l => l.id === layerId);
                                this.$store.dispatch("selectFeatureAndLayer", {
                                    feature, layer
                                });
                            })
                            map._map.on('mouseover', mapboxLayerId, evt => {
                                map.setCursor("pointer");
                            })
                            map._map.on('mouseout', mapboxLayerId, evt => {
                                map.setCursor("");
                            })

                            // 设置可见性
                            geoJSONLayers[layerId].setVisible(this.layersVisible[layerId]);
                            await this.mapLoaded();
                            map.addLayer(geoJSONLayers[layerId]);
                        } else {
                            /// TODO: 更换图层数据直接使用了mapboxgl api 防止因为添加删除图层而导致扩展图层失效
                            const mapboxSource = map._map.getSource(`${layerId}_source`);
                            mapboxSource && mapboxSource.setData({
                                "type": "FeatureCollection",
                                "features": layerSource
                            });
                            // geoJSONLayers[layerId].setSource(geoJSONSource);
                        }
                    }
                }
            }
        }
    },
    watch: {
        layersVisible (layersVisible, oldLayersVisible) {
            for (const layerId in layersVisible) {
                if (layersVisible.hasOwnProperty(layerId)) {
                    const layerVisible = layersVisible[layerId];
                    if (geoJSONLayers.hasOwnProperty(layerId)) {
                        geoJSONLayers[layerId].setVisible(layerVisible);
                        // TODO:后显示的图层在最上面一层
                        // layerVisible && map.setLayerIndex(geoJSONLayers[layerId]);
                    }
                }
            }
        },
        layersRenderer (layersRenderer, oldLayersRenderer) {
            for (const layerId in layersRenderer) {
                if (layersRenderer.hasOwnProperty(layerId)) {
                    const layerRenderer = layersRenderer[layerId];
                    if (geoJSONLayers.hasOwnProperty(layerId)) {
                        const renderer = createdRenderer(layerRenderer);
                        geoJSONLayers[layerId].setRenderer(renderer);
                    }
                }
            }
        },
        async layersSource (layersSource, oldLayersSource) {
            this.updateGeoJSONLayers(layersSource, oldLayersSource);
        },
        layerSymbolScaling (symbolScaling) {
            /// TODO:图标大小直接调用了mapboxgl api 且仅考虑油站层
            for (const layerId in symbolScaling) {
                const scal = symbolScaling[layerId];
                const mapboxLayerId = `${layerId}_layer_0`;
                /// TODO:图标大小发生更变后，尚未处理文本标签、选择状态的样式
                map._map.getLayer(mapboxLayerId) && map._map.setLayoutProperty(mapboxLayerId, 'icon-size', scal);
            }
        }
    }
}

export default mixin;