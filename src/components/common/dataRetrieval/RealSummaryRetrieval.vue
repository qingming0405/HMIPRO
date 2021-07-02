<!-- 实时数据 -->
<template>
  <div
    class='data-retrieval-bg'
    v-show='isShow'
  >
    <div class='data-retrieval-box big-box radius box-shadow select-none'>
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv($event)"
        @mouseup="moveDivUp($event)"
      >
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class='close-retrieval'
          @click='closeRetrieval(0)'
        >
          <i class='iconfont icon-cuohao'></i>
        </div>
      </div>
      <!-- 数据类型 -->
      <div class='check-eigenvalue-box'>
        <div class='check-eigenvalue-title select-title'>{{vm.$t('Common.dataType')}}</div>
        <ul class='check-eigenvalue radius'>
          <li
            v-for='(item, index) in viewMsg.posTypeList'
            :key=index
            @click.stop='checkPosType(item)'
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
        <!-- 全选 -->
        <button @click='checkAll'>{{vm.$t('Common.allBtn')}}</button>
        <!-- 反选 -->
        <button @click='reverseCheck'>{{vm.$t('Common.reverseBtn')}}</button>
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
      result: {}
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
  computed: {},
  mixins: [MyMixins],
  watch: {},
  methods: {
    // 初始化数据
    initParams() {
      this.result = this.viewMsg.posTypeList
    },
    // 关闭数据检索
    closeRetrieval(type) {
      let back = [false, this.result]
      this.isShow = false
      this.resolve(back[type])
      this.remove()
    },
    // 选择测点类型
    checkPosType(item) {
      item.isShow = !item.isShow
    },
    // 全选
    checkAll() {
      const posTypeList = this.viewMsg.posTypeList
      for (let i = 0, l = posTypeList.length; i < l; i++) {
        posTypeList[i].isShow = true
      }
    },
    // 反选
    reverseCheck() {
      const posTypeList = this.viewMsg.posTypeList
      for (let i = 0, l = posTypeList.length; i < l; i++) {
        posTypeList[i].isShow = !posTypeList[i].isShow
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
