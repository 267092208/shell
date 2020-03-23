<template>
    <div @contextmenu.prevent class="layer-panel">
        <el-tabs :tab-position="tabPosition" style="height: 100%;" type="card">
            <el-tab-pane
                class="tab-pane"
                v-loading="layerPanelLoading"
                v-for="(groupsItem,groupsIndex) in layerGroup"
                :key="groupsIndex"
            >
                <div slot="label" class="tab-title">{{groupsItem.name}}</div>
                <el-scrollbar style="height:100%; width:100%">
                    <div
                        @click="leftClick(item,index)"
                        v-for="(item,index) in groupsItem.layersIds"
                        :key="index"
                        @contextmenu.prevent="rightClick(item,index)"
                        :class="[{'show':visible[item]===true},isShow(showList,item)]"
                        class="tab-content"
                    >
                        <div class="layer-item">
                            <div class="loading" v-if="loadings.includes(index)">
                                <span class="el-icon-loading"></span>
                            </div>
                            <el-tag class="tag" title="左键切换显示或隐藏, 右键选中当前图层">{{layerListName[item]}}</el-tag>
                        </div>
                    </div>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { log } from "util";

export default {
    name: "layerpanel",
    data() {
        return {
            title: "图层面板（Alt+3）",
            tabPosition: "left",
            tabPosition: "right",
            layerGroup: [],
            showList: [],
            loadings: [],
            layerPanelLoading: false
        };
    },
    computed: {
        ...mapState({
            currentLayer: state => state.layer.currentLayer,
            visible: state => state.layer.visible,
            layerList: state => state.layer.base,
            groups: state => state.layer.groups,
            layerLoading: state => state.layer.layerLoading,
            selectFeature: state => state.selectFeature.selectFeature,
            selectFeatureLayer: state => state.selectFeature.selectFeatureLayer
        }),
        layerListName() {
            const names = {};
            this.layerList.forEach(t => {
                names[t.id] = t.name;
            });
            return names;
        }
    },

    mounted() {
        // this.initLayerPanel();
        // this.initLayerGroup();
    },
    activated(){
        this.$store.dispatch("setLayerListVisible",true)
        
    },
    deactivated(){
            this.$store.dispatch("setLayerListVisible",false)

    },

    methods: {
        init() {
            this.initLayerPanel();
            this.initLayerGroup();
            this.$parent.title = this.title;
            this.$parent.autoClose = true;
            this.$store.dispatch("setLayerListVisible",true)
            this.$parent.afterClose = function() {
                if (this.selectFeature) {
                    const layer = this.selectFeatureLayer;

                    if (
                        layer.id === "shellyz" ||
                        layer.id === "gsyz" ||
                        layer.id === "xyyz"
                    ) {
                        this.$store.dispatch("replace", { path: "infoPanel" });
                    } else if (layer.id === "ma") {
                        this.$store.dispatch("replace", { path: "MAinfo" });
                    } else {
                        this.$store.dispatch("replace", {
                            path: "commPropertyPanel"
                        });
                    }
                }
            this.$store.dispatch("setLayerListVisible",false)
            

            }.bind(this);
        },
        //通过分组数据的id获取名字
        getName(id) {
            if (this.layerList.length) {
                var t = this.layerList.find(item => {
                    return item.id == id;
                });
                return t.name;
            }
        },

        /* 左键点击油站图层名字，切换图层显示与隐藏*/
        leftClick(item, index) {
            // this.loading = index;
            this.loadings.push(index);
            // this.loadings[index] = true;

            if (!this.visible[item]) {
                this.$store
                    .dispatch("setLayerVisible", {
                        layerid: item,
                        visible: true
                    })
                    .then(() => {
                        this.loadings.splice(this.loadings.indexOf(index), 1);

                        if (this.showList.indexOf(item) === -1) {
                            this.showList.push(item);
                        }
                    });
            } else {
                this.$store
                    .dispatch("setLayerVisible", {
                        layerid: item,
                        visible: false
                    })
                    .then(() => {
                        this.loadings.splice(this.loadings.indexOf(index), 1);

                        if (this.showList.indexOf(item) > -1) {
                            let index = this.showList.indexOf(item);
                            this.showList.splice(index, 1);
                        }
                    });
            }

            if (this.currentLayer && this.currentLayer.id == item) {
                this.$store.dispatch("setCurrentLayer", { layer: null });
                return;
            }
        },

        /* 右键点击油站图层名字，设为当前选中图层 */
        rightClick(item, index) {
            if (!this.currentLayer || this.currentLayer.id != item) {
                this.loadings.push(index);

                let currentObj = {};
                this.layerList.forEach(listItem => {
                    if (listItem.id === item) {
                        currentObj = listItem;
                    }
                });

                this.$store.dispatch("setCurrentLayer", {
                    layer: currentObj
                });

                this.$store
                    .dispatch("setLayerVisible", {
                        layerid: item,
                        visible: true
                    })
                    .then(() => {
                        this.loadings.splice(this.loadings.indexOf(index), 1);

                        if (this.showList.indexOf(item) === -1) {
                            this.showList.push(item);
                        }
                    });
            }
        },

        initLayerPanel() {
            this.layerPanelLoading = true;

            for (let i in this.visible) {
                if (this.visible[i]) {
                    this.showList.push(i);
                }
            }
            this.layerPanelLoading = false;
        },

        initLayerGroup() {
            this.layerGroup = [];

            this.groups.forEach(item => {
                this.layerGroup.push(item);
            });

            this.layerGroup[0].layersIds = [];

            this.layerGroup.forEach(item => {
                this.layerGroup[0].layersIds.push(...item.layersIds);
            });
        },

        /*  给油站图层列表动态增加样式*/
        isShow(arr, id) {
            // if (arr.includes(id)) {
            //   return "show";
            // }

            if (this.currentLayer && this.currentLayer.id == id) {
                return "active";
            }
        }
    }
};
</script>

