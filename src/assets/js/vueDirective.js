import Vue from 'vue';

/**
 *  使用方式
 *  在src文件夹下main.js中导入该文件
 *  给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了。
 *  给dialog设置 :close-on-click-modal="false" , 禁止点击遮罩层关闭弹出层
 */
// v-dialogDrag
Vue.directive('dialogDrag', {
    bind(el, binding, vNode, oldNode) {
        // 当前宽高
        let nowWidth = 0;
        let nowHeight = 0;
        // 当前顶部高度
        let nowMarginTop = 0;
        // 获取弹框头部
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        // 弹窗
        const dragDom = el.querySelector('.el-dialog');
        //清除选择头部文字效果
        //dialogHeaderEl.onselectstart = new Function("return false");
        dialogHeaderEl.style.cursor = 'move';
        //// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        let moveDown = (e) => {
            // 鼠标按下, 计算当前元素距离可视区的距离
            const distX = e.clientX;
            const distY = e.clientY;
            // 获取 到的值px
            let styL, styT;
            styL = +sty.left.replace(/\px/g, '');
            styT = +sty.top.replace(/\px/g, '');

            document.onmousemove = function(mouse) {
                const l = mouse.clientX - distX;
                const t = mouse.clientY - distY;
                dragDom.style.left = `${(l + styL)}px`;
                dragDom.style.top = `${(t + styT)}px`;
            }

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        } // end moveDown
        dialogHeaderEl.onmousedown = moveDown;
    }
})