<template>
  <!-- 传动链 -->
  <div class="drivechain-model">
    <div
      class="drivechain-line1"
      v-for="(param,key) in tyVib"
      v-show="param.isShow"
    >
      <div class="drivechain-line1-box1 Model-box">
        <div class="Model-header">{{$t('TyVib.tableTitle1')}}</div>
        <table class="model-table">
          <tbody class="my-table-tbody pro-scrollbar">
            <tr v-for="(item, index) in param.mainbearData.public" class="model-tr" @click="toReal(item)">
              <td
                class="model-td"
                :title="item.pos_name"
              >
                <div
                  v-show="item.alarm_status == 0"
                  class="pos-state state-offline"
                ></div>
                <div
                  v-show="item.alarm_status == 1"
                  class="pos-state"
                ></div>
                <div
                  v-show="item.alarm_status == 2"
                  class="pos-state state-warn"
                ></div>
                <div
                  v-show="item.alarm_status == 3"
                  class="pos-state state-alarm"
                ></div>
                <div>{{ item.pos_name }}</div>
              </td>
              <td>
                {{ item.eigenvalue.name }}:{{ item.eigenvalue.value
                }}{{ item.eigenvalue.unit }}
              </td>
              <td
                class="model-td3"
              >{{$t('Common.moreText')}}</td><!-- 详情 -->
            </tr>
          </tbody>
        </table>
      </div>
      <div class="drivechain-line1-box2 Model-box">
        <!-- 数字孪生 -->
        <div class="Model-header">{{$t('TyVib.tableTitle2')}}</div>
        <div
          id="container"
          :class="'container'+key"
        ></div>
        <!-- 模型 -->
      </div>
    </div>
  </div>
