<template>
  <div>
    <div class="content-edge center">
      <div
        class="diagnosis-edge"
        v-for="(item,key) in paramsData"
      >
        <div
          class="diagnosis-chart"
          :id='"diagnosis_chart_"+key'
        ></div>
        <div
          class="none-data-box select-none radius"
          v-show="item.empty.isShow"
        >
          <div>{{ item.empty.text }}</div>
        </div>
      </div>
      <div class="search-data">
        <button @click="dataRetrieval">数据检索</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getTime, cloneObj } from 'utils/utils.js'
import echarts from 'echarts'
export default {
  name: 'diagnosisTrend',
  data() {
    return {
      paramsData: {},
      currentKey: '' /* 当前显示数据下标 */,
    }
  },
  watch: {
    '$store.state.diagnosisTrendMsg': {
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
    openChartList(key, state) {
      //处理图谱的实例显示或删除 //state 0:增加。1:切换，2:删除，3:删除+切换
      if (typeof key !== 'string') return
      if (state === 0 || state === 1) {
        this.currentKey = key
        for (let k in this.chartData) {
          this.paramsData[k].isShow = false
        }
      }
      switch (state) {
        case 0:
          let [, , macId] = key.split('_')
          let mac = cloneObj(this.$store.state.checkMsg.mac)
          this.$set(this.paramsData, key, {
            isShow: true,
            macId,
            mac,
            chartData: {},
            startTime: this.$store.state.srcParams.time.start,
            endTime: this.$store.state.srcParams.time.end,
            empty: {
              isShow: true,
              text: '无数据',
            },
          })
          let requestData = {
            mac_id: macId,
            startTime: this.$store.state.srcParams.time.start,
            endTime: this.$store.state.srcParams.time.end,
          }
          this.$nextTick(() => {
            this.initChart()
          })
          this.getData(requestData)
          break
        case 1:
          this.paramsData[key].isShow = true
          break
        case 2:
          delete this.paramsData[key]
          break
      }
    },
    getData(requestData) {
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      /* 加载动画 */
      this.$emit('loadingImg', true)
      this.$getApi.queryFaultTypeByMacId(requestData).then((res) => {
        /* 关闭动画 */
        this.$emit('loadingImg', false)
        if (res) {
          chartData.data = {}
          if (res.data && res.data.length > 0) {
            params.empty.isShow = false
            this.setData(res.data)
          }
        }
      })
    },
    setData(data) {
      const chartData = this.paramsData[this.currentKey].chartData
      let dataX = []
      let dataY = []
      let dataAll = []
      let dataDiagnosis = {}
      data.forEach((el) => {
        let diagnosis = []
        if (el.fault_type) {
          el.fault_type = el.fault_type.replace(/\s+/g, '') //去除所有空格
          let fault = [
            {
              '[5]': '主轴前轴承外圈故障',
              '[6]': '主轴前轴承内圈故障',
              '[7]': '主轴前轴承滚动体故障',
              '[8]': '主轴前轴承保持架故障',
              '[1,2,3,4]': '主轴前轴承跑圈',
              '[0,9]': '主轴前轴承松动',
              '[10]': '电气故障',
              '[0]': '气动不平衡',
            },
            {
              '[5]': '主轴后轴承外圈故障',
              '[6]': '主轴后轴承内圈故障',
              '[7]': '主轴后轴承滚动体故障',
              '[8]': '主轴后轴承保持架故障',
              '[1,2,3,4]': '主轴后轴承跑圈',
              '[0,9]': '主轴后轴承松动',
              '[10]': '电气故障',
              '[0]': '气动不平衡',
            },
            {
              '[5]': '行星架叶轮侧轴承外圈故障',
              '[6]': '行星架叶轮侧轴承内圈故障',
              '[7]': '行星架叶轮侧轴承滚动体故障',
              '[8]': '行星架叶轮侧轴承保持架故障',
              '[9]': '行星架电机侧轴承内圈故障',
              '[10]': '行星架电机侧轴承滚动体故障',
              '[11]': '行星架电机侧轴承滚动体故障',
              '[12]': '行星架电机侧轴承保持架故障',
              '[1,2,3,4]': '齿轮箱输入轴轴承跑圈',
              '[0,13]': '齿轮箱输入轴轴承松动',
              '[14]': '电气故障',
            },
            {
              '[10]': '低速轴叶轮侧轴承外圈故障',
              '[11]': '低速轴叶轮侧轴承内圈故障',
              '[12]': '低速轴叶轮侧轴承滚动体故障',
              '[13]': '低速轴叶轮侧轴承保持架故障',
              '[14]': '低速轴电机侧轴承外圈故障',
              '[15]': '低速轴电机侧轴承内圈故障',
              '[16]': '低速轴电机侧轴承滚动体故障',
              '[17]': '低速轴电机侧轴承保持架故障',
              '[18]': '滑环轴承外圈故障',
              '[19]': '滑环轴承内圈故障',
              '[20]': '滑环轴承滚动体故障',
              '[21]': '滑环轴承保持架故障',
              '[5,24]': '太阳轮故障',
              '[7,26]': '行星轮故障',
              '[6,25]': '内齿圈故障',
              '[8,9]': '行星级齿轮啮合不良',
              '[1,2,3,4]': '齿轮箱低速轴轴承跑圈',
              '[0,22]': '齿轮箱低速轴轴承松动',
              '[27]': '电气故障',
            },
            {
              '[7]': '中间轴叶轮侧轴承外圈故障',
              '[8]': '中间轴叶轮侧轴承内圈故障',
              '[9]': '中间轴叶轮侧轴承滚动体故障',
              '[10]': '中间轴叶轮侧轴承保持架故障',
              '[11]': '中间轴电机侧轴承1外圈故障',
              '[12]': '中间轴电机侧轴承1内圈故障',
              '[13]': '中间轴电机侧轴承1滚动体故障',
              '[14]': '中间轴电机侧轴承1保持架故障',
              '[15]': '中间轴电机侧轴承2外圈故障',
              '[16]': '中间轴电机侧轴承2内圈故障',
              '[17]': '中间轴电机侧轴承2滚动体故障',
              '[18]': '中间轴电机侧轴承2保持架故障',
              '[19]': '中间轴小齿轮啮合不良或大齿轮断齿',
              '[5,6]': '中间级齿轮不对中（偏载）',
              '[20]': '小齿轮断齿',
              '[8,9]': '行星级齿轮啮合不良',
              '[1,2,3,4]': '齿轮箱中间轴轴承跑圈',
              '[0]': '齿轮箱中间轴轴承松动',
              '[21]': '电气故障',
            },
            {
              '[9]': '高速轴叶轮侧轴承外圈故障',
              '[10]': '高速轴叶轮侧轴承内圈故障',
              '[11]': '高速轴叶轮侧轴承滚动体故障',
              '[12]': '高速轴叶轮侧轴承保持架故障',
              '[13]': '高速轴电机侧轴承外圈故障',
              '[14]': '高速轴电机侧轴承内圈故障',
              '[15]': '高速轴电机侧轴承滚动体故障',
              '[16]': '高速轴电机侧轴承保持架故障',
              '[17,18]': '高速级大小齿轮啮合不良',
              '[17]': '中间级小齿轮啮合不良',
              '[5,6]': '高速级齿轮不对中（偏载）',
              '[7,8,17]': '中间级齿轮不对中（偏载）',
              '[0,1,2]': '联轴器不对中',
              '[1,2,3,4]': '齿轮箱输出轴轴承跑圈',
              '[0]': '齿轮箱输出轴轴承松动',
              '[19]': '电气故障',
            },
            {
              '[5]': '发电机前轴承外圈故',
              '[6]': '发电机前轴承内圈故障',
              '[7]': '发电机前轴承滚动体故障',
              '[8]': '发电机前轴承保持架故障',
              '[1,2,3,4]': '发电机前轴承跑圈',
              '[0,9]': '发电机前轴承松动',
              '[10]': '电气故障',
              '[0]': '联轴器不对中',
            },
            {
              '[5]': '发电机后轴承外圈故障',
              '[6]': '发电机后轴承内圈故障',
              '[7]': '发电机后轴承滚动体故障',
              '[8]': '发电机后轴承保持架故障',
              '[1,2,3,4]': '发电机后轴承跑圈',
              '[0,9]': '发电机后轴承松动',
              '[10]': '电气故障',
            },
          ]
          if (el.id && fault[Number(el.id)]) {
            for (let key in fault[Number(el.id)]) {
              if (el.fault_type.indexOf(key) !== -1) {
                diagnosis.push(fault[Number(el.id)][key])
              }
            }
          }
        }
        if (dataX.indexOf(el.saveTime_Com) == -1) {
          dataX.push(el.saveTime_Com)
          if (diagnosis.length > 0) {
            dataY.push(1) //有故障
            dataAll.push([el.saveTime_Com, 1])
          } else {
            dataY.push(0) //无故障
            dataAll.push([el.saveTime_Com, 0])
          }
          dataDiagnosis[el.saveTime_Com] = diagnosis
        } else {
          if (diagnosis.length > 0) {
            dataY[dataX.indexOf(el.saveTime_Com)] = 1 //'有故障'
            dataAll[dataX.indexOf(el.saveTime_Com)] = [el.saveTime_Com, 1]
          }
          dataDiagnosis[el.saveTime_Com] = dataDiagnosis[
            el.saveTime_Com
          ].concat(diagnosis)
        }
      })
      chartData.dataDiagnosis = dataDiagnosis
      chartData.dataX = dataX
      chartData.dataY = dataY
      chartData.data = dataAll
      this.drawChart()
    },
    initChart() {
      const chartData = this.paramsData[this.currentKey].chartData
      let dom = document.getElementById(`diagnosis_chart_${this.currentKey}`)
      if (dom) {
        chartData.echart = echarts.init(dom)
      }
    },
    drawChart() {
      const param = this.paramsData[this.currentKey]
      const chartData = param.chartData
      if (!chartData.echart) {
        this.initChart()
      }
      // 取最后的状态与结束时间插入画图数组
      let firstStatus = chartData.data[0]
      let lastStatus = chartData.data[chartData.data.length - 1]
      chartData.data.push([param.endTime, lastStatus[1]])
      chartData.dataDiagnosis[param.endTime] =
        chartData.dataDiagnosis[lastStatus[0]]
      chartData.data.unshift([param.startTime, firstStatus[1]])
      chartData.dataDiagnosis[param.startTime] =
        chartData.dataDiagnosis[firstStatus[0]]
      // markArea
      /* let changeData = []
      if (chartData.dataY.length > 1) {
        for (let k = 0, len = chartData.dataY.length; k < len; k++) {
          if (chartData.dataY[k] == 1) {
            for (let j = k + 1; j < len; j++) {
              if (chartData.dataY[j] == 0) {
                let a = changeData.length
                changeData.push([j + a, [chartData.dataX[j - 1], 0]])
                console.log('1=>0', [j + a, [chartData.dataX[j - 1], 0]])
                k = j - 1
                break
              }
            }
          } else if (chartData.dataY[k] == 0) {
            for (let j = k + 1; j < len; j++) {
              if (chartData.dataY[j] == 1) {
                let a = changeData.length
                changeData.push([j + a, [chartData.dataX[j], 0]])
                console.log('0=>1', [j + a, [chartData.dataX[j], 0]])
                k = j - 1
                break
              }
            }
          }
        }
      }
      console
      for (let k in changeData) {
        chartData.data.splice(changeData[k][0], 0, changeData[k][1])
      }
      console.log(chartData.data) */
      const option = {
        animation: false,
        title: {
          text: param.mac.mac_me + '-传动链',
          textStyle: {
            color: '#fff',
            fontSize: 16,
          },
          padding: [10, 10, 20, 20],
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
            lineStyle: {
              color: '#ff9b21',
            },
          },
          formatter: (params) => {
            let param = params[0]
            let fault = '</br>'
            if (chartData.dataDiagnosis[Number(param.data[0])].length > 0) {
              for (
                let i = 0,
                  l = chartData.dataDiagnosis[Number(param.data[0])].length;
                i < l;
                i++
              ) {
                fault =
                  fault +
                  chartData.dataDiagnosis[Number(param.data[0])][i] +
                  '</br>'
              }
            } else {
              fault = '无故障'
            }
            return (
              '时间：' +
              getTime(Number(param.data[0])) +
              '</br>' +
              '部件：传动链</br>详细故障：' +
              fault
            )
          },
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
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty',
          },
        ],
        xAxis: {
          type: 'time',
          boundaryGap: false,
          // data: chartData.dataX,
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
            formatter: function (params) {
              if (Number(params)) {
                return getTime(Number(params))
              }
            },
          },
        },
        yAxis: {
          type: 'value',
          max: 1,
          min: 0,
          axisLine: {
            lineStyle: {
              color: '#657CA8',
            },
          },
          axisLabel: {
            color: '#F3F3F3',
            formatter: function (params) {
              if (params == 0) {
                return '无故障'
              } else if (params == 1) {
                return '有故障'
              }
            },
          },
        },
        series: [
          {
            data: chartData.data,
            type: 'line',
            areaStyle: {
              color: '#0089FF',
            },
            color: '#0F77D0',
            symbolSize: 10,
          },
        ],
      }
      chartData.echart.setOption(option)
      window.addEventListener('resize', () => {
        chartData.echart.resize()
      })
    },
    dataRetrieval() {
      let data = this.paramsData[this.currentKey]
      this.$retrieval({
        key: 'diagnosisTrend',
      }).then((res) => {
        if (res) {
          data.endTime = res.endTime
          data.startTime = res.startTime
          let requestData = {
            mac_id: data.macId,
            startTime: res.startTime,
            endTime: res.endTime,
          }
          this.getData(requestData)
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
.content-edge {
  position: relative;
}
.diagnosis-edge {
  height: calc(100% - 49px);
  border: 1px solid #9b9b9b;
  .diagnosis-chart {
    height: 100%;
    width: 100%;
  }
}
.search-data {
  height: 49px;
  line-height: 49px;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  button {
    height: 30px;
    width: 100px;
    margin: 0px 10px;
  }
  input {
    padding-left: 10px;
  }
}
</style>