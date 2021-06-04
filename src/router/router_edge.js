import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err);
};

let router = new Router({
  // mode: 'history',
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("pages/login_edge")
    },

    {
      path: "/index",
      name: "index",
      component: () => import("pages/index_edge"),
      redirect: { name: "empty" },
      children: [
        {
          path: "empty",
          name: "empty",
          component: () => import("components/empty/empty_edge")
        },
        {
          path: "fdGeneral",
          name: "fdGeneral",
          component: () => import("components/fd/fdGeneral")
        },
        {
          path: "fdFocus",
          name: "fdFocus",
          component: () => import("components/fd/fdFocus")
        },
        {
          path: "fdModel",
          name: "fdModel",
          component: () => import("components/fd/fdModel")
        },
        {
          path: "windModel",
          name: "windModel",
          component: () => import("components/fd/windModel")
        },
        {
          path: "fdModelitem",
          name: "fdModelitem",
          component: () => import("components/fd/model/model"),
          children: [
            // 锚栓
            {
              path: "fdanchorbolt",
              name: "fdanchorbolt",
              component: () => import("components/fd/model/anchorbolt")
            },
            // 基础
            {
              path: "fdbasics",
              name: "fdbasics",
              component: () => import("components/fd/model/basics")
            },
            // 螺栓
            {
              path: "fdbolt",
              name: "fdbolt",
              component: () => import("components/fd/model/bolt")
            },
            // 传动链
            {
              path: "fddrivechain",
              name: "fddrivechain",
              component: () => import("components/fd/model/drivechain")
            },
            // 叶轮
            {
              path: "fdimpeller",
              name: "fdimpeller",
              component: () => import("components/fd/model/impeller")
            },
            // 油液
            {
              path: "fdoil",
              name: "fdoil",
              component: () => import("components/fd/model/oil")
            },
            // 塔筒
            {
              path: "fdtowerdrum",
              name: "fdtowerdrum",
              component: () => import("components/fd/model/towerdrum")
            }
          ]
        },
        {
          path: "snFocus",
          name: "snFocus",
          component: () => import("components/sn/snFocus")
        },
        {
          path: "snGeneral",
          name: "snGeneral",
          component: () => import("components/sn/snGeneral")
        },
        {
          path: "snModel",
          name: "snModel",
          component: () => import("components/sn/snModel"),
          children: [
            {
              path: "snMechineModel",
              name: "snMechineModel",
              component: () => import("components/sn/model/snMechineModel")
            },
            {
              path: "snVib",
              name: "snVib",
              component: () => import("components/sn/model/snVib")
            },
            {
              path: "snOil",
              name: "snOil",
              component: () => import("components/sn/model/snOil")
            },
            {
              path: "snTowerdrum",
              name: "snTowerdrum",
              component: () => import("components/sn/model/snTowerdrum")
            }
          ]
        },
        {
          path: "tyFocus",
          name: "tyFocus",
          component: () => import("components/ty/tyFocus")
        },
        {
          path: "tyGeneral",
          name: "tyGeneral",
          component: () => import("components/ty/tyGeneral")
        },
        {
          path: "tyModel",
          name: "tyModel",
          component: () => import("components/ty/tyModel"),
          redirect: { name: "tyVib" },
          children: [
            {
              path: "tyVib",
              name: "tyVib",
              component: () => import("components/ty/model/tyVib")
            },
          ]
        },
        {
          path: "gjGeneral",
          name: "gjGeneral",
          component: () => import("components/gj/gjGeneral")
        },
        {
          path: "gjFocus",
          name: "gjFocus",
          component: () => import("components/gj/gjFocus")
        },
        {
          path: "gjModel",
          name: "gjModel",
          component: () => import("components/gj/gjModel")
        },
        {
          path: "gjModelInfo",
          name: "gjModelInfo",
          component: () => import("components/gj/model/gjModelInfo"),
          children: [
            // 车厢总貌图
            {
              path: "gjModelInfo",
              name: "gjModelInfo",
              component: () => import("components/gj/model/gjModelInfo")
            }
          ]
        },
        {
          path: "ytGeneral",
          name: "ytGeneral",
          component: () => import("components/yt/ytGeneral")
        },
        {
          path: "ytFocus",
          name: "ytFocus",
          component: () => import("components/yt/ytFocus")
        },
        {
          path: "ytModel",
          name: "ytModel",
          component: () => import("components/yt/ytModel"),
          redirect: { name: "ytMechineModel" },
          children: [
            {
              path: "ytMechineModel",
              name: "ytMechineModel",
              component: () => import("components/yt/model/ytMechineModel")
            },
            {
              path: "ytAnalyse",
              name: "ytAnalyse",
              component: () => import("components/yt/model/ytAnalyse")
            },
            {
              path: "ytPunchCard",
              name: "ytPunchCard",
              component: () => import("components/yt/model/ytPunchCard")
            }
          ]
        },
        /* {
          path: "hgGeneral",
          name: "hgGeneral",
          component: () => import("components/hg/hgGeneral")
        },
        {
          path: "hgFocus",
          name: "hgFocus",
          component: () => import("components/hg/hgFocus")
        },
        {
          path: "hgModel",
          name: "hgModel",
          component: () => import("components/hg/hgModel"),
          redirect: { name: "hgMechineModel" },
          children: [
            {
              path: "hgMechineModel",
              name: "hgMechineModel",
              component: () => import("components/hg/model/hgMechineModel")
            },
            {
              path: "hgVib",
              name: "hgVib",
              component: () => import("components/hg/model/hgVib")
            },
            {
              path: "hgOil",
              name: "hgOil",
              component: () => import("components/hg/model/hgOil")
            },
            {
              path: "hgTowerdrum",
              name: "hgTowerdrum",
              component: () => import("components/hg/model/hgTowerdrum")
            }
          ]
        }, */
        {
          path: "realSummary",
          name: "realSummary",
          component: () => import("components/realSummary/realSummary_edge")
        },
        {
          path: "real",
          name: "real",
          component: () => import("components/real/real_edge")
        },
        {
          path: "history",
          name: "history",
          component: () => import("components/history/history_edge")
        },
        {
          path: "monitor",
          name: "monitor",
          component: () => import("components/monitor/monitor_edge")
        },
        {
          path: "maintain",
          name: "maintain",
          component: () => import("components/maintain/maintain_edge")
        },
        {
          path: "equipmentParameters",
          name: "equipmentParameters",
          component: () =>
            import("components/equipmentParameters/equipmentParameters_edge")
        },
        {
          path: "census",
          name: "census",
          component: () => import("components/census/census_edge")
        },
        {
          path: "dip",
          name: "dip",
          component: () => import("components/dip/dip_edge")
        },
        {
          path: "wave",
          name: "wave",
          component: () => import("components/wave/wave_edge")
        },
        {
          path: "punchCard",
          name: "punchCard",
          component: () => import("components/punchCard/punchCard_edge")
        },
        {
          path: "wave3d",
          name: "wave3d",
          component: () => import("components/wave3d/wave3d_edge")
        },
        {
          path: "tmswave3d",
          name: "tmswave3d",
          component: () => import("components/tmswave3d/tmswave3d_edge")
        },
        {
          path: "trend",
          name: "trend",
          component: () => import("components/trend/trend_edge")
        },
        {
          path: "tmstrend",
          name: "tmstrend",
          component: () => import("components/tmstrend/tmstrend_edge")
        },
        {
          path: "overturn",
          name: "overturn",
          component: () => import("components/overturn/overturn_edge")
        },
        {
          path: "scatter",
          name: "scatter",
          component: () => import("components/scatter/scatter_edge")
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("components/dashboard/dashboard_edge")
        },
        {
          path: "alarm",
          name: "alarm",
          component: () => import("components/alarm/alarm_edge")
        },
        {
          path: "server",
          name: "server",
          component: () => import("components/server/server_edge")
        },
        {
          path: "system",
          name: "system",
          component: () => import("components/system/system_edge")
        },
        {
          path: "railCorrugation",
          name: "railCorrugation",
          component: () =>
            import("components/railCorrugation/railCorrugation_edge")
        },
        {
          path: "diagnosisTrend",
          name: "diagnosisTrend",
          component: () =>
            import("components/diagnosisTrend/diagnosisTrend_edge")
        },

        /* 单值棒图 */
        {
          path: "singleBar",
          name: "singleBar",
          component: () => import("components/singleBar/singleBar_edge")
        },
        /* 多值棒图 */
        {
          path: "multiBar",
          name: "multiBar",
          component: () => import("components/multiBar/multiBar_edge")
        },
        /* 转速时间图 */
        {
          path: "speedTime",
          name: "speedTime",
          component: () => import("components/speedTime/speedTime_edge")
        },
        /* 伯德图 */
        {
          path: "bode",
          name: "bode",
          component: () => import("components/bode/bode_edge")
        },
        /* 启停机数据列表 */
        {
          path: "startStop",
          name: "startStop",
          component: () => import("components/startStop/startStop_edge")
        },
        /* 专家系统 */
        {
          path: "expertSystem",
          name: "expertSystem",
          component: () => import("components/expertSystem/expertSystem_edge")
        },
        /* 全频谱图 */
        {
          path: "fullSpectrum",
          name: "fullSpectrum",
          component: () => import("components/fullSpectrum/fullSpectrum_edge")
        },
        /* 全息谱图 */
        {
          path: "hologram",
          name: "hologram",
          component: () => import("components/hologram/hologram_edge")
        },
        /* 级联图 */
        {
          path: "cascade",
          name: "cascade",
          component: () => import("components/cascade/cascade_edge")
        },
        /* 启停机频谱瀑布图 */
        {
          path: "ssSpectrumWaterfall",
          name: "ssSpectrumWaterfall",
          component: () => import("components/ss_SpectrumWaterfall/ssSpectrumWaterfall_edge")
        },
        /* 多频谱图 */
        {
          path: "multiSpectrum",
          name: "multiSpectrum",
          component: () => import("components/multiSpectrum/multiSpectrum_edge")
        },
        /* 单面动平衡 */
        {
          path: "singledynamicBalance",
          name: "singledynamicBalance",
          component: () => import("components/singledynamicBalance/singledynamicBalance_edge")
        },
        /* 双面面动平衡 */
        {
          path: "doubledynamicBalance",
          name: "doubledynamicBalance",
          component: () => import("components/doubledynamicBalance/doubledynamicBalance_edge")
        },
        /* 极坐标图 */
        {
          path: "polarDiagram",
          name: "polarDiagram",
          component: () => import("components/polarDiagram/polarDiagram_edge")
        },
        /* 轴心轨迹图 */
        {
          path: "axisLocus",
          name: "axisLocus",
          component: () => import("components/axisLocus/axisLocus_edge")
        },
        /* 8000报警日志 */
        {
          path: "alarm1",
          name: "alarm1",
          component: () => import("components/alarm_8000/alarm1_edge")
        },
        /* 轴心位置图 */
        {
          path: "axisPosition",
          name: "axisPosition",
          component: () => import("components/axisPosition/axisPosition_edge")
        },
        /* 多轨迹图 */
        {
          path: "multiTrack",
          name: "multiTrack",
          component: () => import("components/multiTrack/multiTrack_edge")
        },
        /* nyquist图 */
        {
          path: "nyquist",
          name: "nyquist",
          component: () => import("components/nyquist/nyquist_edge")
        },
        // 声光报警-所有组织实时报警数据
        {
          path: "realAlarm",
          name: "realAlarm",
          component: () => import("components/realAlarm/realAlarm_edge")
        },
        // 用户手册
        {
          path: "userManual",
          name: "userManual",
          component: () => import("components/userManual/userManual_edge")
        },
        // 踏面测量数据
        {
          path: "treadData",
          name: "treadData",
          component: () => import("components/treadData/treadData_edge")
        },
        // 踏面磨损趋势
        {
          path: "wearTrend",
          name: "wearTrend",
          component: () => import("components/wearTrend/wearTrend_edge")
        },
        // 踏面寿命预估
        {
          path: "lifePredict",
          name: "lifePredict",
          component: () => import("components/lifePredict/lifePredict_edge")
        },

      ]
    },
    {
      path: "/*",
      redirect: "/login"
    }
  ]
});
// 刷新跳转到空白页
router.beforeEach((to, from, next) => {
  //刷新页面的时候跳到空白页
  if (from.name === null && to.name !== "login" && to.name !== "empty") {
    next({ name: "empty" });
    //(token失效)
  } else if (
    from.name === "login" &&
    sessionStorage.getItem("token") === null
  ) {
    next({ name: "login" });
  } else if (to.name === "login" && to.query.token != undefined) {
    let params = to.query;
    let user = {
      user_trees: null,
      password: null,
      name: null,
      id: null,
      menu: null,
      type: 2,
      status: null,
      username: null
    };
    sessionStorage.setItem("token", params.token);
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("tree", params.t_ids);
    next({ name: "index" });
  } else {
    next();
  }
});

export default router;
