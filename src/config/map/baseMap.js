/**
 * @module 地图底图配置显示的有哪些地图
 */
import XYZ from "ol/source/XYZ";
import DB09TileSource from "@/mapTool/DB09TileSource";
/**
 * 底图栅格数据源
 * TODO:设计调用不好 目前的模式
 * @type {{[sourceKey:string]:{source:XYZ,type:"GCJ02"|"EPSG:3857"|"DB09"|"等"} }}
 */
const ua = navigator.userAgent.toLowerCase();
const testUa = regexp => regexp.test(ua);
let scale = 1;
let zDirection = 0;
let tilePixelRatio = 1;
let google = {
  m: "m@207000000",
  h: "h@207000000",
  s: "s"
};
if (
  testUa(/android|adr/g) ||
  testUa(/ios|iphone|ipad|ipod|iwatch/g) ||
  testUa(/mobile/g)
) {
  //移动端
  scale = 2;
  zDirection = -1;
  tilePixelRatio = 2;
  google.m = "m&scale=2";
  google.h = "h&scale=2";
  google.s = "s&scale=2";
}
const baseMapRasterSource = {
  no_base_map: false,
  高德地图: [
    {
      source: new XYZ({
        url:
          "https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        attributions: "&copy 星罗地图 | TileData-高德地图-GS(2018)1709号",
        maxZoom: 18, //默认18
        minZoom: 0, //默认0
        // projection: 'EPSG:4326',
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 18, //默认18
      minZoom: 3
    }
  ],
  高德影像: [
    {
      source: new XYZ({
        url:
          "https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        maxZoom: 18, //默认18
        minZoom: 0, //默认0
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 18, //默认18
      minZoom: 3
    },
    {
      source: new XYZ({
        url:
          "https://webst0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        attributions: "&copy 星罗地图 | TileData-高德地图-GS(2018)1709号",
        maxZoom: 18, //默认18
        minZoom: 0, //默认0
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 18, //默认18
      minZoom: 3
    }
  ],
  Google地图: [
    {
      source: new XYZ({
        url: `https://mt{0-3}.google.cn/vt/lyrs=${google.m}&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile`,
        attributions: "&copy 星罗地图 | TileData-GoogleMap-GS(2018)5572号",
        maxZoom: 22, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 22, //默认18
      minZoom: 0
    }
  ],
  Google地图英文: [
    {
      source: new XYZ({
        url: `https://mt{0-3}.google.cn/vt/lyrs=${google.m}&hl=EN-US&gl=EN&src=app&x={x}&y={y}&z={z}&s=Galile`,
        attributions: "&copy 星罗地图 | TileData-GoogleMap-GS(2018)5572号",
        maxZoom: 22, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 22, //默认18
      minZoom: 0
    }
  ],
  Google影像有路网: [
    {
      source: new XYZ({
        url: `https://mt{0-3}.google.cn/vt/lyrs=${google.s}&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali`,
        attributions: "&copy 星罗地图 | TileData-GoogleMap-GS(2018)5572号",
        maxZoom: 22, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 22, //默认18
      minZoom: 0
    },
    {
      source: new XYZ({
        url: `https://mt{0-3}.google.cn/vt/imgtp=png32&lyrs=${google.h}&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil`,
        attributions: "&copy 星罗地图 | TileData-GoogleMap-GS(2018)5572号",
        maxZoom: 22, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 22, //默认18
      minZoom: 0
    }
  ],
  Google影像无路网: [
    {
      source: new XYZ({
        url: `https://mt{0-3}.google.cn/vt/lyrs=${google.s}&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali`,
        attributions: "&copy 星罗地图 | TileData-GoogleMap-GS(2018)5572号",
        maxZoom: 22, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 22, //默认18
      minZoom: 0
    }
  ],
  Google影像英文: [
    {
      source: new XYZ({
        url: `https://mt{0-3}.google.cn/vt/lyrs=${google.s}&hl=EN-US&gl=EN&x={x}&y={y}&z={z}&s=Gali`,
        attributions: "&copy 星罗地图 | TileData-GoogleMap-GS(2018)5572号",
        maxZoom: 22, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 22, //默认18
      minZoom: 0
    },
    {
      source: new XYZ({
        url: `https://mt{0-3}.google.cn/vt/imgtp=png32&lyrs=${google.h}&hl=EN-US&gl=cn&x={x}&y={y}&z={z}&s=Galil`,
        attributions: "&copy 星罗地图 | TileData-GoogleMap-GS(2018)5572号",
        maxZoom: 22, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "GCJ02",
      maxZoom: 22, //默认18
      minZoom: 0
    }
  ],
  天地图: [
    {
      source: new XYZ({
        url:
          "https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b",
        attributions: "&copy 星罗地图 | TileData-天地图-GS(2019)1719号",
        maxZoom: 18, //默认18
        minZoom: 0,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "EPSG:3857",
      maxZoom: 18, //默认18
      minZoom: 0
    },
    {
      source: new XYZ({
        url:
          "https://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b",
        attributions: "&copy 星罗地图 | TileData-天地图-GS(2019)1719号",
        maxZoom: 18, //默认18
        minZoom: 0,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "EPSG:3857",
      maxZoom: 18, //默认18
      minZoom: 0
    }
  ],
  天地图影像: [
    {
      source: new XYZ({
        url:
          "https://t{0-7}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b",
        attributions: "&copy 星罗地图 | TileData-天地图-GS(2019)1719号",
        maxZoom: 18, //默认18
        minZoom: 0,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "EPSG:3857",
      maxZoom: 18, //默认18
      minZoom: 0
    },
    {
      source: new XYZ({
        url:
          "https://t{0-7}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=c26cf19d1e197d4fc55c61f2ce9aae4b",
        attributions: "&copy 星罗地图 | TileData-天地图-GS(2019)1719号",
        maxZoom: 18, //默认18
        minZoom: 0,
        // projection: 'EPSG:4326'
        projection: "EPSG:3857" //坐标系
      }),
      type: "EPSG:3857",
      maxZoom: 18, //默认18
      minZoom: 0
    }
  ],
  百度地图: [
    {
      source: new DB09TileSource({
        url: `http://online{0-4}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&b=0&limit=60&scaler=${scale}&udt=20200310`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 3, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  百度影像: [
    {
      source: new DB09TileSource({
        url:
          "http://shangetu{1-4}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 3, //默认0
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    },
    {
      source: new DB09TileSource({
        url:
          "http://online{1-4}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020",
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 3, //默认0
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(暗黑)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=dark`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(午夜)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=midnight`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(灰色)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=grayscale`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(网格)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=hardedge`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(light)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=light`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(redalert)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=redalert`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(pink)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=pink`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(darkgreen)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=darkgreen`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(bluish)": [
    {
      source: new DB09TileSource({
        url: `http://api{0-2}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=${scale}&customid=bluish`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        zDirection,
        tilePixelRatio,
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 19, //默认18
      minZoom: 3
    }
  ],
  "百度地图(纯色)": [
    {
      source: new DB09TileSource({
        url: `https://api.map.baidu.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20200310&scale=${scale}&ak=D3be86ab6887abdaebaa5b270c94d932&styles=t%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Atown%7Ce%3Aall%7Cv%3Aoff%2Ct%3Adistrict%7Ce%3Aall%7Cv%3Aoff%2Ct%3Abackground%7Ce%3Aall%7Cv%3Aon%7Cc%3A%23444444ff%2Ct%3Asubway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Arailway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aboundary%7Ce%3Aall%7Cv%3Aon%7Cc%3A%23ff0000ff`,
        attributions: "&copy 星罗地图 | TileData-Baidu-GS(2019)5218号",
        maxZoom: 19, //默认18
        minZoom: 0, //默认0
        projection: "EPSG:3857" //坐标系
      }),
      type: "DB09",
      maxZoom: 22, //默认18
      minZoom: 3
    }
  ]
};
const baseMapRaster = {};

/**
 * TODO:未有数据源
 * 底图矢量数据源
 */
const baseMapGeojsonSource = {};
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
  {
    name: "百度地图",
    sourceKey: "百度地图",
    src: "./baseMap/baidumap.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度影像",
    sourceKey: "百度影像",
    src: "./baseMap/baiduyingxiang.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(暗黑)",
    sourceKey: "百度地图(暗黑)",
    src: "./baseMap/baidumapdark.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(午夜)",
    sourceKey: "百度地图(午夜)",
    src: "./baseMap/baidumapmidnight.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(灰色)",
    sourceKey: "百度地图(灰色)",
    src: "./baseMap/baidumapgrayscale.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(网格)",
    sourceKey: "百度地图(网格)",
    src: "./baseMap/baidumaphardedge.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(light)",
    sourceKey: "百度地图(light)",
    src: "./baseMap/baidumaplight.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(redalert)",
    sourceKey: "百度地图(redalert)",
    src: "./baseMap/baidumapredalert.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(pink)",
    sourceKey: "百度地图(pink)",
    src: "./baseMap/baidumappink.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(bluish)",
    sourceKey: "百度地图(bluish)",
    src: "./baseMap/baidumapbluish.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(darkgreen)",
    sourceKey: "百度地图(darkgreen)",
    src: "./baseMap/baidumapdarkgreen.png",
    layerType: "baseMapRasterLayer"
  },
  {
    name: "百度地图(纯色)",
    sourceKey: "百度地图(纯色)",
    src: "./baseMap/baidumapcunse.png",
    layerType: "baseMapRasterLayer"
  }
];
export { baseMapRasterSource, baseMapGeojsonSource, baseMapSourceList };
