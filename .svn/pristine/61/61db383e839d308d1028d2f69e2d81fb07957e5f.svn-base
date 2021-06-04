<!-- 登录 -->
<template>
  <div class='login_content'>
      <div class='login-box' @keydown.13='login'>
         <div class='login-title'>
            智能数据诊断平台
            <br>
            <span>(专家版)</span>
         </div>
         <div class='login-bar'></div>
         <div class='userName'>
            <i class='login-icon iconfont icon-zhanghaoshezhi'></i>
            <input type="text" v-model='userName' placeholder="账号">
         </div>
         <div class='passWord'>
            <i class='login-icon iconfont icon-zhongzi-mima'></i>
            <input type="password" v-model='passWord' placeholder="密码">
         </div>
         <button class='login-btn disable-login' @click='login' ref='loginBtn' disabled>登录</button>
         <div class='remberUser'>
            <label for="rember">
               <i class='iconfont icon-zhongzi_xuanzekuang' ref='remberIcon'></i>
               记住密码
            </label>
            <input id='rember' type="checkbox" v-model='remberUser'>
         </div>
      </div>
      <div class='version'>
         <div class='versionText radius'>
            版权所有：浙江中自庆安新能源技术有限公司{{version}}
         </div>
      </div>
   </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import md5 from 'js-md5';

