<template>
  <!-- 叶轮 -->
  <div style="height:100%;">
    <div
      class="impeller-model"
      v-for="(param,key) in fdModelInfo"
      v-show="param.isShow"
    >
      <div class="impeller-line1">
        <div
          :class="[isAdmin ? 'line1-box-a':'line1-box' ]"
          class="impeller-line1-box1 Model-box"
        >
          <div class="Model-header">{{param.impellerDataName[0]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr
                v-for="(item,index) in param.impellerData"
                v-show="item.list_name === param.impellerDataName[0]"
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
                >{{$t('Impeller.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          :class="[isAdmin ? 'line1-box-a':'line1-box' ]"
          class="impeller-line1-box2 Model-box"
        >
          <div class="Model-header">{{param.impellerDataName[1]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr
                v-for="(item,index) in param.impellerData"
                v-show="item.list_name === param.impellerDataName[1]"
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
                >{{$t('Impeller.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          :class="[isAdmin ? 'line1-box-a':'line1-box' ]"
          class="impeller-line1-box3 Model-box"
        >
          <div class="Model-header">{{param.impellerDataName[2]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr
                v-for="(item,index) in param.impellerData"
                v-show="item.list_name === param.impellerDataName[2]"
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
                >{{$t('Impeller.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 管理员时显示叶片公共 -->
        <div
          class="impeller-line1-box4 line1-box-a Model-box"
          v-show="isAdmin"
        >
          <div class="Model-header">{{$t('Impeller.public')}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr
                v-for="(item,index) in param.impellerData"
                v-show="item.list_name == publicText"
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
                >{{$t('Impeller.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="impeller-line2 Model-box">
        <div class="Model-header"></div>
        <div class="Model-content">
          <div class="modelimg">
            <div class="imgexplain1">
              <div class="imgexplain-font">{{param.impellerDataName[0]}}</div>
            </div>
            <div class="imgexplain2">
              <div class="imgexplain-font">{{param.impellerDataName[1]}}</div>
            </div>
            <div class="imgexplain3">
              <div class="imgexplain-font">{{param.impellerDataName[2]}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from './modelCommon'
import { defaultCode, getUnit, round, cloneObj } from 'utils/utils.js'
export default {
  mixins: [common],
  name: 'fdimpeller',
  data() {
    return {
      fdModelInfo: {},
      currentKey: '',
      isAdmin: false, //是否为超级管理员
      publicText:'公共'
    }
  },
  created() {
    this.publicText = this.$t('Impeller.public')//'公共'

    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdimpeller',
    })
  },
  mounted() {
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (user.type == 0) {
      this.isAdmin = true
    }
    this.$nextTick(() => {
      // 防止火狐浏览器高度设置百分百失效
      let dom = document.getElementsByClassName('pro-scrollbar')
      for (let i = 0; i < dom.length; i++) {
        dom[i].style.height = `${dom[i].parentElement.clientHeight}px`
      }
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
            impellerData: [],
            impellerDataName: [this.$t('Impeller.impeller1'), this.$t('Impeller.impeller2'), this.$t('Impeller.impeller3')], //叶片部件名称:叶轮1、叶轮2、叶轮3
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
        this.$store.state.chooseTitle.name == 'fdimpeller'
      ) {
        if (param.isRequestDown) {
          param.isRequestDown = false
          this.$getApi.queryImpellerByMacId(requestData).then((res) => {
            param.isRequestDown = true
            if (res) {
              res.positions4 && this.setModelInfo(res.positions4)
            }
          })
        }
      } else {
        clearInterval(this.fdModelInfo[this.currentKey].timer)
      }
    },
    setModelInfo(pos) {
      const param = this.fdModelInfo[this.currentKey]
      // 提出模型叶片名称arr
      param.impellerData = pos
      //循环取默认特征值
      param.impellerData.forEach((element) => {
        element.position_type = element.pos_type
        let eigenvalue = defaultCode[element.pos_type]
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
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
              } else {
                //不存在
                eigenvalue.value = this.noDataText;//'无数据'
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
          eigenvalue.value = this.noDataText;//'无数据'
          if (eigenvalue.unit instanceof Array) {
            eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
          }
        }
        element.eigenvalue = cloneObj(eigenvalue)
      })
    },
  },
  watch: {
    '$store.state.fdimpellerMsg': {
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
.impeller-model {
  display: flex;
  flex-direction: row;
  height: 100%;
  .impeller-line1 {
    width: calc(33.3% - 14px);
    height: 100%;
    margin-right: 20px;
    /* 普通用户 */
    .line1-box {
      height: calc(33.3% - 13.3px);
      margin-bottom: 20px;
    }
    /* 管理员 */
    .line1-box-a {
      height: calc(25% - 15px);
      margin-bottom: 20px;
    }
  }
  .impeller-line2 {
    height: 100%;
    width: calc(66.6% + 6px);
    .Model-content {
      height: calc(100% - 36px);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelimg {
        width: 434px;
        height: 384px;
        background-image: url('~assets/images/fd/impellermodel.png');
        .imgexplain1 {
          width: 392px;
          height: 44px;
          position: relative;
          top: 15px;
          right: 174px;
          background-image: url('~assets/images/fd/impellerexplain1.png');
          .imgexplain-font {
            position: relative;
            left: 45px;
            top: 10px;
          }
        }
        .imgexplain2 {
          width: 222px;
          height: 109px;
          position: relative;
          top: 304px;
          left: 407px;
          background-image: url('~assets/images/fd/impellerexplain2.png');
          .imgexplain-font {
            position: relative;
            left: 131px;
            top: 77px;
          }
        }
        .imgexplain3 {
          width: 223px;
          height: 109px;
          position: relative;
          top: 205px;
          right: 195px;
          background-image: url('~assets/images/fd/impellerexplain3.png');
          .imgexplain-font {
            position: relative;
            left: 45px;
            top: 76px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .impeller-line2 {
      height: 100%;
      width: calc(66.6% + 6px);
      .Model-content {
        height: calc(100% - 36px);
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .modelimg {
          width: 260px;
          height: 230px;
          background-size: 100% 100%;
          background-image: url('~assets/images/fd/impellermodel.png');
          .imgexplain1 {
            width: 235px;
            height: 26px;
            position: relative;
            top: 15px;
            right: 39%;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/impellerexplain1.png');
            .imgexplain-font {
              position: relative;
              left: 11%;
              top: 11%;
            }
          }
          .imgexplain2 {
            width: 133px;
            height: 65px;
            position: relative;
            top: 72%;
            left: 82%;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/impellerexplain2.png');
            .imgexplain-font {
              position: relative;
              left: 52%;
              top: 66%;
            }
          }
          .imgexplain3 {
            width: 133px;
            height: 65px;
            position: relative;
            top: 49%;
            right: 38%;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/impellerexplain3.png');
            .imgexplain-font {
              position: relative;
              left: 17%;
              top: 66%;
            }
          }
        }
      }
    }
  }
}
</style>