<template>
  <div class="">
    <div
      class="bodeChartsContentShell"
      v-for="(data,key) in paramsData"
      v-show="data.isShow"
    >
      <div id="needToBeSaved">
        <div
          :class="data.timeData.length > 0 ? 'bodeChartsContent-1':'bodeChartsContent'"
          v-resize='resize'
        >
          <div
            id="bodeCharts"
            class="box-shadow"
          ></div>
          <div
            id="bodeChartsTwo"
            class="box-shadow"
          ></div>
        </div>
        <s-s-index
          v-show="data.timeData.length > 0"
          class="my-time-table"
          :data-list="data.timeData"
          @ss-select="ssSelect"
        />
      </div>
      <div class="search-data">
        <button @click="dataRetrieval">数据检索</button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { cloneObj, getCodeObj, getUnit } from 'utils/utils.js'
import SSIndex from 'common/startStop/SSIndex.vue'
export default {
  name: 'bode',
  components: { SSIndex },
  data() {
    return {
      // 图表字体大小 默认14
      chartsFontSize: 14,
      paramsData: {},
      chartSpacingArray: [40, 20, 40, 80],
      requestData: {
        time: {},
        data: {},
      },
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'bode',
    })
  },
  watch: {
    '$store.state.bodeMsg': {
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
      const speed = params.speed
      const density = params.density /* 趋势数据查询密度 */
      this.requestData = {
        time: { pos_id: pos.pos_id, startTime: time.start, endTime: time.end },
        data: {
          machineId: mId,
          positionId: id,
          positionType: pType,
          type: 0,
          t_root: pos.t_root,
          density: Number(density.type),
          toSpeed: speed.max,
          fromSpeed: speed.min,
          startTime: null,
          endTime: null,
          dgmType: pos.dgm_type,
          dataType: [2],
          page: -1,
          pageNum: -1,
        },
      }
      switch (type) {
        case 0 /* 打开图表 */:
          let eigenvalueData = [
            { filed: 'direc', name: '通频值', code: 57014 },
            { filed: 'v1x', name: '1x幅值', code: 57017 },
            { filed: 'v2x', name: '2x幅值', code: 57018 },
            { filed: 'v3x', name: '0.5x幅值', code: 57019 },
            { filed: 'rv', name: '残余量', code: 57012 },
            { filed: 'opt_freq_hi_1', name: '可选频段高1', code: 57022 },
            { filed: 'opt_freq_hi_2', name: '可选频段高2', code: 57023 },
          ]
          eigenvalueData.forEach((element) => {
            element.val = element.name
          })
          const eigenvalue = eigenvalueData[0]
          this.$set(this.paramsData, key, {
            isShow: true,
            pos,
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: `无数据`,
            },
            timeData: [],
            eigenvalueData,
            eigenvalue,
            chartData: {
              chartObj1: null,
              chartObj2: null,
              code1: { filed: 'direc', name: '通频值', code: 57014 },
              code2: { filed: '', name: '', code: -1 },
              data1: [],
              data2: [],
            },
          })
          this.getTimeData(this.requestData.time)
          this.$nextTick(() => {
            this.drawLineCharts()
            this.drawLineChartsTwo()
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
      let paramsData = this.paramsData[this.currentKey]
      let chartData = paramsData.chartData
      if (chartData.chartObj1 == null) {
        chartData.chartObj1 = echarts.init(
          document.getElementById('bodeCharts')
        )
      }
      let data = chartData.data1
      // 第一张
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            // item = params[0]
            // chartData.chartObj2.dispatchAction({
            //   type: 'showTip',
            //   seriesIndex: 0,
            //   dataIndex: item.dataIndex,
            // })
            let value = ''
            if (params instanceof Array) {
              params.forEach((el, idx) => {
                // if(value == null )
                value =
                  value +
                  '转速：' +
                  el.value[0] +
                  '</br>' +
                  '幅值：' +
                  el.value[1] +
                  '</br>'
              })
            } else {
              value =
                '转速：' +
                params.value[0] +
                '</br>' +
                '幅值：' +
                params.value[1]
            }
            return value
          },
          triggerOn: 'click',
        },
        xAxis: {
          name: '转速(rpm)',
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
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
          },
          axisLabel: {
            color: '#F3F3F3',
          },
        },
        grid: {
          top: this.chartSpacingArray[0],
          bottom: this.chartSpacingArray[1],
          left: this.chartSpacingArray[2],
          right: this.chartSpacingArray[3],
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
            type: 'slider',
            yAxisIndex: 0,
            width: 15,
            filterMode: 'filter',
            textStyle: {
              color: '#fff',
            },
            borderColor: '#90979c',
            right: this.datazoomSpacing,
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
          type: 'value',
          boundaryGap: [0, '100%'],
          name:
            paramsData.pos.pos_name +
            ' ' +
            chartData.code1.name +
            '(' +
            getUnit(chartData.code1.code, paramsData.pos) +
            ')',
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
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data,
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
      chartData.chartObj1.setOption(option)
      chartData.chartObj1.on('globalout', (params) => {
        this.$nextTick(() => {
          chartData.chartObj2.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: -9999999,
          })
        })
      })
      window.addEventListener('resize', () => {
        chartData.chartObj1.resize()
      })
    },
    drawLineChartsTwo() {
      let paramsData = this.paramsData[this.currentKey]
      let chartData = paramsData.chartData
      if (chartData.chartObj2 == null) {
        chartData.chartObj2 = echarts.init(
          document.getElementById('bodeChartsTwo')
        )
      }
      let data = chartData.data2

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            // params = params[0]
            // chartData.chartObj1.dispatchAction({
            //   type: 'showTip',
            //   seriesIndex: 0,
            //   dataIndex: params.dataIndex,
            // })
            let value = ''
            if (params instanceof Array) {
              params.forEach((el) => {
                value =
                  value +
                  '转速：' +
                  el.value[0] +
                  '</br>' +
                  '幅值：' +
                  el.value[1] +
                  '</br>'
              })
            } else {
              value =
                '转速：' +
                params.value[0] +
                '</br>' +
                '幅值：' +
                params.value[1]
            }
            return value
          },
          axisPointer: {
            animation: false,
          },
          triggerOn: 'click',
        },
        xAxis: {
          name: '转速(rpm)',
          nameTextStyle: {
            fontSize: this.chartsFontSize,
            align: 'left',
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
          },
          axisLabel: {
            color: '#F3F3F3',
          },
        },
        grid: {
          top: this.chartSpacingArray[0],
          bottom: this.chartSpacingArray[1],
          left: this.chartSpacingArray[2],
          right: this.chartSpacingArray[3],
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'filter',
            height: 15,
            bottom: this.datazoomSpacing,
            borderColor: '#90979c',
            show: false,
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            width: 15,
            filterMode: 'filter',
            right: this.datazoomSpacing,
            borderColor: '#90979c',
            show: false,
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'filter',
            textStyle: {
              color: '#fff',
            },
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'filter',
            textStyle: {
              color: '#fff',
            },
          },
        ],
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          name: chartData.code2.name
            ? paramsData.pos.pos_name +
              ' ' +
              chartData.code2.name +
              '(' +
              getUnit(chartData.code2.code, paramsData.pos) +
              ')'
            : paramsData.pos.pos_name + ' ' + chartData.code2.name + '',
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
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data,
            color: ['#ffc53d'],
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
      chartData.chartObj2.setOption(option)
      chartData.chartObj2.on('globalout', (params) => {
        this.$nextTick(() => {
          chartData.chartObj1.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: -9999999,
          })
        })
      })
      window.addEventListener('resize', () => {
        chartData.chartObj2.resize()
      })
    },
    resize() {
      if (
        this.paramsData &&
        this.paramsData[this.currentKey] &&
        this.paramsData[this.currentKey].chartData
      ) {
        let chart = this.paramsData[this.currentKey].chartData
        if (chart.chartObj2) {
          chart.chartObj2.resize()
        }
        if (chart.chartObj1) {
          chart.chartObj1.resize()
        }
      }
    },
    dataRetrieval() {
      let params = this.paramsData[this.currentKey]
      let timeData = params.timeData
      const eigenvalueData = params.eigenvalueData
      let viewMsg = {
        eigenvalueData,
        eigenvalue: params.eigenvalue,
      }
      this.$retrieval({
        key: 'bode',
        viewMsg,
      }).then((res) => {
        params.eigenvalue = res.eigenvalue
        params.chartData.code1 = res.eigenvalue
        params.chartData.code2 = this.getCode(res.eigenvalue)
        let requestData = this.requestData
        requestData.time.startTime = res.startTime
        requestData.time.endTime = res.endTime
        this.getTimeData(requestData.time)
        if (requestData.data.startTime !== null) {
          this.getData(requestData.data)
        }
      })
    },
    // 获取code2
    getCode(type) {
      switch (type.filed) {
        case 'v1x':
          return { filed: 'p1x', name: '1x相位', code: 57015 }
        case 'v2x':
          return { filed: 'p2x', name: '2x相位', code: 57016 }
        default:
          return { filed: '', name: '', code: -1 }
      }
    },
    ssSelect(item) {
      const requestData = this.requestData.data
      requestData.startTime = item.startTime
      requestData.endTime = item.stopTime
      this.getData(this.requestData.data)
    },
    getData(requestData) {
      this.$getApi.getSaveData(requestData).then((res) => {
        if (res) {
          if (res.list.length > 0) {
            this.setData(res)
          }
        }
      })
    },
    setData(res) {
      const list = res.list
      const params = this.paramsData[this.currentKey]
      let data1 = []
      let data2 = []
      for (let i = 0; i < res.list.length; i++) {
        let value = res.list[i]
        let item1 = {
          name: '',
          value: [],
        }
        let item2 = {
          name: '',
          value: [],
        }
        for (let k in value) {
          if (k === 'speed') {
            item1.name = value[k]
            item1.value.push(value[k])
            item2.name = value[k]
            item2.value.push(value[k])
          }
        }
        for (let k in value) {
          if (k === params.chartData.code1.filed) {
            item1.value.push(value[k])
          }
          if (k === params.chartData.code2.filed) {
            item2.value.push(value[k])
          }
        }
        data1.push(item1)
        data2.push(item2)
      }
      params.chartData.data1 = data1
      params.chartData.data2 = data2
      this.$nextTick(() => {
        this.drawLineCharts()
        this.drawLineChartsTwo()
      })
    },
    getTimeData(requestData) {
      const params = this.paramsData[this.currentKey]
      this.$getApi.getOnOffIndex(requestData).then((res) => {
        if (res) {
          params.timeData = []
          this.$nextTick(() => {
            params.chartData.chartObj1.resize()
            params.chartData.chartObj2.resize()
          })
          if (res.list.length > 0) {
            params.timeData = res.list
            this.ssSelect(params.timeData[0])
          } else {
            this.$pop('无启停数据！')
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
</style>