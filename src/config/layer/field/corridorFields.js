/**
 * @module corridor字段配置
 */

const 
  corridor = [
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
      fieldName: "path_baidu",
      displayText: "path_baidu",
      type: "string"
    },
    {
      fieldName: "编号",
      displayText: "编号",
      type: "string"
    },
    {
      fieldName: "道路名称",
      displayText: "道路名称",
      type: "string"
    },
    {
      fieldName: "道路重要性",
      displayText: "道路重要性",
      type: "string",
      enum:["一级","二级","三级"]
    },
   
    {
      fieldName: "道路描述",
      displayText: "道路描述",
      type: "string"
    },
    {
      fieldName: "车流",
      displayText: "车流",
      type: "string"
    },
    {
      fieldName: "Ranking",
      displayText: "Ranking",
      type: "string"
    },
    {
      fieldName: "道路类型",
      displayText: "道路类型",
      type: "string",
      enum:["国道","省道","高速公路","城市主干道","城市快速干线","城际主要连接线"]

    },
    {
      fieldName: "是否规划路",
      displayText: "是否规划路",
      type: "boolean"
    },
    
    
    {
      fieldName: "coorList",
      displayText: "",
      type: "array",
      get() {
        let firstIndex =this["Geo"] &&  this["Geo"]["WKT"].indexOf("(");
        let lastIndex = this["Geo"] && this["Geo"]["WKT"].lastIndexOf(")");
        
        let list = this["Geo"] && this["Geo"]["WKT"]
          .substring(firstIndex + 1, lastIndex)
          .split(",")
          .map(item => {
            return  item.split(" ").filter(f => {
              return f !== "";
            });
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
  ]


export default corridor;