</template>
<script>
import {
  getdefaultCode,
  getUnit,
  round,
  matchRule,
  cloneObj,
} from 'utils/utils.js'
import * as THREE from 'three'
import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'
import GLTFLoader from 'three-gltf-loader'
import { CSS2DRenderer, CSS2DObject } from 'three-css2drender'
const OrbitControls = require('three-orbit-controls')(THREE)
export default {
  name: 'tyVib',
  data() {
    return {
      tyVib: {},
      currentKey: '',
    }
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId] = key.split('_')
      let mac, title
      for (let i in this.tyVib) {
        this.tyVib[i].isShow = false
        clearInterval(this.tyVib[i].timer)
        console.log('清空111' + this.currentKey)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.tyVib)
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
        mac = this.tyVib[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.tyVib, key, {
            mac,
            //四个图标信息，public：公共，mainBearing：主轴承，gearBox：齿轮箱，alternator：发电机
            mainbearData: {
              public: null,
              mainBearing: null,
              gearBox: null,
              alternator: null,
            },
            scene: null,
            light: null,
            camera: null,
            controls: null,
            renderer: null,
            container: null,
            chainWidth: '',
            chainHeight: '',
            mouse: null,
            driveChainArr: [], //传动链部件信息
            loading: false,
            isShow: true,
            timer: null,
          })
          break
        case 1 /* 切换图表 */:
          this.tyVib[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          clearInterval(this.tyVib[this.currentKey].timer)
          this.$delete(this.tyVib, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.tyVib[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        let fn = () => {
          this.getModelInfo(mac)
          return fn
        }
        console.log('创建定时器')
        clearInterval(this.tyVib[key].timer)
        this.tyVib[key].timer = setInterval(fn(), 10000)
        this.getChainInfo(mac)
      }
    },
    /* 获取表格信息 */
    getModelInfo(mac) {
      let requestData = {
        mac_id: mac.mac_id,
        ch_class: mac.ch_class,
      }
      const param = this.tyVib[this.currentKey]
      this.$getApi.queryDriveChainByMacId(requestData).then((res) => {
        if (res) {
          param.mainbearData.public = res.positions0
          param.mainbearData.mainBearing = res.positions1
          param.mainbearData.gearBox = res.positions2
          param.mainbearData.alternator = res.positions3
          //循环取默认特征值
          for (let item in param.mainbearData) {
            for (let k = 0; k < param.mainbearData[item].length; k++) {
              let element = param.mainbearData[item][k]
              element.position_type = element.pos_type
              const defaultCode = getdefaultCode(element.dgm_type)
              let eigenvalue = defaultCode[element.pos_type]
              if (
                element.baseInfo != null &&
                element.baseInfo.baseInfo != null
              ) {
                for (let i in element.baseInfo.baseInfo) {
                  if (i === defaultCode[element.pos_type].filed) {
                    if (
                      element.baseInfo.baseInfo[i] !== null &&
                      element.baseInfo.baseInfo[i] < 100000000
                    ) {
                      //若当前特征值存在
                      eigenvalue.value = round(element.baseInfo.baseInfo[i], 2)
                      eigenvalue.unit = getUnit(
                        defaultCode[element.pos_type].code,
                        element
                      )
                    } else {
                      //不存在
                      eigenvalue.value = this.$t('Common.noDataText')
                      eigenvalue.unit = getUnit(
                        defaultCode[element.pos_type].code,
                        element
                      )
                    }
                    if (eigenvalue.unit instanceof Array) {
                      eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
                    }
                    break
                  }
                }
              } else {
                eigenvalue.unit = getUnit(
                  defaultCode[element.pos_type].code,
                  element
                )
                eigenvalue.value = this.$t('Common.noDataText') /* '无数据' */
                if (eigenvalue.unit instanceof Array) {
                  eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
                }
              }
              element.eigenvalue = cloneObj(eigenvalue, true)
            }
          }
        }
      })
    },
    toReal(item) {
      const param = this.tyVib[this.currentKey]
      if (
        this.$store.state.checkMsg.mac &&
        (this.$store.state.checkMsg.mac.mac_id != param.mac.mac_id ||
          this.$store.state.checkMsg.mac.ch_class != param.mac.ch_class)
      ) {
        this.$store.commit('getCheckMsg', {
          msg: param.mac,
          type: 'mac',
        })
      }
      //从vuex取当前机组下的所有测点
      let posArray = this.$store.state.pos[item.mac_id]
      for (let i in posArray) {
        if (
          posArray[i].posFlag ===
          `${item.mac_id}_${item.pos_id}_${item.pos_type}`
        ) {
          this.$store.commit('getCheckMsg', {
            msg: posArray[i],
            type: 'pos',
          })
          if (
            !matchRule(
              posArray[i].position_type,
              'real',
              posArray[i].dgm_type,
              posArray[i].t_root
            )
          ) {
            //未能匹配 '该类型测点没有此图谱'
            this.$pop(this.$t('Common.noChartTips'))
            return
          }
          let name = 'real' //实时数据列表
          let val = this.$t('HeaderEdge.secondLevel4_2') //'实时数据列表'
          let icon = 'icon-shishishuju_huaban'
          let key = `${name}_pos_${item.mac_id}_${item.pos_id}_${item.pos_type}`
          this.$bus.$emit('choiceChartType', key, val)
        }
      }
    },
    /* 获取传动链信息信息 */
    getChainInfo(mac) {
      const param = this.tyVib[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
        t_root: 0,
        ch_class: mac.ch_class, //获取机泵的传动链模型
      }
      this.driveChainArr = []
      this.$getApi.queryDriveChainInfoByMachineId(requestData).then((res) => {
        if (res) {
          param.scene = null
          param.light = null
          param.camera = null
          param.controls = null
          param.renderer = null
          param.container = null
          param.chainWidth = ''
          param.chainHeight = ''
          param.mouse = null
          param.driveChainArr = res.driveChain.itemList
          this.init()
          if (
            res.driveChain != undefined &&
            res.driveChain.itemList != undefined &&
            res.driveChain.itemList.length
          ) {
            this.loadObj(param.driveChainArr)
            this.animate()
          }
        }
      })
    },
    //初始化three.js相关内容
    init() {
      const param = this.tyVib[this.currentKey]
      param.scene = new THREE.Scene()
      param.light = new THREE.HemisphereLight(0xffffff, 0x222222, 1.5)
      param.scene.add(param.light)
      param.container = document.getElementsByClassName(
        `container${this.currentKey}`
      )[0]
      param.container.style.visibility = 'hidden'
      while (param.container.hasChildNodes()) {
        //当div下还存在子节点时 循环继续
        param.container.removeChild(param.container.firstChild)
      }
      param.chainWidth = param.container.clientWidth
      param.chainHeight = param.container.clientHeight
      //初始化相机
      param.camera = new THREE.PerspectiveCamera(
        14,
        param.chainWidth / param.chainHeight,
        0.1,
        1000
      )
      param.camera.position.set(-60, 0, 75)
      param.camera.lookAt(param.scene.position)

      //初始化控制器
      param.controls = new OrbitControls(param.camera, param.container)
      param.controls.update()
      //渲染
      param.renderer = new THREE.WebGLRenderer({
        alpha: true,
      })
      param.renderer.setPixelRatio(window.devicePixelRatio) //为了兼容高清屏幕
      param.renderer.setSize(param.chainWidth, param.chainHeight)

      param.container.appendChild(param.renderer.domElement)
      window.addEventListener('resize', this.onWindowResize, false) //添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
    },
    //窗口监听函数
    onWindowResize() {
      const param = this.tyVib[this.currentKey]
      param.camera.aspect = param.chainWidth / param.chainHeight
      param.camera.updateProjectionMatrix()
      param.renderer.setSize(param.chainWidth, param.chainHeight)
    },
    animate() {
      const param = this.tyVib[this.currentKey]
      requestAnimationFrame(this.animate)
      param.renderer.render(param.scene, param.camera)
    },
    //外部模型加载函数
    loadObj(arr) {
      const param = this.tyVib[this.currentKey]
      param.mouse = new THREE.Vector3() //将屏幕坐标转换成three.js的坐标
      let _this = this
      var group = new THREE.Group()
      var x_scale = 20
      var y_scale = 12
      var cnt = 0 //计算循环次数
      var typeArr = []
      param.loading = true
      arr.forEach((item) => {
        item.position_x = Number(item.position_x)
        item.position_y = Number(item.position_y)
        if (item.itemtype == 2) {
          item.position_x = Number(item.position_x + 8)
          item.position_y = Number(item.position_y - 15)
        } else if (item.itemtype == 4) {
          item.position_y = Number(item.position_y + 20)
        } else if (item.itemtype == 5) {
          item.position_x = Number(item.position_x - 3)
          item.position_y = Number(item.position_y + 5)
        } else if (item.itemtype == 6) {
          item.position_y = Number(item.position_y + 8)
        } else if (item.itemtype == 1) {
          item.position_y = Number(item.position_y + 20)
          item.position_x = Number(item.position_x + 20)
        } else if (item.itemtype == 3) {
          item.position_x = Number(item.position_x + 10)
        } else if (item.itemtype == 7) {
          item.position_y = Number(item.position_y + 10)
        } else if (item.itemtype == 8) {
          item.position_x = Number(item.position_x + 60)
        }
        var mouse = new THREE.Vector3() //将屏幕坐标转换成three.js的坐标
        mouse.x = (item.position_x / param.chainWidth) * 2 - 1
        mouse.y = (item.position_y / param.chainHeight) * -2 + 1
        if (typeArr[item.itemtype] === undefined) {
          new GLTFLoader()
            .setPath('gltf/')
            .load(item.itemtype + '.glb', (gltf) => {
              let obj = gltf.scene

              if (item.itemtype == 8) {
                //itemtype==8表示是加载发电机
                obj.rotateY(Math.PI)
                obj.position.x = mouse.x * 21.5
                obj.position.y = mouse.y * y_scale

                obj.scale.x = 3 //放大发电机
                obj.scale.y = 3
                obj.scale.z = 3
              } else {
                obj.position.x = mouse.x * x_scale
                obj.position.y = mouse.y * y_scale
                if (item.itemtype == 1) {
                  //itemtype==1表示叶片
                  obj.scale.x = 4 //放大叶片
                  obj.scale.y = 4
                  obj.scale.z = 4
                } else {
                  obj.scale.x = 2.5
                  obj.scale.y = 2.5
                  obj.scale.z = 2.5
                }
              }
              if (obj.position.x < -18) {
                group.position.x = 2
              }
              if (obj.position.y > 8) {
                group.position.y = -2
              }
              if (obj.position.y < -7) {
                group.position.y = 2
              }
              group.add(gltf.scene)
              param.scene.add(group)
              cnt++
              if (cnt == arr.length) {
                //全部加载完再显示3D效果图
                param.loading = false
                param.container.style.visibility = 'visible'
              }
            })
        } else {
          group.add(typeArr[item.itemtype].clone())
          param.scene.add(group)
          cnt++
        }
      })
    },
  },
  deactivated() {
    console.log('清空' + this.currentKey)
    clearInterval(this.tyVib[this.currentKey].timer)
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'tyVib',
    })
  },
  watch: {
    '$store.state.tyVibMsg': {
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
}
</script>
<style scoped lang="scss">
.drivechain-model {
  display: flex;
  flex-direction: column;
  height: 100%;
  .drivechain-line1 {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    height: 100%;
    .drivechain-line1-box1 {
      width: calc(33.3% - 14px);
      height: 100%;
      margin-right: 20px;
    }
    .drivechain-line1-box2 {
      width: calc(66.6% + 6px);
    }
  }
}

#container {
  height: calc(100% - 36px);
  width: 100%;
}
</style>
