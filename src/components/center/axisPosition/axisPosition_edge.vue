<template>
  <div>
    <div
      class="axis-position-edge"
      v-for="(item, key) in axisPositionData"
      :key='key'
      v-show='item.isShow'
    >
      <div class="axis-position-content">
        <div
          ref="axisPositionEdge"
          class="axis-position-chart box-shadow"
          v-resize='resize'
        ></div>
        <div class="axis-position-control box-shadow">
          <ul>
            <li class="ul-head">基本信息</li>
            <li>{{item.posA.name}}安装角度（°）：{{item.posA.angle}}</li>
            <li>{{item.posB.name}}安装角度（°）：{{item.posB.angle}}</li>
            <li>
              参考点间隙电压（V）：
              <input
                class="ipt-two"
                type="text"
                v-model="item.posA.refGap"
              >
              ~
              <input
                class="ipt-two"
                type="text"
                v-model="item.posB.refGap"
              >
            </li>
            <li>
              间隙电压门限X（V）：
              <input
                class="ipt-two"
                type="text"
                v-model="item.posA.lowGap"
              >
              ~
              <input
                class="ipt-two"
                type="text"
                v-model="item.posA.highGap"
              >
            </li>
            <li>
              间隙电压门限Y（V）：
              <input
                class="ipt-two"
                type="text"
                v-model="item.posB.lowGap"
              >
              ~
              <input
                class="ipt-two"
                type="text"
                v-model="item.posB.highGap"
              >
            </li>
            <li>
              间隙电压量程X（V）：
              <input
                class="ipt-two"
                type="text"
                v-model="item.posA.rangeLowGap"
              >
              ~
              <input
                class="ipt-two"
                type="text"
                v-model="item.posA.rangeHighGap"
              >
            </li>
            <li>
              间隙电压量程Y（V）：
              <input
                class="ipt-two"
                type="text"
                v-model="item.posB.rangeLowGap"
              >
              ~
              <input
                class="ipt-two"
                type="text"
                v-model="item.posB.rangeHighGap"
              >
            </li>
          </ul>
        </div>
      </div>
      <div class='search-data'>
        <button @click="dataRetrieval">数据检索</button>
        <button @click="refreshChart">刷新图谱</button>
      </div>
    </div>
  </div>

</template>
<script>
import echarts from 'echarts'
import { cloneObj, getTime } from 'utils/utils.js'

