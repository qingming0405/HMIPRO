<!-- 波形频谱图 -->
<template>
  <div class="data-retrieval-bg pop-bg" v-show="isShow">
    <div class="data-retrieval-box big-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <span>数据检索</span>
        <div class="close-retrieval" @click="closeRetrieval(0)">
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">时间</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeTimeType"
        >
          {{ dateType.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 开始时间 -->
      <div class="select-time">
        <div class="select-title time-title">开始时间</div>
        <!-- <input
          class="retrieval-start-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border"
        /> -->
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 结束时间 -->
      <div class="select-time">
        <div class="select-title time-title">结束时间</div>
        <!-- <input
          class="retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border"
        /> -->
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 转速区间 -->
      <div class="set-speed">
        <div class="select-title speed-title">转速区间</div>
        <input
          type="number"
          class="input-value radius outside-border edge-outside-border"
          v-model="result.minSpeed"
        />
        <div class="speed-bar">
          <div></div>
        </div>
        <input
          type="number"
          class="input-value radius outside-border edge-outside-border"
          v-model="result.maxSpeed"
        />
      </div>
      <div class="select-date-type">
        <div class="date-type-title">X轴特征值</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click="setCodeX"
        >
          {{ codeObj.codeNameX }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <div class="select-date-type">
        <div class="date-type-title">Y轴特征值</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click="setCodeY"
        >
          {{ codeObj.codeNameY }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 选择查询密度 -->
         <div class='select-date-type'>
            <div class='select-title date-type-title'>查询密度</div>
            <div class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border' @click.stop=changeDensityType>
               {{density.val}}
               <i class='iconfont icon-zhongzi-zhankai'></i>
            </div>
         </div>
      <div class="data-retrieval-btn">
        <button @click='reset'>重置</button>
        <button @click.stop="closeRetrieval(1)">确定</button>
        <button class="disable-btn" @click.stop="closeRetrieval(0)">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import MyMixins from "./PublicMethods.js";
import {
  defaultCode,
  cloneObj,
  codeObj,
  getUnit,
  setHead
} from "utils/utils.js";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      result: {
        msg: null
      },
      codeObj: {
        //特征值信息
        codeX: [], //x轴特征值
        codeY: [], //Y轴特征值
        codeNameX: "", //所选X轴特征值名称
        codeNameY: "", //所选Y轴特征值名称
        codeValX: "", //所选X轴特征值的code
        codeValY: "", //所选Y轴特征值的code
        codeFiledY: "", //所选Y轴特征值的字段名
        codeFiledX: "", //所选X轴特征值的字段名
        posUnitX: "", //所选X轴特征值的单位
        posUnitY: "" //所选X轴特征值的单位
      }
    };
  },
  props: {
    viewMsg: {
      default() {
        return {};
      }
    }
  },
  mixins: [MyMixins],
  computed: {},
  watch: {},
  methods: {
    // 初始化数据
    initParams() {
      const viewMsg = this.viewMsg;
      // 获取X轴特征值
      let x = setHead(
        viewMsg.t_rootX,
        viewMsg.dgmTypeX,
        viewMsg.typeX,
        viewMsg.posLocX
      );
      // 获取Y轴特征值
      let y = setHead(
        viewMsg.t_rootY,
        viewMsg.dgmTypeY,
        viewMsg.typeY,
        viewMsg.posLocY
      );
      this.codeObj = {
        codeX: x, //x轴特征值
        codeY: y, //Y轴特征值
        codeNameX: viewMsg.codeNameX, //所选X轴特征值名称
        codeNameY: viewMsg.codeNameY, //所选Y轴特征值名称
        codeValX: viewMsg.codeValX, //所选X轴特征值的code
        codeValY: viewMsg.codeValY, //所选Y轴特征值的code
        codeFiledY: viewMsg.codeFiledY, //所选Y轴特征值的字段名
        codeFiledX: viewMsg.codeFiledX, //所选X轴特征值的字段名
        posUnitX: viewMsg.posUnitX, //所选X轴特征值的单位
        posUnitY: viewMsg.posUnitY //所选X轴特征值的单位
      };
      this.result.msg = this.codeObj;
    },
    // 设置x轴特征值下拉选项
    setCodeX(e) {
      let codeX = this.codeObj.codeX;
      const size = e.currentTarget.getBoundingClientRect();
      const currentMac = this.$store.state.checkMsg.mac;
      const posList = this.$store.state.pos[currentMac.mac_id];
      let currentPos = null;
      posList.forEach(pos => {
        if (
          pos.position_type == this.viewMsg.typeX &&
          pos.position_id == this.viewMsg.idX
        ) {
          currentPos = pos;
        }
      });
      let text = [];
      let unitX = "";
      for (let i = 0; i < codeX.length; i++) {
        if (currentPos.units) {
          unitX = getUnit(codeX[i].code, currentPos);
        } else if (
          currentPos.position_type === 12 ||
          currentPos.position_type === 13
        ) {
          unitX = "°";
        }
        /* 特征值不包括时间 */
        if (codeX[i].filed === "saveTime_Com") continue;
        text.push({
          type: "x", //x轴特征值
          icon: "",
          isView: true,
          code: codeX[i].code,
          filed: codeX[i].filed,
          val: codeX[i].val,
          unitX: unitX
        });
      }
      this.$list({
        text,
        pattern: {
          maxHeight: "300px",
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`
        }
      }).then(res => {
        if (res.index > -1) {
          this.codeObj.codeNameX = res.item.val;
          this.codeObj.codeValX = res.item.code;
          this.codeObj.codeFiledX = res.item.filed;
          this.codeObj.posUnitX = res.item.unitX;
          this.viewMsg.codeNameX = res.item.val;
          this.viewMsg.codeValX = res.item.code;
          this.viewMsg.codeFiledX = res.item.filed;
          this.viewMsg.posUnitX = res.item.unitX;
          this.result.msg = this.codeObj;
        }
      });
    },
    // 设置y轴特征值下拉选项
    setCodeY(e) {
      let codeY = this.codeObj.codeY;
      const size = e.currentTarget.getBoundingClientRect();
      let text = [];
      const currentMac = this.$store.state.checkMsg.mac;
      const posList = this.$store.state.pos[currentMac.mac_id];
      let unitY = "";
      let currentPos = null;
      posList.forEach(pos => {
        if (
          pos.position_type == this.viewMsg.typeY &&
          pos.position_id == this.viewMsg.idY
        ) {
          currentPos = pos;
        }
      });
      for (let i = 0; i < codeY.length; i++) {
        if (currentPos.units) {
          unitY = getUnit(codeY[i].code, currentPos);
        } else if (
          currentPos.position_type === 12 ||
          currentPos.position_type === 13
        ) {
          unitY = "°";
        }
        /* 特征值不包括时间 */
        if (codeY[i].filed === "saveTime_Com") continue;
        text.push({
          type: "y", //y轴特征值
          icon: "",
          isView: true,
          code: codeY[i].code,
          filed: codeY[i].filed,
          val: codeY[i].val,
          unitY: unitY
        });
      }
      this.$list({
        text,
        pattern: {
          maxHeight: "300px",
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`
        }
      }).then(res => {
        if (res.index > -1) {
          this.codeObj.codeNameY = res.item.val;
          this.codeObj.codeValY = res.item.code;
          this.codeObj.codeFiledY = res.item.filed;
          this.codeObj.posUnitY = res.item.unitY;
          this.viewMsg.codeNameY = res.item.val;
          this.viewMsg.codeValY = res.item.code;
          this.viewMsg.codeFiledY = res.item.filed;
          this.viewMsg.posUnitY = res.item.unitY;
          this.result.msg = this.codeObj;
        }
      });
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 生命周期 - 创建之前
  beforeCreate() {},
  // 生命周期 - 挂载之前
  beforeMount() {},
  // 生命周期 - 更新之前
  beforeUpdate() {},
  // 生命周期 - 更新之后
  updated() {},
  // 生命周期 - 销毁之前
  beforeDestroy() {},
  // 生命周期 - 销毁完成
  destroyed() {},
  // 如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
};
</script>
<style scoped lang="scss"></style>
