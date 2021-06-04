import { cloneObj, initStringVal } from "utils/utils.js";

/////////////////////////////////////////////////////////数据开始///////////////////////////////////////////////////////////
//机组报告信息
export function initReportData(modelType) {
  if(modelType === '1'){
    // 明阳
    return {
      faultLevel: {
        title: "故障等级",
        val: [
          { title: "主轴承", val: "正常", alarmType: 0 },
          { title: "齿轮箱", val: "正常", alarmType: 0 },
          { title: "发电机", val: "正常", alarmType: 0 },
        ],
      },
      advice: {
        title: "运维&处理建议",
        val: "",
      },
      remarks: {
        title: "备注",
        val: "",
      },
      analysis: {
        title: "详细分析",
        val: "",
      },
      conclusion: {
        title: "附录异常超标说明",
        val: "",
      }
    }
  }
  else {
    //默认中自庆安
    return {
      faultLevel: {
        title: "故障等级",
        val: [
          { title: "主轴承", val: "正常", alarmType: 0 },
          { title: "齿轮箱", val: "正常", alarmType: 0 },
          { title: "发电机", val: "正常", alarmType: 0 },
        ],
      },
      trendCompare: {
        title: "与上次趋势对比",
        val: "",
      },
      analysis: {
        title: "详细分析",
        val: "",
      },
      conclusion: {
        title: "诊断结论",
        val: "",
      },
      advice: {
        title: "处理建议",
        val: "",
      },
      remarks: {
        title: "备注",
        val: "",
      }
    }
  }
}

export function initExportMsg(modelType) {
  if(modelType === '1'){
    // 明阳
    return {
      modelType,
      base: {
        reportName: {
          title: "项目名称",
          val: "",
        },
        reportDate: {
          title: "报告日期",
          val: "",
        },
        macModel: {
          title: '机组型号',
          val: '',
        },
        documentNo: {
          title: '文件号',
          val: '',
        },
        revision: {
          title: '版本',
          val: '',
        },
        classification: {
          title: '密级',
          val: '机密 Confidential',
          key: '3',
          options: getClassficationOptions()
        },
        summary: {
          title: "项目概述",
          val: "",
        }
      },
      macConfig: [
        { key: "机型", val: "MY1.5-89" }
      ], // 机组配置信息
    }
  }
  else{
    //中自庆安
    return {
      modelType,
      base: {
        reportName: {
          title: "报告名称",
          val: "",
        },
        startTime: {
          title: "开始时间",
          val: "",
        },
        endTime: {
          title: "结束时间",
          val: "",
        },
        reportDate: {
          title: "报告日期",
          val: "",
        },
        compiling: {
          title: "编制",
          val: "",
        },
        examine: {
          title: "校核",
          val: "",
        },
        approval: {
          title: "审核",
          val: "",
        },
        unit: {
          title: "振动单位",
          val: "g",
        },
        summary: {
          title: "项目概述",
          val: "",
        },
      },
      evaluate: [
        { type: '主轴', key: "主轴承1", val: "0.03/0.05" }
      ], //加速度评估
    }
  }
}

//故障类型表
export function getFaultLevels(group) {
  const src = [
    {
      icon: "",
      val: "正常",
      alarmType: 0,
      group: ["0", "1"]
    },
    {
      icon: "",
      val: "注意",
      alarmType: 1,
      group: ["0"]
    },
    {
      icon: "",
      val: "警告",
      alarmType: 2,
      group: ["0", "1"]
    },
    {
      icon: "",
      val: "报警",
      alarmType: 3,
      group: ["0", "1"]
    },
    {
      icon: "",
      val: "危险",
      alarmType: 4,
      group: ["0"]
    },
    {
      icon: "",
      val: "—",
      alarmType: 255,
      group: ["0", "1"]
    }
  ];
  return src.filter((item) => {
    return item.group.indexOf(group) >= 0
  })
}

function getClassficationOptions() {
  return [
    { key: '0', val: '公开 Published'},
    { key: '1', val: '内部 Internal'},
    { key: '2', val: '秘密 Secret'},
    { key: '3', val: '机密 Confidential'},
    { key: '4', val: '绝密 Strictly Confidential'}
  ]
}

