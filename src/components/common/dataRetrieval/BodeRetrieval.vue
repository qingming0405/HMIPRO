<!-- 伯德图 -->
<template>
  <div class='data-retrieval-bg'>
    <div class='data-retrieval-box big-box radius box-shadow'>
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
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
      <!-- 特征值 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>特征值</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeEigenvalue
        >
          {{eigenvalue.name}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 操作按钮 -->
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
import MyMixins from './PublicMethods.js'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      eigenvalue: {},
      eigenvalueData: [],
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
    initParams() {
      const msg = this.viewMsg
      this.eigenvalueData = msg.eigenvalueData
      this.eigenvalue = msg.eigenvalue
    },
  },
}
</script>
<style scoped lang='scss'>
</style>
