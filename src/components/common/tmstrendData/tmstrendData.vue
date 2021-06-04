<template>
  <div
    class="data-retrieval-bg"
    v-show="isShow"
    id="data-retrieval-bg-tms"
  >
    <div class="data-retrieval-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv"
        @mouseup="moveDivUp"
      >
        <span>波磨数据</span>
        <div
          class="close-retrieval"
          @click="closeRetrieval"
        >
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 测点选择 -->
      <div class="select-box">
        <div class="select-title msg-title">测点</div>
        <div
          class="select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changePos"
        >
          {{ viewMsg.choosePos.name }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 组织、机组、测点选择 -->
      <div class="check-eigenvalue-box scroll-style-edge">
        <div class="select-title">
          <p>时间列表</p>
        </div>
        <div
          class="radius select-none"
          id="my-posList"
        >
          <div
            v-for="item in viewMsg.chooseTimeList"
            draggable="true"
            @dragstart="dragPos(item, $event)"
          >
            {{ item.val }}
          </div>
        </div>
      </div>
      <div class="data-retrieval-btn">
        <button
          class="add-pos"
          @click="addPos"
        >加入测点</button>
        <button
          class="disable-btn"
          @click="closeRetrieval"
        >取消</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getTime } from 'utils/utils.js'
export default {
  props: {
    viewMsg: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      moveDivMsg: {
        /* 移动的表头信息 */ x: null,
        y: null,
        offsetX: null,
        offsetY: null,
        isDown: null,
        dv: null,
      },

      isShow: true /* 控制显隐 */,
    }
  },
  mounted() {
    let that = this
    //鼠标移动
    window.addEventListener('mousemove', this.moveEvent)
  },
  methods: {
    // 初始化方法
    init() {
      /* 回调函数 */
      this.promise = new Promise((resolve, rejected) => {
        this.resolve = resolve
        this.rejected = rejected
      })
      return this.promise
    },
    moveEvent(e) {
      if (this.moveDivMsg.isDown == false || this.moveDivMsg.isDown == null) {
        return
      }
      //获取x和y
      var nx = e.clientX
      var ny = e.clientY
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (this.moveDivMsg.x - this.moveDivMsg.offsetX)
      var nt = ny - (this.moveDivMsg.y - this.moveDivMsg.offsetY)

      this.moveDivMsg.dv.style.left = nl + 'px'
      this.moveDivMsg.dv.style.top = nt + 'px'
    },
    // 拖动弹窗头
    moveDiv(event) {
      this.moveDivMsg.dv = event.currentTarget.parentElement
      this.moveDivMsg.x = event.clientX
      this.moveDivMsg.y = event.clientY

      //获取左部和顶部的偏移量
      this.moveDivMsg.offsetX = this.moveDivMsg.dv.offsetLeft
      this.moveDivMsg.offsetY = this.moveDivMsg.dv.offsetTop
      //开关打开
      this.moveDivMsg.isDown = true
    },
    moveDivUp(event) {
      //开关关闭
      this.moveDivMsg.isDown = false
    },
    closeRetrieval() {
      /* 取消 */
      this.isShow = false
      this.remove()
      this.resolve(true)
    },
    /* 移除 */
    remove() {
      window.removeEventListener('mousemove', this.moveEvent)
      setTimeout(() => {
        this.$destroy()
        document.getElementById('app').removeChild(this.$el)
      })
    },
    // 测点下拉选择
    changePos(e) {
      const size = e.currentTarget.getBoundingClientRect()
      const msg = this.viewMsg
      const text = []
      for (let i = 0, l = msg.posList.length; i < l; i++) {
        const value = msg.posList[i]
        text.push({
          val: value.name,
          itemInfo: value,
        })
      }
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
      }).then((res) => {
        if (res) {
          msg.choosePos = res.item.itemInfo
          msg.chooseTimeList = msg.timeList[res.item.itemInfo.posFlag]
        }
      })
    },
    /* 加入当前测点 */
    addPos() {
      this.$bus.$emit('tmsTrendAddPos')
    },

    /* 拖动测点 */
    dragPos(listData, e) {
      const str = JSON.stringify(listData)
      e.dataTransfer.setData('flag', str)
    },
  },
}
</script>
<style lang="scss" scoped>
#data-retrieval-bg-tms {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transform: translate(-50%, -50%);
  @media screen and (max-height: 1366px) {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 778px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transform: translate(-50%, -50%);
  }
}

#my-posList {
  height: 200px;
  overflow: auto;
  border: 1px solid #ccc;
  div {
    padding: 0 20px;
    text-align: left;
    &:hover {
      background: #0a53a0;
    }
  }
}
.data-retrieval-btn {
  .add-pos {
    width: 70px !important;
    background: #a47c42;
    &:hover {
      background: #806133;
    }
  }
}
</style>