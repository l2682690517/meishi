<template lang="pug">
  div
    div.top-wrapper
      div
        div.logo()
      div
        el-dropdown(@command="handleMenuCommand")
          span.dropdown-link
            | {{ profileName }}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(command="password") 修改密码
            el-dropdown-item(command="logout") 退出登录
    div
      div
        div#app-content
          div
            router-view
    change-password-dialog(ref="dlgChangePassword")
</template>

<script>
  import * as AuthApi from 'src/api/auth'
  import {mapState} from 'vuex'
  import ChangePasswordDialog from 'src/ui/user/profile/change-password/Index.vue'

  export default {
    props: {},
    components: {
      ChangePasswordDialog
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState({
        profileName: state => state.auth.me ? state.auth.me.name : ''
      })
    },
    watch: {},
    methods: {
      handleMenuCommand (command) {
        switch (command) {
          case 'password':
            this.$refs.dlgChangePassword.show()
            break
          case 'logout':
            this.logout()
        }
      },
      async logout () {
        await AuthApi.logout()
      }
    },
    mounted () {
    }
  }
</script>


<style lang="scss" scoped>
  $content-padding: 20px;
  $header-height: 60px;

  .top-wrapper {
    position: fixed;
    display: flex;
    align-items: center;
    height: $header-height;
    width: 100%;
    background: #F5F7FA;
    box-sizing: border-box;
    z-index: 1;
    border-bottom: solid 1px #E4E7ED;

    .logo {
      width: 43px;
      height: 26px;
      margin-left: 30px;
      @include bg-img(url('~src/assets/image/home-logo-top.png'));
      background-size: cover;
    }

    .dropdown-link {
      cursor: pointer;
      color: #303133;
    }

    & > :nth-child(1) {
      flex: 1;
      padding-left: $content-padding;
      color: #EA2554;
    }

    & > :nth-child(2) {
      width: 200px;
      text-align: right;
      padding-right: $content-padding;
    }

  }

  .authorize {
    width: 100%;
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    margin: 0 auto;
    .authorize-steps {
      width: 400px;
      margin: auto;
    }

    .authorize-box {
      width: 800px;
      height: 400px;
      border: 1px solid #eaeefb;
      margin-left: auto;
      margin-right: auto;
      margin-top: 10px;
      .icon {
        width: 60px;
        height: 60px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 40px;
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
        width: 170px;
        margin-top: 10px;
        margin-right: auto;
        margin-left: auto;
        font-weight: 900;
        font-size: x-large;
      }
      .btn {
        margin-top: 50px;
        margin-left: auto;
        margin-right: auto;
        width: 250px;
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
