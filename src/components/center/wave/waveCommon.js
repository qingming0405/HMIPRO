import html2canvas from "html2canvas";
import {
  getdefaultCode,
  defaultCode,
  round,
  getTime,
  cloneObj,
  getUnit,
  hasClass,
  addClass,
  removeClass,
  isVibOfPos,
  makeWaveY,
  integralFft,
  setSrcSpectrum,
  getCodeObj,
  getUnit1,
  matchRule
} from "utils/utils.js";
import myChart from "@/assets/js/myCharts.js";
export default {
  name: "wave",
  data () {
    return {
      requestData: {
        /* 请求参数 */
        trend: null /* 趋势图 */,
        wave: null /* 波形图 */
      },
      iconList: [
        /* 右侧按钮 */
        {
          class: "icon-duichengpinshuaicha_huaban",
          title: "对称频率差",
          isCheck: false,
          parentClass: ""
        } /* 对称频率差 */,
        {
          class: "icon-hanningchuang_huaban",
          title: "汉宁窗",
          isCheck: true,
          parentClass: "check-icon"
        } /* 汉宁窗 */,
        {
          class: "icon-qiehuanXzhoujiebi_huaban",
          title: "切换阶比",
          isCheck: false,
          parentClass: ""
        } /* 切换阶比 */,
        {
          class: "icon-dingweidaobeipin_huaban",
          title: "定位到1倍频",
          isCheck: false,
          parentClass: ""
        } /* 一倍频 */,
        {
          class: "icon-dipinguolv_huaban",
          title: "低频过滤",
          isCheck: false,
          parentClass: ""
        } /* 低频过滤 */,
        {
          class: "icon-youxiaopinshuaishezhi_huaban",
          title: "有效频率设置",
          isCheck: false,
          parentClass: ""
        } /* 有效频率 */,
        {
          class: "icon-biaozhubeipin_huaban",
          title: "标注倍频",
          isCheck: false,
          parentClass: ""
        } /* 倍频 */,
        {
          class: "icon-biaozhu_huaban",
          title: "添加标注",
          isCheck: false,
          parentClass: ""
        } /* 添加标注 */,
        {
          class: "icon-quxiaobiaozhu_huaban",
          title: "取消标注",
          isCheck: false,
          parentClass: ""
        } /* 取消标注 */,
        {
          class: "icon-xunhuanxunfeng_huaban_huaban",
          title: "循环寻峰",
          isCheck: false,
          parentClass: ""
        } /* 循环寻峰 */,
        {
          class: "icon-guzhangpinshuaimingxi_huaban_huaban",
          title: "故障频率明细",
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-xiaozhunbeipin_huaban",
          title: "校准倍频",
          isCheck: false,
          parentClass: ""
        } /* 校准倍频 */
      ],
      chartData: {
        /* 图谱信息 */
      },
      paramsData: {
        /* 图谱对应参数信息 */
      },
      currentIndex: 0 /* 当前显示图谱下标 */,
      currentKey: "" /* 当前显示信息字段 */,
      reportMsg: {
        //报告参数
      },
      color: {},
      spectrumTools: [] /* 右侧图标dom对象 */,
      isNewChart: true /* 是否打开新图谱 */,
      isShowFailure: false /* 是否显示故障频率 */,
      offset: {
        /* 鼠标偏移量 */
        x: 0 /* 横向 */,
        y: 0 /* 纵向 */,
        ref: "" /* 需要移动dom的ref */
      },
      clickTrend: false, /* 是否点击趋势图 */
      speedType: [this.$t('wave.HighWaveform'), this.$t('wave.LowWaveform')], /* 波形密度下拉选择//高密度波形 低密度波形 */
      allFreq: {}, /* 所有测点有效频率上下限 */
      dropPos: null, /* 拖入测点信息 */
      charts: {},//Charts图表实例
      // isAllFreq: false,
      // start: 0,
      // chooseFreq: [],
      chartBtn: [
        /* 0 */ {
          class: "icon-selectunit_huaban",
          title: "单位选择",
          flag: [1, 2, 0, 3, 7, 8, 9],
          viewType: [2]
        },
        /* 1 */ {
          class: "icon-MAX_huaban",
          title: "最大化",
          flag: [1, 2, 0, 3, 7, 8, 9],
          viewType: [0, 1, 2]
        },
        /* 2 */ {
          class: "icon-exporemusic_huaban",
          title: "音频导出",
          flag: [0]
        },
        /* 3 */ {
          class: "icon-exportdata_huaban",
          title: "数据导出",
          flag: [0, 1, 3, 7, 8],
          viewType: [0, 1, 2]
        },
        /* 4 */ {
          class: "icon-restore_huaban",
          title: "重置",
          flag: [1, 2, 0, 3, 6, 7, 8, 9],
          viewType: [0, 1, 2]
        },
        /* 5 */ {
          class: "icon-enlarge_huaban",
          title: "开窗放大",
          flag: [1, 2, 0, 3, 6, 7, 8, 9],
          viewType: [0, 1, 2]
        },
        /* 6 */ {
          class: "icon-savemage_huaban",
          title: "保存为图片",
          flag: [1, 2, 0, 3, 6, 7, 8, 9],
          viewType: [0, 1, 2]
        },
        /* 7 */ {
          class: "icon-setpower_huaban",
          title: "所有测点有效频率设置",
          flag: [1]
        },
        /* 8 */ {
          class: "icon-subtime_huaban",
          title: "时间差",
          flag: [0]
        },
        /* 9 */ {
          class: "icon-pinputuduishuzuobiaoqiehuan_huaban",
          title: "对数坐标",
          flag: [1, 3, 7, 8],
          viewType: [0, 1, 2]
        },
        /* 10 */ {
          class: "icon-zhuansumaichong_huaban1",
          title: "转速脉冲",
          flag: [0] //opt 图谱类型为0显示
          // viewType: [0, 1, 2]
        },
        /* 11 */ {
          class: "icon-youxiaopinshuaishezhi_huaban",
          title: "时域波形过滤",
          flag: [0]
        }
      ]
    };
  },
  created () {
    this.$store.commit("set_keepAlive", { method: "add", keepAlive: "wave" });
    this.speedType = [this.$t('wave.HighWaveform'), this.$t('wave.LowWaveform')]
    this.chartBtn = [
        /* 0 */ {
        class: "icon-selectunit_huaban",
        title: this.$t('icon.unitSelect'),//单位选择
        flag: [1, 2, 0, 3, 7, 8, 9],
        viewType: [2]
      },
        /* 1 */ {
        class: "icon-MAX_huaban",
        title: this.$t('icon.maximize'),//最大化
        flag: [1, 2, 0, 3, 7, 8, 9],
        viewType: [0, 1, 2]
      },
        /* 2 */ {
        class: "icon-exporemusic_huaban",
        title: this.$t('icon.AudioExport'),//音频导出
        flag: [0]
      },
        /* 3 */ {
        class: "icon-exportdata_huaban",
        title: this.$t('icon.dataExport'),//数据导出
        flag: [0, 1, 3, 7, 8],
        viewType: [0, 1, 2]
      },
        /* 4 */ {
        class: "icon-restore_huaban",
        title: this.$t('icon.reset'),//重置
        flag: [1, 2, 0, 3, 6, 7, 8, 9],
        viewType: [0, 1, 2]
      },
        /* 5 */ {
        class: "icon-enlarge_huaban",
        title: this.$t('icon.openWindow'),//开窗放大
        flag: [1, 2, 0, 3, 6, 7, 8, 9],
        viewType: [0, 1, 2]
      },
        /* 6 */ {
        class: "icon-savemage_huaban",
        title: this.$t('icon.SavePicture'),//保存为图片
        flag: [1, 2, 0, 3, 6, 7, 8, 9],
        viewType: [0, 1, 2]
      },
        /* 7 */ {
        class: "icon-setpower_huaban",
        title: this.$t('icon.EffectiveFreqAllPos'),//所有测点有效频率设置
        flag: [1]
      },
        /* 8 */ {
        class: "icon-subtime_huaban",
        title: this.$t('icon.TimeDifference'),//时间差
        flag: [0]
      },
        /* 9 */ {
        class: "icon-pinputuduishuzuobiaoqiehuan_huaban",
        title: this.$t('icon.LogarithmicCoordinates'),//对数坐标
        flag: [1, 3, 7, 8],
        viewType: [0, 1, 2]
      },
        /* 10 */ {
        class: "icon-zhuansumaichong_huaban1",
        title: this.$t('icon.SpeedPulse'),//转速脉冲
        flag: [0] //opt 图谱类型为0显示
        // viewType: [0, 1, 2]
      },
        /* 11 */ {
        class: "icon-youxiaopinshuaishezhi_huaban",
        title: this.$t('icon.TimeWaveformFilter'),//时域波形过滤
        flag: [0]
      }
    ]
  },
  computed: {
    waveOption () {
      /* 波形图 */
      const key = this.currentKey;
      const index = this.currentIndex;
      const chart = this.chartData;
      if (chart[key] && this.paramsData[key]) {
        const color = this.paramsData[key].color
        const data = chart[key].wave;
        const fileName = this.paramsData[key].fileName;
        const btnIndex = 3 * index;
        const that = this;
        return {
          type: {
            chart: 1,/* 1.波形频谱图 2.对比分析 */
            chartType: 'wave',/* 波形（wave）,频谱（spectrum） */
          },
          title: {
            show: true,
            name: that.$t('wave.Waveform'),
            fontStyle: {
              weight: "bold", // 粗细，默认 'bold'
              size: "18px", // 大小，默认 '20px'
              family: "Arial", // 字体，默认 'Arial'
              color: color.titleColor, // 颜色，默认 '#000'
              align: "left" // 对齐方式，默认 'left'
            },
          },
          grid: {
            top: 40, // 离容器上边距离，默认 60
            right: 10, // 离容器右边距离，默认 '10%
            left: 80, // 离容器左边距离，默认 '10%'
            bottom: 28 // 离容器下边距离，默认 60
          },
          x: {
            name: data.curUnitX,
            nameStyle: {
              color: color.axis.name,
              size: "14px",
              bold: "normal"
            },
            type: "category",
            data: data.curX,
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
            name: data.curUnitY,
            nameStyle: {
              color: color.axis.name,
              size: "14px",
              bold: "normal"
            },
            data: data.curY,
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
            formatter () {
              that.paramsData[key].developChart.chart = "wave";
            }
          },
          tools: {
            // 开窗放大
            enlarge: {
              show: true,
              dom: document.getElementsByClassName("icon-enlarge_huaban_wave")[
                btnIndex
              ]
            },
            // 最大化 / 还原
            maxOrMin: {
              show: true,
              dom: document.getElementsByClassName("icon-MAX_huaban_wave")[
                btnIndex
              ]
            },
            // 重置
            restore: {
              show: true,
              dom: document.getElementsByClassName("icon-restore_huaban_wave")[
                btnIndex
              ],
              formatter (isRestore) {
                that.paramsData[key].isRestore.wave = !isRestore;
              }
            },
            // 时间差
            timeDifferent: {
              show: true,
              dom: document.getElementsByClassName("icon-subtime_huaban_wave")[
                btnIndex
              ],
              formatter (isTimeDifferent) {
                that.paramsData[key].isRestore.wave = isTimeDifferent;
              }
            },
            // 导出图片
            exportImage: {
              show: true,
              dom: document.getElementsByClassName("icon-savemage_huaban_wave")[
                btnIndex
              ],
              imageName: that.$t('wave.Waveform') + "_" + fileName
            },
            // 导出数据
            exportData: {
              fileName: that.$t('wave.Waveform') + "_" + fileName,
              show: true,
              dom: document.getElementsByClassName(
                "icon-exportdata_huaban_wave"
              )[btnIndex]
            },
            // 导出音频
            exportAudio: {
              fileName: that.$t('wave.Audio') + "_" + fileName,
              show: true,
              dom: document.getElementsByClassName(
                "icon-exporemusic_huaban_wave"
              )[btnIndex],
              maxFreq: this.freq
            },
            speedPulse: {
              show: true,
              dom: document.getElementsByClassName(
                "icon-zhuansumaichong_huaban1_wave"
              )[btnIndex],
              formatter (isSpeedPulse) {
                that.paramsData[key].speedWavePulse.speedPulse = isSpeedPulse;
              },
              data: that.paramsData[key].speedWavePulse
            }
          },
          backgroundColor: color.background,
        }
      } else {
        console.log("charts无数据");
      }
    },
    spectrumOption () {
      // if (this.chooseFreq !== [] && this.chooseFreq.length > 0) {
      // this.getAllFreq();
      // }
      const chart = this.chartData;
      const key = this.currentKey;
      const index = this.currentIndex;
      if (chart[key] && this.paramsData[key]) {
        const color = this.paramsData[key].color
        const data = chart[key].spectrum;
        const params = this.paramsData[key];
        const chartData = params.chartData;
        const fileName = params.fileName;
        const iconIndex = 12 * index;
        const btnIndex = 3 * index + 1;
        this.$refs.iconList && (this.spectrumTools = this.$refs.iconList);
        const that = this;
        return {
          type: {
            chart: 1,/* 1.波形频谱图 2.对比分析 */
            chartType: 'spectrum',/* 波形（wave）,频谱（spectrum） */
          },
          title: {
            show: true,
            name: that.$t('wave.spectrogram'),//频谱图
            fontStyle: {
              weight: "bold", // 粗细，默认 'bold'
              size: "18px", // 大小，默认 '20px'
              family: "Arial", // 字体，默认 'Arial'
              color: color.titleColor, // 颜色，默认 '#000'
              align: "left" // 对齐方式，默认 'left'
            }
          },
          grid: {
            top: 40, // 离容器上边距离，默认 60
            right: 10, // 离容器右边距离，默认 '10%
            left: 80, // 离容器左边距离，默认 '10%'
            bottom: 28 // 离容器下边距离，默认 60
          },
          x: {
            name: data.curUnitX,
            nameStyle: {
              color: color.axis.name,
              size: "14px",
              bold: "normal"
            },
            type: "category",
            data: data.curX,
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
            name: data.curUnitY,
            nameStyle: {
              color: color.axis.name,
              size: "14px",
              bold: "normal"
            },
            data: data.curY,
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
            type: chartData.spectrumType, // 类型，默认 'line'
            lineStyle: {
              // 样式
              color: color.series.line, // 颜色，默认 '#0032ff
              width: 1 // 粗细，默认 1
            },
            dataMsg: {
              oneFreq: chartData.oneFreq, // 一倍频
              rotateSpeed: chartData.speed, // 转速
              specType: chartData.chartType, // 频谱图类型
              spectral: chartData.spectral, // 采样点数
              setPower: chartData.isSetPower // 是否设置有效频率，默认 false
            },
            markLine: {
              data: data.markLine,
              isRefresh: data.isRefresh,//是否需要刷新整个图谱
              lineStyle: {
                color: color.markLine.line
              },
              fontStyle: {
                color: color.markLine.font,
                size: "14px"
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
            formatter () {
              that.paramsData[key].developChart.chart = "spectrum";
            }
          },
          tools: {
            // 开窗放大
            enlarge: {
              show: true,
              dom: document.getElementsByClassName("icon-enlarge_huaban_wave")[
                btnIndex
              ]
            },
            // 最大化 / 还原
            maxOrMin: {
              show: true,
              dom: document.getElementsByClassName("icon-MAX_huaban_wave")[
                btnIndex
              ]
            },
            // 重置
            restore: {
              show: true,
              dom: document.getElementsByClassName("icon-restore_huaban_wave")[
                btnIndex
              ],
              formatter (isRestore) {
                if (isRestore) {
                  const list = params.iconList;
                  list[0].isCheck = false;
                  list[0].parentClass = "";
                  list[6].isCheck = false;
                  list[6].parentClass = "";
                  if (hasClass(that.spectrumTools[iconIndex + 0], "check-icon")) {
                    removeClass(that.spectrumTools[iconIndex + 0], "check-icon");
                  }
                  if (hasClass(that.spectrumTools[iconIndex + 6], "check-icon")) {
                    removeClass(that.spectrumTools[iconIndex + 6], "check-icon");
                  }
                }
              }
            },
            // 差频
            subFreq: {
              show: true,
              dom: this.spectrumTools[iconIndex + 0]
            },
            // 1倍频
            oneFreq: {
              show: true,
              dom: this.spectrumTools[iconIndex + 3]
            },
            // 标注倍频
            labelFreq: {
              show: true,
              dom: this.spectrumTools[iconIndex + 6],
              // icon: params.iconList[6]
            },
            // 寻峰
            peakSearch: {
              show: true,
              dom: this.spectrumTools[iconIndex + 9]
            },
            // 添加标注
            addLabel: {
              show: true,
              dom: this.spectrumTools[iconIndex + 7]
            },
            // 取消标注
            cancelLabel: {
              show: true,
              dom: this.spectrumTools[iconIndex + 8]
            },
            // 校准倍频
            setPeak: {
              show: true,
              dom: this.spectrumTools[iconIndex + 11]
            },
            // 导出图片
            exportImage: {
              show: true,
              dom: document.getElementsByClassName("icon-savemage_huaban_wave")[
                btnIndex
              ],
              imageName: that.$t('wave.spectrogram') + "_" + fileName
            },
            // 导出数据
            exportData: {
              fileName: that.$t('wave.spectrogram') + "_" + fileName,
              show: true,
              dom: document.getElementsByClassName(
                "icon-exportdata_huaban_wave"
              )[btnIndex]
            }
          },
          backgroundColor: color.background
        };
      } else {
        console.log("charts无数据");
      }
    },
  },
  watch: {
    "$store.state.waveMsg": {
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
    },
    "$store.state.structure" () {
      //监听structure的变化
      this.$nextTick(() => {
        if (this.paramsData && this.paramsData[this.currentKey]) {
          this.paramsData[this.currentKey].structure = Math.abs(
            --this.paramsData[this.currentKey].structure
          );
        }
        if (this.charts && this.charts[this.currentKey] && this.charts[this.currentKey].trend && this.charts[this.currentKey].trend.chart) {
          this.charts[this.currentKey].trend.chart.resize()
        }
      });
    }
  },
  methods: {
    // 打开图谱
    openChartList (key, type) {
      if (typeof key !== "string") return;
      typeof type === "string" && (type = Number(type[0]));
      const [, , macId, posId, posType] = key.split("_");
      const state = this.$store.state;
      let pos = state.pos[macId][0]
      const defaultCode = getdefaultCode(pos.dgm_type);
      const eigenvalue = defaultCode[posType];
      let keyArr = Object.keys(this.chartData);
      let isReal;
      //实时数据按钮判断
      if (type === 0) {
        isReal = Number(state.currentTime === 0);
      } else {
        isReal = this.paramsData[key].isReal;
      }
      this.destoryKey = "";
      if (type === 0 || type === 1 || type == 4 || type == 5) {
        this.currentKey = key;
        this.isNewChart = false;
        const params = state.srcParams;
        const time = params.time;
        const speed = params.speed;
        const limit = params.limit;
        const trendDensity = params.density; /* 趋势数据查询密度 */
        let speedType = 0//转速密度，默认为低密度
        if (this.paramsData && this.paramsData[key]) {
          speedType = Number(this.paramsData[key].speedType == this.$t('wave.HighWaveform'))//高密度波形
        }
        this.requestData = {
          trend: {
            machineId: macId,
            positionId: posId,
            positionType: posType,
            startTime: time.start,
            endTime: time.end,
            toSpeed: speed.max,
            fromSpeed: speed.min,
            lowerLimit: limit.lower,
            upperLimit: limit.upper,
            value: eigenvalue.filed,
            code: eigenvalue.code,
            waveType: 0,
            density: Number(trendDensity.type),
          },
          wave: {
            machineId: macId,
            positionId: posId,
            positionType: posType,
            isFFT: false,
            isWave: true,
            isReal,
            currTime: [state.currentTime],
            type: speedType,//0:低密度波形；1：高密度波形
            dataSource: 'c_vib',//8000数据类型
          }
        };
        for (let k in this.paramsData) {
          this.paramsData[k].isNewChart = {
            wave: false,
            spectrum: false,
            trend: false
          };
          this.paramsData[k].isShow = false;
          if (key == k) {
            let param = this.paramsData[k]
            this.paramsData[k].isNewChart.spectrum = true;
            // 切换页面时判断是否为position_type == 1，dgmtype == 4时的转速波形只有高密度波形
            if (param.pos.position_type == 1) {
              if (param.pos.dgm_type == 4) {
                this.requestData.trend.waveType = 1 /* 高密度波形 */
                this.requestData.wave.type = 1
              }
            }
            this.requestData.wave.t_root = param.pos.t_root
          }
          this.paramsData[k].delayed = 0;
        }
      }
      let openKey = this.$store.state.chooseTitle.key; //当前打开页的key值
      let title = this.$store.state.chooseTitle;
      switch (type) {
        case 0 /* 打开图表 */:
          this.$forceUpdate()
          this.currentIndex = keyArr.length;
          this.initParams(key, type);
          this.$nextTick(() => {
            const chart = this.$refs.waveCharts[this.currentIndex];
            const wave = chart.children;
            chart.style = "";
            wave[1].style = "";
            wave[2].style = "";
            wave[3].style = "";
            wave[0].style = "";
            this.$store.commit("changeDomStructure");
          })
          break;
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true;
          this.currentIndex = keyArr.indexOf(openKey); //获取当前打开页的currentIndex
          // 切换图表时若实时数据为开启开启定时器
          if (this.paramsData[key].isReal == 1) {
            clearTimeout(this.paramsData[key].getReal.timer);
            this.paramsData[key].getReal.timer = setTimeout(this.getWaveData, 6000);
          }
          // this.getWaveData(); //趋势图跳转波形时间不同再次请求
          if (this.chartData[key].trend.srcY.length === 0) {
            //防止趋势图请求被打断后空白图谱
            this.getTrendData();
          }
          this.$nextTick(() => {
            this.$store.commit("changeDomStructure");
            if (this.chartData[key].trend.srcY.length > 0) {
              if (this.charts[key].trend) {
                if (this.charts[key].trend.chart) {
                  this.charts[key].trend.chart.resize();
                }
              }
            }
          });
          if (this.chartData[key].wave.srcY.length === 0) {
            //防止波形频谱图请求被打断后空白图谱
            this.getWaveData();
          }
          break;
        case 2 /* 关闭图表 */:
          clearTimeout(this.paramsData[key].getReal.timer);
          this.$delete(this.chartData, key);
          this.$delete(this.paramsData, key);
          this.$delete(this.charts, key);
          keyArr = Object.keys(this.chartData); //重新获取一次chartData的keyArr（所有存在的页数key）
          this.currentIndex = keyArr.indexOf(openKey);
          break;
        case 4 /* 图表跳转图谱 */:
          this.paramsData[key].isShow = true;
          if (state.currentTime != 0) {
            this.paramsData[key].getReal.isReal = false;
            this.paramsData[key].getReal.class = "disable-btn"
            this.requestData.wave.isReal = 0
          }
          this.currentIndex = keyArr.indexOf(openKey);
          this.getWaveData();
          break;
      }
    },
    // 构造初始数据
    initParams (key, type = 0) {
      const [, , macId, posId, posType] = key.split("_");
      const isReal = this.requestData.wave.isReal;
      const state = this.$store.state;
      const getRealBtnClassName = isReal ? "" : "disable-btn";
      this.isNewChart = true;
      let maxFreq = 0;
      let minFreq = 0;
      let pos = cloneObj(this.dropPos, true);
      this.dropPos = null;
      // let allPos = cloneObj(this.allFreq, true);
      let allPos = [];
      const eigenvalue = defaultCode[posType];
      //拿t_id
      let t_id = state.checkMsg.tree.t_id;
      let requestData = this.requestData
      /*
      (将allFreq的数据修改为allFreq[t_id] = [测点频率设置])
        1.allPos存储当前机组所有测点，将频率范围初始化
        2.1>若this.allFreq长度不为0时，循环遍历其中设置频率范围的测点，遍历this.allFreq,allPos将arr中的flag与allPos的flag对比，一致则将this.allFreq的频率范围赋值给allPos，最后直接将allPos赋值给this.allFreq
          2>若this.allFreq长度为0时,直接将allPos赋值给this.allFreq；
      */
      if (type === 0) {
        const posMsg = state.pos[macId];
        // const vibType = [1, 3, 4, 6, 8, 9, 12, 200];
        const vibType = [1, 3, 4, 6, 8, 9, 12, 17, 200];
        for (let i = 0, l = posMsg.length; i < l; i++) {
          const value = posMsg[i];
          const pId = Number(value.position_id);
          const pType = Number(value.position_type);
          if (vibType.includes(pType)) {
            allPos.push({
              val: value.position_name /* 测点名 */,
              // flag: value.posFlag, /* 唯一测点 组织id_测点id_测点type */
              flag: value.position_type == 6 || value.position_type == 11 || value.position_type == 12 || value.position_type == 13 ? `${t_id}_${value.pos_loc}_${value.position_type}` : `${t_id}_${value.units.pos_loc}_${value.position_type}`  /* 组织id_(tt_pos_loc || pos_loc)_测点type */,
              minFreq: 0 /* 开始频率 */,
              maxFreq: 0 /* 截止频率 */,
              changflag: 0 /* 0:；2：通过设置全部有效频率修改 */,
              posFlag: value.posFlag /* 唯一测点 */
            });
          }
          if (
            pos === null &&
            pId === Number(posId) &&
            pType === Number(posType)
          ) {
            pos = cloneObj(value, true);
          }
        }
      }
      // this.allFreq = allPos;
      if (!this.allFreq[t_id] || this.allFreq[t_id].length === 0) {
        // this.allFreq = [];
        this.$set(this.allFreq, t_id, allPos)
      } else {
        if (type === 0) {
          let allFreq = this.allFreq[t_id]
          for (let j = 0, len = allPos.length; j < len; j++) {
            const val = allPos[j];
            let isHas = false;
            for (let i = 0, l = allFreq.length; i < l; i++) {
              let value = allFreq[i];
              if (val.flag === value.flag) {
                isHas = true;
                break;
              }
            }
            if (!isHas) {
              allFreq.push(val);
            }
          }
          // this.allFreq[t_id] = allFreq;
        }
        for (let i = 0, l = this.allFreq[t_id].length; i < l; i++) {
          const value = this.allFreq[t_id][i];
          if (value.minFreq !== 0 || value.maxFreq !== 0) {
            if (pos.position_type == 6 || pos.position_type == 11 || pos.position_type == 12 || pos.position_type == 13 ? `${t_id}_${pos.pos_loc}_${pos.position_type}` : `${t_id}_${pos.units.pos_loc}_${pos.position_type}` === value.flag
            ) {
              maxFreq = value.maxFreq;
              minFreq = value.minFreq;
              break;
            }
          }
        }
      }
      const unitX = {
        wave: "s",
        spectrum: "Hz"
      };
      let unitY = getUnit(eigenvalue.code, pos);
      if (pos.dgm_type == 10) { //WL9100默认单位'm/s²'
        unitY = 'm/s²'
      }

      const isNx = {
        isCheck: false,
        className: "",
        chartType: "line",
        type: 1
      };
      const failure = {
        name: "频率",
        speedName: "频"
      };
      let iconList = [
        /* 右侧按钮 */
        {
          class: "icon-duichengpinshuaicha_huaban",
          title: this.$t('icon.FreqDifference'),//对称频率差
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-hanningchuang_huaban",
          title: this.$t('icon.hanning'),//汉宁窗
          isCheck: true,
          parentClass: "check-icon"
        },
        {
          class: "icon-qiehuanXzhoujiebi_huaban",
          title: this.$t('icon.SwitchingOrderRatio'),//切换阶比
          isCheck: isNx.isCheck,
          parentClass: isNx.className
        },
        {
          class: "icon-dingweidaobeipin_huaban",
          title: this.$t('icon.oneFreqDoubling'),//定位到1倍频
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-dipinguolv_huaban",
          title: this.$t('icon.LowFreqFilter'),//低频过滤
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-youxiaopinshuaishezhi_huaban",
          title: this.$t('icon.EffectiveFreq'),//有效频率设置
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-biaozhubeipin_huaban",
          title: this.$t('icon.LabelledFreq'),//标注倍频
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-biaozhu_huaban",
          title: this.$t('icon.AddAnnotations'),//添加标注
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-quxiaobiaozhu_huaban",
          title: this.$t('icon.CancelLabel'),//取消标注
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-xunhuanxunfeng_huaban_huaban",
          title: this.$t('icon.CyclePeakSearch'),//循环寻峰
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-guzhangpinshuaimingxi_huaban_huaban",
          title: this.$t('icon.FaultFrequencyDetail'),//故障频率明细
          isCheck: false,
          parentClass: ""
        },
        {
          class: "icon-xiaozhunbeipin_huaban",
          title: this.$t('icon.CalibrationFreq'),//校准倍频
          isCheck: false,
          parentClass: ""
        }
      ]
      const failureHead = ["标识", "名称", "频率(Hz)", "幅值"];
      if (posType === "8" || posType === "9") {
        unitX.wave = "smpl";
        unitX.spectrum = "NX";
        isNx.isCheck = true;
        isNx.className = "check-icon";
        isNx.chartType = "bar-line";
        isNx.type = 2;
        failure.name = this.$t('wave.rank')//阶次
        failure.speedName = this.$t('wave.MoveOrder');//动阶次
        failureHead[2] = this.$t('wave.rank') + "NX";//阶次
        iconList[4].title = this.$t('wave.LowOrderFilter')//'低阶次过滤'
        iconList[5].title = this.$t('wave.EffectOrderFilter')//有效阶次过滤
      }
      const density = {
        isSpeed: false,
        type: ""
      };
      /* MHD(dgmType == 4)的转速测点无低密度波形 */
      if (posType == 1) {
        density.isSpeed = true; /* 是否为转速测点 */
        if (pos.dgm_type != 4) {
          density.type = this.$t('wave.LowWaveform');//低密度波形
        } else {
          density.type = this.$t('wave.HighWaveform');//高密度波形
          requestData.trend.waveType = 1 /* 高密度波形 */
          requestData.wave.type = 1
        }
      }
      let rmsTitle = "rms：";
      if (pos.position_type === 4 || pos.position_type === 9) {
        rmsTitle = "gD：";
      }
      if (pos.position_type === 14) {
        rmsTitle = this.$t('eigenvalue.PreloadValue') + "：";//预紧力值
      }
      this.$set(this.chartData, key, {
        trend: {
          srcX: [],
          curX: [],
          srcY: [],
          curY: [],
          srcSpeed: [],
          curSpeed: [],
          srcUnitY: unitY,
          curUnitY: unitY
        },
        wave: {
          srcX: [],
          curX: [],
          curUnitX: unitX.wave,
          srcY: [],
          curY: [],
          srcUnitY: unitY,
          curUnitY: unitY
        },
        spectrum: {
          srcX: [],
          curX: [],
          curUnitX: unitX.spectrum,
          ratio: [],
          hanning: [],
          srcY: [],
          curY: [],
          srcUnitY: unitY,
          curUnitY: unitY,
          markLine: [],
          isRefresh: true,
        }
      });
      this.$nextTick(() => {
        this.$set(this.charts, key, {
          trend: {
            chart: null, //趋势图实例
            dom: this.$refs[`trend${this.currentKey}`][0]
          }
        });
      });
      this.reportMsg[key] = {
        waveMaximization: 255
      }
      // 现场所有测点的趋势图纵坐标单位应和flex一样改为mm/s²
      const isMMS2 = bothConfig.mms2.indexOf(t_id.toString()) !== -1
      let color = cloneObj(this.color_wave, true)
      color = cloneObj(this.changeColor(t_id, color), true)
      // this.$set(this.color, key, color)
      this.$set(this.paramsData, key, {
        color,
        isReal,
        getReal: {
          isReal: Boolean(isReal),
          class: getRealBtnClassName,
          timer: null
        },
        empty: {
          wave: {
            isShow: true,
            text: `${pos.position_name}${this.$t('Common.noDataText')}`
          },
          trend: {
            isShow: true,
            text: `${pos.position_name}${this.$t('Common.noDataText')}`
          }
        },
        structure: 0 /* 结构样式, 0: 左右下; 1: 上中下 */,
        isNewChart: {
          wave: true,
          spectrum: true,
          trend: true
        },
        pos,
        fileName: `${pos.mac_name}_${pos.position_name}`,
        isSpeed: posType === "1" /* 是否为转速测点 */,
        chartType: density.isSpeed /* 图谱类型(是否为转速测点) */,
        speedType: density.type /* 转速测点波形密度（高密度、低密度） */,
        iconList: iconList,
        isRestore: {
          wave: false,
          spectrum: true
        },
        isShow: true,
        isLog: false,
        chartData: {
          /* 图谱信息 */
          spectrumType: isNx.chartType /* 频谱图类型(bar-line, line) */,
          chartType: isNx.type /* 1: 频谱图, 2: 阶次 */,
          oneFreq: 0 /* 一倍频 */,
          freq: 0 /* 频率 */,
          speed: 0 /* 转速 */,
          rmsTitle /* 有效值标题 */,
          rms: 0 /* 有效值 */,
          time: 0 /* 左上角显示时间 */,
          isSetPower: false /* 是否设置有效频率 */,
          spectral: 0 /* 采样点数 */,
          samples: 0 /* 总采样点数 */,
          p: 1000000000 /* 峰值 */,
          pp: 1000000000 /* 峰峰值 */,
          isMMS2: isMMS2,/* 趋势图单位是否要处理为mm/s² */
          direc: 0,/* 8000的总振值 */
        },
        developChart: {
          chart: "wave",
          wave: true,
          spectrum: true,
          icon: "+"
        },
        freq: {
          lowFreq: 0,
          lowerLimit: minFreq,
          upperLimit: maxFreq
        },
        failureList: {
          gear: {
            id: 0,
            name: `啮合${failure.name}`,
            isView: true,
            status: false,
            children: []
          },
          bear: {
            id: 1,
            name: `轴承通过${failure.name}`,
            isView: true,
            status: false,
            children: []
          },
          speed: {
            id: 2,
            name: `转${failure.speedName}`,
            isView: true,
            status: false,
            children: []
          }
        },
        failure: {
          /* 故障频率窗口信息 */
          name:
            failure.name /* 故障频率传动链名字尾缀，阶次测点显示“阶次”，其他测点显示“频率” */,
          speedName:
            failure.speedName /* 故障频率传动链转速名字尾缀，阶次测点显示“动阶次”，其他测点显示“频” */,
          clickNum: 0 /* 点击次数 */,
          isShow: false /* 故障频率显隐 */,
          impeller: pos.dgm_type == 2 /* 是否为叶轮 */,
          analogSpeed: 0 /* 模拟转速 */,
          analogValue: [
            /* 通过频率 */
            { title: this.$t('waveFault.BPF') + '1', value: 1, name: 'BPF.1' },//通过频率
            // { title: '通过频率2', value: 1, name: 'BPF.2' },
            // { title: '通过频率3', value: 1, name: 'BPF.3' },
            // { title: '通过频率4', value: 1, name: 'BPF.4' },
            // { title: '通过频率5', value: 1, name: 'BPF.5' },
            // { title: '通过频率6', value: 1, name: 'BPF.6' },
          ],
          isStartFailure: false,//是否标注叶片故障频率
          isShowList: false /* 故障频率明细显隐 */,
          list: {
            /* 故障频率明细 */
            head: failureHead /* 表头 */,
            body: [] /* 内容 */
          },
          isSetSpeed: false /* 是否启用模拟转速 */
        },
        updateTime: state.currentTime,
        tId: t_id, //设置所有测点频率时需要
        speedWavePulse: {
          /* 转速脉冲 */
          speedPulse: false, //转速脉冲是否打开
          speed_wave: null, //转速波形
          XArray: [], //转速脉冲描点X值
          YArray: [], //转速脉冲描点Y值
          posType: posType, //测点类型
          isDegree: false, //是否开启阶次，若阶次开启时无转速脉冲
          dgmType: pos.dgm_type
        },
        waveFreq: {
          needFilter: false,
          lowerLimit: 0,
          upperLimit: 0
        },//时域波形滤波上下限
        isSpectrum: false /* 长采样测点时是否获取频谱图数据 */,
        TitleName: this.$store.state.chooseTitle.name,
        getDegree: {
          /* 是否开启阶次 */
          isDegree: false,
          class: "disable-btn",
          degreeTime: 0
        },
        delayed: 0, //波形延时请求时间
        maximization: {
          trend: false,
          wave: false,
          spectrum: false,
        },
        dataType: [
          { val: this.$t('Common8000.TimedHisData'), isChecked: true, type: 1 },//定时历史数据
          { val: this.$t('Common8000.StartStopData'), isChecked: false, type: 2 },//启停机数据
          { val: this.$t('Common8000.AlarmStorageData'), isChecked: false, type: 3 },//报警存储数据
        ],//8000数据类型选择
        isTrendClose: false,//趋势图谱是否显示
      });
      this.getTrendData();
      this.requestData.wave.t_root = pos.t_root
      this.getWaveData();
      this.getFailureFrequency();
    },
    changeColor (t_id, color) {
      return color
    },
    // 结构切换
    changeStructure () {
      this.$nextTick(() => {
        const className = "wave-spectrum-chart-1";
        const index = this.currentIndex;
        let elem = this.$refs.waveCharts[index];
        // if(elem === undefined){
        //   elem = this.$refs.waveCharts[index - 1];
        // }
        const params = this.paramsData[this.currentKey];
        //判断dom是否包含该class
        if (hasClass(elem, className)) {
          // 结构切换为左右下
          params.structure = 1;
          removeClass(elem, className);
          if (hasClass(elem, "wave-spectrum-chart-3")) {
            //若切换时developChart是放大状态
            removeClass(elem, "wave-spectrum-chart-3");
            const developChart = this.paramsData[this.currentKey].developChart;
            developChart.icon = "+";
            developChart.wave = true;
            developChart.spectrum = true;
          }
          this.$store.commit("changeDomStructure");
        } else {
          // 结构却换为上中下
          params.structure = 0;
          addClass(elem, className);
          this.$store.commit("changeDomStructure");
        }
        this.closeTrend()
        this.charts[this.currentKey].trend && this.charts[this.currentKey].trend.chart && this.charts[this.currentKey].trend.chart.resize();
      });
    },
    // flag==1点击开启或关闭趋势；flag==2结构切换时变动class
    closeTrend () {
      let param = this.paramsData[this.currentKey]
      const className = "wave-spectrum-chart-1";
      const index = this.currentIndex;
      const trend = this.$refs[`trend${this.currentKey}`][0]
      let elem = this.$refs.waveCharts[index];
      if (param.isTrendClose) {
        if (hasClass(elem, className)) {
          if (hasClass(elem, 'wave-spectrum-chart-4')) {
            removeClass(elem, 'wave-spectrum-chart-4');
          }
          addClass(elem, 'wave-spectrum-chart-5');
        } else {
          if (hasClass(elem, 'wave-spectrum-chart-5')) {
            removeClass(elem, 'wave-spectrum-chart-5');
          }
          addClass(elem, 'wave-spectrum-chart-4');
        }
      } else {
        if (hasClass(elem, 'wave-spectrum-chart-5')) {
          removeClass(elem, 'wave-spectrum-chart-5');
        }
        if (hasClass(elem, 'wave-spectrum-chart-4')) {
          removeClass(elem, 'wave-spectrum-chart-4');
        }

      }
      this.paramsData[this.currentKey].structure = Math.abs(
        --this.paramsData[this.currentKey].structure
      );
      this.$nextTick(() => {
        this.charts[this.currentKey].trend && this.charts[this.currentKey].trend.chart && this.charts[this.currentKey].trend.chart.resize();
      })

    },
    setTrendOption () {
      const key = this.currentKey;
      const chart1 = this.chartData;
      const index = this.currentIndex;
      if (chart1[key]) {
        const chart = chart1[key].trend;
        const color = this.paramsData[key].color;
        const that = this;
        const paramsData = this.paramsData[key];
        // const data = chart[index].trend;
        const btnIndex = 3 * this.currentIndex + 2;
        let option = {
          type: {
            chart: 1,/* 1.波形频谱图 2.对比分析 */
            chartType: 'trend',/* 波形（wave）,频谱（spectrum）,趋势图（trend） */
          },
          title: {
            show: true,
            name: "趋势图",
            fontStyle: {
              weight: "bold", // 粗细，默认 'bold'
              size: "18px", // 大小，默认 '20px'
              family: "Arial", // 字体，默认 'Arial'
              color: color.titleColor, // 颜色，默认 '#000'
              align: "left" // 对齐方式，默认 'left'
            }
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
            data: chart.curX,
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
            name: chart.curUnitY,
            nameStyle: {
              color: color.axis.name,
              size: "14px",
              bold: "normal"
            },
            wtype: 'wave_trend',
            data: chart.curY,
            speed: chart.curSpeed,
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
            formatter: function (params) {
              that.$emit("loadingImg", true);
              that.$store.commit("setCurrentTime", params.val);
              paramsData.getReal.isReal = false
              paramsData.getReal.class = "disable-btn"
              paramsData.updateTime = params.val;
              const wave = that.requestData.wave;
              wave.currTime = [params.val];
              wave.isReal = 0;
              if (paramsData.pos.dgm_type == 11) {
                // 8000数据类型
                wave.dataSource = that.chartData[key].trend.dataType[params.key]
              }

              that.clickTrend = true;
              paramsData.speedWavePulse.speedPulse = false;
              paramsData.getDegree.isDegree = false;
              paramsData.getDegree.class = "disable-btn";
              that.degreeChangeParam(paramsData.getDegree.isDegree)
              paramsData.speedWavePulse.isDegree = false;
              paramsData.delayed = 300;
              let chart = that.chartData[that.currentKey]
              if (paramsData.pos.position_type == "8" || paramsData.pos.position_type == "9") {
                chart.wave.curUnitX = "smpl";
                chart.spectrum.curUnitX = "NX";
                paramsData.iconList[2].isCheck = true;
                paramsData.iconList[2].parentClass = "check-icon";
                paramsData.chartData.spectrumType = "bar-line";
                paramsData.failure.name = this.$t('wave.rank');//阶次
                paramsData.failure.speedName = this.$t('wave.MoveOrder');//动阶次
                paramsData.failure.list.head[2] = this.$t('wave.rank') + "NX"//阶次
                paramsData.chartData.chartType = 2;
                paramsData.iconList[4].title = this.$t('wave.LowOrderFilter')//低阶次过滤
                paramsData.iconList[5].title = this.$t('wave.EffectOrderFilter')//有效阶次过滤
              }
              that.chartData[that.currentKey].spectrum.isRefresh = true
              that.getWaveData();

            }
          },
          tools: {
            // 开窗放大
            enlarge: {
              show: true,
              dom: document.getElementsByClassName("icon-enlarge_huaban_wave")[
                btnIndex
              ]
            },
            // 最大化 / 还原
            maxOrMin: {
              show: true,
              dom: document.getElementsByClassName("icon-MAX_huaban_wave")[
                btnIndex
              ]
            },
            // 重置
            restore: {
              show: true,
              dom: document.getElementsByClassName("icon-restore_huaban_wave")[
                btnIndex
              ]
            },
            // 导出图片
            exportImage: {
              show: true,
              dom: document.getElementsByClassName("icon-savemage_huaban_wave")[
                btnIndex
              ],
              imageName: this.$t('Common.trend') + "_" + paramsData.fileName//趋势图
            }
          },
          backgroundColor: color.background
        };
        if (!this.charts[key].trend.chart) {
          this.charts[key].trend.chart = myChart.init(
            this.charts[key].trend.dom
          );
        }
        this.charts[key].trend.chart.setOption(option);
      } else {
        //防止点击过快请求未完成，数据为空
        setTimeout(this.setTrendOption, 2000);
        console.log("charts无数据");
      }
    },
    // 阶次开启或关闭后改变的参数
    degreeChangeParam (isDegree) {
      let chart = this.chartData[this.currentKey]
      let paramsData = this.paramsData[this.currentKey]
      if (isDegree) {
        chart.wave.curUnitX = "smpl";
        chart.spectrum.curUnitX = "NX";
        paramsData.iconList[2].isCheck = true;
        paramsData.iconList[2].parentClass = "check-icon";
        paramsData.chartData.spectrumType = "bar-line";
        paramsData.failure.name = this.$t('wave.rank')//阶次
        paramsData.failure.speedName = this.$t('wave.MoveOrder');//动阶次
        paramsData.failure.list.head[2] = this.$t('wave.rank') + "NX"//阶次
        paramsData.chartData.chartType = 2;
        paramsData.iconList[4].title = this.$t('wave.LowOrderFilter')//低阶次过滤
        paramsData.iconList[5].title = this.$t('wave.EffectOrderFilter')//有效阶次过滤
      } else {
        if (Number(paramsData.pos.position_type) == 14) {
          chart.wave.curUnitX = "μs";
          chart.wave.srcUnitX = "μs";
          chart.wave.curUnitY = "%";
          chart.wave.srcUnitY = "%";
        } else {
          chart.wave.curUnitX = "s";
        }
        chart.spectrum.curUnitX = "Hz";
        paramsData.iconList[2].isCheck = false;
        paramsData.iconList[2].parentClass = "";
        paramsData.chartData.spectrumType = "line";
        paramsData.failure.name = this.$t('Common.freq');//频率
        paramsData.failure.speedName = this.$t('wave.freq1')//"频"
        paramsData.failure.list.head[2] = this.$t('Common.freq') + "(Hz)"//频率
        paramsData.chartData.chartType = 1;
        paramsData.iconList[4].title = this.$t('icon.LowFreqFilter')//'低频过滤'
        paramsData.iconList[5].title = this.$t('wave.EffectFreqFilter')//有效频率过滤
      }
      let failure = {
        name: paramsData.failure.name,
        speedName: paramsData.failure.speedName,
      }
      paramsData.failureList.gear.name = `啮合${failure.name}`
      if (paramsData.failureList.gear.children && paramsData.failureList.gear.children.length > 0) {
        for (let k = 0; k < paramsData.failureList.gear.children.length; k++) {
          let gear1 = paramsData.failureList.gear.children[k]
          if (gear1.children) {
            this.setFailName(gear1.children, failure.name, 2)
          }
        }
      }
      paramsData.failureList.bear.name = `轴承通过${failure.name}`
      if (paramsData.failureList.bear.children && paramsData.failureList.bear.children.length > 0) {
        for (let k = 0; k < paramsData.failureList.bear.children.length; k++) {
          let bear = paramsData.failureList.bear.children[k]
          if (bear.children) {
            this.setFailName(bear.children, failure.name, 2)

          }
        }
      }
      paramsData.failureList.speed.name = `转${failure.speedName}`
      if (paramsData.failureList.speed.children && paramsData.failureList.speed.children.length > 0) {
        let speed = paramsData.failureList.bear
        this.setFailName(speed.children, failure.speedName, 1)
      }
    },
    // 阶次频率转换重置故障频率名称
    /* device:设备列表 name：阶次或频率 num：切割字符个数 */
    setFailName (device, name, num) {
      for (let k = 0; k < device.length; k++) {
        let fname = device[k].name
        device[k].name = fname.substr(0, fname.length - num) + name
      }
    },
    handler (index, e) {
      const tag = e.target;
      let btn = this.chartBtn;
      const className = "chart-btn-active";
      let params = this.paramsData[this.currentKey];
      if (index === 1) {
        /* 最大化 */
        if (params.maximization.trend) {
          btn[index].class = "icon-MAX_huaban";
          btn[index].title = "最大化";
        } else {
          btn[index].class = "icon-back_huaban";
          btn[index].title = "返回";
        }
        params.maximization.trend = !params.maximization.trend;
        this.maximization(params.maximization.trend, 2);
      } else if (index === 0) {
        /* 单位选择 */
        this.selectUnit(2);
      }
    },
    // 设置标题
    setTitle (index) {
      const btn = this.chartBtn;
      return btn[index].title;
    },
    // 设置class
    setClass (index) {
      const icon = this.chartBtn[index];
      let str = "";
      str += `${icon.class} ${icon.class}_wave`;
      return str;
    },
    // 设置图标显示
    setViewIcon (item, opt) {
      const viewOpt = item.flag.includes(opt);
      if (this.paramsData[this.currentKey]) {
        const pos = this.paramsData[this.currentKey].pos
        // WL9100单位默认m/s²，且无法进行单位切换
        if (item.title == '单位选择' && pos.dgm_type == 10) {
          return false
        }
        if (opt !== 8) {
          return viewOpt;
        } else if (viewOpt) {
          return item.viewType.includes(this.expertType);
        }
      }


    },
    // 设置右边频谱图图标显示
    setrViewIcon (item) {
      const param = this.paramsData[this.currentKey]
      // 振动切换阶比后频谱图只存在阶比状态,阶次测点只存在阶比状态
      if (param.chartData.chartType == 2 && item.title == '切换阶比') {
        return false;
      }
      return true;
    },
    // 设置波形有效频率
    setFilterWave () {
      const waveFreq = this.paramsData[this.currentKey].waveFreq
      this.$WavePop({
        type: 0,
        title: this.$t('wave.effecFreqBand'),//'有效频段',
        upperLimit: waveFreq.upperLimit,
        lowerLimit: waveFreq.lowerLimit,
      }).then(res => {
        if (res) {
          if (res.lowerLimit === '' || res.upperLimit === '') {
            this.$pop('有效频率输入不正确！')
            return;
          }
          else if (Number(res.lowerLimit) < 0 || Number(res.upperLimit) < 0) {
            this.$pop('有效频率输入不正确！')
            return;
          }
          else if (Number(res.upperLimit) > 0 && Number(res.lowerLimit) > Number(res.upperLimit)) {
            this.$pop('有效频率输入不正确！')
            return;
          }
          const lowerLimit = Number(res.lowerLimit)
          const upperLimit = Number(res.upperLimit)
          if ((waveFreq.lowerLimit - lowerLimit) === 0 && (waveFreq.upperLimit - upperLimit) === 0) {
            return;
          }
          waveFreq.lowerLimit = lowerLimit;
          waveFreq.upperLimit = upperLimit;
          //时域波形滤波处理
          if (waveFreq.lowerLimit === 0 && waveFreq.upperLimit === 0) {
            waveFreq.needFilter = false;
          }
          else {
            waveFreq.needFilter = true;
          }
          this.requestData.wave.isFilterWave = waveFreq.needFilter
          this.requestData.wave.filterLow = waveFreq.lowerLimit
          this.requestData.wave.filterHigh = waveFreq.upperLimit
          if (this.requestData.wave.isReal === 1) {
            this.requestData.wave.currTime = [0]
          }
          // this.getFilterWave();
          this.getWaveData()
        }
      })
    },
    // 设置所有测点有效频率
    setAllFreq () {
      let tId = this.paramsData[this.currentKey].tId
      this.$WavePop({
        allFreq: this.allFreq[tId],
        title: "所有测点有效频率",
        type: 4
      }).then(res => {
        if (res) {
          if (res.isclear == 0) {
            let allFreq = cloneObj(res.allFreq, true);
            for (let i = 0, l = allFreq.length; i < l; i++) {
              let value = allFreq[i];
              if (value.maxFreq < 0 || value.minFreq < 0) {
                this.$pop("有效频率输入不正确！");
                break;
              } else if (Number(res.upperLimit) > 0) {
                if (Number(value.maxFreq) < Number(value.minFreq)) {
                  this.$pop("有效频率输入不正确！");
                  break;
                }
              }
              for (let j = 0; j < allFreq.length; j++) {
                let val = allFreq[j];
                if (value.flag === val.flag && value.changflag == 2) {
                  val.maxFreq = value.maxFreq;
                  val.minFreq = value.minFreq;
                }
              }
            }
            this.allFreq[tId] = allFreq;
          } else if (res.isclear == 1) {
            for (let k = 0; k < this.allFreq[tId].length; k++) {
              let val = this.allFreq[tId][k];
              val.minFreq = 0;
              val.maxFreq = 0;
            }
          }
          for (let k = 0; k < this.allFreq[tId].length; k++) {
            let value = this.allFreq[tId][k];
            value.changflag = 0
            /* paramsData图谱对应参数信息 */
            for (const key in this.paramsData) {
              const val = this.paramsData[key];
              //判断是否为同一测点类型 && value.changflag === 1
              let flag = value.position_type == 6 || value.position_type == 11 || value.position_type == 12 || value.position_type == 13 ? `${val.tId}_${val.pos.pos_loc}_${val.pos.position_type}` : `${val.tId}_${val.pos.units.pos_loc}_${val.pos.position_type}`
              if (flag === value.flag) {
                // 将该测点类型的频率范围设置为
                // if (Number(value.maxFreq) !== 0 || Number(value.minFreq) !== 0) {
                val.freq.upperLimit = Number(value.maxFreq);
                val.freq.lowerLimit = Number(value.minFreq);
                if (key !== this.currentKey) {
                  let a = val.freq.lowerLimit;
                  let b = val.freq.upperLimit;
                  const start = this.getIndex(a, 0, key);
                  let end = this.getIndex(b, 0, key) + 1;
                  let data = cloneObj(this.chartData[key].spectrum);
                  isNaN(end) && (end = data.srcX.length);/* 若上限设置取不到（设置频率超出上限）取最大长度 */
                  b == 0 && (end = data.srcX.length);
                  // 有效频率
                  data.curX = data.srcX.slice(start, end);
                  data.curY = data.srcY.slice(start, end);
                  this.$set(this.chartData[key], "spectrum", data);
                  // this.isNewChart = true;
                }
              }

            }
          }
          let type = 0
          if (this.chartData[this.currentKey].spectrum.srcUnitY != this.chartData[this.currentKey].spectrum.curUnitY) {
            type = 1
          }
          this.getFreq(this.currentKey, type);
        }
      });
    },
    /*
    1.判断现打开的所有窗口的测点posFlag是否与设置的allFreq的flag一致,且changeflag === 1；
    2.一致则将频率最大值与最小值设定到paramData
    3.循环筛选频率 */
    getAllFreq () {
      let tId = this.paramsData[this.currentKey].tId
      // 判断测点是否一致
      for (let i = 0, l = this.allFreq[tId].length; i < l; i++) {
        const value = this.allFreq[tId][i];
        /* paramsData图谱对应参数信息 */
        for (const key in this.paramsData) {
          const val = this.paramsData[key];
          //判断是否为同一测点类型
          if (val.position_type == 6 || val.position_type == 11 || val.position_type == 12 || val.position_type == 13 ? `${t_id}_${val.pos_loc}_${val.position_type}` : `${t_id}_${val.units.pos_loc}_${val.position_type}` === value.flag
          ) {
            // 将该测点类型的
            val.freq.upperLimit = Number(value.maxFreq);
            val.freq.lowerLimit = Number(value.minFreq);
            break;
          }
        }
      }
      const type = 0;
      // 筛选超出频率的数据
      for (const key in this.paramsData) {
        const params = this.paramsData[key];
        const data = cloneObj(this.chartData[key].spectrum, true);
        const freq = cloneObj(params.freq, true);
        const isHanning = Number(params.iconList[1].isCheck);
        const isNX = Number(params.iconList[2].isCheck);
        const hanningAxis = ["srcY", "hanning"];
        const NXAxis = ["srcX", "ratio"];
        const srcX = data.srcX;
        let srcY = data[hanningAxis[isHanning]];
        if (type === 1) {
          srcY = data.curY;
        }
        const index = this.getIndex(freq.lowFreq);
        let a = freq.lowerLimit;
        let b = freq.upperLimit;
        const start = this.getIndex(a);
        let end = this.getIndex(b) + 1;
        isNaN(end) && (end = srcX.length);
        b == 0 && (end = srcX.length);
        let arrY = [];
        // 低频过滤
        for (let i = 0, l = srcY.length; i <= l; i++) {
          if (index !== 0 && i <= index) {
            arrY.push(0);
          } else {
            arrY.push(srcY[i]);
          }
        }
        this.isNewChart = true;
        // 有效频率
        data.curX = srcX.slice(start, end);
        data.curY = arrY.slice(start, end);
        // 计算对数
        if (params.isLog) {
          const y = [];
          for (let i = 0, l = data.curY.length; i < l; i++) {
            const value = data.curY[i];
            if (value === 0) {
              y.push(0);
            } else {
              y.push((Math.log(data.curY[i]) / Math.log(10)) * 20);
            }
          }
          data.curY = y;
        }
        this.chartData[key].spectrum = data;
      }
    },

    // 设置图标
    setIcon (bool, type = 0) {
      const iconArr = [
        ["icon-zhongzi_xuanzekuang", "icon-zhongzi_xuanzekuang1"],
        ["icon-zhankai_huaban", "icon-shouqi_huaban"],
        [
          "icon-danxuankuang-weixuanzhong_huaban",
          "icon-danxuankuang-yixuanzhong_huaban"
        ]
      ];
      return `iconfont ${iconArr[type][Number(bool)]}`;
    },
    // 获取趋势图数据
    getTrendData () {
      this.clickTrend = false;
      this.isNewChart = true;
      const params = this.paramsData[this.currentKey];
      let rd = cloneObj(this.requestData.trend);
      this.$getApi.getPositionEigenvalue(rd).then(res => {
        if (res) {
          params.isNewChart.trend = true;
          this.setTrend(res);
        } else {
          params.empty.trend.isShow = true;
        }
      });
    },
    // 构造趋势图数据
    setTrend (data) {
      const list = data.tendencyList;
      let x = [];
      let y = [];
      let y1 = [];
      let Speed = [];
      let date = 0;
      let dataType = [];//8000数据类型数组
      const index = this.currentKey;
      const chart = this.chartData;
      const rd = this.requestData;
      const l = list.length;
      const params = this.paramsData[index];
      const eigenvalue = defaultCode[params.pos.position_type];
      if (l >= 1) {
        params.empty.trend.isShow = false;
        const msg = cloneObj(chart[index], true);
        for (let i = 0; i < l; i++) {
          const value = list[i];
          value.saveTime > date && (date = value.saveTime);
          x.push(value.saveTime);
          y.push(value.tempValue);
          Speed.push(value.speed);
          if (params.chartData.isMMS2) {
            if (getUnit(eigenvalue.code, params.pos) == 'g' || getUnit(eigenvalue.code, params.pos) == 'gD')
              y1.push(value.tempValue * 9807);/* g转m/s² */
          }
          dataType.push(value.dataSource)
        }
        if (params.pos.dgm_type == 11) {
          msg.trend.dataType = dataType;
        }
        msg.trend.srcX = x;
        msg.trend.curX = x;
        msg.trend.srcY = y;
        msg.trend.curY = y;
        msg.trend.srcSpeed = Speed;
        msg.trend.curSpeed = Speed;
        if (msg.trend.curUnitY !== msg.trend.srcUnitY) {
          const newUnit = msg.trend.curUnitY;
          msg.trend.curUnitY = msg.trend.srcUnitY;
          this.unitHandler(2, newUnit);
        }
        if (params.chartData.isMMS2) {
          if (msg.trend.curUnitY == 'g') {
            msg.trend.curUnitY = 'mm/s²'
          }
          if (getUnit(eigenvalue.code, params.pos) == 'g' || getUnit(eigenvalue.code, params.pos) == 'gD') {
            msg.trend.curY = y1
          }
        }
        this.$set(this.chartData, index, msg);
        this.setTrendOption();
      } else {
        params.empty.trend.isShow = true;
        // this.$pop('无趋势数据');
      }
    },
    // 获取波形数据
    getWaveData () {
      const params = this.paramsData[this.currentKey];
      // pro使用type区分、edge用name区分
      if (this.$store.state.chooseTitle && (this.$store.state.chooseTitle.type == 'wave' || this.$store.state.chooseTitle.name == 'wave')) {
        // this.start = Date.now();
        //若趋势图键盘右移超出范围的情况，不请求
        if (this.requestData.wave.currTime[0] == null) {
          this.$emit("loadingImg", false);
          return;
        }
        const chart = this.chartData[this.currentKey];
        this.isNewChart = true;
        const params = this.paramsData[this.currentKey];
        // 关闭实时数据后清除定时器
        if (!params.getReal.isReal) {
          clearTimeout(params.getReal.timer);
        }
        this.$emit("loadingImg", true);
        if (!params.getDegree.isDegree) {
          this.$getApi.getWaveformAndSpectrum(this.requestData.wave).then(res => {
            if (res) {
              params.isNewChart.wave = true;
              params.isNewChart.spectrum = true;
              // 2000v1不做软件滤波
              if (params.pos.dgm_type != 1 && res.bySw_Filter && !params.chartData.isSetPower) {
                //软件滤波'0':'不滤波','1':'2Hz高通滤波','2':'10Hz高通滤波'
                let lowerFreq = 0;
                if (res.bySw_Filter == 0) {
                  // 若设置了有效频率取有效频率
                  if (params.freq.lowerLimit < lowerFreq) {
                    params.freq.lowerLimit = lowerFreq;
                  }
                } else if (res.bySw_Filter == 1) {
                  lowerFreq = 2;
                  if (params.freq.lowerLimit < lowerFreq) {
                    params.freq.lowerLimit = lowerFreq;
                  }
                } else if (res.bySw_Filter == 2) {
                  lowerFreq = 10;
                  if (params.freq.lowerLimit < lowerFreq) {
                    params.freq.lowerLimit = lowerFreq;
                  }
                }
              }
              // 阶次滤波,振动阶次、包络阶次、冲击阶次加上了阶次滤波
              if (res.order_filter) {
                if (params.pos.position_type && (params.pos.position_type == 8 || params.pos.position_type == 9 || params.pos.position_type == 16)) {
                  let lowerFreq = Number(res.order_filter);
                  if (params.freq.lowerLimit < lowerFreq) {
                    params.freq.lowerLimit = lowerFreq;
                  }
                }
              }
              this.setWaveData(res);
            } else {
              params.empty.isShow = true;
            }
            this.$emit("loadingImg", false);
          });
        } else {
          const pos = params.pos;
          let requestData = {
            machine_id: pos.machine_id,
            position_id: pos.position_id,
            position_type: pos.position_type,
            time: params.getDegree.degreeTime,
            dgm_type: pos.dgm_type
          };
          this.$getApi.getDegree(requestData).then(res => {
            if (res) {
              if (res.wave) {
                // 开启阶次
                chart.wave.curUnitX = "smpl";
                chart.spectrum.curUnitX = "NX";
                params.iconList[2].isCheck = true;
                params.iconList[2].parentClass = "check-icon";
                params.chartData.spectrumType = "bar-line";
                params.chartData.chartType = 2;
                params.isNewChart.wave = true;
                params.isNewChart.spectrum = true;
                if (res.bySw_Filter) {
                  //软件滤波'0':'不滤波','1':'2Hz高通滤波','2':'10Hz高通滤波'
                  let lowerFreq = 0;
                  if (res.bySw_Filter == 0) {
                    if (params.freq.lowerLimit < lowerFreq) {
                      params.freq.lowerLimit = lowerFreq;
                    }
                  } else if (res.bySw_Filter == 1) {
                    lowerFreq = 2;
                    if (params.freq.lowerLimit < lowerFreq) {
                      params.freq.lowerLimit = lowerFreq;
                    }
                  } else if (res.bySw_Filter == 2) {
                    lowerFreq = 10;
                    if (params.freq.lowerLimit < lowerFreq) {
                      params.freq.lowerLimit = lowerFreq;
                    }
                  }
                }
                let waveObject = res.waveObject;
                waveObject.wave = res.wave;
                let obj = {
                  bySw_Filter: res.bySw_Filter,
                  info: [
                    {
                      saveTime: res.time,
                      value: res.value,
                      waveObject: waveObject
                    }
                  ]
                };
                this.setWaveData(obj);
              } else {
                this.paramsData[this.currentKey].speedWavePulse.isDegree = false;
                this.paramsData[this.currentKey].getDegree.isDegree = false;
                this.paramsData[this.currentKey].getDegree.class = "disable-btn";
                this.degreeChangeParam(false)
                this.$pop("阶次波形无数据");
              }
            } else {
              params.empty.isShow = true;
            }
            this.$emit("loadingImg", false);
          });
        }
        params.speedWavePulse.isDegree = params.getDegree.isDegree;
      } else {
        clearTimeout(params.getReal.timer)
      }
    },
    // 切换数据后重新绘制选中故障
    reDrawFail (data, type) {
      this.chartData[this.currentKey].spectrum.isRefresh = true
      // 判断是否存在选中的故障频率重新计算画图
      if (data.status == true) {
        data.status = false
        this.checkFailure(data, type)
      } else {
        // 选中最子集
        if (data.children && data.children.length > 0) {
          for (let i = 0; i < data.children.length; i++) {
            this.reDrawFail(data.children[i], type)
          }
        }
      }
    },
    //获取转速脉冲时间数组
    getPulseTime () {
      const params = this.paramsData[this.currentKey];
      const chart = this.chartData[this.currentKey];
      params.speedWavePulse.XArray = [];
      params.speedWavePulse.YArray = [];
      // this.paramsData[this.currentKey].speedWavePulse.speedPulse = !params.speedWavePulse.speedPulse
      // if (params.speedWavePulse.speedPulse){//转速脉冲开启时
      if (
        params.speedWavePulse.speed_wave && params.speedWavePulse.speed_wave.wave &&
        params.speedWavePulse.speed_wave.wave.length > 0
      ) {
        const speed_wave = params.speedWavePulse.speed_wave.wave;
        const waveX = chart.wave.curX;
        const waveY = chart.wave.curY;
        const waveLen = Math.min(waveX.length, waveY.length);
        let speed_index = 0; //转速波形点索引
        let t_speed_x = 0; //转速点在时间轴上的位置
        let XArray = []; //转速脉冲点的X值
        let YArray = []; //转速脉冲点的Y值
        for (let i = 0; i < waveLen; i++) {
          if (waveX[i] >= t_speed_x) {
            if (speed_index >= speed_wave.length) {
              break;
            }
            XArray.push(waveX[i]);
            YArray.push(waveY[i]);
            t_speed_x = waveX[i] + 60 / speed_wave[speed_index];
            speed_index++;
          }
        }
        params.speedWavePulse.XArray = XArray;
        params.speedWavePulse.YArray = YArray;
      } else {
        this.paramsData[this.currentKey].speedWavePulse.speedPulse = false;
        this.$pop("当前转速波形为空");
      }
      // }
    },
    // 构造波形数据
    setWaveData (data) {
      let info = data.info[0];
      const chart = this.chartData;
      const index = this.currentKey;
      const msg = cloneObj(chart[index], true);
      const params = this.paramsData[index];
      const chartData = params.chartData;
      let pos = params.pos;
      const rd = this.requestData;
      if (info !== undefined) {
        params.speedWavePulse.speed_wave = info.speed_wave;
        const obj = info.waveObject;
        if ((params.pos.position_type == 14 && obj !== null) || (params.pos.position_type != 14 && obj !== null && obj.wave && obj.wave.length > 0)) {
          // 获取阶次数据，阶次存在数据时转速脉冲是否显示
          params.speedWavePulse.isDegree = params.getDegree.isDegree;
          const pType = params.pos.position_type;
          params.empty.wave.isShow = false;
          const y = obj.wave;
          chartData.freq = obj.freq;
          params.getReal.isReal ? params.getDegree.degreeTime = 0 : params.getDegree.degreeTime = info.value.saveTime_Com
          // 转速测点时取speed_value,其他类型测点取speed
          if (pType == 1) {
            chartData.oneFreq = info.value.speed_value === 0 ? 0.908 / 60 : info.value.speed_value / 60;
            chartData.speed = round(info.value.speed_value, 4);
          } else {
            chartData.oneFreq = info.value.speed === 0 ? 0.908 / 60 : info.value.speed / 60;
            chartData.speed = round(info.value.speed, 4);
          }
          // 计算故障频率
          !params.failure.isSetSpeed && (params.failure.analogSpeed = params.chartData.speed);
          this.setAnalogSpeed()
          chartData.rms = round(info.value[rd.trend.value], 4);
          let eigenvalue = this.getEigenvalueCode(pos, rd.trend.value)
          if ((pos.dgm_type == 3 || pos.dgm_type == 4 || pos.dgm_type == 9) && pType == 3) {
            chartData.rmsUnit = getUnit1(pos.units.byIntegral, pos.units.unitName[0]);
          } else {
            chartData.rmsUnit = getUnit(eigenvalue.code, pos)
          }
          chartData.time = getTime(info.value.saveTime_Com);
          chartData.samples = obj.samples;
          if (pos.dgm_type != 10 && pos.dgm_type != 11 && (pType === 3 || pType === 8)) {
            chartData.p = round(info.value.vib_p, 4);
            chartData.pp = round(info.value.vib_pp, 4);
            let eigenvalueP = this.getEigenvalueCode(pos, 'vib_p')
            chartData.pUnit = getUnit(eigenvalueP.code, pos)
            let eigenvaluePP = this.getEigenvalueCode(pos, 'vib_p')
            chartData.ppUnit = getUnit(eigenvaluePP.code, pos)
          }
          // 8000总振值
          if (pos.dgm_type == 11 && pType == 3) {
            chartData.direc = this.$t('Common.noDataText')//'无数据'
            if (info.value.Direc) {
              chartData.direc = round(info.value.Direc, 4);
            }
          }
          if (pType === 6) {
            chartData.p = round(info.value.rock_p, 4);
            chartData.pp = round(info.value.rock_pp, 4);
            let eigenvalueP = this.getEigenvalueCode(pos, 'rock_p')
            chartData.pUnit = getUnit(eigenvalueP.code, pos)
            let eigenvaluePP = this.getEigenvalueCode(pos, 'rock_p')
            chartData.ppUnit = getUnit(eigenvaluePP.code, pos)
          }
          if (chartData.chartType === 2) {
            if (obj.cycles > 0 && obj.samples > 0) {
              chartData.spectral = obj.samples / obj.cycles;
            } else if (obj.b[2] > 0 && obj.samples) {
              chartData.spectral = obj.samples / obj.b[2];
            } else {
              chartData.spectral = 1;
            }
          }
          if (Number(pos.position_type) === 14) {
            if (info !== undefined) {
              const obj = info.waveObject;
              if (obj !== null) {
                chartData.rms = round(info.value[rd.trend.value], 4);
                chartData.time = getTime(info.value.saveTime_Com);
                chartData.samples = obj.samples;
                const wave_y = obj;
                let len = obj.length;
                let spaceTime = 10; //UT目前每隔10ns(spaceTime)采一个点，且转换成um显示波形横坐标(暂时写死，以后要改再说)
                //that.selectPosition:wStart\wRange这两个数据需要后端接口获取测点信息提供
                let wStart = Number(pos.wStart); //波形起始位置
                let wRange = Number(pos.wRange); //波形范围
                let x = [];
                let y = [];
                for (let i = 0; i < len; i++) {
                  let val_x = (i * spaceTime) / 1000;
                  if (val_x < wStart) {
                    continue;
                  }
                  if (wRange > 0 && val_x > Number(wStart + wRange)) {
                    continue;
                  }
                  x.push(val_x);
                  y.push(wave_y[i]);
                }
                msg.wave.srcX = x;
                msg.wave.curX = x;
                msg.wave.srcY = y;
                msg.wave.curY = y;
                // 当为螺栓测点波形时，x轴单位为μs,Y轴单位为%
                msg.wave.curUnitX = "μs";
                msg.wave.srcUnitX = "μs";
                msg.wave.curUnitY = "%";
                msg.wave.srcUnitY = "%";
                msg.spectrum.srcX = [];
                msg.spectrum.curX = [];
                msg.spectrum.srcY = [];
                msg.spectrum.curY = [];
                msg.spectrum.hanning = [];
                this.$set(chart, index, msg);
              }
            }
          } else {
            // 计算波形图x轴
            this.freq = obj.freq;
            let l = y.length;
            const addNum = l / obj.freq / l;
            let x = [];
            let i = 0;
            // 阶次与频谱区分(新增)
            if (chartData.chartType === 2) {
              for (i = 0; i < l; i++) {
                x.push(i);
              }
            } else {
              for (; i < l; i++) {
                x.push(i * addNum);
              }
            }
            msg.wave.srcX = x;
            msg.wave.srcY = y;
            if (this.paramsData[this.currentKey].waveFreq.needFilter && info.filterWave != null) {
              const fy = info.filterWave;
              const fx = x.slice(0, fy.length)
              msg.wave.curX = fx;
              msg.wave.curY = fy;
            }
            else {
              msg.wave.curX = x;
              msg.wave.curY = y;
            }
            this.$set(chart[index], "wave", msg.wave);
            // 不为长采样时直接获取频谱数据
            if (Number(pos.position_type) !== 200) {
              // 取频谱数据
              const fftX = [];
              const fftY = [];
              const hanning = [];
              const spectrumData = setSrcSpectrum(
                obj.freq,
                y,
                chartData.chartType,
                chartData.spectral
              );
              // const outX = info.fft.OutX;
              // i = 0;
              // l = outX.length;
              // for (; i < l; i++) {
              //    fftX.push(outX[i]);
              //    fftY.push(info.fft.OutY[i]);
              //    hanning.push(info.fftWithHanning.OutY[i]); /* 汉宁窗 */
              // }
              // 计算切换阶比数据
              const outX = spectrumData.fftX;
              let ratio = [];
              // 转速测点时取speed_value,其他类型测点取speed
              if (chartData.chartType === 1) {
                if (pType == 1) {
                  if (info.value.speed_value != 0) {
                    for (let i = 0, len = outX.length; i < len; i++) {
                      ratio.push(
                        Math.round(
                          ((outX[i] * 60) / Number(info.value.speed_value)) * 100000
                        ) / 100000
                      );
                    }
                  }
                  //高密度波形时
                  if (
                    this.paramsData[this.currentKey].speedType == this.$t('wave.HighWaveform')//"高密度波形"
                  ) {
                    msg.spectrum.curUnitY = "mV";
                    msg.wave.curUnitY = "mV";
                  } else if (
                    this.paramsData[this.currentKey].speedType == this.$t('wave.LowWaveform')//"低密度波形"
                  ) {
                    msg.wave.curUnitY = "rpm";
                    msg.spectrum.curUnitY = "rpm";
                  }
                } else {
                  if (info.value.speed != 0) {
                    for (let i = 0, len = outX.length; i < len; i++) {
                      ratio.push(
                        Math.round(
                          ((outX[i] * 60) / Number(info.value.speed)) * 100000
                        ) / 100000
                      );
                    }
                  }
                }
              }
              let unit0 = pos.units && pos.units.unitName[0]
              let unit1 = unit0 //积分后单位
              // 计算积分单位
              if ((pos.dgm_type == 3 || pos.dgm_type == 4 || pos.dgm_type == 9) && pType == 3) {
                if (pos.units)
                  unit1 = getUnit1(pos.units.byIntegral, pos.units.unitName[0]);
              }
              if (unit1 != unit0) {
                msg.spectrum.curUnitY = unit1
              }
              msg.spectrum.srcX = spectrumData.fftX;
              msg.spectrum.curX = spectrumData.fftX;
              msg.spectrum.srcY = spectrumData.fftY;
              msg.spectrum.curY = spectrumData.hanning;
              msg.spectrum.hanning = spectrumData.hanning;

              // msg.spectrum.srcX = outX;
              // msg.spectrum.curX = outX;
              // msg.spectrum.srcY = info.fft.OutY;
              // msg.spectrum.curY = info.fftWithHanning.OutY;
              // msg.spectrum.hanning = info.fftWithHanning.OutY;
              msg.spectrum.ratio = ratio;
              this.$set(chart, index, msg);
            } else {
              this.isGetSpectrumData(2);
            }
          }
          this.getFreq();
          let newUnit = "";
          if (
            chart[index].wave.curUnitY !== chart[index].wave.srcUnitY &&
            (pType == 3 || pType == 4 || pType == 8)
          ) {
            newUnit = chart[index].wave.curUnitY;
            chart[index].wave.curUnitY = chart[index].wave.srcUnitY;
            this.unitHandler(0, newUnit);
          }
          if (
            chart[index].spectrum.curUnitY !== chart[index].spectrum.srcUnitY &&
            (pType == 3 || pType == 4 || pType == 8)
          ) {
            newUnit = chart[index].spectrum.curUnitY;
            chart[index].spectrum.curUnitY = chart[index].spectrum.srcUnitY;
            this.unitHandler(1, newUnit);
          }
          if (params.getReal.isReal && info.updateTime) {
            params.updateTime = info.updateTime;
            rd.wave.currTime = [info.updateTime];
            clearTimeout(params.getReal.timer);
            params.getReal.timer = setTimeout(this.getWaveData, 6000);
          }
          // 模拟转速未开启时获取转速
          if (!params.failure.isSetSpeed) {
            params.failure.analogSpeed = chartData.speed
          }
          for (let k in params.failureList) {
            this.reDrawFail(params.failureList[k], k)
          }
        } else {
          params.getReal.isReal && this.getRealData();
          params.empty.wave.isShow = true;
        }
      } else {
        // 实时数据不是第一次请求
        if (rd.wave.isReal === 1 && rd.wave.currTime[0] !== 0) {
          //防止2000v2（pos.dgm_type == 3）、MHD、TMS高密度波形出现空窗口，
          if (rd.wave.type != 1 || (rd.wave.type == 1 && (pos.dgm_type == 4 || pos.dgm_type == 3 || pos.dgm_type == 7 || pos.dgm_type == 13))) {
            clearTimeout(params.getReal.timer);
            params.getReal.timer = setTimeout(this.getWaveData, 6000);
          } else {
            params.empty.wave.isShow = true;
          }
        } else {
          params.getReal.isReal && this.getRealData();
          params.empty.wave.isShow = true;
          if (rd.wave.isReal === 1 && rd.wave.currTime[0] === 0) {
            rd.wave.isReal = 0;
            rd.wave.currTime[0] = Date.now();
            this.getWaveData();
          } else {
            params.empty.wave.isShow = true;
          }
        }
        /* let popText = '无波形数据';
        if (rd.wave.currTime[0] === 0) {
           this.$refs.waveRealData[this.currentIndex].click();
           popText = '无实时数据';
        }
        this.$pop(popText); */
      }
    },
    // 遍历获取特征值code
    getEigenvalueCode (pos, filed) {
      let codeObj = getCodeObj(pos.dgm_type)
      let eigenvalue = codeObj[pos.position_type]
      for (let i = 0; i < eigenvalue.length; i++) {
        if (eigenvalue[i].filed == filed) {
          return eigenvalue[i]
        }
      }
    },
    // 长采样测点时是否获取频谱图数据
    /*type 1:按钮点击事件；2.取频谱图数据 */
    isGetSpectrumData (type) {
      if (type === 1) {
        this.paramsData[this.currentKey].isSpectrum = true;
      }
      if (this.paramsData[this.currentKey].isSpectrum) {
        let param = this.paramsData[this.currentKey];
        let chartData = param.chartData;
        let data = this.chartData[this.currentKey];
        // 取频谱数据
        const fftX = [];
        const fftY = [];
        const hanning = [];
        const spectrumData = setSrcSpectrum(
          chartData.freq,
          data.wave.srcY,
          chartData.chartType,
          chartData.spectral
        );
        // const outX = info.fft.OutX;
        // i = 0;
        // l = outX.length;
        // for (; i < l; i++) {
        //    fftX.push(outX[i]);
        //    fftY.push(info.fft.OutY[i]);
        //    hanning.push(info.fftWithHanning.OutY[i]); /* 汉宁窗 */
        // }
        // 计算切换阶比数据
        const outX = spectrumData.fftX;
        let ratio = [];
        if (chartData.chartType === 1) {
          if (chartData.speed !== 0) {
            for (let i = 0, len = outX.length; i < len; i++) {
              ratio.push(
                Math.round(((outX[i] * 60) / chartData.speed) * 100000) / 100000
              );
            }
          }
        }
        data.spectrum.srcX = spectrumData.fftX;
        data.spectrum.curX = spectrumData.fftX;
        data.spectrum.srcY = spectrumData.fftY;
        data.spectrum.curY = spectrumData.hanning;
        data.spectrum.hanning = spectrumData.hanning;
        data.spectrum.ratio = ratio;
        this.$set(this.chartData[this.currentKey], "spectrum", data.spectrum);
      }
    },
    // 最大化
    maximization (bool, opt) {
      const chart = this.$refs.waveCharts[this.currentIndex];
      const wave = chart.children;
      const params = this.paramsData[this.currentKey]
      if (bool) {
        chart.style.display = "block";
        switch (opt) {
          case 0:
            wave[1].style.display = "none";
            wave[2].style.display = "none";
            wave[3].style.display = "none";
            wave[0].style.height = "calc(100% - 50px)";
            wave[0].style.width = "calc(96% + 10px)";
            params.maximization.wave = true
            break;
          case 1:
            wave[0].style.display = "none";
            wave[1].style.display = "none";
            wave[2].style.height = "calc(100% - 50px)";
            wave[3].style.display = "none";
            wave[2].style.width = "calc(96% + 10px)";
            params.maximization.spectrum = true
            break;
          case 2://趋势图
            wave[0].style.display = "none";
            wave[1].style.display = "none";
            wave[2].style.display = "none";
            wave[3].style.height = "calc(100% - 50px)";
            wave[3].style.width = "calc(96% + 10px)";
            params.maximization.trend = true
            break;
        }
        this.$store.commit("changeDomStructure");
        this.reportMsg[this.currentKey].waveMaximization = opt;
      } else {
        if (opt == 0) {
          params.maximization.wave = false
        } else if (opt == 1) {
          params.maximization.spectrum = false
        } else if (opt == 2) {
          params.maximization.trend = false
        }
        for (let i = 0, l = wave.length; i < l; i++) {
          wave[i].style = null;
        }
        // 若关闭趋势图开启则
        if (params.isTrendClose) {
          wave[3].style.display = "none";
        }
        chart.style = null;
        this.$store.commit("changeDomStructure");
        this.reportMsg[this.currentKey].waveMaximization = 255;
        // 刷新趋势图谱
        this.charts[this.currentKey].trend && this.charts[this.currentKey].trend.chart && this.charts[this.currentKey].trend.chart.resize();
      }
    },

    // 点击右侧工具按钮
    operatChart (index) {
      const idx = this.currentKey;
      const params = this.paramsData[idx];
      const list = params.iconList;
      const className = "check-icon";
      const freq = params.freq;
      const speed = params.chartData.speed;
      const data = this.chartData;
      const chart = data[idx].spectrum;
      if (chart.curY && chart.curY.length > 0) {
        this.isNewChart = true;
        switch (index) {
          case 1 /* 切换汉宁窗 */:
            list[index].isCheck = !list[index].isCheck;
            list[index].parentClass = list[index].isCheck ? className : "";
            const hanning = ["srcY", "hanning"];
            chart.curY = cloneObj(
              chart[hanning[Number(list[index].isCheck)]],
              true
            );
            if (chart.curUnitY !== chart.srcUnitY) {
              const newUnit = chart.curUnitY;
              chart.curUnitY = chart.srcUnitY;
              this.unitHandler(1, newUnit);
            }
            this.$forceUpdate();
            break;
          case 2 /* 切换阶比 */:
            if (speed === 0 || isNaN(speed)) {
              this.$pop(this.$t('wave.switchOrderNo1'));//转速为0，切换为阶比功能不可用！
              return;
            } else if (params.type === 8 || params.type === 9) {
              this.$pop(this.$t('wave.switchOrderNo2'));//已为阶比，切换为阶比功能不可用！
              return;
            }
            const value = list[index];
            value.isCheck = !value.isCheck;
            const isCheck = value.isCheck;
            value.parentClass = isCheck ? className : "";
            const ratio = ["srcX", "ratio"];
            const unit = ["Hz", "NX"];
            const chartType = ["line", "bar-line"];
            chart.curX = cloneObj(chart[ratio[Number(isCheck)]], true);
            chart.curUnitX = unit[Number(isCheck)];
            if (chart.curX.length > chart.curY.length) {
              chart.curX = chart.curX.slice(0, chart.curY.length)
            }
            params.chartData.spectrumType = chartType[Number(isCheck)];
            this.$forceUpdate();
            break;
          case 6:
          case 0:
            let iconIndex = 12 * this.currentIndex
            let classNameList = this.spectrumTools[iconIndex + index].className.split(" ")
            if (classNameList.indexOf('check-icon') == -1) {
              addClass(
                this.spectrumTools[iconIndex + index],
                "check-icon"
              );
            } else {
              removeClass(
                this.spectrumTools[iconIndex + index],
                "check-icon"
              );
            }
            break;
          case 4:
            let title_1 = this.$t('icon.LowFreqFilter')//'低频过滤'
            if (this.paramsData[this.currentKey].chartData.chartType == 2) {
              title_1 = this.$t('wave.LowOrderFilter')//'低阶次过滤'
            }
            this.$WavePop({
              lowFreq: freq.lowFreq,
              title: title_1,
              type: 0
            }).then(res => {
              if (res) {
                freq.lowFreq = Number(res.lowFreq);
                let type = 0
                if (chart.srcUnitY != chart.curUnitY) {
                  type = 1
                }
                this.getFreq(idx, type);
              }
            });
            break;
          case 5 /* 有效频率 */:
            let title = this.$t('wave.effecFreqBand')//'有效频段'
            if (this.paramsData[this.currentKey].chartData.chartType == 2) {
              title = this.$t('wave.effecOrderRank')//'有效阶次'
            }
            this.$WavePop({
              type: 0,
              title: title,
              upperLimit: freq.upperLimit,
              lowerLimit: freq.lowerLimit
            }).then(res => {
              if (res) {
                if (res.lowerLimit !== "" && res.upperLimit !== "") {
                  if (
                    Number(res.lowerLimit) < 0 ||
                    Number(res.upperLimit) < 0
                  ) {
                    this.$pop(this.$t('wave.effectFreqError'));//有效频率输入不正确！
                    return;
                  } else if (Number(res.upperLimit) > 0) {
                    if (Number(res.lowerLimit) > Number(res.upperLimit)) {
                      this.$pop(this.$t('wave.effectFreqError'));//有效频率输入不正确！
                      return;
                    }
                  }
                } else {
                  this.$pop(this.$t('wave.effectFreqError'));//有效频率输入不正确！
                  return;
                }
                freq.lowerLimit = Number(res.lowerLimit);
                freq.upperLimit = Number(res.upperLimit);
                if (freq.lowerLimit !== 0 || freq.upperLimit !== 0)
                  params.chartData.isSetPower = true;
                let type = 0
                if (chart.srcUnitY != chart.curUnitY) {
                  type = 1
                }
                this.getFreq(idx, type);
              }
            });
            break;
          case 10:
            params.failure.isShowList = true;
            break;
          case 11:
            list[index].isCheck = !list[index].isCheck;
            list[index].parentClass = list[index].isCheck ? className : "";
            break;
        }
      }
    },
    // 单位选择
    selectUnit (type) {
      const chartType = ["wave", "spectrum", "trend"];
      const curKey = this.currentKey;
      const chart = this.chartData[curKey][chartType[type]];
      const pos = this.paramsData[curKey].pos;
      if (chart.curY.length > 0) {
        this.$WavePop({
          type: 1,
          title: this.$t('icon.unitSelect'),//单位选择
          src: chart.srcUnitY,
          cur: chart.curUnitY,
          opt: type,
          unitX: chart.curUnitX,
          pType: pos.position_type
        }).then(res => {
          if (res) {
            this.unitHandler(type, res.unit);
          }
        });
      }
    },
    // 关闭单位选择弹窗
    unitHandler (type, newUnit) {
      const curKey = this.currentKey;
      const chartType = ["wave", "spectrum", "trend"];
      const chart = this.chartData[curKey][chartType[type]];
      const params = this.paramsData[curKey];
      const chartData = params.chartData;
      const oldUnit = chart.curUnitY;
      const srcUnit = chart.srcUnitY;
      const unitIndex = {
        g: 0,
        kN: 0,
        "m/s²": 1,
        "mm/s": 2,
        μm: 3
      };
      const oldIndex = unitIndex[oldUnit];
      const srcIndex = unitIndex[srcUnit];
      const newIndex = unitIndex[newUnit];
      let srcY = chart.srcY;
      if (type === 1 && params.iconList[1].isCheck) {
        srcY = chart.hanning;
      }
      const l = srcY.length;
      let curY = [];
      let i = 0;
      if (oldIndex !== newIndex && (srcIndex <= newIndex || srcIndex === 1)) {
        if (srcIndex === newIndex) {
          curY = srcY.concat();
        } else if (newIndex === 0) {
          if (srcIndex === 1) {
            for (i = 0; i < l; i++) {
              curY.push(srcY[i] / 9.8);
            }
          }
        } else if (newIndex === 1) {
          if (srcIndex === 0) {
            for (i = 0; i < l; i++) {
              curY.push(srcY[i] * 9.8);
            }
          }
        } else if (newIndex === 2) {
          if (type === 0) {
            curY = makeWaveY(srcY, chartData.freq);
          } else if (type === 1) {
            curY = integralFft(
              srcY,
              l,
              chartData.freq / chartData.samples,
              srcIndex
            );
          }
        } else if (newIndex === 3) {
          if (srcIndex < 2) {
            if (type === 0) {
              curY = makeWaveY(srcY, chartData.freq);
            } else if (type === 1) {
              curY = integralFft(
                srcY,
                l,
                chartData.freq / chartData.samples,
                srcIndex
              );
            }
          } else {
            curY = srcY;
          }
          if (type === 0) {
            curY = makeWaveY(curY, chartData.freq);
          } else if (type === 1) {
            curY = integralFft(curY, l, chartData.freq / chartData.samples, 2);
          }
        }
        params.isNewChart[chartType[type]] = true;
        chart.curY = curY;
        chart.curUnitY = newUnit;
        type === 2 && ((this.clickTrend = false), this.setTrendOption());
        type === 1 && this.getFreq(this.currentKey, 1);
        type === 0 &&
          params.speedWavePulse.isDegree == false && params.speedWavePulse.speedPulse == true && this.getPulseTime(); /* 转速脉冲 */
      }
    },
    /*
       type: {
          0: 有效频率、低频过滤
          1: 单位选择
       }
    */
    getFreq (currentKey = this.currentKey, type = 0) {
      const idx = currentKey;
      const params = this.paramsData[idx];
      const data = cloneObj(this.chartData[idx].spectrum, true);
      const freq = cloneObj(params.freq, true);
      const isHanning = Number(params.iconList[1].isCheck);
      const isNX = Number(params.iconList[2].isCheck);
      const hanningAxis = ["srcY", "hanning"];
      const NXAxis = ["srcX", "ratio"];
      const srcX = data.srcX;
      let srcY = data[hanningAxis[isHanning]];
      if (type === 1) {
        srcY = data.curY;
      }
      const index = this.getIndex(freq.lowFreq);
      let a = freq.lowerLimit;
      let b = freq.upperLimit;
      const start = this.getIndex(a);
      let end = this.getIndex(b) + 1;
      isNaN(end) && (end = srcX.length);
      b == 0 && (end = srcX.length);
      let arrY = [];
      // 低频过滤
      for (let i = 0, l = srcY.length; i <= l; i++) {
        if (index !== 0 && i <= index) {
          arrY.push(0);
        } else {
          arrY.push(srcY[i]);
        }
      }
      this.isNewChart = true;
      // 有效频率
      data.curX = srcX.slice(start, end);
      data.curY = arrY.slice(start, end);
      // 计算对数
      if (params.isLog) {
        const y = [];
        for (let i = 0, l = data.curY.length; i < l; i++) {
          const value = data.curY[i];
          if (value === 0) {
            y.push(0);
          } else {
            y.push((Math.log(data.curY[i]) / Math.log(10)) * 20);
          }
        }
        data.curY = y;
        //设置isNewChart为true,达到刷新图谱效果
        params.isNewChart.spectrum = true;
      }
      data.isRefresh = true;
      this.$set(this.chartData[idx], "spectrum", data);
      if (this.chartData[currentKey].spectrum.markLine.length > 0) {
        this.setMarkLine()
      }
    },
    // 频谱图根据值确定下标
    getIndex (value, type = 0, key = this.currentKey) {
      const axis = ["srcX", "srcY", "curX", "curY"];
      const data = this.chartData[key].spectrum[axis[type]];
      //返回大于或等于value值的下标
      for (let i = 0, l = data.length; i < l; i++) {
        if (data[i] >= value) {
          return i;
        }
      }
    },
    // 保存图片
    keepPage () {
      const index = this.currentIndex;
      const el = this.$refs.waveCharts[index];
      const dom = document.getElementsByClassName("view-content")[0];
      const canvas = document.createElement("canvas");
      var w = el.clientWidth * 2;
      var h = el.clientHeight * 2;
      canvas.height = h;
      canvas.width = w;
      canvas.style.height = `${h}px`;
      canvas.style.width = `${w}px`;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);
      html2canvas(el, {
        backgroundColor: this.color.background,
        useCORS: true,
        canvas
      }).then(canvas => {
        this.$refs.saveImage[index].href = canvas.toDataURL("image/png");
        this.$refs.saveImage[index].click();
      });
    },
    // 获取实时数据
    getRealData () {
      // 关闭转速脉冲
      const paramsData = this.paramsData[this.currentKey];
      const chart = this.chartData[this.currentKey]
      paramsData.speedWavePulse.speedPulse = false; //关闭转速脉冲
      paramsData.getDegree.isDegree = false; //关闭阶次
      paramsData.speedWavePulse.isDegree = false;
      paramsData.getDegree.class = "disable-btn";
      if (paramsData.pos.position_type != 8 && paramsData.pos.position_type != 9) {
        this.degreeChangeParam(false)
      }

      this.$refs.isGetReal[this.currentIndex].click();
      const real = this.paramsData[this.currentKey].getReal;
      real.isReal = !real.isReal;
      if (real.isReal) {
        real.class = "";
        this.requestData.wave.currTime = [0];
        this.paramsData[this.currentKey].isReal = 1;
        // this.$store.state.currentTime = 0
        this.requestData.wave.isReal = 1;
        this.getWaveData();
      } else {
        real.class = "disable-btn";
        clearTimeout(real.timer);
        this.paramsData[this.currentKey].isReal = 0;
      }
    },
    // 获取阶次数据
    getDegreeData () {
      const params = this.paramsData[this.currentKey];
      const chart = this.chartData[this.currentKey];
      const degree = params.getDegree;
      const pos = params.pos;
      const currTime = this.requestData.wave.currTime[0];
      degree.isDegree = !degree.isDegree;

      this.degreeChangeParam(degree.isDegree)
      if (degree.isDegree) {
        if (params.speedWavePulse.speedPulse) {
          params.speedWavePulse.speedPulse = false;
        }
        degree.class = "";
      } else {
        degree.class = "disable-btn";
      }
      this.chartData[this.currentKey].wave.curUnitY = this.chartData[
        this.currentKey
      ].wave.srcUnitY;
      this.getWaveData();
      // 关闭或开启阶次后将单位重置
    },
    // 是否启用模拟转速
    setSpeed () {
      const failure = this.paramsData[this.currentKey].failure;
      failure.isSetSpeed = !failure.isSetSpeed;
      this.$forceUpdate();
    },
    // 获取故障频率数据
    getFailureFrequency () {
      const data = {
        machineId: this.requestData.wave.machineId
      };
      this.$getApi.getFailureFrequency(data).then(res => {
        if (res && res.driveChain.itemList) {
          this.setFailureFrequency(res);
        }
      });
    },
    // 构造故障频率结构树
    setFailureFrequency (data) {
      const list = data.driveChain.itemList;
      const pd = this.paramsData[this.currentKey];
      const gear = pd.failureList.gear;
      const bear = pd.failureList.bear;
      const speed = pd.failureList.speed;
      const gearType = ["5", "6", "9", "10"];
      let index = 0;
      for (let i = 0, l = list.length; i < l; i++) {
        const parts = list[i];
        const type = parts.itemtype;
        const base = parts.baseInfo;
        const fix = Number(base.fix_teeth_num);
        const plant = Number(base.plant_teeth_num);
        // planet_num取不到时，风电默认为3，水泥默认为4
        if (!base.planet_num) {
          if (this.paramsData[this.currentKey].pos.t_root == 0) {
            base.planet_num = 3
          } else if (this.paramsData[this.currentKey].pos.t_root == 1) {
            base.planet_num = 4
          }
        }
        const plantNum = Number(base.planet_num)
        const sun = Number(base.sun_teeth_num);
        const bearMsg = [
          {
            value: Number(base.bpfo),
            name: `外环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 0,
            type: "BPFO",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bpfi),
            name: `内环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 1,
            type: "BPFI",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bsf),
            name: `滚动体通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 2,
            type: "BSF",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bsf),
            name: `2倍滚动体通过${pd.failure.name}`,
            speedRate: 2 * Number(parts.speedRate),
            id: 3,
            type: "2xBSF",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.ftf),
            name: `保持架通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 4,
            type: "FTF",
            status: false,
            count: 0,
            val: ""
          }
        ];
        const befoBear = [
          {
            value: Number(base.bpfo1),
            name: `外环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 0,
            type: "BPFO",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bpfi1),
            name: `内环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 1,
            type: "BPFI",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bsf1),
            name: `滚动体通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 2,
            type: "BSF",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bsf1),
            name: `2倍滚动体通过${pd.failure.name}`,
            speedRate: 2 * Number(parts.speedRate),
            id: 3,
            type: "2xBSF",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.ftf1),
            name: `保持架通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 4,
            type: "FTF",
            status: false,
            count: 0,
            val: ""
          }
        ];
        const afterBear = [
          {
            value: Number(base.bpfo2),
            name: `外环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 0,
            type: "BPFO",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bpfi2),
            name: `内环通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 1,
            type: "BPFI",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bsf2),
            name: `滚动体通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 2,
            type: "BSF",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.bsf2),
            name: `2倍滚动体通过${pd.failure.name}`,
            speedRate: 2 * Number(parts.speedRate),
            id: 3,
            type: "2xBSF",
            status: false,
            count: 0,
            val: ""
          },
          {
            value: Number(base.ftf2),
            name: `保持架通过${pd.failure.name}`,
            speedRate: Number(parts.speedRate),
            id: 4,
            type: "FTF",
            status: false,
            count: 0,
            val: ""
          }
        ];
        let obj = null;
        if (gearType.includes(type)) {
          /* 啮合频率 */
          obj = {
            name: parts.name,
            isView: false,
            speedRate: Number(parts.speedRate),
            children: [],
            status: false,
            parent: gear
          };
          const children = obj.children;
          const gearType2 = ["6", "9", "10"];
          if (type === "5") {
            let isHas = false;
            for (let j = 0, len = gear.children.length; j < len; j++) {
              const value = gear.children[j];
              if (
                type === "5" &&
                (parts.up === value.id || parts.down === value.id)
              ) {
                value.name = `${value.name}/${obj.name}`;
                isHas = true;
                break;
              }
            }
            if (!isHas) {
              obj.id = parts.id;
              children.push({
                value: base.gear_teeth_num,
                speedRate: obj.speedRate,
                name: `啮合${pd.failure.name}`,
                type: "GMF",
                status: false,
                count: 0,
                parent: obj
              });
            } else {
              continue;
            }
          } else if (type === "6" || type === "9") {
            obj.id = parts.id;
            children.push(
              {
                value: fix,
                status: false,
                speedRate: obj.speedRate,
                name: `啮合${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                // value: fix / sun * plantNum,
                value: fix / sun * 3,
                status: false,
                speedRate: obj.speedRate,
                name: `太阳轮缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                value: fix / plant,
                status: false,
                speedRate: obj.speedRate,
                name: `行星轮缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                value: 2 * fix / plant,
                status: false,
                speedRate: obj.speedRate,
                name: `2倍行星轮缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                value: plantNum,
                status: false,
                speedRate: obj.speedRate,
                name: `齿圈缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
            );
          } else if (type === "10") {
            let speedRate = 0;
            for (let j = 0; j < l; j++) {
              const parts2 = list[j];
              const type2 = parts2.itemtype;
              if (gearType2.includes(type2) && parts.left2 === parts2.id) {
                speedRate = Number(parts2.speedRate);
                break;
              }
            }
            obj.id = parts.id;
            children.push(
              {
                value: fix,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `啮合${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                value: fix / sun * plantNum,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `太阳轮缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                value: fix / plant,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `行星轮缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                value: 2 * fix / plant,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `2倍行星轮缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
              {
                value: plantNum,
                status: false,
                speedRate: obj.speedRate + speedRate,
                name: `齿圈缺陷${pd.failure.name}`,
                type: "GMF",
                count: 0,
                parent: obj
              },
            );
          }
          gear.children.push(obj);
          // 轴承通过频率
          // 齿轮
          if (type !== "5") {
            let sr = 0;
            if (type === "10") {
              let speedRate = 0;
              for (let j = 0; j < l; j++) {
                const parts2 = list[j];
                const type2 = parts2.itemtype;
                if (gearType2.includes(type2) && parts.left2 === parts2.id) {
                  speedRate = Number(parts2.speedRate);
                  break;
                }
              }
              sr =
                Math.abs(obj.speedRate - speedRate) *
                (fix / plant);
            } else {
              sr =
                (obj.speedRate * fix) / plant;
            }
            obj = {
              name: parts.name,
              isView: false,
              speedRate: sr,
              children: [],
              status: false,
              parent: bear
            };
            const bm = cloneObj(bearMsg, true);
            bm.map(value => {
              value.parent = obj;
            });
            obj.children = bm;
            bear.children.push(obj);
          }
        } else if (type === "7") {
          /* 轴承通过频率 */
          const bearObj = cloneObj(bearMsg, true);
          bearObj.map(value => {
            value.parent = obj;
          });
          obj = {
            name: parts.name,
            isView: false,
            speedRate: Number(parts.speedRate),
            children: bearObj,
            status: false,
            parent: bear
          };
          bear.children.push(obj);
        } else if (type === "8") {
          /* 发电机前、后轴承 */
          const bearObj1 = cloneObj(befoBear, true);
          bearObj1.parent = bear;
          const bearObj2 = cloneObj(afterBear, true);
          bearObj2.parent = bear;
          bear.children.push(
            {
              name: `${parts.name}前轴承`,
              isView: false,
              status: false,
              speedRate: Number(parts.speedRate),
              children: bearObj1,
              parent: bear
            },
            {
              name: `${parts.name}后轴承`,
              isView: false,
              status: false,
              speedRate: Number(parts.speedRate),
              children: bearObj2,
              parent: bear
            }
          );
        } else if (type === "2") {
          /* 转频 */
          obj = {
            type: parts.itemtype,
            name: `${parts.name}转${pd.failure.speedName}`,
            isView: false,
            status: false,
            speedRate: Number(parts.speedRate),
            type: "F",
            count: 0,
            value: 1,
            parent: speed
          };
          speed.children.push(obj);
        } else if (type === "1" && pd.failure.impeller) {
          /* 叶轮 */
          index++;
          obj = {
            name: `BPF.${index}`,
            value: Number(parts.speedRate) * Number(parts.baseInfo.compNum),
            title: `${this.$t('waveFault.BPF')}${index}`//通过频率
          };
          pd.failure.analogValue[index - 1] = obj
          // pd.failure.analogValue.push(obj);
        }
      }
    },
    // 打开故障频率
    openFailure () {
      const params = this.paramsData[this.currentKey];
      const failure = params.failure;
      !failure.isSetSpeed && (failure.analogSpeed = params.chartData.speed);
      // this.chartData[this.currentKey].spectrum.isRefresh = false
      this.setAnalogSpeed()
      // if (failure.clickNum === 0) {
      //   failure.analogSpeed = params.chartData.speed;
      //   failure.clickNum++;
      // }
      failure.isShow = true;
    },
    // 关闭故障频率
    closeFailure () {
      this.paramsData[this.currentKey].failure.isShow = false;
    },
    /* 拖放弹窗
       type    Nnumber    鼠标按下或松开
       ref     String     需要移动dom的ref
       e       Event      对应dom的Event对象
     */
    dragElem (type, ref, e) {
      const tag = e.target;
      if (
        hasClass(tag, "close-failure") ||
        hasClass(tag, "icon-cuohao") ||
        hasClass(tag, "close-failure-list")
      )
        return;
      if (type === 1) {
        /* 鼠标按下 */
        this.offset = {
          x: e.offsetX,
          y: e.offsetY,
          ref
        };
        window.addEventListener("mousemove", this.dropElem);
      } else {
        /* 鼠标松开 */
        window.removeEventListener("mousemove", this.dropElem);
      }
    },
    // 拖动弹窗
    dropElem (e) {
      const offset = this.offset;
      const el = this.$refs[offset.ref][this.currentIndex];
      el.style.left = `${e.x - offset.x}px`;
      el.style.top = `${e.y - offset.y}px`;
    },
    // 展开、收起子项
    showChildren (item) {
      item.isView = !item.isView;
      this.$forceUpdate();
    },
    // 选中故障频率
    checkFailure (item, key, index) {
      const params = this.paramsData[this.currentKey];
      params.isNewChart.spectrum = true;
      const status = !item.status;
      item.status = status;
      let children1 = item.children;
      const parent1 = item.parent;
      // 故障频率勾选
      if (children1 && children1.length > 0) {
        for (let i = 0, l = children1.length; i < l; i++) {
          const value = children1[i];
          value.status = status;
          if (value.children && value.children.length > 0) {
            for (let j = 0, len = value.children.length; j < len; j++) {
              value.children[j].status = status;
            }
          }
        }
      }
      if (parent1) {
        children1 = parent1.children;
        let isTrue = 0;
        for (let i = 0, l = children1.length; i < l; i++) {
          const value = children1[i];
          if (value.status) isTrue++;
          parent1.status = isTrue === l;
        }
        const parent2 = parent1.parent;
        if (parent2) {
          children1 = parent2.children;
          isTrue = 0;
          for (let i = 0, l = children1.length; i < l; i++) {
            const value = children1[i];
            if (value.status) isTrue++;
            parent2.status = isTrue === l;
          }
        }
      }
      const arr = [];
      // 非叶片勾选计数
      children1 = params.failureList[key].children;
      let count1 = 0;
      let count2 = 0;
      for (let i = 0, l = children1.length; i < l; i++) {
        const val = children1[i];
        const children2 = val.children;
        if (children2 && children2.length > 0) {
          for (let j = 0, len = children2.length; j < len; j++) {
            const value = children2[j];
            if (value.status) {
              count1++;
              value.count = count1;
              const msg = this.getItem(value);
              value.viewVal = msg.str;
              value.val = msg.num;
            }
          }
        } else {
          if (val.status) {
            count2++;
            val.count = count2;
            const msg = this.getItem(val);
            val.viewVal = msg.str;
            val.val = msg.num;
          }
        }
      }
      // this.$forceUpdate();
      this.$nextTick(() => {
        this.setMarkLine();
      })
    },
    // 计算故障频率
    getItem (item) {
      const curKey = this.currentKey;
      const [, , macId, posId, posType] = curKey.split("_");
      const params = this.paramsData[curKey];
      const failureList = params.failureList;
      const isNx = params.iconList[2].isCheck;
      const chartType = params.chartData.chartType;
      let unit = "Hz";
      if (isNx || chartType === 2) {
        unit = "NX";
      }
      let freq
      // 2倍滚动体通过判断
      if (item.type.indexOf('2x') !== 1) {
        freq = (item.value * (item.parent && item.parent.speedRate ? 2 * item.parent.speedRate : item.speedRate) * params.failure.analogSpeed) / 60;
      } else {
        freq = (item.value * (item.parent && item.parent.speedRate ? item.parent.speedRate : item.speedRate) * params.failure.analogSpeed) / 60;
      }

      isNx && (freq = (freq * 60) / params.chartData.speed);
      if (chartType === 2) {
        let speedRate = 1;
        if (isVibOfPos(posType)) {
          speedRate = params.pos.speedRate;
        }
        freq = (Number(item.value) * item.speedRate) / speedRate;
      }
      return {
        str: `(${item.type}.${item.count})${freq.toFixed(2)}${unit}`,
        num: freq
      };
    },
    // 故障频率画线数据
    setMarkLine () {
      const currentKey = this.currentKey;
      const params = this.paramsData[currentKey];
      const spectrum = this.chartData[currentKey].spectrum;
      const maxFreq = spectrum.srcX[spectrum.srcX.length - 1];
      const failure = params.failure;
      const failureList = params.failureList;
      const arr = [];
      let body = [];
      if (!failure.impeller) {
        // 非叶片
        for (const key in failureList) {
          const children1 = failureList[key].children;
          for (let i = 0, l = children1.length; i < l; i++) {
            const value1 = children1[i];
            if (value1.viewVal && value1.status && value1.val <= maxFreq) {
              const flag = `${value1.type}.${value1.count}`;
              body.push({
                flag,
                name: value1.name,
                freq: round(value1.val, 4),
                amplitude: round(spectrum.srcY[this.getIndex(value1.val)], 4)
              });
              arr.push({
                name: flag,
                xAxis: this.getIndex(value1.val)
              });
            } else {
              const children2 = value1.children;
              if (children2) {
                for (let j = 0, len = children2.length; j < len; j++) {
                  const value2 = children2[j];
                  if (
                    value2.viewVal &&
                    value2.status &&
                    value2.val <= maxFreq
                  ) {
                    const flag = `${value2.type}.${value2.count}`;
                    body.push({
                      flag,
                      name: `${value1.name}/${value2.name}`,
                      freq: round(value2.val, 4),
                      amplitude: round(
                        spectrum.srcY[this.getIndex(value2.val, 2)],
                        4
                      )
                    });
                    arr.push({
                      name: flag,
                      xAxis: this.getIndex(value2.val, 2)
                    });
                  }
                }
              }
            }
          }
        }
      } else {
        if (failure.isStartFailure) {
          // 叶片
          const freq = failure.analogValue;
          freq.map(value => {
            if (value.value <= maxFreq) {
              body.push({
                flag: value.name,
                name: value.title,
                freq: round(value.value, 4),
                amplitude: round(spectrum.srcY[this.getIndex(value.value, 2)], 4)
              });
              arr.push({
                name: value.name,
                xAxis: this.getIndex(value.value, 2)
              });
            }
          });
        }
      }
      params.failure.list.body = body;
      const xAxis = [];
      const markLine = [];
      for (let i = 0, l = arr.length; i < l; i++) {
        const value = arr[i];
        const m = xAxis.indexOf(value.xAxis);
        let nameStr = "";
        if (m === -1) {
          markLine.push({
            name: value.name,
            xAxis: value.xAxis
          });
          xAxis.push(value.xAxis);
        } else {
          markLine[m].name += `/${value.name}`;
        }
      }
      // if (markLine.length != 0) {
      let flag = true
      if (spectrum.markLine.length == markLine.length) {
        flag = false
        let len = spectrum.markLine.length
        for (let i = 0; i < len; i++) {
          // 对比xAxis是否一致是为了防止转速变化后值发生了变化
          if (spectrum.markLine[i].name != markLine[i].name || spectrum.markLine[i].xAxis != markLine[i].xAxis) {
            flag = true
          }
        }
      }
      if (flag) {
        spectrum.markLine = markLine;
      }
      // }
    },
    // 叶片添加频率
    addFailure () {
      const params = this.paramsData[this.currentKey];
      const failure = params.failure;
      const freq = failure.analogValue;
      freq.push({ title: `${this.$t('waveFault.BPF')}${freq.length + 1}`, value: 1, name: `BPF.${freq.length + 1}` })//通过频率
    },
    // 删除单个叶轮故障频率
    deleteFailure (i) {
      const params = this.paramsData[this.currentKey];
      const failure = params.failure;
      const freq = failure.analogValue;
      freq.splice(i, 1)
      freq.forEach((item, idx) => {
        item.title = `通过频率${idx + 1}`
        item.name = `BPF.${idx + 1}`
      })
    },
    // 清除叶轮故障频率数据
    clearFailure () {
      const currentKey = this.currentKey;
      this.paramsData[currentKey].failure.list.body = [];
      this.paramsData[currentKey].failure.isStartFailure = false;
      this.chartData[currentKey].spectrum.markLine = [];
    },
    // 自定义转速
    setAnalogSpeed () {
      const failureList = this.paramsData[this.currentKey].failureList;
      for (const key in failureList) {
        const failure = failureList[key].children;
        for (let i = 0, l = failure.length; i < l; i++) {
          const value1 = failure[i];
          const children1 = value1.children;
          if (children1 && children1.length > 0) {
            for (let j = 0, len = children1.length; j < len; j++) {
              const value2 = children1[j];
              const children2 = value2.children;
              if (children2 && children2.length > 0) {
                for (let m = 0, n = children2.length; m < n; m++) {
                  const value3 = children2[m];
                  if (value3.status) {
                    const msg = this.getItem(value3);
                    value3.viewVal = msg.str;
                    value3.val = msg.num;
                  }
                }
              } else {
                if (value2.status) {
                  const msg = this.getItem(value2);
                  value2.viewVal = msg.str;
                  value2.val = msg.num;
                }
                // break;
              }
            }
          } else {
            if (value1.status) {
              const msg = this.getItem(value1);
              value1.viewVal = msg.str;
              value1.val = msg.num;
            }
          }
        }
      }

      this.setMarkLine();
    },
    // 关闭故障频率明细
    closeFailureList () {
      this.paramsData[this.currentKey].failure.isShowList = false;
    },
    // 数据检索
    dataRetrieval () {
      let isDataType = false
      const params = this.paramsData[this.currentKey]
      let dataType = params.dataType
      if (params.pos.dgm_type == 11) {
        isDataType = true;
      }
      let viewMsg = {
        isDataType,
        dataType
      }
      this.$retrieval({
        key: 'wave',
        viewMsg,
      }).then(res => {
        if (res) {
          dataType = res.dataType;
          const rd = this.requestData.trend;
          rd.startTime = res.startTime;
          rd.endTime = res.endTime;
          rd.toSpeed = res.maxSpeed;
          rd.fromSpeed = res.minSpeed;
          rd.lowerLimit = res.lower;
          rd.upperLimit = res.upper;
          rd.density = Number(res.density.type);
          this.getTrendData();
        }
      });
      // this.$emit('dataRetrieval', this.paramsData[this.currentIndex], 'wave')
    },
    // 拖入测点
    changePos (index, e) {
      const pos = JSON.parse(e.dataTransfer.getData("flag"));
      const [macId, posId, posType] = pos.posFlag.split("_");
      const vibType = [1, 3, 4, 6, 8, 9, 12, 17, 200];
      if (!matchRule(posType, 'wave', pos.dgm_type, pos.t_root, pos)) {
        this.$pop(this.$t('wave.noWaveData'));//当前没有波形数据
        return;
      }
      this.dropPos = pos;
      let name = "wave"; //实时数据列表
      let key = `wave_pos_${pos.posFlag}`;
      this.$store.commit("getCheckMsg", {
        msg: cloneObj(pos),
        type: "pos"
      });
      let titleName = pos.mac_name + "-" + pos.name + "-" + this.$t('Common.Wave');//波形频谱图
      // let titleName = pos.name + "波形频谱图";
      // let delKey = this.currentKey
      this.$bus.$emit("choiceChartType", key, name, titleName);
    },
    // 设置对数坐标
    setLog (bool) {
      this.paramsData[this.currentKey].isLog = bool;
      const data = this.chartData[this.currentKey].spectrum;
      //若当前单位为默认单位，getFreq处理时取srcY
      if (bool) {
        //打开对数坐标
        if (data.curUnitY === data.srcUnitY) {
          this.getFreq();
        } else {
          //若当前单位切换过，getFreq则处理时取curY
          this.getFreq(this.currentKey, 1);
        }
      } else {
        this.getFreq();
      }
      //将单位转为srcUnit
      if (!bool) {
        this.chartData[this.currentKey].spectrum.curUnitY = this.chartData[
          this.currentKey
        ].spectrum.srcUnitY;
      }
    },
    // 转速测点切换高低密度波形
    setSpeedType () {
      const params = this.paramsData[this.currentKey];
      const speedType = this.speedType;
      if (params.pos.dgm_type != 4) {
        const index = Math.abs(speedType.indexOf(params.speedType) - 1);
        params.speedType = speedType[index];
        const rd = this.requestData;
        if (rd.wave.isReal == 1) {
          rd.wave.currTime = [0]
        }
        rd.trend.waveType = Number(!rd.trend.waveType);
        rd.wave.type = Number(!rd.wave.type);
        this.getTrendData();
        this.getWaveData();
      } else {
        this.$pop(this.$t('wave.noLowWaveData'))
      }
    },
    // 是否显示峰值
    isViewP () {
      let key = this.currentKey;
      if (this.paramsData[key]) {
        const pType = this.paramsData[key].pos.position_type;
        if (
          (pType === 3 || pType === 8) &&
          this.chartData[key].wave.curX.length > 0
        ) {
          // this.$set(this.ViewP, key, true)
          return true;
        } else {
          // this.$set(this.ViewP, key, false)
          return false;
        }
      } else {
        console.log("未初始化");
      }
    },
    // 横向展开波形频谱图
    developChart () {
      const elem = this.$refs.waveCharts[this.currentIndex];
      const developChart = this.paramsData[this.currentKey].developChart;
      const chartType = developChart.chart;
      const isDevelop = developChart[chartType];
      const className = {
        wave: "wave-spectrum-chart-2" /* 设定CSS样式spectrum宽度为0 */,
        spectrum: "wave-spectrum-chart-3" /* 设定CSS样式wave宽度为0 */
      };
      if (isDevelop) {
        addClass(elem, className[chartType]);
        developChart.icon = "-";
      } else {
        removeClass(elem, className[chartType]);
        developChart.icon = "+";
      }
      developChart[developChart.chart] = !isDevelop;
      this.$store.commit("changeDomStructure");
    },
    resizeChart () {
      // 刷新趋势图谱
      this.charts[this.currentKey].trend && this.charts[this.currentKey].trend.chart && this.charts[this.currentKey].trend.chart.resize();
    }
  },

  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    window.addEventListener("resize", this.resizeChart);
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.resizeChart);
  }
};
