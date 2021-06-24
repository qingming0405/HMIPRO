<template>
  <div class="my-dip-chart rdius box-shadow">
    <div
      class="dip-chart"
      v-for="(data, key) in dipData"
      :key="key"
      v-show="data.isShow"
    >
      <div class="data-box select-none">
        <div class="data-title">
          <!-- 操作 -->{{$t('dip.operating')}}
        </div>
        <ul class="operation-list">
          <li>
            <div class="operation-title">
              <!-- 特征值 -->{{$t('Common.eigenvalue')}}
            </div>
            <div
              class="operation radius eigenvalue"
              @click="setEigenvalue(data, $event)"
              v-for="(item, idx) in data.eigenvalue"
              :key="idx"
              v-show="item.isShow"
            >
              {{ item.name }}
              <i class="iconfont icon-zhongzi-zhankai"></i>
            </div>
          </li>
          <li
            v-for="(item, k) in data.condition"
            :key="k"
          >
            <div class="operation-title">{{ item.name }}</div>
            <div
              class="operation-xuanzhong"
              @click="setViewCondition(item, data)"
            >
              <i
                class="iconfont"
                :class="setSelectBox(item.isShow)"
              ></i>
            </div>
            <!--   <div class="operation-threshold">
              <span
                class="set-color"
                :style="'background-color:' + item.color"
                @click.stop="setColor(data, k, $event)"
              ></span>
            </div> -->
          </li>
          <li>
            <div class="operation-title">
              <!-- 报警线 -->{{$t('dip.AlarmLine')}}
            </div>
            <div class="operation-xuanzhong">
              <i
                class="iconfont"
                :class="setSelectBox(data.showAlarm)"
                @click.stop="viewAlarm(data)"
              ></i>
            </div>
          </li>
        </ul>
        <div class="data-title">
          <!-- 数据显示 -->{{$t('dip.DataDisplay')}}
        </div>
        <ul
          class="data-list"
          v-show="data.clickView.isShow"
        >
          <li
            v-for="(item, idx) in data.clickView.data"
            :key="idx"
          >
            {{ item.name }}： {{ item.value }}
          </li>
        </ul>
      </div>
      <div class="chart-box">
        <div
          class="my-dip-chart"
          ref="myDipChart"
        ></div>
      </div>
      <div
        class="none-data-box select-none radius"
        v-show="data.empty.isShow"
      >
        <div>{{ data.empty.text }}</div>
      </div>
      <div
        class="pos-list"
        v-show="data.posListTab"
      >
        <div
          class="pos-list-title"
          @mousedown="moveDiv($event)"
          @mouseup="moveDivUp($event)"
        >
          <span>
            <!-- 测点列表 -->{{$t('dip.posList')}}
          </span>
          <div
            class="close-retrieval"
            @click="poslist(false)"
          >
            <i class="iconfont icon-cuohao"></i>
          </div>
        </div>
        <div class="pos-list-body">
          <ul class="pos-list-body-title">
            <li :title="$t('Common.macName')">
              <!-- 机组名称 -->{{$t('Common.macName')}}
            </li>
            <li :title="$t('Common.posName')">
              <!-- 测点名称 -->{{$t('Common.posName')}}
            </li>
            <li :title="$t('Common.color')">
              <!-- 颜色 -->{{$t('Common.color')}}
            </li>
            <li :title="$t('dip.isCheck')">
              <!-- 是否勾选 -->{{$t('dip.isCheck')}}
            </li>
          </ul>
          <div class="pos-list-body-list">
            <ul v-for="(item, i) in data.posList">
              <li>{{ item.macName }}</li>
              <li>{{ item.posName }}</li>
              <li>
                <div
                  class="set-color"
                  :style="'background-color:' + item.color"
                  @click.stop="setColor(item, data, $event)"
                ></div>
              </li>
              <li>
                <div
                  class="operation-xuanzhong"
                  @click="setViewCondition(item, data)"
                >
                  <i
                    class="iconfont"
                    :class="setSelectBox(item.isShow)"
                  ></i>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- <div class="close-retrieval">
          <i class="iconfont icon-cuohao"></i>
        </div> -->
      </div>

      <div class="search-data">
        <button @click="poslist(true)">
          <!-- 测点选择 -->{{$t('dip.posChoose')}}
        </button>
        <button @click="compare">
          <!-- 加入对比 -->{{$t('dip.AddComparison')}}
        </button>
        <button @click="dataRetrieval">
          <!-- 数据检索 -->{{$t('Common.retrieval')}}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { getTime, round, setConditionAlarm, cloneObj } from 'utils/utils.js'
