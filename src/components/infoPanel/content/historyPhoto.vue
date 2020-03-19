<template>
  <el-dialog
    title="历史照片"
    :visible="dialogVisible"
    width="750px"
    :before-close="handleClose"
    center
    :append-to-body="true"
    :close-on-click-modal="false"
    custom-class="dialog"
    class="history-imgs"
    v-dialogDrag
    
  >
    <div v-if="Object.keys(historyImgs).length===0">暂无图片</div>
    <el-scrollbar style="height:500px">
      <el-collapse v-model="activeNames" class="content">
        <el-collapse-item
          :title="year"
          :name="index"
          v-for="(imgList,year,index) in historyImgs"
          :key="index"
        >
          <el-image
            v-for="(item,listIndex) in imgList"
            :key="listIndex"
            style="width: 115px; height: 100px"
            :src="item"
            fit="cover"
            class="item-img"
            @dblclick="imgDbClick(item,index,year)"
          ></el-image>
        </el-collapse-item>
        <ImageViewer
          :isViewerOpen.sync="isViewerOpen"
          :currentIndex.sync="currentIndex"
          :imageList="srcList"
        ></ImageViewer>
      </el-collapse>
    </el-scrollbar>
  </el-dialog>
</template>


<script>
const ImageViewer = () => import("@/components/infoPanel/content/ImageViewer");

export default {
  props: {
    dialogVisible: Boolean,
    historyImgs: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    ImageViewer
  },
  data() {
    return {
      activeNames: [0],
      isViewerOpen: false,
      currentIndex: -1,
      srcList: []
    };
  },
  methods: {
    handleClose(done) {
      this.updateVisible(false);
    },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },
    imgDbClick(item, index, year) {
      this.isViewerOpen = true;
      this.currentIndex = index;
      this.srcList = this.historyImgs[year];
    }
  }
};
</script>
<style lang="scss" >
.history-imgs {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .content {
    // height: 500px;
  }
  .item-img {
    margin: 10px;
  }
}
</style>