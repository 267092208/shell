import { mapState } from "vuex";
import { map } from "./map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { toVectorFeature } from "./utils";


import {
  Circle as CircleStyle,
  Icon,
  Style
} from "ol/style";

//小弹窗
let popupOverlay = null;

/**
 * 显示搜索
 * @type {}
 */
let searchSource = new VectorSource();
const searchFeatureLayer = new VectorLayer({
  source: searchSource
});

const mixin = {
  data() {
    return {
      popupContent: ""
    };
  },
  computed: {
    ...mapState({
      resultFeatures: state => state.search.resultFeatures,
      searchLocationFeatures: state => state.search.locationFeatures
    })
  },
  methods: {
    async initSearch() {
      map.addLayer(searchFeatureLayer);
      searchFeatureLayer.setProperties({ layerType: "searchLayer" });
      searchFeatureLayer.setZIndex(3);
      this.initPopup();
      
    },
    createSearchStyle() {
      let style = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "./images/search.png"
        })
      });
      return style;
    },
    initPopup() {
      popupOverlay = new Overlay({
        positioning: "bottom-center",
        element: this.$refs.popup,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        },
        offset: [-80 + 48, -30]
      });

      map.addOverlay(popupOverlay);
    },
    popupcloser() {
      this.$store.dispatch("locationFeatures", null);  
    }
  },
  watch: {
    resultFeatures(resultFeatures, oldResultFeatures) {
      searchSource.clear();
      let searchFeature = toVectorFeature(resultFeatures)
      let searchStyle = this.createSearchStyle();

      searchFeature.forEach(item => {
        item.setStyle(searchStyle);
        searchSource.addFeature(item);
      });

      if (resultFeatures.length) {
        // 设置地图范围
        const nfs = resultFeatures.filter(f => {
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
            this.$store.dispatch("setMapBounds", {
              minx,
              miny,
              maxx,
              maxy
            });
          }
        } else if (nfs.length == 1) {
          const f = nfs[0];
          const [x, y] = f.geometry.coordinates;
          this.$store.dispatch("setMapCenter", {
            x,
            y
          });
        }
      } else {
        // 如果结果集被清空，关闭弹出框
        popupOverlay.setPosition(undefined);

      }
    },
    searchLocationFeatures(val) {
      if (val) {
        this.popupContent = val.getPopupHtml(val);
        let [x, y] = val.geometry.coordinates;
        popupOverlay.setPosition(fromLonLat([x, y], "EPSG:3857"));
        this.$store.dispatch("setMapCenter", { x, y });
      }else{
      popupOverlay.setPosition(undefined);
      }
    }
  }
};
export default mixin;
