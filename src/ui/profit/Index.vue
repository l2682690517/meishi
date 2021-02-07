<template lang="pug">
  div(v-loading="loading")
    search-bar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="start_tick", label="统计周期", sortable)
          template(slot-scope="props") {{ showStatPeriod(props.row) }}
        el-table-column(prop="sale_total_amount", label="销售额(元)", sortable)
          template(slot-scope="props")
            div.total-amount(@click="clickAmount") {{ props.row.sale_total_amount | price(false) }}
        el-table-column(prop="sp_total_amount", label="货款(元)", sortable)
          template(slot-scope="props") {{ props.row.sp_total_amount | price(false) }}
        el-table-column(prop="platform_fee", label="平台服务费(元)", sortable)
          template(slot-scope="props") {{ props.row.platform_fee | price(false) }}
        el-table-column(prop="tenant_total_amount", label="利润(元)", sortable)
          template(slot-scope="props") {{ props.row.tenant_total_amount | price(false) }}
      div(v-if="dataList.data && dataList.data.length>1").bottom.txt-head 销售总额: {{overview.sale_total_amount | friendlyPrice(false)}}，货款合计: {{overview.sp_total_amount | friendlyPrice(false)}}，平台服务费：{{overview.total_platform_fee | friendlyPrice(false)}}, 利润合计: {{overview.tenant_total_amount | friendlyPrice(false)}}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar.vue'
  import * as BillApi from 'src/api/bill'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import { dateFormat } from 'src/util/format'
  import { PUSH_STATUS_IN_COME } from 'src/constants/orderPush'

  export default {
    name: 'ProfitIndex',
    mixins: [
      LoadPagerData
    ],
    components: {
      SearchBar
    },
    data () {
      return {
        queryParams: {
          start: 0,
          end: 0
        },
        overview: {
          sale_total_amount: 0,
          sp_total_amount: 0,
          total_platform_fee: 0,
          tenant_gross_total_amount: 0,
          tenant_total_amount: 0
        }
      }
    },
    watch: {},
    methods: {
      getQueryApi (params) {
        return BillApi.getProfitList(this.$tid, this.R.mapObjIndexed((val, key, obj) => {
          if (key === 'start' || key === 'end') {
            if (val === 0) {
              return ''
            } else {
              return dateFormat(val, 'YYYY-MM-DD')
            }
          }
          return val
        })(params))
      },
      shouldResetRouteQuery (to, from) {
        return from.name === 'ProfitCreate'
      },
      handleSearch (result) {
        this.queryChange(result)
      },
      showStatPeriod (row) {
        const start = dateFormat(row.start_tick, 'YYYY-MM')
        const end = dateFormat(row.end_tick, 'YYYY-MM')
        return start === end ? start : `${start}~${end}`
      },
      clickAmount () {
        this.$router.push({
          name: 'OrderIndex',
          params: {
            start: this.queryParams.start,
            end: this.queryParams.end
          },
          query: {
            status: PUSH_STATUS_IN_COME
          }
        })
      }
    },
    async mounted () {
      const res = await BillApi.getProfitOverview(this.$tid)
      this.overview = res.data.stat
    }
  }
</script>

<style lang="scss" scoped>
  .bottom {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .total-amount {
    text-decoration: underline;
    color: $color-primary;
    cursor: pointer;
  }
</style>
