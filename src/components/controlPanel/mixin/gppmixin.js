import { mapState } from "vuex";
import gcoord from 'gcoord';
import { modelToEntityKeyValue } from '@/data/layer'
import { GetWayToDivision } from '@/data/roadnetwork'
import corridor from "@/config/layer/field/corridorFields";


const mixin = {
    computed: {
        ...mapState({
            actionsPanelVisible: state => state.header.actionsPanelVisible,
            currentLayer: state => state.layer.currentLayer,
            selectFeature: state => state.selectFeature.selectFeature,
            selectFeatureLayer: state => state.selectFeature.selectFeatureLayer,
            rightPanelName: state => state.panel.panelComponent.right,
            extent: state => state.panel.extent,
            geometryInstance: state => state.editGeometry.geometryInstance,
      drawMode: state => state.editGeometry.drawMode,
        }),
        hasExtentFields() {
            if (this.isEdit) {
                if (!this.selectFeatureLayer) return false;
                if (this.selectFeatureLayer.id === "poigroups" || this.selectFeatureLayer.id === 'roadnetwork') return this.selectFeatureLayer.id;
            }
        },
        getExtentFieldOwnerId() {
            return this.hasExtentFields ? this.selectFeature.id : undefined
        },
        filterFields() {
            if (this.fields && this.fields.length > 0)
                return this.fields.filter(item => {
                    // 'get' in item ? console.log(item) : ''
                    return !item.readonly && !("get" in item);
                });
            else return [];
        }
    },
    data() {
        return {
            geometry: null,
            fields: [],
            hasGeo: false,
            loading: false,
            isEdit: false,
            editting: false,
            saving: false,
            form: {},
            panelExtentValue: null,
            editFeature: null,
            editFeatureLayer: null
        };
    },
    methods: {
        getTrueFields(isadd) {
            let buff = [];
            let fields, id;
            if (isadd) {
                fields = this.currentLayer.fields
                id = this.currentLayer.id;
            } else {
                fields = this.selectFeatureLayer.fields//.filter(({displayText}) => displayText != '经度' && displayText != '纬度')
                id = this.selectFeatureLayer.id
            }
            if (id === 'nti' || id === 'gsnti') {
                fields = fields.filter(item => {
                    const { displayText } = item;
                    if (displayText == "NTI自编号" || displayText == "纬度" ||
                        displayText == "经度" ||
                        displayText == "站名") {
                        buff.push(item);
                    }
                    // if (displayText == '经度') 
                    return (
                        displayText != "NTI自编号" &&
                        displayText != "纬度" &&
                        displayText != "经度" &&
                        displayText != "站名" &&
                        displayText != "十三五规划序号" &&
                        displayText != "十三五规划序号" &&
                        displayText != "十二五规划序号" &&
                        displayText != "ID"
                    );
                });
                return buff.concat(fields)
            } else if (id === 'poi') {
                fields = fields.filter(item => {
                    const { displayText } = item;
                    if (displayText == '编号' || displayText == '经度' || displayText == '纬度') {
                        buff.push(item)
                        return false;
                    }
                    return true;
                })
                return buff.concat(fields)
            }
            else if (id === 'corridor') {
                fields = fields.filter((item) => {
                    const {displayText} = item;
                    if (displayText === '是否规划路') {
                        buff.push(item)
                    }
                    return displayText !== '名称' && displayText !== 'path_baidu' && displayText != '是否规划路'
                })
                fields = fields.concat(buff);
                return fields;
            }
            else if (id === 'roadnetwork') {
                fields = fields.filter(({ displayText }) => displayText != null && displayText != '' && displayText !== 'coorList' && displayText !== 'geometryType');
                return fields;
            } else {
                return fields.filter(item => {
                    const { displayText } = item;
                    // FIXME: 还没确定需要 if (displayText == 'path_baidu') {
                    //     return false;
                    // }
                    return true;
                });
            }
        },
        async getPropertyByFeature(data) {
            this.panelExtentValue = null;
            this.$parent.title = this.selectFeatureLayer ? this.selectFeatureLayer.name : undefined;
            this.fields = this.getTrueFields(false) // 编辑模式
            this.resetForm('form');
            /** 特例 */
            if (this.selectFeatureLayer.id === 'roadnetwork')
                this.panelExtentValue = await this.getRoadNetWork();
            if (data) {
                const values_ = data.values_ || data.properties
                this.isEdit = true; // 编辑模式
                this.editting = false; // 仍没确定编辑
                this.loading = true;
                this.loading = false;
                let form = {};
                if (this.selectFeatureLayer.id === 'xl') {
                    if (values_.IsRoute) {
                        form['保存类型'] = values_.Private ? '行程且只本人可见' : '行程'
                    } else form['保存类型'] = '线路' 
                }
                form = {...form, ...values_}
                this.form = form;
            }
        },
        routerResultMessage(res) {
            let action = this.isEdit ? '修改' : '添加'
            console.log(res);
            if (!res) {
                if (!res) this.$message.error({ message: `${action}失败!${res}`, offset: 60 });
                else this.$message.success({ message: `${action}成功`, offset: 60 });
            } else {
                if (typeof res === 'number' || res === true) this.$message.success({ message: `${action}成功`, offset: 60 });
                else if (typeof res === 'string' || 'Msg' in res) this.$message.error({ message: `${action}失败!${typeof res === 'string' ? res : res.Msg}`, offset: 60 });
                else this.$message.success({ message: `${action}成功`, offset: 60 });
            }
        },
        createPathBaidu() {
            const edit = this.$store.state.editGeometry;
            const mode = edit.drawMode;
            const geoInstance = edit.geometryInstance
            let path_baidu;
            switch (mode) {
                case 'Circle': {
                    const geo = geoInstance.getGeometry().getGeometry();
                    const lnglat = gcoord.transform(geo.getCenter(), gcoord.EPSG3857, gcoord.BD09);
                    const center = geo.getRadius();
                    path_baidu = `circle,${lnglat.join(',')},${center}`;
                }
                    break;
                case 'Box': {
                    const geo = geoInstance.getGeometry().getGeometry();
                    const extent = geo.getExtent();
                    const topleft = gcoord.transform([extent[0], extent[1]], gcoord.EPSG3857, gcoord.BD09);
                    const bottomright = gcoord.transform([extent[2], extent[3]], gcoord.EPSG3857, gcoord.BD09);
                    path_baidu = `rectangle,${topleft.join(',')}${bottomright.join(',')}`;
                }
                    break;
                case 'Polygon': {
                    const geo = geoInstance.getGeometry().getGeometry();
                    const coordinates = geo.getCoordinates()[0].map(item => gcoord.transform(item, gcoord.EPSG3857, gcoord.BD09))
                    path_baidu = `polygon,${coordinates.join(',')}`;
                }
                    break;
                case 'LineString': {
                    const geo = geoInstance.getGeometry().getGeometry();
                    const coordinates = geo.getCoordinates().map(item => gcoord.transform(item, gcoord.EPSG3857, gcoord.BD09))
                    path_baidu = `polyline,${coordinates.join(',')}`;
                }
                    break;
                case 'RoadLine_baidu': {
                    const geo = geoInstance.getGeometry().getGeometry();
                    const coordinates = geo.getCoordinates().map(item => gcoord.transform(item, gcoord.EPSG3857, gcoord.BD09).join(' '))
                    path_baidu = `LINESTRING (${coordinates.join(',')})`;
                }
            }

            return path_baidu
        },
        /**特例方法 */
        /** 获得路网的行政区划 */
        async getRoadNetWork() {
            const res = await GetWayToDivision(this.getExtentFieldOwnerId).catch(err => console.log(err))

            return (typeof res === 'object') ? res.join('\n') : '加载行政区划失败'
        },
        /**
         * @type {'Polygon'|'Box'|'Circle} mode 
         */
        async poigroupsSubmitFn() {
            const geoInstance = this.$store.state.editGeometry.geometryInstance
            let model;
            let res;
            // 获取model，提交数据，提示信息 分添加/编辑模式
            if (this.isEdit === false) {
                const feature = this.isEdit ? this.form : this.extent;
                const path_baidu = this.createPathBaidu();
                model = {
                    名称: this.form['名称'],
                    备注: this.form['备注'],
                    path_baidu: path_baidu,
                    strokeColor: feature.strokeColor,
                    fillColor: feature.fillColor,
                    strokeStyle: feature.strokeStyle,
                    柴油总日销量k: this.form['柴油总日销量k'].toString(),
                    汽油总日销量k: this.form['汽油总日销量k'].toString(),
                    油站个数: this.form['油站个数'].toString(),
                    发展潜力: this.form['发展潜力'].toString(),
                    组团评级: this.form['组团评级']
                }
                const geometry = geoInstance.getGeometry().getGeometry();
                res = await this.$store.dispatch('addLayerFeature', { layerid: 'poigroups', feature: { id: this.form['ID'], geometry: {
                                                    type: geometry.getType(),
                                                    coordinates: geometry.getType() === 'Circle' ? [geometry.getCenter(), geometry.getRadius()] : geometry.getCoordinates()
                                                }, properties: model } }).catch(err =>  err)
                geoInstance && await geoInstance.disable(); // 关闭图形
            } else {
                let { ID, 名称, path_baidu, strokeColor, fillColor, strokeStyle, 备注, 柴油总日销量k, 汽油总日销量k, 油站个数, 发展潜力, 组团评级 } = this.form;
                model = { ID, 名称, path_baidu, strokeColor, fillColor, strokeStyle, 备注, 柴油总日销量k, 汽油总日销量k, 油站个数, 发展潜力, 组团评级 }
                res = await this.$store.dispatch('updateLayerFeature', { layerid: 'poigroups', feature: { id: this.form['ID'], properties: model } }).catch(err =>err)
            }
            this.routerResultMessage(res);
        },
        async sqSubmitFn() {
            let path_baidu;
            let model;
            let res;
            const geoInstance = this.$store.state.editGeometry.geometryInstance
            // 获取model，提交数据，提示信息 分添加/编辑模式
            if (this.isEdit === false) {
                path_baidu = this.createPathBaidu();
                model = {
                    类型: this.form['类型'],
                    Name: this.form['Name'],
                    note_baidu: this.form['备注'],
                    ID: this.form['ID'],
                    path_baidu: path_baidu,
                }
                const geometry = geoInstance.getGeometry().getGeometry();
                res = await this.$store.dispatch('addLayerFeature', { layerid: 'sq', feature: { id: this.form['ID'],geometry: {
                                                        type: geometry.getType(),
                                                        coordinates: geometry.getType() === 'Circle' ? [geometry.getCenter(), geometry.getRadius()] : geometry.getCoordinates()
                                                    }, properties: model } }).catch(err => err);
                geoInstance && await geoInstance.disable(); // 关闭图形
            }
            else {
                path_baidu = this.form['path_baidu'];
                model = {
                    ID: this.form['ID'],
                    Name: this.form['Name'],
                    path_baidu: path_baidu,
                    note_baidu: this.form['note_baidu'],
                    类型: this.form['类型']
                }
                res = await this.$store.dispatch('updateLayerFeature', { layerid: 'sq', feature: { id: this.form['ID'], properties: model } }).catch(err => err);
            }
            this.routerResultMessage(res);
        },
        async roadSubmitFn() {
            const geoInstance = this.$store.state.editGeometry.geometryInstance
            const geo = this.createPathBaidu()
            // 获取model，提交数据，提示信息 分添加/编辑模式
            const model = {
                ID: '',
                Name: '',
                Type: '',
                Geo: { WKT: geo },
                ...this.form,
                InfoID: ''
            }
            const res = await this.$store.dispatch('addLayerFeature', { layerid: 'roadnetwork', feature: { properties: model } }).catch(err => err);
            this.routerResultMessage(res);
            if(this.isEdit === false) await geoInstance.disable();
        },
        async xlSubmitFn() {
            const geoInstance = this.$store.state.editGeometry.geometryInstance
            let res;
            const path_baidu = this.isEdit ? this.form['path_baidu'] : this.createPathBaidu().replace(/polyline,/, '');
            // 获取model，提交数据，提示信息 分添加/编辑模式
            let model = {
                    Name: this.form['Name'],
                    PathLevel: this.form['PathLevel'],
                    单双向: this.form['单双向'],
                    车道数: this.form['车道数'],
                    限速: this.form['限速'],
                    path_baidu
                }
            if (this.form['保存类型'] === '行程且只本人可见') {
                model["Private"] = true;
                model['IsRoute'] = true;
            }
            if (this.form['保存类型'].includes('行程')) {
                model['IsRoute'] = true;
            }
            if (this.isEdit === false) { 
               const geometry = geoInstance.getFeature().getGeometry();
                res = await this.$store.dispatch('addLayerFeature', { layerid: 'xl', feature: {geometry: {
                    type: geometry.getType(),
                    coordinates: geometry.getCoordinates()
                }, properties: model } }).catch(err => err);
                if (this.isEdit === false) await geoInstance.disable();
            } else {
                res = await this.$store.dispatch('addLayerFeature', { layerid: 'xl', feature: { properties: model } }).catch(err => err);
            }
            this.routerResultMessage(res);
        },
        async corridorSubmitFn() {
            const geoInstance = this.$store.state.editGeometry.geometryInstance
            const geo = this.createPathBaidu()
            let model;
            let res;
            // 获取model，提交数据，提示信息 分添加/编辑模式
            const { ID, 编号, 道路名称, 道路类型, 道路重要性, 道路描述, 车流, 是否规划路, Geo, Ranking, path_baidu } = this.form
            if (this.isEdit === false) {
                model = {
                    ID, 编号, 道路名称, 道路类型, 道路重要性, 道路描述, 车流, 是否规划路,
                    Geo: { WKT: geo },
                    Ranking,
                    path_baidu
                }
                await geoInstance.disable();
            } else {
                model = {
                    ID, 编号, 道路名称, 道路重要性, 道路描述, 车流, Ranking, 道路类型, 是否规划路,
                    Geo: Geo,
                }
            }

            if (this.isEdit === false) res = await this.$store.dispatch('addLayerFeature', { layerid: 'corridor', feature: {id: this.form.ID, properties: model } }).catch(err => err.substring(err.indexOf('转换错误')));
            else res = await this.$store.dispatch('updateLayerFeature', { layerid: 'corridor', feature: {id: this.form.ID, properties: model } }).catch(err => err.substring(err.indexOf('转换错误')));
            this.routerResultMessage(res);
        },
        /** end 特例方法 */
        /** 
         * 判断是否需要关闭vuex的绘制工具with controlPanel信息 
         * 因为绘制工具是controlPanel打开的，在可能没正确关闭的时候，
         * 希望关闭该面板可以保证不存在该对象
         */
        judgeCloseCtrGeo() {
            if (this.currentLayer && this.currentLayer.id === 'poigroups') {
                const edit = this.$store.state.editGeometry.geometryInstance;
                edit && edit.disable();
            }
        }
    }
}

export default mixin;
