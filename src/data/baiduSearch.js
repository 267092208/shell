/**
 * @module 百度地图搜索服务
 */

/**
 * 在指定的区域执行关键字搜索
 * @param {string} keyword 
 * @param {[number,number,number,number]} extent 范围[minx,miny,maxx,maxy]
 * @returns {AsyncIterable<Feature>} 返回可异步迭代的要素结果集
 */
async function search (keyword, extent) {
    const pageCapacity = 50;/*单页最多支持50个结果*/
    const ls = new BMap.LocalSearch('广州市', { pageCapacity });
    const [minx, miny, maxx, maxy] = extent;

    const iterator = {};

    let currentResult = new Promise(r => {
        ls.setSearchCompleteCallback(result => {
            iterator.count = result.getNumPois();
            r(result);
        });
    });

    let i = 0;
    ls.searchInBounds(keyword, new BMap.Bounds(new BMap.Point(minx, miny), new BMap.Point(maxx, maxy)));

    await currentResult;

    iterator[Symbol.asyncIterator] = () => {
        return {
            async next () {
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
                            coordinates: [poi.point.lng, poi.point.lat]
                        },
                        properties: {
                            title: poi.title,
                            address: poi.address,
                            phoneNumber: poi.phoneNumber,
                            url: poi.url
                        }
                    }
                };
            }
        }
    }

    return iterator;
}

export default search;