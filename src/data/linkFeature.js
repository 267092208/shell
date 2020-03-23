import axios from "@/assets/js/axios";
import layerData from "@/data/layer";

/**
 * 查询指定要素的关联要素的数据
 * @param {*} layerid
 * @param {query[]} querys
 */
async function getRelations(layerid, querys) {
  const result = await axios.post(`/dataPages/${layerid}/Handler.ashx?action=getRelations`, { id: querys.id });
  let dataList = result.data;

  return dataList.map(m => {
    // updateFeatureProperties(m, layerid);

    return layerData.rectify(m, layerid);
  });
}

/**
 * 添加要素
 * 若添加成功，则将要素的id更新
 * @param {*} layerid
 * @param {*} feature
 */
async function addRelations(layerid, feature) {
  const id = feature.id;

  ///dataPages/xyyz/Handler.ashx?action=addRelation
  await axios.post(`/dataPages/${layerid}/Handler.ashx?action=addRelation`, { id }).catch(e => {
    console.log(e);
  });
}

/**
 * 移除一组要素
 * @param {*} layerid
 * @param {Array<feature>} features
 */
export async function removeRelation(layerid, feature, delFeatures) {
  const id = feature.id;
  //bhs: 测试00001;1;GZ.BY001
  let formdata = new FormData();
  formdata.append("id", id);
  
  formdata.append("bhs", delFeatures.map(f => f["properties"]["油站编号"]).join(";"));
  await axios.post(`/dataPages/${layerid}/Handler.ashx?action=delRelations`, formdata, { headers: { "Content-Type": "multipart/form-data" } });


}

export default {
  getRelations,
  addRelations,
  removeRelation
};
