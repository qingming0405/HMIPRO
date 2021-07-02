<template>
  <div>
    <div
      v-for="(param,key) in general"
      v-show="param.isShow"
      style="height:100%"
    >
      <div class="general-search">
        <input
          type="text"
          v-model="searchKey"
          :placeholder="$t('Common.searchHolder')"
        />
        <i class="iconfont icon-sousuo"></i>
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
          <div
            class="general-view-content"
            ref="general_content"
            v-resize="resize"
          >
            <div
              v-for="(item, index) in param.searchmac"
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
              @dblclick="toMacModel(item, 'tyModel')"
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
                    class="ccontent-img3"
                    src="~assets/images/ty/ty.png"
                  />
                </div>
                <div class="ty-ccontent">
                  <div>{{$t('FdGeneral.statusText')}} {{ item.status }}</div>
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
import { round, cloneObj } from 'utils/utils.js'
import general from 'common/general/general.js'
export default {
  name: 'tyGeneral',
  mixins: [general],
  data() {
    return {
      t_root: -1,
    }
  },
  watch: {
    '$store.state.tyGeneralMsg': {
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
      keepAlive: 'tyGeneral',
    })
  },

  methods: {
    /* 处理请求来的数据 */
    setMacData(res) {
      const param = this.general[this.currentKey]
      param.macList = []
      let focusNum = 0
      res.machines.forEach((item) => {
        let obj = {}
        obj.chooseflag = false //是否选中
        obj.isShow = true //控制是否显示
        obj.dgm_id = item.dgm_id
        obj.t_id = item.t_id
        obj.mac_id = item.mac_id
        obj.m_me = item.mac_me
        let pumps = item.pumps
        let alarmStatus
        if (pumps && pumps.length) {
          pumps.forEach((pump) => {
            obj.pump_name = pump.pump_name
            obj.pump_id = pump.pump_id
            obj.name = pump.pump_name
            obj.alarmStatus = pump.alarmStatus
            obj.isFocus = pump.isFocus ? true : false
            if (obj.isFocus === 1) {
              focusNum++
            }
            alarmStatus = pump.alarmStatus
            alarmStatus || (alarmStatus = 0)
            switch (alarmStatus) {
              case 0: //离线
                obj.status = this.$t('Common.offlineText')
                obj.type = 4
                break
              case 1: //正常
                obj.status = this.$t('Common.normalText')
                obj.type = 1
                break
              case 2: //预警
                obj.status = this.$t('Common.warnText')
                obj.type = 2
                break
              case 3: //报警
                obj.status = this.$t('Common.alarmText')
                obj.type = 3
                break
            }
            param.macList.push(cloneObj(obj, true))
          })
        }
      })
      param.itemize[0].number = param.macList.length //全部
      param.itemize[1].number = res.normal //正常
      param.itemize[2].number = res.h //预警
      param.itemize[3].number = res.hhh //Ⅱ级报警
      param.itemize[4].number = res.offLine //离线
      param.itemize[5].number = res.focus //关注
      param.searchmac.sort(this.compareByMacName)
      /* 设置状态的数组 */
      // this.setTitleTips(res, focusNum)
    },
    //点击收藏
    collection(item) {
      let requestData = {
        t_id: item.t_id,
        mac_id: item.mac_id,
        t_root: this.t_root,
        id: item.pump_id,
        isFocus: item.isFocus ? 0 : 1,
      }
      this.$getApi.updateHmiFoucsStatus(requestData).then((res) => {
        item.isFocus = !item.isFocus
        if (res) {
          /* 收藏成功 */
          this.itemize.forEach((item1) => {
            if (item1.name === this.$t('Common.focausText')) {
              //关注
              if (item.isFocus) {
                item1.number++
              } else {
                item1.number--
              }
            }
          })
        } else {
          item.isFocus = !item.isFocus
          this.$pop(this.$t('Common.failTips')) //操作失败
        }
      })
    },
    //双击进入mac的model页
    toMacModel(item, toPage) {
      let macArray = this.$store.state.mac[item.t_id]
      let choosemac = this.$store.state.checkMsg.mac
      let choosetree = cloneObj(this.$store.state.checkMsg.tree)
      // 使用线程防止组织测点为重选就进行了跳转
      new Promise((resolve, reject) => {
        if (choosemac !== null && choosemac.pump_id == item.pump_id) {
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
            if (macArray[i].pump_id == item.pump_id) {
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
        this.$bus.$emit(
          'generalRouting',
          toPage,
          this.$t('YtModel.macModel'), //'设备模型',
          'icon-shijingsanwei-'
        )
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/style/css/fd.scss';
</style>
