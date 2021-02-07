<template lang="pug">
  div
    el-dialog(title="选择商品", :visible.sync="dialogVisible", v-loading="loading")
      div.small-el-input
        el-input(placeholder="商品名称/编码")
          el-button(slot="append", icon="el-icon-search") 搜索
      div(v-loading="loading")
        product-grid(ref="grdProduct", :allItems="dataList.data", :originalItems="changeOriginalItems", @hide="hide", @submitItemsAndIds="submitItemsAndIds")
</template>

<script>
  import ProductGrid from 'src/ui/product_group/choose-product-dialog/ProductGrid'
  import * as ProductApi from 'src/api/product'
  import { mapGetters } from 'vuex'

  export default {
    props: {
      originalItems: {
        type: Array,
        default: []
      }
    },
    components: {
      ProductGrid
    },
    data () {
      return {
        loading: false,
        dialogVisible: false,
        changeOriginalItems: [],
        dataList: {},
        filterForm: {
          limit: 30,
          page: 1,
          name: ''
        }
      }
    },
    computed: {
      ...mapGetters(['currentTenant'])
    },
    watch: {
      originalItems () {
        this.changeOriginalItems = this.originalItems
      },
      dialogVisible: function (newValue, oldValue) {
        if (newValue) {
          this.refreshListForm()
        } else {
          this.filterForm = {
            limit: 30,
            page: 1
          }
        }
      }
    },
    methods: {
      submitItemsAndIds (items) {
        this.$emit('submitItemsAndIds', items)
      },
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      async refreshListForm () {
        this.loading = true
        try {
          const res = await ProductApi.getOwnProductList(this.filterForm, this.$tid)
          this.dataList = res.data
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../../assets/scss/variable";
  @import "../../../assets/scss/el";
</style>
