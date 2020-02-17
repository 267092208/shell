
import { map } from './map';
import { Draw, Modify, Snap } from 'ol/interaction';
import Polygon from 'ol/geom/Polygon';
import { createRegularPolygon, createBox } from 'ol/interaction/Draw';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import GeometryInstance from "@/mapTool/GeometryInstance.js"
import { mapState } from 'vuex';
import Feature from 'ol/Feature';
import MultiPoint from 'ol/geom/MultiPoint';
/**
 *编辑图层的数据源
 */
const editGeomtrySource = new VectorSource();
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
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: '#ffcc33'
                })
            })
        }),
        new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: '#ffffff'
                }),
                stroke: new Stroke({
                    color: '#3388ff',
                    width: 1
                }),
            }),
            geometry: function (feature) {
                // return the coordinates of the first ring of the polygon
                var coordinates = feature.getGeometry().getCoordinates()[0];
                return new MultiPoint(coordinates);
            }
        })
    ],
    zIndex: 1000
});

const drawMode = {
    /**
     * @type {Draw}
     */
    Point: new Draw({
        source: editGeomtrySource,
        type: "Point",
        style: new Style({
            image: new Icon({ src: "/images/add-maker.png" })
        })
    }),
    /**
     * @type {Draw}
     */
    LineString: new Draw({
        source: editGeomtrySource,
        type: "LineString",
    }),
    /**
     * @type {Draw}
     */
    Polygon: new Draw({
        source: editGeomtrySource,
        type: "Polygon"
    }),
    /**
     * @type {Draw}
     */
    Box: new Draw({
        source: editGeomtrySource,
        type: "Circle",
        geometryFunction: createBox()
    }),
    /**
     * @type {Draw}
     */
    Circle: new Draw({
        source: editGeomtrySource,
        type: "Circle"
    })
}
/**
 * 修改器
 */
const modify = new Modify({ source: editGeomtrySource });
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
 * 打开编辑
 * @param {'Point'|'LineString'|'Polygon'|'Box'|'Circle'} mode 
 * @param {undefined|Feature} feature
 */
function enable(mode, feature) {
    editGeomtrySource.clear();
    feature && editGeomtrySource.addFeature(feature);
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
    map.addLayer(editGeometryLayer)
    map.addInteraction(draw);
    map.addInteraction(snap);
}

const mixin = {
    computed: {
        ...mapState({
            drawMode: state => state.geometry.drawMode,
            editFeature: state => state.geometry.feature
        })
    },
    methods: {

    },
    watch: {
        drawMode(mode) {
            if (mode) {
                enable(mode, this.editFeature)
                const geometryInstance = new GeometryInstance(editGeomtrySource, () => {
                    disable(geometryInstance)
                    this.$store.dispatch("drawDisable")
                });                
                this.$store.dispatch("setGeometryInstance", geometryInstance)
            }
        }
    }
}
export default mixin;