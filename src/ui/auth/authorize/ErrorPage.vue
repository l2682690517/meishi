<template lang="pug">
  div
    el-dialog(title="授权失败",
    :visible.sync="dialogVisible",
    width="40%",
    :before-close="handleClose",
    center)
      span.title {{showError()}}
      span(slot="footer", class="dialog-footer")
        el-button.button(v-loading="loading", type="primary", @click="handleClick") 重新授权
</template>

<script>
  import * as AuthApi from 'src/api/auth'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        authorizeUrl: '',
        error: ''
      }
    },
    computed: {},
    watch: {},
    methods: {
      showError () {
        console.log(this.error)
        let text = '未能成功授权开发管理权限，请在扫描二维码后选择修改授权权限'
        switch (this.error) {
          case '1':
            text = '未能成功授权开发管理权限，小程序已经授权给其他账号'
            break
          case '2':
            text = '未能成功授权开发管理权限，暂不支持授权给其它小程序'
            break
        }
        return text
      },
      handleClick () {
        window.open(this.authorizeUrl)
        this.handleClose()
      },
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
      handleClose () {
        this.$router.replace({
          name: 'AuthorizeMain'
        })
      }
    },
    mounted () {
      this.dialogVisible = true
      this.getAuthorizeUrl()
      this.error = this.$route.query.err_code
    }
  }
</script>


<style lang="scss" scoped>
  .button {
    margin-top: 20px;
  }
</style>
