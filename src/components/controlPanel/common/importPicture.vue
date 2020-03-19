<template>
  <el-dialog
    :title="title ? title : '上传图片'"
    :before-close="handleClose"
    :visible="dialogVisible"
    width="850px"
    center
    custom-class="dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    @open="loadingPictures"
    v-dialogDrag
  >
    <div class="import_content" v-loading="loading">
      <el-upload
        accept="image/*"
        action="./dataPages/sq/Handler.ashx"
        list-type="picture-card"
        :http-request="uploadPicture"
        :on-preview="handlePictureCardPreview"
        :before-remove="handleHttpRemove"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        class="upload"
        :file-list="fileList"
      >
        <i class="el-icon-plus"></i>
      </el-upload>

      <el-dialog :visible.sync="dialogIVisible" :append-to-body="true">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import XLSX from "xlsx";
import { mapState } from "vuex";
import { importExcel } from "@/data/layerExcelIO";
import {
  generalUploadPhoto,
  getPhotoListForSQ,
  delPhotoForSQ
} from "@/data/photo";

export default {
  props: ["dialogVisible", "exampleXlsPath", "title"],
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      selectFeature: state => state.selectFeature.selectFeature
    })
  },
  data() {
    return {
      ishasFile: false,
      uploading: false,
      dialogImageUrl: "",
      dialogIVisible: false,
      loading: false,
      fileList: [],
    };
  },
  methods: {
    handleClose(done) {
      this.fileList = [];
      this.$emit("update:dialogVisible", false);
    },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogIVisible = true;
    },
    async handleRemove(file, fileList) {
      // console.log(file,fileList);
    },
    async handleHttpRemove(file, fileList) {
      const val = await this.$confirm(
        `确定要删除${file.name}文件？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(cancel => {return false})
     if (val === false) {
          this.$message({ type: "error", message: "已取消删除", offset: 60 });
          return new Promise.catch();
     } 
      const res = await delPhotoForSQ(this.selectFeature.id, `/photo/sq/93/${file.name}`).catch(err => err)
      if (res && res.Msg==='OK') {
              this.$message({
                type: "success",
                message: "删除成功!",
                offset: 60
              })
              return true;
      } else {
         this.$message({
                type: "error",
                message: `${res}`,
                offset: 60
         })
         return new Promise.catch();
      }
    },
    onUploadExceed() {
      this.$message.error({ message: "一次只能上传一个文件!", offset: 60 });
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    onFileChange(file) {},
    async loadingPictures() {
      this.loading = true;
      const res = await getPhotoListForSQ(this.selectFeature.id).catch(
        err => err
      );

      res.Photo &&
        (this.fileList = res.Photo.map(url => {
          return { name: url.match(/\/([^\/]*\..*)/)[1], url: url };
        }));
      this.loading = false;
    },
    async uploadPicture(param) {
      const { file } = param;
      if (!/image\/[jpg|jpeg|png|gif|tif|icon]/.test(file.type)) {
        this.$message.error({
          message:
            "上传不允许的格式，目前只支持 jpg/jpeg/png/gif/tif/icon格式！",
          offset: 60
        });
        return new Promise.catch();
      }
      let formData = new FormData();
      formData.append(file.name, file);
      const data = await generalUploadPhoto(
        this.currentLayer.id,
        this.selectFeature.id,
        formData
      )
      return data.Name;
    },
    handleSuccess (response, file, fileList) {
      this.$message.success({message: `上传成功!`, offset: 60})
    },
    handleError(err, file, fileList) {
      this.$message.error({message: `${err}`, offset: 60})
    }
  }
};
</script>

<style lang='scss' scoped>
::-webkit-scrollbar {
  // background-color: ;
  width: 7px;
  &:hover {
    cursor: pointer;
  }
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  width: 2px;
  background-color: rgba(144, 147, 153, 0.3);
  &:hover {
    cursor: pointer;
    background-color: rgba(144, 147, 153, 0.5);
  }
}
/deep/ .el-message__content {
  width: 80%;
}
.import_content {
  width: 100%;
  max-height: 471px;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0 auto;
  .upload {
    margin: 0 auto;
    padding-left: 5px;
  }
}
</style>