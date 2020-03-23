<template>
  <div class="filters" v-loading="loading" element-loading-text="筛选中" style="width: 100%">
    <!-- 通用筛选 -->
    <div class="title">通用筛选</div>
    <!-- 通用筛选 行政区划的选择 -->
    <el-card
      class="box-card"
      shadow="never"
      v-loading="globalLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="数据加载中,请稍等"
      style="width: 100%"
    >
      <el-scrollbar class="city-list" style="height:100%">
        <el-tree
          ref="globalTree"
          :data="areaList"
          show-checkbox
          node-key="key"
          :highlight-current="false"
          :default-expanded-keys="['province_33']"
          :default-checked-keys="globalFiltersKeys"
        ></el-tree>
      </el-scrollbar>
    </el-card>
    <div class="title">
      当前图层筛选
      <span v-if="currentLayerName">-{{currentLayerName}}</span>
      <span v-else class="nothing">-无当前图层</span>
    </div>
    <!-- 当前图层筛选 -->
    <div class="layer-filter" shadow="never">
      <el-scrollbar v-if="currentLayerName" class="now-list" style="height:100%">
        <el-form
          :model="formDatas[currentLayer.id]"
          label-width="100px"
          size="mini"
          label-position="left"
        >
          <el-form-item v-for="(item,index) in filterDatas" :key="index" :label="item.label">
            <!-- input -->
            <el-input
              :placeholder="item.placeholder"
              v-model="formDatas[currentLayer.id][item.label]"
              v-if="item.input.type === 'input'"
            ></el-input>
            <!-- checkbox -->
            <el-checkbox-group
              v-model="formDatas[currentLayer.id][item.label]"
              v-if="item.input.type === 'checkbox'"
            >
              <el-checkbox
                v-for="(enmu,i) in item.input.enmus"
                :key="i"
                :label="enmu.value"
                :name="item.label"
              >{{enmu.text}}</el-checkbox>
            </el-checkbox-group>
            <!-- area 按区域 -->
            <el-checkbox-group v-if="item.input.type === 'area'">
              <el-button
                title="请在地图上绘画图形"
                @click="drawArea(item)"
                size="mini"
                :type="isDrawAreaing? 'success':'primary'"
                icon="iconfont icon-duobianxing"
              >{{isDrawAreaing?'取消绘画':'开始绘画'}}</el-button>
            </el-checkbox-group>
            <!-- date -->
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="submit">
      <el-tooltip effect="dark" content="未有图层显示" placement="top" v-if="!ban">
        <el-button type="primary" class="forbid filters-btn">筛选</el-button>
      </el-tooltip>
      <el-button
        type="primary"
        class="filters-btn"
        icon="el-icon-search"
        @click="filter()"
        v-else
      >筛选</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import filterData from "@/config/filter.js";
import { getCityAndMATreeObj } from "@/data/division.js";
import Vue from "vue";
import { deepCopy } from "@/assets/js/utils.js";
import gcoord from "gcoord"
let geometryInstance = null;
/**
 * default
 * 默认值
 */
const defaultFormDatas = {};

/**
 * 获取指定图层筛选配置
 */
function getFiltersByLayerId(layerid){
  return filterData[layerid] || filterData.defaultFilters;
}

