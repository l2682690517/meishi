export const getUserShowData = (data) => {
  let resData = {}
  if (data.user) {
    resData.id = data.user.id ? data.user.id : ''
    resData.logo = data.user.logo ? data.user.logo : ''
    resData.nickname = data.user.nickname ? data.user.nickname : ''
    resData.tenantNickName = data.user.tenant && data.user.tenant.nick_name ? data.user.tenant.nick_name : ''
    resData.mobile = data.user.mobile ? data.user.mobile : ''
    resData.ct = data.user.ct ? data.user.ct : ''
  } else {
    resData.id = ''
    resData.logo = ''
    resData.nickname = ''
    resData.tenantNickName = ''
    resData.mobile = ''
    resData.ct = ''
  }
  return resData
}
export const getUserOrderDataList = (data) => {
  if (data.order_stat) {
    let item = {
      recent_pay_tick: data.order_stat.recent_pay_tick ? data.order_stat.recent_pay_tick : '',
      total_amount: data.order_stat.total_amount ? data.order_stat.total_amount : '',
      total_count: data.order_stat.total_count ? data.order_stat.total_count : ''
    }
    return [item]
  } else {
    return []
  }
}
