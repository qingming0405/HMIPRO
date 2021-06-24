<!-- 倾角分布图(沉降跟踪图) -->

<script>
import com from './dipCommon.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  mixins: [com],
  data() {
    return {
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
.my-dip-chart {
  position: relative;
  .dip-chart {
    height: calc(100% - 60px);
    width: 96%;
    margin: 0 auto;
    position: relative;
    .data-box {
      position: absolute;
      top: 20px;
      left: 10px;
      font-size: 14px;
      z-index: 2;
      .data-title {
        font-size: 16px;
      }
      .operation-list {
        margin-bottom: 10px;
        li {
          height: 30px;
          display: flex;
          justify-items: center;
          .operation-title {
            &::after {
              content: '';
              display: inline-block;
              width: 100%;
            }
            height: 30px;
            line-height: 30px;
            // width: 60px;
            text-align: justify;
            margin-right: 10px;
          }
          .operation,
          .operation-xuanzhong,
          .operation-threshold {
            width: 100px;
            height: 30px;
            line-height: 30px;
            .set-color {
              height: 16px;
              width: 16px;
            }
          }
          .operation-threshold {
            display: grid;
            grid-template-columns: 24px 50px;
            place-items: center left;
            margin-left: 10px;
          }
          .operation-xuanzhong {
            width: 16px;
            text-align: center;
          }
          .eigenvalue {
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            width: 110px;
            padding: 0 5px;
            margin-top: 5px;
            position: relative;
            .iconfont {
              font-size: 12px;
              position: absolute;
              right: 5px;
            }
          }
        }
      }
      .data-list {
        height: 30px;
        line-height: 30px;
      }
    }
    .chart-box {
      height: 100%;
      width: 100%;
      .my-dip-chart {
        width: 100%;
        height: 100%;
      }
    }
    .none-data-box {
      height: 100% !important;
    }
  }
  .pos-list {
    position: absolute;
    padding: 5px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 300px;
    width: 500px;
    background-color: #103760;
    box-shadow: 0px 2px 7px 0px rgba(93, 135, 218, 0.33),
      0px 3px 7px 0px rgba(93, 135, 218, 0.33);
    z-index: 3;
    border-radius: 5px;
    .pos-list-title {
      display: flex;
      align-items: center;
      height: 30px;
      user-select: none;
      span {
        font-size: 18px;
        width: 450px;
      }
      .close-retrieval {
        right: 5px;
        position: absolute;
        height: 20px;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .iconfont {
          display: block;
          font-size: 15px;
          transform: scale(0.75);
        }
      }
    }
    .pos-list-body {
      height: calc(100% - 40px);

      .pos-list-body-list {
        overflow-y: auto;
        height: calc(100% - 20px);
      }
      ul {
        display: flex;
        align-items: center;
        li {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:first-child {
            flex: 0 0 150px;
          }
          &:nth-child(2) {
            flex: 0 0 150px;
          }
          &:nth-child(3) {
            flex: 0 0 80px;
          }
          &:nth-child(4) {
            flex: 0 0 100px;
          }
        }
      }
      .set-color {
        margin-top: 3px;
        margin-left: 32px;
        height: 16px;
        width: 16px;
      }
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    text-align: center;
    position: absolute;
    bottom: -49px;
    width: 100%;
    button {
      height: 30px;
      min-width: 100px;
      padding: 0px 10px;
    }
  }
}
</style>
