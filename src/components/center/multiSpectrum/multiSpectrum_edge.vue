<template>
  <div>
    <div
      class="spectrum-box"
      v-for="(item,index) in paramsData"
      @drop='addPos(index, $event)'
      @dragover.prevent
    >
      <div
        class="spectrum-content"
        v-resize='resize'
      >
        <div class="line1">
          <div
            v-for="key in item.line1"
            class="chartbox box-shadow"
            :ref='"chart"+key'
          >
          </div>
        </div>
        <div
          class="line2"
          v-if="item.line2.length > 0"
        >
          <div
            v-for="key in item.line2"
            class="chartbox box-shadow"
            :ref='"chart"+key'
          ></div>
        </div>
        <div
          class="line3"
          v-show="item.isTrend"
        >
          <div
            class="chartbox box-shadow"
            ref="trend"
          ></div>
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
  getdefaultCode,
  getTime,
  setSrcSpectrum,
  getUnit,
} from 'utils/utils.js'
export default {
  name: 'multiSpectrum',
  data() {
    return {
      currentKey: '',
      paramsData: {} /* 数据 */,
      currentIndex: 0 /* 当前显示图谱下标 */,
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'multiSpectrum',
    })
  },
  watch: {
    '$store.state.multiSpectrumMsg': {
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
            time: currentTime,
            pos: [
              {
                mac_id: macId,
                pos_id: posId,
                pos_type: posType,
              },
            ],
            dataSource: 'c_vib',
            isReal: isReal,
          },
        }
      }

      let keyArr = Object.keys(this.paramsData)

      switch (type) {
        case 0 /* 打开图表 */:
          const defaultCode = getdefaultCode(pos.dgm_type)
          const eigenvalue = defaultCode[posType]
          const unit = getUnit(eigenvalue.code, pos)
          this.currentIndex = keyArr.length
          this.$set(this.paramsData, key, {
            isShow: true,
            chartData: {},
            trend: {
              dom: null,
              data: [],
              obj: null,
              option: {},
              chooseData: null,
            },
            line1: [],
            line2: [],
            dataType: [
              { val: this.$t('Common8000.TimedHisData'), isChecked: true, type: 1 },//定时历史数据
              { val: this.$t('Common8000.StartStopData'), isChecked: false, type: 2 },//启停机数据
              { val: this.$t('Common8000.AlarmStorageData'), isChecked: false, type: 3 },//报警存储数据
            ], //8000数据类型选择
            isTrend: false, //是否显示趋势图
            pos,
            isReal: Boolean(isReal),
            unit,
          })
          this.getTrendData()
          this.getChart(`${macId}_${posType}_${posId}`, pos)
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
          this.$delete(this.paramsData, key)
          break
      }
    },
    dataRetrieval() {
      let params = this.paramsData[this.currentKey]
      let dataType = params.dataType
      let viewMsg = {
        dataType,
        type: 'multiSpectrum',
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
    getChart(key, pos) {
      let params = this.paramsData[this.currentKey]
      if (Object.keys(params.chartData).length == 6) {
        this.$pop(this.$t('multiSpectrum.addPosLimit'))//最多拖入六个测点
        return
      }
      const defaultCode = getdefaultCode(pos.dgm_type)
      const eigenvalue = defaultCode[pos.position_type]
      this.$set(params.chartData, key, {
        data: [],
        dom: null,
        echart: null,
        pos,
        unitX: 'Hz',
        unit: getUnit(eigenvalue.code, pos),
      })
      // 存在单数图标推入line1；双数图表推入line2
      if (Object.keys(params.chartData).length % 2 > 0) {
        params.line1.push(key)
      } else {
        params.line2.push(key)
      }
      this.$nextTick(() => {
        this.drawChart(key)
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
    getChartData() {
      let data = []
      let rd = this.requestData.spectrum
      this.$getApi.getSpectrums(rd).then((res) => {
        if (res) {
          if (res.map) {
            if (rd.isReal == 1) {
              this.setChartData(res.map, 1)
            } else {
              this.setChartData(res.map)
            }
          }
        }
      })
    },
    setChartData(map, isReal = 0) {
      // 实时数据时只取到波形数据
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      for (let k in chartData) {
        let [, posType, posId] = k.split('_')
        let key = `${posType}_${posId}`
        let data = []
        if (isReal == 0) {
          if (
            map[key] &&
            map[key].spectrumObject &&
            map[key].spectrumObject.spectrum
          ) {
            const spectrumData = map[key].spectrumObject
            let samples = spectrumData.samples
            let freq = spectrumData.freq
            let n = 0
            // 点数为sample，在数组最前面补一个（0,0）
            for (let k = 0; k < spectrumData.spectrum.length; k++) {
              const value = spectrumData.spectrum[k]
              while (n < value.weizhi) {
                data.push([(freq / samples) * n, 0])
                n++
              }
              data.push([(freq / samples) * value.weizhi - 1, value.fuzhi])
              n++
            }
            if (samples + 1 > data.length) {
              while (n < samples + 1) {
                data.push([(freq / samples) * n, 0])
                n++
              }
            }
          }
        } else {
          if (map[key] && map[key].waveObject && map[key].waveObject.wave) {
            const spectrumData = setSrcSpectrum(
              map[key].waveObject.freq,
              map[key].waveObject.wave,
              1,
              map[key].waveObject.samples
            )
            for (let k = 0; k < spectrumData.fftX.length; k++) {
              data.push([spectrumData.fftX[k], spectrumData.fftY[k]])
            }
          }
        }
        chartData[k].data = data
        this.$nextTick(() => {
          this.drawChart(k)
        })
      }
    },
    drawChart(key) {
      let params = this.paramsData[this.currentKey]
      params.chartData[key].dom = this.$refs[`chart${key}`][0]
      if (params.chartData[key].dom) {
        if (params.chartData[key].echart == null) {
          params.chartData[key].echart = echarts.init(params.chartData[key].dom)
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
            name: params.chartData[key].unitX,
            nameTextStyle: {
              fontSize: 12,
              align: 'left',
              color: '#F3F3F3',
            },
            min: function (value) {
              return value.min
            },
            max: function (value) {
              return value.max
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
            top: 30,
            left: 30,
            right: 30,
            containLabel: false,
            bottom: 40,
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
              bottom: 15,
              show: false,
            },
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
              show: false,
            },
            {
              type: 'inside',
              xAxisIndex: 0,
              filterMode: 'filter',
            },
            {
              type: 'inside',
              yAxisIndex: 0,
              filterMode: 'filter',
            },
          ],
          yAxis: {
            min: function (value) {
              return Math.floor(value.min)
            },
            max: function (value) {
              return Math.ceil(value.max)
            },
            type: 'value',
            boundaryGap: [0, '100%'],
            name:
              params.chartData[key].pos.pos_name +
              this.$t('Common8000.Spectrogram')+' (' +//频谱图
              params.chartData[key].unit +
              ')',
            nameTextStyle: {
              fontSize: 12,
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
              name: this.$t('Common8000.SimulationData'),//模拟数据
              type: 'line',
              showSymbol: false,
              hoverAnimation: false,
              data: params.chartData[key].data,
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
        params.chartData[key].echart.setOption(option)
        window.addEventListener('resize', () => {
          tparams.chartData[key].echart.resize()
        })
      }
      this.$nextTick(this.resizeALL())
    },

    resizeALL() {
      let params = this.paramsData[this.currentKey]
      let chart = params.chartData
      for (let k in chart) {
        chart[k].echart.resize()
      }
      if (params.line1.length > 2) {
        chart[params.line1[0]].echart.resize()
      }
      if (params.line2.length > 2) {
        chart[params.line2[0]].echart.resize()
      }
    },
    resize() {
      this.resizeALL()
      if (
        this.paramsData[this.currentKey] &&
        this.paramsData[this.currentKey].trend &&
        this.paramsData[this.currentKey].trend.obj
      ) {
        this.paramsData[this.currentKey].trend.obj.resize()
      }
    },
    addPos(index, e) {
      const pos = JSON.parse(e.dataTransfer.getData('flag'))
      const key = `${pos.machine_id}_${pos.position_type}_${pos.position_id}`
      let params = this.paramsData[this.currentKey]
      if (
        params.line1.indexOf(key) !== -1 ||
        params.line2.indexOf(key) !== -1
      ) {
        this.$pop(this.$t('multiSpectrum.existsSpectrogram'))//已存在该测点频谱图
        return
      }
      if (pos.position_type != 3) {
        this.$pop(this.$t('multiSpectrum.posTypeLimit'))//该图谱只能拖入振动测点
        return
      }
      this.requestData.spectrum.pos.push({
        mac_id: pos.machine_id,
        pos_id: pos.position_id,
        pos_type: pos.position_type,
      })
      this.getChart(key, pos)
      this.getChartData()
    },
    // 获取趋势图数据
    getTrendData() {
      this.clickTrend = false
      this.isNewChart = true
      const params = this.paramsData[this.currentKey]
      let rd = cloneObj(this.requestData.trend)
      this.$getApi.getPositionEigenvalue(rd).then((res) => {
        if (res) {
          if (res.tendencyList.length > 0) {
            params.isTrend = true
            this.setTrend(res)
          } else {
            this.$pop(this.$t('Common8000.noTrendData'))//'无趋势数据'
          }
        }
      })
    },
    setTrend(res) {
      const params = this.paramsData[this.currentKey]
      const trend = params.trend
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
        this.resizeALL()
        params.trend.dom = this.$refs.trend[this.currentIndex]
        if (params.trend.dom) {
          this.setTrendOption(1)
        }
      })
    },
    // 趋势图Option
    // flag:1表示首次画；2表示点击修改markLine
    setTrendOption(flag) {
      let paramsData = this.paramsData[this.currentKey]
      let data = paramsData.trend
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
                  clearInterval(paramsData.time)
                  paramsData.isReal = false
                  data.chooseData = params[0]
                  this.requestData.spectrum.isReal = 0
                  this.requestData.spectrum.time = params[0].data.value[0]
                  this.requestData.spectrum.dataSource = params[0].data.type
                  this.$store.commit('setCurrentTime', params[0].data.value[0])
                  this.getChartData()
                  this.setTrendOption(2)
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
              right: 20,
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
              name:
                paramsData.pos.pos_name + this.$t('HeaderEdge.secondLevel2_3')+' (' + paramsData.unit + ')',//趋势图
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
                name: this.$t('Common8000.SimulationData'),//模拟数据
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
        data.option.series[0].markLine = {
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
        }
        data.obj.setOption(data.option)
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/style/css/inputStyle.scss';
@import '@/assets/style/css/chartsStyle.scss';
.spectrum-box {
  width: 100%;
  height: 100%;
}
.spectrum-content {
  width: 100%;
  height: calc(100% - 49px);
  display: flex;
  flex-direction: column;
  .line1,
  .line2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
    .chartbox {
      width: 100%;
      height: 100%;
    }
    div {
      &:nth-child(2) {
        margin: 0px 20px;
      }
    }
  }
  .line3 {
    height: 200px;
    .chartbox {
      width: 100%;
      height: 100%;
    }
  }
}
</style>