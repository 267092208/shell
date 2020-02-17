
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
  </div>
</template>

<script>

import layerData from '@/data/layer';
import layerFields from '@/config/layer/fields';
import baiduSearch from '@/data/baiduSearch';
import { mapState } from 'vuex';

const searchSources = [
  {
    source: {
      type: 'layer',
      layerids: ['xyyz', 'gsyz', 'shellyz']
    },
    name: '油站搜索',
    placeholder: '油站编号或站名(Esc清除结果)',
    format: feature => {
      return {
        "编号": feature.properties['油站编号'],
        "站名": feature.properties['站名']
      };
    },
    getPopupHtml: feature => {
      return `
        <div>
            <b style="color:#cc5522;">${feature.properties['油站编号']} ${feature.properties['站名']}</b>
        </div>`;
    }
  },
  {
    source: {
      type: 'baidu'
    },
    name: '百度搜索',
    placeholder: '视野内搜索(Esc清除结果)',
    format: feature => {
      return {
        "名称": feature.properties.title,
        "地址": feature.properties.address
      };
    },
    getPopupHtml: feature => {
      return `
        <div>
            <div>
                <span style="width:185px;color:#cc5522;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;display: inline-block;">
                    ${feature.properties.title} 
                </span>
                <a target="_blank" href="${feature.properties.url}" style="margin-left:5px;font-size:12px;color:#3d6dcc;font-weight:normal;text-decoration:none;position: relative;top: -7px;">详情</a>
            </div>
            <div><b>地址:</b>${feature.properties.address || ''}</div>
            <div><b>电话:</b>${feature.properties.phoneNumber || ''}</div>
        </div>`;
    }
  },
];

export default {
  data () {
    return {
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
      keyword: '',
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
    selectSource () {
      return this.searchSources[this.selectSourceIndex];
    },
    ...mapState({
      bounds: state => state.mapState.bounds,
    })
  },
  methods: {
    async search () {
      if (this.keyword) {
        this.resultAsyncIterator = null;
        this.resultFeatures = []
        this.searching = true;
        this.emptyResult = false;
        if (this.selectSource.source.type == 'layer') {
          await this.searchFromLayer();
        }
        else if (this.selectSource.source.type == 'baidu') {
          await this.searchFromBaidu();
        }
        this.searching = false;
      }
      else {
        this.close();
      }
    },
    async searchFromLayer () {
      /// TODO:图层关键字搜索，此处仅针对油站图层硬编码
      const selectSource = this.selectSource;
      const layerids = selectSource.source.layerids;
      const results = await Promise.all(layerids.map(id => {
        const querys = [{ "relation": "allbynamebh", "value": this.keyword, "field": "", "type": "" }];
        return layerData.get(id, querys);
      }));
      this.resultSource = selectSource;
      const fs = results.reduce(function (a, b) { return a.concat(b) });
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
        async next () {
          if (i >= fs.length) {
            return { done: true };
          }
          else {
            const value = fs[i++];
            return {
              done: false,
              value
            };
          }
        }
      }
    },
    async searchFromBaidu () {
      const selectSource = this.selectSource;
      console.log(this.bounds);
      const results = await baiduSearch(this.keyword, [this.bounds.minx, this.bounds.miny, this.bounds.maxx, this.bounds.maxy]);
      this.resultSource = selectSource;
      this.resultNumber = results.count
      this.resultAsyncIterator = results[Symbol.asyncIterator]();
    },
    close () {
      this.keyword = '';
      this.emptyResult = false;
      this.resultAsyncIterator = null;
      this.resultFeatures = []
      this.resultNumber = null
    },
    /**
     * 加载搜索结果
     * 懒加载，一次最多加载的数量有限制
     */
    async loadResultFeatures () {
      this.loading = true
      this.noMore = false
      let c = await this.resultAsyncIterator.next();
      // 如果结果集为空，则显示空结果提示
      if (this.resultFeatures.length == 0 && c.done) {
        this.resultAsyncIterator = null;
        this.emptyResult = true;
      }
      else {
        // 加载最多20个结果
        let k = 0;
        while (!c.done && k < 20) {
          const f = c.value;
          f.getPopupHtml = this.resultSource.getPopupHtml;
          this.resultFeatures.push(f);
          c = await this.resultAsyncIterator.next();
          k++;
        }
        if (c.done) {
          this.noMore = true;
          this.loading = false
        }
      }
    },
    /**
     * 定位地图位置
     * TODO:
     */
    locationFeature (item) {
      // console.log(item, this.resultAsyncIterator)
      this.$store.dispatch("locationFeatures", item);
    }
  },
  watch: {
    selectSourceIndex (val) {
      this.resultFeatures = [];
      this.searching = false;
      this.loading = false;
      this.noMore = false;
      this.resultAsyncIterator = null;
      this.emptyResult = false;
      this.resultNumber = null
      // console.log(val, this.searchSources)
    },
    /**
     * 
     */
    resultFeatures (resultFeatures) {
      this.$store.dispatch("setSearchFeature", resultFeatures);
    },
  },


}
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