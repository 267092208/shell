import GeometryInstance from "@/mapTool/GeometryInstance.js"
import Feature from 'ol/Feature';
var geometryChangeCallback;
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
         * 'LineString_Dreehand'|'Polygon_Dreehand' 是以手绘模式
         * 调用编辑方法
         * @Feature 编辑的对象  为空则是添加模式
         * @param {*} context 
         * @param {{
         * drawMode:'Point'|'LineString'|'Polygon'|'Box'|'Circle'|'LineString_Dreehand'|'Polygon_Dreehand'|'RoadLine_baidu',
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
            context.state.feature = feature;
            if (context.state.drawMode === drawMode) {
                setTimeout(() => {
                    context.state.drawMode = null;
                }, 1)
            }
            setTimeout(() => {
                context.state.drawMode = drawMode;
            }, 1)
            return await new Promise(r => {
                geometryChangeCallback = (newval) => {
                    r(newval);
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
            console.log("context drawDisable");
            context.state.drawMode = null;
            context.state.geometryInstance = null;
            context.state.feature = null;
        }
    }
}
import('@/store').then(m => {
    const store = m.default;
    store.watch(() => store.state.editGeometry.geometryInstance, (newval) => {
        newval && geometryChangeCallback && geometryChangeCallback(newval);
    });
    store.watch(() => store.state.editGeometry.drawMode, (newval) => {
        if (!newval && store.state.editGeometry.geometryInstance) {
            // 更换模式关闭上个的编辑
            store.state.editGeometry.geometryInstance = null;
            store.state.editGeometry.feature = null;
            // store.state.editGeometry.drawMode = null;

        }
    });
})
export default editGeometry;