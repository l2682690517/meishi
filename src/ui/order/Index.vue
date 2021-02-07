<template lang="pug">
  div.order(v-loading="loading")
    search-bar(:queryParams="queryParams", @search="handleSearch")
    refunding-bar
    list(:dataList.sync="dataList")
    div.order-bottom.txt-head(v-if="dataList.data && dataList.data.length>0") 实付合计: {{showPrice(dataList.stat)}} &nbsp;&nbsp; 商品数量: {{showSold(dataList.stat)}}（其中退款金额：{{dataList.stat.refund_amount | price}}，退货数量：{{dataList.stat.refund_count}}）
    div.order-bottom
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar'
  import RefundingBar from './RefundingBar'
  import List from './List'
  import { orderList } from 'src/api/order'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { getShowPrice } from 'src/util/moneyUtil'
  import { getShowCount } from 'src/util/number'
  import { PUSH_STATUS_IN_COME, PUSH_STATUS_USER, PUSH_STATUS_DASHBOARD } from 'src/constants/orderPush'

  export default {
    mixins: [LoadPagerData],
    components: {
      SearchBar,
      RefundingBar,
      List
    },
    data () {
      return {
        loading: false,
        queryParams: {
          status: ['3', '4', '5'],
          searchKey: '',
          searchType: 'prod',
          start_time: new Date().getTime(),
          end_time: new Date().getTime()
        }
      }
    },
    watch: {
      dataList (val) {
        console.log(val)
      }
    },
    computed: {},
    methods: {
      handleSearch (model) {
        if (model.status.length === 0) {
          model.status = ''
        }
        this.queryChange(model)
      },
      getQueryApi (params) {
        return orderList(this.$tid, params)
      },
      showPrice (stat) {
        let price = 0
        if (stat && stat.sum) {
          price = stat.sum
        }
        return getShowPrice(price)
      },
      showProfit (stat) {
        let price = 0
        if (stat && stat.profit) {
          price = stat.profit
        }
        return getShowPrice(price)
      },
      showSold (stat) {
        let sold = 0
        if (stat && stat.count) {
          sold = stat.count
        }
        return getShowCount(sold)
      },
      autoSearch () {
        const status = this.$route.query.status
        if (status === PUSH_STATUS_DASHBOARD) {
          let params = {
            status: ['3', '4', '5', '6'],
            start_time: new Date().getTime() - 86400000,
            end_time: new Date().getTime() - 86400000
          }
          this.queryChange(params)
        }
        if (status === PUSH_STATUS_IN_COME) {
          let params = {
            start_time: this.$route.params.start,
            end_time: this.$route.params.end
          }
          this.queryChange(params)
        } else if (status === PUSH_STATUS_USER) {
          let params = {
            searchKey: String(this.$route.params.uid),
            searchType: 'user',
            start_time: '',
            end_time: ''
          }
          this.queryChange(params)
        }
      }
    },
    mounted () {
      this.autoSearch()
    }
  }
</script>

<style lang="scss" scoped>
  .order-bottom {
    padding-top: 8px;
  }
</style>
