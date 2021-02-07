<template lang="pug">
  div.refunding-bar
    div.export
      el-button(@click="refunding") 退款中 {{refundCount}}
</template>

<script>
  import {refuseCount} from 'src/api/refuse'

  export default {
    components: {},
    props: {},
    data () {
      return {
        refundCount: 0
      }
    },
    computed: {},
    methods: {
      refunding () {
        this.$router.push({
          name: 'OrderRefund'
        })
      }
    },
    async mounted () {
      try {
        const resCount = await refuseCount(this.$tid)
        this.refundCount = resCount.data.count
      } catch (e) {
        console.log('获取退款数量失败')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .refunding-bar {
    height: 30px;
    margin-bottom: 20px;

    .export {
      display: inline-block;
      float: right;
    }
  }
</style>
