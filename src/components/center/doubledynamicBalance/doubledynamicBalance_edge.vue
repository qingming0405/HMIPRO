<template>
  <div class="the-chart-background box-shadow">
    <div
      class="polarDiagramContent"
      v-for="(item,index) in paramsData"
    >
      <div class="polarDiagramContentBGC">
        <div
          class="polarDiagramContentBGCLeft"
          ref="fan"
        >
          <div
            id="placeholder"
            :style="{ height: item.needHeight + 'px', width: item.needWidth + 'px' }"
          >
            <div id="placeholderBody"></div>
          </div>
        </div>
        <div
          class="polarDiagramContentBGCLeft"
          ref="fan"
        >
          <div
            id="placeholder"
            :style="{ height: item.needHeight + 'px', width: item.needWidth + 'px' }"
          >
            <div id="placeholderBodyTwo"></div>
          </div>
        </div>
        <div class="topContentInner">
          <div class="topContentInnerLeft">
            <div class="topContentInnerLeftBGC">
              <div class="perLine">
                <div>
                  <div class="perLineHeader">校正面1</div>
                  ：
                </div>
                <div class="perLineBody">
                  <el-input
                    v-model="item.setParam.reviseValue1"
                    placeholder="请输入校正面"
                  ></el-input>
                </div>
              </div>
              <div class="perLine">
                <div>
                  <div class="perLineHeader">校正面2</div>
                  ：
                </div>
                <div class="perLineBody">
                  <el-input
                    v-model="item.setParam.reviseValue2"
                    placeholder="请输入校正面"
                  ></el-input>
                </div>
              </div>
              <div class="perLine">
                <div>
                  <div class="perLineHeader">平衡转速</div>
                  ：
                </div>
                <div class="perLineBody">
                  <el-input
                    v-model="item.setParam.balanceSpeed"
                    placeholder="请输入平衡转速"
                  ></el-input>
                </div>
              </div>
              <div class="perLine">
                <div>
                  <div class="perLineHeader">旋转方向</div>
                  ：
                </div>
                <div class="perLineBody">
                  <el-select
                    v-model="item.setParam.senseRotationValue"
                    placeholder="请选择旋转方向"
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
              <div class="perLine">
                <div>
                  <div class="perLineHeader">坐标极值</div>
                  ：
                </div>
                <div class="perLineBody">
                  <el-input
                    v-model="item.setParam.Coordinate"
                    placeholder="请输入坐标极值"
                  ></el-input>
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
                    :rows="2"
                    placeholder="请输入备注"
                    v-model="item.setParam.remarkValue"
                  >
                  </el-input>
                </div>
              </div> -->
              <div class="perLine">
                <div>
                  <div class="perLineHeader">原始振动</div>
                  ：
                </div>
                <div style="display: flex">
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
                  <div class="perLineHeader">试重振动1</div>
                  ：
                </div>
                <div style="display: flex">
                  <el-color-picker
                    v-model="item.chartData.tryReviveMoveColor1"
                    @change="changeLineColor"
                    show-alpha
                    :predefine="predefineColors"
                  />
                </div>
              </div>

              <div class="perLine">
                <div>
                  <div class="perLineHeader">试重振动2</div>
                  ：
                </div>
                <div style="display: flex">
                  <el-color-picker
                    v-model="item.chartData.tryReviveMoveColor2"
                    @change="changeLineColor"
                    show-alpha
                    :predefine="predefineColors"
                  />
                </div>
              </div>
              <div class="perLine">
                <div>
                  <div class="perLineHeader">残余振动</div>
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
                  <div class="perLineHeader">试重</div>
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
                  <div class="perLineHeader">配重</div>
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
            class="topContentInnerLeft dataList"
            v-show="item.histroyData.length > 0"
          >
            <div class="topContentInnerLeftBGC">
              <!-- 历史数据列表 -->
              <ul>
                <li v-for="data in item.histroyData">
                  时间：
                  <div>{{data.time}}</div>
                  <div>备注：</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
      <div class="bottomContent">
        <div class="topContentInnerBottomBGC">
          <div class="topContentInnerTableHeader">
            <div
              class="topContentInnerTableHeaderRow"
              v-for="item in tableItemList"
              :key="item.id"
              :style="{ width: (10 / 9) * 10 + '%' }"
            >
              {{ item }}
            </div>
          </div>
          <div class="topContentInnerTableBody">
            <div class="itemBody">原始振动</div>
            <div
              class="itemBody"
              v-for="(item, index) in item.dataBindingObject.originalVibration"
              :key="item.id"
            >
              <el-input
                v-model="item['firstLine' + index]"
                :disabled="item.disabled"
              ></el-input>
            </div>
          </div>
          <div class="topContentInnerTableBody">
            <div class="itemBody">试重振动1</div>
            <div
              class="itemBody"
              v-for="(item, index) in item.dataBindingObject.testMassOne"
              :key="item.id"
            >
              <el-input
                v-model="item['firstLine' + index]"
                :disabled="item.disabled"
              ></el-input>
            </div>
          </div>
          <div class="topContentInnerTableBody">
            <div class="itemBody">试重振动2</div>
            <div
              class="itemBody"
              v-for="(item, index) in item.dataBindingObject.testMassTwo"
              :key="item.id"
            >
              <el-input
                v-model="item['firstLine' + index]"
                :disabled="item.disabled"
              ></el-input>
            </div>
          </div>
          <div
            class="topContentInnerTableBody"
            style="border-bottom: 1px solid rgb(52, 75, 128)"
          >
            <div class="itemBody">残余振动</div>

            <div
              class="itemBody"
              v-for="(item, index) in item.dataBindingObject.residualOscillation"
              :key="item.id"
            >
              <el-input
                v-model="item['firstLine' + index]"
                :disabled="item.disabled"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class='search-data'>
        <button @click="onCalculate">平衡配重计算</button>
        <button @click="showResidual">残振矢量显示</button>
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
  name: 'doubledynamicBalance',
  data() {
    return {
      paramsData: {},
      senseRotationOptions: [
        {
          value: '1',
          label: '顺时针',
        },
        {
          value: '2',
          label: '逆时针',
        },
      ],
      tableItemList: [
        '测试次数',
        '振幅(um)',
        '相位(°)',
        '振幅(um)',
        '相位(°)',
        '校正面1加重(g)',
        '校正面1加重角(°)',
        '校正面2加重(g)',
        '校正面2加重角(°)',
      ],
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
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'doubledynamicBalance',
    })
  },
  watch: {
    '$store.state.doubledynamicBalanceMsg': {
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
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.paramsData, key, {
            isShow: true,
            chartData: {
              originalVibrationColor: '#00FF00', //原始振动颜色
              tryReviveMoveColor1: '#0101FF', // 试重振动颜色
              tryReviveMoveColor2: '#00FFFF', // 试重振动颜色
              residualOscillationColor: '#FE0504', //残余振动颜色
              testMassColor: '#818181', // 试重颜色
              additionalWeightColor: '#000', //配重颜色
              chartObj1: null, //图表对象
              chartObj2: null, //图表对象
            },
            needHeight: 0,
            needWidth: 0,
            histroyData: [],
            setParam: {
              reviseValue1: null, //校正面1
              reviseValue2: null, //校正面2
              Coordinate: 50, //坐标极值
              balanceSpeed: null, //平衡转速
              senseRotationValue: '2', //旋转方向
              remarkValue: null, //备注
            },
            dataBindingObject: {
              originalVibration: [
                {
                  firstLine0: '',
                  disabled: false,
                  placeholder: 'xa0_a',
                },
                {
                  firstLine1: '',
                  disabled: false,
                  placeholder: 'xa0_c',
                },
                {
                  firstLine2: '',
                  disabled: false,
                  placeholder: 'xb0_a',
                },
                {
                  firstLine3: '',
                  disabled: false,
                  placeholder: 'xb0_c',
                },
                {
                  firstLine4: 'XXX',
                  disabled: true,
                },
                {
                  firstLine5: 'XXX',
                  disabled: true,
                },
                {
                  firstLine6: 'XXX',
                  disabled: true,
                },
                {
                  firstLine7: 'XXX',
                  disabled: true,
                },
              ],
              testMassOne: [
                {
                  firstLine0: '',
                  disabled: false,
                  placeholder: 'xa01_a',
                },
                {
                  firstLine1: '',
                  disabled: false,
                  placeholder: 'xa01_c',
                },
                {
                  firstLine2: '',
                  disabled: false,
                  placeholder: 'xb01_a',
                },
                {
                  firstLine3: '',
                  disabled: false,
                  placeholder: 'xb01_c',
                },
                {
                  firstLine4: '',
                  disabled: false,
                  placeholder: 'u1_m',
                },
                {
                  firstLine5: '',
                  disabled: false,
                  placeholder: 'u1_c',
                },
                {
                  firstLine6: 'XXX',
                  disabled: true,
                },
                {
                  firstLine7: 'XXX',
                  disabled: true,
                },
              ],
              testMassTwo: [
                {
                  firstLine0: '',
                  disabled: false,
                  placeholder: 'xa02_a',
                },
                {
                  firstLine1: '',
                  disabled: false,
                  placeholder: 'xa02_c',
                },
                {
                  firstLine2: '',
                  disabled: false,
                  placeholder: 'xb02_a',
                },
                {
                  firstLine3: '',
                  disabled: false,
                  placeholder: 'xb02_c',
                },
                {
                  firstLine4: 'XXX',
                  disabled: true,
                },
                {
                  firstLine5: 'XXX',
                  disabled: true,
                },
                {
                  firstLine6: '',
                  disabled: false,
                  placeholder: 'u2_m',
                },
                {
                  firstLine7: '',
                  disabled: false,
                  placeholder: 'u2_c',
                },
              ],
              residualOscillation: [
                {
                  firstLine0: '',
                  disabled: false,
                  placeholder: 'cy1_a',
                },
                {
                  firstLine1: '',
                  disabled: false,
                  placeholder: 'cy1_c',
                },
                {
                  firstLine2: '',
                  disabled: false,
                  placeholder: 'cy2_a',
                },
                {
                  firstLine3: '',
                  disabled: false,
                  placeholder: 'cy2_c',
                },
                {
                  firstLine4: '',
                  disabled: false,
                  placeholder: 'u01_m',
                },
                {
                  firstLine5: '',
                  disabled: false,
                  placeholder: 'u01_c',
                },
                {
                  firstLine6: '',
                  disabled: false,
                  placeholder: 'u02_m',
                },
                {
                  firstLine7: '',
                  disabled: false,
                  placeholder: 'u02_c',
                },
              ],
            },
            directionEstablished: false, //顺逆方向
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
    /**
     * 计算动平衡(平衡配重计算)
     * 余弦定理计算方式（利用坐标系计算会很简单）
     */
    onCalculate() {
      const params = this.paramsData[this.currentKey]
      const chart = this.paramsData[this.currentKey].chartData
      const setParam = params.setParam
      const data = params.dataBindingObject
      if (!this.vertifyData(1)) {
        return
      }

      let xa0_a = Number(data.originalVibration[0].firstLine0) // 初始幅值a
      let xa0_c = Number(data.originalVibration[1].firstLine1) // 初始相位a
      let xa0_p = this.vectorToPoint(xa0_a, (Math.PI * xa0_c) / 180)

      let xb0_a = Number(data.originalVibration[2].firstLine2) // 初始幅值b
      let xb0_c = Number(data.originalVibration[3].firstLine3) // 初始相位b
      let xb0_p = this.vectorToPoint(xb0_a, (Math.PI * xb0_c) / 180)

      let xa01_a = Number(data.testMassOne[0].firstLine0) //试重1后合成的幅值a
      let xa01_c = Number(data.testMassOne[1].firstLine1) //试重1后合成的相位a
      let xa01_p = this.vectorToPoint(xa01_a, (Math.PI * xa01_c) / 180)

      let xb01_a = Number(data.testMassOne[2].firstLine2) //试重1后合成的幅值b
      let xb01_c = Number(data.testMassOne[3].firstLine3) //试重1后合成的相位b
      let xb01_p = this.vectorToPoint(xb01_a, (Math.PI * xb01_c) / 180)

      let xa02_a = Number(data.testMassTwo[0].firstLine0) //试重2后合成的幅值a
      let xa02_c = Number(data.testMassTwo[1].firstLine1) //试重2后合成的相位a
      let xa02_p = this.vectorToPoint(xa02_a, (Math.PI * xa02_c) / 180)

      let xb02_a = Number(data.testMassTwo[2].firstLine2) //试重2后合成的幅值b
      let xb02_c = Number(data.testMassTwo[3].firstLine3) //试重2后合成的相位b
      let xb02_p = this.vectorToPoint(xb02_a, (Math.PI * xb02_c) / 180)

      //试重1所产生的幅值,相位，点
      let xa1_a, xa1_c, xa1_p, xb1_a, xb1_c, xb1_p
      //试重2所产生的幅值,相位，点
      let xa2_a, xa2_c, xa2_p, xb2_a, xb2_c, xb2_p
      xa1_p = { x: xa01_p.x - xa0_p.x, y: xa01_p.y - xa0_p.y }
      xb1_p = { x: xb01_p.x - xb0_p.x, y: xb01_p.y - xb0_p.y }
      xa2_p = { x: xa02_p.x - xa0_p.x, y: xa02_p.y - xa0_p.y }
      xb2_p = { x: xb02_p.x - xb0_p.x, y: xb02_p.y - xb0_p.y }
      // 计算试重所产生的幅值
      xa1_a = this.vector_a(xa1_p)
      xb1_a = this.vector_a(xb1_p)
      xa2_a = this.vector_a(xa2_p)
      xb2_a = this.vector_a(xb2_p)
      //计算试重所产生的相位的弧度
      xa1_c = this.vector_c(xa1_p)
      xb1_c = this.vector_c(xb1_p)
      xa2_c = this.vector_c(xa2_p)
      xb2_c = this.vector_c(xb2_p)
      // 计算试重所产生的相位
      xa1_c = this.radianToangle(xa1_c)
      xb1_c = this.radianToangle(xb1_c)
      xa2_c = this.radianToangle(xa2_c)
      xb2_c = this.radianToangle(xb2_c)
      if ((xa1_a == 0 && xb1_a == 0) || (xa2_a == 0 && xb2_a == 0)) {
        this.$pop('平衡配重计算溢出，请检查输入数据')
        return
      }
      let parameterObj = {}
      let u0Obj = {}
      let u1_m = Number(data.testMassOne[4].firstLine4) //试重重量1
      let u1_c = Number(data.testMassOne[5].firstLine5) //试重角度1
      if (xb2_a != 0) {
        parameterObj = {}
        parameterObj.x1_a = xa2_a / xb2_a
        parameterObj.x1_c = xa2_c - xb2_c
        parameterObj.x10_a = xa0_a
        parameterObj.x10_c = xa0_c
        parameterObj.x10_p = xa0_p
        parameterObj.x11_a = xa1_a
        parameterObj.x11_c = xa1_c
        parameterObj.x11_p = xa1_p
        parameterObj.x20_a = xb0_a
        parameterObj.x20_c = xb0_c
        parameterObj.x20_p = xb0_p
        parameterObj.x21_a = xb1_a
        parameterObj.x21_c = xb1_c
        parameterObj.x21_p = xb1_p
        parameterObj.u_m = u1_m
        parameterObj.u_c = u1_c
        u0Obj = this.getbalanceWeight(parameterObj)
      } else {
        //tOwnAmplitude2_1 != 0
        parameterObj = {}
        parameterObj.x1_a = xb2_a / xa2_a
        parameterObj.x1_c = xb2_c - xa2_c
        parameterObj.x10_a = xb0_a
        parameterObj.x10_c = xb0_c
        parameterObj.x10_p = xb0_p
        parameterObj.x11_a = xb1_a
        parameterObj.x11_c = xb1_c
        parameterObj.x11_p = xb1_p
        parameterObj.x20_a = xa0_a
        parameterObj.x20_c = xa0_c
        parameterObj.x20_p = xa0_p
        parameterObj.x21_a = xa1_a
        parameterObj.x21_c = xa1_c
        parameterObj.x21_p = xa1_p
        parameterObj.u_m = u1_m
        parameterObj.u_c = u1_c
        u0Obj = this.getbalanceWeight(parameterObj)
      }
      if (u0Obj.flag == false) {
        this.$pop('平衡配重计算溢出，请检查输入数据')
        return
      }
      let rm1 = u0Obj.u0_m
      let rc1 = u0Obj.u0_c
      let rp1 = u0Obj.u0_p
      if (xa1_a != 0) {
        parameterObj = {}
        parameterObj.x1_a = xb1_a / xa1_a
        parameterObj.x1_c = xb1_c - xa1_c
        parameterObj.x10_a = xb0_a
        parameterObj.x10_c = xb0_c
        parameterObj.x10_p = xb0_p
        parameterObj.x11_a = xb2_a
        parameterObj.x11_c = xb2_c
        parameterObj.x11_p = xb2_p
        parameterObj.x20_a = xa0_a
        parameterObj.x20_c = xa0_c
        parameterObj.x20_p = xa0_p
        parameterObj.x21_a = xa2_a
        parameterObj.x21_c = xa2_c
        parameterObj.x21_p = xa2_p
        parameterObj.u_m = Number(data.testMassTwo[6].firstLine6)
        parameterObj.u_c = Number(data.testMassTwo[7].firstLine7)
      } else {
        parameterObj = {}
        parameterObj.x1_a = xa1_a / xb1_a
        parameterObj.x1_c = xa1_c - xb1_c
        parameterObj.x10_a = xa0_a
        parameterObj.x10_c = xa0_c
        parameterObj.x10_p = xa0_p
        parameterObj.x11_a = xa2_a
        parameterObj.x11_c = xa2_c
        parameterObj.x11_p = xa2_p
        parameterObj.x20_a = xb0_a
        parameterObj.x20_c = xb0_c
        parameterObj.x20_p = xb0_p
        parameterObj.x21_a = xb2_a
        parameterObj.x21_c = xb2_c
        parameterObj.x21_p = xb2_p
        parameterObj.u_m = Number(data.testMassTwo[6].firstLine6)
        parameterObj.u_c = Number(data.testMassTwo[7].firstLine7)
      }
      u0Obj = this.getbalanceWeight(parameterObj)
      if (u0Obj.flag == false) {
        this.$pop('平衡配重计算溢出，请检查输入数据')
        return
      }
      let rm2 = u0Obj.u0_m
      let rc2 = u0Obj.u0_c
      let rp2 = u0Obj.u0_p
      data.residualOscillation[4].firstLine4 = rm1.toFixed(2)
      rc1 = (Math.round(rc1 * 100) / 100) % 360
      if (rc1 < 0) {
        rc1 = rc1 + 360
      }
      data.residualOscillation[5].firstLine5 = rc1.toFixed(2)
      data.residualOscillation[6].firstLine6 = rm2.toFixed(2)
      rc2 = (Math.round(rc2 * 100) / 100) % 360
      if (rc2 < 0) {
        rc2 = rc2 + 360
      }
      data.residualOscillation[7].firstLine7 = rc2.toFixed(2)
      this.$nextTick(() => {
        this.drawLineCharts()
      })
    },
    /**
     * 计算配重（算式）
     */
    getbalanceWeight(obj) {
      var u0_obj = {}
      var flag = true
      var x1_a = obj.x1_a
      var x1_c = obj.x1_c
      var x10_a = obj.x10_a
      var x10_c = obj.x10_c
      var x10_p = obj.x10_p
      var x11_a = obj.x11_a
      var x11_c = obj.x11_c
      var x11_p = obj.x11_p
      var x20_a = obj.x20_a
      var x20_c = obj.x20_c
      var x20_p = obj.x20_p
      var x21_a = obj.x21_a
      var x21_c = obj.x21_c
      var x21_p = obj.x21_p
      var u_m = obj.u_m
      var u_c = obj.u_c
      var tmp_p1, tmp_p2, tmp_p3, tmp_p4
      var tmp_a1, tmp_a2, tmp_a3, tmp_a4
      var tmp_c1, tmp_c2, tmp_c3, tmp_c4
      var tmp_x, tmp_y
      var r_a, r_c
      var u0_m, u0_c, u0_p

      tmp_a1 = x20_a * x1_a
      tmp_c1 = x20_c + x1_c
      tmp_p1 = this.vectorToPoint(tmp_a1, (Math.PI * tmp_c1) / 180)
      tmp_p2 = { x: x10_p.x - tmp_p1.x, y: x10_p.y - tmp_p1.y }
      tmp_a2 = this.vector_a(tmp_p2)
      tmp_c2 = this.vector_c(tmp_p2)
      tmp_c2 = this.radianToangle(tmp_c2)
      tmp_a3 = x21_a * x1_a
      tmp_c3 = x21_c + x1_c
      tmp_p3 = this.vectorToPoint(tmp_a3, (Math.PI * tmp_c3) / 180)
      tmp_p4 = { x: x11_p.x - tmp_p3.x, y: x11_p.y - tmp_p3.y }
      tmp_a4 = this.vector_a(tmp_p4)
      tmp_c4 = this.vector_c(tmp_p4)
      tmp_c4 = this.radianToangle(tmp_c4)
      if (tmp_a4 == 0) {
        flag = false
      }
      u0_obj.flag = flag
      if (flag) {
        r_a = tmp_a2 / tmp_a4
        r_c = tmp_c2 - tmp_c4
        u0_m = u_m * r_a
        u0_c = u_c + r_c
        u0_c += 180
        u0_c = u0_c % 360
        if (u0_c < 0) {
          u0_c = u0_c + 360
        }
        if (u0_m == 0) {
          u0_c = 0
        }
        u0_p = this.vectorToPoint(u0_m, (Math.PI * u0_c) / 180)
        u0_obj.u0_m = u0_m
        u0_obj.u0_c = u0_c
        u0_obj.u0_p = u0_p
      }
      return u0_obj
    },
    /**
     * 向量转换成坐标点
     * a:幅值 b:相位对应弧度
     */
    vectorToPoint(a, b) {
      let x = a * Math.cos(b)
      let y = a * Math.sin(b)
      let xy = { x: x, y: y }
      return xy
    },
    /**
     * 取坐标点模(计算试重所产生的幅值)
     */
    vector_a(a) {
      let a_a
      a_a = Math.sqrt(a.x * a.x + a.y * a.y)
      return a_a
    },
    /**
     * 弧度转角度
     */
    radianToangle(radian) {
      let angle = 0
      angle = (radian * 180) / Math.PI
      return angle
    },
    /**
     * 取坐标点弧度
     * arcsin=-PI/2~PI/2，所以当处于第2、3象限时需要转换
     */
    vector_c(a) {
      let a_c
      let a_a = Math.sqrt(a.x * a.x + a.y * a.y)
      if (a_a == 0) {
        a_c = 0
      } else {
        a_c = Math.asin(a.y / a_a)
        if (a.x < 0) {
          a_c = Math.PI - a_c //当处于第2、3象限时需要转换
        }
      }
      return a_c
    },
    /**
     * 数据验证
     * flag = 0：全部验证(保存) 1：平衡计算验证（参数+测试数据） 2：残余量验证 3：配重验证
     */
    vertifyData(flag) {
      let params = this.paramsData[this.currentKey]
      let setParam = params.setParam
      let data = params.dataBindingObject
      let vertifiy = true
      if (flag == 0 || flag == 1) {
        if (
          setParam.reviseValue1 == null ||
          setParam.reviseValue1.length == 0
        ) {
          this.$pop('校正面1不能为空')
          return false
        }
        if (
          setParam.reviseValue2 == null ||
          setParam.reviseValue2.length == 0
        ) {
          this.$pop('校正面2不能为空')
          return false
        }
        if (
          setParam.balanceSpeed == null ||
          setParam.balanceSpeed.length == 0
        ) {
          this.$pop('平衡转速不能为空')
          return false
        }
        vertifiy = vertifiy && this.vertifyFloat(setParam.balanceSpeed)
        if (!vertifiy) {
          this.$pop('平衡转速必须为非负实数')
          return false
        }
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.originalVibration[0].firstLine0) &&
          this.vertifyFloat(data.originalVibration[1].firstLine1, true)
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.originalVibration[2].firstLine2) &&
          this.vertifyFloat(data.originalVibration[3].firstLine3, true)
        if (!vertifiy) {
          this.$pop('请输入正确的原始振动幅值（正实数）和相位（0~360）')
          return false
        }
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.testMassOne[4].firstLine4) &&
          this.vertifyFloat(data.testMassOne[5].firstLine5, true)
        if (!vertifiy) {
          this.$pop('请输入正确的增加试重1质量（正实数）和角度（0~360）')
          return false
        }

        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.testMassOne[0].firstLine0) &&
          this.vertifyFloat(data.testMassOne[1].firstLine1, true)
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.testMassOne[2].firstLine2) &&
          this.vertifyFloat(data.testMassOne[3].firstLine3, true)
        if (!vertifiy) {
          this.$pop('请输入正确的试重1振动幅值（正实数）和相位（0~360）')
          return false
        }

        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.testMassTwo[6].firstLine6) &&
          this.vertifyFloat(data.testMassTwo[7].firstLine7, true)
        if (!vertifiy) {
          this.$pop('请输入正确的增加试重2质量（正实数）和角度（0~360）')
          return false
        }

        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.testMassTwo[0].firstLine0) &&
          this.vertifyFloat(data.testMassTwo[1].firstLine1, true)
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.testMassTwo[2].firstLine2) &&
          this.vertifyFloat(data.testMassTwo[3].firstLine3, true)
        if (!vertifiy) {
          this.$pop('请输入正确的试重2振动幅值（正实数）和相位（0~360）')
          return false
        }
      }
      if (flag == 0 || flag == 2) {
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.residualOscillation[0].firstLine0) &&
          this.vertifyFloat(
            setParam.data.residualOscillation[1].firstLine1,
            true
          )
        vertifiy =
          vertifiy &&
          this.vertifyPlusFloat(data.residualOscillation[2].firstLine2) &&
          this.vertifyFloat(
            setParam.data.residualOscillation[3].firstLine3,
            true
          )
        if (!vertifiy) {
          this.$pop('请输入正确的残余振动幅值（正实数）和相位（0~360）')
          return false
        }
      }
      if (flag == 0 || flag == 3) {
        vertifiy =
          vertifiy &&
          this.vertifyFloat(data.residualOscillation[4].firstLine4) &&
          this.vertifyFloat(data.residualOscillation[5].firstLine5, true)
        vertifiy =
          vertifiy &&
          this.vertifyFloat(data.residualOscillation[6].firstLine6) &&
          this.vertifyFloat(data.residualOscillation[7].firstLine7, true)
        if (!vertifiy) {
          this.$pop('请检验增加配重质量（非负实数）和角度（0~360）')
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
    showResidual() {
      let params = this.paramsData[this.currentKey]
      let data = params.dataBindingObject
      if (
        data.residualOscillation[0].firstLine0 == '' &&
        data.residualOscillation[1].firstLine1 == '' &&
        data.residualOscillation[2].firstLine2 == '' &&
        data.residualOscillation[3].firstLine3 == ''
      ) {
        this.$pop('残余幅值和相位不能为空！')
      } else {
        this.drawLineCharts()
      }
    },
    watchSize() {
      const _this = this
      const erd = elementResizeDetectorMaker()
      const params = this.paramsData[this.currentKey]
      const chart = params.chartData
      erd.listenTo(this.$refs.fan, (element) => {
        // 这里的this.$refs.fan指定要监听的元素对象，对应的是<div ref="fan"></div>
        const width = element.offsetWidth
        const height = element.offsetHeight
        _this.$nextTick(() => {
          // this.needHeight = width;
          if (width <= height) {
            params.needWidth = width
            params.needHeight = width
            this.$nextTick(() => {
              chart.chartObj1.resize()
              chart.chartObj2.resize()
            })
          } else {
            params.needWidth = height
            params.needHeight = height
            this.$nextTick(() => {
              chart.chartObj1.resize()
              chart.chartObj2.resize()
            })
          }
        })
      })
    },
    drawLineCharts() {
      const params = this.paramsData[this.currentKey]
      const chart = params.chartData
      const data = params.dataBindingObject
      chart.chartObj1 = echarts.init(document.getElementById('placeholderBody'))
      chart.chartObj2 = echarts.init(
        document.getElementById('placeholderBodyTwo')
      )
      let optionOne = {
        title: {
          text: '校正面1',
          textStyle: {
            color: '#fff',
          },
        },
        polar: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
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
            fontSize: 14,
            color: '#1890ff',
            formatter: function (value) {
              return '∠' + value + '°'
            },
          },
          axisPointer: {
            label: {
              color: '#fff',
              formatter: function (data) {
                return '∠' + data.value.toFixed(2) + '°'
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
          //原始幅值
          {
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
                    // [幅值，相位]
                    coord: [
                      Number(data.originalVibration[0].firstLine0),
                      Number(data.originalVibration[1].firstLine1),
                    ],
                  },
                ],
              ],
            },
          },
          // 试重1
          {
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
                color: chart.tryReviveMoveColor1,
              },
              data: [
                [
                  {
                    coord: [0, 0],
                  },
                  {
                    coord: [
                      Number(data.testMassOne[0].firstLine0),
                      Number(data.testMassOne[1].firstLine1),
                    ],
                  },
                ],
              ],
            },
          },
          // 试重2
          {
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
                color: chart.tryReviveMoveColor2,
              },
              data: [
                [
                  {
                    coord: [0, 0],
                  },
                  {
                    coord: [
                      Number(data.testMassTwo[0].firstLine0),
                      Number(data.testMassTwo[1].firstLine1),
                    ],
                  },
                ],
              ],
            },
          },
          // 试重物块
          {
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
                  name: '某个坐标',
                  coord: [
                    Number(params.setParam.Coordinate),
                    Number(data.testMassOne[5].firstLine5),
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
          // 配重物块
          {
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
                  name: '某个坐标',
                  // [坐标极值，配重角度]
                  coord: [
                    Number(params.setParam.Coordinate),
                    Number(data.residualOscillation[5].firstLine5),
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
      let optionTwo = {
        title: {
          text: '校正面2',
          textStyle: {
            color: '#fff',
          },
        },
        polar: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
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
            fontSize: 14,
            color: '#1890ff',
            formatter: function (value) {
              return '∠' + value + '°'
            },
          },
          axisPointer: {
            label: {
              color: '#fff',
              formatter: function (data) {
                return '∠' + data.value.toFixed(2) + '°'
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
          //原始幅值
          {
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
                    // [幅值，相位]
                    coord: [
                      Number(data.originalVibration[2].firstLine2),
                      Number(data.originalVibration[3].firstLine3),
                    ],
                  },
                ],
              ],
            },
          },
          // 试重1
          {
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
                color: chart.tryReviveMoveColor1,
              },
              data: [
                [
                  {
                    coord: [0, 0],
                  },
                  {
                    coord: [
                      Number(data.testMassOne[2].firstLine2),
                      Number(data.testMassOne[3].firstLine3),
                    ],
                  },
                ],
              ],
            },
          },
          // 试重2
          {
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
                color: chart.tryReviveMoveColor2,
              },
              data: [
                [
                  {
                    coord: [0, 0],
                  },
                  {
                    coord: [
                      Number(data.testMassTwo[2].firstLine2),
                      Number(data.testMassTwo[3].firstLine3),
                    ],
                  },
                ],
              ],
            },
          },
          // 试重物块
          {
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
                  name: '某个坐标',
                  coord: [
                    Number(params.setParam.Coordinate),
                    Number(data.testMassTwo[7].firstLine7),
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
          // 配重物块
          {
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
                  name: '某个坐标',
                  coord: [
                    Number(params.setParam.Coordinate),
                    Number(data.residualOscillation[7].firstLine7),
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
        data.residualOscillation[0].firstLine0 != '' &&
        data.residualOscillation[1].firstLine1 != '' &&
        optionOne.series.length < 6
      ) {
        optionOne.series.push(
          // 残值
          {
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
                      Number(data.residualOscillation[0].firstLine0),
                      Number(data.residualOscillation[1].firstLine1),
                    ],
                  },
                ],
              ],
            },
          }
        )
      }
      if (
        data.residualOscillation[2].firstLine2 != '' &&
        data.residualOscillation[3].firstLine3 != '' &&
        optionTwo.series.length < 6
      ) {
        optionTwo.series.push(
          // 残值
          {
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
                      Number(data.residualOscillation[2].firstLine2),
                      Number(data.residualOscillation[3].firstLine3),
                    ],
                  },
                ],
              ],
            },
          }
        )
      }
      chart.chartObj1.setOption(optionOne)
      chart.chartObj2.setOption(optionTwo)
      window.addEventListener('resize', () => {
        chart.chartObj1.resize()
        chart.chartObj2.resize()
      })
      this.watchSize()
    },
    changeLineColor() {
      this.$nextTick(() => {
        this.drawLineCharts()
      })
    },
    changeDirection(val) {
      const params = this.paramsData[this.currentKey]
      if (val === '1') {
        params.directionEstablished = true
        this.changeLineColor()
      } else {
        params.directionEstablished = false
        this.changeLineColor()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/css/diagnosisAssistantStyle.scss';
@import '@/assets/style/css/inputStyle.scss';
.dataList {
  width: 80% !important;
  margin-left: 20px;
}
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

