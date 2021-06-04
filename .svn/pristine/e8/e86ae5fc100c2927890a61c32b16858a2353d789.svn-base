<!-- 趋势图 -->
<template>
  <div class="data-retrieval-bg pop-bg">
    <div class="data-retrieval-box big-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <span>数据检索</span>
        <div
          class="close-retrieval"
          @click="closeRetrieval(0)"
        >
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">时间</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeTimeType"
        >
          {{ dateType.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 开始时间 -->
      <div class="select-time">
        <div class="select-title time-title">开始时间</div>
        <!-- <input class="retrieval-start-time time-value input-value radius text-overflow select-none outside-border edge-outside-border" /> -->
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 结束时间 -->
      <div class="select-time">
        <div class="select-title time-title">结束时间</div>
        <!-- <input class="retrieval-end-time time-value input-value radius text-overflow select-none outside-border edge-outside-border" /> -->
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 趋势预测结束时间 -->
      <div class="select-time">
        <div class="select-title time-title">预测截止</div>
        <el-date-picker
          v-model="predTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          :clearable='false'
        >
        </el-date-picker>
        <!-- <input class="retrieval-pred-time time-value input-value radius text-overflow select-none outside-border edge-outside-border" /> -->
      </div>
      <div class="set-alp">
        <div class="select-title time-title">阈值(0-1)</div>
        <input
          type="number"
          @blur="blurAlp($event)"
          class="time-value input-value radius text-overflow select-none outside-border edge-outside-border"
          v-model="alp"
        />
      </div>
      <!-- 转速区间 -->
      <div class="set-speed">
        <div class="select-title speed-title">转速区间</div>
        <input
          type="number"
          min="0"
          class="input-value radius outside-border edge-outside-border"
          v-model="result.minSpeed"
        />
        <div class="speed-bar">
          <div></div>
        </div>
        <input
          type="number"
          min="0"
          class="input-value radius outside-border edge-outside-border"
          v-model="result.maxSpeed"
        />
      </div>
      <!-- 趋势图上限过滤 -->
      <div class="set-limit">
        <div class="select-title limit-title">上限过滤</div>
        <input
          type="number"
          class="limit-value input-value radius text-overflow select-none outside-border edge-outside-border"
          v-model="result.upper"
        />
      </div>
      <!-- 趋势图下限过滤 -->
      <div class="set-limit">
        <div class="select-title limit-title">下限过滤</div>
        <input
          type="number"
          class="limit-value input-value radius text-overflow select-none outside-border edge-outside-border"
          v-model="result.lower"
        />
      </div>
      <!-- 选择查询密度 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">查询密度</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeDensityType"
        >
          {{ density.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 报警门限 -->
      <div class="check-alarm-threshold">
        <div class="select-title alarm-title">报警门限</div>
        <ul class="alarm-value">
          <li
            v-for="(item, index) in result.cond"
            :key="index"
          >
            <input
              type="checkbox"
              style="display: none"
              :id="'alarm_' + index"
              v-model="item.isShow"
            />
            <label :for="'alarm_' + index">
              <i
                class="iconfont"
                :class="setIcon(item.isShow)"
              ></i>
              {{ item.name }}
            </label>
          </li>
        </ul>
      </div>
      <!-- 数据类型选择 -->
      <div
        class='check-eigenvalue-box'
        v-show="viewMsg.isDataType"
      >
        <div class='select-title check-eigenvalue-title'></div>
        <ul class='check-eigenvalue radius select-none'>
          <li
            v-for='(item, index) in dataType'
            :key=index
            :title='item.val'
            @click.stop='checkDataType(item)'
          >
            <i
              class='iconfont'
              :class='setIcon(item.isChecked)'
            ></i>
            {{item.val}}
          </li>
        </ul>
      </div>
      <div class="data-retrieval-btn">
        <button @click="reset">重置</button>
        <button @click="trendPrediction">趋势预测</button>
        <button @click="closeRetrieval()">确定</button>
        <button
          class="disable-btn"
          @click="closeRetrieval(0)"
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import MyMixins from './PublicMethods.js'
import { Mandarin } from 'flatpickr/dist/l10n/zh'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      result: {
        cond: [
          { name: '工况1', isShow: false },
          { name: '工况2', isShow: false },
          { name: '工况3', isShow: false },
          { name: '工况4', isShow: false },
          { name: '其它工况', isShow: false },
        ],
      },
      predTime: '', //趋势预测时间
      alp: 0.2,
    }
  },
  props: {
    viewMsg: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  mixins: [MyMixins],
  methods: {
    initParams(params) {
      if (this.viewMsg.isDataType) {
        this.dataType = this.viewMsg.dataType
      }
      if (params.cond.length) {
        //第一次没有工况 默认初始值
        this.result.cond = params.cond
      }
      if (params.alp) {
        //第一次没有工况 默认初始值
        this.alp = params.alp
      }
      this.predTime = params.predTime || new Date().valueOf()
      // this.predTime = flatpickr('.retrieval-pred-time', {
      //   locale: Mandarin, //汉化
      //   clickOpens: true,
      //   enableTime: true,
      //   enableSeconds: true,
      //   time_24hr: true,
      //   dateFormat: 'Y-m-d H:i:S',
      //   defaultDate: params.predTime || new Date().valueOf(),
      // })
    },
    trendPrediction() {
      this.result.trendPrediction = true
      this.result.predTime = this.predTime
      this.result.alp = this.alp
      this.closeRetrieval()
    },
    /* 范围判定 */
    blurAlp(e) {
      let val = e.target.value
      if (val === '' || parseFloat(val) <= 0 || parseFloat(val) >= 1) {
        this.$pop('阈值范围0-1')
        this.alp = 0.2
      }
    },
  },
}
</script>
<style scoped lang="scss"></style>
