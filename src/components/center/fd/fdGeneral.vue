<template>
  <div>
    <div
      v-for="(param,key) in general"
      v-show="param.isShow"
      style="height:100%"
    >
      <div class="general-search">
        <input
          type="text"
          v-model="searchKey"
          :placeholder="$t('FdGeneral.searchHolder')"
        />
        <i class="iconfont icon-sousuo"></i>
      </div>
      <div class="general-view">
        <div class="general-view-title">
          <div class="general-view-itemize">
            <a
              class="general-view-item"
              :class="{ active: item.chooseflag }"
              v-for="(item, index) in param.itemize"
              @click="filterByStatus(item)"
            >
              {{ item.name }} {{ item.number }}
            </a>
          </div>
        </div>
        <div class="line"></div>
        <div
          class="general-scroll"
          :ref='"general_scroll" +key'
        >
          <div
            v-resize="resize"
            class="general-view-content"
            ref="general_content"
          >
            <div
              v-for="(item, index) in param.searchmac"
              class="view-content"
              @click="choosemac"
              :class="{
              active: item.chooseflag,
              'general-view-citem': item.type === 1,
              'general-view-citem-warning': item.type === 2,
              'general-view-citem-abnormal': item.type === 6,
              'general-view-citem-alarm': item.type === 3,
              'general-view-citem-offline': item.type === 4
            }"
              v-show="item.isShow"
              @dblclick="toMacModel(item, 'windModel')"
            >
              <div class="general-view-ctitle">
                <div
                  class="general-view-f2"
                  :title="item.name"
                >
                  {{ item.name }}
                </div>
                <i
                  @click="collection(item)"
                  :class="[
                  'iconfont',
                  item.isFocus
                    ? 'icon-mianxing_fuzhi_huaban1 focusColor'
                    : 'icon-shoucang'
                ]"
                ></i>
              </div>
              <div class="general-view-ccontent">
                <div class="ccontent-imgs">
                  <!-- 转速为0时 -->
                  <img
                    v-if="item.speed === 0"
                    class="ccontent-img1"
                    src="~assets/images/fd/fan.png"
                  />
                  <!-- 转速非0时 -->
                  <img
                    v-else
                    class="ccontent-img1"
                    src="~assets/images/fd/fan.gif"
                  />
                  <img
                    class="ccontent-img2"
                    src="~assets/images/fd/fengdian.png"
                  />
                </div>
                <div class="ccontent">
                  <div>{{$t('FdGeneral.statusText')}} {{ item.status }}</div>
                  <div>
                    {{$t('FdGeneral.speedText')}}
                    <span v-if="item.speed !== null || item.speed !== undefined">{{ item.speed }}rpm</span>
                    <span v-else>0rpm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <!-- v-show="pagecount === 1 && pagecount<pagesum" -->
        <div class="general-view-page">
          <div
            class="pageimg-f"
            @click="turnPage"
          >
            <div
              v-show="param.downShow"
              class="paging-img"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import general from 'common/general/general.js'
export default {
  name: 'fdGeneral',
  mixins: [general],
  data() {
    return {
      t_root: 0,
    }
  },
  watch: {
    '$store.state.fdGeneralMsg': {
      handler(value) {
        if (value.length !== 0) {
          while (value.length) {
            let item = value.shift()
            this.openChartList(item.key, item.state)
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$store.commit('set_keepAlive', {
      method: 'add',
      keepAlive: 'fdGeneral',
    })
  },
  methods: {},
}
</script>

<style scoped lang="scss">
@import '@/assets/style/css/fd.scss';
</style>
