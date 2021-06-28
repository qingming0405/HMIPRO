import Vue from "vue";
import VueI18n from "vue-i18n";//国际化
import { cn } from './lang/HMIedge/cn'    // 引入lang文件
import { en } from './lang/HMIedge/en'
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'cn',   // 设置语言
  messages: {
    cn: {
      ...cn,
      ...zhLocale
    },
    en: {
      ...en,
      ...enLocale
    }
  }
})

export function $t (args) {
  return i18n.tc.call(i18n, args);
}

export default i18n;