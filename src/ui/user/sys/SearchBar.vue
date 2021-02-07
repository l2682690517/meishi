<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item()
        el-input.tiny-x-el-input(v-model="formData.user", placeholder="名称/手机号")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import { DateRangePicker } from '@baibao/zeratul'

  export default {
    components: {
      DateRangePicker
    },
    props: {
      queryParams: {}
    },
    data () {
      return {
        // region query
        formData: {
          user: ''
        },
        // endregion
        initialData: null
      }
    },
    computed: {},
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
        this.R_.updateWithObj(this.formData, this.queryParams)
      }
    },
    async mounted () {
      await this.initData()
      this.convertQueryParamsToForm()
    }
  }
</script>

<style lang="scss" scoped>
</style>
