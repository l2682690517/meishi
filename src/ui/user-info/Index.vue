<template lang="pug">
  div
    div
      search-toolbar(:queryParams="queryParams", @submit="handleSearch")
    div
      el-table.list-el-table(v-loading="loading", :data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="", label="用户ID")
          div(slot-scope="scope")
            el-button(type="text", @click="toDetail(scope.row)") {{scope.row.id}}
        el-table-column(prop="", label="用户")
          div(slot-scope="scope")
            el-button(type="text", @click="toDetail(scope.row)") {{scope.row.nickname}}
        el-table-column(prop="", label="首次访问")
          template(slot-scope="scope")
            div {{showDate(scope.row)}}
        el-table-column(prop="", label="店铺")
          div(slot-scope="scope") {{getTenantName(scope.row)}}
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import SearchToolbar from 'src/ui/user-info/SearchToolbar.vue'
  import {dateFormat} from 'src/util/format'
  import * as UserInfoApi from 'src/api/userInfo'
  import LoadPagerData from 'src/mixins/load-pager-data'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {
      SearchToolbar
    },
    data () {
      return {
        queryParams: {
          key: '',
          start: new Date().getTime(),
          end: new Date().getTime()
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
        return UserInfoApi.getUserList(this.$tid, this.R.mapObjIndexed((val, key, obj) => {
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
      toDetail (row) {
        this.$router.push({
          name: 'UserDetail',
          params: {
            uid: row.id
          }
        })
      },
      showDate (row) {
        return dateFormat(row.ct, 'YYYY-MM-DD')
      },
      handleSearch (data) {
        this.queryChange(data)
      },
      getTenantName (row) {
        if (row && row.tenant) {
          return row.tenant.nick_name
        } else {
          return '无店铺'
        }
      }
    },
    mounted () {
    }
  }
</script>


<style lang="scss" scoped>

</style>
