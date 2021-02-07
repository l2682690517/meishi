<template lang="pug">
  div.item
    div.icon.img-cover(v-lazy:background-image="showCover(product)")
    div.text.single-line
      div.name.single-line {{product.name}}
      div.price {{product | productPrice}}
</template>

<script>
  import { showCover } from 'src/service/product/index'

  export default {
    props: {
      product: {}
    },
    methods: {
      ...$global.$mapMethods({'showCover': showCover})
    }
  }
</script>

<style lang="scss" scoped>

  .item {
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    align-items: center;
    border: solid 1px $border-color-level1;
    padding: 8px;
  }

  .icon {
    width: 50px;
    height: 50px;
    margin-right: 8px;
  }

  .text {
    position: relative;
    height: 50px;
    flex: 1;
    min-width: 0;

    .name {
      color: $font-color-common;
      font-size: $font-size-content;
      line-height: 50px;
      min-width: 0;
      width: 100%;

    }
    .price {
      position: absolute;
      bottom: 0;
      color: $font-color-secondary;
      font-size: $font-size-desc;
      line-height: 1.2;
    }
  }

</style>
