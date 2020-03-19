/**
 * @module MA字段配置
 */

const ma = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "名称",
    displayText: "名称",
    type: "string",
    required: true
  },
  {
    fieldName: "所属城市",
    displayText: "所属城市",
    type: "string",
    required: true
  },
  {
    fieldName: "省份",
    displayText: "省份",
    type: "number",
    required: true
  },
  {
    fieldName: "行政区划Ids",
    displayText: "行政区划Ids",
    type: "string",
    required: true
  },
  {
    fieldName: "颜色",
    displayText: "颜色",
    type: "string",
    required: true
  },
  {
    fieldName: "MAResource",
    displayText: "MAResource",
    type: "array"
  },
  {
    fieldName: "points",
    displayText: "points",
    type: "array",
    required: true
  },
  {
    fieldName: "rankingLv",
    displayText: "rankingLv",
    type: "string"
  },
  {
    fieldName: "coorList",
    displayText: "coorList",
    type: "array",
    get() {
      return this["points"];
    }
  },
  {
    fieldName: "geometryType",
    displayText: "geometryType",
    type: "string",
    get() {
      return "Polygon";
    }
  }
];

export default ma;
