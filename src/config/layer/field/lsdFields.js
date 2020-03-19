/**
 * @module lsd字段配置
 */

const lsd = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "Name",
    displayText: "名称",
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
    fieldName: "类型",
    displayText: "类型",
    type: "string",
    enum:["类型1","类型2","类型3","类型4",]
  },
  {
    fieldName: "备注",
    displayText: "备注",
    type: "string"
  },
  
  {
    fieldName: "coorList",
    displayText: "",
    type: "array",
    get() {
      return [this["lng_baidu"], this["lat_baidu"]];
    }
  },
  {
    fieldName: "geometryType",
    displayText: "",
    type: "string",
    get() {
      return "Point";
    }
  }
];

export default lsd;
