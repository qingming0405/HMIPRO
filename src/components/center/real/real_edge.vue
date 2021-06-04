<!-- 实时数据列表 -->
<template>
  <div class="my-real-table box-shadow select-none ">
    <div
      class="my-real"
      v-for="(item, key) in realData"
      :key="key"
      v-show="item.isShow"
    >
      <table class="real-table scroll-style-edge ">
        <thead class="real-thead my-table-thead">
          <tr class="my-table-tr" ref="realHeadTr">
            <th
              v-for="(title, idx) in item.head"
              :key="idx"
              v-show="title.isShow && item.body.length > 0"
              class="text-overflow"
              :title="title.val"
            >
              {{ title.val }}
              <!-- {{ title.unit ? title.val + "(" + title.unit + ")" : title.val }} -->
            </th>
          </tr>
        </thead>
        <tbody class="real-tbody my-table-tbody " @scroll="scrollBar">
          <tr
            class="my-table-tr"
            v-for="(row, id) in item.body"
            :key="id" 
            :class="row[0].class"
            @dblclick="turnToTrend(item.posInfo[id])"
            @contextmenu.prevent="showContextmenu($event, row, item.posInfo[id])"
          >
            <td
              v-for="(value, i) in row"
              :key="i"
              v-show="item.head[i].isShow"
              class="text-overflow"
              :title="value.val"
            >
              {{ value.val }}
              <span v-show="item.head[i].val == '测点'"
                >({{ value.unit }})</span
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div class="none-data-box radius" v-show="item.empty.isShow">
        <div>{{ item.empty.text }}</div>
      </div>
      <div class="search-data">
        <button @click="getRealData" class="get-real-data" ref="getRealData">
          实时数据
        </button>
        <button @click="dataRetrieval">数据检索</button>
      </div>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import common from "./realCommon";

export default {
  mixins: [common]
};
</script>
<style scoped lang="scss">
.my-real-table {
  position: relative;
  .my-real {
    height: 100%;
    .real-table {
      height: calc(100% - 50px);
      width: 100%;
      .real-thead {
        padding-right: 0;
        tr {
          position: relative;
          height: 40px;
          line-height: 40px;
          th {
            text-align: center;
          }
        }
      }
      .real-tbody {
        height: calc(100% - 40px);
        display: block;
        overflow: auto;
        /*padding-right: 5px;*/
        .my-table-tr {
          display: table;
          height: 30px !important;
          td {
            text-align: center;
            height: 30px;
          }
        }
      }
      .my-table-tr {
        td,
        th {
          width: 100px;
          &:first-child {
            width: 150px;
          }
          &:nth-child(2) {
            width: 180px;
          }
        }
      }
    }
    .search-data {
      height: 49px;
      line-height: 49px;
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
      button {
        height: 30px;
        width: 100px;
      }
      .get-real-data {
        margin-right: 20px;
      }
    }
  }
}
</style>
