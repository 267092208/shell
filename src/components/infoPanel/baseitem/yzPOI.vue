<template>
  <div class="left-item">
    <base-info-item v-if="yzPOIVisible">
      <div slot="header" class="header-content">附近POI</div>

      <div slot="content" v-loading="poiLoading" element-loading-text="园区数据正在加载中,请稍后">
        <div v-if="POIData.length ==0">暂无数据</div>
        <div class="poi-item" v-for="(item,index) in POIData" :key="index" v-else>
          <div class="intro">
            名称:
            <span>{{item.名称}}</span>
          </div>
          <div class="intro">
            类型:
            <span>{{item.POI类型}}</span>
          </div>
        </div>
      </div>
    </base-info-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPOIInfo } from "@/data/yz";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");

export default {
  name: "yzPOI",
  props: {
    yzPOIVisible: Boolean
  },
  data() {
    return {
      POIData: [],
      poiLoading: false
    };
  },
  computed: {
    ...mapState({
      selectFeature: state => state.selectFeature.selectFeature,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer
    })
  },
  components: {
    baseInfoItem
  },
  created() { },

  methods: {

  },
  watch: {

    async  yzPOIVisible(visible) {
      if (visible) {
        this.poiLoading = true
        this.POIData = await getPOIInfo(this.selectFeature.get("id"))
        this.poiLoading = false
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";

.left-item {
  // width: 100%;
  background-color: $rightpanel-nav-bdcolor;
  margin-bottom: 10px;
  padding-right: 50px;

  .header-content {
    border-bottom: 1px solid $infopanel-detail-bdcolor;
    padding: 10px 0;
  }

  .el-scrollbar__view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .poi-item {
    display: flex;
    justify-content: start;
    .intro {
      display: inline-block;
      padding: 5px;
      margin-right: 10px;
      span {
        margin-left: 5px;
        font-weight: 600;
      }
    }
  }
}
</style>