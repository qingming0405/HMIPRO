/* 水泥、化工公用 */
import { compare } from 'semver'
import { cloneObj } from 'utils/utils.js'
const snFocus = {
  data () {
    return {
      statusValue: {
        0: this.$t('Common.offlineText'),//'离线'
        1: this.$t('Common.normalText'),//'正常',
        2: this.$t('Common.warnText'),//'预警',
        3: this.$t('Common.alarmText'),//'报警',
      },
      focus: {},
      currentKey: '',
    }
  },
  deactivated () {
    clearInterval(this.focus[this.currentKey].timer)
  },
  created () {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'snFocus',
    })
  },
  watch: {
    '$store.state.snFocusMsg': {
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
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let [, , tId] = key.split('_')
      let tree
      for (let i in this.focus) {
        this.focus[i].isShow = false
        clearInterval(this.focus[i].timer)
      }
      if (type === 0) {
        tree = cloneObj(this.$store.state.checkMsg.tree)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        tree = this.focus[key].tree
        this.currentKey = key
      }
      switch (type) {
        case 0:
          this.$set(this.focus, key, {
            mac: [], //机泵信息存放
            noData: {
              isShow: true,
              text: this.$t('SnFocus.noFocusMacTips'),//'无重点关注机组',
            },
            tree,//组织信息
            timer: '', //定时器
            isRequstDown: true,
            isDataRight: true, //请求机组数据时点击收藏会出现数据错误显现，标识是否会存在数据错误
            isShow: true,
          })
          break
        case 1:
          this.focus[key].isShow = true
          break
        case 2:
          this.$delete(this.focus, key)
          break
        case 4:
          this.focus[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let requestData = {
          t_id: tree.t_id,
          t_root: tree.t_root, //mac.baseInfo.ch_class
          needChild: 1,
        }
        clearInterval(this.focus[key].timer)
        let fn = () => {
          this.getData(requestData)
          return fn
        }
        this.focus[key].timer = setInterval(fn(), 6000)
      }
    },
    // 跳转到设备模型
    jumpToModel (item) {
      /* 从vuex中获取当前机组 */
      let pump_id = item.msg.pump_id
      let t_id = item.t_id
      let macList = this.$store.state.mac[t_id]
      let mac
      let choosemac = this.$store.state.checkMsg.mac
      if (choosemac !== null) {
        if (choosemac.pump_id == pump_id) {
          this.$bus.$emit(
            'generalRouting',
            'snModel',
            this.$t('YtModel.macModel'),//'设备模型',
            'icon-shijingsanwei-'
          )
          return
        }
      }
      // 若选中自组织的机泵则现修改checkMsg组织为自组织
      let checkTree = this.$store.state.checkMsg.tree
      if (item.t_id != checkTree.t_id) {
        let treeArray = this.$store.state.tree
        for (let i = 0, l = treeArray.length; i < l; i++) {
          if (treeArray[i].t_id == item.t_id) {
            this.$store.commit('getCheckMsg', {
              msg: cloneObj(treeArray[i]),
              type: 'tree',
            })
            break;
          }
        }
      }
      this.$store.state.mac[t_id]
      macList.forEach((item) => {
        if (item.pump_id === pump_id) {
          mac = item
          return
        }
      })
      this.$store.commit('getCheckMsg', {
        msg: cloneObj(mac),
        type: 'mac',
      })

      /* 设置当前的机组 */
      this.$bus.$emit(
        'generalRouting',
        'snModel',
        this.$t('YtModel.macModel'),//'设备模型',
        'icon-shijingsanwei-'
      )
    },
    /*选中的机组 边框变色 */
    choosemac (index) {
      const params = this.focus[this.currentKey]
      for (let i = 0; i < params.mac.length; i++) {
        if (index == i) {
          params.mac[i].chooseflag = true
        } else {
          params.mac[i].chooseflag = false
        }
      }
      for (let j = 0; j < params.mac.length; j++) {
        if (params.mac[j].chooseflag) {
          this.$refs[`view_content${j}`][0].style.border = '1px solid #00fcf9'
        } else {
          this.$refs[`view_content${j}`][0].style.border = ''
        }
      }
    },
    /* 收藏和取消收藏机组 */
    collection (item) {
      const params = this.focus[this.currentKey]
      item.isCollect = !item.isCollect
      let requestData = {
        t_id: item.t_id,
        mac_id: item.msg.mac_id,
        t_root: 1,
        id: item.msg.pump_id,
        isFocus: item.isCollect ? 1 : 0,
      }
      this.$getApi.updateHmiFoucsStatus(requestData).then((res) => {
        if (res) {
          /* 收藏成功 */
        } else {
          item.isCheck = !item.isCheck
          this.$pop(this.$t('Common.quitCollectTips'))//取消收藏失败
        }
        if (!params.isRequstDown) {
          params.isDataRight = false
        }
      })
    },
    /* 获取所有的收藏的机组 */
    getData (requestData) {
      const params = this.focus[this.currentKey]
      if (params.isRequstDown) {
        params.isRequstDown = false
        this.$getApi.queryAllFocus(requestData).then((res) => {
          params.isRequstDown = true
          if (res) {
            if (params.isDataRight) {
              let macArray = []
              if (res.data.length === 0) {
                /* 无机组 */
                params.noData.isShow = true
              } else {
                res.data.forEach((item) => {
                  params.noData.isShow = false
                  let obj = {}
                  /*
                  name:机泵名称
                  t_id:
                  imgSrc://图片地址
                  speed:转速
                  status: 0 离线 1 正常 2 预警 3 报警
                  chooseflag:flase 是否被选中
                  isCollect 是否被收藏
                  msg: 机泵所有的信息
                  */
                  let time = this.$t('Common.noDataText')//无数据
                  let desc = this.$t('Common.noDiagText')//'暂无诊断结果'
                  /* 诊断报告 */
                  if (item.result) {
                    time = item.result.time
                    desc = item.result.desc
                  }
                  if (item.overview) {
                    obj.imgSrc = item.overview.bgurl
                    // obj.imgSrc = 'http://10.100.0.101:8085' + item.overview.bgurl
                  } else {
                    obj.imgSrc = require('assets/images/hg/hg-foucus-none.png')
                  }
                  obj.name = item.pump.pump_name
                  obj.t_id = item.t_id
                  if (item.speed) {
                    obj.speed =
                      item.speed >= 100000000 ? this.$t('Common.noDataText') : item.speed + 'rpm'
                  } else {
                    obj.speed = this.$t('Common.noDataText')//'无数据'
                  }
                  obj.status = item.alarm_status ? item.alarm_status : 0
                  obj.isCollect = item.isFocus === 1 ? true : false
                  obj.msg = item.pump
                  obj.time = time
                  obj.desc = desc
                  macArray.push(obj)
                })
                let compare = function (obj1, obj2) {
                  let val1 = obj1.name
                  let val2 = obj2.name
                  if (val1 < val2) {
                    return -1
                  } else if (val1 > val2) {
                    return 1
                  } else {
                    return 0
                  }
                }
                macArray.sort(compare)
                params.mac = macArray
              }
            } else {
              clearInterval(params.timer)
              let fn = () => {
                this.getData(requestData)
                return fn
              }
              params.timer = setInterval(fn(), 6000)
              params.isDataRight = true
            }
          }
        })
      }
    },
  },
}
export default snFocus;