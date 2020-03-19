/**
 * @module roadnetwork
 */

import axios from '@/assets/js/axios';
import qs from 'qs';

/**
 * 获得路网要素的行政区划
 * @param {number} id 路网要素Id 
 */
export async function GetWayToDivision(id) {
    const url = '/dataPages/roadnetwork/Handler.ashx';
    const { data } = await axios.get(url, { params: {
        action: 'GetWayToDivision',
        id,
        _: new Date().getTime()
    }})

    return data;
}