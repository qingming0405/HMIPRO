<template>
  <div>
    <div class="content-edge center my-realAlarm-table">
      <table
        class="history-table scroll-style-edge"
        ref="historyTable"
      >
        <thead class="history-thead my-table-thead">
          <tr class="my-table-tr">
            <!--  -->
            <th
              v-for="(title, idx) in head"
              :title="title"
              class="text-overflow"
            >
              {{ title }}
            </th>
          </tr>
        </thead>
        <tbody
          class="history-tbody my-table-tbody pro-scrollbar"
          ref="historyBody"
        >
          <tr
            class="my-table-tr"
            v-for="(body, id) in realAlarm"
            :key="id"
            :class="body.status != '—' ? body.status== '报警' ? 'alarm-text':'warning-text':''"
            @dblclick="toWave(body)"
          >
            <td>{{body.num}}</td>
            <td>{{body.tree_name}}</td>
            <td>{{body.mac_name}}</td>
            <td>{{body.pos_name}}</td>
            <td>{{body.saveTime_Com}}</td>
            <td>{{body.status}}</td>
            <td>{{body.value}}</td>
            <td>{{body.hh_limit}}</td>
            <td>{{body.h_limit}}</td>
            <td>{{body.l_limit}}</td>
            <td>{{body.ll_limit}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { getTime, round, cloneObj, matchRule } from 'utils/utils.js'
export default {
  data() {
    const vm = window.vm;
    return {
      vm: vm,
      realAlarm: {},
      head: [
        vm.$t('Common.order'),//'序号',
        vm.$t('Common.treeName'),//'组织名称',
        vm.$t('realAlarm.EquipName'),//'设备名称',
        vm.$t('Common.posName'),//'测点名称',
        vm.$t('Common.time'),//'时间',
        vm.$t('Alarm.AlarmType'),//'报警类型',
        vm.$t('Alarm.AlarmValue'),//'报警值',
        vm.$t('Alarm.Alarmh'),//'报警(高)',
        vm.$t('Alarm.Warnh'),//'预警(高)',
        vm.$t('Alarm.Warnl'),//'预警(低)',
        vm.$t('Alarm.Alarml'),//'报警(低)',
      ],
    }
  },
  watch: {
    '$store.state.realAlarmMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
    '$store.state.realAlarm': {
      handler(value) {
        if (value) {
          this.setRealAlarmData(value)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    openChartList(type) {
      switch (type) {
        case 0 /* 打开图表 */:
          // this.setRealAlarmData(this.realAlarm)
          break
        case 1 /* 切换图表 */:
          // this.setRealAlarmData(this.realAlarm)
          break
        case 2 /* 关闭图表 */:
          break
        case 4 /* 图表跳转图谱 */:
          // this.setRealAlarmData(this.realAlarm)
          break
      }
    },
    setRealAlarmData(alarm) {
      let alarmData = []
      let n = 0
      for (let k in alarm) {
        n++
        let el = {}
        el.num = n
        el.key = alarm[k].key
        el.t_id = alarm[k].t_id
        el.tree_name = alarm[k].tree_name
        el.mac_name = alarm[k].mac_name
        el.pos_name = alarm[k].pos_name
        el.status = alarm[k].alarm_status
          ? alarm[k].alarm_status == 3
            ? this.$t('realAlarm.Alarm')//'报警'
            : this.$t('realAlarm.warn')//'预警'
          : '—'
        el.h_limit = alarm[k].h_limit ? alarm[k].h_limit : '—'
        el.hh_limit = alarm[k].hh_limit ? alarm[k].hh_limit : '—'
        el.l_limit = alarm[k].l_limit ? alarm[k].l_limit : '—'
        el.ll_limit = alarm[k].ll_limit ? alarm[k].ll_limit : '—'
        el.value = alarm[k].value ? round(alarm[k].value, 4) : '—'
        if (alarm[k].baseInfo && alarm[k].baseInfo.baseInfo) {
          let info = alarm[k].baseInfo.baseInfo
          el.saveTime_Com = info.saveTime_Com
            ? getTime(info.saveTime_Com)
            : this.$t('Common.noDataText')//'无数据'
        }
        alarmData.push(el)
      }
      // let compare = function (obj1, obj2) {
      //   let [, type1, id1] = obj1.key.split('_')
      //   let [, type2, id2] = obj2.key.split('_')
      //   let val1 = type1 + '_' + id1
      //   let val2 = type2 + '_' + id2
      //   if (val1 < val2) {
      //     return -1
      //   } else if (val1 > val2) {
      //     return 1
      //   } else {
      //     return 0
      //   }
      // }
      // alarmData.sort(compare)
      this.realAlarm = alarmData
    },
    // 双击进入实时数据的波形图
    toWave(item) {
      let treeArray = this.$store.state.tree
      let [mac_id, position_type, position_id] = item.key.split('_')
      // 匹配tree
      if (this.$store.state.checkMsg.tree.t_id != item.t_id) {
        treeArray.forEach((element) => {
          if (element.t_id == item.t_id) {
            item.t_root = element.t_root
            this.$store.commit('getCheckMsg', {
              msg: cloneObj(element),
              type: 'tree',
            })
            return
          }
        })
      }
      let matchInfo = {
        mac_id,
        position_type,
        position_id,
      }
      this.matchMacOrPos('mac', item, matchInfo)
    },
    // 匹配机组、测点
    /* 
    type：mac/pos，匹配机组还是测点
    item：选中报警数据
    matchInfo：选中数据机组id，测点id，测点类型
    */
    matchMacOrPos(type, item, matchInfo) {
      if (type == 'mac') {
        if (this.$store.state.mac[item.t_id]) {
          let macArray = this.$store.state.mac[item.t_id]
          macArray.forEach((element) => {
            if (element.mac_id == matchInfo.mac_id) {
              this.$store.commit('getCheckMsg', {
                msg: cloneObj(element),
                type: 'mac',
              })
              return
            }
          })
          this.matchMacOrPos('pos', item, matchInfo)
        } else {
          setTimeout(() => {
            this.matchMacOrPos('mac', item, matchInfo)
          }, 200)
        }
      } else if (type == 'pos') {
        if (this.$store.state.pos[matchInfo.mac_id]) {
          let posArray = this.$store.state.pos[matchInfo.mac_id]
          posArray.forEach((element) => {
            if (
              element.position_id == matchInfo.position_id &&
              element.position_type == matchInfo.position_type
            ) {
              this.$store.commit('getCheckMsg', {
                msg: cloneObj(element),
                type: 'pos',
              })
              if (
                matchRule(
                  element.position_type,
                  'wave',
                  element.dgm_type,
                  element.t_root,
                  element
                )
              ) {
                this.$store.commit('setCurrentTime', 0)
                let key = `wave_pos_${matchInfo.mac_id}_${matchInfo.position_id}_${matchInfo.position_type}`
                let params = {
                  key,
                  name: 'wave',
                  val: this.$t('Common.Wave'),//'波形频谱图',
                  icon: 'icon-boxing_huaban',
                }
                this.$bus.$emit('getPath', params)
                return
              } else {
                this.$pop(this.$t('Common.noPosChartTips'))//该测点没有此图谱
              }
            }
          })
        } else {
          setTimeout(() => {
            this.matchMacOrPos('pos', item, matchInfo)
          }, 200)
        }
      }
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'realAlarm',
    })
  },
}
</script>
<style scoped lang="scss">
.history-table {
  width: 100%;
  height: 100%;
  overflow: auto;
  .history-thead {
    tr {
      position: relative;
      height: 40px;
      line-height: 40px;
      th {
        height: 40px;
        line-height: 40px;
        user-select: none;
        text-align: center;
      }
    }
  }
  .history-tbody {
    height: calc(100% - 40px);
    .my-table-tr {
      display: table;
      height: 30px !important;
      cursor: pointer;
      td {
        text-align: center;
        height: 30px;
        user-select: none;
      }
    }
  }
  .my-table-tr {
    td,
    th {
      width: 100px;
      &:nth-child(1) {
        width: 40px;
      }
      &:nth-child(5) {
        width: 180px;
      }
    }
  }
}
</style>