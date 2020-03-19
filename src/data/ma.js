/**
 * @module ma的专有业务
 */

import axios from '@/assets/js/axios';
import qs from 'qs';
/**
 * 获取ranking year list by maid
 * @param {number} maid
 * @return {Array<number>} yearList
 */
export async function getRankingYearList(maid) {
    const url = '/dataPages/ma/MaRankingHandler.ashx?action=getYearList&maid=' + maid;
    const result = await axios.post(url);

    return result.data;
}

/**
 * 获取ranking fields
 * @return {Array<{FieldName: String, DisplayText: String, Type: String}>}
 */
export async function getRankingFields() {
    const url = '/dataPages/ma/MaRankingHandler.ashx?action=GetFieldInfo';
    const result = await axios.post(url)

    return result.data;
}

/**
 * 获取ranking数据 with year by Maid
 * @param {number} Maid 
 * @param {number} year
 */
export async function getRankingDataWithYear(Maid, year) {
    const url = '/dataPages/ma/MaRankingHandler.ashx';
    const querys = [{ "field": "Maid", "value": Maid, "relation": "=", "type": "int" }, { "field": "年份", "value": year, "relation": "=", "type": "int" }]
    const { data } = await axios.get(url, { params: { querys: JSON.stringify(querys) } });

    return data.list;
}

/**
 * 创建新的年度ranking with maid by year
 * @param {number} Maid 
 * @param {number} year
 */
export async function createRankingByYear(maid, year) {
    const url = `/dataPages/ma/MaRankingHandler.ashx?action=createNewJj&maid=${maid}&year=${year}`;
    const { data } = await axios.post(url);

    return data;
}

/**
 * 获取经济信息 year list by maid
 * @param {number} maid
 * @return {Array<number>} yearList
 */
export async function getEconomicYearList(maid) {
    const url = '/dataPages/ma/MajjHandler.ashx?action=getYearList&maid=' + maid;
    const result = await axios.post(url);

    return result.data;
}

/**
 * 获取经济信息 fields
 * @return {Array<{FieldName: String, DisplayText: String, Type: String}>}
 */
export async function getEconomicFields() {
    const url = '/dataPages/ma/MajjHandler.ashx?action=GetFieldInfo';
    const result = await axios.post(url)

    return result.data;
}

/**
 * 获取经济信息 with year by Maid
 * @param {number} Maid 
 * @param {number} year
 */
export async function getEconomicDataWithYear(Maid, year) {
    const url = '/dataPages/ma/MajjHandler.ashx';
    const querys = [{ "field": "Maid", "value": Maid, "relation": "=", "type": "int" }, { "field": "年份", "value": year, "relation": "=", "type": "int" }]
    const { data } = await axios.get(url, { params: { querys: JSON.stringify(querys) } });

    return data.list;
}

/**
 * 创建新的年度经济信息 with maid by year
 * @param {number} Maid 
 * @param {number} year
 */
export async function createEconomicByYear(maid, year) {
    const url = `/dataPages/ma/MajjHandler.ashx?action=createNewJj&maid=${maid}&year=${year}`;
    const { data } = await axios.post(url);

    return data;
}

/**
 * 获取MAyp数据 by maid
 * @param {number | Array<number>} maid [maid]
 */
export async function getMAypData(maid) {
    const url = '/dataPages/ma/Handler.ashx'
    if (maid instanceof Array) {
        const { data } = await axios.get(url, { params: {
            action: 'getMAypDataMulti',
            ids: JSON.stringify(maid),
            _: new Date().getTime()
        }})
        return data;
    } else {
         const { data } = await axios.get(url, { params: {
             action: 'getMAypData',
             id: maid,
             _: new Date().getTime()
        }});
        return data;
    }
}

/**
 * 获取附件列表
 * @param {number} maid
 * @return {Array<{ID:number, Name:String, Type:String, Date: ,MAID:number, UserName:String, Roles:null, Url:String}>}
 */
export async function getAttachmentList(maid) {
    const url = `/dataPages/ma/FileHandler.ashx?action=GetByMa&id=${maid}&_=${new Date().getTime()}`
    const { data } = await axios.get(url);

    return data;
}

/**
 * 获取目标附近的权限 by id
 * @param {number} id 目标文件的id
 * @return {{result: String}}
 */
export async function getFileRole(id) {
    const url = `/dataPages/ma/FileHandler.ashx?action=GetMaResRole&id=${id}`
    const { data } = await axios.post(url);

    return data;
}

/**
 * 更新目标文件权限 by id
 * @param {number} id 目标文件的id
 * @param {'["NP","BD"]' | '[]'} rnames role
 * @return {{update: boolean}}
 */
export async function updateFileRole(id, rnames) {
    const url = `/dataPages/ma/FileHandler.ashx?action=UpdateMaResRole&id=${id}&rnames=${rnames}`
    const { data } = await axios.post(url);

    return data;
}

/**
 * 删除附件文件列表 by 文件ids
 * @param {Array<number>} ids 文件列表id数组
 */
export async function delFileList(ids) {
    const url = `/dataPages/ma/FileHandler.ashx?action=del&ids=${JSON.stringify(ids)}&_=${new Date().getTime()}`
    const { data } = await axios.get(url);

    return data;
}

/**
 * 获取网址收藏的网址信息
 * @param {number} maid
 */
export async function getUrlList(maid) {
    const url = `/dataPages/ma/UrlHandler.ashx?action=GetByMaID&id=${maid}`;
    const { data } = await axios.post(url);

    return data;
}

/**
 * 收藏url信息
 * @param {Object: {MaID:number, Name:String, Url:String, Remark:String}} model
 */
export async function saveUrlInfo(model) {
    let url = `/dataPages/ma/UrlHandler.ashx`
    const { data } = await axios.post(url, qs.stringify({
        action: 'AddModel',
        model: JSON.stringify(model)
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    return data;
}

/**
 * 删除url信息
 * @param {number} urlId 网址收藏项的id
 */
export async function delUrlInfo(urlId) {
    const url = `/dataPages/ma/UrlHandler.ashx`
    const { data } = await axios.get(url, { params: { action: 'del', id: urlId, _: new Date().getTime() } })

    return data;
}
