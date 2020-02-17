<template>
  <el-menu
    class="el-menu"
    mode="horizontal"
    background-color="#0072c6"
    text-color="#fff"
    menu-trigger="click"
    active-text-color="#f5d224"
    :unique-opened="true"
    :default-active="defaultActive"
  >
    <el-menu-item class="no-is-active" index="logo">
      <img src="~@/assets/images/yclogo.png" alt="yclogo" />
      延长壳牌(广东)石油有限公司
      <img src="~@/assets/images/shelllogo.png" alt="shelllogo" />
      电子地图系统
    </el-menu-item>
    <el-menu-item
      data-panel-name="filters"
      @click="togglePanel('filters')"
      :class="currentPath('filters')==='filters'?'is-active':'no-is-active'"
    >
      <a>筛选</a>
    </el-menu-item>
    <el-menu-item
      data-panel-name="actions"
      @click="togglePanel('actions')"
      :class="currentPath('actions')==='actions'?'is-active':'no-is-active'"
    >
      <a>操作</a>
    </el-menu-item>
    <el-menu-item
      ref="searchInput"
      data-panel-name="layerlist"
      @click="togglePanel('layerlist')"
      :class="currentPath('layerlist')==='layerlist'?'is-active':'no-is-active'"
    >
      <a>图层</a>
    </el-menu-item>
    <!-- <el-menu-item class="no-is-active" index="searchInput" ref="searchInput">
      <el-input
        id="searchInput"
        v-model="inputData"
        placeholder="油站编号或名称(Esc清除结果)"
        title="油站编号或名称(Esc清除结果)"
      ></el-input>
    </el-menu-item>-->
    <!-- 更多功能 -->
    <el-submenu v-show="isHavaRetractMenu" class="floatRight retract" index="retract">
      <template slot="title">
        <span class="iconfont icon-menu"></span>
      </template>
      <template v-for="(menu,index) in retractMenu">
        <el-menu-item
          :class="'retract'+index"
          v-if="!menu.submenus&&menu.isRetractMenu"
          :key="index"
          :index="'rightMenu'+index"
        >{{menu.title}}</el-menu-item>
        <!-- 有子菜单 -->
        <el-submenu
          v-if="menu.submenus&&menu.isRetractMenu"
          :key="index"
          :popper-append-to-body="true"
          :class="'retract'+index"
          :index="'rightMenu'+index"
        >
          <template slot="title">{{menu.title}}</template>
          <el-menu-item
            v-for="(submenu,submenuIndex) in menu.submenus"
            :key="submenuIndex"
            :index="'rightMenu'+index+submenuIndex"
          >{{submenu.title}}</el-menu-item>
        </el-submenu>
      </template>
    </el-submenu>
    <!-- 右边的功能菜单 -->
    <template v-for="(menu,index) in rightMenu">
      <el-menu-item
        v-if="!menu.submenus&&!menu.isRetractMenu"
        v-show="!menu.isRetractMenu"
        ref="rightMenuDom"
        :key="index"
        :index="'rightMenu'+(rightMenu.length-index-1)"
        :class="'floatRight '+'rightMenu'+index"
      >{{menu.title}}</el-menu-item>
      <!-- 有子菜单 -->
      <el-submenu
        v-if="menu.submenus&&!menu.isRetractMenu"
        v-show="!menu.isRetractMenu"
        ref="rightMenuDom"
        :key="index"
        :class="'floatRight '+'rightMenu'+index"
        :index="'rightMenu'+(rightMenu.length-index-1)"
      >
        <template slot="title">{{menu.title}}</template>
        <el-menu-item
          v-for="(submenu,submenuIndex) in menu.submenus"
          :key="submenuIndex"
          :index="'rightMenu'+(rightMenu.length-index-1)+submenuIndex"
        >{{submenu.title}}</el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import { mapState } from "vuex";
