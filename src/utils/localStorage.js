/**
 * @description vue-ls 对本地存储进行封装
 * @reference https://www.npmjs.com/package/vue-ls
 */
import Storage from 'vue-ls';
export default {
    Storage,
    options: {
        namespace: '',
        name: 'ls',
        storage: 'local'
    }
};
