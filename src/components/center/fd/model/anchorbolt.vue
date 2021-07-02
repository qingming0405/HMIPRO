<template>
  <!-- 锚栓 -->
  <div style="height:100%;">
    <div
      class="abolt-model"
      :ref="'aboltModel'+key"
      v-for="(param,key) in fdModelInfo"
      v-show="param.isShow"
    >
      <div class="abolt-model-box1 Model-box">
        <div class="Model-header">{{$t('Anchorbolt.base')}}</div>
        <table class="model-table">
          <tbody class="my-table-tbody pro-scrollbar">
            <tr v-for="(item,idx) in param.flangeData" class="model-tr" @click="toReal(item)">
              <td
                class="model-td"
                :title="item.pos_name"
              >
                <!-- 离线 -->
                <div
                  v-show="item.alarm_status===0"
                  class="pos-state state-offline"
                ></div>
                <!-- 正常 -->
                <div
                  v-show="item.alarm_status===1"
                  class="pos-state"
                ></div>
                <!-- 预警 -->
                <div
                  v-show="item.alarm_status===2"
                  class="pos-state state-warn"
                ></div>
                <!-- 报警 -->
                <div
                  v-show="item.alarm_status===3"
                  class="pos-state state-alarm"
                ></div>
                <div>{{item.pos_name}}</div>
              </td>
              <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
              <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
              <td
                class="model-td3"
              >{{$t('Anchorbolt.moreText')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="abolt-model-box2 Model-box">
        <div class="Model-header">{{$t('Anchorbolt.anchorBoltModel')}}</div>
        <div class="Model-content">
          <img
            class="modelimg-1"
            src="~assets/images/fd/aboltmodel1.png"
          />
          <!-- <img
          class="modelimg-2"
          src="~assets/images/fd/aboltmodel2.png"
        /> -->
          <canvas
            class="modelimg-2"
            :ref="'flange_canvas'+key"
            width="349"
            height="349"
          ></canvas>
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
  name: 'fdanchorbolt',
  data() {
    return {
      fdModelInfo: {},
      currentKey: '',
      noDataText:'无数据',
    }
  },
  created() {
    this.noDataText = this.$t('Common.noDataText');

    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdanchorbolt',
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
            flangeData: [],
            //法兰图表
            flangeTable: [],
            //法兰画图
            flangeInfo: [],
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
    //获取法兰螺栓画图数据+图表数据
    getModelInfo(mac) {
      let requestData = {
        mac_id: mac.mac_id,
      }
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name == 'fdanchorbolt'
      ) {
        if (this.isRequestDown) {
          this.isRequestDown = false
          this.$getApi.queryAnchorByMacId(requestData).then((res) => {
            this.isRequestDown = true
            if (res) {
              res && res.anchor && this.setModelInfo(res.anchor)
            }
          })
        }
      } else {
        clearInterval(this.fdModelInfo[this.currentKey].timer)
      }
    },
    setModelInfo(res) {
      let pos = res
      this.flangeData = res
      this.flangeData.forEach((element) => {
        let status = config.generalStutas
        if (status && element.alarm_status == 0) {
          element.alarm_status = 1
        }
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
                eigenvalue.value = this.$t('Common.noDataText')//'无数据'
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
              }
              if (eigenvalue.unit instanceof Array) {
                eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
              }
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
      this.$nextTick(this.drawflangeInfo(this.flangeData[0].flangeInfo))
    },
    drawflangeInfo(flangeInfo) {
      var machines = []
      var cWidth = 324
      var cHeight = 324
      this.$refs[`flange_canvas${this.currentKey}`][0].style.width =
        cWidth + 'px'
      this.$refs[`flange_canvas${this.currentKey}`][0].width = cWidth
      this.$refs[`flange_canvas${this.currentKey}`][0].style.height =
        cHeight + 'px'
      this.$refs[`flange_canvas${this.currentKey}`][0].height = cHeight
      var flange_canvas
      var pi
      var x_0 = 162 //法兰大白圈圆心x坐标
      var y_0 = 162 //法兰大白圈圆心y坐标
      var r_0 = 145 //法兰大白圈半径
      var r_small = 6 //螺栓半径
      var num //螺栓总个数
      var fillColor = '#34538a'
      // 盒子的最终宽度大于1220时，法兰模型宽高设定为605*605
      if (this.$refs.aboltModel.offsetWidth > 1220) {
        cWidth = 324
        cHeight = 324
        flange_canvas = this.$refs[`flange_canvas${this.currentKey}`][0]
        pi = flange_canvas.getContext('2d')
        x_0 = 162
        y_0 = 162
        r_0 = 145
        r_small = 4 //小圆直径
        fillColor = '#34538a'
        // flange_canvas.addEventListener('click', function (event) {
        //   var p = getEventPosition(event)
        //   this.drawCanvas(p, arrs)
        // })
        this.drawCanvas(x_0, y_0, r_0, r_small, fillColor, flangeInfo)
      } else {
        // this.drawCanvas()
      }
    },
    drawCanvas(x, y, r, r_small, fillColor, flangeInfo) {
      let boltposition = this.flangeTable[flangeInfo.byName]
      var flange_canvas = this.$refs[`flange_canvas${this.currentKey}`][0]
      var pi = flange_canvas.getContext('2d')
      var tower_canvas_x = flange_canvas.getBoundingClientRect().left
      var tower_canvas_y = flange_canvas.getBoundingClientRect().top
      pi.clearRect(
        tower_canvas_x,
        tower_canvas_y,
        flange_canvas.width,
        flange_canvas.height
      )
      var num = Number(flangeInfo.bolt_sum)
      var angles = Number(360 / num)
      //开始一个新的绘制路径
      pi.beginPath()
      pi.lineWidth = 35 //大圆边框宽度
      //设置弧线的颜色
      pi.strokeStyle = 'white'
      var circle = {
        x: x, //圆心的x轴坐标值
        y: y, //圆心的y轴坐标值
        r: r, //圆的半径
      }
      //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
      pi.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false)
      //按照指定的路径绘制弧线
      pi.stroke()
      for (var i = 0; i < num; i++) {
        var x2 = Number(x) + Number(r * Math.cos((angles * i * Math.PI) / 180))
        var Y2 = Number(y) + Number(r * Math.sin((angles * i * Math.PI) / 180))
        //开始一个新的绘制路径
        pi.beginPath()
        //设置弧线的颜色
        pi.fillStyle = fillColor
        var circle_s = {
          x: x2, //圆心的x轴坐标值
          y: Y2, //圆心的y轴坐标值
          r: r_small, //圆的半径
        }
        //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
        pi.arc(circle_s.x, circle_s.y, circle_s.r, 0, Math.PI * 2, false)
        pi.fill()
        //画出螺母
        /* for (let j = 0; j < boltposition.length; j++) {
          if (boltposition[j].bolt_num === i) {
            let color = 'green'
            if(boltposition[j].alarm_status === 2){//预警
              color = '#ffa101'
            } else if(boltposition[j].alarm_status === 3){//报警
              color = '#f80000'
            }
            pi.beginPath()
            //设置弧线的颜色
            pi.fillStyle = color
            var circle_s = {
              x: x2, //圆心的x轴坐标值
              y: Y2, //圆心的y轴坐标值
              r: r_small+2, //圆的半径
            }
            //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
            pi.arc(circle_s.x, circle_s.y, circle_s.r, 0, Math.PI * 2, false)
            pi.fill()
          }
        } */
        // let towertitle = new Image()
        // towertitle.src = require('../../../../assets/images/fd/flange_normal.png')
        // if (towertitle.complete) {
        //   pi.drawImage(
        //     towertitle,
        //     circle_s.x-6, circle_s.y-5
        //   )
        // } else {
        //   towertitle.onload = () => {
        //     pi.drawImage(
        //       towertitle,
        //       circle_s.x, circle_s.y
        //     )
        //   }
        //   towertitle.onerror = function () {
        //     console.log('canvas加载图片失败')
        //   }
        // }
        for (let j = 0; j < this.flangeData.length; j++) {
          let boltposition = this.flangeData[j]
          if (boltposition.bolt_num === i) {
            let bolt = new Image()
            bolt.src = require('../../../../assets/images/fd/flange_normal.png')
            if (boltposition.alarm_status === 2) {
              //预警
              bolt.src = require('../../../../assets/images/fd/flange_warn.png')
            } else if (boltposition.alarm_status === 3) {
              //报警
              bolt.src = require('../../../../assets/images/fd/flange_alarm.png')
            } else if (boltposition.alarm_status == 0) {
              //离线
              bolt.src = require('../../../../assets/images/fd/flange_offline.png')
            }
            if (bolt.complete) {
              pi.drawImage(bolt, circle_s.x - 6, circle_s.y - 5) //将图片放
            } else {
              bolt.onload = () => {
                pi.drawImage(bolt, circle_s.x - 6, circle_s.y - 5) //将图片放入canvas
              }
              bolt.onerror = function () {
                console.log('canvas加载图片失败')
              }
            }
          }
        }
      }
    },
  },
  watch: {
    '$store.state.fdanchorboltMsg': {
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
.abolt-model {
  display: flex;
  flex-direction: row;
  height: 100%;
  .abolt-model-box1 {
    height: 100%;
    width: calc(33.3% - 14px);
    margin-right: 20px;
  }
  .abolt-model-box2 {
    height: 100%;
    width: calc(66.6% + 6px);
    .Model-content {
      height: calc(100% - 36px);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelimg-1 {
        width: 30%;
        margin: 60px;
      }
      .modelimg-2 {
        width: 349px;
        height: 349px;
        margin: 60px;
      }
    }
  }
}
</style>>>>>>>> .r1033
