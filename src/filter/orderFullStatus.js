import * as OrderUtil from '../service/order/orderUtil'
const orderStatus = {
  1: '待付款',
  2: '已关闭',
  3: '待发货',
  4: '已发货',
  5: '已完成',
  6: '已退款'
}

export default order => {
  if (order.status === 3 && OrderUtil.checkPartDeliver(order)) {
    return '部分发货'
  }
  return orderStatus[order.status]
}
