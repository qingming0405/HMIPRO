import WaveChart from "../../common/waveChart";
import { getdefaultCode, getTime, getUnit, setHead } from "utils/utils.js";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    WaveChart
  },
  name: 'scatter',
  data () {
    return {
      scatterData: {},
      fileName: "", //文件名
      currentIndex: 0, //当前选择的图谱
      currentKey: "", //当前选择的图谱的key
      requestData: {}, //请求数据
      isNewChart: true,
      xValue: "", //点击图谱x轴的值
      yValue: "", //点击图谱y轴的值
      paramsData: {}, //每一个对应的图的点击显示数据
      structure: 0 /* 结构样式, 0: 左右下; 1: 上中下 */,
      color: {
        /* 颜色设置 */
        titleColor: "#666" /* 标题字体 */,
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
          symbol: "#fff" /* symbol */
        },
        tool: {
          symbol: "#ff9b21",
          line: "#ff9b21",
          font: "#fff",
          background: "#ff9b21"
        },
        background: "#fff" /* 背景颜色 */
      }
    };
  },
  computed: {
    scatterOption () {
      const that = this;
      const arrKeys = Object.keys(this.scatterData);
      that.currentIndex = arrKeys.indexOf(this.currentKey);
      const data = this.scatterData[this.currentKey];
      const index = this.currentIndex;
      const color = this.color;
      return {
        title: {
          name: ""
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 60 // 离容器下边距离，默认 60
        },
        x: {
          name: data.posMsg.posNameX,
          name2: data.posMsg.codeNameX + `${data.posMsg.posUnitX ? "(" + data.posMsg.posUnitX + ")" : ''}`,
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal",
            bottom: "30",
            bottom2: "45"
          },
          data: data.x,
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
          name: data.posMsg.posNameY,
          name2: data.posMsg.codeNameY + `${data.posMsg.posUnitY ? "(" + data.posMsg.posUnitY + ")" : ''}`,
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal",
            align: "left"
          },
          data: data.y,
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
          type: "scatter", // 类型，默认 'line','scatter'是散点图
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1 // 粗细，默认 1
          },
          symbol: {
            show: true,
            color: color.series.line,
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
            that.paramsData[that.currentKey] = {
              xValue: params.val,
              yValue: data.y[params.key],
              timeValue: getTime(Number(data.time[params.key])),
            };
            that.$forceUpdate();
          }
        },
        tools: {
          // 开窗放大
          enlarge: {
            show: true,
            dom: document.getElementsByClassName("icon-enlarge_huaban_scatter")[
              index
            ]
          },
          // 重置
          restore: {
            show: true,
            dom: document.getElementsByClassName("icon-restore_huaban_scatter")[
              index
            ],
            formatter: function (isRestore) { }
          },
          // 导出图片
          exportImage: {
            show: true,
            dom: document.getElementsByClassName(
              "icon-savemage_huaban_scatter"
            )[index],
            imageName: this.fileName + "_" + this.$t('HeaderEdge.secondLevel2_9')//散点图
          }
        },
        backgroundColor: color.background
      };
    }
  },
  watch: {
    "$store.state.scatterMsg": {
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
  methods: {
    // 数据检索
    dataRetrieval () {
      const currentKey = this.currentKey;
      const [, , pId, id, type] = currentKey.split("_");
      const viewMsg = this.scatterData[this.currentKey].posMsg;
      this.$retrieval({
        key: "scatter",
        viewMsg
      }).then(res => {
        if (res) {
          const msg = res.msg;
          let rd = this.scatterData[this.currentKey].rd;
          rd.startTime = res.startTime;
          rd.endTime = res.endTime;
          rd.valueX = msg.codeFiledX;
          rd.codeX = msg.codeValX;
          rd.valueY = msg.codeFiledY;
          rd.codeY = msg.codeValY;
          rd.fromSpeed = res.minSpeed;
          rd.toSpeed = res.maxSpeed;
          rd.density = Number(res.density.type);
          this.scatterData[this.currentKey].posMsg.posUnitX = msg.posUnitX;
          this.scatterData[this.currentKey].posMsg.posUnitY = msg.posUnitY;
          this.$emit("loadingImg", true);
          this.$getApi.getScatterDiagram(rd).then(res => {
            this.$emit("loadingImg", false);
            this.getData(res, rd);
          });
        }
      });
    },
    /* 改变存储测点的数据 */
    openChartList (key, type, delKey) {
      if (typeof key !== "string") return;
      if (type === 0 || type === 1) {
        this.currentKey = key;
        for (let k in this.scatterData) {
          this.scatterData[k].isShow = false;
        }
      }
      let [, , macId, posId, posType] = key.split("_");
      if (type == 0) {
        const mac = this.$store.state.checkMsg.mac
        let posKey = mac.pump_id ? `${mac.mac_id}_${mac.ch_class}` : mac.mac_id
        const pos = this.$store.state.pos[posKey];
        const currentPos = this.$store.state.checkMsg.pos;
        let comparePos = currentPos /* 初始化自己与自己比 */
        if (pos && pos.length > 0) {
          for (let i = 0, l = pos.length; i < l; i++) {
            if (pos[i].position_type == currentPos.position_type && pos[i].position_id != currentPos.position_id) {
              /* TMS时需要同一个前置进行对比 */
              if (currentPos.dgm_type != 7) {
                comparePos = pos[i]
                break;
              } else {
                // 前置通道id区分（0-3,4-7,8-11,12-15）
                let channelIdArr = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]]
                for (let k = 0, l = channelIdArr.length; k < l; k++) {
                  if (channelIdArr[k].indexOf(Number(currentPos.channel_id)) != -1) {
                    let channelId = channelIdArr[k]
                    if (channelId.indexOf(Number(pos[i].channel_id)) != -1) {
                      comparePos = pos[i]
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        let posMsg = {
          mId: macId,
          idX: comparePos.position_id,
          posNameX: comparePos.position_name,
          typeX: comparePos.position_type,
          idY: posId,
          posNameY: currentPos.position_name,
          typeY: posType,
        };
        //添加数据
        this.$set(this.scatterData, key, {
          isShow: true,
          x: [],
          y: [],
          time: [],//x,y数据点对应时间
          posMsg,
          comparePos,//同类型对比测点 X
          currentPos,//当前测点 Y
          empty: {
            isShow: true,
            text: ""
          },
          rd: null // 请求参数
        });
        let startTime = this.$store.state.srcParams.time.start;
        let endTime = this.$store.state.srcParams.time.end;
        this.get_Info([startTime, endTime]);
      } else if (type == 1) {
        //切换
        this.scatterData[key].isShow = true;
        this.$nextTick(() => {
          this.resize()
        })
      } else if (type == 2) {
        //删除
        this.$delete(this.scatterData, key);
        this.$delete(this.paramsData, key);
      }
    },
    /* 获取数据 */
    get_Info (currTime, lineNum = 10, fromSpeed = null, toSpeed = null) {
      let scatterData = this.scatterData[this.currentKey];
      let [, , macId, posId, posType] = this.currentKey.split("_");
      this.paramsData[this.currentKey] = {
        xValue: "",
        yValue: ""
      };
      const time = this.$store.state.srcParams.time;
      const speed = this.$store.state.srcParams.speed;
      const density = this.$store.state.srcParams.density;
      const currentPos = scatterData.currentPos;
      let defaultCode = getdefaultCode(scatterData.comparePos.dgm_type)
      let filedsX = defaultCode[scatterData.comparePos.position_type]; // y为当前机组的同类型测点
      defaultCode = getdefaultCode(currentPos.dgm_type)
      let filedsY = defaultCode[posType]; // X轴为原测点
      const t_rootX = scatterData.comparePos.t_root;
      const t_rootY = currentPos.t_root;
      const dgmTypeX = scatterData.comparePos.dgm_type;
      const dgmTypeY = currentPos.dgm_type;
      const posLocX = scatterData.comparePos.pos_loc;
      const posLocY = currentPos.pos_loc;
      // 获取X轴特征值
      let x = setHead(t_rootX, dgmTypeX, scatterData.comparePos.position_type, posLocX);
      // 获取Y轴特征值
      let y = setHead(t_rootY, dgmTypeY, posType, posLocY);
      console.log(x, y)
      // 若特征值存在转速则默认x轴特征值为转速
      for (let i = 0, l = x.length; i < l; i++) {
        if (x[i].filed == 'speed') {
          filedsX = {
            filed: x[i].filed,
            name: x[i].val,
            code: x[i].code
          }
          break;
        }
      }
      // 若特征值存在有效值则默认x轴特征值为有效值
      for (let i = 0, l = y.length; i < l; i++) {
        if (y[i].filed == 'vib_rms') {
          filedsY = {
            filed: y[i].filed,
            name: y[i].val,
            code: y[i].code
          }
          break;
        }
      }
      let unitX = "";
      let unitY = "";
      if (currentPos.units) {
        unitY = getUnit(filedsY.code, currentPos);
      } else if (
        currentPos.position_type === 12 ||
        currentPos.position_type === 13
      ) {
        unitY = "°";
      }
      if (scatterData.comparePos.units) {
        unitX = getUnit(filedsX.code, scatterData.comparePos);
      } else if (
        scatterData.comparePos.position_type === 12 ||
        scatterData.comparePos.position_type === 13
      ) {
        unitX = "°";
      }

      let posMsg = scatterData.posMsg;
      posMsg.codeNameX = filedsX.name;
      posMsg.codeNameY = filedsY.name;
      posMsg.codeValX = filedsX.code; //所选X轴特征值的code
      posMsg.codeValY = filedsY.code; //所选Y轴特征值的code
      posMsg.codeFiledY = filedsY.filed; //所选Y轴特征值的字段名
      posMsg.codeFiledX = filedsX.filed; //所选X轴特征值的字段名
      posMsg.posUnitX = unitX;
      posMsg.posUnitY = unitY;
      posMsg.t_rootX = t_rootX;
      posMsg.t_rootY = t_rootY;
      posMsg.dgmTypeX = dgmTypeX;
      posMsg.dgmTypeY = dgmTypeY;
      posMsg.posLocX = posLocX;
      posMsg.posLocY = posLocY;
      const rd = {
        machineId: macId,
        startTime: time.start,
        endTime: time.end,
        positionTypeY: posType,
        positionIdY: posId,
        valueX: filedsX.filed,
        codeX: filedsX.code,
        positionTypeX: scatterData.comparePos.position_type,
        positionIdX: scatterData.comparePos.position_id,
        valueY: filedsY.filed,
        codeY: filedsY.code,
        type: 0,
        fromSpeed: speed.min,
        toSpeed: speed.max,
        density: Number(density.type)
      };
      scatterData.rd = rd;
      let timer = null;
      let that = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        that.$emit("loadingImg", true);
      }, 500); // 300毫秒内响应不显示
      this.$getApi.getScatterDiagram(rd).then(res => {
        clearTimeout(timer);
        this.$emit("loadingImg", false);
        this.getData(res, rd);
      });
    },
    // 组合数据
    getData (result, rd) {
      this.paramsData[this.currentKey].xValue = "";
      this.paramsData[this.currentKey].yValue = "";
      const od = this.scatterData[this.currentKey];
      od.x.length = 0;
      od.y.length = 0;
      const arr = [], arrTime = [];
      this.fileName = od.posMsg.posNameY;
      if (result.x && result.y) {
        let xArr = result.x;
        let yArr = result.y;
        for (let key in xArr) {
          if (yArr[key] !== undefined) {
            let x = xArr[key],
              y = yArr[key];
            arr.push([x, y]);
            // 获取x值对应的时间
            arrTime.push([x, key]);
          }
        }
        /*for (let i = 0; i < xArr.length; i++) {
          for (let j = 0; j < yArr.length; j++) {
            if (xArr[i].saveTime === yArr[j].saveTime) {
              // 如果是时间，需要做类型转化
              let x = xArr[i].tempValue,
                y = yArr[j].tempValue;
              arr.push([x, y]);
            }
          }
        }*/
        arr.sort(function (x, y) {
          //升序排列
          return x[0] - y[0];
        });
        arrTime.sort(function (x, y) {
          //升序排列
          return x[0] - y[0];
        });

        if (arr.length > 0) {
          od.empty = false;
          for (let i = 0; i < arr.length; i++) {
            let x = arr[i][0],
              y = arr[i][1];
            if (rd.valueX === "saveTime_Com") {
              // x = getTime(x);
              x = getTime(x);
            }
            if (rd.valueY === "saveTime_Com") {
              y = getTime(y);
            }
            od.x.push(x);
            od.y.push(y);
            od.time.push(arrTime[i][1])
          }
        } else {
          od.empty = {
            isShow: true,
            text: this.$t('scatter.eigenNoData')//此特征值无对应数据
          };
          // this.$pop(`此特征值无对应数据`);
        }
      } else {
        od.empty = {
          isShow: true,
          text: `${od.posMsg.posNameX}${this.$t('Common.noDataText')}`//无数据
        };
        // this.$pop(`${od.posMsg.posNameX}无数据`);
      }
    },
    // 拖入测点
    addPos (index, e) {
      this.isNewChart = true;
      let domInfo = e.currentTarget.getBoundingClientRect(); //获取dom元素的信息
      const posMsg = JSON.parse(e.dataTransfer.getData("flag"));
      const pId = posMsg.position_id;
      const type = posMsg.position_type;
      const pName = posMsg.position_name;
      const defaultCode = getdefaultCode(posMsg.dgm_type)
      let fileds = defaultCode[type];
      let filedsArray = setHead(posMsg.t_root, posMsg.dgm_type, posMsg.position_type, posMsg.pos_loc);

      let p1x = e.offsetX; //拖动点的x距离
      let p1y = e.offsetY; //拖动点的y距离
      let w = domInfo.width; //图表区域的宽
      let h = domInfo.height; //图表区域的高
      let k0 = Number((-h / w) * p1x + h);
      const scatterData = this.scatterData[this.currentKey]
      let msg = scatterData.posMsg;
      let rd = scatterData.rd;
      if (p1y <= k0) {
        //45度角上方的点为y轴的测点
        // 若可以取到上一次的特征值则取上一次特征值
        for (let i = 0, l = filedsArray.length; i < l; i++) {
          if (filedsArray[i].filed == msg.codeFiledY) {
            fileds = {
              filed: filedsArray[i].filed,
              name: filedsArray[i].val,
              code: filedsArray[i].code
            }
            break;
          }
        }
        let unit = "";
        if (posMsg.units) {
          unit = getUnit(fileds.code, posMsg);
        } else if (posMsg.position_type == 12 || posMsg.position_type == 13) {
          unit = "°";
        }
        scatterData.currentPos = posMsg
        rd.positionTypeY = type;
        rd.positionIdY = pId;
        rd.valueY = fileds.filed;
        rd.codeY = fileds.code;
        msg.idY = pId;
        msg.posNameY = pName;
        msg.typeY = type;
        msg.codeNameY = fileds.name;
        msg.codeValY = fileds.code;
        msg.codeFiledY = fileds.filed;
        msg.posUnitY = unit;
        msg.t_rootY = posMsg.t_root;
        msg.dgmTypeY = posMsg.dgm_type;
        msg.posLocY = posMsg.pos_loc;
      } else {
        //45度角下方的点为x轴的测点
        // 若可以取到上一次的特征值则取上一次特征值
        for (let i = 0, l = filedsArray.length; i < l; i++) {
          if (filedsArray[i].filed == msg.codeFiledX) {
            fileds = {
              filed: filedsArray[i].filed,
              name: filedsArray[i].val,
              code: filedsArray[i].code
            }
            break;
          }
        }
        let unit = "";
        if (posMsg.units) {
          unit = getUnit(fileds.code, posMsg);
        } else if (posMsg.position_type == 12 || posMsg.position_type == 13) {
          unit = "°";
        }
        scatterData.comparePos = posMsg
        rd.positionTypeX = type;
        rd.positionIdX = pId;
        rd.valueX = fileds.filed;
        rd.codeX = fileds.code;
        msg.idX = pId;
        msg.posNameX = pName;
        msg.typeX = type;
        msg.codeNameX = fileds.name;
        msg.codeValX = fileds.code;
        msg.codeFiledX = fileds.filed;
        msg.posUnitX = unit;
        msg.t_rootX = posMsg.t_root;
        msg.dgmTypeX = posMsg.dgm_type;
        msg.posLocX = posMsg.pos_loc;
      }
      let timer = null;
      let that = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        that.$emit("loadingImg", true);
      }, 500); // 300毫秒内响应不显示
      this.$getApi.getScatterDiagram(rd).then(res => {
        clearTimeout(timer);
        this.$emit("loadingImg", false);
        this.getData(res, rd);
      });
    },
    resize () {
      this.structure = Number(!this.structure)
    }
  },
  created () {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "scatter"
    });
  }
};
