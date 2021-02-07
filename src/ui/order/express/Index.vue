<template lang="pug">
  el-dialog(title="物流信息", :visible.sync="dialogVisible", width="50%", @open="openCallback", @close="closeCallback", v-loading="loading")
    div.content-wrapper
      div(v-show="!loading")
        el-collapse(accordion, v-model="activeName")
          el-collapse-item(v-for="(item, index) in expressDataList", :title="collapseTitle(index)", :name="expressUnique(item)", :key="expressUnique(item)")
            item(:express.sync="item")
            div.product-wrapper
              div.traffic-product-wrapper(v-for="product in getOiList(item)")
                product-item(:orderItem.sync="product")
</template>

<script>
  import {getExpress} from 'src/api/order'
  import ProductItem from './ProductItem'
  import Item from './Item'

  export default {
    components: {
      ProductItem,
      Item
    },
    props: {},
    data () {
      return {
        loading: false,
        oid: 0,
        dialogVisible: false,
        expressDataList: [],
        activeName: ''
      }
    },
    computed: {
    },
    methods: {
      getOiList (item) {
        return item.show_order_items.slice(0, 2)
      },
      show (oid, devName, devNo) {
        this.oid = oid
        if (!devName || !devNo) {
          this.activeName = ''
        } else {
          this.activeName = `${devNo}_${devName}`
        }
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      async openCallback () {
        this.loading = true
        try {
          this.expressDataList = []
          const res = await getExpress(this.$tid, this.oid)
          console.log(res)
          this.expressDataList = res.data
          console.log(this.expressDataList)
          if (this.expressDataList.length > 0 && !this.activeName) {
            this.activeName = this.expressUnique(this.expressDataList[0])
          }
          this.loading = false
        } catch (e) {
          this.loading = false
          this.$myErrorHandler.handle(this, e)
        }
      },
      closeCallback () {
      },
      collapseTitle (index) {
        return '包裹' + (index + 1)
      },
      expressUnique (item) {
        return `${item.num}_${item.name}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-wrapper {
    min-height: 300px;
  }

  .product-wrapper {
    box-sizing: border-box;
    margin: 0 5px 5px 5px;
    padding-top: 15px;
    background-color: #ffffff;
    border-bottom: solid 1px #f1f1f1;

    .traffic-product-wrapper {
      display: inline-flex;
      width: 45%;
    }
  }
</style>
