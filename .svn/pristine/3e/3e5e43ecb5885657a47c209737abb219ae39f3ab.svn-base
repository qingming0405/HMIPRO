<template>
  <div class="box-shadow">
    <div
      v-for="(chart, key) in chartData"
      :key="key"
      v-show="chart.isShow"
      class="polarDiagram-content"
    >
      <div
        class="polarDiagram-content-flex"
        v-resize='resizeAllCharts'
        @drop="dropPos($event)"
        @dragover.prevent
      >
        <div
          v-for="(item, k) in chart.chartList"
          :key="k"
          :class="item.key"
          class="polarDiagram-content-flex-item"
          @contextmenu.prevent="contextmenu($event, k)"
        ></div>
      </div>
      <div class="search-data">
        <button @click="dataRetrieval">数据检索</button>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { cloneObj, getUnit } from 'utils/utils.js'

export default {
  name: 'polarDiagram',
  data() {
    return {
      currentKey: null,
      chartData: {},
    }
  },
  watch: {
    '$store.state.polarDiagramMsg': {
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
      keepAlive: 'polarDiagram',
    })
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      const [, , macId, posId, posType] = key.split('_')
      let pos = null
      let requestData = null
      const dataType = [
        { val: '定时历史数据', isChecked: true, type: 1 },
        { val: '启停机数据', isChecked: false, type: 2 },
        { val: '报警存储数据', isChecked: false, type: 3 },
      ] //定时历史数据默认选中
      if (type === 0 || type === 1) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
        const params = this.$store.state.srcParams
        const time = params.time
        const speed = params.speed
        const density = params.density /* 趋势数据查询密度 */
        requestData = {
          pos: [
            // {
            //   mac_id: macId,
            //   pos_id: posId,
            //   pos_type: posType,
            // },
          ],
          startTime: time.start,
          endTime: time.end,
          density: Number(density.type),
          fromSpeed: speed.min,
          toSpeed: speed.max,
          type: this.remoteDataType(dataType),
        }
        for (let k in this.paramsData) {
          this.paramsData[k].isShow = false
        }
        this.currentKey = key
      } else {
        pos = this.paramsData[key].pos
      }
      if (type == 0) {
        //添加数据
        this.$set(this.chartData, key, {
          isShow: true,
          pos,
          type: 1, //1=1倍频 2=2倍频
          chartList: {}, //可以添加多个测点的数据
          echartIns: {}, //测点对应的图谱
          requestData,
          dataType,
          empty: {
            isShow: false,
            text: '无数据',
          },
        })
        this.addOrDelPos('add', `${macId}_${posType}_${posId}`, {
          mac_id: macId,
          pos_type: posType,
          pos_id: posId,
          pos_name: pos.position_name,
        })
      } else if (type == 1) {
        //切换
        this.chartData[key].isShow = true
      } else if (type == 2) {
        //删除
        this.$delete(this.chartData, key)
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
    /* 添加测点 */
    addOrDelPos(type, key, posInfo) {
      let chartData = this.chartData[this.currentKey]
      let chartList = chartData.chartList
      if (type === 'add') {
        /* 添加测点 */
        chartData.requestData.pos.push({
          mac_id: posInfo.mac_id,
          pos_id: posInfo.pos_id,
          pos_type: posInfo.pos_type,
        })
        posInfo.key = key
        this.$set(chartList, key, posInfo)
      } else if (type === 'del') {
        chartData.requestData.pos = this.deletedRequestPos(
          chartData.requestData.pos,
          key
        )
        this.$delete(chartList, key)
        /* 销毁实例 */
        chartData.echartIns[key].dispose()
        this.$delete(chartData.echartIns, key)
      }

      this.$nextTick(() => {
        const keys = Object.keys(chartList)
        const row = Math.ceil(keys.length / 3)
        const column = keys.length < 3 ? keys.length : 3
        //配置宽高，按最多3列
        const dWidth = 100 / column + '%'
        const dHeight = 100 / row + '%'
        keys.forEach((key) => {
          let dom = document.getElementsByClassName(key)[0]
          dom.style.width = dWidth
          dom.style.height = dHeight
        })
        if (type === 'add') {
          this.createChart(key)
          this.getAllData()
        }
        /* 刷新所有图谱 */
        this.resizeAllCharts()
      })
    },
    //返回删除测点后的数组
    deletedRequestPos(list, key) {
      const keyArr = key.split('_')
      const [mac_id, pos_type, pos_id] = keyArr
      return list.filter((item) => {
        if (
          item.mac_id === mac_id &&
          item.pos_type === pos_type &&
          item.pos_id === pos_id
        ) {
          return false
        }
        return true
      })
    },
    //创建一个新图
    createChart(key) {
      /* 添加测点 和刷新所有的数据 */
      let chartList = this.chartData[this.currentKey].chartList
      /* 画最后一个，新添加的图谱 */
      let dom = document.getElementsByClassName(`${chartList[key].key}`)[0]

      /* 组合echart配置 */
      let option = {
        title: {
          text: '',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 15,
          },
          left: 'center',
        },
        polar: {},
        /* 缩放 */
        dataZoom: {
          type: 'inside',
          // angleAxisIndex: 0,
          radiusAxisIndex: 0,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              color: 'black',
            },
          },
          formatter: function (params) {
            return `值：${params[0].data[0]}<br/>
                   ∠：${params[0].data[1]}<br/> `
          },
        },
        angleAxis: {
          type: 'value',
          startAngle: 135,
          min: 0,
          max: 360,
          interval: 90,
          axisLine: {
            // show:false,
            //坐标轴轴线设置
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            // margin: 15,
            formatter: function (value) {
              return '∠ ' + value + '°'
            },
          },
        },
        radiusAxis: {
          splitLine: {
            lineStyle: {
              color: '#fff',
              type: 'dotted',
            },
          },
          axisLine: {
            //坐标轴轴线设置
            lineStyle: {
              color: '#f0f5ff',
            },
          },
        },
        series: [
          {
            coordinateSystem: 'polar',
            type: 'line',
            data: [],
          },
        ],
      }
      let echart = echarts.init(dom)
      echart.setOption(option)
      /* 自动缩放 */
      window.addEventListener('resize', () => {
        echart.resize()
      })
      this.chartData[this.currentKey].echartIns[key] = echart
    },
    //获取所有数据
    getAllData() {
      const { chartList } = this.chartData[this.currentKey]
      const rd = this.chartData[this.currentKey].requestData
      this.$getApi.getPolarCoordinates(rd).then((res) => {
        if (res && res.data) {
          for (let key in chartList) {
            if (res.data[key]) {
              chartList[key].dataList = res.data[key]
            } else {
              chartList[key].dataList = []
            }
          }
          this.setAllData()
        }
      })
    },
    setAllData() {
      const { type, chartList, echartIns } = this.chartData[this.currentKey]
      let tData
      let list = null
      let len = -1
      let option
      for (let key in chartList) {
        list = chartList[key].dataList
        len = list.length
        tData = []
        for (let i = 0; i < len; i++) {
          tData.push(this.getDataByType(list[i], type))
        }

        option = {
          title: {
            text: chartList[key].pos_name,
          },
          series: [
            {
              data: tData,
            },
          ],
        }
        echartIns[key].setOption(option)
      }
    },
    getDataByType(item, type) {
      if (type == 2) {
        return [item.v2x, item.p2x, item.speed]
      }
      return [item.v1x, item.p1x, item.speed]
    },
    /**事件 */
    /* 拖入测点 */
    dropPos(e) {
      const posMsg = JSON.parse(e.dataTransfer.getData('flag'))
      let key = `${posMsg.mac_id}_${posMsg.position_type}_${posMsg.position_id}`
      let { chartList } = this.chartData[this.currentKey]
      if (chartList[key]) {
        this.$pop('已经存在该测点')
        return
      } else if (Object.keys(chartList).length === 6) {
        this.$pop('最多添加6个测点')
      } else {
        this.addOrDelPos('add', key, {
          mac_id: posMsg.mac_id,
          pos_type: posMsg.pos_type,
          pos_id: posMsg.pos_id,
          pos_name: posMsg.position_name,
        })
      }
    },
    /* 刷新所有图谱 */
    resizeAllCharts() {
      for (let key in this.chartData[this.currentKey].echartIns) {
        this.chartData[this.currentKey].echartIns[key].resize()
      }
    },
    /* 删除图谱 */
    //右键删除测点
    contextmenu(e, key) {
      let text = [
        { type: '1x', val: '1x幅值' },
        { type: '2x', val: '2x幅值' },
        { type: 'del', val: '删除' },
      ]
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `100px`,
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
        },
      }).then((res) => {
        if (res.item) {
          switch (res.item.type) {
            case '1x':
              this.chartData[this.currentKey].type = 1
              this.setAllData()
              break
            case '2x':
              this.chartData[this.currentKey].type = 2
              this.setAllData()
              break
            default:
              this.addOrDelPos('del', key)
          }
        }
      })
    },
    /* 数据检索 */
    dataRetrieval() {
      const { dataType, requestData } = this.chartData[this.currentKey]
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
          this.getAllData()
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.polarDiagram-content {
  height: 100%;
  width: 100%;
  position: relative;
  .polarDiagram-content-flex {
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 49px);
    width: 100%;
    .polarDiagram-content-flex-item {
      width: 50%;
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
