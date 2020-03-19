import {Fill, Stroke, Circle, Style} from 'ol/style';

export function createStyle(strokeStyle, strokeColor, fillColor, fillOpacity) {
    if (fillColor.includes('rgb')) fillColor = fillColor.replace(')', `, ${fillOpacity})`)
    let style;
    switch (strokeStyle) {
        case 'solid': {
            style = new Style({
                fill: new Fill({color: fillColor}),
                stroke: new Stroke({color: strokeColor, width: 2})
              });
        }
        break;
        case 'dash': {
            style = new Style({
                fill: new Fill({color: fillColor}),
                stroke: new Stroke({color: strokeColor, width: 2, lineDash:[1,2,3,4,5,6], lineDashOffset: 2})
              });
        }
        break;
    }
    
    return style
}