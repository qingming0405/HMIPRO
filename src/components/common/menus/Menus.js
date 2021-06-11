import { matchRule, cloneObj, posTypeName } from 'utils/utils.js'

/**
 * 第一级目录
 * @returns []
 */
export function menusFirstLevl () {
  return [
    {
      val: window.vm.$t('HeaderEdge.firstLevel1'),//'总貌图',
      icon: 'icon-shouye1',
      isAll: true,
      exceptTRoot: [],
      isShow: true,
    },
    {
      val: window.vm.$t('HeaderEdge.firstLevel2'),//'图谱分析',
      icon: 'icon-zhongzi-chakanjiemian-boxing-',
      isAll: false,
      exceptTRoot: [],
      isShow: true,
    },
    {
      val: window.vm.$t('HeaderEdge.firstLevel3'),//'启停机分析',
      icon: 'icon-guanji',
      isAll: false,
      includeTRoot: [4],
      isShow: true,
    },
    {
      val: window.vm.$t('HeaderEdge.firstLevel4'),//'数据分析',
      icon: 'icon-zhongzi-chakanjiemian-shuju-',
      isAll: false,
      exceptTRoot: [],
      isShow: true,
    },
    {
      val: window.vm.$t('HeaderEdge.firstLevel5'),//'日志列表',
      icon: 'icon-rizhiliebiao',
      isAll: false,
      exceptTRoot: [],
      isShow: true,
    },
    // { val: "系统工具", icon: "icon-kehuduan", isAll: false }
  ]
}

/**
 * 第二级目录
 * @returns []
 */
