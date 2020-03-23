<template>
  <!-- 弹窗 -->
  <div v-show="visible" ref="popup" class="ol-popup">
    <a v-if="isPopupcloser" @click="popupcloser" class="ol-popup-closer"></a>
    <div class="ol-popup-content" v-html="popupContent"></div>
    <div class="buttonGroup" v-if="buttonGroup.length != 0">
      <template v-for="(item,index) in buttonGroup">
        <div :key="index" style="display:inline-block">
          <el-tooltip class="item" effect="dark" :content="item.buttonText" placement="bottom">
            <i :class="item.className" style="cursor: pointer" @click="item.event"></i>
          </el-tooltip>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Overlay from 'ol/Overlay';
import { map } from '@/mapTool/mapboxMixins2/map';
import { mapState } from 'vuex';
// 弹窗
/**
 * 
 * @type {Overlay}
 */
let popup = null;
export default {
  data() {
    return {
      /**
      * @type {string }
      */
      popupContent: "",
      buttonGroup: [],
      /**
       * 是否有关闭按钮
       */
      isPopupcloser: false,
      visible: false
    }
  },
  computed: {
    ...mapState({
      popupOptions: state => state.popup.popupOptions,
      popupcloser6666: state => state.popup.popupcloser
    })
  },
  methods: {
    async initPopup() {
      popup = new Overlay({
        positioning: "bottom-center",
        element: this.$refs.popup,
        autoPan: true,
        autoPanAnimation: {
          duration: 10
        },
        offset: [0, 0]
      });
      map.addOverlay(popup);
    },
    popupcloser() {
      popup.setPosition(null);
      this.buttonGroup = [];
      return false;
    },
    popupIsVisible() {
      return (popup.getPosition() == null) ? false : true
    },
    /**
    * @param {{
    * position:[number,number],
    * popupContent?:string,
    * isPopupcloser?:boolean, 
    * move?:[number,number]
    * buttonGroup?:[{
    *     className?:string,
    *     event?:function,
    *     buttonText?:string,
    *   }]
    * }} options 
    */
    openPopup(options) {
      this.visible = true;
      console.log("openPopup", options);
      let { position, popupContent, isPopupcloser, move, buttonGroup = [] } = options;
      popupContent = popupContent ? popupContent : '';
      popup.setPosition(position);
      this.isPopupcloser = isPopupcloser;
      this.popupContent = popupContent;
      this.buttonGroup = buttonGroup;
      setTimeout(() => {
        const x = this.$refs.popup.getBoundingClientRect().width / 2;
        const offset = move ? [48 - x + move[0], 0 + move[1]] : [48 - x, 0]
        popup.setOffset(offset)
      }, 1)
    }
  },
  watch: {
    /**
    * @type {{
    * position:[number,number],
    * popupContent?:string,
    * isPopupcloser?:boolean,
    * move?:[number,number],
    * buttonGroup?:[{
    *     className?:string,
    *     event?:function,
    *     buttonText?:string,
    *   }]
    * }}
    */
    popupOptions(popupOptions) {
      this.openPopup(popupOptions)
    },
    popupcloser6666() {
      this.popupcloser()
    }
  }
}
</script>

<style lang="scss" scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 80px;
  .ol-popup-content {
    white-space: nowrap;
    width: inherit;
    display: block;
    min-width: 66px;
    padding: 0 3px;
  }
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 50%;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 50%;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  &:hover {
    cursor: pointer;
    color: rgb(3, 1, 51);
  }
}
.ol-popup-closer:after {
  content: "✖";
}
.buttonGroup {
  text-align: right;
  margin-top: 3px;
  padding-top: 3px;
  border-top: #e2e2e2 solid 1px;
  .note {
    padding: 5px 10px;
    border-radius: 4px;
    background: #303133;
    font-size: 12px;
    position: absolute;
    bottom: -20px;
    right: 0px;
    color: #fff;
    opacity: 0;
    transition: 0.5s;
    z-index: 500;
    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-bottom-color: #303133;
      top: -16px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  i:hover + .note {
    opacity: 1;
  }
}
</style>