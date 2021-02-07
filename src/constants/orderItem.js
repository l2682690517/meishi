export const STATUS_WAIT_PAY = 1000 // 待付款
export const STATUS_CANCELED = 2000 // 已取消
export const STATUS_PAID = 3000 // 已支付/待发货
export const STATUS_DELIVERED = 4000 // 已发货/待收货
export const STATUS_COMPLETED = 5000 // 已收货/已完成
export const STATUS_REFUNDED = 6000 // 已退款

export const REFUND_STATUS_NO_APPLY = 0 // 未申请退款
export const REFUND_STATUS_WAIT_ADMIN = 1 // 等待管理员处理
export const REFUND_STATUS_WAIT_CUSTOMER = 2 // 等待消费者处理
export const REFUND_STATUS_CANCELED = 3 // 取消退款
export const REFUND_STATUS_REJECTED = 4 // 拒绝退款
export const REFUND_STATUS_COMPLETED = 5 // 退款成功
export const REFUND_STATUS_REFUND_LATER = 6 // 正在退款
