<template>
  <div class="pop-box-background pop-bg" v-show="isShow">
    <div class="pop-box radius box-shadow">
      <div class="pop-box-title" @mousedown="dragElem" @mouseup="dropElem">
        导出
        <span class="close-pop" @click="closePop(0)">
          <i class="iconfont icon-cuohao"></i>
        </span>
      </div>
      <div class="pop-box-content">
        <ul class="report-list">
          <li v-for="(item, key) in exportMsg.base" :key="key">
            <div class="list-name radius">{{ item.title }}</div>
            <input type="text" v-if="key === 'startTime'" class="report-time begin-time" />
            <input type="text" v-else-if="key === 'endTime'" class="report-time end-time" />
            <div v-else-if="key === 'classification'" class="radius default-border" @click.stop="selectClassification(item, $event)" >
              {{item.val}}
              <i class="iconfont icon-zhongzi-zhankai"></i> 
            </div>
            <textarea v-else-if="key === 'summary'" v-model="item.val"></textarea>
            <input type="text" v-else class="radius default-border" maxlength="20" v-model="item.val" />
          </li>
        </ul>
        <table v-if="exportMsg.modelType === '1'">
          <thead class="report-thead">
            <tr>
              <th>
                <span @click="addRow">添加</span
                ><span @click="deleteRow">删除</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, key) in exportMsg.macConfig"
              :key="key"
              @click="selectRow(key)"
            >
              <td><input type="text" v-model="item.key" /></td>
              <td><input type="text" v-model="item.val" /></td>
            </tr>
          </tbody>
        </table>
        <table v-if="exportMsg.modelType === '0'">
          <thead class="report-thead">
            <tr>
              <th>
                <span @click="addRow">添加</span
                ><span @click="deleteRow">删除</span>
              </th>
              <th>组件</th>
              <th>评估加速度({{ exportMsg.base.unit.val }})</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, key) in exportMsg.evaluate"
              :key="key"
              @click="selectRow(key)"
            >
              <td><input type="text" v-model="item.type" /></td>
              <td><input type="text" v-model="item.key" /></td>
              <td><input type="text" v-model="item.val" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pop-box-button">
        <button class="pop-btn pop-btn-ok" @click="closePop(1)">
          保存模板
        </button>
        <button class="pop-btn pop-btn-ok" @click="closePop(2)">
          导出报告
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
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Mandarin } from "flatpickr/dist/l10n/zh";

