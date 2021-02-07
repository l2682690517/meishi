<template lang="pug">
  div.bottom-outer-content
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="80px", v-loading="loading")
      el-form-item(label="商品图片", prop="head", :required="true")
        upload-image-list(ref="uploadHead", :imageList.sync="formData.head", :maxFiles='$options.MAX_HEAD_COUNT', :host="getHost", :token="getToken")
        div.input-bottom-desc 还能上传 {{ remainHeadCount }} 张，建议尺寸750×750像素
      el-form-item(label="列表图", prop="cover")
        upload-image(ref="uploadCover", :image.sync="formData.cover", :host="getHost", :token="getToken")
        div.input-bottom-desc 建议尺寸750×750像素
      el-form-item(label="商品名称", prop="name")
        el-input.medium-el-input(v-model.trim="formData.name", :maxlength="50")
        span.input-right-desc {{ formData.name.length }} / 50
      el-form-item(label="卖点", prop="sell_point")
        el-input.medium-el-input(v-model.trim="formData.sell_point", :maxlength="30")
        span.input-right-desc {{ formData.sell_point.length }} / 30
      el-form-item(label="商品规格", prop="skus", :required="true")
        skus(ref="skus", :skus.sync="formData.skus", :stPrice="formData.st_price", :supplyPrice="formData.supply_price")
      el-form-item(label="划线价", prop="st_price")
        el-input.tiny-el-input(v-model.trim="formData.st_price")
        span.input-right-desc 元
      el-form-item.txt-input(label="供货价") {{ formData.supply_price }}
        span.input-right-desc 元
      el-form-item.txt-input(label="配送区域", v-if="delivery_region") {{ deliveryRegionShowText(delivery_region) }}
      el-form-item.txt-input(label="商品设置", v-if="isOversea") 清关商品
      el-form-item(label="商品描述", prop="content")
        content-comp(:content.sync="formData.content")
      el-form-item(label="定时开售", prop="sale_tick")
        date-picker(type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions" :value.sync="formData.sale_tick" format="yyyy-MM-dd HH:mm")
      el-form-item.txt-input(label="服务组合", v-if="service_tag_group")
        div
          div {{ service_tag_group.name }}
          div {{ serviceTagGroupShowText(service_tag_group) }}
      el-form-item.txt-input(label="售后模板", v-if="after_service")
        show-after-service(:afterService="after_service")
    bottom-container
      el-button(@click="$router.back()") 取消
      el-button(@click="handleRestoreDefault") 恢复默认
      el-button(type="primary", :loading="loading", @click="save") 确定
</template>

<script>
  import * as AliyunApi from 'src/api/aliyun'
  import { UploadImage, UploadImageList, DatePicker } from '@baibao/zeratul'
  import Skus from './Skus.vue'
  import ContentComp from '../Content.vue'
  import * as FormApi from 'src/api/product'
  import { priceValidator } from 'src/util/validator'
  import * as ProductService from 'src/service/product/index'
  import * as DeliveryRegionService from 'src/service/delivery-region/index'
  import * as ServiceTagGroupService from 'src/service/service_tag_group/index'
  import ShowAfterService from './ShowAfterService.vue'
  import * as ElUtil from 'src/util/el'

  const MAX_HEAD_COUNT = 5
  export default {
    MAX_HEAD_COUNT,
    components: {
      UploadImageList,
      UploadImage,
      Skus,
      ContentComp,
      ShowAfterService,
      DatePicker
    },
    data () {
      const headValidator = (rule, value, callback) => {
        if (this.$refs.uploadHead.isUpdating) {
          callback(new Error('正在上传图片'))
          return
        }
        if (value) {
          if (value.length <= 0) {
            callback(new Error('请选择图片'))
          } else if (value.length > MAX_HEAD_COUNT) {
            callback(new Error(`最多选择${MAX_HEAD_COUNT}图片`))
          } else {
            callback()
          }
        }
        callback(new Error('请选择图片'))
      }
      const coverValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请上传图片'))
          return
        }
        callback()
      }

      const skuValidator = (rule, value, callback) => {
        if (!value || value.length <= 0) {
          callback(new Error('Sku不能为空'))
          return
        }
        if (this.$refs.skus.isUpdating()) {
          callback(new Error('正在上传图片'))
          return
        }
        callback()
      }
      return {
        loading: false,
        initialData: {},
        after_service: null,
        delivery_region: null,
        service_tag_group: null,
        isOversea: false,
        formData: {
          id: 0,
          status: 1,
          head: [],
          cover: {
            id: 0,
            url: '',
            width: 0,
            height: 0
          },
          name: '',
          sell_point: '',
          skus: [],
          sale_tick: 0,
          st_price: '',
          content: [],
          supply_price: ''
        },
        pickerOptions: {
          disabledDate (date) {
            const now = new Date()
            now.setDate(now.getDate() - 1)
            return date < now
          }
        },
        formRules: {
          head: [
            {validator: headValidator, trigger: 'change'}
          ],
          cover: [
            {validator: coverValidator, trigger: 'change'}
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 50, message: '名称最长50个字符', trigger: 'blur'}
          ],
          sell_point: [
            {max: 30, message: '最多可以输入30个字符', trigger: 'blur'}
          ],
          skus: [
            {validator: skuValidator, trigger: 'change'}
          ],
          st_price: [
            {validator: priceValidator, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      remainHeadCount () {
        return MAX_HEAD_COUNT - this.formData.head.length
      }
    },
    methods: {
      async initData () {
        let resItem
        try {
          this.loading = true
          resItem = await FormApi.getItem(this.$tid, this.$route.params.id)
        } finally {
          this.loading = false
        }
        this.delivery_region = this.R.path(['prop', 'ext', 'delivery_region'])(resItem.data)
        this.service_tag_group = this.R.path(['prop', 'ext', 'service_tag_group'])(resItem.data)
        this.after_service = this.R.path(['prop', 'ext', 'after_service'])(resItem.data)
        this.isOversea = !!(this.R.path(['prop', 'ext', 'oversea'])(resItem.data))
        resItem = ProductService.convertModelToForm(resItem.data)
        this.formData = resItem
        this.loading = false
        this.initialData = this.R.clone(this.formData)
      },
      save () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              await FormApi.update(this.$tid, this.formData.id, this.formData, true)
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.$router.back()
            } catch (err) {
              console.log(err)
            }
          } else {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
          this.loading = false
        })
      },
      async handleRestoreDefault () {
        try {
          const resSource = await FormApi.getItemSource(this.$tid, this.formData.id)
          const productSource = resSource.data
          ProductService.formRestoreDefault(this.formData, productSource)
          this.$message({
            type: 'info',
            message: '已设置默认数据'
          })
        } catch (e) {
          console.log(e)
        }
      },
      ...$global.$mapConst({
        'deliveryRegionShowText': DeliveryRegionService.showText,
        'serviceTagGroupShowText': ServiceTagGroupService.showItemsText
      }),
      ...$global.$mapMethods({
        'getHost': AliyunApi.getOssHost,
        'getToken': AliyunApi.getOssToken
      })
    },
    async mounted () {
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
</style>
