<template>
  <el-dialog
    title="MA-附件管理"
    :before-close="handleClose"
    :visible="dialogVisible"
    width="750px"
    center
    custom-class="dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    @open="openDiaglog"
    v-dialogDrag
  >
    <div class="doc-content" v-loading="loading" @click="noSelect">
      <div v-if="fileList.length===0" style="text-align: center;line-height:232px;">暂无文件</div>
      <ul class="el-upload-list el-upload-list--text upload" ref="uploadList">
        <li
          :tabindex="index"
          class="el-upload-list__item is-success upload-item"
          v-for="(item, index) in fileList"
          :key="index"
          @click.stop="choiceFile(index)"
        >
          <a class="el-upload-list__item-name item-content">
            <el-avatar
              class="iconfont pic-fs item-pic"
              :class="iconClass(item.Type)"
              :src="getUrl(item)"
              shape="square"
              fit="fill"
              lazy
            >
              <img src="@/assets/images/picture2.png" />
            </el-avatar>
            <span class="item-text">{{item.Name}}</span>
          </a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-circle-check"></i>
          </label>
          <i class="el-icon-close" @click.stop="deleteItem()"></i>
          <i class="el-icon-close-tip">按 delete 键可删除</i>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button-group style="margin-right:10px;">
        <el-button
          v-show="selected != null"
          size="mini"
          icon="el-icon-remove-outline"
          @click="deleteItem()"
        >删 除</el-button>
        <el-popover placement="top" width="200" v-model="settingVisible" @show="showSetting">
          <div v-loading="loadingSetting">
            <div class="pop-content">
              <div>
                <strong>权限设置:</strong>
              </div>
              <el-select size="mini" v-model="setting" placeholder="请选择" class="select">
                <el-option
                  v-for="item in settingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="mini" type="text" @click="settingVisible = false">取消</el-button>
              <el-button :loading="updatting" type="primary" size="mini" @click="updateRoles">修改</el-button>
            </div>
          </div>
          <el-button
            v-show="selected != null"
            size="mini"
            icon="el-icon-setting"
            type="warning"
            slot="reference"
          >修改权限</el-button>
        </el-popover>
      </el-button-group>
      <!-- <el-button-group>
        <el-upload
           action="/dataPages/ma/FileHandler.ashx"
           :on-success="uploadSuccess"
           :on-error="uploadError"
           :http-request="uploadFile"
           :before-upload="beforeUpload"
           :show-file-list="false"
        >
          <el-button
          size="mini"
          icon="el-icon-upload"
          type="primary"
        >上 传</el-button>
        </el-upload>
        
      </el-button-group>-->
      <el-button-group>
        <el-button
          size="mini"
          icon="el-icon-upload"
          type="primary"
          @click="mydialogVisible = true"
        >上 传</el-button>
      </el-button-group>
    </span>
    <import-ma-attachment :dialogVisible.sync="mydialogVisible" @update="loadingList"></import-ma-attachment>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import importMaAttachment from "@/components/controlPanel/MA/importMaAttachment.vue";
import {
  getAttachmentList,
  getFileRole,
  updateFileRole,
  delFileList
} from "@/data/ma";
import { importFile } from "@/data/layerExcelIO";

