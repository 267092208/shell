/**
 * @module xl字段配置
 */

const xl = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "IsRoute",
    displayText: "",
    type: "boolean"
  },
  {
    fieldName: "Name",
    displayText: "名称",
    type: "string"
  },
  {
    fieldName: "PathLevel",
    displayText: "级别",
    type: "string",
    enum: ["国道", "省道", "在建", "即将通车", "规划高速", "城市主干道", "规划主干道", "级别4"]
  },
  {
    fieldName: "Private",
    displayText: "",
    type: "string"
  },
  {
    fieldName: "path_baidu",
    displayText: "",
    type: "string"
  },
  {
    fieldName: "单双向",
    displayText: "单双向",
    type: "string"
  },
  {
    fieldName: "车道数",
    displayText: "车道数",
    type: "string"
  },
  {
    fieldName: "限速",
    displayText: "限速",
    type: "string"
  },
  {
    fieldName: "保存类型",
    displayText: "保存类型",
    type: "string",
    enum:["行程","线路","行程且只本人可见"],
    required: true

  },
  {
    fieldName: "coorList",
    displayText: "",
    type: "array",
    get() {
      let list = this["path_baidu"].split(";").map(t => {
        return t.split(",");
      });
      return list;
    }
  },
  {
    fieldName: "geometryType",
    displayText: "",
    type: "string",
    get() {
      return "LineString";
    }
  }
];

export default xl;
