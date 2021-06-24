<template>
  <div>
    <div class="model-view">
      <div
        class="model-content"
        v-for="(param,index) in gjModel"
        v-show="param.isShow"
      >
        <div class="title-text">{{param.title}}</div>
        <div
          class="car"
          :class="'carType' + param.mac_type "
        >
          <div
            class="carBox"
            v-for="(car,index) in param.macInfo"
            :class="'carBox'+param.mac_type+car.index"
            @dblclick="getPosInfo(car)"
          >
            <div class="alarm-content">
              <img :src="car.alarmImg">
              <p
                class="alarmText"
                :class="'alarmState' + car.alarm_status"
              >{{car.alarmText}}</p>
              <p class="carName">{{car.pump_name}}</p>
            </div>
          </div>
          <img
            :src="param.carImg"
            class="carModel"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { round, cloneObj } from 'utils/utils.js'
export default {
  name: 'gjModel',
  data() {
    return {
      gjModel: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'gjModel',
    })
  },
  watch: {
    '$store.state.gjModelMsg': {
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
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId] = key.split('_')
      let mac, title
      for (let i in this.gjModel) {
        this.gjModel[i].isShow = false
        clearInterval(this.gjModel[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.gjModel)
      if (type === 0 || type === 1 || type === 4) {
        if (keyArr.indexOf(key) === -1) {
          type = 0
          title = cloneObj(this.$store.state.chooseTitle.generalTitle)
        } else {
          type = 1
        }
      }
      if (type === 0) {
        mac = cloneObj(this.$store.state.checkMsg.mac)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        mac = this.gjModel[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.gjModel, key, {
            mac,
            title, //左上角标题
            treeName: '大连地铁',
            macName: 'FG2001号车',
            searchKey: '',
            carImg: '',
            mac_type: 4,
            macInfo: [],
            timer: '', //定时器
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.gjModel[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.gjModel, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.gjModel[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let fn = () => {
          this.getMacInfo()
          return fn
        }
        this.gjModel[key].timer = setInterval(fn(), 6000)
      }
    },
    getMacInfo() {
      let _this = this
      const params = this.gjModel[this.currentKey]
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name == 'gjModel'
      ) {
        let mac = params.mac
        let requestData = {
          mac_id: mac.mac_id,
          t_root: 2,
        }
        this.$getApi
          .queryPumpInfoByMacId(requestData)
          .then((res) => {
            if (res) {
              if (res.car_num) {
                params.mac_type = res.car_num
              }
              _this.setBgPic(params.mac_type) /* 获取车厢节数图片 */
              params.macInfo = res.data
              if (params.macInfo.length) {
                params.macInfo.forEach((pump, index) => {
                  pump.index = pump.baseInfo.car_id //车厢号
                  if (pump.dgm_type == 3) {
                    if (
                      pump.pump_name == 'TC1号车厢' ||
                      pump.pump_name == 'Tc号车厢'
                    ) {
                      pump.index = 1
                    } else if (
                      pump.pump_name == 'MP1号车厢' ||
                      pump.pump_name == 'Mc号车厢'
                    ) {
                      pump.index = 2
                    } else if (pump.pump_name == 'MP2号车厢') {
                      pump.index = 3
                    } else if (pump.pump_name == 'TC2号车厢') {
                      pump.index = 4
                    }
                  }
                  // 总貌图配置
                  let stutas = config.generalStutas
                  if (stutas && pump.alarm_status == 0) {
                    pump.alarm_status = 1
                  }
                  // pump.index = index+1

                  switch (Number(pump.alarm_status)) {
                    case 0: //'离线'
                      pump.alarmImg = require('assets/images/gj/offline.png')
                      pump.alarmText = this.$t('GjModel.offlineText')
                      break
                    case 1: //'正常'
                      pump.alarmImg = require('assets/images/gj/normal.png')
                      pump.alarmText = this.$t('GjModel.normalText')
                      break
                    case 2: //'预警'
                      pump.alarmImg = require('assets/images/gj/warning.png')
                      pump.alarmText = this.$t('GjModel.warnText')
                      break
                    case 3: //'Ⅰ级报警'
                      pump.alarmImg = require('assets/images/gj/alarm1.png')
                      pump.alarmText = this.$t('GjModel.alarm1Text')
                      break
                    case 4: //'Ⅱ级报警'
                      pump.alarmImg = require('assets/images/gj/alarm2.png')
                      pump.alarmText = this.$t('GjModel.alarm2Text')
                      break
                  }
                })
                params.macInfo.sort(_this.compare('index'))
              }
            } else {
            }
          })
          .catch((err) => {
            console.log('请求失败')
          })
      } else {
        clearInterval(params.timer)
      }
    },
    //根据属性值排序
    compare(property) {
      return function (a, b) {
        let value1 = a[property]
        let value2 = b[property]
        return value1 - value2
      }
    },
    setBgPic(type) {
      let gjModelflag = config.gjModel
      const param = this.gjModel[this.currentKey]
      switch (Number(type)) {
        case 4:
          if (config.gjModel == 0) {
            param.carImg = require('assets/images/gj/fourCars.png')
          } else if (config.gjModel == 1) {
            param.carImg = require('assets/images/gj/fourCars1.png')
          }
          break
        case 6:
          param.carImg = require('assets/images/gj/sixCars.png')
          break
        case 8:
          param.carImg = require('assets/images/gj/eightCars.png')
          break
      }
    },
    getPosInfo(car) {
      /* 从vuex中获取当前机组 */
      const param = this.gjModel[this.currentKey]
      let mac = param.mac
      let macArray = this.$store.state.mac[mac.t_id]
      let choosemac = this.$store.state.checkMsg.mac
      let choosetree = cloneObj(this.$store.state.checkMsg.tree)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.pump_id == mac.pump_id) {
          if (choosemac.t_id != choosetree.t_id) {
            let treeArray = this.$store.state.tree
            treeArray.forEach((tree) => {
              if (choosemac.t_id == tree.t_id) {
                this.$store.commit('getCheckMsg', {
                  msg: cloneObj(tree),
                  type: 'tree',
                })
                this.$store.commit('getCheckMsg', {
                  msg: cloneObj(choosemac),
                  type: 'mac',
                })
                resolve('成功')
              }
            })
          }
          resolve('成功')
        } else {
          for (let i = 0; i < macArray.length; i++) {
            if (macArray[i].pump_id == mac.pump_id) {
              /* 设置当前的机组 */
              if (macArray[i].t_id != choosetree.t_id) {
                let treeArray = this.$store.state.tree
                treeArray.forEach((tree) => {
                  if (macArray[i].t_id == tree.t_id) {
                    this.$store.commit('getCheckMsg', {
                      msg: cloneObj(tree),
                      type: 'tree',
                    })
                  }
                })
              }
              this.$store.commit('getCheckMsg', {
                msg: macArray[i],
                type: 'mac',
              })
              resolve('成功')
              break
            }
          }
        }
      }).then(() => {
        this.$store.commit('setGeneralModel', {
          key: this.currentKey,
          router: 'gjModelInfo',
        })
        let params = {
          key: this.currentKey,
          val: this.$t('YtModel.macModel'), //'设备模型',
          name: 'gjModelInfo',
          icon: 'icon-shijingsanwei-',
        }
        this.$bus.$emit('getPath', params)
      })
    },
  },
}
</script>

