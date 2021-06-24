<!-- 波磨数据分析图 -->
<template>
  <div class="my-trend-chart box-shadow">
    <div
      class="select-none my-trend"
      v-for="(data, index) in chartData"
      :key="index"
      v-show="data.isShow"
    >
      <div
        class="trend-chart"
        v-for="(item, idx) in data.chart"
        :key="item.chartId"
        v-show="!item.isDel"
        :style="setHeight(data.chart)"
        @drop="addDataItem(idx, $event)"
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
            v-for="(posTime, id) in item.data"
            :key="id"
            @mousedown="removePos($event, item.data, id)"
            @contextmenu.prevent="contextmenu($event, item.data, id)"
          >
            <span :title="
                posTime.itemInfo.posInfo.name + '-' + posTime.itemInfo.val
              ">{{ posTime.itemInfo.val }}</span>
            <span
              class="set-color"
              ref="changeColor"
              @click="setColor(index, idx, id, $event)"
              :style="'background-color:' + posTime.color"
            ></span>
          </div>
        </div>

        <div
          class="trend-chart-view"
          :id="item.chartId"
          @contextmenu.prevent="showMenu(item.MenuShowflag, idx)"
          v-resize='resize'
        >
          <!-- 右击列表 -->
          <!-- <ul
            class="clickRightMenu"
            id="clickRightMenu"
            :ref="idx"
            v-show="item.MenuShowflag"
          >
            <li @click.stop="dataInput(idx)">
              <i class="iconfont icon-exportdata_huaban"></i>数据导出
            </li>
            <li @click.stop="savePic(idx)">
              <i class="iconfont icon-savemage_huaban"></i>保存
            </li>
          </ul> -->
        </div>
      </div>
      <div class="search-data">
        <!--   <button class="addPosTrend" @click="addTrend('new')">新增图谱</button> -->
        <button
          class="get-real-data"
          @click="timeList"
        ><!-- 数据列表 -->{{$t('tmsTrend.DataList')}}</button>
        <button @click="dataRetrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import json2csv from 'json2csv'
