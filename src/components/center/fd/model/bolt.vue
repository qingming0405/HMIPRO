<template>
  <!-- 螺栓 -->
  <div style="height:100%;">
    <div
      class="Model"
      :ref="'boltModel'+key"
      v-for="(param,key) in fdModelInfo"
      v-show="param.isShow"
    >
      <div class="bolt-model">
        <div class="bolt-table">
          <!-- <div class="bolt-column1"> -->
          <div
            v-for="(el,index) in param.flangeInfo"
            class="bolt-column-box Model-box"
            :ref="'bolt-column-box'+key+index"
          >
            <div class="Model-header">{{el.byName}}</div>
            <table class="model-table">
              <tbody class="my-table-tbody pro-scrollbar">
                <tr
                  v-for="(item,idx) in param.flangeData"
                  v-if="item.list_name === el.byName"
                   class="model-tr" @click="toReal(item)"
                >
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
                  >{{$t('Bolt.moreText')}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div class="bolt-column1-box2 Model-box">
          <div class="Model-header"></div>
        </div> -->
          <!-- </div> -->
          <!-- <div class="bolt-column2">
        <div class="bolt-column2-box1 Model-box">
          <div class="Model-header"></div>
        </div>
        <div class="bolt-column2-box2 Model-box">
          <div class="Model-header"></div>
        </div>
        <div class="bolt-column2-box3 Model-box">
          <div class="Model-header"></div>
        </div>
      </div> -->
        </div>
        <div class="bolt-column3 Model-box">
          <div class="Model-header">{{$t('Bolt.boltModel')}}</div>
          <div class="Model-content">
            <canvas
              :ref="'flange_tower'+key"
              class="flange_tower"
            ></canvas>
            <canvas
              :ref="'flange_canvas'+key"
              class="flange_canvas"
            ></canvas>
          </div>
        </div>
      </div>
      <div
        class="empty-edge"
        v-show="param.flangeInfo.length == 0"
      >
        <img :src="param.imgBg" />
      </div>
    </div>
  </div>
</template>
<script>
import common from './modelCommon'
import { defaultCode, getUnit, round, cloneObj } from 'utils/utils.js'
export default {
  mixins: [common],
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
      keepAlive: 'fdbolt',
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
            imgBg: require('assets/images/indexLogoBg2.png'),
            x: 0,
            y: 0,
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
    //判断塔筒和法兰位置并画出
    drawTower(x, y) {
      const param = this.fdModelInfo[this.currentKey]
      var flangeTower = this.$refs[`flange_tower${this.currentKey}`][0]
      var flangeTowerx = flangeTower.getContext('2d')
      // flangeTowerx.drawImage(tower, 137, 0) //将图片放入canvas
      let width = flangeTower.offsetWidth
      let height = flangeTower.offsetHeight
      //法兰个数/塔筒高度，平均分布法兰
      let flangenum = param.flangeInfo.length //设定法兰个数假数据为10
      for (let i = 1; i <= flangenum; i++) {
        this.drawflangeLine(
          param.flangeInfo[i - 1].color,
          flangeTowerx,
          i,
          flangenum,
          height
        )
        let twidth = 155
        let theight = 44
        let fontsize = '16px bold 黑体'
        let oH = 6 /* 字体偏移 */
        if (flangeTower.height == 339) {
          /* 适配1366 */
          twidth = 93
          theight = 26.4
          fontsize = '9px bold 黑体'
          oH = -6
        }
        // 画title,默认显示第一个
        if (param.x === 0 && param.y === 0) {
          if (i === 1) {
            let towertitle = new Image()
            towertitle.src = require('../../../../assets/images/fd/flange_titile.png')

            if (towertitle.complete) {
              flangeTowerx.drawImage(
                towertitle,
                twidth / 3 + 3 - i,
                (height / (flangenum + 1)) * i - 23,
                twidth,
                theight
              )
              flangeTowerx.font = fontsize
              // 设置颜色
              flangeTowerx.fillStyle = '#ffffff'
              flangeTowerx.fillText(
                param.flangeInfo[i - 1].byName,
                twidth / 3 + 10 - i,
                (height / (flangenum + 1)) * i + oH
              )
            } else {
              towertitle.onload = () => {
                flangeTowerx.drawImage(
                  towertitle,
                  twidth / 3 + 3 + i,
                  (height / (flangenum + 1)) * i - 22,
                  twidth,
                  theight
                )
                flangeTowerx.font = fontsize
                // 设置颜色
                flangeTowerx.fillStyle = '#ffffff'
                flangeTowerx.fillText(
                  param.flangeInfo[i - 1].byName,
                  twidth / 3 + 10 - i,
                  (height / (flangenum + 1)) * i + oH
                )
              }
              towertitle.onerror = function () {
                console.log('canvas加载图片失败')
              }
            }
            this.drawflange(param.flangeInfo[i - 1])
          }
        } else if (
          x > 182 - i &&
          x < 253 + i &&
          y > (height / (flangenum + 1)) * i - 20 &&
          y < (height / (flangenum + 1)) * i + 20
        ) {
          let towertitle = new Image()
          towertitle.src = require('../../../../assets/images/fd/flange_titile.png')
          if (towertitle.complete) {
            flangeTowerx.drawImage(
              towertitle,
              56 - i,
              (height / (flangenum + 1)) * i - 22
            )
            flangeTowerx.font = '16px bold 黑体'
            // 设置颜色
            flangeTowerx.fillStyle = '#ffffff'
            flangeTowerx.fillText(
              param.flangeInfo[i - 1].byName,
              62 - i,
              (height / (flangenum + 1)) * i + 6
            )
          } else {
            towertitle.onload = () => {
              flangeTowerx.drawImage(
                towertitle,
                55 + i,
                (height / (flangenum + 1)) * i - 22
              )
              flangeTowerx.font = '16px bold 黑体'
              // 设置颜色
              flangeTowerx.fillStyle = '#ffffff'
              flangeTowerx.fillText(
                param.flangeInfo[i - 1].byName,
                62 - i,
                (height / (flangenum + 1)) * i + 6
              )
            }
            towertitle.onerror = function () {
              console.log('canvas加载图片失败')
            }
          }
          this.drawflange(param.flangeInfo[i - 1])
        } else if (
          param.x > 182 - i &&
          param.x < 253 + i &&
          param.y > (height / (flangenum + 1)) * i - 20 &&
          param.y < (height / (flangenum + 1)) * i + 20
        ) {
          let towertitle = new Image()
          towertitle.src = require('../../../../assets/images/fd/flange_titile.png')
          if (towertitle.complete) {
            flangeTowerx.drawImage(
              towertitle,
              56 - i,
              (height / (flangenum + 1)) * i - 22
            )
            flangeTowerx.font = '16px bold 黑体'
            // 设置颜色
            flangeTowerx.fillStyle = '#ffffff'
            flangeTowerx.fillText(
              param.flangeInfo[i - 1].byName,
              62 - i,
              (height / (flangenum + 1)) * i + 6
            )
          } else {
            towertitle.onload = () => {
              flangeTowerx.drawImage(
                towertitle,
                55 + i,
                (height / (flangenum + 1)) * i - 22
              )
              flangeTowerx.font = '16px bold 黑体'
              // 设置颜色
              flangeTowerx.fillStyle = '#ffffff'
              flangeTowerx.fillText(
                param.flangeInfo[i - 1].byName,
                62 - i,
                (height / (flangenum + 1)) * i + 6
              )
            }
            towertitle.onerror = function () {
              console.log('canvas加载图片失败')
            }
          }
          this.drawflange(param.flangeInfo[i - 1])
        }
        // flangeTowerx.drawImage(tower,96 + i, height / (flangenum + 1) * i)
        flangeTowerx.stroke()
      }
      flangeTower.removeEventListener('click', this.clickEvent)
      flangeTower.addEventListener('click', this.clickEvent)
    },
    drawflangeLine(color, flangeTowerx, i, flangenum, height) {
      let x0 = 202
      let x1 = 233
      let num = 0
      if (this.$refs[`flange_tower${this.currentKey}`][0].height == 339) {
        /* 适配1366 */
        x0 = 120
        x1 = 140
        num = -6
      }
      let k = 0
      if ((height / (flangenum + 1)) * i > 525) {
        k = 6
      } else if ((height / (flangenum + 1)) * i > 350) {
        k = 4
      } else if ((height / (flangenum + 1)) * i > 175) {
        k = 2
      }
      flangeTowerx.beginPath()
      flangeTowerx.strokeStyle = color //设定直线颜色
      flangeTowerx.moveTo(x0 - k, (height / (flangenum + 1)) * i + num)
      flangeTowerx.lineTo(x1 + k, (height / (flangenum + 1)) * i + num)
      flangeTowerx.lineWidth = 5
      flangeTowerx.stroke()
    },
    clickEvent(e) {
      const param = this.fdModelInfo[this.currentKey]
      var p = this.getEventPosition(e)
      let x = p.x
      let y = p.y
      param.x = x
      param.y = y
      this.drawflangeTower(x, y)
    },
    // 获取点击位置
    getEventPosition(event) {
      var flangeTower = this.$refs[`flange_tower${this.currentKey}`][0]
      var x_this = event.clientX - flangeTower.getBoundingClientRect().left
      var y_this = event.clientY - flangeTower.getBoundingClientRect().top
      var flangeTowerx = flangeTower.getContext('2d')
      // flangeTower.removeEventListener('click',getEventPosition(),false);
      flangeTowerx.clearRect(0, 0, flangeTower.width, flangeTower.height)
      return { x: x_this, y: y_this }
      // this.drawTower();
    },
    //加载图片
    drawflangeTower(x = 0, y = 0) {
      this.$refs[`flange_tower${this.currentKey}`][0].width = this.$refs[
        `flange_tower${this.currentKey}`
      ][0].clientWidth
      this.$refs[`flange_tower${this.currentKey}`][0].height = this.$refs[
        `flange_tower${this.currentKey}`
      ][0].clientHeight
      var flangeTower = this.$refs[`flange_tower${this.currentKey}`][0]
      var flangeTowerx = flangeTower.getContext('2d')
      let tower = new Image()
      tower.src = require('../../../../assets/images/fd/flange.png')
      if (tower.complete) {
        if (this.$refs[`flange_tower${this.currentKey}`][0].height == 339) {
          /* 适配1366 */
          flangeTowerx.drawImage(tower, 82, 0, 97, 339) //将图片放入canvas
        } else {
          flangeTowerx.drawImage(tower, 137, 0) //将图片放入canvas
        }
        this.drawTower(x, y)
      } else {
        tower.onload = () => {
          if (this.$refs[`flange_tower${this.currentKey}`][0].height == 339) {
            /* 适配1366 */
            flangeTowerx.drawImage(tower, 82, 0, 97, 339) //将图片放入canvas
          } else {
            flangeTowerx.drawImage(tower, 137, 0) //将图片放入canvas
          }
          this.drawTower(x, y)
        }
        tower.onerror = function () {
          console.log('canvas加载图片失败')
        }
      }
      flangeTowerx.stroke()
    },
    drawflange(flangeInfo) {
      var machines = []
      let dom = this.$refs[`flange_canvas${this.currentKey}`][0]
      var cWidth = dom.clientWidth
      var cHeight = dom.clientHeight
      dom.style.width = cWidth + 'px'
      dom.width = cWidth
      dom.style.height = cHeight + 'px'
      dom.height = cHeight
      var flange_canvas
      var pi
      var x_0 = cWidth / 2 //法兰大白圈圆心x坐标
      var y_0 = cWidth / 2 //法兰大白圈圆心y坐标

      var r_small = 6 //螺栓半径
      var num //螺栓总个数
      var fillColor = '#34538a'
      // 盒子的最终宽度大于1220时，法兰模型宽高设定为605*605
      if (this.$refs[`boltModel${this.currentKey}`][0].offsetWidth > 1220) {
        var r_0 = cWidth / 2 - 17 //法兰大白圈半径
        flange_canvas = dom
        pi = flange_canvas.getContext('2d')
        r_small = 4 //小圆直径
        fillColor = '#34538a'
        // flange_canvas.addEventListener('click', function (event) {
        //   var p = getEventPosition(event)
        //   this.drawCanvas(p, arrs)
        // })
        this.drawCanvas(x_0, y_0, r_0, r_small, fillColor, flangeInfo)
      } else {
        flange_canvas = dom
        pi = flange_canvas.getContext('2d')
        var r_0 = cWidth / 2 - 15 //法兰大白圈半径
        r_small = 3 //小圆直径
        fillColor = '#34538a'
        this.drawCanvas(x_0, y_0, r_0, r_small, fillColor, flangeInfo)
      }
    },
    drawCanvas(x, y, r, r_small, fillColor, flangeInfo) {
      const param = this.fdModelInfo[this.currentKey]
      let boltposition = param.flangeTable[flangeInfo.byName]
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
      var num = flangeInfo.bolt_sum
      var angles = Number(360 / num)
      //开始一个新的绘制路径
      pi.beginPath()
      let bheight = 13
      let bwidth = 13
      let lineWidth = 25
      let ow = 6
      if (this.$refs[`flange_tower${this.currentKey}`][0].height == 339) {
        /* 适配1366 */
        bheight = 8
        bwidth = 8
        lineWidth = 15
        ow = 4
      }
      pi.lineWidth = lineWidth //大圆边框宽度
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
        for (let j = 0; j < boltposition.length; j++) {
          if (boltposition[j].bolt_num === i + 1) {
            let bolt = new Image()
            bolt.src = require('../../../../assets/images/fd/flange_normal.png')
            if (boltposition[j].alarm_status == 2) {
              //预警
              bolt.src = require('../../../../assets/images/fd/flange_warn.png')
            } else if (boltposition[j].alarm_status == 3) {
              //报警
              bolt.src = require('../../../../assets/images/fd/flange_alarm.png')
            } else if (boltposition[j].alarm_status == 0) {
              //离线
              bolt.src = require('../../../../assets/images/fd/flange_offline.png')
            }
            if (bolt.complete) {
              pi.drawImage(
                bolt,
                circle_s.x - ow,
                circle_s.y - 5,
                bwidth,
                bwidth
              ) //将图片放
            } else {
              const x = circle_s.x - ow,
                y = circle_s.y - 5
              bolt.onload = () => {
                pi.drawImage(bolt, x, y, bwidth, bwidth) //将图片放入canvas
              }
              bolt.onerror = function () {
                console.log('canvas加载图片失败')
              }
            }
          }
        }
      }
    },
    //获取法兰螺栓画图数据+图表数据
    getModelInfo(mac) {
      const param = this.fdModelInfo[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
      }
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name == 'fdbolt'
      ) {
        if (param.isRequestDown) {
          param.isRequestDown = false
          this.$getApi.queryBoltByMacId(requestData).then((res) => {
            param.isRequestDown = true
            if (res) {
              res && res.positions3 && this.setModelInfo(res.positions3)
            } else {
            }
          })
        }
      } else {
        clearInterval(this.fdModelInfo[this.currentKey].timer)
      }
    },
    //处理法兰螺栓画图数据+图表数据
    setModelInfo(res) {
      const param = this.fdModelInfo[this.currentKey]
      let pos = res
      param.flangeData = res
      let flangeName = [] //去重后的法兰名称
      //获取法兰列表
      for (let k = 0; k < pos.length; k++) {
        let item = pos[k]
        if (item.flangeInfo && item.flangeInfo.byName) {
          flangeName.push(item.flangeInfo.byName)
        }
      }
      //获得去重后的法兰名称
      flangeName = [...new Set(flangeName)]
      //获得  [法兰名称：pos数组,法兰名称：pos数组]
      for (let i = 0; i < flangeName.length; i++) {
        let item = flangeName[i]
        let arr = []
        for (let k = 0; k < pos.length; k++) {
          if (
            pos[k].flangeInfo &&
            pos[k].flangeInfo.byName &&
            item === pos[k].flangeInfo.byName
          ) {
            arr.push(pos[k])
          }
        }
        this.$set(param.flangeTable, item, arr)
      }
      //获取法兰信息数组
      let flange = []
      for (let k in param.flangeTable) {
        flange.push(param.flangeTable[k][0].flangeInfo)
      }
      let f = {}
      //更具安装位置法兰信息排序
      for (let i = 0; i < flange.length; i++) {
        if (flange[i].pos_loc === '31') {
          f.flange0 = flange[i]
        } else if (flange[i].pos_loc === '35') {
          f.flange1 = flange[i]
        } else if (flange[i].pos_loc === '36') {
          f.flange2 = flange[i]
        } else if (flange[i].pos_loc === '37') {
          f.flange3 = flange[i]
        } else if (flange[i].pos_loc === '38') {
          f.flange4 = flange[i]
        } else if (flange[i].pos_loc === '32') {
          f.flange5 = flange[i]
        } else if (flange[i].pos_loc === '33') {
          f.flange6 = flange[i]
        } else if (flange[i].pos_loc === '34') {
          f.flange7 = flange[i]
        } else {
          // pos_loc === '255'为未知位置
          if (f.flange8) {
            f.flange8.push(flange[i])
          } else {
            f.flange8 = []
            f.flange8.push(flange[i])
          }
        }
      }
      param.flangeInfo = []
      for (let i = 0; i < 9; i++) {
        if (f[`flange${i}`]) {
          if (f[`flange${i}`] instanceof Array) {
            for (let k = 0; k < f[`flange${i}`].length; k++) {
              param.flangeInfo = param.flangeInfo.concat(f[`flange${i}`][k])
            }
          } else {
            param.flangeInfo = param.flangeInfo.concat(f[`flange${i}`])
          }
        }
      }
      for (let i = 0; i < param.flangeInfo.length; i++) {
        let alarm_flag, warn_flag, flag
        param.flangeData.forEach((item) => {
          let status = config.generalStutas
          if (status && item.alarm_status == 0) {
            item.alarm_status = 1
          }
          if (param.flangeInfo[i].byName == item.list_name) {
            if (item.alarm_status == 1) {
              flag = true
            } else if (item.alarm_status == 2) {
              warn_flag = true
            } else if (item.alarm_status == 3) {
              alarm_flag = true
            }
          }
        })
        if (alarm_flag === true) {
          param.flangeInfo[i].color = '#f80000'
        } else if (warn_flag === true) {
          param.flangeInfo[i].color = '#ffa101'
        } else if (flag === true) {
          param.flangeInfo[i].color = '#009944'
        } else {
          param.flangeInfo[i].color = '#0a53a0'
        }
      }
      //循环取默认特征值
      param.flangeData.forEach((element) => {
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
      //若法兰个数超过两个，限定宽度为
      if (this.$refs[`boltModel${this.currentKey}`][0]) {
        this.$nextTick(this.drawflangeTower(), this.setMtableStyle())
      }
      /* this.setMtableStyle() */
    },
    /* 根据法兰数据长度设置表格高度宽度 */
    setMtableStyle() {
      const param = this.fdModelInfo[this.currentKey]
      let tableSum = param.flangeInfo.length
      this.$nextTick(() => {
        if (tableSum < 2) {
          for (let i = 0; i < tableSum; i++) {
            this.$refs[
              `bolt-column-box${this.currentKey}${i}`
            ][0].style.height = '100%'
            this.$refs[`bolt-column-box${this.currentKey}${i}`][0].style.width =
              'calc(100% - 20px)'
          }
        } else if (tableSum === 2) {
          for (let i = 0; i < tableSum; i++) {
            // this.$refs[`bolt-column-box${i}`][0].style.height = 'calc(100% - 20px)'
            this.$refs[`bolt-column-box${this.currentKey}${i}`][0].style.width =
              'calc(50% - 20px)'
          }
        } else if (tableSum >= 3) {
          for (let i = 0; i < tableSum; i++) {
            let rowNum = parseInt(tableSum / 2)
            this.$refs[`bolt-column-box${this.currentKey}${i}`][0].style.width =
              'calc(50% - 20px)'
            let height = `calc(100%/${rowNum} - ${20 * rowNum}/${rowNum + 1}px)`
            if (rowNum > 5) {
              height = '295px'
            }
            this.$refs[
              `bolt-column-box${this.currentKey}${i}`
            ][0].style.height = height
            if (i >= 2) {
              this.$refs[`bolt-column-box${this.currentKey}${i}`][0].style =
                'margin-top:20px;'
              this.$refs[
                `bolt-column-box${this.currentKey}${i}`
              ][0].style.height = height
              this.$refs[
                `bolt-column-box${this.currentKey}${i}`
              ][0].style.width = 'calc(50% - 20px)'
            }
          }
        }
      })
    },
  },
  watch: {
    '$store.state.fdboltMsg': {
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
.bolt-model {
  display: flex;
  flex-direction: row;
  height: 100%;
  .bolt-table {
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 200px;
    width: calc(52% + 20px);
    flex-wrap: wrap;
    overflow: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .bolt-table::-webkit-scrollbar {
    width: 0 !important;
  }
  .bolt-column-box {
    // height: 100%;
    // width: 100%;
    margin-right: 20px;
  }
  .bolt-column1,
  .bolt-column2 {
    width: calc(50% - 10px);
    height: 100%;
    margin-right: 20px;
  }
  .bolt-column1-box1 {
    height: calc(50% - 10px);
    width: 100%;
    margin-bottom: 20px;
  }
  .bolt-column1-box2 {
    height: calc(50% - 10px);
    width: 100%;
  }
  .bolt-column2-box1,
  .bolt-column2-box2 {
    height: calc(33.3% - 13px);
    width: 100%;
    margin-bottom: 20px;
  }
  .bolt-column2-box3 {
    height: calc(33.4% - 14px);
    width: 100%;
  }
  .bolt-column3 {
    width: calc(48% - 20px);
    height: 100%;
    .Model-content {
      width: 100%;
      height: calc(100% - 36px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.flange_tower {
  width: 300px;
  height: 665px;
}
.flange_canvas {
  width: 324px;
  height: 324px;
}
@media screen and (max-width: 1366px) {
  .flange_tower {
    width: 180px;
    height: 339px;
  }
  .flange_canvas {
    width: 195px;
    height: 195px;
  }
}
.empty-edge {
  position: absolute;
  top: 134px;
  left: 210px;
  width: 100%;
  height: 100%;
  background-color: #092e56;
  img {
    width: 82%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
.Model {
  width: 100%;
  height: 100%;
}
</style>
