import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
/**
 * 编辑返回的对象
 */
class GeometryInstance {
    /**
     * 构造函数
     * @param {VectorSource}  editGeomtrySource
     * @param {*} disable 
     */
    constructor(editGeomtrySource, disable) {
        this.editGeomtrySource = editGeomtrySource;
        // 关闭编辑 
        this.disable = disable;
        /**
         * @type {[key: string]: Array<LayerListener>} 
         */
        this._eventobj = {}
        this.editGeomtrySource.on("changefeature", () => {
            this.emit("update")
        })
        this.editGeomtrySource.on("addfeature", () => {
            this.emit("update")
        })
    }
    /**
     * 关闭编辑
     */
    disable() {

    }
    /**
     * 获取编辑的几何绘制结果
     * @returns {Feature}
     */
    getGeometry() {
        return this.editGeomtrySource.getFeatures()[0]
    }
    /**
     * 定义事件
     * 'update' 图形更新的事件
     * @param {'update'} type 
     * @param {Function} listener 
     */
    on(type, listener) {
        this._eventobj[type] = this._eventobj[type] || [];
        this._eventobj[type].push(listener);
    }
    /**
     * 解绑事件
     * @param {'update'} type 
     * @param {Function} listener 
     */
    off(type, listener) {
        if (this._eventobj[type]) {
            let index = this._eventobj[type].indexOf(listener);
            index != -1 && this._eventobj[type].splice(index, 1);
        }
    }
    /**
     * 触发指定的事件并传入事件数据
     * @param {'update'} type 
     * @param {any} evt 
     */
    emit(type, evt) {
        if (this._eventobj && this._eventobj[type]) {
            for (let i = 0, j = this._eventobj[type].length; i < j; i++) {
                this._eventobj[type][i](evt);
            }
        }
    }
};
export default GeometryInstance;