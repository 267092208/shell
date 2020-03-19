import { map } from './map';
import { mapState } from 'vuex';

import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';
import { getArea, getLength } from 'ol/sphere';
import { LineString, Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';



/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = '单击确定地点,双击结束';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = '单击确定地点,双击结束';


/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = '点击地图开始测量';

    if (sketch) {
        var geom = sketch.getGeometry();
        if (geom instanceof Polygon) {
            helpMsg = continuePolygonMsg;
        } else if (geom instanceof LineString) {
            helpMsg = continueLineMsg;
        }
    }
    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);
};



var draw; // global so we can remove it later

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
    var length = getLength(line);
    var output;
    if (length > 1000) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + '公里';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + '米';
    }
    return output;
};


/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
    var area = getArea(polygon);
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + '平方公里';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + '平方米';
    }
    return output;
};

var source;
var vector;

function addInteraction(mode, closecallback) {
    var type = (mode == 'area' ? 'Polygon' : 'LineString');
    draw = new Draw({
        source: source,
        type: type,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new Stroke({
                color: 'rgb(51,136,255)',
                lineDash: [10, 10],
                width: 3
            }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        }),
        stopClick: true
    });
    map.addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    var listener;
    draw.on('drawstart',
        function (evt) {
            if (source.getFeatures().length) {
                source.clear();
                createMeasureTooltip();
            }

            // set sketch
            sketch = evt.feature;

            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        });

    draw.on('drawend',
        function () {
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            // measureTooltipElement = null;
            // createMeasureTooltip();
            unByKey(listener);
            // 绘制结束后直接禁用继续绘制的模式
            draw.setActive(false);
            helpTooltip && map.removeOverlay(helpTooltip);
            // 显示一个叉叉按钮用来关闭测量结果
            const closebutton = document.createElement('span');
            closebutton.innerHTML = `<i class="el-icon-error"></i>`;
            closebutton.style.cursor = 'pointer';
            closebutton.onclick = closecallback;
            measureTooltipElement.appendChild(closebutton);
        });
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    helpTooltipElement.style.borderRadius = '4px';
    helpTooltipElement.style.color = 'white';
    helpTooltipElement.style.padding = '4px 8px';

    helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    measureTooltipElement.style.borderRadius = '4px';
    measureTooltipElement.style.color = 'white';
    measureTooltipElement.style.padding = '4px 8px';

    // measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}

function helpTooltipElementHide() {
    helpTooltipElement.classList.add('hidden');
}

var installed = false;

function setup() {
    if (!installed) {
        source = new VectorSource();
        vector = new VectorLayer({
            source: source,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.5)'
                }),
                stroke: new Stroke({
                    color: 'rgb(51,136,255)',
                    width: 3
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        map.addLayer(vector);
        map.on('pointermove', pointerMoveHandler);
        map.getViewport().addEventListener('mouseout', helpTooltipElementHide);
        installed = true;
    }
}

function uninstall() {
    if (installed) {
        map.removeLayer(vector);
        map.un('pointermove', pointerMoveHandler);
        map.getViewport().removeEventListener('mouseout', helpTooltipElementHide);
        installed = false;
    }
}

const mixin = {
    computed: {
        ...mapState({
            measureMode: state => state.measure.mode,
        })
    },
    methods: {
    },
    watch: {
        measureMode(val) {
            draw && map.removeInteraction(draw);
            helpTooltip && map.removeOverlay(helpTooltip);
            measureTooltip && map.removeOverlay(measureTooltip);
            source && source.clear();
            if (val) {
                setup();
                addInteraction(val, () => this.$store.dispatch("clearMeasure"));
            }
            else {
                uninstall();
            }
        }
    }
}

export default mixin;