export function menusSecondLevel () {
  return [
    [
      /* 风电总貌图 */
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_1'),//'总貌图',
        icon: 'icon-shouye1',
        name: 'fdGeneral',
        general: true,
        t_root: 0,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_2'),//'重点关注',
        icon: 'icon-shoucang',
        name: 'fdFocus',
        general: true,
        t_root: 0,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
        icon: 'icon-shijingsanwei-',
        name: 'windModel',
        general: true,
        t_root: 0,
      },
      /* 水泥总貌图 */
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_1'),//'总貌图',
        icon: 'icon-shouye1',
        name: 'snGeneral',
        general: true,
        t_root: 1,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_2'),//'重点关注',
        icon: 'icon-shoucang',
        name: 'snFocus',
        general: true,
        t_root: 1,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
        icon: 'icon-shijingsanwei-',
        name: 'snModel',
        general: true,
        t_root: 1,
      },
      /* 轨交总貌图 */
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_1'),//'总貌图',
        icon: 'icon-shouye1',
        name: 'gjGeneral',
        general: true,
        t_root: 2,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_2'),//'重点关注',
        icon: 'icon-shoucang',
        name: 'gjFocus',
        general: true,
        t_root: 2,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
        icon: 'icon-shijingsanwei-',
        name: 'gjModel',
        general: true,
        t_root: 2,
      },
      /* 油田总貌图 */
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_1'),//'总貌图',
        icon: 'icon-shouye1',
        name: 'ytGeneral',
        general: true,
        t_root: 3,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_2'),//'重点关注',
        icon: 'icon-shoucang',
        name: 'ytFocus',
        general: true,
        t_root: 3,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_3'),//'油田设备模型',
        icon: 'icon-shijingsanwei-',
        name: 'ytModel',
        general: true,
        t_root: 3,
      },
      // 化工
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_1'),//'总貌图',
        icon: 'icon-shouye1',
        name: 'hgGeneral',
        general: true,
        t_root: 5,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_2'),//'重点关注',
        icon: 'icon-shoucang',
        name: 'hgFocus',
        general: true,
        t_root: 5,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
        icon: 'icon-shijingsanwei-',
        name: 'hgModel',
        general: true,
        t_root: 5,
      },
      /* 通用总貌图 */
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_1'),//'总貌图',
        icon: 'icon-shouye1',
        name: 'tyGeneral',
        general: true,
        t_root: -1,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_2'),//'重点关注',
        icon: 'icon-shoucang',
        name: 'tyFocus',
        general: true,
        t_root: -1,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
        icon: 'icon-shijingsanwei-',
        name: 'tyModel',
        general: true,
        t_root: -1,
      },
    ],
    [
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_1'),//'智能诊断趋势',
        icon: 'icon-boxing_huaban',
        name: 'diagnosisTrend',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [0] /* 当t_root在exceptTRoot中时标题不显示 */,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_2'),//'波形频谱图',
        icon: 'icon-boxing_huaban',
        name: 'wave',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [3] /* 当t_root在exceptTRoot中时标题不显示 */,
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_3'),//'趋势图',
        icon: 'icon-qushitu_huaban1',
        name: 'trend',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_4'),//'三维频谱图',
        icon: 'icon-sanweipinputu_huaban',
        name: 'wave3d',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [3],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_5'),//'轨道波磨图',
        icon: 'icon-guidao',
        name: 'tmstrend',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [2],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_6'),//'轨道波磨频谱瀑布',
        icon: 'icon-sanweipinputu_huaban',
        name: 'tmswave3d',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [2],
      },
      // {
      //   val: "电流卡片",
      //   icon: "icon-dianliukapian_huaban1_huaban1",
      //   name: "punchCard",
      //   controlShow: true, //后来配置这样表是否显示
      //   isShow: true
      // },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_7'),//'倾角分布图',
        icon: 'icon-qingjiaofenbutu_huaban_huaban',
        name: 'dip',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [1, 2, 3, 4, 5],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_8'),//'机舱轨迹图',
        icon: 'icon-jicangguijitu',
        name: 'overturn',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [1, 2, 3, 4, 5],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_9'),//'散点图',
        icon: 'icon-sandiantu_huaban',
        name: 'scatter',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_10'),//'危险转速区间监测',
        icon: 'icon-yibiaopan',
        name: 'dashboard',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [0],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_11'),//'轨道波磨地图',
        icon: 'icon-iconditietu',
        name: 'railCorrugation',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [2],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_12'),//'单值棒图',
        icon: 'icon-danzhibangtu_huaban1',
        name: 'singleBar',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_13'),//'多值棒图',
        icon: 'icon-duozhibangtu_huaban1',
        name: 'multiBar',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },

      {
        val: window.vm.$t('HeaderEdge.secondLevel2_14'),//'全频谱图',
        icon: 'icon-quanpinputu_huaban1',
        name: 'fullSpectrum',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      // {
      //   val: '全息谱图',
      //   icon: 'icon-23quanxiputu_huaban1',
      //   name: 'hologram',
      //   controlShow: true, //后来配置这样表是否显示
      //   isShow: true,
      //   includeTRoot: [4],
      // },

      {
        val: window.vm.$t('HeaderEdge.secondLevel2_15'),//'多频谱图',
        icon: 'icon-duopinputu_huaban1',
        name: 'multiSpectrum',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_16'),//'单面动平衡',
        icon: 'icon-9danmiandongpingheng_huaban1',
        name: 'singledynamicBalance',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_17'),//'双面动平衡',
        icon: 'icon-10shuangmiandongpingheng_huaban1',
        name: 'doubledynamicBalance',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_18'),//'极坐标图',
        icon: 'icon-14jizuobiao_huaban1',
        name: 'polarDiagram',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_19'),//'轴心轨迹图',
        icon: 'icon-22zhouxinguijitu_huaban1',
        name: 'axisLocus',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel2_20'),//'轴心位置图',
        icon: 'icon-21zhouxinweizhitu_huaban1',
        name: 'axisPosition',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      // {
      //   val: '多轨迹图',
      //   icon: 'icon-26duoguijitu_huaban1',
      //   name: 'multiTrack',
      //   controlShow: true, //后来配置这样表是否显示
      //   isShow: true,
      //   includeTRoot: [4],
      // },
    ],
    [
      // 启停机分析
      {
        val: window.vm.$t('HeaderEdge.secondLevel3_1'),//'转速时间图',
        icon: 'icon-12zhuansushijiantu_huaban1',
        name: 'speedTime',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel3_2'),//'奈奎斯特图',
        icon: 'icon-25naikuisitetu_huaban1',
        name: 'nyquist',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel3_3'),//'伯德图',
        icon: 'icon-13bodetu_huaban1',
        name: 'bode',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel3_4'),//'启停机频谱瀑布图',
        icon: 'icon-19pinpupubutuqitingji_huaban1',
        name: 'ssSpectrumWaterfall',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel3_5'),//'级联图',
        icon: 'icon-20jiliantu_huaban1',
        name: 'cascade',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel3_6'),//'启停机数据列表',
        icon: 'icon-qitingjishujuliebiao_huaban1',
        name: 'startStop',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
    ],
    [
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_1'),//'实时数据汇总列表',
        icon: 'icon-huizong',
        name: 'realSummary',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [1, 3],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_2'),//'实时数据列表',
        icon: 'icon-shishishuju_huaban',
        name: 'real',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_3'),//'历史数据列表',
        icon: 'icon-lishishujuliebiao_huaban',
        name: 'history',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_4'),//'监测报表',
        icon: 'icon-jiancebaobiao_huaban_huaban',
        name: 'monitor',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_5'),//'设备参数',
        icon: 'icon-00-shujujilu-05',
        name: 'equipmentParameters',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [3],
      },
      {
        // 机组
        val: window.vm.$t('HeaderEdge.secondLevel4_6'),//'设备维护记录',
        icon: 'icon-shebei',
        name: 'maintain',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_7'),//'统计列表',
        icon: 'icon-tongjiliebiao_huaban',
        name: 'census',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_8'),//'专家系统',
        icon: 'icon-17zhuanjiaxitong_huaban11',
        name: 'expertSystem',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_9'),//'实时报警汇总列表', //声光报警，不在左导航栏显示
        icon: '',
        name: 'realAlarm',
        controlShow: false, //后来配置这样表是否显示
        isShow: false,
        includeTRoot: [],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_10'),//踏面测量数据
        icon: 'icon-tamianceliangshuju',
        name: 'treadData',
        controlShow: true,
        isShow: true,
        includeTRoot: [2],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_11'),//踏面磨损趋势
        icon: 'icon-tamianmosunqushi',
        name: 'wearTrend',
        controlShow: true,
        isShow: true,
        includeTRoot: [2],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel4_12'),//踏面寿命预估
        icon: 'icon-tamianshoumingyugu',
        name: 'lifePredict',
        controlShow: true,
        isShow: false,
        includeTRoot: [2],
      },
    ],
    [
      {
        val: window.vm.$t('HeaderEdge.secondLevel5_1'),//'报警日志',
        icon: 'icon-baojing_huaban',
        name: 'alarm',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [4],
      },
      // 8000报警日志
      {
        val: window.vm.$t('HeaderEdge.secondLevel5_1'),//'报警日志',
        icon: 'icon-baojing_huaban',
        name: 'alarm1',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        includeTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel5_2'),//'服务器信息',
        icon: 'icon-fuwuqi',
        name: 'server',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
        exceptTRoot: [4],
      },
      {
        val: window.vm.$t('HeaderEdge.secondLevel5_3'),//'系统日志',
        icon: 'icon-xitongrizhi_',
        name: 'system',
        controlShow: true, //后来配置这样表是否显示
        isShow: true,
      },
      { 
        val: window.vm.$t('HeaderEdge.secondLevel5_4'),// 使用手册
        icon: 'icon-icon-test', 
        name: 'userManual' 
      },
    ],
  ]
}

