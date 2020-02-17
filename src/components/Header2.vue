<template>
  <header>
    <div class="header-left">
      <div class="logo">
        <img src="~@/assets/images/yclogo.png" alt="yclogo" />
        延长壳牌(广东)石油有限公司
        <img src="~@/assets/images/shelllogo.png" alt="shelllogo" />
        电子地图系统
      </div>
    </div>
    <div class="header-right">
      <el-button
        data-panel-name="filters"
        @click="togglePanel('filters')"
        :class="currentPath('filters')==='filters'?'is-active':''"
        class="button"
        type="text"
      >筛选</el-button>
      <el-button
        data-panel-name="actions"
        @click="togglePanel('actions')"
        :class="currentPath('actions')==='actions'?'is-active':''"
        class="button"
        type="text"
      >操作</el-button>
      <el-button
        data-panel-name="layerlist"
        @click="togglePanel('layerlist')"
        :class="currentPath('layerlist')==='layerlist'?'is-active':''"
        class="button"
        type="text"
      >图层</el-button>

      <el-button class="button" type="text">操作记录</el-button>
      <el-button class="button" type="text">导出地图</el-button>
      <!-- 用户信息 -->
      <el-dropdown size="medium">
        <el-button class="button" type="text">系统设置</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in systemSetup" :key="key">
            <i :class="item.icon" class="iconfont"></i>
            {{item.name}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button class="button" type="text">系统设置</el-button> -->
      <!-- 用户信息 -->
      <el-dropdown size="medium" @command="handleUser">
        <el-button class="button" icon="el-icon-user-solid" type="text">{{user.Name}}</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="openUserManagement">
            <i class="iconfont icon-yonghuguanli"></i>用户管理
          </el-dropdown-item>
          <el-dropdown-item command="openPrivilegeManagement">
            <i class="iconfont icon-xitongquanxianguanli"></i>权限管理
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="iconfont icon-exit-door"></i>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex";
import { deepCopy } from "../assets/js/utils.js";
export default {
  data() {
    return {
      systemSetup: [
        {
          name: "油站样式设置",
          icon: "icon-youzhanchaxun"
        },
        {
          name: "MA样式设置",
          icon: "icon-duobianxing"
        },
        {
          name: "POI Groups样式设置",
          icon: "icon-poi"
        },
        {
          name: "Corridor样式设置",
          icon: "icon-luxian"
        },
        {
          name: "路网样式设置",
          icon: "icon-luxian"
        },
        {
          name: "行政区划样式设置",
          icon: "icon-xingzhengsvg"
        },
        {
          name: "零售店样式设置",
          icon: "icon-dianpu1"
        },
        {
          name: "线路样式设置",
          icon: "icon-luxian"
        },
        {
          name: "LPG/LNG样式设置",
          icon: "icon-new-"
        }
      ]
    }
  },
  computed: {
    ...mapState({
      panelVisible: state => state.panel.panelVisible,
      routMap: state => state.panel.routMap,
      panelComponent: state => state.panel.panelComponent,
      currentLayer: state => state.layer.currentLayer,
      user: state => state.user.user
    })
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
    handleUser(val) {
      this[val]();
    },
    openUserManagement() {

    },
    openPrivilegeManagement() {

    },
    /**
     * 退出登录
     */
    logout() {
      this.$confirm("是否要退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const message = this.$message({
            message: '正在退出请等候....',
            type: 'success',
            showClose: true,
            duration: 0
          });
          this.$store.dispatch("logout").then(() => {
            message.close()
            window.location.reload()
          }).catch(() => {
            const message = this.$message({
              showClose: true,
              message: '退出失败，请重试',
              type: 'error'
            });
          })
        })
        .catch(() => {

        });
    }
  },
}
</script>

<style lang="scss" >
@import "@/assets/css/public.scss";
header {
  .el-button {
    font-size: 16px;
  }
  .el-button:active,
  .el-button--text:focus {
    color: $deep-font-color !important;
  }
  height: 50px;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
  box-shadow: $header-shadow;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  background: $header-bg;
  padding: 0px 30px;
  transition: background-color 0.4s ease 0s;
  .header-left {
    height: 100%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    flex: 1 1 0%;
    .logo {
      color: $deep-font-color;
      display: flex;
      -webkit-box-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      align-items: center;
      font-size: 16px;
    }
  }

  .button {
    padding: 15px 10px;
    border: none;
    border-bottom: 2px solid $header-bg;
    color: $deep-font-color;
    font-size: 16px;
    &:hover {
      background-color: $hover-bg-color;
    }
    &.is-active {
      color: $theme-color !important;
      border-bottom-color: $theme-color !important;
    }
  }
  .header-right {
    margin-left: 50px;
    height: 100%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }
}
</style>