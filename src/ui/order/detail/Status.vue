<template lang="pug">
  div
    div.status
      span.section-title 订单状态:
      span.section-margin {{order | orderFullStatus}}
      span.section-title 订单编号:
      span.section-margin {{order.code}}
      span.section-title 用户:
      span.section-btn(@click="clickUser") {{order.user.nickname}}
</template>

<script>
  export default {
    components: {},
    props: {
      order: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {}
    },
    computed: {},
    methods: {
      clickUser () {
        this.$router.push({
          name: 'UserDetail',
          params: {
            uid: this.order.user.id,
            id: this.order.id
          },
          query: {
            order: true
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .status {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .section-title {
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
  }

  .section-margin {
    margin-right: 15px;
    color: #303133;
  }

  .section-btn {
    color: $color-primary;
    cursor: pointer;
  }
</style>
