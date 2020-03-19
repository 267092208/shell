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
              :rules="[{'required':true, message: '请选择省份'}]"
            >
              <el-select v-model="form.provice" placeholder="请选择" @change="getCityList">
                <el-option
                  v-for="item in proviceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              size="mini"
              label="城市"
              prop="city"
              :rules="[{'required':true, message: '请选择城市'}]"
            >
              <el-select v-model="form.city" placeholder="请选择" @change="getDistrictList">
                <el-option
                  v-for="item in cityList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              size="mini"
              label="区县"
              prop="district"
              style="overflow: hidden;"
              :rules="[{'required':true, message: '请选择区县'}]"
            >
              <select
                multiple="multiple"
                class="selectMultiple"
                ref="district"
                @change="hadleDistrictSelected"
              >
                <option
                  v-for="(item,index) in districtList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  class="option el-select-dropdown__item"
                ></option>
              </select>
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
import { getCitys, getMAByCity, getDivision } from "@/data/division";
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
      this.form.provice &&
        (model.provice = this.proviceList.find(
          item => item.value === model.provice
        ).label);
      this.form.city &&
        (model.city = this.cityList.find(
          item => item.value === model.city
        ).label);
      this.form.qx && (model.qx = this.form.qx[0]);
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
      this.districtList = [];
      this.$refs.district.options.forEach(item => {
        item.selected = false;
      });
    },
    async getCityList() {
      let cityList = [];
      if (this.form.provice != null) {
        cityList = await getDivision(33).then(res => {
          return res.map(item => ({
            label: item.Name,
            value: item.ID
          }));
        });
        this.cityList = cityList;
      }
      return cityList;
    },
    async getDistrictList() {
      let districtList = [];
      if (this.form.district != null) {
        districtList = await getDivision(this.form.city).then(res => {
          return res.map(item => ({
            label: item.Name.replace(/.*-/, ""),
            value: item.ID
          }));
        });
        this.districtList = districtList;
      }
      return districtList;
    },
    hadleDistrictSelected(e) {
      let districtSelect = this.$refs.district;
      let district = [];
      let qx = [];
      for (let item of districtSelect.options) {
        item.classList.remove("selected");
        if (item.selected) {
          district.push(item.value);
          qx.push(item.label);
        }
      }
      this.form.qx = qx;
      this.form.district = district;
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