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
            :disabled="isEdit===true && editting === false"
          >
            <el-form-item
              size="mini"
              v-for="(item, index) in showFilterFields"
              :key="index"
              :label="item.displayText"
              :prop="item.fieldName"
              :rules="createRule(item)"
            >
            <!-- v-show=" !hideLngLatWithisEdit(item.fieldName) && item.displayText" -->
              <component
                v-if="item.enum == null"
                :disabled=" item.fieldName === 'lng_baidu' || item.fieldName === 'lat_baidu'"
                :is="createFormCtrlWithType(item.type)"
                v-model="form[item.fieldName]"
                controls-position="right"
                checked
                :placeholder="item.displayText"
                style="width: 100%;"
              ></component>
              <el-select v-model="form[item.fieldName]" v-else :placeholder="item.displayText">
                <el-option
                  style="font-size: 12px;"
                  v-for="(item,index) in item.enum"
                  :key="index"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              size="mini"
              label="柴油总年销量mln"
              prop="柴油总年销量mln"
              v-if="hasExtentFields === 'poigroups'"
            >
              <el-input-number
                style="width: 100%;"
                disabled
                v-model.number="form['柴油总年销量mln']"
                :controls="false"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              size="mini"
              label="汽油总年销量mln"
              prop="汽油总年销量mln"
              v-if="hasExtentFields === 'poigroups'"
            >
              <el-input-number
                style="width: 100%;"
                disabled
                v-model.number="form['汽油总年销量mln']"
                :controls="false"
              ></el-input-number>
            </el-form-item>
            <el-row type="flex" style="margin-right: -10px;" v-if="hasExtentFields === 'poigroups'">
              <el-button
                type="button"
                style="wdith: 100%;flex: 1;"
                size="medium"
                @click="computAreaYp"
              >重新统计销量</el-button>
            </el-row>

            <el-form-item label="途径区划" size="mini" v-if="hasExtentFields === 'roadnetwork'">
              <el-input type="textarea" placeholder="加载途径区划中" disabled :value="panelExtentValue"></el-input>
            </el-form-item>
          </el-form>
        </el-main>
      </el-scrollbar>
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
        <el-button size="mini" @click="deleteFeature" type="danger" icon="el-icon-delete">删 除</el-button>
        <el-button v-if="!hasGeo" size="mini" @click="closePanel" icon="el-icon-remove-outline">取 消</el-button>
      </el-footer>
      <!-- 属性面板 -->
      <el-footer class="form-footer" height="60px" v-else>
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="beginEdit">修 改</el-button>
        <el-button size="mini" @click="closePanel" icon="el-icon-remove-outline">取 消</el-button>
      </el-footer>
    </el-container>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import { getCitys, getMAByCity, getDivision } from "@/data/division";
import layerData from "@/data/layer";
import gppmixin from "@/components/controlPanel/mixin/gppmixin";
import { GetAreaYpData } from "@/data/poigroups";
import gcoord from "gcoord";

