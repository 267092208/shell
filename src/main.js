import Vue from 'vue'
import App from './App.vue'
import ls from './utils/localStorage';
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import plTable from 'pl-table'
import './assets/js/vueDirective'; // vue 指令
import 'pl-table/themes/index.css' // 引入样式（必须引入)，请查看webpack是否配置了url-loader对woff，ttf文件的引用,不配置会报错哦

import 'pl-table/themes/plTableStyle.css' // 默认表格样式很丑 引入这个样式就可以好看啦（如果你不喜欢这个样式，就不要引入，不引入就跟ele表格样式一样）


import './assets/theme/index.css'
import './assets/css/iconfont.css'
import './assets/css/index.scss'

/* 使用vue-ls */
Vue.use(ls.Storage, ls.options);
// UI
Vue.use(ElementUI)
//表格
Vue.use(plTable);
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
