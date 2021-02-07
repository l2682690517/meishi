<template lang="pug">
  div(v-loading="loading")
    div
      el-button(size="medium", type="primary", @click="createItem", icon="el-icon-plus") 添加
    div
      el-table.list-el-table(:data ="dataList", border)
        el-table-column(label="商品组", prop="name")
        el-table-column(label="商品数量")
          template(slot-scope="scope")
            div {{scope.row.pc}}
        el-table-column(label="操作", width="170px")
          template(slot-scope="scope")
            el-button(type="primary", size="small", plain, @click="editItem(scope.row)") 编辑
            el-button(type="danger", size="small", plain, @click="deleteItem(scope.row)") 删除
</template>

<script>
  import * as ProductGroupApi from 'src/api/productGroup'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dataList: []
      }
    },
    methods: {
      deleteItem (row) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true
          try {
            await ProductGroupApi.deleteListItem(this.$tid, row.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } finally {
            this.loading = false
          }
        })
      },
      createItem () {
        this.$router.push({
          name: 'CreateGroup'
        })
      },
      editItem (row) {
        this.$router.push({
          name: 'EditGroup',
          params: {
            id: row.id
          }
        })
      },
      async getList () {
        try {
          this.loading = true
          let res = await ProductGroupApi.getList(this.$tid)
          this.dataList = res.data.data || []
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getList()
    }
  }
</script>


<style lang="scss" scoped>

</style>
