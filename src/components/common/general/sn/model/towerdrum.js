import { defaultCode, getUnit, round, cloneObj, matchRule } from 'utils/utils.js'
const towerdrum = {
  name: 'snTowerdrum',
  data () {
    return {
      snTowerdrum: {},
      currentKey: '',
    }
  },
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.snTowerdrum) {
        this.snTowerdrum[i].isShow = false
        clearInterval(this.snTowerdrum[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.snTowerdrum)
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
        mac = this.snTowerdrum[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.snTowerdrum, key, {
            mac,
            towerDrumDataName: ['倾角', '沉降'],
            towerDrumData: [],/* 倾角 */
            basicsData: [],/* 沉降 */
            timer: null,
            isRequestDownA: true,
            isRequestDownB: true,
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.snTowerdrum[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.snTowerdrum, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.snTowerdrum[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let fn = () => {
          this.getModelInfo(mac);
          return fn;
        };
        this.snTowerdrum[key].timer = setInterval(fn(), 10000);
        this.$nextTick(() => {
          this.drawCanvas()
        })
      }
    },
    getModelInfo (mac) {
      const param = this.snTowerdrum[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
        ch_class: mac.ch_class
      }
      if (param.isRequestDownA && param.isRequestDownB) {
        param.isRequestDownA = false
        param.isRequestDownB = false
        this.$getApi.queryTowerByMacId(requestData).then((res) => {
          param.isRequestDownA = true
          if (res) {
            res.positions2 && this.setModelInfo(res.positions2, 1)
          }
        })
        this.$getApi.queryBasicsByMacId(requestData).then((res) => {
          param.isRequestDownB = true
          if (res) {
            res.basics && this.setModelInfo(res.basics, 2)
          }
        })
      }
    },
    toReal (item) {
      const param = this.snTowerdrum[this.currentKey]
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
            this.$pop("该类型测点没有此图谱");
            return;
          }
          let name = "real"; //实时数据列表
          let val = "实时数据列表";
          let icon = "icon-shishishuju_huaban";
          let key = `${name}_pos_${item.mac_id}_${item.pos_id}_${item.pos_type}`;
          this.$bus.$emit("choiceChartType", key, val);
        }
      }
    },
    setModelInfo (pos, type) {
      const param = this.snTowerdrum[this.currentKey]
      let posArray = pos
      //循环取默认特征值
      posArray.forEach((element) => {
        element.position_type = element.pos_type
        let eigenvalue = defaultCode[element.pos_type]
        if (element.position_type == 11) {
        }
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
                eigenvalue.rvalue = element.baseInfo.baseInfo[i]
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
              } else {
                //不存在
                eigenvalue.value = '无数据'
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
          eigenvalue.value = '无数据'
          if (eigenvalue.unit instanceof Array) {
            eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
          }
        }
        element.eigenvalue = cloneObj(eigenvalue)
      })
      if (type == 1) {
        param.towerDrumData = posArray
      } else if (type == 2) {
        param.basicsData = posArray
      }
    },
    drawCanvas () {
      const param = this.snTowerdrum[this.currentKey]
      this.$refs[`model${this.currentKey}`][0].width = this.$refs[`model${this.currentKey}`][0].clientWidth
      this.$refs[`model${this.currentKey}`][0].height = this.$refs[`model${this.currentKey}`][0].clientHeight
      let dom = this.$refs[`model${this.currentKey}`][0]
      let canvas = dom.getContext('2d')
      // polyfill 提供了这个方法用来获取设备的 pixel ratio
      var getPixelRatio = function (context) {
        var backingStore = context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
      };

      var ratio = getPixelRatio(canvas);
      // canvas.translate(0.5, 0.5);
      let tower = new Image()
      tower.src = require('@/assets/images/hg/dip.png')
      if (tower.complete) {
        let y = 10
        let height = dom.height
        let width = height / tower.height * tower.width
        let x = (dom.width - width) / 2
        if (tower.height < dom.height) {
          y = (dom.height - tower.height) / 2
          height = tower.height
          width = tower.width
        }
        canvas.drawImage(tower, x, y, width, height)
      } else {
        tower.onload = () => {
          let y = 10
          let height = dom.height
          let width = height / tower.height * tower.width
          let x = (dom.width - width) / 2
          if (tower.height < dom.height) {
            y = (dom.height - tower.height) / 2
            height = tower.height
            width = tower.width
          }
          canvas.drawImage(tower, x, y, width, height)
        }
        tower.onerror = function () {
          console.log('canvas加载图片失败')
        }
      }
      canvas.stroke()
      // 小标签
      let hgtitle = new Image()
      hgtitle.src = require('@/assets/images/hg/hgtitle.png')
      if (hgtitle.complete) {
        // 倾角
        let y = 20
        let x = dom.width / 2 - hgtitle.width + 5
        canvas.drawImage(hgtitle, x, y, 302, 44)

        let fontsize = '16px bold 黑体'
        canvas.font = fontsize
        // 设置颜色
        canvas.fillStyle = '#ffffff'
        canvas.fillText(
          '倾角',
          x + 35, y + 28
        )

        /* 沉降 */
        let y2 = dom.height - 44
        canvas.drawImage(hgtitle, x, y2, 302, 44)
        canvas.fillText(
          '沉降',
          x + 35, y2 + 28
        )

      } else {
        hgtitle.onload = () => {
          let y = 20
          let x = dom.width / 2 - hgtitle.width
          canvas.drawImage(hgtitle, x, y, 302, 44)
          let fontsize = '16px bold 黑体'
          canvas.font = fontsize
          // 设置颜色
          canvas.fillStyle = '#ffffff'
          canvas.fillText(
            '倾角',
            x + 35, y + 25
          )

          /* 沉降 */
          let y2 = dom.height - 44
          canvas.drawImage(hgtitle, x, y2, 302, 44)
          canvas.fillText(
            '沉降',
            x + 35, y2 + 28
          )
        }
        tower.onerror = function () {
          console.log('canvas加载图片失败')
        }
      }
    }
  },
  watch: {
    /* 获取选中机组信息 */
    // "$store.state.checkMsg.mac": {
    //   handler (value) {
    //     if (value != null) {
    //       clearInterval(this.timer)
    //       let fn = () => {
    //         this.getModelInfo(value);
    //         return fn;
    //       };
    //       this.timer = setInterval(fn(), 10000);
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
    '$store.state.snTowerdrumMsg': {
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
  mounted () {
    
  },
  beforeDestroy () {
    console.log("清除定时器");
    clearInterval(this.timer);
  },
}
export default towerdrum;