<template lang="pug">
  div(v-loading="loading")
    div
      div.head
        div.head-cover.round(v-lazy:background-image="userData.logo")
        div.head-name {{userData.nickname}}
      div.body-detail
        div.body-item 手机：{{showMobile(userData.mobile)}}
        div.body-border
        div.body-item 用户ID：{{userData.id}}
        div.body-border
        div.body-item 店铺：
        div.body-item {{userData.tenantNickName}}
        div.body-border
        div.body-item 首次访问：{{showTime(userData.ct)}}
      div.body-bottom-line
      div.list-title
        div.list-title-head
          div.list-title-item 订单统计
          div.list-title-item.btn(type="text", @click="toOrder(userData)") 详情
        div.list
          el-table.list-el-table(:data="dataList", border)
            el-table-column(label="最近购买", prop="recent_pay_tick")
              template(slot-scope="scope")
                div {{scope.row.recent_pay_tick | date}}
            el-table-column(label="平均交易额（元）", prop="")
              template(slot-scope="scope")
                div {{showAverage(scope.row) | price}}
            el-table-column(label="总交易额（元）", prop="")
              template(slot-scope="scope")
                div {{scope.row.total_amount | price}}
            el-table-column(label="订单总数", prop="total_count")
</template>

<script>
  import * as UserInfoApi from 'src/api/userInfo'
  import {getUserShowData, getUserOrderDataList} from 'src/service/user-info/index'
  import {dateFormat} from 'src/util/format'
  import { PUSH_STATUS_USER } from 'src/constants/orderPush'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dataList: [],
        userData: {
          logo: '',
          nickname: '',
          tenantNickName: '',
          id: '',
          mobile: '',
          ct: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      async getDetail () {
        try {
          this.loading = true
          let res = await UserInfoApi.getUserDetail(this.$tid, this.$route.params.uid)
          this.userData = getUserShowData(res.data)
          this.dataList = getUserOrderDataList(res.data)
          this.loading = false
        } catch (err) {
          this.loading = false
        }
      },
      toOrder (row) {
        this.$router.push({
          name: 'OrderIndex',
          params: {
            uid: row.id
          },
          query: {
            status: PUSH_STATUS_USER
          }
        })
      },
      showTime (row) {
        if (row !== '') {
          return dateFormat(row)
        }
        return '没有首次访问时间'
      },
      showMobile (row) {
        return row === '' ? '未知' : row
      },
      showAverage (row) {
        let data = row.total_amount / row.total_count
        data = data.toFixed()
        return data
      }
    },
    created () {
      if (this.$route.query.order) {
        this.$parent.updateBreadcrumb([{
          text: '订单',
          to: {name: 'OrderIndex'}
        }, {
          text: '订单详情',
          to: {name: 'OrderDetail', param: {id: this.$route.params.id}}
        }, {
          text: '用户详情'
        }])
      } else {
        this.$parent.updateBreadcrumb([{
          text: '用户',
          to: {name: 'UserInfoIndex'}
        }, {
          text: '用户详情'
        }])
      }
    },
    mounted () {
      this.getDetail()
    }
  }
</script>


<style lang="scss" scoped>

  .head {
    display: flex;
    height: 50px;
    align-items: center;
    .head-cover {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
    }
    .head-name {
      margin-left: 10px;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
    }
  }

  .body-status {
    display: flex;
    margin-top: 20px;
    align-items: center;
    .body-item-status {
      display: inline-block;
      font-size: 12px;
      height: 17px;
      line-height: 17px;
      margin-right: 10px;
    }
  }

  .body-detail {
    margin-top: 20px;
    display: flex;
    height: 21px;
    align-items: center;
    .body-border {
      display: inline-block;
      border-right: solid 1px #DCDFE6;
      margin-left: 10px;
      margin-right: 10px;
      height: 21px;
      background-color: #DCDFE6;
    }
    .body-item {
      display: inline-block;
      height: 17px;
      font-size: 12px;
      line-height: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

  }

  .list-title {
    .list-title-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .list-title-item {
        font-size: 16px;
        height: 22px;
        line-height: 22px;
        display: inline-block;
      }
      .list-title-item-details {
        display: inline-block;
      }
    }
  }

  .body-bottom-line {
    border-top: 1px solid #DCDFE6;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .btn {
    color: $color-primary;
    cursor: pointer;
  }

  .margin-top {
    margin-top: 30px;
  }

  .round {
    border-radius: 50%
  }

</style>
