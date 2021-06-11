<template>
  <div class="my-center-content">
    <keep-alive :include="keepAlive">
      <router-view
        class="up-down-structure"
        @loadingImg="loadingImg"
      />
    </keep-alive>
    <div class="loading" v-show="loading">
      <div id="loading-center">
        <div
          id="loading-center-absolute"
          ref="loadingAbsolute"
        >
          <div
            class="iconbox"
            @click="cancelLoad"
          ><i class="iconfont icon-wulumuqishigongandashujuguanlipingtai-ico-"></i></div>
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
          <!-- <div class="loadfont">页面加载中,可<a >取消</a></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'center_edge',
  data() {
    return {
      loading: false, //loading 图标的显示
    }
  },
  methods: {
    loadingImg(state, position) {
      //图谱加载的时候，界面显示loading 图标
      this.loading = state
      if (position) {
        let dom = document.querySelector('#loading-center-absolute')
        position.left && (dom.style.left = position.left)
        position.top && (dom.style.top = position.top)
      }
    },
    cancelLoad() {
      this.loading = false
    },
  },
  computed: {
    keepAlive() {
      return this.$store.getters.keepAlive
    },
  },
  mounted() {
    this.$bus.$on('loadingImg', this.loadingImg)
  },
}
</script>

<style scoped lang="scss">
.my-center-content {
  padding: 0 20px 20px 20px;
  overflow: hidden;
}
/* 搜索框 */
// 搜索框和图形的结构比例
.up-down-structure {
  display: flex;
  flex-direction: column;
  height: 100%;
  /*background: #103760;*/
  .content-edge {
    flex-grow: 1;
    padding-bottom: 15px;
  }
  // 表格的图谱的样式
  .my-table {
    width: 100%;
    border-radius: 5px;
    height: 100%;
    overflow: hidden;
  }
}
.loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  z-index: 10;
}

#loading-center {
  width: calc(100% - 209px);
  height: 100%;
  position: relative;
  left: 209px;
}
#loading-center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 173px;
  transform: translate(-50%, -50%);
  -webkit-animation: opacity 0.2s; //解决快速点击的logo闪烁问题
  .iconbox {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    height: 18px;
  }
  .iconfont {
    color: rgba(255, 255, 255, 0.5);
    height: 18px;
    width: 18px;
    border-radius: 50%;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.5);
    text-align: center;
    padding-top: 3px;
    margin-left: 155px;
    cursor: pointer;
  }
  // &:hover {
  //   .iconfont {
  //     display: inline;
  //   }
  // }
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
@media screen and (max-width: 1366px) {
  #loading-center {
    width: calc(100% - 148px);
    height: 100%;
    position: relative;
    left: 148px;
  }
}
</style>
