<template>
  <div class="map-container">
    <BaseMapSource
      :currentBaseMapSource="currentBaseMapSource"
      @setCurrentBaseMapSource="setCurrentBaseMapSource"
      :baseMapSourceList="baseMapSourceList"
      top="10px"
      right="10px"
    ></BaseMapSource>
    <Search />
    <ZoomInOut />
    <Measure />
    <popup ref="popup" />
    <div class="mapbox" ref="mapWrap"></div>
  </div>
</template>
<script>
import Search from "@/components/mapTool/Search.vue";
import mapboxMixins from "@/mapTool/mapboxMixins2";
import ZoomInOut from "@/components/mapTool/ZoomInOut.vue";
import Measure from "@/components/mapTool/Measure.vue";
import popup from "@/components/mapTool/popup.vue";

export default {
  name: "mapBox",
  mixins: [...mapboxMixins],
  components: {
    Search,
    ZoomInOut,
    Measure,
    popup
  },
  async mounted() {
    await this.initMap();
    // await this.mapLoaded();
    await this.initBaseMap();
    await this.initSelect();
    await this.initLayers();
    await this.initSearch();
    await this.initMapState();
    //弹窗
    await this.$refs.popup.initPopup()
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;
  .mapbox {
    width: 100%;
    height: 100%;

    /deep/.ol-attribution {
      font-size: 14px;
    }

    /deep/.ol-scale-line {
      bottom: 0;
    }
  }
}
</style>