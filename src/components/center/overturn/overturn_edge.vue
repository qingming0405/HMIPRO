<!-- 机舱轨迹图 -->
<template>
  <div class="my-overturn-chart">
    <div
      class="my-overturn"
      v-for="(data, key) in overturnData"
      :key="key"
      v-show="data.isShow"
    >
      <div class="view-data">{{ data.date }}</div>
      <!-- <div class="set-alarm-line select-none">
        <ul>
          <li v-for="(item, index) in data.alarmData" :key="index">
            <label :for="'show-alarm-' + index">
              <i :class="setIcon(item.isCheck)"></i>
              {{item.title}}
            </label>
            <input
              class="hide"
              type="checkbox"
              :id="'show-alarm-' + index"
              v-model="item.isCheck"
              @change="showAlarm"
            />
          </li>
        </ul>
      </div> -->
      <div
        class="trajectory-wave"
        :class="{ 'trajectory-wave1': data.viewTrend }"
      >
        <div :class="'radius box-shadow overtur-chart circle-chart' + key"></div>
        <div class="overturn-wave radius box-shadow">
          <div :class="'overtur-chart waveX-chart' + key"></div>
          <div :class="'overtur-chart waveY-chart' + key"></div>
        </div>
        <div
          class="overturn-trend radius box-shadow"
          v-show="data.viewTrend"
        >
          <i
            class="iconfont icon-cuohao"
            @click="closeTrend"
          ></i>
          <div :class="'overtur-chart trend-chart' + key"></div>
          <div
            class="none-data-box"
            v-show="data.isTrend"
          ><!-- 无数据 -->{{$t('Common.noDataText')}}</div>
        </div>
      </div>
      <div
        class="none-data-box select-none"
        v-show="data.noneData.isShow"
      >
        <div>{{ data.noneData.text }}</div>
      </div>
      <div class="search-data">
        <button
          :class="data.realBtn ? 'get-real-data' : 'no-real-date'"
          @click="getRealData(data.realBtn)"
        >
          <!-- 实时数据 -->{{$t('Common.realData')}}
        </button>
        <button @click="dataRetrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import com from './overturnCommon'
export default {
  // import引入的组件需要注入到对象中才能使用
  mixins: [com],
  data() {
    return {
      color: {
        /* 颜色设置 */
        axis: {
          /* 坐标轴 */
          name: '#fff' /* 标题 */,
          font: '#fff' /* 字体 */,
          line: '#fff' /* 坐标线 */,
          splitLine: '#fff' /* 分隔线 */,
        },
        series: {
          /* 图谱 */
          line: '#3D77FF' /* 谱线 */,
          symbol: '#fff' /* symbol */,
          point: '#000', //散点图点的颜色
        },
        tool: {
          symbol: '#ff9b21',
          line: '#ff9b21',
          font: '#fff',
          background: '#ff9b21',
        },
        background: '#fff' /* 背景颜色 */,
        isNewChart: true /* 是否为新打开图谱 */,
      },
      lineStyle: {
        // 样式
        color: '#fff', // 颜色，默认 '#0032ff'
      },
      fontStyle: {
        color: '#fff',
      },
    }
  },
}
</script>
<style scoped lang="scss">
.my-overturn-chart {
  position: relative;
  height: 100%;
  .my-overturn {
    height: calc(100% - 50px);
    width: 100%;
    position: relative;
    .view-data {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
    }
    .trajectory-wave {
      height: calc(100% - 40px);
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 5px));
      grid-column-gap: 10px;
      grid-template-rows: 100%;
      grid-row-gap: 10px;
      .overtur-chart {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .overturn-wave {
        display: grid;
        grid-template-rows: repeat(2, calc(50% - 0.5px)) !important;
      }
      .overturn-trend {
        width: 100%;
        height: 100%;
        grid-column-start: span 2;
      }
    }
    .trajectory-wave1 {
      grid-template-rows: 68% 25%;
    }
    .overturn-trend {
      height: 25%;
      margin-top: 10px;
      position: relative;
      .iconfont {
        font-size: 12px;
        position: absolute;
        right: 5px;
        top: 5px;
        z-index: 999;
      }
      .none-data-box {
        height: 100%;
      }
    }
    .set-alarm-line {
      position: absolute;
      top: 50px;
      left: 10px;
      z-index: 2;
      ul {
        padding-left: 10px;
        .iconfont {
          font-size: 16px;
        }
      }
    }
    .none-data-box {
      height: 100% !important;
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: -49px;
    button {
      height: 30px;
      line-height: 30px;
      width: 100px;
    }
    .get-real-data {
      margin-right: 20px;
    }
    .no-real-date {
      margin-right: 20px;
      background: #0072e6;
    }
  }
  .none-data-box {
    height: 100% !important;
  }
}
</style>
