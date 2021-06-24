import { getTime, cloneObj } from "utils/utils.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import BASE_URL from "network/base_url.js";

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'maintain',
  props: ["data", "srcParams", "mac"],
  data () {
    const vm = window.vm;
    return {
      vm: vm,
      maintainData: {} /* 系统日志信息 */,
      head: [vm.$t('maintain.RecordName'), vm.$t('Common.startTime'), vm.$t('maintain.CompleteTime'), vm.$t('maintain.recorder'), vm.$t('maintain.annex'), vm.$t('maintain.Remarks'),],//"记录名称", "开始时间", "完成时间", "记录人", "附件", "备注"
      checkHead: false /*表头全选*/,
      addIsShow: false /*添加纪录弹窗是否出现*/,
      addStartTime: "" /*添加纪录弹窗开始时间*/,
      addEndTime: "" /*添加纪录弹窗结束时间*/,
      fileName: "" /*添加附件的文件名*/,
      recordName: "" /*记录名称*/,
      recordUser: "" /*记录人*/,
      remark: "" /*备注*/,
      fileInfo: null /*添加附件的信息*/,
      startTimes: new Date().getTime() /* 添加纪录选择的开始时间 */,
      endTimes: new Date().getTime() /* 添加纪录选择的结束时间*/,
      href: "",
      moveDivMsg: {
        x: null,
        y: null,
        offsetX: null,
        offsetY: null,
        isDown: null,
      },
    };
  },
  watch: {
    "$store.state.maintainMsg": {
      handler (value) {
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
  },
  mounted () {
    let that = this
    //鼠标移动
    window.onmousemove = function (e) {
      if (that.moveDivMsg.isDown == false || that.moveDivMsg.isDown == null) {
        return
      }
      //获取x和y
      var nx = e.clientX
      var ny = e.clientY
      const el = that.$refs.popBox;
      //计算移动后的左偏移量和顶部的偏移量
      var nl = nx - (that.moveDivMsg.x - that.moveDivMsg.offsetX)
      var nt = ny - (that.moveDivMsg.y - that.moveDivMsg.offsetY)

      el.style.left = nl + 'px'
      el.style.top = nt + 'px'
    }
  },
  methods: {
    /* 改变存储测点的数据 */
    openChartList (key, type, delKey) {
      if (typeof key !== "string") return;
      if (type === 0 || type === 1) {
        this.key = key;
        for (let k in this.maintainData) {
          this.maintainData[k].isShow = false;
        }
      }
      let [, , macId, posId, posType] = key.split("_");
      if (type == 0) {
        let startTime = this.$store.state.srcParams.time.start;
        let endTime = this.$store.state.srcParams.time.end;
        const mac = this.$store.state.checkMsg.mac;

        //添加数据
        this.$set(this.maintainData, key, {
          isShow: true,
          name: this.$t('Common.macName'),//机组名称
          body: [],
          checkHead: false,
          rd: {
            machineId: macId,
            startTime: startTime,
            endTime: endTime
          },
          type: "mac",
          mac,
          empty: {
            isShow: false,
            text: this.$t('Common.noDataText')//"无数据"
          },

        });
        let requestData = {
          machineId: macId,
          startTime: startTime,
          endTime: endTime
        };
        this.getData(requestData);
      } else if (type == 1) {
        //切换
        this.maintainData[key].isShow = true;
      } else if (type == 2) {
        //删除
        this.$delete(this.maintainData, key);
      }
    },
    getData (requestData) {
      this.$emit("loadingImg", true);
      this.$getApi.getMaintenRecords(requestData).then(res => {
        this.$emit("loadingImg", false);
        this.setData(res);
      });
    },
    // 获取数据成功
    setData (data) {
      const list = data.records;
      const system = this.maintainData[this.key];
      system.checkHead = false;
      if (list !== null && list !== undefined && list.length > 0) {
        const l = list.length;
        const body = [];
        for (let i = 0; i < l; i++) {
          const value = list[i];
          body.push({
            start_time: getTime(value.start_time),
            end_time: getTime(value.end_time),
            record_name: value.record_name,
            record_user: value.record_user,
            attach_name: value.attach_name,
            attach_data: value.attach_data,
            machine_id: value.machine_id,
            record_time: value.record_time,
            user_id: value.user_id,
            remark: value.remark,
            reserve: value.reserve,
            isCheck: false
          });
        }
        system.body = body;
        system.empty.isShow = false;
      } else {
        system.body = [];
        system.empty.isShow = true;
      }
    },
    // 设置类名
    setClass (bool, type) {
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
    addRecord () {
      this.addIsShow = true;
      let that = this;
      this.addStartTime = flatpickr(".start-times", {
        clickOpens: true,
        enableTime: true,
        time_24hr: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        defaultDate: new Date(),
        onClose (params) {
          that.startTimes = new Date(params[0]).valueOf();
        }
      });
      this.addEndTime = flatpickr(".end-times", {
        clickOpens: true,
        enableTime: true,
        time_24hr: true,
        enableSeconds: true,
        dateFormat: "Y-m-d H:i:S",
        defaultDate: new Date(),
        onClose (params) {
          that.endTimes = new Date(params[0]).valueOf();
        }
      });
    },
    // 删除记录
    deleteRecord () {
      let body = this.maintainData[this.key].body;
      let deleteList = [];
      if (body != null && body != undefined && body.length > 0) {
        body.forEach(item => {
          if (item.isCheck) {
            let obj = {};
            obj.machine_id = item.machine_id;
            obj.record_time = item.record_time;
            deleteList.push(obj);
          }
        });
      }
      if (deleteList.length > 0) {
        this.$pop({
          content: this.$t('maintain.isSureDel'),//"是否删除此条维护记录",
          btnNum: 2
        }).then(res => {
          if (res) {
            this.$getApi.delMaintenRecords(deleteList).then(res => {
              if (res.msg == 0) {
                this.getData(this.maintainData[this.key].rd);
              }
            });
          }
        });
      } else {
        this.$pop({
          content: this.$t('maintain.SelDelRecord'),//"请选择需要删除的记录"
          btnNum: 1
        });
      }
    },
    // 模拟点击按钮
    uploadFile () {
      document.getElementById("btn_file").click();
    },
    // 点击上传文件
    setsImport () {
      this.fileInfo = null;
      let dom = document.getElementById("btn_file");
      this.fileInfo = dom.files[0]; //取到上传的文件
      this.fileName = dom.files[0].name;
      dom = null;
    },
    // 全选
    checkAll () {
      let data = this.maintainData[this.key];
      data.body.forEach(item => {
        if (data.checkHead) {
          item.isCheck = true;
        } else {
          item.isCheck = false;
        }
      });
    },
    // 点击选中非选中
    changeCheck () {
      let data = this.maintainData[this.key];
      let flag = 0;
      data.body.forEach(item => {
        if (item.isCheck) {
          flag++;
        }
      });
      if (flag == data.body.length) {
        data.checkHead = true;
      }
      if (flag === 0) {
        data.checkHead = false;
      }
    },
    //下载附件
    downLoad (item) {
      this.href =
        BASE_URL.BASE_URL +
        "getAttachData?" +
        "machine_id=" +
        item.machine_id +
        "&record_time=" +
        item.record_time;
    },
    // 拖动弹出框
    dragElem (e) {
      const el = this.$refs.popBox;
      this.moveDivMsg.x = e.clientX
      this.moveDivMsg.y = e.clientY

      //获取左部和顶部的偏移量
      this.moveDivMsg.offsetX = el.offsetLeft
      this.moveDivMsg.offsetY = el.offsetTop
      //开关打开
      this.moveDivMsg.isDown = true
    },
    // 拖放弹出框
    dropElem (e) {
      this.moveDivMsg.isDown = false
    },
    // 关闭弹窗
    closeAlert (type) {
      this.addIsShow = false;
      const rd = this.maintainData[this.key].rd;
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (type === 1) {
        let param = new FormData(); // 创建form对象
        param.append("file", this.fileInfo); //对应后台接收图片名
        let json = {
          machine_id: rd.machineId,
          record_time: new Date().getTime(),
          record_name: this.recordName,
          user_id: user.id,
          record_user: this.recordUser,
          remark: this.remark,
          attach_name: this.fileName,
          attach_data: null,
          start_time: this.startTimes,
          end_time: this.endTimes
        };
        param.append("json", JSON.stringify(json));
        this.$getApi.insertMaintenRecord(param).then(res => {
          if (res.msg === 0) {
            rd.endTime = new Date().getTime();
            this.recordName = "";
            this.recordUser = "";
            this.remark = "";
            this.fileName = "";
            this.startTimes = new Date().getTime();
            this.endTimes = new Date().getTime();
            this.fileInfo = null;
            this.getData(rd);
          }
        });
      }
    },
    // 数据检索
    dataRetrieval () {
      const currentKey = this.key;
      const data = this.maintainData[currentKey];
      const currentMsg = data.mac;
      const viewMsg = {
        type: data.type,
        name: currentMsg.name || currentMsg.mac_name || currentMsg.m_me,
        key: currentMsg.machine_id,
        parentId: currentMsg.t_id
      };
      let that = this;
      this.$retrieval({
        key: "maintain",
        viewMsg
      }).then(res => {
        if (res) {
          let msg = res.msg || currentMsg;
          data.mac = msg;
          const rds = that.maintainData[that.key].rd;
          rds.machineId = msg.machine_id;
          rds.startTime = res.startTime;
          rds.endTime = res.endTime;
          that.maintainData[that.key].isShow = true;
          this.getData(rds);
        }
      });
    }
  },
  created () {
    this.$store.commit("set_keepAlive", {
      method: "add",
      keepAlive: "maintain"
    });
  }
};
