<template lang="pug">
  div
    el-dialog(title="选择商品组", :visible.sync="dialogVisible", :width="commonDialogWidth")
      div.noProduct(v-if="dataList.length ===0 && !loading")
        div.text 还没有商品组
        div.button-box
          el-button(@click="goToProductGroup") 去创建
      div(v-else, v-loading="loading")
        el-table(:data="dataList",border, @row-click="handleRowClick", :rowClassName="getRowClassName", :showHeader="false")
          el-table-column(prop="name", label="名称")
</template>

<script>
  import * as ProductGroupApi from 'src/api/productGroup'
  import { commonDialogWidth } from 'src/config/el'

  export default {
    data () {
      return {
        loading: false,
        dialogVisible: false,
        dataList: [],
        ...$global.$mapConst({
          'commonDialogWidth': commonDialogWidth
        }),
        disabledItems: []
      }
    },
    methods: {
      goToProductGroup () {
        this.$router.push({
          name: 'ProductGroup'
        })
      },
      show (disabledItems) {
        this.getProductGroupList()
        this.disabledItems = disabledItems || []
        this.dialogVisible = true
      },
      hide () {
        this.dialogVisible = false
      },
      handleRowClick (row) {
        if (this.disabledItems.indexOf(row.id) !== -1) {
          return
        }
        this.$emit('choose', [row])
        this.hide()
      },
      async getProductGroupList () {
        try {
          this.loading = true
          const res = await ProductGroupApi.getList(this.$tid)
          this.dataList = res.data.data ? res.data.data : []
        } finally {
          this.loading = false
        }
      },
      getRowClassName (props, id) {
        if (this.disabledItems.indexOf(props.row.id) !== -1) {
          return 'el-not-allowed-row'
        } else {
          return 'el-pointer-row'
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  .noProduct {
    height: 200px;
    .text {
      width: 160px;
      font-size: 26px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 50px;
    }
    .button-box {
      width: 85px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 50px;
    }
  }
</style>


