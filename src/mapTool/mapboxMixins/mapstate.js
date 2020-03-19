import { mapState } from 'vuex';
import { map } from './map';
import ol from "ol"
const mixin = {
    computed: {
        ...mapState({
            inputBounds: state => state.mapState.inputBounds,
            inputCenter: state => state.mapState.inputCenter,
            inputZoom: state => state.mapState.inputZoom,
        })
    },
    methods: {
        async initMapState() {
            map.on('statechanged', () => {
                this.updateMapState();
            });
            this.updateMapState();
        },
        updateMapState() {
            this.$store.state.mapState.bounds = map.getBounds();

            const newcenter = map.getCenter();
            const center = this.$store.state.mapState.center;
            if (!center || (center.x != newcenter.x || center.y != newcenter.y)) {
                this.$store.state.mapState.center = newcenter;
            }

            const newzoom = map.getZoom();
            const zoom = this.$store.state.mapState.zoom;
            if (!zoom || (zoom != newzoom)) {
                this.$store.state.mapState.zoom = newzoom;
            }
        }
    },
    watch: {
        inputBounds(val) {
            val && map.setBounds(val);
        },
        inputCenter(val) {
            val && map.setCenter(val);
        },
        inputZoom(val) {
            val && map.setZoom(val);
        }
    }
};

export default mixin;