function getClassficationLabel(key) {
  const options = getClassficationOptions()
  let index = options.findIndex(item => {
    return item.key == key
  })
  return options[index].val
}
/////////////////////////////////////////////////////////数据结束///////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////截图开始///////////////////////////////////////////////////////////
//图片类型
export function imageType(reportMsg) {
  switch (reportMsg.chartType) {
    case "trend":
      return 1;
    case "scatter":
      return 2;
    case "wave":
      if (reportMsg.pos_type == 4 || reportMsg.pos_type == 9) {
        return 8;
      } else if (reportMsg.waveMaximization == 1) {
        return 4;
      } else {
        return 3;
      }
    case "compare":
      return 5;
    case "wave3d":
      return 6;
    case "spectrum":
      return 7;
    case "dip1":
      return 9;
    case "dip2":
      return 10;
    case "overturn":
      return 11;
    case "circle":
      return 12;
  }
  return 0;
}
export function imageName(imageType, defaultName) {
  /* switch(imageType){
        case 1:
           return '趋势图'
        case 2:
           return '散点图'
        case 3:
           return '时域波形图'
        case 4:
           return '频谱图'
        case 5:
           return '对比分析图'
        case 6:
           return '三维频谱图'
        case 7:
           return '专家频谱图'
        case 8:
           return '包络谱图'
        case 9:
           return '倾角分布图'
        case 10:
           return '沉降轨迹图'
        case 11:
           return '机舱轨迹图'
        case 12:
           return '圆周图'
     } */

  switch (imageType) {
    case 3:
      return defaultName.replace("波形频谱图", "时域波形图");
    case 4:
      return defaultName.replace("波形频谱图", "频谱图");
    case 8:
      return defaultName.replace("波形频谱图", "包络谱图");
    default:
      return defaultName;
  }
}
//将base64转换成图片文件
export function getBlobBydataURI(dataURI, type) {
  const binary = atob(dataURI.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: type });
}
/////////////////////////////////////////////////////////截图结束///////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////查看截图开始///////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////查看截图结束///////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////机组附录开始///////////////////////////////////////////////////////////
export function getMacNum(macName){
  const reg = /[\u4e00-\u9fa5]/g
  return macName.replace(reg, '')
}

/////////////////////////////////////////////////////////机组附录结束///////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////导出报告配置开始///////////////////////////////////////////////////////////

export function localExportMsg(exportMsg, res, t_name, srcEvaluate){
  const report = res.report
  const obj = cloneObj(exportMsg)
  obj.base.reportName.val = initStringVal(report.name);
  obj.base.reportDate.val = initStringVal(report.report_date);
  if(exportMsg.modelType === '1'){
    if(report.datainfo !== null && typeof report.datainfo !== 'undefined'){
      let datainfo = JSON.parse(report.datainfo)      
      obj.base.macModel.val = localStringVal(obj.base.macModel.val, 'macModel', datainfo)
      obj.base.documentNo.val = localStringVal(obj.base.documentNo.val, 'documentNo', datainfo)
      obj.base.revision.val = localStringVal(obj.base.revision.val, 'revision', datainfo)
      obj.base.classification.key = localStringVal(obj.base.classification.key, 'classification', datainfo)
      obj.base.classification.val = getClassficationLabel(obj.base.classification.key)
      obj.base.summary.val = initStringVal(report.summary);
      obj.macConfig = localMacConfig(report.mac_config)
    }
  }
  else{
    if (obj.base.startTime.val === "") {
      obj.base.startTime.val = new Date().getTime() + "";
    }
    if (obj.base.endTime.val === "") {
      obj.base.endTime.val =
        new Date().getTime() + 3600 * 24 * 1000 + "";
    }
    obj.base.unit.val = initStringVal(report.unit);
    obj.base.compiling.val = initStringVal(report.compiling);
    obj.base.examine.val = initStringVal(report.examine);
    obj.base.approval.val = initStringVal(report.approval);
    obj.base.summary.val = localSummary( report.summary, t_name, res.total, res.subHealth, res.fault, res.warning )
    obj.evaluate = localEvaluate(srcEvaluate);
  }
  return obj
}

function localStringVal(oldVal, key, dataObj){
  if(dataObj.hasOwnProperty(key)){
    return initStringVal(dataObj[key])
  }
  else {
    return oldVal
  }
}

function localSummary(oldSummary, t_name, total, subHealth, fault, warning) {
  if(typeof(oldSummary) === 'string' && oldSummary.length>0) {
    return oldSummary
  }
  //如果没有内容则需要初始化
  let info = "";
  info +=
    t_name +
    "共有机组" +
    total +
    "台。项目每台机组配置一套在线状态监测系统，用于监控传动链部件运行情况，" +
    "根据 CS2000 在线监测系统测试数据分析，风场各机组运行总体平稳，本次分析结果显示：" +
    "该风场共有" +
    subHealth +
    "台机组处于注意状态，" +
    fault +
    "台机组处于警告状态，";
  if (warning != null && JSON.stringify(warning) != "{}") {
    info += "其中包括";
    for (let key in warning) {
      info += warning[key] + "台为" + key + "，";
    }
  }
  info += "详见正文。";
  return info;
}

//评估标准
function localEvaluate(srcEvaluate) {
  const evaluate = [];
  for (let key in srcEvaluate.alarmMap) {
    evaluate.push({
      key: key,
      val: srcEvaluate.alarmMap[key].value,
      type: srcEvaluate.alarmMap[key].type,
    });
  }
  return evaluate;
}

export function remoteEvaluate(srcEvaluate, evaluate) {
  const alarmMap = {};
  for (let item of evaluate) {
    if (item.key === "" || item.val === "" || item.type === "") {
      continue;
    }
    alarmMap[item.key] = { value: item.val, type: item.type };
  }
  srcEvaluate.alarmMap = alarmMap;
  return JSON.stringify(srcEvaluate);
}

// 机组配置
function localMacConfig(srcMacConfig) {
  if(typeof srcMacConfig === 'undefined' || srcMacConfig === null || srcMacConfig === ''){
    return [{ key: "机型", val: "MY1.5-89" }]
  }
  return JSON.parse(initStringVal(srcMacConfig))
}
/////////////////////////////////////////////////////////导出报告配置结束///////////////////////////////////////////////////////////