export default {
  data() {
    return {
      loading: false,
      /***
       * 行政区划数据
       * @type {Array<{
       *   key:string
       *   label: string,
       *   children: [{
       *     key:string
       *     label: string,
       *     children: [类推结构]
       *   }> }
       */
      areaList: [],
      /**
       * 通用筛选数据是否在加载中
       */
      globalLoading: false,
      /**
       * 图层筛选 表单的数据
       * @type { {[layerID]:{[label]:data}} }
       */
      formDatas: {},
      isDrawAreaing: false
    };
  },
  computed: {
    filterDatas() {
      if (this.currentLayer) {
        this.setFormDatas();
        return getFiltersByLayerId(this.currentLayer.id);
      }
      return [];
    },
    /**
     * 当前选择图层名称
     */
    currentLayerName: function () {
      return this.currentLayer && this.currentLayer.name;
    },
    ...mapState({
      layersVisible: state => state.layer.visible,
      currentLayer: state => state.layer.currentLayer,
      globalFiltersKeys: state => state.layer.globalFiltersKeys
    }),
    ban() {
      for (const key in this.layersVisible) {
        if (this.layersVisible.hasOwnProperty(key)) {
          const visible = this.layersVisible[key];
          if (visible) {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * @type {[label:string]:
     *  {
     *  label:string,
     *  placeholder?:string,
     *  field?:string,
     *  type:'int'|'string'|'datetime'|'float'|'bool'|'int?'|'datetime?'|'float?'|'bool?'|'area',
     *  relation:'IASF'|'Multiple-IndexOf'|'Multiple-Equal'|'IndexOf'|'='|'!='|'>='|'<='|'booleanExist-false'|'inCa'|'inMa'|'inCity'|'inQx'|'cityOrMaIdsOrQuery',
     *  input:{
     *      type:'input'|'checkbox'|'radio'|'area',
     *      enmus?:Array<{text:string,value:any}>
     *  }
     * } }
     */
    currentLayerFilters() {
      const data = {};
      for (const key in this.filterDatas) {
        if (this.filterDatas.hasOwnProperty(key)) {
          const element = this.filterDatas[key];
          data[element.label] = element;
        }
      }
      return data;
    }
  },
  methods: {
    async drawArea(item) {
      if (!this.isDrawAreaing) {
        const autoClose = this.$parent.autoClose;
        this.$parent.autoClose = false;
        this.isDrawAreaing = true;
        this.$parent.afterClose = () => {
          // this.$store.dispatch("drawDisable");
          geometryInstance && geometryInstance.disable()
          this.isDrawAreaing = false;
        };
        geometryInstance = await this.$store.dispatch("getGeometry", { drawMode: 'Polygon' });
        if (geometryInstance) {
          // let value = geometryInstance.getFeature().getGeometry().getCoordinates();
          // value[0] = res[0].map(([x, y]) => {            return transform([x, y], "EPSG:3857", "EPSG:4326");
          // }).join(";");
          const formDatas = this.formDatas[this.currentLayer.id];
          // formDatas[item.label] = value;
          geometryInstance.on("update", geometry => {
            let value = geometryInstance.getFeature().getGeometry().getCoordinates();

            value[0] = value[0].map(([x, y]) => {              return gcoord.transform([x, y], gcoord.EPSG3857, gcoord.BD09);
            }).join(";");
            formDatas[item.label] = value;
          });
        }
      } else {
        geometryInstance && geometryInstance.disable()
        // this.$store.dispatch("drawDisable");
        this.$parent.autoClose = true;
        this.isDrawAreaing = false;
      }
    },
    //点击筛选函数
    /**
     * 点击筛选 获取当前的 筛选选项。 //设置筛选条件(含通用和图层筛选)
     */
    filter() {
      this.loading = true;
      const currentLayerID = this.currentLayer && this.currentLayer.id;
      const globalFiltersKeys = this.$refs.globalTree.getCheckedKeys();

      const city = [];
      const qx = [];
      const ma = [];
      globalFiltersKeys.forEach(t => {
        if (t.indexOf("city") === 0) {
          city.push(t.split("_")[1]);
        } else if (t.indexOf("qx") === 0) {
          qx.push(t.split("_")[1]);
        } else if (t.indexOf("ma") === 0) {
          ma.push(t.split("_")[1]);
        }
      });
      const global = [
        {
          field: "",
          value: city.join(",") + qx.join(",") + ";" + ma.join(","),
          relation: "cityOrMaIdsOrQuery",
          type: "string"
        }
      ];

      //对比还是默认的值，全选和全不选 不提交条件
      let layerFilters = [];

      const defaultFormData = defaultFormDatas[currentLayerID];
      const formData = this.formDatas[currentLayerID];
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          const element = formData[key];
          const defaultElement = defaultFormData[key];

          if (
            element.length !== defaultElement.length &&
            element.length !== 0
          ) {
            const _filter = this.currentLayerFilters[key];
            let value = element;
            if (typeof element === "object") {
              value = element.join(",");
            }
            layerFilters.push({
              field: _filter.field,
              value,
              relation: _filter.relation,
              type: _filter.type
            });
          }
        }
      }
      if (!currentLayerID) {
        layerFilters = null;
      }
      geometryInstance && geometryInstance.disable()
      // this.$store.dispatch("drawDisable");
      this.isDrawAreaing = false;
      //设置筛选条件(含通用和图层筛选)
      this.$store
        .dispatch("setLayerFilter", {
          global: global,
          layerid: currentLayerID,
          layerFilters: layerFilters,
          globalKeys: globalFiltersKeys
        })
        .then(() => {
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("筛选出错");
        });
    },
    /**
     * 设置表单内容
     */
    setFormDatas() {
      const val = this.currentLayer;
      if (val && !this.formDatas[val.id]) {
        let data = {};
        getFiltersByLayerId(val.id).forEach(t => {
          const input = t.input;
          if (input.type === "input") {
            data[t.label] = "";
          } else if (input.type === "checkbox") {
            data[t.label] = input.enmus.map(enmu => enmu.value);
          } else if (input.type === "area") {
            data[t.label] = "";
          }
        });
        Vue.set(this.formDatas, val.id, data);
        defaultFormDatas[val.id] = deepCopy(data);
      }
    },
    init() {
      this.$parent.title = "筛选面板(Alt+1)";
      if (this.currentLayer && getFiltersByLayerId(this.currentLayer.id)["自定义区域"]) {
        this.formDatas[this.currentLayer.id]["自定义区域"] = "";
      }
    }
  },
  mounted() {
    this.globalLoading = true;
    // 初始化数据
    getCityAndMATreeObj().then(res => {
      const data = {};
      res.forEach(t => {
        if (!data[t.parentid]) {
          data[t.parentid] = [];
        }
        data[t.parentid].push(t);
      });
      const areaList = [];
      // 从省级开始遍历
      data[0].forEach(t => {
        let key = t.key;
        const first = {
          key: t.key,
          label: t.text
        };
        function getChildren(key) {
          return data[key].map(y => {
            return {
              key: y.key,
              label: y.text
            };
          });
        }
        // 有四层数据
        first.children = getChildren(key);
        first.children.forEach(t => {
          if (data[t.key]) {
            t.children = getChildren(t.key);
            t.children.forEach(o => {
              if (data[o.key]) {
                o.children = getChildren(o.key);
              }
            });
          }
        });
        areaList.push(first);
      });
      this.areaList = areaList;
      this.globalLoading = false;
    });
  }
};
</script>

<style lang="scss" >
.filters {
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  height: 100%;
  width: 100%;
  .el-card__body {
    height: 187px;
    padding: 10px;
    margin: 10px;
    border: 1px solid #dcdfe6;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .title {
    padding: 10px;
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
    background-color: #f5f7fa;
    .nothing {
      color: #909399;
    }
  }
  .box-card {
    height: 230px;
    box-sizing: border-box;
    border: none;
    border-radius: 0;
  }

  .layer-filter {
    border: 1px solid #dcdfe6;
    padding: 10px;
    margin: 10px;
    height: calc(100% - 400px);
    box-sizing: border-box;
    .el-input {
      width: 180px !important;
    }
  }
  //
  .submit {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    .filters-btn {
      display: block;
      width: 100%;
      &.forbid {
        cursor: no-drop;
        color: #fff;
        background-color: #a0cfff;
        border-color: #a0cfff;
      }
    }
  }
}
</style>