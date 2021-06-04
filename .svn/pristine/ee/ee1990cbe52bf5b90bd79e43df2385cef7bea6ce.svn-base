<!-- 设备参数设置 -->
<template>
  <div class="my-system-log select-none box-shadow">
    <div
      class="system-log"
      v-for="(data, index) in chartData"
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
        <li v-for="(item, index) in head" :key="index">{{ item }}</li>
      </ul>
      <ul class="my-system-body hide-scroll">
        <li v-for="(body, idx) in data.body" :key="idx">
          <div>
            <label :for="'childCheck' + index + idx">
              <i class="my-icon" :class="setClass(body.isCheck, 'check')"></i>
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
          <div class="text-overflow">{{ body.m_me }}</div>
          <div class="text-overflow">{{ body.device_type }}</div>
          <div class="text-overflow">{{ body.param_name }}</div>
          <div class="text-overflow">{{ body.value }}</div>
        </li>
      </ul>
      <div class="none-data-box" v-show="data.empty.isShow">
        <span>{{ data.empty.text }}</span>
      </div>
    </div>
    <div class="search-data">
      <button @click="addRecord">添加参数</button>
      <button @click="deleteRecord">删除参数</button>
      <button @click="exportData">导出数据</button>
    </div>
    <div
      class="pop-box-background select-none pop-bg"
      v-show="addIsShow"
      @keyup.13="enter"
    >
      <div class="pop-box radius box-shadow" @keyup.13="enter" ref="popBox">
        <div
          class="pop-box-title"
          @mousedown="dragElem(1, $event)"
          @mouseup="dragElem(0, $event)"
        >
          添加参数
          <span class="close-pop" @click="closeAlert(0)">
            <i class="iconfont icon-cuohao"></i>
          </span>
        </div>
        <div class="pop-box-text">
          <!-- 记录名称 -->
          <div class="select-time-mac">
            <div class="time-title">机组</div>
            <div
              class="time-value radius text-overflow select-none edge-border edge-outside-border"
              @click.stop="chooseMac"
            >
              {{ params.macName }}
            </div>
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
          <div class="select-time">
            <div class="time-title">设备类型</div>
            <input
              class="time-value radius text-overflow select-none edge-border edge-outside-border"
              v-model="params.device_type"
            />
          </div>
          <div class="select-time">
            <div class="time-title">参数名称</div>
            <input
              class="time-value radius text-overflow select-none edge-border edge-outside-border"
              v-model="params.param_name"
            />
          </div>
          <div class="select-time">
            <div class="time-title">数值</div>
            <input
              class="time-value radius text-overflow select-none edge-border edge-outside-border"
              v-model="params.value"
            />
          </div>
        </div>
        <div class="pop-box-button">
          <button class="pop-btn pop-btn-ok" @click="closeAlert(1)">
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
import { getTime, cloneObj } from "utils/utils.js";
import BASE_URL from "network/base_url.js";

