/**
 * @module poigroups图层接口
 */

import axios from '@/assets/js/axios';
import qs from 'qs';

/**
 * 统计poigroups销量
 */
export async function GetAreaYpData(pgId) {
    const url = '/dataPages/poigroups/Handler.ashx';
    const { data } = axios.get(url, {params: {
            action: 'GetAreaYpData',
            poigroupsID: pgId,
            _: new Date().getTime()
        }
    });
    return data;
}