<template>
  <!-- 塔筒 -->
  <div style="height:100%;">
    <div
      class="towerd-model"
      v-for="(param,key) in fdModelInfo"
      v-show="param.isShow"
    >
      <div class="towerd-line1">
        <div class="towerd-line1-box1 Model-box">
          <div class="Model-header">{{param.towerDrumDataName[0]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr
                v-for="(item,index) in param.towerDrumData"
                v-show="item.list_name === param.towerDrumDataName[0]"
              >
                <td
                  class="model-td"
                  :title="item.pos_name"
                >
                  <div
                    v-show="item.alarm_status == 0"
                    class="pos-state state-offline"
                  ></div>
                  <div
                    v-show="item.alarm_status == 1"
                    class="pos-state"
                  ></div>
                  <div
                    v-show="item.alarm_status == 2"
                    class="pos-state state-warn"
                  ></div>
                  <div
                    v-show="item.alarm_status == 3"
                    class="pos-state state-alarm"
                  ></div>
                  <div>{{item.pos_name}}</div>
                </td>
                <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
                <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('Common.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="towerd-line1-box2 Model-box">
          <div class="Model-header">{{param.towerDrumDataName[1]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr
                v-for="(item,index) in param.towerDrumData"
                v-show="item.list_name === param.towerDrumDataName[1]"
              >
                <td
                  class="model-td"
                  :title="item.pos_name"
                >
                  <div
                    v-show="item.alarm_status == 0"
                    class="pos-state state-offline"
                  ></div>
                  <div
                    v-show="item.alarm_status == 1"
                    class="pos-state"
                  ></div>
                  <div
                    v-show="item.alarm_status == 2"
                    class="pos-state state-warn"
                  ></div>
                  <div
                    v-show="item.alarm_status == 3"
                    class="pos-state state-alarm"
                  ></div>
                  <div>{{item.pos_name}}</div>
                </td>
                <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
                <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('Common.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="towerd-line1-box3 Model-box">
          <div class="Model-header">{{param.towerDrumDataName[2]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr
                v-for="(item,index) in param.towerDrumData"
                v-show="item.list_name === param.towerDrumDataName[2]"
              >
                <td
                  class="model-td"
                  :title="item.pos_name"
                >
                  <div
                    v-show="item.alarm_status == 0"
                    class="pos-state state-offline"
                  ></div>
                  <div
                    v-show="item.alarm_status == 1"
                    class="pos-state"
                  ></div>
                  <div
                    v-show="item.alarm_status == 2"
                    class="pos-state state-warn"
                  ></div>
                  <div
                    v-show="item.alarm_status == 3"
                    class="pos-state state-alarm"
                  ></div>
                  <div>{{item.pos_name}}</div>
                </td>
                <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
                <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('Common.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="towerd-line2 Model-box">
        <div class="Model-header"></div>
        <div class="model">
          <img
            :src="param.towerImg"
            style="height:85%;"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from './modelCommon'
import { defaultCode, getUnit, round, cloneObj } from 'utils/utils.js'
export default {
  name: 'fdtowerdrum',
  mixins: [common],
  data() {
    return {
      fdModelInfo: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdtowerdrum',
    })
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let mac
      for (let i in this.fdModelInfo) {
        this.fdModelInfo[i].isShow = false
        clearInterval(this.fdModelInfo[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.fdModelInfo)
      if (type === 0 || type === 1 || type === 4) {
        if (keyArr.indexOf(key) === -1) {
          type = 0
        } else {
          type = 1
        }
      }
      if (type === 0) {
        mac = cloneObj(this.$store.state.checkMsg.mac)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        mac = this.fdModelInfo[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.fdModelInfo, key, {
            mac,
            towerDrumData: [],
            towerDrumDataName: [this.$t('Common.engineroom'), this.$t('Common.towertop'), this.$t('Common.tower')], //塔筒部件名称:'机舱', '塔顶', '塔筒'
            towerImg: '',
            isRequestDown: true,
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.fdModelInfo[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.fdModelInfo, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.fdModelInfo[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        this.fdModelInfo[key].driveChainArr = []
        clearInterval(this.fdModelInfo[key].timer)
        let fn = () => {
          this.getModelInfo(mac)
          return fn
        }
        this.fdModelInfo[key].timer = setInterval(fn(), 5000)
      }
    },
    getModelInfo(mac) {
      const param = this.fdModelInfo[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
      }
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name == 'fdtowerdrum'
      ) {
        if (param.isRequestDown) {
          param.isRequestDown = false
          this.$getApi.queryTowerByMacId(requestData).then((res) => {
            param.isRequestDown = true
            if (res) {
              res.positions2 && this.setModelInfo(res.positions2)
            }
          })
        }
      } else {
        clearInterval(this.fdModelInfo[this.currentKey].timer)
      }
    },
    setModelInfo(pos) {
      const param = this.fdModelInfo[this.currentKey]
      param.towerDrumData = pos
      //循环取默认特征值
      param.towerDrumData.forEach((element) => {
        element.position_type = element.pos_type
        let eigenvalue = defaultCode[element.pos_type]
        if (element.position_type == 11) {
        }
        if (element.baseInfo != null && element.baseInfo.baseInfo != null) {
          for (let i in element.baseInfo.baseInfo) {
            if (i === defaultCode[element.pos_type].filed) {
              // eigenvalue = defaultCode[element.pos_type]
              if (
                element.baseInfo.baseInfo[i] !== null &&
                element.baseInfo.baseInfo[i] < 100000000
              ) {
                //若当前特征值存在
                eigenvalue.value = round(element.baseInfo.baseInfo[i], 2)
                eigenvalue.rvalue = element.baseInfo.baseInfo[i]
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
              } else {
                //不存在
                eigenvalue.value = this.$t('Common.noDataText')//'无数据'
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
              }
              if (eigenvalue.unit instanceof Array) {
                eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
              }
              break
            }
          }
        } else {
          eigenvalue.unit = getUnit(defaultCode[element.pos_type].code, element)
          eigenvalue.value = this.$t('Common.noDataText')//'无数据'
          if (eigenvalue.unit instanceof Array) {
            eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
          }
        }
        element.eigenvalue = cloneObj(eigenvalue)
      })
      // 判断如何确定塔筒图片
      /*  
        晃度确认AC
            1.找到posType==11的测点，取测点信息中的rock1_id,rock2_id确认晃度x晃度y的测点id
            2.通过posType==6与晃度测点id取出晃度x，y的信息
        倾角确认DC
            1.找到posType==13的测点，取测点信息中的rock1_id,rock2_id确认晃度x晃度y的测点id
            2.通过posType==12与晃度测点id取出晃度x，y的信息
      */
      let ac1 = [],
        ac2 = []
      param.towerDrumData.forEach((item) => {
        if (item.position_type == 11) {
          ac1.push(this.getXYpos(item)[0])
          ac2.push(this.getXYpos(item)[1])
        }
      })
      let ac1M = 0,
        ac2M = 0
      //取xy轴晃度最大值
      for (let i = 0; i < ac1.length; i++) {
        if (ac1M < ac1[i]) {
          ac1M = ac1[i]
        }
        if (ac2M < ac2[i]) {
          ac2M = ac2[i]
        }
      }
      if (ac1M > 0 || ac2M > 0) {
        if (ac1M > ac2M) {
          ac1M = 1
          ac2M = 0
        } else {
          ac1M = 0
          ac2M = 1
        }
      } else {
        if (ac1M > ac2M) {
          ac1M = 1
          ac2M = 0
        } else {
          ac1M = 0
          ac2M = 1
        }
      }
      if (ac1M > 0 || ac2M > 0) {
        param.towerImg = require(`assets/images/fd/towerdrum/DC+0AC${ac1M}${ac2M}_M.gif`)
      } else {
        param.towerImg = require(`assets/images/fd/towerdrum/DC+0AC${ac1M}${ac2M}_M.png`)
      }
    },
    getXYpos(pos) {
      const param = this.fdModelInfo[this.currentKey]
      let ac1 = -1,
        ac2 = -1
      if (
        pos.configBaseInfo &&
        pos.configBaseInfo.rock1_id &&
        pos.configBaseInfo.rock2_id
      ) {
        for (let i = 0; i < param.towerDrumData.length; i++) {
          let value = param.towerDrumData[i]
          if (
            value.pos_type == 6 &&
            pos.configBaseInfo.rock1_id == value.pos_id
          ) {
            // 取晃度x
            if (
              value.eigenvalue.value != this.$t('Common.noDataText') &&
              value.eigenvalue.rvalue > 0
            ) {
              ac1 = value.eigenvalue.rvalue
            } else {
              ac1 = -1
            }
          } else if (
            value.pos_type == 6 &&
            pos.configBaseInfo.rock2_id == value.pos_id
          ) {
            //取晃度y
            if (
              value.eigenvalue.value != this.$t('Common.noDataText') &&
              value.eigenvalue.rvalue > 0
            ) {
              ac2 = value.eigenvalue.rvalue
            } else {
              ac2 = -1
            }
          }
          if (ac1 > 0 && ac2 > 0) {
            if (ac1 > ac2) {
              ac2 = -1
            } else {
              ac1 = -1
            }
          }
          // else if(pos.pos_type == 13 && value.pos_type == 12 && pos.configBaseInfo.rock1_id == value.pos_id) { //取倾角x
          // } else if(pos.pos_type == 13 && value.pos_type == 12 && pos.configBaseInfo.rock2_id == value.pos_id) { //取倾角y
          // }
        }
      }
      return [ac1, ac2]
    },
  },
  watch: {
    '$store.state.fdtowerdrumMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.key, item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.towerd-model {
  display: flex;
  flex-direction: row;
  height: 100%;
  .towerd-line1 {
    width: calc(33.3% - 14px);
    height: 100%;
    margin-right: 20px;
    .towerd-line1-box1 {
      height: calc(33.3% - 13px);
      width: 100%;
      margin-bottom: 20px;
    }
    .towerd-line1-box2 {
      height: calc(33.3% - 13px);
      width: 100%;
      margin-bottom: 20px;
    }
    .towerd-line1-box3 {
      height: calc(33.3% - 13px);
      width: 100%;
    }
  }
  .towerd-line2 {
    height: 100%;
    width: calc(66.6% + 6px);
    .model {
      height: calc(100% - 35px);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>