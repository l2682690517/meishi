<template lang="pug">
  el-dialog(:visible.sync="dialogVisible", :title="dialogTitle", :width="commonDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="66px")
      el-form-item(prop="name", label="名称")
        el-input(v-model.trim="formData.name", :maxlength="20")
      el-form-item(prop="roles", label="角色")
        el-select(v-model="formData.roles", multiple, placeholder="请选择")
          el-option(v-for="item in roleList",:key="item.id",:label="item.name",:value="item.id")
      el-form-item(prop="mobile", label="手机号")
        el-input(v-model.trim="formData.mobile")
      el-form-item(prop="passwd", label="密码")
        el-input(type="password", v-model.trim="formData.passwd", @focus="handlePwdFocus")
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="handleSubmit") 确定
</template>

<script>
  import { commonDialogWidth } from 'src/config/el'
  import * as CharacterAuthApi from 'src/api/character-auth'
  import * as SysUserApi from 'src/api/sys-user'
  import { REGEX_MOBILE } from 'src/util/regex'

  export default {
    data () {
      return {
        loading: false,
        initPwd: false,
        initialData: {},
        roleList: [],
        formData: {
          id: 0,
          name: '',
          mobile: '',
          passwd: '',
          roles: []
        },
        formRules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {max: 20, message: '长度最大10个字符', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: REGEX_MOBILE, message: '请输入正确的手机号', trigger: 'blur'}
          ],
          roles: [
            {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
          ],
          passwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        allRoles: [],
        dialogVisible: false,
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth
        })
      }
    },
    computed: {
      isEditMode () {
        return !!this.initialData
      },
      dialogTitle () {
        return this.isEditMode ? '编辑管理员' : '添加管理员'
      }
    },
    methods: {
      async getRoleList () {
        this.loading = true
        try {
          let res = await CharacterAuthApi.getTenantRoleList()
          this.roleList = res.data.data
        } finally {
          this.loading = false
        }
      },
      show (editData) {
        if (editData) {
          editData.passwd = '********'
        }
        this.initialData = editData
        if (this.initialData) {
          this.formData = this.R.clone(this.initialData)
          if (!this.formData.roles) {
            this.formData.roles = []
          } else {
            this.formData.roles = this.formData.roles.map(i => {
              return i.id
            })
          }
        }
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.initPwd = false
        this.$refs.form && this.$refs.form.resetFields()
      },
      async handleSubmit () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          try {
            if (valid) {
              const frm = this.R.clone(this.formData)
              if (!this.initPwd) {
                frm.passwd = ''
              }
              if (!this.isEditMode) {
                await SysUserApi.create(frm)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$emit('created')
              } else {
                await SysUserApi.update(this.initialData.id, frm)
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.$emit('updated')
              }
              this.hide()
            }
          } finally {
            this.loading = false
          }
        })
      },
      handlePwdFocus () {
        if (!this.initPwd) {
          this.formData.passwd = ''
          this.initPwd = true
        }
      }
    },
    mounted () {
      this.getRoleList()
    }
  }
</script>

<style lang="scss" scoped>
</style>
