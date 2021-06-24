import decoratorRouter from "./request.js";
function getApi (router) {
  let request = decoratorRouter(router);
  return {
    // 波形频谱图、三维频谱图、圆周图
    getWaveformAndSpectrum (config) {
      //获取测点数据
      let args = {
        machineId: "", //机组ID
        positionId: "", //测点ID
        positionType: "", //测点类型
        isWave: false, //是否波形图
        isFFT: true, //是否频谱图
        isReal: 0, //历史数据
        isEnvelopeFFT: false, //是否需要包络图
        isRceps: false, //是否倒谱图
        isCZT: false, //是否需要细化图谱
        isRound: 0, // 是否是圆周图
        currTime: [], //end start开始结束时间
        lineNum: 20, //行数
        fromSpeed: null, //转速下区间
        toSpeed: null, //转速上区间
        type: 0,
        isFilterWave: false, //是否时域滤波
        filterLow: 0, //滤波低频
        filterHigh: 0, //滤波高频
        dataSource: 'c_vib',//8000数据类型
      };
      Object.assign(args, config);
      return request.post("getWaveformAndSpectrum", args);
    },
    //(历史，实时，预测)趋势图
    getTendency (config) {
      let args = {
        key: {}, //机组id+测点id+测点type:时间
        startTime: "", //开始时间
        endTime: "", //结束时间
        fromSpeed: null, //	转速下限，null：无下限
        toSpeed: null, //转速上限，null：无上限
        lowerLimit: null, //	限过滤,null：无下限
        upperLimit: null, //上限过滤，null：无上限
        isAlarm: 1, //是否需要报警
        value: "", //特征值字段
        code: "", //	字段对应icode
        isSave: 0, // 是否需要历史趋势图
        isReal: 0, // 是否需要实时数据
        isTrendPrediction: 0, //	是否需要趋势预测，默认为否，0：不需要；1：需要
        predictEndTime: null, //趋势预测结束时间
        alp: 0.2, //阈值参数， float.（设定范围 0<alp<1），默认为 0.2
        time: 0 // 实时数据去后台请求的时间，每次要刷新
      };
      Object.assign(args, config);
      return request.post("getTendency", args);
    },
    // 危险转速区间
    getSpeedDangerRange (config) {
      let args = {
        startTime: 0,
        endTime: 0,
        value1: "",
        code1: 0,
        value2: "",
        code2: 0,
        isSave: 1,
        isReal: 0,
        key: [],
        time: 0
      };
      /*  startTime	是	long		开始时间 ，时间定死，取一天
          endTime	是	long		结束时间，时间定死，取一天
          value1	是	String		转速特征值字段
          code1	是	int		转速字段对应code
          value2	是	String		倾覆值特征值字段
          code2	是	int		倾覆值字段对应code
          isSave	是	int		是否需要历史趋势图，0：不需要；1：需要
          isReal	是	int		是否需要实时数据，0：不需要；1：需要
          key	是	数组		机组id+测点id+测点type
          time	否	long	isReal为1时	当前时间戳 */
      Object.assign(args, config);
      return request.post("getSpeedDangerRange", args);
    },
    // 登录
    login (config) {
      return request.post("login", config);
    },
    // 统计列表
    getStatisticsList (config) {
      return request.post("getStatisticsList", config);
    },
    // 获取组织
    queryFoldersByTid (config) {
      return request.post("queryFoldersByTid", config);
    },
    // 获取机组
    queryAllMachineByTid (config) {
      return request.post("queryAllMachineByTid", config);
    },
    // 获取测点
    queryAllPositionsByMacId (config) {
      return request.post("queryAllPositionsByMacId", config);
    },
    // 获取用户自定义图标
    getCustomIconByUserId (config) {
      return request.post("getCustomIconByUserId", config);
    },
    // 设置用户自定义图标
    setCustomIconByUserId (config) {
      return request.post("setCustomIconByUserId", config);
    },
    // 退出登录
    logout () {
      const token = sessionStorage.getItem("token");
      return request.post("logout", token);
    },
    // 报警日志(组织、机组)
    getMacAlarmInfoByTidOrMacId (config) {
      return request.post("getMacAlarmInfoByTidOrMacId", config);
    },
    // 报警日志(测点报警)
    getPositionAlarmInfo (config) {
      return request.post("getPositionAlarmInfo", config);
    },
    // 历史数据、倾角分布图、沉降跟踪图
    getSaveData (config) {
      let args = {
        machineId: "", //机组ID
        positionId: "", //测点ID
        positionType: "", //测点类型
        startTime: 0, // 开始时间
        endTime: 0, // 结束时间
        fromSpeed: null, //转速下区间
        toSpeed: null, //转速上区间
        type: 0,
        page: null, // 当前页数
        pageNum: null // 每页数据数量
      };
      Object.assign(args, config);
      return request.post("getSaveData", args);
    },
    // 监测报表
    getMonitoringTabulated (config) {
      let args = {};
      Object.assign(args, config);
      return request.post("getMonitoringTabulated", config);
    },
    // 趋势图
    getPositionEigenvalue (config) {
      let args = {
        machineId: "", //机组ID
        positionId: "", //测点ID
        positionType: "", //测点类型
        startTime: 0, // 开始时间
        endTime: 0, // 结束时间
        fromSpeed: null, //转速下区间
        toSpeed: null, //转速上区间
        lowerLimit: null, // 下限
        upperLimit: null, // 上限
        value: "", // 特征值字段
        code: 0, // 特征值code
        type: 1, // 0: 所有数据, 1: 有波形数据
        isTrendPrediction: false, // 是否需要工况报警
        isAlarm: false // 是否需要报警
      };
      Object.assign(args, config);
      return request.post("getPositionEigenvalue", args);
    },
    // 实时数据
    getRealMap (config) {
      return request.post("getRealMap", config);
    },
    // 系统日志
    getServerMachineLog (config) {
      return request.post("getServerMachineLog", config);
    },
    // 获取故障频率
    getFailureFrequency (config) {
      return request.post("getFailureFrequency", config);
    },
    // 机舱轨迹图
    getCabinTrajectory (config) {
      return request.post("getCabinTrajectory", config);
    },
    // 获取服务器信息
    getServerInfo () {
      return request.post("getServerInfo");
    },
    // 获取设备维护记录信息
    getMaintenRecords (config) {
      return request.post("getMaintenRecords", config);
    },
    // 删除设备维护记录信息
    delMaintenRecords (config) {
      return request.post("delMaintenRecords", config);
    },
    // 新增设备维护记录信息
    insertMaintenRecord (config) {
      return request.post("insertMaintenRecord", config);
    },
    // 散点图数据
    getScatterDiagram (config) {
      return request.post("getScatterDiagram", config);
    },
    // 删除已下载文件
    deleteExportFile (config) {
      return request.post("deleteExportFile", config);
    },
    // 获取版本号
    getVersion () {
      return request.post("getVersion");
    },
    /* 获取实时数据汇总列表 */
    getFolderRealTimeList (config) {
      return request.post("getFolderRealTimeList", config);
    },
    /* 获取机泵总貌图 */
    queryPumpOverView (config) {
      return request.post("queryPumpOverView", config);
    },
    /* 获取水泥组织总貌图 */
    queryTreeOverviewByTId (config) {
      return request.post("queryTreeOverviewByTId", config);
    },
    /* 获取风电模型健康值 */
    queryMachineModelByMacId (config) {
      return request.post("queryMachineModelByMacId", config);
    },
    /* 获取传动链页面信息 */
    queryDriveChainByMacId (config) {
      return request.post("queryDriveChainByMacId", config);
    },
    /* 总貌图设备的收藏 */
    updateHmiFoucsStatus (config) {
      return request.post("updateHmiFoucsStatus", config);
    },
    /* 总貌图重点关注查询 */
    queryAllFocus (config) {
      return request.post("queryAllFocus", config);
    },
    // 更具多个机组获取去重后的测点名称
    searchPositionsByIds (config) {
      return request.post("searchPositionsByIds", config);
    },
    // 重点关注筛选
    filterMacByCondition (config) {
      return request.post("filterMacByCondition", config);
    },
    /* 获取轨交机组车厢信息 */
    queryPumpInfoByMacId (config) {
      return request.post("queryPumpInfoByMacId", config);
    },
    /* 获取轨交测点信息 */
    queryPumpChInfo (config) {
      return request.post("queryPumpChInfo", config);
    },
    /* 获取传动链信息 */
    queryDriveChainInfoByMachineId (config) {
      return request.post("queryDriveChainInfoByMachineId", config);
    },
    //获取锚栓测点信息
    queryAnchorByMacId (config) {
      return request.post("queryAnchorByMacId", config);
    },
    //获取基础测点信息
    queryBasicsByMacId (config) {
      return request.post("queryBasicsByMacId", config);
    },
    //获取油液测点信息
    queryOilByMacId (config) {
      return request.post("queryOilByMacId", config);
    },
    /* 获取螺栓页面信息 */
    queryBoltByMacId (config) {
      return request.post("queryBoltByMacId", config);
    },
    /* 获取叶轮页面信息 */
    queryImpellerByMacId (config) {
      return request.post("queryImpellerByMacId", config);
    },
    /* 获取塔筒页面信息 */
    queryTowerByMacId (config) {
      return request.post("queryTowerByMacId", config);
    },
    /* 获取所有报告模板 */
    getReportModels (config) {
      return request.post("getReportModels", config);
    },
    /* 删除报告模板 */
    delReportModel (config) {
      return request.post("delReportModel", config);
    },
    /* 读取报告模板,开启一份新的报告 */
    loadReportModel (config) {
      return request.post("loadReportModel", config);
    },
    /* 获取机组报告信息 */
    queryMacReportInfo (config) {
      return request.post("queryMacReportInfo", config);
    },
    /* 截图上传 */
    addMacReportImg (config) {
      return request.post("addMacReportImg", config);
    },
    /* 获取机组截图 */
    getAllImgByMacId (config) {
      return request.post("getAllImgByMacId", config);
    },
    /* 更新截图 */
    updateReportImgs (config) {
      return request.post("updateReportImgs", config);
    },
    /* 暂存报告 */
    tempStorageMacReport (config) {
      return request.post("tempStorageMacReport", config);
    },
    /* 获得报告组织信息接口 */
    getReportTreeInfo (config) {
      return request.post("getReportTreeInfo", config);
    },
    /* 将报告存为模板接口 */
    saveReportToTemplate (config) {
      return request.post("saveReportToTemplate", config);
    },
    /* 导出报告 */
    exportReport (config) {
      return request.post("exportReport", config);
    },
    /* 获取license */
    getLicense () {
      return request.post("getLicense");
    },
    //获取波形阶次
    getDegree (config) {
      return request.post("getDegree", config);
    },
    /* 根据机组id数组获取测点 */
    queryAllPosByMacIds (config) {
      return request.post("queryAllPosByMacIds", config);
    },
    /* 油田的模型 */
    getDeviceModelData (config) {
      return request.post("getDeviceModelData", config);
    },
    /* 轨道波磨获取站点信息 */
    getLineInfo (config) {
      return request.post("getLineInfo", config);
    },
    /* tms 三维频谱图 */
    getSpectrumChart (config) {
      return request.post("getSpectrumChart", config);
    },
    /* 轨道波磨获取站点报警信息 */
    getTrackCorrugationMap (config) {
      return request.post("getTrackCorrugationMap", config);
    },
    /* 波磨数据报警数据时间数据 */
    getTimeBatch (config) {
      return request.post("getTimeBatch", config);
    },
    /* 波磨数据趋势图 */
    getTrackCorrugationAnalysisChart (config) {
      return request.post("getTrackCorrugationAnalysisChart", config);
    },
    /* 沉没度分析 */
    getSubmergenceInfo (config) {
      return request.post("getSubmergenceInfo", config);
    },
    /* 沉没度分析趋势图 */
    getSubmergenceTendency (config) {
      return request.post("getSubmergenceTendency", config);
    },
    /* 电流卡片 */
    getCurrentCards (config) {
      return request.post("getCurrentCards", config);
    },
    /* HMI图谱配置接口 */
    getAtlasConfig (config) {
      return request.post("getAtlasConfig", config);
    },
    /* 水泥实时数据汇总列表点击按钮 */
    statusButtonClick (config) {
      return request.post("statusButtonClick", config);
    },
    /* 获得设备参数(油田) */
    getDeviceParameters (config) {
      return request.post("getDeviceParameters", config);
    },
    /* 删除设备参数(油田) */
    deleteDeviceParam (config) {
      return request.post("deleteDeviceParam", config);
    },
    /* 修改设备参数信息(油田) */
    insertAndUpdateDeviceParam (config) {
      return request.post("insertAndUpdateDeviceParam", config);
    },
    /* 远程中心获取所有现场数据信息 */
    getRemoteInfo (config) {
      return request.post("getRemoteInfo", config);
    },
    // 启停机索引信息
    getOnOffIndex (config) {
      return request.post("getOnOffIndex", config);
    },
    // 多频谱图
    getSpectrums (config) {
      return request.post("getSpectrums", config);
    },
    // 专家系统
    getExpertSystemInfo (config) {
      return request.post("getExpertSystemInfo", config);
    },
    // 轴心位置图
    getAxisLocation (config) {
      return request.post("getAxisLocation", config);
    },
    // 全频谱图接口
    getAllSpectrum (config) {
      return request.post("getAllSpectrum", config);
    },
    // 轴心轨迹图
    getAxisOrbit (config) {
      return request.post("getAxisOrbit", config);
    },
    // 级联图
    queryCascade (config) {
      return request.post("queryCascade", config);
    },
    // 极坐标图
    getPolarCoordinates (config) {
      return request.post("getPolarCoordinates", config);
    },
    queryAllAlarmPosition (config) {
      return request.post("queryAllAlarmPosition", config);
    },
    getReportTreeTemplateInfo (config) {
      return request.post("getReportTreeTemplateInfo", config);
    },
    queryFaultTypeByMacId (config) {
      return request.post("queryFaultTypeByMacId", config);
    },
    getCorrugationByClick (config) {
      return request.post("getCorrugationByClick", config);
    },
    // 获取踏面数据
    getALLTreadData (config) {
      return request.post("getALLTreadData", config);
    },
    // 保存踏面数据
    saveTreadData (config) {
      return request.post("saveTreadData", config);
    },
    // 计算踏面预测模型
    predictTreadData (config) {
      return request.post("predictTreadData", config);
    },
    // 计算踏面预测模型
    getALLTreadResult (config) {
      return request.post("getALLTreadResult", config);
    },
    queryAllPosByType (config) {
      return request.post("queryAllPosByType", config);
    },

  };
}

export default getApi;
