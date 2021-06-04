<!-- 机舱轨迹图 -->
<template>
  <div
    class='data-retrieval-bg'
    v-show='isShow'
  >
    <div class='data-retrieval-box big-box radius box-shadow'>
      <!-- 头部标题 -->
      <div class="data-retrieval-title">
        <span>数据检索</span>
        <div
          class='close-retrieval'
          @click='closeRetrieval(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>时间</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeTimeType
        >
          {{dateType.val}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 开始时间 -->
      <div class='select-time'>
        <div class='select-title time-title'>开始时间</div>
        <!-- <input class='retrieval-start-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
      <div class='select-time'>
        <div class='select-title time-title'>结束时间</div>
        <!-- <input class='retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
      <div class='set-speed'>
        <div class='select-title speed-title'>转速区间</div>
        <input
          type="number"
          class='input-value radius outside-border edge-outside-border'
          v-model='result.minSpeed'
        >
        <div class='speed-bar'>
          <div></div>
        </div>
        <input
          type="number"
          class='input-value radius outside-border edge-outside-border'
          v-model='result.maxSpeed'
        >
      </div>
      <!-- 趋势图上限过滤 -->
      <div class='set-limit'>
        <div class='select-title limit-title'>上限过滤</div>
        <input
          type="number"
          class='limit-value input-value radius text-overflow select-none outside-border edge-outside-border'
          v-model='result.upper'
        >
      </div>
      <!-- 趋势图下限过滤 -->
      <div class='set-limit'>
        <div class='select-title limit-title'>下限过滤</div>
        <input
          type="number"
          class='limit-value input-value radius text-overflow select-none outside-border edge-outside-border'
          v-model='result.lower'
        >
      </div>
      <!-- 选择查询密度 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>查询密度</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeDensityType
        >
          {{density.val}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <div class='data-retrieval-btn'>
        <button @click='reset'>重置</button>
        <button @click='closeRetrieval(1)'>确定</button>
        <button
          class='disable-btn'
          @click='closeRetrieval(0)'
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import MyMixins from './PublicMethods.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {}
  },
  mixins: [MyMixins],
  computed: {},
  watch: {},
  methods: {
    // 初始化数据
    initParams() {},
  },
}
</script>
<style scoped lang='scss'>
</style>
