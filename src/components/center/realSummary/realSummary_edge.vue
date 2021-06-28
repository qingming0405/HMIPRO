<template>
  <div class="my-summary-table">
    <!--实时数据汇总列表 -->
    <div
      class="nav_wrap"
      v-for="(item, key) in summaryData"
      v-show="item.isShow"
    >
      <ul class="nav_mine my-summary-head" :class="`scroll-${key}`">
        <li
          :class="`nav_item my-summary-head-item my-summary-item-col-${headItem.index}`"
          v-for="headItem in head"
          v-show="!item.empty.isShow && headItem.isShow"
        >
          {{ headItem.name }}
        </li>
      </ul>
      <div
        class="my-summary-body"
        @scroll="scrollBar($event, key, item)"
        :ref="key"
      >
        <ul
          class="nav_mine my-summary-item tree-color"
          v-for="(tree, tIndex) in item.treeArr"
        >
          <div
            class="nav_item cell my-summary-item-col-0 item column3"
            :title="tree.tName"
            :class="`e-color-${tIndex % 2}`"
            :style="{ height: tree.treeHeight, lineHeight: tree.treeHeight }"
          >
            {{ tree.tName }}
          </div>
          <div class="nav_item">
            <ul class="pump-color" v-for="(pump, pIndex) in tree.pumpsArr">
              <div
                class="my-summary-item-col-1 item column3"
                :title="pump.pump_name"
                :class="`e-color-${(pIndex + tIndex) % 2}`"
                :style="{
                  height: pump.pumpHeight,
                  lineHeight: pump.pumpHeight,
                }"
              >
                {{ pump.pump_name }}
              </div>
              <div
                class="my-summary-item-col-2 item item-zhenduan column3"
                :style="{ height: pump.pumpHeight }"
                :class="`e-color-${pIndex % 2}`"
                v-show="head[2].isShow"
              >
                {{ pump.result }}
              </div>
              <div>
                <ul class="pos-color" v-for="(pos, posIndex) in pump.posArr">
                  <div
                    class="my-summary-item-col-3 item item-qushi column3"
                    :style="{
                      height: pos.posHeight,
                    }"
                    :class="`e-color-${posIndex % 2}`"
                    @click="turnToTrend(pos)"
                    @contextmenu.prevent="showContextmenu($event, pos)"
                  >
                    {{ pos.pos_name }}
                  </div>
                  <div
                    class="my-summary-item-col-11 item item-qushi column3"
                    :style="{
                      height: pos.posHeight,
                    }"
                    :class="`e-color-${posIndex % 2}`"
                    v-show="head[4].isShow"
                    @contextmenu.prevent="showContextmenu($event, pos)"
                  >
                    {{ pos.avg }}
                  </div>
                  <div
                    class="my-summary-item-col-4 item item-qushi column3"
                    :style="{
                      height: pos.posHeight,
                    }"
                    :class="`e-color-${posIndex % 2}`"
                    @click="statusButtonClick(pos, pos.trendStatus, pos.statusId)"
                    @contextmenu.prevent="showContextmenu($event, pos)"
                  >
                    {{ pos.status }}
                  </div>
                  <div
                    class="my-summary-item-col-12 item item-qushi column3"
                    :style="{
                      height: pos.posHeight,
                    }"
                    :class="`e-color-${posIndex % 2}`"
                    @click="statusButtonClick(pos, pos.hStatus, pos.hId)"
                    @contextmenu.prevent="showContextmenu($event, pos)"
                    v-show="head[6].isShow"
                  >
                    {{ pos.h }}
                  </div>
                  <div
                    class="my-summary-item-col-13 item item-qushi column3"
                    :style="{
                      height: pos.posHeight,
                    }"
                    :class="`e-color-${posIndex % 2}`"
                    @click="statusButtonClick(pos, pos.hhStatus, pos.hhId)"
                    @contextmenu.prevent="showContextmenu($event, pos)"
                    v-show="head[7].isShow"
                  >
                    {{ pos.hh }}
                  </div>
                  <div class="">
                    <ul v-for="(e, eIndex) in pos.e" v-show="e.isShow">
                      <li
                        class="my-summary-item-col-5 item column3"
                        :class="`e-color-${posIndex % 2}`"
                      >
                        {{ e.val }}
                      </li>
                      <li
                        class="my-summary-item-col-6 item column3"
                        :class="`e-color-${posIndex % 2}`"
                      >
                        {{ e.realData }}
                      </li>
                      <li
                        class="my-summary-item-col-7 item column3"
                        :class="`e-color-${posIndex % 2}`"
                      >
                        {{ e.h }}
                      </li>
                      <li
                        class="my-summary-item-col-8 item column3"
                        :class="`e-color-${posIndex % 2}`"
                      >
                        {{ e.hh }}
                      </li>
                      <li
                        class="my-summary-item-col-9 item column3"
                        :class="`e-color-${posIndex % 2}`"
                        v-show="head[12].isShow"
                      >
                        {{ e.l }}
                      </li>
                      <li
                        class="my-summary-item-col-10 item column3"
                        :class="`e-color-${posIndex % 2}`"
                        v-show="head[13].isShow"
                      >
                        {{ e.ll }}
                      </li>
                    </ul>
                  </div>
                </ul>
              </div>
            </ul>
          </div>
        </ul>
      </div>

      <div class="none-data-box" v-show="item.empty.isShow">
        <span>{{ item.empty.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  setHead,
  defaultCode1,
  getTime,
  getUnit,
  defaultCode,
  round,
} from "utils/utils.js";
import { getMenus, showRightMenu } from "common/menus/Menus.js";

export default {
  name: "realSummary",
  data() {
    return {
      currentKey: "",
      summaryData: {},
      head: [],
      noData: true,
      t_root: 0, //当前组织的组织类型
      timer: null,
      isGetData: false, //是否请求来数据的标识
    };
  },
  watch: {
    "$store.state.realSummaryMsg": {
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
    t_root: {
      handler(value) {
        /* 根据组织类型来判断显示的头 */
        //油井
        if (this.t_root == 3) {
          this.head = [
            { name: this.$t("Common.tree"), isShow: true, index: 0 }, //组织
            { name: this.$t("realSummary.equipment"), isShow: true, index: 1 }, //设备
            {
              name: this.$t("realSummary.diagnosticResult"),
              isShow: false,
              index: 2,
            }, //诊断结果
            { name: this.$t("Common.pos"), isShow: true, index: 3 }, //测点
            {
              name: this.$t("realSummary.TrendAverage"),
              isShow: false,
              index: 11,
            }, //趋势增长平均值
            {
              name: this.$t("realSummary.TrendAlarmPushStatus"),
              isShow: true,
              index: 4,
            }, //趋势报警推送状态
            {
              name: this.$t("realSummary.warnPushStatus"),
              isShow: false,
              index: 12,
            }, //预警推送状态
            {
              name: this.$t("realSummary.AlarmPushStatus"),
              isShow: false,
              index: 13,
            }, //报警推送状态
            {
              name: this.$t("realSummary.EigenvalueType"),
              isShow: true,
              index: 5,
            }, //特征值类型
            { name: this.$t("realSummary.Eigen"), isShow: true, index: 6 }, //特征值
            { name: this.$t("realSummary.WarnH"), isShow: true, index: 7 }, //预警值(高)
            { name: this.$t("realSummary.AlarmH"), isShow: true, index: 8 }, //报警值(高)
            { name: this.$t("realSummary.WarnL"), isShow: true, index: 9 }, //预警值(低)
            { name: this.$t("realSummary.AlarmL"), isShow: true, index: 10 }, //报警值(低)
          ];
        } else {
          this.head = [
            { name: this.$t("Common.tree"), isShow: true, index: 0 }, //'组织'
            { name: this.$t("realSummary.equipment"), isShow: true, index: 1 }, //设备
            {
              name: this.$t("realSummary.diagnosticResult"),
              isShow: true,
              index: 2,
            }, //诊断结果
            { name: this.$t("Common.pos"), isShow: true, index: 3 }, //测点
            {
              name: this.$t("realSummary.TrendAverage"),
              isShow: true,
              index: 11,
            }, //趋势增长平均值
            {
              name: this.$t("realSummary.TrendAlarmPushStatus"),
              isShow: true,
              index: 4,
            }, //趋势报警推送状态
            {
              name: this.$t("realSummary.warnPushStatus"),
              isShow: true,
              index: 12,
            }, //预警推送状态
            {
              name: this.$t("realSummary.AlarmPushStatus"),
              isShow: true,
              index: 13,
            }, //报警推送状态
            {
              name: this.$t("realSummary.EigenvalueType"),
              isShow: true,
              index: 5,
            }, //特征值类型
            { name: this.$t("realSummary.Eigen"), isShow: true, index: 6 }, //特征值
            { name: this.$t("realSummary.WarnH"), isShow: true, index: 7 }, //预警值(高)
            { name: this.$t("realSummary.AlarmH"), isShow: true, index: 8 }, //报警值(高)
            { name: this.$t("realSummary.WarnL"), isShow: false, index: 9 }, //预警值(低)
            { name: this.$t("realSummary.AlarmL"), isShow: false, index: 10 }, //报警值(低)
          ];
        }
      },
      immediate: true,
    },
  },
  deactivated() {
    clearInterval(this.timer);
  },
  methods: {
    openChartList(key, state, delKey) {
      if (typeof key !== "string") return;
      let [, , , t_root] = key.split("_");
      if (state === 0 || state == 1) {
        //新建图谱
        this.currentKey = key;
        for (let k in this.summaryData) {
          this.summaryData[k].isShow = false;
        }
      }

      this.t_root = t_root;
      switch (state) {
        case 0 /* 打开图表 */:
          this.$set(this.summaryData, key, {
            treeArr: [], //存储数据
            isShow: true, //显示图谱
            scrollLeft: 0, //滚动距离
            empty: {
              isShow: false,
              text: this.$t("Common.noDataText"), //无数据
            },
          });
          /* 设置定时器 */
          this.setInterval(this.summaryData[key]);
          break;
        case 1 /* 切换图表 */:
          this.summaryData[key].isShow = true;
          this.resetScrollbar(this.summaryData[key]);
          this.setInterval(this.summaryData[key]);
          break;
        case 2 /* 关闭图表 */:
          delete this.summaryData[key];
          break;
      }
    },
    /* 设置定时器 */
    setInterval(summartData) {
      /* 清除当前的定时器 */
      clearInterval(this.timer);
      this.getData(summartData, true);
      this.timer = setInterval(() => {
        if (this.isGetData) {
          this.isGetData = false;
          this.getData(summartData);
        }
      }, 10000);
    },
    /* 请求数据 */
    getData(summary, flag) {
      let [, , t_id, t_root] = this.currentKey.split("_");
      let requestData = {
        t_id: t_id,
        t_root: t_root,
        fields: defaultCode1,
      };
      if (flag) {
        this.$emit("loadingImg", true);
      }
      this.$getApi.getFolderRealTimeList(requestData).then((res) => {
        this.isGetData = true;
        if (flag) {
          this.$emit("loadingImg", false);
        }
        if (res) {
          res = res.data;
          let treeArr = [];
          /*处理数据  */
          /* 循环组织 */
          for (let treeId in res) {
            let temp = res[treeId];
            let treeObj = {};
            treeObj.tName = temp.tName;
            treeObj.pumpsArr = [];
            /* 循环机泵 */
            let m = temp.pumps ? temp.pumps : temp.machines;
            for (let pumpId in m) {
              let temp1 = m[pumpId];
              let pumpObj = {};
              pumpObj.pump_name = temp1.pump_name || temp1.mac_me;
              /* 处理诊断结果 */
              if (temp1.result) {
                pumpObj.result = temp1.result.time + ";" + temp1.result.desc;
              } else {
                pumpObj.result = "—";
              }
              pumpObj.posArr = [];
              /* 循环测点 */
              if (temp1.positions) {
                temp1.positions.forEach((temp2) => {
                  let posObj = {};
                  posObj.pos_name = temp2.pos_name;
                  /* 处理趋势报警状态 */
                  posObj.t_id = treeId;
                  posObj.mac_id = temp2.mac_id;
                  posObj.pos_id = temp2.pos_id;
                  posObj.pos_type = temp2.pos_type;
                  posObj.m_type = temp.m_type;
                  posObj.updateTime = temp.updateTime
                  if (temp2.trend) {
                    posObj.statusId = temp2.trend.id;
                    posObj.avg =
                      temp2.trend.avg === undefined ? "—" : temp2.trend.avg;
                    let time = getTime(temp2.trend.time);
                    let text = `; ${this.$t("realSummary.rise")}${
                      temp2.trend.percent
                    }%; `; //上涨
                    let obj = {
                      0: this.$t("realSummary.unconfirmed"), //未确认
                      1: this.$t("realSummary.confirmed"), //已确认
                      2: this.$t("realSummary.Reset"), //已重置
                      3: this.$t("realSummary.maintenance"), //维护中
                      4: this.$t("realSummary.rejected"), //已拒绝
                    };
                    let text1 = obj[temp2.trend.status];
                    posObj.status = time + text + text1;
                    posObj.trendStatus = temp2.trend.status;
                  } else {
                    posObj.status = "—";
                    posObj.avg = "—";
                  }
                  if (temp2.h) {
                    posObj.hId = temp2.h.id;
                    let time = getTime(temp2.h.time);
                    let obj = {
                      0: this.$t("realSummary.unconfirmed"), //未确认
                      1: this.$t("realSummary.confirmed"), //已确认
                      2: this.$t("realSummary.Reset"), //已重置
                      3: this.$t("realSummary.maintenance"), //维护中
                      4: this.$t("realSummary.rejected"), //已拒绝
                    };
                    let text = obj[temp2.h.status];
                    posObj.h = time + ";" + text;
                    posObj.hStatus = temp2.h.status;
                  } else {
                    posObj.h = "—";
                  }
                  if (temp2.hh) {
                    posObj.hhId = temp2.hh.id;
                    let time = getTime(temp2.hh.time);
                    let obj = {
                      0: this.$t("realSummary.unconfirmed"), //未确认
                      1: this.$t("realSummary.confirmed"), //已确认
                      2: this.$t("realSummary.Reset"), //已重置
                      3: this.$t("realSummary.maintenance"), //维护中
                      4: this.$t("realSummary.rejected"), //已拒绝
                    };
                    let text = obj[temp2.hh.status];
                    posObj.hh = time + ";" + text;
                    posObj.hhStatus = temp2.hh.status;
                  } else {
                    posObj.hh = "—";
                  }
                  /* 处理特征值 */
                  // 获取该测点的所有特征值
                  // let result = setHead(
                  //   t_root,
                  //   temp2.dgm_type,
                  //   temp2.pos_type,
                  //   temp2.pos_loc
                  // );
                  let result = [defaultCode[temp2.pos_type]];
                  /* 获取一个特征值 */
                  posObj.e = [];
                  /* 过滤和组合特征值 */
                  // 就一个特征值
                  result.forEach((e) => {
                    let eObj = {};
                    if (e.filed === "saveTime_Com") return;
                    eObj.val = e.name;
                    eObj.code = e.code;
                    eObj.isShow = e.isShow || true;
                    eObj.filed = e.filed;
                    if (temp2.realData) {
                      /* 工艺量要根据后台传过来的数据，来保留小数点后面位数 */
                      let unitNum = parseInt(temp2.unitNum);
                      // 存在实时值
                      let val = temp2.realData[e.filed];
                      if (
                        val !== undefined &&
                        val !== null &&
                        val < 100000000
                      ) {
                        let unit = getUnit(e.code, temp2);
                        if (!isNaN(unitNum)) {
                          val = round(val, unitNum) + unit;
                        } else {
                          val = round(val, 4) + unit;
                        }
                      } else {
                        val = "—";
                      }
                      eObj.realData = val;
                    } else {
                      eObj.realData = "—";
                    }
                    /* 处理报警值和预警值 */
                    let h_limit, hh_limit, l_limit, ll_limit;
                    /*    if (temp2.alarm) {
                      temp2.alarm[e.code] &&
                        ([waringVal, alarmVal] = temp2.alarm[e.code].split(
                          "_"
                        ));
                    } */
                    if (temp2.alarm) {
                      h_limit = temp2.alarm.h_limit;
                      hh_limit = temp2.alarm.hh_limit;
                      l_limit = temp2.alarm.l_limit;
                      ll_limit = temp2.alarm.ll_limit;
                    }
                    let VibPosType = [3, 4, 6, 9, 8, 11, 12, 13, 14, 15, 16]; //振动系测点
                    let h = "—",
                      hh = "—",
                      l = "—",
                      ll = "—";

                    if (VibPosType.indexOf(temp2.pos_type) != -1) {
                      h = !temp2.alarm
                        ? "—"
                        : temp2.alarm[e.code]
                        ? temp2.alarm[e.code].split("_")[0]
                        : "—";
                      hh = !temp2.alarm
                        ? "—"
                        : temp2.alarm[e.code]
                        ? temp2.alarm[e.code].split("_")[1]
                        : "—";
                    } else if (
                      temp2.pos_type == 7 ||
                      temp2.pos_type == 2 ||
                      temp2.pos_type == 10
                    ) {
                      //温度、过程量、工艺量测点有低报、低低报
                      h = !temp2.alarm
                        ? "—"
                        : temp2.alarm.h_limit
                        ? temp2.alarm.h_limit
                        : "—";
                      hh = !temp2.alarm
                        ? "—"
                        : temp2.alarm.hh_limit
                        ? temp2.alarm.hh_limit
                        : "—";
                      l = !temp2.alarm
                        ? "—"
                        : temp2.alarm.l_limit
                        ? temp2.alarm.l_limit
                        : "—";
                      ll = !temp2.alarm
                        ? "—"
                        : temp2.alarm.ll_limit
                        ? temp2.alarm.ll_limit
                        : "—";
                    } else if (temp2.pos_type == 5) {
                      h = !temp2.alarm
                        ? "—"
                        : temp2.alarm.h_limit
                        ? temp2.alarm.h_limit
                        : "—";
                      hh = !temp2.alarm
                        ? "—"
                        : temp2.alarm.hh_limit
                        ? temp2.alarm.hh_limit
                        : "—";
                    }
                    // 预警值
                    eObj.h = h;
                    // 报警值
                    eObj.hh = hh;
                    // 预警值
                    eObj.l = l;
                    // 报警值
                    eObj.ll = ll;
                    //趋势报警状态
                    eObj.status = "—";
                    /* 存入特征值对象 */
                    posObj.e.push(eObj);
                  });
                  /* 存入测点对象 */
                  pumpObj.posArr.push(posObj);
                });
              }
              /* 存入机泵对象 */
              treeObj.pumpsArr.push(pumpObj);
            }
            /* 存入组织对象 */
            treeArr.push(treeObj);
          }
          this.getHeight(treeArr);
          summary.treeArr = treeArr;
          if (treeArr.length === 0) {
            /* 无数据 */
            summary.empty.isShow = true;
          } else {
            summary.empty.isShow = false;
          }
        }
      });
    },
    // 获取div 的高
    getHeight(treeArr) {
      treeArr.forEach((tree) => {
        let treeHeight = 0;
        tree.pumpsArr.forEach((pump) => {
          let pumpHeight = 0;
          pump.posArr.forEach((pos) => {
            let posHeight = 0;
            pos.e.forEach((e) => {
              // 是显示的特征值
              if (e.isShow) {
                posHeight += 30;
              }
            });
            pos.posHeight = posHeight + "px";
            pumpHeight += posHeight;
          });
          pump.pumpHeight = pumpHeight + "px";
          treeHeight += pumpHeight;
        });
        tree.treeHeight = treeHeight + "px";
      });
    },
    /* 下滑的时候固定表头 */
    scrollBar(e, key, item) {
      let scrollLeft = e.target.scrollLeft;
      let dom = document.querySelector(`.scroll-${key}`);
      dom.style.left = -scrollLeft + "px";
      item.scrollLeft = scrollLeft;
    },
    /* 其他图谱切换的时候重置滚动条 */
    resetScrollbar(item) {
      this.$refs[this.currentKey][0].scrollLeft = item.scrollLeft;
    },
    /* 点击修改报警状态 */
    statusButtonClick(pos, status, statusId) {
      let btnContent;
      //未确认
      if (status === 0) {
        btnContent = [
          { name: this.$t("Common.sureBtn"), index: 1 }, //确认
          { name: this.$t("realSummary.maintain"), index: 3 }, //维护
          { name: this.$t("realSummary.Refuse"), index: 4 }, //拒绝
        ];
        //已确认
      } else if (status === 1) {
        btnContent = [
          { name: this.$t('Common.resetBtn'), index: 2 }, //重置
          { name: this.$t('realSummary.maintain'), index: 3 },
        ]
        //已重置
      } else if (status === 2) {
        btnContent = [
          { name: this.$t('Common.sureBtn'), index: 1 }, //确认
          { name: this.$t('realSummary.maintain'), index: 3 }, //维护
          { name: this.$t('realSummary.Refuse'), index: 4 }, //拒绝
        ]
        //维护中
      } else if (status === 3) {
        btnContent = [{ name: this.$t('Common.resetBtn'), index: 2 }] //重置
        //已拒绝
      } else if (status === 4) {
        btnContent = [
          { name: this.$t('Common.resetBtn'), index: 2 }, //重置
          { name: this.$t('realSummary.maintain'), index: 3 }, //维护
        ]
      } else {
        btnContent = [
          { name: this.$t('realSummary.maintain'), index: 3 }, //维护
        ]
      }
      // btnContent = [
      //   { name: "确认", index: 1 },
      //   { name: "重置", index: 2 },
      //   { name: "维护", index: 3 },
      //   { name: "拒绝", index: 4 }
      // ];
      if (btnContent) {
        this.$pop({
          btnNum: 3,
          title: this.$t('realSummary.operating'), //操作
          content: this.$t('realSummary.ModifyAlarmStatus'), //修改报警状态
          btnContent: btnContent,
        }).then((res) => {
          if (res) {
            let requestData = {
              machine_id: pos.mac_id,
              position_id: pos.pos_id,
              position_type: pos.pos_type,
              type: res,
              wxAlarmId: statusId === undefined ? null : statusId,
              projectId: pos.t_id,
            };
            this.$getApi.statusButtonClick(requestData);
          }
        });
      }
    },
    /* 跳转到趋势图 */
    turnToTrend(pos) {
      let macId = pos.mac_id;
      let posArray = this.$store.state.pos[macId];
      if (posArray === undefined) {
        /* 如果没有获取到测点，重新获取 */
        this.$getApi
          .queryAllPositionsByMacId({
            mac_id: pos.mac_id,
            m_type: pos.m_type,
            t_root: 0,
          })
          .then((res) => {
            if (res && res.positions) {
              res.positions.forEach((item) => {
                item.posFlag = `${item.machine_id}_${item.position_id}_${item.position_type}`;
                item.name = item.position_name;
                if (item.tt_ch_type == null && item.tt_ch_type == undefined) {
                  item.ch_type = item.tt_ch_type;
                }
                if (item.tt_ch_id == null && item.tt_ch_id == undefined) {
                  item.ch_id = item.tt_ch_id;
                }
              });
              this.$store.commit("getMsg", {
                key: "pos",
                msg: res.positions,
                keys: pos.mac_id,
              });
              let key = `${pos.mac_id}_${pos.pos_id}_${pos.pos_type}`;
              key = "trend_pos_" + key;
              this.$bus.$emit("choiceChartType", key, this.$t("Common.trend")); //趋势图
            }
          });
      } else {
        let key = `${pos.mac_id}_${pos.pos_id}_${pos.pos_type}`;
        key = "trend_pos_" + key;
        this.$bus.$emit("choiceChartType", key, this.$t("Common.trend")); //趋势图
      }
    },
    // 右键菜单
    showContextmenu(e, posInfo) {
      let time = posInfo.updateTime
      let pos = this.$store.getters.getPos(
        posInfo.mac_id,
        posInfo.pos_type,
        posInfo.pos_id
      ); //无数据
      let text = getMenus(["trend", "wave", "history", "alarm"]);
      let info = {
        type: "pos",
        tree: null,
        mac: null,
        pos,
        time,
      };
      showRightMenu(this, e, text, info);
    },
  },
  created() {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "realSummary",
    });
  },
};
</script>

