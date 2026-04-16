/*
 * @Author: lee
 * @Date: 2021-05-10 11:45:50
 * @LastEditors: lee
 * @LastEditTime: 2021-05-20 15:41:51
 * @Description: file content
 */
import Print from './printarea.js';
/**
 * @file 打印
 * 指令`v-print`,默认打印整个窗口
 * 传入参数`v-print="'#id'"` , 参数为需要打印局部的盒子标识.
 */
const addEvent = (element, type, callback) => {
  if (element.addEventListener) {
    element.addEventListener(type, callback, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, callback);
  } else {
    element['on' + type] = callback;
  }
}

export default {
  directiveName: 'print',
  mounted (el, binding, vnode) {
    let vue = binding.instance;
    let id = '';

    addEvent(el, 'click', () => {
      if (typeof binding.value === 'string') {
        id = binding.value;
      } else if (typeof binding.value === 'object' && !!binding.value.id) {
        id = binding.value.id;
        let ids = id.replace(new RegExp("#", "g"), '');
        let elsdom = document.getElementById(ids);
        if (!elsdom) { console.log("id in Error"); id = ''; }
      } else {
        window.print();
        return;
      }
      localPrint();
    });

    const localPrint = () => {
      new Print({
        ids: id,
        vue,
        url: binding.value.url,
        standard: '',
        extraHead: binding.value.extraHead,
        extraCss: binding.value.extraCss,
        zIndex: binding.value.zIndex || 20002,
        previewTitle: binding.value.previewTitle || '打印预览',
        previewPrintBtnLabel: binding.value.previewPrintBtnLabel || '打印',
        popTitle: binding.value.popTitle,
        preview: binding.value.preview || false,
        asyncUrl: binding.value.asyncUrl,
        previewBeforeOpenCallback () {
          binding.value.previewBeforeOpenCallback && binding.value.previewBeforeOpenCallback(vue)
        },
        previewOpenCallback () {
          binding.value.previewOpenCallback && binding.value.previewOpenCallback(vue)
        },
        openCallback () {
          binding.value.openCallback && binding.value.openCallback(vue)
        },
        closeCallback () {
          binding.value.closeCallback && binding.value.closeCallback(vue)
        },
        beforeOpenCallback () {
          binding.value.beforeOpenCallback && binding.value.beforeOpenCallback(vue)
        }
      });
    };
  }
};
