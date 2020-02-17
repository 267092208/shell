
import store from '../store'

const routes = [
    {
        path: '/',
        name: 'Index',
        component: resolve => require(['@/views/Index'], resolve),

        /**
         * @param {*} to 
         * @param {*} from 
         * @param {*} next 
         */
        async beforeEnter (to, from, next) {
            // 进入首页前检查用户的状态，如果无法获取用户的信息，则跳转到登录页
            try {
                const user = await store.dispatch("initUserData");
                if (user) {
                    // 如果用户的情况正常，则执行其他需要初始化的状态 
                    store.dispatch("initLayerData");
                    next();
                }
                else {
                    next('/login');
                }
            } catch (error) {
                next('/login');
            }
        },
        children: [
            {
                path: '',
                component: resolve => require(['@/views/MapContainer'], resolve),
            }
            ,
            {
                path: '/table',
                name: 'table',
                component: resolve => require(['@/views/Table'], resolve),
                /**
                 * 
                 * @param {*} to 
                 * @param {*} from 
                 * @param {*} next 
                 */
                beforeEnter (to, from, next) {
                    next();
                }
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['@/views/Login'], resolve),
        /**
         * 
         * @param {*} to 
         * @param {*} from 
         * @param {*} next 
         */
        beforeEnter (to, from, next) {
            next();
        }
    }
];
export default routes;