import axios from "@/assets/js/axios";
import layerData from "@/data/layer";


/**
 * 查询指定要素的关联要素的数据
 * @param {*} layerid
 * @param {query[]} querys
 */
async function getRelations(layerid, querys) {
    const result = await axios.post(`/dataPages/${layerid}/Handler.ashx?action=getRelations`, { id: querys.id });
   return result.data;
}



export default {
  getRelations,
 
};
