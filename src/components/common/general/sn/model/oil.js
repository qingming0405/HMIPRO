import { defaultCode, getUnit, cloneObj, matchRule, round } from 'utils/utils.js'
const oil = {
  name: 'snOil',
  data () {
    return {
      snOil: {},
      currentKey: '',
    }
  },
  created () {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'snOil',
    })
  },
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.snOil) {
        this.snOil[i].isShow = false
        clearInterval(this.snOil[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.snOil)
      if (type === 0 || type === 1 || type === 4) {
        if (keyArr.indexOf(key) === -1) {
          type = 0
          title = cloneObj(this.$store.state.chooseTitle.generalTitle)
        } else {
          type = 1
        }
      }
      if (type === 0) {
        mac = cloneObj(this.$store.state.checkMsg.mac)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        mac = this.snOil[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.snOil, key, {
            mac,
            oilData: [
              // {
              //   pos_name: '油液', eigenvalue: {
              //     name: '特征值',
              //     value: 100.251,
              //     unit: 'mm'
              //   }, alarm_status: 0
              // },

            ],
            isRequestDown: true,/* 请求是否结束 */
            timer: '',
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.snOil[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.snOil, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.snOil[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let fn = () => {
          this.getModelInfo(mac);
          return fn;
        };
        this.snOil[key].timer = setInterval(fn(), 5000);
      }
    },
    getModelInfo (mac) {
      const param = this.snOil[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
        ch_class: mac.ch_class
      }
      if (param.isRequestDown) {
        param.isRequestDown = false
        this.$getApi.queryOilByMacId(requestData).then((res) => {
          param.isRequestDown = true
          if (res) {
            res.oil && this.setModelInfo(res.oil)
          }
        })
      }
    },
    setModelInfo (pos) {
      const param = this.snOil[this.currentKey]
      param.oilData = pos
      let compare = function (obj1, obj2) {
        let val1 = obj1.pos_name
        let val2 = obj2.pos_name
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
      param.oilData.sort(compare)
      param.oilData.forEach((element) => {
        element.position_type = element.pos_type
        let eigenvalue = defaultCode[element.pos_type]
        if (element.baseInfo != null && element.baseInfo.baseInfo != null) {
          for (let i in element.baseInfo.baseInfo) {
            if (i === defaultCode[element.pos_type].filed) {
              // eigenvalue = defaultCode[element.pos_type]
              if (
                element.baseInfo.baseInfo[i] !== null &&
                element.baseInfo.baseInfo[i] < 100000000
              ) {
                //若当前特征值存在
                eigenvalue.value = round(element.baseInfo.baseInfo[i], 2)
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
              } else {
                //不存在
                eigenvalue.value = this.$t('Common.noDataText');//无数据
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
              }
              if (eigenvalue.unit instanceof Array) {
                eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
              }
              break
            }
          }
        } else {
          eigenvalue.unit = getUnit(defaultCode[element.pos_type].code, element)
          eigenvalue.value = this.$t('Common.noDataText');//无数据
          if (eigenvalue.unit instanceof Array) {
            eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
          }
        }
        element.eigenvalue = cloneObj(eigenvalue)
      })
    },
    toReal (item) {
      const param = this.snOil[this.currentKey]
      if (this.$store.state.checkMsg.mac && (this.$store.state.checkMsg.mac.mac_id != param.mac.mac_id || this.$store.state.checkMsg.mac.ch_class != param.mac.ch_class)) {
        this.$store.commit("getCheckMsg", {
          msg: param.mac,
          type: "mac"
        });
      }
      //从vuex取当前机组下的所有测点
      let posArray = this.$store.state.pos[param.mac.mac_id];
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
            this.$pop(this.$t('Common.noChartTips'));//该类型测点没有此图谱
            return;
          }
          let name = "real"; //实时数据列表
          let val = this.$t('HeaderEdge.secondLevel4_2');//"实时数据列表";
          let icon = "icon-shishishuju_huaban";
          let key = `${name}_pos_${item.mac_id}_${item.pos_id}_${item.pos_type}`;
          this.$bus.$emit("choiceChartType", key, val);
        }
      }
    },
  },
  watch: {
    /* 获取选中机组信息 */
    // "$store.state.checkMsg.mac": {
    //   handler (value) {
    //     if (value != null) {
    //       this.mac = value;
    //       this.getModelInfo(this.mac);
    //       clearInterval(this.timer)
    //       let fn = () => {
    //         this.getModelInfo(this.mac);
    //         return fn;
    //       };
    //       // this.getModelInfo(this.mac);
    //       this.timer = setInterval(fn(), 5000);
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
    '$store.state.snOilMsg': {
      handler (value) {
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
}
export default oil;