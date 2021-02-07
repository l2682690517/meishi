<template lang="pug">
  div.preview-image
    img(:src="resource.url")
</template>

<script>
  export default {
    props: {
      resource: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .preview-image {
    img {
      width: 100%;
      display: block;
    }
  }
</style>
