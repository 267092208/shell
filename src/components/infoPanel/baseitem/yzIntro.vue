<template>
        <div class="left-item">
            <base-info-item v-if="yzIntroVisible">
                <div slot="header" class="header-content">油站简介</div>
                <div slot="content">
                    <div class="intro">
                        油站名:
                        <span>{{infoIntro.站名}}</span>
                    </div>
                    <div class="intro">
                        品牌:
                        <span>{{infoIntro.品牌}}</span>
                    </div>
                    <div class="intro">
                        日销量/k:
                        <span>
                            {{infoIntro.日销量
                            }}
                        </span>
                    </div>
                    <div class="intro">
                        年销量/mln:
                        <span>{{infoIntro.年销量}}</span>
                    </div>
                    <div class="intro">
                        汽柴比:
                        <span>{{infoIntro.柴汽比}}</span>
                    </div>
                    <div class="intro">
                        汽油车车流（16小时）:
                        <span>{{infoIntro.车流量_汽油车?infoIntro.车流量_汽油车:"暂无数据"}}</span>
                    </div>
                    <div class="intro">
                        柴油车车流（16小时）:
                        <span>{{infoIntro.车流量_柴油车?infoIntro.车流量_柴油车:"暂无数据"}}</span>
                    </div>
                </div>
                <div slot="footer">
                    <el-button-group
                        v-if="selectFeature && selectFeature.properties['品牌']==='YC Shell'"
                    >
                        <el-button
                            title="点击查看历史车流信息"
                            type="primary"
                            size="mini"
                            @click.native="carflowInfoVisible = true"
                        >历史车流</el-button>
                    </el-button-group>
                </div>
            </base-info-item>
        <carflow-info :dialogVisible.sync="carflowInfoVisible"></carflow-info>

        </div>
</template>

<script>
import { mapState } from "vuex";
import { getPhotos, getPhotoHis, deletePhoto } from "@/data/photo";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");
const carflowInfo = () => import("@/components/infoPanel/content/carflowInfo");

export default {
    name: "yzIntro",
    props: {
        yzIntroVisible: Boolean
    },
    data() {
        return {
            carflowInfoVisible: false,
            infoIntro: null
        };
    },
    computed: {
        ...mapState({
            selectFeature: state => state.selectFeature.selectFeature,
            selectFeatureLayer: state => state.selectFeature.selectFeatureLayer
        })
    },
    components: {
        baseInfoItem,
        carflowInfo
    },
    created() {
        if (this.selectFeature) {
            this.infoIntro = this.selectFeature.getProperties();
        }
    },

    methods: {
    },
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