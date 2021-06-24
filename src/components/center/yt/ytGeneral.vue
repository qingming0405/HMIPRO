<template>
  <div>
    <div
      v-for="(param,key) in general"
      v-show="param.isShow"
      style="height:100%"
    >
      <div class="general-search">
        <!-- <input
        type="text"
        v-model="searchKey"
        placeholder="请输入查询文字"
      />
      <i class="iconfont icon-sousuo"></i> -->
      </div>
      <div class="general-view">
        <div class="general-view-title">
          <div class="general-view-itemize">
            <a
              class="general-view-item"
              :class="{ active: item.chooseflag }"
              v-for="(item, index) in param.itemize"
              @click="filterByStatus(item)"
            >
              {{ item.name }} {{ item.number }}
            </a>
          </div>
        </div>
        <div class="line"></div>
        <div
          class="general-scroll"
          :ref='"general_scroll" +key'
        >
          <div v-for="(group, groupkey) in param.mac_group">
            <div class="general-view-content-grout-title">{{ groupkey }}</div>
            <div
              class="general-view-content"
              ref="general_content"
              v-resize="resize"
            >
              <div
                v-for="(item, index) in group"
                class="view-content"
                @click="choosemac"
                :class="{
                active: item.chooseflag,
                'general-view-citem': item.type === 1,
                'general-view-citem-warning': item.type === 2,
                'general-view-citem-abnormal': item.type === 6,
                'general-view-citem-alarm': item.type === 3,
                'general-view-citem-offline': item.type === 4
              }"
                v-show="item.isShow"
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
                      <p>{{$t('YtGeneral.IDText')}}</p>
                      {{ item.dgm_id }}
                    </div>
                    <div>
                      <p>{{$t('YtGeneral.statusText')}}</p>
                      {{ item.running_status }}
                    </div>
                    <div>
                      <p>{{$t('YtGeneral.alarmText')}}</p>
                      {{ item.status }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <!-- v-show="pagecount === 1 && pagecount<pagesum" -->
        <div class="general-view-page">
          <div
            class="pageimg-f"
            @click="turnPage"
          >
            <div
              v-show="param.downShow"
              class="paging-img"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sortMachine } from 'utils/utils.js'
