<template>
  <div class="my-left-content">
    <div class="my-left-header">
      <div class="logo">
        <img
          :src="logoUrl"
          alt
        />
      </div>
      <div class="line"></div>
    </div>
    <div class="outer-container">
      <div
        class="chooseBtn"
        style="display:none;"
      >
        <div
          v-for="title in titleBtn"
          @click="chooseTitle(title)"
          class="title-text"
        >
          <div
            class="title"
            :class="title.isChoose ? 'titlebtnischoose' : ''"
          >{{ title.name }}</div>
        </div>

      </div>
      <div class="inner-container">
        <ul
          class="firstLevel-ul"
          v-show="titleBtn[0].isChoose"
        >
          <li
            class="title1-li"
            v-for="(item, index) in firstLevel"
            @click.self="inverse_btm(item)"
            v-show="item.isShow"
          >
            <i
              class="iconfont"
              :class="item.icon"
              @click.self="inverse_btm(item)"
            ></i>
            <div @click.self="inverse_btm(item)">{{ item.val }}</div>
            <i
              class="iconfont"
              :class="[
                item.isAll ? 'icon-zhongzi-xiangxia' : 'icon-zhongzi-xiangyou'
              ]"
              @click.self="inverse_btm(item)"
            ></i>
            <ul
              class="seconde-ul"
              v-if="item.isAll"
            >
              <li
                class="title2-li"
                v-for="(item2, index2) in secondLevel[index]"
                v-show="
                  item2.general
                    ? item2.t_root === generalflag
                    : item2.isShow && item2.controlShow
                "
                @click="menuClick(item2)"
              >
                <i
                  class="iconfont"
                  :class="item2.icon"
                ></i>
                <div>{{ item2.val }}</div>
              </li>
            </ul>
          </li>
        </ul>
        <div
          v-show="titleBtn[1].isChoose"
          class="my-list-content-edge"
        >
          <!-- 组织 -->
          <div
            class="input-selection radius"
            ref="select-box-tree"
            @click="changeTreeType"
          >
            <input
              type="text"
              class="form-input"
              :placeholder="$t('Left.searchTreeText')"
              v-model="tree.val"
              @keyup="searchByKeydown('tree')"
            />
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
          <!-- 机组或机泵 -->
          <div
            class="input-selection radius"
            ref="select-box-mac"
            @click="changeMacType"
          >
            <input
              type="text"
              class="form-input"
              :placeholder="$t('Left.searchMacText')"
              v-model="mac.val"
              @keyup="searchByKeydown('mac')"
            />
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
          <!-- 通道 -->
          <!-- <div
            class="input-selection radius"
            ref="select-box-mac"
            v-show="channelSel"
            @click="changeChannelType"
            @dblclick="changeAllChannelType"
          >
            <input
              type="text"
              class="form-input"
              placeholder="搜索机组"
              v-model="channel.val"
              @keyup="searchByKeydown('channel')"
            />
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div> -->
          <!-- 测点 -->
          <ul class="select-box-pos">
            <li
              v-for="item in posArray"
              class="pos-li"
              :class="item.isChoose ? 'pos-li-choose' : ''"
              @contextmenu.prevent="showContextmenu(item, $event)"
              @click="emitPos(item)"
              draggable="true"
              @dragstart="dragPos(item, $event)"
              @mousemove.stop.prevent="setViewPosMsg(item, $event)"
              @mouseleave="closeFloatingWindow"
            >
              {{ item.position_name }}
            </li>
          </ul>
          <!-- 测点浮窗信息 -->
          <ul
            v-show="viewPosMsg.isShow"
            class="pos-floating-window select-none box-shadow radius default-border"
            :style="viewPosMsg.style"
          >
            <li>
              <!-- 测点名称 -->
              <div>{{$t('Left.posNameToolTip')}}</div>
              <div>：{{ viewPosMsg.posName }}</div>
            </li>
            <li>
              <!-- 测点类型 -->
              <div>{{$t('Left.posTypeToolTip')}}</div>
              <div>：{{ viewPosMsg.posTypeName }}</div>
            </li>
            <li>
              <!-- 采集器名称 -->
              <div>{{$t('Left.dgmNameToolTip')}}</div>
              <div>：{{ viewPosMsg.dgmName }}</div>
            </li>
            <li>
              <!-- 关联通道名称 -->
              <div>{{$t('Left.chNameToolTip')}}</div>
              <div>：{{ viewPosMsg.channelName }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { matchRule, cloneObj, posTypeName } from 'utils/utils.js'
import {
  menusFirstLevl,
  menusSecondLevel,
  generalOnlyTree,
  generalOnlyMac,
  requiredTree,
  requiredMac,
  requiredPos,
  showRightMenu,
  generalRouting,
  chartRouting,
} from 'common/menus/Menus.js'

export default {
  name: 'left_edge',
  data() {
    return {
      /* -----------------------左导航栏头转换--------------------------- */
      tree: {
        //存放组织对象
        val: '',
        msg: null,
      },
      mac: {
        //存放机组对象
        val: '',
        msg: null,
      },
      pos: {
        //存放测点对象
        val: '',
        msg: null, // 测点的全部信息
      },
      channel: {
        val: '',
        msg: {},
      },
      channelSel: false /* 通道筛选是否显示 */,
      tArray: [], //存放所有组织
      macArray: [], // 存放所有机组
      posArray: [], //存放所有测点
      chArray: [], //存放所有通道
      viewPosMsg: {
        //当前悬浮测点信息
        isShow: false,
        posName: '',
        posTypeName: '',
        dgmName: '',
        channelName: '',
        style: {},
      },
      /* --------------------------------------------------------- */

      generalflag: 0,
      macName: '', //当前机组
      titleBtn: [
        {
          name: '图谱',
          uname: 'chart',
          isChoose: false,
        },
        {
          name: '测点',
          uname: 'pos',
          isChoose: true,
        },
      ],
      firstLevel: menusFirstLevl(),
      secondLevel: menusSecondLevel(),
      generalOnlyTree: generalOnlyTree(), //必须有组织的打开的图谱
      generalOnlyMac: generalOnlyMac(), //必须有机组打开的图谱
      requiredPos: requiredPos(), //只能由测点打开的图谱(趋势图，倾角分布图，机舱轨迹图，危险转速区间)
      requiredMac: requiredMac(), // (系统日志)可以由机组打开的图谱
      requiredTree: requiredTree(),
      logoUrl: 'logo.png',
    }
  },
  mounted() {
    const logoFlag = config.logo
    if (logoFlag != 'logo') {
      this.logoUrl = `${logoFlag}.png`
    }
  },
  created() {
    this.$bus.$on('choiceChartType', this.choiceChartType)
    /* 获取组织信息 */
    let tArray
    const treeMsg = {
      t_ids: JSON.parse(sessionStorage.getItem('tree')),
    }
    // const treeMsg = {"t_ids":[1591931043133]}
    this.$getApi.queryFoldersByTid(treeMsg).then((res) => {
      if (res) {
        if (res.trees.length === 1) {
          res.trees[0].name = res.trees[0].t_name
          res.trees[0].isShow = true //拼音搜索的时候要用
          res.trees[0].isChecked = false // 多选框的时候使用
          res.trees[0].id = 0 //多选框的时候使用
          tArray = res.trees
        } else {
          tArray = this.recursion(res)
        }
        this.$store.commit('getMsg', {
          key: 'foldtree',
          msg: tArray,
        })
        this.tArray = tArray
        this.$store.commit('getMsg', {
          key: 'tree',
          msg: res.trees,
        })
      }
    })
    let user = JSON.parse(sessionStorage.getItem('user'))
    //  根据后台数据，来配置图谱是否显示
    this.$getApi.getAtlasConfig().then((res) => {
      let atlasConfig = res.atlasConfig
      if (user.type == 3) {
        atlasConfig.system = 0
      }
      for (let i = 1; i < this.secondLevel.length; i++) {
        this.secondLevel[i].forEach((item) => {
          if (atlasConfig[item.name] === 0) {
            item.controlShow = false
          } else {
            item.controlShow = true
          }
        })
      }
    })
  },
  methods: {
    /* -------------------------------左导航栏头转换-------------------------------------------- */
    searchByKeydown(flag) {
      if (flag === 'tree') {
        this.recursionSearchTree(this.tArray, this.tree.val)
        let dom = this.$refs['select-box-tree']
        this.changeTreeType(dom)
      } else if (flag === 'mac') {
        // 搜索框置空时清空保存机组
        if (this.mac.val == '' && this.mac.msg != null) {
          this.$store.commit('getCheckMsg', {
            msg: cloneObj(this.tree.msg),
            type: 'tree',
          })
        }
        this.macArray.forEach((el) => {
          this.$nextTick(() => {
            if (!this.matchPinyin(el.name, this.mac.val)) {
              el.isShow = false
            } else {
              el.isShow = true
            }
          })
        })
        let dom = this.$refs['select-box-mac']
        this.changeMacType(dom)
      } else if (flag === 'pos') {
        // 搜索框置空时清空保存测点
        if (this.pos.val == '' && this.mac.msg != null) {
          this.$store.commit('getCheckMsg', {
            msg: cloneObj(this.mac.msg),
            type: 'mac',
          })
        }
        this.posArray.forEach((el) => {
          if (!this.matchPinyin(el.name, this.pos.val)) {
            el.isShow = false
          } else {
            if (el.isChannel) {
              el.isShow = true
            }
          }
        })
      }
    },
    /* 组织的选择 */
    changeTreeType(e) {
      let size = {}
      if (e.currentTarget) {
        size = e.currentTarget.getBoundingClientRect()
      } else {
        size = e.getBoundingClientRect()
      }
      let myStyle = {
        maxHeight: '300px',
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height + 3}px`,
      }
      let data = this.tArray
      /* 获取 */
      if (!this.selectList) {
        this.selectList = true
        this.$multi({
          dateType: 'tree',
          data,
          myStyle,
        }).then((res) => {
          this.selectList = false
          if (res) {
            /* 将选中的组织存储到store中 */
            this.$store.commit('getCheckMsg', {
              msg: cloneObj(res),
              type: 'tree',
            })
            /* 显示所有的组织 */
            this.showAllList(this.tArray)
            /* 组织改动就将机组清空 */
            this.mac.val = ''
            /* 删除了名字之后选同一个机组，watch监听不到 */
            this.tree.val = res.t_name
            this.posArray = []
            /* 获取机组信息 */
          }
        })
      }
    },
    /* 机组的选择 */
    changeMacType(e) {
      let size = {}
      if (e.currentTarget) {
        size = e.currentTarget.getBoundingClientRect()
      } else {
        size = e.getBoundingClientRect()
      }
      let myStyle = {
        maxHeight: '300px',
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height + 3}px`,
      }
      let data = this.macArray
      if (!this.selectList) {
        this.selectList = true
        this.$multi({
          dateType: 'mac',
          data,
          myStyle,
        }).then((res) => {
          this.selectList = false
          if (res) {
            // 把机组信息存储到store中
            this.$store.commit('getCheckMsg', {
              msg: cloneObj(res),
              type: 'mac',
            })
            /* 显示所有的机组 */
            this.showAllList(this.macArray)
            /* 机组改动就将测点清空 */
            this.pos.val = ''
            this.mac.val = res.m_me
          }
        })
      }
    },
    // 通道下拉
    changeChannelType(e) {
      const size = e.currentTarget.getBoundingClientRect()
      let myStyle = {
        maxHeight: '300px',
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height + 3}px`,
      }
      let data = this.chArray
      if (!this.selectList) {
        this.selectList = true
        this.$multi({
          data,
          myStyle,
        }).then((res) => {
          this.selectList = false
          if (res) {
            this.channel.msg = res
            this.channel.val = res.name
            this.posArray.forEach((pos) => {
              pos.isChannel = false
              pos.isShow = false
            })
            this.posArray.forEach((pos) => {
              if (res.flag == `${pos.channel_type}_${pos.channel_id}`) {
                pos.isChannel = true
                pos.isShow = true
              }
            })
            // 通过清空val值清空选中测点
            this.pos.val = ''
          }
        })
      }
    },
    /* 双击显示所有通道 */
    changeAllChannelType(e) {
      for (let i = 0; i < this.chArray.length; i++) {
        this.chArray[i].isShow = true
      }
      this.changeChannelType(e)
    },
    /* 把所有的isShow改为true */
    showAllList(args) {
      let fn = (arr) => {
        arr.forEach((item) => {
          if (item.isChannel == true || item.isChannel == undefined) {
            item.isShow = true
          }
          if (item.children) {
            fn(item.children)
          }
        })
      }
      fn(args)
    },
    /*  递归查找组织*/
    recursionSearchTree(treeArr, newVal) {
      let fn = (arr) => {
        let matchFlag = false //定义一个标签来表示是否有被选中
        arr.forEach((item) => {
          /* 匹配到了 */
          if (this.matchPinyin(item.name, newVal)) {
            item.isShow = true
            matchFlag = true
            /* 匹配到父级别，默认子集全部显示 */
            if (item.children) {
              /* 打开父级 */
              item.isOpen = true
              this.showAllList(item.children)
            }
            /* 有子集 */
          } else if (item.children) {
            /* 如果有子集的先打开 */
            /* 递归 */
            let result = fn(item.children)
            item.isShow = result
            item.isOpen = result
            /* 有一个自组织匹配到了 父组织就显示 */
            if (result) {
              matchFlag = true
            }
          } else {
            /* 没匹配到也没子集 */
            item.isShow = false
          }
        })
        return matchFlag
      }
      /* 搜索为空的时候，所有的组织都显示 */
      if (newVal === '') {
        this.showAllList(treeArr)
      } else {
        fn(treeArr)
      }
    },
    /* 匹配拼音,匹配到返回true,否则返回flase */
    matchPinyin(matchVal, val) {
      return this.pinyin.match(matchVal, val)
    },
    // 鼠标移入显示测点信息
    setViewPosMsg(item, e) {
      let top = e.y + 10
      window.innerHeight <= top + 100 && (top = e.y - 100)
      this.viewPosMsg = {
        isShow: false,
        posName: item.position_name,
        posTypeName: posTypeName[item.position_type],
        dgmName: item.dgm_name,
        channelName: item.channel_name,
        style: {
          top: `${top}px`,
          left: `${e.x + 5}px`,
        },
      }
      setTimeout(() => {
        this.viewPosMsg.isShow = true
      }, 500)
    },
    // 关闭测点信息弹窗
    closeFloatingWindow(e) {
      // this.viewPosMsg.isShow = false;
      setTimeout(() => {
        this.viewPosMsg.isShow = false
      }, 500)
    },
    /* 递归成tree 的方法 */
    recursion(res) {
      let pid = res.pids
      let dataArray = res.trees
      /* 机组的排序 */
      let compare = function (obj1, obj2) {
        let val1 = obj1.t_name
        let val2 = obj2.t_name
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
      dataArray.sort(compare)
      dataArray.forEach((item, index) => {
        item.name = item.t_name
        item.isShow = true //拼音搜索的时候要用
        item.isChecked = false // 多选框的时候使用
        item.id = index //多选框的时候使用
      })
      let parents = dataArray.filter((item) => {
        return item.t_pid === null || item.t_pid == 0
      })
      let children = dataArray.filter(
        (item) => !(item.t_pid === null || item.t_pid == 0)
      )
      let fn = (parent, children) => {
        children.forEach((child, index) => {
          if (child == null) return
          if (child.t_pid === parent.t_id) {
            /* 有子元素存在 */
            parent.isOpen = false //加上展开标记
            parent.children === undefined
              ? (parent.children = [child])
              : parent.children.push(child)
            // let temp = JSON.parse(JSON.stringify(children))
            children.splice(index, 1, null)
            fn(child, children)
          }
        })
      }
      parents.forEach((parent) => {
        fn(parent, children)
      })
      // 地图跳转只存在子组织与子组织的子组织
      if (parents.length == 0) {
        for (let k in pid) {
          children.forEach((item) => {
            if (item.t_id == k) {
              parents.push(item)
            }
          })
        }
        parents.forEach((parent) => {
          fn(parent, children)
        })
      }
      return parents
    },
    /* 修改组织之后 由watch 跳转的方法 */
    getMacInfo_watch(res) {
      /* 先将原先机组数组清空 */
      this.macArray = []
      new Promise((resolve, reject) => {
        this.getMacByApi(res, resolve)
      }).then((arr) => {
        this.macArray = arr
        this.setFirstMac(arr)
      })
    },
    getMacByApi(t_data, resolve) {
      let macArray
      /* 先从缓存中读取机组的信息 */
      macArray = this.$store.state.mac[t_data.t_id]
      /* 不存在就去网络获取 */
      if (macArray === undefined) {
        this.$getApi
          .queryAllMachineByTid({
            t_id: t_data.t_id,
            t_root: t_data.t_root,
          })
          .then((res) => {
            if (res) {
              macArray = this.saveMacInfo(res.machines, t_data.t_id)
              if (resolve) {
                resolve(macArray)
              }
            }
          })
      } else {
        if (resolve) {
          resolve(macArray)
        }
      }
      /* 获取这个组织下面 所有子组织下面的机组 */
      this.macInfoIterator(t_data, false)
    },
    /* 根据组织的信息 循环获取下面所有子组织的机组信息，并保存到vuex中 */
    macInfoIterator(t_info, getCurrent = true) {
      /* 不存在子组织 */
      if (t_info.children === undefined) {
        /* 是否需要获取当前组织的信息 */
        if (getCurrent) {
          let t_id = t_info.t_id
          let t_root = t_info.t_root
          let macArray
          macArray = this.$store.state.mac[t_id]
          /* 缓存中不存在这个机组才去获取 */
          if (macArray === undefined) {
            this.$getApi
              .queryAllMachineByTid({
                t_id: t_id,
                t_root: t_root,
              })
              .then((res) => {
                if (res) {
                  this.saveMacInfo(res.machines, t_id)
                }
              })
          }
        }
      } else {
        t_info.children.forEach((item) => {
          this.getMacByApi(item)
        })
      }
    },
    /* 机组数据的获取和存储 */
    saveMacInfo(macArray, t_id) {
      let arr = []
      /* 需要处理有机泵的情况 */
      macArray.forEach((mac, index) => {
        if (mac.pumps !== undefined) {
          mac.pumps.forEach((pump, index1) => {
            pump.isShow = true //选择展示的属性
            pump.name = pump.pump_name //选择组件需要
            pump.m_me = pump.pump_name
            pump.isChecked = false //选择组件需要
            pump.t_root = mac.t_root
            pump.m_type = mac.m_type
            pump.id = `${index}_${index1}` // 选择组件需要
            pump.t_id = t_id
            pump.machine_id = mac.mac_id
            pump.mac_name = mac.mac_me
            // TMS波磨站点信息
            if (mac.line) {
              pump.line = mac.line
            }
            arr.push(pump)
          })
        } else {
          mac.isChecked = false
          mac.isShow = true
          mac.id = index
          mac.name = mac.mac_me
          mac.m_me = mac.mac_me
          mac.t_id = t_id
          mac.machine_id = mac.mac_id
          arr.push(mac)
        }
      })
      /* 机组的排序 */
      let compare = function (obj1, obj2) {
        let val1 = obj1.key
        let val2 = obj2.key
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      /* 缓存到vuex中 */
      this.$store.commit('getMsg', {
        key: 'mac',
        msg: arr,
        keys: t_id,
      })
      return arr
    },
    /* 去选择第一机组作为默认机组 */
    setFirstMac(macList) {
      /* 如果当前的vuex中有mac，获取mac */
      let currentMac = this.$store.state.checkMsg.mac
      // 获取第一个机组
      let firstMac = macList[0]
      if (currentMac) {
        if (currentMac.t_id == firstMac.t_id) {
          //如果当前机组下就存在这个组织下的机组 那么不继续处理
          return
        }
      }
      if (!firstMac) return
      this.$store.commit('getCheckMsg', {
        msg: cloneObj(firstMac),
        type: 'mac',
      })
    },
    /* 去选择第一个测点 */
    setFirstPos(posList) {
      let firstPos = posList[0]
      if (!firstPos) return
      firstPos.isChoose = true
      this.$store.commit('getCheckMsg', {
        msg: cloneObj(firstPos),
        type: 'pos',
      })
    },

    /* ---------------------------------------------------------------------------------------- */

    /* 二级标签打开关闭 */
    inverse_btm(item) {
      item.isAll = !item.isAll
    },
    /* 点击菜单 */
    menuClick(item) {
      let checkMsg = this.$store.state.checkMsg
      if (item.general) {
        generalRouting(this, item, checkMsg)
      } else {
        chartRouting(this, item, checkMsg)
      }
    },
    // 页面跳转(除总貌图外)
    choiceChartType(key, name, titleName) {
      const [type, , ,] = key.split('_')
      let params = {
        key,
        name: type,
        val: titleName || name,
        icon: '',
      }
      let flag = false
      this.secondLevel.forEach((item) => {
        for (let k in item) {
          if (type === item[k].name) {
            if (item[k].controlShow !== undefined && !item[k].controlShow) {
              /* 后台配置不显示该页面 */
              flag = true
            }
            params.name = item[k].name
            params.icon = item[k].icon
          }
        }
      })
      if (flag) return
      this.$bus.$emit('getPath', params, 'fromOther')
    },
    watchTree(t_root, currentRouteName, routePath) {
      /* 总貌图的组件 */
      let generalList = [
        'fdGeneral',
        'fdFocus',
        'snGeneral',
        'snFocus',
        'gjGeneral',
        'gjFocus',
        'ytGeneral',
        'ytFocus',
        'tyGeneral',
        'tyFocus',
        'hgGeneral',
        'hgFocus',
      ]
      let otherList = [
        { routerName: 'fdModel', t_root: 0 },
        { routerName: 'windModel', t_root: 0 },
        { routerName: 'snModel', t_root: 1 },
        { routerName: 'gjModel', t_root: 2 },
        { routerName: 'ytModel', t_root: 3 },
        { routerName: 'tyModel', t_root: -1 },
        { routerName: 'hgModel', t_root: 5 },
      ]
      let General = [
        'fdGeneral',
        'snGeneral',
        'gjGeneral',
        'ytGeneral',
        'hgGeneral',
      ]
      /* 总貌图 和重点 关注切换组织跳到对应系统的图谱 */
      if (generalList.includes(currentRouteName)) {
        /* 属于总貌图 */
        let arr = {
          0: ['fdGeneral', 'fdFocus'],
          1: ['snGeneral', 'snFocus'],
          2: ['gjGeneral', 'gjFocus'],
          3: ['ytGeneral', 'ytFocus'],
          5: ['hgGeneral', 'hgFocus'],
        }
        let currentIncludeArr = arr[t_root]
        if (t_root == '-1') {
          //通用
          currentIncludeArr = ['tyGeneral', 'tyFocus']
        }
        if (!currentIncludeArr.includes(currentRouteName)) {
          /* 不在当前的图谱之中 */
          let index
          if (currentRouteName.indexOf('General')) {
            index = 0
          } else if (currentRouteName.indexOf('Focus')) {
            index = 1
          }
          /* 跳转到对应的总貌图 */
          this.$router.push({ name: currentIncludeArr[index] })
        }
        return
      }
      /* 如果是设备模型的图谱，跳转到相应的总貌图 */
      otherList.forEach((item) => {
        if (routePath.includes(item.routerName)) {
          /* 如果是同类组织就跳过 */
          if (t_root == item.t_root) return
          /*  不是同类组织，就跳转到对应的总貌图 */
          let toName = General[parseInt(t_root)]
          if (t_root == '-1') {
            //通用
            toName = 'tyGeneral'
          }
          if (toName) {
            this.$router.push({ name: toName })
          }
        }
      })
    },
    // 标题显隐控制
    titleControl(item, tRoot) {
      if (item.exceptTRoot) {
        if (item.exceptTRoot.indexOf(tRoot) !== -1) {
          item.isShow = false
        }
      } else if (item.includeTRoot) {
        if (item.includeTRoot.includes(tRoot)) {
          item.isShow = true
        } else {
          item.isShow = false
        }
      }
      if (item.val === '智能诊断趋势') {
        if (config.fdDiagnosis == 1) {
          item.isShow = true
        } else if (config.fdDiagnosis == 0) {
          item.isShow = false
        }
      }
      return item
    },
    /* 选择左边导航栏显示的栏目 */
    chooseTitle(title) {
      this.titleBtn.forEach((item) => {
        item.isChoose = false
      })
      title.isChoose = true
    },
    //获取测点信息
    getPosInfo(res) {
      // 将测点信息清空
      this.posArray = []
      /* 读取缓存的数据 */
      let key
      // 判断机泵还是机组
      res.ch_class
        ? (key = `${res.mac_id}_${res.ch_class}`)
        : (key = res.mac_id)
      let arr = this.$store.state.pos[key]
      // 获取到机组的信息，去获取测点
      let index = 0
      if (!arr) {
        /* 如果没有数据 ，一直去取，一共取到100s,没有数据就算*/
        let timer = setInterval(() => {
          arr = this.$store.state.pos[key]
          index++
          if (arr || index == 2000) {
            clearInterval(timer)
            this.posArray = arr
          }
        }, 50)
      } else {
        /* 如果有数据 */
        // let newArr
        // let timer = setInterval(() => {
        //   newArr = this.$store.state.pos[key]
        //   index++
        //   //去store中获取100s,验证数据是否有更新
        //   if (arr !== newArr || index == 2000) {
        //     clearInterval(timer)
        //     this.posArray = newArr
        //   }
        //   /* 时间到了也没有更新，那就用原来的数据 */
        //   if (index == 2000) {
        //     this.posArray = arr
        //   }
        // }, 50)
        this.posArray = arr
      }
    },
    /* 选择测点 */
    choosePos(pos) {
      this.posArray.forEach((item) => {
        if (
          item.machine_id == pos.machine_id &&
          item.position_type == pos.position_type &&
          item.position_id == pos.position_id
        ) {
          item.isChoose = true
        } else {
          item.isChoose = false
        }
      })
    },
    emitPos(pos) {
      this.posArray.forEach((el) => {
        el.isChoose = false
      })
      pos.isChoose = true
      //提交选中测点
      this.$store.commit('getCheckMsg', {
        msg: cloneObj(pos),
        type: 'pos',
      })
    },
    /* 拖动测点 */
    dragPos(listData, e) {
      const str = JSON.stringify(listData)
      e.dataTransfer.setData('flag', str)
    },
    /* 右键打开事件 */
    showContextmenu(pos, e) {
      this.emitPos(pos)
      /* 获取可以选择的图谱 */
      let text = []
      this.secondLevel.forEach((arr, index) => {
        /* 总貌图不显示 */
        if (index === 0) return
        arr.forEach((item) => {
          if (
            item.isShow &&
            item.controlShow &&
            matchRule(
              pos.position_type,
              item.name,
              pos.dgm_type,
              pos.t_root,
              pos
            )
          ) {
            text.push(item)
          }
        })
      })
      // 显示右键菜单
      // let checkMsg = this.$store.state.checkMsg
      // showRightMenu(this, e, text, checkMsg)
      showRightMenu(this, e, text, null)
    },
  },
  /* created() {
    this.$bus.$on('choiceChartType', this.choiceChartType)
    let user = JSON.parse(sessionStorage.getItem('user'))
    //  根据后台数据，来配置图谱是否显示 
    this.$getApi.getAtlasConfig().then((res) => {
      let atlasConfig = res.atlasConfig
      if (user.type == 3) {
        atlasConfig.system = 0
      }
      for (let i = 1; i < this.secondLevel.length; i++) {
        this.secondLevel[i].forEach((item) => {
          if (atlasConfig[item.name] === 0) {
            item.controlShow = false
          } else {
            item.controlShow = true
          }
        })
      }
      this.firstLevel.forEach((item) => {
        item.isAll = true
      })
    })
  }, */
  // watch: {
  //   /* 监听组织的变化 ,总貌图显示风电、水泥、轨交,如果不是当前类型的总貌图，跳转到当前的界面*/
  //   '$store.state.checkMsg.tree': {
  //     handler(value, oldValue) {
  //       if (value) {
  //         let currentRouteName = this.$route.name
  //         let routePath = this.$route.path
  //         for (let i = 0; i < this.secondLevel.length; i++) {
  //           if (i === 1 || i === 2 || i === 3 || i === 4) {
  //             this.secondLevel[i].forEach((item) => {
  //               item.isShow = true
  //             })
  //           }
  //         }
  //         /*水泥 */
  //         if (value.t_root == 1) {
  //           /* 包含了 */
  //           this.watchTree(1, currentRouteName, routePath)
  //           this.generalflag = 1
  //         } else if (value.t_root == 2) {
  //           /* 轨交 */
  //           this.watchTree(2, currentRouteName, routePath)
  //           this.generalflag = 2
  //         } else if (value.t_root == 3) {
  //           this.watchTree(3, currentRouteName, routePath)
  //           this.generalflag = 3
  //         } else if (value.t_root == 0) {
  //           // 风电，其他
  //           this.watchTree(0, currentRouteName, routePath)
  //           this.generalflag = 0
  //         } else {
  //           this.watchTree(-1, currentRouteName, routePath)
  //           this.generalflag = -1
  //         }
  //         for (let j = 0; j < this.firstLevel.length; j++) {
  //           if (j === 2) {
  //             const item = this.firstLevel[j]
  //             this.firstLevel[j] = this.titleControl(item, value.t_root)
  //           }
  //         }
  //         for (let i = 0; i < this.secondLevel.length; i++) {
  //           if (i === 1 || i === 2 || i === 3 || i === 4) {
  //             this.secondLevel[i].forEach((item) => {
  //               item = this.titleControl(item, value.t_root)
  //             })
  //           }
  //         }
  //       }
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  //   /* 监听选中的组织 */
  //   '$store.state.checkMsg.mac': {
  //     handler(newValue, oldValue) {
  //       if (newValue) {
  //         /* 获取参数 */
  //         this.macName = newValue.mac_me || newValue.m_me
  //         /* 重复选择机组的时候，不直接return */
  //         this.getPosInfo(newValue)
  //       }
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  //   /* 监听选中的测点 */
  //   '$store.state.checkMsg.pos': {
  //     handler(value) {
  //       if (value != null) {
  //         this.choosePos(value)
  //       }
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  // },
  watch: {
    '$store.state.checkMsg.tree': {
      handler(value, oldValue) {
        if (value) {
          /* 获取参数 */
          if (oldValue && value.t_id === oldValue.t_id) return
          this.tree.val = value.t_name
          this.tree.msg = value
          this.getMacInfo_watch(value)
          if (value.t_root == 2) {
            this.channelSel = true
          } else {
            this.channelSel = false
          }
          for (let i = 0; i < this.secondLevel.length; i++) {
            if (i === 1 || i === 2 || i === 3 || i === 4) {
              this.secondLevel[i].forEach((item) => {
                item.isShow = true
              })
            }
          }
          for (let i = 0; i < this.secondLevel.length; i++) {
            if (i === 1 || i === 2 || i === 3 || i === 4) {
              this.secondLevel[i].forEach((item) => {
                item = this.titleControl(item, value.t_root)
              })
            }
          }
        } else {
          this.tree.val = ''
          this.tree.msg = null
        }
      },
      deep: true,
      // immediate: true,
    },
    '$store.state.checkMsg.mac': {
      handler(newValue, oldValue) {
        if (newValue) {
          /* 获取参数 */
          /* 重复选择机组的时候，不直接return */
          if (oldValue) {
            if (newValue.pump_id) {
              if (newValue.pump_id === oldValue.pump_id) return
            } else if (newValue.mac_id === oldValue.mac_id) {
              return
            }
          }
          this.mac.val = newValue.mac_me || newValue.pump_name
          this.mac.msg = cloneObj(newValue, true)
          this.mac.gjMacName = this.mac.msg.mac_name
          this.getPosInfo(this.mac.msg)
        } else {
          this.mac.val = ''
          this.mac.msg = null
        }
      },
      deep: true,
      immediate: true,
    },
    /* 监听全局checkMsg的pos，将tree的值赋给this.pos */
    '$store.state.checkMsg.pos': {
      handler(value) {
        if (value != null) {
          this.pos.val = value.name
          this.pos.msg = value
        } else {
          this.pos = {
            //存放组织对象
            val: '',
            msg: null,
          }
        }
      },
      deep: true,
      immediate: true,
    },
    channel: {
      handler(newVal) {
        if (newVal.val != '全部') {
          this.chArray.forEach((el) => {
            //如果有子组织（暂时不考虑）
            if (!this.matchPinyin(el.name, newVal.val)) {
              el.isShow = false
            } else {
              el.isShow = true
            }
          })
        }
      },
      deep: true,
    },
  },
}
</script>

<style scoped lang="scss">
.my-left-content {
  display: grid;
  grid-template-rows: 50px 1px;
  justify-items: center;
  position: relative;
  /*overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }*/
  .my-left-header {
    position: fixed;
    background: #001e3d;
    text-align: center;
    width: 210px;
  }
  .logo {
    line-height: 50px;
    img {
      vertical-align: middle;
      max-width: 100%;
    }
  }
  .form-input {
    background: #081d3b !important;
  }
  .line {
    width: 132px;
    height: 1px;
    margin: 0 auto;
  }
  .chooseBtn {
    height: 42px;
    line-height: 25px;
    display: flex;
    justify-content: center;
    .title-text {
      flex: 1;
      text-align: center;
      padding: 0px 20px;
      margin: 10px 0px;
      &:first-child {
        border-right: 1px solid#007EFF;
      }
      div {
        padding: auto;
        &:hover {
          border-bottom: 2px solid #007eff;
        }
      }
    }
    .titlebtnischoose {
      // background-color: #007eff;
      border-bottom: 2px solid #007eff;
    }
  }
  .outer-container {
    position: relative;
    overflow: hidden;
    height: calc(100vh - 50px);
    top: 50px;
    width: 100%;
  }
  .inner-container {
    height: 100%;
    position: absolute;
    left: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
  }
  /* for Chrome */
  .inner-container::-webkit-scrollbar {
    display: none;
  }
  .firstLevel-ul {
    display: flex;
    /*padding-top: 50px;*/
    flex-direction: column;
    height: calc(100vh - 50px);
    width: 100%;
    /*overflow-y: auto;*/
  }
  .title1-li {
    font-size: 18px;
    line-height: 40px;
    width: 100%;
    cursor: pointer;
    & > .iconfont:nth-child(1) {
      padding-left: 24px;
      padding-right: 10px;
    }
    & > div {
      display: inline-block;
      width: 90px;
    }
  }
  .seconde-ul {
    background-color: #00254c;
  }
  .title2-li {
    height: 40px;
    font-size: 15px;
    line-height: 40px;
    /*margin-left: 10px;*/
    i {
      padding-left: 42px;
    }
    & > div {
      display: inline-block;
      width: 120px;
      margin-left: 10px;
    }
    &:hover,
    &:focus {
      background: #007eff;
    }
  }
  .select-box-pos {
    overflow: auto;
    height: calc(100% - 95px);
    border: 1px solid #9b9b9b;
    .pos-li {
      width: 100%;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 5px;
      &:hover,
      &:focus {
        background: #007eff;
      }
    }
    .pos-li-choose {
      background: #007eff;
    }
  }
}
::-webkit-scrollbar-track {
  border-radius: 3px;
  // background: rgb(239, 239, 239);
  background: #081d3b !important; //修改滚动条底色
}
@media screen and (max-width: 1366px) {
  .my-left-content {
    display: grid;
    grid-template-rows: 35px 1px;
    justify-items: center;
    /*overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }*/
    .my-left-header {
      width: 130px;
    }
    .logo {
      /*line-height: 35px;*/
      img {
        vertical-align: middle;
      }
    }
    .line {
      width: 92px;
      height: 1px;
    }
    .chooseBtn {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      display: flex;
      justify-content: center;
      div {
        flex: 1;
        text-align: center;
        &:hover {
          background-color: #007eff;
        }
      }
      .titlebtnischoose {
        background-color: #007eff;
      }
    }
    .inner-container {
      height: calc(100% - 20px);
      position: absolute;
      left: 0;
      overflow-x: hidden;
      overflow-y: scroll;
      width: 100%;
    }
    .outer-container {
      width: 100%;
    }
    .firstLevel-ul {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .title1-li {
      font-size: 14px;
      line-height: 28px;
      width: 100%;
      cursor: pointer;
      & > .iconfont:nth-child(1) {
        padding-left: 10px;
        padding-right: 10px;
        font-size: 14px !important;
      }
      & > div {
        display: inline-block;
        width: 70px;
      }
    }

    .title2-li {
      height: 28px;
      font-size: 10px;
      line-height: 28px;
      /*margin-left: 7px;*/
      i {
        padding-left: 10px;
      }
      & > div {
        display: inline-block;
        width: 100px;
        margin-left: 3px;
      }
      &:hover,
      &:focus {
        background: #007eff;
        border-radius: 20px;
      }
    }
    .pos-li {
      font-size: 10px;
      width: 140px;
      padding: 5px;
      &:hover,
      &:focus {
        background: #007eff;
      }
    }
  }
  .iconfont {
    font-size: 14px !important;
  }
}
</style>
