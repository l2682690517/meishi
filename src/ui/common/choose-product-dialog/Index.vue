<template lang="pug">
  el-dialog(title="选择商品", :visible.sync="dialogVisible")
    div.noProduct(v-if="(!dataList.data || dataList.data.length ===0) && !loading && !queryText")
      div.text 还没有商品，请用下列方式添加
      div.button-box
        el-button(@click="toChooseProduct") 在平台供货中挑选
        el-button(@click="toProductManagement") 上传自营商品
    div(v-else)
      div.search-el-input
        el-input(placeholder="商品名称/编码", v-model.trim="searchText")
          el-button(slot="append", icon="el-icon-search", @click="handleSearch") 搜索
      div(v-loading="loading")
        product-grid(ref="grdProduct", :allItems="dataList.data", :mode="mode", :disabledItems="disabledItems", @item-click="itemClick")
    div(slot="footer", class="dialog-footer", v-if="mode === $options.MODE_MULTIPLE")
      el-button(size="mini", @click="dialogVisible = false") 取 消
      el-button(size="mini", type="primary", @click="submitForm", :disabled="loading") 确 定
</template>

<script>
  import * as ProductApi from 'src/api/product'
  import ProductGrid from './Grid.vue'

  export default {
    MODE_SINGLE: ProductGrid.MODE_SINGLE,
    MODE_MULTIPLE: ProductGrid.MODE_MULTIPLE,
    components: {
      ProductGrid
    },
    data () {
      return {
        loading: false,
        dialogVisible: false,
        mode: ProductGrid.MODE_SINGLE,
        dataList: {
          data: []
        },
        disabledItems: [],
        searchText: '',
        queryText: ''
      }
    },
    methods: {
      toChooseProduct () {
        this.$router.push({
          name: 'ChooseProduct'
        })
      },
      toProductManagement () {
        this.$router.push({
          name: 'ProductManagement'
        })
      },
      async show (mode, originalCheckedItems, disabledItems) {
        this.mode = mode
        this.searchText = ''
        this.dialogVisible = true
        this.disabledItems = disabledItems
        await this.refreshList()
        await this.$nextTick()
        this.$refs.grdProduct && this.$refs.grdProduct.setCheckedItems(originalCheckedItems || [])
      },
      hide () {
        this.dialogVisible = false
      },
      handleSearch () {
        this.refreshList(this.searchText)
      },
      async refreshList (text) {
        this.queryText = text
        this.loading = true
        try {
          const res = await ProductApi.getOwnAllProductList(this.$tid, {text})
          this.dataList = res.data || []
        } finally {
          this.loading = false
        }
      },
      submitForm () {
        this.$emit('choose', [...this.$refs.grdProduct.checkedItems])
        this.hide()
      },
      itemClick (item) {
        if (this.mode === ProductGrid.MODE_SINGLE) {
          this.$emit('choose', [item])
          this.hide()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .noProduct {
    height: 300px;
    .text {
      width: 500px;
      font-size: 26px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 50px;
    }
    .button-box {
      width: 300px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 50px;
    }
  }

  .tool-bar {
    .search-wrapper {
      display: inline-block;
      padding-bottom: 5px;
      margin-right: 10px;

      .input-text {
        width: 150px;
        margin-right: 8px;
      }

    }

    .filter-wrapper {
      display: inline-block;

      padding-bottom: 5px;

      .filter-btn {
        margin-right: 10px;
      }

      .tag-wrapper {
        margin-top: 5px;
        display: inline-block;

        .tag-content {
          display: inline-block;
          max-width: 200px
        }
      }
    }
  }

  .content {
    clear: both;
  }

  .pager-wrapper {
    text-align: center;
  }

</style>
