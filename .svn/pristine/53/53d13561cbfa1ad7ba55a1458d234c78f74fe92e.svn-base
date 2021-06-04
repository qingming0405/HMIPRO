<template>
  <div class="box-shadow">
    <div class="threeDimensionalHolographyContent">
      <div id="threeDimensionalHolography"></div>
    </div>
    <div class="search-data">
      <button>基本信息</button>
      <button>数据检索</button>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import "echarts-gl";
export default {
  name: "hologram",
  data() {
    return {
      myChart_example: null,
      dataList1: [],
      dataList2: [],
      dataList3: [],
      dataList4: [],
      dataList5: [],
      dataList6: [],
      dataList7: [],
      dataList8: [],
      thisPoints1: [],
      thisPoints2: [],
      thisPoints3: [],
      objsanwei: [],
      objsanwei2: [],

      hengjiemian1point1: [],
      hengjiemian1point2: [],
      hengjiemian1point3: [],
      hengjiemian1objsanwei1: [],
      hengjiemian1objsanwei2: [],

      hengjiemian2point1: [],
      hengjiemian2point2: [],
      hengjiemian2point3: [],
      hengjiemian2objsanwei1: [],
      hengjiemian2objsanwei2: [],

      extremumOfSet: 200, //纵轴极值(y轴最大值)
      runningStatus: "实时数据", //运行状态
      rotateSpeed: "45454", //转速
      metaTitle: "",
      thePathChosenByTheTree: "",
      element: null /* dom */,
      // 图表字体大小 默认14
      chartsFontSize: 14,
      // 图表左右间距
      chartLeftAndRightSpacing: [30, 80],
      generateSpuriousList: [],
    };
  },
  created() {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "hologram",
    });
  },
  mounted() {
    this.ssss();
    this.sahda();
    this.drawLineCharts();
    this.element = document.getElementById("threeDimensionalHolography");
  },
  watch: {
    "$store.state.hologramMsg": {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift();
            this.openChartList(item.key, item.state);
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    openChartList(key, type) {},
    ssss() {
      for (var times = 0; times < 45; times++) {
        var hudu = ((3 * Math.PI) / 360) * 6 * times;
        var X = 15 + Math.sin(hudu) * 1.2;
        var Y = 0 - Math.cos(hudu) * 1.6;
        this.thisPoints1.push([X, 1, Y]);
        const x2 = 15 + Math.sin(hudu) * 3.2;
        const y2 = 0 - Math.cos(hudu) * 3.8;
        this.thisPoints2.push([x2, 5, y2]);
        const x3 = 15 + Math.sin(hudu) * 1.1;
        const y3 = 0 - Math.cos(hudu) * 1.4;
        this.thisPoints3.push([x3, 9, y3]);
      }

      for (var times = 0; times < 45; times++) {
        var hudu = ((3 * Math.PI) / 360) * 6 * times;
        var X = 5 + Math.sin(hudu) * 0.1;
        var Y = 0 - Math.cos(hudu) * 0.13;
        this.hengjiemian1point1.push([X, 1, Y]);
        const x2 = 5 + Math.sin(hudu) * 0.1;
        const y2 = 0 - Math.cos(hudu) * 0.15;
        this.hengjiemian1point2.push([x2, 5, y2]);
        const x3 = 5 + Math.sin(hudu) * 0.1;
        const y3 = 0 - Math.cos(hudu) * 0.13;
        this.hengjiemian1point3.push([x3, 9, y3]);
      }

      for (var times = 0; times < 45; times++) {
        var hudu = ((3 * Math.PI) / 360) * 6 * times;
        var X = 25 + Math.sin(hudu) * 0.8;
        var Y = 0 - Math.cos(hudu) * 1.2;
        this.hengjiemian2point1.push([X, 1, Y]);
        const x2 = 25 + Math.sin(hudu) * 0.1;
        const y2 = 0 - Math.cos(hudu) * 0.15;
        this.hengjiemian2point2.push([x2, 5, y2]);
        const x3 = 25 + Math.sin(hudu) * 1;
        const y3 = 0 - Math.cos(hudu) * 1.3;
        this.hengjiemian2point3.push([x3, 9, y3]);
      }

      this.thisPoints1.forEach((item, index) => {
        if (index % 5 === 0) {
          //   this.objsanwei.push(item, this.thisPoints2[index]);
          this.objsanwei.push({
            type: "line3D",
            data: [item, this.thisPoints2[index]],
            lineStyle: {
              width: 1,
            },
          });
          this.objsanwei2.push({
            type: "line3D",
            data: [this.thisPoints2[index], this.thisPoints3[index]],
            lineStyle: {
              width: 1,
            },
          });
        }
      });

      this.hengjiemian1point1.forEach((item, index) => {
        if (index % 5 === 0) {
          this.hengjiemian1objsanwei1.push({
            type: "line3D",
            data: [item, this.hengjiemian1point2[index]],
            lineStyle: {
              width: 1,
            },
          });
          this.hengjiemian1objsanwei2.push({
            type: "line3D",
            data: [
              this.hengjiemian1point2[index],
              this.hengjiemian1point3[index],
            ],
            lineStyle: {
              width: 1,
            },
          });
        }
      });

      this.hengjiemian2point1.forEach((item, index) => {
        if (index % 5 === 0) {
          this.hengjiemian2objsanwei1.push({
            type: "line3D",
            data: [item, this.hengjiemian2point2[index]],
            lineStyle: {
              width: 1,
            },
          });
          this.hengjiemian2objsanwei2.push({
            type: "line3D",
            data: [
              this.hengjiemian2point2[index],
              this.hengjiemian2point3[index],
            ],
            lineStyle: {
              width: 1,
            },
          });
        }
      });
    },
    sahda() {
      for (let i = 1; i < 8; i++) {
        this.dataList1.push(Math.ceil(Math.random() * 150));
        this.dataList2.push(Math.ceil(Math.random() * 150));
        this.dataList3.push(Math.ceil(Math.random() * 150));
        this.dataList4.push(Math.ceil(Math.random() * 150));
        this.dataList5.push(Math.ceil(Math.random() * 150));
        this.dataList6.push(Math.ceil(Math.random() * 150));
        this.dataList7.push(Math.ceil(Math.random() * 150));
        this.dataList8.push(Math.ceil(Math.random() * 150));
      }
    },
    drawLineCharts() {
      this.myChart_example = echarts.init(
        document.getElementById("threeDimensionalHolography")
      );

      const option = {
        tooltip: {
          show: false,
        },
        color: "#096dd9",
        // backgroundColor: "#ecf5ff",
        xAxis3D: {
          name: "倍频",
          type: "value",
          min: 0,
          max: 30,
          splitLine: {
            show: false,
          },
          nameGap: 25,
          interval: 5,
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: function (val) {
              if (val === 5) {
                return "0.50X";
              } else if (val === 15) {
                return "1.00X";
              } else if (val === 25) {
                return "2.00X";
              }
            },
            color: "#F3F3F3",
            fontSize: 15,
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf",
              width: 1.5,
            },
          },
          nameTextStyle: {
            color: "#F3F3F3",
          },
        },
        yAxis3D: {
          name: "",
          type: "value",
          min: 0,
          max: 10,
          interval: 1,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: function (val) {
              if (val === 1) {
                return "截面1";
              } else if (val === 5) {
                return "截面2";
              } else if (val === 9) {
                return "截面3";
              }
            },
            color: "#F3F3F3",
            fontSize: 15,
          },

          axisLine: {
            lineStyle: {
              color: "#bfbfbf",
              width: 1.5,
            },
          },
        },
        zAxis3D: {
          type: "value",
          min: -10,
          max: 10,
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            fontSize: 15,
          },
          axisLine: {
            lineStyle: {
              color: "#bfbfbf",
              width: 1.5,
            },
          },
          axisTick: {
            length: 2,
          },
        },
        grid3D: {
          axisPointer: {
            show: false,
            lineStyle: {
              color: "#d9d9d9",
            },
          },
          boxWidth: 130,
          boxHeight: 60,
          boxDepth: 130,
          viewControl: {
            alpha: 10,
            projection: "perspective",
            minAlpha: 0,
          },
        },
        series: [
          // 三个横截面
          // 1X
          {
            type: "line3D",
            data: this.thisPoints1,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: "line3D",
            data: this.thisPoints2,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: "line3D",
            data: this.thisPoints3,
            lineStyle: {
              width: 1,
            },
          },
          //   中间轴线
          {
            type: "line3D",
            data: [
              [15, 0, 0],
              [15, 10, 0],
            ],
            lineStyle: {
              color: "#13c2c2",
            },
          },

          // 0.5X倍频三个横截面
          {
            type: "line3D",
            data: this.hengjiemian1point1,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: "line3D",
            data: this.hengjiemian1point2,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: "line3D",
            data: this.hengjiemian1point3,
            lineStyle: {
              width: 1,
            },
          },

          //  0.5X 中间轴线
          {
            type: "line3D",
            data: [
              [5, 0, 0],
              [5, 10, 0],
            ],
            lineStyle: {
              color: "#13c2c2",
            },
          },

          //2X 倍频三个横截面
          {
            type: "line3D",
            data: this.hengjiemian2point1,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: "line3D",
            data: this.hengjiemian2point2,
            lineStyle: {
              width: 1,
            },
          },
          {
            type: "line3D",
            data: this.hengjiemian2point3,
            lineStyle: {
              width: 1,
            },
          },

          //  2.0X 中间轴线
          {
            type: "line3D",
            data: [
              [25, 0, 0],
              [25, 10, 0],
            ],
            lineStyle: {
              color: "#13c2c2",
            },
          },
          //   2X三个半径标线
          {
            type: "line3D",
            data: [
              [24.87, 1, 1.18],
              [25, 1, 0],
            ],
            lineStyle: {
              color: "#ff4d4f",
              width: 1,
            },
          },
          {
            type: "line3D",
            data: [
              [24.69, 9, 1.23],
              [25, 9, 0],
            ],
            lineStyle: {
              color: "#ff4d4f",
              width: 1,
            },
          },
          {
            type: "line3D",
            data: [
              [25.01, 5, 0.14],
              [25, 5, 0],
            ],
            lineStyle: {
              color: "#ff4d4f",
              width: 1,
            },
          },

          //   1X三个半径标线
          {
            type: "line3D",
            data: [
              [14.62, 1, 1.52],
              [15, 1, 0],
            ],
            lineStyle: {
              color: "#ff4d4f",
              width: 1,
            },
          },
          {
            type: "line3D",
            data: [
              [13.54, 5, 3.38],
              [15, 5, 0],
            ],
            lineStyle: {
              color: "#ff4d4f",
              width: 1,
            },
          },
          {
            type: "line3D",
            data: [
              [14.5, 9, 1.24],
              [15, 9, 0],
            ],
            lineStyle: {
              color: "#ff4d4f",
              width: 1,
            },
          },
          // 样式标线
          // {
          //   type: "line3D",
          //   data: [
          //     [0, 0, -10],
          //     [0, 10, -10],
          //   ],
          //   lineStyle: {
          //     color: "#bfbfbf",
          //     width: 1.5,
          //   },
          // },
          // {
          //   type: "line3D",
          //   data: [
          //     [0, 10, -10],
          //     [0, 10, 10],
          //   ],
          //   lineStyle: {
          //     color: "#bfbfbf",
          //     width: 1.5,
          //   },
          // },
          // {
          //   type: "line3D",
          //   data: [
          //     [0, 10, -10],
          //     [30, 10, -10],
          //   ],
          //   lineStyle: {
          //     color: "#bfbfbf",
          //     width: 1.5,
          //   },
          // },
          ...this.objsanwei,
          ...this.objsanwei2,
          ...this.hengjiemian1objsanwei1,
          ...this.hengjiemian1objsanwei2,
          ...this.hengjiemian2objsanwei1,
          ...this.hengjiemian2objsanwei2,
        ],
      };
      this.myChart_example.setOption(option);
      // window.onresize = this.myChart_example.resize;
      window.addEventListener("resize", () => {
        this.myChart_example.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/css/inputStyle.scss";
@import "@/assets/style/css/chartsStyle.scss";
</style>