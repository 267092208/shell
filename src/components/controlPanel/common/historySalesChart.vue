<template>
  <el-dialog
    title="历史销量变化"
    :visible="dialogVisible"
    width="750px"
    :before-close="handleClose"
    @close="updateVisible(false)"
    center
    @open="initDialog"
    custom-class="dialog"
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div v-loading="loading">
      <div class="title" v-if="!loading">油站日销量柴汽油变化</div>
      <div ref="historyChart" id="historyChart" style="width: 650px;height:400px; margin: 0 auto;"></div>
      <!-- <span slot="footer" class="dialog-footer"> -->
      <!-- <el-button size="mini" @click="updateVisible(false)">取 消</el-button>
      <el-button size="mini" type="primary" @click="updateVisible(false)">确 定</el-button>-->
      <!-- </span> -->
    </div>
  </el-dialog>
</template>


<script>
import { getSalesHistory } from "@/data/yz.js";
import layer from "@/data/layer.js";

export default {
  props: ["dialogVisible", "yzdata"],
  computed: {
    createhistoryEchartWithCompute() {
      this.createhistoryEchart();
    }
  },
  data() {
    return {
      historyData: [],
      loading: false,
    };
  },
  methods: {
    handleClose(done) {
      this.$emit("update:dialogVisible", false);
    },
    updateVisible(b) {
      this.$emit("update:dialogVisible", b);
    },
    initDialog() {
      this.loading= true;
      getSalesHistory(this.yzdata.map(({ properties }) => properties.ID)).then(
        res => {
          this.historyData = res;
          this.createhistoryEchart();
          this.loading = false;
        }
      ).catch(err => {
          this.loading = false;
      });
    },
    createhistoryEchart() {
      let echart = echarts.init(document.getElementById("historyChart"));
      // 指定图表的配置项和数据
      var option = {
        xAxis: this.createXAxis(), // TODO:
        yAxis: {
          type: "value"
        },
        series: this.createSeries(), // TODO:
        legend: {
          data: this.createLegends(), // TODO:
          bottom: "0",
          type: "scroll"
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "line",
            axis: "y",
            snap: true
          }
        },
        toolbox: {
          left: "right",
          top: 65,
          orient: "vertical",
          zlevel: 10000,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: {
              show: true,
              title: "Data View"
            },
            //  magicType: {type: ['line']},
            restore: {},
            saveAsImage: {}
          }
        }
      };
      // 使用刚指定的配置项和数据显示图表。
      echart.setOption(option);
    },
    createLegends() {
      let legends = [];
      this.historyData.forEach(item => {
        const properties = item[0];
        let name = properties["站名"];
        let name_total = `${name}-总销量`;
        let name_gas = `${name}-汽油`;
        let name_diesel = `${name}-柴油`;

        legends.push(name_total);
        legends.push(name_gas);
        legends.push(name_diesel);
      });
      return legends;
    },
    createSeries() {
      let series = [];
      let xAxisIndex = 0;
      this.historyData.forEach(item => {
        const properties = item[0];
        let name = properties["站名"];
        let name_total = `${name}-总销量`;
        let name_gas = `${name}-汽油`;
        let name_diesel = `${name}-柴油`;

        let data_total = {
          name: name_total,
          type: "line",
          data: this.createSeriesItemdata(item, [
            "Actual日销量_汽油",
            "Actual日销量_柴油"
          ]),
          xAxisIndex: xAxisIndex
        };
        let data_gas = {
          name: name_gas,
          type: "line",
          data: this.createSeriesItemdata(item, ["Actual日销量_汽油"]),
          xAxisIndex
        };
        let data_diesel = {
          name: name_diesel,
          type: "line",
          data: this.createSeriesItemdata(item, ["Actual日销量_柴油"]),
          xAxisIndex
        };

        series.push(data_total);
        series.push(data_gas);
        series.push(data_diesel);
        xAxisIndex++;
      });

      return series;
    },
    createSeriesItemdata(items, fields) {
      let data = [];  
      items.forEach(item => {
        let total = 0;
        if (fields.length > 1) {
           total = fields.reduce((fieldA, fieldB) => {
            return Number.parseFloat(item[fieldA] + item[fieldB]).toFixed(4);
          });
        } else {
           total = Number.parseFloat(item[fields[0]]).toFixed(4);
        }
        data.push({
          value: total,
          label: layer.FromMSJsonString(item["开始时间"])
        });
      });
      return data;
    },
    createXAxis() {
      let xaxis = [];
      let offset = 0;
      let m = new Map();
      let maxOffset = -11;
      this.historyData.forEach(item => {
        let itemXAxis = [];
        item.forEach(p => {
          const time = layer.FromMSJsonString(p["开始时间"]);
          if (time != null) {
            itemXAxis.push(
              `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
            );
          }
        });
        itemXAxis = Array.from(new Set(itemXAxis));
        if (m.has(itemXAxis.join())) {
          offset = m.get(itemXAxis.join());
        } else {
          maxOffset += 11;
          offset = maxOffset;
        }
        m.set(itemXAxis.join(), offset);
        // console.log(itemXAxis)
        xaxis.push({
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          boundaryGap: false,
          name: item["站名"],
          data: itemXAxis,
          offset: offset
        });
        // if (itemXAxis.length > xaxis.length) {
        //   xaxis = itemXAxis;
        // }
      });
      // const sw = ['时间一', '时间二', '时间三', '时间四', '时间五', '时间六']
      // for(let i=0; i<xaxis.length; i++) {
      //   xaxis[i] = sw[i]
      // }
      return xaxis;
    }
  },

  mounted() {
    // console.log(this.historyData);
  }
};
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  text-align: center;
  top: 36px;
  width: 100%;
  left: 0;
  font-weight: bold;
}
</style>
