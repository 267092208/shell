<template>
  <el-container class="container">
    <MapBox></MapBox>
    <CommPanel
      :childComponent="childComponent.right"
      :visible="panelVisible.right"
      :before-close="beforeClose"
      position="right"
      :cssStyle="{
        bottom:rightPanelBottom,
        ...panelHeightWidth.right
      }"
    ></CommPanel>
    <CommPanel
      :childComponent="childComponent.left"
      :visible="panelVisible.left"
      :before-close="beforeClose"
      position="left"
      :cssStyle="{
        bottom:leftPanelBottom,
         ...panelHeightWidth.left
      }"
    ></CommPanel>
    <CommPanel
      :cssStyle="{
        left:bottomPanelLeft,
        right:bottomPanelRight,
          ...panelHeightWidth.bottom
      }"
      :childComponent="childComponent.bottom"
      :visible="panelVisible.bottom"
      :before-close="beforeClose"
      position="bottom"
    ></CommPanel>
  </el-container>
</template>
<script>
import CommPanel from '@/components/CommPanel'
import MapBox from '@/components/MapBox2.vue'

import { mapState } from 'vuex';
export default {
  name: "mapcontainer",
  components: {
    CommPanel,
    MapBox
  },
  computed: {
    ...mapState({
      childComponent: state => state.panel.panelComponent,
      panelVisible: state => state.panel.panelVisible,
      panelHeightWidth: state => state.panel.panelHeightWidth,
      panelImportance: state => state.panel.panelImportance
    }),
    /**
     * 计算
     */
    rightPanelBottom() {
      const bottom_i = this.panelImportance.indexOf("bottom");
      const right_i = this.panelImportance.indexOf("right");
      return right_i >= bottom_i ? 0 : this.panelHeightWidth.bottom.height
    },
    leftPanelBottom() {
      const bottom_i = this.panelImportance.indexOf("bottom");
      const left_i = this.panelImportance.indexOf("left");
      return left_i >= bottom_i ? 0 : this.panelHeightWidth.bottom.height
    },
    bottomPanelLeft() {
      const bottom_i = this.panelImportance.indexOf("bottom");
      const left_i = this.panelImportance.indexOf("left");
      return left_i <= bottom_i ? 0 : this.panelHeightWidth.left.width;
    },
    bottomPanelRight() {
      const bottom_i = this.panelImportance.indexOf("bottom");
      const right_i = this.panelImportance.indexOf("right");
      return right_i <= bottom_i ? 0 : this.panelHeightWidth.right.width;
    }
  },
  methods: {
    beforeClose(val) {
      this.$store.dispatch("clear", {
        position: val
      });
      // return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
