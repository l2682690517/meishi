<template lang="pug">
  div
    div.section-title 订单信息:
    el-table.list-wrapper(:data="order.show_order_items", border row-key="id")
      el-table-column(label="ID", width="70")
        template(slot-scope="scope")
          div.code-id {{scope.row.id}}
      el-table-column(label="商品", min-width="500")
        template(slot-scope="scope")
          div.info-wrapper
            div.icon-wrapper(v-lazy:background-image="scope.row.product_img_res.url")
            div.name {{scope.row.product_name}}, {{scope.row.spec}}, {{scope.row.price | price}} x {{scope.row.count}}
      el-table-column(label="退款", width="210", v-if="hasRefund")
        template(slot-scope="scope")
          div.status
            el-button(type="text", @click="goRefundDetail(scope.row)", v-if="refundBtnText(scope.row)") {{refundBtnText(scope.row)}}
          div.status(v-if="enableRefundToWx(scope.row)")
            el-button(type="text", @click="refundToWx(scope.row)") 退款至微信
      el-table-column(label="物流状态", width="210", v-if="showStatue")
        template(slot-scope="scope")
          div.status
            div(v-if="scope.row.dev_status === 1")
              el-button(type="text", @click="showExpress(scope.row)") 已发货(点击查看物流信息)
            div(v-else) 待发货
            div(v-if="scope.row.dev_status === 1") {{scope.row.dt | datetime}}
    div.items-wrapper
      div.info-item-wrapper
        div.txt-info
        div.txt-info
          span 商品金额：{{order.product_total_price | price}}，
          span 实付：{{order.total_price | price}}，
          span 利润
            el-tooltip(effect="light", placement="bottom-start")
              div(slot="content") 利润未扣除平台服务费
              i.el-icon-question
          span ：{{order.total_profit | price}}
    express-dialog(ref="dlgExpress")
    agree(ref="agree", :orderItem="currentOrderItem", @submit="$emit('refresh')")
</template>


<script>
  import * as RefundUtil from 'src/service/refund/refund'
  import * as OrderUtil from 'src/service/order/orderUtil'
  import { REFUND_STATUS_NO_APPLY } from '../../../constants/orderItem'
  import { orderItems } from '../../../api/order'
  import { refundToWx } from '../../../api/refuse'
  import Agree from '../refund/Agree'
  import ExpressDialog from 'src/ui/order/express/Index'

  export default {
    components: {
      Agree,
      ExpressDialog
    },
    props: {
      order: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        currentOrderItem: {}
      }
    },
    computed: {
      hasRefund () {
        console.log(this.order)
        return OrderUtil.hasRefund(this.order)
      },
      showStatue () {
        return this.order.status !== 1
      }
    },
    methods: {
      enableRefundToWx (orderItem) {
        return RefundUtil.enableRefundToWx(orderItem)
      },
      refundBtnText (orderItem) {
        const text = RefundUtil.refundBtnText(orderItem)
        if (text === '申请退款') {
          return ''
        }
        return text
      },
      showExpress (orderItem) {
        this.$refs.dlgExpress.show(this.order.id, orderItem.dev_name, orderItem.dev_no)
      },
      async goRefundDetail (row) {
        if (row.refund_status === REFUND_STATUS_NO_APPLY) {
          const resRefund = await orderItems(this.$tid, row.id)
          console.log(resRefund)
          this.currentOrderItem = resRefund.data
          this.$refs.agree.show()
        } else {
          this.$router.push({
            name: 'OrderRefundDetail',
            params: {
              id: row.order_id,
              oiid: row.id
            },
            query: {
              refund: false
            }
          })
        }
      },
      refundToWx (row) {
        this.$confirm('退款至微信?').then(async () => {
          try {
            this.loading = true
            await refundToWx(this.$tid, row.id)
            this.$message({
              showClose: true,
              message: '退款已成功',
              type: 'success'
            })
            this.$emit('refresh')
          } finally {
            this.loading = false
          }
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .section-title {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .code-id {
    width: 100%;
    text-align: center;
  }

  .status {
    padding-top: 5px;
    padding-bottom: 5px;

    & > button {
      padding: 0 20px !important;
    }
  }

  .list-wrapper {
    margin-top: 5px;
    .info-wrapper {
      display: flex;
      padding-top: 8px;
      padding-bottom: 8px;
      .icon-wrapper {
        padding-right: 5px;
        padding-top: 5px;
        width: 60px;
        height: 60px;
        background-size: cover;
      }
    }
  }

  .info-wrapper {
    display: flex;
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;

    .name {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-height: 17px;
      max-height: 34px;
      padding-left: 5px;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
  }

  .items-wrapper {
    padding-top: 5px;
    .info-item-wrapper {
      display: flex;
      padding-bottom: 5px;
      justify-content: space-between;
      text-align: right;
      padding-top: 5px;
    }

  }
</style>
