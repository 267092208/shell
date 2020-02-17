import axios from "@/assets/js/axios";
import { propertys, dateFields } from "@/config/layer/fields";
import GPS2Google2Baidu from "@/assets/js/GPS2Google2Baidu";
import { FromMSJsonString, DateFormat } from "@/utils/date";

/**
 * 查询指定图层的数据
 * 并转为geofeature格式
 * @param {string} layerid
 * @param {query[]} querys
 */
async function get(layerid, querys) {
  const result = await axios.post(
    `/dataPages/${layerid}/Handler.ashx?action=GetList`,
    { querys: JSON.stringify(querys) }
  );
  return result.data.list.map(m => {
    updateFeatureProperties(m, layerid);
    // 坐标转换
    const { lat, lng } = GPS2Google2Baidu.BD_09_to_GCJ_02(
      m.lat_baidu,
      m.lng_baidu
    );
    // 转为GEOJSON
    return {
      id: m.ID,
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      },
      properties: m
    };
  });
}

/**
 * 添加要素
 * 若添加成功，则将要素的id更新
 * @param {*} layerid
 * @param {*} feature
 */
async function add(layerid, feature) {
  const model = modelToEntityKeyValue(feature.properties);
  const result = await axios.post(
    `/dataPages/${layerid}/Handler.ashx?action=update`,
    { model }
  );
  feature.id = result.data.newId;
  updateFeatureProperties(feature.properties, layerid);
}

/**
 * 更新要素
 * @param {*} layerid
 * @param {*} feature
 */
async function update(layerid, feature) {
  const model = modelToEntityKeyValue(feature.properties);
  await axios.post(`/dataPages/${layerid}/Handler.ashx?action=update`, {
    model,
    id: feature.id
  });
}

/**
 * 移除一组要素
 * @param {*} layerid
 * @param {Array<feature>} features
 */
async function remove(layerid, features) {
  await axios.get(`/dataPages/${layerid}/Handler.ashx?action=del`, {
    params: { ids: `[${features.map(f => f.id).join(",")}]` }
  });
}

/**
 * 为要素附加扩展属性和变换日期类型
 * @param {*} properties
 * @param {*} layerid
 */
function updateFeatureProperties(properties, layerid) {
  const addpropertys = propertys[layerid];
  const dfs = dateFields[layerid];
  // 附加属性
  addpropertys && Object.defineProperties(properties, addpropertys);
  // 日期类型转换
  for (let p in dfs) {
    const date = FromMSJsonString(properties[p]);
    if (date) {
      if (dfs[p] == "date") {
        properties[p] = DateFormat(date, "yyyy-MM-dd");
      } else if (dfs[p] == "time") {
        properties[p] = DateFormat(date, "hh:mm:ss");
      }
    }
  }
}

function modelToEntityKeyValue(m) {
  var ms = [];
  for (var p in m) {
    var v = m[p];
    if (v !== null) {
      var type = typeof v;
      //忽略函数类型
      if (type === "function") {
        continue;
      }
      //对于object类型，转为JSON字符串(日期类型除外)
      if (type === "object" && !(v instanceof Date)) {
        v = JSON.stringify(v);
      }
    }
    ms.push([p, v]);
  }
  return JSON.stringify(ms);
}

export default {
  get,
  add,
  update,
  remove,
  FromMSJsonString
};
