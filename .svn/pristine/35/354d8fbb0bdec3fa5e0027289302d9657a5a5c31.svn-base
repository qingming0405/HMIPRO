<template>
  <!-- 油液 -->
  <div class="oil-model">
    <div class="oil-model-box1 Model-box">
      <div class="Model-header">测点列表 </div>
      <table class="model-table">
        <tbody class="my-table-tbody pro-scrollbar">
          <tr v-for="(item,index) in oilData">
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
              <div>{{item.pos_name}}</div>
            </td>
            <td v-if="item.eigenvalue.value !== '无数据'">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
            <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
            <td
              class="model-td3"
              @click="toReal(item)"
            >详情</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="oil-model-box2 Model-box">
      <div class="Model-header"></div>
      <div class="Model-content">
        <img
          class="modelimg"
          src="~assets/images/fd/oilmodel.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import oil from 'common/general/sn/model/oil.js'
export default {
  name: 'hgOil',
  mixins: [oil],
}
</script>
<style scoped lang="scss">
.oil-model {
  display: flex;
  flex-direction: row;
  height: calc(100% - 20px);
  .oil-model-box1 {
    height: 100%;
    width: calc(33.3% - 14px);
    margin-right: 20px;
  }
  .oil-model-box2 {
    height: 100%;
    width: calc(66.6% + 6px);
    .Model-content {
      height: calc(100% - 36px);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelimg {
        width: 992px;
        height: 295px;
      }
      @media screen and (max-width: 1366px) {
        .modelimg {
          height: 209px;
          width: 704px;
        }
      }
    }
  }
}
</style>
