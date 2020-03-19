<template>
    <div class="left-item">
        <base-info-item v-if="basePhotoVisible">
            <div slot="header" class="header-content">油站照片</div>

            <div
                slot="content"
                class="img-list"
                v-loading="photoLoading"
                element-loading-text="图片正在加载中,请稍后"
            >
                <el-scrollbar style="height:100%;width:100%">
                    <div v-if="stationImgList.length===0" class="noimg">
                        <el-image
                            style="width: 300px; height: 190px"
                            src="./images/noimages.jpg"
                            fit="cover"
                        ></el-image>
                    </div>
                    <div class="img-wrap" v-for="(item,index) in stationImgList" :key="index">
                        <span
                            class="el-icon-check select-icon"
                            v-if="isSelect(selectList,item)==='select'"
                        ></span>
                        <el-image
                            style="width: 133px; height: 100px"
                            :src="item"
                            fit="cover"
                            class="station-img"
                            :class="[isSelect(selectList,item)]"
                            @click="imgClick(item)"
                            @dblclick="imgDbClick(item,index)"
                            lazy
                        ></el-image>
                    </div>

                    <ImageViewer
                        :isViewerOpen.sync="isViewerOpen"
                        :currentIndex.sync="currentIndex"
                        :imageList="srcList"
                    ></ImageViewer>
                </el-scrollbar>
            </div>
            <div slot="footer">
                <el-button-group>
                    <el-button
                        type="primary"
                        icon="el-icon-upload"
                        size="mini"
                        title="点击上传图片文件"
                        @click.native="uploadPhotoVisible = true"
                    ></el-button>
                    <el-button
                        title="删除选中的照片"
                        type="primary"
                        icon="el-icon-delete-solid"
                        size="mini"
                        @click.native="deleteInfo(photoDelTitle,photoDelMessage,selectList)"
                        :disabled="isDelImg"
                    ></el-button>
                    <el-button
                        title="查看历史照片"
                        type="primary"
                        icon="el-icon-picture"
                        size="mini"
                        @click.native="historyClick"
                    ></el-button>
                </el-button-group>
            </div>
        </base-info-item>
        <upload-photo :dialogVisible.sync="uploadPhotoVisible"></upload-photo>
        <history-photo :dialogVisible.sync="historyPhotoVisible" :history-imgs="historyImgs"></history-photo>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getPhotos, getPhotoHis, deletePhoto } from "@/data/photo";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");

const uploadPhoto = () => import("@/components/infoPanel/content/uploadPhoto");
const historyPhoto = () =>
    import("@/components/infoPanel/content/historyPhoto");
const ImageViewer = () => import("@/components/infoPanel/content/ImageViewer");
export default {
    name: "basePhoto",
    props: {
        basePhotoVisible:Boolean
    },
    data() {
        return {
            stationImgList: [],
            photoLoading: false,
            selectList: [],
            noImgURL: "require('@/assets/images/noimages.jpg')",
            isDelImg: true,
            historyImgs: {},
            isViewerOpen: false,
            currentIndex: -1,
            srcList: [],

            historyPhotoVisible: false,
            photoDelTitle: "删除照片",
            photoDelMessage: "确定要删除所选照片吗？",
            uploadPhotoVisible: false
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
        uploadPhoto,
        historyPhoto,
        ImageViewer
    },
    mounted() {
        this.photoLoading = true;
        this.selectList = [];
        if (this.selectFeature) {
            //获取选中元素的图片列表

            getPhotos(this.selectFeature, this.selectFeatureLayer.id).then(
                res => {
                    this.stationImgList = res;
                    this.photoLoading = false;
                }
            );
        }
    },

    methods: {
        //子组件删除图片
        deleteBasePhoto(data) {
            let date = new Date().toLocaleString;

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

        // 删除信息
        deleteInfo(title, text, data) {
            if (data.length < 1) {
                this.$confirm("请先选择需要删除的内容", title, {
                    type: "warning"
                })
                    .then(() => {})
                    .catch(() => {});
                return;
            }
            this.$confirm(text, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.selectList.forEach(item => {
                        this.stationImgList.forEach((imgItem, imgIndex) => {
                            if (imgItem === item) {
                                this.deleteBasePhoto({
                                    index: imgIndex,
                                    selectList: this.selectList
                                });
                            }
                        });
                    });

                    this.selectList = [];

                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        //图片点击
        imgClick(item) {
            if (!this.selectList.includes(item)) {
                this.selectList.push(item);
            } else {
                let i = this.selectList.indexOf(item);
                this.selectList.splice(i, 1);
            }
        },

        imgDbClick(item, index) {
            this.$emit("autoClose", false);
            this.isViewerOpen = true;
            this.currentIndex = index;
            this.srcList = this.stationImgList;
        },

        //点击查看历史图片
        historyClick() {
            this.historyPhotoVisible = true;
            //获取选中要素的历年照片
            getPhotoHis(this.selectFeature, this.selectFeatureLayer.id).then(
                res => {
                    delete res.NaN;
                    this.historyImgs = res;
                }
            );
        },

        //图片选中状态样式
        isSelect(arr, index) {
            if (arr.includes(index)) {
                return "select";
            }
        },
        // 控制按钮点击样式
        isActive(arr, id) {
            if (arr.includes(id)) {
                return "active";
            } else {
                return "unactive";
            }
        }
    },
    watch: {
        selectFeature() {
            this.photoLoading = true;
            if (this.selectFeature) {
                //获取选中元素的图片列表
                getPhotos(this.selectFeature, this.selectFeatureLayer.id).then(
                    res => {
                        this.stationImgList = res;
                        this.photoLoading = false;
                    }
                );
                this.selectList = [];
                // this.current = 0
            }
        },
        photoStatus: function() {
            this.photoLoading = true;

            if (this.selectFeature && this.selectFeatureLayer) {
                getPhotos(this.selectFeature, this.selectFeatureLayer.id).then(
                    res => {
                        this.stationImgList = res;
                        this.photoLoading = false;
                    }
                );
            }
        },
        selectList() {
            if (this.selectList.length != 0) {
                this.isDelImg = false;
            } else {
                this.isDelImg = true;
            }
        },

        isViewerOpen(val) {
            val === false ? this.$emit("autoClose", true) : "";
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