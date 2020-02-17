import Vue from 'vue'
export var map;
var mapLoadedPromise;
// user: state => state.user.user
const mixin = {

    methods: {
        /**
         * 初始化地图
         */
        async initMap() {
            if (map) throw "map 已经初始化过";
            map = HTmap.map(this.$refs.mapbox, {
                ...this.getMapState(),
                maxZoom: 18,
                minZoom: 1
            });
            this.initMapStateSave();
            this.keepFitBoundsZoomInt();
            map._map.doubleClickZoom.disable();
            map._map.dragRotate.enable();
            console.log(map)
            // this.logStyleimagemissing();
        },
        /**
         * 在使用fitBounds(setBounds)时保持zoom为整数防止切片缩放模糊
         */
        keepFitBoundsZoomInt() {
            /// TODO:通过修改mapboxgl的方法实现zoom保持整数
            const _cameraForBoxAndBearing = map._map._cameraForBoxAndBearing;
            map._map._cameraForBoxAndBearing = function (...args) {
                const result = _cameraForBoxAndBearing.apply(this, args);
                result.zoom = result.zoom | 0;
                return result;
            }
        },
        /**
         * 保存地图的状态
         */
        initMapStateSave() {
            window.addEventListener("beforeunload", () => {
                Vue.ls.set("currentZoom", map.getZoom());
                Vue.ls.set("currentCenter", map.getCenter());
            });
        },
        /**
         * 获取地图的状态
         */
        getMapState() {
            const center = Vue.ls.get("currentCenter") || { x: 113.24, y: 23.11 }
            const zoom = (Vue.ls.get("currentZoom") | 0) || 8
            return { center, zoom }
        },
        logStyleimagemissing() {
            map.on("styleimagemissing", t => {
                console.log(t)
            });
        },
        /**
         * 地图初始化完毕
         * @returns {Promise}
         */
        mapLoaded() {
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
    }
}

export default mixin;