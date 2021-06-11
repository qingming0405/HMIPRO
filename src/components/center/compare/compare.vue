<!-- 对比分析图 -->
<template>
  <div class="my-compare-chart radius box-shadow">
    <div
      ref="compareChart"
      class="compare-chart"
      v-for="(params, key) in paramsData"
      :key="key"
      v-show="params.isShow"
      @drop="addPos"
      @dragover.prevent
    >
      <!-- 波形图 -->
      <div
        class="wave-compare-chart chart-box"
        ref="waveCompare"
      >
        <!-- <div class="chart-title">波形对比图</div> -->
        <div
          ref="waveChart"
          class="my-chart"
        >
          <i
            class="iconfont"
            :class="icon.class"
            :title="icon.title"
            v-for="(icon, index) in waveIcon"
            :key="index"
            @click.stop="clickIcon('wave', icon, index, $event)"
          ></i>
        </div>
        <!-- <wave-chart
               class='my-wave-chart0999'
               :opt='0'
               :className='"waveCompare"'
               :option='waveCompareOption'
               :isNewChart='params.isNewChart.wave'
               :index='999'>
            </wave-chart> -->
      </div>
      <!-- 频谱图 -->
      <div
        class="spectrum-compare-chart chart-box"
        ref="spectrumCompare"
      >
        <!-- <dir class="chart-title">频谱对比图</dir> -->
        <div
          ref="spectrumChart"
          class="my-chart"
        >
          <i
            class="iconfont"
            :class="icon.class"
            :title="icon.title"
            v-for="(icon, index) in spectrumIcon"
            :key="index"
            @click.stop="clickIcon('spectrum', icon, index, $event)"
          ></i>
        </div>
        <!-- <wave-chart
               class='my-compare-chart3999'
               :opt='3'
               :className='"spectrumCompare"'
               :option='spectrumCompareOption'
               :isNewChart='params.isNewChart.spectrum'
               :index='999'
               @setLog='setLog'>
            </wave-chart> -->
      </div>
      <!-- 数据列表 -->
      <div
        class="box-bg select-none"
        v-show="params.showData"
      >
        <div
          class="data-list-box radius box-shadow"
          ref="dataListBox"
        >
          <div
            class="data-list-title"
            @mousedown.stop="dragElem(1, 0, $event)"
            @mouseup.stop="dragElem(0, 0, $event)"
          >
            数据列表
            <span
              @click.stop="closeBox('datalist', 0)"
              class="close-box"
            >
              <i class="iconfont icon-cuohao"></i>
            </span>
          </div>
          <div class="data-list-table default-border radius">
            <ul class="data-list-thead">
              <li
                v-for="(title, index) in dataListTitle"
                :key="index"
              >
                {{ title }}
              </li>
            </ul>
            <ul class="data-list-tbody">
              <li
                class="data-list-tr"
                v-for="(item, index) in dataList"
                :key="index"
              >
                <span>
                  <label :for="'showData' + index">
                    <i :class="setClass(item.isShow)"></i>
                  </label>
                  <input
                    type="checkbox"
                    :id="'showData' + index"
                    class="hide"
                    v-model="item.isShow"
                  />
                </span>
                <span>
                  <i
                    class="set-color"
                    :style="'background-color:' + item.color"
                    @click="setColor(item, $event)"
                  ></i>
                </span>
                <span
                  :title="item.posName"
                  class="text-overflow"
                >{{
                  item.posName
                }}</span>
                <span>{{ item.time }}</span>
                <span class="operate-icon">
                  <i
                    v-for="(icon, idx) in operateIcon"
                    :key="idx"
                    :class="icon.class"
                    :title="icon.title"
                    @click="operateData(index, idx)"
                  ></i>
                </span>
              </li>
            </ul>
          </div>
          <div class="data-list-btn">
            <button @click="closeBox('datalist', 2)">关闭全部</button>
            <button @click="closeBox('datalist', 1)">确定</button>
            <button
              class="disable-btn"
              @click="closeBox('datalist', 0)"
            >
              取消
            </button>
          </div>
        </div>
      </div>
      <!-- 基本信息 -->
      <!-- <div class='box-bg select-none' v-show='params.showBasic'>
            <div class='basic-msg radius box-shadow' ref='basicBox'>
               <div class='basic-title' @mousedown.stop='dragElem(1, 1, $event)' @mouseup.stop='dragElem(0, 1, $event)'>
                  基本信息
                  <span @click.stop='closeBox("basic")' class='close-box'>
                     <i class='iconfont icon-cuohao'></i>
                  </span>
               </div>
               <div class='basic-table radius default-border'>
                  <ul class='basic-thead' :class='setClass(params.isViewRms)'>
                     <li v-for='(item, index) in basicTitle' :key=index v-show='index < 9 || params.isViewRms'>{{item}}</li>
                  </ul>
                  <ul class='basic-tbody'>
                     <li class='basic-tr' v-for='(body, index) in params.basicMsg' :key=index :class='setClass(params.isViewRms)'>
                        <span>{{index + 1}}</span>
                        <span>
                           <i class='set-color' :style="'background-color:' + body.color" @click.stop='changeColor(index, $event)'></i>
                        </span>
                        <span :title='body.name' class='text-overflow'>{{body.name}}</span>
                        <span>{{body.time}}</span>
                        <span :title='body.spectrumX' class='text-overflow'>{{body.spectrumX}}</span>
                        <span :title='body.spectrumY' class='text-overflow'>{{body.spectrumY}}</span>
                        <span :title='body.waveX' class='text-overflow'>{{body.waveX}}</span>
                        <span :title='body.waveY' class='text-overflow'>{{body.waveY}}</span>
                        <span :title='body.speed' class='text-overflow'>{{body.speed}}</span>
                        <span :title='body.rms' class='text-overflow' v-show='params.isViewRms'>{{body.rms}}</span>
                        <span :title='getValue(body.p)' class='text-overflow' v-show='params.isViewRms'>{{getValue(body.p)}}</span>
                        <span :title='getValue(body.pp)' class='text-overflow' v-show='params.isViewRms'>{{getValue(body.pp)}}</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div> -->
      <div
        class="basic-msg radius box-shadow select-none"
        ref="basicBox"
        v-show="params.showBasic"
      >
        <div
          class="basic-title"
          @mousedown.stop="dragElem(1, 1, $event)"
          @mouseup.stop="dragElem(0, 1, $event)"
        >
          基本信息
          <span
            @click.stop="closeBox('basic')"
            class="close-box"
          >
            <i class="iconfont icon-cuohao"></i>
          </span>
        </div>
        <div class="basic-table radius default-border">
          <ul
            class="basic-thead"
            :class="setbaseClass(params.isViewRms)"
          >
            <li
              v-for="(item, index) in basicTitle"
              :key="index"
              v-show="index < 9 || params.isViewRms"
            >
              {{ item }}
            </li>
          </ul>
          <ul class="basic-tbody">
            <li
              class="basic-tr"
              v-for="(body, index) in params.basicMsg"
              :key="index"
              :class="setbaseClass(params.isViewRms)"
            >
              <span>{{ index + 1 }}</span>
              <span>
                <i
                  class="set-color"
                  :style="'background-color:' + body.color"
                  @click.stop="changeColor(index, $event)"
                ></i>
              </span>
              <span
                :title="body.name"
                class="text-overflow"
              >{{ body.macName }}-{{ body.name }}</span>
              <span>{{ body.time }}</span>
              <span
                :title="body.spectrumX"
                class="text-overflow"
              >{{
                body.spectrumX
              }}</span>
              <span
                :title="body.spectrumY"
                class="text-overflow"
              >{{
                body.spectrumY
              }}</span>
              <span
                :title="body.waveX"
                class="text-overflow"
              >{{
                body.waveX
              }}</span>
              <span
                :title="body.waveY"
                class="text-overflow"
              >{{
                body.waveY
              }}</span>
              <span
                :title="body.speed"
                class="text-overflow"
              >{{
                body.speed
              }}</span>
              <span
                :title="body.rms"
                class="text-overflow"
                v-show="params.isViewRms"
              >{{ body.rms }}</span>
              <span
                :title="getValue(body.p)"
                class="text-overflow"
                v-show="params.isViewRms"
              >{{ getValue(body.p) }}</span>
              <span
                :title="getValue(body.pp)"
                class="text-overflow"
                v-show="params.isViewRms"
              >{{ getValue(body.pp) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-data">
      <button @click="setDataList">数据列表</button>
      <button @click="dataMsg">基本信息</button>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import myChart from '@/assets/js/myCharts.js'
// import WaveAlert from '@/components/common/waveAlert';
import {
  getdefaultCode,
  getTime,
  round,
  cloneObj,
  getUnit,
  hasClass,
  addClass,
  removeClass,
  changeClass,
  makeWaveY,
  integralFft,
  setSrcSpectrum,
} from 'utils/utils.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'compare',
  data() {
    return {
      chartData: {} /* 图谱信息 */,
      paramsData: {} /* 参数信息 */,
      color: {
        /* 颜色设置 */ titleColor: '#666' /* 标题字体 */,
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
          background: 'rgba(255, 155, 33, 0.8)',
        },
        background: '#fff' /* 背景颜色 */,
      },
      dataListTitle: ['显示', '颜色', '名称', '时间', '操作'],
      dataList: [] /* 数据列表 */,
      isNewChart: true /* 是否为添加/删除图谱 */,
      currentKey: '' /* 当前显示图谱索引 */,
      currentIndex: 0 /* 当前显示第几个图谱 */,
      waveIcon: [
        /* 0 */ { class: 'icon-selectunit_huaban', title: '单位选择' },
        /* 1 */ {
          class: 'icon-MAX_huaban icon-MAX_huaban-compare_wave',
          title: '选框放大',
        } /* {class: 'icon-exporemusic_huaban icon-exporemusic_huaban-compare_wave', title: '音频导出'}, */ /* {class: 'icon-exportdata_huaban icon-exportdata_huaban-compare_wave', title: '数据导出'}, */,
        /* 2 */ /* 3 */ /* 4 */ {
          class: 'icon-restore_huaban icon-restore_huaban-compare_wave',
          title: '重置',
        },
        /* 5 */ {
          class: 'icon-enlarge_huaban icon-enlarge_huaban-compare_wave',
          title: '选框放大',
        },
        /* {class: 'icon-savemage_huaban icon-savemage_huaban-compare_wave', title: '保存为图片'}, */
        /* 8 */ {
          class: 'icon-subtime_huaban icon-subtime_huaban-compare_wave',
          title: '时间差',
        },
        /* 7 */
      ],
      spectrumIcon: [
        /* 0 */ {
          class: 'icon-selectunit_huaban',
          title: '单位选择',
          isCheck: false,
          parentClass: '',
        },
        /* 1 */ {
          class: 'icon-MAX_huaban icon-MAX_huaban-compare_spectrum',
          title: '选框放大',
          isCheck: false,
          parentClass: '',
        } /* {class: 'icon-exportdata_huaban icon-exportdata_huaban-compare_spectrum', title: '数据导出'}, */,
        /* 2 */ /* 3 */ {
          class: 'icon-restore_huaban icon-restore_huaban-compare_spectrum',
          title: '重置',
          isCheck: false,
          parentClass: '',
        },
        /* 4 */ {
          class: 'icon-enlarge_huaban icon-enlarge_huaban-compare_spectrum',
          title: '选框放大',
          isCheck: false,
          parentClass: '',
        },
        /* 5 */ {
          class: 'icon-savemage_huaban icon-savemage_huaban-compare_spectrum',
          title: '保存为图片',
          isCheck: false,
          parentClass: '',
        },
        /* 6 */ {
          class: 'icon-pinputuduishuzuobiaoqiehuan_huaban',
          title: '对数坐标',
          isCheck: false,
          parentClass: '',
        } /* {class: 'chart-btn-active icon-xiaozhunbeipin_huaban icon-xiaozhunbeipin_huaban-compare_spectrum', title: '校准倍频'}, */ /* {class: 'icon-xunhuanxunfeng_huaban_huaban icon-xunhuanxunfeng_huaban_huaban-compare_spectrum', title: '循环寻峰'}, */ /* 8 */ /* 9 */,
        /* 7 */ {
          class:
            'icon-quxiaobiaozhu_huaban icon-quxiaobiaozhu_huaban-compare_spectrum',
          title: '取消标注',
          isCheck: false,
          parentClass: '',
        },
        /* 10 */ {
          class: 'icon-biaozhu_huaban icon-biaozhu_huaban-compare_spectrum',
          title: '添加标注',
          isCheck: false,
          parentClass: '',
        },
        /* 11 */
        {
          class:
            'icon-biaozhubeipin_huaban icon-biaozhubeipin_huaban-compare_spectrum',
          title: '标注倍频',
          isCheck: false,
          parentClass: '',
        },
        /* 12 */ {
          class: 'icon-youxiaopinshuaishezhi_huaban',
          title: '有效频段设置',
          isCheck: false,
          parentClass: '',
        },
        /* 13 */ {
          class: 'icon-dipinguolv_huaban',
          title: '低频过滤',
          isCheck: false,
          parentClass: '',
        } /* {class: 'icon-dingweidaobeipin_huaban icon-dingweidaobeipin_huaban-compare_spectrum', title: '定位到1倍频'}, */ /* {class: 'icon-qiehuanXzhoujiebi_huaban', title: '切换阶比'}, */,
        /* 14 */ /* 15 */ /* 16 */ {
          class: 'chart-btn-active icon-hanningchuang_huaban',
          title: '汉宁窗',
          isCheck: false,
          parentClass: '',
        },
        /* 17 */ {
          class:
            'icon-duichengpinshuaicha_huaban icon-duichengpinshuaicha_huaban-compare_spectrum',
          title: '对称频率差',
          isCheck: false,
          parentClass: '',
        },
      ],
      colorList: [
        '#3300CC',
        '#CCCC00',
        '#993366',
        '#00CC99',
        '#996666',
        '#6666FF',
        '#999699',
        '#FE9300',
        '#FDCB03',
        '#FBFF0A',
        '#84CB0A',
        '#008F5A',
        '#1196BC',
        '#316DB4',
        '#733195',
      ] /* 备选颜色 */,
      basicTitle: [
        '序号',
        '颜色',
        '名称',
        '时间',
        '频谱X',
        '频谱Y',
        '波形X',
        '波形Y',
        '转速(rpm)',
        '有效值(rms)',
        '峰值(p)',
        '峰峰值(pp)',
      ],
      operateIcon: [
        { class: 'iconfont icon-up3', title: '下移' },
        { class: 'iconfont icon-up2', title: '上移' },
        { class: 'iconfont icon-cuohao', title: '删除' },
      ],
      delKey: [] /* 需要删除key */,
      offset: {} /* 拖放弹窗信息 */,
    }
  },
  watch: {
    '$store.state.compareMsg': {
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
      this.$nextTick(() => {
        const params = this.paramsData[this.currentKey]
        if (params && params.isShow) {
          params.waveChart.resize()
          params.spectrumChart.resize()
        }
      })
    },
  },
  methods: {
    // 打开图谱
    openChartList(key, type, delKey) {
      if (typeof key !== 'string') return
      const [, , macId, posId, posType] = key.split('_')
      const keyArr = Object.keys(this.chartData)
      const state = this.$store.state
      if (type === 0 || type === 1) {
        this.currentIndex = keyArr.indexOf(key)
        this.currentKey = key
        for (let k in this.paramsData) {
          this.paramsData[k].isShow = false
          this.paramsData[k].isNewChart = {
            wave: false,
            spectrum: false,
          }
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length
          let data = {}
          for (let k in state.compareData) {
            this.$set(data, k, cloneObj(state.compareData[k], true))
          }
          const chart = {}
          let params = {
            isShow: true,
            waveChart: null,
            spectrumChart: null,
            isHanning: true,
            waveMax: false,
            spectrumMax: false,
            isLog: false /* 对数坐标 */,
            isSubFreq: false,
            chartType: 'line',
            showData: false,
            showBasic: false,
            isLabelFreq: false /* 标注倍频 */,
            basicMsg: [],
            freq: {
              /* 频率设置 */ lowerLimit: '' /* 有效频段下限 */,
              upperLimit: '' /* 有效频段上限 */,
              lowFreq: '' /* 低频过滤 */,
            },
          }
          const viewType = [3, 6, 8]
          let isViewRms = false
          let i = 0
          for (const k in data) {
            const value = data[k]
            chart[k] = {
              wave: cloneObj(value.wave, true),
              spectrum: cloneObj(value.spectrum, true),
            }
            delete value.wave
            delete value.spectrum
            !isViewRms && viewType.includes(value.posType) && (isViewRms = true)
            value.color = this.colorList[i % 15]
            params.basicMsg.push({
              color: this.colorList[i % 15],
              name: value.posName,
              macName: value.macName,
              time: getTime(value.time),
              spectrumX: '',
              spectrumY: '',
              waveX: '',
              waveY: '',
              speed: value.speed,
              key: k,
              rms: value.rms,
              p: value.p,
              pp: value.pp,
              pos: value.pos,
            })
            params[k] = value
            i++
          }
          params.isViewRms = isViewRms
          this.$set(this.chartData, key, chart)
          this.$set(this.paramsData, key, params)
          this.$nextTick(() => {
            this.setOption()
          })
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          this.$nextTick(() => {
            this.paramsData[key].waveChart.resize()
            this.paramsData[key].spectrumChart.resize()
          })
          break
        case 2 /* 关闭图表 */:
          this.paramsData[key].waveChart.destory()
          this.paramsData[key].waveChart = null
          this.paramsData[key].spectrumChart.destory()
          this.paramsData[key].spectrumChart = null
          this.$delete(this.paramsData, key)
          this.$delete(this.chartData, key)
          break
      }
    },
    // 设置图谱option
    setOption() {
      const color = this.color
      const currentKey = this.currentKey
      const currentIndex = this.currentIndex
      const data = this.chartData[currentKey]
      const params = this.paramsData[currentKey]
      const basic = params.basicMsg
      const posName = []
      const wave = {
        x: [],
        unitX: [],
        y: [],
        unitY: [],
      }
      const spectrum = {
        x: [],
        unitX: [],
        y: [],
        unitY: [],
      }
      const seriesColor = []
      for (const key in data) {
        const value1 = data[key]
        const value2 = params[key]
        if (!value2.isShow) continue
        wave.x.push(value1.wave.curX)
        wave.unitX.push(value1.wave.curUnitX)
        wave.y.push(value1.wave.curY)
        wave.unitY.push(value1.wave.curUnitY)
        spectrum.x.push(value1.spectrum.curX)
        spectrum.unitX.push(value1.spectrum.curUnitX)
        spectrum.y.push(value1.spectrum.curY)
        spectrum.unitY.push(value1.spectrum.curUnitY)
        posName.push(value2.posName)
        seriesColor.push(value2.color)
      }
      const waveOption = {
        type: {
          chart: 2 /* 1.波形频谱图 2.对比分析 */,
          chartType: 'wave' /* 波形（wave）,频谱（spectrum） */,
        },
        title: {
          show: true,
          name: '波形图',
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
          name: wave.unitX,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          type: 'category',
          data: wave.x,
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
          name: wave.unitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: wave.y,
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
            color: seriesColor, // 颜色，默认 '#0032ff
            width: 1, // 粗细，默认 1
          },
          posName: posName,
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
          formatter(param) {
            for (let i = 0, l = wave.y.length; i < l; i++) {
              const xArr = wave.x[i]
              const yArr = wave.y[i]
              if (xArr[param.key] === param.val) {
                basic[i].waveX = round(param.val, 4)
                basic[i].waveY = round(yArr[param.key], 4)
              }
            }
          },
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban-compare_wave'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-compare_wave'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-compare_wave'
            )[currentIndex],
          },
          // 时间差
          timeDifferent: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-subtime_huaban-compare_wave'
            )[currentIndex],
          },
          // 导出图片
          /* exportImage: {
                  show: true,
                  dom: document.getElementsByClassName('icon-savemage_huaban-compare_wave')[currentIndex],
                  imageName: `${posName}_波形图`,
               }, */
          // 导出数据
          /* exportData: {
                  fileName: posName,
                  show: true,
                  dom: document.getElementsByClassName('icon-exportdata_huaban-compare_wave')[currentIndex],
               }, */
          // 导出音频
          /* exportAudio: {
                  fileName: `${posName}_音频`,
                  show: true,
                  dom: document.getElementsByClassName('icon-exporemusic_huaban-compare_wave')[currentIndex],
                  maxFreq: this.freq,
               } */
        },
        backgroundColor: color.background,
      }
      const spectrumOption = {
        type: {
          chart: 2 /* 1.波形频谱图 2.对比分析 */,
          chartType: 'spectrum' /* 波形（wave）,频谱（spectrum） */,
        },
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
          name: spectrum.unitX,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          type: 'category',
          data: spectrum.x,
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
          name: spectrum.unitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: spectrum.y,
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
          type: params.chartType, // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: seriesColor, // 颜色，默认 '#0032ff
            width: 1, // 粗细，默认 1
          },
          posName: posName,
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
          formatter(param) {
            for (let i = 0, l = spectrum.y.length; i < l; i++) {
              const xArr = spectrum.x[i]
              const yArr = spectrum.y[i]
              if (xArr[param.key] === param.val) {
                basic[i].spectrumX = round(param.val, 4)
                basic[i].spectrumY = round(yArr[param.key], 4)
              }
            }
          },
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban-compare_spectrum'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-compare_spectrum'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-compare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = false
              removeClass(
                document.getElementsByClassName(
                  'icon-duichengpinshuaicha_huaban-compare_spectrum'
                )[currentIndex],
                'chart-btn-active'
              )
            },
          },
          // 差频
          subFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-duichengpinshuaicha_huaban-compare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = !params.isSubFreq
              params.isSubFreq &&
                addClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-compare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
              !params.isSubFreq &&
                removeClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-compare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
            },
          },
          // 1倍频
          /* oneFreq: {
                  show: true,
                  dom: document.getElementsByClassName('icon-dingweidaobeipin_huaban-compare_spectrum')[currentIndex],
                  formatter: function(bool) {
                     // bool && (that.spectrumTools[6].className = '');
                  }
               }, */
          // 标注倍频
          labelFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhubeipin_huaban-compare_spectrum'
            )[currentIndex],
            icon: {
              isCheck: params.isLabelFreq,
            },
          },
          // 寻峰
          /* peakSearch: {
                  show: true,
                  dom: document.getElementsByClassName('icon-xunhuanxunfeng_huaban_huaban-compare_spectrum')[currentIndex],
               }, */
          // 添加标注
          addLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhu_huaban-compare_spectrum'
            )[currentIndex],
          },
          // 取消标注
          cancelLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-quxiaobiaozhu_huaban-compare_spectrum'
            )[currentIndex],
          },
          // 校准倍频
          /* setPeak: {
                  show: true,
                  dom: document.getElementsByClassName('icon-xiaozhunbeipin_huaban-compare_spectrum')[currentIndex],
               }, */
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban-compare_spectrum'
            )[currentIndex],
            imageName: posName + '_频谱图',
          },
          // 导出数据
          /* exportData: {
                  fileName: this.fileName,
                  show: true,
                  dom: document.getElementsByClassName('icon-exportdata_huaban-compare_spectrum')[currentIndex],
               }, */
        },
        backgroundColor: color.background,
      }
      this.$nextTick(() => {
        const index = this.currentIndex
        params.waveChart === null &&
          (params.waveChart = myChart.init(this.$refs.waveChart[index]))
        params.spectrumChart === null &&
          (params.spectrumChart = myChart.init(this.$refs.spectrumChart[index]))
        params.waveChart.setOption(waveOption)
        params.spectrumChart.setOption(spectrumOption)
      })
    },
    // 设置波形图option
    setWave() {
      const color = this.color
      const currentKey = this.currentKey
      const currentIndex = this.currentIndex
      const data = this.chartData[currentKey]
      const params = this.paramsData[currentKey]
      const basic = params.basicMsg
      const posName = []
      const wave = {
        x: [],
        unitX: [],
        y: [],
        unitY: [],
      }
      const seriesColor = []
      for (const key in data) {
        const waves = data[key].wave
        const value = params[key]
        if (!value.isShow) continue
        wave.x.push(waves.curX)
        wave.unitX.push(waves.curUnitX)
        wave.y.push(waves.curY)
        wave.unitY.push(waves.curUnitY)
        seriesColor.push(value.color)
        posName.push(value.posName)
      }
      const waveOption = {
        type: {
          chart: 2 /* 1.波形频谱图 2.对比分析 */,
          chartType: 'wave' /* 波形（wave）,频谱（spectrum） */,
        },
        title: {
          show: true,
          name: '波形图',
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
          name: wave.unitX,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          type: 'category',
          data: wave.x,
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
          name: wave.unitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: wave.y,
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
            color: seriesColor, // 颜色，默认 '#0032ff
            width: 1, // 粗细，默认 1
          },
          posName: posName,
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
          formatter(param) {
            for (let i = 0, l = wave.y.length; i < l; i++) {
              const xArr = wave.x[i]
              const yArr = wave.y[i]
              if (xArr[param.key] === param.val) {
                basic[i].waveX = round(param.val, 4)
                basic[i].waveY = round(yArr[param.key], 4)
              }
            }
          },
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban-compare_wave'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-compare_wave'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-compare_wave'
            )[currentIndex],
          },
          // 时间差
          timeDifferent: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-subtime_huaban-compare_wave'
            )[currentIndex],
          },
          // 导出图片
          /* exportImage: {
                  show: true,
                  dom: document.getElementsByClassName('icon-savemage_huaban-compare_wave')[currentIndex],
                  imageName: `${posName}_波形图`,
               }, */
          // 导出数据
          /* exportData: {
                  fileName: posName,
                  show: true,
                  dom: document.getElementsByClassName('icon-exportdata_huaban-compare_wave')[currentIndex],
               }, */
          // 导出音频
          /* exportAudio: {
                  fileName: `${posName}_音频`,
                  show: true,
                  dom: document.getElementsByClassName('icon-exporemusic_huaban-compare_wave')[currentIndex],
                  maxFreq: this.freq,
               } */
        },
        backgroundColor: color.background,
      }
      this.$nextTick(() => {
        const index = this.currentIndex
        params.waveChart === null &&
          (params.waveChart = myChart.init(this.$refs.waveChart[index]))
        params.waveChart.setOption(waveOption)
      })
    },
    // 设置频谱图option
    setSpectrum() {
      const color = this.color
      const currentKey = this.currentKey
      const currentIndex = this.currentIndex
      const data = this.chartData[currentKey]
      const params = this.paramsData[currentKey]
      const basic = params.basicMsg
      const posName = []
      const spectrum = {
        x: [],
        unitX: [],
        y: [],
        unitY: [],
      }
      const seriesColor = []
      for (const key in data) {
        const value1 = data[key]
        const value2 = params[key]
        if (!value2.isShow) continue
        spectrum.x.push(value1.spectrum.curX)
        spectrum.unitX.push(value1.spectrum.curUnitX)
        spectrum.y.push(value1.spectrum.curY)
        spectrum.unitY.push(value1.spectrum.curUnitY)
        posName.push(value2.posName)
        seriesColor.push(value2.color)
      }
      const spectrumOption = {
        type: {
          chart: 2 /* 1.波形频谱图 2.对比分析 */,
          chartType: 'spectrum' /* 波形（wave）,频谱（spectrum） */,
        },
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
          name: spectrum.unitX,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          type: 'category',
          data: spectrum.x,
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
          name: spectrum.unitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          data: spectrum.y,
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
          type: params.chartType, // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: seriesColor, // 颜色，默认 '#0032ff
            width: 1, // 粗细，默认 1
          },
          posName: posName,
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
          formatter(param) {
            for (let i = 0, l = spectrum.y.length; i < l; i++) {
              const xArr = spectrum.x[i]
              const yArr = spectrum.y[i]
              if (xArr[param.key] === param.val) {
                basic[i].spectrumX = round(param.val, 4)
                basic[i].spectrumY = round(yArr[param.key], 4)
              }
            }
          },
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban-compare_spectrum'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-compare_spectrum'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-compare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = false
              removeClass(
                document.getElementsByClassName(
                  'icon-duichengpinshuaicha_huaban-compare_spectrum'
                )[currentIndex],
                'chart-btn-active'
              )
            },
          },
          // 差频
          subFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-duichengpinshuaicha_huaban-compare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = !params.isSubFreq
              params.isSubFreq &&
                addClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-compare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
              !params.isSubFreq &&
                removeClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-compare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
            },
          },
          // 1倍频
          /* oneFreq: {
                  show: true,
                  dom: document.getElementsByClassName('icon-dingweidaobeipin_huaban-compare_spectrum')[currentIndex],
                  formatter: function(bool) {
                     // bool && (that.spectrumTools[6].className = '');
                  }
               }, */
          // 标注倍频
          labelFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhubeipin_huaban-compare_spectrum'
            )[currentIndex],
            icon: {
              isCheck: params.isLabelFreq,
            },
          },
          // 寻峰
          /* peakSearch: {
                  show: true,
                  dom: document.getElementsByClassName('icon-xunhuanxunfeng_huaban_huaban-compare_spectrum')[currentIndex],
               }, */
          // 添加标注
          // addLabel: {
          //   show: true,
          //   dom: document.getElementsByClassName(
          //     'icon-biaozhu_huaban-compare_spectrum'
          //   )[currentIndex],
          // },
          // 取消标注
          cancelLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-quxiaobiaozhu_huaban-compare_spectrum'
            )[currentIndex],
          },
          // 校准倍频
          /* setPeak: {
                  show: true,
                  dom: document.getElementsByClassName('icon-xiaozhunbeipin_huaban-compare_spectrum')[currentIndex],
               }, */
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban-compare_spectrum'
            )[currentIndex],
            imageName: posName + '_频谱图',
          },
          // 导出数据
          /* exportData: {
                  fileName: this.fileName,
                  show: true,
                  dom: document.getElementsByClassName('icon-exportdata_huaban-compare_spectrum')[currentIndex],
               }, */
        },
        backgroundColor: color.background,
      }
      this.$nextTick(() => {
        const index = this.currentIndex
        params.spectrumChart === null &&
          (params.spectrumChart = myChart.init(this.$refs.spectrumChart[index]))
        params.spectrumChart.setOption(spectrumOption)
      })
    },
    /* 点击操作按钮
         type    String    图谱类型
         icon    Object    图标信息
         index   Number    图标下标
       */
    clickIcon(type, icon, index, e) {
      const tag = e.currentTarget
      const currentIndex = this.currentIndex
      const currentKey = this.currentKey
      const params = this.paramsData[currentKey]
      const chart = this.chartData[currentKey]
      const waveComapreEl = this.$refs.waveCompare[currentIndex]
      const spectrumComapreEl = this.$refs.spectrumCompare[currentIndex]
      const shieldUnit = ['gD', '°', 'mV', 'rpm']
      params[`${type}Max`] = !params[`${type}Max`]
      const isMax = params[`${type}Max`]
      if (index === 1) {
        const compareBox = this.$refs.compareChart[currentIndex]
        isMax ? (compareBox.style.display = 'block') : (compareBox.style = null)
      }
      let waveChart = null
      let spectrumChart = null
      for (const k in chart) {
        const value = chart[k]
        if (!shieldUnit.includes(value.srcUnitY)) {
          waveChart = value.wave
          spectrumChart = value.spectrum
          break
        }
      }
      if (type === 'wave') {
        switch (index) {
          case 0 /* 切换单位 */:
            if (waveChart === null) return
            this.$WavePop({
              type: 1,
              title: '单位选择',
              src: waveChart.srcUnitY,
              cur: waveChart.curUnitY,
              opt: 0,
              unitX: waveChart.curUnitX,
            }).then((res) => {
              if (res) {
                for (const k in chart) {
                  const value = chart[k].wave
                  if (!shieldUnit.includes(value.srcUnitY)) {
                    this.setUnit(0, res.unit, k)
                    this.setWave()
                  }
                }
              }
            })
            break
          case 1 /* 最大化、还原 */:
            if (isMax) {
              waveComapreEl.style.height = '100%'
              spectrumComapreEl.style.display = 'none'
              changeClass(tag, 'icon-back_huaban', 'icon-MAX_huaban')
              this.$nextTick(() => {
                params.waveChart.resize()
                params.spectrumChart.resize()
              })
            } else {
              waveComapreEl.style = null
              spectrumComapreEl.style = null
              changeClass(tag, 'icon-MAX_huaban', 'icon-back_huaban')
              this.$nextTick(() => {
                params.waveChart.resize()
                params.spectrumChart.resize()
              })
            }
            break
        }
      } else if (type === 'spectrum') {
        const freq = params.freq
        switch (index) {
          case 0 /* 切换单位 */:
            if (spectrumChart === null) return
            this.$WavePop({
              type: 1,
              title: '单位选择',
              src: spectrumChart.srcUnitY,
              cur: spectrumChart.curUnitY,
              opt: 1,
              unitX: spectrumChart.curUnitX,
            }).then((res) => {
              if (res) {
                for (let k in chart) {
                  let value = chart[k].spectrum
                  let flag = value.curUnitY === res.unit
                  if (!shieldUnit.includes(value.srcUnitY)) {
                    this.setUnit(1, res.unit, k)
                    !flag && this.getFreq(k, 1);
                  }
                }
                this.setSpectrum()
              }
            })
            break
          case 1 /* 最大化、还原 */:
            if (isMax) {
              spectrumComapreEl.style.height = '100%'
              waveComapreEl.style.display = 'none'
              changeClass(tag, 'icon-back_huaban', 'icon-MAX_huaban')
            } else {
              spectrumComapreEl.style = null
              waveComapreEl.style = null
              changeClass(tag, 'icon-MAX_huaban', 'icon-back_huaban')
            }
            break
          case 5 /* 设置对数坐标 */:
            params.isLog = !params.isLog
            params.isLog && addClass(tag, 'chart-btn-active')
            !params.isLog && removeClass(tag, 'chart-btn-active')
            for (const k in chart) {
              let data = chart[k].spectrum
              //若当前单位为默认单位，getFreq处理时取srcY
              if (params.isLog) {
                //打开对数坐标
                if (data.curUnitY === data.srcUnitY) {
                  this.getFreq(k)
                } else {
                  //若当前单位切换过，getFreq则处理时取curY
                  this.getFreq(k, 1)
                }
              } else {
                data.curUnitY = data.srcUnitY
                this.getFreq(k)
              }
            }
            this.setSpectrum()
            break
          case 8:
            params.isLabelFreq = !params.isLabelFreq
            params.isLabelFreq && addClass(tag, 'chart-btn-active')
            !params.isLabelFreq && removeClass(tag, 'chart-btn-active')
            break
          case 9 /* 有效频段设置 */:
            this.$WavePop({
              type: 0,
              title: '有效频段',
              upperLimit: freq.upperLimit,
              lowerLimit: freq.lowerLimit,
            }).then((res) => {
              if (res) {
                freq.lowerLimit = Number(res.lowerLimit)
                freq.upperLimit = Number(res.upperLimit)
                for (const k in chart) {
                  let data = chart[k].spectrum
                  //打开对数坐标
                  if (data.curUnitY === data.srcUnitY) {
                    this.getFreq(k)
                  } else {
                  //若当前单位切换过，getFreq则处理时取curY
                    this.getFreq(k, 1)
                  }
                }
                this.setSpectrum()
              }
            })
            break
          case 10 /* 低频过滤 */:
            this.$WavePop({
              lowFreq: freq.lowFreq,
              title: '低频过滤',
              type: 0,
            }).then((res) => {
              if (res) {
                freq.lowFreq = Number(res.lowFreq)
                for (const k in chart) {
                  let data = chart[k].spectrum
                  //打开对数坐标
                  if (data.curUnitY === data.srcUnitY) {
                    this.getFreq(k)
                  } else {
                  //若当前单位切换过，getFreq则处理时取curY
                    this.getFreq(k, 1)
                  }
                }
                this.setSpectrum()
              }
            })
            break
          case 11 /* 设置汉宁窗 */:
            params.isHanning = !params.isHanning
            params.isHanning && addClass(tag, 'chart-btn-active')
            !params.isHanning && removeClass(tag, 'chart-btn-active')
            const hanning = ['srcY', 'hanning']
            for (const k in chart) {
              const value = chart[k].spectrum
              value.curY = cloneObj(
                value[hanning[Number(params.isHanning)]],
                true
              )
              if (value.srcUnitY !== value.curUnitY) {
                const newUnit = value.curUnitY
                value.curUnitY = value.srcUnitY
                this.setUnit(1, newUnit, k)
              }
              this.getFreq(k, 1)
            }
            this.setSpectrum()
            break
        }
      }
    },
    // 单位选择确认
    setUnit(type, newUnit, key) {
      const curKey = this.currentKey
      const chartType = ['wave', 'spectrum']
      const chart = this.chartData[curKey][key][chartType[type]]
      const params = this.paramsData[curKey]
      const chartData = params[key]
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
      if (type === 1 && params.isHanning) {
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
          if (type === 0) {
            curY = makeWaveY(srcY, chartData.freq)
          } else if (type === 1) {
            curY = integralFft(
              srcY,
              l,
              chartData.freq / chartData.samples,
              srcIndex
            )
          }
        } else if (newIndex === 3) {
          if (srcIndex < 2) {
            if (type === 0) {
              curY = makeWaveY(srcY, chartData.freq)
            } else if (type === 1) {
              curY = integralFft(
                srcY,
                l,
                chartData.freq / chartData.samples,
                srcIndex
              )
            }
          } else {
            curY = srcY
          }
          if (type === 0) {
            curY = makeWaveY(curY, chartData.freq)
          } else if (type === 1) {
            curY = integralFft(curY, l, chartData.freq / chartData.samples, 2)
          }
        }
        chart.curY = curY
        chart.curUnitY = newUnit
        // type === 1 && this.getFreq(1);
      }
    },
    /*
         type    Object    0: 有效频段、低频过滤, 1: 单位选择
         key     String    对应数据索引
      */
    getFreq(key, type = 0) {
      const currentKey = this.currentKey
      const params = this.paramsData[currentKey]
      const data = cloneObj(this.chartData[currentKey][key].spectrum, true)
      const freq = cloneObj(params.freq, true)
      const isHanning = Number(params.isHanning)
      const hanningAxis = ['srcY', 'hanning']
      const srcX = data.srcX
      let srcY = data[hanningAxis[isHanning]]
      if (type === 1) {
        srcY = data.curY
      }
      const index = this.getIndex(freq.lowFreq, key)
      const start = this.getIndex(freq.lowerLimit, key)
      const b = freq.upperLimit
      let end = this.getIndex(b, key) + 1
      isNaN(end) && (end = srcX.length)
      ;(b === 0 || b === '') && (end = srcX.length)
      let arrY = []
      // 低频过滤
      for (let i = 0, l = srcY.length; i <= l; i++) {
        if (index !== 0 && i <= index) {
          arrY.push(0)
        } else {
          arrY.push(srcY[i])
        }
      }
      this.isNewChart = true
      // 有效频段
      data.curX = srcX.slice(start, end)
      data.curY = arrY.slice(start, end)
      // 计算对数
      if (params.isLog) {
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
      this.chartData[currentKey][key].spectrum = data
    },
    // 频谱图根据值确定下标
    getIndex(value, key, type = 0) {
      const axis = ['srcX', 'srcY']
      const data = this.chartData[this.currentKey][key].spectrum[axis[type]]
      for (let i = 0, l = data.length; i < l; i++) {
        if (data[i] >= value) return i
      }
    },
    // 拖入测点
    addPos(e) {
      const posMsg = JSON.parse(e.dataTransfer.getData('flag'))
      let mId, pId, pType
      if (posMsg.posFlag) {
        ;[mId, pId, pType] = posMsg.posFlag.split('_')
      } else {
        mId = posMsg.machine_id
        pId = posMsg.position_id
        pType = posMsg.position_type
      }
      const state = this.$store.state
      const currentTime = state.currentTime
      const compareList = cloneObj(state.compareData, true)
      // 同一测点同一时间无法拖入
      if (currentTime != 0) {
        if (compareList[`wave_pos_${posMsg.posFlag}_${currentTime}`]) return
      }
      const currentKey = this.currentKey
      const chart = this.chartData[currentKey]
      const params = this.paramsData[currentKey]
      const keyArr = Object.keys(params)
      const isReal = Number(currentTime === 0)
      const isSpeed = Number(pType === '1')
      const mac = cloneObj(state.checkMsg.mac)
      this.$getApi
        .getWaveformAndSpectrum({
          machineId: mId,
          positionId: pId,
          positionType: pType,
          isFFT: true,
          isWave: true,
          isReal,
          currTime: [currentTime],
          type: isSpeed,
        })
        .then((res) => {
          if (res) {
            const info = res.info
            if (info && info.length > 0 && info[0]) {
              const time = info[0].value.saveTime_Com
              // 若当前baseMsg中存在当前测点的当前时间波形数据
              for (let i = 0, len = params.basicMsg.length; i < len; i++) {
                if (
                  params.basicMsg[i].key ==
                  `wave_pos_${mId}_${pId}_${pType}_${time}`
                ) {
                  this.$pop('当前对比分析图存在该测点！')
                  return
                }
              }
              let chartType = 1
              const defaultCode = getdefaultCode(posMsg.dgm_type)
              const code = defaultCode[pType]
              const unit = {
                wave: 's',
                y: getUnit(code.code, posMsg),
                spectrum: 'Hz',
              }
              if (pType == '8' || pType == '9') {
                chartType = 2
                unit.wave = 'smpl'
                unit.spectrum = 'NX'
              }
              let keyTimes = 0
              for (let i = 0, l = keyArr.length; i < l; i++) {
                keyArr[i].includes('wave_pos_') && keyTimes++
              }
              const obj = info[0].waveObject
              let spectral = 0
              if (chartType === 2) {
                if (obj.cycles > 0 && obj.samples > 0) {
                  spectral = obj.samples / obj.cycles
                } else if (obj.b[2] > 0 && obj.samples) {
                  spectral = obj.samples / obj.b[2]
                } else {
                  spectral = 1
                }
              }
              const pd = {
                chartType,
                color: this.colorList[keyTimes % 15],
                isShow: true,
                oneFreq: obj.speed === 0 ? 0.908 / 60 : obj.speed / 60,
                freq: obj.freq,
                posName: posMsg.position_name,
                macName:
                  posMsg.t_root == 1 || posMsg.t_root == 2
                    ? mac.pump_name
                    : posMsg.mac_name,
                rms: info[0].value[code.filed],
                samples: obj.samples,
                spectral: 0,
                speed: obj.speed,
                time,
              }
              !params.isViewRms &&
                ['3', '6', '8'].includes(pType) &&
                (params.isViewRms = true)
              const flag = `wave_pos_${posMsg.posFlag}_${pd.time}`
              const waveX = []
              const waveY = obj.wave
              let i = 0
              let l = waveY.length
              const addNum = l / obj.freq / l
              // for (; i < l; i++) {
              //   waveX.push(i * addNum)
              // }
              // 阶次与频谱区分(新增)
              if (chartType === 2) {
                for (i = 0; i < l; i++) {
                  waveX.push(i)
                }
              } else {
                for (; i < l; i++) {
                  waveX.push(i * addNum)
                }
              }
              let fftX = []
              let ratio = []
              let fftY = []
              let hanning = []
              // const outX = info[0].fft.OutX
              // const outY = info[0].fft.OutY
              // i = 0
              // l = outX.length
              // for (; i < l; i++) {
              //   const xValue = outX[i]
              //   const yValue = outY[i]
              //   fftX.push(xValue)
              //   ratio.push(
              //     Math.round(((xValue * 60) / obj.speed) * 100000) / 100000
              //   )
              //   fftY.push(xValue)
              //   hanning.push(info[0].fftWithHanning.OutY[i])
              // }
              // 取频谱数据
              const spectrumData = setSrcSpectrum(
                obj.freq,
                waveY,
                chartType,
                spectral
              )
              // 计算切换阶比数据
              const outX = spectrumData.fftX
              // 转速测点时取speed_value,其他类型测点取speed
              if (chartType === 1) {
                if (pType == 1) {
                  if (info[0].value.speed_value != 0) {
                    for (let i = 0, len = outX.length; i < len; i++) {
                      ratio.push(
                        Math.round(
                          ((outX[i] * 60) / Number(info[0].value.speed_value)) *
                            100000
                        ) / 100000
                      )
                    }
                  }
                } else {
                  if (info[0].value.speed != 0) {
                    for (let i = 0, len = outX.length; i < len; i++) {
                      ratio.push(
                        Math.round(
                          ((outX[i] * 60) / Number(info[0].value.speed)) *
                            100000
                        ) / 100000
                      )
                    }
                  }
                }
              }
              fftX = spectrumData.fftX
              fftY = spectrumData.fftY
              hanning = spectrumData.hanning
              chart[flag] = {
                wave: {
                  srcX: waveX,
                  curX: waveX,
                  curUnitX: unit.wave,
                  srcY: waveY,
                  curY: waveY,
                  srcUnitY: unit.y,
                  curUnitY: unit.y,
                },
                spectrum: {
                  srcX: fftX,
                  curX: fftX,
                  ratio,
                  curUnitX: unit.spectrum,
                  srcY: fftY,
                  curY: hanning,
                  hanning: hanning,
                  srcUnitY: unit.y,
                  curUnitY: unit.y,
                },
              }
              let p = 1000000000
              let pp = 1000000000
              if (pType === '3' || pType === '8') {
                p = round(info[0].value.vib_p, 4)
                pp = round(info[0].value.vib_pp, 4)
              }
              if (pType === '6') {
                p = round(info[0].value.rock_p, 4)
                pp = round(info[0].value.rock_pp, 4)
              }
              params.basicMsg.push({
                color: this.colorList[params.basicMsg.length % 15],
                name: pd.posName,
                macName: pd.macName,
                time: getTime(time),
                spectrumX: '',
                spectrumY: '',
                waveX: '',
                waveY: '',
                speed: pd.speed,
                rms: round(info[0].value[code.filed], 4),
                p,
                pp,
                key: flag,
                pos: posMsg,
              })
              params[flag] = pd
              const store = {
                wave: {
                  srcX: waveX,
                  curX: waveX,
                  curUnitX: unit.wave,
                  srcY: waveY,
                  curY: waveY,
                  srcUnitY: unit.y,
                  curUnitY: unit.y,
                },
                spectrum: {
                  srcX: fftX,
                  curX: fftX,
                  ratio,
                  curUnitX: unit.spectrum,
                  srcY: fftY,
                  curY: hanning,
                  hanning: hanning,
                  srcUnitY: unit.y,
                  curUnitY: unit.y,
                },
                speed: pd.speed,
                rms: pd.rms,
                chartType: pd.chartType,
                freq: pd.freq,
                isShow: true,
                oneFreq: pd.oneFreq,
                posName: pd.posName,
                samples: pd.samples,
                spectral: pd.spectral,
                time: pd.time,
                posType: pType,
                p: 1000000000,
                pp: 1000000000,
                macName: pd.macName,
              }
              if (pType === 3 || pType === 8) {
                store.p = round(info[0].value.vib_p, 4)
                store.pp = round(info[0].value.vib_pp, 4)
              }
              if (pType === 6) {
                store.p = round(info[0].value.rock_p, 4)
                store.pp = round(info[0].value.rock_pp, 4)
              }
              params.basicMsg.p = store.p
              params.basicMsg.pp = store.pp
              this.$store.commit('setCompare', {
                key: flag,
                data: store,
              })
              if (
                Number(params.freq.lowerLimit) != 0 ||
                Number(params.freq.upperLimit) != 0 ||
                Number(params.freq.lowerLimit) != 0
              ) {
                for (const k in chart) {
                  this.getFreq(k)
                }
              }
              this.setOption()
            } else {
              this.$pop('当前测点无波形数据！')
            }
          }
        })
    },
    // 数据列表
    setDataList() {
      const data = cloneObj(this.$store.state.compareData, true)
      const paramsData = this.paramsData[this.currentKey]
      const basic = paramsData.basicMsg
      // 从vuex中的compareData去key值
      // const compareDate = cloneObj(this.$store.state.compareData, true)
      let dataList = []
      for (let i = 0; i < basic.length; i++) {
        let l = dataList.length
        let flag = false //dataList是否已存在该数据，默认不存在
        for (let j = 0; j < l; j++) {
          if (basic[i].key == dataList[j].key) {
            flag = true
          }
        }
        if (!flag) {
          dataList.push({
            isShow: paramsData.isShow,
            color: basic[i].color,
            posName: basic[i].macName + '-' + basic[i].name,
            time: basic[i].time,
            key: basic[i].key,
            // key: basic[i].key,
          })
        }
      }
      this.dataList = dataList
      paramsData.showData = true
    },
    // 设置class
    setClass(bool) {
      return bool
        ? 'iconfont icon-zhongzi_xuanzekuang1'
        : 'iconfont icon-zhongzi_xuanzekuang'
    },
    // 点击数据列表操作按钮
    operateData(index, idx) {
      const dataList = cloneObj(this.dataList, true)
      const length = dataList.length
      const currentList = dataList[index]
      switch (idx) {
        case 0 /* 下移 */:
          if (index >= length - 1) return
          const nextIndex = index + 1
          const nextList = dataList[nextIndex]
          dataList[nextIndex] = currentList
          dataList[index] = nextList
          break
        case 1 /* 上移 */:
          if (index < 1) return
          const lastIndex = index - 1
          const lastList = dataList[lastIndex]
          dataList[lastIndex] = currentList
          dataList[index] = lastList
          break
        case 2 /* 删除 */:
          this.delKey.push(currentList.key)
          dataList.splice(index, 1)
          break
      }
      this.dataList = dataList
    },
    // 打开基本信息
    dataMsg() {
      const params = this.paramsData[this.currentKey]
      params.showBasic = true
    },
    // 关闭弹窗
    closeBox(key, type) {
      const params = this.paramsData[this.currentKey]
      key === 'basic' && (params.showBasic = false)
      if (key === 'datalist') {
        params.showData = false
        //确认按钮
        if (type === 1) {
          const dataList = this.dataList
          const chart = this.chartData[this.currentKey]
          const keyArr = Object.keys(chart)
          const newBasic = []
          const newChart = {}
          const l = dataList.length
          for (let i = 0; i < l; i++) {
            const value = dataList[i]
            const index = value.key
            params[index].isShow = value.isShow
            params[index].color = value.color
            for (let j = 0, len = params.basicMsg.length; j < len; j++) {
              const val = params.basicMsg[j]
              if (val.key === index) {
                val.color = value.color
                newBasic.push(cloneObj(val, true))
                break
              }
            }
            for (const k in chart) {
              if (k === index) {
                newChart[k] = cloneObj(chart[k], true)
                break
              }
            }
            keyArr.splice(keyArr.indexOf(value.key), 1)
          }
          // for (const value of keyArr) {
          //   this.$delete(params, value)
          // }
          this.chartData[this.currentKey] = cloneObj(newChart, true)
          params.basicMsg = cloneObj(newBasic, true)
          for (let i = 0, l = this.delKey.length; i < l; i++) {
            this.$store.commit('delCompare', this.delKey[i])
            delete params[this.delKey[i]]
          }
          this.setOption()
        }
        //关闭所有波形
        if (type === 2) {
          this.delKey = []
          this.dataList.forEach((element) => {
            this.delKey.push(element.key)
          })
          this.dataList = []
          this.chartData[this.currentKey] = {}
          for (let i = 0, l = this.delKey.length; i < l; i++) {
            this.$store.commit('delCompare', this.delKey[i])
            params.basicMsg = []
            delete params[this.delKey[i]]
          }
          this.setOption()
        }
        this.delKey.length = 0
      }
    },
    // 数据列表修改颜色
    setColor(item, e) {
      const size = e.currentTarget.getBoundingClientRect()
      this.$color({
        pattern: {
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
        color: item.color,
      }).then((res) => {
        item.color = res
      })
    },
    // 基本信息修改颜色
    changeColor(index, e) {
      const params = this.paramsData[this.currentKey]
      const chart = this.chartData[this.currentKey]
      const keyArr = Object.keys(chart)
      const color = params.basicMsg[index].color
      const size = e.currentTarget.getBoundingClientRect()
      this.$color({
        pattern: {
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
        color,
      }).then((res) => {
        params.basicMsg[index].color = res
        params[keyArr[index]].color = res
        this.setOption()
      })
    },
    /*
         拖动弹窗
         type    Number    0: 鼠标按下, 1: 鼠标松开
         key     Number    0: 数据列表, 1: 基本信息
         e       Object    事件对象
       */
    dragElem(type, key, e) {
      const tag = e.target
      if (hasClass(tag, 'icon-cuohao') || hasClass(tag, 'close-box')) return
      if (type === 1) {
        const ref = ['dataListBox', 'basicBox']
        this.offset = {
          x: e.offsetX,
          y: e.offsetY,
          ref: ref[key],
        }
        window.addEventListener('mousemove', this.dropElem)
      } else {
        window.removeEventListener('mousemove', this.dropElem)
      }
    },
    // 拖放弹窗
    dropElem(e) {
      const offset = this.offset
      const el = this.$refs[offset.ref][this.currentIndex]
      el.style.left = `${e.x - offset.x}px`
      el.style.top = `${e.y - offset.y}px`
    },
    // 设置class
    setbaseClass(bool) {
      return bool ? 'basic-tr1' : ''
    },
    // 显示峰值峰峰值
    getValue(value) {
      return value >= 100000000 ? '—' : value
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'compare',
    })
  },
}
</script>
<style scoped lang="scss">
.my-compare-chart {
  position: relative;
  .compare-chart {
    height: calc(100% - 50px);
    grid-template-columns: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: 50% 50%;
    grid-row-gap: 2px;
    .chart-box {
      position: relative;
      .chart-title {
        position: absolute;
        left: 100px;
        font-size: 18px;
        padding: 0;
        margin: 15px 0 0;
        font-weight: bold;
      }
      .my-chart {
        height: 100%;
        width: 100%;
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
    }
    .data-list-box {
      width: 530px;
      height: 250px;
      position: absolute;
      .data-list-title {
        height: 30px;
        line-height: 30px;
        position: relative;
        padding: 0 10px;
        font-size: 14px;
        span {
          position: absolute;
          font-size: 10px;
          height: 30px;
          line-height: 30px;
          width: 30px;
          right: 0;
        }
      }
      .data-list-table {
        width: 506px;
        height: 164px;
        margin: 0 auto;
        font-size: 12px;
        overflow: hidden;
        .data-list-thead,
        .data-list-tr {
          display: grid;
          grid-template-columns: 40px 40px 160px 160px 106px;
          text-align: center;
          align-items: center;
          height: 20px;
          line-height: 20px;
        }
        .data-list-tbody {
          overflow-x: hidden;
          overflow-y: auto;
          height: 140px;
          margin-right: -20px;
          .data-list-tr {
            .operate-icon {
              .iconfont {
                cursor: pointer;
                display: inline-block;
                height: 20px;
                width: 20px;
              }
              .icon-up3 {
                margin-right: 5px;
              }
              .icon-cuohao {
                margin-left: 5px;
              }
            }
          }
        }
      }
      .data-list-btn {
        height: 40px;
        line-height: 40px;
        text-align: center;
        button {
          height: 26px;
          line-height: 26px;
          width: 70px;
          &:first-child {
            margin-right: 10px;
          }
          &:nth-child(2) {
            margin-right: 10px;
          }
        }
      }
    }
    .basic-msg {
      // position: absolute;
      height: 218px;
      width: 900px;
      position: fixed;
      top: calc(50% - 109px);
      left: calc(50% - 430px);
      .basic-title {
        position: relative;
        padding: 0 10px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        span {
          position: absolute;
          height: 30px;
          line-height: 30px;
          width: 30px;
          text-align: center;
          right: 4px;
          .iconfont {
            font-size: 12px;
          }
        }
      }
      .basic-table {
        height: 164px;
        width: 880px;
        margin: 0 auto;
        font-size: 12px;
        overflow: hidden;
        .basic-thead,
        .basic-tr {
          height: 20px;
          text-align: center;
          display: grid;
          grid-template-columns: 40px 40px 200px 160px repeat(5, 79.6px);
          align-items: center;
        }
        .basic-tr1 {
          height: 20px;
          text-align: center;
          display: grid;
          grid-template-columns: 30px 30px 160px 120px repeat(8, 67.25px);
          align-items: center;
        }
        .basic-tbody {
          height: 144px;
          overflow-x: hidden;
          overflow-y: auto;
        }
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
      &:first-child {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
    }
  }
}
</style>
