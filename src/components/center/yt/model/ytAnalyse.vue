<template>
  <!-- 油井模型 -->
  <div>
    <div
      class="oil-model"
      v-for="(param,key) in ytAnalyse"
      v-show="param.isShow"
    >
      <div class="oil-model-box1 ">
        <div class="first-div Model-box">
          <!-- 工艺量测点 -->
          <div class="Model-header">{{$t('YtAnalyse.tableTitle1')}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr v-for="(item, index) in param.ytData">
                <td
                  class="model-td"
                  :title="item.pos_name"
                >
                  <div
                    v-show="item.alarm_status == 0"
                    class="pos-state state-offline"
                  ></div>
                  <div
                    v-show="item.alarm_status == 1"
                    class="pos-state"
                  ></div>
                  <div
                    v-show="item.alarm_status == 2"
                    class="pos-state state-warn"
                  ></div>
                  <div
                    v-show="item.alarm_status == 3"
                    class="pos-state state-alarm"
                  ></div>
                  <div>{{ item.pos_name }}</div>
                </td>
                <td>
                  {{ item.value }}
                </td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('YtAnalyse.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="second-div Model-box">
          <!-- 沉没度趋势 -->
          <div class="Model-header">{{$t('YtAnalyse.tableTitle2')}}</div>
          <div
            class="second-div-content"
            :class='"second-div-content"+key'
            v-resize='resize'
          ></div>
        </div>
      </div>

      <div class="oil-model-box2 Model-box">
        <!-- 油田模型 -->
        <div class="Model-header">{{$t('YtAnalyse.tableTitle3')}}</div>
        <div
          class="model-center"
          :class="'model-center'+key"
        >
          <canvas :id='"canvasBg"+key'> </canvas>
          <canvas :id='"canvasVal"+key'> </canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTime, round, matchRule, cloneObj } from 'utils/utils.js'
import echarts from 'echarts'
export default {
  name: 'ytAnalyse',
  data() {
    return {
      ytAnalyse: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'ytAnalyse',
    })
  },
  deactivated() {
    clearInterval(this.ytAnalyse[this.currentKey].timer)
  },

  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.ytAnalyse) {
        this.ytAnalyse[i].isShow = false
        clearInterval(this.ytAnalyse[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.ytAnalyse)
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
        mac = this.ytAnalyse[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.ytAnalyse, key, {
            mac,
            chartOptionColor: {
              /* 图谱option颜色 */
              axis: {
                /* 坐标轴 */
                name: '#fff' /* 标题 */,
                font: '#fff' /* 字体 */,
                line: '#fff' /* 轴线 */,
                splitLine: '#fff' /* 坐标轴分割线 */,
              },
              tool: {
                symbol: '#ff9b21' /* 圆点 */,
                line: '#ff9b21' /* 标线 */,
                font: '#fff' /* 字体 */,
                background: 'rgba(108, 145, 221, 0.8)' /* 背景蓝色 */,
              },
              series: {
                /* 图谱 */
                symbol: '#fff' /* symbol */,
              },
            },
            ytData: [],
            canvasParameters: {
              imgScale: 0.8,
              ScaleTable_start_X: null, //刻度线开始的X坐标
              ScaleTable_start_Y: null, //刻度线开始的Y坐标
              ScaleTable_len: null, //刻度线开始的长度坐标
              startPicX: null, // 图片开始的坐标
              startPicY: null, // 图片开始的坐标
              picWidth: null, //图片的宽
              picHeight: null, //图片的长
            },
            depthPic: {
              D_X: 20, //X轴的差值
              D_Y: 80, //Y轴的差值
              Width: 36,
              Height: 374,
              bottom_hight: 144, //图片底部预留的高
              font_size: '15px normal',
            },
            echart: {
              ins: '',
            },
            chartData: {
              tendencyList: [],
            }, //趋势图数据
            gap: 60,
            timer: null, // 定时器
            isShow: true,
          })
          this.$nextTick(() => {
            /* 适配1366分辨率 */
            let width_screen = window.screen.width
            if (width_screen <= 1366) {
              this.ytAnalyse[key].depthPic = {
                D_X: 12, //X轴的差值
                D_Y: 51, //Y轴的差值
                Width: 21,
                Height: 216,
                bottom_hight: 82,
                font_size: '8px normal',
              }
              this.ytAnalyse[key].gap = 50
            }
            /* 创造趋势图对象 */
            this.initEchart()
            /* 画静态模型图 */
            this.drawPictureInt()
          })
          break
        case 1 /* 切换图表 */:
          this.ytAnalyse[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.ytAnalyse, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.ytAnalyse[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        /* 获取趋势图数据 */
        this.getTrendData(mac.mac_id)
        clearInterval(this.ytAnalyse[key].timer)
        let fn = () => {
          this.getSubmergenceInfo(mac.mac_id)
          return fn
        }
        /* 循环获取沉没度数据 */
        this.ytAnalyse[key].timer = setInterval(fn(), 6000)
      }
    },
    resize() {
      const param = this.ytAnalyse[this.currentKey]
      if (param.echart && param.echart.ins) {
        param.echart.ins.resize()
      }
    },
    /* 画背景图片 */
    drawPictureInt() {
      const param = this.ytAnalyse[this.currentKey]
      let canvas = document.getElementById(`canvasBg${this.currentKey}`)
      let cxt = canvas.getContext('2d')
      let sn = document.getElementsByClassName(
        `model-center${this.currentKey}`
      )[0]
      const BW = (canvas.width = sn.offsetWidth)
      const BH = (canvas.height = sn.offsetHeight)
      cxt.clearRect(0, 0, canvas.width, canvas.height)
      let img = new Image()
      img.src = require('assets/images/yt/youtianModel.png')
      img.onload = () => {
        let newPW, newPH, startPicX, startPicY // 设置 背景长宽 起始点
        const PW = img.width
        const PH = img.height
        newPH = BH * param.canvasParameters.imgScale
        newPW = (PW / PH) * newPH
        startPicX = BW * 0.1
        startPicY = BH * 0.1
        cxt.drawImage(img, startPicX, startPicY, newPW, newPH)
        param.canvasParameters.startPicX = startPicX
        param.canvasParameters.startPicY = startPicY
        param.canvasParameters.picWidth = newPW
        param.canvasParameters.picHeight = newPH
        /* 画刻度表 */
        let ScaleTable_start_X = startPicX + newPW + 120
        let ScaleTable_start_Y = startPicY + newPH * 0.15
        let ScaleTable_len = newPH * 0.6
        let ScaleTable_stop_Y = ScaleTable_start_Y + ScaleTable_len
        cxt.beginPath()
        cxt.lineWidth = 1
        cxt.strokeStyle = '#00FFFF'
        cxt.moveTo(ScaleTable_start_X, ScaleTable_start_Y)
        cxt.lineTo(ScaleTable_start_X, ScaleTable_stop_Y)
        cxt.stroke()
        for (let i = 0; i <= 50; i++) {
          cxt.beginPath()
          cxt.moveTo(
            ScaleTable_start_X,
            ScaleTable_start_Y + (ScaleTable_len / 50) * i
          )

          if (i % 5 === 0) {
            /* 画粗刻度线 和文字 */
            cxt.lineWidth = 3
            cxt.lineTo(
              ScaleTable_start_X + 10,
              ScaleTable_start_Y + (ScaleTable_len / 50) * i
            )
            cxt.font = `10px normal` //设置字体
            /* 标题颜色 */
            cxt.fillStyle = '#fff'
            cxt.textAlign = 'left'
            // 设置垂直对齐方式
            cxt.textBaseline = 'middle'
            // 写文字
            cxt.fillText(
              100 - i * 2 + '%',
              ScaleTable_start_X + 20,
              ScaleTable_start_Y + (ScaleTable_len / 50) * i
            )
          } else {
            cxt.lineWidth = 1
            cxt.lineTo(
              ScaleTable_start_X + 3,
              ScaleTable_start_Y + (ScaleTable_len / 50) * i
            )
          }
          cxt.stroke()
          param.canvasParameters.ScaleTable_start_X = ScaleTable_start_X
          param.canvasParameters.ScaleTable_start_Y = ScaleTable_start_Y
          param.canvasParameters.ScaleTable_len = ScaleTable_len
        }
      }
    },
    /* 随时刷新实时数据 */
    drawPicture(Depth, Warning, Alarm, currentData) {
      const param = this.ytAnalyse[this.currentKey]
      let canvas = document.getElementById(`canvasVal${this.currentKey}`)
      let cxt = canvas.getContext('2d')
      let sn = document.getElementsByClassName(
        `model-center${this.currentKey}`
      )[0]
      const BW = (canvas.width = sn.offsetWidth)
      const BH = (canvas.height = sn.offsetHeight)
      cxt.clearRect(0, 0, canvas.width, canvas.height)
      /* 计算当前值的比例 */
      if (Depth !== null) {
        cxt.font = param.depthPic.font_size //设置字体
        /* 标题颜色 */
        cxt.fillStyle = '#00FFFF'
        let ScaleTable_start_X = param.canvasParameters.ScaleTable_start_X
        let ScaleTable_start_Y = param.canvasParameters.ScaleTable_start_Y
        let ScaleTable_len = param.canvasParameters.ScaleTable_len
        if (Depth !== undefined) {
          cxt.fillText(
            //传感器垂深
            `${this.$t('YtAnalyse.sersorDepth')}:  ` + Depth + 'm',
            ScaleTable_start_X + param.gap,
            ScaleTable_start_Y
          )
          /* 画报警值和当前测点 */
          let currentDataScale
          let warningScale
          let alarmScale
          if (currentData !== undefined) {
            currentDataScale = currentData / Depth
            cxt.beginPath()
            cxt.lineWidth = 2
            cxt.strokeStyle = '#00FFFF'
            cxt.moveTo(
              ScaleTable_start_X,
              ScaleTable_start_Y + ScaleTable_len * (1 - currentDataScale)
            )
            cxt.lineTo(
              ScaleTable_start_X + 10,
              ScaleTable_start_Y + ScaleTable_len * (1 - currentDataScale)
            )
            cxt.font = param.depthPic.font_size //设置字体
            /* 标题颜色 */
            cxt.fillStyle = '#00FFFF'
            cxt.fillText(
              //当前值
              `${this.$t('YtAnalyse.curValue')}:  ` +
                round(currentData, 2) +
                'm',
              ScaleTable_start_X - param.gap - 70,
              ScaleTable_start_Y + ScaleTable_len * (1 - currentDataScale)
            )
            cxt.stroke()
          }
          if (Warning !== undefined) {
            warningScale = Warning / Depth
            cxt.beginPath()
            cxt.lineWidth = 2
            cxt.strokeStyle = 'rgba(255,161,1)'
            cxt.moveTo(
              ScaleTable_start_X,
              ScaleTable_start_Y + ScaleTable_len * (1 - warningScale)
            )
            cxt.lineTo(
              ScaleTable_start_X + 10,
              ScaleTable_start_Y + ScaleTable_len * (1 - warningScale)
            )
            cxt.font = param.depthPic.font_size //设置字体
            /* 标题颜色 */
            cxt.fillStyle = 'rgba(255,161,1)'
            cxt.fillText(
              //预警值
              `${this.$t('YtAnalyse.warnValue')}:  ` + round(Warning, 2) + 'm',
              ScaleTable_start_X + param.gap,
              ScaleTable_start_Y + ScaleTable_len * (1 - warningScale)
            )
            cxt.stroke()
          }
          /* 画报警值 */
          if (Alarm !== undefined) {
            alarmScale = Alarm / Depth
            cxt.beginPath()
            cxt.lineWidth = 2
            cxt.strokeStyle = 'rgba(232, 34, 34)'
            cxt.moveTo(
              ScaleTable_start_X,
              ScaleTable_start_Y + ScaleTable_len * (1 - alarmScale)
            )
            cxt.lineTo(
              ScaleTable_start_X + 10,
              ScaleTable_start_Y + ScaleTable_len * (1 - alarmScale)
            )
            cxt.font = param.depthPic.font_size //设置字体
            /* 标题颜色 */
            cxt.fillStyle = 'rgba(232, 34, 34)'
            let Y = ScaleTable_start_Y + ScaleTable_len * (1 - alarmScale)
            /* 防止报警和预警文字重叠 */
            if (
              ScaleTable_start_Y + ScaleTable_len * (1 - warningScale) + 16 >
              Y
            ) {
              Y = ScaleTable_start_Y + ScaleTable_len * (1 - warningScale) + 16
            }
            cxt.fillText(
              //报警值
              `${this.$t('YtAnalyse.alarmValue')}:  ` + round(Alarm, 2) + 'm',
              ScaleTable_start_X + param.gap,
              Y
            )
            cxt.stroke()
          }
        }
        /* 图上画实际值的红黄绿色块 */
        let scale = currentData / Depth
        let canvasParameters = param.canvasParameters
        let startPicX = canvasParameters.startPicX + param.depthPic.D_X
        let startPicY =
          canvasParameters.startPicY +
          param.depthPic.D_Y +
          (1 - scale) * param.depthPic.Height
        cxt.beginPath()
        cxt.rect(
          startPicX,
          startPicY + 20,
          param.depthPic.Width,
          param.depthPic.Height * scale + param.depthPic.bottom_hight
        )
        cxt.closePath()
        /* 判断当前值和预警报警值的比较 ，修改颜色 */
        if (currentData > Warning) {
          cxt.fillStyle = 'rgba(0,255,127,0.5)'
        } else if (currentData > Alarm) {
          cxt.fillStyle = 'rgba(255,161,1, 0.5)'
        } else {
          cxt.fillStyle = 'rgba(232, 34, 34, 0.5)'
        }
        cxt.fill()
      }
    },
    initEchart() {
      const param = this.ytAnalyse[this.currentKey]
      let dom1 = document.getElementsByClassName(
        `second-div-content${this.currentKey}`
      )[0]
      param.echart.ins = echarts.init(dom1)
    },
    /* 获取趋势图的数据 */
    getTrendData(macId) {
      const param = this.ytAnalyse[this.currentKey]
      let requestData = {
        startTime: new Date().valueOf() - 7 * 24 * 60 * 60 * 1000,
        endTime: new Date().valueOf(),
        value: 'value',
        code: 27000,
        mac_id: macId,
      }
      this.$getApi.getSubmergenceTendency(requestData).then((res) => {
        if (res) {
          for (let key in res.data) {
            let tendencyList = res.data[key].tendencyList
            if (tendencyList) {
              param.chartData.tendencyList = tendencyList
              this.setEchart()
            }
          }
        }
      })
    },
    /* 设置趋势图的数据 */
    setEchart() {
      const param = this.ytAnalyse[this.currentKey]
      let xArray = []
      let yArray = []

      param.chartData.tendencyList.forEach((item, index) => {
        xArray.push(getTime(item.saveTime))
        yArray.push(item.tempValue)
      })
      let option = {
        xAxis: {
          name: 't(s)',
          type: 'category',
          data: xArray,
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          /* 刻度值 */
          axisLabel: {
            color: '#fff',
          },
        },
        yAxis: {
          name: '沉没度(m)',
          type: 'value',
          /* 坐标线 */
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          /* 刻度值 */
          axisLabel: {
            color: '#fff',
          },
          /* 网格线 */
          splitLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        /* 缩放 */
        toolbox: {
          // feature 各工具配置项: dataZoom 数据区域缩放;restore 配置项还原;saveAsImage下载为图片;magicType动态类型切换
          feature: {
            dataZoom: {
              yAxisIndex: 'none', // y轴不缩放，Index默认为0
            },
          },
        },
        dataZoom: [
          {
            // 内置于坐标系中，使用户可以在坐标系上通过鼠标拖拽、鼠标滚轮、手指滑动（触屏上）来缩放或漫游坐标系
            type: 'inside',
            start: 0,
            end: 100,
          },
        ],
        /* 提示框 */
        tooltip: {
          trigger: 'axis', //坐标轴触发竖向指示线
          formatter: (params) => {
            //时间、沉没度
            return `${this.$t('YtAnalyse.time')}:  ${
              params[0].name
            }</br>${this.$t('YtAnalyse.sinkVal')}：${params[0].value}`
          },
        },
        /* 标题 */
        title: {
          show: true,
          top: 10,
          left: 10,
          // text: currentTime,
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'normal',
            fontSize: 12,
            color: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
        },

        series: [
          {
            data: yArray,
            type: 'line',
            // symbolSize: 8, //折线点的大小
            lineStyle: {
              color: 'rgba(15, 143, 183, 1)', //折线颜色
              width: 3,
              shadowBlur: 1,
              shadowColor: 'rgba(18, 116, 136, 0.34)',
              shadowOffsetX: 1,
              shadowOffsetY: 2,
            },
            itemStyle: {
              borderColor: 'rgba(16, 77, 208, 1)',
            },
          },
        ],
      }
      param.echart.ins.setOption(option)
    },
    /* 获取沉没度 */
    getSubmergenceInfo(macId) {
      let requestData = { mac_id: macId }
      const param = this.ytAnalyse[this.currentKey]
      this.$getApi.getSubmergenceInfo(requestData).then((res) => {
        if (res) {
          param.ytData = []
          /* 处理下value,显示工艺量测点 */
          let value = res.data.value
          if (value >= 100000000) {
            value = this.$t('Common.noDataText') //无数据
          } else if (isNaN(value)) {
            value = this.$t('Common.noDataText') //无数据
          } else {
            value = round(value, 2)
            this.drawPicture(
              res.data.dgmDepth,
              res.data.l_limit,
              res.data.ll_limit,
              value
            )
            //测试数据
            // let random = Math.random(0, 1) * 10;
            // let random2 = Math.random(0, 1) * 10;
            // this.drawPicture(10111, 3333, 1111, 1000);
            if (res.data.units.unitName[0]) {
              /* 存在单位 */
              value = value + res.data.units.unitName[0]
            }
          }
          res.data.value = value
          param.ytData.push(res.data)
          /* 处理右边的图片 */
        }
      })
    },
    /* 跳转到实时数据 */
    toReal(item) {
      const param = this.ytAnalyse[this.currentKey]
      //从vuex取当前机组下的所有测点
      let posArray = this.$store.state.pos[item.mac_id]
      for (let i in posArray) {
        if (
          posArray[i].posFlag ===
          `${item.mac_id}_${item.pos_id}_${item.pos_type}`
        ) {
          this.$store.commit('getCheckMsg', {
            msg: posArray[i],
            type: 'pos',
          })
          if (
            !matchRule(
              posArray[i].position_type,
              'real',
              posArray[i].dgm_type,
              posArray[i].t_root
            )
          ) {
            //未能匹配
            this.$pop('该类型测点没有此图谱')
            return
          }
          let name = 'real' //实时数据列表
          let val = '实时数据列表'
          let icon = 'icon-shishishuju_huaban'
          let key = `${name}_pos_${item.mac_id}_${posArray[i].position_id}_${posArray[i].position_type}`
          this.$bus.$emit('choiceChartType', key, val)
        }
      }
    },
  },
  watch: {
    '$store.state.ytAnalyseMsg': {
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
}
</script>
<style scoped lang="scss">
.oil-model {
  display: flex;
  flex-direction: row;
  height: calc(100% - 20px);
  .oil-model-box1 {
    height: 100%;
    width: calc(71.6% - 14px);
    margin-right: 20px;
    .first-div {
      height: 200px;
    }
    .second-div {
      margin-top: 20px;
      height: calc(100% - 220px);
      .second-div-content {
        height: calc(100% - 36px);
      }
    }
  }
  .oil-model-box2 {
    height: 100%;
    width: calc(28.3% + 6px);
    .Model-content {
      height: calc(100% - 36px);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelimg {
        width: 992px;
        height: 295px;
      }
    }
  }
}
.model-center {
  width: 100%;
  height: calc(100% - 36px);
  position: relative;
  canvas {
    position: absolute;
  }
}
</style>
