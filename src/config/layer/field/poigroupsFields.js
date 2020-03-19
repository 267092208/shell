/**
 * @module poigroup字段配置
 */

const poigroups = [
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
      fieldName: "path_baidu",
      displayText: "path_baidu",
      type: "string"
    },
    {
      fieldName: "strokeColor",
      displayText: "",
      type: "string"
    },
    {
      fieldName: "fillColor",
      displayText: "",
      type: "string"
    },
    {
      fieldName: "strokeStyle",
      displayText: "",
      type: "string",
    },
    {
      fieldName: "备注",
      displayText: "备注",
      type: "string"
    },
    {
      fieldName: "柴油总日销量k",
      displayText: "柴油总日销量k",
      type: "number"
    },
    {
      fieldName: "汽油总日销量k",
      displayText: "汽油总日销量k",
      type: "number"
    },
    {
      fieldName: "油站个数",
      displayText: "油站个数",
      type: "number"
    },
    {
      fieldName: "发展潜力",
      displayText: "发展潜力",
      type: "number"
    },
    {
      fieldName: "组团评级",
      displayText: "组团评级",
      type: "string",
      enum: ["高", "中", "低"]
    },
    {
      fieldName: "柴油总年销量mln",
      displayText: "柴油总年销量mln",
      type: "number",
      get() {
        var q = ((this["柴油总日销量k"] || 0) * 365) / 1000;
        return round1(q);
      }
    },
    {
      fieldName: "汽油总年销量mln",
      displayText: "汽油总年销量mln",
      type: "number",
      get() {
        var q = ((this["汽油总日销量k"] || 0) * 365) / 1000;
        return round1(q);
      }
    },
    {
      fieldName: "coorList",
      displayText: "",
      type: "array",
      get() {
        let list = this["path_baidu"].split(",").splice(1, this["path_baidu"].length);
      let res = [];
      for (var index = 0; index < list.length; index += 2) {
        if (list[index + 1]) {
          res.push([+list[index], +list[index + 1]]);
        } else {
          res.push(+list[index]);
        }
      }

      if (this["geometryType"] === "Polygon") {
        return [res];
      }
      return res;
    
      }
    },
    {
      fieldName: "geometryType",
      displayText: "",
      type: "string",
      get() {
        let type = this["path_baidu"].split(",")[0];
      type = type.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
      type === "Polyline" ? (type = "LineString") : null;
      return type;
      }
    },
  ];
  function round1(x) {
    return Math.round(x * 10) / 10;
  }
  export default poigroups;
  