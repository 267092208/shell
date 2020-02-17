<template>
  <el-dialog
    title="上传图片"
    :before-close="handleClose"
    :visible="dialogVisible"
    width="750px"
    center
    custom-class="dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
  >
    <div class="import_content">
      <el-upload
        class="upload-demo"
        accept="image/jpeg, image/gif, image/png"
        ref="upload"
        drag
        action="void javascrpt:(0)"
        :limit="1"
        :auto-upload="false"
        list-type="picture"
        :show-file-list="isShowFileList"
        :file-list="fileList"
        :before-upload="beforePhotoUpload"
        :on-change="onChange"
        :on-exceed="onUploadExceed"
        :on-remove="() => ishasFile = false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击添加</em>
        </div>
        <div class="el-upload__tip" slot="tip">请上传后缀名为jpg/png/jpeg的图片文件</div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose(false)">取 消</el-button>
      <el-button
        title="选取文件后再点击上传"
        size="mini"
        :disabled="!ishasFile"
        :loading="uploading"
        type="primary"
        @click="uploadFile()"
      >上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { uploadPhoto, getPhotos } from "@/data/photo";

export default {
  props: {
    dialogVisible: Boolean,
    renewPhoto: Function
  },
  computed: {
    ...mapState({
      selectFeature: state => state.selectFeature.selectFeature,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      photoStatus: state => state.panel.photoStatus
    })
  },

  data() {
    return {
      ishasFile: false,
      uploading: false,
      isShowFileList: true,
      fileList: []
    };
  },
  methods: {
    handleClose(done) {
      if (this.ishasFile && !this.uploading) {
        this.$confirm("文件暂未上传, 是否退出?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$refs.upload.clearFiles();
            this.ishasFile = false;
            this.$emit("update:dialogVisible", false);
          })
          .catch(() => {});
        return;
      } else if (this.isUploading) {
        // 取消上传
        this.$refs.upload.abort();
        this.uploading = false;
        this.$refs.upload.clearFiles();
        this.ishasFile = false;
        this.$message.warning({ message: "已取消上传", offset: 60 });
      }
      this.$emit("update:dialogVisible", false);
    },

    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },

    onUploadExceed() {
      this.$message.error({ message: "一次只能上传一个文件!", offset: 60 });
    },

    onChange() {
      this.ishasFile = true;
      this.isShowFileList = true;
    },

    // 文件上传前,检查文件格式
    beforePhotoUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传的文件只能是图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //文件上传
    uploadFile() {
      const { uploadFiles } = this.$refs.upload;

      const file = uploadFiles[0];

      const formData = new FormData();
      formData.append("name", file.raw);

      this.uploading = true;

      uploadPhoto(this.selectFeature, this.selectFeatureLayer.id, formData)
        .then(res => {
          let date = new Date().toLocaleString
          this.uploading = false;
          this.ishasFile = false;
          this.isShowFileList = false;
          this.fileList = [];
          this.$message.success({ message: "文件上传成功", offset: 60 });
          this.$store.dispatch("setPhotoStatus", date);

        })
        .catch(err => {
          this.uploading = false;
          this.$message.error({ message: "文件上传失败,请重试", offset: 60 });
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.import_content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>