import html2canvas from 'html2canvas'
import myChart from '@/assets/js/myCharts.js'
import {
  codeObj,
  cloneObj,
  defaultCode,
  getUnit,
  setHead,
  getTime,
  matchRule,
  setLine,
} from 'utils/utils.js'
import { log } from 'three'
export default {
  name: 'tmstrend',
  data() {
    return {
      currentKey: '' /* 当前显示趋势图索引 */,
      chartData: {} /* 图谱的数据信息 */,
      chartOptionColor: {
        /* 图谱option颜色 */
        axis: {
          /* 坐标轴 */
          name: '#666' /* 标题 */,
          font: '#666' /* 字体 */,
          line: '#B3B3B3' /* 轴线 */,
          splitLine: '#ccc' /* 坐标轴分割线 */,
        },
        tool: {
          symbol: '#6C91DD' /* 圆点 */,
          line: '#6C91DD' /* 标线 */,
          font: '#fff' /* 字体 */,
          background: 'rgba(108, 145, 221, 0.8)' /* 背景 */,
        },
        series: {
          /* 图谱 */
          symbol: '#fff' /* symbol */,
        },
      },
      timer: null, //来控制多个chart 更新一次
      colorList: [
        '#000000',
        '#CCCC00',
        '#993366',
        '#00CC99',
        '#996666',
        '#6666FF',
        '#999699',
        '#CC9933',
      ] /* 备选颜色 */,
    }
  },
  watch: {
    '$store.state.tmstrendMsg': {
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
    // 打开趋势图
    openChartList(key, state) {
      let [, , macId] = key.split('_')
      if (typeof key !== 'string') return
      if (state === 0 || state == 1) {
        //新建图谱
        this.currentKey = key
        for (let k in this.chartData) {
          this.chartData[k].isShow = false
        }
      }
      switch (state) {
        case 0 /* 打开图表 */:
          this.$set(this.chartData, key, {
            chart: [], //每个图谱
            chartIns: {}, // 图谱实例
            requestData: null, //请求参数
            requesetData_Time: {}, //请求时间的参数
            /*lineInfo:站点信息
            route；选中的线路的信息
            startStation：起始站
            terminal:终点站
              */
            stationInfo: [], //每个站点的信息
            macId,
            requesetData_val: {
              choosePos: {}, //选中的测点
              chooseTimeList: {}, //选中的测点的时间列表
              posList: [], //可选测点的列表
              timeList: {}, //所有的时间列表
            }, //时间搜索框的参数
            isShow: true, // 每个 tab图谱 的显示
          })
          /* 获取站点信息 */
          let chartData = this.chartData[key]
          this.getStationInfo(chartData)
          // 添加图层
          this.addTrend()

          break
        case 1 /* 切换图表 */:
          this.chartData[key].isShow = true
          // for (let k = 0; k < this.chartData[key].chart.length; k++) {
          //   let chart = this.chartData[key].chart[k];
          //   if (!this.charts[chart.chartId]) {
          //     this.$nextTick(this.setOption());
          //     break;
          //   }
          // }
          // this.$nextTick(this.resizeChart);
          break
        case 2 /* 关闭图表 */:
          this.closeAllCharts(key)
          break
      }
    },
    //中键移除测点
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
    //切换特征值
    switchEigenvalue(event, chart) {
      let text = []
      var head = {}
      // head为通过setHead获取到的特征值
      head = setHead(
        chart.posInfo.t_root,
        chart.posInfo.dgm_type,
        chart.posInfo.position_type
      )
      head.forEach((item) => {
        if (item.filed == 'saveTime_Com') return
        if (item.val instanceof Array) {
          item.val = item.val[0] /* 合成倾角多个特征值暂时不选择 */
        }
        text.push({
          filed: item.filed,
          code: item.code,
          val: item.val,
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
          chart.code = res.item.code
          chart.value = res.item.filed
          chart.eName = res.item.val
          this.getData(chart)
        }
      })
    },
    // 关闭单张图谱
    closeOneChart(key, idx, chartId) {
      // this.$delete(this.charts, chartId); //删除chart实例
      // this.chartData[key].chart[idx].isDel = true;
      this.$delete(this.chartData[key].chart, idx)
      this.$nextTick(this.setOption)
    },
    //关闭所有图谱
    closeAllCharts(key) {
      if (Object.keys(this.chartData).length === 0) {
        this.$store.commit('set_keepAlive', {
          method: 'del',
          keepAlive: 'tmstrend',
        })
      }
    },
    //添加图层
    addTrend(f) {
      //f留着可以判断是从哪里打开的图谱
      let chartData = this.chartData[this.currentKey]
      /* 获取当前测点的信息 */
      let macId,
        posId,
        posType
        /* 当前选中有测点 */
      ;[, , macId, posId, posType] = this.currentKey.split('_')
      let postions = this.$store.state.pos[macId] //获取当前机组下所有测点信息
      let posInfo
      /* 寻找当前测点信息 */
      postions.forEach((item) => {
        if (item.position_type == posType && item.position_id == posId) {
          posInfo = item
        }
      })
      chartData.requesetData_val.posList.push(posInfo) //将当前页面的测点放入到全局中 //新开图谱需要进行判断是否已经存在该测点
      /* 将选中测点变成当前测点 */
      chartData.requesetData_val.choosePos = posInfo
      let chart = chartData.chart
      let fileds = defaultCode[posType] //获取默认特征值
      chart.push({
        chartId: new Date().valueOf(), //每个图层的唯一标识
        posInfo,
        posType: posInfo.position_type, //来确定数据是否可以添加到这个chart
        code: fileds.code, // 当前图标的特征值
        value: fileds.filed,
        eName: fileds.name,
        data: {},
        MenuShowflag: false, // 右键标签
      })
      let index = chart.length - 1

      // this.add_item(key, chart[index]);
    },
    //添加数据列表
    add_item(item, chart) {
      /* 通过判断测点类型 是否是统一机组来判断这个测点是否能够拖入 */
      let chartType = chart.posType
      if (item.positionType !== chartType) {
        this.$pop(this.$t('tmsTrend.TipAddSamepType'))//请添加同类型的测点
      }
      let key = ''
      /* 判断数据是否已经存在 */
      if (chart.data[item.key]) {
        // this.$pop("已经存在条数据");
      }
      //在实时数据开启的时候添加测点没做特殊处理
      let num = Math.floor(Math.random() * this.colorList.length)
      let color = this.colorList[num]
      //创建一个测点的存储对象
      this.$set(chart.data, item.key, {
        color: color,
        itemInfo: item,
        cond: [], //工况报警
        tendencyList: [],
      })

      this.getData(chart) // 去获取图谱的数据
    },
    /* 普通数据检索 发送网络请求 */
    getData(chart) {
      this.$emit('loadingImg', true)
      /* 便利在这chart */
      let requesetData_Time = this.chartData[this.currentKey].requesetData_Time
      let pararmKeyList = Object.keys(chart.data)
      let requestData = {
        key: pararmKeyList,
        density: requesetData_Time.density.type,
        startStationId: requesetData_Time.startStation.station_id,
        endStationId: requesetData_Time.terminal.station_id,
        code: chart.code,
      }

      this.$getApi.getTrackCorrugationAnalysisChart(requestData).then((res) => {
        this.$emit('loadingImg', false)
        if (res) {
          if (res.msg === 0) {
            let flag = true //显示无数据
            let data = res.data
            for (let key in data) {
              let tendencyList = data[key].tendencyList
              let cond = data[key].cond
              if (tendencyList) {
                flag = false
              }
              chart.data[key].tendencyList = tendencyList
              chart.data[key].cond = cond
            }
            if (flag) {
              this.$pop(this.$t('tmsTrend.TipNoData'))//存在无数据时间点
            }
            /* 多个chart 只更新一次 */
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.setOption()
            }, 100)
          }
        }
      })
    },

    // 设置option, 画图
    setOption() {
      //real 实时数据标志
      const chartData = this.chartData[this.currentKey]
      let routeIndex = chartData.requesetData_Time.route.index //线路
      let stationInfo = chartData.stationInfo[routeIndex]
      const charts = chartData.chart
      const cond = chartData.cond // 工况
      let getWave = chartData.getWave
      let color = this.chartOptionColor
      let alarmArr = []
      for (let i = 0; i < charts.length; i++) {
        let chart = charts[i]
        let X = []
        let Y = []
        let unitY = []
        let oneChartData = chart.data
        let posName = []
        let seriesColor = []
        for (let key in oneChartData) {
          const value = oneChartData[key]
          let tendencyList = value.tendencyList
          if (!tendencyList) continue //如果没有数据，跳过
          let x = [],
            y = []
          tendencyList.forEach((item, index) => {
            if (item.value > 100000000) return
            x.push(item.mileage)
            y.push(item.value)
          })
          X.push(x)
          Y.push(y)
          seriesColor.push(value.color)
          let itemInfo = value.itemInfo
          let posInfo = itemInfo.posInfo
          let type = posInfo.position_type
          posName.push(posInfo.position_name + itemInfo.val)
          if (posInfo.units) {
            unitY.push(getUnit(chart.code, posInfo))
          } else {
            unitY.push('') //没有单位 占一个位置
          }
        }
        // 设置option
        var option = {
          grid: {
            top: 20, // 离容器上边距离，默认 60
            right: 10, // 离容器右边距离，默认 '10%
            left: 80, // 离容器左边距离，默认 '10%'
            bottom: 50, // 离容器下边距离，默认 60
          },
          x: {
            name: ['m'],
            nameStyle: {
              color: color.axis.name,
              size: '14px',
              bold: 'normal',
            },
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
            stationInfo: stationInfo, //车站信息
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
            formatter: function () {}, // params = {key: number, val: number} =>  key: 下标，val: x 值
          },
        }
        if (!chartData.chartIns[chart.chartId]) {
          let dom = document.getElementById(chart.chartId)
          chartData.chartIns[chart.chartId] = myChart.init(dom)
        }
        chartData.chartIns[chart.chartId].setOption(option)
      }
    },
    // 设置图谱dom高度
    setHeight(charts) {
      let len = 0
      charts.forEach((item) => {
        !item.isDel && len++
      })
      let style = {
        height: `calc((100% - 50px) / ${len} - 1px)`,
        // height: "100px",
        marginTop: '1px',
      }
      len === 0 && delete style.marginTop
      return style
    },
    /* 加入测点的方法 */
    tmsTrendAddPos() {
      /* 获取当前选择的测点 */
      let checkMsg = this.$store.state.checkMsg.pos
      let chartData = this.chartData[this.currentKey]
      if (checkMsg) {
        let posList = this.chartData[this.currentKey].requesetData_val.posList
        /* 判断 是否已经存在该测点 */
        let flag = false //不存在该测点
        posList.forEach((item) => {
          if (
            item.machine_id == checkMsg.machine_id &&
            item.position_type == checkMsg.position_type &&
            item.position_id == checkMsg.position_id
          ) {
            flag = true
          }
        })
        if (flag) return
        /* 不存在 */
        posList.push(checkMsg)
        /* 将选中的测点改为当前测点 */
        chartData.requesetData_val.choosePos = checkMsg
        let requesetData_Time = chartData.requesetData_Time
        let requestData = {
          machineId: checkMsg.machine_id,
          positionId: checkMsg.position_id,
          positionType: checkMsg.position_type,
          startTime: requesetData_Time.startTime,
          endTime: requesetData_Time.endTime,
        }

        /* 获取该测点的相关数据包 */
        this.getTimeList(requestData, chartData, checkMsg)
      }
    },
    //拖入测点
    addDataItem(index, e) {
      const posMsg = JSON.parse(e.dataTransfer.getData('flag'))
      const chart = this.chartData[this.currentKey].chart[index]
      this.add_item(posMsg, chart)
    },
    // 设置谱线颜色
    setColor(index, idx, id, e) {
      const color = this.chartData[index].chart[idx].data[id].color
      const size = e.currentTarget.getBoundingClientRect()
      this.$color({
        pattern: {
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
        color,
      }).then((res) => {
        this.chartData[index].chart[idx].data[id].color = res
        // this.$forceUpdate();
        this.setOption()
      })
    },

    /*
    右键显示菜单事件
    1.判断是否在图区域内
    2.若在区域内设定MenuShowflag = !showMenuflag
    3.设置右键菜单位置
    */
    showMenu(showMenuflag, index) {
      var event = event || window.event
      this.chartData[this.currentKey].chart[index].MenuShowflag = !showMenuflag
      var clickRightMenu = this.$refs[`${index}`]
      // 设置右键菜单位置
      clickRightMenu[0].style.top = event.offsetY + 'px'
      clickRightMenu[0].style.left = event.offsetX + 'px'
      return false
    },
    /*
    数据导出
    1.拼接数据
    2.转化为csv
    3.设定点击下载
    */
    dataInput(index) {
      /*    this.chartData[this.currentKey].chart[index].MenuShowflag = false;
      // 一个表的数据
      let trend = this.chartData[this.currentKey].chart[index];
      let type = Number(trend.type);
      const codeArr = codeObj[type];
      var eigenvalue = "";
      // 取特征值
      for (let i = 0; i < codeArr.length; i++) {
        if (trend.code === codeArr[i].code) {
          eigenvalue = codeArr[i].name;
          break;
        }
      }
      let myData = [];
      let body = trend.data;
      for (let key in body) {
        body[key].tendencyList.forEach((value) => {
          value.Time = getTime(value.saveTime);
          myData.push({
            测点名称: body[key].name,
            特征值: eigenvalue,
            x轴: value.Time,
            y轴: value.tempValue,
          });
        });
      }
      let fields = ["测点名称", "特征值", "x轴", "y轴"];
      var Parser = require("json2csv").Parser;
      let json2csvParser = new Parser({ fields });
      let csv = json2csvParser.parse(myData);
      csv = "\ufeff" + csv;
      var aTag = document.createElement("a");
      var blob = new Blob([csv]);
      aTag.download = "趋势图数据.csv";
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob); */
    },
    /*
    保存图片
    1.获取document
    2.通过toDataURL画布里的图案转变成base64编码格式的png
     1>获取到一个canvas的对象数组picture
     2>将picture[0]赋值给canvas，并转为CanvasRenderingContext2D，
     将数组下标不为0的其他canvas用drawImage方法重叠
     3》最后将获得到的canvas转为base64编码格式的png
    */
    savePic(index) {
      this.chartData[this.currentKey].chart[index].MenuShowflag = false
      let chartId = this.chartData[this.currentKey].chart[index].chartId
      let picture = document.getElementById(chartId).lastChild
      new html2canvas(picture, {
        backgroundColor: this.savePicBackgroundColor,
        useCORS: true,
        scale: 0.5,
      }).then((canvas) => {
        let downLoad = document.createElement('a')
        downLoad.href = canvas.toDataURL()
        downLoad.download = this.$t('HeaderEdge.secondLevel2_5')+'.png'//轨道波磨图
        downLoad.dispatchEvent(new MouseEvent('click'))
      })
    },
    resizeChart() {
      let currentChart = this.chartData[this.currentKey].chart
      currentChart.forEach((item) => {
        if (item.chartIns) {
          item.chartIns.resize()
        }
      })
    },

    getStationInfo(chartData) {
      /* 获取站点信息 */
      this.$getApi.getLineInfo({ machineId: chartData.macId }).then((res) => {
        if (res) {
          let result = setLine('0', res.stations)
          if (result[0].length === 0) return //第一条线路没有值
          let requesetData_Time = chartData.requesetData_Time
          requesetData_Time.lineInfo = result
          requesetData_Time.route = { name: this.$t('tmsTrend.Line1'), index: 0 } //线路1  默认第一条路线 
          /* 计算每个站点的总路程 */
          result.forEach((line) => {
            let distance = 0
            line.forEach((item) => {
              distance += Number(item.station_interval)
              item.distance = distance
            })
          })
          chartData.stationInfo = result
          /* 打开搜索框 */
          this.dataRetrieval()
        }
      })
    },
    // 数据检索
    dataRetrieval() {
      let chartData = this.chartData[this.currentKey]
      this.$retrieval({
        key: 'tmsTrend',
        params: chartData.requesetData_Time,
      }).then((res) => {
        if (res) {
          /* 保存请求参数 */
          chartData.requesetData_Time = res
          let posList = chartData.requesetData_val.posList
          /* 原有数据的初始化 */
          chartData.requesetData_val.timeList = {}
          chartData.requesetData_val.chooseTimeList = []
          posList.forEach((item) => {
            /* 获取参数去请求时间集合 */
            let requesetData_time = {
              machineId: item.machine_id,
              positionId: item.position_id,
              positionType: item.position_type,
              startTime: res.startTime,
              endTime: res.endTime,
            }
            this.getTimeList(requesetData_time, chartData, item, 'auto')
          })
        }
      })
    },
    // 获取时间集合
    getTimeList(requesetData, chartData, posInfo, flag) {
      /* 获取当前时间段下面的数据包 */
      this.$getApi.getTimeBatch(requesetData).then((result) => {
        if (result.info && result.info.length > 0) {
          /* 时间检索的参数 */
          let posFlag =
            requesetData.machineId +
            '_' +
            requesetData.positionId +
            '_' +
            requesetData.positionType
          result.info.forEach((item) => {
            item.val = getTime(item.startTime)
            item.posInfo = posInfo
            item.key = posFlag + '_' + item.startTime + '_' + item.endTime
            item.positionType = requesetData.positionType
          })
          chartData.requesetData_val.timeList[posFlag] = result.info
          if (chartData.requesetData_val.choosePos.posFlag == posFlag) {
            /* 将已经选中的测点的相关数据放入 */
            chartData.requesetData_val.chooseTimeList = result.info
          }
          if (flag == 'auto') {
            /* 打开时间的搜索列表 */
            this.timeList()
          }
        }
      })
    },
    /* 测点对应 的时间列表 */
    timeList() {
      let chartData = this.chartData[this.currentKey]
      let requesetData_val = chartData.requesetData_val
      if (requesetData_val) {
        this.$tmstrendData({
          viewMsg: requesetData_val,
        }).then((res) => {
          // console.log("成功关闭");
        })
      }
    },
    resize() {
      if (
        this.chartData[this.currentKey] &&
        this.chartData[this.currentKey].chartIns
      ) {
        let chartIns = this.chartData[this.currentKey].chartIns
        for (let k in chartIns) {
          if (chartIns[k]) {
            chartIns[k].resize()
          }
        }
      }
    },
  },
  created() {
    /* 浏览器页面改变 刷新图谱 */
    window.addEventListener('resize', this.resizeChart)
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'tmstrend',
    })
    /* 注册一个加入测点的方法 */
    this.$bus.$on('tmsTrendAddPos', this.tmsTrendAddPos)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  },
}
</script>
