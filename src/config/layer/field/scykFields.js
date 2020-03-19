/**
 * @module scyk字段配置
 */

const scyk = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "油库名称",
    displayText: "油库名称",
    type: "string"
  },
  {
    fieldName: "油库地址",
    displayText: "油库地址",
    type: "string"
  },
  {
    fieldName: "油库罐容总容量",
    displayText: "油库罐容总容量",
    type: "string"
  },
  {
    fieldName: "汽油罐",
    displayText: "汽油罐",
    type: "string"
  },
  {
    fieldName: "柴油罐",
    displayText: "柴油罐",
    type: "string"
  },
  {
    fieldName: "油库发油台",
    displayText: "油库发油台",
    type: "string"
  },
  {
    fieldName: "发车位数量",
    displayText: "发车位数量",
    type: "string"
  },
  {
    fieldName: "油库配送油站",
    displayText: "油库配送油站",
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
    fieldName: "品牌",
    displayText: "品牌",
    type: "string"
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

export default scyk;
