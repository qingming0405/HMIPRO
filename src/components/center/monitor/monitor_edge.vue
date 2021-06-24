<!-- 监测报表 -->
<template>
  <div class="my-monitor-table select-none box-shadow">
    <div
      class="monitor-table scroll-style-edge"
      v-for="(data, index, key) in chartData"
      :key="key"
      v-show="data.isShow"
      ref="monitorTable"
    >
      <ul
        class="monitor-title"
        :style="data.padding"
        :class="`scroll-${index}`"
      >
        <li
          v-for="(title, idx) in data.head1"
          :key="idx"
          class="monitor-title-list text-overflow"
          :title="title.val"
          :style="idx > 9?'width:100px;min-width:100px;':''"
          v-if="title.isShow"
        >
          {{ title.val }}
        </li>
      </ul>
      <ul
        class="monitor-body"
        ref="historyBody"
        @scroll="scrollBar($event, index, data)"
      >
        <li
          v-for="(body, id) in data.body"
          :key="id"
          class="monitor-body-list"
        >
          <div
            class="monitor-body-title-edge text-overflow"
            v-if="body.name !== ''"
            :style="getHeight(body.pos,'pos')"
          >
            {{ body.name }}
          </div>
          <div>
            <ul>
              <li
                class="monitor-val-list-ul"
                v-for="(pos, i) in body.pos"
                :key="i"
                ref="monitorVal"
              >
                <div
                  class="monitor-body-title-edge text-overflow "
                  v-if="pos.name !== ''"
                  :style="getHeight(pos.d)"
                >{{i+1}}</div>
                <div
                  class="monitor-body-title-edge text-overflow "
                  v-if="pos.name !== ''"
                  :style="getHeight(pos.d)"
                >{{pos.name}}</div>
                <div>
                  <ul
                    class="monitor-pos-list "
                    v-for="(item, i) in pos.d"
                    :key="i"
                    ref="monitorVal"
                    :class="'monitor-val-list' + (i % 2)"
                  >
                    <li
                      class="text-overflow"
                      :title="item.e"
                    >{{ item.e }}</li>
                    <li
                      class="text-overflow"
                      :title="item.h"
                      v-if="data.head1[4].isShow"
                    >
                      {{ item.h }}
                    </li>
                    <li
                      class="text-overflow"
                      :title="item.hh"
                      v-if="data.head1[5].isShow"
                    >
                      {{ item.hh }}
                    </li>
                    <li
                      class="text-overflow"
                      :title="item.real"
                      v-if="data.head1[6].isShow"
                    >
                      {{ item.real }}
                    </li>
                    <li
                      class="text-overflow"
                      :title="item.max"
                    >{{ item.max }}</li>
                    <li
                      class="text-overflow"
                      :title="item.min"
                    >{{ item.min }}</li>
                    <li
                      class="text-overflow"
                      :title="item.avg"
                    >{{ item.avg }}</li>
                    <li
                      v-for="(head, num) in data.head1"
                      v-if="head.timeStamp"
                      v-show="head.isShow"
                      :style="num > 9?'width:100px;min-width:100px;':''"
                    >
                      {{item.dataTime[head.timeStamp]}}
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <!-- <div>
            <ul
              class="monitor-val-list-ul"
              v-for="(item, i) in body.d"
              :key="i"
              ref="monitorVal"
            >
              <li
                class="text-overflow"
                :title="item.e"
              >{{ item.e }}</li>
              <li
                class="text-overflow"
                :title="item.real"
                v-show="data.head[2].isShow"
              >
                {{ item.real }}
              </li>
              <li
                class="text-overflow"
                :title="item.max"
              >{{ item.max }}</li>
              <li
                class="text-overflow"
                :title="item.min"
              >{{ item.min }}</li>
              <li
                class="text-overflow"
                :title="item.avg"
              >{{ item.avg }}</li>
            </ul>
          </div> -->
        </li>
      </ul>
      <div
        class="none-data-box"
        v-show="data.empty.isShow"
      >
        <span>{{ data.empty.text }}</span>
      </div>
    </div>
    <div class="search-data">
      <button @click="download"><!-- 数据导出 -->{{$t('icon.dataExport')}}</button>
      <button @click="dataRetrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
    </div>
  </div>
</template>

<script>
// import json2csv from 'json2csv';
import common from './monitorCommon'
export default {
  mixins: [common],
}
</script>
<style scoped lang="scss">
.my-monitor-table {
  position: relative;
  // background-color: red;
  overflow: hidden;
  .monitor-table {
    color: #fff;
    width: 100%;
    height: calc(100% - 50px);
    overflow: hidden;
    .monitor-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      text-align: center;
      min-width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      li {
        min-width: 100px;
        &:nth-child(1) {
          width: 400px;
          min-width: 400px;
        }
        &:nth-child(2) {
          width: 100px;
          min-width: 100px;
        }
        &:nth-child(3) {
          width: 400px;
          min-width: 400px;
        }
        &:nth-child(4) {
          width: 200px;
          min-width: 200px;
        }
        &:nth-child(5),
        &:nth-child(6),
        &:nth-child(7),
        &:nth-child(8),
        &:nth-child(9),
        &:nth-child(10) {
          width: 190px;
          min-width: 190px;
        }
      }
    }
    .monitor-title::-webkit-scrollbar {
      width: 0 !important;
    }
    .monitor-body {
      display: flex;
      text-align: center;
      overflow-y: auto;
      height: calc(100% - 40px);
      width: 100%;
      margin-top: 40px;
      flex-direction: column;
      &::-webkit-scrollbar {
        // display: none;
      }
      .monitor-body-list {
        // display: grid;
        // width: 100%;
        // grid-template-columns: 180px calc(100% - 180px);
        display: flex;
        // flex-direction: row;
        border: none !important;
        min-width: 100%;
        div {
          &:nth-child(1) {
            width: 400px;
            min-width: 400px;
          }
        }
        ul {
          height: 30px;
          line-height: 30px;
          // display: grid;
          // grid-template-columns: 15% 5% 15% 10% repeat(auto-fill, 100px);
          border-bottom: 1px solid #0b4c90;
          display: flex;
          text-align: center;
          flex-direction: column;
          width: 100%;
          div {
            min-width: 100px;
            &:nth-child(1) {
              width: 100px;
              min-width: 100px;
            }
            &:nth-child(2) {
              width: 400px;
              min-width: 400px;
            }
          }
          li {
            width: 100%;
            // height: 30px;
            // line-height: 30px;
            display: flex;
            flex-direction: row;
            .monitor-pos-list {
              display: flex;
              flex-direction: row;
              width: 100%;
              li {
                min-width: 100px;
                text-align: center;
                align-items: center;
                justify-content: center;
                &:nth-child(1) {
                  width: 200px;
                  min-width: 200px;
                }
                &:nth-child(2),
                &:nth-child(3),
                &:nth-child(4),
                &:nth-child(5),
                &:nth-child(6),
                &:nth-child(7) {
                  width: 190px;
                  min-width: 190px;
                }
              }
            }
            .monitor-val-list0 {
              background: #0e3e70 !important;
              &:hover {
                background: #0b4c90 !important;
              }
            }
            .monitor-val-list1 {
              background: #103760 !important;
              &:hover {
                background: #0b4c90 !important;
              }
            }
          }
        }
        .monitor-body-title-edge {
          border-right: 1px solid #0b4c90;
          border-bottom: 1px solid #0b4c90;
          border-left: 1px solid #0b4c90;
        }
      }
    }
  }
  .search-data {
    height: 49px;
    line-height: 49px;
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin: 0px 10px;
    }
  }
}
</style>
