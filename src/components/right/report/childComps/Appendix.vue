<template>
  <div class="pop-box-background pop-bg" v-show="isShow">
    <div class="pop-box radius box-shadow">
      <div class="pop-box-title" @mousedown="dragElem" @mouseup="dropElem">
        机组附录
        <span class="close-pop" @click="closePop(0)">
          <i class="iconfont icon-cuohao"></i>
        </span>
      </div>
      <div class="pop-box-content">
        <table>
          <thead class="report-thead">
            <tr>
              <th></th>
              <th>{{appendixMsg.macNum}}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, key) in appendixMsg.dataObj"
              :key="key"
            >
              <td>{{key}}</td>
              <td><input type="text" v-model="item.value"/></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pop-box-button">
        <button class="pop-btn pop-btn-ok" @click="closePop(1)">
          保存
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
  name: 'Appendix',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    appendixMsg: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      
    }
  },
  mixins: [popMixins],
  methods: {
    closePop(type) {
      this.$emit('close-appendix', {
        type,
        dataObj: this.appendixMsg.dataObj
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
      table {
        width: 290px;
        thead {
          tr {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }
        }
        tbody {
          max-height: 280px;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        th,
        td {
          padding: 3px;
          width: 80px;
          border: 1px solid #cccccc;
          border-radius: 4px;
          border-collapse: collapse;
          text-align: center;
          outline: none;
        }
        th:first-child, td:first-child{
          width: 180px;
        }
        th:first-child {
          span {
            color: #6c91dd;
            text-decoration: underline;
            margin: 0px 5px;
            cursor: pointer;
          }
        }
        td {
          input {
            width: 80px;
            border: hidden;
            text-align: center;
          }
          border-top: none;
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