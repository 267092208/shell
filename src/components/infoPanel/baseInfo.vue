<template>
  <div class="base-wrap">
    <div class="base-info">
      <!-- <el-scrollbar > -->
      <div class="base-left">
        <div class="left-item">
          <base-info-item v-if="infoTitle[0].show">
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
        </div>
        <div class="left-item">
          <base-info-item v-if="infoTitle[1].show">
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
              <el-button-group v-if="selectFeature && selectFeature.properties['品牌']==='YC Shell'">
                <el-button
                  title="点击查看历史车流信息"
                  type="primary"
                  size="mini"
                  @click.native="carflowInfoVisible = true"
                >历史车流</el-button>
              </el-button-group>
            </div>
          </base-info-item>
        </div>
        <div class="left-item">
          <base-info-item v-if="infoTitle[2].show">
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
                  @click="addStation"
                ></el-button>
                <el-button title="取消添加" type="primary" icon="el-icon-close" size="mini" disabled></el-button>

                <el-button title="删除关联油站" type="primary" icon="el-icon-delete" size="mini" disabled></el-button>
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
        <div class="left-item">
          <base-info-item v-if="infoTitle[3].show">
            <div slot="header" class="header-content">竞争油站</div>
            <div slot="content">
              <div v-if="compStationList.length === 0">暂无数据</div>
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
                    v-for="station in compStationList"
                    :label="station"
                    :key="station"
                  >{{station}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div slot="footer">
              <el-button-group>
                <el-button
                  title="点击添加后在地图上点选竞争油站"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  disabled
                ></el-button>
                <el-button title="取消添加" type="primary" icon="el-icon-close" size="mini" disabled></el-button>
                <el-button title="删除竞争油站" type="primary" icon="el-icon-delete" size="mini" disabled></el-button>
                <el-button
                  title="填写油站编号添加"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click.native="addInfo"
                  disabled
                ></el-button>
              </el-button-group>
            </div>
          </base-info-item>
        </div>
        <div class="left-item">
          <base-info-item v-if="infoTitle[4].show">
            <div slot="header" class="header-content">附近POI</div>

            <div slot="content">
              <div v-if="POIData.length ==0">暂无数据</div>
              <div class="poi-item" v-for="(item,index) in POIData" :key="index" v-else>
                <div class="intro">
                  名称:
                  <span>{{item.名称}}</span>
                </div>
                <div class="intro">
                  类型:
                  <span>{{item.类型}}</span>
                </div>
              </div>
            </div>
          </base-info-item>
        </div>
        <div class="left-item">
          <base-info-item v-if="infoTitle[5].show">
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
      </div>
      <!-- </el-scrollbar> -->

      <div class="base-right">
        <el-button-group class="title">
          <el-button
            type="primary"
            v-for="(item,index) in infoTitle"
            :key="index"
            plain
            :class="isActive(showList,index)"
            class="title-item"
            @click="titleClick(index,item)"
          >{{item.name}}</el-button>
        </el-button-group>
      </div>
    </div>
    <upload-photo :dialogVisible.sync="uploadPhotoVisible"></upload-photo>
    <history-photo :dialogVisible.sync="historyPhotoVisible" :history-imgs="historyImgs"></history-photo>
    <carflow-info :dialogVisible.sync="carflowInfoVisible"></carflow-info>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPhotoHis, deletePhoto } from "@/data/photo";

const baseInfoItem = () => import("@/components/infoPanel/baseInfoItem");
const uploadPhoto = () => import("@/components/infoPanel/content/uploadPhoto");
const historyPhoto = () =>
  import("@/components/infoPanel/content/historyPhoto");
const carflowInfo = () => import("@/components/infoPanel/content/carflowInfo");
const ImageViewer = () => import("@/components/infoPanel/content/ImageViewer");

export default {
  name: "baseInfo",
  props: {
    infoIntro: {
      type: Object,
      default() {
        return {};
      }
    },
    stationImgList: {
      type: Array,
      default() {
        return [];
      }
    },
    POIData: {
      type: Array,
      default() {
        return [];
      }
    },
    photoLoading: Boolean,
    childDeletePhoto: Function,
    selectList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      infoTitle: [
        { name: "照片", show: true },
        { name: "简介", show: true },
        { name: "关联", show: false },
        { name: "竞争", show: false },
        { name: "园区", show: false },
        { name: "周边", show: false }
      ],
      noImgURL: "require('@/assets/images/noimages.jpg')",
      showList: [0, 1],
      // selectList: [],
      isDelImg: true,
      historyImgs: {},
      isViewerOpen: false,
      currentIndex: -1,
      srcList: [],
      relateStationList: [],
      compStationList: [],
      checkedRelateStations: [],
      checkAll: false,
      isIndeterminate: true,
      uploadPhotoVisible: false,
      carflowInfoVisible: false,
      historyPhotoVisible: false,
      photoDelTitle: "删除照片",
      photoDelMessage: "确定要删除所选照片吗？"
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
    carflowInfo,
    ImageViewer
  },
  activated() {
    // window.scrollTo(0, window.sessionStorage.getItem("baseScrollTop"));
    // window.addEventListener("scroll", this.onBaseScroll, true);
    // console.log(
    //   "baseScrollTop+++++++" + window.sessionStorage.getItem("baseScrollTop")
    // );
  },

  deactivated() {
    // let baseScroll = document.querySelector(".info-panel").scrollTop;
    // window.sessionStorage.setItem("baseScrollTop", baseScroll);

    // window.removeEventListener("scroll", this.onBaseScroll);
    // console.log(
    //   "baseScrollTop取消选中基本信息+++++++" + window.sessionStorage.getItem("baseScrollTop")
    // );
  },
  mounted() {
    // this.selectList  = []
    // this.baseScroll = document.querySelector(".base-info .base-left").scrollTop;
  },
  methods: {
    onBaseScroll() {
      const content = document.querySelector(".info-panel");

       window.sessionStorage.setItem("baseScrollTop",content.scrollTop)

    },

    // 基本信息面板标题点击事件
    titleClick(index, item) {
      if (this.showList.includes(index)) {
        let i = this.showList.indexOf(index);
        this.showList.splice(i, 1);
        item.show = false;
      } else {
        this.showList.push(index);
        item.show = true;
      }
    },
    //图片点击
    imgClick(item) {
      if (!this.selectList.includes(item)) {
        // this.selectList.push(item);
        this.$emit("setSelectList", "add", item);
      } else {
        let i = this.selectList.indexOf(item);
        // this.selectList.splice(i, 1);
        this.$emit("setSelectList", "reduce", item);
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
      getPhotoHis(this.selectFeature, this.selectFeatureLayer.id).then(res => {
        delete res.NaN;
        this.historyImgs = res;
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

    //全选
    handleCheckAllChange(val) {
      this.checkedRelateStations = val ? this.relateStationList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.relateStationList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.relateStationList.length;
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
    selectList: function() {
      if (this.selectList.length != 0) {
        this.isDelImg = false;
      } else {
        this.isDelImg = true;
      }
    },

    photoStatus: function() {
      getPhotoHis(this.selectFeature, this.selectFeatureLayer.id).then(res => {
        delete res.NaN;
        this.historyImgs = res;
      });
    },

    isViewerOpen: function(val) {
      val === false ? this.$emit("autoClose", true) : "";
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/public.scss";

.base-info {
  background-color: $rightpanel-bgcolor;
  $nav-width: 30px;

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
    border-left: 1px solid #acd3fa;
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
</style>