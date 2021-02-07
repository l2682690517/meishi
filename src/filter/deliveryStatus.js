const deliveryStatus = {
  '1': '在途中',
  '2': '派件中',
  '3': '已签收',
  '4': '派送失败（拒签等）'
}

export default status => {
  return deliveryStatus[status]
}
