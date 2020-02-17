<template>
  <div class="info-panel">
    <el-tabs :tab-position="tabPosition" style="height: 100%;" type="border-card" @tab-click="TabClick">
      <el-tab-pane label="基本信息" class="base-container">
        <base-info
          :info-intro="info"
          :station-img-list="stationImgList"
          :child-delete-photo="parentDeletePhoto"
          :photo-loading="photoLoading"
          :POIData="POIData"
          @autoClose="autoClose"
          :selectList="selectList"
          @setSelectList="setSelectList"
        ></base-info>
      </el-tab-pane>
      <el-tab-pane label="详细属性" class="detail">
        <detail-info
          :info-detail="infoDetail"
          :info="info"
          ref="infoDetail"
          :current="current"
          @setCurrent="setCurrent"
        ></detail-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPhotos, getPhotoHis, uploadPhoto, deletePhoto } from "@/data/photo";

const baseInfoItem = () => import("@/components/infoPanel/baseInfoItem");
const baseInfo = () => import("@/components/infoPanel/baseInfo");
const detailInfo = () => import("@/components/infoPanel/detailInfo");

export default {
  name: "infoPanel",
  data() {
    return {
      tabPosition: "bottom",
      info: {},
      infoDetail: {
        基本信息: [
          "日期",
          "开始时间",
          "数车时长",
          "油站编号",
          "站名",
          "品牌",
          "小网络名",
          "经营状况",
          "短期重开",
          "区县镇",
          "h".length
        ],
        商圈: ["市场环境", "网络类型1", "网络类型2"],
        道路情况: [
          "路名",
          "路侧",
          "道路类型",
          "单向双向",
          "车道数量",
          "限速",
          "弯角",
          "近角远角",
          "辅道内",
          "可否穿越",
          "隔离带",
          "可否调头"
        ],
        场地设备: [
          "出口长度M",
          "前庭长M",
          "前庭深M",
          "出入口数量",
          "规则地块",
          "布局",
          "雨棚长M",
          "雨棚深M",
          "雨棚数量",
          "便利店",
          "便利店面积M2",
          "宿舍",
          "换油",
          "加油机数",
          "加油岛数",
          "加油位数"
        ],
        加油站等级: ["可视度", "可进出度", "车流量", "商圈"],
        车流量: ["实测车流_汽油车", "实测车流_摩托车", "实测车流_柴油车"],
        销量及拐入: [
          "实测拐入_汽油车",
          "实测拐入_摩托车",
          "实测拐入_柴油车",

          "单车加油量_汽油",
          "单车加油量_柴油",
          "Actual日销量_汽油",
          "Actual日销量_柴油"
        ],
        目标站预估: [
          "Shell Y-ATP-汽油",
          "Shell Y-ATP-柴油",
          "Shell Y-ATP-总销量",
          "Shell Y4-ATP-汽油",
          "Shell Y4-ATP-柴油",
          "Shell Y4-ATP-总销量"
        ],
        备注: ["Remark", "目标"],
        国家定价: ["国家定价_98", "国家定价_95", "国家定价_92", "国家定价_0"],
        挂牌价格: ["挂牌价格_98", "挂牌价格_95", "挂牌价格_92", "挂牌价格_0"],
        差价: ["差价_98", "差价_95", "差价_92", "差价_0"],
        柴油促销方案: [
          // "促销方案_柴油_买赠",
          "促销方案_柴油_买赠",
          "促销方案_柴油_满减",
          "促销方案_柴油_积分",
          "促销方案_柴油_抽奖",
          "促销方案_柴油_第三方优惠",
          "促销方案_柴油_其他"
        ],
        汽油促销方案: [
          // "促销方案_汽油_买赠",
          "促销方案_汽油_买赠",
          "促销方案_汽油_满减",
          "促销方案_汽油_积分",
          "促销方案_汽油_抽奖",
          "促销方案_汽油_第三方优惠",
          "促销方案_汽油_其他"
        ],
        规划信息: [
          "十二五规划",
          "规划编号",
          "成品油资格",
          "经信委编号",
          "NTI新建"
        ],
        CRT: ["是否CRT油站", "B2B销量支持", "是否VA油站", "网络策略", "CRT备注"]
      },
      stationImgList: [],
      POIData: [],
      photoLoading: false,
      current: 0,
      selectList: []
    };
  },
  components: {
    baseInfoItem,
    baseInfo,
    detailInfo
  },
  mounted() {
    this.$parent.autoClose = false;
    this.photoLoading = true;

    if (this.selectFeature) {
      this.info = this.selectFeature.properties;

      if (this.selectFeatureLayer) {
        //获取选中元素的图片列表

        getPhotos(this.selectFeature, this.selectFeatureLayer.id).then(res => {
          this.stationImgList = res;
          this.photoLoading = false;
        });
      }
    }

    this.$parent.afterClose = function() {
      this.$store.dispatch("selectFeatureAndLayer", {
        feature: this.selectFeature,
        layer: this.selectFeatureLayer
      });
    }.bind(this);
  },
  computed: {
    ...mapState({
      selectFeature: state => state.selectFeature.selectFeature,
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
      selectPhotoList: state => state.selectFeature.selectPhotoList,
      photoStatus: state => state.panel.photoStatus
    })
  },
  methods: {
    init() {
      this.$parent.autoClose = false;
      this.current = 0;
      this.selectList = [];

      this.$parent.title = this.info["站名"] + " - " + this.info["油站编号"];
      this.$parent.afterClose = function() {
        this.$store.dispatch("clearSelect");
      }.bind(this);
    },

    //子组件删除图片
    parentDeletePhoto(data) {
          let date = new Date().toLocaleString

      // this.$store.dispatch("setPhotoStatus",true);
      this.stationImgList.splice(data.index, 1);

      deletePhoto(
        this.selectFeature,
        this.selectFeatureLayer.id,
        data.selectList
      )
        .then(res => {
          this.$store.dispatch("setPhotoStatus", date);
        })
        .catch(err => {
          console.log("发生错误" + err);
        });
    },

    //关闭后触发事件
    cancelSelect() {
      this.current = 0;
      this.$store.dispatch("selectFeatureAndLayer", {
        feature: this.selectFeature,
        layer: this.selectFeatureLayer
      });
    },

    autoClose(val) {
      console.log("look", val);
      this.$parent.autoClose = val;
    },
//设置详细信息面板里的导航的index值
    setCurrent(index) {
      this.current = index;
    },

    setSelectList(flag, val) {
      if (flag === "clear") {
        this.selectList = [];
      } else if (flag === "add") {
        
        this.selectList.push(val);
      } else if ((flag === "reduce")) {
        let i = this.selectList.indexOf(val);
        this.selectList.splice(i, 1);

      }
    },
    TabClick(obj){
     
      // this.current = 0
      // this.$refs.infoDetail.scrollTo(this.current)
      
    }
  },
  watch: {
    selectFeature: function() {
      this.photoLoading = true;
      if (this.selectFeature) {
        this.info = this.selectFeature.properties;
        this.$parent.title = this.info.站名 + " - " + this.info.油站编号;

        if (this.selectFeatureLayer) {
          //获取选中元素的图片列表
          getPhotos(this.selectFeature, this.selectFeatureLayer.id).then(
            res => {
              this.stationImgList = res;
              this.photoLoading = false;
            }
          );
          this.selectList = [];
        }
      }
    },
    photoStatus: function() {
      this.photoLoading = true;

      if (this.selectFeature && this.selectFeatureLayer) {
        getPhotos(this.selectFeature, this.selectFeatureLayer.id).then(res => {
          this.stationImgList = res;
          this.photoLoading = false;
        });
      }
    }

   
  },
  beforeDestroy() {
    //this.$parent.afterClose = function() {};
  }
};
</script>

<style lang="scss" >
@import "@/assets/css/public.scss";

.info-panel {
  overflow: auto;
  height: calc(100% - 39px);

  &::-webkit-scrollbar {
    width: 0px;
    opacity: 0;
    -webkit-overflow-scrolling: touch;
  }

  // .info-container {
  // .info-content {
  .el-tabs__content {
    padding: 0;

    position: static;
  }

  .el-tabs--border-card {
    box-shadow: none;
    border: none;
    background-color: $rightpanel-bgcolor;
  }

  .el-tabs--bottom.el-tabs--border-card .el-tabs__header.is-bottom {
    border: none;
  }

  .el-tabs__header {
    position: static;
  }

  .el-tabs__nav-wrap {
    position: absolute;
    bottom: 0;
    border-top: 2px solid #e4e7ed;
    background-color: $theme-bg-color;
    width: 100%;
    z-index: 999;
  }
  // }
  // }
}
</style>