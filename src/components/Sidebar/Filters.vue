<template>
  <div class="filters" v-loading="loading" element-loading-text="筛选中" style="width: 100%">
    <global-filter ref="getGlobalInfo" />
    <div class="title">
      当前图层筛选
      <span v-if="LayerTitle">-{{LayerTitle}}</span>
      <span class="nothing" v-else>-无当前图层</span>
    </div>
    <now-filter />
    <el-tooltip effect="dark" content="未有图层显示" placement="top" v-if="!ban">
      <el-button type="primary" class="forbid filters-btn">筛选</el-button>
    </el-tooltip>
    <el-button type="primary" class="filters-btn" :icon="filterIcon" @click="filter()" v-else>筛选</el-button>
  </div>
</template>

<script>
import globalFilter from "./GlobalFilter.vue";
import nowFilter from "./NowFilter.vue";
import { mapState } from "vuex";
import CurrentLayerFilter from "@/assets/config/CurrentLayerFilter.js";
import CurrentLayer from "@/store/module/layer.js";
export default {
  data() {
    return {
      loading: false,
      filterIcon: "el-icon-search",
      CurrentLayerInfo: [],
      Filters: [],
      globalFilters: [],
      result: false,

      globalFiltersKeys: []
    };
  },
  methods: {
    //点击筛选函数
    filter() {
      console.log(this.geometryInstance)
      this.geometryInstance && this.geometryInstance.disable()
      /**
       * 获取通用筛选选中的数据
       * @param globalFilters 通用筛选数据
       */
      if (this.$refs.getGlobalInfo.globalInfo) {
        let generalFilterData = {
          field: "",
          value: this.$refs.getGlobalInfo.globalInfo,
          relation: "cityOrMaIdsOrQuery",
          type: "string"
        };
        this.globalFilters.push(generalFilterData);

        this.globalFiltersKeys = this.$refs.globalFiltersKeys;
      }

      /**
       * 获取当前图层筛选的数据
       * @param Filters 当前图层数据
       */
      this.CurrentLayerInfo.forEach(res => {
        if (!Array.isArray(res.value)) {
          if (res.value == "") {
            return;
          } else {
            let CurrentData = {};
            if (Array.isArray(res.value)) {
              console.log(res.value[0]);
            }
            CurrentData.field = res.field;
            CurrentData.value = res.value;
            CurrentData.relation = res.queryrelation;
            CurrentData.type = res.dataType;
            this.Filters.push(CurrentData);
            // CurrentData = {};
          }
        } else {
          if (
            res.value.length == res.typeValue.length ||
            res.value.length == 0
          ) {
          } else {
            let CurrentData = {};
            CurrentData.field = res.field;
            CurrentData.value = res.value;
            CurrentData.relation = res.queryrelation;
            CurrentData.type = res.dataType;
            this.Filters.push(CurrentData);
          }
        }
      });
      // 设置login
      this.filterIcon = "el-icon-loading";
      this.loading = true;
      console.log(this.Filters)
      //设置筛选条件(含通用和图层筛选)
      this.$store
        .dispatch("setLayerFilter", {
          global: this.globalFilters,
          layerid: CurrentLayer.state.currentLayer.id,
          layerFilters: this.Filters,
        })
        .then(() => {
          this.loading = false;
          this.filterIcon = "el-icon-search";
          this.globalFilters = [];
          this.Filters = [];
        })
        .catch(error => {
          this.loading = false;
          this.filterIcon = "el-icon-search";
          this.$message.error("筛选出错");
        });
    }
  },
  components: {
    globalFilter,
    nowFilter
  },
  mounted() {
    this.$parent.title = "筛选面板(Alt+1)";
  },
  computed: {
    LayerTitle: function () {
      if (CurrentLayer.state.currentLayer) {
        CurrentLayerFilter.forEach(res => {
          if (res.id == CurrentLayer.state.currentLayer.id) {
            this.CurrentLayerInfo = res.list;
          }
        });
        return CurrentLayer.state.currentLayer.name;
      } else {
      }
    },
    ...mapState({
      layersVisible: state => state.layer.visible,
      geometryInstance: state => state.geometry.geometryInstance

    }),
    ban() {
      for (const key in this.layersVisible) {
        if (this.layersVisible.hasOwnProperty(key)) {
          const visible = this.layersVisible[key];
          if (visible) {
            return true
          }
        }
      }
      return false
    },
  },
  watch: {
    // CurrentLayerInfo(val) {}
  }
};
</script>

<style lang="scss">
.left {
  float: left;
}
.right {
  float: right;
}
.filters {
  height: 100%;
  width: 100%;
  .title {
    padding: 10px;
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
    background-color: #f5f7fa;
    .nothing {
      color: #909399;
    }
  }
  .filters-btn {
    display: block;
    width: 95%;
    margin: 15px auto;
    &.forbid {
      cursor: no-drop;
      color: #fff;
      background-color: #a0cfff;
      border-color: #a0cfff;
    }
  }
}
</style>