export default {
  name: "equipmentParameters", // 设备参数
  data() {
    return {
      chartData: {} /* 系统日志信息 */,
      head: ["机组", "设备类别", "参数名称", "数值"],
      params: {
        macId: "",
        macName: "",
        device_type: "", //设备类型
        param_name: "", //参数名称
        value: "" //值
      },
      addIsShow: false /*添加纪录弹窗是否出现*/
    };
  },
  methods: {
    /* 改变存储测点的数据 */
    openChartList(key, type, delKey) {
      if (typeof key !== "string") return;
      if (type === 0 || type === 1) {
        this.key = key;
        for (let k in this.chartData) {
          this.chartData[k].isShow = false;
        }
      }
      /* 获取当前的t_id */
      let t_id = this.$store.state.checkMsg.tree.t_id;
      let t_Name = this.$store.state.checkMsg.tree.t_name;
      let macArray = this.$store.state.mac[t_id];
      //给默认值
      if (macArray && macArray[0]) {
        this.params.macId = macArray[0].mac_id;
        this.params.macName = macArray[0].mac_me;
      }
      if (type == 0) {
        //添加数据
        this.$set(this.chartData, key, {
          isShow: true,
          checkHead: false /*表头全选*/,
          macArray, //组织下面所有的机组
          t_id,
          t_Name,
          body: [], //放所有数据
          rd: {
            tree_ids: [t_id] //当前组织的id
          },
          empty: {
            isShow: false,
            text: "无数据"
          }
        });
        /* 获得设备参数 */
        this.getData();
      } else if (type == 1) {
        //切换
        this.chartData[key].isShow = true;
      } else if (type == 2) {
        //删除
        this.$delete(this.chartData, key);
      }
    },
    getData() {
      let chartData = this.chartData[this.key];
      let requestData = this.chartData[this.key].rd;
      this.$emit("loadingImg", true);
      this.$getApi.getDeviceParameters(requestData).then(res => {
        this.$emit("loadingImg", false);
        if (res) {
          if (res.data.length > 0) {
            let body = [];
            res.data.forEach(item => {
              item.isCheck = false;
              body.push(item);
            });
            chartData.body = body;
          } else {
            chartData.body = [];
          }
        }
      });
    },

    // 设置类名
    setClass(bool, type) {
      const iName = "iconfont";
      const strArr = {
        check: ["icon-zhongzi_xuanzekuang", "icon-zhongzi_xuanzekuang1"],
        open: ["icon-zhankai_huaban", "icon-shouqi_huaban"],
        isOpen: [
          "my-census-li text-overflow",
          "my-census-li text-overflow openList"
        ],
        hasOpen: ["", "hasOpen"],
        tHead: ["census-list-head", "census-list-head-pos"],
        tBody: ["census-list-body", "census-list-body-pos"]
      };
      return `${iName} ${strArr[type][Number(bool)]}`;
    },
    // 添加纪录
    addRecord() {
      this.addIsShow = true;
    },
    // 删除记录
    deleteRecord() {
      let body = this.chartData[this.key].body;
      let deleteList = [];
      if (body != null && body != undefined && body.length > 0) {
        body.forEach(item => {
          if (item.isCheck) {
            let obj = {};
            obj.device_type = item.device_type;
            obj.id = item.id;
            obj.param_name = item.param_name;
            deleteList.push(obj);
          }
        });
      }
      if (deleteList.length > 0) {
        this.$pop({
          content: "是否删除此条记录",
          btnNum: 2
        }).then(res => {
          if (res) {
            this.$getApi.deleteDeviceParam(deleteList).then(res => {
              if (res.msg == 0) {
                this.getData();
              }
            });
          }
        });
      } else {
        this.$pop({
          content: "请选择需要删除的记录",
          btnNum: 1
        });
      }
    },
    // 全选
    checkAll() {
      let data = this.chartData[this.key];
      data.body.forEach(item => {
        if (data.checkHead) {
          item.isCheck = true;
        } else {
          item.isCheck = false;
        }
      });
    },
    // 点击选中非选中
    changeCheck() {
      let data = this.chartData[this.key];
      let flag = 0;
      data.body.forEach(item => {
        if (item.isCheck) {
          flag++;
        }
      });
      if (flag == data.body.length) {
        data.checkHead = true;
      } else {
        data.checkHead = false;
      }
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
    // 关闭弹窗
    closeAlert(type) {
      this.addIsShow = false;
      if (type === 1) {
        /* 点击确定按钮 */
        let t_id = this.chartData[this.key].t_id;
        let requestData = [
          {
            tree_id: t_id,
            m_me: null,
            device_type: this.params.device_type,
            id: this.params.macId,
            param_name: this.params.param_name,
            value: this.params.value
          }
        ];

        // 将数据发送给服务器
        this.$getApi.insertAndUpdateDeviceParam(requestData).then(res => {
          if (res) {
            /* 成功添加之后，刷新所有数据 */
            this.getData();
            /* 清空参数列表 */
            this.params.device_type = "";
            this.params.param_name = "";
            this.params.value = "";
          }
        });
      }
    },
    /* 选择机组 */
    chooseMac(e) {
      let text = [];
      let macArray = this.chartData[this.key].macArray;
      if (macArray) {
        macArray.forEach(item => {
          text.push({ type: item.mac_id, val: item.mac_me });
        });
      }
      const size = e.currentTarget.getBoundingClientRect();
      this.$list({
        text,
        pattern: {
          maxHeight: "400px",
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`
        }
      }).then(res => {
        if (res.index > -1) {
          this.params.macId = res.item.type;
          this.params.macName = res.item.val;
        }
      });
    },
    // 导出数据
    exportData() {
      /* 下载csv文件 */
      let chartData = this.chartData[this.key];
      let t_Name = chartData.t_Name;
      // /* 获取当前数据，拼装成json */
      let body = chartData.body;
      let myData = [];
      body.forEach(item => {
        if (item.isCheck) {
          myData.push({
            机组: item.m_me,
            设备类型: item.device_type,
            参数名称: item.param_name,
            数值: item.value
          });
        }
      });
      let fields = ["机组", "设备类型", "参数名称", "数值"];
      var Parser = require("json2csv").Parser;
      let json2csvParser = new Parser({ fields });
      let csv = json2csvParser.parse(myData);
      csv = "\ufeff" + csv;
      var aTag = document.createElement("a");
      var blob = new Blob([csv]);
      aTag.download = `设备参数${t_Name}.csv`;
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
    }
  },
  created() {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "equipmentParameters"
    });
  },
  watch: {
    "$store.state.equipmentParametersMsg": {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift();
            this.openChartList(item.key, item.state);
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
};
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
      grid-template-columns: 7% 23% 23% 23% 24%;
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
        grid-template-columns: 7% 23% 23% 23% 24%;
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
    .select-time-mac,
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
    .select-time-mac {
      position: relative;
      text-align: left;
      .time-value {
        border: 1px solid #fff !important;
      }
      i {
        position: absolute;
        right: 16px;
        top: 4px;
        font-size: 5px;
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
