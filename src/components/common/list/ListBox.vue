<!-- 菜单列表 -->
<template>
  <!-- <div class='list-box' v-show='isShow' @click.stop='closeList(null, -1)'> -->
  <ul
    class="my-list-view scroll-style-edge radius box-shadow select-none"
    :style="pattern"
    v-show="isShow"
  >
    <li
      ref="myList"
      class="my-list-msg text-overflow"
      v-for="(item, index) in text"
      :key="index"
      :title="item.title?item.title:item.val"
      @click.stop="closeList(item, index)"
      :class="item.isUse"
    >
      <i
        v-show="item.icon && item.icon !== ''"
        class="my-icon iconfont"
        :class="item.icon"
      ></i>
      {{ item.val }}
      <i
        v-show="item.operate && item.operate === 'del'"
        class="my-operate my-icon iconfont icon-zhongzi-guanbi"
        @click.stop="deleteItem(item, index)"
      ></i>
    </li>
  </ul>
  <!-- </div> -->
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import { addClass } from 'utils/utils.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 机组
    text: {
      type: Array,
      default: function () {
        return []
      },
    },
    pattern: {
      type: Object,
      default: function () {
        return {}
      },
    },
    rember: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data() {
    return {
      isShow: false,
      promise: '',
      resolve: '',
      reject: '',
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 打开列表
    openList() {
      this.isShow = true
      this.$nextTick(() => {
        /* 设置样式 */
        if (this.rember !== '') {
          for (let i = 0, l = this.text.length; i < l; i++) {
            const text = this.text[i]
            if (this.rember === text.val) {
              const el = this.$refs.myList[i]
              addClass(el, 'rember')
              this.$el.scrollTop = el.offsetTop
              break
            }
          }
        }
        let { windowHeight } = this.getWindowConfig()
        let top = Number(this.pattern.top.slice(0, -2))
        let maxHeight = Number(this.pattern.maxHeight.slice(0, -2))
        let textNum = this.text.length
        if (textNum * 30 < maxHeight) {
          maxHeight = textNum * 30
        }
        if (windowHeight - top < maxHeight + 10) {
          /* 超出边界 */
          top = top - maxHeight
          this.pattern.top = top + 'px'
        }
      })

      setTimeout(() => {
        document.body.addEventListener('click', this.clickOutside)
      }, 300)
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
    },
    //  获取页面的尺寸
    getWindowConfig() {
      let windowWidth = window.innerWidth
      let windowHeight = window.innerHeight
      if (typeof windowWidth !== 'number') {
        if (document.compatMode === 'CSS1Compat') {
          windowWidth = document.documentElement.clientWidth
          windowHeight = document.documentElement.clientHeight
        } else {
          windowWidth = document.body.clientWidth
          windowHeight = window.body.clientHeight
        }
      }
      return {
        windowWidth: windowWidth,
        windowHeight: windowHeight,
      }
    },
    // 删除项
    deleteItem(item, index) {
      this.$bus.$emit('list-delete-item', item, index)
    },
    // 点击外部
    clickOutside(e) {
      const tag = e.target
      if (!tag.classList.contains('my-list-view')) {
        this.closeList(null, -1)
      }
    },
    // 关闭列表
    closeList(item, index) {
      this.isShow = false
      setTimeout(() => {
        document.body.removeEventListener('click', this.clickOutside)
      }, 300)
      this.resolve({ item, index })
      this.remove()
    },
    // 移除组件
    remove() {
      setTimeout(() => {
        this.$destroy()
        document.getElementById('app').removeChild(this.$el)
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
<style scoped lang="scss">
.my-list-view {
  overflow-y: auto;
  position: absolute;
  z-index: 11;
  .my-list-msg {
    padding: 0 10px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .my-operate {
      position: absolute;
      right: 15px;
      cursor: pointer;

      display: none;
    }
    &:hover {
      .my-operate {
        display: inline;
      }
    }
  }
}
</style>
