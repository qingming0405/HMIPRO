<template>
  <div class="my-head-content">
    <div class="title-search data-retrieval-bg-edge">
      <!-- <div class="title-text">{{ val }}</div> -->
      <!-- 单选组织测电机组 -->
      <ul class="general-view-screen">
        <!-- 组织 -->
        <!-- <li class="view-screen">
          <div class="view-screen-f">组织:</div>
          <div
            class="select-box"
            ref="select-box-tree"
            @click="changeTreeType"
          >
            <input
              class="select-input"
              type="text"
              placeholder="搜索组织"
              v-model="tree.val"
              @keyup="searchByKeydown('tree')"
            />
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
        </li> -->
        <!-- 机组或机泵 -->
        <!-- <li class="view-screen">
          <div class="view-screen-f">机组:</div>
          <div
            class="select-box"
            ref="select-box-mac"
            @click="changeMacType"
          >
            <input
              class="select-input"
              type="text"
              placeholder="搜索机组"
              v-model="mac.val"
              @keyup="searchByKeydown('mac')"
            />
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
        </li>
        <li
          class="view-screen"
          v-show="channelSel"
        >
          <div class="view-screen-f">通道筛选:</div>
          <div
            class="select-box"
            @click="changeChannelType"
            @dblclick="changeAllChannelType"
            ref="select-box-channel"
            :title="channel.val"
          >
            <input
              class="select-input"
              type="text"
              placeholder="搜索通道"
              v-model="channel.val"
            />
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
        </li> -->
        <!-- 测点 -->
        <!-- <li class="view-screen">
          <div class="view-screen-f">测点:</div>
          <div
            class="select-box"
            ref="select-box-pos"
            @click="changePosType"
          >
            <input
              class="select-input"
              type="text"
              placeholder="搜索测点"
              v-model="pos.val"
              @keyup="searchByKeydown('pos')"
            />
            <i class="iconfont icon-zhongzi-zhankai"></i>
          </div>
        </li> -->
        <li
          class="title1-li"
          v-for="(item, index) in firstLevel"
          @mouseenter="inverse_btm(item)"
          @mouseleave="inverse_btm_f(item)"
          v-show="item.isShow"
        >
          <div class="title1-item">
            <i
              class="iconfont"
              :class="item.icon"
            ></i>
            <div class="title1-name">{{ item.val }}</div>
          </div>

          <div class="title1-division"></div>
          <ul
            class="seconde-ul"
            v-show="item.isAll"
          >
            <li
              class="title2-li"
              v-for="(item2, index2) in secondLevel[index]"
              v-show="
                  item2.general
                    ? item2.t_root === generalflag
                    : item2.isShow && item2.controlShow
                "
              @click="
                  item2.general
                    ? generalRouting(item2.name, item2.val, item2.icon)
                    : chartRouting(item2.name, item2.val, item2.icon)
                "
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
        v-show="audioAlarm"
        class="iconList"
        @click="goRealAlarm"
      >
        <i
          class="iconfont icon-shishibaojingtubiao_huaban1"
          :class="[alarmData.length > 0 ?'iconList-a':'',isBlingIcon?'iconList-bling':'']"
        ></i>
        <i
          v-show="alarmData.length > 0 && isShowIcon"
          class="iconfont icon-shengyinyinliangmianxing1_fuzhi-01 blingbling"
          @click.stop="playSound"
          :title="$t('HeaderEdge.alarmRingTitle')"
        ></i>
        <div
          class="alarm-number"
          v-show="alarmData.length > 0"
        ><span>{{alarmData.length}}</span></div>
      </div>
      <!-- 全屏按钮-->
      <div
        class="max-btn"
        @click="showMax()"
      ><i
          class="iconfont"
          :class="isMax?'icon-back_huaban':'icon-MAX_huaban'"
        ></i></div>
      <!-- 退出按钮 -->
      <div
        class="out-btn"
        @click="logout"
      >{{$t('HeaderEdge.loginOut')}}</div>
    </div>
    <div
      class="title"
      ref="title"
    >
      <div
        class="title-text"
        v-show="isShowTitleText"
      >
        {{ titleText }}
      </div>
      <div class="head-List">
        <ul class="head_list_ul">
          <li
            class="head_tab_li"
            v-for="(item, index) in tab_list"
            :class="{ activity: item.isActivity }"
            @contextmenu.prevent.stop="rightClick($event)"
          >
            <i
              class="iconfont"
              :class="item.icon"
            ></i>
            <div
              @click="
                getPath({ name: item.name, val: item.val, key: item.key});
                scrollLabel(0);
              "
              @mousedown.stop="closeTabByMiddle($event, index, item)"
              :title="item.val"
            >
              {{ item.val }}
            </div>
            <i
              v-show="item.name != 'userManual'"
              class="iconfont icon-zhineng"
              :title="$t('HeaderEdge.manualTitle')"
              @click="goUserManual(item)"
            ></i>
            <i
              class="iconfont_self icon-cuohao"
              @click="closeTab(index, item)"
            ></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneObj, matchRule, posTypeName } from 'utils/utils.js'
