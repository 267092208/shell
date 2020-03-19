/**
 * @module 图层Excel数据导入导出功能
 */

import axios from '@/assets/js/axios';
import qs from 'qs';
import { downloadFileByATag } from '@/assets/js/utils';
/**
 * 导入图层数据
 * @param {string} layerid 图层ID
 * @param {FormData} formData 含有一个Excel文件的表单
 * @returns {{succeed:number,update:number,history:number,count:number,errorString:string}} 成功导入的数量、更新的数量、更新的历史记录数量、Excel数据总量、错误信息
 */
export async function importExcel(layerid, formData) {
    formData.append('SheetName', 'Survey-油站数据录入');
    const url = `/dataPages/${layerid}/execl.aspx`;
    const result = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return result.data;
}

/**
 * 导出图层数据
 * @param {string} layerid 图层ID
 * @param {Array<query>} querys 要导出的数据查询条件
 * @returns {string} 返回Excel文件下载地址
 */
export async function outputExcel(layerid, querys) {
    const url = `/dataPages/${layerid}/Handler.ashx?action=ExportExcel`;
    const result = await axios.post(url, { querys: JSON.stringify(querys) });
    return result.data.path;
}

/**
 * 导出图层数据action === ExportData
 * @param {string} layerid 图层ID
 * @param {Array<query>} querys 要导出的数据查询条件
 * @returns {string} 返回Excel文件下载地址
 */
export async function outputExcelData(layerid, querys) {
    const url = `/dataPages/${layerid}/Handler.ashx?action=ExportData`;
    const {data} = await axios.post(url, { querys: JSON.stringify(querys) });
    console.log(typeof data, new Blob([data]))
    const blob = new Blob([data]); 


    var blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl);
    downloadFileByATag(blobUrl, `${layerid}${new Date().getTime()}.xlsx`)
    window.URL.revokeObjectURL(blobUrl)
    return data;
}



/**
 * 图层批量更新导入
 * @param {string} layerid 图层ID
 * @param {FormData} formData 含有一个Excel文件的表单
 * @returns {{update:number,errorcont:number,errorString:string}} 更新的记录数、错误数量、错误信息
 */
export async function importExcelBatch(layerid, formData) {
    const url = `/dataPages/${layerid}/Handler.ashx?action=ImportExcelFile`;
    const result = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return result.data;
}

/**
 * 图层批量导出
 * @param {string} layerid 图层ID
 * @param {string[]} fields 要导出的字段名数组
 * @param {string} nameprefix 要导出的Excel文件名称
 * @param {Array<query>} querys 数据筛选条件
 */
export async function outputExcelBatch(layerid, fields, nameprefix, querys) {
    const params = {
        action: 'ExportExcelByFieldsWithData',
        fields: JSON.stringify(fields),
        nameprefix,
        querys: JSON.stringify(querys)
    }
    const querystring = serializParams(params);
    const url = `/dataPages/${layerid}/Handler.ashx?${querystring}`;
    return url;
}

/**
 * 图层的导入| ma图层ranking导入
 * @param {string} layerid 图层ID
 * @param {FormData} formData 含有一个Excel文件的表单
 * @returns {{succeed:number,update:number,count:number,errorString:string}} 成功导入的数量、更新的数量、更新的历史记录数量、Excel数据总量、错误信息
 */
export async function importExcelForAnyOne(layerid, formData) {
    let url = `/dataPages/${layerid}/execl.aspx`;
    if (
        (layerid === "xyyz") |
        (layerid === "shellyz") ||
        layerid === "gsyz") {
        formData.append('SheetName', 'Survey-油站数据录入');
    } else if (layerid === 'ma') { formData.append("SheetName", "Result结果"); }
    else if(layerid === 'poigroups') {
        url = '/dataPages/poigroups/excel.aspx';
        formData.append('SheetName', 'Sheet1');
    }
    else { // nit | gsnti
        formData.append('SheetName', 'Sheet1');
    }
    const result = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return result.data;
}

/**
 * 图层的导入| ma图层ranking导入
 * @param {FormData} formData 含有一个Excel文件的表单
 * @returns {{succeed:number,update:number,count:number,errorString:string}} 成功导入的数量、更新的数量、更新的历史记录数量、Excel数据总量、错误信息
 */
export async function importExcelForRanking(formData) {
    formData.append("SheetName", "Result结果");
    formData.append('type', 'rkall');
    const url = `/dataPages/ma/execl.aspx`;
    const result = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return result.data;
}

/**
 * 图层的导入| ma图层经济导入
 * @param {FormData} formData 含有一个Excel文件的表单
 * @returns {{succeed:number,update:number,count:number,errorString:string}} 成功导入的数量、更新的数量、更新的历史记录数量、Excel数据总量、错误信息
 */
export async function importExcelForJJ(formData) {
    formData.append("SheetName", "经济数据 by MA");
    formData.append('type', 'jjall');
    const url = `/dataPages/ma/execl.aspx`;
    const result = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return result.data;
}
/**
 * ma附件上传
 * @param {string} featureId 要素ID
 * @param {FormData} formData 含有一个Excel文件的表单
 * @return {{newId: number}} 成功导入
 */
export async function importFile(featureId, formData) {
    formData.append('action', 'Upload')
    formData.append('m', JSON.stringify({ MAID: featureId }));
    const url = '/dataPages/ma/FileHandler.ashx';
    const result = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    return result.data;
}

/**
 *  baiduSearchResult导入到poi
 * @param {} params 
 */
export async function ImportFromBaiduSearch(poiType, searchResults) {
    const url = '/datapages/poi/handler.ashx';
    const { data } = await axios.post(url, qs.stringify({
        action: 'ImportFromBaiduSearch',
        poiType,
        searchResults: JSON.stringify(searchResults)
    }))

    return data;
}

/**
 * 将参数序列化为querystring
 * @param {*} params 
 */
function serializParams(params) {
    const ps = [];
    for (const key in params) {
        const val = params[key];
        if (val !== null || typeof val !== 'undefined') {
            ps.push(encode(key) + '=' + encode(val));
        }
    }
    return ps.join('&');
}

function encode(val) {
    return encodeURIComponent(val).
        replace(/%40/gi, '@').
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
}
