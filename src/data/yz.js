/**
 * @module 油站的专有业务
 */

import axios from '@/assets/js/axios';
import GPS2Google2Baidu from '@/assets/js/GPS2Google2Baidu';
import { propertys, dateFields } from '@/config/layer/fields';
import { FromMSJsonString, DateFormat } from '@/utils/date';

/**
 * 获取一组油站的销量历史信息
 * @param {Array<number>} ids 油站id集合
 * @returns {Array<Array<{}>>} 返回每个油站的销量历史信息
 */
export async function getSalesHistory (ids) {
    const url = `/dataPages/xyyz/Handler.ashx?action=getXlHistory`;
    const result = await axios.get(url, { params: { ids: ids.join(',') } });
    result.data.forEach(ds => {
        ds.forEach(d => {
            d['日期'] = FromMSJsonString(d['日期']);
            d['开始时间'] = FromMSJsonString(d['开始时间']);
        })
    });
    return result.data;
}

/**
 * 按多边形区域指定图层的油品统计信息
 * @param {'xyyz'|'shellyz'|'gsyz'} layerid 图层id
 * @param {Array<[number,number]>} polygon 多边形点集
 */
export async function getQualityByArea (layerid, polygon) {
    const url = `/dataPages/${layerid}/Handler.ashx?action=GetAreaYpData`;
    const result = await axios.get(url, {
        params:
        {
            points: polygon.map(([x, y]) => {
                const { lng, lat } = GPS2Google2Baidu.GCJ_02_to_BD_09(y, x);
                return `${lng},${lat}`;
            }).join(';')
        }
    });
    
    return result.data;
}

/**
 * 获取指定油站的历史信息
 * @param {*} id 油站id
 */
export async function getHistory (id) {
    const url = `/dataPages/xyyz/HistoryHandler.ashx`;
    const querys = [{ "field": "YZID", "relation": "=", "value": id, "type": "int" }];
    const { data } = await axios.get(url, { params:{querys: JSON.stringify(querys) }});

    const layerid = 'xyyz';
    const ps = propertys[layerid];
    const dfs = dateFields[layerid];

    return data.list.map(m => {
        // 附加属性
        ps && Object.defineProperties(m, ps);
        // 日期类型转换
        for (let p in dfs) {
            const date = FromMSJsonString(m[p]);
            if (date) {
                if (dfs[p] == 'date') {
                    m[p] = DateFormat(date, 'yyyy-MM-dd');
                }
                else if (dfs[p] == 'time') {
                    m[p] = DateFormat(date, 'hh:mm:ss');
                }
            }
        }
        m.UPDATETIME = DateFormat(FromMSJsonString(m.UPDATETIME),'yyyy-MM-dd')
        // 坐标转换
        const { lat, lng } = GPS2Google2Baidu.BD_09_to_GCJ_02(m.lat_baidu, m.lng_baidu);
        // 转为GEOJSON
        return {
            id: m.ID,
            geometry: {
                type: "Point",
                coordinates: [lng, lat]
            },
            properties: m
        }
    });
}

/**
 * 获取指定shell油站的销量车流信息
 * @param {*} feature 
 */
export async function getSales (feature) {
    const url = `/dataPages/shellyz/SalesHandler.ashx?`;
    const { data } = await axios.get(url, { params: { action: 'GetShellYZSales', yzbh: feature.properties['油站编号'] } });
    data.forEach(d => {
        d['CreateTime'] = FromMSJsonString(d['CreateTime']);
    })
    return data;
}

/**
 * 导入shell油站的销量车流数据表
 * @param {*} formData 包含一个Excel文件的表单
 * @returns {{succeed,update,count,errorString?}} 返回导入结果 
 */
export async function importSales (formData) {
    const url = `/dataPages/shellyz/execlSales.aspx`;
    formData.append('SheetName', 'sites data');
    const result = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return result.data;
}
/**
 * 获取油站的poi信息
 * @param @param {*} id 油站id
 */
export async function getPOIInfo (id) {
    const url = `/dataPages/poi/Handler.ashx?`;
    const res = await axios.get(url, { params: { action: 'GetPOIInfoByYzID', id } });
   return res.data
    
   
}
/**
 * 获取油站的周边信息
 * @param @param {*} id 油站id
 */
export async function getNearInfo (id) {
    ////dataPages/xyyz/Handler.ashx?action=getRim&id=14846&_=1585010815038
    const url = `/dataPages/xyyz/Handler.ashx?`;
    const res = await axios.get(url, { params: { action: 'getRim', id } });
   return res.data
    
   
}