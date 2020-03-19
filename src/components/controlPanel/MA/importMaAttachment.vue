<template>
  <el-dialog
    :title="title ? title : 'MA-附件管理'"
    :before-close="handleClose"
    :visible="dialogVisible"
    width="650px"
    center
    custom-class="dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    v-dialogDrag
  >
    <div class="import_content" v-loading="loading">
      <el-upload
        action="/dataPages/ma/FileHandler.ashx"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :http-request="uploadFile"
        :before-upload="beforeUpload"
        :on-exceed="onUploadExceed"
        :on-change="onFileChange"
        :drag="true"
        :auto-upload="false"
        class="upload-demo"
        ref="upload"
        :limit='1'
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip" style="color: #909399;">
          <el-select size="mini" v-model="setting" placeholder="请选择" class="select">
            <el-option
              v-for="item in settingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <br />请添加文件
        </div>
      </el-upload>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button size="mini" icon="el-icon-upload" type="primary">上 传</el-button>
    </span>-->
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" icon="el-icon-remove-outline" @click="handleClose(false)">取 消</el-button>
      <el-button
        size="mini"
        v-if="ishasFile"
        icon="el-icon-upload2"
        :loading="uploading"
        type="primary"
        @click="upload()"
      >上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import XLSX from "xlsx";
import { mapState } from "vuex";
import { importExcel } from "@/data/layerExcelIO";
import { importFile } from "@/data/layerExcelIO";

export default {
  props: ["dialogVisible", "exampleXlsPath", "title"],
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      selectFeature: state => state.selectFeature.selectFeature
    }),
   
  },
  data() {
    return {
      ishasFile: false,
      uploading: false,
      loading: false,
      setting: "all",
      settingOptions: [
        { label: "全部公开", value: "all" },
        { label: "仅NP/BD可见", value: "admin" }
      ]
    };
  },
  methods: {
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
      this.$refs.upload.clearFiles();
      this.setting = 'all';
    },
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
    onFileChange(file) {
      this.ishasFile = true;
    },
    onUploadExceed() {
      this.$message.error({ message: "一次只能上传一个文件!", offset: 60 });
    },
    async uploadSuccess(response, file, fileList) {
      this.$message.success({ message: `上传成功!`, offset: 60 });
      this.uploading = false;
      this.updateVisible(false);
    },
    uploadError(err, file, fileList) {
      this.$message.error({ message: `${err}`, offset: 60 });
      this.uploading = false;
    },
    async uploadFile(param) {
      this.uploading = true;
      const { file } = param;
      let formData = new FormData();
      formData.append("file", file);
      const data = await importFile(this.selectFeature.id, formData);
      if ("newId" in data) return true;
      else return new Promise.catch();
    },
    beforeUpload(file) {
      // console.log(file);
    },
    upload() {
      this.$refs.upload.submit();
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
// .import_content {
//   width: 100%;
//   max-height: 471px;
//   overflow-x: hidden;
//   overflow-y: auto;
//   margin: 0 auto;
//   .upload {
//     margin: 0 auto;
//     padding-left: 5px;
//   }
// }
.import_content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.select {
  text-align: center;
  border: 0px;
  width: 120px;
  /deep/.el-input__inner {
    border: 0px;
  }
  &:hover {
    outline: #dcdfe6 solid 1px;
  }
}
</style>