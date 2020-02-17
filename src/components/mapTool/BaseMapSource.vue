
<template>
  <div>
    <!-- 控制按钮 -->
    <el-button
      size="mini"
      class="base-layer-button"
      @click="dialogVisible=!dialogVisible"
      :style="{top,left,bottom,right}"
    >
      <div class="iconfont icon-ditu"></div>
      <div>底图</div>
    </el-button>
    <!-- 选择框 -->
    <el-dialog
      center
      title="地图选择"
      :visible.sync="dialogVisible"
      width="550px"
      :close-on-click-modal="false"
      custom-class="dialog"
      :append-to-body="true"
    >
      <!-- mapList -->
      <div class="container">
        <el-scrollbar class="page-scrollbar">
          <div class="map-list">
            <ul class="list clearfix">
              <li
                v-for="item in baseMapSourceList"
                :key="item.name"
                :class="currentBaseMapSource.sourceKey===item.sourceKey?'active':''"
                @click.stop="changeBaseLayer(item)"
              >
                <div class="img">
                  <img :src="item.src" />
                </div>
                <p class="name">{{item.name}}</p>
              </li>
            </ul>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 
 * 切换工具
 */
export default {
  props: {
    top: {
      type: String,
      default: "auto"
    }, left: {
      type: String,
      default: "auto"
    }, bottom: {
      type: String,
      default: "auto"
    },
    right: {
      type: String,
      default: "auto"
    },
    /**
     * 切片栅格图层等前选中的数据源
     * @type {{
     * name:string,
     * sourceKey:string,
     * src:string,
     * type:'baseMapRasterSource'|'baseMapGeojsonSource'
     * }
     *}
     */
    currentBaseMapSource: {
      type: Object,
      default: {
        name: "",
        sourceKey: "",
        src: "",
        type: ''
      }
    },
    /**
     * @type {Array<{
     * name:string,
     * sourceKey:string,
     * src:string,
     * layerType:'baseMapRasterLayer'|'baseMapGeojsonLayer'
     * }>}
     */
    baseMapSourceList: Array
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    changeBaseLayer(value) {
      this.$emit("setCurrentBaseMapSource", value)
    }
  },
  created() {
    // console.log(this.currentBaseMapSource)
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/css/public.scss";
ul {
  padding: 0;
}
li {
  list-style: none;
}
.base-layer-button {
  position: absolute;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 5px 7px;
}
.container {
  height: 355px;
  text-align: center;

  .page-scrollbar {
    height: 100%;
  }
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .map-list {
    width: 100%;
    height: 100%;
  }
  .list {
    li {
      float: left;
      width: 110px;
      margin-left: 20px;
      margin-top: 10px;
      .img {
        width: 80px;
        height: 76px;
        overflow: hidden;
        border: 2px solid transparent;
        background: #ddd;
        margin: 0 auto;
        img {
          width: 100%;
          height: auto;
        }
      }
      .name {
        margin: 5px 0 10px 0;
        font-size: 12px;
      }
      &:hover,
      &.active {
        cursor: pointer;
        .img {
          border-color: $theme-color;
        }
        .name {
          color: $theme-color;
        }
      }
      &.disabled {
        cursor: not-allowed;
        .img {
          border-color: #f1f1f1;
        }
        .name {
          color: #9e9e9e;
        }
      }
      &:nth-child(4n + 1) {
        margin-left: 0;
      }
    }
  }
}
/deep/ .el-dialog--center /deep/.el-dialog__body {
  padding: 10px;
  padding-left: 21px;
  // padding-top: 0;
  // padding-bottom: 10px;
}
</style>