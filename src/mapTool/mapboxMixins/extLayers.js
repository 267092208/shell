import { mapState } from 'vuex';
import { map } from './map';

/// TODO:扩展图层目前直接使用mapboxgl api 且仅考虑文本和图标符号

const textanchors = [
    {
        "text-anchor": 'left',
        "text-offset": [1, 0]
    },
    {
        "text-anchor": 'top',
        "text-offset": [0, 1]
    },
    {
        "text-anchor": 'right',
        "text-offset": [-1, 0]
    }
]

/**
 * 文本方位策略的使用情况
 * @type {{[layerid:string]:{[index:number]:number}}}
 */
const textanchorsUse = {}

/**
 * 查找并设置文本位置策略
 * @param {*} layerid 
 * @param {*} index 
 */
function textanchor (layerid, index) {
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
function setTextanchor (layerid, index, textanchorIndex) {
    const tuse = textanchorsUse[layerid] || {};
    textanchorsUse[layerid] = tuse;

    if (textanchorIndex >= 0) {
        tuse[index] = textanchorIndex;
    }
    else {
        delete tuse[index];
    }
}

function getExtLayerId (layerid, index) {
    return `${layerid}_extlayer_${index}`;
}

/**
 * 创建或显示扩展图层
 * @param {*} layerid 图层ID
 * @param {*} renderer 扩展图层的渲染器
 * @param {*} index 扩展图层的索引
 */
function showExtLayer (layerid, renderer, index) {
    /// TODO:添加扩展图层时，尚未等待源图层加载，潜在bug
    const source = `${layerid}_source`;
    const id = getExtLayerId(layerid, index);
    if (map._map.getLayer(id)) {
        const tu = textanchor(layerid, index);
        map._map.setLayoutProperty(id, 'text-anchor', tu['text-anchor']);
        map._map.setLayoutProperty(id, 'text-offset', tu['text-offset'] || [0, 0]);
        map._map.setLayoutProperty(id, 'visibility', 'visible');
    }
    else {
        // 文本扩展层
        if (renderer.type == 'simple' || renderer.uniqueValueInfos[1].symbol.type == 'text') {
            const symbol = renderer.symbol || renderer.uniqueValueInfos[1].symbol;
            let filter;
            if (renderer.type == 'unique-value') {
                const nvalues = renderer.uniqueValueInfos.filter(u => u.symbol == renderer.defaultSymbol).map(u => u.value.toString());
                filter = ["match", ["to-string", ["get", renderer.field]], nvalues, false, true];
            }
            const layerinfo = {
                id,
                source,
                type: 'symbol',
                layout: {
                    "text-field": ["to-string", ["get", symbol.field]],
                    "text-size": symbol.size || 12,
                    ...textanchor(layerid, index)
                },
                paint: {
                    "text-color": symbol.color || '#00f'
                }
            };
            /// TODO:油站的目标站编号文本标签的filter不生效bug
            filter && (layerinfo.filter = filter);
            map._map.addLayer(layerinfo);
        }
        // 图标扩展层
        else if (renderer.type == 'unique-value') {
            // 过滤掉符号为默认符号的部分
            // 此处正常应为显示全部符号，默认符号为空而已
            const nvalues = renderer.uniqueValueInfos.filter(u => u.symbol == renderer.defaultSymbol).map(u => u.value.toString());
            const filter = ["match", ["to-string", ["get", renderer.field]], nvalues, false, true];
            const vus = renderer.uniqueValueInfos.filter(u => u.symbol !== renderer.defaultSymbol);
            const imagevs = [];
            const offsets = [];
            const imageLoadPs = [];
            for (let i = 0; i < vus.length; i++) {
                const u = vus[i];
                const imageid = `${id}_${i}`;
                imageLoadPs.push(new Promise(r => {
                    map._map.loadImage(u.symbol.url, (error, image) => {
                        if (!map._map.hasImage(imageid)) {
                            map._map.addImage(imageid, image);
                            r();
                        }
                    });
                }));
                imagevs.push(u.value.toString(), imageid);
                offsets.push(u.value.toString(), ["literal", [u.symbol.xoffset || 0, u.symbol.yoffset || 0]]);
            }
            Promise.all(imageLoadPs).then(() => {
                map._map.addLayer({
                    id,
                    source,
                    type: 'symbol',
                    layout: {
                        "icon-image": [
                            "match",
                            ["to-string", ["get", renderer.field]],
                            ...imagevs,
                            ''
                        ],
                        "icon-offset": [
                            "match",
                            ["to-string", ["get", renderer.field]],
                            ...offsets,
                            ["literal", [0, 0]]
                        ],
                        "icon-allow-overlap": true
                    },
                    filter
                });
            });
        }
    }
}

function hideExtLayer (layerid, index) {
    if (extLayerExist(layerid, index)) {
        map._map.setLayoutProperty(getExtLayerId(layerid, index), 'visibility', 'none');
        setTextanchor(layerid, index, -1);
    }
}

function extLayerExist (layerid, index) {
    return !!map._map.getLayer(getExtLayerId(layerid, index))
}

const mixin = {
    computed: {
        ...mapState({
            layersVisibleEx: state => state.layer.visible,
            extLayers: state => state.layer.extLayers,
        })
    },
    methods: {
        async initExtLayers () { },
        updateExtlayers () {
            for (const layerid in this.extLayers) {
                const layerRVs = this.extLayers[layerid];
                const layerVisible = this.layersVisible[layerid];
                for (let i = 0; i < layerRVs.length; i++) {
                    const { renderer, visible } = layerRVs[i];
                    if (layerVisible && visible) {
                        showExtLayer(layerid, renderer, i);
                    }
                    else {
                        hideExtLayer(layerid, i);
                    }
                }
            }
        }
    },
    watch: {
        extLayers (val) {
            this.updateExtlayers();
        },
        layersVisibleEx () {
            this.updateExtlayers();
        }
    }
}

export default mixin;