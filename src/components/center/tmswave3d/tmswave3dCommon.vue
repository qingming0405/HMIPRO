<template>
  <div class="wave3d box-shadow">
    <div class="title"><!-- 当前频率 -->{{$t('wave3d.CurrentFreq')}}：{{ showFrequence }}</div>
    <div
      class="histogram"
      v-show="histogramIsShow"
    ></div>
    <div
      class="my-spectrum-3d-chart"
      v-for="(val, key) in chartData"
      :key="key"
      v-show="val.isShow"
      @contextmenu.prevent="showMenu(val.MenuShowflag)"
    >
      <div class="valid">
        <!-- 有效频率 -->{{$t('tmsTrend3d.effectFreq')}}:
        <input
          type="number"
          v-model="val.minValid"
        /> -
        <input
          type="number"
          v-model="val.maxValid"
        />
        <button
          class="botton"
          @click="valid(val)"
        ><!-- 查询 -->{{$t('Common.inquiry')}}</button>
      </div>
      <!-- 右击列表 -->
      <ul
        class="clickRightMenu"
        id="clickRightMenu"
        ref="clickRightMenu"
        v-show="val.MenuShowflag"
      >
        <li
          v-if="!val.isHanning"
          @click="sethanning(val)"
        >
          <i class="iconfont icon-hanningchuang_huaban"></i><!-- 汉宁窗 -->{{$t('icon.hanning')}}
        </li>
        <li
          v-else
          @click="sethanning(val)"
        >
          <i class="iconfont icon-hanningchuang_huaban"></i><!-- 取消汉宁窗 -->{{$t('wave3d.CancelHanning')}}
        </li>
        <li @click="savePic(key)">
          <i class="iconfont icon-savemage_huaban"></i><!-- 保存为图片 -->{{$t('icon.SavePicture')}}
        </li>
      </ul>
      <div
        v-resize='resize'
        :ref="key"
        class="spectrum-3d-chart"
        :class="val.className"
      ></div>
      <div
        class="none-data-box select-none radius"
        v-show="val.empty.isShow"
      >
        <span>{{ val.empty.text }}</span>
      </div>
    </div>
    <div class="search-3d-data">
      <button @click="timeList"><!-- 数据列表 -->{{$t('tmsTrend3d.DataList')}}</button>
      <button @click="retrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import { getTime, setLine, cloneObj } from 'utils/utils.js'
