import Vue from "vue";
import record from "./record.vue";

/**
 * 传入参数
 * {
 * myStyle样式
 * dateType类型 tree mac pos
 * data{
 *  name
 * isShow:true 需要自己添加这两个字段
 * 多选框需要添加：isChecked id 两个字段
 * } 数据
 * }
 * */
export default options => {

  // 创建组件构造器
  let comp = Vue.extend(record);
  let compIns = new comp({ propsData: options });
  // 挂载组件
  let compDom = compIns.$mount().$el;
  document.getElementById("app").appendChild(compDom);
  return compIns
    .init()
    .then(val => {
      return Promise.resolve(val);
    })
    .catch(err => {
      return Promise.resolve(err);
    });
};
