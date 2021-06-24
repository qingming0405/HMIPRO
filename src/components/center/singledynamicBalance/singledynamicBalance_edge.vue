<template>
  <div class="the-chart-background box-shadow">
    <div
      class="unilateralDynamicEquilibriumContent"
      v-for="(item,index) in paramsData"
    >
      <div class="unilateralDynamicEquilibriumContentBGC">
        <div
          class="unilateralDynamicEquilibriumContentBGCLeft"
          ref="fan"
        >
          <div :style="{ height: item.needHeight + 'px', width: item.needWidth + 'px' }">
            <div id="unilateralDynamicEquilibriumChart"></div>
          </div>
        </div>

        <div class="unilateralDynamicEquilibriumContentBGCRight">
          <div class="topContent">
            <div class="topContentInnerLeft">
              <div class="topContentInnerLeftBGC">
                <!-- <div class="perLine">
                  <div>
                    <div class="perLineHeader">工厂</div>
                    ：
                  </div>

                  <div class="perLineBody">新材料有限公司</div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader">装置</div>
                    ：
                  </div>
                  <div class="perLineBody">聚合氟装置</div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader">机组</div>
                    ：
                  </div>
                  <div class="perLineBody">乙烯压缩机组</div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader">轴承</div>
                    ：
                  </div>
                  <div class="perLineBody">乙烯高压缸后端轴承</div>
                </div> -->
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 测点 -->{{$t('Common.pos')}}</div>
                    ：
                  </div>
                  <div class="perLineBody">{{item.pos.pos_name}}</div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 校正面 -->{{$t('singledynamicBalance.CorrectionSurface')}}</div>
                    ：
                  </div>
                  <div class="perLineBody">
                    <!-- 请输入校正面 -->
                    <el-input
                      v-model="item.setParam.reviseValue"
                      :placeholder="vm.$t('singledynamicBalance.enterCorrectionSurface')"
                    ></el-input>
                  </div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 平衡转速 -->{{vm.$t('singledynamicBalance.BalanceSpeed')}}</div>
                    ：
                  </div>
                  <div class="perLineBody">
                    <!-- 请输入平衡转速 -->
                    <el-input
                      @input.native="inputhandle"
                      v-model="item.setParam.balanceSpeed"
                      :placeholder="vm.$t('singledynamicBalance.enterBalanceSpeed')"
                    ></el-input>
                  </div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 坐标极值 -->{{vm.$t('singledynamicBalance.CoordinateExtremum')}}</div>
                    ：
                  </div>
                  <div class="perLineBody">
                    <!-- 请输入坐标极值 -->
                    <el-input
                      v-model="item.setParam.Coordinate"
                      :placeholder="vm.$t('singledynamicBalance.enterCoordinateExtremum')"
                    ></el-input>
                  </div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 旋转方向 -->{{vm.$t('singledynamicBalance.turnAround')}}</div>
                    ：
                  </div>
                  <div class="perLineBody">
                    <!-- 请选择旋转方向 -->
                    <el-select
                      v-model="item.setParam.senseRotationValue"
                      :placeholder="vm.$t('singledynamicBalance.enterturnAround')"
                      class="perLineBody"
                      @change="changeDirection"
                    >
                      <el-option
                        v-for="item in senseRotationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <!-- <div class="perLine">
                  <div>
                    <div class="perLineHeader">备注</div>
                    ：
                  </div>
                  <div class="perLineBody">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请输入备注"
                      v-model="item.setParam.remarkValue"
                    >
                    </el-input>
                  </div>
                </div> -->
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 原始振动 -->{{vm.$t('singledynamicBalance.OriginVib')}}</div>
                    ：
                  </div>
                  <div style="display: flex;">
                    <el-color-picker
                      v-model="item.chartData.originalVibrationColor"
                      @change="changeLineColor"
                      show-alpha
                      :predefine="predefineColors"
                    />
                  </div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 试重振动 -->{{vm.$t('singledynamicBalance.TryToVib')}}</div>
                    ：
                  </div>
                  <div style="display: flex">
                    <el-color-picker
                      v-model="item.chartData.tryReviveMoveColor"
                      @change="changeLineColor"
                      show-alpha
                      :predefine="predefineColors"
                    />
                  </div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 残余振动 -->{{vm.$t('singledynamicBalance.ResidualVib')}}</div>
                    ：
                  </div>
                  <div style="display: flex">
                    <el-color-picker
                      v-model="item.chartData.residualOscillationColor"
                      @change="changeLineColor"
                      show-alpha
                      :predefine="predefineColors"
                    />
                  </div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 试重 -->{{vm.$t('singledynamicBalance.Retry')}}</div>
                    ：
                  </div>
                  <div style="display: flex">
                    <el-color-picker
                      v-model="item.chartData.testMassColor"
                      @change="changeLineColor"
                      show-alpha
                      :predefine="predefineColors"
                    />
                  </div>
                </div>
                <div class="perLine">
                  <div>
                    <div class="perLineHeader"><!-- 配重 -->{{vm.$t('singledynamicBalance.Counterweight')}}</div>
                    ：
                  </div>
                  <div style="display: flex">
                    <el-color-picker
                      v-model="item.chartData.additionalWeightColor"
                      @change="changeLineColor"
                      show-alpha
                      :predefine="predefineColors"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="topContentInnerRight"
              v-if="item.histroyData.length > 0"
            >
              <div class="topContentInnerRightBGC">
                <!-- 历史数据列表 -->
                <ul>
                  <li v-for="data in item.histroyData">
                    <!-- 时间 -->{{vm.$t('Common.time')}}：
                    <div>{{data.time}}</div>
                    <div><!-- 备注 -->{{vm.$t('singledynamicBalance.Remarks')}}：</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bottomContent">
            <div class="topContentInnerBottomBGC">
              <div class="topContentInnerTableHeader">
                <div
                  class="topContentInnerTableHeaderRow"
                  v-for="(item, index) in tableItemList"
                  :key="item.id"
                  :style="{ width: needWidthList[index] + '%' }"
                >
                  {{ item }}
                </div>
              </div>
              <div class="topContentInnerTableBody">
                <div class="item"><!-- 原始振动 -->{{vm.$t('singledynamicBalance.OriginVib')}}</div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.origin.amplitude"
                  ></el-input>
                </div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.origin.phase"
                  ></el-input>
                </div>
                <div class="item">XXX</div>
                <div class="item">XXX</div>
              </div>
              <div class="topContentInnerTableBody">
                <div class="item"><!-- 试重振动 -->{{vm.$t('singledynamicBalance.TryToVib')}}</div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.testWeight.amplitude"
                  ></el-input>
                </div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.testWeight.phase"
                  ></el-input>
                </div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.testWeight.quality"
                  ></el-input>
                </div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.testWeight.angle"
                  ></el-input>
                </div>
              </div>
              <div
                class="topContentInnerTableBody"
                style="border-bottom: 1px solid rgb(52, 75, 128)"
              >
                <div class="item"><!-- 残余振动 -->{{vm.$t('singledynamicBalance.ResidualVib')}}</div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.residual.amplitude"
                  ></el-input>
                </div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.residual.phase"
                  ></el-input>
                </div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.residual.quality"
                  ></el-input>
                </div>
                <div class="item">
                  <el-input
                    @input.native="inputhandle"
                    v-model="item.setParam.residual.angle"
                  ></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='search-data'>
        <button @click="onCalculate"><!-- 平衡配重计算 -->{{vm.$t('singledynamicBalance.BalanceweightCalc')}}</button>
        <button @click="showResidual"><!-- 残振矢量显示 -->{{vm.$t('singledynamicBalance.ResidualVibvectordisplay')}}</button>
        <!-- <button>保存试验结果</button>
        <button @click="dataRetrieval">数据检索</button> -->
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { cloneObj } from 'utils/utils.js'
import elementResizeDetectorMaker from 'element-resize-detector'

