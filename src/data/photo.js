/**
 * @module 要素照片管理接口
 */

/// TODO:要素照片管理接口目前仅针对油站层硬编码

import axios from "@/assets/js/axios";
import qs from 'qs';

/**
 * 指定图层要素的照片列表(最新年份的)
 * @param {*} feature
 * @param {*} layerid
 * @returns {string[]} 返回照片url列表
 */
export async function getPhotos(feature, layerid) {
  const url = `/dataPages/xyyz/Handler.ashx?action=getPhotoListByBh&bh=${feature.properties["油站编号"]}`;
  const result = await axios.get(url);
  return result.data;
}

/**
 * 指定图层要素的照片列表(历年)
 * @param {*} feature
 * @param {*} layerid
 * @returns {{[year:number]:string[]}} 返回历年的照片列表
 */
export async function getPhotoHis(feature, layerid) {
  const url = `/dataPages/xyyz/Handler.ashx?action=getAllPhotoListByBh&bh=${feature.properties["油站编号"]}`;
  const result = await axios.get(url);
  const phs = {};
  for (let t of result.data) {
    let year = 0;
    let p = t.split("/");
    let f = p[p.length - 1];
    year = parseInt(f.substring(0, 4));
    if (year <= 2013) {
      year = 2013;
    }
    phs[year] = phs[year] || [];
    phs[year].push(t);
  }
  return phs;
}

/**
 * 上传一张照片
 * @param {*} feature
 * @param {*} layerid
 * @param {*} fromData 包含一张照片文件的表单
 * @returns {string} 返回成功上传照片的url
 */
export async function uploadPhoto(feature, layerid, fromData) {
  const url = `/dataPages/xyyz/uploadPhoto.aspx?bh=${feature.properties["油站编号"]}`;
  const result = await axios.post(url, fromData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return result.data.Name;
}

/**
 * 删除要素的一组照片
 * @param {*} feature
 * @param {*} layerid
 * @param {string[]} urls 照片的url
 */
export async function deletePhoto(feature, layerid, urls) {
  const url = `/dataPages/xyyz/Handler.ashx?action=delPhoto`;
  await axios.post(url, {
    bh: feature.properties["油站编号"],
    pics: urls.join(";")
  });
}

/**
 * 通用图片上传接口
 * @param {string} layerId 图层id
 * @param {number} featureId 要素Id
 * @param {*} formData 
 */
export async function generalUploadPhoto(layerId, featureId, formData) {
  formData.append('action', 'UploadPhoto');
  formData.append('id', featureId)
  const url = `/dataPages/${layerId}/Handler.ashx`
  const { data } = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data", "Accept": 'image/*' }
  })
  
  return data;
}

/**
 *  获取商圈图片列表 通过商圈 id
 * @param {number} sqId 商圈id 
 */
export async function getPhotoListForSQ(sqId) {
  const url = '/dataPages/sq/Handler.ashx';
  const  { data } = await axios.post(url, qs.stringify({
    action: 'GetPhotoListByBh',
    id: sqId
  }))
  return data;
}

/**
 * 删除目标商圈的图片 by id and src
 * @param {number} sqId 商圈id 
 * @param {string} src 图片路径 
 */
export async function delPhotoForSQ(sqId, src) {
  const url = `/dataPages/sq/Handler.ashx`;
  const { data } = await axios.post(url, qs.stringify({
    action: 'DelPhoto',
    id: sqId,
    pics: src
  }));

  return data;
}