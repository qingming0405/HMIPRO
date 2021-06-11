/* version1.1:
  1. 代码优化;
  2. 一张图可显示多条数据;
  3. 增加3D图谱显示; */
(function (global, factory) {
  "use strict";
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
      ? define(factory)
      : ((global = global || self), (global.myChart = factory()));
})
  (this, function () {
    "use strict";
    var chart = function (dom) {
      var option = {
        type: {
          chart: "" /* 1.波形频谱图 2.对比分析 */,
          chartType: "" /* 波形（wave）,频谱（spectrum）,趋势图（trend） */
        },
        // 图谱标题
        title: {
          show: false, // 是否显示标题
          name: "", // 标题名字
          // 标题字体样式
          fontStyle: {
            weight: "bold", // 粗细，默认 'bold'
            size: "20px", // 大小，默认 '20px'
            family: "Arial", // 字体，默认 'Arial'
            color: "#000", // 颜色，默认 '#000'
            align: "left" // 对齐方式，默认 'left'
          }
        },
        // 图谱位置
        grid: {
          top: 60, // 离容器上边距离，默认 60
          right: "10%", // 离容器右边距离，默认 '10%
          left: "10%", // 离容器左边距离，默认 '10%'
          bottom: 60 // 离容器下边距离，默认 60
        },
        // x 轴信息
        x: {
          name: "", // 名称(单位)
          name2: "", // 补充文字
          nameStyle: {
            // 名称(单位)字体样式
            color: "#000", // 颜色，默认 '#000''
            size: "12px", // 大小，默认 '12px'
            family: "Arial", // 字体，默认 'Arial'
            weight: "bold", // 粗细，默认 'bold'
            bottom: "15", // 单位位置
            bottom2: "30", // 单位位置
            align: "center" // 对齐方式
          },
          type: "category", // 坐标轴类型，默认'category'
          data: [], // 数据
          fontStyle: {
            // 刻度字体样式
            color: "#000", // 颜色，默认 '#000'
            size: "12px", // 大小，默认 '12px'
            family: "Arial" // 字体，默认 'Arial'
          },
          lineStyle: {
            // 轴线样式
            color: "#000", // 颜色，默认 '#000'
            width: 1 // 粗细，默认 1
          },
          range: {
            max: 0,
            min: 0
          }
        },
        // y 轴信息
        y: {
          name: "", // 名称(单位)
          name2: "", // 补充文字
          nameStyle: {
            // 名称(单位)字体样式
            color: "#000", // 颜色，默认 '#000'
            size: "12px", // 大小，默认 '12px'
            family: "Arial", // 字体，默认 'Arial'
            weight: "bold", // 粗细，默认 'bold'
            align: "center" // 对齐方式
          },
          data: [], // 数据
          fontStyle: {
            // 刻度字体样式
            color: "#000", // 颜色，默认 '#000'
            size: "12px", // 大小，默认 '12px'
            family: "Arial", // 字体，默认 'Arial'
            weight: "normal" // 粗细，默认 'normal'
          },
          lineStyle: {
            // 轴线样式
            color: "#000", // 颜色，默认 '#000'
            width: 1 // 粗细，默认 1
          },
          splitLineStyle: {
            // 坐标轴分隔线
            color: "#c1c1c1", // 颜色，默认 '#c1c1c1'
            width: 1 // 粗细，默认 1
          },
          /* 报警线 */
          markLine: [
            /* {
            data: '',
            lineStyle: {
              color: '',
              width: 1,
            }
          } */
          ]
        },
        // 图谱信息
        series: {
          type: "line", // 类型，默认 'line' 'scatter'(散点图)  'bar'(柱状图)  'bar-line'(阶次)
          coordinateSystem:
            "rectanguler" /* 坐标系类型, 默认'rectanguler'; 可选: 'rectanguler'(直角坐标系), 'circle'(倾角分布图), 'circleLine'(圆周图), */,
          lineStyle: {
            // 样式
            color: "#0032ff", // 颜色，默认 '#0032ff
            width: 1 // 粗细，默认 1
          },
          markLine: {
            // 标线
            data: [],
            lineStyle: {
              // 样式
              color: "#ebd662", // 颜色，默认 '#ebd662'
              width: 1 // 粗细，默认 1
            },
            fontStyle: {
              // 标注字体样式
              color: "#0032ff", // 颜色，默认 '#ebd662'
              size: "12px", // 大小，默认 '12px'
              family: "Microsoft YaHei", // 字体，默认 'Microsoft YaHei'
              weight: "normal" // 粗细，默认 'normal'
            }
          },
          fontStyle: {
            /* 字体样式(coordinateSystem === 'circle') */
            color: "#000" /* 颜色 */,
            size: "14px" /* 大小 */,
            faimly: "Microsoft YaHei" /* 字体 */
          },
          dataMsg: {
            // 数据信息
            oneFreq: 0, // 一倍频
            rotateSpeed: 0, // 转速
            specType: 1, // 频谱图类型
            spectral: 0, // 采样点数
            setPower: false // 是否设置有效频段，默认 false
          },
          symbol: {
            show: false,
            color: "",
            size: 3
          },
          unit: "" /* 特征值单位 */,
          data: {
            /* 倾角分布图、沉降跟踪图数据 */
            amplitude: [] /* 幅值 */,
            phase: [] /* 相位 */,
            color: [] /* 点和报警线的颜色 */,
            maxAmplitude: 0.1 /* 最大2倍幅值 */
          },
          circleAlarm: [
            /* {
            data: '',
            lineStyle: {
              width: 1,
              color: '',
            }
          } */
          ] /* 圆周图报警线 */,
          posName: [] /* 如果有多组数据, 测点名 */,
          isRestore: true /* 是否刷新图谱 */
        },
        // 标注信息
        toolTip: {
          isShow: true /* 是否启用点击效果 */,
          symbol: {
            show: true,
            color: "",
            size: 3
          },
          lineStyle: {
            // 标线样式
            color: "#FA9A4D", // 颜色，默认 '#FA9A4D'
            width: 1 // 粗细，默认 1
          },
          fontStyle: {
            // 标注字体样式
            color: "#fff", // 颜色，默认 '#fff'
            size: "12px", // 大小，默认 '12px'
            family: "Microsoft YaHei", // 字体，默认 'Microsoft YaHei'
            weight: "normal" // 粗细，默认 'normal'
          },
          background: {
            // 提示框背景
            color: "rgba(50, 50, 50, 0.3)" // 颜色，默认 'rgba(50, 50, 50, 0.3)'
          },
          formatter: function (params) { }, // 单击, params = {key: number, val: number} =>  key: 下标，val: x 值
          dblHandler: function (params) { } // 双击, params = {key: number, val: number} =>  key: 下标，val: x 值
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: false,
            dom: null
          },
          // 最大化 / 还原
          maxOrMin: {
            show: false,
            dom: null
          },
          // 重置
          restore: {
            show: false,
            dom: null,
            formatter (isRestore) { }
          },
          // 时间差
          timeDifferent: {
            show: false,
            dom: null,
            formatter (isTimeDifferent) { }
          },
          // 差频
          subFreq: {
            show: false,
            dom: null,
            formatter (isSubFreq) { }
          },
          // 1倍频
          oneFreq: {
            show: false,
            dom: null,
            formatter: isOneFreq => { }
          },
          // 标注倍频
          labelFreq: {
            show: false,
            dom: null,
            formatter (isLabelFreq) { }
          },
          // 寻峰
          peakSearch: {
            show: false,
            dom: null
          },
          // 添加标注
          addLabel: {
            show: false,
            dom: null
          },
          // 取消标注
          cancelLabel: {
            show: false,
            dom: null
          },
          // 校准倍频
          setPeak: {
            show: false,
            dom: null
          },
          // 导出图片
          exportImage: {
            show: false,
            dom: null,
            imageName: ""
          },
          // 导出数据
          exportData: {
            fileName: "",
            show: false,
            dom: null
          },
          // 导出音频
          exportAudio: {
            fileName: "",
            show: false,
            dom: null,
            maxFreq: null
          },
          //转速脉冲
          speedPulse: {
            show: false,
            dom: null,
            formatter (isSpeedPulse) { }
          }
        },
        backgroundColor: "rgba(255, 255, 255, 0)", // 图谱背景颜色，默认 '#fff'
        changePos: false, // 是否切换测点 / 机组，默认 false
        resize: null
      };
      var _chart = function (dom) {
        if (!dom) return;
        this._dom = {
          name: dom,
          id: null,
          width: 0,
          height: 0
        };
        this._computeParams = {
          extremum: {}, // x、y轴边界值：{x:{min, max}, y:{min, max}}
          proportion: {} // 坐标系数：{x:{b, k}, y:{b, k}}
        };
        this._flag = {
          spectrumXName: "", // 频谱图 x 轴单位
          spectrumYName: "", // 频谱图 y 轴单位
          dataLength: 0, // x 轴数据长度
          zoom: 0, // 是否开窗放大  1：放大
          click: 1, // 是否点击画线  1： 画线
          line: {
            // 鼠标或点击位置对应 x 轴下标和值
            key: -1 /* 对应数据所在数组的索引 */,
            val: -1 /* x轴对应的值 */,
            idx: undefined /* 多组数据时对应数组的索引 */
          },
          firstCommon: {
            /* 用于记录对比分析图首次普通点击 */
            // 鼠标或点击位置对应 x 轴下标和值
            key: -1 /* 对应数据所在数组的索引 */,
            val: -1 /* x轴对应的值 */,
            idx: undefined /* 多组数据时对应数组的索引 */
          },
          last_xWave: {
            // 启用时间差上一次点击的 x 轴下标和值
            key: -1,
            val: -1,
            idx: undefined /* 多组数据时对应数组的索引 */
          },
          labelLine: {
            // 标线信息
            spectrum: [], // 频谱图倍频、差频标线信息
            wave: [] // 波形图时间差标线信息
          },
          maxMin: 0, // 是否最大化  1：最大化
          addPeak: [], // 添加标注, 每次鼠标点击的 x 轴下标和值
          muchaddPeak: [], // 多条数据时添加标注，相较于addPeak多了一个index多组数据时对应数组的索引
          addPeakPos: [], // 添加标注, 需要标注的点位置信息
          dragLabel: false, // 是否拖动已填加标注的框
          peakIndexArr: [], // 循环寻峰标线信息
          arr_B: [], // 倍频数组
          arr_C: [], // 差频数组
          subFreqAxis: -1, // 多组数据时差频的数据索引
          toolCheck: -1, // 最后选择的 tool：0 => 点击；1 => 1倍频；2 => 标注倍频；3 => 寻峰
          tools: {
            flag_subFreq: 0, // 是否启用差频  1：启用
            flag_oneF: 0, // 是否启用一倍频  1：启用
            flag_nx: 0, // 是否启用倍频  1：倍频
            autoPeakNum: -1, // 循环寻峰计数
            flag_addPeak: false, // 是否启用校准倍频
            flag_subTime: 0, // 是否启用时间(点数)差  1：启用
            flag_wave_extend: 0, // 时间差是否画周期性延展线
            flag_wave_Pulse: 0 //是否开启转速脉冲 1：启用
          }
        };
        this._scope = {
          // 数据尺寸
          v: {
            // x 轴
            x: {
              start: null, // 最小值
              end: null, // 最大值
              length: null // 数据长度
            },
            // y 轴
            y: {
              start: null, // 最小值
              end: null, // 最大值
              length: null // 数据长度
            }
          },
          // 图谱尺寸
          r: {
            r: null, // 最右侧位置
            w: null, // 宽度
            b: null, // 最下侧位置
            h: null, // 高度
            x: null, // 纵向中心点位置(圆心x)
            y: null, // 横向中心点位置(圆心y)
            rs: null // 最大半径
          }
        };
        this._movePos = {
          x: {
            start: null, // （显示）最小值
            end: null, // （显示）最大值
            length: null // （显示）数据长度
          },
          y: {
            oldVal: 0,
            newVal: 0,
            move: 0,
            source: 0,
            addLabel: 0
          }
        };
        this._option = null;
        this._drawTools = {
          canvas: {},
          ctx: {}
          // toolDom: null
        };
        this.axis = {
          /* 倾角分布图(沉降跟踪图)每个点坐标 */
          x: [] /* x坐标 */,
          y: [] /* y坐标 */,
          index: [] /* 对应数据下标 */
        };
        // 快捷键组合键
        this.code = {
          code1: 0,
          code2: 0
        };
        this.event = {
          dom: {
            // 点击画线
            click: e => {
              e.stopPropagation();
              const opt = this._option;
              const series = opt.series;
              const r = this._scope.r;
              const dx = e.offsetX;
              const dy = e.offsetY;
              if (series.coordinateSystem === "rectanguler") {
                if (
                  !this._flag.zoom &&
                  opt &&
                  opt.x.data.length > 0 &&
                  !this._flag.dragLabel
                ) {
                  let dValue;
                  if (dx >= opt.grid.left && dx <= r.r)
                    dValue = this.findNearbyPoint(dx, dy);
                  else return;
                  if (this._flag.tools.flag_addPeak) {
                    dValue.key = this.fft_indexOfWaveX(
                      dValue.val,
                      this._option.y.data[dValue.key],
                      1
                    );
                    dValue.val = this._option.x.data[dValue.key];
                  }
                  if (
                    dx >= opt.grid.left &&
                    dx <= r.r &&
                    dy >= opt.grid.top &&
                    dy <= r.b
                  ) {
                    this._flag.line = {
                      val: dValue.val,
                      key: dValue.key,
                      idx: dValue.index
                    };
                  } else {
                    return;
                  }
                  if (this._flag.click) {
                    if (
                      dx >= this._option.grid.left &&
                      dx <= r.r &&
                      dy >= this._option.grid.top &&
                      dy <= r.b
                    ) {
                      this._option.tools.timeDifferent.show &&
                        this._option.tools.timeDifferent.dom &&
                        this.labelLineWave();
                      if (
                        (this._option.tools.subFreq.show &&
                          this._option.tools.subFreq.dom) ||
                        (this._option.tools.labelFreq.show &&
                          this._option.tools.labelFreq.dom) ||
                        (this._option.tools.oneFreq.show &&
                          this._option.tools.oneFreq.dom) ||
                        (this._option.tools.peakSearch.show &&
                          this._option.tools.peakSearch.dom)
                      ) {
                        this.labelLineSpec();
                      }
                      if (
                        this._flag.tools.flag_subTime ||
                        this._flag.tools.flag_subFreq ||
                        this._flag.tools.flag_nx
                      ) {
                        this.drawLabelLine();
                      } else {
                        this._flag.toolCheck = 0;
                        this._flag.firstCommon = {
                          val: dValue.val,
                          key: dValue.key,
                          idx: dValue.index
                        };
                        this.drawLine(this._flag.line);
                      }
                    }
                  }
                  opt.toolTip.formatter(this._flag.line, "click");
                }
              } else if (series.coordinateSystem === "circle") {
                if (opt && series.data.amplitude.length > 0) {
                  const axis = this.axis;
                  const ax = axis.x;
                  const ay = axis.y;
                  const r = this._scope.r;
                  const rx = r.x;
                  const ry = r.y;
                  const rs = r.rs;
                  if ((dx - rx) ** 2 + (dy - ry) ** 2 <= rs ** 2) {
                    let min = {
                      x: 0,
                      y: 0,
                      index: null,
                      value: Number.MAX_VALUE
                    };
                    for (let i = 0, l = ax.length; i < l; i++) {
                      const d = (ax[i] - dx) ** 2 + (ay[i] - dy) ** 2;
                      if (min.value > d) {
                        min = {
                          x: ax[i],
                          y: ay[i],
                          index: axis.index[i],
                          value: d
                        };
                      }
                    }
                    this.drawPoint(min);
                  }
                }
              } else if (series.coordinateSystem === "circleLine") {
                if (opt && series.data.phase.length > 0) {
                  const axis = this.axis;
                  const ax = axis.x;
                  const ay = axis.y;
                  const r = this._scope.r;
                  const rx = r.x;
                  const ry = r.y;
                  const rs = r.rs;
                  if ((dx - rx) ** 2 + (dy - ry) ** 2 <= rs ** 2) {
                    let min = {
                      x: 0,
                      y: 0,
                      index: null,
                      value: Number.MAX_VALUE
                    };
                    for (let i = 0, l = ay.length; i < l; i++) {
                      const d = (ax[i].oVal - dx) ** 2 + (ay[i].oVal - dy) ** 2;
                      if (min.value > d) {
                        min = {
                          x: ax[i].oVal,
                          y: ay[i].oVal,
                          index: axis.index[i],
                          value: d
                        };
                      }
                    }
                    this.drawPoint(min, series.coordinateSystem);
                  }
                }
              }
            },
            // 鼠标按下
            mousedown: e => {
              const flag = this._flag;
              flag.dragLabel = false;
              const movePos = this._movePos;
              movePos.x.move = 0;
              movePos.x.source = e.offsetX;
              movePos.y.source = e.offsetY;
              movePos.x.oldVal = e.offsetX;
              movePos.y.oldVal = e.offsetY;
              for (let i = 0, l = flag.addPeakPos.length; i < l; i++) {
                let val = flag.addPeakPos[i];
                if (
                  e.offsetX >= val.x &&
                  e.offsetX <= val.x + 110 &&
                  e.offsetY >= val.y &&
                  e.offsetY <= val.y + 40
                ) {
                  val.flag = 1;
                  flag.click = 0;
                  break;
                } else {
                  flag.click = 1;
                }
              }
              this.addEvent(window, "mousemove", this.event.dom.mousemove);
            },
            // 拖动图谱 & 开窗放大 handler
            mousemove: (() => {
              let time = 50;
              let lastTime = new Date().valueOf();
              return e => {
                /* 节流函数 */
                let nowTime = new Date().valueOf();
                // if (nowTime - lastTime < time) {
                //   return;
                // }
                lastTime = nowTime;
                e.stopPropagation();
                const dx = e.offsetX;
                const dy = e.offsetY;
                const opt = this._option;
                const r = this._scope.r;
                /* 出界的判断 */
                if (
                  dx >= 0 &&
                  dx <= r.r &&
                  dy >= opt.grid.top &&
                  dy <= r.b + 40
                ) {
                } else {
                  this.removeEvent(window, "mousemove", this.event.dom.mousemove);
                }
                let multiple = 0;
                if (
                  opt &&
                  opt.x.data.length > 0 &&
                  e.target.nodeName === "CANVAS"
                ) {
                  let moveX = this._movePos.x,
                    moveY = this._movePos.y,
                    flag = this._flag,
                    scope = this._scope,
                    scopeR = scope.r,
                    scopeV = scope.v,
                    prop = this._computeParams.proportion,
                    propX = prop.x,
                    propY = prop.y,
                    extrX = this._computeParams.extremum.x,
                    yArr = opt.y.data;
                  moveX.newVal = e.offsetX;
                  moveX.move = moveX.newVal - moveX.oldVal;
                  moveY.newVal = e.offsetY;
                  moveY.move = moveY.newVal - moveY.oldVal;
                  if (moveY.source >= scopeR.b && moveY.source <= scopeR.b + 40) {
                    // 拖动 x 轴
                    multiple = Math.abs(
                      (moveX.newVal - propX.b) / propX.k -
                      (moveX.oldVal - propX.b) / propX.k
                    );
                    if (moveX.move === 0) {
                      return;
                    } else if (moveX.move > 0) {
                      if (scopeV.x.start - multiple <= extrX.min) {
                        scopeV.x.start = extrX.min;
                        scopeV.x.end -= scopeV.x.start - extrX.min;
                      } else {
                        scopeV.x.start -= multiple;
                        scopeV.x.end -= multiple;
                        moveX.oldVal = e.offsetX;
                      }
                    } else {
                      if (scopeV.x.end + multiple >= extrX.max) {
                        scopeV.x.end = extrX.max;
                        scopeV.x.start += extrX.max - scopeV.x.end;
                      } else {
                        scopeV.x.start += multiple;
                        scopeV.x.end += multiple;
                        moveX.oldVal = e.offsetX;
                      }
                    }
                    let data = {
                      min: Number.MAX_VALUE,
                      max: Number.MIN_VALUE * -1
                    },
                      l = yArr.length;
                    this._option.x.type !== "category" && (data.min = 0);
                    if (typeof yArr[0] === "object" && yArr[0].length >= 0) {
                      data.start = this.findNearbyPoint(
                        opt.grid.left,
                        scopeR.b
                      ).key;
                      data.end = this.findNearbyPoint(scopeR.r, scopeR.b).key + 1;
                      for (let i = 0; i < l; i++) {
                        data.data = yArr[i].slice(data.start, data.end);
                        let len = data.data.length;
                        for (let j = 0; j < len; j++) {
                          const val = data.data[j];
                          data.min > val && (data.min = parseFloat(val));
                          data.max < val && (data.max = parseFloat(val));
                        }
                      }
                    } else {
                      data.start = this.findNearbyPoint(
                        opt.grid.left,
                        scopeR.b
                      ).key;
                      data.end = this.findNearbyPoint(scopeR.r, scopeR.b).key + 1;
                      data.data = yArr.slice(data.start, data.end);
                      for (let i = 0; i < l; i++) {
                        const val = data.data[i];
                        data.min > val && (data.min = parseFloat(val));
                        data.max < val && (data.max = parseFloat(val));
                      }
                    }
                    scopeV.y.start = data.min;
                    scopeV.y.end = data.max + (data.max - data.min) / 10;
                    flag.click = 1;
                    this.restoreAll(2);
                  } else if (moveX.source < opt.grid.left) {
                    // 拖动 y 轴
                    multiple = Math.abs(
                      (moveY.newVal - propY.b) / propY.k -
                      (moveY.oldVal - propY.b) / propY.k
                    );
                    if (moveY.move === 0) {
                      return;
                    } else if (moveY.move < 0) {
                      scopeV.y.start -= multiple;
                      scopeV.y.end -= multiple;
                    } else {
                      scopeV.y.start += multiple;
                      scopeV.y.end += multiple;
                    }
                    moveY.oldVal = e.offsetY;
                    flag.click = 1;
                    this.mappingY(2);
                    this.drawAxis();
                    this.drawMarkY(); //重画报警线
                    this.drawWave();
                    this.zoomLine();
                  } else if (
                    moveX.source >= opt.grid.left &&
                    moveX.source <= scopeR.r &&
                    moveY.source >= opt.grid.top &&
                    moveY.source < scopeR.b
                  ) {
                    if (flag.zoom) {
                      // 开窗放大
                      this.drawEnlargement(1);
                    } else {
                      let addPeakPos = flag.addPeakPos,
                        l = addPeakPos.length;
                      if (l > 0) {
                        let isAddPeak = false;
                        for (let i = 0; i < l; i++) {
                          let val = addPeakPos[i];
                          if (
                            moveX.oldVal >= val.x &&
                            moveX.oldVal <= val.x + 110 &&
                            moveY.oldVal >= val.y &&
                            moveY.oldVal <= val.y + 40 &&
                            val.flag
                          ) {
                            isAddPeak = true;
                            val.x += moveX.move;
                            val.y += moveY.move;
                            this.drawAddLabel(2);
                            moveX.oldVal = moveX.newVal;
                            moveY.oldVal = moveY.newVal;
                            flag.dragLabel = true;
                            break;
                          }
                        }
                      }
                      if (!flag.dragLabel) {
                        flag.tools.flag_subTime && this.labelLineSpec();
                        let dVal = this.findNearbyPoint(
                          moveX.newVal,
                          moveY.newVal
                        );
                        if (flag.tools.flag_addPeak) {
                          if (dVal.index === undefined) {
                            dVal.key = this.fft_indexOfWaveX(
                              dVal.val,
                              opt.y.data[dVal.key],
                              1
                            );
                            dVal.val = opt.x.data[dVal.key];
                          } else {
                            dVal.key = this.fft_indexOfWaveX(
                              dVal.val,
                              opt.y.data[dVal.index][dVal.key],
                              1
                            );
                            dVal.val = opt.x.data[dVal.index][dVal.key];
                          }
                        }
                        flag.line = {
                          key: dVal.key,
                          val: dVal.val,
                          idx: dVal.index
                        };
                        // opt.toolTip.formatter(flag.line);
                        this.zoomLine();
                      }
                      /* } else {
                        flag.tools.flag_subTime && this.labelLineSpec();
                        let dVal = this.findNearbyPoint(moveX.newVal, moveY.newVal);
                        if (flag.tools.flag_addPeak) {
                          if (dVal.index === undefined) {
                            dVal.key = this.fft_indexOfWaveX(dVal.val, opt.y.data[dVal.key], 1)
                            dVal.val = opt.x.data[dVal.key];
                          } else {
                            dVal.key = this.fft_indexOfWaveX(dVal.val, opt.y.data[dVal.index][dVal.key], 1)
                            dVal.val = opt.x.data[dVal.index][dVal.key];
                          }
                        }
                        flag.line = {
                          key: dVal.key,
                          val: dVal.val,
                          idx: dVal.index,
                        }
                        this.zoomLine();
                      } */
                    }
                  } else {
                    return;
                  }
                  // 拖动图谱或者开窗放大时重画故障频率
                  this._option.series.markLine.data.length > 0 &&
                    this.drawMarkLine();
                } else {
                  return;
                }
              };
            })(),
            // 鼠标松开
            mouseup: () => {
              this.removeEvent(window, "mousemove", this.event.dom.mousemove);
              const flag = this._flag;
              for (let i = 0, l = flag.addPeakPos.length; i < l; i++) {
                if (flag.addPeakPos[i].flag) {
                  flag.addPeakPos[i].flag = 0;
                  break;
                }
              }
              this.drawEnlargement();
              if (
                flag.zoom &&
                this._movePos.x.source >= this._option.grid.left &&
                this._movePos.x.source <= this._scope.r.r &&
                this._movePos.y.source >= this._option.grid.top &&
                this._movePos.y.source < this._scope.r.b
              ) {
                this.windowEnlargement();
              }
              if (flag.zoom) {
                setTimeout(() => {
                  flag.zoom = 0;
                  flag.click = 1;
                });
              }
            },
            // 缩放
            zoom: e => {
              e.stopPropagation();
              var dx = e.offsetX;
              var dy = e.offsetY;
              var zoomVal = e.deltaY;
              let multiple = null;
              let type = 2,
                opt = this._option;
              const xArr = opt.x.data;
              if (opt && xArr.length > 0) {
                if (
                  dx >= opt.grid.left &&
                  dx <= this._scope.r.r &&
                  dy >= opt.grid.top &&
                  dy <= this._scope.r.b + 40
                ) {
                  let dVal = this.findNearbyPoint(dx, dy); // 鼠标点在当前波形上的位置索引
                  multiple = {
                    start: (dVal.val - this._scope.v.x.start) * 0.1,
                    end: (this._scope.v.x.end - dVal.val) * 0.1
                  };
                  let start, end;
                  if (zoomVal < 0) {
                    start = this._scope.v.x.start + multiple.start;
                    end = this._scope.v.x.end - multiple.end;
                    if (start >= end || 0 >= end) {
                      return;
                    } else {
                      this._scope.v.x.start = start;
                      this._scope.v.x.end = end;
                      type = 2;
                    }
                  } else {
                    start = this._scope.v.x.start - multiple.start;
                    end = this._scope.v.x.end + multiple.end;
                    if (
                      start < this._computeParams.extremum.x.min ||
                      end > this._computeParams.extremum.x.max
                    ) {
                      type = 1;
                    } else {
                      this._scope.v.x.start = start;
                      this._scope.v.x.end = end;
                      type = 2;
                    }
                  }
                  this.mappingX(type);
                  let data = {
                    min: Number.MAX_VALUE,
                    max: Number.MIN_VALUE
                  };
                  if (dVal.index !== undefined) {
                    const yArr = opt.y.data;
                    for (let i = 0, l = yArr.length; i < l; i++) {
                      const yValue = yArr[i];
                      data.start = this.findNearbyPoint(opt.grid.left, 0, i).key;
                      data.end =
                        this.findNearbyPoint(this._scope.r.r, 0, i).key + 1;
                      if (data.start > data.end) {
                        const s = data.start;
                        data.start = data.end;
                        data.end = s;
                      }
                      data.data = yValue.slice(data.start, data.end);
                      for (let j = 0, len = data.data.length; j < len; j++) {
                        const val = data.data[j];
                        data.min > Number(val) && (data.min = Number(val));
                        data.max < Number(val) && (data.max = Number(val));
                      }
                      data.max === Number.MIN_VALUE && (data.max = 0);
                    }
                  } else {
                    data.start = this.findNearbyPoint(opt.grid.left).key;
                    data.end = this.findNearbyPoint(this._scope.r.r).key + 1;
                    if (data.start > data.end) {
                      const s = data.start;
                      data.start = data.end;
                      data.end = s;
                    }
                    data.data = opt.y.data.slice(data.start, data.end);
                    for (let i = 0, l = data.data.length; i < l; i++) {
                      const val = data.data[i];
                      data.min > Number(val) && (data.min = Number(val));
                      data.max < Number(val) && (data.max = Number(val));
                    }
                    data.max === Number.MIN_VALUE && (data.max = 0);
                  }
                  this._scope.v.y.start = data.min;
                  this._scope.v.y.end = data.max + (data.max - data.min) / 10;
                  this.mappingY(type);
                }
                else if (
                  dx > 0 &&
                  dx < opt.grid.left &&
                  dy >= opt.grid.top &&
                  dy <= this._scope.r.b + 40
                ) {
                  // 仅缩放y轴
                  let valY = dy * (this._scope.v.y.end - this._scope.v.y.start) / (this._scope.r.b - opt.grid.top)
                  multiple = {
                    start: (valY - this._scope.v.y.start) * 0.1,
                    end: (this._scope.v.y.end - valY) * 0.1
                  };
                  let start, end;
                  if (zoomVal < 0) {
                    start = this._scope.v.y.start + multiple.start;
                    end = this._scope.v.y.end - multiple.end;
                    if (start >= end || 0 >= end) {
                      return;
                    } else {
                      this._scope.v.y.start = start;
                      this._scope.v.y.end = end;
                      type = 2;
                    }
                  } else {
                    start = this._scope.v.y.start - multiple.start;
                    end = this._scope.v.y.end + multiple.end;
                    if (
                      start < this._computeParams.extremum.y.min ||
                      end > this._computeParams.extremum.y.max
                    ) {
                      type = 1;
                    } else {
                      this._scope.v.y.start = start;
                      this._scope.v.y.end = end;
                      type = 2;
                    }
                  }
                  this.mappingY(type);
                }
                this.drawAxis();
                this.drawWave();
                this.drawMarkY(); //重画报警线
                this.zoomLine();
              }
            },
            // 监听按键
            keydown: e => {
              // Esc: key === 'Escape', keyCode === 27
              // left: key === 'ArrowLeft', keyCode === 37
              // right: key === 'ArrowRight', keyCode === 39
              // up: key === 'ArrowUp', keyCode === 38
              // down: key === 'ArrowDown', keyCode === 40
              // w:keyCode === 87 选框放大快捷键
              const flag = this._flag;
              const flagLine = flag.line;
              let xArr = this._option.x.data;
              let option = this._option;
              flagLine.idx !== undefined && (xArr = xArr[flagLine.idx]);
              // 组合键
              if (e.keyCode === 32) {
                /* 空格 */
                this.code.code1 = 32;
              }
              if (e.keyCode === 49) {
                /* 1 */
                this.code.code2 = 49;
              }
              if (e.keyCode === 73) {
                /* i */
                this.code.code2 = 73;
              }
              if (e.keyCode === 69) {
                /* e */
                this.code.code2 = 69;
              }
              if (e.keyCode === 65) {
                /* a */
                this.code.code2 = 65;
              }
              if (this.code.code1 === 32 && this.code.code2 === 49) {
                /* 空格+1 一倍频 */
                if (
                  option.type.chartType == "spectrum" &&
                  option.type.chart == 1
                ) {
                  this.event.tool.oneFreq();
                }
                this.code.code1 = 0;
                this.code.code2 = 0;
              } else if (this.code.code1 === 32 && this.code.code2 === 73) {
                /* 空格+i 导出图片 */
                this.event.tool.exportImage();
                this.code.code1 = 0;
                this.code.code2 = 0;
              } else if (this.code.code1 === 32 && this.code.code2 === 65) {
                /* 空格+a 导出音频 */
                if (option.type.chartType == "wave" && option.type.chart == 1) {
                  this.event.tool.exportAudio();
                }
                this.code.code1 = 0;
                this.code.code2 = 0;
              } else if (this.code.code1 === 32 && this.code.code2 === 69) {
                /* 空格+e 导出数据 */
                this.event.tool.exportData();
                this.code.code1 = 0;
                this.code.code2 = 0;
              }
              if (e.key === "Escape" && e.keyCode === 27) {
                flagLine.key = -1;
                flagLine.val = -1;
                flagLine.idx = undefined;
                const layer = [
                  "background", // 背景
                  "data", // 数据
                  "foreground", // 前景
                  "speed", // 转速
                  "failure", // 故障频率
                  "subFreq", // 差频信息
                  "nxFreq", // 倍频信息
                  "click", // 操作(点击画线)
                  "pulse", // 转速脉冲
                  "zoom" // 操作(开窗放大)
                ];
                for (let i = 2, l = layer.length; i < l; i++) {
                  this._drawTools.ctx[layer[i]].clearRect(
                    0,
                    0,
                    dom.width,
                    dom.height
                  );
                }
                flag.addPeak.length = 0;
                flag.tools.flag_subTime = 0;
                flag.tools.flag_subFreq = 0;
                flag.tools.flag_nx = 0;
                flag.labelLine.spectrum.length = 0;
                flag.tools.flag_wave_Pulse = 0; //转速脉冲关闭
                this.zoomLine();
                this._option.tools.restore.formatter(true);
              } else if (e.key === "ArrowLeft" && e.keyCode === 37) {
                --flagLine.key;
                flagLine.val = xArr[flagLine.key];
                if (flag.tools.flag_subFreq == 0) {
                  --flag.arr_B[0]; //键盘左右键移动后变化arr_B,消除了左右键移动的影响对差频的影响
                }
                this._option.toolTip.formatter(flagLine);
                this.zoomLine();
              } else if (e.key === "ArrowRight" && e.keyCode === 39) {
                ++flagLine.key;
                flagLine.val = xArr[flagLine.key];
                if (flag.tools.flag_subFreq == 0) {
                  ++flag.arr_B[0];
                }
                // ++flagLine.key;
                // ++flag.arr_B[0];
                // flagLine.val = xArr[flagLine.key];
                this._option.toolTip.formatter(flagLine);
                this.zoomLine();
              } else if (e.keyCode == 87) {
                /* w,选框放大 */
                this._flag.zoom = Math.abs(--this._flag.zoom);
                this._flag.click = Math.abs(--this._flag.click);
              } else if (e.keyCode == 68) {
                /* d,寻峰 */
                if (
                  option.type.chartType == "spectrum" &&
                  option.type.chart == 1
                ) {
                  this.event.tool.peakSearch();
                }
              } else if (e.keyCode === 72) {
                /* h,倍频 */
                if (option.type.chartType == "spectrum") {
                  this.event.tool.labelFreq();
                  let className = option.tools.labelFreq.dom.className.split(" ");
                  if (option.type.chart == 1) {
                    if (className.indexOf("check-icon") == -1) {
                      this.addClass(option.tools.labelFreq.dom, "check-icon");
                    } else {
                      this.removeClass(option.tools.labelFreq.dom, "check-icon");
                    }
                  } else if (option.type.chart == 2) {
                    if (className.indexOf("chart-btn-active") == -1) {
                      this.addClass(
                        option.tools.labelFreq.dom,
                        "chart-btn-active"
                      );
                    } else {
                      this.removeClass(
                        option.tools.labelFreq.dom,
                        "chart-btn-active"
                      );
                    }
                  }
                }
              } else if (e.keyCode === 82) {
                /* r,重置 */
                this.event.tool.restore();
              }
            },
            // 柱状图鼠标移入
            barMove: e => {
              const params = this._computeParams.proportion;
              const opt = this._option;
              const xArr = opt.x.data;
              const yArr = opt.y.data;
              const scope = this._scope;
              const vx = scope.v.x;
              const ex = e.offsetX;
              const ey = e.offsetY;
              const yk = params.y.k;
              const yb = params.y.b;
              const clickCtx = this._drawTools.ctx.click;
              if (opt.toolTip.isShow) {
                clickCtx.clearRect(0, 0, this._dom.width, this._dom.height);
                for (let i = 0, l = yArr.length; i < l; i++) {
                  const y = yArr[i] * yk + yb;
                  const x = scope.v.x.length * i + opt.grid.left;
                  if (
                    ex >= x &&
                    ex <= x + vx.start &&
                    ey <= scope.r.b &&
                    ey >= y
                  ) {
                    let lineX = vx.start / 2 + x;
                    if (parseInt(lineX) === parseFloat(lineX)) {
                      lineX += 0.5;
                    }
                    const ot = opt.toolTip;
                    clickCtx.beginPath();
                    clickCtx.fillStyle = "#4975c5";
                    clickCtx.fillRect(x, y, vx.start, scope.r.b - y);
                    const xVal = xArr[i];
                    let tree = xVal[0];
                    let mac = xVal[1];
                    let pos = xVal[2];
                    const W =
                      Math.max(
                        clickCtx.measureText(tree).width,
                        clickCtx.measureText(mac).width,
                        clickCtx.measureText(pos).width
                      ) + 20;
                    let bx = ex + 30;
                    let by = ey + 30;
                    if (bx + W >= scope.r.r) {
                      bx = ex - W - 30;
                    }
                    if (by + 80 >= scope.r.b) {
                      by = ey - 110;
                    }
                    clickCtx.fillStyle = ot.background.color;
                    clickCtx.fillRect(bx, by, W, 80);
                    clickCtx.font = `${ot.fontStyle.size} ${ot.fontStyle.family} ${ot.fontStyle.weight}`;
                    clickCtx.fillStyle = ot.fontStyle.color;
                    clickCtx.textBaseline = "top";
                    clickCtx.fillText(tree, bx + 10, by + 5);
                    clickCtx.fillText(mac, bx + 10, by + 25);
                    clickCtx.fillText(pos, bx + 10, by + 45);
                    clickCtx.fillText(
                      `${this.round(yArr[i], 4)}${opt.y.name[i]}`,
                      bx + 10,
                      by + 65
                    );
                    break;
                  }
                }
              }
            },
            // 柱状图双击
            barDblclick: e => {
              const params = this._computeParams.proportion;
              const opt = this._option;
              const xArr = opt.x.data;
              const yArr = opt.y.data;
              const scope = this._scope;
              const vx = scope.v.x;
              const ex = e.offsetX;
              const ey = e.offsetY;
              const yk = params.y.k;
              const yb = params.y.b;
              if (opt.toolTip.isShow) {
                for (let i = 0, l = yArr.length; i < l; i++) {
                  const y = yArr[i] * yk + yb;
                  const x = scope.v.x.length * i + opt.grid.left;
                  if (
                    ex >= x &&
                    ex <= x + vx.start &&
                    ey <= scope.r.b &&
                    ey >= y
                  ) {
                    const xVal = xArr[i];
                    const yVal = yArr[i];
                    opt.toolTip.formatter({ xVal, yVal });
                    break;
                  }
                }
              }
            },
            // 折线图双击
            lineDblclick: e => {
              e.stopPropagation();
              const opt = this._option;
              const r = this._scope.r;
              const dx = e.offsetX;
              const dy = e.offsetY;
              if (
                dx >= opt.grid.left &&
                dx <= r.r &&
                dy >= opt.grid.top &&
                dy <= r.b
              ) {
                const dValue = this.findNearbyPoint(dx, dy);
                this._flag.line = {
                  val: dValue.val,
                  key: dValue.key,
                  idx: dValue.index
                };
                opt.toolTip.dblHandler(this._flag.line, "dblclick");
              }
            }
          },
          tool: {
            // 开窗放大
            enlarge: e => {
              e.stopPropagation();
              this._flag.zoom = Math.abs(--this._flag.zoom);
              this._flag.click = Math.abs(--this._flag.click);
            },
            // 最大化 / 还原
            maxOrMin: () => {
              this.resize();
            },
            // 重置
            restore: () => {
              let flag = this._flag;
              flag.click = 1;
              flag.toolCheck = -1;
              flag.zoom = 0;
              flag.line = {
                key: -1,
                val: -1
              };
              let layer = this._drawTools.ctx;
              for (let key in layer) {
                layer[key].clearRect(0, 0, this._dom.width, this._dom.height);
              }
              flag.addPeakPos.length = 0;
              flag.addPeak.length = 0;
              flag.tools.flag_subTime = 0;
              flag.tools.flag_wave_Pulse = 0;
              /* 重置关闭转速脉冲  */
              this._option.tools.speedPulse &&
                this._option.tools.speedPulse.data &&
                (this._option.tools.speedPulse.data.speedPulse = false);
              flag.tools.flag_subFreq = 0;
              flag.tools.flag_nx = 0;
              flag.labelLine.spectrum.length = 0;
              flag.last_xWave = {
                key: -1,
                val: -1,
                idx: undefined
              };
              this._option.tools.restore.formatter(true);
              this.restoreAll(1);
            },
            // 时间差
            timeDifferent: () => {
              let flag = this._flag,
                tools = flag.tools,
                line = flag.line;
              tools.flag_subTime = Math.abs(--tools.flag_subTime);
              tools.flag_subTime &&
                (flag.last_xWave = {
                  key: line.key,
                  val: line.val,
                  idx: line.idx
                });
              this._option.tools.timeDifferent.formatter(
                Boolean(tools.flag_subTime)
              );
              this.labelLineWave();
              this.drawLabelLine();
            },
            // 循环寻峰
            peakSearch: () => {
              let flag = this._flag,
                opt = this._option;
              flag.peakIndexArr = this.getPeakIndexArr(opt.y.data, 10);
              flag.tools.autoPeakNum++;
              if (flag.tools.autoPeakNum >= 10) {
                flag.tools.autoPeakNum = -1;
              }
              this.labelLineSpec();
              let peakSearch = -1;
              for (let i = 0, l = flag.labelLine.spectrum.length; i < l; i++) {
                if (flag.labelLine.spectrum[i].name.indexOf("p") != -1) {
                  peakSearch = i;
                  break;
                }
              }
              if (peakSearch > -1) {
                flag.line = {
                  key: flag.labelLine.spectrum[peakSearch].xAxis,
                  val: opt.x.data[flag.labelLine.spectrum[peakSearch].xAxis]
                };
                this.labelLineSpec();
              }
              this._drawTools.ctx.click.clearRect(
                0,
                0,
                this._dom.width,
                this._dom.height
              );
              if (flag.tools.autoPeakNum == -1) {
                return;
              }
              this.drawLine(flag.line);
            },
            // 一倍频
            oneFreq: () => {
              let opt = this._option;
              if (opt.series.dataMsg.rotateSpeed == 0) {
                return;
              } else {
                let flag = this._flag,
                  paramsX = this._computeParams.proportion.x;
                flag.tools.flag_oneF = Math.abs(flag.tools.flag_oneF - 1);
                flag.toolCheck = 1;
                let index = -1,
                  t_nxArray = [];
                if (opt.series.dataMsg.specType == 2 || opt.x.name == "NX") {
                  //阶次、阶比
                  index = this.indexOfArray(opt.x.data, 1, 0);
                } else {
                  index = this.indexOfArray(
                    opt.x.data,
                    opt.series.dataMsg.oneFreq,
                    0
                  );
                }
                t_nxArray.push({
                  name: "1x",
                  xAxis: index
                });
                this._drawTools.ctx.click.clearRect(
                  0,
                  0,
                  this._dom.width,
                  this._dom.height
                );
                let x = paramsX.k * opt.x.data[t_nxArray[0].xAxis] + paramsX.b;
                flag.line = {
                  key: t_nxArray[0].xAxis,
                  val: opt.x.data[t_nxArray[0].xAxis]
                };
                this.labelLineSpec();
                if (x && x >= opt.grid.left && x <= this._scope.r.r) {
                  this.drawLine(flag.line);
                }
                // 标注倍频开启状态画标注倍频
                if (flag.tools.flag_nx === 1) {
                  this.drawLabelLine();
                }
                // flag.tools.flag_nx = 0;
                opt.tools.oneFreq.formatter(true);
              }
            },
            // 差频
            subFreq: () => {
              let flag = this._flag,
                tools = flag.tools;
              tools.flag_subFreq = Math.abs(--tools.flag_subFreq);
              flag.toolCheck = 2;
              Boolean(tools.flag_subFreq) || (flag.subFreqAxis = -1);
              this._option.tools.subFreq.formatter(Boolean(tools.flag_subFreq));
              tools.flag_subFreq ? this.labelLineSpec() : this.drawLabelLine();
            },
            // 倍频
            labelFreq: () => {
              let flag = this._flag;
              flag.tools.flag_nx = Math.abs(--flag.tools.flag_nx);
              flag.toolCheck = 2;
              this._option.tools.labelFreq.formatter(Boolean(flag.tools.flag_nx));
              this.labelLineSpec();
              this.drawLabelLine();
            },
            // 添加标注
            addLabel: e => {
              e.stopPropagation();
              if (this._flag.line.key > -1) {
                this.drawAddLabel(1);
              }
            },
            // 取消标注
            cancelLabel: () => {
              this._flag.addPeak.length = 0;
              this._flag.addPeakPos.length = 0;
              this._drawTools.ctx.foreground.clearRect(
                0,
                0,
                this._dom.width,
                this._dom.height
              );
            },
            // 校准倍频
            setPeak: () => {
              this._flag.tools.flag_addPeak = !this._flag.tools.flag_addPeak;
            },
            // 导出图片
            exportImage: () => {
              let img = new Image();
              const opt = this._option;
              const dom = this._dom;
              let canvas = document.createElement("canvas");
              canvas.setAttribute("height", dom.height);
              canvas.setAttribute("width", dom.width);
              let ctx = canvas.getContext("2d");
              ctx.beginPath();
              ctx.fillStyle = opt.backgroundColor;
              ctx.fillRect(0, 0, dom.width, dom.height);
              for (let key in this._drawTools.canvas) {
                ctx.drawImage(this._drawTools.canvas[key], 0, 0);
              }
              img.src = canvas.toDataURL("image/png", 1.0);
              let downLoad = document.createElement("a");
              let ImgName = opt.tools.exportImage.imageName;
              if (Array.isArray(ImgName)) {
                const strArr = [];
                for (let i = 0, l = ImageName.length; i < l; i++) {
                  const nameValue = ImageName[i];
                  if (strArr.includes(nameValue)) {
                    ImageName.splice(-1, 1);
                    i--;
                  } else {
                    strArr.push(nameValue);
                  }
                }
                fileName = ImgName.join("_");
              }
              downLoad.href = img.src;
              downLoad.download =
                opt.tools.exportImage.imageName === ""
                  ? opt.title.name
                  : opt.tools.exportImage.imageName;
              +".png";
              downLoad.dispatchEvent(new MouseEvent("click"));
            },
            // 数据导出
            exportData: () => {
              const opt = this._option;
              var str = ""; //导出数据（中文兼容）
              const name = opt.tools.exportData.fileName;
              let fileName = ""; //导出文件名
              const dataX = opt.x.data;
              const dataY = opt.y.data;
              const l = dataX.length;
              if (this.getDataType(dataX[0]) === "Array") {
                let p = 0; /* 最长一组数据长度 */
                str += `\ufeff`;
                for (let i = 0; i < l; i++) {
                  const len = dataX[i].length;
                  p < len && (p = len);
                  str += `X,Y,`;
                  fileName += i === 0 ? `${name[i]}` : `-${name[i]}`;
                }
                fileName += ".csv";
                str += `\r\n`;
                for (var i = 0; i < p; i++) {
                  for (let j = 0; j < l; j++) {
                    const x = dataX[j][i] || "";
                    const y = dataY[j][i] || "";
                    str += `${x},${y.toFixed(4) * 1}`;
                  }
                  str += "\r\n";
                }
              } else {
                fileName = `${name}.csv`;
                str += "\ufeffX,Y\r\n";
                for (var i = 0; i < l; i++) {
                  str += dataX[i] + "," + dataY[i].toFixed(4) * 1 + "\r\n";
                }
              }
              this.funDownload(str, fileName);
            },
            // 音频导出
            exportAudio: () => {
              const opt = this._option;
              const audio = opt.tools.exportAudio;
              var freq = audio.maxFreq; //采样频率
              var wave = this.cloneObj(opt.y.data, true); //数据
              let buffer = null;
              const name = audio.fileName;
              let fileName = "";
              if (this.getDataType(freq) === "Array") {
                for (let i = 0, l = wave.length; i < l; i++) {
                  buffer = this.setAudio(freq[i], wave[i]);
                  fileName = `${name[i]}.wav`;
                  this.funDownload(buffer, fileName);
                }
              } else {
                buffer = this.setAudio(freq, wave);
                fileName = `${name}.wav`; //导出文件名
                this.funDownload(buffer, fileName);
              }
            },
            // 转速脉冲
            speedPulse: () => {
              let flag = this._flag,
                tools = flag.tools,
                line = flag.line;
              let opt = this._option;
              flag.tools.flag_wave_Pulse = Number(
                this._option.tools.speedPulse.data.speedPulse
              );
              if (this._option.tools.speedPulse.data.XArray.length > 0) {
                flag.tools.flag_wave_Pulse = Math.abs(
                  --flag.tools.flag_wave_Pulse
                );
                this._option.tools.speedPulse.formatter(
                  Boolean(flag.tools.flag_wave_Pulse)
                );
              } else {
                flag.tools.flag_wave_Pulse = false;
              }
              this.drawWavePulse();
            }
          }
        };
        this.creat(dom);
        return this;
      };
      _chart.prototype = {
        constructor: _chart,
        // 判断数据类型
        getDataType (data) {
          return Object.prototype.toString.call(data).slice(8, -1);
        },
        // 保留小数
        round (num, dig = 255) {
          let val = Math.abs(num);
          if (val >= 10 ** 8 || val <= 10 ** -8 || val === 0) {
            return num;
          }
          if (dig === 255) {
            dig = 0;
            let value = val;
            while (value < 1) {
              value *= 10;
              dig++;
            }
            dig += 2;
            val >= 1000 && (dig = 0);
            val >= 10 && (dig = 1);
          }
          let len = 10 ** dig;
          return Math.round(num * len) / len;
        },
        // 添加class
        addClass (el, _class) {
          let elClassArr = el.className.split(" "); // 把字符串转成数组格式
          let classArr = _class.split(" "); // 把字符串转成数组格式
          classArr.forEach(item => {
            if (elClassArr.indexOf(item) === -1) {
              // 避免奇怪的类型混入
              elClassArr.push(String(item));
            }
          });
          el.className = elClassArr.join(" "); // 把原数组拼接成字符串
          return el; // 返回dom元素
        },
        // 删除class属性
        removeClass (el, _class) {
          let elClassArr = el.className.split(" ");
          let classArr = _class.split(" ");
          classArr.forEach(item => {
            let index = elClassArr.indexOf(item); // 大于0的时候，为对象的索引值
            if (index > -1) {
              elClassArr.splice(index, 1);
            }
          });
          el.className = elClassArr.join(" ");
          return el;
        },
        // 判断数据是否为原始类型
        isStatic (val) {
          return (
            typeof val === "string" ||
            typeof val === "number" ||
            typeof val === "boolean" ||
            typeof val === "undefined" ||
            val === null
          );
        },
        // 复制对象
        cloneObj (val, deep) {
          if (this.isStatic(val)) return val;
          if (Array.isArray(val))
            return val.map(item => (deep ? this.cloneObj(item, deep) : item));
          else if (typeof val === "object") {
            const wType = ["Error", "Date", "RegExp"];
            var type = Object.prototype.toString.call(val).slice(8, -1);
            if (wType.includes(type)) return new window[type](val);
            var tag = {};
            for (let key in val) {
              tag[key] = deep ? this.cloneObj(val[key], deep) : val[key];
            }
            return tag;
          }
        },
        // 获取 dom, 绑定监听事件, 创建 canvas
        creat: function (dom) {
          if (typeof dom === "undefined") return;
          let _dom = this._dom;
          _dom.id = "windit_" + new Date().valueOf();
          for (let i = 0, l = dom.children.length; i < l; i++) {
            const child = dom.children[i];
            if (child.nodeName === "DIV") {
              dom.removeChild(child);
              i--;
              l = dom.children.length;
            }
          }
          _dom.height = Math.round(dom.clientHeight);
          _dom.width = Math.round(dom.clientWidth);
          dom.style.position = "relative";
          const layer = [
            "background", // 背景
            "data", // 数据
            "foreground", // 前景
            "speed", // 转速
            "failure", // 故障频率
            "subFreq", // 差频信息
            "nxFreq", // 倍频信息
            "click", // 操作(点击画线)
            "pulse", //转速脉冲
            "zoom" // 操作(开窗放大)
          ];
          let div = document.createElement("div");
          // 去除标线
          div.setAttribute(
            "style",
            "height: " +
            _dom.height +
            "px;width: " +
            _dom.width +
            "px;outline: none;"
          );
          div.setAttribute("tabindex", 1);
          for (var i = 0, l = layer.length; i < l; i++) {
            let canvas = document.createElement("canvas");
            canvas.setAttribute("height", _dom.height);
            canvas.setAttribute("width", _dom.width);
            canvas.setAttribute("style", "position: absolute");
            this._drawTools.canvas[layer[i]] = canvas;
            this._drawTools.ctx[layer[i]] = canvas.getContext("2d");
            div.appendChild(canvas);
            dom.appendChild(div);
          }
        },
        // 处理 option
        setOption: function (opt1, opt2 = option) {
          if (!opt1) return;
          // this.destory();
          const flag = this._flag;
          const mark = opt1.series.markLine;
          let isMarkSame = true;//markLine 是否相同
          if (mark && mark.data) {
            // 长度相同可能是切换
            if (mark.isRefresh !== undefined) {
              if (!mark.isRefresh) {
                isMarkSame = false
              }
              mark.isRefresh = true
            }
          }
          // if (opt1.x && opt2.x && opt1.x.data && opt2.x.data && opt1.x.data.length != opt2.x.data.length) {
          //   isMarkSame = false
          // }
          if (!isMarkSame) {
            this._option = this.mergeOption(opt2, opt1);
            this._option.resize = this.resize;
            // 防止合并opt2和opt1后，opt1的markLine无数据取了opt2数据
            this._option.series.markLine.data = mark.data
            const coordinateSystem = this._option.series.coordinateSystem;
            if (coordinateSystem === "rectanguler") {
              this.drawMarkLine();
            } else if (coordinateSystem === "circle") {
              this.getNearPoint(mark.data);
            } else if (!coordinateSystem) {//对比分析图故障频率
              this.drawMarkLine();
            }
            return;
          }
          if (opt1.series.isRestore === false) return;
          let opt = (this._option = this.mergeOption(opt2, opt1));
          mark && (opt.series.markLine.data = mark.data);
          if (opt.x.type === "bar" && opt.x.data.length > 12) return;
          this._option.resize = this.resize;
          const coordinateSystem = opt.series.coordinateSystem;
          if (opt.x.data) {
            flag.dataLength || (flag.dataLength = opt.x.data.length);
          }
          flag.spectrumXName === "" && (flag.spectrumXName = opt.x.name);
          flag.spectrumYName === "" && (flag.spectrumYName = opt.y.name);
          let dom = this._dom;
          opt.series.dataMsg.rotateSpeed == 0 &&
            (opt.series.dataMsg.rotateSpeed = 1);
          this.initParams();
          let grid = opt.grid;
          for (let key in grid) {
            if (typeof grid[key] === "string") {
              opt.grid[key] =
                key === "left" || key === "right"
                  ? (dom.width * grid[key].slice(0, grid[key].indexOf("%"))) / 100
                  : (dom.height * grid[key].slice(0, grid[key].indexOf("%"))) /
                  100;
            }
          }
          let tools = opt.tools;
          for (let k in tools) {
            if (k === "setPower" || k === "hideLow") continue;
            const value = tools[k];
            if (value.dom && value.show) {
              // k === "setPeak" && (flag.tools.flag_addPeak = value.show);
              this.addEvent(value.dom, "click", this.event.tool[k]);
            }
          }
          this._scope.r = {
            r: dom.width - opt.grid.right,
            w: dom.width - opt.grid.right - opt.grid.left,
            b: dom.height - opt.grid.bottom,
            h: dom.height - opt.grid.top - opt.grid.bottom,
            x: null,
            y: null,
            rs: null
          };
          const r = this._scope.r;
          const wr = r.w / 2;
          const hr = r.h / 2;
          r.x = wr + opt.grid.left;
          r.y = hr + opt.grid.top;
          r.rs = Math.min(wr, hr);
          opt.series.type === "bar" && (r.b -= 60);
          // 点击画线(描点)
          opt.series.type !== "bar" &&
            opt.toolTip.isShow &&
            this.addEvent(dom.name, "click", this.event.dom.click);
          let layer = this._drawTools.ctx;
          for (let key in layer) {
            layer[key].clearRect(0, 0, this._dom.width, this._dom.height);
          }
          if (coordinateSystem === "rectanguler") {
            if (opt.series.type !== "bar") {
              // 拖动图谱 & 开窗放大 handler
              this.addEvent(dom.name, "mousedown", this.event.dom.mousedown);
              this.addEvent(dom.name, "mouseup", this.event.dom.mouseup);
              // 双击
              this.addEvent(dom.name, "dblclick", this.event.dom.lineDblclick);
              // 缩放
              this.addEvent(dom.name, "mousewheel", this.event.dom.zoom);
              // dom.name.addEventListener('mousewheel', this.event.dom.zoom, false);
              const div = dom.name.children;
              this.addEvent(
                div[div.length - 1],
                "keydown",
                this.event.dom.keydown
              );
            } else if (opt.series.type === "bar") {
              this.addEvent(dom.name, "mousemove", this.event.dom.barMove);
              this.addEvent(dom.name, "dblclick", this.event.dom.barDblclick);
            }
            if (
              opt.x.data !== undefined &&
              opt.x.data !== null &&
              opt.y.data !== undefined &&
              opt.y.data !== null
            ) {
              this.restoreAll(1);
              this.drawMarkLine();
              /* 画报警线 */
              /* const markY = opt.y.markLine;
              if (markY && markY[0].data !== '') {
                this.drawMarkY();
              } */
            }
          } else if (coordinateSystem === "circle") {
            this.restoreAll();
            opt.series.circleAlarm.length > 0 && this.drawCircleAlarm();
          } else if (coordinateSystem === "circleLine") {
            this.restoreAll();
          }
        },
        // 初始化参数
        initParams: function () {
          let flag = this._flag;
          const opt = this._option;
          if (opt.changePos) {
            flag.spectrumXName = "";
            flag.line = {
              key: -1,
              val: -1,
              idx: undefined
              // idx:0
            };
            flag.arr_B.length = 0;
            flag.arr_C.length = 0;
            flag.toolCheck = -1;
            flag.tools.autoPeakNum = -1;
            flag.addPeak.length = 0;
            flag.addPeakPos.length = 0;
            flag.labelLine = {
              spectrum: [],
              wave: []
            };
            flag.last_xWave = {
              key: -1,
              val: -1,
              idx: undefined
            };
            flag.maxMin = 0;
            flag.peakIndexArr = [];
            flag.tools.flag_subFreq = 0;
            flag.tools.flag_oneF = 0;
            flag.tools.flag_subTime = 0;
            flag.tools.flag_wave_extend = 0;
            flag.tools.flag_nx = 0;
          }
          if (opt.x.data && opt.x.data.length > 0) {
            if (
              this.getDataType(opt.x.data[0]) === "Array" &&
              opt.x.data[flag.line.idx] != undefined
            ) {
              let congruenceName = {
                x: false,
                y: false
              };
              if (this.getDataType(opt.x.name) === "Array") {
                congruenceName.x =
                  opt.x.name.sort().toString() ===
                  flag.spectrumXName.sort().toString();
              } else {
                congruenceName.x = opt.x.name === flag.spectrumXName;
              }
              if (this.getDataType(opt.y.name) === "Array") {
                congruenceName.y =
                  opt.y.name.toString() === flag.spectrumYName.sort().toString();
              } else {
                congruenceName.y = opt.y.name === flag.spectrumYName;
              }
              if (congruenceName.x && congruenceName.y) {
                if (flag.line.key === -1) {
                  flag.line.val = undefined;
                } else {
                  flag.line.val = opt.x.data[flag.line.idx][flag.line.key];
                }
              } else {
                if (flag.line.key > -1) {
                  flag.line.key = this.indexOfArray(
                    opt.x.data[flag.line.idx],
                    flag.line.val,
                    0
                  );
                  // flag.spectrumXName = opt.x.name[flag.line.idx];
                  // flag.spectrumYName = opt.y.name[flag.line.idx];
                  //推入spectrumXName
                  flag.spectrumXName = [];
                  flag.spectrumYName = [];
                  flag.spectrumXName.push(opt.x.name[flag.line.idx]);
                  flag.spectrumYName.push(opt.y.name[flag.line.idx]);
                }
              }
            } else {
              if (
                opt.x.name === flag.spectrumXName ||
                opt.y.name === flag.spectrumYName
              ) {
                flag.line.val = opt.x.data[flag.line.key];
              } else {
                //spectrumXName置空
                flag.spectrumXName = "";
                flag.spectrumYName = "";
                flag.line.key = this.indexOfArray(opt.x.data, flag.line.val, 0);
                flag.spectrumXName = opt.x.name;
                flag.spectrumYName = opt.y.name;
              }
            }
          }
          flag.subFreqAxis = -1;
          flag.zoom = 0;
          flag.click = 1;
          this._scope = {
            // 数据尺寸
            v: {
              // x 轴
              x: {
                start: null, // 最小值
                end: null, // 最大值
                length: null // 数据长度
              },
              // y 轴
              y: {
                start: null, // 最小值
                end: null, // 最大值
                length: null // 数据长度
              }
            },
            // 图谱尺寸
            r: {
              r: null, // 最右侧位置
              w: null, // 宽度
              b: null, // 最下侧位置
              h: null // 高度
            }
          };
          this._movePos = {
            x: {
              oldVal: 0,
              newVal: 0,
              move: 0,
              source: 0,
              addLabel: 0
            },
            y: {
              oldVal: 0,
              newVal: 0,
              move: 0,
              source: 0,
              addLabel: 0
            }
          };
          const drawTools = this._drawTools.ctx;
          for (let key in drawTools) {
            drawTools[key].clearRect(0, 0, this._dom.width, this._dom.height);
          }
        },
        // 深度合并对象
        mergeOption: function (FirstOBJ, SecondOBJ) {
          for (var key in SecondOBJ) {
            FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]"
              ? this.mergeOption(FirstOBJ[key], SecondOBJ[key])
              : (FirstOBJ[key] = SecondOBJ[key]);
          }
          return FirstOBJ;
        },
        // 计算时间格式
        formatDateStr: function (date, type = 1) {
          let time = {},
            str;
          time.yy = new Date(date).getFullYear();
          time.mm = new Date(date).getMonth() + 1;
          time.mm < 10 && (time.mm = "0" + time.mm);
          time.dd = new Date(date).getDate();
          time.dd < 10 && (time.dd = "0" + time.dd);
          str =
            type === 3
              ? time.mm + "-" + time.dd
              : time.yy + "-" + time.mm + "-" + time.dd;
          if (type === 2 || type === 3) {
            time.h = new Date(date).getHours();
            time.h < 10 && (time.h = "0" + time.h);
            time.m = new Date(date).getMinutes();
            time.m < 10 && (time.m = "0" + time.m);
            time.s = new Date(date).getSeconds();
            time.s < 10 && (time.s = "0" + time.s);
            str += " " + time.h + ":" + time.m + ":" + time.s;
          }
          return str;
        },
        // 初始化
        restoreAll: function (type) {
          const coordinateSystem = this._option.series.coordinateSystem;
          if (coordinateSystem === "rectanguler") {
            this.mappingX(type);
            this.mappingY(type);
            this.drawAxis();
            this.drawWave();
            this.zoomLine();
            /* 画报警线 */
            this.drawMarkY();
          } else if (coordinateSystem === "circle") {
            this.drawCircle();
            this.drawPoints();
          } else if (coordinateSystem === "circleLine") {
            this.drawCircleAxios();
            this.drawPointsLine();
          }
        },
        // 计算 x 轴比例
        mappingX: function (type) {
          // type：1 => 初始化；2 => 缩放；
          let scope = this._scope,
            params = this._computeParams;
          if (type === 1) {
            const opt = this._option;
            const optX = opt.x;
            const arr = optX.data;
            const l = arr.length;
            if (opt.series.type === "bar") {
              /* 柱状图处理 */
              const bar = scope.r.w / l;
              let barWidth = bar / 2;
              let space = bar / 2;
              if (bar > 80) {
                bar > 80 && (barWidth = 40);
                space = bar - barWidth;
              }
              params.extremum.x = {
                min: barWidth,
                max: space
              };
              scope.v.x.start = params.extremum.x.min;
              scope.v.x.end = params.extremum.x.max;
              scope.v.x.length = bar;
            } else {
              /* x轴最大值、最小值、范围、转换为坐标系的比例系数 */
              params.extremum.x = {
                min: Number.MAX_VALUE,
                max: 0
              };
              let i = 0;
              if (this.getDataType(arr[0]) === "Array") {
                for (; i < l; i++) {
                  const value = arr[i];
                  for (let j = 0, len = value.length; j < len; j++) {
                    const val = value[j];
                    params.extremum.x.max < val && (params.extremum.x.max = val);
                    params.extremum.x.min > val && (params.extremum.x.min = val);
                  }
                }
              } else {
                const range = optX.range;
                if (l === 1) {
                  params.extremum.x.max = range.max;
                  params.extremum.x.min = range.min;
                  if (opt.x.type === "time") {
                    params.extremum.x.min = arr[0] - 60 * 60 * 24;
                    params.extremum.x.max = arr[0] + 60 * 60 * 24;
                  }
                } else {
                  for (; i < l; i++) {
                    let val = arr[i];
                    params.extremum.x.max < val && (params.extremum.x.max = val);
                    params.extremum.x.min > val && (params.extremum.x.min = val);
                  }
                }
              }
              if (params.extremum.x.max === 0) {
                params.extremum.x.max = 1;
              }
              let divider = params.extremum.x.max - params.extremum.x.min;
              /* 如果所有的点X坐标都是相同的话，那么手动将固定距离为2 */
              if (divider == 0) {
                params.extremum.x.min = params.extremum.x.min - 1;
                params.extremum.x.max = params.extremum.x.max + 1;
                divider = 2;
              }
              let k = scope.r.w / divider;
              let b =
                (scope.r.r +
                  this._option.grid.left -
                  k * (params.extremum.x.max + params.extremum.x.min)) /
                2;
              params.proportion.x = {
                k,
                b
              };
              scope.v.x.start = params.extremum.x.min;
              scope.v.x.end = params.extremum.x.max;
              scope.v.x.length = divider;
            }
          } else {
            let k = scope.r.w / (scope.v.x.end - scope.v.x.start);
            let b =
              (scope.r.r +
                this._option.grid.left -
                k * (scope.v.x.end + scope.v.x.start)) /
              2;
            scope.v.x.length = scope.v.x.end - scope.v.x.start;
            params.proportion.x = {
              k,
              b
            };
          }
        },
        // 计算 y 轴比例
        mappingY: function (type) {
          // type：1 => 初始化；2 => 缩放；
          const wMarkLine = this._option.y.markLine;
          let scope = this._scope,
            params = this._computeParams;
          if (type === 1) {
            let arr = this._option.y.data;
            const l = arr.length;
            if (this._option.x.type === "category") {
              params.extremum.y = {
                min: Number.MAX_VALUE,
                max: Number.MAX_VALUE * -1
              };
              let val, value;
              for (let i = 0; i < l; i++) {
                val = arr[i];
                if (this.getDataType(arr[0]) === "Array") {
                  for (let j = 0, len = val.length; j < len; j++) {
                    value = val[j];
                    params.extremum.y.max < value &&
                      (params.extremum.y.max = Number(value));
                    params.extremum.y.min > value &&
                      (params.extremum.y.min = Number(value));
                  }
                } else if (Number(val) || Number(val) === 0) {
                  params.extremum.y.max < val &&
                    (params.extremum.y.max = Number(val));
                  params.extremum.y.min > val &&
                    (params.extremum.y.min = Number(val));
                } else continue;
              }
              // 防止统计列表最小值不画柱体的现象
              if (this._option.series.type === "bar") {
                if (params.extremum.y.min == 0) {
                  params.extremum.y.min = params.extremum.y.min - 0.02;
                } else {
                  params.extremum.y.min =
                    params.extremum.y.min - Math.abs(params.extremum.y.min);
                }
              }
              // if (this._option.series.type === "bar") params.extremum.y.min = 0;
            } else {
              params.extremum.y = {
                min: 0,
                max: Number.MAX_VALUE * -1
              };
              for (let i = 0; i < l; i++) {
                const val = arr[i];
                if (this.getDataType(arr[0]) === "Array") {
                  for (let j = 0, len = val.length; j < len; j++) {
                    const value = val[j];
                    params.extremum.y.max < value &&
                      (params.extremum.y.max = Number(value));
                    params.extremum.y.min > value &&
                      (params.extremum.y.min = Number(value));
                  }
                } else {
                  params.extremum.y.max < val &&
                    (params.extremum.y.max = Number(val));
                  // 图谱为波形频谱图中的趋势图时，循环取最小值（防止负值为最大值，0为最小值的情况）
                  if (
                    this._option.y.wtype &&
                    this._option.y.wtype == "wave_trend"
                  ) {
                    params.extremum.y.min > val &&
                      (params.extremum.y.min = Number(val));
                  }
                }
              }
            }
            /* 如果最大最小值相同 */
            if (params.extremum.y.max === params.extremum.y.min) {
              params.extremum.y.max += 0.3;
              params.extremum.y.min -= 0.3;
            }
            /* 如果有报警线，需要画出报警线 */
            if (wMarkLine) {
              let min, max;
              wMarkLine.forEach((item, index) => {
                if (index === 0) {
                  min = item.data;
                  max = item.data;
                } else {
                  if (min > item.data) {
                    min = item.data;
                  }
                  if (max < item.data) {
                    max = item.data;
                  }
                }
              });
              /* 如果数据在最大最小值 之外，则报警门限为最大最小值 */
              if (min < params.extremum.y.min) {
                params.extremum.y.min = min;
              }
              if (max > params.extremum.y.max) {
                params.extremum.y.max = max;
              }
            }
            const mutiple = (params.extremum.y.max - params.extremum.y.min) / 10;
            scope.v.y.start = params.extremum.y.min;
            scope.v.y.end = this.round(params.extremum.y.max + mutiple, 7);
            let k = scope.r.h / (scope.v.y.start - scope.v.y.end);
            scope.v.y.start === scope.v.y.end && (k = 0);
            let b = scope.r.b - scope.v.y.start * k;
            params.proportion.y = {
              k,
              b
            };
          } else {
            let k, b;
            let n =
              scope.v.y.start === scope.v.y.end
                ? -1
                : scope.v.y.start - scope.v.y.end;
            k = scope.r.h / n;
            b = scope.r.b - scope.v.y.start * k;
            params.proportion.y = {
              k,
              b
            };
          }
          scope.v.y.length = scope.v.y.end - scope.v.y.start;
        },
        // 画坐标系
        drawAxis: function () {
          let backCtx = this._drawTools.ctx.background;
          const opt = this._option;
          const scope = this._scope;
          let stationInfo = opt.y.stationInfo;
          backCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          //  画 y 轴
          let nameX = "";
          const nameXArr = [];
          let nameY = "";
          const nameYArr = [];
          if (this.getDataType(opt.x.name) === "Array") {
            for (let name of opt.x.name) {
              if (!nameXArr.includes(name)) {
                nameX += `${name}/`;
                nameXArr.push(name);
              }
            }
            nameX = nameX.slice(0, -1);
          } else {
            nameX = opt.x.name;
          }
          if (this.getDataType(opt.y.name) === "Array") {
            for (let name of opt.y.name) {
              if (!nameYArr.includes(name)) {
                nameY += `${name}/`;
                nameYArr.push(name);
              }
            }
            nameY = nameY.slice(0, -1);
          } else {
            nameY = opt.y.name;
          }
          backCtx.beginPath();
          backCtx.save();
          backCtx.lineWidth = opt.y.lineStyle.width;
          backCtx.strokeStyle = opt.y.lineStyle.color;
          backCtx.moveTo(opt.grid.left + 0.5, this._scope.r.b + 0.5); // 原点
          backCtx.lineTo(opt.grid.left + 0.5, opt.grid.top); // y 轴
          backCtx.stroke();
          backCtx.restore();
          backCtx.font =
            opt.y.nameStyle.weight +
            " " +
            opt.y.nameStyle.size +
            " " +
            opt.y.nameStyle.family;
          backCtx.textBaseline = "bottom";
          backCtx.textAlign = opt.y.nameStyle.align;
          backCtx.fillStyle = opt.y.nameStyle.color;
          if (opt.y.name2 && opt.y.name2 != "") {
            if (opt.series.type !== "bar") {
              backCtx.fillText(nameY, opt.grid.left, opt.grid.top - 20);
              backCtx.fillText(opt.y.name2, opt.grid.left, opt.grid.top - 5);
            } else {
              const offset = backCtx.measureText(nameY);
              backCtx.fillText(nameY, opt.grid.left, opt.grid.top - 5);
              backCtx.textAlign = "left";
              backCtx.fillText(
                opt.y.name2,
                opt.grid.left + offset.width,
                opt.grid.top - 5
              );
            }
          } else {
            backCtx.fillText(nameY, opt.grid.left, opt.grid.top - 5);
          }
          //  画 x 轴
          backCtx.beginPath();
          backCtx.lineWidth = opt.x.lineStyle.width;
          backCtx.strokeStyle = opt.x.lineStyle.color;
          backCtx.moveTo(opt.grid.left + 0.5, this._scope.r.b + 0.5); // 原点
          backCtx.lineTo(this._scope.r.r + 0.5, this._scope.r.b + 0.5); // x 轴
          backCtx.font =
            opt.x.nameStyle.weight +
            " " +
            opt.x.nameStyle.size +
            " " +
            opt.x.nameStyle.family;
          backCtx.textBaseline = "middle";
          backCtx.textAlign = "right";
          backCtx.fillStyle = opt.x.nameStyle.color;
          backCtx.fillText(
            nameX,
            this._scope.r.r,
            this._scope.r.b + Number(opt.x.nameStyle.bottom)
          );
          backCtx.fillText(
            opt.x.name2,
            this._scope.r.r,
            this._scope.r.b + Number(opt.x.nameStyle.bottom2)
          );
          backCtx.stroke();
          backCtx.restore();
          //  图谱标题
          if (opt.title.show && opt.title.name !== "") {
            backCtx.beginPath();
            backCtx.font =
              opt.title.fontStyle.weight +
              " " +
              opt.title.fontStyle.size +
              " " +
              opt.title.fontStyle.family;
            backCtx.textAlign = opt.title.fontStyle.align;
            backCtx.fillStyle = opt.title.fontStyle.color;
            backCtx.textBaseline = "top";
            let x;
            switch (opt.title.fontStyle.align) {
              case "left":
                x = 0;
                break;
              case "center":
                x = this._dom.width / 2;
                break;
              case "right":
                x = this._dom.width;
                break;
            }
            backCtx.fillText(opt.title.name, x, 5);
          }
          if (opt.x.data === undefined || opt.y.data.length === 0) {
            return;
          }
          backCtx.beginPath();
          backCtx.lineWidth = opt.x.lineStyle.width;
          backCtx.strokeStyle = opt.x.lineStyle.color;
          backCtx.textAlign = "center";
          backCtx.textBaseline = "middle";
          backCtx.save();
          let position = {
            x: {},
            y: {}
          };
          let fontLen = {
            x: 0,
            y: 0
          };
          //  计算 x 轴刻度
          if (opt.series.type !== "bar") {
            position.x.iSegNum = Math.round(this._scope.r.w / 25);
            position.x.minSeg = this._scope.v.x.length / position.x.iSegNum;
            position.x.mi = Math.round(Math.log(position.x.minSeg) * Math.LOG10E);
            position.x.nScale = Math.pow(10, position.x.mi);
            position.x.seg = position.x.nScale / 5;
            position.x.seg < position.x.minSeg &&
              (position.x.seg = position.x.nScale / 2);
            position.x.seg < position.x.minSeg &&
              (position.x.seg = position.x.nScale);
            position.x.seg < position.x.minSeg &&
              (position.x.seg = position.x.nScale * 2);
            position.x.seg < position.x.minSeg &&
              (position.x.seg = position.x.nScale * 5);
            position.x.seg < position.x.minSeg &&
              (position.x.seg = position.x.nScale * 10);
            position.x.seg = parseFloat(position.x.seg.toPrecision(7).toString());
            //  画 x 轴刻度
            backCtx.font = opt.x.fontStyle.size + " " + opt.x.fontStyle.family;
            backCtx.fillStyle = opt.x.fontStyle.color;
            let timeLen = this._scope.v.x.end - this._scope.v.x.start;
            let start = opt.x.type === "time" ? this._scope.v.x.start : 0;
            for (
              let i = start, j = 0, l = this._scope.v.x.end - position.x.seg;
              i < l;
              i += position.x.seg, j++
            ) {
              let x =
                i * this._computeParams.proportion.x.k +
                this._computeParams.proportion.x.b;
              if (x >= opt.grid.left && x <= this._scope.r.r - 30) {
                // 不要挡住单位
                if (opt.x.type === "category" && j % 2 === 0) {
                  let font = parseFloat(i.toPrecision(6)).toString();
                  if (font.indexOf(".") !== -1) {
                    let fl = font.slice(font.indexOf("."));
                    fontLen.x <= fl.length
                      ? (fontLen.x = fl.length)
                      : (font = font + "0");
                  } else {
                    if (fontLen.x > 0) {
                      let zero = ".";
                      for (let k = 1; k < fontLen.x; k++) {
                        zero += "0";
                      }
                      font = font + zero;
                    } else if (position.x.seg < 0.5) {
                      font += ".0";
                    }
                  }
                  backCtx.fillText(font, x, this._scope.r.b + 15);
                  backCtx.moveTo(x + 0.5, this._scope.r.b);
                  backCtx.lineTo(x + 0.5, this._scope.r.b + 5);
                } else if (opt.x.type === "time" && j % 5 === 0) {
                  let font =
                    timeLen > 86400000
                      ? this.formatDateStr(i, 1)
                      : this.formatDateStr(i, 3);
                  backCtx.fillText(font, x, this._scope.r.b + 15);
                  backCtx.moveTo(x + 0.5, this._scope.r.b);
                  backCtx.lineTo(x + 0.5, this._scope.r.b + 5);
                }
              }
            }
            /* 画站点信息 */
            if (stationInfo) {
              stationInfo.forEach(item => {
                if (
                  item.distance < start ||
                  item.distance > this._scope.v.x.end - position.x.seg
                )
                  return;
                /* item.符合 的站点 */
                let distance = item.distance;
                let font = item.station_name;
                let x =
                  distance * this._computeParams.proportion.x.k +
                  this._computeParams.proportion.x.b;
                backCtx.fillText(font, x, this._scope.r.b + 40);
              });
            }
            backCtx.stroke();
            backCtx.restore();
          } else {
            if (opt.x.xshow === false) {
              // 画 x 轴刻度
              backCtx.beginPath();
              backCtx.font = opt.x.fontStyle.size + " " + opt.x.fontStyle.family;
              backCtx.fillStyle = opt.x.fontStyle.color;
              backCtx.textAlign = "center";
              backCtx.textBaseline = "top";
              for (let i = 0, l = opt.x.data.length; i < l; i++) {
                const value = opt.x.data[i];
                // x轴分数据量赋值柱状图与序号会存在错位的现象
                let x = scope.v.x.length * i + opt.grid.left + 20;
                if (opt.x.data.length > 10) {
                  x = scope.v.x.length * i + opt.grid.left + scope.v.x.length / 4;
                }

                // for (let j = 0, len = value.length; j < len; j++) {
                //   let text = value[j];
                //   if (text.length > 6) {
                //     text = `${text.slice(0, 7)}...`;
                //   }
                let a = i + 1;
                backCtx.fillText(a, x, scope.r.b + 18 + 1.5);
                // }
              }
            } else {
              // 画 x 轴刻度
              backCtx.beginPath();
              backCtx.font = opt.x.fontStyle.size + " " + opt.x.fontStyle.family;
              backCtx.fillStyle = opt.x.fontStyle.color;
              backCtx.textAlign = "center";
              backCtx.textBaseline = "top";
              for (let i = 0, l = opt.x.data.length; i < l; i++) {
                const value = opt.x.data[i];
                const x = scope.v.x.length * i + opt.grid.left + 20;
                for (let j = 0, len = value.length; j < len; j++) {
                  let text = value[j];
                  if (text.length > 6) {
                    text = `${text.slice(0, 7)}...`;
                  }
                  backCtx.fillText(text, x, scope.r.b + 18 * j + 1.5);
                }
              }
            }
          }
          //  计算 y 轴刻度
          /* 20等分，每份的长度 */
          position.y.iSegNum = Math.round(this._scope.r.h / 20);
          /* 最大最小值距离 */
          position.y.minSeg = this._scope.v.y.length / position.y.iSegNum;
          position.y.mi = Math.round(Math.log(position.y.minSeg) * Math.LOG10E);
          position.nScaleY = Math.pow(10, position.y.mi);
          // 刻度
          position.y.seg = position.nScaleY / 5;
          position.y.seg < position.y.minSeg &&
            (position.y.seg = position.nScaleY / 2);
          position.y.seg < position.y.minSeg &&
            (position.y.seg = position.nScaleY);
          position.y.seg < position.y.minSeg &&
            (position.y.seg = position.nScaleY * 2);
          position.y.seg < position.y.minSeg &&
            (position.y.seg = position.nScaleY * 5);
          position.y.seg < position.y.minSeg &&
            (position.y.seg = position.nScaleY * 10);
          /* 7位长度 */
          position.y.seg = parseFloat(position.y.seg.toPrecision(7).toString());
          //  画 y 轴刻度
          backCtx.font = opt.y.fontStyle.size + " " + opt.y.fontStyle.family;
          backCtx.textAlign = "right";
          backCtx.fillStyle = opt.y.fontStyle.color;
          let interval =
            (this._scope.v.y.end - this._scope.v.y.start) / position.y.seg > 7
              ? 2
              : 1;
          position.y.seg <= 0.00001 && (position.y.seg = 0.00001);
          let font = "";
          for (
            let i = this._scope.v.y.end, j = 0;
            i >= this._scope.v.y.start;
            j++
          ) {
            let y = this.round(
              i * this._computeParams.proportion.y.k +
              this._computeParams.proportion.y.b
            );
            if (
              y <= this._scope.r.b &&
              y >= opt.grid.top &&
              j % interval === 0 &&
              j !== 0 &&
              i !== font
            ) {
              font = this.round(i);
              /* if (font.indexOf('.') !== -1) {
                let fl = font.slice(font.indexOf('.'))
                fontLen.y <= fl.length ?
                  fontLen.y = font.slice(font.indexOf('.')).length :
                  font = font + '0'
              } else {
                if (fontLen.y > 0) {
                  let zero = '.'
                  for (let k = 1; k < fontLen.y; k++) {
                    zero += '0'
                  }
                  font = font + zero
                }
              } */
              /* font > 0 ?
                backCtx.fillText(font, opt.grid.left - 10, y + 0.5) : */
              backCtx.fillText(font, opt.grid.left - 10, y + 0.5);
              backCtx.moveTo(opt.grid.left, y + 0.5);
              backCtx.lineTo(opt.grid.left - 5, y + 0.5);
            }
            i = this.round(i - position.y.seg, 7);
          }
          /* for (let i = 0, j = 0; i <= this._scope.v.y.end; i += position.y.seg, j++) {
            let y = i * this._computeParams.proportion.y.k + this._computeParams.proportion.y.b;
            let font = parseFloat(i.toPrecision(7)).toString();
            if (y <= this._scope.r.b && y >= opt.grid.top && j % interval === 0) {
              if (font.indexOf('.') !== -1) {
                let fl = font.slice(font.indexOf('.'))
                fontLen.y <= fl.length ?
                  fontLen.y = font.slice(font.indexOf('.')).length :
                  font = font + '0'
              } else {
                if (fontLen.y > 0) {
                  let zero = '.'
                  for (let k = 1; k < fontLen.y; k++) {
                    zero += '0'
                  }
                  font = font + zero
                }
              }
              font > 0 ?
                backCtx.fillText(font, opt.grid.left - 10, y + 0.5) :
                font < 0 ?
                backCtx.fillText(font, opt.grid.left - 10, y + 0.5) :
                backCtx.fillText(0, opt.grid.left - 10, y + 0.5)
              backCtx.moveTo(opt.grid.left, y + 0.5)
              backCtx.lineTo(opt.grid.left - 5, y + 0.5)
            }
          } */
          backCtx.stroke();
          backCtx.beginPath();
          backCtx.strokeStyle = opt.y.splitLineStyle.color;
          backCtx.lineWidth = opt.y.splitLineStyle.width;
          // 刻度标线 （y轴）
          for (
            let i = this._scope.v.y.end, j = 0;
            i >= this._scope.v.y.start;
            i -= position.y.seg, j++
          ) {
            let y = this.round(
              i * this._computeParams.proportion.y.k +
              this._computeParams.proportion.y.b
            );
            const fonts = Math.round(i * 1000000) / 1000000;
            if (
              y <= this._scope.r.b &&
              y >= opt.grid.top &&
              j % interval === 0 &&
              j !== 0 &&
              fonts !== font
            ) {
              font = fonts;
              backCtx.moveTo(opt.grid.left, y + 0.5);
              backCtx.lineTo(this._scope.r.r, y + 0.5);
            }
          }
          /* for (let i = 0, j = 0; i <= this._scope.v.y.end; i += position.y.seg, j++) {
            let y = i * this._computeParams.proportion.y.k + this._computeParams.proportion.y.b;
            if (y <= this._scope.r.b && y >= opt.grid.top && j % interval === 0) {
              backCtx.moveTo(opt.grid.left, y + 0.5)
              backCtx.lineTo(this._scope.r.r, y + 0.5)
            }
          } */
          backCtx.stroke();
        },
        // 点击画线
        drawLine: function (res) {
          let params = this._computeParams.proportion,
            opt = this._option,
            clickCtx = this._drawTools.ctx.click,
            xOVal = params.x.k * res.val + params.x.b;
          const scopeR = this._scope.r;
          let line = {
            x: {
              oldVal: res.key == 0 ? xOVal + 0.5 : xOVal,
              newVal: xOVal
            },
            y: {
              oldVal: opt.grid.top,
              newVal: scopeR.b
            }
          };
          let circle = {
            x: xOVal,
            y: []
          },
            yVal = [];
          clickCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          if (res.idx !== undefined) {
            const posName = opt.series.posName;
            const str = [];
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MAX_VALUE * -1;
            let maxY = Number.MAX_VALUE * -1;
            const unit = opt.y.name;
            for (let i = 0, l = opt.y.data.length; i < l; i++) {
              const valueX = opt.x.data[i];
              const valueY = opt.y.data[i];
              let valueSpeed;
              if (opt.y.speed && opt.y.speed[i]) {
                valueSpeed = opt.y.speed[i];
              }
              // const valueSpeed = opt.y.speed[i];
              for (let j = 0, len = valueY.length; j < len; j++) {
                const valX = valueX[j];
                const valY = valueY[j];
                if (j === res.key && valX === res.val) {
                  if (valY < minY) {
                    minY = valY;
                    minX = valX;
                  }
                  if (valY > maxY) {
                    maxY = valY;
                    maxX = valX;
                  }
                  const vY = this.round(valY, 4);
                  circle.y.push(valY * params.y.k + params.y.b);
                  if (valueSpeed && valueSpeed[j] !== undefined) {
                    str.push(
                      `${posName[i]}：${vY}${unit[i]}/转速：${valueSpeed[j]}rpm`
                    );
                  } else {
                    str.push(`${posName[i]}：${vY}${unit[i]}`);
                  }
                  // if (valueSpeed && valueSpeed[j] !== undefined) {
                  //   str.push(`转速：${valueSpeed[j]}rpm`);
                  // }
                  // yVal.push(typeof valY === 'number' ? Number(valY.toFixed(4)).toString() : valY);
                  break;
                }
              }
            }
            const l = str.length;
            if (l > 0) {
              const tt = opt.toolTip;
              const size = tt.symbol.size;
              const text = this.round(res.val, 4);
              let w = text.toString().length * 12;
              clickCtx.beginPath();
              clickCtx.strokeStyle = tt.lineStyle.color;
              // 画线
              if (tt.symbol.show) {
                clickCtx.moveTo(line.x.oldVal, line.y.oldVal);
                for (let i = 0; i < l; i++) {
                  clickCtx.lineTo(xOVal, circle.y[i] - size);
                  clickCtx.moveTo(opt.grid.left, circle.y[i]);
                  clickCtx.lineTo(xOVal - size, circle.y[i]);
                  clickCtx.moveTo(xOVal + size, circle.y[i]);
                  clickCtx.lineTo(scopeR.r, circle.y[i]);
                  clickCtx.moveTo(xOVal, circle.y[i] + size);
                }
                clickCtx.lineTo(xOVal, line.y.newVal);
                clickCtx.stroke();
                for (let i = 0; i < l; i++) {
                  clickCtx.beginPath();
                  clickCtx.fillStyle =
                    tt.symbol.color !== "" ? tt.symbol.color : tt.lineStyle.color;
                  clickCtx.arc(xOVal, circle.y[i], size, 0, Math.PI * 2);
                  clickCtx.fill();
                }
              } else {
                clickCtx.moveTo(line.x.oldVal, line.y.oldVal);
                clickCtx.lineTo(xOVal, line.y.newVal);
                for (let i = 0; i < l; i++) {
                  clickCtx.moveTo(opt.grid.left, circle.y[i]);
                  clickCtx.lineTo(scopeR.r, circle.y[i]);
                }
                clickCtx.stroke();
              }
              // 横坐标
              let rectX = line.x.oldVal - w / 2;
              let rectY = line.y.newVal + 1;
              let alignX = "center";
              if (rectX + w > scopeR.r) {
                rectX -= w / 2;
                alignX = "right";
              }
              clickCtx.beginPath();
              clickCtx.fillStyle = tt.background.color;
              clickCtx.fillRect(rectX, rectY, w, 20);
              clickCtx.fillStyle = tt.fontStyle.color;
              clickCtx.font =
                tt.fontStyle.weight +
                " " +
                tt.fontStyle.size +
                " " +
                tt.fontStyle.family;
              clickCtx.textBaseline = "top";
              clickCtx.textAlign = alignX;
              if (opt.x.type === "category") {
                clickCtx.fillText(text, line.x.oldVal, line.y.newVal + 5);
              } else if (opt.x.type === "time") {
                clickCtx.fillText(
                  this.formatDateStr(res.val, 2),
                  line.x.oldVal,
                  line.y.newVal + 5
                );
              }
              // 浮窗信息
              w = 0;
              for (let value of str) {
                const offset = clickCtx.measureText(value).width + 10;
                offset > w && (w = offset);
              }
              maxX = maxX * params.x.k + params.x.b;
              maxY = maxY * params.y.k + params.y.b;
              minX = minX * params.x.k + params.x.b;
              minY = minY * params.y.k + params.y.b;
              const h = l * 30;
              let x = 0;
              let y = 0;
              const separate = (scopeR.h * 2) / 3 + opt.grid.top;
              if (minY >= separate) {
                x = maxX + 20;
                y = maxY - 20 - h;
              } else {
                x = minX + 20;
                y = minY + 20;
              }
              if (y < opt.grid.top) {
                y = opt.grid.top;
              } else if (y + h > scopeR.b) {
                y -= 40 + h + opt.grid.bottom;
              }
              if (x + w + 100 >= scopeR.r) {
                x -= w + 40;
              }
              clickCtx.beginPath();
              clickCtx.fillStyle = tt.background.color;
              clickCtx.fillRect(x, y, w, h);
              clickCtx.fillStyle = tt.fontStyle.color;
              clickCtx.textAlign = "left";
              clickCtx.textBaseline = "top";
              for (let i = 0; i < l; i++) {
                const ty = i === 0 ? 8 : i * 30 + 8;
                clickCtx.fillText(str[i], x + 6, y + ty);
              }
            }
          } else {
            yVal =
              typeof opt.y.data[res.key] === "number"
                ? [Number(opt.y.data[res.key].toFixed(4)).toString()]
                : [opt.y.data[res.key]];
            circle = {
              x: xOVal,
              y: [opt.y.data[res.key] * params.y.k + params.y.b]
            };
            const l = circle.y.length;
            let isDraw = false;
            for (let i = 0; i < l; i++) {
              const value = circle.y[i];
              // +0.1防止散点图的点位于0轴出校值
              if (value >= opt.grid.top && value <= this._scope.r.b + 0.1) {
                isDraw = true;
                break;
              }
            }
            if (
              line.x.oldVal >= opt.grid.left &&
              line.x.oldVal <= this._scope.r.r &&
              isDraw
            ) {
              // 画线
              if (opt.toolTip.symbol.show) {
                const l = circle.y.length;
                let size = opt.toolTip.symbol.size;
                clickCtx.beginPath();
                clickCtx.lineWidth = 1;
                clickCtx.strokeStyle = opt.toolTip.lineStyle.color;
                // 竖线
                clickCtx.moveTo(line.x.oldVal, line.y.oldVal);
                for (let i = 0; i < l; i++) {
                  clickCtx.lineTo(line.x.newVal, circle.y[i] - size);
                  clickCtx.moveTo(line.x.newVal, circle.y[i] + size);
                }
                clickCtx.lineTo(line.x.newVal, line.y.newVal);
                // 横线
                for (let i = 0; i < l; i++) {
                  clickCtx.moveTo(opt.grid.left, circle.y[i]);
                  clickCtx.lineTo(circle.x - size, circle.y[i]);
                  clickCtx.moveTo(circle.x + size, circle.y[i]);
                  clickCtx.lineTo(this._scope.r.r, circle.y[i]);
                }
                clickCtx.stroke();
                // symbol
                for (let i = 0; i < l; i++) {
                  clickCtx.beginPath();
                  clickCtx.arc(circle.x, circle.y[i], size, 0, 2 * Math.PI);
                  clickCtx.fillStyle =
                    opt.toolTip.symbol.color !== ""
                      ? opt.toolTip.symbol.color
                      : opt.toolTip.lineStyle.color;
                  clickCtx.fill();
                  clickCtx.moveTo(line.x.oldVal, circle.y[i] + size);
                  clickCtx.lineTo(line.x.newVal, line.y.newVal);
                }
                clickCtx.stroke();
              } else {
                clickCtx.beginPath();
                clickCtx.lineWidth = 1;
                clickCtx.strokeStyle = opt.toolTip.lineStyle.color;
                clickCtx.moveTo(line.x.oldVal, line.y.oldVal);
                clickCtx.lineTo(line.x.newVal, line.y.newVal);
                clickCtx.moveTo(opt.grid.left, circle.y);
                clickCtx.lineTo(this._scope.r.r, circle.y);
                clickCtx.stroke();
              }
              // 画坐标值
              let l = yVal.length;
              let num = 0;
              for (let i = 0; i < l; i++) {
                yVal[i].length > num && (num = yVal[i].length);
              }
              let width = num === 1 ? 14 : num >= 5 ? num * 10 - 10 : num * 10;
              clickCtx.beginPath();
              clickCtx.fillStyle = opt.toolTip.background.color;
              for (let i = 0; i < circle.y.length; i++) {
                clickCtx.fillRect(
                  opt.grid.left - width - 1,
                  circle.y[i] - 10,
                  width,
                  20
                );
              }
              clickCtx.font =
                opt.toolTip.fontStyle.weight +
                " " +
                opt.toolTip.fontStyle.size +
                " " +
                opt.toolTip.fontStyle.family;
              const text = this.round(res.val, 4);
              let w = text.toString().length * 12;
              if (opt.x.type === "category") {
                let rectX = line.x.oldVal - w / 2;
                let rectY = line.y.newVal + 1;
                let alignX = "center";
                if (rectX + w > scopeR.r) {
                  rectX -= w / 2;
                  alignX = "right";
                }
                clickCtx.fillStyle = opt.toolTip.background.color;
                clickCtx.fillRect(rectX, rectY, w, 20);
                clickCtx.fillStyle = opt.toolTip.fontStyle.color;
                clickCtx.textBaseline = "top";
                clickCtx.textAlign = alignX;
                clickCtx.fillText(text, line.x.oldVal, line.y.newVal + 5);
                clickCtx.textBaseline = "middle";
                clickCtx.textAlign = "right";
                for (let i = 0; i < yVal.length; i++) {
                  clickCtx.fillText(
                    this.round(yVal[i], 4),
                    opt.grid.left - 5,
                    circle.y[i]
                  );
                }
              } else if (opt.x.type === "time") {
                let rectX = line.x.oldVal - w / 2;
                let rectY = line.y.newVal + 1;
                let alignX = "center";
                if (rectX + w > scopeR.r) {
                  rectX -= w / 2;
                  alignX = "right";
                }
                clickCtx.fillStyle = opt.toolTip.background.color;
                clickCtx.fillRect(rectX, rectY, w, 20);
                clickCtx.fillStyle = opt.toolTip.fontStyle.color;
                clickCtx.textBaseline = "middle";
                clickCtx.textAlign = "right";

                for (let i = 0; i < yVal.length; i++) {
                  clickCtx.fillText(
                    this.round(yVal[i], 4),
                    opt.grid.left - 5,
                    circle.y[i]
                  );
                }
                let valueSpeed
                if (opt.y.speed && typeof opt.y.speed[res.key] != undefined) {
                  valueSpeed = Number(opt.y.speed[res.key]).toFixed(2)
                }
                // 绘制转速
                if (valueSpeed && typeof valueSpeed !== 'undefined') {
                  if (valueSpeed >= 10 ** 8) {
                    valueSpeed = '无数据'
                  }
                  else {
                    valueSpeed = this.round(valueSpeed, 4) + 'rpm'
                  }
                  let speedCtx = this._drawTools.ctx.speed
                  speedCtx.clearRect(95, 20, 150, 30)
                  speedCtx.beginPath();
                  speedCtx.font = '14px Arial';
                  speedCtx.fillStyle = '#b96600';
                  speedCtx.textBaseline = "top";
                  speedCtx.fillText(valueSpeed, 100, 24);
                }

                clickCtx.textBaseline = "top";
                clickCtx.textAlign = alignX;
                clickCtx.fillText(
                  this.formatDateStr(res.val, 2),
                  line.x.oldVal,
                  line.y.newVal + 5
                );
              }
            }
          }
        },
        /* 趋势图多个图谱之间的连接，给下标志，画坐标线 */
        drawLineByX: function (xVal) {
          let obj = {
            val: 0, // 当前 x 轴坐标
            key: 0, // 当前位置下标
            idx: 0 // 鼠标位置距离最近点距离
          };
          const Xarray = this._option.x.data[0];
          for (let i = 0; i < Xarray.length; i++) {
            if (Xarray[i] === xVal) {
              obj.val = xVal;
              obj.key = i;
              this.drawLine(obj);
              break;
            }
          }
        },
        // 画波形图
        drawWave: function () {
          let params = this._computeParams.proportion;
          const dataCtx = this._drawTools.ctx.data;
          const opt = this._option;
          const xArr = opt.x.data || [];
          const xBArr = opt.x.dataSymbol || []; //有波形的点
          const yArr = opt.y.data || [];
          const series = opt.series;
          const color = series.lineStyle.color;
          let yk = params.y.k;
          let yb = params.y.b;
          dataCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          if (series.type === "bar") {
            const scope = this._scope;
            const vx = scope.v.x;
            dataCtx.beginPath();
            dataCtx.lineWidth = series.lineStyle.width;
            dataCtx.fillStyle =
              this.getDataType(color) === "Array" ? color[i] : color;
            for (let i = 0, l = yArr.length; i < l; i++) {
              const y = yArr[i] * yk + yb;
              const x = scope.v.x.length * i + opt.grid.left;
              dataCtx.fillRect(x, y, vx.start, scope.r.b - y);
            }
            return;
          }
          let xk = params.x.k;
          let xb = params.x.b;
          const scopeV = this._scope.v;
          let real = this._scope.r;
          let x, y;
          let left = scopeV.x.start;
          let right = scopeV.x.end;
          let top = scopeV.y.end;
          let bottom = scopeV.y.start;
          let dx = 1
          if (series.type === "line") {
            if (this.getDataType(xArr[0]) === "Array") {
              for (let i = xArr.length; i--;) {
                const val = xArr[i];
                dataCtx.beginPath();
                dataCtx.lineWidth = series.lineStyle.width;
                dataCtx.strokeStyle =
                  this.getDataType(color) === "Array" ? color[i] : color;
                for (let j = val.length; j--;) {
                  if (j === 0) break;
                  const value = val[j];
                  let xn = val[j - 1],
                    yo = yArr[i][j],
                    yn = yArr[i][j - 1];
                  if (
                    xn >= left &&
                    value <= right &&
                    xn <= right &&
                    value >= left &&
                    yn <= top &&
                    yn >= bottom &&
                    yo >= bottom &&
                    yo <= top
                  ) {
                    x = {
                      oVal: xk * value + xb,
                      nVal: xk * xn + xb
                    };
                    y = {
                      oVal: yo * yk + yb,
                      nVal: yn * yk + yb
                    };
                    dataCtx.moveTo(x.oVal, y.oVal);
                    dataCtx.lineTo(x.nVal, y.nVal);
                  }
                }
                dataCtx.stroke();
              }
              if (series.symbol.show) {
                for (let i = 0, l = xArr.length; i < l; i++) {
                  const value = xArr[i];
                  for (let j = 0, len = value.length; j < len; j++) {
                    y = yArr[i][j];
                    let val = value[j];
                    /* 后加的判断，如果有则进入，来画趋势图有波形的点 */
                    if (opt.x.dataSymbol !== undefined) {
                      let XB = opt.x.dataSymbol[i];
                      /* 如果有波形，才会画点 */
                      if (XB.includes(val)) {
                        if (
                          val >= left &&
                          val <= right &&
                          y <= top &&
                          y >= bottom
                        ) {
                          val = val * xk + xb;
                          y = y * yk + yb;
                          dataCtx.beginPath();
                          dataCtx.strokeStyle = series.lineStyle.color[i];
                          dataCtx.fillStyle =
                            series.symbol.color === ""
                              ? "#fff"
                              : series.symbol.color;
                          dataCtx.arc(val, y, 3, 0, 2 * Math.PI);
                          dataCtx.stroke();
                          dataCtx.fill();
                        }
                      }
                    } else {
                      if (
                        val >= left &&
                        val <= right &&
                        y <= top &&
                        y >= bottom
                      ) {
                        val = val * xk + xb;
                        y = y * yk + yb;
                        dataCtx.beginPath();
                        dataCtx.strokeStyle = series.lineStyle.color[i];
                        dataCtx.fillStyle =
                          series.symbol.color === ""
                            ? "#fff"
                            : series.symbol.color;
                        dataCtx.arc(val, y, 3, 0, 2 * Math.PI);
                        dataCtx.stroke();
                        dataCtx.fill();
                      }
                    }
                  }
                }
              }
            } else if (Number(xArr[0]) || Number(xArr[0]) === 0) {
              // 
              dataCtx.beginPath();
              dataCtx.lineWidth = series.lineStyle.width;
              dataCtx.strokeStyle = series.lineStyle.color;
              // 大于两万个点时且是波形图或者频谱图，再进行数据少画
              if (opt.type && opt.type.chartType && (opt.type.chartType == 'wave' || opt.type.chartType == 'spectrum') && xArr.length > 20000) {
                var tmp_r = (xk * xArr[1] + xb) - (xk * xArr[0] + xb) /* 第一个点与第二个点的像素差 */
                if (tmp_r < 1) {
                  if (tmp_r <= Number.MIN_VALUE)
                    return;
                  dx = Math.ceil(1 / tmp_r);//两个点的距离像素的倒数(向上取整)
                  // 当缩到足够小时，坐标转换会出现精度问题，导致dx过大
                  // 当dx大到一定程度，将使得下面的循环变量i不能递增，从而死机
                  // dx 超出波形点的长度是无意义的，因此作如下限制
                  if (dx > xArr.length)
                    dx = xArr.length;
                }
                const l = xArr.length;
                if (l > 1) {
                  for (let i = l; i > 0; i = i - dx) {
                    const val = xArr[i];
                    var max_y = -Number.MAX_VALUE;
                    var min_y = Number.MAX_VALUE;
                    if (dx > 1) {// 取y值得最大值和最小值
                      var b = i;
                      var e = b - dx;
                      if (b > xArr.length) {
                        b = xArr.lengt
                      }
                      if (e < 0) {
                        e = 0
                      }
                      for (let j = b; j > e; j--) {
                        let y = yArr[j]
                        if (y > max_y)
                          max_y = y;
                        if (y < min_y)
                          min_y = y;
                      }

                      if (
                        // xn >= left &&
                        // xn <= right &&
                        val >= left &&
                        val <= right &&
                        max_y <= top &&
                        max_y >= bottom &&
                        min_y >= bottom &&
                        min_y <= top
                      ) {
                        x = {
                          oVal: xk * val + xb,
                          nVal: xk * val + xb
                        };
                        y = {
                          oVal: yk * min_y + yb,
                          nVal: yk * max_y + yb
                        };
                        dataCtx.lineTo(x.oVal, y.oVal);
                        dataCtx.moveTo(x.oVal, y.oVal);
                        dataCtx.lineTo(x.nVal, y.nVal);
                      }
                    } else {
                      let xn = xArr[i - 1],
                        yo = yArr[i],
                        yn = yArr[i - 1];
                      if (
                        xn >= left &&
                        xn <= right &&
                        val >= left &&
                        val <= right &&
                        yn <= top &&
                        yn >= bottom &&
                        yo >= bottom &&
                        yo <= top
                      ) {
                        x = {
                          oVal: xk * val + xb,
                          nVal: xk * xn + xb
                        };
                        y = {
                          oVal: yo * yk + yb,
                          nVal: yn * yk + yb
                        };
                        dataCtx.moveTo(x.oVal, y.oVal);
                        dataCtx.lineTo(x.nVal, y.nVal);
                      }
                    }
                  }
                  /* for (let i = l; i--;) {
                    const val = xArr[i];
                    if (i === 0) break;
                    let xn = xArr[i - 1],
                      yo = yArr[i],
                      yn = yArr[i - 1];
                    if (
                      xn >= left &&
                      xn <= right &&
                      val >= left &&
                      val <= right &&
                      yn <= top &&
                      yn >= bottom &&
                      yo >= bottom &&
                      yo <= top
                    ) {
                      x = {
                        oVal: xk * val + xb,
                        nVal: xk * xn + xb
                      };
                      y = {
                        oVal: yo * yk + yb,
                        nVal: yn * yk + yb
                      };
                      dataCtx.moveTo(x.oVal, y.oVal);
                      dataCtx.lineTo(x.nVal, y.nVal);
                    }
                  } */
                  dataCtx.stroke();
                }
              } else {
                const l = xArr.length;
                if (l > 1) {
                  for (let i = l; i--;) {
                    const val = xArr[i];
                    if (i === 0) break;
                    let xn = xArr[i - 1],
                      yo = yArr[i],
                      yn = yArr[i - 1];
                    if (
                      xn >= left &&
                      xn <= right &&
                      val >= left &&
                      val <= right &&
                      yn <= top &&
                      yn >= bottom &&
                      yo >= bottom &&
                      yo <= top
                    ) {
                      x = {
                        oVal: xk * val + xb,
                        nVal: xk * xn + xb
                      };
                      y = {
                        oVal: yo * yk + yb,
                        nVal: yn * yk + yb
                      };
                      dataCtx.moveTo(x.oVal, y.oVal);
                      dataCtx.lineTo(x.nVal, y.nVal);
                    }
                  }
                  dataCtx.stroke();
                }
              }
              if (series.symbol.show) {
                for (let i = 0, l = xArr.length; i < l; i++) {
                  let val = xArr[i];
                  y = yArr[i];
                  if (val >= left && val <= right && y <= top && y >= bottom) {
                    val = val * xk + xb;
                    y = y * yk + yb;
                    dataCtx.beginPath();
                    dataCtx.strokeStyle = series.lineStyle.color;
                    dataCtx.fillStyle =
                      series.symbol.color === "" ? "#fff" : series.symbol.color;
                    dataCtx.arc(val, y, 3, 0, 2 * Math.PI);
                    dataCtx.stroke();
                    dataCtx.fill();
                  }
                }
              }
            }
          } else if (series.type === "bar-line") {
            dataCtx.beginPath();
            dataCtx.lineWidth = series.lineStyle.width;
            dataCtx.strokeStyle = series.lineStyle.color;
            for (let i = 0, l = xArr.length; i < l; i++) {
              let val = xArr[i];
              y = yArr[i];
              let cy = yb <= real.b ? yb : real.b;
              if (val >= left && val <= right && y <= top && y >= bottom) {
                val = val * xk + xb;
                y = y * yk + yb;
                dataCtx.moveTo(val, cy);
                dataCtx.lineTo(val, y + 1);
              }
            }
            dataCtx.stroke();
          } else if (series.type === "scatter") {
            //散点图
            for (let i = xArr.length; i--;) {
              const val = xArr[i];
              if (i === 0) break;
              let xn = xArr[i - 1],
                yo = yArr[i],
                yn = yArr[i - 1];
              if (val >= left && val <= right && yo >= bottom && yo <= top) {
                x = {
                  oVal: xk * val + xb
                };
                y = {
                  oVal: yo * yk + yb
                };
                dataCtx.beginPath();
                dataCtx.fillStyle = series.symbol.color;
                dataCtx.arc(
                  x.oVal,
                  y.oVal,
                  series.symbol.size,
                  0,
                  Math.PI * 2,
                  true
                );
                dataCtx.fill();
                dataCtx.closePath(); //注意此处
              }
            }
          }
        },
        // 查找距离鼠标位置最近点
        findNearbyPoint: function (dx, dy, index = -1) {
          let v1,
            v2,
            dValue = {
              val: 0, // 当前 x 轴坐标
              key: 0, // 当前位置下标
              dx: 0 // 鼠标位置距离最近点距离
            };
          let arrX = this._option.x.data;
          const arrY = this._option.y.data;
          const paramsX = this._computeParams.proportion.x;
          const paramsY = this._computeParams.proportion.y;
          const xk = paramsX.k;
          const xb = paramsX.b;
          const yk = paramsY.k;
          const yb = paramsY.b;
          let l = arrX.length;
          if (this.getDataType(arrX[0]) === "Array" && index === -1) {
            const key = this._flag.subFreqAxis;
            if (key !== -1) {
              const valX = arrX[key];
              const l = valX.length;
              debugger;
              for (var i = l; i--;) {
                if (i === l - 1) {
                  v1 = Math.abs(valX[i] * xk + xb - dx);
                  v2 = Math.abs(valX[i - 1] * xk + xb - dx);
                  dValue =
                    v1 > v2
                      ? {
                        index: key,
                        val: valX[i - 1],
                        key: i - 1,
                        dx: v2
                      }
                      : {
                        index: key,
                        val: valX[i],
                        key: i,
                        dx: v1
                      };
                } else {
                  v1 = Math.abs(valX[i] * xk + xb - dx);
                  if (dValue.dx > v1)
                    dValue = {
                      index: key,
                      val: valX[i],
                      key: i,
                      dx: v1
                    };
                }
              }
              /* 二分法取 */
              // let ax = (dx - xb) / xk
              // let key = this.binarySerach(valX, ax);
              // dValue = {
              //   val: arrX[key],
              //   key,
              //   index: key,
              // }
            } else {
              for (let i = l; i--;) {
                const valX = arrX[i];
                const valY = arrY[i];
                const len = valX.length;
                /* for (let j = len; j--;) {
                  const vx1 = (valX[j] * xk + xb - dx) ** 2;
                  const vy1 = (valY[j] * yk + yb - dy) ** 2;
                  if (i === l - 1 && j === len - 1) {
                    const vx2 = (valX[j - 1] * xk + xb - dx) ** 2;
                    const vy2 = (valY[j - 1] * yk + yb - dy) ** 2;
                    v1 = vx1 + vy1;
                    v2 = vx2 + vy2;
                    if (v1 > v2) {
                      dValue = {
                        val: valX[j - 1],
                        key: j - 1,
                        dx: v2,
                        index: i,
                        valY: valY[j - 1]
                      };
                    } else {
                      dValue = {
                        val: valX[j],
                        key: j,
                        dx: v1,
                        index: i,
                        valY: valY[j]
                      };
                    }
                  } else {
                    v1 = vx1 + vy1;
                    if (dValue.dx > v1) {
                      dValue = {
                        val: valX[j],
                        key: j,
                        dx: v1,
                        index: i,
                        valY: valY[j]
                      };
                    }
                  }
                }*/
                let ax = (dx - xb) / xk;
                let key = this.binarySerach(valX, ax);
                dValue = {
                  val: valX[key],
                  key,
                  index: i,
                  valY: valY[key]
                };
              }
            }
          } else {
            if (index !== -1) {
              arrX = arrX[index];
              l = arrX.length;
            }
            /* 二分法取值 */
            //ax为dx转坐标值
            let ax = (dx - xb) / xk;
            let key = this.binarySerach(arrX, ax);
            dValue = {
              val: arrX[key],
              key
            };
            // 散点图
            /* 根据x值取x的下标，根据下表确定一个范围，在范围内数据根据距离值点 */
            if (this._option.series.type == "scatter" && dy != undefined) {
              let keyMax, keyMin;
              if (arrX.length < 10) {
                keyMax = arrX.length - 1;
                keyMin = 0;
              } else if (arrX.length < 100) {
                if (key > 5) {
                  keyMax = key + 5;
                  keyMax > arrX.length - 1 ? (keyMax = arrX.length - 1) : "";
                  keyMin = key - 4 + (keyMax - arrX.length);
                } else {
                  keyMin = 0;
                  keyMax = 9;
                }
              } else {
                let dKeyPercent = 5;
                let dKeyLen = Math.floor((arrX.length * dKeyPercent) / 100);
                keyMin = key - dKeyLen < 0 ? 0 : key - dKeyLen;
                keyMax =
                  key + dKeyLen >= arrX.length ? arrX.length - 1 : key + dKeyLen;
              }
              let arrXSplice = arrX.slice(keyMin, keyMax + 1);
              let arrYSplice = arrY.slice(keyMin, keyMax + 1);
              for (let j = arrXSplice.length; j--;) {
                const vx1 = (arrXSplice[j] * xk + xb - dx) ** 2;
                const vy1 = (arrYSplice[j] * yk + yb - dy) ** 2;
                if (j === arrXSplice.length - 1) {
                  const vx2 = (arrXSplice[j - 1] * xk + xb - dx) ** 2;
                  const vy2 = (arrYSplice[j - 1] * yk + yb - dy) ** 2;
                  v1 = Math.sqrt(vx1 + vy1);
                  v2 = Math.sqrt(vx2 + vy2);
                  if (v1 > v2) {
                    dValue = {
                      val: arrXSplice[j - 1],
                      key: j - 1 + keyMin,
                      dx: v2
                    };
                  } else {
                    dValue = {
                      val: arrXSplice[j],
                      key: j + keyMin,
                      dx: v1
                    };
                  }
                } else {
                  v1 = Math.sqrt(vx1 + vy1);
                  if (dValue.dx > v1) {
                    dValue = {
                      val: arrXSplice[j],
                      key: j + keyMin,
                      dx: v1
                    };
                  }
                }
              }
              // for (var i = arrSplice.length; i--;) {
              //   if (i === arrSplice.length - 1) {
              //     v1 = Math.abs(arrSplice[i] * yk + yb - dy);
              //     v2 = Math.abs(arrSplice[i - 1] * yk + yb - dy);
              //     dValue =
              //       v1 > v2
              //         ? {
              //         val: arrX[i - 1 + keyMin],
              //         key: i - 1 + keyMin,
              //           dx: v2
              //         }
              //         : {
              //         val: arrX[i + keyMin],
              //         key: i + keyMin,
              //           dx: v1
              //         };
              //   } else {
              //     v1 = Math.abs(arrSplice[i] * yk + yb - dy);
              //     if (dValue.dx > v1)
              //       dValue = {
              //         val: arrX[i + keyMin],
              //         key: i + keyMin,
              //         dx: v1
              //       };
              //   }
              // }
            }

            // for (var i = l; i--;) {
            //   if (i === l - 1) {
            //     v1 = Math.abs(arrX[i] * xk + xb - dx);
            //     v2 = Math.abs(arrX[i - 1] * xk + xb - dx);
            //     dValue =
            //       v1 > v2
            //         ? {
            //           val: arrX[i - 1],
            //           key: i - 1,
            //           dx: v2
            //         }
            //         : {
            //           val: arrX[i],
            //           key: i,
            //           dx: v1
            //         };
            //   } else {
            //     v1 = Math.abs(arrX[i] * xk + xb - dx);
            //     if (dValue.dx > v1)
            //       dValue = {
            //         val: arrX[i],
            //         key: i,
            //         dx: v1
            //       };
            //   }
            // }
          }
          return dValue; // val：在 x 轴上的值；key：在 x 轴上的索引；dx：鼠标位置到点的距离；index: 多条线时对应谱线的索引
        },
        binarySerach: function (arrX, dx) {
          let l = 1,
            r = arrX.length - 2;
          if (arrX.length === 1) return 0;
          while (l <= r) {
            let mid = parseInt((l + r) / 2);
            /* 只有一个点的时候就返回这个点的值 */
            if (dx === arrX[mid]) return mid;
            else if (dx < arrX[mid]) r = mid - 1;
            else if (dx > arrX[mid]) l = mid + 1;
          }
          return Math.abs(dx - arrX[r]) < Math.abs(arrX[l] - dx) ? r : l;
          // let r = arrX.length, l=0
          //   while (r > 0) { { // divide and conquer, find half that contains answer
          //     var _Count2 = r / 2;
          //     let mid = l + _Count2;
          //     if (a[mid] < x)
          //       l = ++mid, r -= _Count2 + 1;
          //     else
          //       r = _Count2;
          //   }
          //   return (l);
          // }
        },
        // 界面调整重新画线
        zoomLine: function () {
          const flag = this._flag;
          this._drawTools.ctx.click.clearRect(
            0,
            0,
            this._dom.width,
            this._dom.height
          );
          switch (flag.toolCheck) {
            case 0:
              let params = this._computeParams.proportion,
                left = this._option.grid.left,
                xOVal = params.x.k * flag.line.val + params.x.b;
              if (xOVal > left) {
                this.drawLine(flag.line);
              }
              break;
            case 1:
              this.event.tool.oneFreq();
              break;
            case 2:
              (flag.tools.flag_nx || flag.tools.flag_subFreq) &&
                this.labelLineSpec();
              flag.tools.flag_subTime && this.labelLineWave();
              this.drawLabelLine();
              break;
            case 3:
              this.event.tool.peakSearch();
              break;
          }
          flag.tools.flag_wave_Pulse && this.drawWavePulse();
          // flag.addPeakPos.length > 0 && (type === 1 ? this.drawAddLabel(1) : this.drawAddLabel(2))
          flag.addPeakPos.length > 0 && this.drawAddLabel(2)
          this._option.series.markLine.data && this._option.series.markLine.data.length > 0 && this.drawMarkLine();
        },
        // 绘制开窗放大范围
        drawEnlargement: function (type) {
          let zoomCtx = this._drawTools.ctx.zoom,
            scope = this._scope,
            opt = this._option,
            moveX = this._movePos.x,
            moveY = this._movePos.y,
            paramsX = this._computeParams.proportion.x;
          zoomCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          if (type) {
            this._flag.click = 0;
            zoomCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
            if (moveX.newVal >= opt.grid.left && moveX.newVal <= scope.r.r) {
              let pos = {
                oldPos: this.findNearbyPoint(moveX.oldVal, moveY.oldVal),
                newPos: this.findNearbyPoint(moveX.newVal, moveY.newVal)
              };
              let yArr = [];
              let num = {
                min: Number.MAX_VALUE,
                max: Number.MAX_VALUE * -1
              };
              if (
                pos.oldPos.index === undefined &&
                pos.newPos.index === undefined
              ) {
                if (pos.oldPos.key === pos.newPos.key) {
                  if (moveX.move >= 0) {
                    pos.newPos.key++;
                    pos.newPos.val = opt.x.data[pos.newPos.key];
                  } else {
                    pos.newPos.key--;
                    pos.newPos.val = opt.x.data[pos.newPos.key];
                  }
                }
                moveX.move >= 0
                  ? (yArr = opt.y.data.slice(pos.oldPos.key, pos.newPos.key + 1))
                  : (yArr = opt.y.data.slice(pos.newPos.key, pos.oldPos.key + 1));
                for (let i = 0, l = yArr.length; i < l; i++) {
                  const val = yArr[i];
                  num.max < val && (num.max = val);
                  num.min > val && (num.min = val);
                }
              } else {
                if (pos.oldPos.key === pos.newPos.key) {
                  return;
                } else {
                  let start = 0;
                  let end = -1;
                  if (moveX.move >= 0) {
                    pos.newPos.key++;
                    pos.newPos.val = opt.x.data[pos.newPos.index][pos.newPos.key];
                    start = pos.oldPos.key;
                    end = pos.newPos.key;
                  } else {
                    pos.newPos.key--;
                    pos.newPos.val = opt.x.data[pos.newPos.index][pos.newPos.key];
                    start = pos.newPos.key;
                    end = pos.oldPos.key;
                  }
                  for (let i = 0, l = opt.y.data.length; i < l; i++) {
                    const data = opt.y.data[i].slice(start, end);
                    for (let j = 0, len = data.length; j < len; j++) {
                      const val = data[j];
                      num.max < val && (num.max = val);
                      num.min > val && (num.min = val);
                    }
                  }
                }
                // if (moveX.move >= 0) {
                /* for (let i = 0, l = opt.y.data.length; i < l; i++) {
                  const data = opt.y.data.slice(pos.oldPos.key, pos.newPos.key + 1);
                  for (let j = 0, len = data.length; j < len; j++) {
                    const val = data[j];
                    num.max < val && (num.max = val);
                    num.min > val && (num.min = val);
                  }
                } */
                // }
              }
              scope.v.y.end = num.max;
              scope.v.y.start = num.min;
              moveX.oldVal = pos.oldPos.val * paramsX.k + paramsX.b;
              moveX.newVal = pos.newPos.val * paramsX.k + paramsX.b;
              moveX.move = moveX.newVal - moveX.oldVal;
              moveX.move >= 0
                ? zoomCtx.fillRect(
                  moveX.oldVal,
                  opt.grid.top,
                  moveX.move,
                  scope.r.h
                )
                : zoomCtx.fillRect(
                  moveX.newVal,
                  opt.grid.top,
                  Math.abs(moveX.move),
                  scope.r.h
                );
            }
          }
        },
        // 开窗放大
        windowEnlargement: function () {
          let rx = {
            start: null,
            end: null
          };
          const moveX = this._movePos.x,
            paramsX = this._computeParams.proportion.x,
            scope = this._scope;
          if (moveX.move === 0) return;
          if (moveX.move > 0) {
            rx.start = (moveX.oldVal - paramsX.b) / paramsX.k;
            rx.end = (moveX.newVal - paramsX.b) / paramsX.k;
          } else {
            rx.start = (moveX.newVal - paramsX.b) / paramsX.k;
            rx.end = (moveX.oldVal - paramsX.b) / paramsX.k;
          }
          scope.v.x.start = rx.start;
          scope.v.x.end = rx.end + (rx.end - rx.start) / 10;
          this.mappingX(2);
          this.mappingY(2);
          this.drawAxis();
          this.drawWave();
          this.zoomLine();
        },
        /*当前点坐标
        type=0，普通光标 type=1，标注倍频*/
        fft_indexOfWaveX: function (valueX, valueY, type) {
          try {
            let optX = this._option.x,
              optY = this._option.y;
            let xArr = optX.data;
            let yArr = optY.data;
            if (this.getDataType(xArr[0]) === "Array") {
              xArr = xArr[this._flag.line.idx];
              // if (xArr.length >= this._flag.line.key) {
              yArr = yArr[this._flag.line.idx];
              /* } else {
                for (let i = 0, l = opt.x.data.length; i < l; i++) {
                  const value = opt.x.data[i];
                  if (value[this._flag.line.key]) {
                    xArr = value;
                    yArr = opt.y.data[i];
                    break;
                  }
                }
              } */
            }
            if (null == xArr || xArr.length == 0) {
              return -1;
            }
            var di = xArr.length / 800;
            if (type == 1) {
              di = Math.round(di / 4);
            }
            if (di < 3) {
              di = 3;
            }
            var tmpIndex = this.indexOfArray(xArr, valueX, 0);
            if (tmpIndex >= xArr.length) tmpIndex = xArr.length;
            else if (tmpIndex > 0) {
              if (
                Math.abs(xArr[tmpIndex] - valueX) >
                Math.abs(xArr[tmpIndex - 1] - valueX)
              ) {
                tmpIndex = tmpIndex - 1;
              }
            }
            var index_a = tmpIndex - di;
            var index_b = tmpIndex + di;
            var index = tmpIndex;
            if (index_a <= 0) {
              index_a = 0;
            }
            if (index_b >= yArr.length) {
              index_b = yArr.length - 1;
            }
            for (var i = index_a; i <= index_b; i++) {
              if (yArr[i] > yArr[index]) {
                index = i;
              }
            }
            return index;
          } catch (err) { }
          return -1;
        },
        // 找最近点索引
        indexOfArray: function (arr, value, flag) {
          if (arr) {
            //获取最匹配点的下标
            /* flag=0，最近点；flag=1，右边最近点；flag=-1，左边最近点 */
            var index = -1;
            var flag_pm = false;
            var dx = Number.POSITIVE_INFINITY; //无穷大
            for (var i = 0; i < arr.length; i++) {
              switch (flag) {
                case -1:
                  flag_pm =
                    arr[i] - value <= 0 ? dx > Math.abs(arr[i] - value) : false;
                  break;
                case 0:
                  flag_pm = dx > Math.abs(arr[i] - value);
                  break;
                case 1:
                  flag_pm =
                    arr[i] - value >= 0 ? dx > Math.abs(arr[i] - value) : false;
                  break;
              }
              if (flag_pm) {
                dx = Math.abs(arr[i] - value);
                index = i;
                if (dx == 0) {
                  break;
                }
              }
            }
            return index;
          }
        },
        // 计算波形图时间差
        labelLineWave: function () {
          //带标签的竖线
          /**带标签的竖线**/
          let _flag = this._flag;
          _flag.labelLine.wave.length > 0 && (_flag.labelLine.wave.length = 0);
          var t_nxArray = [];
          var index = -1;
          var i = 0;
          var nx0 = -1; //锁定光标位置
          var nx1 = -1; //画周期性延展线
          var index1 = -1;
          var dx = -1; //基准线和时间差线的距离
          /**画光标线**/
          if (_flag.tools.flag_subTime == 1 && _flag.last_xWave.key != -1) {
            nx0 = _flag.last_xWave.val;
            index = _flag.last_xWave.key;
            t_nxArray.push({
              name: nx0 + "," + index.toFixed(4),
              xAxis: index
            });
            _flag.tools.flag_wave_extend = 1;
          } else if (
            _flag.tools.flag_subTime == 1 &&
            _flag.last_xWave.key == -1
          ) {
            //开启时间差功能前没有点击页面，将基准线定在0的位置
            // 对比分析多条数据的情况_flag.firstCommon.idx != undefined
            if (this.getDataType(this._option.x.data[0]) == "Array") {
              if (_flag.firstCommon.idx == undefined) _flag.firstCommon.idx = 0;
              _flag.last_xWave = {
                key: 0,
                val: this._option.x.data[_flag.firstCommon.idx][0]
              };
              t_nxArray.push({
                name:
                  0 +
                  "," +
                  this._option.x.data[_flag.firstCommon.idx][0].toFixed(4),
                xAxis: 0
              });
            } else {
              _flag.last_xWave = {
                key: 0,
                val: this._option.x.data[0]
              };
              t_nxArray.push({
                name: 0 + "," + this._option.x.data[0].toFixed(4),
                xAxis: 0
              });
            }
            _flag.tools.flag_wave_extend = 1;
          }
          /**画时间差的延展线**/
          if (
            _flag.tools.flag_wave_extend &&
            _flag.tools.flag_subTime == 1 &&
            _flag.line.key !== _flag.last_xWave.key
          ) {
            if (_flag.line.val != -1) {
              index1 = _flag.line.key;
              dx = Math.abs(index1 - index);
              if (dx == 0) {
                return;
              }
              var x0 = index1 % dx;
              if (this.getDataType(this._option.x.data[0]) != "Array") {
                for (var x = x0; x < this._option.x.data.length; x += dx) {
                  if (x == index) {
                    continue;
                  }
                  t_nxArray.push({
                    name: "",
                    xAxis: x,
                    lineStyle: {
                      color: "red"
                    }
                  });
                }
              } else {
                /* 防止对比分析图删除数据后数据缺失报错 */
                if (this._option.x.data[_flag.firstCommon.idx]) {
                  for (
                    var x = x0;
                    x < this._option.x.data[_flag.firstCommon.idx].length;
                    x += dx
                  ) {
                    if (x == index) {
                      continue;
                    }
                    t_nxArray.push({
                      name: "",
                      xAxis: x,
                      lineStyle: {
                        color: "red"
                      }
                    });
                  }
                }
              }
            }
          }
          if (t_nxArray.length > 0) {
            _flag.labelLine.wave = t_nxArray;
          }
        },
        // 计算频谱图差频、倍频、一倍频等
        labelLineSpec: function () {
          //带标签的竖线
          /**带标签的竖线**/
          let _flag = this._flag,
            opt = this._option;
          _flag.labelLine.spectrum.length > 0 &&
            (_flag.labelLine.spectrum.length = 0);
          var t_nxArray = [];
          var index = -1;
          var i = 0;
          var index1 = -1; //第二次点击三条等距线的光标的下标
          var dx = -1; //基准线和对称频率差线的距离
          /**自动寻峰**/
          if (_flag.peakIndexArr.length > _flag.tools.autoPeakNum) {
            t_nxArray.push({
              name: _flag.tools.autoPeakNum + 1 + "p",
              xAxis: _flag.peakIndexArr[_flag.tools.autoPeakNum]
            });
          }
          if (_flag.tools.autoPeakNum == -1) {
            //初始化不自动寻峰；当点击循环寻峰次数超过10次就取消寻峰
            t_nxArray.length = 0;
          }
          /*获取倍频和差频的index*/
          if (_flag.tools.flag_subFreq == 1) {
            //启用了差频
            _flag.arr_C = [];
            if (_flag.arr_B[0] >= 0 && _flag.arr_B[0] != -1) {
            } else {
              _flag.arr_B[0] = 0;
            }
            var indexB0 = _flag.arr_B[0];
            if (_flag.tools.flag_nx == 1) {
              //同时开启了倍频的效果
              _flag.arr_B = [];
              if (_flag.line.idx != undefined) {
                // for (var i = 0; i < 10; i++) {
                //   var index_b = indexB0 * (i + 1);
                //   if (index_b >= opt.x.data[_flag.line.idx].length) {
                //     break;
                //   }
                //   _flag.arr_B.push(index_b);
                // }
                for (var i = 0; i < 10; i++) {
                  var index_b;
                  // 对比分析图多图谱情况
                  index_b = this.indexOfArray(
                    opt.x.data[_flag.line.idx],
                    opt.x.data[_flag.line.idx][indexB0] * (i + 1),
                    0
                  );
                  // 防止倍频超出边界时错误的取到数组最大值
                  if (
                    opt.x.data[_flag.line.idx][
                    opt.x.data[_flag.line.idx].length - 1
                    ] <
                    opt.x.data[_flag.line.idx][indexB0] * (i + 1)
                  ) {
                    break;
                  }
                  _flag.arr_B.push(index_b);
                }
              } else {
                for (var i = 0; i < 10; i++) {
                  var index_b;
                  // 对比分析图多图谱情况
                  index_b = this.indexOfArray(
                    opt.x.data,
                    opt.x.data[indexB0] * (i + 1),
                    0
                  );
                  // 防止倍频超出边界时错误的取到数组最大值
                  if (
                    opt.x.data[opt.x.data.length - 1] <
                    opt.x.data[indexB0] * (i + 1)
                  ) {
                    break;
                  }
                  _flag.arr_B.push(index_b);
                }
              }
            }
            index = _flag.arr_B[0];
            index1 = _flag.line.key;
            dx = Math.abs(index1 - index);

            if (dx != 0) {
              var x0 = index1 % dx; //左边界第一条线
              var x_left = index - 3 * dx;
              var x_right = index + 3 * dx;
              if (x_left < x0) {
                x_left = x0;
              }
              const xArr = opt.x.data;
              /* if (x_right > opt.x.data.length) {
                x_right = opt.x.data.length;
              } */
              //判断点击对称频率差后点击图谱在进行操作
              if (_flag.line.idx && _flag.line.idx != "") {
                if (this.getDataType(xArr[0]) === "Array") {
                  // 防止对比分析图删除图谱后拿不到当前图谱的值
                  if (xArr[_flag.line.idx]) {
                    x_right > xArr[_flag.line.idx].length &&
                      (x_right = xArr[_flag.line.idx].length);
                  }
                } else {
                  x_right > xArr.length && (x_right = xArr.length);
                }
              }
              // if(x_right>this.cutSpectrum.x.length){
              //     x_right = this.cutSpectrum.x.length;
              // }
              for (var x = x_left; x <= x_right; x += dx) {
                var item = {};
                if (x == index) {
                  item.line = true;
                  item.value = x;
                } else {
                  item.line = false;
                  item.value = x;
                }
                _flag.arr_C.push(item);
              }
            } else {
              _flag.line.idx !== undefined &&
                (_flag.subFreqAxis = _flag.line.idx);
              // 如果差频为0则只画做差频的标线
              _flag.arr_C.push({ line: true, value: index });
            }
          } else if (_flag.tools.flag_nx == 1) {
            //启用了倍频
            _flag.arr_B = [];
            for (var i = 0; i < 10; i++) {
              if (_flag.line.val == -1) {
                _flag.arr_B = [];
              } else {
                if (opt.series.dataMsg.specType == 2) {
                  //阶次
                  if (_flag.line.idx == undefined) {
                    if (
                      _flag.line.val * (i + 1) >=
                      opt.series.dataMsg.spectral / 2.56
                    ) {
                      break;
                    }
                  } else {
                    if (
                      _flag.line.val * (i + 1) >=
                      opt.x.data[_flag.line.idx][
                      opt.x.data[_flag.line.idx].length - 1
                      ]
                    ) {
                      break;
                    }
                  }
                } else {
                  // 若取值大于图谱x轴最大值
                  // 对比分析图多图谱情况
                  if (_flag.line.idx == undefined) {
                    if (
                      _flag.line.val * (i + 1) >=
                      opt.x.data[opt.x.data.length - 1]
                    ) {
                      break;
                    }
                  } else {
                    if (
                      _flag.line.val * (i + 1) >=
                      opt.x.data[_flag.line.idx][
                      opt.x.data[_flag.line.idx].length - 1
                      ]
                    ) {
                      break;
                    }
                  }
                }
                if (_flag.tools.flag_nx == 0 && i > 0) {
                  break;
                }
                var index_b_nx;
                // 对比分析图多图谱情况
                if (_flag.line.idx == undefined) {
                  index_b_nx = this.indexOfArray(
                    opt.x.data,
                    _flag.line.val * (i + 1),
                    0
                  );
                } else {
                  index_b_nx = this.indexOfArray(
                    opt.x.data[_flag.line.idx],
                    _flag.line.val * (i + 1),
                    0
                  );
                }
                _flag.arr_B.push(index_b_nx);
              }
            }
          } else {
            _flag.arr_B[0] = _flag.line.key;
          }
          /**标注倍频**/
          if (_flag.tools.flag_nx == 1) {
            var max_arr = new Array(_flag.arr_B.length);
            for (i = 0; i < _flag.arr_B.length; i++) {
              let index = _flag.arr_B[i] >= 0 ? _flag.arr_B[i] : 0;
              // 对比分析图多图谱情况
              let dataX, dataY, dataXName;
              if (_flag.line.idx == undefined) {
                dataX = opt.x.data;
                dataY = opt.y.data;
                dataXName = opt.x.name;
              } else {
                dataX = opt.x.data[_flag.line.idx];
                dataY = opt.y.data[_flag.line.idx];
                dataXName = opt.x.name[_flag.line.idx];
              }
              max_arr[i] = this.fft_indexOfWaveX(dataX[index], dataY[index], 1); //标注倍频时校准倍频
              if (_flag.tools.flag_addPeak) {
                //启用了校准倍频
                if (i == 0) {
                  t_nxArray.push({
                    xAxis: index,
                    name:
                      i +
                      1 +
                      "X" +
                      "," +
                      Number(dataX[index]).toFixed(4) +
                      dataXName +
                      "," +
                      dataY[index].toFixed(4),
                    lineStyle: {
                      color: opt.toolTip.lineStyle.color
                    }
                  });
                } else {
                  t_nxArray.push({
                    name:
                      i +
                      1 +
                      "X" +
                      "," +
                      Number(dataX[max_arr[i]]).toFixed(4) +
                      dataXName +
                      "," +
                      dataY[max_arr[i]].toFixed(4),
                    xAxis: max_arr[i],
                    lineStyle: {
                      color: opt.toolTip.lineStyle.color
                    }
                  });
                }
              } else {
                //取消了校准倍频
                t_nxArray.push({
                  name:
                    i +
                    1 +
                    "X" +
                    "," +
                    Number(dataX[index]).toFixed(4) +
                    dataXName +
                    "," +
                    dataY[index].toFixed(4),
                  xAxis: index,
                  lineStyle: {
                    color: opt.toolTip.lineStyle.color
                  }
                });
              }
            }
          }

          /*画对称频率差的三条等距线*/
          if (_flag.tools.flag_subFreq == 1) {
            let xArr = [];
            let yArr = [];
            // if (_flag.line.idx && _flag.line.idx != '') {
            xArr = opt.x.data;
            yArr = opt.y.data;
            if (this.getDataType(xArr[0]) === "Array") {
              xArr = _flag.line.idx ? opt.x.data[_flag.line.idx] : opt.x.data[0];
              // if (xArr.length >= _flag.line.key) {
              yArr = _flag.line.idx ? opt.y.data[_flag.line.idx] : opt.x.data[0];
              /* } else {
                for (let i = 0, l = opt.x.data.length; i < l; i++) {
                  const value = opt.x.data[i];
                  if (value[_flag.line.key]) {
                    xArr = value;
                    yArr = opt.y.data[i];
                    break;
                  }
                }
              } */
            }
            var max_sub_arr = new Array(_flag.arr_C.length);
            for (i = 0; i < _flag.arr_C.length; i++) {
              max_sub_arr[i] = this.fft_indexOfWaveX(
                xArr[_flag.arr_C[i].value],
                yArr[_flag.arr_C[i].value],
                1
              ); //对称频率差时校准倍频
              if (_flag.arr_C[i].line == true) {
                if (_flag.tools.flag_nx == 1) {
                  t_nxArray.push({
                    name: "",
                    xAxis: _flag.arr_C[i].value
                  });
                } else {
                  t_nxArray.push({
                    name:
                      xArr[_flag.arr_C[i].value].toFixed(4) +
                      "," +
                      yArr[_flag.arr_C[i].value].toFixed(4),
                    xAxis: _flag.arr_C[i].value
                  });
                }
              } else {
                t_nxArray.push({
                  name: "",
                  xAxis: _flag.arr_C[i].value,
                  lineStyle: {
                    color: "red"
                  }
                });
              }
            }
          }
          if (t_nxArray.length > 0) {
            _flag.labelLine.spectrum = t_nxArray;
          }
        },
        // 时间(点数)差、差频和倍频画线
        drawLabelLine: function () {
          let subCtx = this._drawTools.ctx.subFreq,
            clickCtx = this._drawTools.ctx.click,
            flag = this._flag,
            opt = this._option,
            optX = opt.x,
            optY = opt.y,
            scopeR = this._scope.r,
            params = this._computeParams.proportion,
            xk = params.x.k,
            xb = params.x.b,
            yk = params.y.k,
            yb = params.y.b;
          const flagLine = flag.line;
          subCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          clickCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          // 时间差
          if (
            flag.tools.flag_subTime &&
            opt.tools.timeDifferent.show &&
            flag.line.key > -1
          ) {
            if (flag.last_xWave.key !== flag.line.key) {
              let font = null;
              // 增加考虑对比分析图 /* optX.data[flag.firstCommon.idx] != undefined 防止对比分析图删除数据后出现数据缺失 */
              if (
                optX.name === "s" ||
                (flag.line.idx != undefined &&
                  flag.firstCommon.idx != undefined &&
                  optX.name[flag.line.idx] == "s" &&
                  optX.data[flag.firstCommon.idx] != undefined)
              ) {
                if (flag.line.idx == undefined) {
                  font = {
                    x: optX.data[flag.line.key] * xk + xb,
                    time:
                      "时间：" + this.round(optX.data[flag.line.key]) + optX.name,
                    timeDif:
                      "时间差：" +
                      Math.round(
                        Math.abs(flag.line.val - optX.data[flag.last_xWave.key]) *
                        10000
                      ) /
                      10000 +
                      optX.name,
                    subFreq:
                      "频率差：" +
                      Math.round(
                        (1 / Math.abs(flag.last_xWave.val - flag.line.val)) *
                        10000
                      ) /
                      10000 +
                      "Hz",
                    amplitude:
                      "幅值：" +
                      Math.round(optY.data[flag.line.key] * 10000) / 10000 +
                      optY.name
                  };
                  if (flag.last_xWave.key === -1)
                    font.timeDif =
                      "时间差：" +
                      Math.round(Math.abs(flag.line.val - optX.data[0]) * 10000) /
                      10000 +
                      optX.name;
                } else {
                  if (flag.last_xWave.idx == undefined) flag.last_xWave.idx = 0;
                  font = {
                    x: optX.data[flag.firstCommon.idx][flag.line.key] * xk + xb,
                    time:
                      "时间：" +
                      this.round(optX.data[flag.firstCommon.idx][flag.line.key]) +
                      optX.name[flag.firstCommon.idx],
                    timeDif:
                      "时间差：" +
                      Math.round(
                        Math.abs(
                          flag.line.val -
                          optX.data[flag.firstCommon.idx][flag.last_xWave.key]
                        ) * 10000
                      ) /
                      10000 +
                      optX.name,
                    subFreq:
                      "频率差：" +
                      Math.round(
                        (1 / Math.abs(flag.last_xWave.val - flag.line.val)) *
                        10000
                      ) /
                      10000 +
                      "Hz",
                    amplitude: []
                  };
                  for (let i = 0; i < optX.data.length; i++) {
                    const valueX = optX.data[i];
                    const valueY = optY.data[i];
                    for (let j = 0; j < valueY.length; j++) {
                      const valX = valueX[j];
                      const valY = valueY[j];
                      if (j == flag.line.key && valX == flag.line.val) {
                        font.amplitude.push([
                          `幅值${font.amplitude.length}：${this.round(
                            (valY * 10000) / 10000
                          ) + optY.name}`
                        ]);
                      }
                    }
                  }
                  if (flag.last_xWave.key === -1)
                    font.timeDif =
                      "时间差：" +
                      Math.round(
                        Math.abs(
                          flag.line.val - optX.data[flag.firstCommon.idx][0]
                        ) * 10000
                      ) /
                      10000 +
                      optX.name;
                }
                font.x - opt.grid.left >= scopeR.w / 2 && (font.x -= 150);
                if (font.x >= opt.grid.left && font.x + 150 <= scopeR.r) {
                  if (this.getDataType(font.amplitude) != "Array") {
                    subCtx.beginPath();
                    subCtx.fillStyle = opt.toolTip.background.color;
                    subCtx.fillRect(font.x, opt.grid.top, 150, 70);
                    subCtx.font =
                      optY.fontStyle.size + " " + optY.fontStyle.family;
                    // subCtx.fillStyle = opt.series.lineStyle.color;
                    subCtx.fillStyle = opt.backgroundColor;
                    subCtx.textBaseline = "top";
                    subCtx.fillText(font.time, font.x + 10, opt.grid.top + 8);
                    subCtx.fillText(font.timeDif, font.x + 10, opt.grid.top + 23);
                    subCtx.fillText(font.subFreq, font.x + 10, opt.grid.top + 38);
                    subCtx.fillText(
                      font.amplitude,
                      font.x + 10,
                      opt.grid.top + 53
                    );
                  } else {
                    subCtx.beginPath();
                    subCtx.fillStyle = opt.toolTip.background.color;
                    subCtx.fillRect(
                      font.x,
                      opt.grid.top,
                      150,
                      60 + 20 * font.amplitude.length
                    );
                    subCtx.font =
                      optY.fontStyle.size + " " + optY.fontStyle.family;
                    // subCtx.fillStyle = opt.series.lineStyle.color;
                    subCtx.fillStyle = opt.backgroundColor;
                    subCtx.textBaseline = "top";
                    subCtx.fillText(font.time, font.x + 10, opt.grid.top + 8);
                    subCtx.fillText(font.timeDif, font.x + 10, opt.grid.top + 23);
                    subCtx.fillText(font.subFreq, font.x + 10, opt.grid.top + 38);
                    for (let i = 0; i < font.amplitude.length; i++) {
                      subCtx.fillText(
                        font.amplitude[i],
                        font.x + 10,
                        opt.grid.top + 38 + 20 * (i + 1)
                      );
                    }
                  }
                }
              } else if (
                optX.name === "smpl" ||
                (flag.line.idx != undefined &&
                  flag.firstCommon.idx != undefined &&
                  optX.name[flag.line.idx] == "smpl" &&
                  optX.data[flag.firstCommon.idx] != undefined)
              ) {
                if (flag.line.idx == undefined) {
                  font = {
                    x: flag.line.val * xk + xb,
                    time: "点序：" + this.round(flag.line.val),
                    timeDif:
                      "点数差：" +
                      this.round(flag.line.val - optX.data[flag.last_xWave.key]),
                    amplitude: "波形值：" + this.round(optY.data[flag.line.key])
                  };
                  if (flag.last_xWave.key === -1)
                    font.timeDif =
                      "点数差：" + this.round(flag.line.val - optX.data[0]);
                } else {
                  if (flag.last_xWave.idx == undefined) flag.last_xWave.idx = 0;
                  font = {
                    x: flag.line.val * xk + xb,
                    time: "点序：" + this.round(flag.line.val),
                    timeDif:
                      "点数差：" +
                      this.round(
                        flag.line.val -
                        optX.data[flag.firstCommon.idx][flag.last_xWave.key]
                      ),
                    amplitude: [] //"波形值：" + this.round(optY.data[flag.firstCommon.idx][flag.line.key])
                  };
                  for (let i = 0; i < optX.data.length; i++) {
                    const valueX = optX.data[i];
                    const valueY = optY.data[i];
                    for (let j = 0; j < valueY.length; j++) {
                      const valX = valueX[j];
                      const valY = valueY[j];
                      if (j == flag.line.key && valX == flag.line.val) {
                        font.amplitude.push([
                          `波形值${font.amplitude.length}：${this.round(valY)}`
                        ]);
                      }
                    }
                  }
                  if (flag.last_xWave.key === -1)
                    font.timeDif =
                      "点数差：" +
                      this.round(
                        flag.line.val - optX.data[flag.firstCommon.idx][0]
                      );
                }
                if (flag.last_xWave.key === -1)
                  font.timeDif =
                    "点数差：" +
                    this.round(
                      flag.line.val - optX.data[flag.firstCommon.idx][0]
                    );
                font.x - opt.grid.left >= scopeR.w / 2 && (font.x -= 106);
                if (font.x >= opt.grid.left && font.x + 110 <= scopeR.r) {
                  if (this.getDataType(font.amplitude) != "Array") {
                    subCtx.beginPath();
                    subCtx.fillStyle = opt.toolTip.background.color;
                    subCtx.fillRect(font.x, opt.grid.top, 106, 60);
                    subCtx.font =
                      optY.fontStyle.size + " " + optY.fontStyle.family;
                    subCtx.fillStyle = opt.series.lineStyle.color;
                    subCtx.textBaseline = "top";
                    subCtx.fillText(font.time, font.x + 10, opt.grid.top + 8);
                    subCtx.fillText(font.timeDif, font.x + 10, opt.grid.top + 23);
                    subCtx.fillText(
                      font.amplitude,
                      font.x + 10,
                      opt.grid.top + 38
                    );
                  } else {
                    subCtx.beginPath();
                    subCtx.fillStyle = opt.toolTip.background.color;
                    subCtx.fillRect(
                      font.x,
                      opt.grid.top,
                      106,
                      50 + 20 * font.amplitude.length
                    );
                    subCtx.font =
                      optY.fontStyle.size + " " + optY.fontStyle.family;
                    subCtx.fillStyle = opt.series.lineStyle.color;
                    subCtx.textBaseline = "top";
                    subCtx.fillText(font.time, font.x + 10, opt.grid.top + 8);
                    subCtx.fillText(font.timeDif, font.x + 10, opt.grid.top + 23);
                    for (let i = 0; i < font.amplitude.length; i++) {
                      subCtx.fillText(
                        font.amplitude[i],
                        font.x + 10,
                        opt.grid.top + 38 + 20 * (i + 1)
                      );
                    }
                  }
                }
              }
            }
            if (opt.toolTip.symbol.show) {
              let size = opt.toolTip.symbol.size;
              for (let i = 1, l = flag.labelLine.wave.length; i < l; i++) {
                // 对比分析图多条数据情况
                let line = {
                  x: optX.data[flag.labelLine.wave[i].xAxis] * xk + xb,
                  y: optY.data[flag.labelLine.wave[i].xAxis] * yk + yb
                };
                let line1 = {
                  x: optX.data[flag.labelLine.wave[i].xAxis] * xk + xb,
                  y: optY.data[flag.labelLine.wave[i].xAxis] * yk + yb
                };
                if (
                  flag.line.idx != undefined &&
                  flag.firstCommon.idx != undefined
                ) {
                  let x1 = [],
                    y1 = [];
                  // 用百分比取下标
                  let maxX = 0;
                  let maxIndex = 0;
                  let maxLength = -1;
                  // 获取x值最大的值与最大值的长度和下标
                  for (let k = 0; k < optX.data.length; k++) {
                    if (optX.data[k][optX.data[k].length - 1] > maxX) {
                      maxX = optX.data[k][optX.data[k].length - 1];
                      maxLength = optX.data[k].length;
                      maxIndex = k;
                    }
                  }
                  for (let k = 0; k < optX.data.length; k++) {
                    const valueX = optX.data[k];
                    const valueY = optY.data[k];
                    let index = Math.round(
                      (valueX.length *
                        optX.data[flag.firstCommon.idx][
                        optX.data[flag.firstCommon.idx].length - 1
                        ] *
                        flag.labelLine.wave[i].xAxis) /
                      (optX.data[flag.firstCommon.idx].length *
                        valueX[valueX.length - 1])
                    );
                    // if (maxIndex == flag.firstCommon.idx ){
                    //   //通过百分比计算下标：选中的点/选中下表长度 = index/当前下标长度
                    //   index = flag.labelLine.wave[i].xAxis * optX.data[k].length / maxX;
                    // } else {
                    //   index = flag.labelLine.wave[i].xAxis * optX.data[k].length / optX.data[flag.firstCommon.idx].length
                    // }
                    x1.push(optX.data[k][index] * xk + xb);
                    y1.push(optY.data[k][index] * yk + yb);
                    // for (let j = 0; j < valueY.length; j++) {
                    //   const valX = valueX[j];
                    //   const valY = valueY[j];
                    //   if (valX == optX.data[flag.firstCommon.idx][flag.labelLine.wave[i].xAxis]) {
                    //     x1.push(optX.data[k][j] * xk + xb,)
                    //     y1.push(optY.data[k][j] * yk + yb)
                    //   }
                    // }
                  }
                  line1 = {
                    x: x1,
                    y: y1
                  };
                  line = {
                    x:
                      optX.data[flag.firstCommon.idx][
                      flag.labelLine.wave[i].xAxis
                      ] *
                      xk +
                      xb,
                    y:
                      optY.data[flag.firstCommon.idx][
                      flag.labelLine.wave[i].xAxis
                      ] *
                      yk +
                      yb
                  };
                }
                if (
                  line.x >= opt.grid.left &&
                  line.x <= scopeR.r &&
                  line.y >= opt.grid.top &&
                  line.y <= scopeR.b
                ) {
                  subCtx.beginPath();
                  subCtx.strokeStyle = flag.labelLine.wave[i].lineStyle.color;
                  subCtx.fillStyle = flag.labelLine.wave[i].lineStyle.color;
                  subCtx.moveTo(line.x, opt.grid.top);
                  subCtx.lineTo(line.x, line.y - size);
                  subCtx.stroke();
                  if (this.getDataType(line1.x) == "Array") {
                    for (let j = 0; j < line1.x.length; j++) {
                      subCtx.beginPath();
                      subCtx.arc(line1.x[j], line1.y[j], size, 0, 2 * Math.PI);
                      subCtx.fillStyle =
                        opt.toolTip.symbol.color !== ""
                          ? opt.toolTip.symbol.color
                          : flag.labelLine.wave[j].lineStyle.color;
                      subCtx.fill();
                    }
                  } else {
                    subCtx.beginPath();
                    subCtx.arc(line.x, line.y, size, 0, 2 * Math.PI);
                    subCtx.fillStyle =
                      opt.toolTip.symbol.color !== ""
                        ? opt.toolTip.symbol.color
                        : flag.labelLine.wave[i].lineStyle.color;
                    subCtx.fill();
                  }
                  subCtx.moveTo(line.x, line.y + size);
                  subCtx.lineTo(line.x, scopeR.b);
                  subCtx.stroke();
                }
              }
            } else {
              subCtx.beginPath();
              for (let i = 1, l = flag.labelLine.wave.length; i < l; i++) {
                if (i === 0) break;
                // 对比分析图多条数据情况
                let x = optX.data;
                let y = optY.data;
                if (
                  flag.line.idx != undefined &&
                  flag.firstCommon.idx != undefined
                ) {
                  x = optX.data[flag.firstCommon.idx];
                  y = optY.data[flag.firstCommon.idx];
                }
                let line = {
                  x: x[flag.labelLine.wave[i].xAxis] * xk + xb,
                  y: y[flag.labelLine.wave[i].xAxis] * yk + yb
                };
                if (
                  line.x >= opt.grid.left &&
                  line.x <= scopeR.r &&
                  line.y >= opt.grid.top &&
                  line.y <= scopeR.b
                ) {
                  subCtx.strokeStyle = flag.labelLine.wave[i].lineStyle.color;
                  subCtx.fillStyle = flag.labelLine.wave[i].lineStyle.color;
                  subCtx.moveTo(line.x, opt.grid.top);
                  subCtx.lineTo(line.x, scopeR.b);
                }
              }
              subCtx.stroke();
            }
            this.drawLine(flag.last_xWave);
          }
          // 差频
          if (
            flag.tools.flag_subFreq &&
            opt.tools.subFreq.show &&
            flagLine.key > -1
          ) {
            let unit = optX.name;
            let xArr = optX.data;
            let yArr = optY.data;
            const isArrData = this.getDataType(xArr[0]) === "Array";
            if (isArrData) {
              xArr = xArr[flagLine.idx];
              yArr = yArr[flagLine.idx];
            }
            let font = {
              x: xArr[flagLine.key] * xk + xb,
              amplitude: `幅值：${this.round(yArr[flagLine.key])}`,
              subFreq: `差频：${this.round(
                flagLine.val - xArr[flag.arr_B[0]]
              )}${unit}`
            };
            let height = 70;
            let index = 0;
            // 防止倍频出现无限大
            if (opt.series.dataMsg.rotateSpeed === 0) {
              opt.series.dataMsg.rotateSpeed = 1;
            }
            if (this.getDataType(unit) === "Array") {
              font = {
                x: xArr[flagLine.key] * xk + xb,
                freq: `频率：${this.round(flagLine.val)}${unit[flagLine.idx]}`,
                subFreq: `差频：${this.round(
                  flagLine.val - xArr[flag.arr_B[0]]
                )}${unit[flagLine.idx]}`
              };
              for (let i = 0, l = optY.data.length; i < l; i++) {
                const value = optY.data[i];
                if (value[flagLine.key]) {
                  font[`amplitude${i + 1}`] = `幅值：${this.round(
                    value[flagLine.key]
                  )}`;
                  index++;
                }
              }
              height = (index + 3) * 15;
            } else if (unit === "NX") {
              font.freq = `频率：${this.round(
                (flagLine.val * opt.series.dataMsg.rotateSpeed) / 60
              )}Hz`;
              font.nxFreq = `倍频：${this.round(flagLine.val)}${unit}`;
            } else {
              font.freq = `频率：${this.round(flagLine.val)}${unit}`;
              font.nxFreq = `倍频：${this.round(
                (flagLine.val * 60) / opt.series.dataMsg.rotateSpeed
              )}NX`;
            }
            font.x - opt.grid.left >= scopeR.w / 2 && (font.x -= 125);
            if (font.x >= opt.grid.left && font.x + 125 <= scopeR.r) {
              subCtx.beginPath();
              subCtx.lineWidth = 1;
              subCtx.fillStyle = opt.toolTip.background.color;
              subCtx.fillRect(font.x, opt.grid.top, 130, height);
              subCtx.font = optY.fontStyle.size + " " + optY.fontStyle.family;
              subCtx.fillStyle = opt.series.markLine.fontStyle.color;
              subCtx.textBaseline = "top";
              subCtx.fillText(font.freq, font.x + 10, opt.grid.top + 8);
              if (isArrData) {
                subCtx.fillText(font.subFreq, font.x + 10, opt.grid.top + 23);
                index = 0;
                for (const key in font) {
                  if (key.indexOf("amplitude") > -1) {
                    subCtx.fillText(
                      font[key],
                      font.x + 10,
                      opt.grid.top + 38 + 15 * index
                    );
                    index++;
                  }
                }
              } else {
                subCtx.fillText(font.nxFreq, font.x + 10, opt.grid.top + 23);
                subCtx.fillText(font.subFreq, font.x + 10, opt.grid.top + 38);
                subCtx.fillText(font.amplitude, font.x + 10, opt.grid.top + 53);
              }
            }
            if (opt.toolTip.symbol.show) {
              let size = opt.toolTip.symbol.size;
              for (let i = 0, l = flag.labelLine.spectrum.length; i < l; i++) {
                if (
                  flag.labelLine.spectrum[i].name === "" &&
                  flag.labelLine.spectrum[i].lineStyle
                ) {
                  subCtx.strokeStyle = flag.labelLine.spectrum[i].lineStyle.color;
                  subCtx.fillStyle =
                    opt.toolTip.symbol.color !== ""
                      ? opt.toolTip.symbol.color
                      : flag.labelLine.spectrum[i].lineStyle.color;
                  index = flag.labelLine.spectrum[i].xAxis;
                  let x = xArr[index] * xk + xb;
                  let y = yArr[index] * yk + yb;
                  if (!x) {
                    for (let j = 0, len = optX.data.length; j < len; j++) {
                      const value = optX.data[j][index];
                      if (value) {
                        x = value * xk + xb;
                        y = value * yk + yb;
                        break;
                      }
                    }
                  }
                  if (
                    x &&
                    y &&
                    x >= opt.grid.left &&
                    x <= scopeR.r &&
                    y >= opt.grid.top &&
                    y <= scopeR.b
                  ) {
                    subCtx.beginPath();
                    subCtx.moveTo(x, opt.grid.top);
                    subCtx.lineTo(x, y - size);
                    subCtx.stroke();
                    subCtx.beginPath();
                    subCtx.arc(x, y, size, 0, 2 * Math.PI);
                    subCtx.fill();
                    subCtx.moveTo(x, y + size);
                    subCtx.lineTo(x, scopeR.b);
                    subCtx.stroke();
                  }
                }
                if (
                  !flag.labelLine.spectrum[i].lineStyle &&
                  flag.labelLine.spectrum[i].name.indexOf("p") === -1 &&
                  flag.labelLine.spectrum[i].name.indexOf("x") === -1
                ) {
                  index = flag.labelLine.spectrum[i].xAxis;
                  let x = xArr[index] * xk + xb;
                  let y = yArr[index] * yk + yb;
                  if (!x) {
                    for (let j = 0, len = optX.data.length; j < len; j++) {
                      const value = optX.data[j][index];
                      if (value) {
                        x = value * xk + xb;
                        y = value * yk + yb;
                        break;
                      }
                    }
                  }
                  if (
                    x &&
                    y &&
                    x >= opt.grid.left &&
                    x <= scopeR.r &&
                    y >= opt.grid.top &&
                    y <= scopeR.b
                  ) {
                    subCtx.beginPath();
                    subCtx.strokeStyle = opt.toolTip.lineStyle.color;
                    subCtx.moveTo(x, opt.grid.top);
                    subCtx.lineTo(x, y - size);
                    subCtx.stroke();
                    subCtx.beginPath();
                    subCtx.fillStyle =
                      opt.toolTip.symbol.color !== ""
                        ? opt.toolTip.symbol.color
                        : opt.toolTip.lineStyle.color;
                    subCtx.arc(x, y, size, 0, 2 * Math.PI);
                    subCtx.fill();
                    subCtx.moveTo(x, y + size);
                    subCtx.lineTo(x, scopeR.b);
                    subCtx.stroke();
                  }
                }
              }
            } else {
              for (let i = 0, l = flag.labelLine.spectrum.length; i < l; i++) {
                if (
                  flag.labelLine.spectrum[i].name === "" &&
                  flag.labelLine.spectrum[i].lineStyle
                ) {
                  subCtx.strokeStyle = flag.labelLine.spectrum[i].lineStyle.color;
                  subCtx.fillStyle = flag.labelLine.spectrum[i].lineStyle.color;
                  let x = xArr[flag.labelLine.spectrum[i].xAxis] * xk + xb;
                  let y = yArr[flag.labelLine.spectrum[i].xAxis] * yk + yb;
                  if (
                    x >= opt.grid.left &&
                    x <= scopeR.r &&
                    y >= opt.grid.top &&
                    y <= scopeR.b
                  ) {
                    subCtx.beginPath();
                    subCtx.moveTo(x, opt.grid.top);
                    subCtx.lineTo(x, scopeR.b);
                    subCtx.stroke();
                  }
                }
                if (
                  !flag.labelLine.spectrum[i].lineStyle &&
                  flag.labelLine.spectrum[i].name.indexOf("p") === -1 &&
                  flag.labelLine.spectrum[i].name.indexOf("x") === -1
                ) {
                  let oneLine = {
                    x: xArr[flag.labelLine.spectrum[i].xAxis] * xk + xb,
                    y: yArr[flag.labelLine.spectrum[i].xAxis] * yk + yb
                  };
                  if (
                    oneLine.x >= opt.grid.left &&
                    oneLine.x <= scopeR.r &&
                    oneLine.y >= opt.grid.top &&
                    oneLine.y <= scopeR.b
                  ) {
                    subCtx.beginPath();
                    subCtx.strokeStyle = opt.toolTip.lineStyle.color;
                    subCtx.moveTo(oneLine.x, opt.grid.top);
                    subCtx.lineTo(oneLine.x, scopeR.b);
                    subCtx.stroke();
                  }
                }
              }
            }
          }
          // 倍频
          if (flag.tools.flag_nx && opt.tools.labelFreq.show) {
            if (opt.toolTip.symbol.show) {
              let size = opt.toolTip.symbol.size;
              for (let i = 0, l = flag.labelLine.spectrum.length; i < l; i++) {
                if (
                  flag.labelLine.spectrum[i].name !== "" &&
                  flag.labelLine.spectrum[i].lineStyle
                ) {
                  // 适应对比分析图多图谱
                  let x, y;
                  if (flag.line.idx == undefined) {
                    x = optX.data[flag.labelLine.spectrum[i].xAxis] * xk + xb;
                    y = optY.data[flag.labelLine.spectrum[i].xAxis] * yk + yb;
                  } else {
                    x =
                      optX.data[flag.line.idx][flag.labelLine.spectrum[i].xAxis] *
                      xk +
                      xb;
                    y =
                      optY.data[flag.line.idx][flag.labelLine.spectrum[i].xAxis] *
                      yk +
                      yb;
                  }

                  if (
                    x > opt.grid.left &&
                    x <= scopeR.r &&
                    y >= opt.grid.top &&
                    y <= scopeR.b
                  ) {
                    let font = flag.labelLine.spectrum[i].name;
                    let color = flag.labelLine.spectrum[i].lineStyle.color;
                    clickCtx.beginPath();
                    clickCtx.lineWidth = 1;
                    clickCtx.strokeStyle = color;
                    clickCtx.fillStyle = color;
                    clickCtx.font =
                      optY.fontStyle.size + " " + optY.fontStyle.family;
                    clickCtx.save();
                    clickCtx.moveTo(x, opt.grid.top);
                    clickCtx.lineTo(x, y - size);
                    clickCtx.translate(x - scopeR.h, 110 + opt.grid.top);
                    clickCtx.rotate((-90 * Math.PI) / 180);
                    clickCtx.textAlign = "right";
                    clickCtx.textBaseline = "bottom";
                    clickCtx.fillText(font, 40 + opt.grid.top, scopeR.h);
                    clickCtx.restore();
                    clickCtx.stroke();
                    clickCtx.beginPath();
                    clickCtx.arc(x, y, size, 0, 2 * Math.PI);
                    clickCtx.fillStyle =
                      opt.toolTip.symbol.color !== ""
                        ? opt.toolTip.symbol.color
                        : color;
                    clickCtx.fill();
                    clickCtx.moveTo(x, y + size);
                    clickCtx.lineTo(x, scopeR.b);
                    clickCtx.stroke();
                  }
                }
              }
            } else {
              for (let i = 0, l = flag.labelLine.spectrum.length; i < l; i++) {
                if (
                  flag.labelLine.spectrum[i].name !== "" &&
                  flag.labelLine.spectrum[i].lineStyle
                ) {
                  // 适应对比分析图多图谱
                  let x, y;
                  if (flag.line.idx == undefined) {
                    x = optX.data[flag.labelLine.spectrum[i].xAxis] * xk + xb;
                    y = optY.data[flag.labelLine.spectrum[i].xAxis] * yk + yb;
                  } else {
                    x =
                      optX.data[flag.line.idx][flag.labelLine.spectrum[i].xAxis] *
                      xk +
                      xb;
                    y =
                      optY.data[flag.line.idx][flag.labelLine.spectrum[i].xAxis] *
                      yk +
                      yb;
                  }
                  if (
                    x > opt.grid.left &&
                    x <= scopeR.r &&
                    y >= opt.grid.top &&
                    y <= scopeR.b
                  ) {
                    let font = flag.labelLine.spectrum[i].name;
                    let color = flag.labelLine.spectrum[i].lineStyle.color;
                    clickCtx.beginPath();
                    clickCtx.lineWidth = 1;
                    clickCtx.strokeStyle = color;
                    clickCtx.fillStyle = color;
                    clickCtx.fillStyle = color;
                    clickCtx.font =
                      optY.fontStyle.size + " " + optY.fontStyle.family;
                    clickCtx.save();
                    clickCtx.moveTo(x, opt.grid.top);
                    clickCtx.lineTo(x, scopeR.b);
                    clickCtx.translate(x - scopeR.h, 110 + opt.grid.top);
                    clickCtx.rotate((-90 * Math.PI) / 180);
                    clickCtx.textAlign = "right";
                    clickCtx.textBaseline = "bottom";
                    clickCtx.fillText(font, 40 + opt.grid.top, scopeR.h);
                    clickCtx.restore();
                    clickCtx.stroke();
                  }
                }
              }
            }
          }

          flag.toolCheck = 2;
        },
        drawWavePulse: function () {
          let pulse = this._drawTools.ctx.pulse,
            flag = this._flag,
            opt = this._option,
            optX = opt.x,
            optY = opt.y,
            scopeR = this._scope.r,
            params = this._computeParams.proportion,
            xk = params.x.k,
            xb = params.x.b,
            yk = params.y.k,
            yb = params.y.b;
          const flagLine = flag.line;
          pulse.clearRect(0, 0, this._dom.width, this._dom.height);
          flag.tools.flag_wave_Pulse = Number(
            opt.tools.speedPulse.data.speedPulse
          );
          // 转速脉冲
          if (flag.tools.flag_wave_Pulse && opt.tools.speedPulse.show) {
            let size = opt.toolTip.symbol.size;
            if (opt.toolTip.symbol.show) {
              let size = opt.toolTip.symbol.size;
              const xArray = this._option.tools.speedPulse.data.XArray; //转速脉冲点X轴数据
              const yArray = this._option.tools.speedPulse.data.YArray;
              let xArr = optX.data; //X轴数据
              let speedPulesIndex = 0; //转速脉冲点X轴数据下标
              for (let i = 0, l = xArr.length; i < l; i++) {
                if (xArr[i] == xArray[speedPulesIndex]) {
                  let x = xArray[speedPulesIndex] * xk + xb;
                  let y = yArray[speedPulesIndex] * yk + yb;
                  if (
                    x > opt.grid.left &&
                    x <= scopeR.r &&
                    y >= opt.grid.top &&
                    y <= scopeR.b
                  ) {
                    pulse.beginPath();
                    pulse.arc(x, y, size, 0, 2 * Math.PI);
                    pulse.strokeStyle = opt.series.markLine.lineStyle.color;
                    pulse.fillStyle = opt.series.markLine.lineStyle.color;
                    pulse.fill();
                    pulse.stroke();
                  }
                  speedPulesIndex++;
                }
              }
            }
          }
        },
        //数据时标注信息(增加多条数据时数组数据下标的判断)
        drawAddLabel: function (type = 1) {
          // type：1 => 点击添加标注；2 => 点击最大化
          let _flag = this._flag,
            opt = this._option,
            foreCtx = this._drawTools.ctx.foreground;
          let l = _flag.addPeak.length;
          let size = {
            width: this._scope.v.x.end.toFixed(4).length >= 8 ? 120 : 110,
            height: 40
          };
          let n = ~~(this._scope.r.w / (size.width + 10));
          let xArr = opt.x.data;
          let yArr = opt.y.data;
          let xMax = xArr[xArr.length - 1];
          for (let i = 0; i < l; i++) {
            // 增加判断，防止有效频段过滤频率后产生偏差
            if (!Array.isArray(xArr[0])) {
              if (_flag.addPeakPos[i].value == opt.x.data[_flag.addPeak[i]]) {
                break;
              } else {
                //xArr变化过，需要重新取下标
                for (let n = 0, len = xArr.length; n < len; n++) {
                  if (_flag.addPeakPos[i].value == xArr[n]) {
                    _flag.addPeak[i] = n
                    _flag.line.key = n
                    _flag.line.val = xArr[n]
                  }
                }
              }
            } else {
              if (_flag.addPeakPos[i].value == opt.x.data[_flag.muchaddPeak[i].idx][_flag.addPeak[i]]) {
                return;
              } else {
                //xArr变化过，需要重新取下标
                for (let n = 0, len = xArr[_flag.muchaddPeak[i].idx].length; n < len; n++) {
                  if (_flag.addPeakPos[i].value == xArr[_flag.muchaddPeak[i].idx][n]) {
                    _flag.addPeak[i] = n
                    _flag.line.key = n
                    _flag.line.val = xArr[_flag.muchaddPeak[i].idx][n]
                    _flag.muchaddPeak[i].key = n
                  }
                }
              }


            }
          }
          if (type === 1 && l < n) {
            if (l !== 0) {
              for (let i = 0; i < l; i++) {
                if (_flag.addPeak[i] === _flag.line.key) {
                  return;
                }
              }
              _flag.addPeak.push(_flag.line.key);
              _flag.muchaddPeak.push({
                key: _flag.line.key,
                idx: _flag.line.idx
              });
              l++;
            } else if (l === n) {
              return;
            } else {
              _flag.addPeak.push(_flag.line.key);
              _flag.muchaddPeak.push({
                key: _flag.line.key,
                idx: _flag.line.idx
              });
              l++;
            }
            // 排序
            _flag.addPeak.sort((a, b) => {
              return a - b;
            });
            _flag.addPeakPos.length = 0;
            if (Array.isArray(xArr[0])) {
              //多组数据
              for (let i = 0; i < l; i++) {
                let idx;
                let xFreq;
                _flag.muchaddPeak.forEach(item => {
                  if (item.key === _flag.addPeak[i]) {
                    idx = item.idx;
                  }
                });
                if (idx !== undefined) {
                  xFreq = xArr[idx][_flag.addPeak[i]];
                }
                if (!xFreq) {
                  // 若当前下标下的x值不存在取
                  for (let j = 0, len = xArr.length; j < len; j++) {
                    const value = xArr[j];
                    if (j !== idx && value[_flag.addPeak[i]]) {
                      xFreq = value[_flag.addPeak[i]];
                      break;
                    }
                  }
                }
                _flag.addPeakPos.push({
                  xName: opt.x.name[idx],
                  value: xFreq,
                  freq: this.round(xFreq),
                  x: i * (size.width + 5) + opt.grid.left + 0.5,
                  y: opt.grid.top,
                  flag: 0
                });
              }
            } else {
              //一组数据
              for (let i = 0; i < l; i++) {
                _flag.addPeakPos.push({
                  xName: opt.x.name,
                  value: opt.x.data[_flag.addPeak[i]],
                  freq: this.round(opt.x.data[_flag.addPeak[i]]),
                  x: i * (size.width + 5) + opt.grid.left + 0.5,
                  y: opt.grid.top,
                  flag: 0
                });
              }
            }
          } else if (type === 2) {
            let movePos = null,
              peak = null,
              flag = -1;
            for (let i = 0; i < l; i++) {
              if (_flag.addPeakPos[i].flag) {
                peak = _flag.addPeak[i];
                movePos = _flag.addPeakPos[i];
                flag = i;
                _flag.addPeak.splice(i, 1);
                _flag.addPeakPos.splice(i, 1);
                break;
              }
            }
            if (flag > -1) {
              _flag.addPeak.push(peak);
              _flag.addPeakPos.push(movePos);
            }
          }
          if (
            opt.series.dataMsg.setPower &&
            opt.x.name === _flag.addPeakPos[0].xName
          ) {
            for (let i = 0, len = xArr.length; i < len; i++) {
              for (let j = 0, length = _flag.addPeakPos.length; j < length; j++) {
                if (_flag.addPeakPos[j].freq == xArr[i]) {
                  // 若x值与xArr数组相同，将下标推入addPeak
                  _flag.addPeak[j] = i;
                  break;
                }
              }
            }
          }
          foreCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          foreCtx.beginPath();
          foreCtx.font =
            opt.series.markLine.fontStyle.size +
            " " +
            opt.series.markLine.fontStyle.family;
          foreCtx.textBaseline = "top";
          foreCtx.strokeStyle = opt.series.markLine.lineStyle.color;
          let line = {
            x: null,
            y: null
          };
          const freqObj = {
            Hz: "频率：",
            NX: "倍频：",
            ms: "时间："
          };
          let freq = freqObj[opt.x.name];
          if (Array.isArray(xArr[0])) {
            freq = freqObj[opt.x.name[_flag.line.idx]];
          }
          const proportion = this._computeParams.proportion;
          const xk = proportion.x.k;
          const xb = proportion.x.b;
          const yk = proportion.y.k;
          const yb = proportion.y.b;
          if (Array.isArray(xArr[0])) {
            for (let i = 0; i < l; i++) {
              let halfWidth = _flag.addPeakPos[i].x + size.width / 2;
              let arr = [];
              let m = 0;
              let idx;
              _flag.muchaddPeak.forEach(item => {
                if (item.key === _flag.addPeak[i]) {
                  idx = item.idx;
                }
              });
              if (idx !== undefined) {
                const y = yArr[idx][_flag.addPeak[i]];
                if (y !== undefined) {
                  arr.push({
                    dy: m,
                    val: this.round(y)
                  });
                  line = {
                    x: xArr[idx][_flag.addPeak[i]] * xk + xb,
                    y: yArr[idx][_flag.addPeak[i]] * yk + yb
                  };
                  m += 15;
                }
              }
              const length = arr.length;
              foreCtx.fillStyle = opt.series.markLine.lineStyle.color;
              foreCtx.fillRect(
                _flag.addPeakPos[i].x,
                _flag.addPeakPos[i].y,
                size.width,
                size.height + (length - 1) * 20
              );
              foreCtx.fillStyle = opt.series.markLine.fontStyle.color;
              foreCtx.fillText(
                `${freq}${_flag.addPeakPos[i].freq}${opt.x.name[idx]}`,
                _flag.addPeakPos[i].x + 5,
                _flag.addPeakPos[i].y + 8
              );
              for (let j = 0; j < length; j++) {
                const value = arr[j];
                foreCtx.fillText(
                  "幅值：" + value.val,
                  _flag.addPeakPos[i].x + 5,
                  _flag.addPeakPos[i].y + 23 + value.dy
                );
              }
              foreCtx.moveTo(
                halfWidth,
                _flag.addPeakPos[i].y + size.height + (length - 1) * 20
              );
              foreCtx.lineTo(line.x, line.y);
            }
          } else {
            for (let i = 0; i < l; i++) {
              if (
                (xArr.length < _flag.addPeak[i] && opt.series.dataMsg.setPower) ||
                (_flag.addPeakPos[i].freq > xMax &&
                  _flag.addPeakPos.xName === opt.x.name)
              )
                continue;
              let halfWidth = _flag.addPeakPos[i].x + size.width / 2;
              line = {
                x: xArr[_flag.addPeak[i]] * xk + xb,
                y: yArr[_flag.addPeak[i]] * yk + yb
              };
              foreCtx.fillStyle = opt.series.markLine.lineStyle.color;
              foreCtx.fillRect(
                _flag.addPeakPos[i].x,
                _flag.addPeakPos[i].y,
                size.width,
                size.height
              );
              foreCtx.fillStyle = opt.series.markLine.fontStyle.color;
              foreCtx.fillText(
                `${freq}${_flag.addPeakPos[i].freq}${opt.x.name}`,
                _flag.addPeakPos[i].x + 5,
                _flag.addPeakPos[i].y + 8
              );
              foreCtx.fillText(
                "幅值：" + opt.y.data[_flag.addPeak[i]].toFixed(4) + opt.y.name,
                _flag.addPeakPos[i].x + 5,
                _flag.addPeakPos[i].y + 23
              );
              foreCtx.moveTo(halfWidth, _flag.addPeakPos[i].y + size.height);
              foreCtx.lineTo(line.x, line.y);
            }
          }
          foreCtx.stroke();
          if (opt.toolTip.symbol.show) {
            //描点
            foreCtx.strokeStyle = opt.toolTip.lineStyle.color;
            foreCtx.fillStyle =
              opt.toolTip.symbol.color !== ""
                ? opt.toolTip.symbol.color
                : opt.toolTip.lineStyle.color;
            if (Array.isArray(xArr[0])) {
              for (let i = 0; i < l; i++) {
                foreCtx.beginPath();
                // for (let j = 0, len = xArr.length; j < len; j++) {
                let idx;
                _flag.muchaddPeak.forEach(item => {
                  if (item.key === _flag.addPeak[i]) {
                    idx = item.idx;
                  }
                });
                if (idx !== undefined) {
                  const xValue = xArr[idx][_flag.addPeak[i]];
                  if (xValue) {
                    line = {
                      x: xValue * xk + xb,
                      y: yArr[idx][_flag.addPeak[i]] * yk + yb
                    };
                  }
                }
                // }
                foreCtx.arc(
                  line.x,
                  line.y,
                  opt.toolTip.symbol.size,
                  0,
                  2 * Math.PI
                );
                foreCtx.fill();
              }
            } else {
              for (let i = 0; i < l; i++) {
                foreCtx.beginPath();
                line = {
                  x: xArr[_flag.addPeak[i]] * xk + xb,
                  y: yArr[_flag.addPeak[i]] * yk + yb
                };
                foreCtx.arc(
                  line.x,
                  line.y,
                  opt.toolTip.symbol.size,
                  0,
                  2 * Math.PI
                );
                foreCtx.fill();
              }
            }
          }
          foreCtx.clearRect(0, 0, this._dom.width, opt.grid.top);
          foreCtx.clearRect(
            0,
            opt.grid.top,
            opt.grid.left,
            this._dom.height - opt.grid.top
          );
          foreCtx.clearRect(
            opt.grid.left,
            this._scope.r.b,
            this._dom.width - opt.grid.left,
            opt.grid.bottom
          );
          foreCtx.clearRect(
            this._scope.r.r,
            opt.grid.top,
            opt.grid.right,
            this._scope.r.h
          );
        },
        // 绘制添加标注信息(原)
        /* drawAddLabel: function (type = 1) { // type：1 => 点击添加标注；2 => 点击最大化
          let _flag = this._flag,
            opt = this._option,
            foreCtx = this._drawTools.ctx.foreground;
          let l = _flag.addPeak.length;
          let size = {
            width: this._scope.v.x.end.toFixed(4).length >= 8 ? 120 : 110,
            height: 40,
          };
          let n = ~~(this._scope.r.w / (size.width + 10))
          let xArr = opt.x.data;
          let yArr = opt.y.data;
          let xMax = xArr[xArr.length - 1];
          if (type === 1 && l < n) {
            if (l !== 0) {
              for (let i = 0; i < l; i++) {
                if (_flag.addPeak[i] === _flag.line.key) {
                  return;
                }
              }
              _flag.addPeak.push(_flag.line.key)
              l++;
            } else if (l === n) {
              return
            } else {
              _flag.addPeak.push(_flag.line.key)
              l++;
            }
            _flag.addPeak.sort((a, b) => {
              return a - b
            })
            _flag.addPeakPos.length = 0;
            if (Array.isArray(xArr[0])) {
              for (let i = 0; i < l; i++) {
                let xFreq = xArr[_flag.line.idx][_flag.addPeak[i]];
                if (!xFreq) {
                  for (let j = 0, len = xArr.length; j < len; j++) {
                    const value = xArr[j];
                    if (j !== _flag.line.idx && value[_flag.addPeak[i]]) {
                      xFreq = value[_flag.addPeak[i]];
                      break;
                    }
                  }
                }
                _flag.addPeakPos.push({
                  xName: opt.x.name[_flag.line.idx],
                  freq: this.round(xFreq),
                  x: i * (size.width + 5) + opt.grid.left + 0.5,
                  y: opt.grid.top,
                  flag: 0
                })
              }
            } else {
              for (let i = 0; i < l; i++) {
                _flag.addPeakPos.push({
                  xName: opt.x.name,
                  freq: this.round(opt.x.data[_flag.addPeak[i]]),
                  x: i * (size.width + 5) + opt.grid.left + 0.5,
                  y: opt.grid.top,
                  flag: 0
                })
              }
            }
          } else if (type === 2) {
            let movePos = null,
              peak = null,
              flag = -1;
            for (let i = 0; i < l; i++) {
              if (_flag.addPeakPos[i].flag) {
                peak = _flag.addPeak[i];
                movePos = _flag.addPeakPos[i];
                flag = i;
                _flag.addPeak.splice(i, 1);
                _flag.addPeakPos.splice(i, 1);
                break;
              }
            }
            if (flag > -1) {
              _flag.addPeak.push(peak);
              _flag.addPeakPos.push(movePos);
            }
          }
          if (opt.series.dataMsg.setPower && opt.x.name === _flag.addPeakPos[0].xName) {
            for (let i = 0, len = xArr.length; i < len; i++) {
              for (let j = 0, length = _flag.addPeakPos.length; j < length; j++) {
                if (_flag.addPeakPos[j].freq == xArr[i]) {
                  _flag.addPeak[j] = i;
                  break;
                }
              }
            }
          }
          foreCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          foreCtx.beginPath();
          foreCtx.font = opt.series.markLine.fontStyle.size +
            ' ' + opt.series.markLine.fontStyle.family;
          foreCtx.textBaseline = 'top';
          foreCtx.strokeStyle = opt.series.markLine.lineStyle.color;
          let line = {
            x: null,
            y: null
          }
          const freqObj = {
            Hz: '频率：',
            NX: '倍频：',
            ms: '时间：',
          }
          let freq = freqObj[opt.x.name];
          if (Array.isArray(xArr[0])) {
            freq = freqObj[opt.x.name[_flag.line.idx]];
          }
          const proportion = this._computeParams.proportion;
          const xk = proportion.x.k;
          const xb = proportion.x.b;
          const yk = proportion.y.k;
          const yb = proportion.y.b;
          if (Array.isArray(xArr[0])) {
            for (let i = 0; i < l; i++) {
              let halfWidth = _flag.addPeakPos[i].x + size.width / 2;
              let arr = [];
              let m = 0;
              for (let j = 0, len = yArr.length; j < len; j++) {
                const y = yArr[j][_flag.addPeak[i]];
                if (y !== undefined) {
                  arr.push({
                    dy: m,
                    val: this.round(y),
                  })
                  line = {
                    x: xArr[j][_flag.addPeak[i]] * xk + xb,
                    y: yArr[j][_flag.addPeak[i]] * yk + yb,
                  }
                  m += 15;
                  // break;
                }
              }
              const length = arr.length;
              foreCtx.fillStyle = opt.series.markLine.lineStyle.color
              foreCtx.fillRect(_flag.addPeakPos[i].x, _flag.addPeakPos[i].y, size.width, size.height + (length - 1) * 20);
              foreCtx.fillStyle = opt.series.markLine.fontStyle.color;
              foreCtx.fillText(`${freq}${_flag.addPeakPos[i].freq}${opt.x.name[_flag.line.idx]}`, _flag.addPeakPos[i].x + 5, _flag.addPeakPos[i].y + 8);
              for (let j = 0; j < length; j++) {
                const value = arr[j];
                foreCtx.fillText('幅值：' + value.val, _flag.addPeakPos[i].x + 5, _flag.addPeakPos[i].y + 23 + value.dy)
              }
              foreCtx.moveTo(halfWidth, _flag.addPeakPos[i].y + size.height + (length - 1) * 20);
              foreCtx.lineTo(line.x, line.y);
            }
          } else {
            for (let i = 0; i < l; i++) {
              if (
                (xArr.length < _flag.addPeak[i] &&
                  opt.series.dataMsg.setPower) ||
                (_flag.addPeakPos[i].freq > xMax &&
                  _flag.addPeakPos.xName === opt.x.name)
              ) continue;
              let halfWidth = _flag.addPeakPos[i].x + size.width / 2;
              line = {
                x: xArr[_flag.addPeak[i]] * xk + xb,
                y: yArr[_flag.addPeak[i]] * yk + yb
              }
              foreCtx.fillStyle = opt.series.markLine.lineStyle.color
              foreCtx.fillRect(_flag.addPeakPos[i].x, _flag.addPeakPos[i].y, size.width, size.height)
              foreCtx.fillStyle = opt.series.markLine.fontStyle.color;
              foreCtx.fillText(`${freq}${_flag.addPeakPos[i].freq}${opt.x.name}`, _flag.addPeakPos[i].x + 5, _flag.addPeakPos[i].y + 8);
              foreCtx.fillText('幅值：' + opt.y.data[_flag.addPeak[i]].toFixed(4) + opt.y.name, _flag.addPeakPos[i].x + 5, _flag.addPeakPos[i].y + 23);
              foreCtx.moveTo(halfWidth, _flag.addPeakPos[i].y + size.height);
              foreCtx.lineTo(line.x, line.y);
            }
          }
          foreCtx.stroke();
          if (opt.toolTip.symbol.show) {
            foreCtx.strokeStyle = opt.toolTip.lineStyle.color;
            foreCtx.fillStyle = opt.toolTip.symbol.color !== '' ? opt.toolTip.symbol.color : opt.toolTip.lineStyle.color;
            if (Array.isArray(xArr[0])) {
              for (let i = 0; i < l; i++) {
                foreCtx.beginPath();
                for (let j = 0, len = xArr.length; j < len; j++) {
                  const xValue = xArr[j][_flag.addPeak[i]];
                  if (xValue) {
                    line = {
                      x: xValue * xk + xb,
                      y: yArr[j][_flag.addPeak[i]] * yk + yb,
                    }
                  }
                }
                foreCtx.arc(line.x, line.y, opt.toolTip.symbol.size, 0, 2 * Math.PI);
                foreCtx.fill();
              }
            } else {
              for (let i = 0; i < l; i++) {
                foreCtx.beginPath();
                line = {
                  x: xArr[_flag.addPeak[i]] * xk + xb,
                  y: yArr[_flag.addPeak[i]] * yk + yb
                }
                foreCtx.arc(line.x, line.y, opt.toolTip.symbol.size, 0, 2 * Math.PI);
                foreCtx.fill();
              }
            }
          }
          foreCtx.clearRect(0, 0, this._dom.width, opt.grid.top);
          foreCtx.clearRect(0, opt.grid.top, opt.grid.left, this._dom.height - opt.grid.top);
          foreCtx.clearRect(opt.grid.left, this._scope.r.b, this._dom.width - opt.grid.left, opt.grid.bottom);
          foreCtx.clearRect(this._scope.r.r, opt.grid.top, opt.grid.right, this._scope.r.h);
        }, */
        // 获取最大的峰值下标
        getPeakIndexArr: function (yArr, count) {
          /!*yArr=频谱y数组 count=需要获取的最大下标数目*!/;
          if (yArr.length <= 1) {
            return [0];
          }
          var indexArr = [],
            xVal = [];
          var t_yArr = []; //构造包含索引和y最大极值的数组
          var i = 0;
          var j = 0;
          var len = yArr.length;
          var obj = {};
          if (yArr[0] > yArr[1]) {
            obj.key = 0;
            obj.value = yArr[0];
            t_yArr.push(obj);
          }
          for (i = 1; i < len - 1; i++) {
            if (yArr[i] > yArr[i - 1] && yArr[i] > yArr[i + 1]) {
              obj = {};
              obj.key = i;
              obj.value = yArr[i];
              t_yArr.push(obj);
            }
          }
          if (yArr[len - 2] < yArr[len - 1]) {
            obj = {};
            obj.key = len - 1;
            obj.value = yArr[len - 1];
            t_yArr.push(obj);
          }
          len = t_yArr.length;
          for (i = 0; i < count; i++) {
            for (j = i + 1; j < len; j++) {
              if (t_yArr[i].value < t_yArr[j].value) {
                obj = t_yArr[i];
                t_yArr[i] = t_yArr[j];
                t_yArr[j] = obj;
              }
            }
          }
          if (count > len) {
            count = len;
          }
          for (i = 0; i < count; i++) {
            indexArr.push(t_yArr[i].key);
          }
          return indexArr;
        },
        // 设置导出音频信息
        setAudio (freq, data) {
          const l = data.length;
          var max = Number.MIN_VALUE;
          var pointSize = 16; //采样点大小
          var length = (l * pointSize) / 8; //数据长度
          var channelNumber = 1; //声道数量
          var blockSize = (channelNumber * pointSize) / 8; //采样块大小
          var buffer = new Uint8Array(length + 44); //wav文件数据
          var view = new DataView(buffer.buffer); //数据视图
          buffer.set(new Uint8Array([0x52, 0x49, 0x46, 0x46])); //"RIFF"
          view.setUint32(4, l + 44, true); //总长度
          buffer.set(new Uint8Array([0x57, 0x41, 0x56, 0x45]), 8); //"WAVE"
          buffer.set(new Uint8Array([0x66, 0x6d, 0x74, 0x20]), 12); //"fmt "
          view.setUint32(16, 16, true); //WAV头大小
          view.setUint16(20, 1, true); //编码方式
          view.setUint16(22, 1, true); //声道数量
          view.setUint32(24, freq, true); //采样频率
          view.setUint32(28, freq * blockSize, true); //每秒字节数
          view.setUint16(32, blockSize, true); //采样块大小
          view.setUint16(34, pointSize, true); //采样点大小
          buffer.set(new Uint8Array([0x64, 0x61, 0x74, 0x61]), 36); //"data"
          view.setUint32(40, length, true); //数据长度
          for (let i = 0; i < l; i++) {
            if (Math.abs(data[i]) > max) {
              max = Math.abs(data[i]);
            }
          }
          if (max == 0) {
            //波形坐标轴最小刻度为0.001
            max = 0.0001;
          }
          var xs = 32760 / max; //放大系数:short/max，short范围(-32768~32767)
          for (let i = 0; i < l; i++) {
            data[i] = Math.round(data[i] * xs); //数据
          }
          buffer.set(new Uint8Array(new Int16Array(data).buffer), 44); //数据
          return buffer;
        },
        // 导出文件
        funDownload: function (content, filename) {
          var eleLink = document.createElement("a"); // 创建隐藏的可下载链接
          eleLink.download = filename;
          eleLink.style.display = "none";
          var blob = new Blob([content]); // 字符内容转变成blob地址
          eleLink.href = URL.createObjectURL(blob);
          eleLink.dispatchEvent(new MouseEvent("click"));
        },
        // 画标线
        drawMarkLine: function () {
          let opt = this._option;
          let arr = opt.series.markLine.data;
          let failCtx = this._drawTools.ctx.failure;
          failCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          if (arr.length === 0) return;
          const coordinateSystem = opt.series.coordinateSystem;
          let scopeR = this._scope.r;
          if (coordinateSystem === "rectanguler") {
            let paramsX = this._computeParams.proportion.x;
            let paramsY = this._computeParams.proportion.y;
            let extreme = {
              max: opt.x.data[opt.x.data.length - 1],
              min: opt.x.data[0]
            };
            const l = arr.length;
            if (arr && l > 0) {
              if (l === 1 && arr[0].name === undefined) {
                const value = arr[0];
                const dValue = {
                  val: value.val,
                  key: value.key,
                  dex: 0
                };
                this.drawLine(dValue);
                this._flag.line = {
                  key: arr[0].key,
                  val: arr[0].val,
                  idx: undefined
                };
                this._flag.toolCheck = 0;
                arr.length = 0;
              } else {
                let lineStyle = opt.series.markLine.lineStyle;
                let fontStyle = opt.series.markLine.fontStyle;
                // 新增对比分析的故障频率
                if (opt.x.data[0] && Array.isArray(opt.x.data[0])) {
                  for (let i = 0; i < l; i++) {
                    let x = opt.x.data[0][arr[i].xAxis] * paramsX.k + paramsX.b + 0.5;
                    let y = opt.y.data[0][arr[i].xAxis] * paramsY.k + paramsY.b;
                    if (
                      x >= opt.grid.left &&
                      x <= scopeR.r &&
                      y >= opt.grid.top &&
                      y <= scopeR.b
                    ) {
                      failCtx.beginPath();
                      failCtx.lineWidth = 1;
                      failCtx.strokeStyle = lineStyle.color;
                      failCtx.fillStyle = lineStyle.color; //设定故障频率文字颜色
                      failCtx.font =
                        fontStyle.weight +
                        " " +
                        fontStyle.size +
                        " " +
                        fontStyle.family;
                      failCtx.save();
                      failCtx.moveTo(x, opt.grid.top);
                      failCtx.lineTo(x, y - 3);
                      failCtx.translate(x - scopeR.h, 110 + opt.grid.top);
                      failCtx.rotate((-90 * Math.PI) / 180);
                      failCtx.textAlign = "right";
                      failCtx.textBaseline = "bottom";
                      failCtx.fillText(arr[i].name, 40 + opt.grid.top, scopeR.h);
                      failCtx.restore();
                      failCtx.stroke();
                      failCtx.beginPath();
                      failCtx.fillStyle = lineStyle.color;
                      failCtx.arc(x, y, 3, 0, 2 * Math.PI);
                      failCtx.fill();
                      failCtx.moveTo(x, y + 3);
                      failCtx.lineTo(x, scopeR.b);
                      failCtx.stroke();
                    }
                  }


                } else {
                  for (let i = 0; i < l; i++) {
                    let x = opt.x.data[arr[i].xAxis] * paramsX.k + paramsX.b + 0.5;
                    let y = opt.y.data[arr[i].xAxis] * paramsY.k + paramsY.b;
                    if (
                      x >= opt.grid.left &&
                      x <= scopeR.r &&
                      y >= opt.grid.top &&
                      y <= scopeR.b
                    ) {
                      failCtx.beginPath();
                      failCtx.lineWidth = 1;
                      failCtx.strokeStyle = lineStyle.color;
                      failCtx.fillStyle = lineStyle.color; //设定故障频率文字颜色
                      failCtx.font =
                        fontStyle.weight +
                        " " +
                        fontStyle.size +
                        " " +
                        fontStyle.family;
                      failCtx.save();
                      failCtx.moveTo(x, opt.grid.top);
                      failCtx.lineTo(x, y - 3);
                      failCtx.translate(x - scopeR.h, 110 + opt.grid.top);
                      failCtx.rotate((-90 * Math.PI) / 180);
                      failCtx.textAlign = "right";
                      failCtx.textBaseline = "bottom";
                      failCtx.fillText(arr[i].name, 40 + opt.grid.top, scopeR.h);
                      failCtx.restore();
                      failCtx.stroke();
                      failCtx.beginPath();
                      failCtx.fillStyle = lineStyle.color;
                      failCtx.arc(x, y, 3, 0, 2 * Math.PI);
                      failCtx.fill();
                      failCtx.moveTo(x, y + 3);
                      failCtx.lineTo(x, scopeR.b);
                      failCtx.stroke();
                    }
                  }
                }


              }
              this._flag.tools.flag_subFreq && this.drawLabelLine();
            }
          } else if (coordinateSystem === "circle") {
            const color = opt.series.data.color;
            for (let i = 0, l = arr.length; i < l; i++) {
              failCtx.beginPath();
              if (arr[i]) {
                for (let val of arr[i]) {
                  failCtx.strokeStyle = color[i];
                  failCtx.arc(scopeR.x, scopeR.y, val, 0, 2 * Math.PI);
                }
              }

            }
            failCtx.stroke();
          } else if (coordinateSystem === "circleLine") {
            const color = opt.series.data.color;
            for (let i = 0, l = arr.length; i < l; i++) {
              failCtx.beginPath();
              for (let val of arr[i]) {
                failCtx.strokeStyle = color[i];
                failCtx.arc(scopeR.x, scopeR.y, val, 0, 2 * Math.PI);
              }
            }
            failCtx.stroke();
          }
        },
        // 圆周图坐标(背景)
        drawCircleAxios () {
          const opt = this._option;
          const dom = this._dom;
          const backCtx = this._drawTools.ctx.background;
          const sr = this._scope.r;
          const x = sr.x;
          const y = sr.y;
          const r = sr.rs;
          const line = opt.series.lineStyle;
          const font = opt.series.fontStyle;
          backCtx.clearRect(0, 0, dom.width, dom.height);
          backCtx.beginPath();
          backCtx.strokeStyle = line.color;
          backCtx.lineWidth = line.width;
          backCtx.fillStyle = font.color;
          backCtx.arc(x, y, r, 0, 2 * Math.PI);
          backCtx.moveTo(x - r, y);
          backCtx.lineTo(x + r, y);
          backCtx.moveTo(x, y - r);
          backCtx.lineTo(x, y + r);
          backCtx.stroke();
          backCtx.font = `${font.size} ${font.family}`;
          backCtx.textAlign = "center";
          backCtx.textBaseline = "bottom";
          backCtx.fillText("∠0°", x, y - r);
          backCtx.textBaseline = "top";
          backCtx.fillText("∠180°", x, y + r + 2);
          backCtx.textAlign = "left";
          backCtx.textBaseline = "middle";
          backCtx.fillText("∠90°", x + r + 2, y);
          backCtx.textAlign = "right";
          backCtx.fillText("∠270°", x - r - 2, y);
          backCtx.beginPath();
          backCtx.arc(x, y, r / 2, 0, 2 * Math.PI);
          backCtx.stroke();
          backCtx.beginPath();
          backCtx.arc(x, y, (3 * r) / 4, 0, 2 * Math.PI);
          backCtx.stroke();
        },
        // 圆周图数据
        drawPointsLine () {
          const dom = this._dom;
          const series = this._option.series;
          const sr = this._scope.r;
          const rx = sr.x; /* 圆心x */
          const ry = sr.y; /* 圆心y */
          const rr = sr.rs; /* 半径 */
          const data = series.data;
          const amplitude = data.amplitude; /* x轴角度 */
          const phase = data.phase; /* y轴的幅值 */
          const dataCtx = this._drawTools.ctx.data;
          const max = data.maxAmplitude;
          const min = data.minAmplitude;
          const PP = data.PP; /* 四分之一的半径对应的幅值大小 */
          const axis = this.axis;
          axis.x.length = 0;
          axis.y.length = 0;
          axis.index.length = 0;
          if (
            amplitude === undefined ||
            phase === undefined ||
            phase.length === 0
          ) {
            return;
          }
          dataCtx.clearRect(0, 0, dom.width, dom.height);
          for (let i = 0, l = phase.length; i < l; i++) {
            const Aarr = amplitude;
            const Parr = phase[i];
            const color = data.color;
            dataCtx.lineWidth = series.lineStyle.width;
            dataCtx.fillStyle = color;
            dataCtx.strokeStyle = color;
            if (this.getDataType(Parr) === "Array") {
              for (let j = 0, len = Parr.length; j < len; j++) {
                dataCtx.beginPath();
                const A = (360 / len) * j; //每个点对应在坐标系内的角度
                let yVal = Parr[j]; //波形的幅值
                let nyVal = Parr[j + 1]; //下一个波形的幅值
                const nA = (360 / len) * (j + 1); //下一个点对应在坐标系内的角度
                if (j === len - 1) {
                  nyVal = Parr[0];
                }
                let x;
                let y;
                x = {
                  oVal:
                    rx +
                    (((3 * PP + yVal) * rr) / 4 / PP) *
                    Math.sin((A * Math.PI) / 180),
                  nVal:
                    rx +
                    (((3 * PP + nyVal) * rr) / 4 / PP) *
                    Math.sin((nA * Math.PI) / 180)
                };
                y = {
                  oVal:
                    ry -
                    (((3 * PP + yVal) * rr) / 4 / PP) *
                    Math.cos((A * Math.PI) / 180),
                  nVal:
                    ry -
                    (((3 * PP + nyVal) * rr) / 4 / PP) *
                    Math.cos((nA * Math.PI) / 180)
                };

                dataCtx.moveTo(x.oVal, y.oVal);
                dataCtx.lineTo(x.nVal, y.nVal);
                axis.x.push(x);
                axis.y.push(y);
                axis.index.push({ i, j });
                dataCtx.stroke();
              }
            }
          }
          const text = `${this.round(max)}${series.unit}`;
          const font = series.fontStyle;
          dataCtx.beginPath();
          dataCtx.fillStyle = font.color;
          dataCtx.font = `${font.size} ${font.family}`;
          dataCtx.textAlign = "left";
          dataCtx.textBaseline = "bottom";
          dataCtx.fillText(
            text,
            rx + rr * Math.cos((45 * Math.PI) / 180),
            ry - rr * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "left";
          dataCtx.textBaseline = "top";
          dataCtx.fillText(
            text,
            rx + rr * Math.cos((45 * Math.PI) / 180),
            ry + rr * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "right";
          dataCtx.textBaseline = "bottom";
          dataCtx.fillText(
            text,
            rx - rr * Math.cos((45 * Math.PI) / 180),
            ry - rr * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "right";
          dataCtx.textBaseline = "top";
          dataCtx.fillText(
            text,
            rx - rr * Math.cos((45 * Math.PI) / 180),
            ry + rr * Math.sin((45 * Math.PI) / 180)
          );
          const text2 = -text;
          dataCtx.beginPath();
          dataCtx.fillStyle = font.color;
          dataCtx.font = `${font.size} ${font.family}`;
          dataCtx.textAlign = "right";
          dataCtx.textBaseline = "bottom";
          dataCtx.fillText(
            text2,
            rx + (rr / 2) * Math.cos((45 * Math.PI) / 180) - 20,
            ry - (rr / 2) * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "right";
          dataCtx.textBaseline = "top";
          dataCtx.fillText(
            text2,
            rx + (rr / 2) * Math.cos((45 * Math.PI) / 180) - 20,
            ry + (rr / 2) * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "left";
          dataCtx.textBaseline = "bottom";
          dataCtx.fillText(
            text2,
            rx - (rr / 2) * Math.cos((45 * Math.PI) / 180) + 20,
            ry - (rr / 2) * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "left";
          dataCtx.textBaseline = "top";
          dataCtx.fillText(
            text2,
            rx - (rr / 2) * Math.cos((45 * Math.PI) / 180) + 20,
            ry + (rr / 2) * Math.sin((45 * Math.PI) / 180)
          );
        },
        // 倾角分布图(沉降跟踪图)坐标(背景)
        drawCircle () {
          const opt = this._option;
          const dom = this._dom;
          const backCtx = this._drawTools.ctx.background;
          const sr = this._scope.r;
          const x = sr.x;
          const y = sr.y;
          const r = sr.rs;
          const line = opt.series.lineStyle;
          const font = opt.series.fontStyle;
          backCtx.clearRect(0, 0, dom.width, dom.height);
          backCtx.beginPath();
          backCtx.strokeStyle = line.color;
          backCtx.lineWidth = line.width;
          backCtx.fillStyle = font.color;
          backCtx.arc(x, y, r, 0, 2 * Math.PI);
          backCtx.moveTo(x - r, y);
          backCtx.lineTo(x + r, y);
          backCtx.moveTo(x, y - r);
          backCtx.lineTo(x, y + r);
          backCtx.stroke();
          backCtx.font = `${font.size} ${font.family}`;
          backCtx.textAlign = "center";
          backCtx.textBaseline = "bottom";
          backCtx.fillText("N ∠0°", x, y - r);
          backCtx.textBaseline = "top";
          backCtx.fillText("S ∠180°", x, y + r + 2);
          backCtx.textAlign = "left";
          backCtx.textBaseline = "middle";
          backCtx.fillText("E ∠90°", x + r + 2, y);
          backCtx.textAlign = "right";
          backCtx.fillText("W ∠270°", x - r - 2, y);
        },
        // 倾角分布图(沉降跟踪图)数据
        drawPoints () {
          const dom = this._dom;
          const series = this._option.series;
          const sr = this._scope.r;
          const rx = sr.x; /* 圆心x */
          const ry = sr.y; /* 圆心y */
          const rr = sr.rs; /* 半径 */
          const data = series.data;
          const amplitude = data.amplitude; /* 幅值 */
          const phase = data.phase; /* 相位 */
          const dataCtx = this._drawTools.ctx.data;
          const max = data.maxAmplitude;
          const axis = this.axis;
          axis.x.length = 0;
          axis.y.length = 0;
          axis.index.length = 0;
          if (
            amplitude === undefined ||
            amplitude.length === 0 ||
            phase === undefined ||
            phase.length === 0
          ) {
            return;
          }
          dataCtx.clearRect(0, 0, dom.width, dom.height);
          for (let i = 0, l = phase.length; i < l; i++) {
            const Aarr = amplitude[i];
            const Parr = phase[i];
            const color = data.color[i];
            /* 散点图的点的颜色 */
            dataCtx.fillStyle = color;
            for (let j = 0, len = Aarr.length; j < len; j++) {
              dataCtx.beginPath();
              const A = Aarr[j];
              const P = Parr[j];
              const x = rx + (A / max) * rr * Math.sin((P * Math.PI) / 180);
              const y = ry - (A / max) * rr * Math.cos((P * Math.PI) / 180);
              axis.x.push(x);
              axis.y.push(y);
              axis.index.push({ i, j });
              dataCtx.arc(x, y, 2, 0, 2 * Math.PI);
              dataCtx.fill();
            }
          }
          const text = `${this.round(max)}${series.unit}`;
          const font = series.fontStyle;
          dataCtx.beginPath();
          dataCtx.fillStyle = font.color;
          dataCtx.font = `${font.size} ${font.family}`;
          dataCtx.textAlign = "left";
          dataCtx.textBaseline = "bottom";
          dataCtx.fillText(
            text,
            rx + rr * Math.cos((45 * Math.PI) / 180),
            ry - rr * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "left";
          dataCtx.textBaseline = "top";
          dataCtx.fillText(
            text,
            rx + rr * Math.cos((45 * Math.PI) / 180),
            ry + rr * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "right";
          dataCtx.textBaseline = "bottom";
          dataCtx.fillText(
            text,
            rx - rr * Math.cos((45 * Math.PI) / 180),
            ry - rr * Math.sin((45 * Math.PI) / 180)
          );
          dataCtx.textAlign = "right";
          dataCtx.textBaseline = "top";
          dataCtx.fillText(
            text,
            rx - rr * Math.cos((45 * Math.PI) / 180),
            ry + rr * Math.sin((45 * Math.PI) / 180)
          );
        },
        // 倾角分布图(沉降跟踪图)鼠标最近点
        getNearPoint (data) {
          const axis = this.axis;
          const ax = axis.x;
          const ay = axis.y;
          const msg = {
            x: ax[data[0].key],
            y: ay[data[0].key],
            index: axis.index[data[0].key]
          };
          this.drawPoint(msg);
        },
        // 圆周图报警线
        drawCircleAlarm () {
          const series = this._option.series;
          const data = series.circleAlarm;
          const ctx = this._drawTools.ctx.failure;
          const scope = this._scope.r;
          const rx = scope.x;
          const ry = scope.y;
          ctx.clearRect(0, 0, dom.width, dom.height);
          for (let i = 0, l = data.length; i < l; i++) {
            for (let j = 0; j < 2; j++) {
              const value = data[i];
              if (value.data >= series.data.maxAmplitude) continue;
              const r = (scope.rs * value.data) / series.data.maxAmplitude;
              ctx.beginPath();
              ctx.lineStyle = value.lineStyle.width;
              ctx.strokeStyle = value.lineStyle.color;
              ctx.arc(rx, ry, r, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }
        },
        // 倾角分布图(沉降跟踪图)点击描点
        drawPoint (msg, type) {
          const dom = this._dom;
          const clickCtx = this._drawTools.ctx.click;
          clickCtx.clearRect(0, 0, dom.width, dom.height);
          clickCtx.beginPath();
          clickCtx.fillStyle = "red";
          clickCtx.arc(msg.x, msg.y, 3, 0, 2 * Math.PI);
          clickCtx.fill();
          if (type == "circleLine") {
            this._option.toolTip.formatter({
              value: this._option.series.data.phase[msg.index.i][msg.index.j]
            });
          } else {
            this._option.toolTip.formatter({
              index1: msg.index.i,
              index2: msg.index.j
            });
            this._option.series.markLine.data.length = 0;
          }
        },
        // 刷新图谱
        resize () {
          const dom = this._dom;
          const opt = this._option;
          const grid = opt.grid;
          this.creat(dom.name);
          // 重新添加了keydom的事件监听，解决刷新图谱后出现无法监听keydom时间的问题
          if (opt.series.type !== "bar") {
            const div = dom.name.children;
            this.removeEvent(
              div[div.length - 1],
              "keydown",
              this.event.dom.keydown
            );
            this.addEvent(div[div.length - 1], "keydown", this.event.dom.keydown);
          }
          this._scope.r = {
            r: dom.width - grid.right,
            w: dom.width - grid.right - grid.left,
            b: dom.height - grid.bottom,
            h: dom.height - grid.top - grid.bottom,
            x: null,
            y: null,
            rs: null
          };
          const r = this._scope.r;
          const wr = r.w / 2;
          const hr = r.h / 2;
          r.x = wr + grid.left;
          r.y = hr + grid.top;
          r.rs = Math.min(wr, hr);
          const isBar = opt.series.type === "bar";
          isBar && (r.b -= 60);
          const type = isBar ? 1 : 2;
          this.restoreAll(type);
          // 防止resize()后故障频率没有画
          this._option.series.markLine.data.length > 0 && this.drawMarkLine();
        },
        // 取缩放后符合条件的y值集合
        getYdata (x1, x2) {
          let xArr = this._option.x.data;
          let yArr = this._option.y.data;
          let result = [];
          for (let i = 0; i < xArr.length; i++) {
            if (x1 <= xArr[i] && xArr[i] <= x2) {
              result.push(yArr[i]);
            }
          }
          return result;
        },
        /*
          判断dom是否已绑定某事件，如果未绑定则绑定
          el          HTMLElement   绑定事件的HTML元素
          eventType   String        事件类型
          fn          Function      事件绑定的方法
          isRepeat    Boolean       是否允许同类事件重复绑定
          useCapture  Boolean       是否在捕获阶段触发
        */
        addEvent (el, eventType, fn, isRepeat = false, useCapture = false) {
          let errorStr = "";
          if (!el || !eventType || !fn) {
            errorStr = "传入参数错误";
          } else if (typeof el !== "object") {
            errorStr = "el 不是对象";
          } else if (typeof eventType !== "string") {
            errorStr = "事件类型错误";
          } else if (typeof fn !== "function") {
            errorStr = "fn 不是函数";
          }
          if (errorStr !== "") {
            throw new Error(errorStr);
          }
          if (el.eventList === undefined) {
            el.eventList = {};
          }
          if (!isRepeat) {
            for (const key in el.eventList) {
              if (key === eventType) {
                /* this.removeEvent(el, eventType, fn);
                break; */
                return "该事件已绑定";
              }
            }
          }
          // 添加绑定事件
          el.eventList[eventType] = 1;
          el.addEventListener(eventType, fn, useCapture);
        },
        // 移除监听事件
        removeEvent (el, eventType, fn, useCapture = false) {
          let errorStr = "";
          if (!el || !eventType || !fn) {
            errorStr = "传入参数错误";
          } else if (typeof el !== "object") {
            errorStr = "el 不是HTML对象";
          } else if (typeof eventType !== "string") {
            errorStr = "事件类型错误";
          } else if (typeof fn !== "function") {
            errorStr = "fn 不是函数";
          }
          if (errorStr !== "") {
            throw new Error(errorStr);
          }
          if (el.eventList) {
            delete el.eventList[eventType];
          }
          el.removeEventListener(eventType, fn, useCapture);
        },
        // 销毁(释放dom已绑定事件)
        destory () {
          const dom = this._dom.name;
          const eventList = dom.eventList;
          if (eventList) {
            const eventName = {
              click: "click",
              mousedown: "mousedown",
              mouseup: "mouseup",
              mousewheel: "zoom",
              dblclick: "lineDblclick"
            };
            for (const key in eventList) {
              this.removeEvent(dom, key, this.event.dom[eventName[key]]);
            }
            this.removeEvent(window, "mousemove", this.event.dom.mousemove);
          }
          const div = dom.children[dom.children.length - 1];
          if (div.eventList) {
            this.removeEvent(div, "keydown", this.event.dom.keydown);
          }
          if (this._option) {
            const tools = this._option.tools;
            for (const key in tools) {
              const value = tools[key];
              if (value.dom && value.show) {
                this.removeEvent(value.dom, "click", this.event.tool[key]);
              }
            }
            if (this._option.series.type === "bar") {
              this.removeEvent(dom, "mousemove", this.event.dom.barMove);
            }
          }
        },
        // 画Y轴标线
        drawMarkY () {
          const opt = this._option;
          const data = opt.y.markLine;
          if (!data) return;
          const failCtx = this._drawTools.ctx.failure;
          const grid = opt.grid;
          const paramsY = this._computeParams.proportion.y;
          failCtx.clearRect(0, 0, this._dom.width, this._dom.height);
          for (let i = 0, l = data.length; i < l; i++) {
            const value = data[i];
            failCtx.beginPath();
            failCtx.strokeStyle = value.lineStyle.color;
            failCtx.lineWidth = value.lineStyle.width;
            failCtx.moveTo(grid.left, value.data * paramsY.k + paramsY.b);
            failCtx.lineTo(this._scope.r.r, value.data * paramsY.k + paramsY.b);
            failCtx.stroke();
          }
        }
      };
      return new _chart(dom);
    };

    function init (dom) {
      if (dom) {
        return this(dom);
      }
    }
    chart.init = init;
    return chart;
  });
