<template>
  <div>
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
            v-for="(item, index) in itemize"
            @click="filterByStatus(item)"
          >
            {{ item.name }} {{ item.number }}
          </a>
        </div>
      </div>
      <div class="line"></div>
      <div
        class="general-scroll"
        ref="general_scroll"
      >
        <div
          class="general-view-content"
          ref="general_content"
          v-resize="resize"
        >
          <div
            v-for="(item, index) in searchmac"
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
            v-show="downShow"
            class="paging-img"
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
  name: 'tyGeneral',
  mixins: [general],
  data() {
    return {
      t_root: -1,
    }
  },

  methods: {
    /* 处理请求来的数据 */
    setMacData(res) {
      this.macList = []
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
        if (pumps.length) {
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
              case 0://离线
                obj.status = this.$t('Common.offlineText')
                obj.type = 4
                break
              case 1://正常
                obj.status = this.$t('Common.normalText')
                obj.type = 1
                break
              case 2://预警
                obj.status = this.$t('Common.warnText')
                obj.type = 2
                break
              case 3://报警
                obj.status = this.$t('Common.alarmText')
                obj.type = 3
                break
            }
            this.macList.push(cloneObj(obj, true))
          })
        }
      })
      this.itemize[0].number = this.macList.length //全部
      this.itemize[1].number = res.h //预警
      this.itemize[2].number = res.normal //正常
      this.itemize[3].number = res.hhh //Ⅱ级报警
      this.itemize[4].number = res.offLine //离线
      this.itemize[5].number = res.focus //关注
      this.searchmac.sort(this.compareByMacName)
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
            if (item1.name === '关注') {
              if (item.isFocus) {
                item1.number++
              } else {
                item1.number--
              }
            }
          })
        } else {
          item.isFocus = !item.isFocus
          this.$pop(this.$t('Common.failTips'));//操作失败
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/style/css/fd.scss';
</style>
