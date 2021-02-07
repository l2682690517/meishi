<template lang="pug">
  div(v-loading="loading")
    search-bar(@search="search", :queryParams="queryParams")
    list(:dataList.sync="dataList")
    div.order-bottom
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchBar from './SearchBar'
  import List from './List'
  import LoadPagerData from 'src/mixins/load-pager-data'
  import {refuseList} from '../../../api/refuse'

  export default {
    mixins: [LoadPagerData],
    components: {
      SearchBar,
      List
    },
    data () {
      return {
        queryParams: {
          refund_status: 0,
          prod_tp: 0,
          prod: '',
          start_time: 0,
          end_time: 0
        }
      }
    },
    computed: {},
    methods: {
      getQueryApi (params) {
        return refuseList(this.$tid, params)
      },
      search (model) {
        this.queryChange(model)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
