import axios from '@/assets/js/axios';

var treeDataPromise;

/**
 * 获取行政区划和MA数据
 * @returns {Array<{key:string,text:string,parentid:string,value:{qxId?:number}}>}
 */
export async function getCityAndMATreeObj() {
    if (!treeDataPromise) {
        treeDataPromise = new Promise(async r => {
            const { data } = await axios.get('/dataPages/xzqh/Handler.ashx?action=getCityAndMATreeObj');
            // TODO:屏蔽了广东省以外的数据 目前只移除省级的
            const shieldDatas = data.filter(t => t.key.includes("province") && !t.key.includes("province_33"))
            for (let i = 0; i < shieldDatas.length; i++) {
                const shieldData = shieldDatas[i];
                const index = data.indexOf(shieldData);
                if (index > -1) {
                    data.splice(index, 1);
                }
            }
            r(data);
        });
    }
    return await treeDataPromise;
}

/**
 * 获取城市列表
 */
export async function getCitys() {
    const treedata = await getCityAndMATreeObj();
    return treedata.filter(t => t.value.cityid).map(t => ({ id: t.value.cityid, name: t.text }));
}

/**
 * 获取指定城市的MA列表
 * @param {*} cityid 
 */
export async function getMAByCity(cityid) {
    const treedata = await getCityAndMATreeObj();
    const pid = `allmacityid_${cityid}`;
    return treedata.filter(t => t.parentid == pid).map(t => ({ id: t.value.maId, name: t.text }));
}

/**
 * 获取行政区划
 * @param {*} divisionId 行政区划id
 */
export async function getDivision(divisionId) {
    const url = `/dataPages/xzqh/Handler.ashx?action=GetDivisionIdNames&pid=${divisionId}&_=${Date().valueOf()}`;
    const { data } = await axios.get(url);

    return data;
}