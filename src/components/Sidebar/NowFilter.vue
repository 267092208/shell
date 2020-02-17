<template>
  <div class="now-filter">
    <el-card shadow="never">
      <layer-list />
    </el-card>
  </div>
</template>
<script>
import layerList from "./Layer/LayerList";
export default {
  data() {
    return {};
  },
  components: {
    layerList
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.now-filter {
  height: calc(100% - 400px);
  box-sizing: border-box;
  /deep/.el-card {
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    .el-card__body {
      height: 100%;
      box-sizing: border-box;
      padding-bottom: 0;
    }
  }
}
</style>