<template lang="pug">
  div.preview-video
    div.play(v-if="showPlay", v-html="resource.content")
    div {{resource.title}}
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
    data () {
      return {showPlay: true}
    },
    mounted () {
      this.$eventBus.on('eventPreviewVideo', (val) => {
        this.showPlay = val
      })
    }
  }
</script>

<style lang="scss" scoped>
  .preview-video {
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
    .play {
      width: 100%;
      height: auto;
    }
  }
</style>
