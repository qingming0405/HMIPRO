<template>
  <div class="data-retrieval-bg pop-bg" v-show="isShow">
    <div class="data-retrieval-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv"
        @mouseup="moveDivUp"
      >
      <!-- 波磨数据 -->
        <span>{{$t('Common.waveData')}}</span>
        <div class="close-retrieval" @click="closeRetrieval(0)">
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 显示机组（列车） -->
      <div class="select-box">
        <!-- 列车 -->
        <div class="select-title msg-title">{{$t('Common.train')}}</div>
        <div
          class="select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border"
        >
          {{ viewMsg.macName }}
        </div>
      </div>
      <!-- 测点选择 -->
      <div class="select-box">
        <div class="select-title msg-title">{{$t('Common.pos')}}</div>
        <div
          class="select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border"
        >
          {{ viewMsg.name }}
        </div>
      </div>
      <!-- 组织、机组、测点选择 -->
      <div class="select-box">
        <!-- 波磨数据 -->
        <div class="select-title msg-title">{{$t('Common.waveData')}}</div>

        <div
          class="select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeName"
        >
          {{ viewMsg.chooseTime.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <div class="data-retrieval-btn">
        <!-- 确定 -->
        <button @click="closeRetrieval(1)">{{$t('Common.sureBtn')}}</button>
        <!-- 取消 -->
        <button class="disable-btn" @click="closeRetrieval(0)">{{$t('Common.cancelBtn')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { getTime } from "utils/utils.js";
export default {
  props: {
    viewMsg: {
      type: Object,
      default: function () {
        return {};
        //  name:  /* 测点名称 */,
        // macName:  /* 机组名（列车名） */,
        // time:,/* 波磨时间选择 */
        // chooseTime:/* 波磨选中时间 */
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
    };
  },
  mounted() {
    let that = this;
    //鼠标移动
    window.onmousemove = function (e) {
      if (that.moveDivMsg.isDown == false || that.moveDivMsg.isDown == null) {
        return;
      }
      //获取x和y
      var nx = e.clientX;
      var ny = e.clientY;
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (that.moveDivMsg.x - that.moveDivMsg.offsetX);
      var nt = ny - (that.moveDivMsg.y - that.moveDivMsg.offsetY);

      that.moveDivMsg.dv.style.left = nl + "px";
      that.moveDivMsg.dv.style.top = nt + "px";
    };
  },
  methods: {
    // 初始化方法
    init() {
      /* 回调函数 */
      this.promise = new Promise((resolve, rejected) => {
        this.resolve = resolve;
        this.rejected = rejected;
      });
      return this.promise;
    },
    // 拖动弹窗头
    moveDiv(event) {
      this.moveDivMsg.dv = event.currentTarget.parentElement;
      this.moveDivMsg.x = event.clientX;
      this.moveDivMsg.y = event.clientY;

      //获取左部和顶部的偏移量
      this.moveDivMsg.offsetX = this.moveDivMsg.dv.offsetLeft;
      this.moveDivMsg.offsetY = this.moveDivMsg.dv.offsetTop;
      //开关打开
      this.moveDivMsg.isDown = true;
    },
    moveDivUp(event) {
      //开关关闭
      this.moveDivMsg.isDown = false;
    },
    closeRetrieval(type) {
      if (type == 0) {
        /* 取消 */
        this.isShow = false;
      } else if (type == 1) {
        /* 确定 */
        this.isShow = false;
        this.resolve(this.viewMsg);
      }
      this.remove();
    },
    remove() {
      window.onmousemove = null;
      setTimeout(() => {
        this.$destroy();
        document.getElementById("app").removeChild(this.$el);
      });
    },
    // 波磨数据下拉
    changeName(e) {
      const size = e.currentTarget.getBoundingClientRect();
      const msg = this.viewMsg;
      const text = [];
      for (let i = 0, l = msg.time.length; i < l; i++) {
        const value = msg.time[i];
        let time = getTime(value.startTime);
        text.push({
          val: time,
          startTime: value.startTime,
          endTime: value.endTime,
          icon: "",
        });
      }
      this.$list({
        text,
        pattern: {
          maxHeight: "400px",
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
      }).then((res) => {
        if (res.index > -1) {
          msg.chooseTime.val = res.item.val;
          msg.chooseTime.startTime = res.item.startTime;
          msg.chooseTime.endTime = res.item.endTime;
        }
      });
    },
  },
};
</script>