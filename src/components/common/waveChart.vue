<!-- 波形频谱图图谱 -->
<template>
  <div class='my-wave-chart'>
    <i
      class='iconfont'
      v-for='(item, index) in chartBtn'
      :key='index'
      :class='setClass(index)'
      :title='setTitle(index)'
      v-show='setViewIcon(item)'
      @click='handler(index, $event)'
    >
    </i>
    <p
      class='none-data-box'
      v-if='empty && empty.isShow'
    >
      <span>{{empty.text}}</span>
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
  // isHanning 是否为汉宁窗（专家频谱图）
  // isNX 判断X轴取srcX还是ratio（专家频谱图）
  // empty isShow：是否显示text内容；text：无数据时显示text（频谱图，专家频谱图）数据未加载完成或数据为空时
  // isTimeDifferent：时间差
  // isSubFreq：差频
  // isLabelFreq：标注倍频
  // expertType：倒谱图、包络谱图、细化谱图切换判断显示工具图标（专家频谱图）
  // developChart：频谱图左右下结构时加号按钮点击，判断是否显示和显示框大小
  // chartType：设定chartBtn 15、16时倒谱图、包络谱图、细化谱图的title显示（专家频谱图）
  props: [
    'opt',
    'option',
    'index',
    'isNewChart',
    'className',
    'structure',
    'clickTrend',
    'flag',
    'isHanning',
    'isNX',
    'empty',
    'isTimeDifferent',
    'isSubFreq',
    'isLabelFreq',
    'expertType',
    'developChart',
    'chartType',
  ],
  data() {
    return {
      chart: {},
      subTime: false,
      maximization: false,
      logChart: false,
      alignFreq: true,
      chartBtn: [
        /* 0 */ {
          class: 'icon-selectunit_huaban',
          title: '单位选择',
          flag: [1, 2, 0, 3, 7, 8, 9],
          viewType: [2],
        },
        /* 1 */ {
          class: 'icon-MAX_huaban',
          title: '选框放大',
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
        /* 8 */ { class: 'icon-subtime_huaban', title: '时间差', flag: [0] },
        /* 9 */ {
          class: 'icon-pinputuduishuzuobiaoqiehuan_huaban',
          title: '对数坐标',
          flag: [1, 3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 10 */ {
          class: 'chart-btn-active icon-xiaozhunbeipin_huaban',
          title: '校准倍频',
          flag: [3, 7],
        },
        /* 11 */ {
          class: 'icon-xunhuanxunfeng_huaban_huaban',
          title: '循环寻峰',
          flag: [3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 12 */ {
          class: 'icon-quxiaobiaozhu_huaban',
          title: '取消标注',
          flag: [3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 13 */ {
          class: 'icon-biaozhu_huaban',
          title: '添加标注',
          flag: [3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 14 */ {
          class: 'icon-biaozhubeipin_huaban',
          title: '标注倍频',
          flag: [3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 15 */ {
          class: 'icon-youxiaopinshuaishezhi_huaban',
          title: '有效频段设置',
          flag: [3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 16 */ {
          class: 'icon-dipinguolv_huaban',
          title: '低频过滤',
          flag: [3, 7, 8],
          viewType: [0, 1, 2],
        },
        /* 17 */ {
          class: 'icon-dingweidaobeipin_huaban',
          title: '定位到1倍频',
          flag: [3, 7, 8],
          viewType: [0],
        },
        /* 18 */ {
          class: 'icon-qiehuanXzhoujiebi_huaban',
          title: '切换阶比',
          flag: [3, 7, 8],
          viewType: [0, 2],
        },
        /* 19 */ {
          class: 'icon-hanningchuang_huaban',
          title: '汉宁窗',
          flag: [3, 7, 8],
          viewType: [0, 2],
        },
        /* 20 */ {
          class: 'icon-duichengpinshuaicha_huaban',
          title: '对称频率差',
          flag: [3, 7, 8],
          viewType: [0, 2],
        },
      ],
      width: 0,
    }
  },
  computed: {},
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
        const nameArr = [
          'wave',
          'spectrum',
          'trend',
          'compare',
          'dip',
          'overturn',
          'scatter',
          'expert-spectrum',
          'expert-expert',
          'expert-trend',
          'census',
          'circle',
          'circle-trend',
        ]
        const flagArr = [5]
        let className = `my-${nameArr[this.opt]}-chart${this.opt}${this.index}`
        if (flagArr.includes(this.opt)) {
          //当图谱类型为dip时
          className = `my-${nameArr[this.opt]}${this.flag}-chart${this.opt}${
            this.index
          }`
        }
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
      const tag = e.currentTarget
      let btn = this.chartBtn
      const className = 'chart-btn-active'
      const emitCode = [15, 16, 18, 19]
      if (index === 8) {
        /* 时间差 */
        /* this.subTime ? tag.classList.remove(className) : tag.classList.add(className);
        this.subTime = !this.subTime; */
      } else if (index === 1) {
        /* 最大化 */
        if (this.maximization) {
          btn[index].class = 'icon-MAX_huaban'
          btn[index].title = '返回'
        } else {
          btn[index].class = 'icon-back_huaban'
          btn[index].title = '选框放大'
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
        this.alignFreq = !this.alignFreq
        btn[index].class = this.alignFreq
          ? `${className} icon-xiaozhunbeipin_huaban`
          : 'icon-xiaozhunbeipin_huaban'
      } else if (emitCode.includes(index)) {
        this.$emit('operation', index, this.opt)
      }
    },
    // 设置class
    setClass(index) {
      const icon = this.chartBtn[index]
      let str = ''
      if (
        (index === 8 && this.isTimeDifferent) ||
        (index === 19 && this.isHanning) ||
        (index === 18 && this.isNX === true) ||
        (index === 14 && this.isLabelFreq) ||
        (index === 20 && this.isSubFreq)
      ) {
        str += 'chart-btn-active '
      }
      str += `${icon.class} ${icon.class}_${this.className}`
      return str
    },
    // 设置图标显示
    setViewIcon(item) {
      const opt = this.opt
      const viewOpt = item.flag.includes(opt)
      if (opt !== 8) {
        return viewOpt
      } else if (viewOpt) {
        return item.viewType.includes(this.expertType)
      }
    },
    // 界面宽高变化刷新图谱
    resizeChart() {
      const nameArr = [
        'wave',
        'spectrum',
        'trend',
        'compare',
        'dip',
        'overturn',
        'scatter',
        'expert-spectrum',
        'expert-expert',
        'expert-trend',
        'census',
        'circle',
        'circle-trend',
      ]
      this.chart[nameArr[this.opt]] &&
        this.chart[nameArr[this.opt]][this.index].resize()
    },
    // 设置标题
    setTitle(index) {
      const btn = this.chartBtn
      if (index === 15 || index === 16) {
        if (this.chartType === 1) {
          btn[15].title = '有效时间设置'
          btn[16].title = '最小时间过滤'
        } else {
          btn[15].title = '有效频段设置'
          btn[16].title = '低频过滤'
        }
      }
      return btn[index].title
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    window.addEventListener("resize", this.resizeChart);
  },
  beforeDestroy(){
    window.removeEventListener("resize", this.resizeChart);
  },
}
</script>
<style scoped lang='scss'>
.my-wave-chart {
  height: 100%;
  width: 100%;
  min-width: 560px;
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
  width: 100%;
  min-width: 560px;
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
