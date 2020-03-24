<template>
    <div class="left-item">
        <base-info-item v-if="yzNearbyVisible">
            <div slot="header" class="header-content">周边油站</div>
            <div slot="content" v-loading="nearLoading" element-loading-text="周边数据正在加载中,请稍后">
                 <div v-if="!nearInfo">暂无数据</div>
                <div class="intro">
                    方圆2公里有:
                    <span>{{parseInt(nearInfo && nearInfo.r2Count)}}</span> 家加油站, 平均销量:
                    <span>{{parseInt(nearInfo && nearInfo.r2Avg)}}</span>
                </div>
                <div class="intro">
                    方圆5公里有:
                    <span>{{parseInt(nearInfo && nearInfo.r5Avg)}}</span>家加油站, 平均销量:
                    <span>{{parseInt(nearInfo && nearInfo.r5Count)}}</span>
                </div>
                <div class="intro">
                    直线距离最近的油库为:
                    <span>{{nearInfo && nearInfo.ykName}}</span>
                </div>
            </div>
        </base-info-item>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getNearInfo } from "@/data/yz";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");

export default {
    name: "yzNearby",
    props: {
        yzNearbyVisible: Boolean
    },
    data() {
        return {
            nearInfo: null,
            nearLoading: false
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
   
    methods: {},
    watch: {
        async yzNearbyVisible(visible) {
            if (visible) {
                this.nearLoading = true;
                this.nearInfo = await getNearInfo(this.selectFeature.get("id"));
                console.log("this.nearInfo",this.nearInfo);
                
                this.nearLoading = false
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

  

    
    .item {
        i {
            font-size: 14px;
        }
    }

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
</style>