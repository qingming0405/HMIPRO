<!-- 系统日志 -->
<template>
  <div class="my-system-log select-none box-shadow">
    <div
      class="system-log scroll-style-edge"
      v-for="(data, key, index) in searchData"
      :key="index"
      v-show="data.isShow"
    >
      <ul class="my-system-head">
        <li
          v-for="(item, index) in head"
          :key="index"
        >{{ item }}</li>
      </ul>
      <ul class="my-system-body">
        <li
          v-for="(body, idx) in data.body"
          :key="idx"
          :class="body.class"
        >
          <div>{{ idx + 1 }}</div>
          <div>{{ body.time }}</div>
          <div>{{ body.event }}</div>
        </li>
      </ul>
      <div
        class="none-data-box select-none radius"
        v-show="data.empty.isShow"
      >
        <div>{{ data.empty.text }}</div>
      </div>
    </div>
    <div class="search-data">
      <input
        v-show="chartData[currentKey].body.length > 0"
        v-model="searchkeyword"
        class="input-value radius text-overflow select-none outside-border"
      />
      <button
        class="searchBtn"
        @click="search"
        v-show="chartData[currentKey].body.length > 0"
      >
        <!-- 查询 -->{{$t('Common.inquiry')}}
      </button>
      <button @click="dataRetrieval"><!-- 数据检索 -->{{$t('Common.retrieval')}}</button>
      <button
        @click="dataExport"
        v-show="chartData[currentKey].body.length > 0"
      >
        <!-- 导出数据 -->{{$t('Common.derivedData')}}
      </button>
    </div>
  </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import com from './sysCommon'
export default {
  // import引入的组件需要注入到对象中才能使用
  mixins: [com],
  methods: {
    // setColor(code) {
    //   if (code <= -14000) return "{color: #009944}";
    //   else if (code >= -4999 && code < 0) return "{color: #009944}";
    //   else if (code > 0 && code <= 4999) return "{color: #f80000}";
    //   else if (code >= 14000) return "{color: #f80000}";
    //   else return "";
    // },
  },
}
</script>
<style scoped lang="scss">
.my-system-log {
  width: 100%;
  height: 100%;
  position: relative;
  .system-log {
    width: 100%;
    height: calc(100% - 50px);
    .my-system-head {
      display: grid;
      grid-template-columns: 10% 25% 65%;
      font-weight: bold;
      li {
        height: 40px;
        line-height: 40px;
        text-align: center;
        &:nth-child(2) {
          text-align: right;
          margin-right: 60px;
        }
      }
    }
    .my-system-body {
      overflow: auto;
      max-height: calc(100% - 50px);
      li {
        height: 30px;
        line-height: 30px;
        text-align: center;
        display: grid;
        grid-template-columns: 10% 25% 65%;
        div {
          &:nth-child(2) {
            text-align: right;
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
    input {
      height: 30px;
      padding-left: 10px;
    }
    .searchBtn {
      margin-left: 0px;
      margin-right: 10px;
    }
  }
  .blue-text {
    color: #009944;
  }
  .alarm-text {
    color: #f80000;
  }
}
</style>