export default {
  name: "ExportConfig",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    exportMsg: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentIndex: -1, // 表格选中行
      beginDate: null,
      endDate: null,
    };
  },
  mixins: [popMixins],
  created() {
    let time = new Date().getTime();
    time -= time % (3600 * 24 * 1000);
    time -= 3600 * 8 * 1000;
    this.exportMsg.base.startTime.val = `${time}`;
    this.exportMsg.base.endTime.val = `${time + 3600 * 24 * 1000}`;
  },
  mounted() {
    const that = this;
    this.beginDate = flatpickr(".begin-time", {
      locale: Mandarin, //汉化
      clickOpens: true,
      dateFormat: "Y-m-d",
      time_24hr: true,
      defaultDate: Date.now(),
      onChange(params) {
        const time = new Date(params[0]);
        that.exportMsg.base.startTime.val = `${time.getTime()}`;
      },
    });
    this.endDate = flatpickr(".end-time", {
      locale: Mandarin, //汉化
      clickOpens: true,
      dateFormat: "Y-m-d",
      time_24hr: true,
      defaultDate: Date.now(),
      onChange(params) {
        const time = new Date(params[0].getTime() + 3600 * 24 * 1000);
        that.exportMsg.base.endTime.val = `${time.getTime()}`;
      },
    });
  },
  methods: {
    /* 流程 */

    
    /* 事件 */
    selectClassification(obj, e) {
      const size = e.currentTarget.getBoundingClientRect();
      const style = {
        maxHeight: "auto",
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height}px`,
      };
      this.$list({
        text: obj.options,
        pattern: style,
      }).then((res) => {
        if (res.item !== null) {
          obj.val = res.item.val;
          obj.key = res.item.key;
        }
      });
    },
    addRow() {
      if(this.exportMsg.modelType === '1'){
        this.exportMsg.macConfig.push({ key: "", val: ""});
      }
      else{
        this.exportMsg.evaluate.push({ key: "", val: "", type: "" });
      }
      
    },
    deleteRow() {
      if (this.currentIndex == -1) {
        return;
      }
      if(this.exportMsg.modelType === '1'){
        this.exportMsg.macConfig.splice(this.currentIndex, 1);
      }
      else {
         this.exportMsg.evaluate.splice(this.currentIndex, 1);
      }
    },
    selectRow(index) {
      this.currentIndex = index;
    },
    // 关闭导出配置
    closePop(type) {
      if (type > 0 && this.validExport() === false) {
        return;
      }
      const exportMsg = this.exportMsg
      this.$emit("close-report-pop", {
        type,
        exportMsg
      });
    },
    /* 事件方法区 */
    validExport() {
      if (this.exportMsg.base.reportDate.val === "") {
        this.$pop("报告日期不能为空");
        return false;
      }
      if(this.exportMsg.modelType === '1'){
        if (this.exportMsg.base.reportName.val === "") {
          this.$pop("项目名称不能为空");
          return false;
        }
        if (this.exportMsg.base.macModel.val === "") {
          this.$pop("机组名称不能为空");
          return false;
        }
        if (this.exportMsg.base.documentNo.val === "") {
          this.$pop("文件号不能为空");
          return false;
        }
        if (this.exportMsg.base.revision.val === "") {
          this.$pop("版本不能为空");
          return false;
        }
      }
      else{
        if (this.exportMsg.base.reportName.val === "") {
          this.$pop("报告名称不能为空");
          return false;
        }
        if (this.exportMsg.base.startTime.val - this.exportMsg.base.endTime.val >= 0) {
          this.$pop("开始时间不能超过结束时间");
          return false;
        }
        if (this.exportMsg.base.compiling.val === "") {
          this.$pop("编制不能为空");
          return false;
        }
        if (this.exportMsg.base.examine.val === "") {
          this.$pop("校核不能为空");
          return false;
        }
        if (this.exportMsg.base.approval.val === "") {
          this.$pop("审核不能为空");
          return false;
        }
        if (this.exportMsg.base.unit.val === "") {
          this.$pop("振动单位不能为空");
          return false;
        }
      }
      if (this.exportMsg.base.summary.val === "") {
        this.$pop("项目概述不能为空");
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped lang="scss">
.pop-box-background {
  left: 240px;
  width: calc(100% - 450px);
  .pop-box {
    width: 720px;
    height: 430px;
    position: absolute;
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
      width: 700px;
      height: 320px;
      color: #666666;
      display: grid;
      grid-template-columns: 280px 300px;
      .report-list {
        li {
          display: grid;
          grid-template-columns: 80px 200px;
          .list-name {
            text-align: right;
            padding-right: 8px;
          }
          div {
            height: 21px;
            font-size: 12px;
            color: #666666;
            &:last-child {
              padding: 0 5px;
              position: relative;
              .iconfont {
                position: absolute;
                right: 5px;
                font-size: 12px;
                color: #666666;
              }
            }
          }
          input {
            color: #666666;
            border-color: #ccc;
            border-radius: 4px;
            padding-left: 3px;
          }
          textarea {
            resize: none;
            width: 100%;
            height: 120px;
            color: #666666;
            border-color: #ccc;
            border-radius: 4px;
            &::-webkit-scrollbar {
              display: none;
            }
          }
          margin-bottom: 4px;
        }
      }
      table {
        margin-left: 15px;
        margin-right: 15px;
        // border: 1px solid #CCCCCC;
        // border-radius: 4px;
        // border-collapse: collapse;
        font-size: 12px;
        color: #666666;
        thead {
          padding: 0px;
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
          width: 120px;
          border: 1px solid #cccccc;
          border-radius: 4px;
          border-collapse: collapse;
          text-align: center;
          outline: none;
        }
        /* th:first-child, td:first-child{
              width: 130px;
            } */
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
            width: 100px;
            border: hidden;
            text-align: center;
          }
          border-top: none;
        }
      }
    }
    .pop-box-button {
      text-align: center;
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