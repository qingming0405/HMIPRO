<template>
  <!-- 传动链 -->
  <div class="drivechain-model">
    <div class="drivechain-line1">
      <div class="drivechain-line1-box1 Model-box">
        <div class="Model-header">{{$t('TyVib.tableTitle1')}}</div>
        <table class="model-table">
          <tbody class="my-table-tbody pro-scrollbar">
            <tr v-for="(item, index) in mainbearData.public">
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
                @click="toReal(item)"
              >{{$t('Common.moreText')}}</td><!-- 详情 -->
            </tr>
          </tbody>
        </table>
      </div>
      <div class="drivechain-line1-box2 Model-box">
        <!-- 数字孪生 -->
        <div class="Model-header">{{$t('TyVib.tableTitle2')}}</div>
        <div id="container"></div>
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
  data() {
    return {
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
    }
  },
  methods: {
    /* 获取表格信息 */
    getModelInfo(mac) {
      let requestData = {
        mac_id: mac.mac_id,
      }
      this.$getApi.queryDriveChainByMacId(requestData).then((res) => {
        if (res) {
          this.mainbearData.public = res.positions0
          this.mainbearData.mainBearing = res.positions1
          this.mainbearData.gearBox = res.positions2
          this.mainbearData.alternator = res.positions3
          //循环取默认特征值
          for (let item in this.mainbearData) {
            for (let k = 0; k < this.mainbearData[item].length; k++) {
              let element = this.mainbearData[item][k]
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
                eigenvalue.value = this.$t('Common.noDataText')/* '无数据' */
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
          let val = '实时数据列表'
          let icon = 'icon-shishishuju_huaban'
          let key = `${name}_pos_${item.mac_id}_${item.pos_id}_${item.pos_type}`
          this.$bus.$emit('choiceChartType', key, val)
        }
      }
    },
    /* 获取传动链信息信息 */
    getChainInfo(mac) {
      // let mac = this.$store.state.checkMsg.mac;
      let requestData = {
        mac_id: mac.mac_id,
        t_root: 0,
      }
      this.driveChainArr = []
      this.$getApi.queryDriveChainInfoByMachineId(requestData).then((res) => {
        if (res) {
          this.scene = null
          this.light = null
          this.camera = null
          this.controls = null
          this.renderer = null
          this.container = null
          this.chainWidth = ''
          this.chainHeight = ''
          this.mouse = null
          this.driveChainArr = res.driveChain.itemList
          this.init()
          if (
            res.driveChain != undefined &&
            res.driveChain.itemList != undefined &&
            res.driveChain.itemList.length
          ) {
            this.loadObj(this.driveChainArr)
            this.animate()
          }
        }
      })
    },
    //初始化three.js相关内容
    init() {
      this.scene = new THREE.Scene()
      this.light = new THREE.HemisphereLight(0xffffff, 0x222222, 1.5)
      this.scene.add(this.light)
      this.container = document.getElementById('container')
      this.container.style.visibility = 'hidden'
      while (this.container.hasChildNodes()) {
        //当div下还存在子节点时 循环继续
        this.container.removeChild(this.container.firstChild)
      }
      this.chainWidth = this.container.clientWidth
      this.chainHeight = this.container.clientHeight
      //初始化相机
      this.camera = new THREE.PerspectiveCamera(
        14,
        this.chainWidth / this.chainHeight,
        0.1,
        1000
      )
      this.camera.position.set(-60, 0, 75)
      this.camera.lookAt(this.scene.position)

      //初始化控制器
      this.controls = new OrbitControls(this.camera, this.container)
      this.controls.update()
      //渲染
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
      })
      this.renderer.setPixelRatio(window.devicePixelRatio) //为了兼容高清屏幕
      this.renderer.setSize(this.chainWidth, this.chainHeight)

      this.container.appendChild(this.renderer.domElement)
      window.addEventListener('resize', this.onWindowResize, false) //添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
    },
    //窗口监听函数
    onWindowResize() {
      this.camera.aspect = this.chainWidth / this.chainHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.chainWidth, this.chainHeight)
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    //外部模型加载函数
    loadObj(arr) {
      this.mouse = new THREE.Vector3() //将屏幕坐标转换成three.js的坐标
      let _this = this
      var group = new THREE.Group()
      var x_scale = 20
      var y_scale = 12
      var cnt = 0 //计算循环次数
      var typeArr = []
      _this.loading = true
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
        mouse.x = (item.position_x / _this.chainWidth) * 2 - 1
        mouse.y = (item.position_y / _this.chainHeight) * -2 + 1
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
              this.scene.add(group)
              cnt++
              if (cnt == arr.length) {
                //全部加载完再显示3D效果图
                _this.loading = false
                this.container.style.visibility = 'visible'
              }
            })
        } else {
          group.add(typeArr[item.itemtype].clone())
          this.scene.add(group)
          cnt++
        }
      })
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  watch: {
    /* 获取选中机组信息 */
    '$store.state.checkMsg.mac': {
      handler(value) {
        if (value != null) {
          // this.getModelInfo(value);
          clearInterval(this.timer)
          let fn = () => {
            this.getModelInfo(value)
            return fn
          }
          // this.getModelInfo(this.mac);
          this.timer = setInterval(fn(), 10000)
          this.getChainInfo(value)
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