<style scoped lang="scss">
.my-summary-table {
  .nav_wrap {
    position: relative;
    height: 100%;
    color: #fff;
    overflow-x: hidden;
    //  box-sizing: border-box;
    .my-summary-head {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
    }
    .my-summary-body {
      overflow-y: auto;
      margin-top: 37px;
      height: calc(100% - 37px);
      // height: 100%;
      // overflow-y: hidden;
    }
    .nav_mine {
      display: flex;
      align-items: center;

      // overflow: hidden;
      // flex-wrap: nowrap;
    }
    .nav_mine .nav_item {
      text-align: center;
      font-size: 14px;
      list-style: none;
      ul {
        display: flex;
        align-items: center;

        li {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .my-summary-head .my-summary-head-item {
      font-size: 16px;
    }
    .eUl {
      &:hover {
        background: #0b4c90;
      }
    }
    .item {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &:hover {
        background: #0b4c90;
      }
    }
    .item-qushi,
    .item-zhenduan {
      white-space: normal;
      display: flex;
      word-break: break-all;
      justify-content: center;
      align-items: center;
    }
    .my-summary-item-col-0 {
      flex: 0 0 150px;
    }
    .my-summary-item-col-1 {
      flex: 0 0 150px;
    }
    .my-summary-item-col-2 {
      flex: 0 0 250px;
    }
    .my-summary-item-col-3 {
      flex: 0 0 200px;
    }
    .my-summary-item-col-4 {
      flex: 0 0 340px;
    }
    .my-summary-item-col-5 {
      flex: 0 0 180px;
    }
    .my-summary-item-col-6 {
      flex: 0 0 180px;
    }
    .my-summary-item-col-7 {
      flex: 0 0 180px;
    }
    .my-summary-item-col-8 {
      flex: 0 0 180px;
    }
    .my-summary-item-col-9 {
      flex: 0 0 180px;
    }
    .my-summary-item-col-10 {
      flex: 0 0 180px;
    }
    .my-summary-item-col-11 {
      flex: 0 0 180px;
    }
    .my-summary-item-col-12 {
      flex: 0 0 240px;
    }
    .my-summary-item-col-13 {
      flex: 0 0 240px;
    }
    .my-summary-head-item {
      padding: 8px 0px;
    }
    .none-data-box {
      height: 100%;
      width: 100%;
    }
  }
}
// .tree-color,
// .pump-color,
// .pos-color {
//   &:nth-child(odd) {
//     background: #0e3e70;
//   }
//   &:nth-child(even) {
//     background: #103760;
//   }
// }
.column3 {
  border-right: 1px solid #0b4c90;
  border-top: 1px solid #0b4c90;
}
.e-color-0 {
  background: #0e3e70;
}
.e-color-1 {
  background: #103760;
}
</style>
