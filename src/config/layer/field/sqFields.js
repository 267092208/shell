/**
 * @module sq字段配置
 */

const sq = [
  {
    fieldName: "ID",
    displayText: "ID",
    type: "number",
    readonly: true
  },
  {
    fieldName: "类型",
    displayText: "类型",
    type: "string",
    required: true,
    enum: ["商住区", "工业区", "农林区", "商贸区", "物流园区",  "特色产业", "类型7"]
  },

  {
    fieldName: "Name",
    displayText: "名称",
    type: "string"
  },
  {
    fieldName: "note_baidu",
    displayText: "",
    type: "string",
    readonly: true

  },
  {
    fieldName: "path_baidu",
    displayText: "",
    type: "string",
    readonly: true

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
  }
];

export default sq;
