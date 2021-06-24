<template>
  <div>
    <div
      class="general-model"
      v-for="(param,key) in fdModel"
      v-show="param.isShow"
    >
      <div class="windBtnBlock">
        <button
          @click="changeToLink()"
           class="btn"
        >{{$t('FdModel.btn3dText')}}</button>
      </div>
      <div class="general-model-content">
        <div class="model-content">
          <div class="model-fengdian">
            <div
              class="model-drivechain"
              v-show="param.modelTitleName.indexOf('传动链') !== -1"
            >
              <div
                v-if="param.modelItems.driveChain"
                class="model-item"
                @dblclick="toModelIitem(0)"
              >
                <div class="modelitem-title">
                  <div class="modelitem-title-f">{{$t('FdModel.locName1')}}</div>
                  <div class="modelitem-title-f">
                    {{ param.modelItems.driveChain.status }}
                  </div>
                </div>
                <div class="modelitem-separate"></div>
                <!-- 百分比圆环 -->
                <div :class="[
                  param.modelItems.driveChain.alarm_status === 2
                    ? 'modelitem-content-warn'
                    : '',
                  param.modelItems.driveChain.alarm_status === 3
                    ? 'modelitem-content-alarm'
                    : '',
                  param.modelItems.driveChain.alarm_status === 1 ||
                  param.modelItems.driveChain.alarm_status === 0 ||
                  param.modelItems.driveChain.alarm_status === null
                    ? 'modelitem-content'
                    : ''
                ]">
                  <div class="circle">
                    <div class="percent-circle percent-circle-left">
                      <div
                        class="left-content"
                        :ref="'left_content1'+key"
                      ></div>
                    </div>
                    <div class="percent-circle percent-circle-right">
                      <div
                        class="right-content"
                        :ref="'right_content1'+key"
                      ></div>
                    </div>
                    <div class="c-c-inside">
                      {{ param.modelItems.driveChain.health }}
                      <div
                        v-show="param.modelItems.driveChain.health === null"
                        class="inside-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="model-towerdrum"
              v-show="param.modelTitleName.indexOf('塔筒') !== -1"
            >
              <div
                v-if="param.modelItems.tower"
                class="model-item"
                @dblclick="toModelIitem(1)"
              >
                <div class="modelitem-title">
                  <div class="modelitem-title-f">{{$t('FdModel.locName2')}}</div>
                  <div class="modelitem-title-f">
                    {{ param.modelItems.tower.status }}
                  </div>
                </div>
                <div class="modelitem-separate"></div>
                <div :class="[
                  param.modelItems.tower.alarm_status === 2
                    ? 'modelitem-content-warn'
                    : '',
                  param.modelItems.tower.alarm_status === 3
                    ? 'modelitem-content-alarm'
                    : '',
                  param.modelItems.tower.alarm_status === 1 ||
                  param.modelItems.tower.alarm_status === 0 ||
                  param.modelItems.tower.alarm_status === null
                    ? 'modelitem-content'
                    : ''
                ]">
                  <div class="circle">
                    <div class="percent-circle percent-circle-left">
                      <div
                        class="left-content"
                        :ref="'left_content2'+key"
                      ></div>
                    </div>
                    <div class="percent-circle percent-circle-right">
                      <div
                        class="right-content"
                        :ref="'right_content2'+key"
                      ></div>
                    </div>
                    <div class="c-c-inside">
                      {{ param.modelItems.tower.health }}
                      <div
                        v-show="param.modelItems.tower.health === null"
                        class="inside-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="model-bolt"
              v-show="param.modelTitleName.indexOf('螺栓') !== -1"
            >
              <div
                v-if="param.modelItems.bolt"
                class="model-item"
                @dblclick="toModelIitem(2)"
              >
                <div class="modelitem-title">
                  <div class="modelitem-title-f">{{$t('FdModel.locName3')}}</div>
                  <div class="modelitem-title-f">
                    {{ param.modelItems.bolt.status }}
                  </div>
                </div>
                <div class="modelitem-separate"></div>
                <div :class="[
                  param.modelItems.bolt.alarm_status === 2
                    ? 'modelitem-content-warn'
                    : '',
                  param.modelItems.bolt.alarm_status === 3
                    ? 'modelitem-content-alarm'
                    : '',
                  param.modelItems.bolt.alarm_status === 1 ||
                  param.modelItems.bolt.alarm_status === 0 ||
                  param.modelItems.bolt.alarm_status === null
                    ? 'modelitem-content'
                    : ''
                ]">
                  <div class="circle">
                    <div class="percent-circle percent-circle-left">
                      <div
                        class="left-content"
                        :ref="'left_content3'+key"
                      ></div>
                    </div>
                    <div class="percent-circle percent-circle-right">
                      <div
                        class="right-content"
                        :ref="'right_content3'+key"
                      ></div>
                    </div>
                    <div class="c-c-inside">
                      {{ param.modelItems.bolt.health }}
                      <div
                        v-show="param.modelItems.bolt.health=== null"
                        class="inside-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="model-impeller"
              v-show="param.modelTitleName.indexOf('叶轮') !== -1"
            >
              <div
                v-if="param.modelItems.impeller"
                class="model-item"
                @dblclick="toModelIitem(3)"
              >
                <div class="modelitem-title">
                  <div class="modelitem-title-f">{{$t('FdModel.locName4')}}</div>
                  <div class="modelitem-title-f">
                    {{ param.modelItems.impeller.status }}
                  </div>
                </div>
                <div class="modelitem-separate"></div>
                <div :class="[
                  param.modelItems.impeller.alarm_status === 2
                    ? 'modelitem-content-warn'
                    : '',
                  param.modelItems.impeller.alarm_status === 3
                    ? 'modelitem-content-alarm'
                    : '',
                  param.modelItems.impeller.alarm_status === 1 ||
                  param.modelItems.impeller.alarm_status === 0 ||
                  param.modelItems.impeller.alarm_status === null
                    ? 'modelitem-content'
                    : ''
                ]">
                  <div class="circle">
                    <div class="percent-circle percent-circle-left">
                      <div
                        class="left-content"
                        :ref="'left_content4'+key"
                      ></div>
                    </div>
                    <div class="percent-circle percent-circle-right">
                      <div
                        class="right-content"
                        :ref="'right_content4'+key"
                      ></div>
                    </div>
                    <div class="c-c-inside">
                      {{ param.modelItems.impeller.health }}
                      <div
                        v-show="param.modelItems.impeller.health=== null"
                        class="inside-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="model-oil"
              v-show="param.modelTitleName.indexOf('油液') !== -1"
            >
              <div
                v-if="param.modelItems.oil"
                class="model-item"
                @dblclick="toModelIitem(4)"
              >
                <div class="modelitem-title">
                  <div class="modelitem-title-f">{{$t('FdModel.locName5')}}</div>
                  <div class="modelitem-title-f">{{ param.modelItems.oil.status }}</div>
                </div>
                <div class="modelitem-separate"></div>
                <div :class="[
                  param.modelItems.oil.alarm_status === 2
                    ? 'modelitem-content-warn'
                    : '',
                  param.modelItems.oil.alarm_status === 3
                    ? 'modelitem-content-alarm'
                    : '',
                  param.modelItems.oil.alarm_status === 1 ||
                  param.modelItems.oil.alarm_status === 0 ||
                  param.modelItems.oil.alarm_status === null
                    ? 'modelitem-content'
                    : ''
                ]">
                  <div class="circle">
                    <div class="percent-circle percent-circle-left">
                      <div
                        class="left-content"
                        :ref="'left_content5'+key"
                      ></div>
                    </div>
                    <div class="percent-circle percent-circle-right">
                      <div
                        class="right-content"
                        :ref="'right_content5'+key"
                      ></div>
                    </div>
                    <div class="c-c-inside">
                      {{ param.modelItems.oil.health }}
                      <div
                        v-show="param.modelItems.oil.health=== null"
                        class="inside-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="model-anchorbolt"
              v-show="param.modelTitleName.indexOf('锚栓') !== -1"
            >
              <div
                v-if="param.modelItems.anchor"
                class="model-item"
                @dblclick="toModelIitem(5)"
              >
                <div class="modelitem-title">
                  <div class="modelitem-title-f">{{$t('FdModel.locName6')}}</div>
                  <div class="modelitem-title-f">
                    {{ param.modelItems.anchor.status }}
                  </div>
                </div>
                <div class="modelitem-separate"></div>
                <div :class="[
                  param.modelItems.anchor.alarm_status === 2
                    ? 'modelitem-content-warn'
                    : '',
                  param.modelItems.anchor.alarm_status === 3
                    ? 'modelitem-content-alarm'
                    : '',
                  param.modelItems.anchor.alarm_status === 1 ||
                  param.modelItems.anchor.alarm_status === 0 ||
                  param.modelItems.anchor.alarm_status === null
                    ? 'modelitem-content'
                    : ''
                ]">
                  <div class="circle">
                    <div class="percent-circle percent-circle-left">
                      <div
                        class="left-content"
                        :ref="'left_content6'+key"
                      ></div>
                    </div>
                    <div class="percent-circle percent-circle-right">
                      <div
                        class="right-content"
                        :ref="'right_content6'+key"
                      ></div>
                    </div>
                    <div class="c-c-inside">
                      {{ param.modelItems.anchor.health }}
                      <div
                        v-show="param.modelItems.anchor.health === null"
                        class="inside-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="model-base"
              v-show="param.modelTitleName.indexOf('基础') !== -1"
            >
              <div
                v-if="param.modelItems.basics"
                class="model-item"
                @dblclick="toModelIitem(6)"
              >
                <div class="modelitem-title">
                  <div class="modelitem-title-f">{{$t('FdModel.locName7')}}</div>
                  <div class="modelitem-title-f">
                    {{ param.modelItems.basics.status }}
                  </div>
                </div>
                <div class="modelitem-separate"></div>
                <!-- :class="[
                  modelItems.basics.alarm_status === 2
                    ? 'modelitem-content-warn'
                    : '',
                  modelItems.basics.alarm_status === 3
                    ? 'modelitem-content-alarm'
                    : '',
                  modelItems.basics.alarm_status === 1 ||
                  modelItems.basics.alarm_status === 0 ||
                  modelItems.basics.alarm_status === null
                    ? 'modelitem-content'
                    : ''
                ]" -->
                <div class="modelitem-content-warn">
                  <div class="circle">
                    <div class="percent-circle percent-circle-left">
                      <div
                        class="left-content"
                        :ref="'left_content7'+key"
                      ></div>
                    </div>
                    <div class="percent-circle percent-circle-right">
                      <div
                        class="right-content"
                        :ref="'right_content7'+key"
                      ></div>
                    </div>
                    <div class="c-c-inside">
                      {{ param.modelItems.basics.health }}
                      <div
                        v-show="param.modelItems.basics.health === null"
                        class="inside-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="general-equip-diagnosis"
        v-if="param.diagnosis.driveChain && param.diagnosis.driveChain.diagnosis && param.diagnosis.driveChain.diagnosis.length > 0"
      >
        <div class="diagnosis-f1">{{$t('FdModel.diagnosisText')}}</div>
        <div class="diagnosis-content">
          <div @dblclick="toAlarmTrend">
            <i class="iconfont icon-chuandonglian"></i>
            <div>{{$t('FdModel.diagnosisTitle')}}</div>
          </div>
          <ul>
            <li
              v-for="item in param.diagnosis.driveChain.diagnosis"
              :class="[
                  param.diagnosis.driveChain.status === 2
                    ? 'warn-li'
                    : '',
                  param.diagnosis.driveChain.status === 3
                    ? 'alarm-li'
                    : '',
                  param.diagnosis.driveChain.status === 1 ||
                  param.diagnosis.driveChain.status === 0 ||
                  param.diagnosis.driveChain.status === null
                    ? ''
                    : ''
                ]"
            >{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneObj } from 'utils/utils.js'
