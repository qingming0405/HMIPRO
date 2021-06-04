import { getTimeOfType } from "utils/utils.js";
import flatpickr from "flatpickr";
import { Mandarin } from "flatpickr/dist/l10n/zh";
import "flatpickr/dist/flatpickr.min.css";
const MyMixins = {
  data () {
    return {
      isShow: true /* 控制显隐 */,
      resolve: "",
      reject: "",
      msgTitle: "" /* 组织、机组、测点 */,
      posName: "" /* 测点名称 */,
      dateType: {
        /* 时间类型 */
        type: 0,
        val: "前一天"
      },
      startTime: null /* 开始时间工具实例 */,
      endTime: null /* 结束时间工具实例 */,
      dateOption: [
        /* 时间类型 */
        { type: "day", val: "前一天" },
        { type: "week", val: "前一周" },
        { type: "month", val: "前一月" },
        { type: "quarter", val: "前一季" },
        { type: "year", val: "前一年" }
      ],
      densityData: [
        /* 查询密度 */
        { type: 2, val: "全部" },
        { type: 4, val: "高密度" },
        { type: 8, val: "中密度" },
        { type: 16, val: "低密度" }
        // { type: 32, val: '报警数据' },
      ],
      density: {
        /* 选中查询密度型 */
        type: 2,
        val: "全部"
      },
      dataType: null,
      changeMsg: null /* 修改的组织、机组、测点信息 */,
      result: {
        startTime: null /* 开始时间 */,
        endTime: null /* 结束时间 */,
        minSpeed: "",
        maxSpeed: "",
        upper: "",
        lower: "",
        isReal: null,
        density: null,
        dataType: null /* 8000数据类型 */,
        eigenvalue: null /* 8000特征值 */,
        posArray: null /* 8000测点多选 */
      },
      moveDivMsg: {
        /* 移动的表头信息 */
        x: null,
        y: null,
        offsetX: null,
        offsetY: null,
        isDown: null,
        dv: null
      }
    };
  },
  methods: {
    //8000数据类型选择
    checkDataType (item) {
      item.isChecked = !item.isChecked;
    },
    //时间重置
    reset () {
      this.dateType.type = 0;
      this.dateType.val = "前一天";
      let endValue = new Date().valueOf();
      let stratValue = endValue - 24 * 60 * 60 * 1000;
      this.startTime = stratValue;
      this.endTime = endValue;
    },
    changeTime () {
      this.dateType = {
        val: "自定义",
        type: 5
      };
    },
    // 打开数据检索
    openRetrieval () {
      const params = this.$store.state.srcParams;
      const isReal = this.$store.state.isReal;
      const time = params.time;
      const speed = params.speed;
      const limit = params.limit;
      const density = params.density;
      this.dateType = {
        val: time.val
      };
      this.density = params.density;
      this.result.isReal = isReal; //是否显示实时值
      /* 在自动初始化话数据之前，可以手动初始化 */
      this.result.startTime === null
        ? (this.result.startTime = time.start)
        : ""; //开始时间
      this.result.endTime = time.end; //结束时间
      (this.result.minSpeed = speed.min), //最小转速
        (this.result.maxSpeed = speed.max), //最大转速
        (this.result.upper = limit.upper); //过滤上限
      this.result.lower = limit.lower; //过滤下限
      this.result.density = density;
      this.startTime = this.result.startTime
      this.endTime = time.end
      // this.startTime = flatpickr(".retrieval-start-time", {
      //   locale: Mandarin, //汉化
      //   clickOpens: true,
      //   enableTime: true,
      //   time_24hr: true,
      //   enableSeconds: true,
      //   dateFormat: "Y-m-d H:i:S",
      //   defaultDate: this.result.startTime,
      //   onClose: params => {
      //     this.dateType = {
      //       val: "自定义",
      //       type: 5
      //     };
      //   }
      // });
      // this.endTime = flatpickr(".retrieval-end-time", {
      //   locale: Mandarin, //汉化
      //   clickOpens: true,
      //   enableTime: true,
      //   time_24hr: true,
      //   enableSeconds: true,
      //   dateFormat: "Y-m-d H:i:S",
      //   defaultDate: time.end,
      //   onClose: params => {
      //     this.dateType = {
      //       val: "自定义",
      //       type: 5
      //     };
      //   }
      // });
      this.isShow = true;
      let promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
      return promise;
    },
    // 关闭数据检索
    closeRetrieval (type = 1) {
      if (type === 1) {
        const res = this.result;
        let minSpeed = parseInt(res.minSpeed);
        let maxSpeed = parseInt(res.maxSpeed);
        // let startTime = this.startTime.selectedDates[0].valueOf();
        // let endTime = this.endTime.selectedDates[0].valueOf();
        let startTime = this.startTime;
        let endTime = this.endTime
        let upper = parseFloat(res.upper);
        let lower = parseFloat(res.lower);
        let isReal = res.isReal;
        let density = res.density;

        if (endTime <= startTime) {
          this.$pop("结束时间必须大于开始时间");
          return;
        }
        if (!isNaN(maxSpeed) && !isNaN(minSpeed) && maxSpeed <= minSpeed) {
          this.$pop("最大转速必须大于最小转速");
          return;
        }
        if (!isNaN(lower) && !isNaN(upper) && upper <= lower) {
          this.$pop("上限过滤必须大于下限过滤");
          return;
        }
        res.minSpeed === "" && (minSpeed = "");
        res.maxSpeed === "" && (maxSpeed = "");
        res.upper === "" && (upper = "");
        res.lower === "" && (lower = "");
        this.$store.commit("changeSrcParams", {
          time: {
            start: startTime,
            end: endTime,
            val: this.dateType.val
          },
          speed: {
            min: minSpeed,
            max: maxSpeed
          },
          limit: {
            upper,
            lower
          },
          density: density
        });
        this.$store.commit("changeisReal", isReal);
        this.result.startTime = startTime;
        this.result.endTime = endTime;
        //8000数据类型
        if (this.dataType !== null) {
          let checkNum = 0;
          this.dataType.forEach(element => {
            if (element.isChecked == true) {
              checkNum++;
            }
          });
          if (checkNum == 0) {
            this.$pop("请至少选择一个数据类型！");
            return;
          }
        }
        this.result.dataType = this.dataType;
        //8000特征值单选
        if (this.eigenvalue) {
          this.result.eigenvalue = this.eigenvalue;
        }
        this.resolve(this.result);
      }
      this.isShow = false;
      this.remove();
      this.resolve(false);
    },
    // 移除组件
    remove () {
      window.onmousemove = null;
      setTimeout(() => {
        this.$destroy();
        document.getElementById("app").removeChild(this.$el);
      });
    },
    // 查询密度类型下拉选择
    changeDensityType (e) {
      const text = this.densityData;
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
          this.density = {
            val: res.item.val,
            type: res.item.type
          };
          this.result.density = this.density;
        }
      });
    },
    // 时间类型下拉选择
    changeTimeType (e) {
      const text = this.dateOption;
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
          this.dateType = {
            val: res.item.val,
            type: res.index
          };
          const time = getTimeOfType(
            res.index,
            // this.endTime.selectedDates[0].valueOf()
            this.endTime
          );
          // this.startTime.setDate(time.start);
          this.startTime = time.start;
        }
      });
    },
    // 全选
    checkAll () {
      const eigenvalue = this.viewMsg.eigenvalue;
      for (let i = 0, l = eigenvalue.length; i < l; i++) {
        eigenvalue[i].isShow = true;
      }
    },
    // 反选
    reverseCheck () {
      const eigenvalue = this.viewMsg.eigenvalue;
      for (let i = 0, l = eigenvalue.length; i < l; i++) {
        eigenvalue[i].isShow = !eigenvalue[i].isShow;
      }
    },
    // 设置选中/未选中状态图标
    setIcon (bool) {
      return bool ? "icon-zhongzi_xuanzekuang1" : "icon-zhongzi_xuanzekuang";
    },
    // 拖动弹窗头
    moveDiv (event) {
      this.moveDivMsg.dv = event.currentTarget.parentElement;
      this.moveDivMsg.x = event.clientX;
      this.moveDivMsg.y = event.clientY;

      //获取左部和顶部的偏移量
      this.moveDivMsg.offsetX = this.moveDivMsg.dv.offsetLeft;
      this.moveDivMsg.offsetY = this.moveDivMsg.dv.offsetTop;
      //开关打开
      this.moveDivMsg.isDown = true;
    },
    moveDivUp (event) {
      //开关关闭
      this.moveDivMsg.isDown = false;
    },
    // 8000特征值单选
    changeEigenvalue (e) {
      let text = this.eigenvalueData;
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
          this.eigenvalue = res.item;
          // this.density = {
          //   val: res.item.val,
          //   type: res.item.type,
          // }
          // this.result.density = this.density
        }
      });
    }
  },
  mounted () {
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
  }
};
export default MyMixins;
