<template lang="pug">
  div(v-loading="loading")
    div
      el-table.list-el-table(:data="dataList.data", border)
        el-table-column(label="商品")
          template(slot-scope="scope")
            div.productInfo
              div.infoImg(v-lazy:background-image="getImg(scope.row)")
              div.infoText(@click="") {{scope.row.name}}
        el-table-column(prop="profit", label="利润", width="100")
          template(slot-scope="scope")
            div {{scope.row | productProfit}}
        el-table-column(prop="price", label="售价", width="100")
          template(slot-scope="scope")
            div {{scope.row | productPrice}}
        el-table-column(prop="sold", label="销量", width="80")
          template(slot-scope="scope")
            //div {{scope.row.}}
        el-table-column(prop="stock", label="库存", width="80")
          template(slot-scope="scope")
            div {{scope.row.prop.stock}}
        el-table-column(prop="pt", label="首次上架", width="160")
          template(slot-scope="scope")
            div {{scope.row.pt | datetime}}
        el-table-column(label="操作", width="150", fixed="right")
          template(slot-scope="scope", v-if="showConsoleRow(scope.row)")
            el-button(size="mini", type="primary", @click="changeShelves(scope.row)") 上架
            el-button(size="mini", type="primary", @click="editItem(scope.row)") 编辑
      div
        el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import LoadPagerData from 'src/mixins/load-pager-data'
  import * as ProductApi from 'src/api/product'
  import * as ProductService from 'src/service/product/index'

  export default {
    mixins: [LoadPagerData],
    props: {},
    components: {},
    data () {
      return {
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
    methods: {
      getImg (row) {
        return ProductService.showCover(row)
      },
      showConsoleRow (row) {
        return row.status === ProductService.allStatus.down.value && row.prop.status === ProductService.allStatus.up.value
      },
      getQueryApi (params) {
        params.fd = 1
        params.status = ProductService.allStatus.down.value
        return ProductApi.getOwnProductList(this.$tid, params)
      },
      async changeShelves (row) {
        if (row.status === ProductService.allStatus.down.value) {
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
