<template>
  <transition name="slide">
    <el-container
      class="add-layer-wrap"
      :style="actionsPanelVisible ? `bottom: calc(${height}px + 1px);` : 'bottom: 2px;'"
      style="overflow-x: hidden;"
      v-loading="loading"
    >
      <el-scrollbar class="scroll" style="height: 100%;">
        <el-main class="add-layer-content" style="overflow-x: hidden;">
          <el-form
            ref="form"
            :model="form"
            label-width="156px"
            label-position="right"
            size="mini"
            :status-icon="true"
            :inline-message="true"
          >
            <el-form-item
              size="mini"
              label="省份"
              prop="provice"
              :rules="[{'required':true, message: '请输入省份'}]"
            >
              <el-input v-model="form.provice" placeholder="广东省">
              </el-input>
            </el-form-item>
            <el-form-item
              size="mini"
              label="城市"
              prop="city"
            >
              <el-input v-model="form.city" placeholder="广州市"></el-input>
            </el-form-item>
            <el-form-item
              size="mini"
              label="区县"
              prop="qx"
              style="overflow: hidden;"
            >
              <el-input v-model="form.qx" placeholder="白云区"></el-input>
            </el-form-item>
            <el-form-item size="mini" label="覆盖已存在的区划" prop="updateExist" style="overflow: hidden;">
              <el-checkbox v-model="form.updateExist"></el-checkbox>
            </el-form-item>
          </el-form>
        </el-main>
      </el-scrollbar>
      <el-footer class="form-footer" height="60px">
        <el-button size="mini" @click="resetForm('form')" icon="el-icon-refresh-right">重 置</el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-circle-plus"
          :loading="saving"
          @click="onSubmit('form')"
        >保 存</el-button>
      </el-footer>
    </el-container>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import layerData from "@/data/layer";
import { getBoundaryByBoundaryName } from "@/data/baiduSearch";
import gppmixin from "@/components/controlPanel/mixin/gppmixin";

export default {
  props: ["visible"],
  mixins: [gppmixin],
  data() {
    return {
      districtList: [],
      cityList: [],
      proviceList: [{ label: "广东省", value: 33 }],
      form: {
        provice: "",
        city: "",
        qx: "",
        path_baidu: "",
        updateExist: false,
        district: ""
      }
    };
  },
  methods: {
    async getModel() {
      let model = {
        ...this.form
      };
      const res = await getBoundaryByBoundaryName(
        model.provice,
        model.city,
        model.qx
      ).catch(err => {
        this.$message.error({ message: err, offset: 60 });
        return [];
      });
      return {
        province: model.provice,
        city: model.city,
        qx: model.qx,
        path_baidu: res[0],
        updateExist: model.updateExist
      };
    },
    closePanel() {
      this.$parent.close();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.saving = true;
          const res = await this.$store.dispatch(
            "addLayerFeature", {
              layerid: 'xzqh',
              feature: await this.getModel()
            })
          if (typeof res === 'string') {
              this.$message.error({ message: `添加失败, ${res}`, offset: 60 });
          } else
             this.$message.success({ message: "添加行政区划成功!", offset: 60 });
          this.saving = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async init() {
      let form = {};
      this.$parent.title = this.currentLayer.name;
      this.resetForm("form");
      this.$parent.autoClose = false;
    },
    close() {
      this.resetForm("form");
    }
  },
  activated() {
    this.$parent.afterClose = function() {
      this.$store.dispatch("clearSelect");
    }.bind(this);
    // this.hasGeo && this.beginSetPoint();
  },
  deactivated() {
    // 初始化
    this.resetForm("form");
  },
  watch: {
    actionsPanelVisible(b) {
      if (b === false) this.$emit("update:visible", b);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/public.scss";
/deep/ .el-form-item__label {
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/ .el-scrollbar__wrap {
  overflow: auto;
}
.colorPicker {
  width: 100%;
  /deep/ .el-color-picker__trigger {
    width: 100%;
  }
}
::-webkit-scrollbar {
  // background-color: ;
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
.selected {
  background: #f5f7fa;
  color: #409eff;
  font-weight: normal;
  &:hover {
    background: #f5f7fa !important;
    color: #409eff !important;
  }
}

.add-layer-wrap {
  z-index: $panel-index;
  background: #fff;
  width: 100%;
  height: 100%;
  color: #303133;
  transition: all 0.3s ease-in-out;
  border: 0px;
  box-sizing: border-box;
  .header {
    padding-top: 6px;
    padding-bottom: 6px;
    box-sizing: border-box;
    font-size: 18px;
    font-weight: bold;
    background: $theme-color;
    color: #fff;
    text-align: center;
    .close {
      font-size: 16px;
      padding: 0;
      cursor: pointer;
      position: absolute;
      right: 20px;
      &:hover {
        color: $hover-font-color;
      }
    }
  }
  .form-footer {
    border-top: 1px solid #eee;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .selectMultiple {
    width: 100%;
    border-color: #dcdfe6;
    overflow-y: auto;
    padding: 1px;
    line-height: 28px;
    &:hover {
      border-color: #c0c4cc;
    }
    &:focus {
      outline: #409eff solid 1px;
    }
    .option {
      height: 28px;
      line-height: 28px !important;
      box-sizing: border-box;
      vertical-align: middle;
      padding-top: 3px;
      &:hover {
        background: #f5f7fa;
      }
      &:checked:enabled {
        background-color: #f5f7fa !important;
        color: #409eff;
      }
    }
  }
  .add-layer-content {
    width: 100%;
    padding: 5px 25px 5px 5px;
    box-sizing: border-box;
  }
}
.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter,
.slide-leave-to {
  right: -390px;
}
</style>