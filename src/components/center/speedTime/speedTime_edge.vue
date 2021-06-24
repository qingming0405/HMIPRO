<template>
  <div>
    <div
      class="rotationTime"
      v-for="(data,key) in paramsData"
      v-show="data.isShow"
    >
      <div class="rotationTimeContentShell">
        <div
          class="rotationTimeContent box-shadow"
          v-resize='resize'
        >
          <div id="rotationTime"></div>
        </div>
        <s-s-index
          v-show="data.timeData.length > 0"
          class="my-time-table"
          :data-list="data.timeData"
          @ss-select="ssSelect"
        />
      </div>
      <div class="search-data">
        <!-- <button
          :class="data.isReal ? '' : 'disable-btn'"
          @click="setrealData"
        >实时数据</button> -->
        <button @click="dataRetrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { cloneObj, getTime, getUnit } from 'utils/utils.js'
import SSIndex from 'common/startStop/SSIndex.vue'
export default {
  name: 'speedTime',
  data() {
    return {
      // 图表字体大小 默认14
      chartsFontSize: 14,
      // 图表左右间距
      chartLeftAndRightSpacing: [30, 80],
      generateSpuriousList: [],
      timer: null, //定时器
      paramsData: {},
    }
  },
  components: { SSIndex },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'speedTime',
    })
  },
  mounted() {
    this.generateSpuriousData()
    this.drawLineCharts()
  },
  watch: {
    '$store.state.speedTimeMsg': {
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
          this.$set(this.paramsData, key, {
            isShow: true,
            pos,
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: this.$t('Common.noDataText'),//无数据
            },
            timeData: [],
            isReal: false, //实时数据是否开启
            time: null, //定时器
            chartData: {
              chartObj: null, //echarts对象
              data: [],
              unitY: getUnit(1000, pos),
            },
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
    generateSpuriousData() {
      for (let i = 0; i <= 200; i++) {
        this.generateSpuriousList.push([i, Math.random() * 12])
      }
    },
    drawLineCharts() {
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      params.chartData.chartObj = echarts.init(
        document.getElementById('rotationTime')
      )
      let chartObj = params.chartData.chartObj
      var data = chartData.data
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0]
            return this.$t('Common.time')+'：' + params.name + '</br>' + this.$t('eigenvalue.speed')+'：' + params.value[1]
          },
          axisPointer: {
            animation: false,
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
          type: 'value',
          boundaryGap: [0, '100%'],
          name: params.pos.pos_name + ' (' + chartData.unitY + ')',
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
            name: this.$t('Common8000.SimulationData'),//模拟数据
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data,
            // lineStyle: {
            //   width: 1
            // }
          },
        ],
      }
      clearInterval(this.timer)
      // this.timer = setInterval(() => {
      //   for (var i = 0; i < 5; i++) {
      //     data.shift()
      //     data.push(randomData())
      //   }

      //   chartObj.setOption({
      //     series: [
      //       {
      //         data: data,
      //       },
      //     ],
      //   })
      // }, 3000)
      chartObj.setOption(option)
      window.addEventListener('resize', () => {
        chartObj.resize()
      })
    },
    dataRetrieval() {
      let params = this.paramsData[this.currentKey]
      let timeData = params.timeData
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
        this.getTimeData(this.requestData.time)
        this.$nextTick(() => {
          this.drawLineCharts()
        })
      })
    },
    ssSelect(item) {
      const requestData = this.requestData.data
      requestData.startTime = item.startTime
      requestData.endTime = item.stopTime
      // 实时数据按钮
      const params = this.paramsData[this.currentKey]
      params.isReal = false
      this.getData(this.requestData.data)
    },
    // 设置
    setrealData() {
      // const params = this.paramsData[this.currentKey]
      // params.isReal = !params.isReal
      // const rd = this.requestData.data
      // if (params.isReal) {
      //   let flag = false
      //   for (let i = 0; i < params.timeData.length; i++) {
      //     let time = params.timeData[i]
      //     // 状态为9时则为启停中状态，取该状态下的开始时间与当前时间请求实时数据
      //     if (time.type == 9) {
      //       rd.startTime = item.startTime
      //       rd.endTime = new Date().getTime()
      //       flag = true
      //       break
      //     }
      //   }
      //   // 若存在启停中状态请求请求实时数据
      //   if (flag) {
      //     let fn = () => {
      //       this.getData(rd)
      //       return fn
      //     }
      //     params.time = setInterval(fn(), 2000)
      //   } else {
      //     this.$pop('等待启停机')
      //     clearInterval(params.time)
      //     params.isReal = false
      //   }
      // } else {
      //   clearInterval(params.time)
      // }
    },
    getData(requestData) {
      this.$getApi.getSaveData(requestData).then((res) => {
        if (res) {
          if (res.list.length > 0) {
            this.setData(res)
            this.paramsData[this.currentKey].empty.isShow = false
          } else {
            this.$pop(this.$t('Common8000.NoStartStopData'))//无启停数据！
          }
        }
      })
    },
    setData(res) {
      const list = res.list
      let data = []
      for (let i = 0; i < list.length; i++) {
        let value = res.list[i]
        let item = {
          name: '',
          value: [],
        }
        for (let k in value) {
          if (k === 'time') {
            let val = getTime(value[k])
            item.name = val
            item.value.push(value[k])
          }
        }
        for (let k in value) {
          if (k === 'speed') {
            item.value.push(value[k])
          }
        }
        data.push(item)
      }
      this.paramsData[this.currentKey].chartData.data = data
      this.$nextTick(() => {
        this.drawLineCharts()
      })
    },
    getTimeData(requestData) {
      const params = this.paramsData[this.currentKey]
      this.$getApi.getOnOffIndex(requestData).then((res) => {
        if (res) {
          params.timeData = []
          if (res.list.length > 0) {
            params.timeData = res.list
            this.paramsData[this.currentKey].empty.isShow = false
            this.ssSelect(params.timeData[0])
          } else {
            this.$pop(this.$t('Common8000.noStartStopTimeData'))//无启停机数据
          }
          this.$nextTick(() => {
            if (params.chartData.chartObj) {
              params.chartData.chartObj.resize()
            }
          })
        }
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
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timer !== null) {
      clearInterval(this.timer)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/css/inputStyle.scss';
@import '@/assets/style/css/chartsStyle.scss';
</style>