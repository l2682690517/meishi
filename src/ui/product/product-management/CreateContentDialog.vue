<template lang="pug">
  mixin textContent
    el-form-item.show-validate-el-form(ref="fiShowText", v-if!="formData.tp === allContentTp.text.value", label="", prop="text")
      div.input-text-wrapper
        el-input(v-model="formData.text", :maxlength="2000", type="textarea", autosize)
      div.input-right-desc 建议26个字以内
  mixin imageContent
    el-form-item.show-validate-el-form(ref="fiImage", v-if!="formData.tp === allContentTp.img.value", label="", prop="imageList")
      upload-image-list(ref="uploadImage", :imageList.sync="formData.imageList", :host="getHost", :token="getToken")

  el-dialog(:visible.sync="dialogVisible", title="添加描述", :width="mediumDialogWidth", @close="closeCallback")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="40px")
      el-form-item(label="类型", prop="tp")
        el-radio-group(v-model="formData.tp", @change="handleTpChange")
          el-radio(v-for!="item in allContentTp", :label="item.value", :key="item.value") {{ item.text }}
      + textContent
      + imageContent
    div.dialog-footer(slot="footer")
      el-button(@click="dialogVisible = false") 取消
      el-button(type="primary", :loading="loading", @click="submit") 确定
</template>

<script>
  import * as AliyunApi from 'src/api/aliyun'
  import { mediumDialogWidth } from 'src/config/el'
  import * as ResourceService from 'src/service/resource/index'
  import { UploadImageList } from '@baibao/zeratul'

  export default {
    components: {
      UploadImageList
    },
    props: {},
    data () {
      const validateImage = (rule, value, callback) => {
        if (this.$refs.uploadImage && this.$refs.uploadImage.isUpdating) {
          callback(new Error('图片正在上传中'))
          return
        }
        if (value) {
          if (value.length <= 0) {
            callback(new Error('请选择图片'))
            return
          } else {
            callback()
            return
          }
        }
        callback(new Error('请选择图片'))
      }
      return {
        loading: false,
        initialData: null,
        formData: {
          id: 0,
          tp: ResourceService.allTp.text.value,
          text: '',
          imageList: []
        },
        formRules: {
          text: [
            {required: true, message: '请输入文本', trigger: 'blur'},
            {max: 2000, message: '最多可输入2000个字符', trigger: 'blur'}
          ],
          imageList: [
            {validator: validateImage, trigger: 'change'}
          ]
        },
        dialogVisible: false,
        ...$global.$mapConst({
          'mediumDialogWidth': mediumDialogWidth,
          'allContentTp': ResourceService.allTp
        })
      }
    },
    methods: {
      async show () {
        this.dialogVisible = true
        await this.$nextTick()
        if (!this.initialData) {
          this.initialData = this.R.clone(this.formData)
        }
        this.formData = this.R.clone(this.initialData)
      },
      hide () {
        this.dialogVisible = false
      },
      closeCallback () {
        this.$refs.form && this.$refs.form.clearValidate()
        // 保持tp, 只重置数据
        this.formData.text = ''
        this.formData.imageList = []
      },
      async submit () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          try {
            if (valid) {
              let result = []
              switch (this.formData.tp) {
                case this.allContentTp.text.value:
                  result = [{
                    tp: this.allContentTp.text.value,
                    text: this.formData.text,
                    url: '',
                    width: 0,
                    height: 0
                  }]
                  break
                case this.allContentTp.img.value:
                  result = this.R.map(item => {
                    return {
                      tp: this.allContentTp.img.value,
                      text: '',
                      ...item
                    }
                  })(this.formData.imageList)
                  break
              }
              this.$emit('success', result)
              this.hide()
            }
          } finally {
            this.loading = false
          }
        })
      },
      handleTpChange () {
        this.$refs.fiShowText && this.$refs.fiShowText.clearValidate()
        this.$refs.fiImage && this.$refs.fiImage.clearValidate()
      },
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  .input-text-wrapper {
    display: flex;
    width: 400px;

    .input-right-desc {
      width: 60px;
    }
  }
</style>
