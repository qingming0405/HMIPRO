/* 水泥、化工公用 */
import { cloneObj } from 'utils/utils.js'
const snGeneral = {
  data () {
    return {
      timer: {}, //定时器
      general: {},
      requestData: {},
      currentKey: '',

    }
  },
  watch: {
    '$store.state.snGeneralMsg': {
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
  created () {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'snGeneral',
    })
  },
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let [, , tId] = key.split('_')
      let tree, requestData, generalTitle
      for (let i in this.general) {
        this.general[i].isShow = false
        this.timer[key] && clearInterval(this.timer[key])
      }
      if (type === 0) {
        tree = cloneObj(this.$store.state.checkMsg.tree)
        this.currentKey = key
        generalTitle = cloneObj(this.$store.state.chooseTitle.generalTitle)
      } else if (type === 1 || type === 4) {
        tree = this.general[key].tree
        this.currentKey = key
      }
      if (type === 0 || type === 1 || type === 4) {
        requestData = {
          t_id: tree.t_id,
          type: tree.t_root, //mac.baseInfo.ch_class
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.general, key, {
            generalTitle,
            isShowBackground: true,
            backgroundStyle: {
              //背景图
              background: `url(${require('assets/images/indexLogoBg2.png')})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right bottom',
            },
            generalImg: null, //总貌图
            itemList: [],
            backgroundImgWH: {}, // 背景图片长宽的位置
            title: {
              name: '',
              fontsize: '25px'
            },
            version: 0,//0:水泥老版本；1：水泥化工新版本
            tRoot: null,
            treeList: [], //如果有子组织就存放下面的所有组织信息
            turnToFlag: false, //标识，是否是点击标签跳转的
            requestData,
            isShow: true,
            tree,
            isDataRight: true, //请求机组数据时点击收藏会出现数据错误显现，标识是否会存在数据错误
            isRequstDown: true,
          })
          break
        case 1 /* 切换图表 */:
          this.general[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.general, key)
          clearInterval(this.timer[key])
          break;
        case 4 /* 从其他图表跳转已存在图标 */:
          this.general[key].isShow = true
          break;
      }
      if (type === 0 || type === 1 || type === 4) {
        for (let i in this.timer) {
          clearInterval(this.timer[i])
        }
        let fn = () => {
          this.getData(requestData);
          return fn;
        };
        this.timer[key] = setInterval(fn(), 6000);
      }

    },
    getData (requestData) {
      const param = this.general[this.currentKey]
      if (this.$store.state.chooseTitle && this.$store.state.chooseTitle.name === 'snGeneral') {
        if (param.isRequstDown) {
          param.isRequstDown = false
          this.$getApi.queryTreeOverviewByTId(requestData).then((res) => {
            param.isRequstDown = true
            if (res) {
              if (param.isDataRight) {
                /* 子组织的总貌图 */
                /* 存在子组织 */
                if (param.turnToFlag) {
                  // 从父组织跳转过来的，不将treeList清空，将标签激活
                  param.treeList.forEach((item) => {
                    if (res.folder.t_id == item.t_id) {
                      item.isClick = true
                    } else {
                      item.isClick = false
                    }
                  })
                } else {
                  /* 从其他地方进入的，清空标签。并将子组织都放入treeList */
                  param.treeList = [] //
                  if (res.folder.flowLine.length > 0) {
                    res.folder.flowLine.forEach((tree, index) => {
                      let obj = {}
                      obj.t_id = tree.t_id
                      obj.t_name = tree.t_name
                      obj.isClick = false
                      param.treeList.push(obj)
                    })
                  }
                }
                param.tRoot = res.folder.t_root
                if (res.folder.overview.bgurl) {
                  param.isShowBackground = false // 关闭默认图片
                  param.generalImg = res.folder.overview.bgurl
                  /* param.generalImg =
                    // 'http://10.100.50.81:8085' + res.folder.overview.bgurl //测试使用
                    'http://10.100.0.101:8085' + res.folder.overview.bgurl */
                  let result = res.folder.overview
                  /* 处理背景图片 */
                  this.setBackgroundImg(result)
                  if (res.folder.overview.o_name) {
                    param.title.name = res.folder.overview.o_name
                    param.title.fontsize = res.folder.overview.overviewFont + 'px'
                  }
                } else {
                  param.isShowBackground = true
                }
                /* 将跳转标识置为false */
                this.turnToFlag = false
              } else {
                clearInterval(this.timer[this.currentKey])
                let fn = () => {
                  this.getData(requestData)
                  return fn
                }
                this.timer[this.currentKey] = setInterval(fn(), 6000)
                param.isDataRight = true
              }

            }
          })
        }
      } else {
        clearInterval(this.timer[this.currentKey])
      }
    },
    /* 设置背景总貌图片 */
    setBackgroundImg (result) {
      const param = this.general[this.currentKey]
      /* 默认背景图的宽高是16:9，以sn 高为标准来放大图片 */
      let sn = document.querySelector(`.sn-general${this.currentKey}`)
      let BH = sn.offsetHeight
      let BW = sn.offsetWidth
      let imgDom = document.getElementsByClassName(`general-div${this.currentKey}`)[0]
      let background = new Image()
      background.src = param.generalImg
      background.onload = () => {
        let PW = background.width
        let PH = background.height
        /* 图片居中显示 */
        /* 比例 适应图片 ，现在要求16比9 */
        // let newPW = (BH / 9) * 16;
        if (PW > BW) {
          PH = (BW / PW) * PH
          PW = BW
        }
        if (PH > BH) {
          PW = (BH / PH) * PW
          PH = BH
        }
        let left = (BW - PW) / 2
        let top = (BH - PH) / 2
        imgDom.style.height = PH + 'px'
        imgDom.style.width = PW + 'px'
        imgDom.style.left = left + 'px'
        imgDom.style.top = top + 'px'
        param.backgroundImgWH = {
          w: PW,
          h: PH,
        }
        // 兼容老版水泥画法，version存在则是使用新画法
        if (!result.version) {
          this.setPump(result)
        } else {
          param.version = result.version
          this.setNewPump(result)
        }

      }
    },
    setNewPump (result) {
      const param = this.general[this.currentKey]
      param.itemList = [] //置空
      let itemList = result.itemList
      let t_id = result.tree_id
      itemList.forEach((item) => {
        /* 需要的机泵对象 */
        let obj = {}
        /*
         pump_name:机泵名称
         mac_id:机组id
         t_id：组织id
         pump_id:机泵id
         imgSrc:图片的地址
         PumpStyle:代表机泵的圆点样式，
         FocusStyle：收藏icon的样式
         px:机泵名称位置x
         py:机泵名称位置y
         imgStyle:机泵图片的样式
         isCheck：是否被收藏
         msg:原始的所有信息
         */
        obj.pump_name = item.itemName
        obj.t_id = t_id
        obj.mac_id = item.machine_id
        obj.pump_id = item.pump_id
        obj.msg = item
        // 文字位置
        obj.style = {
          position: 'absolute',
          left: param.backgroundImgWH.w * item.px + 'px',
          top: param.backgroundImgWH.h * item.py + 'px',
          width: Number(item.width) + 12 + 'px',
          height: (Number(item.height) + 12) / 2 + 'px',
          textAline: 'center',
        }
        let color = ''
        // 0/null 离线 1正常 2 预警 3 报警
        if (item.alarm_status == 1) {
          color = '#009944'
        } else if (item.alarm_status == 2) {
          color = '#FFA101'
        } else if (item.alarm_status == 3) {
          color = '#F80000'
        } else {
          color = '#3771b0'
        }
        obj.PumpStyle = {
          position: 'absolute',
          left: param.backgroundImgWH.w * item.circleX + 'px',
          top: param.backgroundImgWH.h * item.circleY + 'px',
          height: item.circleD + "px",
          width: item.circleD + "px",
          borderRadius: item.circleD / 2 + "px",
          background: color,
        }
        obj.iconfontstyle = {
          position: 'absolute',
          left: item.width + 'px',
        }
        obj.titleStyle = {
          position: 'absolute',
          left: (param.backgroundImgWH.w * item.circleX + item.circleD + 5) + 'px',
          top: (param.backgroundImgWH.h * item.circleY + item.circleD + 5) + 'px',
          height: "19px",
          width: "19px",
        }
        obj.isCheck = item.isFocus ? true : false
        param.itemList.push(obj)
      })
    },
    resize () {
      const param = this.general[this.currentKey]
      clearInterval(this.timer[this.currentKey])
      let fn = () => {
        this.getData(param.requestData)
        return fn
      }
      this.timer[this.currentKey] = setInterval(fn(), 6000)
    },
    //点击子组织选择,进入自组织总貌图
    clickTree (tree) {
      const param = this.general[this.currentKey]
      param.turnToFlag = true //将跳转标签置为true
      param.treeList.forEach((t) => {
        t.isClick = false
      })
      tree.isClick = true
      let treeArray = this.$store.state.tree
      treeArray.forEach((t) => {
        if (tree.t_id == t.t_id) {
          // 使用线程防止异步产生标题错乱
          new Promise((resolve, reject) => {
            this.$store.commit('getCheckMsg', {
              msg: cloneObj(t),
              type: 'tree',
            })
            resolve('成功')
          }).then(() => {
            this.$bus.$emit("generalRouting", 'snGeneral', '总貌图', 'icon-shouye1')
          })
        }
      })
    },
    /* 收藏和取消收藏机泵 */
    choosePump (item) {
      const params = this.general[this.currentKey]
      item.isCheck = !item.isCheck
      let requestData = {
        t_id: item.t_id,
        mac_id: item.mac_id,
        t_root: 1,
        id: item.pump_id,
        isFocus: item.isCheck ? 1 : 0,
      }
      console.log(requestData)
      /* 发送网络请求 */
      this.$getApi.updateHmiFoucsStatus(requestData).then((res) => {
        if (res) {

        } else {
          item.isCheck = !item.isCheck
          this.$pop(`${this.$t('Common.collectTips')}`)//收藏失败
        }
        /* 收藏成功 */
        if (!params.isRequstDown) {
          params.isDataRight = false
        }
      })
    },
    /* 跳转到设备模型 */
    jumpToModel (item) {
      /* 从vuex中获取当前机组 */
      let pump_id = item.pump_id
      let t_id = item.t_id
      let macList = this.$store.state.mac[t_id]
      let mac
      let choosetree = cloneObj(this.$store.state.checkMsg.tree)
      let choosemac = cloneObj(this.$store.state.checkMsg.mac)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.pump_id == item.pump_id) {
          if (choosemac.t_id != choosetree.t_id) {
            let treeArray = this.$store.state.tree
            treeArray.forEach((tree) => {
              if (choosemac.t_id == tree.t_id) {
                this.$store.commit('getCheckMsg', {
                  msg: cloneObj(tree),
                  type: 'tree',
                })
                this.$store.commit('getCheckMsg', {
                  msg: cloneObj(choosemac),
                  type: 'mac',
                })
                resolve('成功')
              }
            })
          }
          resolve('成功')
        } else {
          macList.forEach((item) => {
            if (item.pump_id === item.pump_id) {
              mac = item
              return
            }
          })
          /* 设置当前的机组 */
          if (mac.t_id != choosetree.t_id) {
            let treeArray = this.$store.state.tree
            treeArray.forEach((tree) => {
              if (mac.t_id == tree.t_id) {
                this.$store.commit('getCheckMsg', {
                  msg: cloneObj(tree),
                  type: 'tree',
                })
              }
            })
          }
          // 取机组
          this.$store.commit('getCheckMsg', {
            msg: cloneObj(mac),
            type: 'mac',
          })
          resolve('成功')
        }
      }).then(() => {
        /* 设置当前的机组 */
        this.$bus.$emit(
          'generalRouting',
          'snModel',
          this.$t('YtModel.macModel'),//'设备模型',
          'icon-shijingsanwei-'
        )
      })
    },
  },
  deactivated () {
    clearInterval(this.timer[this.currentKey])
  },
}
export default snGeneral;