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
export function triggerPrint(value, vue) {
  let id = '';
  if (typeof value === 'string') {
    id = value;
  } else if (typeof value === 'object' && !!value.id) {
    id = value.id;
    let ids = id.replace(new RegExp("#", "g"), '');
    let elsdom = document.getElementById(ids);
    if (!elsdom) { console.log("id in Error"); return; }
  } else {
    window.print();
    return;
  }
  new Print({
    ids: id,
    vue,
    url: value.url,
    standard: '',
    extraHead: value.extraHead,
    extraCss: value.extraCss,
    zIndex: value.zIndex || 20002,
    previewTitle: value.previewTitle || '打印预览',
    previewPrintBtnLabel: value.previewPrintBtnLabel || '打印',
    popTitle: value.popTitle,
    preview: value.preview || false,
    asyncUrl: value.asyncUrl,
    previewBeforeOpenCallback() { value.previewBeforeOpenCallback && value.previewBeforeOpenCallback(vue) },
    previewOpenCallback() { value.previewOpenCallback && value.previewOpenCallback(vue) },
    openCallback() { value.openCallback && value.openCallback(vue) },
    closeCallback() { value.closeCallback && value.closeCallback(vue) },
    beforeOpenCallback() { value.beforeOpenCallback && value.beforeOpenCallback(vue) },
  });
}

export default {
  directiveName: 'print',
  mounted (el, binding) {
    let vue = binding.instance;

    addEvent(el, 'click', () => {
      triggerPrint(binding.value, vue);
    });
  }
};