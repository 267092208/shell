import { mapState } from 'vuex';
import { map } from './map';

const selectFeatureLayer = HTmap.geoJSONLayer("selectFeatureLayer", {
    renderer: HTmap.simpleRenderer(),
    source: HTmap.geoJSONSource({
        "type": "FeatureCollection",
        "features": []
    }),
    isCluster: false
});
let lastSelectsymbolScaling = { width: 0, height: 0 };
let lastSelectSymbol;
const mixin = {
    data () {
        return {
        }
    },
    computed: {
        ...mapState({
            selectFeatures: state => state.selectFeature.selectFeatures,
            selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
            symbolScaling: state => state.layer.symbolScaling
        })
    },
    methods: {
        async initSelect () {
            map.addLayer(selectFeatureLayer);
            map.setLayerIndex(selectFeatureLayer, 1);
        },
    },
    watch: {
        // selectFeatures (selectFeatures, oldSelectFeatures) {
        //     setTimeout(() => {
        //         // 如果没有被选中的图层或数据，清空选择层
        //         if (this.selectFeatureLayer == null || this.selectFeatures.length == 0) {
        //             selectFeatureLayer.setSource(HTmap.geoJSONSource({
        //                 "type": "FeatureCollection",
        //                 "features": selectFeatures
        //             }));
        //         }
        //         else {
        //             // 取渲染器的默认符号判断渲染的类型
        //             const renderer = this.layersRenderer[this.selectFeatureLayer.id];
        //             const symbol = renderer.symbol || renderer.defaultSymbol;
        //             // 如果选择符号发生了变更，则重新生成一个选择图层的渲染器
        //             let selectLayerRenderer;
        //             if (symbol != lastSelectSymbol) {
        //                 // let currentSelectSymbol;
        //                 if (symbol.type == 'picture-marker') {
        //                     // 对于点符号，生成一个红色的方形外框图标作为选中符号
        //                     const { width, height } = symbol;
        //                     const canvas = document.createElement('canvas');
        //                     canvas.width = width + 2;
        //                     canvas.height = height + 2;
        //                     const context = canvas.getContext('2d');
        //                     context.strokeStyle = '#f00';
        //                     context.lineWidth = 3;
        //                     context.strokeRect(0, 0, canvas.width, canvas.height);
        //                     selectLayerRenderer = HTmap.simpleRenderer(HTmap.pictureMarkerSymbol({
        //                         url: canvas.toDataURL(),
        //                         width: canvas.width,
        //                         height: canvas.height,
        //                         anchor: 'center'
        //                     }));
        //                 }
        //                 else if (symbol.type == 'simple-Line') {
        //                     // 对于线符号，生成一条比默认线宽更宽的线符号
        //                 }
        //                 else if (symbol.type == 'simple-fill') {
        //                     // 对于多边形填充，生成一个蓝色默认填充符号
        //                 }
        //                 else {
        //                     throw `不支持的选择类型${symbol.type}`;
        //                 }
        //                 lastSelectSymbol = symbol;
        //             }
        //             // 更新渲染器
        //             selectLayerRenderer && selectFeatureLayer.setRenderer(selectLayerRenderer);
        //             // 更换数据
        //             const geoJSONSource = HTmap.geoJSONSource({
        //                 "type": "FeatureCollection", "features":
        //                     selectFeatures
        //             })
        //             selectFeatureLayer.setSource(geoJSONSource);
        //         }
        //     }, 1)
        // },
        selectFeatures (selectFeatures, oldSelectFeatures) {
            /// TODO:选择图层为防止引擎封装的setSource/setRenderer会重新移除添加图层导致顺序bug 直接使用mapboxgl api
            setTimeout(() => {
                if (this.selectFeatureLayer && this.selectFeatures.length) {
                    /// TODO:选择图层的符号直接采用了mapboxgl api红色方框,同时仅针对图标层
                    const scale = this.symbolScaling[this.selectFeatureLayer.id];
                    if (lastSelectsymbolScaling != scale) {
                        const renderer = this.layersRenderer[this.selectFeatureLayer.id];
                        const symbol = renderer.symbol || renderer.defaultSymbol;
                        const { width, height } = symbol;

                        // 绘制方框
                        const canvas = document.createElement('canvas');
                        canvas.width = ((width * scale) + 2) | 0;
                        canvas.height = ((height * scale) + 2) | 0;
                        const context = canvas.getContext('2d');
                        context.strokeStyle = '#f00';
                        context.lineWidth = 3;
                        context.strokeRect(0, 0, canvas.width, canvas.height);
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                        // 更新图像
                        const imageId = `selectFeatureLayer_image`;
                        if (map._map.hasImage(imageId)) {
                            /// TODO:更新选择图标的大小bug：mapboxgl不允许更新已有图像的尺寸
                            map._map.updateImage(imageId, imageData);
                        }
                        else {
                            map._map.addImage(imageId, imageData);
                        }

                        // 配置样式
                        map._map.setLayoutProperty(`selectFeatureLayer_layer_0`, 'icon-image', imageId);
                        map._map.setPaintProperty(`selectFeatureLayer_layer_0`, 'icon-translate', [0, 0]);

                        lastSelectsymbolScaling = scale;
                    }
                }
                // 更新数据
                map._map.getSource(`selectFeatureLayer_source`).setData({
                    "type": "FeatureCollection",
                    "features": selectFeatures
                });
            }, 1)
        }
    }
};

export default mixin;