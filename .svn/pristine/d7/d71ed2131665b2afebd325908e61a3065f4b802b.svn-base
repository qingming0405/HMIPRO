<!-- 登录 -->
<template>
  <div class="login_content">
    <div
      class="login-box"
      @keydown.13="login"
    >
      <div
        class="login-title0"
      >
        智能数据诊断平台
      </div>
      <div class="login-bar"></div>
      <div
        class="userName"
        v-show="loginFlag"
      >
        <i class="login-icon iconfont icon-zhanghao"></i>
        <input
          type="text"
          v-model="userName"
          placeholder="请输入您的用户名"
        />
      </div>
      <div
        class="passWord"
        v-show="loginFlag"
      >
        <i class="login-icon iconfont icon-mima"></i>
        <input
          type="password"
          v-model="passWord"
          placeholder="请输入您的密码"
          @input='changePassword()'
        />
      </div>
      <div
        class="remberUser"
        v-show="loginFlag"
      >
        <label for="rember">
          <i
            class="iconfont icon-zhongzi_xuanzekuang"
            ref="remberIcon"
          ></i>
          记住密码
        </label>
        <input
          id="rember"
          type="checkbox"
          v-model="remberUser"
        />
      </div>
      <button
        class="login-btn disable-login"
        @click="login"
        ref="loginBtn"
        disabled
        v-show="loginFlag"
      >
        登录
      </button>
      <div
        class="licence_div"
        v-show="hasLicence"
      >
        <p class="licence_p">未注册License</p>
        <p class="licence_p">请前往配置管理中心注册</p>
      </div>
    </div>
    <div class="version">
      <div class="versionText radius">
        版权所有：浙江中自庆安新能源技术有限公司{{ version }}
      </div>
    </div>
  </div>
</template>

<script>
  //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  //例如：import 《组件名称》 from '《组件路径》';
  import md5 from 'js-md5'
  // import hex_md5 from 'md5-hex';
  export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
      //这里存放数据
      return {
        userName: '',
        passWord: '',
        remberUser: false,
        version: '',
        // backgroundStyle: {
        //   //背景图
        //   background: `url(${require("assets/images/loginLogoBg_edge.png")})`,
        //   backgroundRepeat: "no-repeat"
        // },
        loginFlag: true,
        hasLicence: false,
        treeName: '',
        changePass:false,
        // hasLicence: true, //仅供测试使用
      }
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {
      userName(val) {
        if (val !== '' && this.passWord !== '') {
          this.$refs.loginBtn.disabled = false
        } else {
          this.$refs.loginBtn.disabled = true
        }
      },
      passWord(val) {
        this.isEncryption = false
        if (val !== '' && this.userName !== '') {
          this.$refs.loginBtn.disabled = false
        } else {
          this.$refs.loginBtn.disabled = true
        }
      },
      remberUser(val) {
        let classList = this.$refs.remberIcon.classList
        if (val) {
          classList.remove('icon-duoxuankuangbugouxuan_huaban1_huaban1')
          classList.add('icon-xuanzhong')
        } else {
          classList.remove('icon-xuanzhong')
          classList.add('icon-duoxuankuangbugouxuan_huaban1_huaban1')
        }
      },
    },
    //方法集合
    methods: {
      changePassword(){
        this.changePass = true
      },
      // 登录
      login() {
        if (!this.$refs.loginBtn.disabled) {
          // let pas = localStorage.getItem('hmipropassword')
          let data = new FormData()
          //若pas！=this.passWord就说明passWord输入过
          if (this.changePass){
            data.append('username', this.userName)
            data.append('password', md5('cmc' + this.passWord))
          } else {
            data.append('username', this.userName)
            data.append('password', this.passWord)
          }
          this.$getApi.login(data).then((res) => {
            switch (res.msg) {
              case 0:
                if (this.remberUser) {
                  var passW = this.passWord
                  if (this.changePass) {
                    passW = md5('cmc' + this.passWord)
                  }
                  localStorage.setItem('hmiprousername',this.userName)
                  localStorage.setItem('hmipropassword',passW)
                }
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
                break
            }
          })
        }
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      if(localStorage.getItem('hmiprousername') && localStorage.getItem('hmipropassword')){
        this.userName = localStorage.getItem('hmiprousername');
        this.passWord = localStorage.getItem('hmipropassword');
        this.remberUser = true
      }
      this.$getApi.getVersion().then((res) => {
        this.version = res.version
        if (res.type != undefined && res.type >= 0) {
          let nameArr = [
            'CS2000 风电机组',
            'DS9100 水泥厂设备',
            'TMS2000 车辆走行部',
            'WHD9200 油气井',
          ]
          this.treeName = nameArr[res.type]
        } else {
          this.treeName = '智能数据诊断平台'
        }
      })
      this.$getApi
        .getLicense()
        .then((res) => {
          if (res.error === 0) {
            this.hasLicence = false
            this.loginFlag = true
          } else {
            this.hasLicence = true
            this.loginFlag = false
          }
        })
        .catch(function (err) {
          // console.log('failed', err)
        })
    },
  }
