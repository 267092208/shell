/// 最后开启的面板，拥有最大显示空间

import Vue from "vue";
import asyncComponent from "@/assets/js/asyncComponent";

Vue.component("layerlist", ()=> ({
  ...asyncComponent,
  component: import('@/components/LayerPanel')
}));
Vue.component("filters", ()=> ({
  ...asyncComponent,
  component: import('@/components/FilterPanel')
}));
Vue.component("actions", () => ({
  ...asyncComponent,
  component: import("@/components/ControlPanel.vue")
}));
Vue.component("addLayer", () => ({
  ...asyncComponent,
  component: import("@/components/controlPanel/common/addLayer.vue")
}));
Vue.component('addMA', () => ({
  ...asyncComponent,
  component: import("@/components/controlPanel/MA/newMA.vue")
}));
Vue.component("infoPanel", () => ({
  ...asyncComponent,
  component: import("@/components/infoPanel/infoPanelCopy")
}));
Vue.component("MAinfo", () => ({
  ...asyncComponent,
  component: import("@/components/controlPanel/MA/newMA.vue")
}));
Vue.component('commAddPanel', () => ({
  ...asyncComponent,
  component: import("@/components/controlPanel/common/generalPropertyPanel")
}))
Vue.component('commPropertyPanel', () => ({
  ...asyncComponent,
  component: import("@/components/controlPanel/common/generalPropertyPanel")
}))
Vue.component('createXzqh', () => ({
  ...asyncComponent,
  component: import("@/components/controlPanel/XZQH/createXzqh_to")
}))

const user = {
  state: {
    panelVisible: {
      right: false,
      left: false,
      bottom: false,
      top: false
    },
    panelComponent: {
      right: "",
      left: "",
      bottom: ""
    },
    panelHeightWidth: {
      right: {
        height: "auto",
        width: "350px"
      },
      left: {
        height: "auto",
        width: "350px"
      },
      bottom: {
        height: "210px",
        width: "auto"
      },
      top: {
        height: "280px",
        width: "auto"
      }
    },
    /**
     * 侧边栏的权重 索引越大权重越大
     */
    panelImportance: [],
    /**
     * 配置
     */
    routMap: {
      layerlist: {
        position: "right",
        visible:false
      },
      filters: {
        position: "left"
      },
      actions: {
        position: "bottom"
      },
      addLayer: {
        position: "right"
      },
      addMA: {
        position: "right"
      },
      MAinfo:{
        position: "right"
      },
      infoPanel: {
        position: "right"
      },
      commPropertyPanel: {
        position: "right"
      },
      commAddPanel: {
        position: 'right'
      },
      createXzqh: {
        position: 'right'
      }
    },
    /**
     * 照片状态
     */
    photoStatus: false,
    /** panel 扩展数据 */
    extent: null
  },
  mutations: {},
  actions: {
    replace({ state }, { path, extent }) {
      state.extent = extent;
      const r = state.routMap[path];
      if (!state.panelVisible[r.position]) {
        state.panelVisible[r.position] = true;
      } else if (path !== state.panelComponent[r.position]) {
        state.panelVisible[r.position] = false;
        setTimeout(() => {
          state.panelVisible[r.position] = true;
        }, 200);
      }
      state.panelComponent[r.position] = path;

      const index = state.panelImportance.indexOf(r.position);
      if (index > -1) {
        //存在先删除
        state.panelImportance.splice(index, 1);
      }
      state.panelImportance.push(r.position);
      ///下面控制面板的权限最大
      const bottomIndex = state.panelImportance.indexOf("bottom");
      if (bottomIndex > -1) {
        //存在先删除
        state.panelImportance.splice(bottomIndex, 1);
        state.panelImportance.push("bottom");
      }
    },
    clear({ state }, { position }) {
      state.panelComponent[position] = "";
      if (state.panelVisible[position]) {
        state.panelVisible[position] = false;
      }
      //存在先删除
      //动画结束后删除
      setTimeout(() => {
        const index = state.panelImportance.indexOf(position);
        if (index > -1) {
          state.panelImportance.splice(index, 1);
        }
      }, 200);
    },
    //更改照片状态
    setPhotoStatus({ state }, b) {
      state.photoStatus = b;
    },

    setLayerListVisible({ state }, b){
      state.routMap.layerlist.visible = b
    }
  },
  getters: {
    /*FIXME: vue.runtime.esm.js?2b0e:619 [Vue warn]: Error in callback for watcher "function () { return getter(this$1.state, this$1.getters); }": "
     * TypeError: Cannot read property 'id' of null"
     * (found in <Root>) */
    // isOpenWithCName: (state) => (name) => {
    //     let position = state.routMap[name].position;
    //     return state.panelVisible[position] === true && state.panelComponent[position] === name
    // }
  }
};


// 监听选中元素的改变
import("@/store").then(m => {
  const store = m.default;
  store.watch(
    () => store.state.selectFeature.selectFeature,
    (newval,oldval) => {
      console.log(newval);
      
      if (newval) {
        const layer = store.state.selectFeature.selectFeatureLayer

        if(layer.id === "shellyz" ||layer.id === "gsyz" ||layer.id === "xyyz"){
          store.dispatch("replace", { path: "infoPanel" });
        } else if(layer.id === "ma" ){
          store.dispatch("replace", { path: "MAinfo" });
        } 
        else {
          store.dispatch("replace", { path: "commPropertyPanel" });
        }    
      } else {
        
        if(store.state.panel.routMap.layerlist.visible){
          
          return ;
        }
        console.log("clear rightPanel");
        
        store.dispatch("clear", { position: "right" });
        
      }
    }
  );
})

export default user;
