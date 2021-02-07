<template lang="pug">
  div.small-el-form
    div(v-for!="item in afterService.items")
      div(v-if="item.tp === allTp.img.value")
        img.resource-img.small-el-form(:src="item.url")
      div(v-if="item.tp === allTp.text.value") {{ item.text }}
</template>

<script>
  import { allTp } from 'src/service/resource/index'

  export default {
    props: {
      afterService: {}
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

<style>
  .resource-img {
    display: block;
  }
</style>
