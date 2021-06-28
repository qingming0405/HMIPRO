export const cn = {
  //公共字段
  Common: {
    noPosText: '无测点',//无测点
    noDataText: '无数据',//无数据
    noDiagText: '暂无诊断结果',//暂无诊断结果
    noRealData: '无实时数据',//无实时数据
    noChartTips: '该类型测点没有此图谱',//该类型测点没有此图谱
    collectTips: '收藏失败',//收藏失败
    quitCollectTips: '取消收藏失败',//取消收藏失败
    failTips: '操作失败',//操作失败
    offlineText: '离线',//报警状态离线
    normalText: '正常',//报警状态正常
    warnText: '预警',//报警状态预警
    alarmText: '报警',//报警状态报警
    abnormalText: '自检异常',//自检异常
    focausText: '关注',//关注
    allText: '全部',//全部
    searchHolder: '请输入搜索文字',//搜索的提示语
    chainText: '传动链',//传动链
    moreText: '详情',//详情
    noFocusMacTips: '无重点关注机组',//无重点关注机组
    noWaveAtPos: '该测点没有波形图',//该测点没有波形图
    Wave: '波形频谱图',//波形频谱图
    trend: '趋势图',//趋势图
    Case1: '工况1',//工况1
    Case2: '工况2',//工况2
    Case3: '工况3',//工况3
    Case4: '工况4',//工况4
    OtherCond: '其它工况',//其它工况
    AlarmLog: '报警日志',//报警日志
    inquiry: '查询',//查询
    realData: '实时数据',//实时数据
    retrieval: '数据检索',// 数据检索
    derivedData: '导出数据',//导出数据
    previousDay: '前一天',//前一天
    previousWeek: '前一周',//前一周
    PreviousQuarter: '前一季',//前一季
    previousMonth: '前一月',//前一月
    pastYear: '前一年',//前一年
    custom: '自定义',//自定义
    tree: '组织',//组织
    mac: '机组',//机组
    pos: '测点',//测点
    eigenvalue: '特征值',//特征值
    order: '序号',//序号
    treeName: '组织名称',//组织名称
    macName: '机组名称',//机组名称
    posName: '测点名称',//测点名称
    popTreeTips: '请选择组织',//请选择组织
    popMacTips: '请选择机组',//请选择机组
    popPosTips: '请选择测点',//请选择测点
    noPosChartTips: '该测点没有此图谱',//该测点没有此图谱
    /* 数据检索 */
    title: '数据检索',//数据检索
    time: '时间',//时间
    startTime: '开始时间',//开始时间
    endTime: '结束时间',//结束时间
    placeholderTime: '选择日期时间',//选择日期时间
    resetBtn: '重置',//重置
    sureBtn: '确认',//确认
    cancelBtn: '取消',//取消
    allBtn: '全选',//全选
    reverseBtn: '反选',//反选
    queryDensityBtn: '查询密度',//查询密度
    speedRange: '转速区间',//转速区间
    typeEignin: '特征值',//特征值
    show: '显示',//显示
    hide: '隐藏',//隐藏
    hour: '小时',//小时
    day: '天',//天
    mouth: '月',//月
    allMac: '所有机组',//所有机组
    allPosition: '所有测点',//所有测点
    allEignin: '特征值全选',//特征值全选
    filterUp: '上限过滤',//上限过滤
    filterDown: '下限过滤',//下限过滤
    highDensity: '高密度',//高密度
    lowDensity: '低密度',//低密度
    mediumDensity: '中密度',//中密度
    popTimeText: '结束时间必须大于开始时间',//结束时间必须大于开始时间
    popSpeedText: '最大转速必须大于最小转速',//最大转速必须大于最小转速
    popLowerText: '上限过滤必须大于下限过滤',//上限过滤必须大于下限过滤
    popDataTypeText: '请至少选择一个数据类型！',//请至少选择一个数据类型！
    popFreqBandText: '最大有效频段必须大于最小有效频段',//最大有效频段必须大于最小有效频段
    train: '列车',//列车
    dataType: '数据类型',//数据类型
    Xeigenvalue: 'X轴特征值',//X轴特征值
    Yeigenvalue: 'Y轴特征值',//Y轴特征值
    upPath: '上行',//上行
    downPath: '下行',//下行
    leftTrack: '左轨',//左轨
    rightTrack: '右轨',//右轨
    upDownPath: '上下行',//上下行
    track: '轨道',//轨道
    line: '线路',//线路
    startStop: '起始站点',//起始站点
    /* 组件-弹窗 */
    tips: '提示',//提示 
    /* 组件-启停机 */
    state: '状态',//状态
    toToday: '至今',//至今
    /* 组件-tms趋势 */
    waveData: '波磨数据',//波磨数据 
    addPos: '加入测点',//加入测点
    timeList: '时间列表',//时间列表
    dataScreening: '数据筛选',//数据筛选
    StatisticalList: '统计列表',//统计列表
    derivation: '导出',//导出
    failure: '故障频率',//故障频率
    freq: '频率',//频率
    amplitude: '幅值',//幅值
    wave3d: '三维频谱图',//三维频谱图
    turnBack: '返回',//返回
    deadLine: '截止时间',//截止时间
    filterLowerLimit: '滤波下限',//滤波下限
    filterUpLimit: '滤波上限',//滤波上限
    startFreq: '开始频率',//开始频率
    endFreq: '截止频率',//截止频率
    points: '点数',//点数
    selectPos: '选择测点',//选择测点
    clearSet: '清空设置',//清空设置
    effectiveTime: '有效时间',//有效时间
    loadingUnfinished: '模型未加载完成',//模型未加载完成
    engineroom: '机舱',//机舱
    towertop: '塔顶',//塔顶
    tower: '塔筒',//塔筒
    noOverviewTips: '该机组无总貌图',//该机组无总貌图
    noAlarmTips: '转速通道无报警',//转速通道无报警
    color: '颜色',//颜色
    del: '删除',//删除
  },
  Common8000: {
    TimedHisData: '定时历史数据',//定时历史数据
    StartStopData: '启停机数据',//启停机数据
    AlarmStorageData: '报警存储数据',//报警存储数据
    wave: '波形图',//波形图
    Spectrogram: '频谱图',//频谱图
    noTrendData: '无趋势数据',//无趋势数据
    NoStartStopData: '无启停数据！',//无启停数据！
    noStartStopTimeData: '无启停机数据',//无启停机数据
    SimulationData: '模拟数据',//模拟数据
  },
  icon: {
    FreqDifference: '对称频率差',//对称频率差
    hanning: '汉宁窗',//汉宁窗
    SwitchingOrderRatio: '切换阶比',//切换阶比
    oneFreqDoubling: '定位到1倍频',//定位到1倍频,
    LowFreqFilter: '低频过滤',//低频过滤
    EffectiveFreq: '有效频率设置',//有效频率设置
    LabelledFreq: '标注倍频',//标注倍频
    AddAnnotations: '添加标注',//添加标注
    CancelLabel: '取消标注',//取消标注
    CyclePeakSearch: '循环寻峰',//循环寻峰
    FaultFrequencyDetail: '故障频率明细',//故障频率明细
    CalibrationFreq: '校准倍频',//校准倍频
    unitSelect: '单位选择',//单位选择
    maximize: '最大化',//最大化
    AudioExport: '音频导出', //音频导出
    dataExport: '数据导出',//数据导出
    reset: '重置',//重置
    openWindow: '开窗放大',//开窗放大
    SavePicture: '保存为图片',//保存为图片
    EffectiveFreqAllPos: '所有测点有效频率设置',//所有测点有效频率设置
    TimeDifference: '时间差',//时间差
    LogarithmicCoordinates: '对数坐标',//对数坐标
    SpeedPulse: '转速脉冲',//转速脉冲
    TimeWaveformFilter: '时域波形过滤',//时域波形过滤
    resetIcon: '重置',//重置
  },
  // 特征值
  eigenvalue: {
    accelerationValue: '加速度有效值',//加速度有效值
    speedValue: '速度有效值',//速度有效值
    displacementValue: '位移有效值',//位移有效值
    Kurtosis: '峭度',//峭度
    envelope: '包络',//包络
    temperature: '温度',//温度
    electricity: '电量',//电量
    PreloadValue: '预紧力值',//预紧力值
    speed: '转速',//转速
    Overturn: '倾覆值',//倾覆值
    overturn_p: '峰值',//峰值
    rock_avg: '平均值',//平均值
    overturn_s: '位移',//位移
    rock_rms: '平均值方位',//平均值方位
    rock_p: '峰值方位', //峰值方位
    rock_pp: '沉降量',//沉降量
    SettlementAngle: '沉降角度',//沉降角度
    halfxamplitude: '0.5x幅值',//0.5x幅值
    onexamplitude: '1x幅值',//1x幅值
    twoxamplitude: '2x幅值',//2x幅值
    direc: '通频值',//通频值
    rv: '残余量',//残余量
    opt_freq_hi_1: '可选频段高1',//可选频段高1
    opt_freq_hi_2: '可选频段高2',//可选频段高2
    onexphase: '1x相位',//1x相位
    twoxphase: '2x相位',//2x相位
    time: '时间',//时间
    posSpeed: '测点转速值',//测点转速值
    SpeedDC:'转速直流量',//转速直流量
    ProcessValue: '过程量值',//过程量值
    EffectiveValue:'有效值',//有效值
    ppValue: '峰峰值',//峰峰值
    EnergyEffecValue:'能量有效值',//能量有效值
    offsetVoltage: '偏置电压',//偏置电压
    crestFactor: '峰值因数',//峰值因数
    margin:'裕度',//裕度
    skewness: '歪度',//歪度
    SVvalue: 'SV值',//SV值
    frequencyRange: '频段',//频段
    temperature: '温度',//温度
    temperatureRise: '温升',//温升
    envelopeDemodulationValue: '包络解调值',//包络解调值
    EnvelopeEigenvalues:'包络特征值',//包络特征值
    ExternalRingOfCage: '保持架对外环',//保持架对外环
    cageToInnerRing: '保持架对内环',//保持架对内环
    OuterRingInnerRaceway:'外环内滚道',//外环内滚道
    InnerRingOuterRaceway: '内环外滚道',//内环外滚道
    RollRder: '滚单',//滚单
    RollDouble: '滚双',//滚双
    Tread: '踏面',//踏面
    AdjacentShaftGear: '邻轴齿轮',//邻轴齿轮
    MainShaftGear: '本轴齿轮',//本轴齿轮
    DigitalValue: '数字量值',//数字量值
    temperatureValue:'温度值',//温度值
    ProcessQuantity: '工艺量',//工艺量
    average: '平均值',//平均值
    LastStationName: '上一站名称',//"上一站名称"
    nextStationName:'下一站名称',//下一站名称
    lastStaDistance: '上一站距离',//上一站距离
    nestStaDistance: '下一站距离',//下一站距离
    faultMessage: '故障信息',//故障信息
    WiseValue: '智子值',//智子值
    vibChMeanValue:'振动通道均值',//振动通道均值
    MaxVectorSpectrum: '矢量谱最大值',//矢量谱最大值
    option1amplitude:'可选频段1幅值',//可选频段1幅值
    option2amplitude: '可选频段2幅值',//可选频段2幅值
    opt_freq_l_1: '可选频段低1',//可选频段低1
    opt_freq_l_2: '可选频段低2',//可选频段低2
    digitalquantitiesTypes:'数字量类型',//数字量类型
    vibration: '振动',//振动
    digital: '数字量',//数字量
    VibOrder:'振动阶次',//振动阶次
    EnvelopeOrder: '包络阶次',//包络阶次
    Overturned: '倾覆',//倾覆
    sink: '沉降',//沉降
    inclination: '倾角',//倾角
    bolt: '螺栓',//螺栓
    Shock:'冲击',//冲击
    ImpactOrder: '冲击阶次',//冲击阶次
    OrbitalCorrugation: '轨道波磨',//轨道波磨
    DerailmentMonitor: '脱轨监测',//脱轨监测
    BondPhase: '键相',//键相
    part: '部件',//部件
    Shake: '晃度',//晃度
    SyntheticInclination: '合成倾角',//合成倾角
    ProcessVolume: '过程量',//过程量
  },
  // 测点类型
  posTypeName: {
    speedPos: '转速测点',//转速测点
    processPos: '过程量测点',//过程量测点
    vibPos: '振动测点',//振动测点
    EnvelopePos: '包络测点',//包络测点
    DigitalPos: '数字量测点',//数字量测点
    SloshnessPos: '晃度测点',//晃度测点
    temperaturePos: '温度测点',//温度测点
    vibOrderPos:'振动阶次测点',//振动阶次测点
    EnvelopeOrderPos: '包络阶次测点',//包络阶次测点
    ProcessPos: '工艺量测点',//工艺量测点
    OverturnPos: '倾覆测点',//倾覆测点
    inclinationPos: '倾角测点',//倾角测点
    SyntheticAnglePos: '合成倾角测点',//合成倾角测点
    boltPos: '螺栓测点',//螺栓测点
    LongsamplePos: '长采样测点',//长采样测点
  },
  ytMap:{
    WellheadPressure: '井口压力',//井口压力
    WellheadTemperature:'井口温度',//井口温度
    PdOutletPressure: 'Pd出口压力',//Pd出口压力
    PiSuctionPressure: 'Pi吸入口压力',//Pi吸入口压力
    TiFluidTemperature: 'Ti流体温度',//Ti流体温度
    TmmotorOilTemperature: 'Tm电机油温',//Tm电机油温
    TgDownholeCircuit: 'Tg井下电路',//Tg井下电路
    VxDownholeVib: 'Vx井下振动',//Vx井下振动
    VYDownholeVib: 'Vy井下振动',//Vy井下振动
    VZDownholeVib: 'Vz井下振动',//Vz井下振动
    TransformationRatio: '变比',//变比
    OutputVoltageAB:'输出电压AB',//输出电压AB
    DownOutputVoltageAB: '井下机组给定电压AB',//井下机组给定电压AB
    OutputVoltageBC: '输出电压BC',//输出电压BC
    DownOutputVoltageBC: '井下机组给定电压BC',//输出电压BC
    OutputBoltageAC: '输出电压AC',//输出电压AC
    DownOutputBoltageAC: '井下机组给定电压CA',//井下机组给定电压CA
    AphaseCurrent: 'A相电流',//A相电流
    DownAphaseCurrent: '井下运行A相电流',//井下运行A相电流
    PhaseBCurrent: 'B相电流',//B相电流
    DownPhaseBCurrent: '井下运行B相电流',//井下运行B相电流
    PhaseCCurrent: 'C相电流',//C相电流
    DownPhaseCCurrent: '井下运行C相电流',//井下运行C相电流
    Setfreq: '设定频率',//设定频率
    InverterSetfreq: '变频器设定频率',//变频器设定频率
    Operatingfreq: '运行频率', //运行频率
    InverterOperatefreq: '变频器运行频率',//变频器运行频率
    outputVoltage: '输出电压',//输出电压
    InverteroutputVoltage: '变频器输出电压',//变频器输出电压
    OutputOneVoltage: '输出一次电流',//输出一次电流
    InverterOutputOneVoltage: '变频器输出一次电流',//变频器输出一次电流
    latStopTime: '上次停机时间',//上次停机时间
    CumulativeRunTime: '累积运行时间',//累积运行时间
    DownholeTime: '下井时间',//下井时间
    CumulativeDownholeTime: '累计下井时间',//累计下井时间
    ratedpower: '额定功率',//额定功率
    power: '功率',//功率
    Load: '载荷',//载荷
    CLleakageCurrent: 'CL漏电流',//CL漏电流
    VersoftVersion: 'Ver软件版本号',//Ver软件版本号
    RXdownResistance: 'Rx井下绝缘电阻',//Rx井下绝缘电阻
    crccommunicatFailureTimes: 'Crc通讯失败次数',//Crc通讯失败次数
    ControlIninputVoltageAB: '控制柜输入线电压AB',//控制柜输入线电压AB
    ControlIninputVoltageBC:'控制柜输入线电压BC',//控制柜输入线电压BC
    ControlIninputVoltageCA: '控制柜输入线电压CA',//控制柜输入线电压CA
    ControlInputACurrent: '控制柜输入A相电流',//控制柜输入A相电流
    ControlInputBCurrent: '控制柜输入B相电流',//控制柜输入B相电流
    ControlInputCCurrent: '控制柜输入C相电流',//控制柜输入C相电流
    Inputfreq: '输入频率',//输入频率
    Powerfreq: '电源频率',//电源频率
    TotalOperatingPower: '机组运行总电能',//机组运行总电能
    SystemTotalactivePower: '系统总有功功率',//系统总有功功率
    SystemTotalReactivePower: '系统总无功功率',//系统总无功功率
    SystemTotalPowerFactor: '系统总功率因数',//系统总功率因数
  },
  //单位
  unit: {
    angle: '角度',//角度
    position: '方位',//方位
  },
  //登录页
  Login: {
    title: '登录',
    user: '账号',
    password: '密码',
    errorTips: '用户名或密码错误',
    remember: '记住密码',
    noLicence: '未注册License',
    goLicence: '请前往配置管理中心注册',
    titleText: '现场版',
    copyright: '版权所有：浙江中自庆安新能源技术有限公司',
    CS2000title1: 'CS2000 风电机组',
    CS2000title2: '在线状态监测与故障诊断系统',
    DS9100title1: 'DS9100 工业设备',
    DS9100title2: '在线状态监测与智能分析系统',
    TMS2000title1: 'TMS2000 车辆走行部',
    TMS2000title2: '在线状态监测与故障诊断系统',
    WHD9200title1: 'WHD9200 油气井',
    WHD9200title2: '在线状态监测与故障诊断系统',
    KJ5000title1: 'KJ5000 矿用设备',
    KJ5000title2: '在线状态监测与智能分析系统',
    Rotatetitle1: '旋转机械',
    Rotatetitle2: '在线状态监测与诊断系统',
    contact: '联系方式',
    normaltitle: '智能数据诊断平台',
  },
  //风电总貌图
  FdGeneral: {
    searchHolder: '请输入机组名称',
    statusText: '状态',
    speedText: '转速',
  },
  //风电重点关注
  FdFocus: {
    filterText: '开始筛选',
    macTitle: '机组',
    searchMacText: '搜索机组',
    posTitle: '测点',
    searchPosText: '搜索测点',
    valTitle: '特征值',
    searchValText: '搜索特征值',
    numTitle: '数量',
    sureText: '确定',
    statusText: '状态',
    speedText: '转速',
    noDataText: '无数据',
  },
  //风电模型2d
  FdModel: {
    btn3dText: '3D模式',//切换到3d模式的按钮
    locName1: '传动链',//部位名称传动链
    locName2: '塔筒',//部位名称塔筒
    locName3: '螺栓',//部位名称螺栓
    locName4: '叶轮',//部位名称叶轮
    locName5: '油液',//部位名称油液
    locName6: '锚栓',//部位名称锚栓
    locName7: '基础',//部位名称基础
    diagnosisText: '智能诊断',//诊断结果标签
    diagnosisTitle: '传动链',//诊断结果传动链名称
    bearingDefect: '轴承缺陷',//轴承缺陷
    gearDefect: '齿轮缺陷',//齿轮缺陷
    motorDefect: '电机不平衡或松动',//电机不平衡或松动
    gearBoxDefect: '齿轮箱载荷过重',//齿轮箱载荷过重
  },
  //风电模型3d
  WindModel: {
    btn2dText: '2D模式',//切换到2d模式的按钮
    btnStopText: '风机启停',//风机启停
    btnPerspective: '透视效果',//风机透视效果
    btnPhysical: '风机外观',//风机外观效果
    detectPart: '检测部件',//检测部件
    healthValue: '健康值',//健康值
    diagnosisText: '智能诊断',//诊断结果标签
    diagnosisTitle: '传动链',//诊断结果传动链名称
  },
  //风电模型-传动链
  DriveChain: {
    mainBearing: '主轴承',//主轴承
    moreText: '详情',//详情
    digitalTwin: '数字孪生',//数字孪生
    resetBtn: '重置',//重置
    gearBox: '齿轮箱',//齿轮箱
    generator: '发电机',//发电机
    public: '公共',//公共
  },
  //风电模型-锚栓
  Anchorbolt: {
    base: '基础',//基础
    moreText: '详情',//详情
    anchorBoltModel: '锚栓模型',//锚栓模型
  },
  //风电模型-基础
  Basics: {
    base: '基础',//基础
    moreText: '详情',//详情
  },
  //风电模型-螺栓
  Bolt: {
    boltModel: '螺栓模型',//螺栓模型
    moreText: '详情',//详情
  },
  //风电模型-叶轮
  Impeller: {
    public: '公共',//公共
    moreText: '详情',//详情
    impeller1: '叶轮1',//叶轮1
    impeller2: '叶轮2',//叶轮2
    impeller3: '叶轮3',//叶轮3
  },
  //风电模型-油液
  Oil: {
    public: '公共',//公共
    moreText: '详情',//详情
  },
  //轨交总貌图
  GjGeneral: {
    searchHolder: '请输入搜索文字',//搜索的提示语
  },
  //轨交重点关注
  GjFocus: {
    filterText: '开始筛选',
    macTitle: '机组',
    searchMacText: '搜索机组',
    posTitle: '测点',
    searchPosText: '搜索测点',
    valTitle: '特征值',
    searchValText: '搜索特征值',
    numTitle: '数量',
    sureText: '确定',
  },
  //轨交设备模型
  GjModel: {
    offlineText: '离线',//报警状态离线
    normalText: '正常',//报警状态正常
    warnText: '预警',//报警状态预警
    alarm1Text: 'Ⅰ级报警',//报警状态Ⅰ级报警
    alarm2Text: 'Ⅱ级报警',//报警状态Ⅱ级报警
  },
  //轨交设备详情
  GjModelInfo: {
    runningBtn: '走行部',//走行部按钮文字
    runningTitle: '走行部模型',//走行部模型图标题文字
    headChname: '通道名称',//表头通道名称
    headLoc: '安装位置',//表头安装位置
    headVibAlarm: '振动报警类型',//表头振动报警类型
    headTempAlarm: '温度报警类型',//表头温度报警类型
    headAdvice: '维修建议',//表头维修建议
    offlineText: '离线',//报警状态离线
    normalText: '正常',//报警状态正常
    warnText: '预警',//报警状态预警
    alarm1Text: 'Ⅰ级报警',//报警状态Ⅰ级报警
    alarm2Text: 'Ⅱ级报警',//报警状态Ⅱ级报警
    offlineAdvice: '设备离线',//设备离线的建议文字
    normalAdvice: '正常运行',//设备正常的建议文字
    warnAdvice: '若故障无法消除，建议结束当日运营后回库处理',//设备预警的建议文字
    alarm1Advice: '若故障无法消除，建议运营到终点后退出运营',//设备Ⅰ级报警的建议文字
    alarm2Advice: '若故障无法消除，建议下一站清客后退出运营',//设备Ⅱ级报警的建议文字
    axis1: '1轴',//1轴
    axis2: '2轴',//2轴
    axis3: '3轴',//3轴
    axis4: '4轴',//4轴
    advice1: '正常',//正常
    advice2: '需要注意',//需要注意
    advice3: '需要维修',//需要维修
    advice4: '已离线',//已离线
  },
  //油田总貌图
  YtGeneral: {
    IDText: '通讯ID',//通讯ID
    statusText: '运行状态',//运行状态
    alarmText: '报警状态',//报警状态
  },
  //油田重点关注
  YtFocus: {
    filterText: '开始筛选',
    macTitle: '机组',
    searchMacText: '搜索机组',
    posTitle: '测点',
    searchPosText: '搜索测点',
    valTitle: '特征值',
    searchValText: '搜索特征值',
    numTitle: '数量',
    sureText: '确定',
    IDText: '通讯ID',//通讯ID
    statusText: '运行状态',//运行状态
    alarmText: '报警状态',//报警状态
    allText: '全部',//全部
    offlineText: '离线',//报警状态离线
    normalText: '正常',//报警状态正常
    warnText: '预警',//报警状态预警
    alarmText: '报警',//报警状态报警
    runStatus1: '未接入',//未接入
    runStatus2: '运行',//运行
    runStatus3: '停机',//停机
    filterError: '筛选数据有误',//筛选数据弹窗提示语：有误
    filterNoData: '筛选无数据',//筛选数据弹窗提示语：筛选无数据
  },
  //油田设备模型
  YtModel: {
    macModel: '设备模型',//设备模型
    punchCard: '电流卡片',//电流卡片
    analysis: '沉没度分析',//沉没度分析
  },
  //油田设备模型详情
  YtMechineModel: {
    tableTitle1: '运行记录',//运行记录
    tableTitle2: '变频器',//变频器
    tableTitle3: '变压器',//变压器
    tableTitle4: '井下电机',//井下电机
    tableTitle5: '系统功耗',//系统功耗
    tableTitle6: '井下传感器',//井下传感器
    runStatus: '未接入',//未接入
  },
  //油田电流卡片
  YtPunchCard: {
    noPosText: '无测点',//无测点
    noDataText: '无数据',//无数据
    dayCard: '天卡',//天卡
    weekCard: '周卡',//周卡
    monthCard: '月卡',//月卡
    toolTipWord1: '电流',//电流
    toolTipWord2: '时间',//时间
  },
  //油田沉没度分析
  YtAnalyse: {
    tableTitle1: '工艺量测点',//工艺量测点
    tableTitle2: '沉没度趋势',//沉没度趋势
    tableTitle3: '油田模型',//油田模型
    moreText: '详情',//详情
    sersorDepth: '传感器垂深',//传感器垂深
    curValue: '当前值',//当前值
    warnValue: '预警值',//预警值
    alarmValue: '报警值',//报警值
    time: '时间',//时间
    sinkVal: '沉没度',//沉没度
  },
  //工业设备重点关注
  SnFocus: {
    macStatus: '设备状态',//设备状态
    macSpeed: '设备实时转速',//设备实时转速
    macCon: '设备近况',//设备近况
    diagTime: '诊断时间',//诊断时间
    diagResult: '诊断结果',//诊断结果
    noFocusMacTips: '无重点关注机组',//无重点关注机组
    Alarm: '报警',//报警
    warn: '预警', //预警
    Normal: '正常',//正常
    PosNumber:'测点个数',//测点个数
  },
  //工业设备设备模型
  SnModel: {
    titleBtn1: '设备模型',//设备模型
    titleBtn2: '测点列表',//测点列表
    titleBtn3: '油液参数',//油液参数
    titleBtn4: '倾角',//倾角
    WarningThreshold: '预警门限',//预警门限
    alarmThreshold: '报警门限',//报警门限
    EquipDiagnosis: '设备诊断',//设备诊断
    Result: '结果',//结果
  },
  //工业设备倾角
  Towerdrum: {
    angle: '倾角',//倾角
    sink: '沉降',//沉降
  },
  //通用设备模型详情-传动链
  TyVib: {
    tableTitle1: '测点列表',//测点列表
    tableTitle2: '数字孪生',//数字孪生
  },
  //头部
  HeaderEdge: {
    alarmRingTitle: '开启报警声音',//开启报警声音
    loginOut: '退出',//退出
    manualTitle: '使用手册',//使用手册
    firstLevel1: '总貌图',//总貌图
    firstLevel2: '图谱分析',//图谱分析
    firstLevel3: '启停机分析',//启停机分析
    firstLevel4: '数据分析',//数据分析
    firstLevel5: '日志列表',//日志列表
    /* 总貌图二级导航 风电、水泥、轨交、油田、化工、通用 */
    secondLevel1_1: '总貌图',//总貌图
    secondLevel1_2: '重点关注',//重点关注
    secondLevel1_3: '设备模型',//设备模型
    /* 图谱分析二级导航 */
    secondLevel2_1: '智能诊断趋势',//智能诊断趋势
    secondLevel2_2: '波形频谱图',//波形频谱图
    secondLevel2_3: '趋势图',//趋势图
    secondLevel2_4: '三维频谱图',//三维频谱图
    secondLevel2_5: '轨道波磨图',//轨道波磨图
    secondLevel2_6: '轨道波磨频谱瀑布',//轨道波磨频谱瀑布
    secondLevel2_7: '倾角分布图',//倾角分布图
    secondLevel2_8: '机舱轨迹图',//机舱轨迹图
    secondLevel2_9: '散点图',//散点图
    secondLevel2_10: '危险转速区间监测',//危险转速区间监测
    secondLevel2_11: '轨道波磨地图',//轨道波磨地图
    secondLevel2_12: '单值棒图',//单值棒图
    secondLevel2_13: '多值棒图',//多值棒图
    secondLevel2_14: '全频谱图',//全频谱图
    secondLevel2_15: '多频谱图',//多频谱图
    secondLevel2_16: '单面动平衡',//单面动平衡
    secondLevel2_17: '双面动平衡',//双面动平衡
    secondLevel2_18: '极坐标图',//极坐标图
    secondLevel2_19: '轴心轨迹图',//轴心轨迹图
    secondLevel2_20: '轴心位置图',//轴心位置图
    /* 启停机分析二级导航 */
    secondLevel3_1: '转速时间图',//转速时间图
    secondLevel3_2: '奈奎斯特图',//奈奎斯特图
    secondLevel3_3: '伯德图',//伯德图
    secondLevel3_4: '启停机频谱瀑布图',//启停机频谱瀑布图
    secondLevel3_5: '级联图',//级联图
    secondLevel3_6: '启停机数据列表',//启停机数据列表
    /* 数据分析二级导航 */
    secondLevel4_1: '实时数据汇总列表',//实时数据汇总列表
    secondLevel4_2: '实时数据列表',//实时数据列表
    secondLevel4_3: '历史数据列表',//历史数据列表
    secondLevel4_4: '监测报表',//监测报表
    secondLevel4_5: '设备参数',//设备参数
    secondLevel4_6: '设备维护记录',//设备维护记录
    secondLevel4_7: '统计列表',//统计列表
    secondLevel4_8: '专家系统',//专家系统
    secondLevel4_9: '实时报警汇总列表',//实时报警汇总列表
    secondLevel4_10: '踏面测量数据',//踏面测量数据
    secondLevel4_11: '踏面磨损趋势',//踏面磨损趋势
    secondLevel4_12: '踏面寿命预估',//踏面寿命预估
    /* 日志列表二级导航 */
    secondLevel5_1: '报警日志',//报警日志
    secondLevel5_2: '服务器信息',//服务器信息
    secondLevel5_3: '系统日志',//系统日志
    secondLevel5_4: '使用手册',//使用手册

    loginOutTips: '您正在退出系统，确定吗',//您正在退出系统，确定吗
    closeTabsTips: '关闭所有标签',//关闭所有标签
    yaojiequanPos: '窑结圈指数',//窑结圈指数
    gunpituoluoPos: '辊皮脱落指数',//辊皮脱落指数
    all: '全部',//全部
    goRealAlarmTitle: '实时报警日志',//实时报警日志
    browserTips: '浏览器不支持全屏API或已被禁用',//浏览器不支持全屏API或已被禁用
  },
  //左侧栏
  Left: {
    searchTreeText: '搜索组织',//搜索组织
    searchMacText: '搜索机组',//搜索机组
    posNameToolTip: '测点名称',//测点名称
    posTypeToolTip: '测点类型',//测点类型
    dgmNameToolTip: '采集器名称',//采集器名称
    chNameToolTip: '关联通道名称',//关联通道名称
  },
  //数据检索-报警
  AlarmRetrieval: {
    typePos: '测点',//测点
    typeMac: '机组',//机组
    typeChannel: '通道',//通道
  },
  //数据检索-监测报表
  MonitorRetrieval: {
    realTimeValue: '实时值',//实时值
    warningAlarmValue: '预警报警值',//预警报警值
    statisticalWays: '统计方式',//统计方式
    noStatistics: '不统计',//不统计
    nowMac: '当前机组',//当前机组
    nowPos: '当前测点',//当前测点
  },
  //数据检索-三维频谱图
  TMSRetrieval: {
    effectiveBand: '有效频段',//有效频段
    rows: '行数',//行数
  },
  //数据检索-趋势预测
  TrendRetrieval: {
    predictionCutoff: '预测截止',//预测截止
    threshold: '阈值',//阈值
    alarmLimit: '报警门限',//报警门限
    trendPredict: '趋势预测',//趋势预测
    thresholdRange: '阈值范围',//阈值范围
  },
  //组件-启停机
  SSindex: {
    startBtn: '启',//启
    stopBtn: '停',//停
    onOffBtn: '启停',//启停
    onOffingBtn: '启停中',//启停中
  },
  // 组件-波形
  WaveChart: {
    effectiveTimeSetting: '有效时间设置',//有效时间设置
    minimumTimeFiltering: '最小时间过滤',//最小时间过滤
    EffectiveFrequBandSetting: '有效频段设置',//有效频段设置
  },
  // 组件-波形弹窗
  WaveAlert: {
    filterFrequency: '过滤频率',//过滤频率
    filterOrder: '过滤阶次',//过滤阶次
    lowerLimit: '下限',//下限
    upLimit: '上限',//上限
    filterTime: '时间过滤',//时间过滤
  },
  //报警日志
  Alarm: {
    alarmNum: '报警次数',//报警次数
    AlarmType: '报警类型',//报警类型
    ChannelName: '通道名称',//通道名称
    EventTime: '事件时间',//事件时间
    EventDescription: '事件描述',//事件描述
    condType: '工况类型',//工况类型
    AlarmValue: '报警值',//报警值
    Alarmh: '报警(高)',//报警(高)
    Warnh: '预警(高)',//预警(高)
    Warnl: '预警(低)',//预警(低)
    Alarml: '报警(低)',//报警(低)
    Normal: '正常',//正常
    SecondAlarmh: 'Ⅱ级报警(高)', //Ⅱ级报警(高)
    SecondAlarml: 'Ⅱ级报警(低)', //Ⅱ级报警(低)
    FirstAlarmh: 'Ⅰ级报警(高)', //Ⅰ级报警(高)
    FirstAlarml: 'Ⅰ级报警(低)', //Ⅰ级报警(低)
    chNoData: '当前通道无测点!',//当前通道无测点!
    treeTitle: '组织报警日志',//组织报警日志
    macTitle: '机组报警日志',//机组报警日志
    NormalToAlarmh: '从正常到报警（高）',//从正常到报警（高）
    NormalToWarnh: '从正常到预警（高）',//从正常到预警（高）
    NormalToAlarml: '从正常到报警（低）',//从正常到报警（低）
    NormalToWarnl: '从正常到预警（低）',//从正常到预警（低）
    WarnhToAlarmh: '从预警（高）到报警（高）',//从预警（高）到报警（高）
    WarnlToAlarml: '从预警（低）到报警（低）',//从预警（低）到报警（低）
    AlarmhToWarnl: '从报警（高）到预警（低）',//从报警（高）到预警（低）
    AlarmhToAlarml: '从报警（高）到报警（低）', //从报警（高）到报警（低）
    WarnhToWarnl: '从预警（高）到预警（低）',//从预警（高）到预警（低）
    WarnhToAlarml: '从预警（高）到报警（低）',//从预警（高）到报警（低）
    WarnlToWarnh: '从预警（低）到预警（高）',//从预警（低）到预警（高）
    WarnlToAlarmh: '从预警（低）到报警（高）',//从预警（低）到报警（高）
    AlarmlToWarnh: '从报警（低）到预警（高）',//从报警（低）到预警（高）
    AlarmlToAlarmh: '从报警（低）到报警（高）',//从报警（低）到报警（高）
    TrendGrowth: '趋势增长',//趋势增长
    NegativeGrowth: '趋势负增长',//趋势负增长
    Alarm: '报警',//报警
    Warn: '预警',//预警
    average: '平均值',//平均值
    AlarmhToNormal: '从报警（高）恢复到正常',//从报警（高）恢复到正常
    WarnhToNormal: '从预警（高）恢复到正常',//从预警（高）恢复到正常
    AlarmlToNormal: '从报警（低）恢复到正常',//从报警（低）恢复到正常
    WarnlToNormal: '从预警（低）恢复到正常',//从预警（低）恢复到正常
    AlarmhToWarnh: '从报警（高）回到预警（高）',//从报警（高）回到预警（高）
    AlarmlToWarnl: '从报警（低）回到预警（低）',//从报警（低）回到预警（低）
    AbnormalEquipment: '设备异常',//设备异常
    kilnRing: '重度窑结圈故障',//重度窑结圈故障
    Undefined: '未定义',//未定义
  },
  //统计列表
  Census: {
    average: '平均值',//平均值
    variance: '方差',//方差
    MaximumTenAverage: '最大10%平均值',//最大10%平均值
    explainedVariance: '方差:在概率论和统计方差衡量随机变量或一组数据时离散程度的度量',//方差:在概率论和统计方差衡量随机变量或一组数据时离散程度的度量
    selectTree: '请选择组织',//请选择组织
    selectMac: '请选择机组',//请选择机组
    selectPos: '请选择测点',//请选择测点
    selectEigen: '请选择特征值',//请选择特征值
    enterTree: '请输入组织',//请输入组织
    proportion: '比例',//比例
    vibUnit: '振动单位',//振动单位
    time: '时间',//时间
    startTime: '开始时间',//开始时间
    endTime: '结束时间',//结束时间
    statisticalWays: '统计方式',//统计方式
    SpeedRange: '转速区间',//转速区间
    StatisticalCond: '统计工况',//统计工况
    selectUnit: '请选择单位',//请选择单位
    entirety: '全部',//全部
    SearchPos: '搜索测点',//搜索测点
    errorInpur: '输入比例格式有误，请重新输入',//输入比例格式有误，请重新输入
    enterProportion: '请输入比例',//请输入比例
    enterSpeedRange: '请输入正确的转速区间。',//请输入正确的转速区间
    value: '数值',//数值
    StatisticsVibValues: '振动值统计',//振动值统计
    screenCondition: '筛选条件',//筛选条件
    InputRatio: '请输入比例：*%或*个',//请输入比例：*%或*个
    one: '个',//个
    StatisticAtlas: '统计图谱',//统计图谱
    histogram: '柱状图',//柱状图
    ListDiagram: '列表图',//列表图
  },
  // 智能诊断趋势
  diagnosisTrend: {
    fault01: '主轴前轴承外圈故障',//主轴前轴承外圈故障
    fault02: '主轴前轴承内圈故障',//主轴前轴承内圈故障
    fault03: '主轴前轴承滚动体故障',//主轴前轴承滚动体故障
    fault04: '主轴前轴承保持架故障',//主轴前轴承保持架故障
    fault05: '主轴前轴承跑圈',//主轴前轴承跑圈
    fault06: '主轴前轴承松动',//主轴前轴承松动
    fault07: '电气故障',//电气故障
    fault08: '气动不平衡',//气动不平衡
    fault11: '主轴后轴承外圈故障',//主轴后轴承外圈故障
    fault12: '主轴后轴承内圈故障',//主轴后轴承内圈故障
    fault13: '主轴后轴承滚动体故障',//主轴后轴承滚动体故障
    fault14: '主轴后轴承保持架故障',//主轴后轴承保持架故障
    fault15: '主轴后轴承跑圈',//主轴后轴承跑圈
    fault16: '主轴后轴承松动',//主轴后轴承松动
    fault21: '行星架叶轮侧轴承外圈故障',//行星架叶轮侧轴承外圈故障
    fault22: '行星架叶轮侧轴承内圈故障',//行星架叶轮侧轴承内圈故障
    fault23: '行星架叶轮侧轴承滚动体故障',//行星架叶轮侧轴承滚动体故障
    fault24: '行星架叶轮侧轴承保持架故障',//行星架叶轮侧轴承保持架故障
    fault25: '行星架电机侧轴承外圈故障',//行星架电机侧轴承外圈故障
    fault26: '行星架电机侧轴承内圈故障',//行星架电机侧轴承内圈故障
    fault27: '行星架电机侧轴承滚动体故障',//行星架电机侧轴承滚动体故障
    fault28: '行星架电机侧轴承保持架故障',//行星架电机侧轴承保持架故障
    fault29: '齿轮箱输入轴轴承跑圈',//齿轮箱输入轴轴承跑圈
    fault210: '齿轮箱输入轴轴承松动',//齿轮箱输入轴轴承松动
    fault31: '低速轴叶轮侧轴承外圈故障',//低速轴叶轮侧轴承外圈故障
    fault32: '低速轴叶轮侧轴承内圈故障',//低速轴叶轮侧轴承内圈故障
    fault33: '低速轴叶轮侧轴承滚动体故障',//低速轴叶轮侧轴承滚动体故障
    fault34: '低速轴叶轮侧轴承保持架故障',//低速轴叶轮侧轴承保持架故障
    fault35: '低速轴电机侧轴承外圈故障',//低速轴电机侧轴承外圈故障
    fault36: '低速轴电机侧轴承内圈故障',//低速轴电机侧轴承内圈故障
    fault37: '低速轴电机侧轴承滚动体故障',//低速轴电机侧轴承滚动体故障
    fault38: '低速轴电机侧轴承保持架故障',//低速轴电机侧轴承保持架故障
    fault39: '滑环轴承外圈故障',//滑环轴承外圈故障
    fault310: '滑环轴承内圈故障',//滑环轴承内圈故障
    fault311: '滑环轴承滚动体故障',//滑环轴承滚动体故障
    fault312: '滑环轴承保持架故障',//滑环轴承保持架故障
    fault313: '太阳轮故障',//太阳轮故障
    fault314: '行星轮故障',//行星轮故障
    fault315: '内齿圈故障',//内齿圈故障
    fault316: '行星级齿轮啮合不良',//行星级齿轮啮合不良
    fault317: '齿轮箱低速轴轴承跑圈',//齿轮箱低速轴轴承跑圈
    fault318: '齿轮箱低速轴轴承松动',//齿轮箱低速轴轴承松动
    fault41: '中间轴叶轮侧轴承外圈故障',//中间轴叶轮侧轴承外圈故障
    fault42: '中间轴叶轮侧轴承内圈故障',//中间轴叶轮侧轴承内圈故障
    fault43: '中间轴叶轮侧轴承滚动体故障',//中间轴叶轮侧轴承滚动体故障
    fault44: '中间轴叶轮侧轴承滚动体故障',//中间轴叶轮侧轴承保持架故障
    fault45: '中间轴电机侧轴承1外圈故障',//中间轴电机侧轴承1外圈故障
    fault46: '中间轴电机侧轴承1内圈故障',//中间轴电机侧轴承1内圈故障
    fault47: '中间轴电机侧轴承1滚动体故障',//中间轴电机侧轴承1滚动体故障
    fault48: '中间轴电机侧轴承1保持架故障',//中间轴电机侧轴承1保持架故障
    fault49: '中间轴电机侧轴承2外圈故障',//中间轴电机侧轴承2外圈故障
    fault410: '中间轴电机侧轴承2内圈故障',//中间轴电机侧轴承2内圈故障
    fault411: '中间轴电机侧轴承2滚动体故障',//中间轴电机侧轴承2滚动体故障
    fault412: '中间轴电机侧轴承2保持架故障',//中间轴电机侧轴承2保持架故障
    fault413: '中间轴小齿轮啮合不良或大齿轮断齿',//中间轴小齿轮啮合不良或大齿轮断齿
    fault414: '中间级齿轮不对中（偏载）',//中间级齿轮不对中（偏载）
    fault415: '小齿轮断齿',//小齿轮断齿
    fault416: '齿轮箱中间轴轴承跑圈',//齿轮箱中间轴轴承跑圈
    fault417: '齿轮箱中间轴轴承松动',//齿轮箱中间轴轴承松动
    fault51: '高速轴叶轮侧轴承外圈故障',//高速轴叶轮侧轴承外圈故障
    fault52: '高速轴叶轮侧轴承内圈故障',//高速轴叶轮侧轴承内圈故障
    fault53: '高速轴叶轮侧轴承滚动体故障',//高速轴叶轮侧轴承滚动体故障
    fault54: '高速轴叶轮侧轴承保持架故障',//高速轴叶轮侧轴承保持架故障
    fault55: '高速轴电机侧轴承外圈故障',//高速轴电机侧轴承外圈故障
    fault56: '高速轴电机侧轴承内圈故障',//高速轴电机侧轴承内圈故障
    fault57: '高速轴电机侧轴承滚动体故障',//高速轴电机侧轴承滚动体故障
    fault58: '高速轴电机侧轴承保持架故障',//高速轴电机侧轴承保持架故障
    fault59: '高速级大小齿轮啮合不良',//高速级大小齿轮啮合不良
    fault510: '中间级小齿轮啮合不良',//中间级小齿轮啮合不良
    fault511: '高速级齿轮不对中（偏载）',//高速级齿轮不对中（偏载）
    fault512: '联轴器不对中',//联轴器不对中
    fault513: '齿轮箱输出轴轴承跑圈',//齿轮箱输出轴轴承跑圈
    fault514: '齿轮箱输出轴轴承松动',//齿轮箱输出轴轴承松动
    fault61: '发电机前轴承外圈故',//发电机前轴承外圈故
    fault62: '发电机前轴承内圈故障',//发电机前轴承内圈故障
    fault63: '发电机前轴承滚动体故障',//发电机前轴承滚动体故障
    fault64: '发电机前轴承保持架故障',//发电机前轴承保持架故障
    fault65: '发电机前轴承跑圈',//发电机前轴承跑圈
    fault66: '发电机前轴承松动',//发电机前轴承松动
    fault71: '发电机后轴承外圈故障',//发电机后轴承外圈故障
    fault72: '发电机后轴承内圈故障',//发电机后轴承内圈故障
    fault73: '发电机后轴承滚动体故障',//发电机后轴承滚动体故障
    fault74: '发电机后轴承保持架故障',//发电机后轴承保持架故障
    fault75: '发电机后轴承跑圈',//发电机后轴承跑圈
    fault76: '发电机后轴承松动',//发电机后轴承松动
  },
  // 波形频谱图
  wave: {
    AnalogSpeed: '是否启用模拟转速',//是否启用模拟转速
    referenceSpeed: '基准转速',//基准转速
    AddFrequency: '添加频率',//添加频率
    LabelingFrequency: '标注频率',//标注频率
    unnmark: '清除标注',//清除标注
    shutDown: '关闭',//关闭
    spectrumDiagram: '开启频谱图',//开启频谱图
    rank: '阶次',//阶次
    SavePic: '保存图片',//保存图片
    addWave: '加入对比波形',//加入对比波形
    LayoutSwitch: '布局切换',//布局切换
    OpenTrend: '开启趋势',//开启趋势
    CloseTrend: '关闭趋势',//关闭趋势
    noWaveData: '当前没有波形数据',// 当前没有波形数据
    selectFrequency: '请选择故障频率',//请选择故障频率
    HighWaveform: '高密度波形',//高密度波形
    LowWaveform: '低密度波形',//低密度波形
    Waveform: '波形图',//波形图
    Audio: '音频',//音频
    spectrogram: '频谱图',//频谱图
    switchOrderNo1: '转速为0，切换为阶比功能不可用！',//转速为0，切换为阶比功能不可用！
    switchOrderNo2: '已为阶比，切换为阶比功能不可用！',//已为阶比，切换为阶比功能不可用！
    LowOrderFilter: '低阶次过滤',//低阶次过滤
    effecFreqBand: '有效频段',//有效频段
    effecOrderRank: '有效阶次',//有效阶次
    effectFreqError: '有效频率输入不正确！',//有效频率输入不正确
    noLowWaveData: '当前测点无低密度波形！',//当前测点无低密度波形！
    EffectFreqFilter: '有效频率过滤',//有效频率过滤
    freq1: '频',//频
    EffectOrderFilter: '有效阶次过滤',//有效阶次过滤
    MoveOrder: '动阶次',//动阶次
  },
  // 故障频率
  waveFault: {
    BPFO: '外环通过',//外环通过
    BPFI: '内环通过',//内环通过
    BPF: '通过频率',//通过频率
  },
  // 三维频谱图
  wave3d: {
    time: '时间',//时间
    leftView: '左视图',//左视图
    CurrentFreq: '当前频率',//当前频率
    CancelHanning: '取消汉宁窗',//取消汉宁窗
  },
  // 轨道波磨地图
  railCorrugation: {
    goodCondition: '轨道状况良好，无故障',//轨道状况良好，无故障
    ManualGrindSample: '手动波磨采样',//手动波磨采样
    PolishData: '波磨数据',//波磨数据
    NoSiteInfo: '无站点信息',//无站点信息
    direction: '方向',//方向
    site: '站点',//站点
    rail: '轨道',//轨道
    corrugationInterval: '波磨区间',//波磨区间
    maxCrest: '最大峰值',//最大峰值
    MaxEffectValue: '最大有效值',//最大有效值
    upRail: '上行轨道',//上行轨道
    downRail: '下行轨道',//下行轨道
    upstroke: '上行',//上行
    downstream: '下行',//下行
    leftTrack: '左轨',//左轨
    rightTrack: '右轨',//右轨
    missLocInfo: '缺少安装位置信息',//缺少安装位置信息
    missCarSet: '缺少车厢设置',//缺少车厢设置
    missCarNumSet: '缺少车厢号设置',//缺少车厢号设置
    sampSentSuccess: '采样命令发送成功',//采样命令发送成功
  },
  // 轨道波磨图
  tmsTrend: {
    DataList: '数据列表',//数据列表
    TipAddSamepType: '请添加同类型的测点',//请添加同类型的测点
    TipNoData: '存在无数据时间点',//存在无数据时间点
    Line1: '线路1',//线路1
    effectFreq: '有效频率',//有效频率
  },
  // 轨道波磨频谱瀑布
  tmsTrend3d: {
    effectFreq: '有效频率',//有效频率
    DataList: '数据列表',//数据列表
    Line1: '线路1',//线路1
    distance: '距离',//距离
    minFreqlimit: '有效频段需要大于0',//有效频段需要大于0
  },
  // 踏面测量数据
  trendData: {
    DesignParam: '设计参数',// 设计参数
    DesignLife: '设计寿命',//设计寿命
    WheelLimitDiameter: '车轮到限直径',//车轮到限直径
    carNum: '车号',//车号
    MeasurementParam: '测量参数',//测量参数
    spinRoller: '镟轮',//镟轮
    ChangeWheel: '换轮',//换轮
    unspinWheelOChangeWheel: '未镟轮或换轮',//未镟轮或换轮
    Firstwheel: '首次镟轮',//首次镟轮
    Addrow: '新增列',//新增列
    Save: '保存',//保存
    RetrainModel: '重新训练模型',//重新训练模型
    trainModelLimit: '训练模型至少需要两组数据',//训练模型至少需要两组数据
    WheelDiameter: '车轮直径',//车轮直径
    RimThickness: '轮缘厚度',//轮缘厚度
    RimHeight: '轮缘高度',//轮缘高度
    SpinWheelOrChangeWheel: '鏇轮或换轮',//鏇轮或换轮
    mileage: '里程',//里程
    InputLimit: '请输入设计寿命或车轮到限直径！',//请输入设计寿命或车轮到限直径！
    saveSuccess: '保存成功',//保存成功
    trainModelSuccess: '训练模型成功！',//训练模型成功！
  },
  // 踏面磨损趋势
  wearTrend: {
    addMap: '新增图谱',//新增图谱
    dropPosLimit: '不支持此类测点',//不支持此类测点
    existPosTip: '当前图谱已存在该测点',//当前图谱已存在该测点
    existCarTip: '当前图谱已存在当前车厢',//当前图谱已存在当前车厢
    del: '删除',//删除
  },
  //踏面寿命预估
  lifePredict: {
    carNum: '车号',//车号
    wheel: '车轮',//车轮
    EstimateRemainLife: '预估剩余寿命',//预估剩余寿命
  },
  // 散点图
  scatter: {
    xAxis: 'x轴',//x轴
    yAxis: 'y轴',//y轴
    eigenNoData: '此特征值无对应数据',//此特征值无对应数据
  },
  // 危险转速区间
  dashboard: {
    curTime: '当前时间',//当前时间
  },
  //倾角分布图
  dip: {
    operating: '操作',//操作
    AlarmLine: '报警线',//报警线
    DataDisplay: '数据显示',//数据显示
    posList: '测点列表',//测点列表
    isCheck: '是否勾选',//是否勾选
    posChoose: '测点选择',//测点选择
    AddComparison: '加入对比',//加入对比
  },
  //机舱轨迹图
  overturn: {},
  //实时数据汇总列表
  realSummary: {
    equipment: '设备',//设备
    diagnosticResult: '诊断结果',// 诊断结果
    TrendAverage: '趋势增长平均值',//趋势增长平均值
    TrendAlarmPushStatus: '趋势报警推送状态',//趋势报警推送状态
    warnPushStatus: '预警推送状态',//预警推送状态
    AlarmPushStatus: '报警推送状态',//报警推送状态
    EigenvalueType: '特征值类型',//特征值类型
    Eigen: '特征值',//特征值
    WarnH: '预警值(高)',//预警值(高)
    AlarmH: '报警值(高)',//报警值(高)
    WarnL: '预警值(低)',//预警值(低)
    AlarmL: '报警值(低)',//报警值(低)
    rise: '上涨',//上涨
    unconfirmed: '未确认',//未确认
    confirmed: '已确认',//已确认
    Reset: '已重置',//已重置
    maintenance: '维护中',//维护中
    rejected: '已拒绝',//已拒绝
    maintain: '维护',//维护
    Refuse: '拒绝',//拒绝
    operating: '操作',//操作
    ModifyAlarmStatus: '修改报警状态',//修改报警状态
  },
  //实时数据列表
  real: {},
  // 监测报表
  monitor: {
    EquipName: '设备名称',//设备名称
    EigenvalueType: '特征值类型',//特征值类型
    warnValue: '预警值',//预警值
    alarmValue: '报警值',//报警值
    Max: '最大值',//最大值
    Min: '最小值',//最小值
  },
  //历史数据列表
  history: {
    part: '部件',//部件
    CageOuterRing: '保持架对外环',//保持架对外环
    CageToInnerRing: '保持架对内环',//保持架对内环
    OuterRingInnerRaceway: '外环内滚道',//外环内滚道
    InnerRingOuterRaceway: '内环外滚道',//内环外滚道
    RollRder: '滚单',//滚单
    RollDouble: '滚双',//滚双
    Tread: '踏面',//踏面
    AdjacentShaftGear: '邻轴齿轮',//邻轴齿轮
    MainShaftGear: '本轴齿轮',//本轴齿轮
    BindSiteInfo: '无绑定站点信息',//无绑定站点信息
    history: '历史数据',//历史数据
  },
  // 设备参数
  equipmentParameters: {
    AddParam: '添加参数',//添加参数
    DelParam: '删除参数',//删除参数
    equipType: '设备类型',//设备类型
    paramName: '参数名称',//参数名称
    value: '数值',//数值
    isSureDel: '是否删除此条记录',//是否删除此条记录
    SelDelRecord: '请选择需要删除的记录',//请选择需要删除的记录
  },
  // 设备维护记录
  maintain: {
    addRecord: '添加纪录',//添加纪录
    delRecord: '删除记录',//删除记录
    RecordName: '记录名称',//记录名称
    recorder: '记录人',//记录人
    Remarks: '备注',//备注
    annex: '附件',//附件
    UploadAttachment: '上传附件',//上传附件
    CompleteTime: '完成时间',//完成时间
    isSureDel: '是否删除此条维护记录',//是否删除此条维护记录
    SelDelRecord: '请选择需要删除的记录',//请选择需要删除的记录
  },
  //实时报警汇总列表
  realAlarm: {
    EquipName: '设备名称',//设备名称
    Alarm: '报警',//报警
    warn: '预警', //预警
  },
  //服务器信息
  server: {
    runningState: '运行状态', // 运行状态
    systemMessage: '系统信息',//系统信息
    loading: '数据加载中',//数据加载中
    MemoryInfo: '内存信息',//内存信息
    DiskInfo: '磁盘信息',//磁盘信息
    InternetInfo: '网络信息',//网络信息
    HostName: '主机名称',//主机名称
    JVMMemory: 'JVM总内存',//JVM总内存
    JVMRemainMemory: 'JVM剩余内存',//JVM剩余内存
    JAVAVersion: 'JAVA版本',//JAVA版本
    JAVAPath: 'JAVA路径',//JAVA路径
    operateSystem: '操作系统',//操作系统
    CPUNumber: 'CPU核心个数',//CPU核心个数
    CPUBrand: 'CPU品牌',//CPU品牌
    CPUModel: 'CPU型号',//CPU型号
    UserUtilization: '用户使用率',//用户使用率
    SystemUtilization: '系统使用率',//系统使用率
    TotalUsage: '总使用率',//总使用率
    TotalMemory: '内存总量',//内存总量
    MemoryUsage: '内存使用量',//内存使用量
    RemainMemory: '内存剩余量',//内存剩余量
    MemoryUsage: '内存使用率',//内存使用率
    DiskName: '磁盘名称',//磁盘名称
    DiskType: '磁盘类型',//磁盘类型
    DiskCapacity: '磁盘容量',//磁盘容量
    AvailableSpace: '可用空间',//可用空间
    UsedSpace: '已用空间',//已用空间
    EquipName: '设备名称',//设备名称
    IPAddress: 'IP地址',//IP地址
    SubnetMask: '子网掩码',//子网掩码
    MACAddress: 'MAC地址',//MAC地址
    NetworkInfo: '网卡信息',//网卡信息
    recevePacket: '接收总包数',//接收总包数
    sentPacket: '发送总包数',//发送总包数
    receveByte: '接收总字节数',//接收总字节数
    sentByte: '发送总字节数',//发送总字节数
    receveErrorPacket: '接收错误包数',//接收错误包数
    sentErrorPacket: '发送错误包数',//发送错误包数
    discardPacket: '接收丢弃包数',//接收丢弃包数
  },
  //系统日志
  system: {
    event500: '采集器要设置等待超时',//采集器要设置等待超时
    event501: '采集器发送空闲等待超时',//采集器发送空闲等待超时
    event502: '采集器倾角要数据超时',//采集器倾角要数据超时
    CollectorVib: '采集器振动通道',//采集器振动通道
    CollectorTime: '采集器温度通道',//采集器温度通道
    SelfCheckAbnormal: '自检异常',//自检异常
    SelfCheckNormal: '自检正常',//自检正常
    event2012: '与远程服务器网络通讯异常',//与远程服务器网络通讯异常
    event2017: '服务器硬盘空间不足',//服务器硬盘空间不足
    CollectorSerialPort: '采集器串口',//采集器串口
    InitializationError: '初始化错误',//初始化错误
    event0: '未描述',//未描述
    InitializationToNormal: '初始化恢复正常',//初始化恢复正常
    event2103: '倾覆设备已拔出',//倾覆设备已拔出
    event_2103: '倾覆设备已接入',//倾覆设备已接入
    event2104: '倾覆设备运行不正常',//倾覆设备运行不正常
    event_2104: '倾覆设备运行恢复正常',//倾覆设备运行恢复正常
    CollectorKeyPhase: '采集器键相',//采集器键相
    speedWrong: '采集的转速错误',//采集的转速错误
    speedToNormal: '采集的转速恢复正常',//采集的转速恢复正常
    event_2102: '采集器硬件程序设置成功',//采集器硬件程序设置成功
    event2102: '采集器硬件程序设置失败',//采集器硬件程序设置失败
    CollectorSpeed: '采集器转速通道',//采集器转速通道
    LowFreqError: '采集低频信号错误',//采集低频信号错误
    LowFreqToNormal: '采集低频信号恢复正常',//采集低频信号恢复正常
    HighFreqError: '采集高频信号错误',//采集高频信号错误
    HighFreqToNormal: '采集高频信号恢复正常',//采集高频信号恢复正常
    speed1_5max: '转速超过最高转速的1.5倍',//转速超过最高转速的1.5倍
    speedMaxToNormal: '转速超过最高转速1.5倍恢复正常',//转速超过最高转速1.5倍恢复正常
    event3000: '采集器FPGA自检失败',//采集器FPGA自检失败
    event_3000: '采集器FPGA自检正常',//采集器FPGA自检正常
    event3001: '采集器SRAM自检失败',//采集器SRAM自检失败
    event_3001: '采集器SRAM自检正常',//采集器SRAM自检正常
    GAPNotNormal: '的GAP电压不在正常范围',//的GAP电压不在正常范围
    GAPToNormal: '的GAP电压恢复到正常范围',//的GAP电压恢复到正常范围
    SensorCableFault: '传感器电缆故障',//传感器电缆故障
    SensorCableToNormal: '传感器电缆故障恢复',//传感器电缆故障恢复
    CollectorProcessQuantity: '采集器过程量通道', //采集器过程量通道
    ValueNotNormal: '的值不在正常范围',//的值不在正常范围
    ValueToNormal: '的值恢复到正常范围',//的值恢复到正常范围
    noSignal: '没有信号',//没有信号
    BackToSignal: '恢复到有信号',//恢复到有信号
    SelfTestfailed: '自检失败',//自检失败
    SelfTestnormal: '自检正常',//自检正常
    FreqSelfTestfailed: '频率自检失败',//频率自检失败
    FreqSelfTestnormal: '频率自检正常',//频率自检正常
    CircuitBreak: '线路断路',//线路断路
    LineNormal: '线路正常',//线路正常
    SensorSelfTestFailed: '传感器自检失败',//传感器自检失败
    SensorSelfTestNormal: '传感器自检正常',//传感器自检正常
    BiasSelfTestFailed: '偏置自检失败',//偏置自检失败
    BiasSelfTestNormal: '偏置自检正常',//偏置自检正常
    ShortCircuit: '线路短路',//线路短路
    event4100: '采集器TCP/IP通讯错误',//采集器TCP/IP通讯错误
    event_4100: '采集器TCP/IP通讯恢复正常',//采集器TCP/IP通讯恢复正常
    CRCError: '通讯CRC效验错',//通讯CRC效验错
    CRCToNormal: '通讯CRC效验恢复正常',//通讯CRC效验恢复正常
    CommunicateTimeout: '通讯超时',//通讯超时
    CommunicateToNormal: '通讯从超时恢复',//通讯从超时恢复
    event4400: '采集器TCP/IP通讯超时',//采集器TCP/IP通讯超时
    event_4400: '采集器TCP/IP通讯从超时恢复',//采集器TCP/IP通讯从超时恢复
    event5000: '采集器重新启动',//采集器重新启动
    event5001: '采集器设置已经被修改',//采集器设置已经被修改
    event5002: '采集器设置错误',//采集器设置错误
    event5003: '采集器硬件接触异常',//采集器硬件接触异常
    event5006: '采集器软启动',//采集器软启动
    event5007: '采集器rtclient软启动',//采集器rtclient软启动
    event5010: '采集器main软启动',//采集器main软启动
    event5011: '采集器main子进程软启动',//采集器main子进程软启动
    event5018: '采集器serial软启动',//采集器serial软启动
    event5019: '采集器串口二的serial软启动',//采集器串口二的serial软启动
    event5020: '采集器client软启动',//采集器client软启动
    event5022: '采集器hd软启动',//采集器hd软启动
    collectorSelfTestCheck: '采集器自检开始',//采集器自检开始
    collectorSelfTestEnd: '采集器自检结束',//采集器自检结束
    subLearning: '，进行了灵敏监测子学习',//，进行了灵敏监测子学习
    event5260: '采集器接入',//采集器接入
    event5261: '采集器断开',//采集器断开
    event5262: '采集器请求超时',//采集器请求超时
    Collector: '采集器',//采集器
    switchBoard: '号切换板心跳包',//号切换板心跳包
    switchBoardFail: '切换板心跳包失败',//切换板心跳包失败
    CollectorVibSignal: '采集器振动信号',//采集器振动信号
    event5900: '采集器的软件修正版本号',//采集器的软件修正版本号
    event6000: '采集器的软件版本更新',//采集器的软件版本更新
    event6001: '采集器的硬件程序升级成功',//采集器的硬件程序升级成功
    event6002: '采集器的硬件程序升级失败',//采集器的硬件程序升级失败
    event6100: '采集器的软件版本号',//采集器的软件版本号
    event7100: '采集器的硬件程序版本号',//采集器的硬件程序版本号
    event7500: '采集器的硬件AB版本号',//采集器的硬件AB版本号
    event8000: '采集器手工采集某个通道的',//采集器手工采集某个通道
    Waveform: '的波形',//的波形
    event8016: '采集器手工采集某个振动通道',//采集器手工采集某个振动通道
    event8032: '采集器手工采集某个键相',//采集器手工采集某个键相
    TriggerBlackBox: '触发黑盒子存储',//触发黑盒子存储
    RemoveBurrs: '剔除毛刺',//剔除毛刺
    event9000: '采集器同步时间',//采集器同步时间
    event9001: '采集器继电器1处于断开报警状态',//采集器继电器1处于断开报警状态
    event_9001: '采集器继电器1处于正常闭合状态',//采集器继电器1处于正常闭合状态
    event9002: '采集器继电器2处于断开报警状态',//采集器继电器2处于断开报警状态
    event_9002: '采集器继电器2处于正常闭合状态',//采集器继电器2处于正常闭合状态
    event9003: '采集器振动通道报警灯处于红色报警状态',//采集器振动通道报警灯处于红色报警状态
    event_9003: '采集器振动通道报警灯处于关闭状态',//采集器振动通道报警灯处于关闭状态
    event9004: '采集器状态运行灯处于灰色正常状态',//采集器状态运行灯处于灰色正常状态
    event9005: '采集器状态运行灯处于红色报警状态',//采集器状态运行灯处于红色报警状态
    event9006: '采集器状态运行灯处于黄色报警状态',//采集器状态运行灯处于黄色报警状态
    event9007: '采集器按键清除报警',//采集器按键清除报警
    CollectorChannel: '采集器通道',//采集器通道
    sensorOrCableAbnormal: '传感器或线缆出现异常',//传感器或线缆出现异常
    sensorOrCableNormal: '传感器或线缆正常',//传感器或线缆正常
    event10000: '采集器手工连续采集某个通道',//采集器手工连续采集某个通道
    minute: '分钟',//分钟
    event11600: '采集器手工连续采集某个振动通道',//采集器手工连续采集某个振动通道
    event12100: '采集器塔顶单方向峰值角度超过0.5度',//采集器塔顶单方向峰值角度超过0.5度
    event13200: '采集器手工连续采集某个键相',//采集器手工连续采集某个键相
    Range: '量程',//量程
    CollectorBolt: '采集器螺栓通道',//采集器螺栓通道
    RequestTimedOut: '请求超时',//请求超时
    chemicalEvent2100: 'RS232初始化错误',//RS232初始化错误
    SerialPort: '串口',//串口
    chemicalEvent_2100: 'RS232初始化正常',//RS232初始化正常
    chemicalEvent2200: '采集的转速错误',//采集的转速错误
    BondPhase: '键相',//键相
    chemicalEvent_2200: '采集的转速正常',//采集的转速正常
    chemicalEvent2300: '采集慢变信号错误',//采集慢变信号错误
    chemicalEvent_2300: '采集慢变信号正常',//采集慢变信号正常
    chemicalEvent2400: '采集快变信号错误',//采集快变信号错误
    chemicalEvent_2400: '采集快变信号正常',//采集快变信号正常
    NormalSpeed: '转速正常',//转速正常
    GAPkeyPhaseNotNormal: '键相信号的GAP电压不在正常范围',//键相信号的GAP电压不在正常范围
    invalid: '无效',//无效
    GAPkeyPhaseNormal: '键相信号的GAP电压正常范围',//键相信号的GAP电压正常范围
    effective: '有效',//有效
    GAPvibNotNormal: '振动信号的GAP电压不在正常范围',//振动信号的GAP电压不在正常范围
    DAURestarts: 'DAU重新启动',//DAU重新启动
    DAUChangeSet: 'DAU设置已经被修改',//DAU设置已经被修改
    DAUsynchronousVersion: 'DAU程序的同步版本号为',//DAU程序的同步版本号为
    DAUrevisedVersion: 'DAU程序的修正版本号',//DAU程序的修正版本号
    chemicalEvent6002: 'DAU硬件版本号3.0',//DAU硬件版本号3.0
    chemicalEvent6100: 'DAU软件版本号',//DAU软件版本号
    chemicalEvent7100: '硬件程序大版本号',//硬件程序大版本号
    UnknownLog: '未知日志',//未知日志
    NotDescribed: '未描述',//未描述
    train: '列车',//列车
    front: '下的前置',//下的前置
    Reboot: '重启',//重启
    Host: '主机',//下的主机
    SelfCheckPassed: '自检通过',//自检通过
    PreSelfTestFailed: '前置自检失败',//前置自检失败
    SelfTestFailed: '自检失败',//自检失败
    VibChannel: '振动通道',//振动通道
    SensorcableSelfTestFailed: '传感器线缆自检失败',//传感器线缆自检失败
    VoltageValue: '电压值',//电压值
    SensorSelfTestFailed: '传感器自检失败',//传感器自检失败
    VibSignalSelfTestFailed: '振动信号自检失败',//振动信号自检失败
    updatesuccessed: '升级成功',//升级成功
    TempSelfTestPassed: '温度通道自检通过',//温度通道自检通过
    TempChannel: '温度通道',//温度通道
    VibSelfTestPassed: '振动通道自检通过',//振动通道自检通过
    SDSelfTestFailed: 'SD卡自检失败',//SD卡自检失败
    tmsEvent2017: '服务器硬盘空间不足',//服务器硬盘空间不足
    channel: '通道',//通道
  },
  //趋势图
  trend: {
    addMap: '新增图谱',//新增图谱
    wave: '波形',//波形
    del: '删除',//删除
    dropPosLimit: '不支持此类测点',//不支持此类测点
    InsufficientSample: '样本数量不足',//样本数量不足
    addPosMatch: '加入不同类型测点，是否要替换',//加入不同类型测点，是否要替换
    existPosTip: '当前图谱已存在该测点',//当前图谱已存在该测点
    xAxis: 'x轴',//x轴
    yAxis: 'y轴',//y轴
    TrendData: '趋势图数据',//趋势图数据
  },
  /* 8000 */
  //单值棒图
  singleBar: {},
  //多值棒图
  multiBar: {},
  //全频谱图
  fullSpectrum: {

  },
  //多频谱图
  multiSpectrum: {
    addPosLimit: '最多拖入六个测点',//最多拖入六个测点
    existsSpectrogram: '已存在该测点频谱图',//已存在该测点频谱图
    posTypeLimit: '该图谱只能拖入振动测点',//该图谱只能拖入振动测点
  },
  //单面动平衡
  singledynamicBalance: {
    CorrectionSurface: '校正面',//校正面
    enterCorrectionSurface: '请输入校正面',//请输入校正面
    BalanceSpeed: '平衡转速',//平衡转速
    enterBalanceSpeed: '请输入平衡转速',//请输入平衡转速
    CoordinateExtremum: '坐标极值',//坐标极值
    enterCoordinateExtremum: '请输入坐标极值',//请输入坐标极值
    turnAround: '旋转方向',//旋转方向
    enterturnAround: '请选择旋转方向',//请选择旋转方向
    OriginVib: '原始振动',//原始振动
    TryToVib: '试重振动',//试重振动
    ResidualVib: '残余振动',//残余振动
    Retry: '试重',//试重
    Counterweight: '配重',//配重
    Remarks: '备注',//备注
    BalanceweightCalc: '平衡配重计算',//平衡配重计算
    ResidualVibvectordisplay: '残振矢量显示',//残振矢量显示
    Clockwise: '顺时针',//顺时针
    Counterclockwise: '逆时针',//逆时针
    TestFreq: '测试次数',//测试次数
    UnbalancedAmplitude: '不平衡响应幅值',//不平衡响应幅值
    UnbalancedPhase: '不平衡响应相位',//不平衡响应相位
    AggravatedQuality: '加重质量',//加重质量
    AccentAngle: '加重角度',//加重角度
    calibrationSurfaceNull: '校正面不能为空',//校正面不能为空
    BalanceSpeedNull: '平衡转速不能为空',//平衡转速不能为空
    BalanceSpeedWrong: '平衡转速必须为非负实数',//平衡转速必须为非负实数
    errorInput: '请输入正确的原始振动幅值（正实数）和相位（0~360）',//请输入正确的原始振动幅值（正实数）和相位（0~360）
    errorInput1: '请输入正确的增加试重质量（正实数）和角度（0~360）',//请输入正确的增加试重质量（正实数）和角度（0~360）
    errorInput2: '请输入正确的试重振动幅值（正实数）和相位（0~360）',//请输入正确的试重振动幅值（正实数）和相位（0~360）
    errorInput3: '请输入正确的残余振动幅值（正实数）和相位（0~360）',//请输入正确的残余振动幅值（正实数）和相位（0~360）
    errorInput4: '请检验增加配重质量（非负实数）和角度（0~360）',//请检验增加配重质量（非负实数）和角度（0~360）
    errorInput5: '残余幅值和相位不能为空！',//残余幅值和相位不能为空！
    certainCoordinate: '某个坐标',//某个坐标
  },
  //双面动平衡
  doubledynamicBalance: {
    amplitude: '振幅',//振幅
    Phase: '相位',//相位
    Correction1_accentuated: '校正面1加重',//校正面1加重
    Correction2_accentuated: '校正面2加重',//校正面2加重
    Correction1_accentAngle: '校正面1加重角',//校正面1加重角
    Correction2_accentAngle: '校正面2加重角',//校正面1加重角
    errorInput: '平衡配重计算溢出，请检查输入数据',//平衡配重计算溢出，请检查输入数据
    errorInput1: '校正面1不能为空',//校正面1不能为空
    errorInput2: '校正面2不能为空',//校正面2不能为空
    errorInput3: '请输入正确的增加试重1质量（正实数）和角度（0~360）',//请输入正确的增加试重1质量（正实数）和角度（0~360）
    errorInput4: '请输入正确的试重1振动幅值（正实数）和相位（0~360）',//请输入正确的试重1振动幅值（正实数）和相位（0~360）
    errorInput5: '请输入正确的增加试重2质量（正实数）和角度（0~360）',//请输入正确的增加试重2质量（正实数）和角度（0~360）
    errorInput6: '请输入正确的试重2振动幅值（正实数）和相位（0~360）',//请输入正确的试重2振动幅值（正实数）和相位（0~360）
  },
  // 极坐标图
  polarDiagram: {
    value: '值',//值
    existsPosTip: '已经存在该测点',//已经存在该测点
    addPosMaxTip: '最多添加6个测点',//最多添加6个测点
  },
  //轴心轨迹图
  axisLocus: {
    OriginalTrajectory: '原始轨迹',//原始轨迹
    halfTrajectory: '0.5x轨迹',//0.5x轨迹
    oneTrajectory: '1x轨迹',//1x轨迹
    twoTrajectory: '2x轨迹',//2x轨迹
    fourTrajectory: '4x轨迹',//4x轨迹
    eightTrajectory: '8x轨迹',//8x轨迹
    sixteenTrajectory: '16x轨迹',//16x轨迹
  },
  //轴心位置图
  axisPosition: {
    baseInfo: '基本信息',//基本信息
    installationAngle: '安装角度',//安装角度
    referenceGap: '参考点间隙电压',//参考点间隙电压
    GapX: '间隙电压门限X',//间隙电压门限X
    GapY: '间隙电压门限Y',//间隙电压门限Y
    GaprRangeX: '间隙电压量程X',//间隙电压量程X
    GaprRangeY: '间隙电压量程Y',//间隙电压量程Y
    RefreshMap: '刷新图谱',//刷新图谱
    Tao: '道',//道
    PointOrder: '点序',//点序
    GapVoltage: '间隙电压',//间隙电压
    cursor: '光标',//光标
  },
  //转速时间图
  speedTime: {

  },
  //奈奎斯特图
  nyquist: {
    value: '值',//值
  },
  //bode图
  bode: {

  },
  //级联图
  cascade: {
    SwitchDisplayMode: '切换显示模式',//切换显示模式
  },
  //启停机数据列表
  startStop: {},
  //专家系统
  expertSystem: {
    SymptomType: '征兆类型',//征兆类型
    Confidence: '置信度',//置信度
    MaintenanceRecommend: '维护建议',//维护建议
    noData: '专家系统无数据！',//专家系统无数据！
    PoorDynamicBalance: '动平衡不良',//动平衡不良
    PoorAlignment: '对中不良',//对中不良
    Friction: '有摩擦',//有摩擦
    OilVortex: '油膜涡动',//油膜涡动
    OilFilmShock: '油膜震荡',//油膜震荡
    adviceStr1_1: '降负荷（或降速）运行；',//降负荷（或降速）运行；
    adviceStr1_2: '如转子不平衡故障由转子结垢不均匀造成，转子动平衡时须彻底清理转子上的结垢；',//如转子不平衡故障由转子结垢不均匀造成，转子动平衡时须彻底清理转子上的结垢；
    adviceStr1_3: '择机停车处理，按技术要求对转子进行动平衡。',//择机停车处理，按技术要求对转子进行动平衡。
    adviceStr2_1: '按技术要求调整轴系转子对中量，重新对中；',//按技术要求调整轴系转子对中量，重新对中；
    adviceStr2_2: '转子冷态对中时，应考虑到热态不对中变化量。',//转子冷态对中时，应考虑到热态不对中变化量。
    adviceStr3_1: '调整转子与静止件的相对位置（均匀）和间隙（技术要求指标上线）；',//调整转子与静止件的相对位置（均匀）和间隙（技术要求指标上线）；
    adviceStr3_2: '提高轴系对中精度；',//提高轴系对中精度；
    adviceStr3_3: '减小转轴振动、径向跳动和外界扰动（如提高转子动平衡精度，降低不平衡力）；',//减小转轴振动、径向跳动和外界扰动（如提高转子动平衡精度，降低不平衡力）；
    adviceStr3_4: '如发生局部摩擦故障，可采用摩擦方法扩大动静间隙（临时措施）。',//如发生局部摩擦故障，可采用摩擦方法扩大动静间隙（临时措施）。
    adviceStr4_1: '按技术要求安装轴承，轴承间隙须符合要求，调整好轴承座紧力；',//按技术要求安装轴承，轴承间隙须符合要求，调整好轴承座紧力；
    adviceStr4_2: '改进轴承工作状况，润滑油须定期检验，如有问题及时处理（如过滤、脱水、补油、添加高性能抗磨剂等）；',//改进轴承工作状况，润滑油须定期检验，如有问题及时处理（如过滤、脱水、补油、添加高性能抗磨剂等）；
    adviceStr4_3: '调整润滑油温、油压（适当提高供油压力和油温）；',//调整润滑油温、油压（适当提高供油压力和油温）；
    adviceStr4_4: '更换符合技术要求的轴承。',//更换符合技术要求的轴承。
    adviceStr5_1: '调整轴瓦，提高轴径在轴系内的偏心率，提高轴承一阶临界转速，提高失稳转速。',//调整轴瓦，提高轴径在轴系内的偏心率，提高轴承一阶临界转速，提高失稳转速。
  },
  //8000报警
  alarm_8000: {
    HigherReport: '高高报',//高高报
    HighReport: '高报',//高报
    FrequencyDeviation: '通频值偏差',//通频值偏差
    onexdeviation: '1X偏差',//1X偏差
    twoxdeviation: '2X偏差',//2X偏差
    fivexdeviation: '5X偏差',//5X偏差
    Optionalxdeviation: '可选X偏差',//可选X偏差
    ResidualDeviation: '残余量偏差',//残余量偏差
  }
}
