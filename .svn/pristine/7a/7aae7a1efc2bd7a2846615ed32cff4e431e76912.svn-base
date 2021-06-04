<template>
  <div>
    <div class="general-view-content">
      <div
        v-for="(item, index) in mac"
        class="view-content"
        :ref="'view_content' + index"
        @click="choosemac(index)"
        @dblclick="jumpToModel(item)"
        :class="{
          active: item.chooseflag,
          'general-view-citem': item.status == 1,
          'general-view-citem-warning': item.status == 2,
          'general-view-citem-alarm': item.status == 3,
          'general-view-citem-abnormal': item.status == '自检异常',
          'general-view-citem-offline': item.status == 0,
        }"
      >
        <div class="general-view-ctitle">
          <div class="general-view-f2">{{ item.name }}</div>
          <i
            @click="collection(item)"
            v-if="!item.isCollect"
            class="iconfont icon-shoucang"
          ></i>
          <i
            @click="collection(item)"
            v-else
            class="iconfont icon-mianxing_fuzhi_huaban1"
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
            <div>{{$t('FdGeneral.statusText')}} {{ statusValue[item.status] }}</div>
          </div>
        </div>
      </div>
      <div
        class="none-data-box select-none"
        v-show="noData.isShow"
      >
        <div>{{ noData.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneObj } from 'utils/utils.js'
export default {
  name: 'tyFocus',
  data() {
    return {
      statusValue: {
        0: this.$t('Common.offlineText'),//离线
        1: this.$t('Common.normalText'),//正常
        2: this.$t('Common.warnText'),//预警
        3: this.$t('Common.alarmText'),//报警
      },
      mac: [], //机泵信息存放
      noData: {
        isShow: true,
        text: this.$t('SnFocus.noFocusMacTips'),//'无重点关注机组',
      },
      timer: '', //定时器
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    // 跳转到设备模型
    jumpToModel(item) {
      /* 从vuex中获取当前机组 */
      let pump_id = item.msg.pump_id
      let t_id = item.t_id
      let macList = this.$store.state.mac[t_id]
      let mac
      let choosemac = this.$store.state.checkMsg.mac
      if (choosemac !== null) {
        if (choosemac.pump_id == pump_id) {
          this.$router.push('tyModel')
          return
        }
      }
      macList.forEach((item) => {
        if (item.pump_id === pump_id) {
          mac = item
          return
        }
      })
      this.$store.commit('getCheckMsg', {
        msg: cloneObj(mac),
        type: 'mac',
      })

      /* 设置当前的机组 */
      this.$router.push({
        name: 'tyModel',
      })
    },
    /*选中的机组 边框变色 */
    choosemac(index) {
      for (let i = 0; i < this.mac.length; i++) {
        if (index == i) {
          this.mac[i].chooseflag = true
        } else {
          this.mac[i].chooseflag = false
        }
      }
      for (let j = 0; j < this.mac.length; j++) {
        if (this.mac[j].chooseflag) {
          this.$refs[`view_content${j}`][0].style.border = '1px solid #00fcf9'
        } else {
          this.$refs[`view_content${j}`][0].style.border = ''
        }
      }
    },
    /* 收藏和取消收藏机组 */
    collection(item) {
      item.isCollect = !item.isCollect
      let requestData = {
        t_id: item.t_id,
        mac_id: item.msg.mac_id,
        t_root: 1,
        id: item.msg.pump_id,
        isFocus: item.isCollect ? 1 : 0,
      }
      this.$getApi.updateHmiFoucsStatus(requestData).then((res) => {
        if (res) {
          /* 收藏成功 */
        } else {
          item.isCheck = !item.isCheck
          this.$pop(this.$t('Common.quitCollectTips'))//取消收藏失败
        }
      })
    },
    /* 获取所有的收藏的机组 */
    getData(requestData) {
      this.$getApi.queryAllFocus(requestData).then((res) => {
        if (res) {
          this.mac = []
          if (res.data.length === 0) {
            /* 无机组 */
            this.noData.isShow = true
          } else {
            res.data.forEach((item) => {
              this.noData.isShow = false
              let obj = {}
              /*
                name:机泵名称
                t_id:
                imgSrc://图片地址
                speed:转速
                status: 0 离线 1 正常 2 预警 3 报警
                chooseflag:flase 是否被选中
                isCollect 是否被收藏
                msg: 机泵所有的信息
                */
              let time = this.$t('Common.noDataText');//无数据
              let desc = this.$t('Common.noDiagText');//暂无诊断结果
              /* 诊断报告 */
              if (item.result) {
                time = item.result.time
                desc = item.result.desc
              }
              if (item.overview) {
                obj.imgSrc = item.overview.bgurl
              } else {
                obj.imgSrc = require('assets/images/indexLogoBg2.png')
              }
              obj.name = item.pump.pump_name
              obj.t_id = item.t_id
              obj.speed =
                item.speed >= 100000000 ? this.$t('Common.noDataText') : item.speed + 'rpm'
              obj.status = item.alarm_status ? item.alarm_status : 0
              obj.isCollect = item.isFocus === 1 ? true : false
              obj.msg = item.pump
              obj.time = time
              obj.desc = desc
              this.mac.push(obj)
            })
          }
        }
      })
    },
  },
  watch: {
    /* 监听组织的变化 */
    '$store.state.checkMsg.tree': {
      handler(value, oldValue) {
        if (value) {
          if (oldValue && value.t_id === oldValue.t_id) return
          /* 获取参数 */
          let requestData = {
            t_id: value.t_id,
            t_root: value.t_root, //mac.baseInfo.ch_class
            needChild: 1,
          }
          clearInterval(this.timer)
          let fn = () => {
            this.getData(requestData)
            return fn
          }
          this.timer = setInterval(fn(), 6000)
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style scoped lang="scss">
.general-view-content {
  position: relative;
  padding-top: 50px;
  height: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 250px);
  grid-template-rows: repeat(auto-fill, 137px);
  grid-row-gap: 40px;
  grid-column-gap: 28px;
  margin: 30px 15px 0px 15px;
  @media screen and (max-width: 1366px) {
    grid-template-columns: repeat(auto-fill, 250px);
    grid-row-gap: 40px;
    grid-column-gap: 25px;
    // grid-template-rows: 137px 137px 137px 137px 137px 137px;
    margin: 30px 0 15px 0;
    padding-bottom: 15px;
  }

  flex-wrap: wrap;
  overflow-y: auto;
  .view-content {
    width: 250px;
    height: 137px;
    background: #0c1858;
    border-radius: 4px;
  }
  .general-view-ctitle {
    height: 37px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #4674d6;
    .general-view-f2 {
      height: 16px;
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #f2f6fa;
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
      .ccontent-img3 {
        position: relative;
        bottom: 0;
        left: 8px;
        width: 100px;
        height: 77px;
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
    .ty-ccontent {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #f2f6fa;
      div {
        margin: 8px 20px;
      }
    }
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
}
</style>
