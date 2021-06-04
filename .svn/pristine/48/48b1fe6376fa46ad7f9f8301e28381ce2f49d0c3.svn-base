<template>
  <div class="wave3d box-shadow">
    <div class="title">当前频率：{{ frequence }}</div>
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
      <!-- 右击列表 -->
      <ul
        class="clickRightMenu"
        id="clickRightMenu"
        ref="clickRightMenu"
        v-show="val.MenuShowflag"
      >
        <li
          v-if="!val.isHanning"
          @click="sethanning(key)"
        >
          <i class="iconfont icon-hanningchuang_huaban"></i>汉宁窗
        </li>
        <li
          v-else
          @click="sethanning(key)"
        >
          <i class="iconfont icon-hanningchuang_huaban"></i>取消汉宁窗
        </li>
        <li @click="savePic(key)">
          <i class="iconfont icon-savemage_huaban"></i>保存界面
        </li>
      </ul>
      <div
        :ref="key"
        class="spectrum-3d-chart"
        :class="val.className"
        v-resize='resize'
      ></div>
    </div>
    <div class="search-3d-data">
      <button @click="retrieval">数据检索</button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
import { getTime, cloneObj } from 'utils/utils.js'
export default {
  name: 'wave3d',
  data() {
    return {
      key: '',
      frequence: '',
      histogramIsShow: false,
      myTipsChart: '',
      chartData: {}, //key:{isShow:Boolean,vdata:[],dataY:[]}
      fft: [], //频谱图
      fftWithHanning: [], //频谱图带汉宁窗
      lineColor: '#000',
      t_root: 0,
      station: [], //站点信息
      colorList: [] // 备选颜色
    }
  },
  mounted() {
    /* 创造标签柱状图 */
    this.$nextTick(this.init_histogram)
  },
  watch: {
    '$store.state.wave3dMsg': {
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
      let pos
      if (state === 0) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
      } else if (state === 1) {
        pos = this.chartData[key].pos
      }
      this.histogramIsShow = false //改变图谱的时候关闭柱状图
      if (state == 0) {
        //添加数据
        this.$set(this.chartData, key, {
          isShow: true,
          className: key,
          minValid: '',
          maxValid: '',
          tipsArray: {}, //存放所有频率和幅值的对应
          lineNum: 5,
          pos,
          vdata: [],
          dataY: [],
          dataYUnit: '时间',
          echart: '', //3d图谱的实例
          histogram: '', //柱状图的实例
          MenuShowflag: false, //右键菜单是否显示
          isHanning: false, //是否汉宁窗
          freq: [], //频率
        })
        let startTime = this.$store.state.srcParams.time.start
        let endTime = this.$store.state.srcParams.time.end
        this.get_Info([startTime, endTime])
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
    delete_3d_chart(key) {
      //销毁实例
      this.chartData[key].echart && this.chartData[key].echart.dispose()
      this.$delete(this.chartData, key)
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
        /* 模拟双击点击跳转到对应波形图的功能模块 */
        let simulate_dblclick = () => {
          let oldTime = new Date().valueOf()
          return (params) => {
            let nowTime = new Date().valueOf()
            if (nowTime - oldTime < 300) {
              let time = params.data[1]
              time = new Date(time).valueOf()
              this.$store.commit('setCurrentTime', time)
              let key = 'wave' + this.key.slice(6) //wave3d_pos_14121310332547010_0_3
              //跳转到波形图
              let name = '波形频谱图'
              let titleName = value.pos.mac_name + '-' + '波形频谱图'
              this.$bus.$emit('choiceChartType', key, name, titleName)
            } else {
              this.update_histogram()
            }
            oldTime = nowTime
          }
        }
        myChart.on('click', simulate_dblclick())
        // 右键方式
        // params => {
        //   if (params.event.event.button === 2) {
        //     let time = params.data[1];
        //     time = new Date(time).valueOf();
        //     /* 存储当前的时间点 */
        //     this.$store.commit("setCurrentTime", time);
        //     /* 获取波形图的key */
        //     let = key = "wave" + this.key.slice(6);//wave3d_pos_14121310332547010_0_3
        //     //跳转到波形图
        //     this.$parent.$parent.$refs.header.choiceChartType(
        //       key,
        //       "波形频谱图",
        //       true
        //     );
        //   }
        // }
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
        color: this.colorList,
        xAxis3D: {
          type: 'value',
          name: '频率(Hz)',
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
          name: value.dataYUnit,
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
          name: '幅值',
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
            distance: 500,
            minDistance: 200,
            maxDistance: 800,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: (prams, d, callback) => {
            this.update_frequence(prams.value[0])
            return `频率:${prams.value[0]}Hz<br/>
                    幅值:${prams.value[2]}<br/>
                    时间:${prams.value[1]}<br/>`
          },
        },
        series: series,
      }
      // window.addEventListener("resize", function() {
      //   myChart.resize();
      // });

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, { replaceMerge: ['series'] })
      myChart.resize()
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
      let obj = this.chartData[this.key].tipsArray
      let sData = []
      let xData = []
      let histoData = []
      let index = 1
      for (let key in obj) {
        let val = obj[key][freq] || 0
        let colorIndex = (index - 1) % this.colorList.length
        sData.push({value: val, itemStyle: {color: this.colorList[colorIndex]}})
        xData.push(index)
        histoData.push({time: key, val: val})
        index++
      }
      let option = {
        title: {
          show: true,
          text: '左视图',
          textAlign: 'center',
          x: 'right',
          textStyle: {
            color: this.lineColor,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            let tip = ''
            if (params.length > 0 && params[0].data != null) {
              let dataIndex = params[0].dataIndex
              tip = '时间：' + histoData[dataIndex].time + '<br>' + '幅值：' + histoData[dataIndex].val
            }
            return tip
          }
        },
        grid: {
          left: '3%',
          right: '15%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            name: '序号',
            nameTextStyle: {
              color: this.lineColor, //坐标名颜色
            },
            nameLocation: 'end',
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            data: xData,
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
            name: '幅值',
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
            name: '幅值',
            type: 'bar',
            barWidth: '40%',
            data: sData,
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
    get_Info(
      currTime,
      lineNum = 5,
      fromSpeed = null,
      toSpeed = null,
      minValid = null,
      maxValid = null,
      density = 2
    ) {
      let [, , macId, posId, posType] = this.key.split('_')
      let params = this.chartData[this.key]
      let args = {
        machineId: macId,
        positionId: posId,
        positionType: posType,
        currTime,
        lineNum,
        fromSpeed,
        toSpeed,
        density,
        t_root: params.pos.t_root,
      }
      this.$emit('loadingImg', true)

      this.$getApi.getWaveformAndSpectrum(args).then((res) => {
        this.$emit('loadingImg', false)
        if (res) {
          if (res.info.length == 0) {
            this.$pop('当前时间没有数据')
            return
          }
          let vdata = [],
            dataY = [],
            tipsArray = {} //vdata 存放数据，dataY存放日期
          let freq = []
          this.fftWithHanning = []
          this.fft = []
          res.info.forEach((item) => {
            this.fftWithHanning.push(item.fftWithHanning)
            this.fft.push(item.fft)
            let arr = []
            let fft = item.fft //获取FFT之后的数据
            let time = getTime(item.saveTime)
            let temp = (tipsArray[time] = {}) //存每条线的幅值和频率对应关系
            freq.push(item.waveObject.freq)
            for (let i = 0; i < fft.OutY.length; i++) {
              /* 有效频率过滤模块 */
              if (minValid && maxValid) {
                if (fft.OutX[i] < minValid || fft.OutX[i] > maxValid) continue
              }
              temp[fft.OutX[i]] = fft.OutY[i] //存每条线的幅值和频率对应关系
              arr.push([fft.OutX[i], time, fft.OutY[i]])
            }
            vdata.push(arr)
            dataY.push(time)
          })
          this.chartData[this.key].vdata = vdata
          this.chartData[this.key].dataY = dataY
          this.chartData[this.key].tipsArray = tipsArray
          this.chartData[this.key].freq = freq
          this.init_3d_chart()
        }
      })
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
    // 设置汉宁窗
    sethanning(key) {
      this.chartData[this.key].MenuShowflag = false
      this.chartData[this.key].isHanning = !this.chartData[this.key].isHanning
      let minValid = Number(this.chartData[this.key].minValid)
      let maxValid = Number(this.chartData[this.key].maxValid)
      let vdata = []
      let dataY = this.chartData[this.key].dataY
      if (this.chartData[this.key].isHanning) {
        //设置pin汉宁窗
        for (let j = 0; j < dataY.length; j++) {
          let arr = []
          let time = dataY[j]
          let fftWithHanning = this.fftWithHanning[j]
          let temp = (this.chartData[this.key].tipsArray[time] = {})
          for (let i = 0; i < fftWithHanning.OutY.length; i++) {
            /* 有效频率过滤模块 */
            if (minValid && maxValid) {
              if (
                fftWithHanning.OutX[i] < minValid ||
                fftWithHanning.OutX[i] > maxValid
              )
                continue
            }
            temp[fftWithHanning.OutX[i]] = fftWithHanning.OutY[i] //存每条线的幅值和频率对应关系
            arr.push([fftWithHanning.OutX[i], time, fftWithHanning.OutY[i]])
          }
          vdata.push(arr)
        }
      } else {
        //设置正常数据
        for (let j = 0; j < dataY.length; j++) {
          let arr = []
          let time = dataY[j]
          let fft = this.fft[j]
          let temp = (this.chartData[this.key].tipsArray[time] = {})
          for (let i = 0; i < fft.OutY.length; i++) {
            /* 有效频率过滤模块 */
            if (minValid && maxValid) {
              if (fft.OutX[i] < minValid || fft.OutX[i] > maxValid) continue
            }
            temp[fft.OutX[i]] = fft.OutY[i] //存每条线的幅值和频率对应关系
            arr.push([fft.OutX[i], time, fft.OutY[i]])
          }
          vdata.push(arr)
        }
      }
      this.chartData[this.key].vdata = vdata
      this.init_3d_chart()
    },
    // 保存图片
    savePic(key) {
      this.chartData[this.key].MenuShowflag = false
      let picture = this.$refs[this.key][0].firstChild.children[0]
      var pictureURI = picture.toDataURL()
      let downLoad = document.createElement('a')
      downLoad.href = pictureURI
      downLoad.download = '3D频谱图.png'
      downLoad.dispatchEvent(new MouseEvent('click'))
    },
    resize() {
      if(this.chartData[this.key] && this.chartData[this.key].echart){
        this.chartData[this.key].echart.resize()
      }
    },
    /* 搜索框 */
    retrieval() {
      this.chartData[this.key].isHanning = false
      let chart = this.chartData[this.key]
      let lineNum = chart.lineNum
      let minValid = chart.minValid
      let maxValid = chart.maxValid
      this.$retrieval({
        key: 'wave3d',
        params: {
          lineNum,
          minValid,
          maxValid,
        },
      }).then((res) => {
        if (res) {
          let lineNum = res.lineNum === '' ? null : parseInt(res.lineNum)
          let currTime = [res.startTime, res.endTime]
          let fromSpeed, toSpeed, minValid, maxValid, density
          if (res.minSpeed !== '' && res.maxSpeed !== '') {
            fromSpeed = res.minSpeed
            toSpeed = res.maxSpeed
          }
          if (res.minValid !== '' && res.maxValid !== '') {
            minValid = res.minValid
            maxValid = res.maxValid
            /* 保存有效频率 */
            chart.minValid = minValid
            chart.maxValid = maxValid
          }
          density = res.density.type
          chart.lineNum = lineNum
          this.get_Info(
            currTime,
            lineNum,
            fromSpeed,
            toSpeed,
            minValid,
            maxValid,
            density
          )
        }
      })
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'wave3d',
    })
  },
}
</script>
