export const en = {
   //公共字段
   Common:{
      noPosText: 'No Position Data',//无测点
      noDataText: 'No Data',//无数据
      noRealData: 'No real data',//无实时数据
      noDiagText: 'No diagnosis result',//暂无诊断结果
      noChartTips: 'No Such Kind of Chart',//该类型测点没有此图谱
      collectTips:'Collection failed',//收藏失败
      quitCollectTips: 'Failed to unfavorite',//取消收藏失败
      failTips:'failed',//操作失败
      offlineText:'Offline',//报警状态离线
      normalText:'Normal',//报警状态正常
      warnText:'Warning',//报警状态预警
      alarmText:'Alarm',//报警状态报警
      focausText:'Focus',//关注
      allText:'All',//全部
      chainText:'Drive chain',//传动链
      moreText:'more',//详情
      noFocusMacTips: 'No focused data',//无重点关注机组
   },
   //登录页
   Login:{
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
        normaltitle:'Intelligent data diagnosis platform',
   },
   //风电总貌图
   FdGeneral:{
       searchHolder: 'search the machine name',
       statusText: 'status',
       speedText: 'speed',
   },
   //风电重点关注
   FdFocus:{
      filterText:'Filter',
      macTitle:'Machine',
      searchMacText: 'search machine',
      posTitle:'Position',
      searchPosText: 'search position',
      valTitle:'Eigenvalues',
      searchValText: 'search eigenvalues',
      numTitle: 'Quantity',
      sureText:'Ok',
      statusText: 'status',
      speedText: 'speed',
      noDataText: 'No data',
   },
   //风电模型2d
   FdModel:{
      btn3dText:'3D Mode',
      locName1:'drive chain',//部位名称传动链
      locName2:'tower',//部位名称塔筒
      locName3:'bolt',//部位名称螺栓
      locName4:'impeller',//部位名称叶轮
      locName5:'oil',//部位名称油液
      locName6: 'anchor bolt',//部位名称锚栓
      locName7: 'base',//部位名称基础
      diagnosisText: 'intelligent diagnosis',//诊断结果标签
      diagnosisTitle: 'drive chain',//诊断结果传动链名称
   },
   //风电模型3d
   WindModel:{
      btn2dText:'2D Mode',//切换到2d模式的按钮
      btnStopText: 'Rotate Or Not',//风机启停按钮
      btnPerspective: 'Perspective effect',//风机透视效果
      btnPhysical:'Fan appearance',//风机外观效果
      detectPart: 'Detect part',//检测部件
      healthValue: 'Health value'//健康值
   },
   //风电模型-传动链
   DriveChain:{
      mainBearing:'Main Bearing',//主轴承
      moreText:'more',//详情
      digitalTwin:'Digital Twin',//数字孪生
      resetBtn:'Reset',//重置
      gearBox:'Gearbox',//齿轮箱
      generator:'Generator',//发电机
      public:'Public',//公共
   },
   //风电模型-锚栓
   Anchorbolt:{
      base:'Base',//基础
      moreText:'more',//详情
      anchorBoltModel:'Anchor bolt model',//锚栓模型
   },
   //风电模型-基础
   Basics:{
     base:'Base',//基础
     moreText:'more',//详情
   },
   //风电模型-螺栓
   Bolt:{
      boltModel:'Bolt Model',//螺栓模型
      moreText:'more',//详情
   },
   //风电模型-叶轮
   Impeller:{
      public:'Public',//公共
      moreText:'more',//详情
   },
   //风电模型-油液
   Oil:{
      public:'Public',//公共
      moreText:'more',//详情
   },
   //风电模型-塔筒
   Towerdrum:{
      moreText:'more',//详情
   },
   //轨交总貌图
   GjGeneral:{
      searchHolder: 'search...',//搜索的提示语
   },
   //轨交重点关注
   GjFocus:{
      filterText:'Filter',
      macTitle:'Machine',
      searchMacText: 'search machine',
      posTitle:'Position',
      searchPosText: 'search position',
      valTitle:'Eigenvalues',
      searchValText: 'search eigenvalues',
      numTitle: 'Quantity',
      sureText:'Ok',
   },
   //轨交设备模型
   GjModel:{
      offlineText:'offline',//报警状态离线
      normalText:'normal',//报警状态正常
      warnText:'warning',//报警状态预警
      alarm1Text:'Level 1 alarm',//报警状态Ⅰ级报警
      alarm2Text:'Level 2 alarm',//报警状态Ⅱ级报警
   },
   //轨交设备详情
   GjModelInfo:{
      runningBtn:'Vehicle Running Gear',//走行部按钮文字
      runningTitle:'Vehicle Running Gear Model',//走行部模型图标题文字
      headChname:'Channel Name',//表头通道名称
      headLoc:'Location',//表头安装位置
      headVibAlarm:'Vibration Alarm Type',//表头振动报警类型
      headTempAlarm:'Temperature Alarm Type',//表头温度报警类型
      headAdvice:'Repair Advices',//表头维修建议
      offlineText:'offline',//报警状态离线
      normalText:'normal',//报警状态正常
      warnText:'warning',//报警状态预警
      alarm1Text:'Level 1 alarm',//报警状态Ⅰ级报警
      alarm2Text:'Level 2 alarm',//报警状态Ⅱ级报警
      offlineAdvice:'Device is offline',//设备离线的建议文字
      normalAdvice:'Operating normally',//设备正常的建议文字
      warnAdvice:'If the fault cannot be eliminated, it is recommended to return to the warehouse after the operation of the day is ended',//设备预警的建议文字
      alarm1Advice:'If the fault cannot be eliminated, it is recommended to exit the operation after the end of the operation',//设备Ⅰ级报警的建议文字
      alarm2Advice:'If the fault cannot be eliminated, it is recommended to quit operation after clearing the passengers at the next stop',//设备Ⅱ级报警的建议文字
   },
   //油田总貌图
   YtGeneral:{
      IDText:'ID',//通讯ID
      statusText:'Status',//运行状态
      alarmText:'Alarm',//报警状态
   },
   //油田重点关注
   YtFocus:{
      filterText:'Filter',//过滤
      macTitle:'Machine',//机组
      searchMacText: 'search machine',//搜索机组
      posTitle:'Position',//测点
      searchPosText: 'search position',//搜索测点
      valTitle:'Eigenvalues',//特征值
      searchValText: 'search eigenvalues',//搜索特征值
      numTitle: 'Quantity',//数量
      sureText:'Ok',//确定
      IDText:'ID',//通讯ID
      statusText:'Status',//运行状态
      alarmText:'Alarm',//报警状态
      collectTips:'Collection failed',//收藏失败
      allText:'all',//全部
      offlineText:'Offline',//报警状态离线
      normalText:'Normal',//报警状态正常
      warnText:'Warning',//报警状态预警
      alarmText:'Alarm',//报警状态报警
      runStatus1:'Disconnect',//未接入
      runStatus2:'Running',//运行
      runStatus3:'Stop',//停机
      filterError:'Incorrect filtering data',//筛选数据弹窗提示语：有误
      filterNoData:'No data',//筛选数据弹窗提示语：筛选无数据
   },
   //油田设备模型
   YtModel:{
      macModel:'Model',//设备模型
      punchCard:'Current Card',//电流卡片
      analysis:'Analysis',//沉没度分析
   },
   //油田设备模型详情
   YtMechineModel:{
      tableTitle1:'Record',//运行记录
      tableTitle2:'Frequency Converter',//变频器
      tableTitle3:'Transformer',//变压器
      tableTitle4:'Motor',//井下电机
      tableTitle5:'Power Consumption',//系统功耗
      tableTitle6:'Sensor',//井下传感器
      runStatus:'Disconnect',//未接入
   },
   //油田电流卡片
   YtPunchCard:{
      filterBtn: 'Filter Data',//数据检索
      noPosText: 'No Position Data',//无测点
      noDataText: 'No Data',//无数据
      dayCard: 'Day Card',//天卡
      weekCard: 'Week Card',//周卡
      monthCard: 'Month Card',//月卡
      toolTipWord1: 'current',//电流
      toolTipWord2: 'time',//时间
   },
   //油田沉没度分析
   YtAnalyse:{
       tableTitle1:'Process Volume Position',//工艺量测点
       tableTitle2:'Sinking Trend Chart',//沉没度趋势
       tableTitle3:'Oilfield Model',//油田模型
       moreText:'more',//详情
       sersorDepth: 'Sensor vertical depth',//传感器垂深
       curValue: 'value',//当前值
       warnValue: 'warning value',//预警值
       alarmValue: 'alarm value',//报警值
       time:'time',//时间
       sinkVal:'sink value',//沉没度
       
   },
   //工业设备重点关注
   SnFocus:{
      macStatus:'Status',//设备状态
      macSpeed:'Speed',//设备实时转速
      macCon:'Situation',//设备近况
      diagTime: 'Time',//诊断时间
      diagResult: 'Result',//诊断结果
      noFocusMacTips: 'No focused data',//无重点关注机组
   },
   //工业设备设备模型
   SnModel:{
      titleBtn1:'Model',//设备模型
      titleBtn2:'Position',//测点列表
      titleBtn3:'Oil params',//油液参数
      titleBtn4:'Angle of Dip',//倾角
   },
   //工业设备倾角
   Towerdrum:{
      angle:'Angle of Dip',//倾角
      sink:'Sink',//沉降
   },
   //通用设备模型详情-传动链
   TyVib:{
      tableTitle1:'Position list',//测点列表
      tableTitle2:'Drive chain',//数字孪生
  }
}
