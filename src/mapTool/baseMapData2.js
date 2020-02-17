/**
 * @module 地图底图配置显示的有哪些地图
 */
import Vue from 'vue'
import XYZ from 'ol/source/XYZ';
/**
 * 底图栅格数据源
 * TODO:坐标系未完善
 * @type {{[sourceKey:string]:XYZ }}
 */
const baseMapRasterSource = {
    'no_base_map': new XYZ({
        url: ''
    }),
    '高德地图':[ 
        new XYZ({
            url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            attributions: '&copy TileData-高德地图-GS(2018)1709号',
            maxZoom: 20,//默认18
            minZoom: 0,//默认0
            // projection: 'EPSG:4326',
        })
    ],
    '高德影像': [
        new XYZ({
            url:'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            maxZoom: 20,//默认18
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        }),
        new XYZ({
            url:'http://webst0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
            attributions: '&copy TileData-高德地图-GS(2018)1709号',
            maxZoom: 20,//默认18
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
    'Google地图': [
        new XYZ({
            url: 'https://mt{0-3}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile',
            attributions: '&copy TileData-GoogleMap-GS(2018)5572号',
            maxZoom: 20,//默认18
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
    'Google地图英文': [
        new XYZ({
            url: 'https://mt{0-3}.google.cn/vt/lyrs=m@207000000&hl=en-US&gl=EN&src=app&x={x}&y={y}&z={z}&s=Galile',
            attributions: '&copy TileData-GoogleMap-GS(2018)5572号',
            maxZoom: 20,//默认18
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
    'Google影像有路网': [
        new XYZ({
            url : 'https://mt{0-3}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
            attributions: '&copy TileData-GoogleMap-GS(2018)5572号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        }),
        new XYZ({
            url:'https://mt{0-3}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil',
            attributions: '&copy TileData-GoogleMap-GS(2018)5572号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
    'Google影像无路网': [
        new XYZ({
            url: 'https://mt{0-3}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali',
            attributions: '&copy TileData-GoogleMap-GS(2018)5572号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
    'Google影像英文': [
        new XYZ({
            url:'https://mt{0-3}.google.cn/vt/lyrs=s&hl=en-US&gl=EN&x={x}&y={y}&z={z}&s=Gali',
            attributions: '&copy TileData-GoogleMap-GS(2018)5572号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        }),
        new XYZ({
            url:'https://mt{0-3}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=en-US&gl=cn&x={x}&y={y}&z={z}&s=Galil',
            attributions: '&copy TileData-GoogleMap-GS(2018)5572号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
    '天地图': [
        new XYZ({
            url:'https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b',
            attributions: '&copy TileData-天地图-GS(2019)1719号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        }),
        new XYZ({
            url:'https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b',
            attributions: '&copy TileData-天地图-GS(2019)1719号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
    '天地图影像': [
        new XYZ({
            url:'https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b',
            attributions: '&copy TileData-天地图-GS(2019)1719号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        }),
        new XYZ({
            url:'http://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b',
            attributions: '&copy TileData-天地图-GS(2019)1719号',
            minZoom: 0,//默认0
            // projection: 'EPSG:4326'
            projection: "EPSG:3857"//坐标系
        })
    ],
}
/**
 * TODO:未有数据源
 * 底图矢量数据源
 */
const baseMapGeojsonSource = {

}
/**
* sourceKey与数据源  baseMapRasterSource 和 baseMapGeojsonSource 有关联
* @name ---地图名称
* @layerType ---图层类型
* @sourceKey ---数据源的key值
* @src ---显示的图片 url
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
]


export {
    baseMapRasterSource,
    baseMapGeojsonSource,
    baseMapSourceList
};
