<!-- 历史数据 -->
<template>
  <div
    class='data-retrieval-bg'
    v-show='isShow'
  >
    <div class='data-retrieval-box big-box radius box-shadow'>
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <span>数据检索</span>
        <div
          class='close-retrieval'
          @click='closeRetrieval(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </div>
      </div>
      <!-- 测点选择 -->
      <div class='select-box'>
        <div class='select-title msg-title'>测点</div>
        <div class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border'>
          {{posName}}
          <!-- <i class='iconfont icon-zhongzi-zhankai'></i> -->
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>时间</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeTimeType
        >
          {{dateType.val}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 开始时间 -->
      <div class='select-time'>
        <div class='select-title time-title'>开始时间</div>
        <!-- <input class='retrieval-start-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
      <div class='select-time'>
        <div class='select-title time-title'>结束时间</div>
        <!-- <input class='retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
      <div class='set-speed'>
        <div class='select-title speed-title'>转速区间</div>
        <input
          type="number"
          class='input-value radius outside-border edge-outside-border'
          v-model='result.minSpeed'
        >
        <div class='speed-bar'>
          <div></div>
        </div>
        <input
          type="number"
          class='input-value radius outside-border edge-outside-border'
          v-model='result.maxSpeed'
        >
      </div>
      <!-- 选择查询密度 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>查询密度</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeDensityType
        >
          {{density.val}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 特征值选择显隐 -->
      <div class='check-eigenvalue-box'>
        <div class='select-title check-eigenvalue-title'>特征值</div>
        <ul class='check-eigenvalue radius select-none'>
          <li
            v-for='(item, index) in viewMsg.eigenvalue'
            :key=index
            @click.stop='checkEigenvalue(item)'
            :title='item.val'
          >
            <i
              class='iconfont'
              :class='setIcon(item.isShow)'
            ></i>
            {{item.val}}
          </li>
        </ul>
      </div>
      <!-- 数据类型选择 -->
      <div
        class='check-eigenvalue-box'
        v-show="viewMsg.isDataType"
      >
        <div class='select-title check-eigenvalue-title'></div>
        <ul class='check-eigenvalue radius select-none'>
          <li
            v-for='(item, index) in dataType'
            :key=index
            :title='item.val'
            @click.stop='checkDataType(item)'
          >
            <i
              class='iconfont'
              :class='setIcon(item.isChecked)'
            ></i>
            {{item.val}}
          </li>
        </ul>
      </div>
      <!-- 操作按钮 -->
      <div class='data-retrieval-btn'>
        <button @click='reset'>重置</button>
        <button @click='checkAll'>全选</button>
        <button @click=reverseCheck>反选</button>
        <button @click='closeRetrieval(1)'>确定</button>
        <button
          class='disable-btn'
          @click='closeRetrieval(0)'
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import MyMixins from './PublicMethods.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {}
  },
  props: {
    viewMsg: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  mixins: [MyMixins],
  computed: {},
  watch: {},
  methods: {
    // 初始化数据
    initParams() {
      const msg = this.viewMsg
      this.posName = msg.pos.position_name
      if (this.viewMsg.isDataType) {
        this.dataType = this.viewMsg.dataType
      }
    },
    // 点击测点下拉选择
    /* changeName(e) {
         const viewMsg = this.viewMsg;
         const size = e.currentTarget.getBoundingClientRect();
         const macId = viewMsg.pos.machine_id;
         const pos = this.$store.state.pos[macId];
         const text = [];
         for (let i = 0, l = pos.length; i < l; i++) {
            const value = pos[i];
            text.push({
               icon: '',
               val: value.position_name,
               key: value.posFlag,
            })
         }
         this.$list({
            pattern: {
               maxHeight: '400px',
               width: `${size.width}px`,
               left: `${size.left}px`,
               top: `${size.top + size.height}px`,
            },
            text,
         }).then(res => {
            if (res.index > -1) {
               this.posName = res.item.val;
               this.result.pos = pos[res.index];
            }
         })
      }, */
    // 点击特征值
    checkEigenvalue(item) {
      item.isShow = !item.isShow
      if (item.code == -1) {
        for (let i = 0; i < 10; i++) {
          if (item.filed == [`part_name${i}`]) {
            this.viewMsg.eigenvalue.forEach((el) => {
              if (el.code >= 52001 && el.code <= 52009) {
                if (i == 0) {
                  for (let j = 0; j < 9; j++) {
                    if (el.filed == [`sv${j}`]) {
                      el.isShow = item.isShow
                    }
                  }
                } else {
                  for (let j = 0; j < 9; j++) {
                    if (el.filed == [`sv${i}${j}`]) {
                      el.isShow = item.isShow
                    }
                  }
                }
              }
            })
            return
          }
        }
      }
    },
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
  activated() {},
}
</script>
<style scoped lang='scss'>
</style>
