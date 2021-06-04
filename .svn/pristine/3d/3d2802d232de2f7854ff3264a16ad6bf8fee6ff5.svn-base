<!-- 波形频谱图弹窗 -->
<template>
  <div
    class='wave-alert-bg pop-bg select-none'
    v-show='isShow'
  >
    <div
      class='wave-alert-box box-shadow radius'
      ref='setFreq'
    >
      <div class='wave-alert-title select-none'>
        <div
          class="title-first"
          @mousedown='dragElem(1, $event)'
          @mouseup='dragElem(0, $event)'
        >{{title}}</div>
        <span
          class='close-wave-alert'
          @click='closeAlert(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </span>
      </div>
      <!-- 有效频段、低频过滤 -->
      <div v-if='type === 0'>
        <div
          class='wave-alert-low'
          v-if='title === "低频过滤" || title === "低阶次过滤"'
        >
          <div
            class='wave-alert-low-title'
            v-show='title === "低频过滤"'
          >过滤频率</div>
          <div
            class='wave-alert-low-title'
            v-show='title === "低阶次过滤"'
          >过滤阶次</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.lowFreq'
            class='radius'
          >
        </div>
        <div
          class='wave-alert-lower set-effective'
          v-if='title === "有效频段" || title === "有效阶次"'
        >
          <div class='wave-alert-lower-title set-effective-title'>下限</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.lowerLimit'
            class='radius'
          >
        </div>
        <div
          class='wave-alert-upper set-effective'
          v-if='title === "有效频段" || title === "有效阶次"'
        >
          <div class='wave-alert-upper-title set-effective-title'>上限</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.upperLimit'
            class='radius'
          >
        </div>
        <div
          class='wave-alert-low'
          v-if='title === "最小时间过滤"'
        >
          <div class='wave-alert-low-title'>时间过滤</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.lowFreq'
            class='radius'
          >
        </div>
        <div
          class='wave-alert-lower set-effective'
          v-if='title === "有效时间"'
        >
          <div class='wave-alert-lower-title set-effective-title'>开始时间</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.lowerLimit'
            class='radius'
          >
        </div>
        <div
          class='wave-alert-upper set-effective'
          v-if='title === "有效时间"'
        >
          <div class='wave-alert-upper-title set-effective-title'>截止时间</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.upperLimit'
            class='radius'
          >
        </div>
        <div
          class='effective-tip'
          v-show='errTip.isShow'
        >
          {{errTip.text}}
        </div>
      </div>
      <!-- 单位选择 -->
      <div v-if='type === 1'>
        <div class='wave-alert-unit select-none'>
          <div class='wave-alert-unit-title'>单位选择:</div>
          <div
            class='wave-alert-unit-value radius'
            @click='openUnitList'
          >
            {{result.unit}}
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
          <!-- <i class="iconfont icon-zhongzi-zhankai"></i> -->
        </div>
      </div>
      <!-- 包络谱图滤波设置 -->
      <div v-if='type === 2'>
        <div class='wave-alert-lower set-effective'>
          <div>滤波下限</div>
          <input
            type="number"
            maxLength='8'
            v-model='result.envelopeLow'
            class='radius'
          >
        </div>
        <div class='wave-alert-upper set-effective'>
          <div>滤波上限</div>
          <input
            type="number"
            maxLength='8'
            v-model='result.envelopeUp'
            class='radius'
          >
        </div>
        <div
          class='effective-tip'
          v-show='errTip.isShow'
        >
          {{errTip.text}}
        </div>
      </div>
      <!-- 细化谱图细化频率设置 -->
      <div v-if='type === 3'>
        <div class='wave-alert-lower set-effective'>
          <div>开始频率</div>
          <input
            type="number"
            maxLength='8'
            v-model='result.startF'
            class='radius'
          >
        </div>
        <div class='wave-alert-upper set-effective'>
          <div>截止频率</div>
          <input
            type="number"
            maxLength='8'
            v-model='result.endF'
            class='radius'
          >
        </div>
        <div class='wave-alert-lower set-effective'>
          <div>点数</div>
          <input
            type="number"
            maxLength='8'
            v-model='result.fPoints'
            class='radius'
          >
        </div>
        <div
          class='effective-tip'
          v-show='errTip.isShow'
        >
          {{errTip.text}}
        </div>
      </div>
      <!-- 所有测点有效频段设置 -->
      <div
        v-if='type === 4'
        class='set-all-pos-freq'
      >
        <div class='select-pos set-effective'>
          <div class='set-all-pos-freq-title'>选择测点</div>
          <div
            class='select-pos set-effective'
            style="margin:0px;"
            @click='setPos'
          >
            <div class='select-pos-box radius hidden'>{{result.allFreq[index].val}}</div>
            <span class='select-pos-icon'>
              <i class='iconfont icon-zhongzi-zhankai'></i>
            </span>
          </div>
        </div>
        <div class='wave-alert-lower set-effective'>
          <div class='wave-alert-lower-title set-effective-title'>开始频率</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.allFreq[index].minFreq'
            @input=setErrorTip
            class='radius'
          >
        </div>
        <div class='wave-alert-upper set-effective'>
          <div class='wave-alert-upper-title set-effective-title'>截止频率</div>
          <input
            type="number"
            maxlength="8"
            v-model='result.allFreq[index].maxFreq'
            @input=setErrorTip
            class='radius'
          >
        </div>
        <div
          class='effective-tip'
          v-show='errTip.isShow'
        >
          {{errTip.text}}
        </div>
      </div>
      <div class='wave-alert-btn'>
        <button
          v-if='type === 4'
          class='clearbtn'
          @click='closeAlert(2)'
        >清空设置</button>
        <button
          v-bind:disabled="btndisable"
          @click='closeAlert(1)'
        >确定</button>
        <button
          class='wave-cancel-btn disable-btn'
          @click='closeAlert(0)'
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import { cloneObj } from 'utils/utils.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    type: {
      /* 弹窗类型 */ type: Number,
      default: 0,
    },
    title: {
      /* 弹窗标题 */ type: String,
      default: '有效频段',
    },
    lowFreq: {
      /* 低频过滤 */ type: Number,
      default: 0,
    },
    upperLimit: {
      /* 有效频段上限 */ type: Number,
      default: 0,
    },
    lowerLimit: {
      /* 有效频段下限 */ type: Number,
      default: 0,
    },
    envelopeLow: {
      /* 包络谱图滤波下限 */ type: Number,
      default: 0,
    },
    envelopeUp: {
      /* 包络谱图滤波上限 */ type: Number,
      default: 0,
    },
    startF: {
      /* 细化谱图下限 */ type: Number,
      default: 0,
    },
    endF: {
      /* 细化谱图上限 */ type: Number,
      default: 0,
    },
    fPoints: {
      /* 细化谱图点数 */ type: Number,
      default: 0,
    },
    cur: {
      /* 单位选择当前单位 */ type: String,
      default: '',
    },
    src: {
      /* 单位选择原始单位 */ type: String,
      default: '',
    },
    unitX: {
      /* 频谱图x轴单位 */ type: String,
      default: '',
    },
    opt: {
      /* 图谱类型 */ type: Number,
      default: 0,
    },
    allFreq: {
      /* 所有测点有效频段 */ type: Array,
      default() {
        return []
      },
    },
    pType: {
      /*  测点类型 */ type: String,
      default: '',
    },
  },
  data() {
    return {
      dragMsg: {
        ref: '',
        x: 0,
        y: 0,
      },
      isShow: false,
      isWatch: false,
      index: 0,
      errTip: {
        text: '',
        isShow: false,
      },
      result: {
        /* 返回结果 */ upperLimit: '' /* 有效频段上限 */,
        lowerLimit: '' /* 有效频段下限 */,
        lowFreq: '' /* 低频过滤 */,
        envelopeLow: '' /* 包络谱图滤波下限 */,
        envelopeUp: '' /* 包络谱图滤波上限 */,
        startF: '' /* 细化谱图下限 */,
        endF: '' /* 细化谱图上限 */,
        fPoints: '' /* 细化谱图点数 */,
        unit: '' /* 单位选择当前单位 */,
        allFreq: [] /* 所有测点有效频段 */,
        isclear: 0 /* 所有测点有效频段是否清空设置 0：否；1：是 */,
      },
      chooseFreq: [],
      btndisable: false,
    }
  },
  computed: {},
  watch: {
    'result.envelopeLow'() {
      this.setErrorTip()
      /* const envelopeUp = this.result.envelopeUp;
         if (value != 0 && envelopeUp != 0) {
            if (value >= envelopeUp) {
               this.errTip = {
                  isShow: true,
                  text: '上限需要大于下限'
               };
            } else if (String(value).indexOf('.') > -1) {
               this.errTip = {
                  isShow: true,
                  text: '下限只能是整数'
               };
            } else {
               this.errTip = {
                  isShow: false,
                  text: '',
               }
            }
         } */
    },
    'result.envelopeUp'() {
      this.setErrorTip()
      /* const envelopeLow = this.result.envelopeLow;
         if (value != 0 && envelopeLow != 0) {
            if (value <= envelopeLow) {
               this.errTip = {
                  isShow: true,
                  text: '上限需要大于下限'
               };
            } else if (String(value).indexOf('.') > -1) {
               this.errTip = {
                  isShow: true,
                  text: '上限只能是整数'
               };
            } else {
               this.errTip = {
                  isShow: false,
                  text: '',
               }
            }
         } */
    },
    'result.upperLimit'() {
      this.setErrorTip()
    },
    'result.lowerLimit'() {
      this.setErrorTip()
    },
    'result.startF'() {
      this.setErrorTip()
    },
    'result.endF'() {
      this.setErrorTip()
    },
  },
  methods: {
    // 输入错误提示
    setErrorTip() {
      const res = this.result
      let max = 0
      let min = 0
      switch (this.type) {
        case 0 /* 有效频段 */:
          max = Number(res.upperLimit)
          min = Number(res.lowerLimit)
          break
        case 2 /* 包络谱图滤波 */:
          max = Number(res.envelopeUp)
          min = Number(res.envelopeLow)
          break
        case 3 /* 细化谱图细化频率 */:
          max = Number(res.endF)
          min = Number(res.startF)
          break
        case 4 /* 所有测点有效频段 */:
          max = Number(res.allFreq[this.index].maxFreq)
          min = Number(res.allFreq[this.index].minFreq)
          break
      }
      if (max !== 0 && min !== 0) {
        if (min >= max) {
          this.errTip = {
            isShow: true,
            text: '上限需要大于下限',
          }
          this.btndisable = true
          // }
          // else if (
          //   String(min).indexOf('.') > -1 ||
          //   String(max).indexOf('.') > -1
          // ) {
          //   this.errTip = {
          //     isShow: true,
          //     text: '下限只能是整数',
          //   }
          //   this.btndisable = true
        } else {
          this.errTip = {
            isShow: false,
            text: '',
          }
          this.btndisable = false
        }
      } else {
        this.errTip = {
          isShow: false,
          text: '',
        }
        this.btndisable = false
      }
    },
    // 拖动弹窗
    dragElem(type, e) {
      if (type === 1) {
        this.dragMsg = {
          x: e.offsetX,
          y: e.offsetY,
        }
        window.addEventListener('mousemove', this.dropElem)
      } else {
        window.removeEventListener('mousemove', this.dropElem)
      }
    },
    // 拖放弹窗
    dropElem(e) {
      const msg = this.dragMsg
      const el = this.$refs.setFreq
      const left = `${e.x - msg.x}px`
      const top = `${e.y - msg.y}px`
      el.style.left = left
      el.style.top = top
    },
    // 打开弹窗
    openWaveAlert() {
      this.isShow = true
      this.result = {
        upperLimit: this.upperLimit,
        lowerLimit: this.lowerLimit,
        lowFreq: this.lowFreq,
        envelopeLow: this.envelopeLow,
        envelopeUp: this.envelopeUp,
        startF: this.startF,
        endF: this.endF,
        fPoints: this.fPoints,
        unit: this.cur,
        allFreq: cloneObj(this.allFreq, true),
      }
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      this.isWatch = true
      return this.promise
    },
    // 关闭弹窗
    closeAlert(type) {
      this.isShow = false
      if (type === 0) {
        this.resolve(false)
      } else if (type === 1) {
        this.result.isclear = 0
        if (this.type === 4) {
          this.result.allFreq.forEach((item) => {
            item.changflag = 0
          })
          this.result.allFreq[this.index].changflag = 2 //通过全局有效频率设置
        }
        this.resolve(this.result)
        // this.chooseFreq = [];
        // for(let i = 0;i<this.result.allFreq.length;i++){
        //    const item = this.result.allFreq[i]
        //    if(item.maxFreq !== 0 || item.minFreq !== 0){
        //       this.chooseFreq.push(item)
        //    }
        // }
        // this.$store.commit('setChooseFreq',this.chooseFreq)
      } else if (type === 2) {
        this.result.isclear = 1
        this.resolve(this.result)
      }
      this.remove()
    },
    // 移除组件
    remove() {
      this.isWatch = false
      setTimeout(() => {
        this.$destroy()
        document.getElementById('app').removeChild(this.$el)
      })
    },
    // 打开单位选择下拉列表
    openUnitList(e) {
      const size = e.currentTarget.getBoundingClientRect()
      let text = []
      const unitArr1 = ['g', 'm/s²']
      const unitArr2 = ['gD', '°', 'mV', 'rpm']
      if (unitArr1.includes(this.src)) {
        text = [
          { icon: '', val: 'g' },
          { icon: '', val: 'm/s²' },
        ]
      }
      const spectrumArr = [2, 9]
      if (this.pType !== 14) {
        if (!spectrumArr.includes(this.opt)) {
          if (this.unitX === 'NX') {
            if (this.src === 'mm/s') {
              text.push({ icon: '', val: 'mm/s' })
            } else if (this.src === 'μm') {
              text.push({ icon: '', val: 'μm' })
            }
          } else if (!unitArr2.includes(this.src)) {
            text.push({ icon: '', val: 'mm/s' }, { icon: '', val: 'μm' })
          } else {
            return
          }
        }
      }
      this.$list({
        pattern: {
          maxHeight: '300px',
          top: `${size.top + size.height}px`,
          left: `${size.left}px`,
          width: `${size.width}px`,
        },
        text,
      }).then((res) => {
        this.closeUnitList(res.item, res.index)
      })
    },
    // 选中单位下拉列表
    closeUnitList(value, index) {
      if (value !== null && value.val !== this.cur) {
        this.result.unit = value.val
        this.$forceUpdate()
      }
    },
    // 选择测点
    setPos(e) {
      const size = e.currentTarget.getBoundingClientRect()
      const allFreq = this.result.allFreq
      const text = []
      for (let i = 0, l = allFreq.length; i < l; i++) {
        const value = allFreq[i]
        text.push({
          icon: '',
          val: value.val,
        })
      }
      this.$list({
        pattern: {
          maxHeight: '300px',
          top: `${size.top + size.height}px`,
          left: `${size.left}px`,
          width: `${size.width}px`,
        },
        text,
        rember: allFreq[this.index].val,
      }).then((res) => {
        if (res.index > -1) {
          this.index = res.index
        }
      })
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 生命周期 - 创建之前
  beforeCreate() {},
  // 生命周期 - 挂载之前
  beforeMount() {},
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {},
  // 生命周期 - 销毁之前
  beforeDestroy() {},
  // 生命周期 - 销毁完成
  destroyed() {},
  // 如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
}
</script>
<style scoped lang='scss'>
.wave-alert-bg {
  .wave-alert-box {
    position: absolute;
    .select-pos {
      position: relative;
    }
    .wave-alert-title {
      font-size: 14px;
      font-weight: bold;
      padding-left: 10px;
      width: 100%;
      display: flex;
      .title-first {
        width: calc(100% - 34px);
      }
      .close-wave-alert {
        right: 0;
      }
    }
    .wave-alert-low,
    .set-effective {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 10px;
      height: 50px;
      input {
        font-size: 12px;
        height: 20px;
        width: 160px;
        padding: 0 5px;
      }
    }
    .set-effective {
      height: 34px;
      .select-pos-box {
        width: 180px;
        padding: 0 5px;
        height: 22px;
        line-height: 22px;
      }
      .select-pos-icon {
        position: absolute;
        right: 5px;
        .iconfont {
          font-size: 12px;
        }
      }
      input {
        width: 180px;
      }
    }
    .effective-tip {
      font-size: 12px;
      text-align: center;
      height: 14px;
      line-height: 14px;
      position: absolute;
      width: 100%;
      top: 96px;
    }
    .wave-alert-btn {
      height: 62px;
      line-height: 56px;
      text-align: center;
      button {
        width: 60px;
        height: 26px;
        line-height: 26px;
      }
      .wave-cancel-btn {
        margin-left: 10px;
      }
      .clearbtn {
        margin-right: 10px;
      }
    }
    .wave-alert-unit {
      padding: 0 10px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 12px;
      .wave-alert-unit-value {
        width: 150px;
        height: 24px;
        line-height: 18px;
        padding: 0 10px;
      }
      .iconfont {
        position: absolute;
        right: 20px;
        font-size: 12px;
        margin-top: 2px;
      }
    }
    .set-all-pos-freq {
      .effective-tip {
        top: 132px;
      }
    }
  }
  .hidden {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
