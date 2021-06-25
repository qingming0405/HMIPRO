<template>
  <div>
    <div class="my-server content-edge center">
      <div class="table_block">
        <div class="item">
          <div class="index-table box-shadow">
            <div class="table-header list-title">
              <!-- 系统信息 -->
              {{ $t("server.systemMessage") }}
              <span :class="general.system.statusColor">{{general.system.statusDesc}}</span>
            </div>
            <ul class="info-list">
              <li class="info-li" v-for="rowData in systemInfo">
                <span v-for="item in rowData" :title="item">
                  {{ item }}
                </span>
              </li>
            </ul>
            <div v-if="systemInfo.length === 0" class="noData">
              <!-- 数据加载中 -->{{ $t("server.loading") }}...
            </div>
          </div>
        </div>
        <div class="item">
          <div class="index-table box-shadow">
            <div class="table-header list-title">
              <!-- CPU息 -->{{ $t("server.CPUInfo") }}
              <span :class="general.cpu.statusColor">{{general.cpu.statusDesc}}</span>
            </div>
            <ul class="info-list">
              <li class="info-li" v-for="rowData in cpuInfo">
                <span v-for="item in rowData" :title="item">
                  {{ item }}
                </span>
              </li>
            </ul>
            <div v-if="cpuInfo.length === 0" class="noData">
              <!-- 数据加载中 -->{{ $t("server.loading") }}...
            </div>
          </div>
        </div>
        <div class="item">
          <div class="index-table box-shadow">
            <div class="table-header list-title">
              <!-- 内存信息 -->{{ $t("server.MemoryInfo") }}
              <span :class="general.memory.statusColor">{{general.memory.statusDesc}}</span>
            </div>
            <ul class="info-list">
              <li class="info-li" v-for="rowData in memoryInfo">
                <span v-for="item in rowData" :title="item">
                  {{ item }}
                </span>
              </li>
            </ul>
            <div v-if="memoryInfo.length === 0" class="noData">
              <!-- 数据加载中 -->{{ $t("server.loading") }}...
            </div>
          </div>
        </div>
        <div class="item item1">
          <div class="index-table box-shadow">
            <div class="table-header list-title">
              <!-- 磁盘信息 -->{{ $t("server.DiskInfo") }}
              <span :class="general.disk.statusColor">{{general.disk.statusDesc}}</span>
            </div>
            <ul class="info-list">
              <li class="info-li" v-for="rowData in diskInfo">
                <span v-for="item in rowData" :title="item">
                  {{ item }}
                </span>
              </li>
            </ul>
            <div v-if="diskInfo.length === 0" class="noData">
              <!-- 数据加载中 -->{{ $t("server.loading") }}...
            </div>
          </div>
        </div>
        <div class="item item2">
          <div class="index-table box-shadow">
            <div class="table-header list-title">
              <!-- 网络信息 -->{{ $t("server.InternetInfo") }}
              <span :class="general.network.statusColor">{{general.network.statusDesc}}</span>
            </div>
            <ul class="info-list">
              <li class="info-li" v-for="rowData in networkInfo">
                <span v-for="item in rowData" :title="item">
                  {{ item }}
                </span>
              </li>
            </ul>
            <div v-if="networkInfo.length === 0" class="noData">
              <!-- 数据加载中 -->{{ $t("server.loading") }}...
            </div>
          </div>
        </div>
      </div>
      <div class="search-data">
        <button @click="exportData"><!-- 导出数据 -->{{this.$t('Common.derivedData')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import com from "./serCommon";
export default {
  name: "server",
  mixins: [com],
};
</script>

<style scoped lang="scss">
.my-server {
  position: relative;
  .table_block {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    position: relative;
    display: grid;
    grid-template-columns: 33% 1fr 1fr;
    grid-template-rows: 1fr 2fr;
    grid-row-gap: 10px;
    grid-column-gap: 5px;
    .item {
      padding: 7px;
      .index-table {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        height: 100%;
        width: 100%;
        position: relative;
        .table-header {
          height: 40px;
          line-height: 40px;
          padding-left: 10px;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          background: #007eff;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          
          span {
            margin-right: 30px;
          }
        }
        .info-li {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          display: flex;
          &:nth-child(even) {
            background: #0e3e70;
          }
          &:nth-child(odd) {
            background: #0b4c90;
          }
          span {
            flex: 1;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .noData {
          position: absolute;
          text-align: center;
          top: 50%;
          width: 100%;
        }
      }
      .box-shadow {
        box-shadow: 0px 2px 7px 0px rgba(93, 135, 218, 0.33),
          0px 3px 7px 0px rgba(93, 135, 218, 0.33);
      }
    }
    .item1 {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 2;
      grid-row-end: 3;
    }
    .item2 {
      grid-column-start: 2;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
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
