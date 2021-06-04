<!-- 监测报表 -->
<template>
  <div class="data-retrieval-bg">
    <div class="data-retrieval-box big-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <span>数据检索</span>
        <div
          class="close-retrieval"
          @click="closeRetrieval(0)"
        >
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 测点选择 -->
      <!-- <div class="select-box">
        <div class="select-title msg-title">{{ info.title }}</div>
        <div class="select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border">
          {{ info.value }}
        </div>
      </div> -->
      <!-- 选择时间类型 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">时间</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeTimeType"
        >
          {{ dateType.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 开始时间 -->
      <div class='select-time'>
        <div class='select-title time-title'>开始时间</div>
        <!-- <input class='retrieval-start-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 结束时间 -->
      <div class='select-time'>
        <div class='select-title time-title'>结束时间</div>
        <!-- <input class='retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 转速区间 -->
      <div class="set-speed">
        <div class="select-title speed-title">转速区间</div>
        <input
          type="number"
          class="input-value radius outside-border edge-outside-border"
          v-model="result.minSpeed"
        />
        <div class="speed-bar">
          <div></div>
        </div>
        <input
          type="number"
          class="input-value radius outside-border edge-outside-border"
          v-model="result.maxSpeed"
        />
      </div>
      <!-- 选择查询密度 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">查询密度</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeDensityType"
        >
          {{ density.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 实时值是否显示 -->
      <div class="set-realtimeValue">
        <div class="select-title">实时值</div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            v-model="result.isReal"
            value="1"
          />
          <label>显示</label>
        </div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            v-model="result.isReal"
            value="0"
          />
          <label>隐藏</label>
        </div>
      </div>
      <!-- 预警报警值 -->
      <div class="set-realtimeValue">
        <div class="select-title">预警报警值</div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            value="1"
            v-model="isShowAlarm"
          />
          <label>显示</label>
        </div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            value="0"
            v-model="isShowAlarm"
          />
          <label>隐藏</label>
        </div>
      </div>
      <!-- 统计方式 -->
      <div class="set-realtimeValue">
        <div class="select-title">统计方式</div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            value="1"
            v-model="vital"
          />
          <label>小时</label>
        </div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            value="2"
            v-model="vital"
          />
          <label>天</label>
        </div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            value="3"
            v-model="vital"
          />
          <label>月</label>
        </div>
        <div class="set-realtimeInput">
          <input
            type="radio"
            value="0"
            v-model="vital"
          />
          <label>不统计</label>
        </div>
      </div>

      <!-- 机组选择 -->
      <div
        class="check-eigenvalue-box scroll-style-edge"
        v-show="info.isMac"
      >
        <div class="select-title">所有机组</div>
        <ul
          class="check-eigenvalue radius select-none"
          id="my-pos"
        >
          <div id="tt">
            <div
              id="choose-item"
              v-for="(item, index) in macChoose"
            >
              <div class="check-box">
                <label :for="item.id">
                  <i
                    class="my-icon"
                    :class="setIconClass(item.isShow)"
                  ></i>
                </label>
                <input
                  type="checkbox"
                  :id="item.id"
                  v-model="item.isShow"
                />
              </div>
              <div
                v-if="item.pos_loc"
                class="choose-name"
                @click="show_pos(item)"
              >
                {{ item.name }}
              </div>
              <div
                v-else
                class="choose-name"
                @click="show_pos(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </ul>
      </div>
      <!-- 测点选择 -->
      <div
        class="check-eigenvalue-box scroll-style-edge"
        v-show="info.isMac"
      >
        <div class="select-title">所有测点</div>
        <ul
          class="check-eigenvalue radius select-none"
          id="my-pos"
        >
          <!-- <li v-for='(item, index) in viewMsg.eigenvalue' :key=index @click.stop='checkEigenvalue(item)' :title='item.val'>
                  <i class='iconfont' :class='setIcon(item.isShow)'></i>
                  {{item.val}}
               </li> -->
          <div id="tt">
            <div
              id="choose-item"
              v-for="(item, index) in posChoose"
            >
              <div class="check-box">
                <label :for="item.id">
                  <i
                    class="my-icon"
                    :class="setIconClass(item.isShow)"
                  ></i>
                </label>
                <input
                  type="checkbox"
                  :id="item.id"
                  v-model="item.isShow"
                />
                <!--                      <label class = "choose-box" :for="item.id"></label>-->
              </div>
              <div
                v-if="item.pos_loc"
                class="choose-name"
                @click="show_value(item.type, item.dgm_type, item.pos_loc)"
              >
                {{ item.name }}
              </div>
              <div
                v-else
                class="choose-name"
                @click="show_value(item.type, item.dgm_type)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </ul>
      </div>

      <!-- 特征值选择显隐 -->
      <div class="check-eigenvalue-box scroll-style-edge">
        <div class="select-title">
          <p>{{ valueName }}</p>
          <p>特征值</p>
        </div>
        <div
          class="check-eigenvalue radius select-none"
          id="my-pos"
        >
          <!-- <li v-for='(item, index) in viewMsg.eigenvalue' :key=index @click.stop='checkEigenvalue(item)' :title='item.val'>
                  <i class='iconfont' :class='setIcon(item.isShow)'></i>
                  {{item.val}}
               </li> -->
          <div>
            <div
              id="choose-item"
              v-for="(item, index) in valueChoose"
            >
              <div class="check-box">
                <label :for="item.filed">
                  <i
                    class="my-icon"
                    :class="setIconClass(item.isShow)"
                  ></i>
                </label>
                <input
                  type="checkbox"
                  :id="item.filed"
                  v-model="item.isShow"
                />
                <!--                    <label class = "choose-box" :for="item.filed"></label>-->
              </div>
              <label
                class="choose-name"
                :for="item.filed"
              >{{
                item.val
              }}</label>
            </div>
          </div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="data-retrieval-btn">
        <button @click="macInverse">机组全选</button>
        <button @click="posInverse">测点全选</button>
        <button @click="valueInverse">特征值全选</button>
      </div>
      <div class="data-retrieval-btn">
        <button @click="reset">重置</button>
        <!-- <button @click="posInverse">测点</button>
        <button @click="valueInverse">特征值</button> -->
        <button @click="closeRetrieval(1)">确定</button>
        <button
          class="disable-btn"
          @click="closeRetrieval(0)"
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import MyMixins from './PublicMethods.js'
import { setHead, posType_name, cloneObj } from 'utils/utils.js'
export default {
  // import引入的组件需要注入到对象中才能使用
  data() {
    return {
      info: {
        title: '当前机组',
        value: null,
        isMac: true,
        key: null, //若从机组进入
      },
      isShowAlarm: null, //是否显示报警
      vital: null, //统计方式
      valueName: '', //测点类型名称
      value: {
        // postype:[{filed:id,val:name,isShow:true}]
      }, //特征值存储列表
      macChoose: [
        // {id:macid,name:macname},
      ],
      pos: {
        /* macid:[{id:posid_postype,name:posname}] */
      },
      posChoose: [],
      /* [{id:posid_postype,name:posname},]//测点显示列表 */
      valueChoose: [
        // {filed:id,val:name,isShow:true}
      ], //特征值显示列表
      flag: false, //标志机组全选反选
      flag1: false, //标志测点全选反选
      flag2: false, //标志特征值全选反选
    }
  },
  mixins: [MyMixins],
  methods: {
    initParams(params) {
      let flag = false //是否之前保存过
      if (params.retrievalParams) {
        //存在之前修改过的参数
        this.value = params.retrievalParams.value
        this.pos = params.retrievalParams.pos
        this.macChoose = params.retrievalParams.macChoose
        this.isShowAlarm = params.retrievalParams.isShowAlarm
        this.vital = params.retrievalParams.vital
        flag = true
      } else {
        this.isShowAlarm = 0
        this.vital = 0
      }
      if (params.type == 'mac') {
        this.posChoose = {}
        //机组
        this.info.value = params.msg.m_me
        if (!flag) {
          //初始化信息
          //初始化机组信息
          let mac = params.mac
          if (params.macArr) {
            let macItem = {},
              checkMac
            params.macArr.forEach((item) => {
              if (
                (mac.mac_id && mac.mac_id == item.mac_id && !mac.pump_id) ||
                (mac.pump_id && mac.pump_id == item.pump_id)
              ) {
                macItem = {
                  id: item.pump_id
                    ? `${item.mac_id}_${item.ch_class}`
                    : item.mac_id,
                  type: item.pump_id ? 'pump' : 'mac',
                  mac_id: item.mac_id,
                  m_type: item.m_type,
                  t_root: item.t_root,
                  ch_class: item.ch_class,
                  isShow: true,
                  pump_id: item.pump_id,
                  name: item.name || item.pump_name || item.mac_me,
                }
                checkMac = macItem
              } else {
                macItem = {
                  id: item.pump_id
                    ? `${item.mac_id}_${item.ch_class}`
                    : item.mac_id,
                  type: item.pump_id ? 'pump' : 'mac',
                  mac_id: item.mac_id,
                  m_type: item.m_type,
                  t_root: item.t_root,
                  ch_class: item.ch_class,
                  isShow: false,
                  name: item.name || item.pump_name || item.mac_me,
                  pump_id: item.pump_id,
                }
              }
              this.macChoose.push(macItem)
              this.get_pos(macItem)
            })
            //初始化测点信息
            let key = mac.pump_id ? `${mac.mac_id}_${mac.ch_class}` : mac.mac_id
            this.info.key = key
            let posChoose = []
            if (params.posArr) {
              posChoose = this.setPosInfo(params.posArr)
              this.posChoose = posChoose
              this.$set(this.pos, key, posChoose)
            }
          }
        }
      } else if (params.type == 'pos') {
        this.posChoose = []
        //测点
        this.info.title = '当前测点'
        this.info.isMac = false
        this.info.value = params.msg.position_name
        !flag && this.get_value_choose(params.msg) //初始化信息
        if (params.msg.position_type === 13) {
          // let key = `${params.msg.position_type}_${params.msg.dgm_type}_${params.msg.pos_loc}`
          this.show_value(
            params.msg.position_type,
            params.msg.dgm_type,
            params.msg.pos_loc
          )
        } else {
          // let key = `${params.msg.position_type}_${params.msg.dgm_type}`
          this.show_value(params.msg.position_type, params.msg.dgm_type)
        }
      }
      //将选择的值和回调结果关联
      this.result.retrievalParams = {
        type: params.type,
        value: this.value,
        pos: this.pos,
        macChoose: this.macChoose,
        isShowAlarm: this.isShowAlarm, //预警报警
        vital: this.vital, //统计方式
      }
    },
    // 关闭数据检索
    closeRetrieval(type = 1) {
      if (type === 1) {
        const res = this.result
        let minSpeed = parseInt(res.minSpeed)
        let maxSpeed = parseInt(res.maxSpeed)
        // let startTime = this.startTime.selectedDates[0].valueOf();
        // let endTime = this.endTime.selectedDates[0].valueOf();
        let startTime = this.startTime
        let endTime = this.endTime
        let upper = parseFloat(res.upper)
        let lower = parseFloat(res.lower)
        let isReal = res.isReal
        let density = res.density

        if (endTime <= startTime) {
          this.$pop('结束时间必须大于开始时间')
          return
        }
        if (!isNaN(maxSpeed) && !isNaN(minSpeed) && maxSpeed <= minSpeed) {
          this.$pop('最大转速必须大于最小转速')
          return
        }
        if (!isNaN(lower) && !isNaN(upper) && upper <= lower) {
          this.$pop('上限过滤必须大于下限过滤')
          return
        }
        res.minSpeed === '' && (minSpeed = '')
        res.maxSpeed === '' && (maxSpeed = '')
        res.upper === '' && (upper = '')
        res.lower === '' && (lower = '')
        this.$store.commit('changeSrcParams', {
          time: {
            start: startTime,
            end: endTime,
            val: this.dateType.val,
          },
          speed: {
            min: minSpeed,
            max: maxSpeed,
          },
          limit: {
            upper,
            lower,
          },
          density: density,
        })
        this.$store.commit('changeisReal', isReal)
        this.result.startTime = startTime
        this.result.endTime = endTime
        //8000数据类型
        if (this.dataType !== null) {
          let checkNum = 0
          this.dataType.forEach((element) => {
            if (element.isChecked == true) {
              checkNum++
            }
          })
          if (checkNum == 0) {
            this.$pop('请至少选择一个数据类型！')
            return
          }
        }
        this.result.dataType = this.dataType
        //8000特征值单选
        if (this.eigenvalue) {
          this.result.eigenvalue = this.eigenvalue
        }
        this.result.retrievalParams.isShowAlarm = this.isShowAlarm
        this.result.retrievalParams.vital = this.vital
        this.resolve(this.result)
      }
      this.isShow = false
      this.remove()
      this.resolve(false)
    },
    get_value_choose(msg) {
      // if(!this.value[`${msg.position_type}_${msg.dgm_type}_${msg.pos_loc}`]){
      let exCode = [0, 18000]
      if (msg.position_type == 13) {
        let a = setHead(
          msg.t_root,
          msg.dgm_type,
          msg.position_type,
          msg.pos_loc
        )
        let b = []
        for (let i = 0; i < a.length; i++) {
          // 去除时间特征值 / 数字量类型
          if (!exCode.includes(a[i].code)) {
            b.push(a[i])
          }
        }
        this.value[`${msg.position_type}_${msg.dgm_type}_${msg.pos_loc}`] = b
      } else {
        let a = setHead(msg.t_root, msg.dgm_type, msg.position_type)
        let b = []
        for (let i = 0; i < a.length; i++) {
          if (!exCode.includes(a[i].code)) {
            b.push(a[i])
          }
        }
        this.value[`${msg.position_type}_${msg.dgm_type}_0`] = b
      }
      // }
    },
    show_value(ptype, dgm_type, pos_loc = 0) {
      this.valueName = posType_name(ptype)
      this.valueChoose = this.value[`${ptype}_${dgm_type}_${pos_loc}`]
      this.flag2 = false // 初始化标志，第一次默认都是取消
    },
    // 获取机组下的所有测点
    get_pos(item) {
      let posArray = this.$store.state.pos[item.id]
      // 点击机组显示当前机组下的测点
      if (!this.pos[item.id]) {
        if (!posArray) {
          posArray = []
          let req = {
            mac_id: item.mac_id,
            m_type: item.m_type,
            t_root: item.t_root,
          }
          if (item.type == 'pump') {
            req.ch_class = item.ch_class
          }
          this.$getApi.queryAllPositionsByMacId(req).then((res1) => {
            if (res1) {
              if (res1.positions && res1.positions.length > 0) {
                posArray = res1.positions
                let posChoose = this.setPosInfo(posArray)
                this.$set(this.pos, item.id, posChoose)
              }
            }
          })
        } else {
          let posChoose = this.setPosInfo(posArray)
          this.$set(this.pos, item.id, posChoose)
        }
      }
    },
    // 设置测点信息
    // posArray：测点列表
    setPosInfo(posArray) {
      let posChoose = []
      posArray.forEach((pos) => {
        if (pos.position_type == 200) return //不显示长采样
        if (pos.position_type === 13) {
          posChoose.push({
            id: `${pos.position_id}_${pos.position_type}`,
            isShow: true,
            name: pos.position_name,
            type: pos.position_type,
            posId: pos.position_id,
            dgm_type: pos.dgm_type,
            pos_loc: pos.pos_loc,
          })
        } else {
          posChoose.push({
            id: `${pos.position_id}_${pos.position_type}`,
            isShow: true,
            name: pos.position_name,
            type: pos.position_type,
            posId: pos.position_id,
            dgm_type: pos.dgm_type,
          })
        }
        this.get_value_choose(pos) // 获取所有测点类型的特征值
      })
      return posChoose
    },
    // 显示测点
    show_pos(item) {
      this.info.key = item.id
      this.posChoose = this.pos[item.id]
    },
    macInverse() {
      this.flag = false
      for (let i = 0; i < this.macChoose.length; i++) {
        if (this.macChoose[i].isShow === false) {
          this.flag = true
          break
        }
      }
      for (let i = 0; i < this.macChoose.length; i++) {
        this.macChoose[i].isShow = this.flag
      }
    },
    posInverse() {
      this.flag1 = false
      for (let i = 0; i < this.posChoose.length; i++) {
        if (this.posChoose[i].isShow === false) {
          this.flag1 = true
          break
        }
      }
      for (let i = 0; i < this.posChoose.length; i++) {
        this.posChoose[i].isShow = this.flag1
      }
    },
    valueInverse() {
      this.flag2 = false
      for (let i = 0; i < this.valueChoose.length; i++) {
        if (this.valueChoose[i].isShow === false) {
          this.flag2 = true
          break
        }
      }
      for (let i = 0; i < this.valueChoose.length; i++) {
        this.valueChoose[i].isShow = this.flag2
      }
    },
    //设置icon的class
    setIconClass(bool) {
      const iName = 'iconfont'
      const check = ['icon-zhongzi_xuanzekuang', 'icon-zhongzi_xuanzekuang1']
      return `${iName} ${check[Number(bool)]}`
    },
  },
}
</script>
<style scoped lang='scss'>
#my-pos {
  height: 130px; /* 200 130 */
  overflow: auto;
}
#tt {
  white-space: nowrap;
}
#choose-item {
  height: 20px;
  font-size: 13px;
  .choose-name {
    display: inline-block;
    margin: auto auto;
    line-height: 20px;
    cursor: pointer;
  }
  .check-box {
    display: inline-block;
    position: relative;
    height: 16px;
    width: 16px;

    input[type='checkbox'] {
      position: absolute;
      left: 0;
      top: 0;
      height: 17px;
      width: 17px;
      visibility: hidden;
    }
    input[type='checkbox']:checked + label {
      border: 1px solid #6699ff;
      &::after {
        height: 7px;
        // transition: height .2s linear;
      }
      &::before {
        height: 12px;
        // transition: height .1s linear .2s;
      }
    }
    .choose-box {
      position: absolute;
      left: 0;
      top: 0;
      height: 17px;
      width: 17px;
      border: 1px solid rgb(154, 184, 245);
      border-radius: 5px;
      &::before,
      &::after {
        content: '';
        position: absolute;
        display: block;
        width: 1px;
        transform-origin: left top;
        border-radius: 2px;
        background-color: #6699ff;
      }
      &::after {
        content: '';
        left: 2px;
        top: 7px;
        height: 0;
        transform: rotate(-42deg);
      }
      &::before {
        content: '';
        left: 7px;
        top: 12px;
        height: 0;
        transform: rotate(-144deg);
      }
    }
  }
}
.data-retrieval-btn {
  button {
    width: 100px !important;
  }
}
</style>
