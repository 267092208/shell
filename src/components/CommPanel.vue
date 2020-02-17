<template>
  <!-- 动画定义在 assets/css文件夹下中的transition.scss -->
  <transition :name="position">
    <div
      :style="cssStyle"
      :class="[position,'commpanel',(['right','left'].includes(position)&&cssStyle.bottom!==0)?'border-bottom':'']"
      v-show="visible"
    >
      <div class="container">
        <!-- 关闭按钮 -->
        <!-- <button type="button" aria-label="Close" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button> -->
        <el-button
          v-if="closeButton"
          data-panel-noclose="true"
          @click="close"
          :class="[title?'':'shallowcolor','close'] "
          type="text"
        >
          <i class="el-icon el-icon-close"></i>
        </el-button>
        <!-- 标题 -->
        <div v-if="title" class="title">{{title}}</div>
        <!-- 显示内容 -->
        <div :style="{height:`calc(100% - ${title?'44px':'0px'}`}" class="component-container">
          <keep-alive>
            <!--  -->
            <component @hook:mounted="childMounted" ref="childComponent" :is="childComponent" />
          </keep-alive>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    /**
     * 停靠位置
     * 'left'|'right'|'bottom'
     */
    position: {
      type: String,
      default: "left"
    },
    /**
     * 关闭前的回调，会取消原来的Drawer的关闭，第一个才是当前 position值
     */
    beforeClose: {
      type: Function,
      default: null
    },
    /**
     * 是否显示 Drawer，支持 .sync 修饰符;
     */
    visible: {
      type: Boolean,
      default: false
    },
    /**
     * 内容组件名称
     */
    childComponent: {
      type: String,
      default: ""
    },
    cssStyle: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      /**
       * 标题
       * 标题无内容，就不显示标题
       * 修改标题请使用 this.$emit("update:title","标题")
       * 默认无标题
       */
      title: "",
      /**
       * 是否显示关闭按钮
       */
      closeButton: true,
      /**
       * 当点击面板外的位置，面板是否自动消失
       */
      autoClose: true,
      /**
       * 点击面板外的位置事件源
       */
      autoCloseEve: null,
      isClosed:false
    };
  },
  methods: {
    async close() {
      if (this.beforeClose) {
        await this.beforeClose(this.position);
      } else {
        try {
          this.$emit("update:visible", false);
        } catch (error) {
          throw "visible 请使用 .sync修饰符";
        }
      }
      //关闭恢复设置
      this.title = "";
      this.closeButton = true;
      this.autoClose = true;
      this.afterClose();
      this.afterClose = function() {};
    },
    /**
     * 关闭后的函数
     *  同子组件beforeDestroy
     */
    afterClose: function() {},
    childMounted() {
      this.$nextTick(() => {
        this.$refs.childComponent &&
          this.$refs.childComponent.init &&
          this.$refs.childComponent.init();

          this.isClosed = true
      });


    }
  },
  watch: {
    childComponent(value) {
      if (!value) {
        this.close();
      } else {
        this.$nextTick(() => {
          this.$refs.childComponent &&
            this.$refs.childComponent.init &&
            this.$refs.childComponent.init();
        });
      }
      // console.log("childComponent", this.$refs.childComponent)
    }
  },
  beforeCreate() {
    window.removeEventListener("click", this.autoCloseEve);
    window.addEventListener(
      "click",
      (this.autoCloseEve = eve => {
        if (this.autoClose) {
          if (this.$el && !eve.path.includes(this.$el)) {
            if (this.visible) {
              for (let i = 0; i < eve.path.length; i++) {
                const element = eve.path[i];
                if (element.getAttribute) {
                  if (
                    element.getAttribute("data-panel-name") ===
                      this.childComponent ||
                    element.getAttribute("data-panel-noclose")
                  ) {
                    return;
                  }
                }
              }
              if (
                true ===
                  eve.path
                    .map(item => item.className)
                    .includes("el-picker-panel__body") ||
                true ===
                  eve.path
                    .map(item => item.className)
                    .includes("el-picker-panel__footer") ||
                true ===
                  eve.path
                    .map(item => item.className)
                    .includes("el-time-panel el-popper")
              ) {
                // dont close
              } else {
                if(this.isClosed){
                  this.close();
                }
                
            
                
              }
            }
          }
        }
      }),
      true
    );
  },
  mounted() {
    this.afterClose = function() {};
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/public.scss";
.autoClose {
  position: fixed;
  z-index: -1;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.border-bottom {
  border-bottom: 5px solid #dcdfe6;
}
.left {
  width: 350px;
  top: 0;
  bottom: 0;
}
.right {
  width: 350px;
  top: 0;
  bottom: 0;
  right: 0;
}
.bottom {
  height: 280px;
  bottom: 0;
  left: 0;
  right: 0;
}
.top {
  left: 0;
  right: 0;
  height: 250px;
  top: 0;
}
.commpanel {
  color: $shallow-font-color;
  // padding: 10px;
  transition: all 0.2s ease;
  position: absolute;
  z-index: $panel-index;
  box-shadow: $panel-shadow;
  background-color: $theme-bg-color;
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .close {
      position: absolute;
      top: 0px;
      right: 0px;
      padding: 10px;
      color: $deep-font-color;
      font-size: 18px;
      &.shallowcolor {
        color: $shallow-font-color;
      }
      &:hover {
        color: $hover-font-color;
      }
    }
    .title {
      color: $deep-font-color;
      padding: 10px;
      font-size: 16px;
      background-color: $theme-color;
      width: 100%;
      box-sizing: border-box;
    }
    .component-container {
      position: relative;
      overflow: auto;
      overflow-x: hidden;
    }
  }
}
</style>