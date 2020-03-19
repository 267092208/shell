/**
 * @module poi字段配置
 */

const poi = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "编号",
    displayText: "编号",
    type: "string",
    required: true
  },
  {
    fieldName: "名称",
    displayText: "名称",
    type: "string"
  },
  {
    fieldName: "城市",
    displayText: "城市",
    type: "string"
  },
  {
    fieldName: "地址",
    displayText: "地址",
    type: "string"
  },
  {
    fieldName: "MA",
    displayText: "MA",
    type: "string"
  },
  {
    fieldName: "POI类型",
    displayText: "POI类型",
    type: "string",
  },
  {
    fieldName: "POI级别",
    displayText: "POI级别",
    type: "string"
  },
  {
    fieldName: "周边柴油需求",
    displayText: "周边柴油需求",
    type: "string"
  },
  {
    fieldName: "未来发展",
    displayText: "未来发展",
    type: "string"
  },
  {
    fieldName: "分区",
    displayText: "分区",
    type: "string"
  },
  {
    fieldName: "B2B建议",
    displayText: "B2B建议",
    type: "string"
  },
  {
    fieldName: "是否重点POIs",
    displayText: "是否重点POIs",
    type: "boolean"
  },
  {
    fieldName: "是否网络覆盖",
    displayText: "是否网络覆盖",
    type: "boolean"
  },
  {
    fieldName: "填补空白",
    displayText: "填补空白",
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
];

export default poi;
