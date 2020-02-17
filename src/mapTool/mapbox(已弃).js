import Vue from 'vue'
import ls from '@/utils/localStorage.js';
Vue.use(ls.Storage, ls.options);
let map = null;
let beforeunloadEve = null;
let popup = null;

/**
 * 此函数只能调用一次
 * 定义刷新保存 当前 中心点 和 缩放等级
 * @param {HTMLElement | string} container 
 */
function intiMap(container, options) {
    if (map) {
        throw "map 已经初始化过";
    }
    const center = Vue.ls.get("currentCenter") || { x: 113.24, y: 23.11 }
    const zoom = Vue.ls.get("currentZoom") || 8
    map = HTmap.map(container, Object.assign({
        zoom,
        center,
        maxZoom: 18,
        minZoom: 1
    }, options))
    map.on("styleimagemissing", t => {
        console.log(t)
    })
    // map.on("sourcedata", t => {
    //     console.log(t.sourceId, t.isSourceLoaded)
    // })
    // map.on("click", (t) => {
    //     console.log(t)
    // })
    if (!beforeunloadEve) {
        // 刷新保存 当前 中心点 和 缩放等级
        window.addEventListener("beforeunload", beforeunloadEve = () => {
            Vue.ls.set("currentZoom", map.getZoom());
            Vue.ls.set("currentCenter", map.getCenter());
        });
    }
    return map;
}

var mapLoadedPromise;
/**
 * 等待地图首次加载完毕
 */
function mapLoaded() {
    if (!mapLoadedPromise) {
        mapLoadedPromise = new Promise(r => {
            if (map.loaded()) {
                console.log('map.loaded() = true');
                r();
            }
            else {
                map.on('load', () => {
                    console.log('map load event');
                    r();
                });
            }
        })
    }
    return mapLoadedPromise;
}

export {
    map,
    intiMap,
    popup,
    mapLoaded
};
