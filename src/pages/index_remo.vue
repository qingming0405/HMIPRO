<template>
  <div class="index-content-remo">
    <button class="backBtn" @click="returnBack()" v-show="pagesNum===2 || pagesNum===3">返回</button>
    <div id="3Dmap" style="position:relative;width: 100vw;height:100vh" v-show="show3D"></div>
    <div id="ChinaMap" style="width: 100vw;height:100vh" v-show="!show3D"></div>
    <div id="loading-center-absolute" v-show="loading">
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
      <div class="object"></div>
    </div>
    <header class="header">
      <div class="logo"></div>
<!--      <img class="logo" src="~assets/images/remo/remoLogo.png"/>-->
      <div class="title">智能数据诊断平台（中心版）</div>
      <div class="search">
        <input class="header-search-box" ref="searchInput" type="text" placeholder="输入现场名..."  autocomplete="off" @keyup="searchFac">
        <i class="iconfont icon-sousuo search-icon" @click="searchrouterTo()"></i>
        <ul class="search-list" ref="searchList" v-show="isShowSearchList">
          <li class="search-li" v-for="item in searchList" @click="searchrouterTo(item)">{{item.name}}</li>
        </ul>
        <div class="out-btn" @click="logout">退出</div>
      </div>
    </header>
    <div class="left">
      <div class="left-factory">
        <div class="block-title">服务行业</div>
        <ul class="factory-block">
          <li class="factory" v-for="(item,index) in factoryList" @click="chooseFacTypeData(index,item)" :class="chooseFacIndex === index ?'active':''">
            <div class="img-block">
              <div class="img"><i class="iconfont" :class="item.img"></i></div>
              <div class="text">{{item.text}}</div>
            </div>
            <div class="inputNum">
              <div>
                <div class="progress_area">
                  <span class="progress_bac" :style="item.macPer"></span>
                </div>
                <span>{{item.macNum}}台设备</span>
              </div>
              <div>
                <div class="progress_area">
                  <span class="progress_bac" :style="item.facPer"></span>
                </div>
                <span>{{item.factoryNum}}个现场</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="left-expert">
        <div class="block-title">专家系统</div>
        <div class="expert-block">
          <a class="block" v-for="item in expertList" :href="item.link" target = "blank">
            <div class="img-block">
              <img class="img" :src="item.img"/>
            </div>
            <div class="text">
              {{item.text1}}<br/>
              {{item.text2}}
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right-health">
        <div class="block-title">健康状况</div>
        <div id="healthChart"></div>
      </div>
      <div class="right-device">
        <div class="block-title">设备状态</div>
        <div id="deviceChart"></div>
      </div>
      <div class="right-chain">
        <div class="block-title">数字孪生模型</div>
        <div class="chain-img">
          <img src="~assets/images/remo/chain_map.png">
        </div>
        <div class="text">{{chainNum}}个</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {provincesArr, provinces,countryName} from "utils/utils.js";
  import echarts from "echarts";
  import "echarts-gl";
  import 'echarts/map/js/world.js'
  import 'echarts/map/js/china.js' // 引入中国地图数据

  var mapChart,earthChart,ChinaChart,deviceChart,healthChart;
  export default {
    name: "indexRemo",
    data() {
      return {
        loading: null /* 是否加载中 */,
        expertList:[//专家系统列表
          {
            link:'http://10.100.0.2/CS2000_code/shuini.jsp',
            img: require('assets/images/remo/expert1.png'),
            text1: '水泥专家',
            text2: '报警系统',
          },
          {
            link:'http://10.100.0.2/CS2000_code',
            img: require('assets/images/remo/expert2.png'),
            text1: '风电专家',
            text2: '报警系统',
          },
          {
            link:'https://lanhuapp.com/url/alzMe',
            img: require('assets/images/remo/expert3.png'),
            text1: '汽轮发电机组',
            text2: '测试平台',
          }
        ],
        chainNum: 0,//传动链总数目
        factoryList:[//行业数据列表
          {
            img:'icon-suoyou-copy',
            text: '所有行业',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
          {
            img:'icon-fenglifadian_huaban',
            text: '风力发电',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
          {
            img:'icon-shuinishengchan_huaban_huaban',
            text: '水泥生产',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
          {
            img:'icon-shiyou_huaban',
            text: '石油化工',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
          {
            img:'icon-huolifadian_huaban',
            text: '火力发电',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
          {
            img:'icon-guidaojiaotong_huaban',
            text: '轨道交通',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
          {
            img:'icon-shiyouhuagong',
            text: '油气井',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
          {
            img:'icon-qita_huaban',
            text: '其他行业',
            macNum: 0,
            factoryNum: 0,
            macPer:{
              width: `0%`
            },
            facPer:{
              width: `0%`
            },
            normalNum:0,
            alarmNum:0,
            warnNum:0,
            surfaceNormalNum:0,
          },
        ],
        show3D:true,//是否展示3D地球

        locArr:{},
        styleArr:[],
        sourceArr:[],
        allArr:[],

        macNum: 0,//设备总数
        alarmNum:0,//总设备报警数
        warnNum:0,//总设备预警数
        offNum:0,//总离线数
        normalNum:0,//总正常数
        onNum:0,//总在线数
        FacNum:0,//总风场数
        surfaceNormalNum:0,//正常+离线的机组数目

        dataArr:[],
        dataArr0:[],
        dataArr1:[],
        dataArr2:[],
        dataArr3:[],
        dataArr4:[],
        dataArr5:[],
        dataArr6:[],
        datasourceArr:[],

        styleArr0:[],
        styleArr1:[],
        styleArr2:[],
        styleArr3:[],
        styleArr4:[],
        styleArr5:[],
        styleArr6:[],

        w_styleArr0:[],
        w_styleArr1:[],
        w_styleArr2:[],
        w_styleArr3:[],
        w_styleArr4:[],
        w_styleArr5:[],
        w_styleArr6:[],
        w_styleArr: [],

        healthyNum:100,//健康值
        option:{},//中国地图的option
        chooseFacIndex:0,//选中的行业类型index
        worldOption:{},//世界地图的option
        earthOption:{},//地球的option
        pagesNum: 1,//当前地图级别，1：地球；2：中国；3：省级
        fields_arr:[],//所有的风场信息
        searchList:[],//符合搜索条件的下拉选项
        isShowSearchList: true,//搜索下拉框是否展示
        worldData:[],//世界数据
        timer:null,//定时器
        calcData: {//计算方式参数
          calculateWay1: 0,//计算符号1
          calculateNum1: 1,//计算数字1
          calculateNum2: 0,//计算数字2
        },
        realData:[],//真实数据
      };
    },
    created(){
      /* 引入省份js文件 */
      this.initImportFile();
    },
    mounted() {
      // this.getData();
      /*定时更新*/
      clearInterval(this.timer)
      let fn = () => {
        this.getData();
        return fn;
      };
      this.timer = setInterval(fn(), 86400000);//一天刷新一次

      this.initHealthChart();
      this.initDeviceChart();
      let _this = this;
      /*点击除input和列表区域以外的任何地方关闭下拉弹窗*/
      document.addEventListener('mouseup',(e) =>{
        let searchList = this.$refs.searchList;//下拉列表区域
        let searchInput = this.$refs.searchInput;//输入框
        _this.isShowSearchList = true
        if (searchList || searchInput) {
          if (!searchList.contains(e.target) && !searchInput.contains(e.target)) {
            _this.isShowSearchList =false
          }
        }
      })
      /*监控屏幕缩放，图表跟随缩放*/
      window.addEventListener("resize",function (){
        mapChart.resize();
        earthChart.resize();
        ChinaChart.resize();
        deviceChart.resize();
        healthChart.resize();
      });
    },
    beforeDestroy() {
      /*离开界面将对象销毁*/
      if (!mapChart) {
        return;
      }
      if (!earthChart) {
        return;
      }
      if (!ChinaChart) {
        return;
      }
      if (!deviceChart) {
        return;
      }
      if (!healthChart) {
        return;
      }
      mapChart.dispose();
      mapChart = null;

      earthChart.dispose();
      earthChart = null;

      ChinaChart.dispose();
      ChinaChart = null;

      deviceChart.dispose();
      deviceChart = null;

      healthChart.dispose();
      healthChart = null;

      if(this.timer){
        clearInterval(this.timer);//清除定时器
        this.timer = null;
      }
    },
    methods:{
      /* 获取总数据 */
      getData(){
        let that = this;
        that.loading = true;
        let t_ids = JSON.parse(sessionStorage.getItem('tree'));
        let params = {
          t_ids:t_ids
        }
        this.$getApi.getRemoteInfo(params)
          .then(res=> {
            that.loading = false;
            let result = res.json;
            if (result && result.length > 0) {
              that.fields_arr = result;
              that.locArr = {};
              that.styleArr = [];
              that.sourceArr = [];
              that.allArr = [];
              that.worldData=[];

              that.FacNum = result.length;//监测总个数*/
              that.provinceArr = {};
              that.dataArr = [];
              that.dataArr0 = [];
              that.dataArr1 = [];
              that.dataArr2 = [];
              that.dataArr3 = [];
              that.dataArr4 = [];
              that.dataArr5 = [];
              that.dataArr6 = [];
              that.w_styleArr0 = [];
              that.w_styleArr1 = [];
              that.w_styleArr2 = [];
              that.w_styleArr3 = [];
              that.w_styleArr4 = [];
              that.w_styleArr5 = [];
              that.w_styleArr6 = [];
              that.styleArr0 = [];
              that.styleArr1 = [];
              that.styleArr2 = [];
              that.styleArr3 = [];
              that.styleArr4 = [];
              that.styleArr5 = [];
              that.styleArr6 = [];
              that.datasourceArr = [that.dataArr0,that.dataArr1,that.dataArr2,that.dataArr3,that.dataArr4,that.dataArr5,that.dataArr6];
              that.styleArr = [that.styleArr0,that.styleArr1,that.styleArr2,that.styleArr3,that.styleArr4,that.styleArr5,that.styleArr6];
              that.w_styleArr = [that.w_styleArr0,that.w_styleArr1,that.w_styleArr2,that.w_styleArr3,that.w_styleArr4,that.w_styleArr5,that.w_styleArr6];
              that.sourceArr = [that.styleArr0,that.styleArr1,that.styleArr2,that.styleArr3,that.styleArr4,that.styleArr5,that.styleArr6];
              function buildProvince(obj) {
                if (provinces[obj.address] != null) {
                  let province = provinces[obj.address];
                  if (that.provinceArr[province] == null) {
                    that.provinceArr[province] = {};
                    that.provinceArr[province][obj.name] = [obj.loc_x, obj.loc_y];
                  } else {
                    that.provinceArr[province][obj.name] = [obj.loc_x, obj.loc_y];
                  }
                }
              }
              function buildData(obj) {
                if (provinces[obj.address] != null) {
                  let province = provinces[obj.address];
                  if (obj["type"] == 0) {//风力发电
                    if (that.dataArr0[province]==null) {
                      that.dataArr0[province]=[];
                    }
                    that.dataArr0[province].push(obj);
                  }
                  else if (obj["type"] == 4) {//石油化工
                    if (that.dataArr1[province]==null) {
                      that.dataArr1[province]=[];
                    }
                    that.dataArr1[province].push(obj);
                  }
                  else if (obj["type"] == 5) {//火力发电
                    if (that.dataArr2[province]==null) {
                      that.dataArr2[province]=[];
                    }
                    that.dataArr2[province].push(obj);
                  }
                  else if (obj["type"] == 1) {//水泥生产
                    if (that.dataArr3[province]==null) {
                      that.dataArr3[province]=[];
                    }
                    that.dataArr3[province].push(obj);
                  }
                  else if (obj["type"] == 7) {//轨道交通
                    if (that.dataArr4[province]==null) {
                      that.dataArr4[province]=[];
                    }
                    that.dataArr4[province].push(obj);
                  }
                  else if (obj["type"] == 10) {//油气井
                    if (that.dataArr5[province]==null) {
                      that.dataArr5[province]=[];
                    }
                    that.dataArr5[province].push(obj);
                  }
                  else if (obj["type"] == 2||obj["type"] == 3||obj["type"] == 8||obj["type"] == 9) {//其他行业
                    if (that.dataArr6[province]==null) {
                      that.dataArr6[province]=[];
                    }
                    that.dataArr6[province].push(obj);
                  }
                }

              }

              for (let i = 0; i < result.length; i++) {
                that.locArr[result[i]["name"]] = [result[i]["x"], result[i]["y"]];
                let obj = {};
                obj.name = result[i]["name"];
                obj.value = [result[i]["x"],result[i]["y"],result[i]["name"]];
                obj.type= result[i]["type"];
                obj.address = result[i]["address"];
                obj.loc_x = result[i]["x"];
                obj.loc_y = result[i]["y"];
                obj.f_type = result[i]["type"];
                if (result[i]["jc"] == 3) {
                  obj.color = '#f80000';
                  obj.status = 3; //报警状态
                } else if (result[i]["jc"] == 2) {
                  obj.color = '#ffa101';
                  obj.status = 2;
                } else if (result[i]["jc"] == 0) {
                  obj.color = '#009944';
                  obj.status = 1;
                } else {
                  if (parent.isReal == 0) {
                    obj.color = '#aaa';
                  } else {
                    obj.color = '#009944';
                  }
                  obj.status = 0;
                }


                obj.id = result[i].id;
                obj.db = result[i].db_type;
                obj.type = result[i].type;
                obj.version = result[i].version;

                /**现场类型**/
                if (result[i]["type"] == 0) {//风力发电
                  if(result[i]["address"]>0 && result[i]["address"] < 35){
                    that.styleArr0.push(obj);
                  }
                  that.w_styleArr0.push(obj);
                }
                else if (result[i]["type"] == 4) {//石油化工
                  if(result[i]["address"]>0 && result[i]["address"] < 35){
                    that.styleArr1.push(obj);
                  }
                  that.w_styleArr1.push(obj);
                }
                else if (result[i]["type"] == 5) {//火力发电
                  if(result[i]["address"]>0 && result[i]["address"] < 35){
                    that.styleArr2.push(obj);
                  }
                  that.w_styleArr2.push(obj);
                }
                else if (result[i]["type"] == 1) {//水泥生产
                  if(result[i]["address"]>0 && result[i]["address"] < 35){
                    that.styleArr3.push(obj);
                  }
                  that.w_styleArr3.push(obj);
                }
                else if (result[i]["type"] == 7) {//轨道交通
                  if(result[i]["address"]>0 && result[i]["address"] < 35){
                    that.styleArr4.push(obj);
                  }
                  that.w_styleArr4.push(obj);
                }
                else if (result[i]["type"] == 10) {//油气井
                  if(result[i]["address"]>0 && result[i]["address"] < 35){
                    that.styleArr5.push(obj);
                  }
                  that.w_styleArr5.push(obj);
                }
                else if (result[i]["type"] == 2||result[i]["type"] == 3||result[i]["type"] == 8||result[i]["type"] == 9) {//其他行业
                  if(result[i]["address"]>0 && result[i]["address"] < 35){
                    that.styleArr6.push(obj);
                  }
                  that.w_styleArr6.push(obj);
                }
                that.allArr.push(obj);
                that.worldData.push(obj);
                buildProvince(obj);
                buildData(obj);
              }

              that.styleArr = [that.styleArr0,that.styleArr1,that.styleArr2,that.styleArr3,that.styleArr4,that.styleArr5,that.styleArr6];
              that.w_styleArr = [that.w_styleArr0,that.w_styleArr1,that.w_styleArr2,that.w_styleArr3,that.w_styleArr4,that.w_styleArr5,that.w_styleArr6];
              that.sourceArr = [that.styleArr0,that.styleArr1,that.styleArr2,that.styleArr3,that.styleArr4,that.styleArr5,that.styleArr6];
              that.dataArr=[that.dataArr0,that.dataArr1,that.dataArr2,that.dataArr3,that.dataArr4,that.dataArr5,that.dataArr6];
              that.datasourceArr = [that.dataArr0,that.dataArr1,that.dataArr2,that.dataArr3,that.dataArr4,that.dataArr5,that.dataArr6];

              if (mapChart) {
                mapChart.dispose();
                mapChart = null;
              }
              if (earthChart) {
                earthChart.dispose();
                earthChart = null;
              }
              if (ChinaChart) {
                ChinaChart.dispose();
                ChinaChart = null;
              }

              that.initWorldMap();
              that.init3Dmap();
              that.initChinaMap();

            } else {
              this.$pop('无现场数据')
            }
            if(res.remoteData && res.remoteData.showData && res.remoteData.showData.length){
              that.macNum = 0;
              that.alarmNum = 0;
              that.warnNum = 0;
              that.offNum = 0;
              that.normalNum = 0;
              that.onNum = 0;
              that.facNum = 0;
              that.surfaceNormalNum = 0;
              that.chainNum = 0;

              let macNum;//风机个数
              let macPer;//风机百分比
              let facPer;//风场百分比
              let facNum;//风场个数
              let normalNum;//各行业正常风机台数
              let alarmNum;//各行业报警风机台数
              let warnNum;//各行业预警风机台数
              let surfaceNormalNum;//各行业正常+离线风机台数
              let othernormalNum=0;//其他行业正常风机台数
              let otheralarmNum=0;//其他行业报警风机台数
              let otherwarnNum=0;//其他行业预警风机台数
              let otheroffNum=0;//其他行业离线风机台数
              let otherfacNum=0;//其他行业风场个数
              let otherdriveChainNum=0;//其他行业传动链
              let othersurfaceNormalNum=0;//其他行业正常+离线风机台数
              let showData = res.remoteData[res.remoteData.nowShow];//默认显示假数据,如果需要显示真实数据则让showData = res.remoteData.realData
              let hasOther = false;//是否包含其他领域
              if(res.remoteData.type===2){
                that.calcData = res.remoteData.calcData;
                that.realData = res.remoteData.realData;
                that.calculateData();//根据公式计算真实数据
                showData = that.realData;
              }
              showData.forEach(mac=>{
                that.normalNum += mac.normalNum;
                that.alarmNum  += mac.hhNum;
                that.warnNum += mac.hNum;
                that.offNum += mac.offlineNum;
                that.facNum += mac.facNum;
                that.chainNum += mac.driveChainNum + mac.bearingNum;
                that.surfaceNormalNum += mac.surfaceNormalNum;
                if(mac.type===2 || mac.type===3 || mac.type===8 || mac.type===9){//其他领域求和
                  othernormalNum += mac.normalNum;
                  otheralarmNum  += mac.hhNum;
                  otherwarnNum += mac.hNum;
                  otheroffNum += mac.offlineNum;
                  otherfacNum += mac.facNum;
                  otherdriveChainNum += mac.driveChainNum;
                  othersurfaceNormalNum += mac.surfaceNormalNum;
                }
                if(mac.type==-1){
                  hasOther = true;
                }
              });
              that.macNum = that.normalNum + that.alarmNum + that.warnNum + that.offNum;
              let factoryData = [{
                img:'icon-suoyou-copy',
                facType:'所有行业',
                driveChainNum: that.chainNum,
                facNum: that.facNum,
                hNum: that.warnNum,
                hhNum: that.alarmNum,
                normalNum: that.normalNum,
                offlineNum: that.offNum,
                surfaceNormalNum: that.surfaceNormalNum,
              }];
              for(let i=0;i<showData.length;i++){
                let obj = showData[i];
                if(obj.type===2 || obj.type===3 || obj.type===8 || obj.type===9){
                  continue;
                }
                switch(obj.type){
                  case 0:
                    obj.facType = '风力发电';
                    obj.img = 'icon-fenglifadian_huaban';
                    break;
                  case 4:
                    obj.facType = '石油化工';
                    obj.img = 'icon-shiyou_huaban';
                    break;
                  case 5:
                    obj.facType = '火力发电';
                    obj.img = 'icon-huolifadian_huaban';
                    break;
                  case 1:
                    obj.facType = '水泥生产';
                    obj.img = 'icon-shuinishengchan_huaban_huaban';
                    break;
                  case 7:
                    obj.facType = '轨道交通';
                    obj.img = 'icon-guidaojiaotong_huaban';
                    break;
                  case 10:
                    obj.facType = '油气井';
                    obj.img = 'icon-shiyouhuagong';
                    break;
                  case -1:
                    obj.facType = '其他行业';
                    obj.img = 'icon-qita_huaban';
                    break;
                }
                factoryData.push(obj);
              }
              if(!hasOther){
                factoryData.push({
                  img:'icon-qita_huaban',
                  driveChainNum: otherdriveChainNum,
                  facNum: otherfacNum,
                  hNum: otherwarnNum,
                  hhNum: otheralarmNum,
                  normalNum: othernormalNum,
                  offlineNum: otheroffNum,
                  surfaceNormalNum: othersurfaceNormalNum,
                  facType:'其他行业',
                });
              }
              factoryData.forEach((mac,index)=>{
                facNum = mac.facNum;//风场个数
                macNum = mac.normalNum + mac.hhNum + mac.hNum + mac.offlineNum;//风机个数
                macPer = (macNum / that.macNum).toFixed(2) * 100;
                facPer = (facNum / that.facNum).toFixed(2) * 100;
                normalNum = mac.normalNum;
                alarmNum = mac.hNum;
                warnNum = mac.hhNum;
                surfaceNormalNum = mac.surfaceNormalNum;
                let obj = {
                  img:mac.img,
                  text: mac.facType,
                  macNum: macNum,
                  factoryNum: facNum,
                  macPer:{
                    width: `${macPer}%`
                  },
                  facPer:{
                    width: `${facPer}%`
                  },
                  normalNum,
                  alarmNum,
                  warnNum,
                  surfaceNormalNum,
                };
                that.factoryList[index] = obj;
              });
              that.healthyNum = 0;//健康值
              that.onNum = that.surfaceNormalNum + that.alarmNum + that.warnNum;
              if (that.onNum > 0) {
                that.healthyNum = Math.round((that.surfaceNormalNum + that.warnNum * 0.4) / that.onNum * 10000) / 100;
              }

              let deviceData = [that.surfaceNormalNum,that.warnNum,that.alarmNum];
              //设备状态柱状图更新数据
              let deviceOption = deviceChart.getOption();
              deviceOption.title[0].text = `总台数：${that.macNum}`;
              deviceOption.series[0].data = deviceData;
              deviceChart.clear();
              deviceChart.setOption(deviceOption);

              //设备状态柱状图更新数据
              let healthOption = healthChart.getOption();
              healthOption.series[0].data[0].value= that.healthyNum;
              healthChart.clear();
              healthChart.setOption(healthOption);
            }
          })
          .catch(err=>{
            console.log('请求错误' ,err)
          })
      },
      /*如果是公式计算，则需要根据公式计算数据*/
      calculateData(){
        let num1 = Number(this.calcData.calculateNum1);//倍数
        let num2 = Number(this.calcData.calculateNum2);//加数
        let way1 = Number(this.calcData.calculateWay1);//加减运算符
        if(way1===0){//加号
          this.realData.forEach(fac=>{
            fac.bearingNum=fac.bearingNum * num1 + num2;
            fac.driveChainNum=fac.driveChainNum * num1 + num2;
            fac.facNum=fac.facNum * num1 + num2;
            fac.hNum=fac.hNum * num1 + num2;
            fac.hhNum=fac.hhNum * num1 + num2;
            fac.normalNum=fac.normalNum * num1 + num2;
            fac.offlineNum=fac.offlineNum * num1 + num2;
            fac.surfaceNormalNum=fac.surfaceNormalNum * num1 + num2;
            fac.type = fac.type;
          })
        }
        else if(way1===1){//减号
          this.realData.forEach(fac=>{
            fac.bearingNum=fac.bearingNum * num1 - num2;
            fac.driveChainNum=fac.driveChainNum * num1 - num2;
            fac.facNum=fac.facNum * num1 - num2;
            fac.hNum=fac.hNum * num1 - num2;
            fac.hhNum=fac.hhNum * num1 - num2;
            fac.normalNum=fac.normalNum * num1 - num2;
            fac.offlineNum=fac.offlineNum * num1 - num2;
            fac.surfaceNormalNum=fac.surfaceNormalNum * num1 - num2;
            fac.type = fac.type;
          })
        }
      },
      /* 根据行业类型过滤 */
      chooseFacTypeData(index,item){
        this.macNum = item.macNum;//风机总台数
        this.chooseFacIndex = index;//所选的行业类型的index
        let deviceData = [item.surfaceNormalNum,item.warnNum,item.alarmNum];//设备状态图标数据
        let styleArr = [[],[],[],[],[],[],[]];
        let dataArr = [[],[],[],[],[],[],[]];
        let geoName = this.option.geo.map;
        let w_styleArr = [[],[],[],[],[],[],[]];
        if(index==0){//表示所有行业
          styleArr = this.sourceArr;
          dataArr = this.datasourceArr;
          w_styleArr = this.w_styleArr;
          this.earthOption.series[0].data = this.worldData;
        }else{
          styleArr[index-1] = this.sourceArr[index-1];
          w_styleArr[index-1] = this.w_styleArr[index-1];
          dataArr[index-1][geoName] = this.datasourceArr[index-1][geoName];
          this.earthOption.series[0].data = w_styleArr[index-1];
        }

        for(let i=0; i<this.option.series.length;i++){
          if(provincesArr.indexOf(geoName)>-1){
            if(dataArr[i][geoName] && dataArr[i][geoName].length>0){
              this.option.series[i].data = dataArr[i][geoName];
            }
            else{
              this.option.series[i].data = [];
            }
          }
          else{
            this.option.series[i].data = styleArr[i];
          }
        }


        //中国地图更新数据
        ChinaChart.clear();
        ChinaChart.setOption(this.option);

        //设备状态柱状图更新数据
        let deviceOption = deviceChart.getOption();
        deviceOption.title[0].text = `总台数：${this.macNum}`;
        deviceOption.series[0].data = deviceData;
        deviceChart.clear();
        deviceChart.setOption(deviceOption);

        //如果是地球，更新数据
        if(this.show3D){
          earthChart.clear();
          earthChart.setOption(this.earthOption);
        }
      },
      /* 健康状态 */
      initHealthChart(){
        let health = document.getElementById('healthChart');
        healthChart = echarts.init(health);
        let option = {
          tooltip: {
            formatter: '{a} <br/>{c} {b}'
          },
          toolbox: {
            show: false,
            feature: {
              mark: {show: true},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: [
            {
              name: '',
              type: 'gauge',
              min: 0,
              max: 100,
              splitNumber: 10,
              radius: '95%',
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: [[0.2, '#ff4500'], [0.8, '#FFA101'], [1, '#008444']],
                  width: 3,
                  shadowColor: '#fff', //默认透明
                  shadowBlur: 10
                }
              },
              axisLabel: {            // 坐标轴小标记
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 10
              },
              axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto',
                  shadowColor: '#fff', //默认透明
                  shadowBlur: 10
                }
              },
              splitLine: {           // 分隔线
                length: 25,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  width: 3,
                  color: '#fff',
                  shadowColor: '#fff', //默认透明
                  shadowBlur: 10
                }
              },
              pointer: {           // 分隔线
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
              },
              title: {
                offsetCenter: [0, '60%'],
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontSize: 16,
                  color: '#fff',
                  shadowColor: '#fff', //默认透明
                  shadowBlur: 10,

                }
              },
              detail: {
                backgroundColor: '#2251b2',
                borderWidth: 1,
                height: 20,
                lineHeight: 25,
                padding:[8,5,2,5],
                borderColor: '#2251b2',
                shadowColor: '#2251b2', //默认透明
                shadowBlur: 2,
                offsetCenter: [0, '80%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  color: '#fff',
                  fontSize: 20,
                }
              },
              data: [{value: `${this.healthyNum}`, name: ''}]
            },
          ]
        };
        healthChart.setOption(option);
      },
      /* 设备状态 */
      initDeviceChart(){
        let device = document.getElementById('deviceChart');
        deviceChart = echarts.init(device);
        let option = {
          title: {
            text: `总台数：${this.macNum}`,
            textStyle: {
              color:'#0FEEF2',
              fontSize: 12,
              fontWeight: 'normal',
              textAlign: 'right'
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['正常', '预警', '报警'],
              axisTick: {
                alignWithLabel: true
              },
              axisLabel:{
                color:'#fff'
              },
              axisLine:{
                lineStyle:{
                  color:'#fff'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'log',
              axisLabel:{
                color:'#fff'
              },
              name:'(台)',
              nameTextStyle:{
                align:'center'
              },
              axisLine:{
                lineStyle:{
                  color:'#fff'
                }
              }
            }
          ],
          series: [
            {
              name: '总台数',
              type: 'bar',
              barWidth: '30%',
              label:{
                color:'#fff'
              },
              data: [this.surfaceNormalNum, this.warnNum, this.alarmNum],
              itemStyle: {
                normal: {
                  //不同的柱子颜色不同
                  color: function(params) {
                    //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                    let color1 = new echarts.graphic.LinearGradient(//渐变色
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: 'rgba(0, 153, 68, 1)'},
                        {offset: 0.5, color: 'rgba(0, 153, 68, 0.6)'},
                        {offset: 1, color: 'rgba(0, 153, 68, 0.7)'}
                      ]
                    );
                    let color2 = new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: 'rgba(255, 161, 1, 1)'},
                        {offset: 0.5, color: 'rgba(255, 161, 1, 0.6)'},
                        {offset: 1, color: 'rgba(255, 161, 1, 0.7)'}
                      ]
                    );
                    let color3 = new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: 'rgba(248, 0, 0, 1)'},
                        {offset: 0.5, color: 'rgba(248, 0, 0, 0.6)'},
                        {offset: 1, color: 'rgba(248, 0, 0, 0.7)'}
                      ]
                    );
                    let colorList = [color1,color2, color3];
                    return colorList[params.dataIndex]
                  }
                }
              }
            }
          ]
        };
        deviceChart.setOption(option);
      },
      /* 世界地图 */
      initWorldMap(){
        // 使用 echarts 绘制世界地图的实例作为纹理
        let canvas = document.createElement('canvas');
        let that = this;
        mapChart = echarts.init(canvas, null, {
          width: 4096, height: 2048
        });
        this.worldOption = {
          nameMap: countryName,
          geo: {
            // 自定义扩展图表类型
            type: 'map',
            map: 'world',
            selectedMode:'single',
            // 绘制完整尺寸的 echarts 实例
            top: 0, left: 0,
            right: 0, bottom: 0,
            boundingCoords: [[-180, 90], [180, -90]],
            label: {
              show: true,
              color: '#b6daee',
              fontWeight: 300,
              fontSize: 12,
            },
            itemStyle: {
              areaColor: '#131840',
              color: '#fff',
              borderColor: '#2778e4',//区块的边框颜色,
            },
            emphasis: {//鼠标hover样式
              label: {
                show: true,
                color: '#fff',
              },
              itemStyle:{
                areaColor: '#0a2255',
                color: '#fff',
                borderColor: '#2778e4',//区块的边框颜色,
              },
            },
            regions: [{
              name: '中国',
              selected: true,
              itemStyle: {
                areaColor: '#0a2255',
                borderColor: '#2778e4',
              }
            }]
          },
          series: [],
        }
        mapChart.setOption(this.worldOption);

        mapChart.on('geoselectchanged', function (param) {
          that.pagesNum = 2;
          that.show3D = false;
          let countryType = param.batch[0].name;//当前选择的地图名称
          let zoom = 0.9;
          if(countryType==="中国"){
            countryType = 'china';
            zoom = 1.1;

            for(let i=0; i<that.option.series.length;i++){
              if(that.chooseFacIndex!==0){//如果当前处于过滤行业状态数据需要更新
                if(i===(that.chooseFacIndex-1)){
                  that.option.series[that.chooseFacIndex-1].data = that.styleArr[that.chooseFacIndex-1];
                }
                else{
                  that.option.series[i].data = [];
                }
              }
              else{
                that.option.series[i].data = that.styleArr[i];
              }

            }
          }
          else{
            /*按需引入国家js文件*/
            that.initImportCountryFile(countryType);
            let l = that.option.series.length;
            let w_arr = new Array(l);
            for(let i=0; i<l;i++){
              w_arr[i] = [];
              let m = that.w_styleArr[i].length;
              for(let n=0;n<m;n++){
                if(that.w_styleArr[i][n].address>35){//非中国的组织
                  w_arr[i].push(that.w_styleArr[i][n]);
                }
              }
            }
            for(let k=0; k<l;k++){
              that.option.series[k].data = w_arr[k];
            }
          }
          that.option.geo.map = countryType;
          that.option.geo.zoom = zoom;
          ChinaChart.clear();
          ChinaChart.setOption(that.option);
        });
        /*mapChart.on('click', function (param) {
          let data = param.data;
          if(data){//表示点击到了tooltip里的数据
            let chooseId = data.id;
            let version = data.version;
            let user = JSON.parse(sessionStorage.getItem("user"));
            let userName = user.username;
            that.routerTo(chooseId,userName,version)
          }
        });*/
      },
      /* 3D地球 */
      init3Dmap(){
        let dom = document.getElementById("3Dmap");
        earthChart = echarts.init(dom);
        let url = require("assets/images/remo/earthBg.jpg");
        this.earthOption = {
          globe: {
            baseTexture: mapChart,
            // heightTexture: urlEarth,
            displacementScale: 0.04,
            shading: 'color',
            environment:url,
            atmosphere: {
              show: true
            },
            globeRadius: 100,
            /*postEffect: {
              enable: true,
              bloom: {
                enable: true,
                bloomIntensity: 0.2
              }
            },*/
            viewControl: {
              autoRotateSpeed: 5,
              autoRotateAfterStill: 8,
              targetCoord: [100.46, 39.92], // 定位到中国
            },
            light: {
              main: {
                // color: '#fff', //光照颜色
                intensity: 0.3, //光照强度
                shadow: true, // 阴影
                shadowQuality: 'medium',//阴影质量 ultra //阴影亮度
                alpha: 50, // 主光源绕 x 轴，即上下旋转的角度。配合 beta 控制光源的方向。
                beta: 90 // 主光源绕 y 轴，即左右旋转的角度。
              },
              ambient: { // 环境光
                intensity: 0.5 // 环境光反射
              },
              // 光源
              ambientCubemap: {
                diffuseIntensity: 0.3,
                // texture: urlhdr,
              }
            },
          },
          series: [
            {
              name: "worldMap",
              type: "scatter3D",
              coordinateSystem: "globe",
              symbol: "pin",
              symbolSize: [20, 20],
              label: {
                textStyle: {
                  color: "#000",
                  fontSize: 14,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
              },
              data:this.worldData,
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        earthChart.setOption(this.earthOption);
        let that = this;
        earthChart.on('click', function (param) {
          let data = param.data;
          if(data){//表示点击到了tooltip里的数据
            let chooseId = data.id;
            let version = data.version;
            let user = JSON.parse(sessionStorage.getItem("user"));
            let userName = user.username;
            that.routerTo(chooseId,userName,version)
          }
        });
      },
      /* 中国地图 */
      initChinaMap(){
        let that = this;
        // 使用 echarts 绘制世界地图的实例作为纹理
        let canvas = document.getElementById("ChinaMap");
        ChinaChart = echarts.init(canvas);
        this.option = {
          roam: true, // 滚轮缩放控制
          scaleLimit: {
            min: 0.5,
            max: 15,
          },
          tooltip: {
            formatter: function (params, ticket, callback) {
              let showInfo = params.data.name;
              return showInfo;
            },
          },
          geo: {
            // 自定义扩展图表类型
            map: 'china',
            type: "map",
            selectedMode:'single',
            zoom: 1.1 ,
            // 区域块上的label
            label: {
              show: true,
              color: "#fff",
            },
            itemStyle: {
              areaColor: "#0a2254",
              borderColor: "#2778e4",
              borderWidth: 0.5,
              emphasis: {
                areaColor: "rgb(10, 105, 187)",
                color:'#fff',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 5,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              shadowColor: '#2778e4',
              shadowBlur: 5,
            },
            emphasis: {
              label:{
                color:'#fff'
              }
            },
            layoutCenter: ["50%", "50%"],
            layoutSize: "100%",
            data: [],
          },
          series: [
            {
              name: "风力发电",
              type: "scatter",
              coordinateSystem: "geo",
              symbol: "pin",
              symbolSize: [18, 18],
              label: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
                shadowColor: '#2778e4',
                shadowBlur: 5,
                emphasis: {
                  borderWidth: 2,
                  borderColor: "white",
                },
              },
              data:that.styleArr0,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
            },
            {
              name: "石油化工",
              type: "scatter",
              coordinateSystem: "geo",
              symbol: 'pin',
              symbolSize: [18, 18],
              label: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
                shadowColor: '#2778e4',
                shadowBlur: 5,
                emphasis: {
                  borderWidth: 2,
                  borderColor: "white",
                },
              },
              data:that.styleArr1,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
            },
            {
              name: "火力发电",
              type: "scatter",
              coordinateSystem: "geo",
              symbol: 'pin',
              symbolSize: [18, 18],
              label: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
                shadowColor: '#2778e4',
                shadowBlur: 5,
                emphasis: {
                  borderWidth: 2,
                  borderColor: "white",
                },
              },
              data:that.styleArr2,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
            },
            {
              name: "水泥生产",
              type: "scatter",
              coordinateSystem: "geo",
              symbol: 'pin',
              symbolSize: [18, 18],
              label: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
                shadowColor: '#2778e4',
                shadowBlur: 5,
                emphasis: {
                  borderWidth: 2,
                  borderColor: "white",
                },
              },
              data:that.styleArr3,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
            },
            {
              name: "轨道交通",
              type: "scatter",
              coordinateSystem: "geo",
              symbol: 'pin',
              symbolSize: [18, 18],
              label: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
                shadowColor: '#2778e4',
                shadowBlur: 5,
                emphasis: {
                  borderWidth: 2,
                  borderColor: "white",
                },
              },
              data:that.styleArr4,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
            },
            {
              name: "油气井",
              type: "scatter",
              coordinateSystem: "geo",
              symbol: 'pin',
              symbolSize: [18, 18],
              label: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
                shadowColor: '#2778e4',
                shadowBlur: 5,
                emphasis: {
                  borderWidth: 2,
                  borderColor: "white",
                },
              },
              data:that.styleArr5,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
            },
            {
              name: "其他行业",
              type: "scatter",
              coordinateSystem: "geo",
              symbol: 'pin',
              symbolSize: [18, 18],
              label: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
              itemStyle: {
                color: function (params) {
                  return params.data.color;
                },
                shadowColor: '#2778e4',
                shadowBlur: 5,
                emphasis: {
                  borderWidth: 2,
                  borderColor: "white",
                },
              },
              data:that.styleArr6,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke",
              },
              hoverAnimation: true,
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        ChinaChart.setOption(this.option);
        /* 切换到省级 */
        ChinaChart.on('geoselectchanged', function (param) {
          let geoName = param.batch[0].name;
          if(provincesArr.indexOf(geoName)>-1){//省
            that.option.geo.map = param.batch[0].name;
            that.pagesNum = 3;
            that.option.geo.zoom = 0.85;//省级地图将图缩小
            let dataArr = [[],[],[],[],[],[],[]];
            if(that.chooseFacIndex===0){
              dataArr = that.datasourceArr;
            }else{
              dataArr[that.chooseFacIndex-1][geoName] = that.datasourceArr[that.chooseFacIndex-1][geoName];
            }
            for(let i=0; i<that.option.series.length;i++){
              if(dataArr[i][geoName] && dataArr[i][geoName].length>0){
                that.option.series[i].data = dataArr[i][geoName];
              }
              else{
                that.option.series[i].data = [];
              }
            }
            ChinaChart.clear();
            ChinaChart.setOption(that.option);
          }
        });
        /* 点击跳转 */
        ChinaChart.on('click', function (param) {
          let data = param.data;
          if(data){//表示点击到了tooltip里的数据
            let chooseId = data.id;
            let version = data.version;
            let user = JSON.parse(sessionStorage.getItem("user"));
            let userName = user.username;
            that.routerTo(chooseId,userName,version)
          }
        });
      },
      /* 引入省份js文件 */
      initImportFile() {
        let filaName = {
          浙江: "zhejiang.js",
          安徽: "anhui.js",
          澳门: "aomen.js",
          北京: "beijing.js",
          重庆: "chongqing.js",
          福建: "fujian.js",
          甘肃: "gansu.js",
          广东: "guangdong.js",
          广西: "guangxi.js",
          贵州: "guizhou.js",
          海南: "hainan.js",
          河北: "hebei.js",
          黑龙江: "heilongjiang.js",
          河南: "henan.js",
          湖北: "hubei.js",
          湖南: "hunan.js",
          江苏: "jiangsu.js",
          江西: "jiangxi.js",
          吉林: "jilin.js",
          辽宁: "liaoning.js",
          内蒙古: "neimenggu.js",
          宁夏: "ningxia.js",
          青海: "qinghai.js",
          山东: "shandong.js",
          上海: "shanghai.js",
          山西: "shanxi.js",
          山西1: "shanxi1.js",
          四川: "sichuan.js",
          台湾: "taiwan.js",
          天津: "tianjin.js",
          香港: "xianggang.js",
          新疆: "xinjiang.js",
          西藏: "xizang.js",
          云南: "yunnan.js"
        };
        for(let key in filaName){
          require(`echarts/map/js/province/${filaName[key]}`);
        }
      },
      /* 引入国家js文件(按需引入) */
      initImportCountryFile(country){
        for(let key in countryName){
          if(countryName[key] === country){
            require(`assets/js/country/${key}.js`);
          }
        }
      },
      /* 跳转方法 */
      routerTo(chooseId,userName,version){
        if(this.isInnerIPFn()){//内网跳转
          if(version.indexOf("flex")!=-1){
            this.post('http://10.100.0.102:8085/HMIedge/redirectUrl',{tid:chooseId});
          }
          else if(version=="9000"){
            this.post('http://10.100.0.6:9000/DS9000/Flex',{username:userName,id:chooseId,version:"flex"});
          }
          else if(version=="9100"){
            this.post('http://10.100.0.6:9100');
          }
          else if(version=="8000"){
            this.post('http://10.100.50.1/zhlh.asp?',{username:"admin_s",password:"admin_s",factorycode:chooseId,machicode:1});
          }
        }
        else{//外网跳转
          if(version.indexOf("flex")!=-1){
            this.post("http://"+this.getHostName()+"/HMIedge/redirectUrl",{tid:chooseId});
          }
          else if(version=="9000"){
            this.post("http://"+this.getHostName()+":9000/DS9000/Flex",{username:userName,id:chooseId,version:"flex"});
          }
          else if(version=="9100"){
            this.post("http://"+this.getHostName()+":9100");
          }
          else if(version=="8000"){
            this.post("http://"+this.getHostName()+"/zhlh.asp");
          }
        }
      },
      /* 搜索框点击跳转方法 */
      searchrouterTo(item){
        this.$refs.searchInput.value = item.name;
        let chooseId = item.id;
        let version = item.version;
        let user = JSON.parse(sessionStorage.getItem("user"));
        let userName = user.username;
        this.routerTo(chooseId,userName,version)
      },
      /* 返回上一级 */
      returnBack(){
        if(this.pagesNum!==1){
          this.pagesNum --;
        }
        let styleArr = [[],[],[],[],[],[],[]];
        if(this.chooseFacIndex===0){
          styleArr = this.sourceArr;
          this.earthOption.series[0].data = this.worldData;
        }else{
          styleArr[this.chooseFacIndex-1] = this.sourceArr[this.chooseFacIndex-1];
          this.earthOption.series[0].data = this.sourceArr[this.chooseFacIndex-1];
        }
        if(this.pagesNum===1){//地球
          this.show3D = true;
          earthChart.clear();
          earthChart.setOption(this.earthOption);
        }
        else if(this.pagesNum===2){//表示国家级别的地图
          this.option.geo.map = 'china';
          this.option.geo.zoom = 1.1;//省级地图将图缩小

          for(let i=0; i<this.option.series.length;i++){
              this.option.series[i].data = styleArr[i];
          }
          ChinaChart.clear();
          ChinaChart.setOption(this.option);
        }
      },
      /*搜索*/
      searchFac(){
        this.searchList = [];
        let search_text = this.$refs.searchInput.value;
        if(search_text.length>0){
          let test_atr = new RegExp(search_text);
          for(let i=0;i<this.fields_arr.length;i++){
            if(test_atr.test(this.fields_arr[i].name) || this.matchPinyin(this.fields_arr[i].name,search_text)){
              this.searchList.push(this.fields_arr[i]);
            }
          }
        }
      },
      /* 匹配拼音,匹配到返回true,否则返回flase */
      matchPinyin(matchVal, val) {
        return this.pinyin.match(matchVal, val)
      },
      /* 退出登录 */
      logout() {
        this.$getApi.logout()
        sessionStorage.clear()
        this.$router.push({ path: '/login' })
        // 刷新页面清空数据
      },
      /* 跳转链接的方法 */
      post(URL, PARAMS,target) {
        let temp = document.createElement("form");
        temp.action = URL;
        temp.style.display = "none";
        if(target!==1){
          temp.target="_blank";
          temp.method = "post";
        }
        else{
          temp.method = "get";
        }
        for (let x in PARAMS) {
          let opt = document.createElement("textarea");
          opt.name = x;
          opt.value = PARAMS[x];
          temp.appendChild(opt);
        }
        document.body.appendChild(temp);
        temp.submit();
        return temp;
      },
      getHostName() {
        return this.isInnerIPFn() ? '10.100.0.102':location.hostname;
      },
      /*判断是否是内网IP*/
      isInnerIPFn(){
        // 获取当前页面url
        let curPageUrl = window.location.href;

        let reg1 = /(http|ftp|https|www):\/\//g;//去掉前缀
        curPageUrl =curPageUrl.replace(reg1,'');

        let reg2 = /\:+/g;//替换冒号为一点
        curPageUrl =curPageUrl.replace(reg2,'.');
        curPageUrl = curPageUrl.split('.');//通过一点来划分数组

        if(curPageUrl[0]=="localhost"){
          return true;
        }
        let ipAddress = curPageUrl[0]+'.'+curPageUrl[1]+'.'+curPageUrl[2]+'.'+curPageUrl[3];

        let isInnerIp = false;//默认给定IP不是内网IP
        let ipNum = this.getIpNum(ipAddress);
        /**
         * 私有IP：A类  10.0.0.0    -10.255.255.255
         *       B类  172.16.0.0  -172.31.255.255
         *       C类  192.168.0.0 -192.168.255.255
         *       D类   127.0.0.0   -127.255.255.255(环回地址)
         **/
        let aBegin = this.getIpNum("10.0.0.0");
        let aEnd = this.getIpNum("10.255.255.255");
        let bBegin = this.getIpNum("172.16.0.0");
        let bEnd = this.getIpNum("172.31.255.255");
        let cBegin = this.getIpNum("192.168.0.0");
        let cEnd = this.getIpNum("192.168.255.255");
        let dBegin = this.getIpNum("127.0.0.0");
        let dEnd = this.getIpNum("127.255.255.255");
        isInnerIp = this.isInner(ipNum,aBegin,aEnd) || this.isInner(ipNum,bBegin,bEnd) || this.isInner(ipNum,cBegin,cEnd) || this.isInner(ipNum,dBegin,dEnd);
        return isInnerIp;
      },
      /*获取IP数*/
      getIpNum(ipAddress) {
        let ip = ipAddress.split(".");
        let a = parseInt(ip[0]);
        let b = parseInt(ip[1]);
        let c = parseInt(ip[2]);
        let d = parseInt(ip[3]);
        let ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
        return ipNum;
      },
      isInner(userIp,begin,end) {
        return (userIp >= begin) && (userIp <= end);
      },
    }
  };
