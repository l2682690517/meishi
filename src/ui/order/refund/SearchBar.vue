<template lang="pug">
  el-form(:inline="true")
    el-form-item
      el-select(v-model="form.refund_status", placeholder="请选择")
        el-option(v-for="item in refundStatus", :key="item.value", :label="item.label", :value="item.value")
    el-form-item
      el-select(v-model="form.prod_tp", placeholder="请选择")
        el-option(v-for="item in productType", :key="item.value", :label="item.label", :value="item.value")
    el-form-item(label="下单")
      date-tool-bar(:start.sync="form.start_time", :end.sync="form.end_time")
    el-form-item
      div.input-div
        el-input(placeholder="商品名/订单号", v-model="form.prod", width="400px")
    el-form-item
      el-button(type="primary", icon="el-icon-search", @click="search") 搜索

</template>

<script>
  import DateToolBar from 'src/ui/common/date-range-picker/Index'

  export default {
    components: {
      DateToolBar
    },
    props: {
      queryParams: {}
    },
    data () {
      return {
        form: {
          refund_status: 0,
          prod_tp: 0,
          prod: '',
          start_time: 0,
          end_time: 0
        },
        refundStatus: [{
          value: 0,
          label: '全部退款状态'
        }, {
          value: 1,
          label: '等待客服处理退款'
        }, {
          value: 2,
          label: '请买家处理退款'
        }, {
          value: 6,
          label: '系统退款中'
        }
        ],
        productType: [{
          value: 0,
          label: '全部商品'
        }, {
          value: 2,
          label: '店铺自营'
        }, {
          value: 3,
          label: '平台提供'
        }
        ]
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      search () {
        this.$emit('search', this.form)
      },
      convertQueryParamsToForm () {
        this.form.refund_status = this.queryParams.refund_status
        this.form.prod_tp = this.queryParams.prod_tp
        this.form.prod = this.queryParams.prod
        this.form.start_time = this.queryParams.start_time
        this.form.end_time = this.queryParams.end_time
      }
    },
    mounted () {
      this.convertQueryParamsToForm()
    }
  }
</script>

<style lang="scss" scoped>
  .input-div {
    width: 400px;
  }
</style>
