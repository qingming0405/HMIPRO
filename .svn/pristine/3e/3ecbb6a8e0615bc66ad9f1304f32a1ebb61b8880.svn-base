<!-- 报警日志 -->
<template>
  <div
    class="data-retrieval-bg pop-bg"
    v-show="isShow"
  >
    <div class="data-retrieval-box radius box-shadow">
      <!-- 头部标题 -->
      <div
        class="data-retrieval-title"
        @mousedown="moveDiv"
        @mouseup="moveDivUp"
      >
        <span>数据检索</span>
        <div
          class="close-retrieval"
          @click="closeRetrieval(0)"
        >
          <i class="iconfont icon-cuohao"></i>
        </div>
      </div>
      <!-- 组织、机组、测点选择 -->
      <!-- <div class='select-box'>
        <div class='select-title msg-title'>{{msgTitle}}</div>
         
        <div
          class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border'
          @click.stop='changeName'
        >
          {{viewMsg.name}}
          <i class='iconfont icon-zhongzi-zhankai'></i> 
        </div>
      </div> -->
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
        <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
        <!-- <input
          class="retrieval-start-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border"
        /> -->
      </div>
      <!-- 结束时间 -->
      <div class="select-time">
        <div class="select-title time-title">结束时间</div>
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeTime"
          :clearable='false'
        >
        </el-date-picker>
        <!-- <input class="retrieval-end-time time-value  input-value radius text-overflow select-none outside-border edge-outside-border" /> -->
      </div>
      <div class="data-retrieval-btn">
        <button @click="reset">重置</button>
        <button @click="closeRetrieval(1)">确定</button>
        <button
          class="disable-btn"
          @click="closeRetrieval(0)"
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
    return {
      result: {
        msg: null,
      },
      allMsg: null,
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
      const viewMsg = this.viewMsg
      this.allMsg = this.viewMsg
      this.setData()
      // if (viewMsg.type === 'mac' || viewMsg.type === 'tree') {
      //   this.allMsg = this.$store.state[viewMsg.type]
      //   this.setData()
      // } else if (viewMsg.type === 'enter') {
      //   const time = this.$store.state.srcParams.time
      //   let rd = {
      //     startTime: time.start,
      //     endTime: time.end,
      //     machineId: viewMsg.mid,
      //     type: 1,
      //   }
      //   this.allMsg = []
      //   this.$getApi.getMacAlarmInfoByTidOrMacId(rd).then((res) => {
      //     if (res) {
      //       if (res.result) {
      //         let a = []
      //         let result = res.result
      //         for (let i in result) {
      //           result[i].enterflag = i
      //           result[i].machineId = rd.machineId
      //           a.push(result[i])
      //         }
      //         this.allMsg = a
      //         this.setData()
      //       }
      //     }
      //   })
      // } else if (viewMsg.type === 'pos') {
      //   const [pId, id, type] = viewMsg.key.split('_')
      //   let rd = {
      //     dgm_id: viewMsg.dgm_id,
      //     ch_type: viewMsg.ch_type,
      //     ch_id: viewMsg.ch_id,
      //     type: 2,
      //     machineId: pId,
      //     startTime: this.$store.state.srcParams.time.start,
      //     endTime: this.$store.state.srcParams.time.end,
      //   }
      //   this.$getApi.getMacAlarmInfoByTidOrMacId(rd).then((res) => {
      //     if (res) {
      //       if (res.result) {
      //         let result = res.result
      //         let a = []
      //         for (let i in result) {
      //           result[
      //             i
      //           ].posFlag = `${result[i].mac_id}_${result[i].pos_id}_${result[i].pos_type}`
      //           if (!result[i].position_name) {
      //             result[i].position_name = result[i].pos_name
      //           }
      //           if (!result[i].machine_id) {
      //             result[i].machine_id = result[i].mac_id
      //           }
      //           if (!result[i].position_id) {
      //             result[i].position_id = result[i].pos_id
      //           }
      //           if (!result[i].position_type) {
      //             result[i].position_type = result[i].pos_type
      //           }
      //           a.push(result[i])
      //         }
      //         this.allMsg = a
      //         this.setData()
      //       }
      //     }
      //   })
      // }
    },
    setData() {
      const viewMsg = this.viewMsg
      const typeObj = {
        pos: '测点',
        mac: '机组',
        enter: '通道',
        tree: '测点',
      }
      // if (viewMsg.type === 'mac') {
      //   this.allMsg = this.allMsg[viewMsg.parentId]
      // }
      this.msgTitle = typeObj[viewMsg.type]
      // if (this.allMsg) {
      //   // console.log(`无${viewMsg.type}信息`)
      //   // return
      //   const idFiled = {
      //     tree: 't_id',
      //     mac: 'mac_id',
      //     enter: 'enterflag',
      //     pos: 'posFlag',
      //   }
      //   if (viewMsg.type === 'mac') {
      //     for (const value of this.allMsg) {
      //       if (!value.mac_me) {
      //         value.mac_me = value.mac_name
      //       }
      //     }
      //   }
      //   for (const value of this.allMsg) {
      //     if (
      //       value[idFiled[viewMsg.type]] &&
      //       value[idFiled[viewMsg.type]].toString() === viewMsg.key
      //     ) {
      //       this.result.msg = value
      //       if (viewMsg.type === 'enter') {
      //         viewMsg.name = value.ch_name
      //       }
      //       break
      //     }
      //   }
      // }
    },
    // 组织、机组、测点下拉选择
    changeName(e) {
      const viewMsg = this.viewMsg
      const result = this.result
      const msg = this.allMsg
      const size = e.currentTarget.getBoundingClientRect()
      const text = []
      for (let i = 0, l = msg.length; i < l; i++) {
        const value = msg[i]
        text.push({
          val:
            value.mac_me ||
            value.position_name ||
            value.t_name ||
            value.ch_name,
          icon: '',
        })
      }
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
          /* const nameObj = {
                  tree: 't_name',
                  mac: 'mac_me',
                  pos: 'position_name',
               } */
          this.result.msg = msg[res.index]
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
