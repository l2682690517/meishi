import Axios from 'axios'
import { dateFormat } from 'src/util/format'
import Vue from 'vue'

export const getProfitList = (tenantId, params) => {
  return Axios.get(`/tenant/t/${tenantId}/bill`, {
    params: Vue.R.mapObjIndexed((value, key) => {
      if (key === 'start' || key === 'end') {
        return dateFormat(value, 'YYYY-MM')
      }
      return value
    })(params || {})
  })
}

export const getProfitOverview = (tenantId) => {
  return Axios.get(`/tenant/t/${tenantId}/bill/overview`)
}
