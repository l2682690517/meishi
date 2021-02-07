<template lang="pug">
  div.background
    div.head
      div.head-box
        div.title 百宝美市管理后台
        div.help(@click="toHelp") 帮助文档
    div.body
      div.login-container
        el-form(ref="formLogin", :model="form", :rules="rules", labelPosition="left", labelWidth="0")
          div.title
          el-form-item(prop="mobile")
            div.icon
              svg-icon(icon="account")
            el-input(type="text", placeholder="手机号", v-model="form.mobile")
          el-form-item(prop="passwd")
            div.icon
              svg-icon(icon="key")
            el-input(type="password", placeholder="密码", v-model="form.passwd")
          el-form-item(prop="capt_code")
            div.captcha
              div.icon.tip
                svg-icon(icon="captcha")
              div.code
                el-input(type="text", placeholder="验证码", v-model="form.capt_code")
              div.img(v-lazy:background-image="capt_img", @click="getVerification")
          el-form-item(style="border: none")
            el-button.loginBtn(type="primary", @click="handleLogin", :loading="loading") 登录
        div.login-container-bottom
          div.tel-icon
          div.tel-number 客服专线：400-1009-1857
    div.bottom
      div.company ©copyright 2018 宿迁市兴宝科技有限公司
</template>

<script>
  import {login, Verification} from 'src/api/auth'

  export default {
    components: {},
    data () {
      return {
        loading: false,
        capt_img: '',
        form: {
          mobile: '',
          passwd: '',
          capt_code: '',
          capt_id: ''
        },
        rules: {
          mobile: [
            {
              required: true, trigger: 'blur', message: '请输入手机号'
            }
          ],
          passwd: [
            {
              required: true, trigger: 'blur', message: '请输入密码'
            }
          ],
          capt_code: [
            {
              required: true, trigger: 'blur', message: '请输入验证码'
            }
          ]
        }
      }
    },
    methods: {
      toHelp () {
        let url = 'https://shimo.im/docs/GbWZLMVBXUIPToLE/'
        window.open(url)
      },
      handleLogin () {
        this.$refs.formLogin.validate(async valid => {
          if (valid) {
            this.loading = true
            try {
              await login(this.form)
              this.$router.replace({
                name: 'Dashboard'
              })
            } catch (err) {
              this.getVerification()
            } finally {
              this.loading = false
            }
          }
        })
      },
      async getVerification () {
        this.form.capt_code = ''
        this.form.capt_id = ''
        const resCaptcha = await Verification()
        this.form.capt_id = resCaptcha.data.id
        this.capt_img = resCaptcha.data.url
      }
    },
    mounted () {
      this.getVerification()
    }
  }
</script>

<style lang="scss" scoped>

  $bg-color: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .background {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 100%;
    @include bg-img(url("../../../assets/image/bg.png"))
  }
  .body{
    width: 100%;
    position: fixed;
    height: 92%;
    top: 8%;
  }
  .login-container-bottom{
    position: absolute;
    display: inline-flex;
    align-items: center;
    bottom: 5%;
    left: 50%;
    transform: translate(-50%);
    .tel-icon {
      width: 16px;
      height: 16px;
      @include bg-img(url("../../../assets/image/tel-login.png"));
    }
    .tel-number {
      margin-left: 9px;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
      color: #303133;
    }
  }
  .head {
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    background: rgba(245,247,250,0.4);
    z-index: 1;
    .head-box {
      position: absolute;
      width: 73%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      line-height: 60px;
      left: 50%;
      transform: translate(-50%);
      color: #ffffff;
      min-width: 500px;
      .title {
        height: 22px;
        font-size: 16px;
        line-height: 22px;
      }
      .help {
        height: 22px;
        font-size: 16px;
        line-height: 22px;
        cursor: pointer;
      }
      .help:hover {
        color: #909399;
      }
    }
  }

  .login-container {
    width: 73%;
    height: 79%;
    background-color: #ffffff;
    margin-right: auto;
    margin-left: auto;
    margin-top: 5%;
    box-shadow: 0 4px 20px rgba(0,0,0, 0.2);
    border-radius: 4px;
    position: relative;
    min-width: 500px;
    min-height: 400px;
    .el-form {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      left: 0;
      right: 0;
      width: 400px;
      height: 320px;
      margin-left: auto;
      margin-right: auto;
      top: 50%;
      transform: translate(0,-60%);
    }

    .title {
      @include bg-img(url("../../../assets/image/logo-login.png"));
      width: 72px;
      height: 44px;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .el-form-item {
      border: 1px solid #DCDFE6;
      border-radius: 5px;
      color: #454545;
    }

    .el-button {
      width: 100%;
      height: 40px;
    }

    .el-input {
      display: inline-block;
      width: 90%;
    }

    .icon {
      display: inline-block;
      width: 30px;
      font-size: 20px;
      color: $dark_gray;
      text-align: right;
      vertical-align: middle;
    }
    .img {
      display: inline-block;
      width: 150px;
      height: 47px;
      background-size: cover;
      vertical-align: middle;
      background-color: white;
      cursor: pointer
    }
    .captcha {
      display: flex;
      align-items: center;

      .tip {
        width: 30px;
        font-size: 15px;
      }

      .code {
        flex: 1;
      }

      .img {
        & > img {
          height: 100%;
          background: #fff;
          cursor: pointer;
        }
      }
    }
    .loginBtn {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      width: 200px;
      height: 50px;
    }
  }
  .bottom {
    flex-direction: column;
    flex-wrap: wrap;
    position: fixed;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    justify-content: flex-end;
    bottom: 10px;
    height: 48px;
    width: 760px;
    align-items: center;
    .company {
      height: 14px;
      font-size: 12px;
      color: #ffffff;
      line-height: 14px;
    }
  }
</style>

<style lang="scss">
  $light_gray: #eee;

  .login-container {
    input {
      background: rgba(255,255,255,0.50);
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }

  }

</style>
