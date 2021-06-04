<!-- 主页 -->
<template>
   <div class='index-content'>
      <my-head ref='header'></my-head>
      <div class='view-content-left' ref='viewContent'>
         <my-list v-show='leftRetract'></my-list>
         <div class='retract'>
            <label class='retract-btn radius' for='left-isRetract'>
               <i class='iconfont' :class='leftIcon' ref='retractIcon'></i>
            </label>
            <input type="checkbox" id='left-isRetract' v-model='leftRetract' v-show='false'>
         </div>
         <chart-table ref='chartTable'>
         </chart-table>
         <div class='retract'>
            <label class='retract-btn radius' for='right-isRetract'>
               <i class='iconfont' :class='rightIcon' ref='retractIcon'></i>
            </label>
            <input type="checkbox" id='right-isRetract' v-model='rightRetract' v-show='false'>
         </div>
         <my-report class='radius box-shadow' v-show='rightRetract'></my-report>
      </div>
      <report-template v-show='false' ref='exportReport'></report-template>
   </div>
</template>

<script>
// import 《组件名称》 from '《组件路径》';
import MyHead from '@/components/head/header';
import MyList from '@/components/left/list';
import ChartTable from '@/components/center/chartTable';
import MyReport from '@/components/right/report/report.vue';
import ReportTemplate from './report';
import { cloneObj, changeClass } from 'utils/utils.js';

export default {
  // import引入的组件需要注入到对象中才能使用
   components: {
      MyHead,
      MyList,
      ChartTable,
      MyReport,
      ReportTemplate,
   },
   props: [],
   data() {
      return {
         leftRetract: true,
         rightRetract: false,
         leftIcon: 'icon-xiangyou_huaban',
         rightIcon: 'icon-xiangyou_huaban',
      };
   },
   computed: {},
   watch: {
      leftRetract(val) {
         const el = this.$refs.viewContent;
         if (val) {
            this.leftIcon = 'icon-xiangyou_huaban';
            this.rightRetract ? changeClass(el, 'view-content-left-right', el.className) : changeClass(el, 'view-content-left', el.className)
         } else {
            this.leftIcon = 'icon-xiangzuo_huaban';
            this.rightRetract ? changeClass(el, 'view-content-right', el.className) : changeClass(el, 'view-content', el.className)
         }
         this.$store.commit('changeDomStructure')
      },
      rightRetract(val) {
         const el = this.$refs.viewContent;
         if (val) {
            this.rightIcon = 'icon-xiangzuo_huaban';
            this.leftRetract ? changeClass(el, 'view-content-left-right', el.className) : changeClass(el, 'view-content-right', el.className)
         } else {
            this.rightIcon = 'icon-xiangyou_huaban';
            this.leftRetract ? changeClass(el, 'view-content-left', el.className) : changeClass(el, 'view-content', el.className)
         }
         this.$store.commit('changeDomStructure')
      },
   },
   methods: {
   },
   // 生命周期 - 创建完成（可以访问当前this实例）
   created() {
      if (sessionStorage.getItem('user') === null || sessionStorage.getItem('token') === null || sessionStorage.getItem('tree') === null) {
         this.$router.push({name: 'login'})
      }
   },
   // 生命周期 - 挂载完成（可以访问DOM元素）
   mounted() {
   },
   // 生命周期 - 创建之前
   beforeCreate() {
   },
   // 生命周期 - 挂载之前
   beforeMount() {
   },
   // 生命周期 - 更新之前
   beforeUpdate() {
   },
   // 生命周期 - 更新之后
   updated() {
   },
   // 生命周期 - 销毁之前
   beforeDestroy() {
   },
   // 生命周期 - 销毁完成
   destroyed() {
   },
   // 如果页面有keep-alive缓存功能，这个函数会触发
   activated() {
   },
}
</script>
<style scoped lang='scss'>
   .index-content {
      display: grid;
      grid-template-rows: auto calc(100vh - 102px);
   }
   .view-content {
      display: grid;
      grid-template-columns: 14px calc(100% - 28px) 14px;
   }
   .view-content-left {
      display: grid;
      grid-template-columns: 220px 14px calc(100% - 248px) 14px;
   }
   .view-content-right {
      width: 100vw;
      display: grid;
      grid-template-columns: 14px calc(100% - 228px) 14px 200px;
   }
   .view-content-left-right {
      width: 100vw;
      display: grid;
      grid-template-columns: 220px 14px calc(100% - 448px) 14px 200px;
   }
   .retract {
      display: flex;
      align-items: center;
      height: 100%;
      width: 14px;
      z-index: 1;
      .retract-btn {
         height: 42px;
         line-height: 42px;
         width: 14px;
         cursor: pointer;
         .iconfont {
            vertical-align: 2px;
            font-size: 12px;
         }
      }
      #right-isRetract {
         display: none;
      }
   }
   .retract-view {
      grid-template-columns: 0 100%;
   }
</style>
