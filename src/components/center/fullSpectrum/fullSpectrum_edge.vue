<template>
  <div>
    <div
      class="fullSpectrum_box"
      v-for="(item, index) in paramsData"
      :key='index'
      v-show='item.isShow'
    >
      <div class="fullSpectrum_chartBox" v-resize='resize'>
        <div
          class="fullSpectrum_wave-1"
          ref='waves'
        >
          <div
            class="wave_1 box-shadow"
            ref="wave_1"
          ></div>
          <div
            class="wave_2 box-shadow"
            ref="wave_2"
          ></div>
        </div>
        <div
          class="fullSpectrum_spectrum-1 box-shadow"
          ref="spectrum"
        ></div>
        <div
          class="fullSpectrum_trend box-shadow"
          ref="trend"
          v-show="item.isTrend"
        ></div>
      </div>
      <div class="search-data">
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
  hasClass,
  removeClass,
  addClass,
  getdefaultCode,
  getTime,
  setSrcSpectrum,
  getUnit,
} from 'utils/utils.js'
export default {
  name: 'fullSpectrum',
  data() {
    return {
      paramsData: {},
      requestData: null,
      currentKey: '',
      // 图表字体大小 默认14
      chartsFontSize: 14,
      // 图表左右间距
      chartLeftAndRightSpacing: [30, 80],
      currentIndex: 0 /* 当前显示图谱下标 */,
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fullSpectrum',
    })
  },
  watch: {
    '$store.state.fullSpectrumMsg': {
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
      let [, , macId, posId, posType] = key.split('_')
      let pos = null
      let isReal
      let currentTime = this.$store.state.currentTime
      if (type === 0) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
        isReal = 1
        if (currentTime !== 0) {
          isReal = 0
        }
      } else if (type === 1) {
        pos = this.paramsData[key].pos
        isReal = Number(this.paramsData[key].isReal)
      }
      if (type === 0 || type === 1) {
        this.currentKey = key
        const params = this.$store.state.srcParams
        const time = params.time
        const speed = params.speed
        const limit = params.limit
        const trendDensity = params.density /* 趋势数据查询密度 */
        const defaultCode = getdefaultCode(pos.dgm_type)
        const eigenvalue = defaultCode[posType]
        this.requestData = {
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
            density: Number(trendDensity.type),
          },
          spectrum: {
            dataSource: 'c_vib',
            pos_id: posId,
            pos_type: posType,
            mac_id: macId,
            time: currentTime,
            isReal: isReal,
          },
        }
      }
      let keyArr = Object.keys(this.paramsData)
      switch (type) {
        case 0 /* 打开图表 */:
          const defaultCode = getdefaultCode(pos.dgm_type)
          const eigenvalue = defaultCode[posType]
          this.currentIndex = keyArr.length
          const unit = getUnit(eigenvalue.code, pos)
          this.$set(this.paramsData, key, {
            chartData: {
              wave1: {
                dom: null,
                data: [],
                obj: null,
                unit,
                unitX: 's',
                pos: null,
              },
              wave2: {
                dom: null,
                data: [],
                obj: null,
                unit,
                unitX: 's',
                pos: null,
              },
              spectrum: {
                dom: null,
                data: [],
                obj: null,
                unit,
                unitX: 'Hz',
              },
              trend: {
                dom: null,
                data: [],
                obj: null,
                option: {},
                chooseData: null,
                unit,
              },
            },
            pos: pos /* 选中测点信息 */,
            isShow: true,
            isTrend: false, // 是否显示趋势图
            dataType: [
              { val: this.$t('Common8000.TimedHisData'), isChecked: true, type: 1 },//定时历史数据
              { val: this.$t('Common8000.StartStopData'), isChecked: false, type: 2 },//启停机数据
              { val: this.$t('Common8000.AlarmStorageData'), isChecked: false, type: 3 },//报警存储数据
            ], //8000数据类型选择
            isReal: Boolean(isReal),
          })
          this.getTrendData()
          if (isReal) {
            let fn = () => {
              this.getChartData()
              return fn
            }
            this.paramsData[key].time = setInterval(fn(), 2000)
          } else {
            this.getChartData()
          }
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          clearInterval(this.paramsData[key].time)
          this.$delete(this.paramsData, key)
          break
      }
      if (type == 1 || type == 0) {
        let paramsData = this.paramsData[this.currentKey]
        let data = paramsData.chartData
        this.$nextTick(() => {
          data.wave1.dom = this.$refs.wave_1[0]
          data.wave2.dom = this.$refs.wave_2[0]
          data.spectrum.dom = this.$refs.spectrum[0]
          if (data.wave1.dom) {
            this.setWaveOption(data.wave1)
          }
          if (data.wave2.dom) {
            this.setWaveOption(data.wave2)
          }
          if (data.spectrum.dom) {
            this.setSpectrumOption()
          }
        })
      }
    },
    // 获取趋势图数据
    getTrendData() {
      this.clickTrend = false
      this.isNewChart = true
      const params = this.paramsData[this.currentKey]
      const data = params.chartData
      let rd = cloneObj(this.requestData.trend)
      this.$getApi.getPositionEigenvalue(rd).then((res) => {
        if (res) {
          if (res.tendencyList.length > 0) {
            params.isTrend = true
            let waves = this.$refs.waves[this.currentIndex]
            if (hasClass(waves, 'fullSpectrum_wave-1')) {
              removeClass(waves, 'fullSpectrum_wave-1')
              addClass(waves, 'fullSpectrum_wave')
              data.wave1.obj.resize()
              data.wave2.obj.resize()
            }
            if (hasClass(data.spectrum.dom, 'fullSpectrum_spectrum-1')) {
              removeClass(data.spectrum.dom, 'fullSpectrum_spectrum-1')
              addClass(data.spectrum.dom, 'fullSpectrum_spectrum')
              data.spectrum.obj.resize()
            }
            this.$nextTick(() => {
              data.trend.dom = this.$refs.trend[0]
              if (data.trend.dom) {
                this.setTrendOption(1)
              }
            })
            this.setTrend(res)
          } else {
            params.chartData.trend.data = []
            this.$pop(this.$t('Common8000.noTrendData'))//无趋势数据
          }
        }
      })
    },
    setTrend(res) {
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      const trend = chartData.trend
      let data = []
      for (let i = 0; i < res.tendencyList.length; i++) {
        let value = res.tendencyList[i]
        let item = {
          type: '',
          name: '',
          value: [],
        }
        for (let k in value) {
          if (k === 'saveTime') {
            let val = getTime(value[k])
            item.name = val
            item.value.push(value[k])
          }
          if (k === 'dataSource') {
            item.type = value[k]
          }
        }
        for (let k in value) {
          if (k === 'tempValue') {
            item.value.push(value[k])
          }
        }
        data.push(item)
      }
      trend.data = data
      this.$nextTick(() => {
        trend.dom = this.$refs.trend[this.currentIndex]
        if (trend.dom) {
          this.setTrendOption(1)
        }
      })
    },
    setrealData() {
      const params = this.paramsData[this.currentKey]
      params.isReal = !params.isReal
      this.requestData.spectrum.isReal = Number(params.isReal)
      if (params.isReal) {
        let fn = () => {
          this.getChartData()
          return fn
        }
        params.time = setInterval(fn(), 2000)
      } else {
        clearInterval(params.time)
      }
    },
    // 获取波形频谱数据
    getChartData() {
      const params = this.paramsData[this.currentKey]
      const data = params.chartData
      let rd = cloneObj(this.requestData.spectrum)
      this.$getApi.getAllSpectrum(rd).then((res) => {
        if (res) {
          if (res.list) {
            if (rd.isReal) {
              this.setChartData(res.list, 1)
            } else {
              this.setChartData(res.list)
            }
          }
        }
      })
    },
    setChartData(res, isReal = 0) {
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      const data = []
      const waveData1 = []
      const waveData2 = []
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          let list = res[i]
          if (list.config && list.config.pos_id) {
            if (list.config.pos_id === params.pos.pos_id) {
              if (i === 1) {
                chartData.wave1.pos = params.pos
              } else {
                chartData.wave2.pos = params.pos
              }
            } else {
              let posArray = this.$store.state.pos[params.pos.mac_id]
              posArray.forEach((pos) => {
                if (list.config.pos_id === pos.pos_id) {
                  if (i === 1) {
                    chartData.wave1.pos = pos
                  } else {
                    chartData.wave2.pos = pos
                  }
                }
              })
            }
          }
          // 波形数据
          if (list.waveObject && list.waveObject.wave) {
            const waveData = list.waveObject
            let l = waveData.wave.length
            const addNum = l / waveData.freq / l
            for (let k = 0; k < l; k++) {
              if (i == 1) {
                waveData1.push([k * addNum, waveData.wave[k]])
              } else {
                waveData2.push([k * addNum, waveData.wave[k]])
              }
            }
          }

          // 频谱数据
          if (isReal == 0) {
            if (list.spectrumObject && list.spectrumObject.spectrum) {
              const spectrumData = list.spectrumObject
              let samples = spectrumData.samples
              let freq = spectrumData.freq
              let n = 0
              for (let k = 0; k < spectrumData.spectrum.length; k++) {
                const value = spectrumData.spectrum[k]
                if (i == 0) {
                  while (n < value.weizhi - 1) {
                    data.push([(freq / samples) * n, 0])
                    n++
                  }
                  data.push([
                    (freq / samples) * (value.weizhi - 1),
                    value.fuzhi,
                  ])
                  n++
                } else {
                  // 一个测点的数据转为负数
                  while (n < value.weizhi - 1) {
                    data.push([(freq / samples) * n * -1, 0])
                    n++
                  }
                  data.push([
                    (freq / samples) * (value.weizhi - 1) * -1,
                    value.fuzhi,
                  ])
                  n++
                }
              }
              if (i == 0) {
                if (samples + 1 > data.length) {
                  while (n < samples + 1) {
                    data.push([(freq / samples) * n, 0])
                    n++
                  }
                }
              } else {
                if (samples * 2 + 1 > data.length) {
                  while (n < samples + 1) {
                    data.push([(freq / samples) * n * -1, 0])
                    n++
                  }
                }
              }
            }
          } else {
            if (
              !list.waveObject ||
              !list.waveObject.freq ||
              !list.waveObject.wave ||
              !list.waveObject.samples
            ) {
              return
            }
            const spectrumData = setSrcSpectrum(
              list.waveObject.freq,
              list.waveObject.wave,
              1,
              list.waveObject.samples
            )
            if (i == 0) {
              for (let k = 0; k < spectrumData.fftX.length; k++) {
                data.push([spectrumData.fftX[k], spectrumData.fftY[k]])
              }
            } else {
              for (let k = 0; k < spectrumData.fftX.length; k++) {
                data.push([-spectrumData.fftX[k], spectrumData.fftY[k]])
              }
            }
          }
        }
        let sortNumber = function (a, b) {
          return a[0] - b[0]
        }
        // data.sort(sortNumber)
        chartData.spectrum.data = data
        if (chartData.spectrum.dom) {
          this.setSpectrumOption()
        }

        chartData.wave1.data = waveData1
        chartData.wave2.data = waveData2
        if (chartData.wave1.dom) {
          this.setWaveOption(chartData.wave1)
        }
        if (chartData.wave2.dom) {
          this.setWaveOption(chartData.wave2)
        }
      }
    },
    // 波形图option
    setWaveOption(wave) {
      if (wave.obj == null) {
        wave.obj = echarts.init(wave.dom)
      }
      const option = {
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
          name: wave.unitX,
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
            color: '#F3F3F3',
          },
          min: function (value) {
            return Math.floor(value.min * 1000) / 1000
          },
          max: function (value) {
            return Math.ceil(value.max * 1000) / 1000
          },
          nameLocation: 'end',
          nameGap: -30,
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            padding: [80, 0, 0, 0],
            color: '#F3F3F3',
          },
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
        grid: {
          top: 35,
          left: 40,
          right: 40,
          // containLabel: true,
          bottom: 25,
        },
        // grid: {
        //   top: 50,
        //   left: this.chartLeftAndRightSpacing[0],
        //   right: this.chartLeftAndRightSpacing[1],
        //   containLabel: true,
        //   bottom: 65,
        // },
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: 0,
            width: 15,
            filterMode: 'filter',
            textStyle: {
              color: '#fff',
            },
            borderColor: '#90979c',
            right: 15,
            show: false, //是否显示
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'filter',
          },
        ],
        yAxis: {
          min: function (value) {
            return Math.floor(value.min * 1000) / 1000
          },
          max: function (value) {
            return Math.ceil(value.max * 1000) / 1000
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
          },
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
            color: '#F3F3F3',
          },
          splitLine: {
            show: true,
            lineStyle: {
              opacity: 0.2,
            },
          },
          name: wave.pos
            ? wave.pos.pos_name + this.$t('Common8000.wave')+' (' + wave.unit + ')'
            : this.$t('Common8000.wave')+' (' + wave.unit + ')',
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
            color: ['#13c2c2'],
            symbolSize: 6,
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1.5,
                },
              },
            },
            data: wave.data,
          },
        ],
      }
      wave.obj.setOption(option)
      // window.onresize = this.myChart_example.resize;
      window.addEventListener('resize', () => {
        wave.obj.resize()
      })
    },
    // 趋势图Option
    // flag:1表示首次画；2表示点击修改markLine
    setTrendOption(flag) {
      let paramsData = this.paramsData[this.currentKey]
      let data = paramsData.chartData.trend
      if (flag == 1) {
        if (data.dom) {
          data.obj = echarts.init(data.dom)
          data.option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false,
                lineStyle: {
                  color: '#ff9b21',
                },
              },
              alwaysShowContent: true /* 是否永远显示提示框内容 */,
              // hideDelay: 6000,
              triggerOn: 'click' /* 触发事件方式 */,
              formatter: (params) => {
                if (
                  data.chooseData == null ||
                  (data.chooseData != null &&
                    data.chooseData.data.value[0] != params[0].data.value[0])
                ) {
                  data.chooseData = params[0]
                  this.requestData.spectrum.time = params[0].data.value[0]
                  this.requestData.spectrum.dataSource = params[0].data.type
                  // 关闭实时
                  paramsData.isReal = 0
                  this.requestData.spectrum.isReal = 0
                  clearInterval(paramsData.time)
                  this.$store.commit('setCurrentTime', params[0].data.value[0])
                  this.setTrendOption(2)
                  this.getChartData()
                }
                return (
                  this.$t('Common.time')+'：' +//时间
                  params[0].name +
                  '</br>' +
                  this.$t('eigenvalue.speed')+'：' +//转速
                  params[0].data.value[1]
                )
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
            xAxis: {
              type: 'time',
              name: this.$t('Common.time'),//'时间'
              nameTextStyle: {
                fontSize: this.chartsFontSize,
                align: 'left',
                color: '#F3F3F3',
              },
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
              },
            },
            grid: {
              top: 40,
              left: 40,
              right: 45,
              // containLabel: true,
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
                bottom: 30,
                show: false,
              },
              {
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'filter',
              },
            ],
            yAxis: {
              type: 'value',
              boundaryGap: [0, '100%'],
              name: paramsData.pos.pos_name + this.$t('HeaderEdge.secondLevel2_3')+' (' + data.unit + ')',//趋势图
              nameTextStyle: {
                fontSize: 14,
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
                name: this.$t('Common.freq'),//频率
                type: 'line',
                showSymbol: true,
                hoverAnimation: false,
                data: data.data,
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
          data.obj.setOption(data.option)
          window.addEventListener('resize', () => {
            data.obj.resize()
          })
        }
      } else if (flag == 2) {
        data.obj.setOption({
          series: [
            {
              markLine: {
                silent: true,
                symbol: 'none', //去掉箭头
                animationDuration: 100, //初始动画的时长
                data: [
                  {
                    xAxis: data.chooseData.data.value[0],
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
        })
      }
    },
    // 频谱图Option
    setSpectrumOption() {
      let params = this.paramsData[this.currentKey]
      let data = params.chartData.spectrum
      if (data.dom) {
        if (data.obj == null) {
          data.obj = echarts.init(data.dom)
        }
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false,
              lineStyle: {
                color: '#ff9b21',
              },
            },
            formatter: (params) => {
              return (
                this.$t('Common.freq')+'：' +//频率
                params[0].value[1] +
                '</br>' +
                this.$t('Common.amplitude')+'：' +//幅值
                params[0].value[0]
              )
            },
          },
          xAxis: {
            nameTextStyle: {
              fontSize: this.chartsFontSize,
              align: 'left',
              color: '#F3F3F3',
            },
            name: data.unitX,
            min: function (value) {
              return Math.floor(value.min)
            },
            max: function (value) {
              return Math.ceil(value.max)
            },
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
            },
          },
          grid: {
            top: 40,
            left: 40,
            right: 40,
            // containLabel: true,
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
          yAxis: {
            min: 0,
            max: function (value) {
              return Math.ceil(value.max)
            },
            type: 'value',
            boundaryGap: [0, '100%'],
            name: this.$t('Common8000.Spectrogram')+' (' + data.unit + ')',//频谱图
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
              name: '频率',
              type: 'line',
              showSymbol: false,
              hoverAnimation: false,
              data: data.data,
              symbol: 'triangle',
              symbolSize: 15,
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
        data.obj.setOption(option)
        // window.onresize = this.myChart_example.resize;
        window.addEventListener('resize', () => {
          data.obj.resize()
        })
      }
    },
    resize(){
      let params = this.paramsData[this.currentKey]
      if(params && params.chartData){
        let chart = params.chartData
        if(chart.spectrum && chart.spectrum.obj){
          chart.spectrum.obj.resize()
        }
        if(chart.trend && chart.trend.obj){
          chart.trend.obj.resize()
        }
        if(chart.wave1 && chart.wave1.obj){
          chart.wave1.obj.resize()
        }
        if(chart.wave2 && chart.wave2.obj){
          chart.wave2.obj.resize()
        }
      }
    },
    dataRetrieval() {
      let params = this.paramsData[this.currentKey]
      let dataType = params.dataType
      let viewMsg = {
        dataType,
        type: 'fullSpectrum',
      }
      this.$retrieval({
        key: 'fullSpectrum',
        viewMsg,
      }).then((res) => {
        if (res) {
          this.requestData.trend.startTime = res.startTime
          this.requestData.trend.endTime = res.endTime

          dataType = res.dataType //8000数据类型
          let dataTypeArray = []
          for (let i = 0; i < res.dataType.length; i++) {
            if (res.dataType[i].isChecked == true) {
              dataTypeArray.push(res.dataType[i].type)
            }
          }
          this.requestData.trend.type = dataTypeArray
          this.getTrendData()
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/css/inputStyle.scss';
@import '@/assets/style/css/chartsStyle.scss';
</style>