export default {
  props: ["dialogVisible"],
  computed: {
    ...mapState({
      selectFeatures: state => state.selectFeature.selectFeatures,
      selectFeature: state => state.selectFeature.selectFeature
    })
  },
  data() {
    return {
      loading: false,
      updatting: false,
      loadingSetting: false,
      settingVisible: false,
      setting: "all", // 权限设置
      settingOptions: [
        { label: "全部公开", value: "all" },
        { label: "仅NP/BD可见", value: "BD NP" }
      ],
      mydialogVisible: false,
      selected: null,
      fileList: []
    };
  },
  methods: {
    iconClass(type) {
      switch (type) {
        case ".xlsx":
          return "icon-Excelwendang";
        default:
          return "";
      }
    },
    getUrl(item) {
      switch (item.Type) {
        case ".jpg":
          return item.Url;
        default:
          return "";
      }
    },
    handleClose(done) {
      this.$emit("update:dialogVisible", false);
    },
    async choiceFile(index) {
      let nodes = this.$refs.uploadList.childNodes;
      nodes.forEach(item => {
        item.style.outline = "#fff solid 0px";
      });
      nodes[index].style.outline = "#303133 solid 1px";
      this.selected = nodes[index];
      this.setting === null;
    },
    noSelect() {
      let nodes = this.$refs.uploadList.childNodes;
      nodes.forEach(item => {
        item.style.outline = "#fff solid 0px";
      });
      this.selected = null;
    },
    deleteItem() {
      this.$confirm(
        `确定移除${this.fileList[this.selected.tabIndex].Name}文件?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          const res = await delFileList([
            this.fileList[this.selected.tabIndex].ID
          ]);
          res.del
            ? this.$message({
                type: "success",
                message: "删除成功!",
                offset: 60
              })
            : this.$message({
                type: "error",
                message: "删除出错!",
                offset: 60
              });
          this.fileList.splice(this.selected.tabIndex, 1);
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    // file = this.fileList[this.selected.tabIndex]
    // async showSetting() {
    //   this.loadingSetting = true;
    //   const res = await getFileRole(this.fileList[this.selected.tabIndex].ID);
    //   this.setting = res.result;
    //   this.loadingSetting = false;
    // },
    async updateRoles() {
      let rnames = "";
      switch (this.setting) {
        case "all":
          rnames = "[]";
          break;
        case "BD NP":
          rnames = JSON.stringify(["NP", "BD"]);
          break;
        default:
          rnames = [];
          break;
      }
      this.updatting = true;
      const res = await updateFileRole(
        this.fileList[this.selected.tabIndex].ID,
        rnames
      ).catch(err => {
        console.log(err);
        this.$message.error({ message: `更新出错!`, offset: 60 });
      });
      this.updatting = false;
      let right = res.update ? "成功" : "失败";
      this.$message({
        message: `更新${right}!`,
        offset: 60,
        type: right ? "success" : "error"
      });
    },
    // async uploadSuccess(response, file, fileList) {
    //   this.$message.success({ message: `上传成功!`, offset: 60 });
    //   await this.loadingList();
    // },
    // uploadError(err, file, fileList) {
    //   this.$message.error({ message: `${err}`, offset: 60 });
    // },
    // async uploadFile(param) {
    //   const { file } = param;
    //   console.log(file, this.se);
    //   let formData = new FormData();
    //   formData.append("file", file);
    //   const data = await importFile(this.selectFeature.id, formData);
    //   if ("newId" in data) return true;
    //   else return new Promise.catch();
    // },
    // beforeUpload(file) {
    //   // console.log(file);
    // },
    async openDiaglog() {
        this.loading = true;
      this.loadingList();
      this.loading = false;
    },
    async loadingList() {
      let fileList = await getAttachmentList(
        this.selectFeatures[0].get("id")
      ).catch(err => console.log(err));
      if (
        typeof fileList === "string" ||
        ("Error" in fileList && (fileList = fileList.Msg))
      ) {
        this.$message.error({ message: fileList, offset: 60 });
        fileList = [];
      }
      this.fileList = fileList;
    }
  },
  components: {
    importMaAttachment
  },
  watch: {
       mydialogVisible(val) {
          if (val === false) {
               this.loadingList();
          }
      }
  }
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  // background-color: ;
  width: 4px;
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
.doc-content {
  border: 1px solid #dcdfe6;
  height: 230px;
  .upload {
    overflow-y: auto;
    height: 100%;
    .upload-item {
      /deep/.el-upload-list__item-status-label {
        top: 8px;
      }
      /deep/.el-icon-close {
        top: 15px;
      }
      .item-content {
        padding: 2px 0px;
        padding-left: 4px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        /deep/.el-avatar > img {
          width: 100%;
        }
        .item-text {
          padding-left: 7px;
        }
      }
    }
    .pic-fs {
      font-size: 33px;
    }
  }
}
.pop-content {
  display: flex;
  letter-spacing: 0px;
  line-height: 28px;
  .select {
    text-align: center;
    border: 0px;
    width: 120px;
    margin-left: 18px;
    /deep/.el-input__inner {
      border: 0px;
      text-align: center;
    }
    &:hover {
      outline: #dcdfe6 solid 1px;
    }
  }
}
</style>