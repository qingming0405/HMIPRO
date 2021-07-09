<template>
  <div>
    <div
      class="wpower-modelitems"
      v-for="(params,index) in tyModel"
      v-if="params.isShow"
    >
      <div class="wpower-modelitems-title">
        <div
          v-for="(item, index) in params.monitorePos"
          class="wpower-monitore-postion"
          @click="choosemonitore(index)"
          :class="{ 'choose-item': item.isChoose }"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="wpower-modelitems-content">
        <template :include="keepAlive">
          <router-view class="snModel" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneObj } from 'utils/utils.js'
export default {
  name: 'tyModel',
  data() {
    return {
      monitorePos: [
        {
          name: this.$t('Common.chainText'), //"传动链",
          router: 'tyVib',
          isChoose: true,
        },
        // {
        //   name: "油液参数",
        //   router: "snOil",
        //   isChoose: false
        // },
        // {
        //   name: "倾角",
        //   router: "snTowerdrum",
        //   isChoose: false
        // }
      ],
      tyModel: {},
      currentKey: '',
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'tyModel',
    })
  },
  watch: {
    '$store.state.tyModelMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.key, item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId] = key.split('_')
      let mac, title
      for (let i in this.tyModel) {
        this.tyModel[i].isShow = false
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.tyModel)
      if (type === 0 || type === 1 || type === 4) {
        if (keyArr.indexOf(key) === -1) {
          type = 0
          title = cloneObj(this.$store.state.chooseTitle.generalTitle)
        } else {
          type = 1
        }
      }
      if (type === 0) {
        mac = cloneObj(this.$store.state.checkMsg.mac)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        mac = this.tyModel[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.tyModel, key, {
            mac,
            title, //左上角标题
            monitorePos: this.monitorePos,
            modelTitle: null,
            isShow: true,
          })
          this.choosemonitore(0)
          break
        case 1 /* 切换图表 */:
          this.tyModel[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.tyModel, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.tyModel[key].isShow = true
          break
      }
    },
    choosemonitore(index) {
      const param = this.tyModel[this.currentKey]
      const store = this.$store
      const mac = param.mac
      let macArray = store.state.mac[mac.t_id]
      let choosemac = store.state.checkMsg.mac
      let choosetree = cloneObj(store.state.checkMsg.tree)
      for (let i = 0; i < param.monitorePos.length; i++) {
        if (index === i) {
          // this.monitorePos[i].isChoose = true
          // this.$router.push({
          //   name: this.monitorePos[i].router,
          // })
          param.monitorePos[i].isChoose = true
          new Promise((resolve, reject) => {
            if (choosemac !== null && choosemac.pump_id == mac.pump_id) {
              if (choosemac.t_id != choosetree.t_id) {
                let treeArray = store.state.tree
                treeArray.forEach((tree) => {
                  if (choosemac.t_id == tree.t_id) {
                    store.commit('getCheckMsg', {
                      msg: cloneObj(tree),
                      type: 'tree',
                    })
                    store.commit('getCheckMsg', {
                      msg: cloneObj(choosemac),
                      type: 'mac',
                    })
                    resolve('成功')
                  }
                })
              }
              resolve('成功')
            } else {
              for (let i = 0; i < macArray.length; i++) {
                if (macArray[i].pump_id == mac.pump_id) {
                  /* 设置当前的机组 */
                  if (macArray[i].t_id != choosetree.t_id) {
                    let treeArray = store.state.tree
                    treeArray.forEach((tree) => {
                      if (macArray[i].t_id == tree.t_id) {
                        store.commit('getCheckMsg', {
                          msg: cloneObj(tree),
                          type: 'tree',
                        })
                      }
                    })
                  }
                  store.commit('getCheckMsg', {
                    msg: macArray[i],
                    type: 'mac',
                  })
                  resolve('成功')
                  break
                }
              }
            }
          }).then(() => {
            this.$store.commit('setGeneralModel', {
              key: this.currentKey,
              router: param.monitorePos[i].router,
            })
            // 设备模型跳转设备模型使用同一个key值调用getPath方法
            let params = {
              key: this.currentKey,
              val: this.$t('YtModel.macModel'), //'设备模型',
              name: param.monitorePos[i].router,
              icon: 'icon-shijingsanwei-',
            }
            this.$bus.$emit('getPath', params)
          })
        } else {
          this.monitorePos[i].isChoose = false
        }
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import '@/assets/style/css/model.scss';
</style>
<style scoped lang="scss">
.snModel {
  height: 100%;
  width: 100%;
}
</style>