export default {
  name: 'singledynamicBalance',
  data() {
    const vm = window.vm;
    return {
      vm:vm,
      currentKey: '',
      paramsData: {},
      colorChange: 2,
      senseRotationOptions: [
        {
          value: '1',
          label: vm.$t('singledynamicBalance.Clockwise'),//顺时针
        },
        {
          value: '2',
          label: vm.$t('singledynamicBalance.Counterclockwise'),//逆时针
        },
      ],
      tableItemList: [
        vm.$t('singledynamicBalance.TestFreq'),//测试次数
        vm.$t('singledynamicBalance.UnbalancedAmplitude')+'(um)',//不平衡响应幅值
        vm.$t('singledynamicBalance.UnbalancedPhase')+'(°)',//不平衡响应相位
        vm.$t('singledynamicBalance.AggravatedQuality')+'(g)',//加重质量
        vm.$t('singledynamicBalance.AccentAngle')+'(°)',//加重角度
      ],
      needWidthList: [20, 23, 23, 15, 19],
      // 配置表格的input v-model
      // 颜色选择器预定义颜色
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
      ],
      // 图表字体大小 默认14
      chartsFontSize: 14,
      // 图表左右间距
      chartLeftAndRightSpacing: [30, 60],
      chartPadding: '10px',
      chartHeight: '50%',
      direction: 'rtl',
      drawerSize: null,
    }
  },
  created() {
    this.judgeMobileOrPC()
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'singledynamicBalance',
    })
  },
  watch: {
    '$store.state.singledynamicBalanceMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.key, item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.drawLineCharts()
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId, posId, posType] = key.split('_')
      if (type === 0 || type === 1) {
        this.currentKey = key
      }
      let pos = null
      if (type === 0) {
        pos = cloneObj(this.$store.state.checkMsg.pos, true)
      } else if (type === 1) {
        pos = this.paramsData[key].pos
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.paramsData, key, {
            isShow: true,
            chartData: {
              originalVibrationColor: '#00FF00', //原始振动颜色
              tryReviveMoveColor: '#0101FF', // 试重振动颜色
              residualOscillationColor: '#FE0504', //残余振动颜色
              testMassColor: '#818181', // 试重颜色
              additionalWeightColor: '#000', //配重颜色
              chartObj: null, //图表对象
              option: null, //图标option
            },
            needHeight: 0,
            needWidth: 0,
            histroyData: [],
            setParam: {
              reviseValue: null, //校正面
              Coordinate: 50, //坐标极值
              balanceSpeed: null, //平衡转速
              senseRotationValue: '2', //旋转方向
              remarkValue: null, //备注
              origin: {
                //原始震动
                amplitude: null, //不平衡响应幅值
                phase: null, //不平衡响应相位
              },
              testWeight: {
                //试重振动
                amplitude: null, //不平衡响应幅值
                phase: null, //不平衡响应相位
                quality: null, //加重质量
                angle: null, //加重角度
              },
              residual: {
                //残余震动
                amplitude: null, //不平衡响应幅值
                phase: null, //不平衡响应相位
                quality: null, //加重质量
                angle: null, //加重角度
              },
            },
            directionEstablished: false, //顺逆方向
            pos,
          })
          break
        case 1 /* 切换图表 */:
          this.paramsData[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.paramsData, key)
          break
      }
    },
    //输入限制只为数字
    inputhandle({ target }) {
      target.value = target.value.replace(/[^\d]/g, '')
    },
    /**
     * 计算动平衡(平衡配重计算)
     * 余弦定理计算方式（利用坐标系计算会很简单）
     */
    onCalculate() {
      const params = this.paramsData[this.currentKey]
      const chart = this.paramsData[this.currentKey].chartData
      const setParam = params.setParam
      if (!this.vertifyData(1)) {
        return
      }
      /* if (setParam.Coordinate != '' && Number(setParam.Coordinate) != 0) {
        customValue = Number(setParam.Coordinate)
        if (isNaN(customValue)) {
          customValue = 0
          setParam.Coordinate = '0'
        } else {
          customValue = 0
        }
      }*/

      let oamplitude = Number(setParam.origin.amplitude) // 初始幅值
      let ophase = Number(setParam.origin.phase) // 初始相位
      let oradian = (Math.PI * ophase) / 180
      let tamplitude = Number(setParam.testWeight.amplitude) //试重后合成的幅值
      let tphase = Number(setParam.testWeight.phase) //试重后合成的相位
      let tradian = (Math.PI * tphase) / 180
      let radian = (Math.PI * Math.abs(ophase - tphase)) / 180 //得出两次相位的夹角弧度，用于Math.cos计算

      let amplitude, phase /* 试重块产生的幅值和相位，通过余弦定理可得 */
      amplitude = Math.sqrt(
        oamplitude * oamplitude +
          tamplitude * tamplitude -
          2 * oamplitude * tamplitude * Math.cos(radian)
      )
      phase =
        (Math.atan(
          2 *
            ((oamplitude * Math.sin(oradian) - tamplitude * Math.sin(tradian)) /
              (oamplitude * Math.cos(oradian) - tamplitude * Math.cos(tradian)))
        ) /
          Math.PI) *
        180
      let counterWeightM, counterWeightA //配重重量，配重角度
      let m1 = Number(setParam.testWeight.quality) //试重重量
      let a1 = Number(setParam.testWeight.angle) //试重角度
      counterWeightM = ((m1 * oamplitude) / amplitude).toFixed(2)
      counterWeightA = ophase + 180 - phase + a1
      counterWeightA = counterWeightA % 360
      setParam.residual.quality = counterWeightM
      setParam.residual.angle = counterWeightM
      this.$nextTick(() => {
        this.drawLineCharts()
      })
    },
    /**
     * 数据验证
     * flag = 0：全部验证(保存) 1：平衡计算验证（参数+测试数据） 2：残余量验证 3：配重验证
     */
    vertifyData(flag) {
      let params = this.paramsData[this.currentKey]
      let setParam = params.setParam
      let vertifiy = true
      if (flag == 0 || flag == 1) {
        if (setParam.reviseValue == null || setParam.reviseValue.length == 0) {
          this.$pop(vm.$t('singledynamicBalance.calibrationSurfaceNull'))//校正面不能为空
          return false
        }
        if (
          setParam.balanceSpeed == null ||
          setParam.balanceSpeed.length == 0
        ) {
          this.$pop(vm.$t('singledynamicBalance.BalanceSpeedNull'))//平衡转速不能为空
          return false
        }
        vertifiy = vertifiy && this.vertifyFloat(setParam.balanceSpeed)
        if (!vertifiy) {
          this.$pop(vm.$t('singledynamicBalance.BalanceSpeedWrong'))//平衡转速必须为非负实数
          return false
        }
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(setParam.origin.amplitude) &&
          this.vertifyFloat(setParam.origin.phase, true)
        if (!vertifiy) {
          this.$pop(vm.$t('singledynamicBalance.errorInput'))//请输入正确的原始振动幅值（正实数）和相位（0~360）
          return false
        }
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(setParam.testWeight.quality) &&
          this.vertifyFloat(setParam.testWeight.angle, true)
        if (!vertifiy) {
          this.$pop(vm.$t('singledynamicBalance.errorInput1'))//请输入正确的增加试重质量（正实数）和角度（0~360）
          return false
        }
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(setParam.testWeight.amplitude) &&
          this.vertifyFloat(setParam.testWeight.phase, true)
        if (!vertifiy) {
          this.$pop(vm.$t('singledynamicBalance.errorInput2'))//请输入正确的试重振动幅值（正实数）和相位（0~360）
          return false
        }
      }
      if (flag == 0 || flag == 2) {
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(setParam.residual.amplitude) &&
          this.vertifyFloat(setParam.residual.phase, true)
        if (!vertifiy) {
          this.$pop(vm.$t('singledynamicBalance.errorInput3'))//请输入正确的残余振动幅值（正实数）和相位（0~360）
          return false
        }
      }
      if (flag == 0 || flag == 3) {
        vertifiy =
          vertifiy &&
          this.vertifyFloat(setParam.residual.quality) &&
          this.vertifyFloat(setParam.residual.angle, true)
        if (!vertifiy) {
          this.$pop(vm.$t('singledynamicBalance.errorInput4'))//请检验增加配重质量（非负实数）和角度（0~360）
          return false
        }
      }
      return true
    },
    /**
     * 验证是否为实数
     * 角度为0~360
     **/
    vertifyFloat(str, angleFlag = false) {
      // RegExp 正则验证特殊字符
      var _regFloat = /^(-?\d+)(\.\d+)?$/ //浮点数
      if (str == null || str.length == 0 || !_regFloat.test(str)) {
        return false
      }
      if (angleFlag) {
        var angle = Number(str)
        if (isNaN(angle) || angle < 0 || angle >= 360) {
          return false
        }
      }
      return true
    },
    /**
     * 验证是否为正实数
     **/
    vertifyPlusFloat(str) {
      let _regPlusFloat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ //正浮点数
      if (str == null || str.length == 0 || !_regPlusFloat.test(str)) {
        return false
      }
      return true
    },
    dataRetrieval() {
      const params = this.paramsData[this.currentKey]
      this.$retrieval({
        key: 'system',
        params: {
          macName: '',
          macId: '',
          machineOpition: [],
        },
      }).then((res) => {
        params.histroyData = [
          { time: '2021-01-21 14:29:22', remarks: '' },
          { time: '2021-01-21 14:29:22', remarks: '' },
          { time: '2021-01-21 14:29:22', remarks: '' },
          { time: '2021-01-21 14:29:22', remarks: '' },
        ]
      })
    },
    watchSize() {
      const _this = this
      const erd = elementResizeDetectorMaker()
      const params = this.paramsData[this.currentKey]
      const chart = this.paramsData[this.currentKey].chartData
      erd.listenTo(this.$refs.fan, (element) => {
        // 这里的this.$refs.fan指定要监听的元素对象，对应的是<div ref="fan"></div>
        const width = element.offsetWidth
        const height = element.offsetHeight
        _this.$nextTick(() => {
          if (width <= height) {
            params.needWidth = width
            params.needHeight = width
            this.$nextTick(() => {
              chart.chartObj.resize()
            })
          } else {
            params.needWidth = height
            params.needHeight = height
            this.$nextTick(() => {
              chart.chartObj.resize()
            })
          }
        })
      })
    },
    showResidual() {
      let params = this.paramsData[this.currentKey]
      if (
        params.setParam.residual.amplitude == null ||
        params.setParam.residual.phase == null
      ) {
        this.$pop(vm.$t('singledynamicBalance.errorInput5'))//残余幅值和相位不能为空！
      } else {
        this.drawLineCharts()
      }
    },
    drawLineCharts() {
      let params = this.paramsData[this.currentKey]
      let chart = this.paramsData[this.currentKey].chartData
      chart.chartObj = echarts.init(
        document.getElementById('unilateralDynamicEquilibriumChart')
      )

      chart.option = {
        polar: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'angle',
            label: {
              color: 'black',
            },
          },
        },

        angleAxis: {
          type: 'value',
          startAngle: 0,
          min: 0,
          max: 360,
          clockwise: params.directionEstablished,
          interval: 90,
          axisLine: {
            //坐标轴轴线设置
            lineStyle: {
              color: '#595959',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#595959',
            },
          },
          axisLabel: {
            fontSize: 16,
            color: '#1890ff',
            margin: 15,
            formatter: function (value) {
              return '∠ ' + value + '°'
            },
          },
          axisPointer: {
            type: 'none',
            label: {
              color: '#fff',
              formatter: function (data) {
                return '∠ ' + data.value.toFixed(2) + '°'
              },
            },
          },
        },
        radiusAxis: {
          splitLine: {
            lineStyle: {
              color: '#595959',
            },
          },
          // show:false
          min: 0,
          max: params.setParam.Coordinate,
          // max:'dataMax',
          // max:()=>{
          //   let max = 0;
          //   if(Number(params.setParam.origin.amplitude) > max) max = params.setParam.origin.amplitude;
          //   if(Number(params.setParam.testWeight.amplitude) > max) max = params.setParam.testWeight.amplitude;
          //   if(Number(params.setParam.residual.amplitude) > max) max = params.setParam.residual.amplitude;
          //   return max+10;
          // },
          // max:{
          //   function(value) {    return value.max + 20;}
          // },
          splitNumber: 4,
          axisLine: {
            //坐标轴轴线设置
            lineStyle: {
              color: '#f0f5ff',
            },
          },
          axisLabel: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        series: [
          {
            //初始振动
            coordinateSystem: 'polar',
            type: 'line',
            data: [],
            tooltip: {
              show: false,
            },
            markLine: {
              silent: true,
              symbol: ['none', 'arrow'],
              lineStyle: {
                type: 'solid',
                width: 1.5,
                color: chart.originalVibrationColor,
              },
              data: [
                [
                  {
                    coord: [0, 0],
                  },
                  {
                    coord: [
                      Number(params.setParam.origin.amplitude),
                      Number(params.setParam.origin.phase),
                    ],
                  },
                ],
              ],
            },
          },
          {
            //试重振动
            coordinateSystem: 'polar',
            type: 'line',
            data: [],
            tooltip: {
              show: false,
            },
            markLine: {
              silent: true,
              symbol: ['none', 'arrow'],
              lineStyle: {
                type: 'solid',
                width: 1.5,
                color: chart.tryReviveMoveColor,
              },
              data: [
                [
                  {
                    coord: [0, 0],
                  },
                  {
                    coord: [
                      Number(params.setParam.testWeight.amplitude),
                      Number(params.setParam.testWeight.phase),
                    ],
                  },
                ],
              ],
            },
          },

          {
            //试重物块
            coordinateSystem: 'polar',
            type: 'line',
            data: [],
            tooltip: {
              show: false,
            },
            markPoint: {
              silent: true,
              data: [
                {
                  name: vm.$t('singledynamicBalance.certainCoordinate'),//某个坐标
                  coord: [
                    Number(params.setParam.Coordinate),
                    Number(params.setParam.testWeight.angle),
                  ],
                },
              ],
              symbol: 'rect',
              symbolSize: 20,
              itemStyle: {
                color: chart.testMassColor,
              },
            },
          },
          {
            //配重物块
            coordinateSystem: 'polar',
            type: 'line',
            data: [],
            tooltip: {
              show: false,
            },
            markPoint: {
              silent: true,
              data: [
                {
                  name: vm.$t('singledynamicBalance.certainCoordinate'),//某个坐标
                  coord: [
                    Number(params.setParam.Coordinate),
                    Number(params.setParam.residual.angle),
                  ],
                },
              ],
              symbol: 'rect',
              symbolSize: 20,
              itemStyle: {
                color: chart.additionalWeightColor,
              },
            },
          },
        ],
      }
      if (
        params.setParam.residual.amplitude !== null &&
        chart.option.series.length < 5
      ) {
        chart.option.series.push({
          //残余震动
          coordinateSystem: 'polar',
          type: 'line',
          data: [],
          tooltip: {
            show: false,
          },
          markLine: {
            silent: true,
            symbol: ['none', 'arrow'],
            lineStyle: {
              type: 'solid',
              width: 1.5,
              color: chart.residualOscillationColor,
            },
            data: [
              [
                {
                  coord: [0, 0],
                },
                {
                  coord: [
                    Number(params.setParam.residual.amplitude),
                    Number(params.setParam.residual.phase),
                  ],
                },
              ],
            ],
          },
        })
      }
      chart.chartObj.setOption(chart.option)
      window.addEventListener('resize', () => {
        chart.chartObj.resize()
      })
      this.watchSize()
    },
    changeLineColor() {
      this.$nextTick(() => {
        this.drawLineCharts()
      })
    },
    changeDirection(val) {
      let params = this.paramsData[this.currentKey]
      if (val === '1') {
        params.directionEstablished = true
        this.changeLineColor()
      } else {
        params.directionEstablished = false
        this.changeLineColor()
      }
    },

    openTabs(index) {
      this.colorChange = index
      if (index === 3) {
        this.$nextTick(() => {
          this.changeDataType(this.dataTypeChangeValue)
        })
      }
    },
    changeDataType(val) {
      if (val === '2') {
        this.$nextTick(() => {
          this.$refs.dataPointIndexTable.resizeLayout()
        })
      } else if (val === '3') {
        this.$nextTick(() => {
          this.$refs.startAndStopData.resizeLayout()
        })
      } else if (val === '4') {
        this.$nextTick(() => {
          this.$refs.historicalData.resizeLayout()
        })
      }
    },

    // 静态动态切换
    staticDynamicSwitching(index) {
      if (index === 1) {
        this.$refs.dynamicSchedule.switchToDynamic()
      } else {
        this.$refs.dynamicSchedule.timeOut()
      }
    },
    // 判断当前是移动端还是PC端
    judgeMobileOrPC() {
      if (
        navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
      ) {
        this.direction = 'btt'
        this.drawerSize = '95%'
        this.chartsFontSize = 12
        this.chartPadding = '6px'
        this.chartLeftAndRightSpacing = [10, 30]
      } else {
        this.drawerSize = '400px'
        this.direction = 'rtl'
        this.chartsFontSize = 14
        this.chartPadding = '10px'
        this.chartLeftAndRightSpacing = [30, 60]
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/css/inputStyle.scss';
@import '@/assets/style/css/diagnosisAssistantStyle.scss';
</style>
<style lang="scss">
.el-color-dropdown__link-btn {
  display: none !important;
}
.el-color-picker__trigger {
  border: 0;
  height: 6px;
  width: 150px;
  padding: 0;
}
.el-color-picker__icon {
  display: none !important;
}
.el-color-picker__color {
  border: 0;
  border-radius: 0;
}
.el-color-picker {
  height: 20px;
}
</style>
