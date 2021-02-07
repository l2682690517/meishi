<template lang="pug">
  div
    el-dialog(title="商品组详情", :visible.sync="dialogVisible", width="680px")
      div.grid(v-loading="loading")
        <!--el-checkbox-group(v-model="checkedItemIdsProxy")-->
          div.list
            div.item(v-for="item in productGroup.products || []")
              <!--div.ck(v-if="mode === $options.MODE_MULTIPLE")-->
                <!--el-checkbox(:label="item.id", :disabled="disableProduct(item)") &nbsp;-->
              div.icon.img-cover(v-lazy:background-image="showCover(item)")
              div.text.single-line
                div.name.single-line {{item.name}}
                div.price {{item | productPrice}}
        el-button(type="primary", @click="edit", size="small", plain) 编辑
</template>

<script>
  import * as ProductGroupApi from 'src/api/productGroup'
  import { showCover } from 'src/service/product/index'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        productGroup: {},
        dialogVisible: false,
        prompt: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      edit () {
        if (this.prompt) {
          this.$confirm('离开当前页面，放弃未保存内容？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              name: 'EditGroup',
              params: {
                id: this.productGroup.id
              }
            })
          }).catch()
        } else {
          this.$router.push({
            name: 'EditGroup',
            params: {
              id: this.productGroup.id
            }
          })
        }
      },
      show (gid, prompt) {
        this.dialogVisible = true
        this.prompt = prompt
        this.getProductGroupDetail(gid)
      },
      async getProductGroupDetail (gid) {
        try {
          this.loading = true
          let res = await ProductGroupApi.getItem(this.$tid, gid)
          this.productGroup = res.data
        } finally {
          this.loading = false
        }
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
      cursor: default;

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
</style>

<style lang="scss">


  .hide-discount-checkbox {
    visibility: hidden;
  }
</style>
