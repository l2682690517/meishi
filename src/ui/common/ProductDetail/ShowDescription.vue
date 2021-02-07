<template lang="pug">
  div.small-el-form
    div(v-for!="item in description")
      div(v-if="item.tp === allTp.img.value")
        img.resource-img.small-el-form(:src="item.url")
      div.preview-text(v-if="item.tp === allTp.text.value") {{ item.text }}
</template>

<script>
  import { allTp } from 'src/service/resource/index'

  export default {
    props: {
      description: {}
    },
    data () {
      return {
        ...$global.$mapConst({
          'allTp': allTp
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .resource-img {
    display: block;
  }
  .preview-text {
    word-wrap:break-word;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
    white-space: pre-wrap;
  }
</style>
