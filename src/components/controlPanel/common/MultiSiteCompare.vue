<template>
  <div>
    <el-dialog
      title="多站对比"
      :visible="dialogVisible"
      width="800px"
      :before-close="handleClose"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="dialog"
      @open="openDiaglog"
    >
      <el-table
        :data="tableData"
        style="width: 100%"
        height="364"
        :stripe="true"
        :header-row-style="{background: 'rgb(247,247, 247)'}"
        :header-cell-style="{background: 'rgb(247,247, 247)'}"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          v-for="(item,index) in fields"
          :key="index"
          :prop="item.prop"
          :fixed="item.fixed"
          :label="item.label"
          :width="item.width"
          min-width="70"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="70" align="center">
          <template slot-scope="scope">
            <el-tooltip
              :disabled="!disabledImgList[scope.row['油站编号']]"
              content="无图片数据"
              placement="top"
            >
              <el-button
                v-loading="loadingList[scope.$index]"
                :class="{'icon-btn-disabled': disabledImgList[scope.row['油站编号']]}"
                @click="lookPick(scope.row)"
                type="text"
                size="mini"
              >查看图片</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <ImageViewer
        :isViewerOpen.sync="isViewerOpen"
        :currentIndex.sync="currentIndex"
        :imageList="srcList"
      ></ImageViewer>
    </el-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";
import { getPhotos } from "@/data/photo";
import ImageViewer from "@/components/infoPanel/content/ImageViewer";

export default {
  props: ["dialogVisible", "mscData"],
  computed: {
    ...mapState({
      selectFeatureLayer: state => state.selectFeature.selectFeatureLayer
    }),
    tableData() {
      let table = Array.from(
        { length: this.mscData.length },
        () => new Array()
      );
      for (let x = 0; x < this.mscData.length; x++) {
        for (let value of this.fields) {
          const prop = value.prop;
          switch (prop) {
            case "Y0销量":
              table[x]["Y0销量"] =
                Number.parseInt(
                  this.mscData[x].properties["ShellY0日销量_汽油"]
                ) +
                  Number.parseInt(
                    this.mscData[x].properties["ShellY0日销量_柴油"]
                  ) || 0;
              break;
            case "Y4销量":
              table[x]["Y4销量"] =
                Number.parseInt(
                  this.mscData[x].properties["ShellY4日销量_汽油"]
                ) +
                  Number.parseInt(
                    this.mscData[x].properties["ShellY4日销量_柴油"]
                  ) || 0;
              break;
            case "车流量":
              table[x]["车流量"] =
                this.mscData[x].properties["车流量"] == "null"
                  ? 0
                  : this.mscData[x].properties["车流量"];
              break;
            default:
              table[x][prop] = this.mscData[x].properties[prop];
              break;
          }
        }
      }
      return table;
    },
    comDisabledBtn(num) {
      let imgs = this.photos[num] || [];
      return imgs.length === 0;
    }
  },
  components: {
    ImageViewer
  },
  data() {
    return {
      fields: [
        {
          label: "油站名称",
          width: "100",
          prop: "站名"
          // prop: "siteName"
        },
        {
          label: "油站编号",
          width: "100",
          prop: "油站编号"
          // fixed: 'left'
          // prop: "siteNo"
        },
        {
          label: "网络类型",
          width: "80",
          prop: "网络类型1"
          // prop: "type"
        },
        {
          label: "车流量",
          // width: "80",
          prop: "车流量"
          // prop: "name"
        },
        {
          label: "Y0销量",
          // width: "80",
          prop: "Y0销量"
          // prop: "name"
        },
        {
          label: "Y4销量",
          // width: "80",
          prop: "Y4销量"
          // prop: "name"
        },
        {
          label: "地址",
          // 'min-width': 80,
          prop: "路名",
          width: "170"
          // prop: "address"
        }
      ],
      photos: {},
      isViewerOpen: false,
      currentIndex: 0,
      srcList: [],
      disabledImgList: {},
      loadingList: [true, true],
      loading: false
    };
  },
  methods: {
    handleClose(done) {
      this.updateVisible(false);
    },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },
    lookPick(row) {
      // console.log(row)
      if (this.disabledImgList[row["油站编号"]] === false) {
        this.isViewerOpen = true;
        this.srcList = this.photos[row["油站编号"]] || [];
      }
    },
    async openDiaglog() {
      this.loading = true;
      if (this.selectFeatureLayer != null && this.mscData.length > 0) {
        this.loadingList = Array.from(
          new Array(this.mscData.length),
          item => true
        );
        for (let x = 0; x < this.mscData.length; x++) {
          this.$set(this.loadingList, x, true);
          const yzNum = this.mscData[x]["properties"]["油站编号"];
          await getPhotos(this.mscData[x], this.selectFeatureLayer.id)
            .then(res => {
              // console.log(res);
              this.$set(this.photos, yzNum, res);
              this.$set(this.disabledImgList, yzNum, res.length === 0);
              this.$set(this.loadingList, x, false);
            })
            .catch(err => {
              this.$set(this.loadingList, x, false);
            });
        }
      }
      this.loading = false;
    }
  },
  mounted() {
    this.openDiaglog();
  }
};
</script>

<style lang="scss" scoped>
.icon-btn-disabled {
  color: #999 !important;
  &:hover {
    cursor: not-allowed;
  }
}
/deep/ .el-dialog__body {
  padding: 10px;
}
</style>