<template lang="pug">
  div
    smart-table.large-el-table(ref="skuTable", :dataList="skus", @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      smart-table-column(label="规格", prop="spec")
      smart-table-column(label="售价", width="120px")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`sell_price{props.index}`", :prop="'skus.' + props.index", :rules="formRules.sell_price")
            el-input(v-model.trim="props.row.sell_price")
      smart-table-column(label="建议售价")
        div(slot-scope="props") ¥{{ props.row.suggest_price }}
      smart-table-column(label="利润")
        div(slot-scope="props") {{ showProfit(props.row) }}
      smart-table-column(label="库存", prop="stock")
      smart-table-column(label="商品编码", width="180px")
        div.sku-code(slot-scope="props") {{ props.row.code }}
      smart-table-column(label="图片", width="80px")
        div.sku-image.img-cover(slot-scope="props", v-if="props.row.image", v-lazy:background-image="props.row.image.url")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import {SmartTable, SmartTableColumn} from '@baibao/zeratul'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      SmartTableColumn
    },
    props: {
      skus: {
        type: Array,
        required: true
      },
      supplyPrice: {
        type: String,
        required: true
      },
      stPrice: {
        type: String,
        required: true
      }
    },
    data () {
      const sellPriceValidator = (rule, value, callback) => {
        if (!this.R_.isPrice(value.sell_price)) {
          callback(new Error('不正确的价格'))
          return
        }
        const sellPrice = this.R_.convertYuanToFen(value.sell_price)
        if (this.R_.isPrice(this.supplyPrice)) {
          const sp = this.R_.convertYuanToFen(this.supplyPrice)
          if (sellPrice < sp) {
            callback(new Error('不能小于供货价'))
            return
          }
        }
        if (this.R_.isPrice(this.stPrice)) {
          const st = this.R_.convertYuanToFen(this.stPrice)
          if (sellPrice > st) {
            callback(new Error('不能大于划线价'))
            return
          }
        }
        if (this.R_.isPrice(value.suggest_price)) {
          const suggest = this.R_.convertYuanToFen(value.suggest_price)
          if (sellPrice < suggest) {
            callback(new Error('不能小于建议售价'))
            return
          }
        }
        callback()
      }
      return {
        formRules: {
          sell_price: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: sellPriceValidator, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      showProfit (sku) {
        if (!this.R_.isPrice(this.supplyPrice)) {
          return '-'
        }
        if (!this.R_.isPrice(sku.sell_price)) {
          return '-'
        }
        const sp = this.R_.convertYuanToFen(this.supplyPrice)
        const sell = this.R_.convertYuanToFen(sku.sell_price)
        if (sell < sp) {
          return '-'
        } else {
          return '¥' + this.R_.convertFenToYuan(sell - sp)
        }
      },
      handleDragChange (dataList) {
        this.$emit('update:skus', arguments[0])
        this.dispatch('ElFormItem', 'el.form.change', [dataList])
      },
      async handleDragEnd () {
        await this.$nextTick()
        for (const i in this.skus) {
          const item = this.skus[i]
          Object.keys(item).forEach(async (k) => {
            await this.$nextTick()
            this.$refs[`${k}${i}`] && this.$refs[`${k}${i}`].clearValidate()
          })
        }
      },
      async handleAddSku () {
        this.skus.push(
          {
            id: 0,
            spec: '',
            sell_price: '',
            stock: '',
            code: '',
            image: {
              id: 0,
              url: '',
              width: 0,
              height: 0
            }
          }
        )
        await this.$nextTick()
        this.dispatch('ElFormItem', 'el.form.change', [this.skus])
      },
      async handleDelSku (index) {
        this.skus.splice(index, 1)
        await this.$nextTick()
        this.dispatch('ElFormItem', 'el.form.change', [this.skus])
      },
      isUpdating () {
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sku-image {
    width: 50px;
    height: 50px;
  }

  .skus-table {
    width: 700px;
  }
  .sku-code {
    white-space: nowrap;
    overflow: auto;
  }
</style>
