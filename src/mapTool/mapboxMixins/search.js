/**
 * 搜索数据展示
 */
import { mapState } from "vuex";
import { map } from "./map";
// 小弹框
let popup = null;

const renderer = HTmap.simpleRenderer();
console.log(renderer);
/**
 * 显示搜索
 * @type {}
 */
const searchFeatureLayer = HTmap.geoJSONLayer("searchFeatureLayer", {
  renderer,
  source: HTmap.geoJSONSource({
    type: "FeatureCollection",
    features: []
  }),
  isCluster: false
});
//点击此单触发的事件
searchFeatureLayer.on("click", function(t) {
  console.log(t);
});
const mixin = {
  computed: {
    ...mapState({
      resultFeatures: state => state.search.resultFeatures,
      searchLocationFeatures: state => state.search.locationFeatures
    })
  },
  methods: {
    async initSearch() {
      map.addLayer(searchFeatureLayer);
      // 30 默认的图标的大小是32
      popup = HTmap.popup(map, {
        className: "popup",
        content: "在这里",
        offset: 30
      });
      // setMapCenter
    }
  },
  watch: {
    resultFeatures(resultFeatures) {
      // 更换数据
      console.log(resultFeatures);
      // const geoJSONSource = HTmap.geoJSONSource({
      //     "type": "FeatureCollection", "features":
      //         resultFeatures
      // })
      // searchFeatureLayer.setSource(geoJSONSource);

      /// TODO:更换搜索结果集采用mapboxgl api
      map._map.getSource(`searchFeatureLayer_source`).setData({
        type: "FeatureCollection",
        features: resultFeatures
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
            map.setBounds({ minx, miny, maxx, maxy });
          }
        } else if (nfs.length == 1) {
          const f = nfs[0];
          const [x, y] = f.geometry.coordinates;
          map.setCenter({ x, y });
        }
      } else {
        // 如果结果集被清空，关闭弹出框
        popup.close();
      }
    },
    searchLocationFeatures(val) {
      const [x, y] = val.geometry.coordinates;
      popup.setContent(val.getPopupHtml(val));
      popup.open({ x, y });
      this.$store.dispatch("setMapCenter", { x, y });
    }
  }
};
export default mixin;
