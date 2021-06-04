import ColorBox from './ColorPicker.vue';

const MyList = {
   install(Vue, options) {
      const testInstance = Vue.extend(ColorBox);
      let msg;
      const init = () => {
         msg = new testInstance();
         const dom = msg.$mount().$el;
         document.getElementById('app').appendChild(dom);
      };
      Vue.prototype.$color = (options) => {
         if (!msg) {
            init();
         }
         if (typeof options === 'string') {
            msg.color = options;
         } else if (Object.prototype.toString.call(options).slice(8, -1) === 'Object') {
            Object.assign(msg, options);
         }
         return msg.openColor().then(
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

export default MyList;