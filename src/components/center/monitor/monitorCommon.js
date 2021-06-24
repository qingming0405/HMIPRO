import { getUnit, round, cloneObj, setHead, defaultCode1, unitTransformation } from "utils/utils.js";

export default {
  name: "monitor",
  data () {
    return {
      total: 0,
      currentKey: "", //当前的图谱key
      chartData: {
        /*  key:{
            isShow: true, 每个组件
            msg:msg,
          posArr:[]//存放该机组下面所有测点
            retrievalParams:{ 检索带去的参数
              posChoose:Array[0] 选择的测点
              type:"pos" 类型 测点/机组
              value:Object //所有特征值
          },
          padding: { // 设置表头内边距
            'padding-right': '20px',
          },
            head:['测点名称', '特征值类型', '实时值', '最大值', '最小值', '平均值'],
            body:[
              name:测点名字
              d:[  每一条特征值
                {e: 特征值名称  real: max:  min: avg}
              ]
            ]
          } */
      },
      requestData: {} //请求带的参数
    };
  },
  watch: {
    "$store.state.monitorMsg": {
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
      let [, type, macId, ch_class] = key.split("_");
      const keyArr = Object.keys(this.chartData);
      if (state == 0) {
        let msg, posArr, macArr; //存放当前的机组或者测点的信息\ 所有测点信息
        if (type == "mac") {
          msg = cloneObj(this.$store.state.checkMsg.mac);
          macArr = cloneObj(this.$store.state.mac[msg.t_id])
          if (ch_class) {
            posArr = cloneObj(this.$store.state.pos[macId + "_" + ch_class]);
          } else {
            posArr = cloneObj(this.$store.state.pos[macId]);
          }
        } else if (type == "pos") {
          msg = cloneObj(this.$store.state.checkMsg.pos);
        }
        //添加数据
        this.$set(this.chartData, key, {
          isShow: true,
          msg,
          posArr,
          macArr,//当前机组所在组织下的所有机组
          retrievalParams: null,
          padding: {
            "padding-right": "20px"
          },
          /* head: [
            { val: "测点名称", isShow: true },
            { val: "特征值类型", isShow: true },
            { val: "实时值", isShow: true },
            { val: "最大值", isShow: true },
            { val: "最小值", isShow: true },
            { val: "平均值", isShow: true }
          ], */
          head: [
            { val: this.$t('monitor.EquipName'), isShow: true },//设备名称
            { val: this.$t('Common.order'), isShow: true },//序号
            { val: this.$t('Common.posName'), isShow: true },//测点名称
            { val: this.$t('monitor.EigenvalueType'), isShow: true },//特征值类型
            { val: this.$t('monitor.warnValue'), isShow: false },//预警值
            { val: this.$t('monitor.alarmValue'), isShow: false },//报警值
            { val: this.$t('MonitorRetrieval.realTimeValue'), isShow: true },//实时值
            { val: this.$t('monitor.Max'), isShow: true },//最大值
            { val: this.$t('monitor.Min'), isShow: true },//最小值
            { val: this.$t('eigenvalue.rock_avg'), isShow: true }//平均值
          ],
          head1: [
            { val: this.$t('monitor.EquipName'), isShow: true },//设备名称
            { val: this.$t('Common.order'), isShow: true },//序号
            { val: this.$t('Common.posName'), isShow: true },//测点名称
            { val: this.$t('monitor.EigenvalueType'), isShow: true },//特征值类型
            { val: this.$t('monitor.warnValue'), isShow: false },//预警值
            { val: this.$t('monitor.alarmValue'), isShow: false },//报警值
            { val: this.$t('MonitorRetrieval.realTimeValue'), isShow: true },//实时值
            { val: this.$t('monitor.Max'), isShow: true },//最大值
            { val: this.$t('monitor.Min'), isShow: true },//最小值
            { val: this.$t('eigenvalue.rock_avg'), isShow: true }//平均值
          ],
          body: [],
          empty: {
            isShow: false,
            text: this.$t('Common.noDataText')//无数据
          },
          mac: cloneObj(this.$store.state.checkMsg.mac),
          scrollLeft: 0
        });
        /* 打开新图谱的时候先打开搜索栏 */
        this.dataRetrieval();
      } else if (state == 1) {
        //切换
        this.chartData[key].isShow = true;
        let title = document.getElementsByClassName(`scroll-${key}`)[0];
        title.style.left = "0px";
        let index = keyArr.indexOf(this.currentKey);
        let dom = this.$refs.historyBody[index];
        dom.scrollLeft = 0
      } else if (state == 2) {
        //删除
        this.$delete(this.chartData, key);
      }
    },
    // 请求数据
    getData (currentData) {
      this.$emit("loadingImg", true);
      this.$getApi.getMonitoringTabulated(this.requestData).then(res => {
        this.$emit("loadingImg", false);
        this.setData(res.monitoringTabulated, currentData, res.t_root);
      });
    },
    // 组合数据
    setData (data, currentData, t_root) {
      let body = [];
      let bodyData = {}
      if (!data) {
        currentData.body = [];
        currentData.empty.isShow = true;
        return;
      } else {
        currentData.empty.isShow = false;
        data.forEach((item, i) => {
          let eigenvalue = [];
          for (let macId in this.requestData.positions) {
            let mac = this.requestData.positions[macId]
            if (t_root == 1 || t_root == 2 || t_root == -1) {
              for (let pumpId in mac) {
                let pump = mac[pumpId]
                for (let val of pump) {
                  if (val.id == item.pos_id && val.type == item.pos_type) {
                    let pos_loc;
                    if (item.pos_loc === undefined) {
                      pos_loc = 1;
                    } else {
                      pos_loc = item.pos_loc;
                    }
                    let headList = setHead(
                      t_root,
                      item.dgm_type,
                      item.pos_type,
                      pos_loc
                    );
                    headList.map(value => {
                      val.fileds.map(v => {
                        if (value.filed === v) {
                          let name = value.val;
                          eigenvalue.push({
                            name,
                            filed: value.filed,
                            code: value.code,
                            pos: item
                          });
                        }
                      });
                    });
                  }
                }
              }
            } else {
              for (let val of mac) {
                if (val.id == item.pos_id && val.type == item.pos_type) {
                  let pos_loc;
                  if (item.pos_loc === undefined) {
                    pos_loc = 1;
                  } else {
                    pos_loc = item.pos_loc;
                  }
                  let headList = setHead(
                    t_root,
                    item.dgm_type,
                    item.pos_type,
                    pos_loc
                  );
                  headList.map(value => {
                    val.fileds.map(v => {
                      if (value.filed === v) {
                        let name = value.val;
                        eigenvalue.push({
                          name,
                          filed: value.filed,
                          code: value.code,
                          pos: item
                        });
                      }
                    });
                  });
                }
              }
            }
          }

          let unitNum = item.units.unitNum;
          unitNum === null ? (unitNum = 4) : null;
          const value = data[i];
          let d = [];
          for (let i = 0, len = eigenvalue.length; i < len; i++) {
            const filed = eigenvalue[i].filed;
            if (filed == "saveTime_Com") continue; //跳过时间
            if (filed == "type") continue; //数字量测点的数字量类型
            const real = value.real;
            const save = value.save;
            let max = `max${filed}`;
            let min = `min${filed}`;
            let avg = `avg${filed}`;
            let unit = getUnit(eigenvalue[i].code, eigenvalue[i].pos);
            let m = ["overturn_s", "rock_s"]; ///* 改变单位mm->m */
            let flag = false //是否需要改变单位
            if (m.includes(filed)) {
              flag = true;
              unit == 'mm' ? unit = 'm' : unit = unit
            }
            unit === "" ? null : (unit = "(" + unit + ")");


            let dataTime = {}
            for (let k = 0, l = currentData.head1.length; k < l; k++) {
              let headItem = currentData.head1[k]
              if (headItem && headItem.timeStamp) {
                dataTime[headItem.timeStamp] = !item.data[headItem.timeStamp] ? this.$t('Common.noDataText') : item.data[headItem.timeStamp][filed] === null ||
                  item.data[headItem.timeStamp][filed] >= 100000000 ||
                  item.data[headItem.timeStamp][filed] === undefined
                  ? this.$t('Common.noDataText')
                  : flag == true ? round(unitTransformation(item.data[headItem.timeStamp][filed]), unitNum) : round(item.data[headItem.timeStamp][filed], unitNum)
              }
            }
            let VibPosType = [3, 4, 6, 9, 8, 11, 12, 13, 14, 15, 16];//振动系测点
            let h = '—', hh = '—', l = '—', ll = '—';

            if (VibPosType.indexOf(item.pos_type) != -1) {
              h = !item.alarmValue ? '—' : item.alarmValue[eigenvalue[i].code] ? item.alarmValue[eigenvalue[i].code].split('_')[0] : '—'
              hh = !item.alarmValue ? '—' : item.alarmValue[eigenvalue[i].code] ? item.alarmValue[eigenvalue[i].code].split('_')[1] : '—'
            } else if (item.pos_type == 7 || item.pos_type == 2 || item.pos_type == 10) {
              //温度、过程量、工艺量测点有低报、低低报
              h = !item.alarmValue ? '—' : item.alarmValue.h_limit ? item.alarmValue.h_limit : '—'
              hh = !item.alarmValue ? '—' : item.alarmValue.hh_limit ? item.alarmValue.hh_limit : '—'
              l = !item.alarmValue ? '—' : item.alarmValue.l_limit ? item.alarmValue.l_limit : '—'
              ll = !item.alarmValue ? '—' : item.alarmValue.ll_limit ? item.alarmValue.ll_limit : '—'
            } else if (item.pos_type == 5) {
              h = !item.alarmValue ? '—' : item.alarmValue.h_limit ? item.alarmValue.h_limit : '—'
              hh = !item.alarmValue ? '—' : item.alarmValue.hh_limit ? item.alarmValue.hh_limit : '—'
            }
            d.push({
              e: eigenvalue[i].name + unit,
              filed: eigenvalue[i].filed,
              real:
                real === null
                  ? this.$t('Common.noDataText')
                  : real[filed] === null ||
                    real[filed] >= 100000000 ||
                    real[filed] === undefined
                    ? this.$t('Common.noDataText')
                    : flag == true ? round(unitTransformation(real[filed]), unitNum) : round(real[filed], unitNum),
              max:
                save === null || save === undefined ||
                  save[max] === null ||
                  save[max] === undefined ||
                  save[max] >= 100000000
                  ? this.$t('Common.noDataText')
                  : flag == true ? round(unitTransformation(save[max]), unitNum) : round(save[max], unitNum),
              min:
                save === null || save === undefined ||
                  save[min] === null ||
                  save[min] === undefined ||
                  save[min] >= 100000000
                  ? this.$t('Common.noDataText')
                  : flag == true ? round(unitTransformation(save[min]), unitNum) : round(save[min], unitNum),
              avg:
                save === null || save === undefined ||
                  save[avg] === null ||
                  save[avg] === undefined ||
                  save[avg] >= 100000000
                  ? this.$t('Common.noDataText')
                  : flag == true ? round(unitTransformation(save[avg]), unitNum) : round(save[avg], unitNum),
              dataTime,//时间
              h,
              hh,
              l,
              ll,
            })
          }
          let bodyItem = {
            name: value.name,
            d,
            fid: item.pump_id ? item.pump_id : item.mac_id,
          }
          // body.push(bodyItem);

          item.fid = item.pump_id ? item.pump_id : item.mac_id
          if (!bodyData[item.fid]) {
            bodyData[item.fid] = []
            bodyData[item.fid].push(bodyItem)
          } else {
            bodyData[item.fid].push(bodyItem)
          }
        });
        let retrievalParams = currentData.retrievalParams;
        for (let i = 0, l = retrievalParams.macChoose.length; i < l; i++) {
          let mac = retrievalParams.macChoose[i]
          if (mac.isShow) {
            // mac.pos = bodyData[mac[`${mac.type}_id`]]
            //假数据
            if (bodyData[mac[`${mac.type}_id`]]) {
              mac.pos = bodyData[mac[`${mac.type}_id`]]
              body.push(mac)
            }
          }
        }
        // body.sort((a, b) => {
        //   if (a.name < b.name) {
        //     return -1;
        //   } else if (a.name > b.name) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
        // });
        currentData.body = body;
        this.$nextTick(() => {
          const el = this.$refs.historyBody[
            Object.keys(this.chartData).indexOf(this.currentKey)
          ];
          if (el.scrollHeight > el.clientHeight) {
            currentData.padding = {
              "padding-right": "20px"
            };
          } else {
            currentData.padding = {
              "padding-right": "0"
            };
          }
        });
      }
    },
    // 设置测点名称高度
    getHeight (d, type = 'd') {
      let len = 0;
      if (type == 'pos') {
        d.forEach(item => {
          len = item.d.length * 30 + len
        })
        return {
          height: `${len}px`,
          lineHeight: `${len}px`
        };
      }
      len = 30 * d.length;
      return {
        height: `${len}px`,
        lineHeight: `${len}px`
      };
    },
    // 取每月的天数
    TimeCalc (y, m) {
      if (m > 12) {
        y++;
        m = m % 12
      }
      let monthDay = 0
      switch (Number(m)) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          monthDay = 31
          break;
        case 2:
          monthDay = 28
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          monthDay = 30
          break;
      }
      // 判断闰年平年
      if (y % 4 == 0 && y % 100 != 0 || y % 400 == 0) {
        switch (Number(m)) {
          case 2:
            monthDay = 28
            break;
        }
      }
      return monthDay
    },
    // m:几月，d:几日
    monthCalc (y, m, d) {
      //判断当前月是否超出
      let monthDay = this.TimeCalc(y, m)
      /* 若天数超过当月最大天数，月份+1（若月份+1后大于12，年份+1） */
      if (d > monthDay) {
        d = d % monthDay
        if (m + 1 < 12) {
          m = m + 1
        } else {
          m = (m + 1) % 12
          y++
        }
      }
      if (m > 12) {
        m = m % 12
        y++
      }
      return { y, m, d }
    },
    // 点击数据检索
    dataRetrieval () {
      let [, type, macId, posId, posType] = this.currentKey.split("_");
      let currentData = this.chartData[this.currentKey];
      const head = currentData.head;
      this.$retrieval({
        key: "monitor",
        params: {
          type,
          msg: currentData.msg,
          posArr: currentData.posArr,
          macArr: currentData.macArr,
          mac: currentData.mac,
          retrievalParams: currentData.retrievalParams
        }
      }).then(res => {
        if (res) {
          let positions = [];
          let retrievalParams = res.retrievalParams;
          head[6].isShow = res.isReal;
          // 实时值控制显隐
          if (res.isReal == 0) {
            head[6].isShow = false;
          } else if (res.isReal == 1) {
            head[6].isShow = true;
          }
          if (retrievalParams.isShowAlarm == 0) {
            head[4].isShow = false;
            head[5].isShow = false;
          } else if (retrievalParams.isShowAlarm == 1) {
            head[4].isShow = true;
            head[5].isShow = true;
          }

          let hArray = [] //时间参数
          let head1 = cloneObj(head)
          let time = new Date(res.startTime)
          var Y = time.getFullYear();
          var M = time.getMonth() + 1;
          var D = time.getDate();
          var h = time.getHours();
          var mm = time.getMinutes();
          var s = time.getSeconds();
          //小时
          if (retrievalParams.vital == 1) {
            /*
            1.获取当前天的到小时的时间戳time1，最多显示31天，写一个31次的循环
            2.获取日期+1后通过monthCalc方法获取正确的dayTime（年月日），推入重组的头，时间推入hArray
             */

            let monthDay = this.TimeCalc(Y, M)
            var date = new Date(`${Y}-${M}-${D} ${h}:${mm}:${s}`);
            var time1 = date.getTime();
            for (let i = 0; i < 48; i++) {
              if (time1 + 3600000 * i < res.endTime) {
                let dayTime = this.monthCalc(Y, M, D + Math.floor((h + i) / 24))
                hArray.push(time1 + 3600000 * i)
                head1.push({ val: `${dayTime.m}-${dayTime.d} ${(h + i) % 24}:${mm}`, isShow: true, timeStamp: time1 + (3600000 * i) })
              } else {
                break;
              }
            }
          } else if (retrievalParams.vital == 2) {
            //天
            /*
            1.获取当前天的时间戳time1，最多显示31天，写一个31次的循环
            2.获取日期+1后通过monthCalc方法获取正确的dayTime（年月日），推入重组的头，时间推入hArray
             */
            let monthDay = this.TimeCalc(Y, M)
            var date = new Date(`${Y}-${M}-${D} ${h}:${mm}:${s}`);
            var time1 = date.getTime();
            for (let i = 0; i < 32; i++) {
              if (time1 + 86400000 * i < res.endTime) {
                let dayTime = this.monthCalc(Y, M, D + i)
                // if (i != 31) {
                let t = new Date(time1 + 86400000 * i)
                var YY = t.getFullYear();
                var MM = t.getMonth() + 1;
                var DD = t.getDate();
                head1.push({ val: `${MM}-${DD}`, isShow: true, timeStamp: time1 + (86400000 * i) })
                // }
                hArray.push(time1 + 86400000 * i)
              } else {
                break;
              }
            }
            if (head1.length > 31 + 10) {
              head1 = head1.slice(0, 41)
            } else {
              head1 = head1.slice(0, -1)
            }
          } else if (retrievalParams.vital == 3) {
            // 月
            /* 
            1.获取当前月的时间戳time1，最多显示12个月，写一个12次的循环
            2.获取月份+1后通过monthCalc方法获取正确的dayTime（年月日），推入重组的头，时间推入hArray
             */
            var date = new Date(`${Y}-${M}-${D} ${h}:${mm}:${s}`);
            var time1 = date.getTime();
            for (let i = 0; i < 13; i++) {
              let dayTime = this.monthCalc(Y, M + i, D)
              let monthDay = this.TimeCalc(dayTime.y, dayTime.m)
              if (i == 0) {
                let t = new Date(time1)
                var YY = t.getFullYear();
                var MM = t.getMonth() + 1;
                var DD = t.getDate();
                head1.push({ val: `${YY}-${MM}-${DD}`, isShow: true, timeStamp: time1 })
                hArray.push(time1)
              }
              if (time1 + 86400000 * monthDay < res.endTime) {
                // if (i != 12) {
                let t = new Date(time1 + 86400000 * monthDay)
                var YY = t.getFullYear();
                var MM = t.getMonth() + 1;
                var DD = t.getDate();
                head1.push({ val: `${YY}-${MM}-${DD}`, isShow: true, timeStamp: time1 + (86400000 * monthDay) })
                // }
                hArray.push(time1 + 86400000 * monthDay)
                time1 = time1 + 86400000 * monthDay
              } else {
                break;
              }
            }
            if (head1.length > 12 + 10) {
              head1 = head1.slice(0, 22)
            } else {
              head1 = head1.slice(0, -1)
            }
          }
          currentData.head1 = head1
          if (retrievalParams.type === "pos") {
            let pos_loc = 0;
            if (this.$store.state.checkMsg.pos.position_type == 13) {
              pos_loc = this.$store.state.checkMsg.pos.pos_loc;
            }
            let pos = {
              type: this.$store.state.checkMsg.pos.position_type,
              dgm_type: this.$store.state.checkMsg.pos.dgm_type,
              pos_loc: pos_loc
            };
            //单个测点
            positions.push({
              id: Number(posId),
              type: Number(posType),
              fileds: this.getFileds(pos, retrievalParams.value)
            });
          } else if (retrievalParams.type === "mac") {
            positions = {}
            //机组所有测点
            retrievalParams.macChoose.forEach(mac => {
              if (!mac.isShow) return; //未勾选的机组
              let posArray = []
              if (retrievalParams.pos[mac.id]) {
                retrievalParams.pos[mac.id].forEach(pos => {
                  if (!pos.isShow) return; //未勾选的测点
                  posArray.push({
                    id: pos.posId,
                    type: pos.type,
                    fileds: this.getFileds(pos, retrievalParams.value)
                  });
                });

                if (mac.type == 'pump') {
                  let posArray_Pump = {}
                  this.$set(posArray_Pump, mac.pump_id, posArray)
                  posArray = posArray_Pump
                }
                if (!positions[mac.mac_id]) {
                  this.$set(positions, mac.mac_id, posArray)
                } else {
                  this.$set(positions[mac.mac_id], mac.pump_id, posArray[mac.pump_id])
                }
              }

            })
            // retrievalParams.posChoose.forEach(pos => {
            //   if (!pos.isShow) return; //未勾选的测点
            //   positions.push({
            //     id: pos.posId,
            //     type: pos.type,
            //     fileds: this.getFileds(pos, retrievalParams.value)
            //   });
            // });
          }
          currentData.retrievalParams = retrievalParams
          this.requestData = {
            machineId: macId,
            startTime: res.startTime,
            endTime: res.endTime,
            fromSpeed: res.minSpeed,
            toSpeed: res.maxSpeed,
            positions,
            density: Number(res.density.type),
            timeArray: hArray,
            stats_type: Number(retrievalParams.vital),
            t_root: currentData.macArr[0].t_root,
            fields: defaultCode1,
          };
          this.getData(currentData);
          // this.setData([], currentData, 0)
        }
      });
    },
    /* 获得每个测点的特征值 */
    getFileds (pos, value) {
      let fileds = [];
      let index;
      if (pos.type === 13) {
        index = `${pos.type}_${pos.dgm_type}_${pos.pos_loc}`;
      } else {
        index = `${pos.type}_${pos.dgm_type}_0`;
      }
      value[index].forEach(item => {
        item.isShow && fileds.push(item.filed);
      });
      return fileds;
    },
    /* 下载csv文件 */
    download () {
      let monitor = this.chartData[this.currentKey];
      let macName = monitor.msg.mac_me || monitor.msg.mac_name;
      // /* 获取当前数据，拼装成json */
      let body = monitor.body;
      let myData = [];
      let fields = [], showHead = []
      for (let i = 0, l = monitor.head1.length; i < l; i++) {
        if (monitor.head1[i].isShow) {
          fields.push(monitor.head1[i].val)
          if (monitor.head1[i].timeStamp) {
            showHead.push(monitor.head1[i])
          }
        }
      }
      body.forEach(item => {
        item.pos.forEach((pos, i) => {
          pos.d.forEach(d => {
            let data
            if (this.$t('monitor.EquipName') == '设备名称') {
              data = {
                设备名称: '' + item.name,
                序号: i + 1,
                测点名称: '' + pos.name,
                特征值类型: d.e,
                实时值: d.real,
                最大值: d.max,
                最小值: d.min,
                平均值: d.avg
              }
              if (fields.indexOf('报警值') !== -1) {
                data.报警值 = d.hh
                data.预警值 = d.h
              }
            } else {
              data = {
                'Equipment name': '' + item.name,
                'Serial Number': i + 1,
                'Name Of Measuring Point': '' + pos.name,
                'Eigenvalue type': d.e,
                'Real-time Value': d.real,
                'Max': d.max,
                'Min': d.min,
                'average value': d.avg
              }
              if (fields.indexOf('alarm value') !== -1) {
                data['alarm value'] = d.hh
                data['warning value'] = d.h//预警值
              }
            }
            for (let k = 0, l = showHead.length; k < l; k++) {
              data[showHead[k].val] = d.dataTime[showHead[k].timeStamp]
            }
            myData.push(data)
          });
        });
      });

      var Parser = require("json2csv").Parser;
      let json2csvParser = new Parser({ fields });
      let csv = json2csvParser.parse(myData);
      csv = "\ufeff" + csv;
      var aTag = document.createElement("a");
      var blob = new Blob([csv]);
      aTag.download = `${this.$t('HeaderEdge.secondLevel4_4')}-${macName}.csv`;//监测报表
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
    },
    // 设置class
    setClass (id, index) {
      let body = this.chartData[this.currentKey].body;
      let k = 0
      for (let i = 0; i < id; i++) {
        k = k + body[i].d.length
      }
      k = k + index
      return 'monitor-val-list' + (k % 2)
      // const className = {
      //   title: ["monitor-title monitor-title1", "monitor-title"],
      //   list: ["monitor-body-list monitor-body-list1", "monitor-body-list"]
      // };
      // const index = Number(this.chartData[this.currentKey].head[2].isShow);
      // return className[type][index];
    },
    /* 下滑的时候固定表头 */
    scrollBar (e, key, item) {
      let scrollLeft = e.target.scrollLeft
      let dom = document.querySelector(`.scroll-${key}`)
      dom.style.left = -scrollLeft + 'px'
      item.scrollLeft = scrollLeft
    },
    /* 其他图谱切换的时候重置滚动条 */
    resetScrollbar (item) {
      this.$refs[this.currentKey][0].scrollLeft = item.scrollLeft
    },
  },
  created () {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "monitor"
    });
  }
};
