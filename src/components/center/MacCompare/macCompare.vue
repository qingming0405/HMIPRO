<!-- 对比分析图 -->
<template>
  <div class="my-compare-chart radius box-shadow">
    <div
      ref="macCompareChart"
      class="macCompare-chart compare-chart macCompare-chart-nomal"
      v-for="(params, key) in paramsData"
      :key="key"
      v-show="params.isShow"
      @drop="addPos"
      @dragover.prevent
      @keydown="keydownEvent"
      @keyup="keyupEvent"
    >
      <div class='chart-base-title macCompare-chart-base-title'>
        <div v-if='params.basicMsg && params.basicMsg.length > 0'>
          <span v-if='params.basicMsg[0]&&params.basicMsg[0].pos'>{{params.basicMsg[0].pos.mac_name}}-机组对比分析图</span>
          <span v-show='params[params.basicMsg[0].key].time > 0'>{{params.basicMsg[0].time}}</span>
          <span
            v-if="params[params.basicMsg[0].key].speed < 100000000"
            v-show='params.basicMsg[0].pos.position_type != 14 && params.basicMsg[0].pos.dgm_type != 10'
          >rpm: {{params[params.basicMsg[0].key].speed}}</span>
          <span
            v-else
            v-show='params.basicMsg[0].pos.position_type != 14 && params.basicMsg[0].pos.dgm_type != 10'
          >rpm: 无数据</span>
        </div>
      </div>
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
      <div class='develop-chart-bg'>
        <div
          class='develop-chart radius default-border develop-macCompare'
          @click.stop='developChart'
        >{{params.developChart.icon}}</div>
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
      <!-- 趋势图 -->
      <div
        class="trend-compare-chart chart-box"
        ref="trendCompare"
      >
        <div
          ref="trendChart"
          class="my-chart"
          v-show="!trendData[key].empty.isShow"
        >
          <i
            class="iconfont"
            :class="icon.class"
            :title="icon.title"
            v-for="(icon, index) in trendIcon"
            :key="index"
          ></i>
        </div>
        <div
          class="none-data"
          v-show="trendData[key].empty.isShow"
        >
          <div>{{trendData[key].empty.text}}</div>
        </div>
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
                v-for="(item, index) in dataList[key]"
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
                <span>{{ item.flag==1? '锁定':'' }}</span>
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
      <!-- 故障频率 -->
      <div
        class='set-failure-bg pop-bg'
        v-show='params.failure.isShow'
      >
        <div
          class='set-failure radius box-shadow'
          ref='setFailure'
        >
          <div
            class='set-failure-title'
            @mousedown.stop='dragElem(1, "setFailure", $event)'
            @mouseup.stop='dragElem(0, "setFailure", $event)'
          >
            故障频率
            <span
              class='close-failure'
              @click.stop='closeFailure'
            >
              <i class='iconfont icon-cuohao'></i>
            </span>
          </div>
          <!-- 非叶片 -->
          <div
            v-show='!params.failure.impeller'
            class='none-impeller-failure'
          >
            <div class='set-failure-speed'>
              <span @click='setSpeed'>
                <i :class='setIcon(params.failure.isSetSpeed, 2)'></i>
                是否启用模拟转速
              </span>
              <span>
                基准转速：<input
                  class='radius'
                  type="text"
                  :disabled='!params.failure.isSetSpeed'
                  v-model='params.failure.analogSpeed'
                  @input=setAnalogSpeed
                >
              </span>
              <span></span>
            </div>
            <div class='set-failure-msg'>
              <ul
                class='failure-list radius'
                v-for='(failure, idx) in params.failureList'
                :key=idx
              >
                <li>
                  <div class='my-failure-list first-failure-list'>
                    <i
                      :class='setIcon(failure.isView, 1)'
                      @click.stop='showChildren(failure)'
                    >
                    </i>
                    <!-- 防止选择故障后直接重绘图谱 -->
                    <i
                      :class='setIcon(failure.status)'
                      @click.stop='chartData[currentKey][params.basicMsg[0].key].spectrum.isRefresh = false;checkFailure(failure, idx)'
                    >
                    </i>
                    <span class='text-overflow'>{{failure.name}}</span>
                  </div>
                  <ul
                    class='children-list'
                    v-if='failure.isView'
                  >
                    <li
                      v-for='(list, id) in failure.children'
                      :key=id
                    >
                      <div
                        class='my-failure-list'
                        :class='list.children && list.children.length ? "second-failure-list" : "failure-second-list"'
                      >
                        <i
                          :class='setIcon(list.isView, 1)'
                          @click.stop='showChildren(list)'
                          v-show='list.children && list.children.length > 0'
                        >
                        </i>
                        <i
                          :class='setIcon(list.status)'
                          @click.stop='chartData[currentKey][params.basicMsg[0].key].spectrum.isRefresh = false;checkFailure(list, idx, id)'
                        >
                        </i>
                        <span class='text-overflow'>{{list.name}}</span>
                      </div>
                      <div
                        v-show='list.status && list.viewVal'
                        class='my-failure-value1 text-overflow'
                      >
                        {{list.viewVal}}
                      </div>
                      <ul
                        class='children-list'
                        v-if='list.isView'
                      >
                        <li
                          v-for='(item, i) in list.children'
                          :key=i
                        >
                          <div class='my-failure-list third-failure-list'>
                            <i
                              :class='setIcon(item.status)'
                              @click.stop='chartData[currentKey][params.basicMsg[0].key].spectrum.isRefresh = false;checkFailure(item, idx, i)'
                            >
                            </i>
                            <span class='text-overflow'>{{item.name}}</span>
                          </div>
                          <div
                            v-show='item.status'
                            class='my-failure-value2 text-overflow'
                          >
                            {{item.viewVal}}
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <!-- 叶片 -->
          <div
            class='impeller-failure'
            v-show='params.failure.impeller'
          >
            <ul class='set-failure-freq'>
              <li
                v-for='(data, i) in params.failure.analogValue'
                :key=i
              >
                <label :for="'freq' + key + i">{{data.title}}</label>
                <input
                  type="number"
                  :id="'freq' + key + i"
                  v-model='data.value'
                  class='radius'
                >
                <i
                  @click='deleteFailure(i)'
                  class="iconfont icon-lajitong"
                ></i>
              </li>

            </ul>
            <ul class='impeller-operate-btn'>
              <li>
                <button @click.stop='addFailure'>添加频率</button>
              </li>
              <li>
                <button @click.stop='params.failure.isStartFailure = true;setMarkLine()'>标注频率</button>
              </li>
              <li>
                <button @click.stop='clearFailure'>清除标注</button>
              </li>
              <li>
                <button
                  class='disable-btn'
                  @click.stop='closeFailure'
                >关闭</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="search-data">
      <button @click="setDataList">数据列表</button>
      <button @click="dataMsg">基本信息</button>
      <button @click='openFailure'>故障频率</button>
      <button @click='dataRetrieval'>数据检索</button>
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
  name: 'macCompare',
  data() {
    return {
      chartData: {} /* 图谱信息 */,
      paramsData: {} /* 参数信息 */,
      trendData: {} /* 趋势图数据 */,
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
        markLine: {
          /* 标线 */
          line: '#fbc543' /* 标线 */,
          font: '#1800ff' /* 提示文字 */,
        },
        background: '#fff' /* 背景颜色 */,
      },
      dataListTitle: ['显示', '颜色', '名称', '时间', '状态', '操作'],
      dataList: {} /* 数据列表 */,
      isNewChart: true /* 是否为添加/删除图谱 */,
      currentKey: '' /* 当前显示图谱索引 */,
      currentIndex: 0 /* 当前显示第几个图谱 */,
      waveIcon: [
        /* 0 */ { class: 'icon-selectunit_huaban', title: '单位选择' },
        /* 1 */ {
          class: 'icon-MAX_huaban icon-MAX_huaban-Maccompare_wave',
          title: '选框放大',
        } /* {class: 'icon-exporemusic_huaban icon-exporemusic_huaban-Maccompare_wave', title: '音频导出'}, */ /* {class: 'icon-exportdata_huaban icon-exportdata_huaban-Maccompare_wave', title: '数据导出'}, */,
        /* 2 */ /* 3 */ /* 4 */ {
          class: 'icon-restore_huaban icon-restore_huaban-Maccompare_wave',
          title: '重置',
        },
        /* 5 */ {
          class: 'icon-enlarge_huaban icon-enlarge_huaban-Maccompare_wave',
          title: '选框放大',
        },
        /* {class: 'icon-savemage_huaban icon-savemage_huaban-Maccompare_wave', title: '保存为图片'}, */
        /* 8 */ {
          class: 'icon-subtime_huaban icon-subtime_huaban-Maccompare_wave',
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
          class: 'icon-MAX_huaban icon-MAX_huaban-Maccompare_spectrum',
          title: '选框放大',
          isCheck: false,
          parentClass: '',
        } /* {class: 'icon-exportdata_huaban icon-exportdata_huaban-Maccompare_spectrum', title: '数据导出'}, */,
        /* 2 */ /* 3 */ {
          class: 'icon-restore_huaban icon-restore_huaban-Maccompare_spectrum',
          title: '重置',
          isCheck: false,
          parentClass: '',
        },
        /* 4 */ {
          class: 'icon-enlarge_huaban icon-enlarge_huaban-Maccompare_spectrum',
          title: '选框放大',
          isCheck: false,
          parentClass: '',
        },
        /* 5 */ {
          class:
            'icon-savemage_huaban icon-savemage_huaban-Maccompare_spectrum',
          title: '保存为图片',
          isCheck: false,
          parentClass: '',
        },
        /* 6 */ {
          class: 'icon-pinputuduishuzuobiaoqiehuan_huaban',
          title: '对数坐标',
          isCheck: false,
          parentClass: '',
        } /* {class: 'chart-btn-active icon-xiaozhunbeipin_huaban icon-xiaozhunbeipin_huaban-Maccompare_spectrum', title: '校准倍频'}, */ /* {class: 'icon-xunhuanxunfeng_huaban_huaban icon-xunhuanxunfeng_huaban_huaban-Maccompare_spectrum', title: '循环寻峰'}, */ /* 8 */ /* 9 */,
        /* 7 */ {
          class:
            'icon-quxiaobiaozhu_huaban icon-quxiaobiaozhu_huaban-Maccompare_spectrum',
          title: '取消标注',
          isCheck: false,
          parentClass: '',
        },
        /* 10 */ {
          class: 'icon-biaozhu_huaban icon-biaozhu_huaban-Maccompare_spectrum',
          title: '添加标注',
          isCheck: false,
          parentClass: '',
        },
        /* 11 */
        {
          class:
            'icon-biaozhubeipin_huaban icon-biaozhubeipin_huaban-Maccompare_spectrum',
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
        } /* {class: 'icon-dingweidaobeipin_huaban icon-dingweidaobeipin_huaban-Maccompare_spectrum', title: '定位到1倍频'}, */ /* {class: 'icon-qiehuanXzhoujiebi_huaban', title: '切换阶比'}, */,
        /* 14 */ /* 15 */ /* 16 */ {
          class: 'chart-btn-active icon-hanningchuang_huaban',
          title: '汉宁窗',
          isCheck: false,
          parentClass: '',
        },
        /* 17 */ {
          class:
            'icon-duichengpinshuaicha_huaban icon-duichengpinshuaicha_huaban-Maccompare_spectrum',
          title: '对称频率差',
          isCheck: false,
          parentClass: '',
        },
      ],
      trendIcon: [
        {
          class: 'icon-restore_huaban icon-restore_huaban-compare_trend',
          title: '重置',
          isCheck: false,
          parentClass: '',
        },
        {
          class: 'icon-enlarge_huaban icon-enlarge_huaban-compare_trend',
          title: '选框放大',
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
    '$store.state.macCompareMsg': {
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
          this.trendData[this.currentKey].trendChart.resize()
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
      // const isMMS2 = bothConfig.mms2.indexOf(t_id.toString()) !== -1
      const isMMS2 = false
      switch (type) {
        case 0 /* 打开图表 */:
          const pos = this.$store.state.checkMsg.pos
          this.currentIndex = keyArr.length
          let data = {}
          const chart = {}
          const failure = {
            name: '频率',
            speedName: '频',
          }
          const failureHead = ['标识', '名称', '频率(Hz)', '幅值']
          let params = {
            isShow: true,
            isCtrlkeydown: false /* 是否按下ctrl */,
            waveChart: null,
            spectrumChart: null,
            isHanning: true,
            waveMax: false,
            spectrumMax: false,
            isLog: false /* 对数坐标 */,
            isSetPower: false,
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
            pos,
            isRequestDown: true,
            developChart: {
              chart: 'wave',
              wave: true,
              spectrum: true,
              icon: '+',
            },
            failureList: {
              gear: {
                id: 0,
                name: `啮合${failure.name}`,
                isView: true,
                status: false,
                children: [],
              },
              bear: {
                id: 1,
                name: `轴承通过${failure.name}`,
                isView: true,
                status: false,
                children: [],
              },
              speed: {
                id: 2,
                name: `转${failure.speedName}`,
                isView: true,
                status: false,
                children: [],
              },
            },
            failure: {
              /* 故障频率窗口信息 */
              name: failure.name /* 故障频率传动链名字尾缀，阶次测点显示“阶次”，其他测点显示“频率” */,
              speedName:
                failure.speedName /* 故障频率传动链转速名字尾缀，阶次测点显示“动阶次”，其他测点显示“频” */,
              clickNum: 0 /* 点击次数 */,
              isShow: false /* 故障频率显隐 */,
              impeller: pos.dgm_type == 2 /* 是否为叶轮 */,
              analogSpeed: 0 /* 模拟转速 */,
              analogValue: [
                /* 通过频率 */
                { title: '通过频率1', value: 1, name: 'BPF.1' },
                // { title: '通过频率2', value: 1, name: 'BPF.2' },
                // { title: '通过频率3', value: 1, name: 'BPF.3' },
                // { title: '通过频率4', value: 1, name: 'BPF.4' },
                // { title: '通过频率5', value: 1, name: 'BPF.5' },
                // { title: '通过频率6', value: 1, name: 'BPF.6' },
              ],
              isStartFailure: false, //是否标注叶片故障频率
              list: {
                /* 故障频率明细 */
                head: failureHead /* 表头 */,
                body: [] /* 内容 */,
              },
              isSetSpeed: false /* 是否启用模拟转速 */,
            },
          }
          const viewType = [3, 6, 8]
          let isViewRms = false
          let i = 0
          params.isViewRms = isViewRms
          this.$set(this.chartData, key, chart)
          this.$set(this.paramsData, key, params)
          // 趋势图数据
          this.$set(this.trendData, key, {
            key: '' /* 机组id_测点id_测点type */,
            pos: {},
            chartData: {
              curUnitY: '',
              curX: [],
              curY: [],
              srcUnitY: '',
              srcX: [],
              srcY: [],
            },
            trendChart: null,
            isMMS2: isMMS2 /* 趋势图单位是否要处理为mm/s² */,
            color: this.color,
            empty: {
              isShow: false,
              text: `趋势图无数据`,
            },
          })
          this.getTrendData()
          // 获取故障频率
          this.getFailureFrequency()
          const state = this.$store.state
          const currentTime = state.currentTime
          let info = {
            pos,
            time: currentTime,
            flag: 0 /* 0:点击加入；1:锁定点（ctrl+点击加入） */,
            index: -1 /*basicMsg下标，-1时增加，非-1时更新该下标的内容*/,
          }
          this.getWaveData(info)
          this.$nextTick(() => {
            this.setOption()
          })
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          this.$nextTick(() => {
            this.paramsData[key].waveChart &&
              this.paramsData[key].waveChart.resize()
            this.paramsData[key].spectrumChart &&
              this.paramsData[key].spectrumChart.resize()
            this.trendData[key].trendChart &&
              this.trendData[key].trendChart.resize()
          })
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.dataList, key)
          this.paramsData[key].waveChart.destory()
          this.paramsData[key].waveChart = null
          this.paramsData[key].spectrumChart.destory()
          this.paramsData[key].spectrumChart = null
          this.trendData[key].trendChart.destory()
          this.trendData[key].trendChart = null
          this.$delete(this.trendData, key)
          this.$delete(this.paramsData, key)
          this.$delete(this.chartData, key)
          break
      }
    },
    // 计算故障频率
    getItem(item) {
      const curKey = this.currentKey
      const [, , macId, posId, posType] = curKey.split('_')
      const params = this.paramsData[curKey]
      const failureList = params.failureList
      const chartType = params.basicMsg[0].chartType
      let unit = 'Hz'
      if (chartType === 2) {
        unit = 'NX'
      }
      let freq = (item.value * item.speedRate * params.failure.analogSpeed) / 60
      if (chartType === 2) {
        let speedRate = 1
        if (isVibOfPos(posType)) {
          speedRate = params.pos.speedRate
        }
        freq = (Number(item.value) * item.speedRate) / speedRate
      }
      return {
        str: `(${item.type}.${item.count})${freq.toFixed(2)}${unit}`,
        num: freq,
      }
    },
    // 展开、收起子项
    showChildren(item) {
      item.isView = !item.isView
      this.$forceUpdate()
    },
    // 选中故障频率
    checkFailure(item, key, index) {
      const params = this.paramsData[this.currentKey]
      // params.isNewChart.spectrum = true
      const status = !item.status
      item.status = status
      let children1 = item.children
      const parent1 = item.parent
      // 故障频率勾选
      if (children1 && children1.length > 0) {
        for (let i = 0, l = children1.length; i < l; i++) {
          const value = children1[i]
          value.status = status
          if (value.children && value.children.length > 0) {
            for (let j = 0, len = value.children.length; j < len; j++) {
              value.children[j].status = status
            }
          }
        }
      }
      if (parent1) {
        children1 = parent1.children
        let isTrue = 0
        for (let i = 0, l = children1.length; i < l; i++) {
          const value = children1[i]
          if (value.status) isTrue++
          parent1.status = isTrue === l
        }
        const parent2 = parent1.parent
        if (parent2) {
          children1 = parent2.children
          isTrue = 0
          for (let i = 0, l = children1.length; i < l; i++) {
            const value = children1[i]
            if (value.status) isTrue++
            parent2.status = isTrue === l
          }
        }
      }
      const arr = []
      // 非叶片勾选计数
      children1 = params.failureList[key].children
      let count1 = 0
      let count2 = 0
      for (let i = 0, l = children1.length; i < l; i++) {
        const val = children1[i]
        const children2 = val.children
        if (children2 && children2.length > 0) {
          for (let j = 0, len = children2.length; j < len; j++) {
            const value = children2[j]
            if (value.status) {
              count1++
              value.count = count1
              const msg = this.getItem(value)
              value.viewVal = msg.str
              value.val = msg.num
            }
          }
        } else {
          if (val.status) {
            count2++
            val.count = count2
            const msg = this.getItem(val)
            val.viewVal = msg.str
            val.val = msg.num
          }
        }
      }
      // this.$forceUpdate();
      this.$nextTick(() => {
        this.setMarkLine()
      })
    },
    // 设置图标
    setIcon(bool, type = 0) {
      const iconArr = [
        ['icon-zhongzi_xuanzekuang', 'icon-zhongzi_xuanzekuang1'],
        ['icon-zhankai_huaban', 'icon-shouqi_huaban'],
        [
          'icon-danxuankuang-weixuanzhong_huaban',
          'icon-danxuankuang-yixuanzhong_huaban',
        ],
      ]
      return `iconfont ${iconArr[type][Number(bool)]}`
    },
    // 是否启用模拟转速
    setSpeed() {
      const failure = this.paramsData[this.currentKey].failure
      failure.isSetSpeed = !failure.isSetSpeed
      this.$forceUpdate()
    },
    // 获取故障频率数据
    getFailureFrequency() {
      let pos
      const param = this.paramsData[this.currentKey]
      if (param.basicMsg && param.basicMsg.length > 0) {
        pos = param.basicMsg[0].pos
      } else {
        pos = param.pos
      }
      const data = {
        machineId: pos.machine_id,
      }
      this.$getApi.getFailureFrequency(data).then((res) => {
        if (res && res.driveChain.itemList) {
          this.setFailureFrequency(res)
        }
      })
    },
    // 构造故障频率结构树
    setFailureFrequency(data) {
      const list = data.driveChain.itemList
      const pd = this.paramsData[this.currentKey]
      const gear = pd.failureList.gear
      const bear = pd.failureList.bear
      const speed = pd.failureList.speed
      const gearType = ['5', '6', '9', '10']
      let index = 0
      for (let i = 0, l = list.length; i < l; i++) {
        const parts = list[i]
        const type = parts.itemtype
        const base = parts.baseInfo
        const fix = Number(base.fix_teeth_num)
        const plant = Number(base.plant_teeth_num)
        // planet_num取不到时，风电默认为3，水泥默认为4
        if (!base.planet_num) {
          if (this.paramsData[this.currentKey].pos.t_root == 0) {
            base.planet_num = 3
          } else if (this.paramsData[this.currentKey].pos.t_root == 1) {
            base.planet_num = 4
          }
        }
        const plantNum = Number(base.planet_num)
        const sun = Number(base.sun_teeth_num)
        const bearMsg = [
          {
            value: Number(base.bpfo),
            name: `外环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 0,
            type: 'BPFO',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bpfi),
            name: `内环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 1,
            type: 'BPFI',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bsf),
            name: `滚动体通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 2,
            type: 'BSF',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bsf),
            name: `2倍滚动体通过${pd.failure.name}`,
            speedRate: 2 * Number(parts.speedRate),
            id: 3,
            type: 'BSF',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.ftf),
            name: `保持架通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 4,
            type: 'FTF',
            status: false,
            count: 0,
            val: '',
          },
        ]
        const befoBear = [
          {
            value: Number(base.bpfo1),
            name: `外环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 0,
            type: 'BPFO',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bpfi1),
            name: `内环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 1,
            type: 'BPFI',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bsf1),
            name: `滚动体通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 2,
            type: 'BSF',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bsf1),
            name: `2倍滚动体通过${pd.failure.name}`,
            speedRate: 2 * Number(parts.speedRate),
            id: 3,
            type: 'BSF',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.ftf1),
            name: `保持架通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 4,
            type: 'FTF',
            status: false,
            count: 0,
            val: '',
          },
        ]
        const afterBear = [
          {
            value: Number(base.bpfo2),
            name: `外环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 0,
            type: 'BPFO',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bpfi2),
            name: `内环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 1,
            type: 'BPFI',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bsf2),
            name: `滚动体通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 2,
            type: 'BSF',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.bsf2),
            name: `2倍滚动体通过${pd.failure.name}`,
            speedRate: 2 * Number(parts.speedRate),
            id: 3,
            type: 'BSF',
            status: false,
            count: 0,
            val: '',
          },
          {
            value: Number(base.ftf2),
            name: `保持架通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 4,
            type: 'FTF',
            status: false,
            count: 0,
            val: '',
          },
        ]
        let obj = null
        if (gearType.includes(type)) {
          /* 啮合频率 */
          obj = {
            name: parts.name,
            isView: false,
            speedRate: Number(parts.speedRate),
            children: [],
            status: false,
            parent: gear,
          }
          const children = obj.children
          const gearType2 = ['6', '9', '10']
          if (type === '5') {
            let isHas = false
            for (let j = 0, len = gear.children.length; j < len; j++) {
              const value = gear.children[j]
              if (
                type === '5' &&
                (parts.up === value.id || parts.down === value.id)
              ) {
                value.name = `${value.name}/${obj.name}`
                isHas = true
                break
              }
            }
            if (!isHas) {
              obj.id = parts.id
              children.push({
                value: base.gear_teeth_num,
                speedRate: obj.speedRate,
                name: `啮合${pd.failure.name}`,
                type: 'GMF',
                status: false,
                count: 0,
                parent: obj,
              })
            } else {
              continue
            }
          } else if (type === '6' || type === '9') {
            obj.id = parts.id
            children.push(
              {
                value: fix,
                status: false,
                speedRate: obj.speedRate,
                name: `啮合${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                // value: fix / sun * plantNum,
                value: (fix / sun) * 3,
                status: false,
                speedRate: obj.speedRate,
                name: `太阳轮缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                value: fix / plant,
                status: false,
                speedRate: obj.speedRate,
                name: `行星轮缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                value: (2 * fix) / plant,
                status: false,
                speedRate: obj.speedRate,
                name: `2倍行星轮缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                value: plantNum,
                status: false,
                speedRate: obj.speedRate,
                name: `齿圈缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              }
            )
          } else if (type === '10') {
            let speedRate = 0
            for (let j = 0; j < l; j++) {
              const parts2 = list[j]
              const type2 = parts2.itemtype
              if (gearType2.includes(type2) && parts.left2 === parts2.id) {
                speedRate = Number(parts2.speedRate)
                break
              }
            }
            obj.id = parts.id
            children.push(
              {
                value: fix,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `啮合${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                value: (fix / sun) * plantNum,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `太阳轮缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                value: fix / plant,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `行星轮缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                value: (2 * fix) / plant,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `2倍行星轮缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              },
              {
                value: plantNum,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `齿圈缺陷${pd.failure.name}`,
                type: 'GMF',
                count: 0,
                parent: obj,
              }
            )
          }
          gear.children.push(obj)
          // 轴承通过频率
          // 齿轮
          if (type !== '5') {
            let sr = 0
            if (type === '10') {
              let speedRate = 0
              for (let j = 0; j < l; j++) {
                const parts2 = list[j]
                const type2 = parts2.itemtype
                if (gearType2.includes(type2) && parts.left2 === parts2.id) {
                  speedRate = Number(parts2.speedRate)
                  break
                }
              }
              sr = Math.abs(obj.speedRate - speedRate) * (fix / plant)
            } else {
              sr = (obj.speedRate * fix) / plant
            }
            obj = {
              name: parts.name,
              isView: false,
              speedRate: sr,
              children: [],
              status: false,
              parent: bear,
            }
            const bm = cloneObj(bearMsg, true)
            bm.map((value) => {
              value.parent = obj
            })
            obj.children = bm
            bear.children.push(obj)
          }
        } else if (type === '7') {
          /* 轴承通过频率 */
          const bearObj = cloneObj(bearMsg, true)
          bearObj.map((value) => {
            value.parent = obj
          })
          obj = {
            name: parts.name,
            isView: false,
            speedRate: Number(parts.speedRate),
            children: bearObj,
            status: false,
            parent: bear,
          }
          bear.children.push(obj)
        } else if (type === '8') {
          /* 发电机前、后轴承 */
          const bearObj1 = cloneObj(befoBear, true)
          bearObj1.parent = bear
          const bearObj2 = cloneObj(afterBear, true)
          bearObj2.parent = bear
          bear.children.push(
            {
              name: `${parts.name}前轴承`,
              isView: false,
              status: false,
              speedRate: Number(parts.speedRate),
              children: bearObj1,
              parent: bear,
            },
            {
              name: `${parts.name}后轴承`,
              isView: false,
              status: false,
              speedRate: Number(parts.speedRate),
              children: bearObj2,
              parent: bear,
            }
          )
        } else if (type === '2') {
          /* 转频 */
          obj = {
            type: parts.itemtype,
            name: `${parts.name}转${pd.failure.speedName}`,
            isView: false,
            status: false,
            speedRate: Number(parts.speedRate),
            type: 'F',
            count: 0,
            value: 1,
            parent: speed,
          }
          speed.children.push(obj)
        } else if (type === '1' && pd.failure.impeller) {
          /* 叶轮 */
          index++
          obj = {
            name: `BPF.${index}`,
            value: Number(parts.speedRate) * Number(parts.baseInfo.compNum),
            title: `通过频率${index}`,
          }
          pd.failure.analogValue[index - 1] = obj
        }
      }
    },
    // 打开故障频率
    openFailure() {
      const params = this.paramsData[this.currentKey]
      const failure = params.failure
      !failure.isSetSpeed && (failure.analogSpeed = params.basicMsg[0].speed)
      this.setAnalogSpeed()
      failure.isShow = true
    },
    // 关闭故障频率
    closeFailure() {
      this.paramsData[this.currentKey].failure.isShow = false
    },
    // 故障频率画线数据
    setMarkLine() {
      const currentKey = this.currentKey
      const params = this.paramsData[currentKey]
      const spectrum =
        this.chartData[currentKey][params.basicMsg[0].key].spectrum
      const maxFreq = spectrum.srcX[spectrum.srcX.length - 1]
      const failure = params.failure
      const failureList = params.failureList
      const arr = []
      let body = []
      if (!failure.impeller) {
        // 非叶片
        for (const key in failureList) {
          const children1 = failureList[key].children
          for (let i = 0, l = children1.length; i < l; i++) {
            const value1 = children1[i]
            if (value1.viewVal && value1.status && value1.val <= maxFreq) {
              const flag = `${value1.type}.${value1.count}`
              body.push({
                flag,
                name: value1.name,
                freq: round(value1.val, 4),
                amplitude: round(
                  spectrum.srcY[
                    this.getIndex(value1.val, params.basicMsg[0].key)
                  ],
                  4
                ),
              })
              arr.push({
                name: flag,
                xAxis: this.getIndex(value1.val, params.basicMsg[0].key),
              })
            } else {
              const children2 = value1.children
              if (children2) {
                for (let j = 0, len = children2.length; j < len; j++) {
                  const value2 = children2[j]
                  if (
                    value2.viewVal &&
                    value2.status &&
                    value2.val <= maxFreq
                  ) {
                    const flag = `${value2.type}.${value2.count}`
                    body.push({
                      flag,
                      name: `${value1.name}/${value2.name}`,
                      freq: round(value2.val, 4),
                      amplitude: round(
                        spectrum.srcY[
                          this.getIndex(value2.val, params.basicMsg[0].key, 2)
                        ],
                        4
                      ),
                    })
                    arr.push({
                      name: flag,
                      xAxis: this.getIndex(
                        value2.val,
                        params.basicMsg[0].key,
                        2
                      ),
                    })
                  }
                }
              }
            }
          }
        }
      } else {
        if (failure.isStartFailure) {
          // 叶片
          const freq = failure.analogValue
          freq.map((value) => {
            if (value.value <= maxFreq) {
              body.push({
                flag: value.name,
                name: value.title,
                freq: round(value.value, 4),
                amplitude: round(
                  spectrum.srcY[
                    this.getIndex(value.value, params.basicMsg[0].key, 2)
                  ],
                  4
                ),
              })
              arr.push({
                name: value.name,
                xAxis: this.getIndex(value.value, params.basicMsg[0].key, 2),
              })
            }
          })
        }
      }
      params.failure.list.body = body
      const xAxis = []
      const markLine = []
      for (let i = 0, l = arr.length; i < l; i++) {
        const value = arr[i]
        const m = xAxis.indexOf(value.xAxis)
        let nameStr = ''
        if (m === -1) {
          markLine.push({
            name: value.name,
            xAxis: value.xAxis,
          })
          xAxis.push(value.xAxis)
        } else {
          markLine[m].name += `/${value.name}`
        }
      }
      // if (markLine.length != 0) {
      let flag = true
      if (spectrum.markLine.length == markLine.length) {
        flag = false
        let len = spectrum.markLine.length
        for (let i = 0; i < len; i++) {
          // 对比xAxis是否一致是为了防止转速变化后值发生了变化
          if (
            spectrum.markLine[i].name != markLine[i].name ||
            spectrum.markLine[i].xAxis != markLine[i].xAxis
          ) {
            flag = true
          }
        }
      }
      if (flag) {
        console.log('修改markLine')
        spectrum.markLine = markLine
        this.setSpectrum()
      }
      // }
    },
    // 叶片故障频率添加频率
    addFailure() {
      const params = this.paramsData[this.currentKey]
      const failure = params.failure
      const freq = failure.analogValue
      freq.push({
        title: `通过频率${freq.length + 1}`,
        value: 1,
        name: `BPF.${freq.length + 1}`,
      })
    },
    // 删除单个叶轮故障频率
    deleteFailure(i) {
      const params = this.paramsData[this.currentKey]
      const failure = params.failure
      const freq = failure.analogValue
      freq.splice(i, 1)
      freq.forEach((item, idx) => {
        item.title = `通过频率${idx + 1}`
        item.name = `BPF.${idx + 1}`
      })
    },
    // 清除叶轮故障频率数据
    clearFailure() {
      const currentKey = this.currentKey
      const param = this.paramsData[currentKey]
      param.failure.list.body = []
      param.failure.isStartFailure = false
      this.chartData[currentKey][param.basicMsg[0].key].spectrum.markLine = []
      this.setSpectrum()
    },
    // 自定义转速
    setAnalogSpeed() {
      const failureList = this.paramsData[this.currentKey].failureList
      for (const key in failureList) {
        const failure = failureList[key].children
        for (let i = 0, l = failure.length; i < l; i++) {
          const value1 = failure[i]
          const children1 = value1.children
          if (children1 && children1.length > 0) {
            for (let j = 0, len = children1.length; j < len; j++) {
              const value2 = children1[j]
              const children2 = value2.children
              if (children2 && children2.length > 0) {
                for (let m = 0, n = children2.length; m < n; m++) {
                  const value3 = children2[m]
                  if (value3.status) {
                    const msg = this.getItem(value3)
                    value3.viewVal = msg.str
                    value3.val = msg.num
                  }
                }
              } else {
                if (value2.status) {
                  const msg = this.getItem(value2)
                  value2.viewVal = msg.str
                  value2.val = msg.num
                }
                // break;
              }
            }
          } else {
            if (value1.status) {
              const msg = this.getItem(value1)
              value1.viewVal = msg.str
              value1.val = msg.num
            }
          }
        }
      }
      this.setMarkLine()
    },
    /* info{
      pos,
      time: currentTime,
      flag: 0 //0:点击加入；1:锁定点（ctrl+点击加入） 
      index: -1,//basicMsg下标，-1时增加，非-1时更新该下标的内容
    }*/
    getWaveData(data) {
      const time = data.time
      const pos = data.pos
      let mId = pos.machine_id,
        pId = pos.position_id,
        pType = pos.position_type
      const currentKey = this.currentKey
      const chart = this.chartData[currentKey]
      const params = this.paramsData[currentKey]
      const keyArr = Object.keys(params)
      const isReal = Number(time === 0)
      const isSpeed = Number(pType === '1')
      if (params.isRequestDown) {
        params.isRequestDown = false
        this.$emit('loadingImg', true)
        this.$getApi
          .getWaveformAndSpectrum({
            machineId: mId,
            positionId: pId,
            positionType: pType,
            isFFT: true,
            isWave: true,
            isReal,
            currTime: [time],
            type: isSpeed,
          })
          .then((res) => {
            params.isRequestDown = true
            console.log('开始请求波形数据')
            if (res) {
              const info = res.info
              if (info && info.length > 0 && info[0] && info[0].waveObject) {
                const time = info[0].value.saveTime_Com
                for (let i = 0, len = params.basicMsg.length; i < len; i++) {
                  if (
                    params.basicMsg[i].pos.machine_id == mId &&
                    params.basicMsg[i].pos.position_id == pId &&
                    params.basicMsg[i].pos.position_type == pType
                  ) {
                  }
                }
                let chartType = 1
                const defaultCode = getdefaultCode(pos.dgm_type)
                const code = defaultCode[pType]
                const unit = {
                  wave: 's',
                  y: getUnit(code.code, pos),
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
                if (data.index == 0) {
                  !params.failure.isSetSpeed &&
                    (params.failure.analogSpeed = obj.speed)
                  this.setAnalogSpeed()
                }
                const pd = {
                  chartType,
                  color:
                    data.index == -1
                      ? this.colorList[keyTimes % 15]
                      : params.basicMsg[data.index].color,
                  isShow: true,
                  oneFreq: obj.speed === 0 ? 0.908 / 60 : obj.speed / 60,
                  freq: obj.freq,
                  posName: pos.position_name,
                  macName:
                    pos.t_root == 1 || pos.t_root == 2
                      ? mac.pump_name
                      : pos.mac_name,
                  rms: info[0].value[code.filed],
                  samples: obj.samples,
                  spectral: 0,
                  speed: obj.speed,
                  time,
                }
                !params.isViewRms &&
                  ['3', '6', '8'].includes(pType) &&
                  (params.isViewRms = true)
                let flag
                if (data.flag == 0) {
                  flag = `wave_pos_${pos.posFlag}_${data.flag}`
                } else {
                  flag = `wave_pos_${pos.posFlag}_${pd.time}`
                }
                // const flag = `wave_pos_${pos.posFlag}_${pd.time}`
                const waveX = []
                const waveY = obj.wave
                let i = 0
                let l = waveY.length
                const addNum = l / obj.freq / l
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
                            ((outX[i] * 60) /
                              Number(info[0].value.speed_value)) *
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
                if (chart[flag]) {
                  chart[flag].wave = {
                    srcX: waveX,
                    curX: waveX,
                    curUnitX: unit.wave,
                    srcY: waveY,
                    curY: waveY,
                    srcUnitY: unit.y,
                    curUnitY: unit.y,
                  }
                  chart[flag].spectrum.srcX = fftX
                  chart[flag].spectrum.curX = fftX
                  chart[flag].spectrum.ratio = ratio
                  chart[flag].spectrum.curUnitX = unit.spectrum
                  chart[flag].spectrum.srcY = fftY
                  chart[flag].spectrum.curY = hanning
                  chart[flag].spectrum.hanning = hanning
                  chart[flag].spectrum.srcUnitY = unit.y
                  chart[flag].spectrum.curUnitY = unit.y
                } else {
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
                      markLine: [],
                      isRefresh: true,
                    },
                  }
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
                if (data.index == -1) {
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
                    pos: pos,
                    flag: data.flag /* 0:点击加入；1:锁定点（ctrl+点击加入） */,
                    chartType /* 是否为阶次 */,
                  })
                  const trend = this.trendData[this.currentKey]
                  // 判断是否需要重画趋势图
                  if (
                    !trend.pos ||
                    trend.pos.position_id !=
                      params.basicMsg[0].pos.position_id ||
                    trend.pos.position_type !=
                      params.basicMsg[0].pos.position_type
                  ) {
                    this.getTrendData()
                  }
                } else {
                  let color = params.basicMsg[Number(data.index)].color
                  params.basicMsg[Number(data.index)] = {
                    color: color,
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
                    pos: pos,
                    flag: data.flag /* 0:点击加入；1:锁定点（ctrl+点击加入） */,
                    chartType /* 是否为阶次 */,
                  }
                }
                // 判断是否需要更换趋势
                const trend = this.trendData[this.currentKey]
                if (data.index != -1 && params[flag]) {
                  pd.isShow = params[flag].isShow
                }
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
                    markLine: [],
                    isRefresh: true,
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
                  flag: 0 /* 0: 拖入测点，1：通过波形加入对比波形*/,
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
                if (
                  Number(params.freq.lowerLimit) != 0 ||
                  Number(params.freq.upperLimit) != 0 ||
                  Number(params.freq.lowerLimit) != 0 ||
                  params.isLog
                ) {
                  for (const k in chart) {
                    let data = chart[k].spectrum
                    if (data.curUnitY === data.srcUnitY) {
                      this.getFreq(k)
                    } else {
                      //若当前单位切换过，getFreq处理数据时取curY
                      this.getFreq(k, 1)
                    }
                  }
                }
                this.setOption()
              } else {
                this.$pop('当前测点无波形数据！')
              }
              this.$emit('loadingImg', false)
            }
          })
      } else {
        setTimeout(() => {
          console.log('延迟执行')
          this.getWaveData(data)
        }, 1000)
      }
    },
    dataRetrieval() {
      this.$retrieval('circle').then((res) => {
        if (res) {
          this.getTrendData()
        }
      })
    },
    getTrendData() {
      const param = this.paramsData[this.currentKey]
      const trend = this.trendData[this.currentKey]
      let pos
      if (param.basicMsg && param.basicMsg.length > 0) {
        pos = param.basicMsg[0].pos
      } else {
        pos = param.pos
      }
      trend.pos = pos
      trend.key = `${pos.machine_id}_${pos.position_id}_${pos.position_type}`
      const srcParams = this.$store.state.srcParams
      const time = srcParams.time
      const trendDensity = srcParams.density /* 趋势数据查询密度 */
      const defaultCode = getdefaultCode(pos.dgm_type)
      const eigenvalue = defaultCode[pos.position_type]
      let unitY = getUnit(eigenvalue.code, pos)
      trend.chartData.curUnitY = trend.chartData.srcUnitY = unitY
      let requestData = {
        machineId: pos.machine_id,
        positionId: pos.position_id,
        positionType: pos.position_type,
        startTime: time.start,
        endTime: time.end,
        toSpeed: '',
        fromSpeed: '',
        lowerLimit: '',
        upperLimit: '',
        value: eigenvalue.filed,
        code: eigenvalue.code,
        waveType: 0,
        density: Number(trendDensity.type),
      }
      this.$emit('loadingImg', true)
      this.$getApi.getPositionEigenvalue(requestData).then((res) => {
        if (res) {
          this.$emit('loadingImg', false)
          this.setTrendData(res)
        } else {
          trend.empty.isShow = true
        }
      })
    },
    setTrendData(res) {
      const list = res.tendencyList
      let x = []
      let y = []
      let y1 = []
      let date = 0
      const index = this.currentKey
      const l = list.length
      const params = this.paramsData[index]
      const trend = this.trendData[this.currentKey]
      const defaultCode = getdefaultCode(trend.pos.dgm_type)
      const eigenvalue = defaultCode[trend.pos.position_type]
      if (l >= 1) {
        trend.empty.isShow = false
        const msg = cloneObj(trend.chartData, true)
        for (let i = 0; i < l; i++) {
          const value = list[i]
          value.saveTime > date && (date = value.saveTime)
          x.push(value.saveTime)
          y.push(value.tempValue)
          if (trend.isMMS2) {
            if (
              getUnit(eigenvalue.code, params.pos) == 'g' ||
              getUnit(eigenvalue.code, params.pos) == 'gD'
            )
              y1.push(value.tempValue * 9807) /* g转m/s² */
          }
        }
        msg.srcX = x
        msg.curX = x
        msg.srcY = y
        msg.curY = y
        if (msg.curUnitY !== msg.srcUnitY) {
          const newUnit = msg.curUnitY
          msg.curUnitY = msg.srcUnitY
          this.unitHandler(2, newUnit)
        }
        if (trend.isMMS2) {
          if (msg.curUnitY == 'g') {
            msg.curUnitY = 'mm/s²'
          }
          if (
            getUnit(eigenvalue.code, params.pos) == 'g' ||
            getUnit(eigenvalue.code, params.pos) == 'gD'
          ) {
            msg.curY = y1
          }
        }
        trend.chartData = msg
        this.setTrendOption()
      } else {
        trend.empty.isShow = true
      }
    },
    setTrendOption() {
      const trend = this.trendData[this.currentKey]
      const param = this.paramsData[this.currentKey]
      const chart = trend.chartData
      const color = trend.color
      const btnIndex = this.currentIndex
      const that = this
      const trendOption = {
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
        },
        y: {
          name: chart.curUnitY,
          nameStyle: {
            color: color.axis.name,
            size: '14px',
            bold: 'normal',
          },
          wtype: 'wave_trend',
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
            that.$store.commit('setCurrentTime', params.val)
            param.isRequestDown = true
            if (!param.isCtrlkeydown) {
              if (param.basicMsg.length == 0) {
                const info = {
                  pos: param.pos,
                  time: params.val,
                  flag: 0,
                  index: -1,
                }
                that.getWaveData(info)
              } else {
                // 点击更换波形趋势（同一机组下的同任务id进行更换）
                for (let i = 0, l = param.basicMsg.length; i < l; i++) {
                  let isTimeSame = false //当前测点是否存在选中时间的数据
                  let sameTimeIndex = -1 //存在同一测点相同时间的basicMsg数据下标
                  if (param.basicMsg[i].flag == 0) {
                    // 判断当前测点是否存在选中时间的数据
                    for (let j = 0, l = param.basicMsg.length; j < l; j++) {
                      const pos = param.basicMsg[j].pos
                      if (
                        pos.machine_id == param.basicMsg[i].pos.machine_id &&
                        pos.position_id == param.basicMsg[i].pos.position_id &&
                        pos.position_type ==
                          param.basicMsg[i].pos.position_type &&
                        param[param.basicMsg[j].key] &&
                        param[param.basicMsg[j].key].time == params.val
                      ) {
                        isTimeSame = true
                        sameTimeIndex = j
                      }
                    }
                    let flag = false
                    // 判断是否为同一机组，是否为同一taskid，是否存在当前时间数据
                    if (
                      param.basicMsg[i].pos.machine_id !=
                        param.basicMsg[0].pos.machine_id ||
                      param.basicMsg[i].pos.task_id !=
                        param.basicMsg[0].pos.task_id ||
                      param[param.basicMsg[i].key].time == params.val
                    ) {
                      flag = true
                    }

                    if (!flag) {
                      if (isTimeSame) {
                        const chart = that.chartData[that.currentKey]
                        const basicItem = cloneObj(
                          param.basicMsg[sameTimeIndex],
                          true
                        )
                        basicItem.color = param.basicMsg[i].color
                        basicItem.key = param.basicMsg[i].key
                        basicItem.flag = 0
                        param.basicMsg[i] = cloneObj(basicItem, true)
                        chart[basicItem.key] = cloneObj(
                          chart[param.basicMsg[sameTimeIndex].key],
                          true
                        )
                        param[basicItem.key] = cloneObj(
                          param[param.basicMsg[sameTimeIndex].key],
                          true
                        )
                        param[basicItem.key].color = basicItem.color
                        that.setOption()
                      } else {
                        let basic = param.basicMsg[i]
                        const info = {
                          pos: basic.pos,
                          time: params.val,
                          flag: 0,
                          index: i,
                        }
                        that.getWaveData(info)
                      }
                    }
                  }
                }
              }
            } else {
              // ctrl+点击添加，
              // 对拖入的每个测点(与首个测点的同一机组且taskId一致)增加一份当前时间的数据
              let posArray = []
              for (let i = 0, l = param.basicMsg.length; i < l; i++) {
                let isTimeSame = false //当前测点是否存在选中时间的数据
                let sameTimeIndex = -1 //存在同一测点相同时间的basicMsg数据下标
                if (param.basicMsg[i].flag == 0) {
                  // 判断当前测点是否存在选中时间的数据
                  for (let j = 0, l = param.basicMsg.length; j < l; j++) {
                    const pos = param.basicMsg[j].pos
                    if (
                      pos.machine_id == param.basicMsg[i].pos.machine_id &&
                      pos.position_id == param.basicMsg[i].pos.position_id &&
                      pos.position_type ==
                        param.basicMsg[i].pos.position_type &&
                      param[param.basicMsg[j].key] &&
                      param[param.basicMsg[j].key].time == params.val
                    ) {
                      isTimeSame = true
                      sameTimeIndex = j
                    }
                  }
                  let flag = false
                  if (
                    param.basicMsg[i].pos.machine_id !=
                      param.basicMsg[0].pos.machine_id ||
                    param.basicMsg[i].pos.task_id !=
                      param.basicMsg[0].pos.task_id
                  ) {
                    flag = true
                  } else {
                    for (let k = 0, l = posArray.length; k < l; k++) {
                      const pos = posArray[k]
                      if (
                        pos.machine_id == param.basicMsg[i].pos.machine_id &&
                        pos.position_id == param.basicMsg[i].pos.position_id &&
                        pos.position_type == param.basicMsg[i].pos.position_type
                      ) {
                        flag = true
                      }
                    }
                  }
                  if (!flag) {
                    posArray.push(param.basicMsg[i].pos)
                    // 若当前时间存在数据则直接取不进行请求
                    if (isTimeSame) {
                      // 若当前添加锁定时间点存在直接跳出
                      if (param.basicMsg[sameTimeIndex].flag == 1) {
                        console.log('测点时间已锁定')
                        break
                      }
                      const chart = that.chartData[that.currentKey]
                      const basicItem = cloneObj(
                        param.basicMsg[sameTimeIndex],
                        true
                      )
                      basicItem.color =
                        that.colorList[(param.basicMsg.length + 1) % 15]
                      basicItem.key = `wave_pos_${basicItem.pos.posFlag}_${params.val}`
                      basicItem.flag = 1
                      param.basicMsg.push(basicItem)
                      chart[basicItem.key] = cloneObj(
                        chart[param.basicMsg[sameTimeIndex].key],
                        true
                      )
                      param[basicItem.key] = cloneObj(
                        param[param.basicMsg[sameTimeIndex].key],
                        true
                      )
                      param[basicItem.key].color =
                        that.colorList[param.basicMsg.length % 15]
                    } else {
                      const info = {
                        pos: param.basicMsg[i].pos,
                        time: params.val,
                        flag: 1,
                        index: -1,
                      }
                      that.getWaveData(info)
                    }
                  }
                }
              }
            }
          },
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-enlarge_huaban-compare_trend'
            )[btnIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-compare_trend'
            )[btnIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-compare_trend'
            )[btnIndex],
          },
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban-compare_trend'
            )[btnIndex],
            imageName: '趋势图',
          },
        },
        backgroundColor: color.background,
      }
      this.$nextTick(() => {
        const index = this.currentIndex
        trend.trendChart === null &&
          (trend.trendChart = myChart.init(this.$refs.trendChart[index]))

        trend.trendChart.setOption(trendOption)
        trend.trendChart.resize()
      })
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
        markLine: [],
        isRefresh: true,
      }
      const seriesColor = []
      if (
        basic.length > 0 &&
        data[basic[0].key] &&
        data[basic[0].key].spectrum &&
        data[basic[0].key].spectrum.markLine &&
        params[basic[0].key].isShow
      ) {
        spectrum.markLine = data[basic[0].key].spectrum.markLine
        spectrum.isRefresh = data[basic[0].key].spectrum.isRefresh = true
        spectrum.x.push(data[basic[0].key].spectrum.curX)
        spectrum.unitX.push(data[basic[0].key].spectrum.curUnitX)
        spectrum.y.push(data[basic[0].key].spectrum.curY)
        spectrum.unitY.push(data[basic[0].key].spectrum.curUnitY)
        posName.push(params[basic[0].key].posName)
        seriesColor.push(params[basic[0].key].color)
      }
      for (const key in data) {
        const value1 = data[key]
        const value2 = params[key]
        if (!value2.isShow) continue
        wave.x.push(value1.wave.curX)
        wave.unitX.push(value1.wave.curUnitX)
        wave.y.push(value1.wave.curY)
        wave.unitY.push(value1.wave.curUnitY)
        if (key == basic[0].key) continue
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
            params.developChart.chart = 'wave'
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
              'icon-enlarge_huaban-Maccompare_wave'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-Maccompare_wave'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-Maccompare_wave'
            )[currentIndex],
          },
          // 时间差
          timeDifferent: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-subtime_huaban-Maccompare_wave'
            )[currentIndex],
            formatter(isTimeDifferent) {
              let className = document
                .getElementsByClassName('icon-subtime_huaban-Maccompare_wave')
                [currentIndex].className.split(' ')
              if (isTimeDifferent) {
                if (className.indexOf('chart-btn-active') == -1) {
                  addClass(
                    document.getElementsByClassName(
                      'icon-subtime_huaban-Maccompare_wave'
                    )[currentIndex],
                    'chart-btn-active'
                  )
                }
              } else {
                removeClass(
                  document.getElementsByClassName(
                    'icon-subtime_huaban-Maccompare_wave'
                  )[currentIndex],
                  'chart-btn-active'
                )
              }
            },
          },
          // 导出图片
          /* exportImage: {
                  show: true,
                  dom: document.getElementsByClassName('icon-savemage_huaban-Maccompare_wave')[currentIndex],
                  imageName: `${posName}_波形图`,
               }, */
          // 导出数据
          /* exportData: {
                  fileName: posName,
                  show: true,
                  dom: document.getElementsByClassName('icon-exportdata_huaban-Maccompare_wave')[currentIndex],
               }, */
          // 导出音频
          /* exportAudio: {
                  fileName: `${posName}_音频`,
                  show: true,
                  dom: document.getElementsByClassName('icon-exporemusic_huaban-Maccompare_wave')[currentIndex],
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
          markLine: {
            data: spectrum.markLine,
            isRefresh: spectrum.isRefresh, //是否需要刷新整个图谱
            lineStyle: {
              color: color.markLine.line,
            },
            fontStyle: {
              color: color.markLine.font,
              size: '14px',
            },
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
          formatter(param) {
            params.developChart.chart = 'spectrum'
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
              'icon-enlarge_huaban-Maccompare_spectrum'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-Maccompare_spectrum'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-Maccompare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = false
              removeClass(
                document.getElementsByClassName(
                  'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
                )[currentIndex],
                'chart-btn-active'
              )
            },
          },
          // 差频
          subFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = !params.isSubFreq
              params.isSubFreq &&
                addClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
              !params.isSubFreq &&
                removeClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
            },
          },
          // 标注倍频
          labelFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhubeipin_huaban-Maccompare_spectrum'
            )[currentIndex],
            icon: {
              isCheck: params.isLabelFreq,
            },
          },
          // 添加标注
          addLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhu_huaban-Maccompare_spectrum'
            )[currentIndex],
          },
          // 取消标注
          cancelLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-quxiaobiaozhu_huaban-Maccompare_spectrum'
            )[currentIndex],
          },
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban-Maccompare_spectrum'
            )[currentIndex],
            imageName: posName + '_频谱图',
          },
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
            params.developChart.chart = 'wave'
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
              'icon-enlarge_huaban-Maccompare_wave'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-Maccompare_wave'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-Maccompare_wave'
            )[currentIndex],
          },
          // 时间差
          timeDifferent: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-subtime_huaban-Maccompare_wave'
            )[currentIndex],
          },
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
        markLine: [],
        isRefresh: true,
      }
      const seriesColor = []
      if (
        data[basic[0].key] &&
        data[basic[0].key].spectrum &&
        data[basic[0].key].spectrum.markLine &&
        params[basic[0].key].isShow
      ) {
        spectrum.markLine = data[basic[0].key].spectrum.markLine
        spectrum.isRefresh = data[basic[0].key].spectrum.isRefresh
        spectrum.x.push(data[basic[0].key].spectrum.curX)
        spectrum.unitX.push(data[basic[0].key].spectrum.curUnitX)
        spectrum.y.push(data[basic[0].key].spectrum.curY)
        spectrum.unitY.push(data[basic[0].key].spectrum.curUnitY)
        posName.push(params[basic[0].key].posName)
        seriesColor.push(params[basic[0].key].color)
      }
      console.log(data[basic[0].key])

      for (const key in data) {
        const value1 = data[key]
        const value2 = params[key]
        if (!value2.isShow) continue
        if (key == basic[0].key) continue
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
          markLine: {
            data: spectrum.markLine,
            isRefresh: spectrum.isRefresh, //是否需要刷新整个图谱
            lineStyle: {
              color: color.markLine.line,
            },
            fontStyle: {
              color: color.markLine.font,
              size: '14px',
            },
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
          formatter(param) {
            params.developChart.chart = 'spectrum'
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
              'icon-enlarge_huaban-Maccompare_spectrum'
            )[currentIndex],
          },
          // 最大化 / 还原
          maxOrMin: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-MAX_huaban-Maccompare_spectrum'
            )[currentIndex],
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-restore_huaban-Maccompare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = false
              removeClass(
                document.getElementsByClassName(
                  'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
                )[currentIndex],
                'chart-btn-active'
              )
            },
          },
          // 差频
          subFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
            )[currentIndex],
            formatter() {
              params.isSubFreq = !params.isSubFreq
              params.isSubFreq &&
                addClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
              !params.isSubFreq &&
                removeClass(
                  document.getElementsByClassName(
                    'icon-duichengpinshuaicha_huaban-Maccompare_spectrum'
                  )[currentIndex],
                  'chart-btn-active'
                )
            },
          },
          // 标注倍频
          labelFreq: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-biaozhubeipin_huaban-Maccompare_spectrum'
            )[currentIndex],
            icon: {
              isCheck: params.isLabelFreq,
            },
          },
          // 取消标注
          cancelLabel: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-quxiaobiaozhu_huaban-Maccompare_spectrum'
            )[currentIndex],
          },
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              'icon-savemage_huaban-Maccompare_spectrum'
            )[currentIndex],
            imageName: posName + '_频谱图',
          },
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
      const trend = this.trendData[currentKey]
      const chart = this.chartData[currentKey]
      const waveComapreEl = this.$refs.waveCompare[currentIndex]
      const spectrumComapreEl = this.$refs.spectrumCompare[currentIndex]
      const trendEl = this.$refs.trendCompare[currentIndex]
      const shieldUnit = ['gD', '°', 'mV', 'rpm']
      const developIcon =
        document.getElementsByClassName('develop-macCompare')[currentIndex]
      params[`${type}Max`] = !params[`${type}Max`]
      const isMax = params[`${type}Max`]
      const compareChart = this.$refs.macCompareChart[currentIndex]
      if (index === 1) {
        const compareBox = this.$refs.macCompareChart[currentIndex]
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
              addClass(compareChart, 'macCompare-chart-maxwave')
              waveComapreEl.style = 'height:100%;border:none;'
              spectrumComapreEl.style.display = 'none'
              trendEl.style.display = 'none'
              developIcon.style.display = 'none'
              document.getElementsByClassName('macCompare-chart-base-title')[
                currentIndex
              ].style.display = 'none'
              this.$nextTick(() => {
                params.waveChart.resize()
                params.spectrumChart.resize()
                trend.trendChart.resize()
              })

              changeClass(tag, 'icon-back_huaban', 'icon-MAX_huaban')
            } else {
              removeClass(compareChart, 'macCompare-chart-maxwave')
              waveComapreEl.style = null
              spectrumComapreEl.style = null
              trendEl.style = null
              developIcon.style = null
              document.getElementsByClassName('macCompare-chart-base-title')[
                currentIndex
              ].style = null
              this.$nextTick(() => {
                params.waveChart.resize()
                params.spectrumChart.resize()
                trend.trendChart.resize()
              })
              changeClass(tag, 'icon-MAX_huaban', 'icon-back_huaban')
            }
            break
          case 4 /* 时间差 */:
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
                    !flag && this.getFreq(k, 1)
                  }
                }
                this.setSpectrum()
              }
            })
            break
          case 1 /* 最大化、还原 */:
            if (isMax) {
              addClass(compareChart, 'macCompare-chart-maxspectrum')
              spectrumComapreEl.style = 'height:100%;border:none;'
              developIcon.style.display = 'none'
              waveComapreEl.getElementsByClassName(
                'my-chart'
              )[0].style.display = 'none'
              trendEl.getElementsByClassName('my-chart')[0].style.display =
                'none'
              document.getElementsByClassName('macCompare-chart-base-title')[
                currentIndex
              ].style.display = 'none'
              this.$nextTick(() => {
                params.waveChart.resize()
                params.spectrumChart.resize()
                trend.trendChart.resize()
              })
              changeClass(tag, 'icon-back_huaban', 'icon-MAX_huaban')
            } else {
              removeClass(compareChart, 'macCompare-chart-maxspectrum')
              spectrumComapreEl.style = null
              waveComapreEl.getElementsByClassName('my-chart')[0].style = null
              trendEl.getElementsByClassName('my-chart')[0].style = null
              developIcon.style = null
              document.getElementsByClassName('macCompare-chart-base-title')[
                currentIndex
              ].style = null
              this.$nextTick(() => {
                params.waveChart.resize()
                params.spectrumChart.resize()
                trend.trendChart.resize()
              })
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
                if (freq.lowerLimit !== 0 || freq.upperLimit !== 0)
                  params.isSetPower = true
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
    // zong向展开波形频谱图
    developChart() {
      const currentIndex = this.currentIndex
      const currentKey = this.currentKey
      const params = this.paramsData[currentKey]
      const developChart = params.developChart
      const trend = this.trendData[currentKey]
      const compareChart = this.$refs.macCompareChart[currentIndex]
      const waveComapreEl = this.$refs.waveCompare[currentIndex]
      const spectrumCompareEl = this.$refs.spectrumCompare[currentIndex]
      if (params.developChart.chart == 'wave') {
        if (hasClass(compareChart, 'macCompare-chart-wave')) {
          removeClass(compareChart, 'macCompare-chart-wave')
          spectrumCompareEl.getElementsByClassName('my-chart')[0].style = null
          developChart.icon = '+'
        } else {
          addClass(compareChart, 'macCompare-chart-wave')
          spectrumCompareEl.getElementsByClassName(
            'my-chart'
          )[0].style.display = 'none'
          developChart.icon = '-'
        }
        params.waveChart.resize()
        params.spectrumChart.resize()
        trend.trendChart.resize()
      } else if (params.developChart.chart == 'spectrum') {
        if (hasClass(compareChart, 'macCompare-chart-spectrum')) {
          removeClass(compareChart, 'macCompare-chart-spectrum')
          waveComapreEl.getElementsByClassName('my-chart')[0].style = null
          developChart.icon = '+'
        } else {
          addClass(compareChart, 'macCompare-chart-spectrum')
          waveComapreEl.getElementsByClassName('my-chart')[0].style.display =
            'none'
          developChart.icon = '-'
        }
        params.waveChart.resize()
        params.spectrumChart.resize()
        trend.trendChart.resize()
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
        chart.isRefresh = true
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
      data.isRefresh = true
      this.chartData[currentKey][key].spectrum = data
    },
    // 频谱图根据值确定下标
    getIndex(value, key, type = 0) {
      const axis = ['srcX', 'srcY', 'curX', 'curY']
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
      // 同一测点同一时间无法拖入
      // if (compareList[`wave_pos_${posMsg.posFlag}_${time}`]) return;
      const currentKey = this.currentKey
      const params = this.paramsData[currentKey]
      let key = `wave_pos_${mId}_${pId}_${pType}_0`
      for (let i = 0, len = params.basicMsg.length; i < len; i++) {
        if (params.basicMsg[i].key == key) {
          this.$pop('当前对比分析图存在该测点！')
          return
        }
      }
      const info = {
        pos: posMsg,
        time: currentTime,
        flag: 0,
        index: -1,
      }
      this.getWaveData(info)
    },
    // 数据列表
    setDataList() {
      const paramsData = this.paramsData[this.currentKey]
      const basic = paramsData.basicMsg
      // 从vuex中的compareData去key值
      // const compareDate = cloneObj(this.$store.state.compareData, true)
      let dataList = []
      if (this.dataList[this.currentKey]) {
        dataList = cloneObj(this.dataList[this.currentKey], true)
      }
      for (let i = 0; i < basic.length; i++) {
        let l = dataList.length
        let flag = false //dataList是否已存在该数据，默认不存在
        let index = -1
        for (let j = 0; j < l; j++) {
          if (basic[i].key == dataList[j].key) {
            flag = true
            index = j
          }
        }
        if (!flag) {
          dataList.push({
            isShow: paramsData.isShow,
            color: basic[i].color,
            posName: basic[i].macName + '-' + basic[i].name,
            time: basic[i].time,
            key: basic[i].key,
            flag: basic[i].flag,
            // key: basic[i].key,
          })
        } else {
          dataList[index].color = basic[i].color
          dataList[index].time = basic[i].time
        }
      }
      this.$set(this.dataList, this.currentKey, dataList)
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
      const dataList = cloneObj(this.dataList[this.currentKey], true)
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
      this.$set(this.dataList, this.currentKey, dataList)
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
          const dataList = this.dataList[this.currentKey]
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
          this.chartData[this.currentKey] = cloneObj(newChart, true)
          params.basicMsg = cloneObj(newBasic, true)
          for (let i = 0, l = this.delKey.length; i < l; i++) {
            delete params[this.delKey[i]]
          }
          // 计算故障频率
          !params.failure.isSetSpeed &&
            (params.failure.analogSpeed = params.basicMsg[0].speed)
          this.setAnalogSpeed()
          this.setOption()

          // 判断是否需要更换趋势
          const trend = this.trendData[this.currentKey]
          if (
            trend.pos.position_id != newBasic[0].pos.position_id ||
            trend.pos.position_type != newBasic[0].pos.position_type
          ) {
            this.getTrendData()
          }
        }
        //关闭所有波形
        if (type === 2) {
          this.delKey = []
          this.dataList[this.currentKey].forEach((element) => {
            this.delKey.push(element.key)
          })
          this.dataList[this.currentKey] = []
          this.chartData[this.currentKey] = {}
          for (let i = 0, l = this.delKey.length; i < l; i++) {
            params.basicMsg = []
            delete params[this.delKey[i]]
          }
          this.setOption()

          // 清空趋势图数据
          let isMMS2 = false
          const trendChart = this.trendData[this.currentKey].trendChart
          this.$set(this.trendData, this.currentKey, {
            key: '' /* 机组id_测点id_测点type */,
            pos: {},
            chartData: {
              curUnitY: '',
              curX: [],
              curY: [],
              srcUnitY: '',
              srcX: [],
              srcY: [],
            },
            trendChart,
            isMMS2: isMMS2 /* 趋势图单位是否要处理为mm/s² */,
            color: this.color,
            empty: {
              isShow: true,
              text: '趋势图无数据',
            },
          })
          this.$nextTick(() => {
            this.trendData[this.currentKey].empty.isShow = true
          })

          /* 清空故障频率 */
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
    // 鼠标按下时间
    keydownEvent(e) {
      if (e.ctrlKey) {
        this.paramsData[this.currentKey].isCtrlkeydown = true
      }
    },
    // 鼠标按下时间
    keyupEvent(e) {
      if (!e.ctrlKey) {
        this.paramsData[this.currentKey].isCtrlkeydown = false
      }
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'macCompare',
    })
  },
}
</script>
<style scoped lang="scss">
.my-compare-chart {
  position: relative;

  .macCompare-chart {
    height: calc(100% - 50px);
    display: grid;
    grid-row-gap: 2px;
    grid-template-columns: 100%;
    .chart-base-title {
      height: 30px;
      line-height: 30px;
      width: 100%;
      span {
        margin-right: 40px;
      }
    }
    .develop-chart {
      text-align: center;
      font-size: 10px;
      height: 15px;
      width: 30px;
      line-height: 13px;
      cursor: pointer;
      font-weight: bold;
      margin-left: calc(50% - 15px);
    }
    .develop-chart-bg {
      display: block;
      width: 100%;
    }
    .chart-box {
      position: relative;
      width: 100%;
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
      width: 570px;
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
        width: 546px;
        height: 164px;
        margin: 0 auto;
        font-size: 12px;
        overflow: hidden;
        .data-list-thead,
        .data-list-tr {
          display: grid;
          grid-template-columns: 40px 40px 160px 160px 40px 106px;
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
    .none-data {
      height: 100%;
      widows: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
    }
  }
  .macCompare-chart-nomal {
    grid-template-rows: 30px 35% 15px 35% calc(30% - 50px);
  }
  .macCompare-chart-wave {
    grid-template-rows: 30px 70% 15px 0 calc(30% - 50px);
  }
  .macCompare-chart-spectrum {
    grid-template-rows: 30px 0 15px 70% calc(30% - 50px);
  }
  .macCompare-chart-maxwave {
    grid-template-rows: 100%;
  }
  .macCompare-chart-maxspectrum {
    grid-template-rows: 0px 0px 100%;
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
      &:nth-child(2) {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
    }
  }
}
</style>
