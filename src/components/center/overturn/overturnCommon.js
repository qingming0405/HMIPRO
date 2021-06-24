import myChart from "@/assets/js/myCharts.js";
import { getTime } from "utils/utils.js";
export default {
  name: "overturn",
  data () {
    return {
      overturnData: {} /* 机舱轨迹图信息 */,
      requestData: {} /* 请求数据参数 波形图的 */,
      currentKey: 0 /* 当前显示图谱索引 */,
      chart: {} /* 图谱实例 */,
      color: {
        /* 颜色设置 */
        axis: {
          /* 坐标轴 */
          name: "#666" /* 标题 */,
          font: "#666" /* 字体 */,
          line: "#ccc" /* 坐标线 */,
          splitLine: "#ccc" /* 分隔线 */
        },
        series: {
          /* 图谱 */
          line: "#3D77FF" /* 谱线 */,
          symbol: "#fff" /* symbol */,
          point: "#000" //散点图点的颜色
        },
        tool: {
          symbol: "#ff9b21",
          line: "#ff9b21",
          font: "#fff",
          background: "#ff9b21"
        },
        background: "#fff" /* 背景颜色 */,
        isNewChart: true /* 是否为新打开图谱 */
      },
      lineStyle: {
        // 样式
        color: "#999" // 颜色，默认 '#0032ff'
      },
      fontStyle: {
        color: "#666"
      },
      realBtn: false //开始实时数据开关
    };
  },
  watch: {
    "$store.state.overturnMsg": {
      handler (value) {
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
  deactivated () {
    clearInterval(this.overturnData[this.currentKey].timer)
  },
  methods: {
    // 打开图谱
    openChartList (key, state, delKey) {
      if (typeof key !== "string") return;
      const [, , macId, posId, posType] = key.split("_");
      if (state === 0 || state == 1) {
        //新建图谱
        this.currentKey = key;
        for (let k in this.overturnData) {
          this.overturnData[k].isShow = false;
        }
      }
      let pos = this.$store.state.checkMsg.pos; //获取当前合成倾角的测点信息
      for (let k in this.overturnData) {
        clearInterval(this.overturnData[k].timer)

      }
      switch (state) {
        case 0 /* 打开图表 */:
          this.$set(this.overturnData, key, {
            isShow: true,
            pos,
            circle: {},
            waveX: {},
            waveY: {},
            trend: {},
            viewTrend: false, //趋势图 图层显示
            noneData: {
              /* 无数据提示信息 */
              isShow: true /* 是否显示无数据提示 */,
              text: "" /* 无数据提示内容 */
            },
            isTrend: false /* 趋势图无数据字样像是 */,
            date: getTime(Date.now()),
            phase: "",
            amplitude: "",
            showAlarm: false,
            alarmData: [],
            requestData: {}, //请求数据的参数
            realBtn: false,
            timer: null
          });
          let od = this.overturnData[key];
          this.$nextTick(() => {
            this.initChart(od, this.currentKey);
          });
          od.requestData = {
            positionType: posType,
            positionId: posId,
            machineId: macId,
            isReal: 0
          };
          this.setRequestData(od); //获取数据
          /* 判断当前实时数据开关 */
          this.handleRealBtn();
          break;
        case 1 /* 切换图表 */:
          this.overturnData[key].isShow = true;
          if (this.overturnData[key].realBtn) {
            this.overturnData[key].timer = setInterval(() => {
              this.getData(this.overturnData[key], this.overturnData[key].requestData);
            }, 5000);
          }
          break;
        case 2 /* 关闭图表 */:
          clearInterval(this.overturnData[key].timer)
          this.closeChartList(key);
          break;
      }
    },
    // 关闭趋势图
    closeTrend () {
      this.overturnData[this.currentKey].viewTrend = false;
      /* 刷新其他图谱的比例 */
      this.$nextTick(this.resizeAll);
    },
    /* 关闭图谱 */
    closeChartList (key) {
      /* 清除定时器 */
      clearInterval(this.overturnData[key].timer);
      this.$delete(this.overturnData, key);
      this.$delete(this.chart, key);
    },
    /* 获取实时数据开关 */
    getRealData () {
      let od = this.overturnData[this.currentKey]; //获取当前的数据
      od.realBtn = !od.realBtn;
      this.handleRealBtn();
    },
    /* 处理实时数据 */
    handleRealBtn () {
      let od = this.overturnData[this.currentKey]; //获取当前的数据
      let realBtn = od.realBtn;
      let requestData = od.requestData;
      if (realBtn) {
        /* 开启定时器 */
        requestData.isReal = 1;
        requestData.currTime = Date.now();
        od.timer = setInterval(() => {
          this.getData(od, requestData);
        }, 5000);
      } else {
        // 关闭定时器
        clearInterval(od.timer);
      }
    },
    // 数据检索
    dataRetrieval () {
      let od = this.overturnData[this.currentKey];
      this.$retrieval({
        key: "overturn"
      }).then(res => {
        if (res) {
          let requestData = {
            //  发送单个倾角的信息，去获取波形趋势图
            machineId: od.pos.machine_id,
            positionId: od.pos.rock1_id,
            positionType: 12,
            startTime: res.startTime,
            endTime: res.endTime,
            toSpeed: res.maxSpeed,
            fromSpeed: res.minSpeed,
            lowerLimit: res.lower,
            upperLimit: res.upper,
            value: "rock_rms",
            code: 33000,
            type: 1,
            isTrendPrediction: false,
            density: Number(res.density.type),
          };
          this.getTrend(requestData, od);
        }
      });
    },
    resizeAll () {
      for (let val in this.chart[this.currentKey]) {
        // this.chart[this.currentKey][val]._option防止趋势图未画时进行刷新
        this.chart[this.currentKey][val] && this.chart[this.currentKey][val]._option && this.chart[this.currentKey][val].resize();
      }
    },
    // showAlarm() {
    //   this.$nextTick(() =>
    //     this.circleOption(
    //       this.overturnData[this.currentKey],
    //       this.chart[this.currentKey]
    //     )
    //   );
    // },
    // 设置选中/未选中状态图标
    setIcon (bool) {
      return bool
        ? "iconfont icon-zhongzi_xuanzekuang1"
        : "iconfont icon-zhongzi_xuanzekuang";
    },
    // 初始化图谱
    initChart (od, curKey) {
      let chart = {
        circle: myChart.init(
          document.getElementsByClassName(`circle-chart${curKey}`)[0]
        ),
        waveX: myChart.init(
          document.getElementsByClassName(`waveX-chart${curKey}`)[0]
        ),
        waveY: myChart.init(
          document.getElementsByClassName(`waveY-chart${curKey}`)[0]
        ),
        trend: myChart.init(
          document.getElementsByClassName(`trend-chart${curKey}`)[0]
        )
      };
      /* 兼容pro */
      this.chart[curKey] = chart;
      if (od) {
        this.circleOption(od, chart);
        this.waveXOption(od, chart);
        this.waveYOption(od, chart);
      }
    },
    // 获取趋势数据成功
    getTrend (requestData, od) {
      this.$emit("loadingImg", true);
      this.$getApi.getPositionEigenvalue(requestData).then(res => {
        this.$emit("loadingImg", false);
        if (res) {
          const msg = res.tendencyList;
          od.viewTrend = true; // 显示趋势图
          od.noneData = {
            isShow: false,
            text: ""
          };
          if (msg.length > 0) {
            const x = [];
            const y = [];
            for (let i = 0, l = msg.length; i < l; i++) {
              const value = msg[i];
              x.push(value.saveTime);
              y.push(value.tempValue);
            }
            od.trend = {
              x,
              y
            };
            od.isTrend = false;
          } else {
            od.isTrend = true; //显示无数据
          }
          this.$nextTick(() => {
            /* 更新趋势图数据,兼容pro */
            let chartIns = this.chart[this.currentKey].trend;
            this.trendOption(od, chartIns);
            /* 刷新图谱 */
            this.resizeAll();
          });
        }
      });
    },
    setRequestData (od, currTime = 0) {
      let requestData = od.requestData;
      requestData.currTime = currTime;
      if (currTime === 0) {
        /* 第一次请求的是实时数据 */
        requestData.isReal = 1;
      } else {
        requestData.isReal = 0;
      }
      this.getData(od, requestData);
    },
    // 获取波形图数据成功
    getData (od, requestData) {
      this.$getApi.getCabinTrajectory(requestData).then(data => {
        if (!data.x.waveObject || data.x.waveObject.wave === null) {
          if (requestData.currTime === 0) {
            // 第一次请求
            od.noneData = {
              isShow: true,
              text: this.$t('Common.noRealData')//无实时数据
            };
          }
        } else {
          od.alarmData.length = 0;
          od.noneData.isShow = false;
          /* 设置时间 */
          od.date = getTime(data.x.value.saveTime);
          if (Number(od.pos.dgm_type) === 1) {
            od.alarmData = [
              {
                title: this.$t('Common.OtherCond'),//其它工况
                warning: data[37000].h_limit_5,
                alarm: data[37000].hh_limit_5,
                isCheck: false
              }
            ];
          } else {
            for (let i = 0; i < 5; i++) {
              if (i === 4) {
                od.alarmData.push({
                  title: this.$t('Common.OtherCond'),//其它工况
                  warning: data[37000].h_limit_5,
                  alarm: data[37000].hh_limit_5,
                  isCheck: false
                });
              } else {
                const count = i + 1;
                od.alarmData.push({
                  title: this.$t(`Common.Case${count}`),//工况${count}
                  warning: data[37000][`h_limit_${count}`],
                  alarm: data[37000][`hh_limit_${count}`],
                  isCheck: false
                });
              }
            }
          }
          const axis = ["x", "y"];
          const wave = Object.create(null);
          for (let i = 0; i < 2; i++) {
            const value = axis[i];
            const val = data[value];
            const obj = val.waveObject;
            if (obj !== null && obj !== undefined) {
              const y = obj.wave;
              const l = y.length;
              wave[value] = {
                name: val[`rock${i + 1}_pos_name`],
                id: Number(val[`rock${i + 1}_id`]),
                cId: val[`rock${i + 1}_ch_id`],
                type: val[`rock${i + 1}_ch_type`],
                y,
                addNum: l / obj.freq / l,
                x: null
              };
              const x = [];
              for (let j = 0; j < l; j++) {
                x.push(j * wave[value].addNum);
              }
              wave[value].x = x;
            }
          }
          if (wave.x !== undefined) {
            const A = [];
            const P = [];
            const xy = wave.x.y;
            const yy = wave.y.y;
            let max = Number.MIN_VALUE;
            for (let i = 0, l = xy.length; i < l; i++) {
              A.push(Math.sqrt(xy[i] ** 2 + yy[i] ** 2));
              P.push(
                (Math.atan2(yy[i], xy[i]) * 180) / Math.PI + od.pos.offset_angle
              );
              A[i] > max && (max = A[i] * 2);
            }
            max < 0.1 && (max = 0.1);
            od.waveX = {
              x: wave.x.x,
              y: xy,
              isRestore: true
            };
            od.waveY = {
              x: wave.y.x,
              y: yy,
              isRestore: true
            };
            od.circle = {
              amplitude: [A],
              phase: [P],
              max
            };
            //兼容pro
            let chart = this.chart[this.currentKey];
            this.circleOption(od, chart);
            this.waveXOption(od, chart);
            this.waveYOption(od, chart);
          }
        }
      });
    },
    // 更新轨迹图数据
    circleOption (od, chart, key) {
      const circle = od.circle;
      const markLine = [];
      if (typeof key === "number") {
        markLine.push({ key });
      }
      const alarm = [];
      for (let i = 0, l = od.alarmData.length; i < l; i++) {
        const value = od.alarmData[i];
        if (value.isCheck) {
          alarm.push(
            // 预警
            {
              data: Number(value.warning),
              lineStyle: {
                width: 1,
                color: "#C4C200"
              }
            },
            // 报警
            {
              data: Number(value.alarm),
              lineStyle: {
                width: 1,
                color: "#ff0000"
              }
            }
          );
        }
      }
      const circleOption = {
        grid: {
          top: 30,
          bottom: 30
        },
        series: {
          unit: "°",
          coordinateSystem: "circle",
          lineStyle: {
            // 样式
            color: this.lineStyle.color, // 颜色，默认 '#0032ff'
            width: 1 // 粗细，默认 1
          },
          fontStyle: {
            color: this.fontStyle.color,
            size: "14px",
            family: "Microsoft YaHei"
          },
          symbol: {
            show: false
          },
          markLine: {
            data: markLine
          },
          data: {
            amplitude: circle.amplitude,
            phase: circle.phase,
            /* 散点图点的颜色 */
            color: [this.color.series.point],
            maxAmplitude: circle.max
          },
          // 圆周图报警线
          circleAlarm: alarm
        },
        toolTip: {
          isShow: false,
          formatter: function (params) {
            const index1 = params.index1;
            const index2 = params.index2;
          }
        }
      };
      chart.circle.setOption(circleOption);
    },
    // 更新X轴数据
    waveXOption (od, chart, val, key) {
      const waveX = od.waveX;
      const color = this.color;
      const that = this;
      const waveXOption = {
        title: {
          show: true,
          name: od.pos.rock1_name || od.pos.rock1_pos_name, //兼容pro
          fontStyle: {
            align: "center",
            weight: "",
            color: color.axis.title
          }
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 28 // 离容器下边距离，默认 60
        },
        x: {
          name: "t(s)",
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          type: "category",
          data: waveX.x,
          fontStyle: {
            color: color.axis.font,
            size: "14px"
          },
          lineStyle: {
            color: color.axis.line
          },
          splitLineStyle: {
            color: color.axis.splitLine
          }
        },
        y: {
          name: "°",
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          data: waveX.y,
          fontStyle: {
            color: color.axis.font,
            size: "14px"
          },
          lineStyle: {
            color: color.axis.line
          },
          splitLineStyle: {
            color: color.axis.splitLine
          }
        },
        series: {
          type: "line", // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1 // 粗细，默认 1
          },
          markLine: {
            data: key
              ? [
                {
                  key,
                  val
                }
              ]
              : [],
            lineStyle: {
              color: color.tool.line,
              width: 1
            }
          }
        },
        toolTip: {
          symbol: {
            show: true,
            color: color.tool.symbol,
            size: 3
          },
          lineStyle: {
            // 标线样式
            color: color.tool.line, // 颜色，默认 '#FA9A4D'
            width: 1 // 粗细，默认 1
          },
          fontStyle: {
            // 标注字体样式
            color: color.tool.font, // 颜色，默认 '#fff'
            size: "14px", // 大小，默认 '12px'
            family: "Microsoft YaHei", // 字体，默认 'Microsoft YaHei'
            weight: "normal" // 粗细，默认 'normal'
          },
          background: {
            // 提示框背景
            color: color.tool.background // 颜色，默认 'rgba(50, 50, 50, 0.3)'
          },
          formatter (params) {
            that.circleOption(od, chart, params.key);
            that.waveYOption(od, chart, params.val, params.key);
          }
        },
        backgroundColor: color.background
      };
      chart.waveX.setOption(waveXOption);
    },
    // 更新Y轴数据
    waveYOption (od, chart, val, key) {
      const waveY = od.waveY;
      const color = this.color;
      const that = this;
      const waveYOption = {
        title: {
          show: true,
          name: od.pos.rock2_name || od.pos.rock2_pos_name,
          fontStyle: {
            align: "center",
            weight: "",
            color: color.axis.title
          }
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 28 // 离容器下边距离，默认 60
        },
        x: {
          name: "t(s)",
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          type: "category",
          data: waveY.x,
          fontStyle: {
            color: color.axis.font,
            size: "14px"
          },
          lineStyle: {
            color: color.axis.line
          },
          splitLineStyle: {
            color: color.axis.splitLine
          }
        },
        y: {
          name: "°",
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          data: waveY.y,
          fontStyle: {
            color: color.axis.font,
            size: "14px"
          },
          lineStyle: {
            color: color.axis.line
          },
          splitLineStyle: {
            color: color.axis.splitLine
          }
        },
        series: {
          type: "line", // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1 // 粗细，默认 1
          },
          markLine: {
            data: key
              ? [
                {
                  key,
                  val
                }
              ]
              : [],
            lineStyle: {
              color: color.tool.line,
              width: 1
            }
          }
          //  isRestore: data.waveX.isRestore
        },
        toolTip: {
          symbol: {
            show: true,
            color: color.tool.symbol,
            size: 3
          },
          lineStyle: {
            // 标线样式
            color: color.tool.line, // 颜色，默认 '#FA9A4D'
            width: 1 // 粗细，默认 1
          },
          fontStyle: {
            // 标注字体样式
            color: color.tool.font, // 颜色，默认 '#fff'
            size: "14px", // 大小，默认 '12px'
            family: "Microsoft YaHei", // 字体，默认 'Microsoft YaHei'
            weight: "normal" // 粗细，默认 'normal'
          },
          background: {
            // 提示框背景
            color: color.tool.background // 颜色，默认 'rgba(50, 50, 50, 0.3)'
          },
          formatter (params) {
            that.circleOption(od, chart, params.key);
            that.waveXOption(od, chart, params.val, params.key);
          }
        },
        backgroundColor: color.background
      };
      chart.waveY.setOption(waveYOption);
    },
    /* 更新趋势图数据 */
    trendOption (od, trendIns) {
      const color = this.color;
      const trend = od.trend;
      const trendOption = {
        title: {
          name: this.$t('HeaderEdge.secondLevel2_3')//趋势图
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 28 // 离容器下边距离，默认 60
        },
        x: {
          name: "",
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          type: "time",
          data: trend.x,
          fontStyle: {
            color: color.axis.font,
            size: "14px"
          },
          lineStyle: {
            color: color.axis.line
          },
          splitLineStyle: {
            color: color.axis.splitLine
          }
        },
        y: {
          name: "°",
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          data: trend.y,
          fontStyle: {
            color: color.axis.font,
            size: "14px"
          },
          lineStyle: {
            color: color.axis.line
          },
          splitLineStyle: {
            color: color.axis.splitLine
          }
        },
        series: {
          type: "line", // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1 // 粗细，默认 1
          },
          symbol: {
            show: true,
            color: color.series.symbol,
            size: 3
          }
        },
        toolTip: {
          symbol: {
            show: true,
            color: color.tool.symbol,
            size: 3
          },
          lineStyle: {
            // 标线样式
            color: color.tool.line, // 颜色，默认 '#FA9A4D'
            width: 1 // 粗细，默认 1
          },
          fontStyle: {
            // 标注字体样式
            color: color.tool.font, // 颜色，默认 '#fff'
            size: "14px", // 大小，默认 '12px'
            family: "Microsoft YaHei", // 字体，默认 'Microsoft YaHei'
            weight: "normal" // 粗细，默认 'normal'
          },
          background: {
            // 提示框背景
            color: color.tool.background // 颜色，默认 'rgba(50, 50, 50, 0.3)'
          },
          formatter: params => {
            od.date = getTime(params.val);
            this.setRequestData(od, params.val);
          }
        },
        backgroundColor: color.background
      };
      trendIns.setOption(trendOption);
    }
  },
  created () {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "overturn"
    });
  }
};
