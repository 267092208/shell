
<template>
  <div class="search">
    <el-input
      v-model.trim="keyword"
      :placeholder="selectSource.placeholder"
      class="search-input"
      size="small"
      :clearable="true"
      @clear="close"
      @keyup.enter.native="search"
      @keyup.esc.native="close"
      suffix-icon="el-icon-search"
    >
      <el-select
        v-model="selectSourceIndex"
        slot="prepend"
        style="width:100px"
        class="search-select"
      >
        <el-option
          v-for="(item,index) in searchSources"
          :key="index"
          :label="item.name"
          :value="index"
        ></el-option>
      </el-select>
    </el-input>
    <template v-if="!!resultAsyncIterator&&!searching">
      <div class="result">
        <div class="result-number">
          <el-row type="flex" align="middle">
            <el-col>结果总数: {{resultNumber}}</el-col>
          </el-row>
        </div>
        <ul class="result-ul" v-infinite-scroll="loadResultFeatures" style="overflow:auto">
          <li
            v-for="(item,index) in resultFeatures"
            @click="locationFeature(item)"
            :key="index"
            class="result-item"
          >
            <el-row type="flex" align="middle">
              <el-col :span="3">
                <i style="font-size:2em " class="el-icon-location-outline" />
              </el-col>
              <el-col :span="21">
                <el-row>
                  <div
                    v-for="(item,key) in searchSources[selectSourceIndex].format(item)"
                    :key="key"
                  >{{key+'：'+item}}</div>
                </el-row>
              </el-col>
            </el-row>
          </li>
          <p class="tishi" v-if="loading">加载中...</p>
          <p class="tishi" v-if="noMore">没有更多了</p>
        </ul>
      </div>
    </template>
    <template v-if="searching">
      <div v-loading="searching" element-loading-text="加载中" class="searching"></div>
    </template>
    <template v-if="emptyResult">
      <ul class="result" style="overflow:auto">
        <li class="result-item">
          <h6>没有匹配的结果</h6>
        </li>
      </ul>
    </template>
    <el-button-group class="ctr-btn-group" v-show="canExport">
      <el-button type size="small" @click="handleExportData">下载</el-button>
      <el-popover
                    placement="top"
                    width="200"
                    v-model="poiTypeSelectShow"
                >
                        <div class="pop-content">
                            <div>
                                <strong>选择要导入的poi类型:</strong>
                            </div>
                            <el-select
                                size="mini"
                                placeholder="请选择"
                                class="select"
                                v-model="poiTypeSelect"
                            >
                                <el-option
                                    v-for="item in poiTypeOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                ></el-option>
                            </el-select>
                             <div style="text-align: right; margin-top: 10px">
                            <el-button size="mini" type="text" @click="settingVisible = false">取消</el-button>
                            <el-button
                                :disabled="poiTypeSelect == ''"
                                :loading="importing"
                                type="primary"
                                size="mini"
                                @click="importInPoi"
                                icon="el-icon-upload"
                            >上传</el-button>
                        </div>
                    </div>
                    <el-button
                        size="small"
                        slot="reference"
                    >导入到poi</el-button>
                </el-popover>
    </el-button-group>
  </div>
</template>

<script>
import layerData from "@/data/layer";
import layerFields from "@/config/layer/fields";
import baiduSearch from "@/data/baiduSearch";
import { mapState } from "vuex";
import searchSources from "@/config/searchSources";
import gcoord from 'gcoord';
import { ImportFromBaiduSearch } from '@/data/layerExcelIO'
// 导出excel
import XLSX from "xlsx";
function exportExcel(fileName, fields, datas) {
  const header = fields.map(item => item.label),
    aoa = [header];
  if (datas && datas.length) {
    for (let _data of datas) {
      const row = [];
      for (let i = 0, len = fields.length; i < len; i++) {
        const propValue = _data[fields[i].prop] || null;
        row.push(propValue);
      }
      aoa.push(row);
    }
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa),
    wb = XLSX.utils.book_new();
  wb.SheetNames.push("sheet1");
  wb.Sheets["sheet1"] = ws;
  const wopts = {
    bookType: "biff8",
    bookSST: false,
    type: "array"
  };
  XLSX.writeFile(wb, `${fileName}`, wopts);
}

