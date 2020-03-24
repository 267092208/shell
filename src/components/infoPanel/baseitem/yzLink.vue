<template>
    <div class="left-item">
        <base-info-item v-if="yzLinkVisible">
            <div slot="header" class="header-content">关联油站</div>
            <div slot="content" v-loading="relationLoading" element-loading-text="关联油站正在加载中,请稍后">
                <div v-if="relationFeatures && relationFeatures.length === 0">暂无数据</div>
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
                        class="check-group"
                    >
                        <el-checkbox
                            v-for="(station,index) in relationFeatures"
                            :label="station"
                            :key="index"
                            class="link-list"
                        >站名：{{station["properties"]["站名"]}} &nbsp;&nbsp;&nbsp;编号：{{station["properties"]["油站编号"]}}</el-checkbox>
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
                        :disabled="!checkedRelateStations.length"
                    ></el-button>
                    <el-button
                        title="填写油站编号添加"
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click.native="addRelationByBh"
                    ></el-button>
                </el-button-group>
            </div>
        </base-info-item>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getPhotos, getPhotoHis, deletePhoto } from "@/data/photo";
import { linkFeatureStyle } from "@/config/layer/yzAttr";
import { getLayerOL } from "@/mapTool/mapboxMixins2/utils";

const baseInfoItem = () => import("@/components/infoPanel/common/baseInfoItem");

export default {
    name: "yzLink",
    props: {
        yzLinkVisible: Boolean
    },
    data() {
        return {
            relationData: [],
            isIndeterminate: true,
            checkedRelateStations: [],
            checkAll: false,
            isAddLink: false,
            isCancelLink: false,
            relationLoading: false
        };
    },
    computed: {
        ...mapState({
            selectFeature: state => state.selectFeature.selectFeature,
            selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
            relationFeatures: state => state.linkFeature.relationFeatures,
            addRelationStatus: state => state.linkFeature.addRelationStatus
        })
    },
    components: {
        baseInfoItem
    },
    mounted() {},
    methods: {
        //全选
        handleCheckAllChange(val) {
            this.checkedRelateStations = val ? this.relationFeatures : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.relationFeatures.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.relationFeatures.length;
        },

        //通过编号添加关联油站
        addRelationByBh() {
            this.$prompt("请输入添加的油站编号", "添加油站", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(res => {
                    const bh = res.value;
                    this.$store
                        .dispatch("addLinkFeature", {
                            layerId: this.selectFeatureLayer.id,
                            feature: this.selectFeature,
                            bh,
                            type: "relation"
                        })
                        .then(r => {
                            this.$message({
                                type: "success",
                                message: "添加成功 "
                            });
                        })
                        .catch(err => {
                            this.$message({
                                type: "error",
                                message: "添加失败 " + err
                            });
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
        async addLinkStation() {
            this.isAddLink = true;
            this.$store.dispatch("setaddLinkStatus", {
                status: true,
                type: "relation"
            });
        },
        //取消添加关联油站
        cancelAdd() {
            this.isAddLink = false;
            this.$store
                .dispatch("setaddLinkStatus", {
                    status: false,
                    type: "relation"
                })
                .then(res => {
                    this.$message({
                        type: "success",
                        message: "取消添加成功!"
                    });
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "取消添加失败!"
                    });
                });
        },
        //删除关联油站
        deleteLinkStation() {
            //{layerId,feature,delFeatures}
            this.$store
                .dispatch("delLinkFeatures", {
                    layerId: this.selectFeatureLayer.id,
                    feature: this.selectFeature,
                    delFeatures: this.checkedRelateStations,
                    type: "relation"
                })
                .then(res => {
                    this.checkedRelateStations = [];
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: "删除失败" + err
                    });
                });
        }
    },
    watch: {
        yzLinkVisible(visible) {
            if (visible) {
                this.relationLoading = true;
                this.$store
                    .dispatch("initlinkFeatures", {
                        featureId: this.selectFeature.get("id"),
                        layerId: this.selectFeatureLayer.id,
                        type: "relation"
                    })
                    .then(res => {
                        this.relationLoading = false;
                        
                    });
            } else {
                this.$store
                    .dispatch("clearLinkFeatures", "relation")
                    .then(res => {});
                this.$store.dispatch("setaddLinkStatus", {
                    status: false,
                    type: "relation"
                });
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
    .check-group {
        height: 100px;
        overflow-y: auto;
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