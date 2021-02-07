<template lang="pug">
  div(v-loading="loading")
    div
      search-toolbar(:queryParams="queryParams", @submit="search")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="商品")
          template(slot-scope="scope")
            div.productInfo
              div.infoImg(v-lazy:background-image="getImg(scope.row)")
              div.infoText(@click="showProductDetail(scope.row)") {{scope.row.name}}
        el-table-column(label="利润", prop="suggest_price", sortable, width="110px")
          template(slot-scope="scope")
            div {{scope.row | productSuggestProfit}}
        el-table-column(label="建议售价", prop="suggest_price", sortable, width="110px")
          template(slot-scope="scope")
            div {{scope.row | productSuggestPrice}}
        el-table-column(label="库存", prop="stock", sortable, width="110px")
          template(slot-scope="scope")
            div {{scope.row.prop.stock}}
        el-table-column(label="操作", width="110px")
          template(slot-scope="scope")
            el-button(v-if="scope.row.tenant_shelf===false"  size="mini", type="primary", plain, @click="shelves(scope.row)", v-loading="btnLoading") 上架
    el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
    product-detail-dialog(ref="dlgProductDetail", @refresh="refreshList")
</template>

<script>
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import SearchToolbar from 'src/ui/product/choose-product/SearchToolbar.vue'
  import * as ProductApi from 'src/api/product'
  import * as ProductService from 'src/service/product/index'
  import { mapGetters } from 'vuex'
  import { getMe } from 'src/api/uc'

  export default {
    mixins: [
      LoadPagerData
    ],
    components: {
      SearchToolbar,
      ProductDetailDialog
    },
    data () {
      return {
        btnLoading: false,
        queryParams: {
          category_id: '',
          text: '',
          tags: []
        }
      }
    },
    watch: {},
    computed: {
      ...mapGetters(['currentTenant'])
    },
    methods: {
      showProductDetail (row) {
        this.$refs.dlgProductDetail.show(row)
      },
      getImg (row) {
        return ProductService.showCover(row)
      },
      getQueryApi (params) {
        return ProductApi.getChooseProductList(this.$tid, params)
      },
      async shelves (row) {
        this.btnLoading = true
        await getMe()
        this.btnLoading = false
        if (this.currentTenant.product_auth === 1) {
          this.$alert('请联系美市获得此权限', '未获得权限', {
            confirmButtonText: '确定'
          })
          return
        }
        try {
          this.loading = true
          await ProductApi.shelvesChooseProduct(this.$tid, row.id)
          this.$message({
            message: '商品上架成功',
            showClose: true,
            type: 'success'
          })
          this.loadDataList()
        } finally {
          this.loading = false
        }
      },
      refreshList () {
        this.loadDataList()
      },
      search (data) {
        this.queryChange(data)
      }
    }
  }
</script>


<style lang="scss" scoped>
  .productInfo {
    display: flex;

    .infoImg {
      width: 50px;
      height: 50px;
      background-size: cover;
      margin-right: 10px;
    }

    .infoText {
      flex: 1;
      color: $color-primary;
      text-decoration: underline;
      cursor: pointer;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-height: 23px;
      height: 46px;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
  }
</style>
