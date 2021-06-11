<script>
import com from './wave3dCommon'
import echarts from 'echarts'
import 'echarts-gl'
export default {
  mixins: [com],
  data() {
    return {
      colorList: [
        '#000000',
        '#CCCC00',
        '#993366',
        '#00CC99',
        '#996666',
        '#6666FF',
        '#999699',
        '#CC9933',
      ] /* 备选颜色 */,
    }
  },
  methods: {
    /* 创建3D图谱 */
    init_3d_chart() {
      let value = this.chartData[this.key]
      let myChart // 表格实例
      /* 第一次初始化的时候要创建图 */
      if (!value.echart) {
        let className = value.className
        // let wave3d = document.getElementsByClassName('spectrum-3d-chart')[0];
        let wave3d = document.getElementsByClassName(className)[0]
        myChart = echarts.init(wave3d)
        /* 屏蔽原有的右键事件 */
        wave3d.oncontextmenu = function () {
          // return false;
        }
        /* 模拟双击点击跳转到对应波形图的功能模块 */
        let simulate_dblclick = () => {
          let oldTime = new Date().valueOf()
          return (params) => {
            let nowTime = new Date().valueOf()
            if (nowTime - oldTime < 300) {
              let time = params.data[1]
              time = new Date(time).valueOf()
              this.$store.commit('setCurrentTime', time)
              let key = 'wave' + this.key.slice(6) //wave3d_pos_14121310332547010_0_3
              //跳转到波形图
              let name = '波形频谱图'
              let titleName = value.pos.mac_name + '-' + '波形频谱图'
              this.$bus.$emit('choiceChartType', key, name, titleName)
            } else {
              this.update_histogram()
            }
            oldTime = nowTime
          }
        }
        myChart.on('click', simulate_dblclick())
        value.echart = myChart
      } else {
        /* 如果已经创建了这个实例，则重新渲染数据即可 */
        myChart = value.echart
      }
      let series = []
      for (let i = 0; i < value.vdata.length; i++) {
        series.push({
          name: i + 1,
          type: 'line3D',
          data: value.vdata[i],
        })
      }
      let option = {
        color: this.colorList,
        xAxis3D: {
          type: 'value',
          name: '频率(Hz)',
          scale: true,
          nameTextStyle: {
            color: this.lineColor,
          },
          axisLabel: {
            textStyle: {
              color: this.lineColor,
            },
          },
          axisLine: {
            lineStyle: {
              //坐标轴颜色
              color: this.lineColor,
            },
          },
        },
        yAxis3D: {
          type: 'category',
          name: value.dataYUnit,
          nameGap: 80,
          data: value.dataY,
          axisLabel: {
            show: true,
            interval: 0, //使y轴都显示
            textStyle: {
              color: this.lineColor,
            },
          },
          nameTextStyle: {
            color: this.lineColor,
          },
          axisLine: {
            lineStyle: {
              //坐标轴颜色
              color: this.lineColor,
            },
          },
        },
        zAxis3D: {
          type: 'value',
          name: '幅值',
          nameGap: 30,
          // max: 'dataMax',
          nameTextStyle: {
            color: this.lineColor,
          },
          axisLabel: {
            textStyle: {
              color: this.lineColor,
            },
          },
          axisLine: {
            lineStyle: {
              //坐标轴颜色
              color: this.lineColor,
            },
          },
        },
        grid3D: {
          boxWidth: 500,
          boxHeight: 200,
          boxDepth: 400,
          axisLine: {
            show: true,
            interval: 0,
            lineStyle: {
              color: '#000',
            },
          },
          axisLabel: {
            show: true,
          },
          viewControl: {
            distance: 500,
            minDistance: 200,
            maxDistance: 800,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: (prams, d, callback) => {
            this.update_frequence(prams.value[0])
            return `频率:${prams.value[0]}Hz<br/>
                    幅值:${prams.value[2]}<br/>
                    时间:${prams.value[1]}<br/>`
          },
        },
        series: series,
      }
      // window.addEventListener("resize", function() {
      //   myChart.resize();
      // });

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, { replaceMerge: ['series'] })
      myChart.resize()
    },
  },
}
</script>

<style scoped lang="scss">
.wave3d {
  position: relative;
  .title {
    position: absolute;
  }
  .histogram {
    position: absolute;
    height: 200px;
    width: 323px;
    font-size: 10px;
    z-index: 999;
  }
  .my-spectrum-3d-chart {
    height: calc(100% - 49px);
    .spectrum-3d-chart {
      width: 100%;
      height: 100%;
    }
  }
  .search-3d-data {
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
  .clickRightMenu {
    width: 110px;
    background-color: #fff;
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
    background-color: #dcdcdc;
    cursor: pointer;
  }
  .iconfont {
    font-size: 14px;
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>
