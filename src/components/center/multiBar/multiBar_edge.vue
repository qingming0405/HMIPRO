<template>
  <div class="box-shadow">
    <div
      class="multiBar-content"
      v-for="(item,idx) in multiBarData"
      v-show="item.isShow"
    >
      <div
        class="multipleBarChartsContentShell"
        ref="chartContainer"
      >
        <div id="needToBeSaved">
          <div
            class="multipleBarChartsContent"
            v-resize='resize'
          >
            <div
              id="multipleBarCharts"
              :ref="'multiBar'+idx"
            ></div>
            <div
              class="none-data-box select-none radius"
              v-show="item.empty.isShow"
            >
              <span>{{ item.empty.text }}</span>
            </div>
          </div>
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
import { cloneObj, getCodeObj, round } from 'utils/utils.js'
export default {
  name: 'multiBar',
  data() {
    return {
      chartsFontSize: 14, // 图表字体大小 默认14
      chartLeftAndRightSpacing: [30, 80], // 图表左右间距
      resizeBottom: 80, // 图表grid的bottom数值
      gridTop: 60, //图表位置
      multiBarData: {},
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'multiBar',
    })
  },
  watch: {
    '$store.state.multiBarMsg': {
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
      if (type === 0 || type === 1) {
        this.currentKey = key
        for (let i in this.multiBarData) {
          this.multiBarData[i].isShow = false
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
          this.$set(this.multiBarData, key, {
            chartData: {
              data: [],
              dataY: {},
              dataX: [],
              myChart: null,
              xStart: 0,
              xEnd: 0,
              yStart: 0,
              yEnd: 0,
            },
            empty: {
              /* 无数据 */
              isShow: true,
              text: `无数据`,
            },
            mac: mac,
            requestData: {
              machineId: macId,
              positionType: 3, //振动
              time: 0,
              t_root: mac.t_root,
            },
            posArray, //ptype为3的测点列表
            eigenvalueData,
            time: null, //定时器
            isReal: true, //实时数据是否开启
            isShow: true,
          })
          this.$nextTick(() => {
            this.drawLineCharts()
          })
          let fn = () => {
            this.getData()
            return fn
          }
          this.multiBarData[key].time = setInterval(fn(), 2000)
          break
        case 1 /* 切换图表 */:
          this.multiBarData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          clearInterval(this.multiBarData[key].time)
          this.$delete(this.multiBarData, key)
          break
      }
    },
    getData() {
      let params = this.multiBarData[this.currentKey]
      let requestData = params.requestData
      this.$getApi.getRealMap(requestData).then((res) => {
        if (res) {
          params.empty.isShow = true
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
      const eigenvalue = this.multiBarData[this.currentKey].eigenvalueData
      const posArray = this.multiBarData[this.currentKey].posArray
      const chartData = this.multiBarData[this.currentKey].chartData
      chartData.dataX = []
      const list = chartData.data
      chartData.dataY = {}
      if (list.length > 0) {
        list.forEach((item) => {
          for (let i = 0; i < posArray.length; i++) {
            let value = posArray[i]
            // 都为振动测点，判断id就可以判断唯一值
            if (value.isShow && value.position_id == item.pos_id) {
              chartData.dataX.push(item.pos_name)
              for (let k = 0; k < eigenvalue.length; k++) {
                let v = item[eigenvalue[k].filed]
                if (v && v < 100000000) {
                  v = round(v, 4)
                } else {
                  v = 0
                }
                // 若不存在初始化
                if (!chartData.dataY[eigenvalue[k].filed]) {
                  chartData.dataY[eigenvalue[k].filed] = []
                }
                chartData.dataY[eigenvalue[k].filed].push(v)
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
      const chartData = this.multiBarData[this.currentKey].chartData
      chartData.myChart = echarts.init(
        this.$refs[`multiBar${this.currentKey}`][0]
      )
      const option = {
        xAxis: {
          name: '机组',
          nameLocation: 'end',
          nameGap: -30,
          // nameRotate: 30,
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            padding: [55, 0, 0, 0],
          },
          data: chartData.dataX,
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            color: '#fff',
          },
        },
        legend: {
          show: true,
          bottom: 30,
          icon: 'rect',
          itemWidth: 25,
          itemHeight: 15,
          textStyle: {
            color: '#C9C8CD',
          },
        },
        yAxis: {
          name: this.multiBarData[this.currentKey].mac.mac_me,
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            color: '#fff',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#515357',
            },
          },
          // interval: 500,
          // min: 0,
          // max: 200,
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: this.gridTop,
          left: this.chartLeftAndRightSpacing[0],
          right: this.chartLeftAndRightSpacing[1],
          containLabel: true,
          bottom: this.resizeBottom,
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
            filterMode: 'empty', //当前数据窗口外的数据，被 设置为空。即 不会 影响其他轴的数据范围。
            start: chartData.xStart,
            end: chartData.xEnd,
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none', //不过滤数据，只改变数轴范围。
            start: chartData.yStart,
            end: chartData.yEnd,
          },
        ],
        series: this.setSeriesData(),
      }
      chartData.myChart.setOption(option)
      window.addEventListener('resize', () => {
        chartData.myChart.resize()
      })
      chartData.myChart.on('datazoom', function (params) {
        chartData.xStart = params.batch[0].start
        chartData.xEnd = params.batch[0].end
        chartData.yStart = params.batch[1].start
        chartData.yEnd = params.batch[1].end
      })
    },
    resize() {
      if (
        this.multiBarData[this.currentKey] &&
        this.multiBarData[this.currentKey].chartData &&
        this.multiBarData[this.currentKey].chartData.myChart
      ) {
        this.multiBarData[this.currentKey].chartData.myChart.resize()
      }
    },
    setSeriesData() {
      let data = this.multiBarData[this.currentKey]
      let chartData = data.chartData
      let eigenvalue = data.eigenvalueData
      let series = []
      for (let k in chartData.dataY) {
        let item = chartData.dataY[k]
        let name
        eigenvalue.forEach((el) => {
          if (k == el.filed) {
            name = el.val
          }
        })
        series.push({
          name: name,
          type: 'bar',
          data: item,
        })
      }
      return series
    },
    dataRetrieval() {
      let data = this.multiBarData[this.currentKey]
      let posArray = data.posArray
      this.$retrieval({
        key: 'singleBar',
        viewMsg: {
          mac: data.mac,
          isEigenvalue: false,
          posArray,
        },
      }).then((res) => {
        if (res) {
          data.posArray = res.posArray
          this.setData()
        }
      })
    },
    setrealData() {
      const params = this.multiBarData[this.currentKey]
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
@import '@/assets/style/css/inputStyle.scss';
@import '@/assets/style/css/chartsStyle.scss';
.multiBar-content {
  height: 100%;
  position: relative;
}
// 竖屏
@media only screen and (orientation: portrait) and (max-width: 767px) {
  .multipleBarChartsContent {
    padding-bottom: 6px !important;
    height: 50% !important;
  }
}

/* 全景（横屏）模式 */
@media screen and (orientation: landscape) and (max-height: 767px) {
  .multipleBarChartsContent {
    padding-bottom: 6px !important;
    height: 100% !important;
  }
}
</style>