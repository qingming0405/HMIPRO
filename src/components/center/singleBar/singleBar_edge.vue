<template>
  <div class="box-shadow">
    <div
      class="singleBar-content"
      v-for="(item,idx) in singleBarData"
      v-show="item.isShow"
    >
      <div
        class="singleValueStickFigure"
        v-resize='resize'
      >
        <div
          id="singleValueStickFigureCharts"
          :ref="'singleBar'+idx"
        ></div>
        <div
          class="none-data-box select-none radius"
          v-show="item.empty.isShow"
        >
          <span>{{ item.empty.text }}</span>
        </div>
      </div>
      <div class='search-data'>
        <button @click="dataRetrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
        <button
          :class="item.isReal ? '' : 'disable-btn'"
          @click="setrealData"
        ><!-- 实时数据 -->{{$t('Common.realData')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import {
  cloneObj,
  getCodeObj,
  round,
  getUnit,
  getdefaultCode,
} from 'utils/utils.js'
export default {
  name: 'singleBar',
  data() {
    return {
      // 图表字体大小 默认14
      chartsFontSize: 14,
      // 图表左右间距
      chartLeftAndRightSpacing: [30, 80],
      singleBarData: {},
      currentKey: '',
      currentIndex: 0,
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'singleBar',
    })
  },
  watch: {
    '$store.state.singleBarMsg': {
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
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId] = key.split('_')
      const keyArr = Object.keys(this.singleBarData)
      if (type === 0 || type === 1) {
        this.currentKey = key
        this.currentIndex = keyArr.indexOf(key)
        for (let i in this.singleBarData) {
          this.singleBarData[i].isShow = false
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          let mac = cloneObj(this.$store.state.checkMsg.mac, true)
          let posList = cloneObj(this.$store.state.pos[mac.mac_id], true)
          let posArray = []
          for (let i = 0; i < posList.length; i++) {
            if (posList[i].position_type == 3) {
              posList[i].isShow = true
              posArray.push(posList[i])
            }
          }
          let codeObj = getCodeObj(posArray[0].dgm_type) //8000特征值
          let eigenvalueData = codeObj[3] //振动特征值
          eigenvalueData.shift()
          eigenvalueData.forEach((element) => {
            element.val = element.name
          })
          const eigenvalue = getdefaultCode(posArray[0].dgm_type)[3]
          const unit = getUnit(getUnit.code, posArray[0])
          this.$set(this.singleBarData, key, {
            chartData: {
              data: [],
              dataX: [],
              dataY: [],
              myChart: null,
            },
            mac: mac,
            requestData: {
              machineId: macId,
              positionType: 3, //振动
              time: 0,
              t_root: mac.t_root,
            },
            eigenvalue,
            posArray, //ptype为3的测点列表
            eigenvalueData,
            time: null, //定时器
            isReal: true, //实时数据是否开启
            empty: {
              /* 无数据 */
              isShow: true,
              text: this.$t('Common.noDataText'),//无数据
            },
            max: 0, //图标y轴最大值
            isShow: true,
            unit, //y轴单位
          })
          let fn = () => {
            this.getData()
            return fn
          }
          this.singleBarData[key].time = setInterval(fn(), 2000)
          break
        case 1 /* 切换图表 */:
          this.singleBarData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          clearInterval(this.singleBarData[key].time)
          this.$delete(this.singleBarData, key)
          break
      }
    },
    getData() {
      let params = this.singleBarData[this.currentKey]
      let requestData = params.requestData
      this.$getApi.getRealMap(requestData).then((res) => {
        if (res) {
          if (res.list !== undefined && res.list !== null) {
            params.chartData.data = res.list
            if (res.list.length > 0) {
              params.empty.isShow = false
            }
          } else {
            params.chartData.data = []
          }
          this.setData()
        }
      })
    },
    setData() {
      const params = this.singleBarData[this.currentKey]
      const eigenvalue = params.eigenvalue
      const posArray = params.posArray
      const chartData = params.chartData
      chartData.dataX = []
      const list = chartData.data
      chartData.dataY = []
      chartData.warn = []
      chartData.alarm = []
      if (list.length > 0) {
        list.forEach((item) => {
          for (let i = 0; i < posArray.length; i++) {
            let value = posArray[i]
            // 都为振动测点，判断id就可以判断唯一值
            if (value.isShow && value.position_id == item.pos_id) {
              chartData.dataX.push(item.pos_name)
              let v = item[eigenvalue.filed]
              if (v && v < 100000000) {
                v = round(v, 4)
              } else {
                v = 0
              }
              chartData.dataY.push(v)
              if (item.baseInfo.H_limit) {
                chartData.warn.push(item.baseInfo.H_limit)
              } else {
                chartData.warn.push(0)
              }
              if (item.baseInfo.Hh_limit) {
                if (params.max < item.baseInfo.Hh_limit) {
                  params.max = Math.ceil(item.baseInfo.Hh_limit * 1000) / 1000
                }
                chartData.alarm.push(item.baseInfo.Hh_limit)
              } else {
                chartData.alarm.push(0)
              }
            }
          }
        })
      }
      this.$nextTick(() => {
        this.drawLineCharts()
      })
    },
    drawLineCharts() {
      const params = this.singleBarData[this.currentKey]
      let data = this.singleBarData[this.currentKey].chartData
      if (data.myChart == null) {
        data.myChart = echarts.init(
          this.$refs[`singleBar${this.currentKey}`][0]
        )
      }

      const option = {
        xAxis: {
          name: this.$t('Common.pos'),//测点
          nameLocation: 'end',
          nameGap: -30,
          // nameRotate: 30,
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            padding: [60, 0, 0, 0],
            color: '#F3F3F3',
          },
          data: data.dataX,
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
          },
        },
        yAxis: {
          name: params.unit,
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
            color: '#F3F3F3',
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
          },
          splitLine: {
            show: true,
            lineStyle: {
              opacity: 0.2,
            },
          },
          // min: 0,
          max: function (value) {
            let max = params.max
            if (max < Math.ceil(value.max * 1000) / 1000) {
              max = Math.ceil(value.max * 1000) / 1000
            }
            return max
          },
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: 50,
          left: this.chartLeftAndRightSpacing[0],
          right: this.chartLeftAndRightSpacing[1],
          containLabel: true,
          bottom: 55,
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty',
            height: 15,
            textStyle: {
              color: '#fff',
            },
            borderColor: '#90979c',
            bottom: 15,
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            width: 15,
            filterMode: 'none',
            textStyle: {
              color: '#fff',
            },
            borderColor: '#90979c',
            right: 15,
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty',
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none',
          },
        ],
        series: [
          {
            type: 'bar',
            barWidth: '25%',
            itemStyle: {
              normal: {
                color: (param) => {
                  const theValue = param.value
                  let warn = data.warn[param.dataIndex]
                  let alarm = data.alarm[param.dataIndex]
                  if (theValue < warn) {
                    return '#73d13d'
                  } else if (theValue >= warn && theValue < alarm) {
                    return '#ffec3d'
                  } else if (theValue >= alarm) {
                    return '#ff4d4f'
                  }
                },
              },
            },
            label: {
              normal: {
                show: true,
                fontWeight: 'bold',
                color: '#ffffff',
                position: 'top',
              },
            },
            data: data.dataY,
            // 报警预警标线
            markLine: {
              silent: true,
              label: {
                formatter: (param) => {
                  return param.name
                },
              },
              lineStyle: {
                type: 'dotted',
              },
              data: this.getMakeLineData(),
            },
          },
        ],
      }
      data.myChart.setOption(option)
      window.addEventListener('resize', () => {
        data.myChart.resize()
      })
    },
    // 刷新图谱
    resize() {
      if (
        this.singleBarData[this.currentKey] &&
        this.singleBarData[this.currentKey].chartData &&
        this.singleBarData[this.currentKey].chartData.myChart
      ) {
        this.singleBarData[this.currentKey].chartData.myChart.resize()
      }
    },
    getMakeLineData() {
      let data = this.singleBarData[this.currentKey].chartData
      let makelineData = []
      for (let i = 0; i < data.alarm.length - 1; i++) {
        makelineData.push(
          [
            {
              itemStyle: {
                normal: {
                  show: true,
                  color: '#ffa101',
                },
              },
              lineStyle: {
                normal: {
                  type: 'solid',
                  color: '#ffa101',
                },
              },
              coord: [i, data.warn[i]],
            },
            {
              coord: [i + 1, data.warn[i + 1]],
            },
          ],
          [
            {
              itemStyle: {
                normal: {
                  show: true,
                  color: '#f80000',
                },
              },
              lineStyle: {
                normal: {
                  type: 'solid',
                  color: '#f80000',
                },
              },
              coord: [i, data.alarm[i]],
            },
            {
              coord: [i + 1, data.alarm[i + 1]],
            },
          ]
        )
      }
      return makelineData
    },
    dataRetrieval() {
      let data = this.singleBarData[this.currentKey]
      let eigenvalueData = this.singleBarData[this.currentKey].eigenvalueData
      let posArray = this.singleBarData[this.currentKey].posArray
      this.$retrieval({
        key: 'singleBar',
        viewMsg: {
          mac: data.mac,
          isEigenvalue: true,
          posArray,
          eigenvalueData,
          eigenvalue: data.eigenvalue,
        },
      }).then((res) => {
        if (res) {
          data.eigenvalue = res.eigenvalue
          data.posArray = res.posArray
          this.singleBarData[this.currentKey].unit = getUnit(
            res.eigenvalue.code,
            res.posArray[0]
          )
          this.setData()
        }
      })
    },
    setrealData() {
      const params = this.singleBarData[this.currentKey]
      params.isReal = !params.isReal
      if (params.isReal) {
        let fn = () => {
          this.getData()
          return fn
        }
        params.time = setInterval(fn(), 2000)
      } else {
        clearInterval(params.time)
      }
    },
  },
}
</script>
 
<style lang="scss" scoped>
.singleBar-content {
  height: 100%;
  position: relative;
}

@import '@/assets/style/css/inputStyle.scss';
@import '@/assets/style/css/chartsStyle.scss';

// 竖屏
@media only screen and (orientation: portrait) and (max-width: 767px) {
  .singleValueStickFigure {
    height: 50% !important;
  }
}

/* 全景（横屏）模式 */
@media screen and (orientation: landscape) and (max-height: 767px) {
}
</style>