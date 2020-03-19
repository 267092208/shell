/**
 * table view's vuex file
 * 
 */

const table = {
    state: {
        /**
         * 征用table 视图关键id字符串
         * 一般用来获取数据
         * @type {string}
         */
        occupyTableId: null,

    },
    actions: {
        /**
         * 设置占用table的关键id字符串
         * @param {*} context 
         * @param {string} id 
         */
        setOccupyTableId({ state }, id) {
            state.occupyTableId = id;
        },
        /**
         * clear 占用
         */
        cancelOccupyInTable({ state }) {
            state.occupyTableId = null;
        },
    }
}

export default table;