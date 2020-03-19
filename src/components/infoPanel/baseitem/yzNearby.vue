<template>
        <div class="left-item">
            <base-info-item  v-if="yzNearbyVisible">
                <div slot="header" class="header-content">周边油站</div>
                <div slot="content">
                    <div class="intro">
                        方圆2公里有:
                        <span>{{infoIntro.near2kMount}}</span> 家加油站, 平均销量:
                        <span>{{infoIntro.near2kSell}}</span>
                    </div>
                    <div class="intro">
                        方圆5公里有:
                        <span>{{infoIntro.near5kMount}}</span>家加油站, 平均销量:
                        <span>{{infoIntro.near5kSell}}</span>
                    </div>
                    <div class="intro">
                        直线距离最近的油库为:
                        <span>{{infoIntro.nearest}}</span>
                    </div>
                </div>
            </base-info-item>
        </div>
</template>

<script>
import { mapState } from "vuex";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");

export default {
    name: "yzNearby",
    props: {
        yzNearbyVisible:Boolean
    },
    data() {
        return {
            infoIntro:null
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
   created() {
        if (this.selectFeature) {
            this.infoIntro = this.selectFeature.getProperties();
        }
    },


    methods: {},
    watch: {
         selectFeature() {
            if (this.selectFeature) {
                this.infoIntro = this.selectFeature.properties;
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

    .noimg {
        // width: 100%;
        // height: 200px;
        // background:url("~@/assets/images/noimages.jpg");
    }

    .img-list {
        height: 200px;
        overflow-y: auto;
        .img-wrap {
            position: relative;
            .select-icon {
                font-size: 20px;
                position: absolute;
                z-index: 9;
                background-color: #67c23a;
                bottom: 12px;
                right: 14px;
                color: #fff;
                border-radius: 50%;
                text-align: c;
                line-height: 20px;
            }
        }

        .station-img {
            margin-bottom: 5px;
            border: 3px solid $infopanel-title-bgcolor;
            margin-right: 10px;

            &:hover {
                border: 3px solid $theme-color;
                cursor: pointer;
            }

            .el-image-viewer__close {
                color: $theme-header;
                &:hover {
                    color: $theme-color;
                }
            }

            .el-image-viewer__actions__inner i {
                &:hover {
                    cursor: pointer;
                    color: $theme-color;
                }
            }
        }
        .select {
            &:hover {
                border: 3px solid #fff;
            }
        }
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