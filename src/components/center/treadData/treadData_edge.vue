<!-- 踏面测量数据 -->
<template>
  <div>
    <div class="treadData-content">
      <div class="treadData-table">
        <div class="tread-param">
          <div><!-- 设计参数 -->{{vm.$t('trendData.DesignParam')}}</div>
          <div><!-- 设计寿命 -->{{vm.$t('trendData.DesignLife')}}(km)</div>
          <div><input
              type="number"
              v-model="wheel_life"
            /></div>
          <div><!-- 车轮到限直径 -->{{vm.$t('trendData.WheelLimitDiameter')}}(mm)</div>
          <div><input
              type="number"
              v-model="diameter_end"
            /></div>
        </div>
        <div style="height:calc(100% - 47px);">
          <table class="tread-table scroll-style-edge">
            <thead ref="theadTr1">
              <tr>
                <th
                  rowspan="2"
                  ref="th-ch"
                  class="th-ch"
                >
                  <div style="height:128px;">
                    <!-- 车号 -->{{vm.$t('trendData.carNum')}} <i
                      @click="openSel"
                      class="iconfont icon-zhongzi-xiangxia"
                    ></i>
                  </div>
                </th>
                <th
                  ref="th-sj"
                  rowspan="1"
                  class="th-sj"
                >
                  <div style="height:43px"><!-- 时间 -->{{vm.$t('Common.time')}}</div>
                </th>

                <th
                  rowspan="1"
                  :colspan="maxLength*5"
                >
                  <div class="thead-div">
                    <div
                      v-for="item in maxLength"
                      :style="item === maxLength ? 'padding-right: 10px;':''"
                    >
                <th
                  colspan="5"
                  :style="item === maxLength ? 'padding-right: 10px;':''"
                >

                  <div :style="'width:'+(98*5-1)+'px;border:none'">
                    <!-- 选择日期时间 -->
                    <el-date-picker
                      v-model="timeList[item-1]"
                      type="date"
                      value-format="timestamp"
                      :placeholder="vm.$t('Common.placeholderTime')"
                    >
                    </el-date-picker>
                  </div>
                </th>
        </div>
      </div>
      </th>
      </tr>
      <tr>
        <th
          ref="th-cl"
          rowspan="1"
          class="th-cl"
        >
          <div style="height:82px"><!-- 测量参数 -->{{vm.$t('trendData.MeasurementParam')}}</div>
        </th>
        <th
          rowspan="1"
          :colspan="maxLength*5"
        >
          <div class="thead-div">
            <div
              class="thead-div-1"
              v-for="len in maxLength"
              :style="len === maxLength ? 'border:none;':''"
            >
        <th
          v-for="(item,headlen) in head"
          :key="item.value"
          rowspan="1"
          colspan="1"
          :style="len === maxLength && headlen === head.length-1 ? 'padding-right: 10px;border:none;':''"
        >{{item.name}}</th>
    </div>
  </div>
  </th>
  </tr>
  </thead>
  <tbody @scroll="scrollRequest($event)">
    <div
      class="tbody-div"
      v-for="(item,k) in marIdArray"
      v-if="carriageInfo[item]"
      v-show="carriageInfo[item] && carriageInfo[item].isShow"
    >
      <tr>
        <td
          :rowspan="carriageInfo[item].posLen"
          :title="carriageInfo[item].macName"
          valign="middle"
          :class="k%2 == 0?'oddColr1':'evenColor1'"
          ref="td-ch"
          class="td-ch"
        >
          <div>{{carriageInfo[item].macName}}</div>
        </td>

        <td
          :rowspan="carriageInfo[item].posLen"
          :colspan="maxLength > 0? (maxLength-1)*5 + 6 : 0"
        >
          <div v-for="(data,index) in carriageInfo[item].data">
            <tr v-for="(pos,index) in data.posArray">
              <td
                rowspan="1"
                colspan="1"
                ref="td-cl"
                class="td-cl"
                :title="pos.tms_wheel!==null && pos.tms_wheel!==''?pos.tms_wheel:pos.channel_name"
              >
                <div>{{pos.tms_wheel!==null && pos.tms_wheel!==''?pos.tms_wheel:pos.channel_name}}</div>
              </td>
              <td rowspan="1" colspan="5" v-for="item in maxLength">
                <div style="display:flex;flex-direction: row;">
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="pos.editdata_train.diameter[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="pos.editdata_train.thickness[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="pos.editdata_train.height[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  >
                    <select v-model="pos.editdata_train.type[item-1]">
                      <option value="X"><!-- 镟轮 -->{{vm.$t('trendData.spinRoller')}}</option>
                      <option value="H"><!-- 换轮 -->{{vm.$t('trendData.ChangeWheel')}}</option>
                      <option value="N"><!-- 未镟轮或换轮 -->{{vm.$t('trendData.unspinWheelOChangeWheel')}}</option>
                      <option value="SX"><!-- 首次镟轮 -->{{vm.$t('trendData.Firstwheel')}}</option>
                    </select>
                  </td>
                  <td
                    :rowspan="data.posArray.length"
                    colspan="1"
                    v-if="index === 0"
                  >
                    <div style="position: relative;width: 100%;height: 100%;">
                      <textarea
                        class="textarea"
                        :style="'height:'+data.posArray.length*40+'px;vertical-align: middle;'"
                        type="number"
                        v-model="data.mileage[item-1]"
                      />
                      </textarea>
                    </div>
                  </td>
                </div>
              </td>
              <!-- 获取到的已保存的踏面测量数据 -->
              <!-- <td
                    v-if="index === 0"
                    :rowspan="data.posArray.length"
                    colspan="5"
                    v-for="item in maxLength"
                  >
                    <tr>
                      <td
                        rowspan="1"
                        colspan="1"
                      >{{tableData[`${pos.machine_id}_${pos.position_id}_${pos.type}`].data_train[item-1].diameter}}</td>
                      <td
                        rowspan="1"
                        colspan="1"
                      >{{tableData[`${pos.machine_id}_${pos.position_id}_${pos.type}`].data_train[item-1].thickness}}</td>
                      <td
                        rowspan="1"
                        colspan="1"
                      >{{tableData[`${pos.machine_id}_${pos.position_id}_${pos.type}`].data_train[item-1].height}}</td>
                      <td
                        rowspan="1"
                        colspan="1"
                      >{{tableData[`${pos.machine_id}_${pos.position_id}_${pos.type}`].data_train[item-1].type}}</td>
                      <td
                        :rowspan="index === 0 ? data.posArray.length : 1"
                        colspan="1"
                      >{{tableData[`${pos.machine_id}_${pos.position_id}_${pos.type}`].data_train[item-1].mileage}}</td>
                    </tr>
                    <tr
                      v-if="tableData[`${pos.machine_id}_${pos.position_id}_${pos.type}`] && tableData[`${pos.machine_id}_${pos.position_id}_${pos.type}`].data_train"
                      v-for="item in (data.posArray.length-1)"
                    >
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                    </tr>
                    <tr
                      v-else
                      v-for="item in (data.posArray.length-1)"
                    >
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                      <td
                        rowspan="1"
                        colspan="1"
                      ></td>
                    </tr>
                  </td> -->
              <!-- 可输入踏面测量数据 -->
              <!-- <td
                v-if="index === 0"
                :rowspan="data.posArray.length"
                colspan="5"
                v-for="item in maxLength"
              >
                <tr>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="pos.editdata_train.diameter[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="pos.editdata_train.thickness[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="pos.editdata_train.height[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  >
                    <select v-model="pos.editdata_train.type[item-1]">
                      <option value="X">镟轮</option>
                      <option value="H">换轮</option>
                      <option value="N">未镟轮或换轮</option>
                      <option value="SX">首次镟轮</option>
                    </select>
                  </td>
                  <td
                    :rowspan="data.posArray.length"
                    colspan="1"
                  >
                    <div style="position: relative;width: 100%;height: 100%;">
                      <textarea
                        class="textarea"
                        :style="'height:'+data.posArray.length*40+'px;vertical-align: middle;'"
                        type="number"
                        v-model="data.mileage[item-1]"
                      />
                      </textarea>
                    </div>
                  </td>
                </tr>
                <tr v-for="number in data.posArray.length-1">
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="data.posArray[number].editdata_train.diameter[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="data.posArray[number].editdata_train.thickness[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><input
                      type="number"
                      v-model="data.posArray[number].editdata_train.height[item-1]"
                    /></td>
                  <td
                    rowspan="1"
                    colspan="1"
                  ><select v-model="data.posArray[number].editdata_train.type[item-1]">
                      <option value="X">镟轮</option>
                      <option value="H">换轮</option>
                      <option value="N">未镟轮或换轮</option>
                      <option value="SX">首次镟轮</option>
                    </select>
                  </td>
                </tr>
              </td> -->
            </tr>
          </div>
        </td>
      </tr>
    </div>
  </tbody>
  </table>
  </div>
  <!-- 多选弹窗 -->
  <div
    class="multiList-edge"
    v-show="checkList.isShow"
    @click.stop="getCheck"
  >
    <ul
      class="multiList scroll-style-edge"
      :style="checkList.style"
    >
      <li
        v-for="(item, index) in checkList.text"
        :key="index"
        :title="item.val"
      >
        <label :for="'childCheck' + index">
          <i
            class="my-icon"
            :class="setClass(item.isCheck)"
          ></i>
        </label>
        {{ item.val }}
        <input
          class="hide"
          type="checkbox"
          :id="'childCheck' + index"
          v-model="item.isCheck"
          @click="checkItem(item)"
        />
      </li>
    </ul>
  </div>

  </div>
  <div class="search-data">
    <button @click="addCol"><!-- 新增列 -->{{vm.$t('trendData.Addrow')}}</button>
    <button @click="setSaveData"><!-- 保存 -->{{vm.$t('trendData.Save')}}</button>
    <button @click="retrainModel"><!-- 重新训练模型 -->{{vm.$t('trendData.RetrainModel')}}
    <!-- 训练模型至少需要两组数据 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="vm.$t('trendData.trainModelLimit')"
        placement="top-start"
      >
        <i class="iconfont icon-tishiwenzi"></i>
      </el-tooltip>
    </button>

  </div>

  </div>

  </div>
</template>
<script>
import { getTime } from 'utils/utils.js'
export default {
  name: 'treadData',
  data() {
    const vm = window.vm;
    return {
      vm:vm,
      head: [
        { name: vm.$t('trendData.WheelDiameter')+'(mm)', value: 'diameter' },//车轮直径
        { name: vm.$t('trendData.RimThickness')+'(mm)', value: 'thickness' },//轮缘厚度
        { name: vm.$t('trendData.RimHeight')+'(mm)', value: 'height' },//轮缘高度
        { name: vm.$t('trendData.SpinWheelOrChangeWheel'), value: 'type' },//鏇轮或换轮
        { name: vm.$t('trendData.mileage')+'(km)', value: 'mileage' },
      ],
      wheel_life: null /* 设计寿命 */,
      diameter_end: null /* 到限直径 */,
      editData: {} /* 编辑数据 */,
      input: null,
      value1: null,
      value: 'X',
      timeData: {},
      carriageInfo: {},
      trendData: {},
      marIdArray: [],
      timeList: [] /* 时间数组 */,
      maxLength: 0,
      saveData: {},
      checkList: {},
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'treadData',
    })
  },
  watch: {
    '$store.state.treadDataMsg': {
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
      this.carriageInfo = {}
      switch (type) {
        case 0 /* 打开图表 */:
          this.getPosData()
          break
        case 1 /* 切换图表 */:
          this.getData()
          break
        case 2 /* 关闭图表 */:
          break
        case 4 /* 图表跳转图谱 */:
          this.getData()
          break
      }
    },
    // 获取测点数据
    getPosData() {
      this.$getApi.queryAllPosByType({ t_root: 2 }).then((res) => {
        if (res) {
          if (res.positions && res.positions.length > 0) {
            let marIdArray = [],
              carriageInfo = {}
            res.positions.forEach((pos) => {
              // 只需要包络阶次测点
              if (pos.position_type != 9) return
              if (marIdArray.indexOf(pos.machine_id) === -1) {
                marIdArray.push(pos.machine_id)
                this.$set(carriageInfo, pos.machine_id, {
                  mId: pos.machine_id,
                  macName: pos.mac_name,
                  data: {},
                  posLen: 0, //测点长度
                  isShow: true,
                })
              }
              let data = carriageInfo[pos.machine_id].data
              pos.editdata_train = {
                diameter: [null, null, null] /* 车轮直径 */,
                type: [null, null, null] /* 类型 */,
                thickness: [null, null, null] /* 轮缘厚度 */,
                height: [null, null, null] /* 轮缘高度 */,
              }
              if (!data[pos.ch_class]) {
                data[pos.ch_class] = {
                  posArray: [],
                  mileage: [null, null, null] /* 里程 */,
                }
                data[pos.ch_class].posArray.push(pos)
                carriageInfo[pos.machine_id].posLen++
              } else {
                data[pos.ch_class].posArray.push(pos)
                carriageInfo[pos.machine_id].posLen++
              }
            })
            this.trendData = carriageInfo
            this.marIdArray = marIdArray
            this.getData()
          }
        }
      })
    },
    // 获取踏面预测数据
    getData() {
      this.maxLength = 0
      this.$getApi.getALLTreadData().then((res) => {
        if (res) {
          if (res.data && Object.keys(res.data).length > 0) {
            this.setData(res.data)
          } else {
            this.maxLength = 3
            this.timeList = [null, null, null]
            this.carriageInfo = this.trendData
          }
        }
      })
    },
    // tbody滚动带动head滚动
    scrollRequest(e) {
      const tag = e.target
      /* 横向滚动，title 随着动 */
      let title = this.$refs.theadTr1
      title.scrollLeft = tag.scrollLeft
      if (tag.scrollLeft > 0) {
        this.$refs['th-ch'].style.position = 'relative'
        this.$refs['th-ch'].style.left = tag.scrollLeft + 'px'
        this.$refs['th-ch'].children[0].style.marginRight = '-2px'
        this.$refs['th-ch'].children[0].style.borderRight = '1px solid #979797'
        this.$refs['th-sj'].style.position = 'relative'
        this.$refs['th-sj'].style.left = tag.scrollLeft + 'px'
        this.$refs['th-sj'].children[0].style.marginRight = '-1px'
        this.$refs['th-sj'].children[0].style.borderRight = '1px solid #979797'
        this.$refs['th-cl'].style.position = 'relative'
        this.$refs['th-cl'].style.left = tag.scrollLeft + 'px'
        this.$refs['th-cl'].children[0].style.marginRight = '-1px'
        this.$refs['th-cl'].children[0].style.borderRight = '1px solid #979797'
        this.$refs['td-ch'].forEach((el) => {
          el.style.position = 'relative'
          el.style.left = tag.scrollLeft + 'px'
          // el.children[0].style.marginRight = '-1px'
          // el.children[0].style.borderRight = '1px solid #979797'
        })
        this.$refs['td-cl'].forEach((el) => {
          el.style.position = 'relative'
          el.style.left = tag.scrollLeft + 'px'
          // el.children[0].style.marginRight = '-1px'
          el.children[0].style.borderRight = '1px solid #979797'
          el.children[0].style.borderTop = '1px solid #979797'
          el.children[0].style.borderLeft = '1px solid #979797'
          el.children[0].style.margin = '-1px -1px 0px -1px'
        })
      } else {
        this.$refs['th-ch'].style = null
        this.$refs['th-sj'].style = null
        this.$refs['th-cl'].style = null
        this.$refs['th-cl'].children[0].style.borderRight = null
        this.$refs['th-sj'].children[0].style.borderRight = null
        this.$refs['td-ch'].forEach((el) => {
          el.style = null
          el.children[0].style = null
        })
        this.$refs['td-cl'].forEach((el) => {
          el.style = null
          el.children[0].style = null
        })
      }
    },
    setData(data) {
      this.timeList = [] //获取保存踏面数据的时间list
      this.timeData = {} //组成mid_pid_ptype{time:data}的数据方便取
      for (let k in data) {
        let timeData = {}
        let item = data[k]
        item = JSON.parse(item)
        this.wheel_life = item.wheel_life
        this.diameter_end = item.diameter_end
        /* 时间的排序 */
        let compare = function (obj1, obj2) {
          return obj1.time - obj2.time
        }
        item.data_train.sort(compare)
        console.log(item.data_train)
        item.data_train.forEach((list) => {
          if (this.timeList.indexOf(list.time) == -1) {
            this.timeList.push(list.time)
          }
          timeData[list.time] = list
        })
        this.$set(this.timeData, k, timeData)
      }
      // 防止数据长度不一致导致的排序错误
      let compare = function (obj1, obj2) {
        return obj1 - obj2
      }
      this.timeList.sort(compare)
      this.timeList.push(null, null, null)
      this.maxLength = this.timeList.length
      for (let i = 0, l = this.marIdArray.length; i < l; i++) {
        let mId = this.marIdArray[i]
        if (this.trendData[mId] && this.trendData[mId].data) {
          let data = this.trendData[mId].data
          for (let k in data) {
            const posArray = data[k].posArray
            let mileage = null
            // 插入数据前先将数据初始化
            data[k].mileage = [null, null, null]
            posArray.forEach((pos) => {
              pos.editdata_train.diameter = [null, null, null]
              pos.editdata_train.type = [null, null, null]
              pos.editdata_train.thickness = [null, null, null]
              pos.editdata_train.height = [null, null, null]
            })
            posArray.forEach((pos) => {
              let timeItem = {
                diameter: null,
                mileage: null,
                type: null,
                thickness: null,
                height: null,
              }
              if (
                this.timeData[
                  `${pos.machine_id}_${pos.position_id}_${pos.position_type}`
                ]
              ) {
                for (let j = this.timeList.length - 1; j >= 0; j--) {
                  if (this.timeList[j] != null) {
                    // 若存在该时间的数据则直接推入数据，若无则推入null
                    timeItem = this.timeData[
                      `${pos.machine_id}_${pos.position_id}_${pos.position_type}`
                    ][this.timeList[j]]
                      ? this.timeData[
                          `${pos.machine_id}_${pos.position_id}_${pos.position_type}`
                        ][this.timeList[j]]
                      : {
                          diameter: null,
                          mileage: null,
                          type: null,
                          thickness: null,
                          height: null,
                        }
                    if (timeItem.mileage != null) {
                      mileage = timeItem.mileage
                    }
                    pos.editdata_train.diameter.unshift(timeItem.diameter)
                    pos.editdata_train.type.unshift(timeItem.type)
                    pos.editdata_train.thickness.unshift(timeItem.thickness)
                    pos.editdata_train.height.unshift(timeItem.height)
                    if (
                      data[k].mileage.length <
                      pos.editdata_train.diameter.length
                    ) {
                      data[k].mileage.unshift(mileage)
                    }
                  }
                }
              }
            })
          }
        }
      }
      this.carriageInfo = this.trendData
    },
    setSaveData() {
      this.saveData = {}
      if (this.wheel_life != null && this.diameter_end != null) {
        this.saveData = this.reorganizeData()
        this.save(this.saveData)
      } else {
        this.$pop(vm.$t('trendData.InputLimit'))//请输入设计寿命或车轮到限直径！
      }
    },
    // 组织所有数据都填写的测点数据
    reorganizeData() {
      const treadData = {}
      for (let i = 0, l = this.marIdArray.length; i < l; i++) {
        let mId = this.marIdArray[i]
        if (this.carriageInfo[mId] && this.carriageInfo[mId].data) {
          let data = this.carriageInfo[mId].data
          for (let k in data) {
            const posArray = data[k].posArray
            posArray.forEach((pos) => {
              let changeData = {
                wheel_life: this.wheel_life,
                diameter_end: this.diameter_end,
                data_train: [],
              }
              for (
                let j = 0, l = pos.editdata_train.diameter.length;
                j < l;
                j++
              ) {
                if (
                  pos.editdata_train.diameter[j] != null &&
                  pos.editdata_train.height[j] != null &&
                  pos.editdata_train.thickness[j] != null &&
                  pos.editdata_train.type[j] != null &&
                  data[k].mileage[j] != null &&
                  this.timeList[j] != null
                ) {
                  let data_train = {
                    time: this.timeList[j],
                    diameter: pos.editdata_train.diameter[j],
                    mileage: data[k].mileage[j],
                    type: pos.editdata_train.type[j],
                    thickness: pos.editdata_train.thickness[j],
                    height: pos.editdata_train.height[j],
                  }
                  changeData.data_train.push(data_train)
                }
              }
              if (changeData.data_train.length > 0) {
                this.$set(
                  treadData,
                  `${pos.machine_id}_${pos.position_id}_${pos.position_type}`,
                  changeData
                )
              }
            })
          }
        }
      }
      return treadData
    },
    save() {
      this.$getApi.saveTreadData(this.saveData).then((res) => {
        if (res) {
          this.$pop(vm.$t('trendData.saveSuccess'))//保存成功！
          this.getData()
        }
      })
    },
    openSel(e) {
      const size = e.currentTarget.getBoundingClientRect()
      const style = {
        maxHeight: '300px',
        width: `190px`,
        left: `${size.left}px`,
        top: `${size.top + size.height + 3}px`,
      }
      let text = []
      let isCheck = true
      for (let i = 0, l = this.marIdArray.length; i < l; i++) {
        let mId = this.marIdArray[i]
        if (this.carriageInfo[mId] && this.carriageInfo[mId].data) {
          text.push({
            val: this.carriageInfo[mId].macName,
            id: this.carriageInfo[mId].mId,
            isCheck: this.carriageInfo[mId].isShow,
          })
          if (!this.carriageInfo[mId].isShow) {
            isCheck = false
          }
        }
      }

      text.unshift({ val: vm.$t('Common.allText'), id: -1, isCheck: isCheck })//全部
      this.checkList = {
        isShow: true,
        text,
        style,
      }
    },
    // 设置是否勾选
    setClass(bool) {
      const iName = 'iconfont'
      const check = ['icon-zhongzi_xuanzekuang', 'icon-zhongzi_xuanzekuang1']
      return `${iName} ${check[Number(bool)]}`
    },
    // 关闭筛选下拉列表
    getCheck(e) {
      if (e.target.className === 'multiList-edge') {
        let list = this.checkList
        // 下拉框不显示
        list.isShow = false
        let text = list.text
        text.forEach((item) => {
          if (item.id != -1) {
            this.carriageInfo[item.id].isShow = item.isCheck
          }
        })
      }
    },
    // 子级单选
    checkItem(item) {
      item.isCheck = !item.isCheck
      //选中全部时
      if (item.id === -1 && item.isCheck === true) {
        this.checkList.text.forEach((a) => {
          a.isCheck = true
        })
      } else if (item.id === -1 && item.isCheck === false) {
        //取消全选
        this.checkList.text.forEach((a) => {
          a.isCheck = false
        })
      } else if (item.id !== -1 && item.isCheck === false) {
        this.checkList.text.forEach((a) => {
          if (a.id === -1) {
            a.isCheck = false
          }
        })
      }
    },
    // 新增列
    addCol() {
      this.timeList.push(null)
      this.maxLength = this.timeList.length
      for (let i = 0, l = this.marIdArray.length; i < l; i++) {
        let mId = this.marIdArray[i]
        if (this.carriageInfo[mId] && this.carriageInfo[mId].data) {
          let data = this.carriageInfo[mId].data
          for (let k in data) {
            const posArray = data[k].posArray
            posArray.forEach((pos) => {
              pos.editdata_train.diameter.push(null)
              pos.editdata_train.type.push(null)
              pos.editdata_train.thickness.push(null)
              pos.editdata_train.height.push(null)
            })
            data[k].mileage.push(null)
          }
        }
      }
    },
    // 重新训练模型
    retrainModel() {
      let data = this.reorganizeData()
      this.$emit('loadingImg', true)
      this.$getApi.predictTreadData(data).then((res) => {
        this.$emit('loadingImg', false)
        if (res) {
          this.$pop(vm.$t('trendData.trainModelSuccess'))//训练模型成功！
        }
      })
    },
  },
}
</script>
<style lang="scss">
.treadData-content {
  .el-input,
  .el-input__inner {
    width: 98% !important;
    border: none !important;
    background-color: #092e55 !important;
  }
}
</style>
<style scoped lang="scss">
.treadData-content {
  height: 100%;
  width: 100%;
  .treadData-table {
    height: calc(100% - 80px);
    width: 100%;
    .tread-param {
      height: 47px;
      display: flex;
      flex-direction: row;
      line-height: 47px;
      div {
        border-top: 1px solid #979797;
        border-right: 1px solid #979797;
        &:nth-child(1) {
          width: 100px;
          text-align: center;
          border-left: 1px solid #979797;
        }
        &:nth-child(2) {
          width: calc(20% - 100px);
          text-align: center;
        }
        &:nth-child(3) {
          width: 30%;
          text-align: center;
        }
        &:nth-child(4) {
          width: 20%;
          text-align: center;
        }
        &:nth-child(5) {
          width: 30%;
          text-align: center;
        }
      }
    }
    .tread-table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      overflow-x: auto;
      table-layout: fixed;
      position: relative;
      thead {
        overflow-x: auto;
        border: 1px solid #979797;
        border-bottom: none;
        .th-ch,
        .th-cl,
        .th-sj {
          z-index: 9;
          background-color: #092e55;
          border-right: 1px solid #979797;
        }
        tr {
          position: relative;
          left: 0px;
          border-bottom: 1px solid #979797;
          th {
            min-width: 98px;
            width: 98px;
            min-height: 40px;
            line-height: 40px;
            text-align: center;
            border-right: 1px solid #979797;
          }
          .thead-div {
            display: flex;
            flex-direction: row;
            .thead-div-1 {
              border-right: 1px solid #979797;
              th {
                &:first-child {
                  border-left: none;
                }
              }
            }
          }
        }
      }
      tbody {
        height: calc(100% - 122px);
        overflow-y: auto;
        border: 1px solid #979797;
        background: #092e55;
        position: relative;
        overflow-y: scroll;

        top: -8px;
        .td-ch,
        .td-cl {
          z-index: 9;
          background-color: #092e55;
          border-right: 1px solid #979797;
          div {
            width: 98px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        .tbody-div {
          width: 100%;
          border-left: none;
          tr {
            td {
              &:first-child {
                border-left: none;
              }
            }
          }
        }
      }
      tr {
        display: table-row !important;
        width: 100%;
        table-layout: fixed;

        // &:last-child {
        //   border-bottom: 1px solid #979797;
        // }
        td {
          min-width: 98px;
          width: 98px;
          min-height: 40px;
          line-height: 40px;
          text-align: center;
          border-right: 1px solid #979797;
          border-bottom: 1px solid #979797;

          &:last-child {
            // border-right: 1px solid #979797;
          }
          // tr {
          //   &:first-child {
          //     border-top: none;
          //   }
          //   td {
          //     &:first-child {
          //       border-left: none;
          //     }
          //   }
          // }
        }
      }

      select {
        width: 100%;
        height: 39px;
        border: none;
        background-color: #092e55;
        color: #fff;
      }
    }
    .oddColr1 {
      background: #0e3e70;
    }
    .evenColor1 {
      background: #092e55;
    }
    input {
      width: 100%;
      height: 39px;
      border: none;
      background-color: #092e55 !important;
      text-align: center;
    }
    .textarea {
      width: 100%;
      position: absolute;
      display: block;
      text-align: center;
      border: none;
      background-color: #092e55 !important;
    }
  }
  .multiList-edge {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    ::-webkit-scrollbar {
      // display: none;
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgb(239, 239, 239);
    }
    //滚动条的轨道（里面装有Thumb）
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #0a53a0;
    }
    //滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
    ::-webkit-scrollbar-thumb:hover {
      background: #103760;
    }
    .multiList {
      position: absolute;
      overflow-y: auto;
      user-select: none;
      border-radius: 5px;
      z-index: 999;
      font-size: 14px;
      color: #ffffff;
      background: #0a53a0;
      border: 1px solid #0092fe;
      .multi-span:hover {
        background: #204973ff;
      }
      li {
        height: 26px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .search-data {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      height: 30px;
      width: 100px;
      margin: 0px 10px;
      &:nth-child(3) {
        width: 120px;
        .iconfont {
          font-size: 12px;
        }
      }
    }
  }
}
</style>