/**
 * 只能由组织打开的总貌图
 * @returns 
 */
export function generalOnlyTree () {
  return [
    'fdGeneral',
    'fdFocus',
    'snGeneral',
    'snFocus',
    'gjGeneral',
    'gjFocus',
    'ytGeneral',
    'ytFocus',
    'tyGeneral',
    'tyFocus',
    'hgGeneral',
    'hgFocus',
  ]
}

/**
 * 只能由机组打开的总貌图
 * @returns 
 */
export function generalOnlyMac () {
  return [
    'fdModel',
    'windModel',
    'snModel',
    'gjModel',
    'ytModel',
    'tyModel',
    'hgModel',
  ]
}

/**
 * 只能由组织打开的图谱
 * @returns 
 */
export function requiredTree () {
  return ['realSummary', 'equipmentParameters']
}

/**
 * 只能由机组打开的图谱
 * @returns 
 */
export function requiredMac () {
  return [
    'maintain',
    'monitor',
    'system',
    'singleBar',
    'multiBar',
    'diagnosisTrend',
  ]
}

/**
 * 只能由测点打开的图谱
 * @returns 
 */
export function requiredPos () {
  return [
    'real',
    'history',
    'wave',
    'trend',
    // "punchCard",
    'tmswave3d',
    'tmstrend',
    'wave3d',
    'dip',
    'overturn',
    'scatter',
    'dashboard',
    'railCorrugation',
    /* 8000 */
    'bode', //伯德图
    'axisPosition' /* 轴心位置图 */,
    'speedTime' /* 转速时间 */,
    'fullSpectrum' /* 全频谱图 */,
    'hologram' /* 全息谱图 */,
    'cascade' /* 级联图 */,
    'SpectrumWaterfall' /* 频谱瀑布图 */,
    'ssSpectrumWaterfall' /* 启停机频谱瀑布图 */,
    'multiSpectrum' /* 多频谱图 */,
    'singledynamicBalance' /* 单面动平衡 */,
    'doubledynamicBalance' /* 双面动平衡 */,
    'polarDiagram' /* 极坐标图 */,
    'axisLocus' /* 轴心轨迹 */,
    'multiTrack' /* 多轨迹图 */,
    'nyquist' /* nyquist图 */,
    'startStop' /* 启停机数据列表 */,
    'expertSystem' /* 专家系统 */,
  ]
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 获取菜单项
 * @param {*} name 
 * @returns 
 */
export function getMenuItem (name) {
  let menuItem
  for (let arr of menusSecondLevel()) {
    menuItem = arr.find(item => item.name === name)
    if (menuItem) {
      break;
    }
  }
  return menuItem
}

/**
 * 获取菜单项的一维数组
 * @param {*} names 
 * @returns 
 */
export function getMenus (names = null) {
  if (names === null || names.length === 0) {
    // 不传参就获取所有菜单项
    return [].concat(...menusSecondLevel())
  }
  // 根据名称数组表过滤菜单项
  return [].concat(...menusSecondLevel()).filter(item => names.indexOf(item.name) >= 0)
}

/**
 * 显示右键菜单列表 
 * @param {事件} e 
 */
export function showRightMenu (that, e, menuList, info) {
  const size = e.currentTarget.getBoundingClientRect()
  that.$list({
    text: menuList,
    pattern: {
      maxHeight: '400px',
      maxWidth: '200px',
      width: `150px`,
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
    },
  }).then((res) => {
    if (res && res.item) {
      let item = res.item
      chartRouting(that, item, info)
    }
  })
}

/**
 * 打开总貌图
 */
export function generalRouting (that, menuItem, info = null) {
  if (info == null) {
    info = that.$store.state.checkMsg
  }
  const { tree, mac } = info
  const name = menuItem.name
  if (generalOnlyTree().includes(name)) {
    if (!tree) {
      /* 没有组织 */
      that.$pop(that.$t('Common.popTreeTips'))//'请选择组织'
      return
    }
    /* 标题只显示组织 */
  } else if (generalOnlyMac().includes(name)) {
    if (!mac) {
      /* 没有机组*/
      that.$pop(that.$t('Common.popMacTips'))//'请选择机组'
      return
    }
  }
  that.$router.push({
    name,
  })
}

/**
 * 跳转图谱之前，修改全局选中，使其与当前图谱保持一致
 * @param {*} that 
 * @param {*} info 
 */
function setCheckMsg (that, info) {
  let isChanged = true // 判断选中是否改变
  let curInfo = that.$store.state.checkMsg
  const { tree, mac, pos, type } = info
  let msg
  switch (type) {
    case 'tree':
      if (curInfo.tree != null && tree.t_id === curInfo.tree.t_id) {
        isChanged = false
      }
      msg = tree
      break;
    case 'mac':
      if (curInfo.mac != null && mac.machine_id === curInfo.mac.machine_id) {
        isChanged = false
      }
      msg = mac;
      break;
    default:
      if (curInfo.pos != null && pos.machine_id === curInfo.pos.machine_id && pos.position_type === curInfo.pos.position_type && pos.position_id === curInfo.pos.position_id) {
        isChanged = false
      }
      msg = pos
  }
  // 如果选中的信息都没有改变，只需要更新更改选中类型
  if (isChanged === false) {
    that.$store.commit('setCheckType', type)
  }
  else {
    that.$store.commit('getCheckMsg', {
      type,
      msg
    })
  }
}

/**
 * 打开其它图谱
 */
export function chartRouting (that, menuItem, info = null) {
  if (info == null) {
    info = that.$store.state.checkMsg
  }
  else {
    setCheckMsg(that, info)
  }
  const { name, val, icon } = menuItem
  const { tree, mac, pos, type } = info
  let key
  // 是否只能由测点打开
  if (name === 'server') {
    key = 'server'
  } else if (requiredPos().includes(name)) {
    if (!pos) {
      // 如果不存在测点的选择
      that.$pop(that.$t('Common.popPosTips'))//'请选择测点'
      return
    } else {
      if (
        !matchRule(pos.position_type, name, pos.dgm_type, pos.t_root, pos)
      ) {
        //未能匹配
        that.$pop(that.$t('Common.noPosChartTips'))//'该测点没有此图谱'
        return
      }
    }
    key = `${name}_pos_${pos.machine_id}_${pos.position_id}_${pos.position_type}`
  } else if (requiredMac().includes(name)) {
    if (!mac) {
      that.$pop(that.$t('Common.popMacTips'))//'请选择机组'
      return
    }
    // 存在机泵
    if (mac.ch_class) {
      key = `${name}_mac_${mac.mac_id}_${mac.ch_class}`
    } else {
      key = `${name}_mac_${mac.mac_id}`
    }
  } else if (requiredTree().includes(name)) {
    if (!tree) {
      that.$pop(that.$t('Common.popTreeTips'))//'请选择组织'
      return
    }
    key = `${name}_tree_${tree.t_id}_${tree.t_root}`
  } else {
    if (name === 'alarm') {
      if (type === 'pos') {
        if (pos && pos.position_type == 1) {
          //转速测点无报警
          that.$pop(that.$t('Common.noChartTips'))//'该类型测点没有此图谱'
          return
        }
        key = `${name}_pos_${pos.machine_id}_${pos.position_id}_${pos.position_type}`
      } else if (type === 'mac' && mac.ch_class) {
        key = `${name}_mac_${mac.mac_id}_${mac.ch_class}` //机泵进入
      } else if (type === 'mac' && !mac.ch_class) {
        key = `${name}_mac_${mac.mac_id}` //机组进入
      } else if (type === 'tree') {
        /* 实时数据列表汇总需要用到t_root */
        key = `${name}_tree_${tree.t_id}_${tree.t_root}`
      } else {
        that.$pop(that.$t('Common.popTreeTips'))//'请选择组织'
        return
      }
    } else {
      if (type === 'pos') {
        key = `${name}_pos_${pos.machine_id}_${pos.position_id}_${pos.position_type}`
      } else if (type === 'mac') {
        key = `${name}_mac_${mac.mac_id}`
      } else if (type === 'tree') {
        /* 实时数据列表汇总需要用到t_root */
        key = `${name}_tree_${tree.t_id}_${tree.t_root}`
      } else {
        that.$pop(that.$t('Common.popTreeTips'))//'请选择组织'
        return
      }
    }
  }
  let params = {
    key,
    name,
    val,
    icon,
    t_root: tree ? tree.t_root : (mac ? mac.t_root : (pos ? pos.t_root : 0)),//都去不到默认为风电
  }
  console.log('t_root未取到默认风电')
  that.$bus.$emit('getPath', params)
  that.$bus.$emit('scrollLabel', 1)
}