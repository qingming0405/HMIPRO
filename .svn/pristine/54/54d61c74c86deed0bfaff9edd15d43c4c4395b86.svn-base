import axios from "axios";
const INS = require("./base_url");

/* 定义一个取消请求的方法 */
const pending = {}; // 一个来存放所有请求方法函数的数组
// removePending
let removePending = config => {
  let f = pending[config.url];
  if (f) {
    f();
    delete pending[config.url];
  }
};
function decoratorRouter (router, request) {
  function request (config) {
    const instance = axios.create({
      baseURL: INS.BASE_URL,
      headers: {
        Authorization: sessionStorage.token,
        version: sessionStorage.getItem("version")
      } //'version'表示接口版本号
    });
    instance.interceptors.request.use(config => {
      /* 波形图连续 请求，需要取消请求 */
      if (config.url == "getPositionEigenvalue") {
        removePending(config);
        config.cancelToken = new axios.CancelToken(c => {
          pending[config.url] = c;
        });
      }
      if (config.url == "getWaveformAndSpectrum") {
        removePending(config);
        config.cancelToken = new axios.CancelToken(c => {
          pending[config.url] = c;
        });
      }
      return config;
    });
    instance.interceptors.response.use(res => {
      if (config.url === "login") {
        return res.data;
      } else {
        switch (parseInt(res.headers.token_state)) {
          case 0:
            if (res.data.msg === 2 || res.data.msg === 1) {
              console.log("后台运行错误");
              return false;
            }
            return res.data;
          case 1:
          case 2:
            router.push({ name: "login" });
            break;
          case 3:
            sessionStorage.setItem("token", res.headers.token);
            var newConfig = res.config;
            newConfig.headers["Authorization"] = sessionStorage.token;
            return request(newConfig);
          // break;
          default:
            return res.data;
        }
      }
      /* if(res.data.msg == 2){
      }else{
        return res.data
      } */
    });
    return instance(config);
  }

  request["post"] = (url, data, config) => {
    //this.$axios.post请求
    config = Object.assign(
      {
        method: "post",
        url,
        data,
        headers: { "Content-Type": "application/json;charsetset=UTF-8" }
      },
      config
    );
    return request(config);
  };
  return request;
}

export default decoratorRouter;
