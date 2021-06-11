<template>
  <div>
    <div
      class="general-model"
      id="model"
      v-for="(param,key) in windModel"
      v-show="param.isShow"
    >
      <div class="windBtnBlock">
        <button
          @click="changeWindType()"
          class="btn"
          ref="skinBtn"
        >{{param.windTypeText}}</button>
        <button
          @click="stopRotate()"
          class="btn"
        >{{$t('WindModel.btnStopText')}}</button>
        <button
          @click="changeToLink()"
          class="btn"
        >{{$t('WindModel.btn2dText')}}</button>
        <!--      <button @click="checkBolt()" class="btn">查看螺栓</button>-->
      </div>
      <div class="right-content">
        <!--部件报警状态-->
        <div
          class="right-block"
          v-show="param.modelTitleName.length>0"
        >
          <div class="right-title"><span>{{$t('WindModel.detectPart')}}</span><span>{{$t('WindModel.healthValue')}}</span></div>
          <ul class="modelList">
            <li
              class="modelItem"
              :class="'modelItem'+key"
              v-for="(model,index) in param.modelItems"
              :key="index"
              @dblclick="toModelIitem(model)"
              @click.stop="showModel(model,$event)"
            >
              <div class="icon-block">
                <i
                  class="iconfont"
                  :class="addClass(model)"
                ></i>
              </div>
              <p class="modelName">{{model.name}}</p>
              <span
                class="health"
                :class="'alarm' + model.alarm_status"
              >{{model.health}}</span>
            </li>
          </ul>
        </div>
        <!--故障信息-->
        <div
          class="general-equip-diagnosis"
          v-if="param.diagnosis.driveChain && param.diagnosis.driveChain.diagnosis && param.diagnosis.driveChain.diagnosis.length > 0"
        >
          <div class="diagnosis-f1">{{$t('WindModel.diagnosisText')}}</div>
          <div class="diagnosis-content">
            <div>
              <i class="iconfont icon-chuandonglian"></i>
              <div>{{$t('WindModel.diagnosisTitle')}}</div>
            </div>
            <ul>
              <li
                v-for="item in param.diagnosis.driveChain.diagnosis"
                :class="[
                  diagnosis.driveChain.status === 2
                    ? 'warn-li'
                    : '',
                  diagnosis.driveChain.status === 3
                    ? 'alarm-li'
                    : '',
                  diagnosis.driveChain.status === 1 ||
                  diagnosis.driveChain.status === 0 ||
                  diagnosis.driveChain.status === null
                    ? ''
                    : ''
                ]"
              >{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
      <!--部件弹窗-->
      <div
        class="toolBox"
        :id="'toolBox'+key"
        v-show="param.isShowBlook"
      >
        <div
          class="tool-content"
          @click="toModelIitem(param.model)"
        >
          <div id="title">
            <p class="name">{{param.model.name}}</p>
            <p :class="'alarmText' + param.model.alarmStatus">{{param.model.alarmText}}</p>
          </div>
          <div
            class="img"
            :class="'alarmImg' + param.model.alarmStatus"
          >
            <span
              class="healthText"
              :class="'alarmText' + param.model.alarmStatus"
            >{{param.model.healthVal}}</span>
          </div>
        </div>
        <div id="circle">
          <div class="smallcircle2"></div>
          <div class="bigcircle2"></div>
        </div>
      </div>
      <div
        class="container"
        :id="'container'+key"
      ></div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three/build/three.module.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GLTFLoader from 'three-gltf-loader'

import { windObj0, windObj1, windObj2 } from './jsonData'
import { cloneObj } from 'utils/utils.js'

var scene,
  backgroundscene,
  bgPass,
  light,
  camera,
  backgroundCamera,
  controls,
  renderer,
  raycaster,
  mouseVector,
  groupHead,
  groupFly,
  composer,
  outlinePass,
  myReq,
  bloomPass
export default {
  name: 'windModel',
  data() {
    return {
      windModel: {},
      currentKey: '',
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    // this.$parent.$el.style.background = '#092e55'
    if (renderer) {
      //清除掉缓存
      raycaster = null
      mouseVector = null
      this.initParams()
      this.clearRenderer()
    }
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'windModel',
    })
    //声明raycaster和mouse变量
  },
  activated(){
    this.$parent.$el.style.background = '#000'
  },
  mounted() {
    window.addEventListener('resize', this.onWindowResize, false)
    document.addEventListener('click', () => {
      let domList = document.getElementsByClassName(
        `modelItem${this.currentKey}`
      )[0]
      if (domList) {
        for (let i = 0; i < domList.length; i++) {
          let item = domList[i]
          item.classList.remove('active')
        }
        this.clearOutLine() //清除outline
      }
    })
  },
  methods: {
    openChartList(key, type) {
      if (typeof key !== 'string') return
      let [, , macId] = key.split('_')
      let mac, title
      for (let i in this.windModel) {
        this.windModel[i].isShow = false
      }
      /*  总貌图设备模型多开增加了一个type强行变为0的设计，在这边重新判断type */
      const keyArr = Object.keys(this.windModel)
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
        mac = this.windModel[key].mac
        this.currentKey = key
      }
      switch (type) {
        case 0 /* 打开图表 */:
          this.$set(this.windModel, key, {
            mac,
            modelItems: [],
            modelTitle: [],
            modelTitleName: [],
            timer: '', //定时器
            diagnosis: {} /* 设备诊断 */,
            container: null,
            chainWidth: '',
            chainHeight: '',
            selectedObjects: [],
            windType: true, //风机模式：true白色，false网格
            windTypeText: this.$t('WindModel.btnPerspective'),//'透视效果',
            model: {
              //弹窗部件信息
              name: '', //弹窗部件名
              alarmText: '', //报警状态文字
              alarmStatus: '', //报警状态
              healthVal: '', //健康值
            },
            chainModelNameList: [
              'niebumoxing_zhuzhou',
              'neibumoxing_fadianji',
              'neibumoxing_youlengzhuangzhi',
              'neibumoxing_fenglengzhuangzhi',
              'neibumoxing_pianhangzhuangzhi',
              'neibumoxing_guizi',
              'neibumoxing_fadianjilianjiezhou',
              'neibumoxing_zhiqufadianji',
              'neibumoxing_zhuzhoucheng',
            ], //属于传动链的模型
            modelLen: 0, //加载的模型个数
            timerThree: null, //渲染动画定时器
            isShowBlook: false, //部件信息弹窗是否显示
            isRotate: true, //是否旋转
            rotateVal: -0.03, //旋转值
            finishRotate: false, //是否旋转停止
            removeBloom: false, //是否停止发光
            flangeNum: 0, //监控法兰数目
            flangeType: 0, //螺栓类型，4，6，8，k
            isRequestDown: true, //机组健康值请求是否结束
            isFlangeReqDown: true, //螺栓请求是否结束
            isShow: true,
          })
          raycaster = new THREE.Raycaster()
          mouseVector = new THREE.Vector3()
          // this.$nextTick(() => {
          //   this.$parent.$el.style.background = '#000'
          // })
          this.getmodelTitle()
          break
        case 1 /* 切换图表 */:
          this.windModel[key].isShow = true
          break
        case 2 /* 关闭图表 */:
          this.$delete(this.windModel, key)
          break
        case 4 /* 从其他图表跳转已存在图标 */:
          this.windModel[key].isShow = true
          break
      }
      if (type === 0 || type === 1 || type === 4) {
        clearInterval(this.windModel[key].timer)
        let fn = () => {
          this.getModelItem(mac)
          return fn
        }
        this.windModel[key].timer = setInterval(fn(), 6000)
        this.$nextTick(() => {
          if (renderer) {
            this.initParams()
            this.clearRenderer()
          }
          this.init()
          this.getModelInfo(mac)
        })
      }
    },
    checkBolt() {
      camera.fov = 1
    },
    //加载3d
    //初始化three.js相关内容
    init() {
      const param = this.windModel[this.currentKey]
      let that = this
      //  创建场景对象Scene
      backgroundscene = new THREE.Scene() //背景场景
      backgroundCamera = new THREE.Camera()
      backgroundscene.add(backgroundCamera)
      backgroundscene.background = new THREE.Color(0x000000)
      //  创建场景对象Scene
      scene = new THREE.Scene() //主体场景
      let ambientLight = new THREE.AmbientLight(0xcccccc, 0.2)
      ambientLight.layers.enable(0)
      ambientLight.layers.enable(1)
      scene.add(ambientLight)

      light = new THREE.HemisphereLight(0xffffff, 0x222222, 0.8)
      light.layers.enable(0)
      light.layers.enable(1)
      light.position.set(10, 140, 100)
      scene.add(light)
      const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
      light2.position.set(0, 60, 0) // ~60º
      light2.layers.enable(0)
      light2.layers.enable(1)
      scene.add(light2)
      param.container = document.getElementById(`container${this.currentKey}`)

      param.chainWidth = param.container.clientWidth
      param.chainHeight = param.container.clientHeight
      //初始化相机
      camera = new THREE.PerspectiveCamera(
        60,
        param.chainWidth / param.chainHeight,
        1,
        100000
      )
      camera.position.x = 0
      camera.position.y = 409
      camera.position.z = 2018
      camera.lookAt(scene.position)
      //初始化控制器
      controls = new OrbitControls(camera, param.container)
      controls.addEventListener('change', () => {
        param.isShowBlook = false
      })
      controls.update()
      //渲染
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true, //网格模型与白色实体一起加载时有重合，去掉重合部分
      })
      renderer.shadowMap.enabled = true
      renderer.setPixelRatio(window.devicePixelRatio) //为了兼容高清屏幕
      renderer.setSize(param.chainWidth, param.chainHeight)

      param.container.appendChild(renderer.domElement)
      window.addEventListener('resize', param.onWindowResize, false) //添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
      composer = new EffectComposer(renderer)

      bgPass = new RenderPass(backgroundscene, backgroundCamera)
      composer.addPass(bgPass)

      let renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)
      /**
       * 抗锯齿
       * **/
      let FXAAShaderPass = new ShaderPass(FXAAShader) //抗锯齿
      FXAAShaderPass.uniforms['resolution'].value.set(
        1 / param.chainWidth,
        1 / param.chainHeight
      )
      FXAAShaderPass.renderToScreen = true
      composer.addPass(FXAAShaderPass)
      /**
       * 模型外边框选中状态
       * **/
      outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera
      )
      outlinePass.edgeStrength = 5 //包围线浓度
      outlinePass.edgeGlow = 0.3 //边缘线范围
      outlinePass.edgeThickness = 1 //边缘线浓度
      outlinePass.pulsePeriod = 2 //包围线闪烁频率
      outlinePass.visibleEdgeColor.set('#ffffff') //包围线颜色
      outlinePass.hiddenEdgeColor.set('#cccccc') //被遮挡的边界线颜色
      composer.addPass(outlinePass)
      /**
       * 辉光
       * **/
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      )
      bloomPass.threshold = 0
      bloomPass.strength = 2.5
      bloomPass.radius = 0
      composer.addPass(bloomPass)

      // this.container.addEventListener( 'click', that.onMouseClick, false);//鼠标点击事件
      // this.container.addEventListener( 'mousemove', that.onTouchMoveCamera, false);
      // this.container.addEventListener( 'touchmove', that.onTouchMoveCamera, false);
    },
    //窗口监听函数
    onWindowResize() {
      const param = this.windModel[this.currentKey]
      camera.aspect = param.chainWidth / param.chainHeight
      camera.updateProjectionMatrix()
      renderer.setSize(param.chainWidth, param.chainHeight)
      composer.setSize(param.chainWidth, param.chainHeight)
    },
    animate() {
      const param = this.windModel[this.currentKey]
      if (!param.removeBloom) {
        bloomPass.strength -= 0.01
        if (bloomPass.strength < 0) {
          bloomPass.strength = 2.5
        }
      }
      camera.lookAt(scene.position)
      let fov = camera.fov
      fov -= fov > 10 ? 0.5 : 0
      groupFly.position.x = 0
      camera.fov = fov
      if (camera.fov === 10) {
        groupFly.rotation.y -= groupFly.rotation.y > -1 ? 0.02 : 0
        //旋转停止再褪去白色模型
        if (groupFly.rotation.y < -1 || groupFly.rotation.y === -1) {
          param.finishRotate = true
        }
      }
      groupHead.rotateZ(param.rotateVal)
      camera.updateProjectionMatrix()
      renderer.autoClear = false
      renderer.clear()
      renderer.render(backgroundscene, backgroundCamera)
      camera.layers.set(1)
      composer.render()
      renderer.clearDepth() // 清除深度缓存
      camera.layers.set(0)
      myReq = requestAnimationFrame(this.animate) //请求再次执行渲染函数render，渲染下一帧
      renderer.render(scene, camera)
    },
    //暂停旋转动画
    stopRotate() {
      const param = this.windModel[this.currentKey]
      param.isRotate = !param.isRotate
      if (param.isRotate) {
        param.rotateVal = -0.03
      } else {
        param.rotateVal = 0
      }
    },
    //外部模型加载函数
    loadObj() {
      const param = this.windModel[this.currentKey]
      let _this = this
      let modelData = this.getMacType()
      let arr = {
        groupHeadArr: [],
        groupFlyArr: [],
        otherArr: [],
      }
      groupHead = new THREE.Group()
      groupFly = new THREE.Group()
      for (let i = 0; i < modelData.length; i++) {
        let item = modelData[i]
        new GLTFLoader().setPath('windGlb/').load(item.glb + '.glb', (gltf) => {
          let obj = gltf.scene
          obj.traverse(function (child) {
            if (child.isMesh) {
              child.geometry.computeBoundingSphere()
              child.receiveShadow = true
              child.castShadow = true
              child.scale.set(0.1, 0.1, 0.1)
              let name = child.name
              if (name.indexOf('liudong') != -1) {
                child.layers.set(1)
              }
              if (
                name.indexOf('bianjiangxitong') != -1 ||
                name.indexOf('jitou') != -1 ||
                name.indexOf('yelun') != -1
              ) {
                if (name.indexOf('yelun') != -1) {
                  child.name_text = '叶轮'
                }
                arr.groupHeadArr.push(child)
              } else if (name.indexOf('maoshuan') != -1) {
                if (
                  name.indexOf('maoshuan_0') != -1 ||
                  name.indexOf('maoshuan_1') != -1
                ) {
                  child.visible = false
                }
                child.name_text = '锚栓'
                if (name.indexOf('banzhiqu') != -1) {
                  //半直驱的需要加入旋转的组合
                  arr.groupFlyArr.push(child)
                } else {
                  arr.otherArr.push(child)
                }
              } else if (name.indexOf('tatong') != -1) {
                child.name_text = '塔筒'
                if (name.indexOf('banzhiqu') != -1) {
                  //半直驱的需要加入旋转的组合
                  arr.groupFlyArr.push(child)
                } else {
                  arr.otherArr.push(child)
                }
              } else if (name.indexOf('jichu') != -1) {
                child.name_text = '基础'
                if (name.indexOf('banzhiqu') != -1) {
                  arr.groupFlyArr.push(child) //半直驱的需要加入旋转的组合
                } else {
                  arr.otherArr.push(child)
                }
              } else if (name.indexOf('luoshuan') != -1) {
                child.name_text = '螺栓'
                let num = Number(name.split('_').slice(-1))
                if (param.flangeNum === 1) {
                  //检测一个法兰
                  if (num !== 3) {
                    child.visible = false
                  }
                } else if (param.flangeNum === 2) {
                  //检测2个法兰
                  if (num === 1 || num === 3 || num === 5) {
                    child.visible = false
                  }
                } else if (param.flangeNum === 3) {
                  //检测3个法兰
                  if (num === 2 || num === 4) {
                    child.visible = false
                  }
                } else if (param.flangeNum === 4) {
                  //检测4个法兰
                  if (num === 5) {
                    child.visible = false
                  }
                } else {
                  child.visible = true
                }
                if (name.indexOf('banzhiqu') != -1) {
                  //半直驱的需要加入旋转的组合
                  arr.groupFlyArr.push(child)
                } else {
                  arr.otherArr.push(child)
                }
              } else if (
                name.indexOf('jicang') != -1 ||
                name.indexOf('fadianji') != -1 ||
                name.indexOf('zhuzhou') != -1 ||
                name.indexOf('tizi') != -1 ||
                name === 'neibumoxing_jicangdizuo' ||
                name === 'neibumoxing_guizi' ||
                name === 'neibumoxing_bianjiangxitongzhou' ||
                name === 'neibumoxing_fadianjilianjiezhou' ||
                name === 'neibumoxing_chilunxiang' ||
                name === 'neibumoxing_pianhangzhuangzhi' ||
                name === 'neibumoxing_chuandonglian'
              ) {
                if (name.indexOf('jicang') != -1) {
                  child.name_text = '机舱'
                }
                if (name === 'neibumoxing_chuandonglian') {
                  child.name_text = '传动链'
                }
                if (name === 'neibumoxing_chilunxiang') {
                  child.name_text = '油液'
                }
                arr.groupFlyArr.push(child)
              } else {
                arr.otherArr.push(child)
              }
            }
          })
          ;[].forEach.call(arr.groupHeadArr, function (item, index) {
            groupHead.add(item)
          })
          ;[].forEach.call(arr.groupFlyArr, function (item, index) {
            groupFly.add(item)
          })
          ;[].forEach.call(arr.otherArr, function (item, index) {
            scene.add(item)
          })
        })
      }
      groupFly.add(groupHead)
      scene.add(groupFly)
      _this.animate()
    },
    //获取法兰螺栓画图数据+图表数据
    getModelInfo(mac) {
      const param = this.windModel[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
      }
      if (param.isFlangeReqDown) {
        param.isFlangeReqDown = false
        this.$getApi.queryBoltByMacId(requestData).then((res) => {
          param.isFlangeReqDown = true
          if (res) {
            res && res.positions3 && this.setModelInfo(res.positions3)
          }
        })
      }
    },
    //处理法兰螺栓画图数据+图表数据
    setModelInfo(res) {
      const param = this.windModel[this.currentKey]
      let pos = res
      let flangeName = [] //去重后的法兰名称
      //获取法兰列表
      for (let k = 0; k < pos.length; k++) {
        let item = pos[k]
        if (item.flangeInfo && item.flangeInfo.byName) {
          flangeName.push(item.flangeInfo.byName)
        }
      }
      //获得去重后的法兰名称
      flangeName = [...new Set(flangeName)]

      //获得  [法兰名称：pos数组,法兰名称：pos数组]
      for (let i = 0; i < flangeName.length; i++) {
        let item = flangeName[i]
        let arr = []
        for (let k = 0; k < pos.length; k++) {
          if (
            pos[k].flangeInfo &&
            pos[k].flangeInfo.byName &&
            item === pos[k].flangeInfo.byName
          ) {
            arr.push(pos[k])
          }
        }
        param.flangeNum = arr.length //法兰数量
      }

      let len = pos.length
      if (len === 0) {
        param.flangeType = 0
      } else if (len && len < 5) {
        param.flangeType = 4
      } else if (len < 7 && len > 4) {
        param.flangeType = 6
      } else {
        param.flangeType = 8
      }
      this.loadObj()
    },
    //获取当前机组类型对应的模型列表
    getMacType() {
      const param = this.windModel[this.currentKey]
      let modelData = [] //需要加载的模型
      let type = param.mac.mac_type //机组类型
      let obj = {
        //内部模型
        modelType: 'gltf',
        mode: '线框',
        name: '内部模型螺栓',
        glb: 'shuangkui_neibumoxing_luoshuan_4',
      }
      if (type) {
        switch (Number(type)) {
          case 0:
            obj.glb = `shuangkui_neibumoxing_luoshuan_${param.flangeType}`
            windObj0.push(obj)
            modelData = windObj0 //双馈
            break
          case 1:
            obj.glb = `zhiqu_neibumoxing_luoshuan_${param.flangeType}`
            windObj1.push(obj)
            modelData = windObj1 //直驱
            break
          case 2:
            obj.glb = `banzhiqu_neibumoxing_luoshuan_${param.flangeType}`
            windObj2.push(obj)
            modelData = windObj2 //半直驱
            break
        }
      } else {
        modelData = param.windObj0
      }
      return modelData
    },
    /**
     * 清空当前scene对象的缓存
     *
     * */
    clearObject() {
      let that = this
      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh) {
          that.clearCache(obj) //清除掉每一个模型的缓存
        }
      })
      groupHead.traverse(function (obj) {
        if (obj instanceof THREE.Mesh) {
          that.clearCache(obj) //清除掉每一个模型的缓存
        }
      })
      groupFly.traverse(function (obj) {
        if (obj instanceof THREE.Mesh) {
          that.clearCache(obj) //清除掉每一个模型的缓存
        }
      })
    },
    /**
     * 清空当前obj对象的缓存
     * @param object object3D对象或mesh对象
     * */
    clearCache(object) {
      let mesh = object
      mesh.geometry.dispose()
      mesh.material.dispose()
    },
    /**
     * 清空渲染器缓存
     */
    clearRenderer() {
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement = null
      renderer = null
    },
    /**
     * 风机模型切换
     */
    changeWindType() {
      const param = this.windModel[this.currentKey]
      param.windType = !param.windType
      let that = this
      scene.traverse(function (obj) {
        if (obj.type === 'Mesh' && obj.name.indexOf('baiseshiti') != -1) {
          if (param.windType) {
            param.windTypeText = that.$t('btnPerspective.btnPerspective') //透视效果
            obj.visible = true
          } else {
            param.windTypeText = that.$t('btnPerspective.btnPhysical') //'风机外观'
            obj.visible = false
          }
        }
      })
    },
    /**
     * 风机模型切换到2D模式
     */
    changeToLink() {
      // this.$parent.$el.style.background = '#092e55'
      if (renderer) {
        //清除掉缓存
        raycaster = null
        mouseVector = null
        this.initParams()
        this.clearRenderer()
      }
      // this.$router.push('fdModel')
      this.$store.commit('setGeneralModel', {
        key: this.currentKey,
        router: 'fdModel',
      })
      // 设备模型跳转设备模型使用同一个key值调用getPath方法
      let params = {
        key: this.currentKey,
        val: this.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
        name: 'fdModel',
        icon: 'icon-shijingsanwei-',
      }
      this.$bus.$emit('getPath', params)
    },
    /**
     * 鼠标滑过报警部件，风机模型该部件高亮
     */
    showModel(model, event) {
      const param = this.windModel[this.currentKey]
      let domList = document.getElementsByClassName(
        `modelItem${this.currentKey}`
      )[0]
      for (let i = 0; i < domList.length; i++) {
        let item = domList[i]
        item.classList.remove('active')
      }
      if (event) {
        event.currentTarget.classList.add('active')
      }
      outlinePass.selectedObjects = []
      let selectedObject = []
      let name = model.name
      let status = model.alarm_status
      switch (status) {
        case 0:
        case null:
          outlinePass.visibleEdgeColor.set('#ffffff') //包围线颜色 = '';
          outlinePass.hiddenEdgeColor.set('#cccccc') //被遮挡的边界线颜色
          break
        case 1:
          outlinePass.visibleEdgeColor.set('#ffffff')
          outlinePass.hiddenEdgeColor.set('#cccccc') //被遮挡的边界线颜色
          break
        case 2:
          outlinePass.visibleEdgeColor.set('#FFA101')
          outlinePass.hiddenEdgeColor.set('#FFA101') //被遮挡的边界线颜色
          break
        case 3:
          outlinePass.visibleEdgeColor.set('#F80000')
          outlinePass.hiddenEdgeColor.set('#F80000') //被遮挡的边界线颜色
          break
      }
      scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh) {
          obj.layers.set(1)
          if (obj.name_text === name) {
            selectedObject.push(obj)
          }
        }
      })
      outlinePass.selectedObjects = selectedObject
      if (selectedObject.length) {
        param.removeBloom = true
        bloomPass.strength = 0
      }
    },
    /**
     * 鼠标滑出报警部件，风机模型取消该部件高亮
     */
    clearOutLine() {
      const param = this.windModel[this.currentKey]
      if (outlinePass && bloomPass && scene) {
        outlinePass.selectedObjects = []
        param.removeBloom = false
        bloomPass.strength = 2.5
        scene.traverse(function (obj) {
          if (obj instanceof THREE.Mesh) {
            if (obj.name.indexOf('liudong') === -1) {
              obj.layers.set(0)
            }
          }
        })
      }
    },
    /**
     * 鼠标滑过事件
     */
    onTouchMove(event) {
      let intersects2 = this.getIntersects(event.layerX, event.layerY)
      if (intersects2.length > 0) {
        let res2 = intersects2.filter(function (res) {
          return res && res.object
        })[0]
        if (res2 && res2.object) {
          outlinePass.selectedObjects = [res2.object]
        } else {
          outlinePass.selectedObjects = []
        }
      }
    },
    getIntersects(x, y) {
      const param = this.windModel[this.currentKey]
      x = (x / param.chainWidth) * 2 - 1
      y = -(y / param.chainHeight) * 2 + 1
      mouseVector.set(x, y, 0.5)
      raycaster.setFromCamera(mouseVector, camera)
      return raycaster.intersectObject(scene, true)
    },
    /**
     * 鼠标点击事件
     */
    onMouseClick(event) {
      const param = this.windModel[this.currentKey]
      let that = this
      param.isShowBlook = false
      let mcanvas = document.getElementById(`toolBox${this.currentKey}`)
      //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      let intersects = this.getIntersects(event.layerX, event.layerY)
      let chooseModelList = [] //点击选中的模型名称集合
      let flagChain = false
      let flagBolt = false
      if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i++) {
          let focus = intersects[i]
          let res = focus && focus.object
          chooseModelList.push(res.name)
          if (res.name.includes('chuandonglian')) {
            flagChain = true
            param.model.name = '传动链'
          } else if (res.name.includes('luoshuan')) {
            flagBolt = true
          } else {
            param.model.name = res.name_text
          }
        }
        if (
          (chooseModelList.includes('xiankuang_jicang') ||
            chooseModelList.includes('baiseshiti_jicang')) &&
          flagChain
        ) {
          param.model.name = '传动链'
        }
        if (
          (chooseModelList.includes('xiankuang_tatong') ||
            chooseModelList.includes('baiseshiti_tatong')) &&
          flagBolt
        ) {
          param.model.name = '螺栓'
        }
        if (chooseModelList.includes('neibumoxing_chilunxiang')) {
          param.model.name = '油液'
        }
        for (let j = 0; j < param.modelItems.length; j++) {
          let model = param.modelItems[j]
          if (model.name === param.model.name) {
            if (model.name === '叶轮' && param.isRotate) {
              param.isShowBlook = false
            } else {
              param.isShowBlook = true
            }
            mcanvas.style.top = event.layerY - 135 + 'px'
            mcanvas.style.left = event.layerX + 'px'
            param.model.alarmText = model.alarm_text
            param.model.healthVal = model.health
            param.model.alarmStatus = model.alarm_status
            break
          }
        }
      }
    },
    // 初始化一些数据
    initParams() {
      const param = this.windModel[this.currentKey]
      param.isShowBlook = false
      param.removeBloom = false
      param.finishRotate = false
      while (param.container && param.container.hasChildNodes()) {
        //当div下还存在子节点时 循环继续
        param.container.removeChild(param.container.firstChild)
      }
      cancelAnimationFrame(myReq)
      this.clearObject()
      scene = null
      backgroundscene = null
      light = null
      camera = null
      backgroundCamera = null
      controls = null
      param.container = null
      groupHead = null
      groupFly = null
      param.selectedObjects = []
      composer = null
      outlinePass = null
      backgroundscene = null
      bgPass = null
      bloomPass = null
      myReq = null
    },
    //跳转modelitem（传动链、塔筒等）
    toModelIitem(model) {
      const param = this.windModel[this.currentKey]
      let data
      let name = model.name
      switch (name) {
        case '传动链':
          data = {
            name: this.$t('FdModel.locName1'),//'传动链',
            router: 'fddrivechain',
            index: 0,
          }
          break
        case '塔筒':
          data = {
            name: this.$t('FdModel.locName2'),//'塔筒',
            router: 'fdtowerdrum',
            index: 1,
          }
          break
        case '螺栓':
          data = {
            name: this.$t('FdModel.locName3'),//'螺栓',
            router: 'fdbolt',
            index: 2,
          }
          break
        case '叶轮':
          data = {
            name: this.$t('FdModel.locName4'),//'叶轮',
            router: 'fdimpeller',
            index: 3,
          }
          break
        case '油液':
          data = {
            name: this.$t('FdModel.locName5'),//'油液',
            router: 'fdoil',
            index: 4,
          }
          break
        case '锚栓':
          data = {
            name: this.$t('FdModel.locName6'),//'锚栓',
            router: 'fdanchorbolt',
            index: 5,
          }
          break
        case '基础':
          data = {
            name: this.$t('FdModel.locName7'),//'基础',
            router: 'fdbasics',
            index: 6,
          }
          break
      }
      const store = this.$store
      //修改风电模型小标题选中状态
      param.modelTitle.forEach((element) => {
        if (element.name === data.name) {
          element.isChoose = true
        } else {
          element.isChoose = false
        }
      })
      // this.$router.push({ name: data.router })
      // this.$parent.$el.style.background = '#092e55'
      if (renderer) {
        //清除掉缓存
        raycaster = null
        mouseVector = null
        this.initParams()
        this.clearRenderer()
      }
      this.$store.commit('setGeneralModel', {
        key: this.currentKey,
        router: data.router,
      })
      // 设备模型跳转设备模型使用同一个key值调用getPath方法
      let params = {
        key: this.currentKey,
        val: this.$t('HeaderEdge.secondLevel1_3'),//'设备模型',
        name: 'fdModelitem',
        icon: 'icon-shijingsanwei-',
      }
      this.$bus.$emit('getPath', params)
      store.commit('setWindmodelTitle', param.modelTitle)
    },
    getModelItem(mac) {
      const param = this.windModel[this.currentKey]
      let requestData = {
        mac_id: mac.mac_id,
      }
      if (
        this.$store.state.chooseTitle &&
        this.$store.state.chooseTitle.name == 'windModel'
      ) {
        if (param.isRequestDown) {
          param.isRequestDown = false
          this.$getApi.queryMachineModelByMacId(requestData).then((res) => {
            param.isRequestDown = true
            if (res) {
              let modelTitle = []
              for (let k in res) {
                if (k !== 'msg' && k !== 'mac_id') {
                  let status = config.generalStutas
                  if (status && res[k].alarm_status == 0) {
                    res[k].alarm_status = 1
                  }
                  let obj = {
                    name: '',
                    alarm_status: res[k].alarm_status,
                    alarm_text: this.getAlarmText(res[k].alarm_status),
                    health: res[k].health === null ? '-' : res[k].health,
                  }

                  if (
                    param.modelTitleName.includes('传动链') &&
                    k === 'driveChain'
                  ) {
                    obj.name = '传动链'
                    modelTitle.push(obj)
                  }
                  if (
                    param.modelTitleName.includes('叶轮') &&
                    k === 'impeller'
                  ) {
                    obj.name = '叶轮'
                    modelTitle.push(obj)
                  }
                  if (param.modelTitleName.includes('塔筒') && k === 'tower') {
                    obj.name = '塔筒'
                    modelTitle.push(obj)
                  }
                  if (param.modelTitleName.includes('基础') && k === 'basics') {
                    obj.name = '基础'
                    modelTitle.push(obj)
                  }
                  if (param.modelTitleName.includes('螺栓') && k === 'bolt') {
                    obj.name = '螺栓'
                    modelTitle.push(obj)
                  }
                  if (param.modelTitleName.includes('锚栓') && k === 'anchor') {
                    obj.name = '锚栓'
                    modelTitle.push(obj)
                  }
                  if (param.modelTitleName.includes('油液') && k === 'oil') {
                    obj.name = '油液'
                    modelTitle.push(obj)
                  }
                }
              }
              param.modelItems = modelTitle

              // 目前只取传动链的诊断
              let driveChainDia = res.driveChain.diagnosis
              let diagnosis_str
              let diagnosis = []
              if (driveChainDia != null) {
                diagnosis_str = driveChainDia.toString(2)
                if (diagnosis_str.length > 0) {
                  if (Number(diagnosis_str[0]) > 0) {
                    diagnosis.push(this.$t('FdModel.bearingDefect'))//'轴承缺陷'
                  }
                }
                if (diagnosis_str.length > 1) {
                  if (Number(diagnosis_str[1]) > 0) {
                    diagnosis.push(this.$t('FdModel.gearDefect'))//'齿轮缺陷')
                  }
                }
                if (diagnosis_str.length > 2) {
                  if (Number(diagnosis_str[2]) > 0) {
                    diagnosis.push(this.$t('FdModel.motorDefect'))//'电机不平衡或松动')
                  }
                }
                if (diagnosis_str.length > 3) {
                  if (Number(diagnosis_str[3]) > 0) {
                    diagnosis.push(this.$t('FdModel.gearBoxDefect'))//'齿轮箱载荷过重')
                  }
                }
                param.diagnosis.driveChain = {
                  status: res.driveChain.alarm_status,
                  diagnosis: diagnosis,
                }
              } else {
                param.diagnosis.driveChain = {}
              }
            }
          })
        }
      } else {
        clearInterval(param.timer)
      }
    },
    //报警状态对应的文字
    getAlarmText(status) {
      let text = this.$t('Common.normalText')//'正常'
      switch (status) {
        case 0:
        case null:
          text = this.$t('Common.offlineText')//'离线'
          break
        case 1:
          text = this.$t('Common.normalText')//'正常'
          break
        case 2:
          text = this.$t('Common.warnText')//'预警'
          break
        case 3:
          text = this.$t('Common.alarmText')//'报警'
          break
      }
      return text
    },
    //添加不同的icon
    addClass(model) {
      let className = ''
      let name = model.name
      switch (name) {
        case '传动链':
          className = 'icon-chuandonglian'
          break
        case '塔筒':
          className = 'icon-tatong_huaban1'
          break
        case '螺栓':
          className = 'icon-luoshuan_huaban1'
          break
        case '锚栓':
          className = 'icon-maoshuan_huaban1'
          break
        case '叶轮':
          className = 'icon-yepian'
          break
        case '基础':
          className = 'icon-jichu_huaban1'
          break
        case '油液':
          className = 'icon-you'
          break
      }
      return className
    },
    //获取当前机组存在的设备部件
    getmodelTitle(mac) {
      const param = this.windModel[this.currentKey]
      // let macid = this.$store.state.checkMsg.mac.mac_id;
      param.modelTitle = this.$store.state.windmodelTitle
      let modelTitleName = []
      if (param.modelTitle.length > 0) {
        param.modelTitle.forEach((element) => {
          modelTitleName.push(element.name)
        })
      }
      param.modelTitleName = modelTitleName
    },
  },
  watch: {
    // /* 切换的是组织时 */
    // '$store.state.checkMsg.tree': {
    //   handler(newVal, oldVal) {
    //     if (newVal) {
    //       if (oldVal && newVal.t_id === oldVal.t_id) return
    //       /* 将数据置空，避免无机组的情况下界面仍然显示上一个机组的数据 */
    //       this.mac = {}
    //       this.diagnosis = {} /* 设备诊断 */
    //       this.modelItems = []
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    // /* 获取选中机组信息 */
    // '$store.state.checkMsg.mac': {
    //   handler(newVal, oldVal) {
    //     if (newVal != null) {
    //       if ((oldVal && newVal.machine_id != oldVal.machine_id) || !oldVal) {
    //         this.mac = newVal
    //         if (this.mac != null) {
    //           clearInterval(this.timer)
    //           let fn = () => {
    //             this.getModelItem(this.mac)
    //             return fn
    //           }
    //           this.timer = setInterval(fn(), 6000)
    //           this.$nextTick(() => {
    //             if (renderer) {
    //               this.initParams()
    //               this.clearRenderer()
    //             }
    //             this.init()
    //             this.getModelInfo(this.mac)
    //           })
    //         }
    //       }
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    '$store.state.windModelMsg': {
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
    finishRotate(newVal, oldVal) {
      if (this.finishRotate) {
        this.windType = false
        this.windTypeText = that.$t('btnPerspective.btnPhysical') //'风机外观'
        this.$forceUpdate()
        scene.traverse(function (obj) {
          if (obj.type === 'Mesh' && obj.name.indexOf('baiseshiti') != -1) {
            obj.visible = false
            camera.updateProjectionMatrix()
            renderer.render(scene, camera) //执行渲染操作
            composer.render()
          }
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.general-model {
  position: relative;
  height: 100%;
  .windBtnBlock {
    position: absolute;
    top: 0;
    right: 0;
    .btn {
      width: 150px;
      height: 43px;
      background: #0f324a;
      -webkit-box-shadow: 0 0 29px 0 rgba(6, 70, 167, 0.72) inset;
      box-shadow: inset 0 0 29px 0 rgba(6, 70, 167, 0.72);
      border-radius: 10px;
      font-size: 16px;
      font-weight: 400;
      color: #fff;
      display: inline-block;
      margin: 0 0 0 30px;
      cursor: pointer;
      &:hover,
      &:focus {
        border: 1px solid #00fcf9;
      }
    }
  }
  .right-content {
    position: absolute;
    top: 80px;
    right: 0;
  }
  .right-block {
    padding: 10px 20px;
    width: 250px;
    background: #04022d;
    border-radius: 10px;
    box-shadow: 0px 0px 10px #1d4987 inset;
    margin-bottom: 20px;
    .right-title {
      display: flex;
      justify-content: space-around;
      font-size: 16px;
      color: #00d1ff;
    }
    .modelList {
      margin-top: 10px;
      .modelItem {
        line-height: 46px;
        height: 46px;
        background: #080f40;
        opacity: 0.9;
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        border: 1px solid transparent;
        &:hover,
        &:active,
        &.active {
          border-color: #15d3ff;
          cursor: pointer;
        }
        .icon-block {
          width: 34px;
          height: 34px;
          background: #0a2e58;
          border: 1px solid #0f6a96;
          opacity: 0.5;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
          margin-left: 10px;
          i {
            font-size: 24px;
            color: #15d3ff;
          }
        }
        .modelName {
          display: inline-block;
          font-size: 16px;
          width: 48px;
          margin-right: 30px;
          text-align: justify;
          text-align-last: justify;
        }
        .health {
          font-size: 19px;
          font-family: DIN Medium;
          color: #00c4ff;
        }
        .alarm1 {
          color: #00c4ff;
        }
        .alarm2 {
          color: #ffa101;
        }
        .alarm3 {
          color: #f80000;
        }
        .alarmnull {
          color: #3771b0;
        }
      }
    }
  }
  .general-equip-diagnosis {
    padding: 10px 20px;
    width: 220px;
    background: #04022d;
    border-radius: 10px;
    box-shadow: 0px 0px 10px #1d4987 inset;
    display: flex;
    align-items: center;
    flex-direction: column;
    .diagnosis-f1 {
      color: #00d1ff;
      font-size: 16px;
      text-align: center;
      width: 65px;
      border-bottom: 1px solid #093868;
      margin: 5px 0px 10px 0px;
    }
    .diagnosis-content {
      width: 100%;
      background: #080f40;
      border-radius: 4px;
      padding: 5px 10px;
      ul {
        width: 100%;
        margin: 0 5px;
        li {
          font-size: 14px;
          width: 100%;
          display: flex;
          flex-direction: row;
          margin: 5px 0;
          div {
            width: 30%;
          }
        }
        .alarm-li {
          color: #f80000;
        }
        .warn-li {
          color: #ffa101;
        }
      }
      div {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        line-height: 26px;
        i {
          font-size: 24px;
          color: #15d3ff;
          margin-right: 5px;
        }
      }
    }
  }
  .container {
    width: 100%;
    height: 100%;
    &:focus,
    &:active {
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
      outline: none;
    }
  }
  .toolBox {
    width: 328px;
    height: 158px;
    background: url('~assets/images/fd/box.png');
    position: absolute;
    z-index: 2;
  }
  #circle {
    position: absolute;
    top: 120px;
    left: -205px;
    z-index: 2;
  }
  .tool-content {
    margin-left: 90px;
    margin-top: 35px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    #title {
      display: inline-block;
      text-align: center;
      border-right: 1px solid #42aedb;
      padding-right: 20px;
      font-family: 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif;
      font-size: 16px;
      .name {
        margin-bottom: 10px;
      }
    }
    .img {
      display: inline-block;
      width: 90px;
      height: 90px;
      text-align: center;
      line-height: 90px;
    }
    .alarmImgnull,
    .alarmImg0 {
      background: url('~assets/images/fd/wind-0.png');
    }
    .alarmImg1 {
      background: url('~assets/images/fd/wind-1.png');
    }
    .alarmImg2 {
      background: url('~assets/images/fd/wind-2.png');
    }
    .alarmImg3 {
      background: url('~assets/images/fd/wind-3.png');
    }
    .healthText {
      font-size: 30px;
      font-family: DIN Medium;
      font-weight: 400;
      color: #00c4ff;
    }
    .alarmText1 {
      color: #00c4ff;
    }
    .alarmText2 {
      color: #ffa101;
    }
    .alarmText3 {
      color: #f80000;
    }
    .alarmTextnull {
      color: #3771b0;
    }
  }
  .btn-block {
    position: absolute;
    z-index: 2;
  }

  @keyframes scale {
    0% {
      transform: scale(1);
    }

    50%,
    75% {
      transform: scale(3);
    }

    78%,
    100% {
      opacity: 0;
    }
  }

  @keyframes scales {
    0% {
      transform: scale(1);
    }

    50%,
    75% {
      transform: scale(2);
    }

    78%,
    100% {
      opacity: 0;
    }
  }

  .smallcircle2 {
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: #46e0f0;
    border-radius: 50%;
    top: 10px;
    left: 200px;
  }

  .smallcircle2:before {
    content: '';
    display: block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    opacity: 0.4;
    background-color: #46e0f0;
    animation: scale 1s infinite cubic-bezier(0, 0, 0.49, 1.02);
  }

  .bigcircle2 {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    opacity: 0.4;
    background-color: #46e0f0;
    top: 10px;
    left: 200px;
    animation: scales 1s infinite cubic-bezier(0, 0, 0.49, 1.02);
  }

  @keyframes scaless {
    0% {
      transform: scale(1);
    }

    50%,
    75% {
      transform: scale(3);
    }

    78%,
    100% {
      opacity: 0;
    }
  }
}
</style>
