<!-- 历史数据列表 -->
<template>
  <div class="my-history-table box-shadow">
    <div
      class="my-history"
      v-for="(data, key) in historyData"
      :key="key"
      v-show="data.isShow"
    >
      <table
        class="history-table"
        ref="historyTable"
        v-show="data.head.length > 0 && data.body.length > 0"
      >
        <thead class="history-thead my-table-thead" ref="historyHead">
          <tr class="my-table-tr" :class="`${key}-tr`">
            <th
              v-for="(title, idx) in data.head"
              :key="idx"
              v-show="title.isShow && data.body !== null"
              class="text-overflow"
              :title="setTitle(title)"
            >
              {{ setTitle(title) }}
            </th>
          </tr>
        </thead>
        <tbody
          class="history-tbody my-table-tbody pro-scrollbar"
          @scroll="scrollRequest($event,key)"
          ref="historyBody"
        >
          <tr
            class="my-table-tr"
            v-for="(body, id) in data.body"
            :key="id"
          >
            <td
              v-for="(item, i) in body"
              :key="i"
              v-show="data.head[i].isShow"
              class="text-overflow"
              :title="item.val"
            >
              {{ item.val }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="none-data-box select-none radius" v-show="data.empty.isShow">
        <span>{{ data.empty.text }}</span>
      </div>
    </div>
    <div class="search-data">
      <button @click="exportData">导出数据</button>
      <button @click="dataRetrieval">数据检索</button>
      <a href="" ref="exportData"></a>
    </div>
  </div>
</template>

<script>
import common from "./historyCommon";

export default {
  mixins: [common],
  data(){
    return{
      filePath:'/HMIpro'
    }
  }
};
</script>
<style scoped lang="scss">
.my-history-table {
  .my-history {
    width: 100%;
    height: calc(100% - 50px);
    .history-table {
      width: 100%;
      height: 100%;
      overflow: auto;
      .history-thead {
        tr {
          position: relative;
          height: 40px;
          line-height: 40px;
          th {
            height: 40px;
            line-height: 40px;
            user-select: none;
            text-align: center;
          }
        }
      }
      .history-tbody {
        height: calc(100% - 40px);
        .my-table-tr {
          display: table;
          height: 30px !important;
          td {
            text-align: center;
            height: 30px;
            user-select: none;
          }
        }
      }
      .my-table-tr {
        td,
        th {
          width: 90px;
          &:first-child {
            width: 150px;
          }
          &:nth-child(2) {
            width: 180px;
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
    bottom: 0;
    width: 100%;
    button {
      height: 30px;
      width: 100px;
      margin: 0px 10px;
    }
    input{
      padding-left: 10px;
    }
  }
}
</style>
