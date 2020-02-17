import Vue from 'vue'
import ls from '@/utils/localStorage.js';
Vue.use(ls.Storage, ls.options);
/**
 * TODO:百度地图 未完成
 * 底图切片数据源
 * @type {{[sourceKey:string]:HTmap.rasterSource }}
 */
const baseMapRasterSource = {
    /**
     *  @description  创建无底图数据源
     * **/
    no_base_map: HTmap.rasterSource({
        tiles: [

        ]
    }),
    /**
     * @description 创建Google地图
    * **/
    'Google地图': HTmap.rasterSource({
        tiles: [
            // [].replace()
            [
                'https://mt0.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile',
                'https://mt1.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile',
                'https://mt2.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile',
                'https://mt3.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile'
            ]
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    "Google地图英文":
        HTmap.rasterSource({
            tiles: [
                [
                    'https://mt0.google.cn/vt/lyrs=m@207000000&hl=en-US&gl=EN&src=app&x={x}&y={y}&z={z}&s=Galile',
                    'https://mt1.google.cn/vt/lyrs=m@207000000&hl=en-US&gl=EN&src=app&x={x}&y={y}&z={z}&s=Galile',
                    'https://mt2.google.cn/vt/lyrs=m@207000000&hl=en-US&gl=EN&src=app&x={x}&y={y}&z={z}&s=Galile',
                    'https://mt3.google.cn/vt/lyrs=m@207000000&hl=en-US&gl=EN&src=app&x={x}&y={y}&z={z}&s=Galile'
                ]
            ],
            minzoom: 1,
            maxzoom: 18
        }),
    /**
     * @description 创建Google影像有路网数据源
    * **/
    "Google影像有路网": HTmap.rasterSource({
        tiles: [
            [
                'https://mt0.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
                'https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
                'https://mt2.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
                'https://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali'
            ],
            [
                'https://mt0.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
                'https://mt1.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
                'https://mt2.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
                'https://mt3.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil'
            ]
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    /**
    * @description 创建Google影像无路网数据源
    * **/
    "Google影像无路网": HTmap.rasterSource({
        tiles: [
            [
                'https://mt0.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
                'https://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
                'https://mt2.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
                'https://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali'
            ]
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    "Google影像英文": HTmap.rasterSource({
        tiles: [
            [0, 1, 2, 3].map(t => 'https://mt{s}.google.cn/vt/lyrs=s&hl=en-US&gl=EN&x={x}&y={y}&z={z}&s=Gali'.replace("{s}", t)),
            [0, 1, 2, 3].map(t => 'https://mt{s}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=en-US&gl=cn&x={x}&y={y}&z={z}&s=Galil'.replace("{s}", t))
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    "高德地图": HTmap.rasterSource({
        tiles: [
            [
                'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                'https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
            ]
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    "高德影像": HTmap.rasterSource({
        tiles: [
            [1, 2, 3, 4].map(t => 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'.replace("{s}", t))
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    "天地图": HTmap.rasterSource({
        tiles: [
            [0, 1, 2, 3, 4, 5, 6, 7].map(t => 'https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b'.replace("{s}", t))
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    '天地图影像': HTmap.rasterSource({
        tiles: [
            [0, 1, 2, 3, 4, 5, 6, 7].map(t => 'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b'.replace("{s}", t)),
            [0, 1, 2, 3, 4, 5, 6, 7].map(t => 'https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b'.replace("{s}", t))
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    "天地图地形": HTmap.rasterSource({
        tiles: [
            [0, 1, 2, 3, 4, 5, 6, 7].map(t => 'https://t{s}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b'.replace("{s}", t)),
            [0, 1, 2, 3, 4, 5, 6, 7].map(t => 'https://t{s}.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b'.replace("{s}", t))
        ],
        minzoom: 1,
        maxzoom: 18
    }),
    /**
     * TODO:未有
     */
    "百度地图": HTmap.rasterSource({
        tiles: [

        ],
        minzoom: 1,
        maxzoom: 18
    }),
    // TODO:未有
    "百度影像": HTmap.rasterSource({
        tiles: [

        ],
        minzoom: 1,
        maxzoom: 18
    })
};
/**
 * 底图Geojson数据源
 * @type {{[sourceKey:string]:HTmap.rasterSource }}
 */
const baseMapGeojsonSource = {

}
/**
 * sourceKey与数据源  baseMapRasterSource 和 baseMapGeojsonSource 有关联
 * @layerType ---图层类型
 * @type {Array<{
 * name:string,
 * sourceKey:string,
 * src:string,
 * layerType:'baseMapRasterLayer'|'baseMapGeojsonLayer'
 * }>}
 */
const baseMapSourceList = [
    {
        name: "空白底图",
        sourceKey: "no_base_map",
        src: "",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "Google地图",
        sourceKey: "Google地图",
        src: "./baseMap/googlemap.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "Google地图(英文)",
        sourceKey: "Google地图英文",
        src: "./baseMap/GoogleEn.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "Google影像(有路网)",
        sourceKey: "Google影像有路网",
        src: "./baseMap/Googleyingxiang.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "Google影像(无路网)",
        sourceKey: "Google影像无路网",
        src: "./baseMap/Googleyingxiang.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "Google影像(英文)",
        sourceKey: "Google影像英文",
        src: "./baseMap/GoogelyingxiangEn.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "高德地图",
        sourceKey: "高德地图",
        src: "./baseMap/gaodemap.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "高德影像",
        sourceKey: "高德影像",
        src: "./baseMap/gaodeyingxiang.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "天地图",
        sourceKey: "天地图",
        src: "./baseMap/tiandimap.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "天地图影像",
        sourceKey: "天地图影像",
        src: "./baseMap/tiandiyingxiang.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "天地图地形",
        sourceKey: "天地图地形",
        src: "./baseMap/googlemap.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "百度地图",
        sourceKey: "百度地图",
        src: "./baseMap/googlemap.png",
        layerType: "baseMapRasterLayer"
    },
    {
        name: "百度影像",
        sourceKey: "百度影像",
        src: "./baseMap/gaodeyingxiang.png",
        layerType: "baseMapRasterLayer"
    }
];
/**
 * 设置默认底图 选择 Google地图
 */
const currentBaseMapSource = Vue.ls.get("currentBaseMapSource") || baseMapSourceList[1];
Vue.ls.set("currentBaseMapSource", baseMapSourceList[1]);
/*
* 切片栅格图层
*/
const baseMapRasterLayer = HTmap.rasterLayer("raster", {
    source: baseMapRasterSource[currentBaseMapSource.sourceKey]
});
//geojson数据源 TODO:目前是未实现
const baseMapGeojsonLayer = false;
const baseMapData = {
    baseMapRasterSource,
    baseMapRasterLayer,
    baseMapGeojsonSource,
    baseMapGeojsonLayer,
    baseMapSourceList,
    currentBaseMapSource
}
export {
    baseMapRasterSource,
    baseMapRasterLayer,
    baseMapGeojsonSource,
    baseMapGeojsonLayer,
    baseMapSourceList,
    currentBaseMapSource
};
export default baseMapData;