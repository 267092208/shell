<template>
  <div class="layer-list">
    <el-scrollbar class="now-list" style="height:100%">
      <el-form
        ref="CurrentLayerInfo"
        label-width="100px"
        size="mini"
        label-position="left"
        v-if="LayerInfo"
      >
        <transition-group name="el-fade-in-linear">
          <el-form-item
            v-for="(item,index) in CurrentLayerInfo"
            :key="index"
            :label="item.queryfield"
            v-show="item.display !== -1"
          >
            <!-- 判断是否是input -->
            <!-- 判断是否含有单位(是不是数字类型) -->
            <el-input
              :placeholder="item.placeholder"
              v-model="item.value"
              v-if="item.type == 'input' && !item.units"
            ></el-input>
            <el-input
              :prop="item.value"
              :placeholder="item.placeholder"
              :class="numFlag ? 'errorTips' : ''"
              v-model.number="item.value"
              v-if="item.type == 'input' && item.units"
            >
              <template slot="append" v-if="item.units">{{ item.units }}</template>
            </el-input>
            <!-- 判断是否是radio -->
            <el-radio-group v-model="item.value" v-if="item.type == 'radio'">
              <el-radio
                v-for="(radioList,radio) in item.typeValue"
                :key="radio"
                :label="radio"
                @change="inCaRadioChanged(radioList.inCa,item)"
              >{{radioList.label}}</el-radio>
            </el-radio-group>
            <!-- 判断是否是checkbox -->
            <el-checkbox-group v-model="item.value" v-if="item.type == 'checkbox'">
              <el-checkbox
                v-for="(checkboxList,checkbox) in item.typeValue"
                :key="checkbox"
                :label="checkboxList.label"
              ></el-checkbox>
            </el-checkbox-group>
            <!-- 判断是不是date -->
            <el-date-picker
              v-if="item.type == 'date'"
              v-model="item.value"
              :type="item.type"
              :placeholder="item.placeholder"
              :value-format="item.format"
              size="mini"
            ></el-date-picker>
          </el-form-item>
        </transition-group>
      </el-form>
      <el-tree v-else></el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
///TODO:代码要重新写  组件层级过深
import CurrentLayerFilter from "@/assets/config/CurrentLayerFilter.js";
import CurrentLayer from "@/store/module/layer.js";
import gcoord from "gcoord";

export default {
  data() {
    return {
      numFlag: true,
      LayerIndex: 0,
      CurrentLayerInfo: []
    };
  },
  computed: {
    LayerInfo: function () {
      if (CurrentLayer.state.currentLayer != null) {
        CurrentLayerFilter.forEach(res => {
          if (res.id == CurrentLayer.state.currentLayer.id) {
            this.CurrentLayerInfo = res.list;
          }
        });
        return true;
      }
    },
    showFlag: function () {
      // debugger;
      if (this.CurrentLayerInfo.find((element) => (element.queryfield == "是否CRT油站"))) {
        return this.CurrentLayerInfo.find((element) => (element.queryfield == "是否CRT油站")).value;
      }
    }
  },
  watch: {
    showFlag: function (v, o) {
      let cloneData = {};
      if (v.indexOf("是") != -1 && v.length == 1) {
        this.CurrentLayerInfo.forEach(res => {
          if (res.hasOwnProperty("display")) {
            res.display = 1;
          }
        })
      } else {
        this.CurrentLayerInfo.forEach(res => {
          if (res.hasOwnProperty("display")) {
            if (res.field == "是否VA油站") {
              res.value = ["是", "否"];
            } else if (res.field == "B2B销量支持") {
              res.value = "";
            } else if (res.field == "网络策略") {
              res.value = ["填补空白", "网格加密"];
            } else if (res.field == "按区域") {
              res.value = 0
            }
            res.display = -1;
          }
        })
      }
    }
  },
  methods: {
    async inCaRadioChanged(isinca, item) {
      if (isinca) {
        // TODO:组件层级过深
        const autoClose = this.$parent.$parent.$parent.$parent.autoClose;
        this.$parent.$parent.$parent.$parent.autoClose = false;
        const geometryInstance = await this.$store.dispatch("getGeometry", 'polygon');
        if (geometryInstance) {
          // const value = geometryInstance.geometry.coordinates[0].join(";")
          // item.value = value;
          geometryInstance.on("update", (geometry) => {
            let value = geometryInstance.getFeature().getGeometry().getCoordinates();
            value[0] = value[0].map(([x, y]) => {              return gcoord.transform([x, y], gcoord.EPSG3857, gcoord.BD09);
            }).join(";");
            // const value = geometry.coordinates[0].join(";")
            item.value = value;
          })
          // this.$parent.$parent.$parent.$parent.autoClose = autoClose;
          // console.log(value, item)
        }
      }
    }
  }
};
</script>
<style lang="scss">
.layer-list {
  height: 100%;
  .el-input {
    width: 180px !important;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-radio__inner {
    border-radius: 50%;
  }
  .el-radio__inner::after {
    border-radius: 50%;
  }
}
</style>