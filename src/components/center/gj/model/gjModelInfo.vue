<template>
  <div>
    <div
      class="modelInfo-view"
      v-for="(params,key) in gjModelInfo"
      v-show="params.isShow"
    >
      <div class="title-text">{{params.title}}</div>
      <div class="gjBtn">
        <button
          class="modelInfo-btn"
          @click="goToModel()"
        >{{$t('GjModelInfo.runningBtn')}}</button>
      </div>
      <div
        class="model-content"
        :ref='"model_content"+key'
        :v-resize="params.isShow ? resize:''"
      >
        <div class="model-pic">
          <div class="model-title">{{$t('GjModelInfo.runningTitle')}}</div>
          <div class="canvas-content">
            <div
              class="canvasOut"
              :ref='"canvasOut1"+key'
            >
              <canvas
                :id='"canvasLeft"+key'
                class="canvasLeft"
              ></canvas>
              <canvas
                :id='"canvasLeftPoint"+key'
                class="canvasLeftPoint"
              ></canvas>
              <canvas
                :id='"canvasLeftTitle"+key'
                class="canvasLeftTitle"
              ></canvas>
            </div>
            <div
              class="canvasOut"
              :ref='"canvasOut2"+key'
            >
              <canvas
                :id='"canvasRight"+key'
                class="canvasRight"
              ></canvas>
              <canvas
                :id='"canvasRightPoint"+key'
                class="canvasRightPoint"
              ></canvas>
              <canvas
                :id='"canvasRightTitle"+key'
                class="canvasRightTitle"
              ></canvas>
            </div>
          </div>
        </div>
        <div class="model-info">
          <table class='model-info-table'>
            <thead class='model-thead'>
              <tr class='my-table-tr'>
                <th
                  class='text-overflow'
                  v-for='(item, idx) in params.head'
                  :key=idx
                >{{item}}</th>
              </tr>
            </thead>
            <tbody
              class='model-tbody'
              ref="tbody"
            >
              <tr
                class='my-table-tr'
                v-for='(tr, idx) in params.body'
                :key=idx
                :class='tr.class'
                @dblclick="toAlarm(tr)"
              >
                <td class='text-overflow'><span
                    class="circle_type"
                    :class="'circle_color' + tr.alarm_status"
                  ></span>{{tr.ch_name}}</td>
                <td class='text-overflow'>{{tr.chInfo}}</td>
                <!-- <td class='text-overflow'>{{tr.alarm_text}}</td> -->
                <td class='text-overflow'>{{tr.vib_text}}</td> <!-- 振动报警 -->
                <td class='text-overflow'>{{tr.temp_text}}</td> <!-- 温度报警 -->
                <td class='text-overflow'>{{tr.fix_text}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        v-show="params.noneData"
        class="none-Data"
      ><img :src="params.imgBg" /></div>

    </div>
  </div>

</template>

<script>
import { cloneObj } from 'utils/utils.js'
export default {
  name: 'gjModelInfo',
  data() {
    const vm = window.vm
    return {
      vm: vm,
      gjModelInfo: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'gjModelInfo',
    })
  },
  watch: {
    '$store.state.gjModelInfoMsg': {
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
  deactivated() {
    clearInterval(this.gjModelInfo[this.currentKey].timer)
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId] = key.split('_')
      let mac, title
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.gjModelInfo)
      if (type === 0 || type === 1 || type === 4) {
        if (keyArr.indexOf(key) === -1) {
          type = 0
          title = cloneObj(this.$store.state.chooseTitle.generalTitle)
        } else {
          type = 1
        }
      }
      for (let i in this.gjModelInfo) {
        this.gjModelInfo[i].isShow = false
        clearInterval(this.gjModelInfo[i].timer)
      }
      if (type === 0) {
        mac = cloneObj(this.$store.state.checkMsg.mac)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        mac = this.gjModelInfo[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.gjModelInfo, key, {
            title,
            mac,
            treeName: '大连地铁',
            macName: 'FG2001号车',
            searchKey: '',
            // head: [
            //   '通道名称',
            //   '安装位置',
            //   '振动报警类型',
            //   '温度报警类型',
            //   '维修建议',
            // ],
            head: [
              vm.$t('GjModelInfo.headChname'),
              vm.$t('GjModelInfo.headLoc'),
              vm.$t('GjModelInfo.headVibAlarm'),
              vm.$t('GjModelInfo.headTempAlarm'),
              vm.$t('GjModelInfo.headAdvice'),
            ],
            body: [],
            canvasLeft: null, //底部图片dom
            canvasLeftPoint: null, //点dom
            cxtLeftPoint: null, //点canvas
            canvasLeftTitle: null,
            canvasRightTitle: null, //标签canvas
            cxtLeft: null, //底部图标canvas
            titleRight: null,
            titleLeft: null,
            canvasLeftData: {}, //左画图数据
            canvasRightData: {},
            canvasRight: null,
            canvasRightPoint: null,
            cxtRightPoint: null,
            cxtRight: null,
            points1: [
              //左
            ],
            positionObj: {
              //位置信息
              '1_7': { x: 0.18, y: 0.23 }, //1轴7位
              '3_7': { x: 0.18, y: 0.23 }, //3轴7位
              '1_6': { x: 0.27, y: 0.32 }, //1轴6位
              '3_6': { x: 0.27, y: 0.32 }, //3轴6位
              '3_1': { x: 0.18, y: 0.76 }, //3轴1位
              '1_1': { x: 0.18, y: 0.76 }, //1轴1位
              '3_2': { x: 0.27, y: 0.48 }, //3轴2位
              '1_2': { x: 0.27, y: 0.48 }, //3轴2位
              '3_5': { x: 0.18, y: 0.64 }, //3轴5位
              '1_5': { x: 0.18, y: 0.64 }, //1轴5位
              '1_8': { x: 0.12, y: 0.68 }, //1轴8位
              '3_8': { x: 0.12, y: 0.68 }, //3轴8位
              '3_4': { x: 0.27, y: 0.64 }, //3轴4位
              '1_4': { x: 0.27, y: 0.64 }, //1轴4位
              '3_3': { x: 0.27, y: 0.68 }, //3轴3位
              '1_3': { x: 0.27, y: 0.68 }, //1轴3位
              '4_1': { x: 0.82, y: 0.23 }, //4轴1位
              '2_1': { x: 0.82, y: 0.23 }, //2轴1位
              '4_2': { x: 0.73, y: 0.5 }, //4轴2位
              '2_2': { x: 0.73, y: 0.5 }, //2轴2位
              '4_3': { x: 0.73, y: 0.32 }, //4轴3位
              '2_3': { x: 0.73, y: 0.32 }, //2轴3位
              '4_4': { x: 0.73, y: 0.32 }, //4轴4位
              '2_4': { x: 0.73, y: 0.32 }, //2轴4位
              '4_5': { x: 0.82, y: 0.36 }, //4轴5位
              '2_5': { x: 0.82, y: 0.32 }, //2轴5位
              '4_6': { x: 0.73, y: 0.68 }, //4轴6位
              '2_6': { x: 0.73, y: 0.68 }, //2轴6位
              '4_7': { x: 0.82, y: 0.76 }, //4轴7位
              '2_7': { x: 0.82, y: 0.76 }, //2轴7位
              '4_8': { x: 0.77, y: 0.36 }, //4轴8位
              '2_8': { x: 0.77, y: 0.36 }, //2轴8位
            },
            points2: [
              //右
            ],
            pic1: null,
            pic2: null,
            timer: '',
            position1: null,
            position2: null,
            imgBg: require('assets/images/indexLogoBg2.png'),
            noneData: true,
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.gjModelInfo[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.gjModelInfo, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.gjModelInfo[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        clearInterval(this.gjModelInfo[key].timer)
        let fn = () => {
          this.getMacInfo()
          return fn
        }
        this.gjModelInfo[key].timer = setInterval(fn(), 6000)
      }
    },
    resize() {
      const params = this.gjModelInfo[this.currentKey]
      let dom = this.$refs[`model_content${this.currentKey}`][0]
      let width = dom.clientWidth
      params.pic1 = null
      params.pic2 = null
      if (params.canvasLeft && params.canvasRight) {
        params.canvasLeft.width = params.canvasRight.width = width / 2 - 1
        params.canvasLeftPoint.width = params.canvasRightPoint.width =
          width / 2 - 1
      }
      clearInterval(params.timer)
      let fn = () => {
        this.getMacInfo()
        return fn
      }
      params.timer = setInterval(fn(), 6000)
    },
    getMacInfo() {
      const params = this.gjModelInfo[this.currentKey]
      let _this = this
      let mac = params.mac
      let requestData = {
        mac_id: mac.mac_id,
        pump_id: mac.pump_id,
        t_root: 2,
      }
      let modelpoints1 = []
      let modelpoints2 = []
      this.$getApi.queryPumpChInfo(requestData).then((res) => {
        if (res) {
          let info = []
          if (res.data.length) {
            params.noneData = false
            res.data.forEach((ch) => {
              if (ch.pos_class != 0 && ch.pos_loc != 255) {
                ch.chInfo = ch.pos_class + '轴' + ch.pos_loc + '位'
              } else {
                ch.chInfo = '—'
              }
              ch.pump_id = mac.pump_id
              // 总貌图配置
              let stutas = config.generalStutas
              if (stutas && ch.alarm_status == 0) {
                ch.alarm_status = 1
              }
              switch (ch.alarm_status) {
                case 0: //'离线'
                  ch.color = '#ccc'
                  ch.alarm_text = vm.$t('GjModelInfo.offlineText')
                  ch.fix_text = vm.$t('GjModelInfo.offlineAdvice')
                  break
                case 1: //'正常'
                  ch.color = '#009944'
                  ch.alarm_text = vm.$t('GjModelInfo.normalText')
                  ch.fix_text = vm.$t('GjModelInfo.normalAdvice')
                  break
                case 2: //'预警'
                  ch.color = '#BFAF00FF'
                  ch.alarm_text = vm.$t('GjModelInfo.warnText')
                  ch.fix_text = vm.$t('GjModelInfo.warnAdvice')
                  break
                case 3: //'Ⅰ级报警'
                  ch.color = '#FF9B21FF'
                  ch.alarm_text = vm.$t('GjModelInfo.alarm1Text')
                  ch.fix_text = vm.$t('GjModelInfo.alarm1Advice')
                  break
                case 4: //'Ⅱ级报警'
                  ch.color = '#F70000FF'
                  ch.alarm_text = vm.$t('GjModelInfo.alarm2Text')
                  ch.fix_text = vm.$t('GjModelInfo.alarm2Advice')
                  break
              }
              // 温度报警
              switch (ch.temp_status) {
                case 0: //'离线'
                  ch.temp_text = vm.$t('GjModelInfo.offlineText')
                  break
                case 1: //'正常'
                  ch.temp_text = vm.$t('GjModelInfo.normalText')
                  break
                case 2: //'预警'
                  ch.temp_text = vm.$t('GjModelInfo.warnText')
                  break
                case 3: //'Ⅰ级报警'
                  ch.temp_text = vm.$t('GjModelInfo.alarm1Text')
                  break
                case 4: //'Ⅱ级报警'
                  ch.temp_text = vm.$t('GjModelInfo.alarm2Text')
                  break
              }
              // 总貌图配置
              if (stutas && ch.vib_status == 0) {
                ch.vib_status = 1
              }
              // 整栋报警
              switch (ch.vib_status) {
                case 0: //'离线'
                  ch.vib_text = vm.$t('GjModelInfo.offlineText')
                  break
                case 1: //'正常'
                  ch.vib_text = vm.$t('GjModelInfo.normalText')
                  break
                case 2: //'预警'
                  ch.vib_text = vm.$t('GjModelInfo.warnText')
                  break
                case 3: //'Ⅰ级报警'
                  ch.vib_text = vm.$t('GjModelInfo.alarm1Text')
                  break
                case 4: //'Ⅱ级报警'
                  ch.vib_text = vm.$t('GjModelInfo.alarm2Text')
                  break
              }
              if (ch.pos_class == 1 || ch.pos_class == 2) {
                //1轴、2轴
                if (params.positionObj[ch.pos_class + '_' + ch.pos_loc]) {
                  ch.x = params.positionObj[ch.pos_class + '_' + ch.pos_loc].x
                  ch.y = params.positionObj[ch.pos_class + '_' + ch.pos_loc].y
                  modelpoints1.push(ch)
                } else {
                  console.log('该点不在机组上')
                }
              } else if (ch.pos_class == 3 || ch.pos_class == 4) {
                //3轴、4轴
                if (params.positionObj[ch.pos_class + '_' + ch.pos_loc]) {
                  ch.x = params.positionObj[ch.pos_class + '_' + ch.pos_loc].x
                  ch.y = params.positionObj[ch.pos_class + '_' + ch.pos_loc].y
                  modelpoints2.push(ch)
                } else {
                  console.log('该点不在机组上')
                }
              }
              info.push(ch)
            })
          } else {
            params.noneData = true
          }
          params.body = info
          if (info[0] && info[0].dgm_type == 3) {
            /* 机组的排序 */
            let compare = function (obj1, obj2) {
              let val1 = obj1.ch_name
              let val2 = obj2.ch_name
              if (val1 < val2) {
                return -1
              } else if (val1 > val2) {
                return 1
              } else {
                return 0
              }
            }
            params.body = info.sort(compare)
          }
          params.points1 = modelpoints1
          params.points2 = modelpoints2
          params.canvasLeft = null
          // _this.cxtLeft = null
          params.canvasRight = null
          // _this.cxtRight = null
          _this.drawPicture(Number(mac.pump_type))
        } else {
          params.noneData = false
        }
      })
      //
    },
    /* 双击进入报警 */
    toAlarm(item) {
      if (item.dgm_type != 3) {
        if (item.ch_type == 2) {
          this.$pop(vm.$t('Common.noAlarmTips')) //转速通道无报警！
          return
        }
        let key = `alarm_enter_${item.pump_id}_${item.dgmInfo.dgm_id}_${item.ch_type}_${item.ch_id}`
        let name = vm.$t('Common.AlarmLog') //'报警日志'
        this.$bus.$emit('choiceChartType', key, name)
        this.$store.commit('setChName', item.ch_name)
      } else {
        console.log('无预警')
      }
    },
    // 画
    drawPicture(type) {
      const params = this.gjModelInfo[this.currentKey]
      let that = this
      let flag = this.getTrainImg(type)
      params.canvasLeft = document.getElementById(
        `canvasLeft${this.currentKey}`
      )
      params.canvasLeftPoint = document.getElementById(
        `canvasLeftPoint${this.currentKey}`
      )
      let canvasOut1 = that.$refs[`canvasOut1${this.currentKey}`][0]
      let canvasOut2 = that.$refs[`canvasOut2${this.currentKey}`][0]
      if (
        params.canvasLeft !== null &&
        params.canvasLeftPoint !== null &&
        canvasOut1 &&
        canvasOut2
      ) {
        params.cxtLeftPoint = params.canvasLeftPoint.getContext('2d')
        const BW = (params.canvasLeftPoint.width = canvasOut1.clientWidth)
        const BH = (params.canvasLeftPoint.height = canvasOut1.clientHeight)
        let x = params.canvasLeftPoint.getBoundingClientRect().left
        let y = params.canvasLeftPoint.getBoundingClientRect().top
        params.cxtLeftPoint.clearRect(
          x,
          y,
          params.canvasLeftPoint.width,
          params.canvasLeftPoint.height
        )
        canvasOut1.onmousemove = (e) => {
          this.clickEvent(e, params.canvasLeftPoint)
        }
        canvasOut2.onmousemove = (e) => {
          this.clickEvent(e, params.canvasRightPoint)
        }
        // this.canvasLeftPoint.onclick = (e) => {
        //   this.clickEvent(e, this.canvasLeftPoint)
        // }
        if (flag) {
          params.cxtLeft = params.canvasLeft.getContext('2d')
          const BW = (params.canvasLeft.width = canvasOut1.clientWidth)
          const BH = (params.canvasLeft.height = canvasOut1.clientHeight)
          let background = new Image()
          background.src = params.pic1
          let newPW, newPH, startPicX, startPicY // 设置 背景长宽 起始点
          let x = params.canvasLeft.getBoundingClientRect().left
          let y = params.canvasLeft.getBoundingClientRect().top
          params.cxtLeft.clearRect(
            x,
            y,
            params.canvasLeft.width,
            params.canvasLeft.height
          )
          background.onload = () => {
            const PW = background.width
            const PH = background.height
            /* 默认图片的宽度是总宽度的80% */
            // 判断图片的长宽比,高或者宽是背景的80%
            let scale = 0.8
            if (PW / PH > BW / BH) {
              // 以宽为准
              newPW = BW * scale
              newPH = (PH / PW) * newPW
              startPicX = (BW * (1 - scale)) / 2
              startPicY = (BH - newPH) / 2
            } else {
              // 以高为准
              newPH = BH * scale
              newPW = (PW / PH) * newPH
              startPicX = (BW - newPW) / 2
              startPicY = (BH * (1 - scale)) / 2
            }
            params.canvasLeftData = {
              newPW,
              newPH,
              startPicX,
              startPicY,
            }
            params.cxtLeft.clearRect(
              0,
              0,
              params.canvasLeft.width,
              params.canvasLeft.height
            )
            params.cxtLeft.drawImage(
              background,
              startPicX,
              startPicY,
              newPW,
              newPH
            )
            params.cxtLeft.font = `30px normal` //设置字体
            /* 标题颜色 */
            params.cxtLeft.fillStyle = '#fff'
            params.cxtLeft.textAlign = 'center'
            // 设置垂直对齐方式
            params.cxtLeft.textBaseline = 'middle'
            // 绘制文字（参数：要写的字，x坐标，y坐标）
            let axis1 = vm.$t('GjModelInfo.axis1'),
              axis2 = vm.$t('GjModelInfo.axis2')
            params.cxtLeft.fillText(
              axis1, //'1轴',
              startPicX - 40,
              startPicY + newPH * 0.5
            )
            params.cxtLeft.fillText(
              axis2, //'2轴',
              startPicX + newPW + 40,
              startPicY + newPH * 0.5
            )
            /* 所有图示的位置 */
            this.drawText(
              params.cxtLeftPoint,
              startPicX,
              startPicY,
              newPW,
              newPH,
              params.points1
            )
          }
        } else {
          if (params.canvasLeftPoint !== null && params.canvasLeftData != {}) {
            let canvasLeftData = params.canvasLeftData
            this.drawText(
              params.cxtLeftPoint,
              canvasLeftData.startPicX,
              canvasLeftData.startPicY,
              canvasLeftData.newPW,
              canvasLeftData.newPH,
              params.points1
            )
          }
        }
      }
      params.canvasRightPoint = document.getElementById(
        `canvasRightPoint${this.currentKey}`
      )
      params.canvasRight = document.getElementById(
        `canvasRight${this.currentKey}`
      )
      if (
        params.canvasRight !== null &&
        params.canvasRightPoint != {} &&
        canvasOut1 &&
        canvasOut2
      ) {
        params.cxtRightPoint = params.canvasRightPoint.getContext('2d')
        const BW = (params.canvasRightPoint.width = canvasOut1.clientWidth)
        const BH = (params.canvasRightPoint.height = canvasOut1.clientHeight)
        let x = params.canvasRightPoint.getBoundingClientRect().left
        let y = params.canvasRightPoint.getBoundingClientRect().top
        params.cxtRightPoint.clearRect(
          x,
          y,
          params.canvasRightPoint.width,
          params.canvasRightPoint.height
        )
        // this.canvasRightPoint.onclick = (e) => {
        //   this.clickEvent(e, this.canvasRightPoint)
        // }
        if (flag) {
          params.cxtRight = params.canvasRight.getContext('2d')
          const BW = (params.canvasRight.width = canvasOut2.clientWidth)
          const BH = (params.canvasRight.height = canvasOut2.clientHeight)
          let background = new Image()
          background.src = params.pic2
          let newPW, newPH, startPicX, startPicY // 设置 背景长宽 起始点
          let x = params.canvasRight.getBoundingClientRect().left
          let y = params.canvasRight.getBoundingClientRect().top
          params.cxtRight.clearRect(
            x,
            y,
            params.canvasRight.width,
            params.canvasRight.height
          )
          background.onload = () => {
            const PW = background.width
            const PH = background.height
            /* 默认图片的宽度是总宽度的80% */
            // 判断图片的长宽比,高或者宽是背景的80%
            let scale = 0.8
            if (PW / PH > BW / BH) {
              // 以宽为准
              newPW = BW * scale
              newPH = (PH / PW) * newPW
              startPicX = (BW * (1 - scale)) / 2
              startPicY = (BH - newPH) / 2
            } else {
              // 以高为准
              newPH = BH * scale
              newPW = (PW / PH) * newPH
              startPicX = (BW - newPW) / 2
              startPicY = (BH * (1 - scale)) / 2
            }

            params.cxtRight.clearRect(
              0,
              0,
              params.canvasRight.width,
              params.canvasRight.height
            )
            params.cxtRight.drawImage(
              background,
              startPicX,
              startPicY,
              newPW,
              newPH
            )
            params.cxtRight.font = `30px normal` //设置字体
            /* 标题颜色 */
            params.cxtRight.fillStyle = '#fff'
            params.cxtRight.textAlign = 'center'
            // 设置垂直对齐方式
            params.cxtRight.textBaseline = 'middle'
            // 绘制文字（参数：要写的字，x坐标，y坐标）
            let axis3 = vm.$t('GjModelInfo.axis3'),
              axis4 = vm.$t('GjModelInfo.axis4')
            params.cxtRight.fillText(
              axis3, //'3轴',
              startPicX - 40,
              startPicY + newPH * 0.5
            )
            params.cxtRight.fillText(
              axis4, //'4轴',
              startPicX + newPW + 40,
              startPicY + newPH * 0.5
            )
            params.canvasRightData = {
              newPW,
              newPH,
              startPicX,
              startPicY,
            }
            /* 所有图示的位置 */
            that.drawText(
              params.cxtRightPoint,
              startPicX,
              startPicY,
              newPW,
              newPH,
              params.points2
            )
          }
        } else {
          if (
            params.canvasRightPoint !== null &&
            params.canvasRightData != {}
          ) {
            let canvasRightData = params.canvasRightData
            this.drawText(
              params.cxtRightPoint,
              canvasRightData.startPicX,
              canvasRightData.startPicY,
              canvasRightData.newPW,
              canvasRightData.newPH,
              params.points2
            )
          }
        }
      }
    },
    //画圆点
    drawText(cxt, startPicX, startPicY, newPW, newPH, points) {
      points.forEach((item) => {
        let x = item.x * newPW + startPicX
        let y = item.y * newPH + startPicY
        item.offsetX = x
        item.offsetY = y
        cxt.beginPath()
        /* 画圆点 */
        cxt.beginPath()
        cxt.arc(x, y, 6, 0, Math.PI * 2, true)
        cxt.closePath()
        cxt.fillStyle = item.color
        cxt.fill()
      })
    },
    clickEvent(e, dom) {
      const params = this.gjModelInfo[this.currentKey]
      var clickX = e.pageX - dom.getBoundingClientRect().left
      var clickY = e.pageY - dom.getBoundingClientRect().left
      if (dom == params.canvasLeftPoint) {
        this.getLTitleInfo(clickX, clickY)
      } else if (dom == params.canvasRightPoint) {
        this.getRTitleInfo(clickX, clickY)
      }
    },
    // 获取点击圆圈的轴位标签
    getLTitleInfo(x, y) {
      const params = this.gjModelInfo[this.currentKey]
      let canvasOut1 = this.$refs[`canvasOut1${this.currentKey}`][0]
      let chNames = ''
      let chInfo = ''
      for (let i = 0; i < params.points1.length; i++) {
        let item = params.points1[i]
        if (
          item.offsetX - 15 <= x &&
          x <= item.offsetX + 10 &&
          item.offsetY - 62 <= y &&
          y <= item.offsetY - 42
        ) {
          chNames = chNames + item.ch_name + ' '
          chInfo = item.chInfo
        }
      }
      if (chNames != '' && chInfo != '') {
        params.canvasLeftTitle = document.getElementById(
          `canvasLeftTitle${this.currentKey}`
        )
        if (params.canvasLeftTitle) {
          params.titleLeft = params.canvasLeftTitle.getContext('2d')
          const BW = (params.canvasLeftTitle.width = canvasOut1.clientWidth)
          const BH = (params.canvasLeftTitle.height = canvasOut1.clientHeight)
          let x1 = params.canvasLeftTitle.getBoundingClientRect().left
          let y1 = params.canvasLeftTitle.getBoundingClientRect().top
          params.titleLeft.clearRect(
            x1,
            y1,
            params.canvasLeftTitle.width,
            params.canvasLeftTitle.height
          )
          params.titleLeft.font = `16px normal` //设置字体
          /* 标题颜色 */
          params.titleLeft.fillStyle = '#000'
          params.titleLeft.textAlign = 'left'
          // 设置垂直对齐方式
          params.titleLeft.textBaseline = 'middle'
          params.titleLeft.fillStyle = '#fff'

          //绘制ToolTip背景
          params.titleLeft.fillRect(x, y + 50, 160, 70)

          //绘制ToolTip文字
          params.titleLeft.fillStyle = '#000'
          // this.titleLeft.fillText(item.chInfo, x+35, y + 70)
          params.titleLeft.fillText(
            `${vm.$t('GjModelInfo.headChname')}:${chNames}`,
            x + 10,
            y + 70
          ) //通道名称
          params.titleLeft.fillText(
            `${vm.$t('GjModelInfo.headLoc')}:${chInfo}`,
            x + 10,
            y + 100
          ) //安装位置
          params.titleLeft.restore()
        }
      } else {
        if (params.canvasLeftTitle) {
          params.titleLeft = params.canvasLeftTitle.getContext('2d')
          const BW = (params.canvasLeftTitle.width = canvasOut1.clientWidth)
          const BH = (params.canvasLeftTitle.height = canvasOut1.clientHeight)
          let x1 = params.canvasLeftTitle.getBoundingClientRect().left
          let y1 = params.canvasLeftTitle.getBoundingClientRect().top
          params.titleLeft.clearRect(
            x1,
            y1,
            params.canvasLeftTitle.width,
            params.canvasLeftTitle.height
          )
        }
      }
    },
    getRTitleInfo(x, y) {
      const params = this.gjModelInfo[this.currentKey]
      let canvasOut1 = this.$refs[`canvasOut1${this.currentKey}`][0]
      for (let i = 0; i < params.points2.length; i++) {
        let item = params.points2[i]
        if (
          item.offsetX - 8 <= x &&
          x <= item.offsetX + 12 &&
          item.offsetY - 909 <= y &&
          y <= item.offsetY - 879
        ) {
          params.canvasRightTitle = document.getElementById(
            `canvasRightTitle${this.currentKey}`
          )
          if (params.canvasRightTitle) {
            params.titleRight = params.canvasRightTitle.getContext('2d')
            const BW = (params.canvasRightTitle.width = canvasOut1.clientWidth)
            const BH = (params.canvasRightTitle.height =
              canvasOut1.clientHeight)
            let x1 = params.canvasRightTitle.getBoundingClientRect().left
            let y1 = params.canvasRightTitle.getBoundingClientRect().top
            params.titleRight.clearRect(
              x1,
              y1,
              params.canvasRightTitle.width,
              params.canvasRightTitle.height
            )
            params.titleRight.font = `16px normal` //设置字体
            /* 标题颜色 */
            params.titleRight.fillStyle = '#000'
            params.titleRight.textAlign = 'left'
            // 设置垂直对齐方式
            params.titleRight.textBaseline = 'middle'
            params.titleRight.fillStyle = '#fff'
            //绘制ToolTip背景
            params.titleRight.fillRect(x, y + 890, 160, 70)
            //绘制ToolTip文字
            params.titleRight.fillStyle = '#000'
            // 安装位置：${item.chInfo}
            params.titleRight.fillText(
              `${vm.$t('GjModelInfo.headChname')}:${item.ch_name}`, //通道名称
              x + 10,
              y + 910
            )
            params.titleRight.fillText(
              `${vm.$t('GjModelInfo.headLoc')}:${item.chInfo}`, //安装位置
              x + 10,
              y + 940
            )
            params.titleRight.restore()
          }
          break
        } else {
          if (params.canvasRightTitle) {
            params.titleRight = params.canvasRightTitle.getContext('2d')
            const BW = (params.canvasRightTitle.width = canvasOut1.clientWidth)
            const BH = (params.canvasRightTitle.height =
              canvasOut1.clientHeight)
            let x1 = params.canvasRightTitle.getBoundingClientRect().left
            let y1 = params.canvasRightTitle.getBoundingClientRect().top
            params.titleRight.clearRect(
              x1,
              y1,
              params.canvasRightTitle.width,
              params.canvasRightTitle.height
            )
          }
        }
      }
    },
    //获取图片:type 车厢类型，type==1,2没有电机；type==3,4,5带2个电机；type==6,左不带，右带电机
    getTrainImg(type) {
      const params = this.gjModelInfo[this.currentKey]
      let p1 = null,
        p2 = null
      switch (type) {
        case 1:
        case 2:
          p1 = require('assets/images/gj/gj1.png')
          p2 = require('assets/images/gj/gj1.png')
          break
        case 3:
        case 4:
        case 5:
          p1 = require('assets/images/gj/gj2.png')
          p2 = require('assets/images/gj/gj2.png')
          break
        case 6:
          p1 = require('assets/images/gj/gj1.png')
          p2 = require('assets/images/gj/gj2.png')
          break
      }
      if (params.pic1 == p1 && params.pic2 == p2) {
        return false
      } else {
        params.pic1 = p1
        params.pic2 = p2
        return true
      }
    },

    /**
     * 获取建议
     */
    getAdvice(level) {
      var str = ''
      switch (level) {
        case 0:
          str = vm.$t('GjModelInfo.advice1') //'正常'
          break
        case 2:
          str = vm.$t('GjModelInfo.advice2') //'需要注意'
          break
        case 3:
          str = vm.$t('GjModelInfo.advice3') //'需要维修'
          break
        default:
          str = vm.$t('GjModelInfo.advice4') //'已离线'
      }
      return str
    },
    /**
     * 跳转回机组模型图
     */
    goToModel() {
      const mac = this.gjModelInfo[this.currentKey].mac
      // this.$router.push('fdModel')
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
          router: 'gjModel',
        })
        /* 设置当前的机组 */
        let params = {
          key: this.currentKey,
          val: vm.$t('YtModel.macModel'), //'设备模型',
          name: 'gjModel',
          icon: 'icon-shijingsanwei-',
        }
        this.$bus.$emit('getPath', params)
      })
    },
  },
}
</script>

