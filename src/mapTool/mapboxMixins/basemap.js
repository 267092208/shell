import { mapState } from 'vuex';
import { map } from './map';
import {
    baseMapRasterSource,
    baseMapRasterLayer,
    baseMapGeojsonSource,
    baseMapGeojsonLayer,
    baseMapSourceList
} from "../baseMapData"
import BaseMapSource from '@/components/mapTool/BaseMapSource.vue'

const mixin = {
    data() {
        return {
            baseMapSourceList: baseMapSourceList,
        }
    },
    components: {
        BaseMapSource
    },
    computed: {
        ...mapState({
            currentBaseMapSource: state => state.basemap.currentBaseMapSource,
        })
    },
    methods: {
        async initBasemap() {
            map.addLayer(baseMapRasterLayer);
        },
        setCurrentBaseMapSource(val) {
            this.$store.dispatch("setCurrenBaseMapSource", val);
        }
    },
    watch: {
        currentBaseMapSource(val, oldVal) {
            const baseMapRasterLayerVisible = val.layerType === "baseMapRasterLayer";
            // baseMapRasterLayer.setVisible(baseMapRasterLayerVisible)
            if (baseMapRasterLayerVisible) {
                baseMapRasterLayer.setSource(baseMapRasterSource[val.sourceKey])
                map.setLayerIndex(baseMapRasterLayer, 0);
            }
            //TODO: baseMapGeojsonLayer 图层目前未实现
            const baseMapGeojsonLayer = val.layerType === "baseMapGeojsonLayer";
        }
    }
};

export default mixin;