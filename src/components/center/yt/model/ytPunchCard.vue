<template>
  <div class="my-scatter-pd">
    <div
      class="my-scatter-chart box-shadow"
      v-for="(param,key) in ytPunchCard"
      v-show="param.isShow"
      v-resize='resize'
    >
      <div
        class="chart-content"
        :class="param.chartData.chartId"
      ></div>
      <div
        class="none-data-box"
        v-show="param.empty.isShow"
      >
        <div>{{ param.empty.text }}</div>
      </div>
      <div
        class="none-data-box"
        v-show="param.posEmpty.isShow"
      >
        <div>{{ param.posEmpty.text }}</div>
      </div>
      <div
        class="search-data"
        v-show="!param.posEmpty.isShow"
      >
        <button
          class="tt"
          :class="{ check: param.botton[0].isCheck }"
          @click="chooseTime(0)"
        >
          {{ param.botton[0].name }}
        </button>
        <button
          class="tt"
          :class="{ check: param.botton[1].isCheck }"
          @click="chooseTime(1)"
        >
          {{ param.botton[1].name }}
        </button>
        <button
          class="tt"
          :class="{ check: param.botton[2].isCheck }"
          @click="chooseTime(2)"
        >
          {{ param.botton[2].name }}
        </button>
        <button @click="dataRetrieval">{{$t('Common.retrieval')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getTime, cloneObj } from 'utils/utils.js'
export default {
  name: 'ytPunchCard',
  data() {
    return {
      currentKey: '',
      ytPunchCard: {},
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'ytPunchCard',
    })
  },
  methods: {
    resize() {
      const param = this.ytPunchCard[this.currentKey]
      if (param.chartData && param.chartData.echartIns) {
        param.chartData.echartIns.resize()
      }
    },
    //打开图谱
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.ytPunchCard) {
        this.ytPunchCard[i].isShow = false
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.ytPunchCard)
      if (type === 0 || type === 1 || type === 4) {
        if (keyArr.indexOf(key) === -1) {
          type = 0
          title = cloneObj(this.$store.state.chooseTitle.generalTitle)
        } else {
          type = 1
        }
      }
      if (type === 0) {
        mac = cloneObj(this.$store.state.checkMsg.mac)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        mac = this.ytPunchCard[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.ytPunchCard, key, {
            mac,
            chartData: {}, // 存放所有的数据
            posEmpty: {
              isShow: false,
              text: this.$t('YtPunchCard.noPosText'), //无测点
            },
            empty: {
              isShow: false,
              text: this.$t('YtPunchCard.noDataText'), //无数据
            },
            botton: [
              {
                index: 0,
                isCheck: true,
                name: this.$t('YtPunchCard.dayCard'), //天卡
                startTime: 1000 * 60 * 60 * 24,
                interval: 1000 * 60 * 60,
              },
              {
                index: 1,
                isCheck: false,
                name: this.$t('YtPunchCard.weekCard'), //'周卡'
                startTime: 7 * 1000 * 60 * 60 * 24,
                interval: 1000 * 60 * 60 * 6,
              },
              {
                index: 2,
                isCheck: false,
                name: this.$t('YtPunchCard.monthCard'), //'月卡'
                startTime: 30 * 1000 * 60 * 60 * 24,
                interval: 1000 * 60 * 60 * 24,
              },
            ],
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.ytPunchCard[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.ytPunchCard, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.ytPunchCard[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        /* 获取 pos.sensor_id == "101" && pos.dataaddress == "0304" 的测点 */
        let pos
        let flag = true
        let timer = setInterval(() => {
          pos = this.$store.state.pos[mac.mac_id]
          //去store中获取10s后没有数据就不会给，如果没有，代表没有组织，显示空白页，清空定时器
          if (pos) {
            clearInterval(timer)
          }
          if (pos) {
            pos.forEach((item) => {
              if (item.sensor_id == '101' && item.dataaddress == '0304') {
                flag = false
                this.setChartData(item)
              }
            })
            /* 如果没有匹配到测点 */
            if (flag) {
              this.ytPunchCard[key].posEmpty.isShow = true
            } else {
              this.ytPunchCard[key].posEmpty.isShow = false
            }
          }
        }, 10)
      }
    },
    setChartData(pos) {
      const param = this.ytPunchCard[this.currentKey]
      let key = `${pos.machine_id}_${pos.position_id}_${pos.position_type}`
      let density = this.$store.state.srcParams.density.type
      let time
      param.botton.forEach((item) => {
        if (item.isCheck) {
          time = item.startTime
        }
      })
      param.chartData = {
        echartIns: null,
        chartId: key, //设置图谱实例唯一ID
        trendData: [], //图谱数据
        /* 特定工艺量才能够请求,默认开始是天卡 */
        requestData: {
          startTime: new Date().valueOf() - time,
          endTime: new Date().valueOf(),
          value: 'value',
          code: 27000,
          key: [`3_${key}`], //tRoot_macId_posId_posType
          density: density,
        }, // 请求参数
      }
      this.$nextTick(this.setEchartIns)
      this.getData()
    },
    /* 设置echart的实例 */
    setEchartIns() {
      const param = this.ytPunchCard[this.currentKey]
      let dom = document.getElementsByClassName(param.chartData.chartId)[0]
      param.chartData.echartIns = echarts.init(dom)
    },
    getData(req) {
      const param = this.ytPunchCard[this.currentKey]
      let requestData = param.chartData.requestData
      if (req) {
        requestData = req
      }
      // requestData.startTime = requestData.startTime - 30 * 1000 * 60 * 60 * 24;
      // requestData.endTime = requestData.endTime - 30 * 1000 * 60 * 60 * 24;
      this.$getApi.getCurrentCards(requestData).then((res) => {
        if (res) {
          /* 只有一个点 */
          for (let key in res.data) {
            let tendencyList = res.data[key].tendencyList
            /* 进行密度判断防止卡死，根据后台的规则来，也可以自己来筛选数据 */
            let points = 10000
            // if (tendencyList.length > points * 30) {
            //   /* 请求低密度 */
            //   let req = cloneObj(requestData)
            //   if(req.density != 16){
            //     req.density = 16
            //     this.getData(req)
            //   }
            //   return
            // } else if (tendencyList.length > points * 7) {
            //   /* 请求中密度 */
            //   let req = cloneObj(requestData)
            //   req.density = 8
            //   this.getData(req)
            //   return
            // } else if (tendencyList.length > points) {
            //   /* 请求高密度 */
            //   let req = cloneObj(requestData)
            //   req.density = 4
            //   this.getData(req)
            //   return
            // } else {
            let arr = []
            if (tendencyList.length > points) {
              let interval = Math.ceil(tendencyList.length / points)
              for (let i = 0; i < tendencyList.length; i = i + interval) {
                if (tendencyList[i]) {
                  arr.push(tendencyList[i])
                } else {
                  arr.push(tendencyList[tendencyList.length - 1])
                }
              }
            } else {
              /* 正常 */
              tendencyList.forEach((item, index) => {
                // if (index ) return;
                arr.push([item.tempValue, item.saveTime])
              })
            }

            param.chartData.trendData = arr
            if (arr.length == 0) {
              param.empty.isShow = true
            } else {
              param.empty.isShow = false
            }
            this.setData(requestData)
            // }
          }
        }
      })
    },
    setData(requestData) {
      let data = this.chartData.trendData
      let min = requestData.startTime
      let max = requestData.endTime
      let interval, type
      param.botton.forEach((item) => {
        if (item.isCheck) {
          interval = item.interval
          type = item.index
        }
      })
      let option = {
        polar: {
          radius: ['10%', '85%'],
        },
        tooltip: {
          formatter: (params) => {
            //电流：
            //时间：
            return `${this.$t('YtPunchCard.toolTipWord1')}：${
              params.value[0]
            }A<br/>
            ${this.$t('YtPunchCard.toolTipWord2')}：${getTime(
              params.value[1]
            )}<br/>`
          },
        },
        angleAxis: {
          type: 'time',
          min: min,
          max: max,
          interval: interval,
          clockwise: false, //逆时针
          splitLine: {
            show: true, // 显示线
            interval: 0,
            lineStyle: {
              color: '#2c619d',
              type: 'solid',
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff',
              type: 'solid',
            },
          },
          axisTick: {
            show: false,
          },
        },
        radiusAxis: {
          type: 'value',
          splitLine: {
            show: true, // 显示线
            lineStyle: {
              color: '#2c619d',
              type: 'solid',
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff',
              type: 'solid',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            rotate: 45,
          },
        },
        toolbox: {
          show: true,
          feature: {
            restore: {},
          },
        },
        series: [
          {
            name: 'Punch Card',
            type: 'line',
            coordinateSystem: 'polar',
            symbolSize: 5,
            data: data,
            // animation: false,
            animationDelay: 0,
            itemStyle: {
              color: 'rgba(255,0,0,0.6)',
            },
            /* 高亮选择 */
            emphasis: {
              itemStyle: {
                // color: "#fff",
                borderWidth: 2,
                borderColor: '#00d2ff',
              },
            },
            // {
            //   color: "#00d2ff"
            // }
          },
        ],
        /* 缩放 */
        dataZoom: {
          type: 'inside',
          // angleAxisIndex: 0,
          radiusAxisIndex: 0,
        },
      }
      /* 周卡的时候需要手动调整下时间的格式 */
      if (type == 1) {
        option.angleAxis.axisLabel = {
          isShow: true,
          formatter: function (value, index) {
            // 格式化成月/日，只在第一个刻度显示年份
            let date = new Date(value)
            let texts
            let f = (t) => {
              if (t < 10) {
                t = '0' + t
              }
              return t
            }
            let hours = f(date.getHours())
            let minutes = f(date.getMinutes())
            if (index % 4 === 0) {
              texts = `${hours}:${minutes}\n${
                date.getMonth() + 1
              }-${date.getDate()}`
            } else {
              texts = `${hours}:${minutes}`
            }
            return texts
          },
        }
      }
      param.chartData.echartIns.setOption(option, true)
    },
    //数据检索
    dataRetrieval() {
      const param = this.ytPunchCard[this.currentKey]
      let requestData = param.chartData.requestData
      this.$retrieval({
        key: 'punchCard',
        params: { startTime: requestData.endTime },
      }).then((res) => {
        if (res) {
          requestData.density = res.density.type
          param.botton.forEach((item) => {
            if (item.isCheck) {
              requestData.endTime = res.startTime
              requestData.startTime = res.startTime - item.startTime
            }
          })
          this.getData()
        }
      })
    },
    //选择时间
    chooseTime(index) {
      const param = this.ytPunchCard[this.currentKey]
      let requestData = param.chartData.requestData
      param.botton.forEach((item, i) => {
        if (i === index) {
          item.isCheck = true
          // data.requestData.endTime = 1605348828000;
          // data.requestData.startTime = 1605348828000 - item.startTime;
          requestData.endTime = new Date().valueOf()
          requestData.startTime = requestData.endTime - item.startTime
          this.getData()
        } else {
          item.isCheck = false
        }
      })
    },
  },
  watch: {
    '$store.state.ytPunchCardMsg': {
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
}
</script>
<style scoped lang="scss">
.my-scatter-pd {
  position: relative;
  .my-scatter-chart {
    position: relative;
    height: calc(100% - 60px);
    .chart-content {
      height: 100%;
    }
    .none-data-box {
      height: 100%;
    }
  }
  .search-data {
    height: 59px;
    line-height: 59px;
    text-align: center;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin-right: 20px;
    }
    .tt {
      background: #0072e6;
    }
    .check {
      background: #a47c42;
    }
  }
}
</style>
