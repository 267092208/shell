<template>
  <el-dialog
    title="销量车流"
    :visible="dialogVisible"
    width="750px"
    :before-close="handleClose"
    center
    :append-to-body="true"
    :close-on-click-modal="false"
    custom-class="dialog"
    class="car-flow"
  >
    <el-table style="width: 100%;min-height:300px" heigth="400" :data="tableData">
      <el-table-column v-for="(item,index) in fields" :key="index" :label="item.name" width align="center">
        <el-table-column
          v-for="(childItem,childIndex) in item.child"
          :prop="childItem"
          :label="childItem"
          :width="childWidth(childItem)"
          :key="childIndex"
          align="center"
        ></el-table-column>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>


<script>
import { mapState } from "vuex";
import { getSales } from "@/data/yz";

export default {
  props: ["dialogVisible", "mscData"],
  data() {
    return {
      fields: [
        {
          name: "",
          child: ["油站编号", "站名", "年份", "网络类型", "Total_Sales"]
        },
        {
          name: "Volume per Day",
          child: [
            "Ago_Sales",
            " Mogas_Sales",
            "Mogas92_Sales",
            "Mogas95_Sales",
            "Mogas98_Sales",
            "Total_D"
          ]
        },
        {
          name: "Volume per Day",
          child: [
            "Ago_D",
            "Mogas_D",
            "Mogas92_D",
            "Mogas95_D",
            "Mogas98_D",
            "Total_Y"
          ]
        },
        {
          name: "Volume per Year",
          child: [
            "Ago_Y",
            "Mogas_Y",
            "Mogas92_Y",
            "Mogas95_Y",
            "Mogas98_Y",
            "Total_TC16"
          ]
        },
        {
          name: "Traffic Count(16h/d)",
          child: ["Ago_TC16", "Mogas_TC16", "Total_TC24"]
        },
        {
          name:"Traffic Count(24h/d)",child: ["Ago_TC24", "Mogas_TC24", "Total_T"]
        },
        {
          name: "Turn-in Count(24h/d) 汽油折合有效拐入",
          child: [
            "Ago_T",
            "Mogas_T",
            "Mogas92_T",
            "Mogas95_T",
            "Mogas98_T",
            "Total_Ave"
          ]
        },
        {
          name: "Ave. Comsumption(24h/d)",
          child: [
            "Ago_Ave",
            "Mogas_Ave",
            "Mogas92_Ave",
            "Mogas95_Ave",
            "Mogas98_Ave",
            "Total_Ratio"
          ]
        },
        {
          name: "Turn-in Ratio(24h/d)",
          child: ["Ago_Ratio", "Mogas_Ratio", "Total_P"]
        },
        {
          name: " Volume percentage",
          child: [
            "Ago_P",
            "Mogas_P",
            "Mogas92_P",
            "Mogas95_P",
            "Mogas98_P",
            "销售流水时数(h)"
          ]
        },
        { name: "参考因素", child: ["摩托车", "OPDays", "影响因素"] }
      ],
      tableData: []
    };
  },
  computed: {
    ...mapState({
      selectFeature: state => state.selectFeature.selectFeature
    })
  },
  mounted() {
    this.initData();
  },
  methods: {
    handleClose(done) {
      this.updateVisible(false);
    },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },

    initData() {
      getSales(this.selectFeature).then(res => {
this.tableData = []
        let obj = res[0];
        let o = {};

        for (let i in obj) {
          if (i === "YZNumber") {
            o["油站编号"] = obj[i];
          } else if (i === "CreateTime") {
            o["年份"] = obj[i].toLocaleString().substr(0, 4);
          } else if (i === "ChineseName") {
            o["站名"] = obj[i];
          } else if (i === "StatisticalClassification") {
            o["网络类型"] = obj[i];
          } else if (i === "InfluenceFactor") {
            o["影响因素"] = obj[i];
          } else if (i === "Motorcycle") {
            o["摩托车"] = obj[i];
          } else if (i === "XSLSSS") {
            o["销售流水时数(h)"] = obj[i];
          } else {
            o[i] = obj[i];
          }
        }

        this.tableData.push(o);
      });
    },
    childWidth(childItem){
      return this.canvasText(childItem) + 40;
    },
    canvasText(text) {
      let canvas = document.createElement("canvas");
      let c = canvas.getContext("2d");
      c.font = "14px Microsoft YaHei";
      return c.measureText(text).width;
    },
  },
  watch: {
    selectFeature: function() {
      // this.photoLoading = true;
      
      if (this.selectFeature) {
        this.initData();
        // this.photoLoading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.car-flow {
  .el-dialog {
    width: 1000px;
    .el-table{
      /deep/ .el-table__body-wrapper {
        min-height: 201px;
      }
      /deep/ .el-table__body-wrapper{
      overflow-x: auto; 
        &::-webkit-scrollbar-thumb{
          background-color: #c7c9cc;
          border-radius: 20px;
        }
      }
    }
  }
}
</style>