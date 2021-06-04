<template>
  <li
    class="multi-li"
    :class="flag === 'pro' ? 'multi-li-pro' : 'multi-l-edge'"
    v-show="listData.isShow"
  >
    <!-- :class="listData.isChoose? 'multi-div-active':''" -->
    <div
      class="multi-div"
      draggable="true"
      @dragstart="dragPos(listData, $event)"
    >
      <i
        class="iconfont multi-i"
        v-if="listData.children"
        :class="[
          listData.isOpen ? 'icon-shouqi_huaban' : 'icon-zhankai_huaban'
        ]"
        @click.stop="closeOrOpen(listData)"
      ></i>
      <i
        v-show="cType === 'checkbox' && listData.isChecked !== undefined"
        :class="[
          listData.isChecked
            ? 'icon-zhongzi_xuanzekuang1'
            : 'icon-zhongzi_xuanzekuang'
        ]"
        class="iconfont multi-i"
        @click.stop="emitName(listData, cType)"
      ></i>
      <div
        class="multi-span"
        @click.stop="
          () => {
            cType === 'single' && emitName(listData, cType);
          }
        "
        :title="listData.name"
      >
        {{ listData.name }}
      </div>
    </div>
    <ul
      class="multi-ul"
      v-if="listData.children && listData.isOpen"
    >
      <item
        v-for="(item, index) in listData.children"
        :listData="item"
        :dateType="dateType"
        :key="index"
        :cType="cType"
        :flag="flag"
      ></item>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'item',
  props: {
    listData: {
      type: Object,
      default: function () {
        return {}
      },
    },
    dateType: {
      type: String,
      default: '',
    },
    /* 标志是多选还是单选 */
    flag: {
      type: String,
      default: '',
    },
    /* 多选或者单选 */
    cType: {
      type: String,
      default: 'single', //single checkbox
    },
  },
  methods: {
    closeOrOpen(item) {
      item.isOpen = !item.isOpen
      this.$forceUpdate()
    },
    /* 选的时候 */
    emitName(listData, type) {
      /* 发送数据 */
      if (type === 'checkbox') {
        // 多选框
        listData.isChecked = !listData.isChecked
        // for (let i = 0, l = listData.children.length; i < l; i++) {
        //   listData.children[i].isChecked = listData.isChecked
        // }
        this.$bus.$emit('getNames', listData)
      } else if (type === 'single') {
        // 单选框
        this.$bus.$emit('getName', listData)
      }
      this.$forceUpdate()
    },
    /* 拖动测点 */
    dragPos(listData, e) {
      const str = JSON.stringify(listData)
      e.dataTransfer.setData('flag', str)
    },
  },
}
</script>

<style scoped lang="scss">
.multi-l-edge {
  line-height: 26px;
  .multi-ul {
    padding-left: 15px;
    width: 100%;
    line-height: 26px;
  }
  div {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .multi-div {
    display: flex;
    padding-left: 5px;
    align-items: center;
    i {
      line-height: 26px;
      cursor: pointer;
    }
    &:hover {
      background-color: #103760;
    }
  }
  .multi-div-active {
    background-color: #103760;
  }
  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 8px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
.multi-li-pro {
  line-height: 30px;
  .multi-ul {
    padding-left: 20px;
    width: 100%;
    line-height: 20px;
  }
  div {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .multi-div {
    display: flex;
    align-items: center;
    padding-left: 5px;
    i {
      line-height: 20px;
      cursor: pointer;
    }
  }
  .iconfont {
    padding-left: 10px;
  }
  .multi-span:hover {
    background: #c6d9ff;
  }
}
</style>
