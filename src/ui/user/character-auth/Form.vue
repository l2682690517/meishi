<template lang="pug">
  div(v-loading="loading")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="80px")
      el-form-item(label="名称：", prop="name")
        el-input.tiny-x-el-input(v-model.trim="formData.name", :maxlength="10")
      el-form-item(label="描述：")
        el-input.small-el-input(v-model.trim="formData.description", :maxlength="20")
      el-form-item(label="权限：")
        el-checkbox-group(v-model="formData.auths")
          div(v-for="item in AuthList")
            div.title(v-if="showName(item)") {{showName(item)}}
            div.checkbox(v-for="auth in item.auths")
              el-checkbox(:label="auth.id") {{auth.name}}
      el-form-item()
        el-button(@click="$router.back()") 取消
        el-button(@click="submit", type="primary") 提交
</template>

<script>
  import * as CharacterAuthApi from 'src/api/character-auth'

  export default {
    props: {},
    components: {},
    data () {
      const nameValidator = (rule, value, callback) => {
        if (value === '主账号') {
          callback(new Error('角色名称不能命名为主账号'))
          return
        }
        callback()
      }
      return {
        loading: false,
        AuthList: [],
        formData: {
          id: 0,
          name: '',
          description: '',
          auths: []
        },
        formRules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'},
            {max: 10, message: '名称最长10个字符', trigger: 'blur'},
            {validator: nameValidator, trigger: 'blur'}]
        }
      }
    },
    computed: {
      isEdit () {
        return this.$route.name === 'EditCharacter'
      }
    },
    watch: {},
    methods: {
      showName (row) {
        if (row.show_name) {
          return row.name
        }
      },
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              if (this.isEdit) {
                await CharacterAuthApi.editTenantRole(this.formData)
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.$router.back()
              } else {
                await CharacterAuthApi.createTenantRole(this.formData)
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.back()
              }
            } finally {
              this.loading = false
            }
          }
        })
      },
      async getRole () {
        if (this.isEdit) {
          this.loading = true
          try {
            let res = await CharacterAuthApi.getTenantRoleItem(this.$route.params.id)
            this.formData = res.data
            if (this.formData.auths) {
              this.formData.auths = res.data.auths.map(i => {
                return i.id
              })
            } else {
              this.formData.auths = []
            }
          } finally {
            this.loading = false
          }
        }
      },
      async getAuthList () {
        this.loading = true
        try {
          let res = await CharacterAuthApi.getAuthGroup()
          this.AuthList = res.data.data
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getRole()
      this.getAuthList()
    }
  }
</script>


<style lang="scss" scoped>
.title {
  font-size: 12px;
  color: #909399;
}
  .checkbox {
    display: inline-block;
    margin-right: 20px;
  }
</style>
