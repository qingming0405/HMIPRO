import { defaultCode, getUnit, cloneObj } from 'utils/utils.js'
import { getMenus, showRightMenu } from 'common/menus/Menus.js'
const mechineModel = {
  name: 'snMechineModel',
  data () {
    return {
      snMechineModel: {},
      currentKey: '',
    }
  },
  created () {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'snMechineModel',
    })
  },
  deactivated () {
    clearTimeout(this.snMechineModel[this.currentKey].timer);
  },
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.snMechineModel) {
        this.snMechineModel[i].isShow = false
        clearInterval(this.snMechineModel[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.snMechineModel)
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
        mac = this.snMechineModel[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.snMechineModel, key, {
            mac,
            picture: '',
            points: [],
            pos: [],
            imgSrc: '', //背景图地址
            isShowBackground: true, //没有背景图片的时候显示
            bgURL: require('assets/images/indexLogoBg2.png'),
            version: 0,//0:水泥老版本；1：水泥化工新版本
            title: {
              name: '',
              fontsize: '25px'
            },
            backgroundImage: {
              startPicX: null,
              startPicY: null,
              newPW: null,
              newPH: null,
              BH: null,
            },
            isShow: true,
            timer: null,
          })
          break
        case 1 /* 切换图表 */:
          this.snMechineModel[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.snMechineModel, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.snMechineModel[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let requestData = {
          mac_id: mac.mac_id,
          pump_id: mac.pump_id,
          ch_class: 1, //mac.baseInfo.ch_class
        }
        clearInterval(this.snMechineModel[key].timer)
        let fn = () => {
          this.getData(requestData);
          return fn;
        };
        this.snMechineModel[key].timer = setInterval(fn(), 6000);
      }
    },
    // 网络请求
    getData (requestData) {
      const param = this.snMechineModel[this.currentKey]
      this.$getApi.queryPumpOverView(requestData).then((res) => {
        if (res) {
          if (res.overview) {
            param.isShowBackground = false
            /* 清空测点列表 */
            param.pos = []
            param.points = []
            if (res.overview.itemList) {
              res.overview.itemList.forEach((item, index) => {
                let text = '',
                  name = '',
                  unit = ''
                if (!item.realData) {
                  // 如果没有实时数据
                  text = this.$t('Common.noRealData');//无实时数据
                } else {
                  /* 获取默认特征值 */
                  let filed = defaultCode[item.pos_type].filed
                  if (item.unit) {
                    item.units = item.unit
                  }
                  unit = getUnit(
                    defaultCode[item.pos_type].code,
                    item
                  );
                  name = defaultCode[item.pos_type].name
                  if (item.realData[filed] == null || item.realData[filed] == undefined || item.realData[filed] >= 100000000) {
                    text = this.$t('Common.noRealData');//无实时数据
                  } else {
                    text = name + ':\n' + item.realData[filed].toFixed(3) + unit
                  }

                }
                // 新版本水泥化工画法
                if (res.overview.version) {
                  if (res.overview.o_name) {
                    param.title.name = res.overview.o_name
                    param.title.fontsize = res.overview.overviewFont + 'px'
                  }
                  param.version = res.overview.version
                  let boxStyle = {
                    position: 'absolute',
                  }
                  let posItem = {
                    px: parseFloat(item.px), //图标左上角在图片上的位置
                    py: parseFloat(item.py),
                    pheight: parseFloat(item.height), //图标的高
                    pwidth: parseFloat(item.width), //图标的宽
                    color: this.getStatus(item.alarm_status),
                    name: item.pos_name || '',
                    text: text,
                    circleX: parseFloat(item.circleX),//校园百分比x
                    circleY: parseFloat(item.circleY),//校园百分比x
                    circleD: parseFloat(item.circleD),//校园直径
                    isChoose: false,//是否选中
                    alarm_status: item.alarm_status,
                    name: item.itemName || item.pos_name || '',
                    pos_id: item.pos_id,
                    pos_type: item.pos_type,
                    mac_id: item.mac_id,
                  }
                  param.pos.push(posItem)
                } else {
                  // 旧版本水泥画法
                  /* 获取需要的字段 */
                  /* {
                    textColor: "", //内容颜色
                    rectangleStart: "", //长方形开始的点
                    fontSize:'14'//字体大小
                    width:'',长
                    height:'',高
                    end: "" //终点
                    posName:'',测点名称
                    text:'',里面的有效值
                  } */
                  param.pos.push({
                    hmiX: item.hmiX, //图标左上角在图片上的位置
                    hmiY: item.hmiY,
                    // pheight: item.pheight, //图标的高
                    // pwidth: item.pwidth, //图标的宽
                    color: this.getStatus(item.alarm_status),
                    name: item.pos_name || '',
                    text: text,
                  })
                }
              })
            }
            if (param.imgSrc != res.overview.bgurl) {
              // if (param.imgSrc != 'http://10.100.50.81:8085' + res.overview.bgurl) {
              // if (param.imgSrc != 'http://10.100.50.36:8085' + res.overview.bgurl) {
              param.imgSrc = res.overview.bgurl
              // param.imgSrc = 'http://10.100.50.81:8085' + res.overview.bgurl
              // param.imgSrc = 'http://10.100.0.101:8085' + res.overview.bgurl
              this.drawPicture(res.overview)
            } else {
              if (param.version == 1) {
                console.log(param.backgroundImage)
                this.$nextTick(() => { this.setPoints(param.backgroundImage.startPicX, param.backgroundImage.startPicY, param.backgroundImage.newPW, param.backgroundImage.newPH) })

              } else {
                /* 所有图示的位置 */
                this.getPointLocation(param.backgroundImage.BH, param.backgroundImage.startPicX, param.backgroundImage.startPicY, param.backgroundImage.newPW, param.backgroundImage.newPH)
                this.drawText()
              }
            }
          } else {
            param.isShowBackground = true
          }
        }
      })
    },
    getStatus (status) {
      // 0/null 离线 1正常 2 预警 3 报警
      let color
      if (status == 1) {
        color = '#009944'
      } else if (status == 2) {
        color = '#ffa101'
      } else if (status == 3) {
        color = '#f80000'
      } else {
        color = '#3771b0'
      }
      return color
    },
    // 画
    drawPicture () {
      const param = this.snMechineModel[this.currentKey]
      let canvas = document.getElementsByClassName(`canvas${this.currentKey}`)[0]
      if (canvas) {
        let cxt = canvas.getContext('2d')
        let sn = document.getElementsByClassName(`sn-model${this.currentKey}`)[0]
        const BW = (canvas.width = sn.offsetWidth)
        const BH = (canvas.height = sn.offsetHeight)
        /* 清空画布 */
        cxt.clearRect(0, 0, canvas.width, canvas.height)
        let background = new Image()
        background.src = param.imgSrc
        let newPW, newPH, startPicX, startPicY // 设置 背景长宽 起始点
        let scale = 0.65
        // 若是新画法直接铺平
        if (param.version == 1) {
          scale = 1
        }
        background.onload = () => {
          const PW = background.width
          const PH = background.height
          /* 默认图片的宽度是总宽度的80% */
          // 判断图片的长宽比,高或者宽是背景的80%
          if (param.version == 1) {
            if (PW < BW && PH < BH) {
              newPW = PW
              newPH = PH
              startPicX = (BW - PW) / 2
              startPicY = (BH - PH) / 2
            } else if (PW / PH > BW / BH) {
              // 以宽为准
              newPW = BW * scale
              newPH = (PH / PW) * newPW
              startPicX = (BW * (1 - scale)) / 2
              startPicY = (BH - newPH) / 2
            } else {
              // 以高为准
              newPH = BH * scale
              newPW = (PW / PH) * newPH
              startPicX = (BW - newPW) / 2
              startPicY = (BH * (1 - scale)) / 2
            }
          } else {
            if (PW / PH > BW / BH) {
              // 以宽为准
              newPW = BW * scale
              newPH = (PH / PW) * newPW
              startPicX = (BW * (1 - scale)) / 2
              startPicY = (BH - newPH) / 2
            } else {
              // 以高为准
              newPH = BH * scale
              newPW = (PW / PH) * newPH
              startPicX = (BW - newPW) / 2
              startPicY = (BH * (1 - scale)) / 2
            }
          }
          param.backgroundImage = {
            BH,
            startPicX,
            startPicY,
            newPW,
            newPH,
          }
          cxt.drawImage(background, startPicX, startPicY, newPW, newPH)
          if (param.version == 1) {
            this.$nextTick(() => {
              this.setPoints(param.backgroundImage.startPicX, param.backgroundImage.startPicY, param.backgroundImage.newPW, param.backgroundImage.newPH)

            })
            // let titleCanvas = document.getElementById('titleCanvas')
            // cxt.removeEventListener('onclick', this.clickEvent)
            // cxt.addEventListener('onclick', this.clickEvent(event, cxt, BW, BH, newPW, newPH))
            // this.drawPointSign(BW, BH, startPicX, startPicY, newPW, newPH, cxt)
          } else {
            /* 所有图示的位置 */
            this.getPointLocation(BH, startPicX, startPicY, newPW, newPH)
            this.drawText()
          }
        }

      }
    },
    setPoints (startPicX, startPicY, newPW, newPH) {
      const param = this.snMechineModel[this.currentKey]
      let points = []
      let choosepoint = null
      if (param.points.length > 0) {
        for (let i = 0, l = param.points.length; i < l; i++) {
          if (param.points[i].isChoose == true) {
            choosepoint = param.points[i]
          }
        }
      }
      param.pos.forEach(item => {
        let point = {}
        // 防止框框超出边缘
        let left = 0, top = 0
        if (item.px * newPW + startPicX > 0) {
          left = item.px * newPW + startPicX
        }
        if (newPH * item.py + startPicY > 0) {
          top = newPH * item.py + startPicY
        }
        point.boxStyle = {
          position: 'absolute',
          left: left + 'px',
          top: top + 'px',
          width: (Number(item.pwidth) + 12) + 'px',
          height: (Number(item.pheight) + 12) + 'px',
        }
        // 防止点超出边缘
        let pointleft = 0, pointtop = 0
        if (item.circleX * newPW + startPicX >= 0) {
          pointleft = item.circleX * newPW + startPicX
        }
        if (newPH * item.circleY + startPicY >= 0) {
          pointtop = newPH * item.circleY + startPicY
        }
        point.pointStyle = {
          position: 'absolute',
          left: pointleft + 'px',
          top: pointtop + 'px',
          width: item.circleD + 'px',
          height: item.circleD + 'px',
          background: item.color,
        }
        point.text = item.text
        point.name = item.name
        point.pos_id = item.pos_id
        point.pos_type = item.pos_type
        point.mac_id = item.mac_id
        point.isChoose = false
        if (choosepoint != null) {
          if (point.pos_id == choosepoint.pos_id && point.pos_type == choosepoint.pos_type) {
            point.isChoose = true
          }
        }
        point.textStyle = {
          fontSize: this.computeFontSize(item.text, item.pwidth) + 'px',
          color: item.color
        }
        point.alarm_status = item.alarm_status
        point.namesize = this.computeFontSize(item.name, item.pwidth)
        points.push(point)
      })
      param.points = points
      this.$set(this.snMechineModel[this.currentKey], 'points', points)
    },
    //计算框图的位置
    getPointLocation (BH, startPicX, startPicY, newPW, newPH) {
      const param = this.snMechineModel[this.currentKey]
      /* 框的长宽 */
      /* 判断 */
      let height, width
      if (startPicX < 220) {
        width = startPicX * 0.8
      } else {
        width = 220
      }
      height = width * (4 / 11)
      /* 遍历所有的测点 */
      let left = []
      let right = []
      /* 区分左右区间 按X来分一半在左边 */
      let sortX = (arr) => {
        arr.sort((a, b) => {
          return a.hmiX - b.hmiX
        })
      }
      sortX(param.pos)
      param.pos.forEach((item, index) => {
        if (index < param.pos.length / 2) {
          left.push(item)
        } else {
          right.push(item)
        }
      })
      /* 按从上到下排序 */
      let sortY = (arr) => {
        arr.sort((a, b) => {
          return a.hmiY - b.hmiY
        })
      }
      sortY(left)
      sortY(right)
      /* 排序结果,相差太大，需要重新调整，左右不能相差两个 */
      /* 计算W间距 */
      let leftInterval = this.computeInterval(BH, left.length, height)
      let rightInterval = this.computeInterval(BH, right.length, height)

      /* 左区间组合最终的测点 */
      left.forEach((item, index) => {
        let obj = {}
        obj.position = 'left'
        obj.end = this.computeEnd(item, startPicX, startPicY, newPW, newPH)
        obj.textColor = item.color
        obj.width = width
        obj.height = height
        obj.posName = item.name
        obj.text = item.text
        obj.fontSize = this.computeFontSize(item.name, width)
        /* 计算矩形开始的点 */
        let X = (startPicX - width) / 2
        let Y = BH * 0.02
        obj.rectangleStart = [X, Y + (height + leftInterval) * index]
        param.points.push(obj)
      })
      /* 右区间组合最终的测点 */
      right.forEach((item, index) => {
        let obj = {}
        obj.position = 'right'
        obj.end = this.computeEnd(item, startPicX, startPicY, newPW, newPH)
        obj.textColor = item.color
        obj.width = width
        obj.height = height
        obj.posName = item.name
        obj.text = item.text
        obj.fontSize = this.computeFontSize(item.name, width)
        /* 计算矩形开始的点 */
        let X = startPicX + newPW + (startPicX - width) / 2
        let Y = BH * 0.02 + 10 // 右边和左边的Y错开一点
        obj.rectangleStart = [X, Y + (height + rightInterval) * index]
        param.points.push(obj)
      })
    },
    /* 计算图上小圆点 */
    computeEnd (item, startPicX, startPicY, newPW, newPH) {
      /* 计算终点坐标 */
      let newArr = []
      newArr.push(startPicX + newPW * item.hmiX)
      newArr.push(startPicY + newPH * item.hmiY)
      return newArr
    },
    /* 计算字体 */
    computeFontSize (name, width) {
      let fontSize = 14
      if (name.length * fontSize > width) {
        fontSize = (width * 0.9) / name.length
      }
      return fontSize
    },
    computeInterval (BH, len, height) {
      let interval
      /* 间距小于10 */
      if ((BH * 0.98) / len < height + 10) {
        if ((BH * 0.98) / len > height) {
          // 没有超边距
          interval = (BH * 0.98) / len - height
        } else {
          interval = 5
        }
        /* 如果上下间距太短 */
      } else {
        interval = (BH * 0.9) / len - height
      }
      return interval
    },
    //写上面的字
    drawText () {
      const param = this.snMechineModel[this.currentKey]
      let canvas = this.$refs[`canvas-pos${this.currentKey}`][0]
      if (canvas) {
        let cxt = canvas.getContext('2d')
        let sn = document.getElementsByClassName(`sn-model${this.currentKey}`)[0]
        const BW = (canvas.width = sn.offsetWidth)
        const BH = (canvas.height = sn.offsetHeight)
        /* 清空画布 */
        cxt.clearRect(0, 0, canvas.width, canvas.height)
        param.points.forEach((item) => {
          let rectWidth = item.width
          let rectHeight = item.height
          // 矩形开始点
          let rectX = item.rectangleStart[0]
          let rectY = item.rectangleStart[1]
          /* 中间点 */
          let pointX
          if (item.position === 'left') {
            pointX = rectX + rectWidth
          } else {
            pointX = rectX
          }
          let pointY = rectY + rectHeight / 2
          /* 终点 */
          let endX = item.end[0]
          let endY = item.end[1]

          cxt.beginPath()
          cxt.rect(rectX, rectY, rectWidth, rectHeight)
          /* 背景颜色 */
          cxt.fillStyle = 'rgba(4, 30, 57, 0.6)'
          cxt.fill()
          cxt.font = `${item.fontSize}px normal` //设置字体
          /* 标题颜色 */
          cxt.fillStyle = '#fff'
          cxt.textAlign = 'center'
          // 设置垂直对齐方式
          cxt.textBaseline = 'middle'
          // 绘制文字（参数：要写的字，x坐标，y坐标）
          cxt.fillText(
            item.posName,
            rectX + rectWidth / 2,
            rectY + rectHeight * 0.3
          )
          /* 字体颜色 */
          cxt.fillStyle = item.textColor
          cxt.fillText(item.text, rectX + rectWidth / 2, rectY + rectHeight * 0.7)
          cxt.closePath()
          /* 画圆点 */
          cxt.beginPath()
          cxt.arc(endX, endY, 5, 0, Math.PI * 2, true)
          cxt.fill()
          /* 画线 */
          cxt.moveTo(pointX, pointY)
          cxt.lineTo(endX, pointY)
          cxt.lineTo(endX, endY)
          /* 线的颜色 */
          cxt.strokeStyle = item.textColor
          cxt.stroke()
          cxt.closePath()
        })
      }
    },
    pointClick (item) {
      this.points.forEach(el => {
        el.isChoose = false
      })
      item.isChoose = true
    },
    toTrend (item) {
      let posArr = this.$store.state.pos[item.mac_id]
      posArr.forEach(el => {
        if (el.pos_id == item.pos_id && el.pos_type == item.pos_type) {
          this.$store.commit('getCheckMsg', {
            msg: cloneObj(el),
            type: 'pos',
          })
        }
      })
      let name = "trend"; //实时数据列表
      let val = this.$t('Common.trend');//"趋势图";
      let icon = "icon-qushitu_huaban1";
      let key = `${name}_pos_${item.mac_id}_${item.pos_id}_${item.pos_type}`;
      this.$bus.$emit("choiceChartType", key, val);
    },
    // 右键菜单
    showContextmenu (e, posInfo) {
      let pos = this.$store.getters.getPos(posInfo.mac_id, posInfo.pos_type, posInfo.pos_id)
      let text = getMenus(['trend', 'wave', 'real', 'alarm'])
      let info = {
        type: 'pos',
        tree: null,
        mac: null,
        pos
      }
      showRightMenu(this, e, text, info)
    },
  },
  watch: {
    '$store.state.snMechineModelMsg': {
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
export default mechineModel;