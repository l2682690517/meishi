import Vue from 'vue'
import { isNumber } from 'src/util/number'

const QUERY_PAGER_LIMIT = 10

export default {
  data () {
    return {
      loading: false,
      dataList: {
        data: [],
        page: 0,
        limit: 0,
        total: QUERY_PAGER_LIMIT
      },
      autoLoadData: true,
      /**
       * @override 需要
       */
      queryParams: {},
      originalQueryParams: {},
      queryPager: {
        page: 1,
        limit: QUERY_PAGER_LIMIT
      },
      sortParams: {
        sort: '',
        order: ''
      },
      isInitPager: false
    }
  },
  computed: {
    dataListTotal () {
      return this.dataList.total
    },
    /**
     * 绑定el-table组件的defaultSort
     * @returns {{prop: string, order: string}}
     */
    dataListSortInfo () {
      return {
        prop: this.sortParams.sort,
        order: this.sortParams.order === 'asc' ? 'ascending' : 'descending'
      }
    }
  },
  methods: {
    /**
     * @override
     * 查询Api，必须重载
     * @param params
     */
    getQueryApi (params) {
    },
    /**
     * @override
     * 优先重载
     * @param key
     * @param l queryParams对象
     * @param r 一般为route.query
     * @returns {null}
     */
    getBuildQueryParamsFn (key, l, r) {
      return null
    },
    /**
     * @override
     * 可选重载
     */
    getQueryParamsFromRoute () {
      return Vue.R_.updateWithObjCustom(this.getBuildQueryParamsFn, this.originalQueryParams, this.$route.query)
    },
    /**
     * 在autoLoad方法前调用，返回true时，表示我重置路由参数
     * @param to
     * @param from
     * @returns {boolean}
     */
    shouldResetRouteQuery (to, from) {
      return false
    },
    /**
     * 重置查询
     */
    resetQuery () {
      const routeQuery = {...this.originalQueryParams}
      routeQuery.timestamp = new Date().getTime()
      Object.assign(routeQuery, this.sortParams)
      this.$router.replace({
        path: this.$route.path,
        query: routeQuery,
        params: this.$route.params
      })
    },
    /**
     * @override
     * 查询dataList之前调用的方法
     */
    beforeLoadDataList () {
      this.loading = true
      this.$emit('beforeLoad')
    },
    /**
     * @override
     * 查询dataList完成后调用的方法
     * @param err
     */
    loadDataListCompleted (err) {
      this.loading = false
      this.$emit('loadCompleted', err)
    },
    /**
     * 载入数据
     */
    async loadDataList () {
      await this.$nextTick()
      this.beforeLoadDataList()
      try {
        this.queryParams = this.getQueryParamsFromRoute()
        let fullParams = {...this.queryParams, ...this.queryPager}
        if (this.sortParams.sort && this.sortParams.sort !== '') {
          fullParams.sort = this.sortParams.sort
          if (this.sortParams.order && this.sortParams.order !== '') {
            fullParams.order = this.sortParams.order
          }
        }
        const res = await this.getQueryApi(fullParams)
        this.dataList = res.data
        if (!this.dataList.data) {
          this.dataList.data = []
        }
        this.loadDataListCompleted()
      } catch (err) {
        console.log('err', err)
        this.loadDataListCompleted(err)
      }
    },
    /**
     * 载入指定页，如果已经是当前页了，调用api刷新，如果不是当前页，修改queryParams的page，触发current-change事件
     */
    loadDataListByPage (page) {
      if (this.queryPager.page === page) {
        this.loadDataList()
      } else {
        // 如果当前的页码，大于总量时，会自动跳转回第1页，所以需要手动设置total
        if (this.dataListTotal < this.queryPager.limit * page) {
          this.dataList.total = this.queryPager.limit * page
        }
        this.queryPager.page = page
      }
    },
    /**
     * 载入第一页数据
     */
    loadFirstPageDataList () {
      this.loadDataListByPage(1)
    },
    /**
     * 载入Query的页数据
     */
    loadDataListByQueryPage (query) {
      const routeQuery = query || this.$route.query
      let page = isNumber(routeQuery.page) ? parseInt(routeQuery.page) : 1
      if (page < 1) {
        page = 1
      }
      this.loadDataListByPage(page)
    },
    /**
     * 绑定el-pagination组件的@current-change事件
     * @param current 页
     */
    changePage (current) {
      this.queryPager.page = current
      const routeQuery = {...this.$route.query}
      routeQuery.page = current
      routeQuery.timestamp = new Date().getTime()
      this.$router.replace({
        path: this.$route.path,
        query: routeQuery,
        params: this.$route.params
      })
    },
    /**
     * 绑定el-table组件的@sort-change事件
     * @param sortInfo 排序信息
     * @param keepPage 保存当前页
     */
    sortChanged (sortInfo, keepPage) {
      if (!this.isInitPager) {
        return
      }
      let routeQuery = {...this.$route.query}
      routeQuery.timestamp = new Date().getTime()
      routeQuery.sort = sortInfo.prop ? sortInfo.prop : ''
      routeQuery.order = sortInfo.prop ? (sortInfo.order === 'ascending' ? 'asc' : 'desc') : ''
      routeQuery.page = keepPage ? this.queryPager.page : 1
      this.$router.replace({
        path: this.$route.path,
        query: routeQuery,
        params: this.$route.params
      })
    },
    /**
     * 查询数据修改
     */
    queryChange (newQueryParams, keepPage) {
      let routeQuery = {...newQueryParams}
      routeQuery.timestamp = new Date().getTime()
      if (keepPage) {
        routeQuery.page = this.queryPager.page
      }
      this.$router.replace({
        path: this.$route.path,
        query: routeQuery,
        params: this.$route.params
      })
    }
  },
  created () {
    // 设置element-ui分页组件的默认值，必须在created中设置
    const routeQuery = this.$route.query
    this.queryPager.page = isNumber(routeQuery.page) ? parseInt(routeQuery.page) : 1
    this.sortParams = Vue.R_.updateWithObj(this.sortParams, routeQuery)
    Object.assign(this.originalQueryParams, this.queryParams)
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      // 等待element-ui设置默认值完成
      await vm.$nextTick()
      vm.isInitPager = true
      if (vm.autoLoadData) {
        if (vm.shouldResetRouteQuery(to, from)) {
          const routeQuery = {...vm.originalQueryParams}
          routeQuery.timestamp = new Date().getTime()
          Object.assign(routeQuery, vm.sortParams)
          vm.$router.replace({
            path: vm.$route.path,
            query: routeQuery,
            params: vm.$route.params
          })
          return
        }
        vm.loadDataListByQueryPage()
      }
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.sortParams = Vue.R_.updateWithObj(this.sortParams, to.query)
    this.loadDataListByQueryPage(to.query)
    next()
  }
}
