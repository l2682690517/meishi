<template lang="pug">
  div.item
    div {{title}}
      span.time.txt-info {{data.ct | datetime}}
    div(v-if="data.status === 5") {{data.amount|price}}将由微信原路退给买家
    div.txt-info {{data.txt}}
    div(v-if="data.sys_remark")
      div.txt-info.txt-info-tip 以下内容消费者不可见
      div {{tenantUserName}}{{data.sys_remark}}
    div(v-if="data.status === 5")
      div 退货数量：{{data.total}}
    div.txt-info(v-if="data.tp === 1") 申请退款 {{data.amount | price}}
    div.images
      div(v-for="imgItem in data.images", v-lazy:background-image="imgItem.url", @click="previewImage(imgItem)")
    image-preview-dialog(ref="dlgPreview")

</template>

<script>
  import * as RefundStatus from 'src/constants/refund'
  import ImagePreviewDialog from 'src/ui/common/image-preview-dialog/Index'

  export default {
    components: {
      ImagePreviewDialog
    },
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
      }
    },
    computed: {
      title () {
        if (this.data.status === RefundStatus.STATUS_CANCELED) {
          return '买家：退款已撤销'
        } else if (this.data.status === RefundStatus.STATUS_AGREED) {
          return '客服：退款成功'
        } else if (this.data.status === RefundStatus.STATUS_REJECTED) {
          return '客服：退款已撤销'
        } else {
          if (this.data.tp === 1) {
            if (this.data.parent_id === 0) {
              return '买家申请退款'
            } else {
              return '买家：申请已修改'
            }
          } else if (this.data.tp === 2) {
            return '客服回复'
          } else {
            return ''
          }
        }
      },
      tenantUserName () {
        if (this.data.tenant_user && this.data.tenant_user.name) {
          return `${this.data.tenant_user.name}: `
        }
        return ''
      }
    },
    methods: {
      previewImage (imgItem) {
        this.$refs.dlgPreview.show(imgItem.url)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .item {
    margin-bottom: 10px;
    padding: 10px;
    border: solid 1px #efefef;

    & > div {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

  }

  .time {
    margin-left: 10px;
  }

  .txt-info {
    /*margin-top: 8px;*/
    color: #4a4a4a;
    font-size: 14px;
  }

    .images {
    & > div {
      display: inline-block;
      width: 100px;
      height: 100px;
      margin-right: 8px;
      background-size: cover;
      background-image: url("http://temp.im/754x754");
    }
  }
  .txt-info-tip {
    font-size: 12px;
    padding: 15px 0px;
  }
</style>
