// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import PinYin from "pinyin-match";
import "@/assets/style/css/common.css";
import vcolorpicker from "vcolorpicker";
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
import getApi from "network/getApi";
import MyPop from "./components/common/pop/PopBox.js";
import MyList from "./components/common/list/ListBox.js";
import MyBeginReport from "./components/right/beginReport/beginReport.js";
import MyColor from "./components/common/color/ColorPicker.js";
import MyWaveAlert from "./components/common/waveAlert/waveAlert.js";
import MultiList from "./components/common/MultiList/index.js";
import Record from "./components/common/record/index.js";
import Wavemail from "./components/common/waveMail/wavemail.js";
import tmstrendData from "./components/common/tmstrendData/tmstrendData.js";

import store from "./store/store_pro";
import DataRetrieval from "./components/common/dataRetrieval/DataRetrieval.js"; //检索栏
Vue.use(DataRetrieval, store);
Vue.use(MultiList, store);


import "@/assets/style/css/home.scss";
import "@/assets/style/iconfont/iconfont.css";
import "@/assets/js/element.js"; /* elemnt ui */
import Element from 'element-ui';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import ElementLocale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css';

/* pro部分的代码 */
import router from "./router/router_pro";

/* edge部分的代码 */
// import "@/assets/style/css/home_edge.scss";
// import "@/assets/style/css/home_edge_color.scss"; //换肤css
// import "@/assets/style/iconfont_edge/iconfont.css";
// import router from "./router/router_edge";

/*remo部分的代码*/
// import "@/assets/style/iconfont_edge/iconfont.css";
// import router from "./router/router_remo"; 

import App from "./App";
// import 'babel-polyfill'
Vue.use(VueDirectiveImagePreviewer, {
  width: 600,
  height: 300,
  zIndex: 3000
});
Vue.use(Element);
Vue.use(MyPop);
Vue.use(MyList);
Vue.use(MyColor);
Vue.use(MyBeginReport, store);
Vue.use(MyWaveAlert, store);
Vue.use(vcolorpicker);
Vue.config.productionTip = false;
Vue.prototype.$record = Record;
// Vue.confit.debug = true
Vue.prototype.pinyin = PinYin;
Vue.prototype.$getApi = getApi(router);
Vue.prototype.$bus = new Vue();
Vue.prototype.$multi = MultiList;
Vue.prototype.$wavemile = Wavemail;
Vue.prototype.$tmstrendData = tmstrendData;

// v-resize:监听绑定dom宽度是否发生变化
Vue.directive('resize', {
  // 指令的名称
  bind (el, binding) {
    // el为绑定的元素，binding为绑定给指令的对象
    let width = ''
    function isReize () {
      const style = document.defaultView.getComputedStyle(el)
      if (width !== style.width) {
        binding.value() // 关键
      }
      width = style.width
    }
    el.__vueSetInterval__ = setInterval(isReize, 10)
  },
  unbind (el) {
    clearInterval(el.__vueSetInterval__)
  }
})

import VueI18n from "vue-i18n";//国际化
import { cn } from './common/lang/HMIedge/cn'    // 引入lang文件
import { en } from './common/lang/HMIedge/en'
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'cn',   // 设置语言
  messages: {
    cn: { 
      ...cn ,
      ...zhLocale
    },
    en: { 
      ...en ,
      ...enLocale
    }
  }
})

/* eslint-disable no-new */
window.vm = new Vue({
  el: "#app",
  store,
  router,
  i18n,
  components: { App },
  template: "<App/>",
});
ElementLocale.i18n((key, value) => i18n.t(key, value))