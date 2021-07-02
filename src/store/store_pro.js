import Vue from "vue";
import Vuex from "vuex";
import router from "../router/router_edge";

Vue.use(Vuex);
import i18n from '../common/i18n';
import { $t } from '../common/i18n';

function trans (args) {
  if (localStorage.getItem('language')) {
    if (i18n.locale != localStorage.getItem('language')) {
      i18n.locale = localStorage.getItem('language')
    }
  }
  return $t(args)
}

export default new Vuex.Store({
  state: {
    waveMsg: [],
    /* 波形频谱图 */
    wave3dMsg: [],
    /* 三维频谱图 */
    tmswave3dMsg: [],
    /* tms三维频谱图 */
    realMsg: [],
    /* 实时数据 */
    historyMsg: [],
    /* 历史数据 */
    trendMsg: [],
    /* 趋势图 */
    tmstrendMsg: [],
    /* 轨道波磨图 */
    monitorMsg: [],
    /* 监测报表 */
    equipmentParametersMsg: [],
    /* 设备参数 */
    alarmMsg: [],
    /* 报警日志 */
    compareMsg: [],
    /* 对比分析图 */
    macCompareMsg: [],
    /* 机组对比分析图 */
    dipMsg: [],
    /* 倾角分布图、沉降跟踪图 */
    overturnMsg: [],
    /* 机舱轨迹图 */
    spectrumMsg: [],
    /* 专家频谱图 */
    scatterMsg: [],
    /* 散点图 */
    punchCardMsg: [],
    /* 电流卡片 */
    censusMsg: [],
    /* 统计列表 */
    systemMsg: [],
    /* 系统日志 */
    circleMsg: [],
    /*   圆周图 */
    serverMsg: [],
    /* 服务器信息 */
    realAlarmMsg: [],
    /* 服务器信息 */
    maintainMsg: [],
    /* 设备维护记录 */
    alarmProcessingMsg: [],
    /* 报警处理日志 */
    compareData: {},
    /* 对比分析图数据 */
    dashboardMsg: [],
    /* 危险转速区间 */
    realSummaryMsg: [],
    /* 实时数据汇总列表 */
    railCorrugationMsg: [],
    /* 轨道波磨地图 */
    singleBarMsg: [],
    /* 单值棒图 */
    multiBarMsg: [],
    /* 多值棒图 */
    speedTimeMsg: [],
    /* 转速时间图 */
    bodeMsg: [],
    /* 伯德图 */
    startStopMsg: [],
    /* 启停机数据列表 */
    expertSystemMsg: [],
    /* 专家系统 */
    fullSpectrumMsg: [],
    /* 全频谱图 */
    hologramMsg: [],
    /* 全息谱图 */
    cascadeMsg: [],
    /* 级联图 */
    multiSpectrumMsg: [],
    /* 多频谱图 */
    singledynamicBalanceMsg: [],
    /* 单面动平衡 */
    doubledynamicBalanceMsg: [],
    /* 双面动平衡 */
    polarDiagramMsg: [],
    /* 极坐标图 */
    axisLocusMsg: [],
    /* 轴心轨迹图 */
    SpectrumWaterfallMsg: [],
    /* 频谱瀑布图 */
    alarm1Msg: [],
    /* 8000报警 */
    ssSpectrumWaterfallMsg: [],
    /* 启停机频谱瀑布图 */
    axisPositionMsg: [],
    /* 轴心位置图 */
    multiTrackMsg: [],
    /* 多轨迹图 */
    nyquistMsg: [],
    // nyquist图
    diagnosisTrendMsg: [],/* 智能诊断趋势 */
    userManualMsg: [],/* 用户手册 */

    /* 总貌图多开信息 */
    fdGeneralMsg: [],/* 风电总貌图 */
    fdFocusMsg: [],/* 风电重点关注 */
    fdModelMsg: [],/* 风点模型 */
    windModelMsg: [],/* 风电3D模型 */
    fdModelitemMsg: [],/* 风电模型部件 */
    fdanchorboltMsg: [],/* 风电锚栓模型 */
    fdbasicsMsg: [],/* 风电基础模型 */
    fdboltMsg: [],/* 风电螺栓模型 */
    fddrivechainMsg: [],/* 风电传动链模型 */
    fdimpellerMsg: [],/* 风电叶轮模型 */
    fdoilMsg: [],/* 风电油液模型 */
    fdtowerdrumMsg: [],/* 风电塔筒模型 */
    gjGeneralMsg: [],/* 轨交总貌图 */
    gjFocusMsg: [],/* 轨交重点关注 */
    gjModelMsg: [],/* 轨交模型 */
    gjModelInfoMsg: [],/* 轨交模型 */
    snGeneralMsg: [],/* 水泥、化工总貌图 */
    snFocusMsg: [],/* 水泥、化工重点关注 */
    snModelMsg: [],/* 水泥、化工模型 */
    snMechineModelMsg: [],/* 水泥、化工模型设备模型 */
    snVibMsg: [],/* 水泥、化工模型测点列表 */
    snOilMsg: [],/* 水泥、化工模型油液参数 */
    snTowerdrumMsg: [],/* 水泥、化工模型倾角 */
    ytGeneralMsg: [],/* 油田总貌图 */
    ytFocusMsg: [],/* 油田重点关注 */
    ytModelMsg: [],/* 油田模型 */
    ytMechineModelMsg: [],/* 油田模型设备模型 */
    ytAnalyseMsg: [],/* 油田模型沉没度分析 */
    ytPunchCardMsg: [],/* 油田模型-电流卡片 */
    tyGeneralMsg: [],/* 通用总貌图 */
    tyFocusMsg: [],/* 通用重点关注 */
    tyModelMsg: [],/* 通用模型 */
    tyVibMsg: [],/* 通用模型 */
    treadDataMsg: [],/* 踏面测量数据 */
    lifePredictMsg: [],/* 踏面寿命预估 */
    wearTrendMsg: [],/* 踏面磨损趋势 */

    GeneralModel: { /* 设备模型页当前页面 */
    },
    checkMsg: {
      /* 当前选中组织、机组、测点信息 */
      // msg: null,
      tree: null,
      mac: null,
      pos: null,
      type: "0"
      /* 0: 未选择, tree: 组织, mac: 机组, pos: 测点 */
    },
    reportMsg: {
      loadingReport: false,
      tree: null,
      mac: null
    },
    count: {
      server: 0,
      census: 0,
      compare: 0
    },
    foldtree: [], //递归的折叠tree
    tree: [],
    /* 组织信息 */
    mac: {},
    /* 机组信息 */
    pos: {},
    /* 测点信息 */
    srcParams: {
      time: {
        start: Date.now() - 24 * 3600 * 1000,
        /* 开始时间 */
        end: Date.now(),
        /* 结束时间 */
        val: trans('Common.previousDay')//"前一天"
        /* 时间类型 */
      },
      speed: {
        min: "",
        /* 转速下限 */
        max: ""
        /* 转速上限 */
      },
      limit: {
        lower: "",
        /* 过滤下限 */
        upper: ""
        /* 过滤上限 */
      },
      density: {
        /* 选中查询密度型 */
        type: 2,
        val: trans('HeaderEdge.all')//"全部"
      }
    },
    /* 总貌图的标题 */
    generalTitle: "",
    currentTime: 0,
    /* 当前时间点(实时数据) */
    currentSpeed: 0,
    /* 当前转速 */
    structure: true,
    /* dom结构发生改变 */
    isReal: 1,
    /* 实时值是否显示 */
    windmodelTitle: {} /* 总貌图风机中设备模型标题 */,
    chooseTitle: {} /* 选中的标题（当前页） */,
    waveChooseMsg: {} /* 波形频谱图当前操作存储 */,
    keepAlive: [], //页面缓存
    ChName: "",//通道名称
    realAlarm: {},//实时报警（声光报警数据）
  },
  mutations: {
    // 调整图谱状态(增加、切换、删除)
    changeType (state, data) {
      state[`${data.type}Msg`].push({
        state: data.state, //0:增加。1:切换，2:删除 4:图表跳转图谱
        key: data.key
      });
      if (data.type == "wave") {
        state.waveChooseMsg = {
          state: data.state, //0:增加。1:切换，2:删除 4:图表跳转图谱
          key: data.key
        };
      }
    },
    // 服务器信息、对比分析图、统计列表打开界面计数
    addCount (state, key) {
      state.count[key]++;
    },
    changeReportTree (state, tree) {
      if (
        tree != null &&
        this.state.reportMsg.tree != null &&
        this.state.reportMsg.tree.t_id === tree.t_id
      ) {
      } else {
        state.reportMsg.tree = tree;
        state.reportMsg.mac = null;
      }
    },
    // 获取选中组织、机组、测点
    getCheckMsg (state, data) {
      switch (data.type) {
        case "tree":
          state.checkMsg = {
            type: data.type,
            tree: data.msg,
            mac: null,
            pos: null
          };
          break;
        case "mac":
          state.checkMsg.type = data.type;
          state.checkMsg.mac = data.msg;
          state.checkMsg.pos = null;
          break;
        case "pos":
          state.checkMsg.type = data.type;
          state.checkMsg.pos = data.msg;
          break;
      }
    },
    // 仅改变当前选中的指向
    setCheckType (state, type) {
      state.checkMsg.type = type
    },
    // 获取组织、机组、测点信息
    getMsg (state, data) {
      if (data.key === "tree" || data.key === "foldtree") {
        state[data.key] = data.msg;
      } else {
        state[data.key][data.keys] = data.msg;
        if (data.key === "pos" && state[data.key][data.keys].length > 0) {
          for (let k in state.mac) {
            let macArr = state.mac[k];
            for (let i = 0; i < macArr.length; i++) {
              if (
                macArr[i].machine_id == state[data.key][data.keys][0].machine_id
              ) {
                state[data.key][data.keys].forEach(item => {
                  item.t_root = macArr[i].t_root;
                });
              }
            }
          }
        }

        // pos增加了t_root;
        // if (state.checkMsg.tree) {
        //   for (let i = 0; i < state[data.key][data.keys].length; i++) {
        //     state[data.key][data.keys][i].t_root = Number(
        //       state.checkMsg.tree.t_root
        //     );
        //   }
        // }
      }
    },
    // 修改实时值显隐
    changeisReal (state, data) {
      this.isReal = data;
    },
    // 修改时间、转速、上下限
    changeSrcParams (state, data) {
      const time = data.time;
      const speed = data.speed;
      const limit = data.limit;
      const density = data.density;
      const params = state.srcParams;
      if (time) {
        params.time = {
          start: time.start,
          end: time.end,
          val: time.val
        };
      }
      if (speed) {
        params.speed = {
          min: speed.min,
          max: speed.max
        };
      }
      if (limit) {
        params.limit = {
          lower: limit.lower,
          upper: limit.upper
        };
      }
      if (density) {
        params.density = {
          type: density.type,
          val: density.val
        };
      }
    },
    // 当前时间
    setCurrentTime (state, time) {
      state.currentTime = time;
    },
    // 当前转速
    setCurrentSpeed (state, speed) {
      state.currentSpeed = speed;
    },
    // 添加对比分析图数据
    setCompare (state, data) {
      state.compareData[data.key] = data.data;
    },
    // 删除对比分析图数据
    delCompare (state, key) {
      delete state.compareData[key];
    },
    // dom结构发生改变
    changeDomStructure (state) {
      state.structure = !state.structure;
    },
    //获得
    setWindmodelTitle (state, data) {
      console.log('store新增')
      let obj1 = {}
      obj1[data.key] = data.data
      //computed属性监听对象时候，若对象的引导地址未改变，那么computed将不会检测到
      let obj = Object.assign({},state.windmodelTitle, obj1); // 使用Object.assign来更新state.personInfo对象
      console.log(obj)
      state.windmodelTitle = obj
    },
    setChooseTitle (state, data) {
      state.chooseTitle = data;
    },
    set_keepAlive: (state, data) => {
      if (data.method == "del") {
        let index = state.keepAlive.indexOf(data.keepAlive);
        if (index >= 0) {
          state.keepAlive.splice(index, 1);
        }
      } else if (data.method == "add") {
        state.keepAlive.push(data.keepAlive);
      }
    },
    setChName (state, data) {
      state.ChName = data;
    },
    setRealAlarm (state, data) {
      state.realAlarm = data;
    },
    setGeneralModel (state, data) {
      /* 
      data={
        key:key值
        router:当前key值推送到的router
      } 
      */
      state.GeneralModel[data.key] = data.router
    },
    delGeneralModel (state, data) {
      /*  data=key//值 */
      delete state.GeneralModel[data]
    }
  },
  getters: {
    keepAlive: state => state.keepAlive,
    getTree: (state) => (treeId) => {
      return state.tree.find(tree => tree.t_id === treeId)
    },
    getMac: (state) => (treeId, macId) => {
      return state.mac[treeId].find(mac => mac.machine_id === macId)
    },
    getPos: (state) => (macId, posType, posId) => {
      return state.pos[macId].find(pos => pos.position_type === posType && pos.position_id === posId)
    }
  },
  actions: {
    addAsync (context, payload) {
      setTimeout(() => {
        context.commit("getCheckMsg", payload);
        // router.push({
        //   name: 'gjModel',
        // })
      }, 5);
    }
  }
});
