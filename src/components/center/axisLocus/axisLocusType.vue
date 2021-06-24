<template>
  <div class="axis-locus-type">
    <div
      v-for="(item, index) in options"
      :key="index"
      @click="itemClick(index)"
      :style="options[0].name !== '原始轨迹' ? 'fontSize:13px' : ''"
    >
      <input
        type="radio"
        name="type"
        :checked="currentIndex===item.value"
      >
      {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AxisLocusType',
  props: {},
  data() {
    const vm = window.vm
    return {
      vm: vm,
      options: [
        { name: vm.$t('axisLocus.OriginalTrajectory'), value: 0 }, //原始轨迹
        { name: vm.$t('axisLocus.halfTrajectory'), value: 1 }, //0.5x轨迹
        { name: vm.$t('axisLocus.oneTrajectory'), value: 2 }, //1x轨迹
        { name: vm.$t('axisLocus.twoTrajectory'), value: 3 }, //2x轨迹
        { name: vm.$t('axisLocus.fourTrajectory'), value: 4 }, //4x轨迹
        { name: vm.$t('axisLocus.eightTrajectory'), value: 5 }, //8x轨迹
        { name: vm.$t('axisLocus.sixteenTrajectory'), value: 6 }, //16x轨迹
      ],
      currentIndex: 0,
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('type-change', this.options[index].value)
    },
  },
}
</script>

<style scoped>
.axis-locus-type {
  margin: 50px auto 0px;
}
</style>