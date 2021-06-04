<!-- 圆周图 -->
<template>
  <div class="my-circle-chart">
    <div
      class="my-circle-cont"
      v-for="(data, index) in circleData"
      :key="index"
      v-show="data.isShow"
    >
      <div
        class="trajectory-wave"
        :ref="index"
        :class="setClass"
      >
        <div
          class="circle-wave radius box-shadow"
          v-show="data && data.circle.isShow"
        >
          <!-- <wave-chart
            :opt='11'
            :option='circleOption'
            :index='index'
            :isNewChart='data.isNewChart'
            :structure='data.structure'
            :class='"my-circle-chart11" + index'>
          </wave-chart> -->
          <div
            class="my-circle-chart"
            :class="'my-circle-chart11' + index"
          ></div>
          <div
            id="loading-center-absolute"
            v-show="loading"
          >
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
            <div class="object"></div>
          </div>
        </div>
        <div
          class="circle-trend radius box-shadow"
          v-show="data && data.trend.isShow"
        >
          <i
            class="iconfont icon-cuohao"
            @click="closeTrend"
          ></i>
          <wave-chart
            :opt="12"
            :class="'my-circle-trend-chart12' + index"
            :index="index"
            :isNewChart="data.isNewChart"
            :structure="data.structure"
            :option="trendOption"
          >
          </wave-chart>
          <!-- <div class='my-trend-chart' :class='"my-circle-trend-chart12" + index'></div> -->
        </div>
      </div>
      <div
        class="select-date-type"
        v-show="data && data.circle.y.length > 0"
      >
        <div class="date-type-title">显示方式</div>
        <ul class="circleTypeList">
          <li
            v-for="(item, index2) in data.circle.circleType"
            :key="index2"
            @click.stop="getCircleType(item)"
          >
            <label
              :for="'characteristic_' + index + index2"
              @click.stop
            >
              <i
                class="iconfont"
                :class="setIcon1(item.isShow)"
              ></i>
              {{ item.val }}
            </label>
            <input
              type="radio"
              style="display: none;"
              :id="'characteristic_' + index + index2"
              v-model="item.chooseCircleType"
              :value="item.type"
              name="circleType"
            />
          </li>
        </ul>
        <div class="clickData">
          <div class="data-title">数据显示</div>
          <ul class="data-list">
            <li
              v-for="(item, idx) in data.clickView.data"
              :key="idx"
            >
              {{ item.name }}： {{ item.value }}
            </li>
            <li v-show="data.amplitude != ''">
              幅值： {{ data.amplitude }} {{ data.unit }}
            </li>
          </ul>
        </div>
      </div>
      <div
        class="none-data-box select-none radius box-shadow"
        v-show="data.noneData.isShow"
      >
        <div>{{ data.noneData.text }}</div>
      </div>
    </div>
    <div class="search-data">
      <button
        @click="getRealData"
        class="get-real-data"
        ref="getRealData"
        :class="isGetReal ? '' : 'disabled-btn'"
      >
        实时数据
      </button>
      <button @click="retrieval">数据检索</button>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import WaveChart from '@/components/common/waveChart'
