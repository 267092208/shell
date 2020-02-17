<template>
  <transition name="slide">
    <el-container
      class="add-layer-wrap"
      :style="actionsPanelVisible ? `bottom: calc(${height}px + 1px);` : 'bottom: 2px;'"
      style="overflow-x: hidden;"
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
          >
            <el-form-item
              v-for="(item, index) in filterForm"
              :key="index"
              :rules="createRule(item)"
              size="mini"
              v-show="item.displayText"
              :label="item.displayText"
              :prop="item.fieldName"
              :label-width="createLabelWidth(item.displayText)"
            >
              <component
                v-if="notDynComponent(item, item.enum)"
                :is="createFormCtrlWithType(item.type, item.fieldName)"
                :placeholder="createPlaceholder(item.displayText, item.type)"
                :inline-message="true"
                v-model="form[item.fieldName]"
                controls-position="right"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                :disabled="item.fieldName === 'lng_baidu' || item.fieldName === 'lat_baidu'"
                checked
                size="mini"
                style="width: 100%;"
              ></component>
              <!-- 时间选择器有bug在动态组件 -->
              <el-time-picker
                v-if="item.fieldName === '开始时间'"
                :placeholder="createPlaceholder(item.displayText, item.type)"
                :inline-message="true"
                v-model="form[item.fieldName]"
                :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59'
                }"
                checked
                size="mini"
                style="width: 100%;"
              ></el-time-picker>
              <el-select
                v-model="form[item.fieldName]"
                v-if="item.enum"
                :placeholder="createPlaceholder(item.displayText, item.type)"
              >
                <el-option
                  style="font-size: 12px;"
                  v-for="(item,index) in item.enum"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <!-- <el-input placeholder="在地图点选位置" suffix-icon="el-icon-date" v-model="form.name"></el-input> -->
              <!-- <div style="width: 100%;" v-html='createFormCtrlWithType(item.type, item.name)'>-->
            </el-form-item>
          </el-form>
        </el-main>
      </el-scrollbar>
      <!-- <el-divider></el-divider> -->
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

export default {
  filters: {
    formFilter: function(value, type) {
      switch (type) {
        case "geometryX":
        case "geometryY":
          return Number.parseFloat(value).toFixed(6);
          break;
        default:
          return value;
      }
    }
  },
  props: ["visible", "height", "title"],
  computed: {
    ...mapState({
      actionsPanelVisible: state => state.header.actionsPanelVisible,
      filtersPanelVisible: state => state.header.filtersPanelVisible,
      layersPanelVisible: state => state.header.layersPanelVisible,
      base: state => state.layer.base,
      currentLayer: state => state.layer.currentLayer
      // geometry: state => state.geometry.geometry
    }),
    filterForm() {
      if (this.fields.length > 0)
        return this.fields.filter(item => {
          // 'get' in item ? console.log(item) : ''
          return !item.readonly && !("get" in item);
        });
      else return [];
    }
  },
  data() {
    return {
      saving: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      fields: [],
      brankOption: [
        {
          value: "选项1",
          label: "SP"
        },
        {
          value: "选项2",
          label: "PC"
        },
        {
          value: "选项3",
          label: "BPPC"
        },
        {
          value: "选项4",
          label: "IND"
        },
        {
          value: "选项5",
          label: "CNOOC"
        },
        {
          value: "6",
          label: "SC"
        },
        {
          value: "7",
          label: "Caltex"
        },
        {
          value: "8",
          label: "YC Shell"
        },
        {
          value: "9",
          label: "停车场"
        }
      ],
      devprocess: [
        { label: "非目标站", value: "0" },
        { label: "Pre-ID", value: "1" },
        { label: "ID", value: "2" },
        { label: "签约", value: "3" },
        { label: "建设", value: "4" },
        { label: "证照", value: "5" },
        { label: "开业", value: "6" }
      ],
      operaStates: [
        { label: "开业", value: 0 },
        { label: "在建", value: 1 },
        { label: "停业", value: 2 },
        { label: "签约", value: 3 }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      geometry: null
    };
  },
  methods: {
    handleKeyUp(e) {
      // console.log(e)
      this.closeAddLayer();
    },
    closeAddLayer() {
      this.endPoint();
      this.$parent.close();
    },
    notDynComponent(item, hasenum) {
      return item.fieldName !== "开始时间" && hasenum == undefined;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // do something
          this.saving = true;
          this.$store
            .dispatch("addLayerFeature", {
              layerid: this.currentLayer.id,
              feature: {
                geometry: this.geometry.geometry,
                properties: this.form
              }
            })
            .then(res => {
              this.$message.success({ message: "添加成功", offset: 60 });
              this.saving = false;
              this.endPoint();
            })
            .catch(err => {
              this.$message.error({ message: "添加失败!", offset: 60 });
              this.saving = false;
              this.endPoint();
            });
        } else {
          this.$message.error({ message: "请正确填写表单!", offset: 60 });
        }
      });
      // console.log("submit!");
    },
    resetForm(formName) {
      try {
        this.$refs[formName].resetFields();
      } catch (err) {
        // console.log(err)
      }
      // console.log(this.geometry)
      this.endPoint();
      this.beginSetPoint();
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
    /**
     * type is string | number | boolean | date | time | geometryX | geometryY
     */
    createRule(item) {
      const { displayText, type } = item;
      let rules = [];
      let typeRule = { type };
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
    createPlaceholder(name, type) {
      if (type === "number" || type === "string") return `${name}`;
    },
    createLabelWidth(name) {
      // return name.indexOf("第三方优惠") > 0 ? "170px" : "";
    },
    beginSetPoint() {
      return this.$store
        .dispatch("getGeometry", "point")
        .then(res => {
          this.geometry = res;
          this.geometry.on("update", e => {
            this.updateCoordinate(e);
          });
          this.updateCoordinate(res.geometry);
        })
        .catch(err => {
          // console.log(err);
        });
    },
    endPoint() {
      this.$store.dispatch("drawDisable");
      if (this.geometry != null) this.geometry.disable();
    },
    updateCoordinate(geometry) {
      this.form["lng_baidu"] = Number.parseFloat(
        geometry.coordinates[0]
      ).toFixed(6);
      this.form["lat_baidu"] = Number.parseFloat(
        geometry.coordinates[1]
      ).toFixed(6);
    },
    init() {
      if (this.currentLayer != null) {
        let layer = this.base.find(item => item.id === this.currentLayer.id);
        this.$parent.title = layer.name;
      }
      this.$parent.autoClose = false;
      this.$parent.afterClose = this.endPoint.bind(this);
    },
    close() {
      this.resetForm("form");
      this.endPoint();
    }
  },
  mounted() {
    if (this.currentLayer != null) {
      let layer = this.base.find(item => item.id === this.currentLayer.id);
      this.fields = layer.fields;
      this.$parent.title = layer.name;
      let form = {};
      for (let item of this.fields) {
        form[item.fieldName] = "";
      }
      this.form = form;
      // this.$parent.afterClose = this.endPoint.bind(this);
      this.beginSetPoint();
      this.$parent.autoClose = false;
    }
  },
  deactivated() {
    this.close();
  },
  activated() {
    this.beginSetPoint();
  },
  beforeDestroy() {
    this.endPoint();
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