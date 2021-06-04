<template>
  <div :class="[isShowLeft?'index-content-edge':'index-content-edge-1','index-content-edge']">
    <my-left
      class="left"
      v-show="isShowLeft"
    ></my-left>
    <my-head class="head"></my-head>
    <div
      class="icon-box"
      @click="changeLeft"
    >
      <div class="box"><i :class="[isShowLeft?'icon-select':'','iconfont','icon-zhongzi-xiangyou']"></i></div>
    </div>
    <my-center class="center"></my-center>
  </div>
</template>

<script>
import MyHead from '@/components/head/header_edge'
import MyLeft from '@/components/left/left_edge'
import MyCenter from '@/components/center/center_edge'
export default {
  name: 'index_edge',
  components: {
    MyHead,
    MyLeft,
    MyCenter,
  },
  data() {
    return {
      isShowLeft: true,
    }
  },
  beforeDestroy() {
    this.$bus.$off('changeStyle')
    this.$bus.$off('changeStylefalse')
  },
  methods: {
    changeLeft() {
      this.isShowLeft = !this.isShowLeft
      this.$store.commit('changeDomStructure')
    },
  },
}
</script>

<style lang="scss">
.index-content-edge {
  height: 100vh;
  display: grid;
  grid-template-columns: 210px 0px calc(100% - 210px);
  grid-template-rows: 80px calc(100% - 80px);
  @media screen and (max-width: 1366px) {
    grid-template-columns: 147px 0px calc(100% - 147px);
    grid-template-rows: 80px calc(100% - 80px);
  }
}
.index-content-edge-1 {
  height: 100vh;
  display: grid;
  grid-template-columns: 0px 0px calc(100% - 0px);
  grid-template-rows: 80px calc(100% - 80px);
  @media screen and (max-width: 1366px) {
    grid-template-columns: 0 0px calc(100% - 0px);
    grid-template-rows: 80px calc(100% - 80px);
  }
}
.index-content-edge {
  grid-template-areas:
    'l i h'
    'l i c';
  .left {
    grid-area: l;
    height: 100%;
    width: 100%;
  }
  .head {
    grid-area: h;
    height: 100%;
    width: 100%;
  }
  .icon-box {
    grid-area: i;
    width: 14px;
    height: 50px;
    position: relative;
    top: calc(50% - 25px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #092e55;
    .box {
      width: 14px;
      height: 50px;
      background: #19426f;
      border: 1px solid #19426f;
      box-shadow: 0px 2px 4px 0px #001e3d;
      border-radius: 4px;
      padding: 14px 0px;
      .iconfont {
        color: #538fd1;
      }
      .icon-select {
        display: inline-block;
        transform: rotate(180deg) translate(25%, 0);
        -ms-transform: rotate(180deg) translate(25%, 0); /* IE 9 */
        -moz-transform: rotate(180deg) translate(25%, 0); /* Firefox */
        -webkit-transform: rotate(180deg) translate(25%, 0); /* Safari 和 Chrome */
        -o-transform: rotate(180deg) translate(25%, 0); /* Opera */
      }
    }
  }
  .center {
    grid-area: c;
    height: 100%;
    width: 100%;
  }
}
</style>
