/**
 * @module xzqh字段配置
 */

const xzqh = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "GDP",
    displayText: "GDP",
    type: "string"
  },
  {
    fieldName: "GDP增速",
    displayText: "GDP增速",
    type: "string"
  },
  {
    fieldName: "GDP排名",
    displayText: "GDP排名",
    type: "string"
  },
  {
    fieldName: "Name",
    displayText: "Name",
    type: "string"
  },
  {
    fieldName: "ParentId",
    displayText: "ParentId",
    type: "number",
    readonly: true
  },
  {
    fieldName: "path_baidu",
    displayText: "path_baidu",
    type: "array"
  },
  {
    fieldName: "人口",
    displayText: "人口",
    type: "string"
  },
  {
    fieldName: "人均收入",
    displayText: "人均收入",
    type: "string"
  },
  {
    fieldName: "汽车保有量",
    displayText: "汽车保有量",
    type: "string"
  },
  {
    fieldName: "汽车保有量增速",
    displayText: "汽车保有量增速",
    type: "string"
  },
  {
    fieldName: "第一产业比重",
    displayText: "第一产业比重",
    type: "string"
  },
  {
    fieldName: "第二产业比重",
    displayText: "第二产业比重",
    type: "string"
  },
  {
    fieldName: "第三产业比重",
    displayText: "第三产业比重",
    type: "string"
  },
  {
    fieldName: "coorList",
    displayText: "coorList",
    type: "array",
    get() {
      return [this["path_baidu"]];
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

export default xzqh;
