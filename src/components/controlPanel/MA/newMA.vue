<template>
  <transition name="slide">
    <el-container
      class="add-layer-wrap"
      :style="actionsPanelVisible ? `bottom: calc(${height}px + 1px);` : 'bottom: 2px;'"
      style="overflow-x: hidden;"
      v-loading="loading && isEdit"
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
              label="名称"
              prop="name"
              :rules="[{'required':true, message: '名称不能为空'}]"
            >
              <el-input v-model="form.name" placeholder="名称"></el-input>
            </el-form-item>
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
            <el-form-item
              size="mini"
              label="颜色"
              prop="color"
              :rules="[{'required':true, message: '请选择颜色'}]"
            >
              <el-color-picker class="colorPicker" v-model="form.color"></el-color-picker>
            </el-form-item>
          </el-form>
        </el-main>
      </el-scrollbar>
      <!-- 添加面板 -->
      <el-footer class="form-footer" height="60px" v-if="!isEdit">
        <el-button size="mini" @click="resetForm('form')" icon="el-icon-refresh-right">重 置</el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-circle-plus"
          :loading="saving"
          @click="onSubmit('form')"
        >保 存</el-button>
      </el-footer>
      <!-- 修改面板 -->
      <el-footer class="form-footer" height="60px" v-else-if="editting">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-check"
          :loading="saving"
          @click="onSubmit('form')"
        >保 存</el-button>
        <el-button size="mini" @click="deleteMA" type="danger" icon="el-icon-delete">删 除</el-button>
        <el-button size="mini" @click="closePanel" icon="el-icon-remove-outline">取 消</el-button>
      </el-footer>
      <!-- 属性面板 -->
       <el-footer class="form-footer" height="60px" v-else>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-edit"
          @click="editting = true"
        >修 改</el-button>
        <el-button size="mini" @click="closePanel" icon="el-icon-remove-outline">取 消</el-button>
      </el-footer>
    </el-container>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import { getCitys, getMAByCity, getDivision } from "@/data/division";
import layerData from "@/data/layer";