export default {
  name: 'fdModel',
  data() {
    return {
      fdModel: {},
      currentKey: '',
    }
  },
  deactivated() {
    clearInterval(this.fdModel[this.currentKey].timer)
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdModel',
    })
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.fdModel) {
        this.fdModel[i].isShow = false
        clearInterval(this.fdModel[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.fdModel)
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
        mac = this.fdModel[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.fdModel, key, {
            mac,
            modelItems: [],
            modelTitle: [],
            modelTitleName: [],
            timer: '', //定时器
            diagnosis: {} /* 设备诊断 */,
            isloaded: false,
            isRequestDown: true,
            isShow: true,
          })
          this.getmodelTitle()
          break
        case 1 /* 切换图表 */:
          this.fdModel[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.fdModel, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.fdModel[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let fn = () => {
          this.getModelItem(mac)
          return fn
        }
        this.fdModel[key].timer = setInterval(fn(), 6000)
      }
    },
    //跳转至3D界面
    changeToLink() {
      const mac = this.fdModel[this.currentKey].mac
      // this.$router.push('fdModel')
      let macArray = this.$store.state.mac[mac.t_id]
      let choosemac = this.$store.state.checkMsg.mac
      let choosetree = cloneObj(this.$store.state.checkMsg.tree)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.machine_id == mac.mac_id) {
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
            if (macArray[i].mac_id == mac.mac_id) {
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
          router: 'windModel',
        })
        // 设备模型跳转设备模型使用同一个key值调用getPath方法
        let params = {
          key: this.currentKey,
          val: this.$t('HeaderEdge.secondLevel1_3'), //'设备模型',
          name: 'windModel',
          icon: 'icon-shijingsanwei-',
        }
        this.$bus.$emit('getPath', params)
      })
    },
    //跳转modelitem（传动链、塔筒等）
    toModelIitem(index) {
      let data
      switch (index) {
        case 0:
          data = {
            name: this.$t('FdModel.locName1'), //'传动链',
            router: 'fddrivechain',
            index: 0,
          }
          break
        case 1:
          data = {
            name: this.$t('FdModel.locName2'), //'塔筒',
            router: 'fdtowerdrum',
            index: 1,
          }
          break
        case 2:
          data = {
            name: this.$t('FdModel.locName3'), //'螺栓',
            router: 'fdbolt',
            index: 2,
          }
          break
        case 3:
          data = {
            name: this.$t('FdModel.locName4'), //'叶轮',
            router: 'fdimpeller',
            index: 3,
          }
          break
        case 4:
          data = {
            name: this.$t('FdModel.locName5'), //'油液',
            router: 'fdoil',
            index: 4,
          }
          break
        case 5:
          data = {
            name: this.$t('FdModel.locName6'), //'锚栓',
            router: 'fdanchorbolt',
            index: 5,
          }
          break
        case 6:
          data = {
            name: this.$t('FdModel.locName7'), //'基础',
            router: 'fdbasics',
            index: 6,
          }
          break
      }
      const param = this.fdModel[this.currentKey]
      const store = this.$store
      //修改风电模型小标题选中状态
      param.modelTitle.forEach((element) => {
        if (element.name === data.name) {
          element.isChoose = true
        } else {
          element.isChoose = false
        }
      })
      const mac = param.mac
      // this.$router.push('fdModel')
      let macArray = store.state.mac[mac.t_id]
      let choosemac = store.state.checkMsg.mac
      let choosetree = cloneObj(store.state.checkMsg.tree)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.machine_id == mac.mac_id) {
          if (choosemac.t_id != choosetree.t_id) {
            let treeArray = store.state.tree
            treeArray.forEach((tree) => {
              if (choosemac.t_id == tree.t_id) {
                store.commit('getCheckMsg', {
                  msg: cloneObj(tree),
                  type: 'tree',
                })
                store.commit('getCheckMsg', {
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
            if (macArray[i].mac_id == mac.mac_id) {
              /* 设置当前的机组 */
              if (macArray[i].t_id != choosetree.t_id) {
                let treeArray = store.state.tree
                treeArray.forEach((tree) => {
                  if (macArray[i].t_id == tree.t_id) {
                    store.commit('getCheckMsg', {
                      msg: cloneObj(tree),
                      type: 'tree',
                    })
                  }
                })
              }
              store.commit('getCheckMsg', {
                msg: macArray[i],
                type: 'mac',
              })
              resolve('成功')
              break
            }
          }
        }
      }).then(() => {
        store.commit('setGeneralModel', {
          key: this.currentKey,
          router: data.router,
        })
        // 设备模型跳转设备模型使用同一个key值调用getPath方法
        let params = {
          key: this.currentKey,
          val: this.$t('HeaderEdge.secondLevel1_3'), //'设备模型',
          name: 'fdModelitem',
          icon: 'icon-shijingsanwei-',
        }
        this.$bus.$emit('getPath', params)
        store.commit('setWindmodelTitle', {
          key: `${param.mac.mac_id}_${param.mac.ch_class}`,
          data: param.modelTitle,
        })
      })
    },
    getModelItem(mac) {
      const param = this.fdModel[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
      }
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name == 'fdModel'
      ) {
        if (param.isRequestDown) {
          param.isRequestDown = false
          this.$getApi.queryMachineModelByMacId(requestData).then((res) => {
            param.isRequestDown = true
            if (res) {
              param.modelItems = res
              let angle
              let modelTitle = []
              for (let k in param.modelItems) {
                if (k !== 'msg' && k !== 'mac_id') {
                  let status = config.generalStutas
                  if (status && param.modelItems[k].alarm_status == 0) {
                    param.modelItems[k].alarm_status = 1
                  }
                  if (
                    param.modelItems[k].alarm_status == 0 ||
                    param.modelItems[k].alarm_status == null
                  ) {
                    param.modelItems[k].status = this.$t('Common.offlineText') //'离线'
                  } else if (param.modelItems[k].alarm_status == 1) {
                    param.modelItems[k].status = this.$t('Common.normalText') //'正常'
                  } else if (param.modelItems[k].alarm_status == 2) {
                    param.modelItems[k].status = this.$t('Common.warnText') //'预警'
                  } else if (param.modelItems[k].alarm_status == 3) {
                    param.modelItems[k].status = this.$t('Common.alarmText') //'报警'
                  }
                }
              }
              param.diagnosis.driveChain = {}
              let diagnosis = []
              if (config.fdDiagnosis == 0) {
                // 目前只取传动链的诊断
                let driveChainDia = param.modelItems.driveChain.diagnosis
                let diagnosis_str
                if (driveChainDia != null) {
                  diagnosis_str = driveChainDia.toString(2)
                  if (diagnosis_str.length > 0) {
                    if (Number(diagnosis_str[0]) > 0) {
                      diagnosis.push(this.$t('FdModel.bearingDefect')) //'轴承缺陷'
                    }
                  }
                  if (diagnosis_str.length > 1) {
                    if (Number(diagnosis_str[1]) > 0) {
                      diagnosis.push(this.$t('FdModel.gearDefect')) //'齿轮缺陷')
                    }
                  }
                  if (diagnosis_str.length > 2) {
                    if (Number(diagnosis_str[2]) > 0) {
                      diagnosis.push(this.$t('FdModel.motorDefect')) //'电机不平衡或松动')
                    }
                  }
                  if (diagnosis_str.length > 3) {
                    if (Number(diagnosis_str[3]) > 0) {
                      diagnosis.push(this.$t('FdModel.gearBoxDefect')) //'齿轮箱载荷过重')
                    }
                  }
                  param.diagnosis.driveChain = {
                    status: param.modelItems.driveChain.alarm_status,
                    diagnosis: diagnosis,
                  }
                } else {
                  param.diagnosis.driveChain = {}
                }
              } else if (config.fdDiagnosis == 1) {
                //东汽智能诊断
                if (param.modelItems.driveChain.fault_type) {
                  let driveChainDia = param.modelItems.driveChain.fault_type
                  driveChainDia.forEach((el) => {
                    if (el.fault_type) {
                      el.fault_type = el.fault_type.replace(/\s+/g, '') //去除所有空格
                      let fault = [
                        {
                          '[5]': this.$t('diagnosisTrend.fault01'), //'主轴前轴承外圈故障',
                          '[6]': this.$t('diagnosisTrend.fault02'), //'主轴前轴承内圈故障',
                          '[7]': this.$t('diagnosisTrend.fault03'), //'主轴前轴承滚动体故障',
                          '[8]': this.$t('diagnosisTrend.fault04'), //'主轴前轴承保持架故障',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault05'), //'主轴前轴承跑圈',
                          '[0,9]': this.$t('diagnosisTrend.fault06'), //'主轴前轴承松动',
                          '[10]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                          '[0]': this.$t('diagnosisTrend.fault08'), //'气动不平衡',
                        },
                        {
                          '[5]': this.$t('diagnosisTrend.fault11'), //'主轴后轴承外圈故障',
                          '[6]': this.$t('diagnosisTrend.fault12'), //'主轴后轴承内圈故障',
                          '[7]': this.$t('diagnosisTrend.fault13'), //'主轴后轴承滚动体故障',
                          '[8]': this.$t('diagnosisTrend.fault14'), //'主轴后轴承保持架故障',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault15'), //'主轴后轴承跑圈',
                          '[0,9]': this.$t('diagnosisTrend.fault16'), //'主轴后轴承松动',
                          '[10]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                          '[0]': this.$t('diagnosisTrend.fault08'), //'气动不平衡',
                        },
                        {
                          '[5]': this.$t('diagnosisTrend.fault21'), //'行星架叶轮侧轴承外圈故障',
                          '[6]': this.$t('diagnosisTrend.fault22'), //'行星架叶轮侧轴承内圈故障',
                          '[7]': this.$t('diagnosisTrend.fault23'), //'行星架叶轮侧轴承滚动体故障',
                          '[8]': this.$t('diagnosisTrend.fault24'), //'行星架叶轮侧轴承保持架故障',
                          '[9]': this.$t('diagnosisTrend.fault25'), //'行星架电机侧轴承内圈故障',
                          '[10]': this.$t('diagnosisTrend.fault26'), //'行星架电机侧轴承滚动体故障',
                          '[11]': this.$t('diagnosisTrend.fault27'), //'行星架电机侧轴承滚动体故障',
                          '[12]': this.$t('diagnosisTrend.fault28'), //'行星架电机侧轴承保持架故障',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault29'), //'齿轮箱输入轴轴承跑圈',
                          '[0,13]': this.$t('diagnosisTrend.fault210'), //'齿轮箱输入轴轴承松动',
                          '[14]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                        },
                        {
                          '[10]': this.$t('diagnosisTrend.fault31'), //'低速轴叶轮侧轴承外圈故障',
                          '[11]': this.$t('diagnosisTrend.fault32'), //'低速轴叶轮侧轴承内圈故障',
                          '[12]': this.$t('diagnosisTrend.fault33'), //'低速轴叶轮侧轴承滚动体故障',
                          '[13]': this.$t('diagnosisTrend.fault34'), //'低速轴叶轮侧轴承保持架故障',
                          '[14]': this.$t('diagnosisTrend.fault35'), //'低速轴电机侧轴承外圈故障',
                          '[15]': this.$t('diagnosisTrend.fault36'), //'低速轴电机侧轴承内圈故障',
                          '[16]': this.$t('diagnosisTrend.fault37'), //'低速轴电机侧轴承滚动体故障',
                          '[17]': this.$t('diagnosisTrend.fault38'), //'低速轴电机侧轴承保持架故障',
                          '[18]': this.$t('diagnosisTrend.fault39'), //'滑环轴承外圈故障',
                          '[19]': this.$t('diagnosisTrend.fault310'), //'滑环轴承内圈故障',
                          '[20]': this.$t('diagnosisTrend.fault311'), //'滑环轴承滚动体故障',
                          '[21]': this.$t('diagnosisTrend.fault312'), //'滑环轴承保持架故障',
                          '[5,24]': this.$t('diagnosisTrend.fault313'), //'太阳轮故障',
                          '[7,26]': this.$t('diagnosisTrend.fault314'), //'行星轮故障',
                          '[6,25]': this.$t('diagnosisTrend.fault315'), //'内齿圈故障',
                          '[8,9]': this.$t('diagnosisTrend.fault316'), //'行星级齿轮啮合不良',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault317'), //'齿轮箱低速轴轴承跑圈',
                          '[0,22]': this.$t('diagnosisTrend.fault318'), //'齿轮箱低速轴轴承松动',
                          '[27]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                        },
                        {
                          '[7]': this.$t('diagnosisTrend.fault41'), //'中间轴叶轮侧轴承外圈故障',
                          '[8]': this.$t('diagnosisTrend.fault42'), //'中间轴叶轮侧轴承内圈故障',
                          '[9]': this.$t('diagnosisTrend.fault43'), //'中间轴叶轮侧轴承滚动体故障',
                          '[10]': this.$t('diagnosisTrend.fault44'), //'中间轴叶轮侧轴承保持架故障',
                          '[11]': this.$t('diagnosisTrend.fault45'), //'中间轴电机侧轴承1外圈故障',
                          '[12]': this.$t('diagnosisTrend.fault46'), //'中间轴电机侧轴承1内圈故障',
                          '[13]': this.$t('diagnosisTrend.fault47'), //'中间轴电机侧轴承1滚动体故障',
                          '[14]': this.$t('diagnosisTrend.fault48'), //'中间轴电机侧轴承1保持架故障',
                          '[15]': this.$t('diagnosisTrend.fault49'), //'中间轴电机侧轴承2外圈故障',
                          '[16]': this.$t('diagnosisTrend.fault410'), //'中间轴电机侧轴承2内圈故障',
                          '[17]': this.$t('diagnosisTrend.fault411'), //'中间轴电机侧轴承2滚动体故障',
                          '[18]': this.$t('diagnosisTrend.fault412'), //'中间轴电机侧轴承2保持架故障',
                          '[19]': this.$t('diagnosisTrend.fault413'), //'中间轴小齿轮啮合不良或大齿轮断齿',
                          '[5,6]': this.$t('diagnosisTrend.fault414'), //'中间级齿轮不对中（偏载）',
                          '[20]': this.$t('diagnosisTrend.fault415'), //'小齿轮断齿',
                          '[8,9]': this.$t('diagnosisTrend.fault316'), //'行星级齿轮啮合不良',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault416'), //'齿轮箱中间轴轴承跑圈',
                          '[0]': this.$t('diagnosisTrend.fault417'), //'齿轮箱中间轴轴承松动',
                          '[21]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                        },
                        {
                          '[9]': this.$t('diagnosisTrend.fault51'), //'高速轴叶轮侧轴承外圈故障',
                          '[10]': this.$t('diagnosisTrend.fault52'), //'高速轴叶轮侧轴承内圈故障',
                          '[11]': this.$t('diagnosisTrend.fault53'), //'高速轴叶轮侧轴承滚动体故障',
                          '[12]': this.$t('diagnosisTrend.fault54'), //'高速轴叶轮侧轴承保持架故障',
                          '[13]': this.$t('diagnosisTrend.fault55'), //'高速轴电机侧轴承外圈故障',
                          '[14]': this.$t('diagnosisTrend.fault56'), //'高速轴电机侧轴承内圈故障',
                          '[15]': this.$t('diagnosisTrend.fault57'), //'高速轴电机侧轴承滚动体故障',
                          '[16]': this.$t('diagnosisTrend.fault58'), //'高速轴电机侧轴承保持架故障',
                          '[17,18]': this.$t('diagnosisTrend.fault59'), //'高速级大小齿轮啮合不良',
                          '[17]': this.$t('diagnosisTrend.fault510'), //'中间级小齿轮啮合不良',
                          '[5,6]': this.$t('diagnosisTrend.fault511'), //'高速级齿轮不对中（偏载）',
                          '[7,8,17]': this.$t('diagnosisTrend.fault414'), //'中间级齿轮不对中（偏载）',
                          '[0,1,2]': this.$t('diagnosisTrend.fault512'), //'联轴器不对中',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault513'), //'齿轮箱输出轴轴承跑圈',
                          '[0]': this.$t('diagnosisTrend.fault514'), //'齿轮箱输出轴轴承松动',
                          '[19]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                        },
                        {
                          '[5]': this.$t('diagnosisTrend.fault61'), //'发电机前轴承外圈故',
                          '[6]': this.$t('diagnosisTrend.fault62'), //'发电机前轴承内圈故障',
                          '[7]': this.$t('diagnosisTrend.fault63'), //'发电机前轴承滚动体故障',
                          '[8]': this.$t('diagnosisTrend.fault64'), //'发电机前轴承保持架故障',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault65'), //'发电机前轴承跑圈',
                          '[0,9]': this.$t('diagnosisTrend.fault66'), //'发电机前轴承松动',
                          '[10]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                          '[0]': this.$t('diagnosisTrend.fault512'), //'联轴器不对中',
                        },
                        {
                          '[5]': this.$t('diagnosisTrend.fault71'), //'发电机后轴承外圈故障',
                          '[6]': this.$t('diagnosisTrend.fault72'), //'发电机后轴承内圈故障',
                          '[7]': this.$t('diagnosisTrend.fault73'), //'发电机后轴承滚动体故障',
                          '[8]': this.$t('diagnosisTrend.fault74'), //'发电机后轴承保持架故障',
                          '[1,2,3,4]': this.$t('diagnosisTrend.fault75'), //'发电机后轴承跑圈',
                          '[0,9]': this.$t('diagnosisTrend.fault76'), //'发电机后轴承松动',
                          '[10]': this.$t('diagnosisTrend.fault07'), //'电气故障',
                        },
                      ]
                      if (el.id && fault[Number(el.id)]) {
                        for (let key in fault[Number(el.id)]) {
                          if (el.fault_type.indexOf(key) !== -1) {
                            diagnosis.push(fault[Number(el.id)][key])
                          }
                        }
                      }
                    }
                  })
                  param.diagnosis.driveChain = {
                    status: param.modelItems.driveChain.alarm_status,
                    diagnosis: diagnosis,
                  }
                }
              }
              //画健康值百分比、拼模型小标题的数组
              this.$nextTick(() => {
                if (param.modelItems.driveChain.health !== null) {
                  angle = (param.modelItems.driveChain.health / 100) * 360
                  if (angle > 180) {
                    this.$refs[
                      `right_content1${this.currentKey}`
                    ][0].style.transform = 'rotate(180deg)'
                    this.$refs[
                      `left_content1${this.currentKey}`
                    ][0].style.transform = `rotate(${angle - 180}deg)`
                  } else {
                    this.$refs[
                      `right_content1${this.currentKey}`
                    ][0].style.transform = `rotate(${angle}deg)`
                    this.$refs[
                      `left_content1${this.currentKey}`
                    ][0].style.transform = `rotate(0deg)`
                  }
                  modelTitle.push({
                    name: this.$t('FdModel.locName1'), //'传动链',
                    router: 'fddrivechain',
                    isChoose: true,
                  })
                } else {
                  this.$refs[
                    `right_content1${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                  this.$refs[
                    `left_content1${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                }
                if (param.modelItems.tower.health !== null) {
                  angle = (param.modelItems.tower.health / 100) * 360
                  if (angle > 180) {
                    this.$refs[
                      `right_content2${this.currentKey}`
                    ][0].style.transform = 'rotate(180deg)'
                    this.$refs[
                      `left_content2${this.currentKey}`
                    ][0].style.transform = `rotate(${angle - 180}deg)`
                  } else {
                    this.$refs[
                      `right_content2${this.currentKey}`
                    ][0].style.transform = `rotate(${angle}deg)`
                    this.$refs[
                      `left_content2${this.currentKey}`
                    ][0].style.transform = `rotate(0deg)`
                  }
                } else {
                  this.$refs[
                    `right_content2${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                  this.$refs[
                    `left_content2${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                }
                if (param.modelItems.bolt.health !== null) {
                  angle = (param.modelItems.bolt.health / 100) * 360
                  if (angle > 180) {
                    this.$refs[
                      `right_content3${this.currentKey}`
                    ][0].style.transform = 'rotate(180deg)'
                    this.$refs[
                      `left_content3${this.currentKey}`
                    ][0].style.transform = `rotate(${angle - 180}deg)`
                  } else {
                    this.$refs[
                      `right_content3${this.currentKey}`
                    ][0].style.transform = `rotate(${angle}deg)`
                    this.$refs[
                      `left_content3${this.currentKey}`
                    ][0].style.transform = `rotate(0deg)`
                  }
                } else {
                  this.$refs[
                    `right_content3${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                  this.$refs[
                    `left_content3${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                }
                if (param.modelItems.impeller.health !== null) {
                  angle = (param.modelItems.impeller.health / 100) * 360
                  if (angle > 180) {
                    this.$refs[
                      `right_content4${this.currentKey}`
                    ][0].style.transform = 'rotate(180deg)'
                    this.$refs[
                      `left_content4${this.currentKey}`
                    ][0].style.transform = `rotate(${angle - 180}deg)`
                  } else {
                    this.$refs[
                      `right_content4${this.currentKey}`
                    ][0].style.transform = `rotate(${angle}deg)`
                    this.$refs[
                      `left_content4${this.currentKey}`
                    ][0].style.transform = `rotate(0deg)`
                  }
                } else {
                  this.$refs[
                    `right_content4${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                  this.$refs[
                    `left_content4${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                }
                if (param.modelItems.oil.health !== null) {
                  angle = (param.modelItems.oil.health / 100) * 360
                  if (angle > 180) {
                    this.$refs[
                      `right_content5${this.currentKey}`
                    ][0].style.transform = 'rotate(180deg)'
                    this.$refs[
                      `left_content5${this.currentKey}`
                    ][0].style.transform = `rotate(${angle - 180}deg)`
                  } else {
                    this.$refs[
                      `right_content5${this.currentKey}`
                    ][0].style.transform = `rotate(${angle}deg)`
                    this.$refs[
                      `left_content5${this.currentKey}`
                    ][0].style.transform = `rotate(0deg)`
                  }
                } else {
                  this.$refs[
                    `right_content5${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                  this.$refs[
                    `left_content5${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                }
                if (param.modelItems.anchor.health !== null) {
                  angle = (param.modelItems.anchor.health / 100) * 360
                  if (angle > 180) {
                    this.$refs[
                      `right_content6${this.currentKey}`
                    ][0].style.transform = 'rotate(180deg)'
                    this.$refs[
                      `left_content6${this.currentKey}`
                    ][0].style.transform = `rotate(${angle - 180}deg)`
                  } else {
                    this.$refs[
                      `right_content6${this.currentKey}`
                    ][0].style.transform = `rotate(${angle}deg)`
                    this.$refs[
                      `left_content6${this.currentKey}`
                    ][0].style.transform = `rotate(0deg)`
                  }
                } else {
                  this.$refs[
                    `right_content6${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                  this.$refs[
                    `left_content6${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                }
                if (param.modelItems.basics.health !== null) {
                  angle = (param.modelItems.basics.health / 100) * 360
                  if (angle > 180) {
                    this.$refs[
                      `right_content7${this.currentKey}`
                    ][0].style.transform = 'rotate(180deg)'
                    this.$refs[
                      `left_content7${this.currentKey}`
                    ][0].style.transform = `rotate(${angle - 180}deg)`
                  } else {
                    this.$refs[
                      `right_content7${this.currentKey}`
                    ][0].style.transform = `rotate(${angle}deg)`
                    this.$refs[
                      `left_content7${this.currentKey}`
                    ][0].style.transform = `rotate(0deg)`
                  }
                } else {
                  this.$refs[
                    `right_content7${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                  this.$refs[
                    `left_content7${this.currentKey}`
                  ][0].style.transform = `rotate(0deg)`
                }
              })
            }
          })
        }
      } else {
        clearInterval(param.timer)
      }
    },
    //获取当前机组存在的设备部件
    getmodelTitle() {
      const param = this.fdModel[this.currentKey]
      param.modelTitle =
        this.$store.state.windmodelTitle[
          `${param.mac.mac_id}_${param.mac.ch_class}`
        ]
      let modelTitleName = []
      if (param.modelTitle.length > 0) {
        param.modelTitle.forEach((element) => {
          modelTitleName.push(element.name)
        })
      }
      param.modelTitleName = modelTitleName
    },
    toAlarmTrend() {
      const param = this.fdModel[this.currentKey]
      const mac = param.mac
      let key = `diagnosisTrend_mac_${mac.mac_id}`
      let name = this.$t('HeaderEdge.secondLevel2_1') //'智能诊断趋势'
      let titleName = mac.mac_me + '-' + this.$t('HeaderEdge.secondLevel2_1') //'智能诊断趋势'
      this.$bus.$emit('choiceChartType', key, name, titleName, true)
    },
  },
  watch: {
    '$store.state.fdModelMsg': {
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
.inside-none {
  height: 5px;
  width: 46px;
  background-color: #215082;
}
.general-model {
  display: flex;
  flex-direction: column;
  .windBtnBlock {
    .btn {
      width: 130px;
      height: 43px;
      background: #0b1757;
      -webkit-box-shadow: 0px 0px 29px 0px rgba(6, 70, 167, 0.72) inset;
      box-shadow: 0px 0px 29px 0px rgba(6, 70, 167, 0.72) inset;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      margin: 0px 0px 0px 30px;
      cursor: pointer;
      float: right;
      border: 1px solid #4574d6;
      &:hover,
      &:focus {
        border: 1px solid #00fcf9;
      }
    }
  }
  .general-model-title {
    margin: 20px 0px;
    .general-model-f1 {
      color: #ffffff;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 400;
    }
  }
  .general-model-content {
    height: calc(100% - 30px);
    position: relative;
    top: 20px;
    .model-content {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .model-fengdian {
        width: 148px;
        height: 714px;
        background-image: url('~assets/images/fd/fdmodel.png');
        position: relative;
        .model-drivechain {
          width: 596px;
          height: 268px;
          position: absolute;
          right: 28%;
          top: 0%;
          background-image: url('~assets/images/fd/drivechaintitle.png');
        }
        .model-towerdrum {
          width: 584px;
          height: 184px;
          position: absolute;
          right: 32.5%;
          bottom: 37%;
          background-image: url('~assets/images/fd/towerdrumtitle.png');
        }
        .model-bolt {
          width: 584px;
          height: 172px;
          position: absolute;
          right: 32.4%;
          top: 74%;
          background-image: url('~assets/images/fd/bolttitle.png');
          .model-item {
            position: relative;
            top: 33px;
          }
        }
        .model-impeller {
          width: 586px;
          height: 185px;
          position: absolute;
          left: 40.4%;
          bottom: 74%;
          background-image: url('~assets/images/fd/impellertitle.png');
          .model-item {
            position: relative;
            left: 318px;
          }
        }
        .model-oil {
          width: 545px;
          height: 139px;
          position: absolute;
          left: 67.8%;
          bottom: 54.2%;
          background-image: url('~assets/images/fd/oiltitle.png');
          .model-item {
            position: relative;
            left: 277px;
          }
        }
        .model-anchorbolt {
          width: 574px;
          height: 312px;
          position: absolute;
          left: 48.9%;
          bottom: 4%;
          background-image: url('~assets/images/fd/anchorbolttitle.png');
          .model-item {
            position: relative;
            left: 305px;
          }
        }
        .model-base {
          width: 574px;
          height: 139px;
          position: absolute;
          left: 48.9%;
          bottom: 1%;
          background-image: url('~assets/images/fd/basetitle.png');
          .model-item {
            position: relative;
            left: 305px;
          }
        }
        .model-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 268px;
          height: 139px;
          .modelitem-title {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 40%;
            height: 100%;
            .modelitem-title-f {
              font-size: 16px;
              font-family: Source Han Sans CN;
              font-weight: 400;
              color: #ffffff;
              margin: 5px;
              cursor: pointer;
            }
          }
          .modelitem-separate {
            width: 0px;
            height: 63px;
            border: 1px solid #41addb;
          }
        }
      }
    }
  }
  .general-equip-diagnosis {
    position: absolute;
    right: 20px;
    top: 15%;
    width: 230px;
    background-color: #062647;
    padding: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid #0d6c95;
    .diagnosis-f1 {
      font-size: 16px;
      text-align: center;
      width: 65px;
      border-bottom: 1px solid #093868;
      margin: 5px 0px 10px 0px;
    }
    .diagnosis-content {
      width: 100%;
      background: #041e39;
      border-radius: 4px;
      padding: 15px;
      ul {
        width: 100%;
        margin: 0px 5px;
        li {
          font-size: 12px;
          width: 100%;
          display: flex;
          flex-direction: row;
          margin: 5px;
          div {
            width: 30%;
          }
        }
        .alarm-li {
          color: #f80000;
        }
        .warn-li {
          color: #ffa101;
        }
      }
      div {
        display: flex;
        flex-direction: row;
        font-size: 14px;
        margin-top: 2px;
        i {
          margin: 5px 6px 0px 8px;
        }
      }
    }
  }
}
.iconfont {
  color: #15d3ff;
  margin-right: 5px;
}
//正常
.modelitem-content {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  border: 1px solid #42b8d4ff;
  display: flex;
  align-items: center;
  margin-left: 30px;
  .circle {
    position: relative;
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }
  .percent-circle {
    position: absolute;
    height: 100%;

    overflow: hidden;
  }
  .percent-circle-left {
    left: 0;
    width: 40px;
    background: linear-gradient(-33deg, #1b80f7, #00fff6);
    border-radius: 40px 0 0 40px/40px 0 0 40px;
  }
  .left-content {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin: right center;
    border-radius: 40px 0 0 40px/40px 0 0 40px;
    background: rgb(5, 31, 58);
    transform: rotate(0deg); /* 角度调节 */
  }
  .percent-circle-right {
    right: 0;
    width: 40px;
    transform-origin: right center;
    background: linear-gradient(-33deg, #1046f6, #00fff6);
    border-radius: 0 40px 40px 0/0 40px 40px 0;
  }
  .right-content {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin: left center;
    border-radius: 0 42px 42px 0/0 42px 42px 0;
    background: rgb(5, 31, 58);
    transform: rotate(0deg); /*  角度调节 */
  }
  .c-c-inside {
    position: absolute;
    top: 11px;
    left: 11px;
    width: 58px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(5, 31, 58);
    border-radius: 100%;
    font-size: 30px;
    font-weight: 400;
    color: #4a9bff;
  }
}
//预警
.modelitem-content-warn {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  border: 1px solid #ffa101;
  display: flex;
  align-items: center;
  margin-left: 30px;
  .circle {
    position: relative;
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }
  .percent-circle {
    position: absolute;
    height: 100%;
    overflow: hidden;
  }
  .percent-circle-left {
    left: 0;
    width: 40px;
    background: linear-gradient(-33deg, #ffdf9f, #ffa101);
    border-radius: 40px 0 0 40px/40px 0 0 40px;
  }
  .left-content {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin: right center;
    border-radius: 40px 0 0 40px/40px 0 0 40px;
    background: rgb(5, 31, 58);
    transform: rotate(0deg); /* 角度调节 */
  }
  .percent-circle-right {
    right: 0;
    width: 40px;
    transform-origin: right center;
    background: linear-gradient(-33deg, #fff6d4, #ffa101);
    border-radius: 0 40px 40px 0/0 40px 40px 0;
  }
  .right-content {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin: left center;
    border-radius: 0 42px 42px 0/0 42px 42px 0;
    background: rgb(5, 31, 58);
    transform: rotate(180deg); /*  角度调节 */
  }
  .c-c-inside {
    position: absolute;
    top: 11px;
    left: 11px;
    width: 58px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(5, 31, 58);
    border-radius: 100%;
    font-size: 30px;
    font-weight: 400;
    color: #ffa101;
  }
}
//报警
.modelitem-content-alarm {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  border: 1px solid #f80000;
  display: flex;
  align-items: center;
  margin-left: 30px;
  .circle {
    position: relative;
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }
  .percent-circle {
    position: absolute;
    height: 100%;
    overflow: hidden;
  }
  .percent-circle-left {
    left: 0;
    width: 40px;
    background: linear-gradient(-33deg, #fd676b, #f80000);
    border-radius: 40px 0 0 40px/40px 0 0 40px;
  }
  .left-content {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin: right center;
    border-radius: 40px 0 0 40px/40px 0 0 40px;
    background: rgb(5, 31, 58);
    transform: rotate(90deg); /* 角度调节 */
  }
  .percent-circle-right {
    right: 0;
    width: 40px;
    transform-origin: right center;
    background: linear-gradient(-33deg, #ff9595, #f80000);
    border-radius: 0 40px 40px 0/0 40px 40px 0;
  }
  .right-content {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    transform-origin: left center;
    border-radius: 0 42px 42px 0/0 42px 42px 0;
    background: rgb(5, 31, 58);
    transform: rotate(180deg); /*  角度调节 */
  }
  .c-c-inside {
    position: absolute;
    top: 11px;
    left: 11px;
    width: 58px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(5, 31, 58);
    border-radius: 100%;
    font-size: 30px;
    font-weight: 400;
    color: #f80000;
  }
}
@media screen and (max-width: 1366px) {
  .general-model {
    display: flex;
    flex-direction: column;
    .general-model-title {
      margin: 20px 0px;
      .general-model-f1 {
        color: #ffffff;
        font-size: 20px;
        font-family: Source Han Sans CN;
        font-weight: 400;
      }
    }
    .general-model-content {
      height: calc(100% - 30px);
      .model-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .model-fengdian {
          width: 100px;
          height: 428px;
          background-size: 100% 100%;
          background-image: url('~assets/images/fd/fdmodel.png') no-repeat;
          .model-drivechain {
            width: 357px;
            height: 160px;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/drivechaintitle.png');
          }
          .model-towerdrum {
            width: 350px;
            height: 110px;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/towerdrumtitle.png');
          }
          .model-bolt {
            width: 350px;
            height: 103px;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/bolttitle.png');
            .model-item {
              position: relative;
              top: 20%;
            }
          }
          .model-impeller {
            width: 351px;
            height: 111px;
            right: 20.8%;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/impellertitle.png');
            .model-item {
              position: relative;
              left: 54%;
            }
          }
          .model-oil {
            width: 327px;
            height: 83.4px;
            position: absolute;
            right: 20.8%;
            bottom: 54%;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/oiltitle.png');
            .model-item {
              position: relative;
              left: 51%;
            }
          }
          .model-anchorbolt {
            width: 344px;
            height: 187px;
            position: absolute;
            right: 20.8%;
            bottom: 9%;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/anchorbolttitle.png');
            .model-item {
              position: relative;
              left: 53%;
            }
          }
          .model-base {
            width: 344px;
            height: 83px;
            position: absolute;
            right: 20.8%;
            bottom: 7%;
            background-size: 100% 100%;
            background-image: url('~assets/images/fd/basetitle.png');
            .model-item {
              position: relative;
              left: 53%;
            }
          }
          .model-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 160px;
            height: 83px;
            .modelitem-title {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 40%;
              height: 100%;
              .modelitem-title-f {
                font-size: 12px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #ffffff;
                margin: 5px;
                cursor: pointer;
              }
            }
            .modelitem-separate {
              width: 0px;
              height: 63px;
              border: 1px solid #41addb;
            }
          }
        }
      }
    }
    .general-equip-diagnosis {
      width: 180px;
      .diagnosis-f1 {
        font-size: 14px;
        text-align: center;
      }
      .diagnosis-content ul li {
        font-size: 12px;
        margin: 5px;
      }
      .diagnosis-content div {
        display: flex;
        flex-direction: row;
        font-size: 12px;
        margin-top: 7px;
        i {
          margin: 7px 5px 0px 8px;
        }
      }
    }
  }
  //正常
  .modelitem-content {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #42b8d4ff;
    display: flex;
    align-items: center;
    margin-left: 15px;
    .circle {
      position: relative;
      margin: 0 auto;
      width: 45px;
      height: 45px;
    }
    .percent-circle {
      position: absolute;
      height: 100%;
      overflow: hidden;
    }
    .percent-circle-left {
      left: 0;
      width: 50%;
      background: linear-gradient(-33deg, #1b80f7, #00fff6);
      border-radius: 40px 0 0 40px/40px 0 0 40px;
    }
    .left-content {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      transform-origin: right center;
      border-radius: 40px 0 0 40px/40px 0 0 40px;
      background: rgb(5, 31, 58);
      transform: rotate(0deg); /* 角度调节 */
    }
    .percent-circle-right {
      right: 0;
      width: 50%;
      transform-origin: right center;
      background: linear-gradient(-33deg, #1046f6, #00fff6);
      border-radius: 0 40px 40px 0/0 40px 40px 0;
    }
    .right-content {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      transform-origin: left center;
      border-radius: 0 42px 42px 0/0 42px 42px 0;
      background: rgb(5, 31, 58);
      transform: rotate(0deg); /*  角度调节 */
    }
    .c-c-inside {
      position: absolute;
      top: 11%;
      left: 9%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(5, 31, 58);
      border-radius: 100%;
      font-size: 16px;
      font-weight: 400;
      color: #4a9bff;
    }
  }
  //预警
  .modelitem-content-warn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #ffa101;
    display: flex;
    align-items: center;
    margin-left: 15px;
    .circle {
      position: relative;
      margin: 0 auto;
      width: 45px;
      height: 45px;
    }
    .percent-circle {
      position: absolute;
      height: 100%;
      overflow: hidden;
    }
    .percent-circle-left {
      left: 0;
      width: 50%;
      background: linear-gradient(-33deg, #ffdf9f, #ffa101);
      border-radius: 40px 0 0 40px/40px 0 0 40px;
    }
    .left-content {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      transform-origin: right center;
      border-radius: 40px 0 0 40px/40px 0 0 40px;
      background: rgb(5, 31, 58);
      transform: rotate(0deg); /* 角度调节 */
    }
    .percent-circle-right {
      right: 0;
      width: 50%;
      transform-origin: right center;
      background: linear-gradient(-33deg, #fff6d4, #ffa101);
      border-radius: 0 40px 40px 0/0 40px 40px 0;
    }
    .right-content {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      transform-origin: left center;
      border-radius: 0 42px 42px 0/0 42px 42px 0;
      background: rgb(5, 31, 58);
      transform: rotate(0deg); /*  角度调节 */
    }
    .c-c-inside {
      position: absolute;
      top: 11%;
      left: 9%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(5, 31, 58);
      border-radius: 100%;
      font-size: 16px;
      font-weight: 400;
      color: #ffa101;
    }
  }
  //报警
  .modelitem-content-alarm {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #f80000;
    display: flex;
    align-items: center;
    margin-left: 15px;
    .circle {
      position: relative;
      margin: 0 auto;
      width: 45px;
      height: 45px;
    }
    .percent-circle {
      position: absolute;
      height: 100%;
      overflow: hidden;
    }
    .percent-circle-left {
      left: 0;
      width: 50%;
      background: linear-gradient(-33deg, #fd676b, #f80000);
      border-radius: 40px 0 0 40px/40px 0 0 40px;
    }
    .left-content {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      transform-origin: right center;
      border-radius: 40px 0 0 40px/40px 0 0 40px;
      background: rgb(5, 31, 58);
      transform: rotate(0deg); /* 角度调节 */
    }
    .percent-circle-right {
      right: 0;
      width: 50%;
      transform-origin: right center;
      background: linear-gradient(-33deg, #ff9595, #f80000);
      border-radius: 0 40px 40px 0/0 40px 40px 0;
    }
    .right-content {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      transform-origin: left center;
      border-radius: 0 42px 42px 0/0 42px 42px 0;
      background: rgb(5, 31, 58);
      transform: rotate(0deg); /*  角度调节 */
    }
    .c-c-inside {
      position: absolute;
      top: 11%;
      left: 9%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgb(5, 31, 58);
      border-radius: 100%;
      font-size: 16px;
      font-weight: 400;
      color: #f80000;
    }
  }
}
</style>
