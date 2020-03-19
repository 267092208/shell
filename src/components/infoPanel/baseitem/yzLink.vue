<template>
        <div class="left-item">
            <base-info-item v-if="yzLinkVisible">
                <div slot="header" class="header-content">关联油站</div>
                <div slot="content">
                    <div v-if="relateStationList.length === 0">暂无数据</div>
                    <div v-else>
                        <el-checkbox
                            :indeterminate="isIndeterminate"
                            v-model="checkAll"
                            @change="handleCheckAllChange"
                        >全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group
                            v-model="checkedRelateStations"
                            @change="handleCheckedCitiesChange"
                        >
                            <el-checkbox
                                v-for="station in relateStationList"
                                :label="station"
                                :key="station"
                            >{{station}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div slot="footer">
                    <el-button-group>
                        <el-button
                            title="点击添加后在地图上点选关联油站"
                            type="primary"
                            icon="el-icon-plus"
                            size="mini"
                            @click="addLinkStation"
                        ></el-button>
                        <el-button
                            title="取消添加"
                            type="primary"
                            icon="el-icon-close"
                            size="mini"
                            @click="cancelAdd"
                            :disabled="!isAddLink"
                        ></el-button>

                        <el-button
                            title="删除关联油站"
                            type="primary"
                            icon="el-icon-delete"
                            size="mini"
                            @click="deleteLinkStation"
                            disabled
                        ></el-button>
                        <el-button
                            title="填写油站编号添加"
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            @click.native="addInfo"
                        ></el-button>
                    </el-button-group>
                </div>
            </base-info-item>
        </div>
</template>

<script>
import { mapState } from "vuex";
import { getPhotos, getPhotoHis, deletePhoto } from "@/data/photo";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");

export default {
    name: "yzLink",
    props: {
        yzLinkVisible:Boolean
    },
    data() {
        return {
            relateStationList: [],
            isIndeterminate: true,
            checkedRelateStations: [],
            checkAll: false,
              isAddLink:false,
            isCancelLink:false,

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
    },

    methods: {
        //全选
        handleCheckAllChange(val) {
            this.checkedRelateStations = val ? this.relateStationList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.relateStationList.length;
            this.isIndeterminate =
                checkedCount > 0 &&
                checkedCount < this.relateStationList.length;
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
                                this.childDeletePhoto({
                                    index: imgIndex,
                                    selectList: this.selectList
                                });
                            }
                        });
                    });

                    // this.selectList = [];
                    this.$emit("setSelectList", "clear");

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

        //添加信息
        addInfo() {
            this.$prompt("请输入添加的油站编号", "添加油站", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "添加成功 "
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消输入"
                    });
                });
        },
        //添加油站
        addStation() {},
         //在地图上选点关联油站
         async addLinkStation(){
            this.isAddLink = true
            // await 
          
            if(this.isAddLink){}

        },
        //取消添加关联油站
        cancelAdd(){

        },
        //取消添加关联油站
        deleteLinkStation(){

        },
    },
    watch: {
        selectFeature() {
            if (this.selectFeature) {
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