import { deepCopy } from "../assets/js/utils.js";
export default {
  data() {
    return {
      defaultActive: "55555555555",
      inputData: "",
      rightMenu: [
        {
          title: "退出",
          submenus: false,
          isRetractMenu: false
        },
        {
          title: "帮助",
          submenus: false,
          isRetractMenu: false
        },
        {
          title: "权限管理",
          submenus: false,
          isRetractMenu: false
        },
        {
          title: "用户管理",
          submenus: false,
          isRetractMenu: false
        },
        {
          title: "系统设置",
          submenus: [
            {
              title: "油站样式设置"
            },
            {
              title: "MA样式设置"
            },
            {
              title: "POI Groups样式设置"
            },
            {
              title: "Corridor样式设置"
            },
            {
              title: "路网样式设置"
            },
            {
              title: "行政区划样式设置"
            },
            {
              title: "零售店样式设置"
            },
            {
              title: "线路样式设置"
            },
            {
              title: "LPG/LNG样式设置"
            }
          ],
          isRetractMenu: false
        },
        {
          title: "操作记录",
          submenus: false,
          isRetractMenu: false
        },
        {
          title: "导出地图",
          isRetractMenu: false,
          submenus: [
            {
              title: "导出地图"
            }
          ]
        }
      ],
      isHavaRetractMenu: false,
      /**
       * 右边导航的宽度
       */
      leftWidth: 750
    };
  },
  computed: {
    ...mapState({
      panelVisible: state => state.panel.panelVisible,
      routMap: state => state.panel.routMap,
      panelComponent: state => state.panel.panelComponent,
      currentLayer: state => state.layer.currentLayer,
    }),
    retractMenu() {
      const retractMenu = deepCopy(this.rightMenu);
      retractMenu.reverse();
      return retractMenu;
    }
  },
  methods: {
    isPanelVisible(path) {
      return this.panelVisible[this.routMap[path].position]
    },
    currentPath(path) {
      return this.panelComponent[this.routMap[path].position]
    },
    togglePanel(path) {
      // 防卫
      if (path === 'actions' && this.currentLayer == null) {
        this.$message.error({
          message: '请选择图层，后点击',
          offset: 60
        });
        return;
      }

      if (this.currentPath(path) !== path) {
        this.$store.dispatch("replace", {
          path
        });
      } else if (this.isPanelVisible(path) && this.currentPath(path) === path) {
        this.$store.dispatch("clear", {
          position: this.routMap[path].position
        });
      }
    },
    toggleLayersPanel() {
      this.$store.commit("setLayersPanel", !this.layersPanelVisible);
    },
    toggleActionsPane() {
      this.$store.commit("setActionsPane", !this.actionsPanelVisible);
    },
    /**
     * 自适应
     */
    _memuResize() {
      //120是更多菜单的宽度 120
      const width = document.body.clientWidth;
      let rightWidth = this.leftWidth;
      if (width < rightWidth + 120 + this.rightMenu[0].width) {
        rightWidth = rightWidth + 120 + this.rightMenu[0].width;
      } else {
        rightWidth = rightWidth + 120;
      }
      this.rightMenu.forEach((item, index) => {
        if (width <= rightWidth) {
          item.isRetractMenu = true;
        } else {
          item.isRetractMenu = false;
        }
        rightWidth = rightWidth - item.width;
      });
    }
  },
  mounted() {
    /**
     * 自适应
     */
    window.removeEventListener("resize", this._memuResize);
    window.addEventListener("resize", this._memuResize);
    // 初始化数据
    this.leftWidth = this.$refs.searchInput.$el.getBoundingClientRect().right;
    let rightWidth = this.leftWidth;
    // 初始化数据Width
    this.$refs.rightMenuDom.forEach((t, i) => {
      this.rightMenu[i].width = t.$el.clientWidth;
      rightWidth = rightWidth + this.rightMenu[i].width;
    });
    this.leftWidth = rightWidth;
    setTimeout(this._memuResize, 100);
  },
  watch: {
    rightMenu: {
      handler: function (val, oldval) {
        this.isHavaRetractMenu = false;
        for (let i = 0; i < val.length; i++) {
          const m = val[i];
          if (m.isRetractMenu === true) {
            this.isHavaRetractMenu = true;
            break;
          }
        }
      },
      deep: true
    }
  }
};
</script>
<style>
body,
html {
  min-width: 1100px;
  overflow: hidden;
  overflow-x: auto;
}
</style>
<style lang="scss" scoped>
.el-menu {
  width: 100%;
  .floatLeft {
    float: left;
  }
  .floatRight {
    float: right;
  }
  .is-active {
    color: #f5d224 !important;
    border-bottom-color: #f5d224 !important;
  }
  .no-is-active {
    color: #ffffff !important;
    border-bottom-color: transparent !important;
  }
}
</style>

