<template>
    <div class="base-wrap">
        <div class="base-info">
            <!-- <el-scrollbar > -->
            <div class="base-left" ref="baseLeft">
                <basePhoto :basePhotoVisible="infoTitle[0].show"></basePhoto>
                <yzIntro :yzIntroVisible="infoTitle[1].show"></yzIntro>
                <yzLink :yzLinkVisible="infoTitle[2].show"></yzLink>
                <yzCompete :yzCompeteVisible="infoTitle[3].show"></yzCompete>
                <yzPOI :yzPOIVisible="infoTitle[4].show"></yzPOI>
                <yzNearby :yzNearbyVisible="infoTitle[5].show"></yzNearby>
            </div>
            <!-- </el-scrollbar> -->

            <div class="base-right">
                <el-button-group class="title">
                    <el-button
                        type="primary"
                        v-for="(item,index) in infoTitle"
                        :key="index"
                        plain
                        :class="isActive(baseShowList,index)"
                        class="title-item"
                        @click="titleClick(index,item)"
                    >{{item.name}}</el-button>
                </el-button-group>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");
const basePhoto = () => import("@/components/infoPanel/baseitem/basePhoto");
const yzIntro = () => import("@/components/infoPanel/baseitem/yzIntro");
const yzLink = () => import("@/components/infoPanel/baseitem/yzLink");
const yzCompete = () => import("@/components/infoPanel/baseitem/yzCompete");
const yzPOI = () => import("@/components/infoPanel/baseitem/yzPOI");
const yzNearby = () => import("@/components/infoPanel/baseitem/yzNearby");

export default {
    name: "baseInfo",
    props: {
    },
    data() {
        return {
            baseShowList: [0, 1],
            infoTitle: [
                { name: "照片", show: true },
                { name: "简介", show: true },
                { name: "关联", show: false },
                { name: "竞争", show: false },
                { name: "园区", show: false },
                { name: "周边", show: false }
            ],
            currentIndex: -1,
        };
    },
    computed: {
        ...mapState({
            selectFeature: state => state.selectFeature.selectFeature,
            selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
            photoStatus: state => state.panel.photoStatus
        })
    },
    components: {
        baseInfoItem,
        basePhoto,
        yzIntro,
        yzLink,
        yzCompete,
        yzPOI,
        yzNearby
    },
    activated() {
      let index = this.baseShowList.slice(-1)[0]
      
        let targetTop =  document.querySelector(
            `.left-item:nth-child(${index + 1})`
        )?document.querySelector(
            `.left-item:nth-child(${index + 1})`
        ).offsetTop: 0;
        document.querySelector(".base-info").scrollTop = targetTop;
    },

    deactivated() {
    },
    mounted() {

        // this.selectList  = []
        // this.baseScroll = document.querySelector(".base-info .base-left").scrollTop;
    },
    destroyed() {},
    methods: {

        // 基本信息面板标题点击事件
        titleClick(index, item) {
            if (this.baseShowList.includes(index)) {
                let i = this.baseShowList.indexOf(index);
                this.baseShowList.splice(i, 1);
                item.show = false;
            } else {
                this.baseShowList.push(index);
                item.show = true;
            }

            this.scrollTo(index);

            //点击后跳转
        },


        // 控制按钮点击样式
        isActive(arr, id) {
            if (arr.includes(id)) {
                return "active";
            } else {
                return "unactive";
            }
        },
        //点击标签跳转到对应的内容
        scrollTo(index) {
            // this.$emit("setCurrent", index);
            const targetOffsetTop = document.querySelector(
                `.left-item:nth-child(${index + 1})`
            ).offsetTop;
            
            let scrollTop = this.$refs.baseLeft.scrollTop;

            let dtop = Math.abs(targetOffsetTop - scrollTop);

            const STEP = dtop / 12 / 3;

            if (scrollTop > targetOffsetTop) {
                smoothUp();
            } else {
                smoothDown();
            }
            const _this = this;
            // 定义往下滑函数
            function smoothDown() {
                if (scrollTop < targetOffsetTop) {
                    if (targetOffsetTop - scrollTop >= STEP) {
                        scrollTop += STEP;
                    } else {
                        scrollTop = targetOffsetTop;
                    }

                    document.querySelector(".base-info").scrollTop = scrollTop;


                    requestAnimationFrame(smoothDown);
                }
            }
            // 定义往上滑函数
            function smoothUp() {
                if (scrollTop > targetOffsetTop) {
                    if (scrollTop - targetOffsetTop >= STEP) {
                        scrollTop -= STEP;
                    } else {
                        scrollTop = targetOffsetTop;
                    }
                    document.querySelector(".base-info").scrollTop = scrollTop;

                    requestAnimationFrame(smoothUp);
                }
            }
        },

    },
    watch: {
        selectFeature(val) {
            if (val) {
                this.baseShowList = [0, 1];

                this.infoTitle = [
                    { name: "照片", show: true },
                    { name: "简介", show: true },
                    { name: "关联", show: false },
                    { name: "竞争", show: false },
                    { name: "园区", show: false },
                    { name: "周边", show: false }
                ];
            }
        }
    }
};
</script>

<style lang="scss">
@import "@/assets/css/public.scss";
.base-wrap {
    height: 100%;
    .base-info {
        height: 100%;
        background-color: $rightpanel-bgcolor;
        $nav-width: 30px;
        overflow: scroll;

        div::-webkit-scrollbar {
            width: 0px;
            opacity: 0;
            -webkit-overflow-scrolling: touch;
        }

        box-shadow: none;

        .el-scrollbar__wrap {
            overflow-x: hidden;
            margin-bottom: 0 !important;
            margin-right: 0 !important;
        }
         &::-webkit-scrollbar {
                display: none;
            }

        .base-left {
            // min-width: 290px;
            // width: 100%;
            // max-height: 825px;
            overflow: auto;
           
            .left-item {
                // width: 100%;
                background-color: $rightpanel-nav-bdcolor;
                margin-bottom: 10px;
                padding-right: 50px;
            }

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
        .base-right {
            position: absolute;
            top: 0;
            right: 0;
            // bottom: 0;
            height: calc(100% - 39px);
            border-left: 1px solid $rightpanel-nav-bdcolor;
            background-color: $rightpanel-nav-bgcolor;

            .title {
                width: $nav-width;

                .active {
                    background-color: $rightpanel-nav-active-bgcolor;
                    color: $deep-font-color;
                }

                .unactive {
                    color: $shallow-font-color;
                    background: $rightpanel-nav-unactive-bgcolor;
                    border-color: $rightpanel-nav-bdcolor;

                    &:hover {
                        background-color: $rightpanel-nav-hover-bgcolor;
                        color: $shallow-font-color;
                    }
                }

                .title-item {
                    padding: 5px;
                    height: 60px;
                    border-right: none;
                    border-left: none;
                    line-height: 20px;
                    font-size: 14px;
                    white-space: normal;
                }
            }
        }
    }
}
</style>