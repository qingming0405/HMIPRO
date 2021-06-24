<template>
  <div class="my-history-table box-shadow">
    <div
      class="my-history"
      v-for="(data, key) in paramsData"
      :key="key"
      v-show="data.isShow"
    >
      <!-- v-show="data.head.length > 0 && data.body.length > 0" -->
      <table
        class="history-table scroll-style-edge"
        ref="historyTable"
      >
        <thead
          class="history-thead my-table-thead"
          ref="historyHead"
        >
          <tr
            class="my-table-tr"
            :class="`${key}-tr`"
          >
            <!-- v-show="title.isShow && data.body !== null" -->
            <th
              v-for="(title, idx) in data.head"
              :key="idx"
              class="text-overflow"
            >
              {{ title }}
            </th>
          </tr>
        </thead>
        <tbody
          class="history-tbody my-table-tbody pro-scrollbar"
          @scroll="scrollRequest($event, key)"
          ref="historyBody"
        >
          <tr
            class="my-table-tr"
            v-for="(body, id) in data.body"
            :key="id"
          >
            <td class="text-overflow">{{ id+1 }}</td>
            <td class="text-overflow">{{ body.codeStr }}</td>
            <td class="text-overflow">{{ body.degreeP }}</td>
            <td v-html="body.advice"></td>
          </tr>
        </tbody>
      </table>
      <div
        class="none-data-box select-none radius"
        v-show="data.empty.isShow"
      >
        <span>{{ data.empty.text }}</span>
      </div>
    </div>
    <div class="search-data">
      <button @click="dataRetrieval">
        <!-- 数据检索 -->{{$t('Common.retrieval')}}
      </button>
      <a
        href=""
        ref="exportData"
      ></a>
    </div>
  </div>
