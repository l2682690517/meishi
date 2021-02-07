<template lang="pug">
  div.item
    div.text.single-line
      div.name.single-line {{productGroup.name}}
</template>

<script>
  export default {
    props: {
      productGroup: {}
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
  }

</style>