export default {
  data() {
    return {
      /** search 导入中 */
      importing: false,
      poiTypeSelect: '物流园',
      /**
       * poiType Options
       */
      poiTypeOptions: ['物流园', '工业园', '客运站', '港口', '高速口', '其他', '机场', '火车站'],
      /**
       * poiType选择器是否显示
       */
      poiTypeSelectShow: true,
      /**
       * 搜索数据源集合
       * @type {Array<{source:{type,layerids},name,placeholder}>}
       */
      searchSources,
      /**
       * 当前选中的数据源索引
       */
      selectSourceIndex: 0,
      /**
       * 关键字
       */
      keyword: "",
      emptyResult: false,
      /**
       * 搜索结果集(当前正在显示的)
       * @type {Array<Feature>}
       */
      resultFeatures: [],
      /**
       * 搜索结果的异步迭代器
       * @type {AsyncIterator<Feature>}
       */
      resultAsyncIterator: null,
      /**
       * 搜索结果采用的数据源
       */
      resultSource: null,
      /**
       * 是否在搜索中
       */
      searching: false,
      /**
       * 加载中...
       */
      loading: false,
      /**
       * 没有更多了
       */
      noMore: false,
      /**
       * 结果数量
       */
      resultNumber: null
    };
  },
  computed: {
    selectSource() {
      return this.searchSources[this.selectSourceIndex];
    },
    ...mapState({
      bounds: state => state.mapState.bounds
    }),
    canExport() {
      return (this.resultSource && this.resultSource.name === '百度搜索' && this.resultFeatures.length > 0)
    }
  },
  methods: {
    async search() {
      if (this.keyword) {
        this.resultAsyncIterator = null;
        this.resultFeatures = [];
        this.searching = true;
        this.emptyResult = false;
        if (this.selectSource.source.type == "layer") {
          await this.searchFromLayer();
        } else if (this.selectSource.source.type == "baidu") {
          await this.searchFromBaidu();
        }
        this.searching = false;
      } else {
        this.close();
      }
    },
    // 导出数据
    handleExportData() {
      console.log(this.searchSources, this.resultFeatures)
      let filename = `${this.keyword}关键字_POI搜索结果_${new Date().getTime()}`;

      exportExcel(
        `${filename}.xls`,
        [
          { label: 'title', prop: 'title' },
          { label: 'address', prop: 'address' },
          { label: 'city', prop: 'city' },
          { label: 'tags', prop: 'tags'},
          { label: 'lng', prop: 'lng' },
          { label: 'lat', prop: 'lat' }
        ],
        this.resultFeatures.map(item => {
          const lnglat = gcoord.transform(item.geometry.coordinates, gcoord.EPSG3857, gcoord.WGS84)
          return {
          ...item.properties,
          lng: lnglat[0],
          lat: lnglat[1]
        }})
      );
    },
    async importInPoi() {
      this.importing = true;
      const res = await ImportFromBaiduSearch(this.poiTypeSelect, this.resultFeatures.map(item => {
         const lnglat = gcoord.transform(item.geometry.coordinates, gcoord.EPSG3857, gcoord.WGS84)
          return {
          ...item.properties,
          lng: lnglat[0],
          lat: lnglat[1]
        }
      })).catch(err => {this.importing = false})
      if (typeof res === 'object' && 'success' in res) {
       let msg = `文件上传成功!${res.count}条数据导入，经过去重后，成功导入${res.success}条。`;
          // dangerouslyUseHTMLString: true,msg += (res.errorString == '') ? '' : `<div style="color: #F56C6C; max-height: 100px;width: 300px; overflow: scroll;">错误信息: <br/>${res.errorString.replace(/\n/g, '。<br/>')}</div>` 
          this.$message.success({ message: msg, offset: 60, showClose: true, duration: 0});
      } else {
        this.$message.error({message: `文件上传失败${res.Msg}!`})
      }
      this.importing = false;
    },
    async searchFromLayer() {
      /// TODO:图层关键字搜索，此处仅针对油站图层硬编码
      const selectSource = this.selectSource;
      const layerids = selectSource.source.layerids;
      const results = await Promise.all(
        layerids.map(id => {
          const querys = [
            {
              relation: "allbynamebh",
              value: this.keyword,
              field: "",
              type: ""
            }
          ];
          return layerData.get(id, querys);
        })
      );
      this.resultSource = selectSource;
      const fs = results.reduce(function(a, b) {
        return a.concat(b);
      });
      // 油站结果去重
      for (let i = fs.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          if (fs[i].id == fs[j].id) {
            fs.splice(i, 1);
            break;
          }
        }
      }
      this.resultNumber = fs.length;
      console.log(fs.length);
      let i = 0;
      this.resultAsyncIterator = {
        async next() {
          if (i >= fs.length) {
            return { done: true };
          } else {
            const value = fs[i++];
            return {
              done: false,
              value
            };
          }
        }
      };
    },
    async searchFromBaidu() {
      const selectSource = this.selectSource;
      const results = await baiduSearch(this.keyword, this.bounds);
      this.resultSource = selectSource;
      this.resultNumber = results.count;
      this.resultAsyncIterator = results[Symbol.asyncIterator]();
    },
    close() {
      this.keyword = "";
      this.emptyResult = false;
      this.resultAsyncIterator = null;
      this.resultFeatures = [];
      this.resultNumber = null;
    },
    /**
     * 加载搜索结果
     * 懒加载，一次最多加载的数量有限制
     */
    async loadResultFeatures() {
      this.loading = true;
      this.noMore = false;
      let c = await this.resultAsyncIterator.next();
      // 如果结果集为空，则显示空结果提示
      if (this.resultFeatures.length == 0 && c.done) {
        this.resultAsyncIterator = null;
        this.emptyResult = true;
      } else {
        // 加载最多20个结果
        let k = 0;
        while (!c.done && k < 20) {
          const f = c.value;
          f.getPopupHtml = this.resultSource.getPopupHtml;
          f.source = this.resultSource.source;
          this.resultFeatures.push(f);
          c = await this.resultAsyncIterator.next();
          k++;
        }
        if (c.done) {
          this.noMore = true;
          this.loading = false;
        }
      }
    },
    /**
     * 定位地图位置
     * TODO:
     */
    locationFeature(item) {
      // console.log(item, this.resultAsyncIterator)
      this.$store.dispatch("locationFeatures", item);
    }
  },
  watch: {
    selectSourceIndex(val) {
      this.resultFeatures = [];
      this.searching = false;
      this.loading = false;
      this.noMore = false;
      this.resultAsyncIterator = null;
      this.emptyResult = false;
      this.resultNumber = null;
      // console.log(val, this.searchSources)
    },
    /**
     *
     */
    resultFeatures(resultFeatures) {
      this.$store.dispatch("setSearchFeature", resultFeatures);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/public.scss";
.search {
  font-size: 13px;
  width: 350px;
  margin: 10px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  color: $shallow-font-color;
  .ctr-btn-group {
    position: absolute;
    width: 150px;
    right: -150px;
    top: 0;
  }
}
.searching {
  height: 100px;
  margin-top: 1px;
  width: 100%;
  box-sizing: border-box;
  border: $panel-border;
  box-shadow: $panel-shadow;
  background: $theme-bg-color;
}
.result {
  margin-top: 1px;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border: $panel-border;
  box-shadow: $panel-shadow;
  background: $theme-bg-color;
  .result-ul {
    max-height: 400px;
    &::-webkit-scrollbar {
      width: 3px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cccccc;
    }

    .result-item {
      line-height: 2em;
      border-bottom: $panel-border;
      :hover {
        background-color: $item-hover;
      }
    }
    li {
      cursor: pointer;
      i {
        color: $panel-color;
        font-size: 24px;
      }
      margin: 2px;
    }
    .tishi {
      text-align: center;
      font-size: 14px;
      color: $panel-color;
      line-height: 2em;
      margin: 2px;
    }
  }
  .result-number {
    background: $theme-bg-color;
    margin: 2px 5px;
    line-height: 2rem;
    border-bottom: $panel-border;
  }
}
</style>