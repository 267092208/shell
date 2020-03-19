import Feature from 'ol/Feature';
import Draw from 'ol/interaction/Draw';
import BMap from "BMap";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import LineString from 'ol/geom/LineString';
import gcoord from "gcoord";
import MultiPoint from 'ol/geom/MultiPoint';
if (!BMap) {
    throw `请在index.html引入百度地图API。vue.config.js添加内容
      configureWebpack: {
        externals: {
            "BMap": "BMap"
        }
    }`
}
function RoadLine() {
    // 点击的点
    const _coordinates = [];
    let isguo = true
    geometryFunction.coordinates = _coordinates;

    function geometryFunction(coordinates, geometry) {
        const c = Object.assign([], coordinates)
        if ((c.length == 2 && _coordinates.length == !2) || c.length === _coordinates.length + 1) {
            if (c.length == 2) {
                _coordinates.push(c[0])
                _coordinates.push(c[1])
            } else {
                if (!_coordinates.includes(c[c.length - 1])) {
                    _coordinates.push(c[c.length - 1]);
                }
            }
            let startPoint = _coordinates[_coordinates.length - 2];
            let endPoint = _coordinates[_coordinates.length - 1];

            if (c.length > 2 && startPoint.toString() === endPoint.toString()) {
                _coordinates.pop();
                startPoint = _coordinates[_coordinates.length - 2];
            }
            const [BDstartlng, BDstartlat] = gcoord.transform(startPoint, // 经纬度坐标
                gcoord.EPSG3857, // 当前坐标系
                gcoord.BD09 // 目标坐标系
            );
            const [BDendlng, BDendlat] = gcoord.transform(endPoint, // 经纬度坐标
                gcoord.EPSG3857, // 当前坐标系
                gcoord.BD09 // 目标坐标系
            );
            var start = new BMap.Point(BDstartlng, BDstartlat);
            var end = new BMap.Point(BDendlng, BDendlat);
            var walking = new BMap.DrivingRoute(start);
            walking.setSearchCompleteCallback(results => {
                isguo = true;
                if (Object.keys(results).length > 0) {
                    let latlngGroup = results
                        .getPlan(0)
                        .getRoute(0)
                        .getPath();
                    let WGlatlng = latlngGroup.map(i => {
                        const latlng = gcoord.transform([i.lng, i.lat], // 经纬度坐标
                            gcoord.BD09, // 当前坐标系
                            gcoord.EPSG3857 // 目标坐标系
                        );
                        return latlng
                    });
                    this._path.push(WGlatlng)
                    let coordinates1 = [];
                    this._path.forEach(c2 => {
                        coordinates1 = coordinates1.concat(c2)
                    })
                    geometry.setCoordinates(coordinates1);
                } else {
                    this.dispatchEvent({
                        type: "noPlan",
                        data: "无法获取到目标点的道路信息"
                    })
                }
            });
            if (isguo) {
                isguo = false
                walking.search(start, end);
            }
        }

        if (geometry) {
        } else {
            this._LineGeometry = geometry = new LineString([]);
        }
        return geometry
    }
    return geometryFunction
}

export default class RoadLineBaidu extends Draw {
    constructor(options) {
        const geometryFunction = RoadLine()
        const coordinates = geometryFunction.coordinates
        // 样式
        if (!options.style) {
            options.style = [
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
                        })
                    }),
                    geometry: function () {
                        return new MultiPoint(coordinates);
                    }
                })
            ]
        }
        options.geometryFunction = geometryFunction
        super(options);

        this.coordinates = coordinates;
        const removeLastPoint = this.removeLastPoint.bind(this)
        this.removeLastPoint = function () {
            removeLastPoint()
            this._path.pop()
            let _coordinates = [];
            this._path.forEach(c => {
                _coordinates = _coordinates.concat(c)
            })
            coordinates.pop();
            this._LineGeometry.setCoordinates(_coordinates)
        }
        /**
         * 找到的路径的聚合 
         * @type { Array<Array<[lng:number,lat:number]>>}
         */
        this._path = []
        const finishDrawing = this.finishDrawing.bind(this);
        this.finishDrawing = function () {
            finishDrawing(); // 调用父类的
            coordinates.length = 0;
            this._path.length = 0;
        }

    }
    //无方案时触发事件
    // on(type: 'noPlan', listener: (evt: {data:string,type:"noPlan"}) => void): EventsKey;
}
