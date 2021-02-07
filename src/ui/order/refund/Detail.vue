<template lang="pug">
  div.content(v-loading="loading")
    div.left
      div.txt-info
        div.icon(v-lazy:background-image="goodsImage")
        div 订单号：{{data.ocode}}
        div 规格：{{data.spec}}
        div 金额：{{data.price | price}} × {{data.count}}
        div 利润：{{data.total_profit | price}}
        div
          span(v-if="!data.dev_status") 物流：{{devStatusText}}
          span(v-else) 物流：
            el-button(type="text", @click="showExpress") {{devStatusText}}
    div.right
      div(v-if="isActionVisible")
        el-button(size="small", type="primary", @click="reply") 回复
        el-button(size="small", type="primary", @click="reject") 拒绝退款
        el-button(size="small", type="danger", @click="agree") 同意退款
      div
        message-item(v-for="item in data.refunds", :data="item", :key="item.id")
    reply(ref="reply", :oiid="data.id", @submit="replySuccess")
    reject(ref="reject", :oiid="data.id", @submit="rejectSuccess")
    agree(ref="agree", :orderItem="data", @submit="agreeSuccess")
    oi-express-dialog(ref="dlgExpress")
</template>

<script>
  import * as RefundStatus from 'src/constants/refund'
  import Agree from './Agree'
  import Reply from './Reply'
  import Reject from './Reject'
  import MessageItem from './MessageItem'
  import OiExpressDialog from '../express/OiIndex'
  import {orderItems} from '../../../api/order'

  export default {
    components: {
      Agree,
      Reply,
      Reject,
      MessageItem,
      OiExpressDialog
    },
    data () {
      return {
        loading: false,
        data: {},
        isSigned: false
      }
    },
    computed: {
      goodsImage () {
        if (this.data.product_img_res && this.data.product_img_res.url) {
          return this.data.product_img_res.url
        }
        return ''
      },
      devStatusText () {
        if (this.data.dev_status === 1) {
          return this.isSigned ? '已签收' : '已发货'
        } else {
          return '未发货(可能有延迟，请在ERP系统中核实)'
        }
      },
      isActionVisible () {
        // return true
        return this.data.refund_status === RefundStatus.STATUS_WAIT_ADMIN || this.data.refund_status === RefundStatus.STATUS_WAIT_CUSTOMER
      }
    },
    methods: {
      async resetItems () {
        try {
          const resRefund = await orderItems(this.$tid, this.$route.params.oiid)
          console.log(resRefund)
          this.data = resRefund.data
          this.loading = false
        } catch (e) {
          this.loading = false
        }
      },
      reply () {
        this.$refs.reply.show()
      },
      reject () {
        this.$refs.reject.show()
      },
      async agree () {
        await this.resetItems()
        this.$refs.agree.show()
      },
      replySuccess (result) {
        this.data.refunds.unshift(result)
      },
      rejectSuccess (result) {
        this.data.refunds.unshift(result)
        this.data.refund_status = RefundStatus.STATUS_REJECTED
      },
      agreeSuccess (result) {
        if (result) {
          this.data.refunds.unshift(result)
          this.data.refund_status = RefundStatus.STATUS_AGREED
        }
      },
      showExpress () {
        this.$refs.dlgExpress.show(this.$route.params.oiid)
      }
    },
    created () {
      if (this.$route.query.refund) {
        this.$parent.updateBreadcrumb([{
          text: '订单',
          to: {name: 'OrderIndex'}
        }, {
          text: '退款中',
          to: {name: 'OrderRefund'}
        }, {
          text: '退款详情'
        }])
      } else {
        this.$parent.updateBreadcrumb([{
          text: '订单',
          to: {name: 'OrderIndex'}
        }, {
          text: '订单详情',
          to: {name: 'OrderDetail', param: {id: this.$route.params.id}}
        }, {
          text: '退款详情'
        }])
      }
    },
    async mounted () {
      this.loading = true
      this.resetItems()

      // if (this.data.dev_status === 1) {
        // try {
        //   const resExpress = await OrderApi.getOiExpress(this.data.id)
        //   if (resExpress.data.deliverystatus === '4') {
        //     this.isSigned = true
        //   }
        // } catch (e) {}
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    display: flex;

    .left {
      width: 200px;
      & > div {
        border: solid 1px #efefef;
        padding: 10px;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      width: 550px;
      margin-left: 30px;

      & > div:last-child {
        flex: 1;
      }

      & > div:first-child {
        margin-bottom: 10px;
      }
    }

    .voucher-wrapper {
      margin-top: 5px;
      padding: 10px;
      border: solid 1px #efefef;
    }
  }

  .txt-info {
    margin-top: 8px;
    color: #868686;
    font-size: 13px;

    & > div {
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .icon {
      width: 100px;
      height: 100px;
      margin-bottom: 8px;
      background-size: cover;
      background-image: url("http://temp.im/754x754");
    }
  }
</style>
