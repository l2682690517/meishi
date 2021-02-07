<template lang="pug">
  div(v-loading="loading")
    div
      search-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-button(type="primary", icon="el-icon-plus", @click="create", v-loading="btnLoading") 添加自营商品
      el-button(type="primary", @click="choosePro", v-loading="btnLoading") 选&nbsp&nbsp货
        el-tooltip(effect="light", placement="bottom-start")
          div(slot="content") 百宝美市为您供货
            br/ 采购客服物流全程无忧
            br/ 价格图文随心编辑
            br/ 按进货价结算
          i.el-icon-question(style="margin-left:10px")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(label="商品")
          template(slot-scope="scope")
            div.productInfo
              div.infoImg(v-lazy:background-image="getImg(scope.row)")
              div.infoText(@click="showProductDetail(scope.row)") {{scope.row.name}}
        el-table-column(prop="profit", label="利润", sortable, width="100")
          template(slot-scope="scope")
            div {{scope.row | productProfit}}
        el-table-column(prop="price", label="售价", sortable, width="100")
          template(slot-scope="scope")
            div {{scope.row | productPrice}}
        el-table-column(prop="sold", label="销量", sortable, width="80")
          template(slot-scope="scope")
            div {{ scope.row.sold }}
        el-table-column(prop="stock", label="库存", sortable, width="80")
          template(slot-scope="scope")
            div {{scope.row.prop.stock}}
        el-table-column(prop="pt", label="首次上架", sortable, width="160")
          template(slot-scope="scope")
            div {{scope.row.pt | datetime}}
        el-table-column(label="来源", prop="tp", width="80")
          template(slot-scope="scope")
            div {{getTpText(scope.row)}}
        el-table-column(label="操作", width="150", fixed="right")
          div(slot-scope="scope")
            el-button(size="mini", :type="statusButtonType(scope.row)", plain,  @click="changeShelves(scope.row)") {{ scope.row | productStatusControl }}
            el-button(size="mini", plain,  @click="editItem(scope.row)") 编辑
            div.btn-mina-wrapper
              el-button(size="mini", plain,  v-clipboard:copy="getAppUrl(scope.row)", v-clipboard:success="onCopy", v-clipboard:error="onError") 小程序链接
      div.bottom-div
        el-button.bottom-btn(size="small", @click="handlePlatformDown") 平台下架
      div
        el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
      product-detail-dialog(ref="dlgProductDetail")
</template>

<script>
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'
  import SearchToolbar from 'src/ui/product/product-management/SearchToolbar.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as ProductApi from 'src/api/product'
  import * as ProductService from 'src/service/product/index'
  import { mapGetters } from 'vuex'
  import { getMe } from 'src/api/uc'

  export default {
    mixins: [LoadPagerData],
    props: {},
    components: {
      SearchToolbar,
      ProductDetailDialog
    },
    data () {
      return {
        btnLoading: false,
        queryParams: {
          tp: 0,
          status: 1,
          text: ''
        },
        ...$global.$mapConst({
          'allStatus': ProductService.allStatus
        })
      }
    },
    watch: {},
    computed: {
      ...mapGetters(['currentTenant'])
    },
    methods: {
      getAppUrl (row) {
        return `pages/goods/detail?pid=${row.id}`
      },
      onError () {
        this.$message({
          type: 'danger',
          message: '复制失败'
        })
      },
      onCopy () {
        this.$message({
          type: 'success',
          message: '已复制小程序连接到剪贴板'
        })
      },
      getImg (row) {
        return ProductService.showCover(row)
      },
      showProductDetail (row) {
        this.$refs.dlgProductDetail.show(row)
      },
      statusButtonType (row) {
        if (row.status === ProductService.allStatus.down.value) {
          return 'success'
        } else {
          return ''
        }
      },
      getQueryApi (params) {
        return ProductApi.getOwnProductList(this.$tid, params)
      },
      async changeShelves (row) {
        if (row.status === ProductService.allStatus.up.value) {
          await this.$confirm('下架商品？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await ProductApi.down(this.$tid, row.id)
          this.$message({
            type: 'success',
            message: '下架成功'
          })
        } else if (row.status === ProductService.allStatus.down.value) {
          await this.$confirm('上架商品？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await ProductApi.up(this.$tid, row.id)
          this.$message({
            type: 'success',
            message: '上架成功'
          })
        }
        this.loadDataList()
      },
      getTpText (row) {
        if (row.tp === ProductService.allTp.self_support.value) {
          return ProductService.allTp.self_support.text
        } else if (row.tp === ProductService.allTp.choose_platform.value) {
          return ProductService.allTp.choose_platform.text
        }
      },
      async choosePro () {
        this.btnLoading = true
        await getMe()
        this.btnLoading = false
        if (this.currentTenant.product_auth === 1) {
          this.$alert('请联系美市获得此权限', '未获得权限', {
            confirmButtonText: '确定'
          })
        } else {
          this.$router.push({
            name: 'ChooseProduct'
          })
        }
      },
      editItem (row) {
        let query = {}
        if (row.tp === ProductService.allTp.choose_platform.value) {
          query.choose = 1
        }

        this.$router.push({
          name: 'EditProduct',
          params: {
            id: row.id
          },
          query
        })
      },
      async create () {
        this.btnLoading = true
        await getMe()
        this.btnLoading = false
        if (this.currentTenant.product_auth === 2) {
          this.$alert('请联系美市获得此权限', '未获得权限', {
            confirmButtonText: '确定'
          })
        } else {
          this.$router.push({
            name: 'CreateProduct'
          })
        }
      },
      handleSearch (data) {
        this.queryChange(data)
      },
      handlePlatformDown () {
        this.$router.push({
          name: 'PlatformDown'
        })
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

  .bottom-div {
    width: 100%;
    height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    .bottom-btn {
      float: right;
    }
  }

  .btn-mina-wrapper {
    margin-top: 10px;
  }

</style>
