import {
  getCodeObj, getTime, round, cloneObj, setPosMsg, matchRule, addClass, removeClass
} from 'utils/utils.js';
import json2csv from 'json2csv'
import { getMenuItem, getMenus, showRightMenu } from 'common/menus/Menus.js'

export default {
  name: 'alarm',//报警日志
  data () {
    return {
      alarmData: {} /* 报警日志信息 */,
      requestData: {} /* 报警日志请求信息 */,
      head: {
        /* 所有类型报警日志表头 */ tree: ['组织名称', '机组名称', '报警次数', '报警类型'],
        mac: ['序号', '机组名称', '通道名称', '报警次数', '报警类型'],
        //通道报警日志表头
        enter: ['通道名称', '测点名称', '报警次数', '报警类型'],
        pos: ['序号', '测点名称', '事件时间', '事件描述', '工况类型', '报警类型', '报警值', '报警(高)', '预警(高)', '预警(低)', '报警(低)',],
        pos2: ['序号', '测点名称', '事件时间', '事件描述', '报警类型', '报警值', 'Ⅱ级报警(高)', 'Ⅰ级报警(高)', '预警(高)', /*'预警(低)', 'Ⅰ级报警(低)', 'Ⅱ级报警(低)'*/], //t_toot为2时
        pos3: ['序号', '测点名称', '事件时间', '事件描述', '报警类型', '报警值'], //t_root为-1时,dgmType为10
      },
      type: -1 /* 0: 组织, 1: 机组, 2: 通道,3: 测点 */,
      flag: '' /* 选中显示标记 */,
      currentMsg: {} /* 测点报警日志当前显示(组织、机组、测点)信息 */,
      alarmTime: {
        /* 请求时间 */ type: 0,
        start: '',
        end: '',
      },
      currentIndex: 0 /* 当前显示图表索引 */,
      searchkeyword: '' /*查询*/,
      enterName: '',
      addscrollFalg: false,/* 是否添加滚动方法 */
      tRootContent: [-1, 1, 2],//取机泵的t_root
    }
  },
  watch: {
    '$store.state.alarmMsg': {
      handler (value) {
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
  created () {
    this.$store.commit("set_keepAlive", { method: "add", keepAlive: "alarm" });
    if (this.$store.state.ChName) {
      this.setChName(this.$store.state.ChName)
    }
  },
  activated () {
    const data = this.alarmData[this.currentIndex];
    if (data.getReal) {
      const rd = this.getRequestData(data)
      this.getData(rd);
      removeClass(tag, "disable-btn");
    }
  },
  deactivated () {
    clearTimeout(this.alarmData[this.currentIndex].timer);
  },
  methods: {
    // 打开报警日志
    openChartList (key, type, delKey) {
      if (typeof key !== 'string') return
      let [, alarmType, Pid, id, pType, ch_id] = key.split('_')
      pType = Number(pType)
      const msg = {}
      const rd = {
        getReal: false,
        timer: null
      }
      if (type === 0 || type === 1 || type === 4) {
        let treeId = null
        let tree = this.$store.state.checkMsg.tree
        if (tree) {
          treeId = tree.t_id
        }
        const currentMsg = this.currentMsg
        let data
        if (alarmType === 'enter') {
          data = cloneObj(this.$store.state.mac, true);
        } else {
          data = cloneObj(this.$store.state[alarmType], true);
        }
        let checkMsg = null;

        if (alarmType === 'tree') {
          for (const value of data) {
            if (value.t_id == Pid) {
              checkMsg = value;
              break
            }
          }
        } else if (alarmType === 'mac' || alarmType === 'enter') {
          for (const k in data) {
            const value = data[k]
            for (let i = 0, l = value.length; i < l; i++) {
              const val = value[i]
              if (!val.mac_id) {
                val.mac_id = val.machine_id
              }
              // if (val.t_root == 1 || val.t_root == 2 || val.t_root == -1) { //如果t_root不为1,2取pump_id
              if (this.tRootContent.indexOf(Number(val.t_root)) !== -1) {
                if (val.pump_id === Pid || (val.mac_id === Pid && val.ch_class == id)) {
                  val.name = val.pump_name
                  checkMsg = val;
                  break
                }
              } else {// 取mac_id
                if (val.mac_id === Pid) {
                  val.name = val.mac_me
                  checkMsg = val;
                  break
                }
              }
            }
          }
        } else if (alarmType === 'pos') {
          for (const k in data) {
            const value = data[k]
            for (let i = 0, l = value.length; i < l; i++) {
              const val = value[i]
              if (!val.mac_id) {
                val.mac_id = val.machine_id
              }
              if (`${val.mac_id}_${val.position_id}_${Number(val.position_type)}` == `${Pid}_${id}_${Number(pType)}`) {
                checkMsg = val;
                break
              }
            }
          }
        }
        switch (alarmType) {
          case 'tree':
            this.type = 0
            msg.id = Pid
            msg.name = checkMsg.t_name
            msg.parentId = Pid
            msg.tRoot = checkMsg.t_root
            msg.fileName = checkMsg.t_name
            rd.treeId = Pid
            rd.type = 0
            rd.t_root = checkMsg.t_root
            break
          case 'mac':
            this.type = 1
            msg.parentId = checkMsg.t_id
            msg.name = checkMsg.name || checkMsg.m_me  //机组或机泵名
            msg.tRoot = checkMsg.t_root
            msg.m_type = checkMsg.m_type
            msg.fileName = checkMsg.name
            rd.type = 1
            rd.t_root = checkMsg.t_root
            msg.machineId = checkMsg.machine_id
            // if (checkMsg.t_root == 1 || checkMsg.t_root == 2 || checkMsg.t_root == -1) {
            if (this.tRootContent.indexOf(Number(checkMsg.t_root)) !== -1) {
              rd.pumpId = checkMsg.pump_id
              rd.machineId = checkMsg.machine_id
              msg.ch_class = checkMsg.ch_class
              msg.pumpId = checkMsg.pump_id
              msg.id = checkMsg.pump_id
              msg.machineId = checkMsg.machine_id
            } else {
              rd.machineId = Pid
              msg.id = Pid
              msg.machineId = checkMsg.machine_id
            }
            break
          case 'enter':
            this.type = 2
            msg.treeId = treeId
            msg.id = Pid //mac_id
            msg.parentId = checkMsg.t_id
            msg.name = checkMsg.name
            msg.tRoot = checkMsg.t_root
            msg.dgm_id = id
            msg.ch_type = pType
            msg.ch_id = ch_id
            msg.fileName = checkMsg.name
            rd.dgm_id = id
            rd.ch_type = pType
            rd.ch_id = ch_id
            rd.type = 2
            // if (checkMsg.t_root == 1 || checkMsg.t_root == 2 || checkMsg.t_root == -1) {
            if (this.tRootContent.indexOf(Number(checkMsg.t_root)) !== -1) {
              rd.pumpId = checkMsg.pump_id
              rd.machineId = checkMsg.machine_id
              msg.ch_class = checkMsg.ch_class
              msg.machineId = checkMsg.machine_id
              msg.pumpId = checkMsg.pump_id
            } else {
              rd.machineId = Pid
              msg.machineId = checkMsg.machine_id
            }
            rd.t_root = checkMsg.t_root
            break
          case 'pos':
            this.type = 3
            msg.treeId = treeId
            msg.parentId = Pid //macId
            msg.id = checkMsg.position_id
            msg.type = Number(checkMsg.position_type)
            msg.name = checkMsg.position_name
            msg.dgmType = checkMsg.dgm_type
            msg.dgm_id = checkMsg.dgm_id
            msg.ch_type = checkMsg.channel_type
            msg.ch_id = checkMsg.channel_id
            msg.tRoot = checkMsg.t_root
            msg.macid = checkMsg.machine_id
            msg.machineId = checkMsg.machine_id
            msg.fileName = checkMsg.mac_name + '_' + checkMsg.position_name
            rd.machineId = Pid
            rd.positionId = id
            rd.positionType = Number(pType)
            rd.standardTime = -1
            break
        }
        this.currentIndex = key
        for (let k in this.alarmData) {
          if (k != key) {
            clearTimeout(this.alarmData[k].timer);
            this.alarmData[k].isShow = false
          }
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.alarmData, key, {
            type: alarmType,
            isShow: true,
            head: [],
            body: [],
            msg,
            isCheck: false,
            noData: {
              /* 无报警数据 */ isShow: true,
              text: '',
            },
            getReal: false,
            timer: null,
            num: 30,//每页数据数
            pageNum: 1,//页码
            totalPage: 1,//总页数
            posAlarmData: [],
            dom: {},
            savetime_com: -1,//最大时间，用于分页请求报警数据
          })
          this.getData(rd)
          break
        case 1 /* 切换图表 */:
          this.alarmData[key].isShow = true
          // 切换之前判断是否需要获取实时数据
          if (this.alarmData[key].getReal) {
            this.getData(rd);
          }
          break
        case 2 /* 关闭图表 */:
          clearTimeout(this.alarmData[key].timer);
          this.$delete(this.alarmData, key)
          break;
        case 4 /* 从其他图表跳转已存在图标 */:
          this.alarmData[key].isShow = true
          this.getData(rd)
          break;
      }
    },
    // 为dom增加滚动事件
    addScrolEvent () {
      // 防止火狐height:100%失效
      this.$nextTick(() => {
        let dom = document.getElementsByClassName('alarm-table')
        let keyArr = Object.keys(this.alarmData);
        let index = keyArr.indexOf(this.currentIndex)
        if (dom[index]) {
          dom[index].style.height = `${Number(dom[index].parentElement.clientHeight)}px`;
        }
        let dom1 = document.getElementsByClassName('alarm-tbody')
        if (dom1.length > 0) {
          for (let j = 0; j < dom.length; j++) {
            if (dom1[j]) {
              dom1[j].style.height = `${parseInt(dom[index].style.height) - 42}px`;
            }
          }
        }
      })
      if (this.$refs[`tbody${this.currentIndex}`] && this.$refs[`tbody${this.currentIndex}`][0]) {
        // 防止火狐浏览器高度设置百分百失效
        this.alarmData[this.currentIndex].dom = this.$refs[`tbody${this.currentIndex}`][0]
        if (this.alarmData[this.currentIndex].dom) {
          this.alarmData[this.currentIndex].dom.addEventListener('scroll', this.handleScroll)
          this.addscrollFalg = true
        }
      } else {
        setTimeout(() => { this.addScrolEvent() }, 400)
      }
    },
    // 设置趋势增长
    setGrowth (num) {
      return Math.round(num * 10) / 10
    },
    // 事件描述
    setEvenType (type, val, alarmData) {
      let msg = this.alarmData[this.currentIndex].msg
      let event = {}
      if (msg.tRoot == 2) {
        event = {
          19: 'Ⅱ级报警(高)',
          3: 'Ⅰ级报警(高)',
          2: '预警(高)',
          44: 'Ⅱ级报警(低)',
          12: 'Ⅰ级报警(低)',
          8: '预警(低)',
          0: '正常'
        };
      } else {
        event = {
          0: '从正常到报警（高）',
          1: '从正常到预警（高）',
          2: '从正常到报警（低）',
          3: '从正常到预警（低）',
          4: '从预警（高）到报警（高）',
          5: '从预警（低）到报警（低）',
          6: '从报警（高）到预警（低）',
          7: '从报警（高）到报警（低）',
          8: '从预警（高）到预警（低）',
          9: '从预警（高）到报警（低）',
          10: '从预警（低）到预警（高）',
          11: '从预警（低）到报警（高）',
          12: '从报警（低）到预警（高）',
          13: '从报警（低）到报警（高）',
          14: `趋势增长${this.setGrowth(val.alarm_hh)}%预警`,
          15: `趋势负增长${this.setGrowth(val.alarm_ll)}%预警`,
          16: `趋势增长${this.setGrowth(val.alarm_h)}%报警`,
          17: `趋势负增长${this.setGrowth(val.alarm_l)}%报警`,
          18: `趋势增长${this.setGrowth(val.alarm_h)}%平均值`,
          128: '从报警（高）恢复到正常',
          129: '从预警（高）恢复到正常',
          130: '从报警（低）恢复到正常',
          131: '从预警（低）恢复到正常',
          132: '从报警（高）回到预警（高）',
          133: '从报警（低）回到预警（低）',
          200: '设备异常',//智子测点的报警描述：异常
        }
      }
      const pos = alarmData.msg;
      if (pos.type == 99) {//窑结圈，辊皮脱落测点
        return '重度窑结圈故障'
      }
      return event[type] === undefined ? `未定义${type}` : `${pos.name}-${event[type]}`;
    },
    // 设置显示横杠或数据
    setViewData (data) {
      return data === null ? '—' : round(data, 4);
    },
    // 是否获取实时数据
    getRealData (e) {
      let tag = e.currentTarget;
      const data = this.alarmData[this.currentIndex];
      data.getReal = !data.getReal;
      if (data.getReal) {
        const rd = this.getRequestData(data)
        this.getData(rd);
        removeClass(tag, "disable-btn");
      } else {
        clearTimeout(data.timer);
        addClass(tag, "disable-btn");
      }
    },
    // 组合数据
    setData (data, alarmData) {
      const type = alarmData.type;
      const dataType = {
        'tree': 'result',
        'mac': 'result',
        'enter': 'result',
        'pos': 'alarmList',
      };
      let list
      if (type === 'pos') {
        if (alarmData.pageNum === 1) {
          alarmData.posAlarmData = data.alarmList
        } else {
          data.alarmList.forEach(element => {
            alarmData.posAlarmData.push(element)
          });
        }
        list = alarmData.posAlarmData
      } else {
        list = data[dataType[type]];
      }
      if (list && (list.length > 0 || Object.keys(list).length > 0)) {
        alarmData.noData.isShow = false;
        let head = [];
        let body = [];
        let filed = {
          tree: 'macName',
          enter: 'positionName'
        };
        // if (alarmData.msg.tRoot == 1 || alarmData.msg.tRoot == 2 || alarmData.msg.tRoot == -1) {
        if (this.tRootContent.indexOf(Number(alarmData.msg.tRoot)) !== -1) {
          filed = {
            tree: 'pumpName',
            enter: 'positionName'
          };
        }
        head = cloneObj(this.head[type]);
        if (type === 'pos') {
          if (Number(alarmData.msg.dgmType) === 1) {
            head = cloneObj(this.head.pos).slice(0, 4)
          }
        }
        if (alarmData.msg.tRoot == 2 && type === 'pos') {//TMS
          head = cloneObj(this.head[`${type}2`]);
        } else if (alarmData.msg.tRoot == -1 && type === 'pos') {//WL9100
          head = cloneObj(this.head[`${type}3`]);
        }
        const classList = {
          0: ['', '正常'],
          9: ['', '正常'],
          2: ['warning-text', '预警'],
          8: ['warning-text', '预警'],
          3: ['alarm-text', '报警'],
          12: ['alarm-text', '报警'],
        }
        const msg = alarmData.msg
        if (type === 'pos') {
          const cond = ['工况1', '工况2', '工况3', '工况4', '其它工况'];
          let i = 1;
          const posType = alarmData.msg.type;
          if (posType == 99) {//窑结圈，辊皮脱落测点
            head = [
              '序号',
              '事件时间',
              '事件描述',
            ]
          }
          // 冲击与冲击阶次特征值与包络、包络阶次一致
          const code = new Map([
            [0, () => { return 0 }],
            [1, () => {
              switch (posType) {
                case 6:
                  return 9000;
                case 4:
                case 15:
                case 16:
                case 9:
                  return 5000;
                case 11:
                  return 20000;
                case 12:
                  return 33000;
                case 13:
                  return 37000;
                default:
                  return 2000;
              }
            }],
            [2, () => {
              switch (posType) {
                case 6:
                  return 10000;
                case 11:
                  return 30000;
                case 12:
                  return 34000;
                case 13:
                  return 38000;
                default:
                  return 3000;
              }
            }],
            [3, () => {
              switch (posType) {
                case 6:
                  return 11000;
                case 4:
                case 15:
                case 16:
                case 9:
                  return 6000;
                case 11:
                  return 31000;
                case 12:
                  return 35000;
                case 13:
                  return 39000;
                default:
                  return 4000;
              }
            }],
            [4, () => { return 19000 }],
            [5, () => { return 24000 }],
            [6, () => { return 14000 }],
            [7, () => { return 12001 }],
            [8, () => { return 12002 }],
            [9, () => { return 12003 }],
            [10, () => { return 12004 }],
            [11, () => { return 12005 }],
            [12, () => { return 12006 }],
            [13, () => { return 12007 }],
            [14, () => { return 12008 }],
            [15, () => {
              switch (posType) {
                case 6:
                  return 29000;
                case 11:
                  return 32000;
                case 12:
                  return 47000;
                case 13:
                  return 48000;
              }
            }],
            [16, () => {
              switch (posType) {
                case 12:
                  return 36000;
                case 13:
                  return 40000;
              }
            }],
            [17, () => { return 43000 }],
            [18, () => { return 44000 }],
            [19, () => { return 46000 }],
            [20, () => { return 52001 }],
            [21, () => { return 52002 }],
            [22, () => { return 52003 }],
            [23, () => { return 52004 }],
            [24, () => { return 52005 }],
            [25, () => { return 52006 }],
            [26, () => { return 52007 }],
            [27, () => { return 52008 }],
            [28, () => { return 52009 }],
            [29, () => { return 57000 }],
            [30, () => { return 57001 }],
          ])
          for (let val of list) {
            if (Number(val.alarm_value) < 1000000000) {
              let alarmType = '—';
              if (Number(alarmData.msg.dgmType) === 3 || Number(alarmData.msg.dgmType) === 7 || Number(alarmData.msg.dgmType) === 9) {
                let codeObj = getCodeObj(alarmData.msg.dgmType)
                for (let key in codeObj[posType]) {
                  const v = codeObj[posType][key];
                  if (v.code === code.get(val.char_type)()) {
                    alarmType = v.name;
                    break;
                  }
                }
              }
              if (Number(alarmData.msg.dgmType) === 10) { /* WL报警特征值对应表*/
                switch (val.char_type) {
                  case 0:
                    alarmType = '加速度有效值';
                    break;
                  case 1:
                    alarmType = '速度有效值';
                    break;
                  case 2:
                    alarmType = '位移有效值';
                    break;
                  case 3:
                    alarmType = '峭度';
                    break;
                  case 4:
                    alarmType = '包络';
                    break;
                  case 5:
                    alarmType = '温度';
                    break;
                  case 6:
                    alarmType = '电量';
                    break;
                }
              }
              let value = this.setViewData(val.alarm_value);
              let tRoot = alarmData.msg.tRoot
              const h = this.setViewData(val.alarm_h); //预警（高）
              const hh = this.setViewData(val.alarm_hh);//Ⅰ级报警(高)
              let hhh = null
              if (val.alarm_hhh) {
                hhh = this.setViewData(val.alarm_hhh);//Ⅱ级报警(高)
              }
              let l = this.setViewData(val.alarm_l);//预警（低）
              let ll = this.setViewData(val.alarm_ll);//Ⅰ级报警(低)
              let lll = null
              if (val.alarm_lll) {
                lll = this.setViewData(val.alarm_lll);//Ⅱ级报警(低)
              }
              let vibSys = [3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16] //振动系测点
              if (vibSys.indexOf(alarmData.msg.type) !== -1) { //为振动系测点时无低报
                l = '—'
                ll = '—'
                lll = '—'
              }
              if (vibSys.indexOf(alarmData.msg.type) === -1) { //非振动系测点无工况
                val.cond_type = null
              }
              let eventType
              let className = 'normal-text';
              let alarmEventType = [0, 2, 4, 5, 7, 9, 11, 13, 16, 17];
              let warningEventType = [1, 3, 6, 8, 10, 12, 14, 15, 132, 133, 18];
              if (tRoot === 2) { //troot为2时情时取时间表述取alarm_type_to
                alarmEventType = [19, 44]
                let alarmOneEventType = [3, 12]//一级报警
                warningEventType = [2, 8]
                eventType = this.setEvenType(val.alarm_type_to, val, alarmData)
                if (alarmEventType.includes(val.alarm_type_to)) {
                  className = 'alarm-text';
                } else if (alarmOneEventType.includes(val.alarm_type_to)) {
                  className = 'alarm1-TMS-text';
                } else if (warningEventType.includes(val.alarm_type_to)) {
                  className = 'warn-TMS-text';
                }
              } else {//troot不为2时情时取时间表述取event_type
                eventType = this.setEvenType(val.event_type, val, alarmData)
                if (alarmEventType.includes(val.event_type)) {
                  className = 'alarm-text';
                } else if (warningEventType.includes(val.event_type)) {
                  className = 'warning-text';
                }
              }
              if (posType == 99) {//窑结圈，辊皮脱落测点
                body.push({
                  order: i,
                  viewTime: getTime(val.savetime_com),
                  time: val.savetime_com,
                  eventType: this.setEvenType(val.event_type, val, alarmData),
                  class: className,
                })
              }
              else {
                body.push({
                  order: i,
                  name: msg.name,
                  viewTime: getTime(val.savetime_com),
                  time: val.savetime_com,
                  eventType: eventType,
                  cond: val.cond_type === null ? '—' : cond[val.cond_type],
                  alarmType,
                  value,
                  alarmH: hh,
                  alarmHh: hhh === null ? '—' : hhh,
                  warningH: h,
                  alarmL: ll,
                  warningL: l,
                  alarmLl: lll === null ? '—' : lll,
                  class: className,
                  isCheck: false,
                  isShow: true,
                })
              }
              i++;
            }
          }

        } else if (type === 'mac') {
          let i = 1
          list.forEach((val) => {
            if (val != null && val != undefined) {
              if (val.ch_type != 2) {
                body.push({
                  order: i,
                  name: msg.name,
                  id: `${msg.id}_${val.dgm_id}_${val.ch_type}_${val.ch_id}`, //macid_dgmId_chType_chId
                  eid: `${val.dgm_id}_${val.ch_type}_${val.ch_id}`,
                  val: val.ch_name,
                  count: val.count,
                  status: classList[val.status][1],
                  class: classList[val.status][0],
                  dgm_id: val.dgm_id, // 通道跳转到测点需要用到这个字段
                  ch_type: val.ch_type,
                  ch_id: val.ch_id,
                  isShow: true
                });
                i++;
              }
            }
          })
        } else if (type === 'enter') {
          let name = this.enterName
          for (let key in list) {
            const val = list[key];
            if (val != null && val != undefined) {
              body.push({
                id: `${val.mac_id}_${val.pos_type}_${val.pos_id}`,
                name: name,
                val: val[filed[type]],
                count: val.count,
                status: classList[val.status][1],
                class: classList[val.status][0],
                dgm_type: val.dgm_type, // 机组跳转到测点需要用到这个字段
                isShow: true
              });
            }
          }
        } else {
          list.forEach(val => {
            if (val != null && val != undefined) {
              body.push({
                id: this.tRootContent.indexOf(Number(msg.tRoot)) !== -1 ? val.pumpId : val.macId, // 如果tRoot!==0为pump_id
                // id: msg.tRoot == 1 || msg.tRoot == 2 || msg.tRoot == -1  ? val.pumpId : val.macId, // 如果tRoot!==0为pump_id
                name: msg.name,
                val: val[filed[type]],
                count: val.count,
                status: classList[val.status][1],
                class: classList[val.status][0],
                dgm_type: val.dgm_type, // 机组跳转到测点需要用到这个字段
                isShow: true
              });
            }
          })
        }
        alarmData.head = head;
        alarmData.body = body;
        this.addScrolEvent()
      } else {
        alarmData.noData = {
          isShow: true,
          text: `无数据`
        }
        alarmData.body = [];
      }
    },
    // 设置类名
    setClass (type, dgmType) {
      const classObj = {
        pos: 'my-table-thead-pos',
      }
      const className = dgmType == 1 ? '' : (classObj[type] || '')
      return className
    },
    // 设置当前状态是否被选中
    setCheckClass (bool) {
      return bool
        ? 'iconfont icon-zhongzi_xuanzekuang1'
        : 'iconfont icon-zhongzi_xuanzekuang'
    },
    // 选中(取消)当前报警状态
    checkAlarm (item) {
      item.isCheck = !item.isCheck
      const data = this.alarmData[this.currentIndex]
      if (item.isCheck) {
        const body = data.body
        let isAllCheck = true
        for (let i = 0, l = body.length; i < l; i++) {
          const value = body[i]
          if (!value.isCheck) {
            isAllCheck = false
            break
          }
        }
        if (isAllCheck) {
          data.isCheck = true
        }
      } else {
        data.isCheck = false
      }
    },
    // 全部选中(全部取消)当前报警状态
    checkAll (item) {
      item.isCheck = !item.isCheck
      const body = item.body
      let i = 0
      const l = body.length
      if (item.isCheck) {
        for (; i < l; i++) {
          const value = body[i]
          value.isCheck || (value.isCheck = true)
        }
      } else {
        for (; i < l; i++) {
          const value = body[i]
          value.isCheck && (value.isCheck = false)
        }
      }
    },
    // 获取测点类型
    getPosType (type) {
      const posType = [
        '',
        '转速测点',
        '过程量测点',
        '振动测点',
        '包络测点',
        '数字量测点',
        '晃度测点',
        '温度测点',
        '振动阶次测点',
        '包络阶次测点',
        '工艺量测点',
        '倾覆测点',
        '倾角测点',
        '合成倾角测点',
        '螺栓测点',
      ]
      return posType[++type]
    },
    //滚动翻页
    handleScroll (e) {
      const data = this.alarmData[this.currentIndex];
      if(data.getReal) {
        return
      }
      const scrollDistance = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
      if (scrollDistance <= 0) {//等于0证明已经到底，可以请求接口
        let alarmData = this.alarmData[this.currentIndex]
        if (alarmData.pageNum <= alarmData.totalPage) {
          alarmData.pageNum = alarmData.pageNum + 1;
        }
        let rd = {
          machineId: alarmData.msg.parentId,
          // positionId: Number(alarmData.msg.id),
          // positionType: Number(alarmData.msg.type),
          positionId: alarmData.msg.id,
          positionType: alarmData.msg.type,
          startTime: this.$store.state.srcParams.time.start,
          endTime: this.$store.state.srcParams.time.end,
          num: alarmData.num,
          pageNum: alarmData.pageNum,
          standardTime: alarmData.savetime_com
        }
        if (alarmData.pageNum > 1 && alarmData.pageNum <= alarmData.totalPage) {
          this.$getApi.getPositionAlarmInfo(rd).then((res) => {
            res && this.setData(res, alarmData)
            if (this.searchkeyword && this.searchkeyword !== '') {
              this.search()
            }
          })
        }
      }
    },
    // 请求报警数据
    getData (requestData) {
      let msg = null
      const api = {
        tree: 'getMacAlarmInfoByTidOrMacId',
        mac: 'getMacAlarmInfoByTidOrMacId',
        enter: 'getMacAlarmInfoByTidOrMacId',
        pos: 'getPositionAlarmInfo',
      }
      const time = this.$store.state.srcParams.time
      let rd = {
        startTime: time.start,
        endTime: requestData.getReal ? new Date().getTime() : time.end,
      }
      Object.assign(rd, requestData)
      let alarmData = this.alarmData[this.currentIndex]
      clearTimeout(alarmData.timer);
      if (alarmData.type === 'pos') {
        if (requestData.getReal) {
          alarmData.pageNum = 1
        }
        rd.pageNum = alarmData.pageNum
        rd.num = alarmData.num
        rd.standardTime = alarmData.savetime_com;
        //获取报警数据
        this.$getApi[api[alarmData.type]](rd).then((res) => {
          alarmData.totalPage = res.totalPage
          if (res.alarmList.length > 0) {
            alarmData.savetime_com = res.alarmList[0].savetime_com
          }
          res && this.setData(res, alarmData)
          if (this.searchkeyword && this.searchkeyword !== '') {
            this.search()
          }
          if (requestData.getReal) {
            alarmData.timer = setTimeout(() => {
              this.getData(requestData);
            }, 1000);
          }
          // this.addScrolEvent()
        })
      } else if (alarmData.type === 'tree' || alarmData.type === 'enter') {
        this.$getApi[api[alarmData.type]](rd).then((res) => {
          res && this.setData(res, alarmData)
          if (this.searchkeyword && this.searchkeyword !== '') {
            this.search()
          }
        })
      } else if (alarmData.type === 'mac') {
        this.$getApi[api[alarmData.type]](rd).then((res) => {
          res && this.setData(res, alarmData)
          if (this.searchkeyword && this.searchkeyword !== '') {
            this.search()
          }
        })
        //获取当前mac下的测点列表
        let msg = this.alarmData[this.currentIndex].msg
        let red = {
          mac_id: rd.machineId,
          m_type: msg.m_type,
          t_root: 0,
        }
        this.$getApi
          .queryAllPositionsByMacId(red)
          .then(res1 => {
            let positions = res1.positions
            if (positions && positions.length > 0) {
              let pos = setPosMsg(positions);
              pos.forEach(item => {
                item.name = item.position_name;
                item.isShow = true;
                item.posFlag = `${item.machine_id}_${item.position_id}_${item.position_type}`;
                item.t_root = res1.t_root
                if (item.tt_ch_type == null && item.tt_ch_type == undefined) {
                  item.ch_type = item.tt_ch_type;
                }
                if (item.tt_ch_id == null && item.tt_ch_id == undefined) {
                  item.ch_id = item.tt_ch_id;
                }
              });
              this.$store.commit("getMsg", {
                key: "pos",
                msg: pos,
                keys: rd.machineId
              });
            }
          });
      }
    },
    setChName (item) {
      let name = item
      this.enterName = name
    },
    // 双击进入下一层
    nextAlarm (item) {
      const data = this.alarmData[this.currentIndex]
      const msg = data.msg
      const state = this.$store.state
      let parentId = msg.parentId
      // 通道
      if (data.type === 'enter') {
        const [mId, pType, id] = item.id.split('_')
        let posArr = state.pos[msg.machineId]
        if (!posArr || (posArr && posArr.length <= 0)) {
          this.$pop('当前通道无测点！')
          return;
        }
        for (let i = 0; i < posArr.length; i++) {
          let value = posArr[i]
          if (`${value.machine_id}_${value.position_type}_${value.position_id}` === item.id) {
            this.$store.commit("getCheckMsg", {
              type: "pos",
              msg: value
            });
            break
          }
        }
        let key = `alarm_pos_${mId}_${id}_${pType}`
        if (this.tRootContent.indexOf(Number(msg.tRoot)) !== -1) {
          key = `alarm_pos_${msg.machineId}_${id}_${pType}`
        }
        let name = `${msg.name}-${item.val}-报警日志`
        this.$bus.$emit("choiceChartType", key, name)
        // 机组或组织
      } else if (data.type === 'mac' || data.type === 'tree') {
        const [mId, pType, id] = item.id.split('_')
        const flag = {
          tree: [`alarm_mac_${item.id}`, 'treeId'],
          mac: [`alarm_enter_${item.id}`, 'machineId'], // macid_dgmid_chtype_chid
        }
        let name = `${msg.name}-报警日志`
        if (data.type === 'mac') {
          this.setChName(item.val)
        }
        let macArr = []
        //将数据推入vuex checkMsg
        if (data.type === 'tree') {
          macArr = state.mac[msg.id]
          name = `${msg.name}-${item.val}-报警日志`
        } else if (data.type === 'mac') {
          macArr = state.mac[msg.parentId]
        }
        for (let i = 0; i < macArr.length; i++) {
          let value = macArr[i]
          if (msg.tRoot != 1 && msg.tRoot != 2) {
            if (value.mac_id.toString() === mId.toString()) {
              this.$store.commit("getCheckMsg", {
                type: "mac",
                msg: value
              });
            }
          } else {
            if (value.pump_id.toString() === mId.toString()) {
              this.$store.commit("getCheckMsg", {
                type: "mac",
                msg: value
              });
            }
          }
        }
        const currentMsgObj = {
          tree: 'mac',
          mac: 'enter',
        }
        let key = flag[data.type][0]
        this.$bus.$emit("choiceChartType", key, name)
      }
      //测点报警日志页双击进入趋势图
      else {
        let flag = matchRule(data.msg.type, "wave", data.msg.dgmType, data.msg.tRoot);
        if (!flag) {
          this.$pop("该测点没有波形图");
          return;
        }
        const key = `wave_pos_${data.msg.parentId}_${data.msg.id}_${data.msg.type}`
        this.$store.commit('setCurrentTime', item.time)
        // this.$parent.$parent.$refs.header.choiceChartType(key, '波形频谱图')
        let name = `${msg.name}-波形频谱图`
        this.$bus.$emit("choiceChartType", key, name)
      }
    },
    // 右键菜单
    showContextmenu (item, e) {
      const data = this.alarmData[this.currentIndex]
      const msg = data.msg
      const state = this.$store.state
      /* 获取可以选择的图谱 */
      let text = []
      let info = {
        type: null,
        tree: null,
        mac: null,
        pos: null
      }
      let menuItem = getMenuItem('alarm')
      if (data.type === 'tree') {
        return
      }
      else if (data.type === 'mac') {
        // 机组跳转到组织
        menuItem.val = '组织报警日志'
        info.type = 'tree'
        info.tree = this.$store.getters.getTree(msg.parentId)
        info.mac = this.$store.getters.getMac(msg.parentId, msg.id)
      }
      else if (data.type === 'enter') {
        menuItem.val = '机组报警日志'
        info.type = 'mac'
        info.mac = this.$store.getters.getMac(msg.treeId, msg.machineId)
      }
      else {
        menuItem.val = '机组报警日志'
        info.type = 'mac'
        info.mac = this.$store.getters.getMac(msg.treeId, msg.machineId)
        info.pos = this.$store.getters.getPos(msg.machineId, msg.type, msg.id)
      }
      text.push(menuItem)
      if (data.type === 'pos') {
        text = text.concat(getMenus(['trend', 'wave', 'real']))
      }
      // 显示右键菜单
      showRightMenu(this, e, text, info)
    },
    // 设置右键菜单
    // 暂时废弃
    setList (e) {
      const handleName = [
        '确认',
        '拒绝',
        '拒绝且屏蔽',
        '维护',
        '重置',
        '修改门限',
      ]
      const text = []
      for (let i = 0; i < 6; i++) {
        const name = handleName[i]
        text.push({
          val: name,
        })
      }
      this.$list({
        pattern: {
          width: '150px',
          maxHeight: 'auto',
          left: `${e.x}px`,
          top: `${e.y}px`,
        },
        text,
      }).then((res) => {
        // this.handleAlarm(res.item, res.index);
      })
    },
    // 选中右键菜单列表
    handleAlarm (item, index) {
      if (index > -1) {
        /* const handleName = ['确认', '拒绝', '拒绝且屏蔽', '维护', '重置', '修改门限'];
        const body = this.alarmData[this.currentIndex].body;
        const checkAlarm = [];
        for (let i = 0, l = body.length; i < l; i++) {
           const value = body[i];
           if (value.isCheck) {
              checkAlarm.push(cloneObj(value, true));
           }
        } */
      }
    },
    // 数据检索
    dataRetrieval () {
      const currentKey = this.currentIndex
      const data = this.alarmData[currentKey]
      const currentMsg = data.msg
      const [, , pId, id, type, ch_id] = currentKey.split('_')
      const viewMsg = {
        type: data.type,
        name: currentMsg.name,
        key: pId,
        parentId: currentMsg.parentId,
        mid: pId,
      }
      if (data.type === 'pos') {
        viewMsg.key = `${pId}_${id}_${type}`
        viewMsg.ch_type = currentMsg.ch_type
        viewMsg.dgm_id = currentMsg.dgm_id
        viewMsg.ch_id = currentMsg.ch_id
      }
      if (data.type === 'enter') {
        viewMsg.key = `${id}_${type}_${ch_id}`
      }
      this.$retrieval({
        key: 'alarm',
        viewMsg,
      }).then((res) => {
        if (res) {
          const msg = res.msg
          const rd = this.getRequestData(data)
          this.getData(rd)
        }
      })
    },
    getRequestData (data) {
      const currentMsg = data.msg
      const rd = {
        getReal: data.getReal,
        timer: data.timer
      }
      switch (data.type) {
        case 'tree':
          rd.treeId = currentMsg.id
          rd.type = 0
          rd.t_root = currentMsg.tRoot
          break
        case 'mac':
          rd.machineId = currentMsg.machineId
          rd.pumpId = currentMsg.pumpId
          rd.type = 1
          rd.t_root = currentMsg.tRoot
          break
        case 'enter':
          rd.dgm_id = currentMsg.dgm_id
          rd.ch_type = currentMsg.ch_type
          rd.ch_id = currentMsg.ch_id
          rd.type = 2
          rd.pumpId = currentMsg.pumpId
          rd.machineId = currentMsg.machineId
          rd.t_root = currentMsg.tRoot
          break
        case 'pos':
          rd.machineId = currentMsg.macid
          rd.positionId = currentMsg.id
          rd.positionType = currentMsg.type
          rd.standardTime = -1
      }
      return rd
    },
    // 数据导出
    dataExport () {
      let data = this.alarmData[this.currentIndex]
      let exportHead = []
      let exportBody = []
      if (data.type === 'tree') {
        exportHead = ['机组名称', '报警次数', '报警类型']
        for (let k = 0; k < data.body.length; k++) {
          exportBody.push({
            机组名称: data.body[k].val,
            报警次数: data.body[k].count,
            报警类型: data.body[k].status,
          })
        }
      } else if (data.type === 'mac') {
        exportHead = ['通道名称', '报警次数', '报警类型']
        for (let k = 0; k < data.body.length; k++) {
          exportBody.push({
            通道名称: data.body[k].val,
            报警次数: data.body[k].count,
            报警类型: data.body[k].status,
          })
        }
      } else if (data.type === 'enter') {
        exportHead = ['测点名称', '报警次数', '报警类型']
        for (let k = 0; k < data.body.length; k++) {
          exportBody.push({
            测点名称: data.body[k].val,
            报警次数: data.body[k].count,
            报警类型: data.body[k].status,
          })
        }
      } else if (data.type === 'pos' && data.msg.tRoot === 2) {
        if (data.msg.dgmType !== 1) {
          exportHead = ['序号', '事件时间', '事件描述', '报警类型', '报警值', 'Ⅱ级报警(高)', 'Ⅰ级报警(高)', '预警(高)', '预警(低)', 'Ⅰ级报警(低)', 'Ⅱ级报警(低)']
          for (let k = 0; k < data.body.length; k++) {
            exportBody.push({
              序号: data.body[k].order,
              事件时间: data.body[k].viewTime,
              事件描述: data.body[k].eventType,
              报警类型: data.body[k].alarmType,
              报警值: data.body[k].value,
              'Ⅱ级报警(高)': data.body[k].alarmHh,
              'Ⅰ级报警(高)': data.body[k].alarmH,
              '预警(高)': data.body[k].warningH,
              '预警(低)': data.body[k].warningL,
              'Ⅰ级报警(低)': data.body[k].alarmL,
              'Ⅱ级报警(低)': data.body[k].alarmLl,
            })
          }
        } else {
          exportHead = ['序号', '事件时间', '事件描述']
          for (let k = 0; k < data.body.length; k++) {
            exportBody.push({
              序号: data.body[k].order,
              事件时间: data.body[k].viewTime,
              事件描述: data.body[k].eventType,
            })
          }
        }
      } else if (data.type === 'pos' && data.msg.tRoot !== 2) {
        if (data.msg.dgmType !== 1) {
          exportHead = [
            '序号',
            '事件时间',
            '事件描述',
            '工况类型',
            '报警类型',
            '报警值',
            '报警(高)',
            '预警(高)',
            '报警(低)',
            '预警(低)',
          ]
          for (let k = 0; k < data.body.length; k++) {
            exportBody.push({
              序号: data.body[k].order,
              事件时间: data.body[k].viewTime,
              事件描述: data.body[k].eventType,
              工况类型: data.body[k].cond,
              报警类型: data.body[k].alarmType,
              报警值: data.body[k].value,
              '报警(高)': data.body[k].alarmH,
              '预警(高)': data.body[k].warningH,
              '报警(低)': data.body[k].alarmL,
              '预警(低)': data.body[k].warningL,
            })
          }
        } else {
          exportHead = ['序号', '事件时间', '事件描述']
          for (let k = 0; k < data.body.length; k++) {
            exportBody.push({
              序号: data.body[k].order,
              事件时间: data.body[k].viewTime,
              事件描述: data.body[k].eventType,
            })
          }
        }
      }
      var Parser = require('json2csv').Parser
      let json2csvParser = new Parser({ exportHead })
      let csv = json2csvParser.parse(exportBody)
      csv = '\ufeff' + csv
      var aTag = document.createElement('a')
      var blob = new Blob([csv])
      aTag.download = `${data.msg.fileName}_报警日志.csv`
      aTag.href = URL.createObjectURL(blob)
      aTag.click()
      URL.revokeObjectURL(blob)
    },
    /* 查询功能 */
    search () {
      let search = this.searchkeyword
      let data = this.alarmData[this.currentIndex].body
      let type = this.alarmData[this.currentIndex].type
      let searchFiled = {}
      if (type === 'tree' || type === 'mac' || type === 'enter') {
        searchFiled = { val: data.val, status: data.status }
      } else if (
        type === 'pos' &&
        this.alarmData[this.currentIndex].msg.dgmType !== 1
      ) {
        searchFiled = {
          eventType: data.eventType,
          cond: data.cond,
          alarmType: data.alarmType,
        }
      } else if (type === 'pos' && this.alarmData[this.currentIndex].msg.dgmType === 1) {
        searchFiled = { eventType: data.eventType }
      }
      this.alarmData[this.currentIndex].body.forEach((data) => {
        data.isShow = false
      })
      this.alarmData[this.currentIndex].body.forEach((data) => {
        Object.keys(searchFiled).some((key) => {
          if (String(data[key]).toLowerCase().indexOf(search) > -1) {
            data.isShow = true
            return
          }
        })
      })
    },
  },
}
