<template lang="pug">
  div.express-item
    div.content(v-if="express && express.num")
      div.info
        template(v-if="express.deliverystatus !== '0'") 物流状态：{{express.deliverystatus | deliveryStatus}}
        div 承运公司：{{express.name}}
        div 运单编号：{{express.num}}
      div.timeline(v-if="express.deliverystatus !== '0' && express.list")
        div.icon(:class="{rotate: showMore}", @click="showMore = !showMore")
        div.item(v-for="(item, index) in express.list", v-if="index === 0 || showMore")
          div {{item.status}}
          div {{item.time | datetime}}
      div.timeline(v-else) 暂无物流信息
    div.empty(v-else) 暂无物流信息
</template>

<script>
  export default {
    props: {
      express: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        showMore: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .express-item {

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: 1px solid #dcdcdc;
      padding: 30px 24px;
    }
  }

  .info {
    line-height: 1.5;
    padding: 8px;
  }

  .timeline {
    background: #f1f1f5;
    border: 1px solid #dcdcdc;
    border-radius: 10px;
    padding: 15px;
    line-height: 1.5;
    position: relative;

    .icon {
      width: 50px;
      height: 50px;
      background: url("~@/assets/image/more.png") no-repeat center / 8px 12px;
      position: absolute;
      right: 5px;
      top: 0;
      transform: rotate(90deg);
      transition: all 0.3s;
      &.rotate {
        transform: rotate(-90deg);
      }
    }

    .item {
      padding: 5px 0;
    }
  }
</style>
