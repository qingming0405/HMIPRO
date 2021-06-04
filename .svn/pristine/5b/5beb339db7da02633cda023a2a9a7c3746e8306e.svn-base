<template>
  <div class="com-row" @click="selectRow">
    <div class="com-ceil left-border">
      <div class="ceil select-div" @click.stop="posClassSelect(data, $event)">{{posClassLabel}}<i class="iconfont icon-zhongzi-zhankai"></i></div>
    </div>
    <div class="com-ceil ceil-col-two">
      <div class="ceil"><input type="number" min="0" step="0.000001" v-model="data['2'].lower_limit" placeholder="频率"/></div>
      <div class="ceil left-border"><input type="number" min="0" step="0.000001" v-model="data['2'].upper_limit" placeholder="频率"/></div>
      <div class="ceil top-border"><input type="number" min="0" step="0.000001" v-model="data['2'].h_limit" placeholder="门限"/></div>
      <div class="ceil top-border left-border"><input type="number" min="0" step="0.000001" v-model="data['2'].hh_limit" placeholder="门限"/></div>
    </div>
    <div class="com-ceil ceil-col-two">
      <div class="ceil"><input type="number" min="0" step="0.000001" v-model="data['1'].lower_limit" placeholder="频率"/></div>
      <div class="ceil left-border"><input type="number" min="0" step="0.000001" v-model="data['1'].upper_limit" placeholder="频率"/></div>
      <div class="ceil top-border"><input type="number" min="0" step="0.000001" v-model="data['1'].h_limit" placeholder="门限"/></div>
      <div class="ceil top-border left-border"><input type="number" min="0" step="0.000001" v-model="data['1'].hh_limit" placeholder="门限"/></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ComRow',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    dataIndex: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {

    }
  },
  computed: {
    posClassLabel: function() {
      return this.getPosClassLabel(this.data.pos_class)
    }
  },
  methods: {
    // 安装分类
    getPosClassLabel(pos_class){
      switch(pos_class){
        case '1':
          return '主轴'
        case '2':
          return '齿轮箱'
        case '3':
          return '发电机'
        case '4':
          return '塔筒'
        case '5':
          return '叶轮'
      }
      return '公共'
    },
    /***事件 */
    selectRow(){
      this.$emit('select-row', this.dataIndex)
    },
    // 选择安装分类
    posClassSelect(data, e){
      const text = [
        {
          icon: "",
          val: "主轴",
          pos_class: '1',
        },
        {
          icon: "",
          val: "齿轮箱",
          pos_class: '2',
        },
        {
          icon: "",
          val: "发电机",
          pos_class: '3',
        },
        {
          icon: "",
          val: "塔筒",
          pos_class: '4',
        },
        {
          icon: "",
          val: "叶轮",
          pos_class: '5',
        },
      ];
      const size = e.currentTarget.getBoundingClientRect();
      const style = {
        maxHeight: "auto",
        width: `${size.width}px`,
        left: `${size.left}px`,
        top: `${size.top + size.height}px`,
      };
      this.$list({
        text,
        pattern: style,
      }).then((res) => {
        if (res.item !== null) {
          data.pos_class = res.item.pos_class;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./comTable.scss"

</style>