<template lang="pug">
  div
    el-dialog(:visible.sync="dialogVisible", title="添加内容", :width="mediumDialogWidth", @close="closeCallback")
      el-form(ref="form", :model="formData", :rules="formRules", labelWidth="100px")
        el-form-item(ref="formItemCover", prop="cover", label="封面")
          upload-image(ref="uploadCover", :image.sync="formData.cover", :host="getHost", :token="getToken")
        el-form-item.hide-validate-el-form(label="类型", prop="content_tp")
          el-radio-group(v-model="formData.content_tp", @change="handleContentTpChange")
            el-radio(v-for!="item in allContentTp", :label="item.value", :key="item.value") {{ item.text }}
        el-form-item.small-el-form(ref="fIContent", label="", prop="content")
          product-cell(v-if="showProduct", :product="showProduct")
          product-group-cell(v-if="showProductGroup", :productGroup="showProductGroup")
          el-button(size="mini", type="primary", @click="handleChooseContent") {{getButtonName}}
        el-form-item(label="上线时间：", prop="show_tp")
          el-radio-group(v-model="formData.show_tp")
            div
              el-radio(:label="allShowTp.show_long.value") {{ allShowTp.show_long.text }}
            div
              el-radio(:label="allShowTp.show_limit.value")
                date-picker(:start.sync="formData.show_start", :end.sync="formData.show_end", type="datetimerange")
      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取消
        el-button(type="primary", :loading="loading", @click="handleSubmit") 确定
    choose-product-dialog(ref="dlgChooseProduct", @choose="handleChooseProductComplete")
    choose-product-group-dialog(ref="dlgChooseProductGroup", @choose="handleChooseProductGroupComplete")
</template>

<script>
  import * as AliyunApi from 'src/api/aliyun'
  import { UploadImage } from '@baibao/zeratul'
  import ProductCell from 'src/ui/common/cell/Product.vue'
  import ProductGroupCell from 'src/ui/common/cell/ProductGroup.vue'
  import { mediumDialogWidth } from 'src/config/el'
  import * as CustomPageService from 'src/service/custome-page/index'
  import ChooseProductDialog from 'src/ui/common/choose-product-dialog/Index.vue'
  import ChooseProductGroupDialog from 'src/ui/common/choose-product-group-dialog/Index.vue'
  import { syncNewObject } from 'src/util/obj'
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

  const MODE_CREATE = 0
  const MODE_EDIT = 1

  export default {
    MODE_CREATE,
    MODE_EDIT,
    components: {
      UploadImage,
      ProductCell,
      ProductGroupCell,
      ChooseProductDialog,
      ChooseProductGroupDialog,
      DatePicker
    },
    data () {
      const coverValidator = (rule, value, callback) => {
        if (this.$refs.uploadCover.isUpdating) {
          callback(new Error('正在上传图片'))
          return
        }
        if (this.R.and(this.coverRequired, this.R.or(!this.formData.cover, this.RA.isNilOrEmpty(this.formData.cover.url)))) {
          callback(new Error('请上传图片'))
          return
        }
        callback()
      }
      const contentValidator = (rule, value, callback) => {
        if (this.formData.content_tp === CustomPageService.allContentTp.product.value && !this.formData.product) {
          callback(new Error('请选择商品'))
          return
        } else if (this.formData.content_tp === CustomPageService.allContentTp.product_group.value && !this.formData.product_group) {
          callback(new Error('请选择商品组'))
          return
        }
        callback()
      }
      const showTpValidator = (rule, value, callback) => {
        if (this.formData.show_tp === CustomPageService.allShowTp.show_limit.value && (this.formData.show_start === 0 || this.formData.show_end === 0)) {
          callback(new Error('请选择开始时间和结束时间'))
          return
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        initialData: null,
        editModel: null,
        formData: {
          id: 0,
          content_tp: CustomPageService.allContentTp.product.value,
          cover: {
            id: 0,
            url: '',
            width: 0,
            height: 0,
            tp: 1
          },
          show_tp: CustomPageService.allShowTp.show_long.value,
          show_start: 0,
          show_end: 0,
          product: null,
          product_group: null
        },
        formRules: {
          cover: [{validator: coverValidator, trigger: 'change'}],
          content: [{validator: contentValidator, trigger: 'change'}],
          show_tp: [{validator: showTpValidator, trigger: 'change'}]
        },
        ...$global.$mapConst({
          'mediumDialogWidth': mediumDialogWidth,
          'allContentTp': CustomPageService.allContentTp,
          'allShowTp': CustomPageService.allShowTp
        }),
        coverRequired: false,
        disabledProductItems: [],
        disabledProductGroupItems: []
      }
    },
    computed: {
      dialogTitle () {
        return this.isEditMode ? '编辑内容' : '添加内容'
      },
      isEditMode () {
        return !!this.editModel
      },
      getButtonName () {
        return this.formData.content_tp === CustomPageService.allContentTp.product.value ? '选择商品' : '选择商品组'
      },
      showProduct () {
        if (this.formData.content_tp === CustomPageService.allContentTp.product.value && this.formData.product) {
          return this.formData.product
        }
        return null
      },
      showProductGroup () {
        if (this.formData.content_tp === CustomPageService.allContentTp.product_group.value && this.formData.product_group) {
          return this.formData.product_group
        }
        return null
      },
      defaultDate: {
        get () {
          if (!this.formData.show_start || !this.formData.show_end) {
            return []
          }
          return [this.formData.show_start, this.formData.show_end]
        },
        set (val) {
          console.log('val', val)
        }
      }
    },
    methods: {
      closeCallback () {
        this.$refs.form && this.$refs.form.resetFields()
      },
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (!this.isEditMode) {
              this.$emit('added', Object.assign({}, this.formData))
            } else {
              this.$emit('updated', Object.assign(this.editModel, this.formData))
            }
            this.hide()
          }
        })
      },
      async show (editModel, config) {
        if (config) {
          this.coverRequired = config.coverRequired
          this.disabledProductItems = config.disabledProductItems
          this.disabledProductGroupItems = config.disabledProductGroupItems
        } else {
          this.coverRequired = false
          this.disabledProductItems = []
          this.disabledProductGroupItems = []
        }
        this.dialogVisible = true
        await this.$nextTick()
        this.editModel = editModel
        if (!this.initialData) {
          this.initialData = this.R.clone(this.formData)
        }
        this.formData = editModel ? syncNewObject(this.initialData, this.R.clone(editModel)) : this.R.clone(this.initialData)
      },
      hide () {
        this.dialogVisible = false
      },
      handleChooseContent () {
        if (this.formData.content_tp === CustomPageService.allContentTp.product.value) {
          this.$refs.dlgChooseProduct.show(ChooseProductDialog.MODE_SINGLE, null, this.disabledProductItems)
        } else if (this.formData.content_tp === CustomPageService.allContentTp.product_group.value) {
          this.$refs.dlgChooseProductGroup.show(this.disabledProductGroupItems)
        }
      },
      handleContentTpChange () {
        this.$refs.fIContent.clearValidate()
      },
      handleChooseProductComplete (products) {
        this.formData.product = products[0]
        this.$refs.fIContent.onFieldChange()
      },
      handleChooseProductGroupComplete (productGroups) {
        this.formData.product_group = productGroups[0]
        this.$refs.fIContent.onFieldChange()
      },
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    }
  }
</script>


<style lang="scss" scoped>


</style>
