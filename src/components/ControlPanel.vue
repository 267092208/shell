<template>
  <transition
    appear
    appear-class="fade-enter"
    appear-to-class="fade-leave"
    appear-active-class="fade-enter-active"
  >
    <component v-loading="currentLayer == null" :is="getCurrentLayerName" :title="this.title"></component>
  </transition>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import asyncComponent from "@/assets/js/asyncComponent";
import hadStation from "@/components/controlPanel/components/hadStation";
import quickGasStation from "@/components/controlPanel/components/quickGasStation";
import shellGasStation from "@/components/controlPanel/components/shellGasStation";

export default {
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      base: state => state.layer.base
    }),
    getCurrentLayerName() {
      if (this.currentLayer != null) {
        let layer = this.currentLayer.id;
        this.title = this.currentLayer.name;
        return this.currentLayer.id || "gsyz";
      } else {
        // if (this.$store.state.panel.panelVisible  && this.$store.state.panel.panelComponent.bottom === 'actions' ) {
        // if (this.$store.getters.isOpenWithCName('actions')) {
        this.$store.dispatch("clear", {
          position: "bottom"
        });
        // }
        return null;
      }
    }
  },
  data() {
    return {
      /**
       * @type [{id, name}]
       */
      layerMap: {}
    };
  },
  created() {},
  mounted() {
    // this.$parent.title = `操作面板 (Alt+2)-当前图层:${this.currentLayer.name}`;
    // this.$parent.autoClose = false;
  },
  components: {
    shellyz: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/shellGasStation")
    }),
    gsyz: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/quickGasStation")
    }),
    xyyz: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/hadStation_to")
    })
    // shellyz: shellGasStation,
    // gsyz: quickGasStation,
    // xyyz: hadStation
  },
  methods: {
    init(){
       this.currentLayer && (this.$parent.title = `操作面板 (Alt+2)-当前图层:${this.currentLayer.name}`);
        this.$parent.autoClose = false;
    }
  },
  watch: {
    currentLayer (val) {
      if (val)
      this.$parent.title = `操作面板 (Alt+2)-当前图层:${val.name}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
  transition-delay:  0.2s;
  transition-timing-function: ease-in;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  // width: 0%;
}
.fade-leave {
  opacity: 1;
}
</style>