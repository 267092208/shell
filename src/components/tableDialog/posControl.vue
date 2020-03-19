<template>
  <el-dialog
    title="位置"
    :visible="dialogVisible"
    width="800px"
    :before-close="handleClose"
    center
    custom-class="dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
     @opened="initDialog"
    v-dialogDrag
  >
    <div class="content">
      <!-- <el-input placeholder="视野内搜索" class="input-with-select search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>-->
      <Search class="search" />

      <div class="map" ref="map" id="map">
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" icon="el-icon-remove-outline" @click="handleClose">取 消</el-button>
      <el-button size="mini" icon="el-icon-upload2" type="primary">上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import XLSX from "xlsx";
import { mapState } from "vuex";
import ZoomInOut from "@/components/mapTool/ZoomInOut.vue";
import popup from "@/components/mapTool/popup.vue";
import Search from "@/components/mapTool/Search.vue";
import mapboxMixins from "@/mapTool/mapboxMixins2";
import createdMap from "@/mapTool/miniMap/map";
import gcoord from 'gcoord'

export default {
  props: ["dialogVisible", "editPoint"],
  mixins: [...mapboxMixins],
  computed: {
    ...mapState({ currentLayer: state => state.layer.currentLayer })
  },
  data() {
    return {};
  },
  methods: {
    handleClose(done) {
      this.$emit("update:dialogVisible", false);
    },
    async initDialog() {
      console.log(this.editPoint, this.$refs.map);
      if (this.$refs.map) {
        const lnglat = gcoord.transform(this.editPoint, gcoord.WGS84, gcoord.EPSG3857)
        createdMap({ target: this.$refs.map, editPoint: lnglat });
      }
    }
  },
  async mounted() {
    // await this.intiMap();
    // await this.initMap();
    // await this.mapLoaded();
    // await this.initBaseMap();
    // await this.initSelect();
    // await this.initLayers();
    // await this.initSearch();
    // await this.initMapState();
    //弹窗
    // await this.$refs.popup.initPopup()
  },
  components: {
    ZoomInOut,
    popup,
    Search
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-message__content {
  width: 80%;
}
/deep/ .el-dialog__body {
  padding: 3px;
}
.content {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 500px;
  position: relative;
  padding-top: 45px;
  .search {
    margin-bottom: 3px;
    flex: 1;
    width: 100%;
    margin: 0;
  }
  .map {
    flex-grow: 1;
    width: 100%;
    position: relative;
  }
}
</style>