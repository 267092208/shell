<template>
  <div class="global-filter">
    <el-card
      class="box-card"
      shadow="never"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="数据加载中,请稍等"
      style="width: 100%"
    >
      <div slot="header" class="clearfix">
        <span>通用筛选</span>
      </div>
      <el-scrollbar class="city-list" style="height:100%">
        <el-tree
          ref="tree"
          :data="objList"
          show-checkbox
          node-key="key"
          :highlight-current="false"
          @check="getGlobalInfo"
          :default-expanded-keys="['province_33']"
        ></el-tree>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import { getCityAndMATreeObj } from "@/data/division.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: true,
      list: [],
      globalInfo: "",
      key: "value.",
      globalList: [],
      globalFiltersKeys: []
    };
  },
  created() {
    //获取通用筛选数据
    getCityAndMATreeObj().then(res => {
      this.list = res;
      this.loading = false;
      this.globalData = res;
      let areaCity = [];
      console.log(res);
      if (this.getGlobalFilters.length != 0) {
        let data = this.getGlobalFilters[0].value.split(";");
        data = data.join(",");
        data = data.split(",");
        console.log(data);
        const i = this.list.filter(t => {
          if (data.includes(t.value.provinceid + "") ||
            data.includes(t.value.allqxForCityId + "") ||
            data.includes(t.value.qxId + "") ||
            data.includes(t.value.maId + "")) {
            return true
          } else {
            return false
          }
        })
        console.log(i);
        i.forEach(item => {
          this.globalList.push(item.key);
        })
      } else {
        console.log("wwww")
      }
    });
    //选中数据
    // this.getGlobalFilters
  },
  mounted() {
    this.$refs.tree.setCheckedKeys(this.globalList);
  },
  computed: {
    objList() {
      console.time("444")
      let newCityList = JSON.parse(
        JSON.stringify(this.list).replace(/text/g, "label")
      );
      //反转数据方便后面的遍历
      newCityList.reverse();
      //克隆数据方便做数据对比
      let newObj = JSON.parse(JSON.stringify(newCityList));
      newCityList.forEach(function (val, index) {
        for (var i = 0; i < newObj.length; i++) {
          val.id = val.key.split("_")[1];
          if (val.parentid == newObj[i].key) {
            if (newCityList[i].children) {
              newCityList[i].children.unshift(val);
            } else {
              let children = [];
              children.unshift(val);
              newCityList[i].children = children;
            }
            delete newCityList[index];
            break;
          }
        }
      });
      //去除delete后的无效数组数据
      let okObj = [];
      for (let i = 0; i < newCityList.length; i++) {
        if (newCityList[i]) {

          okObj.push(newCityList[i]);
          okObj.reverse();
        }
      }
      console.timeEnd("444")

      return okObj;
    },
    ...mapState({
      getGlobalFilters: state => state.layer.globalFilters
    }),
    // TODO  没有数据key做默认渲染
    // treeDefault(){
    //   
    // }
  },
  methods: {
    getGlobalInfo() {
      this.globalFiltersKeys = this.$refs.tree.getCheckedKeys();
      let res = this.$refs.tree.getCheckedNodes();
      console.log(res);
      let filterList = "";
      //添加省市区县
      let SQX = [];
      let MA = [];
      res.forEach(function (item) {
        if (item.value.provinceid) {
          SQX.push(item.value.provinceid);
        } else if (item.value.cityid) {
          SQX.push(item.value.cityid);
        } else if (item.value.qxId) {
          SQX.push(item.value.qxId);
        } else if (item.value.maId) {
          MA.push(item.value.maId);
        }
      });
      //拼接数据
      SQX = SQX.join(",");
      MA = MA.join(",");
      if (SQX && MA) {
        filterList = SQX + ";" + MA;
      } else if (MA) {
        filterList = MA;
      } else if (SQX) {
        filterList = SQX + ";";
      } else {
        filterList = "";
      }
      this.globalInfo = filterList;

    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.global-filter {
  height: 280px;
  min-height: 100px;
  /deep/.box-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: none;
    border-radius: 0;
    .el-card__header {
      border: 1px solid #e4e7ed;
      padding: 10px;
      background-color: #f5f7fa;
    }
    .el-card__body {
      height: 200px;
      .el-scrollbar__wrap {
        // margin-bottom: -17px;
        // margin-right: -17px;
        overflow-x: hidden;
      }
    }
  }
}
</style>