</template>
<script>
import { cloneObj } from 'utils/utils.js'
export default {
  name: 'expertSystem',
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
      keepAlive: 'expertSystem',
    })
  },
  watch: {
    '$store.state.expertSystemMsg': {
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
      let keyArr = Object.keys(this.paramsData)
      const params = this.$store.state.srcParams
      const time = params.time
      const speed = params.speed
      const limit = params.limit
      const density = params.density /* 趋势数据查询密度 */
      this.requestData = {
        pos_id: id,
        startTime: time.start,
        endTime: time.end,
        density: Number(density.type),
        toSpeed: speed.max,
        fromSpeed: speed.min,
        type: [1],
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.paramsData, key, {
            isShow: true,
            pos,
            posName: pos.position_name,
            head: [
              this.$t('Common.order'),
              this.$t('expertSystem.SymptomType'),
              this.$t('expertSystem.Confidence'),
              this.$t('expertSystem.MaintenanceRecommend'),
            ], //'序号', '征兆类型', '置信度', '维护建议'
            body: [],
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: this.$t('Common.noDataText'), //无数据
            },
            dataType: [
              {
                val: this.$t('Common8000.TimedHisData'),
                isChecked: true,
                type: 1,
              }, //定时历史数据
              {
                val: this.$t('Common8000.StartStopData'),
                isChecked: false,
                type: 2,
              }, //启停机数据
              {
                val: this.$t('Common8000.AlarmStorageData'),
                isChecked: false,
                type: 3,
              }, //报警存储数据
            ], //8000数据类型选择
          })
          this.getData()
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          /* 将表头 位置置0 */
          let title = document.getElementsByClassName(`${key}-tr`)[0]
          title.style.left = '0px'
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.paramsData, key)
          break
      }
    },
    getData() {
      let params = this.paramsData[this.currentKey]
      let body = params.body
      const requestData = this.requestData
      this.$getApi.getExpertSystemInfo(requestData).then((res) => {
        if (res) {
          if (res.omen) {
            let obj = {}
            for (let key in res.omen) {
              obj = {}
              obj.code = key
              obj.codeStr = this.codeStr(Number(obj.code))
              obj.degreeP = res.omen[key] + '%'
              obj.advice = this.adviceStr(Number(obj.code))
              body.push(obj)
            }
            params.empty.isShow = false
          } else {
            this.$pop(this.$t('expertSystem.noData'))//专家系统无数据！
            params.empty.isShow = true
          }
        }
      })
      // for (let i = 0; i < 10; i++) {
      //   body.push({
      //     type: '对中不良',
      //     level: '60%',
      //     advice: '按技术要求调整轴系转子对中量',
      //   })
      // }
    },
    codeStr(code) {
      var str
      switch (code) {
        case 1:
          str = this.$t('expertSystem.PoorDynamicBalance')//动平衡不良
          break
        case 2:
          str = this.$t('expertSystem.PoorAlignment')//对中不良
          break
        case 3:
          str = this.$t('expertSystem.Friction')//有摩擦
          break
        case 4:
          str = this.$t('expertSystem.OilVortex')//油膜涡动
          break
        case 5:
          str = this.$t('expertSystem.OilFilmShock')//油膜震荡
          break
      }
      return str
    },
    adviceStr(code) {
      var str
      switch (code) {
        case 1:
          str = '1）'+this.$t('expertSystem.adviceStr1_1')//降负荷（或降速）运行；
          str +=
            '<br/>' +
            '2）'+this.$t('expertSystem.adviceStr1_2')//如转子不平衡故障由转子结垢不均匀造成，转子动平衡时须彻底清理转子上的结垢；
          str += '<br/>' + '3）'+this.$t('expertSystem.adviceStr1_3')//择机停车处理，按技术要求对转子进行动平衡。
          break
        case 2:
          str = '1）'+this.$t('expertSystem.adviceStr2_1')//按技术要求调整轴系转子对中量，重新对中；
          str += '<br/>' + '2）'+this.$t('expertSystem.adviceStr2_2')//转子冷态对中时，应考虑到热态不对中变化量。
          break
        case 3:
          str =
            '1）'+this.$t('expertSystem.adviceStr3_1')//调整转子与静止件的相对位置（均匀）和间隙（技术要求指标上线）；
          str += '<br/>' + '2）'+this.$t('expertSystem.adviceStr3_2')//提高轴系对中精度；
          str +=
            '<br/>' +
            '3）'+this.$t('expertSystem.adviceStr3_3')//减小转轴振动、径向跳动和外界扰动（如提高转子动平衡精度，降低不平衡力）；
          str +=
            '<br/>' +
            '4）'+this.$t('expertSystem.adviceStr3_4')//如发生局部摩擦故障，可采用摩擦方法扩大动静间隙（临时措施）。
          break
        case 4:
          str = '1）'+this.$t('expertSystem.adviceStr4_1')//按技术要求安装轴承，轴承间隙须符合要求，调整好轴承座紧力；
          str +=
            '<br/>' +
            '2）'+this.$t('expertSystem.adviceStr4_2')//改进轴承工作状况，润滑油须定期检验，如有问题及时处理（如过滤、脱水、补油、添加高性能抗磨剂等）；
          str += '<br/>' + '3）'+this.$t('expertSystem.adviceStr4_3')//调整润滑油温、油压（适当提高供油压力和油温）；
          str += '<br/>' + '4）'+this.$t('expertSystem.adviceStr4_4')//更换符合技术要求的轴承。
          break
        case 5:
          str = this.$t('expertSystem.adviceStr5_1')
            //'调整轴瓦，提高轴径在轴系内的偏心率，提高轴承一阶临界转速，提高失稳转速。'
          break
      }
      return str
    },
    dataRetrieval() {
      let dataType = this.paramsData[this.currentKey].dataType
      let viewMsg = {
        dataType,
        type: 'fullSpectrum',
      }
      this.$retrieval({
        key: 'fullSpectrum',
        viewMsg,
      }).then((res) => {
        if (res) {
          this.requestData.startTime = res.startTime
          this.requestData.endTime = res.endTime
          dataType = res.dataType //8000数据类型
          let dataTypeArray = []
          for (let i = 0; i < res.dataType.length; i++) {
            if (res.dataType[i].isChecked == true) {
              dataTypeArray.push(res.dataType[i].type)
            }
          }
          this.requestData.type = dataTypeArray
          this.getData()
        }
      })
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
            &:nth-child(1) {
              width: 8%;
            }
            &:nth-child(4) {
              width: 25%;
            }
          }
        }
      }
      .history-tbody {
        height: calc(100% - 40px);
        .my-table-tr {
          display: table;
          min-height: 30px !important;
          td {
            text-align: center;
            min-height: 30px;
            user-select: none;
            padding: 10px;
            &:nth-child(1) {
              width: 8%;
            }
            &:nth-child(4) {
              width: 25%;
            }
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
          &:last-child {
            text-align: left;
            padding-left: 15px;
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
