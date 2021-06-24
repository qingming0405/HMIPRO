<template>
  <div class="box-shadow">
    <div
      v-for="(chart,key) in paramsData"
      :key="key"
      v-show="chart.isShow"
      class="axisLocus-content"
    >
      <div
        class="axisLocus-content-grid"
        v-resize='resize'
      >
        <axis-locus-type
          class="axis-locus-type"
          @type-change="typeChange"
        />
        <div
          ref="axisLocus"
          class="axisLocus-content-left"
        ></div>
        <div
          ref="waveX"
          class="axisLocus-content-up"
        ></div>
        <div
          ref="waveY"
          class="axisLocus-content-down"
        ></div>
        <div
          v-show="chart.isTrend"
          ref="trend"
          class="axisLocus-content-trend"
        ></div>
      </div>
      <div class="search-data">
        <button @click="dataRetrieval">
          <!-- 数据检索 -->{{$t('Common.retrieval')}}
        </button>
        <button
          :class="chart.isReal ? '' : 'disable-btn'"
          @click="setRealData"
        >
          <!-- 实时数据 -->{{$t('Common.realData')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  cloneObj,
  getTime,
  getdefaultCode,
  setSrcSpectrum,
} from 'utils/utils.js'
import AxisLocusType from './axisLocusType.vue'

export default {
  name: 'axisLocus',
  components: {
    AxisLocusType,
  },
  data() {
    return {
      paramsData: {},
      currentKey: null,
      currentIndex: -1,
      curParamsData: null,
    }
  },
  watch: {
    '$store.state.axisLocusMsg': {
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
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'axisLocus',
    })
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId, posId, posType] = key.split('_')
      let pos = null
      let isReal, currentTime
      if (type === 0) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
        currentTime = this.$store.state.currentTime
        isReal = 1
        if (currentTime !== 0) {
          isReal = 0
        }
      } else if (type === 1) {
        pos = this.paramsData[key].pos
        isReal = Number(this.paramsData[key].isReal)
      }
      const keyArr = Object.keys(this.paramsData)
      const state = this.$store.state
      const dataType = [
        { val: this.$t('Common8000.TimedHisData'), isChecked: true, type: 1 }, //定时历史数据
        { val: this.$t('Common8000.StartStopData'), isChecked: false, type: 2 }, //启停机数据
        {
          val: this.$t('Common8000.AlarmStorageData'),
          isChecked: false,
          type: 3,
        }, //报警存储数据
      ] //定时历史数据默认选中
      const posA = {
        id: -1,
        name: 'xxx',
        angle: 45,
        unitName: '',
      } //测点A
      const posB = {
        id: -2,
        name: 'xxx',
        angle: -45,
        unitName: '',
      } //测点B
      let requestData = null
      if (type === 0 || type === 1) {
        const params = state.srcParams
        const time = params.time
        const speed = params.speed
        const limit = params.limit
        const density = params.density
        const defaultCode = getdefaultCode(pos.dgm_type)
        const eigenvalue = defaultCode[posType]
        requestData = {
          trend: {
            machineId: macId,
            positionId: posId,
            positionType: posType,
            startTime: time.start,
            endTime: time.end,
            toSpeed: speed.max,
            fromSpeed: speed.min,
            lowerLimit: limit.lower,
            upperLimit: limit.upper,
            value: eigenvalue.filed,
            code: eigenvalue.code,
            waveType: 0,
            density: Number(density.type),
            type: this.remoteDataType(dataType),
          },
          spectrum: {
            pos_id: posId,
            pos_type: posType,
            mac_id: macId,
            time: 0,
            isReal: isReal,
            dataSource: 'c_vib',
          },
        }
        for (let k in this.paramsData) {
          this.paramsData[k].isShow = false
        }
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length
          this.$set(this.paramsData, key, {
            isShow: true,
            isReal: Boolean(isReal),
            timer: null, // 计时器
            isTrend: true,
            echartIns: [], // 左上下顺序
            requestData,
            posA,
            posB,
            trendDataList: null, //趋势数据
            type: 0, //轨迹类型
            dataListA: {
              srcWaveY: null,
              srcSpectrum: null,
              curWave: null,
            }, //数据源A
            dataListB: {
              srcWaveY: null,
              srcSpectrum: null,
              curWave: null,
            }, //数据源B
            curDataList: null, //轴心位置图数据
            pos: cloneObj(
              this.$store.state.checkMsg.pos,
              true
            ) /* 选中测点信息 */,
            dataType,
          })
          this.$nextTick(() => {
            this.curParamsData = this.paramsData[key]
            this.createChart()
            if (isReal) {
              this.getTrendData()
              let fn = () => {
                this.getChartData(0)
                return fn
              }
              this.paramsData[key].timer = setInterval(fn(), 2000)
            } else {
              this.getTrendData(true)
            }
          })
          break
        case 1 /* 切换图表 */:
          this.curParamsData = this.paramsData[key]
          this.currentIndex = keyArr.indexOf(key)
          this.curParamsData.isShow = true
          break
        case 2 /* 关闭图表 */:
          clearInterval(this.paramsData[key].timer)
          this.$delete(this.paramsData, key)
          break
      }
    },
    remoteDataType(dataType) {
      const type = []
      dataType.forEach((item) => {
        if (item.isChecked) {
          type.push(item.type)
        }
      })
      return type
    },
    /* 创建表格实例 */
    createChart() {
      let paramsData = this.curParamsData
      const that = this

      let optionLeft = {
        tooltip: {
          triggerOn: 'click',
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            axis: 'x',
            lineStyle: {
              color: '#ff9b21',
            },
            label: {
              color: 'black',
            },
            crossStyle: {
              color: '#ff9b21',
              type: 'solid',
            },
          },
        },
        grid: {
          top: 50,
          left: 50,
          right: 50,
          containLabel: false,
          bottom: 55,
        },
        xAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
              opacity: 0.2,
            },
          },

          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
            onZero: false,
          },
          axisLabel: {
            color: '#F3F3F3',
            formatter: (value) => {
              if (value % 1 === 0) {
                return value
              } else {
                return value.toFixed(1)
              }
            },
          },
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
            color: '#F3F3F3',
          },
        },
        yAxis: {
          type: 'value',
          axisLine: { onZero: false },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
              opacity: 0.2,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
            formatter: (value) => {
              if (value % 1 === 0) {
                return value
              } else {
                return value.toFixed(1)
              }
            },
          },
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
            color: '#F3F3F3',
          },
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none',
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none',
          },
        ],
        series: [
          {
            id: 'a',
            type: 'line',
            smooth: true,
            data: [],
            showSymbol: false,
            animation: false,
            color: ['#13c2c2'],
          },
          {
            symbolSize: 15,
            data: [],
            animation: false,
            type: 'scatter',
            markPoint: {
              symbol: 'rect',
              data: [{ name: '+', coord: [5, 5] }],
              symbolSize: 15,
              itemStyle: {
                color: 'rgba(255, 255, 255, 0)',
              },

              label: {
                show: true,
                color: '#13c2c2',
                formatter: (param) => {
                  return param.name
                },
                fontSize: 25,
              },
              silent: true,
            },
          },
        ],
      }
      let optionUp = {
        animation: true,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#ff9b21',
            },
          },
        },
        xAxis: {
          nameLocation: 'end',
          nameGap: -30,
          nameTextStyle: {
            fontSize: 14,
            padding: [65, 0, 0, 10],
            color: '#F3F3F3',
          },
          name: this.$t('Common.time')+'（s）',//时间
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
            onZero: false,
          },
          axisLabel: {
            color: '#F3F3F3',
          },
        },

        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none',
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none',
          },
        ],
        grid: {
          top: 50,
          left: 30,
          right: 60,
          containLabel: true,
          bottom: 50,
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
          },
          nameTextStyle: {
            fontSize: 14,
            align: 'left',
            color: '#F3F3F3',
          },
          splitLine: {
            show: true,
            lineStyle: {
              opacity: 0.2,
            },
          },
          name: this.$t('Common.amplitude'),//幅值
        },
        series: [
          {
            name: '',
            type: 'line',
            showSymbol: false,
            clip: true,
            markLine: {
              symbol: ['none', 'none'],
              label: { show: true },
            },
            data: [],
            color: ['#13c2c2'],
            symbolSize: 6,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1.5,
                },
              },
            },
          },
        ],
      }
      let optionDown = {
        animation: true,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#ff9b21',
            },
          },
        },
        xAxis: {
          nameLocation: 'end',
          nameGap: -30,
          nameTextStyle: {
            fontSize: 14,
            padding: [65, 0, 0, 10],
            color: '#F3F3F3',
          },
          name: this.$t('Common.time')+'（s）',//时间
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
            onZero: false,
          },
          axisLabel: {
            color: '#F3F3F3',
          },
        },

        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none',
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none',
          },
        ],
        grid: {
          top: 50,
          left: 30,
          right: 60,
          containLabel: true,
          bottom: 50,
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
          },
          nameTextStyle: {
            fontSize: 14,
            align: 'left',
            color: '#F3F3F3',
          },
          splitLine: {
            show: true,
            lineStyle: {
              opacity: 0.2,
            },
          },
          name: this.$t('Common.amplitude'),//幅值
        },
        series: [
          {
            name: '',
            type: 'line',
            showSymbol: false,
            clip: true,
            markLine: {
              symbol: ['none', 'none'],
              label: { show: true },
            },
            data: [],
            color: ['#13c2c2'],
            symbolSize: 6,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1.5,
                },
              },
            },
          },
        ],
      }
      let optionTrend = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
            lineStyle: {
              color: '#ff9b21',
            },
          },
          alwaysShowContent: false /* 是否永远显示提示框内容 */,
          // hideDelay: 6000,
          triggerOn: 'click' /* 触发事件方式 */,
          formatter: (params) => {
            let tip = ''
            if (params.length > 0 && params[0].data != null) {
              const data = params[0].data
              tip = that.getTrendToolTip(data)
              that.updateTrendMarkLine(data)
              if (paramsData.isReal) {
                that.setRealData()
              }
              that.getChartData(data[0])
            }
            return tip
          },
        },

        toolbox: {
          show: true,
          itemSize: 18,
          iconStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            restore: {},
            saveAsImage: {},
          },
        },
        grid: {
          top: 40,
          left: 40,
          right: 20,
          bottom: 10,
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'filter',
            height: 15,
            textStyle: {
              color: '#fff',
            },
            borderColor: '#90979c',
            bottom: this.datazoomSpacing,
            show: false,
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'filter',
          },
        ],
        xAxis: {
          type: 'time',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
            formatter: function (value, index) {
              return getTime(value)
            },
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          name: '',
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
        },
        series: [
          {
            name: 'trend',
            type: 'line',
            showSymbol: true,
            hoverAnimation: false,
            data: [],
            symbolSize: 8,
            color: ['#13c2c2'],
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1.5,
                },
              },
            },
          },
        ],
      }

      /* 左边的图 */
      let echartLeft = echarts.init(this.$refs.axisLocus[this.currentIndex])
      echartLeft.setOption(optionLeft)
      paramsData.echartIns.push(echartLeft)
      /* 上边图谱 */
      let echartUp = echarts.init(this.$refs.waveX[this.currentIndex])
      echartUp.setOption(optionUp)
      paramsData.echartIns.push(echartUp)
      /* 下边图谱 */
      let echartDown = echarts.init(this.$refs.waveY[this.currentIndex])
      echartDown.setOption(optionDown)
      paramsData.echartIns.push(echartDown)
      /* 趋势图 */
      let echartTrend = echarts.init(this.$refs.trend[this.currentIndex])
      echartTrend.setOption(optionTrend)
      paramsData.echartIns.push(echartTrend)
    },
    showProgress(isShow) {
      this.$emit('loadingImg', isShow)
    },
    getTrendToolTip(data) {
      let tip = ''
      tip += this.$t('Common.time')+'：' + getTime(data[0]) + '<br>'//时间
      tip += this.$t('Common.amplitude')+'：' + data[1].toFixed(4) + '<br>'//幅值
      tip += this.$t('eigenvalue.speed')+'：' + data[2].toFixed(0) + '<br>'//转速
      return tip
    },
    updateTrendMarkLine(data) {
      let paramsData = this.curParamsData
      if (paramsData != null && paramsData.echartIns.length >= 4) {
        const option = {
          series: [
            {
              markLine: {
                silent: true,
                symbol: 'none', //去掉箭头
                animationDuration: 100, //初始动画的时长
                data: [
                  {
                    xAxis: data[0],
                    lineStyle: {
                      color: '#ff9b21',
                      type: 'solid',
                    },
                  },
                ],
                label: {
                  formatter: function (params) {
                    return getTime(params.value)
                  },
                },
              },
            },
          ],
        }
        paramsData.echartIns[3].setOption(option)
      }
    },
    /* 获取趋势数据 */
    getTrendData(isGetWave = false) {
      this.showProgress(true)
      let paramsData = this.curParamsData
      let rd = cloneObj(paramsData.requestData.trend)
      this.$getApi.getPositionEigenvalue(rd).then((res) => {
        if (res) {
          if (res.tendencyList.length > 0) {
            this.showProgress(false)
            paramsData.isTrend = true
            paramsData.trendDataList = res.tendencyList
            const data = res.tendencyList.map((item) => {
              return [
                item.saveTime,
                item.tempValue,
                item.speed,
                item.dataSource,
              ]
            })
            const echartTrend = paramsData.echartIns[3]
            const optionTrend = {
              series: [
                {
                  data: data,
                },
              ],
            }
            echartTrend.setOption(optionTrend)
            if (isGetWave) {
              //初始化显示最新点的波形
              this.getChartData(data[data.length - 1][0])
            }
          } else {
            paramsData.trendDataList = []
            this.$pop(this.$t('Common8000.noTrendData'))//无趋势数据
          }
        } else {
          this.showProgress(false)
        }
      })
    },
    getChartData(time) {
      const { requestData, posA, posB, type, dataListA, dataListB } =
        this.curParamsData
      requestData.spectrum.time = time
      this.$getApi.getAxisOrbit(requestData.spectrum).then((res) => {
        if (res && res.msg === 0 && res.data != null && res.data.length > 0) {
          const result = res.data
          if (
            result[0].waveObject.wave === null ||
            result[0].waveObject.wave.length === 0 ||
            result[1].waveObject.wave === null ||
            result[1].waveObject.wave.length === 0
          ) {
            return
          }
          posA.id = result[0].config.id
          posA.name = result[0].config.name
          posA.angle = result[0].config.orient_degree
          posA.unitName = result[0].config.unitName[0]
          posA.speed = result[0].waveObject.speed
          posA.freq = result[0].waveObject.freq
          posA.samples = result[0].waveObject.samples
          posB.id = result[1].config.id
          posB.name = result[1].config.name
          posB.angle = result[1].config.orient_degree
          posB.unitName = result[1].config.unitName[0]
          posB.speed = result[1].waveObject.speed
          posB.freq = result[1].waveObject.freq
          posB.samples = result[1].waveObject.samples
          if (type === 0) {
            dataListA.srcWaveY = result[0].waveObject.wave
            dataListA.srcSpectrum = null
            dataListB.srcWaveY = result[1].waveObject.wave
            dataListB.srcSpectrum = null
          } else {
            if (time === 0) {
              //实时数据时返回原始波形
              dataListA.srcWaveY = result[0].waveObject.wave
              dataListA.srcSpectrum = this.getSpectrum(
                dataListA.srcWaveY,
                posA.freq,
                posA.samples
              )
              dataListB.srcWaveY = result[1].waveObject.wave
              dataListB.srcSpectrum = this.getSpectrum(
                dataListB.srcWaveY,
                posB.freq,
                posB.samples
              )
            } else {
              //历史数据时返回原始波形和离散频谱
              dataListA.srcWaveY = result[0].waveObject.wave
              dataListA.srcSpectrum = this.localSpectrum(
                result[0].spectrumObject
              )
              dataListB.srcWaveY = result[1].waveObject.wave
              dataListB.srcSpectrum = this.localSpectrum(
                result[1].spectrumObject
              )
            }
          }
          this.setChartData()
        }
      })
    },
    //构造波形数组
    getWave(waveY, freq) {
      const len = waveY.length
      const dt = 1 / freq
      const wave = []
      for (let i = 0; i < len; i++) {
        wave.push([i * dt, waveY[i]])
      }
      return wave
    },
    // 计算频谱
    getSpectrum(waveY, freq, samples) {
      const spectrumData = setSrcSpectrum(freq, waveY, 1, samples)
      return spectrumData
    },
    // 换算为频谱格式
    localSpectrum(remoteSpectrum) {
      const { spectrum, freq, samples } = remoteSpectrum
      const fftX = []
      const fftY = []
      const outP = []
      const len = spectrum.length
      const ratio = freq / samples
      for (let i = 0; i < len; i++) {
        fftX.push(spectrum[i].weizhi * ratio)
        fftY.push(spectrum[i].fuzhi)
        outP.push(spectrum[i].xiangwei)
      }
      return { fftX, fftY, outP }
    },
    // 构造当前波形
    getCurWave(type, pos, dataList) {
      let { srcWaveY, srcSpectrum } = dataList
      if (type >= 1 && type <= 6) {
        //倍频波形
        //0.5x 1x 2x 4x 8x 16x
        let nx = Math.pow(2, type - 2)
        let nf = (pos.speed / 60) * nx //倍频
        if (srcSpectrum === null) {
          srcSpectrum = this.getSpectrum(srcWaveY, pos.freq, pos.samples)
          dataList.srcSpectrum = srcSpectrum
        }
        let index = this.indexOfSpectrum(srcSpectrum, nf)
        const waveY = this.nfToWave(srcSpectrum, index, pos.freq, pos.samples)
        return this.getWave(waveY, pos.freq)
      }
      return this.getWave(srcWaveY, pos.freq) // 默认type=0
    },
    // 频率最近点下标，超过返回最大值
    indexOfSpectrum(spectrum, f) {
      const fftX = spectrum.fftX
      let index = -1
      for (let i = 0; i < fftX.length - 1; i++) {
        if (f >= fftX[i] && f < fftX[i + 1]) {
          if (Math.abs(f - fftX[i]) < Math.abs(f - fftX[i + 1])) {
            index = i
          } else {
            index = i + 1
          }
          break
        }
      }
      //超出边界处理
      if (index === -1) {
        if (f < fftX[0]) {
          index = 0
        } else {
          index = fftX.length - 1
        }
      }
      return index
    },
    // 倍频转波形
    nfToWave(spectrum, index, freq, samples) {
      const wave = []
      const { fftX, fftY, outP } = spectrum
      const A = fftY[index]
      const P = outP[index]
      const w = 2 * Math.PI * fftX[index]
      for (let i = 0; i < samples; i++) {
        wave.push(A * Math.sin((w * i) / freq + P))
      }
      return wave
    },
    // 当前轨迹图
    getCurDataList(posA, posB, waveA, waveB) {
      const angleA = posA.angle
      const angleB = posB.angle
      const dataList = []
      const len = Math.max(waveA.length, waveB.length)
      let a1, b1, a2, b2
      for (let i = 0; i < len; i++) {
        a1 = -1 * waveA[i][1] * Math.sin((angleA * Math.PI) / 180)
        b1 = waveA[i][1] * Math.cos((angleA * Math.PI) / 180)
        a2 = -1 * waveB[i][1] * Math.sin((angleB * Math.PI) / 180)
        b2 = waveB[i][1] * Math.cos((angleB * Math.PI) / 180)
        dataList.push([a1 + a2, b1 + b2])
      }
      return dataList
    },
    // 当前波形数据，更新波形图
    setChartData() {
      const { posA, posB, echartIns, type, dataListA, dataListB, curDataList } =
        this.curParamsData
      dataListA.curWave = this.getCurWave(type, posA, dataListA)
      dataListB.curWave = this.getCurWave(type, posB, dataListB)
      this.setWaveOption(posA, echartIns[1], dataListA)
      this.setWaveOption(posB, echartIns[2], dataListB)

      this.curParamsData.curDataList = this.getCurDataList(
        posA,
        posB,
        dataListA.curWave,
        dataListB.curWave
      )
      this.setAxisLocusOption(
        posA,
        posB,
        echartIns[0],
        this.curParamsData.curDataList
      )
    },
    setWaveOption(pos, echart, dataList) {
      const option = {
        yAxis: {
          name: `${this.$t('Common.amplitude')}：（${pos.unitName}） ${pos.name} ∠${pos.angle}°`,//幅值
        },
        series: [
          {
            data: dataList.curWave,
          },
        ],
      }
      echart.setOption(option)
    },
    setAxisLocusOption(posA, posB, echart, dataList) {
      const option = {
        xAxis: {
          name: `${posA.unitName}`,
        },
        yAxis: {
          name: `${posB.unitName}`,
        },
        series: [
          {
            data: dataList,
          },
        ],
      }
      echart.setOption(option)
    },
    /* 数据检索 */
    dataRetrieval() {
      let params = this.curParamsData
      const { dataType, requestData } = params
      let viewMsg = {
        dataType,
        type: 'fullSpectrum',
      }
      this.$retrieval({
        key: 'fullSpectrum',
        viewMsg,
      }).then((res) => {
        if (res) {
          if (params.isReal) {
            this.setRealData()
          }
          dataType.splice(0, dataType.length, ...res.dataType)
          requestData.trend.startTime = res.startTime
          requestData.trend.endTime = res.endTime
          requestData.trend.type = this.remoteDataType(dataType)
          this.getTrendData()
        }
      })
    },
    // 切换轨迹类型
    typeChange(type) {
      this.curParamsData.type = type
      this.setChartData()
    },
    setRealData() {
      const params = this.paramsData[this.currentKey]
      params.isReal = !params.isReal
      params.requestData.spectrum.isReal = Number(params.isReal)
      if (params.isReal) {
        let fn = () => {
          this.getChartData(0)
          return fn
        }
        params.timer = setInterval(fn(), 2000)
      } else {
        clearInterval(params.timer)
      }
    },
    resize() {
      if (this.curParamsData && this.curParamsData.echartIns) {
        this.curParamsData.echartIns.forEach((item) => {
          if (item) {
            item.resize()
          }
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.axisLocus-content {
  height: 100%;
  width: 100%;
  position: relative;
  .axisLocus-content-grid {
    height: calc(100% - 49px);
    width: 100%;
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(3, 1fr);
    .axis-locus-type {
      grid-row-start: 1;
      grid-row-end: 3;
      grid-column-start: 1;
      grid-column-end: 2;
    }
    .axisLocus-content-left {
      grid-row-start: 1;
      grid-row-end: 3;
      grid-column-start: 2;
      grid-column-end: 7;
    }
    .axisLocus-content-up {
      grid-column-start: 7;
      grid-column-end: 13;
    }
    .axisLocus-content-down {
      grid-column-start: 7;
      grid-column-end: 13;
    }
    .axisLocus-content-trend {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-column-start: 1;
      grid-column-end: 13;
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    button {
      height: 30px;
      width: 100px;
    }
  }
}
</style>
