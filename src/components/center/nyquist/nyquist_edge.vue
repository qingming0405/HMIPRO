<template>
  <div class="box-shadow">
    <div
      class="polarDiagram-content"
      v-for="(item,key) in paramsData" :key="key"
    >
      <div class="polarDiagram-content-flex">
        <div
          class="polarDiagram-content-flex-item"
          :ref="'chart_' + key" 
          @contextmenu.prevent="contextmenu($event, k)"
        ></div>
        <s-s-index class="index-list" :dataList="item.ssDataList" @ss-select="ssSelect"/>
      </div>
      <div class="search-data">
        <button @click="dataRetrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import SSIndex from 'common/startStop/SSIndex.vue'

import { cloneObj, getTime, getdefaultCode } from 'utils/utils.js'

export default {
  name: 'nyquist',
  components: {
    SSIndex
  },
  data() {
    return {
      paramsData: {},
      currentKey: null,
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'nyquist',
    })
  },
  watch: {
    '$store.state.nyquistMsg': {
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
      const [, , macId, posId, posType] = key.split('_')
      let pos = null
      let requestData = null
      if (type === 0 || type === 1) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
        const params = this.$store.state.srcParams
        const time = params.time
        const speed = params.speed
        const density = params.density /* 趋势数据查询密度 */
        requestData = {
          time: { pos_id: pos.pos_id, startTime: time.start, endTime: time.end },
          data: {
            machineId: macId,
            positionId: posId,
            positionType: posType,
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
        for (let k in this.paramsData) {
          this.paramsData[k].isShow = false
        }
        this.currentKey = key
      } else {
        pos = this.paramsData[key].pos
      }

      if (type == 0) {
        //添加数据
        this.$set(this.paramsData, key, {
          isShow: true,
          pos,
          myChart: null,
          requestData,
          ssDataList: null,
          curDataList:null,
          type: 1 //1=1倍频 2=2倍频
        })
        this.$nextTick(() => {
          this.createChart()
          this.getSSList()
        })
      } else if (type == 1) {
        //切换
        this.paramsData[key].isShow = true
      } else if (type == 2) {
        //删除
        this.$delete(this.paramsData, key)
      }
    },
    createChart() {
      const dom = this.$refs[`chart_${this.currentKey}`][0]
      const that =this
      let option = {
        title: {
          text: '',
        },
        polar: {},
        /* 缩放 */
        dataZoom: {
          type: 'inside',
          // angleAxisIndex: 0,
          radiusAxisIndex: 0,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              color: 'black',
            },
          },
          formatter: function (params) {
            return `${that.$t('nyquist.value')}：${params[0].data[0]}<br/>
                   ∠：${params[0].data[1]}<br/> `//值
          },
        },
        angleAxis: {
          type: 'value',
          // clockwise: false,
          startAngle: 135,
          min: 0,
          max: 360,
          interval: 90,
          axisLine: {
            // show:false,
            //坐标轴轴线设置
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            // margin: 15,
            formatter: function (value) {
              return '∠ ' + value + '°'
            },
          },
        },
        radiusAxis: {
          splitLine: {
            lineStyle: {
              color: '#fff',
              type: "dotted",
            },
          },
          axisLine: {
            //坐标轴轴线设置
            lineStyle: {
              color: '#f0f5ff',
            },
          },
        },
        series: [
          {
            coordinateSystem: 'polar',
            type: 'line',
            data: [],
          },
        ],
      }
      const myChart = this.initChart(dom, option)
      /* 自动缩放 */
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      this.paramsData[this.currentKey].myChart = myChart
    },
    getSSList() {
      const params = this.paramsData[this.currentKey]
      this.$getApi.getOnOffIndex(params.requestData.time).then((res) => {
        if (res) {
          if (res.list.length > 0) {
            params.ssDataList = res.list
            this.ssSelect(params.ssDataList[0])
          }
        }
      })
    },
    setData() {
      const {myChart, curDataList, type} = this.paramsData[this.currentKey]
      const dataList = []
      for(let i=0; i<curDataList.length; i++){
        dataList.push(this.getDataByType(curDataList[i], type))
      }
      const option = {
        series: [
          {
            data: dataList
          }
        ]
      }
      myChart.setOption(option)
    },
    getDataByType(item, type){
      if(type == 2){
        return [
          item.v2x,
          item.p2x,
          item.speed
        ]
      }
      return [
        item.v1x,
        item.p1x,
        item.speed
      ]
    },
    initChart(dom, option) {
      const myChart = echarts.init(dom)
      myChart.setOption(option)
      return myChart
    },
    /**事件 */
    // 数据检索
    dataRetrieval() {
      this.$retrieval({
        key: 'system',
        params: {
          macName: '',
          macId: '',
          machineOpition: [],
        },
      }).then((res) => {
        const requestData = this.paramsData[this.currentKey].requestData
        requestData.time.startTime = res.startTime
        requestData.time.endTime = res.endTime
        this.getSSList()
      })
    },
    //索引选择
    ssSelect(item) {
      const params = this.paramsData[this.currentKey]
      const requestData = this.paramsData[this.currentKey].requestData
      requestData.data.startTime = item.startTime
      requestData.data.endTime = item.stopTime
      this.$getApi.getSaveData(requestData.data).then((res) => {
        if (res) {
          if (res.list.length > 0) {
            params.curDataList = res.list
            this.setData()
          } else {
            this.$pop(this.$t('Common8000.NoStartStopData'))//无启停数据！
          }
        }
      })
    },
    //右键菜单
    contextmenu(e, key) {
      let text = [
        { type: '1x', val: this.$t('eigenvalue.onexamplitude') },//1x幅值
        { type: '2x', val: this.$t('eigenvalue.twoxamplitude') },//2x幅值
      ]
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `100px`,
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
        },
      }).then((res) => {
        if (res.item) {
          switch(res.item.type){
            case '1x':
              this.paramsData[this.currentKey].type = 1
              this.setData()
              break;
            case '2x':
              this.paramsData[this.currentKey].type = 2
              this.setData()
              break;
          }
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
.polarDiagram-content {
  height: 100%;
  width: 100%;
  position: relative;
  .polarDiagram-content-flex {
    height: calc(100% - 49px);
    display: flex;
    .polarDiagram-content-flex-item {
      flex: 3;
    }
    .index-list{
      flex: 1;
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    button {
      height: 30px;
      width: 100px;
    }
  }
}
</style>