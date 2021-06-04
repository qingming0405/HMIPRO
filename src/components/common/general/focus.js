import { cloneObj, round, setHead, setPosMsg } from 'utils/utils.js'
export default focus = {
  data () {
    return {
      focus: {},/* 重点关注 */
      currentKey: '',
      eachRowNum: 6,
    }
  },
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let [, , tId] = key.split('_')
      let tree
      for (let i in this.focus) {
        this.focus[i].isShow = false
        clearInterval(this.focus[i].timer.focustimer)
        clearInterval(this.focus[i].timer.seltimer)
      }
      if (type === 0) {
        tree = cloneObj(this.$store.state.checkMsg.tree)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        tree = this.focus[key].tree.msg
        this.currentKey = key
      }
      switch (type) {
        case 0:
          this.$set(this.focus, key, {
            searchKey: '',
            mac: [],
            ischeck: true,
            tArray: [],
            tree: {
              msg: tree,
              val: tree.t_name,
              id: tree.t_id,
            },
            // 多选下拉框内容
            checkList: {
              hasOpen: false,
              isOpen: false,
              key: '',
              isShow: false,
              text: [],
              style: null,
              child: [],
            },
            mArray: [], //机组列表
            mac: {
              msg: [],
              val: '',
            },
            checkMsg: {
              tree: tree, //单选
              mac: [], //多选
              pos: {}, //单选
            }, //选中的组织机组测点
            pArray: [], //测点列表
            pos: {
              msg: {},
              val: '',
            },
            eigenvalue: [],
            echeckList: {
              isShow: false,
              style: {},
            },
            eigen: {
              msg: {},
              val: '',
            },
            pagemacList: [], //分页的收藏机组数据
            macList: [], //全部收藏机组
            macSum: 0,
            macIDx: '', //机组测点ids
            pageselmacList: [], //分页的筛选数据
            selmacList: [], //全部筛选数据
            eachRowNum: this.eachRowNum, //每一行的个数
            timer: {
              focustimer: '', //关注定时器
              seltimer: '', //筛选定时器
            },
            isFocusRequestDown: true, //收藏级组请求是否结束
            isSelRequestDown: true, //筛选级组请求是否结束
            isDataRight: true, //请求机组数据时点击收藏会出现数据错误显现，标识是否会存在数据错误
            isShow: true,
            downShow: false,/* 翻页图标是否显示 */
          })
          if (tree.t_root == 3) {
            // 油田初始化分组的收藏机组与筛选机组
            this.focus[this.currentKey].groupMacList = {}
            this.focus[this.currentKey].groupSelmacList = {}
          } else if (tree.t_root == 2) {
            // 轨交初始化存在自组织时需要分组的收藏机组与筛选机组
            this.focus[this.currentKey].groupMacList = {}
            this.focus[this.currentKey].groupSelmacList = {}
            let isShowTree = false // true:航海选中父组织时显示子组织
            // 判断是否为杭海城际
            let isHanghai = config.gjModel === 1
            if (isHanghai && tree.children && tree.children.length > 0) {
              isShowTree = true
            } else {
              isShowTree = false
            }
            this.focus[this.currentKey].isShowTree = isShowTree
          }
          this.$nextTick(() => {
            if (this.$refs[`general_scroll${this.currentKey}`][0]) {
              this.$refs[`general_scroll${this.currentKey}`][0].addEventListener(
                "scroll",
                this.isShowDropdownIcon
              );
            }
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
        if (tree.t_root == 3) {
          // 油田初始化分组的收藏机组与筛选机组
          this.macList = this.focus[this.currentKey].macList
          this.selmacList = this.focus[this.currentKey].selmacList
        }
        let requestData = {
          t_id: tree.t_id,
          t_root: tree.t_root, //mac.baseInfo.ch_class
          needChild: 1,
        }
        clearInterval(this.focus[key].timer.focustimer)
        clearInterval(this.focus[key].timer.seltimer)
        let fn = () => {
          this.getData(requestData)
          return fn
        }
        this.focus[key].timer.focustimer = setInterval(fn(), 6000)
        // 若筛选机组长度大于0则表示开启筛选
        if (this.focus[key].selmacList.length > 0) {
          this.MacSelecttimer()
        }
        //获取选中机组下的mac
        this.$getApi
          .queryAllMachineByTid({
            t_id: tree.t_id,
            t_root: tree.t_root,
            needChild: 1,
          })
          .then((res1) => {
            if (res1) {
              let machines = res1.machines
              if (machines.length > 0) {
                const mac = cloneObj(machines, true)
                for (let i = 0, l = mac.length; i < l; i++) {
                  mac[i].machine_id = mac[i].mac_id
                  mac[i].m_me = mac[i].mac_me
                  mac[i].isShow = true
                }
                this.focus[key].mArray = mac
              }
            }
          })
      }
    },
    getAlarmStatus (obj, alarm_status) {
      switch (alarm_status) {
        case 0: //'离线'
          obj.status = this.$t('YtFocus.offlineText')
          obj.type = 4
          break
        case 1: //'正常'
          obj.status = this.$t('YtFocus.normalText')
          obj.type = 1
          break
        case 2: //'预警'
          obj.status = this.$t('YtFocus.warnText')
          obj.type = 2
          break
        case 3: //'报警'
          obj.status = this.$t('YtFocus.alarmText')
          obj.type = 3
          break
      }
      return obj
    },
    /* 获取所有的收藏的机组 */
    getData (requestData) {
      const params = this.focus[this.currentKey]
      if (params.isFocusRequestDown) {
        params.isFocusRequestDown = false
        this.$getApi.queryAllFocus(requestData).then((res) => {
          params.isFocusRequestDown = true
          if (res) {
            if (params.isDataRight) {
              let macList = []
              // this.mac = [];
              res.data.forEach((item) => {
                let obj = {}
                obj.chooseflag = false //是否选中
                let stutas = config.generalStutas
                if (stutas && item.alarm_status == 0) {
                  item.alarm_status = 1
                }
                obj.t_root = item.t_root
                obj.alarmStatus = item.alarm_status
                obj = this.getAlarmStatus(obj, item.alarm_status)
                obj.isShow = true //控制是否显示
                obj.t_id = item.t_id
                obj.mac_id = item.mac_id
                obj.isFocus = item.isFocus ? true : false
                obj.name = item.mac_me
                obj.speed = item.speed < 100000000 ? round(item.speed, 2) : 0
                obj.pumps = item.pumps
                macList.push(obj)
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
              macList.sort(compare)
              params.macList = macList
              // 若general_scroll可滚动且未滚到底部
              this.$nextTick(this.isShowDropdownIcon);
            } else {
              clearInterval(params.timer.focustimer)
              let fn = () => {
                this.getData(requestData)
                return fn
              }
              params.timer.focustimer = setInterval(fn(), 6000)
              params.isDataRight = true
            }
          }
        })
      }
    },
    // toMacModel (item, toPage) {
    //   this.$router.push(toPage);
    //   let macArray = this.$store.state.mac[item.t_id];
    //   let choosemac = this.$store.state.checkMsg.mac;
    //   if (choosemac !== null && choosemac.machine_id == item.mac_id) {
    //     return;
    //   } else {
    //     for (let i = 0; i < macArray.length; i++) {
    //       if (macArray[i].mac_id == item.mac_id) {
    //         this.$store.commit("getCheckMsg", {
    //           msg: macArray[i],
    //           type: "mac",
    //         });
    //         break;
    //       }
    //     }
    //   }
    // },
    //点击收藏
    //双击进入mac的model页
    toMacModel (item, toPage) {
      let macArray = this.$store.state.mac[item.t_id];
      let choosemac = this.$store.state.checkMsg.mac;
      let choosetree = cloneObj(this.$store.state.checkMsg.tree);
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.machine_id == item.mac_id) {
          if (choosemac.t_id != choosetree.t_id) {
            let treeArray = this.$store.state.tree;
            treeArray.forEach(tree => {
              if (choosemac.t_id == tree.t_id) {
                this.$store.commit("getCheckMsg", {
                  msg: cloneObj(tree),
                  type: "tree"
                });
                this.$store.commit("getCheckMsg", {
                  msg: cloneObj(choosemac),
                  type: "mac"
                });
                resolve('成功')
              }
            });
          }
          resolve('成功')
        } else {
          for (let i = 0; i < macArray.length; i++) {
            if (macArray[i].mac_id == item.mac_id) {
              /* 设置当前的机组 */
              if (macArray[i].t_id != choosetree.t_id) {
                let treeArray = this.$store.state.tree;
                treeArray.forEach(tree => {
                  if (macArray[i].t_id == tree.t_id) {
                    this.$store.commit("getCheckMsg", {
                      msg: cloneObj(tree),
                      type: "tree"
                    });
                  }
                });
              }
              this.$store.commit("getCheckMsg", {
                msg: macArray[i],
                type: "mac"
              });
              resolve('成功')
              break;
            }
          }
        }

      }).then(() => {
        this.$bus.$emit(
          'generalRouting',
          toPage,
          '设备模型',
          'icon-shijingsanwei-'
        )
      })
    },
    collection (item) {
      const params = this.focus[this.currentKey]
      let requestData = {
        t_id: item.t_id,
        mac_id: item.mac_id,
        t_root: item.t_root,
        id: item.mac_id,
        isFocus: item.isFocus ? 0 : 1,
      }
      this.$getApi.updateHmiFoucsStatus(requestData).then((res) => {
        item.isFocus = !item.isFocus
        if (res) {
          /* 收藏成功 或取消收藏成功*/
          //重新获取收藏机组
          // this.getData(this.requestData)
        } else {
          item.isFocus = !item.isFocus
          this.$pop(this.$t('Common.collectTips'));//收藏失败
        }
        if (!params.isFocusRequestDown || !params.isSelRequestDown) {
          params.isDataRight = false
        }
      })
    },
    /* 递归查找组织 */
    recursionSearchTree (treeArr, newVal) {
      let fn = (arr) => {
        let flag = false //定义一个标签来表示是否有被选中
        arr.forEach((item) => {
          /* 匹配到了 */
          if (this.matchPinyin(item.name, newVal.val)) {
            item.isShow = true
            flag = true
            /* 匹配到父级别，默认子集全部显示 */
            if (item.children) {
              /* 打开父级 */
              item.isOpen = true
              this.showAllList(item.children)
            }
            /* 有子集 */
          } else if (item.children) {
            /* 如果有子集的先打开 */
            /* 递归 */
            flag = fn(item.children)
            item.isShow = flag
            item.isOpen = flag
          } else {
            /* 没匹配到也没子集 */
            item.isShow = false
          }
        })
        return flag
      }
      /* 搜索为空的时候，所有的组织都显示 */
      if (newVal.val === '') {
        this.showAllList(treeArr)
      } else {
        fn(treeArr)
      }
    },
    /* 匹配拼音,匹配到返回true,否则返回flase */
    matchPinyin (matchVal, val) {
      return this.pinyin.match(matchVal, val)
    },
    //点击机组修改border
    choosemac (index, arr, field) {
      this.$nextTick(() => {
        for (let j = 0; j < arr.length; j++) {
          if (j === index) {
            this.$refs[field + j][0].style.border = '1px solid #00fcf9'
          } else {
            this.$refs[field + j][0].style.border = ''
          }
        }
      })
    },
    // 设置是否勾选现实收藏
    setClass (bool) {
      const iName = 'iconfont'
      const check = ['icon-zhongzi_xuanzekuang', 'icon-zhongzi_xuanzekuang1']
      return `${iName} ${check[Number(bool)]}`
    },
    // 点击是否显示筛选
    isShowCollect () {
      const params = this.focus[this.currentKey]
      params.ischeck = !params.ischeck
    },
    // 子级单选
    checkItem (item) {
      const params = this.focus[this.currentKey]
      item.isCheck = !item.isCheck
      //选中全部时
      if (item.id === -1 && item.isCheck === true) {
        params.checkList.text.forEach((a) => {
          a.isCheck = true
        })
      } else if (item.id === -1 && item.isCheck === false) {
        //取消全选
        params.checkList.text.forEach((a) => {
          a.isCheck = false
        })
      } else if (item.id !== -1 && item.isCheck === false) {
        params.checkList.text.forEach((a) => {
          if (a.id === -1) {
            a.isCheck = false
          }
        })
      }
    },
    //设置机组下拉列表
    changeMacType (e) {
      const params = this.focus[this.currentKey]
      const size = e.currentTarget.getBoundingClientRect()
      const style = {
        maxHeight: '300px',
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height + 3}px`,
      }
      // let mac = this.mArray
      let check = params.checkMsg
      let text = []
      if (params.mArray !== null) {
        let checkAll = true
        // 将选中的mac的isCheck修改为true
        for (let i = 0; i < params.mArray.length; i++) {
          const value = params.mArray[i]
          let childCheck = false
          for (let j = 0; j < check.mac.length; j++) {
            if (check.mac[j].mac_id === value.mac_id) {
              childCheck = true
              break
            }
          }
          text.push({
            val: value.m_me,
            id: value.mac_id,
            isCheck: childCheck,
            isShow: value.isShow,
          })
        }
      }
      let compare = function compareByMacName (obj1, obj2) {
        let val1 = obj1.val
        let val2 = obj2.val
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
      text.sort(compare)
      if (text.length > 0) {
        text.unshift({
          isShow: true,
          isCheck: false,
          val: '全部',
          id: -1,
        })
      }
      params.checkList = {
        key: 'mac',
        isShow: true,
        text,
        style,
      }
    },
    // 关闭机组下拉列表
    getCheck (e) {
      const params = this.focus[this.currentKey]
      if (e.target.className === 'multiList-edge') {
        let list = params.checkList
        // 下拉框不显示
        list.isShow = false
        let text = list.text
        let check = params.checkMsg.mac
        check = []
        let idx = ''
        let val = ''
        text.forEach((item) => {
          if (item.isCheck === true) {
            check.push(item)
            if (item.id !== -1) {
              idx = idx + item.id + ','
              val = val + item.val + ','
            }
          }
        })
        params.macIDx = idx
        //将选中的mac名称串起来
        params.mac.val = val
        params.mac.msg = check
        //获取选中机组下的测点
        if (idx !== '') {
          this.$getApi
            .searchPositionsByIds({
              mac_ids: idx,
            })
            .then((res) => {
              if (res) {
                let pos = res.positions
                params.pArray = []
                for (let i in pos) {
                  pos[i].isShow = true
                  pos[i].position_name = pos[i].pos_name
                  pos[i].name = pos[i].pos_name
                  // pos[i].isChecked = false
                  params.pArray.push(pos[i])
                }
                params.pArray = setPosMsg(params.pArray)
              }
            })
        }
      }
    },
    /* 单个测点的选择 */
    changePosType (e) {
      const params = this.focus[this.currentKey]
      const size = e.currentTarget.getBoundingClientRect()
      let myStyle = {
        maxHeight: '300px',
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height + 3}px`,
      }
      let data = params.pArray
      this.$multi({
        dateType: 'pos',
        data,
        myStyle,
      }).then((res) => {
        if (res) {
          params.pos.val = res.position_name
          params.pos.msg = res //测点的全部信息
          /* 把所有测点isShow 改为true */
          this.$nextTick(() => {
            params.pArray.forEach((el) => {
              el.isShow = true
            })
          })
          //获取特征值
          if (res.pos_loc) {
            params.eigenvalue = setHead(res.t_root, 2, res.pos_type, res.pos_loc)
          } else {
            params.eigenvalue = setHead(res.t_root, 2, res.pos_type)
          }
        }
      })
    },
    //打开特征值下拉表
    changeEigType (e) {
      const params = this.focus[this.currentKey]
      const size = e.currentTarget.getBoundingClientRect()
      const style = {
        maxHeight: '300px',
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height + 3}px`,
      }
      params.echeckList = {
        isShow: true,
        style,
      }
    },
    //关闭特征值下拉列表
    getEigCheck (e) {
      const params = this.focus[this.currentKey]
      if (e.target.className === 'multiList-edge') {
        let list = params.echeckList
        // 下拉框不显示
        list.isShow = false
      }
    },
    geteigenvalue (item) {
      const params = this.focus[this.currentKey]
      params.echeckList.isShow = false
      params.eigen.msg = item
      params.eigen.val = item.val
    },
    MacSelecttimer (type = 0) {
      const params = this.focus[this.currentKey]
      if (type == 1) {
        if (
          params.macIDx !== '' &&
          Object.keys(params.pos.msg).length > 0 &&
          Object.keys(params.eigen.msg).length > 0 &&
          params.macSum !== 0
        ) {
          let requestData = {
            mac_ids: params.macIDx,
            pos_name: params.pos.msg.name,
            field: params.eigen.msg.filed,
            num: params.macSum,
            t_id: params.tree.id,
          }
          this.MacSelect(requestData, type)
          this.MacSelecttimer()
        } else {
          this.$pop('筛选数据有误')
        }
      } else {
        if (
          params.macIDx !== '' &&
          Object.keys(params.pos.msg).length > 0 &&
          Object.keys(params.eigen.msg).length > 0 &&
          params.macSum !== 0
        ) {
          clearInterval(params.timer.seltimer)
          let requestData = {
            mac_ids: params.macIDx,
            pos_name: params.pos.msg.name,
            field: params.eigen.msg.filed,
            num: params.macSum,
            t_id: params.tree.id,
          }
          let fn = () => {
            this.MacSelect(requestData)
            return fn
          }
          params.timer.seltimer = setInterval(fn(), 6000)
        } else {
          this.$pop('筛选数据有误')
        }
      }
    },
    showAllList (args) {
      let fn = (arr) => {
        arr.forEach((item) => {
          item.isShow = true
          if (item.children) {
            fn(item.children)
          }
        })
      }
      fn(args)
    },
    //翻页
    turnPage () {
      this.isShowDropdownIcon();
      let dom = this.$refs[`general_scroll${this.currentKey}`][0];
      //可以滚动
      dom.scrollTop(dom.scrollLeft, dom.scrollTop + 100);
    },
    //判断当前的下拉图标是否显示
    isShowDropdownIcon () {
      let dom = this.$refs[`general_scroll${this.currentKey}`][0];
      const param = this.focus[this.currentKey]
      param.downShow = true;
      if (dom && dom.scrollHeight - dom.scrollTop - dom.clientHeight <= 0) {
        param.downShow = false;
      }
    },
  },
  watch: {
    /* 监听组织的变化 */
    // '$store.state.checkMsg.tree': {
    //   handler (value, oldValue) {
    //     if (value) {
    //       if (oldValue && value.t_id === oldValue.t_id) return
    //       /* 获取参数 */
    //       let requestData = {
    //         t_id: value.t_id,
    //         t_root: value.t_root, //mac.baseInfo.ch_class
    //         needChild: 1,
    //       }
    //       this.requestData = requestData
    //       clearInterval(this.timer.focustimer)
    //       clearInterval(this.timer.seltimer)
    //       let fn = () => {
    //         this.getData(requestData)
    //         return fn
    //       }
    //       this.timer.focustimer = setInterval(fn(), 6000)
    //       this.tree.msg = value
    //       this.tree.val = value.name
    //       this.checkMsg.tree = value
    //       //获取选中机组下的mac
    //       this.$getApi
    //         .queryAllMachineByTid({
    //           t_id: value.t_id,
    //           t_root: value.t_root,
    //           needChild: 1,
    //         })
    //         .then((res1) => {
    //           if (res1) {
    //             let machines = res1.machines
    //             if (machines.length > 0) {
    //               const mac = cloneObj(machines, true)
    //               for (let i = 0, l = mac.length; i < l; i++) {
    //                 mac[i].machine_id = mac[i].mac_id
    //                 mac[i].m_me = mac[i].mac_me
    //                 mac[i].isShow = true
    //               }
    //               this.mArray = mac
    //             }
    //           }
    //         })
    //       // 清空特征值
    //       this.eigenvalue = []
    //         ; (this.eigen = {
    //           msg: {},
    //           val: '',
    //         }),
    //           (this.macSum = 0)
    //       this.pageselmacList = [] //分页的筛选数据
    //       this.selmacList = []
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    tree: {
      handler (newVal) {
        const params = this.focus[this.currentKey]
        /* 组织改动就将机组清空 */
        params.mac.val = ''
        /* 将标题修改 */
        //考虑多选的情况
        if (newVal.val.includes(',')) {
          this.tArray.forEach((el) => {
            el.isShow = true
          })
        } else {
          this.recursionSearchTree(params.tArray, newVal)
        }
      },
      deep: true,
    },
    mac: {
      handler (newVal) {
        const params = this.focus[this.currentKey]
        /* 机组改动就将测点清空 */
        params.pos.val = ''
        if (newVal.val.includes(',')) {
          params.mArray.forEach((el) => {
            el.isShow = true
          })
        } else {
          params.checkList.text.forEach((el) => {
            //如果有子组织（暂时不考虑）
            if (!this.matchPinyin(el.val, newVal.val)) {
              el.isShow = false
            } else {
              el.isShow = true
            }
          })
        }
      },
      deep: true,
    },
    pos: {
      handler (newVal) {
        const params = this.focus[this.currentKey]
        params.pArray.forEach((el) => {
          //如果有子组织（暂时不考虑）
          if (!this.matchPinyin(el.name, newVal.val)) {
            el.isShow = false
          } else {
            el.isShow = true
          }
        })
      },
      deep: true,
    },
    eigen: {
      handler (newVal) {
        const params = this.focus[this.currentKey]
        params.eigenvalue.forEach((el) => {
          //如果有子组织（暂时不考虑）
          if (!this.matchPinyin(el.val, newVal.val)) {
            el.isShow = false
          } else {
            el.isShow = true
          }
        })
      },
      deep: true,
    },
  },
  created () {
    window.innerWidth < 1380 ? (this.eachRowNum = 5) : (this.eachRowNum = 6)
  },

}