</script>
<style scoped lang="scss">
  .login_content {
    $titleColor: #fff; // 登录框标题颜色
    $barBgColor: #41ACEF; // 标题下分隔线颜色
    $iptBgColor: #dee6ff; // 输入框背景颜色
    $btnBgColor: #1171B4; // 账号、密码图标和按钮背景颜色
    $fontFamily: 'SourceHanSansCN-Regular';//字体
    @mixin bdRadius {
      background-color: $iptBgColor !important;
      border-radius: 10px;
      height: 50px;
    }
    height: 100vh;
    overflow: hidden;
    background-size: 100% 100% !important;
    background-position: center top !important;
    background: url('~assets/images/remo/remoLoginBg.png') no-repeat;
    .login-box {
      background: url('~assets/images/remo/remoLoginBlock.png') no-repeat;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -381px;
      margin-top: -350px;
      height: 677px;
      width: 762px;
      padding-top: 120px;
      font-family: $fontFamily;
      .login-title {
        color: #0060d7;
        font-size: 30px;
        margin-bottom: 18px;
        font-weight: bold;
        text-shadow: 0px 10px 5px rgba(37, 124, 255, 0.2);
        span {
          color: $titleColor;
          font-size: 24px;
          font-weight: 400;
          text-shadow: 0px 0px 0px;
        }
      }
      .login-title0 {
        color: $titleColor;
        font-size: 30px;
        margin-bottom: 18px;
        font-weight: 500;
        letter-spacing: 8px;
        span {
          font-size: 24px;
          font-weight: 400;
        }
      }
      .login-bar {
        width: 18%;
        height: 1px;
        background-color: $barBgColor !important;
        border-radius: 4px;
        margin: 0 auto 50px;
      }
      .userName,
      .passWord {
        width: 300px;
        height: 50px;
        margin: 0 auto 30px;
        position: relative;
        border: 1px solid $barBgColor;
        text-align: right;
        background: $btnBgColor;
        .iconfont {
          position: absolute;
          left: 0;
          top: 0;
          width: 60px;
          font-size: 24px;
          line-height: 50px;
          text-align: center;
          color: #6EEFFC;
        }
        input {
          width: 240px;
          height: 48px;
          color: #fff !important;
          border: none;
          font-size: 20px;
          padding: 0 15px;
          background: $btnBgColor!important;
          &::-webkit-input-placeholder { /* WebKit browsers */
            color: #fff;
            opacity: 0.7;
          }
          &::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #fff;
            opacity: 0.7;
          }
          &:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #fff;
            opacity: 0.7;
          }
          &:-webkit-autofill {
            -webkit-text-fill-color: #fff !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        }
      }
      .login-btn {
        height: 50px;
        width: 300px;
        font-size: 22px;
        border-radius: 0;
        background-color: $btnBgColor !important;
        color: #fff;
        &:hover,&:focus{
          background: #46B0E2 !important;
        }
      }
      .remberUser {
        text-align: left;
        width: 300px;
        margin: -10px auto 55px;
        font-size: 14px;
        label {
          display: block;
          height: 30px;
          line-height: 30px;
          color: #fff;
        }
        .iconfont {
          font-size: 18px;
          vertical-align: -2px;
        }
        .icon-zhongzi_xuanzekuang {
          color: $btnBgColor;
        }
        .icon-zhongzi_xuanzekuang1 {
          color: $btnBgColor;
        }
        #rember {
          display: none;
        }
      }
      .licence_div {
        margin-top: 80px;
        margin-bottom: 80px;
        .licence_p {
          font-size: 20px;
          color: #fff;
          margin-bottom: 10px;
        }
      }
    }
    .version {
      position: fixed;
      bottom: 30px;
      width: 100%;
      display: flex;
      justify-content: center;
      .versionText {
        background: transparent;
        box-shadow: none;
      }
    }
  }
</style>
