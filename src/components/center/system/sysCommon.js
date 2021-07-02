import { getTime } from "utils/utils.js";
export default {
  name: "system",
  data () {
    const vm = window.vm;
    return {
      vm: vm,
      currentKey: "",
      chartData: {} /* 系统日志信息 */,
      head: [vm.$t('Common.order'), vm.$t('Common.time'), vm.$t('Alarm.EventDescription')],//"序号", "时间", "事件描述"
      searchkeyword: "", //搜索关键词
      searchData: {}, //复制chartData数据
      dgmInfo: {},/* 采集器信息 */
    };
  },
  watch: {
    "$store.state.systemMsg": {
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
    openChartList (key, state, delKey) {
      //处理图谱的实例显示或删除 //state 0:增加。1:切换，2:删除，3:删除+切换
      if (typeof key !== "string") return;
      if (state === 0 || state === 1) {
        this.currentKey = key;
        for (let k in this.chartData) {
          this.chartData[k].isShow = false;
        }
      }

      if (state == 0) {
        let [, , macId] = key.split("_");
        let t_root = this.$store.state.checkMsg.tree.t_root;
        let macName = this.$store.state.checkMsg.mac.mac_name || this.$store.state.checkMsg.mac.mac_me;
        let tId = this.$store.state.checkMsg.mac.t_id; //获取当前的组织ID
        let machineOpition = this.$store.state.mac[tId]; //获取该组织下面的所有机组
        //添加数据
        this.$set(this.chartData, key, {
          isShow: true,
          t_root,
          macId,
          macName,
          machineOpition,
          body: [],
          empty: {
            isShow: false,
            text: this.$t('Common.noDataText')//"无数据"
          }
        });
        /* 默认请求 */
        let requestData = {
          machineId: macId,
          startTime: this.$store.state.srcParams.time.start,
          endTime: this.$store.state.srcParams.time.end,
          t_root: t_root,
        };
        this.getData(requestData, this.chartData[this.currentKey]);
        this.initData();
        /* 打开新图谱的时候先打开搜索栏 */
      } else if (state == 1) {
        //切换
        this.chartData[key].isShow = true;
        this.initData();
      } else if (state == 2) {
        //删除
        delete this.chartData[key];
      }
    },

    // 数据导出
    dataExport () {
      let data = this.chartData[this.currentKey];
      let fields = [vm.$t('Common.order'), vm.$t('Common.time'), vm.$t('Alarm.EventDescription')];//"序号", "时间", "事件描述"
      let body = [];
      if (vm.$t('Common.order') == '序号') {
        for (let i = 0; i < data.body.length; i++) {
          body.push({
            序号: i + 1,
            时间: data.body[i].time,
            事件描述: data.body[i].event
          });
        }
      } else {
        for (let i = 0; i < data.body.length; i++) {
          body.push({
            'Serial Number': i + 1,
            'Time': data.body[i].time,
            'Event Description': data.body[i].event
          });
        }

      }

      var Parser = require("json2csv").Parser;
      let json2csvParser = new Parser({ fields });
      let csv = json2csvParser.parse(body);
      csv = "\ufeff" + csv;
      var aTag = document.createElement("a");
      var blob = new Blob([csv]);
      aTag.download = `${data.macName}${this.$t('HeaderEdge.secondLevel5_3')}.csv`;//系统日志
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
    },
    // 发送网络请求
    getData (requestData, store) {
      /* 加载动画 */
      this.$emit("loadingImg", true);
      /* 请求之前先清空 */
      store.body = [];
      this.$getApi.getServerMachineLog(requestData).then(res => {
        /* 关闭动画 */
        this.$emit("loadingImg", false);
        if (res) {
          const list = res.list;
          if (res.dgmInfo) {
            this.dgmInfo = res.dgmInfo;
          }
          if (list !== null && list.length > 0) {
            const l = list.length;
            const body = [];
            if (requestData.t_root != 4) {
              for (let i = 0; i < l; i++) {
                const value = list[i];
                if (store.t_root === 2 && value.code == 16) {
                  console.log('tms调试信息过滤')
                  continue;
                }
                body.push({
                  time: getTime(value.savetime_com),
                  date: value.savetime_com,
                  event:
                    store.t_root === 2
                      ? this.tmsSetEvent(value.code, list[i].dgm_id, list[i].info)
                      : this.setEvent(value.code, value.dgm_id, this.dgmInfo), // TMS的系统日志不一样
                  class:
                    store.t_root === 2
                      ? this.setTMSColort(value.code)
                      : this.setColor(value.code)
                });
              }
            } else {
              for (let i = 0; i < l; i++) {
                const value = list[i];
                body.push({
                  time: getTime(value.savetime_com),
                  date: value.savetime_com,
                  event: this.chemicalSetEvent(value.code, value.dgm_id), // TMS的系统日志不一样
                  class: value.code > 0 && value.code < 5010 ? 'alarm-text' : ''
                });
              }
            }
            store.body = body;
            store.empty.isShow = false;
          } else {
            store.body = [];
            store.empty.isShow = true;
          }
          this.initData();
        }
      });
    },
    // code转文字
    codeToStr (code) {
      const t_root = this.chartData[this.currentKey].t_root
      if (t_root != 4) {
        let tmpArr = [0, code];
        const common = [
          500,
          501,
          502,
          -2102,
          2102,
          2017,
          -2103,
          2103,
          -2104,
          2104,
          4100,
          -4100,
          4400,
          -4400,
          5000,
          5001,
          5002,
          5003,
          5006,
          5007,
          5010,
          5011,
          5018,
          5019,
          5020,
          5021,
          5022,
          5023,
          5024,
          5030,
          5031,
          5260,
          5261,
          5262,
          6000,
          6001,
          6002,
          2012,
          9000,
          9001,
          -9001,
          9002,
          -9002,
          9003,
          -9003,
          9004,
          9005,
          9006,
          9007,
          9008,
          -9008,
          9009,
          -9009,
          12100
        ];
        if (common.includes(code)) {
          tmpArr = this.setCode(code, code);
        } else {
          if (code >= 1000 && code <= 1099)
            tmpArr = this.setCode(code, 1000, 2, 2);
          else if (code <= -1000 && code >= -1099)
            tmpArr = this.setCode(code, -2100, 3, 2);
          else if (code >= 1100 && code <= 1199)
            tmpArr = this.setCode(code, 1100, 2, 2);
          else if (code <= -1100 && code >= -1199)
            tmpArr = this.setCode(code, -1100, 3, 2);
          else if (code >= 2100 && code <= 2199)
            tmpArr = this.setCode(code, 2100, 2, 2);
          else if (code <= -2100 && code >= -2199)
            tmpArr = this.setCode(code, -2100, 3, 2);
          else if (code >= 2200 && code <= 2299)
            tmpArr = this.setCode(code, 2100, 2, 2);
          else if (code <= -2200 && code >= -2299)
            tmpArr = this.setCode(code, 2100, 3, 2);
          else if (code >= 2300 && code <= 2399)
            tmpArr = this.setCode(code, 2300, 2, 2);
          else if (code <= -2300 && code >= -2399)
            tmpArr = this.setCode(code, -2300, 3, 2);
          else if (code >= 2400 && code <= 2499)
            tmpArr = this.setCode(code, 2400, 2, 2);
          else if (code <= -2400 && code >= -2499)
            tmpArr = this.setCode(code, -2400, 3, 2);
          else if (code >= 2500 && code <= 2599)
            tmpArr = this.setCode(code, 2500, 2, 2);
          else if (code <= -2500 && code >= -2599)
            tmpArr = this.setCode(code, -2500, 3, 2);
          else if (code >= 3100 && code <= 3199)
            tmpArr = this.setCode(code, 3100, 2, 2);
          else if (code <= -3100 && code >= -3199)
            tmpArr = this.setCode(code, -3100, 3, 2);
          else if (code >= 3200 && code <= 3249)
            tmpArr = this.setCode(code, 3200, 2, 2);
          else if (code <= -3200 && code >= -3249)
            tmpArr = this.setCode(code, -3200, 3, 2);
          else if (code >= 3250 && code <= 3299)
            tmpArr = this.setCode(code, 3250, 2, 2);
          else if (code <= -3250 && code >= -3299)
            tmpArr = this.setCode(code, -3250, 3, 2);
          else if (code >= 3300 && code <= 3399)
            tmpArr = this.setCode(code, 3300, 2, 2);
          else if (code <= -3300 && code >= -3399)
            tmpArr = this.setCode(code, -3300, 3, 2);
          else if (code >= 3400 && code <= 3499)
            tmpArr = this.setCode(code, 3400, 2, 2);
          else if (code <= -3400 && code >= -3499)
            tmpArr = this.setCode(code, -3400, 3, 2);
          else if (code >= 3500 && code <= 3599)
            tmpArr = this.setCode(code, 3500, 2, 2);
          else if (code <= -3500 && code >= -3599)
            tmpArr = this.setCode(code, -3500, 3, 2);
          else if (code >= 3600 && code <= 3699)
            tmpArr = this.setCode(code, 3600, 2, 2);
          else if (code <= -3600 && code >= -3699)
            tmpArr = this.setCode(code, -3600, 3, 2);
          else if (code >= 3700 && code <= 3799)
            tmpArr = this.setCode(code, 3700, 2, 2);
          else if (code <= -3700 && code >= -3799)
            tmpArr = this.setCode(code, -3700, 3, 2);
          else if (code >= 3800 && code <= 3899)
            tmpArr = this.setCode(code, 3800, 2, 2);
          else if (code <= -3800 && code >= -3899)
            tmpArr = this.setCode(code, -3800, 3, 2);
          else if (code >= 3900 && code <= 3999)
            tmpArr = this.setCode(code, 3900, 2, 2);
          else if (code <= -3900 && code >= -3999)
            tmpArr = this.setCode(code, -3900, 3, 2);
          else if (code >= 4000 && code <= 4099)
            tmpArr = this.setCode(code, 4000, 2, 2);
          else if (code <= -4100 && code >= -4199)
            tmpArr = this.setCode(code, -4100);
          else if (code >= 4200 && code <= 4299)
            tmpArr = this.setCode(code, 4200, 2, 2);
          else if (code <= -4200 && code >= -4299)
            tmpArr = this.setCode(code, -4200, 3, 2);
          else if (code >= 4300 && code <= 4399)
            tmpArr = this.setCode(code, 4300, 2, 2);
          else if (code <= -4300 && code >= -4399)
            tmpArr = this.setCode(code, -4300, 3, 2);
          else if (code <= -4400 && code >= -4499)
            tmpArr = this.setCode(code, -4400);
          else if (code >= 5100 && code <= 5199)
            tmpArr = this.setCode(code, 5100, 2, 2);
          else if (code >= 5300 && code <= 5399)
            tmpArr = this.setCode(code, 5300, 2, 2);
          else if (code >= -5399 && code <= -5300)
            tmpArr = this.setCode(code, -5300, 3, 2);
          else if (code >= 5800 && code <= 5899)
            tmpArr = this.setCode(code, 5800, 2, 2);
          else if (code >= 5900 && code <= 5999)
            tmpArr = this.setCode(code, 5900, 2, 2);
          else if (code >= 6100 && code <= 6999)
            tmpArr = this.setCode(code, 6100, 1, 3);
          else if (code >= 7000 && code <= 7499)
            tmpArr = this.setCode(code, 7100, 1, 3);
          else if (code >= 7500 && code <= 7999)
            tmpArr = this.setCode(code - 500, 7500, 1, 3);
          else if (code >= 8000 && code <= 8015)
            tmpArr = this.setCode(code, 8000, 2, 2);
          else if (code >= 8016 && code <= 8031)
            tmpArr = this.setCode(code, 8016, 2, 2);
          else if (code >= 8032 && code <= 8039)
            tmpArr = this.setCode(code, 8032, 2, 2);
          else if (code >= 8100 && code <= 8199)
            tmpArr = this.setCode(code, 8100, 2, 2);
          else if (code >= 8200 && code <= 8299)
            tmpArr = this.setCode(code, 8200, 2, 2);
          else if (code >= 9008 && code <= 9008)
            tmpArr = this.setCode(code, 9008, 2, 2);
          else if (code <= -9008 && code >= -9008)
            tmpArr = this.setCode(code, -9008, 3, 2);
          else if (code >= 9009 && code <= 9010)
            tmpArr = this.setCode(code, 9009, 2, 2);
          else if (code <= -9009 && code >= -9009)
            tmpArr = this.setCode(code, -9009, 3, 2);
          else if (code >= 10000 && code <= 11599)
            tmpArr = this.setCode(code, 10000, 3, 2, 2, 1);
          else if (code >= 11600 && code <= 13099)
            tmpArr = this.setCode(code, 11600, 3, 2, 2, 1);
          else if (code >= 13200 && code <= 13999)
            tmpArr = this.setCode(code, 13200, 3, 2, 2, 1);
          else if (code >= 14000 && code <= 14999)
            tmpArr = this.setCode(code, 14000, 3, 2, 2, 1);
          else if (code <= -14000 && code >= -14999)
            tmpArr = this.setCode(code, -14000, 4, 2, 3, 1);
          else if (code >= 15000 && code <= 15999)
            tmpArr = this.setCode(code, 15000, 3, 2, 2, 1);
          else if (code <= -15000 && code >= -15999)
            tmpArr = this.setCode(code, -15000, 4, 2, 3, 1);
          else if (code >= 26000 && code <= 27999)
            tmpArr = this.setCode(code, 26000, 2, 3);
        }
        return tmpArr;
      } else {
        let tmpArr = [0, code];
        switch (code) {
          case 4100:
          case -4100:
          case 4400:
          case -4400:
          case 5010:
          case 5011:
          case 6002:
            tmpArr = this.subCode(code, code);
            break;
          default:
            if (code >= 2100 && code <= 2199)
              tmpArr = this.subCode(code, 2100, 2, 2);
            if (code <= -2100 && code >= -2199)
              tmpArr = this.subCode(code, -2100, 3, 2);
            if (code >= 2200 && code <= 2299)
              tmpArr = this.subCode(code, 2100, 2, 2);
            if (code <= -2200 && code >= -2299)
              tmpArr = this.subCode(code, 2100, 3, 2);
            if (code >= 2300 && code <= 2399)
              tmpArr = this.subCode(code, 2300, 2, 2);
            if (code <= -2300 && code >= -2399)
              tmpArr = this.subCode(code, -2300, 3, 2);
            if (code >= 2400 && code <= 2499)
              tmpArr = this.subCode(code, 2400, 2, 2);
            if (code <= -2400 && code >= -2499)
              tmpArr = this.subCode(code, -2400, 3, 2);
            if (code >= 2500 && code <= 2599)
              tmpArr = this.subCode(code, 2500, 2, 2);
            if (code <= -2500 && code >= -2599)
              tmpArr = this.subCode(code, -2500, 3, 2);
            if (code >= 3100 && code <= 3199)
              tmpArr = this.subCode(code, 3100, 2, 2);
            if (code <= -3100 && code >= -3199)
              tmpArr = this.subCode(code, -3100, 3, 2);
            if (code >= 3200 && code <= 3299)
              tmpArr = this.subCode(code, 3200, 2, 2);
            if (code >= 5700 && code <= 5799)
              tmpArr = this.subCode(code, 5700, 2, 2);
            if (code >= 5900 && code <= 5999)
              tmpArr = this.subCode(code, 5900, 2, 2);
            if (code >= 6100 && code <= 6999)
              tmpArr = this.subCode(code, 6100, 1, 3);
            tmpArr = this.subCode(code, 7100, 1, 3);
            if (code >= 8000 && code <= 8015)
              tmpArr = this.subCode(code, 8000, 2, 2);
            if (code >= 8016 && code <= 8031)
              tmpArr = this.subCode(code, 8016, 2, 2);
            if (code >= 8032 && code <= 8039)
              tmpArr = this.subCode(code, 8032, 2, 2);
            if (code >= 8100 && code <= 8199)
              tmpArr = this.subCode(code, 8100, 2, 2);
            if (code >= 8200 && code <= 8299)
              tmpArr = this.subCode(code, 8200, 2, 2);
            break;
        }
        return tmpArr;
      }

    },
    // 8000转
    subCode (code, returnCode, startIndex = 0, len = 0, secondIndex = 0, secondLen = 0, relateNum = 0) {
      let tmpArr = [];
      tmpArr.push(returnCode);
      tmpArr.push(code.toString().substr(startIndex, len));
      tmpArr.push(code.toString().substr(secondIndex, secondLen));
      tmpArr.push(relateNum);
      return tmpArr;
    },
    // code对应事件描述
    getEvent (code, m, n, dgmId) {
      if (code === 0) {
        console.log("code为" + code + "");
      }
      let dgmType = this.dgmInfo[dgmId]
      const codeObj = {
        "500": this.$t('system.event500'),//采集器要设置等待超时
        "501": this.$t('system.event501'),//采集器发送空闲等待超时
        "502": this.$t('system.event502'),//采集器倾角要数据超时
        "1000": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.SelfCheckAbnormal')}`,//采集器振动通道  自检异常
        "-1000": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.SelfCheckNormal')}`,//采集器振动通道  自检正常
        "1100": `${this.$t('system.CollectorTime')}${m}${dgmType == 3 ? this.getTempChNum(m) : ''}${this.$t('system.SelfCheckAbnormal')}`,//采集器温度通道  自检异常
        "-1100": `${this.$t('system.CollectorTime')}${m}${dgmType == 3 ? this.getTempChNum(m) : ''}${this.$t('system.SelfCheckNormal')}`,//采集器温度通道  自检正常
        "2012": this.$t('system.event2012'),//与远程服务器网络通讯异常
        "2017": this.$t('system.event2017'),//服务器硬盘空间不足
        "2100": `${this.$t('system.CollectorSerialPort')}${m}RS232 ${this.$t('system.InitializationError')}`,//采集器串口 初始化错误
        "0": "未描述",//未描述
        "-2100": `${this.$t('system.CollectorSerialPort')}${m}RS232 ${this.$t('system.InitializationToNormal')}`,//采集器串口  初始化恢复正常
        "2103": this.$t('system.event2103'),//倾覆设备已拔出
        "-2103": this.$t('system.event_2103'),//倾覆设备已接入
        "2104": this.$t('system.event2104'),//倾覆设备运行不正常
        "-2104": this.$t('system.event_2104'),//倾覆设备运行恢复正常
        "2200": `${this.$t('system.CollectorKeyPhase')}${m}${this.$t('system.speedWrong')}`,//采集器键相 采集的转速错误
        "-2200": `${this.$t('system.CollectorKeyPhase')}${m}${this.$t('system.speedToNormal')}`,//采集器键相  采集的转速恢复正常
        "-2102": this.$t('system.event_2102'),//采集器硬件程序设置成功
        "2102": this.$t('system.event2102'),//采集器硬件程序设置失败
        "2300": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.LowFreqError')}`,//采集器转速通道  采集低频信号错误
        "-2300": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.LowFreqToNormal')}`,//采集器转速通道  采集低频信号恢复正常
        "2400": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.HighFreqError')}`,//采集器转速通道  采集高频信号错误
        "-2400": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.HighFreqToNormal')}`,//采集器转速通道  采集高频信号恢复正常
        "2500": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.speed1_5max')}`,//采集器转速通道  转速超过最高转速的1.5倍
        "-2500": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.speedMaxToNormal')}`,//采集器转速通道  转速超过最高转速1.5倍恢复正常
        "3000": this.$t('system.event3000'),//采集器FPGA自检失败
        "-3000": this.$t('system.event_3000'),//采集器FPGA自检正常
        "3001": this.$t('system.event3001'),//采集器SRAM自检失败
        "-3001": this.$t('system.event_3001'),//采集器SRAM自检正常
        "3100": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.GAPNotNormal')}`,//采集器转速通道  的GAP电压不在正常范围
        "-3100": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.GAPToNormal')}`,//采集器转速通道  的GAP电压恢复到正常范围
        "3200": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.GAPNotNormal')}`,//采集器振动通道  的GAP电压不在正常范围
        "-3200": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.GAPToNormal')}`,//采集器振动通道  的GAP电压恢复到正常范围
        "3250": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.SensorCableFault')}`,//采集器振动通道  传感器电缆故障
        "-3250": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.SensorCableToNormal')}`,//采集器振动通道  传感器电缆故障恢复
        "3300": `${this.$t('system.CollectorProcessQuantity')}${m}${this.$t('system.ValueNotNormal')}`,//采集器过程量通道  的值不在正常范围
        "-3300": `${this.$t('system.CollectorProcessQuantity')}${m}${this.$t('system.ValueToNormal')}`,//采集器过程量通道
        "3400": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.noSignal')}`,//采集器转速通道  没有信号
        "-3400": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.BackToSignal')}`,//采集器转速通道  恢复到有信号
        "3500": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.SelfTestfailed')}`,//采集器转速通道  自检失败
        "-3500": `${this.$t('system.CollectorSpeed')}${m}${this.$t('system.SelfCheckNormal')}`,//采集器转速通道  自检正常
        "3600": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.FreqSelfTestfailed')}`,//采集器振动通道 频率自检失败
        "-3600": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.FreqSelfTestnormal')}`,//采集器振动通道  频率自检正常
        "3700": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.CircuitBreak')}`,//采集器振动通道  线路断路
        "-3700": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.LineNormal')}`,//采集器振动通道  线路正常
        "3800": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.SensorSelfTestFailed')}`,//采集器振动通道  传感器自检失败
        "-3800": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.SensorSelfTestNormal')}`,//采集器振动通道  传感器自检正常
        "3900": `${this.$t('system.CollectorTime')}${m}${dgmType == 3 ? this.getTempChNum(m) : ''}${this.$t('system.BiasSelfTestFailed')}`,//采集器温度通道  偏置自检失败
        "-3900": `${this.$t('system.CollectorTime')}${m}${dgmType == 3 ? this.getTempChNum(m) : ''}${this.$t('system.BiasSelfTestNormal')}`,//采集器温度通道  偏置自检正常
        "4000": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.ShortCircuit')}`,//采集器振动通道  线路短路
        "4100": this.$t('system.event4100'),//采集器TCP/IP通讯错误
        "-4100": this.$t('system.event_4100'),//采集器TCP/IP通讯恢复正常
        "4200": `${this.$t('system.CollectorSerialPort')}${m}${this.$t('system.CRCError')}`,//采集器串口  通讯CRC效验错
        "-4200": `${this.$t('system.CollectorSerialPort')}${m}${this.$t('system.CRCToNormal')}`,//采集器串口  通讯CRC效验恢复正常
        "4300": `${this.$t('system.CollectorSerialPort')}${m}${this.$t('system.CommunicateTimeout')}`,//采集器串口  通讯超时
        "-4300": `${this.$t('system.CollectorSerialPort')}${m}${this.$t('system.CommunicateToNormal')}`,//采集器串口 通讯从超时恢复
        "4400": this.$t('system.event4400'),//采集器TCP/IP通讯超时
        "-4400": this.$t('system.event_4400'),//采集器TCP/IP通讯从超时恢复
        "5000": this.$t('system.event5000'),//采集器重新启动
        "5001": this.$t('system.event5001'),//采集器设置已经被修改
        "5002": this.$t('system.event5002'),//采集器设置错误
        "5003": this.$t('system.event5003'),//采集器硬件接触异常
        "5006": this.$t('system.event5006'),//采集器软启动
        "5007": this.$t('system.event5007'),//采集器rtclient软启动
        "5010": this.$t('system.event5010'),//采集器main软启动
        "5011": this.$t('system.event5011'),//采集器main子进程软启动
        "5018": this.$t('system.event5018'),//采集器serial软启动
        "5019": this.$t('system.event5019'),//采集器串口二的serial软启动
        "5020": this.$t('system.event5020'),//采集器client软启动
        "5021": this.$t('system.event5007'),//采集器rtclient软启动
        "5022": this.$t('system.event5022'),//采集器hd软启动
        "5030": this.$t('system.collectorSelfTestCheck'),//采集器自检开始
        "5031": this.$t('system.collectorSelfTestEnd'),//采集器自检结束
        "5100": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.subLearning')}`,//采集器振动通道  ，进行了灵敏监测子学习
        "5260": this.$t('system.event5260'),//采集器接入
        "5261": this.$t('system.event5261'),//采集器断开
        "5262": this.$t('system.event5262'),//采集器请求超时
        "5300": `${this.$t('system.Collector')}${m}${this.$t('system.switchBoard')}`,//采集器 号切换板心跳包
        "-5300": `${this.$t('system.Collector')}${m}${this.$t('system.switchBoardFail')}`,//采集器  切换板心跳包失败
        "5800": `${this.$t('system.CollectorVibSignal')}${m}${this.$t('system.subLearning')}`,//采集器振动信号  ，进行了灵敏监测子学习
        "5900": `${this.$t('system.event5900')}${m}`,//采集器的软件修正版本号
        "6000": this.$t('system.event6000'),//采集器的软件版本更新
        "6001": this.$t('system.event6001'),//采集器的硬件程序升级成功
        "6002": this.$t('system.event6002'),//采集器的硬件程序升级失败
        "6100": `${this.$t('system.event6100')}${m}`,//采集器的软件版本号
        "7100": `${this.$t('system.event7100')}${m}`,//采集器的硬件程序版本号
        "7500": `${this.$t('system.event7500')}${m}`,//采集器的硬件AB版本号
        "8000": `${this.$t('system.event8000')}(ID=${m})${this.$t('system.Waveform')}`,//采集器手工采集某个通道  的波形
        "8016": `${this.$t('system.event8016')}(ID=${m})${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.Waveform')}`, //采集器手工采集某个振动通道  的波形
        "8032": `${this.$t('system.event8032')}(ID=${m})${this.$t('system.Waveform')}`,//采集器手工采集某个键相  的波形
        "8100": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.TriggerBlackBox')}`,//采集器振动通道  触发黑盒子存储
        "8200": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}}${this.$t('system.RemoveBurrs')}`,//采集器振动通道  剔除毛刺
        "9000": this.$t('system.event9000'),//采集器同步时间
        "9001": this.$t('system.event9001'),//采集器继电器1处于断开报警状态
        "-9001": this.$t('system.event_9001'),//采集器继电器1处于正常闭合状态
        "9002": this.$t('system.event9002'),//采集器继电器2处于断开报警状态
        "-9002": this.$t('system.event_9002'),//采集器继电器2处于正常闭合状态
        "9003": this.$t('system.event9003'),//采集器振动通道报警灯处于红色报警状态
        "-9003": this.$t('system.event_9003'),//采集器振动通道报警灯处于关闭状态
        "9004": this.$t('system.event9004'),//采集器状态运行灯处于灰色正常状态
        "9005": this.$t('system.event9005'),//采集器状态运行灯处于红色报警状态
        "9006": this.$t('system.event9006'),//采集器状态运行灯处于黄色报警状态
        "9007": this.$t('system.event9007'),//采集器按键清除报警
        "9008": `${this.$t('system.CollectorChannel')}${m}${this.$t('system.sensorOrCableAbnormal')}`,//采集器通道  传感器或线缆出现异常
        "-9008": `${this.$t('system.CollectorChannel')}${m}${this.$t('system.sensorOrCableNormal')}`,//采集器通道  传感器或线缆正常
        "9009": `${this.$t('system.CollectorChannel')}${m}${this.$t('system.sensorOrCableAbnormal')}`,//采集器通道  传感器或线缆出现异常
        "-9009": `${this.$t('system.CollectorChannel')}${m}${this.$t('system.sensorOrCableNormal')}`,//采集器通道  传感器或线缆正常
        "10000": `${this.$t('system.event10000')}(ID=${m})${this.$t('system.Waveform')}${n}${this.$t('system.minute')}`,//采集器手工连续采集某个通道  的波形  分钟
        "11600": `${this.$t('system.event11600')}(ID=${m})${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.Waveform')}${n}${this.$t('system.minute')}`,//采集器手工连续采集某个振动通道  的波形  分钟
        "12100": this.$t('system.event12100'),//采集器塔顶单方向峰值角度超过0.5度
        "13200": `${this.$t('system.event13200')}(ID=${m})${this.$t('system.Waveform')}${n}${this.$t('system.minute')}`,//采集器手工连续采集某个键相  的波形  分钟
        "14000": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.Range')}${n}${this.$t('system.SelfTestFailed')}`,//采集器振动通道  量程  自检失败
        "-14000": `${this.$t('system.CollectorVib')}${m}${dgmType == 3 ? this.getVibChNum(m) : ''}${this.$t('system.Range')}${n}${this.$t('system.SelfCheckNormal')}`,//采集器振动通道  量程  自检正常
        "15000": `${this.$t('system.CollectorTime')}${m}${dgmType == 3 ? this.getTempChNum(m) : ''}${this.$t('system.Range')}${n}${this.$t('system.SelfTestFailed')}`,//采集器温度通道  量程  自检失败
        "-15000": `${this.$t('system.CollectorTime')}${m}${dgmType == 3 ? this.getTempChNum(m) : ''}${this.$t('system.Range')}${n}${this.$t('system.SelfCheckNormal')}`,//采集器温度通道  量程  自检正常
        "26000": `${this.$t('system.CollectorBolt')}${m}${this.$t('system.RequestTimedOut')}`//采集器螺栓通道  请求超时
      };
      return codeObj[code];
    },
    // 8000 code对应事件描述
    chemicalgetEvent (code, m, n) {
      const codeObj = {
        "2100": `${this.$t('system.chemicalEvent2100')}（${this.$t('system.SerialPort')}${m + 1}）`,//RS232初始化错误  串口
        "-2100": `${this.$t('system.chemicalEvent_2100')}（${this.$t('system.SerialPort')}${m + 1}）`,//RS232初始化正常  串口
        "2200": `${this.$t('system.chemicalEvent2200')}（${this.$t('system.BondPhase')}${m}）`,//采集的转速错误  键相
        "-2200": `${this.$t('system.chemicalEvent_2200')}（${this.$t('system.BondPhase')}${m}）`,//采集的转速正常  键相
        "2300": `${this.$t('system.chemicalEvent2300')}（${this.$t('system.BondPhase')}${m}）`,//采集慢变信号错误  键相
        "-2300": `${this.$t('system.chemicalEvent_2300')}（${this.$t('system.BondPhase')}${m}）`,//采集慢变信号正常  键相
        "2400": `${this.$t('system.chemicalEvent2400')}（${this.$t('system.BondPhase')}${m}）`,//采集快变信号错误  键相
        "-2400": `${this.$t('system.chemicalEvent_2400')}（${this.$t('system.BondPhase')}${m}）`,//采集快变信号正常  键相
        "2400": `${this.$t('system.speed1_5max')}（${this.$t('system.BondPhase')}${m}）`,//转速超过最高转速的1.5倍  键相
        "-2400": `${this.$t('system.NormalSpeed')}（${this.$t('system.BondPhase')}${m}）`,//转速正常  键相
        "2400": `${this.$t('system.GAPkeyPhaseNotNormal')}，${this.$t('system.invalid')}（${this.$t('system.BondPhase')}${m}）`,//键相信号的GAP电压不在正常范围  无效  键相
        "-2400": `${this.$t('system.GAPkeyPhaseNormal')}，${this.$t('system.effective')}（${this.$t('system.BondPhase')}${m}）`,//键相信号的GAP电压正常范围  有效  键相
        "3200": `${this.$t('system.GAPvibNotNormal')}，${this.$t('system.invalid')}（${this.$t('system.invalid')}${m}）`,//振动信号的GAP电压不在正常范围  无效  无效
        "4100": this.$t('system.event4100'),//采集器TCP/IP通讯错误
        "-4100": this.$t('system.event_4100'),//采集器TCP/IP通讯恢复正常
        "5010": this.$t('system.DAURestarts'),//DAU重新启动
        "5011": this.$t('system.DAUChangeSet'),//DAU设置已经被修改
        // 
        "5700": `${this.$t('system.DAUsynchronousVersion')}，${m}`,//DAU程序的同步版本号为
        "5900": `${this.$t('system.DAUrevisedVersion')}${m}`,//DAU程序的修正版本号
        "6002": this.$t('system.chemicalEvent6002'),//DAU硬件版本号3.0
        "6100": `${this.$t('system.chemicalEvent6100')}${m}`,//DAU软件版本号
        "7100": `${this.$t('system.chemicalEvent7100')}${m}`,//硬件程序大版本号
        "8000": `${this.$t('system.chemicalEvent7100')}${m}`,//硬件程序大版本号
      };
      return codeObj[code] ? codeObj[code] : this.$t('system.UnknownLog');//未知日志
    },
    /** * 丝印 @chId 振动通道 */
    getVibChNum (ch_id) {
      var tempStr = '';
      var tempNum = Number(ch_id - 1);
      var tValue = '';
      if (tempNum < 8) {
        tValue = (tempNum + 8) * 2 + 1;
        tempStr = "A" + tValue;
      } else if (tempNum < 16) {
        tValue = (tempNum - 8) * 2 + 1;
        if (tValue < 10) {
          tempStr = "A0" + tValue;
        } else {
          tempStr = "A" + tValue;
        }
      } else if (tempNum < 24) {
        tValue = (tempNum - 8) * 2 + 2;
        tempStr = "A" + tValue;
      } else if (tempNum < 32) {
        tValue = (tempNum - 24) * 2 + 2;
        if (tValue < 10) {
          tempStr = "A0" + tValue;
        } else {
          tempStr = "A" + tValue;
        }
      } else if (tempNum < 36) {
        tValue = tempNum - 32 + 1;
        tempStr = "IN" + tValue;
      }

      return '(' + tempStr + ')';
    },

    /** * 丝印 @chId 温度通道 */
    getTempChNum (ch_id) {

      var tempStr = '';
      var tempNum = Number(ch_id - 1);
      var tValue = "";
      if (tempNum < 8) {
        tValue = (tempNum + 8) * 2 + 2;
        tempStr = "A" + tValue;
      }
      else if (tempNum < 16) {
        tValue = (tempNum - 8) * 2 + 2;
        if (tValue < 10) {
          tempStr = "A0" + tValue;
        }
        else {
          tempStr = "A" + tValue;
        }
      }
      return '(' + tempStr + ')';
    },
    //TMS的事件描述
    tmsSetEvent (code, dgm_id, info) {
      code = String(code);
      info = JSON.parse(info);
      let codeObj = {
        "0": this.$t('system.NotDescribed'),//未描述
        "1": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.Reboot')}`,//列车  下的前置  重启
        "2": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.Host')}（id=${info.sub_id}）${this.$t('system.Reboot')}`,//列车  下的主机  重启
        "3": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.SelfCheckPassed')}`,//列车  下的前置  自检通过
        "4": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.Host')}（id=${info.sub_id}）${this.$t('system.SelfCheckPassed')}`,//列车  下的主机  自检通过
        "5": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.PreSelfTestFailed')}`,//列车  下的前置  前置自检失败
        "6": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.Host')}（id=${info.sub_id}）${this.$t('system.SelfTestFailed')}`,//列车  下的主机  自检失败
        "7": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.VibChannel')}${info.index1 + 1}${this.$t('system.SensorcableSelfTestFailed')}，${this.$t('system.VoltageValue')}：${info.value1}V`,//列车  下的前置  振动通道  传感器线缆自检失败  电压值
        "8": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.VibChannel')}${info.index1 + 1}${this.$t('system.SensorSelfTestFailed')}，${this.$t('system.VoltageValue')}：${info.value1}V`,//列车  下的前置  振动通道  传感器自检失败  电压值
        "9": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.TempChannel')}${info.index1 + 1}${this.$t('system.SensorSelfTestFailed')}，${this.$t('system.VoltageValue')}：${info.value1}V`,//列车  下的前置  温度通道  传感器自检失败  电压值
        "10": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.VibChannel')}${info.index1 + 1}${this.$t('system.VibSignalSelfTestFailed')}`,//列车  下的前置  振动通道  振动信号自检失败
        "11": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.updatesuccessed')}`,//列车  下的前置  升级成功
        "12": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.Host')}（id=${info.sub_id}）${this.$t('system.updatesuccessed')}`,//列车  下的主机  升级成功
        "13": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.TempSelfTestPassed')}`,//列车  下的前置  温度通道自检通过
        "14": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.front')}（id=${info.sub_id}）${this.$t('system.VibSelfTestPassed')}`,//列车  下的前置  振动通道自检通过
        "15": `${this.$t('system.train')}（id=${dgm_id}）${this.$t('system.Host')}（id=${info.sub_id}）${this.$t('system.SDSelfTestFailed')}`,//列车  下的主机  SD卡自检失败
        "2017": this.$t('system.tmsEvent2017')//服务器硬盘空间不足
      };
      let text = codeObj[code] || "";
      return text;
    },
    chemicalSetEvent (code, dgm_id) {
      code = Number(code);
      const tmp = this.codeToStr(code);
      let m = tmp[1];
      const n = tmp[2];
      let str = this.chemicalgetEvent(tmp[0], m, n);
      return dgm_id + str;
    },
    // 事件描述
    setEvent (code, dgmId = "", dgmInfo) {
      const tmp = this.codeToStr(code);
      let m = tmp[1];
      const n = tmp[2];
      let str = this.getEvent(tmp[0], m, n, dgmId);
      let dgmtype;
      if (dgmId !== "") {
        //根据dgmID获取dgmtype
        for (let k in dgmInfo) {
          if (k == dgmId) {
            dgmtype = dgmInfo[k];
          }
        }
      }
      if (dgmtype !== 5) {
        //当dgmtype为5时，m不能+1
        if (str.indexOf(this.$t('system.channel')) >= 0) {
          m = Number(m) + 1;
          str = this.getEvent(tmp[0], m, n, dgmId);
        }
      } else {
        if (str.indexOf(this.$t('system.channel')) >= 0) {
          m = Number(m);
          str = this.getEvent(tmp[0], m, n, dgmId);
        }
      }
      return dgmId + str;
    },
    /**
     * 根据code 格式化数组，包含code，和截取的数字
     * @code	code
     * @returnCode	返回码
     * @startIndex	第1个替换的截取字符的开始位置
     * @len	截取字符长度
     * @secondIndex 第2个替换的截取字符的开始位置
     * @secondLen 第2个截取字符长度
     * */
    setCode (
      code,
      returnCode,
      startIndex = 0,
      len = 0,
      secondIndex = 0,
      secondLen = 0
    ) {
      const tmpArr = [];
      tmpArr.push(returnCode);
      let tmpCode1 = Number(code.toString().substr(startIndex, len));
      if (Math.abs(code) >= 3250 && Math.abs(code) <= 3299) {
        tmpCode1 -= 50;
      }
      if (Math.abs(code) >= 26000 && Math.abs(code) <= 27999) {
        tmpCode1 = code - 26000;
      }
      tmpArr.push(tmpCode1);
      tmpArr.push(code.toString().substr(secondIndex, secondLen));
      return tmpArr;
    },
    search () {
      this.initData();
      let search = this.searchkeyword;
      let data = this.searchData[this.currentKey].body;
      let searchFiled = {
        event: data.event
      };
      this.searchData[this.currentKey].body = data.filter(data => {
        return Object.keys(searchFiled).some(key => {
          return (
            String(data[key])
              .toLowerCase()
              .indexOf(search) > -1
          );
        });
      });
    },
    //深拷贝
    initData () {
      this.searchData = JSON.parse(JSON.stringify(this.chartData));
      let chartData = this.chartData[this.currentKey];
      this.searchData[this.currentKey].body = [];
      this.searchData[this.currentKey].machineOpition = [];
      // this.searchData[this.currentKey].body = chartData.body.concat();
      for (let i = 0; i < chartData.body.length; i++) {
        this.searchData[this.currentKey].body.push(chartData.body[i]);
      }
      for (let i = 0; i < chartData.machineOpition.length; i++) {
        this.searchData[this.currentKey].machineOpition.push(
          chartData.machineOpition[i]
        );
      }
    },
    /* 设置TMS颜色 */
    setTMSColort (code) {
      let alarmCode = [5, 6, 7, 8, 9, 10, 15];
      if (alarmCode.includes(code)) {
        return "alarm-text";
      } else {
        return "";
      }
    },
    // 根据code设置颜色
    setColor (code) {
      if (code <= -14000) return "blue-text";
      else if (code >= -4999 && code < 0) return "blue-text";
      else if (code > 0 && code <= 4999) return "alarm-text";
      else if (code >= 14000) return "alarm-text";
      else return "";
    },
    // 数据检索
    dataRetrieval () {
      let data = this.chartData[this.currentKey];
      this.$retrieval({
        key: "system",
        params: {
          macName: data.macName,
          macId: data.macId,
          machineOpition: data.machineOpition
        }
      }).then(res => {
        if (res) {
          data.macName = res.macName;
          data.macId = res.macId;
          this.getData(
            {
              machineId: res.macId,
              startTime: res.startTime,
              endTime: res.endTime,
              t_root: data.t_root
            },
            data
          );
          // this.initData();
        }
      });
    }
  },
  created () {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "system"
    });
  }
};