import general from 'common/general/general.js'
export default {
  name: 'ytGeneral',
  mixins: [general],
  data() {
    return {
      t_root: 3,
      mac_group: {},
    }
  },
  computed: {
    generalsearchmac() {
      if (this.general[this.currentKey]) {
        return this.general[this.currentKey].searchmac
      }
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'ytGeneral',
    })
    // this.$watch(
    //   function () {
    //     // 第一个函数就是处理你要监听的属性，只要将其return出去就行
    //     return this.general[this.currentKey].searchmac
    //   },
    //   function (val) {
    //     const param = this.general[this.currentKey]
    //     if (param) {
    //       param.mac_group = {}
    //       val.forEach((item) => {
    //         if (param.mac_group[item.fullTName] === undefined) {
    //           param.mac_group[item.fullTName] = []
    //         }
    //         /* 匹配下拼音 */
    //         // if (this.searchKey != "") {
    //         if (this.pinyin.match(item.name, this.searchKey)) {
    //           item.isShow = true
    //         } else {
    //           item.isShow = false
    //         }
    //         // }
    //         param.mac_group[item.fullTName].push(item)
    //       })
    //     }
    //   }
    // )
  },
  methods: {
    getMacData(requestData) {
      const param = this.general[this.currentKey]
      let generalRouter = ['ytGeneral']
      if (
        this.$store.state.chooseTitle &&
        generalRouter.indexOf(this.$store.state.chooseTitle.name) !== -1
      ) {
        this.$getApi.queryAllMachineByTid(requestData).then((res) => {
          if (res) {
            this.setMacData(res)
            let status
            param.itemize.forEach((item) => {
              //目前筛选状态
              if (item.chooseflag == true) {
                status = item.type
              }
            })
            param.searchmac = sortMachine(this.getStatus(status))
            // 若general_scroll可滚动且未滚到底部
            this.$nextTick(param.isShowDropdownIcon)
          }
        })
      }
    },
    /* 更具头部标签来筛选应该显示的机组 */
    getStatus(status) {
      const param = this.general[this.currentKey]
      let filterMacList = []
      param.macList.forEach((item) => {
        switch (status) {
          case 0:
            filterMacList.push(item)
            break
          case 1:
            if (item.alarmStatus === 1) {
              filterMacList.push(item)
            }
            break
          case 2:
            if (item.alarmStatus === 2) {
              filterMacList.push(item)
            }
            break
          case 3:
            if (item.alarmStatus === 3) {
              filterMacList.push(item)
            }
            break
          case 4:
            if (item.alarmStatus === 0) {
              filterMacList.push(item)
            }
            break
          case 5:
            if (item.isFocus) {
              filterMacList.push(item)
            }
            break
        }
      })
      /* 需要根据组织来分组 */
      return filterMacList
    },
    searchByPinyin(val) {
      const param = this.general[this.currentKey]
      for (let group in param.mac_group) {
        param.mac_group[group].forEach((item) => {
          if (this.pinyin.match(item.name, val)) {
            item.isShow = true
          } else {
            item.isShow = false
          }
        })
      }
    },
  },
  /* 需要在风电的基础上 再分组 */
  watch: {
    '$store.state.ytGeneralMsg': {
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
    generalsearchmac: {
      handler(val) {
        const param = this.general[this.currentKey]
        if (param) {
          param.mac_group = {}
          let mac_group = {}
          val.forEach((item) => {
            if (mac_group[item.fullTName] === undefined) {
              mac_group[item.fullTName] = []
            }
            /* 匹配下拼音 */
            if (this.pinyin.match(item.name, this.searchKey)) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            mac_group[item.fullTName].push(item)
          })
          this.$set(param, 'mac_group', mac_group)
          this.$forceUpdate()
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
  margin-top: 70px;
  height: calc(100% - 50px);
  .line {
    width: calc(100% - 30px);
    height: 1px;
    background: #4674d6;
    margin: 10px auto 0;
  }
  .general-view-title {
    width: calc(100% - 275px);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    top: 70px;
    right: 0;
    margin: 0px 35px;
    /*border-bottom: 1px solid #4674d6;*/
    padding: 20px 0;
    .general-view-itemize {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      .general-view-item::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        background: #0c1858;
        border: 1px solid #4674d6;
        box-shadow: 1px 6px 6px 1px #005fc0,
          0px 0px 29px 0px rgba(6, 70, 168, 0.72);
        transform: skewX(45deg);
      }
      .general-view-item {
        margin: 0 20px;
        width: 130px;
        height: 50px;
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-decoration: none;
        z-index: 1;
        cursor: pointer;
        &.active::before {
          border: 1px solid #00fbf9;
        }
      }
    }
    .general-view-f1 {
      width: 100px;
      height: 29px;
      font-size: 30px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      line-height: 30px;
    }
  }
  .general-scroll::-webkit-scrollbar {
    display: none;
  }
  .general-scroll {
    overflow-y: auto;
    height: calc(100% - 87px);
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style: none;
    /*火狐下隐藏滚动条*/
    scrollbar-width: none;
    .general-view-content-grout-title {
      margin: 15px 15px 8px 15px;
      font-size: 20px;
    }
    .general-view-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, 250px);
      grid-row-gap: 40px;
      grid-column-gap: 28px;
      // grid-template-rows: repeat(auto-fill, 100px);
      margin: 0 15px;
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
        cursor: pointer;
        .ccontent-imgs {
          width: 100px;
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
  .general-view-page {
    display: flex;
    justify-content: center;
    .pageimg-f {
      height: 75px;
      width: 47px;
      position: relative;
      .paging-img {
        position: absolute;
        bottom: -20px;
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
  }
}
.general-search {
  position: absolute;
  top: 9px;
  right: 170px;
  background: transparent;

  input {
    width: 260px;
    height: 32px;
    background: rgba(0, 126, 255, 0.3) !important;
    border-radius: 2px;
    border: none;
    padding-left: 10px;
  }

  .iconfont {
    width: 20px;
    height: 32px;
    position: relative;
    right: 30px;
  }

  input::-webkit-input-placeholder {
    color: #6eacec;
  }

  input::-moz-input-placeholder {
    color: #6eacec;
  }

  input::-ms-input-placeholder {
    color: #6eacec;
  }
}
@media screen and (max-width: 1366px) {
  .general-view .general-view-title .general-view-itemize .general-view-item {
    margin: 0 10px;
    width: 100px;
    height: 50px;
    font-size: 14px;
  }
  .general-search input {
    width: 160px;
  }
  .general-view {
    margin: 60px 0 0 0;
    height: 100%;
    .line {
      width: 100%;
      margin: 0 auto;
    }
    .general-scroll {
      flex: 1;
      overflow-y: auto;
      height: calc(100% - 100px);
      margin-top: 12px;
      .general-view-content {
        display: grid;
        grid-template-columns: 215px 215px 215px 215px 215px;
        grid-row-gap: 40px;
        grid-column-gap: 25px;
        // grid-template-rows: 137px 137px 137px 137px ;
        grid-template-rows: repeat(auto-fill, 137px);
        margin: 30px 0 15px 0;
        padding-bottom: 15px;
        .view-content {
          width: 215px;
          height: 137px;
          background: #0c1858;
          border-radius: 4px;
        }
        .general-view-ctitle .general-view-f2 {
          width: 120px;
        }
      }
    }
  }
}
</style>
