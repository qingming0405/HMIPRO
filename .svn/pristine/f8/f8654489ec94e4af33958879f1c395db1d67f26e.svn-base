<template>
  
</template>
<script>
export default {
  name:'multiTrack',
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'multiTrack',
    })
  },
  watch: {
    '$store.state.multiTrackMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.key, item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods:{
    openChartList(){}
  }
}
</script>