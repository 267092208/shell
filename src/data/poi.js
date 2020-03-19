/**
 * @module poi图层接口
 */

import axios from '@/assets/js/axios';
import qs from 'qs';

/**
 * 获取覆盖油站列表 by poiId
 * @param {number} id poiId 
 */
export async function getYzListByid(id) {
    const url = `/dataPages/poi/Handler.ashx?action=GetYzsByPoiId&id=${id}&_=${new Date().getTime()}`
    const { data } = await axios.get(url);

    return data;
}

/**
 * 往该poi添加覆盖的油站 with yzNum and id
 * @param {number} id           poiId
 * @param {number} yzNum  油站编号
 */
export async function addYzToPoi(id, yzNum) {
    const url = `/dataPages/poi/Handler.ashx?action=AddYzToPoi`
    const { data } = await axios.post(url, qs.stringify({
        id,
        bh: yzNum
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded'} })

    return data;
}

/**
 * 删除poi覆盖的油站 with yids and id
 * @param {number} id poiId
 * @param {Array<number>} yids 删除的油站id数组
 */
export async function delYzInPoi(id, yids) {
    const url = `/dataPages/poi/Handler.ashx?action=DelYzInPoi`;
    const { data } = await axios.post(url, qs.stringify({
        id,
        yids: JSON.stringify(yids)
    }))

    return data;
}


