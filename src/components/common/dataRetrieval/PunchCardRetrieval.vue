<!-- 倾角分布图、沉降跟踪图 -->
<template>
  <div
    class="data-retrieval-bg"
    v-show="isShow"
  >
    <div class="data-retrieval-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class="close-retrieval"
          @click="closeRetrieval(0)"
        >
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div
        class="select-date-type"
        v-show="false"
      >
        <div class="select-title date-type-title">{{vm.$t('Common.time')}}</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeTimeType"
        >
          {{ dateType.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
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
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 结束时间 -->
      <div
        class='select-time'
        v-show="false"
      >
        <div class='select-title time-title'>{{vm.$t('Common.endTime')}}</div>
        <!-- <input class='retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
        <el-date-picker
          v-model="endTime"
          type="datetime"
          :placeholder="vm.$t('Common.placeholderTime')"
          value-format="timestamp"
          :clearable='false'
        >
        </el-date-picker>
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
        <button @click="reset">{{vm.$t('Common.resetBtn')}}</button>
        <button @click="closeRetrieval(1)">{{vm.$t('Common.sureBtn')}}</button>
        <button
          class="disable-btn"
          @click="closeRetrieval(0)"
        >{{vm.$t('Common.cancelBtn')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { LatheGeometry } from 'three'
// import 《组件名称》 from '《组件路径》';

import MyMixins from './PublicMethods.js'

export default {
  data() {
    const vm = window.vm;
    return {
      vm:vm,
    }
  },
  mixins: [MyMixins],
  methods: {
    initParams(params) {
      this.result.startTime = params.startTime
    },
    closeRetrieval(type = 1) {
      if (type === 1) {
        let density = this.result.density
        this.$store.commit('changeSrcParams', {
          density: density,
        })
        // let startTime = this.startTime.selectedDates[0].valueOf()
        let startTime = this.startTime
        this.result.startTime = startTime
        this.resolve(this.result)
      }
      this.isShow = false
      this.remove()
      this.resolve(false)
    },
  },
}
</script>
<style scoped lang="scss"></style>
