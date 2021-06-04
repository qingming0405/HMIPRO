<template>
  <div
    class="sn-general"
    v-resize="resize"
    ref='sn_general'
  >
    <div class="treeList">
      <div
        v-for="tree in treeList"
        :class="tree.isClick ? 'div-click' : ''"
        @click="clickTree(tree)"
      >
        <p>{{ tree.t_name }}</p>
      </div>
    </div>
    <div
      v-show="title.name!=''"
      class="sn-title"
    >
      <div :style="'font-size:'+title.fontsize">{{title.name}}</div>
    </div>
    <div
      class="background"
      :style="backgroundStyle"
      v-show="isShowBackground"
    ></div>
    <div
      class="general-div"
      v-show="!isShowBackground"
      ref='general_div'
    >
      <img
        class="general-img"
        :src="generalImg"
        alt=""
      />
      <div
        class="pumpIcon"
        v-for="item in itemList"
        :style="item.style"
        v-show="version == 0"
      >
        <img
          @dblclick="jumpToModel(item)"
          :src="item.imgSrc"
          alt=""
        />
        <i
          :class="
            item.isCheck
              ? 'iconfont icon-mianxing_fuzhi_huaban1'
              : 'iconfont icon-shoucang'
          "
          @click="choosePump(item)"
        ></i>
        <p>{{ item.pump_name }}</p>
      </div>
      <div
        class="pumpIcon"
        v-for="item in itemList"
        v-show="version == 1"
      >
        <div
          @dblclick="jumpToModel(item)"
          :style="item.PumpStyle"
        ></div>
        <i
          :class="
            item.isCheck
              ? 'iconfont icon-mianxing_fuzhi_huaban1'
              : 'iconfont icon-shoucang'
          "
          :style="item.FocusStyle"
          @click="choosePump(item)"
        ></i>
        <p :style="item.style">{{ item.pump_name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import snGeneral from 'common/general/sn/snGeneral.js'
export default {
  name: 'hgGeneral',
  mixins: [snGeneral],
  data() {
    return {}
  },
  methods: {
    /* 跳转到设备模型 */
    jumpToModel(item) {
      /* 从vuex中获取当前机组 */
      let pump_id = item.pump_id
      let t_id = item.t_id
      let macList = this.$store.state.mac[t_id]
      let mac
      macList.forEach((item) => {
        if (item.pump_id === pump_id) {
          mac = item
          return
        }
      })
      this.$store.commit('getCheckMsg', {
        msg: cloneObj(mac),
        type: 'mac',
      })
      /* 设置当前的机组 */
      this.$router.push({
        name: 'hgModel',
      })
    },
    setPump() {},
    clickTree() {},
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/style/css/fd.scss';
</style>