import axios from "@/assets/js/axios";
import layerData from "@/data/layer";

/**
 * 查询指定要素的关联要素的数据
 * @param {*} layerid
 * @param {query[]} querys
 */
async function getRelations(layerid, querys) {
  let result = null;
  if (querys.type === "relation") {
    result = await axios.post(`/dataPages/${layerid}/Handler.ashx?action=getRelations`, { id: querys.id });
  }
  if (querys.type === "competitor") {
    result = await axios.post(`/dataPages/${layerid}/Handler.ashx?action=getCompetitors`, { id: querys.id });
  }
  let dataList = result.data;

  return dataList.map(m => {
    // updateFeatureProperties(m, layerid);

    return layerData.rectify(m, layerid);
  });
}

/**
 * 移除一组关联要素
 * @param {*} layerid
 * @param {Array<feature>} features
 */
export async function removeRelation(layerid, feature, delFeatures,type) {
  const id = feature.id;
  let formdata = new FormData();
  formdata.append("id", id);

  formdata.append("bhs", delFeatures.map(f => f["properties"]["油站编号"]).join(";"));

  if (type === "relation") {
    await axios.post(`/dataPages/${layerid}/Handler.ashx?action=delRelations`, formdata, { headers: { "Content-Type": "multipart/form-data" } });

  }
  if (type === "competitor") {
    await axios.post(`/dataPages/${layerid}/Handler.ashx?action=delCompetitors`, formdata, { headers: { "Content-Type": "multipart/form-data" } });

  }
}
/**
 * 添加一个关联要素
 * @param {*} layerid
 * @param {Array<feature>} features
 */
export async function addRelation(layerid, feature, bh,type) {
  const id = feature.id;
  let formdata = new FormData();
  formdata.append("id", id);

  formdata.append("bh", bh);
  
  if (type === "relation") {
    await axios.post(`/dataPages/${layerid}/Handler.ashx?action=addRelation`, formdata, { headers: { "Content-Type": "multipart/form-data" } });

  }
  if (type === "competitor") {
    await axios.post(`/dataPages/${layerid}/Handler.ashx?action=addCompetitors`, formdata, { headers: { "Content-Type": "multipart/form-data" } });

  }
}

export default {
  getRelations,
  removeRelation,
  addRelation
};
