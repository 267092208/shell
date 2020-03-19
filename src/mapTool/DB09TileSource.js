import TileGrid from 'ol/tilegrid/TileGrid';
import XYZ from 'ol/source/XYZ';
export const resolutions = [];
for (var i = 0; i < 20; i++) {
    resolutions.push(Math.pow(2, 18 - i));
}
function tileUrlFunction(tileCoord) {
    if (!tileCoord) return '';
    let [z, x, y] = tileCoord;
    const Urls = this.getUrls();
    const length = Urls.length;
    let url = Urls[Math.abs(x % length)]
    y = -y - 1;
    if (x < 0) x = "M" + (-x);
    if (y < 0) y = "M" + (-y);
    url = url.replace("{x}", x)
    url = url.replace("{y}", y)
    url = url.replace("{z}", z)
    return url
}
/**
 * @constructor 
 */
export default class DB09TileSource extends XYZ {
    /**
     * tileGrid 无效 
     * tileUrlFunction 无效
     * @param {*} opts 
     */
    constructor(opts) {
        opts.tileGrid = new TileGrid({
            origin: [0, 0],
            resolutions
        });
        opts.tileUrlFunction = tileUrlFunction
        super(opts);
    }
}