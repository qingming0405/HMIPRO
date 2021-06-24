<!-- 弹出框 -->
<template>
  <div
    class="pop-box-background  select-none"
    v-show="isShow"
    @keyup.13="enter"
  >
    <div
      id="pop-box"
      class="pop-box radius box-shadow"
      @keyup.13="enter"
      ref="popBox"
    >
      <div
        class="pop-box-title"
        @mousedown="dragElem($event)"
        @mouseup="dropElem($event)"
      >
        {{ title }}
        <span
          class="close-pop"
          @click.stop="closeAlert(0)"
        >
          <i class="iconfont icon-cuohao"></i>
        </span>
      </div>
      <div class="pop-box-text">{{ content }}</div>
      <div class="pop-box-button">
        <!-- 确认 -->
        <button
          v-show="btnNum === 2"
          class="pop-btn pop-btn-ok"
          @click="closeAlert(1)"
        >
          {{vm.$t('Common.sureBtn')}}
        </button>
        <!-- 取消 -->
        <button
          v-show="btnNum === 2"
          class="pop-btn pop-btn-cancel disable-btn"
          @click="closeAlert(0)"
        >
          {{vm.$t('Common.cancelBtn')}}
        </button>
        <!-- 确定 -->
        <button
          v-show="btnNum === 1"
          class="pop-btn pop-btn-ok"
          @click="closeAlert(1)"
        >
          {{vm.$t('Common.sureBtn')}}
        </button>
        <button
          v-show="btnNum === 3"
          v-for="item in btnContent"
          class="pop-btn pop-btn-cancel-1 pop-btn-ok"
          @click="closeAlert(2, item.index)"
        >
          {{ item.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'PopBox',
  data() {
    const vm = window.vm
    return {
      vm: vm,
      offset: {
        x: 0,
        y: 0,
      },
      isShow: false,
      promise: '',
      resolve: '',
      reject: '',
      moveDivMsg: {
        x: null,
        y: null,
        offsetX: null,
        offsetY: null,
        isDown: null,
      },
      viewText: [] /* 提示文字 */,
    }
  },
  props: {
    title: {
      type: String,
      default: '提示', //'提示',
    },
    content: {
      type: String,
      default: '内容',
    },
    btnNum: {
      type: Number,
      default: 1,
    },
    /* 其他的类型 */
    btnContent: {
      type: Array,
      default: function () {
        return [{ name: '', index: 0 }]
      },
    },
  },
  created() {
    this.title = vm.$t('Common.tips') //'提示'
  },
  mounted() {
    let that = this
    //鼠标移动
    window.onmousemove = function (e) {
      if (that.moveDivMsg.isDown == false || that.moveDivMsg.isDown == null) {
        return
      }
      //获取x和y
      var nx = e.clientX
      var ny = e.clientY
      const el = that.$refs.popBox
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (that.moveDivMsg.x - that.moveDivMsg.offsetX)
      var nt = ny - (that.moveDivMsg.y - that.moveDivMsg.offsetY)

      el.style.left = nl + 'px'
      el.style.top = nt + 'px'
    }
  },
  methods: {
    // 拖动弹出框
    dragElem(e) {
      const el = this.$refs.popBox
      this.moveDivMsg.x = e.clientX
      this.moveDivMsg.y = e.clientY

      //获取左部和顶部的偏移量
      this.moveDivMsg.offsetX = el.offsetLeft
      this.moveDivMsg.offsetY = el.offsetTop
      //开关打开
      this.moveDivMsg.isDown = true
    },
    // 拖放弹出框
    dropElem(e) {
      //开关关闭
      this.moveDivMsg.isDown = false
    },
    // 打开弹窗
    openAlert() {
      this.isShow = true
      document.addEventListener('keydown', this.enter)
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    // 关闭弹窗
    closeAlert(type, index) {
      this.isShow = false
      document.removeEventListener('keydown', this.enter)
      if (type === 0) {
        this.resolve(false)
      } else if (type === 1) {
        this.resolve(true)
      } else if (type === 2) {
        this.resolve(index)
      }
      this.remove()
    },
    // 移除组件
    remove() {
      window.onmousemove = null
      setTimeout(() => {
        this.$destroy()
        document.getElementById('app').removeChild(this.$el)
      })
    },
    // 监听回车
    enter(e) {
      if (e && e.keyCode === 13) {
        this.closeAlert(1)
      }
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.White-content {
  .pop-box-background {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    .pop-box {
      width: 260px;
      min-height: 124px;
      position: absolute;
      text-align: center;
      .pop-box-title {
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        text-align: left;
        padding-left: 20px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        position: relative;
        .close-pop {
          width: 34px;
          height: 34px;
          position: absolute;
          right: 10px;
          text-align: center;
          .iconfont {
            font-size: 12px;
            display: block;
            transform: scale(0.75);
          }
        }
      }
      .pop-box-text {
        min-height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
      .pop-box-button {
        height: 50px;
        line-height: 50px;
        .pop-btn {
          height: 26px;
          line-height: 26px;
          width: 60px;
          font-size: 14px;
          text-align: center;
          padding: 0;
        }
        .pop-btn-cancel {
          margin-left: 15px;
        }
        .pop-btn-cancel-1 {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
