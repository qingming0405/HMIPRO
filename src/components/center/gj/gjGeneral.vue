<template>
  <div id="train">
    <div
      v-for="(param,key) in general"
      v-show="param.isShow"
      style="height:100%"
    >
      <div class="title-text">{{param.title}}</div>
      <div class="general-search">
        <input
          type="text"
          v-model="searchKey"
          :placeholder="$t('GjGeneral.searchHolder')"
        />
        <i class="iconfont icon-sousuo"></i>
      </div>
      <div class="general-view-title">
        <div class="general-view-itemize">
          <a
            class="general-view-item"
            :class="{'active':item.chooseflag}"
            v-for="(item,index) in param.itemize"
            @click="!param.isShowTree?filterByStatus(item):filterTreeByStatus(item)"
            v-show="(param.isShowTree && item.name !== '关注') || !param.isShowTree"
          >
            {{item.name}} {{item.number}}
          </a>
        </div>
      </div>
      <div class="general-view">
        <div class="line"></div>
        <div
          class="general-scroll"
          :ref='"general_scroll" +key'
        >
          <div
            class="general-view-content"
            ref="general_content"
            v-resize="resize"
            v-show="!param.isShowTree"
          >
            <div
              v-for="(item,index) in param.searchmac"
              class="view-content "
              @click="choosemac"
              @dblclick.prevent="toMacModel(item)"
              :class="{'general-view-citem':item.status==='正常', 'general-view-citem-warning':item.status==='预警','general-view-citem-alarm1':item.status==='Ⅰ级报警','general-view-citem-alarm2':item.status==='Ⅱ级报警','general-view-citem-abnormal':item.status==='自检异常','general-view-citem-offline':item.status==='离线',}"
              v-show="item.isShow"
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
                  :class='["iconfont",
                item.isFocus
                ? "icon-mianxing_fuzhi_huaban1 focusColor"
                : "icon-shoucang"
                ]'
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
          <div
            class="general-view-content"
            ref="general_content"
            v-resize="resize"
            v-show="param.isShowTree"
          >
            <div
              v-for="(item,index) in param.treeData"
              class="view-content "
              @click="choosemac"
              @dblclick.prevent="changeTree(item)"
              :class="{'general-view-citem':item.status==='正常', 'general-view-citem-warning':item.status==='预警','general-view-citem-alarm1':item.status==='Ⅰ级报警','general-view-citem-alarm2':item.status==='Ⅱ级报警','general-view-citem-abnormal':item.status==='自检异常','general-view-citem-offline':item.status==='离线',}"
              v-show="item.isShow"
            >
              <div class="general-view-ctitle">

                <div
                  :class='["general-view-f2",item.dgm_type == 3 && item.t_root == 2 ?"general-view-f3"
                : ""
                ]'
                  :title="item.name"
                >{{item.name}}</div>
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

        <!-- 分页 -->
        <div
          class="general-view-page"
          v-show="param.downShow"
        >
          <div
            class="paging-img"
            @click="turnPage"
          ></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { round, cloneObj } from 'utils/utils.js'
