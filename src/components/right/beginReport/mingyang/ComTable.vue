<template>
  <div class="com-table">
    <div class="com-row com-head">
      <div class="com-ceil ceil-col-two left-border">
        <div class="text-button" @click="addRow">添加</div>
        <div class="text-button" @click="deleteRow">删除</div>
      </div>
      <div class="com-ceil ceil-col-two">
        <div class="ceil colspan-1-3">加速度标准，m/s2 rms</div>
        <div class="ceil top-border">Ⅰ/Ⅱ</div>
        <div class="ceil top-border left-border">Ⅱ/Ⅲ</div>
      </div>
      <div class="com-ceil ceil-col-two">
        <div class="ceil colspan-1-3">速度标准，mm/s rms</div>
        <div class="ceil top-border">Ⅰ/Ⅱ</div>
        <div class="ceil top-border left-border">Ⅱ/Ⅲ</div>
      </div>
    </div>
    <com-row
      v-for="(item, index) in dataList"
      :key="index"
      :data="item" :data-index="index" @select-row="selectRow"
    ></com-row>
  </div>
</template>

<script>
import ComRow from "./ComRow";

export default {
  components: {
    ComRow,
  },
  name: "ComTable",
  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: -1,
    };
  },
  methods: {
    //添加数据行
    addRow() {
      const row = {
        pos_class: '1', //主轴
        '2':{
          type: 2,
          h_limit: '',
          hh_limit: '',
          upper_limit: '',
          lower_limit: ''
        },//加速度
        '1': {
          type: 1,
          h_limit: '',
          hh_limit: '',
          upper_limit: '',
          lower_limit: ''
        }//速度
      }
      this.dataList.push(row)
    },
    deleteRow() {
      if(this.currentIndex === -1){
        return
      }
      this.dataList.splice(this.currentIndex, 1)
      this.currentIndex = -1
    },
    selectRow(index){
      this.currentIndex = index
    }
  },
};
</script>


</style>
<style scoped lang="scss">
  @import "./comTable.scss"

</style>