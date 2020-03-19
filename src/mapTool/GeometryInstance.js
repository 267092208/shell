import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
let changefeature
let addfeature
let noPlan




/**
 * 编辑返回的对象
 */
class GeometryInstance {

    /**
     *  构造函数
     * @param {VectorSource} editGeomtrySource 
     * @param {Function} disable  关闭事件
     * @param {*} finishDrawing 
     * @param {*} draw 绘制
     */
    constructor(editGeomtrySource, disable, draw) {
        this._eventobj = {}
        this.editGeomtrySource = editGeomtrySource;
        // 关闭编辑 
        this.disable = () => {
            this.editGeomtrySource.un("changefeature", changefeature)
            this.editGeomtrySource.un("addfeature", addfeature)
            draw.un("noPlan", noPlan)
            disable();
            this.disable = () => { }
        };
        this._draw = draw;
        this.removeLastPoint = () => {
            draw.removeLastPoint()
        }
        /**
         * @type {[key: string]: Array<LayerListener>} 
         */
        this.disposeEvent();
        this.editGeomtrySource.on("changefeature", changefeature = (e) => {
            this.editGeomtrySource = e.target;
            this.emit("update", e)
        })
        this.editGeomtrySource.on("addfeature", addfeature = (e) => {
            this.emit("update", e)
        })
        draw.on("noPlan", noPlan = (e) => {
            this.emit("noPlan", e)
        })
    }
    /**
     * 关闭编辑
     */
    disable() {

    }
    /**
     * TODO:命名错误
     * 获取编辑的几何绘制结果
     * @returns {Feature}
     */
    getGeometry() {
        this._draw.finishDrawing();
        return this.editGeomtrySource.getFeatures()[0]
    }
    /**
    * 获取编辑的几何绘制结果图形
    * @returns {Feature}
    */
    getFeature() {
        this._draw.finishDrawing();
        return this.editGeomtrySource.getFeatures()[0]
    }
    /**
     * 设置要编辑的对象
     * @param {Feature} feature 
     */
    setFeature(feature) {
        this.editGeomtrySource.clear();
        if (feature) {
            this.editGeomtrySource.addFeature(feature);
        }
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
    /**
   * 移除绑定到对象上的所有事件
   */
    disposeEvent() {
        for (let p in this._eventobj) {
            delete this._eventobj[p];
        }
    }
    /**
     *删除当前正在绘制的特征的最后一点
     */
    removeLastPoint() {

    }
};
export default GeometryInstance;