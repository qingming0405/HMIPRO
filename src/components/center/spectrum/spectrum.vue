<!-- 专家频谱图 -->
<template>
  <div class="my-spectrum-chart">
    <div
      class="my-spectrum select-none"
      v-for="(item, key, index) in paramsData"
      :key="key"
      v-show="item.isShow"
      ref="myCharts"
    >
      <div class="view-time">
        <span>{{ item.time.view }}</span>
        <span>rpm：{{ item.chartData.speed }}</span>
      </div>
      <div
        :class="'spectrum-chart-box spectrum-chart' + index"
        ref="spectrumCharts"
      >
        <wave-chart
          :opt="7"
          :index="index"
          :isNewChart="item.spectrum.isNewChart"
          :option="spectrumOption"
          :className="'expert-spectrum'"
          :class="
            'spectrum-chart radius box-shadow my-expert-spectrum-chart7' + index
          "
          :isHanning="item.chartData.isSpectrumHanning"
          :isNX="item.chartData.isSpectrumNx"
          :empty="item.spectrum.empty"
          :isSubFreq="item.isRestore.spectrum.subFreq"
          :isLabelFreq="item.isRestore.spectrum.labelFreq"
          :structure="item.structure"
          @setLog="setLog"
          @maximization="maximization"
          @selectUnit="selectUnit"
          @operation="operation"
        >
        </wave-chart>
        <wave-chart
          :opt="8"
          :index="index"
          :isNewChart="item.expert.isNewChart"
          :option="expertOption"
          :className="'expert-expert'"
          :class="
            'expert-chart radius box-shadow my-expert-expert-chart8' + index
          "
          :empty="item.expert.empty"
          :expertType="item.expertType.type"
          :structure="item.structure"
          :isHanning="item.chartData.isExpertHanning"
          :isNX="item.chartData.isExpertNx"
          :isSubFreq="item.isRestore.expert.subFreq"
          :isLabelFreq="item.isRestore.expert.labelFreq"
          :chartType="item.expertType.type"
          @setLog="setLog"
          @maximization="maximization"
          @selectUnit="selectUnit"
          @operation="operation"
        >
        </wave-chart>
        <wave-chart
          :opt="9"
          :index="index"
          :isNewChart="item.trend.isNewChart"
          :option="trendOption"
          :clickTrend="clickTrend"
          :className="'expert-trend'"
          :class="
            'trend-chart radius box-shadow my-expert-trend-chart9' + index
          "
          :empty="item.trend.empty"
          :structure="item.structure"
          @maximization="maximization"
          @selectUnit="selectUnit"
          @operation="operation"
        >
        </wave-chart>
        <div
          v-show="
            chartData[key].cepstrum.srcX.length > 0 ||
              chartData[key].env.srcX.length > 0 ||
              chartData[key].thinning.srcX.length > 0
          "
          class="set-chart-type"
          @click.stop="setChartType(item.expertType, $event)"
        >
          {{ item.expertType.name }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <div class="search-data">
        <button
          class="get-real-data"
          :class="item.getReal.class"
          @click="getRealData"
          ref="spectrumRealData"
        >
          实时数据
        </button>
        <button
          class="save-image"
          @click="keepPage"
        >保存图片</button>
        <button @click.stop="expertSetting(2)">滤波设置</button>
        <button @click.stop="expertSetting(3)">细化设置</button>
        <button @click="changeStructure">布局切换</button>
        <button @click="dataRetrieval">数据检索</button>
        <input
          type="checkbox"
          v-model="getReal.isGetReal"
          class="is-get-real hide"
          ref="isGetReal"
        />
        <a
          href=""
          id="keep_download"
          ref="saveImage"
          :download="item.posName"
          class="hide"
        ></a>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import WaveChart from '@/components/common/waveChart'
import html2canvas from 'html2canvas'
import {
  getTime,
  round,
  cloneObj,
  defaultCode,
  getUnit,
  integralFft,
} from 'utils/utils.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    WaveChart,
  },
  name: 'spectrum',
  data() {
    return {
      chartData: {} /* 图谱信息 */,
      paramsData: {} /* 数据信息 */,
      currentIndex: 0 /* 当前显示第几个图谱 */,
      currentKey: '' /* 当前显示图谱下标 */,
      requestData: null /* 请求数据 */,
      getReal: {
        /* 实时数据 */
        isGetReal: true /* 是否获取实时数据 */,
        class: '' /* 按钮class */,
      },
      chartType: [
        { name: '包络谱图', key: 'env' },
        { name: '倒谱图', key: 'cepstrum' },
        { name: '细化谱图', key: 'thinning' },
      ] /* 图谱类型 */,
      color: {
        /* 颜色设置 */
        titleColor: '#666' /* 标题字体 */,
        axis: {
          /* 坐标轴 */
          name: '#666' /* 标题 */,
          font: '#666' /* 字体 */,
          line: '#ccc' /* 坐标线 */,
          splitLine: '#ccc' /* 分隔线 */,
        },
        series: {
          /* 图谱 */
          line: '#3D77FF' /* 谱线 */,
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
      clickTrend: false /* 是否点击趋势图 */,
      timer: null /* 获取实时数据计时器 */,
    }
  },
  computed: {
    spectrumOption() {
      const index = this.currentIndex
      const key = this.currentKey
      const chart = this.chartData[key].spectrum
      const params = this.paramsData[key]
      const chartData = params.chartData
      const color = this.color
      const unit = chart.curUnitX
      return {
        title: {
          show: true,
          name: '频谱图',
          fontStyle: {
            weight: 'bold', // 粗细，默认 'bold'
            size: '18px', // 大小，默认 '20px'
            family: 'Arial', // 字体，默认 'Arial'
            color: color.titleColor, // 颜色，默认 '#000'
            align: 'left', // 对齐方式，默认 'left'
          },
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 28, // 离容器下边距离，默认 60
        },
        x: {
          name: chart.curUnitX,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          type: 'category',
          data: chart.curX,
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
          name: chart.curUnitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: chart.curY,
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
          type: params.chartData.spectrumType, // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1, // 粗细，默认 1
          },
          dataMsg: {
            oneFreq: chartData.oneFreq, // 一倍频
            rotateSpeed: chartData.speed, // 转速
            specType: chartData.chartType, // 频谱图类型
            spectral: chartData.spectral, // 采样点数
            setPower: chartData.isSetPower, // 是否设置有效频段，默认 false
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
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban_expert-spectrum'
            )[index],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban_expert-spectrum'
            )[index],
          },
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban_expert-spectrum'
            )[index],
            imageName: params.posName + '_频谱图',
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban_expert-spectrum'
            )[index],
            formatter(isRestore) {
              params.isRestore.spectrum = {
                subFreq: !isRestore,
                labelFreq: !isRestore,
              }
            },
          },
          // 差频
          subFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-duichengpinshuaicha_huaban_expert-spectrum'
            )[index],
            formatter(isSubFreq) {
              params.isRestore.spectrum.subFreq = isSubFreq
            },
          },
          // 1倍频
          oneFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-dingweidaobeipin_huaban_expert-spectrum'
            )[index],
          },
          // 标注倍频
          labelFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhubeipin_huaban_expert-spectrum'
            )[index],
            formatter(isLabelFreq) {
              params.isRestore.spectrum.labelFreq = isLabelFreq
            },
          },
          // 寻峰
          peakSearch: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-xunhuanxunfeng_huaban_huaban_expert-spectrum'
            )[index],
          },
          // 添加标注
          addLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhu_huaban_expert-spectrum'
            )[index],
          },
          // 取消标注
          cancelLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-quxiaobiaozhu_huaban_expert-spectrum'
            )[index],
          },
          // 校准倍频
          setPeak: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-xiaozhunbeipin_huaban_expert-spectrum'
            )[index],
          },
          // 导出数据
          exportData: {
            fileName: params.posName,
            show: true,
            dom: document.getElementsByClassName(
              'icon-exportdata_huaban_expert-spectrum'
            )[index],
          },
        },
        backgroundColor: color.background,
      }
    },
    expertOption() {
      const index = this.currentIndex
      const key = this.currentKey
      const params = this.paramsData[key]
      const expertType = params.expertType.key
      const chart = this.chartData[key][expertType]
      const color = this.color
      const chartData = params.chartData
      let chartType = 'line'
      return {
        title: {
          show: false,
          name: '专家图',
          fontStyle: {
            weight: 'bold', // 粗细，默认 'bold'
            size: '18px', // 大小，默认 '20px'
            family: 'Arial', // 字体，默认 'Arial'
            color: color.titleColor, // 颜色，默认 '#000'
            align: 'left', // 对齐方式，默认 'left'
          },
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 28, // 离容器下边距离，默认 60
        },
        x: {
          name: chart.curUnitX,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          type: 'category',
          data: chart.curX,
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
          name: chart.curUnitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: chart.curY,
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
          type: chartData.expertType, // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1, // 粗细，默认 1
          },
          dataMsg: {
            oneFreq: chartData.oneFreq, // 一倍频
            rotateSpeed: chartData.speed, // 转速
            specType: chartData.chartType, // 频谱图类型
            spectral: chartData.spectral, // 采样点数
            setPower: chartData.isSetPower, // 是否设置有效频段，默认 false
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
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban_expert-expert'
            )[index],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban_expert-expert'
            )[index],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban_expert-expert'
            )[index],
            formatter(isRestore) {
              params.isRestore.expert = {
                subFreq: !isRestore,
                labelFreq: !isRestore,
              }
            },
          },
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban_expert-expert'
            )[index],
            imageName: `${params.posName}_${params.expertType.name}`,
          },
          // 导出数据
          exportData: {
            fileName: params.posName,
            show: true,
            dom: document.getElementsByClassName(
              'icon-exportdata_huaban_expert-expert'
            )[index],
          },
          // 差频
          subFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-duichengpinshuaicha_huaban_expert-expert'
            )[index],
            formatter(isSubFreq) {
              params.isRestore.expert.subFreq = isSubFreq
            },
          },
          // 1倍频
          oneFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-dingweidaobeipin_huaban_expert-expert'
            )[index],
          },
          // 标注倍频
          labelFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhubeipin_huaban_expert-expert'
            )[index],
            formatter(isLabelFreq) {
              params.isRestore.expert.labelFreq = isLabelFreq
            },
          },
          // 寻峰
          peakSearch: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-xunhuanxunfeng_huaban_huaban_expert-expert'
            )[index],
          },
          // 添加标注
          addLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhu_huaban_expert-expert'
            )[index],
          },
          // 取消标注
          cancelLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-quxiaobiaozhu_huaban_expert-expert'
            )[index],
          },
        },
        backgroundColor: color.background,
        changePos: params.isChange,
      }
    },
    trendOption() {
      const key = this.currentKey
      const chart = this.chartData[key].trend
      const paramsData = this.paramsData[key]
      const index = this.currentIndex
      const color = this.color
      const rd = this.requestData.trend
      const that = this
      return {
        title: {
          show: true,
          name: '趋势图',
          fontStyle: {
            weight: 'bold', // 粗细，默认 'bold'
            size: '18px', // 大小，默认 '20px'
            family: 'Arial', // 字体，默认 'Arial'
            color: color.titleColor, // 颜色，默认 '#000'
            align: 'left', // 对齐方式，默认 'left'
          },
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
          data: chart.curX,
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
          range: {
            max: rd.startTime,
            min: rd.endTime,
          },
        },
        y: {
          name: chart.curUnitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: chart.curY,
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
            paramsData.time = {
              src: params.val,
              view: getTime(params.val),
            }
            paramsData.getReal = {
              isReal: false,
              class: 'disable-btn',
            }
            paramsData.expert.isNewChart = true
            paramsData.spectrum.isNewChart = true
            paramsData.trend.isNewChart = false
            that.$store.commit('setCurrentTime', params.val)
            that.requestData.wave.currTime = [params.val]
            that.requestData.wave.isReal = 0
            that.clickTrend = true
            that.getExpertSpectrum()
          },
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban_expert-trend'
            )[index],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban_expert-trend'
            )[index],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban_expert-trend'
            )[index],
          },
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban_expert-trend'
            )[index],
            imageName: this.paramsData[key].posName + '_趋势图',
          },
        },
        backgroundColor: color.background,
      }
    },
  },
  watch: {
    '$store.state.spectrumMsg': {
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
    isRetract(value) {
      this.paramsData[this.currentKey].structure = Math.abs(
        --this.paramsData[this.currentKey].structure
      )
    },
    '$store.state.structure'() {
      this.paramsData[this.currentKey].structure = Math.abs(
        --this.paramsData[this.currentKey].structure
      )
    },
  },
  methods: {
    // 打开图谱
    openChartList(key, type, delKey) {
      if (typeof key !== 'string') return
      const [, , macId, posId, posType] = key.split('_')
      const eigenvalue = defaultCode[posType]
      const state = this.$store.state
      let isReal = state.currentTime === 0 ? 1 : 0
      const density = {
        isSpeed: posType === '1',
        type: 0,
      }
      const keyArr = Object.keys(this.chartData)
      if (type === 0 || type === 1) {
        this.currentIndex =
          keyArr.indexOf(key) === -1 ? keyArr.length : keyArr.indexOf(key)
        this.currentKey = key
        const params = state.srcParams
        const time = params.time
        const speed = params.speed
        const limit = params.limit
        const density = params.density
        this.requestData = {
          trend: {
            machineId: macId,
            positionId: posId,
            positionType: posType,
            startTime: time.start,
            endTime: time.end,
            toSpeed: speed.max,
            fromSpeed: speed.min,
            lowerLimit: limit.lower,
            upperLimit: limit.upper,
            value: eigenvalue.filed,
            code: eigenvalue.code,
            density: Number(density.type),
          },
          wave: {
            machineId: macId,
            positionId: posId,
            positionType: posType,
            isRceps: true,
            isWave: false,
            isReal,
            currTime: [state.currentTime],
            type: Number(density.isSpeed),
          },
        }
        for (const key in this.paramsData) {
          const value = this.paramsData[key]
          value.isShow = false
          value.trend.isNewChart = false
          value.spectrum.isNewChart = false
          value.expert.isNewChart = false
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length
          const getRealBtnClassName = !!isReal ? '' : 'disable-btn'
          const pos = cloneObj(state.checkMsg.pos, true)
          const unitX = {
            wave: 's',
            spectrum: 'Hz',
          }
          const unitY = getUnit(eigenvalue.code, pos)
          const isNx = {
            chartType: 'line',
            type: 1,
          }
          if (posType === '8' || posType === '9') {
            unitX.wave = 'smpl'
            unitX.spectrum = 'NX'
            isNx.chartType = 'bar-line'
            isNx.type = 2
          }
          const empty = {
            isShow: true,
            text: `${pos.position_name}无数据`,
          }
          const expertChartMsg = {
            empty,
            time: state.currentTime,
          }
          const freq = {
            lowFreq: 0 /* 低频过滤 */,
            lowerLimit: 0 /* 有效频段(下限) */,
            upperLimit: 0 /* 有效频段(上限) */,
          }
          this.$set(this.chartData, key, {
            spectrum: {
              srcX: [],
              curX: [],
              ratio: [],
              curUnitX: unitX.spectrum,
              srcY: [],
              curY: [],
              hanning: [],
              srcUnitY: unitY,
              curUnitY: unitY,
            },
            // expert: { /* 专家谱图 */
            env: {
              /* 包络谱图 */
              ratio: [],
              srcX: [],
              curX: [],
              hanning: [],
              srcY: [],
              curY: [],
              curUnitX: 'Hz',
              curUnitY: 'gD',
              srcUnitY: 'gD',
            },
            cepstrum: {
              /* 倒谱图 */
              srcX: [],
              curX: [],
              srcY: [],
              curY: [],
              curUnitX: 's',
              curUnitY: 'ga',
            },
            thinning: {
              /* 细化谱图 */
              ratio: [],
              srcX: [],
              curX: [],
              hanning: [],
              srcY: [],
              curY: [],
              curUnitX: unitX.spectrum,
              curUnitY: unitY,
              srcUnitY: unitY,
            },
            // },
            trend: {
              srcX: [],
              curX: [],
              srcY: [],
              curY: [],
              srcUnitY: unitY,
              curUnitY: unitY,
            },
          })
          this.$set(this.paramsData, key, {
            isReal,
            getReal: {
              isReal: !!isReal,
              class: getRealBtnClassName,
              timer: null,
            },
            isShow: true,
            isSpectrumLog: false,
            isExpertLog: false,
            posName: pos.position_name,
            time: {
              src: state.currentTime,
              view: getTime(state.currentTime),
            },
            isRestore: {
              spectrum: {
                subFreq: false,
                labelFreq: false,
              },
              expert: {
                subFreq: false,
                labelFreq: false,
              },
            },
            expertType: {
              name: '倒谱图',
              key: 'cepstrum',
              type: 1,
            },
            chartData: {
              isSpectrumHanning: true /* 频谱图是否开启汉宁窗 */,
              isExpertHanning: true /* 包络谱、细化谱是否开启汉宁窗 */,
              spectrumType: isNx.chartType /* 频谱图类型(bar-line, line) */,
              expertType: 'line' /* 专家谱图类型 */,
              isRatio: isNx.type /* 1: 频谱图, 2: 阶次 */,
              isSpectrumNx: false /* 频谱图是否切换为阶比 */,
              isExpertNx: false /* 包络谱、细化谱是否切换为阶比 */,
              densityType: 0 /* 0: 低密度波形, 1: 高密度波形 */,
              isSpeed: posType === '1' /* 是否为转速测点 */,
              oneFreq: 0 /* 一倍频 */,
              freq: 0 /* 频率 */,
              speed: 0 /* 转速 */,
              rms: 0 /* 有效值 */,
              isSetPower: false /* 是否设置有效频段 */,
              spectral: 0 /* 采样点数 */,
              samples: 0 /* 总采样点数 */,
            },
            spectrum: {
              empty,
              isNewChart: true,
            },
            trend: {
              empty,
              isNewChart: true,
            },
            expert: {
              empty,
              isNewChart: true,
            },
            expertTime: {
              env: state.currentTime,
              cepstrum: state.currentTime,
              thinning: state.currentTime,
            },
            freq: {
              /* 频率设置 */
              envelopeLow: 0 /* 滤波下限 */,
              envelopeUp: 0 /* 滤波上限 */,
              startF: 0 /* 细化频率段起点 */,
              endF: 0 /* 细化频率段终点 */,
              fPoints: 0 /* 细化频段的频点数，即细化精度 */,
              spectrum: cloneObj(freq, true),
              trend: cloneObj(freq, true),
              env: cloneObj(freq, true),
              cepstrum: cloneObj(freq, true),
              thinning: cloneObj(freq, true),
            },
            isChange: false /* 是否切换图谱类型 */,
            structure: 0 /* 结构样式, 0: 左右下; 1: 上中下; 2: 左侧收起 */,
          })
          this.getTrend()
          this.getExpertSpectrum()
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          clearTimeout(this.paramsData[key].getReal.timer)
          this.$delete(this.chartData, key)
          this.$delete(this.paramsData, key)
          break
      }
    },
    // 获取趋势图数据
    getTrend() {
      const params = this.paramsData[this.currentKey]
      params.trend.isNewChart = false
      this.$getApi.getPositionEigenvalue(this.requestData.trend).then((res) => {
        res && this.setTrend(res)
      })
    },
    // 获取专家频谱图数据
    getExpertSpectrum() {
      const params = this.paramsData[this.currentKey]
      params.spectrum.isNewChart = false
      params.expert.isNewChart = false
      this.$emit('loadingImg', true)
      this.$getApi.getWaveformAndSpectrum(this.requestData.wave).then((res) => {
        this.$emit('loadingImg', false)
        if (res) {
          this.setExpert(res)
        }
      })
    },
    // 获取趋势数据成功
    setTrend(data) {
      const list = data.tendencyList
      const l = list.length
      const currentKey = this.currentKey
      const chart = cloneObj(this.chartData[currentKey], true)
      const params = this.paramsData[currentKey]
      if (l > 0) {
        const x = []
        const y = []
        params.trend = {
          empty: {
            isShow: false,
            text: '',
          },
          isNewChart: true,
        }
        for (let i = 0; i < l; i++) {
          const value = list[i]
          x.push(value.saveTime)
          y.push(value.tempValue)
        }
        chart.trend.srcX = x
        chart.trend.curX = x
        chart.trend.srcY = y
        chart.trend.curY = y
      } else {
        chart.trend.srcX = []
        chart.trend.srcY = []
        chart.trend.curX = []
        chart.trend.curY = []
        params.trend = {
          empty: {
            isShow: true,
            text: `${params.posName}无数据`,
          },
          isNewChart: true,
        }
      }
      this.$set(this.chartData, currentKey, chart)
      const trend = this.chartData[currentKey].trend
      if (trend.curUnitY !== trend.srcUnitY) {
        const newUnit = trend.curUnitY
        trend.curUnitY = trend.srcUnitY
        this.unitHandler(9, newUnit)
      }
      this.$forceUpdate()
    },
    // 获取频谱图(包络、倒谱、细化)数据成功
    setExpert(data) {
      const info = data.info
      const currentKey = this.currentKey
      const chart = this.chartData[currentKey]
      const params = this.paramsData[currentKey]
      if (info.length > 0) {
        const expert = chart.expert
        const fft = info[0].fft
        const hanning = info[0].fftWithHanning
        const env = info[0].envelopeFFT
        const rcepsTi = info[0].rcepsTi
        const rcepsAmpl = info[0].rcepsAmpl
        const xk = info[0].xk
        const yk = info[0].yk
        const rd = this.requestData
        const isRceps = rd.wave.isRceps
        const isEnvelopeFFT = rd.wave.isEnvelopeFFT
        let time = 0
        const spectrum = chart.spectrum
        const enve = chart.env
        const cepstrum = chart.cepstrum
        const thinning = chart.thinning
        const chartData = params.chartData
        const obj = info[0].waveObject
        const spectrumData = {
          srcX: [],
          curX: [],
          ratio: [],
          srcY: [],
          curY: [],
          hanning: [],
        }
        const envData = {
          ratio: [],
          srcX: [],
          curX: [],
          hanning: [],
          srcY: [],
          curY: [],
        }
        const cepstrumData = {
          srcX: [],
          curX: [],
          srcY: [],
          curY: [],
        }
        const thinningData = {
          ratio: [],
          srcX: [],
          curX: [],
          hanning: [],
          srcY: [],
          curY: [],
        }
        const empty = {
          spectrum: {
            isShow: true,
            text: '',
          },
          expert: {
            isShow: true,
            text: '',
          },
        }
        if (hanning && fft) {
          let i = 0
          let l = hanning.OutX.length
          for (; i < l; i++) {
            const valueX = fft.OutX[i]
            const value1y = fft.OutY[i]
            const value2y = hanning.OutY[i]
            spectrumData.srcX.push(valueX)
            spectrumData.curX.push(valueX)
            spectrumData.srcY.push(value1y)
            spectrumData.curY.push(value2y)
            spectrumData.hanning.push(value2y)
          }
          const speed = obj.speed
          chartData.speed = speed
          chartData.oneFreq = speed === 0 ? 0.908 / 60 : speed / 60
          chartData.freq = obj.freq
          chartData.samples = obj.samples
          chartData.rms = round(info[0].value[rd.trend.value], 4)
          if (chartData.chartType === 2) {
            if (obj.cycles > 0 && obj.samples > 0) {
              chartData.spectral = obj.samples / obj.cycles
            } else if (obj.b[2] > 0 && obj.samples) {
              chartData.spectral = obj.samples / obj.b[2]
            } else {
              chartData.spectral = 1
            }
          }
          const NxBool = params.chartData.isRatio === 1 && speed !== 0
          if (NxBool) {
            for (i = 0; i < l; i++) {
              spectrumData.ratio.push(
                Math.round(((fft.OutX[i] * 60) / speed) * 1000000) / 1000000
              )
            }
          }
          empty.spectrum.isShow = false
          empty.spectrum.text = ''
          empty.expert.isShow = false
          empty.expert.text = ''
          if (isEnvelopeFFT && env) {
            /* 包络谱 */
            for (i = 0; i < l; i++) {
              const valX = env.OutX[i]
              const valY = env.OutY[i]
              envData.srcX.push(valX)
              envData.curX.push(valX)
              envData.srcY.push(valY)
              envData.curY.push(valY)
              envData.hanning.push(valY)
            }
            if (NxBool) {
              for (i = 0; i < l; i++) {
                envData.ratio.push(
                  Math.round(((envData.srcX[i] * 60) / speed) * 1000000) /
                    1000000
                )
              }
            }
          } else if (isRceps && rcepsTi && rcepsAmpl) {
            /* 倒谱 */
            l = rcepsTi.length
            for (i = 0; i < l; i++) {
              const x = rcepsTi[i]
              const y = rcepsAmpl[i]
              cepstrumData.curX.push(x)
              cepstrumData.srcX.push(x)
              cepstrumData.curY.push(y)
              cepstrumData.srcY.push(y)
            }
          } else if (xk && yk && xk.length > 0 && yk.length > 0) {
            /* 细化谱 */
            thinningData.srcX = xk
            thinningData.curX = xk
            thinningData.srcY = yk
            thinningData.curY = yk
            thinningData.hanning = yk
            l = xk.length
            if (NxBool) {
              for (i = 0; i < l; i++) {
                thinningData.ratio.push(
                  Math.round(((xk[i] * 60) / speed) * 1000000) / 1000000
                )
              }
            }
          } else {
            empty.expert.isShow = true
            empty.expert.text = `${chart.pos.name}无数据`
          }
          time = info[0].value.saveTime_Com
        } else {
          empty.spectrum.isShow = true
          empty.spectrum.text = `${params.posName}无数据`
          empty.expert.isShow = true
          empty.expert.text = `${params.posName}无数据`
        }
        Object.assign(spectrum, spectrumData)
        Object.assign(enve, envData)
        Object.assign(cepstrum, cepstrumData)
        Object.assign(thinning, thinningData)
        let newUnit = ''
        if (params.time.src === 0) {
          params.time = {
            src: time,
            view: getTime(time),
          }
        }
        params.spectrum = {
          empty: empty.spectrum,
          isNewChart: true,
        }
        params.expert = {
          empty: empty.expert,
          isNewChart: true,
        }
        if (spectrum.curUnitY !== spectrum.srcUnitY) {
          newUnit = spectrum.curUnitY
          spectrum.curUnitY = spectrum.srcUnitY
          this.unitHandler(7, newUnit)
        } else {
          this.getSpectrumFreq()
        }
        if (
          params.expertType.key === 'thinning' &&
          thinning.curUnitY !== thinning.srcUnitY
        ) {
          newUnit = thinning.curUnitY
          thinning.curUnitY = thinning.srcUnitY
          this.unitHandler(8, newUnit)
        } else {
          this.getExpertFreq()
        }
        // this.$forceUpdate();
        if (hanning !== null && fft !== null && params.getReal.isReal) {
          clearTimeout(params.getReal.timer)
          params.getReal.timer = setTimeout(this.getExpertSpectrum, 6000)
        }
      } else {
        params.getReal.isReal && this.getRealData()
        params.spectrum.empty = {
          isShow: true,
          text: `${params.posName}无数据`,
        }
        params.expert.empty = {
          isShow: true,
          text: `${params.posName}无数据`,
        }
        // this.getTrend();
      }
    },
    // 保存图片
    keepPage() {
      const el = this.$refs.myCharts[this.currentIndex]
      const dom = document.getElementsByClassName('view-content')[0]
      const canvas = document.createElement('canvas')
      var w = el.clientWidth * 2
      var h = el.clientHeight * 2
      canvas.height = h
      canvas.width = w
      canvas.style.height = `${h}px`
      canvas.style.width = `${w}px`
      const ctx = canvas.getContext('2d')
      ctx.scale(2, 2)
      html2canvas(el, {
        backgroundColor: this.color.background,
        useCORS: true,
        canvas,
      }).then((canvas) => {
        const index = this.currentIndex
        this.$refs.saveImage[index].href = canvas.toDataURL('image/png')
        this.$refs.saveImage[index].click()
      })
    },
    // 获取实时数据
    getRealData() {
      const real = this.paramsData[this.currentKey].getReal
      real.isReal = !real.isReal
      if (real.isReal) {
        real.class = ''
        this.requestData.wave.currTime = [0]
        this.getExpertSpectrum()
      } else {
        real.class = 'disable-btn'
        clearTimeout(real.timer)
      }
    },
    // 图谱操作
    operation(type, opt) {
      const currentKey = this.currentKey
      const chart = this.chartData[currentKey]
      const params = this.paramsData[currentKey]
      const expertType = params.expertType
      let freq = null
      let data = null
      let hanningStr = ''
      let nxStr = ''
      const chartData = params.chartData
      let chartTypeStr = ''
      params.trend.isNewChart = false
      let freqTitle = {
        section: '有效频段',
        min: '低频过滤',
      }
      switch (opt) {
        case 7:
          freq = params.freq.spectrum
          data = chart.spectrum
          hanningStr = 'isSpectrumHanning'
          nxStr = 'isSpectrumNx'
          chartTypeStr = 'spectrumType'
          params.spectrum.isNewChart = true
          params.expert.isNewChart = false
          break
        case 8:
          if (expertType.type === 1) {
            freqTitle = {
              section: '有效时间',
              min: '最小时间过滤',
            }
          }
          freq = params.freq[expertType.key]
          data = chart[expertType.key]
          hanningStr = `isExpertHanning`
          nxStr = `isExpertNx`
          chartTypeStr = 'expertType'
          params.spectrum.isNewChart = false
          params.expert.isNewChart = true
          params.isChange = false
          break
      }
      const methods = {
        7: 'getSpectrumFreq',
        8: 'getExpertFreq',
      }
      switch (type) {
        case 15 /* 设置有效频段 */:
          this.$WavePop({
            type: 0,
            title: freqTitle.section,
            upperLimit: freq.upperLimit,
            lowerLimit: freq.lowerLimit,
          }).then((res) => {
            if (res) {
              freq.lowerLimit = Number(res.lowerLimit)
              freq.upperLimit = Number(res.upperLimit)
              this[methods[opt]]()
            }
          })
          break
        case 16 /* 设置低频过滤 */:
          this.$WavePop({
            lowFreq: freq.lowFreq,
            title: freqTitle.min,
            type: 0,
          }).then((res) => {
            if (res) {
              freq.lowFreq = Number(res.lowFreq)
              this[methods[opt]]()
            }
          })
          break
        case 18 /* 切换阶比 */:
          if (chartData.speed === 0) {
            this.$pop('转速为0，切换为阶比功能不可用！')
            return
          } else if (chartData.isRatio === 2) {
            this.$pop('已为阶比，切换为阶比功能不可用！')
            return
          }
          chartData[nxStr] = !chartData[nxStr]
          const isNx = chartData[nxStr]
          const ratio = ['srcX', 'ratio']
          const unit = ['Hz', 'NX']
          const chartType = ['line', 'bar-line']
          data.curX = cloneObj(data[ratio[Number(isNx)]], true)
          data.curUnitX = unit[Number(isNx)]
          chartData[chartTypeStr] = chartType[Number(isNx)]
          break
        case 19 /* 设置汉宁窗 */:
          chartData[hanningStr] = !chartData[hanningStr]
          const hanning = ['srcY', 'hanning']
          data.curY = cloneObj(
            data[hanning[Number(chartData[hanningStr])]],
            true
          )
          if (data.curUnitY !== data.srcUnitY) {
            const newUnit = data.curUnitY
            data.curUnitY = data.srcUnitY
            this.unitHandler(7, newUnit)
          }

          this.$forceUpdate()
          break
      }
    },
    /*
         type: {
            0: 有效频段、低频过滤
            1: 单位选择
         }
      */
    getSpectrumFreq(type = 0) {
      const idx = this.currentKey
      const params = this.paramsData[idx]
      const chartData = params.chartData
      const data = cloneObj(this.chartData[idx].spectrum, true)
      const freq = cloneObj(params.freq.spectrum, true)
      const isHanning = Number(chartData.isSpectrumHanning)
      const isNX = Number(chartData.isSpectrumNx)
      const hanningAxis = ['srcY', 'hanning']
      const NXAxis = ['srcX', 'ratio']
      const srcX = data[NXAxis[isNX]]
      let srcY = data[hanningAxis[isHanning]]
      if (type === 1) {
        srcY = data.curY
      }
      const index = this.getIndex(freq.lowFreq, srcX)
      const start = this.getIndex(freq.lowerLimit, srcX)
      const b = freq.upperLimit
      let end = this.getIndex(b, srcX) + 1
      isNaN(end) && (end = srcX.length)
      b === 0 && (end = srcX.length)
      let arrY = []
      // 低频过滤
      for (let i = 0, l = srcY.length; i <= l; i++) {
        if (index !== 0 && i <= index) {
          arrY.push(0)
        } else {
          arrY.push(srcY[i])
        }
      }
      params.spectrum.isNewChart = true
      // 有效频段
      data.curX = srcX.slice(start, end)
      data.curY = arrY.slice(start, end)
      // 计算对数
      if (params.isSpectrumLog) {
        const y = []
        for (let i = 0, l = data.curY.length; i < l; i++) {
          const value = data.curY[i]
          if (value === 0) {
            y.push(0)
          } else {
            y.push((Math.log(data.curY[i]) / Math.log(10)) * 20)
          }
        }
        data.curY = y
      }
      this.chartData[idx].spectrum = data
    },
    /*
         type: {
            0: 有效频段、低频过滤
            1: 单位选择
         }
      */
    getExpertFreq(type = 0) {
      const idx = this.currentKey
      const params = this.paramsData[idx]
      const chartData = params.chartData
      const chartType = params.expertType.key
      const data = cloneObj(this.chartData[idx][chartType], true)
      const freq = cloneObj(params.freq[chartType], true)
      let srcX = data.srcX
      let srcY = data.srcY
      if (chartType !== 'cepstrum') {
        chartData[`isExpertHanning`] && (srcY = data.hanning)
        chartData[`isExpertNx`] && (srcX = data.ratio)
      }
      if (type === 1) {
        srcY = data.curY
      }
      const index = this.getIndex(freq.lowFreq, srcX)
      const start = this.getIndex(freq.lowerLimit, srcX)
      const b = freq.upperLimit
      let end = this.getIndex(b, srcX) + 1
      isNaN(end) && (end = srcX.length)
      b === 0 && (end = srcX.length)
      let arrY = []
      // 低频过滤
      for (let i = 0, l = srcY.length; i <= l; i++) {
        if (index !== 0 && i <= index) {
          arrY.push(0)
        } else {
          arrY.push(srcY[i])
        }
      }
      params.expert.isNewChart = true
      // 有效频段
      data.curX = srcX.slice(start, end)
      data.curY = arrY.slice(start, end)
      // 计算对数
      if (params.isExpertLog) {
        const y = []
        for (let i = 0, l = data.curY.length; i < l; i++) {
          const value = data.curY[i]
          if (value === 0) {
            y.push(0)
          } else {
            y.push((Math.log(data.curY[i]) / Math.log(10)) * 20)
          }
        }
        data.curY = y
      }
      this.chartData[idx][params.expertType.key] = data
    },
    // 根据值确定下标
    getIndex(value, arr) {
      for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i] >= value) return i
      }
    },
    // 最大化(还原)
    maximization(bool, opt) {
      const el = this.$refs.spectrumCharts[this.currentIndex]
      const wave = el.children
      if (bool) {
        el.style.display = 'block'
        wave[opt - 7].style.width = '100%'
        switch (opt) {
          case 7:
            wave[1].style.display = 'none'
            wave[2].style.display = 'none'
            wave[3].style.display = 'none'
            wave[0].style.height = 'calc(100% - 50px)'
            break
          case 8:
            wave[0].style.display = 'none'
            wave[2].style.display = 'none'
            wave[3].style.top = '0px'
            wave[3].style.left = '100px'
            wave[1].style.height = 'calc(100% - 50px)'
            break
          case 9:
            wave[0].style.display = 'none'
            wave[1].style.display = 'none'
            wave[3].style.display = 'none'
            wave[2].style.height = 'calc(100% - 50px)'
            break
        }
      } else {
        for (let i = 0, l = wave.length; i < l; i++) {
          wave[i].style = null
        }
        el.style = null
      }
    },
    // 单位选择
    selectUnit(opt) {
      const chartType = {
        7: 'spectrum',
        8: '',
        9: 'trend',
      }
      const curKey = this.currentKey
      chartType[8] = this.paramsData[curKey].expertType.key
      const chart = this.chartData[curKey][chartType[opt]]
      if (chart.curY.length > 0) {
        this.$WavePop({
          type: 1,
          title: '单位选择',
          src: chart.srcUnitY,
          cur: chart.curUnitY,
          opt: opt,
          unitX: chart.curUnitX,
        }).then((res) => {
          if (res) {
            this.unitHandler(opt, res.unit)
          }
        })
      }
    },
    // 确认单位选择
    unitHandler(opt, newUnit) {
      const curKey = this.currentKey
      const chartType = {
        7: 'spectrum',
        8: '',
        9: 'trend',
      }
      const params = this.paramsData[curKey]
      chartType[8] = params.expertType.key
      const chart = this.chartData[curKey][chartType[opt]]
      params.isChange = false
      const chartData = params.chartData
      const oldUnit = chart.curUnitY
      const srcUnit = chart.srcUnitY
      const unitIndex = {
        g: 0,
        'm/s²': 1,
        'mm/s': 2,
        μm: 3,
      }
      const oldIndex = unitIndex[oldUnit]
      const srcIndex = unitIndex[srcUnit]
      const newIndex = unitIndex[newUnit]
      let srcY = chart.srcY
      if (opt === 7 && chartData.isSpectrumHanning) {
        srcY = chart.hanning
      }
      const l = srcY.length
      let curY = []
      let i = 0
      if (oldIndex !== newIndex && (srcIndex <= newIndex || srcIndex === 1)) {
        if (srcIndex === newIndex) {
          curY = srcY.concat()
        } else if (newIndex === 0) {
          if (srcIndex === 1) {
            for (i = 0; i < l; i++) {
              curY.push(srcY[i] / 9.8)
            }
          }
        } else if (newIndex === 1) {
          if (srcIndex === 0) {
            for (i = 0; i < l; i++) {
              curY.push(srcY[i] * 9.8)
            }
          }
        } else if (newIndex === 2) {
          // if (opt === 7) {
          curY = integralFft(
            srcY,
            l,
            chartData.freq / chartData.samples,
            srcIndex
          )
          // }
        } else if (newIndex === 3) {
          if (srcIndex < 2) {
            // if (opt === 7) {
            curY = integralFft(
              srcY,
              l,
              chartData.freq / chartData.samples,
              srcIndex
            )
            // }
          } else {
            curY = srcY
          }
          // if (opt === 7) {
          curY = integralFft(curY, l, chartData.freq / chartData.samples, 2)
          // }
        }
        if (opt === 9) {
          this.clickTrend = false
          params.trend.isNewChart = true
        }
        chart.curY = curY
        chart.curUnitY = newUnit
        opt === 7 && this.getSpectrumFreq(1)
        opt === 8 && this.getExpertFreq(1)
      }
    },
    // 结构切换
    changeStructure() {
      const className = 'spectrum-chart-box1'
      const index = this.currentIndex
      const el = this.$refs.spectrumCharts[index]
      const data = this.paramsData[this.currentKey]
      if (el.classList.contains(className)) {
        data.structure = 0
        el.classList.remove(className)
      } else {
        data.structure = 1
        el.classList.add(className)
      }
      data.isChange = false
    },
    // 点击数据检索
    dataRetrieval() {
      this.$retrieval('spectrum').then((res) => {
        if (res) {
          const rd = this.requestData.trend
          rd.startTime = res.startTime
          rd.endTime = res.endTime
          rd.toSpeed = res.maxSpeed
          rd.fromSpeed = res.minSpeed
          rd.lowerLimit = res.lower
          rd.upperLimit = res.upper
          rd.density = Number(res.density.type)
          this.getTrend()
        }
      })
    },
    // 切换图谱类型
    setChartType(currentChart, e) {
      const chartType = this.chartType
      const text = []
      for (let i = 0, l = chartType.length; i < l; i++) {
        if (currentChart.type !== i) {
          text.push({
            val: chartType[i].name,
            key: chartType[i].key,
            type: i,
          })
        }
      }
      const size = e.currentTarget.getBoundingClientRect()
      this.$list({
        pattern: {
          top: `${size.top + size.height}px`,
          left: `${size.left}px`,
          width: `${size.width}px`,
        },
        text,
      }).then((res) => {
        const item = res.item
        if (item !== null) {
          const key = this.currentKey
          const params = this.paramsData[key]
          const type = item.type
          const wave = this.requestData.wave
          switch (type) {
            case 0:
              wave.isEnvelopeFFT = true
              wave.isRceps = false
              wave.isCZT = false
              if (!params.freq.envelopeLow && !params.freq.envelopeUp) {
                this.$pop('请先进行滤波设置')
                return
              }
              wave.envelopeLow = params.freq.envelopeLow
              wave.envelopeUp = params.freq.envelopeUp
              break
            case 1:
              wave.isEnvelopeFFT = false
              wave.isRceps = true
              wave.isCZT = false
              break
            case 2:
              wave.isEnvelopeFFT = false
              wave.isRceps = false
              wave.isCZT = true
              if (
                (!params.freq.startF && !params.freq.endF) ||
                !params.freq.fPoints
              ) {
                this.$pop('请先进行细化设置')
                return
              }
              wave.startF = params.freq.startF
              wave.endF = params.freq.endF
              wave.fPoints = params.freq.fPoints
              break
          }
          params.expertType = {
            name: item.val,
            key: item.key,
            type,
          }
          params.chartData.isExpertHanning = true
          params.chartData.isExpertNx = false
          params.chartData.expertType = 'line'
          params.isRestore.expert = {
            subFreq: false,
            labelFreq: false,
          }
          params.isChange = true
          this.getExpertSpectrum()
        }
      })
    },
    // 滤波设置、细化谱设置
    expertSetting(type) {
      const params = this.paramsData[this.currentKey]
      const freq = params.freq
      const data = {
        2: {
          type,
          envelopeUp: freq.envelopeUp,
          envelopeLow: freq.envelopeLow,
          title: '滤波设置',
        },
        3: {
          type,
          startF: freq.startF,
          endF: freq.endF,
          fPoints: freq.fPoints,
          title: '细化设置',
        },
      }
      this.$WavePop(data[type]).then((res) => {
        if (res) {
          const wave = this.requestData.wave
          if (type === 2) {
            freq.envelopeLow = res.envelopeLow
            freq.envelopeUp = res.envelopeUp
            if (params.expertType.type === 0) {
              wave.envelopeLow = freq.envelopeLow
              wave.envelopeUp = freq.envelopeUp
              this.getExpertSpectrum()
            }
          } else {
            freq.startF = res.startF
            freq.endF = res.endF
            freq.fPoints = res.fPoints
            if (params.expertType.type === 2) {
              wave.startF = freq.startF
              wave.endF = freq.endF
              wave.fPoints = freq.fPoints
              this.getExpertSpectrum()
            }
          }
        }
      })
    },
    // 设置对数
    setLog(bool, opt) {
      const params = this.paramsData[this.currentKey]
      const isLog = opt === 7 ? 'isSpectrumLog' : 'isExpertLog'
      params[isLog] = bool
      opt === 8 && (params.isChange = false)
      // opt === 7 ? this.getSpectrumFreq() : this.getExpertFreq()
      let data = this.chartData[this.currentKey]
      if (opt === 7) {
        if (bool) {
          //打开对数坐标
          if (data.spectrum.curUnitY == data.spectrum.srcUnitY) {
            this.getSpectrumFreq()
          } else {
            //若当前单位切换过，getFreq则处理时取curY
            this.getSpectrumFreq(1)
          }
        } else {
          data.spectrum.curUnitY = data.spectrum.srcUnitY
          this.getSpectrumFreq()
        }
      } else {
        if (bool) {
          //打开对数坐标
          if (
            data[params.expertType.key].curUnitY ==
            data[params.expertType.key].srcUnitY
          ) {
            this.getExpertFreq()
          } else {
            //若当前单位切换过，getFreq则处理时取curY
            this.getExpertFreq(1)
          }
        } else {
          if (data[params.expertType.key].srcUnitY) {
            data[params.expertType.key].curUnitY =
              data[params.expertType.key].srcUnitY
          }
          this.getExpertFreq()
        }
      }
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'spectrum',
    })
  },
}
</script>
<style scoped lang="scss">
.my-spectrum-chart {
  width: 100%;
  height: 100%;
  position: relative;
  .my-spectrum {
    width: 100%;
    height: 100%;
    .view-time {
      height: 30px;
      line-height: 30px;
      span {
        margin-right: 40px;
      }
    }
    .spectrum-chart-box {
      width: 100%;
      height: calc(100% - 50px);
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 5px));
      grid-template-rows: 68% 25%;
      grid-column-gap: 10px;
      grid-row-gap: 10px;
      position: relative;
      .trend-chart {
        width: 100%;
        height: 100%;
        grid-column-start: span 2;
      }
      .set-chart-type {
        position: absolute;
        left: calc(50% + 5px);
        z-index: 4;
        font-size: 18px;
        height: 26px;
        width: 100px;
        line-height: 26px;
        font-weight: bold; // 粗细，默认 'bold'
        font-family: Arial;
        .iconfont {
          position: absolute;
          right: 10px;
          font-size: 12px;
        }
      }
    }
    .spectrum-chart-box1 {
      grid-auto-flow: column;
      grid-template-columns: 100%;
      grid-template-rows: repeat(2, calc(34% - 5px)) 25%;
      grid-column-gap: 0;
      .trend-chart {
        grid-column-start: span 1;
      }
      .set-chart-type {
        left: 10px;
        top: 35%;
      }
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
      margin-right: 20px;
    }
    #keep_download,
    .is-get-real {
      display: none;
    }
  }
}
</style>
