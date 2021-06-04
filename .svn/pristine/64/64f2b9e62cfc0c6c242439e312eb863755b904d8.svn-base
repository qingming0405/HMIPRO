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
export default {
  name: "tyModel",
  data() {
    return {
      monitorePos: [
        {
          name: this.$t('Common.chainText'),//"传动链",
          router: "tyVib",
          isChoose: false
        }
        // {
        //   name: "油液参数",
        //   router: "snOil",
        //   isChoose: false
        // },
        // {
        //   name: "倾角",
        //   router: "snTowerdrum",
        //   isChoose: false
        // }
      ],
    };
  },
  methods: {
    choosemonitore(index) {
      for (let i = 0; i < this.monitorePos.length; i++) {
        if (index === i) {
          this.monitorePos[i].isChoose = true;
          this.$router.push({
            name: this.monitorePos[i].router
          });
        } else {
          this.monitorePos[i].isChoose = false;
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.snModel {
  height: 100%;
  width: 100%;
}
.wpower-modelitems {
  margin-top: 50px;
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
    height: calc(100% - 20px);
    width: 100%;
  }
}
</style>
