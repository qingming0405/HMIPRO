<template>
  <div class="sn-model">
    <!-- <div
      class="background"
      v-show="isShowBackground"
    ></div> -->
    <img
      :src="bgURL"
      v-show="isShowBackground"
    />
    <canvas id="canvas"> </canvas>
    <canvas id="titleCanvas"></canvas>
  </div>
</template>
<script>
import mechineModel from 'common/general/sn/model/mechineModel.js'
export default {
  name: 'hgMechineModel',
  mixins: [mechineModel],
  data() {
    return {}
  },
}
</script>
<style scoped lang="scss">
.background {
  width: 100%;
  height: 100%;
  background: url('~assets/images/sn/background.png');
  background-repeat: no-repeat;
  background-position: right bottom;
}
</style>