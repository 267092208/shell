import { map } from './map';
import { Draw, Modify, Snap } from 'ol/interaction';
import { createRegularPolygon, createBox } from 'ol/interaction/Draw';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import GeometryInstance from "@/mapTool/GeometryInstance.js"
import { mapState } from 'vuex';
import Feature from 'ol/Feature';
import MultiPoint from 'ol/geom/MultiPoint';

import RoadLineBaidu from "@/mapTool/RoadLineBaidu.js";

/**
 *编辑图层的数据源
 */
const editGeomtrySource = new VectorSource();
/**
 * 编辑是各个节点的编辑点
 */
const editStyle = new Style({
    image: new CircleStyle({
        radius: 7,
        fill: new Fill({
            color: '#ffffff'
        }),
        stroke: new Stroke({
            color: '#3388ff',
            width: 1
        })
    }),
    geometry: function (feature) {
        // return the coordinates of the first r ing of the polygon
        const coordinates = feature.getGeometry().getCoordinates()
        if (coordinates) {
            var coordinate = coordinates[0];
            if (coordinate instanceof Array) {
                return new MultiPoint(coordinate);
            } else {
                return new MultiPoint(coordinates);
            }
        }
    }
});

/**
 * 编辑图层
 */
const editGeometryLayer = new VectorLayer({
    source: editGeomtrySource,
    /**
     * 编辑是的样式
     */
    style: [
        new Style({
            fill: new Fill({
                color: 'rgba(51, 136, 255, 0.5)'
            }),
            stroke: new Stroke({
                color: '#3388ff',
                width: 2
            }),
            image: new Icon({
                src: "/images/add-maker.png",
                anchor: [0.5, 32],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels'
            })
        }),
        editStyle
    ],
    zIndex: 1000
});

const drawMode = {
    /**
     * @type {Draw}
     */
    Point: new Draw({
        stopClick: true,
        source: editGeomtrySource,
        type: "Point",
        style: new Style({
            image: new Icon({
                src: "/images/add-maker.png",
                anchor: [0.5, 32],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels'
            })
        })
    }),
    /**
     * @type {Draw}
     */
    LineString: new Draw({
        stopClick: true,
        source: editGeomtrySource,
        type: "LineString"
    }),
    /**
     * @type {Draw}
     */
    Polygon: new Draw({
        stopClick: true,
        source: editGeomtrySource,
        type: "Polygon"
    }),
    /**
     * @type {Draw}
     */
    Box: new Draw({
        stopClick: true,
        source: editGeomtrySource,
        type: "Circle",
        geometryFunction: createBox()
    }),
    /**
     * @type {Draw}
     */
    Circle: new Draw({
        stopClick: true,
        source: editGeomtrySource,
        type: "Circle"
    }),
    LineString_Dreehand: new Draw({
        stopClick: true,
        source: editGeomtrySource,
        type: "LineString",
        freehand: true
    }),
    Polygon_Dreehand: new Draw({
        stopClick: true,
        source: editGeomtrySource,
        type: "Polygon",
        freehand: true
    }),
    RoadLine_baidu: new RoadLineBaidu({
        stopClick: true,
        source: editGeomtrySource,
        type: "LineString"
    })

}
/**
 * 修改器
 */
const modify = new Modify({ source: editGeomtrySource, pixelTolerance: 25 });
/**
 * 绘画工具
 */
let draw;
/**
 * 编辑工具
 */
let snap; // global so we can remove them later
/**
 * 关闭编辑
 */
function disable() {
    draw && map.removeInteraction(draw);
    snap && map.removeInteraction(snap);
    map.removeInteraction(modify);
    map.removeLayer(editGeometryLayer);
    draw = null;
    snap = null;
}
/**
 * 图形添加点
 */
editGeomtrySource.on("addfeature", ({ feature }) => {
    setTimeout(() => {
        if (feature.getGeometry().getType() !== "Point") {
            let style = feature.getStyle();
            while (style instanceof Function) {
                style = style(feature)
            }
            if (style && style instanceof Array) {
                style.push(editStyle)
            } else if (style) {
                style = [style, editStyle]
            }
            feature.setStyle(style)
        }
    }, 1)
})
/**
 * LineString_Dreehand   Polygon_Dreehand 以手绘模式操作线，多边形
 * 打开编辑
 * @param {'Point'|'LineString'|'Polygon'|'Box'|'Circle'|'LineString_Dreehand'|'Polygon_Dreehand'|’RoadLine_baidu‘} mode 
 * @param {undefined|Feature} feature
 */
function enable(mode, feature) {
    editGeomtrySource.clear();
    if (feature) {
        editGeomtrySource.addFeature(feature);
    }
    // feature.setStyle() editStyle
    snap = new Snap({ source: editGeomtrySource });
    draw = drawMode[mode]
    map.addInteraction(modify);
    if (feature) {
        draw.setActive(false)
        modify.setActive(true)
    } else {
        modify.setActive(false)
        draw.setActive(true)
        draw.once("drawend", () => {
            draw.setActive(false)
            modify.setActive(true)
        })
    }
    console.log("draw", draw)
    map.addLayer(editGeometryLayer)
    map.addInteraction(draw);
    map.addInteraction(snap);
    return draw
}
const mixin = {
    computed: {
        ...mapState({
            drawMode: state => state.editGeometry.drawMode,
            editFeature: state => state.editGeometry.feature,
            editLayer: state => state.selectFeature.selectFeatureLayer,
            selectFeature: state => state.selectFeature.selectFeature,
            source: state => state.layer.source,
        })
    },
    methods: {

    },
    watch: {
        async drawMode(mode) {
            if (mode) {
                let editLayer = this.editLayer
                if (this.editFeature && this.editLayer) {
                    if ('get' in this.editLayer && this.editLayer.get("isCluster")) {
                        this.editLayer.getSource().getSource().removeFeature(this.editFeature);
                    } else {
                        await this.$store.dispatch('delFeature', {layerid: this.editLayer.id, feature: this.editFeature})
                   }
                }
                enable(mode, this.editFeature)
                const geometryInstance = new GeometryInstance(editGeomtrySource, async () => {
                    if (this.editFeature && editLayer) {
                        if ('get' in editLayer && editLayer.get("isCluster")) {
                            this.editLayer.getSource().getSource().addFeature(this.editFeature);
                        } else {
                            const geometry = geometryInstance.getGeometry().getGeometry();
                            // await this.$store.dispatch('addFeature', { layerid: editLayer.id, feature: {
                            //     geometry: {
                            //         type: geometry.getType(),
                            //         coordinates: geometry.getCoordinates()
                            //       },
                            //     properties: this.form
                            //   }})
                        }
                    }
                    await setTimeout(() => { this.$store.dispatch("addUpdateStyle") }, 1)
                    await disable(geometryInstance)
                    await this.$store.dispatch("drawDisable")
                }, draw);
                await this.$store.dispatch("setGeometryInstance", geometryInstance)
            }
        }
    }
}
export default mixin;