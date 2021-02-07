<template lang="pug">
  div.list-wrapper
    el-table(:data="dataList.data", border, row-key="id")
      el-table-column(label="订单信息")
        template(slot-scope="scope")
          div.info-wrapper
            div.icon-wrapper(v-lazy:background-image="scope.row.product_img_res.url")
            div.desc-wrapper
              div 订单号：{{scope.row.ocode}}
              div {{scope.row.product_name}}
              div 规格：{{scope.row.spec}}
              div {{scope.row.price | price}} X {{scope.row.count}}
      el-table-column(label="收货信息")
        template(slot-scope="scope")
          div(v-if="scope.row.order_addr")
            div {{scope.row.order_addr.name}} {{scope.row.order_addr.mobile}}
            div {{scope.row.order_addr.province}}{{scope.row.order_addr.city}}{{scope.row.order_addr.district}}{{scope.row.order_addr.town}}{{scope.row.order_addr.address}}
            div(style="margin-top: 5px;", v-if="scope.row.order_remark") 备注：{{scope.row.order_remark}}
      el-table-column(label="退款状态", width="200")
        template(slot-scope="scope")
          div
            el-button(size="mini", @click="goDetail(scope.row)") {{buttonText(scope.row)}}
          div.remark(v-if="lastRemark(scope.row)") 备注：{{lastRemark(scope.row)}}
</template>

<script>
  import {refundBtnText} from '../../../service/refund/refund'

  export default {
    components: {},
    props: {
      dataList: {}
    },
    data () {
      return {}
    },
    computed: {},
    methods: {
      buttonText (orderItem) {
        return refundBtnText(orderItem)
      },
      lastRemark (orderItem) {
        const rp = orderItem.last_refund_sys_remark || ''
        if (rp) {
          return rp
        }
        return ''
      },
      goDetail (row) {
        this.$router.push({
          name: 'OrderRefundDetail',
          params: {
            id: row.order_id,
            oiid: row.id
          },
          query: {
            refund: true
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-wrapper {
    margin-top: 20px;

    .info-wrapper {
      display: flex;
      padding-top: 8px;
      padding-bottom: 8px;

      .icon-wrapper {
        width: 60px;
        height: 60px;
        background-size: cover;
        margin-right: 10px;
      }

      .desc-wrapper {
        flex: 1;
      }
      .remark {

      }
    }
  }
</style>
