<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item()
        el-select(v-model="formData.category_id", filterable, clearable, placeholder="选择分类")
          el-option-group(v-for!="parentItem in allCategories", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for!="childItem in parentItem.children", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item(label="")
        el-select(v-model="formData.tags", placeholder="请选择标签", multiple)
          el-option-group(v-for="parentItem in allTags", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for="childItem in parentItem.items", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item(label="")
        el-input(v-model="formData.text", placeholder="商品名/编码")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="submit") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import * as TagApi from 'src/api/tag'
  import * as CategoryApi from 'src/api/category'

  export default {
    props: {
      queryParams: {}
    },
    data () {
      return {
        formData: {
          category_id: '',
          text: '',
          tags: []
        },
        selectLoading: false,
        allCategories: [],
        allTags: [],
        initialData: null
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
        return Promise.all([CategoryApi.getList(this.$tid), TagApi.getList(this.$tid)]).then(([resCategory, resTag]) => {
          this.allCategories = resCategory.data.data || []
          this.allTags = resTag.data.data || []
        })
      },
      submit () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = this.R_.updateWithObj(this.formData, this.queryParams)
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