export default {
  props: ["visible"],
  mixins: [gppmixin],
  methods: {
    hideLngLatWithisEdit(fieldName) {
      if (
        this.isEdit === true &&
        this.editting === false &&
        (fieldName === "lng_baidu" || fieldName === "lat_baidu")
      ) {
        // 只在这情况隐藏
        return true;
      } else return false;
    },
    /**
     * {ID, Csum, Ncsum, Qsum, Nqsum, CountSum }
     */
    async computAreaYp() {
      const res = await GetAreaYpData(this.getExtentFieldOwnerId).catch(err =>
        console.log(err)
      );
      if (typeof res === "object" && "Csum" in res) {
        this.form["柴油总年销量mln"] = res.Csum;
        this.form["汽油总年销量mln"] = res.Qsum;
      }
    },
    closePanel() {
      // if (this.editting === true) { // 编辑中无法关闭
      //   this.$message.error({message: '编辑中无法关闭，请先保存', offset: 60});
      // } else {
      this.isEdit = false;
      this.editting = false;
      this.$parent.close();
      // }
    },
    async resetForm(formName) {
      this.$refs[formName].resetFields();
      if (this.hasGeo && this.geometryInstance) {
        await this.$store
          .dispatch("getGeometry", {
            drawMode: "Point",
            feature: this.geometryInstance.getGeometry()
          })
          .then(res => {
            res.on("update", () => {
              let point = res
                .getFeature()
                .getGeometry()
                .getCoordinates();
              this.updateCoordinate(
                gcoord.transform(point, gcoord.EPSG3857, gcoord.WGS84)
              );
            });
          })
          .catch(err => {
            console.log("err-----", err);
          });
        // this.endPoint();
        // this.beginSetPoint();
      }
      // 远程关闭 FIXME: 会导致非控制面板绘制工具失效（如果打开了两次绘制工具，包括操作面板的一次）
      this.judgeCloseCtrGeo();
    },
    async defaultSubmitFn() {
      if (false === this.isEdit) {
        //添加模式
        const res = await this.$store
          .dispatch("addLayerFeature", {
            layerid: this.currentLayer.id,
            feature: {
              properties: this.form
            }
          })
          .catch(async err => {
            this.$message.error({ message: "添加失败!", offset: 60 });
          });
        if (
          typeof res === "string" ||
          (typeof res === "object" && "Msg" in res)
        )
          this.$message.error({ message: `"添加失败!"${res.Msg}`, offset: 60 });
        else this.$message.success({ message: "添加成功", offset: 60 });
      } else {
        // 编辑模式
        const res = await this.$store
          .dispatch("updateLayerFeature", {
            layerid: this.selectFeatureLayer.id,
            feature: {
              id: this.form["ID"],
              properties: this.form
            }
          })
          .catch(async err => {
            this.$message.error({ message: "更新失败!", offset: 60 });
          });
        if (
          typeof res === "string" ||
          (typeof res === "object" && "Msg" in res)
        )
          this.$message.error({ message: `"更新失败!"${res.Msg}`, offset: 60 });
        else this.$message.success({ message: "更新成功", offset: 60 });
      }
    },
    async defaultSubmitFnWithGeo() {
      if (false === this.isEdit) {
        //添加模式
        const geometry = this.geometryInstance.getGeometry().getGeometry();
        const res = await this.$store
          .dispatch("addLayerFeature", {
            layerid: this.currentLayer.id,
            feature: {
              geometry: {
                type: geometry.getType(),
                coordinates: geometry.getCoordinates()
              },
              properties: this.form
            }
          })
          .catch(async err => {
            await this.endPoint();
            return err;
          });
        this.routerResultMessage(res);
        await this.endPoint();
      } else {
        // 编辑模式
        const geometry = this.geometryInstance.getGeometry().getGeometry();
        const res = await this.$store
          .dispatch("updateLayerFeature", {
            layerid: this.editFeatureLayer.id,
            feature: {
              id: this.form["ID"],
              geometry: {
                type: geometry.getType(),
                coordinates: geometry.getCoordinates()
              },
              properties: this.form
            }
          })
          .catch(async err => {
            await this.endPoint();
            return err;
          });

        this.routerResultMessage(res);
        await this.endPoint();
      }
    },
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.saving = true;
          if (false === this.isEdit) {
            // 添加模式
            try {
              if (this.currentLayer.id === "poigroups") {
                await this.poigroupsSubmitFn();
              } else if (this.currentLayer.id === "sq") {
                await this.sqSubmitFn();
              } else if (this.currentLayer.id === "roadnetwork") {
                await this.roadSubmitFn();
              } else if (this.currentLayer.id === "xl") {
                await this.xlSubmitFn();
              } else if (this.currentLayer.id === "corridor") {
                await this.corridorSubmitFn();
              } else {
                if (this.hasGeo) await this.defaultSubmitFnWithGeo();
                else await this.defaultSubmitFn();
              }
            } catch (err) {
              this.saving = false;
              console.log(err);
            }
            this.saving = false;
            this.closePanel();
          } else {
            // 编辑模式 look beginEdit method
            try {
              if (this.editFeatureLayer.id === "poigroups") {
                await this.poigroupsSubmitFn();
              } else if (this.editFeatureLayer.id === "sq") {
                await this.sqSubmitFn();
              } else if (this.editFeatureLayer.id === "roadnetwork") {
                await this.roadSubmitFn();
              } else if (this.editFeatureLayer.id === "xl") {
                await this.xlSubmitFn();
              } else if (this.editFeatureLayer.id === "corridor") {
                  await this.corridorSubmitFn();
              } else {
                if (this.hasGeo) await this.defaultSubmitFnWithGeo();
                else await this.defaultSubmitFn();
              }
            } catch (err) {
              this.saving = false;
              console.log(err);
            }
            this.saving = false;
            this.closePanel();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async beginEdit() {
      this.editting = true;
      this.editFeature = this.selectFeature;
      this.editFeatureLayer = this.selectFeatureLayer;
        await this.$store.commit("setPanelExtent", { editPanel: true });
      if (this.hasGeo) {
        this.$parent.closeButton = false;
        let res;
        res = await this.$store
          .dispatch("getGeometry", {
            drawMode: "Point",
            feature: this.selectFeature
          })
          .catch(err => {
            console.log("err-----", err);
          });
        res.on("update", () => {
          let point = res
            .getFeature()
            .getGeometry()
            .getCoordinates();
          this.updateCoordinate(
            gcoord.transform(point, gcoord.EPSG3857, gcoord.WGS84)
          );
        });
      }
    },
    /**
     * type is string | number | boolean | date | time | geometryX | geometryY
     */
    createRule(item) {
      const { displayText, type } = item;
      let rules = [];
      let typeRule = { type }; //FIXME: 特殊字段
      /** 特殊字段 */ if (displayText === "组团评级") {
        rules.push({ required: true, message: `${displayText}不能为空` });
      }
      /** end 特殊字段处理 */
      if ("required" in item && item.required)
        rules.push({ required: true, message: `${displayText}不能为空` });
      else {
        rules.push({ required: false });
      }

      switch (type) {
        case "number":
          typeRule["message"] = `${displayText}必须为数字`;
          break;
        case "boolean":
          typeRule["message"] = `${displayText}为布尔值`;
          break;
        default: {
          typeRule = null;
        }
      }
      if (typeRule != null) rules.push(typeRule);
      return rules;
    },
    createFormCtrlWithType(type) {
      switch (type) {
        case "number":
          return "elInputNumber";
        case "geometryX":
        case "geometryY":
          return "elInput";
          break;
        case "date": {
          return "elDatePicker";
        }
        case "string": {
          return "elInput";
        }
        case "boolean": {
          return "elCheckbox";
        }
        case "time": {
          return "elTimeSelect";
        }
      }
    },
    deleteFeature() {
      const selectFeature = this.hasGeo ? this.editFeature : this.selectFeature;
      const selectFeatureLayer = this.hasGeo
        ? this.editFeatureLayer
        : this.selectFeatureLayer;
      this.$confirm(`是否删除该${selectFeatureLayer.name}`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("removeLayerFeature", {
              layerid: selectFeatureLayer.id,
              features: [selectFeature]
            })
            .then(res => {
              this.closePanel();
              this.$message({
                type: "success",
                message: "删除成功!",
                offset: 60
              });
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "删除失败!",
                offset: 60
              });
            });
        })
        .catch(error => {
          this.$message({ type: "info", message: "已取消删除", offset: 60 });
        });
    },
    updateCoordinate(geometry) {
      this.form["lng_baidu"] = Number.parseFloat(
        geometry.coordinates[0]
      ).toFixed(6);
      this.form["lat_baidu"] = Number.parseFloat(
        geometry.coordinates[1]
      ).toFixed(6);
    },
    async init() {
      this.panelExtentValue = null;
      if (this.rightPanelName === "commPropertyPanel") {
        await this.getPropertyByFeature(this.selectFeature); // 如果艘次打开时选择的
      } else if (this.rightPanelName === "commAddPanel") {
        let form = {};
        this.$parent.title = this.currentLayer.name;
        this.fields = this.getTrueFields(true); // 添加模式
        this.isEdit = false;
        this.editting = false;
        this.resetForm("form");
        for (let item of this.fields) {
          form[item.fieldName] = item.type === "boolean" ? true : "";
          if (item.fieldName === "组团评级") {
            form[item.fieldName] = "高";
          }
          if (item.enum) {
            form[item.fieldName] = item.enum[0];
          }
        }
        this.form = form;
      }
      this.hasGeo = "lat_baidu" in this.form;
      if (this.hasGeo) {
        this.beginSetPoint(this.rightPanelName === "commPropertyPanel");
      }
      this.$parent.autoClose = false;
    },
    close() {
      this.$refs["form"].resetFields();
      if (this.hasGeo) this.endPoint();
    },
    async beginSetPoint(isEdit) {
      if (isEdit === false) {
        let res;
        res = await this.$store
          .dispatch("getGeometry", { drawMode: "Point" })
          .catch(err => {
            console.log("err-----", err);
          });
        res.on("update", () => {
          let point = res
            .getFeature()
            .getGeometry()
            .getCoordinates();
          this.updateCoordinate(
            gcoord.transform(point, gcoord.EPSG3857, gcoord.WGS84)
          );
        });
      }
    },
    endPoint() {
      this.$parent.closeButton = true;
      this.$store.commit("setPanelExtent", null); // 清空
      this.geometryInstance &&
        // this.geometryInstance.getGeometry() &&
        this.geometryInstance.disable();
    },
    updateCoordinate(geometry) {
      this.form["lng_baidu"] = Number.parseFloat(geometry[0]).toFixed(6);
      this.form["lat_baidu"] = Number.parseFloat(geometry[1]).toFixed(6);
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
    this.hasGeo = false;
    this.$refs["form"].resetFields();
    this.endPoint();
    this.isEdit = false;
    this.editting = false;
  },
  watch: {
    actionsPanelVisible(b) {
      if (b === false) this.$emit("update:visible", b);
    },
    async selectFeature(b) {
      console.log(b);
      b && this.getPropertyByFeature(b);
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