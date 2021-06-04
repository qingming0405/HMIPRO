<!-- 诊断报告 -->
<template>
  <div class="my-report-content select-none">
    <div class="my-report-title">诊断分析报告</div>
    <div class="my-report-analysis" v-show="isShowReport">
      <message-box v-for="(item, key) in reportData" :key="key" :message="item" class="report-message-box" :class="'meaasge-box-' + key">
        <!-- 操作区 -->
        <span slot="operate" v-if="key === 'analysis'" class="operate" @click.stop="viewImages()">
          <i class="iconfont icon-jietu_huaban1" @mousedown.stop></i>
        </span>
        <span slot="operate" v-else-if="currentModelType === '1' && key === 'conclusion'" class="operate" @click.stop="showAppendix">
          <u>机组附录</u>
        </span>
        <!-- 内容区 -->
        <fault-level slot="content" v-if="key === 'faultLevel'" :modelType="currentModelType" :faultLevel="item.val" />
      </message-box>
    </div>
    <div class="my-report-btn" v-show="isShowReport">
      <button @click="screenshot">截图</button>
      <button @click="saveReport(0)">保存</button>
      <button @click="reportInfo">导出</button>
    </div>
    <div v-show="!isShowReport" class="none-report-msg">请选择机组</div>
    <!-- 编辑图片名称 -->
    <image-name :isShow="isShowImgName" :currImgName="currImgName" @close-image-name="closeImgName"/>
    <!-- 查看截图 -->
    <view-images
      :isShow="isShowViewImages"
      :images="images"
      @close-image-pop="closeImagePop"
    />
    <appendix :isShow="isShowAppendix" :appendixMsg="appendixMsg" @close-appendix="closeAppendix"/>
    <!-- 导出配置页面 -->
    <export-config
      :isShow="isShowExportConfig"
      :exportMsg="exportMsg"
      @close-report-pop="closeReportPop"
    />
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
// import html2canvas from 'html2canvas';
import html2canvas from "@/assets/js/html2canvas.js";
import { cloneObj, initStringVal } from "utils/utils.js";
import FaultLevel from "./childComps/FaultLevel.vue";
import ViewImages from "./childComps/ViewImages.vue";
import {
  initReportData,
  initExportMsg,
  imageType,
  imageName,
  getBlobBydataURI,
  getMacNum,
  localExportMsg,
  remoteEvaluate,
} from "./report.js";
import ExportConfig from "./childComps/ExportConfig.vue";
import MessageBox from './childComps/MessageBox.vue';
import Appendix from './childComps/Appendix.vue';
import ImageName from './childComps/ImageName.vue';

