import { matchRule, cloneObj } from "utils/utils.js";
export default {
  data () {
    return {
      mac: {},
      time: "",
      driveChainArr: [], //传动链部件信息
      isRequestDown: true,
      noDataText: '无数据',
    };
  },
  created () {
    this.noDataText = this.$t('Common.noDataText');
  },
  methods: {
    // 跳转实时数据列表
    toReal (item) {
      const param = this.fdModelInfo[this.currentKey]
      const store = this.$store
      // this.$router.push('fdModel')
      const mac = param.mac
      let macArray = store.state.mac[mac.t_id]
      let choosemac = store.state.checkMsg.mac
      let choosetree = cloneObj(store.state.checkMsg.tree)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.machine_id == mac.mac_id) {
          if (choosemac.t_id != choosetree.t_id) {
            let treeArray = store.state.tree
            treeArray.forEach((tree) => {
              if (choosemac.t_id == tree.t_id) {
                store.commit('getCheckMsg', {
                  msg: cloneObj(tree),
                  type: 'tree',
                })
                store.commit('getCheckMsg', {
                  msg: cloneObj(choosemac),
                  type: 'mac',
                })

                resolve('成功')
              }
            })
          }
          resolve('成功')
        } else {
          for (let i = 0; i < macArray.length; i++) {
            if (macArray[i].mac_id == mac.mac_id) {
              /* 设置当前的机组 */
              if (macArray[i].t_id != choosetree.t_id) {
                let treeArray = store.state.tree
                treeArray.forEach((tree) => {
                  if (macArray[i].t_id == tree.t_id) {
                    store.commit('getCheckMsg', {
                      msg: cloneObj(tree),
                      type: 'tree',
                    })
                  }
                })
              }
              store.commit('getCheckMsg', {
                msg: macArray[i],
                type: 'mac',
              })
              resolve('成功')
              break
            }
          }
        }
      }).then(() => {
        let posArray = this.$store.state.pos[item.mac_id];
        for (let i in posArray) {
          if (
            posArray[i].posFlag ===
            `${item.mac_id}_${item.pos_id}_${item.pos_type}`
          ) {
            this.$store.commit("getCheckMsg", {
              msg: posArray[i],
              type: "pos"
            });
            if (
              !matchRule(
                posArray[i].position_type,
                "real",
                posArray[i].dgm_type,
                posArray[i].t_root
              )
            ) {
              //未能匹配
              this.$pop("该类型测点没有此图谱");
              return;
            }
            let name = "real"; //实时数据列表
            let val = "实时数据列表";
            let icon = "icon-shishishuju_huaban";
            let key = `${name}_pos_${param.mac.mac_id}_${posArray[i].position_id}_${posArray[i].position_type}`;
            this.$bus.$emit("choiceChartType", key, val);
          }
        }
      })
    },
  },
  mounted () {
    // 防止火狐浏览器高度设置百分百失效
    let dom = document.getElementsByClassName('pro-scrollbar')
    for (let i = 0; i < dom.length; i++) {
      dom[i].style.height = `${dom[i].parentElement.clientHeight}px`;
    }
  },
  watch: {
    /* 获取选中机组信息 */
    // "$store.state.checkMsg.mac": {
    //   handler (value) {
    //     if (value != null) {
    //       this.mac = value;
    //       this.driveChainArr = [];
    //       this.getModelInfo(this.mac);
    //       clearInterval(this.timer)
    //       let fn = () => {
    //         this.getModelInfo(this.mac);
    //         return fn;
    //       };
    //       // this.getModelInfo(this.mac);
    //       console.log("创建定时器");
    //       this.timer = setInterval(fn(), 5000);
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
};
