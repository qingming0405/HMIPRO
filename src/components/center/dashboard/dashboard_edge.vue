<template>
  <div>
    <div class="content-edge center">
      <div
        class="dashboard-edge"
        v-for="item in dashBoardData"
        v-show="item.isShow"
      >
        <div
          class="dashboard-center"
          v-resize='resize'
        >
          <div
            class="retrieval-bg-color-edge"
            :class="`${item.key}-dashboard`"
          ></div>
          <div class="dashboard-wave">
            <div
              :class="`${item.key}-up-chart`"
              class="retrieval-bg-color-edge radius"
            ></div>
            <div
              :class="`${item.key}-down-chart`"
              class="retrieval-bg-color-edge radius"
            ></div>
          </div>
        </div>
        <div
          class="none-data-box select-none radius"
          v-show="item.empty.isShow"
        >
          <div>{{ item.empty.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTime, cloneObj } from 'utils/utils.js'
import echarts from 'echarts'
export default {
  name: 'dashboard',

  watch: {
    '$store.state.dashboardMsg': {
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
  data() {
    return {
      currentKey: null, //macID_posId_posType
      dashBoardData: {},
      updateTime: null,
    }
  },
  methods: {
    openChartList(key, state, delKey) {
      if (typeof key !== 'string') return
      if (state === 0 || state == 1) {
        //新建图谱
        this.currentKey = key
        for (let k in this.dashBoardData) {
          this.dashBoardData[k].isShow = false
        }
      }
      switch (state) {
        case 0 /* 打开图表 */:
          let pos = this.$store.state.checkMsg.pos
          let paramkey = `${pos.machine_id}_${pos.position_id}_${pos.position_type}` //当前测点的key
          this.$set(this.dashBoardData, key, {
            key: paramkey, //数据请求时候的key
            dashBoardChart: null, //仪表盘图谱实例
            speedChart: null, //转速趋势图谱图实例
            overturnChart: null, //倾覆图谱实例
            timer: [], //定时器,
            self: pos.self1, //自振频率
            rms: [], //有效值的数据存储
            speed: [], //转速值的数据存储
            isShow: true,
            empty: {
              isShow: true,
              text: this.$t('Common.noRealData')//'无实时数据',
            },
            pos: cloneObj(pos, true),
          })
          let dashBoard = this.dashBoardData[key]
          /* 初始化图表 */
          this.$nextTick(() => {
            this.initEchart(dashBoard)
          })
          // 获取当前测点的信息
          this.getSearchData(dashBoard)
          break
        case 1 /* 切换图表 */:
          this.dashBoardData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          // 清除定时器
          this.closeCharts(this.dashBoardData[key], key)
          break
      }
    },
    // 关闭图谱
    closeCharts(dashBoard, key) {
      /* 1、清除定时器 */
      clearInterval(dashBoard.timer)
      this.$delete(this.dashBoardData, key)
    },
    initEchart(dashBoard) {
      /* 创建仪表盘实例 */
      let dom1 = document.getElementsByClassName(
        `${dashBoard.key}-dashboard`
      )[0]
      dashBoard.dashBoardChart = echarts.init(dom1)
      let dom2 = document.getElementsByClassName(`${dashBoard.key}-up-chart`)[0]
      dashBoard.speedChart = echarts.init(dom2)
      let dom3 = document.getElementsByClassName(
        `${dashBoard.key}-down-chart`
      )[0]
      dashBoard.overturnChart = echarts.init(dom3)
    },
    getSearchData(dashBoard) {
      /* 发送网络请求 */
      let requestData = {
        startTime: new Date().valueOf() - 1000 * 60 * 60 * 24, //默认获取一天前的历史数据
        endTime: new Date().valueOf(),
        value1: 'speed', //测点转速值
        code1: 1000,
        value2: 'overturn_rms', //倾覆有效值
        code2: 20000,
        isSave: 1,
        isReal: 0,
        density: 2,
        key: {},
        time: 0,
      }
      requestData.key[`${dashBoard.pos.t_root}_${dashBoard.key}`] = 0
      /* 获取历史数据 */
      this.getData(dashBoard, requestData)
    },
    getData(dashBoard, requestData) {
      this.$emit('loadingImg', true)
      this.$getApi.getSpeedDangerRange(requestData).then((res) => {
        this.$emit('loadingImg', false)
        if (res) {
          // 获取倾覆有效值
          if (
            res.rms.tendencyList.length === 0 &&
            res.speed.tendencyList.length === 0
          ) {
            dashBoard.empty.isShow = true
          } else {
            dashBoard.empty.isShow = false
            dashBoard.rms = res.rms.tendencyList
            this.setOverturnOption(dashBoard)
            //获取转速有效值数据
            dashBoard.speed = res.speed.tendencyList
            this.setSpeedOption(dashBoard)
            /* 设置仪表盘 */
            this.setDashboardOption(dashBoard)
          }
          this.firstGetRealData(dashBoard)
          /* 请求实时数据 */
          this.getRealData(dashBoard)
        }
      })
    },
    /* 第一次获取仪表盘转速,time =0 */
    firstGetRealData(dashBoard) {
      const params = this.dashBoardData[this.currentKey]
      let time1 = params.rms[params.rms.length - 1].saveTime
      let time2 = params.speed[params.rms.length - 1].saveTime
      let requestData = {
        value1: 'speed', //测点转速值
        code1: 1000,
        value2: 'overturn_rms', //倾覆有效值
        code2: 20000,
        isSave: 0,
        isReal: 1,
        density: 2,
        key: {},
        time: 0, //this.updateTime
        startTime: new Date().valueOf() - 1000 * 60 * 60 * 24, //默认获取一天前的历史数据
        endTime: new Date().valueOf(),
      }
      requestData.key[`${dashBoard.pos.t_root}_${dashBoard.key}`] = time1 >= time2 ? time1: time2
      this.$getApi.getSpeedDangerRange(requestData).then((res) => {
        if (res) {
          if (res.realInfo) {
            this.setDashboardOption(
              dashBoard,
              res.realInfo.speed,
              getTime(res.realInfo.saveTime)
            )
          }
        }
      })
    },
    /* 获取实时数据 转速*/
    getRealData(dashBoard) {
      /* 先清除原始数据 */
      clearInterval(dashBoard.timer)
      // this.updateTime = new Date().valueOf()
      const params = this.dashBoardData[this.currentKey]
      let time1 = params.rms[params.rms.length - 1].saveTime
      let time2 = params.speed[params.rms.length - 1].saveTime
      this.updateTime = time1 >= time2 ? time1: time2
      dashBoard.timer = setInterval(() => {
        let requestData = {
          value1: 'speed', //测点转速值
          code1: 1000,
          value2: 'overturn_rms', //倾覆有效值
          code2: 20000,
          isSave: 0,
          isReal: 1,
          density: 2,
          key: {},
          time: this.updateTime,
        }
        requestData.key[`${dashBoard.pos.t_root}_${dashBoard.key}`] = this.updateTime
        /* 发送网络请求 */
        this.$getApi.getSpeedDangerRange(requestData).then((res) => {
          if (res) {
            if (res.realInfo) {
              //有数据
              // 判断时间是否重复
              if (this.updateTime == res.updateTime) return
              dashBoard.empty.isShow = false
              // 更新时间
              this.updateTime = res.updateTime
              dashBoard.speed.push({
                tempValue: res.realInfo.speed,
                saveTime: res.realInfo.saveTime,
              })
              //跟新倾覆趋势图
              this.setOverturnOption(dashBoard)
              dashBoard.rms.push({
                tempValue: res.realInfo.overturn_rms,
                saveTime: res.realInfo.saveTime,
              })
              // 更新转速趋势图
              this.setSpeedOption(dashBoard)
              //更新仪表盘
              this.setDashboardOption(
                dashBoard,
                res.realInfo.speed,
                getTime(res.realInfo.saveTime)
              )
            }
          }
        })
      }, 10000)
    },
    // 设置转速趋势图的数据
    setSpeedOption(dashBoard) {
      let xArray = []
      let yArray = []
      let currentTime = null //最后一次的时间

      dashBoard.speed.forEach((item, index) => {
        index == 0 && (currentTime = getTime(item.saveTime))
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
              color: 'rgba(167, 235, 242, 0.3)',
            },
          },
          /* 刻度值 */
          axisLabel: {
            color: 'rgba(190, 231, 235, 0.6)',
          },
        },
        yAxis: {
          name: this.$t('eigenvalue.speed')+'(rpm)',//转速
          type: 'value',
          /* 坐标线 */
          axisLine: {
            lineStyle: {
              color: 'rgba(167, 235, 242, 0.3)',
            },
          },
          /* 刻度值 */
          axisLabel: {
            color: 'rgba(190, 231, 235, 0.6)',
          },
          /* 网格线 */
          splitLine: {
            lineStyle: {
              color: 'rgba(190, 231, 235, 0.3)',
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
            return `${this.$t('Common.time')}：${params[0].name}</br>${this.$t('eigenvalue.speed')}：${params[0].value}`//时间 转速
          },
        },
        /* 标题 */
        title: {
          show: true,
          top: 10,
          left: 10,
          text: currentTime,
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
      dashBoard.speedChart.setOption(option)
    },
    // 设置倾覆的趋势图数据
    setOverturnOption(dashBoard) {
      let xArray = []
      let yArray = []
      let currentTime = null //最后一次的时间
      dashBoard.rms.forEach((item, index) => {
        index == 0 && (currentTime = getTime(item.saveTime))
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
              color: 'rgba(167, 235, 242, 0.3)',
            },
          },
          /* 刻度值 */
          axisLabel: {
            color: 'rgba(190, 231, 235, 0.6)',
          },
        },
        yAxis: {
          name: this.$t('eigenvalue.Overturn')+'(g)',//倾覆值
          type: 'value',
          /* 坐标线 */
          axisLine: {
            lineStyle: {
              color: 'rgba(167, 235, 242, 0.3)',
            },
          },
          /* 刻度值 */
          axisLabel: {
            color: 'rgba(190, 231, 235, 0.6)',
          },
          /* 网格线 */
          splitLine: {
            lineStyle: {
              color: 'rgba(190, 231, 235, 0.3)',
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
            return `${this.$t('Common.time')}：${params[0].name}</br>${this.$t('eigenvalue.Overturn')}：${params[0].value}`//时间 倾覆值
          },
        },
        /* 标题 */
        title: {
          show: true,
          top: 10,
          left: 10,
          text: currentTime,
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
            smooth: true,
            // symbolSize: 8, //折线点的大小
            lineStyle: {
              color: 'rgba(227, 82, 10, 1)', // 折线颜色
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
      dashBoard.overturnChart.setOption(option)
    },
    /* 设置仪表盘的数据 */
    setDashboardOption(dashBoard, speed = 0, time = '') {
      let max = 40 //表盘最大值
      let num1 = ((dashBoard.self * 60) / 3 - 1).toFixed(2) / max
      let num2 = ((dashBoard.self * 60) / 3 + 1).toFixed(2) / max
      let num3 = (dashBoard.self * 60 - 1).toFixed(2) / max
      let num4 = (dashBoard.self * 60 + 1).toFixed(2) / max
      let axisLineColor = [
        [num1, 'lime'],
        [num2, '#FF1900'],
        [num3, 'lime'],
        [num4, '#FF1900'],
        [1, '#DCE200'],
      ]
      let option = {
        tooltip: {
          formatter: '{a} <br/>{c} {b}',
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     restore: { show: true },
        //     saveAsImage: { show: true },
        //   },
        // },
        title: {
          show: true,
          top: 10,
          left: 10,
          text: `${this.$t('dashboard.curTime')}： ${time}`,//当前时间
          textStyle: {
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'normal',
            fontSize: 16,
            color: '#fff',
            shadowColor: '#fff', //默认透明
            shadowBlur: 10,
          },
        },

        series: [
          {
            name: this.$t('eigenvalue.speed'),//转速
            type: 'gauge',
            min: 0,
            max: max,
            splitNumber: 8,
            radius: '70%', //仪表盘的大小
            // startAngle: 180, //开始弧度
            // endAngle: 0,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: axisLineColor,
                width: 5,
                shadowColor: '#fff', //默认透明
                shadowBlur: 10,
              },
            },
            axisLabel: {
              // 坐标轴小标记
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10,
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10,
              },
            },
            splitLine: {
              // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10,
              },
            },
            pointer: {
              // 分隔线
              shadowColor: '#fff', //默认透明
              shadowBlur: 5,
            },
            title: {
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10,
              },
              offsetCenter: ['0', '68%'], //标题的偏移
            },
            detail: {
              backgroundColor: 'rgba(30,144,255,0.8)',
              borderWidth: 1,
              borderColor: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 5,
              offsetCenter: [0, '50%'], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#fff',
              },
            },
            data: [{ value: speed >= 100000000 ? 0 : speed, name: 'rpm' }],
          },
        ],
      }
      dashBoard.dashBoardChart.setOption(option)
      // (Math.random()*100).toFixed(2) - 0
    },
    resize() {
      if (this.dashBoardData[this.currentKey]) {
        let dashBoard = this.dashBoardData[this.currentKey]
        if (dashBoard.speedChart) {
          dashBoard.speedChart.resize()
        }
        if (dashBoard.overturnChart) {
          dashBoard.overturnChart.resize()
        }
        if (dashBoard.dashBoardChart) {
          dashBoard.dashBoardChart.resize()
        }
      }
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'dashboard',
    })
  },
}
</script>

<style scoped lang="scss">
.dashboard-edge {
  width: 100%;
  height: 100%;
  position: relative;
  .none-data-box {
    height: 100%;
  }
}
.dashboard-center {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 5px));
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  .dashboard-wave {
    display: grid;
    grid-template-rows: repeat(2, calc(50% - 5px)) !important;
    grid-template-columns: 100%;
    grid-row-gap: 10px;
  }
}
</style>
