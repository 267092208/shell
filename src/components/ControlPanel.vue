<template>
  <transition
    appear
    appear-class="fade-enter"
    appear-to-class="fade-leave"
    appear-active-class="fade-enter-active"
  >
    <component v-loading="currentLayer == null" :is="getCurrentLayerName"></component>
  </transition>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import asyncComponent from "@/assets/js/asyncComponent";

export default {
  computed: {
    ...mapState({
      currentLayer: state => state.layer.currentLayer,
      base: state => state.layer.base
    }),
    getCurrentLayerName() {
      if (this.currentLayer != null) {
        let layer = this.currentLayer.id;
        return this.currentLayer.id || "gsyz";
      } else {
        this.$store.dispatch("clear", {
          position: "bottom"
        });
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
    }),
    ma: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/MAInfo")
    }),
    nti: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/NTI")
    }),
    gsnti: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/quickNTI")
    }),
    poi: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/poi")
    }),
    corridor: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/corridor")
    }),
    xzqh: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/xzqh")
    }),
    target: () => ({
            ...asyncComponent,
      component: import("@/components/controlPanel/components/target")
    }),
    poigroups: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/poigroups")
    }),
    sq: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/sq")
    }),
    roadnetwork: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/roadnetwork")
    }),
    lsd: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/lsd")
    }),
    scyk: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/scyk")
    }),
    lpglng: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/lpglng")
    }),
    xl: () => ({
      ...asyncComponent,
      component: import("@/components/controlPanel/components/xl")
    })
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
      'title' in this.$parent && (this.$parent.title = `操作面板 (Alt+2)-当前图层:${val.name}`)
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