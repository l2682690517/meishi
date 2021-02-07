import {convertFenToYuan} from '../util/moneyUtil'

export default function (sku) {
  return `¥${convertFenToYuan(sku.sell_price)}`
}
