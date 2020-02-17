import { mapState } from 'vuex';
import { map } from './map';
//TODO:编辑方式改为可连续
var drawPromise;
function getDraw() {
    if (!drawPromise) {
        return drawPromise = new Promise(r => {
            const draw = HTmap.draw(map, {});
            r(draw);
        });
    }
    else {
        return drawPromise;
    }
}
let drawCompleteEve = null;

const mixin = {
    computed: {
        ...mapState({
            drawMode: state => state.geometry.drawMode,
            geometryInstance: state => state.geometry.geometryInstance
        })
    },
    watch: {
        /**
         * 当点击模式被设置后，执行绘制
         * @param {'point'|'line'|'polygon'|'circle'|'rectangle'|null} mode 
         */
        async drawMode(mode) {
            if (mode) {
                // 绘制
                const draw = await getDraw();
                draw.enable();
                draw.changeMode(mode)
                if (!drawCompleteEve) {
                    draw.on("draw.complete", drawCompleteEve = (t) => {
                        if (t.features[0]) {
                            const geometry = t.features[0].geometry
                            this.$store.dispatch("setGeometry", geometry);
                        }
                    })
                    draw.on("draw.update", drawCompleteEve = (t) => {
                        if (t.features[0]) {
                            const geometry = t.features[0].geometry
                            this.geometryInstance.emit("update", geometry)
                        }
                    })
                }
            }
            else {
                const draw = await getDraw();
                draw.disable();
                // 若设置模式为null，则结束绘制，设置几何为null
                this.$store.dispatch("setGeometry", null);
            }
        }
    }
}

export default mixin;