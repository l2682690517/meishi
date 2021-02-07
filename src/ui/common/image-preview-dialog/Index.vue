<template lang="pug">
  el-dialog(title="查看图片", :visible.sync="dialogVisible", width="50%", @open="openCallback")
    div.box
      div.divWrapper
        img.full-width(v-show="img", :src="img", :style="imgStyle")
</template>

<script>
  export default {
    data () {
      return {
        dialogVisible: false,
        img: '',
        divWidth: -1
      }
    },
    computed: {
      imgStyle () {
        if (this.divWidth !== -1) {
          return {
            'max-height': `${(document.documentElement.clientHeight || document.body.clientHeight) - 150}px`,
            'max-width': `${this.divWidth}px`
          }
        } else {
          return {
            'max-height': `${(document.documentElement.clientHeight || document.body.clientHeight) - 150}px`
          }
        }
      }
    },
    methods: {
      show (imgUrl) {
        this.img = imgUrl
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      openCallback () {
        this.$nextTick(() => {
          this.divWidth = this.$refs.divWrapper.clientWidth
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box {
    width: 100%;
    overflow-x: auto;
  }

  .full-width {
    display: block;
    margin: 0 auto;
  }

</style>