export default {
   //import引入的组件需要注入到对象中才能使用
   components: {
   },
   data() {
      //这里存放数据
      return {
         userName: '',
         passWord: '',
         remberUser: false,
         version: '',
      };
   },
   //监听属性 类似于data概念
   computed: {},
   //监控data中的数据变化
   watch: {
      userName(val) {
         this.$refs.loginBtn.disabled = val === '' || this.passWord === ''
      },
      passWord(val) {
         this.$refs.loginBtn.disabled = val === '' || this.userName === ''
      },
      remberUser(val) {
         let classList = this.$refs.remberIcon.classList;
         if (val) {
            classList.remove('icon-zhongzi_xuanzekuang');
            classList.add('icon-zhongzi_xuanzekuang1');
         } else {
            classList.remove('icon-zhongzi_xuanzekuang1');
            classList.add('icon-zhongzi_xuanzekuang');
         }
      }
   },
   //方法集合
   methods: {
      // 设置cookie
      // setCookie() {
      //    if (this.remberUser) {
      //       const time = new Date(Date.now() + 30 * 24 * 3600 * 1000).toUTCString();
      //       document.cookie = `hmiprousername=${this.userName};expires=${time}`;
      //       document.cookie = `hmipropassword=${this.passWord};expires=${time}`;
      //    } else {
      //       document.cookie = `hmiprousername=;expires=-1`;
      //       document.cookie = `hmipropassword=;expires=-1`;
      //    }
      // },
      // 登录
      login() {
        if (!this.$refs.loginBtn.disabled) {
        let pas = localStorage.getItem('hmipropassword')
        let data = new FormData()
        if (this.passWord != pas){
          if (this.remberUser) {
            var passW = md5('cmc' + this.passWord)
            localStorage.setItem('hmiprousername',this.userName)
            localStorage.setItem('hmipropassword',passW)
          }
          data.append('username', this.userName)
          data.append('password', md5('cmc' + this.passWord))
        } else {
          data.append('username', this.userName)
          data.append('password', this.passWord)
        }
        this.$getApi.login(data).then((res) => {
          switch (res.msg) {
            case 0:
              sessionStorage.setItem('token', res.token)
              sessionStorage.setItem('user', JSON.stringify(res.user))
              sessionStorage.setItem('tree', JSON.stringify(res.t_ids))
              this.$router.push({ name: 'index' })
              break
            case 1:
              this.$pop('系统出错，请刷新后重试')
              break
            case 2:
            case 3:
              this.$pop('用户名或密码错误')
              localStorage.removeItem('hmiprousername');
              localStorage.removeItem('hmipropassword')
              break
          }
        })
      }
        //  if (!this.$refs.loginBtn.disabled) {
        //     this.setCookie()
        //     let data = new FormData();
        //     data.append('username', this.userName);
        //     data.append('password', md5("cmc"+this.passWord));
        //     this.$getApi.login(data).then(res => {
        //        switch(res.msg) {
        //           case 0:
        //              sessionStorage.setItem('token', res.token);
        //              sessionStorage.setItem('user', JSON.stringify(res.user));
        //              sessionStorage.setItem('tree', JSON.stringify(res.t_ids));
        //              this.$router.push({name: 'index'})
        //              break;
        //           case 1:
        //              this.$pop('系统出错，请刷新后重试');
        //              break;
        //           case 2:
        //           case 3:
        //              this.$pop('用户名或密码错误');
        //              break;
        //        }
        //     })
        //  }
      },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
     this.userName = localStorage.getItem('hmiprousername');
     this.passWord = localStorage.getItem('hmipropassword');
     if (this.userName !== '' && this.passWord !== '') {
        this.remberUser = true;
     }
     this.$getApi.getVersion().then(res => {
        this.version = res.version;
     })
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
  },
  //生命周期 - 创建之前
  beforeCreate() {
  },
  //生命周期 - 挂载之前
  beforeMount() {
  },
  //生命周期 - 更新之前
  beforeUpdate() {
  },
  //生命周期 - 更新之后
  updated() {
  },
  //生命周期 - 销毁之前
  beforeDestroy() {
  },
  //生命周期 - 销毁完成
  destroyed() {
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {
  },
}
</script>
<style scoped lang='scss'>
   .login_content {
      $titleColor: #444;  // 登录框标题颜色
      $barBgColor: #e8ecff;  // 标题下分隔线颜色
      $iptBgColor: #DEE6FF;  // 输入框背景颜色
      $btnBgColor: #688eff;  // 账号、密码图标和按钮背景颜色
      @mixin bdRadius {
         background-color: $iptBgColor;
         border-radius: 10px;
         height: 50px;
      }
      background-image: url('../assets/images/loginLogoBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .login-box {
         background-color: #fff;
         text-align: center;
         position: absolute;
         top: 50%;
         left: 50%;
         margin-left: -200px;
         margin-top: -225px;
         height: 450px;
         width: 400px;
         padding-top: 30px;
         border-radius: 8px;
         .login-title {
            color: $titleColor;
            font-size: 30px;
            margin-bottom: 18px;
            span {
               font-size: 20px;
            }
         }
         .login-bar {
            width: 13%;
            height: 10px;
            background-color: $barBgColor;
            border-radius: 4px;
            margin: 0 auto 20px;
         }
         .userName, .passWord {
            width: 300px;
            margin: 0 auto 40px;
            position: relative;
            @include bdRadius;
            text-align: right;
            .iconfont {
               position: absolute;
               left: 0;
               top: 0;
               width: 60px;
               font-size: 24px;
               line-height: 50px;
               @include bdRadius;
               background-color: $btnBgColor;
               text-align: center;
            }
            input {
               width: 240px;
               @include bdRadius;
               border: none;
               font-size: 20px;
               padding: 0 15px;
            }
         }
         .login-btn {
            height: 50px;
            width: 300px;
            border-radius: 25px;
            font-size: 22px;
            background-color: $btnBgColor;
            margin-bottom: 20px;
         }
         .remberUser {
            text-align: left;
            width: 300px;
            margin: 0 auto;
            font-size: 14px;
            label {
               display: block;
               height: 30px;
               line-height: 30px;
               color: #676767;
            }
            .iconfont {
               font-size: 18px;
               vertical-align: -2px;
            }
            .icon-zhongzi_xuanzekuang {
               color: #959595;
            }
            .icon-zhongzi_xuanzekuang1 {
               color: #6C91DD;
            }
            #rember {
               display: none;
            }
         }
      }
      .version {
         position: fixed;
         bottom: 30px;
         width: 100%;
         display: flex;
         justify-content: center;
      }
   }
</style>
