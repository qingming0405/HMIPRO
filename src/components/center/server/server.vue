<!-- 服务器信息 -->
<template>
  <div class="my-server select-none">
    <div class="server-content">
      <div class="table_block">
        <div class="item">
          <div class="index-table box-shadow">
            <div class="table-header color1">系统信息</div>
            <ul class="info-list">
              <li class="info-li" v-for="item in systemInfo">
                <span :title="item.title">{{item.title}}</span>
                <span :title="item.info">{{item.info}}</span>
              </li>
            </ul>
            <div v-if="systemInfo.length === 0" class="noData">数据加载中...</div>
          </div>
        </div>
        <div class="item">
          <div class="index-table box-shadow">
            <div class="table-header color2">CPU信息</div>
            <ul class="info-list">
              <li class="info-li" v-for="item in cpuInfo">
                <span :title="item.title">{{item.title}}</span>
                <span :title="item.info">{{item.info}}</span>
              </li>
            </ul>
            <div v-if="cpuInfo.length === 0" class="noData">数据加载中...</div>
          </div>
        </div>
        <div class="item">
          <div class="index-table box-shadow">
            <div class="table-header color3">内存信息</div>
            <ul class="info-list">
              <li class="info-li" v-for="item in memoryInfo">
                <span :title="item.title">{{item.title}}</span>
                <span :title="item.info">{{item.info}}</span>
              </li>
            </ul>
            <div v-if="memoryInfo.length === 0" class="noData">数据加载中...</div>
          </div>
        </div>
        <div class="item item1">
          <div class="index-table box-shadow">
            <div class="table-header color4">磁盘信息</div>
            <ul class="info-list">
              <li class="info-li">
                <span v-for="item in diskInfo" :title="item.name">{{item.name}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in diskInfo" :title="item.type">{{item.type}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in diskInfo" :title="item.total">{{item.total}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in diskInfo" :title="item.free">{{item.free}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in diskInfo" :title="item.used">{{item.used}}</span>
              </li>
            </ul>
            <div v-if="diskInfo.length === 0" class="noData">数据加载中...</div>
          </div>
        </div>
        <div class="item item2">
          <div class="index-table box-shadow">
            <div class="table-header color5">网络信息</div>
            <ul class="info-list">
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.deviceName">{{item.deviceName}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.ip">{{item.ip}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.netMask">{{item.netMask}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.macaddr">{{item.macaddr}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.info">{{item.info}}</span>
              </li>
              <li class="info-li">
                <span
                  v-for="item in networkInfo"
                  :title="item.receivePackage"
                >{{item.receivePackage}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.sendPackage">{{item.sendPackage}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.receiveByte">{{item.receiveByte}}</span>
              </li>
              <li class="info-li">
                <span v-for="item in networkInfo" :title="item.sendByte">{{item.sendByte}}</span>
              </li>
              <li class="info-li">
                <span
                  v-for="item in networkInfo"
                  :title="item.receiveErrorPackage"
                >{{item.receiveErrorPackage}}</span>
              </li>
              <li class="info-li">
                <span
                  v-for="item in networkInfo"
                  :title="item.sendErrorPackage"
                >{{item.sendErrorPackage}}</span>
              </li>
              <li class="info-li">
                <span
                  v-for="item in networkInfo"
                  :title="item.receiveDropPackage"
                >{{item.receiveDropPackage}}</span>
              </li>
            </ul>
            <div v-if="networkInfo.length === 0" class="noData">数据加载中...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import com from "./serCommon";

export default {
  name: "myserver",
  mixins: [com],
  components: {},
  props: ["data"],

};
</script>

<style lang="scss">
.server-content {
  position: relative;
  flex: 1;
  height: 100%;
  .table_block {
    width: 100%;
    height: 100%;
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
        background: #fff;
        height: 100%;
        width: 100%;
        position: relative;
        .table-header {
          height: 40px;
          line-height: 40px;
          font-size: 18px;
          padding-left: 10px;
          color: #666;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          &.color1 {
            background: #ffe1d4;
          }
          &.color2 {
            background: #fff7d4;
          }
          &.color3 {
            background: #f4d4ff;
          }
          &.color4 {
            background: #d4e9ff;
          }
          &.color5 {
            background: #d4fffd;
          }
        }
        .info-li {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #323232;
          display: flex;
          &:nth-child(even) {
            background: #f4f4f4;
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
}
</style>
