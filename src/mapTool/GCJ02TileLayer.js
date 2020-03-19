import CanvasTileLayerRenderer from 'ol/renderer/canvas/TileLayer';
import gcoord from 'gcoord';
import TileLayer from 'ol/layer/Tile';

class GCJ02CanvasTileRenderer extends CanvasTileLayerRenderer{
    // 当渲染GCJ02图层的时候，修改渲染的中心点和范围
    renderFrame(frameState, target){
        // 保存视图状态(不能使用克隆帧状态对象的方法，会导致图层加载状态丢失，无法完整显示完)
        const viewStateSave = frameState.viewState;
        const extentSave = frameState.extent;
        // 计算对应的GCJ02投影坐标
        const viewState = frameState.viewState;
        const gps = gcoord.transform(viewState.center, gcoord.EPSG3857, gcoord.EPSG4326);
        const gcj02 = gcoord.transform(gps, gcoord.EPSG4326, gcoord.GCJ02);
        const nc = gcoord.transform(gcj02, gcoord.EPSG4326, gcoord.EPSG3857);
        // 修改渲染范围
        const dx = viewState.center[0] - nc[0];
        const dy = viewState.center[1] - nc[1];
        frameState.viewState = {
            center:nc,
            projection:frameState.viewState.projection,
            resolution:frameState.viewState.resolution,
            rotation:frameState.viewState.rotation,
            zoom:frameState.viewState.zoom
        };
        frameState.extent = [
            frameState.extent[0]-dx,
            frameState.extent[1]-dy,
            frameState.extent[2]-dx,
            frameState.extent[3]-dy
        ];
        const result = super.renderFrame(frameState, target);
        // 恢复视图状态
        frameState.viewState=viewStateSave;
        frameState.extent=extentSave;
        return result;
    }
}

export default class GCJ02TileLayer extends TileLayer{
    createRenderer(){
        return new GCJ02CanvasTileRenderer(this);
    }
}