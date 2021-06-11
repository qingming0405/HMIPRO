<template>
  <div
    class='data-retrieval-bg pop-bg'
    v-show='isShow'
  >
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
      <!-- 选择时间类型 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>{{vm.$t('Common.time')}}</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border'
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
      <!-- 选择查询密度 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>{{vm.$t('Common.queryDensityBtn')}}</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeDensityType
        >
          {{density.val}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 转速区间 -->
      <div
        class='set-speed'
        v-show="viewMsg.type == 'multiSpectrum'"
      >
        <div class='select-title speed-title'>{{vm.$t('Common.speedRange')}}</div>
        <input
          type="number"
          class='input-value radius outside-border'
          v-model='result.minSpeed'
        >
        <div class='speed-bar'>
          <div></div>
        </div>
        <input
          type="number"
          class='input-value radius outside-border'
          v-model='result.maxSpeed'
        >
      </div>
      <!-- 数据类型选择 -->
      <div class='check-eigenvalue-box'>
        <div class='select-title check-eigenvalue-title'></div>
        <ul class='check-eigenvalue radius select-none'>
          <li
            v-for='(item, index) in viewMsg.dataType'
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
// import 《组件名称》 from '《组件路径》';
import MyMixins from './PublicMethods.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    const vm = window.vm;
    return {
      vm:vm,
      dataType: [],
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
  computed: {},
  watch: {},
  methods: {
    // 初始化数据
    initParams() {
      this.dataType = this.viewMsg.dataType
    },
  },
}
</script>
