<template>
  <div class="axis-locus-type">
    <div v-for="(item, index) in options" :key="index" @click="itemClick(index)">
      <input type="radio" name="type" :checked="currentIndex===item.value">
      {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AxisLocusType',
  props: {
    
  },
  data() {
    return {
      options: [
        {name: '原始轨迹', value: 0},
        {name: '0.5x轨迹', value: 1},
        {name: '1x轨迹', value: 2},
        {name: '2x轨迹', value: 3},
        {name: '4x轨迹', value: 4},
        {name: '8x轨迹', value: 5},
        {name: '16x轨迹', value: 6}
      ],
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('type-change', this.options[index].value)
    }
  }
}
</script>

<style scoped>
  .axis-locus-type{
    margin: 50px auto 0px;
  }
</style>