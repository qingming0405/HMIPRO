<!--设备模型图-->
<template>
  <div>
    <div
      class="sn-model"
      :class="'sn-model'+key"
      v-for="(param,key) in snMechineModel"
      :key="key"
      v-show="param.isShow"
    >
      <img
        :src="param.bgURL"
        v-show="param.isShowBackground"
      />
      <div
        v-show="param.title.name!='' && !param.isShowBackground"
        class="sn-title"
        :style="'margin:15px;'"
      >
        <div :style="'font-size:'+param.title.fontsize">{{param.title.name}}</div>
      </div>
      <canvas
        v-show="!param.isShowBackground"
        id="canvas"
        :class="'canvas'+key"
      > </canvas>
      <!-- 旧版测点 -->
      <canvas
        v-show="!param.version && !param.isShowBackground"
        id="canvas-pos"
        :ref="'canvas-pos'+key"
      > </canvas>
      <div v-show="param.version == 1 && !param.isShowBackground">
        <div v-for="item in param.points">
          <div
            :style="item.boxStyle"
            class="pointBox"
            :class="item.isChoose ? 'active':''"
            @click="pointClick(item)"
            @dblclick="toTrend(item)"
            @contextmenu.prevent="showContextmenu($event, item)"
          >
            <p
              class="font font-border"
              :style="'fontSize:'+item.namesize +'px'"
            >{{item.name}}</p>
            <p
              class="font"
              :style="item.textStyle"
            >{{item.text}}</p>
          </div>
          <div
            :style="item.pointStyle"
            class="point-circle"
            :class="item.isChoose ? 'circle-active'+item.alarm_status:''"
          ></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import mechineModel from 'common/general/sn/model/mechineModel.js'
export default {
  name: 'snMechineModel',
  mixins: [mechineModel],
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  height: 100%;
  background: url('~assets/images/sn/background.png');
  background-repeat: no-repeat;
  background-position: right bottom;
}
#canvas-pos {
  position: absolute;
  left: 0px;
}

.sn-model {
  width: 100%;
  height: 100%;
  position: relative;
  .pointBox {
    border: 1px solid #005ec2;
    background: rgba(7, 39, 74, 0.8);
    border-radius: 4px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    z-index: 11px;
    p {
      text-align: center;
    }
    .font {
      color: #ffffff;
      opacity: 0.89;
    }
    .font-border {
      border-bottom: 1px solid rgba(0, 94, 194, 1);
    }
  }
  .sn-title {
    z-index: 10;
    position: absolute;
    top: 0px;
    width: 100%;
    text-align: center;
  }
  .active {
    border: 1px solid #00eaff;
    box-shadow: 0px 2px 4px 0px rgba(0, 234, 255, 0.3);
  }
  .point-circle {
    border-radius: 50%;
    z-index: 11px;
  }
  .circle-active0,
  .circle-active1 {
    box-shadow: 4px 4px 6px rgba(0, 234, 255, 0.6),
      4px -4px 6px rgba(0, 234, 255, 0.6), -4px 4px 6px rgba(0, 234, 255, 0.6),
      -4px -4px 6px rgba(0, 234, 255, 0.6);
  }
  .circle-active2 {
    box-shadow: 4px 4px 6px rgba(255, 162, 2, 0.5),
      4px -4px 6px rgba(255, 162, 2, 0.5), -4px -4px 6px rgba(255, 162, 2, 0.5),
      4px -4px 6px rgba(255, 162, 2, 0.5);
  }
  .circle-active3 {
    box-shadow: 4px 4px 6px rgba(248, 0, 0, 0.6),
      4px -4px 6px rgba(248, 0, 0, 0.6), -4px -4px 6px rgba(248, 0, 0, 0.6),
      -4px 4px 6px rgba(248, 0, 0, 0.6);
  }
}
</style>
