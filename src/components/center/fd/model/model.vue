<template>
  <div>
    <div
      class="wpower-modelitems"
      v-for="(param,key) in modelItem"
      v-if="param.isShow"
    >
      <div class="wpower-modelitems-title">
        <!-- <div class="modelitems-title-f1">华润瓜州-设备模型-C01号机组</div> -->
        <div class="modelitems-title-content">
          <div
            v-for="(item, index) in param.monitorePos"
            :class="{ active: item.isChoose, unactive: !item.isChoose }"
            class="wpower-monitore-postion"
            :ref="'monitore-postion' + index"
            @click="choosemonitore(index)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="wpower-modelitems-content">
        <keep-alive
          v-if="param.monitorePos.length > 1"
          style="height:100%;"
          :include="keepAlive"
        >
          <router-view />
        </keep-alive>
        <div
          class="wpower-modelitems-nonecontent"
          v-else
        ><img :src="param.imgBg" /></div>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneObj } from 'utils/utils.js'
export default {
  name: 'fdModelitem',
  data() {
    return {
      modelItem: {},
      currentKey: '',
    }
  },
  computed: {
    keepAlive() {
      return this.$store.getters.keepAlive
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdModelitem',
    })
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let mac, title
      for (let i in this.modelItem) {
        this.modelItem[i].isShow = false
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.modelItem)
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
        mac = this.modelItem[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          let monitorePos = cloneObj(this.$store.state.windmodelTitle)
          let route = this.$store.state.GeneralModel[key]
          for (let i = 0, l = monitorePos.length; i < l; i++) {
            monitorePos[i].isChoose = false
            if (route == monitorePos[i].router) {
              monitorePos[i].isChoose = true
            }
          }
          this.$set(this.modelItem, key, {
            mac,
            // 监测部位
            monitorePos,
            imgBg: require('assets/images/indexLogoBg2.png'),
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.modelItem[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.modelItem, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.modelItem[key].isShow = true
          break
      }
      let flag = false
      if (type === 0 || type === 1 || type === 4) {
        let route = this.$store.state.GeneralModel[key]
        for (
          let i = 0, l = this.modelItem[key].monitorePos.length;
          i < l;
          i++
        ) {
          this.modelItem[key].monitorePos[i].isChoose = false
          if (route == this.modelItem[key].monitorePos[i].router) {
            this.modelItem[key].monitorePos[i].isChoose = true
          }
        }
        this.modelItem[key].monitorePos.forEach((el) => {
          if (el.name == this.$t('HeaderEdge.secondLevel1_3')) {//'设备模型'
            flag = true
          }
        })
        if (!flag) {
          this.modelItem[key].monitorePos.push({
            isChoose: false,
            name: this.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
            router: 'fdModel',
          })
        }
        this.modelItem[key].monitorePos.forEach((element) => {
          if (element.isChoose === true) {
            // this.$router.push({ name: element.router })
            this.$store.commit('setGeneralModel', {
              key: this.currentKey,
              router: element.router,
            })
            // 设备模型跳转设备模型使用同一个key值调用getPath方法
            let params = {
              key: this.currentKey,
              val: this.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
              name: element.router,
              icon: 'icon-shijingsanwei-',
            }
            this.$bus.$emit('getPath', params)
          }
        })
      }
    },
    choosemonitore(index) {
      const param = this.modelItem[this.currentKey]
      for (let i = 0; i < param.monitorePos.length; i++) {
        param.monitorePos[i].isChoose = false
      }
      for (let i = 0; i < param.monitorePos.length; i++) {
        if (index === i) {
          param.monitorePos[i].isChoose = true
          // this.$router.push({
          //   name: this.monitorePos[i].router,
          // })
          this.$store.commit('setGeneralModel', {
            key: this.currentKey,
            router: param.monitorePos[i].router,
          })
          // 设备模型跳转设备模型使用同一个key值调用getPath方法
          let params = {
            key: this.currentKey,
            val: this.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
            name: param.monitorePos[i].router,
            icon: 'icon-shijingsanwei-',
          }
          this.$bus.$emit('getPath', params)
        }
      }
      // this.$store.commit('setWindmodelTitle', param.monitorePos)
    },
  },
  watch: {
    // '$store.state.windmodelTitle': {
    //   handler(value) {
    //     this.monitorePos = value
    //     let flag = false
    //     this.monitorePos.forEach((el) => {
    //       if (el.name == '设备模型') {
    //         flag = true
    //       }
    //     })
    //     if (!flag) {
    //       this.monitorePos.push({
    //         isChoose: false,
    //         name: '设备模型',
    //         router: 'fdModel',
    //       })
    //     }
    //     let routerpath = this.$route.name
    //     this.monitorePos.forEach((element) => {
    //       if (element.isChoose === true) {
    //         this.$router.push({ name: element.router })
    //       }
    //     })
    //   },
    //   deep: true,
    //   immediate: true,
    // },

    '$store.state.fdModelitemMsg': {
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
    // '$store.state.checkMsg': {
    //   handler(value) {
    //     if (value.mac === null) {
    //       this.monitorePos = []
    //       this.$store.commit('setWindmodelTitle', this.monitorePos)
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
}
</script>
<style scoped lang="scss">
.wpower-modelitems {
  display: flex;
  flex-direction: column;
  height: 100%;
  .wpower-modelitems-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 65px;
    .modelitems-title-f1 {
      width: 275px;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
    }
    .modelitems-title-content {
      // width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: absolute;
      top: 76px;
      right: 25px;
      .wpower-monitore-postion {
        width: 130px;
        height: 43px;
        background: #0b1757;
        box-shadow: 0px 0px 29px 0px rgba(6, 70, 167, 0.72) inset;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0px 0px 0px 30px;
        cursor: pointer;
      }
    }
  }
  .wpower-modelitems-content {
    height: calc(100% - 65px);
    width: 100%;
  }
  .wpower-modelitems-nonecontent {
    height: 100%;
    position: relative;
    width: 100%;
    img {
      width: 82%;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .active {
    border: 1px solid #00fcf9;
  }
  .unactive {
    border: 1px solid #4574d6;
  }
}
</style>
