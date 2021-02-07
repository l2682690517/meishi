<template lang="pug">
  div.recipient
    div.items-wrapper
      div.info-item-wrapper
        div.txt-info
          div.txt-info
            span 买家：{{order.order_addr.name}}&nbsp;&nbsp;{{order.order_addr.mobile}}&nbsp;&nbsp; {{order.order_addr.province}}{{order.order_addr.city}}{{order.order_addr.district}}{{order.order_addr.town}}{{order.order_addr.address}}
          div.txt-info(v-if="order.remark")
            span 留言：{{order.remark}}
          div.txt-info(v-if="order.idcard")
            span 身份证号：{{order.idcard}}
        div.txt-info(style="border-left:1px #efefef solid;")
          div.txt-info.txt-info-time 下单时间：{{order.ct | datetime}}
          div.txt-info.txt-info-time(v-if="order.pt") 付款时间：{{order.pt | datetime}}
          div.txt-info.txt-info-time(v-if="order.dt") 发货时间：{{order.dt | datetime}}
          div.txt-info.txt-info-time(v-if="order.rt") 收货时间：{{order.rt | datetime}}

</template>

<script>
  export default {
    props: {
      order: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .txt-info {
    margin-top: 8px;
    color: #303133;
  }
  .txt-info-time {
    width: 220px;
    min-width: 200px;
    text-align: right;
  }

  .items-wrapper {
    padding-top: 0px;
    .info-item-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 0px;
    }

  }
</style>
