<!-- 报警日志 -->
<template>
  <div class='my-alarm-table select-none box-shadow'>
    <div
      class='my-alarm'
      v-for='(data, index) in alarmData'
      :key='index'
      v-show='data.isShow'
    >
      <table class='alarm-table'>
        <thead
          class='alarm-thead my-table-thead'
          :class='setClass(data.type,data.msg.dgmType)'
        >
          <tr>
            <th
              class='text-overflow check-all'
              v-if='data.type === "2" && data.isShow && data.body.length'
              @click='checkAll(data)'
            >
              <i :class='setCheckClass(data.isCheck)'></i>
            </th>
            <th
              class='text-overflow'
              v-for='(item, idx) in data.head'
              :key=idx
              :class='"head" + idx + data.type'
            >{{item}}</th>
          </tr>
        </thead>
        <tbody
          class='alarm-tbody my-table-tbody'
          v-if='data.type !== "pos" && data.type !== "mac" && data.isShow && data.body.length'
        >
          <tr
            class='my-table-tr'
            v-for='(tr, idx) in data.body'
            :key=idx
            @dblclick="nextAlarm(tr)"
            @contextmenu.prevent="showContextmenu(tr, $event)"
            :class='tr.class'
            v-if="tr.isShow"
          >
            <td class='text-overflow'>{{tr.name}}</td>
            <td class='text-overflow'>{{tr.val}}</td>
            <td class='text-overflow'>{{tr.count}}</td>
            <td class='text-overflow'>{{tr.status}}</td>
          </tr>
        </tbody>
        <tbody
          class='alarm-tbody my-table-tbody'
          v-if='data.type === "mac" && data.isShow && data.body.length'
        >
          <tr
            class='my-table-tr'
            v-for='(tr, idx) in data.body'
            :key=idx
            @dblclick="nextAlarm(tr)"
            @contextmenu.prevent="showContextmenu(tr, $event)"
            :class='tr.class'
            v-if="tr.isShow"
          >

            <td class='text-overflow'>{{tr.order}}</td>
            <td class='text-overflow'>{{tr.name}}</td>
            <td class='text-overflow'>{{tr.val}}</td>
            <td class='text-overflow'>{{tr.count}}</td>
            <td class='text-overflow'>{{tr.status}}</td>
          </tr>
        </tbody>
        <!-- troot不为2且dgmtype不为1 -->
        <tbody
          @scroll="handleScroll($event)"
          class='alarm-tbody my-table-tbody my-table-tbody-pos'
          :ref='"tbody"+ index'
          v-if='data.msg.tRoot != 2 && data.type === "pos" && data.msg.dgmType != 1 && data.msg.dgmType != 10  && data.isShow && data.body.length'
        >
          <tr
            class='my-table-tr'
            v-for='(tr, idx) in data.body'
            :key=idx
            @dblclick="nextAlarm(tr)"
            @contextmenu.prevent="showContextmenu(tr, $event)"
            :class='tr.class'
            v-if="tr.isShow"
          >
            <td
              class='text-overflow'
              :class='"body1" + data.type'
            >{{tr.order}}</td>
            <td class='text-overflow'>{{tr.name}}</td>
            <td
              class='text-overflow'
              :class='"body2" + data.type'
            >{{tr.viewTime}}</td>
            <td
              class='text-overflow'
              :class='"body3" + data.type'
              :title='tr.evenType'
            >{{tr.eventType}}</td>
            <td class='text-overflow'>{{tr.cond}}</td>
            <td class='text-overflow'>{{tr.alarmType}}</td>
            <td class='text-overflow'>{{tr.value}}</td>
            <td class='text-overflow'>{{tr.alarmH}}</td>
            <td class='text-overflow'>{{tr.warningH}}</td>
            <td class='text-overflow'>{{tr.warningL}}</td>
            <td class='text-overflow'>{{tr.alarmL}}</td>
          </tr>
        </tbody>
        <!-- troot不为2且dgmtype为1 -->
        <tbody
          @scroll="handleScroll($event)"
          class='alarm-tbody my-table-tbody'
          :ref='"tbody"+ index'
          v-if='data.msg.tRoot != 2 && data.type === "pos" && data.msg.dgmType == 1 && data.isShow && data.body.length'
        >
          <tr
            class='my-table-tr'
            v-for='(tr, idx) in data.body'
            :key=idx
            @dblclick="nextAlarm(tr)"
            @contextmenu.prevent="showContextmenu(tr, $event)"
            :class='tr.class'
            v-if="tr.isShow"
          >
            <td class='text-overflow'>{{tr.order}}</td>
            <td class='text-overflow'>{{tr.name}}</td>
            <td class='text-overflow'>{{tr.viewTime}}</td>
            <td
              class='text-overflow'
              :title='tr.evenType'
            >{{tr.eventType}}</td>
          </tr>
        </tbody>
        <!-- troot为2且dgmtype不为1 -->
        <tbody
          class='alarm-tbody my-table-tbody my-table-tbody-pos'
          :ref='"tbody"+ index'
          @scroll="handleScroll($event)"
          v-if='data.msg.tRoot == 2 && data.type === "pos" && data.msg.dgmType != 1 && data.isShow && data.body.length'
        >
          <tr
            class='my-table-tr'
            v-for='(tr, idx) in data.body'
            :key=idx
            @dblclick="nextAlarm(tr)"
            @contextmenu.prevent="showContextmenu(tr, $event)"
            :class='tr.class'
            v-if="tr.isShow"
          >
            <td
              class='text-overflow'
              :class='"body1" + data.type'
            >{{tr.order}}</td>
            <td class='text-overflow'>{{tr.name}}</td>
            <td
              class='text-overflow'
              :class='"body2" + data.type'
            >{{tr.viewTime}}</td>
            <td
              class='text-overflow'
              :class='"body3" + data.type'
              :title='tr.evenType'
            >{{tr.eventType}}</td>
            <!-- <td class='text-overflow'>{{tr.cond}}</td> -->
            <td class='text-overflow'>{{tr.alarmType}}</td>
            <td class='text-overflow'>{{tr.value}}</td>
            <td class='text-overflow'>{{tr.alarmHh}}</td>
            <td class='text-overflow'>{{tr.alarmH}}</td>
            <td class='text-overflow'>{{tr.warningH}}</td>
            <!-- TMS的三个低报去除 -->
            <!-- <td class='text-overflow'>{{tr.warningL}}</td>
            <td class='text-overflow'>{{tr.alarmLl}}</td>
            <td class='text-overflow'>{{tr.alarmL}}</td> -->
          </tr>
        </tbody>
        <!-- troot为2且dgmtype为1 -->
        <tbody
          class='alarm-tbody my-table-tbody'
          :ref='"tbody"+ index'
          @scroll="handleScroll($event)"
          v-if="data.msg.tRoot == 2 && data.type === 'pos' && data.msg.dgmType == 1 && data.isShow && data.body.length"
        >
          <tr
            class='my-table-tr'
            v-for='(tr, idx) in data.body'
            :key=idx
            @dblclick="nextAlarm(tr)"
            @contextmenu.prevent="showContextmenu(tr, $event)"
            :class='tr.class'
            v-if="tr.isShow"
          >
            <td
              class='text-overflow'
              :class='"body1" + data.type'
            >{{tr.order}}</td>
            <td class='text-overflow'>{{tr.name}}</td>
            <td
              class='text-overflow'
              :class='"body2" + data.type'
            >{{tr.viewTime}}</td>
            <td
              class='text-overflow'
              :class='"body3" + data.type'
              :title='tr.evenType'
            >{{tr.eventType}}</td>
          </tr>
        </tbody>
        <!-- dgmtype为10 -->
        <tbody
          class='alarm-tbody my-table-tbody my-table-tbody-pos'
          :ref='"tbody"+ index'
          @scroll="handleScroll($event)"
          v-if="data.type === 'pos' && data.msg.dgmType == 10 && data.isShow && data.body.length"
        >
          <tr
            class='my-table-tr'
            v-for='(tr, idx) in data.body'
            :key=idx
            @dblclick="nextAlarm(tr)"
            @contextmenu.prevent="showContextmenu(tr, $event)"
            :class='tr.class'
            v-if="tr.isShow"
          >
            <td class='text-overflow'>{{tr.order}}</td>
            <td class='text-overflow'>{{tr.name}}</td>
            <td
              class='text-overflow'
              :class='"body2" + data.type'
            >{{tr.viewTime}}</td>
            <td
              class='text-overflow'
              :class='"body3" + data.type'
              :title='tr.evenType'
            >{{tr.eventType}}</td>
            <td class='text-overflow'>{{tr.alarmType}}</td>
            <td class='text-overflow'>{{tr.value}}</td>
          </tr>
        </tbody>
      </table>

      <div
        class='none-data-box select-none'
        v-show='data.noData.isShow'
      >
        <div>{{data.noData.text}}</div>
      </div>
    </div>
    <div class='search-data'>
      <input
        v-show="alarmData[currentIndex] && alarmData[currentIndex].body.length > 0"
        v-model="searchkeyword"
        class='input-value radius text-overflow select-none outside-border'
      >
      <button
        @click='search'
        v-show="alarmData[currentIndex] && alarmData[currentIndex].body.length > 0"
      >查询</button>
      <button
        v-if="type == 3"
        @click="getRealData"
        class="get-real-data disable-btn"
      >
        实时数据
      </button>
      <button @click='dataRetrieval'>数据检索</button>
      <button
        @click='dataExport'
        v-show="alarmData[currentIndex] && alarmData[currentIndex].body.length > 0"
      >导出数据</button>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import com from './alarmCommon'
