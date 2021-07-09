<template>
<!-- 踏面寿命预估 -->
  <div>
    <div class="my-lifePredict-table">
      <table class="lifePredict-table scroll-style-edge">
        <thead
          class="lifePredict-thead my-table-thead"
          ref="lifePredictHead"
        >
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
        <tbody>
          <tr v-for="(item,index) in lifePredictData">
            <td
              :class="index%2 == 0?'oddColr1':'evenColor1'"
              style="border-bottom: 1px solid #979797;"
              :rowspan="item.posLen"
              colspan="1"
            >
              <div :style="'height:'+item.posLen*40+'px;width:100%;'">{{item.macName}}</div>
            </td>
            <td
              :rowspan="item.posLen"
              colspan="2"
            >
          <tr v-for="(pos,number) in item.pos">
            <td
              rowspan="1"
              colspan="1"
              :class="number%2 == 0?'oddColr1':'evenColor1'"
            >
              <div>{{pos.posName}}</div>
            </td>
            <td
              rowspan="1"
              colspan="1"
              :class="number%2 == 0?'oddColr1':'evenColor1'"
            >
              <div>{{pos.life}}</div>
            </td>
          </tr>
          </td>
          </tr>
        </tbody>

      </table>
      <div
        v-show="empty.isShow"
        class="none-data-box select-none radius"
      >
        <p>{{empty.text}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'lifePredict',
  data() {
    const vm = window.vm
    return {
      vm: vm,
      head: [vm.$t('lifePredict.carNum'), vm.$t('lifePredict.wheel'), vm.$t('lifePredict.EstimateRemainLife')+'(km)'],//'车号', '车轮', '预估剩余寿命(km)'
      empty: {
        text: '无预测数据',
        isShow: false,
      },
      posData: {},
      lifePredictData: [],
    }
  },
  watch: {
    '$store.state.lifePredictMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.key, item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    openChartList(key, type) {
      this.posData = {}
      this.lifePredictData = []
      switch (type) {
        case 0 /* 打开图表 */:
          this.getPosData()
          break
        case 1 /* 切换图表 */:
          this.getPosData()
          break
        case 2 /* 关闭图表 */:
          break
        case 4 /* 图表跳转图谱 */:
          this.getPosData()
          break
      }
    },
    // 获取测点数据
    getPosData() {
      this.$getApi.queryAllPosByType({ t_root: 2 }).then((res) => {
        if (res) {
          if (res.positions && res.positions.length > 0) {
            let marIdArray = [],
              carriageInfo = {}
            res.positions.forEach((pos) => {
              // 只需要包络阶次测点
              if (pos.position_type != 9) return
              if (marIdArray.indexOf(pos.machine_id) === -1) {
                marIdArray.push(pos.machine_id)
                this.$set(carriageInfo, pos.machine_id, {
                  mId: pos.machine_id,
                  macName: pos.mac_name,
                  data: [],
                  posLen: 0, //测点长度
                })
              }
              let data = carriageInfo[pos.machine_id].data
              data.push(pos)
              carriageInfo[pos.machine_id].posLen++
            })
            this.posData = carriageInfo
            this.getData()
          }
        }
      })
    },
    getData() {
      this.$getApi.getALLTreadResult().then((res) => {
        if (res) {
          if (Object.keys(res.data).length > 0) {
            this.empty.isShow = false
            this.setData(res.data)
          } else {
            this.empty.isShow = true
          }
        }
      })
    },
    setData(res) {
      const data = res
      let lifePredictData = []
      const posData = this.posData
      for (let k in posData) {
        let macName = posData[k].macName,
          macId = posData[k].macName.mId,
          posLen = posData[k].posLen
        let posArray = posData[k].data
        let lifePredict = {
          macId,
          macName,
          posLen,
          pos: [],
        }
        posArray.forEach((pos) => {
          let life = '无数据'
          if (data[`${k}_${pos.position_id}_${pos.position_type}`]) {
            life = data[`${k}_${pos.position_id}_${pos.position_type}`]
          }
          lifePredict.pos.push({
            life,
            posName:
              pos.tms_wheel !== null && pos.tms_wheel !== ''
                ? pos.tms_wheel
                : pos.channel_name,
          })
        })
        lifePredictData.push(lifePredict)
      }
      this.lifePredictData = lifePredictData
    },
  },
}
</script>
<style scoped lang="scss">
.my-lifePredict-table {
  position: relative;
  height: 100%;
  width: 100%;
  .lifePredict-table {
    width: 100%;
    height: 100%;
    overflow: hidden;
    table-layout: fixed;
    border-collapse: collapse;
    .lifePredict-thead {
      tr {
        position: relative;
        height: 40px;
        line-height: 40px;
        th {
          height: 40px;
          line-height: 40px;
          user-select: none;
          text-align: center;
          &:nth-child(1) {
            width: 40%;
          }
          &:nth-child(2) {
            width: 30%;
          }
          &:nth-child(3) {
            width: 30%;
          }
        }
      }
    }
    tbody {
      height: calc(100% - 42px);
      overflow-y: auto;
      border: 1px solid #979797;
      background: #092e55;
      width: 100%;
      table-layout: fixed;
      tr {
        width: 100%;
        table-layout: fixed;
        td {
          text-align: center;
          border-left: 1px solid #979797;
          background: #1b365d;
          div {
            height: 40px;
            line-height: 40px;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &:nth-child(1) {
            width: 40%;
          }
          &:nth-child(2) {
            width: 60%;
          }
          tr {
            td {
              &:nth-child(1) {
                width: 50%;
              }
              &:nth-child(2) {
                width: 50%;
              }
            }
          }
        }
        .oddColr1 {
          background: #0e3e70;
        }
        .evenColor1 {
          background: #092e55;
        }
      }
    }
  }
}
</style>