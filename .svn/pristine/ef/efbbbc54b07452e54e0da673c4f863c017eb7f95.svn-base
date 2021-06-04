<!-- 登录 -->
<template>
  <div class="login_content">
    <img
      class="login-img"
      :src="bgURL"
    />
    <select
      v-model="language"
      @change="changeLang()"
      class="select-language"
    >
      <option
        v-for="item in languages"
        :title="item.text"
        :value="item.key"
      >{{item.text}}</option>
    </select>
    <div
      class="login-box"
      @keydown.13="login"
    >
      <div
        v-if="treeName != '智能数据诊断平台'"
        class="login-title"
      >
        {{treeName}}
        <br />
        <span>{{systemName}}</span>
      </div>
      <div
        v-else
        class="login-title0"
      >
        {{treeName}}
        <br />
        <span v-show="isShowtitle">({{$t('Login.titleText')}})</span>
      </div>
      <div class="login-bar"></div>
      <div
        class="userName"
        v-show="loginFlag"
      >
        <i class="login-icon iconfont icon-zhanghaoshezhi"></i>
        <input
          type="text"
          v-model="userName"
          :placeholder="$t('Login.user')"
        />
      </div>
      <div
        class="passWord"
        v-show="loginFlag"
      >
        <i class="login-icon iconfont icon-zhongzi-mima"></i>
        <input
          type="password"
          v-model="passWord"
          :placeholder="$t('Login.password')"
          @input='changePassword()'
        />
        <p
          class="warn-tip"
          v-show="isLoginFault"
        >{{$t("Login.errorTips")}}</p>
      </div>

      <button
        class="login-btn disable-login"
        @click="login"
        ref="loginBtn"
        disabled
        v-show="loginFlag"
      >
        {{$t("Login.title")}}
      </button>
      <div
        class="remberUser"
        v-show="loginFlag"
      >
        <label for="rember">
          <i
            class="iconfont icon-zhongzi_xuanzekuang"
            ref="remberIcon"
          ></i>
          {{$t("Login.remember")}}
        </label>
        <input
          id="rember"
          type="checkbox"
          v-model="remberUser"
        />
      </div>
      <div
        class="licence_div"
        v-show="hasLicence"
      >
        <p class="licence_p">{{$t("Login.noLicence")}}</p>
        <p class="licence_p">{{$t("Login.goLicence")}}</p>
      </div>
    </div>
    <div
      class="version"
      v-show="isVersion"
    >
      <div class="versionText radius">
        {{$t("Login.copyright")}}{{ version }}
        <span v-show="loginPhoneNum != ''">| {{$t("Login.contact")}}:{{loginPhoneNum}}</span>
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
      loginFlag: true,
      hasLicence: false,
      treeName: '',
      systemName: '',
      bgURL: 'loginLogoBg_edge.png',
      isVersion: true,
      changePass: false,
      isShowtitle: true, //是否显示现场版文字
      loginPhoneNum: '', //联系方式
      isLoginFault: false, //密码错误控制显隐
      // hasLicence: true, //仅供测试使用
      languages: [
        { key: 'cn', text: '中文' },
        { key: 'en', text: '英文' },
      ],
      language: 'cn',
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
        classList.remove('icon-zhongzi_xuanzekuang')
        classList.add('icon-zhongzi_xuanzekuang1')
      } else {
        classList.remove('icon-zhongzi_xuanzekuang1')
        classList.add('icon-zhongzi_xuanzekuang')
      }
    },
  },
  //方法集合
  methods: {
    changePassword() {
      this.changePass = true
    },
    // 登录
    login() {
      if (!this.$refs.loginBtn.disabled) {
        // let pas = localStorage.getItem('hmipropassword')
        let data = new FormData()
        //若pas！=this.passWord就说明passWord输入过
        if (this.changePass) {
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
                localStorage.setItem('hmiprousername', this.userName)
                localStorage.setItem('hmipropassword', passW)
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
              this.isLoginFault = true
              break
          }
        })
      }
    },
    //切换语言
    changeLang() {
      this.$i18n.locale = this.language
      this.getVertionFun()
    },
    getVertionFun() {
      let loginName = config.loginName
      this.$getApi.getVersion().then((res) => {
        this.version = res.version
        // 是否需要声光报警
        let audioAlarm = false
        if (res.audio_alarm) {
          audioAlarm = res.audio_alarm
        }
        console.log(audioAlarm)
        sessionStorage.setItem('audioAlarm', audioAlarm)
        if (config.loginPhoneNum == 1) {
          this.loginPhoneNum = getLoginNum(Number(res.type))
        }
        // if()
        // 登录标题
        if (loginName === '') {
          if (res.type != undefined && res.type >= 0) {
            let nameArr = [
              this.$t('Login.CS2000title1'),
              this.$t('Login.DS9100title1'),
              this.$t('Login.TMS2000title1'),
              this.$t('Login.WHD9200title1'),
              this.$t('Login.Rotatetitle1'), //8000
              this.$t('Login.KJ5000title1'),
            ]
            this.treeName = nameArr[res.type]
            let systemName = [
              this.$t('Login.CS2000title2'),
              this.$t('Login.DS9100title2'),
              this.$t('Login.TMS2000title2'),
              this.$t('Login.WHD9200title2'),
              this.$t('Login.Rotatetitle2'),
              this.$t('Login.KJ5000title2'),
            ]
            this.systemName = systemName[res.type]
            if (res.type === 5 || res.type === 1) {
              this.isShowtitle = false
            } else {
              this.isShowtitle = true
            }
          } else {
            this.treeName = this.$t('Login.normaltitle')
          }
        } else {
          this.treeName = loginName
        }
      })
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    const logoFlag = config.loginlogo
    if (logoFlag != 'loginLogoBg_edge') {
      this.bgURL = `${logoFlag}.png`
      this.isVersion = false
    }
    if (
      localStorage.getItem('hmiprousername') &&
      localStorage.getItem('hmipropassword')
    ) {
      this.userName = localStorage.getItem('hmiprousername')
      this.passWord = localStorage.getItem('hmipropassword')
      this.remberUser = true
    }
    let loginName = config.loginName
    this.getVertionFun()
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
.login-img {
  height: 100%;
}
.login_content {
  $titleColor: #444; // 登录框标题颜色
  $barBgColor: #e8ecff; // 标题下分隔线颜色
  $iptBgColor: #dee6ff; // 输入框背景颜色
  $btnBgColor: #688eff; // 账号、密码图标和按钮背景颜色
  @mixin bdRadius {
    background-color: $iptBgColor !important;
    border-radius: 10px;
    height: 50px;
  }
  height: 100vh;
  overflow: hidden;
  // background-size: 100% 100% !important;
  // background-position: center top !important;
  // background: url('~assets/images/loginLogoBg_edge.png') no-repeat;
  .login-box {
    background-color: #fff;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    margin-top: -220px;
    // height: 450px;
    width: 400px;
    padding-top: 30px;
    padding-bottom: 30px;
    border-radius: 8px;
    .login-title {
      padding: 0 20px;
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
      span {
        font-size: 24px;
        font-weight: 400;
      }
    }
    .login-bar {
      width: 13%;
      height: 10px;
      background-color: $barBgColor !important;
      border-radius: 4px;
      margin: 0 auto 20px;
    }
    .userName,
    .passWord {
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
        background-color: $btnBgColor !important;
        text-align: center;
      }
      input {
        width: 240px;
        color: #000 !important;
        @include bdRadius;
        border: none;
        font-size: 20px;
        padding: 0 15px;
      }
    }
    .warn-tip {
      color: red;
      text-align: left;
      margin-top: 5px;
      padding-left: 60px;
      // font-size: ;
    }
    .login-btn {
      height: 50px;
      width: 300px;
      border-radius: 25px;
      font-size: 22px;
      background-color: $btnBgColor !important;
      margin-bottom: 20px;

      &:disabled {
        cursor: no-drop !important;
      }
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
        color: #6c91dd;
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
        color: #444;
        margin-bottom: 10px;
      }
    }
  }
  .select-language {
    position: absolute;
    right: 40px;
    top: 40px;
    width: 90px;
    height: 22px;
    background: #71aaff;
    border-color: #71aaff;
    border-radius: 2px;
    color: #fff;
    &:focus {
      border-color: #71aaff;
      outline: none;
    }
  }
  .version {
    position: fixed;
    bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    .versionText {
      background: rgba(104, 142, 255, 0.6);
      -webkit-box-shadow: 5px 5px 5px rgba(104, 142, 255, 0.6),
        -5px -5px 5px rgba(104, 142, 255, 0.6),
        -5px 5px 5px rgba(104, 142, 255, 0.6),
        5px -5px 5px rgba(104, 142, 255, 0.6);
      box-shadow: 5px 5px 5px rgba(104, 142, 255, 0.6),
        -5px -5px 5px rgba(104, 142, 255, 0.6),
        -5px 5px 5px rgba(104, 142, 255, 0.6),
        5px -5px 5px rgba(104, 142, 255, 0.6);
    }
  }
}
</style>
