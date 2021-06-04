<template>
  <div class="pop-box-background pop-bg" v-show="isShow">
    <div class="pop-box radius box-shadow">
      <div class="pop-box-title" @mousedown="dragElem" @mouseup="dropElem">
        截图
        <span class="close-pop" @click="closePop(0)">
          <i class="iconfont icon-cuohao"></i>
        </span>
      </div>
      <div class="pop-box-content">
        <p>
          图片名称
          <input type="text" v-model="currImgName" placeholder="请输入图片名称">
        </p>
      </div>
      <div class="pop-box-button">
        <button class="pop-btn pop-btn-ok" @click="closePop(1)">
          确定
        </button>
        <button class="pop-btn pop-btn-cancel" @click="closePop(0)">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import popMixins from '../../common/popMixins'

export default {
  name: 'ImageName',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    currImgName: {
      type: String,
      default: () => ""
    }
  },
  mixins: [popMixins],
  methods: {
    closePop(type) {
      this.$emit('close-image-name', {
        type,
        imgName: this.currImgName
      })
    }
  }
}
</script>

<style scoped lang="scss">
.pop-box-background {
  left: 240px;
  width: calc(100% - 450px);
  .pop-box {
    width: 320px;
    // height: 400px;
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
    .pop-box-content {
      font-size: 12px;
      color: #666;
      padding: 10px 15px;
    }
    .pop-box-button {
      height: 50px;
      line-height: 50px;
      .pop-btn {
        margin-left: 15px;
        height: 26px;
        line-height: 26px;
        width: 80px;
        font-size: 14px;
        text-align: center;
        padding: 0;
      }
    }
  }
}
</style>