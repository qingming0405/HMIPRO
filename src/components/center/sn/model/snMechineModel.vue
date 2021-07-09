<!--设备模型图-->
<template>
  <div>
    <div
      class="sn-model"
      v-for="(param,key) in snMechineModel"
      :key="key"
      v-show="param.isShow"
    >
      <img
        :src="param.bgURL"
        v-show="param.isShowBackground"
      />
      <div
        class="sn-model-content"
        :class="'sn-model'+key"
      >
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
            <!-- @mousemove.stop.prevent="setViewPosMsg(item, $event)"
              @mouseleave="closeFloatingWindow(item,$event)" -->
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
        <!-- 测点浮窗信息 -->
        <ul
          class="pos-floating-window select-none box-shadow radius default-border"
          style="position: absolute;"
          :style="viewPosMsg.style"
          v-show="viewPosMsg.isShow"
        >
          <li>
            <!-- 测点名称 -->
            <div>{{$t('Left.posNameToolTip')}}</div>
            <div>：{{ viewPosMsg.posName }}</div>
          </li>
          <li>
            <!-- 测点类型 -->
            <div>{{$t('Left.posTypeToolTip')}}</div>
            <div>：{{ viewPosMsg.posTypeName }}</div>
          </li>
          <div
            v-for="alarmValue in viewPosMsg.alarmValue"
            v-if="viewPosMsg.alarm_status > 1"
          >
            <li>
              <!-- 报警特征值 -->
              <div>{{alarmValue.eigen}}</div>
              <div>：{{ alarmValue.value }}</div>
            </li>
            <li>
              <!-- 报警特征值 -->
              <div>
                <!-- 预警门限 -->{{$t('SnModel.WarningThreshold')}}
              </div>
              <div>：{{ alarmValue.warnThreshold }}</div>
            </li>
            <li>
              <!-- 报警特征值 -->
              <div>{{$t('SnModel.alarmThreshold')}}</div>
              <div>：{{ alarmValue.alarmThreshold }}</div>
            </li>
          </div>
        </ul>
      </div>

      <!-- 智能诊断 -->
      <div class="diagnosis-box">
        <div class="diagnosis-title">
          <p>
            <!-- 设备诊断 -->{{$t('SnModel.EquipDiagnosis')}}
          </p>
        </div>
        <div class="diagnosis-content-box">
          <div
            class="diagnosis-content"
            v-for="diagnosis in param.diagnosis"
          >
            <div class="diagnosis">
              <i class="iconfont icon-shijian"></i>
              <div class="title">
                <!-- 时间 -->{{$t('Common.time')}}
              </div>
              <div class="content">{{diagnosis.time}}</div>
            </div>
            <div class="diagnosis">
              <i class="iconfont icon-jieguo"></i>
              <div class="title">
                <!-- 结果 -->{{$t('SnModel.Result')}}
              </div>
              <div class="content">{{diagnosis.content}}</div>
            </div>
          </div>
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
  top: 0px;
}

.sn-model {
  width: 100%;
  height: 100%;
  position: relative;
  .sn-model-content {
    width: calc(100% - 290px);
    height: 100%;
    position: relative;
  }
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
  .diagnosis-box {
    width: 290px;
    min-height: 130px;
    background: rgba(4, 30, 57, 0.5);
    padding: 15px;
    position: relative;
    top: -99%;
    left: calc(100% - 290px);
    .diagnosis-title {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: center;
      p {
        // width: 65px;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #f1f6f9;
        text-align: center;
        padding-bottom: 7px;
        border-bottom: 1px solid #093868;
      }
    }
    .diagnosis-content-box {
      width: 100%;
      min-height: 70px;
      padding: 10px 10px 0px 10px;
      background-color: #041e39;
      .diagnosis-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        .diagnosis {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;
          align-items: center;
          justify-content: center;
          .title {
            margin-right: 10px;
            font-size: 14px;
          }
          .iconfont {
            color: #33ffff;
            margin: 0 8px 0px 0px;
          }
          .content {
            width: 177px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .pos-floating-window {
    position: fixed;
    z-index: 5;
    padding: 5px;
    font-size: 12px;
    li {
      height: 20px;
      line-height: 20px;
      display: flex;
      flex-direction: row;
      min-width: 120px;
    }
  }
}
</style>
