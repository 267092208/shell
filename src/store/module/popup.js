
const popup = {
    state: {
        /**
         * @type {{
         * position:[number,number],
         * popupContent?:string,
         * isPopupcloser?:boolean,
         * move?:[number,number]
         * }}
         */
        popupOptions: null,
        /**
         * 关闭弹窗
         * 每次+1
         */
        popupcloser: 0
    },
    mutations: {
    },
    actions: {
        /**
         * @param {{
         * position:[number,number],
         * popupContent?:string,
         * isPopupcloser?:boolean,
         * move?:[number,number]
         * }} popupOptions 
         */
        openPopup(context, popupOptions) {
            const { state } = context
            state.popupOptions = popupOptions
        },
        /**
         * 关闭弹窗
         * @param {*} context 
         */
        popupcloser(context) {
            const { state } = context
            state.popupcloser++
        }
    }
}
export default popup;