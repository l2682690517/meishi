<template lang="pug">
  el-date-picker(
  start-placeholder="开始日期",
  end-placeholder="结束日期",
  ref="timePicker",
  :picker-options="timePickerOptions",
  v-model="timeRange",
  type="datetimerange",
  align="right",
  :editable="false",
  :clearable="true",
  @change="_timePickerChange"
  )
</template>

<script>
  export default {
    props: {
      value: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    components: {},
    data () {
      return {
        timeRange: [],
        timePickerOptions: {
          shortcuts: [{
            text: '最近三天',
            onClick (picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 2)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近七天',
            onClick (picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 6)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const start = new Date(Date.now() - 3600 * 1000 * 24 * 29)
              const end = new Date()
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    computed: {},
    watch: {
      value: function (v) {
        let times = []
        if (v instanceof Array) {
          if (v.length === 2) {
            let st = new Date(v[0])
            let et = new Date(v[1])
            if (st && et) {
              times = [st, et]
            }
          }
        }
        console.log('toolbar', times)
        this.timeRange = times
      }
    },
    methods: {
      _timePickerChange (val) {
        if (val) {
          let date1 = Date.parse(val[0])
          let date2 = Date.parse(val[1])
          this.$emit('input', [date1, date2])
        } else {
          this.$emit('input', [])
        }
      },
      reset () {
        this.timeRange = []
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