<style scoped lang="scss">
.modelInfo-view {
  margin-top: 55px;
  .gjBtn {
    position: absolute;
    top: 63px;
    right: 25px;
    .modelInfo-btn {
      margin-top: 10px;
      padding: 0 10px;
      width: 130px;
      height: 43px;
      background: #0b1757;
      border: 1px solid #4573d5;
      box-shadow: 0px 0px 29px 0px rgba(5, 69, 167, 0.72);
      border-radius: 10px;
      font-size: 16px;
      font-family: Source Han Sans CN;
    }
  }
  .model-view-title {
    display: flex;
    justify-content: space-between;
    .model-view-f1 {
      margin: 20px 15px;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .model-content {
    height: calc(100vh - 140px);
    display: grid;
    grid-template-rows: repeat(2, 48%);
    grid-gap: 20px;
    grid-auto-flow: row;
    .model-pic {
      background: #0b1757;
      border: 1px solid #4573d5;
      box-shadow: 0px 0px 49px 1px rgba(5, 69, 167, 0.72) inset;
      .canvas-content {
        display: flex;
        flex-direction: row;
        height: calc(100% - 36px);
        .canvasOut {
          width: 100%;
          height: 100%;
        }
        .canvasLeftPoint {
          position: relative;
          top: -100%;
        }
        .canvasRightPoint {
          position: relative;
          top: -100%;
        }
        .canvasLeftTitle,
        .canvasRightTitle {
          position: relative;
          top: -200%;
        }
      }
      .model-title {
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        color: #fff;
        padding-left: 20px;
        background: rgba(11, 103, 199, 0.4);
      }
    }
    .model-info {
      background: #0b1757;
      border: 1px solid #4573d5;
      box-shadow: 0px 0px 49px 1px rgba(5, 69, 167, 0.72) inset;
      .model-thead {
        font-family: Source Han Sans CN;
        background: rgba(11, 103, 199, 0.4);
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        color: #fff;
        font-weight: 500;
        th:nth-child(1) {
          text-align: left;
          padding-left: 20px;
          width: 200px;
        }
      }
      .model-tbody {
        text-align: center;
        max-height: calc(100vh / 2 - 125px);
        overflow: auto;
        .my-table-tr {
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          background: rgba(11, 103, 199, 0.4);
          &:nth-child(odd) {
            background: rgba(0, 126, 255, 0.2);
          }
          &:hover {
            background: rgba(0, 126, 255, 0.45);
          }
          td:nth-child(1) {
            text-align: left;
            width: 200px;
          }
        }
      }
      .circle_type {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 0 5px;
      }
      .circle_color0 {
        //离线
        background: #ccc;
      }
      .circle_color1 {
        //正常
        background: #009944;
      }
      .circle_color2 {
        //预警
        background: #bfaf00ff;
      }
      .circle_color3 {
        //一级报警
        background: #ff9b21ff;
      }
      .circle_color4 {
        //二级报警
        background: #f70000ff;
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
.none-Data {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #092e55;
  top: 55px;
  img {
    width: 82%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
@media screen and (max-width: 1366px) {
  .modelInfo-view .model-content .model-info .model-tbody {
    max-height: calc(100vh / 2 - 120px);
  }
}
</style>
