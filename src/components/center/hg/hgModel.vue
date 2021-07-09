<template>
  <div class="wpower-modelitems">
    <div class="wpower-modelitems-title">
      <div
        v-for="(item, index) in monitorePos"
        class="wpower-monitore-postion"
        @click="choosemonitore(index)"
        :class="{ 'choose-item': item.isChoose }"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="wpower-modelitems-content">
      <template>
        <router-view class="snModel" />
      </template>
    </div>
  </div>
</template>
<script>
import snModel from 'common/general/sn/snModel.js'
export default {
  name: 'hgModel',
  mixins: [snModel],
  data() {
    return {
      monitorePos: [
        {
          name: '设备模型',
          router: 'hgMechineModel',
          isChoose: true,
        },
        {
          // name: '振动/温度',
          name: '测点列表',
          router: 'hgVib',
          isChoose: false,
        },
        {
          name: '油液参数',
          router: 'hgOil',
          isChoose: false,
        },
        {
          name: '倾角',
          router: 'hgTowerdrum',
          isChoose: false,
        },
      ],
    }
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
  .wpower-modelitems-title {
    position: absolute;
    top: 85px;
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