export default {
  name: 'tmswave3d',
  data() {
    return {
      key: '',
      frequence: '',
      showFrequence: '', //显示在界面的幅值
      histogramIsShow: false,
      myTipsChart: '', //左视图
      chartData: {}, //key:{isShow:Boolean,vdata:[],dataY:[]}
      lineColor: '#000',
      t_root: 0,
      station: [], //站点信息
    }
  },
  mounted() {
    /* 创造标签柱状图 */
    this.$nextTick(this.init_histogram)
  },
  watch: {
    '$store.state.tmswave3dMsg': {
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
    /* 改变存储测点的数据 */
    openChartList(key, state, delKey) {
      if (typeof key !== 'string') return
      if (state === 0 || state === 1) {
        this.key = key
        for (let k in this.chartData) {
          this.chartData[k].isShow = false
        }
      }
      let [, , macId, posId, posType] = key.split('_')
      /* 三维频谱图只能通过上方选择测点进入 */
      /* 获取checkMsg里面的测点信息 */
      let pos = this.$store.state.checkMsg.pos
      this.histogramIsShow = false //改变图谱的时候关闭柱状图
      this.showFrequence = ''
      if (state == 0) {
        /* 设置当前测点的t_root，来区分TMS，搜索表格的 */
        //添加数据
        this.$set(this.chartData, key, {
          isShow: true,
          minValid: '',
          maxValid: '',
          className: key,
          timeList: {}, //所有时间列表
          tipsArray: {}, //存放所有频率和幅值的对应
          pos,
          macId,
          vdata: [],
          dataY: [],
          echart: '', //3d图谱的实例
          histogram: '', //柱状图的实例
          MenuShowflag: false, //右键菜单是否显示
          isHanning: false, //是否有汉宁穿
          freq: [], //频率
          fft: [],
          fftWithHanning: [],
          requesetData_Time: {}, //请求时间的参数
          requesetData_val: null, //请求具体数据的参数
          requesetData: null,
          empty: {
            isShow: false,
            text: this.$t('Common.noDataText')//'无数据'
          },
        })
        let startTime = this.$store.state.srcParams.time.start
        let endTime = this.$store.state.srcParams.time.end
        /* 获取站点信息 */
        this.getStationInfo(this.chartData[key])
        // this.get_Info();
      } else if (state == 1) {
        //切换
        this.chartData[key].isShow = true
        if (
          this.chartData[key].echart == '' &&
          this.chartData[key].vdata.length > 0
        ) {
          this.$nextTick(() => {
            this.init_3d_chart()
          })
        }
      } else if (state == 2) {
        //删除
        this.delete_3d_chart(key)
      }
    },
    /* 获取站点信息 */
    getStationInfo(chartData) {
      /* 获取站点信息 */
      this.$getApi.getLineInfo({ machineId: chartData.macId }).then((res) => {
        if (res) {
          let result = setLine('0', res.stations)
          if (result[0].length === 0) return //第一条线路没有值
          // let requesetData_Time = chartData.requesetData_Time
          chartData.requesetData_Time.lineInfo = result
          chartData.requesetData_Time.route = { name: this.$t('tmsTrend3d.Line1'), index: 0 } //线路1 默认第一条路线
          /* 第一次自动打开搜索框 */
          this.retrieval()
        }
      })
    },
    // 获取时间集合
    getTimeList(requesetData, chartData, firstSearchParams) {
      /* 获取当前时间段下面的数据包 */
      this.$getApi.getTimeBatch(requesetData).then((result) => {
        if (result.info && result.info.length > 0) {
          /* 时间检索的参数 */
          result.info.forEach((item) => {
            item.val = getTime(item.startTime)
          })
          chartData.requesetData_val = {
            name: chartData.pos.position_name,
            macName: chartData.pos.mac_name,
            time: result.info,
            chooseTime: cloneObj(result.info[0]),
          }
          /* 第一次请求 */
          let requesetData_first = {
            machineId: requesetData.machineId,
            positionId: requesetData.positionId,
            positionType: requesetData.positionType,
            startTime: result.info[0].startTime,
            endTime: result.info[0].endTime,
            density: firstSearchParams.density.type,
            startStationId: firstSearchParams.startStation.station_id,
            endStationId: firstSearchParams.terminal.station_id,
          }
          chartData.requesetData = requesetData_first
          this.get_Info(requesetData_first)
        } else {
          chartData.requesetData_val = {
            name: chartData.pos.position_name,
            macName: chartData.pos.mac_name,
            time: null,
            chooseTime: null,
          }
          chartData.empty.isShow = true
        }
      })
    },

    /* 销毁3d 图谱 */
    delete_3d_chart(key) {
      //销毁实例
      this.chartData[key].echart && this.chartData[key].echart.dispose()
      this.$delete(this.chartData, key)
    },
    /* 创建柱状图(左视图) */
    init_histogram() {
      let dom = document.getElementsByClassName('histogram')[0]
      let myChart = echarts.init(dom)
      this.myTipsChart = myChart
    },
    /* 更新柱状图 */
    update_histogram() {
      /* 跟新频率 */
      let freq = this.frequence
      this.showFrequence = freq
      let obj = this.chartData[this.key].tipsArray
      let yVal = [],
        xVal = []
      let index = 1
      for (let key in obj) {
        let val = obj[key][freq] || 0
        yVal.unshift(val)
        xVal.push(index)
        index++
      }
      let option = {
        title: {
          show: true,
          text: this.$t('wave3d.leftView'),//'左视图',
          textAlign: 'center',
          x: 'right',
          textStyle: {
            color: this.lineColor,
          },
        },
        color: ['#3398DB'], //柱的颜色
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '15%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            name: this.$t('Common.order'),//'序号',
            nameTextStyle: {
              color: this.lineColor, //坐标名颜色
            },
            nameLocation: 'end',
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            data: xVal,
            axisLabel: {
              color: this.lineColor, //坐标上面字的颜色
            },
            axisLine: {
              lineStyle: {
                //坐标轴颜色
                color: this.lineColor,
              },
            },
          },
        ],
        yAxis: [
          {
            name: this.$t('Common.amplitude'),//'幅值'
            nameTextStyle: {
              color: this.lineColor, //坐标名颜色
            },
            type: 'value',
            axisLabel: {
              color: this.lineColor, //坐标上面字的颜色
            },
            axisLine: {
              lineStyle: {
                //坐标轴颜色
                color: this.lineColor,
              },
            },
          },
        ],
        series: [
          {
            name: this.$t('Common.amplitude'),//'幅值'
            type: 'bar',
            barWidth: '40%',
            data: yVal,
          },
        ],
      }
      this.myTipsChart.setOption(option)
      this.histogramIsShow = true
    },
    /* 更新频率 */
    update_frequence(freq) {
      this.frequence = freq
    },
    /* 获取数据 */
    get_Info(requesetData) {
      this.$emit('loadingImg', true)
      this.$getApi.getSpectrumChart(requesetData).then((res) => {
        this.$emit('loadingImg', false)
        if (res && res.info) {
          let chartData = this.chartData[this.key]
          if (res.info.length == 0) {
            chartData.empty.isShow = true
            return
          }
          let InfoArr = []
          // 最多显示100条数据；92条数据时花费时间18s
          if (res.info.length > 100) {
            let num = Math.floor(res.info.length / 100)
            for (let i = 0, l = res.info.length; i < l; ) {
              InfoArr.push(res.info[i])
              i = i + num
            }
          } else {
            InfoArr = res.info
          }
          chartData.empty.isShow = false
          let fftWithHanning = []
          let fft = []
          let vdata = []
          let dataY = [] //Y坐标 多少条数据
          let tipsArray = {} //vdata 存放数据，dataY存放日期
          InfoArr.forEach((item, index) => {
            // if (dataY.includes(item.mileage)) return;
            // Y轴需要字符串
            let Y = item.mileage + ''
            if (dataY.includes(Y)) return //如果有Y坐标相同的数据就直接忽略
            dataY.push(Y)
            fftWithHanning.push(item.fftWithHanning)
            fft.push(item.fft)
            let [arr, arr1] = this.setData(item.fft, Y)
            vdata.push(arr)
            tipsArray[Y] = arr1
            //   let fftWithHanning = item.
          })
          chartData.fft = fft
          chartData.fftWithHanning = fftWithHanning
          chartData.vdata = vdata
          chartData.dataY = dataY
          chartData.tipsArray = tipsArray
          this.init_3d_chart()
        }
      })
    },
    /* 创建3D图谱 */
    init_3d_chart() {
      let value = this.chartData[this.key]
      let myChart // 表格实例
      /* 第一次初始化的时候要创建图 */
      if (!value.echart) {
        let className = value.className
        // let wave3d = document.getElementsByClassName('spectrum-3d-chart')[0];
        let wave3d = document.getElementsByClassName(className)[0]
        myChart = echarts.init(wave3d)
        /* 屏蔽原有的右键事件 */
        wave3d.oncontextmenu = function () {
          // return false;
        }
        myChart.on('click', this.update_histogram)
        //保存echart实例，在关闭标签的时候销毁这个实例
        value.echart = myChart
      } else {
        /* 如果已经创建了这个实例，则重新渲染数据即可 */
        myChart = value.echart
      }
      let series = []
      for (let i = 0; i < value.vdata.length; i++) {
        series.push({
          name: i + 1,
          type: 'line3D',
          data: value.vdata[i],
        })
      }
      let option = {
        xAxis3D: {
          type: 'value',
          name: this.$t('Common.freq')+'(Hz)',//频率

          scale: true,
          nameTextStyle: {
            color: this.lineColor,
          },
          axisLabel: {
            textStyle: {
              color: this.lineColor,
            },
          },
          axisLine: {
            lineStyle: {
              //坐标轴颜色
              color: this.lineColor,
            },
          },
        },
        yAxis3D: {
          type: 'category',
          name: this.$t('tmsTrend3d.distance')+'(m)',//距离
          nameGap: 80,
          data: value.dataY,
          axisLabel: {
            show: true,
            interval: 0, //使y轴都显示
            textStyle: {
              color: this.lineColor,
            },
          },
          nameTextStyle: {
            color: this.lineColor,
          },
          axisLine: {
            lineStyle: {
              //坐标轴颜色
              color: this.lineColor,
            },
          },
        },
        zAxis3D: {
          type: 'value',
          name: this.$t('Common.amplitude'),//'幅值'
          nameGap: 30,
          // max: 'dataMax',
          nameTextStyle: {
            color: this.lineColor,
          },
          axisLabel: {
            textStyle: {
              color: this.lineColor,
            },
          },
          axisLine: {
            lineStyle: {
              //坐标轴颜色
              color: this.lineColor,
            },
          },
        },
        grid3D: {
          boxWidth: 500,
          boxHeight: 200,
          boxDepth: 800,
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
            distance: 1000,
            minDistance: 200,
            maxDistance: 800,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: (prams, d, callback) => {
            this.update_frequence(prams.value[0])
            return `${this.$t('Common.freq')}:${prams.value[0]}Hz<br/>
                    ${this.$t('Common.amplitude')}:${prams.value[2]}<br/>
                    ${this.$t('tmsTrend3d.distance')}:${prams.value[1]}m<br/>`//频率'幅值'距离
          },
        },
        series: series,
      }
      // window.addEventListener("resize", function() {
      //   myChart.resize();
      // });
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true)
      myChart.resize()
    },
    /* 设置数据 */
    setData(obj, mileage, valid = {}) {
      let arr = [],
        temp = {}
      let vdataItem = []
      for (let i = 0; i < obj.OutY.length; i++) {
        /* 过滤有效频率 */
        if (valid.min >= 0 && valid.max >= 0) {
          if (obj.OutX[i] < valid.min || obj.OutX[i] > valid.max) continue
        }
        temp[obj.OutX[i]] = obj.OutY[i]
        arr.push([obj.OutX[i], mileage, obj.OutY[i]])
        // temp[obj.OutX[i]] = i;
        // arr.push([obj.OutX[i], mileage, i]);
      }
      /* 返回组织好的数组和幅值和频率的对应关系 */
      return [arr, temp]
    },
    showMenu(showMenuflag) {
      var event = event || window.event
      this.chartData[this.key].MenuShowflag = !showMenuflag
      var clickRightMenu = this.$refs.clickRightMenu
      // 设置右键菜单位置
      clickRightMenu[0].style.top = event.offsetY + 'px'
      clickRightMenu[0].style.left = event.offsetX + 'px'
      return false
    },
    /* 汉宁窗 */
    sethanning(chartData) {
      // 设置和取消汉宁窗
      chartData.MenuShowflag = false
      chartData.isHanning = !chartData.isHanning
      this.reorganizingData(chartData)
    },
    // 保存图片
    savePic(key) {
      this.chartData[this.key].MenuShowflag = false
      let picture = this.$refs[this.key][0].firstChild.children[0]
      var pictureURI = picture.toDataURL()
      let downLoad = document.createElement('a')
      downLoad.href = pictureURI
      downLoad.download = this.$t('Common.wave3d') + '.png'//三维频谱图
      downLoad.dispatchEvent(new MouseEvent('click'))
    },
    /* 搜索框 */
    retrieval() {
      let chartData = this.chartData[this.key]
      this.$retrieval({
        key: 'tmswave3d',
        params: chartData.requesetData_Time,
      }).then((res) => {
        if (res) {
          /* 保存请求参数 */
          chartData.requesetData_Time = res
          let pos = chartData.pos
          /* 获取参数去请求时间集合 */
          let requesetData_time = {
            machineId: pos.machine_id,
            positionId: pos.position_id,
            positionType: pos.position_type,
            startTime: res.startTime,
            endTime: res.endTime,
          }
          this.getTimeList(requesetData_time, chartData, res)
        }
      })
    },
    /* 时间框 */
    timeList() {
      let chartData = this.chartData[this.key]
      let requesetData_val = chartData.requesetData_val
      if (requesetData_val) {
        this.$wavemile({
          viewMsg: requesetData_val,
        }).then((res) => {
          if (res) {
            let requestData = chartData.requesetData
            requestData.startTime = res.chooseTime.startTime
            requestData.endTime = res.chooseTime.endTime
            this.get_Info(requestData)
          }
        })
      }
    },

    /* 查询有效频率 */
    valid(chartData) {
      let minValid = parseInt(chartData.minValid)
      let maxValid = parseInt(chartData.maxValid)
      /* 有一个值不是数字 */
      if (isNaN(minValid) || isNaN(maxValid)) {
        minValid = ''
        maxValid = ''
      } else {
        if (minValid < 0 || maxValid < 0) {
          this.$pop(this.$t('tmsTrend3d.minFreqlimit'))//有效频段需要大于0
          return
        }
        if (minValid >= maxValid) {
          this.$pop(this.$t('Common.popFreqBandText'))//最大有效频段必须大于最小有效频段
          return
        }
      }
      chartData.minValid = minValid
      chartData.maxValid = maxValid
      this.reorganizingData(chartData)
    },
    resize() {
      if (this.chartData[this.key] && this.chartData[this.key].echart) {
        this.chartData[this.key].echart.resize()
      }
    },

    reorganizingData(chartData) {
      let obj
      if (chartData.isHanning) {
        //有汉宁窗
        obj = chartData.fftWithHanning
      } else {
        obj = chartData.fft
      }
      let vdata = []
      let dataY = chartData.dataY //Y坐标 多少条数据
      let tipsArray = {}
      obj.forEach((item, index) => {
        // if (dataY.includes(item.mileage)) return;
        // Y轴需要字符串
        let [arr, arr1] = this.setData(item, dataY[index], {
          min: chartData.minValid,
          max: chartData.maxValid,
        })
        tipsArray[dataY[index]] = arr1
        vdata.push(arr)
        //   let fftWithHanning = item.
      })
      chartData.vdata = vdata
      chartData.tipsArray = tipsArray
      // 更新图谱
      this.init_3d_chart()
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'tmswave3d',
    })
  },
}
</script>

<style scoped lang="scss">
.valid {
  background: red;
  position: absolute;
  right: 0;
  .a {
    width: 100px !important;
  }
  & > botton {
    width: 50px;
  }
}
</style>
