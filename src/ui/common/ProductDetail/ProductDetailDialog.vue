<template lang="pug">
  div
    el-dialog(title="商品详情",
    :visible.sync="dialogVisible",
    width="750px",
    )
      div(v-loading="loading")
        product-detail(:rowFormData="formData", :isPrompt="prompt", :isShelves="shelves", @hide="hide")
</template>

<script>
  import ProductDetail from './Index'
  import * as ProductApi from 'src/api/product'

  export default {
    props: {},
    components: {ProductDetail},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        formData: {},
        prompt: false,
        shelves: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      reset () {
        this.formData = {
          name: '',
          head: [],
          cover: {
            url: ''
          },
          prop: {
            ext: {}
          }
        }
      },
      show (item, needPrompt) {
        this.reset()
        if (needPrompt) {
          this.prompt = needPrompt
        }
        this.shelves = item.tenant_shelf
        this.dialogVisible = true
        this.getDetail(item.id, item.tp)
      },
      hide (refresh) {
        this.dialogVisible = false
        if (refresh) {
          this.$emit('refresh')
        }
      },
      async getDetail (id, tp) {
        try {
          this.loading = true
          let res = ''
          if (tp === 2 || tp === 3) {
            res = await ProductApi.getItem(this.$tid, id)
          } else {
            res = await ProductApi.getChooseProductItem(this.$tid, id)
          }
          this.formData = res.data
          this.loading = false
        } catch (err) {
          console.log(err)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
