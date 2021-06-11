<!-- 三维频谱图 -->
<template>
  <div
    class="data-retrieval-bg pop-bg"
    v-show="isShow"
  >
    <div class="data-retrieval-box big-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <!--  数据检索标题-->
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class="close-retrieval"
          @click="closeRetrieval(0)"
        >
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
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
      <div class="select-date-type">
        <!-- 上下行 -->
        <div class="select-title date-type-title">{{vm.$t('Common.upDownPath')}}</div>
        <div class="select-value date-type-name radius text-overflow select-none outside-border">
          {{ result.params1 }}
        </div>
      </div>
      <div class="select-date-type">
        <!-- 轨道 -->
        <div class="select-title date-type-title">{{vm.$t('Common.track')}}</div>
        <div class="select-value date-type-name radius text-overflow select-none outside-border">
          {{ result.params2 }}
        </div>
      </div>
      <div class="select-date-type">
        <!-- 线路 -->
        <div class="select-title date-type-title">{{vm.$t('Common.line')}}</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border"
          @click.stop="setRoute"
        >
          {{ result.route.name }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <div class="set-speed">
        <!-- 起始站点 -->
        <div class="select-title speed-title">{{vm.$t('Common.startStop')}}</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border"
          @click.stop="setStation('start', $event)"
        >
          {{ result.startStation.name }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>

        <div class="speed-bar">
          <div></div>
        </div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border"
          @click.stop="setStation('end', $event)"
        >
          {{ result.terminal.name }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
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
// import 《组件名称》 from '《组件路径》';
import PublicMethods from './PublicMethods.js'

export default {
  name: 'TmsTrendRetrieval',
  // import引入的组件需要注入到对象中才能使用
  data() {
    const vm = window.vm;
    return {
      vm:vm,
      result: {
        posName: '',
        startStation: {
          //开始站点
          name: '',
          index: null,
          station_id: null,
        },
        terminal: {
          //结束站点
          name: '',
          index: null,
          station_id: null,
        },
        params1: vm.$t('Common.upPath'),//'上行'
        params2: vm.$t('Common.rightTrack'),//'右轨',
        route: {
          name: '',
          index: 0,
        },
        lineInfo: null,
        lineStation: [],
      },
    }
  },
  mixins: [PublicMethods],
  methods: {
    /* 初始化 */
    initParams(params) {
      this.result.route = params.route
      this.result.lineInfo = params.lineInfo
      this.result.lineStation = params.lineInfo[params.route.index]
      if (params.params1) {
        this.result.params1 = params.params1
      }
      if (params.params2) {
        this.result.params2 = params.params2
      }
      /* 开始结束站点 */
      if (params.startStation === undefined || params.terminal === undefined) {
        this.initStation()
      } else {
        this.result.startStation = params.startStation
        this.result.terminal = params.terminal
      }
      // 站点信息放入
    },
    /* 选择路线来确定站点 */
    setRoute(e) {
      let text = []
      this.result.lineInfo.forEach((item, index) => {
        text.push({ index, val: vm.$t('Common.line') + (index + 1) })//线路
      })
      const size = e.currentTarget.getBoundingClientRect()
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
      }).then((res) => {
        if (res.item) {
          this.result.route = res.item
          this.result.route.name = res.item.val
          this.result.lineStation = this.result.lineInfo[res.item.index]
          /* 初始化开始和结束站点 */
          this.initStation()
        }
      })
    },
    /* 初始化站点 ,默认第一站和第二站*/
    initStation() {
      this.result.startStation = {
        name: this.result.lineStation[0].station_name,
        index: 0,
        station_id: this.result.lineStation[0].station_id,
      }
      this.result.terminal = {
        name: this.result.lineStation[this.result.lineStation.length - 1]
          .station_name,
        index: 1,
        station_id: this.result.lineStation[this.result.lineStation.length - 1]
          .station_id,
      }
    },
    /* 选择站点 */
    setStation(f, e) {
      let text = []
      this.result.lineStation.forEach((item, index) => {
        text.push({
          index,
          val: item.station_name,
          station_id: item.station_id,
        })
      })
      const size = e.currentTarget.getBoundingClientRect()
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
      }).then((res) => {
        if (res.item) {
          if (f === 'start') {
            // 起始站
            this.result.startStation.name = res.item.val
            this.result.startStation.index = res.item.index
            this.result.startStation.station_id = res.item.station_id
          } else if (f === 'end') {
            // 终点站
            this.result.terminal.name = res.item.val
            this.result.terminal.index = res.item.index
            this.result.terminal.station_id = res.item.station_id
          }
          /* 上下行 */
          if (this.result.startStation.index < this.result.terminal.index) {
            this.result.params1 = vm.$t('Common.upPath')//'上行'
          } else {
            this.result.params1 = vm.$t('Common.downPath')//'下行'
          }
        }
      })
    },
    /* 设置参数12 上下行，轨道  */
    setParams() {
      if (this.result.startStation.index > this.result.terminal.index) {
      }
    },
  },
}
</script>
<style scoped lang="scss">
.data-retrieval-box {
}
</style>
