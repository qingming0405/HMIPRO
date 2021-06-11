export const en = {
  //公共字段
  Common: {
    noPosText: 'No Position Data',//无测点
    noDataText: 'No Data',//无数据
    noRealData: 'No real data',//无实时数据
    noDiagText: 'No diagnosis result',//暂无诊断结果
    noChartTips: 'No Such Kind of Chart',//该类型测点没有此图谱
    collectTips: 'Collection failed',//收藏失败
    quitCollectTips: 'Failed to unfavorite',//取消收藏失败
    failTips: 'failed',//操作失败
    offlineText: 'Offline',//报警状态离线
    normalText: 'Normal',//报警状态正常
    warnText: 'Warning',//报警状态预警
    alarmText: 'Alarm',//报警状态报警
    focausText: 'Focus',//关注
    allText: 'All',//全部
    chainText: 'Drive chain',//传动链
    moreText: 'more',//详情
    noFocusMacTips: 'No focused data',//无重点关注机组
    noWaveAtPos: 'There is no waveform at this measuring point.',//该测点没有波形图
    Wave: 'Waveform spectrum',//波形频谱图
    trend: 'slip chart',//趋势图
    Case1: 'Case 1',//工况1
    Case2: 'Case 2',//工况2
    Case3: 'Case 3',//工况3
    Case4: 'Case 4',//工况4
    OtherCond: 'Other working conditions',//其它工况
    AlarmLog: 'Alarm Log',//报警日志
    inquiry: 'Inquiry',//查询
    realData: 'Real Time Data',//实时数据
    retrieval: 'Filter Data',// 数据检索
    derivedData: 'Derived Data',//导出数据
    previousDay: 'The Previous Day',//前一天
    previousWeek: 'The previous Week',//前一周
    PreviousQuarter: 'Previous Quarter',//前一季
    previousMonth: 'The Previous Month',//前一月
    pastYear: 'The Past Year',//前一年
    custom: 'custom',//自定义
    tree: 'organization',//组织
    mac: 'machine set',//机组
    pos: 'measuring point',//测点
    eigenvalue: 'eigenvalue',//特征值
    order: 'Serial Number',//序号
    treeName: 'Organization Name',//组织名称
    macName: 'Unit Name',//机组名称
    posName: 'Name Of Measuring Point',//测点名称
    popTreeTips: 'Please select an organization',//请选择组织
    popMacTips: 'Please select a machine',//请选择机组
    popPosTips: 'Please select a position',//请选择测点
    noPosChartTips: 'No Such Kind of Chart',//该测点没有此图谱
    /* 数据检索 */
    title: 'Data Retrieval',//数据检索
    time: 'Time',//时间
    startTime: 'Start Time',//开始时间
    endTime: 'End Time',//结束时间
    placeholderTime: 'Select date time',//选择日期时间
    resetBtn: 'Reset',//重置
    sureBtn: 'Ok',//确认
    cancelBtn: 'Cancel',//取消
    allBtn: 'All',//全选
    reverseBtn: 'Reverse',//反选
    queryDensityBtn: 'Query Density',//查询密度
    speedRange: 'Speed Range',//转速区间
    typeEignin: 'Eigenvalue',//特征值
    show: 'Show',//显示
    hide: 'Hide',//隐藏
    hour: 'Hour',//小时
    day: 'Day',//天
    mouth: 'Mouth',//月
    allMac: 'All Machines',//所有机组
    allPosition: 'All Positions',//所有测点
    allEignin: 'All Eigenvalue',//特征值全选
    filterUp: 'Upper Limit',//上限过滤
    filterDown: 'Lower Limit',//下限过滤
    highDensity: 'High Density',//高密度
    lowDensity: 'Low Density',//低密度
    mediumDensity: 'Medium Density',//中密度
    popTimeText: 'The end time must be later than the start time',//结束时间必须大于开始时间
    popSpeedText: 'The maximum speed must be greater than the minimum speed',//最大转速必须大于最小转速
    popLowerText: 'The upper limit filter must be greater than the lower limit filter',//上限过滤必须大于下限过滤
    popDataTypeText: 'Please select at least one data type!',//请至少选择一个数据类型！
    popFreqBandText: 'Maximum effective frequency band must be greater than minimum effective frequency band',//最大有效频段必须大于最小有效频段
    train: 'Train',//列车
    dataType: 'Data Type',//数据类型
    Xeigenvalue: 'X-axis eigenvalue',//X轴特征值
    Yeigenvalue: 'Y-axis eigenvalue',//Y轴特征值
    upPath: 'up-path',//上行
    downPath: 'down-path',//下行
    leftTrack: 'Left Track',//左轨
    rightTrack: 'Right Track',//右轨
    upDownPath: 'Up-down-path',//上下行
    track: 'Track',//轨道
    line: 'Line',//线路
    startStop: 'Starting Station',//起始站点
    /* 组件-弹窗 */
    tips: 'Tips',//提示 
    /* 组件-启停机 */
    state: 'State',//状态
    toToday: 'Until Now',//至今
    /* 组件-tms趋势 */
    waveData: 'Wave Data',//波磨数据 
    addPos: 'Add Position',//加入测点
    timeList: 'Time List',//时间列表
    dataScreening: 'data screening',//数据筛选
    StatisticalList: 'Statistical list',//统计列表
    derivation: 'derivation',//导出
    failure: 'failure frequency',//故障频率
    freq: 'frequency',//频率
    amplitude: 'amplitude',//幅值
    wave3d: 'Three-dimensional spectrogram',//三维频谱图
    turnBack: 'Return',//返回
    deadLine:'Deadline',//截止时间
    filterLowerLimit:'Filter Lower Limit',//滤波下限
    filterUpLimit:'Filter Up Limit',//滤波上限
    startFreq:'Start Frequency',//开始频率
    endFreq:'End Frequency',//截止频率
    points:'Points',//点数
    selectPos:'Select Postion',//选择测点
    clearSet:'Clear Settings',//清空设置
    effectiveTime:'Effective Time',//有效时间
  },
  Common8000: {
    TimedHisData: 'Timed historical data',//定时历史数据
    StartStopData: 'Start-stop data',//启停机数据
    AlarmStorageData: 'Alarm storage data',//报警存储数据
  },
  icon: {
    FreqDifference: 'Symmetrical frequency difference',//对称频率差
    hanning: 'hanning window',//汉宁窗
    SwitchingOrderRatio: 'Switching order ratio',//切换阶比
    oneFreqDoubling: 'Positioning to 1 frequency doubling',//定位到1倍频,
    LowFreqFilter: 'Low-frequency filtering',//低频过滤
    EffectiveFreq: 'Effective frequency setting',//有效频率设置
    LabelledFreq: 'Labelled frequency doubling',//标注倍频
    AddAnnotations: 'Add annotations',//添加标注
    CancelLabel: 'Cancellation of labeling',//取消标注
    CyclePeakSearch: 'Cycle Peak Search',//循环寻峰
    FaultFrequencyDetail: 'Fault frequency detail',//故障频率明细
    CalibrationFreq: 'Calibration frequency doubling',//校准倍频
    unitSelect: 'unit selection',//单位选择
    maximize: 'maximize',//最大化
    AudioExport: 'Audio export', //音频导出
    dataExport: 'data export',//数据导出
    reset: 'reset',//重置
    openWindow: 'Window zoom',//开窗放大
    SavePicture: 'Save as picture',//保存为图片
    EffectiveFreqAllPos: 'Effective frequency setting of all measuring points',//所有测点有效频率设置
    TimeDifference: 'Time difference',//时间差
    LogarithmicCoordinates: 'Logarithmic coordinates',//对数坐标
    SpeedPulse: 'Speed pulse',//转速脉冲
    TimeWaveformFilter: 'Time domain waveform filtering',//时域波形过滤
    resetIcon:'Reset',//重置
  },
  // 特征值
  eigenvalue: {
    accelerationValue: 'Effective value of acceleration',//加速度有效值
    speedValue: 'Effective value of speed',//速度有效值
    displacementValue: 'Effective value of displacement',//位移有效值
    Kurtosis: 'Kurtosis',//峭度
    envelope: 'envelope',//包络
    temperature: 'temperature',//温度
    electricity: 'Quantity of electricity',//电量
    PreloadValue: 'Preload value',//预紧力值
  },
  //登录页
  Login: {
    title: 'Login',
    user: 'user name',
    password: 'password',
    errorTips: 'User name or password is invalid!',
    remember: 'Remember password',
    noLicence: 'Unregistered License',
    goLicence: 'Please go to CMC to register a licence first',
    titleText: 'live',
    copyright: 'Copyright: Zhejiang Zhongzi Qingan New Energy Technology Co., Ltd.',
    CS2000title1: 'CS2000 Wind turbine',
    CS2000title2: 'condition monitoring & diagnostic system',
    DS9100title1: 'DS9100 Industrial equipment',
    DS9100title2: 'condition monitoring & diagnostic system',
    TMS2000title1: 'TMS2000 Vehicle running gear',
    TMS2000title2: 'condition monitoring & diagnostic system',
    WHD9200title1: 'WHD9200 Oil well',
    WHD9200title2: 'condition monitoring & diagnostic system',
    KJ5000title1: 'KJ5000 Miniing Machinery',
    KJ5000title2: 'condition monitoring & diagnostic system',
    Rotatetitle1: 'Rotating Machinery',
    Rotatetitle2: 'condition monitoring & diagnostic system',
    contact: 'contact information',
    normaltitle: 'Intelligent data diagnosis platform',
  },
  //风电总貌图
  FdGeneral: {
    searchHolder: 'search the machine name',
    statusText: 'status',
    speedText: 'speed',
  },
  //风电重点关注
  FdFocus: {
    filterText: 'Filter',
    macTitle: 'Machine',
    searchMacText: 'search machine',
    posTitle: 'Position',
    searchPosText: 'search position',
    valTitle: 'Eigenvalues',
    searchValText: 'search eigenvalues',
    numTitle: 'Quantity',
    sureText: 'Ok',
    statusText: 'status',
    speedText: 'speed',
    noDataText: 'No data',
  },
  //风电模型2d
  FdModel: {
    btn3dText: '3D Mode',
    locName1: 'drive chain',//部位名称传动链
    locName2: 'tower',//部位名称塔筒
    locName3: 'bolt',//部位名称螺栓
    locName4: 'impeller',//部位名称叶轮
    locName5: 'oil',//部位名称油液
    locName6: 'anchor bolt',//部位名称锚栓
    locName7: 'base',//部位名称基础
    diagnosisText: 'intelligent diagnosis',//诊断结果标签
    diagnosisTitle: 'drive chain',//诊断结果传动链名称
    bearingDefect:'Bearing defect',//轴承缺陷
    gearDefect:'Gear defect',//齿轮缺陷
    motorDefect:'Unbalanced or loose motor',//电机不平衡或松动
    gearBoxDefect:'Gearbox overload',//齿轮箱载荷过重
  },
  //风电模型3d
  WindModel: {
    btn2dText: '2D Mode',//切换到2d模式的按钮
    btnStopText: 'Rotate Or Not',//风机启停按钮
    btnPerspective: 'Perspective effect',//风机透视效果
    btnPhysical: 'Fan appearance',//风机外观效果
    detectPart: 'Detect part',//检测部件
    healthValue: 'Health value'//健康值
  },
  //风电模型-传动链
  DriveChain: {
    mainBearing: 'Main Bearing',//主轴承
    moreText: 'more',//详情
    digitalTwin: 'Digital Twin',//数字孪生
    resetBtn: 'Reset',//重置
    gearBox: 'Gearbox',//齿轮箱
    generator: 'Generator',//发电机
    public: 'Public',//公共
  },
  //风电模型-锚栓
  Anchorbolt: {
    base: 'Base',//基础
    moreText: 'more',//详情
    anchorBoltModel: 'Anchor bolt model',//锚栓模型
  },
  //风电模型-基础
  Basics: {
    base: 'Base',//基础
    moreText: 'more',//详情
  },
  //风电模型-螺栓
  Bolt: {
    boltModel: 'Bolt Model',//螺栓模型
    moreText: 'more',//详情
  },
  //风电模型-叶轮
  Impeller: {
    public: 'Public',//公共
    moreText: 'more',//详情
  },
  //风电模型-油液
  Oil: {
    public: 'Public',//公共
    moreText: 'more',//详情
  },
  //风电模型-塔筒
  Towerdrum: {
    moreText: 'more',//详情
  },
  //轨交总貌图
  GjGeneral: {
    searchHolder: 'search...',//搜索的提示语
  },
  //轨交重点关注
  GjFocus: {
    filterText: 'Filter',
    macTitle: 'Machine',
    searchMacText: 'search machine',
    posTitle: 'Position',
    searchPosText: 'search position',
    valTitle: 'Eigenvalues',
    searchValText: 'search eigenvalues',
    numTitle: 'Quantity',
    sureText: 'Ok',
  },
  //轨交设备模型
  GjModel: {
    offlineText: 'offline',//报警状态离线
    normalText: 'normal',//报警状态正常
    warnText: 'warning',//报警状态预警
    alarm1Text: 'Level 1 alarm',//报警状态Ⅰ级报警
    alarm2Text: 'Level 2 alarm',//报警状态Ⅱ级报警
  },
  //轨交设备详情
  GjModelInfo: {
    runningBtn: 'Vehicle Running Gear',//走行部按钮文字
    runningTitle: 'Vehicle Running Gear Model',//走行部模型图标题文字
    headChname: 'Channel Name',//表头通道名称
    headLoc: 'Location',//表头安装位置
    headVibAlarm: 'Vibration Alarm Type',//表头振动报警类型
    headTempAlarm: 'Temperature Alarm Type',//表头温度报警类型
    headAdvice: 'Repair Advices',//表头维修建议
    offlineText: 'offline',//报警状态离线
    normalText: 'normal',//报警状态正常
    warnText: 'warning',//报警状态预警
    alarm1Text: 'Level 1 alarm',//报警状态Ⅰ级报警
    alarm2Text: 'Level 2 alarm',//报警状态Ⅱ级报警
    offlineAdvice: 'Device is offline',//设备离线的建议文字
    normalAdvice: 'Operating normally',//设备正常的建议文字
    warnAdvice: 'If the fault cannot be eliminated, it is recommended to return to the warehouse after the operation of the day is ended',//设备预警的建议文字
    alarm1Advice: 'If the fault cannot be eliminated, it is recommended to exit the operation after the end of the operation',//设备Ⅰ级报警的建议文字
    alarm2Advice: 'If the fault cannot be eliminated, it is recommended to quit operation after clearing the passengers at the next stop',//设备Ⅱ级报警的建议文字
  },
  //油田总貌图
  YtGeneral: {
    IDText: 'ID',//通讯ID
    statusText: 'Status',//运行状态
    alarmText: 'Alarm',//报警状态
  },
  //油田重点关注
  YtFocus: {
    filterText: 'Filter',//过滤
    macTitle: 'Machine',//机组
    searchMacText: 'search machine',//搜索机组
    posTitle: 'Position',//测点
    searchPosText: 'search position',//搜索测点
    valTitle: 'Eigenvalues',//特征值
    searchValText: 'search eigenvalues',//搜索特征值
    numTitle: 'Quantity',//数量
    sureText: 'Ok',//确定
    IDText: 'ID',//通讯ID
    statusText: 'Status',//运行状态
    alarmText: 'Alarm',//报警状态
    collectTips: 'Collection failed',//收藏失败
    allText: 'all',//全部
    offlineText: 'Offline',//报警状态离线
    normalText: 'Normal',//报警状态正常
    warnText: 'Warning',//报警状态预警
    alarmText: 'Alarm',//报警状态报警
    runStatus1: 'Disconnect',//未接入
    runStatus2: 'Running',//运行
    runStatus3: 'Stop',//停机
    filterError: 'Incorrect filtering data',//筛选数据弹窗提示语：有误
    filterNoData: 'No data',//筛选数据弹窗提示语：筛选无数据
  },
  //油田设备模型
  YtModel: {
    macModel: 'Model',//设备模型
    punchCard: 'Current Card',//电流卡片
    analysis: 'Analysis',//沉没度分析
  },
  //油田设备模型详情
  YtMechineModel: {
    tableTitle1: 'Record',//运行记录
    tableTitle2: 'Frequency Converter',//变频器
    tableTitle3: 'Transformer',//变压器
    tableTitle4: 'Motor',//井下电机
    tableTitle5: 'Power Consumption',//系统功耗
    tableTitle6: 'Sensor',//井下传感器
    runStatus: 'Disconnect',//未接入
  },
  //油田电流卡片
  YtPunchCard: {
    noPosText: 'No Position Data',//无测点
    noDataText: 'No Data',//无数据
    dayCard: 'Day Card',//天卡
    weekCard: 'Week Card',//周卡
    monthCard: 'Month Card',//月卡
    toolTipWord1: 'current',//电流
    toolTipWord2: 'time',//时间
  },
  //油田沉没度分析
  YtAnalyse: {
    tableTitle1: 'Process Volume Position',//工艺量测点
    tableTitle2: 'Sinking Trend Chart',//沉没度趋势
    tableTitle3: 'Oilfield Model',//油田模型
    moreText: 'more',//详情
    sersorDepth: 'Sensor vertical depth',//传感器垂深
    curValue: 'value',//当前值
    warnValue: 'warning value',//预警值
    alarmValue: 'alarm value',//报警值
    time: 'time',//时间
    sinkVal: 'sink value',//沉没度
  },
  //工业设备重点关注
  SnFocus: {
    macStatus: 'Status',//设备状态
    macSpeed: 'Speed',//设备实时转速
    macCon: 'Situation',//设备近况
    diagTime: 'Time',//诊断时间
    diagResult: 'Result',//诊断结果
    noFocusMacTips: 'No focused data',//无重点关注机组
  },
  //工业设备设备模型
  SnModel: {
    titleBtn1: 'Model',//设备模型
    titleBtn2: 'Position',//测点列表
    titleBtn3: 'Oil params',//油液参数
    titleBtn4: 'Angle of Dip',//倾角
  },
  //工业设备倾角
  Towerdrum: {
    angle: 'Angle of Dip',//倾角
    sink: 'Sink',//沉降
  },
  //通用设备模型详情-传动链
  TyVib: {
    tableTitle1: 'Position list',//测点列表
    tableTitle2: 'Drive chain',//数字孪生
  },
  //头部
  HeaderEdge: {
    alarmRingTitle: 'Turn on the alarm sound',//开启报警声音
    loginOut: 'Sign Out',//退出
    manualTitle: 'Manual',//使用手册
    firstLevel1: 'Overview',//总貌图
    firstLevel2: 'Atlas Analysis',//图谱分析
    firstLevel3: 'Start-stop Analysis',//启停机分析
    firstLevel4: 'Data Analysis',//数据分析
    firstLevel5: 'Log List',//日志列表
    /*风电、水泥、轨交、油田、化工、通用总貌图*/
    secondLevel1_1: 'Overview',//总貌图
    secondLevel1_2: 'Focus',//重点关注
    secondLevel1_3: 'Device Model',//设备模型
    /* 图谱分析二级导航 */
    secondLevel2_1: 'Diagnosis of trend',//智能诊断趋势
    secondLevel2_2: 'Waveform-spectrum Analysis',//波形频谱图
    secondLevel2_3: 'Trend Chart',//趋势图
    secondLevel2_4: '3d Spectrogram',//三维频谱图
    secondLevel2_5: 'Rail Corrugation Chart',//轨道波磨图
    secondLevel2_6: 'Spectrum Waterfall of Rail Corrugation',//轨道波磨频谱瀑布
    secondLevel2_7: 'Angle Distribution Chart',//倾角分布图
    secondLevel2_8: 'Engine Room Track Chart',//机舱轨迹图
    secondLevel2_9: 'Scatter Diagram',//散点图
    secondLevel2_10: 'Range monitoring of dangerous speed',//危险转速区间监测
    secondLevel2_11: 'Rail corrugation map',//轨道波磨地图
    secondLevel2_12: 'Single value bar chart',//单值棒图
    secondLevel2_13: 'Multivalued bar chart',//多值棒图
    secondLevel2_14: 'Full Spectrum Chart',//全频谱图
    secondLevel2_15: 'Multi-spectrum Chart',//多频谱图
    secondLevel2_16: 'Single-side Dynamic Balance',//单面动平衡
    secondLevel2_17: 'Double-sided Dynamic Balance',//双面动平衡
    secondLevel2_18: 'Polar Diagram',//极坐标图
    secondLevel2_19: 'Axis Orbit Chart',//轴心轨迹图
    secondLevel2_20: 'Axis Position Chart',//轴心位置图
    /* 启停机分析二级导航 */
    secondLevel3_1: 'Speed Time Chart',//转速时间图
    secondLevel3_2: 'Nyquist Diagram',//奈奎斯特图
    secondLevel3_3: 'Bode Diagram',//伯德图
    secondLevel3_4: 'Spectrum Waterfall Diagram of Start-stop',//启停机频谱瀑布图
    secondLevel3_5: 'Cascade Graphs',//级联图
    secondLevel3_6: 'Start-stop Data List',//启停机数据列表
    /* 数据分析二级导航 */
    secondLevel4_1: 'Real-time data summary list',//实时数据汇总列表
    secondLevel4_2: 'Real-time data list',//实时数据列表
    secondLevel4_3: 'Historical data list',//历史数据列表
    secondLevel4_4: 'Monitor Log',//监测报表
    secondLevel4_5: 'Plant Parameter',//设备参数
    secondLevel4_6: 'Equipment maintenance records',//设备维护记录
    secondLevel4_7: 'Statistical list',//统计列表
    secondLevel4_8: 'Expert system',//专家系统
    secondLevel4_9: 'Real-time Alarm Summary List',//实时报警汇总列表
    secondLevel4_10: 'Tread surface Data',//踏面测量数据
    secondLevel4_11: 'Trend of tread wear',//踏面磨损趋势
    secondLevel4_12: 'Prediction of tread life',//踏面寿命预估
    /* 日志列表二级导航 */
    secondLevel5_1: 'Alarm Log',//报警日志
    secondLevel5_2: 'Server information',//服务器信息
    secondLevel5_3: 'System Log',//系统日志
    secondLevel5_4: 'Manual',//使用手册

    loginOutTips: 'You are logging out of the system, are you sure?',//您正在退出系统，确定吗
    closeTabsTips: 'Close all tabs',//关闭所有标签
    yaojiequanPos: 'Kiln ring index',//窑结圈指数
    gunpituoluoPos: 'Roller peel off index',//辊皮脱落指数
    all: 'All',//全部
    goRealAlarmTitle: 'Real-time Alarm Log',//实时报警日志
    browserTips: 'The browser does not support the full screen API or has been disabled',//浏览器不支持全屏API或已被禁用
  },
  //左侧栏
  Left: {
    searchTreeText: 'search organization',//搜索组织
    searchMacText: 'search machine',//搜索机组
    posNameToolTip: 'Position Name',//测点名称
    posTypeToolTip: 'Position Type',//测点类型
    dgmNameToolTip: 'Collector Name',//采集器名称
    chNameToolTip: 'Channel Name',//关联通道名称
  },
  //数据检索-报警
  AlarmRetrieval: {
    typePos: 'Position',//测点
    typeMac: 'Machine',//机组
    typeChannel: 'Channel',//通道
  },
  //数据检索-监测报表
  MonitorRetrieval: {
    realTimeValue: 'Real-time Value',//实时值
    warningAlarmValue: 'Warning Alarm Value',//预警报警值
    statisticalWays: 'Statistical Ways',//统计方式
    noStatistics: 'No Statistics',//不统计
    nowMac: 'Current Machine',//当前机组
    nowPos: 'Current Position',//当前测点
  },
  //数据检索-三维频谱图
  TMSRetrieval: {
    effectiveBand: 'Frequency Band',//有效频段
    rows: 'rows',//行数
  },
  //数据检索-趋势预测
  TrendRetrieval: {
    predictionCutoff: 'Prediction Cutoff',//预测截止
    threshold: 'Threshold',//阈值
    alarmLimit: 'Alarm Limit',//报警门限
    trendPredict: 'Trend Predict',//趋势预测
    thresholdRange: 'Threshold Range',//阈值范围
  },
  //组件-启停机
  SSindex: {
    startBtn: 'Start',//启
    stopBtn: 'Stop',//停
    onOffBtn: 'on-off',//启停
    onOffingBtn: 'start and stop',//启停中
  },
  // 组件-波形
  WaveChart:{
    effectiveTimeSetting:'Effective Time Setting',//有效时间设置
    minimumTimeFiltering:'Minimum Time Filtering',//最小时间过滤
    EffectiveFrequBandSetting:'Effective frequency band setting',//有效频段设置
  },
  // 组件-波形弹窗
  WaveAlert:{
    filterFrequency:'Filter Frequency',//过滤频率
    filterOrder:'Filter Order',//过滤阶次
    lowerLimit:'Lower Limit',//下限
    upLimit:'Up Limit',//上限
    filterTime:'Filter by time',//时间过滤
  },
  //报警日志
  Alarm: {
    alarmNum: 'Number Of Alarms',//报警次数
    AlarmType: 'Alarm Type',//报警类型
    ChannelName: 'Channel Name',//通道名称
    EventTime: 'Event Time',//事件时间
    EventDescription: 'Event Description',//事件描述
    condType: 'Type Of Working Condition',//工况类型
    AlarmValue: 'Alarm Value',//报警值
    Alarmh: 'Alarm High',//报警(高)
    Warnh: 'High Early Warning',//预警(高)
    Warnl: 'Low Early Warning',//预警(低)
    Alarml: 'Alarm Low',//报警(低)   
    Normal: 'Normal',//正常
    SecondAlarmh: 'Secondary Alarm High', //Ⅱ级报警(高)
    SecondAlarml: 'Secondary Alarm Low', //Ⅱ级报警(低)
    FirstAlarmh: 'First Level Alarm High', //Ⅰ级报警(高)
    FirstAlarml: 'First Level Alarm Low', //Ⅰ级报警(低)
    chNoData: 'No measuring point in current channel!',//当前通道无测点
    treeTitle: 'Organize alarm log',//组织报警日志
    macTitle: 'Unit alarm log',//机组报警日志
    NormalToAlarmh: 'From normal to alarm (high)',//从正常到报警（高）
    NormalToWarnh: 'From normal to early warning (high)',//从正常到预警（高）
    NormalToAlarml: 'From normal to alarm (low)',//从正常到报警（低）
    NormalToWarnl: 'From normal to early warning (low)',//从正常到预警（低）
    WarnhToAlarmh: 'From early warning (high) to alarm (high)',//从预警（高）到报警（高）
    WarnlToAlarml: 'From early warning (low) to alarm (low)',//从预警（低）到报警（低）
    AlarmhToWarnl: 'From alarm (high) to early warning (low)',//从报警（高）到预警（低）
    AlarmhToAlarml: 'From alarm (high) to alarm (low)', //从报警（高）到报警（低）
    WarnhToWarnl: 'From early warning (high) to early warning (low)',//从预警（高）到预警（低）
    WarnhToAlarml: 'From early warning (high) to alarm (low)',//从预警（高）到报警（低）
    WarnlToWarnh: 'From early warning (low) to early warning (high)',//从预警（低）到预警（高）
    WarnlToAlarmh: 'From early warning (low) to alarm (high)',//从预警（低）到报警（高）
    AlarmlToWarnh: 'From alarm (low) to early warning (high)',//从报警（低）到预警（高）
    AlarmlToAlarmh: 'From alarm (low) to alarm (high)',//从报警（低）到报警（高）
    TrendGrowth: 'Trend growth',//趋势增长
    NegativeGrowth: 'Negative trend growth',//趋势负增长
    Alarm: 'Alarm',//报警
    Warn: 'Warn',//预警
    average: 'average value',//平均值
    AlarmhToNormal: 'Return to normal from alarm (high)',//从报警（高）恢复到正常
    WarnhToNormal: 'Return to normal from early warning (high)',//从预警（高）恢复到正常
    AlarmlToNormal: 'Return to normal from alarm (low)',//从报警（低）恢复到正常
    WarnlToNormal: 'Return to normal from early warning (low)',//从预警（低）恢复到正常
    AlarmhToWarnh: 'From alarm (high) to early warning (high)',//从报警（高）回到预警（高）
    AlarmlToWarnl: 'From alarm (low) to early warning (low)',//从报警（低）回到预警（低）
    AbnormalEquipment: 'Abnormal equipment',//设备异常
    kilnRing: 'Serious kiln ring fault',//重度窑结圈故障
    Undefined: 'Undefined',//未定义
  },
  //统计列表
  Census: {
    average: 'Average',//平均值
    variance: 'Variance',//方差
    MaximumTenAverage: 'Maximum 10 % average',//最大10%平均值
    explainedVariance: 'Variance : Measurement of dispersion when measuring random variables or a set of data in probability theory and statistical variance.',//方差:在概率论和统计方差衡量随机变量或一组数据时离散程度的度量
    selectTree: 'Please select the organization',//请选择组织
    selectMac: 'Please select the unit',//请选择机组
    selectPos: 'Please select the measuring point',//请选择测点
    selectEigen: 'Please select the eigenvalue',//请选择特征值
    enterTree: 'Please enter the organization',//请输入组织
    proportion: 'proportion',//比例
    vibUnit: 'Vibration unit',//振动单位
    time: 'Time',//时间
    startTime: 'Start Time',//开始时间
    endTime: 'Finish Time',//结束时间
    statisticalWays: 'statistical ways',//统计方式
    SpeedRange: 'Speed range',//转速区间
    StatisticalCond: 'Statistical Conditions',//统计工况
    selectUnit: 'Please select the unit',//请选择单位
    entirety: 'entirety',//全部
    SearchPos: 'Searching measuring points',//搜索测点
    errorInpur: 'The input scale format is incorrect, please re-enter',//输入比例格式有误，请重新输入
    enterProportion: 'Please enter the proportion',//请输入比例
    enterSpeedRange: 'Please enter the correct speed range.',//请输入正确的转速区间
    value: 'numerical value',//数值
    StatisticsVibValues: 'Statistics of vibration values',//振动值统计
    screenCondition: 'screening condition',//筛选条件
    InputRatio: 'Input ratio: * % or *',//请输入比例：*%或*个
    one: '',//个
    StatisticAtlas: 'Statistic Atlas',//统计图谱
    histogram: 'Histogram',//柱状图
    ListDiagram: 'List Diagram',//列表图
  },
  // 智能诊断趋势
  diagnosisTrend: {
    fault01: 'Outer ring fault of spindle front bearing.',//主轴前轴承外圈故障
    fault02: 'Inner ring fault of spindle front bearing',//主轴前轴承内圈故障
    fault03: 'Roller Fault of Front Bearing of Spindle',//主轴前轴承滚动体故障
    fault04: 'Main shaft front bearing cage failure',//主轴前轴承保持架故障
    fault05: 'Runner of spindle front bearing',//主轴前轴承跑圈
    fault06: 'Looseness of spindle front bearing',//主轴前轴承松动
    fault07: 'electrical failure',//电气故障
    fault08: 'aerodynamic asymmetry',//气动不平衡
    fault11: 'Outer ring fault of rear bearing of spindle',//主轴后轴承外圈故障
    fault12: 'Fault of Inner Ring of Back Bearing of Spindle',//主轴后轴承内圈故障
    fault13: 'Roller Fault of Back Bearing of Spindle',//主轴后轴承滚动体故障
    fault14: 'Main shaft rear bearing cage failure',//主轴后轴承保持架故障
    fault15: 'Runner of spindle rear bearing',//主轴后轴承跑圈
    fault16: 'Looseness of spindle rear bearing',//主轴后轴承松动
    fault21: 'Outer ring fault of planetary carrier impeller side bearing',//行星架叶轮侧轴承外圈故障
    fault22: 'Fault of inner ring of planetary carrier impeller side bearing',//行星架叶轮侧轴承内圈故障
    fault23: 'Failure of Roller of Planetary Frame Impeller Side Bearing',//行星架叶轮侧轴承滚动体故障
    fault24: 'Fault of planetary carrier impeller side bearing cage',//行星架叶轮侧轴承保持架故障
    fault25: 'Fault of Planetary Frame Motor Side Bearing Outer Ring',//行星架电机侧轴承外圈故障
    fault26: 'Failure of Inner Ring of Planetary Frame Motor Side Bearing',//行星架电机侧轴承内圈故障
    fault27: 'Roller Fault of Planetary Frame Motor Side Bearing',//行星架电机侧轴承滚动体故障
    fault28: 'Fault of Planetary Frame Motor Side Bearing Cage',//行星架电机侧轴承保持架故障
    fault29: 'Gear box input shaft bearing running ring',//齿轮箱输入轴轴承跑圈
    fault210: 'Bearing Looseness of Gearbox Input Shaft',//齿轮箱输入轴轴承松动
    fault31: 'Outer ring fault of low speed shaft impeller side bearing',//低速轴叶轮侧轴承外圈故障
    fault32: 'Inner ring fault of low speed shaft impeller side bearing',//低速轴叶轮侧轴承内圈故障
    fault33: 'Roller failure of low speed shaft impeller side bearing',//低速轴叶轮侧轴承滚动体故障
    fault34: 'Failure of cage for low speed shaft impeller side bearing',//低速轴叶轮侧轴承保持架故障
    fault35: 'Fault of Side Bearing Outer Ring of Low Speed Axial Motor',//低速轴电机侧轴承外圈故障
    fault36: 'Fault of Side Bearing Inner Ring of Low Speed Axial Motor',//低速轴电机侧轴承内圈故障
    fault37: 'Roller fault of low speed shaft motor side bearing',//低速轴电机侧轴承滚动体故障
    fault38: 'Low speed shaft motor side bearing cage fault',//低速轴电机侧轴承保持架故障
    fault39: 'Outer ring fault of sliding ring bearing',//滑环轴承外圈故障
    fault310: 'Fault of inner ring of sliding ring bearing',//滑环轴承内圈故障
    fault311: 'Rolling element fault of sliding ring bearing',//滑环轴承滚动体故障
    fault312: 'Fault of sliding ring bearing cage',//滑环轴承保持架故障
    fault313: 'Solar wheel fault',//太阳轮故障
    fault314: 'Planetary wheel failure',//行星轮故障
    fault315: 'Internal gear ring fault',//内齿圈故障
    fault316: 'Poor meshing of planetary gear',//行星级齿轮啮合不良
    fault317: 'Running ring of low speed shaft bearing of gearbox',//齿轮箱低速轴轴承跑圈
    fault318: 'Low-speed shaft bearing looseness of gearbox',//齿轮箱低速轴轴承松动
    fault41: 'Outer ring fault of intermediate shaft impeller side bearing',//中间轴叶轮侧轴承外圈故障
    fault42: 'Fault of bearing inner ring on impeller side of intermediate shaft',//中间轴叶轮侧轴承内圈故障
    fault43: 'Faults of Roller of Side Bearing of Intermediate Shaft Impeller',//中间轴叶轮侧轴承滚动体故障
    fault44: 'Failure of cage for impeller side bearing of intermediate shaft',//中间轴叶轮侧轴承保持架故障
    fault45: 'Outer ring fault of side bearing 1 of intermediate shaft motor',//中间轴电机侧轴承1外圈故障
    fault46: 'Fault of Side Bearing 1 Inner Ring of Intermediate Shaft Motor',//中间轴电机侧轴承1内圈故障
    fault47: 'Roller fault of side bearing 1 of intermediate shaft motor',//中间轴电机侧轴承1滚动体故障
    fault48: 'Fault of side bearing 1 cage of intermediate shaft motor',//中间轴电机侧轴承1保持架故障
    fault49: 'Fault of outer ring 2 of side bearing of middle shaft motor',//中间轴电机侧轴承2外圈故障
    fault410: 'Fault of Side Bearing 2 Inner Ring of Intermediate Shaft Motor',//中间轴电机侧轴承2内圈故障
    fault411: 'Fault of Side Bearing 2 Roller of Intermediate Shaft Motor',//中间轴电机侧轴承2滚动体故障
    fault412: 'Fault of side bearing 2 cage of intermediate shaft motor',//中间轴电机侧轴承2保持架故障
    fault413: 'Poor meshing of intermediate shaft pinion or broken tooth of large gear',//中间轴小齿轮啮合不良或大齿轮断齿
    fault414: 'Intermediate gear misalignment (partial load)',//中间级齿轮不对中（偏载）
    fault415: 'pinion brake',//小齿轮断齿
    fault416: 'Gear box intermediate shaft bearing running ring',//齿轮箱中间轴轴承跑圈
    fault417: 'Bearing Looseness of Gearbox Intermediate Shaft',//齿轮箱中间轴轴承松动
    fault51: 'Outer ring fault of high speed shaft impeller side bearing',//高速轴叶轮侧轴承外圈故障
    fault52: 'Inner ring fault of high speed shaft impeller side bearing',//高速轴叶轮侧轴承内圈故障
    fault53: 'Roller failure of high speed shaft impeller side bearing',//高速轴叶轮侧轴承滚动体故障
    fault54: 'High-speed shaft impeller side bearing cage failure',//高速轴叶轮侧轴承保持架故障
    fault55: 'Fault of Side Bearing Outer Ring of High Speed Axial Motor',//高速轴电机侧轴承外圈故障
    fault56: 'Fault of Side Bearing Inner Ring of High Speed Axial Motor',//高速轴电机侧轴承内圈故障
    fault57: 'Roller Fault of Side Bearing of High Speed Axial Motor',//高速轴电机侧轴承滚动体故障
    fault58: 'High-speed shaft motor side bearing cage failure',//高速轴电机侧轴承保持架故障
    fault59: 'Poor meshing of high speed gear',//高速级大小齿轮啮合不良
    fault510: 'Poor meshing of intermediate gear',//中间级小齿轮啮合不良
    fault511: 'High speed gear misalignment(partial load)',//高速级齿轮不对中（偏载）
    fault512: 'coupling misalignment',//联轴器不对中
    fault513: 'Gearbox output shaft bearing race',//齿轮箱输出轴轴承跑圈
    fault514: 'Bearing Looseness of Gearbox Output Shaft',//齿轮箱输出轴轴承松动
    fault61: 'The Outer Ring of Front Bearing of Generator',//发电机前轴承外圈故
    fault62: 'Internal ring fault of generator front bearing',//发电机前轴承内圈故障
    fault63: 'Rolling element failure of generator front bearing',//发电机前轴承滚动体故障
    fault64: 'Fault of generator front bearing cage',//发电机前轴承保持架故障
    fault65: 'Runner of generator front bearing',//发电机前轴承跑圈
    fault66: 'Looseness of generator front bearing',//发电机前轴承松动
    fault71: 'Outer ring fault of generator rear bearing',//发电机后轴承外圈故障
    fault72: 'Fault of Inner Ring of Generator Back Bearing',//发电机后轴承内圈故障
    fault73: 'Roller failure of generator rear bearing',//发电机后轴承滚动体故障
    fault74: 'Fault of generator rear bearing cage',//发电机后轴承保持架故障
    fault75: 'Generator rear bearing race',//发电机后轴承跑圈
    fault76: 'Loosening of generator rear bearing',//发电机后轴承松动
  },
  // 波形频谱图
  wave: {
    AnalogSpeed: 'Is Analog Speed Enabled',//是否启用模拟转速
    referenceSpeed: 'reference speed',//基准转速
    AddFrequency: 'Add frequency',//添加频率
    LabelingFrequency: 'Labeling frequency',//标注频率
    unnmark: 'unnmark',//清除标注
    shutDown: 'shut down',//关闭
    spectrumDiagram: 'Open the spectrum diagram',//开启频谱图
    rank: 'rank',//阶次
    SavePic: 'Save pictures',//保存图片
    addWave: 'Add contrast waveform',//加入对比波形
    LayoutSwitch: 'Layout switching',//布局切换
    OpenTrend: 'Opening trend',//开启趋势
    CloseTrend: 'Close trend',//关闭趋势
    noWaveData: 'No waveform data at present',// 当前没有波形数据
    selectFrequency: 'select the fault frequency',//请选择故障频率
    HighWaveform: 'High density waveform',//高密度波形
    LowWaveform: 'Low-density waveform',//低密度波形
    Waveform: 'Waveform',//波形图
    Audio: 'Audio',//音频
    spectrogram: 'spectrogram',//频谱图
    switchOrderNo1: 'The speed is 0, the switch to the order function is not available!',//转速为0，切换为阶比功能不可用！
    switchOrderNo2: 'It is already an order ratio, and the switch to order ratio function is not available!',//已为阶比，切换为阶比功能不可用！
    LowOrderFilter: 'Low-order filtering',//低阶次过滤
    effecFreqBand: 'effective frequency band',//有效频段
    effecOrderRank: 'effective order rank',//有效阶次
    effectFreqError: 'The effective frequency input is incorrect！',//有效频率输入不正确
    noLowWaveData: 'There is no low-density waveform at the current measuring point!',//当前测点无低密度波形！
    EffectFreqFilter: 'Effective frequency filtering',//有效频率过滤
    freq: 'frequency',//频率
    freq1: 'frequency',//频
    EffectOrderFilter: 'Effective order filtering',//有效阶次过滤
    MoveOrder: 'Moving order',//动阶次
  },
  // 故障频率
  waveFault: {
    BPFO: 'BPFO',//外环通过
    BPFI: 'BPFI',//内环通过
    BPF: 'BPF',//通过频率
  },
  //三维频谱图
  wave3d: {
    time: 'time',//时间
    leftView: 'left view',//左视图
    CurrentFreq: 'Current frequency',//当前频率
    CancelHanning: 'Cancel the Hanning window',//取消汉宁窗
  },
  // 轨道波磨地图
  railCorrugation: {
    goodCondition: 'The track is in good condition and no faults',//轨道状况良好，无故障
    ManualGrindSample: 'Manual grinding sampling',//手动波磨采样
    PolishData: 'Polishing data',//波磨数据
    NoSiteInfo: 'No site information',//无站点信息
    direction: 'direction',//方向
    site: 'site',//站点
    rail: 'rail',//轨道
    corrugationInterval: 'corrugation interval',//波磨区间
    maxCrest: 'maximum crest',//最大峰值
    MaxEffectValue: 'Maximum effective value',//最大有效值
    upRail: 'Uplink rail',//上行轨道
    downRail: 'Down rail',//下行轨道
    upstroke: 'upstroke',//上行
    downstream: 'downstream',//下行
    leftTrack: 'left track',//左轨
    rightTrack: 'Right track',//右轨
    missLocInfo: 'Missing installation location information',//缺少安装位置信息
    missCarSet: 'Missing carriage settings',//缺少车厢设置
    missCarNumSet: 'Missing car number setting',//缺少车厢号设置
    sampSentSuccess: 'Sampling command sent successfully',//采样命令发送成功
  },
  // 轨道波磨图
  tmsTrend: {
    DataList: 'Data list',//数据列表

  }
}
