<template>
    <div class="info-panel">
        <ul class="tab-title">
            <li
                v-for="(item,index) in tabTitle"
                :key="index"
                @click="toggleTab(index)"
                :class="{'select':index=== selectIndex}"
            >{{item}}</li>
        </ul>
        <div class="tab-content">
            <keep-alive>
                <component
                    :is="currentView"
                    @autoClose="autoClose"
                    :info-detail="infoDetail"
                    :info="info"
                    @setCurrent="setCurrent"
                ></component>
            </keep-alive>
        </div>

        <!-- <el-tabs :tab-position="tabPosition" style="height: 100%;" type="border-card" @tab-click="TabClick">
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
        </el-tabs>-->
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getPhotos, getPhotoHis, uploadPhoto, deletePhoto } from "@/data/photo";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");
const baseInfo = () => import("@/components/infoPanel/baseInfo");
const detailInfo = () => import("@/components/infoPanel/detailInfo");

export default {
    name: "infoPanel",
    data() {
        return {
            tabPosition: "bottom",
            tabTitle: ["基本信息", "详细属性"],
            currentView: baseInfo,
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
                车流量: [
                    "实测车流_汽油车",
                    "实测车流_摩托车",
                    "实测车流_柴油车"
                ],
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
                国家定价: [
                    "国家定价_98",
                    "国家定价_95",
                    "国家定价_92",
                    "国家定价_0"
                ],
                挂牌价格: [
                    "挂牌价格_98",
                    "挂牌价格_95",
                    "挂牌价格_92",
                    "挂牌价格_0"
                ],
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
                CRT: [
                    "是否CRT油站",
                    "B2B销量支持",
                    "是否VA油站",
                    "网络策略",
                    "CRT备注"
                ]
            },
            selectIndex: 0
        };
    },
    components: {
        baseInfoItem,
        baseInfo,
        detailInfo
    },
    mounted() {
        this.$parent.autoClose = false;

        if (this.selectFeature) {
            this.info = this.selectFeature.getProperties();
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

            this.$parent.title =
                this.info["站名"] + " - " + this.info["油站编号"];
            this.$parent.afterClose = function() {
                this.selectIndex = 0;
                this.currentView = baseInfo;
                this.$store.dispatch("clearSelect");
            }.bind(this);
        },

        toggleTab(index) {
            let componentList = [baseInfo, detailInfo];
            this.currentView = componentList[index];
            this.selectIndex = index;
        },

        //关闭后触发事件
        cancelSelect() {
            // this.current = 0;

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
            // this.current = index;
        },

        setSelectList(flag, val) {
            if (flag === "clear") {
                this.selectList = [];
            } else if (flag === "add") {
                this.selectList.push(val);
            } else if (flag === "reduce") {
                let i = this.selectList.indexOf(val);
                this.selectList.splice(i, 1);
            }
        },
    },
    watch: {
        selectFeature() {
            // this.photoLoading = true;
            if (this.selectFeature) {
                this.selectIndex = 0;
                this.currentView = baseInfo;
                this.info = this.selectFeature.properties;
                this.$parent.title =
                    this.info.站名 + " - " + this.info.油站编号;

            }
        },
    },
    beforeDestroy() {
        //this.$parent.afterClose = function() {};
    }
};
</script>

<style lang="scss" >
@import "@/assets/css/public.scss";

.info-panel {
  position: relative;
    overflow: hidden;
    height: 100%;
    background-color: $rightpanel-bgcolor;



    .tab-title {
        // display: flex;
        position: absolute;
        height: 39px;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: $rightpanel-bgcolor;
        border-top: 1px solid $infopanel-detail-bdcolor;
        z-index: 9;
        // justify-content: space-around;

        li {
            padding: 10px 0;
            font-size: 15px;
            border-right: 1px solid $infopanel-detail-bdcolor;
            float: left;
            width: calc(50% - 1px);
            text-align: center;
            &:hover {
                color: $rightpanel-nav-active-bgcolor;
                cursor: pointer;
            }

            &:last-child {
                border-right: none;
            }
        }
        .select {
            color: $rightpanel-nav-active-bgcolor;
        }
    }

    .tab-content {
        height: calc(100% - 40px);
        overflow: hidden;
    }
}
</style>