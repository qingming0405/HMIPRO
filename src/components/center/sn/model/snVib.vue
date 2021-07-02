<template>
  <!-- 传动链 -->
  <div class="drivechain-model">
    <div
      class="drivechain-line1"
      v-for="(param,key) in snVib"
      v-show="param.isShow"
    >
      <div class="drivechain-line1-box1 Model-box">
        <!-- 测点列表 -->
        <div class="Model-header">{{$t('SnModel.titleBtn2')}}</div>
        <table class="model-table">
          <tbody class="my-table-tbody pro-scrollbar">
            <tr v-for="(item, index) in param.mainbearData.public" class="model-tr" @click="toReal(item)">
              <td
                class="model-td"
                :title="item.pos_name"
              >
                <div
                  v-show="item.alarm_status == 0"
                  class="pos-state state-offline"
                ></div>
                <div
                  v-show="item.alarm_status == 1"
                  class="pos-state"
                ></div>
                <div
                  v-show="item.alarm_status == 2"
                  class="pos-state state-warn"
                ></div>
                <div
                  v-show="item.alarm_status == 3"
                  class="pos-state state-alarm"
                ></div>
                <div>{{ item.pos_name }}</div>
              </td>
              <td v-if="item.eigenvalue.value != noDataText">
                {{ item.eigenvalue.name }}:{{ item.eigenvalue.value
                }}{{ item.eigenvalue.unit }}
              </td>
              <td v-else="item.eigenvalue.value != noDataText">
                {{ item.eigenvalue.name }}:{{ item.eigenvalue.value
                }}
              </td>
              <td
                class="model-td3"
              >{{$t('Common.moreText')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="drivechain-line1-box2 Model-box">
        <!-- 数字孪生 -->
        <div class="Model-header">{{$t('TyVib.tableTitle2')}}</div>
        <div
          id="container"
          :class="'container'+key"
        ></div>
        <!-- 模型 -->
      </div>
    </div>
  </div>
</template>
<script>
import vib from 'common/general/sn/model/vib.js'
export default {
  mixins: [vib],
  data() {
    return { 
      noDataText:'无数据',
    }
  },
  created () {
    this.noDataText = this.$t('Common.noDataText')
  }
}
</script>
<style scoped lang="scss">
.drivechain-model {
  display: flex;
  flex-direction: column;
  height: 100%;
  .drivechain-line1 {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    height: 100%;
    .drivechain-line1-box1 {
      width: calc(33.3% - 14px);
      height: 100%;
      margin-right: 20px;
    }
    .drivechain-line1-box2 {
      width: calc(66.6% + 6px);
    }
  }
}

#container {
  height: calc(100% - 36px);
  width: 100%;
}
</style>
