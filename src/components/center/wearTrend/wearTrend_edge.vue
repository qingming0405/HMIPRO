<template>
  <div class="my-trend-chart box-shadow">
    <div
      class="select-none my-trend"
      v-for="(data, index) in trendData"
      :key="index"
      v-show="data.isShow"
    >
      <div
        class="trend-chart"
        :id="'screen-' + index"
        v-for="(item, idx) in data.chart"
        :key="item.chartId"
        :style="setHeight(data.chart)"
        @drop="addPos(idx, $event)"
        @dragover.prevent
      >
        <div class="trend-pos-list radius">
          <div class="trend-left-list">
            <span
              class="trend-eigenvalue"
              @click="switchEigenvalue($event, item)"
            >{{ item.eName }}</span>
            <span
              class="trend-close-chart"
              @click="closeOneChart(index, idx, item.chartId)"
            >
              <i class="iconfont icon-cuohao"></i>
            </span>
          </div>
          <div
            class="trend-left-list"
            v-for="(pos, id) in item.data"
            :key="id"
            @mousedown="removePos($event, item.data, id)"
            @contextmenu.prevent="contextmenu($event, item.data, id)"
          >
            <span
              v-if="item.value != 'mileage'"
              :title="pos.pos.tms_wheel!==null && pos.pos.tms_wheel!==''?pos.pos.tms_wheel:pos.pos.channel_name"
            >{{
              pos.pos.tms_wheel!==null && pos.pos.tms_wheel!==''?pos.pos.tms_wheel:pos.pos.channel_name
            }}</span>
            <span
              v-else
              :title="pos.pos.mac_name"
            >{{
              pos.pos.mac_name
            }}</span>
            <span
              class="set-color"
              ref="changeColor"
              @click="setColor(index, idx, id, $event)"
              :style="'background-color:' + pos.color"
            ></span>
          </div>
        </div>
        <div
          class="trend-chart-view"
          :id="item.chartId"
        >
        </div>
      </div>
      <div class="search-data">
        <button
          class="addPosTrend"
          @click="addTrend(fileds[0],'new')"
        >新增图谱</button>
        <button @click="dataRetrieval">数据检索</button>
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import myChart from '@/assets/js/myCharts.js'
import {
  getCodeObj,
  cloneObj,
  getdefaultCode,
  getUnit,
  setHead,
  getTime,
  matchRule,
} from 'utils/utils.js'
export default {
  name: 'wearTrend',
  data() {
    return {
      colorList: [
        '#F1B232',
        '#FF623B',
        '#EAD07B',
        '#E9EC46',
        '#BDE970',
        '#74DEA8',
        '#3093B5',
        '#A9BFE2',
        '#A25DB5',
        '#000000',
        '#CCCC00',
        '#993366',
        '#00CC99',
        '#996666',
        '#6666FF',
        '#999699',
        '#CC9933',
      ] /* 备选颜色 */,
      chartOptionColor: {
        /* 图谱option颜色 */
        axis: {
          /* 坐标轴 */
          name: '#fff' /* 标题 */,
          font: '#fff' /* 字体 */,
          line: '#fff' /* 轴线 */,
          splitLine: '#fff' /* 坐标轴分割线 */,
        },
        tool: {
          symbol: '#ff9b21' /* 圆点 */,
          line: '#ff9b21' /* 标线 */,
          font: '#fff' /* 字体 */,
          background: 'rgba(108, 145, 221, 0.8)' /* 背景蓝色 */,
        },
        series: {
          /* 图谱 */
          symbol: '#fff' /* symbol */,
        },
      },
      savePicBackgroundColor: '#092e55',
      currentKey: '' /* 当前显示趋势图索引 */,
      positionMsg: null /* 需显示测点信息 */,
      trendData: {} /* 图谱的数据信息 */,
      allPosData: {} /*所有踏面数据 macid_pid_ptype{时间戳：数据}} */,
      charts: {} /* myCharts */,
      fileds: [
        { value: 'diameter', name: '车轮直径' },
        { value: 'thickness', name: '轮缘厚度' },
        { value: 'height', name: '轮缘高度' },
        { value: 'mileage', name: '里程' },
      ],
      mileageList: {} /* 所有里程数据 macid_chclass{时间戳：里程} */,
    }
  },
  watch: {
    '$store.state.wearTrendMsg': {
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
      //监听structure的变化
      this.$nextTick(this.resizeChart)
    },
  },
  created() {
    /* 浏览器页面改变 刷新图谱 */
    window.addEventListener('resize', this.resizeChart)
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'wearTrend',
    })
  },
  methods: {
    openChartList(key, state) {
      if (typeof key !== 'string') return
      if (state === 0 || state == 1) {
        //新建图谱
        this.currentKey = key
        for (let k in this.trendData) {
          this.trendData[k].isShow = false
        }
      }
      switch (state) {
        case 0 /* 打开图表 */:
          const params = this.$store.state.srcParams
          const time = params.time
          this.$set(this.trendData, key, {
            chart: [], //每个tab包含的图谱
            startTime: time.start,
            endTime: time.end,
            isShow: true,
          })
          this.getData()
          for (let i = 0; i < this.fileds.length; i++) {
            if (i == 0) {
              this.addTrend(this.fileds[i])
            } else {
              setTimeout(() => {
                this.addTrend(this.fileds[i], 'new')
              }, 100 * i)
            }
          }

          break
        case 1 /* 切换图表 */:
          this.trendData[key].isShow = true
          for (let k = 0; k < this.trendData[key].chart.length; k++) {
            let chart = this.trendData[key].chart[k]
            if (!this.charts[chart.chartId]) {
              this.$nextTick(this.setOption())
              break
            }
          }
          this.$nextTick(this.resizeChart)
          break
        case 2 /* 关闭图表 */:
          this.closeAllCharts(key)
          break
      }
    },
    // 获取踏面预测数据
    getData() {
      this.maxLength = 0
      this.$getApi.getALLTreadData().then((res) => {
        if (res) {
          if (res.data && Object.keys(res.data).length > 0) {
            this.setData(res.data)
          }
        }
      })
    },
    setData(info) {
      const data = info
      const allPosData = {}
      for (let k in data) {
        let timeData = {}
        let item = data[k]
        item = JSON.parse(item)
        let compare = function (obj1, obj2) {
          return obj1.time - obj2.time
        }
        item.data_train.sort(compare)
        item.data_train.forEach((el) => {
          this.$set(timeData, el.time, el)
        })
        this.$set(allPosData, k, timeData)
      }
      this.allPosData = allPosData
    },
    dataRetrieval() {
      this.$retrieval({
        key: 'system',
      }).then((res) => {
        if (res) {
          this.trendData[this.currentKey].startTime = res.startTime
          this.trendData[this.currentKey].endTime = res.endTime
          this.getTendency()
        }
      })
    },
    //添加图层
    addTrend(filed, f) {
      let macId, posId, posType
      /* 当前选中有测点 */
      let checkMsg = this.$store.state.checkMsg
      /* 按钮添加 并且 有选中的测点 */
      if (checkMsg.type === 'pos' && f === 'new') {
        macId = checkMsg.pos.machine_id
        posId = checkMsg.pos.position_id
        posType = checkMsg.pos.position_type
        let flag = matchRule(posType, 'wearTrend')
        if (!flag) {
          this.$pop('不支持此类测点')
          return
        }
      } else {
        ;[, , macId, posId, posType] = this.currentKey.split('_')
      }
      let postions = this.$store.state.pos[macId] //获取当前机组下所有测点信息
      let posMsg
      /* 寻找当前测点信息 */
      postions.forEach((item) => {
        if (item.position_type == posType && item.position_id == posId) {
          posMsg = item
        }
      })

      let chart = this.trendData[this.currentKey].chart
      chart.push({
        count: 0 /* 当前图标图谱个数 */,
        chartId: new Date().valueOf(), //每个图层的唯一标识
        value: filed.value,
        eName: filed.name,
        data: {} /* macid_posid_postype:{数据} */,
      })
      let key = `${macId}_${posId}_${posType}`
      let index = chart.length - 1
      this.add_pos(key, chart[index], posMsg)
    },
    add_pos(key, chart, posMsg) {
      let chartDataLen
      chart.data && (chartDataLen = Object.keys(chart.data).length)
      let colorLen = this.colorList.length
      if (chartDataLen === 0) {
        colorLen = 1
      } else if (chartDataLen <= colorLen / 2) {
        colorLen = colorLen / 2
      }
      let num = Math.floor(Math.random() * colorLen)
      let color = this.colorList[num]
      let pos_name = posMsg.position_name
      this.$set(chart.data, key, {
        color: color,
        name: pos_name,
        pos: posMsg,
        tendencyList: [],
      })
      chart.count++ // 测点的计数+1
      // 获取趋势数据
      this.getTendency()
    },
    getTendency() {
      let chart = this.trendData[this.currentKey].chart
      let startTime = this.trendData[this.currentKey].startTime
      let endTime = this.trendData[this.currentKey].endTime
      for (let k in chart) {
        for (let key in chart[k].data) {
          const posMsg = chart[k].data[key].pos
          // 组织当前测点的里程数据
          let mileage = {},
            timeArr = []
          for (let index in this.allPosData) {
            let [mid, ,] = index.split('_')
            if (mid == posMsg.machine_id) {
              for (let time in this.allPosData[index]) {
                if (time >= startTime && endTime >= time) {
                  if (!mileage[time]) {
                    mileage[time] = this.allPosData[index][time].mileage
                    timeArr.push(time)
                  }
                }
              }
            }
          }
          // 对mileage对象的时间属性进行排序
          timeArr = timeArr.sort()
          var newmileage = {}
          for (var i in timeArr) {
            var itemKey = timeArr[i]
            newmileage[itemKey] = mileage[itemKey]
          }
          this.$set(
            this.mileageList,
            `${posMsg.machine_id}_${posMsg.ch_class}`,
            newmileage
          )
          if (this.allPosData[key]) {
            let data = this.allPosData[key],
              tendencyList = []
            for (let time in data) {
              if (time >= startTime && endTime >= time) {
                tendencyList.push({
                  saveTime: time,
                  diameter: data[time].diameter,
                  thickness: data[time].thickness,
                  height: data[time].height,
                })
              }
            }
            this.$set(chart[k].data[key], 'tendencyList', tendencyList)
          }
        }
      }
      this.$nextTick(this.setOption)
    },
    setOption(isResize = true) {
      //real 实时数据标志
      const charts = this.trendData[this.currentKey].chart
      let color = this.chartOptionColor
      let alarmArr = []
      for (let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        let X = []
        let Y = []
        let unitY = []
        let chartData = chart.data
        let posName = []
        let seriesColor = []
        let pos_key_list = [] //存放所有的测点key ，到时候跳转波形的时候使用
        for (let key in chartData) {
          const value = chartData[key]
          let tendencyList = value.tendencyList
          if (tendencyList.length == 0) continue //如果没有数据，跳过
          let x = [],
            y = [],
            xb = [],
            speed = [],
            y1 = [] /* g,gD => mm/s2  存储转换单位为mm/s2的数据*/
          let filed = chart.value
          if (filed != 'mileage') {
            unitY.push('mm')
          } else {
            unitY.push('km')
          }
          if (filed != 'mileage') {
            tendencyList.forEach((item, index) => {
              x.push(Number(item.saveTime))
              y.push(item[filed])
            })
          } else {
            for (let time in this.mileageList[
              `${value.pos.machine_id}_${value.pos.ch_class}`
            ]) {
              x.push(Number(time))
              y.push(
                this.mileageList[
                  `${value.pos.machine_id}_${value.pos.ch_class}`
                ][time]
              )
            }
          }
          Y.push(y)
          X.push(x)
          pos_key_list.push({
            key,
            name: value.pos.mac_name + '-' + value.pos.position_name,
          }) //有数据的时候加入测点的key
          seriesColor.push(value.color)
          const pos = value.pos
          posName.push(
            filed != 'mileage'
              ? pos.tms_wheel !== null && pos.tms_wheel !== ''
                ? pos.tms_wheel
                : pos.channel_name
              : pos.mac_name
          )
        }
        // 设置option
        var option = {
          grid: {
            top: 20, // 离容器上边距离，默认 60
            right: 10, // 离容器右边距离，默认 '10%
            left: 80, // 离容器左边距离，默认 '10%'
            bottom: 20, // 离容器下边距离，默认 60
          },
          x: {
            name: ['t(s)'],
            nameStyle: {
              color: color.axis.name,
              size: '14px',
              bold: 'normal',
            },
            type: 'time',
            data: X,
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
            name: unitY,
            nameStyle: {
              color: color.axis.name,
              size: '14px',
              bold: 'normal',
            },
            data: Y,
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
            /* 报警线 */
            markLine: alarmArr.length === 0 ? null : alarmArr,
          },
          series: {
            type: 'line', // 类型，默认 'line'
            lineStyle: {
              // 样式
              color: seriesColor, // 颜色，默认 '#0032ff
              width: 1, // 粗细，默认 1
            },
            posName,
            symbol: {
              show: false, //不显示
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
            formatter: (params) => {
              /* 其他谱图的联动 */
              Object.keys(this.charts).forEach((key) => {
                if (key != chart.chartId) {
                  this.charts[key].drawLineByX(params.val)
                }
              })
            }, // params = {key: number, val: number} =>  key: 下标，val: x 值
          },
        }
        if (!this.charts[chart.chartId]) {
          let dom = document.getElementById(chart.chartId)
          this.charts[chart.chartId] = myChart.init(dom)
        }
        this.charts[chart.chartId].setOption(option)
        if (isResize) {
          /* 需要改变图谱的结构，在添加和删除图谱的时候 */
          this.charts[chart.chartId].resize()
        }
      }
    },
    // 设置图谱dom高度
    setHeight(charts) {
      let len = 0
      charts.forEach((item) => {
        len++
      })
      let style = {
        height: `calc((100% - 50px) / ${len} - 1px)`,
        // height: "100px",
        marginTop: '1px',
      }
      len === 0 && delete style.marginTop
      return style
    },
    //切换特征值
    switchEigenvalue(event, chart) {
      let text = []
      var head = this.fileds
      head.forEach((item) => {
        text.push({
          filed: item.value,
          val: item.name,
        })
      })
      const size = event.target.getBoundingClientRect()
      let clientWidth = document.documentElement.clientHeight
      let top
      if (size.top + size.height + 200 > clientWidth) {
        top = size.top - 200 + 'px'
      } else {
        top = size.top + size.height + 'px'
      }
      this.$list({
        text,
        pattern: {
          maxHeight: '200px',
          top: top,
          left: size.left + 'px',
          width: size.width + 26 + 'px',
        },
      }).then((res) => {
        if (res.index !== -1) {
          chart.value = res.item.filed
          chart.eName = res.item.val
          this.setOption()
        }
      })
    },
    //拖入测点
    addPos(index, e) {
      const posMsg = JSON.parse(e.dataTransfer.getData('flag'))
      let key = `${posMsg.machine_id}_${posMsg.position_id}_${posMsg.position_type}`
      const chart = this.trendData[this.currentKey].chart[index]
      const type = posMsg.position_type
      if (!matchRule(type, 'wearTrend')) {
        this.$pop('不支持此类测点')
        return
      } else if (chart.data[key]) {
        this.$pop('当前图谱已存在该测点')
        return
      } else if (chart.value == 'mileage') {
        let flag = true
        for (let index in chart.data) {
          const pos = chart.data[index].pos
          if (
            pos.machine_id == posMsg.machine_id &&
            pos.ch_class == posMsg.ch_class
          ) {
            flag = false
          }
        }
        if (!flag) {
          this.$pop('当前图谱已存在当前车厢')
          return
        }
      } else {
        this.add_pos(key, chart, posMsg)
      }
    },
    //移除测点
    removePos(event, data, key) {
      if (event.button === 1) {
        this.$delete(data, key)
        this.setOption()
      }
    },
    //右键删除测点
    contextmenu(e, data, key) {
      let text = [{ type: 'del', val: '删除' }]
      const size = e.currentTarget.getBoundingClientRect()
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `${size.width - 40}px`,
          left: `${size.left + 50}px`,
          top: `${size.top + size.height + 3}px`,
        },
      }).then((res) => {
        if (res.item && res.item.type == 'del') {
          this.$delete(data, key)
          this.setOption()
        }
      })
    },
    // 关闭单张图谱
    closeOneChart(key, idx, chartId) {
      // this.$delete(this.charts, chartId); //删除chart实例
      // this.trendData[key].chart[idx].isDel = true;
      this.$delete(this.trendData[key].chart, idx)
      this.$nextTick(this.setOption)
    },
    //关闭所有图谱
    closeAllCharts(key) {
      let trend = this.trendData[key]
      /* 2、删除chart实例 */
      trend.chart.forEach((item) => {
        this.$delete(this.charts, item.chartId) //删除chart实例
      })
      /* 3、删除这个图谱的组件 */
      delete this.trendData[key]
      if (Object.keys(this.trendData).length === 0) {
        this.$store.commit('set_keepAlive', {
          method: 'del',
          keepAlive: 'wearTrend',
        })
      }
    },
    resizeChart() {
      let chart = this.charts
      let currentChart = this.trendData[this.currentKey].chart
      currentChart.forEach((item) => {
        chart[item.chartId] && chart[item.chartId].resize()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.my-trend-chart {
  .my-trend {
    position: relative;
    height: 100%;
    width: 100%;
    .trend-chart {
      width: 100%;
      height: calc(100% - 50px);
      display: grid;
      grid-template-columns: 130px calc(100% - 130px);
      & + div {
        margin-top: 1px;
      }

      .trend-pos-list {
        height: 100%;
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      // .trend-left-title {
      .trend-eigenvalue {
        padding-left: 5px;
        cursor: pointer;
      }
      // }
    }
    .search-data {
      height: 49px;
      line-height: 49px;
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      .addPosTrend {
        position: absolute;
        left: 15px;
        top: 10px;
      }
      button {
        height: 30px;
        width: 100px;
        margin: 0px 10px;
      }
      .no-real-date {
        background: #0072e6;
      }
    }
  }
}
</style>