<template lang="pug">
  el-dialog(title="拒绝退款",  :visible.sync="dialogVisible", size="tiny", @open="openCallback", @close="closeCallback", v-loading="loading")
    el-form(ref="formReject", :model="form", label-width="80px", :rules="rules")
      el-form-item(label="描述", prop="txt")
        el-input(v-model="form.txt", placeholder="请输入内容", type="textarea", :rows="3", :maxlength="maxLength")
        span.input-tip {{form.txt.length}} / {{maxLength}}
      div.line
      div.txt 以下内容用户不可见
      el-form-item(label="备注", prop="remark")
        el-input(v-model="form.remark", placeholder="请输入内容", type="textarea", :rows="3", :maxlength="remarkMaxLength")
        span.input-tip {{form.remark.length}} / {{remarkMaxLength}}
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", @click="submit") 确定
</template>

<script>
  import {reject} from '../../../api/refuse'

  export default {
    components: {},
    props: {
      oiid: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        loading: false,
        dialogVisible: false,
        maxLength: 100,
        remarkMaxLength: 30,
        form: {
          txt: '',
          remark: ''
        },
        rules: {
          txt: [
            {max: 100, message: '最大100个字符', trigger: 'blur'}
          ],
          remark: [
            {max: 30, message: '最大30个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {},
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      openCallback () {
        this.form = {
          txt: '',
          remark: ''
        }
      },
      closeCallback () {
        this.$refs.formReject.resetFields()
      },
      async submit () {
        this.$confirm('拒绝后，买家将不能发起退款，请确认理由充分！', '拒绝退款？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$refs.formReject.validate(async (valid) => {
            if (valid) {
              this.loading = true
              try {
                const resResult = await reject(this.$tid, this.oiid, this.form.txt, this.form.remark)
                this.loading = false
                this.$emit('submit', resResult.data)
                this.hide()
              } catch (e) {
                this.loading = false
              }
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .line {
    width: 100%;
    height: 1px;
    background-color: #d6d6d6;
  }

  .txt {
    font-size: 12px;
    color: #868686;
    margin-top: 5px;
    margin-bottom: 20px;
  }
</style>
