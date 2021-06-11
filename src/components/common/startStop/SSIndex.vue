<template>
  <div class="ss-index box-shadow">
    <table class="time-table scroll-style-edge">
      <thead class="my-table-thead">
        <tr class="my-table-tr">
          <!-- 状态 -->
          <th>{{$t('Common.state')}}</th>
          <!-- 开始时间 -->
          <th>{{$t('Common.startTime')}}</th>
          <!-- 结束时间 -->
          <th>{{$t('Common.endTime')}}</th>
        </tr>
      </thead>
      <tbody class="my-table-tbody pro-scrollbar">
        <tr
          v-for="(item, index) in dataList"
          :key="index"
          :class="['my-table-tr',currIndex === index ? 'my-table-tr-a' : '']"
          @dblclick="trDblClick(item, index)"
        >
          <td>{{typeStr(Number(item.type))}}</td>
          <td>{{getTime(item.startTime)}}</td>
          <td v-if="Number(item.type)!==9">{{getTime(item.stopTime)}}</td>
          <!-- 至今 -->
          <td v-else>{{$t('Common.toToday')}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getTime } from 'utils/utils.js'
export default {
  name: 'SSIndex',
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currIndex: -1,
    }
  },
  methods: {
    typeStr(type) {
      switch (type) {
        case 0:
          return this.$t('SSindex.startBtn')//'启'
        case 1:
          return this.$t('SSindex.stopBtn')//'停'
        case 2:
          return this.$t('SSindex.onOffBtn')//'启停'
        case 3:
          return this.$t('SSindex.onOffBtn')//'启停'
        case 9:
          return this.$t('SSindex.onOffingBtn')//'启停中'
      }
    },
    getTime(time) {
      return getTime(time)
    },
    // 事件
    trDblClick(item, index) {
      this.currIndex = index
      this.$emit('ss-select', item)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/css/chartsStyle.scss';
.ss-index {
  height: 100%;
  .time-table {
    height: 100%;
  }
}
</style>