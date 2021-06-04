import { getTime } from "utils/utils.js";
export default {
  name: "system",
  data () {
    return {
      currentKey: "",
      chartData: {} /* 系统日志信息 */,
      head: ["序号", "时间", "事件描述"],
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
            text: "无数据"
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
      let fields = ["序号", "时间", "操作描述"];
      let body = [];
      for (let i = 0; i < data.body.length; i++) {
        body.push({
          序号: i + 1,
          时间: data.body[i].time,
          操作描述: data.body[i].event
        });
      }
      var Parser = require("json2csv").Parser;
      let json2csvParser = new Parser({ fields });
      let csv = json2csvParser.parse(body);
      csv = "\ufeff" + csv;
      var aTag = document.createElement("a");
      var blob = new Blob([csv]);
      aTag.download = `${data.macName}系统日志.csv`;
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
        "500": "采集器要设置等待超时",
        "501": "采集器发送空闲等待超时",
        "502": "采集器倾角要数据超时",
        "1000": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}自检异常`,
        "-1000": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}自检正常`,
        "1100": `采集器温度通道${m}${dgmType == 3 ? this.getTempChNum(m) : ''}自检异常`,
        "-1100": `采集器温度通道${m}${dgmType == 3 ? this.getTempChNum(m) : ''}自检正常`,
        "2012": "与远程服务器网络通讯异常",
        "2017": "服务器硬盘空间不足",
        "2100": `采集器串口${m}RS232 初始化错误`,
        "0": "未描述",
        "-2100": `采集器串口${m}RS232 初始化恢复正常`,
        "2103": "倾覆设备已拔出",
        "-2103": "倾覆设备已接入",
        "2104": "倾覆设备运行不正常",
        "-2104": "倾覆设备运行恢复正常",
        "2200": `采集器键相${m}采集的转速错误`,
        "-2200": `采集器键相${m}采集的转速恢复正常`,
        "-2102": "采集器硬件程序设置成功",
        "2102": "采集器硬件程序设置失败",
        "2300": `采集器转速通道${m}采集低频信号错误`,
        "-2300": `采集器转速通道${m}采集低频信号恢复正常`,
        "2400": `采集器转速通道${m}采集高频信号错误`,
        "-2400": `采集器转速通道${m}采集高频信号恢复正常`,
        "2500": `采集器转速通道${m}转速超过最高转速的1.5倍`,
        "-2500": `采集器转速通道${m}转速超过最高转速1.5倍恢复正常`,
        "3000": "采集器FPGA自检失败",
        "-3000": "采集器FPGA自检正常",
        "3001": "采集器SRAM自检失败",
        "-3001": "采集器SRAM自检正常",
        "3100": `采集器转速通道${m}的GAP电压不在正常范围`,
        "-3100": `采集器转速通道${m}的GAP电压恢复到正常范围`,
        "3200": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}的GAP电压不在正常范围`,
        "-3200": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}的GAP电压恢复到正常范围`,
        "3250": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}传感器电缆故障`,
        "-3250": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}传感器电缆故障恢复`,
        "3300": `采集器过程量通道${m}的值不在正常范围`,
        "-3300": `采集器过程量通道${m}的值恢复到正常范围`,
        "3400": `采集器转速通道${m}没有信号`,
        "-3400": `采集器转速通道${m}恢复到有信号`,
        "3500": `采集器转速通道${m}自检失败`,
        "-3500": `采集器转速通道${m}自检正常`,
        "3600": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}频率自检失败`,
        "-3600": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}频率自检正常`,
        "3700": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}线路断路`,
        "-3700": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}线路正常`,
        "3800": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}传感器自检失败`,
        "-3800": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}传感器自检正常`,
        "3900": `采集器温度通道${m}${dgmType == 3 ? this.getTempChNum(m) : ''}偏置自检失败`,
        "-3900": `采集器温度通道${m}${dgmType == 3 ? this.getTempChNum(m) : ''}偏置自检正常`,
        "4000": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}线路短路`,
        "4100": "采集器TCP/IP通讯错误",
        "-4100": "采集器TCP/IP通讯恢复正常",
        "4200": `采集器串口${m}通讯CRC效验错`,
        "-4200": `采集器串口${m}通讯CRC效验恢复正常`,
        "4300": `采集器串口${m}通讯超时`,
        "-4300": `采集器串口${m}通讯从超时恢复`,
        "4400": "采集器TCP/IP通讯超时",
        "-4400": "采集器TCP/IP通讯从超时恢复",
        "5000": "采集器重新启动",
        "5001": "采集器设置已经被修改",
        "5002": "采集器设置错误",
        "5003": "采集器硬件接触异常",
        "5006": "采集器软启动",
        "5007": "采集器rtclient软启动",
        "5010": "采集器main软启动",
        "5011": "采集器main子进程软启动",
        "5018": "采集器serial软启动",
        "5019": "采集器串口二的serial软启动",
        "5020": "采集器client软启动",
        "5021": "采集器rtclient软启动",
        "5022": "采集器hd软启动",
        "5030": "采集器自检开始",
        "5031": "采集器自检结束",
        "5100": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}，进行了灵敏监测子学习`,
        "5260": "采集器接入",
        "5261": "采集器断开",
        "5262": "采集器请求超时",
        "5300": `采集器${m}号切换板心跳包`,
        "-5300": `采集器${m}号切换板心跳包失败`,
        "5800": `采集器振动信号${m}，进行了灵敏监测子学习`,
        "5900": `采集器的软件修正版本号${m}`,
        "6000": "采集器的软件版本更新",
        "6001": "采集器的硬件程序升级成功",
        "6002": "采集器的硬件程序升级失败",
        "6100": `采集器的软件版本号${m}`,
        "7100": `采集器的硬件程序版本号${m}`,
        "7500": `采集器的硬件AB版本号${m}`,
        "8000": `采集器手工采集某个通道(ID=${m})的波形`,
        "8016": `采集器手工采集某个振动通道(ID=${m})${dgmType == 3 ? this.getVibChNum(m) : ''}的波形`,
        "8032": `采集器手工采集某个键相(ID=${m})的波形`,
        "8100": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}触发黑盒子存储`,
        "8200": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}}剔除毛刺`,
        "9000": "采集器同步时间",
        "9001": "采集器继电器1处于断开报警状态",
        "-9001": "采集器继电器1处于正常闭合状态",
        "9002": "采集器继电器2处于断开报警状态",
        "-9002": "采集器继电器2处于正常闭合状态",
        "9003": "采集器振动通道报警灯处于红色报警状态",
        "-9003": "采集器振动通道报警灯处于关闭状态",
        "9004": "采集器状态运行灯处于灰色正常状态",
        "9005": "采集器状态运行灯处于红色报警状态",
        "9006": "采集器状态运行灯处于黄色报警状态",
        "9007": "采集器按键清除报警",
        "9008": `采集器通道${m}传感器或线缆出现异常`,
        "-9008": `采集器通道${m}传感器或线缆正常`,
        "9009": `采集器通道${m}传感器或线缆出现异常`,
        "-9009": `采集器通道${m}传感器或线缆正常`,
        "10000": `采集器手工连续采集某个通道(ID=${m})的波形${n}分钟`,
        "11600": `采集器手工连续采集某个振动通道(ID=${m})${dgmType == 3 ? this.getVibChNum(m) : ''}的波形${n}分钟`,
        "12100": "采集器塔顶单方向峰值角度超过0.5度",
        "13200": `采集器手工连续采集某个键相(ID=${m})的波形${n}分钟`,
        "14000": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}量程${n}自检失败`,
        "-14000": `采集器振动通道${m}${dgmType == 3 ? this.getVibChNum(m) : ''}量程${n}自检正常`,
        "15000": `采集器温度通道${m}${dgmType == 3 ? this.getTempChNum(m) : ''}量程${n}自检失败`,
        "-15000": `采集器温度通道${m}${dgmType == 3 ? this.getTempChNum(m) : ''}量程${n}自检正常`,
        "26000": `采集器螺栓通道${m}请求超时`
      };
      return codeObj[code];
    },
    // 8000 code对应事件描述
    chemicalgetEvent (code, m, n) {
      const codeObj = {
        "2100": `RS232初始化错误（串口${m + 1}）`,
        "-2100": `RS232初始化正常（串口${m + 1}）`,
        "2200": `采集的转速错误（键相${m}）`,
        "-2200": `采集的转速正常（键相${m}）`,
        "2300": `采集慢变信号错误（键相${m}）`,
        "-2300": `采集慢变信号正常（键相${m}）`,
        "2400": `采集快变信号错误（键相${m}）`,
        "-2400": `采集快变信号正常（键相${m}）`,
        "2400": `转速超过最高转速的1.5倍（键相${m}）`,
        "-2400": `转速正常（键相${m}）`,
        "2400": `键相信号的GAP电压不在正常范围，无效（键相${m}）`,
        "-2400": `键相信号的GAP电压正常范围，有效（键相${m}）`,
        "3200": `振动信号的GAP电压不在正常范围，无效（键相${m}）`,
        "4100": "采集器TCP/IP通讯错误",
        "-4100": "采集器TCP/IP通讯正常",
        "5010": "DAU重新启动",
        "5011": "DAU设置已经被修改",
        // 
        "5700": `DAU程序的同步版本号为${m}`,
        "5900": `DAU程序的修正版本号${m}`,
        "6002": 'DAU硬件版本号3.0',
        "6100": `DAU软件版本号${m}`,
        "7100": `硬件程序大版本号${m}`,
        "8000": `硬件程序大版本号${m}`,
      };
      return codeObj[code] ? codeObj[code] : '未知日志';
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
        "1": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）重启`,
        "2": `列车（id=${dgm_id}）下的主机（id=${info.sub_id}）重启`,
        "3": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）自检通过`,
        "4": `列车（id=${dgm_id}）下的主机（id=${info.sub_id}）自检通过`,
        "5": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）前置自检失败`,
        "6": `列车（id=${dgm_id}）下的主机（id=${info.sub_id}）自检失败`,
        "7": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）振动通道${info.index1 + 1}传感器线缆自检失败，电压值：${info.value1}V`,
        "8": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）振动通道${info.index1 + 1}传感器自检失败，电压值：${info.value1}V`,
        "9": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）温度通道${info.index1 + 1}传感器自检失败，电压值：${info.value1}V`,
        "10": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）振动通道${info.index1 + 1}振动信号自检失败`,
        "11": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）升级成功`,
        "12": `列车（id=${dgm_id}）下的主机（id=${info.sub_id}）升级成功`,
        "13": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）温度通道自检通过`,
        "14": `列车（id=${dgm_id}）下的前置（id=${info.sub_id}）振动通道自检通过`,
        "15": `列车（id=${dgm_id}）下的主机（id=${info.sub_id}）SD卡自检失败`,
        "2017": "服务器硬盘空间不足"
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
        if (str.indexOf("通道") >= 0) {
          m = Number(m) + 1;
          str = this.getEvent(tmp[0], m, n, dgmId);
        }
      } else {
        if (str.indexOf("通道") >= 0) {
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
