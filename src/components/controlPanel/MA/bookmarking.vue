<template>
    <el-dialog
        title="网址收藏"
        :before-close="handleClose"
        :visible="dialogVisible"
        width="800px"
        center
        custom-class="dialog"
        :close-on-click-modal="false"
        :append-to-body="true"
        @open="openDiaglog"
        v-dialogDrag
    >
        <el-container class="container">
            <el-aside width="300px" class="aside">
                <!-- <div class="import_content"> -->
                <!-- <h4 style class="aside-header">保存新网址</h4> -->
                <el-form ref="form" :model="form" label-width="60px" size="mini" class="form">
                    <el-form-item label="名称:" prop="Name">
                        <el-input v-model="form.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="网址:" prop="Url">
                        <el-input v-model="form.Url"></el-input>
                    </el-form-item>
                    <el-form-item label="内容:" prop="Remark">
                        <el-input v-model="form.Remark"></el-input>
                    </el-form-item>
                    <el-form-item label>
                        <el-button
                            size="mini"
                            icon="el-icon-refresh-right"
                            @click="resetForm('form')"
                        >重 置</el-button>
                        <el-button
                            size="mini"
                            :loading="saving"
                            icon="el-icon-circle-plus"
                            type="primary"
                            @click="saveUrl()"
                        >保 存</el-button>
                        <!-- <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleClose(false)">删 除</el-button> -->
                    </el-form-item>
                </el-form>
            </el-aside>
            <el-main class="main" v-loading="loading">
                <transition-group name="el-zoom-in-top">
                    <el-card
                        class="box-card"
                        ref="card"
                        shadow="hover"
                        v-for="(item, index) in urlList"
                        :key="index"
                    >
                        <div slot="header" class="clearfix header">
                            <span class="text">标题:&nbsp;&nbsp;{{item.Title}}</span>
                            <el-button
                                style="float: right; padding: 1px 0"
                                type="text"
                                @click="delUrlInfo(item.ID, index)"
                            >删除</el-button>
                        </div>
                        <div class="item-span mark">名称:&nbsp;&nbsp;{{item.Name}}</div>
                        <div class="item-span mark">创建时间:&nbsp;&nbsp;{{item.CreateDateTime}}</div>
                        <div class="item-span">网址:&nbsp;&nbsp;{{item.Url}}</div>
                        <div class="item-span">备注:&nbsp;&nbsp;{{item.Remark}}</div>
                    </el-card>
                </transition-group>
            </el-main>
        </el-container>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { getUrlList, saveUrlInfo, delUrlInfo } from "@/data/ma";

export default {
    props: ["dialogVisible"],
    computed: {
        ...mapState({
            selectFeatures: state => state.selectFeature.selectFeatures
        })
    },
    data() {
        return {
            form: {
                Name: "",
                Url: "",
                Remark: ""
            },
            urlList: [],
            loading: false,
            saving: false
        };
    },
    methods: {
        handleClose() {
            this.resetForm("form");
            this.updateVisible(false);
        },
        updateVisible(b) {
            this.$emit("update:dialogVisible", b);
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async saveUrl() {
            this.saving = true;
            const result = await saveUrlInfo({
                MaID: this.selectFeatures[0].get("id"),
                Name: this.form.Name,
                Url: this.form.Url,
                Remark: this.form.Remark
            }).catch(err => {
                this.$message.error({
                    message: err,
                    offset: 60
                });
            });
            this.saving = false;
            if (result && "newid" in result) {
                this.loadingUrlList();
            }
        },
        async delUrlInfo(urlId, index) {
            this.loading = true;
            const res = await delUrlInfo(urlId).catch(err => {
                this.$message.error({
                    message: err,
                    offset: 60
                });
            });
            await this.loadingUrlList();
        },
        async loadingUrlList() {
            this.loading = true;
            if (this.selectFeatures != null) {
                this.urlList = await getUrlList(
                    this.selectFeatures[0].get("id")
                ).catch(err => {
                    this.$message.error({
                        message: err,
                        offset: 60
                    });
                });
            }
            this.loading = false;
        },
        async openDiaglog() {
            this.loadingUrlList();
        }
    }
};
</script>

<style lang='scss' scoped>
::-webkit-scrollbar {
    // background-color: ;
    width: 7px;
    &:hover {
        cursor: pointer;
    }
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    width: 2px;
    background-color: rgba(144, 147, 153, 0.3);
    &:hover {
        cursor: pointer;
        background-color: rgba(144, 147, 153, 0.5);
    }
}
.import_content {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.container {
    .aside {
        border-right: 1px solid #dcdfe6;
        .aside-header {
            margin: 0 auto;
            text-align: center;
            color: #fff;
            background-color: #3c8dbc;
            padding: 3px 0px;
        }
        .form {
            padding: 10px 20px;
            margin-top: 3px;
            /deep/.el-form-item {
                margin-bottom: 25px;
            }
        }
    }
    .main {
        max-height: 380px;
        overflow: hidden;
        overflow-y: auto;
        flex-wrap: wrap;
        .box-card {
            box-sizing: border-box;
            margin-bottom: 5px;
            /deep/.el-card__header {
                padding: 13px 20px;

                .header {
                    display: block;

                    .text {
                        min-width: 150px;
                        width: calc(100% - 40px);
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        display: inline-block;
                    }
                }
            }
            .item-span {
                width: 100%;
                display: block;
                color: inherit;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: 12px;
                font-weight: normal;
                color: #999;
                line-height: 1.2rem;
            }
            .mark {
                color: #0067cb;
            }
        }
    }
}
.container /deep/.el-main {
    padding: 10px 20px;
}
</style>