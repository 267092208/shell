/**
 * @module lpglng字段配置
 */

const lpglng = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "名称",
    displayText: "名称",
    type: "string"
  },
  {
    fieldName: "地址",
    displayText: "地址",
    type: "string"
  },
  {
    fieldName: "备注",
    displayText: "备注",
    type: "string"
  },
  {
    fieldName: "类型",
    displayText: "类型",
    type: "string"
  },
  {
    fieldName: "规划点名",
    displayText: "规划点名",
    type: "string"
  },
  {
    fieldName: "规划编号",
    displayText: "规划编号",
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
  }
];

export default lpglng;
