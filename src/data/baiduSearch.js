/**
 * @module 百度地图搜索服务
 */
import gcoord from "gcoord";
/**
 * EPSG3857 坐标系
 * 在指定的区域执行关键字搜索
 * @param {string} keyword 
 * @param {[number,number,number,number]} extent 范围[minx,miny,maxx,maxy] 是
 * @returns {AsyncIterable<Feature>} 返回可异步迭代的要素结果集 返回的 EPSG3857 
 */
async function search(keyword, extent) {
    const pageCapacity = 50;/*单页最多支持50个结果*/
    let [minx, miny, maxx, maxy] = extent;
    let centerPoint = [(minx + maxx) / 2, (miny + maxy) / 2]
    centerPoint = gcoord.transform(centerPoint, gcoord.EPSG3857, gcoord.BD09);
    const ls = new BMap.LocalSearch(new BMap.Point(centerPoint[0], centerPoint[1]), { pageCapacity });
    const iterator = {};
    let currentResult = new Promise(r => {
        ls.setSearchCompleteCallback(result => {
            iterator.count = result.getNumPois();
            r(result);
        });
    });
    let i = 0;
    const [minx1, miny1] = gcoord.transform([minx, miny], gcoord.EPSG3857, gcoord.BD09);
    const [maxx1, maxy1] = gcoord.transform([maxx, maxy], gcoord.EPSG3857, gcoord.BD09);
    ls.searchInBounds(keyword, new BMap.Bounds(new BMap.Point(minx1, miny1), new BMap.Point(maxx1, maxy1)));
    await currentResult;
    iterator[Symbol.asyncIterator] = () => {
        return {
            async next() {
                let result = await currentResult;
                if (i >= result.getNumPois()) {
                    return { done: true };
                }
                if (i >= (result.getPageIndex() + 1) * pageCapacity) {
                    ls.gotoPage(result.getPageIndex() + 1);
                    currentResult = new Promise(r => {
                        ls.setSearchCompleteCallback(result => r(result));
                    });
                    result = await currentResult;
                }
                const index = i % pageCapacity;
                const poi = result.getPoi(index);
                i++;
                return {
                    done: false,
                    value: {
                        geometry: {
                            type: "Point",
                            coordinates: gcoord.transform([poi.point.lng, poi.point.lat], gcoord.BD09, gcoord.EPSG3857)
                        },
                        properties: {
                            title: poi.title,
                            address: poi.address,
                            phoneNumber: poi.phoneNumber,
                            tags: poi.tags instanceof Array ? poi.tags.join('/') : '',
                            url: poi.url
                        }
                    }
                };
            }
        }
    }

    return iterator;
}

export async function getBoundaryByBoundaryName(province, city, country) {
    const boundaryName = province + city + country; console.log(boundaryName)
    const bdary = new BMap.Boundary();
    const res = await new Promise((resolve, reject) => {
        bdary.get(boundaryName, data => {
            if (
                data.boundaries instanceof Array &&
                data.boundaries.length > 0
            ) {
                console.log(data.boundaries)
                resolve(data.boundaries);
            }
            reject([]);
        })
    })
    return res;
}
export default search;