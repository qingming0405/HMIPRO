<template>
  <div class="pop-box-background-edge  ">
    <div class="pop-box radius " ref="popBox">
      <div
        class="pop-box-title"
        @mousedown="dragElem(1, $event)"
        @mouseup="dragElem(0, $event)"
      >
        添加纪录
        <span class="close-pop" @click.stop="closeAlert()">
          <i class="iconfont icon-cuohao" @mousedown.stop></i>
        </span>
      </div>
      <div class="pop-box-text">
        <!-- 记录名称 -->
        <div class="select-time">
          <div class="time-title">记录名称</div>
          <input
            class="time-value radius text-overflow select-none"
            v-model="record.recordName"
          />
        </div>
        <!-- 开始时间 -->
        <div class="select-time">
          <div class="time-title">开始时间</div>
          <input
            class="start-times time-value radius text-overflow select-none retrieval-start-time-record"
          />
        </div>
        <!-- 结束时间 -->
        <div class="select-time">
          <div class="time-title">结束时间</div>
          <input
            class="end-times time-value radius text-overflow select-none retrieval-end-time-record"
          />
        </div>
        <!-- 记录人 -->
        <div class="select-time">
          <div class="time-title">记录人</div>
          <input
            class="time-value radius text-overflow select-none"
            v-model="record.recordUser"
          />
        </div>
        <!-- 备注 -->
        <div class="select-time">
          <div class="time-title">备注</div>
          <textarea
            class="radius select-none"
            rows="6"
            v-model="record.remark"
          ></textarea>
        </div>
        <!-- 附件 -->
        <div class="select-time">
          <div class="time-title">附件</div>
          <input
            class="time-value radius text-overflow select-none"
            v-model="record.fileName"
            readonly
          />
        </div>
      </div>
      <div class="pop-box-button">
        <input
          type="file"
          id="btn_file"
          style="display:none"
          @change="setsImport"
        />
        <button class="pop-btn upload-btn" @click="uploadFile()">
          上传附件
        </button>
        <button class="pop-btn pop-btn-ok" @click="closeAlert(1)">
          确定
        </button>
        <button
          class="pop-btn pop-btn-cancel disable-btn"
          @click="closeAlert()"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import { Mandarin } from "flatpickr/dist/l10n/zh";
import "flatpickr/dist/themes/dark.css";
export default {
  name: "record",
  data() {
    return {
      record: {
        recordName: "", //记录名称
        recordUser: "", //记录人
        remark: "", //备注
        fileName: "", // 附件名称
        fileInfo: null
      }, // 记录类容
      promise: null,
      resolve: null,
      rejected: null,
      startTime: null,
      endTime: null
    };
  },
  methods: {
    // 初始化方法
    init() {
      this.promise = new Promise((resolve, rejected) => {
        this.resolve = resolve;
        this.rejected = rejected;
      });
      let dom = document.getElementsByClassName("retrieval-start-time-record");
      if (dom.length !== 0) {
        this.startTime = flatpickr(".retrieval-start-time-record", {
          locale: Mandarin,
          clickOpens: true,
          time_24hr: true,
          enableTime: true,
          enableSeconds: true,
          dateFormat: "Y-m-d H:i:S",
          defaultDate: new Date() - 1000 * 60 * 60 * 24
        });
        this.endTime = flatpickr(".retrieval-end-time-record", {
          locale: Mandarin,
          clickOpens: true,
          time_24hr: true,
          enableTime: true,
          enableSeconds: true,
          dateFormat: "Y-m-d H:i:S",
          defaultDate: new Date()
        });
      }
      return this.promise;
    },
    // 拖动弹出框
    dragElem(type, e) {
      this.offset = {
        x: e.offsetX,
        y: e.offsetY
      };
      if (type === 1) {
        this.$refs.popBox.addEventListener("mousemove", this.dropElem);
      } else {
        this.$refs.popBox.removeEventListener("mousemove", this.dropElem);
      }
    },
    // 拖放弹出框
    dropElem(e) {
      const el = this.$refs.popBox;
      const offset = this.offset;
      el.style.left = `${e.x - offset.x}px`;
      el.style.top = `${e.y - offset.y}px`;
    },
    // 模拟点击按钮
    uploadFile() {
      document.getElementById("btn_file").click();
    },
    // 点击上传文件
    setsImport() {
      this.fileInfo = null;
      let dom = document.getElementById("btn_file");
      this.record.fileInfo = dom.files[0]; //取到上传的文件
      this.record.fileName = dom.files[0].name;
      dom = null;
    },
    closeAlert(type) {
      if (type === 1) {
        //确定
        let ob = {
          startTime: this.startTime.selectedDates[0].valueOf(),
          endTime: this.endTime.selectedDates[0].valueOf()
        };
        Object.assign(ob, this.record);
        this.resolve(ob);
      }
      this.$destroy();
      document.getElementById("app").removeChild(this.$el);
    }
  }
};
</script>

<style scoped lang="scss">
.pop-box-background-edge {
  color: #fff;
  .pop-box-title {
    color: #fff;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    text-align: left;
    padding-left: 20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    position: relative;
    .icon-cuohao {
      position: absolute;
      right: 10px;
    }
  }
  .pop-box {
    top: 30%;
    left: 40%;
    background: #103760;
    width: 312px;
    // height: 366px;
    position: absolute;
    text-align: center;
    border-radius: 5px;
    .pop-box-text {
      font-size: 16px;
      width: 95%;
      margin: 15px auto 0;
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
        cursor: pointer;
      }
      .pop-btn-ok {
        margin: 0 5px;
      }
      .upload-btn {
        width: 90px;
      }
    }
  }
  .radius,
  button {
    border-radius: 4px;
  }

  // 选择时间、设置上下限
  .select-time,
  .set-limit {
    display: grid;
    grid-template-columns: 20% 75%;
    grid-column-gap: 2%;
    margin-bottom: 10px;
    font-size: 12px;
    textarea {
      resize: none;
      width: 100%;
    }
    .time-title,
    .limit-title {
      text-align: right;
    }
    .time-value,
    .limit-value {
      padding: 0 10px;
    }
  }
}
</style>
