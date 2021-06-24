<template>
  <div>
    <div
      class="spectrumFall-content"
      v-for="(item,idx) in paramsData"
      v-show="item.isShow"
    >
      <div
        class="spectrumFallsContent"
        v-resize='resize'
      >
        <div
          class="box-shadow"
          id="spectrumFalls"
          :ref="'spectrumFalls'+ idx"
        ></div>
        <s-s-index
          class="my-time-table"
          :data-list="item.timeData"
          @ss-select="ssSelect"
        />
      </div>
      <div class='search-data'>
        <button @click="dataRetrieval">
          <!-- 数据检索 -->{{$t('Common.retrieval')}}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-gl'
import { cloneObj, getCodeObj, getTime } from 'utils/utils.js'
import SSIndex from 'common/startStop/SSIndex.vue'
export default {
  name: 'ssSpectrumWaterfall',
  components: { SSIndex },
  data() {
    return {
      paramsData: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'ssSpectrumWaterfall',
    })
  },
  watch: {
    '$store.state.ssSpectrumWaterfallMsg': {
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
      const [, , mId, id, pType] = key.split('_')
      let pos = null
      if (type === 0 || type === 1) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
        this.currentKey = key
        for (let k in this.paramsData) {
          this.paramsData[k].isShow = false
        }
      } else {
        pos = this.paramsData[key].pos
      }
      const params = this.$store.state.srcParams
      const time = params.time
      this.requestData = {
        time: { pos_id: pos.pos_id, startTime: time.start, endTime: time.end },
        data: {
          machineId: mId,
          positionId: id,
          positionType: pType,
          currTime: [0, 0],
          lineNum: 5,
          density: 2,
          t_root: pos.t_root,
          dataSource: 'd_vib',
        },
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.paramsData, key, {
            isShow: true,
            pos,
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: this.$t('Common.noDataText'),//无数据
            },
            chartData: {
              data: null,
              dom: null,
              chartObj: null,
              vdata: null,
              dataY: null,
              option: null,
            },
            timeData: [],
          })
          this.getTimeData(this.requestData.time)
          this.$nextTick(() => {
            this.drawLineCharts()
          })
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.paramsData, key)
          break
      }
    },
    drawLineCharts() {
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      if (chartData.chartObj == null) {
        chartData.chartObj = echarts.init(
          this.$refs[`spectrumFalls${this.currentKey}`][0]
        )
      }
      chartData.option = {
        tooltip: {},
        xAxis3D: {
          type: 'value',
          splitLine: {
            // show: false,
            lineStyle: {
              width: 2,
              opacity: 0.3,
              color: '#ccc',
            },
          },
          axisLabel: {
            color: '#fff',
            fontSize: 15,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        yAxis3D: {
          type: 'category',
          splitLine: {
            // show: false,
            lineStyle: {
              width: 2,
              opacity: 0.3,
              color: '#ccc',
            },
          },
          axisLabel: {
            color: '#fff',
            fontSize: 15,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        zAxis3D: {
          type: 'value',
          splitLine: {
            // show: false,
            lineStyle: {
              width: 2,
              opacity: 0.3,
              color: '#ccc',
            },
          },
          axisLabel: {
            color: '#fff',
            fontSize: 15,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        grid3D: {
          boxWidth: 100,
          boxHeight: 80,
          boxDepth: 150,
          viewControl: {
            projection: 'orthographic',
            autoRotate: false,
            rotateSensitivity: [1, 0],
          },
          // panMouseButton:"right",
          axisPointer: {
            lineStyle: {
              color: '#d9d9d9',
            },
          },
        },
        legend: {
          right: 200,
          top: 50,
          orient: 'vertical',
          textStyle: {
            color: '#fff',
            fontweight: 'bold',
            fontSize: 20,
          },
        },
        series: [],
      }
      chartData.chartObj.setOption(chartData.option)
      window.addEventListener('resize', () => {
        chartData.chartObj.resize()
      })
    },
    resize() {
      if (
        this.paramsData &&
        this.paramsData[this.currentKey] &&
        this.paramsData[this.currentKey].chartData &&
        this.paramsData[this.currentKey].chartData.chartObj
      ) {
        this.paramsData[this.currentKey].chartData.chartObj.resize()
      }
    },
    dataRetrieval() {
      this.$retrieval({
        key: 'system',
        params: {
          macName: '',
          macId: '',
          machineOpition: [],
        },
      }).then((res) => {
        let requestData = this.requestData
        requestData.time.startTime = res.startTime
        requestData.time.endTime = res.endTime
        this.getTimeData(requestData.time)
      })
    },
    ssSelect(item) {
      const requestData = this.requestData.data
      requestData.currTime[0] = item.startTime
      requestData.currTime[1] = item.stopTime
      // 实时数据按钮
      // const params = this.paramsData[this.currentKey]
      // params.isReal = false
      this.getData(this.requestData.data)
    },
    getData(requestData) {
      const chartData = this.paramsData[this.currentKey].chartData
      this.$emit('loadingImg', true)
      // requestData.currTime = [1614475890798, 1614562290798] //假数据
      this.$getApi.getWaveformAndSpectrum(requestData).then((res) => {
        this.$emit('loadingImg', false)
        if (res) {
          if (res.info.length == 0) {
            this.$pop(this.$t('Common.noDataText'))//无数据
            chartData.vdata = []
            chartData.dataY = []
            chartData.option.series = []
            this.$nextTick(() => {
              chartData.chartObj.setOption(chartData.option, {
                replaceMerge: ['series'],
              })
            })
            return
          }
          let vdata = [],
            dataY = [],
            tipsArray = {} //vdata 存放数据，dataY存放日期
          let freq = []
          this.fftWithHanning = []
          this.fft = []
          res.info.forEach((item) => {
            this.fftWithHanning.push(item.fftWithHanning)
            this.fft.push(item.fft)
            let arr = []
            let fft = item.fft //获取FFT之后的数据
            let time = getTime(item.value.saveTime_Com)
            let temp = (tipsArray[time] = {}) //存每条线的幅值和频率对应关系
            freq.push(item.waveObject.freq)
            for (let i = 0; i < fft.OutY.length; i++) {
              /* 有效频率过滤模块 */
              temp[fft.OutX[i]] = fft.OutY[i] //存每条线的幅值和频率对应关系
              arr.push([fft.OutX[i], time, fft.OutY[i]])
            }
            vdata.push(arr)
            dataY.push(time)
          })
          chartData.vdata = vdata
          chartData.dataY = dataY
          // chartData.tipsArray = tipsArray
          // chartData.freq = freq
          let series = []
          for (let i = 0; i < chartData.vdata.length; i++) {
            series.push({
              type: 'line3D',
              lineStyle: {
                width: 3,
              },
              data: chartData.vdata[i],
            })
          }
          chartData.option.series = series
          this.$nextTick(() => {
            chartData.chartObj.setOption(chartData.option, {
              replaceMerge: ['series'],
            })
          })
        }
      })
    },
    getTimeData(requestData) {
      const params = this.paramsData[this.currentKey]
      this.$getApi.getOnOffIndex(requestData).then((res) => {
        if (res) {
          params.timeData = []
          this.$nextTick(() => {
            params.chartData.chartObj.resize()
          })
          if (res.list.length > 0) {
            params.timeData = res.list
            this.ssSelect(params.timeData[0])
          } else {
            this.$pop(this.$t('Common8000.NoStartStopData'))//无启停数据！
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/css/inputStyle.scss';
@import '@/assets/style/css/chartsStyle.scss';
.spectrumFall-content {
  height: 100%;
  width: 100%;
}
</style>