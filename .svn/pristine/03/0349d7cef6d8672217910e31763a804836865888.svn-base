<template>
  <div class="my-scatter-pd">
    <div
      v-for="(data, index) in chartData"
      :key="index"
      class="my-scatter-chart box-shadow"
      v-show="data.isShow"
    >
      <div class="chart-content" :class="data.chartId"></div>
      <div class="none-data-box" v-show="data.empty.isShow">
        <div>{{ data.empty.text }}</div>
      </div>
      <div class="search-data">
        <button
          class="tt"
          :class="{ check: data.botton[0].isCheck }"
          @click="chooseTime(0, data)"
        >
          {{ data.botton[0].name }}
        </button>
        <button
          class="tt"
          :class="{ check: data.botton[1].isCheck }"
          @click="chooseTime(1, data)"
        >
          {{ data.botton[1].name }}
        </button>
        <button
          class="tt"
          :class="{ check: data.botton[2].isCheck }"
          @click="chooseTime(2, data)"
        >
          {{ data.botton[2].name }}
        </button>
        <button @click="dataRetrieval">数据检索</button>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getTime } from "utils/utils.js";
export default {
  name: "punchCard",
  data() {
    return {
      currentKey: "",
      chartData: {}, // 存放所有的数据
      type: 2 //天卡周卡月卡
    };
  },
  methods: {
    //打开图谱
    openChartList(key, type) {
      if (typeof key !== "string") return;
      if (type === 0 || type === 1) {
        this.currentKey = key;
        for (let k in this.chartData) {
          this.chartData[k].isShow = false;
        }
      }
      let [, , macId, posId, posType] = key.split("_");
      if (type == 0) {
        //添加数据
        let density = this.$store.state.srcParams.density.type;
        this.$set(this.chartData, key, {
          isShow: true,
          echartIns: null,
          chartId: key, //设置图谱实例唯一ID
          trendData: [], //图谱数据
          botton: [
            {
              isCheck: false,
              name: "天卡",
              startTime: 1000 * 60 * 60 * 24
            },
            {
              isCheck: false,
              name: "周卡",
              startTime: 7 * 1000 * 60 * 60 * 24
            },
            {
              isCheck: true,
              name: "月卡",
              startTime: 30 * 1000 * 60 * 60 * 24
            }
          ],
          empty: {
            isShow: false,
            text: "无数据"
          },
          /* 特定工艺量才能够请求,默认开始是天卡 */
          requestData: {
            startTime: new Date().valueOf() - 30 * 1000 * 60 * 60 * 24,
            endTime: new Date().valueOf(),
            value: "value",
            code: 27000,
            key: [`3_${macId}_${posId}_${posType}`],//tRoot_macId_posId_posType
            density: density
          } // 请求参数
        });
        this.$nextTick(this.setEchartIns);
        this.getData();
      } else if (type == 1) {
        //切换
        this.chartData[key].isShow = true;
      } else if (type == 2) {
        //删除
        this.$delete(this.chartData, key);
      }
    },
    /* 设置echart的实例 */
    setEchartIns() {
      let chartData = this.chartData[this.currentKey];
      let dom = document.getElementsByClassName(chartData.chartId)[0];
      chartData.echartIns = echarts.init(dom);
    },
    getData() {
      let chartData = this.chartData[this.currentKey];
      let requestData = chartData.requestData;
      // requestData.startTime = requestData.startTime - 30 * 1000 * 60 * 60 * 24;
      // requestData.endTime = requestData.endTime - 30 * 1000 * 60 * 60 * 24;
      this.$getApi.getCurrentCards(requestData).then(res => {
        if (res) {
          for (let key in res.data) {
            let tendencyList = res.data[key].tendencyList;
            let arr = [];
            tendencyList.forEach(item => {
              arr.push([item.tempValue, item.saveTime]);
            });
            chartData.trendData = arr;
            if (arr.length == 0) {
              chartData.empty.isShow = true;
            } else {
              chartData.empty.isShow = false;
            }
          }
          this.setData(chartData, requestData);
        }
      });
    },
    setData(chartData, requestData) {
      let data = chartData.trendData;
      let min = requestData.startTime;
      let max = requestData.endTime;
      let interval;
      if (this.type == 0) {
        /* 天卡 */
        interval = 1000 * 60 * 60;
      } else if (this.type == 1) {
        /* 周卡 */
        interval = 1000 * 60 * 60 * 6;
      } else if (this.type == 2) {
        /* 月卡 */
        interval = 1000 * 60 * 60 * 24;
      }
      let option = {
        title: {
          // text: "Punch Card"
        },
        // legend: {
        //   data: ["Punch Card"],
        //   left: "right"
        // },
        polar: {
          radius: ["10%", "85%"]
        },
        tooltip: {
          formatter: params => {
            return `电流：${params.value[0]}A<br/>
                    时间：${getTime(params.value[1])}<br/>`;
          }
        },
        angleAxis: {
          type: "time",
          min: min,
          max: max,
          interval: interval,
          clockwise: false, //逆时针
          splitLine: {
            show: true, // 显示线
            interval: 0,
            lineStyle: {
              color: "#fff",
              type: "solid"
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#fff",
              type: "solid"
            }
          }
        },
        radiusAxis: {
          type: "value",
          splitLine: {
            show: true, // 显示线
            lineStyle: {
              color: "#fff",
              type: "solid"
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#fff",
              type: "solid"
            }
          },

          axisLabel: {
            rotate: 45
          }
        },
        toolbox: {
          show: true,
          feature: {
            restore: {}
          }
        },
        series: [
          {
            name: "Punch Card",
            type: "line",
            coordinateSystem: "polar",
            symbolSize: 3,
            data: data,
            // animation: false,
            animationDelay: 0,
            itemStyle: {
              color: "#ff0000"
            },
            /* 高亮选择 */
            emphasis: {
              itemStyle: {
                color: "red",
                borderWidth: 5,
                borderColor: "red"
              }
            }
            // {
            //   color: "#00d2ff"
            // }
          }
        ],
        /* 缩放 */
        dataZoom: {
          type: "inside",
          // angleAxisIndex: 0,
          radiusAxisIndex: 0
        }
      };
      /* 周卡的时候需要手动调整下时间的格式 */
      if (this.type == 1) {
        option.axisLabel = {
          isShow: true,
          formatter: function(value, index) {
            // 格式化成月/日，只在第一个刻度显示年份
            let date = new Date(value);
            let texts;
            if (index % 4 === 0) {
              texts = `${date.getHours()}:${date.getMinutes()}\n${date.getMonth() +
                1}-${date.getDate()}`;
            } else {
              texts = `${date.getHours()}:${date.getMinutes()}`;
            }
            return texts;
          }
        };
      }
      chartData.echartIns.setOption(option, true);
    },
    //数据检索
    dataRetrieval() {
      this.$retrieval("punchCard").then(res => {
        if (res) {
          let chartData = this.chartData[this.currentKey];
          let requestData = chartData.requestData;
          requestData.density = res.density.type;
          this.getData();
        }
      });
    },
    //选择时间
    chooseTime(index, data) {
      this.type = index;
      data.botton.forEach((item, i) => {
        if (i === index) {
          item.isCheck = true;
          // data.requestData.endTime = 1605348828000;
          // data.requestData.startTime = 1605348828000 - item.startTime;
          data.requestData.endTime = new Date().valueOf();
          data.requestData.startTime =
            data.requestData.endTime - item.startTime;
          this.getData();
        } else {
          item.isCheck = false;
        }
      });
    }
  },
  watch: {
    "$store.state.punchCardMsg": {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift();
            this.openChartList(item.key, item.state);
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "punchCard"
    });
  }
};
</script>
<style scoped lang="scss">
.my-scatter-pd {
  position: relative;
  .my-scatter-chart {
    position: relative;
    height: calc(100% - 50px);
    .chart-content {
      height: 100%;
    }
    .none-data-box {
      height: 100%;
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    text-align: center;
    position: absolute;
    bottom: -49px;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin-right: 20px;
    }
    .tt {
      background: #0072e6;
    }
    .check {
      background: #a47c42;
    }
  }
}
</style>
