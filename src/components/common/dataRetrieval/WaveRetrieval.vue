<!-- 波形频谱图 -->
<template>
  <div
    class='data-retrieval-bg pop-bg'
    v-show='isShow'
  >
    <div class='data-retrieval-box big-box radius box-shadow'>
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <!--  数据检索标题-->
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class='close-retrieval'
          @click='closeRetrieval(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>{{vm.$t('Common.time')}}</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border'
          @click.stop=changeTimeType
        >
          {{dateType.val}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 开始时间 -->
      <div class='select-time'>
        <div class='select-title time-title'>{{vm.$t('Common.startTime')}}</div>
        <!-- <input class='retrieval-start-time time-value  input-value radius text-overflow select-none outside-border'> -->
        <el-date-picker
          v-model="startTime"
          type="datetime"
          :placeholder="vm.$t('Common.placeholderTime')"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 结束时间 -->
      <div class='select-time'>
        <div class='select-title time-title'>{{vm.$t('Common.endTime')}}</div>
        <!-- <input class='retrieval-end-time time-value  input-value radius text-overflow select-none outside-border'> -->
        <el-date-picker
          v-model="endTime"
          type="datetime"
          :placeholder="vm.$t('Common.placeholderTime')"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
      </div>
      <!-- 转速区间 -->
      <div class='set-speed'>
        <div class='select-title speed-title'>{{vm.$t('Common.speedRange')}}</div>
        <input
          type="number"
          class='input-value radius outside-border'
          v-model='result.minSpeed'
        >
        <div class='speed-bar'>
          <div></div>
        </div>
        <input
          type="number"
          class='input-value radius outside-border'
          v-model='result.maxSpeed'
        >
      </div>
      <!-- 趋势图上限过滤 -->
      <div class='set-limit'>
        <div class='select-title limit-title'>{{vm.$t('Common.filterUp')}}</div>
        <input
          type="number"
          class='limit-value input-value radius text-overflow select-none outside-border'
          v-model='result.upper'
        >
      </div>
      <!-- 趋势图下限过滤 -->
      <div class='set-limit'>
        <div class='select-title limit-title'>{{vm.$t('Common.filterDown')}}</div>
        <input
          type="number"
          class='limit-value input-value radius text-overflow select-none outside-border'
          v-model='result.lower'
        >
      </div>
      <!-- 选择查询密度 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>{{vm.$t('Common.queryDensityBtn')}}</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeDensityType
        >
          {{density.val}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 数据类型选择 -->
      <div class='check-eigenvalue-box' v-show="viewMsg.isDataType">
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
      <div class='data-retrieval-btn'>
        <!-- 重置 -->
        <button @click='reset'>{{vm.$t('Common.resetBtn')}}</button>
        <!-- 确认 -->
        <button @click='closeRetrieval(1)'>{{vm.$t('Common.sureBtn')}}</button>
        <!-- 取消 -->
        <button
          class='disable-btn'
          @click='closeRetrieval(0)'
        >{{vm.$t('Common.cancelBtn')}}</button>
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
    const vm = window.vm;
    return {
      vm:vm,
    }
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
    initParams(){
      if(this.viewMsg.isDataType){
        this.dataType = this.viewMsg.dataType
      }
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
  activated() {},
}
</script>
<style scoped lang='scss'>
</style>
