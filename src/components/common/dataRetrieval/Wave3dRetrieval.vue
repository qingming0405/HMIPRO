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
        <span>数据检索</span>
        <div class="close-retrieval" @click="closeRetrieval(0)">
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">时间</div>
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
        <div class="select-title time-title">开始时间</div>
        <!-- <input
          class="retrieval-start-time time-value input-value radius text-overflow select-none outside-border"
        /> -->
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
        <!-- <input
          class="retrieval-end-time time-value input-value radius text-overflow select-none outside-border"
        /> -->
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
      <!-- 转速区间 -->
      <div class="set-speed">
        <div class="select-title speed-title">转速区间</div>
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
        <div class="select-title speed-title">有效频段</div>
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
        <div class="select-title row-number-title">行数</div>
        <input
          type="number"
          class="input-value radius outside-border"
          v-model="result.lineNum"
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
      <div class="data-retrieval-btn">
        <button @click="reset">重置</button>
        <button @click="closeRetrieval(1)">确定</button>
        <button class="disable-btn" @click="closeRetrieval(0)">取消</button>
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
    return {
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
          this.$pop("结束时间必须大于开始时间");
          return;
        }
        if (
          typeof maxSpeed === "number" &&
          typeof minSpeed === "number" &&
          maxSpeed <= minSpeed
        ) {
          this.$pop("最大转速必须大于最小转速");
          return;
        }
        if (
          typeof minValid === "number" &&
          typeof maxValid === "number" &&
          maxValid <= minValid
        ) {
          this.$pop("最大有效频段必须大于最小有效频段");
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
