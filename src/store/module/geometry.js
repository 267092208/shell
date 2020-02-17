// import { deepCopy } from "@/assets/js/utils.js";
// /**
//  * 编辑返回的对象
//  */
// class GeometryInstance {
//     constructor(geometry, disable) {
//         this.geometry = geometry;
//         this.disable = disable
//     }
//     /**
//      * 几何绘制结果
//      */
//     geometry
//     /**
//      * @type {[key: string]: Array<LayerListener>} 
//      * 
//      */
//     _eventobj = {}
//     /**
//      * 定义事件
//      * 'before-close' 关闭前的事件 'update' 图形更新的事件
//      * @param {'before-close'|'update'} type 
//      * @param {Function} listener 
//      */
//     on(type, listener) {
//         this._eventobj[type] = this._eventobj[type] || [];
//         this._eventobj[type].push(listener);
//     }
//     /**
//      * 解绑事件
//      * @param {'before-close'|'update'} type 
//      * @param {Function} listener 
//      */
//     off(type, listener) {
//         if (this._eventobj[type]) {
//             let index = this._eventobj[type].indexOf(listener);
//             index != -1 && this._eventobj[type].splice(index, 1);
//         }
//     }
//     /**
//      * 触发指定的事件并传入事件数据
//      * @param {'before-close'|'update'} type 
//      * @param {any} evt 
//      */
//     emit(type, evt) {
//         if (type == "update") {
//             this.geometry = evt.geometry;
//         };
//         if (this._eventobj && this._eventobj[type]) {
//             for (let i = 0, j = this._eventobj[type].length; i < j; i++) {
//                 this._eventobj[type][i](evt);
//             }
//         }
//     }
//     /**
//      * 关闭事件
//      */
//     disable() {

//     }
// }

// const geometry = {
//     state: {
//         /**
//          * 几何绘制结果
//          */
//         geometry: null,
//         /**
//          * 几何绘制模式
//          */
//         drawMode: null,
//         /**
//          * @type {GeometryInstance}
//          */
//         geometryInstance: null
//     },
//     actions: {
//         /**
//          * 要求输入一个指定类型的几何
//          * @param {*} context 
//          * @param {'point'|'line'|'polygon'|'circle'|'rectangle'|null} param 几何类型
//          * @returns {Promise.<GeometryInstance>}
//          */
//         async getGeometry(context, param) {
//             context.state.drawMode = param;
//             geometryChangeCallback && (context.state.geometry = null);
//             return await new Promise(r => {
//                 geometryChangeCallback = () => {
//                     let geometry = deepCopy(context.state.geometry)
//                     function disable() {
//                         context.state.drawMode = null;
//                     }
//                     const geometryInstance = context.state.geometryInstance = new GeometryInstance(geometry, disable);
//                     r(geometryInstance);
//                 }
//             })
//         },
//         /**
//          * 关闭编辑
//          * @param {*} context 
//          */
//         drawDisable(context) {
//             context.state.drawMode = null;
//         },
//         /**
//          * 设置几何绘制结果
//          * @param {*} context 
//          * @param {*} param 
//          */
//         setGeometry(context, param) {
//             // context.state.drawMode = null;
//             context.state.geometry = param;
//         }
//     }
// };

// var geometryChangeCallback;

// import('@/store').then(m => {
//     const store = m.default;
//     store.watch(() => store.state.geometry.geometry, (newval) => {
//         geometryChangeCallback && geometryChangeCallback();
//     });
//     store.watch(() => store.state.geometry.drawMode, (newval) => {
//         if (!newval && store.state.geometry.geometryInstance) {
//             store.state.geometry.geometryInstance.emit("before-close")
//             store.state.geometry.geometryInstance = null;
//         }
//     });
// })

// export default geometry;
import GeometryInstance from "@/mapTool/GeometryInstance.js"
import Feature from 'ol/Feature';

const editGeometry = {
    state: {
        /**
        * 只有 mixins/map下的 editGeometry.js可调用
        * 返回的编辑对象
        * @type {GeometryInstance}
        */
        geometryInstance: null,
        /**
         * 几何绘制模式
         * @type {'Point'|'LineString'|'Polygon'|'Box'}
         */
        drawMode: null,
        /**
         * 编辑的对象
         * @type {Feature}
         */
        feature: null

    },
    mutations: {

    },
    actions: {
        /**
         * 调用编辑方法
         * @Feature 编辑的对象  为空则是添加模式
         * @param {*} context 
         * @param {{
         * drawMode:'Point'|'LineString'|'Polygon'|'Box'|'Circle',
         * feature?:Feature
         * }} param 
         * @returns {Promise<GeometryInstance>}
         */
        async getGeometry(context, param) {
            const { drawMode, feature } = param
            if (context.state.geometryInstance && drawMode) {
                // 更换模式关闭上个的编辑
                context.state.geometryInstance.disable();
                context.state.geometryInstance = null;
                context.state.feature = null;
            }
            context.state.drawMode = drawMode;
            console.log("666666", feature)
            context.state.feature = feature;
            return await new Promise(r => {
                geometryChangeCallback = () => {
                    // 
                    r(context.state.geometryInstance);
                }
            })
        },
        /**
         * 只有  mixins/map下的 editGeometry.js可调用
         * 设置编辑要返回对象
         * @param {*} context 
         * @param {GeometryInstance} geometryInstance 
         */
        setGeometryInstance(context, geometryInstance) {
            context.state.geometryInstance = geometryInstance;
        },
        /**
         * 关闭编辑
         */
        drawDisable(context) {
            context.state.drawMode = null;
        }
    }
}
var geometryChangeCallback;
import('@/store').then(m => {
    const store = m.default;
    store.watch(() => store.state.geometry.geometryInstance, (newval) => {
        geometryChangeCallback && geometryChangeCallback();
    });
    store.watch(() => store.state.geometry.drawMode, (newval) => {
        if (!newval && store.state.geometry.geometryInstance) {
            // 更换模式关闭上个的编辑
            store.state.geometry.geometryInstance = null;
            store.state.geometry.feature = null;
            // store.state.editGeometry.drawMode = null;
        }
    });
})
export default editGeometry;