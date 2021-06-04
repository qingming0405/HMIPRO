import WaveAlert from "./waveAlert.vue";

const MyPop = {
  install(Vue, store) {
    const testInstance = Vue.extend(WaveAlert);
    let msg;
    const init = () => {
      msg = new testInstance({ store });
      const dom = msg.$mount().$el;
      document.getElementById("app").appendChild(dom);
    };
    // 给Vue函数添加一个原型属性$WavePop
    Vue.prototype.$WavePop = options => {
      if (!msg) {
        init();
      }
      if (Object.prototype.toString.call(options).slice(8, -1) === "Object") {
        Object.assign(msg, options);
      } else {
        console.log("参数只能为对象");
        return;
      }
      return msg
        .openWaveAlert()
        .then(val => {
          msg = null;
          return Promise.resolve(val);
        })
        .catch(err => {
          msg = null;
          return Promise.reject(err);
        });
    };
  }
};

export default MyPop;
