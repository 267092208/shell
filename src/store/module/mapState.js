import Vue from 'vue'

const mapState = {
    state: {
        /**
         * 地图范围(由地图输出)
         * @type {{minx,miny,maxx,maxy}}
         */
        bounds: null,
        /**
         * 地图中心点(由地图输出)
         * @type {{x:number,y:number}}
         */
        center: null,
        /**
         * 地图缩放级别(由地图输出)
         * @type {number}
         */
        zoom: null,

        /**
         * 地图范围(输入到地图)
         * @type {{minx,miny,maxx,maxy}}
         */
        inputBounds: null,
        /**
         * 地图中心点(输入到地图)
         * @type {{x:number,y:number}}
         */
        inputCenter: null,
        /**
         * 地图缩放级别(输入到地图)
         * @type {number}
         */
        inputZoom: null,
        /**
         * 是否最小zoom
         * @type {boolean}
         */
        isMinZoom: false,
        /**
        * 是否最大zoom
        * @type {boolean}
        */
        isMaxZoom: false
    },
    actions: {
        /**
         * 设置地图中心点
         * @param {*} context 
         * @param {{x:number,y:number}} param 
         */
        setMapCenter(context, param) {
            context.state.inputCenter = param;
        },
        /**
         * 设置地图缩放级别
         * @param {*} context 
         * @param {number} param 
         */
        setMapZoom(context, param) {
            context.state.inputZoom = param;
        },
        /**
         * 设置地图显示指定的区域
         * @param {*} context 
         * @param {{minx,miny,maxx,maxy}} param 
         */
        setMapBounds(context, param) {
            context.state.inputBounds = param;
        }
    }
}

export default mapState;