import general from 'common/general/general.js'
export default {
  name: 'gjGeneral',
  mixins: [general],
  data() {
    return {
      itemize: [
        { name: '全部', number: 0, type: 0, chooseflag: true },
        { name: '正常', number: 0, type: 1, chooseflag: false },
        { name: 'Ⅱ级报警', number: 0, type: 2, chooseflag: false },
        { name: 'Ⅰ级报警', number: 0, type: 3, chooseflag: false },
        { name: '预警', number: 0, type: 4, chooseflag: false },
        { name: '离线', number: 0, type: 5, chooseflag: false },
        { name: '关注', number: 0, type: 6, chooseflag: false },
      ],
      chooseTid: 1, //所选组织id
      treeList: [
        //组织下拉列表
        { t_id: 1, t_name: '1号线' },
        { t_id: 2, t_name: '2号线' },
        { t_id: 3, t_name: '3号线' },
        { t_id: 4, t_name: '4号线' },
      ],
      t_root: 2,
      gdmodelImg: require('assets/images/gj/train.png'),
      isRequstDown: true,
      isDataRight: true, //请求机组数据时点击收藏会出现数据错误显现，标识是否会存在数据错误
    }
  },
  mounted() {
    let gjModelflag = config.gjModel
    if (gjModelflag == 1) {
      this.gdmodelImg = require('assets/images/gj/train1.png')
    }
  },
  watch: {
    '$store.state.gjGeneralMsg': {
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
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'gjGeneral',
    })
  },
  methods: {
    // 获取当前组织下的机组
    getMacData(requestData) {
      const param = this.general[this.currentKey]
      if (param.isRequstDown) {
        param.isRequstDown = false
        this.$getApi.queryAllMachineByTid(requestData).then((res) => {
          param.isRequstDown = true
          if (res) {
            if (param.isDataRight) {
              this.setMacData(res)
              let status
              param.itemize.forEach((item) => {
                //目前筛选状态
                if (item.chooseflag == true) {
                  status = item.type
                }
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
              param.searchmac = cloneObj(this.getStatus(status)).sort(compare)
              //刷新时查询是否存在内容
              if (this.searchKey != '') {
                this.searchByPinyin(this.searchKey)
              }
              // 若general_scroll可滚动且未滚到底部
              this.$nextTick(param.isShowDropdownIcon)
            } else {
              clearInterval(this.timer[this.currentKey])
              let fn = () => {
                this.getMacData(requestData)
                return fn
              }
              this.timer[this.currentKey] = setInterval(fn(), 6000)
              param.isDataRight = true
            }
          }
        })
      }
    },
    setMacData(res) {
      const param = this.general[this.currentKey]
      if (!param.isShowTree) {
        param.macList = res.machines
        param.itemize[0].number = this.macList.length //全部
        param.itemize[1].number = res.normal //正常
        let stutas = config.generalStutas
        if (stutas) {
          param.itemize[1].number = 0
        }
        param.itemize[2].number = res.hhh //Ⅱ级报警
        param.itemize[3].number = res.hh //Ⅰ级报警
        param.itemize[4].number = res.h //预警
        param.itemize[5].number = 0 //离线
        param.itemize[6].number = res.focus //关注
        param.macList.forEach((item) => {
          item.isShow = true //控制是否显示
          item.isShow = true //是否选中
          item.isFocus = item.isFocus ? true : false
          if (item.isFocus === 1) {
            focusNum++
          }
          let stutas = config.generalStutas
          if (stutas && item.alarmStatus == 0) {
            item.alarmStatus = 1
          }
          switch (item.alarmStatus) {
            case 0:
              item.status = '离线'
              param.itemize[5].number++
              break
            case 1:
              item.status = '正常'
              if (stutas) {
                param.itemize[1].number++
              }
              break
            case 2:
              item.status = '预警'
              break
            case 3:
              item.status = 'Ⅰ级报警'
              break
            case 4:
              item.status = 'Ⅱ级报警'
              break
          }
          item.name = item.mac_me
          if (item.dgm_type == 3 && item.t_root == 2) {
            item.name = `${item.t_name}-${item.mac_me}`
          }

          item.m_me = item.mac_me
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
        param.macList.sort(compare)
      } else {
        param.treeStatus = {}
        res.machines.forEach((item) => {
          if (param.treeStatus[item.t_id] === undefined) {
            param.treeStatus[item.t_id] = item.alarmStatus
          } else if (param.treeStatus[item.t_id] < item.alarmStatus) {
            param.treeStatus[item.t_id] = item.alarmStatus
          }
        })
        param.itemize[0].number = param.tree.length //全部
        param.itemize[1].number = 0 //正常
        param.itemize[2].number = 0 //Ⅱ级报警
        param.itemize[3].number = 0 //Ⅰ级报警
        param.itemize[4].number = 0 //预警
        param.itemize[5].number = 0 //离线
        let tree = param.tree
        tree.forEach((item) => {
          item.isShow = true //控制是否显示
          item.isShow = true //是否选中
          item.alarmStatus = param.treeStatus[item.t_id]
          let stutas = config.generalStutas
          if (stutas && item.alarmStatus == 0) {
            item.alarmStatus = 1
          }
          switch (item.alarmStatus) {
            case 0:
              item.status = '离线'
              param.itemize[5].number++
              break
            case 1:
              item.status = '正常'
              param.itemize[1].number++
              break
            case 2:
              item.status = '预警'
              param.itemize[4].number++
              break
            case 3:
              item.status = 'Ⅰ级报警'
              param.itemize[3].number++
              break
            case 4:
              item.status = 'Ⅱ级报警'
              param.itemize[2].number++
              break
          }
        })
        let status
        param.itemize.forEach((item) => {
          //目前筛选状态
          if (item.chooseflag == true) {
            status = item.type
          }
        })
        param.treeData = this.getTreeStatus(status)
        if (param.searchKey != '') {
          this.searchTreeByPinyin(param.searchKey)
        }
      }
    },
    getTreeStatus(status) {
      const param = this.general[this.currentKey]
      let filterTreeList = []
      param.tree.forEach((item) => {
        switch (status) {
          case 0:
            item.isShow = true
            break
          case 1:
            if (item.alarmStatus === 1) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 2:
            if (item.alarmStatus === 4) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 3:
            if (item.alarmStatus === 3) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 4:
            if (item.alarmStatus === 2) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 5:
            if (item.status == '离线') {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 6:
            if (item.isFocus) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
        }
        if (item.isShow) filterTreeList.push(item)
      })
      return filterTreeList
    },
    // 航海车辆筛选
    filterTreeByStatus(title) {
      const param = this.general[this.currentKey]
      /* 根据状态筛选 */
      param.itemize.forEach((i) => {
        i.chooseflag = false
      })
      title.chooseflag = true
      let status = title.type
      param.treeData = this.getTreeStatus(status)
      //刷新时查询是否存在内容
      if (param.searchKey != '') {
        let data = param.treeData
        let searchFiled = {
          name: data.name,
        }
        param.treeData.forEach((el) => {
          //如果有子组织（暂时不考虑）
          if (
            !this.matchPinyin(el.name, param.searchKey) &&
            el.isShow == true
          ) {
            el.isShow = false
          } else {
            el.isShow = true
          }
        })
      }
      // 若general_scroll可滚动且未滚到底部
      param.downShow = false
      this.$nextTick(() => {
        let dom = this.$refs.general_scroll
        dom.scrollTop = 0
        if (
          dom.scrollHeight > dom.clientHeight &&
          dom.scrollHeight - dom.scrollTop - dom.clientHeight > 10
        ) {
          param.downShow = true
        }
      })
    },
    // 航海时选择车辆
    changeTree(item) {
      console.log(item)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        this.$store.commit('getCheckMsg', {
          msg: cloneObj(item),
          type: 'tree',
        })
        resolve('成功')
      }).then(() => {
        this.$bus.$emit('generalRouting', 'gjGeneral', '总貌图', 'icon-shouye1')
      })
      return
    },
    //双击进入mac的model页
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
      let choosemac = cloneObj(this.$store.state.checkMsg.mac)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.pump_id == pump_id) {
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
          // 取机组
          this.$store.commit('getCheckMsg', {
            msg: cloneObj(mac),
            type: 'mac',
          })
          resolve('成功')
        }
      }).then(() => {
        /* 设置当前的机组 */
        this.$bus.$emit(
          'generalRouting',
          'gjModel',
          '设备模型',
          'icon-shijingsanwei-'
        )
      })
    },
    getStatus(status) {
      const param = this.general[this.currentKey]
      let filterMacList = []
      param.macList.forEach((item) => {
        switch (status) {
          case 0:
            item.isShow = true
            break
          case 1:
            if (item.alarmStatus === 1) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 2:
            if (item.alarmStatus === 4) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 3:
            if (item.alarmStatus === 3) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 4:
            if (item.alarmStatus === 2) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 5:
            if (item.status == '离线') {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
          case 6:
            if (item.isFocus) {
              item.isShow = true
            } else {
              item.isShow = false
            }
            break
        }
        if (item.isShow) filterMacList.push(item)
      })
      return filterMacList
    },
    /* 更具拼音来筛选 */
    searchTreeByPinyin(val) {
      const param = this.general[this.currentKey]
      if (val) {
        param.treeData.forEach((item) => {
          if (this.pinyin.match(item.name, val)) {
            item.isShow = true
          } else {
            item.isShow = false
          }
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
#train {
  .general-view-title {
    /*width: calc(100% - 275px);*/
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
        justify-content: space-around;
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
  .general-view {
    display: flex;
    flex-direction: column;
    margin-top: 80px;
    height: calc(100% - 50px);
    // margin: 60px 15px 0 15px;
    .line {
      width: 100%;
      height: 1px;
      background: #4674d6;
    }
    .focus-filter {
      width: calc(100% - 30px);
      margin: 15px 15px 0 15px;
      .focus-filter-div {
        float: right;
      }
      .select-label {
        font-size: 12px;
        vertical-align: middle;
      }
      .select {
        vertical-align: middle;
        width: 150px;
        height: 22px;
        background: rgba(0, 126, 255, 0.4);
        color: #fff;
        border: none;
      }
      .option {
        background: rgba(0, 126, 255, 0.4);
        color: #fff;
        border: none;
      }
    }
    .general-scroll::-webkit-scrollbar {
      display: none;
    }
    .general-scroll {
      /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
      -ms-overflow-style: none;
      /*火狐下隐藏滚动条*/
      scrollbar-width: none;
      overflow-y: auto;
      height: calc(100% - 87px);
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
        margin: 30px 15px 0px 15px;
        .view-content {
          width: 250px;
          height: 137px;
          background: #0c1858;
          border-radius: 4px;
        }
        //绿色正常
        .general-view-citem {
          border: 1px solid rgba(0, 154, 68, 0.8);
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
    .general-view-title .general-view-itemize .general-view-item {
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
      .general-scroll {
        /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
        -ms-overflow-style: none;
        /*火狐下隐藏滚动条*/
        scrollbar-width: none;
        flex: 1;
        overflow-y: auto;
        height: calc(100vh - 222px);
        margin-top: 12px;

        .general-view-content {
          display: grid;
          grid-template-columns: repeat(auto-fill, 215px);
          grid-row-gap: 40px;
          grid-column-gap: 25px;
          // grid-template-rows: 137px 137px 137px 137px 137px 137px 137px 137px;
          grid-template-rows: repeat(auto-fill, 137px);
          margin: 30px 0 15px 0;
          padding-bottom: 15px;

          .view-content {
            width: 215px;
            height: 137px;
            background: #0c1858;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          .general-view-ctitle .general-view-f2 {
            width: 120px;
          }
          .general-view-ccontent .ccontent div {
            margin: 12px;
            width: 90px;
          }
          .general-view-ccontent .ccontent-img {
            width: 110px;
            height: 36px;
            margin-left: 10px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .general-view-title .general-view-itemize .general-view-item {
      margin: 0 10px;
      width: 100px;
      height: 50px;
      font-size: 14px;
    }
    .general-search input {
      width: 160px;
    }
  }
}
</style>
