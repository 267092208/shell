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
    <div class="mapbox" ref="mapbox">
      <div ref="popup" class="ol-popup">
      <a @click="popupcloser" class="ol-popup-closer"></a>
      <div class="ol-popup-content" v-html="popupContent"></div>
    </div>
    </div>
  </div>
</template>
<script>
import Search from "@/components/mapTool/Search.vue";
import mapboxMixins from "@/mapTool/mapboxMixins2";
export default {
  name: "mapBox",
  mixins: [...mapboxMixins],
  components: {
    Search
  },
  async mounted() {
    await this.initMap();
    // await this.mapLoaded();
    await this.initBaseMap();
    await this.initSelect();
    await this.initLayers();
    await this.initSearch();
    await this.initMapState();
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

   .ol-popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 160px;
    text-align: left;
    font-size: 14px;
  }
  .ol-popup:after,
  .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 80px;
    margin-left: -10px;
  }
  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 80px;
    margin-left: -11px;
  }
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    &:hover {
      cursor: pointer;
      color: #f00;
    }
  }
  .ol-popup-closer:after {
    content: "✖";
  }
  }


  

  
}
</style>