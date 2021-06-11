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
      <!-- 机组选择 -->
      <div class='select-box'>
        <div class='select-title msg-title'>{{vm.$t('Common.mac')}}</div>
        <div class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border'>
          {{macName}}
          <!-- <i class='iconfont icon-zhongzi-zhankai'></i> -->
        </div>
      </div>
      <div class='select-box'>
        <div class='select-title msg-title'>{{vm.$t('Common.dataType')}}</div>
        <div class='select-value viewMsg-name radius text-overflow select-none outside-border edge-outside-border' @click.stop=changePosType>
          {{posTypeObj.val}}
        </div>
      </div>
      <!-- 特征值选择显隐 -->
      <div class='check-eigenvalue-box'>
        <div class='check-eigenvalue-title select-title'>{{vm.$t('Common.typeEignin')}}</div>
        <ul class='check-eigenvalue radius'>
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
        <!-- 全选 -->
        <button @click='checkAll'>{{vm.$t('Common.allBtn')}}</button>
        <!-- 反选 -->
        <button @click=reverseCheck>{{vm.$t('Common.reverseBtn')}}</button>
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
import {realCodeList} from 'utils/utils.js'
import MyMixins from './PublicMethods.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    const vm = window.vm;
    return {
      vm:vm,
      macName: '',
      posTypeObj: {},
      result: {
        mId: '',
        curCode: '' // 当前显示的数据类型
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
  computed: {},
  mixins: [MyMixins],
  watch: {},
  methods: {
    // 初始化数据
    initParams() {
      this.macName = this.viewMsg.macName
      this.result.mId = this.viewMsg.mId
      this.posTypeObj = this.viewMsg.posTypeObj
      this.result.curCode = this.posTypeObj.code
    },
    // 关闭数据检索
    closeRetrieval(type) {
      let back = [false, this.result]
      this.isShow = false
      this.resolve(back[type])
      this.remove()
    },
    // 点击机组下拉选择
    /* changeName(e) {
         const viewMsg = this.viewMsg;
         const size = e.currentTarget.getBoundingClientRect();
         const text = [];
         const macMsg = this.$store.state.mac[this.viewMsg.tId];
         for (let i = 0, l = macMsg.length; i < l; i++) {
            const value = macMsg[i];
            text.push({
               id: value.mac_id,
               val: value.m_me,
               icon: '',
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
               this.macName = res.item.val;
               this.result.mId = res.item.id;
            }
         })
      }, */
    // 点击选择测点类型
    changePosType(e) {
      let posTypeObj = this.posTypeObj
      const text = posTypeObj.posTypeList;
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
        if (res.index > -1 && res.item.code !== posTypeObj.code) {
          posTypeObj.val = res.item.val
          posTypeObj.code = res.item.code
          this.result.curCode = posTypeObj.code
          if(!this.viewMsg.codeObj.hasOwnProperty(posTypeObj.code)){
            let pos = this.viewMsg.typePosObj[posTypeObj.code].pos
            let head = realCodeList(this.viewMsg.t_root,
              pos.dgm_type,
              pos.position_type,
              pos.pos_loc
            ) 
            this.viewMsg.codeObj[posTypeObj.code] = head
            this.viewMsg.eigenvalue = head.slice(2)
          }
          else {
            this.viewMsg.eigenvalue = this.viewMsg.codeObj[posTypeObj.code].slice(2)
          }
          this.viewMsg.posTypeObj = posTypeObj
        }
      });
    },
    // 点击特征值
    checkEigenvalue(item) {
      item.isShow = !item.isShow
      if (item.code == -1) {
        for (let i = 0; i < 10; i++) {
          if (item.filed == [`part_name${i}`]) {
            this.viewMsg.eigenvalue.forEach(el => {
              if(el.code >= 52001 && el.code <= 52009){
                if(i == 0){
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
    // 全选
    checkAll() {
      const eigenvalue = this.viewMsg.eigenvalue
      for (let i = 0, l = eigenvalue.length; i < l; i++) {
        eigenvalue[i].isShow = true
      }
    },
    // 反选
    reverseCheck() {
      const eigenvalue = this.viewMsg.eigenvalue
      for (let i = 0, l = eigenvalue.length; i < l; i++) {
        eigenvalue[i].isShow = !eigenvalue[i].isShow
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