import {
  getTime,
  round,
  setConditionAlarm,
  cloneObj,
  defaultCode,
  getUnit,
} from 'utils/utils.js'
import myChart from '@/assets/js/myCharts.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    WaveChart,
  },
  name: 'circles',
  data() {
    return {
      posMsg: {
        /* 测点信息 */ name: '' /* 测点名称 */,
        posType: '' /* 测点类型 */,
        posInfo: '' /* 测点信息 */,
      },
      loading: null /* 是否加载中 */,
      currentKey: '' /* 当前显示索引 */,
      phaseObj: '' /* 当前显示幅值 */,
      unit: '' /* 测点的单位 */,
      circleData: {} /* 倾角分布图(沉降跟踪图)数据信息 */,
      currentFlag: '' /* 当前显示flag */,
      noneData: {
        /* 无数据信息 */ isShow: true /* 是否显示无数据提示 */,
        text: '' /* 无数据提示内容 */,
      },
      isNewChart: true /* 是否为新打开图谱 */,
      speed: '' /* 转速 */,
      resultData: [] /* 当前未选择显示方式之前的数据 */,
      checkColor: '' /* 当前修改颜色下标 */,
      requestData: null /* 请求参数信息 */,
      requestTrendData: null /* 趋势数据请求参数信息 */,
      requestTime: 0 /* 请求波形数据的时间 */,
      isGetReal: 1 /* 是否实时 */,
      color: {
        /* 颜色设置 */
        axis: {
          /* 坐标轴 */ name: '#666' /* 标题 */,
          font: '#666' /* 字体 */,
          line: '#ccc' /* 坐标线 */,
          splitLine: '#ccc' /* 分隔线 */,
        },
        series: {
          /* 图谱 */ line: '#3D77FF' /* 谱线 */,
          symbol: '#fff' /* symbol */,
        },
        tool: {
          symbol: '#ff9b21',
          line: '#ff9b21',
          font: '#fff',
          background: '#ff9b21',
        },
        background: '#fff' /* 背景颜色 */,
      },
      option: [],
    }
  },
  computed: {
    trendOption() {
      const data = this.circleData[this.currentKey]
      if (!data.isShow) return
      const color = this.color
      const trend = data.trend
      const code = defaultCode[this.posMsg.posType].code
      const unit = getUnit(code, this.posMsg.posInfo)
      const that = this
      data.unit = unit
      return {
        title: {
          name: '趋势图',
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 28, // 离容器下边距离，默认 60
        },
        x: {
          name: '',
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          type: 'time',
          data: trend.x,
          fontStyle: {
            color: color.axis.font,
            size: '14px',
          },
          lineStyle: {
            color: color.axis.line,
          },
          splitLineStyle: {
            color: color.axis.splitLine,
          },
        },
        y: {
          name: unit,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: trend.y,
          fontStyle: {
            color: color.axis.font,
            size: '14px',
          },
          lineStyle: {
            color: color.axis.line,
          },
          splitLineStyle: {
            color: color.axis.splitLine,
          },
        },
        series: {
          type: 'line', // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1, // 粗细，默认 1
          },
          symbol: {
            show: true,
            color: color.series.symbol,
            size: 3,
          },
        },
        toolTip: {
          symbol: {
            show: true,
            color: color.tool.symbol,
            size: 3,
          },
          lineStyle: {
            // 标线样式
            color: color.tool.line, // 颜色，默认 '#FA9A4D'
            width: 1, // 粗细，默认 1
          },
          fontStyle: {
            // 标注字体样式
            color: color.tool.font, // 颜色，默认 '#fff'
            size: '14px', // 大小，默认 '12px'
            family: 'Microsoft YaHei', // 字体，默认 'Microsoft YaHei'
            weight: 'normal', // 粗细，默认 'normal'
          },
          background: {
            // 提示框背景
            color: color.tool.background, // 颜色，默认 'rgba(50, 50, 50, 0.3)'
          },
          formatter: function (params) {
            that.$store.commit('setCurrentTime', params.val)
            that.$store.commit('setCurrentSpeed', round(that.speed, 4) + ' rpm')
            data.clickView = {
              isShow: true,
              data: [
                {
                  name: '时间',
                  value: getTime(params.val),
                },
                {
                  name: '转速',
                  value: round(that.speed, 4) + ' rpm',
                },
              ],
            }
            data.point = {
              key: -1,
              x: -1,
              axis: '',
            }
            data.date = getTime(params.val)
            that.requestData.currTime = [params.val]
            that.$store.state.srcParams.time.current = params.val
            that.requestTime = params.val
            that.requestData.isReal = 0
            data.isNewChart = true
            let timer = null
            clearTimeout(timer)
            timer = setTimeout(function () {
              that.loading = true
            }, 500) // 300毫秒内响应不显示
            that.$getApi
              .getWaveformAndSpectrum(that.requestData)
              .then((res) => {
                clearTimeout(timer)
                that.loading = false
                that.getChartData(res)
              })
          },
        },
        backgroundColor: color.background,
      }
    },
    setClass() {
      if (this.circleData[this.currentKey].trend.isShow) {
        return 'trajectory-wave1'
      } else {
        return ''
      }
    },
  },
  watch: {
    '$store.state.circleMsg': {
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
    '$store.state.structure'() {
      this.circleData[this.currentKey].structure = !this.circleData[
        this.currentKey
      ].structure
    },
  },
  methods: {
    /* 数据检索 */
    retrieval() {
      let that = this
      this.$retrieval('circle').then((res) => {
        if (res) {
          that.timer !== null && clearTimeout(that.timer)
          that.isGetReal = 0
          const rd = that.requestTrendData
          rd.startTime = res.startTime
          rd.endTime = res.endTime
          rd.density = Number(res.density.type)
          that.circleData[that.currentKey].structure = !that.circleData[
            that.currentKey
          ].structure
          that.circleData[that.currentKey].trend.isShow = true
          this.$nextTick(this.resizeChart)
          that.circleData[that.currentKey].isNewChart = true
          //创建trend的dom
          // let className = `my-circle-trend-chart12${this.currentKey}`;
          // const dom = document.getElementsByClassName(className)[0];
          // if (dom) {
          //   this.circleData[this.currentKey].chart.trend = myChart.init(dom);
          // }
          // that.$refs[that.currentKey][0].classList.add('trajectory-wave1');
          that.$getApi.getPositionEigenvalue(rd).then((res) => {
            that.getTrend(res)
          })
          that.phaseObj = ''
        }
      })
    },
    /* 改变存储测点的数据 */
    openChartList(key, type, delKey) {
      if (typeof key !== 'string') return
      if (type === 0 || type === 1) {
        this.currentKey = key
        for (let k in this.circleData) {
          this.circleData[k].isShow = false
          this.circleData[k].isNewChart = false
        }
      }
      let [, , macId, posId, posType] = key.split('_')
      if (type == 0) {
        //添加数据
        this.$set(this.circleData, key, {
          isNewChart: true,
          isShow: true,
          trend: {
            isShow: false,
            x: [],
            y: [],
          },
          circle: {
            isShow: true,
            x: [],
            y: [],
            circleType: [
              /* 圆周图显示方式 */ { isShow: true, val: '堆叠', type: '1' },
              { isShow: false, val: '求和', type: '2' },
              { isShow: false, val: '绝对值求和', type: '3' },
            ],
            resultData: [],
            chooseCircleType: 1,
          },
          clickView: {
            isShow: false,
            data: [
              { name: '时间', value: getTime(this.$store.state.currentTime) },
              { name: '转速', value: this.$store.state.currentSpeed },
            ],
          },
          structure: false,
          amplitude: '' /* 当前显示幅值 */,
          unit: '' /* 测点的单位 */,
          noneData: {
            /* 无数据信息 */ isShow: true /* 是否显示无数据提示 */,
            text: '' /* 无数据提示内容 */,
          },
          chart: {
            trend: '',
            circle: '',
          },
        })
        this.posMsg = {
          name: this.$store.state.checkMsg.pos.position_name,
          posType: posType,
          posInfo: this.$store.state.checkMsg.pos,
        }
        let startTime = this.$store.state.srcParams.time.start
        let endTime = this.$store.state.srcParams.time.end
        this.get_Info([startTime, endTime])
        this.$nextTick(this.getCircleDom)
        this.setCircleOption()
      } else if (type == 1) {
        //切换
        this.circleData[key].isShow = true
      } else if (type == 2) {
        //删除
        this.$delete(this.circleData, key)
      }
    },
    //创建圆的dom
    getCircleDom() {
      let className = `my-circle-chart11${this.currentKey}`
      const dom = document.getElementsByClassName(className)[0]
      if (dom) {
        this.circleData[this.currentKey].chart.circle = myChart.init(dom)
      }
    },
    /* 获取数据 */
    get_Info(currTime, lineNum = 10, fromSpeed = null, toSpeed = null) {
      this.timer !== null && clearTimeout(this.timer)
      let [, , macId, posId, posType] = this.currentKey.split('_')
      const time = this.$store.state.currentTime
      this.requestTime = time
      this.requestTime === 0 ? (this.isGetReal = 1) : (this.isGetReal = 0)
      const rd = {
        positionType: posType,
        positionId: posId,
        machineId: macId,
        isWave: true,
        isFFT: false,
        isEnvelopeFFT: false,
        isRceps: false,
        isCZT: false,
        isReal: this.isGetReal,
        currTime: [this.requestTime],
        type: 0,
        lineNum: null,
        isRound: 1,
      }
      this.requestData = rd
      let that = this
      let timer = null
      clearTimeout(timer)
      timer = setTimeout(function () {
        that.loading = true
      }, 500) // 300毫秒内响应不显示
      this.$getApi.getWaveformAndSpectrum(rd).then((res) => {
        clearTimeout(timer)
        this.loading = false
        this.getChartData(res)
      })
      const rd2 = {
        machineId: macId,
        positionId: posId,
        positionType: posType,
        startTime: time.start,
        endTime: time.end,
        toSpeed: null,
        fromSpeed: null,
        lowerLimit: null,
        upperLimit: null,
        type: 1,
        isTwo: false,
        isTrendPrediction: false,
        isAlarm: false,
        value: defaultCode[posType].filed,
        code: defaultCode[posType].code,
      }
      this.requestTrendData = rd2
      if (this.circleData[this.currentKey].isShow && this.isGetReal) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getWaveData(this.requestTime)
        }, 10000)
      }
    },
    // 获取实时数据
    getWaveData(type) {
      this.requestData.currTime = [type]
      let that = this
      let timer = null
      clearTimeout(timer)
      timer = setTimeout(function () {
        that.loading = true
      }, 500) // 300毫秒内响应不显示
      this.$getApi.getWaveformAndSpectrum(this.requestData).then((res) => {
        clearTimeout(timer)
        this.loading = false
        this.getChartData(res)
      })
    },
    // 获取数据
    getChartData(data) {
      const od = this.circleData[this.currentKey]
      let type = od.circle.chooseCircleType
      const list = data.info
      const length = list.length
      this.phaseObj = ''
      if (length > 0) {
        this.requestTime = list[0].updateTime
        const speedWaveObj = list[0].speed_wave
        od.noneData = {
          isShow: false,
          text: '',
        }
        od.circle.x = []
        od.circle.y = []
        od.circle.isShow = true
        od.circle.resultData = []
        od.circle.curCircleDataType1 = [] /* 当前测点圆周图堆叠信息 */
        od.circle.curCircleDataType2 = [] /* 当前测点圆周图求和信息 */
        od.circle.curCircleDataType3 = [] /* 当前测点圆周图绝对值求和信息 */
        if (this.posMsg.posType == 8 || this.posMsg.posType == 9) {
          const obj = list[0].waveObject
          const l = obj.wave.length
          const samples = obj.samples //采样总点数
          const cycles = obj.cycles //采样周期数
          let spectral = 0 //采样点数
          this.speed = obj.speed
          if (samples > 0 && cycles) {
            spectral = samples / cycles /* 采样点数 = 采样总点数/采样周期数 */
          }
          if (l != undefined && l > 0) {
            if (spectral != 0) {
              let data = this.getNewArr(obj.wave, spectral)
              od.circle.resultData = cloneObj(data, true)
              od.circle.y = this.getSumArr(type, data)
            }
          } else {
            od.circle.isShow = false
          }
        } else {
          // if (!speedWaveObj) {
          //   this.$pop('当前无数据');
          //   return;
          // }
          // let speedWaveObj = list[0].speed_wave;
          let obj = list[0].waveObject
          if (
            obj &&
            obj.wave != undefined &&
            speedWaveObj != undefined &&
            speedWaveObj.wave != undefined
          ) {
            this.speed = obj.speed
            let data = this.getCyclePoints(
              obj.freq,
              obj.wave,
              speedWaveObj.wave
            )
            od.circle.resultData = cloneObj(data, true)
            let resultXY = this.getTypeYarr(type, data)
            od.circle.y = resultXY[0] //y值集合
            od.circle.x = resultXY[1] //x值即角度的集合
          }
        }

        switch (Number(type)) {
          case 1:
            od.circle.curCircleDataType1 = od.circle.y
            break
          case 2:
            od.circle.curCircleDataType2 = od.circle.y
            break
          case 3:
            od.circle.curCircleDataType3 = od.circle.y
            break
        }
      } else {
        if (this.requestData.isReal && this.requestData.currTime[0] !== 0) {
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.getWaveData(this.requestTime)
          }, 10000)
          // this.getWaveData(this.requestData.currTime[0])
        } else {
          od.noneData = {
            isShow: true,
            text: `${this.posMsg.name}无数据`,
          }
        }
      }
      this.setCircleOption()
    },
    //设置画圆的option
    setCircleOption() {
      const index = this.currentKey
      let data = this.circleData[index].circle
      let maxAmplitude = Number.MIN_VALUE
      let minAmplitude = 0
      let PP
      let arrayNum = data.y.flat(Infinity) //Infinity展开所有嵌套数组
      maxAmplitude = this.getMaxNum(arrayNum, 1)
      minAmplitude = this.getMaxNum(arrayNum, 2)
      PP = 1.1 * Math.max(Math.abs(maxAmplitude), Math.abs(minAmplitude))
      // PP < 0.1 && (PP = 0.1);
      maxAmplitude *= 1.1
      maxAmplitude = round(maxAmplitude, 4)
      // maxAmplitude < 0.1 && (maxAmplitude = 0.1);
      minAmplitude *= 1.1
      minAmplitude = Math.floor(minAmplitude)
      let that = this
      let option = {
        grid: {
          top: 30,
          bottom: 30,
        },
        series: {
          coordinateSystem: 'circleLine',
          lineStyle: {
            // 样式
            color: '#999', // 颜色，默认 '#0032ff'
            width: 1, // 粗细，默认 1
          },
          /*markLine: { // 标线
              data: alarm,
            },*/
          fontStyle: {
            color: '#666',
            size: '14px',
            family: 'Microsoft YaHei',
          },
          dataMsg: {
            // 数据信息
            oneFreq: 0, // 一倍频
            rotateSpeed: 0, // 转速
            specType: 1, // 频谱图类型
            spectral: 0, // 采样点数
            setPower: false, // 是否设置有效频段，默认 false
          },
          symbol: {
            show: false,
            color: '',
            size: 3,
          },
          data: {
            amplitude: data.x,
            phase: data.y,
            maxAmplitude,
            minAmplitude,
            PP,
            color: '#7CA1EB',
          },
        },
        toolTip: {
          formatter: function (params) {
            that.circleData[index].amplitude = round(params.value, 4)
          },
        },
      }
      this.circleData[this.currentKey].chart.circle !== '' &&
        this.circleData[this.currentKey].chart.circle.setOption(option)
    },
    /* setTrendOption(){
        const data = this.circleData[this.currentKey];
        if (!data.isShow) return;
        const color = this.color;
        const trend = data.trend;
        const code = defaultCode[this.posMsg.posType].code;
        const unit = getUnit(code, this.posMsg.posInfo);
        const that = this;
        data.unit = unit;
        let option = {
          title: {
            name: '趋势图',
          },
          grid: {
            top: 40, // 离容器上边距离，默认 60
            right: 10, // 离容器右边距离，默认 '10%
            left: 80, // 离容器左边距离，默认 '10%'
            bottom: 28 // 离容器下边距离，默认 60
          },
          x: {
            name: '',
            nameStyle: {
              color: color.axis.name,
              size: '14px',
              bold: 'normal'
            },
            type: 'time',
            data: trend.x,
            fontStyle: {
              color: color.axis.font,
              size: '14px',
            },
            lineStyle: {
              color: color.axis.line,
            },
            splitLineStyle: {
              color: color.axis.splitLine,
            }
          },
          y: {
            name: unit,
            nameStyle: {
              color: color.axis.name,
              size: '14px',
              bold: 'normal'
            },
            data: trend.y,
            fontStyle: {
              color: color.axis.font,
              size: '14px',
            },
            lineStyle: {
              color: color.axis.line,
            },
            splitLineStyle: {
              color: color.axis.splitLine,
            }
          },
          series: {
            type: 'line', // 类型，默认 'line'
            lineStyle: { // 样式
              color: color.series.line, // 颜色，默认 '#0032ff
              width: 1, // 粗细，默认 1
            },
            symbol: {
              show: true,
              color: color.series.symbol,
              size: 3,
            },
          },
          toolTip: {
            symbol: {
              show: true,
              color: color.tool.symbol,
              size: 3,
            },
            lineStyle: { // 标线样式
              color: color.tool.line, // 颜色，默认 '#FA9A4D'
              width: 1, // 粗细，默认 1
            },
            fontStyle: { // 标注字体样式
              color: color.tool.font, // 颜色，默认 '#fff'
              size: '14px', // 大小，默认 '12px'
              family: 'Microsoft YaHei', // 字体，默认 'Microsoft YaHei'
              weight: 'normal', // 粗细，默认 'normal'
            },
            background: { // 提示框背景
              color: color.tool.background, // 颜色，默认 'rgba(50, 50, 50, 0.3)'
            },
            formatter: function(params) {
              that.$store.commit('setCurrentTime', params.val);
              that.$store.commit('setCurrentSpeed', round(that.speed, 4) + ' rpm');
              data.clickView = {
                isShow: true,
                data: [
                  {
                    name: '时间', value: getTime(params.val)
                  },
                  {
                    name: '转速', value: round(that.speed, 4) + ' rpm'
                  },
                ]
              };
              data.point = {
                key: -1,
                x: -1,
                axis: '',
              };
              data.date = getTime(params.val);
              that.requestData.currTime = [params.val];
              that.$store.state.srcParams.time.current = params.val;
              that.requestTime = params.val;
              that.requestData.isReal = 0;
              data.isNewChart = true;
              let timer = null;
              clearTimeout(timer);
              timer = setTimeout(function () {
                that.loading = true;
              }, 500) // 300毫秒内响应不显示
              that.$getApi.getWaveformAndSpectrum(that.requestData).then(res => {
                clearTimeout(timer);
                that.loading = false;
                that.getChartData(res);
              })
            }
          },
          backgroundColor: color.background,
        }
        this.circleData[this.currentKey].chart.trend !== '' && this.circleData[this.currentKey].chart.trend.setOption(option);
      }, */
    // 获取趋势数据
    getTrend(data) {
      const msg = data.tendencyList
      const od = this.circleData[this.currentKey]
      if (msg != undefined && msg.length > 0) {
        this.isGetReal = 0
        od.noneData = {
          isShow: false,
          text: '',
        }
        const x = []
        const y = []
        for (let i = 0, l = msg.length; i < l; i++) {
          const value = msg[i]
          x.push(value.saveTime)
          y.push(value.tempValue)
        }
        od.trend = {
          isShow: true,
          x,
          y,
        }
        // this.setTrendOption()
      } else {
        od.noneData = {
          isShow: true,
          text: `${this.posMsg.name}无数据`,
        }
      }
    },
    // 是否获取实时数据
    getRealData(e) {
      this.isGetReal = Math.abs(this.isGetReal - 1)
      if (this.isGetReal) {
        this.requestData.isReal = 1
        this.getWaveData(0)
      } else {
        this.requestData.isReal = 0
        clearTimeout(this.timer)
      }
    },
    // 选中框状态
    setSelectBox(bool) {
      const className = [
        'icon-zhongzi_xuanzekuang',
        'icon-zhongzi_xuanzekuang1',
      ]
      return className[Number(bool)]
    },
    // 判断数据类型
    getDataType(data) {
      return Object.prototype.toString.call(data).slice(8, -1)
    },
    // 切换圆周图的显示方式
    getCircleType(item) {
      item.isShow = true
      let data = this.circleData[this.currentKey].circle
      this.circleData[this.currentKey].isNewChart = true
      data.chooseCircleType = item.type
      if (data.y.length > 0) {
        if (data.curCircleDataType1.length !== 0 && item.type == 1) {
          data.y = data.curCircleDataType1
        } else if (data.curCircleDataType2.length !== 0 && item.type == 2) {
          data.y = data.curCircleDataType2
        } else if (data.curCircleDataType3.length !== 0 && item.type == 3) {
          data.y = data.curCircleDataType3
        } else {
          if (this.posMsg.posType == 8 || this.posMsg.posType == 9) {
            //当改变显示方式时，圆周图y的数据需要换算
            data.y = this.getSumArr(item.type, cloneObj(data.resultData, true))
          } else {
            let resultXY = this.getTypeYarr(
              item.type,
              cloneObj(data.resultData, true)
            ) //数组第一个元素是y值集合；第二个元素是x值角度的集合
            data.y = resultXY[0]
            data.x = resultXY[1]
          }
          switch (Number(item.type)) {
            case 1:
              data.curCircleDataType1 = data.y
              break
            case 2:
              data.curCircleDataType2 = data.y
              break
            case 3:
              data.curCircleDataType3 = data.y
              break
          }
        }
      }
      data.circleType.forEach((circle) => {
        if (circle.type != item.type) {
          circle.isShow = false
        }
      })
      this.setCircleOption()
    },
    /**
     * 构造振动波形上的周期点
     *
     */
    getCyclePoints(freq, waveY, speedWave) {
      var cyclePoints = []
      if (speedWave == null || waveY == null || freq == 0) {
        return cyclePoints
      }
      var speedIndex = 0 //转速波形点索引
      var tSpeedx = 60 / Math.abs(speedWave[0] == 0 ? 1 : speedWave[0]) //转速点在时间轴上的位置
      var waveLen = waveY.length
      var waveList = [] //结果
      var tWave = [] //分段的波形Y
      for (var i = 0; i < waveLen; i++) {
        let wx = i / freq
        if (wx >= tSpeedx) {
          if (speedIndex >= speedWave.length) {
            break
          }
          waveList.push(tWave)
          tWave = []
          speedIndex++
          tSpeedx = wx + 60 / Math.abs(speedWave[speedIndex])
        }
        tWave.push(waveY[i])
      }
      if (tWave.length > 0) {
        waveList.push(tWave)
      }
      return waveList
    },
    // 关闭趋势图
    closeTrend() {
      const data = this.circleData[this.currentKey]
      data.structure = !data.structure
      data.trend.isShow = false
      // this.$refs[this.currentKey][0].classList.remove('trajectory-wave1');
      this.$nextTick(this.resizeChart)
    },
    // 单选框设置选中/未选中状态图标
    setIcon1(bool) {
      return bool
        ? 'icon-danxuankuang-yixuanzhong_huaban'
        : 'icon-danxuankuang-weixuanzhong_huaban disabled-icon'
    },
    // 数组元素求和/绝对值求和
    sum(arr, type) {
      let s = 0
      for (var i = arr.length - 1; i >= 0; i--) {
        if (type == 2) {
          s += arr[i]
        } else if (type == 3) {
          s += Math.abs(arr[i])
        }
      }
      return s
    },
    // 计算求和，绝对值求和的方法
    getTypeYarr(type, data) {
      let result = []
      let xArr360 = []
      if (type == 1) {
        result = cloneObj(data, true)
      } else {
        let resultY = new Array() //构造一个长度为60度的二维数组
        for (let i = 0; i < 360; i++) {
          resultY[i] = new Array()
          xArr360[i] = 0.5 + i
        }
        for (let i = 0, l = data.length; i < l; i++) {
          const xArr = data[i]
          for (let j = 0, len = xArr.length; j < len; j++) {
            let angle = Math.round((360 / len) * j) //每个点对应在坐标系内的角度
            if (angle === 360) {
              angle = 0
            }
            resultY[angle].push(xArr[j])
          }
        }
        for (let m = 0; m < resultY.length; m++) {
          resultY[m] = this.sum(resultY[m], type)
        }
        result = [cloneObj(resultY, true)]
      }
      return [result, xArr360]
    },
    // 等分截取数组形成新数组的方法
    getNewArr(data, proportion) {
      let num = 0
      let _data = []
      for (let i = 0; i < data.length; i++) {
        if (i % proportion == 0 && i != 0) {
          _data.push(data.slice(num, i))
          num = i
        }
        if (i + 1 == data.length) {
          _data.push(data.slice(num, i + 1))
        }
      }
      return _data
    },
    // 求和（阶次测点同一时间点波形求和，绝对值求和）
    getSumArr(type, data) {
      let newArr = []
      let result = []
      if (type == 1) {
        return data
      }
      for (let key in data) {
        //遍历数组的每一项
        data[key].forEach(function (val, index) {
          if (newArr[index] == null || newArr[index] == '') {
            newArr[index] = 0
          }
          if (type == 2) {
            // 求和
            newArr[index] += val
          } else if (type == 3) {
            // 绝对值求和
            newArr[index] += Math.abs(val)
          }
        })
      }
      result[0] = newArr
      return result
    },
    // 求数组中的最大值和最小值,type=1:最大值；type=2最小值
    getMaxNum(arr, type) {
      let max = arr[0]
      if (type === 1) {
        arr.forEach((item) => (max = item > max ? item : max))
      } else {
        arr.forEach((item) => (max = item < max ? item : max))
      }
      return max
    },
    resizeChart() {
      this.circleData[this.currentKey].chart.circle !== '' &&
        this.circleData[this.currentKey].chart.circle.resize()
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'circles',
    })
  },
}
</script>
<style scoped lang="scss">
.my-circle-chart {
  position: relative;
  height: calc(100vh - 143px);
  .select-date-type {
    position: absolute;
    top: 40px;
    left: 50px;
    z-index: 99999;
    .circleTypeList li {
      display: inline-block;
      margin-right: 12px;
      vertical-align: middle;
    }
  }
  .clickData {
    position: absolute;
    top: 60px;
    left: 0;
    .data-list {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
    }
  }
  .my-circle-cont {
    height: calc(100% - 50px);
    width: 100%;
    .view-data {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
    }
    .trajectory-wave {
      height: 100%;
      width: 100%;
      display: grid;
      grid-template-rows: 100%;
      grid-row-gap: 10px;
      .circle-wave {
        width: 100%;
        height: 100%;
        .my-circle-chart {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
      }
      .circle-trend {
        width: 100%;
        height: 100%;
        .my-trend-chart {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
      }
    }
    .trajectory-wave1 {
      grid-template-rows: 75% 22%;
      #loading-center-absolute {
        position: absolute;
        left: 50%;
        top: 35%;
        height: 50px;
        width: 150px;
        margin-top: -25px;
        margin-left: -66px;
      }
    }
    .circle-trend {
      width: 100%;
      height: 22%;
      margin-top: 10px;
      position: relative;
      .iconfont {
        font-size: 12px;
        position: absolute;
        right: 5px;
        top: 5px;
        z-index: 2;
      }
      .none-data-box {
        height: 100%;
      }
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
      line-height: 30px;
      width: 100px;
    }
    .get-real-data {
      margin-right: 20px;
    }
  }
  #loading-center-absolute {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 50px;
    width: 150px;
    margin-top: -25px;
    margin-left: -75px;
  }
  .object {
    width: 8px;
    height: 50px;
    margin-right: 5px;
    background-color: #48b4e3;
    -webkit-animation: animate 1s infinite;
    animation: animate 1s infinite;
    float: left;
  }

  .object:last-child {
    margin-right: 0px;
  }

  .object:nth-child(10) {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }
  .object:nth-child(9) {
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }
  .object:nth-child(8) {
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
  }
  .object:nth-child(7) {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  .object:nth-child(6) {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }
  .object:nth-child(5) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }
  .object:nth-child(4) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  .object:nth-child(3) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
  .object:nth-child(2) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  @-webkit-keyframes animate {
    50% {
      -ms-transform: scaleY(0);
      -webkit-transform: scaleY(0);
      transform: scaleY(0);
    }
  }
  @keyframes animate {
    50% {
      -ms-transform: scaleY(0);
      -webkit-transform: scaleY(0);
      transform: scaleY(0);
    }
  }
}
</style>
