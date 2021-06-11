<!-- 三维频谱图 -->
<template>
  <div class="data-retrieval-bg pop-bg" v-show="isShow">
    <div class="data-retrieval-box big-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <!--  数据检索标题-->
        <span>{{vm.$t('Common.title')}}</span>
        <div class="close-retrieval" @click="closeRetrieval(0)">
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">{{vm.$t('Common.time')}}</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border"
          @click.stop="changeTimeType"
        >
          {{ dateType.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 开始时间 -->
      <div class="select-time">
        <div class="select-title time-title">{{vm.$t('Common.startTime')}}</div>
        <!-- <input
          class="retrieval-start-time time-value input-value radius text-overflow select-none outside-border"
        /> -->
        <el-date-picker
          v-model="startTime"
          type="datetime"
          :placeholder="vm.$t('Common.placeholderTime')"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 结束时间 -->
      <div class="select-time">
        <div class="select-title time-title">{{vm.$t('Common.endTime')}}</div>
        <!-- <input
          class="retrieval-end-time time-value input-value radius text-overflow select-none outside-border"
        /> -->
        <el-date-picker
          v-model="endTime"
          type="datetime"
          :placeholder="vm.$t('Common.placeholderTime')"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 转速区间 -->
      <div class="set-speed">
        <div class="select-title speed-title">{{vm.$t('Common.speedRange')}}</div>
        <input
          type="number"
          min="0"
          class="input-value radius outside-border"
          v-model="result.minSpeed"
        />
        <div class="speed-bar">
          <div></div>
        </div>
        <input
          type="number"
          min="0"
          class="input-value radius outside-border"
          v-model="result.maxSpeed"
        />
      </div>
      <!-- 有效频段 -->
      <div class="set-speed">
        <div class="select-title speed-title">{{vm.$t('TMSRetrieval.effectiveBand')}}</div>
        <input
          type="number"
          min="0"
          class="input-value radius outside-border"
          v-model="result.minValid"
        />
        <div class="speed-bar">
          <div></div>
        </div>
        <input
          type="number"
          min="0"
          class="input-value radius outside-border"
          v-model="result.maxValid"
        />
      </div>
      <div class="set-row-number">
        <!-- 行数 -->
        <div class="select-title row-number-title">{{vm.$t('TMSRetrieval.rows')}}</div>
        <input
          type="number"
          class="input-value radius outside-border"
          v-model="result.lineNum"
        />
      </div>
      <!-- 选择查询密度 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">{{vm.$t('Common.queryDensityBtn')}}</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeDensityType"
        >
          {{ density.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <div class="data-retrieval-btn">
        <!-- 重置 -->
        <button @click="reset">{{vm.$t('Common.resetBtn')}}</button>
        <!-- 确认 -->
        <button @click="closeRetrieval(1)">{{vm.$t('Common.sureBtn')}}</button>
        <!-- 取消 -->
        <button class="disable-btn" @click="closeRetrieval(0)">{{vm.$t('Common.cancelBtn')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import MyMixins from "./PublicMethods.js";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    const vm = window.vm;
    return {
      vm:vm,
      result: {
        lineNum: 5,
        minValid: "",
        maxValid: "",
      },
    };
  },
  mixins: [MyMixins],

  methods: {
    closeRetrieval(type) {
      if (type === 1) {
        let minSpeed = parseInt(this.result.minSpeed);
        let maxSpeed = parseInt(this.result.maxSpeed);
        let minValid = parseInt(this.result.minValid);
        let maxValid = parseInt(this.result.maxValid);
        // let startTime = this.startTime.selectedDates[0].valueOf();
        // let endTime = this.endTime.selectedDates[0].valueOf();
        let startTime = this.startTime
        let endTime = this.endTime
        if (endTime <= startTime) {
          this.$pop(vm.$t('Common.popTimeText'));//结束时间必须大于开始时间
          return;
        }
        if (
          typeof maxSpeed === "number" &&
          typeof minSpeed === "number" &&
          maxSpeed <= minSpeed
        ) {
          this.$pop(vm.$t('Common.popSpeedText'));//最大转速必须大于最小转速
          return;
        }
        if (
          typeof minValid === "number" &&
          typeof maxValid === "number" &&
          maxValid <= minValid
        ) {
          this.$pop(vm.$t('Common.popFreqBandText'));//最大有效频段必须大于最小有效频段
          return;
        }
        this.$store.commit("changeSrcParams", {
          time: {
            start: startTime,
            end: endTime,
            val: this.dateType.val,
          },
          speed: {
            min: minSpeed,
            max: maxSpeed,
          },
        });
        this.result.startTime = startTime;
        this.result.endTime = endTime;
        this.resolve(this.result);
      }
      this.isShow = false;
      this.remove();
      this.resolve(false);
    },
    /* 初始化 */
    initParams(params) {
      if (params.lineNum) {
        this.result.lineNum = params.lineNum;
      }
      if (params.minValid) {
        this.result.minValid = params.minValid;
      }
      if (params.maxValid) {
        this.result.maxValid = params.maxValid;
      }
    },
  },
};
</script>
<style scoped lang='scss'>
</style>
