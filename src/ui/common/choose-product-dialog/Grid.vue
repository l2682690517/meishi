<template lang="pug">
  div.grid
    el-checkbox-group(v-model="checkedItemIdsProxy")
      div.list
        div.item(:class!="{'not-allowed':disableProduct(item)}", v-for="item in allItems || []", @click="handleItemClick(item)")
          div.ck(v-if="mode === $options.MODE_MULTIPLE")
            el-checkbox(:label="item.id", :disabled="disableProduct(item)") &nbsp;
          div.icon.img-cover(v-lazy:background-image="showCover(item)")
          div.text.single-line
            div.name.single-line {{item.name}}
            div.price {{item | productPrice}}
</template>

<script>
  import { showCover } from 'src/service/product/index'

  const MODE_SINGLE = 0
  const MODE_MULTIPLE = 1

  export default {
    MODE_SINGLE,
    MODE_MULTIPLE,
    props: {
      allItems: {
        type: Array,
        default: () => []
      },
      disabledItems: {
        type: Array,
        default: () => []
      },
      mode: {
        type: Number,
        default: MODE_SINGLE
      }
    },
    data () {
      return {
        checkedItems: [],
        checkedItemIds: []
      }
    },
    computed: {
      checkedItemIdsProxy: {
        get () {
          return this.checkedItemIds
        },
        set (newValue) {
          if (newValue.length > this.checkedItemIds.length) {
            const diff = this.R.difference(newValue)(this.checkedItemIds)
            this.R.forEach((item) => {
              this.addCheckProduct(item)
            })(diff || [])
          } else {
            const diff = this.R.difference(this.checkedItemIds)(newValue)
            this.R.forEach((item) => {
              this.removeCheckProduct(item)
            })(diff || [])
          }
          this.checkedItemIds = newValue
        }
      },

      allItemsId () {
        return this.R.map((item) => {
          return item.id
        })(this.allItems || [])
      },
      disabledItemsId () {
        return this.disabledItems || []
        // 只传ID先
//        return this.R.map((item) => {
//          return item.id
//        })(this.disabledItems || [])
      }
    },
    methods: {
      addCheckProduct (id) {
        const newItem = this.R.find((product) => {
          return product.id === id
        })(this.allItems || [])
        if (newItem) {
          this.checkedItems.push(newItem)
        }
      },
      removeCheckProduct (id) {
        const i = this.R.findIndex((product) => {
          return product.id === id
        })(this.checkedItems)
        if (i !== -1) {
          this.checkedItems.splice(i, 1)
        }
      },
      setCheckedItems (items) {
        this.checkedItemIds = this.R.intersection(this.R.map((item) => {
          return item.id
        })(items))(this.allItemsId)
        this.checkedItems = this.R.filter((item) => {
          return this.checkedItemIds.indexOf(item.id) !== -1
        })(this.allItems)
      },
      disableProduct (product) {
        return this.R.indexOf(product.id)(this.disabledItemsId) !== -1
      },
      handleItemClick (item) {
        if (this.disableProduct(item)) {
          return
        }
        if (this.mode === MODE_MULTIPLE) {
          const i = this.R.indexOf(item.id)(this.checkedItemIds)
          if (i === -1) {
            this.addCheckProduct(item.id)
            this.checkedItemIds.push(item.id)
          } else {
            this.removeCheckProduct(item.id)
            this.checkedItemIds.splice(i, 1)
          }
        }
        this.$emit('item-click', item)
      },
      ...$global.$mapMethods({'showCover': showCover})
    }
  }
</script>

<style scoped lang="scss">

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item:hover {
      background-color: #eef1f6;
    }
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
      padding-left: 8px;
      padding-top: 8px;
      padding-bottom: 8px;
      cursor: pointer;

      &.not-allowed {
        cursor: not-allowed;
        opacity: 0.5;

        &:hover {
          background-color: #ffffff;
        }
      }

      .icon {
        width: 50px;
        height: 50px;
        margin-right: 8px;
      }

      .text {
        position: relative;
        height: 50px;
        flex: 1;
        min-width: 0;

        .name {
          color: $font-color-common;
          font-size: $font-size-content;
          line-height: 50px;
          min-width: 0;
          width: 100%;

        }
        .price {
          position: absolute;
          bottom: 0;
          color: $font-color-secondary;
          font-size: $font-size-desc;
          line-height: 1.2;
        }
      }

    }
  }

</style>

<style lang="scss">


  .hide-discount-checkbox {
    visibility: hidden;
  }
</style>
