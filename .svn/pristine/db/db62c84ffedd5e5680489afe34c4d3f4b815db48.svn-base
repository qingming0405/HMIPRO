<template>
  <div class="pop-box-background" v-show="viewPop">
    <div class="pop-box radius box-shadow">
      <div class="pop-box-title" @mousedown="dragElem" @mouseup="dropElem">
        报告导出工具
        <span class="close-pop" @click.stop="closePop(0)">
          <i class="iconfont icon-cuohao"></i>
        </span>
      </div>
      <div class="pop-box-content">
        <ul class="report-list">
          <li v-for="(row, idx) in reportData" :key="idx">
            <div class="list-name radius">{{ row.title }}</div>
            <div
              class="radius default-border"
              @click="setList(row, idx, $event)"
              :title="row.val.label"
            >
              {{ row.val.label }}
              <i class="iconfont icon-zhongzi-zhankai"></i>
            </div>
          </li>
        </ul>
        <!-- 明阳配置 -->
        <mingyang-config v-show="currentModelType === '1'" :config="mingyang"/>
      </div>
      <div class="pop-box-button">
        <button class="pop-btn pop-btn-ok" @click="newReport()">新报告</button>
        <button class="pop-btn pop-btn-cancel" @click="closePop(0)">
          取消
        </button>
      </div>
    </div>
  </div>
</template> 

<script>
import popMixins from '../common/popMixins'
import { cloneObj, initStringVal } from "utils/utils.js"
import MingyangConfig from './mingyang/MingyangConfig'

