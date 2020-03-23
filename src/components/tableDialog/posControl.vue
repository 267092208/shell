<template>
  <el-dialog
    title="位置"
    :visible="dialogVisible"
    width="800px"
    :before-close="handleClose"
    center
    custom-class="dialog"
    @opened="initDialog"
    @close="closeDialog"
    v-dialogDrag
    append-to-body
    :modal="false"
    ref="dialog"
  >
    <div class="content">
      <el-input
        placeholder="视野内搜索(百度数据)"
        @keyup.enter.native="searchBaidu"
        class="input-with-select search"
        v-model="keyword"
      >
        <el-button
          slot="append"
          :loading="searching"
          @keyup.enter="searchBaidu"
          icon="el-icon-search"
          @click="searchBaidu"
        ></el-button>
      </el-input>

      <div class="map" ref="map" id="map"  v-loading="resfresh"></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-row type="flex">
        <el-col :span="24" class="el-upload__tip" style="color: #909399; text-align: left;">
          地图操作：
          <strong>可滚轮缩放地图，按住左键拖动地图。</strong>修改位置：
          <strong>请拖动红标签到目标位置并点击确认。</strong>
        </el-col>
        <el-button
          style="float:right;"
          size="small"
          icon="el-icon-remove-outline"
          @click="handleClose"
        >取 消</el-button>
        <el-button
          style="float:right;"
          :loading="updating"
          size="small"
          icon="el-icon-refresh"
          type="primary"
          @click="updateLocation"
        >确 认</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import XLSX from "xlsx";
import { mapState } from "vuex";
import mapboxMixins from "@/mapTool/mapboxMixins2";
import createdMap from "@/mapTool/miniMap/map";
import gcoord from "gcoord";
import { updateLocation } from "@/data/table";
let map;
export default {
  props: ["dialogVisible", "editPoint", "data"],
  mixins: [...mapboxMixins],
  computed: {
    ...mapState({ currentLayer: state => state.layer.currentLayer })
  },
  data() {
    return {
      resfresh: false,
      keyword: "",
      map: null,
      updating: false,
      searching: false,
      dataId: null
    };
  },
  methods: {
    handleClick(e) {
      const dialog = this.$refs.dialog
      const children = dialog.$el.children;
      // dialog.$el.outerHTML = '';
      dialog.$el.className = ''
      dialog.$el.style.cssText = 'width: 100%; height: 0; margin: 0; padding: 0; position: static; top: 0; left: 0; zindex: 4000'
      // console.log(dialog)
      children[0].style.cssText = "position: absolute; left: calc(50% - 400px); top: 15vh; z-index: 4000; width: 800px;"
      // document.body.appendChild(children[0]);
      // console.log(document.body);
    },
    handleClose(done) {
      console.log('123')
      this.$emit("update:dialogVisible", false);
      this.$refs.dialog.$el.style.opacity = 0;
    },
    closeDialog() {
      this.keyword = "";
      map && map.emptySearchResult();
    },
    async initDialog() {
      this.handleClick(1);
      const lnglat = this.editPoint
        ? gcoord.transform(this.editPoint, gcoord.BD09, gcoord.EPSG3857)
        : [12609158.722154098, 2647747.527494556];
      if (map == null) {
        if (this.$refs.map) {
          map = createdMap({ target: this.$refs.map, editPoint: lnglat });
        }
      } else {
        // reset data
        map.setEditPoint(lnglat);
      }
    },
    async searchBaidu() {
      if (this.keyword != "") {
        this.searching = true;
        await map.search(this.keyword).catch(err => err);
        this.searching = false;
      } else {
        map.emptySearchResult();
      }
    },
    async updateLocation() {
      this.updating = true;
      const lnglat = gcoord.transform(
        map.getEditPoint(),
        gcoord.EPSG3857,
        gcoord.WGS84
      );
      const res = await updateLocation(
        this.data.ID,
        lnglat[0],
        lnglat[1]
      ).catch(err => err);
      this.updating = false;
      res && this.$message.success({ message: "更新坐标成功", offset: 60 });
      this.$emit("updateLngLat", lnglat, this.data.ID);
      this.$emit("update:dialogVisible", false);
    }
  },
  async mounted() {},
  components: {},
  watch: {
    data(val) {
      this.resfresh = true;
      this.closeDialog();
      this.initDialog();
      setTimeout(() => this.resfresh = false, 100)
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-message__content {
  width: 80%;
}
  /deep/ .el-dialog {
    z-index: 4000;
    position: absolute;
    top: 10vh;
    left: calc(50% - 400px);
  }
  /deep/ .el-dialog__body {
    padding: 3px;
  }
    /deep/ .el-dialog__footer {
    padding: 10px 20px 15px;
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
    position: absolute;
    top: 0;
    left: 0;
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