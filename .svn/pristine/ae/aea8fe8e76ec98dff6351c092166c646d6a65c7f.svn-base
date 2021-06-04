<template>
  <ul class="fault-level">
    <li v-for="(fault, index) in faultLevel" :key="index">
      <div>{{ fault.title }}</div>
      <div
        class="radius default-border"
        @click.stop="checkHealth(fault, $event)"
      >
        {{ fault.val }}<i class="iconfont icon-zhongzi-zhankai"></i>
      </div>
    </li>
  </ul>
</template>

<script>
import {getFaultLevels} from '../report'

export default {
  name: "FaultLevel",
  props: {
    modelType: {
      type: String,
      default: () => ''
    },
    faultLevel: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    /* 事件 */
    checkHealth(fault, e) {
      const text = getFaultLevels(this.modelType)
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
          fault.val = res.item.val;
          fault.alarmType = res.item.alarmType;
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
.fault-level {
  li {
    display: grid;
    grid-template-columns: 40px calc(100% - 40px);
    div {
      height: 20px;
      line-height: 20px;
      &:last-child {
        padding: 0 5px;
        position: relative;
        .iconfont {
          position: absolute;
          right: 5px;
          font-size: 12px;
        }
      }
    }
    margin-bottom: 4px;
  }
}
</style>