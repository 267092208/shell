<template>
  <div class="zoom">
    <!-- 地图放大按钮 -->
    <el-tooltip content="放大" effect="dark" placement="left">
      <el-button @click="zoomIn" size="mini" icon="el-icon-plus" :disabled="isMaxZoom"></el-button>
    </el-tooltip>
    <!-- 地图缩小按钮 -->
    <el-tooltip content="缩小" effect="dark" placement="left">
      <el-button @click="zoomOut" size="mini" icon="el-icon-minus" :disabled="isMinZoom"></el-button>
    </el-tooltip>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data: function () {
    return {

    }
  },
  computed: {
    ...mapState({
      zoom: state => state.mapState.zoom, //当前地图级别
      isMinZoom: state => state.mapState.isMinZoom /* 是否为最小zoom */,
      isMaxZoom: state => state.mapState.isMaxZoom /* 是否为最大zoom */
    })
  },
  methods: {
    zoomIn() {
      this.$store.dispatch('setMapZoom', this.zoom + 1)
    },
    zoomOut() {
      this.$store.dispatch('setMapZoom', this.zoom - 1)
    }
  }
}
</script>

<style  scoped>
.zoom {
  flex-direction: column;
  display: flex;
  position: absolute;
  top: 50px;
  left: 10px;
  z-index: 100;
}
.zoom button {
  display: block;
  margin: 0 0 0 0;
  padding: 10px;
  color: #464646;
  border-radius: 0;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>>