import myChart from '@/assets/js/myCharts.js'
export default {
  name: 'dip',
  data() {
    return {
      dipData: {} /* 倾角分布图(沉降跟踪图)数据信息 */,
      currentKey: '' /* 当前打开图谱key */,
      currentIndex: 0 /* 当前显示第几个图谱 */,
      requestData: null /* 请求参数信息 */,
      lineStyle: {
        // 样式
        color: '#999', // 颜色，默认 '#0032ff'
      },
      fontStyle: {
        color: '#666',
      },
      color: ['#3300CC', '#CCCC00', '#993366', '#00CC99'],
      moveDivMsg: {
        /* 移动的表头信息 */
        x: null,
        y: null,
        offsetX: null,
        offsetY: null,
        isDown: null,
        dv: null,
      },
    }
  },
  watch: {
    '$store.state.structure'() {
      this.$nextTick(() => {
        this.dipData[this.currentKey].chart.resize()
      })
    },
    '$store.state.dipMsg': {
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
    // 打开倾角分布图(沉降跟踪图)
    openChartList(key, type, delKey) {
      if (typeof key !== 'string') return
      this.isNewChart = false
      let [, , mId, id, pType] = key.split('_')
      let posListKey = mId + '_' + id + '_' + pType
      let state = this.$store.state
      let mac = state.checkMsg.mac
      let pos = cloneObj(state.checkMsg.pos, true)
      let keyArr = Object.keys(this.dipData)
      let requestData
      if (type === 0 || type === 1) {
        this.currentIndex = keyArr.indexOf(key)
        this.currentKey = key
        let time = state.srcParams.time
        let speed = state.srcParams.speed
        let density = state.srcParams.density
        requestData = {
          positionType: pType,
          positionId: id,
          machineId: mId,
          dgmType: pos.dgm_type,
          page: 1,
          pageNum: null,
          startTime: time.start,
          endTime: time.end,
          fromSpeed: speed.min,
          toSpeed: speed.max,
          type: 2,
          density: Number(density.type),
          t_root: pos.t_root,
        }
        for (let k in this.dipData) {
          this.dipData[k].isShow = false
        }
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.currentIndex = keyArr.length
          this.isNewChart = true
          this.$set(this.dipData, key, {
            isShow: true,
            eigenvalue: [],
            currentEigen: {},
            clickView: {
              isShow: false,
              data: [],
            },
            showAlarm: false,
            // value: {},
            empty: {
              isShow: true,
              checkFlag: false, // 多个测点，是否显示无数据的标志
              text: this.$t('Common.noDataText'), //无数据
            },
            condition: {
              o1: {
                isShow: false,
                name: this.$t('Common.Case1'), //工况1
              },
              o2: {
                isShow: false,
                name: this.$t('Common.Case2'), //工况2
              },
              o3: {
                isShow: false,
                name: this.$t('Common.Case3'), //工况3
              },
              o4: {
                isShow: false,
                name: this.$t('Common.Case4'), //工况4
              },
              o5: {
                isShow: true,
                name: this.$t('Common.OtherCond'), //其他工况
              },
            },
            addPosCondition: {
              position_type: pos.position_type,
              pos_loc: pos.pos_loc,
            },
            requestData,
            posList: {
              [posListKey]: {
                pos,
                macName: mac.mac_me,
                posName: pos.position_name,
                color: '#000000',
                isShow: true,
                value: {},
              },
            }, // 存放所有的测点
            posListTab: false,
            chart: null, //创建实例
          })
          /* 创建图谱实例 */
          this.$nextTick(() => {
            this.dipData[key].chart = myChart.init(
              this.$refs.myDipChart[this.currentIndex]
            )
          })
          this.getData(this.dipData[key])
          break
        case 1 /* 切换图表 */:
          this.dipData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.dipData, key)
          break
      }
    },

    // 点击选择特征值
    setEigenvalue(data, e) {
      const list = data.eigenvalue
      const size = e.currentTarget.getBoundingClientRect()
      const style = {
        maxHeight: 'auto',
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height}px`,
      }
      const text = []
      for (let value of list) {
        text.push({
          val: value.name,
          code: value.code,
          filed: value.filed,
        })
      }
      data.showAlarm = false
      this.$list({
        text,
        pattern: style,
      }).then((res) => {
        this.closeList(data, res.item, res.index)
        this.setOption(data)
      })
    },
    // 选中特征值
    closeList(data, val, index) {
      if (index > -1) {
        for (let value of data.eigenvalue) {
          if (value.code === val.code) {
            value.isShow = true
            this.isNewChart = true
            data.currentEigen = cloneObj(value, true)
          } else {
            value.isShow = false
          }
        }
      }
    },
    // 获取数据
    getData(dipData) {
      this.$emit('loadingImg', true)
      let requestData = dipData.requestData
      dipData.empty.checkFlag = false // 默认值
      /* 后台没时间改接口，多个测点需要多次请求，每次都要重新画图，数据多会卡，以后优化 */
      for (let key in dipData.posList) {
        let [macId, positionId, postionType] = key.split('_')
        requestData.positionType = postionType
        requestData.positionId = positionId
        requestData.machineId = macId
        this.$getApi.getSaveData(requestData).then((res) => {
          res && this.setData(res, dipData, key)
          this.$emit('loadingImg', false)
        })
      }
    },
    // 获取数据成功
    setData(data, dipData, key) {
      const list = data.list
      const length = list.length
      let dipValue = dipData.posList[key]
      dipValue.value = {} // 初始化数据
      if (length > 0) {
        dipData.empty.checkFlag = true //有数据
        dipData.empty.isShow = false
        const loc = dipValue.pos.pos_loc
        let alarm = {
          38000: data[38000],
          40000: data[40000],
          48000: data[48000],
        }
        let code = [
          {
            filed: 'overturn_p',
            name: this.$t('eigenvalue.overturn_p'), //峰值
            code: 38000,
            isShow: true,
            unit: '°',
            uName: this.$t('unit.angle'), //角度
          },
          {
            filed: 'rock_avg',
            name: this.$t('eigenvalue.rock_avg'), //平均值
            code: 40000,
            isShow: false,
            unit: '°',
            uName: this.$t('unit.angle'), //角度
          },
          {
            filed: 'overturn_s',
            name: this.$t('eigenvalue.overturn_s'), //位移
            code: 48000,
            isShow: false,
            unit: 'm',
            uName: this.$t('eigenvalue.overturn_s'), //位移
          },
        ]
        let phase = [
          {
            filed: 'rock_rms',
            name: this.$t('eigenvalue.rock_rms'), //平均值方位
            code: 41000,
          },
          {
            filed: 'rock_p',
            name: this.$t('eigenvalue.rock_p'), //峰值方位
            code: 42000,
          },
        ]
        if (loc === '2') {
          alarm = {
            40000: data[40000],
            43000: data[43000],
          }
          code = [
            {
              filed: 'rock_pp',
              name: this.$t('eigenvalue.rock_pp'), //沉降量
              code: 43000,
              isShow: true,
              unit: 'mm',
              uName: this.$t('eigenvalue.overturn_s'), //位移
            },
            {
              filed: 'rock_avg',
              name: this.$t('eigenvalue.SettlementAngle'), //沉降角度
              code: 40000,
              isShow: false,
              unit: '°',
              uName: this.$t('unit.angle'), //角度
            },
          ]
          phase = [
            {
              filed: 'rock_rms',
              name: this.$t('eigenvalue.rock_rms'), //平均值方位
              code: 41000,
            },
          ]
        }
        for (let i = 0, l = code.length; i < l; i++) {
          if (!data[code[i].code]) {
            code.splice(i, 1)
            i--
            l = code.length
          }
        }
        const value = setConditionAlarm(
          code,
          phase,
          alarm,
          data.condition,
          dipValue.pos.offset_angle,
          list,
          data.posList1,
          data.posList2
        )
        dipData.eigenvalue = code
        dipData.currentEigen = code[0]
        dipValue.value = value
        dipData.clickView = {
          isShow: false,
          data: [],
        }
        dipData.showAlarm = false
        this.setOption(dipData)
      } else {
        /* 多个请求，来个延迟，只要有一个有数据就不显示无数据，防止闪屏*/
        setTimeout(() => {
          if (!dipData.empty.checkFlag) {
            dipData.empty.isShow = true
            dipData.empty.text = `${dipValue.posName}${this.$t('Common.noDataText')}`//无数据
          }
        }, 500)
      }
    },
    // // 修改颜色
    // setColor(data, key, e) {
    //   const color = data.value[data.currentEigen.code][key].color;
    //   const size = e.currentTarget.getBoundingClientRect();
    //   this.$color({
    //     pattern: {
    //       left: `${size.left}px`,
    //       top: `${size.top + size.height}px`
    //     },
    //     color
    //   }).then(res => {
    //     data.value[data.currentEigen.code][key].color = res;
    //     this.setOption(data);
    //   });
    // },
    setColor(item, data, e) {
      const color = item.color
      const size = e.currentTarget.getBoundingClientRect()
      this.$color({
        pattern: {
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
        color,
      }).then((res) => {
        item.color = res
        this.setOption(data)
      })
    },
    // 是否显示报警线
    viewAlarm(data) {
      data.showAlarm = !data.showAlarm
      this.setOption(data)
    },
    // 设置显示工况数据
    setViewCondition(item, data) {
      item.isShow = !item.isShow
      this.setOption(data)
    },
    setOption(data) {
      const x = []
      const y = []
      const alarm = []
      const time = []
      const color = []
      let conditionArr = {}
      let newconditionArr = {} //存放isShow 为true的情况的工况
      let unit = ''
      let arr = []
      const that = this
      for (let posValue in data.posList) {
        if (data.posList[posValue].isShow) {
          for (let val of data.eigenvalue) {
            if (val.isShow) {
              conditionArr = data.posList[posValue].value[val.code]
              unit = val.unit
              break
            }
          }
          for (let key in conditionArr) {
            const value = conditionArr[key]
            /* 保存isShow 为true的工况  */
            // if (key !== "o5" && value.isShow) {
            //   newconditionArr[`o${i}`] = value;
            //   i++;
            // }
            if (data.condition[key].isShow) {
              alarm.push(
                {
                  data: value.alarm.h,
                  lineStyle: {
                    width: 1,
                    color: '#C4C200',
                  },
                },
                {
                  data: value.alarm.hh,
                  lineStyle: {
                    width: 1,
                    color: '#ff0000',
                  },
                }
              )
              arr.push(...value.x)
              x.push(value.x)
              y.push(value.y)
              time.push(value.time)
              color.push(data.posList[posValue].color)
            }
          }
        }
      }
      let maxAmplitude = Number.MIN_VALUE
      for (let i = 0, l = arr.length; i < l; i++) {
        maxAmplitude < arr[i] && (maxAmplitude = arr[i])
      }
      maxAmplitude *= 2
      maxAmplitude = round(maxAmplitude, 4)
      maxAmplitude < 0.1 && (maxAmplitude = 0.1)
      const option = {
        grid: {
          top: 30,
          bottom: 30,
        },
        series: {
          unit,
          coordinateSystem: 'circle',
          lineStyle: {
            // 样式
            color: this.lineStyle.color, // 颜色，默认 '#0032ff'
            width: 1, // 粗细，默认 1
          },
          circleAlarm: data.showAlarm ? alarm : [],
          fontStyle: {
            color: this.fontStyle.color,
            size: '14px',
            family: 'Microsoft YaHei',
          },
          data: {
            amplitude: x,
            phase: y,
            color,
            maxAmplitude,
          },
        },
        toolTip: {
          formatter: function (params) {
            const index1 = params.index1
            const index2 = params.index2
            // conditionArr 存在isShow 为false 的情况 会导致
            //从新组织一个结构
            // let cd = newconditionArr[`o${index1 + 1}`];
            // cd === undefined && (cd = conditionArr.o5);
            data.clickView = {
              isShow: true,
              data: [
                { name: that.$t('Common.time'), value: getTime(time[index1][index2]) },//时间
                {
                  name: data.currentEigen.uName,
                  value: `${x[index1][index2]}${unit}`,
                },
                { name: that.$t('unit.position'), value: `∠${y[index1][index2]}${unit}` },//方位
                // { name: cd.name, value: `${cd.alarm.h}~${cd.alarm.hh}` }
              ],
            }
          },
        },
      }
      /* 之后更新数据 */
      data.chart && data.chart.setOption(option)
    },

    // 选中框状态
    setSelectBox(bool) {
      const className = [
        'icon-zhongzi_xuanzekuang',
        'icon-zhongzi_xuanzekuang1',
      ]
      return className[Number(bool)]
    },

    // 点击数据检索
    dataRetrieval() {
      this.$retrieval('dip').then((res) => {
        if (res) {
          let dipData = this.dipData[this.currentKey]
          let rd = dipData.requestData
          rd.startTime = res.startTime
          rd.endTime = res.endTime
          rd.fromSpeed = res.minSpeed
          rd.toSpeed = res.maxSpeed
          rd.density = Number(res.density.type)
          this.getData(dipData)
        }
      })
    },
    //打开测点列表
    poslist(flag) {
      let dipData = this.dipData[this.currentKey]
      dipData.posListTab = flag
    },
    // 拖动弹窗头
    moveDiv(event) {
      this.moveDivMsg.dv = event.currentTarget.parentElement
      this.moveDivMsg.x = event.clientX
      this.moveDivMsg.y = event.clientY

      //获取左部和顶部的偏移量
      this.moveDivMsg.offsetX = this.moveDivMsg.dv.offsetLeft
      this.moveDivMsg.offsetY = this.moveDivMsg.dv.offsetTop
      //开关打开
      this.moveDivMsg.isDown = true
    },
    moveDivUp(event) {
      //开关关闭
      this.moveDivMsg.isDown = false
    },
    dragMove(e) {
      if (this.moveDivMsg.isDown == false || this.moveDivMsg.isDown == null) {
        return
      }
      //获取x和y
      var nx = e.clientX
      var ny = e.clientY
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (this.moveDivMsg.x - this.moveDivMsg.offsetX)
      var nt = ny - (this.moveDivMsg.y - this.moveDivMsg.offsetY)

      this.moveDivMsg.dv.style.left = nl + 'px'
      this.moveDivMsg.dv.style.top = nt + 'px'
    },
    /* 加入不同的机组 */
    compare() {
      /* 获取当前的数据 */
      let dipData = this.dipData[this.currentKey]
      /* 获取check的pos */
      let currentMac = this.$store.state.checkMsg.mac
      let currentPos = this.$store.state.checkMsg.pos
      if (currentPos) {
        let pos_loc = dipData.addPosCondition.pos_loc
        let position_type = dipData.addPosCondition.position_type
        if (
          pos_loc != currentPos.pos_loc ||
          position_type != currentPos.position_type
        ) {
          this.$pop(this.$t('wearTrend.dropPosLimit'))//不支持此类测点
          return
        }
        let key =
          currentPos.machine_id +
          '_' +
          currentPos.position_id +
          '_' +
          currentPos.position_type
        /* 要加入的测点已经存在 */
        if (dipData.posList[key] !== undefined) {
          this.$pop(this.$t('wearTrend.existCarTip'))//当前图谱已存在该测点
          return
        }
        let randomNum = Math.floor(Math.random() * this.color.length)
        let randomColor = this.color[randomNum]
        this.$set(dipData.posList, key, {
          pos: cloneObj(currentPos),
          macName: currentMac.mac_me,
          posName: currentPos.position_name,
          color: randomColor,
          isShow: true,
          value: {},
        })
        /* 请求数据 */
        this.getData(dipData)
      } else {
        this.$pop(this.$t('Common.popPosTips'))//请选择测点
      }
    },
    mousemove(e) {
      if (this.moveDivMsg.isDown == false || this.moveDivMsg.isDown == null) {
        return
      }
      //获取x和y
      var nx = e.clientX
      var ny = e.clientY
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (this.moveDivMsg.x - this.moveDivMsg.offsetX)
      var nt = ny - (this.moveDivMsg.y - this.moveDivMsg.offsetY)

      this.moveDivMsg.dv.style.left = nl + 'px'
      this.moveDivMsg.dv.style.top = nt + 'px'
    },
  },
  created() {
    this.$store.commit('set_keepAlive', { method: 'add', keepAlive: 'dip' })
    let that = this
    //鼠标移动
    window.addEventListener('mousemove', this.mousemove)
  },
  destroyed() {
    window.removeEventListener('mousemove', this.mousemove)
  },
}
</script>
