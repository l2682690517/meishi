<template lang="pug">
  div.list-wrapper
    el-table(:data="dataList.data", :border="true", row-key="id")
      el-table-column(label="订单信息", width="")
        template(slot-scope="scope")
          div.info-wrapper
            div.head-wrapper(v-if="scope.row.show_order_items && scope.row.show_order_items.length > 0")
              div.icon-wrapper(v-lazy:background-image="showImg(scope.row.show_order_items[0].product_img_res)")
            div.desc-wrapper
              div 订单号：
                span {{scope.row.code}}
                span &nbsp;&nbsp;{{scope.row | orderFullStatus}}&nbsp;&nbsp;
                span {{scope.row.ct | datetime}}下单
              div.name-wrapper
                div.left {{scope.row.show_order_items[0].product_name}}
                div.right {{scope.row.prod_count}}件商品
              div
                span 实付{{scope.row.total_price | price}}
                span.txt-ex(v-if="scope.row.status === 3  && scope.row.order_item_count > 1 && scope.row.dev_item_count > 0") {{scope.row.dev_item_count}}/{{scope.row.order_item_count}}已发货
                span.txt-ex.txt-blod.refund-color(v-if="scope.row.refunding_count") {{scope.row.refunding_count}}件退款中
      el-table-column(label="买家信息" width="334")
        template(slot-scope="scope")
          div(v-if="scope.row.order_addr")
            div {{scope.row.order_addr.name}} {{scope.row.order_addr.mobile}}
            div(v-if="scope.row.remark") 留言:{{scope.row.remark}}
      el-table-column(label="操作" width="119")
        template(slot-scope="scope")
          div.control-wrapper
            el-button.btn.text-code(size="mini", type="primary", @click="goToDetail(scope.row.id)", plain) 订单详情
            el-button.btn(v-if="scope.row.dev_count > 0", style="width: 80px", size="mini" type="primary", @click="openExpress(scope.row.id)", plain) {{scope.row.dev_count}}件快递
            el-tooltip(placement="bottom", effect="light", v-if="scope.row.remind && scope.row.remind.length > 0 && scope.row.status === 3")
              div(slot="content")
                div(v-for="remind in scope.row.remind", :key="remind.id") {{remind.ct | datetime}}
              el-button.btn(type="text", size="mini") {{scope.row.remind.length}}次催单
    express-dialog(ref="dlgExpress")
</template>

<script>
  import ExpressDialog from 'src/ui/order/express/Index'

  export default {
    components: {
      ExpressDialog
    },
    props: {
      dataList: {}
    },
    data () {
      return {
        loading: false
      }
    },
    computed: {},
    methods: {
      goToDetail (id) {
        this.$router.push({
          name: 'OrderDetail',
          params: {
            id: id
          }
        })
      },
      showImg (row) {
        if (row) {
          return row.url
        }
        return ''
      },
      openExpress (id) {
        this.$refs.dlgExpress.show(id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-wrapper {
    margin-top: 20px;

    .info-wrapper {
      display: flex;

      .head-wrapper {
        width: 70px;
        margin-right: 10px;
      }
      .icon-wrapper {
        width: 60px;
        height: 60px;
        background-size: cover;
        margin: 5px 10px 5px 0px;
      }

      .desc-wrapper {
        flex: 1;

        .name-wrapper {
          display: flex;

          .left {
            flex: 1;
            max-height: 28px;
            width: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
          }
          .right {
            padding-left: 5px;
          }
        }
      }
    }

    .remark {
      position: relative;
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 5px;
      border: solid 1px #ddd;
      border-radius: 5px;
      min-height: 50px;

      .title {
        font-size: 14px;
      }

      .edit {
        position: absolute;
        right: 10px;
        bottom: 0;
      }
    }

    .pager-wrapper {
      text-align: center;
    }

    .txt-ex {
      margin-left: 10px;
    }

    .txt-blod {
      font-size: 14px;
      font-weight: bold;
    }

    .refund-color {
      color: $color-danger;
    }

    .text-code {
      color: $color-primary;
      cursor: pointer;
    }
  }

  .control-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .btn {
      margin-bottom: 5px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .bottom-tool-bar {
    margin-top: 15px;
  }
</style>