export default {
  components: { MingyangConfig },
  data() {
    return {
      viewPop: false,
      promise: "",
      resolve: "",
      reject: "",
      treeId: -1,
      reportData: {
        modelType: {
          title: "模板类型",
          val: { label: "中自庆安通用模板", val: "0" },
        },
        modelSelect: {
          title: "模板选择",
          val: { label: "无模板", val: "0" },
        },
      }, //基础选项
      modelTypeList: [
        { val: "中自庆安通用模板", id: "0" },
        { val: "明阳智能报告模板", id: "1" },
      ], // 模板类型下拉列表
      modelSelectList: [], //模板下拉列表
      currentModelType: "0",
      mingyang: {
        startTime: '',
        endTime: '',
        fromSpeed: '1000',
        toSpeed: '1800',
        basis: [] // 诊断依据
      }
    };
  },
  mixins: [popMixins],
  mounted() {
    this.$bus.$on('list-delete-item', this.deleteModelSelect)
  },
  methods: {
    //显示窗口
    openPop() {
      this.initParams();
      this.viewPop = true;
      document.addEventListener("keydown", this.enter);
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      return this.promise;
    },
    // 初始化参数
    initParams() {
      this.initSearchTime()
      let tree = this.$store.state.reportMsg.tree;
      this.treeId = tree.t_id
      const treeMsg = {
        treeId: this.treeId
      };
      this.$getApi.getReportModels(treeMsg).then((res) => {
        if (res) {
          this.getReportModels(res);
        }
      });
    },
    // 默认查询日期为一个月
    initSearchTime() {
      const nowTime = new Date().getTime()
      this.mingyang.endTime = nowTime.toString()
      this.mingyang.startTime = (nowTime - 1000*3600*24*30).toString()
    },
    //获取报告模板列表
    getReportModels(data) {
      if (!data.hasOwnProperty("reportModels")) {
        this.modelSelectList = [];
      } else {
        this.modelSelectList = data.reportModels;
      }
    },
    /* 事件 */
    //下拉列表
    setList(row, idx, e) {
      let text = [];
      const size = e.currentTarget.getBoundingClientRect();
      const style = {
        maxHeight: "auto",
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height}px`,
      };
      switch (idx) {
        case "modelType":
          text = text.concat(this.modelTypeList);
          break;
        case "modelSelect":
          text = this.filterModelSelectList(
            this.reportData.modelType.val.val,
            this.modelSelectList
          );
          break;
      }
      this.$list({
        text,
        pattern: style,
      }).then((res) => {
        if (res.item !== null) {
          row.val.label = res.item.val;
          row.val.val = res.item.id;
          if (idx === "modelType") {
            this.currentModelType = res.item.id
            this.initModelSelect();
          }
          else if(idx === "modelSelect"){
            if(this.currentModelType === '1'){
              //明阳
              if(row.val.val === '0'){
                this.mingyang.basis = []
              }
              else{
                this.getModelInfo(this.treeId, row.val.val)
              }
            }
          }
        }
      });
    },
    // 模板列表过滤
    filterModelSelectList(modelType, source) {
      const arr = [{ val: "无模板", id: "0" }];
      for (let item of source) {
        if (item.model_type == modelType) {
          arr.push({ val: item.name, id: item.time, tag:'BeginReport', operate: "del" });
        }
      }
      return arr;
    },
    //初始化选择模板
    initModelSelect() {
      this.reportData.modelSelect.val.label = "无模板";
      this.reportData.modelSelect.val.val = "0";
    },
    // 获取模板信息
    getModelInfo(treeId, time) {
      const params = {
        treeId,
        time
      }
      this.$getApi.getReportTreeTemplateInfo(params).then((res) => {
        if (res && res.msg === 0 && res.data != null) {
          let datainfo 
          if(typeof res.data.datainfo === 'undefined' || res.data.datainfo === null || res.data.datainfo === ''){
            datainfo = {}
          }
          else{
            datainfo = JSON.parse(res.data.datainfo)
          }
          Object.assign(this.mingyang, {
            fromSpeed: initStringVal(datainfo.fromSpeed),
            toSpeed: initStringVal(datainfo.toSpeed),
            basis: this.localBasis(res.data.evaluate)
          })
        } else {
          this.$pop("后台错误");
        }
      });
    },
    localBasis(srcBasis) {
      if(typeof srcBasis === 'undefined' || srcBasis == null || srcBasis === ''){
        return []
      }
      return JSON.parse(srcBasis)
    },
    // 删除模板
    deleteModelSelect(item, index) {
      if(!item.hasOwnProperty('tag') || item.tag !== 'BeginReport') {
        return
      }
      let modelType = this.reportData.modelType.val.val
      let tree_id = this.treeId
      let time = item.id
      this.$pop({
        content: "删除报告模板：" + item.val,
        btnNum: 2,
      }).then((res) => {
        if (res) {
          // 执行删除
          const params = {
            tree_id,
            time
          }
          this.$getApi.delReportModel(params).then((res) => {
            if (res && res.msg === 0) {
              let sIndex = this.modelSelectList.findIndex((model) => {
                return (model.model_type == modelType && model.time == time) 
              })
              this.modelSelectList.splice(sIndex,1)
              this.$pop("删除成功");
            } else {
              this.$pop("后台错误");
            }
          })
        }
      });
    },
    // 新报告
    newReport() {
      if(!this.isValidParams()){
        return
      }
      this.$pop({
        content: "重置当前内容并编辑新报告？",
        btnNum: 2,
      }).then((res) => {
        if (res) {
          this.loadReportModel();
          this.closePop(1);
        }
      });
    },
    // 参数验证及处理
    isValidParams(){
      let isValid = true
      if(this.currentModelType === '1'){
        if(this.mingyang.startTime === ''){
          this.$pop('开始时间不能为空')
          return false
        }
        else if(this.mingyang.endTime === ''){
          this.$pop('结束时间不能为空')
          return false
        }
        else if(Number(this.mingyang.endTime) <= Number(this.mingyang.state)){
          this.$pop('结束时间必须大于开始时间')
          return false
        }
        if(this.mingyang.fromSpeed === '' || this.mingyang.toSpeed === ''){
          this.mingyang.fromSpeed = ''
          this.mingyang.toSpeed = ''
        }
        else if (parseInt(this.mingyang.toSpeed) <= parseInt(this.mingyang.fromSpeedfromSpeed)) {
          this.$pop("最大转速必须大于最小转速");
          return false;
        }
        if(this.mingyang.basis.length === 0){
          this.$pop("诊断依据不能为空");
          return false;
        }
        isValid = this.mingyang.basis.every(row => {
          if(!this.bandParamHandler(row['2'])){
            this.$pop(`${this.getPosClassLabel(row['pos_class'])}${this.getCharacterLabel('2')}频率（或门限）上限必须大于下限`);
            return false
          }
          if(!this.bandParamHandler(row['1'])){
            this.$pop(`${this.getPosClassLabel(row['pos_class'])}${this.getCharacterLabel('1')}频率（或门限）上限必须大于下限`);
            return false
          }
          return true
        });
        if(!isValid){
          return false
        }
      }
      return true
    },
    // 安装分类
    getPosClassLabel(pos_class){
      switch(pos_class){
        case '1':
          return '主轴'
        case '2':
          return '齿轮箱'
        case '3':
          return '发电机'
        case '4':
          return '塔筒'
        case '5':
          return '叶轮'
      }
      return '公共'
    },
    //特征值类型
    getCharacterLabel(type){
      if(type === '1'){
        return '速度'
      }
      else{
        return '加速度'
      }
    },
    bandParamHandler(band){
      const {h_limit, hh_limit, upper_limit, lower_limit} = band
      if(h_limit === '' || hh_limit === '' || upper_limit === '' || lower_limit === ''){
        band.h_limit = ''
        band.hh_limit = ''
        band.upper_limit = ''
        band.lower_limit = ''
      }
      else {
        if(parseFloat(h_limit) >= parseFloat(hh_limit) || parseFloat(lower_limit) >= parseFloat(upper_limit)){
          return false
        }
      }
      return true
    },
    //新报告
    loadReportModel() {
      const treeMsg = {
        time: this.reportData.modelSelect.val.val,
        treeId: this.treeId,
        modelType: this.reportData.modelType.val.val,
      };
      if(this.currentModelType === '1'){
        Object.assign(treeMsg, this.mingyang)
      }
      this.$store.state.reportMsg.loadingReport = true;

      /* const treeMsg = {"time":"0","treeId":1515720506022,"modelType":"1",
                  "startTime":1613099037000,
                  "endTime":1615518237328,
                  "basis": [
                    {
                      "pos_class": "1", 
                      "2":{
                        "type":2,
                        "h_limit":0.3,
                        "hh_limit":0.5,
                        "upper_limit":500,
                        "lower_limit":0
                      },
                      "1": {
                        "type":1,
                        "h_limit":0.3,
                        "hh_limit":0.5,
                        "upper_limit":10000,
                        "lower_limit":500
                      }
                    }
                  ]
                } */


      this.$getApi.loadReportModel(treeMsg).then((res) => {
        this.$store.state.reportMsg.loadingReport = false;
        if (res && res.msg === 0) {
          this.$pop("新报告初始化完成");
          this.$bus.$emit("reportChange");
        } else {
          this.$pop("后台错误");
        }
      });
    },
    // 关闭窗口
    closePop(type) {
      this.viewPop = false;
      document.removeEventListener("keydown", this.enter);
      this.resolve(type > 0);
      this.remove();
    },
    // 移除组件
    remove() {
      window.onmousemove = null;
      setTimeout(() => {
        this.$destroy();
        document.getElementById("app").removeChild(this.$el);
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.White-content {
  .pop-box-background {
    position: fixed;
    left: 0;
    top: 180px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    z-index: 5;
    .pop-box {
      width: 410px;
      position: absolute;
      .pop-box-title {
        height: 34px;
        line-height: 34px;
        color: #333;
        font-size: 14px;
        text-align: left;
        padding-left: 20px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        position: relative;
        .close-pop {
          width: 34px;
          height: 34px;
          position: absolute;
          right: 10px;
          text-align: center;
          .iconfont {
            font-size: 12px;
            display: block;
            transform: scale(0.75);
          }
        }
      }
      .pop-box-content {
        margin-top: 10px;
        margin-left: 10px;
        font-size: 12px;
        color: #666;
        .report-list {
          li {
            display: grid;
            grid-template-columns: 80px 300px;
            grid-template-rows: 25px;
            div {
              height: 21px;
              &:last-child {
                padding: 0px 25px 0px 5px;
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .iconfont {
                  position: absolute;
                  right: 5px;
                  font-size: 12px;
                }
              }
            }
            .list-name {
              text-align: right;
              padding-right: 10px;
            }
            margin-bottom: 4px;
          }
        }
      }
      .pop-box-button {
        height: 50px;
        line-height: 50px;
        text-align: center;
        .pop-btn {
          height: 26px;
          line-height: 26px;
          width: 60px;
          font-size: 14px;
          text-align: center;
          padding: 0;
        }
        .pop-btn-cancel {
          margin-left: 15px;
        }
      }
    }
  }
}
</style>