<!-- 头部 -->
<template>
  <div class="my-header-content select-none">
    <div class="my-header">
      <ul class="header-list">
        <li
          class="text-overflow select-none"
          ref="headList"
          @click.stop="setListMsg(item, idx, $event)"
          v-for="(item, idx) in currentHeadList"
          :key="idx"
          :title="item.name"
          :style="getMargin()"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="logo-icon">
        <img
          src="../../assets/images/logoTop.png"
          alt=""
        />
        <i
          @click="goBack"
          class="iconfont icon-tuichu"
          title="退出系统"
        ></i>
      </div>
    </div>
    <div class="custom-shortcut">
      <div class="chart-list-icon">
        <i
          ref="iconBtn"
          v-for="(item, index) in userIcon"
          :key="index"
          class="iconfont"
          :class="item.class + ' ' + item.isUse"
          @click="getChart(item, 0)"
          :title="item.val"
        ></i>
      </div>
      <div
        class="set-icon"
        @click="openSetIcon"
      >自定义</div>
    </div>
    <ul class="my-tab">
      <li
        v-for="(item, key, index) in tabMsg"
        :key="index"
        :title="item.name"
        :class="item.class"
        class="title-tab"
        @mousedown="closeTab0($event, key)"
      >
        <i
          v-show="index > 0"
          class="vertical-line"
        ></i>
        <div
          class="text-overflow select-none"
          @click.stop="choiceChartType(key)"
        >
          {{ item.name }}
        </div>
        <i
          class="close-box iconfont icon-cuohao"
          @click="closeTab(key)"
        ></i>
      </li>
      <i
        class="show-all-tab iconfont icon-zhongzi-zhankai"
        title="显示所有标题"
        @click="showAllTitle"
        v-show="Object.keys(tabMsg).length > 0"
      ></i>
      <i
        class="close-tab iconfont icon-zhongzi-guanbi"
        @click="closeTabAll"
        title="关闭全部"
        v-show="Object.keys(tabMsg).length > 0"
      ></i>
    </ul>
    <div
      class="set-user-icon"
      v-show="setUserIcon.isShow"
      ref="setUserIconBg"
    >
      <div
        class="user-icon box-shadow"
        ref="setUserIcon"
      >
        <div
          class="user-icon-title"
          @mousedown="dragElem(1, $event)"
          @mouseup="dragElem(0, $event)"
        >
          <span>自定义</span>
          <span
            class="close-custom-icon"
            @click="closeCustom(0)"
          ><i class="iconfont icon-cuohao close-box"></i></span>
        </div>
        <div class="select-user-icon">
          <div class="no-choice">
            <div class="no-choice-title">
              未选择
            </div>
            <ul
              class="no-choice-list radius hide-scroll"
              @drop="addIcon('noChoice', $event)"
              @dragover.prevent
            >
              <li
                v-for="(icon, index) in setUserIcon.noChoice"
                :key="index"
                draggable="true"
                @dragstart="dragIcon(icon, 'noChoice', $event)"
              >
                <i :class="'iconfont ' + icon.class"></i>
                <div>{{ icon.val }}</div>
              </li>
            </ul>
          </div>
          <div class="choice-icon">
            <div class="choice-icon-title">
              已选择
            </div>
            <ul
              class="choice-icon-list radius hide-scroll"
              @drop="addIcon('choice', $event)"
              @dragover.prevent
            >
              <li
                v-for="(icon, index) in setUserIcon.choice"
                :key="index"
                draggable="true"
                @dragstart="dragIcon(icon, 'choice', $event)"
              >
                <i :class="'iconfont ' + icon.class"></i>
                <div>{{ icon.val }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="set-user-icon-btn">
          <button
            class="long-btn"
            @click="choiceAll"
          >选择全部</button>
          <button @click="closeCustom(1)">确定</button>
          <button
            class="disable-btn"
            @click="closeCustom(0)"
          >取消</button>
          <button
            class="long-btn"
            @click="restoreDefault"
          >恢复默认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import { cloneObj } from 'utils/utils.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: [],
  data() {
    return {
      currentHeadList: [] /* 头部菜单显示信息 */,
      headList: {
        '-1':[
          /* 通用 */
          {
            name: '基本图谱',
            listMsg: [
              {
                val: '趋势图',
                icon: 'icon-qushitu_huaban1',
                key: 'trend',
                isUse: 'disabled-icon',
                type: [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  16,
                  17,
                ],
              },
              {
                val: '波形频谱图',
                icon: 'icon-boxing_huaban',
                key: 'wave',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200, 14, 15, 16, 17],
              },
              {
                val: '对比分析图',
                icon: 'icon-duibifenxitu_huaban',
                key: 'compare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
              {
                val: '机组对比分析图',
                icon: 'icon-duibifenxitu',
                key: 'macCompare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
              {
                val: '三维频谱图',
                icon: 'icon-sanweipinputu_huaban',
                key: 'wave3d',
                isUse: 'disabled-icon',
                type: [3, 4, 6, 8, 9, 12, 16],
              },
              {
                key: 'spectrum',
                icon: 'icon-zhuanjiapinpu_huaban',
                val: '专家频谱图',
                isUse: 'disabled-icon',
                type: [3],
              },
              {
                key: 'dip1',
                icon: 'icon-qingjiaofenbutu_huaban_huaban',
                val: '倾角分布图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                key: 'dip2',
                icon: 'icon-chenjianggenzongtu_huaban',
                val: '沉降跟踪图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                key: 'overturn',
                icon: 'icon-jicangguijitu',
                val: '机舱轨迹图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                val: '散点图',
                icon: 'icon-sandiantu_huaban',
                key: 'scatter',
                isUse: 'disabled-icon',
                type: [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  200,
                  15,
                  16,
                  17,
                ],
              },
              {
                val: '圆周图',
                icon: 'icon-yuanzhoutu_huaban',
                key: 'circle',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
            ],
          },
          {
            name: '数据列表',
            listMsg: [
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
                key: 'monitor',
                icon: 'icon-jiancebaobiao_huaban_huaban',
                val: '监测报表',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '统计列表',
                icon: 'icon-tongjiliebiao_huaban',
                key: 'census',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
            ],
          },
          {
            name: '记录日志',
            listMsg: [
              {
                key: 'alarm',
                icon: 'icon-baojing_huaban',
                val: '报警日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              /* {key: 'alarmProcessing', icon: 'icon-baojingchulirizhi_huaban', val: '报警处理日志', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, */
              {
                key: 'system',
                icon: 'icon-xitongrizhi_',
                val: '系统日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                key: 'maintain',
                icon: 'icon-shebei',
                val: '设备维护记录',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              {
                key: 'server',
                icon: 'icon-fuwuqi',
                val: '服务器信息',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
            ],
          },
          {
            name: '系统工具',
            listMsg: [
              {
                key: 'export',
                icon: 'icon-baogaodaochugongju_huaban1',
                val: '报告导出工具',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              // {key: 'use', icon: 'icon-', val: '使用手册', isUse: 'disabled-icon'},
            ],
          },
        ],
        '0': [
          /* 风电 */
          {
            name: '基本图谱',
            listMsg: [
              {
                val: '趋势图',
                icon: 'icon-qushitu_huaban1',
                key: 'trend',
                isUse: 'disabled-icon',
                type: [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  16,
                  17,
                ],
              },
              {
                val: '波形频谱图',
                icon: 'icon-boxing_huaban',
                key: 'wave',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200, 14, 15, 16, 17],
              },
              {
                val: '对比分析图',
                icon: 'icon-duibifenxitu_huaban',
                key: 'compare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
              {
                val: '机组对比分析图',
                icon: 'icon-duibifenxitu',
                key: 'macCompare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
              {
                val: '三维频谱图',
                icon: 'icon-sanweipinputu_huaban',
                key: 'wave3d',
                isUse: 'disabled-icon',
                type: [3, 4, 6, 8, 9, 12, 16],
              },
              {
                key: 'spectrum',
                icon: 'icon-zhuanjiapinpu_huaban',
                val: '专家频谱图',
                isUse: 'disabled-icon',
                type: [3],
              },
              {
                key: 'dip1',
                icon: 'icon-qingjiaofenbutu_huaban_huaban',
                val: '倾角分布图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                key: 'dip2',
                icon: 'icon-chenjianggenzongtu_huaban',
                val: '沉降跟踪图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                key: 'overturn',
                icon: 'icon-jicangguijitu',
                val: '机舱轨迹图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                val: '散点图',
                icon: 'icon-sandiantu_huaban',
                key: 'scatter',
                isUse: 'disabled-icon',
                type: [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  200,
                  15,
                  16,
                  17,
                ],
              },
              {
                val: '圆周图',
                icon: 'icon-yuanzhoutu_huaban',
                key: 'circle',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
            ],
          },
          {
            name: '数据列表',
            listMsg: [
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
                key: 'monitor',
                icon: 'icon-jiancebaobiao_huaban_huaban',
                val: '监测报表',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '统计列表',
                icon: 'icon-tongjiliebiao_huaban',
                key: 'census',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
            ],
          },
          {
            name: '记录日志',
            listMsg: [
              {
                key: 'alarm',
                icon: 'icon-baojing_huaban',
                val: '报警日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              /* {key: 'alarmProcessing', icon: 'icon-baojingchulirizhi_huaban', val: '报警处理日志', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, */
              {
                key: 'system',
                icon: 'icon-xitongrizhi_',
                val: '系统日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                key: 'maintain',
                icon: 'icon-shebei',
                val: '设备维护记录',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              {
                key: 'server',
                icon: 'icon-fuwuqi',
                val: '服务器信息',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
            ],
          },
          {
            name: '系统工具',
            listMsg: [
              {
                key: 'export',
                icon: 'icon-baogaodaochugongju_huaban1',
                val: '报告导出工具',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              // {key: 'use', icon: 'icon-', val: '使用手册', isUse: 'disabled-icon'},
            ],
          },
        ],
        '1': [
          /* 水泥 */
          {
            name: '基本图谱',
            listMsg: [
              {
                val: '趋势图',
                icon: 'icon-qushitu_huaban1',
                key: 'trend',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '波形频谱图',
                icon: 'icon-boxing_huaban',
                key: 'wave',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200, 14],
              },
              {
                val: '对比分析图',
                icon: 'icon-duibifenxitu_huaban',
                key: 'compare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
              {
                val: '机组对比分析图',
                icon: 'icon-duibifenxitu',
                key: 'macCompare',
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
                key: 'spectrum',
                icon: 'icon-zhuanjiapinpu_huaban',
                val: '专家频谱图',
                isUse: 'disabled-icon',
                type: [3],
              },
              {
                key: 'dip1',
                icon: 'icon-qingjiaofenbutu_huaban_huaban',
                val: '倾角分布图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                key: 'dip2',
                icon: 'icon-chenjianggenzongtu_huaban',
                val: '沉降跟踪图',
                isUse: 'disabled-icon',
                type: [13],
              },
              {
                key: 'overturn',
                class: 'icon-jicangguijitu',
                val: '机舱轨迹图',
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
                key: 'compare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
            ],
          },
          {
            name: '数据列表',
            listMsg: [
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
                key: 'monitor',
                icon: 'icon-jiancebaobiao_huaban_huaban',
                val: '监测报表',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '统计列表',
                icon: 'icon-tongjiliebiao_huaban',
                key: 'census',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
            ],
          },
          {
            name: '记录日志',
            listMsg: [
              {
                key: 'alarm',
                icon: 'icon-baojing_huaban',
                val: '报警日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              /* {key: 'alarmProcessing', icon: 'icon-baojingchulirizhi_huaban', val: '报警处理日志', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, */
              {
                key: 'system',
                icon: 'icon-xitongrizhi_',
                val: '系统日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                key: 'maintain',
                icon: 'icon-shebei',
                val: '设备维护记录',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              {
                key: 'server',
                icon: 'icon-fuwuqi',
                val: '服务器信息',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
            ],
          },
          {
            name: '系统工具',
            listMsg: [
              {
                key: 'export',
                icon: 'icon-baogaodaochugongju_huaban1',
                val: '报告导出工具',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              // {key: 'use', icon: 'icon-', val: '使用手册', isUse: 'disabled-icon'},
            ],
          },
        ],
        '2': [
          /* 行走部 */
          {
            name: '基本图谱',
            listMsg: [
              {
                val: '趋势图',
                icon: 'icon-qushitu_huaban1',
                key: 'trend',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '波形频谱图',
                icon: 'icon-boxing_huaban',
                key: 'wave',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200, 14, 15, 16, 17],
              },
              {
                val: '对比分析图',
                icon: 'icon-duibifenxitu_huaban',
                key: 'compare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200, 16],
              },
              {
                val: '机组对比分析图',
                icon: 'icon-duibifenxitu',
                key: 'macCompare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200, 16],
              },
              {
                val: '三维频谱图',
                icon: 'icon-sanweipinputu_huaban',
                key: 'wave3d',
                isUse: 'disabled-icon',
                type: [3, 4, 6, 8, 9, 12],
              },
              {
                key: 'spectrum',
                icon: 'icon-zhuanjiapinpu_huaban',
                val: '专家频谱图',
                isUse: 'disabled-icon',
                type: [3],
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
                key: 'compare',
                isUse: 'disabled-icon',
                type: [1, 3, 4, 6, 8, 9, 12, 200],
              },
            ],
          },
          {
            name: '数据列表',
            listMsg: [
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
                key: 'monitor',
                icon: 'icon-jiancebaobiao_huaban_huaban',
                val: '监测报表',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '统计列表',
                icon: 'icon-tongjiliebiao_huaban',
                key: 'census',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
            ],
          },
          {
            name: '记录日志',
            listMsg: [
              {
                key: 'alarm',
                icon: 'icon-baojing_huaban',
                val: '报警日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              /* {key: 'alarmProcessing', icon: 'icon-baojingchulirizhi_huaban', val: '报警处理日志', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, */
              {
                key: 'system',
                icon: 'icon-xitongrizhi_',
                val: '系统日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                key: 'maintain',
                icon: 'icon-shebei',
                val: '设备维护记录',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              {
                key: 'server',
                icon: 'icon-fuwuqi',
                val: '服务器信息',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
            ],
          },
          {
            name: '系统工具',
            listMsg: [
              {
                key: 'export',
                icon: 'icon-baogaodaochugongju_huaban1',
                val: '报告导出工具',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              // {key: 'use', icon: 'icon-', val: '使用手册', isUse: 'disabled-icon'},
            ],
          },
        ] /* 走行部 */,
        '3': [
          /* 油田 */
          {
            name: '基本图谱',
            listMsg: [
              {
                val: '趋势图',
                icon: 'icon-qushitu_huaban1',
                key: 'trend',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '散点图',
                icon: 'icon-sandiantu_huaban',
                key: 'scatter',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
            ],
          },
          {
            name: '数据列表',
            listMsg: [
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
                key: 'monitor',
                icon: 'icon-jiancebaobiao_huaban_huaban',
                val: '监测报表',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                val: '统计列表',
                icon: 'icon-tongjiliebiao_huaban',
                key: 'census',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
            ],
          },
          {
            name: '记录日志',
            listMsg: [
              {
                key: 'alarm',
                icon: 'icon-baojing_huaban',
                val: '报警日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              /* {key: 'alarmProcessing', icon: 'icon-baojingchulirizhi_huaban', val: '报警处理日志', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]}, */
              {
                key: 'system',
                icon: 'icon-xitongrizhi_',
                val: '系统日志',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              },
              {
                key: 'maintain',
                icon: 'icon-shebei',
                val: '设备维护记录',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              {
                key: 'server',
                icon: 'icon-fuwuqi',
                val: '服务器信息',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
            ],
          },
          {
            name: '系统工具',
            listMsg: [
              {
                key: 'export',
                icon: 'icon-baogaodaochugongju_huaban1',
                val: '报告导出工具',
                isUse: 'disabled-icon',
                type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
              },
              // {key: 'use', icon: 'icon-', val: '使用手册', isUse: 'disabled-icon'},
            ],
          },
        ] /* 油田 */,
      },
      chooseHead: -1 /* 当前打开菜单索引 */,
      iconList: [
        {
          key: 'trend',
          class: 'icon-qushitu_huaban1',
          val: '趋势图',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        {
          key: 'wave',
          class: 'icon-boxing_huaban',
          val: '波形频谱图',
          isUse: 'disabled-icon',
          type: [1, 3, 4, 6, 8, 9, 12, 200, 14],
        },
        {
          key: 'compare',
          class: 'icon-duibifenxitu_huaban',
          val: '对比分析图',
          isUse: 'disabled-icon',
          type: [1, 3, 4, 6, 8, 9, 12, 200],
        },
        {
          key: 'macCompare',
          class: 'icon-duibifenxitu',
          val: '机组对比分析图',
          isUse: 'disabled-icon',
          type: [1, 3, 4, 6, 8, 9, 12, 200],
        },
        {
          key: 'wave3d',
          class: 'icon-sanweipinputu_huaban',
          val: '三维频谱图',
          isUse: 'disabled-icon',
          type: [3, 4, 6, 8, 9, 12],
        },
        {
          key: 'spectrum',
          class: 'icon-zhuanjiapinpu_huaban',
          val: '专家频谱图',
          isUse: 'disabled-icon',
          type: [3],
        },
        {
          key: 'dip1',
          class: 'icon-qingjiaofenbutu_huaban_huaban',
          val: '倾角分布图',
          isUse: 'disabled-icon',
          type: [13],
        },
        {
          key: 'dip2',
          class: 'icon-chenjianggenzongtu_huaban',
          val: '沉降跟踪图',
          isUse: 'disabled-icon',
          type: [13],
        },
        {
          key: 'overturn',
          class: 'icon-jicangguijitu',
          val: '机舱轨迹图',
          isUse: 'disabled-icon',
          type: [13],
        },
        {
          val: '散点图',
          class: 'icon-sandiantu_huaban',
          key: 'scatter',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        {
          val: '圆周图',
          class: 'icon-yuanzhoutu_huaban',
          key: 'circle',
          isUse: 'disabled-icon',
          type: [1, 3, 4, 6, 8, 9, 12, 200],
        },
        {
          key: 'real',
          class: 'icon-shishishuju_huaban',
          val: '实时数据列表',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        {
          key: 'history',
          class: 'icon-lishishujuliebiao_huaban',
          val: '历史数据列表',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        {
          key: 'monitor',
          class: 'icon-jiancebaobiao_huaban_huaban',
          val: '监测报表',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        {
          val: '统计列表',
          class: 'icon-tongjiliebiao_huaban',
          key: 'census',
          isUse: 'abled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
        },
        {
          key: 'alarm',
          class: 'icon-baojing_huaban',
          val: '报警日志',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        /* { val: '报警处理日志', class: 'icon-baojingchulirizhi_huaban', key: 'alarmProcessing', isUse: 'disabled-icon', type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], }, */
        {
          val: '系统日志',
          class: 'icon-xitongrizhi_',
          key: 'system',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
        {
          key: 'maintain',
          class: 'icon-shebei',
          val: '设备维护记录',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
        },
        {
          key: 'server',
          class: 'icon-fuwuqi',
          val: '服务器信息',
          isUse: 'abled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
        },
        {
          key: 'export',
          icon: 'icon-baogaodaochugongju_huaban1',
          val: '报告导出工具',
          isUse: 'disabled-icon',
          type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 200],
        },
      ],
      userIcon: [] /* 自定义图标按钮显示 */,
      tabMsg: {} /* tab选项卡 */,
      useKey: [
        /* 组织、机组、测点可用图标 */
        ['alarm', 'server', 'census', 'export'],
        [
          'alarm',
          'monitor',
          'system',
          'server',
          'maintain',
          'census',
          'export',
        ],
        [
          'wave',
          'alarm',
          'real',
          'compare',
          'macCompare',
          'history',
          // 'monitor',
          'trend',
          'wave3d',
          'dip1',
          'dip2',
          'overturn',
          'spectrum',
          'scatter',
          'search',
          'alarmProcessing',
          'system',
          'census',
          'circle',
          'server',
          'maintain',
          'export',
        ],
      ],
      setUserIcon: {
        /* 设置用户自定义图标信息 */
        isShow: false /* 是否显示选择自定义图标弹窗 */,
        defaultIcon: [
          'wave',
          'alarm',
          'real',
          'compare',
          'history',
          'monitor',
          'trend',
          'wave3d',
          'dip1',
          'dip2',
          'overturn',
          'spectrum',
          'scatter',
          'census',
          'alarmProcessing',
          'system',
          'circle',
          'server',
          'maintain',
          'export',
        ] /* 默认显示的图标 */,
        choice: [] /* 已选择图标 */,
        noChoice: [] /* 未选择图标 */,
      },
      dragMsg: {
        /* 拖动弹窗信息 */
        x: 0 /* x偏移量 */,
        y: 0 /* y偏移量 */,
      },
      userMsg: null /* 用户信息 */,
      //打开页面限制规则
      OpenPageRules: [
        { chart: 'wave', name: '波形频谱图', maxOpenPage: 5 }, //波形频谱图
      ],
    }
  },
  watch: {
    '$store.state.checkMsg': {
      handler(value) {
        const icon = this.userIcon
        let list = this.currentHeadList
        const di = 'disabled-icon'
        const ai = 'abled-icon'
        const checkType = value.type
        const msg = value[checkType]
        const useKey = this.useKey
        if (checkType === 'pos') {
          const idx = 2
          const type = msg.position_type
          const posLoc = msg.pos_loc
          for (let val of icon) {
            val.isUse = val.type.includes(type) ? ai : di
            if (type === 13) {
              if (posLoc === '2' && val.val === '倾角分布图') {
                val.isUse = di
              } else if (posLoc !== '2' && val.val === '沉降跟踪图') {
                val.isUse = di
              }
            }
          }
          for (let val of list) {
            val.listMsg.map((v) => {
              if (useKey[idx].includes(v.key) && v.type.includes(type)) {
                v.isUse = ai
              } else {
                v.isUse = di
              }
              if (type === 13) {
                if (posLoc === '2' && v.val === '倾角分布图') {
                  v.isUse = di
                } else if (posLoc !== '2' && v.val === '沉降跟踪图') {
                  v.isUse = di
                }
              }
            })
          }
        } else {
          const idx = checkType === 'tree' ? 0 : 1
          for (let val of icon) {
            if (useKey[idx].includes(val.key)) {
              val.isUse = ai
            } else {
              val.isUse = di
            }
          }
          if (idx === 0) {
            console.log(msg.t_root)
            this.currentHeadList = this.headList[String(msg.t_root)]
            list = this.currentHeadList
          }
          for (let val of list) {
            val.listMsg.map((v) => {
              v.isUse = useKey[idx].includes(v.key) ? ai : di
            })
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    // 退出登录
    goBack() {
      this.$getApi.logout()
      sessionStorage.clear()
      this.$router.push({ path: '/login' })
    },
    // 设置点击头部菜单弹出列表显示信息
    setListMsg(item, idx, e) {
      if (item.listMsg.length > 0) {
        const el = this.$refs.headList
        for (let i = 0, l = el.length; i < l; i++) {
          if (i === idx) {
            el[i].classList.add('checkList')
          } else {
            el[i].classList.remove('checkList')
          }
        }
        const tag = e.currentTarget
        this.chooseHead = idx
        const size = tag.getBoundingClientRect()
        const borderColor =
          document.getElementsByClassName('White-content').length > 0
            ? '#5D87DA'
            : ''
        const style = {
          maxHeight: 'auto',
          width: '150px',
          left: size.left + 'px',
          top: `${size.top + size.height}px`,
          border: `1px solid ${borderColor}`,
        }
        this.$list({
          text: item.listMsg,
          pattern: style,
        }).then((res) => {
          this.$refs.headList[this.chooseHead].classList.remove('checkList')
          if (res.index > -1) {
            this.getChart(res.item)
          }
        })
      }
    },
    // 点击获取头部图标图表信息
    getChart(item) {
      if (item.isUse === 'abled-icon') {
        let flag = '',
          titleName = item.val
        let key = item.key
        if (item.flag) {
          flag = `${key}_${item.flag}`
        } else {
          if (key === 'export') {
            //导出报告：选择弹窗
            this.$beginReport(null)
            return
          } else if (['server', 'census'].includes(key) || key === 'compare') {
            flag = `${key}_${this.$store.state.count[key]}`
            this.$store.commit('addCount', key)
          } else {
            const check = this.$store.state.checkMsg
            const type = check.type
            const msg = check[type]
            /*测点的时候title名字需要加上机组id */
            if (type === 'pos') {
              if (item.key === 'trend') {
                titleName = check['mac'].m_me + '-' + titleName
              } else {
                titleName =
                  check['mac'].m_me + '-' + msg.position_name + '-' + titleName
              }
            } else if (type === 'mac') {
              titleName = msg.m_me + '-' + titleName
            } else if (type === 'tree') {
              titleName = check['tree'].t_name + '-' + titleName
            }
            const useKey = this.useKey
            const dipArr = ['dip1', 'dip2']
            dipArr.includes(key) && (key = 'dip')
            if (type !== '0') {
              if (
                key !== 'alarm' &&
                // key !== 'monitor' &&
                useKey[1].includes(key)
              ) {
                if (type === 'tree') {
                  this.$pop('请选择一个机组')
                  return
                }
                flag = `${key}_mac_${msg.machine_id}`
              } else if (key === 'alarm') {
                if (type === 'pos') {
                  flag = `${key}_pos_${msg.machine_id}_${msg.position_id}_${msg.position_type}`
                } else if (
                  type === 'mac' &&
                  (Number(msg.t_root) == 1 || Number(msg.t_root) == 2)
                ) {
                  flag = `${key}_mac_${msg.machine_id}_${msg.ch_class}` //机泵进入
                } else if (type === 'mac' && Number(msg.t_root) === 0) {
                  flag = `${key}_mac_${msg.machine_id}` //机组进入
                } else if (type === 'tree') {
                  /* 实时数据列表汇总需要用到t_root */
                  flag = `${key}_tree_${msg.t_id}`
                }
              } else {
                const flagArr = {
                  pos: `${key}_pos_${msg.machine_id}_${msg.position_id}_${msg.position_type}`,
                  mac: `${key}_mac_${msg.machine_id}`,
                  tree: `${key}_tree_${msg.t_id}`,
                }
                flag = flagArr[type]
              }
            } else return
          }
        }
        this.choiceChartType(flag, titleName)
      }
    },
    // 判断tab操作类型
    choiceChartType(key, name, titleName, flag = false) {
      let [type] = key.split('_')
      let state
      /* 将选中标签改为未选中状态 */
      for (const k in this.tabMsg) {
        const value = this.tabMsg[k]
        if (value.class !== '') {
          value.class = ''
          break
        }
      }
      if (this.tabMsg[key]) {
        //切换标签
        this.tabMsg[key].class = 'check-tab'
        if (flag) {
          state = 4
        } else {
          state = 1
        }
        flag && (state = `4_${Math.random()}`) //是否属于跳转切换，由其他图谱点击进入
      } else {
        this.$set(this.tabMsg, key, {
          name: titleName || name,
          type: type,
          class: 'check-tab',
        })
        state = 0
      }
      for (let k in this.tabMsg) {
        if (this.tabMsg[k].class === 'check-tab') {
          let item = {
            name: this.tabMsg[k].name,
            key: k,
            type: this.tabMsg[k].type,
          }
          this.$store.commit('setChooseTitle', item)
          break
        }
      }
      this.$store.commit('changeType', {
        key,
        type,
        state,
      })
      this.$router.push({ name: type, params: { key: key } })
    },
    //中键关闭标签
    closeTab0(e, key) {
      if (e.button === 1) {
        this.closeTab(key)
      }
    },
    // 关闭tab选项卡
    closeTab(key) {
      let [type] = key.split('_')
      this.$store.commit('changeType', {
        key,
        type,
        state: 2,
      })
      let len = Object.keys(this.tabMsg).length
      if (len > 1) {
        if (this.tabMsg[key].class === 'check-tab') {
          const tabKeyArr = Object.keys(this.tabMsg)
          const l = tabKeyArr.length
          let index1 = -1
          let index2 = -1
          let checkKey = ''
          for (let i = 0; i < l; i++) {
            const value = tabKeyArr[i]
            if (value === key) {
              index1 = i
            }
            if (this.tabMsg[value].class === 'check-tab') {
              index2 = i
            }
          }
          if (index2 === l - 1) {
            checkKey = tabKeyArr[index2 - 1]
          } else {
            checkKey = tabKeyArr[index2 + 1]
          }
          this.choiceChartType(checkKey)
        }
      } else {
        this.$router.push({ name: 'empty' })
      }
      //  this.OpenPageRules.forEach((rule) => {
      //   if (rule.chart.includes(type)) {
      //     let pageNum = this.$store.state.pageOPen[rule.chart]
      //     let pageparam = {
      //       chart: rule.chart,
      //       page: pageNum,
      //     }
      //     this.$store.commit('reducepageOPen', pageparam) //图谱页面自增
      //   }
      // })
      this.$delete(this.tabMsg, key)
    },
    //显示所有打开页标签
    showAllTitle(e) {
      let tabMsg = []
      for (let k in this.tabMsg) {
        let a = this.tabMsg[k]
        a.val = a.name
        a.key = k
        tabMsg.push(a)
      }
      const size = e.currentTarget.getBoundingClientRect()
      const style = {
        maxHeight: '300px',
        width: '220px',
        left: `${size.left - 200}px`,
        top: size.top + size.height + 'px',
      }
      this.$list({
        text: tabMsg,
        pattern: style,
      }).then((res) => {
        if (res) {
          this.choiceChartType(res.item.key, res.item.name)
        }
      })
    },
    // 关闭所有tab选项卡
    closeTabAll() {
      for (const key in this.tabMsg) {
        this.closeTab(key)
      }
    },
    // 设置外边距
    getMargin() {
      if (document.documentElement.clientWidth < 1000) {
        return 'margin-right: 38px'
      }
    },
    // 打开自定义图标弹窗
    openSetIcon() {
      const noChoice = []
      const iconList = this.iconList
      const choice = cloneObj(this.userIcon, true)
      for (let i = 0, l = iconList.length; i < l; i++) {
        const value = iconList[i]
        let isHas = false
        for (let j = 0, len = choice.length; j < len; j++) {
          const val = choice[j]
          if (value.key === val.key) {
            isHas = true
            break
          }
        }
        if (!isHas) {
          noChoice.push(cloneObj(value, true))
        }
      }
      const setIcon = this.setUserIcon
      setIcon.isShow = true
      setIcon.choice = choice
      setIcon.noChoice = noChoice
    },
    // 选择全部图标
    choiceAll() {
      const setIcon = this.setUserIcon
      setIcon.isShow = true
      setIcon.choice = cloneObj(this.iconList, true)
      setIcon.noChoice = []
    },
    // 恢复默认
    restoreDefault() {
      const setIcon = this.setUserIcon
      const di = setIcon.defaultIcon
      const iconList = this.iconList
      const choice = []
      const noChoice = []
      for (let i = 0, l = iconList.length; i < l; i++) {
        const value = iconList[i]
        if (di.includes(value.key)) {
          choice.push(cloneObj(value, true))
        } else {
          noChoice.push(cloneObj(value, true))
        }
      }
      setIcon.choice = choice
      setIcon.noChoice = noChoice
    },
    // 关闭弹窗
    closeCustom(type) {
      const setIcon = this.setUserIcon
      setIcon.isShow = false
      if (type === 1) {
        this.userIcon = cloneObj(setIcon.choice, true)
        const menu = []
        for (let value of setIcon.choice) {
          menu.push({
            key: value.key,
            isView: 1,
          })
        }
        for (let value of setIcon.noChoice) {
          menu.push({
            key: value.key,
            isView: 0,
          })
        }
        const rd = {
          id: this.userMsg.id,
          menu: JSON.stringify(menu),
        }
        this.$getApi.setCustomIconByUserId(rd)
      }
      setIcon.choice.length = 0
      setIcon.noChoice.length = 0
    },
    // 拖动图标
    dragIcon(item, type, e) {
      const msg = JSON.stringify({
        key: item.key,
        type,
      })
      e.dataTransfer.setData('iconMsg', msg)
    },
    // 拖放图标
    addIcon(type, e) {
      const msg = JSON.parse(e.dataTransfer.getData('iconMsg'))
      const setIcon = this.setUserIcon
      const choice = setIcon.choice
      const noChoice = setIcon.noChoice
      const dy = (e.layerY - 1) % 30 /* 30: LI高度 */
      let index = Math.floor((e.layerY - 1) / 30)
      dy >= 15 && index++
      let i = 0
      const tagName = e.target.tagName
      let iconMsg = null
      if (msg.type === 'choice' && type === 'noChoice') {
        const l = choice.length
        for (; i < l; i++) {
          const value = choice[i]
          if (value.key === msg.key) {
            iconMsg = cloneObj(value, true)
            choice.splice(i, 1)
            break
          }
        }
        if (tagName !== 'UL') {
          noChoice.splice(index, 0, iconMsg)
        } else {
          noChoice.push(iconMsg)
        }
      } else if (msg.type === 'noChoice' && type === 'choice') {
        const l = noChoice.length
        for (; i < l; i++) {
          const value = noChoice[i]
          if (value.key === msg.key) {
            iconMsg = cloneObj(value, true)
            noChoice.splice(i, 1)
            break
          }
        }
        if (tagName !== 'UL') {
          choice.splice(index, 0, iconMsg)
        } else {
          choice.push(iconMsg)
        }
      }
    },
    // 拖动弹窗
    dragElem(type, e) {
      this.dragMsg = {
        x: e.offsetX,
        y: e.offsetY,
      }
      if (type === 1) {
        this.$refs.setUserIconBg.addEventListener('mousemove', this.dropElem)
      } else if (type === 0) {
        this.$refs.setUserIconBg.removeEventListener('mousemove', this.dropElem)
      }
    },
    // 拖放弹窗
    dropElem(e) {
      const msg = this.dragMsg
      const el = this.$refs.setUserIcon
      el.style.left = `${e.x - msg.x}px`
      el.style.top = `${e.y - msg.y}px`
    },
    // 获取用户图标
    getIcon(data) {
      const menu = JSON.parse(data.menu)
      if (menu === null) {
        this.userIcon = cloneObj(this.iconList, true)
      } else {
        const arr = []
        for (const val of this.iconList) {
          for (const value of menu) {
            if (val.key === value.key && value.isView === 1) {
              arr.push(val)
              break
            }
          }
        }
        this.userIcon = cloneObj(arr, true)
      }
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.userMsg = JSON.parse(sessionStorage.getItem('user'))
    this.$getApi
      .getCustomIconByUserId({
        id: this.userMsg.id,
      })
      .then((res) => {
        res && this.getIcon(res)
      })
    this.$bus.$on('choiceChartType', this.choiceChartType)
  },
  mounted() {
    /* 监听滚动事件 */
    let dom = document.getElementsByClassName('my-tab')[0]
    dom.addEventListener('mousewheel', (e) => {
      dom.scrollLeft -= e.wheelDelta
    })
  },
  beforDestroy() {
    this.$bus.$off('choiceChartType')
  },
}
</script>
<style scoped lang="scss">
.my-header-content {
  .my-header {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    .header-list {
      display: flex;
      height: 35px;
      line-height: 35px;
      li {
        margin-right: 60px;
      }
    }
    .logo-icon {
      height: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        height: 32px;
        margin-right: 10px;
      }
      .iconfont {
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  .custom-shortcut {
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    div {
      height: 35px;
      line-height: 35px;
    }
    .chart-list-icon {
      .iconfont {
        font-size: 28px;
        margin-right: 10px;
      }
    }
    .set-icon {
      cursor: pointer;
    }
  }
  .my-tab {
    margin-right: 20px;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    width: calc(100vw - 65px);
    flex-wrap: nowrap;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: flex-start;
    position: relative;
    li {
      flex-shrink: 1;
      display: flex;
      align-items: center;
      height: 30px;
      line-height: 30px;
      min-width: 50px;
      div {
        margin-right: 10px;
        margin-left: 9px;
      }
      .iconfont {
        display: block;
        height: 30px;
        line-height: 30px;
        width: 20px;
        transform: scale(0.75);
      }
    }
    .close-tab {
      color: #6c91dd;
      position: fixed;
      right: 10px;
      font-size: 20px;
      cursor: pointer;
      :hover {
        color: #145ae5;
      }
    }
    .show-all-tab {
      color: #6c91dd;
      position: fixed;
      right: 40px;
      font-size: 20px;
      cursor: pointer;
      :hover {
        color: #145ae5;
      }
    }
  }
  .set-user-icon {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    .user-icon {
      position: absolute;
      height: 511px;
      width: 390px;
      font-size: 14px;
      .user-icon-title {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        height: 40px;
        line-height: 40px;
      }
      .select-user-icon {
        width: calc(100% - 20px);
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(2, calc(50% - 5px));
        grid-column-gap: 10px;
        font-size: 12px;
        .no-choice-list,
        .choice-icon-list {
          height: 360px;
          overflow: auto;
          margin-top: 10px;
          li {
            height: 30px;
            line-height: 30px;
            display: grid;
            grid-template-columns: 20px auto;
            padding: 0 10px;
          }
        }
        margin-bottom: 26px;
      }
      .set-user-icon-btn {
        height: 28px;
        line-height: 28px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        button {
          width: 60px;
          height: 26px;
          line-height: 26px;
        }
        .long-btn {
          width: 100px;
        }
      }
    }
  }
}
</style>
