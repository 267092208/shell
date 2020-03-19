/**
 * @module roadnetwork字段配置
 */

const roadnetwork = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "Geo",
    displayText: "",
    type: "object"
  },
  {
    fieldName: "InfoID",
    displayText: "",
    type: "number"
  },
  {
    fieldName: "路名",
    displayText: "路名",
    type: "string"
  },
  {
    fieldName: "所属道路",
    displayText: "所属道路",
    type: "string"
  },
  {
    fieldName: "柴油车车流",
    displayText: "柴油车车流",
    type: "number"
  },
  {
    fieldName: "道路属性",
    displayText: "道路属性",
    type: "string"
  },
  {
    fieldName: "道路级别",
    displayText: "道路级别",
    type: "string"
  },
  {
    fieldName: "起点",
    displayText: "起点",
    type: "string"
  },
  {
    fieldName: "终点",
    displayText: "终点",
    type: "string"
  },
  {
    fieldName: "汽油车车流",
    displayText: "汽油车车流",
    type: "number"
  },
  
  
  
  {
    fieldName: "coorList",
    displayText: "coorList",
    type: "array",
    get() {
      let firstIndex = this["Geo"]["WKT"].indexOf("(");
      let lastIndex = this["Geo"]["WKT"].lastIndexOf(")");

      let list = this["Geo"]["WKT"]
        .substring(firstIndex + 1, lastIndex)
        .split(",")
        .map(item => {
          return item.split(" ").filter(f => {
            return f !== "";
          });
        });
      return list;
    }
  },
  {
    fieldName: "geometryType",
    displayText: "geometryType",
    type: "string",
    get() {
      return "LineString";
    }
  }
];

export default roadnetwork;
