<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item(label="首次访问：")
        date-picker(:start.sync="getStartTime", :end.sync="getEndTime", placeholder="选择日期")
      el-form-item(label="")
        el-input(v-model.trim="queryParams.key", placeholder="用户昵称/ID")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

  export default {
    props: {
      queryParams: {
        type: Object,
        default: () => {
          return {
            key: '',
            start: new Date().getTime(),
            end: new Date().getTime()
          }
        }
      }
    },
    components: {DatePicker},
    data () {
      return {
        defaultDate: [],
        tenantList: [],
        initialDataL: null,
        selectLoading: false
      }
    },
    computed: {
      getStartTime: {
        get () {
          return parseInt(this.queryParams.start)
        },
        set (val) {
          this.queryParams.start = val
        }
      },
      getEndTime: {
        get () {
          return parseInt(this.queryParams.end)
        },
        set (val) {
          this.queryParams.end = val
        }
      }
    },
    watch: {
    },
    methods: {
      initData () {
        this.initialData = this.R.clone(this.queryParams)
      },
      handleSearch () {
        this.$emit('submit', this.queryParams)
      },
      handleReset () {
        this.queryParams = this.R.clone(this.initialData)
        this.defaultDate = []
        this.$emit('submit', this.queryParams)
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>


<style lang="scss" scoped>

</style>
