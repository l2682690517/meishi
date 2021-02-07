<template lang="pug">
  div.product-cell
    div.icon(v-lazy:background-image="orderItem.product_img_res.url")
    div.desc
      div.txt {{orderItem.product_name}}
      div.txt 规格: {{orderItem.spec}}
      div.txt 价格: {{orderItem.total_price | price}}
</template>

<script>
  export default {
    props: {
      orderItem: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .product-cell {
    display: flex;

    .icon {
      width: 80px;
      height: 80px;
      background-size: cover;
    }

    .desc {
      flex: 1;
      line-height: 1.4;
      padding-left: 5px;

      & > div {
        padding-bottom: 10px;
      }

      .txt {
        width: 150px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }
  }
</style>
