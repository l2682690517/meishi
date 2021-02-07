<template lang="pug">
  el-date-picker(:type="type", range-separator="至", start-placeholder="开始日期", end-placeholder="结束日期", :picker-options="pickerOptions", align="right", unlink-panels, v-bind!="$attrs", v-on!="$listeners",  v-model="chooseDateProxy")
</template>

<script>
  export default {
    props: {
      start: {
        type: Number,
        required: true
      },
      end: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        default: 'daterange'
      }
    },
    data () {
      return {
        chooseDate: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    computed: {
      chooseDateProxy: {
        get () {
          return this.chooseDate
        },
        set (val) {
          this.chooseDate = val
          if (this.chooseDate && this.chooseDate.length === 2) {
            this.$emit('update:start', val[0].getTime())
            this.$emit('update:end', val[1].getTime())
          } else {
            this.$emit('update:start', 0)
            this.$emit('update:end', 0)
          }
        }
      }
    },
    watch: {
      start (newVal) {
        this.refreshChooseDate()
      },
      end (newVal) {
        this.refreshChooseDate()
      }
    },
    methods: {
      refreshChooseDate () {
        if (!this.start || !this.end) {
          this.chooseDate = []
        } else {
          this.chooseDate = [this.start, this.end]
        }
      }
    },
    created () {
      this.refreshChooseDate()
    }
  }
</script>
