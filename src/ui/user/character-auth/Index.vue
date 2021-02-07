<template lang="pug">
  div
    div.head
      el-button(type="primary", @click="handelCreate") 添加
    div
      el-table.large-el-table(:data="dataList", border, v-loading="loading")
        el-table-column(label="角色")
          template(slot-scope="scope")
            div.name {{scope.row.name}}
            div.description {{scope.row.description}}
        el-table-column(label="人数", prop="user_count")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(v-if="!scope.row.super", type="primary", plain, size="mini", @click="handleEdit(scope.row)") 编辑
            el-button(v-if="!scope.row.super", type="danger", plain, size="mini", @click="handleDelete(scope.row)") 删除
</template>

<script>
  import * as CharacterAuthApi from 'src/api/character-auth'

  export default {
    props: {},
    components: {},
    data () {
      return {
        dataList: [],
        loading: false
      }
    },
    computed: {},
    watch: {},
    methods: {
      handelCreate () {
        this.$router.push({
          name: 'CreateCharacter'
        })
      },
      handleEdit (row) {
        this.$router.push({
          name: 'EditCharacter',
          params: {
            id: row.id
          }
        })
      },
      async handleDelete (row) {
        if (row.user_count !== 0) {
          this.$message({
            message: '使用人数不为0，不可删除',
            type: 'error'
          })
          return
        }
        this.loading = true
        try {
          await CharacterAuthApi.deleteTenantRole(row.id)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getRoleList()
        } finally {
          this.loading = false
        }
      },
      async getRoleList () {
        this.loading = true
        try {
          let res = await CharacterAuthApi.getTenantRoleList()
          this.dataList = res.data.data
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getRoleList()
    }
  }
</script>


<style lang="scss" scoped>
  .head {
    margin-bottom: 20px;
  }
  .description {
    font-size: 8px;
    color: #909399;
  }
  .name {
    font-size: 15px;
  }
</style>
