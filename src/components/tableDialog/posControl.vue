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
     @close="closeDialog"
    v-dialogDrag
  >
    <div class="content">
      <el-input placeholder="视野内搜索(百度数据)" @keyup.enter.native="searchBaidu" class="input-with-select search" v-model="keyword">
        <el-button slot="append" :loading="searching" @keyup.enter="searchBaidu" icon="el-icon-search" @click="searchBaidu"></el-button>
      </el-input>

      <div class="map" ref="map" id="map">
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" icon="el-icon-remove-outline" @click="handleClose">取 消</el-button>
      <el-button :loading="updating" size="small" icon="el-icon-refresh" type="primary" @click="updateLocation">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import XLSX from "xlsx";
import { mapState } from "vuex";
import mapboxMixins from "@/mapTool/mapboxMixins2";
import createdMap from "@/mapTool/miniMap/map";
import gcoord from 'gcoord'
import { updateLocation } from '@/data/table'
let map;
export default {
  props: ["dialogVisible", "editPoint", 'data'],
  mixins: [...mapboxMixins],
  computed: {
    ...mapState({ currentLayer: state => state.layer.currentLayer })
  },
  data() {
    return {
      keyword: '',
      map: null,
      updating: false,
      searching: false,
      dataId: null
    };
  },
  methods: {
    handleClose(done) {
      this.$emit("update:dialogVisible", false);
    },
    closeDialog() {
      this.keyword = '';
      map.emptySearchResult();
    },
    async initDialog() {
      const lnglat = this.editPoint ? gcoord.transform(this.editPoint, gcoord.WGS84, gcoord.EPSG3857) :  [12609158.722154098, 2647747.527494556];
      console.log(lnglat);
      if (map == null) {
        if (this.$refs.map) {
          map = createdMap({ target: this.$refs.map, editPoint: lnglat });
        }
      } else { // reset data
        map.setEditPoint(lnglat)
      }
    },
    async searchBaidu() {
      if (this.keyword != '') {
        this.searching = true;
        await this.map.search(this.keyword)
        this.searching = false;
      } else {
        this.map.emptySearchResult();
      }
    },
    async updateLocation() {
      this.updating = true;
      const lnglat = gcoord.transform(this.map.getEditPoint(), gcoord.EPSG3857, gcoord.WGS84);
      const res = await updateLocation(this.data.ID, lnglat[0], lnglat[1]).catch(err => err);;
      this.updating = false;
      res && this.$message.success({message: '更新坐标成功', offset: 60})
      this.$emit('updateLngLat', lnglat, this.data.ID);
      this.$emit('update:dialogVisible', false);
    }
  },
  async mounted() {
  },
  components: {
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