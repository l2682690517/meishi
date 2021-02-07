<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item
        el-radio-group(v-model="formData.tp")
          el-radio-button(:label="0") 全部
          el-radio-button(:label="3") 平台供货
          el-radio-button(:label="2") 自营商品
      el-form-item
        div()
          el-checkbox(v-model="off_shelves") 显示已下架
      el-form-item.input
        el-input(v-model.trim="formData.text", placeholder="商品名称/编码")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  export default {
    props: {
      queryParams: {}
    },
    components: {},
    data () {
      return {
        formData: {
          tp: 0,
          status: 1,
          text: ''
        },
        initialData: null
      }
    },
    computed: {
      off_shelves: {
        get () {
          return this.formData.status === 0
        },
        set (val) {
          if (val) {
            this.formData.status = 0
          } else {
            this.formData.status = 1
          }
        }
      }
    },
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      async initData () {
        this.initialData = this.R.clone(this.formData)
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = {
          status: this.queryParams.status,
          tp: this.queryParams.tp,
          text: this.queryParams.text
        }
      }
    },
    mounted () {
      this.initData()
      this.convertQueryParamsToForm()
    }
  }
</script>


<style lang="scss" scoped>

</style>
