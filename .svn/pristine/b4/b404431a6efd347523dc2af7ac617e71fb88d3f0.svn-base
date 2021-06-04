<template>
  <div class="box-shadow">
    <div
      class="alarm-content"
      v-for="(item,idx) in paramsData"
    >
      <div class="my-alarm">
        <table class='my-alarm-table'>
          <thead class='alarm-thead my-table-thead'>
            <tr>
              <th v-for="headitem in item.head">{{headitem}}</th>
            </tr>
          </thead>
          <tbody
            class="my-table-tbody"
            @scroll="scrollRequest($event, idx)"
          >
            <tr v-for="bodyitem in item.body">
              <td v-for="(el,idx) in bodyitem">
                <div
                  v-if="idx !== 'posName' && idx !== 'time'"
                  class="state-item"
                >
                  <div :class="['state',Number(el) == 1?'state-alarm':'']"></div>
                </div>
                <div v-else>{{el}}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class='search-data'>
        <button @click="dataRetrieval">数据检索</button>
        <button>导出数据</button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { cloneObj, getCodeObj, getTime } from 'utils/utils.js'
export default {
  name: 'alarm1',
  data() {
    return {
      paramsData: {},
      currentKey: '',
      requestData: {},
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'alarm1',
    })
  },
  watch: {
    '$store.state.alarm1Msg': {
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
      if (type === 0) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
      } else if (type === 1) {
        pos = this.paramsData[key].pos
      }
      if (type === 0 || type === 1) {
        this.currentKey = key
        for (let k in this.paramsData) {
          this.paramsData[k].isShow = false
        }
        const params = this.$store.state.srcParams
        const time = params.time
        this.requestData = {
          pos: {
            startTime: time.start,
            endTime: time.end,
            machineId: pos.machine_id,
            positionId: pos.pos_id,
            positionType: pos.pos_type,
            pageNum: 1,
            num: 100,
            t_root: pos.t_root,
            type: [1, 3],
          },
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.paramsData, key, {
            isShow: true,
            pos,
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: `无数据`,
            },
            head: [
              '测点名称',
              '时间',
              '高高报',
              '高报',
              '通频值偏差',
              '1X偏差',
              '2X偏差',
              '5X偏差',
              '可选X偏差',
              '残余量偏差',
            ],
            body: [],
            page: {
              currentPage: 1 /* 当前页 */,
              pageCount: Number.MAX_VALUE /* 总页数 */,
              pageNum: 100 /* 每页显示行数 */,
            },
            scrollTop: 0 /* 滚动条距离表头距离 */,
          })
          this.getData(-2)
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.paramsData, key)
          break
      }
    },
    getData(type) {
      const rd = this.requestData.pos
      this.$getApi.getPositionAlarmInfo(rd).then((res) => {
        if (res) {
          if (res.list && res.list.length > 0) {
            this.setData(res, type)
          }
        }
      })
    },
    setData(res, type) {
      let body = []
      const params = this.paramsData[this.currentKey]
      params.page.pageCount !== res.totalPage &&
        (params.page.pageCount = res.totalPage)
      res.list.forEach((element) => {
        let num_2 = element.lmjc.toString(2).toString()
        let num2_Array = num_2.split('')
        if (num2_Array.length < 8) {
          num2_Array.unshift(0)
        }
        const filed = ['Hh', 'H', 'direc', 'pc1X', 'pc2X', 'pc05X', 'XX', 'rv']
        let item = {}
        item.posName = params.pos.pos_name
        item.time = getTime(element.time)
        for (let i = 0; i < 8; i++) {
          item[filed[i]] = num2_Array[i]
        }
        body.push(item)
      })
      if (type === -2) {
        /* 第一次请求 */
        params.body = body
      } else if (type === -3) {
        /* 滚动请求 */
        params.body = params.body.concat(body)
      }
    },
    dataRetrieval() {
      const viewMsg = {
        type: 'pos',
      }
      this.$retrieval({
        key: 'alarm',
        viewMsg,
      }).then((res) => {
        if (res) {
          this.paramsData[this.currentKey].scrollTop = 0
          const msg = res.msg
          const rd = this.requestData.pos
          rd.startTime = res.startTime
          rd.endTime = res.endTime
          this.getData(rd)
        }
      })
    },
    // 滚动请求
    scrollRequest(e, key) {
      const tag = e.target
      const data = this.paramsData[key]
      // /* 横向滚动，title 随着动 */
      // let title = document.getElementsByClassName(`${key}-tr`)[0]
      // title.style.left = -1 * tag.scrollLeft + 'px'
      const hh = tag.scrollHeight /* 总高度 */
      const tt = tag.scrollTop /* 滚动条到最上面距离 */
      const ww = tag.offsetHeight /* 可视区域高度 */
      let pageMsg = this.paramsData[key].page
      if (
        tt > data.scrollTop &&
        ww + tt + 10 >= hh &&
        pageMsg.currentPage < pageMsg.pageCount
      ) {
        data.scrollTop = tt
        pageMsg.currentPage++
        this.requestData.pos.page = pageMsg.currentPage
        this.getData(-3)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/css/chartsStyle.scss';
.alarm-content {
  height: 100%;
  width: 100%;
  .my-alarm {
    height: calc(100% - 49px);
    width: 100%;
    .my-alarm-table {
      height: 100%;
      .my-table-thead {
        height: 40px;
        tr {
          height: 40px;
        }
      }
      .my-table-tbody {
        height: calc(100% - 40px);
        tr {
          height: 30px;
          td {
            text-align: center;
            .state-item {
              width: 100%;
              display: flex;
              justify-content: center;
              .state {
                width: 8px !important;
                height: 8px !important;
                border-radius: 50%;
                background: #009944;
              }
              .state-alarm {
                background: #f80000;
              }
            }
          }
        }
      }
    }
  }
}
</style>