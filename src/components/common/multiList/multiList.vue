<template>
  <div
    class="scroll-style-edge"
    :class="flag === 'pro' ? 'multiList-pro' : 'multiList-edge'"
  >
    <ul
      class="multiList "
      :style="myStyle"
    >
      <item
        v-for="(item, index) in data"
        :listData="item"
        :dateType="dateType"
        :key="index"
        :cType="cType"
        :flag="flag"
        ref='itemList'
      ></item>
    </ul>
  </div>
</template>

<script>
import item from './item'
export default {
  name: 'multiList',
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      },
    },
    /* 样式 */
    myStyle: {
      type: Object,
      default: function () {
        return {}
      },
    },
    /* 类型(暂时可以不传) */
    dateType: {
      type: String,
      default: '',
    },
    /* pro 或者 edge  样式 */
    flag: {
      type: String,
      default: '',
    },
    /* 多选或者单选 */
    cType: {
      type: String,
      default: 'single', //checkbox
    },
  },
  data() {
    return {
      promise: '',
      resolve: '',
      rejected: '',
      items: {},
    }
  },
  components: {
    item,
  },
  methods: {
    // 初始化方法
    init() {
      /* 判断参数 */
      /* 添加点击事件 */
      setTimeout(() => {
        document.body.addEventListener('click', this.clickOutside)
      }, 300)

      /* 添加选中定位
      1.根据dateType从vuex取相应checkMsg信息中选中的组织/机组/测点信息
      2.循环data，判断id是否一致，若一致定位滚动到改位置
      */
      let childrenScorll = 0
      if (this.dateType) {
        let checkInfo = this.$store.state.checkMsg[this.dateType]
        if (checkInfo) {
          if (this.dateType == 'pos') {
            for (let i = 0, l = this.data.length; i < l; i++) {
              let pos = this.data[i]
              if (
                pos &&
                checkInfo.position_type == pos.position_type &&
                checkInfo.position_id == pos.position_id
              ) {
                this.$nextTick(() => {
                  // 定位功能
                  this.$el.children[0].scrollTop =
                    this.$el.children[0].scrollTop + i * 26
                })
              }
            }
          } else {
            let choose = {
              tree: 't_id',
              mac: ['pump_id', 'mac_id'],
            }
            for (let i = 0, l = this.data.length; i < l; i++) {
              let item = this.data[i]
              let type
              if (Array.isArray(choose[this.dateType])) {
                type = item[choose[this.dateType][0]]
                  ? choose[this.dateType][0]
                  : choose[this.dateType][1]
              } else {
                type = choose[this.dateType]
              }
              if (item && checkInfo[type] == item[type]) {
                this.$nextTick(() => {
                  // 定位功能
                  this.$el.children[0].scrollTop =
                    this.$el.children[0].scrollTop +
                    i * 26 +
                    childrenScorll * 26
                })
              }
              this.ergodicSubset(item, checkInfo, type, i + childrenScorll)
              // 计算打开的子集长度
              childrenScorll = this.calculateSubset(item, childrenScorll)
            }
          }
        }
      }
      /* 回调函数 */
      this.promise = new Promise((resolve, rejected) => {
        this.resolve = resolve
        this.rejected = rejected
      })
      return this.promise
    },
    // 若当前组织存在子集，遍历子集判断是否选中，若选中则滚动到该组织父级组织
    ergodicSubset(item, checkInfo, type, i) {
      if (item.children && item.children.length > 0) {
        for (let k = 0, len = item.children.length; k < len; k++) {
          if (checkInfo[type] == item.children[k][type]) {
            this.$nextTick(() => {
              // 定位功能
              this.$el.children[0].scrollTop =
                this.$el.children[0].scrollTop + i * 26
            })
          }
          if (
            item.children[k].children &&
            item.children[k].children.length > 0
          ) {
            this.ergodicSubset(item.children[k], checkInfo, type, i)
          }
        }
      }
    },
    // 计算打开折叠组织的长度
    calculateSubset(item, childrenScorll) {
      if (item.children && item.children.length > 0 && item.isOpen) {
        childrenScorll = childrenScorll + item.children.length
        for (let k = 0, len = item.children.length; k < len; k++) {
          if (
            item.children[k].children &&
            item.children[k].children.length > 0 &&
            item.isOpen
          ) {
            childrenScorll = this.calculateSubset(
              item.children[k],
              childrenScorll
            )
          }
        }
      }
      return childrenScorll
    },
    /* 点击下拉列表外部，关闭列表框 */
    clickOutside(e) {
      const tag = e.target.classList
      if (
        tag.contains('multi-li') ||
        tag.contains('multi-div') ||
        tag.contains('multi-i') ||
        tag.contains('multi-span') ||
        tag.contains('multiList') ||
        tag.contains('multi-input') ||
        tag.contains('multi-li-pro')
      ) {
      } else {
        /* 判断是否是多选项 */
        if (this.cType === 'checkbox') {
          this.resolve(this.items)
        }
        this.resolve(null)
        this.closeList()
      }
    },
    // 移除组件
    closeList() {
      document.body.removeEventListener('click', this.clickOutside)
      this.$destroy()
      document.getElementById('app').removeChild(this.$el)
    },
    getName(data) {
      this.resolve(data)
      this.closeList()
    },
    /* 多选框的选择 */
    getNames(data) {
      if (data.isChecked) {
        /* 被选中直接加入 */
        this.$set(this.items, data.id, data)
      } else {
        /* 取消的判断原先是否存在 */
        if (this.items[data.id]) {
          // 存在，删除
          this.$delete(this.items, data)
        } else {
          // 不存在，存入
          this.$set(this.items, data.id, data)
        }
      }
    },
  },
  mounted() {
    // 创建之前销毁存在的方法
    this.$bus.$off('getName')
    this.$bus.$off('getNames')
    this.$bus.$on('getName', this.getName)
    this.$bus.$on('getNames', this.getNames)
  },
}
</script>

<style scoped lang="scss">
.multiList-edge {
  ::-webkit-scrollbar {
    // display: none;
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgb(239, 239, 239);
  }
  //滚动条的轨道（里面装有Thumb）
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #0a53a0;
  }
  //滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
  ::-webkit-scrollbar-thumb:hover {
    background: #103760;
  }
  .multiList {
    position: absolute;
    overflow-y: auto;
    user-select: none;
    border-radius: 5px;
    z-index: 999;
    font-size: 14px;
    color: #ffffff;
    background: #0a53a0;
    border: 1px solid #0092fe;
    .multi-span:hover {
      background: #204973ff;
    }
  }
}
.multiList-pro {
  .multiList {
    position: absolute;
    overflow-y: auto;
    user-select: none;
    z-index: 999;
    font-size: 16px;
    color: #323232;
    background: #ffffff;
    border: 1px solid #c6d9ff;
  }
}
</style>
