<template>
  <!-- 基础 -->
  <div style="height:100%;">
    <div
      class="base-model"
      v-for="(param,key) in fdModelInfo"
      v-show="param.isShow"
    >
      <div class="base-model-box1 Model-box">
        <div class="Model-header">{{$t('Basics.base')}}</div>
        <table class="model-table">
          <tbody class="my-table-tbody pro-scrollbar">
            <tr v-for="(item,index) in param.basicsData">
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
              <td v-if="item.eigenvalue.value !== '无数据'">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
              <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
              <td
                class="model-td3"
                @click="toReal(item)"
              >{{$t('Basics.moreText')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="base-model-box2 Model-box">
        <div class="Model-header">
        </div>
        <div class="Model-content">
          <img
            class="modelimg"
            src="~assets/images/fd/basemodel.png"
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
  mixins: [common],
  name: 'fdbasics',
  data() {
    return {
      fdModelInfo: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdbasics',
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
            basicsData: [],
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
        console.log('创建定时器')
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
        this.$store.state.chooseTitle.name == 'fdbasics'
      ) {
        if (param.isRequestDown) {
          param.isRequestDown = false
          this.$getApi.queryBasicsByMacId(requestData).then((res) => {
            param.isRequestDown = true
            if (res) {
              res.basics && this.setModelInfo(res.basics)
            }
          })
        }
      } else {
        clearInterval(this.fdModelInfo[this.currentKey].timer)
      }
    },
    setModelInfo(pos) {
      const param = this.fdModelInfo[this.currentKey]
      param.basicsData = pos
      //循环取默认特征值
      param.basicsData.forEach((element) => {
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
                eigenvalue.value = '无数据'
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
          eigenvalue.value = '无数据'
          if (eigenvalue.unit instanceof Array) {
            eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
          }
        }
        element.eigenvalue = cloneObj(eigenvalue)
      })
    },
  },
  watch: {
    '$store.state.fdbasicsMsg': {
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
<style scoped lang="scss">
.base-model {
  display: flex;
  flex-direction: row;
  height: 100%;
  .base-model-box1 {
    height: 100%;
    width: calc(33.3% - 14px);
    margin-right: 20px;
  }
  .base-model-box2 {
    height: 100%;
    width: calc(66.6% + 6px);
    .Model-content {
      height: calc(100% - 36px);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelimg {
        width: 56%;
      }
    }
  }
}
</style>