<template lang="pug">
  div.grid
    el-checkbox-group(v-model="newIds")
      div.list
        div.item(v-for="item in allItems")
          div.ck
            el-checkbox(:label="item.id", @change="itemCheckChanged(item)") &nbsp
          div.icon-wrapper
            img.img-responsive(:src="getImg(item)", width="60", height="60")
          div.desc
            span.title {{item.name}}
            span.price {{item.min_price | price}}～{{item.max_price | price}}
    div
    div(style="margin-top: 10px;")
      el-button.icon-el-button(size="small", @click="cancel") 取&nbsp消
      el-button.icon-el-button(size="small", type="primary", @click="submit") 确&nbsp定
</template>

<script>
  import * as R from 'ramda'

  export default {
    props: {
      allItems: {
        type: Array,
        default: () => []
      },
      originalItems: {
        type: Array,
        default: () => []
      }
    },
    components: {},
    data () {
      return {
        newItems: [],
        newIds: []
      }
    },
    computed: {},
    watch: {
      originalItems () {
        this.getData()
      }
    },
    methods: {
      getImg (row) {
        if (row.cover !== null) {
          return row.cover.url
        } else if (row.head[0].url !== null) {
          return row.head[0].url
        } else {
          return ''
        }
      },

      cancel () {
        this.$emit('hide')
      },
      submit () {
        this.$emit('submitItemsAndIds', this.newItems)
        this.$emit('hide')
      },
      itemCheckChanged (product) {
        const indexItem = this.newItems.findIndex((item) => {
          return product.id === item.id
        })
        if (indexItem === -1) {
          this.newItems.push(product)
        }
        if (indexItem !== -1) {
          this.newItems.splice(indexItem, 1)
        }
      },
      getData () {
        this.newIds = []
        this.newItems = []
        let id = this.originalItems.map((item) => {
          return item.id
        })
        this.newIds = id
        this.newItems = R.clone(this.originalItems)
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>


<style lang="scss" scoped>
  @import '../../../assets/scss/el';

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      display: flex;
      position: relative;
      flex: 0 0 47%;
      overflow: hidden;
      text-overflow: ellipsis;
      align-items: center;
      border: solid 1px #ddd;
      margin-top: 8px;
      margin-bottom: 8px;
      padding-left: 5px;
      cursor: pointer;

      .icon-wrapper {
        flex: 0 0 60px;
        width: 60px;
        height: 60px;
        margin-left: 10px;
        .mg-responsive {
          width: 60px;
          height: 60px;
        }
      }

      .desc {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 5px;
        padding-right: 5px;
        .title {
          display: block;
          font-size: 14px;
          line-height: 18px;
        }

        .price {
          display: block;
          margin-top: 5px;
          font-size: 14px;
          line-height: 18px;
        }

      }

    }
  }


</style>
