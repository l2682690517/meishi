<template lang="pug">
  div
    el-dialog(title="预览", :visible.sync="dialogVisible", width="55%")
      div
        div(v-for="(item, index) in resources")
          component(:is="getResourceComp(item)", :resource="item")
</template>

<script>
  import PreviewImage from './PreviewImage'
  import PreviewText from './PreviewText'
  import PreviewVideo from './PreviewVideo'

  export default {
    components: {
      PreviewImage,
      PreviewText,
      PreviewVideo
    },
    props: {
      resources: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        dialogVisible: false
      }
    },
    methods: {
      show () {
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      getResourceComp (resource) {
        switch (resource.tp) {
          case 1:
            return 'PreviewImage'
          case 2:
            return 'PreviewText'
          case 3:
            return 'PreviewVideo'
        }
      }
    },
    watch: {
      dialogVisible (v) {
        this.$eventBus.emit('eventPreviewVideo', v)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