</script>

<style lang="scss">
  .index-content-remo{
    position: relative;
    height: 100vh;
    width: 100vw;
    background: #000928;
    font-family: Source Han Sans CN;
    .backBtn{
      position: absolute;
      top: 105px;
      right: 430px;
      width: 94px;
      height: 38px;
      font-size: 18px;
      color: #00EAFF;
      background: url("~assets/images/remo/backBtn.png");
      z-index: 999;
      cursor: pointer;
      &:hover,&:active{
        background-color: #083079;
        color: #fff;
      }
    }
    #3Dmap{
      width: 100vw;
      height: 100vh;
    }
    #ChinaMap{
      width: 100vw;
      height: 100vh;
    }
    .header{
      position: absolute;
      left: 0;
      top: 20px;
      z-index: 2;
      width: 100%;
      padding-left: 35px;
      padding-right: 35px;
      display: grid;
      grid-template-columns: 300px 1fr 300px;
      .title{
        height: 68px;
        background-position: center top !important;
        background: url('~assets/images/remo/headBg.png') no-repeat;
        font-size: 32px;
        font-weight: 500;
        color: #00FFFF;
        line-height: 68px;
        text-align: center;
        position: relative;
      }
      .logo{
        margin-top: 15px;
        width: 106px;
        height: 39px;
        background-position: center top !important;
        background: url('~assets/images/remo/remoLogo.png') no-repeat;
      }
      .search{
        position: relative;
        .search-icon{
          position: absolute;
          left: 180px;
          top: 26px;
          font-size: 20px;
          color: #135074;
          cursor: pointer;
          &:hover,&:active{
            color: #36D9FF;
          }
        }
        .header-search-box{
          margin-top: 24px;
          width: 200px;
          height: 26px;
          padding: 0 20px 0 10px;
          border: 1px solid #1D6088;
          background: transparent;
          color: #fff!important;
          &::-webkit-input-placeholder{
            color:#135074;
          }
          &::-moz-placeholder{   /* Mozilla Firefox 19+ */
            color:#135074;
          }
          &:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            color:#135074;
          }
          &:-ms-input-placeholder{  /* Internet Explorer 10-11 */
            color:#135074;
          }
          &:focus,&:hover{
            outline: none;
            border: 1px solid #36D9FF!important;
          }
        }
        .search-list{
          background: rgba(26, 33, 51, 0.9);
          -moz-box-shadow:inset 0px 0px 54px 0px #0090ff;
          -webkit-box-shadow:inset 0px 0px 54px 0px #0090ff;
          box-shadow:inset 0px 0px 54px 0px #0090ff;
          max-height: 300px;
          overflow: auto;
          color:#fff;
          &::-webkit-scrollbar {
            // display: none;
            width: 8px;
            height: 8px;
          }
          &::-webkit-scrollbar-track {
            border-radius: 3px;
            background: rgb(239, 239, 239);
          }
          //滚动条的轨道（里面装有Thumb）
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background: rgba(48,115,255,1)
            // @include color7();
          }
          //滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
          &::-webkit-scrollbar-thumb:hover {
            background: rgba(48,115,255,1)
          }
          // 火狐
          -ms-overflow-style: none;
          overflow: -moz-scrollbars-none;
          .search-li{
            padding-left: 10px;
            width: 100%;
            cursor: pointer;
            height: 24px;
            line-height: 24px;
            font-size: 13px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:hover{
              color:#fff;
              background: rgba(48,115,255,0.8);
            }
          }
        }
        .out-btn{
          position: absolute;
          right: 0;
          top: 24px;
          width: 40px;
          height: 26px;
          font-size: 14px;
          border: 1px solid #36D9FF;
          border-radius: 4px;
          line-height: 24px;
          color: #00CCFF;
          text-align: center;
          cursor: pointer;
          &:hover,&:focus{
            background: #36D9FF;
            color: #fff;
          }
        }
      }
    }
    .left{
      position: absolute;
      left: 35px;
      top: 105px;
      z-index: 3;
      .left-factory{
        width: 372px;
        height: 599px;
        background-position: center top !important;
        background: url('~assets/images/remo/blockFactory.png') no-repeat;
        margin-bottom: 20px;
        position: relative;
        .factory-block{
          padding-top: 60px;
          .factory{
            display: flex;
            padding: 0 5px 0 15px;
            color: #fff;
            font-size: 12px;
            margin-bottom: 15px;
            cursor: pointer;
            opacity: 0.7;
            .img-block{
              color: #8CC4C9;
              margin-right: 5px;
              .img{
                width: 44px;
                height: 35px;
                border: 1px solid #5ED6FF;
                border-radius: 4px;
                justify-content: center;
                display: flex;
                align-items: center;
                i{
                  font-size: 24px;
                  color: #8CC4C9;
                }
              }
            }
            &.active{
              opacity: 1;
              .img-block{
                color: #00C4FF;
                .img{
                  border: 1px solid #00C4FF;
                  i{
                    color: #00C4FF;
                  }
                }
              }
            }

            .inputNum{
              flex: 1;
              .progress_area{
                display: inline-block;
                width: 210px;
                height: 13px;
                background: rgba(155, 176, 230, 0.2);
                border-radius: 15px;
                margin-bottom: 5px;
                vertical-align: middle;
              }
              .progress_bac{
                display: block;
                height: 100%;
                width: 0;
                background: #3073FF;
                border-radius: 10px;
                -moz-box-shadow:0px 0px 7px 0px #3073FF;
                -webkit-box-shadow:0px 0px 7px 0px #3073FF;
                box-shadow:0px 0px 7px 0px #3073FF;
                -moz-transition: width 1.5s ease-in-out;
                -webkit-transition:width 1.5s ease-in-out;
                transition: width 1.5s ease-in-out;
              }
            }
          }
        }
      }
      .left-expert{
        width: 372px;
        height: 232px;
        background-position: center top !important;
        background: url('~assets/images/remo/blockExpert.png') no-repeat;
        position: relative;
        .expert-block{
          display: flex;
          padding-top: 70px;
          justify-content: space-around;
          .block{
            flex: 1;
            color: #fff;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            .img-block{
              height: 75px;
            }
          }
        }
      }
    }
    .right{
      position: absolute;
      right: 35px;
      top: 105px;
      .right-health{
        width: 372px;
        height: 258px;
        background-position: center top !important;
        background: url('~assets/images/remo/blockHealth.png') no-repeat;
        margin-bottom: 40px;
        position: relative;
        padding-top: 40px;
        #healthChart{
          width: 100%;
          height: 210px;
        }
      }
      .right-device{
        width: 372px;
        height: 258px;
        background-position: center top !important;
        background: url('~assets/images/remo/blockDevice.png') no-repeat;
        margin-bottom: 40px;
        position: relative;
        padding-top: 40px;
        #deviceChart{
          width: 100%;
          height: 210px;
        }
      }
      .right-chain{
        width: 372px;
        height: 233px;
        background-position: center top !important;
        background: url('~assets/images/remo/blockChain.png') no-repeat;
        position: relative;
        padding-top: 60px;
        text-align: center;
        .chain-img{
          display: inline-block;
          text-align: center;
          width: 200px;
          img{
            width: 100%;
          }
        }
        .text{
          text-align: center;
          font-size: 24px;
          font-weight: 500;
          color: #00AEFF;
          line-height: 50px;
        }
      }
    }
    .block-title{
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 18px;
      font-weight: bold;
      color: #0FEEF2;
    }
    #loading-center-absolute {
      position: absolute;
      left: 50%;
      top: 50%;
      height: 50px;
      width: 150px;
      margin-top: -25px;
      margin-left: -75px;
    }
    .object {
      width: 8px;
      height: 50px;
      margin-right: 5px;
      background-color: #48b4e3;
      -webkit-animation: animate 1s infinite;
      animation: animate 1s infinite;
      float: left;
    }

    .object:last-child {
      margin-right: 0px;
    }

    .object:nth-child(10) {
      -webkit-animation-delay: 0.9s;
      animation-delay: 0.9s;
    }
    .object:nth-child(9) {
      -webkit-animation-delay: 0.8s;
      animation-delay: 0.8s;
    }
    .object:nth-child(8) {
      -webkit-animation-delay: 0.7s;
      animation-delay: 0.7s;
    }
    .object:nth-child(7) {
      -webkit-animation-delay: 0.6s;
      animation-delay: 0.6s;
    }
    .object:nth-child(6) {
      -webkit-animation-delay: 0.5s;
      animation-delay: 0.5s;
    }
    .object:nth-child(5) {
      -webkit-animation-delay: 0.4s;
      animation-delay: 0.4s;
    }
    .object:nth-child(4) {
      -webkit-animation-delay: 0.3s;
      animation-delay: 0.3s;
    }
    .object:nth-child(3) {
      -webkit-animation-delay: 0.2s;
      animation-delay: 0.2s;
    }
    .object:nth-child(2) {
      -webkit-animation-delay: 0.1s;
      animation-delay: 0.1s;
    }
    @-webkit-keyframes animate {
      50% {
        -ms-transform: scaleY(0);
        -webkit-transform: scaleY(0);
        transform: scaleY(0);
      }
    }
    @keyframes animate {
      50% {
        -ms-transform: scaleY(0);
        -webkit-transform: scaleY(0);
        transform: scaleY(0);
      }
    }
    @media screen and (max-width: 1380px) {
      .header{
        top: 15px;
        padding-left: 15px;
        padding-right: 15px;
        grid-template-columns: 220px 1fr 220px;
        .title{
          height: 49px;
          background: url('~assets/images/remo/headBgS.png') no-repeat;
          font-size: 23px;
          line-height: 49px;
        }
        .logo{
          margin-top: 10px;
          width: 76px;
          height: 28px;
          background: url('~assets/images/remo/remoLogoS.png') no-repeat;
        }
        .search{
          .search-icon{
            left: 120px;
            top: 16px;
            font-size: 16px;
          }
          .header-search-box{
            margin-top: 12px;
            width: 140px;
            font-size: 12px;
          }
          .out-btn{
            right: 0;
            top: 16px;
            width: 40px;
            height: 20px;
            font-size: 10px;
            line-height: 18px;
          }
        }
      }
      .left{
        position: absolute;
        left: 15px;
        top: 70px;
        .left-factory{
          width: 265px;
          height: 427px;
          margin-bottom: 10px;
          background: url('~assets/images/remo/blockFactoryS.png') no-repeat;
          .factory-block{
            padding-top: 40px;
            .factory{
              padding: 0 5px 0 10px;
              font-size: 12px;
              margin-bottom: 8px;
              .img-block{
                margin-right: 5px;
                .img{
                  width: 44px;
                  height: 25px;
                  border: 1px solid #5ED6FF;
                  border-radius: 4px;
                  i{
                    font-size: 18px;
                  }
                }
              }
              .inputNum{
                .progress_area{
                  width: 140px;
                  height: 8px;
                  border-radius: 8px;
                  margin-bottom: 3px;
                }
              }
            }
          }
        }
        .left-expert{
          width: 265px;
          height: 165px;
          background: url('~assets/images/remo/blockExpertS.png') no-repeat;
          .expert-block{
            padding-top: 40px;
            .block{
              font-size: 12px;
            }
          }
        }
      }
      .right{
        position: absolute;
        right: 15px;
        top: 70px;
        .right-health{
          width: 265px;
          height: 184px;
          background: url('~assets/images/remo/blockHealthS.png') no-repeat;
          margin-bottom: 10px;
          padding-top: 30px;
          #healthChart{
            width: 100%;
            height: 140px;
          }
        }
        .right-device{
          width: 265px;
          height: 184px;
          background: url('~assets/images/remo/blockDeviceS.png') no-repeat;
          margin-bottom: 10px;
          position: relative;
          padding-top: 30px;
          #deviceChart{
            width: 100%;
            height: 160px;
          }
        }
        .right-chain{
          width: 265px;
          height: 184px;
          background-position: center top !important;
          background: url('~assets/images/remo/blockChainS.png') no-repeat;
          position: relative;
          padding-top: 50px;
          .chain-img{

            width: 100px;
            img{
              width: 100%;
            }
          }
          .text{
            font-size: 18px;
            line-height: 50px;
          }
        }
      }
      .block-title{
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 13px;
      }
    }
    @media screen and (min-width: 3900px) {
      .header{
        top: 45px;
        padding-left: 75px;
        padding-right: 75px;
        grid-template-columns: 600px 1fr 600px;
        .title{
          height: 145px;
          background: url('~assets/images/remo/headBgB.png') no-repeat;
          font-size: 68px;
          line-height: 145px;
        }
        .logo{
          margin-top: 75px;
          width: 226px;
          height: 83px;
          background: url('~assets/images/remo/remoLogoB.png') no-repeat;
        }
        .search{
          .search-icon{
            left: 380px;
            top: 40px;
            font-size: 36px;
          }
          .header-search-box{
            margin-top: 30px;
            width: 425px;
            height: 55px;
            font-size: 30px;
          }
          .search-list{
            max-height: 500px;
            .search-li{
              padding-left: 20px;
              height: 36px;
              line-height: 36px;
              font-size: 24px;
            }
          }
          .out-btn{
            right: 0;
            top: 30px;
            width: 85px;
            height: 56px;
            font-size: 30px;
            line-height: 50px;
            border-radius: 9px;
          }
        }
      }
      .left{
        position: absolute;
        left: 75px;
        top: 344px;
        .left-factory{
          width: 717px;
          height: 1157px;
          margin-bottom: 40px;
          background: url('~assets/images/remo/blockFactoryB.png') no-repeat;
          .factory-block{
            padding-top: 125px;
            .factory{
              padding: 0 20px 0 30px;
              font-size: 23px;
              margin-bottom: 30px;
              .img-block{
                margin-right: 30px;
                .img{
                  width: 85px;
                  height: 67px;
                  border: 1px solid #5ED6FF;
                  border-radius: 9px;
                  i{
                    font-size: 40px;
                  }
                }
              }
              .inputNum{
                .progress_area{
                  width: 386px;
                  height: 26px;
                  border-radius: 26px;
                  margin-bottom: 3px;
                }
              }
            }
          }
        }
        .left-expert{
          width: 719px;
          height: 449px;
          background: url('~assets/images/remo/blockExpertB.png') no-repeat;
          .expert-block{
            padding-top: 160px;
            .block{
              font-size: 30px;
            }
          }
        }
      }
      .right{
        position: absolute;
        right: 75px;
        top: 344px;
        .right-health{
          width: 714px;
          height: 501px;
          background: url('~assets/images/remo/blockHealthB.png') no-repeat;
          margin-bottom: 100px;
          padding-top: 80px;
          #healthChart{
            width: 100%;
            height: 380px;
          }
        }
        .right-device{
          width: 714px;
          height: 500px;
          background: url('~assets/images/remo/blockDeviceB.png') no-repeat;
          margin-bottom: 100px;
          position: relative;
          padding-top: 100px;
          #deviceChart{
            width: 100%;
            height: 380px;
          }
        }
        .right-chain{
          width: 714px;
          height: 452px;
          background-position: center top !important;
          background: url('~assets/images/remo/blockChainB.png') no-repeat;
          position: relative;
          padding-top: 130px;
          text-align: center;
          .chain-img{
            width: 308px;
            img{
              width: 100%;
            }
          }
          .text{
            font-size: 46px;
            line-height: 100px;
          }
        }
      }
      .block-title{
        position: absolute;
        top: 20px;
        left: 25px;
        font-size: 35px;
      }
    }
  }
</style>
