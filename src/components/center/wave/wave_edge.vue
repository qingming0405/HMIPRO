<!-- 波形频谱图 -->
<template>
  <div
    class='my-wave-spectrum'
    @contextmenu.prevent
  >
    <div
      class='my-wave-spectrum-chart select-none'
      v-for='(item, index) in paramsData'
      :key='index'
      v-show='item.isShow'
      @drop='changePos(index, $event)'
      @dragover.prevent
    >
      <div class='chart-base-title'>
        <span>{{item.fileName}}-波形频谱图</span>
        <span v-show='chartData[index].wave.curX.length > 0'>{{item.chartData.time}}</span>
        <span
          v-if="item.chartData.speed < 100000000"
          v-show='chartData[index].wave.curX.length > 0 && item.pos.position_type != 14 && item.pos.dgm_type != 10'
        >rpm: {{item.chartData.speed}}</span>
        <span
          v-else
          v-show='chartData[index].wave.curX.length > 0 && item.pos.position_type != 14 && item.pos.dgm_type != 10'
        >rpm: 无数据</span>
        <span
          v-if="item.chartData.rms < 100000000"
          v-show='chartData[index].wave.curX.length > 0 && item.pos.dgm_type != 10 '
        >{{item.chartData.rmsTitle}}{{item.chartData.rms}}{{item.chartData.rmsUnit}}</span>
        <span
          v-else
          v-show='chartData[index].wave.curX.length > 0 && item.pos.dgm_type != 10 '
        >{{item.chartData.rmsTitle}} 无数据</span>
        <span v-show='isViewP() && item.pos.dgm_type != 10 && item.pos.dgm_type != 11'>p: {{item.chartData.p}}{{item.chartData.pUnit}}</span>
        <span v-show='isViewP() && item.pos.dgm_type != 10 && item.pos.dgm_type != 11'>pp: {{item.chartData.pp}}{{item.chartData.ppUnit}}</span>
        <!-- 8000总振值 -->
        <span v-show='isViewP() && item.pos.dgm_type == 11 && item.pos.position_type == 3'>direc: {{item.chartData.direc}}</span>
        <!-- <span class='select-density-type' v-show='item.isSpeed'>{{item.speedType}}</span> -->
      </div>
      <div
        :class='"wave-spectrum-chart wave-spectrum-chart" + index'
        ref='waveCharts'
      >
        <wave-chart
          :opt='0'
          :index='currentKey'
          :isNewChart='item.isNewChart.wave'
          :option='waveOption'
          :class='"wave-chart box-shadow my-wave-chart0" + index'
          :className='"wave"'
          :structure='item.structure'
          :empty='item.empty.wave'
          :isTimeDifferent='item.isRestore.wave'
          :developChart='item.developChart.wave'
          :isSpeedPulse='item.speedWavePulse'
          @maximization='maximization'
          @selectUnit='selectUnit'
          @getPulseTime='getPulseTime'
          @setFilterWave='setFilterWave'
        >
        </wave-chart>
        <!-- <div class="wave-chart box-shadow my-wave-chart" :ref='"wave"+index'>
          <i
            class="iconfont"
            v-for="(item, index) in chartBtn"
            :class="setClass(index)"
            :key="index"
            :title="setTitle(index)"
            v-show="setViewIcon(item,0)"
            @click="handler(index, $event, 0)"
          >
          </i>
          <p
            class="none-data-box"
            v-if="item.empty.wave && item.empty.wave.isShow"
          >
            <span>{{item.empty.wave.text}}</span>
          </p>
        </div> -->
        <div class='develop-chart-bg'>
          <div
            class='develop-chart radius default-border'
            @click.stop='developChart'
          >{{item.developChart.icon}}</div>
        </div>
        <wave-chart
          :opt='1'
          :index='currentKey'
          :isNewChart='item.isNewChart.spectrum'
          :option='spectrumOption'
          :class='"spectrum-chart box-shadow my-spectrum-chart1" + index'
          :className='"wave"'
          :structure='item.structure'
          :empty='item.empty.wave'
          :developChart='item.developChart.spectrum'
          @maximization='maximization'
          @selectUnit='selectUnit'
          @setAllFreq='setAllFreq'
          @setLog='setLog'
          :isSpeedPulse='item.speedWavePulse'
        >
        </wave-chart>
        <!-- <wave-chart
          :opt='2'
          :index='currentKey'
          :isNewChart='item.isNewChart.trend'
          :option='trendOption'
          :class='"trend-chart box-shadow my-trend-chart2" + index'
          :className='"wave"'
          :structure='item.structure'
          :clickTrend='clickTrend'
          :empty='item.empty.trend'
          @maximization='maximization'
          @selectUnit='selectUnit'
        >
        </wave-chart> -->
        <div
          class="my-wave-chart trend-chart box-shadow"
          :ref='"trend"+index'
          v-show="!item.isTrendClose && !item.maximization.wave && !item.maximization.spectrum"
        >
          <i
            class="iconfont"
            v-for="(item, index) in chartBtn"
            :class="setClass(index)"
            :key="index"
            :title="setTitle(index)"
            v-show="setViewIcon(item,2)"
            @click="handler(index, $event, 2)"
          >
          </i>
          <p
            class="none-data-box"
            v-if="item.empty.trend && item.empty.trend.isShow"
          >
            <span>{{item.empty.trend.text}}</span>
          </p>
        </div>
      </div>
      <!-- 右侧小工具 -->
      <ul
        class='tool-icon box-shadow'
        v-if='item'
      >
        <li
          v-for='(icon, idx) in item.iconList'
          :key=idx
          class='icon-list radius'
          :title='icon.title'
          ref='iconList'
          v-show="setrViewIcon(icon)"
          :class='icon.parentClass'
          @click='operatChart(idx)'
        >
          <i
            class='iconfont'
            :class='icon.class'
          ></i>
        </li>
      </ul>
      <!-- 故障频率 -->
      <div
        class='set-failure-bg pop-bg'
        v-show='item.failure.isShow'
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
            v-show='!item.failure.impeller'
            class='none-impeller-failure'
          >
            <div class='set-failure-speed'>
              <span @click='setSpeed'>
                <i :class='setIcon(item.failure.isSetSpeed, 2)'></i>
                是否启用模拟转速
              </span>
              <span>
                基准转速：<input
                  class='radius'
                  type="text"
                  :disabled='!item.failure.isSetSpeed'
                  v-model='item.failure.analogSpeed'
                  @input=setAnalogSpeed
                >
              </span>
              <span></span>
            </div>
            <div class='set-failure-msg'>
              <ul
                class='failure-list radius'
                v-for='(failure, idx) in item.failureList'
                :key=idx
              >
                <li>
                  <div class='my-failure-list first-failure-list'>
                    <i
                      :class='setIcon(failure.isView, 1)'
                      @click.stop='showChildren(failure)'
                    >
                    </i>
                    <i
                      :class='setIcon(failure.status)'
                      @click.stop='chartData[currentKey].spectrum.isRefresh = false;checkFailure(failure, idx)'
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
                          @click.stop='chartData[currentKey].spectrum.isRefresh = false;checkFailure(list, idx, id)'
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
                              @click.stop='chartData[currentKey].spectrum.isRefresh = false;checkFailure(item, idx, i)'
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
            v-show='item.failure.impeller'
          >
            <ul class='set-failure-freq'>
              <li
                v-for='(data, i) in item.failure.analogValue'
                :key=i
              >
                <label :for="'freq' + index + i">{{data.title}}</label>
                <input
                  type="number"
                  :id="'freq' + index + i"
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
                <button @click.stop='setMarkLine'>标注频率</button>
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
      <!-- 故障频率明细 -->
      <div
        class="failure-list-bg pop-bg"
        v-show='item.failure.isShowList'
      >
        <div
          class='failure-list-box box-shadow radius'
          ref='failureList'
        >
          <!-- 标题 -->
          <div
            class='failure-list-title'
            @mousedown.stop='dragElem(1, "failureList", $event)'
            @mouseup.stop='dragElem(0, "failureList", $event)'
          >
            故障频率明细
            <span
              class='close-failure-list'
              @click.stop='closeFailureList'
            >
              <i class='iconfont icon-cuohao'></i>
            </span>
          </div>
          <!-- 头部 -->
          <ul class='failure-list-head failure-list-table'>
            <li
              v-for='(data, idx) in item.failure.list.head'
              :key="'head' + idx"
            >{{data}}</li>
          </ul>
          <!-- 内容 -->
          <ul class='failure-list-body failure-list-table'>
            <li
              v-for='(item, id) in item.failure.list.body'
              :key="'body' + id"
            >
              <div>{{item.flag}}</div>
              <div
                class='text-overflow'
                :title='item.name'
              >{{item.name}}</div>
              <div
                class='text-overflow'
                :title='item.freq'
              >{{item.freq}}</div>
              <div
                class='text-overflow'
                :title='item.amplitude'
              >{{item.amplitude}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class='search-data'>
        <button
          v-show="Number(item.pos.position_type) === 200"
          :class="item.isSpectrum ? '':'disable-btn'"
          @click='isGetSpectrumData(1)'
        >开启频谱图</button>
        <button
          v-show="Number(item.pos.position_type) !== 200"
          @click='getRealData'
          class='get-real-data'
          ref='waveRealData'
          :class='item.getReal.class'
        >实时数据</button>
        <button
          v-show="Number(item.pos.dgm_type) == 1 && (Number(item.pos.position_type) === 3 || Number(item.pos.position_type) === 4)"
          @click='getDegreeData'
          class='get-real-data'
          :class='item.getDegree.class'
        >阶次</button>
        <button
          v-show='item.chartType'
          @click='setSpeedType'
        >{{item.speedType}}</button>
        <button
          class='save-image'
          @click='keepPage'
        >保存图片</button>
        <button
          @click='openFailure'
          v-show="item.pos.dgm_type != 11"
        >故障频率</button>
        <button @click='changeStructure'>布局切换</button>
        <button @click='item.isTrendClose = !item.isTrendClose;closeTrend()'>{{item.isTrendClose?'开启趋势':'关闭趋势'}}</button>
        <button @click='dataRetrieval'>数据检索</button>
        <input
          type="checkbox"
          v-model='item.getReal.isGetReal'
          class='is-get-real'
          ref='isGetReal'
        >
        <a
          href=""
          id='keep_download'
          ref='saveImage'
          :download="item.fileName"
        ></a>
      </div>
    </div>
  </div>
</template>
<script>
// import 《组件名称》 from '《组件路径》';
import WaveChart from '@/components/common/waveChart/waveChart_wave'
import com from './waveCommon'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    WaveChart,
  },
  mixins: [com],
  data() {
    return {
      color_wave: {
        /* 颜色设置 */ titleColor: '#fff' /* 标题字体 */,
        axis: {
          /* 坐标轴 */ name: '#fff' /* 标题 */,
          font: '#fff' /* 字体 */,
          line: '#fff' /* 坐标线 */,
          splitLine: '#fff' /* 分隔线 */,
        },
        series: {
          /* 图谱 */ line: '#38dcff' /* 谱线 */,
          symbol: '#fff' /* symbol */,
        },
        tool: {
          symbol: '#ff9b21',
          line: '#ff9b21', //鼠标点击的十字线
          font: '#fff',
          // background: 'rgba(108, 145, 221, 0.5)'
          background: '#b96600',
        },
        markLine: {
          /* 标线 */ line: '#fbc543' /* 标线 */,
          font: '#1800ff' /* 提示文字 */,
        },
        background: '#fff' /* 背景颜色 */,
      },
    }
  },
}
</script>
<style scoped lang='scss'>
.my-wave-spectrum {
  .my-wave-spectrum-chart {
    position: relative;
    height: 100%;
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
    .chart-base-title {
      height: 30px;
      line-height: 30px;
      span {
        margin-right: 40px;
      }
    }
    .wave-spectrum-chart {
      height: calc(100% - 50px);
      width: 100%;
      display: grid;
      align-items: center;
      // grid-template-columns: repeat(2, 48%);
      grid-auto-flow: column;
      grid-template-columns: calc(96% + 10px);
      grid-template-rows: repeat(2, calc(34% - 5px)) 25%;
      grid-row-gap: 10px;
      .trend-chart {
        grid-column-start: span 1;
      }
      .develop-chart {
        text-align: center;
        font-size: 10px;
        height: 30px;
        line-height: 28px;
        cursor: pointer;
        font-weight: bold;
        /* span {
                  display: block;
                  transform: scale(0.7);
               } */
      }
      .develop-chart-bg {
        display: none;
      }
    }
    .wave-spectrum-chart-1 {
      grid-auto-flow: row;
      grid-template-columns: 48% 10px 48%;
      grid-template-rows: 68% 25%;
      // grid-column-gap: 10px;
      grid-column-gap: 0;
      .trend-chart {
        width: 100%;
        height: 100%;
        grid-column-start: span 3;
      }
      .develop-chart {
        text-align: center;
        font-size: 10px;
        height: 30px;
        line-height: 28px;
        cursor: pointer;
        font-weight: bold;
        /* span {
                  display: block;
                  transform: scale(0.7);
               } */
      }
      .develop-chart-bg {
        display: block;
      }
    }
    .wave-spectrum-chart-2 {
      grid-template-columns: 96% 10px 0;
    }
    .wave-spectrum-chart-3 {
      grid-template-columns: 0 10px 96%;
    }
    .wave-spectrum-chart-4 {
      grid-template-rows: calc(46.5% - 5px) 46.5%;
      // repeat(2, calc(34% - 5px)) 25%;
    }
    .wave-spectrum-chart-5 {
      grid-template-rows: 93% 0;
    }
    .tool-icon {
      position: absolute;
      right: 0;
      top: 30px;
      width: calc(4% - 20px);
      padding: 2px 0;
      .icon-list {
        cursor: pointer;
        margin: 15px auto;
        text-align: center;
        @media screen and (min-width: 1280px) {
          height: 20px;
          width: 20px;
          line-height: 18px;
          .iconfont {
            font-size: 14px;
          }
        }
        @media screen and (min-width: 1600px) {
          height: 34px;
          width: 34px;
          line-height: 34px;
          .iconfont {
            font-size: 1.4rem;
          }
        }
      }
    }
    .my-failure-value1 {
      padding-left: 50px;
    }
    .my-failure-value2 {
      padding-left: 70px;
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
        margin: 0px 10px;
      }
      #keep_download,
      .is-get-real {
        display: none;
      }
    }
  }
}
</style>
