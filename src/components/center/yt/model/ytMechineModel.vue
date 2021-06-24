<template>
  <div>
    <div
      class="Yt-Model"
      :class='"Yt-Model"+key'
      v-for="(param,key) in ytMechineModel"
      v-show="param.isShow"
    >
      <div
        class="yt-table"
        v-for="(table, index) in param.tableList"
        :style="table.tableStyle"
        v-show="table.isShow"
      >
        <div class="left">
          <div>{{ table.name }}</div>
        </div>

        <div class="content">
          <div
            :class="itemGroup.itemClass"
            v-for="itemGroup in table.list"
          >
            <div
              v-for="(item, itemIndex) in itemGroup.itemList"
              @dblclick="turntoTrend(itemGroup.units[parseInt(itemIndex / 2)])"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="yt-model">
        <div
          class="model-item"
          v-for="item in param.modelItem"
          :style="item.position"
          @dblclick="turntoTrend(item.units)"
        >
          <div>
            {{ item.name }}
          </div>
          <div :style="{
            color: item.color
          }">
            {{ item.value }}
          </div>
        </div>
        <img
          src="~assets/images/yt/ytModel.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { itemMapping, round, cloneObj } from 'utils/utils.js'
export default {
  name: 'ytMechineModel',
  data() {
    return {
      ytMechineModel: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'ytMechineModel',
    })
  },
  deactivated() {
    clearInterval(this.ytMechineModel[this.currentKey].timer)
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.ytMechineModel) {
        this.ytMechineModel[i].isShow = false
        clearInterval(this.ytMechineModel[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.ytMechineModel)
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
        mac = this.ytMechineModel[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.ytMechineModel, key, {
            mac,
            posNamePosition: {
              //测点的位置
              left: 15,
              tops: [53, 98, 170, 217, 282, 328, 374, 440, 485, 532],
            },
            //图上测点的结构
            posList: [
              'O_01',
              'O_02',
              'O_03',
              'O_04',
              'O_05',
              'O_06',
              'O_07',
              'O_08',
              'O_09',
              'O_10',
            ],
            line: {
              bianya: [1149, 99, 801, 205], //x1,y1,x2,y2
              bianpin: [1149, 214, 913, 214],
            }, //需要划线的点[x1,y1,x2,y2]
            tableLiHeight: 25,
            tableWidth: 380,
            tableColGap: 60,
            tableRowGap: 40, //表格纵向的间隔
            tableLeft: 60, //表格离左边的距离
            tableTop: 50, //表格离上面的距离
            nextTableGap: 650, //两个表格横间距
            //表格的结构
            tableList: {},
            //所有表格的样式
            tableStyle: {
              0: {
                name: 'jilu',
                nextDirection: ['transverse'],
                tableItemName: this.$t('YtMechineModel.tableTitle1'), //运行记录
                styleList: [
                  {
                    class: 'four-table',
                    key: ['C_01', 'C_02'],
                  },
                  {
                    class: 'four-table',
                    key: ['C_03', 'C_04'],
                  },
                ],
              },
              2: {
                name: 'bianpin',
                nextDirection: ['vertical'],
                tableItemName: this.$t('YtMechineModel.tableTitle2'), //变频器
                styleList: [
                  {
                    class: 'eight-table',
                    key: ['B_01', 'B_02', 'B_03', 'B_04'],
                  },
                ],
              },
              1: {
                name: 'bianya',
                nextDirection: ['vertical'],
                tableItemName: this.$t('YtMechineModel.tableTitle3'), //变压器
                styleList: [
                  {
                    class: 'six-table',
                    key: ['A_02', 'A_03', 'A_04'],
                  },
                  {
                    class: 'six-table',
                    key: ['A_05', 'A_06', 'A_07'],
                  },
                ],
              },
              4: {
                name: 'dianji',
                nextDirection: ['vertical'],
                tableItemName: this.$t('YtMechineModel.tableTitle4'), //井下电机
                styleList: [
                  {
                    class: 'six-table',
                    key: ['D_01', 'D_02', 'D_03'],
                  },
                  {
                    class: 'two-table',
                    key: ['D_04'],
                  },
                  {
                    class: 'two-table',
                    key: ['D_05'],
                  },
                ],
              },
              3: {
                name: 'gonghao',
                nextDirection: ['vertical'],
                tableItemName: this.$t('YtMechineModel.tableTitle5'), //系统功耗
                styleList: [
                  // {
                  //   class: "six-table",
                  //   key: ["F_01", "F_02", "F_03"]
                  // },
                  {
                    class: 'six-table',
                    key: ['F_04', 'F_05', 'F_06'],
                  },
                  {
                    class: 'six-table',
                    key: ['F_07', 'F_08', 'F_09'],
                  },
                  {
                    class: 'two-table',
                    key: ['F_10'],
                  },
                  {
                    class: 'two-table',
                    key: ['F_11'],
                  },
                  {
                    class: 'six-table',
                    key: ['F_12', 'F_13', 'F_14'],
                  },
                ],
              },
              5: {
                name: 'chuanganqi',
                nextDirection: ['vertical'],
                tableItemName: this.$t('YtMechineModel.tableTitle6'), //井下传感器
                styleList: [
                  {
                    class: 'four-table',
                    key: ['E_01', 'E_02'],
                  },
                  {
                    class: 'four-table',
                    key: ['E_03', 'E_04'],
                  },
                ],
              },
            },
            /* 定时器 */
            timer: [],
            modelItem: [],
            isShow: true,
          })
          this.$nextTick(() => {
            this.adaptation()
          })
          break
        case 1 /* 切换图表 */:
          this.ytMechineModel[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.ytMechineModel, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.ytMechineModel[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let requestData = {
          mac_id: mac.mac_id,
        }
        let fn = () => {
          this.getData(requestData)
          return fn
        }
        this.ytMechineModel[key].timer = setInterval(fn(), 6000)
      }
    },
    getData(requestData) {
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name === 'ytMechineModel'
      ) {
        this.$getApi.getDeviceModelData(requestData).then((res) => {
          if (res) {
            /* 处理图片上的测点的数据 */
            this.setPicList(res)
            /* 处理表格的测点的数据 */
            this.setTableList(res)
          }
        })
      } else {
        clearInterval(this.ytMechineModel[this.currentKey].timer)
      }
    },
    setPicList(res) {
      const param = this.ytMechineModel[this.currentKey]
      param.modelItem = [] //初始化
      param.posList.forEach((item, index) => {
        let obj = {}
        obj.name = itemMapping(item).CNname
        obj.units = null
        let mappingKey = itemMapping(item).mappingKey
        let key
        Object.keys(res.data).forEach((item) => {
          if (item.includes(mappingKey)) {
            key = item
          }
        })
        let value = res.data[key],
          color = ''
        if (value === undefined) {
          value = ''
        } else {
          if (value === null) {
            value = '—'
          } else {
            /* 报警值 */
            let unit = res.units[key]
            /* 如果有单位，是测点 */
            if (unit) {
              let unitNum = res.units[key].unitNum
              value = round(value, unitNum)
              let alarm = res.alarm[key]
              if (alarm !== undefined) {
                if (alarm === 1) {
                  //正常
                  color = '#009944'
                } else if (alarm === 2) {
                  color = '#FFA101'
                  //预警
                } else if (alarm === 3) {
                  //报警
                  color = '#F80000'
                }
              }
              /* 单位 */
              let unitName = res.units[key].unitName
              if (unitName[0]) {
                value = value + unitName[0]
              }
            }
          }
        }
        obj.value = value
        obj.color = color
        obj.units = res.units[key] // 存储单位
        obj.position = {
          left: param.posNamePosition.left + 'px',
          top: param.posNamePosition.tops[index] + 'px',
        }
        param.modelItem.push(obj)
      })
    },
    setTableList(res) {
      const param = this.ytMechineModel[this.currentKey]
      //循环我的表结构
      let data = res.data
      param.tableList = {} //初始化原来的表结构里面的数据
      let tableLeft = param.tableLeft
      let tableTop = param.tableTop
      for (let tableType in param.tableStyle) {
        let isShow = false
        /*井下传感器一定要显示  */
        let tableIns = param.tableStyle[tableType]
        if (tableIns.name == 'chuanganqi') {
          isShow = true
        }
        let obj = {}
        obj.name = tableIns.tableItemName
        obj.list = []
        let tableLiHeight = 0
        tableIns.styleList.forEach((group) => {
          /* 三种不同的结构 */
          let itemObj = {}
          itemObj.itemClass = group.class
          itemObj.units = []
          itemObj.itemList = []
          //找到里面项的key
          group.key.forEach((key, index) => {
            itemObj.units[index] = null
            /* 找到中文名称 */
            let CNname = itemMapping(key).CNname
            /* 找到映射的key */
            let mappingKey = itemMapping(key).mappingKey
            let dataKey
            Object.keys(res.data).forEach((item) => {
              if (item.includes(mappingKey)) {
                dataKey = item
              }
            })
            /* 取出后台传过来的值 */
            let value = data[dataKey]
            if (value === undefined) {
              //未接入
              value = this.$t('YtMechineModel.runStatus')
            } else {
              //无数据
              if (value === null) {
                value = '-'
              } else {
                // value有数据 需要保留小数
                let units = res.units[dataKey]
                /* 如果有单位，是测点，需要进行保留操作 */
                if (units) {
                  value = round(value, units.unitNum)
                  let unit = units.unitName[0]
                  if (unit) {
                    value += unit
                  }
                }
              }
              itemObj.units[index] = res.units[dataKey]
              //只要有一个有数据就显示这张表格，否则就不显示
              isShow = true
            }
            itemObj.itemList.push(CNname, value)
          })
          obj.list.push(itemObj)
          //设置 表格的高
          if (group.class == 'two-table') {
            tableLiHeight += param.tableLiHeight
          } else {
            tableLiHeight += param.tableLiHeight * 2
          }
        })
        if (isShow) {
          /* 划线 */
          let arr = param.line[tableIns.name]
          if (arr) {
            let canvas = document.getElementsByClassName(tableIns.name)[0]
            if (!canvas) {
              let parent = document.getElementsByClassName(
                `Yt-Model${this.currentKey}`
              )[0]
              canvas = document.createElement('canvas')
              canvas.className = tableIns.name
              canvas.style.position = 'absolute'
              canvas.style.zIndex = 1
              canvas.width = parent.offsetWidth
              canvas.height = parent.offsetHeight
              /* 画线 */
              let cxt = canvas.getContext('2d')
              cxt.clearRect(0, 0, canvas.width, canvas.height)
              cxt.beginPath()
              cxt.lineWidth = 1
              cxt.strokeStyle = '#42AEDB'
              cxt.moveTo(arr[0], arr[1])
              if (arr[1] != arr[3]) {
                cxt.lineTo(arr[2], arr[1])
              }
              cxt.lineTo(arr[2], arr[3])
              cxt.stroke()
              cxt.fillStyle = '#EB852A'
              cxt.shadowOffsetX = 0 // 阴影Y轴偏移
              cxt.shadowOffsetY = 0 // 阴影X轴偏移
              cxt.shadowBlur = 14 // 模糊尺寸
              cxt.shadowColor = '#fff' // 颜色
              cxt.beginPath()
              cxt.arc(arr[2], arr[3], 5, 0, 2 * Math.PI)
              cxt.closePath()
              cxt.fillStyle = 'rgba(34, 222 ,255,1)'
              cxt.fill()
              parent.appendChild(canvas)
            }
          }
        }
        obj.isShow = isShow
        obj.tableStyle = {
          height: tableLiHeight + 1 + 'px',
          left: tableLeft + 'px',
          top: tableTop + 'px',
        }
        //下一个是横向表格
        if (tableIns.nextDirection.includes('transverse')) {
          //如果存在和下一个表格之间特有的间隙
          // if (tableIns.nextTableGap) {
          //   nextTableGap = tableIns.nextTableGap;
          // }
          tableLeft += param.tableWidth + param.tableColGap + param.nextTableGap
        }
        //下一个是竖向表格
        if (tableIns.nextDirection.includes('vertical')) {
          tableTop += tableLiHeight + param.tableRowGap
        }
        //组装好的表结构放到数组库里面
        param.tableList[tableType] = obj
      }
    },
    turntoTrend(units) {
      if (units) {
        /* 存在单位 */
        let key = `${units.mac_id}_${units.pos_id}_${units.pos_type}`
        key = 'trend_pos_' + key
        this.$bus.$emit(
          'choiceChartType',
          key,
          this.$t('HeaderEdge.secondLevel2_3')
        ) //趋势图
      }
    },
    adaptation() {
      const param = this.ytMechineModel[this.currentKey]
      /* 适配1366 */
      let width_screen = window.screen.width
      if (width_screen <= 1366) {
        param.tableLiHeight = param.tableLiHeight * 0.72
        param.tableWidth = param.tableWidth * 0.65
        param.tableColGap = param.tableColGap * 0.65
        param.tableRowGap = param.tableRowGap * 0.3
        param.tableLeft = param.tableLeft * 0.65
        param.tableTop = param.tableTop * 0.65
        param.nextTableGap = param.nextTableGap * 0.65
        param.posNamePosition = {
          //测点的位置
          left: 0,
          tops: [30, 57, 100, 128, 167, 195, 223, 263, 290, 318],
        }
        param.line = {
          bianya: [748, 67, 487, 147], //x1,y1,x2,y2
          bianpin: [748, 135, 537, 135],
        }
      }
    },
  },
  watch: {
    // "$store.state.checkMsg.mac": {
    //   handler(value, oldValue) {
    //     clearInterval(this.timer);
    //     if (value) {
    //       /* 获取参数 */
    //       if (oldValue && value.mac_id === oldValue.mac_id) return;
    //       let requestData = {
    //         mac_id: value.mac_id
    //       };
    //       let fn = () => {
    //         this.getData(requestData);
    //         return fn;
    //       };
    //       this.timer = setInterval(fn(), 6000);
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
    '$store.state.ytMechineModelMsg': {
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
.Yt-Model {
  position: relative;
  .yt-table:first-child {
    width: 380px;
  }
  .yt-table {
    width: 470px;
    display: flex;
    border: 1px solid #3791b8;
    position: absolute;
    z-index: 2;
    .left {
      width: 45px;
      background: #0092fe;
      text-align: center;
      position: relative;
      div {
        width: 14px;
        font-size: 14px;
        line-height: 15px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .content {
      width: 100%;
      text-align: center;
      // div {
      //   height: 20px;
      // }
      .two-table {
        display: grid;
        grid-template-columns: repeat(2, 50.1%);
        grid-template-rows: 25px;
      }
      .four-table {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: repeat(2, 50.1%);
        grid-template-rows: repeat(2, 25px);
      }
      .six-table {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: repeat(3, 33.4%);
        grid-template-rows: repeat(2, 25px);
      }
      .eight-table {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: repeat(4, 25.08%);
        grid-template-rows: repeat(2, 25px);
      }
      .two-table,
      .four-table,
      .six-table,
      .eight-table {
        div {
          line-height: 25px;
          font-size: 12px;
          border-right: 1px solid #3791b8;
          border-bottom: 1px solid #3791b8;
          &:nth-child(odd) {
            color: #72bbda;
          }
          &:nth-child(even) {
            color: #abd2e4;
          }
        }
      }
      // background-color: #040a1a;
    }
  }
  .width1 {
    width: 380;
  }
  .yt-model {
    position: absolute;
    top: 200px;
    left: 56px;
    .model-item {
      position: absolute;
      z-index: 2;
      display: flex;
      width: 185px;
      div:nth-child(2) {
        position: absolute;
        right: 0px;
      }
    }
    img {
      position: relative;
    }
    // position: absolute;
    // top: 300px;
    // background: url("~assets/images/yt/ytModel.png") no-repeat;
    // background-size: 400px;
    // background-size: 100% 100%;
    // background-color: red;
  }
}
/* 适配 */
@media screen and (max-width: 1366px) {
  .Yt-Model {
    position: relative;
    .yt-table:first-child {
      width: 270px;
    }
    .yt-table {
      width: 380px;
      display: flex;
      border: 1px solid #3791b8;
      position: absolute;
      z-index: 2;
      .left {
        width: 32px;
        background: #0092fe;
        text-align: center;
        position: relative;
        div {
          width: 9px;
          font-size: 9px;
          line-height: 13px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .content {
        width: 100%;
        text-align: center;
        // div {
        //   height: 20px;
        // }

        .two-table {
          display: grid;
          grid-template-columns: repeat(2, 50.2%);
          grid-template-rows: 18px;
        }
        .four-table {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: repeat(2, 50.2%);
          grid-template-rows: repeat(2, 18px);
        }
        .six-table {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: repeat(3, 33.5%);
          grid-template-rows: repeat(2, 18px);
        }
        .eight-table {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: repeat(4, 25.1%);
          grid-template-rows: repeat(2, 18px);
        }
        .two-table,
        .four-table,
        .six-table,
        .eight-table {
          div {
            line-height: 18px;
            font-size: 8px;
            border-right: 1px solid #3791b8;
            border-bottom: 1px solid #3791b8;
            &:nth-child(odd) {
              color: #72bbda;
            }
            &:nth-child(even) {
              color: #abd2e4;
            }
          }
        }
        // background-color: #040a1a;
      }
    }
    .width1 {
      width: 380;
    }
    .yt-model {
      width: 567px;
      height: 345px;
      position: absolute;
      top: 142px;
      left: 40px;
      font-size: 9px;
      .model-item {
        transform: scale(0.8);
        position: absolute;
        z-index: 2;
        display: flex;
        width: 131px;
        div:nth-child(2) {
          position: absolute;
          right: 0px;
        }
      }
      img {
        position: relative;
        width: 100%;
        height: 100%;
      }
      // position: absolute;
      // top: 300px;
      // background: url("~assets/images/yt/ytModel.png") no-repeat;
      // background-size: 400px;
      // background-size: 100% 100%;
      // background-color: red;
    }
  }
}
</style>
