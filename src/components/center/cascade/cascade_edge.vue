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
          @contextmenu.prevent="showMenu(item.MenuShowflag)"
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
        <button
          :class="item.showFrequency ? '' : 'disable-btn'"
          @click="changeShow"
        ><!-- 切换显示模式 -->{{$t('cascade.SwitchDisplayMode')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-gl'
import { cloneObj, getCodeObj } from 'utils/utils.js'
import SSIndex from 'common/startStop/SSIndex.vue'
export default {
  name: 'cascade',
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
      keepAlive: 'cascade',
    })
  },
  watch: {
    '$store.state.cascadeMsg': {
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
        data: { pos_id: pos.pos_id, startTime: null, endTime: null },
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.paramsData, key, {
            isShow: true,
            pos,
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: this.$t('Common.noDataText'), //无数据
            },
            chartData: {
              vdata: null,
              dom: null,
              chartObj: null,
              nxdata: null, //倍频数据
              twodata: null, //二倍频数据
              option: null,
            },
            timeData: [],
            showFrequency: false, //显示2倍频数据
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
          name: this.$t('Common.freq')+'(Hz)',//频率
          max: function (value) {
            return Math.ceil(value.max)
          },
          min: function (value) {
            return Math.floor(value.min)
          },
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
          type: 'value',
          name: this.$t('eigenvalue.speed'),//转速
          // max: 'dataMax',
          max: function (value) {
            return Math.ceil(value.max)
          },
          min: function (value) {
            return Math.floor(value.min)
          },
          // min: 'dataMin',
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
          name: this.$t('Common.amplitude'),//幅值
          max: function (value) {
            return Math.ceil(value.max)
          },
          min: function (value) {
            return Math.floor(value.min)
          },
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
          // boxWidth: 100,
          // boxHeight: 80,
          // boxDepth: 130,
          // viewControl: {
          //   projection: 'perspective',
          //   autoRotate: false,
          //   rotateSensitivity: [1, 0],
          // },
          // panMouseButton:"right",
          // axisPointer: {
          //   lineStyle: {
          //     color: '#d9d9d9',
          //   },
          // },
          boxWidth: 500,
          boxHeight: 200,
          boxDepth: 400,
          axisLine: {
            show: true,
            interval: 0,
            lineStyle: {
              color: '#000',
            },
          },
          axisLabel: {
            show: true,
          },
          viewControl: {
            distance: 700,
            minDistance: 200,
            maxDistance: 800,
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
      requestData.startTime = item.startTime
      requestData.endTime = item.stopTime
      // 实时数据按钮
      // const params = this.paramsData[this.currentKey]
      // params.isReal = false
      this.getData()
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
    getData() {
      const requestData = this.requestData.data
      // const requestData = {
      //   pos_id: 1577069383817,
      //   startTime: 1606752453000,
      //   endTime: 1606752541000,
      // }
      this.$getApi.queryCascade(requestData).then((res) => {
        if (res) {
          if (res.list && res.list.length > 0) {
            this.setData(res)
          }
        }
      })
    },
    setData(res) {
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      const vdata = []
      const nxdata = [[], [], []] //倍频（0.5,1,2）
      const speedData = []
      let twodata = [] //开启2倍频数据
      for (let i = 0; i < res.list.length; i++) {
        if (res.list[i].spectrumObject) {
          speedData.push(res.list[i].spectrumObject.speed)
        }
      }
      let twoMaxFrequency = 0 //最大二倍频
      for (let i = 0; i < speedData.length; i++) {
        nxdata[0].push([speedData[i] / 120, speedData[i], 0]) //0.5倍频
        nxdata[1].push([speedData[i] / 60, speedData[i], 0]) //1倍频
        nxdata[2].push([speedData[i] / 30, speedData[i], 0]) //2倍频
        if (twoMaxFrequency < speedData[i] / 30) {
          twoMaxFrequency = speedData[i] / 30
        }
      }
      res.list.forEach((item, index) => {
        const data = []
        const data2 = []
        if (item.spectrumObject) {
          const speed = item.spectrumObject.speed
          if (item.spectrumObject.spectrum) {
            const spectrumData = item.spectrumObject
            let samples = spectrumData.samples
            let freq = spectrumData.freq
            let n = 0
            // 点数为sample，在数组最前面补一个（0,0）
            for (let k = 0; k < spectrumData.spectrum.length; k++) {
              const value = spectrumData.spectrum[k]
              while (n < value.weizhi) {
                data.push([(freq / samples) * n, speed, 0])
                if (twoMaxFrequency > (freq / samples) * n) {
                  data2.push([(freq / samples) * n, speed, 0])
                }
                n++
              }
              data.push([
                (freq / samples) * value.weizhi - 1,
                speed,
                value.fuzhi,
              ])
              if (twoMaxFrequency > (freq / samples) * n) {
                data2.push([
                  (freq / samples) * value.weizhi - 1,
                  speed,
                  value.fuzhi,
                ])
              }
              n++
            }
            if (samples + 1 > data.length) {
              while (n < samples + 1) {
                data.push([(freq / samples) * n, speed, 0])
                if (twoMaxFrequency > (freq / samples) * n) {
                  data2.push([(freq / samples) * n, speed, 0])
                }
                n++
              }
            }
          }
        }
        vdata.push(data)
        twodata.push(data2)
      })
      chartData.vdata = vdata
      chartData.nxdata = nxdata
      chartData.twodata = twodata
      if (params.showFrequency) {
        this.changeData(2)
      } else {
        this.changeData(1)
      }
    },
    // 切换显示二倍频和全部数据
    changeData(type) {
      // type:1 全部数据；2 二倍频数据
      const params = this.paramsData[this.currentKey]
      const chartData = params.chartData
      this.$nextTick(() => {
        let series = []
        if (type == 2) {
          for (let i = 0; i < chartData.twodata.length; i++) {
            series.push({
              type: 'line3D',
              lineStyle: {
                width: 3,
              },
              data: chartData.twodata[i],
            })
          }
        } else if (type == 1) {
          for (let i = 0; i < chartData.vdata.length; i++) {
            series.push({
              type: 'line3D',
              lineStyle: {
                width: 3,
              },
              data: chartData.vdata[i],
            })
          }
        }

        for (let n = 0; n < chartData.nxdata.length; n++) {
          let name = '0.5X'
          if (n == 1) {
            name = '1X'
          } else if (n == 2) {
            name = '2X'
          }
          series.push({
            type: 'line3D',
            lineStyle: {
              width: 2,
              opacity: 0.8,
            },
            name: name,
            data: chartData.nxdata[n],
          })
        }
        chartData.option.series = series
        chartData.chartObj.setOption(chartData.option, {
          replaceMerge: ['series'],
        })
      })
    },
    // 切换显示二倍频和全部
    changeShow() {
      const params = this.paramsData[this.currentKey]
      params.showFrequency = !params.showFrequency
      if (params.showFrequency) {
        this.changeData(2)
      } else {
        this.changeData(1)
      }
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
  .clickRightMenu {
    width: 110px;
    background-color: #152f69;
    font-size: 12px;
    position: absolute;
    text-align: left;
    padding: 2px 0;
    border: 1px solid #ccc;
    display: block;
    z-index: 100;
  }
  .clickRightMenu li {
    list-style: none;
    line-height: 20px;
    padding-left: 15px;
  }
  .clickRightMenu li:hover {
    background-color: #dcdcdc;
    cursor: pointer;
  }
}
</style>