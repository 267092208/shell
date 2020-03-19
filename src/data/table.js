/**
 * @module tableView 的专有业务
 */
import axios from '@/assets/js/axios';
import qs from 'qs';
import { update, remove, modelToEntityKeyValue, updateItemForJj, updateItemForRk } from './layer'
import layerData, { outputExcel } from './layerExcelIO'

/*-------------- ma ------------ */
/**
 * 获取keyValues<maid, ma名称>
 */
async function getKeyValues() {
    const url = `/dataPages/ma/Handler.ashx`;
    const { data } = await axios.get(url, {
        params: {
            action: 'getKeyValues',
            keyName: 'id',
            valueName: '名称',
            _: new Date().getTime()
        }
    });

    return data;
}

/**
 * 获取ranking table filed
 */
async function getRankingFields() {
    const url = `/dataPages/ma/RkListHandler.ashx`;
    const { data } = await axios.post(url, qs.stringify({
        action: 'GetFieldInfo',
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return data;
}

/**
 * 获取ranking table Datas
 */
async function getRankingDatas() {
    const url = `/dataPages/ma/RkListHandler.ashx?querys=[]`
    const { data } = await axios.post(url, null, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return data;
}

/**
 * 获取油品信息 table Datas
 */
async function getYpDatas() {
    const url = `/dataPages/ma/Handler.ashx?action=getypList&pagenum=0&pagesize=56&_=${new Date().getTime()}`;
    const { data } = await axios.get(url);

    return data;
}

/**
 * 获取经济信息 table filed
 */
async function getJjListFields() {
    const url = `/dataPages/ma/JjListHandler.ashx`;
    const { data } = await axios.post(url, qs.stringify({
        action: 'GetFieldInfo',
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return data;
}

/**
 * 获取经济信息 table Datas
 */
async function getJjListDatas() {
    const url = `/dataPages/ma/JjListHandler.ashx?querys=[]`
    const { data } = await axios.post(url, null, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return data;
}

/*-------------- ma ------------ */
/**
 * 获取tableFields
 * @param {number} layerId 图层id
 */
async function getFields(layerId) {
    const url = `/dataPages/${layerId}/Handler.ashx`
    const { data } = await axios.post(url, qs.stringify({ action: 'GetFieldInfo' }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return data;
}

/*------------ corridor -------- */
async function getCorridorTrafficFields() {
    const url = `/dataPages/corridor/TrafficHandler.ashx`;
    const { data } = await axios.post(url, qs.stringify({ action: 'GetFieldInfo' }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return data;
}

async function getCorridorTrafficDatas() {
    const url = `/dataPages/corridor/TrafficHandler.ashx?querys=[]`;
    const { data } = await axios.post(url)

    return data.list;
}

/**
 * 删除traffic 多行数据
 * @param {Array<row>} rows 
 */
async function delCorridorTrafficDatas(rows) {
    const url = `dataPages/corridor/TrafficHandler.ashx`;
    const { data } = await axios.post(url, qs.stringify({ action: 'del', ids: `[${rows.map(({ ID }) => ID).join(',')}]` }))

    return data;
}

/**
 * 更新 traffic one row
 * @param {number} id traffic id
 * @param {Object} model 提交的数据
 */
async function updateCorridorTranffic(id, model) {
    const url = `/dataPages/corridor/TrafficHandler.ashx`
    console.log(model);
    const { data } = await axios.post(url, qs.stringify({
        action: 'update',
        ID: id,
        model: modelToEntityKeyValue(model)
    }))

    return data;
}

/**
 *  获取表格数据集
 * @param {string} layerId 
 * @param {Arrary[query]} querys 
 * @param {formData} formData 
 */
async function getTableDatas(layerId, querys, formData) {
    let res;
    let url = `dataPages/${layerId}/Handler.ashx?querys=${JSON.stringify(querys)}`;
    switch (layerId) {
        case 'traffic': {
            url = `/dataPages/corridor/TrafficHandler.ashx?querys=${JSON.stringify(querys)}`;
        } // go down
        default: {
            res = await axios.post(url, formData, { 'Content-Type': 'application/x-www-form-urlencoded' });
            if ('Error' in res.data) res = res.data;
            else res = res.data.list;
        }
    }
    return res
}
/**
 *  update table 
 * @param {string} layerId 图层id
 *  @param {number} id 更新id 或者 MA年份
 * @param {freature} row 更新行
 */
async function updateTableForRow(layerId, id, row) {
    let res;
    switch (layerId) {
        case 'RANKING':
            res = await updateItemForRk(id, (row));
            break;
        case '油品信息': // hasn't this
            break;
        case '经济数据':
            res = await updateItemForJj(id, (row))
            break;
        case 'traffic':
            res = await updateCorridorTranffic(id, row);
            break;
        default: {
            res = await update(layerId, {
                properties: row,
                id: id
            });
            break;
        }
    }
    return res;
}
/**
 *  delete table 
 * @param {string} layerId 图层id
 *  @param {number} id 更新id 或者 MA年份
 * @param {Array<row>} rows 删除行
 */
async function delTableForRow(layerId, rows) {
    let res;
    let url = `dataPages/${layerId}/Handler.ashx`;
    switch (layerId) {
        case 'traffic':
            res = await delCorridorTrafficDatas(rows);
        default: {
            res = await axios.post(url, qs.stringify({ action: 'del', ids: `[${rows.map(({ ID }) => ID).join(',')}]` }), { 'Content-Type': 'application/x-www-form-urlencoded' });
            res = res.data;
        }
    }
    return 'del' in res ? true : res.Msg;
}
/**
 * 获取完整的table filed list
 * @param {string} id 获取table完整id 
 */
async function getTableFields(id) {
    switch (id) {
        case 'RANKING':
            res = await getRankingFields();
            break;
        case '油品信息':
            res = await getYpDatas().then(({ data }) => data[0]);
            break;
        case '经济数据':
            res = await getJjListFields()
            break;
        case 'traffic':
            res = await getCorridorTrafficFields();
            break;
        default: {
            res = await getFields(id);
        }
    }
}

async function exportTable(layerId, model) {
    let res = null;
    switch (layerId) {
        case 'RANKING': {
            const url = `/ExcelExtHandler2.ashx`;
            const { data } = await axios.post(url, qs.stringify({
                column: JSON.stringify(model.column),
                data: JSON.stringify(model.data),
                excelName: 'Ranking数据导出表',
                sheetName: 'Ranking数据导出表'
            }))
            res = data;
        }
            break;
        case '油品信息': {
            const url = `/ExcelExtHandler2.ashx`;
            const { data } = await axios.post(url, qs.stringify({
                column: JSON.stringify(model.column),
                data: JSON.stringify(model.data),
                excelName: '油品信息导出表',
                sheetName: '油品信息导出表'
            }))
            res = data;
        }
            break;
        case '经济数据': {
            const url = `/ExcelExtHandler2.ashx`;
            const { data } = await axios.post(url, qs.stringify({
                column: JSON.stringify(model.column),
                data: JSON.stringify(model.data),
                excelName: '经济数据导出表',
                sheetName: '经济数据导出表'
            }))
            res = data;
        }
            break;
        default: {
            res = await outputExcel(layerId, model.querys);
        }
    }

    return res;
}

export async function updateLocation(ID, lng, lat) {
    const url = `/dataPages/xyyz/Handler.ashx?action=updateLocation&ID=${ID}&lng=${lng}&lat=${lat}&_=${new Date().getTime()}`;
    const { data } = await axios.get(url);

    return data;
}



export default {
    getRankingFields,
    getKeyValues,
    getRankingDatas,
    getYpDatas,
    getJjListFields,
    getJjListDatas,
    getFields,
    getCorridorTrafficFields,
    getCorridorTrafficDatas,
    updateTableForRow,
    getTableFields,
    getTableDatas,
    delTableForRow,
    exportTable,
    updateLocation
}

