<template>
  <!-- 传动链 -->
  <div class="drivechain-model">
    <div class="drivechain-line1">
      <div class="drivechain-line1-box1 Model-box">
        <div class="Model-header">测点列表</div>
        <table class="model-table">
          <tbody class="my-table-tbody pro-scrollbar">
            <tr v-for="(item, index) in mainbearData.public">
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
              <td>
                {{ item.eigenvalue.name }}:{{ item.value
                }}{{ item.eigenvalue.unit }}
              </td>
              <td
                class="model-td3"
                @click="toReal(item)"
              >详情</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="drivechain-line1-box2 Model-box">
        <div class="Model-header">数字孪生</div>
        <div id="container"></div>
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
    return {}
  },
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
