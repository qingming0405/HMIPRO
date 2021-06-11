<template>
  <div>
    <div
      v-for="(data, index) in railData"
      v-show="data.isShow"
      class="my-rail"
    >
      <div
        class="railPic"
        v-reszice='resize'
      >
        <!-- 上行轨道 -->
        <div
          class="my-up"
          :id="'my-up'+index"
        >
          <!-- 轨道 -->
          <canvas
            class="up-track"
            :ref='"up_track" + index'
          ></canvas>
          <!-- 波磨 -->
          <canvas
            class="up-track-rail"
            :ref='"up_track_rail" + index'
          ></canvas>
        </div>
        <div class="dividing-line"></div>
        <!-- 下行轨道 -->
        <div
          class="my-down"
          :id="'my-down'+index"
        >
          <!-- 轨道 -->
          <canvas
            class="down-track"
            :ref='"down_track" + index'
          ></canvas>
          <!-- 波磨 -->
          <canvas
            class="down-track-rail"
            :ref='"down_track_rail"+index'
          ></canvas>
        </div>
      </div>
      <div class="railTable">
        <table class="scroll-style-edge my-rail-table ">
          <thead class="rail-thead my-table-thead">
            <tr class="my-table-tr">
              <th v-for="item in data.head">{{item}}</th>
            </tr>
          </thead>
          <tbody
            v-if="data.body && data.body.length > 0"
            class="rail-tbody my-table-tbody "
            :ref='"railBody" + index'
          >
            <tr
              class="my-table-tr"
              v-for="item in data.body"
              :class='item.className'
              @click="trClick(item)"
            >
              <td>{{item.direction}}</td>
              <td>{{item.from_to}}</td>
              <td>{{item.track_position}}</td>
              <td>{{item.position_info.from_sta}}+{{item.position_info.from_distance}} ~
                {{item.position_info.to_sta}}+{{item.position_info.to_distance}}</td>
              <td>{{item.position_info.vib_p}}</td>
              <td>{{item.position_info.vib_rms}}</td>
            </tr>
          </tbody>
          <div
            class="no-data"
            v-else
          >
            <!-- 轨道状况良好，无故障 -->{{$t('railCorrugation.goodCondition')}}
          </div>
        </table>
      </div>
      <div class="search-data">
        <button @click="sampling">
          <!-- 手动波磨采样 -->{{$t('railCorrugation.ManualGrindSample')}}
        </button>
        <button @click="chooseData">
          <!-- 波磨数据 -->{{$t('railCorrugation.PolishData')}}
        </button>
        <button @click="dataRetrieval">
          <!-- 数据检索 -->{{$t('Common.retrieval')}}
        </button>
      </div>
      <div
        class="none-data-box"
        v-show="noData.isShow"
      >
        <div>{{ noData.text }}</div>
      </div>
    </div>

  </div>
