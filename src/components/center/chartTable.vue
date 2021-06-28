<!-- 图表 -->
<template>
  <div class="my-chart-table">
    <!-- <div class='retract'>
         <label class='retract-btn radius' for='isRetract'>
            <i class='iconfont icon-xiangyou_huaban' ref='retractIcon'></i>
         </label>
         <input type="checkbox" id='isRetract' v-model='isRetract'>
      </div> -->
    <!-- 实时数据列表 -->
    <keep-alive :include="keepAlive">
      <!-- <router-view class='radius' @loadingImg='loadingImg' :isRetract='isRetract'></router-view> -->
      <router-view
        class="radius"
        @loadingImg="loadingImg"
        ref="chartTable"
      ></router-view>
    </keep-alive>

    <div
      class="loading"
      v-show="loading"
    >
      <!-- <img  :src='loadingUrl' alt=""> v-show="loading"-->
      <div id="loading-center">
        <div
          id="loading-center-absolute"
          ref="loadingAbsolute"
        >
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="object"></div>
          <div class="loadfont">页面加载中,可<a @click="cancelLoad">取消</a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用

  props: [],
  data() {
    return {
      loading: false, //loading 图标的显示
      // loadingUrl: require('assets/images/loading.gif'),
      // isRetract: false, /* 左侧列表展开或收起 */
      // changeModel: false,
    }
  },
  watch: {
    '$store.state.reportMsg.loadingReport': {
      handler(newVal, oldVal) {
        if (newVal != null) {
          this.loadingImg(newVal)
        }
      },
    },
    /* isRetract(val) {
         const icon = this.$refs.retractIcon;
         const right = 'icon-xiangyou_huaban';
         const left = 'icon-xiangzuo_huaban';
         const view = document.getElementsByClassName('view-content')[0];
         if (val) {
            addClass(view, 'retract-view');
            changeClass(icon, left, right);
         } else {
            removeClass(view, 'retract-view');
            changeClass(icon, right, left);
         }
         this.changeModel = val;
      }, */
  },
  methods: {
    loadingImg(state) {
      // 如果诊断报告进度条没结束，则其它图没法关闭进度条
      if(state === false && this.$store.state.reportMsg.loadingReport === true){
        return
      }
      //图谱加载的时候，界面显示loading 图标
      this.loading = state
      /* if(state){ //图片开启之后，3秒之后请求没回来就自动关闭
           setTimeout(()=>{
            this.loading =false
          },15000)
        } */
    },
    cancelLoad() {
      this.$store.state.reportMsg.loadingReport = false
      this.loading = false
    },
  },
  computed: {
    keepAlive() {
      return this.$store.getters.keepAlive
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
}
</script>
<style scoped lang="scss">
.my-chart-table {
  // display: grid;
  // grid-template-columns: 14px calc(100% - 14px);
  width: 100%;
  height: calc(100vh - 115px);
  position: relative;
  .retract {
    display: flex;
    align-items: center;
    height: 100%;
    width: 14px;
    z-index: 1;
    .retract-btn {
      height: 42px;
      line-height: 42px;
      width: 14px;
      cursor: pointer;
      .iconfont {
        vertical-align: 2px;
        font-size: 12px;
      }
    }
    #isRetract {
      display: none;
    }
  }
  .radius {
    width: 100%;
    height: calc(100vh - 115px);
    position: relative;
  }
  .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  #loading-center {
    width: 100%;
    height: 100%;
    position: relative;
  }
  #loading-center-absolute {
    position: absolute;
    left: calc(50% - 75px);
    top: 50%;
    height: 50px;
    width: 150px;
    margin-top: -25px;
    // margin-left: 35px;
    -webkit-animation: opacity 0.2s; //解决快速点击的logo闪烁问题
  }
  .object {
    width: 8px;
    height: 50px;
    margin-right: 7px;
    background-color: #48b4e3;
    -webkit-animation: animate 1s infinite;
    animation: animate 1s infinite;
    float: left;
  }
  .loadfont {
    color: #48b4e3;
    font-size: 14px;
    font-weight: 500;
    margin-top: 60px;
    margin-right: 7px;
    text-align: center;
    line-height: 14px;
    a {
      font-size: 14px;
      cursor: pointer;
      color: #00e9fe;
    }
  }
  .object:last-child {
    margin-right: 0px;
  }

  .object:nth-child(10) {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }
  .object:nth-child(9) {
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }
  .object:nth-child(8) {
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
  }
  .object:nth-child(7) {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  .object:nth-child(6) {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }
  .object:nth-child(5) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }
  .object:nth-child(4) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  .object:nth-child(3) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
  .object:nth-child(2) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  @-webkit-keyframes animate {
    50% {
      -ms-transform: scaleY(0);
      -webkit-transform: scaleY(0);
      transform: scaleY(0);
    }
  }
  @keyframes animate {
    50% {
      -ms-transform: scaleY(0);
      -webkit-transform: scaleY(0);
      transform: scaleY(0);
    }
  }
  @-webkit-keyframes opacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
