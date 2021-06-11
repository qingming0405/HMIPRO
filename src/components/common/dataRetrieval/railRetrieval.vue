<template>
  <div
    class='data-retrieval-bg pop-bg'
    v-show='isShow'
  >
    <div class='data-retrieval-box radius box-shadow'>
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown=moveDiv
        @mouseup=moveDivUp
      >
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class='close-retrieval'
          @click='closeRetrieval(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </div>
      </div>
      <!-- 显示机组（列车） -->
      <div class='select-box'>
        <div class='select-title msg-title'>{{vm.$t('Common.train')}}</div>
        <div class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border'>
          {{viewMsg.macName}}
        </div>
      </div>
      <!-- 测点选择 -->
      <div class='select-box'>
        <div class='select-title msg-title'>{{vm.$t('Common.pos')}}</div>
        <div class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border'>
          {{viewMsg.name}}
        </div>
      </div>
      <!-- 选择时间类型 -->
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
  mixins: [MyMixins],
  props: {
    viewMsg: {
      type: Object,
      default() {
        const vm = window.vm;
        return {
          vm:vm,
        }
      },
    },
  },
  methods: {
    initParams() {
      const msg = this.viewMsg
      const typeObj = {
        pos: '测点',
        mac: '机组',
        tree: '测点',
      }
      this.msgTitle = typeObj[msg.type]
      // if(this.result.msg === null || this.result.msg === undefined)  this.result.msg = this.$store.state.checkMsg.mac;
    },
  },
}
</script>
