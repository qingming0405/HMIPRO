<template>
  <div class="my-history-table ">
    <div
      class="my-history"
      v-for="(data, key) in paramsData"
      :key="key"
      v-show="data.isShow"
    >
      <div class="table-box">
        <table
          class="history-table table-1 scroll-style-edge box-shadow"
          ref="historyTable"
        >
          <thead
            class="history-thead my-table-thead"
            ref="historyHead"
          >
            <tr
              class="my-table-tr"
              :ref="`${key}-tr`"
            >
              <th
                v-for="(title, idx) in data.head"
                :key="idx"
                :title="title.val"
                class="text-overflow"
                v-show="title.isShow"
              >
                {{ title.val }}
              </th>
            </tr>
          </thead>
          <tbody
            class="history-tbody my-table-tbody pro-scrollbar"
            @scroll="scrollRequest($event, key)"
            ref="historyBody"
            v-show="data.body.length > 0"
          >
            <tr
              class="my-table-tr"
              v-for="(body, id) in data.body"
              :key="id"
            >
              <td
                v-for="(item, i) in body"
                :key="i"
                v-show="data.head[i].isShow"
                class="text-overflow"
                :title="item.val"
              >
                {{ item.val }}
              </td>
            </tr>
          </tbody>
        </table>
        <s-s-index
          v-show="data.timeData.length > 0"
          class="table-2"
          :data-list="data.timeData"
          @ss-select="ssSelect"
        />
      </div>
      <div
        class="none-data-box select-none radius"
        v-show="data.empty.isShow"
      >
        <span>{{ data.empty.text }}</span>
      </div>
    </div>
    <div class="search-data">
      <button @click="dataRetrieval">数据检索</button>
      <a
        href=""
        ref="exportData"
      ></a>
    </div>
  </div>
</template>
<script>
import { cloneObj, setHead, getTime, round } from 'utils/utils.js'
import SSIndex from 'common/startStop/SSIndex.vue'
export default {
  name: 'startStop',
  components: { SSIndex },
  data() {
    return {
      paramsData: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'startStop',
    })
  },
  watch: {
    '$store.state.startStopMsg': {
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
      if (typeof key !== 'string') return
      const [, , mId, id, pType] = key.split('_')
      let pos = null
      if (type === 0 || type === 1) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
        this.currentKey = key
        for (let k in this.paramsData) {
          this.paramsData[k].isShow = false
        }
      } else {
        pos = this.paramsData[key].pos
      }
      const params = this.$store.state.srcParams
      const time = params.time
      const speed = params.speed
      const density = params.density /* 趋势数据查询密度 */
      this.requestData = {
        time: { pos_id: pos.pos_id, startTime: time.start, endTime: time.end },
        data: {
          machineId: mId,
          positionId: id,
          positionType: pType,
          type: 0,
          t_root: pos.t_root,
          density: Number(density.type),
          toSpeed: speed.max,
          fromSpeed: speed.min,
          startTime: null,
          endTime: null,
          dgmType: pos.dgm_type,
          dataType: [2],
          page: -1,
          pageNum: -1,
        },
      }
      switch (type) {
        case 0 /* 打开图表 */:
          const head1 = setHead(
            this.$store.state.checkMsg.tree.t_root,
            pos.dgm_type,
            pType,
            pos.pos_loc
          )
          const head = [
            {
              isShow: true,
              val: '测点',
              filed: false,
            },
          ].concat(head1)
          this.$set(this.paramsData, key, {
            isShow: true,
            pos,
            posName: pos.position_name,
            head: head,
            body: [],
            timeData: [],
            chooseTime: {},
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: `无数据`,
            },
          })
          this.getTimeData(this.requestData.time)
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          /* 将表头 位置置0 */
          let title = this.$refs[`${key}-tr`][0]
          title.style.left = '0px'
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.paramsData, key)
          break
      }
    },
    getData(requestData) {
      this.$getApi.getSaveData(requestData).then((res) => {
        if (res) {
          if (res.list.length > 0) {
            this.setData(res)
            this.paramsData[this.currentKey].empty.isShow = false
          } else {
            this.$pop('无启停数据！')
          }
        }
      })
    },
    setData(res) {
      const params = this.paramsData[this.currentKey]
      const pos = params.pos
      const head = params.head
      let body = []
      for (let i = 0, l = res.list.length; i < l; i++) {
        const list = res.list[i]
        body[i] = [
          {
            isShow: true,
            val: pos.position_name,
          },
        ]
        for (let j = 1; j < head.length; j++) {
          let value = head[j]
          let v = list[value.filed.toLowerCase()]
          if (value.filed === 'time') {
            body[i].push({
              isShow: value.isShow,
              val: getTime(list[value.filed]),
            })
          } else if (v || v === 0) {
            let val
            if (v >= 100000000) {
              val = '无数据'
            } else {
              val = round(v, 4)
            }
            body[i].push({
              isShow: value.isShow,
              val,
            })
          } else {
            body[i].push({
              isShow: value.isShow,
              val: '无数据',
            })
          }
        }
      }
      params.body = body
    },
    ssSelect(item) {
      const requestData = this.requestData.data
      requestData.startTime = item.startTime
      requestData.endTime = item.stopTime
      this.getData(this.requestData.data)
    },
    dataRetrieval() {
      const data = this.paramsData[this.currentKey]
      const eigenvalue = data.head.slice(2)
      this.$retrieval({
        key: 'startStop',
        viewMsg: {
          pos: data.pos,
          eigenvalue,
        },
      }).then((res) => {
        if (res) {
          let requestData = this.requestData
          requestData.time.startTime = res.startTime
          requestData.time.endTime = res.endTime
          this.getTimeData(requestData.time)
          if (requestData.data.startTime !== null) {
            this.getData(requestData.data)
          }
        }
      })
    },
    getTimeData(requestData) {
      const params = this.paramsData[this.currentKey]
      this.$getApi.getOnOffIndex(requestData).then((res) => {
        if (res) {
          params.timeData = []
          if (res.list.length > 0) {
            params.timeData = res.list
            this.paramsData[this.currentKey].empty.isShow = false
            this.ssSelect(params.timeData[0]) //默认选中第一个
          }
        }
      })
    },
    // 滚动请求
    scrollRequest(e, key) {
      const tag = e.target
      /* 横向滚动，title 随着动 */
      let title = this.$refs[`${key}-tr`][0]
      title.style.left = -1 * tag.scrollLeft + 'px'
    },
  },
}
</script>
<style scoped lang="scss">
.my-history-table {
  position: relative;
  .my-history {
    width: 100%;
    height: calc(100% - 50px);
    .table-box {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      position: relative;
      .table-1 {
        width: 100%;
      }
      .table-2 {
        width: calc(28% - 20px);
        margin-left: 20px;
      }
    }
    .history-table {
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
          &:first-child {
            width: 150px;
          }
          &:nth-child(2) {
            width: 180px;
          }
        }
      }
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin: 0px 10px;
    }
    input {
      padding-left: 10px;
    }
  }
}
</style>