export default {
  name: 'axisPosition',
  data() {
    return {
      axisPositionData: {},
      currentKey: '',
      currentIndex: -1,
      curAxisPosition: null, //当前对象
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'axisPosition',
    })
  },
  watch: {
    '$store.state.axisPositionMsg': {
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
      if (typeof key !== 'string') {
        return
      }
      let [, , , posId] = key.split('_')
      const keyArr = Object.keys(this.axisPositionData)
      const state = this.$store.state
      const dataType = [
        { val: '定时历史数据', isChecked: true, type: 1 },
        { val: '启停机数据', isChecked: false, type: 2 },
        { val: '报警存储数据', isChecked: false, type: 3 },
      ] //定时历史数据默认选中
      const posA = {
        id: -1,
        name: 'xxx',
        angle: 45,
        refGap: -12,
        lowGap: -14.4,
        highGap: -9.6,
        rangeLowGap: -20,
        rangeHighGap: -4,
        engineerLow: -1000,
        engineerHigh: 1000,
      } //测点A
      const posB = {
        id: -2,
        name: 'xxx',
        angle: -45,
        refGap: -12,
        lowGap: -14.4,
        highGap: -9.6,
        rangeLowGap: -20,
        rangeHighGap: -4,
        engineerLow: -1000,
        engineerHigh: 1000,
      } //测点B
      posA.ratio = this.getRatio(posA)
      posB.ratio = this.getRatio(posB)
      let requestData = null
      if (type === 0 || type === 1) {
        const params = state.srcParams
        const time = params.time
        const speed = params.speed
        const density = params.density
        requestData = {
          pos_id: posId,
          startTime: time.start,
          endTime: time.end,
          density: Number(density.type),
          fromSpeed: speed.min,
          toSpeed: speed.max,
          type: this.remoteDataType(dataType),
        }
        for (let k in this.axisPositionData) {
          this.axisPositionData[k].isShow = false
        }
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length
          this.$set(this.axisPositionData, key, {
            isShow: true,
            myChart: null, //当前图谱
            requestData,
            posA,
            posB,
            dataListA: null, //数据源A
            dataListB: null, //数据源B
            curDataList: null, //轴心位置图数据
            pos: cloneObj(
              this.$store.state.checkMsg.pos,
              true
            ) /* 选中测点信息 */,
            dataType,
          })
          this.$nextTick(() => {
            this.curAxisPosition = this.axisPositionData[key]
            this.createChart()
            this.getData()
          })
          break
        case 1 /* 切换图表 */:
          this.curAxisPosition = this.axisPositionData[key]
          this.currentIndex = keyArr.indexOf(key)
          this.axisPositionData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.axisPositionData, key)
          break
      }
    },
    getRatio(pos) {
      const mToD = 10 //1道等于10微米
      const { rangeLowGap, rangeHighGap, engineerLow, engineerHigh } = pos
      const rangeAverGap = (rangeHighGap - rangeLowGap) / 2
      const engineerAver = (engineerHigh - engineerLow) / 2
      const ratioA =
        (engineerHigh - engineerLow) / (rangeHighGap - rangeLowGap) / mToD
      const ratioB = -1 * ratioA * rangeAverGap + engineerAver / mToD
      return {
        ratioA,
        ratioB,
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
    createChart() {
      const dom = this.$refs.axisPositionEdge[this.currentIndex]
      const that = this
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            axis: 'x',
            label: {
              color: '#F3F3F3',
            },
            crossStyle: {
              type: 'solid',
            },
          },
          formatter: (params) => {
            const { data, dataIndex } = params[0]
            return that.getToolTip(data, dataIndex)
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
        xAxis: {
          // min: -8,
          // max: 8,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
              opacity: 0.2,
            },
          },
          axisLabel: {
            color: '#F3F3F3',
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
            onZero: false,
          },
          name: '道',
          nameTextStyle: {
            fontSize: 16,
            align: 'left',
            color: '#ffffff',
          },
        },
        yAxis: {
          // min: -8,
          // max: 8,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dotted',
              opacity: 0.2,
            },
          },
          axisLabel: {
            color: '#F3F3F3',
          },
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
            onZero: false,
          },
          nameTextStyle: {
            fontSize: 16,
            align: 'left',
            color: '#ffffff',
          },
          name: '道',
        },
        series: [
          {
            id: 'a',
            type: 'line',
            data: [],
            showSymbol: false,
            lineStyle: {
              width: 1,
              color: '#ff4d4f',
            },
          },
        ],
      }
      this.curAxisPosition.myChart = this.initChart(dom, option)
    },
    initChart(dom, option) {
      const myChart = echarts.init(dom)
      myChart.setOption(option)
      return myChart
    },
    showProgress(isShow) {
      this.$emit('loadingImg', isShow)
    },
    getData() {
      this.showProgress(true)
      this.$getApi
        .getAxisLocation(this.curAxisPosition.requestData)
        .then((res) => {
          this.showProgress(false)
          if (res && res.msg === 0 && res.list != null && res.list.length > 0) {
            const result = res.list
            const { myChart, posA, posB } = this.curAxisPosition
            posA.id = result[0].config.id
            posA.name = result[0].config.name
            posA.angle = result[0].config.orient_degree
            posB.id = result[1].config.id
            posB.name = result[1].config.name
            posB.angle = result[1].config.orient_degree
            const dataListA = result[0].list
            const dataListB = result[1].list
            const curDataList = this.getCurDataList(
              posA,
              posB,
              dataListA,
              dataListB
            )

            const option = myChart.getOption()
            option.series[0].data = curDataList
            myChart.setOption(option)

            Object.assign(this.curAxisPosition, {
              dataListA,
              dataListB,
              curDataList,
            })
          }
        })
    },
    getCurDataList(posA, posB, dataListA, dataListB) {
      const curDataList = []
      let len = Math.min(dataListA.length, dataListB.length)
      for (let i = 0; i < len; i++) {
        let a1 =
          -1 *
          Math.sin((posA.angle * Math.PI) / 180) *
          this.translateVToD(dataListA[i].gap, posA)
        let b1 =
          Math.cos((posA.angle * Math.PI) / 180) *
          this.translateVToD(dataListA[i].gap, posA)
        let a2 =
          -1 *
          Math.sin((posB.angle * Math.PI) / 180) *
          this.translateVToD(dataListB[i].gap, posB)
        let b2 =
          Math.cos((posB.angle * Math.PI) / 180) *
          this.translateVToD(dataListB[i].gap, posB)
        curDataList.push([a1 + a2, b1 + b2])
      }
      return curDataList
    },
    translateVToD(v, pos) {
      const { ratioA, ratioB } = pos.ratio
      return ratioA * v + ratioB
    },
    getToolTip(data, dataIndex) {
      const dataA = this.curAxisPosition.dataListA[dataIndex]
      const dataB = this.curAxisPosition.dataListB[dataIndex]
      return `点序：${dataIndex + 1}<br>
              时间：${getTime(dataA.time)}<br>
              转速（rpm）：${dataA.speed}<br>
              间隙电压（V）：(${dataA.gap.toFixed(1)}, ${dataB.gap.toFixed(
        1
      )})<br>
              光标（道）：(${data[0].toFixed(2)}, ${data[1].toFixed(2)})<br>`
    },
    // 事件
    dataRetrieval() {
      let params = this.curAxisPosition
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
          dataType.splice(0, dataType.length, ...res.dataType)
          requestData.startTime = res.startTime
          requestData.endTime = res.endTime
          requestData.density = Number(res.density.type)
          requestData.fromSpeed = res.minSpeed
          requestData.toSpeed = res.maxSpeed
          requestData.type = this.remoteDataType(dataType)
          this.getData()
        }
      })
    },
    refreshChart() {
      this.$emit('loadingImg', true)

      const { myChart, posA, posB, dataListA, dataListB } = this.curAxisPosition
      posA.ratio = this.getRatio(posA)
      posB.ratio = this.getRatio(posB)
      const curDataList = this.getCurDataList(posA, posB, dataListA, dataListB)

      const option = myChart.getOption()
      option.series[0].data = curDataList
      myChart.setOption(option)

      Object.assign(this.curAxisPosition, {
        curDataList,
      })
    },
    resize() {
      if (this.curAxisPosition && this.curAxisPosition.myChart) {
        this.curAxisPosition.myChart.resize()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// @import '@/assets/style/css/chartsStyle.scss';
.axis-position-edge {
  height: 100%;
  width: 100%;
  // display: flex;
  .axis-position-content {
    height: calc(100% - 49px);
    display: flex;
    .axis-position-chart {
      flex: 2.7;
      margin-right: 20px;
    }
    .axis-position-control {
      margin-right: 20px;
      flex: 1.1;
      ul {
        font-size: 14px;

        margin-bottom: 30px;
        padding: 10px;

        .ul-head {
          font-size: 16px;
          font-weight: bold;
        }
        li {
          margin: 5px 0px;

          .ipt-two {
            width: 60px;
          }
        }
      }
    }
    .index-list {
      flex: 1.2;
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    width: 100%;
    text-align: center;
    button {
      height: 30px;
      width: 100px;
    }
  }
}
</style>