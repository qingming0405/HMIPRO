<template>
  <div>
    <div v-for="(params,key) in focus">
      <div class="general-view">
        <div class="general-view-screen">
          <div class="view-screen-collect">
            <div class="view-screen-f">{{$t('GjFocus.filterText')}}:</div>
            <i
              class="my-icon"
              :class="setClass(params.ischeck)"
              @click="isShowCollect"
            ></i>
          </div>
          <div
            v-if="params.ischeck"
            class="general-view-select"
          >
            <div class="view-screen">
              <div class="view-screen-f">{{$t('GjFocus.macTitle')}}:</div>
              <div
                class="select-box"
                @click="changeMacType"
                :title="params.mac.val"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('GjFocus.searchMacText')"
                  v-model="params.mac.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('GjFocus.posTitle')}}:</div>
              <div
                class="select-box"
                @click="changePosType"
                :title="params.pos.val"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('GjFocus.searchPosText')"
                  v-model="params.pos.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('GjFocus.valTitle')}}:</div>
              <div
                class="select-box"
                @click="changeEigType"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('GjFocus.searchValText')"
                  v-model="params.eigen.val"
                  :title="params.eigen.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('GjFocus.numTitle')}}:</div>
              <div class="select-box">
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('GjFocus.numTitle')"
                  v-model="params.macSum"
                />
              </div>
            </div>
            <div>
              <button
                @click="MacSelecttimer(1)"
                class="pop-btn pop-btn-ok"
              >{{$t('GjFocus.sureText')}}</button>
            </div>
          </div>
        </div>
        <div
          class="general-scroll"
          :ref='"general_scroll"+key'
        >
          <!-- 筛选显示机组 -->
          <div
            v-show="params.ischeck && params.selmacList.length > 0 && !params.isShowTree"
            class="general-view-content"
            ref="general_screen"
          >
            <div
              v-for="(item,index) in params.selmacList"
              class="view-content "
              :ref='"view_contentt"+index'
              @click="choosemac(index, params.selmacList, 'view_contentt')"
              :class="{
              'general-view-citem': item.type === 1,
              'general-view-citem-warning': item.type === 2,
              'general-view-citem-abnormal': item.type === 6,
              'general-view-citem-alarm1': item.type === 3,
              'general-view-citem-offline': item.type === 4,
              'general-view-citem-alarm2': item.type === 5
            }"
              @dblclick="toMacModel(item)"
            >
              <div class="general-view-ctitle">
                <div
                  :class='["general-view-f2",item.dgm_type == 3 && item.t_root == 2 ?"general-view-f3"
                : ""
                ]'
                  :title="item.name"
                >{{item.name}}</div>
                <i
                  @click="collection(item)"
                  v-if="!item.isFocus"
                  class="iconfont icon-shoucang"
                ></i>
                <i
                  @click="collection(item)"
                  v-else
                  class="iconfont icon-mianxing_fuzhi_huaban1 focusColor"
                ></i>
              </div>
              <div class="general-view-ccontent">
                <img
                  class="ccontent-img"
                  :src="gdmodelImg"
                >
                <div class="ccontent">
                  <div>{{item.status}}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="params.isShowTree && params.ischeck && params.selmacList.length > 0">
            <div v-for="(group, name) in params.groupSelmacList">
              <div class="general-view-content-title">{{ name }}</div>
              <div
                class="general-view-content"
                ref="general_collect"
              >
                <div
                  v-for="(item, index) in group"
                  class="view-content "
                  :ref='"view_content"+index'
                  @click="choosemac(index, params.macList, 'view_content')"
                  @dblclick="toMacModel(item)"
                  :style="item.style"
                  :class="{
              'active': item.chooseflag,
              'general-view-citem': item.type === 1,
              'general-view-citem-warning': item.type === 2,
              'general-view-citem-abnormal': item.type === 6,
              'general-view-citem-alarm1': item.type === 3,
              'general-view-citem-offline': item.type === 4,
              'general-view-citem-alarm2': item.type === 5}"
                >
                  <div class="general-view-ctitle">
                    <div
                      :class='["general-view-f2",item.dgm_type == 3 && item.t_root == 2 ?"general-view-f3"
                : ""
                ]'
                      :title="item.name"
                    >{{item.name}}</div>
                    <i
                      @click="collection(item)"
                      v-if="!item.isFocus"
                      class="iconfont icon-shoucang"
                    ></i>
                    <i
                      @click="collection(item)"
                      v-else
                      class="iconfont icon-mianxing_fuzhi_huaban1 focusColor"
                    ></i>
                  </div>
                  <div class="general-view-ccontent">
                    <img
                      class="ccontent-img"
                      :src="gdmodelImg"
                    >
                    <div class="ccontent">
                      <div>{{item.status}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="params.macList.length && params.macList.length"
            class="separator"
          ></div>
          <!-- 收藏显示机组 -->
          <div v-show="!params.isShowTree">
            <div
              class="general-view-content"
              ref="general_collect"
            >
              <div
                v-for="(item,index) in params.macList"
                class="view-content "
                :ref='"view_content"+index'
                @click="choosemac(index, params.macList, 'view_content')"
                :style="item.style"
                :class="{
              'active': item.chooseflag,
              'general-view-citem': item.type === 1,
              'general-view-citem-warning': item.type === 2,
              'general-view-citem-abnormal': item.type === 6,
              'general-view-citem-alarm1': item.type === 3,
              'general-view-citem-offline': item.type === 4,
              'general-view-citem-alarm2': item.type === 5
            }"
                @dblclick="toMacModel(item)"
              >
                <div class="general-view-ctitle">
                  <div
                    :class='["general-view-f2",item.dgm_type == 3 && item.t_root == 2 ?"general-view-f3"
                : ""
                ]'
                    :title="item.name"
                  >{{item.name}}</div>
                  <i
                    @click="collection(item)"
                    v-if="!item.isFocus"
                    class="iconfont icon-shoucang"
                  ></i>
                  <i
                    @click="collection(item)"
                    v-else
                    class="iconfont icon-mianxing_fuzhi_huaban1 focusColor"
                  ></i>
                </div>
                <div class="general-view-ccontent">
                  <img
                    class="ccontent-img"
                    :src="gdmodelImg"
                  >
                  <div class="ccontent">
                    <div>{{item.status}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 收藏显示机组 -->
          <div v-show="params.isShowTree">
            <div v-for="(group, name) in params.groupMacList">
              <div class="general-view-content-title">{{ name }}</div>
              <div
                class="general-view-content"
                ref="general_collect"
              >
                <div
                  v-for="(item, index) in group"
                  class="view-content "
                  :ref='"view_content"+index'
                  @click="choosemac(index, macList, 'view_content')"
                  @dblclick="toMacModel(item)"
                  :style="item.style"
                  :class="{
              'active': item.chooseflag,
              'general-view-citem': item.type === 1,
              'general-view-citem-warning': item.type === 2,
              'general-view-citem-abnormal': item.type === 6,
              'general-view-citem-alarm1': item.type === 3,
              'general-view-citem-offline': item.type === 4,
              'general-view-citem-alarm2': item.type === 5}"
                >
                  <div class="general-view-ctitle">
                    <div
                      :class='["general-view-f2",item.dgm_type == 3 && item.t_root == 2 ?"general-view-f3"
                : ""
                ]'
                      :title="item.name"
                    >{{item.name}}</div>
                    <i
                      @click="collection(item)"
                      v-if="!item.isFocus"
                      class="iconfont icon-shoucang"
                    ></i>
                    <i
                      @click="collection(item)"
                      v-else
                      class="iconfont icon-mianxing_fuzhi_huaban1 focusColor"
                    ></i>
                  </div>
                  <div class="general-view-ccontent">
                    <img
                      class="ccontent-img"
                      :src="gdmodelImg"
                    >
                    <div class="ccontent">
                      <div>{{item.status}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div
          v-show="params.downShow"
          class="general-view-page"
        >
          <div
            class="paging-img"
            @click="turnPage"
          ></div>
        </div>
      </div>
      <!-- 多选弹窗 -->
      <div
        class="multiList-edge"
        v-show="params.checkList.isShow"
        @click.stop="getCheck"
      >
        <ul
          class="multiList scroll-style-edge"
          :style="params.checkList.style"
        >
          <li
            v-for="(item, index) in params.checkList.text"
            :key="index"
            :title="item.val"
            v-show="item.isShow"
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
      <!-- 单选弹窗 -->
      <div
        class="multiList-edge"
        v-show="params.echeckList.isShow"
        @click.stop="getEigCheck"
      >
        <ul
          class="multiList scroll-style-edge"
          :style="params.echeckList.style"
        >
          <li
            @click="geteigenvalue(item)"
            v-for="(item, index) in params.eigenvalue"
            :title="item.val"
            v-show="item.isShow"
          >
            {{ item.val }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneObj, round, setHead } from 'utils/utils.js'
import focus from 'common/general/focus.js'
export default {
  name: 'gjFocus',
  mixins: [focus],
  data() {
    return {
      ischeck: true,
      eachRowNum: 6, //每一行的个数
      gdmodelImg: require('assets/images/gj/train.png'),
      isShowTree: false, //true：航海选中父组织时显示子组织（车辆）
      groupMacList: {},
      groupSelmacList: {},
    }
  },

  mounted() {
    let gjModelflag = config.gjModel
    if (gjModelflag == 1) {
      this.gdmodelImg = require('assets/images/gj/train1.png')
    }
    this.$nextTick(() => {
      if (this.$refs.general_scroll) {
        this.$refs.general_scroll.addEventListener('scroll', this.handleScroll)
      }
    })
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'gjFocus',
    })
    this.$watch(
      function () {
        // 第一个函数就是处理你要监听的属性，只要将其return出去就行
        return this.focus[this.currentKey].searchmac
      },
      function (val) {
        const param = this.focus[this.currentKey]
        param.mac_group = {}
        val.forEach((item) => {
          if (param.mac_group[item.fullTName] === undefined) {
            param.mac_group[item.fullTName] = []
          }
          /* 匹配下拼音 */
          // if (this.searchKey != "") {
          if (this.pinyin.match(item.name, this.searchKey)) {
            item.isShow = true
          } else {
            item.isShow = false
          }
          // }
          param.mac_group[item.fullTName].push(item)
        })
      }
    )
    this.$watch(
      function () {
        // 第一个函数就是处理你要监听的属性，只要将其return出去就行
        return this.focus[this.currentKey].macList
      },
      function (val) {
        const param = this.focus[this.currentKey]
        let groupMacList = {}
        val.forEach((item) => {
          if (groupMacList[item.fullTName] === undefined) {
            groupMacList[item.fullTName] = []
          }
          /* 匹配下拼音 */
          // if (this.searchKey != "") {
          if (this.pinyin.match(item.name, this.searchKey)) {
            item.isShow = true
          } else {
            item.isShow = false
          }
          // }
          groupMacList[item.fullTName].push(item)
        })
        param.groupMacList = groupMacList
      }
    )
  },
  methods: {
    getAlarmStatus(obj, alarm_status) {
      switch (alarm_status) {
        case 0:
          obj.status = '离线'
          obj.type = 4
          break
        case 1:
          obj.status = '正常'
          obj.type = 1
          break
        case 2:
          obj.status = '预警'
          obj.type = 2
          break
        case 3:
          obj.status = 'Ⅰ级报警'
          obj.type = 3
          break
        case 4:
          obj.status = 'Ⅱ级报警'
          obj.type = 5
          break
      }
      return obj
    },
    //获取筛选数据
    MacSelect(requestData, type = 0) {
      const params = this.focus[this.currentKey]
      if (params.isSelRequestDown) {
        params.isSelRequestDown = false
        let selmacList = []
        this.$getApi.filterMacByCondition(requestData).then((res) => {
          params.isSelRequestDown = true
          if (res) {
            if (params.isDataRight) {
              if (res.data.length == 0 && type == 1) {
                this.$pop('筛选无数据')
              }
              res.data.forEach((item) => {
                let obj = {}
                obj.chooseflag = false //是否选中

                // 总貌图配置
                let stutas = config.generalStutas
                if (stutas && item.alarmStatus == 0) {
                  item.alarmStatus = 1
                }
                obj.alarmStatus = item.alarmStatus
                obj.t_root = item.t_root
                obj = this.getAlarmStatus(obj, item.alarmStatus)
                obj.isShow = true //控制是否显示
                obj.t_id = item.t_id
                obj.mac_id = item.mac_id
                obj.isFocus = item.isFocus ? true : false
                obj.name = item.mac_me
                if (item.dgm_type == 3 && item.t_root == 2) {
                  obj.name = `${item.t_name}-${item.mac_me}`
                }
                obj.pumps = item.pumps
                if (item.speed) {
                  obj.speed = round(item.speed, 2)
                } else {
                  obj.speed = 0
                }
                selmacList.push(obj)
              })
              /* 机组的排序 */
              let compare = function (obj1, obj2) {
                let val1 = obj1.name
                let val2 = obj2.name
                if (val1 < val2) {
                  return -1
                } else if (val1 > val2) {
                  return 1
                } else {
                  return 0
                }
              }
              selmacList.sort(compare)
              params.selmacList = selmacList
            } else {
              clearInterval(params.timer.seltimer)
              let fn = () => {
                this.MacSelect(requestData)
                return fn
              }
              params.timer.seltimer = setInterval(fn(), 6000)
              params.isDataRight = true
            }
          }
        })
      }
    },
    toMacModel(machine) {
      /* 从vuex中获取当前机组 */
      if (machine.pumps && machine.pumps.length) {
        machine.pump_id = machine.pumps[0].pump_id
      } else {
        this.$pop('该机组无总貌图')
        return
      }
      let pump_id = machine.pump_id
      let t_id = machine.t_id
      let macList = this.$store.state.mac[t_id]
      let mac
      let choosetree = cloneObj(this.$store.state.checkMsg.tree)
      let choosemac = this.$store.state.checkMsg.mac
      if (choosemac !== null) {
        if (choosemac.pump_id == pump_id) {
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
              }
            })
          }
          this.$bus.$emit(
            'generalRouting',
            'gjModel',
            '设备模型',
            'icon-shijingsanwei-'
          )
          return
        }
      }
      macList.forEach((item) => {
        if (item.pump_id === pump_id) {
          mac = item
          return
        }
      })
      /* 设置当前的机组 */
      if (mac.t_id != choosetree.t_id) {
        let treeArray = this.$store.state.tree
        treeArray.forEach((tree) => {
          if (mac.t_id == tree.t_id) {
            this.$store.commit('getCheckMsg', {
              msg: cloneObj(tree),
              type: 'tree',
            })
          }
        })
      }
      this.$store.commit('getCheckMsg', {
        msg: cloneObj(mac),
        type: 'mac',
      })
      /* 设置当前的机组 */
      this.$bus.$emit(
        'generalRouting',
        'gjModel',
        '设备模型',
        'icon-shijingsanwei-'
      )
    },
  },
  watch: {
    '$store.state.gjFocusMsg': {
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
.general-view {
  display: flex;
  flex-direction: column;
  .general-view-title {
    width: calc(100% - 30px);
    margin: 20px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .general-view-itemize {
      display: flex;
      flex-direction: row;
      .general-view-item {
        width: 187px;
        height: 60px;
        display: flex;
        align-items: center;
        background-image: url('~assets/images/fd/rectangle.png');
        span {
          width: 100%;
          text-align: center;
          font-size: 17px;
          font-weight: 400;
          color: #ffffff;
          line-height: 31px;
        }
      }
    }
    .general-view-f1 {
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      line-height: 30px;
    }
  }
  .general-view-screen {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 50px 0px 10px 0px;
    height: 26px;
    .general-view-select {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .view-screen {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .select-box {
        position: relative;
        border-radius: 5px;
        border: none;
        height: 26px;
        line-height: 26px;
        margin-right: 20px;
        background: rgb(12, 78, 153) !important;
        input {
          width: 120px;
          border: none;
          background: rgb(12, 78, 153) !important;
          padding-left: 10px;
          margin-right: 22px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        i {
          position: absolute;
          right: 10px;
          top: 0;
          font-size: 10px;
        }
      }
    }
    .view-screen-f {
      font-size: 14px;
      margin: 3px 15px;
    }
    .pop-btn {
      height: 26px;
      line-height: 26px;
      width: 60px;
      font-size: 14px;
      text-align: center;
      padding: 0;
      margin-left: 20px;
    }
    .view-screen-collect {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 60px;
    }
  }
  .general-view-page {
    width: 100%;
    .paging-img {
      position: absolute;
      bottom: 20px;
      left: calc(50% + 82px);
      width: 47px;
      height: 29px;
      background-image: url('~assets/images/fd/paging.png');
      animation: up 1.5s ease-in infinite;
      -moz-animation: up 1.5s ease-in infinite;
      -webkit-animation: up 1.5s ease-in infinite;
      @keyframes up {
        0% {
          transform: translateY(0);
          opacity: 0;
        }
        50% {
          transform: translateY(-20px);
          opacity: 1;
        }
        100% {
          transform: translateY(-40px);
          opacity: 0;
        }
      }
      @-webkit-keyframes up {
        0% {
          -webkit-transform: translateY(0);
          opacity: 0;
        }
        50% {
          -webkit-transform: translateY(-20px);
          opacity: 1;
        }
        100% {
          -webkit-transform: translateY(-40px);
          opacity: 0;
        }
      }
    }
  }
  .general-scroll::-webkit-scrollbar {
    display: none;
  }
  .general-scroll {
    overflow-y: auto;
    height: calc(100vh - 209px);
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none;
    /*火狐下隐藏滚动条*/
    scrollbar-width: none;
    .general-view-content-title {
      margin: 15px 15px 8px 15px;
      height: 30px;
      font-size: 20px;
      line-height: 30px;
    }
    .general-view-content {
      display: grid;
      // height: calc(100vh - 302px);
      grid-template-columns: repeat(auto-fill, 250px);
      grid-row-gap: 40px;
      grid-column-gap: 28px;
      // grid-template-rows: 137px 137px 137px 137px 137px 137px;
      margin: 20px 15px 15px 15px;
      padding-bottom: 15px;
      justify-content: center;
      .view-content {
        width: 250px;
        height: 137px;
        background: #0c1858;
        border-radius: 4px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
      //绿色正常
      .general-view-citem {
        border: 1px solid rgba(0, 154, 68, 0.9);
        box-shadow: 0px 0px 20px 1px rgba(0, 154, 68, 0.9) inset;
      }
      //橙色预警
      .general-view-citem-warning {
        border: 1px solid rgba(192, 176, 0, 0.8);
        box-shadow: rgba(192, 176, 0, 0.8) 0px 0px 20px 1px inset;
      }

      //蓝色自检查异常
      .general-view-citem-abnormal {
        border: 1px solid rgba(65, 119, 254, 0.8);
        box-shadow: rgba(65, 119, 254, 0.8) 0px 0px 20px 1px inset;
      }

      //红色2级报警
      .general-view-citem-alarm2 {
        border: 1px solid rgba(248, 0, 0, 0.8);
        box-shadow: rgba(248, 0, 0, 0.8) 0px 0px 20px 1px inset;
      }

      //橘色1级报警
      .general-view-citem-alarm1 {
        border: 1px solid rgba(255, 162, 2, 0.8);
        box-shadow: rgba(255, 162, 2, 0.8) 0px 0px 20px 1px inset;
      }

      //离线
      .general-view-citem-offline {
        border: 1px solid rgba(6, 70, 168, 0.72);
        box-shadow: rgba(6, 70, 168, 0.72) 0px 0px 20px 0px inset;
      }
      .general-view-ctitle {
        height: 37px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid #4674d6;

        .general-view-f2 {
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #f2f6fa;
          width: 180px;
          margin-left: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .general-view-f3 {
          font-size: 15px;
        }
        .iconfont {
          position: relative;
          left: 23px;
          justify-content: flex-end;
          width: 19px;
          height: 19px;
          font-size: 19px;
          cursor: pointer;
          margin-right: 40px;
        }
        .focusColor {
          color: #00fdff;
        }
      }
      .general-view-ccontent {
        height: calc(100% - 37px);
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .ccontent-img {
          width: 110px;
          height: 36px;
          margin-left: 30px;
          // background-image: url('~assets/images/gj/train.png');
        }

        .ccontent {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #f2f6fa;

          div {
            margin: 12px;
            width: 110px;
            text-align: center;
          }
        }
      }
    }
  }
}
.focusColor {
  color: #00fdff;
}
.separator {
  width: 100%;
  height: 1px;
  background: #0b4c90;
  margin-bottom: 25px;
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
.active {
  border: 1px solid #00fcf9;
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
@media screen and (max-width: 1366px) {
  .general-view {
    .general-scroll {
      overflow-y: auto;
      height: calc(100vh - 209px);
      .general-view-content-title {
        margin: 8px 0 5px 0;
        height: 30px;
        line-height: 30px;
      }
      .general-view-content {
        display: grid;
        // height: calc(100vh - 302px);
        grid-template-columns: repeat(auto-fill, 215px);
        grid-row-gap: 40px;
        grid-column-gap: 25px;
        grid-template-rows: repeat(100, 137px);
        // grid-template-rows: 137px 137px 137px 137px 137px 137px;
        margin: 30px 0 15px 0;
        padding-bottom: 15px;
        justify-content: center;
        .view-content {
          width: 215px;
          height: 137px;
          background: #0c1858;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .general-view-ctitle {
          .general-view-f2 {
            width: 120px;
          }
        }
      }
    }
  }
}
</style>

