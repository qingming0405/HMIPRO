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
@import '@/assets/style/css/model.scss';
</style>
<style scoped lang="scss">
.snModel {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
