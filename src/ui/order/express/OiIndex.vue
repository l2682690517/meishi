<template lang="pug">
  el-dialog(title="物流信息", :visible.sync="dialogVisible", width="50%", @open="openCallback", @close="closeCallback", v-loading="loading")
    div.content-wrapper
      div(v-show="!loading")
        item(:express="expressData")
</template>

<script>
  import Item from './Item'
  import {getOiExpress} from 'src/api/order'

  export default {
    components: {
      Item
    },
    data () {
      return {
        oiid: 0,
        loading: false,
        dialogVisible: false,
        expressData: {}
      }
    },
    computed: {},
    methods: {
      show (oiid) {
        this.oiid = oiid
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      async openCallback () {
        this.loading = true
        try {
          this.expressData = {}
          const res = await getOiExpress(this.$tid, this.oiid)
          this.expressData = res.data.data
          this.loading = false
        } catch (e) {
          this.loading = false
        }
      },
      closeCallback () {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-wrapper {
    min-height: 200px;
  }
</style>
