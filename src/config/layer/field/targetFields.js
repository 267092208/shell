/**
 * @module 图层字段配置
 */

 ///TODO:目标站字段未完成
import trafficFlowTable from "@/data/trafficFlowTable";


const target = {
    "target-xyyz":  [
        /* 常规字段 */
        {
          fieldName: "ID",
          displayText: "ID",
          type: "number",
          readonly: true
        },
        {
          fieldName: "油站编号",
          displayText: "油站编号",
          type: "string",
          required: true,
          tileField: true
        },
        {
          fieldName: "站名",
          displayText: "站名",
          type: "string",
          required: true
        },
        {
          fieldName: "品牌",
          displayText: "品牌",
          type: "string",
          required: true,
          enum: ["YC Shell", "SP", "PC", "BPPC", "IND", "CNOOC", "SC", "Caltex", "停车场", "TOPE"]
        },
        {
          fieldName: "lat_baidu",
          displayText: "纬度",
          type: "geometryX",
          required: true
        },
        {
          fieldName: "lng_baidu",
          displayText: "经度",
          type: "geometryY",
          required: true
        },
        {
          fieldName: "日期",
          displayText: "日期",
          type: "date"
        },
        {
          fieldName: "开始时间",
          displayText: "开始时间",
          type: "time"
        },
        {
          fieldName: "数车时长",
          displayText: "数车时长",
          type: "number"
        },
        {
          fieldName: "竞争对手",
          displayText: "竞争对手",
          type: "string"
        },
        {
          fieldName: "覆盖范围",
          displayText: "覆盖范围",
          type: "string"
        },
        {
          fieldName: "油站照片",
          displayText: "油站照片",
          type: "string"
        },
        {
          fieldName: "开业时间",
          displayText: "开业时间",
          type: "date"
        },
        {
          fieldName: "状态",
          displayText: "状态",
          type: "string",
          enum: ["Pre-id", "id", "Contract", "Construction", "License", "Open"]
        },
        {
          fieldName: "开发进度",
          displayText: "开发进度",
          type: "string"
        },
        {
          fieldName: "小网络名",
          displayText: "小网络名",
          type: "string"
        },
        {
          fieldName: "经营状况",
          displayText: "经营状况",
          type: "string",
          enum: ["停业", "在建", "开业"]
        },
        {
          fieldName: "短期重开",
          displayText: "短期重开",
          type: "boolean"
        },
        {
          fieldName: "区县镇",
          displayText: "区县镇",
          type: "string"
        },
        {
          fieldName: "是否高速公路",
          displayText: "是否高速公路",
          type: "boolean"
        },
        {
          fieldName: "市场环境",
          displayText: "市场环境",
          type: "string"
        },
        {
          fieldName: "网络类型1",
          displayText: "网络类型1",
          type: "string"
        },
        {
          fieldName: "网络类型2",
          displayText: "网络类型2",
          type: "string"
        },
        {
          fieldName: "路名",
          displayText: "路名",
          type: "string"
        },
        {
          fieldName: "路侧",
          displayText: "路侧",
          type: "string"
        },
        {
          fieldName: "道路类型",
          displayText: "道路类型",
          type: "string"
        },
        {
          fieldName: "单向双向",
          displayText: "单向双向",
          type: "string"
        },
        {
          fieldName: "车道数量",
          displayText: "车道数量",
          type: "number"
        },
        {
          fieldName: "限速",
          displayText: "限速",
          type: "number"
        },
        {
          fieldName: "弯角",
          displayText: "弯角",
          type: "string"
        },
        {
          fieldName: "近角远角",
          displayText: "近角远角",
          type: "string"
        },
        {
          fieldName: "辅道内",
          displayText: "辅道内",
          type: "boolean"
        },
        {
          fieldName: "可否穿越",
          displayText: "可否穿越",
          type: "boolean"
        },
        {
          fieldName: "隔离带",
          displayText: "隔离带",
          type: "boolean"
        },
        {
          fieldName: "可否调头",
          displayText: "可否调头",
          type: "boolean"
        },
        {
          fieldName: "出口长度M",
          displayText: "出口长度M",
          type: "number"
        },
        {
          fieldName: "前庭长M",
          displayText: "前庭长M",
          type: "number"
        },
        {
          fieldName: "前庭深M",
          displayText: "前庭深M",
          type: "number"
        },
        {
          fieldName: "出入口数量",
          displayText: "出入口数量",
          type: "number"
        },
        {
          fieldName: "规则地块",
          displayText: "规则地块",
          type: "boolean"
        },
        {
          fieldName: "布局",
          displayText: "布局",
          type: "string"
        },
        {
          fieldName: "雨棚长M",
          displayText: "雨棚长M",
          type: "number"
        },
        {
          fieldName: "雨棚深M",
          displayText: "雨棚深M",
          type: "number"
        },
        {
          fieldName: "雨棚数量",
          displayText: "雨棚数量",
          type: "number"
        },
        {
          fieldName: "便利店",
          displayText: "便利店",
          type: "boolean"
        },
        {
          fieldName: "便利店面积M2",
          displayText: "便利店面积M2",
          type: "string"
        },
        {
          fieldName: "宿舍",
          displayText: "宿舍",
          type: "boolean"
        },
        {
          fieldName: "换油",
          displayText: "换油",
          type: "boolean"
        },
        {
          fieldName: "加油机数",
          displayText: "加油机数",
          type: "string"
        },
        {
          fieldName: "加油岛数",
          displayText: "加油岛数",
          type: "number"
        },
        {
          fieldName: "加油位数",
          displayText: "加油位数",
          type: "number"
        },
        {
          fieldName: "可视度",
          displayText: "可视度",
          type: "number"
        },
        {
          fieldName: "可进出度",
          displayText: "可进出度",
          type: "number"
        },
        {
          fieldName: "车流量",
          displayText: "车流量",
          type: "number"
        },
        {
          fieldName: "商圈",
          displayText: "商圈",
          type: "number"
        },
        {
          fieldName: "实测车流_汽油车",
          displayText: "实测车流_汽油车",
          type: "number"
        },
        {
          fieldName: "实测车流_摩托车",
          displayText: "实测车流_摩托车",
          type: "number"
        },
        {
          fieldName: "实测车流_柴油车",
          displayText: "实测车流_柴油车",
          type: "number"
        },
        {
          fieldName: "实测拐入_汽油车",
          displayText: "实测拐入_汽油车",
          type: "number"
        },
        {
          fieldName: "实测拐入_摩托车",
          displayText: "实测拐入_摩托车",
          type: "number"
        },
        {
          fieldName: "实测拐入_柴油车",
          displayText: "实测拐入_柴油车",
          type: "number"
        },
        {
          fieldName: "单车加油量_汽油",
          displayText: "单车加油量_汽油",
          type: "number"
        },
        {
          fieldName: "单车加油量_柴油",
          displayText: "单车加油量_柴油",
          type: "number"
        },
        {
          fieldName: "Actual日销量_汽油",
          displayText: "Actual日销量_汽油",
          type: "number"
        },
        {
          fieldName: "Actual日销量_柴油",
          displayText: "Actual日销量_柴油",
          type: "number"
        },
        {
          fieldName: "ShellY0日销量_汽油",
          displayText: "ShellY0日销量_汽油",
          type: "number"
        },
        {
          fieldName: "ShellY0日销量_柴油",
          displayText: "ShellY0日销量_柴油",
          type: "number"
        },
        {
          fieldName: "ShellY4日销量_汽油",
          displayText: "ShellY4日销量_汽油",
          type: "number"
        },
        {
          fieldName: "ShellY4日销量_柴油",
          displayText: "ShellY4日销量_柴油",
          type: "number"
        },
        {
          fieldName: "目标",
          displayText: "目标",
          type: "boolean"
        },
        {
          fieldName: "Remark",
          displayText: "Remark",
          type: "string"
        },
        {
          fieldName: "车流量_汽油车",
          displayText: "车流量_汽油车",
          type: "number"
        },
        {
          fieldName: "车流量_柴油车",
          displayText: "车流量_柴油车",
          type: "number"
        },
        {
          fieldName: "车量拐入率_汽油车",
          displayText: "车量拐入率_汽油车",
          type: "number"
        },
        {
          fieldName: "车量拐入率_柴油车",
          displayText: "车量拐入率_柴油车",
          type: "number"
        },
        {
          fieldName: "国家定价_98",
          displayText: "国家定价_98",
          type: "number"
        },
        {
          fieldName: "国家定价_95",
          displayText: "国家定价_95",
          type: "number"
        },
        {
          fieldName: "国家定价_92",
          displayText: "国家定价_92",
          type: "number"
        },
        {
          fieldName: "国家定价_0",
          displayText: "国家定价_0",
          type: "number"
        },
        {
          fieldName: "挂牌价格_98",
          displayText: "挂牌价格_98",
          type: "number"
        },
        {
          fieldName: "挂牌价格_95",
          displayText: "挂牌价格_95",
          type: "number"
        },
        {
          fieldName: "挂牌价格_92",
          displayText: "挂牌价格_92",
          type: "number"
        },
        {
          fieldName: "挂牌价格_0",
          displayText: "挂牌价格_0",
          type: "number"
        },
        {
          fieldName: "促销方案_柴油_买赠",
          displayText: "促销方案_柴油_买赠",
          type: "string"
        },
        {
          fieldName: "促销方案_柴油_满减",
          displayText: "促销方案_柴油_满减",
          type: "string"
        },
        {
          fieldName: "促销方案_柴油_积分",
          displayText: "促销方案_柴油_积分",
          type: "string"
        },
        {
          fieldName: "促销方案_柴油_抽奖",
          displayText: "促销方案_柴油_抽奖",
          type: "string"
        },
        {
          fieldName: "促销方案_柴油_第三方优惠",
          displayText: "促销方案_柴油_第三方优惠",
          type: "string"
        },
        {
          fieldName: "促销方案_柴油_其他",
          displayText: "促销方案_柴油_其他",
          type: "string"
        },
        {
          fieldName: "促销方案_汽油_买赠",
          displayText: "促销方案_汽油_买赠",
          type: "string"
        },
        {
          fieldName: "促销方案_汽油_满减",
          displayText: "促销方案_汽油_满减",
          type: "string"
        },
        {
          fieldName: "促销方案_汽油_积分",
          displayText: "促销方案_汽油_积分",
          type: "string"
        },
        {
          fieldName: "促销方案_汽油_抽奖",
          displayText: "促销方案_汽油_抽奖",
          type: "string"
        },
        {
          fieldName: "促销方案_汽油_第三方优惠",
          displayText: "促销方案_汽油_第三方优惠",
          type: "string"
        },
        {
          fieldName: "促销方案_汽油_其他",
          displayText: "促销方案_汽油_其他",
          type: "string"
        },
        {
          fieldName: "十二五规划",
          displayText: "十二五规划",
          type: "boolean"
        },
        {
          fieldName: "规划编号",
          displayText: "规划编号",
          type: "string"
        },
        {
          fieldName: "成品油资格",
          displayText: "成品油资格",
          type: "boolean"
        },
        {
          fieldName: "经信委编号",
          displayText: "经信委编号",
          type: "string"
        },
        {
          fieldName: "NTI新建",
          displayText: "NTI新建",
          type: "boolean"
        },
        {
          fieldName: "是否CRT油站",
          displayText: "是否CRT油站",
          type: "boolean"
        },
        {
          fieldName: "B2B销量支持",
          displayText: "B2B销量支持",
          type: "string"
        },
        {
          fieldName: "是否VA油站",
          displayText: "是否VA油站",
          type: "boolean"
        },
        {
          fieldName: "网络策略",
          displayText: "网络策略",
          type: "string"
        },
        {
          fieldName: "CRT备注",
          displayText: "CRT备注",
          type: "string"
        },
        /* 扩展属性 */
        {
          fieldName: "品牌-是否停业",
          displayText: "",
          type: "string",
          get() {
            const isclose = (this["经营状况"] === "停业" || this["经营状况"] === "在建") && this["短期重开"] != true;
            return `${this["品牌"]}-${isclose}`;
          }
        },
        {
          fieldName: "年销量",
          displayText: "年销量",
          type: "number",
          get() {
            var q = ((this["Actual日销量_汽油"] || 0) * 365) / 1000;
            var c = ((this["Actual日销量_柴油"] || 0) * 365) / 1000;
            return round1(q + c);
          }
        },
        {
          fieldName: "年销量-总销量",
          displayText: "年销量-总销量",
          type: "number",
          get() {
            return this["年销量"];
          }
        },
        {
          fieldName: "日销量",
          displayText: "日销量",
          type: "number",
          get() {
            return round1((this["Actual日销量_柴油"] || 0) + (this["Actual日销量_汽油"] || 0));
          }
        },
        {
          fieldName: "前庭面积",
          displayText: "前庭面积",
          type: "number",
          get() {
            var l = this["前庭长M"] || 0;
            var h = this["前庭深M"] || 0;
            return l * h;
          }
        },
        {
          fieldName: "雨棚面积",
          displayText: "雨棚面积",
          type: "number",
          get() {
            var l = this["雨棚长M"] || 0;
            var h = this["雨棚深M"] || 0;
            return l * h;
          }
        },
        {
          fieldName: "车流量",
          displayText: "车流量",
          type: "number",
          get() {
            var sc = this["车流量-柴油车"] + this["车流量-汽油车"];
            var f = parseInt(sc / 1000);
            var y = sc % 1000;
            if (y > 500) f++;
            if (f > 10) f = 10;
            return f;
          }
        },
        {
          fieldName: "站点优势评分",
          displayText: "站点优势评分",
          type: "number",
          get() {
            return (this["可进出度"] || 0) + (this["可视度"] || 0);
          }
        },
        {
          fieldName: "位置优势评分",
          displayText: "位置优势评分",
          type: "number",
          get() {
            return this["车流量"] + (this["商圈"] || 0);
          }
        },
        {
          fieldName: "加油站等级",
          displayText: "加油站等级",
          type: "string",
          get() {
            var AV7 = this["站点优势评分"];
            var AW7 = this["位置优势评分"];
            if (AV7 == 0 && AW7 == 0) {
              return "-";
            } else if (AV7 < 10 && AW7 < 10) {
              return "Dog";
            } else if (AV7 < 8 && AW7 >= 10) {
              return "Sec";
            } else if (AV7 >= 10 && AW7 < 10) {
              return "Sec";
            } else if ((AV7 >= 8 && AV7 <= 12 && AW7 >= 10) || (AW7 >= 10 && AW7 <= 12 && AV7 >= 8)) {
              return "SSec";
            } else {
              return "Prime";
            }
          }
        },
        {
          fieldName: "车流量-汽油车",
          displayText: "车流量-汽油车",
          type: "number",
          get() {
            if (IsYcShell(this) || IsGsYz(this)) {
              return parseInt(this["车流量_汽油车"]);
            }
            var w1 = this["网络类型1"];
            var w2 = this["网络类型2"];
            var st = this["开始时间"];
            var min = this["数车时长"];
            var sc = (this["实测车流_汽油车"] || 0) + (this["实测车流_摩托车"] || 0) / 7;
            var v = "汽油车";
            var r1 = getCl(sc, v, w1, st, min);
            var r2 = getCl(sc, v, w2, st, min);
            if (!w2) {
              return parseInt(r1);
            } else {
              return parseInt(r1 * 0.7 + r2 * 0.3);
            }
          }
        },
        {
          fieldName: "车流量-柴油车",
          displayText: "车流量-柴油车",
          type: "number",
          get() {
            if (IsYcShell(this) || IsGsYz(this)) {
              return parseInt(this["车流量_柴油车"]);
            }
            var w1 = this["网络类型1"];
            var w2 = this["网络类型2"];
            var st = this["开始时间"];
            var min = this["数车时长"];
            var sc = this["实测车流_柴油车"] || 0;
            var v = "柴油车";
            var r1 = getCl(sc, v, w1, st, min);
            var r2 = getCl(sc, v, w2, st, min);
            if (!w2) {
              return parseInt(r1);
            } else {
              return parseInt(r1 * 0.7 + r2 * 0.3);
            }
          }
        },
        {
          fieldName: "车辆拐入率-汽油车",
          displayText: "车辆拐入率-汽油车",
          type: "string",
          get() {
            var v;
            if (IsYcShell(this)) {
              v = parseFloat(this["车量拐入率_汽油车"]);
            } else {
              var rx = this["Actual日销量_汽油"] || 0;
              rx *= 1000;
              var d = this["单车加油量_汽油"] || 0;
              var q = this["车流量-汽油车"];
              if (rx && d && q) {
                v = (rx / d / q) * 100;
              }
            }
            if (v !== null && !isNaN(v)) {
              return v.toFixed("0.0") + "%";
            } else {
              return "-";
            }
          }
        },
        {
          fieldName: "车辆拐入率-柴油车",
          displayText: "车辆拐入率-柴油车",
          type: "string",
          get() {
            var v;
            if (IsYcShell(this)) {
              v = parseFloat(this["车量拐入率_柴油车"]);
            } else {
              var rx = this["Actual日销量_柴油"] || 0;
              rx *= 1000;
              var d = this["单车加油量_柴油"] || 0;
              var q = this["车流量-柴油车"];
              if (rx && d && q) {
                v = (rx / d / q) * 100;
              }
            }
            if (v !== null && !isNaN(v)) {
              return v.toFixed("0.0") + "%";
            } else {
              return "-";
            }
          }
        },
        {
          fieldName: "年销量-汽油",
          displayText: "年销量-汽油",
          type: "number",
          get() {
            return round1(((this["Actual日销量_汽油"] || 0) * 365) / 1000);
          }
        },
        {
          fieldName: "年销量-柴油",
          displayText: "年销量-柴油",
          type: "number",
          get() {
            return round1(((this["Actual日销量_柴油"] || 0) * 365) / 1000);
          }
        },
        {
          fieldName: "Shell Y0-ATP-汽油",
          displayText: "Shell Y0-ATP-汽油",
          type: "number",
          get() {
            return round1(((this["ShellY0日销量_汽油"] || 0) * 365) / 1000);
          }
        },
        {
          fieldName: "Shell Y0-ATP-柴油",
          displayText: "Shell Y0-ATP-柴油",
          type: "number",
          get() {
            return round1(((this["ShellY0日销量_柴油"] || 0) * 365) / 1000);
          }
        },
        {
          fieldName: "Shell Y0-ATP-总销量",
          displayText: "Shell Y0-ATP-总销量",
          type: "number",
          get() {
            var q = ((this["ShellY0日销量_汽油"] || 0) * 365) / 1000;
            var c = ((this["ShellY0日销量_柴油"] || 0) * 365) / 1000;
            return round1(q + c);
          }
        },
        {
          fieldName: "Shell Y4-ATP-汽油",
          displayText: "Shell Y4-ATP-汽油",
          type: "number",
          get() {
            return round1(((this["ShellY4日销量_汽油"] || 0) * 365) / 1000);
          }
        },
        {
          fieldName: "Shell Y4-ATP-柴油",
          displayText: "Shell Y4-ATP-柴油",
          type: "number",
          get() {
            return round1(((this["ShellY4日销量_柴油"] || 0) * 365) / 1000);
          }
        },
        {
          fieldName: "Shell Y4-ATP-总销量",
          displayText: "Shell Y4-ATP-总销量",
          type: "number",
          get() {
            var q = ((this["ShellY4日销量_汽油"] || 0) * 365) / 1000;
            var c = ((this["ShellY4日销量_柴油"] || 0) * 365) / 1000;
            return round1(q + c);
          }
        },
        {
          fieldName: "差价_98",
          displayText: "差价_98",
          type: "number",
          get() {
            return (this["挂牌价格_98"] - this["国家定价_98"]).toFixed(2);
          }
        },
        {
          fieldName: "差价_95",
          displayText: "差价_95",
          type: "number",
          get() {
            return (this["挂牌价格_95"] - this["国家定价_95"]).toFixed(2);
          }
        },
        {
          fieldName: "差价_92",
          displayText: "差价_92",
          type: "number",
          get() {
            return (this["挂牌价格_92"] - this["国家定价_92"]).toFixed(2);
          }
        },
        {
          fieldName: "差价_0",
          displayText: "差价_0",
          type: "number",
          get() {
            return (this["挂牌价格_0"] - this["国家定价_0"]).toFixed(2);
          }
        },
        {
          fieldName: "柴汽比",
          displayText: "柴汽比",
          type: "string",
          get() {
            var rq = this["Actual日销量_柴油"] || 0;
            var rc = this["Actual日销量_汽油"] || 0;
            var q = 0;
            var c = 0;
            if (rq) {
              if (rc) {
                var k = parseInt((rq / (rq + rc)) * 100);
                q = k;
                c = 100 - q;
              } else {
                q = 100;
                c = 0;
              }
            } else {
              if (rc) {
                q = 0;
                c = 100;
              } else {
                q = 0;
                c = 0;
              }
            }
            return c + ":" + q;
          }
        },
        {
          fieldName: "coorList",
          displayText: "coorList",
          type: "array",
          get() {
            return [this["lng_baidu"], this["lat_baidu"]];
          }
        },
        {
          fieldName: "geometryType",
          displayText: "geometryType",
          type: "string",
          get() {
            return "Point";
          }
        },
        {
            fieldName: "数据源图层ID",
            displayText: "",
            type: "string",
            get() {
                return "xyyz"
              
            }
          },
          {
            fieldName: "编号",
            displayText: "",
            type: "string",
            get() {
                return this["油站编号"]
              
            }
          },
          {
            fieldName: "target-是否目标站",
            displayText: "",
            type: "boolean",
            get() {
                return this["目标"]
              
            }
          }
      ],
    "target-nti":[
        {
          fieldName: "ID",
          displayText: "ID",
          type: "number",
          readonly: true
        },
        {
          fieldName: "B2B销量支持",
          displayText: "B2B销量支持",
          type: "string"
        },
        {
          fieldName: "CRT备注",
          displayText: "CRT备注",
          type: "string"
        },
        {
          fieldName: "NTI自编号",
          displayText: "NTI自编号",
          type: "string",
          required: true
        },
        {
          fieldName: "Y4销量",
          displayText: "Y4销量",
          type: "number"
        },
        {
          fieldName: "lat_baidu",
          displayText: "纬度",
          type: "geometryX",
          required: true
        },
        {
          fieldName: "lng_baidu",
          displayText: "经度",
          type: "geometryY",
          required: true
        },
        {
          fieldName: "区县",
          displayText: "区县",
          type: "string"
        },
      
        {
          fieldName: "十三五规划序号",
          displayText: "十三五规划序号",
          type: "string"
        },
        {
          fieldName: "十三五规划编号",
          displayText: "十三五规划编号",
          type: "string"
        },
        {
          fieldName: "十二五规划序号",
          displayText: "十二五规划序号",
          type: "string"
        },
        {
          fieldName: "十二五规划编号",
          displayText: "十二五规划编号",
          type: "string"
        },
        {
          fieldName: "单向车道数",
          displayText: "单向车道数",
          type: "number"
        },
        {
          fieldName: "地址",
          displayText: "地址",
          type: "string"
        },
        {
          fieldName: "城市",
          displayText: "城市",
          type: "string"
        },
        {
          fieldName: "情况简述",
          displayText: "情况简述",
          type: "string"
        },
        {
          fieldName: "所在MA",
          displayText: "所在MA",
          type: "string"
        },
        {
          fieldName: "是否CRT油站",
          displayText: "是否CRT油站",
          type: "boolean"
        },
        {
          fieldName: "是否VA油站",
          displayText: "是否VA油站",
          type: "boolean"
        },
        {
          fieldName: "是否目标站",
          displayText: "是否目标站",
          type: "boolean"
        },
      
        {
          fieldName: "目标站状态",
          displayText: "目标站状态",
          type: "string",
    enum: ["优先", "跟进", "暂不跟进", "待定", "无"]


        },
        {
          fieldName: "站名",
          displayText: "站名",
          type: "string",
          required: true
        },
        {
          fieldName: "网络策略",
          displayText: "网络策略",
          type: "string"
        },
        {
          fieldName: "车流量_单双向",
          displayText: "车流量_单双向",
          type: "string"
        },
        {
          fieldName: "车流量_单向",
          displayText: "车流量_单向",
          type: "string"
        },
        /* 扩展属性 */
        {
          fieldName: "是否目标+是否CRT",
          displayText: "",
          type: "string",
          get() {
            if (this["是否目标站"]) {
              return this["是否CRT油站"] ? "目标油站+CRT" : "目标油站";
            } else {
              return this["是否CRT油站"] ? "非目标油站+CRT" : "非目标油站";
            }
          }
        },
        {
          fieldName: "coorList",
          displayText: "coorList",
          type: "array",
          get() {
            return [this["lng_baidu"], this["lat_baidu"]];
          }
        },
        {
          fieldName: "geometryType",
          displayText: "geometryType",
          type: "string",
          get() {
            return "Point";
          }
        },
        {
            fieldName: "数据源图层ID",
            displayText: "",
            type: "string",
            get() {
                return "nti"
              
            }
          },
          {
            fieldName: "target-是否目标站",
            displayText: "",
            type: "boolean",
            get() {
                return this["是否目标站"] 
            }
          },
          {
            fieldName: "编号",
            displayText: "",
            type: "string",
            get() {
                return this["十三五规划编号"]
              
            }
          },
      ],
    }
    


function round1(x) {
  return Math.round(x * 10) / 10;
}

function IsYcShell(rowData) {
  return rowData["品牌"] && rowData["品牌"].toLowerCase() == "yc shell";
}

function IsGsYz(rowData) {
  return rowData["是否高速公路"];
}

//车流计算
function getCl(num, vehicle, type, startTime, mins) {
  if (!type || !num || !startTime || !mins || !vehicle || !startTime.getHours) return 0;
  var list = trafficFlowTable[vehicle][type];
  var t = startTime.getHours();
  var sl = num * (60 / mins); //实测1小时车流
  var c = list[t]; //车流表1小时车流
  return c.Total16 * (sl / c.Count); //16小时车流
}

export default target;
