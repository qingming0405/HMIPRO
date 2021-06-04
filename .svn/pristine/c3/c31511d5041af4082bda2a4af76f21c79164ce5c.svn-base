import BeginReport from './BeginReport.vue';

const MyBeginReport = {
   install(Vue, store) {
      const testInstance = Vue.extend(BeginReport);
      let msg;
      const init = () => {
         msg = new testInstance({ store });
         const dom = msg.$mount().$el;
         document.getElementById('app').appendChild(dom);
      };
      Vue.prototype.$beginReport = (options) => {
         if (!msg) {
            init();
         }
         if (typeof options === 'string') {
            msg.content = options;
         } else if (Object.prototype.toString.call(options).slice(8, -1) === 'Object') {
            Object.assign(msg, options);
         }
         return msg.openPop().then(
            val => {
               msg = null;
               return Promise.resolve(val);
            }
         ).catch(err => {
            msg = null;
            return Promise.reject(err);
         })
      }
   },
}

export default MyBeginReport;