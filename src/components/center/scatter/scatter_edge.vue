<!-- 散点图 -->
<template>
  <div class='my-scatter'>
    <div
      v-for='(data, index) in scatterData'
      :key=index
      class="my-scatter-chart box-shadow"
      v-show="data.isShow"
      @drop='addPos(index, $event)'
      @dragover.prevent
    >
      <div class='chart-base-title'>
        <span v-show="data.x.length>0 && paramsData[index].xValue!==''"><!-- x轴 -->{{$t('scatter.xAxis')}}：{{paramsData[index].xValue + '('+data.posMsg.posUnitX+')'}}</span>
        <span v-show="data.y.length>0 && paramsData[index].yValue!==''"><!-- y轴 -->{{$t('scatter.xAxis')}}: {{paramsData[index].yValue+ '('+data.posMsg.posUnitY+')'}}</span>
        <span v-show="data.time.length>0 && paramsData[index].timeValue!==''"><!-- 时间 -->{{$t('Common.time')}}: {{paramsData[index].timeValue}}</span>
      </div>
      <div
        class='none-data-box'
        v-show='data.empty.isShow'
      >
        <div>{{data.empty.text}}</div>
      </div>
      <wave-chart
        :opt=6
        :option='scatterOption'
        :class='"my-scatter-chart6" + index'
        :className='"scatter"'
        :index=index
        :isNewChart='isNewChart'
        :structure='structure'
      ></wave-chart>
    </div>
    <div class='search-data'>
      <button @click='dataRetrieval'><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import common from './scatterCommon'
export default {
  mixins: [common],
  data() {
    return {
      color: {
        /* 颜色设置 */
        titleColor: '#fff' /* 标题字体 */,
        axis: {
          /* 坐标轴 */
          name: '#fff' /* 标题 */,
          font: '#fff' /* 字体 */,
          line: '#fff' /* 坐标线 */,
          splitLine: '#fff' /* 分隔线 */,
        },
        series: {
          /* 图谱 */
          line: '#00D1FF' /* 谱线 */,
          symbol: '#fff' /* symbol */,
        },
        tool: {
          symbol: '#ff9b21',
          line: '#ff9b21',
          font: '#fff',
          background: '#ff9b21',
        },
        background: '#fff' /* 背景颜色 */,
      },
    }
  },
}
</script>
<style scoped lang='scss'>
.my-scatter {
  position: relative;
  .my-scatter-chart {
    position: relative;
    height: calc(100% - 50px);
    .chart-base-title {
      position: absolute;
      top: 15px;
      left: 200px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #fff;
      span {
        margin-right: 40px;
      }
    }
    .none-data-box {
      height: 100%;
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin-right: 20px;
    }
  }
}
</style>
