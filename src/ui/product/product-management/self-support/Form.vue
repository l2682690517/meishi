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
        skus(ref="skus", :skus.sync="formData.skus", :stPrice="this.formData.st_price", :supplyPrice="this.formData.supply_price")
      el-form-item(label="划线价", prop="st_price")
        el-input.tiny-el-input(v-model.trim="formData.st_price")
        span.input-right-desc 元
      el-form-item(label="供货价", prop="supply_price")
        el-input.tiny-el-input(v-model.trim="formData.supply_price")
        span.input-right-desc 元
      el-form-item(label="配送区域", prop="delivery_region_id", placeholder="请选择")
        el-select(v-model="formData.delivery_region_id", placeholder="请选择", clearable)
          el-option(v-for="item in deliveryRegionList", :key="item.id", :label="item.name", :value="String(item.id)")
      el-form-item(label="商品设置", prop="oversea")
        el-checkbox(v-model="formData.oversea") 清关商品
      el-form-item(label="定时开售", prop="sale_tick")
        date-picker(type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions" :value.sync="formData.sale_tick" format="yyyy-MM-dd HH:mm")
      el-form-item(label="商品描述", prop="content")
        content-comp(:content.sync="formData.content")
      el-form-item(label="服务组合", prop="service_tag_group_id")
        el-select(v-model="formData.service_tag_group_id", placeholder="请选择", clearable)
          el-option(v-for="item in serviceGroupList", :key="item.id", :label="item.name", :value="String(item.id)")
      el-form-item(label="售后模板", prop="after_service_id")
        el-select(v-model="formData.after_service_id", placeholder="请选择", clearable)
          el-option(v-for="item in afterServiceList", :key="item.id", :label="item.name", :value="String(item.id)")
    bottom-container
      el-button(@click="$router.back()") 取消
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
  import * as AfterServiceApi from 'src/api/after-service'
  import * as DeliveryRegionApi from 'src/api/delivery-region'
  import * as ServiceTagApi from 'src/api/servicetag'
  import * as ElUtil from 'src/util/el'
  import { mapGetters } from 'vuex'
  import { getMe } from 'src/api/uc'

  const MAX_HEAD_COUNT = 5
  export default {
    MAX_HEAD_COUNT,
    components: {
      UploadImageList,
      UploadImage,
      Skus,
      ContentComp,
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
      const supplyPriceValidator = (rule, value, callback) => {
        if (!this.R_.isPrice(value)) {
          callback(new Error('不正确的价格'))
          return
        }
        if (value === '0') {
          callback(new Error('不正确的价格'))
          return
        }
        const supplyPrice = this.R_.convertYuanToFen(value)
        if (this.R_.isPrice(this.formData.st_price)) {
          const st = this.R_.convertYuanToFen(this.formData.st_price)
          if (supplyPrice > st) {
            callback(new Error('不能大于划线价'))
            return
          }
        }
        callback()
      }

      return {
        loading: false,
        initialData: {},
        deliveryRegionList: [],
        afterServiceList: [],
        serviceGroupList: [],
        formData: {
          id: 0,
          status: 1,
          head: [],
          oversea: false,
          delivery_region_id: '',
          after_service_id: '',
          service_tag_group_id: '',
          cover: {
            id: 0,
            url: '',
            width: 0,
            height: 0
          },
          name: '',
          sell_point: '',
          skus: [{
            id: 0,
            spec: '默认规格',
            sell_price: '',
            stock: '',
            code: '',
            image: {
              id: 0,
              url: '',
              width: 0,
              height: 0
            }
          }],
          sale_tick: 0,
          st_price: '',
          supply_price: '',
          content: []
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
          ],
          supply_price: [
            {required: true, message: '请输入供货价', trigger: 'blur'},
            {validator: supplyPriceValidator, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'EditProduct'
      },
      remainHeadCount () {
        return MAX_HEAD_COUNT - this.formData.head.length
      },
      ...mapGetters(['currentTenant'])
    },
    methods: {
      initFormChooseList () {
        return Promise.all([DeliveryRegionApi.getList(this.$tid), AfterServiceApi.getList(this.$tid), ServiceTagApi.getTagGroupList(this.$tid)]).then(([resDeliveryRegion, resAfterService, resServiceTag]) => {
          this.deliveryRegionList = resDeliveryRegion.data.data || []
          this.afterServiceList = resAfterService.data.data || []
          this.serviceGroupList = resServiceTag.data.data || []
        })
      },
      async initData () {
        await this.initFormChooseList()
        if (this.isEditMode) {
          this.loading = true
          let resItem = await FormApi.getItem(this.$tid, this.$route.params.id)
          resItem = ProductService.convertModelToForm(resItem.data)
          this.formData = resItem
          this.loading = false
        }
        this.initialData = this.R.clone(this.formData)
      },
      async save () {
        this.loading = true
        await getMe()
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              if (!this.isEditMode) {
                if (this.currentTenant.product_auth === 2) {
                  this.$alert('请联系美市获得此权限', '未获得权限', {
                    confirmButtonText: '确定'
                  })
                  return
                }
                await FormApi.create(this.$tid, this.formData)
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              } else {
                await FormApi.update(this.$tid, this.formData.id, this.formData)
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
              }
              this.$router.back()
            } catch (err) {
              console.log(err)
            }
          } else {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
        })
        this.loading = false
      },
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
