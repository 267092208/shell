<template>
  <div class="measure">
    <el-button size="mini" class="base-layer-button" @click="measureDistance">
      <div class="iconfont icon-celiang"></div>
      <div>测距</div>
    </el-button>
    <el-button size="mini" class="base-layer-button" @click="measureArea">
      <div class="iconfont icon-mianji"></div>
      <div>测面</div>
    </el-button>
  </div>
</template>

<script>
/**
 * @module 测距测面
 */
export default {
  methods: {
    /**
     * 测距
     */
    measureDistance() {
      this.$store.dispatch("setMeasureMode", 'distance');
    },
    /**
     * 测面
     */
    measureArea() {
      this.$store.dispatch("setMeasureMode", 'area');
    }
  }
}
</script>

<style scoped>
.measure {
  flex-direction: column;
  display: flex;
  position: absolute;
  top: 60px;
  right: 10px;
  z-index: 100;
}
/* .measure button:first-child {
  border-bottom: 0;
} */
.measure button {
  margin-left: 10px;
  padding: 5px 7px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>