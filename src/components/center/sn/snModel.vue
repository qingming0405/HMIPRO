<!--设备模型-水泥-->
<template>
  <div>
    <div
      class="wpower-modelitems"
      v-for="(params,index) in snModel"
      v-if="params.isShow"
    >
      <div class="title-text">{{params.title}}</div>
      <div class="wpower-modelitems-title">
        <div
          v-for="(item, index) in params.monitorePos"
          class="wpower-monitore-postion"
          @click="choosemonitore(index)"
          :class="{ 'choose-item': item.isChoose }"
          v-show="item.isShow"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="wpower-modelitems-content">
        <keep-alive :include="keepAlive">
          <router-view class="snModel"></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import snModel from 'common/general/sn/snModel.js'
export default {
  name: 'snModel',
  mixins: [snModel],
  computed: {
    keepAlive() {
      return this.$store.getters.keepAlive
    },
  },
}
</script>

<style scoped lang="scss">
.snModel {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
.wpower-modelitems {
  margin-top: 50px;
  height: 100%;
  .wpower-modelitems-title {
    position: absolute;
    top: 70px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 45px;
    .wpower-monitore-postion {
      width: 130px;
      height: 43px;
      background: #0b1757;
      border: 1px solid #4574d6;
      box-shadow: 0px 0px 29px 0px rgba(6, 70, 167, 0.72) inset;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px 0px 0px 30px;
      cursor: pointer;
    }
    .choose-item {
      border: 1px solid #00fcf9;
    }
  }
  .wpower-modelitems-content {
    height: calc(100% - 30px);
    width: 100%;
  }
}
</style>
