<template lang="pug">
  div.bottom-container
    slot
</template>

<script>
  export default {}
</script>

<style lang="scss" scoped>
  .bottom-container {
    position: fixed;
    right: 0;
    bottom: 0;
    height: $bottom-height;
    left: $side-width;
    width: 100%;
    line-height: 56px;
    box-shadow: 0 -1px 2px rgba(0, 0, 0, .03);
    background: #fff;
    border-top: 1px solid #e8e8e8;
    padding: 0 16px;
  }
</style>
