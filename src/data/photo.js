/**
 * @module 要素照片管理接口
 */

/// TODO:要素照片管理接口目前仅针对油站层硬编码

import axios from "@/assets/js/axios";

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
