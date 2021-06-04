export default {
  data () {
    return {
      mac: {},
    };
  },
  methods: {
  },
  watch: {
    /* 获取选中机组信息 */
    '$store.state.checkMsg.mac': {
      handler (value) {
        if (value != null) {
          this.mac = value
          this.getModelInfo(this.mac)
        } else {
          this.noneData = true
        }
      },
      deep: true,
      immediate: true
    },
    // "$store.state.checkMsg": {
    //   handler (value) {
    //     if (value.mac === null) {
    //       this.mac = value.mac
    //       this.getModelInfo(this.mac)
    //     } else {
    //       this.noneData = true
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
}