import audioInfo from './audio_click'
export default {
  name: 'header_edge',
  data() {
    return {
      /* --------------------------------------导航栏迁移--------------------------------------- */
      firstLevel: [
        {
          val: this.$t('HeaderEdge.firstLevel1'), //总貌图
          icon: 'icon-shouye1',
          isAll: false,
          exceptTRoot: [],
          isShow: true,
        },
        {
          val: this.$t('HeaderEdge.firstLevel2'), //图谱分析
          icon: 'icon-zhongzi-chakanjiemian-boxing-',
          isAll: false,
          exceptTRoot: [],
          isShow: true,
        },
        {
          val: this.$t('HeaderEdge.firstLevel3'), //启停机分析
          icon: 'icon-guanji',
          isAll: false,
          includeTRoot: [4],
          isShow: true,
        },
        {
          val: this.$t('HeaderEdge.firstLevel4'), //数据分析
          icon: 'icon-zhongzi-chakanjiemian-shuju-',
          isAll: false,
          exceptTRoot: [],
          isShow: true,
        },
        {
          val: this.$t('HeaderEdge.firstLevel5'), //日志列表
          icon: 'icon-rizhiliebiao',
          isAll: false,
          exceptTRoot: [],
          isShow: true,
        },
        // { val: "系统工具", icon: "icon-kehuduan", isAll: false }
      ],
      secondLevel: [
        [
          /* 风电总貌图 */
          {
            val: this.$t('HeaderEdge.secondLevel1_1'), //总貌图
            icon: 'icon-shouye1',
            name: 'fdGeneral',
            general: true,
            t_root: 0,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_2'), //重点关注
            icon: 'icon-shoucang',
            name: 'fdFocus',
            general: true,
            t_root: 0,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_3'), //设备模型
            icon: 'icon-shijingsanwei-',
            name: 'windModel',
            general: true,
            t_root: 0,
          },
          /* 水泥总貌图 */
          {
            val: this.$t('HeaderEdge.secondLevel1_1'), //总貌图
            icon: 'icon-shouye1',
            name: 'snGeneral',
            general: true,
            t_root: 1,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_2'), //重点关注
            icon: 'icon-shoucang',
            name: 'snFocus',
            general: true,
            t_root: 1,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_3'), //设备模型
            icon: 'icon-shijingsanwei-',
            name: 'snModel',
            general: true,
            t_root: 1,
          },
          /* 轨交总貌图 */
          {
            val: this.$t('HeaderEdge.secondLevel1_1'), //总貌图
            icon: 'icon-shouye1',
            name: 'gjGeneral',
            general: true,
            t_root: 2,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_2'), //重点关注
            icon: 'icon-shoucang',
            name: 'gjFocus',
            general: true,
            t_root: 2,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_3'), //设备模型
            icon: 'icon-shijingsanwei-',
            name: 'gjModel',
            general: true,
            t_root: 2,
          },
          /* 油田总貌图 */
          {
            val: this.$t('HeaderEdge.secondLevel1_1'), //总貌图
            icon: 'icon-shouye1',
            name: 'ytGeneral',
            general: true,
            t_root: 3,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_2'), //重点关注
            icon: 'icon-shoucang',
            name: 'ytFocus',
            general: true,
            t_root: 3,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_3'), //油田设备模型
            icon: 'icon-shijingsanwei-',
            name: 'ytModel',
            general: true,
            t_root: 3,
          },
          // 化工
          {
            val: this.$t('HeaderEdge.secondLevel1_1'), //总貌图
            icon: 'icon-shouye1',
            name: 'hgGeneral',
            general: true,
            t_root: 5,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_2'), //重点关注
            icon: 'icon-shoucang',
            name: 'hgFocus',
            general: true,
            t_root: 5,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_3'), //设备模型
            icon: 'icon-shijingsanwei-',
            name: 'hgModel',
            general: true,
            t_root: 5,
          },
          /* 通用总貌图 */
          {
            val: this.$t('HeaderEdge.secondLevel1_1'), //总貌图
            icon: 'icon-shouye1',
            name: 'tyGeneral',
            general: true,
            t_root: -1,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_2'), //重点关注
            icon: 'icon-shoucang',
            name: 'tyFocus',
            general: true,
            t_root: -1,
          },
          {
            val: this.$t('HeaderEdge.secondLevel1_3'), //设备模型
            icon: 'icon-shijingsanwei-',
            name: 'tyModel',
            general: true,
            t_root: -1,
          },
        ],
        [
          {
            val: this.$t('HeaderEdge.secondLevel2_1'), //智能诊断趋势
            icon: 'icon-boxing_huaban',
            name: 'diagnosisTrend',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [0] /* 当t_root在exceptTRoot中时标题不显示 */,
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_2'), //波形频谱图
            icon: 'icon-boxing_huaban',
            name: 'wave',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [3] /* 当t_root在exceptTRoot中时标题不显示 */,
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_3'), //趋势图
            icon: 'icon-qushitu_huaban1',
            name: 'trend',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_4'), //三维频谱图
            icon: 'icon-sanweipinputu_huaban',
            name: 'wave3d',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [3],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_5'), //轨道波磨图
            icon: 'icon-guidao',
            name: 'tmstrend',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [2],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_6'), //轨道波磨频谱瀑布
            icon: 'icon-sanweipinputu_huaban',
            name: 'tmswave3d',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [2],
          },
          // {
          //   val: "电流卡片",
          //   icon: "icon-dianliukapian_huaban1_huaban1",
          //   name: "punchCard",
          //   controlShow: true, //后来配置这样表是否显示
          //   isShow: true
          // },
          {
            val: this.$t('HeaderEdge.secondLevel2_7'), //倾角分布图
            icon: 'icon-qingjiaofenbutu_huaban_huaban',
            name: 'dip',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [1, 2, 3, 4, 5],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_8'), //机舱轨迹图
            icon: 'icon-jicangguijitu',
            name: 'overturn',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [1, 2, 3, 4, 5],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_9'), //散点图
            icon: 'icon-sandiantu_huaban',
            name: 'scatter',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_10'), //危险转速区间监测
            icon: 'icon-yibiaopan',
            name: 'dashboard',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [0],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_11'), //轨道波磨地图
            icon: 'icon-iconditietu',
            name: 'railCorrugation',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [2],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_12'), //单值棒图
            icon: 'icon-danzhibangtu_huaban1',
            name: 'singleBar',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_13'), //多值棒图
            icon: 'icon-duozhibangtu_huaban1',
            name: 'multiBar',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },

          {
            val: this.$t('HeaderEdge.secondLevel2_14'), //全频谱图
            icon: 'icon-quanpinputu_huaban1',
            name: 'fullSpectrum',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          // {
          //   val: '全息谱图',
          //   icon: 'icon-23quanxiputu_huaban1',
          //   name: 'hologram',
          //   controlShow: true, //后来配置这样表是否显示
          //   isShow: true,
          //   includeTRoot: [4],
          // },

          {
            val: this.$t('HeaderEdge.secondLevel2_15'), //多频谱图
            icon: 'icon-duopinputu_huaban1',
            name: 'multiSpectrum',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_16'), //单面动平衡
            icon: 'icon-9danmiandongpingheng_huaban1',
            name: 'singledynamicBalance',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_17'), //双面动平衡
            icon: 'icon-10shuangmiandongpingheng_huaban1',
            name: 'doubledynamicBalance',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_18'), //极坐标图
            icon: 'icon-14jizuobiao_huaban1',
            name: 'polarDiagram',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_19'), //轴心轨迹图
            icon: 'icon-22zhouxinguijitu_huaban1',
            name: 'axisLocus',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel2_20'), //轴心位置图
            icon: 'icon-21zhouxinweizhitu_huaban1',
            name: 'axisPosition',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          // {
          //   val: '多轨迹图',
          //   icon: 'icon-26duoguijitu_huaban1',
          //   name: 'multiTrack',
          //   controlShow: true, //后来配置这样表是否显示
          //   isShow: true,
          //   includeTRoot: [4],
          // },
        ],
        [
          // 启停机分析
          {
            val: this.$t('HeaderEdge.secondLevel3_1'), //转速时间图
            icon: 'icon-12zhuansushijiantu_huaban1',
            name: 'speedTime',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel3_2'), //奈奎斯特图
            icon: 'icon-25naikuisitetu_huaban1',
            name: 'nyquist',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel3_3'), //伯德图
            icon: 'icon-13bodetu_huaban1',
            name: 'bode',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel3_4'), //启停机频谱瀑布图
            icon: 'icon-19pinpupubutuqitingji_huaban1',
            name: 'ssSpectrumWaterfall',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel3_5'), //级联图
            icon: 'icon-20jiliantu_huaban1',
            name: 'cascade',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel3_6'), //启停机数据列表
            icon: 'icon-qitingjishujuliebiao_huaban1',
            name: 'startStop',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
        ],
        [
          {
            val: this.$t('HeaderEdge.secondLevel4_1'), //实时数据汇总列表
            icon: 'icon-huizong',
            name: 'realSummary',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [1, 3],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_2'), //实时数据列表
            icon: 'icon-shishishuju_huaban',
            name: 'real',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_3'), //历史数据列表
            icon: 'icon-lishishujuliebiao_huaban',
            name: 'history',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_4'), //监测报表
            icon: 'icon-jiancebaobiao_huaban_huaban',
            name: 'monitor',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_5'), //设备参数
            icon: 'icon-00-shujujilu-05',
            name: 'equipmentParameters',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [3],
          },
          {
            // 机组
            val: this.$t('HeaderEdge.secondLevel4_6'), //设备维护记录
            icon: 'icon-shebei',
            name: 'maintain',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_7'), //统计列表
            icon: 'icon-tongjiliebiao_huaban',
            name: 'census',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_8'), //专家系统
            icon: 'icon-17zhuanjiaxitong_huaban11',
            name: 'expertSystem',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_9'), //实时报警汇总列表   //声光报警，不在左导航栏显示
            icon: '',
            name: 'realAlarm',
            controlShow: false, //后来配置这样表是否显示
            isShow: false,
            includeTRoot: [],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_10'), //踏面测量数据
            icon: 'icon-tamianceliangshuju',
            name: 'treadData',
            controlShow: true,
            isShow: true,
            includeTRoot: [2],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_11'), //踏面磨损趋势
            icon: 'icon-tamianmosunqushi',
            name: 'wearTrend',
            controlShow: true,
            isShow: true,
            includeTRoot: [2],
          },
          {
            val: this.$t('HeaderEdge.secondLevel4_12'), //踏面寿命预估
            icon: 'icon-tamianshoumingyugu',
            name: 'lifePredict',
            controlShow: true,
            isShow: false,
            includeTRoot: [2],
          },
        ],
        [
          {
            val: this.$t('HeaderEdge.secondLevel5_1'), //报警日志
            icon: 'icon-baojing_huaban',
            name: 'alarm',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [4],
          },
          // 8000报警日志
          {
            val: this.$t('HeaderEdge.secondLevel5_1'), //报警日志
            icon: 'icon-baojing_huaban',
            name: 'alarm1',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            includeTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel5_2'), //服务器信息
            icon: 'icon-fuwuqi',
            name: 'server',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
            exceptTRoot: [4],
          },
          {
            val: this.$t('HeaderEdge.secondLevel5_3'), //系统日志
            icon: 'icon-xitongrizhi_',
            name: 'system',
            controlShow: true, //后来配置这样表是否显示
            isShow: true,
          },
          {
            val: this.$t('HeaderEdge.secondLevel5_4'), // 使用手册
            icon: 'icon-icon-test',
            name: 'userManual',
          },
        ],
        // [{ val: "使用手册", icon: "icon-icon-test", name: "" }]
      ],
      generalOnlyTree: [
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
      ], //必须有组织的打开的图谱
      generalOnlyMac: [
        'fdModel',
        'windModel',
        'fdModelitem',
        'fdanchorbolt' /* 风电锚栓 */,
        'fdbasics' /* 风电基础 */,
        'fdbolt' /* 风电螺栓 */,
        'fddrivechain' /* 风电传动链 */,
        'fdimpeller' /* 风电叶轮 */,
        'fdoil' /* 风电油液 */,
        'fdtowerdrum' /* 风电塔筒 */,
        'snModel',
        'snMechineModel' /* 水泥、煤炭设备模型 */,
        'snVib' /* 水泥、煤炭测点列表 */,
        'snOil' /* 水泥、煤炭模型油液参数 */,
        'snTowerdrum' /* 水泥、煤炭模型倾角 */,
        'gjModel',
        'gjModelInfo' /* 轨交模型 */,
        'ytModel',
        'ytMechineModel' /* 油田设备模型 */,
        'ytAnalyse' /* 油田沉没度分析 */,
        'ytPunchCard' /* 油田沉没度分析 */,
        'tyModel',
        'hgModel',
      ], //必须有机组打开的图谱
      requiredPos: [
        'real',
        'history',
        'wave',
        'trend',
        // "punchCard",
        'tmswave3d',
        'tmstrend',
        'wave3d',
        'dip',
        'overturn',
        'scatter',
        'dashboard',
        'railCorrugation',
        /* 8000 */
        'alarm1',
        'bode', //伯德图
        'axisPosition' /* 轴心位置图 */,
        'speedTime' /* 转速时间 */,
        'fullSpectrum' /* 全频谱图 */,
        'hologram' /* 全息谱图 */,
        'cascade' /* 级联图 */,
        'SpectrumWaterfall' /* 频谱瀑布图 */,
        'ssSpectrumWaterfall' /* 启停机频谱瀑布图 */,
        'multiSpectrum' /* 多频谱图 */,
        'singledynamicBalance' /* 单面动平衡 */,
        'doubledynamicBalance' /* 双面动平衡 */,
        'polarDiagram' /* 极坐标图 */,
        'axisLocus' /* 轴心轨迹 */,
        'multiTrack' /* 多轨迹图 */,
        'nyquist' /* nyquist图 */,
        'startStop' /* 启停机数据列表 */,
        'expertSystem' /* 专家系统 */,
        'wearTrend' /* 踏面预测趋势图 */,
      ], //只能由测点打开的图谱(趋势图，倾角分布图，机舱轨迹图，危险转速区间)
      requiredMac: [
        'maintain',
        'monitor',
        'system',
        'singleBar',
        'multiBar',
        'diagnosisTrend',
      ], // (系统日志)可以由机组打开的图谱
      requiredTree: ['realSummary', 'equipmentParameters'],
      generalflag: 0,
      /* ------------------------------------------------------------------------------------- */
      tab_list: [], //存放所有标签以及状态{key:'',name:'',isActivity:}
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
      isShowTitleText: false,
      titleText: '',
      audioAlarm: false, //是否需要声光报警
      alarmData: {
        length: 0, //报警个数
        data: {},
        timer: null,
      },
      context: null,
      audio: null,
      autoplay: '',
      isShowIcon: false,
      isBlingIcon: false,
      isMax: false, //是否全屏
    }
  },
  methods: {
    /* -------------------------------------------------导航栏迁移------------------------------------------------- */
    /* 二级标签打开关闭 */
    inverse_btm(item) {
      item.isAll = true
    },
    inverse_btm_f(item) {
      item.isAll = false
    },
    // 根据组织t_root跳转不同总貌图
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
      if (item.val === this.$t('HeaderEdge.secondLevel2_1')) {//'智能诊断趋势'
        if (config.fdDiagnosis == 1) {
          item.isShow = true
        } else if (config.fdDiagnosis == 0) {
          item.isShow = false
        }
      }
      return item
    },
    /* 总貌图跳转 */
    generalRouting(name, val, icon) {
      let checkMsg = this.$store.state.checkMsg
      let tree = checkMsg.tree
      let mac = checkMsg.mac
      let key, text
      if (this.generalOnlyTree.includes(name)) {
        if (!tree) {
          /* 没有组织 */
          this.$pop(this.$t('Common.popTreeTips')) //请选择组织
          return
        } else {
          key = `${name}_tree_${tree.t_id}`
          text = this.tree.val + '-' + val
        }
        /* 标题只显示组织 */
      } else if (this.generalOnlyMac.includes(name)) {
        if (!mac) {
          /* 没有机组*/
          this.$pop(this.$t('Common.popMacTips')) //请选择机组
          return
        } else {
          key = `${name}_mac_${mac.mac_id}_${mac.ch_class}`
          text = this.mac.val + '-' + val
        }
      }
      this.$nextTick(() => {
        //head部分的样式改回蓝色
        this.$refs.title && (this.$refs.title.style.background = '#092e55')
        this.$parent.$el.getElementsByClassName('my-center-content')[0] &&
          (this.$parent.$el.getElementsByClassName(
            'my-center-content'
          )[0].style.background = '#092e55')
      })
      let generalTitle = this.changeTitleText(name, key)
      let tabFlag = false
      let router = name
      this.tab_list.forEach((item) => {
        item.isActivity = false
        /* 判断是否已经存在该标签，同一个测点同一个图谱只能开一次 */
        if (item.key == key) {
          item.isActivity = true
          tabFlag = true //存在该标签，将该标签激活
          // 判断切换设备模型是否存在已跳转其他页面，有则跳转至GeneralModel相应保存router页没有则正常跳转至模型页
          if (this.generalOnlyMac.indexOf(name) !== -1) {
            if (this.$store.state.GeneralModel[key]) {
              router = this.$store.state.GeneralModel[key]
              item.name = router
            }
          }
          item.generalTitle = generalTitle
          //当前选中标签存入全局store
          this.$store.commit('setChooseTitle', item)
          this.sendRouteToStore(key, name, 1)
        }
      })
      if (!tabFlag) {
        this.tab_list.push({
          name: name,
          isActivity: true,
          key,
          value: val, //图谱名称
          val: text,
          icon: icon,
          generalTitle,
          t_root: tree.t_root,
        })
        //当前选中标签存入全局store
        this.$store.commit('setChooseTitle', {
          name: name,
          isActivity: true,
          key,
          val: text,
          icon: icon,
          generalTitle,
          t_root: tree.t_root,
        })
        this.sendRouteToStore(key, name, 0)
      }
      this.$router.push({
        name: router,
      })
    } /* 图标跳转路由 */,
    chartRouting(name, val, icon) {
      /* 路由拦截 */
      let checkMsg = this.$store.state.checkMsg
      let tree = checkMsg.tree
      let mac = checkMsg.mac
      let pos = checkMsg.pos
      let type = checkMsg.type
      let key

      // 是否只能由测点打开
      if (name === 'server' || name === 'userManual' || name === 'realAlarm') {
        // 若是服务器信息或使用手册
        key = name
      } else if (this.requiredPos.includes(name)) {
        if (!pos) {
          // 如果不存在测点的选择
          this.$pop(this.$t('Common.popPosTips')) //请选择测点
          return
        } else {
          if (
            !matchRule(pos.position_type, name, pos.dgm_type, pos.t_root, pos)
          ) {
            //未能匹配
            this.$pop(this.$t('Common.noChartTips')) //该测点没有此图谱
            return
          }
        }
        // 实时数据列表同一机组同测点类型图谱只能开一张
        if (name == 'real') {
          for (let i = 0, l = this.tab_list.length; i < l; i++) {
            if (this.tab_list[i].name == 'real') {
              let [, , macId, pId, pType] = this.tab_list[i].key.split('_')
              if (macId == mac.mac_id && pType == pos.position_type) {
                this.getPath({
                  name: this.tab_list[i].name,
                  val: this.tab_list[i].val,
                  key: this.tab_list[i].key,
                })
                return
              }
            }
          }
        }
        key = `${name}_pos_${mac.mac_id}_${pos.position_id}_${pos.position_type}`
      } else if (this.requiredMac.includes(name)) {
        if (!mac) {
          this.$pop(this.$t('Common.popMacTips')) //请选择机组
          return
        }
        // 存在机泵
        if (mac.ch_class) {
          key = `${name}_mac_${mac.mac_id}_${mac.ch_class}`
        } else {
          key = `${name}_mac_${mac.mac_id}`
        }
      } else if (this.requiredTree.includes(name)) {
        if (!tree) {
          this.$pop(this.$t('Common.popTreeTips')) //请选择组织
          return
        }
        key = `${name}_tree_${tree.t_id}_${tree.t_root}`
      } else {
        if (name === 'alarm') {
          if (type === 'pos') {
            if (pos && pos.position_type == 1) {
              //转速测点无报警
              this.$pop(this.$t('Common.noChartTips')) //该类型测点没有此图谱
              return
            }
            key = `${name}_pos_${mac.mac_id}_${pos.position_id}_${pos.position_type}`
          } else if (type === 'mac' && mac.ch_class) {
            key = `${name}_mac_${mac.mac_id}_${mac.ch_class}` //机泵进入
          } else if (type === 'mac' && !mac.ch_class) {
            key = `${name}_mac_${mac.mac_id}` //机组进入
          } else if (type === 'tree') {
            /* 实时数据列表汇总需要用到t_root */
            key = `${name}_tree_${tree.t_id}_${tree.t_root}`
          } else {
            this.$pop(this.$t('Common.popTreeTips')) //请选择组织
            return
          }
        } else {
          if (type === 'pos') {
            key = `${name}_pos_${mac.mac_id}_${pos.position_id}_${pos.position_type}`
          } else if (type === 'mac') {
            key = `${name}_mac_${mac.mac_id}`
          } else if (type === 'tree') {
            /* 实时数据列表汇总需要用到t_root */
            key = `${name}_tree_${tree.t_id}_${tree.t_root}`
          } else {
            this.$pop(this.$t('Common.popTreeTips')) //请选择组织
            return
          }
        }
      }
      let params = {
        key,
        name,
        val,
        icon,
        t_root: tree.t_root,
      }
      this.getPath(params)
      this.scrollLabel(1)
      // this.$bus.$emit('getPath', params)
      // this.$bus.$emit('scrollLabel', 1)
    },
    /* ----------------------------------------------------------------------------------------------------------- */
    /* 退出登录 */
    logout() {
      this.$pop({
        content: this.$t('HeaderEdge.loginOutTips'),
        btnNum: 2,
      }).then((res) => {
        if (res) {
          this.$getApi.logout()
          sessionStorage.clear()
          this.$router.push({ path: '/login' })
          // 刷新页面清空数据
          this.$router.go(0)
        }
      })
    },
    /* 改变标题,总貌图的时候显示 */
    changeTitleText(route, key) {
      /* 监听组织机组，改变标题 */
      let generalChart = [
        'fdGeneral',
        'fdFocus',
        'fdModel',
        'windModel',
        'fdModelitem',
        'fdanchorbolt',
        'fdbasics',
        'fdbolt',
        'fddrivechain',
        'fdimpeller',
        'fdoil',
        'fdtowerdrum',
        'snGeneral',
        'snFocus',
        'snModel',
        'gjGeneral',
        'gjFocus',
        'gjModel',
        'gjModelInfo',
        'ytGeneral',
        'ytFocus',
        'ytModel',
        'tyGeneral',
        'tyFocus',
        'tyModel',
        'hgGeneral',
        'hgFocus',
        'hgModel',
      ]
      let routeName,
        titleText = ''
      routeName = route
      if (routeName) {
        this.$nextTick(() => {
          this.$refs.title && (this.$refs.title.style.background = '#092e55')
        })
        if (generalChart.indexOf(routeName) !== -1) {
          this.isShowTitleText = true
        } else {
          this.isShowTitleText = false
        }
        let treeValue = this.tree.val
        let macValue = this.mac.val
        let gjMacName = this.mac.gjMacName
        /* 显示组织+图谱名称 */
        switch (routeName) {
          case 'fdGeneral':
            titleText = this.$t('HeaderEdge.secondLevel1_1') //'总貌图'
            break
          case 'fdFocus':
            titleText = treeValue + '-' + this.$t('HeaderEdge.secondLevel1_2') //'重点关注'
            break
          case 'fdModel':
            titleText =
              treeValue +
              '-' +
              macValue +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型'
            break
          case 'windModel':
            //如果跳转到风机模型，头部样式改成黑色
            this.$nextTick(() => {
              this.$refs.title && (this.$refs.title.style.background = '#000')
              this.$parent.$el.getElementsByClassName(
                'my-center-content'
              )[0].style.background = '#000'
              if (
                this.$store.state.GeneralModel[key] &&
                this.$store.state.GeneralModel[key] != 'windModel'
              ) {
                this.$refs.title &&
                  (this.$refs.title.style.background = '#092e55')
                this.$parent.$el.getElementsByClassName(
                  'my-center-content'
                )[0].style.background = '#092e55'
              }
            })
            titleText =
              treeValue +
              '-' +
              macValue +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型'
            break
          case 'fdanchorbolt':
          case 'fdbasics':
          case 'fdbolt':
          case 'fddrivechain':
          case 'fdimpeller':
          case 'fdoil':
          case 'fdtowerdrum':
          case 'fdModelitem':
            titleText =
              treeValue +
              '-' +
              macValue +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型'
            break
          case 'snGeneral':
            titleText = this.$t('HeaderEdge.secondLevel1_1') //'总貌图'
            break
          case 'snFocus':
            titleText = treeValue + '-' + this.$t('HeaderEdge.secondLevel1_2') //'重点关注'
            break
          case 'snModel':
            titleText =
              treeValue +
              '-' +
              macValue +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型'
            break
          case 'gjGeneral':
            titleText = this.$t('HeaderEdge.secondLevel1_1') //'总貌图'
            break
          case 'gjFocus':
            titleText = treeValue + '-' + this.$t('HeaderEdge.secondLevel1_2') //'重点关注'
            break
          case 'gjModel':
            titleText =
              treeValue +
              '-' +
              gjMacName +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型'
            break
          case 'gjModelInfo':
            titleText =
              treeValue +
              '-' +
              macValue +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型' //pumpname
            break
          case 'ytGeneral':
            titleText = this.$t('HeaderEdge.secondLevel1_1') //'总貌图'
            break
          case 'ytFocus':
            titleText = treeValue + '-' + this.$t('HeaderEdge.secondLevel1_2') //'重点关注'
            break
          case 'ytModel':
          case 'ytMechineModel':
          case 'ytAnalyse':
          case 'ytPunchCard':
            titleText =
              treeValue +
              '-' +
              macValue +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型'
            break
          case 'tyGeneral':
            titleText = this.$t('HeaderEdge.secondLevel1_1') //'总貌图'
            break
          case 'tyFocus':
            titleText = treeValue + '-' + this.$t('HeaderEdge.secondLevel1_2') //'重点关注'
            break
          case 'tyModel':
            titleText =
              treeValue +
              '-' +
              macValue +
              '-' +
              this.$t('HeaderEdge.secondLevel1_3') //'设备模型'
            break
        }
      } else {
        this.isShowTitleText = false
      }
      return titleText
    },
    //监听左边导航栏点击，路由跳转
    // 总貌图-设备模型内跳转使用同一个key值调用getPath方法（统一机组的设备模型只存在一张）
    getPath(params, fromOther) {
      console.log(params)
      // 若无传入t_root则从全局取，为了点击用户手册时可以进入相应的组织类型模块
      if (params.t_root === undefined && params.t_root === null) {
        params.t_root = this.$store.state.checkMsg.tree.t_root
      }
      this.$nextTick(() => {
        //head部分的样式改回蓝色
        this.$refs.title.style.background = '#092e55'
        this.$parent.$el.getElementsByClassName(
          'my-center-content'
        )[0].style.background = '#092e55'
      })
      /* 添加的路由 */
      let routerName = params.name
      let requiredPosName = [
        'history',
        'wave',
        'dip',
        'overturn',
        'scatter',
        'dashboard',
      ]
      let val
      const [, name, macId, posId, posType] = params.key.split('_')
      if (fromOther) {
        // 从别的图谱跳转过来的
        val = params.val
        // 报警跳转时
        if (params.name == 'alarm' && params.val == this.$t('HeaderEdge.secondLevel5_1')) {//报警日志
          if (
            this.$store.state.checkMsg.pos &&
            this.$store.state.checkMsg.mac
          ) {
            val =
              this.$store.state.checkMsg.mac.name +
              '-' +
              this.$store.state.checkMsg.pos.position_name +
              '-' +
              params.val
          } else if (this.$store.state.checkMsg.mac) {
            val = this.$store.state.checkMsg.mac.name + '-' + params.val
          } else if (this.tree.val) {
            val = this.tree.val + '-' + params.val
          } else {
            val = params.val
          }
        }
      } else if (
        routerName === 'alarm' &&
        params.val.indexOf(this.$t('HeaderEdge.secondLevel5_1')) >= 0
      ) {
        params.val = this.$t('HeaderEdge.secondLevel5_1')//'报警日志'
        if (this.pos.val && this.mac.val) {
          val = this.mac.val + '-' + this.pos.val + '-' + params.val
        } else if (this.mac.val) {
          val = this.mac.val + '-' + params.val
        } else if (this.tree.val) {
          val = this.tree.val + '-' + params.val
        } else {
          val = params.val
        }
      } else if (routerName === 'railCorrugation') {
        val = this.mac.gjMacName + '-' + params.val
      } else if (
        routerName === 'server' ||
        routerName === 'census' ||
        routerName === 'realAlarm' ||
        routerName === 'userManual' ||
        routerName === 'treadData' ||
        routerName === 'wearTrend' ||
        routerName === 'lifePredict'
      ) {
        val = params.val
      } else if (requiredPosName.includes(routerName)) {
        val = this.mac.val + '-' + this.pos.val + '-' + params.val
      } else if (
        routerName === 'realSummary' ||
        routerName === 'equipmentParameters'
      ) {
        val = params.val
      } else {
        val = this.mac.val + '-' + params.val
      }
      let key = params.key
      let icon = params.icon
      // 获取总貌图标题
      let generalTitle = this.changeTitleText(routerName, key)
      // 是否只能由测点打开
      let tabFlag = false // 标记是否已经存在该标签
      let flag = 0
      this.tab_list.forEach((item) => {
        item.isActivity = false
        /* 判断是否已经存在该标签，同一个测点同一个图谱只能开一次 */
        if (item.key == key) {
          item.isActivity = true
          tabFlag = true //存在该标签，将该标签激活
          flag = 1 //切换
          // 防止选项中的name未更换导致循环判断不停止
          let chooseTitle = cloneObj(item)
          // 判断切换设备模型是否存在已跳转其他页面，有则跳转至GeneralModel相应保存router页没有则正常跳转至模型页
          if (this.generalOnlyMac.indexOf(routerName) !== -1) {
            // 若保存router != 设备模型则判断为新开页面
            if (
              this.$store.state.GeneralModel[key] &&
              routerName != this.$store.state.GeneralModel[key]
            ) {
              let fdModelItem = [
                'fdanchorbolt' /* 风电锚栓 */,
                'fdbasics' /* 风电基础 */,
                'fdbolt' /* 风电螺栓 */,
                'fddrivechain' /* 风电传动链 */,
                'fdimpeller' /* 风电叶轮 */,
                'fdoil' /* 风电油液 */,
                'fdtowerdrum' /* 风电塔筒 */,
              ]
              let ytModelItem = [
                'ytMechineModel' /* 油田设备模型 */,
                'ytAnalyse' /* 油田沉没度分析 */,
                'ytPunchCard' /* 油田沉没度分析 */,
              ]
              let snModelItem = [
                'snMechineModel' /* 水泥、煤炭设备模型 */,
                'snVib' /* 水泥、煤炭测点列表 */,
                'snOil' /* 水泥、煤炭模型油液参数 */,
                'snTowerdrum' /* 水泥、煤炭模型倾角 */,
              ]
              // 若进入风电部件模型页都首先进入fdModelitem，防止风电model的切换小标题错乱
              if (
                fdModelItem.indexOf(this.$store.state.GeneralModel[key]) !== -1
              ) {
                routerName = 'fdModelitem'
              } else if (
                ytModelItem.indexOf(this.$store.state.GeneralModel[key]) !== -1
              ) {
                routerName = 'ytModel'
              } else if (
                snModelItem.indexOf(this.$store.state.GeneralModel[key]) !== -1
              ) {
                routerName = 'snModel'
              }
              if (
                routerName != 'fdModelitem' &&
                routerName != 'ytModel' &&
                routerName != 'snModel'
              ) {
                routerName = this.$store.state.GeneralModel[key]
              }
              flag = 0
            }
          }
          if (
            this.generalOnlyMac.indexOf(routerName) !== -1 ||
            this.generalOnlyTree.indexOf(routerName) !== -1
          ) {
            item.generalTitle = generalTitle
            chooseTitle.generalTitle = generalTitle
          }
          chooseTitle.name = routerName
          //当前选中标签存入全局store
          this.$store.commit('setChooseTitle', chooseTitle)
          if (fromOther) {
            this.sendRouteToStore(key, routerName, 4)
          } else {
            this.sendRouteToStore(key, routerName, flag)
          }
        }
      })
      if (!tabFlag) {
        let tab = {
          name: routerName,
          isActivity: true,
          key,
          value: params.val,
          val: val,
          icon: icon,
          t_root: params.t_root,
        }
        if (
          this.generalOnlyMac.indexOf(routerName) !== -1 ||
          this.generalOnlyTree.indexOf(routerName) !== -1
        ) {
          tab.generalTitle = generalTitle
        }
        this.tab_list.push(tab)
        //当前选中标签存入全局store
        this.$store.commit('setChooseTitle', {
          name: routerName,
          isActivity: true,
          key,
          val: val,
          icon: icon,
        })
        this.sendRouteToStore(key, routerName, 0)
      }
      /* 路由跳转 */
      // 若跳转手册则增加判断是否存在指定跳转章节
      if (params.name === 'userManual' && params.toPart) {
        this.$router.push({
          name: params.name,
          query: { toPart: params.toPart, t_root: params.t_root },
        })
      } else {
        this.$router.push({
          name: routerName,
        })
      }
    },
    // 切换标签滚动标签栏
    scrollLabel(type = 0) {
      this.$nextTick(() => {
        if (type === 0) {
          var liArr = event.target.parentElement.parentElement.parentElement
          // 获取当前点击元素的宽度
          var itemWidth = this.offsetWidth
          // 当前事件对象相对移动的距离
          var moveX = event.pageX
          // 目标居中的距离 = (当前元素距离左边的相对距离 / 2)+ (视口距离 / 2)
          liArr.scrollLeft =
            moveX - liArr.clientWidth / 2 + event.target.clientWidth / 2
        } else {
          var liArr = document.getElementsByClassName('head-List')[0]
          liArr.scrollLeft =
            document.getElementsByClassName('head_list_ul')[0].clientWidth
        }
      })
    },
    /* 标签删除 */
    closeTab(index, item) {
      /* 1、关闭当前标签 */
      this.tab_list.splice(index, 1)
      /* 关闭的是当前标签需要跳转 */
      /* 关闭当前标签 */
      this.sendRouteToStore(item.key, item.name, 2)
      //当删除页面时，删除存储的跳转页面
      if (this.$store.state.GeneralModel[item.key]) {
        this.$store.commit('delGeneralModel', item.key)
      }
      if (item.isActivity) {
        /* 2、页面跳转 */
        /* 跳到后一个标签 */
        if (this.tab_list.length === 0) {
          /* 没有标签跳转到首页 */
          this.$router.push({ name: 'empty' })
        } else {
          let route = this.tab_list[index]
          if (!route) {
            /* 如果不存在后一个标签 */
            route = this.tab_list[index - 1]
          }
          this.getPath({
            name: route.name,
            val: route.val,
            key: route.key,
            t_root: route.t_root,
          })
        }
      }
    },
    rightClick(e) {
      let text = [{ type: 'delAll', val: this.$t('HeaderEdge.closeTabsTips') }] //'关闭所有标签'
      const size = e.currentTarget.getBoundingClientRect()
      this.$list({
        text,
        pattern: {
          maxHeight: '400px',
          width: `110px`,
          left: `${size.left + 50}px`,
          top: `${size.top + size.height}px`,
        },
      }).then((res) => {
        if (res.item) {
          if (res.item.type === 'delAll') {
            /* 关闭所有标签 */ /* 没有关闭实例暂时不去做 */
            this.tab_list.forEach((item, index) => {
              this.sendRouteToStore(item.key, item.name, 2)
            })
            this.tab_list = []
            this.$router.push({ name: 'empty' })
          }
        }
      })
    },
    /* 路由信息的发送 */
    sendRouteToStore(key, type, state) {
      this.$store.commit('changeType', {
        key,
        type,
        state, //0:增加。1:切换，2:删除，3:删除+切换, 4:图表跳转图谱
      })
    },
    // 鼠标点击滚动轴关闭标签
    closeTabByMiddle(e, index, item) {
      if (e.button == 1) {
        this.closeTab(index, item)
      }
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
    // 获取所有组织报警
    getAllAlarm(treeMsg) {
      this.$getApi.queryAllAlarmPosition(treeMsg).then((res) => {
        if (res) {
          if (res && res.positionList && res.positionList.length > 0) {
            this.alarmData.data = res.positionList
            this.alarmData.length = res.positionList.length
          }

          if (this.alarmData.length > 0) {
            this.isBlingIcon = true
            if (!this.context) {
              this.context = new (window.AudioContext ||
                window.webkitAudioContext)()
              this.loadAudioFile('alarm.mp3')
            } else {
              this.playSound()
            }
          }
        }
        this.$store.commit('setRealAlarm', this.alarmData.data)
      })
    },
    // 播放音乐
    playSound() {
      this.stopSound()
      this.audio = this.context.createBufferSource()
      this.audio.buffer = this.audioBuffer
      this.audio.loop = true //循环播放
      this.audio.connect(this.context.destination)
      this.audio.start(0) //立即播放
      this.isShowIcon = false
    },
    // 停止播放
    stopSound() {
      if (this.audio) {
        this.audio.stop(0) //立即停止
      }
    },
    // 请求音频文件
    loadAudioFile(url) {
      var xhr = new XMLHttpRequest() //通过XHR下载音频文件
      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = (e) => {
        //下载完成
        this.initSound(e.target.response)
      }
      xhr.send()
    },
    // 加载声音
    initSound(arrayBuffer) {
      this.context.decodeAudioData(
        arrayBuffer,
        (buffer) => {
          //解码成功时的回调函数
          this.audioBuffer = buffer
          // this.playSound()
          // 如果能够自动播放
          if (audioInfo.autoplay) {
            this.playSound()
          } else {
            this.isShowIcon = true
          }
          // 支持用户点击声音图标自行播放
          // $('.audio-icon').on('click', function () {
          //   this.playSound()
          // })
        },
        (e) => {
          //解码出错时的回调函数
          console.log('Error decoding file', e)
        }
      )
    },
    // 进入实时数据报警
    goRealAlarm() {
      this.stopSound()
      this.isBlingIcon = false
      // this.autoplay = ''
      // this.$refs.audio.pause()
      if (this.alarmData.length > 0) {
        let params = {
          key: 'realAlarm',
          name: 'realAlarm',
          val: this.$t('HeaderEdge.goRealAlarmTitle'), //'实时报警日志',
          icon: 'icon-shishibaojingtubiao_huaban1',
        }
        this.$bus.$emit('getPath', params)
      }
    },
    //点击全屏
    showMax() {
      this.isMax = !this.isMax
      if (this.isMax) {
        this.fullScreen()
      } else {
        this.exitFullScreen()
      }
    },
    //关闭全屏
    exitFullScreen(el) {
      var el = document
      var cfs =
        el.cancelFullScreen ||
        el.mozCancelFullScreen ||
        el.msExitFullscreen ||
        el.webkitExitFullscreen ||
        el.exitFullscreen
      if (cfs) {
        cfs.call(el)
        return
      } else if (typeof window.ActiveXObject !== 'undefined') {
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript != null) {
          wscript.SendKeys('{F11}')
        }
      } else {
        alert(this.$t('HeaderEdge.browserTips')) //'浏览器不支持全屏API或已被禁用'
      }
    },
    //打开全屏
    fullScreen() {
      var el = document.documentElement
      var rfs =
        el.requestFullScreen ||
        el.webkitRequestFullScreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullScreen
      if (typeof rfs != 'undefined' && rfs) {
        rfs.call(el)
      } else if (typeof window.ActiveXObject != 'undefined') {
        var wscript = new ActiveXObject('WScript.Shell')
        if (wscript != null) {
          wscript.SendKeys('{F11}')
        }
      }
      console.log(rfs)
    },
    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      var isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    goUserManual(item) {
      console.log(item)
      let params = {
        key: 'userManual',
        name: 'userManual',
        val: this.$t('HeaderEdge.secondLevel5_4'), //'使用手册',
        icon: 'icon-icon-test',
        toPart: item.value /* 跳转手册的item.valu部分 */,
        t_root: item.t_root,
      }
      this.$bus.$emit('getPath', params)
    },
  },
  created() {
    this.$bus.$on('generalRouting', this.generalRouting)
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
        item.isAll = false
      })
    })
    const treeMsg = {
      t_ids: JSON.parse(sessionStorage.getItem('tree')),
    }
    // 实时报警
    this.audioAlarm = sessionStorage.getItem('audioAlarm') === 'true'
    if (this.audioAlarm === true) {
      let fn = () => {
        this.getAllAlarm(treeMsg)
        return fn
      }
      clearInterval(this.alarmData.timer)
      this.alarmData.timer = setInterval(fn(), 600000) //十分钟请求一次
    }
    /* 监听左侧的路由 */
    this.$bus.$on('getPath', this.getPath)
    // 监听选项卡超出范围后滚动显示
    this.$bus.$on('scrollLabel', this.scrollLabel)
  },
  mounted() {
    let dom = document.getElementsByClassName('head-List')[0]
    dom.addEventListener('mousewheel', (e) => {
      dom.scrollLeft -= e.wheelDelta
    })
    audioInfo.init()
    //监听键盘按键事件
    let that = this
    this.$nextTick(function () {
      window.onresize = function () {
        if (!that.checkFull()) {
          // 退出全屏后要执行的动作
          that.isMax = false
          console.log('退出全屏')
        }
      }
    })
  },
  beforeDestroy() {
    this.$bus.$off('getPath', this.getPath)
    this.$bus.$off('scrollLabel', this.scrollLabel)
  },
  watch: {
    /* 监听组织的变化 ,总貌图显示风电、水泥、轨交,如果不是当前类型的总貌图，跳转到当前的界面*/
    '$store.state.checkMsg.tree': {
      handler(value, oldValue) {
        if (value) {
          if (oldValue && value.t_id === oldValue.t_id) return
          this.tree.val = value.t_name
          this.tree.msg = value
          let currentRouteName = this.$route.name
          let routePath = this.$route.path
          for (let i = 0; i < this.secondLevel.length; i++) {
            if (i === 1 || i === 2 || i === 3 || i === 4) {
              this.secondLevel[i].forEach((item) => {
                item.isShow = true
              })
            }
          }
          /*水泥 */
          if (value.t_root == 1) {
            /* 包含了 */
            // this.watchTree(1, currentRouteName, routePath)
            this.generalflag = 1
          } else if (value.t_root == 2) {
            /* 轨交 */
            // this.watchTree(2, currentRouteName, routePath)
            this.generalflag = 2
          } else if (value.t_root == 3) {
            // this.watchTree(3, currentRouteName, routePath)
            this.generalflag = 3
          } else if (value.t_root == 0) {
            // 风电，其他
            // this.watchTree(0, currentRouteName, routePath)
            this.generalflag = 0
          } else {
            // this.watchTree(-1, currentRouteName, routePath)
            this.generalflag = -1
          }
          for (let j = 0; j < this.firstLevel.length; j++) {
            if (j === 2) {
              const item = this.firstLevel[j]
              this.firstLevel[j] = this.titleControl(item, value.t_root)
            }
          }
          for (let i = 0; i < this.secondLevel.length; i++) {
            if (i === 1 || i === 2 || i === 3 || i === 4) {
              this.secondLevel[i].forEach((item) => {
                item = this.titleControl(item, value.t_root)
              })
            }
          }
          // this.changeTitleText()
        } else {
          this.tree.val = ''
          this.tree.msg = null
        }
      },
      deep: true,
      immediate: true,
    },
    /* 监听选中的组织 */
    '$store.state.checkMsg.mac': {
      handler(newValue, oldValue) {
        if (newValue) {
          /* 重复选择机组的时候，不直接return */
          if (oldValue) {
            if (newValue.pump_id) {
              if (newValue.pump_id === oldValue.pump_id) return
            } else if (newValue.mac_id === oldValue.mac_id) {
              return
            }
          }
          /* 获取参数 */
          this.mac.val = newValue.mac_me || newValue.pump_name
          this.mac.msg = cloneObj(newValue, true)
          this.mac.gjMacName = this.mac.msg.mac_name
          /* 重复选择机组的时候，不直接return */
        } else {
          this.mac.val = ''
          this.mac.msg = null
        }
      },
      deep: true,
      immediate: true,
    },
    $route: function (newVal) {
      // this.changeTitleText()
    },
    /* 监听选中的测点 */
    '$store.state.checkMsg.pos': {
      handler(value) {
        if (value != null) {
          // this.choosePos(value)
          this.pos.val = value.name
          this.pos.msg = value
          // this.changeTitleText()
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
  },
}
</script>

<style scoped lang="scss">
.my-head-content {
  display: grid;
  grid-template-rows: 50px;
  user-select: none;
  .title-search {
    margin: 15px 0;
    padding-left: 20px;
    position: relative;
    .out-btn {
      position: absolute;
      padding: 0 4px;
      height: 24px;
      border: 1px solid #ffffff;
      border-radius: 4px;
      top: -2px;
      right: 20px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 21px;
      cursor: pointer;
      &:hover,
      &:focus {
        background: #fff;
        border: 1px solid #fff;
        color: #000;
      }
    }
    .max-btn {
      position: absolute;
      top: -2px;
      right: 100px;
      color: #90bff0;
      text-align: center;
      line-height: 21px;
      cursor: pointer;
      .iconfont {
        font-size: 18px;
      }
    }
    .iconList {
      position: absolute;
      top: -2px;
      right: 130px;
      color: #90bff0;
      text-align: center;
      line-height: 21px;
      cursor: pointer;
      .iconfont {
        font-size: 23px;
      }
      .alarm-number {
        width: 15px;
        height: 15px;
        background: #f80000;
        border-radius: 50%;
        position: relative;
        top: -26px;
        left: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          color: #fff;
          font-size: 12px;
        }
      }
      .blingbling {
        animation: scaleout 1s infinite ease-in-out;
        @-webkit-keyframes scaleout {
          30% {
            -webkit-transform: scale(0);
          }
          100% {
            -webkit-transform: scale(0);
            opacity: 0;
          }
        }
        @keyframes scaleout {
          30% {
            transform: scale(0);
            -webkit-transform: scale(0);
          }
          100% {
            transform: scale(0);
            -webkit-transform: scale(0);
            opacity: 0;
          }
        }
      }
    }
    .iconList-a {
      color: #f80000;
    }
    .iconList-bling {
      animation: scaleout 1s infinite ease-in-out;
      @-webkit-keyframes scaleout {
        30% {
          -webkit-transform: scale(0);
        }
        100% {
          -webkit-transform: scale(0);
          opacity: 0;
        }
      }
      @keyframes scaleout {
        30% {
          transform: scale(0);
          -webkit-transform: scale(0);
        }
        100% {
          transform: scale(0);
          -webkit-transform: scale(0);
          opacity: 0;
        }
      }
    }
  }
  .title {
    // padding-left: 20px;
    position: relative;
    ::-webkit-scrollbar {
      display: none;
    }
    .title-text {
      position: absolute;
      top: 42px;
      height: 30px;
      line-height: 30px;
      font-size: 30px;
      margin-left: 40px;
      z-index: 3;
      font-family: Source Han Sans CN;
    }
    .head-List {
      overflow-y: auto;
      width: calc(100vw - 250px);
      @media screen and (max-width: 1366px) {
        width: calc(100vw - 200px);
      }
      height: 30px;
      ::-webkit-scrollbar {
        display: none;
      }
      .head_list_ul {
        display: flex;
        padding-left: 20px;
        .head_tab_li {
          position: relative;
          display: flex;
          padding: 0 5px;
          margin-right: 2px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          background: #001327;
          & > div {
            overflow: hidden;
            padding-left: 10px;
            display: inline-block;
            height: 30px;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 40px;
          }
          .icon-cuohao {
            position: absolute;
            right: 6px;
            -webkit-transform: scale(0.75);
            transform: scale(0.75);
          }
          .icon-zhineng {
            font-size: 16px;
            position: absolute;
            right: 20px;
          }
          &.activity {
            background: #053f7b;
          }
        }
      }
    }
  }
}
.iconfont_self {
  font-family: 'iconfont' !important;
  font-size: 9px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.general-view-screen {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  .title1-li {
    width: 220px;
    font-size: 18px;
    line-height: 50px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .title1-item {
      display: flex;
      width: 200px;
      height: 100%;
      flex-direction: row;
      align-items: center;
      padding: 0px 15px;
      & > .iconfont:nth-child(1) {
        padding-right: 10px;
      }
      // & > div {
      //   display: inline-block;
      //   width: 90px;
      // }
    }
    &:hover {
      .title1-item {
        background: #173973;
        width: 200px;
        height: 100%;
      }
      .title1-division {
        display: flex;
        justify-content: center;
        width: 120px;
      }
    }
    .seconde-ul {
      z-index: 999;
      position: absolute;
      top: 50px;
      right: 10px;
      width: 200px;
      background: #081d3b;
      border-radius: 4px;
      box-shadow: 0px 2px 4px 3px rgba(145, 144, 144, 0.24);
      border: 1px solid #4090f6;

      .title2-li {
        height: 40px;
        font-size: 15px;
        line-height: 20px;
        padding-left: 15px;
        display: flex;
        // justify-content: center; // 内容自适应：上下居中
        align-items: center; // 子项对齐方式：左右居中
        /*margin-left: 10px;*/
        // i {
        //   padding-left: 20px;
        // }
        & > div {
          width: 140px;
          margin-left: 10px;
          font-size: 14px;
        }
        &:hover,
        &:focus {
          background: #007eff;
        }
      }
    }
  }
}

//下拉框样式
/* .general-view-screen {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  .view-screen {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .select-box {
      position: relative;
      border-radius: 5px;
      border: none;
      height: 26px;
      line-height: 26px;
      margin-right: 40px;
      background: rgb(12, 78, 153) !important;
      input {
        width: 210px;
        border: none;
        background: rgb(12, 78, 153) !important;
        padding-left: 10px;
        margin-right: 5px;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        position: absolute;
        right: 10px;
        top: 0;
        font-size: 10px;
      }
    }
  }
  .view-screen-f {
    font-size: 14px;
    margin: 0px 10px;
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
  .view-screen-collect {
    display: flex;
    flex-direction: row;
    margin-left: 80px;
  }

  input::-webkit-input-placeholder {
    color: #6eacec;
  }
  input::-moz-input-placeholder {
    color: #6eacec;
  }
  input::-ms-input-placeholder {
    color: #6eacec;
  }
} */
@media screen and (max-width: 1366px) {
  .my-head-content .title .title-text {
    font-size: 20px;
  }
  .general-view-screen {
    .view-screen {
      .select-box {
        margin-right: 20px;
        input {
          width: 148px;
          padding-right: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
