
import { mapState } from "vuex";
import gcoord from "gcoord";
import { createdRenderer } from "@/mapTool/layerManager.js";

// import addEleMixin from "@/components/controlPanel/mixin/addEleMixin";

export default {
    //  mixins: [addEleMixin],
    filters: {
        formFilter: function (value, type) {
            switch (type) {
                case "geometryX":
                case "geometryY":
                    return Number.parseFloat(value).toFixed(6);
                    break;
                default:
                    return value;
            }
        }
    },
    props: ["visible", "height", "title"],
    computed: {
        ...mapState({
            actionsPanelVisible: state => state.header.actionsPanelVisible,
            filtersPanelVisible: state => state.header.filtersPanelVisible,
            layersPanelVisible: state => state.header.layersPanelVisible,
            base: state => state.layer.base,
            currentLayer: state => state.layer.currentLayer,
            // geometry: state => state.geometry.geometry,
            currentLayer: state => state.layer.currentLayer // 当前选择图层
        }),
        filterForm() {
            if (this.fields.length > 0)
                return this.fields.filter(item => {
                    // 'get' in item ? console.log(item) : ''
                    return !item.readonly && !("get" in item);
                });
            else return [];
        }
    },
    data() {
        return {
            saving: false,
            form: {
                name: "",
                region: "",
                date1: "",
                date2: "",
                delivery: false,
                type: [],
                resource: "",
                desc: ""
            },
            fields: [],
            brankOption: [
                {
                    value: "选项1",
                    label: "SP"
                },
                {
                    value: "选项2",
                    label: "PC"
                },
                {
                    value: "选项3",
                    label: "BPPC"
                },
                {
                    value: "选项4",
                    label: "IND"
                },
                {
                    value: "选项5",
                    label: "CNOOC"
                },
                {
                    value: "6",
                    label: "SC"
                },
                {
                    value: "7",
                    label: "Caltex"
                },
                {
                    value: "8",
                    label: "YC Shell"
                },
                {
                    value: "9",
                    label: "停车场"
                }
            ],
            devprocess: [
                { label: "非目标站", value: "0" },
                { label: "Pre-ID", value: "1" },
                { label: "ID", value: "2" },
                { label: "签约", value: "3" },
                { label: "建设", value: "4" },
                { label: "证照", value: "5" },
                { label: "开业", value: "6" }
            ],
            operaStates: [
                { label: "开业", value: 0 },
                { label: "在建", value: 1 },
                { label: "停业", value: 2 },
                { label: "签约", value: 3 }
            ],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            geometry: null,
            //星罗字段
            addCoor: null,
            isAdding: false, // 是否为添加图元状态
            hasAdded: false, // 是否已经添加过图元
            isAddPointMarkerShow: false, // 添加点图元时是否显示点图标
            isEditting: false, // 是否为编辑状态
            currentGeoType: "", // 当前编辑的面图层类型(Rectangle,Circle,Polygon)
            geoLayer: null, //编辑对象
            editLayer: null,
            fileList: [],
            upLoadList: {},
            saveLong: 0,
            saveArea: 0,
            latError: false,
            lngError: false,
            LayerSelectVisible: false,
            value: "",
            Copygeometry: "",
            CopyFields: "",
            CopyLayer: [],
            lineType: "",
            RoadSavePoint: "",
            RoadMarkerGroup: [],
            RoadLineSave: [],
            RoadLine: [],
            RoadLineLayer: ""
        };
    },
    methods: {
        handleKeyUp(e) {
            // console.log(e)
            this.closeAddLayer();
        },
        closeAddLayer() {
            this.endPoint();
            this.$parent.close();
        },
        notDynComponent(item, hasenum) {
            return item.fieldName !== "开始时间" && hasenum == undefined;
        },
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // do something
                    this.saving = true;
                    this.$store
                        .dispatch("addLayerFeature", {
                            layerid: this.currentLayer.id,
                            feature: {
                                geometry: {
                                    type: this.geometry
                                        .getGeometry()
                                        .getGeometry()
                                        .getType(),
                                    coordinates: this.addCoor
                                },
                                properties: this.form
                            }
                        })
                        .then(res => {
                            this.$message.success({
                                message: "添加成功",
                                offset: 60
                            });
                            this.saving = false;
                            this.endPoint();
                        })
                        .catch(err => {
                            this.$message.error({
                                message: "添加失败!",
                                offset: 60
                            });
                            this.saving = false;
                            this.endPoint();
                        });
                } else {
                    this.$message.error({
                        message: "请正确填写表单!",
                        offset: 60
                    });
                }
            });
            // console.log("submit!");
        },
        resetForm(formName) {
            try {
                this.$refs[formName].resetFields();
            } catch (err) {
                // console.log(err)
            }
            // console.log(this.geometry)
            this.endPoint();
            this.beginSetPoint();
        },
        createFormCtrlWithType(type) {
            switch (type) {
                case "number":
                    return "elInputNumber";
                case "geometryX":
                case "geometryY":
                    return "elInput";
                    break;
                case "date": {
                    return "elDatePicker";
                }
                case "string": {
                    return "elInput";
                }
                case "boolean": {
                    return "elCheckbox";
                }
                case "time": {
                    return "elTimeSelect";
                }
            }
        },
        /**
         * type is string | number | boolean | date | time | geometryX | geometryY
         */
        createRule(item) {
            const { displayText, type } = item;
            let rules = [];
            let typeRule = { type };
            if ("required" in item && item.required)
                rules.push({
                    required: true,
                    message: `${displayText}不能为空`
                });
            else {
                rules.push({ required: false });
            }

            switch (type) {
                case "number":
                    typeRule["message"] = `${displayText}必须为数字`;
                    break;
                case "boolean":
                    typeRule["message"] = `${displayText}为布尔值`;
                    break;
                default: {
                    typeRule = null;
                }
            }
            if (typeRule != null) rules.push(typeRule);
            return rules;
        },
        createPlaceholder(name, type) {
            if (type === "number" || type === "string") return `${name}`;
        },
        createLabelWidth(name) {
            // return name.indexOf("第三方优惠") > 0 ? "170px" : "";
        },
        beginSetPoint() {
            this.addElement("Point");
            // return this.$store
            //   .dispatch("getGeometry", "point")
            //   .then(res => {
            //     this.geometry = res;
            //     this.geometry.on("update", e => {
            //       this.updateCoordinate(e);
            //     });
            //     this.updateCoordinate(res.geometry);
            //   })
            //   .catch(err => {
            //     // console.log(err);
            //   });
        },
        endPoint() {
            // this.$store.dispatch("drawDisable");
            this.geometry && this.geometry.disable();
        },
        updateCoordinate(geometry) {
            this.form["lng_baidu"] = Number.parseFloat(geometry[0]).toFixed(6);
            this.form["lat_baidu"] = Number.parseFloat(geometry[1]).toFixed(6);
        },
        init() {
            if (this.currentLayer != null) {
                let layer = this.base.find(
                    item => item.id === this.currentLayer.id
                );
                this.$parent.title = layer.name;
            }
            this.$parent.autoClose = false;
            this.$parent.afterClose = this.endPoint.bind(this);
        },
        close() {
            this.resetForm("form");
            this.endPoint();
        },

        /**
         * @desc 添加图元统一处理
         * @param {String} type 图元类型
         */
        addElement(type) {
            if (this.isAdding && type === "Point" && type === "Line") {
                return;
            }
            console.log("type+++++", type);

            this.isAdding = true;
            switch (type) {
                case "Point":
                    this.createTempPoint();
                    // document.addEventListener("mousemove", this.mouseMoveTip);
                    break;
                case "Line":
                    this.createTempLine();
                    break;
                case "RoadLine":
                    this.createRoadLine();
                    break;
                case "MouseLine":
                    this.createMouseLine();
                    break;
                default:
                    this.createTempGeo(type);
            }
        },
        /**
         *  @desc 创建暂时的点图元
         */
        async createTempPoint() {
            this.isAddPointMarkerShow = true;
            if (this.geoLayer) {
                this.geoLayer.disable();
                this.geoLayer = null;
            }
            this.geometry = await this.$store.dispatch("getGeometry", { drawMode: "Point" })
            // .then(res => {
            //     this.geometry = res;
            console.log("this.currentLayer+++++", this.currentLayer);
            let style = createdRenderer(this.currentLayer.renderers[0]);
            let hasChangeStyle = false;
            this.geometry.on("update", () => {
                let point = this.geometry
                    .getFeature()
                    .getGeometry()
                    .getCoordinates();
                this.addCoor = this.pointLatLng(point);
                if (!hasChangeStyle) {
                    hasChangeStyle = true;
                    this.hasAdded = true;
                    this.isAdding = false;
                    this.updateCoordinate(this.addCoor);
                    this.geometry.getGeometry().setStyle(style);
                    // this.clearMouseTip();
                }
            });
            // });


        },
        /**
         * @desc 创建暂时的线图元
         */
        async createTempLine() {
            const { $store } = this;
            this.lineType = "line";
            this.geoLayer = await this.$store.dispatch("getGeometry", {
                drawMode: "LineString"
            });
            let style = styleConverter(this.currentLayer.style);
            let hasChangeStyle = false;
            this.geoLayer.on("update", () => {
                let lineString = this.geoLayer.getFeature().getGeometry();
                let long = getLength(lineString);
                this.setLong(long);
                if (!hasChangeStyle) {
                    this.hasAdded = true;
                    this.isAdding = false;
                    hasChangeStyle = true;
                    this.geoLayer.getFeature().setStyle(style);
                }
            });
            // console.log(line)
        },
        //创建道路线图层
        createRoadLine() {
            this.lineType = "roadline";
            if (this.$map.editTools.drawing()) {
                this.$map.off("editable:drawing:end");
                $map.on("editable:drawing:end", e => {
                    e.layer.remove();
                    this.cancelCursorMarker();
                });
                this.$map.editTools.stopDrawing();
            }
            if (this.tempLayer && this.hasAdded) {
                this.tempLayer.remove();
                this.isAdding = true;
                this.hasAdded = false;
                this.$store.commit("setTempLayer", null);
            }
            if (this.RoadLineLayer) {
                this.clearRoadLine();
            }
            this.RoadLineLayer = L.polyline(this.RoadLine, {
                color: "#69C0DA",
                weight: 4,
                opacity: 0.8
            }).addTo($map);
            this.$map._container.style.cursor = "crosshair";
            $map.off("click");
            $map.on("click", e => {
                if (
                    e.latlng != this.RoadSavePoint &&
                    this.RoadSavePoint != ""
                ) {
                    this.addRoadLine(this.RoadSavePoint, e.latlng);
                }
                var myIcon = L.divIcon({ className: "RoadPoint" });
                let RoadMarker = L.marker(e.latlng, { icon: myIcon }).addTo(
                    $map
                );
                this.RoadMarkerGroup.push(RoadMarker);
                this.RoadSavePoint = e.latlng;
            });
            $map.on("keydown", this.RevokeLine);
            this.$map.addEventListener(
                "mousemove",
                this.LinemapMouseMoveHandler
            );
        },
        //满足条件后进行百度搜索道路
        addRoadLine(startPoint, endPoint) {
            let BDstart = GPS2Google2Baidu.WGS_84_to_BD_09(
                startPoint.lat,
                startPoint.lng
            );
            let BDend = GPS2Google2Baidu.WGS_84_to_BD_09(
                endPoint.lat,
                endPoint.lng
            );
            var start = new BMap.Point(BDstart.lng, BDstart.lat);
            var end = new BMap.Point(BDend.lng, BDend.lat);
            var walking = new BMap.DrivingRoute(start);
            walking.setSearchCompleteCallback(results => {
                if (Object.keys(results).length > 0) {
                    let latlngGroup = results.getPlan(0).Sj[0].Rq;
                    let WGlatlng = latlngGroup.map(i => {
                        return GPS2Google2Baidu.BD_09_to_WGS_84(i.lat, i.lng);
                    });
                    this.RoadLineSave.push(WGlatlng);
                    this.RoadLine = this.RoadLine.concat(WGlatlng);
                    this.RoadLineLayer.setLatLngs(this.RoadLine);
                    this.isAdding = false;
                    this.hasAdded = true;
                    const geometry = converters_new["Line"].toJson(
                        this.RoadLineLayer,
                        this.tempElement.layerGroupData
                    );
                    // 同步几何属性
                    this.tempElement.geometry = geometry;
                    const layerJson = { geometry };
                    const tempLayer = converters_new["Line"].fromJson(
                        layerJson,
                        this.tempElement.layerGroupData
                    );
                    this.$store.commit("setTempLayer", tempLayer);
                    let totallong = 0;
                    for (let i = 1; i <= this.RoadLine.length - 1; i++) {
                        let A = L.latLng(
                            this.RoadLine[i].lat,
                            this.RoadLine[i].lng
                        );
                        let B = L.latLng(
                            this.RoadLine[i - 1].lat,
                            this.RoadLine[i - 1].lng
                        );
                        totallong += A.distanceTo(B);
                    }
                    if (this.tempElement.properties.length != undefined) {
                        if (
                            this.tempElement.properties.length ==
                            this.saveLong ||
                            this.tempElement.properties.length == ""
                        ) {
                            this.tempElement.properties.length = this.formatDistance(
                                totallong
                            );
                            this.saveLong = this.formatDistance(totallong);
                        }
                    }
                } else {
                    this.$message.error("无法获取到目标点的道路信息");
                    this.RoadMarkerGroup[
                        this.RoadMarkerGroup.length - 1
                    ].remove();
                    this.RoadMarkerGroup.pop();
                    this.RoadSavePoint = this.RoadMarkerGroup[
                        this.RoadMarkerGroup.length - 1
                    ].getLatLng();
                }
            });
            walking.search(start, end);
        },
        //创建鼠绘的图元
        createMouseLine() {
            return;
            this.lineType = "mouseline";
            if (this.$map.editTools.drawing()) {
                this.$map.off("editable:drawing:end");
                $map.on("editable:drawing:end", e => {
                    e.layer.remove();
                    this.cancelCursorMarker();
                });
                this.$map.editTools.stopDrawing();
            }
            if (this.tempLayer && this.hasAdded) {
                this.tempLayer.remove();
                this.isAdding = true;
                this.hasAdded = false;
                this.$store.commit("setTempLayer", null);
            }
            if (this.RoadLineLayer) {
                this.clearRoadLine();
            }
            this.RoadLineLayer = L.polyline(this.RoadLine, {
                color: "#69C0DA",
                weight: 4,
                opacity: 0.8
            }).addTo($map);
            this.$map.off("click");
            this.$map.on("mousedown", this.bindMouseLine);
        },
        bindMouseLine() {
            console.log(321312);
        },
        /**
         * @desc 创建暂时的面图元
         * @param {String} type 图元类型 (Rectangle/Circle/Polygon)
         */
        async createTempGeo(type) {
            this.isAdding = true;
            this.currentGeoType = type;
            switch (type) {
                case "Rectangle":
                    this.geoLayer = await this.$store.dispatch("getGeometry", {
                        drawMode: "Box"
                    });
                    break;
                //TODO:圆编辑难
                case "Circle":
                    this.geoLayer = await this.$store.dispatch("getGeometry", {
                        drawMode: "Circle"
                    });
                    break;
                case "Polygon":
                    this.geoLayer = await this.$store.dispatch("getGeometry", {
                        drawMode: "Polygon"
                    });
                    break;
            }
            console.log(this.geoLayer);
            let style = styleConverter(this.currentLayer.style);
            let hasChangeStyle = false;
            this.geoLayer.on("update", () => {
                let area;
                if (type == "Circle") {
                    let circle = this.geoLayer.getFeature().getGeometry();
                    const PI = 3.14;
                    const radius = circle.getRadius();
                    area = PI * radius * radius;
                } else {
                    let Polygon = this.geoLayer.getFeature().getGeometry();
                    area = getArea(Polygon);
                }
                this.setArea(area);
                if (!hasChangeStyle) {
                    this.hasAdded = true;
                    this.isAdding = false;
                    hasChangeStyle = true;
                    this.geoLayer.getFeature().setStyle(style);
                }
            });
            this.listenCreateTempGeo(this.currentGeoType);
        },

        //获取的xy经纬度转为经纬度坐标
        pointLatLng(xy) {
            let latlng = gcoord.transform(xy, gcoord.EPSG3857, gcoord.BD09);

            // let latlng = transform(xy, "EPSG:3857", "EPSG:4326");
            return latlng;
        }
    },
    mounted() {
        if (this.currentLayer != null) {
            let layer = this.base.find(
                item => item.id === this.currentLayer.id
            );
            this.fields = layer.fields;
            this.$parent.title = layer.name;
            let form = {};
            for (let item of this.fields) {
                form[item.fieldName] = "";
            }
            this.form = form;
            // this.$parent.afterClose = this.endPoint.bind(this);
            // this.beginSetPoint();
            this.$parent.autoClose = false;
        }
    },
    deactivated() {
        this.close();
    },
    activated() {
        this.beginSetPoint();
    },
    beforeDestroy() {
        this.endPoint();
    },
    watch: {
        actionsPanelVisible(b) {
            if (b === false) this.$emit("update:visible", b);
        }
    }
};
