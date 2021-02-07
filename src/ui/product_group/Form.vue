<template lang="pug">
  div(v-loading="loading")
    div
      el-form(ref="form", :model="formData", label-width="70px", :rules="rules")
        el-form-item(label="名称：" prop="name")
          el-input.small-el-input(v-model="formData.name", :maxlength="10", placeholder="最多10个字符")
        el-form-item(labelWidth="10px")
          el-button(size="small", type="primary", @click="chooseProduct") 选择商品
          smart-table.large-el-table(:dataList.sync="formData.products")
            smart-table-column(label="", type="drag")
            smart-table-column(label="商品")
              div.product-item(slot-scope="props")
                div.icon.img-cover(v-lazy:background-image="showCover(props.row)")
                div.text.single-line
                  div.name.single-line(@click="showProductDetail(props.row)") {{ props.row.name}}
            smart-table-column(label="销量", props="sold", width="80px")
              div(slot-scope="props") {{ props.row.sold}}
            smart-table-column(label="库存", width="80px")
              div(slot-scope="props") {{ props.row.prop.stock}}
            smart-table-column(label="操作", width="100px")
              div(slot-scope="props")
                el-button(type="danger", size="small", @click="handleDeleteItem(props.index)") 删除
        el-form-item(labelWidth="10px")
          el-button(@click="$router.back()") 取消
          el-button(type="primary", @click="submit", :loading="saving") 提交
    choose-product-dialog(ref="dlgChooseProduct", @choose="chooseProductCompleted")
    product-detail-dialog(ref="dlgProductDetail")
</template>

<script>
  import ChooseProductDialog from 'src/ui/common/choose-product-dialog/Index.vue'
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'
  import emitter from 'element-ui/src/mixins/emitter'
  import * as ProductGroupApi from 'src/api/productGroup'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import { showCover } from 'src/service/product/index'
  import { convertFromToParam } from 'src/service/producg-group/index'

  const MODE_EDIT = 1
  const MODE_CREATE = 0
  export default {
    MODE_CREATE,
    MODE_EDIT,
    mixins: [emitter],
    props: {
      mode: {
        type: Number,
        default: 0
      }
    },
    components: {
      SmartTable,
      SmartTableColumn,
      ChooseProductDialog,
      ProductDetailDialog
    },
    data () {
      return {
        loading: false,
        saving: false,
        initialData: null,
        formData: {
          id: 0,
          name: '',
          products: []
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 0, max: 10, message: '名称最长10个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'EditGroup'
      }
    },
    watch: {},
    methods: {
      showProductDetail (row) {
        this.$refs.dlgProductDetail.show(row, true)
      },
      handleDeleteItem (index) {
        this.formData.products.splice(index, 1)
      },
      async submit () {
        this.$refs.form.validate(async (validFrom) => {
          if (validFrom) {
            this.sendFormData(convertFromToParam(this.formData), this.appMsg)
          }
        })
      },
      async sendFormData (formData, appMsg) {
        try {
          this.saving = true
          if (this.mode === MODE_CREATE) {
            await ProductGroupApi.create(this.$tid, formData)
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
            })
          } else {
            await ProductGroupApi.edit(this.$tid, this.formData.id, formData)
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
          }
          this.$router.back()
        } finally {
          this.saving = false
        }
      },
      chooseProductCompleted (items) {
        this.formData.products = this.R.clone(items)
      },
      chooseProduct () {
        this.$refs.dlgChooseProduct.show(ChooseProductDialog.MODE_MULTIPLE, this.formData.products)
      },
      async initData () {
        this.loading = true
        try {
          if (this.isEditMode) {
            let res = await ProductGroupApi.getItem(this.$tid, this.$route.params.id)
            let respData = res.data
            respData.products = respData.products || []
            this.formData = respData
          }
          this.initialData = this.R.clone(this.formData)
        } finally {
          this.loading = false
        }
      },
      ...$global.$mapMethods({'showCover': showCover})
    },
    mounted () {
      this.initData()
    }
  }
</script>


<style lang="scss" scoped>
  .product-item {

    display: flex;

    .icon {
      width: 50px;
      height: 50px;
      margin-right: 8px;
    }

    .text {
      position: relative;
      height: 50px;
      flex: 1;
      min-width: 0;

      .name {
        color: #409eff;
        font-size: $font-size-content;
        line-height: 50px;
        min-width: 0;
        width: 100%;
        cursor: pointer;
      }
    }
  }


</style>
