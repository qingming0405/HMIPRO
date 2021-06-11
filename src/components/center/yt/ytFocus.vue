<template>
  <div>
    <div
      v-for="(param,key) in focus"
      v-show="param.isShow"
    >
      <div class="general-view">
        <div class="general-view-screen">
          <div class="view-screen-collect">
            <div class="view-screen-f">{{$t('YtFocus.filterText')}}:</div>
            <i
              class="my-icon"
              :class="setClass(param.ischeck)"
              @click="isShowCollect"
            ></i>
          </div>
          <div
            v-if="param.ischeck"
            class="general-view-select"
          >
            <div class="view-screen">
              <div class="view-screen-f">{{$t('YtFocus.macTitle')}}:</div>
              <div
                class="select-box"
                @click="changeMacType"
                :title="param.mac.val"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('YtFocus.searchMacText')"
                  v-model="param.mac.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('YtFocus.posTitle')}}:</div>
              <div
                class="select-box"
                @click="changePosType"
                :title="param.pos.val"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('YtFocus.searchPosText')"
                  v-model="param.pos.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('YtFocus.valTitle')}}:</div>
              <div
                class="select-box"
                @click="changeEigType"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('YtFocus.searchValText')"
                  v-model="param.eigen.val"
                  :title="param.eigen.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('YtFocus.numTitle')}}:</div>
              <div class="select-box">
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('YtFocus.numTitle')"
                  v-model="param.macSum"
                />
              </div>
            </div>
            <div>
              <button
                @click="MacSelecttimer"
                class="pop-btn pop-btn-ok"
              >
                {{$t('YtFocus.sureText')}}
              </button>
            </div>
          </div>
        </div>
        <div
          class="general-scroll"
          :ref='"general_scroll"+key'
        >
          <!-- 筛选显示机组 -->
          <div
            v-for="(searchGroup, groupName) in param.groupSelmacList"
            v-show="param.ischeck && param.selmacList.length > 0"
          >
            <div class="general-view-content-title">{{ groupName }}</div>
            <div
              class="general-view-content"
              ref="general_screen"
            >
              <div
                v-for="(item, index) in searchGroup"
                class="view-content"
                @click="choosemac(index,item,'view-content')"
                :class="{
                active: item.chooseflag,
                'general-view-citem': item.type === 1,
                'general-view-citem-warning': item.type === 2,
                'general-view-citem-abnormal': item.type === 6,
                'general-view-citem-alarm': item.type === 3,
                'general-view-citem-offline': item.type === 4
              }"
                @dblclick="toMacModel(item, 'ytModel')"
              >
                <div class="general-view-ctitle">
                  <div
                    class="general-view-f2"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </div>
                  <i
                    @click="collection(item)"
                    :class="[
                    'iconfont',
                    item.isFocus
                      ? 'icon-mianxing_fuzhi_huaban1 focusColor'
                      : 'icon-shoucang'
                  ]"
                  ></i>
                </div>
                <div class="general-view-ccontent">
                  <div class="ccontent-imgs">
                    <img
                      class="ccontent-img1"
                      src="~assets/images/yt/youtian.png"
                    />
                  </div>
                  <div
                    class="ccontent"
                    :class="{ outline: item.type === 4 }"
                  >
                    <div>
                      <p>{{$t('YtFocus.IDText')}}</p>
                      {{ item.dgm_id }}
                    </div>
                    <div>
                      <p>{{$t('YtFocus.statusText')}}</p>
                      {{ item.running_status }}
                    </div>
                    <div>
                      <p>{{$t('YtFocus.alarmText')}}</p>
                      {{ item.status }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="param.macList.length && param.macList.length && param.ischeck"
            class="separator"
          ></div>
          <!-- 收藏显示机组 -->
          <div>
            <div v-for="(group, name) in param.groupMacList">
              <div class="general-view-content-title">{{ name }}</div>
              <div
                class="general-view-content"
                ref="general_collect"
              >
                <div
                  v-for="(item, index) in group"
                  class="view-content"
                  @click="choosemac(index,group,'view_contentt')"
                  :class="{
                  active: item.chooseflag,
                  'general-view-citem': item.type === 1,
                  'general-view-citem-warning': item.type === 2,
                  'general-view-citem-abnormal': item.type === 6,
                  'general-view-citem-alarm': item.type === 3,
                  'general-view-citem-offline': item.type === 4
                }"
                  @dblclick="toMacModel(item, 'ytModel')"
                >
                  <div class="general-view-ctitle">
                    <div
                      class="general-view-f2"
                      :title="item.name"
                    >
                      {{ item.name }}
                    </div>
                    <i
                      @click="collection(item)"
                      :class="[
                      'iconfont',
                      item.isFocus
                        ? 'icon-mianxing_fuzhi_huaban1 focusColor'
                        : 'icon-shoucang'
                    ]"
                    ></i>
                  </div>
                  <div class="general-view-ccontent">
                    <div class="ccontent-imgs">
                      <img
                        class="ccontent-img1"
                        src="~assets/images/yt/youtian.png"
                      />
                    </div>
                    <div
                      class="ccontent"
                      :class="{ outline: item.type === 4 }"
                    >
                      <div>
                        <p>{{$t('YtFocus.IDText')}}</p>
                        {{ item.dgm_id }}
                      </div>
                      <div>
                        <p>{{$t('YtFocus.statusText')}}</p>
                        {{ item.running_status }}
                      </div>
                      <div>
                        <p>{{$t('YtFocus.alarmText')}}</p>
                        {{ item.status }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div
          v-show="param.downShow"
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
        v-show="param.checkList.isShow"
        @click.stop="getCheck"
      >
        <ul
          class="multiList scroll-style-edge"
          :style="param.checkList.style"
        >
          <li
            v-for="(item, index) in param.checkList.text"
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
        v-show="param.echeckList.isShow"
        @click.stop="getEigCheck"
      >
        <ul
          class="multiList scroll-style-edge"
          :style="param.echeckList.style"
        >
          <li
            @click="geteigenvalue(item)"
            v-for="(item, index) in param.eigenvalue"
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
  name: 'ytFocus',
  mixins: [focus],
  data() {
    return {
      itemize: [
        { name: '全部', number: 0 },
        { name: '正常', number: 0 },
        { name: '报警', number: 0 },
        { name: '预警', number: 0 },
        { name: '自检异常', number: 0 },
        { name: '离线', number: 0 },
        { name: '关注', number: 0 },
      ],
      ischeck: true,
      tArray: [],
      tree: {
        msg: {},
        val: '',
        id: null,
      },
      eachRowNum: 6, //每一行的个数
      selmacList: [],
      macList: [], //全部收藏机组
    }
  },
  created() {
    window.innerWidth < 1380 ? (this.eachRowNum = 5) : (this.eachRowNum = 6)
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'ytFocus',
    })
  },
  methods: {
    /* 获取所有的收藏的机组 */
    getData(requestData) {
      const params = this.focus[this.currentKey]
      this.$getApi.queryAllFocus(requestData).then((res) => {
        if (res) {
          var macList = []
          // this.mac = [];
          res.data.forEach((item) => {
            let obj = {}
            obj.chooseflag = false //是否选中
            obj.alarmStatus = item.alarm_status
            obj = this.getAlarmStatus(obj, item.alarm_status)
            if (item.running_status !== undefined) {
              /*  */
              obj.running_status = this.setRunstation(item.running_status)
            }
            obj.dgm_id = item.dgm_id
            obj.isShow = true //控制是否显示
            obj.t_id = item.t_id
            obj.mac_id = item.mac_id
            obj.isFocus = item.isFocus ? true : false
            obj.name = item.mac_me
            obj.fullTName = item.fullTName
            obj.speed = item.speed < 100000000 ? round(item.speed, 2) : 0
            macList.push(obj)
          })
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
          macList.sort(compare)
          params.macList = macList
          this.macList = macList
        }
      })
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
                this.$pop(this.$t('YtFocus.filterNoData'))
              }
              res.data.forEach((item) => {
                let obj = {}
                obj.chooseflag = false //是否选中
                let stutas = config.generalStutas
                if (stutas && item.alarmStatus == 0) {
                  item.alarmStatus = 1
                }
                obj.alarmStatus = item.alarmStatus
                obj.t_root = item.t_root
                obj = this.getAlarmStatus(obj, item.alarmStatus)
                if (item.running_status !== undefined) {
                  /*  */
                  obj.running_status = this.setRunstation(item.running_status)
                }
                obj.dgm_id = item.dgm_id
                obj.isShow = true //控制是否显示
                obj.t_id = item.t_id
                obj.mac_id = item.mac_id
                obj.isFocus = item.isFocus ? true : false
                obj.name = item.mac_me
                obj.speed = item.speed < 100000000 ? round(item.speed, 2) : 0
                obj.fullTName = item.fullTName
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
              this.selmacList = params.selmacList
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
    setRunstation(status) {
      let val
      switch (status) {
        case 0: //'未接入'
          val = this.$t('YtFocus.runStatus1')
          break
        case 1: //'运行'
          val = this.$t('YtFocus.runStatus2')
          break
        case 2: //'停机'
          val = this.$t('YtFocus.runStatus3')
          break
      }
      return val
    },
  },
  watch: {
    '$store.state.ytFocusMsg': {
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
    macList(val) {
      const params = this.focus[this.currentKey]
      params.groupMacList = {}
      val.forEach((item) => {
        if (params.groupMacList[item.fullTName] === undefined) {
          params.groupMacList[item.fullTName] = []
        }
        params.groupMacList[item.fullTName].push(item)
      })
    },
    selmacList(val) {
      const params = this.focus[this.currentKey]
      params.groupSelmacList = {}
      val.forEach((item) => {
        if (params.groupSelmacList[item.fullTName] === undefined) {
          params.groupSelmacList[item.fullTName] = []
        }
        params.groupSelmacList[item.fullTName].push(item)
      })
      this.$forceUpdate()
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
          margin-right: 25px;
          white-space: nowrap;
          overflow: hidden;
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
      grid-template-columns: 250px 250px 250px 250px 250px 250px;
      grid-row-gap: 28px;
      grid-column-gap: 28px;
      // grid-template-rows: 137px 137px 137px 137px 137px 137px;
      margin: 0px 15px;
      .view-content {
        width: 250px;
        height: 137px;
        background: #0c1858;
        border-radius: 4px;
      }
      //绿色正常
      .general-view-citem {
        border: 1px solid rgba(0, 154, 68, 0.9);
        box-shadow: 0px 0px 20px 1px rgba(0, 154, 68, 0.9) inset;
      }
      //橙色预警
      .general-view-citem-warning {
        border: 1px solid #ffa202;
        box-shadow: rgba(255, 162, 2, 0.9) 0px 0px 20px 1px inset;
      }
      //蓝色自检查异常
      .general-view-citem-abnormal {
        border: 1px solid #4276f6;
        box-shadow: rgba(65, 119, 254, 0.9) 0px 0px 20px 1px inset;
      }
      //红色报警
      .general-view-citem-alarm {
        border: 1px solid #f80000;
        box-shadow: rgba(248, 0, 0, 0.9) 0px 0px 20px 1px inset;
      }
      //离线
      .general-view-citem-offline {
        border: 1px solid #4674d6;
        box-shadow: rgba(6, 70, 168, 0.72) 0px 0px 20px 0px inset;
      }
      .general-view-ctitle {
        height: 37px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #4674d6;
        .general-view-f2 {
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #f2f6fa;
          text-align: center;
          cursor: pointer;
          width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .iconfont {
          position: relative;
          left: 23px;
          justify-content: flex-end;
          width: 19px;
          height: 19px;
          font-size: 19px;
          cursor: pointer;
        }
      }
      .general-view-ccontent {
        height: calc(100% - 37px);
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        .ccontent-imgs {
          width: 120px;
          text-align: center;
          .ccontent-img1 {
            width: 53px;
          }
        }
        .ccontent {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #f2f6fa;
          & > div {
            display: flex;
            margin: 2px;
            p {
              text-align-last: justify;
              width: 60px;
              margin-right: 10px;
            }
          }
        }
        .outline {
          color: #8593c7;
        }
      }
    }
  }
}
.focusColor {
  color: #00fdff;
}
.separator {
  margin: 15px;
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #0b4c90;
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
        grid-template-columns: 215px 215px 215px 215px 215px;
        grid-row-gap: 25px;
        grid-column-gap: 25px;
        margin: 0;
        // grid-template-rows: 137px 137px 137px 137px 137px 137px;
        .view-content {
          width: 215px;
          height: 137px;
          background: #0c1858;
          border-radius: 4px;
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
