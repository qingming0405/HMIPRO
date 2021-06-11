<template>
  <div>
    <div class="user-manual">
      <iframe
        :src=userManualSrc
        style="height:100%;width:100%;"
      ></iframe>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userManualSrc: 'userManual/index.htm',
    }
  },
  watch: {
    '$store.state.userManualMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    openChartList(type) {
      this.userManualSrc = 'userManual/index.htm'
      let t_root = this.$store.state.checkMsg.tree.t_root
      if (
        this.$route.query.t_root !== null &&
        this.$route.query.t_root !== undefined
      ) {
        t_root = this.$route.query.t_root
      }
      if (this.$route.query.toPart) {
        this.userManualSrc =
          this.userManualSrc +
          '?file=' +
          this.$route.query.toPart +
          '&&t_root=' +
          t_root
      } else {
        this.userManualSrc = this.userManualSrc + '?t_root=' + t_root
      }
    },
  },
}
</script>
<style scoped>
.user-manual {
  height: 100%;
}
</style>