export default {
  name: "MyReport",
  components: {
    FaultLevel,
    ViewImages,
    ExportConfig,
    MessageBox,
    Appendix,
    ImageName
  },
  data() {
    return {
      isShowReport: false,
      reportId: 0,
      reportTime: 0,
      currentTId: "",
      currentMacId: "",
      currentMacName: "",
      currentModelType: "0", //当前报告类型
      reportData: initReportData('0'),
      isShowImgName: false,
      currImgName: '', // 当前截图名称
      currReportMsg: {}, // 当前信息
      currScreenEl: null, // 当前截图dom
      isShowViewImages: false,
      images: [
        /* {img_name: "图片01", img_url: require("D:/图片/background/01.jpg")},
            {img_name: "图片02", img_url: require("D:/图片/background/02.jpg")},
            {img_name: "图片03", img_url: require("D:/图片/background/03.jpg")},
            {img_name: "图片04", img_url: require("D:/图片/background/04.jpg")},
            {img_name: "图片05", img_url: require("D:/图片/background/05.jpg")},
            {img_name: "图片06", img_url: require("D:/图片/background/06.jpg")},
            {img_name: "图片07", img_url: require("D:/图片/background/07.jpg")},
            {img_name: "图片08", img_url: require("D:/图片/background/08.jpg")},
            {img_name: "图片09", img_url: require("D:/图片/background/09.jpg")}, */
      ],
      isShowAppendix: false,
      appendixMsg: {
        macNum: '', //机组编号
        dataObj: {}, //机组附录信息
        vib_data: '', //获取到的原始数据
      },
      isShowExportConfig: false,
      exportMsg: initExportMsg('0'),
      srcEvaluate: {}, //原始评估标准，用于数据转换
    };
  },
  computed: {},
  created() {
    this.$bus.$on("reportChange", this.reportChange);
  },
  mounted() {},
  watch: {
    "$store.state.reportMsg.mac": {
      handler(newVal, oldVal) {
        if (oldVal) {
          if (newVal == null || oldVal.mac_id != newVal.mac_id) {
            this.saveReport(1);
          }
        }
        if (newVal) {
          if (oldVal != null && oldVal.mac_id === newVal.mac_id) {
            return;
          }
          //获取机组详细分析
          this.isShowReport = true;
          this.currentTId = this.$store.state.reportMsg.tree.t_id;
          this.currentMacId = newVal.mac_id;
          this.currentMacName = newVal.m_me
          this.queryMacReportInfo({
            tree_id: this.currentTId,
            id: this.currentMacId,
          });
        } else {
          this.isShowReport = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    reportChange() {
      this.currentTId = this.$store.state.reportMsg.tree.t_id;
      this.currentMacId = this.$store.state.reportMsg.mac.mac_id;
      this.queryMacReportInfo({
        tree_id: this.currentTId,
        id: this.currentMacId,
      });
    },
    //获取机组报告信息
    queryMacReportInfo(data) {
      this.$getApi.queryMacReportInfo(data).then((res) => {
        if (res) {
          if(res.modelType === null || typeof(res.modelType) === 'undefined') {
            this.currentModelType = '0'
          }
          else {
            this.currentModelType = res.modelType.toString()  
          }
          this.reportData = initReportData(this.currentModelType)
          this.exportMsg = initExportMsg(this.currentModelType)
          if (res.data == null) {
            Object.assign(this.$data, this.$options.data());
            this.isShowReport = true;
            this.currentTId = this.$store.state.reportMsg.tree.t_id;
            this.currentMacId = this.$store.state.reportMsg.mac.mac_id;
          } else {
            //机组详细分析内容更新
            const data = res.data;
            this.reportId = data.id;
            this.reportTime = data.time;
            this.reportData.faultLevel.val = this.localFaultLevel(
              data.failure_level
            );
            this.reportData.analysis.val = this.jsonArrToString(data.analysis);
            this.reportData.conclusion.val = this.jsonArrToString(data.conclusion);
            
            this.reportData.remarks.val = initStringVal(data.remarks);
            if(this.currentModelType === '0'){
              this.reportData.trendCompare.val = initStringVal(
                data.trend_compare
              );
              this.reportData.advice.val = this.jsonArrToString(data.advice);
            }
            else if(this.currentModelType === '1'){
              this.reportData.advice.val = initStringVal(data.advice);
              this.appendixMsg = {
                macNum: getMacNum(this.currentMacName),
                vib_data: data.vib_data,
                dataObj: this.jsonStrToObj(data.vib_data)
              }
            }
          }
        }
      });
    },
    //故障等级
    localFaultLevel(failure_level) {
      const data = JSON.parse(failure_level);
      let i = 0;
      const vals = [];
      for (let key in data) {
        vals.push({
          title: key,
          val: this.faultVal(data[key]),
          alarmType: data[key],
        });
      }
      return vals;
    },
    remoteFaultLevel() {
      const failure_level = {};
      for (let item of this.reportData.faultLevel.val) {
        failure_level[item.title] = item.alarmType;
      }
      return JSON.stringify(failure_level);
    },
    macFaultLevel() {
      let level = 0;
      for (let item of this.reportData.faultLevel.val) {
        if (item.alarmType < 255 && item.alarmType > level) {
          level = item.alarmType;
        }
      }
      return level;
    },
    //故障等级描述
    faultVal(alarmType) {
      switch (alarmType) {
        case 0:
          return "正常";
        case 1:
          return "注意";
        case 2:
          return "警告";
        case 3:
          return "报警";
        case 4:
          return "危险";
        default:
          return "-";
      }
    },
    // 查看截图
    viewImages() {
      this.isShowViewImages = true;
      const param = { id: this.currentMacId, time: this.reportTime };
      this.$getApi.getAllImgByMacId(param).then((res) => {
        if (res) {
          this.delImgKey = [];
          if (res.imgs == null || res.imgs.length === 0) {
            this.images = [];
          } else {
            this.images = res.imgs
          }
        }
      });
    },
    // 关闭查看截图
    closeImagePop(params) {
      const { type, deletelist } = params;
      this.isShowViewImages = false;
      if (type === 1) {
        const param = {
          id: this.reportId,
          time: this.reportTime,
          deletelist,
          updatelist: JSON.stringify(this.images),
        };
        this.$getApi.updateReportImgs(param).then((res) => {
          if (res) {
            this.$pop("保存成功");
          }
        });
      }
    },
    // 截图之前可编辑图片名称
    modifyImgName(imgName) {
      this.isShowImgName = true
      this.currImgName = imgName
    },
    // 关闭图片编辑
    closeImgName(params) {
      this.isShowImgName = false
      const {type, imgName}  = params
      if(type === 1) {
        this.currReportMsg.img_name = imgName
        this.screenImg(this.currScreenEl, this.currReportMsg)
      }
    },
    // 截图: 处理相关信息
    screenshot() {
      if (this.reportTime === 0) {
        this.$pop("当前没有报告");
        return;
      }
      const chartArr = [
        "wave",
        "trend",
        "wave3d",
        "dip1",
        "dip2",
        "overturn",
        "circle",
        "compare",
        "spectrum",
        "scatter",
      ];
      const { key, name, type } = this.$store.state.chooseTitle;
      let [chartType, entry, mac_id, pos_id, pos_type] = key.split("_");
      const mac = this.$store.state.reportMsg.mac; //当前正在操作的机组
      const checkMsg = this.$store.state.checkMsg;
      if (checkMsg.pos == null) {
        this.$pop("请选择测点");
        return;
      }
      if (typeof mac_id === "undefined") {
        mac_id = mac.mac_id;
      }
      if (typeof pos_type === "undefined") {
        pos_type = checkMsg.pos.position_type;
        pos_id = checkMsg.pos.position_id;
      }
      if (mac.mac_id != mac_id) {
        this.$pop("图谱与编辑的机组不对应");
        return;
      }
      const pos = this.getPos(mac_id, pos_type, pos_id)
      const reportMsg = {
        //选中图谱的信息
        key,
        name,
        chartType,
        entry,
        mac_id,
        pos_id,
        pos_type,
        ch_type: pos.channel_type,
        ch_id: pos.channel_id,
        pos_class: pos.units.pos_class
      };
      if (chartArr.includes(chartType)) {
        let el = document.getElementsByClassName("my-chart-table")[0];
        if (chartType === "wave" || chartType === "trend") {
          const component = this.$parent.$refs.chartTable.$refs.chartTable;
          el = document.getElementById("screen-" + component.currentKey);
          if(chartType === "wave") {
            reportMsg.waveMaximization = component.reportMsg[component.currentKey].waveMaximization;
          }
        }
        this.currScreenEl = el
        // 弹出名称编辑页面
        reportMsg.img_type = imageType(reportMsg);
        reportMsg.img_name = imageName(reportMsg.img_type, reportMsg.name)
        this.currReportMsg = reportMsg
        this.modifyImgName(reportMsg.img_name)
      }
    },
    // 获取测点
    getPos(mac_id, pos_type, pos_id){
      const posArr = this.$store.state.pos[mac_id]
      if(typeof posArr === 'undefined' || posArr === null || posArr.length === 0){
        return undefined
      }
      return posArr.find(item => {
        return item.machine_id == mac_id && item.position_type == pos_type && item.position_id == pos_id
      })
    },
    // 截图
    screenImg(el, reportMsg) {
      this.$store.state.reportMsg.loadingReport = true;
      html2canvas(el, {
          backgroundColor: "#fff",
          useCORS: true,
          scale: 1,
        }).then((canvas) => {
          this.$store.state.reportMsg.loadingReport = false;
          const imageData = canvas.toDataURL("image/png", 1);
          this.addMacReportImg(imageData, reportMsg);
        });
    },
    //上传截图
    addMacReportImg(imageData, reportMsg) {
      const blobFile = getBlobBydataURI(imageData, "image/png");
      const myform = new FormData();
      myform.append("file", blobFile);
      myform.append(
        "json",
        JSON.stringify({
          id: reportMsg.mac_id,
          pos_type: reportMsg.pos_type,
          pos_id: reportMsg.pos_id,
          ch_type: reportMsg.ch_type,
          ch_id: reportMsg.ch_id,
          pos_class: reportMsg.pos_class,
          report_time: this.reportTime,
          img_type: reportMsg.img_type + "",
          img_name: reportMsg.img_name + ".png",
        })
      );
      this.$getApi.addMacReportImg(myform).then((res) => {
        this.$store.state.reportMsg.loadingReport = false;
        if (res) {
          this.$pop("截图成功");
        }
      });
    },
    //显示机组附录
    showAppendix() {
      this.isShowAppendix = true
    },
    // 关闭机组附录
    closeAppendix(params) {
      const {type, dataObj} = params
      if(type === 1){
        this.appendixMsg.vib_data = JSON.stringify(dataObj)
      }
      else {
        this.appendixMsg.dataObj = this.jsonStrToObj(this.appendixMsg.vib_data)
      }
      this.isShowAppendix = false
    },
    // 保存报告
    saveReport(type) {
      if (this.reportTime === 0) {
        if (type === 0) {
          this.$pop("当前没有报告");
        }
        return;
      }
      const param = {
        id: this.reportId,
        machine_id: this.currentMacId,
        time: this.reportTime,
        tree_id: this.currentTId,
        name: "",
        failure_level: this.remoteFaultLevel(),
        status: this.macFaultLevel(),
        analysis: this.stringToJsonArr(this.reportData.analysis.val),
        conclusion: this.stringToJsonArr(this.reportData.conclusion.val),
        remarks: this.reportData.remarks.val,
      };
      if(this.currentModelType === '1'){
        param.advice = this.reportData.advice.val
        param.vib_data = this.appendixMsg.vib_data
      }
      else{
        param.trend_compare = this.reportData.trendCompare.val
        param.advice = this.stringToJsonArr(this.reportData.advice.val)
      }
      this.$getApi.tempStorageMacReport(param).then((res) => {
        if (type == 0 && res) {
          this.$pop("保存成功");
        }
      });
    },
    //详细分析、诊断结论、处理建议
    jsonArrToString(jsonArr) {
      if(jsonArr === null || jsonArr === '' || typeof(jsonArr) === 'undefined'){
        return ''
      }
      const arr = JSON.parse(jsonArr);
      return arr.join("\n");
    },
    stringToJsonArr(str) {
      const arr = str.split("\n");
      return JSON.stringify(arr);
    },
    jsonStrToObj(jsonObj) {
      if(jsonObj === null || typeof(jsonObj) === 'undefined' || jsonObj === ''){
        return {}
      }
      return JSON.parse(jsonObj)
    },
    // 组织报告信息
    reportInfo() {
      if (this.reportTime === 0) {
        this.$pop("当前没有报告");
        return;
      }
      this.saveReport(1);
      const param = { t_id: this.currentTId };
      this.$getApi.getReportTreeInfo(param).then((res) => {
        if (res) {
          if (res.report == null) {
            this.$pop("当前没有报告");
            return;
          }
          this.isShowExportConfig = true;
          let t_name = this.$store.state.reportMsg.tree.t_name;
          if(this.currentModelType === '0'){
            this.srcEvaluate = JSON.parse(initStringVal(res.report.evaluate));
          }
          this.exportMsg = localExportMsg(
            initExportMsg(this.currentModelType),
            res,
            t_name,
            this.srcEvaluate
          );
        }
      });
    },
    // 关闭导出弹窗
    closeReportPop({ type, exportMsg }) {
      if (type === 0) {
        this.isShowExportConfig = false;
        return;
      }
      this.exportMsg = exportMsg;
      const param = {
        model_type: this.currentModelType,
        treeId: this.currentTId,
        time: this.reportTime,
        name: exportMsg.base.reportName.val,
        report_date: exportMsg.base.reportDate.val,
        summary: exportMsg.base.summary.val,
      };
      if(this.currentModelType === '1'){
        param.macModel = exportMsg.base.macModel.val
        param.documentNo = exportMsg.base.documentNo.val
        param.revision = exportMsg.base.revision.val
        param.classification = exportMsg.base.classification.key
        param.mac_config = JSON.stringify(exportMsg.macConfig)
      }
      else{
        param.compiling = exportMsg.base.compiling.val
        param.examine = exportMsg.base.examine.val
        param.approval = exportMsg.base.approval.val
        param.unit = exportMsg.base.unit.val
        param.startTime = exportMsg.base.startTime.val
        param.endTime = exportMsg.base.endTime.val
        param.evaluate = remoteEvaluate(this.srcEvaluate, this.exportMsg.evaluate)
      }
      if (type === 1) {
        param.template_name = this.exportMsg.base.reportName.val + this.exportMsg.base.reportDate.val;
        param.report_name = exportMsg.base.reportName.val;
        this.isShowExportConfig = false;
        this.$store.state.reportMsg.loadingReport = true;
        this.$getApi.saveReportToTemplate(param).then((res) => {
          this.$store.state.reportMsg.loadingReport = false;
          this.isShowExportConfig = true;
          if (res) {
            this.$pop("保存成功");
          }
        });
      } else if (type == 2) {
        this.isShowExportConfig = false;
        this.$store.state.reportMsg.loadingReport = true;
        this.$getApi.exportReport(param).then((res) => {
          this.$store.state.reportMsg.loadingReport = false;
          if (res) {
            window.location = res.url;
          } else {
            this.$pop("导出失败");
            this.isShowExportConfig = true;
          }
        });
      }
    },
  },
};
</script>

<style scoped lang='scss'>
.my-report-content {
  overflow: hidden;
  width: calc(100% - 10px);
  height: calc(100vh - 115px);
  padding: 5px 10px;
  .my-report-title {
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
  }
  .my-report-analysis {
    display: flex;
    flex-direction: column;
    height: calc(100% - 60px);
    margin: 5px auto;

    font-size: 12px;
    .report-message-box:not(.meaasge-box-faultLevel) {
      flex: 1 1 auto;
      .title{
        .operate {
          color: #6c92de;
          cursor: pointer;
          position: absolute;
          right: 5px;
        }
      }
    }
    .meaasge-box-analysis {
      flex: 3 1 auto !important;
    }
  }
  .my-report-btn {
    // height: 30px;
    // line-height: 30px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    align-items: center;
    @media (min-height: 600px) and (max-height: 830px) {
      button {
        width: 50px;
        height: 20px;
        line-height: 20px;
      }
    }
    @media (min-height: 830px) and (max-height: 900px) {
      button {
        width: 50px;
        height: 24px;
        line-height: 24px;
      }
    }
    @media (min-height: 900px) {
      button {
        width: 50px;
        height: 28px;
        line-height: 28px;
      }
    }
  }
  .none-report-msg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
}
</style>
