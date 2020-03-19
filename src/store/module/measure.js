const measure = {
    state: {
        /**
         * 当前的测量模式
         * @type {'distance'|'area'|null}
         */
        mode: null
    },
    actions: {
        /**
         * 设置测量模式
         * @param {'distance'|'area'} param 
         */
        setMeasureMode (context, param) {
            // 采用单次测量模式，此处无论测量模式是否改变，均先清空原有的测量
            context.state.mode = null;
            setTimeout(() => context.state.mode = param, 1);
        },
        /**
         * 停止测量并清除结果
         */
        clearMeasure (context) {
            context.state.mode = null;
        }
    }
};

export default measure;