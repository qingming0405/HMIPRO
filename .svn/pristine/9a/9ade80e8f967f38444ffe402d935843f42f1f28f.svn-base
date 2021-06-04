<template>
  <!-- 塔筒 -->
  <div>
    <div
      class="towerd-model"
      v-for="(param,key) in snTowerdrum"
    >
      <div class="towerd-line1">
        <div class="towerd-line1-box1 Model-box">
          <div class="Model-header">{{param.towerDrumDataName[0]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr v-for="(item,index) in param.towerDrumData">
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
        <div class="towerd-line1-box2 Model-box">
          <div class="Model-header">{{param.towerDrumDataName[1]}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr v-for="(item,index) in param.basicsData">
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
      </div>
      <div class="towerd-line2 Model-box">
        <div class="Model-header"></div>
        <div class="model">
          <canvas
            :ref='"model"+key'
            class="dipmodel"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import towerdrum from 'common/general/sn/model/towerdrum.js'
export default {
  name: 'snTowerdrum',
  mixins: [towerdrum],
}
</script>

<style scoped lang="scss">
.towerd-model {
  display: flex;
  flex-direction: row;
  height: calc(100% - 20px);
  width: 100%;
  .towerd-line1 {
    width: calc(33.3% - 14px);
    height: 100%;
    margin-right: 20px;
    .towerd-line1-box1 {
      height: calc(50% - 10px);
      width: 100%;
      margin-bottom: 20px;
    }
    .towerd-line1-box2 {
      height: calc(50% - 10px);
      width: 100%;
    }
  }
  .towerd-line2 {
    height: 100%;
    width: calc(66.6% + 6px);
    .model {
      height: calc(100% - 35px);
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .dipmodel {
        height: 604px;
        width: 100%;
      }
      @media screen and (max-width: 1366px) {
        .dipmodel {
          height: 400px;
          width: 100%;
        }
      }
    }
  }
}
</style>