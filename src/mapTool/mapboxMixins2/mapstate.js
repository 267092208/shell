import { mapState } from "vuex";
import { map } from "./map";
import { transform, transformExtent } from "ol/proj";

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
      let view = map.getView();

      view.on("change:center", () => {
        this.updateMapState();
      });
      this.updateMapState();
    },

    updateMapState() {
      let view = map.getView();
      this.$store.state.mapState.bounds = view.calculateExtent();

      const newcenter = view.getCenter();
      const center = this.$store.state.mapState.center;
      if (!center || center.x != newcenter.x || center.y != newcenter.y) {
        this.$store.state.mapState.center = newcenter;
      }

      const newzoom = view.getZoom();
      const zoom = this.$store.state.mapState.zoom;
      if (!zoom || zoom != newzoom) {
        this.$store.state.mapState.zoom = newzoom;
      }
    }
  },
  watch: {
    inputBounds(val) {
      let view = map.getView();
      let newExtent = transformExtent(
        [val.minx, val.miny, val.maxx, val.maxy],
        "EPSG:4326",
        "EPSG:3857"
      );

      view.fit(newExtent, map.getSize());
    },

    inputCenter(val) {
      console.log("center", val);
      let view = map.getView();
      let newCenter = transform([val.x, val.y], "EPSG:4326", "EPSG:3857");
      val && view.setCenter(newCenter);
    },

    inputZoom(val) {
      console.log("zoom", val);
      let view = map.getView();

      val && view.setZoom(parseInt(val));
    }
  }
};

export default mixin;