<style lang="scss" >
@import "@/assets/css/public.scss";

.layer-panel {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #fff;

    .el-tabs--right.el-tabs--card {
        .el-tabs__nav-scroll {
            border-left: 1px solid $infopanel-detail-bdcolor;
            overflow: auto;
        }

        .el-tabs__nav {
            background-color: $rightpanel-nav-bgcolor;
            border: none;
            height: 100%;
            border-top: $panel-border;

            .el-tabs__item {
                height: auto;
                padding: 5px;
                transition: none;
                color: $shallow-font-color;
                background: $rightpanel-nav-unactive-bgcolor;
                border-color: $rightpanel-nav-bdcolor;
                border-top: $panel-border;

                &.is-right.is-active {
                    background-color: $rightpanel-nav-active-bgcolor;
                    color: $deep-font-color;
                    border: none;

                    &:hover {
                        background-color: $rightpanel-nav-active-bgcolor;
                        color: $deep-font-color;
                        border: none;
                    }
                }

                &.is-right:hover {
                    background-color: $rightpanel-nav-hover-bgcolor;
                    color: $shallow-font-color;
                }
            }
        }
    }
    .el-scrollbar {
        padding: 0 20px;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }

        .el-scrollbar__bar.is-vertical {
            right: 20px;
        }
    }

    .el-tabs__content {
        height: 100%;
        // padding: 0 20px;
    }
    .tab-pane {
        margin: 0 25px;
        height: 100%;
    }
    .tab-title {
        width: 10px;
        white-space: normal;
        font-size: 14px;
        line-height: 1.5em;
        text-align: center;
        word-wrap: break-word;
        padding: 5px 7px 5px 3px;
        // writing-mode: vertical-rl;
    }

    .tab-content {
        margin: 20px 5px;
        width: 200px;

        .layer-item {
            position: relative;

            .loading {
                background: rgba(255, 255, 255, 0.7);
                background-size: 100%;
                margin: auto;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                text-align: center;
                line-height: 34px;
                border: 2px solid $theme-color;

                span {
                    line-height: 50px;
                }
            }
        }

        .tag {
            height: 50px;
            line-height: 50px;
            width: 100%;
            text-align: center;
            font-size: 14px;
            user-select: none;
            border: 2px solid rgb(234, 244, 254);
            border-radius: 0;

            &:hover {
                cursor: pointer;
                border: 2px solid $layerpanel-hover;
            }
        }
    }

    .show {
        .tag {
            background-color: $layerpanel-show;
            color: $deep-font-color;
            border: 2px solid $layerpanel-show !important;

            &:hover {
                // border: 2px solid $layerpanel-show;
            }
        }
    }

    .active {
        .tag {
            background-color: $layerpanel-active !important;
            color: $deep-font-color;
            border-radius: 0;
            border: 2px solid $layerpanel-active !important;

            &:hover {
                // border: 2px solid $layerpanel-active !important;
            }
        }
    }
}
</style>