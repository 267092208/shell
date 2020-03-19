<template>
  <el-dialog
    title="POI覆盖油站列表"
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
      <div v-if="yzList.length===0" style="text-align: center;line-height:232px;">暂无文件</div>
      <ul class="el-upload-list el-upload-list--text list-wrap" ref="uploadList">
        <li
          :tabindex="index"
          class="el-upload-list__item is-success"
          v-for="(item, index) in yzList"
          :key="index"
          @click.stop="choiceFile(index)"
        >
          <el-checkbox v-model="checkeds[index]" size="mini" style="width: 100%;">
            <a class="el-upload-list__item-name li-content" :class="{'checked': checkeds[index]}">
              <!-- <i class="iconfont icon-Excelwendang"></i> -->
              油站:
              <span class="text">{{item['站名']}}</span>&emsp;编号:
              <span class="text">{{item['油站编号']}}</span>
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
            <i class="el-icon-close li-content" @click.stop="deleteItem(index)"></i>
            <i class="el-icon-close-tip li-content">按 delete 键可删除</i>
          </el-checkbox>
        </li>
      </ul>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button
          v-show="checkeds.filter(item => item).length > 0"
          size="mini"
          icon="el-icon-remove-outline"
          @click="deleteItem('all')"
        >删 除</el-button>
        <el-button
          size="mini"
          icon="el-icon-upload"
          type="primary"
          :loading='updatting'
          @click="addYz"
        >上 传</el-button>
    </span>
    <import-ma-attachment :dialogVisible.sync="mydialogVisible"></import-ma-attachment>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import importMaAttachment from "@/components/controlPanel/MA/importMaAttachment.vue";
import { getYzListByid, addYzToPoi, delYzInPoi } from "@/data/poi";

export default {
  props: ["dialogVisible"],
  computed: {
    ...mapState({
      selectFeature: state => state.selectFeature.selectFeature
    })
  },
  data() {
    return {
      checkeds: [],
      loading: false,
      updatting: false,
      settingVisible: false,
      setting: "all", // 权限设置
      settingOptions: [
        { label: "全部公开", value: "all" },
        { label: "仅NP/BD可见", value: "BD NP" }
      ],
      mydialogVisible: false,
      selected: null,
      yzList: []
    };
  },
  methods: {
    handleClose(done) {
      this.$emit("update:dialogVisible", false);
    },
    choiceFile(index) {
      let nodes = this.$refs.uploadList.childNodes;
      nodes.forEach(item => {
        item.style.outline = "#fff solid 0px";
      });
      nodes[index].style.outline = "#303133 solid 1px";
      this.selected = nodes[index];
    },
    noSelect() {
      let nodes = this.$refs.uploadList.childNodes;
      nodes.forEach(item => {
        item.style.outline = "#fff solid 0px";
      });
      this.selected = null;
    },
    async addYz() {
        this.$prompt('请输入添加的油站编号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({ value }) => {
              this.updatting = true;
              await addYzToPoi(this.selectFeature.id, value).then(async res => {
              res.update && this.$message({type: 'success', message: '添加覆盖的油站成功!' + value,offset: 60 }) 
              this.updatting = false;
              await this.loadingList().then(_ => this.checkeds.push(false)).catch(err => err);
          }).catch(err =>this.$message.error({message: err, offset: 60}))
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    /**
     * @param {'all' | index:number} all
     */
    deleteItem(all) {
        const title = `确定移除`+ (all ==='all' ? '选中的' : `${this.yzList[all]['站名']}`) + `油站?`
      this.$confirm(
        title,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
            let buff = []
            for (let i = 0; i < this.checkeds.length; i++) {
                this.checkeds[i] && buff.push(this.yzList[i].ID)
            }
          const res = await delYzInPoi(this.selectFeature.id, buff);
          res.update
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
          this.yzList.splice(this.selected.tabIndex, 1);
          await this.loadingList();
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    async loadingList() {
      this.loading = true;
      this.yzList = await getYzListByid(this.selectFeature.id).then(res => Array.from(new Set(res.map(item => item.ID))).map(id => {
        return res.find(({ID}) => id === ID)
      }));
      this.loading = false;
    },
    async openDiaglog() {
      this.loadingList();
      this.checkeds = new Array(this.yzList.length).fill(false);
    }
  },
  components: {
    importMaAttachment
  }
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 6px;
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
  .list-wrap {
    overflow: hidden;
    overflow-y: auto;
    height: 100%;
    li {
      padding-left: 5px;
      .li-content {
        line-height: 12px;
        color: #909399;
        .text {
          color: #09f;
        }
        &:hover {
          color: #303133;
          .text {
            color: #3399ff;
          }
        }
      }
      .checked {
        color: #303133;
        .text {
          color: #3399ff;
        }
      }
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