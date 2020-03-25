const nti = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "十二五规划编号",
    displayText: "十二五规划编号",
    type: "string"
  },
  {
    fieldName: "十二五规划序号",
    displayText: "",
    type: "string"
  },

  {
    fieldName: "十三五规划编号",
    displayText: "十三五规划编号",
    type: "string"
  },
  {
    fieldName: "十三五规划序号",
    displayText: "",
    type: "string"
  },
  {
    fieldName: "站名",
    displayText: "站名",
    type: "string",
    required: true
  },
  {
    fieldName: "NTI自编号",
    displayText: "NTI自编号",
    type: "string",
    required: true
  },
  {
    fieldName: "城市",
    displayText: "城市",
    type: "string"
  },
  {
    fieldName: "区县",
    displayText: "区县",
    type: "string"
  },
  {
    fieldName: "所在MA",
    displayText: "所在MA",
    type: "string"
  },
  {
    fieldName: "地址",
    displayText: "地址",
    type: "string"
  },
  {
    fieldName: "车流量_单向",
    displayText: "车流量_单向",
    type: "string"
  },
  {
    fieldName: "车流量_单双向",
    displayText: "车流量_单双向",
    type: "string"
  },
  {
    fieldName: "单向车道数",
    displayText: "单向车道数",
    type: "number"
  },
  {
    fieldName: "Y4销量",
    displayText: "Y4销量",
    type: "number"
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
    fieldName: "情况简述",
    displayText: "情况简述",
    type: "string"
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
    type: "string",
    enum: ["填补空白", "网络加密"]
  },

  {
    fieldName: "CRT备注",
    displayText: "CRT备注",
    type: "string"
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
      return "nti";
    }
  }
];

export default nti;
