import { date, datetime, monthtime, minutetime } from './datetime'
import { commonPrice, friendlyPrice } from './price'
import orderFullStatus from './orderFullStatus'
import skuCurrentPrice from './skuCurrentPrice'
import { productPrice, productProfit, productSuggestPrice, productSuggestProfit, productStatusControl } from './product'
import deliveryStatus from './deliveryStatus'

export default {}.install = function (Vue, options) {
  let filters = [
    {name: 'date', filter: date},
    {name: 'datetime', filter: datetime},
    {name: 'price', filter: commonPrice},
    {name: 'friendlyPrice', filter: friendlyPrice},
    {name: 'monthtime', filter: monthtime},
    {name: 'minutetime', filter: minutetime},
    {name: 'productPrice', filter: productPrice},
    {name: 'productProfit', filter: productProfit},
    {name: 'productSuggestPrice', filter: productSuggestPrice},
    {name: 'productSuggestProfit', filter: productSuggestProfit},
    {name: 'orderFullStatus', filter: orderFullStatus},
    {name: 'skuCurrentPrice', filter: skuCurrentPrice},
    {name: 'productStatusControl', filter: productStatusControl},
    {name: 'deliveryStatus', filter: deliveryStatus}
  ]
  for (let i = 0; i < filters.length; i++) {
    let filer = filters[i]
    Vue.filter(filer.name, filer.filter)
  }
}
