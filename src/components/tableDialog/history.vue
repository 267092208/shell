<template>
  <el-dialog
    title="历史数据"
    :visible="historyVisible"
    width="750px"
    :before-close="handleClose"
    center
    :append-to-body="true"
    :close-on-click-modal="false"
    custom-class="dialog"
  >
    <div class="tablebox" style="height:300px;width:100%" v-loading="historyLoading">
      <pl-table :datas="historyData"
        ref="plTable"
        header-drag-style
        stripe
        :height-change="false"
        :pagination-show="false"
        border
        use-virtual
        cell-class-name="historyfont"
        :row-height="25"
        header-cell-class-name="headcell"
        thtd-beyond-hiding
      >   
          <pl-table-column
              :resizable="true"
              prop="UPDATETIME"
              label="数据更新日期"
              align="center"
              width="120"
              :show-overflow-tooltip="true"
            >
          </pl-table-column>
          <template v-for="item in fixColumn">
            <pl-table-column
              :key="item"
              :resizable="true"
              :prop="item"
              :label="item"
              align="center"
              width="90"
              :show-overflow-tooltip="true"
            >
            </pl-table-column>
          </template>
          <template v-for="(item,index) in sortColumns">
            <pl-table-column
              v-if="!checkType(item)"
              :key="item"
              :resizable="true"
              :prop="item"
              :label="item"
              align="center"
              width="120"
              :show-overflow-tooltip="true"
            >
            </pl-table-column>
            <pl-table-column
              v-else
              :key="index"
              :resizable="true"
              :prop="item[0]"
              :label="item[0]"
              align="center"
              width="120"
              :show-overflow-tooltip="true"
            >
            </pl-table-column>
          </template>
      </pl-table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["historyVisible","historyData","historyLoading"],
  data(){
    return{
      fixColumn:["油站编号", "站名", "品牌"],
      sortColumns: [                
                "日期", "开始时间", "数车时长", "小网络名", "经营状况", ["短期重开"], "区县镇", "市场环境", "网络类型1",
                "网络类型2", "路名", "路侧", "道路类型", "单向双向", "车道数量", "限速", "弯角", "近角远角", ["辅道内"], ["可否穿越"], ["隔离带"],
                ["可否调头"], "出口长度M", "前庭长M","前庭面积","前庭深M", "出入口数量", ["规则地块"], "布局", "雨棚长M", "雨棚深M", "雨棚数量",
                ["便利店"], "便利店面积M2", ["宿舍"], ["换油"], "加油机数", "加油岛数", "加油位数", "可视度",
                "可进出度", "车流量", "商圈", 
                "站点优势评分","加油站等级","位置优势评分",
                "实测车流_汽油车", "实测车流_摩托车", "实测车流_柴油车", "实测拐入_汽油车", "实测拐入_摩托车","实测拐入_柴油车", 
                "车流量-汽油车","车流量-柴油车","车辆拐入率-汽油车","车辆拐入率-柴油车",
                "单车加油量_汽油", "单车加油量_柴油", "Actual日销量_汽油", "Actual日销量_柴油", 
                "年销量-汽油","年销量-柴油","年销量-总销量",
                "ShellY0日销量_汽油","ShellY0日销量_柴油", 
                "Shell Y0-ATP-汽油","Shell Y0-ATP-柴油","Shell Y0-ATP-总销量",
                "ShellY4日销量_汽油", "ShellY4日销量_柴油", 
                "Shell Y4-ATP-汽油","Shell Y4-ATP-柴油","Shell Y4-ATP-总销量",
                ["目标"], "Remark", "状态",
                "国家定价_98","国家定价_95","国家定价_92","国家定价_0",
                "挂牌价格_98","挂牌价格_95","挂牌价格_92","挂牌价格_0",
                "差价_98","差价_95","差价_92","差价_0",
                "促销方案_柴油_买赠","促销方案_柴油_满减","促销方案_柴油_积分","促销方案_柴油_抽奖","促销方案_柴油_第三方优惠","促销方案_柴油_其他",
                "促销方案_汽油_买赠","促销方案_汽油_满减","促销方案_汽油_积分","促销方案_汽油_抽奖","促销方案_汽油_第三方优惠","促销方案_汽油_其他",
                ["十二五规划"],"规划编号",["成品油资格"],"经信委编号",["NTI新建"],["是否CRT油站"],"B2B销量支持",["是否VA油站"],"网络策略","CRT备注"
            ],
    }
  },
  methods:{
    handleClose(){
      this.$emit("update:historyVisible", false);
    },
    checkType(item){
      var res = false
      typeof item == 'object' ? res = true : res = false
      return res;
    },
  }
}
</script>

<style lang="scss" scoped>
.tablebox{
  /deep/ .historyfont{
    font-size: 12px !important;
    padding: 5px 0;
  }
  /deep/ .headcell{
    padding: 0 5px;
    border-right: 1px solid #e5e5e5 !important;
    border-bottom:  1px solid #e5e5e5 !important;
    height: 30px;
    box-sizing: border-box;
    overflow: hidden;
    .pltableDragIconHover{
      display: none;
      i{
        height: 100%;
        top: 0
      }
      &:hover{
        background: #f7f7f7;
      }
    }
    .cell{
      padding: 0;
    }
  }
    //选中一行样式
  /deep/ .el-table .el-table__body tr.current-row>td{
    background: #1faeff !important;
    color: #fff;
  }
}
</style>