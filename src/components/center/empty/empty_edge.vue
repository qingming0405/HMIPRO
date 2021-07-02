<template>
  <div class="empty-edge">
    <img :src="imgBg" />
  </div>
</template>

<script>
import { cloneObj } from 'utils/utils.js'
export default {
  name: 'empty',
  data() {
    return {
      imgBg: require('assets/images/indexLogoBg2.png'),
      /*backgroundStyle: {
        //背景图
        background: `url(${require("assets/images/sn/background.png")})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom"
      }*/
    }
  },
  mounted() {
    // 跳转到第一个组织的总貌图
    // 获取第一个组织
    let index = 0
    let timer = setInterval(() => {
      let tree = this.$store.state.foldtree[0]
      index++
      //去store中获取10ms后没有数据就不会给，如果没有，代表没有组织，显示空白页，清空定时器
      if (tree || index == 10000) {
        clearInterval(timer)
      }
      if (tree) {
        let name = 'tyGeneral'
        // 使用线程防止异步产生标题错乱
        new Promise((resolve, reject) => {
          // 获取到第一个组织;
          this.$store.commit('getCheckMsg', {
            msg: cloneObj(tree),
            type: 'tree',
          })
          // 跳转到总貌图
          if (tree.t_root == 0) {
            name = 'fdGeneral'
          } else if (tree.t_root == 1) {
            name = 'snGeneral'
          } else if (tree.t_root == 2) {
            name = 'gjGeneral'
          } else if (tree.t_root == 3) {
            name = 'ytGeneral'
          } else if (tree.t_root == -1) {
            name = 'tyGeneral'
          }
          resolve('成功')
        }).then(() => {
          this.$bus.$emit('generalRouting', name, this.$t('HeaderEdge.firstLevel1'), 'icon-shouye1')
        })
      }
    }, 10)
    /* 申请缓存 */
    this.$store.commit('set_keepAlive', { method: 'add', keepAlive: 'empty' })
  },
  /* created() {
    if (localStorage.getItem('isChangelanguage')) {
      localStorage.setItem('isChangelanguage', false)
      this.$router.go(0)
    }
  }, */
}
</script>

<style scoped lang="scss">
.empty-edge {
  position: relative;
  img {
    width: 82%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
