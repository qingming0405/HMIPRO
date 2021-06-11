<!-- 系统日志 -->
<template>
  <div class='data-retrieval-bg'>
    <div class='data-retrieval-box big-box radius box-shadow'>
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class='close-retrieval'
          @click='closeRetrieval(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </div>
      </div>
      <div class='select-date-type'>
        <div class='select-title date-type-title'>{{vm.$t('Common.time')}}</div>
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
        <div class='select-title time-title'>{{vm.$t('Common.startTime')}}</div>
        <!-- <input class='retrieval-start-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
      <div class='select-time'>
        <div class='select-title time-title'>{{vm.$t('Common.endTime')}}</div>
        <!-- <input class='retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
      <!-- 操作按钮 -->
      <div class='data-retrieval-btn'>
        <button @click='reset'>{{vm.$t('Common.resetBtn')}}</button>
        <button @click='closeRetrieval(1)'>{{vm.$t('Common.sureBtn')}}</button>
        <button
          class='disable-btn'
          @click='closeRetrieval(0)'
        >{{vm.$t('Common.cancelBtn')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import MyMixins from './PublicMethods.js'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  mixins: [MyMixins],
  data() {
    const vm = window.vm;
    return {
      vm:vm,
      macName: '',
      macId: '',
      machineOpition: [],
    }
  },
  methods: {
    initParams(params) {},
  },
}
</script>
<style scoped lang='scss'>
</style>
