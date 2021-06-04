import { cloneObj } from 'utils/utils.js'
const snModel = {
  data () {
    return {
      snModel: {},
      currentKey: '',
    }
  },
  created () {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'snModel',
    })
  },
  methods: {
    openChartList (key, type) {
      if (typeof key !== 'string') return
      let [, , macId] = key.split('_')
      let mac, title
      for (let i in this.snModel) {
        this.snModel[i].isShow = false
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.snModel)
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
        mac = this.snModel[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.snModel, key, {
            mac,
            title, //左上角标题
            monitorePos: [
              {
                name: this.$t('SnModel.titleBtn1'),//设备模型
                router: 'snMechineModel',
                isChoose: true,
                isShow: true,
              },
              {
                // name: '振动/温度',
                name: this.$t('SnModel.titleBtn2'),//测点列表
                router: 'snVib',
                isChoose: false,
                isShow: true,
              },
              {
                name: this.$t('SnModel.titleBtn3'),//油液参数
                router: "snOil",
                isChoose: false,
                isShow: false,
              },
              {
                name: this.$t('SnModel.titleBtn4'),//倾角
                router: "snTowerdrum",
                isChoose: false,
                isShow: false,
              }
            ],
            modelTitle: null,
            isShow: true,
          })
          this.getmodelTitle()
          break
        case 1 /* 切换图表 */:
          this.snModel[key].isShow = true
          this.getmodelTitle()
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.snModel, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.snModel[key].isShow = true
          this.getmodelTitle()
          break
      }
    },
    choosemonitore (index) {
      const param = this.snModel[this.currentKey]
      for (let i = 0; i < param.monitorePos.length; i++) {
        if (index === i) {
          param.monitorePos[i].isChoose = true
          // this.$router.push({
          //   name: param.monitorePos[i].router,
          // })
          this.$store.commit('setGeneralModel', {
            key: this.currentKey,
            router: param.monitorePos[i].router,
          })
          // 设备模型跳转设备模型使用同一个key值调用getPath方法
          let params = {
            key: this.currentKey,
            val: '设备模型',
            name: param.monitorePos[i].router,
            icon: 'icon-shijingsanwei-',
          }
          this.$bus.$emit('getPath', params)
        } else {
          param.monitorePos[i].isChoose = false
        }
      }
    },
    getmodelTitle () {
      const param = this.snModel[this.currentKey]
      param.modelTitle = this.$store.state.windmodelTitle
      let dip = false, oil = false
      for (let i = 0, l = param.modelTitle.length; i < l; i++) {
        if (param.modelTitle[i].name == '塔筒' || param.modelTitle[i].name == '基础') {
          dip = true;
        }
        if (param.modelTitle[i].name == '油液') {
          oil = true;
        }
      }
      param.monitorePos[2].isShow = oil;
      param.monitorePos[3].isShow = dip;
      // 默认推到水泥设备模型中
      let params = {
        key: this.currentKey,
        val: '设备模型',
        name: 'snMechineModel',
        icon: 'icon-shijingsanwei-',
      }
      this.$bus.$emit('getPath', params)
      let router = 'snMechineModel'
      for (let i = 0, l = param.monitorePos.length; i < l; i++) {
        if (param.monitorePos[i].isChoose == true) {
          router = param.monitorePos[i].router
        }
      }
      this.$store.commit('setGeneralModel', {
        key: this.currentKey,
        router: router,
      })
    }
  },
  watch: {
    /* '$store.state.windmodelTitle': {
      handler (value) {
        this.getmodelTitle()
      },
      deep: true,
      immediate: true,
    }, */
    '$store.state.snModelMsg': {
      handler (value) {
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
  }
}
export default snModel;