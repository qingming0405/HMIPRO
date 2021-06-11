import {
  cloneObj,
  getTime,
  round,
  setHead,
  addClass,
  removeClass,
  getUnit,
  getUnit1,
  unitTransformation,
  getdefaultCode,
  realCode,
  realCodeName,
  realCodeList
} from "utils/utils.js";

import { getMenus, showRightMenu } from 'common/menus/Menus.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: "real",
  data () {
    return {
      realData: {}, /* 实时数据信息 */
      Data: {},/* 上一次请求数据 */
    };
  },
  watch: {
    "$store.state.realMsg": {
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
    this.realData[this.currentKey].isActive = false
  },
  methods: {
    // 打开历史数据
    openChartList (key, type, delKey) {
      if (typeof key !== "string") return;
      let [, , mId, id, pType] = key.split("_");
      const keyArr = Object.keys(this.realData);
      const state = this.$store.state;
      if (type === 0 || type === 1) {
        this.currentIndex = keyArr.indexOf(key);
        this.currentKey = key;
        for (let k in this.realData) {
          // 若关闭3s刷新，需要清除所有定时器
          if (config.tsRefresh == 0) {
            k !== key && clearTimeout(this.realData[k].timer);
          }
          // k !== key && clearTimeout(this.realData[k].timer);
          this.realData[k].isShow = false;
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length;
          const mac = cloneObj(state.checkMsg.mac, true);
          const typePosObj = this.getTypePosObj(mac.machine_id) // 包含相关类型的测点
          const pos = cloneObj(state.checkMsg.pos, true);
          if (pType == 12) pType = 13;
          const isMMS2 =
            bothConfig.mms2.indexOf(state.checkMsg.tree.t_id.toString()) !== -1;
          let head = realCodeList(state.checkMsg.tree.t_root,
            pos.dgm_type,
            pType,
            pos.pos_loc
          ) // 当前特征值列表
          let codeObj = {} // 总特征值表对象
          let code = realCode(pos.position_type, pos.pos_loc)
          codeObj[code] = head
          this.$set(this.realData, key, {
            isShow: true,
            t_root: state.checkMsg.tree.t_root,
            mac,
            macName: mac.m_me,
            typePosObj,
            tId: mac.t_id,
            mId,
            pos,
            head,
            codeObj,
            curCode: code,
            posInfo: [], //每一行测点的信息
            body: [],
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: `无数据`
            },
            getReal: true,
            timer: null,
            requestData: {
              machineId: mId,
              positionType: pType,
              time: 0,
              t_root: mac.t_root
            },
            lastData: {},/* 上一次不同时间的数据保存 */
            isMMS2: isMMS2 /* 趋势图单位是否要处理为mm/s2 */,
            isActive: true,/* 是否焦距当前页面 */
          });
          this.Data[this.currentKey] = {}
          this.getData(this.currentKey);
          break;
        case 1 /* 切换图表 */:
          this.realData[key].isShow = true;
          this.realData[this.currentKey].isActive = true
          //将头部的栏目移动到开始位置
          this.scrollBar();
          // 若关闭3s刷新，切换之前判断是否需要获取实时数据
          if (config.tsRefresh == 0) {
            if (this.realData[key].getReal) {
              this.getData(this.currentKey);
            }
          }

          break;
        case 2 /* 关闭图表 */:
          clearTimeout(this.realData[key].timer);
          this.$delete(this.realData, key);
          this.$delete(this.Data, key);
          break;
      }
    },
    // 获取典型测点表
    getTypePosObj (machineId) {
      let typePosObj = {}
      this.$store.state.pos[machineId].forEach(pos => {
        let code = realCode(pos.position_type, pos.pos_loc)
        if (pos.position_type < 200 && code !== '' && !typePosObj.hasOwnProperty(code)) {
          typePosObj[code] = { code, pos }
        }
      });
      return typePosObj
    },
    // 获取实时数据
    getData (key) {
      let realData = this.realData[key];
      let requestData = realData.requestData;
      let pos = realData.pos;
      if (pos.pos_loc) {
        requestData.tt_pos_loc = pos.pos_loc;
      }
      if (this.realData[key].isActive) {
        this.$getApi.getRealMap(requestData).then(res => {
          if (res) {
            clearTimeout(realData.timer);
            if (res.list && res.list.length > 0) {
              realData.empty.isShow = false;
              this.setData(res, key);
              let tsRefresh = config.tsRefresh == 1
              let time = 1000
              if (tsRefresh) {
                // 若开启3s刷新则定时器时间更改为3s
                time = 3000
              }
              realData.timer = setTimeout(() => {
                this.getData(key);
              }, time);
            } else {
              realData.getReal = false;
              realData.empty.isShow = true;
            }
          }
        });
      } else {
        let tsRefresh = config.tsRefresh == 1
        if (tsRefresh) {
          let time = 1000
          if (tsRefresh) {
            // 若开启3s刷新则定时器时间更改为3s
            time = 3000
          }
          realData.timer = setTimeout(() => {
            this.getData(key);
          }, time);
        }
      }
    },
    // 组合数据
    setData (data, key) {
      /* list 没数据的测点不返回 */
      let realData = this.realData[key];
      let head = realData.head;
      let body = [];
      let posInfo = [];
      let lastData = realData.lastData
      let tsRefresh = config.tsRefresh == 1
      for (let i = 0, len = data.list.length; i < len; i++) {
        let list = data.list[i];
        posInfo[i] = list;
        let posArray = this.$store.state.pos[list.mac_id];
        posArray.forEach(el => {
          if (el.posFlag == `${list.mac_id}_${list.pos_id}_${list.pos_type}`) {
            const specCode = [
              2000,
              3000,
              4000,
              19000
            ]; /* 若isMMS2为true（配置）,这些特征徐需要转换单位为mm/s² */
            const defaultCode = getdefaultCode(el.dgm_type)
            const eigenvalue = defaultCode[list.pos_type];
            if (
              realData.isMMS2 &&
              getUnit(eigenvalue.code, el) == "g" &&
              specCode.indexOf(eigenvalue.code) != -1
            ) {
              list.unit = "mm/s²";
            } else {
              if (
                (list.dgm_type == 3 || list.dgm_type == 4) &&
                list.pos_type == 3
              ) {
                list.unit = getUnit1(el.units.byIntegral, el.units.unitName[0]);
              } else {
                list.unit = getUnit(eigenvalue.code, el);
              }
            }
          }
        });
        body[i] = [
          {
            isShow: true,
            val: list.pos_name,
            unit: list.unit,
            class: this.getAlarmClass(list.alarmStatus, realData.t_root)
          }
        ];
        for (let j = 1; j < head.length; j++) {
          let value = head[j];
          /* 倾角的实时数据做一个转化 */
          let vFiled = value.filed.toLowerCase();
          if (list.pos_type == 12) {
            if (vFiled == "overturn_rms") {
              vFiled = "rock_rms";
            }
            if (vFiled == "overturn_p") {
              vFiled = "rock_p";
            }
            if (vFiled == "overturn_pp") {
              vFiled = "rock_pp";
            }
            if (vFiled == "overturn_s") {
              vFiled = "rock_s";
            }
          }
          let v = list[vFiled];
          if (!tsRefresh) {
            // 若没有开启3s刷新
            if (value.filed === "saveTime_Com" || value.filed === "time") {
              if (list[value.filed]) {
                //saveTime_Com 时间
                body[i].push({
                  isShow: value.isShow,
                  val: getTime(list[value.filed]),
                });
              } else {
                body[i].push({
                  isShow: value.isShow,
                  val: "无数据"
                });
              }
            } else if (
              list.dgm_type == 1 &&
              list.pos_type == 11 &&
              (value.filed == "overturn_p" ||
                value.filed == "overturn_pp" ||
                value.filed == "overturn_s")
            ) {
              value.isShow = false;
            } else if (
              value.filed == "part_name0" ||
              value.filed == "part_name1" ||
              value.filed == "part_name2" ||
              value.filed == "part_name3" ||
              value.filed == "part_name4" ||
              value.filed == "part_name5" ||
              value.filed == "part_name6" ||
              value.filed == "part_name7" ||
              value.filed == "part_name8" ||
              value.filed == "part_name9"
            ) {
              if (list[value.filed]) {
                //saveTime_Com 时间
                body[i].push({
                  isShow: value.isShow,
                  val: list[value.filed]
                });
              } else {
                body[i].push({
                  isShow: value.isShow,
                  val: "无数据"
                });
              }
            } else if (value.code == 27000 && list.pos_type == 10 && realData.pos.t_root == 3) {
              value.unit = null;
              let val;
              if (v >= 100000000) {
                val = "无数据";
              } else if (v === undefined || v === null) {
                val = "无数据";
              } else {
                let unitNum = parseInt(list.unitNum);
                if (!isNaN(unitNum)) {
                  val = round(v, unitNum);
                } else {
                  val = round(v, 4);
                }
                if (list.units && list.units.unitName) {
                  val = val + list.units.unitName[0];
                }
              }
              body[i].push({
                isShow: value.isShow,
                val: val
              });
            } else if (v || v === 0) {
              let val;
              if (v >= 100000000) {
                val = "无数据";
              } else {
                // let oneDecimal = ["speed_value", "speed", "gap", "sv"]; // 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
                let oneDecimal = [16000, 1000, 14000, 46000]// 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
                let m = ["overturn_s", "rock_s"]; ///* 改变单位mm->m */
                const specCode = [
                  "vib_p",
                  "vib_rms",
                  "vib_pp",
                  "pow_rms"
                ]; /* 若isMMS2为true（配置）,这些特征徐需要转换单位为mm/s² */
                if (m.includes(value.filed)) {
                  val = unitTransformation(v);
                } else if (oneDecimal.includes(value.code)) {
                  val = round(v, 1);
                } else if (specCode.includes(value.filed)) {
                  if (
                    realData.isMMS2 &&
                    (list.unit == "mm/s²" || list.unit == "gD")
                  ) {
                    val = round(v * 9807, 4);
                  } else {
                    val = round(v, 4);
                  }
                } else {
                  val = round(v, 4);
                }
              }
              body[i].push({
                isShow: value.isShow,
                val
              });
            } else {
              body[i].push({
                isShow: value.isShow,
                val: "无数据"
              });
            }
          } else {
            // 开启实时数据3s刷新
            // 当前数据与上一次请求存储saveTime_Com一致则说明非第一次请求且与为同一波数据，lastData存在则说明存在一波旧数据，时间进行+3s的处理
            if (this.Data[key] && this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`] && this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`].saveTime_Com == list.saveTime_Com && lastData && lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`]
            ) {
              if (value.filed === "saveTime_Com" || value.filed === "time") {
                if (list[value.filed]) {
                  // lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`].time = lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`].time + 3000
                  let time = new Date().getTime() - 2000;
                  //saveTime_Com 时间
                  body[i].push({
                    isShow: value.isShow,
                    val: getTime(time),//getTime(lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`].time),
                  });
                } else {
                  body[i].push({
                    isShow: value.isShow,
                    val: "无数据"
                  });
                }
              } else if (
                list.dgm_type == 1 &&
                list.pos_type == 11 &&
                (value.filed == "overturn_p" ||
                  value.filed == "overturn_pp" ||
                  value.filed == "overturn_s")
              ) {
                value.isShow = false;
              } else if (
                value.filed == "part_name0" ||
                value.filed == "part_name1" ||
                value.filed == "part_name2" ||
                value.filed == "part_name3" ||
                value.filed == "part_name4" ||
                value.filed == "part_name5" ||
                value.filed == "part_name6" ||
                value.filed == "part_name7" ||
                value.filed == "part_name8" ||
                value.filed == "part_name9"
              ) {
                if (list[value.filed]) {
                  //saveTime_Com 时间
                  body[i].push({
                    isShow: value.isShow,
                    val: list[value.filed]
                  });
                } else {
                  body[i].push({
                    isShow: value.isShow,
                    val: "无数据"
                  });
                }
              } else if (value.code == 27000 && list.pos_type == 10 && realData.pos.t_root == 3) {
                // 转速无需做处理
                if (vFiled != 'speed') {
                  // if (`21050816440112845_11_3` == `${list.mac_id}_${list.pos_id}_${list.pos_type}` && lastData[`21050816440112845_11_3`] && vFiled == 'vib_rms') {
                  //   console.log(list[vFiled], lastData[`21050816440112845_11_3`].vib_rms)
                  // }
                  v = (list[vFiled] + lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`][vFiled]) / 2
                  lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`][vFiled] = v
                }
                value.unit = null;
                let val;
                if (v >= 100000000) {
                  val = "无数据";
                } else if (v === undefined || v === null) {
                  val = "无数据";
                } else {
                  let unitNum = parseInt(list.unitNum);
                  if (!isNaN(unitNum)) {
                    val = round(v, unitNum);
                  } else {
                    val = round(v, 4);
                  }
                  if (list.units && list.units.unitName) {
                    val = val + list.units.unitName[0];
                  }
                }
                body[i].push({
                  isShow: value.isShow,
                  val: val
                });
              } else if (v || v === 0) {
                let val;
                if (v >= 100000000) {
                  val = "无数据";
                } else {
                  // 转速无需做处理
                  if (vFiled != 'speed') {
                    // if (`21050816440112845_11_3` == `${list.mac_id}_${list.pos_id}_${list.pos_type}` && lastData[`21050816440112845_11_3`] && vFiled == 'vib_rms') {
                    //   console.log(list[vFiled], lastData[`21050816440112845_11_3`].vib_rms)
                    // }
                    v = (list[vFiled] + lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`][vFiled]) / 2
                    lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`][vFiled] = v
                  }
                  // let oneDecimal = ["speed_value", "speed", "gap", "sv"]; // 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
                  let oneDecimal = [16000, 1000, 14000, 46000]// 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
                  let m = ["overturn_s", "rock_s"]; ///* 改变单位mm->m */
                  const specCode = [
                    "vib_p",
                    "vib_rms",
                    "vib_pp",
                    "pow_rms"
                  ]; /* 若isMMS2为true（配置）,这些特征徐需要转换单位为mm/s² */
                  if (m.includes(value.filed)) {
                    val = unitTransformation(v);
                  } else if (oneDecimal.includes(value.code)) {
                    val = round(v, 1);
                  } else if (specCode.includes(value.filed)) {
                    if (
                      realData.isMMS2 &&
                      (list.unit == "mm/s²" || list.unit == "gD")
                    ) {
                      val = round(v * 9807, 4);
                    } else {
                      val = round(v, 4);
                    }
                  } else {
                    val = round(v, 4);
                  }
                }
                body[i].push({
                  isShow: value.isShow,
                  val
                });
              } else {
                body[i].push({
                  isShow: value.isShow,
                  val: "无数据"
                });
              }
            } else {
              // 开启3s刷新,保存数据时间不一致，直接处理数据
              if (value.filed === "saveTime_Com" || value.filed === "time") {
                if (list[value.filed]) {
                  //saveTime_Com 时间
                  let time = new Date().getTime() - 2000;
                  body[i].push({
                    isShow: value.isShow,
                    val: getTime(time),
                  });
                } else {
                  body[i].push({
                    isShow: value.isShow,
                    val: "无数据"
                  });
                }
              } else if (
                list.dgm_type == 1 &&
                list.pos_type == 11 &&
                (value.filed == "overturn_p" ||
                  value.filed == "overturn_pp" ||
                  value.filed == "overturn_s")
              ) {
                value.isShow = false;
              } else if (
                value.filed == "part_name0" ||
                value.filed == "part_name1" ||
                value.filed == "part_name2" ||
                value.filed == "part_name3" ||
                value.filed == "part_name4" ||
                value.filed == "part_name5" ||
                value.filed == "part_name6" ||
                value.filed == "part_name7" ||
                value.filed == "part_name8" ||
                value.filed == "part_name9"
              ) {
                if (list[value.filed]) {
                  //saveTime_Com 时间
                  body[i].push({
                    isShow: value.isShow,
                    val: list[value.filed]
                  });
                } else {
                  body[i].push({
                    isShow: value.isShow,
                    val: "无数据"
                  });
                }
              } else if (value.code == 27000 && list.pos_type == 10 && realData.pos.t_root == 3) {
                value.unit = null;
                let val;
                if (v >= 100000000) {
                  val = "无数据";
                } else if (v === undefined || v === null) {
                  val = "无数据";
                } else {
                  let unitNum = parseInt(list.unitNum);
                  if (!isNaN(unitNum)) {
                    val = round(v, unitNum);
                  } else {
                    val = round(v, 4);
                  }
                  if (list.units && list.units.unitName) {
                    val = val + list.units.unitName[0];
                  }
                }
                body[i].push({
                  isShow: value.isShow,
                  val: val
                });
              } else if (v || v === 0) {
                let val;
                if (v >= 100000000) {
                  val = "无数据";
                } else {
                  // let oneDecimal = ["speed_value", "speed", "gap", "sv"]; // 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
                  let oneDecimal = [16000, 1000, 14000, 46000]// 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
                  let m = ["overturn_s", "rock_s"]; ///* 改变单位mm->m */
                  const specCode = [
                    "vib_p",
                    "vib_rms",
                    "vib_pp",
                    "pow_rms"
                  ]; /* 若isMMS2为true（配置）,这些特征徐需要转换单位为mm/s² */
                  if (m.includes(value.filed)) {
                    val = unitTransformation(v);
                  } else if (oneDecimal.includes(value.code)) {
                    val = round(v, 1);
                  } else if (specCode.includes(value.filed)) {
                    if (
                      realData.isMMS2 &&
                      (list.unit == "mm/s²" || list.unit == "gD")
                    ) {
                      val = round(v * 9807, 4);
                    } else {
                      val = round(v, 4);
                    }
                  } else {
                    val = round(v, 4);
                  }
                }
                body[i].push({
                  isShow: value.isShow,
                  val
                });
              } else {
                body[i].push({
                  isShow: value.isShow,
                  val: "无数据"
                });
              }
            }
          }
        }

        if (tsRefresh) {
          /* 
            this.Data存储每次改变后的数据
            若this.Data无数据，则代表本次数据为第一次请求数据，存储入lastData（上一次的数据）与this.Data
            若this.Data存在数据，则判断saveTime_Com是否一致，若一致则说明是旧数据,若不一致则保存新数据;
          */
          if (this.Data[key] && this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`]) {
            if (Number(this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`].saveTime_Com) < Number(list.saveTime_Com)) {
              lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`] = this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`]
              // lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`].time = lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`].saveTime_Com
              // if (`21050816440112845_11_3` == `${list.mac_id}_${list.pos_id}_${list.pos_type}`) {
              //   console.log('更换后：' + lastData[`21050816440112845_11_3`].vib_rms)
              // }
              this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`] = list
            }
          } else if (!this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`]) {
            this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`] = list
            lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`] = this.Data[key][`${list.mac_id}_${list.pos_id}_${list.pos_type}`]
            // lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`].time = lastData[`${list.mac_id}_${list.pos_id}_${list.pos_type}`].saveTime_Com
          }
        }
      }
      realData.lastData = lastData
      realData.body = body;
      realData.posInfo = posInfo;
    },
    getAlarmClass (alarmStatus, t_root) {
      switch (alarmStatus) {
        case 2:
          return t_root === 2 ? 'warn-TMS-text' : 'warning-text'
        case 3:
          return t_root === 2 ? 'alarm1-TMS-text' : 'alarm-text'
        case 4:
          return 'alarm-text'
        default:
          return ''
      }
    },
    // 拖动tbody，调整thead,切换图谱他时候将 标签放置
    scrollBar (e) {
      if (e) {
        const tag = e.target;
        this.$refs.realHeadTr[this.currentIndex].style.left =
          -1 * tag.scrollLeft + "px";
      } else {
        this.$refs.realHeadTr[this.currentIndex].style.left = "0px";
      }
    },
    // 数据检索
    dataRetrieval () {
      const data = this.realData[this.currentKey];
      const pos = data.pos
      let code = realCode(pos.position_type, pos.pos_loc)
      this.$retrieval({
        key: "real",
        viewMsg: {
          macName: data.macName,
          posTypeObj: {
            val: realCodeName(code),
            code,
            posTypeList: this.getPosTypeList(data.typePosObj)
          },
          tId: data.tId,
          mId: data.mId,
          eigenvalue: data.head.slice(2),
          codeObj: data.codeObj,
          t_root: data.t_root,
          typePosObj: data.typePosObj
        }
      }).then(res => {
        if (res) {
          if (res.mId !== data.mId) {
            this.getData(this.currentKey);
          }
          else if (res.curCode !== data.curCode) {
            data.curCode = res.curCode
            data.pos = data.typePosObj[data.curCode].pos
            data.head = data.codeObj[data.curCode]
            data.requestData.positionType = data.pos.position_type
            this.getData(this.currentKey)
          }
        }
      });
    },
    // 可用的测点类型下拉列表
    getPosTypeList (typePosObj) {
      let codes = Object.keys(typePosObj)
      return codes.map(code => {
        return { val: realCodeName(code), code }
      })
    },
    // 是否获取实时数据
    getRealData (e) {
      let tag = e.currentTarget;
      const data = this.realData[this.currentKey];
      data.getReal = !data.getReal;
      if (data.getReal) {
        this.getData(this.currentKey);
        removeClass(tag, "disable-btn");
      } else {
        clearTimeout(data.timer);
        addClass(tag, "disable-btn");
      }
    },
    // 右键菜单
    showContextmenu (e, item, posInfo) {
      let time = item[1].val === '无数据' ? new Date().getTime() : new Date(item[1].val).getTime()
      let pos = this.$store.getters.getPos(posInfo.mac_id, posInfo.pos_type, posInfo.pos_id)
      let text = getMenus(['trend', 'wave', 'history', 'alarm'])
      let info = {
        type: 'pos',
        tree: null,
        mac: null,
        pos,
        time
      }
      showRightMenu(this, e, text, info)
    },
    turnToTrend (posInfo) {
      //跳转到趋势图
      if (posInfo) {
        let key = `${posInfo.mac_id}_${posInfo.pos_id}_${posInfo.pos_type}`;
        key = "trend_pos_" + key;
        this.$bus.$emit("choiceChartType", key, "趋势图");
      }
    }
  },
  created () {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "real"
    });
  },

};