export default {
  props: ["visible", "height"],
  computed: {
    ...mapState({
      actionsPanelVisible: state => state.header.actionsPanelVisible,
      currentLayer: state => state.layer.currentLayer,
      selectFeature: state => state.selectFeature.selectFeature,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      rightPanelName: state => state.panel.panelComponent.right
    })
  },
  data() {
    return {
      isEdit: false, // 添加model
      editting: false, // 确认可编辑
      loading: false,
      districtList: [],
      cityList: [],
      proviceList: [{ label: "广东省", value: "33" }],
      saving: false,
      form: {
        name: "",
        provice: "",
        city: "",
        district: "",
        color: ""
      }
    };
  },
  methods: {
    consistenceForm(form) {
      if (this.isEdit) {
        return [
          ["ID", form['ID']],
          ["名称", form.name],
          ["省份", form.provice],
          ["所属城市", form.city.toString()],
          ["行政区划Ids", form.district.join(",")],
          ["颜色", form.color],
          ["DELTED", form["DELTED"]],
          ["MAResource", JSON.stringify(form["MAResource"])],
          ["rankingLv", form["rankingLv"]]
        ];
      } else {
        return [
          ["名称", form.name],
          ["省份", form.provice],
          ["所属城市", form.city.toString()],
          ["行政区划Ids", form.district.join(",")],
          ["颜色", form.color]
        ];
      }
    },
    closePanel(){
      this.$parent.close();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.districtList = [];
      this.$refs.district.options.forEach(item => {
        item.selected = false;
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.saving = true;
          let res;
          if (false === this.isEdit) {  // 添加模式
            res =  await layerData.addItemOfLayer(
              'ma',
              this.consistenceForm(this.form)
            ).catch(err => {
              this.saving = false;
              this.$message.error({message: err, offset: 60})
            }); 
            res && 'newId' in res &&res.newId &&this.$message.success({ message: "添加MA成功!", offset: 60})
            const list = await layerData.getList('ma', res.newId).then(res => {
                              this.$store.dispatch("addLayerFeature", { layerid: 'ma', feature: layerData.rectify(res.list[0],'ma')});
                          }).catch(err => this.$message.error({message: err, offset: 60}));
              this.saving = false;
            this.closePanel();
          } else {
            res =   await layerData.updateItemOfLayer(
              'ma',
              this.form['ID'],
              this.consistenceForm(this.form)
            ).catch(err => {
              this.saving = false;
              this.$message.error({message: err, offset: 60})
            }); 
            await layerData.getList('ma', this.form['ID']).then(res => {
               this.$store.dispatch("updateLayerFeature", { layerid: 'ma', feature: layerData.rectify(res.list[0],'ma')});
              })
            res && 'update' in res && res.update &&this.$message.success({ message: "修改该MA成功!", offset: 60 }) 
          }
          this.saving = false;
            this.closePanel();
        } else {
          this.$message.error({ message: "请正确填写表单!", offset: 60 });
          return false;
        }
      });
    },
    deleteMA() {
        this.$confirm( `是否删除该MA`,"警告",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
            this.$store
              .dispatch("removeLayerFeature", {
                layerid: 'ma',
                features: [this.selectFeature]
              })
              .then(res => {
                this.closePanel();
                this.$message({type: "success",message: "删除成功!",offset: 60});
              })
              .catch(err => {
                this.$message({type: "error",message: "删除失败!",offset: 60});
              });
          })
          .catch(error => {
            this.$message({type: "info",message: "已取消删除",offset: 60});
          });
    },
    hadleDistrictSelected(e) {
      let districtSelect = this.$refs.district;
      let district = [];
      for (let item of districtSelect.options) {
        item.classList.remove("selected");
        if (item.selected) district.push(item.value);
      }
      this.form.district = district;
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
          if ('Error' in res) res = [];
          return res.map(item => ({
            label: item.Name.replace(/.*-/, ""),
            value: item.ID
          }));
        }).catch(err => err);
        this.districtList = districtList;
      }
      return districtList;
    },
    async init() {  // 重新弹出都会调用
      this.$parent.title = "MA";
      this.$parent.autoClose = false;
      if (this.rightPanelName === 'MAinfo')  await this.getSelectInfo(this.selectFeature)// 如果艘次打开时选择的
      else if (this.rightPanelName === 'addMA') {this.isEdit = false; this.editting = false; this.resetForm('form');}
      this.$parent.afterClose = function() {
        this.$store.dispatch("clearSelect");
      }.bind(this);
    },
    close() {
      this.resetForm("form");
    },

    async getSelectInfo(feature) {
      this.$parent.title = "MA";
        this.resetForm('form');
      if (feature) {
        this.isEdit = true; // 编辑模式
        this.editting = false; // 仍没确定编辑
        let ma = feature.getProperties();
        if (ma) {
          this.form = {
            name: ma["名称"],
            provice: ('省份' in ma) ? ma["省份"].toString() : '',
            city: +ma["所属城市"],
            district: ('行政区划Ids' in ma) ? ma["行政区划Ids"].split(",").map(i => { return +i }) : 'ma',
            color: ma["颜色"],
            ...ma
          };
        }
        this.loading = true;
        await this.getCityList();
        await this.getDistrictList();
        this.$refs.district.options.forEach(item => {
          this.form.district.indexOf(+item.value) > -1 &&
            (item.selected = true);
        });
        this.loading = false;
      }
    }
  },
  async activated() {
  },
  deactivated() { // 初始化
    this.resetForm("form");
    this.isEdit = false;
    this.editting = false;
  },
  watch: {
    actionsPanelVisible(b) {
      if (b === false) this.$emit("update:visible", b);
    },
    async selectFeature(b) {
      this.getSelectInfo(b);
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