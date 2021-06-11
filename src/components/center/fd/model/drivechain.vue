<template>
  <!-- 传动链 -->
  <div style="height:100%;">
    <div
      class="drivechain-model"
      v-for="(param,key) in fdModelInfo"
      v-show="param.isShow"
    >
      <div class="drivechain-line1">
        <div class="drivechain-line1-box1 Model-box">
          <div class="Model-header">{{$t('DriveChain.mainBearing')}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr v-for="(item,index) in param.mainbearData.mainBearing">
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
                  <div>{{item.pos_name}}</div>
                </td>
                <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
                <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('DriveChain.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="drivechain-line1-box2 Model-box">
          <div class="Model-header Model-header-model">
            <div>{{$t('DriveChain.digitalTwin')}}</div>
            <button
              @click="reset"
              class="pop-btn pop-btn-ok"
            >{{$t('DriveChain.resetBtn')}}</button>
          </div>
          <!-- 模型 -->
          <div
            :class="'container'+key"
            id="container"
          ></div>
          <div
            class='loading'
            v-show="param.loading"
          >
            <div id="loading-center">
              <div
                id="loading-center-absolute"
                ref="loadingAbsolute"
              >
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
                <div class="object"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drivechain-line2">
        <div class="drivechain-line2-box1 Model-box">
          <div class="Model-header">{{$t('DriveChain.gearBox')}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr v-for="(item,index) in param.mainbearData.gearBox">
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
                  <div>{{item.pos_name}}</div>
                </td>
                <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
                <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('DriveChain.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="drivechain-line2-box2 Model-box">
          <div class="Model-header">{{$t('DriveChain.generator')}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr v-for="(item,index) in param.mainbearData.alternator">
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
                  <div>{{item.pos_name}}</div>
                </td>
                <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
                <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('DriveChain.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="drivechain-line2-box3 Model-box">
          <div class="Model-header">{{$t('DriveChain.public')}}</div>
          <table class="model-table">
            <tbody class="my-table-tbody pro-scrollbar">
              <tr v-for="(item,index) in param.mainbearData.public">
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
                  <div>{{item.pos_name}}</div>
                </td>
                <td v-if="item.eigenvalue.value !== noDataText">{{item.eigenvalue.name}}:{{item.eigenvalue.value}}{{item.eigenvalue.unit}}</td>
                <td v-else>{{item.eigenvalue.name}}:{{item.eigenvalue.value}}</td>
                <td
                  class="model-td3"
                  @click="toReal(item)"
                >{{$t('DriveChain.moreText')}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { defaultCode, getUnit, round, cloneObj } from 'utils/utils.js'
import * as THREE from 'three'
import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'
import GLTFLoader from 'three-gltf-loader'
import { CSS2DRenderer, CSS2DObject } from 'three-css2drender'

const OrbitControls = require('three-orbit-controls')(THREE)

import common from './modelCommon'
export default {
  mixins: [common],
  name: 'fddrivechain',
  data() {
    return {
      fdModelInfo: {},
      currentKey: '',
      noDataText:'无数据',
    }
  },
  created() {
    this.noDataText = this.$t('Common.noDataText');

    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fddrivechain',
    })
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let mac
      for (let i in this.fdModelInfo) {
        this.fdModelInfo[i].isShow = false
        clearInterval(this.fdModelInfo[i].timer)
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.fdModelInfo)
      if (type === 0 || type === 1 || type === 4) {
        if (keyArr.indexOf(key) === -1) {
          type = 0
        } else {
          type = 1
        }
      }
      if (type === 0) {
        mac = cloneObj(this.$store.state.checkMsg.mac)
        this.currentKey = key
      } else if (type === 1 || type === 4) {
        mac = this.fdModelInfo[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.fdModelInfo, key, {
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
            loading: true,
            isRequestDown: true,
            isShow: true,
          })
          break
        case 1 /* 切换图表 */:
          this.fdModelInfo[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.fdModelInfo, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.fdModelInfo[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        this.fdModelInfo[key].driveChainArr = []
        clearInterval(this.fdModelInfo[key].timer)
        let fn = () => {
          this.getModelInfo(mac)
          return fn
        }
        this.fdModelInfo[key].timer = setInterval(fn(), 5000)
      }
    },
    /* 获取传动链信息信息 */
    getChainInfo() {
      const param = this.fdModelInfo[this.currentKey]
      let requestData = {
        mac_id: param.mac.mac_id,
        t_root: 0,
      }
      param.driveChainArr = []
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
    /* 初始化3D数据 */
    initParams() {
      const param = this.fdModelInfo[this.currentKey]
      param.scene = null
      param.light = null
      param.camera = null
      param.controls = null
      param.container = null
      param.chainWidth = ''
      param.chainHeight = ''
      param.mouse = null
    },
    /* 获取表格信息 */
    getModelInfo(mac) {
      const param = this.fdModelInfo[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
      }
      // this.mainbearData = {}
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name == 'fddrivechain'
      ) {
        if (param.isRequestDown) {
          param.isRequestDown = false
          this.$getApi.queryDriveChainByMacId(requestData).then((res) => {
            param.isRequestDown = true
            if (res) {
              let data = {}
              data.public = res.positions0
              data.mainBearing = res.positions1
              data.gearBox = res.positions2
              data.alternator = res.positions3
              //循环取默认特征值
              for (let item in data) {
                data[item].forEach((element) => {
                  element.position_type = element.pos_type
                  let eigenvalue = defaultCode[element.pos_type]
                  if (
                    element.baseInfo != null &&
                    element.baseInfo.baseInfo != null
                  ) {
                    for (let i in element.baseInfo.baseInfo) {
                      if (i === defaultCode[element.pos_type].filed) {
                        // eigenvalue = defaultCode[element.pos_type]
                        if (
                          element.baseInfo.baseInfo[i] !== null &&
                          element.baseInfo.baseInfo[i] < 100000000
                        ) {
                          //若当前特征值存在
                          eigenvalue.value = round(
                            element.baseInfo.baseInfo[i],
                            2
                          )
                          eigenvalue.unit = getUnit(
                            defaultCode[element.pos_type].code,
                            element
                          )
                        } else {
                          //不存在
                          eigenvalue.value = this.$t('Common.noDataText')//'无数据'
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
                    eigenvalue.value = this.$t('Common.noDataText')//'无数据'
                    if (eigenvalue.unit instanceof Array) {
                      eigenvalue.unit = eigenvalue.unit[0] //默认取第一个
                    }
                  }
                  element.eigenvalue = cloneObj(eigenvalue, true)
                })
              }
              param.mainbearData.public = data.public
              param.mainbearData.mainBearing = data.mainBearing
              param.mainbearData.gearBox = data.gearBox
              param.mainbearData.alternator = data.alternator
            }
          })
        }
        param.driveChainArr.length == 0 && this.getChainInfo() //第一次请求
      } else {
        clearInterval(this.fdModelInfo[this.currentKey].timer)
      }
    },
    //初始化three.js相关内容
    init() {
      const param = this.fdModelInfo[this.currentKey]
      //  创建场景对象Scene
      param.scene = new THREE.Scene()
      param.light = new THREE.HemisphereLight(0xffffff, 0x222222, 1.5)
      param.light.position.set(10, 140, 100)
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
      param.chainHeight = param.container.clientHeight - 40
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
      const param = this.fdModelInfo[this.currentKey]
      param.camera.aspect = param.chainWidth / param.chainHeight
      param.camera.updateProjectionMatrix()
      param.renderer.setSize(param.chainWidth, param.chainHeight)
    },
    animate() {
      const param = this.fdModelInfo[this.currentKey]
      if (param.isShow) {
        requestAnimationFrame(this.animate)
        this.render()
      }
    },
    render() {
      const param = this.fdModelInfo[this.currentKey]
      param.renderer.render(param.scene, param.camera)
    },
    //外部模型加载函数
    loadObj(arr) {
      const param = this.fdModelInfo[this.currentKey]
      param.mouse = new THREE.Vector3() //将屏幕坐标转换成three.js的坐标
      let _this = this
      var group = new THREE.Group()
      var x_scale = 20
      var y_scale = 10
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
                obj.position.x = mouse.x * 22
                obj.position.y = mouse.y * y_scale

                obj.scale.x = 5 //放大发电机
                obj.scale.y = 5
                obj.scale.z = 5
              } else {
                obj.position.x = mouse.x * x_scale
                obj.position.y = mouse.y * y_scale
                if (item.itemtype == 1) {
                  //itemtype==1表示叶片
                  obj.scale.x = 6 //放大叶片
                  obj.scale.y = 6
                  obj.scale.z = 6
                } else {
                  obj.scale.x = 4
                  obj.scale.y = 4
                  obj.scale.z = 4
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
    reset() {
      const param = this.fdModelInfo[this.currentKey]
      if (param.driveChainArr !== []) {
        param.camera.fov = 14
        param.camera.aspect = param.chainWidth / param.chainHeight
        param.camera.near = 0.1
        param.camera.far = 1000
        param.camera.position.set(-60, 0, 75)
        param.camera.lookAt(param.scene.position)
        param.controls = new OrbitControls(param.camera, param.container)
      } else {
        this.$pop(this.$t('Common.loadingUnfinished'))//'模型未加载完成！')
      }
    },
  },
  watch: {
    /* 获取选中机组信息 */
    // "$store.state.checkMsg.mac": {
    //   handler (value) {
    //     if (value != null) {
    //       this.mac = value;
    //       this.driveChainArr = [];
    //       this.getModelInfo(this.mac);
    //       clearInterval(this.timer)
    //       let fn = () => {
    //         this.getModelInfo(this.mac);
    //         return fn;
    //       };
    //       // this.getModelInfo(this.mac);
    //       console.log("创建定时器");
    //       this.timer = setInterval(fn(), 5000);
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
    '$store.state.fddrivechainMsg': {
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
    height: 50%;
    .drivechain-line1-box1 {
      height: 100%;
      .drivechain-table {
        width: 100%;
      }
    }
    .drivechain-line1-box2 {
      width: calc(66.6% + 6px);
      height: 100%;
      margin: 0px;
      position: relative;
      #container {
        width: 100%;
        height: 100%;
      }
    }
  }
  .drivechain-line2 {
    display: flex;
    flex-direction: row;
    height: calc(50% - 20px);
    .drivechain-line2-box3 {
      margin: 0px;
    }
  }
}
.drivechain-line1-box1,
.drivechain-line2-box2,
.drivechain-line2-box1,
.drivechain-line2-box3,
.drivechain-line1-box2 {
  width: calc(33.3% - 14px);
  height: 100%;
  margin-right: 20px;
}
.my-table-tbody {
  border: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

#loading-center {
  width: 100%;
  height: 100%;
  position: relative;
}
#loading-center-absolute {
  position: absolute;
  left: calc(50% - 75px);
  top: 50%;
  height: 50px;
  width: 150px;
  margin-top: -25px;
  margin-left: 35px;
  -webkit-animation: opacity 0.2s; //解决快速点击的logo闪烁问题
}
.object {
  width: 8px;
  height: 50px;
  margin-right: 5px;
  background-color: #48b4e3;
  -webkit-animation: animate 1s infinite;
  animation: animate 1s infinite;
  float: left;
}

.object:last-child {
  margin-right: 0px;
}

.object:nth-child(10) {
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
}
.object:nth-child(9) {
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
.object:nth-child(8) {
  -webkit-animation-delay: 0.7s;
  animation-delay: 0.7s;
}
.object:nth-child(7) {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.object:nth-child(6) {
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.object:nth-child(5) {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.object:nth-child(4) {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.object:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.object:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
@-webkit-keyframes animate {
  50% {
    -ms-transform: scaleY(0);
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}
@keyframes animate {
  50% {
    -ms-transform: scaleY(0);
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}
@-webkit-keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
.pop-btn {
  height: 26px;
  line-height: 26px;
  width: 60px;
  font-size: 14px;
  text-align: center;
  padding: 0;
  margin-left: 20px;
}
.Model-header-model {
  display: flex;
  justify-content: space-between;
}
</style>
