<!-- 设备维护记录 -->
<template>
  <div
    class="data-retrieval-bg pop-bg"
    v-show="isShow"
  >
    <div class="data-retrieval-box radius box-shadow">
      <!-- 头部标题 -->
      <div class="data-retrieval-title">
        <span>{{vm.$t('Common.title')}}</span>
        <div
          class="close-retrieval"
          @click="closeRetrieval(0)"
        >
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 组织、机组、测点选择 -->
      <div class="select-box">
        <div class="select-title msg-title">{{ msgTitle }}</div>
        <div
          class="select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeName"
        >
          {{ viewMsg.name }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
        </div>
      </div>
      <!-- 选择时间类型 -->
      <div class="select-date-type">
        <div class="select-title date-type-title">{{vm.$t('Common.time')}}</div>
        <div
          class="select-value date-type-name radius text-overflow select-none outside-border edge-outside-border"
          @click.stop="changeTimeType"
        >
          {{ dateType.val }}
          <i class="iconfont icon-zhongzi-zhankai"></i>
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
      <div class="data-retrieval-btn">
        <button @click="reset">{{vm.$t('Common.resetBtn')}}</button>
        <button @click="closeRetrieval(1)">{{vm.$t('Common.sureBtn')}}</button>
        <button
          class="disable-btn"
          @click="closeRetrieval(0)"
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
      result: {
        vm:vm,
        msg: null,
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
      const typeObj = {
        pos: vm.$t('AlarmRetrieval.typePos'),//'测点',
        mac: vm.$t('AlarmRetrieval.typeMac'),//'机组',
        tree: vm.$t('AlarmRetrieval.typePos'),//'测点',
      }
      this.msgTitle = typeObj[msg.type]
      if (this.result.msg === null || this.result.msg === undefined)
        this.result.msg = this.$store.state.checkMsg.mac
    },
    // 组织、机组、测点下拉选择
    changeName(e) {
      const viewMsg = this.viewMsg
      const result = this.result
      let msg = this.$store.state.mac[viewMsg.parentId]
      const size = e.currentTarget.getBoundingClientRect()
      const text = []
      for (let i = 0, l = msg.length; i < l; i++) {
        const value = msg[i]
        text.push({
          val: value.name || value.mac_name || value.m_me,
          icon: '',
        })
      }
      let that = this
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `${size.width}px`,
          left: `${size.left}px`,
          top: `${size.top + size.height}px`,
        },
      }).then((res) => {
        if (res.index > -1) {
          result.msg = msg[res.index]
          // that.$store.state.checkMsg.mac = msg[res.index];
          viewMsg.name = res.item.val
        }
      })
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
<style scoped lang="scss"></style>
