<!-- 组织、机组、测点列表 -->
<template>
  <div class="my-list-content">
    <div
      class="input-selection radius"
      ref="setForm1"
    >
      <input
        type="text"
        class="form-input"
        @focus="checkForm(1)"
        placeholder="搜索组织"
        v-model="getForm1"
      />
      <i
        class="iconfont icon-zhongzi-zhankai"
        @click.stop="viewTreeList(1)"
      ></i>
    </div>
    <div
      class="input-selection radius"
      ref="setForm2"
      v-show="treeMsg2 !== null && treeMsg2.length > 0"
    >
      <input
        type="text"
        class="form-input"
        @focus="checkForm(2)"
        placeholder="搜索组织"
        v-model="getForm2"
      />
      <i
        class="iconfont icon-zhongzi-zhankai"
        @click.stop="viewTreeList(2)"
      ></i>
    </div>
    <div
      class="input-selection radius"
      ref="setForm3"
      v-show="treeMsg3 !== null && treeMsg3.length > 0"
    >
      <input
        type="text"
        class="form-input"
        @focus="checkForm(3)"
        placeholder="搜索组织"
        v-model="getForm3"
      />
      <i
        class="iconfont icon-zhongzi-zhankai"
        @click.stop="viewTreeList(3)"
      ></i>
    </div>
    <div
      class="input-selection radius"
      ref="setForm4"
      v-show="treeMsg4 !== null && treeMsg4.length > 0"
    >
      <input
        type="text"
        class="form-input"
        @focus="checkForm(4)"
        placeholder="搜索组织"
        v-model="getForm4"
      />
      <i
        class="iconfont icon-zhongzi-zhankai"
        @click.stop="viewTreeList(4)"
      ></i>
    </div>
    <div
      class="input-selection radius"
      ref="setMachine"
    >
      <input
        type="text"
        class="machine-input"
        @focus="checkMachine"
        placeholder="搜索机组"
        v-model="getMachine"
      />
      <i
        class="iconfont icon-zhongzi-zhankai"
        @click.stop="viewMachineList"
      ></i>
    </div>
    <ul
      class="set-position radius"
      ref="setPos"
    >
      <li
        @contextmenu.prevent="getPosMsg(index, $event)"
        ref="posList"
        class="pos-list text-overflow"
        @click.stop="getPosMsg(index, $event)"
        v-for="(item, index) in positionMsg"
        :key="index"
        @dragstart="dragPos(item, $event)"
        draggable="true"
        @mousemove.stop.prevent="setViewPosMsg(item, $event)"
        @mouseleave="closeFloatingWindow"
      >
        <i :class="setAlarmIcon(item.alarmStatus)"></i>{{ item.position_name }}
      </li>
    </ul>
    <!-- 测点浮窗信息 -->
    <ul
      v-show="viewPosMsg.isShow"
      class="pos-floating-window select-none box-shadow radius default-border"
      :style="viewPosMsg.style"
    >
      <li>
        <div>测点名称</div>
        <div>：{{ viewPosMsg.posName }}</div>
      </li>
      <li>
        <div>测点类型</div>
        <div>：{{ viewPosMsg.posTypeName }}</div>
      </li>
      <li>
        <div>采集器名称</div>
        <div>：{{ viewPosMsg.dgmName }}</div>
      </li>
      <li>
        <div>关联通道名称</div>
        <div>：{{ viewPosMsg.channelName }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import {
  cloneObj,
  setPosMsg,
  addClass,
  removeClass,
  setMacMsg,
  posTypeName,
} from 'utils/utils.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: [],
  data() {
    return {
      pids: {} /* 一级组织id */,
      treeMsg1: null /* 一级组织信息 */,
      treeMsg2: null /* 二级组织信息 */,
      treeMsg3: null /* 三级组织信息 */,
      treeMsg4: null /* 四级组织信息 */,
      machineMsg: null /* 机组信息 */,
      getForm1: '' /* 输入的一级组织名称 */,
      getForm2: '' /* 输入的二级组织名称 */,
      getForm3: '' /* 输入的三级组织名称 */,
      getForm4: '' /* 输入的四级组织名称 */,
      getMachine: '' /* 输入的机组名称 */,
      positionMsg: null /* 测点信息 */,
      checkFormIdx1: -1 /* 已选中一级组织索引 */,
      checkFormIdx2: -1 /* 已选中二级组织索引 */,
      checkFormIdx3: -1 /* 已选中三级组织索引 */,
      checkFormIdx4: -1 /* 已选中三级组织索引 */,
      checkMachineIdx: -1 /* 已选中机组索引 */,
      checkPosIdx: -1 /* 已选中测点索引 */,
      // rightMsg: [
      //    [{val: '实时数据列表', icon: 'icon-shishishuju_huaban', key: 'real', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]},
      //    {val: '历史数据列表', icon: 'icon-lishishujuliebiao_huaban', key: 'history', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]},
      //    {val: '趋势图', icon: 'icon-qushitu_huaban1', key: 'trend', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]},
      //    {val: '波形频谱图', icon: 'icon-boxing_huaban', key: 'wave', isUse: 'disabled-icon', type: [1, 3, 4, 6, 8, 9, 12, 200]},
      //    {val: '三维频谱图', icon: 'icon-sanweipinputu_huaban', key: 'wave3d', isUse: 'disabled-icon', type: [3, 4, 6, 8, 9, 12]}],
      // ], /* 鼠标右键显示信息 */
      rightMsg: [
        [
          {
            val: '实时数据列表',
            icon: 'icon-shishishuju_huaban',
            key: 'real',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            val: '历史数据列表',
            icon: 'icon-lishishujuliebiao_huaban',
            key: 'history',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            val: '趋势图',
            icon: 'icon-qushitu_huaban1',
            key: 'trend',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
          },
          {
            val: '波形频谱图',
            icon: 'icon-boxing_huaban',
            key: 'wave',
            isUse: 'disabled-icon',
            type: [1, 3, 4, 6, 8, 9, 12, 200],
          },
          {
            val: '三维频谱图',
            icon: 'icon-sanweipinputu_huaban',
            key: 'wave3d',
            isUse: 'disabled-icon',
            type: [3, 4, 6, 8, 9, 12],
          },
          {
            val: '对比分析图',
            icon: 'icon-duibifenxitu_huaban',
            key: 'compare',
            isUse: 'disabled-icon',
            type: [1, 3, 4, 6, 8, 9, 12, 200],
          },
          {
            val: '专家频谱图',
            icon: 'icon-zhuanjiapinpu_huaban',
            key: 'spectrum',
            isUse: 'disabled-icon',
            type: [3],
          },
          {
            val: '倾角分布图',
            icon: 'icon-qingjiaofenbutu_huaban_huaban',
            key: 'dip1',
            isUse: 'disabled-icon',
            type: [13],
          },
          {
            val: '沉降跟踪图',
            icon: 'icon-chenjianggenzongtu_huaban',
            key: 'dip2',
            isUse: 'disabled-icon',
            type: [13],
          },
          {
            val: '机舱轨迹图',
            icon: 'icon-jicangguijitu',
            key: 'overturn',
            isUse: 'disabled-icon',
            type: [13],
          },
          {
            val: '散点图',
            icon: 'icon-sandiantu_huaban',
            key: 'scatter',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
          },
          {
            val: '圆周图',
            icon: 'icon-yuanzhoutu_huaban',
            key: 'circle',
            isUse: 'disabled-icon',
            type: [1, 3, 4, 6, 8, 9, 12, 200],
          },
          {
            val: '实时数据列表',
            icon: 'icon-shishishuju_huaban',
            key: 'real',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            val: '历史数据列表',
            icon: 'icon-lishishujuliebiao_huaban',
            key: 'history',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            val: '监测报表',
            icon: 'icon-jiancebaobiao_huaban_huaban',
            key: 'monitor',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            val: '统计列表',
            icon: 'icon-tongjiliebiao_huaban',
            key: 'census',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
          },
          {
            val: '报警日志',
            icon: 'icon-baojing_huaban',
            key: 'alarm',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            val: '系统日志',
            icon: 'icon-xitongrizhi_',
            key: 'system',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          },
          {
            val: '设备维护记录',
            icon: 'icon-shebei',
            key: 'maintain',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
          },
          {
            val: '服务器信息',
            icon: 'icon-fuwuqi',
            key: 'server',
            isUse: 'disabled-icon',
            type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
          },
        ],
      ] /* 鼠标右键显示信息 */,
      checkRight: -1 /* 选择右键信息索引 */,
      isSelectTree1: true /* 是否选中一级组织下拉框 */,
      isSelectTree2: true /* 是否选中二级组织下拉框 */,
      isSelectTree3: true /* 是否选中二级组织下拉框 */,
      isSelectTree4: true /* 是否选中二级组织下拉框 */,
      isSelectMac: true /* 是否选中机组下拉框 */,
      viewPosMsg: {
        isShow: false,
        posName: '',
        posTypeName: '',
        dgmName: '',
        channelName: '',
        style: {},
      },
      checkFormIdx1List: [], //搜索后的机组index队列
    }
  },
  computed: {},
  watch: {
    getForm1(val) {
      this.searchInput(val, 1)
      /* if (this.isSelectTree1) {
         if (val.length > 0) {
            let text = [];
            const tree = this.treeMsg1;
            for (let i = 0, l = tree.length; i < l; i++) {
               if (this.pinyin.match(tree[i].t_name, val)) {
                  text.push({val: tree[i].t_name, icon: '', id: tree[i].t_id, type: tree[i].t_root})
                  this.checkFormIdx1 = i;
               }
            }
            if (text.length > 0) {
               const size = this.$refs.setForm1.getBoundingClientRect();
               this.$list({
                  text,
                  pattern: {
                     maxHeight: '300px',
                     top: `${size.top + size.height}px`,
                     left: `${size.left}px`,
                     width: `${size.width}px`,
                  },
               }).then(res => {
                  this.getTree2Msg(res.item, res.index, 1);
               })
            }
         }
      } else {
         this.isSelectTree1 = true;
      } */
    },
    getForm2(val) {
      this.searchInput(val, 2)
      /* if (this.isSelectTree2) {
         if (val.length > 0) {
            let text = [];
            const tree = this.treeMsg2;
            for (let i = 0, l = tree.length; i < l; i++) {
               if (this.pinyin.match(tree[i].t_name, val)) {
                  text.push({val: tree[i].t_name, icon: '', id: tree[i].t_id, type: tree[i].t_root})
                  this.checkFormIdx2 = i;
               }
            }
            if (text.length > 0) {
               const size = this.$refs.setForm2.getBoundingClientRect();
               this.$list({
                  text,
                  pattern: {
                     maxHeight: '300px',
                     top: size.top + size.height + 'px',
                     left: size.left + 'px',
                     width: size.width + 'px',
                  },
               }).then(res => {
                  this.getTree2Msg(res.item, res.index, 2);
               })
            }
         }
      } else {
         this.isSelectTree2 = true;
      } */
    },
    getForm3(val) {
      this.searchInput(val, 3)
    },
    getForm4(val) {
      this.searchInput(val, 4)
    },
    getMachine(val) {
      if (this.isSelectMac) {
        const mac = this.machineMsg
        if (val.length > 0 && mac) {
          let text = []
          for (let i = 0, l = mac.length; i < l; i++) {
            if (this.pinyin.match(mac[i].m_me, val)) {
              text.push({
                val: mac[i].m_me,
                icon: this.setAlarmIcon(mac[i].alarmStatus),
                id: mac[i].machine_id,
                type: mac[i].m_type,
                index: i,
              })
              this.checkMachineIdx = i
            }
          }
          if (text.length > 0) {
            const size = this.$refs.setMachine.getBoundingClientRect()
            this.$list({
              text,
              pattern: {
                maxHeight: '300px',
                top: size.top + size.height + 'px',
                left: size.left + 'px',
                width: size.width + 'px',
              },
            }).then((res) => {
              this.getPositionData(res.item, res.item.index)
            })
          }
        }
      } else {
        this.isSelectMac = true
      }
    },
  },
  methods: {
    // 检索输入内容
    searchInput(val, type) {
      if (this[`isSelectTree${type}`]) {
        if (val && val.length > 0) {
          let text = []
          const tree = this[`treeMsg${type}`]
          this.checkFormIdx1List = []
          for (let i = 0, l = tree.length; i < l; i++) {
            if (this.pinyin.match(tree[i].t_name, val)) {
              text.push({
                val: tree[i].t_name,
                icon: '',
                id: tree[i].t_id,
                type: tree[i].t_root,
              })
              this.checkFormIdx1List.push(i) //将搜索到的机组下标推入checkFormIdx1List
            }
          }
          if (text.length > 0) {
            const size = this.$refs[`setForm${type}`].getBoundingClientRect()
            this.$list({
              text,
              pattern: {
                maxHeight: '300px',
                top: `${size.top + size.height}px`,
                left: `${size.left}px`,
                width: `${size.width}px`,
              },
            }).then((res) => {
              //根据res.index从下表列表中取得选中组织下标
              this[`checkFormIdx${type}`] = this.checkFormIdx1List[res.index]
              this.getTree2Msg(res.item, res.index, type)
            })
          }
        }
      } else {
        this.isSelectTree1 = true
      }
    },
    // 点击选中组织
    checkForm(type) {
      const className = 'list-input'
      addClass(this.$refs[`setForm${type}`], className)
      if (this[`checkFormIdx${type}`] > -1) {
        this.$store.commit('getCheckMsg', {
          msg: this[`treeMsg${type}`][this[`checkFormIdx${type}`]],
          type: 'tree',
        })
      }
      if (type === 1) {
        this.$store.commit(
          'changeReportTree',
          this[`treeMsg${type}`][this[`checkFormIdx${type}`]]
        )
        for (let i = 2; i <= 4; i++) {
          this[`getForm${i}`] = null
          this[`checkFormIdx${i}`] = -1
        }
      } else if (type === 2) {
        for (let i = 3; i <= 4; i++) {
          this[`getForm${i}`] = null
          this[`checkFormIdx${i}`] = -1
        }
      } else if (type === 3) {
        for (let i = 4; i <= 4; i++) {
          this[`getForm${i}`] = null
          this[`checkFormIdx${i}`] = -1
        }
      }
      const treeMsg = this[`treeMsg${type + 1}`]
      for (let i = 1; i < 5; i++) {
        if (i !== type) {
          removeClass(this.$refs[`setForm${i}`], className)
        }
      }
      removeClass(this.$refs.setMachine, className)
      if (this.checkPosIdx > -1) {
        this.positionMsg &&
          removeClass(this.$refs.posList[this.checkPosIdx], className)
        this.checkPosIdx = -1
      }
    },
    // 点击选中机组
    checkMachine() {
      const className = 'list-input'
      addClass(this.$refs.setMachine, className)
      for (let i = 1; i < 5; i++) {
        removeClass(this.$refs[`setForm${i}`], className)
      }
      if (
        this.machineMsg &&
        this.machineMsg.length > 0 &&
        this.checkMachineIdx > -1
      ) {
        this.$store.state.reportMsg.mac = this.machineMsg[this.checkMachineIdx]
        this.$store.commit('getCheckMsg', {
          msg: cloneObj(this.machineMsg[this.checkMachineIdx], true),
          type: 'mac',
        })
      }
      if (this.checkPosIdx > -1) {
        this.positionMsg &&
          this.$refs.posList[this.checkPosIdx].classList.remove('check-pos')
        this.checkPosIdx = -1
      }
    },
    // 点击组织下拉箭头弹出显示信息
    viewTreeList(type) {
      const tree = this[`treeMsg${type}`]
      if (tree !== null && tree.length > 0) {
        let text = []
        for (let i = 0, l = tree.length; i < l; i++) {
          const value = tree[i]
          if (value !== null) {
            text.push({
              val: tree[i].t_name,
              icon: '',
              id: tree[i].t_id,
              type: tree[i].t_root,
            })
          }
        }
        if (type > 1) {
          let compare = function (arr) {
            for (var j = 0; j < arr.length - 1; j++) {
              for (var i = 0; i < arr.length - 1 - j; i++) {
                if (
                  parseInt(arr[i].val.replace(/[^0-9]/gi, '')) >
                  parseInt(arr[i + 1].val.replace(/[^0-9]/gi, ''))
                ) {
                  var temp = arr[i]
                  arr[i] = arr[i + 1]
                  arr[i + 1] = temp
                }
              }
            }
            return arr
          }
          text = compare(text)
        }
        if (text.length > 0) {
          const size = this.$refs[`setForm${type}`].getBoundingClientRect()
          const fun = [
            'getTree2Msg',
            'getTree2Msg',
            'getTree2Msg',
            'getMachineData',
          ]
          /* let rember = '';
          const index = this[`checkFormIdx${type}`];
          if (index > -1) {
             rember = this[`treeMsg${type}`][index].t_name
          } */
          this.$list({
            text,
            pattern: {
              maxHeight: '300px',
              top: size.top + size.height + 'px',
              left: size.left + 'px',
              width: size.width + 'px',
            },
            rember: this[`getForm${type}`],
          }).then((res) => {
            if (res.index > -1) {
              this[`checkFormIdx${type}`] = res.index
              this[fun[`${type - 1}`]](res.item, res.index, type)
            }
          })
        }
      }
    },
    // 点击机组下拉箭头弹出显示信息
    viewMachineList() {
      const mac = this.machineMsg
      if (mac !== null && mac.length > 0) {
        let text = []
        for (let i = 0, l = mac.length; i < l; i++) {
          text.push({
            val: mac[i].m_me,
            icon: this.setAlarmIcon(mac[i].alarmStatus),
            id: mac[i].machine_id,
            type: mac[i].m_type,
            t_root: mac[i].t_root,
            ch_class: mac[i].ch_class,
          })
        }
        if (text.length > 0) {
          const size = this.$refs.setMachine.getBoundingClientRect()
          /* let rember = '';
          const index = this.checkMachineIdx;
          if (index > -1) {
             rember = this.checkMachine[index].m_me;
          } */
          this.$list({
            text,
            pattern: {
              maxHeight: '300px',
              top: size.top + size.height + 'px',
              left: size.left + 'px',
              width: size.width + 'px',
            },
            rember: this.getMachine,
          }).then((res) => {
            this.getPositionData(res.item, res.index)
          })
        }
      }
    },
    // 获取机组信息成功
    postMachineSuccess(data, tId) {
      this.checkPosIdx = -1
      if (!tId && data.length > 0) {
        this.machineMsg = cloneObj(data, true)
      } else {
        const machines = data.machines
        const l = machines.length
        if (l > 0) {
          // const mac = cloneObj(machines, true);
          // for (let i = 0; i < l; i++) {
          //    const value = mac[i];
          //    value.machine_id = value.mac_id;
          //    value.m_me = value.mac_me;
          // }
          // const arr = sortMachine(mac);
          let arr = setMacMsg(machines)
          /* 机组的排序 */
          let compare = function (obj1, obj2) {
            let val1 = obj1.mac_me
            let val2 = obj2.mac_me
            if (val1 < val2) {
              return -1
            } else if (val1 > val2) {
              return 1
            } else {
              return 0
            }
          }
          arr.sort(compare)
          this.$store.commit('getMsg', {
            key: 'mac',
            msg: arr,
            keys: tId,
          })
          this.machineMsg = arr
        }
      }
    },
    // 获取二级组织信息
    getTree2Msg(val, idx, type) {
      if (idx > -1) {
        /* this.isSelectTree1 = false;
        this.isSelectTree2 = false; */
        for (let i = 1; i <= type; i++) {
          this[`isSelectTree${i}`] = false
        }
        this[`getForm${type}`] = ''
        const tree = this.treeMsg1
        const pids = this.pids
        const msg = []
        for (let key in pids) {
          const tids = pids[key]
          if (Number(key) === val.id) {
            for (let value of tids) {
              for (let v of tree) {
                if (value === v.t_id) {
                  msg.push(v)
                  break
                }
              }
            }
            break
          }
        }
        const classList = this.$refs.setPos.classList
        const className = 'set-positions'

        if (msg.length === 0) {
          if (type === 1) {
            for (let i = 2; i < 5; i++) {
              this[`treeMsg${i}`] = null
              this[`getForm${i}`] = ''
              this[`checkFormIdx${i}`] = -1
            }
            this.$refs.setPos.style = null
          } else if (type === 2) {
            //第二栏组织不存在子组织时
            for (let i = 3; i < 5; i++) {
              this[`treeMsg${i}`] = null
              this[`getForm${i}`] = ''
              this[`checkFormIdx${i}`] = -1
            }
            // this.$refs.setPos.style = 'calc(100% - 120px)';
          }
          this.getMachineData(val, idx, type)
        } else {
          this.checkPosIdx = -1
          this[`getForm${type}`] = val.val
          this.getMachine = ''
          this.machineMsg = null
          this.positionMsg = null
          this.checkForm(type)
          this[`treeMsg${type + 1}`] = msg
          // this.$refs.setPos.style.height = `calc(100% - ${(type + 1) * 40}px)`
          this.$refs.setPos.style.height = `calc(100% - ${(type + 2) * 40}px)`
          this.$refs.setPos.style.overflow = 'auto'
        }
      }
    },
    // 获取机组信息
    getMachineData(val, idx, type) {
      if (idx > -1) {
        this.checkPosIdx = -1
        const tree = this[`treeMsg${type}`]
        for (let i = 1; i < 5; i++) {
          if (type !== i) {
            this[`isSelectTree${i}`] = false
            this[`checkFormIdx${i}`] = -1
          } else {
            for (let i = 0, l = tree.length; i < l; i++) {
              if (tree[i].t_id === val.id) {
                this[`checkFormIdx${i}`] = idx
                break
              }
            }
          }
        }
        this[`getForm${type}`] = val.val
        this.getMachine = ''
        this.machineMsg = null
        this.positionMsg = null
        this.checkForm(type)
        const macMsg = this.$store.state.mac[val.id]
        if (macMsg) {
          this.postMachineSuccess(macMsg)
        } else {
          this.$getApi
            .queryAllMachineByTid({
              t_id: val.id,
              t_root: val.type,
            })
            .then((res) => {
              res && this.postMachineSuccess(res, val.id)
            })
        }
      }
    },
    // 获取测点信息成功
    postPositionSuccess(data, mId) {
      if (!mId && data.length > 0) {
        this.checkPosIdx = -1
        if (this.$refs.posList !== undefined) {
          for (let value of this.$refs.posList) {
            if (value.classList.contains('check-pos')) {
              value.classList.remove('check-pos')
              break
            }
          }
        }
        this.positionMsg = cloneObj(data, true)
      } else if (data.positions && data.positions.length > 0) {
        this.checkPosIdx = -1
        if (this.$refs.posList !== undefined) {
          for (let value of this.$refs.posList) {
            if (value.classList.contains('check-pos')) {
              value.classList.remove('check-pos')
              break
            }
          }
        }
        const pos = setPosMsg(data.positions)
        pos.forEach((item) => {
          item.name = item.position_name
          item.posFlag = `${item.machine_id}_${item.position_id}_${item.position_type}`
          item.t_root = data.t_root
          if (item.tt_ch_type == null && item.tt_ch_type == undefined) {
            item.ch_type = item.tt_ch_type
          }
          if (item.tt_ch_id == null && item.tt_ch_id == undefined) {
            item.ch_id = item.tt_ch_id
          }
        })
        this.$store.commit('getMsg', {
          key: 'pos',
          msg: pos,
          keys: mId,
        })
        this.positionMsg = pos
      }
    },
    // 获取测点信息
    getPositionData(val, idx) {
      if (idx > -1) {
        this.isSelectMac = false
        this.getMachine = val.val
        this.positionMsg = null
        this.checkMachineIdx = idx
        this.checkMachine()
        /* let keys = val.id;
        if (val.ch_class) {
           keys += `_${val.ch_class}`;
        }
        const posMsg = this.$store.state.pos[keys];
        if (posMsg) {
           this.postPositionSuccess(posMsg);
        } else { */
        this.$getApi
          .queryAllPositionsByMacId({
            mac_id: val.id,
            m_type: val.type,
            t_root: val.t_root,
            ch_class: val.ch_class,
          })
          .then((res) => {
            res && this.postPositionSuccess(res, val.id)
          })
        // }
      }
    },
    // 点击测点获取对应测点信息
    getPosMsg(idx, e) {
      this.checkPosIdx = idx
      const curLi = e.currentTarget
      const li = this.$refs.posList
      const className = 'check-pos'
      const iptClass = 'list-input'
      const ref = this.$refs
      const pos = this.positionMsg[idx]
      removeClass(ref.setForm1, iptClass)
      removeClass(ref.setForm2, iptClass)
      removeClass(ref.setForm3, iptClass)
      removeClass(ref.setForm4, iptClass)
      removeClass(ref.setMachine, iptClass)
      for (let i = 0, l = li.length; i < l; i++) {
        const dom = li[i]
        const classList = li[i].classList
        if (pos.posFlag !== this.positionMsg[i].posFlag) {
          removeClass(dom, className)
        }
      }
      addClass(curLi, className)
      this.$store.commit('getCheckMsg', {
        msg: this.positionMsg[idx],
        type: 'pos',
      })
      //  若为右键点击
      if (e.type === 'contextmenu') {
        this.checkRight = 0
        const text = cloneObj(this.rightMsg[this.checkRight], true)
        const type = pos.position_type
        const posLoc = pos.pos_loc
        const di = 'disabled-icon'
        const ai = 'abled-icon'
        for (let val of text) {
          val.isUse = val.type.includes(type) ? ai : di
          if (type === 13) {
            if (posLoc === '2' && val.val === '倾角分布图') {
              val.isUse = di
            } else if (posLoc !== '2' && val.val === '沉降跟踪图') {
              val.isUse = di
            }
          }
        }
        const pattern = {
          width: '150px',
          maxHeight: 'auto',
          left: `${e.x}px`,
          top: `${e.y}px`,
        }
        if (e.y + 160 >= window.innerHeight) {
          pattern.top = `${e.y - 150}px`
        }
        this.$list({
          text,
          pattern,
        }).then((res) => {
          this.closeList(res.item, res.index)
        })
      }
    },
    // 点击右键弹出列表信息
    closeList(item, index) {
      if (index > -1) {
        this.$parent.$refs.header.getChart(item)
      }
    },
    // 拖动测点
    dragPos(item, e) {
      const str = JSON.stringify(item)
      e.dataTransfer.setData('flag', str)
    },
    // 获取组织信息成功
    getTree(data) {
      this.pids = data.pids
      this.$store.commit('getMsg', {
        key: 'tree',
        msg: data.trees,
      })
      this.treeMsg1 = data.trees

      let tArray
      if (data.trees.length === 1) {
        data.trees[0].name = data.trees[0].t_name
        data.trees[0].isShow = true //拼音搜索的时候要用
        data.trees[0].isChecked = false // 多选框的时候使用
        data.trees[0].id = 0 //多选框的时候使用
        tArray = data.trees
      } else {
        let res = cloneObj(data)
        tArray = this.recursion(res)
      }
      this.$store.commit('getMsg', {
        key: 'foldtree',
        msg: tArray,
      })
    },
    /* 递归成tree 的方法 */
    recursion(res) {
      let pid = res.pids
      let dataArray = res.trees
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
    closeFloatingWindow() {
      // this.viewPosMsg.isShow = false;
      setTimeout(() => {
        this.viewPosMsg.isShow = false
      }, 500)
    },
    // 设置报警状态
    setAlarmIcon(type) {
      const iconObj = {
        0: 'failure-text icon-icon-test', //离线
        1: '', //正常
        2: 'warning-text icon-baojing', //预警
        3: 'alarm-text icon-baojing', //一级报警
        4: 'alarm-text icon-baojing', //二级报警
        null: 'failure-text icon-icon-test', //离线
        undefined: 'failure-text icon-icon-test', //离线
      }
      return `${iconObj[type]} iconfont`
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例 ）
  created() {
    /* 获取token和组织信息 */
    const treeMsg = {
      t_ids: JSON.parse(sessionStorage.getItem('tree')),
    }
    this.$getApi.queryFoldersByTid(treeMsg).then((res) => {
      if (res) {
        this.getTree(res)
      }
    })
  },
}
</script>
<style scoped lang="scss">
.my-list-content {
  overflow: hidden;
  padding-left: 10px;
  height: calc(100vh - 115px);
  .input-selection {
    height: 30px;
    width: 210px;
    padding-left: 1px;
    margin-bottom: 10px;
    input {
      height: 28px;
      width: 180px;
      border: none;
      padding: 0 9px;
      font-size: 16px;
      cursor: default;
    }
    i {
      cursor: pointer;
      font-size: 12px;
      display: inline-block;
      width: 20px;
      height: 28px;
      line-height: 28px;
      text-align: center;
    }
  }
  .set-positions {
    height: calc(100% - 120px);
  }
  .pos-floating-window {
    position: fixed;
    z-index: 5;
    padding: 5px;
    font-size: 12px;
    li {
      height: 20px;
      line-height: 20px;
      display: flex;
      // grid-template-columns: 80px 1fr;
      div {
        &:first-child {
          &:after {
            display: inline-block;
            // width: 100px;
            height: 0;
            content: '';
          }
          text-align: justify;
        }
      }
    }
  }
}
</style>
