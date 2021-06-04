<template>
  <div class="mingyang-config">
    <div class="model">
      <div class="title1">
        正常机组图谱选择条件
      </div>
      <ul class="report-list">
        <li>
          <div class="list-name">开始时间</div>
          <el-date-picker
            v-model="config.startTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            :clearable='false'
          />
        </li>
        <li>
          <div class="list-name">结束时间</div>
          <el-date-picker
            v-model="config.endTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            :clearable='false'
          />
        </li>
        <li>
          <div class="list-name">转速区间</div>
          <div class="grid-area">
            <input
              type="number"
              class="radius default-border"
              v-model="config.fromSpeed"
            />
            -
            <input
              type="number"
              class="radius default-border"
              v-model="config.toSpeed"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="model">
      <div class="title1">
        诊断依据
      </div>
      <com-table class="com-table" :dataList="config.basis"/>
    </div>
  </div>
</template>

<script>
import ComTable from './ComTable.vue'
export default {
  components: { ComTable },
  name: 'MingyangConfig',
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  data(){
    return {
      
    }
  },
}
</script>

<style scoped>
  .mingyang-config{
    margin-top: 20px;

    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #666666;
    line-height: 18px;
  }
  .model {
    margin-bottom: 8px;
  }
  .title1 {
    margin-left: 8px;
    margin-bottom: 4px;
    text-align: left;
  }
  .report-list li {
    display: grid;
    grid-template-columns: 80px 300px;
    line-height: 30px;
  }
  .list-name {
    text-align: right;
    padding-right: 10px;
  }
  .grid-area {
    display: grid;
    grid-template-columns: 45% 10% 45%;
    grid-template-rows: 25px;
    align-items: center;
    text-align: center;
  }
  .grid-area input {
    padding-left: 5px;
    height: 21px;
  }
  .com-table {
    margin: 3px;
  }
</style>