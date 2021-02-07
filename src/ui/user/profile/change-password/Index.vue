<template lang="pug">
  el-dialog(:visible.sync="dialogVisible", title="修改密码", :width="commonDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="formRules", labelPosition="top")
      el-form-item.top-el-form-fix(label="原密码", prop="old_passwd")
        el-input(type="password", v-model.trim="formData.old_passwd")
      el-form-item.top-el-form-fix(label="新密码", prop="new_passwd")
        el-input(type="password", v-model.trim="formData.new_passwd")
      el-form-item.top-el-form-fix(label="确认密码", prop="confirm_passwd")
        el-input(type="password", v-model.trim="formData.confirm_passwd")
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="handleSubmit") 确定
</template>

<script>
  import { commonDialogWidth } from 'src/config/el'
  import * as UcApi from 'src/api/uc'

  export default {
    data () {
      const confirmPwdValidator = (rule, value, callback) => {
        if (value !== this.formData.new_passwd) {
          callback(new Error('两次输入密码不一致'))
          return
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        formData: {
          old_passwd: '',
          new_passwd: '',
          confirm_passwd: ''
        },
        formRules: {
          old_passwd: [
            {required: true, message: '请输入原密码', trigger: 'blur'}
          ],
          new_passwd: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ],
          confirm_passwd: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {validator: confirmPwdValidator, trigger: 'blur'}
          ]
        },
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth
        })
      }
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.resetFields()
      },
      handleSubmit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              await UcApi.updatePassword(this.formData)
              this.$message({
                type: 'success',
                message: '更新成功'
              })
              this.hide()
            } finally {
              this.loading = false
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
