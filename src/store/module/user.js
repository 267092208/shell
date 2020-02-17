import axios from '@/assets/js/axios';
import Vue from 'vue';
import { Message } from 'element-ui';
var offilneTimer;
/**
 * 周期性检测用户是否离线
 */
function startOfflineTest() {
    axios.get('/userPages/loginHandler.ashx?action=IsOffline')
        .then(({ data }) => {
            if (data) {
                showOfflineMessage();
            }
            else {
                offilneTimer = setTimeout(startOfflineTest, 5 * 60000);
            }
        }).catch(() => {
            showOfflineMessage();
        });
}

/**
 * 用户离线后显示提示并跳转
 */
function showOfflineMessage() {
    Message({
        message: `您已经离线,请重新登录`,
        type: 'warning'
    });
    setTimeout(() => {
        Vue.$route.push('/login');
    }, 2000); s
}

const user = {
    state: {
        /**
         * 用户信息
         * @type {{ID:number, Name:string, AccessList:string[]}}
         */
        user: null
    },
    mutations: {},
    actions: {
        /**
         * 登录
         */
        login: async function ({ state }, { username, password }) {
            console.log(username, password)
            const { data } = await axios.post('/userPages/loginHandler.ashx?action=Login2', { username, password });
            state.user = data;
            startOfflineTest();
        },
        /**
         * 退出
         */
        logout: async function ({ state }) {
            await axios.get('/userPages/loginHandler.ashx?action=LoginOut');
            state.user = null;
            clearTimeout(offilneTimer);
        },
        /**
         * 从服务器载入用户信息
         */
        initUserData: async function ({ state }) {
            if (!state.user) {
                const { data } = await axios.get('/userPages/loginHandler.ashx?action=GetUser');
                state.user = data;
                if (data) {
                    startOfflineTest();
                }
            }

            return state.user;
        }
    }
};
export default user;