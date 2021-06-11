<!-- 启停机数据列表 -->
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
        <!--  数据检索标题-->
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class='close-retrieval'
          @click='closeRetrieval(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </div>
      </div>
      <!-- 测点选择 -->
      <div class='select-box'>
        <div class='select-title msg-title'>{{vm.$t('Common.pos')}}</div>
        <div class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border'>
          {{posName}}
          <!-- <i class='iconfont icon-zhongzi-zhankai'></i> -->
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class='select-date-type'>
        <div class='select-title date-type-title'>{{vm.$t('Common.time')}}</div>
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
        <div class='select-title time-title'>{{vm.$t('Common.startTime')}}</div>
        <!-- <input class='retrieval-start-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
        <!-- <input class='retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border'> -->
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
      <!-- 特征值选择显隐 -->
      <div class='check-eigenvalue-box'>
        <div class='select-title check-eigenvalue-title'>{{vm.$t('Common.typeEignin')}}</div>
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
      <!-- 操作按钮 -->
      <div class='data-retrieval-btn'>
        <!-- 重置 -->
        <button @click='reset'>{{vm.$t('Common.resetBtn')}}</button>
        <!-- 全选 -->
        <button @click='checkAll'>{{vm.$t('Common.allBtn')}}</button>
        <!-- 反选 -->
        <button @click=reverseCheck>{{vm.$t('Common.reverseBtn')}}</button>
        <!-- 确定 -->
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
    // 初始化数据
    initParams() {
      const msg = this.viewMsg
      this.posName = msg.pos.position_name
    },
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
