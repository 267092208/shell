import CanvasTileLayerRenderer from 'ol/renderer/canvas/TileLayer';
import gcoord from 'gcoord';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileGrid from 'ol/tilegrid/TileGrid';

class DB09CanvasTileRenderer extends CanvasTileLayerRenderer {
    // 当渲染DB09图层的时候，修改渲染的中心点和范围
    renderFrame(frameState, target) {
        // 保存视图状态(不能使用克隆帧状态对象的方法，会导致图层加载状态丢失，无法完整显示完)
        const viewStateSave = frameState.viewState;
        const extentSave = frameState.extent;
        // 计算对应的DB09投影坐标
        const viewState = frameState.viewState;
        const nc = gcoord.transform(viewState.center, gcoord.EPSG3857, gcoord.BD09Meter);
        // 修改渲染范围
        const dx = viewState.center[0] - nc[0];
        const dy = viewState.center[1] - nc[1];
        frameState.viewState = {
            center: nc,
            projection: frameState.viewState.projection,
            resolution: frameState.viewState.resolution,
            rotation: frameState.viewState.rotation,
            zoom: frameState.viewState.zoom
        };
        frameState.extent = [
            frameState.extent[0] - dx,
            frameState.extent[1] - dy,
            frameState.extent[2] - dx,
            frameState.extent[3] - dy
        ];
        const result = super.renderFrame(frameState, target);
        // 恢复视图状态
        frameState.viewState = viewStateSave;
        frameState.extent = extentSave;
        return result;
    }
}

export default class DB09TileLayer extends TileLayer {
    // constructor(opts) {
    //     super(opts);
    //     console.log(opts)
    //     const resolutions = [];
    //     for (var i = 0; i < 19; i++) {
    //         resolutions.push(Math.pow(2, 18 - i));
    //     }
    //     // this.setSource(new XYZ({
    //     //     tileGrid: new TileGrid({
    //     //         origin: [0, 0],
    //     //         resolutions
    //     //     }),
    //     //     tileUrlFunction: function (tileCoord) {
    //     //         if (!tileCoord) return '';
    //     //         let [z, x, y] = tileCoord;
    //     //         y = -y - 1;
    //     //         if (x < 0) x = "M" + (-x);
    //     //         if (y < 0) y = "M" + (-y);
    //     //         return `http://online${Math.abs(tileCoord[1] % 4)}.map.bdimg.com/onlinelabel/?qt=tile&x=${x}&y=${y}&z=${z}&styles=pl&udt=20151021&scaler=1&p=1`
    //     //     }
    //     // }));
    // }
    createRenderer() {
        return new DB09CanvasTileRenderer(this);
    }
}