<style scoped lang="scss">
.model-view {
  .model-view-f1 {
    margin: 20px 15px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
  }
  .model-content {
    margin-top: 150px;
    .car {
      margin: 0 auto;
      position: relative;
      &.carType4 {
        width: 63%;
      }
      &.carType6 {
        width: 95%;
      }
      &.carType8 {
        width: 98%;
      }
      .carModel {
        width: 100%;
        margin: 269px 0;
      }
      .carBox {
        width: 267px;
        height: 269px;
        position: absolute;
        text-align: center;
        background-image: url('~assets/images/gj/out-box.png');
        .alarm-content {
          margin-top: 8px;
        }
      }
      .carBox41,
      .carBox61,
      .carBox81 {
        top: 0;
      }
      .carBox43 {
        top: 0;
        left: 50%;
      }
      .carBox42 {
        bottom: 0;
        left: 25.8%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox44 {
        bottom: 0;
        left: 73.7%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox63 {
        top: 0;
        left: 33.4%;
      }
      .carBox65 {
        top: 0;
        left: 65.6%;
      }
      .carBox62 {
        bottom: 0;
        left: 16.7%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox64 {
        bottom: 0;
        left: 50%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox66 {
        bottom: 0;
        left: 82.3%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox83 {
        top: 0;
        left: 24.8%;
      }
      .carBox85 {
        top: 0;
        left: 46.7%;
      }
      .carBox87 {
        top: 0;
        left: 69%;
      }
      .carBox82 {
        bottom: 0;
        left: 13.6%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox84 {
        bottom: 0;
        left: 35.9%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox86 {
        bottom: 0;
        left: 58.8%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .carBox88 {
        bottom: 0;
        left: 82%;
        background-image: url('~assets/images/gj/out-box2.png');
        .alarm-content {
          margin-top: 135px;
        }
      }
      .alarmText {
        font-size: 20px;
      }
      .carName {
        font-size: 14px;
      }
      .alarmState0 {
        color: #0646a7;
      }
      .alarmState1 {
        color: #009944ff;
      }
      .alarmState2 {
        color: #c0b000;
      }
      .alarmState3 {
        color: #ffa101;
      }
      .alarmState4 {
        color: #f80000;
      }
    }
  }
  @media screen and (max-height: 800px) {
    /*当屏幕尺寸高度小于800px时，应用下面的CSS样式*/
    .model-content {
      margin-top: 10px;
    }
  }
  @media screen and (max-width: 1366px) {
    /*当屏幕尺寸高度小于800px时，应用下面的CSS样式*/
    .model-content {
      margin-top: 40px;
      .car {
        .carBox {
          width: 220px;
          background-image: url('~assets/images/gj/out-box1.png');
          .alarm-content {
            margin-top: 20px;
          }
        }
        .carModel {
          width: 100%;
          margin: 225px 0;
        }
        .carBox42,
        .carBox44 {
          background-image: url('~assets/images/gj/out-box21.png');
          .alarm-content {
            margin-top: 155px;
          }
        }
        .carBox62,
        .carBox64,
        .carBox66 {
          background-image: url('~assets/images/gj/out-box21.png');
          .alarm-content {
            margin-top: 155px;
          }
        }
        .carBox82,
        .carBox84,
        .carBox86,
        .carBox88 {
          background-image: url('~assets/images/gj/out-box21.png');
          .alarm-content {
            margin-top: 155px;
          }
        }
        .alarmText {
          font-size: 16px;
        }
        .carName {
          font-size: 13px;
        }
        .alarm-content {
          img {
            width: 50%;
          }
        }
      }
    }
  }
}
.general-search {
  position: absolute;
  top: 9px;
  right: 170px;
  input {
    width: 260px;
    height: 32px;
    background: #007eff;
    opacity: 0.3;
    border-radius: 2px;
    border: none;
  }
  input::-webkit-input-placeholder {
    color: #6facec;
  }
  input::-moz-input-placeholder {
    color: #6facec;
  }
  input::-ms-input-placeholder {
    color: #6facec;
  }
}
</style>
