<!-- 颜色选择 -->
<template>
   <!-- <div class='my-color-picker-bg'> -->
      <div class='my-color-picker-box radius box-shadow' v-show='isShow' :style='pattern' @click.stop=''>
         <div class='custom-color'>
            <div class='color-style radius' :style='"background-color: #" + colorText'  @click.stop='changeColor(colorText)'></div>
            <div class='color-number'>
               # <input type="text" class='radius' v-model='colorText' maxlength="6">
            </div>
         </div>
         <div class='standard-color select-none'>
            标准颜色
            <ul class='standard-color-list'>
               <li v-for='(item, idx) in standardColor' :key=idx :style='"background-color: " + item' @mouseenter='getColor(item)' @click.stop='changeColor(item)'></li>
            </ul>
         </div>
         <ul class='alternative-color' v-for='(item, index) in alternativeColor' :key='index'>
            <li v-for='(color, idx) in item' :key=idx :style='"background-color: " + color' @mouseenter='getColor(color)' @click.stop='changeColor(color)'></li>
         </ul>
         <div class='usual-color select-none'>
            常用颜色
            <ul class='usual-color-list'>
               <li v-for='(item, idx) in usualColor' :key=idx :style='"background-color: " + item' @mouseenter='getColor(item)' @click.stop='changeColor(item)'></li>
            </ul>
         </div>
      </div>
   <!-- </div> -->
</template>

<script>
// import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
   components: {},
   props: {
      pattern: {
         type: Object,
         default: function () {
            return {};
         },
      },
      color: {
         type: String,
         default: '',
      }
   },
   data() {
      return {
         moreColor: '#ccc',
         standardColor: ['#FF1900', '#FE9300', '#FDCB03', '#FBFF0A', '#84CB0A', '#008F5A', '#1196BC', '#316DB4', '#733195'], /* 标准颜色 */
         alternativeColor: [ /* 颜色选择 */
            ['#FFBAAD', '#F0CD65', '#F1E4BC', '#EDEE84', '#D4EC9D', '#A0E6BD', '#6FB3CD', '#D9E2EA', '#CDA4D7'],
            ['#FF623B', '#F1B232', '#EAD07B', '#E9EC46', '#BDE970', '#74DEA8', '#3093B5', '#A9BFE2', '#A25DB5'],
            ['#FF4E15', '#EE8500', '#F3D615', '#DCE200', '#88D600', '#009B3E', '#0083C5', '#7297D4', '#86349A'],
            ['#D74D28', '#CE7900', '#EBC500', '#BEBE00', '#70BA00', '#009B3E', '#007FC0', '#356ABB', '#732284'],
            ['#9D3E25', '#9F650A', '#EBBA00', '#ACA700', '#6D9604', '#007837', '#00578B', '#002F92', '#681A76'],
            ['#723A2C', '#6F5B29', '#CB9E4A', '#9A9300', '#52601D', '#205937', '#002F50', '#001577', '#5F1D67']],
         usualColor: ['#000000', '#3300CC', '#CCCC00', '#993366', '#00CC99', '#996666', '#6666FF', '#999699', '#CC9933'], /* 常用颜色 */
         isShow: false,
         colorText: '',
         promise: '',
         resolve: '',
         reject: '',
      };
   },
   computed: {},
   watch: {
      moreColor(val) {
         this.color = val;
      },
      /* colorText(newVal, oldVal) {
         if (/[^abcdef\d]/ig.test(newVal)) {
            this.colorText = oldVal;
         }
      }, */
   },
   methods: {
      // 打开颜色选择
      openColor() {
         this.isShow = true;
         const top = parseInt(this.pattern.top)
         if (window.innerHeight < top + 250) {
            this.pattern.top = `${top - 251 - 12}px`;
         }
         this.colorText = this.color.slice(1);
         this.moreColor = this.color;
         setTimeout(() => {
            document.body.addEventListener('click', this.closeList)
         }, 100)
         this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
         });
         return this.promise;
      },
      // 关闭列表
      closeList() {
         this.isShow = false;
         setTimeout(() => {
            document.body.removeEventListener('click', this.closeList)
         }, 100)
         const color = this.color.indexOf('#') > -1 ? this.color : `#${this.color}`;
         this.resolve(color);
         this.remove();
      },
      // 鼠标移入颜色框
      getColor(color) {
         this.colorText = color.slice(1);
      },
      // 修改颜色
      changeColor(color) {
         this.color = color;
         this.moreColor = color;
         this.closeList();
      },
      // 点击更多颜色
      getMoreColor() {
         this.$refs.getMoreColor.click();
      },
      // 移除组件
      remove() {
         setTimeout(() => {
            this.$destroy();
            document.getElementById('app').removeChild(this.$el);
         })
      },
   },
   // 生命周期 - 创建完成（可以访问当前this实例）
   created() {
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
   .my-color-picker-box {
      z-index: 10;
      position: absolute;
      font-size: 12px;
      padding: 0 10px 10px;
      width: 190px;
      .custom-color {
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         align-items: center;
         height: 40px;
         .color-style {
            width: 70px;
            height: 20px;
         }
         .color-number {
            height: 40px;
            line-height: 40px;
            input {
               width: 70px;
               height: 20px;
               padding: 0 10px;
               font-size: 12px;
            }
         }
      }
      .standard-color-list, .alternative-color, .usual-color-list {
         display: flex;
         justify-content: space-between;
         align-items: center;
         height: 26px;
      }
      .alternative-color {
         flex-wrap: wrap;
         align-items: center;
         height: 15px;
      }
      li {
         height: 14px;
         width: 14px;
         &:hover {
            transform: scale(1.2);
         }
         transition: all .3s;
      }
      .usual-color {
         margin-top: 10px;
      }
   }
   .more-color {
     position: relative;
      input {
        //  display: none;
      }
   }
   .color-input {
      display: none;
   }
</style>
