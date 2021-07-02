<!-- 趋势图 -->
<script>
// import 《组件名称》 from '《组件路径》';
import common from "./trendCommon.vue";

export default {
  // import引入的组件需要注入到对象中才能使用
  mixins: [common],
  data() {
    return {
      colorList: [
        // '#F1B232',
        '#FF623B',
        '#EAD07B',
        '#E9EC46',
        '#BDE970',
        '#74DEA8',
        '#3093B5',
        '#A9BFE2',
        '#A25DB5'
      ] /* 备选颜色 */,
      chartOptionColor: {
        /* 图谱option颜色 */
        axis: {
          /* 坐标轴 */
          name: "#fff" /* 标题 */,
          font: "#fff" /* 字体 */,
          line: "#fff" /* 轴线 */,
          splitLine: "#fff" /* 坐标轴分割线 */
        },
        tool: {
          symbol: "#ff9b21" /* 圆点 */,
          line: "#ff9b21" /* 标线 */,
          font: "#fff" /* 字体 */,
          background: "rgba(108, 145, 221, 0.8)" /* 背景蓝色 */
        },
        series: {
          /* 图谱 */
          symbol: "#fff" /* symbol */
        }
      },
      savePicBackgroundColor: "#092e55"
    };
  }
};
</script>
<style scoped lang="scss">
.my-trend-chart {
  .my-trend {
    position: relative;
    height: 100%;
    width: 100%;
    .trend-chart {
      width: 100%;
      height: calc(100% - 50px);
      display: grid;
      grid-template-columns: 130px calc(100% - 130px);
      & + div {
        margin-top: 1px;
      }

      .trend-pos-list {
        height: 100%;
        overflow: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      // .trend-left-title {
        .trend-eigenvalue {
          padding-left: 5px;
          cursor: pointer;
        }
      // }
    }
    .search-data {
      height: 49px;
      line-height: 49px;
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      .addPosTrend {
        position: absolute;
        left: 15px;
        top: 10px;
      }
      button {
        height: 30px;
        width: 100px;
        margin: 0px 10px;
      }
      .no-real-date {
        background: #0072e6;
      }
    }
  }
}
.clickRightMenu {
  width: 110px;
  background-color: #022344;
  font-size: 12px;
  position: absolute;
  text-align: left;
  padding: 2px 0;
  border: 1px solid #ccc;
  display: block;
  z-index: 100;
}
.clickRightMenu li {
  list-style: none;
  line-height: 20px;
  padding-left: 15px;
}
.clickRightMenu li:hover {
  background-color: #152f69;
  cursor: pointer;
}
.iconfont {
  font-size: 14px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
