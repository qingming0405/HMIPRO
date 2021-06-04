<!-- 设备维护记录 -->
<template>
  <div class="my-system-log select-none box-shadow">
    <div
      class="system-log"
      v-for="(data, index) in maintainData"
      :key="index"
      v-show="data.isShow"
    >
      <ul class="my-system-head">
        <li>
          <label :for="'head' + index">
            <i :class="setClass(data.checkHead, 'check')"></i>
            序号
          </label>
          <input
            type="checkbox"
            :id="'head' + index"
            class="hide"
            v-model="data.checkHead"
            @change="checkAll()"
          />
        </li>
        <li
          v-for="(item, index) in head"
          :key="index"
        >{{ item }}</li>
      </ul>
      <ul class="my-system-body hide-scroll">
        <li
          v-for="(body, idx) in data.body"
          :key="idx"
        >
          <div>
            <label :for="'childCheck' + index + idx">
              <i
                class="my-icon"
                :class="setClass(body.isCheck, 'check')"
              ></i>
            </label>
            <span class="num">
              {{ idx + 1 }}
            </span>
            <input
              class="hide"
              type="checkbox"
              :id="'childCheck' + index + idx"
              v-model="body.isCheck"
              @change="changeCheck()"
            />
          </div>
          <div class="text-overflow">{{ body.record_name }}</div>
          <div class="text-overflow">{{ body.start_time }}</div>
          <div class="text-overflow">{{ body.end_time }}</div>
          <div class="text-overflow">{{ body.record_user }}</div>
          <div
            class="downloadDiv text-overflow"
            @click="downLoad(body)"
          >
            <a
              :href="href"
              :download="body.attach_name"
              class="text-overflow"
            >{{ body.attach_name }}</a>
          </div>
          <div class="text-overflow">{{ body.remark }}</div>
        </li>
      </ul>
      <div
        class="none-data-box"
        v-show="data.empty.isShow"
      >
        <span>{{ data.empty.text }}</span>
      </div>
    </div>
    <div class="search-data">
      <button @click="addRecord">添加纪录</button>
      <button @click="deleteRecord">删除记录</button>
      <button @click="dataRetrieval">数据检索</button>
    </div>
    <div
      class="pop-box-background select-none pop-bg"
      v-show="addIsShow"
      @keyup.13="enter"
    >
      <div
        class="pop-box radius box-shadow"
        @keyup.13="enter"
        ref="popBox"
      >
        <div
          class="pop-box-title"
          @mousedown="dragElem($event)"
          @mouseup="dropElem($event)"
        >
          添加纪录
          <span
            class="close-pop"
            @click.stop="closeAlert(0)"
          >
            <i
              class="iconfont icon-cuohao"
              @mousedown.stop
            ></i>
          </span>
        </div>
        <div class="pop-box-text">
          <!-- 记录名称 -->
          <div class="select-time">
            <div class="time-title">记录名称</div>
            <input
              class="time-value radius text-overflow select-none edge-border edge-outside-border"
              v-model="recordName"
            />
          </div>
          <!-- 开始时间 -->
          <div class="select-time">
            <div class="time-title">开始时间</div>
            <input class="start-times time-value radius text-overflow select-none edge-border edge-outside-border" />
          </div>
          <!-- 结束时间 -->
          <div class="select-time">
            <div class="time-title">结束时间</div>
            <input class="end-times time-value radius text-overflow select-none edge-border edge-outside-border" />
          </div>
          <!-- 记录人 -->
          <div class="select-time">
            <div class="time-title">记录人</div>
            <input
              class="time-value radius text-overflow select-none edge-border edge-outside-border"
              v-model="recordUser"
            />
          </div>
          <!-- 备注 -->
          <div class="select-time">
            <div class="time-title">备注</div>
            <textarea
              class="radius select-none edge-border edge-outside-border"
              rows="6"
              v-model="remark"
            ></textarea>
          </div>
          <!-- 附件 -->
          <div class="select-time">
            <div class="time-title">附件</div>
            <input
              class="time-value radius text-overflow edge-border select-none"
              v-model="fileName"
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
          <button
            class="pop-btn upload-btn"
            @click="uploadFile()"
          >
            上传附件
          </button>
          <button
            class="pop-btn pop-btn-ok"
            @click="closeAlert(1)"
          >
            确定
          </button>
          <button
            class="pop-btn pop-btn-cancel disable-btn"
            @click="closeAlert(0)"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import common from './maintainCommon'
export default {
  mixins: [common],
}
</script>
<style scoped lang="scss">
@mixin grid-title {
  height: 20px;
  line-height: 20px;
  text-align: right;
}
.my-system-log {
  width: 100%;
  height: 100%;
  position: relative;
  .system-log {
    width: 100%;
    height: calc(100% - 50px);
    .my-system-head {
      display: grid;
      /* grid-template-columns: 10% 20% 15% 15% 10% 30%; */
      grid-template-columns: 7% 15% 15% 15% 10% 20% 18%;
      font-size: 16px;
      li {
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
    .my-system-body {
      overflow: auto;
      max-height: calc(100% - 50px);
      li {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        display: grid;
        grid-template-columns: 7% 15% 15% 15% 10% 20% 18%;
        .num {
          display: inline-block;
          min-width: 32px;
        }
      }
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin: 0px 10px;
    }
  }
  .pop-box-background {
    .pop-box {
      width: 312px;
      // height: 366px;
      position: absolute;
      text-align: center;
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
        }
        .pop-btn-ok {
          margin: 0 5px;
        }
        .upload-btn {
          width: 90px;
        }
      }
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
        @include grid-title();
      }
      .time-value,
      .limit-value {
        padding: 0 10px;
      }
    }
  }
  .downloadDiv {
    a {
      color: #000000;
    }
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
