import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import myChart from "@/assets/js/myCharts.js";
// import { Mandarin } from "flatpickr/dist/l10n/zh.js"
// import WaveChart from '../../common/waveChart';
import {
  getCodeObj,
  getdefaultCode,
  defaultCode,
  getTimeOfType,
  cloneObj,
  getUnit,
  round,
  setHead
} from "utils/utils.js";
export default {
  // import引入的组件需要注入到对象中才能使用
  name: "census", //统计列表
  data () {
    return {
      censusData: {} /* 统计列表信息 */,
      currentIndex: 0 /* 当前打开第几个图表 */,
      currentKey: "" /* 当前显示图表索引 */,
      checkList: {
        hasOpen: false,
        isOpen: false,
        key: "",
        isShow: false,
        text: [],
        style: null,
        child: []
      },
      dateType: [
        /* 时间类型选择 */ { type: "day", val: "前一天", key: "time" },
        { type: "week", val: "前一周", key: "time" },
        { type: "month", val: "前一月", key: "time" },
        { type: "quarter", val: "前一季", key: "time" },
        { type: "year", val: "前一年", key: "time" }
      ],
      statisticalType: [
        { val: "平均值", title: '平均值', type: "0", key: "statistical" },
        { val: "方差", title: '方差:在概率论和统计方差衡量随机变量或一组数据时离散程度的度量', type: "1", key: "statistical" },
        { val: "最大10%平均值", type: "2", key: "statistical" }
      ],
      srcList: [],
      searchtree: "",
      placeholder: "",
      tArray: [],
      searchMsg: "",
      color: {
        /* 颜色设置 */ titleColor: "#666" /* 标题字体 */,
        axis: {
          /* 坐标轴 */ name: "#666" /* 标题 */,
          font: "#666" /* 字体 */,
          line: "#ccc" /* 坐标线 */,
          splitLine: "#ccc" /* 分隔线 */
        },
        series: {
          /* 图谱 */ line: "#6C91DD" /* 谱线 */,
          symbol: "#fff" /* symbol */
        },
        tool: {
          symbol: "#ff9b21",
          line: "#ff9b21",
          font: "#fff",
          background: "rgba(255, 155, 33, 0.8)"
        },
        background: "#fff" /* 背景颜色 */
      }
    };
  },
  created () {
    this.$store.commit("set_keepAlive", { method: "add", keepAlive: "census" });
    this.dateType = [
      /* 时间类型选择 */
      { type: "day", val: this.$t('Common.previousDay'), key: "time" },
      { type: "week", val: this.$t('Common.previousWeek'), key: "time" },
      { type: "month", val: this.$t('Common.previousMonth'), key: "time" },
      { type: "quarter", val: this.$t('Common.PreviousQuarter'), key: "time" },
      { type: "year", val: this.$t('Common.pastYear'), key: "time" }
    ]
    this.statisticalType = [
      { val: this.$t('Census.average'), title: this.$t('Census.average'), type: "0", key: "statistical" },
      { val: this.$t('Census.variance'), title: this.$t('Census.explainedVariance'), type: "1", key: "statistical" },
      { val: this.$t('Census.MaximumTenAverage'), title: this.$t('Census.MaximumTenAverage'), type: "2", key: "statistical" }
    ]
  },
  watch: {
    //监听搜索tree
    searchtree: {
      handler (newVal) {
        const srcList = this.srcList;
        if (this.censusData[this.currentKey].tArray <= 0) {
          let tArray;
          tArray = this.$store.state.foldtree;
          this.censusData[this.currentKey].tArray = tArray;
        }
        if (newVal.val !== "") {
          this.censusData[this.currentKey].tArray.forEach(el => {
            if (!this.matchPinyin(el.name, newVal)) {
              el.isShow = false;
            } else {
              el.isShow = true;
            }
            if (el.children && el.children.length > 0) {
              el.isOpen = true;
              el.children.forEach(item => {
                if (!this.matchPinyin(el.name, newVal)) {
                  item.isShow = false;
                } else {
                  item.isShow = true;
                }
              });
            }
          });
        }
      },
      //对象属性监听
      deep: true
    },
    searchMsg (val) {
      const checkList = this.checkList;
      const srcList = this.srcList;
      let text = [];
      if (val.length > 0) {
        if (checkList.key === "tree") {
          for (let i = 0, l = srcList.length; i < l; i++) {
            const value = srcList[i];
            if (this.pinyin.match(value.val, val)) {
              text.push(value);
            }
          }
        } else {
          for (let i = 0, l = srcList.length; i < l; i++) {
            const value = srcList[i];
            const child = [];
            for (let j = 0, len = value.child.length; j < len; j++) {
              const v = value.child[j];
              if (this.pinyin.match(v.val, val)) {
                child.push(v);
              }
            }
            if (child.length > 0) {
              value.child = child;
              text.push(value);
            }
          }
        }
      } else {
        text = srcList;
      }
      checkList.text = text;
    },
    "$store.state.censusMsg": {
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
      if (this.censusData[this.currentKey] && this.censusData[this.currentKey].barChart) {
        const chart = this.censusData[this.currentKey].barChart;
        chart && chart.resize();
      }
    }
  },
  methods: {
    // 打开图表
    openChartList (key, type, delKey) {
      if (typeof key !== "string") return;
      const keyArr = Object.keys(this.censusData);
      if (type === 0 || type === 1 || type === 3) {
        this.currentKey = key;
        this.currentIndex = keyArr.indexOf(key);
        for (const k in this.censusData) {
          this.censusData[k].isShow = false;
        }
      }
      //每次新开窗口或者切换窗口searchtree置空
      this.searchtree = "";
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length;
          const state = this.$store.state;
          const defaultName = {
            tree: [this.$t('Census.selectTree'), "gray-tip"],
            mac: [this.$t('Census.selectMac'), "gray-tip"],
            pos: [this.$t('Census.selectPos'), "gray-tip"],
            code: [this.$t('Census.selectEigen'), "gray-tip"]
          };
          const checkMsg = state.checkMsg;
          let tree = [];
          let mac = [];
          let pos = [];
          let code = [];
          //选择中的tree ischecked为true
          let checkTree = {
            name: this.$t('Census.enterTree'), //显示的名称
            msg: {}
          };
          const viewCondition = [
            { isCheck: false, name: this.$t('Common.Case1') },
            { isCheck: false, name: this.$t('Common.Case2') },
            { isCheck: false, name: this.$t('Common.Case3') },
            { isCheck: false, name: this.$t('Common.Case4') },
            { isCheck: false, name: this.$t('Common.OtherCond') }
          ];
          let unitShow = false
          if (checkMsg.type === "pos") {
            tree = [checkMsg.tree];
            mac = [checkMsg.mac];
            pos = [checkMsg.pos];
            checkTree.name = tree[0].t_name;
            defaultName.tree = [tree[0].t_name, ""];
            defaultName.mac = [mac[0].m_me, ""];
            defaultName.pos = [pos[0].position_name, ""];
            const defaultCode = getdefaultCode(pos[0].dgm_type)
            defaultName.code = [defaultCode[pos[0].position_type].name, ""];
            let dgmType = []
            pos.forEach(item => {
              if (dgmType.indexOf(item.dgm_type) == -1) {
                dgmType.push(Number(item.dgm_type))
              }
              if (item.position_type == 3) {
                unitShow = true;
              }
            })
            // 采集器为2000V1(1),TMS(7),2200(2),MHD(4),E821(6),2600(5),WL9100(10)默认工况为其他工况
            if (dgmType.indexOf(1) !== -1 || dgmType.indexOf(7) !== -1 || dgmType.indexOf(2) !== -1 || dgmType.indexOf(4) !== -1 || dgmType.indexOf(6) !== -1 || dgmType.indexOf(5) !== -1 || dgmType.indexOf(10) !== -1) {
              viewCondition[4].isCheck = true;
            }
            // 采集器为2000V2(3),2000E(9)默认工况为工况4
            if (dgmType.indexOf(3) !== -1 || dgmType.indexOf(9) !== -1) {
              viewCondition[3].isCheck = true;
            }
            code = setHead(
              tree[0].t_root,
              pos[0].dgm_type,
              pos[0].position_type,
              pos[0].pos_log
            );
          } else if (checkMsg.type === "mac") {
            tree = [checkMsg.tree];
            mac = [checkMsg.mac];
            // let macs = cloneObj(state.mac, true);
            // macs = macs[mac.t_id]
            // this.$store.commit("getMsg", {
            //   key: "mac",
            //   keys: mac.t_id,
            //   msg: macs
            // });
            checkTree.name = tree[0].t_name;
            defaultName.tree = [tree[0].t_name, ""];
            defaultName.mac = [mac[0].m_me, ""];
          } else if (checkMsg.type === "tree") {
            tree = [checkMsg.tree];
            checkTree.name = tree[0].t_name;
            defaultName.tree = [tree[0].t_name, ""];
          }
          const time = getTimeOfType(2, Date.now());
          this.$set(this.censusData, key, {
            isShow: true,
            isList: true,
            tree: cloneObj(state.tree, true),
            mac: cloneObj(state.mac, true),
            pos: cloneObj(state.pos, true),
            checkMsg: {
              tree,
              mac,
              pos
            },
            code,
            proportion: {
              /* 比例 */ view: "" /* 显示数据 */,
              data: 0 /* 发送数据 */
            },
            condition: [] /* 工况 */,
            viewMsg: [
              /* 0 */ {
                name: this.$t('Common.tree'),//组织
                msg: defaultName.tree[0],
                class: defaultName.tree[1]
              },
              /* 1 */ {
                name: this.$t('Common.mac'),//"机组"
                msg: defaultName.mac[0],
                class: defaultName.mac[1]
              },
              /* 2 */ {
                name: this.$t('Common.pos'),//"测点"
                msg: defaultName.pos[0],
                class: defaultName.pos[1]
              },
              /* 3 */ {
                name: this.$t('Common.eigenvalue'),//"特征值"
                msg: defaultName.code[0],
                class: defaultName.code[1]
              },
              /* 4 */ { name: this.$t('Census.proportion'), msg: "" },//"比例"
              /* 5 */ { name: this.$t('Census.vibUnit'), msg: this.$t('Census.selectUnit') },//"振动单位"  请选择单位
              /* 6 */ { name: this.$t('Census.time'), msg: this.$t('Common.previousMonth') },//"时间"  "前一月"
              /* 7 */ { name: this.$t('Census.startTime'), msg: time.start },//"开始时间"
              /* 8 */ { name: this.$t('Census.endTime'), msg: time.end },//"结束时间"
              /* 9 */ { name: this.$t('Census.statisticalWays'), msg: this.$t('Census.average') },//"统计方式"  "平均值"
              /* 10 */ { name: this.$t('Census.SpeedRange'), msg: ["", ""] },//"转速区间"
              /* 11 */ { name: this.$t('Census.StatisticalCond'), msg: viewCondition }//"统计工况"
            ],
            viewList: {},
            chart: {
              isShow: false,
              x: {
                data: [],
                unit: ""
              },
              y: {
                data: [],
                unit: []
              }
            },
            showEmpty: false,
            barChart: null,
            isNewChart: true,
            startTime: null,
            endTime: null,
            time: {
              start: time.start,
              end: time.end
            } /* 当前时间 */,
            tArray: [],
            checkTree: checkTree,
            unitShow: unitShow //选中测点是否包含振动测点，包含则显示单位选择框
          });
          const zh = require("flatpickr/dist/l10n/zh.js").default.zh;
          this.$nextTick(() => {
            const val = this.censusData[key];
            val.startTime = flatpickr(`.start-time${key}`, {
              clickOpens: true,
              enableTime: true,
              time_24hr: true,
              enableSeconds: true,
              locale: zh,
              dateFormat: "Y-m-d H:i:S",
              defaultDate: time.start,
              onChange (params) {
                const time = new Date(params[0]).valueOf();
                time !== val.time.start && (val.viewMsg[5].msg = this.$t('Common.custom'));
                val.time.start = time;
              }
            });
            val.endTime = flatpickr(`.end-time${key}`, {
              clickOpens: true,
              enableTime: true,
              time_24hr: true,
              enableSeconds: true,
              locale: zh,
              dateFormat: "Y-m-d H:i:S",
              defaultDate: time.end,
              onChange (params) {
                const time = new Date(params[0]).valueOf();
                time !== val.time.end && (val.viewMsg[5].msg = this.$t('Common.custom'));
                val.time.end = time;
              }
            });
          });
          // this.checkTreeFun(tree)
          break;
        case 1 /* 切换图表 */:
          this.censusData[key].isShow = true;
          break;
        case 2 /* 关闭图表 */:
          this.$delete(this.censusData, key);
          break;
        case 3 /* 关闭并切换图表 */:
          this.$delete(this.censusData, delKey);
          this.censusData[key].isShow = true;
          break;
      }
    },
    //设置下拉tree
    changeTreeType (index, e) {
      let tArray;
      if (this.censusData[this.currentKey].tArray.length === 0) {
        tArray = cloneObj(this.$store.state.foldtree);//foldtree
        this.censusData[this.currentKey].tArray = tArray;
      } else {
        tArray = this.censusData[this.currentKey].tArray;
      }
      const size = e.currentTarget.getBoundingClientRect();
      const myStyle = {
        maxHeight: "300px",
        width: "220px",
        left: size.left + "px",
        top: size.top + size.height + "px"
      };
      // 组件更改ischeck是直接更改tArray，可直接循环tArray遍历选中的组织
      this.$multi({
        dateType: "tree",
        data: tArray,
        myStyle,
        flag: "pro",
        cType: "checkbox"
      }).then(res => {
        this.censusData[this.currentKey].mac = [];
        if (res) {
          this.censusData[this.currentKey].checkTree.name = "";
          this.censusData[this.currentKey].checkTree.msg = [];
          // 防止重复推入tree
          this.censusData[this.currentKey].checkMsg.tree = [];
          tArray.forEach(item => {
            this.getcheckTree(item)
          });
          this.searchtree = "";
        }
        this.censusData[this.currentKey].viewMsg[0].msg = this.censusData[
          this.currentKey
        ].checkTree.name;
      });
    },
    getcheckTree (item) {
      if (item.isChecked === true) {
        this.censusData[this.currentKey].checkTree.name +=
          item.name + ",";
        this.censusData[this.currentKey].checkTree.msg.push(item);
        this.censusData[this.currentKey].checkMsg.tree.push(item);
        /* 获取当前已选择组织下的机组 */
        this.$getApi
          .queryAllMachineByTid({
            t_id: item.t_id,
            t_root: item.t_root
          })
          .then(res => {
            res && this.getMachineSuccess(res, item.t_id);
          });
      }
      // 查询子机组是否存在选中
      if (item.children && item.children.length > 0) {
        item.children.forEach(el => {
          this.getcheckTree(el)
        })
      }
      const defaultName = [
        this.$t('Census.selectTree'),//"请选择组织",
        this.$t('Census.selectMac'),//"请选择机组",
        this.$t('Census.selectPos'),//"请选择测点",
        this.$t('Census.selectEigen'),//"请选择特征值"
      ];
      const defaultClass = "gray-tip";
      this.censusData[this.currentKey].viewMsg[1].msg = defaultName[1];
      this.censusData[this.currentKey].viewMsg[1].class = defaultClass;
      this.censusData[this.currentKey].viewMsg[2].msg = defaultName[2];
      this.censusData[this.currentKey].viewMsg[2].class = defaultClass;
      this.censusData[this.currentKey].checkMsg.mac = [];
      this.censusData[this.currentKey].checkMsg.pos = [];

    },
    /* 匹配拼音,匹配到返回true,否则返回flase */
    matchPinyin (matchVal, val) {
      return this.pinyin.match(matchVal, val);
    },
    // 全部选择
    checkAll (item) {
      item.isCheck = !item.isCheck;
      const text = this.checkList.text;
      for (let i = 0, l = text.length; i < l; i++) {
        const value = text[i];
        value.isCheck = item.isCheck;
        const children = value.child;
        for (let j = 0, len = children.length; j < len; j++) {
          const val = children[j];
          val.isCheck = item.isCheck;
        }
      }
    },
    // 父级全选
    checkAllChild (item) {
      if (item.hasOpen) {
        const child = item.child;
        if (item.isCheck) {
          this.checkList.text[0].isCheck = false;
          for (const value of child) {
            value.isCheck = false;
          }
        } else {
          for (const value of child) {
            value.isCheck = true;
          }
        }
      }
    },
    // 子级单选
    checkItem (item, data) {
      data.isCheck = !data.isCheck
      if (item.hasOpen) {
        const list = this.checkList.text;
        const child = item.child;
        let idx = 0;
        let i = 0;
        // const l = item.oriList.length;
        const l = child.length;
        for (; i < l; i++) {
          const value = child[i];
          if (value.isCheck == true) {
            idx++;
          }
        }
        item.isCheck = idx === l;
        i = 1;
        for (let l = list.length; i < l; i++) {
          if (!list[i].isCheck) {
            break;
          }
        }
        list[0].isCheck = i === item.oriList.length;
      }
    },
    // 设置类名
    setClass (bool, type) {
      const iName = "iconfont";
      const strArr = {
        check: ["icon-zhongzi_xuanzekuang", "icon-zhongzi_xuanzekuang1"],
        open: ["icon-zhankai_huaban", "icon-shouqi_huaban"],
        isOpen: [
          "my-census-li text-overflow",
          "my-census-li text-overflow openList"
        ],
        hasOpen: ["", "hasOpen"]
      };
      return `${iName} ${strArr[type][Number(bool)]}`;
    },
    /* 设置长度限制
         value: 输入的值
         length: 限制的长度
         item: 绑定值的父级对象
         type: 类型(0: 转速下限, 1: 转速上限)
      */
    setLength (value, length, item, type = -1) {
      value.length > length &&
        type >= 0 &&
        (item[type] = value.slice(0, length));
    },
    // 设置下拉列表
    setList (index, e) {
      const data = this.censusData[this.currentKey];
      const tree = data.tree;
      const mac = data.mac;
      const pos = data.pos;
      const check = data.checkMsg;
      const code = data.code;
      const text = [];
      const size = e.currentTarget.getBoundingClientRect();
      const style = {
        maxHeight: "300px",
        width: "220px",
        left: size.left + "px",
        top: size.top + size.height + "px"
      };
      this.searchMsg = "";
      if (index === 1 && mac !== null) {
        /* 机组下拉 */
        this.placeholder = "搜索机组";
        let checkAll = true;
        //遍历checkMsg中的tree
        for (let m = 0, n = check.tree.length; m < n; m++) {
          const val = check.tree[m];
          const child = [];
          const macMsg = mac[val.t_id];
          if (!macMsg) {
            continue;
          }
          const l = macMsg.length;
          const len = check.mac.length;
          let isCheck = true;
          for (let i = 0; i < l; i++) {
            const value = macMsg[i];
            let childCheck = false;
            if (value.t_root == 1 || value.t_root == 2) {
              for (let j = 0; j < len; j++) {
                if (
                  `${check.mac[j].mac_id}_${check.mac[j].ch_class}` ===
                  `${value.mac_id}_${value.ch_class}`
                ) {
                  childCheck = true;
                  break;
                }
              }
            } else {
              for (let j = 0; j < len; j++) {
                if (check.mac[j].mac_id === value.mac_id) {
                  childCheck = true;
                  break;
                }
              }
            }
            if (value.t_id === val.t_id) {
              childCheck || (isCheck = false);
              child.push({
                val: value.m_me,
                id: value.mac_id,
                isCheck: childCheck,
                t_root: value.t_root,
                ch_class: value.ch_class,
                m_type: value.m_type
              });
            }
          }
          if (checkAll && !isCheck) checkAll = false;
          let oriList = cloneObj(child, true);
          text.push({
            isCheck,
            isAll: false,
            isChild: true,
            hasOpen: true,
            isOpen: false,
            val: val.t_name,
            id: val.t_id,
            child,
            oriList //原始数据
          });
        }
        if (text.length > 0) {
          text.unshift({
            isCheck: checkAll,
            isAll: true,
            isChild: false,
            hasOpen: false,
            isOpen: false,
            val: this.$t('Census.entirety'),//全部
            id: -1,
            child: []
          });
          this.srcList = text;

          this.checkList = {
            key: "mac",
            isShow: true,
            text,
            style,
            index
          };
        }
      } else if (index === 2 && pos !== null) {
        /* 测点下拉 */
        this.placeholder = this.$t('Census.SearchPos');//搜索测点
        let checkAll = true;
        for (let m = 0, n = check.mac.length; m < n; m++) {
          const val = check.mac[m];
          const child = [];
          let posMsg;
          if (val.t_root == 1 || val.t_root == 2) {
            posMsg = pos[`${val.mac_id}_${val.ch_class}`];
          } else {
            posMsg = pos[val.mac_id];
          }
          if (!posMsg) {
            continue;
          }
          const len = check.pos.length;
          let isCheck = true;
          for (let i = 0, l = posMsg.length; i < l; i++) {
            const value = posMsg[i];
            let childCheck = false;
            for (let j = 0; j < len; j++) {
              const v = check.pos[j];
              if (v.posFlag === value.posFlag) {
                childCheck = true;
                break;
              }
            }
            if (value.machine_id === val.mac_id) {
              childCheck || (isCheck = false);
              child.push({
                val: value.position_name,
                id: value.position_id,
                type: value.position_type,
                mId: value.machine_id,
                isCheck: childCheck,
                posFlag: value.posFlag,
                m_type: value.m_type
              });
            }
          }
          let oriList = cloneObj(child, true);
          if (checkAll && !isCheck) checkAll = false;
          text.push({
            isAll: false,
            isCheck,
            isChild: true,
            hasOpen: true,
            isOpen: false,
            val: val.m_me,
            id: val.t_root == 1 || val.t_root == 2 ? `${val.mac_id}_${val.ch_class}` : val.mac_id,
            child,
            oriList
          });
        }
        if (text.length > 0) {
          text.unshift({
            isCheck: checkAll,
            isAll: true,
            isChild: false,
            hasOpen: false,
            isOpen: false,
            val: this.$t('Census.entirety'),//全部
            id: -1,
            child: []
          });
          this.srcList = text;
          this.checkList = {
            key: "pos",
            isShow: true,
            text,
            style,
            index
          };
        }
      } else if (index === 3 && code.length > 0) {
        /* 特征值下拉 */
        for (let i = 0, l = code.length; i < l; i++) {
          const value = code[i];
          // 过滤时间
          if (value.code != 0) {
            text.push({
              val: value.val,
              code: value.code,
              filed: value.filed,
              icon: "",
              key: "code"
            });
          }

        }
        this.$list({
          text,
          pattern: style
        }).then(res => {
          res.index > -1 && this.getList(res.item, res.index);
        });
      } else if (index === 6) {
        /* 时间下拉 */
        this.$list({
          text: cloneObj(this.dateType, true),
          pattern: style
        }).then(res => {
          res.index > -1 && this.getList(res.item, res.index);
        });
      } else if (index === 9) {
        /* 统计方式下拉 */
        this.$list({
          text: cloneObj(this.statisticalType, true),
          pattern: style
        }).then(res => {
          res.index > -1 && this.getList(res.item, res.index);
        });
      } else if (index === 5) {
        /* 选择单位 */
        const unitArr = ["g", "m/s²"];
        for (const val of unitArr) {
          text.push({
            val,
            icon: ""
          });
        }
        if (data.unitShow) {
          this.$list({
            text,
            pattern: style
          }).then(res => {
            if (res.index > -1) {
              unitArr.reverse();
              const unit1 = res.item.val;
              data.viewMsg[5].msg = res.item.val;
              const body = data.viewList.body;
              if (body) {
                const unitY = data.chart.y.unit;
                const dataY = data.chart.y.data;
                if (unitY.includes(unitArr[res.index])) {
                  for (let i = 0, l = unitY.length; i < l; i++) {
                    const unitVal = unitY[i];
                    const idx1 = unitArr.indexOf(unitVal);
                    if (idx1 > -1 && idx1 === res.index) {
                      const value = parseFloat(body[i].value);
                      if (idx1 === 0) {
                        body[i].value = `${round(value / 9.8, 4)}`; // g
                        unitY[i] = "g";
                        dataY[i] = round(dataY[i] / 9.8, 4);
                      } else {
                        body[i].value = `${round(value * 9.8, 4)}`; // m/s²
                        unitY[i] = "m/s²";
                        dataY[i] = round(dataY[i] * 9.8, 4);
                      }
                    }
                  }
                  data.isNewChart = true;
                  if (!data.isList) {
                    this.setOption();
                  }
                }
              }
            }
          });
        }
      }
    },
    // 关闭多选框
    getCheck (e) {
      if (e.target.className === "census-list-box") {
        const list = this.checkList;
        const idx = list.index;
        list.isShow = false;
        const data = this.censusData[this.currentKey];
        const tree = data.tree;
        const mac = data.mac;
        const pos = data.pos;
        const restoreObj = {
          tree: "mac",
          mac: "pos"
        };
        const view = data.viewMsg;
        const text = this.srcList;
        let arr = [];
        const defaultName = [
          this.$t('Census.selectTree'),//"请选择组织",
          this.$t('Census.selectMac'),//"请选择机组",
          this.$t('Census.selectPos'),//"请选择测点",
          this.$t('Census.selectEigen'),//"请选择特征值"
        ];
        const defaultClass = "gray-tip";
        const getNext = [
          {
            url: "queryAllMachineByTid",
            key: "t_id",
            methods: this.getMachineSuccess
          },
          {
            url: "queryAllPositionsByMacId",
            key: "mac_id",
            methods: this.getPositionSuccess
          }
        ];
        const idObj = {
          tree: {
            id: "t_id",
            nextId: "t_id"
          },
          mac: {
            id: "t_id",
            nextId: "mac_id"
          },
          pos: {
            id: "mac_id",
            nextId: "position_id",
            type: "position_type",
            mId: "machine_id"
          }
        };
        let viewText = "";
        const length = text.length;
        if (idx === 0) {
          /* 组织 */
          for (let i = 0; i < length; i++) {
            const value1 = text[i];
            if (value1.isCheck) {
              if (!mac[value1.id]) {
                /* 获取当前没有已选择组织下的机组 */
                this.$getApi
                  .queryAllMachineByTid({
                    t_id: value1.id,
                    t_root: value1.t_root
                  })
                  .then(res => {
                    res && this.getMachineSuccess(res, value1.id);
                  });
              }
              for (let j = 0, len = tree.length; j < len; j++) {
                const value2 = tree[j];
                if (value1.id === value2.t_id) {
                  viewText += `${value1.val},`;
                  arr.push(cloneObj(value2, true));
                }
              }
            }
          }
          viewText.indexOf(",") > -1 && (viewText = viewText.slice(0, -1));
          viewText !== "" && (view[0].msg = viewText);
          if (viewText !== "") {
            view[0].msg = viewText;
            view[0].class = "";
          } else {
            view[0].msg = defaultName[0];
            view[0].class = defaultClass;
          }
          view[1].msg = defaultName[1];
          view[1].class = defaultClass;
          view[2].msg = defaultName[2];
          view[2].class = defaultClass;
          // view[3].msg = '请选择特征值';
          data.checkMsg.tree = arr;
          data.checkMsg.mac = [];
          data.checkMsg.pos = [];
        } else if (idx === 1) {
          /* 机组 */
          let i = 1;
          if (text[0].val === this.$t('Census.entirety') && text[0].isCheck) {//全部
            let request = []
            viewText = this.$t('Census.entirety')//全部;
            let macIDS = []
            for (; i < length; i++) {
              const children = text[i].child;
              for (let j = 0, len = children.length; j < len; j++) {
                const value = children[j];
                request.push({ t_root: value.t_root, mac_id: value.id, ch_class: value.ch_class })
                let key = value.id;
                if (value.t_root == 1 || value.t_root == 2) {
                  key = `${value.id}_${value.ch_class}`;
                }
                macIDS.push(key)
              }
            }
            // request = JSON.stringify(request)
            if (request.length > 0) {
              this.$getApi.queryAllPosByMacIds(request).then(res => {
                if (res.positions.length > 0) {
                  // res.positions.forEach(item => {
                  //   if (item.t_root != 0) {
                  //     if (macIDS.indexOf(`${item.machine_id}_${item.ch_class}`) == -1) {
                  //       macIDS.push(`${item.machine_id}_${item.ch_class}`)
                  //     }
                  //   } else {
                  //     if (macIDS.indexOf(item.machine_id) == -1) {
                  //       macIDS.push(item.machine_id)
                  //     }
                  //   }
                  // })
                  let mac = res.positions
                  for (let k = 0; k < macIDS.length; k++) {
                    let m = []
                    for (let a = 0; a < mac.length; a++) {
                      let key = mac[a].machine_id
                      if (mac[a].t_root == 1 || mac[a].t_root == 2) {
                        key = `${mac[a].machine_id}_${mac[a].ch_class}`
                      }
                      if (macIDS[k] == key) {
                        m.push(mac[a])
                      }
                    }
                    this.getPositionSuccess(m, macIDS[k]);
                  }
                }
              })
            }
            for (let a = 1; a < length; a++) {
              arr = arr.concat(mac[text[a].id]);
            }
            // for (; i < length; i++) {
            //   const children = text[i].child;
            //   for (let j = 0, len = children.length; j < len; j++) {
            //     const value = children[j];
            //     let key = value.id;
            //     if (value.t_root != 0) {
            //       key = `${value.id}_${value.ch_class}`;
            //     }
            //     if (!pos[value.id]) {
            //       /* 获取当前没有已选择机组下的测点 */
            //       this.$getApi.queryAllPositionsByMacId({
            //           mac_id: value.id,
            //           m_type: value.m_type,
            //           t_root: value.t_root,
            //           ch_class: value.ch_class
            //         })
            //         .then(res => {
            //           res && this.getPositionSuccess(res, key);
            //         });
            //     }
            //   }
            //   arr = arr.concat(mac[text[i].id]);
            // }
          } else {
            let checkNum = 1;
            let request = []
            for (; i < length; i++) {
              const value1 = text[i];
              const children = value1.child;
              if (value1.isCheck) checkNum++;
              for (let j = 0, len = children.length; j < len; j++) {
                const value2 = children[j];
                let key = value2.id;
                if (value2.t_root == 1 || value2.t_root == 2) {
                  key = `${value2.id}_${value2.ch_class}`;
                }
                if (value2.isCheck) {
                  const macMsg = mac[value1.id];
                  for (let m = 0, l = macMsg.length; m < l; m++) {
                    const value3 = macMsg[m];
                    let key3 = value3.mac_id;
                    if (value3.t_root == 1 || value3.t_root == 2) {
                      key3 = `${value3.mac_id}_${value3.ch_class}`;
                    }
                    if (key3 === key) {
                      if (!pos[key]) {
                        /* 获取当前没有已选择机组下的测点 */
                        request.push({ t_root: value2.t_root, mac_id: value2.id, ch_class: value2.ch_class })
                        // this.$getApi
                        //   .queryAllPositionsByMacId({
                        //     mac_id: value2.id,
                        //     m_type: value2.m_type,
                        //     t_root: value2.t_root,
                        //     ch_class: value2.ch_class
                        //   })
                        //   .then(res => {
                        //     // res && this.getPositionSuccess(res.positions, key);
                        //   });
                      }
                      arr.push(cloneObj(value3));
                      viewText += `${value2.val},`;
                    }
                  }
                }
              }
            }
            if (request.length > 0) {
              this.$getApi.queryAllPosByMacIds(request).then(res => {
                if (res.positions.length > 0) {
                  let macIDS = []
                  res.positions.forEach(item => {
                    if (item.t_root == 1 || item.t_root == 2) {
                      if (macIDS.indexOf(`${item.machine_id}_${item.ch_class}`) == -1) {
                        macIDS.push(`${item.machine_id}_${item.ch_class}`)
                      }
                    } else {
                      if (macIDS.indexOf(item.machine_id) == -1) {
                        macIDS.push(item.machine_id)
                      }
                    }
                  })
                  let mac = res.positions
                  for (let k = 0; k < macIDS.length; k++) {
                    let m = []
                    for (let a = 0; a < mac.length; a++) {
                      let key = mac[a].machine_id
                      if (mac[a].t_root == 1 || mac[a].t_root == 2) {
                        key = `${mac[a].machine_id}_${mac[a].ch_class}`
                      }
                      if (macIDS[k] == key) {
                        m.push(mac[a])
                      }
                    }
                    this.getPositionSuccess(m, macIDS[k]);
                  }
                }
              })
            }
            checkNum === length && (viewText = this.$t('Census.entirety'));
          }
          viewText.indexOf(",") > -1 && (viewText = viewText.slice(0, -1));
          if (viewText !== "") {
            view[1].msg = viewText;
            view[1].class = "";
          } else {
            view[1].msg = defaultName[1];
            view[1].class = defaultClass;
          }
          view[2].msg = defaultName[2];
          view[2].class = defaultClass;
          // view[3].msg = '请选择特征值';
          data.checkMsg.mac = arr;
          data.checkMsg.pos = [];
        } else if (idx === 2) {
          /* 测点 */
          let typeArr = [];
          let i = 1;
          let dgm = [];
          if (text[0].val === this.$t('Census.entirety') && text[0].isCheck) {
            viewText = this.$t('Census.entirety');
            for (; i < length; i++) {
              const value1 = text[i];
              const children = value1.child;
              for (let j = 0, len = children.length; j < len; j++) {
                const value2 = children[j];
                value2.type !== 200 && typeArr.push(value2.type);
              }
              arr = arr.concat(pos[value1.id]);
            }
          } else {
            let checkNum = 1;
            for (; i < length; i++) {
              const value1 = text[i];
              const children = value1.child;
              const posMsg = pos[value1.id];
              if (value1.isCheck) checkNum++;
              for (let j = 0, len = children.length; j < len; j++) {
                const val = children[j];
                if (val.isCheck) {
                  for (let m = 0, n = posMsg.length; m < n; m++) {
                    const value2 = posMsg[m];
                    if (val.posFlag === value2.posFlag) {
                      viewText += `${val.val},`;
                      value2.position_type !== 200 &&
                        typeArr.push(value2.position_type);
                      arr.push(cloneObj(value2, true));
                    }
                  }
                }
              }
            }
            checkNum === length && (viewText = this.$t('Census.entirety'));
          }
          // 判断采集器类型
          i = 0;
          for (let l = arr.length; i < l; i++) {
            if (arr[i].dgm_type == 1) {
              dgm[1] = 4;
            } else if (arr[i].dgm_type == 3) {
              dgm[0] = 3;
            }
          }
          // 筛选特征值
          if (arr.length > 0) {
            const checkMsg = data.checkMsg; /* 已选择信息 */
            const cTree = checkMsg.tree; /* 已选择组织 */
            const cMac = checkMsg.mac; /* 已选择机组 */
            i = 0;
            let eigenvalue = [];
            for (let l = cTree.length; i < l; i++) {
              const tValue = cTree[i];
              for (let j = 0, len = cMac.length; j < len; j++) {
                const mValue = cMac[j];
                if (mValue.t_id === tValue.t_id) {
                  for (let m = 0, n = arr.length; m < n; m++) {
                    const pValue = arr[m];
                    if (
                      pValue.machine_id === mValue.machine_id &&
                      pValue.position_type !== 200
                    ) {
                      // 去除时间特征值
                      let a = setHead(
                        tValue.t_root,
                        pValue.dgm_type,
                        pValue.position_type,
                        pValue.pos_loc
                      );
                      let b = [];
                      for (let i = 0; i < a.length; i++) {
                        if (a[i].code != 0) {
                          b.push(a[i]);
                        }
                      }
                      eigenvalue = eigenvalue.concat(b);
                    }
                  }
                }
              }
            }
            i = 0;
            const newEigenvalue = [];
            for (let l = eigenvalue.length; i < l; i++) {
              const eValue = eigenvalue[i];
              let isHas = false;
              for (let j = 0, len = newEigenvalue.length; j < len; j++) {
                const nValue = newEigenvalue[j];
                if (nValue.code === eValue.code || nValue.val === eValue.val) {
                  isHas = true;
                  break;
                }
              }
              if (eValue.code !== 0 && !isHas) {
                newEigenvalue.push({
                  filed: eValue.filed,
                  val: eValue.val,
                  code: eValue.code
                });
              }
            }
            data.code = newEigenvalue;
            i = 0;
            let isHas = false;
            for (let l = newEigenvalue.length; i < l; i++) {
              if (newEigenvalue[i].val == view[3].msg) {
                isHas = true;
                break;
              }
            }
            if (!isHas) {
              view[3].msg = defaultName[3];
              view[3].class = "gray-tip";
            }
          }
          viewText.indexOf(",") > -1 && (viewText = viewText.slice(0, -1));
          if (viewText !== "") {
            view[2].msg = viewText;
            view[2].class = "";
          } else {
            view[2].msg = defaultName[2];
            view[2].class = defaultClass;
          }
          data.checkMsg.pos = cloneObj(arr, true);
          view[11].msg.forEach(item => {
            item.isCheck = false;
          })
          if (dgm.length > 0) {
            view[11].msg[3].isCheck = dgm[0] !== undefined;
            view[11].msg[4].isCheck = dgm[1] !== undefined;
            // dgm[0] && (view[11].msg[dgm[0]].isCheck = true);
            // dgm[1] && (view[11].msg[dgm[1]].isCheck = true);
          } else {
            i = 0;
            for (let l = view[11].msg.length; i < l; i++) {
              view[11].msg[i].isCheck = false;
            }
          }

        }
        //判断选中测点是否包含振动测点
        let posArr = data.checkMsg.pos;
        data.unitShow = false;
        for (let i = 0; i < posArr.length; i++) {
          if (posArr[i].position_type == 3) {
            data.unitShow = true;
            break;
          }
        }
      }
    },
    // 获取机组
    getMachineSuccess (data, id) {
      const machines = data.machines;
      let arr = [];
      const l = machines.length;
      if (l > 0) {
        machines.forEach((mac, index) => {
          if (mac.pumps !== undefined) {
            mac.pumps.forEach((pump, index1) => {
              pump.isShow = true; //选择展示的属性
              pump.name = pump.pump_name; //选择组件需要
              pump.m_me = pump.pump_name;
              pump.isChecked = false; //选择组件需要
              pump.t_root = mac.t_root;
              pump.m_type = mac.m_type;
              pump.id = `${index}_${index1}`; // 选择组件需要
              pump.t_id = mac.t_id;
              pump.machine_id = mac.mac_id;
              pump.mac_name = mac.mac_me;
              arr.push(pump);
            });
          } else {
            mac.isChecked = false;
            mac.isShow = true;
            mac.id = index;
            mac.name = mac.mac_me;
            mac.m_me = mac.mac_me;
            // mac.t_id = t_id;
            mac.machine_id = mac.mac_id;
            arr.push(mac);
          }
        });
        this.$store.commit("getMsg", {
          key: "mac",
          keys: id,
          msg: arr
        });
        this.censusData[this.currentKey].mac[id] = arr;
      }
      // if (l > 0) {
      //   const mac = cloneObj(machines, true);
      //   for (let i = 0, l = mac.length; i < l; i++) {
      //     mac[i].machine_id = mac[i].mac_id;
      //     mac[i].m_me = mac[i].mac_me;
      //   }
      //   this.$store.commit("getMsg", {
      //     key: "mac",
      //     keys: id,
      //     msg: mac
      //   });
      //   this.censusData[this.currentKey].mac[id] = mac;
      // }
    },
    // 获取测点
    getPositionSuccess (data, id) {
      const positions = data
      if (positions !== null && positions.length > 0) {
        positions.forEach(item => {
          item.posFlag = `${item.machine_id}_${item.position_id}_${item.position_type}`;
          item.t_root = data.t_root;
          if (item.tt_ch_type == null && item.tt_ch_type == undefined) {
            item.ch_type = item.tt_ch_type
          }
          if (item.tt_ch_id == null && item.tt_ch_id == undefined) {
            item.ch_id = item.tt_ch_id
          }
        });
        const pos = positions;
        this.$store.commit("getMsg", {
          key: "pos",
          keys: id,
          msg: pos
        });
        this.censusData[this.currentKey].pos[id] = pos;
      }
    },
    // 获取选中(特征值、时间类型、统计方式)
    getList (item, index) {
      const key = this.currentKey;
      const data = this.censusData[key];
      if (item.key === "code") {
        data.viewMsg[3].msg = item.val;
        data.viewMsg[3].class = "";
      } else if (item.key === "time") {
        const time = getTimeOfType(index, data.time.end);
        data.startTime.setDate(time.start);
        data.time.start = time.start;
        data.viewMsg[6].msg = item.val;
      } else if (item.key === "statistical") {
        data.viewMsg[9].msg = item.val;
      }
    },
    // 构造请求数据
    setRequestData () {
      const data = this.censusData[this.currentKey];
      // const code = getCodeObj(Number(data.checkMsg.pos.dgm_type));
      const checkTree = data.checkMsg.tree;
      const checkMac = data.checkMsg.mac;
      const checkPos = data.checkMsg.pos;
      const checkTreeMsg = data.viewMsg[0].msg;
      const checkMacMsg = data.viewMsg[1].msg;
      const checkPosMsg = data.viewMsg[2].msg;
      const checkCode = data.viewMsg[3].msg;
      const checkPercentage = data.viewMsg[4].msg;
      const checkType = data.viewMsg[9].msg;
      const checkCondition = data.viewMsg[11].msg;
      const trees = {};
      const machines = {};
      const fileds = {};
      const conditions = [];
      let percentage = "";
      let type = 0;
      let fromSpeed =
        data.viewMsg[10].msg[0] === "" ? null : data.viewMsg[10].msg[0];
      let toSpeed =
        data.viewMsg[10].msg[1] === "" ? null : data.viewMsg[10].msg[1];
      /* 比例 */
      let num = checkPercentage.slice(0, -1);
      const unit = checkPercentage.slice(-1);
      const err = [this.$t('Census.errorInpur'), this.$t('Census.enterProportion')];//输入比例格式有误，请重新输入  请输入比例
      const unitArr = ["%", this.$t('Census.one')];//个
      const defaultName = [
        this.$t('Census.selectTree'),//"请选择组织",
        this.$t('Census.selectMac'),//"请选择机组",
        this.$t('Census.selectPos'),//"请选择测点",
        this.$t('Census.selectEigen'),//"请选择特征值"
      ];
      /* 限制转速区间 */
      if (fromSpeed !== null && toSpeed !== null) {
        fromSpeed = Number(fromSpeed);
        toSpeed = Number(toSpeed);
        if (fromSpeed < 0) {
          this.$pop(this.$t('Census.enterSpeedRange'));
          return;
        }
        if (toSpeed < 0) {
          this.$pop(this.$t('Census.enterSpeedRange'));
          return;
        }
        if (fromSpeed < toSpeed) {
        } else {
          this.$pop(this.$t('Census.enterSpeedRange'));
          return;
        }
        // if (fromSpeed >= 0 && toSpeed >= 0) {
        //   if (fromSpeed > toSpeed) {
        //     this.$pop("请输入正确的转速区间！");
        //     return;
        //   } else {

        //   }
        // } else {
        //   this.$pop("请输入正确的转速区间！");
        //   return;
        // }
      }
      if (checkTreeMsg === defaultName[0]) {
        data.viewMsg[0].class = "red-tip";
        return;
      } else if (checkMacMsg === defaultName[1]) {
        data.viewMsg[1].class = "red-tip";
        return;
      } else if (checkPosMsg === defaultName[2]) {
        data.viewMsg[2].class = "red-tip";
        return;
      } else if (checkCode === defaultName[3]) {
        data.viewMsg[3].class = "red-tip";
        return;
      }
      if (unitArr.includes(unit) || this.$t('Census.one') === '') {
        if (isNaN(Number(num))) {
          this.$pop(err[0]);
          return;
        } else {
          if (num !== "") {
            if (unit == "%") {
              if (num > 100) {
                this.$pop(err[0]);
                return;
              } else {
                percentage = checkPercentage;
              }
            } else if (this.$t('Census.one') == "个" && unit == "个") {
              if (num.indexOf(".") > -1) {
                this.$pop(err[0]);
                return;
              }
              percentage = num;
            } else if (this.$t('Census.one') === '') {
              // 若翻译为英文，则无需对数据进行分割
              num = checkPercentage
              if (num.indexOf(".") > -1) {
                this.$pop(err[0]);
                return;
              }
              percentage = num;
            }
          } else {
            this.$pop(err[0]);
            return;
          }
        }
      } else {
        this.$pop(err[0]);
        return;
      }
      /* 拼 code: 字段 */
      for (const key in defaultCode) {
        fileds[key] = defaultCode[key].filed;
      }
      /* 计算方式 */
      for (const value of this.statisticalType) {
        if (value.val === checkType) {
          type = value.type;
        }
      }
      /* 工况 */
      for (let i = 0, l = checkCondition.length; i < l; i++) {
        const value = checkCondition[i];
        if (value.isCheck) {
          conditions.push(i + 1);
        }
      }
      const rd = {
        startTime: data.time.start,
        endTime: data.time.end,
        fromSpeed,
        toSpeed,
        fileds,
        type,
        percentage,
        conditions
      };
      /* 组织、机组、测点 */
      if (checkMacMsg === this.$t('Census.entirety')) {
        for (let i = 0, l = checkTree.length; i < l; i++) {
          const tree = checkTree[i];
          const obj = {};
          for (let j = 0, len = checkPos.length; j < len; j++) {
            const pos = checkPos[j];
            if (pos.position_type === 200) continue;
            const code = getCodeObj(Number(pos.dgm_type))
            for (const value of code[pos.position_type]) {
              if (value.name === checkCode) {
                obj[pos.position_name] = {
                  id: pos.position_id,
                  type: pos.position_type,
                  value: value.filed,
                  code: value.code
                };
              }
            }
          }
          trees[tree.t_id] = obj;
        }
        rd.trees = trees;
      } else {
        for (let i = 0, l = checkMac.length; i < l; i++) {
          const obj = {};
          const mac = checkMac[i];
          for (let j = 0, len = checkPos.length; j < len; j++) {
            const pos = checkPos[j];
            if (pos.position_type === 200) continue;
            const code = getCodeObj(Number(pos.dgm_type))
            for (const value of code[pos.position_type]) {
              if (value.name === checkCode) {
                obj[pos.position_name] = {
                  id: pos.position_id,
                  type: pos.position_type,
                  value: value.filed,
                  code: value.code
                };
              }
            }
          }
          machines[mac.mac_id] = obj;
        }
        rd.machines = machines;
      }
      this.$emit("loadingImg", true);
      this.$getApi.getStatisticsList(rd).then(res => {
        if (res) {
          this.$emit("loadingImg", false);
          this.getData(res);
        }
      });
      /* {
            "machines":
               {	machieid
                  "19070310230985471":{"name":{"id":"","type":"","value":field,"code":""},...}
                  ...
               },
            "trees":
               {	treeid
                  "1562120557506":{"name":{"id":"","type":"","value":field,"code":""},...}
                  ...
               },
            "percentage":"",
            "startTime":"",
            "endTime":"",
            "type":,
            "fromSpeed":,
            "toSpeed":,
            "conditions":[],//0，1，2，3，4，0为其他工况
            "fields":{1:field,2:field,...}
         } */
    },
    // 获取数据
    getData (data) {
      const list = data.statistics;
      const x = {
        data: [],
        unit: this.$t('Common.pos')
      };
      const y = {
        data: [],
        unit: []
      };
      const head = [
        this.$t('Common.order'),//"序号",
        this.$t('Common.eigenvalue'),//"特征值",
        this.$t('Census.value'),//"数值",
        this.$t('Common.treeName'),//"组织名称",
        this.$t('Common.macName'),//"机组名称",
        this.$t('Common.posName'),//"测点名称"
      ];
      const body = [];
      const unitArr = ["g", "m/s²"];
      const msg = this.censusData[this.currentKey];
      const unit1 = msg.viewMsg[5].msg;
      const idx1 = unitArr.indexOf(unit1);
      if (list !== null && list.length > 0) {
        msg.showEmpty = false;
        const viewMsg = msg.viewMsg;
        const checkTree = msg.checkMsg.tree;
        const checkMac = msg.checkMsg.mac;
        const checkPos = msg.checkMsg.pos;
        for (let i = 0, l = list.length; i < l; i++) {
          const value = list[i];
          let posName = value.positionName;
          for (let j = 0, len = checkPos.length; j < len; j++) {
            const pos = checkPos[j];
            if (posName === pos.position_name) {
              let unit2 = 0;
              let nameArr = [];
              let vv = value.value;
              let codeObj = getCodeObj(Number(pos.dgm_type));
              for (const val of codeObj[pos.position_type]) {
                if (val.name === viewMsg[3].msg) {
                  //筛选特征值为选中特征值
                  unit2 = getUnit(val.code, pos); //根据特征值code获取单位
                  const idx2 = unitArr.indexOf(unit2);
                  if (idx2 > -1 && idx1 > -1 && idx1 !== idx2) {
                    //获取到的单位与选择的单位不一致
                    vv = idx1 === 0 ? round(vv / 9.8, 4) : round(vv * 9.8, 4);
                    unit2 = unit1;
                  } else {
                    vv = round(vv, 4);
                  }
                  break;
                }
              }
              for (let m = 0, n = checkMac.length; m < n; m++) {
                const mac = checkMac[m];
                if (value.macId === mac.mac_id) {
                  for (let o = 0, p = checkTree.length; o < p; o++) {
                    const tree = checkTree[o];
                    if (value.tName === tree.t_name) {
                      if (!mac.mac_me) {
                        mac.mac_me = mac.mac_name;
                      }
                      nameArr.push(tree.t_name, mac.mac_me, pos.position_name);
                      break;
                    }
                  }
                  break;
                }
              }
              // 若设置了unitNum
              if (value.unitNum) {
                vv = round(vv, value.unitNum);
              }
              x.data.push(nameArr);
              body.push({
                code: viewMsg[3].msg,
                value: vv,
                tName: value.tName,
                macName: value.macName,
                posName,
                id: pos.position_id,
                type: pos.position_type,
                mId: value.macId
              });
              y.data.push(vv);
              y.unit.push(unit2);
              break;
            }
          }


        }
      } else {
        msg.showEmpty = true;

      }
      // if (x.data.length > 10) {
      //   x.data = x.data.slice(0, 10);
      //   y.data = y.data.slice(0, 10);
      //   y.unit = y.unit.slice(0, 10);
      // }
      msg.chart = {
        x,
        y
      };
      msg.viewList = {
        head,
        body
      };
      msg.isNewChart = true;
      if (!msg.isList) {
        this.setOption();
      }
    },
    // 切换列表、图谱
    changeChart () {
      const params = this.censusData[this.currentKey];
      const data = params.chart;
      if (!params.isList && data.x.data.length > 0 && params.isNewChart) {
        this.$nextTick(() => {
          this.setOption();
        });
      }
      if (data.x.data.length <= 0) {
        params.showEmpty = true;
      }
    },
    // 画柱状图
    setOption () {
      const params = this.censusData[this.currentKey];
      const data = params.chart;
      /*const color = {
        /!* 颜色设置 *!/ titleColor: "#666" /!* 标题字体 *!/,
        axis: {
          /!* 坐标轴 *!/ name: "#666" /!* 标题 *!/,
          font: "#666" /!* 字体 *!/,
          line: "#ccc" /!* 坐标线 *!/,
          splitLine: "#ccc" /!* 分隔线 *!/
        },
        series: {
          /!* 图谱 *!/ line: "#6C91DD" /!* 谱线 *!/,
          symbol: "#fff" /!* symbol *!/
        },
        tool: {
          symbol: "#ff9b21",
          line: "#ff9b21",
          font: "#fff",
          background: "rgba(255, 155, 33, 0.8)"
        },
        background: "#fff" /!* 背景颜色 *!/
      };*/
      const color = this.color;
      const that = this;
      const option = {
        title: {
          show: false
        },
        grid: {
          top: 40, // 离容器上边距离，默认 60
          right: 10, // 离容器右边距离，默认 '10%
          left: 80, // 离容器左边距离，默认 '10%'
          bottom: 0 // 离容器下边距离，默认 60
        },
        x: {
          name: data.x.unit,
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          type: "category",
          data: data.x.data,
          fontStyle: {
            color: color.axis.font,
            size: "14px"
          },
          lineStyle: {
            color: color.axis.line
          },
          splitLineStyle: {
            color: color.axis.splitLine
          },
          xshow: false //X轴横坐标显示data或者数字1、2、3、4；false显示数字
          // dataZoom: {
          //   start: 0,
          //   end: 10,
          // },
        },
        y: {
          name: data.y.unit,
          name2: params.viewMsg[3].msg,
          nameStyle: {
            color: color.axis.name,
            size: "14px",
            bold: "normal"
          },
          data: data.y.data,
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
          type: "bar", // 类型，默认 'line'
          lineStyle: {
            // 样式
            color: color.series.line, // 颜色，默认 '#0032ff
            width: 1 // 粗细，默认 1
          },
          events: {
            barDblclick: function (event) { }
          }
        },
        toolTip: {
          isShow: true,
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
          formatter (param) {
            for (var i = 0; i < params.viewList.body.length; i++) {
              // Number(value.value.slice(0, -1)) === param.yVal原写法
              if (
                params.viewList.body[i].tName === param.xVal[0] &&
                params.viewList.body[i].macName === param.xVal[1] &&
                params.viewList.body[i].posName === param.xVal[2] &&
                Number(params.viewList.body[i].value) === param.yVal
              ) {
                that.toTrend(params.viewList.body[i]);
                break;
              }
            }
          }
        },
        backgroundColor: color.background
      };
      (params.barChart === null || params.barChart === undefined) &&
        (params.barChart = myChart.init(
          this.$refs.myCensusChart[this.currentIndex]
        ));
      params.barChart.setOption(option);
      params.isNewChart = false;
    },
    // 双击列表跳转趋势图
    toTrend (item) {
      const posFlag = `${item.mId}_${item.id}_${item.type}`;
      const checkPos = this.censusData[this.currentKey].checkMsg.pos;
      let posArr = this.$store.state.pos[item.mId];
      if (!posArr) {
        this.$getApi
          .queryAllPositionsByMacId({
            mac_id: item.mId
          })
          .then(res1 => {
            if (res1.positions && res1.positions.length > 0) {
              let positions = res1.positions;
              positions.forEach(pos => {
                pos.name = pos.position_name;
                pos.isShow = true;
                pos.posFlag = `${pos.machine_id}_${pos.position_id}_${pos.position_type}`;
                if (pos.tt_ch_type == null && pos.tt_ch_type == undefined) {
                  pos.ch_type = pos.tt_ch_type;
                }
                if (pos.tt_ch_id == null && pos.tt_ch_id == undefined) {
                  pos.ch_id = pos.tt_ch_id;
                }
              });
              this.$store.commit("getMsg", {
                key: "pos",
                msg: positions,
                keys: item.mId
              });
              const key = `trend_pos_${posFlag}`;
              let name = "趋势图";
              this.$bus.$emit("choiceChartType", key, name);
            }
          });
      } else {
        const key = `trend_pos_${posFlag}`;
        let name = "趋势图";
        this.$bus.$emit("choiceChartType", key, name);
      }

      // this.$parent.$parent.$refs.header.choiceChartType(key, "趋势图");
      // this.$bus.$emit("choiceChartType", key, name)
    },
    // 导出数据
    exportData () {
      const body = this.censusData[this.currentKey].viewList.body;
      const l = body.length;
      if (l === 0) return;
      const msg = {};
      // 拼数据
      for (let i = 0; i < l; i++) {
        const value = body[i];
        if (msg[value.tName]) {
          msg[value.tName].push({
            mac: value.macName,
            pos: value.posName,
            filed: value.value
          });
        } else {
          msg[value.tName] = [
            {
              mac: "机组",
              pos: "测点",
              filed: value.code
            },
            {
              mac: value.macName,
              pos: value.posName,
              filed: value.value
            }
          ];
        }
      }
      const sortArr = [];
      const testObj = {};
      const reg = new RegExp(/\d+/);
      for (const key in msg) {
        const value = msg[key];
        for (let i = 0, l = value.length; i < l; i++) {
          const val = value[i];
          if (val.mac !== "机组") {
            const result = reg.exec(val.mac);
            if (result !== null && !testObj[result[0]]) {
              sortArr.push(result);
              testObj[result[0]] = 1;
            }
          } else continue;
        }
      }
      sortArr.sort((a, b) => {
        return a[0] - b[0];
      });
      // 排序
      for (const key in msg) {
        const value = msg[key];
        let arr = [value[0]];
        for (let i = 0, l = sortArr.length; i < l; i++) {
          const speed = [];
          const bearing = [];
          const gear = [];
          const alternator = [];
          const other = [];
          let mac = [];
          for (let j = 1, len = value.length; j < len; j++) {
            const val = value[j];
            if (val.mac === sortArr[i].input) {
              mac.push(val);
            }
          }
          for (let j = 0, len = mac.length; j < len; j++) {
            const val = mac[j];
            if (val.pos.indexOf("转速") > -1) {
              speed.push(val);
            } else if (val.pos.indexOf("主轴") > -1) {
              bearing.push(val);
            } else if (val.pos.indexOf("齿轮") > -1) {
              gear.push(val);
            } else if (val.pos.indexOf("电机") > -1) {
              alternator.push(val);
            } else {
              other.push(val);
            }
          }
          arr = arr.concat(speed, bearing, gear, alternator, other);
        }
        msg[key] = arr;
        /* for (let i = 0, l = value.length; i < l; i++) {
               const val = value[i];
               if (i === 0) {
                  head.push(val);
                  continue;
               }
               if (val.pos.indexOf('转速') > -1) {
                  speed.push(val);
               } else if (val.pos.indexOf('主轴') > -1) {
                  bearing.push(val);
               } else if (val.pos.indexOf('齿轮') > -1) {
                  gear.push(val);
               } else if (val.pos.indexOf('电机') > -1) {
                  alternator.push(val);
               } else {
                  other.push(val);
               }
            }
            msg[key] = head.concat(speed, bearing, gear, alternator, other); */
      }
      // 拼导出数据
      let str = "";
      let fileName = "";
      for (const key in msg) {
        fileName += `${key},`;
        str += `\ufeff, ${key}, ,\r\n`;
        const value = msg[key];
        for (let i = 0, l = value.length; i < l; i++) {
          const val = value[i];
          str += `${val.mac}, ${val.pos}, ${val.filed}\r\n`;
        }
      }
      const blob = new Blob([str]);
      const active = this.$refs.exportData[this.currentIndex];
      active.href = URL.createObjectURL(blob);
      active.download = `${fileName.slice(0, -1)}${this.$t('Census.StatisticsVibValues')}.csv`;
      active.click();
    },
    resize () {
      if (this.censusData[this.currentKey] && this.censusData[this.currentKey].barChart) {
        this.censusData[this.currentKey].barChart.resize()
      }
    }
  },
};
