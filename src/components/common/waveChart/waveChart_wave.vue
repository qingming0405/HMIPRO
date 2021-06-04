<!-- 波形频谱图图谱 -->
<template>
  <div class="my-wave-chart">
    <i
      class="iconfont"
      v-for="(item, index) in chartBtn"
      :key="index"
      :class="setClass(index)"
      :title="setTitle(index)"
      v-show="setViewIcon(item)"
      @click="handler(index, $event)"
    >
    </i>
    <p
      class="none-data-box"
      v-if="empty && empty.isShow"
    >
      <span>{{ empty.text }}</span>
    </p>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import myChart from '@/assets/js/myCharts.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  // opt 图谱类型，一个是用途是对比chartBtn的flag判断chartBtn
  // option 用于画图
  // index currentKey
  // isNewChart 判断是否是新表格
  // structure 获取结构样式刷新表格（频谱图、专家频谱图）
  // clickTrend 是否点击趋势图（频谱图、专家频谱图）
  // flag
  // empty isShow：是否显示text内容；text：无数据时显示text（频谱图，专家频谱图）数据未加载完成或数据为空时
  // isTimeDifferent：时间差
  //  isSpeedPulse:转速脉冲
  props: [
    'opt',
    'option',
    'index',
    'isNewChart',
    'structure',
    'empty',
    'isTimeDifferent',
    'developChart',
    'clickTrend',
    'isSpeedPulse',
  ],
  data() {
    return {
      chart: {},
      maximization: false,
      logChart: false,
      chartBtn: [
        /* 0 */ {
          class: 'icon-selectunit_huaban',
          title: '单位选择',
          flag: [1, 2, 0, 3, 7, 8, 9],
          viewType: [2],
        },
        /* 1 */ {
          class: 'icon-MAX_huaban',
          title: '最大化',
          flag: [1, 2, 0, 3, 7, 8, 9],
          viewType: [0, 1, 2],
        },
        /* 2 */ {
          class: 'icon-exporemusic_huaban',
          title: '音频导出',
          flag: [0],
        },
        /* 3 */ {
          class: 'icon-exportdata_huaban',
          title: '数据导出',
          flag: [0, 1, 3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 4 */ {
          class: 'icon-restore_huaban',
          title: '重置',
          flag: [1, 2, 0, 3, 6, 7, 8, 9],
          viewType: [0, 1, 2],
        },
        /* 5 */ {
          class: 'icon-enlarge_huaban',
          title: '选框放大',
          flag: [1, 2, 0, 3, 6, 7, 8, 9],
          viewType: [0, 1, 2],
        },
        /* 6 */ {
          class: 'icon-savemage_huaban',
          title: '保存为图片',
          flag: [1, 2, 0, 3, 6, 7, 8, 9],
          viewType: [0, 1, 2],
        },
        /* 7 */ {
          class: 'icon-setpower_huaban',
          title: '所有测点有效频段设置',
          flag: [1],
        },
        /* 8 */ {
          class: 'icon-subtime_huaban',
          title: '时间差',
          flag: [0],
        },
        /* 9 */ {
          class: 'icon-pinputuduishuzuobiaoqiehuan_huaban',
          title: '对数坐标',
          flag: [1, 3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 10 */ {
          class: 'icon-zhuansumaichong_huaban1',
          title: '转速脉冲',
          flag: [0], //opt 图谱类型为0显示
          // viewType: [0, 1, 2]
        },
        /* 11 */ {
          class: 'icon-youxiaopinshuaishezhi_huaban',
          title: '时域波形过滤',
          flag: [0],
        },
      ],
    }
  },
  watch: {
    option: {
      handler(value) {
        if (
          !this.isNewChart ||
          (this.clickTrend && this.opt === 2) ||
          value === null ||
          value === undefined
        )
          return
        const nameArr = ['wave', 'spectrum', 'trend']
        let className = `my-${nameArr[this.opt]}-chart${this.opt}${this.index}`
        const dom = document.getElementsByClassName(className)[0]
        if (dom) {
          const chartName = nameArr[this.opt]
          let chart = this.chart[chartName]
          if (this.chart[chartName] === undefined) {
            this.chart[chartName] = {}
          }
          this.chart[chartName][this.index] ||
            (this.chart[chartName][this.index] = myChart.init(dom))
          this.chart[chartName][this.index] &&
            this.chart[chartName][this.index].setOption(value)
        }
      },
      deep: true,
    },
    //若structure变化刷新图谱
    structure(value) {
      this.$nextTick(this.resizeChart)
    },
    // 波形频谱图横向展开或缩小刷新图谱
    developChart(value) {
      this.$nextTick(this.resizeChart)
    },
    // 专家谱图类型(倒谱图频率改为时间)
    /* chartType(value) {
       const btn = this.chartBtn;
       if (value === 1) {
          btn[15].title = '有效时间设置'
          btn[16].title = '最小时间过滤'
       } else {
          btn[15].title = '有效频段设置'
          btn[16].title = '低频过滤'
       }
    }, */
  },
  methods: {
    // 点击图谱上方图标返回方法
    handler(index, e) {
      const tag = e.target
      let btn = this.chartBtn
      const className = 'chart-btn-active'
      if (index === 1) {
        /* 最大化 */
        if (this.maximization) {
          btn[index].class = 'icon-MAX_huaban'
          btn[index].title = '最大化'
        } else {
          btn[index].class = 'icon-back_huaban'
          btn[index].title = '返回'
        }
        this.maximization = !this.maximization
        this.$emit('maximization', this.maximization, this.opt)
      } else if (index === 0) {
        /* 单位选择 */
        this.$emit('selectUnit', this.opt)
      } else if (index === 7) {
        this.$emit('setAllFreq')
      } else if (index === 9) {
        this.logChart = !this.logChart
        this.logChart
          ? tag.classList.add(className)
          : tag.classList.remove(className)
        this.$emit('setLog', this.logChart, this.opt)
      } else if (index === 10) {
        this.$emit('getPulseTime')
      } else if (index === 11) {
        this.$emit('setFilterWave')
      }
    },
    // 设置class
    setClass(index) {
      const icon = this.chartBtn[index]
      let str = ''
      if (index === 8 && this.isTimeDifferent) {
        str += 'chart-btn-active '
      } else if (index === 10) {
        if (this.isSpeedPulse) {
          // if(this.isSpeedPulse.posType != 3 || this.isSpeedPulse.isDegree == true || this.isSpeedPulse.dgmType != 1){ //振动测点时显示转速脉冲,阶次开启时无转速脉冲,dgm_type不为1时无转速脉冲
          //   return
          // }
          if (this.isSpeedPulse.speedPulse) {
            str += 'chart-btn-active '
          }
        }
      }
      str += `${icon.class} ${icon.class}_wave`
      return str
    },
    // 设置图标显示
    setViewIcon(item) {
      const opt = this.opt
      const viewOpt = item.flag.includes(opt)
      if (item.title == '转速脉冲') {
        if (this.isSpeedPulse) {
          if (
            (this.isSpeedPulse.posType != 3 && this.isSpeedPulse.posType != 17) ||
            this.isSpeedPulse.isDegree == true ||
            (this.isSpeedPulse.dgmType != 1 && this.isSpeedPulse.dgmType != 7)
          ) {
            //振动测点时显示转速脉冲,阶次开启时无转速脉冲,dgm_type不为1时无转速脉冲
            return false
          }
        }
      }
      //WL9100默认单位为m/s²
      if(item.title == '单位选择'){
        if (this.isSpeedPulse) {
          if (this.isSpeedPulse.dgmType == 10) {
            return false
          }
        }
      }
      if (viewOpt && item.title == '时域波形过滤') {
        let flag = true
        if (this.isSpeedPulse && this.isSpeedPulse.isDegree == true) {
          //振动测点时显示转速脉冲,阶次开启时无转速脉冲,dgm_type不为1时无转速脉冲
          flag = false
        }
        return flag
      }
      if (opt !== 8) {
        return viewOpt
      } else if (viewOpt) {
        return item.viewType.includes(this.expertType)
      }
    },
    // 界面宽高变化刷新图谱
    resizeChart() {
      const nameArr = ['wave', 'spectrum', 'trend']
      this.chart[nameArr[this.opt]] && this.chart[nameArr[this.opt]][this.index] && 
        this.chart[nameArr[this.opt]][this.index].resize()
    },
    // 设置标题
    setTitle(index) {
      const btn = this.chartBtn
      return btn[index].title
    },
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    window.addEventListener('resize', this.resizeChart)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    // this.chart.clear()
    for (let k in this.chart) {
      for (let j in this.chart[k]) {
        this.chart[k][j].destory()
      }
    }
  },
}
</script>
<style scoped lang="scss">
.my-wave-chart {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  .iconfont {
    position: relative;
    z-index: 1;
    float: right;
    font-size: 24px;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
  }
}
@media screen and (max-width: 1366px) {
  .my-wave-chart {
    height: 100%;
    min-width: 560px;
    width: 100%;
    position: relative;
    overflow: hidden;
    .iconfont {
      position: relative;
      z-index: 1;
      float: right;
      font-size: 18px;
      margin-right: 8px;
      margin-top: 8px;
      cursor: pointer;
    }
  }
}
</style>