export default {
  // import引入的组件需要注入到对象中才能使用
  mixins: [com],
}
</script>
<style scoped lang='scss'>
.my-alarm-table {
  width: 100%;
  height: calc(100% - 50px);
  position: relative;
  .my-alarm {
    width: 100%;
    height: 100%;
    .alarm-table {
      width: 100%;
      height: 100%;
      .alarm-thead {
        tr {
          height: 40px;
          line-height: 40px;
          th {
            user-select: none;
            text-align: center;
          }
          .head02 {
            width: 50px;
          }
          .head12 {
            width: 200px;
          }
          .head22 {
            width: 400px;
          }
          .head3pos {
            width: 400px;
          }
        }
        .check-all {
          width: 30px;
        }
      }
      .alarm-tbody {
        height: calc(100% - 40px);
        .my-table-tr {
          display: table;
          height: 30px !important;
          line-height: 30px;
          td {
            text-align: center;
            height: 30px;
            user-select: none;
            padding: 0 5px;
          }
          .body02 {
            width: 30px;
          }
          .body12 {
            width: 50px;
          }
          .body22 {
            width: 200px;
          }
          .body32 {
            width: 400px;
          }
          .body3pos {
            width: 400px;
          }
        }
      }
      .my-table-thead-pos,
      .my-table-tbody-pos {
        tr {
          th,
          td {
            &:first-child {
              width: 50px;
            }
            &:nth-child(3) {
              width: 180px;
            }
            // &:nth-child(4) {
            //   width: 120px;
            // }
            &:nth-child(5) {
              width: 120px;
            }
            &:nth-child(6) {
              min-width: 80px;
            }
            &:nth-child(7) {
              min-width: 80px;
            }
            &:nth-child(8) {
              min-width: 80px;
            }
            &:nth-child(9) {
              min-width: 80px;
            }
            &:last-child {
              min-width: 80px;
            }
          }
        }
      }
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    text-align: center;
    position: absolute;
    bottom: -57px;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin: 0px 10px;
    }
    input {
      height: 30px;
      padding-left: 10px;
    }
  }
}
</style>