</template>
<script>
import {
  cloneObj,
  getTime,
  addClass,
  hasClass,
  removeClass,
} from 'utils/utils.js'
// import 《组件名称》 from '《组件路径》';
export default {
  name: 'railCorrugation',
  data() {
    return {
      railData: {} /* 轨道波磨地图信息 */,
      currentKey: '' /* 当前显示索引 */,
      noData: {
        isShow: true,
        text: '无站点信息',
      },
      time: '' /* CSS效果定时器 */,
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'railCorrugation',
    })
    this.noData = {
      isShow: true,
      text: this.$t('railCorrugation.NoSiteInfo'), //'无站点信息'
    }
  },
  watch: {
    '$store.state.railCorrugationMsg': {
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
      if (type === 0 || type === 1) {
        this.currentKey = key
        for (let k in this.railData) {
          this.railData[k].isShow = false
          this.railData[k].isNewChart = false
        }
      }
      let [, , macId, posId, posType] = key.split('_')
      if (type == 0) {
        // 新开
        this.$set(this.railData, key, {
          isShow: true,
          head: [
            this.$t('railCorrugation.direction'),
            this.$t('railCorrugation.site'),
            this.$t('railCorrugation.rail'),
            this.$t('railCorrugation.corrugationInterval'),
            this.$t('railCorrugation.maxCrest'),
            this.$t('railCorrugation.MaxEffectValue'),
          ], //'方向', '站点', '轨道', '波磨区间', '最大峰值', '最大有效值'
          body: [],
          chooseTime: {
            startTime: null,
            endTime: null,
            val: null,
          },
          alarmTime: [] /* 波磨数据时间段 */,
          data: [] /* 站点数据 */,
          maxLength: 0 /* 轨道最长长度 */,
          railStation: {} /* 链式的站点对象 */,
          railStationArray: {} /* 站点数组 */,
          upTrack: null /* 上行轨道canvas对象 */,
          upTrackdom: null /* 上行轨道dom对象 */,
          upTrackAlarm: null /* 报警上行轨道canvas对象 */,
          downTrackdom: null /* 下行轨道dom对象 */,
          downTrack: null /* 下行轨道canvas对象 */,
          downTrackAlarm: null /* 报警下行轨道canvas对象 */,
          level: [],
          accuracy: 0 /* 像素/m：1m代表accuracy像素  */,
          pos: cloneObj(this.$store.state.checkMsg.pos) /* 测点信息 */,
          mac: cloneObj(this.$store.state.checkMsg.mac) /* 机组信息 */,
          requestData: null,
          pos_accuracy: 0, //设定故障的最小精度（单位m）
        })
        const time = this.$store.state.srcParams.time
        let requestData = {
          station: {
            machineId: this.railData[key].pos.machine_id,
          } /* 站点信息请求数据 */,
          alarm: {
            machineId: this.railData[key].pos.machine_id,
            positionType: this.railData[key].pos.position_type,
            positionId: this.railData[key].pos.position_id,
            startTime: time.start,
            endTime: time.end,
          } /* 报警信息请求数据 */,
          alarmTime: {
            machineId: this.railData[key].pos.machine_id,
            positionType: this.railData[key].pos.position_type,
            positionId: this.railData[key].pos.position_id,
            startTime: time.start,
            endTime: time.end,
          } /* 报警信息请求数据 */,
        }
        this.railData[key].requestData = requestData
        this.getRailData(this.railData[key].requestData.station)
      } else if (type == 1) {
        //切换
        this.railData[key].isShow = true
      } else if (type == 2) {
        //删除
        this.$delete(this.railData, key)
      }
    },
    // 获取站点信息
    getRailData(requestData) {
      this.$getApi.getLineInfo(requestData).then((res) => {
        res && this.setRailData(res)
      })
    },
    // 处理接口返回数据为画图数据
    setRailData(data) {
      if (data.stations) {
        this.noData.isShow = false
        let body = data.stations
        let railData = this.railData[this.currentKey]
        railData.data = body
        let railStation = {} /* 上行第一站 */
        let l = body.length
        // 遍历取上行第一站
        for (let i = 0; i < l; i++) {
          let item = body[i]
          if (item.station_id == 1) {
            railStation = item
          }
          body[i].className = ''
        }
        for (let k = 0; k < l; k++) {
          this.railRecursion(railStation)
        }
        railData.railStation = railStation
        /* 计算轨道最长的长度 */
        railData.railStationArray[0] = []
        //  链式拆成上行轨道的数组
        this.railStationRec(railStation)
        for (let a in railData.railStationArray) {
          let extent = -1
          if (extent <= railData.maxLength) {
            for (let i = 0; i < railData.railStationArray[a].length; i++) {
              railData.railStationArray[a][i].station_interval
                ? (extent += Number(
                    railData.railStationArray[a][i].station_interval
                  ))
                : ''
            }
            if (extent > railData.maxLength) {
              railData.maxLength = extent
            }
          } else {
            railData.maxLength = extent
          }
        }
        this.setdrawTrackData()
      } else {
        console.log(this.$t('railCorrugation.NoSiteInfo'))//无站点信息
        this.noData.isShow = true
      }
      this.getAlarmTimeData(
        cloneObj(this.railData[this.currentKey].requestData.alarm)
      )
    },
    // 链式拆成上行轨道的数组，多分叉即存在多数组，方便计算最长轨道
    railStationRec(data, index = 0) {
      let railStationArray = this.railData[this.currentKey].railStationArray
      if (data.child) {
        if (data.child.length > 1) {
          railStationArray[index].push(data)
          // 深拷贝当前的数组，防止后续对数组插入操作影响数据
          let a = cloneObj(railStationArray[index], true)
          for (let k = 0; k < data.child.length; k++) {
            // 存在分叉轨道时增加下标
            let index1 = 0
            for (let j in railStationArray) {
              index1++
            }
            index1 = index1 - 1 + k
            railStationArray[index1] = cloneObj(a, true)
            this.railStationRec(data.child[k], index1)
          }
        } else {
          railStationArray[index].push(data)
          this.railStationRec(data.child[0], index)
        }
      } else {
        railStationArray[index].push(data)
      }
    },
    // 将数组组成链式结构的对象
    railRecursion(data) {
      // 存在子集则遍历子集寻找子集是否存在子集
      if (data.child) {
        data.child.forEach((children) => {
          this.railRecursion(children)
        })
      } else {
        let body = this.railData[this.currentKey].data
        body.forEach((item) => {
          if (data.station_id == item.last_id) {
            if (data.child) {
              data.child.push(item)
            } else {
              data.child = [item]
            }
          }
        })
      }
    },
    // 设置画图数据
    setdrawTrackData() {
      let railData = this.railData[this.currentKey]
      railData.upTrackdom = this.$refs[`up_track${this.currentKey}`][0]
      if (railData.upTrackdom !== null) {
        railData.upTrack =
          railData.upTrackdom.getContext('2d') /* 创建canvas对象 */
        const BW = (railData.upTrackdom.width = document.getElementById(
          `my-up${this.currentKey}`
        ).clientWidth)
        const BH = (railData.upTrackdom.height = document.getElementById(
          `my-up${this.currentKey}`
        ).clientHeight)
        let x = railData.upTrackdom.getBoundingClientRect().left
        let y = railData.upTrackdom.getBoundingClientRect().top
        railData.upTrack.clearRect(
          x,
          y,
          railData.upTrackdom.width,
          railData.upTrackdom.height
        )
        let accuracy =
          (BW - 100) / railData.maxLength /* 像素/m：1m代表accuracy像素 */
        railData.accuracy = accuracy
        let lineNum = 0 /* 轨道分叉数 */
        for (let b in railData.railStationArray) {
          if (railData.railStationArray[b]) {
            lineNum++
          }
        }
        // 绘制上下行文字
        railData.upTrack.font = '22px Arial'
        railData.upTrack.fillStyle = '#ffffff'
        railData.upTrack.save()
        railData.upTrack.textBaseline = 'top'
        railData.upTrack.fillText(this.$t('railCorrugation.upRail'), 30, 30)//上行轨道
        if (lineNum > 1) {
          this.drawTrack(
            50,
            railData.upTrackdom.height - 90,
            accuracy,
            railData.railStation,
            railData.upTrack
          )
        } else {
          this.drawTrack(
            50,
            railData.upTrackdom.height / 2,
            accuracy,
            railData.railStation,
            railData.upTrack
          )
        }
      }
      railData.downTrackdom = this.$refs[`down_track${this.currentKey}`][0]
      if (railData.downTrackdom !== null) {
        railData.downTrack =
          railData.downTrackdom.getContext('2d') /* 创建canvas对象 */
        const BW = (railData.downTrackdom.width = document.getElementById(
          `my-up${this.currentKey}`
        ).clientWidth)
        const BH = (railData.downTrackdom.height = document.getElementById(
          `my-up${this.currentKey}`
        ).clientHeight)
        let x = railData.downTrackdom.getBoundingClientRect().left
        let y = railData.downTrackdom.getBoundingClientRect().top
        railData.upTrack.clearRect(
          x,
          y,
          railData.downTrackdom.width,
          railData.downTrackdom.height
        )
        let accuracy =
          (BW - 100) / railData.maxLength /* 像素/m：1m代表accuracy像素 */
        let lineNum = 0 /* 轨道分叉数 */
        for (let b in railData.railStationArray) {
          lineNum++
        }
        // 绘制上下行文字
        railData.downTrack.font = '22px Arial'
        railData.downTrack.fillStyle = '#ffffff'
        railData.downTrack.save()
        railData.downTrack.textBaseline = 'top'
        railData.downTrack.fillText(this.$t('railCorrugation.downRail'), 30, 30)//下行轨道
        if (lineNum > 1) {
          this.drawTrack(
            50,
            railData.downTrackdom.height - 90,
            accuracy,
            railData.railStation,
            railData.downTrack
          )
        } else {
          this.drawTrack(
            50,
            railData.downTrackdom.height / 2,
            accuracy,
            railData.railStation,
            railData.downTrack
          )
        }
      }
    },
    /* 
    x，y坐标
    accuracy：1m代表accuracy像素
    data：站点链
    track：canvas对象
    */
    drawTrack(x, y, accuracy, data, track) {
      if (data.station_interval != 0) {
        data.pixel = Number(data.station_interval) * accuracy
      }
      // 计算下一个站点的距离
      if (data.child) {
        if (data.child.length > 1) {
          for (let i = 0; i < data.child.length; i++) {
            data.child[i].pixel =
              Number(data.child[i].station_interval) * accuracy
          }
        } else {
          data.child[0].pixel =
            Number(data.child[0].station_interval) * accuracy
        }
      }
      if (data.child) {
        if (data.child.length > 1) {
          for (let i = 0; i < data.child.length; i++) {
            if (data.child[i].pixel) {
              // 画线
              track.lineWidth = 10
              track.moveTo(x, y)
              track.lineTo(x + data.child[i].pixel, y - i * 75)
              track.strokeStyle = '#009944'
              track.stroke()
            }
          }
          for (let i = 0; i < data.child.length; i++) {
            // 画圆
            track.fillStyle = '#ffffff'
            track.beginPath()
            track.arc(x, y, 5, Math.PI * 2, 0, true)
            track.closePath()
            track.fill()
            data.x = x
            data.y = y
            // 画圆
            track.fillStyle = '#ffffff'
            track.beginPath()
            track.arc(
              x + data.child[i].pixel,
              y - i * 75,
              5,
              Math.PI * 2,
              0,
              true
            )
            track.closePath()
            track.fill()
            data.child[i].x = x + data.child[i].pixel
            data.child[i].y = y - i * 75
            this.drawTrack(
              x + data.child[i].pixel,
              y - i * 75,
              accuracy,
              data.child[i],
              track
            )
            // 绘制文字
            this.drawVerticalText(x, y - 3, data.station_name, track)
          }
        } else {
          // 画线
          track.lineWidth = 10
          track.moveTo(x, y)
          track.lineTo(x + data.child[0].pixel, y)
          track.strokeStyle = '#009944'
          track.stroke()
          // 画圆
          track.fillStyle = '#ffffff'
          track.beginPath()
          track.arc(x, y, 5, Math.PI * 2, 0, true)
          track.closePath()
          track.fill()
          data.x = x
          data.y = y
          // 绘制文字
          this.drawVerticalText(x, y - 3, data.station_name, track)
          // 画圆
          track.fillStyle = '#ffffff'
          track.beginPath()
          track.arc(x + data.child[0].pixel, y, 5, Math.PI * 2, 0, true)
          track.closePath()
          track.fill()
          data.child[0].x = x + data.child[0].pixel
          data.child[0].y = y
          this.drawTrack(
            x + data.child[0].pixel,
            y,
            accuracy,
            data.child[0],
            track
          )
        }
      } else {
        // 画圆
        track.fillStyle = '#ffffff'
        track.beginPath()
        track.arc(x, y, 5, Math.PI * 2, 0, true)
        track.closePath()
        track.fill()
        data.x = x
        data.y = y
        this.drawVerticalText(x, y - 3, data.station_name, track)
        this.railData[this.currentKey].level.push(y)
      }
    },
    // 文字竖排列画方法
    drawVerticalText(x, y, text, track) {
      let tx = x - 5
      let ty = y + 20
      let letterSpacing = 2 /* 设置文字间距 */
      for (let i = 0; i < text.length; i++) {
        const str = text.slice(i, i + 1).toString()
        track.font = '10px Arial'
        track.save()
        track.textBaseline = 'top'
        track.fillText(str, tx, ty)
        track.restore()
        ty += track.measureText(str).width + letterSpacing // 计算文字宽度
      }
    },
    // 获取报警数据
    getAlarmTimeData(requestData) {
      this.$getApi.getTimeBatch(requestData).then((res) => {
        if (res && res.info) {
          this.railData[this.currentKey].alarmTime = res.info
        }
        if (this.railData[this.currentKey].alarmTime.length > 0) {
          requestData.startTime =
            this.railData[this.currentKey].alarmTime[0].startTime
          requestData.endTime =
            this.railData[this.currentKey].alarmTime[0].endTime
          this.railData[this.currentKey].chooseTime.startTime =
            requestData.startTime
          this.railData[this.currentKey].chooseTime.endTime =
            requestData.endTime
          this.railData[this.currentKey].chooseTime.val = getTime(
            requestData.startTime
          )
          this.$getApi.getTrackCorrugationMap(requestData).then((res) => {
            res && this.setDrawAlarmData(res)
          })
        }
      })
    },
    getAlarmData(requestData) {
      this.$getApi.getTrackCorrugationMap(requestData).then((res) => {
        res && this.setDrawAlarmData(res)
      })
    },
    /* 设置画报警数据 */
    setDrawAlarmData(res) {
      /* 
        机组为一辆地铁，机泵为车厢,存入vuex时同一机组有几个机泵就拆成了几个
        1.若上下行车头一致，且上下行车头为 1 （flag ==1 ）或上下行车头不一致上行车头为1（flag = 3 && direction == '上行')且为上行，上下行车头不一致上行车头为4（flag = 4 && direction == '下行')且为下行 则1,2车厢左轨：'1-1', '2-7', '3-1', '4-7' 则3,4车厢左轨：'1-7', '2-1', '3-7', '4-1' 
        2.若上下行车头一致，且上下行车头为 4 （flag ==1 ）或上下行车头不一致上行车头为4（flag = 4 && direction == '上行')且为上行，上下行车头不一致上行车头为1（flag = 3 && direction == '下行')且为下行，则1,2车厢左轨：'1-7', '2-1', '3-7', '4-1' 则3,4车厢左轨： '1-1', '2-7', '3-1', '4-7'
      */
      let railData = this.railData[this.currentKey]
      let mac = railData.mac
      let macArray = this.$store.state.mac[mac.t_id]
      let head, end
      let flag = 0
      let car_id = 0
      let pos_accuracy = 0
      // 获取上行车头的car_id和下行车头的car_id
      for (let i = 0; i < macArray.length; i++) {
        let val = macArray[i]
        if (mac.mac_id == val.mac_id) {
          /* 同一机组下的机泵 */
          if (val.baseInfo.if_head == 1) {
            head = val
          }
          if (val.baseInfo.if_end == 1) {
            end = val
          }
        }
        if (mac.pump_id == val.pump_id && val.baseInfo.car_id) {
          car_id = Number(val.baseInfo.car_id)
        }
      }
      if (head && end) {
        if (Number(head.baseInfo.car_id) == Number(end.baseInfo.car_id)) {
          if (Number(head.baseInfo.car_id) == 1) {
            flag = 1 /* 上下行车头一致,且上行车头为1 */
          } else {
            flag = 2 /* 上下行车头一致，且上行车头为4 */
          }
        } else {
          if (Number(head.baseInfo.car_id) == 1) {
            flag = 3 /* 上下行车头不一致,且上行车头为1 */
          } else {
            flag = 4 /* 上下行车头不一致，且上行车头为4 */
          }
        }
      }
      if (res.pos_accuracy) {
        pos_accuracy = Number(res.pos_accuracy)
      }
      railData.pos_accuracy = pos_accuracy
      if (res.list && res.list.length > 0) {
        let body = []
        let data = railData.data //站点信息数据
        let list = res.list
        let info = res
        let carNum = Number(res.car_num) /* 4节车厢 */
        let left, right
        // 判断上一站下一站是否存在
        list.forEach((item, index) => {
          if (item.position_info.from_staInfo != 0) {
            if (car_id != 0) {
              if (flag == 1 || flag == 2 || flag == 3 || flag == 4) {
                /* 上下行车头一致,且上行车头为1 */
                if (
                  flag == 1 ||
                  (item.direction == this.$t('railCorrugation.upstroke') && flag == 3) ||//上行
                  (item.direction == this.$t('railCorrugation.downstream') && flag == 4)//下行
                ) {
                  if (car_id <= carNum / 2) {
                    /* 1,2车厢 */
                    left = ['1-1', '2-7', '3-1', '4-7']
                    right = ['1-7', '2-1', '3-7', '4-1']
                    if (
                      left.indexOf(`${info.pos_class}-${info.pos_loc}`) != -1
                    ) {
                      item.track_position = this.$t('railCorrugation.leftTrack')//左轨
                    } else if (
                      right.indexOf(`${info.pos_class}-${info.pos_loc}`) != -1
                    ) {
                      item.track_position = this.$t('railCorrugation.rightTrack')//右轨
                    } else {
                      item.track_position = this.$t('railCorrugation.missLocInfo')//'缺少安装位置信息'
                    }
                  } else {
                    /* 3,4车厢 */
                    left = ['1-7', '2-1', '3-7', '4-1']
                    right = ['1-1', '2-7', '3-1', '4-7']
                    if (
                      left.indexOf(`${info.pos_class}-${info.pos_loc}` != -1)
                    ) {
                      item.track_position = this.$t('railCorrugation.leftTrack')//左轨
                    } else if (
                      right.indexOf(`${info.pos_class}-${info.pos_loc}`) != -1
                    ) {
                      item.track_position = this.$t('railCorrugation.rightTrack')//右轨
                    } else {
                      item.track_position = this.$t('railCorrugation.missLocInfo')//'缺少安装位置信息'
                    }
                  }
                }
                if (
                  flag == 2 ||
                  (item.direction == this.$t('railCorrugation.downstream') && flag == 3) ||//下行
                  (item.direction == this.$t('railCorrugation.upstroke') && flag == 4)//上行
                ) {
                  if (car_id <= carNum / 2) {
                    /* 1,2车厢 */
                    left = ['1-7', '2-1', '3-7', '4-1']
                    right = ['1-1', '2-7', '3-1', '4-7']
                    if (
                      left.indexOf(`${info.pos_class}-${info.pos_loc}`) != -1
                    ) {
                      item.track_position = this.$t('railCorrugation.leftTrack')//左轨
                    } else if (
                      right.indexOf(`${info.pos_class}-${info.pos_loc}`) != -1
                    ) {
                      item.track_position = this.$t('railCorrugation.rightTrack')//右轨
                    } else {
                      item.track_position = this.$t('railCorrugation.missLocInfo')//'缺少安装位置信息'
                    }
                  } else {
                    /* 3,4车厢 */
                    left = ['1-1', '2-7', '3-1', '4-7']
                    right = ['1-7', '2-1', '3-7', '4-1']
                    if (
                      left.indexOf(`${info.pos_class}-${info.pos_loc}` != -1)
                    ) {
                      item.track_position = this.$t('railCorrugation.leftTrack')//左轨
                    } else if (
                      right.indexOf(`${info.pos_class}-${info.pos_loc}`) != -1
                    ) {
                      item.track_position = this.$t('railCorrugation.rightTrack')//右轨
                    } else {
                      item.track_position = this.$t('railCorrugation.missLocInfo')//'缺少安装位置信息'
                    }
                  }
                }
              } else {
                item.track_position = this.$t('railCorrugation.missCarSet')//'缺少车厢设置'
              }
            } else {
              item.track_position = this.$t('railCorrugation.missCarNumSet')//'缺少车厢号设置'
            }
            item.isChoose = false
            for (let i = 0; i < data.length; i++) {
              for (let k = 0, l = data[i].trackList.length; k < l; k++) {
                if (
                  item.position_info.from_sta == data[i].trackList[k].deviceId
                ) {
                  item.from_staInfo = data[i]
                  break
                  // item.position_info.from_distance =
                  //   1000 + i * 10 /* 目前无报警数据，造假，之后需删除 */
                  // item.position_info.jc = 2 /* 目前无报警数据，造假，之后需删除 */
                  // if (index > 650) {
                  //   item.position_info.jc = 3 /* 目前无报警数据，造假，之后需删除 */
                  // }
                }
                if (
                  item.position_info.to_sta == data[i].trackList[k].deviceId
                ) {
                  item.to_staInfo = data[i]
                  break
                }
              }
              if (item.from_staInfo && item.to_staInfo) {
                body.push(item)
                break
              }
            }
          }
        })
        railData.body = body
      } else {
        railData.body = []
      }
      this.ergodicAlarmData()
    },
    // 遍历画图数据
    ergodicAlarmData() {
      let railData = this.railData[this.currentKey]
      let body = railData.body
      let upTrackAlarmdom = this.$refs[`up_track_rail${this.currentKey}`][0]
      let downTrackAlarmdom = this.$refs[`down_track_rail${this.currentKey}`][0]
      if (upTrackAlarmdom != null && downTrackAlarmdom != null) {
        railData.upTrackAlarm =
          upTrackAlarmdom.getContext('2d') /* 创建canvas对象 */

        const BW = (upTrackAlarmdom.width = document.getElementById(
          `my-up${this.currentKey}`
        ).clientWidth)
        const BH = (upTrackAlarmdom.height = document.getElementById(
          `my-up${this.currentKey}`
        ).clientHeight)
        let x = upTrackAlarmdom.getBoundingClientRect().left
        let y = upTrackAlarmdom.getBoundingClientRect().top
        railData.upTrackAlarm.clearRect(
          x,
          y,
          upTrackAlarmdom.width,
          upTrackAlarmdom.height
        )
        railData.downTrackAlarm =
          downTrackAlarmdom.getContext('2d') /* 创建canvas对象 */
        const BW1 = (downTrackAlarmdom.width = document.getElementById(
          `my-up${this.currentKey}`
        ).clientWidth)
        const BH1 = (downTrackAlarmdom.height = document.getElementById(
          `my-up${this.currentKey}`
        ).clientHeight)
        let x1 = downTrackAlarmdom.getBoundingClientRect().left
        let y1 = downTrackAlarmdom.getBoundingClientRect().top
        railData.downTrackAlarm.clearRect(
          x1,
          y1,
          downTrackAlarmdom.width,
          downTrackAlarmdom.height
        )
        let choosealarm
        for (let i = 0; i < body.length; i++) {
          if (body[i].isChoose == true) {
            choosealarm = body[i]
          }
          if (body[i].direction == this.$t('railCorrugation.upstroke')) {//上行
            this.drawAlarmData(body[i], railData.upTrackAlarm)
          } else if (body[i].direction == this.$t('railCorrugation.downstream')) {//下行
            this.drawAlarmData(body[i], railData.downTrackAlarm)
          }
        }
        //这一步是为了选中报警画在canvas最上方
        if (choosealarm) {
          if (choosealarm.direction == this.$t('railCorrugation.upstroke')) {//上行
            this.drawAlarmData(choosealarm, railData.upTrackAlarm, 1)
          } else if (choosealarm.direction == this.$t('railCorrugation.downstream')) {//下行
            this.drawAlarmData(choosealarm, railData.downTrackAlarm, 1)
          }
        }
        upTrackAlarmdom.removeEventListener('click', this.clickEventUp)
        upTrackAlarmdom.addEventListener('click', this.clickEventUp)
        downTrackAlarmdom.removeEventListener('click', this.clickEventDown)
        downTrackAlarmdom.addEventListener('click', this.clickEventDown)
      }
    },
    // flag为0为未选中，为1时为选中，增加选中效果
    drawAlarmData(data, track, flag = 0) {
      let distance =
        this.railData[this.currentKey].accuracy *
        data.position_info.from_distance /* 距离上一站的距离 */
      let x0 =
        this.railData[this.currentKey].accuracy *
        this.railData[this.currentKey].pos_accuracy
      // 上行时x轴坐标
      let x1 = data.from_staInfo.x + distance
      let x2 = data.from_staInfo.x + distance + x0
      if (data.direction == this.$t('railCorrugation.downstream')) {//下行
        /* 下行时x轴坐标 */
        x1 = data.from_staInfo.x - distance
        x2 = data.from_staInfo.x - distance + x0
      }
      data.ox1 = x1
      data.ox2 = x2
      track.save()
      // track.beginPath()
      if (data.position_info.jc == 2 || data.position_info.jc == 8) {
        /* 预警 */
        track.fillStyle = '#c0b000'
      } else if (data.position_info.jc == 3 || data.position_info.jc == 12) {
        /* 一级报警 */
        track.fillStyle = '#ffa101'
      } else if (data.position_info.jc == 19 || data.position_info.jc == 44) {
        /* 二级报警 */
        track.fillStyle = '#F80000 '
      }
      if (flag == 1) {
        track.strokeStyle = '#fff'
        //指定线宽
        track.lineWidth = 1
        track.fillRect(x1, data.from_staInfo.y - 9, x0, 10)
        track.strokeRect(x1 - 1, data.from_staInfo.y - 10, x0 + 2, 12)
      } else {
        track.fillRect(x1, data.from_staInfo.y - 9, x0, 10)
      }

      //     track.fillStyle = "yellow";
      // track.lineWidth = 10
      // track.moveTo(x1, data.from_staInfo.y - 3)
      // track.lineTo(x2, data.from_staInfo.y - 3)
      // track.stroke()
    },
    clickEventUp(e) {
      let upTrackAlarmdom = this.$refs[`up_track_rail${this.currentKey}`][0]
      var p = this.getEventPosition(e, upTrackAlarmdom)
      this.tableLocation(p, this.$t('railCorrugation.upstroke'))//上行
    },
    clickEventDown(e) {
      let downTrackAlarmdom = this.$refs[`down_track_rail${this.currentKey}`][0]
      var p = this.getEventPosition(e, downTrackAlarmdom)
      this.tableLocation(p, this.$t('railCorrugation.downstream'))//下行
    },
    // 定位表格位置
    tableLocation(p, direction) {
      let data = this.railData[this.currentKey].body
      for (let i = 0; i < data.length; i++) {
        data[i].className = ''
        data[i].isChoose = false
      }
      for (var index = 0; index < data.length; index++) {
        clearTimeout(this.time)
        let el = data[index]
        if (
          el.ox1 <= p.x &&
          el.ox2 >= p.x &&
          el.from_staInfo.y - 10 <= p.y &&
          el.from_staInfo.y + 10 >= p.y &&
          el.direction == direction
        ) {
          let dom = this.$refs[`railBody${this.currentKey}`][0]
          //可以滚动
          if (index == 0) {
            index++
          }
          dom.scrollTo(dom.scrollLeft, (index - 1) * 30)
          el.className = 'my-table-tr-a'
          el.isChoose = true
          this.$forceUpdate()
          // 六秒后自动清除点击效果
          this.time = setTimeout(() => {
            for (
              let i = 0;
              i < this.railData[this.currentKey].body.length;
              i++
            ) {
              this.railData[this.currentKey].body[i].className = ''
            }
            this.$forceUpdate()
          }, 6000)
          break
        }
      }
      this.ergodicAlarmData()
    },
    trClick(item) {
      let railData = this.railData[this.currentKey]
      let body = railData.body
      for (let i = 0; i < body.length; i++) {
        body[i].isChoose = false
        body[i].className = ''
      }
      clearTimeout(this.time)
      item.isChoose = true
      item.className = 'my-table-tr-a'
      this.$forceUpdate()
      // 六秒后自动清除点击效果
      this.time = setTimeout(() => {
        for (let i = 0; i < this.railData[this.currentKey].body.length; i++) {
          this.railData[this.currentKey].body[i].className = ''
        }
        this.$forceUpdate()
      }, 6000)
      this.ergodicAlarmData()
    },
    // 获取点击位置
    getEventPosition(event, dom) {
      var x_this = event.clientX - dom.getBoundingClientRect().left
      var y_this = event.clientY - dom.getBoundingClientRect().top
      return { x: x_this, y: y_this }
    },
    // 数据检索
    dataRetrieval() {
      const railData = this.railData[this.currentKey]
      let pos = railData.pos
      const viewMsg = {
        type: 'pos',
        name: pos.position_name /* 测点名称 */,
        // macId:pos.machine_id,
        // posType:pos.position_type,
        macName: pos.mac_name /* 机组名（列车名） */,
      }
      this.$retrieval({
        key: 'rail',
        viewMsg,
      }).then((res) => {
        if (res) {
          this.railData[this.currentKey].requestData.alarmTime.startTime =
            res.startTime
          this.railData[this.currentKey].requestData.alarmTime.endTime =
            res.endTime
          this.getAlarmTimeData(
            this.railData[this.currentKey].requestData.alarmTime
          )
        }
      })
    },
    chooseData() {
      const railData = this.railData[this.currentKey]
      let pos = railData.pos
      const viewMsg = {
        name: pos.position_name /* 测点名称 */,
        macName: pos.mac_name /* 机组名（列车名） */,
        time: railData.alarmTime /* 波磨时间选择 */,
        chooseTime: railData.chooseTime /* 波磨选中时间 */,
      }
      this.$wavemile({
        viewMsg,
      }).then((res) => {
        if (res) {
          this.railData[this.currentKey].requestData.alarm.startTime =
            res.chooseTime.startTime
          this.railData[this.currentKey].requestData.alarm.endTime =
            res.chooseTime.endTime
          this.getAlarmData(this.railData[this.currentKey].requestData.alarm)
        }
      })
    },
    resize() {},
    // 手动波磨数据采样
    sampling() {
      const mac = this.railData[this.currentKey].mac
      let requestData = {
        mac_id: mac.mac_id,
      }
      this.$getApi.getCorrugationByClick(requestData).then((res) => {
        if (res) {
          this.$pop(`${mac.mac_me || mac.mac_name}${this.$t('railCorrugation.sampSentSuccess')}`)//采样命令发送成功
        }
      })
    },
  },
}
</script>
<style scoped lang="scss">
.my-rail {
  width: 100%;
  height: 100%;
  position: relative;
  .railPic {
    width: 100%;
    height: 60%;
    box-shadow: 0px 1px 4px 0px rgba(255, 255, 255, 0.5);
    background: #103760;
    .my-up,
    .my-down {
      width: 100%;
      height: 50%;
      text-align: center;
    }
    .dividing-line {
      margin: 0px 20px;
      border-top: 1px solid #53a5fa;
    }
    .up-track-rail,
    .down-track-rail {
      width: 100%;
      height: 100%;
      position: relative;
      top: -100%;
    }
  }
  .railTable {
    height: calc(40% - 50px);
    .my-rail-table {
      height: 100%;
      width: 100%;
      .rail-thead {
        padding-right: 0;
        tr {
          position: relative;
          height: 40px;
          line-height: 40px;
          th {
            text-align: center;
          }
        }
      }
      .no-data {
        height: calc(100% - 40px);
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
      }
      .rail-tbody {
        height: calc(100% - 40px);
        display: block;
        overflow: auto;
        .my-table-tr {
          display: table;
          height: 30px !important;
          td {
            text-align: center;
            height: 30px;
          }
        }
        .my-table-tr-a {
          background-color: #007eff;
        }
      }
    }
  }
  .search-data {
    height: 50px;
    line-height: 50px;
    width: 100%;
    text-align: center;
    button {
      height: 30px;
      min-width: 100px;
      margin: 20px 5px;
    }
  }
}
</style>