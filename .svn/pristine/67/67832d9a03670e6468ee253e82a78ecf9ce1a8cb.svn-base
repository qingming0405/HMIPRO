<template>
  <div>
    <div
      v-for="(param,key) in focus"
      v-show="param.isShow"
    >
      <div class="general-view">
        <div class="general-view-screen">
          <div class="view-screen-collect">
            <div class="view-screen-f">{{$t('FdFocus.filterText')}}:</div>
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
            <!-- <div class="view-screen">
            <div class="view-screen-f">组织:</div>
            <div
              class="select-box"
              @click="changeTreeType"
              :title="tree.val"
            >
              <input
                class="select-input"
                type="text"
                placeholder="搜索组织"
                v-model="tree.val"
              />
              <i class="iconfont icon-ai-arrow-down"></i>
            </div>
          </div> -->
            <div class="view-screen">
              <div class="view-screen-f">{{$t('FdFocus.macTitle')}}:</div>
              <div
                class="select-box"
                @click="changeMacType"
                :title="param.mac.val"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('FdFocus.searchMacText')"
                  v-model="param.mac.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('FdFocus.posTitle')}}:</div>
              <div
                class="select-box"
                @click="changePosType"
                :title="param.pos.val"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('FdFocus.searchPosText')"
                  v-model="param.pos.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('FdFocus.valTitle')}}:</div>
              <div
                class="select-box"
                @click="changeEigType"
              >
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('FdFocus.searchValText')"
                  v-model="param.eigen.val"
                  :title="param.eigen.val"
                />
                <i class="iconfont icon-zhongzi-zhankai"></i>
              </div>
            </div>
            <div class="view-screen">
              <div class="view-screen-f">{{$t('FdFocus.numTitle')}}:</div>
              <div class="select-box">
                <input
                  class="select-input"
                  type="text"
                  :placeholder="$t('FdFocus.numTitle')"
                  v-model="param.macSum"
                />
              </div>
            </div>
            <div>
              <button
                @click="MacSelecttimer(1)"
                class="pop-btn pop-btn-ok"
              >
                {{$t('FdFocus.sureText')}}
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
            v-show="param.ischeck && param.selmacList.length > 0"
            class="general-view-content"
            ref="general_screen"
          >
            <div
              v-for="(item, index) in param.selmacList"
              class="view-content"
              :ref="'view_content' + index"
              @click="choosemac(index, param.selmacList, 'view_content')"
              :class="{
              active: item.chooseflag,
              'general-view-citem': item.type === 1,
              'general-view-citem-warning': item.type === 2,
              'general-view-citem-abnormal': item.type === 6,
              'general-view-citem-alarm': item.type === 3,
              'general-view-citem-offline': item.type === 4,
            }"
              @dblclick="toMacModel(item, 'windModel')"
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
                    : 'icon-shoucang',
                ]"
                ></i>
              </div>
              <div class="general-view-ccontent">
                <div class="ccontent-imgs">
                  <!-- 转速为0时 -->
                  <img
                    v-if="item.speed === 0"
                    class="ccontent-img1"
                    src="~assets/images/fd/fan.png"
                  />
                  <!-- 转速非0时 -->
                  <img
                    v-else
                    class="ccontent-img1"
                    src="~assets/images/fd/fan.gif"
                  />
                  <img
                    class="ccontent-img2"
                    src="~assets/images/fd/fengdian.png"
                  />
                </div>
                <div class="ccontent">
                  <div>{{$t('FdFocus.statusText')}} {{ item.status }}</div>
                  <div>
                    {{$t('FdFocus.speedText')}}
                    <span v-if="item.speed !== undefined">{{ item.speed }}rpm</span>
                    <span v-else>0rpm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="param.macList.length && param.ischeck"
            class="separator"
          ></div>
          <!-- 收藏显示机组 -->
          <div>
            <div
              class="general-view-content"
              ref="general_collect"
            >
              <div
                v-for="(item, index) in param.macList"
                class="view-content"
                :ref="'view_contentt' + index"
                @click="choosemac(index, param.macList, 'view_contentt')"
                :class="{
                active: item.chooseflag,
                'general-view-citem': item.type === 1,
                'general-view-citem-warning': item.type === 2,
                'general-view-citem-abnormal': item.type === 6,
                'general-view-citem-alarm': item.type === 3,
                'general-view-citem-offline': item.type === 4,
              }"
                @dblclick="toMacModel(item, 'windModel')"
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
                      : 'icon-shoucang',
                  ]"
                  ></i>
                </div>
                <div class="general-view-ccontent">
                  <div class="ccontent-imgs">
                    <!-- 转速为0时 -->
                    <img
                      v-if="item.speed === 0"
                      class="ccontent-img1"
                      src="~assets/images/fd/fan.png"
                    />
                    <!-- 转速非0时 -->
                    <img
                      v-else
                      class="ccontent-img1"
                      src="~assets/images/fd/fan.gif"
                    />
                    <img
                      class="ccontent-img2"
                      src="~assets/images/fd/fengdian.png"
                    />
                  </div>
                  <div class="ccontent">
                    <div>{{$t('FdFocus.statusText')}} {{ item.status }}</div>
                    <div>
                      {{$t('FdFocus.speedText')}}
                      <span v-if="item.speed !== 0 || item.speed !== undefined">{{ item.speed }}rpm</span>
                      <span v-else>{{$t('FdFocus.noDataText')}}</span>
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
import { cloneObj, round, setHead, setPosMsg } from 'utils/utils.js'
import focus from 'common/general/focus.js'
export default {
  name: 'fdFocus',
  mixins: [focus],
  data() {
    return {
      eachRowNum: 6, //每一行的个数
    }
  },
  methods: {
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
                obj.speed = item.speed < 100000000 ? round(item.speed, 2) : 0
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
              // 若general_scroll可滚动且未滚到底部
              this.$nextTick(this.isShowDropdownIcon)
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
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdFocus',
    })
  },
  watch: {
    '$store.state.fdFocusMsg': {
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
    mac: {
      handler(newVal) {
        /* 机组改动就将测点清空 */
        this.pos.val = ''
        if (newVal.val.includes(',')) {
          this.checkList.text.forEach((el) => {
            el.isShow = true
          })
        } else {
          this.checkList.text.forEach((el) => {
            //如果有子组织（暂时不考虑）
            if (!this.matchPinyin(el.val, newVal.val)) {
              el.isShow = false
            } else {
              el.isShow = true
            }
          })
        }
      },
      deep: true,
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
    .general-view-content {
      display: grid;
      // height: calc(100vh - 302px);
      grid-template-columns: repeat(auto-fill, 250px);
      grid-row-gap: 40px;
      grid-column-gap: 28px;
      grid-template-rows: repeat(auto-fill, 137px);
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
          display: flex;
          flex-direction: column;
          .ccontent-img1 {
            position: relative;
            left: 41px;
            top: 16px;
            width: 27px;
            height: 61px;
          }
          .ccontent-img2 {
            position: relative;
            bottom: 11px;
            left: 8px;
            width: 110px;
            height: 36px;
          }
        }
        .ccontent {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #f2f6fa;
          div {
            margin: 8px 12px;
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
      .general-view-content {
        display: grid;
        // height: calc(100vh - 302px);
        grid-template-columns: 215px 215px 215px 215px 215px;
        grid-row-gap: 40px;
        grid-column-gap: 25px;
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
