<template lang="pug">
  div
    component(:is="getComp")
</template>

<script>
  import SelfSupportForm from './self-support/Form.vue'
  import SelfChooseForm from './self-choose/Form.vue'

  export default {
    props: {},
    components: {
      SelfSupportForm,
      SelfChooseForm
    },
    data () {
      return {}
    },
    computed: {
      getComp () {
        if (this.$route.query.choose) {
          return 'SelfChooseForm'
        } else {
          return 'SelfSupportForm'
        }
      }
    },
    created () {
      this.$parent.updateBreadcrumb([
        {
          text: '商品管理',
          to: {
            name: 'ProductManagement'
          }
        },
        {
          text: this.$route.query.choose ? '编辑平台供货商品' : '编辑自营商品'
        }
      ])
    }
  }
</script>


<style lang="scss" scoped>

</style>
