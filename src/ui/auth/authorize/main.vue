<template lang="pug">
  div.background
    div.authorize
      div.authorize-steps
        div.step1
          div.button1(:class="[AuthorizeStatus===0 ? activeClass : defaultClass]")
            div.text1 小程序授权
          div.triangle1(:class="[AuthorizeStatus===0 ? activeClassTriangle : defaultClass]")
        div.step2
          div.triangle2
          div.button2(:class="[AuthorizeStatus===0 ? defaultClass : activeClass]")
            div.text2 退款授权
      div
        div.authorize-box
          div.icon
            img(style="width: 50px", :src="AuthorizeStatus === 0 ? wechatIcon : successIcon")
          div.text(v-if="AuthorizeStatus === 0") 微信小程序授权
          div.refund(v-else) 百宝美市已向您发起退款授权邀请
          div.btn
            el-button.btn(v-loading="loading", type="primary", @click="toAuthorize") 前往授权
          div.Hyperlink(v-if="AuthorizeStatus === 0")
            a(style="margin: auto;width: 120px; display: block", href="https://shimo.im/docs/bSiEE159Dd8N757A/", target="view_window") 授权遇到问题？
            a(style="margin-left: auto;margin-top: 20px;width: 180px;display: block", href="https://shimo.im/docs/TDfpHQzl6bw8Kjgw/", target="view_window") 没有小程序，如何注册？
          div.Hyperlink(v-else)
            a(style="margin: auto;width: 100px; display: block", href="https://shimo.im/docs/8Yl8YA3PFE4rhrm7", target="view_window") 退款授权方法
</template>

<script>
  import * as AuthApi from 'src/api/auth'

  export default {
    props: {},
    components: {
    },
    data () {
      return {
        loading: false,
        url: '',
        authorizeUrl: '',
        wechatIcon: require('src/assets/image/wechat.png'),
        successIcon: require('src/assets/image/icon-success.png'),
        activeClass: 'color-active',
        activeClassTriangle: 'color-active-triangle1',
        defaultClass: 'color-default'
      }
    },
    computed: {
      AuthorizeStatus () {
        if (this.$store.getters.isAuthorize) {
          if (this.$store.getters.isRefundAuthorize) {
            this.$router.replace({
              name: 'Dashboard'
            })
            return 3
          } else {
            return 1
          }
        } else {
          return 0
        }
      }
    },
    watch: {},
    methods: {
      async getAuthorizeUrl () {
        try {
          this.loading = true
          let data = await AuthApi.getAuthorizeData()
          data = data.data
          let http = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid='
          let url = http.concat(
            data.component_appid,
            '&pre_auth_code=',
            data.pre_auth_token,
            '&redirect_uri=',
            data.redirect,
            '&auth_type=',
            data.auth_type
          )
          this.authorizeUrl = url
          this.loading = false
        } catch (err) {
          alert('获取授权所需信息失败')
        }
      },
      toAuthorize () {
        if (this.AuthorizeStatus === 0) {
          window.open(this.authorizeUrl)
        } else {
          let url = 'https://pay.weixin.qq.com/index.php/core/home/login'
          window.open(url)
        }
      }
    },
    mounted () {
      this.getAuthorizeUrl()
    }
  }
</script>


<style lang="scss" scoped>
  $content-padding: 16px;
  $header-height: 60px;
  .background {
    background: #F0F2F5;
    position: fixed;
    top: 0;
    height: 100vh;
    width: 100%;
  }
  .top-wrapper {
    position: fixed;
    display: flex;
    align-items: center;
    height: $header-height;
    width: 100%;
    background: $color-primary;
    box-sizing: border-box;
    z-index: 1;

    .dropdown-link {
      cursor: pointer;
      color: #ffffff;
    }

    & > :nth-child(1) {
      flex: 1;
      padding-left: $content-padding;
      color: $border-color-level4;
      font-weight: bold;
    }

    & > :nth-child(2) {
      width: 200px;
      text-align: right;
      padding-right: $content-padding;
    }

  }
  .color-default {
    background: #DCDFE6;
  }
  .color-active {
    background-image: linear-gradient(44deg, #FFC582 0%, #f97a95 94%);
  }
  .color-active-triangle1 {
    background-image: linear-gradient(44deg, #f97a95 0%, #f97a98 94%);
  }
  .authorize {
    position: relative;
    top: 150px;
    left: 0;
    right: 0;
    margin: 0 auto;
    .authorize-steps {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      width: 420px;
      display: flex;
      top: -65px;
      justify-content: space-between;
      .step1 {
        width: 200px;
        display: flex;
        position: relative;
        .button1 {
          width: 180px;
          height: 40px;
          border-radius: 4px 0 0 4px;
          z-index: 4;
          .text1 {
            height: 22px;
            line-height: 22px;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            position: absolute;
            top: 50%;
            transform: translate(0,-50%);
            margin-left: 65px;
          }
        }
      }
      .step2 {
        width: 200px;
        display: flex;
        position: absolute;
        right: 45px;
        .button2 {
          position: absolute;
          left: 20px;
          width: 180px;
          height: 40px;
          border-radius: 0 4px 4px 0;
          z-index: 1;
          .text2 {
            height: 22px;
            line-height: 22px;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            position: absolute;
            top: 50%;
            transform: translate(0,-50%);
            margin-left: 73px;
          }
        }
      }
      .triangle1 {
        width: 28px;
        height: 28px;
        position: absolute;
        top: 6px;
        right: 6px;
        transform:rotate(45deg);
        z-index: 3;
      }
      .triangle2 {
        width: 28px;
        height: 28px;
        position: absolute;
        top: 6px;
        right: 166px;
        background: #F0F2F5;
        transform:rotate(45deg);
        z-index: 2;
      }
    }

    .authorize-box {
      width: 800px;
      height: 400px;
      background: #FFFFFF;
      box-shadow: 0 4px 20px 0 rgba(0,0,0,0.20);
      border-radius: 4px;
      border: 1px solid #eaeefb;
      margin-left: auto;
      margin-right: auto;
      margin-top: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      .icon {
        width: 50px;
        height: 50px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 50px;
      }
      .refund {
        width: 270px;
        margin-top: 10px;
        margin-right: auto;
        margin-left: auto;
        font-weight: 700;
        font-size: large;
      }
      .text {
        width: 112px;
        color: #303133;
        margin-top: 20px;
        margin-right: auto;
        margin-left: auto;
        font-size: 16px;
        height: 22px;
        line-height: 22px;
      }
      .btn {
        margin-top: 35px;
        margin-left: auto;
        margin-right: auto;
        width: 200px;
        height: 50px;
      }
      .Hyperlink {
        width: 200px;
        height: 50px;
        margin-top: 80px;
        margin-right: auto;
        margin-left: auto;
      }
    }
  }


</style>
