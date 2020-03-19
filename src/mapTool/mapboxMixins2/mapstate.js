import { mapState } from "vuex";
import { transform, transformExtent } from "ol/proj";
import { map, BaiduView, GCJ02View } from './map';

const mixin = {
  computed: {
    ...mapState({
      inputBounds: state => state.mapState.inputBounds,
      inputCenter: state => state.mapState.inputCenter,
      inputZoom: state => state.mapState.inputZoom
    })
  },
  methods: {
    async initMapState() {
      BaiduView.on("propertychange", () => {
        this.updateMapState();
      });
      GCJ02View.on("propertychange", () => {
        this.updateMapState();
      });
      this.updateMapState();
    },
    updateMapState() {
      let view = map.getView();
      this.$store.state.mapState.bounds = view.calculateExtent();
      const newcenter = view.getCenter();
      const center = this.$store.state.mapState.center;
      if (!center || center[0] != newcenter[0] || center[1] != newcenter[1]) {
        this.$store.state.mapState.center = newcenter;
      }
      const newzoom = view.getZoom();
      const zoom = this.$store.state.mapState.zoom;
      if (!zoom || zoom != newzoom) {
        this.$store.state.mapState.zoom = newzoom;
      }
      // 判断
      if (Math.round(zoom) === view.getMaxZoom()) {
        this.$store.state.mapState.isMaxZoom = true;
      } else {
        this.$store.state.mapState.isMaxZoom = false;
      }
      if (Math.round(zoom) === view.getMinZoom()) {
        this.$store.state.mapState.isMinZoom = true;
      } else {
        this.$store.state.mapState.isMinZoom = false;
      }
    }
  },
  watch: {
    inputBounds(val) {
      let view = map.getView();
      view.fit([val.minx, val.miny, val.maxx, val.maxy], map.getSize());
    },

    inputCenter(val) {
      let view = map.getView();
      val && view.setCenter([val.x, val.y]);
    },

    inputZoom(val) {
      console.log("zoom", val);
      let view = map.getView();
      val && view.setZoom(parseInt(val));
    }
  }
};

export default mixin;
