<!-- 单值棒图 -->
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
        <div class='select-title msg-title'>机组</div>
        <div class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border'>
          {{macName}}
          <!-- <i class='iconfont icon-zhongzi-zhankai'></i> -->
        </div>
      </div>
      <!-- 特征值 -->
      <div
        class='select-date-type'
        v-show="viewMsg.isEigenvalue"
      >
        <div class='select-title date-type-title'>特征值</div>
        <div
          class='select-value date-type-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop=changeEigenvalue
        >
          {{eigenvalue.name}}
          <i class='iconfont icon-zhongzi-zhankai'></i>
        </div>
      </div>
      <!-- 测点选择显隐 -->
      <div class='check-eigenvalue-box'>
        <div class='select-title check-eigenvalue-title'>测点</div>
        <ul class='check-eigenvalue radius select-none'>
          <li
            v-for='(item, index) in posArray'
            :key=index
            @click.stop='checkpos(item)'
            :title='item.position_name'
          >
            <i
              class='iconfont'
              :class='setIcon(item.isShow)'
            ></i>
            {{item.position_name}}
          </li>
        </ul>
      </div>
      <!-- 操作按钮 -->
      <div class='data-retrieval-btn'>
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
import { cloneObj, getCodeObj } from 'utils/utils.js'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      macName: '',
      eigenvalue: [],
      posArray: {},
      eigenvalueData: [],
      result: {
        posArray: [],
        eigenvalue: {},
      },
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
      this.macName = msg.mac.m_me
      this.posArray = msg.posArray
      if (msg.isEigenvalue) {
        this.eigenvalueData = msg.eigenvalueData
        this.eigenvalue = msg.eigenvalue
      }
    },
    checkpos(item) {
      item.isShow = !item.isShow
      this.$forceUpdate()
    },

    // 全选
    checkAll() {
      const posArray = this.viewMsg.posArray
      for (let i = 0, l = posArray.length; i < l; i++) {
        posArray[i].isShow = true
      }
    },
    // 反选
    reverseCheck() {
      const posArray = this.viewMsg.posArray
      for (let i = 0, l = posArray.length; i < l; i++) {
        posArray[i].isShow = !posArray[i].isShow
      }
    },
    // 移除组件
    remove() {
      window.onmousemove = null
      setTimeout(() => {
        this.$destroy()
        document.getElementById('app').removeChild(this.$el)
      })
    },
    // 关闭数据检索
    closeRetrieval(type = 1) {
      if (type === 1) {
        const res = this.result
        res.posArray = this.posArray
        res.eigenvalue = this.eigenvalue
        this.resolve(this.result)
      }
      this.isShow = false
      this.remove()
      this.resolve(false)
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
