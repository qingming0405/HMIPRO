<template>
  <div class="pop-box-background pop-bg" v-show="isShow">
    <div class="pop-box radius box-shadow">
      <div class="pop-box-title" @mousedown="dragElem" @mouseup="dropElem">
        查看截图
        <span class="close-pop" @click.stop="closePop(0)">
          <i class="iconfont icon-cuohao" @mousedown.stop></i>
        </span>
      </div>
      <div class="pop-box-content">
        <div class="image-list">
          <div v-for="(item, index) in images" :key="index">
            <img :src="imgUrl(item.img_url)" v-image-preview />
            <span class="delete-img" @click.stop="deleteImage(index)">
              <i class="iconfont icon-cuohao" @mousedown.stop></i>
            </span>
            <div>
              T{{ item.img_alias }}#
              <input type="text" v-model="item.img_name" />
            </div>
          </div>
        </div>
      </div>
      <div class="pop-box-button">
        <button class="pop-btn pop-btn-ok" @click="closePop(1)">确定</button>
        <button class="pop-btn pop-btn-cancel" @click="closePop(0)">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import popMixins from "../../common/popMixins";

export default {
  name: "ViewImages",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      delImgKey: [],
    };
  },
  mixins: [popMixins],
  methods: {
    // 图片路径：url访问时会产生浏览器缓存，因此访问时需添加随机数，以保证每次都是访问服务器的图片
    imgUrl(src) {
      let randomNum = Math.round(Math.random() * 1000000);
      return `${src.replace(/#/g, '%23')}?tempId=${randomNum}`;
    },
    // 删除图片
    deleteImage(index) {
      this.delImgKey.push(
        this.images[index].pos_type +
          "_" +
          this.images[index].pos_id +
          "_" +
          this.images[index].img_type
      );
      this.images.splice(index, 1);
      for (let i = index; i < this.images.length; i++) {
        this.images;
      }
    },
    closePop(type) {
      this.$emit("close-image-pop", {
        type,
        deletelist: this.delImgKey,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pop-box-background {
  left: 240px;
  width: calc(100% - 450px);
  .pop-box {
    width: 650px;
    height: 550px;
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
      margin-top: 10px;
      margin-left: 10px;
      font-size: 16px;
      width: 636px;
      height: 440px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .image-list {
        display: grid;
        grid-template-columns: 310px 310px;
        div {
          margin: 5px;
          width: 300px;
          height: 170px;
          font-size: 13px;
          position: relative;
          .delete-img {
            width: 24px;
            height: 24px;
            position: absolute;
            top: 5px;
            right: 5px;
            text-align: right;
            cursor: pointer;
            .iconfont {
              font-size: 12px;
              display: block;
              transform: scale(0.75);
            }
          }
          img {
            width: 300px;
            height: 150px;
            cursor: pointer;
          }
          div {
            color: #666666;
            input {
              width: 250px;
              border: hidden;
              text-align: center;
            }
          }
        }
      }
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