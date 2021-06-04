import {
  codeObj,
  getTime,
  round,
  cloneObj,
  getUnit,
  getUnit1,
  setHead,
  unitTransformation
} from "utils/utils.js";

import { getMenus, showRightMenu } from 'common/menus/Menus.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: "history",
  data () {
    return {
      // page: {
      //   /* 页数信息 */
      //   currentPage: 1 /* 当前页 */,
      //   pageCount: Number.MAX_VALUE /* 总页数 */,
      //   pageNum: 100 /* 每页显示行数 */
      // },
      pos: null /* 测点信息 */,
      viewPosition: {} /* 当前显示测点信息 */,
      requestData: {} /* 请求数据 */,
      historyData: {} /* 历史数据 */,
      currentKey: "" /* 当前显示数据下标 */,
      currentIndex: "" /* 当前显示第几组数据 */
    };
  },
  watch: {
    "$store.state.historyMsg": {
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
    // 打开历史数据
    openChartList (key, type, delKey) {
      if (typeof key !== "string") return;
      const [, , mId, id, pType] = key.split("_");
      const keyArr = Object.keys(this.historyData);
      const state = this.$store.state;
      let pos = null;
      if (type === 0 || type === 1) {
        this.currentIndex = keyArr.indexOf(key);
        if (type === 0) {
          pos = cloneObj(state.checkMsg.pos, true);
        } else {
          pos = this.historyData[key].pos
        }
        const params = state.srcParams;
        const time = params.time;
        const speed = params.speed;
        const density = params.density;
        this.requestData = {
          machineId: mId,
          positionId: id,
          positionType: pType,
          startTime: time.start,
          endTime: time.end,
          fromSpeed: speed.min,
          toSpeed: speed.max,
          page: 1,
          pageNum: 100,
          type: 0,
          density: Number(density.type),
          t_root: pos.t_root,
          dataType: [1, 3] //定时历史数据与报警存储数据默认选中
        };
        this.currentKey = key;
        for (let k in this.historyData) {
          this.historyData[k].isShow = false;
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length;
          const isMMS2 =
            bothConfig.mms2.indexOf(state.checkMsg.tree.t_id.toString()) !== -1;
          const head1 = setHead(
            state.checkMsg.tree.t_root,
            pos.dgm_type,
            pType,
            pos.pos_loc
          );
          let head2 = head1;

          const specCode = [
            2000,
            3000,
            4000,
            19000
          ]; /* 若isMMS2为true（配置）,这些特征徐需要转换单位为mm/s² */
          for (let i = 0, l = head1.length; i < l; i++) {
            if (
              isMMS2 &&
              getUnit(head1[i].code, pos) == "g" &&
              specCode.indexOf(head1[i].code) != -1
            ) {
              head1[i].unit = "mm/s²";
            } else {
              //振动、振动阶次、晃度、倾覆、轨道波磨测点的有效值需要计算积分后的单位
              if (
                head1[i].code === 2000 ||
                head1[i].code === 9000 ||
                head1[i].code === 20000
              ) {
                head1[i].unit = getUnit1(
                  pos.units.byIntegral,
                  getUnit(head1[i].code, pos)
                );
              } else {
                head1[i].unit = getUnit(head1[i].code, pos);
              }
            }
          }

          if (
            pos &&
            pos.t_root == 2 &&
            (pos.position_type == 4 ||
              pos.position_type == 9 ||
              pos.position_type == 15 ||
              pos.position_type == 16)
          ) {
            head2 = head1.filter(function (item) {
              return item.code < 52001 || item.code > 52009;
            });
            head2.push(
              {
                filed: "part_name0",
                val: "部件1",
                code: -1,
                isShow: false
              } /* 部件1 */,
              {
                filed: "sv0",
                val: "1-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv1",
                val: "1-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv2",
                val: "1-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv3",
                val: "1-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv4",
                val: "1-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv5",
                val: "1-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv6",
                val: "1-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv7",
                val: "1-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv8",
                val: "1-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name1",
                val: "部件2",
                code: -1,
                isShow: false
              } /* 部件2 */,
              {
                filed: "sv10",
                val: "2-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv11",
                val: "2-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv12",
                val: "2-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv13",
                val: "2-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv14",
                val: "2-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv15",
                val: "2-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv16",
                val: "2-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv17",
                val: "2-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv18",
                val: "2-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name2",
                val: "部件3",
                code: -1,
                isShow: false
              } /* 部件3 */,
              {
                filed: "sv20",
                val: "3-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv21",
                val: "3-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv22",
                val: "3-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv23",
                val: "3-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv24",
                val: "3-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv25",
                val: "3-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv26",
                val: "3-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv27",
                val: "3-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv28",
                val: "3-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name3",
                val: "部件4",
                code: -1,
                isShow: false
              } /* 部件4 */,
              {
                filed: "sv30",
                val: "4-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv31",
                val: "4-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv32",
                val: "4-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv33",
                val: "4-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv34",
                val: "4-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv35",
                val: "4-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv36",
                val: "4-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv37",
                val: "4-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv38",
                val: "4-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name4",
                val: "部件5",
                code: -1,
                isShow: false
              } /* 部件5 */,
              {
                filed: "sv40",
                val: "5-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv41",
                val: "5-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv42",
                val: "5-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv43",
                val: "5-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv44",
                val: "5-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv45",
                val: "5-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv46",
                val: "5-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv47",
                val: "5-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv48",
                val: "5-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name5",
                val: "部件6",
                code: -1,
                isShow: false
              } /* 部件6 */,
              {
                filed: "sv50",
                val: "6-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv51",
                val: "6-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv52",
                val: "6-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv53",
                val: "6-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv54",
                val: "6-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv55",
                val: "6-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv56",
                val: "6-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv57",
                val: "6-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv58",
                val: "6-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name6",
                val: "部件7",
                code: -1,
                isShow: false
              } /* 部件7 */,
              {
                filed: "sv60",
                val: "7-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv61",
                val: "7-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv62",
                val: "7-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv63",
                val: "7-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv64",
                val: "7-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv65",
                val: "7-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv66",
                val: "7-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv67",
                val: "7-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv68",
                val: "7-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name7",
                val: "部件8",
                code: -1,
                isShow: false
              } /* 部件8 */,
              {
                filed: "sv70",
                val: "8-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv71",
                val: "8-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv72",
                val: "8-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv73",
                val: "8-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv74",
                val: "8-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv75",
                val: "8-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv76",
                val: "8-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv77",
                val: "8-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv78",
                val: "8-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name8",
                val: "部件9",
                code: -1,
                isShow: false
              } /* 部件9 */,
              {
                filed: "sv80",
                val: "9-保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv81",
                val: "9-保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv82",
                val: "9-外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv83",
                val: "9-内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv84",
                val: "9-滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv85",
                val: "9-滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv86",
                val: "9-踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv87",
                val: "9-邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv88",
                val: "9-本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */,
              {
                filed: "part_name9",
                val: "部件10",
                code: -1,
                isShow: false
              } /* 部件10 */,
              {
                filed: "sv90",
                val: "10保持架对外环",
                code: 52001,
                isShow: false
              } /* 保持架对外环频率 */,
              {
                filed: "sv91",
                val: "10保持架对内环",
                code: 52002,
                isShow: false
              } /* 保持架对内环频率 */,
              {
                filed: "sv92",
                val: "10外环内滚道",
                code: 52003,
                isShow: false
              } /* 外环内滚道频率 */,
              {
                filed: "sv93",
                val: "10内环外滚道",
                code: 52004,
                isShow: false
              } /* 内环外滚道频率 */,
              {
                filed: "sv94",
                val: "10滚单",
                code: 52005,
                isShow: false
              } /* 滚单频率 */,
              {
                filed: "sv95",
                val: "10滚双",
                code: 52006,
                isShow: false
              } /* 滚双频率 */,
              {
                filed: "sv96",
                val: "10踏面",
                code: 52007,
                isShow: false
              } /* 踏面频率 */,
              {
                filed: "sv97",
                val: "10邻轴齿轮",
                code: 52008,
                isShow: false
              } /* 邻轴齿轮频率 */,
              {
                filed: "sv98",
                val: "10本轴齿轮",
                code: 52009,
                isShow: false
              } /* 本轴齿轮频率 */
            );
          }
          const head = [
            {
              isShow: true,
              val: "测点",
              filed: false
            }
          ].concat(head2);
          // 现场所有测点的趋势图纵坐标单位应和flex一样改为mm/s2

          this.$set(this.historyData, key, {
            isShow: true,
            pos,
            posName: pos.position_name,
            head,
            body: [],
            empty: {
              /* 无报警数据 */
              isShow: true,
              text: `无数据`
            },
            scrollTop: 0 /* 滚动条距离表头距离 */,
            page: {
              currentPage: 1 /* 当前页 */,
              pageCount: Number.MAX_VALUE /* 总页数 */,
              pageNum: 100 /* 每页显示行数 */
            },
            isMMS2: isMMS2 /* 趋势图单位是否要处理为mm/s2 */,
            dataType: [
              { val: "定时历史数据", isChecked: true, type: 1 },
              // { val: '启停机数据列表', isChecked: true, type: 2, },
              { val: "报警存储数据", isChecked: true, type: 3 }
            ]
          });
          this.getData(-2);
          break;
        case 1 /* 切换图表 */:
          this.historyData[key].isShow = true;
          /* 将表头 位置置0 */
          let title = document.getElementsByClassName(`${key}-tr`)[0];
          title.style.left = "0px";
          let index = keyArr.indexOf(this.currentKey);
          let dom = this.$refs.historyBody[index];
          dom.scrollLeft = 0
          break;
        case 2 /* 关闭图表 */:
          this.$delete(this.historyData, key);
          break;
      }
    },
    // 表头单位
    setTitle (item) {
      if (item.unit) return `${item.val}(${item.unit})`;
      else return item.val;
    },
    // 请求数据
    getData (type) {
      this.$emit("loadingImg", true);
      this.$getApi.getSaveData(this.requestData).then(res => {
        this.$emit("loadingImg", false);
        if (res) {
          const hData = this.historyData[this.currentKey];
          if (res.list.length > 0) {
            hData.empty.isShow = false;
            this.setData(res, type);
            // 防止火狐height:100%失效
            this.$nextTick(() => {
              let keyArr = Object.keys(this.historyData);
              let index = keyArr.indexOf(this.currentKey);
              let dom = this.$refs.historyBody[index].parentElement;
              let dom1 = this.$refs.historyBody[index];
              if (dom) {
                dom.style.height = `${Number(
                  dom.parentElement.clientHeight
                )}px`;
              }
              if (dom1) {
                let headerdom = dom1.previousElementSibling;
                dom1.style.height = `${parseInt(dom.style.height) -
                  headerdom.clientHeight}px`;
              }
            });
          } else {
            hData.empty.isShow = true;
          }
        }
      });
    },
    // 组合数据
    setData (data, type) {
      let historyData = this.historyData[this.currentKey];
      let pos = historyData.pos;
      historyData.page.pageCount !== data.totalPage &&
        (historyData.page.pageCount = data.totalPage);
      let head = historyData.head;
      let body = [];
      for (let i = 0, l = data.list.length; i < l; i++) {
        let list = data.list[i];
        body[i] = [
          {
            isShow: true,
            val: pos.position_name
          }
        ];
        for (let j = 1; j < head.length; j++) {
          let value = head[j];
          let v = list[value.filed.toLowerCase()];
          if (value.filed === "saveTime_Com" || value.filed === "time") {
            //saveTime_Com 时间
            body[i].push({
              isShow: value.isShow,
              val: getTime(list[value.filed])
            });
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
            // 部件名称
            if (list[value.filed]) {
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
          } else if (value.filed == 'from_sta' || value.filed == 'to_sta') {
            // 显示站点名称
            let macArray = this.$store.state.mac;
            let stations = [], val
            for (let k in macArray) {
              let macList = macArray[k]
              for (let n = 0; n < macList.length; n++) {
                let mac = macList[n];
                if (mac.mac_id === pos.machine_id) {
                  if (mac.line && mac.line.stations) {
                    stations = mac.line.stations
                    break;
                  }

                }
              }
              if (stations && stations.length > 0) {
                break;
              }
            }
            val = '无绑定站点信息'
            for (let m = 0; m < stations.length; m++) {
              if (stations[m].trackList && stations[m].trackList.length > 0) {
                for (let n = 0, l = stations[m].trackList.length; n < l; n++) {
                  if (stations[m].trackList[n].deviceId == list[value.filed]) {
                    val = stations[m].station_name
                  }
                }
              }
            }
            body[i].push({
              isShow: value.isShow,
              val
            });
          } else if (
            pos.position_type == 11 &&
            pos.dgm_type == 1 &&
            (value.filed == "overturn_p" ||
              value.filed == "overturn_pp" ||
              value.filed == "overturn_s")
          ) {
            value.isShow = false;
          } else if (v || v === 0) {
            let val;
            if (v >= 100000000) {
              val = "无数据";
            } else {
              // let oneDecimal = ["speed_value", "speed", "gap", "sv"]; // 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
              let oneDecimal = [16000, 1000, 14000, 46000]; // 保留一位小数 需求 --- 转速、偏置电压、冲击均保留1位小数即可
              let m = ["overturn_s", "rock_s"]; ///* 改变单位mm->m */
              const specCode = [
                "vib_p",
                "vib_rms",
                "vib_pp",
                "pow_rms"
              ]; /* 若isMMS2为true（配置）,这些特征徐需要转换单位为mm/s² */
              if (m.includes(value.filed)) {
                val = unitTransformation(v);
                value.unit === 'mm' ? value.unit = 'm' : value.unit = value.unit
              } else if (oneDecimal.includes(value.code)) {
                val = round(v, 1);
              } else if (specCode.includes(value.filed)) {
                if (
                  historyData.isMMS2 &&
                  (value.unit == "mm/s²" || value.unit == "gD")
                ) {
                  val = round(v * 9807, 4);
                } else {
                  val = round(v, 4);
                }
              } else if (pos.position_type == 10) {
                // 工艺量测点，根据后台传过来的数据来确定保留小数
                let unitNum = parseInt(pos.unitNum);
                if (!isNaN(unitNum)) {
                  val = round(v, unitNum);
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
      if (type === -2) {
        /* 第一次请求 */
        historyData.body = body;
      } else if (type === -3) {
        /* 滚动请求 */
        historyData.body = historyData.body.concat(body);
      }
    },
    // 滚动请求
    scrollRequest (e, key) {
      const tag = e.target;
      const data = this.historyData[key];
      /* 横向滚动，title 随着动 */
      let title = document.getElementsByClassName(`${key}-tr`)[0];
      title.style.left = -1 * tag.scrollLeft + "px";
      const hh = tag.scrollHeight; /* 总高度 */
      const tt = tag.scrollTop; /* 滚动条到最上面距离 */
      const ww = tag.offsetHeight; /* 可视区域高度 */
      let pageMsg = this.historyData[key].page;
      if (
        tt > data.scrollTop &&
        ww + tt + 10 >= hh &&
        pageMsg.currentPage < pageMsg.pageCount
      ) {
        data.scrollTop = tt;
        pageMsg.currentPage++;
        this.requestData.page = pageMsg.currentPage;
        this.getData(-3);
      }
    },
    // 点击数据检索
    dataRetrieval () {
      const data = this.historyData[this.currentKey];
      const rd = this.requestData;
      const eigenvalue = data.head.slice(2);
      let isDataType = false;
      const params = this.historyData[this.currentKey];
      let dataType = params.dataType;
      if (params.pos.dgm_type == 11) {
        isDataType = true;
      }
      this.$retrieval({
        key: "history",
        viewMsg: {
          pos: data.pos,
          eigenvalue,
          isDataType,
          dataType
        }
      }).then(res => {
        if (res) {
          this.historyData[this.currentKey].scrollTop = 0;
          this.historyData[this.currentKey].page.currentPage = 1;
          dataType = res.dataType; //8000数据类型
          rd.startTime = res.startTime;
          rd.endTime = res.endTime;
          rd.fromSpeed = res.minSpeed;
          rd.toSpeed = res.maxSpeed;
          rd.page = 1;
          rd.density = Number(res.density.type);
          let dataTypeArray = [];
          if (res.dataType) {
            for (let i = 0; i < res.dataType.length; i++) {
              if (res.dataType[i].isChecked == true) {
                dataTypeArray.push(res.dataType[i].type);
              }
            }
          }

          rd.dataType = dataTypeArray;
          this.getData(-2);
        }
      });
    },
    // 右键菜单
    showContextmenu(e, item) {
      let time = new Date(item[1].val).getTime()
      let pos = this.historyData[this.currentKey].pos
      let text = getMenus(['trend', 'wave', 'real', 'alarm'])
      let info = {
        type: 'pos',
        tree: null,
        mac: null,
        pos,
        time
      }
      showRightMenu(this, e, text, info)
    },
    // 导出数据
    exportData () {
      if (this.historyData[this.currentKey].pos.t_root == 4) {
        // 前端数据导出
        const params = this.historyData[this.currentKey]
        const rd = cloneObj(this.requestData, true);
        const pos = params.pos
        const head = params.head;
        rd.type = 1;
        let headIndex = {}
        const tableFileds = []
        for (let i = 0, l = head.length; i < l; i++) {
          const value = head[i];
          if (value.isShow && value.filed) {
            tableFileds.push(this.setTitle(value))
            headIndex[value.filed.toLowerCase()] = this.setTitle(value);
          }
        }
        let myData = [];
        /* 下载csv文件 */
        let body = params.body;
        rd.page = -1
        rd.type = 0
        this.$getApi.getSaveData(rd).then(res => {
          if (res) {
            if (res.list && res.list.length > 0) {
              res.list.forEach(item => {
                let value = {}
                for (let k in headIndex) {
                  // value[headIndex[k]] = item[k]
                  if (k === "saveTime_Com" || k === "time") {
                    value[headIndex[k]] = getTime(item[k])
                  } else if (item[k] || item[k] === 0) {
                    let val;
                    if (item[k] >= 100000000) {
                      val = "无数据";
                    } else {
                      val = round(item[k], 4);
                    }
                    value[headIndex[k]] = val
                  } else {
                    value[headIndex[k]] = '无数据'
                  }
                }
                myData.push(value)
              })
            }
            var Parser = require("json2csv").Parser;
            let json2csvParser = new Parser({ tableFileds });
            let csv = json2csvParser.parse(myData);
            csv = "\ufeff" + csv;
            var aTag = document.createElement("a");
            var blob = new Blob([csv]);
            aTag.download = `历史数据-${pos.position_name}-${pos.mac_name}-${new Date().getTime()}.csv`;
            aTag.href = URL.createObjectURL(blob);
            aTag.click();
            URL.revokeObjectURL(blob);
          }
        });

      } else {
        const rd = cloneObj(this.requestData, true);
        const head = this.historyData[this.currentKey].head;
        rd.type = 1;
        const fileds = {};
        for (let i = 0, l = head.length; i < l; i++) {
          const value = head[i];
          if (value.isShow && value.filed) {
            fileds[value.filed.toLowerCase()] = this.setTitle(value);
          }
        }
        rd.needFields = fileds;
        this.$getApi.getSaveData(rd).then(res => {
          if (res) {
            this.$refs.exportData.href = this.filePath + res.filePath;
            this.$refs.exportData.download = res.filePath.slice(
              res.filePath.indexOf("历史数据")
            );
            this.$refs.exportData.click();
            setTimeout(() => {
              this.$getApi.deleteExportFile({
                filePath: this.filePath + res.filePath
              });
            }, 10000);
          }
        });
      }
    }
  },
  created () {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "history"
    });
  }
};
