<template lang="pug">
  div(v-loading="loading")
    div.content(v-if="order.id")
      div.section(style="width=100%;")
        status(:order.sync="order")
      div.section
        recipient(:order.sync="order")
      div.section
        info(:order.sync="order", @refresh="refreshOrder")
</template>

<script>
  import Status from './Status'
  import Recipient from './Recipient'
  import Info from './Info'
  import {orderDetail} from '../../../api/order'

  export default {
    components: {
      Status,
      Recipient,
      Info
    },
    data () {
      return {
        loading: false,
        order: {}
      }
    },
    computed: {},
    methods: {
      async refreshOrder () {
        this.loading = true
        try {
          const res = await orderDetail(this.$tid, this.$route.params.id)
          this.order = res.data
          this.loading = false
        } catch (ex) {
          this.loading = false
        }
      }
    },
    async mounted () {
      this.refreshOrder()
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    vertical-align: middle;
    font-size: 14px;

    .section {
      padding-bottom: 8px;
      margin-bottom: 0px;
      border-bottom: solid 1px #efefef;
    }
  }
</style>
