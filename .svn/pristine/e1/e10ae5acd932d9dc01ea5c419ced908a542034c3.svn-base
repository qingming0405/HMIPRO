<template>
  <div style="height:100%;">
    <div
      :class='"sn-general"+key'
      class="sn-general"
      v-resize="resize"
      :ref="'sn_general'+key"
      v-for="(param,key) in general"
      v-show="param.isShow"
    >
      <div class="title-text">{{param.generalTitle}}</div>
      <div class="treeList">
        <div
          v-for="tree in param.treeList"
          :class="tree.isClick ? 'div-click' : ''"
          @click="clickTree(tree)"
        >
          <p>{{ tree.t_name }}</p>
        </div>
      </div>
      <div
        v-show="param.title.name!=''"
        class="sn-title"
      >
        <div :style="'font-size:'+param.title.fontsize+';z-index: 10;'">{{param.title.name}}</div>
      </div>
      <div
        class="background"
        :style="param.backgroundStyle"
        v-show="param.isShowBackground"
      ></div>
      <div
        :class='"general-div"+key'
        class="general-div"
        v-show="!param.isShowBackground"
        ref='general_div'
      >
        <img
          class="general-img"
          :src="param.generalImg"
          alt=""
        />
        <div
          class="pumpIcon"
          v-for="item in param.itemList"
          :style="item.style"
          v-show="param.version == 0"
        >
          <img
            @dblclick="jumpToModel(item)"
            :src="item.imgSrc"
            alt=""
          />
          <i
            :class="
            item.isCheck
              ? 'iconfont icon-mianxing_fuzhi_huaban1'
              : 'iconfont icon-shoucang'
          "
            @click="choosePump(item)"
          ></i>
          <p>{{ item.pump_name }}</p>
        </div>
        <div
          class="pumpIcon"
          v-for="item in param.itemList"
          v-show="param.version == 1"
        >
          <div
            @dblclick="jumpToModel(item)"
            :style="item.PumpStyle"
            style="z-index: 20;"
          ></div>
          <div
            :style="item.style"
            style="margin:5px;display:flex;justify-content:center;align-items:center;"
          >
            <p style="font: 400 13.3333px Arial;fontSize:16px;text-aline:center;">
              {{ item.pump_name }}
            </p>
            <i
              :style="item.iconfontstyle"
              :class="
            item.isCheck
              ? 'iconfont icon-mianxing_fuzhi_huaban1'
              : 'iconfont icon-shoucang'
          "
              @click="choosePump(item)"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneObj } from 'utils/utils.js'
import snGeneral from 'common/general/sn/snGeneral.js'
export default {
  name: 'snGeneral',
  mixins: [snGeneral],
  data() {
    return {}
  },
  methods: {
    /* 设置每个机泵的参数 */
    setPump(result) {
      const param = this.general[this.currentKey]
      param.itemList = [] //置空
      let itemList = []
      if (result.itemList) {
        itemList = result.itemList
      }
      let t_id = result.tree_id
      itemList.forEach((item) => {
        /* 需要的机泵对象 */
        let obj = {}
        /*
         pump_name:机泵名称
         mac_id:机组id
         t_id：组织id
         pump_id:机泵id
         imgSrc:图片的地址
         style：整体图片的样式（包括收藏的星星）
          -position:absolute
          -left
          -top
        imgStyle:机泵图片的样式
        isCheck：是否被选中
        msg:原始的所有信息
         */
        // obj.imgStyle = {
        //   height: item.pheight + "px",
        //   width: item.pwidth + "px"
        // };
        let imgInfo = this.getPumpImg(item.pump_type)
        obj.pump_name = item.pump_name
        obj.t_id = t_id
        obj.mac_id = item.machine_id
        obj.pump_id = item.pump_id
        obj.msg = item
        obj.style = {
          position: 'absolute',
          left: param.backgroundImgWH.w * item.px + 'px',
          top: param.backgroundImgWH.h * item.py + 'px',
        }

        obj.isCheck = item.isFocus ? true : false
        let imgName = imgInfo.machine
        // 0/null 离线 1正常 2 预警 3 报警
        let alarmStatus = item.alarm_status
        alarmStatus || (alarmStatus = 0)
        obj.imgSrc = require(`assets/images/sn/cement_machine_model/${
          imgName + alarmStatus
        }.png`)
        param.itemList.push(obj)
      })
    },
    //机泵类型分类
    getPumpImg: function (pump_type) {
      var machineImg = {}
      switch (Number(pump_type)) {
        case 1:
          machineImg = {
            machine: 'gunyaji',
            itemType: 9,
            width: 42,
            height: 25,
          }
          break
        case 4:
        case 5:
          machineImg = {
            machine: 'shuinimo',
            itemType: 8,
            width: 66,
            height: 21,
          }
          break
        case 6:
        case 7:
          machineImg = {
            machine: 'huizhuanyao',
            itemType: 10,
            width: 66,
            height: 21,
          }
          break
        case 8:
        case 9:
          machineImg = {
            machine: 'limo',
            itemType: 5,
            width: 35,
            height: 53,
          }
          break
        case 10:
          machineImg = {
            machine: 'shuliaolalianji',
            itemType: 12,
            width: 80,
            height: 40,
          }
          break
        case 11:
        case 12:
          machineImg = {
            machine: 'tishengji',
            itemType: 2,
            width: 31,
            height: 72,
          }
          break
        case 13:
          machineImg = {
            machine: 'yurefadianji',
            itemType: 11,
            width: 67,
            height: 23,
          }
          break
        case 14:
        case 15:
        case 16:
          machineImg = {
            machine: 'fengji',
            itemType: 1,
            width: 44,
            height: 49,
          }
          break
        case 17:
        case 18:
          machineImg = {
            machine: 'posuiji',
            itemType: 3,
            width: 35,
            height: 34,
          }
          break
        default:
          machineImg = {
            machine: 'yurefadianji',
            itemType: 14,
            width: 80,
            height: 40,
          }
          break
      }
      return machineImg
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/style/css/fd.scss';
.title-text {
  position: absolute;
  display: flex;
  top: -60px;
  left: 10px;
}
.background {
  width: 100%;
  height: 100%;
}
.sn-title {
  z-index: 10;
}

.pumpIcon {
  p {
    font-size: 14px;
    white-space: nowrap;
  }
}
</style>
