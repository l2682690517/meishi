<template lang="pug">
  div.preview-text {{resource.text}}
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
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .preview-text {
    word-wrap:break-word;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
    white-space: pre-wrap;
  }
</style>
