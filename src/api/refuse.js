import Axios from 'axios'
import qs from 'qs'
import { date } from '../filter/datetime'

export const refuseList = (tid, params) => {
  let myParams = {}
  if (parseInt(params.start_time) > 0) {
    myParams.start_time = date(parseInt(params.start_time))
  } else {
    myParams.start_time = ''
  }
  if (parseInt(params.end_time) > 0) {
    myParams.end_time = date(parseInt(params.end_time))
  } else {
    myParams.end_time = ''
  }
  myParams.prod = params.prod
  myParams.prod_tp = params.prod_tp
  myParams.refund_status = params.refund_status
  myParams.page = params.page
  myParams.limit = params.limit
  return Axios.get(`/tenant/t/${tid}/oi/refund`, {params: myParams})
}

export const agree = (tid, id, amount, txt, total, remark) => {
  return Axios.post(`/tenant/t/${tid}/oi/s/${id}/agree`,
    qs.stringify({txt: txt, amount: amount, total: total, remark: remark}))
}

export const reject = (tid, id, txt, remark) => {
  return Axios.post(`/tenant/t/${tid}/oi/s/${id}/refuse`,
    qs.stringify({txt: txt, remark: remark}))
}

export const reply = (tid, id, txt, remark) => {
  return Axios.post(`/tenant/t/${tid}/oi/s/${id}/reply`,
    qs.stringify({txt: txt, remark: remark}))
}

export const refuseCount = (tid) => {
  return Axios.get(`/tenant/t/${tid}/oi/refund/count`)
}

export const refundToWx = (tid, id) => {
  return Axios.post(`/tenant/t/${tid}/oi/s/${id}/refund/to/weixin`)
}
